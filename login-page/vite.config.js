import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // This polyfills 'global' to 'window' for libraries like sockjs-client
    global: 'window',
  },
})