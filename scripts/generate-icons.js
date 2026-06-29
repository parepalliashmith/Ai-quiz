// Generates AIQUIZ PNG icons (no image libs needed) — indigo gradient + white check.
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUT, { recursive: true });

function lerp(a, b, t) { return a + (b - a) * t; }

// distance from point to segment (x1,y1)-(x2,y2)
function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx, cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function buildPNG(size, maskable) {
  const W = size, H = size;
  const data = Buffer.alloc(H * (1 + W * 4)); // filter byte + RGBA per row
  const pad = maskable ? size * 0.12 : size * 0.0; // safe zone padding for maskable
  const r = size * (maskable ? 0.5 : 0.22); // corner radius (full circle if maskable)
  // check geometry (relative to inner box)
  const ix = pad, iy = pad, iw = W - pad * 2, ih = H - pad * 2;
  const c1x = ix + iw * 0.28, c1y = iy + ih * 0.56;
  const c2x = ix + iw * 0.44, c2y = iy + ih * 0.70;
  const c3x = ix + iw * 0.74, c3y = iy + ih * 0.34;
  const stroke = size * 0.075;

  for (let y = 0; y < H; y++) {
    const rowStart = y * (1 + W * 4);
    data[rowStart] = 0; // filter: none
    for (let x = 0; x < W; x++) {
      const o = rowStart + 1 + x * 4;
      // rounded-rect / circle alpha for background
      let inside = true;
      if (maskable) {
        inside = Math.hypot(x - W / 2, y - H / 2) <= r;
      } else {
        const dx = Math.max(Math.abs(x - W / 2) - (W / 2 - r), 0);
        const dy = Math.max(Math.abs(y - H / 2) - (H / 2 - r), 0);
        inside = Math.hypot(dx, dy) <= r;
      }
      // diagonal gradient indigo -> violet
      const tg = (x + y) / (W + H);
      let R = Math.round(lerp(79, 124, tg));   // 4f46e5 -> 7c6cff
      let G = Math.round(lerp(70, 108, tg));
      let B = Math.round(lerp(229, 255, tg));
      let A = inside ? 255 : 0;
      // white check on top
      const dCheck = Math.min(
        distToSeg(x, y, c1x, c1y, c2x, c2y),
        distToSeg(x, y, c2x, c2y, c3x, c3y)
      );
      if (inside && dCheck <= stroke) { R = 255; G = 255; B = 255; }
      data[o] = R; data[o + 1] = G; data[o + 2] = B; data[o + 3] = A;
    }
  }
  return encodePNG(W, H, data);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(W, H, raw) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const jobs = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, false],
];
for (const [name, size, mask] of jobs) {
  fs.writeFileSync(path.join(OUT, name), buildPNG(size, mask));
  console.log('wrote', name);
}
console.log('done');
