import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'demo',
  base: './',
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo/index.html')
      }
    }
  },
  server: {
    port: 3001
  }
});