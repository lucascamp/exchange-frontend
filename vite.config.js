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
        target: "https://c05f-2804-214-c010-3596-9d69-570e-52ca-accc.ngrok-free.app/",
        changeOrigin: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    }
  }
})
