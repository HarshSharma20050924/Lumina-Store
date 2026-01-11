
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-root-to-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
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
  build: {
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    port: 3002,
    strictPort: true,
    host: true,
  }
});
