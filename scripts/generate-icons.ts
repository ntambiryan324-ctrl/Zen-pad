import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf: Buffer): number {
  let table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crcBuf]);
}

function generatePng(width: number, height: number, isMaskable: boolean = false): Buffer {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.48 : width * 0.42;
  const innerIconRadius = width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: Indigo to Violet gradient
      const gradT = (x + y) / (width + height);
      let r = Math.round(79 + gradT * (147 - 79)); // #4f46e5 to #9333ea
      let g = Math.round(70 + gradT * (51 - 70));
      let b = Math.round(229 + gradT * (234 - 229));
      let a = 255;

      if (!isMaskable) {
        // Squircle / rounded box
        const sqDist = Math.pow(Math.abs(dx) / (width * 0.42), 4) + Math.pow(Math.abs(dy) / (height * 0.42), 4);
        if (sqDist > 1.05) {
          a = 0;
        } else if (sqDist > 0.95) {
          a = Math.round(255 * (1 - (sqDist - 0.95) / 0.1));
        }
      }

      // Drawing a sleek notebook/tablet & stylus icon in the center
      const inPadX = Math.abs(dx) < width * 0.22 && Math.abs(dy) < height * 0.28;
      const inPadBorder = Math.abs(dx) < width * 0.20 && Math.abs(dy) < height * 0.26;
      const inLines = inPadBorder && Math.abs(dx) < width * 0.14 && (Math.abs(dy + height * 0.08) < 3 || Math.abs(dy) < 3 || Math.abs(dy - height * 0.08) < 3);
      const inSparkle = Math.abs(dx - width * 0.15) + Math.abs(dy + height * 0.18) < width * 0.06;

      if (a > 0) {
        if (inSparkle) {
          r = 255; g = 230; b = 100; // Golden touch star
        } else if (inLines) {
          r = 165; g = 180; b = 252; // Soft indigo line
        } else if (inPadX && !inPadBorder) {
          r = 255; g = 255; b = 255; // White tablet outline
        } else if (inPadBorder) {
          r = Math.min(255, r + 35);
          g = Math.min(255, g + 30);
          b = Math.min(255, b + 40);
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PNG icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(48, 48, false));

// Write SVG icon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  <rect x="116" y="96" width="280" height="320" rx="28" stroke="#ffffff" stroke-width="20" fill="rgba(255,255,255,0.08)"/>
  <line x1="166" y1="180" x2="346" y2="180" stroke="#c7d2fe" stroke-width="16" stroke-linecap="round"/>
  <line x1="166" y1="240" x2="310" y2="240" stroke="#c7d2fe" stroke-width="16" stroke-linecap="round"/>
  <line x1="166" y1="300" x2="260" y2="300" stroke="#c7d2fe" stroke-width="16" stroke-linecap="round"/>
  <circle cx="340" cy="310" r="28" fill="#fbbf24"/>
  <path d="M340 295 L340 325 M325 310 L355 310" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

console.log('Successfully generated all PWA icons!');
