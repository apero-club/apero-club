# apéro club, the web app

A daily French lesson for A2 to B1 learners, built from the Claude Design handoff in `../project/`: `Apero App v2.dc.html` for phones and `Apero v3.dc.html` for desktop. It shows today's lesson: a multi-voice story, a quiz that explains every answer, written vs. spoken French, a describe-the-scene exercise, and the grammar notes behind the story.

Hosted free on Vercel behind a shared access code. No accounts and no payments.

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
src/screens/                 the phone layout (Apero App v2): one file per screen
src/desktop/                 the desktop layout (Apero v3), used at 900px and wider
src/ds/                      design system components, ported from the apéro club DS bundle
src/audio/                   French voice casting and story playback (browser speech synthesis)
src/styles/                  design tokens copied from the DS, plus app layout
```

## Deploying (Vercel, behind an access code)

Vercel builds from this `app/` folder on every push (`main` is production; other branches get preview URLs). `vercel.json` runs the tests first, so a broken lesson never deploys. GitHub Actions (`.github/workflows/ci.yml`) runs the same checks but doesn't deploy.

**Access code.** `middleware.ts` runs on Vercel before every request, including the app's scripts and lesson files. Until a visitor enters the code, they only get the access-code screen (`gate/page.ts`). A correct code sets an HttpOnly cookie for 400 days, so a device only enters it once. The code is never in the repo or sent to the browser.

- The code comes from the Vercel environment variable `ACCESS_CODE`. Changing an environment variable only takes effect after a redeploy (Deployments → ⋯ → Redeploy, no code change needed).
- To change it instantly with no redeploy, connect a Vercel **Edge Config** store to the project and add an item `accessCode`; it takes priority over `ACCESS_CODE`.
- Codes ignore case and surrounding spaces. Changing the code signs every device out.
- If no code is set, nobody gets in.
- Local `npm run dev` has no gate.

**Search engines.** Every response carries `X-Robots-Tag: noindex, nofollow`, and the pages have a matching robots meta tag.

Lessons can be pushed ahead of time: the app picks the right one on the learner's device each day, so there's no need to redeploy daily.

## What's different from the prototype

- **No live corrections yet.** The Claude API has no free tier, so **Check** in step 04 shows the lesson's worked example (a typical description with every correction explained). The example uses the same data shape the AI tutor returned, so a serverless check can slot in later.
- **No accounts, Lessons archive, Account tab or paywall.** The tab bar has Today and Grammar.
- **Progress and preferences** (finished steps, quiz score, your text, Slow and EN) are saved in the browser's local storage, per device.
- **Voices** are the learner's device voices, as in the prototype. They sound best in Microsoft Edge and Safari with downloaded Premium voices.
