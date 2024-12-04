import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true, eslint: { files: ['./src'] } }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0', // Listen on all network interfaces
    strictPort: true, // Ensure Vite throws an error if port 3000 is taken
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
