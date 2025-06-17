import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to your Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Your Flask server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Can be false if your backend is HTTP
      },
    },
  },
})

