(function(){
const pad = n => String(n).padStart(2, '0');
const MUTED = 'color-mix(in srgb, var(--color-text) 50%, transparent)';

const STORY = [
  { who: 'n', fr: 'Tous les samedis matin, je descends à la boulangerie en bas de chez moi.', en: 'Every Saturday morning, I go down to the bakery at the bottom of my building.' },
  { who: 'n', fr: 'Ce samedi-là, il pleuvait et la queue débordait sur le trottoir.', en: 'That Saturday, it was raining and the queue spilled out onto the pavement.', note: 'impf' },
  { who: 'n', fr: 'Devant moi, il y avait Madame Lefèvre, ma voisine du troisième.', en: 'In front of me was Madame Lefèvre, my neighbour from the third floor.' },
  { who: 'n', fr: '— Ah, bonjour ! Vous non plus, vous n’avez pas pu faire la grasse mat’ ?', en: '“Oh, hello! You couldn’t sleep in either?”' },
  { who: 'l', fr: '— Non, mon fils m’a réveillée à sept heures. Il voulait des croissants.', en: '“No, my son woke me up at seven. He wanted croissants.”', note: 'agree' },
  { who: 'n', fr: 'Quand notre tour est arrivé, la boulangère m’a souri.', en: 'When our turn came, the baker smiled at me.', note: 'impf' },
  { who: 'b', fr: '— Bonjour, qu’est-ce que je vous sers ?', en: '“Hello, what can I get you?”' },
  { who: 'n', fr: '— Je voudrais une tradi bien cuite et deux pains au chocolat, s’il vous plaît.', en: '“I’d like a well-baked tradition baguette and two pains au chocolat, please.”', note: 'cond' },
  { who: 'b', fr: '— Désolée, on n’en a plus, des pains au chocolat. Il me reste des croissants.', en: '“Sorry, we’re out of pains au chocolat. I’ve got croissants left.”', note: 'en' },
  { who: 'n', fr: '— Bon, ben, j’en prends deux, alors.', en: '“Well then, I’ll take two.”', note: 'en' },
  { who: 'n', quote: 'l', fr: 'En sortant, Madame Lefèvre m’a dit en riant : « Vous voyez, il faut venir avant huit heures. »', en: 'On the way out, Madame Lefèvre said, laughing: “You see, you have to come before eight.”' },
  { who: 'n', fr: 'Je lui ai répondu que la semaine prochaine, je mettrais un réveil.', en: 'I told her that next week I would set an alarm.', note: 'concord' },
  { who: 'n', quote: 'l', fr: 'Elle a haussé les épaules : « C’est ce que vous dites tous les samedis ! »', en: 'She shrugged: “That’s what you say every Saturday!”' },
];
STORY.forEach(s => {
  s.words = [...s.fr.matchAll(/\S+/g)].map(m => ({ t: m[0], start: m.index }));
  s.dlg = s.fr.startsWith('—');
  const q = s.quote ? s.fr.indexOf('«') : -1;
  s.parts = q > 0 ? [{ who: s.who, start: 0, end: q }, { who: s.quote, start: q, end: s.fr.length }] : [{ who: s.who, start: 0, end: s.fr.length }];
});
const PARAS = [[0, 1, 2], [3], [4], [5], [6], [7], [8], [9], [10, 11, 12]];
const CAST = {
  n: { name: 'Moi', role: 'narrator', color: 'var(--ink-900)', label: 'var(--fg-3)' },
  l: { name: 'Madame Lefèvre', role: 'the neighbour', color: 'var(--violet-500)', label: 'var(--violet-500)' },
  b: { name: 'La boulangère', role: 'the baker', color: 'var(--sky-700)', label: 'var(--sky-700)' }
};
const spk = t => t.replace(/^—\s*/, '');

const NOTES = {
  impf: {
    kicker: 'Temps du passé', title: 'Imparfait ou passé composé ?',
    short: 'The imparfait paints the scene. The passé composé moves the story forward.',
    body: [
      'Apps usually teach this as “unfinished vs. finished”. That rule breaks quickly: “il pleuvait” in the story is finished too. It rained that one morning and then stopped.',
      'A better test: imagine filming the story. Anything already going on when the camera starts rolling (the weather, what people wanted, how they felt) is imparfait. Anything that happens on camera, one action after another, is passé composé.',
      'Quick check: can you put “and then…” in front of it? If yes, passé composé.'
    ],
    examples: [
      { fr: 'Il pleuvait et la queue débordait sur le trottoir.', en: 'Background: the scene as the story opens.', tag: 'Imparfait' },
      { fr: 'Quand notre tour est arrivé, la boulangère m’a souri.', en: 'Two events, one after the other.', tag: 'Passé composé' },
      { fr: 'Il voulait des croissants.', en: 'A state of mind. Vouloir, être, avoir and savoir lean imparfait in stories.', tag: 'Imparfait' }
    ],
    oral: 'The passé simple you see in novels (“il plut”, “elle sourit”) is never used in conversation. Parisians tell every story with passé composé and imparfait.',
    trap: { wrong: 'J’ai été fatigué, alors je suis resté chez moi.', right: 'J’étais fatigué, alors je suis resté chez moi.', why: '“J’ai été fatigué” isn’t wrong, but it frames the tiredness as a bounded episode. When a state is the reason for an action, use the imparfait.' }
  },
  cond: {
    kicker: 'Politesse', title: 'Pourquoi « je voudrais » et pas « je veux » ?',
    short: 'The conditional softens a request. “Je veux” at a counter sounds like a child demanding.',
    body: [
      '“Je voudrais” is the conditional of vouloir, literally “I would want”. The conditional puts a little distance between you and the demand, which is what makes it polite.',
      'It works the same way with other verbs: “Vous auriez… ?” (Would you have…?), “Ce serait possible de… ?” (Would it be possible to…?).'
    ],
    examples: [
      { fr: 'Je voudrais une tradi bien cuite, s’il vous plaît.', en: 'I’d like a well-baked tradi, please.', tag: 'Soigné' },
      { fr: 'Je vais prendre une tradi, s’il vous plaît.', en: 'I’ll have a tradi, please.', tag: 'Courant' },
      { fr: 'Vous auriez des croissants ?', en: 'Would you have any croissants?', tag: 'Courant' }
    ],
    oral: '“Je vais prendre…” is as common as “je voudrais” in Paris and sounds natural. More important than the verb: always open with “Bonjour”. Skipping it is the real rudeness.',
    trap: { wrong: 'Je veux un café.', right: 'Je voudrais un café. / Je vais prendre un café.', why: '“Je veux” is fine for wishes (“je veux habiter à Paris”), not for asking someone to give you something.' }
  },
  en: {
    kicker: 'Pronoms', title: 'Que fait « en » ici ?',
    short: '“En” replaces “de + noun”, and it has to be there when you give a quantity without repeating the noun.',
    body: [
      'Once something has been mentioned with de, du or des, “en” stands in for it: “Tu veux du pain ? — Oui, j’en veux.”',
      'With numbers, English can drop the noun (“I’ll take two”). French can’t leave the number floating: you have to say “j’en prends deux”. Forgetting “en” here is one of the most common B1 mistakes.'
    ],
    examples: [
      { fr: 'Bon, ben, j’en prends deux, alors.', en: 'en = des croissants. “I’ll take two (of them).”', tag: 'Quantité' },
      { fr: 'On n’en a plus, des pains au chocolat.', en: 'en = des pains au chocolat. “We don’t have any left.”', tag: 'Ne… plus' }
    ],
    oral: '“On n’en a plus, des pains au chocolat” names the thing twice: once as “en”, again at the end. This is called dislocation and it’s everywhere in spoken Paris French: “Je l’aime bien, ce quartier.” “Il est où, ton frère ?” In writing you’d say “Nous n’avons plus de pains au chocolat.”',
    trap: { wrong: 'Je prends deux.', right: 'J’en prends deux.', why: 'Without “en”, the sentence sounds unfinished to a French ear: two of what?' }
  },
  concord: {
    kicker: 'Discours indirect', title: '« Je mettrais » : le futur dans le passé',
    short: 'When you report what someone said about the future, the future becomes the conditional.',
    body: [
      'Direct: « La semaine prochaine, je mettrai un réveil. » (future)',
      'Reported: Je lui ai répondu que la semaine prochaine, je mettrais un réveil. (conditional)',
      'This conditional isn’t about politeness or “what if”. It’s the future seen from a point in the past. English does the same thing: “I will” becomes “I said I would”.'
    ],
    examples: [
      { fr: 'Je lui ai répondu que je mettrais un réveil.', en: 'I told her I would set an alarm.', tag: 'Conditionnel' },
      { fr: 'Elle m’a dit qu’elle viendrait à huit heures.', en: 'She told me she would come at eight.', tag: 'Conditionnel' }
    ],
    oral: 'Mettrai and mettrais sound almost the same for most Parisians, so in speech the difference lives in context. In writing the -s matters, and it’s a classic exam point.',
    trap: { wrong: 'Il m’a dit qu’il viendra demain.', right: 'Il m’a dit qu’il viendrait demain.', why: 'You’ll hear the first version in casual speech when “tomorrow” is still ahead. The conditional is the correct form and what’s expected in writing.' }
  },
  agree: {
    kicker: 'Accord', title: 'Pourquoi « réveillée » avec un -e ?',
    short: 'With avoir, the past participle agrees with a direct object that comes before the verb.',
    body: [
      'Normally the participle after avoir doesn’t change: “Mon fils a réveillé sa mère.”',
      'But when the direct object comes before the verb, usually as a pronoun (me, te, la, les…), the participle agrees with it. In “mon fils m’a réveillée”, m’ is Madame Lefèvre, a woman, so réveillé takes an -e.'
    ],
    examples: [
      { fr: 'Mon fils m’a réveillée à sept heures.', en: 'm’ = Madame Lefèvre (feminine).', tag: 'Accord' },
      { fr: 'Les croissants ? Je les ai mangés.', en: 'les = les croissants (masculine plural).', tag: 'Accord' }
    ],
    oral: 'Usually you can’t hear this agreement: réveillé and réveillée sound the same. With some verbs you can (“je l’ai prise”, “je l’ai faite”), and plenty of French people skip it in speech.',
    trap: { wrong: 'La baguette ? Je l’ai pris.', right: 'La baguette ? Je l’ai prise.', why: 'l’ = la baguette, feminine, placed before avoir.' }
  }
};
const NOTE_ORDER = ['impf', 'en', 'cond', 'concord', 'agree'];

const QUIZ = [
  { kind: 'Écoute', audio: 8, prompt: 'Listen to the baker. What is she telling the narrator?', note: 'en', options: [
    { t: 'They’ve run out of pains au chocolat, but there are croissants.', ok: true, why: '“On n’en a plus” = we have none left. “Ne… plus” means no more, and “il me reste” means I still have.' },
    { t: 'They only have pains au chocolat left.', why: '“Plus” here is part of “ne… plus” (no more), not “more”. Listen for the n’ before en: “on n’en a plus”. It’s short in fast speech, but it’s there.' },
    { t: 'The pains au chocolat will be ready soon.', why: 'Nothing in the line refers to time. “Il me reste des croissants” = I’ve got croissants left. She’s offering an alternative.' } ] },
  { kind: 'Grammaire', quote: 'Ce samedi-là, il pleuvait et la queue débordait sur le trottoir.', prompt: 'Why “il pleuvait” (imparfait) and not “il a plu” (passé composé)?', note: 'impf', options: [
    { t: 'It sets the scene: it was already raining when the events happen.', ok: true, why: 'The rain is the backdrop. The events (the son waking her, the baker smiling) happen against it, in passé composé.' },
    { t: 'Weather is always in the imparfait.', why: 'Weather can take either tense. “Il a plu toute la nuit” is correct when the rain is a complete event with a start and an end.' },
    { t: 'Because the rain lasted a long time.', why: 'Duration isn’t the test. “Il a plu pendant trois jours” lasts a long time and uses passé composé. What matters is background vs. event.' } ] },
  { kind: 'Grammaire', quote: '— Non, mon fils m’a réveillée à sept heures.', prompt: 'Why “réveillée”, with an extra -e?', note: 'agree', options: [
    { t: 'Because m’ (Madame Lefèvre) is feminine and comes before avoir.', ok: true, why: 'With avoir, the participle agrees with a direct object placed before the verb. M’ is her, so: réveillée.' },
    { t: 'Because “fils” is a feminine noun.', why: '“Fils” is masculine (le fils). And with avoir, the participle never agrees with the subject anyway.' },
    { t: 'Because the verb is reflexive.', why: 'It isn’t. Reflexive would be “je me suis réveillée”, with être. Here her son wakes her up: réveiller quelqu’un, with avoir.' } ] },
  { kind: 'Lecture', quote: '— Bon, ben, j’en prends deux, alors.', prompt: 'What does “en” stand for?', note: 'en', options: [
    { t: 'des croissants', ok: true, why: 'The baker has just said “il me reste des croissants”. “En” picks that up: two (croissants).' },
    { t: 'des pains au chocolat', why: 'They’re sold out. The narrator settles for what’s left, the croissants.' },
    { t: 'la boulangerie', why: '“En” can replace a place introduced with de (“j’en viens” = I’ve just come from there), but nobody’s coming from anywhere here. It replaces the thing being counted.' } ] },
  { kind: 'Écoute', audio: 10, prompt: 'Listen. What advice does Madame Lefèvre give?', options: [
    { t: 'Come before eight.', ok: true, why: '“Il faut venir avant huit heures” = you have to come before eight. “Il faut” + infinitive is the everyday way to say you have to.' },
    { t: 'Come after eight, when it’s quieter.', why: '“Avant” means before. After would be “après”. Listen again for the “a-van” at the start.' },
    { t: 'Order the day before.', why: '“Il faut venir” = you have to come. Nothing about ordering ahead.' } ] },
  { kind: 'Compréhension', quote: 'Elle a haussé les épaules : « C’est ce que vous dites tous les samedis ! »', prompt: 'What is Madame Lefèvre implying?', options: [
    { t: 'The narrator says this every week and never does it.', ok: true, why: '“Tous les samedis” plus a shrug: she’s teasing. That dry, deadpan irony is very Parisian.' },
    { t: 'The narrator always arrives before eight.', why: 'If that were true, there’d be no queue story. The shrug (hausser les épaules) signals doubt.' },
    { t: 'She’s also planning to set an alarm.', why: '“Vous dites” = you say. She’s talking about the narrator, not herself.' } ] }
];

[1, 2, 0, 2, 0, 1].forEach((pos, i) => {
  const q = QUIZ[i]; if (!q) return;
  const k = q.options.findIndex(o => o.ok); const [right] = q.options.splice(k, 1); q.options.splice(pos, 0, right);
});

const PAIRS = [
  { written: 'Nous n’avons plus de pains au chocolat.', spoken: 'On n’en a plus, des pains au chocolat.', reg: 'Courant', note: '“On” replaces “nous” in almost all speech, and the noun gets moved to the end. Saying “nous n’avons plus” at a bakery would sound like a press release.' },
  { written: 'Une baguette de tradition', spoken: 'Une tradi', reg: 'Courant', note: 'The tradition is the bakery’s better baguette, and everyone orders it as “une tradi”. Bien cuite = well baked, pas trop cuite = pale.' },
  { written: 'Faire la grasse matinée', spoken: 'Faire la grasse mat’', reg: 'Familier', note: 'Clipping long words is very Parisian: l’apéro, le resto, la clim, d’acc. Fine with neighbours and friends.' },
  { written: 'Eh bien, j’en prends deux.', spoken: 'Bon, ben, j’en prends deux.', reg: 'Familier', note: '“Ben” (rhymes with “un”) is the spoken filler version of “bien”: “well…”. You’ll also hear “bah”. Neither belongs in an email.' },
  { written: 'Il y avait Madame Lefèvre.', spoken: 'Y avait Madame Lefèvre.', reg: 'Courant', note: 'In fast speech “il y a” shrinks to “y a”, and “il n’y a pas” becomes “y a pas”. Listen for it on the métro.' },
  { written: 'Voulez-vous venir avant huit heures ?', spoken: 'Vous venez avant huit heures ?', reg: 'Courant', note: 'Inversion (“voulez-vous”) is for writing and formal speech. In conversation, a plain statement with rising intonation is the default question.' }
];

const STEPS = [
  { id: 'story', n: '01', label: 'Écouter et lire', mins: '4 min', desc: 'A 13-sentence story read by 3 French voices. Tap any line to hear it.' },
  { id: 'quiz', n: '02', label: 'Comprendre', mins: '3 min', desc: '6 questions. Every wrong answer comes with the reason.' },
  { id: 'spoken', n: '03', label: 'Comme on dit', mins: '1 min', desc: 'What you’d write next to what Parisians actually say.' },
  { id: 'describe', n: '04', label: 'Décrire', mins: '2 min', desc: 'Describe a scene in French. Each correction is explained.' }
];

const SCENE = 'A flat, colourful illustration of a bakery run by pigeons. Behind the counter, a violet pigeon baker in a white chef’s hat and apron hands a takeaway coffee across the counter and holds a plate with a croissant. In front, a pink pigeon customer with orange legs carries a cream tote bag with a croissant printed on it and points at the coffee. The glass display case holds croissants, a long loaf, a strawberry cream cake, chocolate chip cookies and a dark chocolate cake topped with cherries. On the pink shelves behind: a loaf, sesame brioche buns, cupcakes with cherries and a hanging plant. Two violet pendant lamps hang from the ceiling. There is a potted plant on the counter, a coffee machine with cups, cookies under a glass dome, an arched window with green bushes outside, and a pink and white checkerboard floor.';
const SAMPLE = 'Dans la boulangerie, il y a deux pigeons. Le boulanger porte un chapeau blanc et il donne un café a la cliente. La pigeon rose a un sac avec un croissant dessus. Dans la vitrine, il y a beaucoup des gâteaux et des croissants qui a l’air délicieux. Au plafond, on voit deux lampes violet.';
const SYS = `You are a French tutor for an English-speaking adult learner (A2–B1 level) who lives in Paris. Correct their short description of an illustrated scene.
Fix real errors only: grammar, agreement, conjugation, gender, prepositions, wrong word, missing or wrong accents (cafe → café, tres → très), missing articles or prepositions (un croissant beurre → un croissant au beurre), and clearly unnatural phrasing. A missing capital at the start of a sentence counts. Do not rewrite for style.
Explanations are in plain English, 1–2 sentences, and must explain the rule (the why), not just restate the fix.
Then give the same description as a Parisian would naturally say it out loud: colloquial but not slangy (on instead of nous, dropped ne, y a, etc.).
Respond with ONLY a JSON object, no markdown fences:
{"segments":[{"t":"unchanged text"},{"from":"original wrong text","to":"corrected text","n":1}],"corrections":[{"n":1,"from":"...","to":"...","rule":"rule name, max 4 words","why":"..."}],"corrected":"full corrected text","spoken":"...","spokenNote":"one sentence on what changed in the spoken version and why it sounds natural","praise":"one specific thing they did well, in English, max 5 words, ending with !"}
Concatenating each segment's "t" or "from", in order, must reproduce the learner's text exactly. Each "from" must be the exact original characters, copied verbatim. Keep each change to the smallest whole-word span; never split a word (write "amusant" → "amusante", not "." → "e."). Number corrections in order of appearance. If there are no errors, return a single segment with the whole text and an empty corrections array.`;


window.APERO = { pad, STORY, PARAS, CAST, spk, NOTES, NOTE_ORDER, QUIZ, PAIRS, STEPS, SCENE, SAMPLE, SYS };
})();
