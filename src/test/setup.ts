import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configure } from '@testing-library/react';
import '../types/global.d.ts';

// Configure React Testing Library
configure({
  // This will wrap all updates in act automatically
  asyncUtilTimeout: 2000,
});

// Mock Chrome API
type StorageCallback<T> = (items: T) => void;
type StorageGetCallback = StorageCallback<{ [key: string]: unknown }>;
type StorageSetCallback = () => void;
type StorageRemoveCallback = () => void;
type StorageClearCallback = () => void;

const mockChrome = {
  storage: {
    local: {
      get: vi.fn().mockImplementation((keys?: string | string[] | object | StorageGetCallback, callback?: StorageGetCallback) => {
        if (typeof keys === 'function') {
          keys({});
          return;
        }
        if (callback) {
          callback({});
          return;
        }
        return Promise.resolve({});
      }),
      set: vi.fn().mockImplementation((_items: { [key: string]: unknown }, callback?: StorageSetCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      remove: vi.fn().mockImplementation((_keys: string | string[], callback?: StorageRemoveCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      clear: vi.fn().mockImplementation((callback?: StorageClearCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
    },
    sync: {
      get: vi.fn().mockImplementation((keys?: string | string[] | object | StorageGetCallback, callback?: StorageGetCallback) => {
        if (typeof keys === 'function') {
          keys({});
          return;
        }
        if (callback) {
          callback({});
          return;
        }
        return Promise.resolve({});
      }),
      set: vi.fn().mockImplementation((_items: { [key: string]: unknown }, callback?: StorageSetCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      remove: vi.fn().mockImplementation((_keys: string | string[], callback?: StorageRemoveCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      clear: vi.fn().mockImplementation((callback?: StorageClearCallback) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    lastError: undefined as chrome.runtime.LastError | undefined,
  },
  tabs: {
    query: vi.fn().mockResolvedValue([] as chrome.tabs.Tab[]),
  },
};

globalThis.chrome = mockChrome as unknown as typeof chrome;

// Mock window.confirm
globalThis.confirm = vi.fn(() => true) as unknown as typeof window.confirm;

// Mock navigator.clipboard and userAgent
Object.defineProperty(globalThis, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
  writable: true,
});