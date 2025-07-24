// Service Worker for Chrome Extension
// Handles background tasks if needed

chrome.runtime.onInstalled.addListener(() => {
  console.log('Copy URL in any format extension installed');
});

// Handle extension icon click (if popup is not set)
chrome.action.onClicked.addListener((tab) => {
  // This will not be called if default_popup is set in manifest.json
  console.log('Extension icon clicked');
});

// Export empty object to make this a module
export {};
