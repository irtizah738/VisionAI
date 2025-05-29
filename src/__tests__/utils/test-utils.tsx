import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

// Create a custom render function that includes providers
function render(ui: React.ReactElement, { session = null, ...options } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Create mock session data
export const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
    role: 'USER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Create mock API key data
export const mockApiKey = {
  id: 'test-key-id',
  key: 'visionai_test123',
  name: 'Test API Key',
  userId: 'test-user-id',
  createdAt: new Date().toISOString(),
  lastUsed: null,
  enabled: true,
};

// Create mock social account data
export const mockSocialAccount = {
  id: 'test-social-id',
  platform: 'twitter',
  accountId: '123456',
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  userId: 'test-user-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Re-export everything
export * from '@testing-library/react';
export { render }; 