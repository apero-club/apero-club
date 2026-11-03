# Writing a lesson

Every apéro club lesson is one JSON file. The app reads it and renders it through the same template every day, as a phone layout or, on screens 900px and wider, the desktop layout:

**Today → 01 Écouter et lire → 02 Comprendre → 03 Comme on dit → 04 Décrire → Séance terminée**, plus the **Grammar** tab.

The source of truth for the format is [`src/lesson/schema.ts`](../src/lesson/schema.ts). `npm test` checks every lesson against it, and the deploy fails if a lesson is broken.

## Adding a new day

1. Copy [`lesson-template.json`](./lesson-template.json) to `lessons/YYYY-MM-DD.json`. The file name is the day it goes live, and must match the `date` inside.
2. Put its images in `public/lessons/YYYY-MM-DD/`.
3. Preview it: `npm run dev`, then open `http://localhost:5173/?date=YYYY-MM-DD`.
4. Run `npm test`, then commit and push. Vercel redeploys.

You can push lessons ahead of time. The app shows the newest lesson dated today or earlier, using the learner's local date, so lessons switch at midnight wherever the learner is. If a day has no lesson, the previous one stays up. Each lesson is loaded as its own small file, so a long archive doesn't slow the app down.

## The fields

| Field | What it is |
|---|---|
| `date` | `YYYY-MM-DD`, same as the file name. |
| `title`, `summary` | Shown in the Today hero. Title in French, summary in English. |
| `level` | Defaults to `"A2 to B1"`. Not shown in the app yet. |
| `minutes` | Time for each step: `story`, `quiz`, `phrases`, `describe`. The Today total is their sum. |
| `heroWide` | Optional. The 2×2 grid beside the hero on desktop: 4 squares, each an illustration, a kit shape, or a pattern `{ "pattern": "checker" \| "halves" \| "clouds", "a", "b" }`. Make one or two about the story, and give one shape eyes. Without it, desktop uses a checker plus the 3 `hero` squares. |
| `place` | Optional. A short place line under the story title on desktop, e.g. `"rue des Martyrs, 9e"`. |
| `hero` | Exactly 3 squares under the phone hero. Each is either an illustration `{ "image", "bg", "alt" }` or a kit shape `{ "shape", "bg", "fg", "eyes"?, "blink"? }`. Make at least one about the story (the croissant), and give at most one shape eyes. |
| `cast` | The voices in the story. See below. |
| `story` | Paragraphs, each a list of lines. See below. |
| `notes` | The grammar notes ("Pourquoi ?"). Their order is the order in the Grammar tab. |
| `quiz` | Comprehension questions. See below. |
| `phrases` | "Ce qu’on écrit, ce qu’on dit" pairs: `written`, `spoken`, `register` (`Soigné`, `Courant` or `Familier`) and a `note` explaining why. |
| `describe` | The writing step. See below. |

Colours are design system tokens without the `--`: `violet-500`, `sky-700`, `orange-500` and so on. Shapes are `arch`, `circle`, `halves`, `flower`, `asterisk` and `pill`.

### Cast

```json
{ "id": "baker", "name": "La boulangère", "color": "sky-700",
  "critter": { "kind": "jelly", "color": "sky-500" }, "voice": "female" }
```

- `color` is the text colour of that person's lines. Stick to `ink-900`, `violet-500` and `sky-700`, which pass contrast on the page.
- `role` (optional) is shown under the name in the desktop cast key, e.g. `"the baker"`.
- `label` (optional) colours the small name above their dialogue. It defaults to `color`.
- `id` is the character's identity across all lessons: **reuse the same id** when a character comes back (`narrator`, `madame-lefevre`), and they keep their voice.
- `description` (required) is a sentence about age, personality and how they talk. It's used to pick a voice for a new character, e.g. `"A young Parisian student in her twenties. Bright, quick, a little sarcastic."`
- `voice` is `male` or `female`. Put the narrator first.

### Story lines

```json
{ "id": "baker-sold-out", "speaker": "baker",
  "fr": "— Désolée, on n’en a plus, des pains au chocolat.",
  "en": "“Sorry, we’re out of pains au chocolat.”", "note": "pronom-en" }
```

- Start spoken dialogue with `— `. A paragraph whose first line starts with a dash is shown as dialogue, with the speaker's name above it.
- `note` adds a **why?** chip that opens that grammar note.
- `id` is only needed if a listening question plays the line.
- When narration quotes someone in «guillemets», add `"quoteSpeaker": "neighbour"` so the quote plays in that person's voice.
- Use real French typography: `’`, «guillemets», and a narrow no-break space before `! ? : ;` (or a regular space, as in the first lesson).

### Grammar notes

