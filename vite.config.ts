import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
    // In dev, requests to /api go to the local backend (`cd server && npm run dev`),
    // so there is no CORS. Enable it by leaving VITE_API_URL empty in .env.development.local
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:5000',
    },
  },
})
