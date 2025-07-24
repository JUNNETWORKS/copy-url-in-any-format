import { defineManifest } from '@crxjs/vite-plugin'

export const manifest = defineManifest({
  manifest_version: 3,
  name: 'Copy URL in any format',
  version: '1.0.0',
  description: 'Copy URLs in various formats like Markdown, HTML, or custom templates',
  permissions: [
    'activeTab',
    'storage',
    'clipboardWrite'
  ],
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'assets/icon-16x16.png',
      32: 'assets/icon-32x32.png',
      48: 'assets/icon-48x48.png',
      128: 'assets/icon-128x128.png',
    },
  },
  icons: {
    16: 'assets/icon-16x16.png',
    32: 'assets/icon-32x32.png',
    48: 'assets/icon-48x48.png',
    128: 'assets/icon-128x128.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
})