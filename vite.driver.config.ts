
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-root-to-driver',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          
          // 1. Explicitly serve driver.html for root
          if (url === '/') {
            req.url = '/driver.html';
            return next();
          }

          // 2. Allow API, internal Vite requests, and static assets with extensions to pass through
          if (
            url.startsWith('/api') ||
            url.startsWith('/@') ||
            url.startsWith('/src') ||
            url.startsWith('/node_modules') ||
            url.includes('.')
          ) {
            return next();
          }

          // 3. For any other "page" route (SPA fallback), rewrite to driver.html
          req.url = '/driver.html';
          next();
        });
      },
    },
  ],
  server: {
    port: 3003,
    strictPort: true,
    host: true, // Listen on 0.0.0.0
  }
});
