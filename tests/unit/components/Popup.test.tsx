import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Popup } from '../../../src/popup/App';
import type { Format } from '../../../src/shared/types';

// Mock chrome.tabs API
const mockTab = {
  id: 1,
  title: 'Test Page',
  url: 'https://example.com',
};

describe('Popup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (chrome.tabs.query as any).mockResolvedValue([mockTab]);
  });

  it('should render loading state initially', () => {
    (chrome.storage.local.get as any).mockImplementation(() => new Promise(() => {}));
    
    render(<Popup />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render formats after loading', async () => {
    const mockFormats: Format[] = [
      {
        id: '1',
        name: 'Markdown',
        template: '[{title}]({url})',
        createdAt: 1000,
        updatedAt: 1000,
      },
    ];

    (chrome.storage.local.get as any).mockResolvedValue({ formats: mockFormats });
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Copy URL in any format')).toBeInTheDocument();
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });
  });

  it('should show error when tab info is not available', async () => {
    (chrome.tabs.query as any).mockResolvedValue([]);
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to get page information')).toBeInTheDocument();
    });
  });

  it('should show settings link', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('should use default formats when no custom formats exist', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Popup />);
    
    await waitFor(() => {
      // Should show default formats
      expect(screen.getByText('Markdown')).toBeInTheDocument();
      expect(screen.getByText('HTML')).toBeInTheDocument();
      expect(screen.getByText('Plain URL')).toBeInTheDocument();
    });
  });
});