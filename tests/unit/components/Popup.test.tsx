import '@testing-library/jest-dom'
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
    vi.mocked(chrome.tabs.query).mockImplementation(() => Promise.resolve([mockTab]));
  });

  it('should render loading state initially', () => {
    vi.mocked(chrome.storage.local.get).mockImplementation(() => new Promise(() => {}));
    
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

    vi.mocked(chrome.storage.local.get).mockImplementation(() => Promise.resolve({ formats: mockFormats }));
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Copy URL in any format')).toBeInTheDocument();
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });
  });

  it('should show error when tab info is not available', async () => {
    vi.mocked(chrome.tabs.query).mockImplementation(() => Promise.resolve([]));
    vi.mocked(chrome.storage.local.get).mockImplementation(() => Promise.resolve({}));
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to get page information')).toBeInTheDocument();
    });
  });

  it('should show settings link', async () => {
    vi.mocked(chrome.storage.local.get).mockImplementation(() => Promise.resolve({}));
    
    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('should show empty state when no formats exist', async () => {
    vi.mocked(chrome.storage.local.get).mockImplementation(() => Promise.resolve({}));
    
    render(<Popup />);
    
    await waitFor(() => {
      // Should show empty state when no formats are in storage
      expect(screen.getByText('No formats available')).toBeInTheDocument();
    });
  });
});