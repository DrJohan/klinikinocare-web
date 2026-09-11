import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        en: 'en/index.html',
        ms: 'ms/index.html',
        biowound: 'biowound/index.html',
      },
    },
  },
});
