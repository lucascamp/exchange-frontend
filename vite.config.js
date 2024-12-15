import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { acceptHMRUpdate } from 'pinia'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy:{
      '/api': {
        target: "http://localhost",
        changeOrigin: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    }
  }
})
