const fs = require('fs');
const path = require('path');

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
