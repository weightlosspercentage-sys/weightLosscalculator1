import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Generates an authoritative 1200x630 brand OpenGraph social sharing card
 * for Weight Loss Percentage (public/og-image.png).
 * Built with pure Node.js (Buffer + zlib) to guarantee 100% portable, reproducible builds.
 */

const WIDTH = 1200;
const HEIGHT = 630;

const stride = WIDTH * 4 + 1;
const raw = Buffer.alloc(HEIGHT * stride);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const idx = y * stride + 1 + x * 4;
  if (a === 255) {
    raw[idx] = r;
    raw[idx + 1] = g;
    raw[idx + 2] = b;
    raw[idx + 3] = 255;
  } else {
    const alpha = a / 255;
    const inv = 1 - alpha;
    raw[idx] = Math.round(r * alpha + raw[idx] * inv);
    raw[idx + 1] = Math.round(g * alpha + raw[idx + 1] * inv);
    raw[idx + 2] = Math.round(b * alpha + raw[idx + 2] * inv);
    raw[idx + 3] = 255;
  }
}

// Background
for (let y = 0; y < HEIGHT; y++) {
  raw[y * stride] = 0; // PNG filter type 0 (None)
  const ny = y / HEIGHT;
  for (let x = 0; x < WIDTH; x++) {
    let r = 10 + Math.round(6 * (1 - ny));
    let g = 15 + Math.round(8 * (1 - ny));
    let b = 28 + Math.round(14 * (1 - ny));

    // Glow near badge
    const dx = x - 200;
    const dy = y - 240;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 420) {
      const glow = Math.pow(1 - dist / 420, 2);
      r = Math.min(255, r + Math.round(glow * 16));
      g = Math.min(255, g + Math.round(glow * 60));
      b = Math.min(255, b + Math.round(glow * 70));
    }

    setPixel(x, y, r, g, b, 255);
  }
}

// Top accent bar: gradient from #0d9488 (teal) to #10b981 (emerald) to #6366f1 (indigo)
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const t = x / WIDTH;
    let r, g, b;
    if (t < 0.5) {
      const s = t / 0.5;
      r = Math.round(13 * (1 - s) + 16 * s);
      g = Math.round(148 * (1 - s) + 185 * s);
      b = Math.round(136 * (1 - s) + 129 * s);
    } else {
      const s = (t - 0.5) / 0.5;
      r = Math.round(16 * (1 - s) + 99 * s);
      g = Math.round(185 * (1 - s) + 102 * s);
      b = Math.round(129 * (1 - s) + 241 * s);
    }
    setPixel(x, y, r, g, b, 255);
  }
}

function drawCircle(cx, cy, radius, r, g, b, a = 255, fill = true, strokeWidth = 1) {
  const minX = Math.floor(cx - radius - strokeWidth - 2);
  const maxX = Math.ceil(cx + radius + strokeWidth + 2);
  const minY = Math.floor(cy - radius - strokeWidth - 2);
  const maxY = Math.ceil(cy + radius + strokeWidth + 2);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (fill) {
        if (d <= radius - 0.5) {
          setPixel(x, y, r, g, b, a);
        } else if (d < radius + 0.5) {
          const alpha = (radius + 0.5 - d) * a;
          setPixel(x, y, r, g, b, Math.round(alpha));
        }
      } else {
        const halfW = strokeWidth / 2;
        const distFromStroke = Math.abs(d - radius);
        if (distFromStroke <= halfW - 0.5) {
          setPixel(x, y, r, g, b, a);
        } else if (distFromStroke < halfW + 0.5) {
          const alpha = (halfW + 0.5 - distFromStroke) * a;
          setPixel(x, y, r, g, b, Math.round(alpha));
        }
      }
    }
  }
}

function drawLine(x1, y1, x2, y2, strokeWidth, r, g, b, a = 255) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len === 0) return;
  const dx = (x2 - x1) / len;
  const dy = (y2 - y1) / len;

  const minX = Math.floor(Math.min(x1, x2) - strokeWidth - 2);
  const maxX = Math.ceil(Math.max(x1, x2) + strokeWidth + 2);
  const minY = Math.floor(Math.min(y1, y2) - strokeWidth - 2);
  const maxY = Math.ceil(Math.max(y1, y2) + strokeWidth + 2);

  const halfW = strokeWidth / 2;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x - x1;
      const py = y - y1;
      const t = Math.max(0, Math.min(len, px * dx + py * dy));
      const nearX = x1 + t * dx;
      const nearY = y1 + t * dy;
      const dist = Math.hypot(x - nearX, y - nearY);

      if (dist <= halfW - 0.5) {
        setPixel(x, y, r, g, b, a);
      } else if (dist < halfW + 0.5) {
        const alpha = (halfW + 0.5 - dist) * a;
        setPixel(x, y, r, g, b, Math.round(alpha));
      }
    }
  }
}

