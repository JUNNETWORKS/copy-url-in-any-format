import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Options } from '../../../src/options/App';
import type { Format } from '../../../src/shared/types';

describe('Options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render options page with title', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Options />);
    
    await waitFor(() => {
      expect(screen.getByText('Copy URL in any format - Settings')).toBeInTheDocument();
    });
  });

  it('should display existing formats', async () => {
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
    
    render(<Options />);
    
    await waitFor(() => {
      expect(screen.getByText('Markdown')).toBeInTheDocument();
      expect(screen.getByText('[{title}]({url})')).toBeInTheDocument();
    });
  });

  it('should add new format', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Options />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Format')).toBeInTheDocument();
    });

    // Click add button
    fireEvent.click(screen.getByText('Add New Format'));

    // Fill in the form
    const nameInput = screen.getByLabelText('Name');
    const templateInput = screen.getByLabelText('Template');
    
    await userEvent.type(nameInput, 'Custom Format');
    await userEvent.type(templateInput, 'Title: {title}');

    // Save
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });
  });

  it('should edit existing format', async () => {
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
    
    render(<Options />);
    
    await waitFor(() => {
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByLabelText('Edit Markdown'));

    // Update the name
    const nameInput = screen.getByDisplayValue('Markdown');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Markdown');

    // Save
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });
  });

  it('should delete format', async () => {
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
    
    render(<Options />);
    
    await waitFor(() => {
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });

    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Click delete button
    fireEvent.click(screen.getByLabelText('Delete Markdown'));

    // Check that confirm was called
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');

    await waitFor(() => {
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ formats: [] });
    });
  });

  it('should show preview when editing', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Options />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Add New Format')).toBeInTheDocument();
    });
    
    // Click add button
    fireEvent.click(screen.getByText('Add New Format'));

    const templateInput = screen.getByLabelText('Template');
    // Use fireEvent instead of userEvent for special characters
    fireEvent.change(templateInput, { target: { value: '[{title}]({url})' } });

    await waitFor(() => {
      expect(screen.getByText('Preview:')).toBeInTheDocument();
      expect(screen.getByText('[Example Page](https://example.com)')).toBeInTheDocument();
    });
  });

  it('should validate format name is required', async () => {
    (chrome.storage.local.get as any).mockResolvedValue({});
    
    render(<Options />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Add New Format')).toBeInTheDocument();
    });
    
    // Click add button
    fireEvent.click(screen.getByText('Add New Format'));

    // Try to save without name
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });
});