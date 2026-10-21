/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { proxy, config } from '@/proxy';
import { createMockRequest } from './utils/api-test-utils';

describe('App Router Proxy', () => {
  describe('Public Paths and Assets', () => {
    it.each([
      '/login',
      '/signup',
      '/auth',
      '/api/auth',
      '/',
      '/about',
      '/contact',
    ])('allows public route: %s', async (path) => {
      const req = createMockRequest({
        method: 'GET',
        url: `http://localhost:3000${path}`,
      });

      const response = await proxy(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(401);
    });

    it('bypasses static next assets and images', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/_next/static/chunks/main.js',
      });

      const response = await proxy(req);
      expect(response).toBeInstanceOf(NextResponse);
    });
  });

  describe('Proxy Route Matcher Config', () => {
    it('defines a valid path matcher excluding static assets', () => {
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
      expect(config.matcher[0]).toContain('_next/static');
    });
  });
});