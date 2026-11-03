# French learning beyond Duolingo

_Started 2026-10-24 09:05 UTC_

---

## User

i want to use my language learning design system for this. 

So here's the situation. I want to create a language learning module for French. My situation is that I finished Duolingo French, and I'm living in Paris and there's just so much I don't know. I think Duolingo leaves massive gaps in actually explaining the "why" behind some french language things. So I want to create a tool that explains some of the details along the way, like the why behind certain things, why and when certain tenses are used, and a lot more listening comprehension than Duolingo does. I like longer stories or articles and then a quiz format after to make sure you understand. if if you select wrong answers, it tells you why it's wrong and what the right one is. 

A couple other things I've liked in classes i've taken or tutors i've worked with. 

Showing an image and asking people to describe the scene, just to write down some of what they're seeing. the app would then correct grammar and explain why it's making the corrections it's making. 

I've also liked stories where i can listen and read along at the same time. 

I particularly want to gear this towards people who are not completely new but have hit a wall with Duolingo but also don't want to shell out for tutors or classes, and want something they can still practice while riding the train or sitting at home with the family, that can slip into daily life without being a huge investment in time, but also feel like you're learning and making progress beyond just some vocabulary words. 

i also want it to lean more towards how people really talk about provide explanations around the proper way vs. the more coloquial way of speaking, and sticking more to Parisian french. 

So i'd say the ideal person for this is in the A2 or B1 realm like where I'm at, where i want to get to a solid B2.

## Assistant



## Assistant

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: ask_user]_

I've put up a short form covering device, which screens to build, session length, how to show formal vs. colloquial French, and a sample story topic. Once you answer, I'll start building with the Modernist system.

## User

<artifact-content-authored-by-others/>
Answered — device: Both; scope: Home / daily session, Listen + read-along story, Comprehension quiz with explanations, Describe-the-image writing + corrections, Grammar 'why' explainer; format: Clickable prototype; session_length: 10 min; register: A dedicated 'how people really say it' card after each story; explain_lang: English; story_topic: Daily Paris life (boulangerie, métro, voisins); variations: Read-along player layout, Quiz feedback treatment, Correction display for writing; live_ai: Real AI corrections; name: apéro

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: copy_starter_component]_

_[tool: dc_write]_

## Assistant

_[tool: update_todos]_

_[tool: tool_search_tool_bm25]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I built **apéro** as one clickable prototype. It reflows for both phone and desktop and runs as a 10-minute session based on a story, "Le pain du samedi", set in a bakery queue on rue des Martyrs. The verifier is still checking it.

The session has four steps:
1. **Listen and read:** 13 sentences with French audio, highlighting each word as it's spoken where your device allows. You can switch the speed (0,75× / 1×) and turn the English on or off. The red **Pourquoi ?** tags open a grammar explanation in a side panel: the rule, examples you can listen to, how Parisians actually say it, and the usual trap.
2. **Understand:** 6 questions, two of them listening. Every answer explains why it's right or wrong and links to the explanation.
3. **Comme on dit:** written French next to how it's said in Paris, marked everyday or casual, with audio for both.
4. **Describe:** a photo slot, a text box and live AI corrections. Each correction has its own explanation, followed by a version showing how a Parisian would say it out loud. "Essayer avec un exemple" fills in sample text with typical B1 mistakes.

The Tweaks panel switches between three versions of each part you asked to explore:
- **Read-along:** full page, one sentence at a time, or French and English side by side.
- **Quiz feedback:** explanation under the answer, a panel that slides up from the bottom, or notes in a margin beside the question.
- **Writing corrections:** crossed-out edits in the text, your version next to the corrected one, or one correction at a time.

A few things to know:
- **Audio:** it uses your device's built-in French voice, so the quality depends on the device. Real recorded audio would sound far better.
- **Photo:** I can't generate images, so the photo is an empty slot. Drop in a café terrace shot; the corrections assume a description of that scene, not the image itself.
- **Content:** only the one story, quiz and set of phrases are written so far.

## User

but i want the design system that i made previously here.

## Assistant



## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: ask_user]_

Modernist is the only design system attached to this project, so that's what I used. Pick yours in the form and I'll rebuild apéro on it, keeping all the screens and content.

## User

<artifact-content-authored-by-others/>
Answered — ds: Picked a design system (now attached)

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: view_image]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: copy_files]_

_[tool: delete_file]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

Now the quiz.

_[tool: dc_html_str_replace]_

Now "Say it" + "Describe".

_[tool: dc_html_str_replace]_

Now the "why" panel (outside main).

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I rebuilt apéro on your design system as **Apero v2.dc.html**. It has the same 4-step session, grammar panel and AI corrections, and the Tweaks for read-along layout, quiz feedback and correction display still work. It's out for review now.

What changed visually:
- **Look:** full-width color bands and pattern tiles, pill buttons with the hard bottom edge, the Unbounded / Figtree / Caveat fonts, and your own button, icon button, badge and answer-tile components.
- **Text:** buttons and labels are now in English, following your guidelines ("Continue", "Got it", "Not quite."). The story and examples stay in French.
- **Grammar explanations:** they keep the same structure, styled with your palette and the lilac wave ribbon.

The story and quiz content is now in a separate file, **apero-content.js**. The Modernist version is still in **apero.dc.html**.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

The icons in Apero v2 were all blank because the icon set wasn't being loaded. I've added it, so the audio, close, play and arrow buttons should show their icons again. It's being re-checked now.

## User

is there way to best access this in the browser?

## Assistant

