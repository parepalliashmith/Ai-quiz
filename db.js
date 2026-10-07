// Database layer for AIQUIZ accounts + global leaderboard.
// Uses Postgres (Render free DB) via the DATABASE_URL env var.
// If DATABASE_URL is not set, everything here is disabled gracefully and the
// app keeps working in its original "personal / localStorage" mode.

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || '';
const enabled = !!DATABASE_URL;

let pool = null;
if (enabled) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    // Render's managed Postgres requires SSL; it uses a self-signed chain.
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
  });
  pool.on('error', (e) => console.error('[db] pool error:', e.message));
}

// Create the tables we need the first time the server boots. Safe to run every time.
async function init() {
  if (!enabled) {
    console.log('[db] DATABASE_URL not set — accounts & global leaderboard disabled.');
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,          -- Google "sub" (stable user id)
      email         TEXT,
      name          TEXT,
      picture       TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen     TIMESTAMPTZ NOT NULL DEFAULT now(),
      quizzes       INTEGER NOT NULL DEFAULT 0,
      total_correct INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      best_percent  INTEGER NOT NULL DEFAULT 0,
      points        INTEGER NOT NULL DEFAULT 0  -- cumulative score used for ranking
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id          BIGSERIAL PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic       TEXT,
      language    TEXT,
      difficulty  TEXT,
      correct     INTEGER NOT NULL,
      total       INTEGER NOT NULL,
      percent     INTEGER NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);`);
  console.log('[db] connected & schema ready.');
}

// Insert or update a user from their verified Google profile.
async function upsertUser({ id, email, name, picture }) {
  if (!enabled) return null;
  const { rows } = await pool.query(
    `INSERT INTO users (id, email, name, picture, last_seen)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (id) DO UPDATE
       SET email = EXCLUDED.email,
           name = EXCLUDED.name,
           picture = EXCLUDED.picture,
           last_seen = now()
     RETURNING *;`,
    [id, email || null, name || null, picture || null]
  );
  return rows[0];
}

async function getUser(id) {
  if (!enabled) return null;
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

// Record a finished quiz and roll the totals into the user row (one transaction).
async function recordResult(userId, { topic, language, difficulty, correct, total }) {
  if (!enabled) return null;
  const c = Math.max(0, parseInt(correct, 10) || 0);
  const tot = Math.max(1, parseInt(total, 10) || 1);
  const percent = Math.round((c / tot) * 100);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO results (user_id, topic, language, difficulty, correct, total, percent)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [userId, (topic || 'Quiz').slice(0, 120), language || null, difficulty || null, c, tot, percent]
    );
    const { rows } = await client.query(
      `UPDATE users SET
         quizzes = quizzes + 1,
         total_correct = total_correct + $2,
         total_questions = total_questions + $3,
         points = points + $2,
         best_percent = GREATEST(best_percent, $4),
         last_seen = now()
       WHERE id = $1
       RETURNING *;`,
      [userId, c, tot, percent]
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Global leaderboard — top players by cumulative points.
async function leaderboard(limit = 50) {
  if (!enabled) return [];
  const { rows } = await pool.query(
    `SELECT id, name, picture, quizzes, points, best_percent,
            CASE WHEN total_questions > 0
                 THEN ROUND(100.0 * total_correct / total_questions) ELSE 0 END AS accuracy
     FROM users
     WHERE quizzes > 0
     ORDER BY points DESC, best_percent DESC
     LIMIT $1;`,
    [Math.min(Math.max(limit, 1), 100)]
  );
  return rows;
}

// Where does a given user rank overall?
async function userRank(userId) {
  if (!enabled) return null;
  const { rows } = await pool.query(
    `SELECT COUNT(*) + 1 AS rank FROM users u
     WHERE u.quizzes > 0 AND u.points > (SELECT points FROM users WHERE id = $1);`,
    [userId]
  );
  return parseInt(rows[0]?.rank, 10) || null;
}

module.exports = {
  enabled,
  init,
  upsertUser,
  getUser,
  recordResult,
  leaderboard,
  userRank,
};
