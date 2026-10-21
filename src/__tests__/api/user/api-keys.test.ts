/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/user/api-keys/route';
import { parseJSON } from '../../utils/api-test-utils';

describe('API Keys Endpoints (Server-Managed Proxy)', () => {
  describe('GET /api/user/api-keys', () => {
    it('returns server-managed operational status', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data.mode).toBe('server_managed');
      expect(data.status).toBe('operational');
      expect(data.keys).toEqual([]);
    });
  });

  describe('POST /api/user/api-keys', () => {
    it('confirms server-managed AI credentials', async () => {
      const response = await POST();
      expect(response.status).toBe(200);
      const data = await parseJSON(response);
      expect(data.mode).toBe('server_managed');
      expect(data.status).toBe('operational');
    });
  });
});