/**
 * @jest-environment node
 */
import { GET, PATCH, PUT } from '@/app/api/user/profile/route';
import { createMockRequest, parseJSON } from '../../utils/api-test-utils';

describe('Profile API', () => {
  describe('GET /api/user/profile', () => {
    it('returns the active user profile successfully', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data.user).toBeDefined();
      expect(data.user.name).toBeDefined();
    });
  });

  describe('PATCH /api/user/profile', () => {
    it('updates user profile and returns updated record', async () => {
      const req = createMockRequest({
        method: 'PATCH',
        body: {
          name: 'Chief Visionary Officer',
          company: 'VisionAI Global Corp',
        },
      });

      const response = await PATCH(req);
      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data.user).toBeDefined();
      expect(data.user.name).toBe('Chief Visionary Officer');
    });

    it('supports PUT method identically', async () => {
      const req = createMockRequest({
        method: 'PUT',
        body: {
          bio: 'AI-First Multi-Platform Orchestration Lead',
        },
      });

      const response = await PUT(req);
      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data.user.bio).toBe('AI-First Multi-Platform Orchestration Lead');
    });
  });
});