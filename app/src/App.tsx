import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from './lesson/schema';
import { assetUrl, isPreview, loadLesson, loadSchedule, loadToday, requestedNumber, todaysNumber } from './lesson/load';
import type { Schedule } from './lesson/schedule';
import type { Library } from './library';
import { Lessons } from './screens/Lessons';
import { PreviewBar } from './screens/PreviewBar';
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
import { Casting } from './casting/Casting';

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
  // ?casting opens the voice casting review page instead of the lesson.
  if (new URLSearchParams(window.location.search).has('casting')) return <Casting />;
  return <LessonRoot />;
}

function LessonRoot() {
  const wide = useWide();
  const [state, setState] = useState<{ schedule?: Schedule; today?: Lesson; lesson?: Lesson; start?: boolean; error?: string }>({});
  useEffect(() => {
    (async () => {
      const schedule = await loadSchedule();
      const today = await loadToday(schedule);
      if (!today) throw new Error('No lessons found. Add public/lessons/lesson-001.json.');
      // ?lesson=N opens another lesson: any past one, or a future one in preview mode
      // (the server returns nothing for future lessons otherwise, so you get today's).
      const n = requestedNumber();
      const lesson = n && n !== today.number ? (await loadLesson(n, schedule)) ?? today : today;
      setState({ schedule, today, lesson });
    })().catch(e => setState({ error: String(e?.message ?? e) }));
  }, []);

  const { schedule, today, lesson } = state;
  const open = useCallback(async (n: number, start = false) => {
    if (!schedule || !today) return;
    const l = n === today.number ? today : await loadLesson(n, schedule).catch(() => null);
    if (!l) return;
    const url = new URL(window.location.href);
    if (l === today) url.searchParams.delete('lesson'); else url.searchParams.set('lesson', String(n));
    window.history.replaceState(null, '', url);
    setState(st => ({ ...st, lesson: l, start }));
    window.scrollTo(0, 0);
  }, [schedule, today]);

  if (schedule && today && lesson) {
    const library: Library = { schedule, today, todayNumber: schedule.mode === 'open' ? today.number : todaysNumber(schedule), preview: isPreview(), open };
    return <LessonApp key={lesson.id} lesson={lesson} library={library} start={!!state.start} wide={wide} />;
  }
  return (
    <div className="shell">
      <div className="center-msg">
        <Critter kind="olive" size={88} expression={state.error ? 'sleepy' : 'look'} blink />
        <p style={{ margin: 0, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', textAlign: state.error ? 'left' : 'center', fontSize: 14 }}>
          {state.error ?? 'Un instant…'}
        </p>
      </div>
    </div>
  );
}

function LessonApp({ lesson, library, start, wide }: { lesson: Lesson; library: Library; start: boolean; wide: boolean }) {
  const { lines, paragraphs } = useMemo(() => flattenStory(lesson), [lesson]);
  // Lesson 1's progress was saved under its date before lessons were numbered.
  const legacyKey = lesson.number === 1 ? lesson.date : undefined;
  const [screen, setScreen] = useState<Screen>(() => {
    if (!start) return 'home';
    const d = loadProgress(lesson.id, legacyKey).done;
    return !d.story ? 'story' : !d.quiz ? 'quiz' : !d.spoken ? 'spoken' : !d.describe ? 'describe' : 'story';
  });
  const [note, setNote] = useState<string | null>(null);
  const [progress, setProgressState] = useState<Progress>(() => loadProgress(lesson.id, legacyKey));
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  // Recorded voices (ElevenLabs), if this lesson has them; otherwise device voices.
  const [manifest, setManifest] = useState<AudioManifest | null>(null);
  useEffect(() => { loadManifest(assetUrl(lesson.id, 'audio/manifest.json')).then(setManifest); }, [lesson.id]);
  const speech = useSpeech(lesson.cast, lines, prefs.slow, manifest, assetUrl(lesson.id, 'audio/'));
  const ambience = useAmbience(manifest?.ambience ? assetUrl(lesson.id, 'audio/' + manifest.ambience.file) : null, lesson.ambience?.volume ?? 0.18);
  const root = useRef<HTMLDivElement>(null);

  const setProgress = useCallback((p: Partial<Progress>) => setProgressState(prev => {
    const next = { ...prev, ...p, done: { ...prev.done, ...p.done } };
    saveProgress(lesson.id, next);
    return next;
  }), [lesson.id]);
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
    asset: file => assetUrl(lesson.id, file),
    library, isToday: lesson.id === library.today.id,
  };
  const noteObj = note ? lesson.notes.find(n => n.id === note) : undefined;

  useEffect(() => { document.title = `${lesson.title} · apéro club`; }, [lesson.title]);
  // Each screen remounts on entry (key), so its local state starts fresh.
  const Screens: Record<Screen, typeof Home> = { home: Home, grammar: Grammar, lessons: Lessons, story: Story, quiz: Quiz, spoken: SayIt, describe: Describe, result: Corrections, complete: Complete };
  const Current = Screens[screen];

  const closeNote = () => { speech.stop(); setNote(null); };
  if (wide) return <>
    <PreviewBar app={app} />
    <Desktop app={app} screen={screen} />
    {noteObj && <NoteDrawer note={noteObj} onClose={closeNote} say={t => speech.say(t)} />}
  </>;
  return (
    <div className="shell" ref={root}>
      <PreviewBar app={app} />
      <Current key={screen} app={app} />
      {noteObj && <NoteSheet note={noteObj} onClose={closeNote} say={t => speech.say(t)} />}
    </div>
  );
}
