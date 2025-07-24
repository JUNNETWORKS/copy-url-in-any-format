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
      vi.mocked(chrome.storage.local.get).mockResolvedValue({});
      
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

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: mockFormats });
      
      const formats = await storage.getFormats();
      expect(formats).toEqual(mockFormats);
    });
  });

  describe('getFormat', () => {
    it('should return null when format does not exist', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({});
      
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

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: mockFormats });
      
      const format = await storage.getFormat('1');
      expect(format).toEqual(mockFormats[0]);
    });
  });

  describe('saveFormat', () => {
    it('should add new format', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({});
      
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

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: [existingFormat] });
      
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

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: mockFormats });
      
      await storage.deleteFormat('1');
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        formats: [mockFormats[1]],
      });
    });
  });

  describe('getFormatsWithDefaults', () => {
    it('should return all formats from storage', async () => {
      const storedFormats: Format[] = [
        {
          id: 'format-1',
          name: 'Markdown',
          template: '[{title}]({url})',
          createdAt: 1000,
          updatedAt: 1000,
        },
        {
          id: 'format-2',
          name: 'Custom Format',
          template: 'Custom: {title}',
          createdAt: 2000,
          updatedAt: 2000,
        },
      ];

      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: storedFormats });
      
      const formats = await storage.getFormatsWithDefaults();
      
      expect(formats).toEqual(storedFormats);
      expect(formats.length).toBe(2);
    });

    it('should return empty array when no formats exist', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({});
      
      const formats = await storage.getFormatsWithDefaults();
      
      expect(formats).toEqual([]);
    });
  });

  describe('addFormat', () => {
    it('should add a new format', async () => {
      const existingFormats: Format[] = [];
      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: existingFormats });
      
      const newFormat = {
        name: 'Test Format',
        template: 'Test: {title}',
      };
      
      const result = await storage.addFormat(newFormat);
      
      expect(result.name).toBe(newFormat.name);
      expect(result.template).toBe(newFormat.template);
      expect(result.id).toBeTruthy();
      expect(result.createdAt).toBeTruthy();
      expect(result.updatedAt).toBeTruthy();
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        formats: [result],
      });
    });

    it('should append to existing formats', async () => {
      const existingFormat: Format = {
        id: 'existing-1',
        name: 'Existing',
        template: '{title}',
        createdAt: 1000,
        updatedAt: 1000,
      };
      vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: [existingFormat] });
      
      const newFormat = {
        name: 'New Format',
        template: 'New: {title}',
      };
      
      const result = await storage.addFormat(newFormat);
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        formats: [existingFormat, result],
      });
    });
  });

  describe('autoCopy methods', () => {
    describe('getAutoCopyFormatId', () => {
      it('should return null when no auto-copy format is set', async () => {
        vi.mocked(chrome.storage.local.get).mockResolvedValue({});
        
        const result = await storage.getAutoCopyFormatId();
        expect(result).toBeNull();
      });

      it('should return the auto-copy format id', async () => {
        vi.mocked(chrome.storage.local.get).mockResolvedValue({ autoCopyFormatId: 'format-1' });
        
        const result = await storage.getAutoCopyFormatId();
        expect(result).toBe('format-1');
      });
    });

    describe('setAutoCopyFormatId', () => {
      it('should set the auto-copy format id', async () => {
        await storage.setAutoCopyFormatId('format-1');
        
        expect(chrome.storage.local.set).toHaveBeenCalledWith({
          autoCopyFormatId: 'format-1',
        });
      });

      it('should remove the auto-copy format id when null', async () => {
        await storage.setAutoCopyFormatId(null);
        
        expect(chrome.storage.local.remove).toHaveBeenCalledWith('autoCopyFormatId');
      });
    });

    describe('clearOtherAutoCopyFormats', () => {
      it('should clear autoCopy flag from all formats except the specified one', async () => {
        const mockFormats: Format[] = [
          {
            id: 'format-1',
            name: 'Format 1',
            template: '{title}',
            autoCopy: true,
            createdAt: 1000,
            updatedAt: 1000,
          },
          {
            id: 'format-2',
            name: 'Format 2',
            template: '{url}',
            autoCopy: true,
            createdAt: 2000,
            updatedAt: 2000,
          },
          {
            id: 'format-3',
            name: 'Format 3',
            template: '{title} - {url}',
            createdAt: 3000,
            updatedAt: 3000,
          },
        ];

        vi.mocked(chrome.storage.local.get).mockResolvedValue({ formats: mockFormats });
        
        await storage.clearOtherAutoCopyFormats('format-2');
        
        expect(chrome.storage.local.set).toHaveBeenCalledWith({
          formats: [
            {
              ...mockFormats[0],
              autoCopy: false,
            },
            {
              ...mockFormats[1],
              autoCopy: true,
            },
            {
              ...mockFormats[2],
              autoCopy: false,
            },
          ],
        });
      });
    });
  });
});