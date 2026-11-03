import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/repo-name/"). Locally it's "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: { environment: 'node' },
});
