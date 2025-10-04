import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001', // Your Express server port
      changeOrigin: true,
      secure: false,
    },
  },
},
 }
)
