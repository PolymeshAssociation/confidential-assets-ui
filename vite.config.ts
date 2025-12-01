import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'github' ? '/confidential-assets-ui/' : '/',
  plugins: [
    wasm(),
    topLevelAwait(),
    react(),
    svgr(),
    tsconfigPaths(),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['@polymeshassociation/polymesh-sdk'],
    exclude: ['@polymesh/polymesh-dart-wasm'],
  },
}));
