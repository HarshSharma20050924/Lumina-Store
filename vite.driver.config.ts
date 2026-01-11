
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-root-to-driver',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url === '/') {
            req.url = '/driver.html';
            return next();
          }
          if (
            url.startsWith('/api') ||
            url.startsWith('/@') ||
            url.startsWith('/src') ||
            url.startsWith('/node_modules') ||
            url.includes('.')
          ) {
            return next();
          }
          req.url = '/driver.html';
          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        driver: resolve(__dirname, 'driver.html'),
      },
    },
  },
  server: {
    port: 3003,
    strictPort: true,
    host: true,
  }
});