function drawRoundRect(x, y, w, h, radius, r1, g1, b1, r2, g2, b2) {
  for (let py = y; py < y + h; py++) {
    const ty = (py - y) / h;
    const cr = Math.round(r1 * (1 - ty) + r2 * ty);
    const cg = Math.round(g1 * (1 - ty) + g2 * ty);
    const cb = Math.round(b1 * (1 - ty) + b2 * ty);

    for (let px = x; px < x + w; px++) {
      let d = 0;
      let inCorner = false;
      if (px < x + radius && py < y + radius) {
        d = Math.hypot(px - (x + radius), py - (y + radius));
        inCorner = true;
      } else if (px > x + w - radius && py < y + radius) {
        d = Math.hypot(px - (x + w - radius), py - (y + radius));
        inCorner = true;
      } else if (px < x + radius && py > y + h - radius) {
        d = Math.hypot(px - (x + radius), py - (y + h - radius));
        inCorner = true;
      } else if (px > x + w - radius && py > y + h - radius) {
        d = Math.hypot(px - (x + w - radius), py - (y + h - radius));
        inCorner = true;
      }

      if (!inCorner) {
        setPixel(px, py, cr, cg, cb, 255);
      } else if (d <= radius - 0.5) {
        setPixel(px, py, cr, cg, cb, 255);
      } else if (d < radius + 0.5) {
        const alpha = (radius + 0.5 - d) * 255;
        setPixel(px, py, cr, cg, cb, Math.round(alpha));
      }
    }
  }
}

// Outer container card
drawRoundRect(70, 60, 1060, 510, 28, 30, 41, 59, 15, 23, 42);
drawRoundRect(72, 62, 1056, 506, 26, 15, 23, 42, 11, 15, 25);

// Teal-Green Brand Badge: Position (120, 140), Size: 130x130, Radius: 28
drawRoundRect(120, 140, 130, 130, 28, 13, 148, 136, 5, 150, 105);

const badgeCx = 120 + 65;
const badgeCy = 140 + 65;
drawCircle(badgeCx - 24, badgeCy - 24, 12, 255, 255, 255, 255, false, 6);
drawCircle(badgeCx + 24, badgeCy + 24, 12, 255, 255, 255, 255, false, 6);
drawLine(badgeCx + 34, badgeCy - 34, badgeCx - 34, badgeCy + 34, 7, 255, 255, 255, 255);

