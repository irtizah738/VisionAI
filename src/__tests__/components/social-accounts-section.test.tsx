import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { SocialAccountsSection } from '@/app/(app)/settings/social-accounts-section';
import { mockSocialAccount } from '../utils/test-utils';
import { toast } from '@/components/ui/use-toast';

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('SocialAccountsSection', () => {
  const mockAccounts = [mockSocialAccount];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockLocation.href = '';
  });

  it('renders the social accounts list', () => {
    render(<SocialAccountsSection accounts={mockAccounts} />);

    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText(mockSocialAccount.accountId)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
  });

  it('shows empty state when no accounts are connected', () => {
    render(<SocialAccountsSection accounts={[]} />);

    expect(screen.getByText(/no social accounts connected/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(4); // All platform connect buttons
  });

  it('initiates OAuth flow when connecting account', () => {
    render(<SocialAccountsSection accounts={[]} />);

    const connectButton = screen.getByRole('button', { name: /connect twitter/i });
    fireEvent.click(connectButton);

    expect(mockLocation.href).toBe('/api/auth/twitter');
  });

  it('disconnects a social account', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    render(<SocialAccountsSection accounts={mockAccounts} />);

    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/user/social-accounts/${mockSocialAccount.id}`,
        {
          method: 'DELETE',
        }
      );

      expect(toast).toHaveBeenCalledWith({
        title: 'Account Disconnected',
        description: 'The social media account has been disconnected successfully.',
      });

      expect(screen.getByText(/no social accounts connected/i)).toBeInTheDocument();
    });
  });

  it('handles API errors when disconnecting account', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<SocialAccountsSection accounts={mockAccounts} />);

    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to disconnect account. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('shows correct platform-specific styling', () => {
    const accounts = [
      { ...mockSocialAccount, platform: 'twitter' },
      { ...mockSocialAccount, id: '2', platform: 'facebook' },
      { ...mockSocialAccount, id: '3', platform: 'instagram' },
      { ...mockSocialAccount, id: '4', platform: 'linkedin' },
    ];

    render(<SocialAccountsSection accounts={accounts} />);

    expect(screen.getByText('🐦')).toBeInTheDocument(); // Twitter
    expect(screen.getByText('📘')).toBeInTheDocument(); // Facebook
    expect(screen.getByText('📸')).toBeInTheDocument(); // Instagram
    expect(screen.getByText('💼')).toBeInTheDocument(); // LinkedIn
  });

  it('shows only unconnected platform buttons', () => {
    const accounts = [
      { ...mockSocialAccount, platform: 'twitter' },
      { ...mockSocialAccount, id: '2', platform: 'facebook' },
    ];

    render(<SocialAccountsSection accounts={accounts} />);

    expect(screen.queryByRole('button', { name: /connect twitter/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /connect facebook/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect instagram/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect linkedin/i })).toBeInTheDocument();
  });
}); 