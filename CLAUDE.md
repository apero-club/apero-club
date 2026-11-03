# apéro club

A daily French lesson web app for A2 to B1 learners living in Paris. The app is in `app/` (React + Vite, deployed on Vercel behind an access code); `project/` and `chats/` are the original Claude Design handoff, kept for reference.

## Writing or editing lessons

**Follow `app/STYLE.md` for every lesson.** It sets story length, level, tone, how grammar notes are written, the quiz format, the scene and ambience prompts. Lesson 1 (`app/public/lessons/lesson-001.json`) is the reference example. `app/docs/lesson-format.md` documents the file format.

- Lessons are `app/public/lessons/lesson-NNN.json`, numbered with no gaps; images go in `app/public/lessons/lesson-NNN/`. `app/public/lessons/schedule.json` is in `"mode": "open"` for now: every pushed lesson is live and Today is the newest, so a new lesson is visible to testers as soon as it's pushed. (In `"dated"` mode lesson N goes live N-1 days after `startDate`, capped by `readyThrough`; raise that only when the user has reviewed a lesson.)
- Run `npm test` in `app/` before committing: it validates the format and the "(checked)" rules of STYLE.md.
- Reuse recurring characters' ids (`narrator`, `madame-lefevre`, `la-boulangere`) so they keep their voices; give new characters a `description`. Voices are cast from `app/voices/pool.json` and approved in `app/voices/cast.json`.
- Don't edit `app/public/lessons/*/audio/`: the "Record lesson audio" GitHub Action records it with ElevenLabs after a push. A new lesson costs about 2,000 characters of ElevenLabs credit.

## Code notes

- `app/middleware.js` (the access-code gate, daily lesson gating and preview mode) must stay one plain JavaScript file with no imports: Vercel deploys it unbundled.
- The phone layout is in `app/src/screens/` (from `Apero App v2.dc.html`), the desktop layout in `app/src/desktop/` (from `Apero v3.dc.html`).
