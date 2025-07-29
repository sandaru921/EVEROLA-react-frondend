import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: {
  //     key: './localhost-key.pem', // Point to the key file you moved
  //     cert: './localhost-cert.pem', // Point to the certificate file you moved
  //   },
    port: 5173,
  // },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});