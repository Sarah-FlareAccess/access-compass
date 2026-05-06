import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
          'vendor-xlsx': ['xlsx'],
          'data-help': [
            './src/data/help/before-arrival',
            './src/data/help/during-visit',
            './src/data/help/getting-in',
            './src/data/help/service-support',
            './src/data/help/toilets-amenities',
            './src/data/help/organisation',
            './src/data/help/events',
          ],
        },
      },
    },
  },
  plugins: [
    react(),
  ],
})
