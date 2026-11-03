import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from './lesson/schema';
import { assetUrl, loadLesson, requestedDate } from './lesson/load';
import { flattenStory } from './lesson/story';
import { useSpeech } from './audio/useSpeech';
import { loadPrefs, loadProgress, savePrefs, saveProgress, type Prefs, type Progress } from './progress';
import type { AppCtx, Screen } from './screens/common';
import { Home } from './screens/Home';
import { Grammar, NoteSheet } from './screens/Grammar';
import { Story } from './screens/Story';
import { Quiz } from './screens/Quiz';
import { SayIt } from './screens/SayIt';
import { Corrections, Describe } from './screens/Describe';
import { Complete } from './screens/Complete';
import { Critter } from './ds/brand';

export default function App() {
  const [state, setState] = useState<{ lesson?: Lesson; error?: string }>({});
  useEffect(() => {
    const date = requestedDate();
    loadLesson(date).then(lesson => setState({ lesson }), e => setState({ error: String(e?.message ?? e) }));
  }, []);

  return (
    <div className="shell">
      {state.lesson ? <LessonApp lesson={state.lesson} />
        : <div className="center-msg">
            <Critter kind="olive" size={88} expression={state.error ? 'sleepy' : 'look'} blink />
            <p style={{ margin: 0, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', textAlign: state.error ? 'left' : 'center', fontSize: 14 }}>
              {state.error ?? 'Un instant…'}
            </p>
          </div>}
    </div>
  );
}

function LessonApp({ lesson }: { lesson: Lesson }) {
  const { lines, paragraphs } = useMemo(() => flattenStory(lesson), [lesson]);
  const [screen, setScreen] = useState<Screen>('home');
  const [note, setNote] = useState<string | null>(null);
  const [progress, setProgressState] = useState<Progress>(() => loadProgress(lesson.date));
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  const speech = useSpeech(lesson.cast, lines, prefs.slow);
  const root = useRef<HTMLDivElement>(null);

  const setProgress = useCallback((p: Partial<Progress>) => setProgressState(prev => {
    const next = { ...prev, ...p, done: { ...prev.done, ...p.done } };
    saveProgress(lesson.date, next);
    return next;
  }), [lesson.date]);
  const setPrefs = useCallback((p: Partial<Prefs>) => setPrefsState(prev => { const next = { ...prev, ...p }; savePrefs(next); return next; }), []);

  const go: AppCtx['go'] = (s, markDone) => {
    speech.stop();
    setNote(null);
    if (markDone) setProgress({ done: { [markDone]: true } });
    setScreen(s);
    root.current?.querySelector('.scroll')?.scrollTo(0, 0);
  };

  const app: AppCtx = {
    lesson, lines, paragraphs, speech, progress, setProgress, prefs, setPrefs, go,
    openNote: id => { if (id) { speech.stop(); setNote(id); } },
    asset: file => assetUrl(lesson.date, file),
  };
  const noteObj = note ? lesson.notes.find(n => n.id === note) : undefined;

  useEffect(() => { document.title = `${lesson.title} · apéro club`; }, [lesson.title]);
  // Each screen remounts on entry (key), so its local state starts fresh.
  const Screens: Record<Screen, typeof Home> = { home: Home, grammar: Grammar, story: Story, quiz: Quiz, spoken: SayIt, describe: Describe, result: Corrections, complete: Complete };
  const Current = Screens[screen];

  return (
    <div ref={root} style={{ display: 'contents' }}>
      <Current key={screen} app={app} />
      {noteObj && <NoteSheet note={noteObj} onClose={() => { speech.stop(); setNote(null); }} say={t => speech.say(t)} />}
    </div>
  );
}
