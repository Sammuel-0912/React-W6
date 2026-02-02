import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/React-W6/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
