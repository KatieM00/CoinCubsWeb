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
        manualChunks: {
          // Group core dependencies together
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['@tanstack/react-router'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu', '@radix-ui/react-checkbox'],
          // Keep auth and contexts together to prevent circular dependency issues
          'app-core': [
            './src/hooks/useAuth.tsx',
            './src/contexts/DemoContext.tsx',
            './src/contexts/DemoDataContext.tsx',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    // Remove lucide-react since we no longer use it
    exclude: ['lucide-react'],
  },
});
