import type { Format } from '../types';

export class FormatStorage {
  private readonly STORAGE_KEY = 'formats';
  private readonly AUTO_COPY_KEY = 'autoCopyFormatId';

  async getFormats(): Promise<Format[]> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  async getFormat(id: string): Promise<Format | null> {
    const formats = await this.getFormats();
    return formats.find((f) => f.id === id) || null;
  }

  async saveFormat(
    format: Omit<Format, 'id' | 'createdAt' | 'updatedAt'> & Partial<Format>
  ): Promise<Format> {
    const formats = await this.getFormats();
    const now = Date.now();

    if (format.id) {
      // Update existing format
      const index = formats.findIndex((f) => f.id === format.id);
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
      autoCopy: format.autoCopy,
      createdAt: now,
      updatedAt: now,
    };

    formats.push(newFormat);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: formats });
    return newFormat;
  }

  async deleteFormat(id: string): Promise<void> {
    const formats = await this.getFormats();
    const filteredFormats = formats.filter((f) => f.id !== id);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: filteredFormats });
  }

  async getFormatsWithDefaults(): Promise<Format[]> {
    // Since default formats are now stored in storage on first install,
    // we can simply return all formats from storage
    return await this.getFormats();
  }

  async addFormat(
    format: Omit<Format, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Format> {
    const formats = await this.getFormats();
    const now = Date.now();

    const newFormat: Format = {
      id: this.generateId(),
      name: format.name,
      template: format.template,
      autoCopy: format.autoCopy,
      createdAt: now,
      updatedAt: now,
    };

    formats.push(newFormat);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: formats });
    return newFormat;
  }

  async getAutoCopyFormatId(): Promise<string | null> {
    const result = await chrome.storage.local.get(this.AUTO_COPY_KEY);
    return result[this.AUTO_COPY_KEY] || null;
  }

  async setAutoCopyFormatId(formatId: string | null): Promise<void> {
    if (formatId === null) {
      await chrome.storage.local.remove(this.AUTO_COPY_KEY);
    } else {
      await chrome.storage.local.set({ [this.AUTO_COPY_KEY]: formatId });
    }
  }

  async clearOtherAutoCopyFormats(keepFormatId: string): Promise<void> {
    const formats = await this.getFormats();
    const updatedFormats = formats.map((format) => ({
      ...format,
      autoCopy: format.id === keepFormatId ? true : false,
    }));
    await chrome.storage.local.set({ [this.STORAGE_KEY]: updatedFormats });
  }

  private generateId(): string {
    return `format-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
