// ============================================
// VITE BUILD CONFIGURATION
// ============================================
// Vite is a next-generation build tool and dev server
// for modern web projects
// Official Docs: https://vitejs.dev/config/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration object
export default defineConfig({
  // Enable React support with Fast Refresh
  // Provides HMR (Hot Module Replacement) for instant component updates
  plugins: [react()],
})
