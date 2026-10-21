const fs = require('fs');
const path = require('path');

// Purge stale .next/dev Turbopack cache so removed virtual modules (e.g. next/font/google) never persist
const nextDevCacheDir = path.join(__dirname, '..', '.next', 'dev');
try {
  if (fs.existsSync(nextDevCacheDir)) {
    fs.rmSync(nextDevCacheDir, { recursive: true, force: true });
    console.log('Cleared stale .next/dev cache.');
  }
} catch (err) {
  console.warn('Could not clean .next/dev cache:', err.message);
}

const cjsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'router-utils',
  'block-cross-site-dev.js'
);

const esmPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'esm',
  'server',
  'lib',
  'router-utils',
  'block-cross-site-dev.js'
);

try {
  if (fs.existsSync(cjsPath)) {
    fs.writeFileSync(
      cjsPath,
      `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "blockCrossSiteDEV", {
  enumerable: true,
  get: function() {
    return blockCrossSiteDEV;
  }
});
const blockCrossSiteDEV = () => false;
`,
      'utf8'
    );
  }

  if (fs.existsSync(esmPath)) {
    fs.writeFileSync(
      esmPath,
      `export const blockCrossSiteDEV = () => false;\n`,
      'utf8'
    );
  }
} catch (err) {
  console.warn('Could not patch block-cross-site-dev:', err.message);
}
