import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { ProfileForm } from '@/app/(app)/settings/profile-form';

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

global.fetch = jest.fn();

const mockUser = {
  id: 'test-user-id',
  name: 'Jane Doe',
  email: 'jane@example.com',
  emailVerified: null,
  image: 'https://example.com/avatar.png',
  password: null,
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

describe('ProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user details properly in form fields', () => {
    render(<ProfileForm user={mockUser} />);
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
  });

  it('submits updated profile details on form submit', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ...mockUser, name: 'Jane Updated' }),
    });

    render(<ProfileForm user={mockUser} />);
    const nameInput = screen.getByDisplayValue('Jane Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Updated' } });

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/profile', expect.objectContaining({
        method: 'PATCH',
      }));
    });
  });
});