const FONT_GLYPHS = {
  ' ': [],
  'A': [[0,7,2.5,0],[2.5,0,5,7],[0.8,4.5,4.2,4.5]],
  'B': [[0,0,0,7],[0,0,3.5,0],[3.5,0,4.5,1.5],[4.5,1.5,4.5,2],[4.5,2,3.5,3.5],[0,3.5,3.5,3.5],[3.5,3.5,5,4.8],[5,4.8,5,5.5],[5,5.5,3.5,7],[0,7,3.5,7]],
  'C': [[5,1.5,3.5,0],[3.5,0,1.5,0],[1.5,0,0,2],[0,2,0,5],[0,5,1.5,7],[1.5,7,3.5,7],[3.5,7,5,5.5]],
  'D': [[0,0,0,7],[0,0,3,0],[3,0,5,2],[5,2,5,5],[5,5,3,7],[0,7,3,7]],
  'E': [[0,0,0,7],[0,0,4.5,0],[0,3.5,3.5,3.5],[0,7,4.5,7]],
  'F': [[0,0,0,7],[0,0,4.5,0],[0,3.5,3.5,3.5]],
  'G': [[5,1.5,3.5,0],[3.5,0,1.5,0],[1.5,0,0,2],[0,2,0,5],[0,5,1.5,7],[1.5,7,3.5,7],[3.5,7,5,5.5],[5,5.5,5,3.5],[5,3.5,2.8,3.5]],
  'H': [[0,0,0,7],[5,0,5,7],[0,3.5,5,3.5]],
  'I': [[0,0,4,0],[2,0,2,7],[0,7,4,7]],
  'J': [[4,0,4,5.5],[4,5.5,2.5,7],[2.5,7,0.5,7],[0.5,7,0,5.5]],
  'K': [[0,0,0,7],[0,3.5,4.5,0],[0,3.5,4.8,7]],
  'L': [[0,0,0,7],[0,7,4.5,7]],
  'M': [[0,7,0,0],[0,0,2.5,3.5],[2.5,3.5,5,0],[5,0,5,7]],
  'N': [[0,7,0,0],[0,0,5,7],[5,7,5,0]],
  'O': [[1.5,0,3.5,0],[3.5,0,5,2],[5,2,5,5],[5,5,3.5,7],[3.5,7,1.5,7],[1.5,7,0,5],[0,5,0,2],[0,2,1.5,0]],
  'P': [[0,0,0,7],[0,0,3.5,0],[3.5,0,5,1.5],[5,1.5,5,2.5],[5,2.5,3.5,4],[0,4,3.5,4]],
  'Q': [[1.5,0,3.5,0],[3.5,0,5,2],[5,2,5,5],[5,5,3.5,7],[3.5,7,1.5,7],[1.5,7,0,5],[0,5,0,2],[0,2,1.5,0],[3,5,5.2,7.2]],
  'R': [[0,0,0,7],[0,0,3.5,0],[3.5,0,5,1.5],[5,1.5,5,2.5],[5,2.5,3.5,4],[0,4,3.5,4],[2.5,4,5,7]],
  'S': [[4.8,1.2,3.5,0],[3.5,0,1.5,0],[1.5,0,0,1.5],[0,1.5,0.5,3],[0.5,3,4.5,4],[4.5,4,5,5.5],[5,5.5,3.5,7],[3.5,7,1.2,7],[1.2,7,0.2,5.8]],
  'T': [[0,0,5,0],[2.5,0,2.5,7]],
  'U': [[0,0,0,5.5],[0,5.5,1.5,7],[1.5,7,3.5,7],[3.5,7,5,5.5],[5,5.5,5,0]],
  'V': [[0,0,2.5,7],[2.5,7,5,0]],
  'W': [[0,0,1.2,7],[1.2,7,2.5,3.2],[2.5,3.2,3.8,7],[3.8,7,5,0]],
  'X': [[0,0,5,7],[5,0,0,7]],
  'Y': [[0,0,2.5,3.5],[5,0,2.5,3.5],[2.5,3.5,2.5,7]],
  'Z': [[0,0,5,0],[5,0,0,7],[0,7,5,7]],
  '0': [[1.5,0,3.5,0],[3.5,0,5,1.8],[5,1.8,5,5.2],[5,5.2,3.5,7],[3.5,7,1.5,7],[1.5,7,0,5.2],[0,5.2,0,1.8],[0,1.8,1.5,0],[4,1.8,1,5.2]],
  '1': [[1,2,2.5,0],[2.5,0,2.5,7],[0.5,7,4.5,7]],
  '2': [[0,1.8,1.5,0],[1.5,0,3.5,0],[3.5,0,5,1.5],[5,1.5,5,3],[5,3,0,7],[0,7,5,7]],
  '3': [[0,0,5,0],[5,0,2.5,3],[2.5,3,3.8,3],[3.8,3,5,4.2],[5,4.2,5,5.5],[5,5.5,3.5,7],[3.5,7,0,7]],
  '4': [[3.5,7,3.5,0],[3.5,0,0,4.5],[0,4.5,5,4.5]],
  '5': [[5,0,0,0],[0,0,0,3],[0,3,3.5,3],[3.5,3,5,4.5],[5,4.5,5,5.5],[5,5.5,3.5,7],[3.5,7,0,7]],
  '6': [[3.5,0,1.5,0],[1.5,0,0,2],[0,2,0,5.5],[0,5.5,1.5,7],[1.5,7,3.5,7],[3.5,7,5,5.5],[5,5.5,5,4],[5,4,3.5,3],[3.5,3,0,3]],
  '7': [[0,0,5,0],[5,0,2,7]],
  '8': [[1.5,0,3.5,0],[3.5,0,5,1.5],[5,1.5,5,2.5],[5,2.5,3.5,3.5],[3.5,3.5,1.5,3.5],[1.5,3.5,0,2.5],[0,2.5,0,1.5],[0,1.5,1.5,0],[3.5,3.5,5,4.5],[5,4.5,5,5.5],[5,5.5,3.5,7],[3.5,7,1.5,7],[1.5,7,0,5.5],[0,5.5,0,4.5],[0,4.5,1.5,3.5]],
  '9': [[5,3.5,1.5,3.5],[1.5,3.5,0,2.5],[0,2.5,0,1.5],[0,1.5,1.5,0],[1.5,0,3.5,0],[3.5,0,5,1.5],[5,1.5,5,5.5],[5,5.5,3.5,7],[3.5,7,1.5,7]],
  '.': [[2,6.5,2.5,6.5]],
  ',': [[2.5,6,2,7.5]],
  '-': [[1,3.5,4,3.5]],
  '•': [[2,3.5,2.5,3.5]],
  '&': [[4.5,6.5,2.5,4],[2.5,4,3.5,2],[3.5,2,2.5,0.5],[2.5,0.5,1.5,1.5],[1.5,1.5,3,4],[3,4,0.5,6.5],[0.5,6.5,2.5,7],[2.5,7,4.8,5.2]],
  '%': [[1,1,2,1],[3.5,6,4.5,6],[4.5,0.5,0.5,6.5]],
  '/': [[4.5,0,0.5,7]]
};

