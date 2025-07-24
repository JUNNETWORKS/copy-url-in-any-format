import { defineConfig } from 'vitest/config';
import { crx  } from '@crxjs/vite-plugin'
// import react from '@vitejs/plugin-react';
import path from 'node:path'
import zip from 'vite-plugin-zip-pack'
import { manifest } from './manifest.config';
import { name, version } from './package.json'


export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})