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
      48: 'assets/icon-placeholder.svg',
    },
  },
  icons: {
    48: 'assets/icon-placeholder.svg',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
})