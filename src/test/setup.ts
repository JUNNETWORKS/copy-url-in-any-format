import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Chrome API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
  },
  runtime: {
    lastError: null,
  },
  tabs: {
    query: vi.fn(),
  },
} as any;

// Mock window.confirm
global.confirm = vi.fn(() => true);
