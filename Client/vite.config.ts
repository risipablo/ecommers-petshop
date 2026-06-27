// vite.config.ts - Configurar split de CSS
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'critical'
          }

          if (id.includes('@mui/icons-material') || id.includes('lucide-react')) {
            return 'vendor'
          }
        }
      }
    },
    
    cssCodeSplit: true
  }
})