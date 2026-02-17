
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps "@" to the "src" directory
      '@': path.resolve('./src'),
    },
  },
  root: '.', // Ensure root is current directory
  build: {
    outDir: 'dist',
  }
});
