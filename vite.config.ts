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
})

// export default defineConfig({
//   plugins: [react(), crx({ manifest })],
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//       input: {
//         popup: resolve(__dirname, 'popup.html'),
//         options: resolve(__dirname, 'options.html'),
//         background: resolve(__dirname, 'src/background/index.ts'),
//       },
//       output: {
//         entryFileNames: '[name].js',
//         chunkFileNames: '[name].js',
//         assetFileNames: '[name].[ext]',
//       },
//     },
//   },
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: './src/test/setup.ts',
//     coverage: {
//       provider: 'v8',
//       reporter: ['text', 'json', 'html'],
//     },
//   },
// });