/**
 * The apéro club lesson format.
 *
 * One lesson = one JSON file in `app/lessons/`, named `YYYY-MM-DD.json` after the
 * day it goes live. Its images live in `app/public/lessons/YYYY-MM-DD/`.
 * Every lesson renders through the same template: Today → Story → Quiz → Say it →
 * Describe → Séance terminée, plus the Grammar tab.
 *
 * See docs/lesson-format.md for an author-facing walkthrough.
 */
import { z } from 'zod';

/** A design-system colour token without the `--` prefix, e.g. "violet-500". */
const Token = z
  .string()
  .regex(/^(violet|lilac|pink|orange|sun|green|sky|cream|ink)-\d{2,3}$|^white$/, 'Use a design token like "violet-500"');

const Shape = z.enum(['arch', 'circle', 'halves', 'flower', 'asterisk', 'pill']);
const Expression = z.enum(['look', 'wide', 'dots', 'happy', 'sleepy', 'closed', 'wink']);
const CritterKind = z.enum(['arch', 'jelly', 'bean', 'dome', 'flower', 'diamond', 'macaron', 'spark', 'olive', 'tower', 'sugar', 'bowl']);

/** One square of the Today hero strip: either a kit shape or a story illustration. */
const HeroTile = z.union([
  z.object({
    shape: Shape,
    bg: Token,
    fg: Token,
    accent: Token.optional(),
    /** Eyes on the shape. At most one tile per strip should have eyes. */
    eyes: Expression.optional(),
    blink: z.boolean().optional(),
  }).strict(),
  z.object({
    /** File in public/lessons/<date>/, drawn flat in the brand style (SVG preferred). */
    image: z.string().min(1),
    bg: Token,
    alt: z.string().default(''),
  }).strict(),
  z.object({
    /** A brand pattern (desktop hero only). Never behind text. */
    pattern: z.enum(['checker', 'halves', 'clouds']),
    a: Token,
    b: Token,
  }).strict(),
]);

const CastMember = z.object({
  /**
   * The character's id, used by story lines and by the voice cast registry
   * (voices/cast.json). Use the SAME id whenever this character appears in a
   * later lesson, so they keep their voice. E.g. "narrator", "madame-lefevre".
   */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** Shown in the cast key and above dialogue, e.g. "Madame Lefèvre". */
  name: z.string().min(1),
  /** Shown under the name in the desktop cast key, e.g. "the baker". */
  role: z.string().optional(),
  /**
   * A short description used to pick a voice when the character first appears:
   * age, personality, how they talk. E.g. "An older Parisian woman. Warm but dry, teasing."
   */
  description: z.string().min(10).max(300),
  /** Text colour for this speaker's lines. Keep to ink-900, violet-500, sky-700 (AA on paper). */
  color: Token,
  /** Colour for the small name label above dialogue. Defaults to `color`. */
  label: Token.optional(),
  critter: z.object({ kind: CritterKind, color: Token }).strict(),
  /** Which kind of voice to use. Voices are picked from voices/pool.json and kept in voices/cast.json. */
  voice: z.enum(['male', 'female']),
}).strict();

const Line = z.object({
  /** Optional id so quiz questions can play this line. */
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  speaker: z.string(),
  /** French text. Start spoken dialogue with "— ". */
  fr: z.string().min(1),
  en: z.string().min(1),
  /** A grammar note id: adds a "why?" chip after the line. */
  note: z.string().optional(),
  /**
   * When a narration line quotes someone in «guillemets», the quoted part plays in
   * this speaker's voice.
   */
  quoteSpeaker: z.string().optional(),
}).strict();

const Note = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Small label, e.g. "Temps du passé". */
  kicker: z.string(),
  title: z.string(),
  /** One-sentence summary shown on the Grammar card and the sheet header. */
  short: z.string(),
  body: z.array(z.string()).min(1),
  examples: z.array(z.object({ fr: z.string(), en: z.string(), tag: z.string() }).strict()).min(1),
  /** "Spoken, in Paris" box: how the rule plays out in real speech. */
  spoken: z.string(),
  trap: z.object({ wrong: z.string(), right: z.string(), why: z.string() }).strict(),
}).strict();

const QuizOption = z.object({
  text: z.string().min(1),
  correct: z.boolean().optional(),
  /** Shown after answering: why this option is right, or why it's wrong. */
  why: z.string().min(1),
}).strict();

const Question = z.object({
  /** Shown in the band, e.g. "Écoute", "Grammaire", "Lecture", "Compréhension". */
  kind: z.string(),
  prompt: z.string(),
  /** Listening question: id of the story line to play (transcript hidden until answered). */
  listen: z.string().optional(),
  /** Reading question: a quote shown in the band, with a play button. */
  quote: z.string().optional(),
  /** Grammar note id behind this question, offered after answering. */
  note: z.string().optional(),
  /** Options appear in this order. Put the right one in different positions across questions. */
  options: z.array(QuizOption).min(2).max(3),
}).strict();

const Phrase = z.object({
  written: z.string(),
  spoken: z.string(),
  register: z.enum(['Soigné', 'Courant', 'Familier']),
  note: z.string(),
}).strict();

/**
 * The same shape the AI tutor returns, so a live "Check" can drop in later.
 * Concatenating each segment's `t` or `from` reproduces the learner's text exactly.
 */
