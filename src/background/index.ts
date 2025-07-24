// Service Worker for Chrome Extension
// Handles background tasks if needed

import { FormatStorage } from '../shared/storage';
import type { Format } from '../shared/types';

// Default formats to be installed on first run
const DEFAULT_FORMATS: Omit<Format, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Markdown',
    template: '[{title}]({url})',
  },
  {
    name: 'HTML',
    template: '<a href="{url}">{title}</a>',
  },
  {
    name: 'Plain URL',
    template: '{url}',
  },
];

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Copy URL in any format extension installed');
  
  // Only install default formats on first installation
  if (details.reason === 'install') {
    const storage = new FormatStorage();
    const existingFormats = await storage.getFormats();
    
    // Check if this is truly the first installation (no formats exist)
    if (existingFormats.length === 0) {
      console.log('First installation detected, installing default formats');
      
      for (const format of DEFAULT_FORMATS) {
        await storage.addFormat(format);
      }
      
      console.log('Default formats installed successfully');
    }
  }
});

// Handle extension icon click (if popup is not set)
chrome.action.onClicked.addListener(() => {
  // This will not be called if default_popup is set in manifest.json
  console.log('Extension icon clicked');
});

// Export empty object to make this a module
export {};
