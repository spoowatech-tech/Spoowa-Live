import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/store': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      // Only proxy /auth/customer/* API calls to Medusa backend
      // This avoids conflicting with the frontend /auth page route
      '/auth/customer': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      }
    },
  },
});

