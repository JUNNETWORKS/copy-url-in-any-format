/// <reference types="chrome" />
/// <reference types="vite/client" />

declare global {
  interface Window {
    chrome: typeof chrome;
    confirm: (message?: string) => boolean;
  }

  interface Navigator {
    clipboard: {
      writeText: (text: string) => Promise<void>;
    };
  }
}

export {};