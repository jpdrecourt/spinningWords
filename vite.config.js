import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  define: {
    global: 'globalThis'
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
});
