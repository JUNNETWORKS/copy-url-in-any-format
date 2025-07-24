import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock FormatStorage
const mockGetFormats = vi.fn();
const mockAddFormat = vi.fn();

vi.mock('../../src/shared/storage', () => ({
  FormatStorage: vi.fn(() => ({
    getFormats: mockGetFormats,
    addFormat: mockAddFormat,
  })),
}));

describe('Background Script', () => {
  let onInstalledHandler: (details: chrome.runtime.InstalledDetails) => void | Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFormats.mockClear();
    mockAddFormat.mockClear();
    
    // Mock chrome APIs
    global.chrome = {
      ...global.chrome,
      runtime: {
        ...global.chrome.runtime,
        onInstalled: {
          addListener: vi.fn((handler) => {
            onInstalledHandler = handler;
          }),
          getRules: vi.fn(),
          hasListener: vi.fn(),
          removeRules: vi.fn(),
          addRules: vi.fn(),
          removeListener: vi.fn(),
          hasListeners: vi.fn(),
        } as unknown as chrome.events.Event<(details: chrome.runtime.InstalledDetails) => void>,
      },
      action: {
        ...global.chrome.action,
        onClicked: {
          addListener: vi.fn(),
          getRules: vi.fn(),
          hasListener: vi.fn(),
          removeRules: vi.fn(),
          addRules: vi.fn(),
          removeListener: vi.fn(),
          hasListeners: vi.fn(),
        } as unknown as chrome.events.Event<(tab: chrome.tabs.Tab) => void>,
      },
    } as unknown as typeof chrome;
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should register onInstalled listener', async () => {
    await import('../../src/background/index');
    
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
  });

  it('should install default formats on first installation', async () => {
    mockGetFormats.mockResolvedValue([]);
    mockAddFormat.mockResolvedValue({
      id: 'format-1',
      name: 'Markdown',
      template: '[{title}]({url})',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Import the background script
    await import('../../src/background/index');

    // Simulate first installation
    await onInstalledHandler({ reason: 'install' });

    // Verify default formats were added
    expect(mockGetFormats).toHaveBeenCalled();
    expect(mockAddFormat).toHaveBeenCalledTimes(3);
    expect(mockAddFormat).toHaveBeenCalledWith({
      name: 'Markdown',
      template: '[{title}]({url})',
    });
    expect(mockAddFormat).toHaveBeenCalledWith({
      name: 'HTML',
      template: '<a href="{url}">{title}</a>',
    });
    expect(mockAddFormat).toHaveBeenCalledWith({
      name: 'Plain URL',
      template: '{url}',
    });
  });

  it('should not install default formats if formats already exist', async () => {
    mockGetFormats.mockResolvedValue([
      {
        id: 'existing-1',
        name: 'Existing Format',
        template: '{title}',
        createdAt: 1000,
        updatedAt: 1000,
      },
    ]);

    // Import the background script
    await import('../../src/background/index');

    // Simulate installation when formats already exist
    await onInstalledHandler({ reason: 'install' });

    // Verify default formats were NOT added
    expect(mockGetFormats).toHaveBeenCalled();
    expect(mockAddFormat).not.toHaveBeenCalled();
  });

  it('should not install default formats on update', async () => {
    // Import the background script
    await import('../../src/background/index');

    // Simulate update (not first installation)
    await onInstalledHandler({ reason: 'update' });

    // Verify no formats were checked or added
    expect(mockGetFormats).not.toHaveBeenCalled();
    expect(mockAddFormat).not.toHaveBeenCalled();
  });
});