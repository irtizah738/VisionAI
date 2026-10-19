import { NextResponse } from 'next/server';
import { middleware } from '@/middleware';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import { createMockRequest } from './utils/api-test-utils';

// Mock next-auth
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    apiKey: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe('Middleware', () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('Public Routes', () => {
    it.each([
      '/auth/signin',
      '/auth/signup',
      '/auth/forgot-password',
      '/api/auth/callback',
      '/',
      '/about',
      '/contact',
    ])('allows access to public route: %s', async (path) => {
      const req = createMockRequest({
        method: 'GET',
        url: `http://localhost:3000${path}`,
      });

      const response = await middleware(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('redirects to login when accessing protected route without session', async () => {
      (getToken as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/dashboard',
      });

      const response = await middleware(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(307); // Temporary redirect
      expect(response.headers.get('Location')).toMatch(/\/auth\/signin/);
    });

    it('allows access to protected route with valid session', async () => {
      (getToken as jest.Mock).mockResolvedValue({
        user: { id: 'test-user', role: 'USER' },
      });

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/dashboard',
      });

      const response = await middleware(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(401);
    });
  });

  describe('Role-Protected Routes', () => {
    it('blocks access to admin route for non-admin users', async () => {
      (getToken as jest.Mock).mockResolvedValue({
        user: { id: 'test-user', role: 'USER' },
      });

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/admin',
      });

      const response = await middleware(req);
      expect(response.status).toBe(403);
    });

    it('allows access to admin route for admin users', async () => {
      (getToken as jest.Mock).mockResolvedValue({
        user: { id: 'test-user', role: 'ADMIN' },
      });

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/admin',
      });

      const response = await middleware(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(403);
    });
  });

  describe('API Routes', () => {
    it('validates API key for API routes', async () => {
      const apiKey = 'test-api-key';
      mockPrisma.apiKey.findFirst.mockResolvedValue({
        id: 'key-id',
        userId: 'user-id',
        key: apiKey,
        name: 'Test Key',
        enabled: true,
        createdAt: new Date(),
        lastUsed: null,
      });

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/data',
        headers: {
          'x-api-key': apiKey,
        },
      });

      const response = await middleware(req);
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(401);
      expect(mockPrisma.apiKey.update).toHaveBeenCalled();
    });

    it('rejects invalid API key', async () => {
      mockPrisma.apiKey.findFirst.mockResolvedValue(null);

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/data',
        headers: {
          'x-api-key': 'invalid-key',
        },
      });

      const response = await middleware(req);
      expect(response.status).toBe(401);
    });

    it('rejects disabled API key', async () => {
      mockPrisma.apiKey.findFirst.mockResolvedValue({
        id: 'key-id',
        userId: 'user-id',
        key: 'test-api-key',
        name: 'Test Key',
        enabled: false,
        createdAt: new Date(),
        lastUsed: null,
      });

      const req = createMockRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/data',
        headers: {
          'x-api-key': 'test-api-key',
        },
      });

      const response = await middleware(req);
      expect(response.status).toBe(401);
    });
  });
}); 