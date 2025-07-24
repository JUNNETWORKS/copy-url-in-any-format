import { describe, it, expect } from 'vitest';
import { formatUrl } from '../../src/shared/formatters';
import type { PageInfo, Format } from '../../src/shared/types';

describe('formatUrl', () => {
  const pageInfo: PageInfo = {
    title: 'Example Page',
    url: 'https://example.com',
  };

  it('should format URL as Markdown', () => {
    const format: Format = {
      id: '1',
      name: 'Markdown',
      template: '[{title}]({url})',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('[Example Page](https://example.com)');
  });

  it('should format URL as HTML', () => {
    const format: Format = {
      id: '2',
      name: 'HTML',
      template: '<a href="{url}">{title}</a>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('<a href="https://example.com">Example Page</a>');
  });

  it('should format URL as plain URL', () => {
    const format: Format = {
      id: '3',
      name: 'Plain URL',
      template: '{url}',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('https://example.com');
  });

  it('should format URL as plain title', () => {
    const format: Format = {
      id: '4',
      name: 'Plain Title',
      template: '{title}',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('Example Page');
  });

  it('should handle custom format', () => {
    const format: Format = {
      id: '5',
      name: 'Custom',
      template: 'Title: {title} | URL: {url}',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('Title: Example Page | URL: https://example.com');
  });

  it('should handle special characters in title', () => {
    const specialPageInfo: PageInfo = {
      title: 'Title with "quotes" & special <chars>',
      url: 'https://example.com',
    };

    const format: Format = {
      id: '6',
      name: 'Markdown',
      template: '[{title}]({url})',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(specialPageInfo, format);
    expect(result).toBe('[Title with "quotes" & special <chars>](https://example.com)');
  });

  it('should handle empty title', () => {
    const emptyTitlePageInfo: PageInfo = {
      title: '',
      url: 'https://example.com',
    };

    const format: Format = {
      id: '7',
      name: 'Markdown',
      template: '[{title}]({url})',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(emptyTitlePageInfo, format);
    expect(result).toBe('[](https://example.com)');
  });

  it('should handle repeated placeholders', () => {
    const format: Format = {
      id: '8',
      name: 'Repeated',
      template: '{title} - {title} ({url})',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = formatUrl(pageInfo, format);
    expect(result).toBe('Example Page - Example Page (https://example.com)');
  });
});