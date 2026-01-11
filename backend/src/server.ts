
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = Number(process.env.PORT) || 5000;
// 0.0.0.0 binds to all network interfaces. 
// This is required for Docker/Railway and works perfectly for local development too.
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Server is running!
  🔉 Listening on http://${HOST}:${PORT}
  `);
});
