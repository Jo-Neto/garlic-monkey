import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import readFileSync from 'file-system';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../keys-and-certificates/key-rsa.pem'),
      cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
    },
    port: 443
  }
});