# apéro club lesson style guide

How every lesson is written. Lesson 1, *Le pain du samedi* (`public/lessons/lesson-001.json`), is the reference: when in doubt, do what it does. The file format is in `docs/lesson-format.md`; this guide is about the writing.

Rules marked **(checked)** are enforced by `npm test` (`src/lesson/style.test.ts`), so a lesson that breaks them won't deploy.

## Who it's for

- **Level: A2 to B1.** Adults who finished an app course and hit a wall. Never label a lesson B1 or B2, and never promise a level. "Written for learners between A2 and B1" is the only level wording in the product. **(checked: no "B2")**
- **Paris, today.** Everyday situations a learner living in Paris actually meets: the bakery, the métro, neighbours, the market, the doctor, an apéro. Real street names and neighbourhoods are welcome (rue des Martyrs, Aligre, Canal Saint-Martin).
- **Never mention other apps or competitors** (no Duolingo, Babbel…). Say "apps usually teach…" if needed. **(checked)**
- **Explanations are in English; the story and examples are in French.**

## The story

- **Length (checked):** 10 to 16 lines in 6 to 10 paragraphs, about 120 to 200 French words. Lesson 1: 13 lines, 9 paragraphs, 151 words. Lines are short: 6 to 16 words each, one breath when read aloud.
- **Cast (checked):** 2 to 4 characters, with **the narrator first**. The narrator, "Moi", is the same person in every lesson: a learner in their 30s living in Paris, friendly and a bit self-mocking. They tell the story in the first person and take part in it.
- **Recurring characters** keep their `id` (and so their voice): `madame-lefevre` is the neighbour from the third floor; `la-boulangere` is the baker on rue des Martyrs. Bring them back when it fits; new characters need a `description` of age, personality and how they talk.
- **Shape:** narration paragraphs (2 to 3 lines) set the scene; dialogue lines are one paragraph each, starting with `— `. End on a small, dry punchline, usually from a Parisian character (Madame Lefèvre's "C'est ce que vous dites tous les samedis !").
- **Tenses:** tell it like people talk, in passé composé and imparfait. **No passé simple.** Use the conditional, the pronouns *en* and *y*, agreement and reported speech where they come naturally; they're what the grammar notes explain.
- **Spoken French in dialogue:** Parisians talk the way they really do. *On* instead of *nous*, *bon, ben*, clipped words (*la grasse mat'*, *une tradi*), dislocation (*On n'en a plus, des pains au chocolat*). Narration is a notch more careful but never stiff. Nothing vulgar, no heavy slang.
- **Quoting someone inside narration** (« … ») uses `quoteSpeaker`, so the quote is read in that character's voice.
- **English translations** (`en`) are natural English, not word-for-word, with dialogue in “curly quotes”.
- **French typography (checked):** curly apostrophes (’), «guillemets» for quotes, accents always, and a space before `! ? : ;` (lesson 1 uses a regular space; a narrow no-break space is also fine). No straight `'` or `"` in French text.

## Grammar notes ("Pourquoi ?")

- **4 to 6 notes (checked)**, each attached as a "why?" chip to the story line where it appears **(checked: every note is linked from the story)**. Lesson 1 has 5.
- **Pick what an app course skips:** the *why* behind choices (imparfait vs passé composé, why *je voudrais*, why *en* can't be dropped, the future-in-the-past, agreement with a preceding object), not vocabulary lists.
- **Each note has:**
  - `kicker`: the category in French, 1 to 3 words (*Temps du passé*, *Pronoms*, *Politesse*, *Discours indirect*, *Accord*).
  - `title`: the learner's question, in French, quoting the words from the story: *Pourquoi « je voudrais » et pas « je veux » ?*, *Que fait « en » ici ?*
  - `short`: the answer in one English sentence, 10 to 20 words.
  - `body`: 2 or 3 short paragraphs, 50 to 80 words in all. Explain the reason, not just the rule. Correct the over-simple rule learners were taught ("Apps usually teach this as 'unfinished vs. finished'. That rule breaks quickly…"), then give a test they can use ("imagine filming the story…", "Quick check: can you put 'and then…' in front of it?").
  - `examples`: 2 or 3, the first taken from the story, each with an English gloss and a short tag (*Imparfait*, *Courant*, *Accord*).
  - `spoken`: how it plays out in real Paris speech, 25 to 50 words. Say honestly when people break the rule.
  - `trap`: the most common mistake (`wrong`), the fix (`right`) and why, in 1 or 2 sentences.
- **Voice:** a warm, slightly cheeky tutor. Plain English, short sentences, "you". No jargon without a gloss, no exclamation marks.

## Quiz ("Comprendre")

- **Exactly 6 questions, 3 options each (checked).** Lesson 1's mix:
  - 2 **Écoute**: play a story line (`listen`), transcript hidden until answered **(checked: at least 2)**;
  - 2 **Grammaire**: a quoted line and a "why this form?" question;
  - 1 **Lecture**: what does a word refer to;
  - 1 **Compréhension**: what a character implies (tone, irony).
- **Prompts** are in English and short: "Listen to the baker. What is she telling the narrator?", "Why “réveillée”, with an extra -e?"
- **Options** are full English sentences (or a short French phrase when asking what a word stands for). Wrong options are plausible mistakes a learner would really make (mishearing *plus*, thinking duration decides the tense), never jokes.
- **Every option explains itself (checked),** right or wrong, in 10 to 30 words: why it's right, or exactly what misled you and what the French actually says.
- **Move the right answer around (checked):** use each position at least once and none more than 3 times. Lesson 1: 2, 3, 1, 3, 1, 2.
- Link a question to its grammar note (`note`) when it tests one; the learner gets a "Why?" button.

## Comme on dit (written vs spoken)

- **6 pairs (checked)**, mostly lines or phrases from the story: the careful written version and what you'd actually hear in Paris.
- **Register (checked: at least one of each):** `Courant` (fine anywhere) or `Familier` (friends and neighbours, never in an email). Lesson 1: 4 Courant, 2 Familier. Use `Soigné` only for the written side's register if needed.
- **Note:** 15 to 30 words on what changed and when to use it, with a concrete tip ("Listen for it on the métro").

## Décrire (describe the scene)

- **The image:** a flat, colourful illustration in the brand style (the pigeon bakery), of a scene from the story's world. Square; it's cropped into an arch.
- `instructions`: "Write 3 to 5 sentences: …" plus 2 or 3 prompts about the picture.
- `helpers`: **4 to 8 chips (checked)**, phrases that help describe *this* image (*derrière le comptoir*, *dans la vitrine*, *on dirait que*).
- `scene`: a literal English description of everything in the image, for the future AI tutor.
- **The sample:** a 4- or 5-sentence description by a typical B1 learner, about 50 words, with **4 to 7 realistic mistakes (checked)**: accents (*a la*), gender (*la pigeon*), *beaucoup des*, agreement, a verb not matching its subject. Each correction gets a `rule` (4 words max, in French) and a `why` that explains the rule in 1 or 2 English sentences. `spoken` retells it the Parisian way and `spokenNote` says what changed. `praise` is a hand note: **5 words at most, ending in "!" (checked)**; put French in curly quotes, and a quoted expression counts as one word (*Great use of “il y a”!*).

## Today screen art

- `hero` (phone) has 3 squares and `heroWide` (desktop) has 4. Make **one or two about the story** (lesson 1: the croissant and the coffee cup), drawn flat in the brand style. The rest are kit shapes or one pattern, with **exactly one blinking face**.
- The **first picture in `hero`** is also shown at the top of the story page, so make it the one that best sums up the story (lesson 1: the croissant; lesson 2: the tower in fog). The tiles beside it change colour automatically to avoid a clash.

## Story ambience

- **Always include one (checked).** Describe the place and its sounds in one or two sentences, add "Calm and steady", and always end with **"No music, no clear speech."** **(checked)** so it never competes with the French.
- Lesson 1: *Inside a small Paris bakery on a rainy Saturday morning: a quiet murmur of customers waiting in line, a door bell, paper bags rustling, coins on a counter, an espresso machine hissing, soft rain outside. Calm and steady. No music, no clear speech.*
- Leave `volume` at 0.18 unless a place is naturally loud.

## Title, summary and timing

- `title`: French, 2 to 5 words, the story's situation (*Le pain du samedi*, *Une panne sur la 13*, *Le marché d'Aligre*).
- `summary`: one English sentence of 8 to 15 words saying where and what (*A Saturday morning queue at a bakery on rue des Martyrs.*).
- `minutes`: story 4, quiz 3, phrases 1, describe 2 (10 in all), unless the lesson is clearly longer.

## Interface wording (for anything new)

From the design system: buttons are 1 or 2 words, verb first (*Check*, *Continue*); praise is short and varied (*Nice one!*, *Très bien.*); wrong answers get "Not quite", never "Wrong!"; hand-written notes are 5 words at most; numbers are always numerals; no emoji.
