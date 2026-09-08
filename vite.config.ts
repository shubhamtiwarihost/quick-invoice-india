import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Use root base by default so SPA sub-routes (/merge, /split, etc.) load assets cleanly
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'pdfjs-viewer';
          }
          if (id.includes('node_modules/pdf-lib') || id.includes('node_modules/@pdfsmaller')) {
            return 'pdf-lib-engine';
          }
          if (id.includes('node_modules/jspdf')) {
            return 'jspdf-converter';
          }
          if (id.includes('node_modules/jszip') || id.includes('node_modules/file-saver')) {
            return 'zip-export';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-icons';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
