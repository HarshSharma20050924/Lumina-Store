
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = Number(process.env.PORT) || 5000;
const HOST = '127.0.0.1'; // Force IPv4 to match Caddy and Vite configs

app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Server is running!
  🔉 Listening on http://${HOST}:${PORT}
  📭 API: http://api.local
  `);
});
