import React from 'react';
import { render, screen } from '../utils/test-utils';
import { ApiKeySection } from '@/app/(app)/settings/api-key-section';

describe('ApiKeySection', () => {
  it('renders the server-side proxy security banner', () => {
    render(<ApiKeySection />);
    expect(screen.getByText('Server-Managed Gemini AI Proxy Active')).toBeInTheDocument();
    expect(screen.getByText(/zero client-side key exposure/i)).toBeInTheDocument();
    expect(screen.getByText('Operational')).toBeInTheDocument();
  });
});