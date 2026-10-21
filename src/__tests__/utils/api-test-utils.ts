import { NextRequest } from 'next/server';

let currentSession: any = null;

export function setupAuthSession(session?: any) {
  currentSession = session || {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
    },
  };
}

export function clearAuthSession() {
  currentSession = null;
}

export function getCurrentSession() {
  return currentSession;
}

export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/test';
  const headers = new Headers(options.headers || {});
  
  if (options.body && typeof options.body === 'object') {
    headers.set('content-type', 'application/json');
  }

  const req = new NextRequest(new URL(url), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return req;
}

export async function parseJSON(response: Response): Promise<any> {
  return await response.json();
}

export function createRouteParams(params: Record<string, string>) {
  return { params: Promise.resolve(params) };
}