import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import * as fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: {
      key: fs.readFileSync('./.certs/key.pem'),
      cert: fs.readFileSync('./.certs/cert.pem')
    },
    hmr: {
      host: 'localhost',
      path: ''
    }
  }
})