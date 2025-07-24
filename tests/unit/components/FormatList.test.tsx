import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormatList } from '../../../src/popup/components/FormatList';
import type { Format, PageInfo } from '../../../src/shared/types';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('FormatList', () => {
  const mockFormats: Format[] = [
    {
      id: '1',
      name: 'Markdown',
      template: '[{title}]({url})',
      createdAt: 1000,
      updatedAt: 1000,
    },
    {
      id: '2',
      name: 'HTML',
      template: '<a href="{url}">{title}</a>',
      createdAt: 2000,
      updatedAt: 2000,
    },
  ];

  const mockPageInfo: PageInfo = {
    title: 'Test Page',
    url: 'https://example.com',
  };

  it('should render format list', () => {
    render(<FormatList formats={mockFormats} pageInfo={mockPageInfo} />);
    
    expect(screen.getByText('Markdown')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('should show preview on hover', async () => {
    render(<FormatList formats={mockFormats} pageInfo={mockPageInfo} />);
    
    const markdownButton = screen.getByText('Markdown');
    fireEvent.mouseEnter(markdownButton);
    
    await waitFor(() => {
      expect(screen.getByText('[Test Page](https://example.com)')).toBeInTheDocument();
    });
  });

  it('should copy to clipboard on click', async () => {
    render(<FormatList formats={mockFormats} pageInfo={mockPageInfo} />);
    
    const markdownButton = screen.getByText('Markdown');
    fireEvent.click(markdownButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('[Test Page](https://example.com)');
    });
  });

  it('should show success message after copy', async () => {
    render(<FormatList formats={mockFormats} pageInfo={mockPageInfo} />);
    
    const markdownButton = screen.getByText('Markdown');
    fireEvent.click(markdownButton);
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('should handle empty formats', () => {
    render(<FormatList formats={[]} pageInfo={mockPageInfo} />);
    
    expect(screen.getByText('No formats available')).toBeInTheDocument();
  });

  it('should handle copy error', async () => {
    (navigator.clipboard.writeText as any).mockRejectedValueOnce(new Error('Copy failed'));
    
    render(<FormatList formats={mockFormats} pageInfo={mockPageInfo} />);
    
    const markdownButton = screen.getByText('Markdown');
    fireEvent.click(markdownButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to copy')).toBeInTheDocument();
    });
  });
});