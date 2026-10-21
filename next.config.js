const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' } : {}),
  allowedDevOrigins: [
    '*.run.app',
    '**.run.app',
    '*.asia-east1.run.app',
    'ais-dev-z7j4uvpz5hjrfj2l6w5pue-644889006515.asia-east1.run.app',
    'ais-pre-z7j4uvpz5hjrfj2l6w5pue-644889006515.asia-east1.run.app',
    '*.google.com',
    '**.google.com',
    '*.googleusercontent.com',
    '**.googleusercontent.com',
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withNextIntl(config);