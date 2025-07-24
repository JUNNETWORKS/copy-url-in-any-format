import type { Format } from '../types';

export class FormatStorage {
  private readonly STORAGE_KEY = 'formats';

  async getFormats(): Promise<Format[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  async getFormat(id: string): Promise<Format | null> {
    const formats = await this.getFormats();
    return formats.find(f => f.id === id) || null;
  }

  async saveFormat(format: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> & Partial<Format>): Promise<Format> {
    const formats = await this.getFormats();
    const now = Date.now();

    if (format.id) {
      // Update existing format
      const index = formats.findIndex(f => f.id === format.id);
      if (index !== -1) {
        const updatedFormat: Format = {
          ...formats[index],
          ...format,
          updatedAt: now,
        };
        formats[index] = updatedFormat;
        await chrome.storage.local.set({ [this.STORAGE_KEY]: formats });
        return updatedFormat;
      }
    }

    // Create new format
    const newFormat: Format = {
      id: this.generateId(),
      name: format.name,
      template: format.template,
      createdAt: now,
      updatedAt: now,
    };

    formats.push(newFormat);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: formats });
    return newFormat;
  }

  async deleteFormat(id: string): Promise<void> {
    const formats = await this.getFormats();
    const filteredFormats = formats.filter(f => f.id !== id);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: filteredFormats });
  }

  async getFormatsWithDefaults(): Promise<Format[]> {
    const customFormats = await this.getFormats();
    const defaultFormats = this.getDefaultFormats();
    
    // Merge custom formats with defaults, custom formats come first
    const allFormats = [...customFormats];
    
    // Add default formats that don't exist in custom formats
    defaultFormats.forEach(defaultFormat => {
      if (!allFormats.some(f => f.name === defaultFormat.name)) {
        allFormats.push(defaultFormat);
      }
    });

    return allFormats;
  }

  private getDefaultFormats(): Format[] {
    const now = Date.now();
    return [
      {
        id: 'default-markdown',
        name: 'Markdown',
        template: '[{title}]({url})',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'default-html',
        name: 'HTML',
        template: '<a href="{url}">{title}</a>',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'default-plain-url',
        name: 'Plain URL',
        template: '{url}',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private generateId(): string {
    return `format-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}