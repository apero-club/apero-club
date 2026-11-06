import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * lessons/index.json: the lesson numbers on the site, so the app can find the newest
 * lesson without trying files one by one. Generated at build time (and on the fly in dev).
 */
function lessonIndex(): Plugin {
  const dir = fileURLToPath(new URL('./public/lessons', import.meta.url));
  const make = () => JSON.stringify({
    lessons: readdirSync(dir).flatMap(f => { const m = /^lesson-(\d{3,})\.json$/.exec(f); return m ? [Number(m[1])] : []; }).sort((a, b) => a - b),
  });
  return {
    name: 'lesson-index',
    configureServer(server) {
      server.middlewares.use('/lessons/index.json', (_req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(make()); });
    },
    generateBundle() { this.emitFile({ type: 'asset', fileName: 'lessons/index.json', source: make() }); },
  };
}

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/repo-name/"). Locally it's "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), lessonIndex()],
  // css.include lets tests read colors.css (?raw) for the colour rules in src/ds/color.ts.
  test: { environment: 'node', css: { include: [/colors\.css/] } },
});
