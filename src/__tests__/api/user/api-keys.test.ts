import { GET, POST } from '@/app/api/user/api-keys/route';
import { DELETE } from '@/app/api/user/api-keys/[id]/route';
import { prisma } from '@/lib/prisma';
import {
  createMockRequest,
  setupAuthSession,
  clearAuthSession,
  parseJSON,
  createRouteParams,
} from '../../utils/api-test-utils';
import { mockSession, mockApiKey } from '../../utils/test-utils';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    apiKey: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('API Keys Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/api-keys', () => {
    it('returns 401 when not authenticated', async () => {
      clearAuthSession();
      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(401);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('returns user API keys when authenticated', async () => {
      setupAuthSession();
      const mockApiKeys = [mockApiKey];
      (prisma.apiKey.findMany as jest.Mock).mockResolvedValue(mockApiKeys);

      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data).toEqual({ apiKeys: mockApiKeys });
    });

    it('handles database errors', async () => {
      setupAuthSession();
      (prisma.apiKey.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const req = createMockRequest({ method: 'GET' });
      const response = await GET(req);

      expect(response.status).toBe(500);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/user/api-keys', () => {
    const createData = {
      name: 'Test API Key',
    };

    it('returns 401 when not authenticated', async () => {
      clearAuthSession();
      const req = createMockRequest({
        method: 'POST',
        body: createData,
      });
      const response = await POST(req);

      expect(response.status).toBe(401);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('creates new API key when authenticated', async () => {
      setupAuthSession();
      const newApiKey = {
        ...mockApiKey,
        name: createData.name,
      };

      (prisma.apiKey.create as jest.Mock).mockResolvedValue(newApiKey);

      const req = createMockRequest({
        method: 'POST',
        body: createData,
      });
      const response = await POST(req);

      expect(response.status).toBe(201);
      const data = await parseJSON(response);
      expect(data).toEqual(newApiKey);
      expect(prisma.apiKey.create).toHaveBeenCalledWith({
        data: {
          name: createData.name,
          userId: mockSession.user.id,
          key: expect.any(String),
        },
      });
    });

    it('validates request data', async () => {
      setupAuthSession();
      const req = createMockRequest({
        method: 'POST',
        body: {
          name: '', // Invalid: empty name
        },
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
      const data = await parseJSON(response);
      expect(data.error).toBe('Invalid request data');
    });
  });

  describe('DELETE /api/user/api-keys/[id]', () => {
    it('returns 401 when not authenticated', async () => {
      clearAuthSession();
      const req = createMockRequest({ method: 'DELETE' });
      const response = await DELETE(req, createRouteParams({ id: mockApiKey.id }));

      expect(response.status).toBe(401);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('revokes API key when authenticated', async () => {
      setupAuthSession();
      (prisma.apiKey.findUnique as jest.Mock).mockResolvedValue(mockApiKey);
      (prisma.apiKey.update as jest.Mock).mockResolvedValue({
        ...mockApiKey,
        enabled: false,
      });

      const req = createMockRequest({ method: 'DELETE' });
      const response = await DELETE(req, createRouteParams({ id: mockApiKey.id }));

      expect(response.status).toBe(204);
    });

    it('returns 404 when API key not found', async () => {
      setupAuthSession();
      (prisma.apiKey.findUnique as jest.Mock).mockResolvedValue(null);

      const req = createMockRequest({ method: 'DELETE' });
      const response = await DELETE(req, createRouteParams({ id: 'non-existent' }));

      expect(response.status).toBe(404);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'API key not found' });
    });

    it('prevents unauthorized access to other users keys', async () => {
      setupAuthSession();
      (prisma.apiKey.findUnique as jest.Mock).mockResolvedValue({
        ...mockApiKey,
        userId: 'other-user',
      });

      const req = createMockRequest({ method: 'DELETE' });
      const response = await DELETE(req, createRouteParams({ id: mockApiKey.id }));

      expect(response.status).toBe(403);
      const data = await parseJSON(response);
      expect(data).toEqual({ error: 'Unauthorized' });
    });
  });
}); 