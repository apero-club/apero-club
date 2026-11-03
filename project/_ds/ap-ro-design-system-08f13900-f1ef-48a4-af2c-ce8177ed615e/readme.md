# apéro club design system

A loud, poster-bright design system for **apéro club**, a **French** language-learning platform. All sample and target-language content is French; the learner's language is English. No logo was supplied, so the name is set in type wherever a mark would go.

## Context & sources

- **Base system:** copied in full from the "Language learning design system" project (working name "Parlo"): https://claude.ai/design/p/b6393342-83f6-4305-bf3c-24bc23a3d0a5. Component set, props, content rules and the learner-app kit come from there. The visuals were then overhauled.
- **Visual direction:** four moodboard images in `uploads/`:
  - **tved** business cards: ultramarine and vermilion halves, a fat lilac wave ribbon, lowercase stacked wordmark.
  - **NICELAB** poster: modular blocks, forest/grass checkers, pink, vermilion half-circles, sky clouds, heavy wide caps.
  - **neta collab** grid: 3×3 square tiles in pink/plum, mustard, vermilion, ultramarine; arch "n", flower, starburst.
  - **CARD mockups** (`avif-…png`; the `6-o.avif` original can't be decoded): arch-topped cards in saturated tones, with hard dark print shadows.

What changed from the source: violet moved to deep ultramarine. Lime was dropped (it isn't in these references), and **lilac** (the ribbon) became violet's partner. Vermilion, mustard and forest were added. The display face moved from Bricolage Grotesque to **Unbounded**, a wide, chunky face like the NICELAB and neta lettering. Figtree replaced Lexend for body. The ground went from cream to paper grey. Poster tiles are now square and edge to edge. The shape kit became the `ShapeTile` component. Three CSS patterns (checker, halves, clouds) and a single-sweep ribbon were added. Toasts, tabs and buttons are now pills. Lesson screens use full-bleed square bands and a 2×2 block answer grid.

There is no codebase or Figma file. The components and UI kit are original designs inherited from the source project.

## Index

- `styles.css`: entry point, `@import`s only.
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `layout.css` (spacing, radii, lips, shadows), `motion.css` (easings + keyframes), `base.css` (resets, focus, `.t-*` type helpers, `.pat-*` patterns).
- `assets/ribbon-lilac.svg`: the single-sweep ribbon used by `.ribbon`.
- `guidelines/`: foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/`: React primitives. Each is `Name.jsx` + `Name.d.ts` + `Name.prompt.md`, with one `*.card.html` per folder:
  - `icons/` Icon
  - `brand/` ShapeTile, Critter, Eyes
  - `actions/` Button, IconButton
  - `forms/` Input, Select, Checkbox, Radio, Switch
  - `display/` Card, Badge, Tag
  - `navigation/` Tabs
  - `feedback/` Dialog, Toast, Tooltip, ProgressBar
  - `learning/` ChoiceTile, WordChip, FeedbackBanner, LessonNode
  - `usePress.js`: shared hover/press hook
- `ui_kits/app/`: mobile learner app click-through: path → lesson (3 exercise types) → lesson complete.
- `ds-loader.js`: resolves the component namespace for cards and kits.
- `thumbnail.html`: project tile.
- `SKILL.md`: Agent Skill wrapper.

**Intentional additions** beyond the standard set: `ShapeTile` (packages the shape kit so screens use exact kit shapes, not ad-hoc patterns), `Critter` + `Eyes` (the character cast), `Icon` (Lucide wrapper), and the `learning/` family (ChoiceTile, WordChip, FeedbackBanner, LessonNode), which the product's core loop needs.

---

## Content fundamentals

**Voice:** a warm, slightly cheeky tutor. Encouraging, never babyish. Celebrates effort and corrects without blame.

- **Person:** speak to the learner as "you". Lesson UI never says "I" or "we". ("You can now order a coffee in French.")
- **Casing:** sentence case for buttons, titles and tabs. Uppercase only for `.t-eyebrow` labels and badges ("UNIT 2", "FR") and for `.t-poster` statements on marketing tiles ("SANTÉ").
- **Name:** always lowercase, "apéro club", with the accent. Store title is "apéro club: learn french"; "learn french" is a small descriptor, never part of the wordmark in-app.
- **Length:** buttons are 1–2 words, verb first ("Check", "Continue", "Start lesson"). Prompts are instructions ("Translate this sentence", "Tap what you hear").
- **Feedback copy:** when correct, use short praise and rotate it ("Nice one!", "Très bien.", "Perfect"). When wrong, say "Not quite" plus the correct answer, then "Got it". Never "Wrong!" or "Incorrect".
- **Target language:** shown big, in Unbounded 900, in violet (or lilac on violet). The learner's language sits underneath in `--fg-3`. Celebrations may be in French ("Leçon terminée !", "Bravo !", "Santé !").
- **French typography:** accents are always present (é è ê à ç ô œ). Put a narrow no-break space before ! ? : ; and use «guillemets» for quotes. Answer checking accepts both ’ and '. Nouns carry their article (le, la, l', les).
- **Hand notes** (Caveat): five words at most, like a teacher's pen. Use them for grammar nudges ("l' before a vowel!"), wayfinding ("you're here!") and streaks ("13 days in a row!").
- **Exclamation marks:** only on celebrations and hand notes.
- **Emoji:** none. Delight comes from color, shape, motion and the critters.
- **Numbers:** always numerals ("3 to review", "+15 XP", "12-day streak").

---

## Visual foundations

**Color.** Paper-grey ground (`--cream-100` #ECE9E3), near-black ink (`--ink-900` #121014). Ultramarine `--violet-500` #3A1FD4 is the brand and primary action. Lilac `--lilac-500` #F0A4EB is its partner, used as lilac on violet and violet on lilac. Vermilion `--orange-500` #FF5A1F is the third hero; it also signals wrong answers. The play palette (pink + plum, mustard, grass + forest, sky + cloud) colors units, tiles and patterns. Each hue has a 100/300/500/700/900 ramp. Use only the pairings in `guidelines/colors-pairings.html`. Green means correct and orange means wrong; don't use either decoratively next to answers.

**Type.** **Unbounded** (display, 800–900, tracking −0.04em, leading 0.92) for headlines, big target-language words, buttons (600), badges and tabs. It's wide, so sizes sit a step smaller than a condensed grotesk would. `.t-poster` is uppercase 900 for marketing statements. **Figtree** (body, 400–700, leading 1.5) for prompts, answers and all running text. **Caveat** for hand annotations only. All three are Google Fonts.

**Backgrounds.** Flat color fields, no gradients, no photography by default. The poster grid is the composition system: square tiles, edge to edge, one shape per tile, with no gaps and no rounding. **Shapes lead and patterns support.** Reach for a `ShapeTile` first. The three CSS patterns (`.pat-checker`, `.pat-halves`, `.pat-clouds`, all from the NICELAB poster) go at large scale only (module ≥ 40px), one per tile, never behind text, and at most one pattern per screen. Recolor them with `--pat-a` / `--pat-b`. The `.ribbon` (one lilac sweep) is for celebration and marketing moments only; never repeat it as a wallpaper. Dot grids, small repeats and busy textures are out.

**Shapes.** Arch (`--radius-arch`, `--radius-arch-full`), circle, half-circle, pill, four-circle flower, asterisk, plus the ribbon. All are built from CSS radii (see `ShapeTile`), except the ribbon, which is a single SVG. The arch is the signature: lesson nodes, hero cards, the trophy plinth.

**Characters.** Kit shapes with eyes add the fun. Two forms: a `ShapeTile` with `eyes` (at most one per poster grid), and 12 standalone `Critter`s built from 1–3 kit shapes (arch, jelly, bean, dome, flower, diamond, macaron, spark, olive, tower, sugar, bowl). Eyes are always white with ink pupils, about a sixth of the body; no mouths, limbs or outlines. Expressions: look, wide, dots, happy, sleepy, closed, wink. Use them in empty states, lesson complete, onboarding, loading and marketing, up to three per screen. Never on answer tiles, buttons or in text, and never as correct/wrong signals. Motion is a staggered blink (`eyes-blink`) plus `pop-in`. See `guidelines/brand-characters.html`.

**Corner radii.** Two vocabularies. Poster tiles and pattern blocks are square (0). Pressables are full curves: buttons, toasts, tabs and badges are pills, and lesson nodes are arches. Mid radii (10 / 16 / 24 / 32) are for UI containers: inputs 16, outline choice tiles 16, cards 24, dialogs 32. Lesson screens go square: the prompt band, the 2×2 answer grid (`ChoiceTile variant="block"`, 2px ink seams) and the feedback sheet have no rounding.

**Cards.** Flat color blocks, radius 24 or square (`shape="square"`) inside poster grids. No shadows or borders; white cards get an inset 2px hairline. Interactive cards get a lip and lift 2px on hover. No left-border accents.

**Lips.** Every pressable thing has a hard bottom edge (`box-shadow: 0 4px 0 <700/900 shade>`), like the print shadows on the CARD mockups. On press it translates down by the lip height and the lip collapses.

**Shadows.** Only floating layers (toast, dialog, tooltip) get `--shadow-pop`, a soft blur with a faint hard offset underneath. Bottom sheets get `--shadow-sheet`.

**Borders.** 2px, `--cream-300` at rest, and the state color when selected, correct or wrong.

**Hover.** Fills lighten a step (violet → `--primary-hover`, lilac → lilac-300, white → cream-50), and cards lift. Links go violet → vermilion. **Press:** translate down by the lip, lip collapses. **Focus:** 3px lilac ring, 2px offset. Inputs swap their border to violet with a 4px violet-100 halo.

**Motion.** `--ease-bounce` for rewards, pop-ins and switch knobs; `--ease-out` for everything functional. Durations are 100 / 200 / 380ms. Keyframes: `pop-in`, `shake` (wrong), `slide-up` (feedback sheet), `pulse-ring` (lilac, current lesson), `eyes-blink` (characters). Respect `prefers-reduced-motion`.

**Transparency & blur.** Only the dialog scrim (`--scrim`, violet-900 at 60%). No glassmorphism.

**Imagery.** None supplied. If photography is added, keep it warm and saturated, crop it into arch or circle masks, and set it inside a flat color tile.

**Layout.** Mobile first, 20px gutters, 44px minimum hit targets. Hero bands run edge to edge (no gutter). Fixed elements are the top bar, lesson header and bottom action bar or tab bar.

---

## Iconography

- **Set:** [Lucide](https://lucide.dev), from CDN (`https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js`). There is no custom icon font or sprite.
- **Usage:** through `Icon` (`<Icon name="flame" />`, kebab-case names). Default stroke is 2.25; use 2.5–3.5 in small filled chips and checkmarks.
- **Sizes:** 16 inline, 20 in buttons and inputs, 24 default, 28–96 for feature moments (the trophy).
- **Color:** `currentColor`. Icons sit on tinted chips (100 + 700/900) or solid fills (500 + its pair ink).
- **Core vocabulary:** flame (streak), zap (XP), heart (lives), star (current lesson), check / x, lock, volume-2, mic, turtle, book-open, rotate-ccw, trophy, languages.
- **No emoji** and no unicode symbols as icons. `*` is a typographic ornament only.
- **Logo:** none provided. The wordmark is "apéro club" in Unbounded 900, lowercase, one line or stacked. The lockup adds "learn french" in small Unbounded 700 caps (~¼ the name size) below it, for store and marketing use (`guidelines/brand-wordmark.html`). Replace it when a real mark exists.
