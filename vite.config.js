// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   port: 5173,
//   resolve: {
//     alias: {
//       '@components': path.resolve(__dirname, './src/components'),
//     },
//   },
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      // add other aliases if you use them, e.g.:
      // '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },
  },
})
