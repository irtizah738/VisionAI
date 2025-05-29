import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { ApiKeySection } from '@/app/(app)/settings/api-key-section';
import { mockApiKey } from '../utils/test-utils';
import { toast } from '@/components/ui/use-toast';

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ApiKeySection', () => {
  const mockApiKeys = [mockApiKey];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the API key list', () => {
    render(<ApiKeySection apiKeys={mockApiKeys} />);

    expect(screen.getByText(mockApiKey.name)).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revoke/i })).toBeInTheDocument();
  });

  it('shows empty state when no API keys exist', () => {
    render(<ApiKeySection apiKeys={[]} />);

    expect(screen.getByText(/no api keys generated yet/i)).toBeInTheDocument();
  });

  it('generates a new API key', async () => {
    const newApiKey = {
      ...mockApiKey,
      id: 'new-key-id',
      name: 'New API Key',
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newApiKey),
      })
    );

    render(<ApiKeySection apiKeys={mockApiKeys} />);

    const input = screen.getByPlaceholderText(/api key name/i);
    const generateButton = screen.getByRole('button', { name: /generate new key/i });

    // Enter key name
    fireEvent.change(input, { target: { value: 'New API Key' } });

    // Click generate button
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New API Key' }),
      });

      expect(toast).toHaveBeenCalledWith({
        title: 'API Key Generated',
        description: expect.any(String),
      });

      expect(screen.getByText('New API Key')).toBeInTheDocument();
    });
  });

  it('prevents generating API key without a name', async () => {
    render(<ApiKeySection apiKeys={mockApiKeys} />);

    const generateButton = screen.getByRole('button', { name: /generate new key/i });

    // Click generate button without entering a name
    fireEvent.click(generateButton);

    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Please enter a name for your API key',
      variant: 'destructive',
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('revokes an API key', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    render(<ApiKeySection apiKeys={mockApiKeys} />);

    const revokeButton = screen.getByRole('button', { name: /revoke/i });

    // Click revoke button
    fireEvent.click(revokeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/user/api-keys/${mockApiKey.id}`, {
        method: 'DELETE',
      });

      expect(toast).toHaveBeenCalledWith({
        title: 'API Key Revoked',
        description: 'The API key has been revoked successfully.',
      });

      expect(screen.getByText(/no api keys generated yet/i)).toBeInTheDocument();
    });
  });

  it('handles API errors when generating key', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<ApiKeySection apiKeys={mockApiKeys} />);

    const input = screen.getByPlaceholderText(/api key name/i);
    const generateButton = screen.getByRole('button', { name: /generate new key/i });

    // Enter key name
    fireEvent.change(input, { target: { value: 'New API Key' } });

    // Click generate button
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('handles API errors when revoking key', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<ApiKeySection apiKeys={mockApiKeys} />);

    const revokeButton = screen.getByRole('button', { name: /revoke/i });

    // Click revoke button
    fireEvent.click(revokeButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to revoke API key. Please try again.',
        variant: 'destructive',
      });
    });
  });
}); 