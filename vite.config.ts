// vite.config.ts - Complete configuration
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Parse allowed hosts from environment variable
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ?.split(',')
    .map(host => host.trim())
    .filter(host => host.length > 0) || ['localhost'];
  
  // Configure PocketBase proxy
  const pbProxyUrl = env.VITE_PB_PROXY_URL || 'http://localhost:8090';
  const pbProxy = {
    target: pbProxyUrl,
    changeOrigin: true,
    secure: mode === 'production',
  };

  // Log configuration in development
  if (mode === 'development') {
    console.log('🚀 Vite Config:');
    console.log('   Mode:', mode);
    console.log('   Port:', env.VITE_PORT || '5173');
    console.log('   PocketBase:', pbProxyUrl);
    console.log('   Allowed Hosts:', allowedHosts);
  }

  return {
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      host: true, // Allow external connections
      allowedHosts: allowedHosts,
      proxy: {
        // PocketBase admin interface
        "/_": pbProxy,
        // PocketBase API
        "/api": pbProxy,
      }
    },
    
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT) || 4173,
      host: true,
    },

    build: {
      outDir: "pb_public",
      emptyOutDir: true,
      // Add source maps in development
      sourcemap: mode === 'development',
      // Optimize for production
      minify: mode === 'production',
    },
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    plugins: [
      tanstackRouter({ 
        target: 'react', 
        autoCodeSplitting: true 
      }),
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
          name: env.VITE_APP_NAME || 'tasks-pwa',
          short_name: env.VITE_APP_SHORT_NAME || 'tasks-pwa',
          description: env.VITE_APP_DESCRIPTION || 'tasks-pwa',
          theme_color: env.VITE_THEME_COLOR || '#ffffff',
          background_color: env.VITE_BACKGROUND_COLOR || '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },

        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          // Exclude large files or sensitive files
          globIgnores: ['**/node_modules/**/*'],
        },

        devOptions: {
          enabled: env.VITE_SW_DEV === 'true', // Enable SW in dev if needed
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },
        
        workbox: {
          runtimeCaching: [
            {
              urlPattern: '/',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'root-cache',
                networkTimeoutSeconds: 2,
              },
            },
            // Cache API responses
            {
              urlPattern: /^\/api\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 5 * 60, // 5 minutes
                },
              },
            },
            // Cache static assets
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ]
        }
      })
    ],

    // Environment-specific optimizations
    ...(mode === 'development' && {
      // Development-only config
      define: {
        __DEV__: true,
      },
    }),

    ...(mode === 'production' && {
      // Production-only config
      define: {
        __DEV__: false,
      },
      build: {
        ...{
          outDir: "pb_public",
          emptyOutDir: true,
        },
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['@tanstack/react-router'],
            },
          },
        },
      },
    }),
  };
});