export const CorrectionResult = z.object({
  segments: z.array(z.union([
    z.object({ t: z.string() }).strict(),
    z.object({ from: z.string(), to: z.string(), n: z.number().int().positive() }).strict(),
  ])),
  corrections: z.array(z.object({
    n: z.number().int().positive(),
    from: z.string(),
    to: z.string(),
    /** Rule name, 4 words max. */
    rule: z.string(),
    why: z.string(),
  }).strict()),
  corrected: z.string(),
  spoken: z.string(),
  spokenNote: z.string(),
  /** Hand-note praise, 5 words max. */
  praise: z.string(),
}).strict();

const Describe = z.object({
  /** File in public/lessons/<date>/. Square, cropped into an arch. */
  image: z.string(),
  alt: z.string(),
  /** Where the arch crop anchors, CSS object-position. */
  imagePosition: z.string().default('50% 100%'),
  /** Small caption under the image on desktop. */
  caption: z.string().optional(),
  instructions: z.string(),
  placeholder: z.string(),
  /** Tap-to-insert phrase chips. A trailing "…" is stripped when inserted. */
  helpers: z.array(z.string()).max(8),
  /** Plain-English description of the image, for a future AI tutor. Never shown. */
  scene: z.string(),
  /** A typical learner description with mistakes, and its worked corrections. */
  sample: z.object({ text: z.string(), result: CorrectionResult }).strict(),
}).strict();

export const LessonSchema = z.object({
  /** Day the lesson goes live, YYYY-MM-DD. Must match the file name. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  level: z.string().default('A2 to B1'),
  minutes: z.object({ story: z.number(), quiz: z.number(), phrases: z.number(), describe: z.number() }).strict(),
  /** Exactly 3 squares under the phone Today hero. Make at least one about the story. */
  hero: z.array(HeroTile).length(3),
  /**
   * The 2×2 grid beside the desktop Today hero. One or two squares about the story,
   * the rest shapes or a pattern, with one blinking face. Defaults to a checker
   * pattern plus the 3 `hero` squares.
   */
  heroWide: z.array(HeroTile).length(4).optional(),
  /** Short place line for the desktop story header, e.g. "rue des Martyrs, 9e". */
  place: z.string().optional(),
  cast: z.array(CastMember).min(1),
  /** Paragraphs of lines. A paragraph whose first line starts with "—" is shown as dialogue. */
  story: z.array(z.array(Line).min(1)).min(1),
  notes: z.array(Note).min(1),
  quiz: z.array(Question).min(1),
  phrases: z.array(Phrase).min(1),
  describe: Describe,
  /**
   * Background sound for the story, generated once by ElevenLabs Sound Effects from
   * this description. Plays quietly, looped, while the story audio plays.
   */
  ambience: z.object({
    /** What it should sound like. Ask for no music and no clear speech, so it never competes with the French. */
    prompt: z.string().min(10).max(450),
    /** Loudness under the voices, 0 to 1. Keep it low. */
    volume: z.number().min(0).max(1).default(0.18),
  }).strict().optional(),
}).strict().superRefine((l, ctx) => {
  const cast = new Set(l.cast.map(c => c.id));
  const notes = new Set(l.notes.map(n => n.id));
  const lines = l.story.flat();
  const lineIds = new Set(lines.flatMap(x => (x.id ? [x.id] : [])));
  const err = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });

  if (notes.size !== l.notes.length) err(['notes'], 'Note ids must be unique');
  l.story.forEach((p, pi) => p.forEach((x, li) => {
    const at = ['story', pi, li];
    if (!cast.has(x.speaker)) err([...at, 'speaker'], `Unknown speaker "${x.speaker}"`);
    if (x.quoteSpeaker && !cast.has(x.quoteSpeaker)) err([...at, 'quoteSpeaker'], `Unknown speaker "${x.quoteSpeaker}"`);
    if (x.quoteSpeaker && !x.fr.includes('«')) err([...at, 'quoteSpeaker'], 'quoteSpeaker needs a «quote» in the line');
    if (x.note && !notes.has(x.note)) err([...at, 'note'], `Unknown note "${x.note}"`);
  }));
  l.hero.forEach((t, i) => { if ('pattern' in t) err(['hero', i], 'Patterns are for heroWide only'); });
  l.quiz.forEach((q, qi) => {
    const right = q.options.filter(o => o.correct).length;
    if (right !== 1) err(['quiz', qi, 'options'], `Exactly one option must be correct (found ${right})`);
    if (q.listen && !lineIds.has(q.listen)) err(['quiz', qi, 'listen'], `No story line with id "${q.listen}"`);
    if (q.listen && q.quote) err(['quiz', qi], 'Use either listen or quote, not both');
    if (q.note && !notes.has(q.note)) err(['quiz', qi, 'note'], `Unknown note "${q.note}"`);
  });
  const s = l.describe.sample;
  const rebuilt = s.result.segments.map(g => ('t' in g ? g.t : g.from)).join('');
  if (rebuilt !== s.text) err(['describe', 'sample', 'result', 'segments'], 'Segments must rebuild sample.text exactly');
});

export type Lesson = z.output<typeof LessonSchema>;
export type LessonLine = z.output<typeof Line>;
export type LessonNote = z.output<typeof Note>;
export type HeroTileT = z.output<typeof HeroTile>;
export type CorrectionResultT = z.output<typeof CorrectionResult>;
export type Phrase = z.output<typeof Phrase>;
