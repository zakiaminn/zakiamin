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
    // The portfolio at /, the Batin write-up at /batin/, and the 404 page
    // Cloudflare serves for any path that matches no file.
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        batin: path.resolve(import.meta.dirname, 'batin/index.html'),
        notFound: path.resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
