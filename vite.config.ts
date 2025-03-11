import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import {allowedHosts, pbProxy} from './settings.js'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: allowedHosts,
    proxy: {
      "/_": pbProxy,
      "/api": pbProxy,
    }
  },
  build: {
    outDir: "pb_public",
    emptyOutDir: true
  },  
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(), 
    tailwindcss(),
    VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    registerType: 'prompt',
    injectRegister: "auto",

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'tasks-pwa',
      short_name: 'tasks-pwa',
      description: 'tasks-pwa',
      theme_color: '#ffffff',
      display: 'standalone',
    },

    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'StaleWhileRevalidate', // Use StaleWhileRevalidate for online-first behavior
          options: {
            cacheName: 'root-cache',
            networkTimeoutSeconds: 2, // Time to wait for the network response
          },
        },
      ]
    }
  })],
})