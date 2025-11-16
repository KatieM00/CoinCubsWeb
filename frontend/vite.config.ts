import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure proper module initialization order
        manualChunks(id) {
          // Core React deps
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Router
          if (id.includes('node_modules/@tanstack/react-router')) {
            return 'vendor-router';
          }
          // Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          // UI components
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-ui';
          }
          // DO NOT chunk app code separately - let Rollup handle the dependency order
        },
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle these to ensure proper initialization
    include: ['react', 'react-dom', '@tanstack/react-query', '@tanstack/react-router'],
  },
});
