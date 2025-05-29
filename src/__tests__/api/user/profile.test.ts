import { GET, PATCH } from '@/app/api/user/profile/route';
import { prisma } from '@/lib/prisma';
import {
  createMockRequest,
  setupAuthSession,
  clearAuthSession,
  parseJSON,
} from '../../utils/api-test-utils';
import { mockSession } from '../../utils/test-utils';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/profile', () => {
    it('returns 401 when not authenticated', async () => {
      clearAuthSession();
      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(401);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('returns user profile when authenticated', async () => {
      setupAuthSession();
      const mockUser = {
        id: mockSession.user.id,
        name: mockSession.user.name,
        email: mockSession.user.email,
        image: mockSession.user.image,
        role: 'USER',
        createdAt: new Date(),
        emailVerified: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data).toEqual({ user: mockUser });
    });

    it('returns 404 when user not found', async () => {
      setupAuthSession();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(404);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'User not found' });
    });
  });

  describe('PATCH /api/user/profile', () => {
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      image: 'https://example.com/new-avatar.jpg',
    };

    it('returns 401 when not authenticated', async () => {
      clearAuthSession();
      const req = createMockRequest({
        method: 'PATCH',
        body: updateData,
      });
      const response = await PATCH(req);

      expect(response.status).toBe(401);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('updates user profile when authenticated', async () => {
      setupAuthSession();
      const updatedUser = {
        ...mockSession.user,
        ...updateData,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const req = createMockRequest({
        method: 'PATCH',
        body: updateData,
      });
      const response = await PATCH(req);

      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data).toEqual({ user: updatedUser });
    });

    it('validates request data', async () => {
      setupAuthSession();
      const req = createMockRequest({
        method: 'PATCH',
        body: {
          name: '', // Invalid: too short
          email: 'invalid-email', // Invalid: not an email
        },
      });
      const response = await PATCH(req);

      expect(response.status).toBe(400);
      const data = await parseJSON(response);
      expect(data.error).toBe('Invalid request data');
      expect(data.details).toBeDefined();
    });

    it('prevents email conflicts', async () => {
      setupAuthSession();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'other-user',
        email: updateData.email,
      });

      const req = createMockRequest({
        method: 'PATCH',
        body: updateData,
      });
      const response = await PATCH(req);

      expect(response.status).toBe(400);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Email already in use' });
    });

    it('handles database errors', async () => {
      setupAuthSession();
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({
        method: 'PATCH',
        body: updateData,
      });
      const response = await PATCH(req);

      expect(response.status).toBe(500);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
}); 