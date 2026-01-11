
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-root-to-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          // Rewrite root or SPA routes to admin.html, BUT exclude Vite internals, API, and static assets
          if (
            url === '/' || 
            (
              !url.includes('.') && 
              !url.startsWith('/api') && 
              !url.startsWith('/@') && 
              !url.startsWith('/src') &&
              !url.startsWith('/node_modules')
            )
          ) {
            req.url = '/admin.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 3002,
    strictPort: true,
    host: true, // Listen on 0.0.0.0
  }
});
