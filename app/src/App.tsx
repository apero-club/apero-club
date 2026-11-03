import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from './lesson/schema';
import { assetUrl, loadLesson, requestedDate } from './lesson/load';
import { flattenStory } from './lesson/story';
import { useSpeech } from './audio/useSpeech';
import { loadManifest, type AudioManifest } from './audio/manifest';
import { useAmbience } from './audio/useAmbience';
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
import { Desktop, NoteDrawer } from './desktop/Desktop';

const WIDE = '(min-width: 900px)';
/** True on screens wide enough for the desktop design. */
function useWide() {
  const [wide, setWide] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(WIDE).matches);
  useEffect(() => {
    const m = matchMedia(WIDE), on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

export default function App() {
  const wide = useWide();
  const [state, setState] = useState<{ lesson?: Lesson; error?: string }>({});
  useEffect(() => {
    const date = requestedDate();
    loadLesson(date).then(lesson => setState({ lesson }), e => setState({ error: String(e?.message ?? e) }));
  }, []);

  if (state.lesson) return <LessonApp lesson={state.lesson} wide={wide} />;
  return (
    <div className="shell">
      {state.lesson ? null
        : <div className="center-msg">
            <Critter kind="olive" size={88} expression={state.error ? 'sleepy' : 'look'} blink />
            <p style={{ margin: 0, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', textAlign: state.error ? 'left' : 'center', fontSize: 14 }}>
              {state.error ?? 'Un instant…'}
            </p>
          </div>}
    </div>
  );
}

function LessonApp({ lesson, wide }: { lesson: Lesson; wide: boolean }) {
  const { lines, paragraphs } = useMemo(() => flattenStory(lesson), [lesson]);
  const [screen, setScreen] = useState<Screen>('home');
  const [note, setNote] = useState<string | null>(null);
  const [progress, setProgressState] = useState<Progress>(() => loadProgress(lesson.date));
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  // Recorded voices (ElevenLabs), if this lesson has them; otherwise device voices.
  const [manifest, setManifest] = useState<AudioManifest | null>(null);
  useEffect(() => { loadManifest(assetUrl(lesson.date, 'audio/manifest.json')).then(setManifest); }, [lesson.date]);
  const speech = useSpeech(lesson.cast, lines, prefs.slow, manifest, assetUrl(lesson.date, 'audio/'));
  const ambience = useAmbience(manifest?.ambience ? assetUrl(lesson.date, 'audio/' + manifest.ambience.file) : null, lesson.ambience?.volume ?? 0.18);
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
    if (wide) window.scrollTo(0, 0);
  };

  const app: AppCtx = {
    lesson, lines, paragraphs, speech, ambience, progress, setProgress, prefs, setPrefs, go,
    openNote: id => { if (id) { speech.stop(); setNote(id); } },
    asset: file => assetUrl(lesson.date, file),
  };
  const noteObj = note ? lesson.notes.find(n => n.id === note) : undefined;

  useEffect(() => { document.title = `${lesson.title} · apéro club`; }, [lesson.title]);
  // Each screen remounts on entry (key), so its local state starts fresh.
  const Screens: Record<Screen, typeof Home> = { home: Home, grammar: Grammar, story: Story, quiz: Quiz, spoken: SayIt, describe: Describe, result: Corrections, complete: Complete };
  const Current = Screens[screen];

  const closeNote = () => { speech.stop(); setNote(null); };
  if (wide) return <>
    <Desktop app={app} screen={screen} />
    {noteObj && <NoteDrawer note={noteObj} onClose={closeNote} say={t => speech.say(t)} />}
  </>;
  return (
    <div className="shell" ref={root}>
      <Current key={screen} app={app} />
      {noteObj && <NoteSheet note={noteObj} onClose={closeNote} say={t => speech.say(t)} />}
    </div>
  );
}
