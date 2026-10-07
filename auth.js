// Authentication for AIQUIZ.
// - Verifies the Google Sign-In ID token (the "credential" the GIS button returns).
// - Issues our own lightweight, signed session token so the client can call the
//   API without re-verifying with Google each time.
// No external libraries: verification is a simple fetch to Google's tokeninfo
// endpoint, and our session token is an HMAC-signed JSON blob.

const crypto = require('crypto');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
// Secret used to sign our own session tokens. Falls back to a random per-boot
// secret if not set (sessions then reset on each deploy, which is fine).
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_DAYS = 30;

const configured = !!GOOGLE_CLIENT_ID;

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlJSON(obj) {
  return b64url(JSON.stringify(obj));
}
function sign(data) {
  return b64url(crypto.createHmac('sha256', AUTH_SECRET).update(data).digest());
}

// Make a session token for a verified user: "<payload>.<signature>".
function issueToken(user) {
  const payload = {
    sub: user.id,
    name: user.name || '',
    picture: user.picture || '',
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const body = b64urlJSON(payload);
  return `${body}.${sign(body)}`;
}

// Verify one of our session tokens and return its payload, or null.
function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  // Constant-time compare to avoid timing leaks.
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
  } catch {
    return null;
  }
  if (!payload || !payload.sub || !payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

// Verify a Google ID token (the GIS credential) with Google and return the
// profile { id, email, name, picture } — or throw.
async function verifyGoogleCredential(credential) {
  if (!configured) throw new Error('Google sign-in is not configured on the server.');
  if (!credential) throw new Error('Missing Google credential.');
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential));
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error_description || 'Google token verification failed.');
  // The token must have been issued for OUR app and by Google.
  if (data.aud !== GOOGLE_CLIENT_ID) throw new Error('Google token audience mismatch.');
  if (!/accounts\.google\.com$/.test(data.iss || '') && data.iss !== 'accounts.google.com') {
    throw new Error('Unexpected token issuer.');
  }
  if (data.exp && Date.now() / 1000 > Number(data.exp)) throw new Error('Google token expired.');
  if (!data.sub) throw new Error('Google token has no subject.');
  return {
    id: data.sub,
    email: data.email || '',
    name: data.name || (data.email ? data.email.split('@')[0] : 'Student'),
    picture: data.picture || '',
  };
}

// Express middleware: reads "Authorization: Bearer <token>" and sets req.auth.
function authMiddleware(req, _res, next) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  req.auth = m ? verifyToken(m[1]) : null;
  next();
}

module.exports = {
  configured,
  clientId: GOOGLE_CLIENT_ID,
  issueToken,
  verifyToken,
  verifyGoogleCredential,
  authMiddleware,
};
