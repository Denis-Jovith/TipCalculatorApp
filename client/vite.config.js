import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['seed/profile.jpeg', 'logo/djb-mark.svg'],
      manifest: {
        name: 'Denis Jovitus Buberwa — Portfolio',
        short_name: 'DJB Portfolio',
        description:
          'Portfolio of Denis Jovitus Buberwa (Denis Jovith, Captain D, DJB) — Software Developer, ICT Professional & Cybersecurity Enthusiast.',
        theme_color: '#080b1a',
        background_color: '#0c22de',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/logo/djb-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        // Activate a newly-deployed service worker immediately instead of waiting for every
        // open tab to close first — otherwise visitors can keep seeing a stale cached build
        // for a while after an update goes live.
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,webp}'],
        // The 42MB Blender showreel and large hero photos should be streamed from the
        // network, not force-cached into the service worker's precache.
        globIgnores: ['**/seed/*.mp4', '**/seed/blender-*.png'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', expiration: { maxEntries: 50, maxAgeSeconds: 300 } }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/seed/'),
            handler: 'CacheFirst',
            options: { cacheName: 'media-cache', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      '/sitemap.xml': 'http://localhost:5000',
      '/robots.txt': 'http://localhost:5000'
    }
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      '/sitemap.xml': 'http://localhost:5000',
      '/robots.txt': 'http://localhost:5000'
    }
  }
});
