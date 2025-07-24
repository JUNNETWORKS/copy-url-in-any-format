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
const mockChrome = {
  storage: {
    local: {
      get: vi.fn().mockImplementation((keys?: any, callback?: any) => {
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
      set: vi.fn().mockImplementation((_items: any, callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      remove: vi.fn().mockImplementation((_keys: any, callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      clear: vi.fn().mockImplementation((callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
    },
    sync: {
      get: vi.fn().mockImplementation((keys?: any, callback?: any) => {
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
      set: vi.fn().mockImplementation((_items: any, callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      remove: vi.fn().mockImplementation((_keys: any, callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
      clear: vi.fn().mockImplementation((callback?: any) => {
        if (callback) {
          callback();
          return;
        }
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    lastError: undefined,
  },
  tabs: {
    query: vi.fn().mockResolvedValue([]),
  },
};

globalThis.chrome = mockChrome as any;

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