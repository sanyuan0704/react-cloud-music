import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import requirePlugin from 'vite-plugin-require';

export default defineConfig({
  plugins: [
    requirePlugin(),
    react(),
  ]
})