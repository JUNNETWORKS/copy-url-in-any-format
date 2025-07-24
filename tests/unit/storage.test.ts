import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormatStorage } from '../../src/shared/storage';
import type { Format } from '../../src/shared/types';

describe('FormatStorage', () => {
  let storage: FormatStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    storage = new FormatStorage();
  });

  describe('getFormats', () => {
    it('should return empty array when no formats exist', async () => {
      (chrome.storage.local.get as any).mockResolvedValue({});
      
      const formats = await storage.getFormats();
      expect(formats).toEqual([]);
    });

    it('should return stored formats', async () => {
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

      (chrome.storage.local.get as any).mockResolvedValue({ formats: mockFormats });
      
      const formats = await storage.getFormats();
      expect(formats).toEqual(mockFormats);
    });
  });

  describe('getFormat', () => {
    it('should return null when format does not exist', async () => {
      (chrome.storage.local.get as any).mockResolvedValue({});
      
      const format = await storage.getFormat('1');
      expect(format).toBeNull();
    });

    it('should return the requested format', async () => {
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
      
      const format = await storage.getFormat('1');
      expect(format).toEqual(mockFormats[0]);
    });
  });

  describe('saveFormat', () => {
    it('should add new format', async () => {
      (chrome.storage.local.get as any).mockResolvedValue({});
      
      const newFormat: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Markdown',
        template: '[{title}]({url})',
      };

      const savedFormat = await storage.saveFormat(newFormat);
      
      expect(savedFormat).toMatchObject({
        name: 'Markdown',
        template: '[{title}]({url})',
      });
      expect(savedFormat.id).toBeTruthy();
      expect(savedFormat.createdAt).toBeTruthy();
      expect(savedFormat.updatedAt).toBeTruthy();
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        formats: [savedFormat],
      });
    });

    it('should update existing format', async () => {
      const existingFormat: Format = {
        id: '1',
        name: 'Markdown',
        template: '[{title}]({url})',
        createdAt: 1000,
        updatedAt: 1000,
      };

      (chrome.storage.local.get as any).mockResolvedValue({ formats: [existingFormat] });
      
      const updatedFormat = await storage.saveFormat({
        ...existingFormat,
        name: 'Updated Markdown',
      });
      
      expect(updatedFormat).toMatchObject({
        id: '1',
        name: 'Updated Markdown',
        template: '[{title}]({url})',
        createdAt: 1000,
      });
      expect(updatedFormat.updatedAt).toBeGreaterThan(1000);
    });
  });

  describe('deleteFormat', () => {
    it('should delete format', async () => {
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

      (chrome.storage.local.get as any).mockResolvedValue({ formats: mockFormats });
      
      await storage.deleteFormat('1');
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        formats: [mockFormats[1]],
      });
    });
  });

  describe('getDefaultFormats', () => {
    it('should return default formats when no custom formats exist', async () => {
      (chrome.storage.local.get as any).mockResolvedValue({});
      
      const formats = await storage.getFormatsWithDefaults();
      
      expect(formats.length).toBeGreaterThan(0);
      expect(formats.some(f => f.name === 'Markdown')).toBe(true);
      expect(formats.some(f => f.name === 'HTML')).toBe(true);
      expect(formats.some(f => f.name === 'Plain URL')).toBe(true);
    });

    it('should merge custom formats with defaults', async () => {
      const customFormat: Format = {
        id: 'custom-1',
        name: 'Custom Format',
        template: 'Custom: {title}',
        createdAt: 1000,
        updatedAt: 1000,
      };

      (chrome.storage.local.get as any).mockResolvedValue({ formats: [customFormat] });
      
      const formats = await storage.getFormatsWithDefaults();
      
      expect(formats.some(f => f.name === 'Custom Format')).toBe(true);
      expect(formats.some(f => f.name === 'Markdown')).toBe(true);
    });
  });
});