function renderText(str, startX, startY, scale, strokeW, r, g, b, a = 255) {
  let curX = startX;
  const upper = str.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    if (ch === ' ') {
      curX += 4 * scale;
      continue;
    }
    const glyph = FONT_GLYPHS[ch] || FONT_GLYPHS[' '];
    for (const seg of glyph) {
      const [x1, y1, x2, y2] = seg;
      drawLine(
        curX + x1 * scale,
        startY + y1 * scale,
        curX + x2 * scale,
        startY + y2 * scale,
        strokeW,
        r,
        g,
        b,
        a
      );
    }
    curX += 6.5 * scale;
  }
}

// Main Title
renderText('WEIGHT LOSS', 280, 150, 7.5, 4.5, 255, 255, 255, 255);
renderText('PERCENTAGE', 280, 210, 7.5, 4.5, 20, 184, 166, 255);

// Subtitle
renderText('CLINICAL HEALTH & WEIGHT LOSS CALCULATORS', 280, 280, 3.0, 2.0, 148, 163, 184, 255);

// Horizontal separator line
drawLine(120, 325, 1080, 325, 1.5, 51, 65, 85, 180);

// Value Proposition Pills
function drawPill(x, y, w, h, text, badgeR, badgeG, badgeB) {
  drawRoundRect(x, y, w, h, h / 2, badgeR, badgeG, badgeB, badgeR, badgeG, badgeB);
  drawRoundRect(x + 1.5, y + 1.5, w - 3, h - 3, (h - 3) / 2, 17, 24, 39, 17, 24, 39);
  renderText(text, x + 16, y + 9, 2.2, 1.7, 226, 232, 240, 255);
}

drawPill(120, 355, 275, 38, 'MEDICALLY REVIEWED', 13, 148, 136);
drawPill(410, 355, 310, 38, '100% PRIVATE IN BROWSER', 16, 185, 129);
drawPill(735, 355, 335, 38, 'EVIDENCE-BASED FORMULAS', 99, 102, 241);

// Bottom Clinical Trust Byline
renderText('MEDICALLY REVIEWED BY DR. REKHA KUMAR, M.D., M.S.', 120, 435, 2.3, 1.6, 203, 213, 225, 240);
renderText('WEILL CORNELL MEDICINE  •  WWW.WEIGHTLOSSPERCENTAGE.COM', 120, 470, 2.1, 1.5, 45, 212, 191, 230);

function createPngBuffer(width, height, rawData) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = zlib.crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc >>> 0, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pngBuffer = createPngBuffer(WIDTH, HEIGHT, raw);
const outPath = path.resolve('public/og-image.png');
fs.writeFileSync(outPath, pngBuffer);
console.log(`Successfully generated authoritative OG image: ${outPath} (${pngBuffer.length} bytes, 1200x630)`);