Each note has an `id`, a `kicker` (e.g. "Temps du passé"), a `title`, a one-sentence `short`, `body` paragraphs, `examples` (`fr`, `en`, `tag`), a `spoken` paragraph ("Spoken, in Paris") and a `trap` (`wrong`, `right`, `why`). Explain the *why*, in English.

### Quiz

```json
{ "kind": "Écoute", "prompt": "Listen to the baker. What is she telling the narrator?",
  "listen": "baker-sold-out", "note": "pronom-en",
  "options": [
    { "text": "They only have pains au chocolat left.", "why": "…" },
    { "text": "They’ve run out of pains au chocolat, but there are croissants.", "correct": true, "why": "…" },
    { "text": "The pains au chocolat will be ready soon.", "why": "…" } ] }
```

- 2 or 3 options, exactly one with `"correct": true`. Every option needs a `why`: the learner sees it after answering.
- Options appear in the order written, so **move the right answer around** between questions.
- `listen` plays a story line (by `id`) and hides the transcript until answered. `quote` shows a line with a play button. Use one or neither.
- `note` links the question to a grammar note.

### Describe

- `image`: a square illustration, cropped into an arch. `imagePosition` sets the crop (CSS `object-position`). `caption` (optional) appears under it on desktop.
- `instructions`, `placeholder`, and up to 8 `helpers` (tap-to-insert phrases; a trailing `…` is dropped when inserted).
- `scene`: a plain-English description of the image. It isn't shown. It's there for when a live AI check is added.
- `sample`: a typical learner description with mistakes (`text`) and its worked `result`. **Check** shows this result, since there is no live correction yet.

The `result` uses the same shape the prototype's AI tutor returned, so a live check can return it directly later:

- `segments`: the text split into unchanged parts `{ "t" }` and changes `{ "from", "to", "n" }`. Joining every `t` and `from` in order must give back `text` exactly; the test checks this.
- `corrections`: one per change, numbered in order, with a short `rule` (4 words max) and a `why`.
- `corrected`, `spoken` (how a Parisian would say it), `spokenNote`, and `praise` (5 words max).

## Audio (ElevenLabs)

Every French line can play a recorded voice instead of the device's built-in one. Recordings are made once per lesson, not when learners listen, so visits cost nothing.

- **What gets recorded:** each story line (a narration line that quotes someone is split, so the quote is in that character's voice), the quiz quotes, both sides of each phrase, the grammar examples, and the spoken version of the sample correction. Everything except the story is read by the first cast member.
- **Voices:** see "Voice casting" below.
- **Automatic:** when you push a lesson to `main`, the **Record lesson audio** GitHub Action records anything missing and commits it to `public/lessons/<date>/audio/`. Edited lines are re-recorded; removed ones are deleted; unchanged ones are kept.
- **Cost check:** `npm run record-audio -- --dry-run` prints how many characters a run would use. The first lesson is about 1,900 characters.
- **No recordings yet?** The app falls back to device voices for any line without a recording, so a lesson works before its audio exists.

### Story ambience

Add an optional `ambience` to a lesson for background sound during the story:

```json
"ambience": {
  "prompt": "Inside a small Paris bakery on a rainy Saturday morning: a quiet murmur of customers waiting in line, a door bell, paper bags rustling… No music, no clear speech.",
  "volume": 0.18
}
```

- The same GitHub Action generates it once with ElevenLabs Sound Effects (a 30-second loop) and commits it. Changing the `prompt` generates a new one.
- Describe a place and its sounds. Always ask for **no music and no clear speech**, so it never competes with the French.
- It plays quietly, only while the story audio plays, and fades out on pause or when leaving the story. Learners can turn it off with the **Ambience** button; the choice is remembered.
- `volume` is 0 to 1 (default 0.18). Keep it low.

### Voice casting

Characters keep one voice across every lesson, and no two characters in a story share one.

- **`voices/pool.json`**: the ElevenLabs voices to choose from. For each, fill in `name`, `gender`, `age` (`young`, `middle`, `older`), `accent` and a few `tags` describing the sound (`warm`, `bright`, `dry`, `deep`…). Add more voices any time.
- **`voices/cast.json`**: who has which voice. The recording script writes it; you only change `status`.
- **A new character** gets the best match from the pool: the right gender, a voice no other character uses if possible (never one already in the same story), then the best fit between the voice's age and tags and the words in the character's `description`. It starts as `"pending"`, with a short sample.
- **Listen** on the site at `?casting` (e.g. `https://your-site/?casting`).
- **Approve or reject** by editing `voices/cast.json` on GitHub: set the character's `status` to `"approved"` (their lines get recorded) or `"rejected"` (they get the next-best voice and a new sample; rejected voices are never offered to them again).
- Until a character is approved, their lines play with the device voice.
- If the pool runs out of voices of a gender, the recording run stops and says so; add voices to the pool.
