# apéro club, the web app

A daily French lesson for A2 to B1 learners, built from the Claude Design handoff in `../project/` (`Apero App v2.dc.html`). It shows today's lesson: a multi-voice story, a quiz that explains every answer, written vs. spoken French, a describe-the-scene exercise, and the grammar notes behind the story.

Static site, free to host, no accounts and no payments.

## Run it

```sh
cd app
npm install
npm run dev        # http://localhost:5173  (add ?date=YYYY-MM-DD to preview a lesson)
npm test           # validates every lesson file + unit tests
npm run build      # static site in dist/
```

## How it's organised

```
lessons/YYYY-MM-DD.json      one file per day: the lesson data
public/lessons/YYYY-MM-DD/   that lesson's images
docs/lesson-format.md        how to write a lesson
docs/lesson-template.json    a starting point to copy
src/lesson/schema.ts         the lesson format (zod), and its validation rules
src/lesson/load.ts           finds and loads today's lesson
src/screens/                 the lesson template: one file per screen
src/ds/                      design system components, ported from the apéro club DS bundle
src/audio/                   French voice casting and story playback (browser speech synthesis)
src/styles/                  design tokens copied from the DS, plus app layout
```

## Deploying (GitHub Pages)

`.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`. One-time setup: in the repo on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**. The site appears at `https://<user>.github.io/<repo>/`.

Lessons can be pushed ahead of time: the app picks the right one on the learner's device each day, so there's no need to redeploy daily.

## What's different from the prototype

- **No live corrections yet.** The Claude API has no free tier, so **Check** in step 04 shows the lesson's worked example (a typical description with every correction explained). The example uses the same data shape the AI tutor returned, so a serverless check can slot in later.
- **No accounts, Lessons archive, Account tab or paywall.** The tab bar has Today and Grammar.
- **Progress and preferences** (finished steps, quiz score, your text, Slow and EN) are saved in the browser's local storage, per device.
- **Voices** are the learner's device voices, as in the prototype. They sound best in Microsoft Edge and Safari with downloaded Premium voices.
