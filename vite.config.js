import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Two pages: the portfolio at / and the Batin write-up at /batin/.
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        batin: path.resolve(import.meta.dirname, 'batin/index.html'),
      },
    },
  },
})
