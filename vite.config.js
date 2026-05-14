import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configurarea Vite pentru proiectul Vue 3 + Tailwind + DaisyUI
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Proxy pentru API-ul de backend — redirecționează cererile /api către serverul Express
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
