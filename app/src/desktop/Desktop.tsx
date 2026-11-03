/**
 * Desktop layout (≥ 900px wide), ported from the "Apero v3" web design:
 * sticky header with nav and step bars, full-width ultramarine bands with poster
 * tiles, a 1120px content column, and a right-hand drawer for grammar notes.
 * Same lesson data, state and audio as the phone layout.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Badge, Button, ChoiceBlock, IconButton, type ChoiceState } from '../ds/controls';
import { Critter, FillTile, ShapeTile, tok, type ShapeName } from '../ds/brand';
import { Icon } from '../ds/Icon';
import { isDialogue, stripDash } from '../lesson/story';
import type { HeroTileT, Lesson, LessonNote } from '../lesson/schema';
import { groupLessons, isDone, lessonStatus, topicsOf, useLessonList } from '../library';
import { LessonSheet } from '../screens/Lessons';
import type { AppCtx, Screen } from '../screens/common';
import { Eyebrow, pad, PRAISE, STEPS } from '../screens/common';
import { HeroTile } from '../screens/HeroTile';

const EN_LABEL = { story: 'Listen', quiz: 'Check', spoken: 'Say it', describe: 'Write' } as const;
const STEP_TILE = [
  { bg: 'var(--violet-500)', fg: 'var(--white)' }, { bg: 'var(--sun-300)', fg: 'var(--sun-900)' },
  { bg: 'var(--orange-500)', fg: 'var(--ink-900)' }, { bg: 'var(--sky-300)', fg: 'var(--sky-900)' },
];
const NOTE_TILES: { shape: ShapeName; tileBg: string; tileFg: string; tileAccent?: string }[] = [
  { shape: 'halves', tileBg: 'orange-500', tileFg: 'orange-300' }, { shape: 'flower', tileBg: 'sun-300', tileFg: 'violet-500', tileAccent: 'orange-500' },
  { shape: 'arch', tileBg: 'orange-500', tileFg: 'sun-300' }, { shape: 'circle', tileBg: 'violet-500', tileFg: 'sky-300' },
  { shape: 'pill', tileBg: 'green-900', tileFg: 'pink-500' },
];
const Q_SHAPES: { shape: ShapeName; bg: string; fg: string }[] = [
  { shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' }, { shape: 'arch', bg: 'orange-500', fg: 'sun-300' },
  { shape: 'flower', bg: 'green-900', fg: 'green-300' }, { shape: 'pill', bg: 'sky-300', fg: 'violet-500' },
  { shape: 'circle', bg: 'sun-300', fg: 'orange-500' }, { shape: 'halves', bg: 'green-900', fg: 'green-300' },
];
const REG_TONE = { Familier: 'sun', Courant: 'sky', Soigné: 'violet' } as const;

const H2 = ({ children }: { children: ReactNode }) => <h2 className="t-h3" style={{ margin: 0 }}>{children}</h2>;
const bandTitle = { margin: 0, font: '900 clamp(34px,5.4vw,60px)/0.92 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)' } as const;

/** Three square-safe tiles filling the right half of a band. */
function BandTiles({ tiles }: { tiles: { shape: ShapeName; bg: string; fg?: string; icon?: ReactNode }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignSelf: 'stretch' }}>
      {tiles.map((t, i) => <FillTile key={i} minHeight={150} shape={t.shape} bg={t.bg} fg={t.fg}>{t.icon}</FillTile>)}
    </div>
  );
}

export function Desktop({ app, screen }: { app: AppCtx; screen: Screen }) {
  const inSession = (['story', 'quiz', 'spoken', 'describe', 'result'] as Screen[]).includes(screen);
  const cur = screen === 'result' ? 'describe' : screen;
  const Page = { home: DHome, complete: DHome, grammar: DGrammar, lessons: DLessons, story: DStory, quiz: DQuiz, spoken: DSayIt, describe: DDescribe, result: DDescribe }[screen];
  return (
    <div className="desk">
      <header className="desk-header">
        <div className="wrap" style={{ paddingTop: 12, paddingBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => app.go('home')} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', marginRight: 'auto', font: '900 26px/1 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--violet-500)', whiteSpace: 'nowrap' }}>apéro club</button>
          <nav className="seg" aria-label="Main">
            <button aria-current={(screen === 'home' || screen === 'complete' || inSession) && app.isToday ? 'page' : undefined}
              onClick={() => (app.isToday ? app.go('home') : app.library.open(app.library.today.number))}>Today</button>
            <button aria-current={screen === 'lessons' || (!app.isToday && screen !== 'grammar') ? 'page' : undefined} onClick={() => app.go('lessons')}>Lessons</button>
            <button aria-current={screen === 'grammar' ? 'page' : undefined} onClick={() => app.go('grammar')}>Grammar</button>
          </nav>
        </div>
        {inSession && (
          <div className="wrap" style={{ paddingBottom: 12, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
            {STEPS.map(s => {
              const isCur = cur === s.id, isDone = !!app.progress.done[s.id];
              return (
                <button key={s.id} onClick={() => app.go(s.id)} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch', textAlign: 'left', background: 'none', border: 0, padding: 0, cursor: 'pointer', minWidth: 0 }}>
                  <span style={{ display: 'block', height: 8, borderRadius: 'var(--radius-pill)', background: isCur ? 'var(--violet-500)' : isDone ? 'var(--lilac-500)' : 'var(--cream-300)' }} />
                  <span style={{ font: '600 12px/1.2 var(--font-display)', letterSpacing: '-0.02em', color: isCur ? 'var(--violet-500)' : 'var(--fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.n} {EN_LABEL[s.id]}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>
      <main><Page key={screen} app={app} screen={screen} /></main>
    </div>
  );
}

type P = { app: AppCtx; screen: Screen };

function DHome({ app }: P) {
  const { lesson, progress, go, openNote } = app;
  const next = STEPS.find(s => !progress.done[s.id]);
  const allDone = !next;
  const total = Object.values(lesson.minutes).reduce((a, b) => a + b, 0);
  const mins = (id: string) => lesson.minutes[id === 'spoken' ? 'phrases' : (id as 'story')];
  const wide: HeroTileT[] = lesson.heroWide ?? [{ pattern: 'checker', a: 'green-900', b: 'green-500' }, ...lesson.hero];
  const desc: Record<string, string> = {
    story: `A ${app.lines.length}-sentence story read by ${lesson.cast.length} French voices. Tap any line to hear it.`,
    quiz: `${lesson.quiz.length} questions. Every wrong answer comes with the reason.`,
    spoken: 'What you’d write next to what Parisians actually say.',
    describe: 'Describe a scene in French. Each correction is explained.',
  };
  return <>
    <section style={{ background: 'var(--violet-500)', color: 'var(--white)' }}>
      <div className="band-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ padding: '48px 20px 44px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
          <Eyebrow color="var(--lilac-500)">{lesson.label} · {app.isToday ? 'Today’s apéro' : lesson.number > app.library.today.number ? 'Coming up' : 'From the archive'}</Eyebrow>
          <h1 style={{ font: '900 clamp(44px,7vw,80px)/0.92 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)', margin: 0 }}>{lesson.title}</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, maxWidth: '44ch' }}>{lesson.summary} Listen, check you understood, see how it’s really said, then write.</p>
          {allDone && <span className="hand" style={{ fontSize: 30, color: 'var(--lilac-500)', transform: 'rotate(-2deg)' }}>Séance terminée ! À demain.</span>}
          <Button variant="secondary" size="lg" iconRight="arrow-right" onClick={() => go(allDone ? 'story' : next.id)}>
            {allDone ? 'Do it again' : progress.done.story ? `Continue · ${next.label}` : `Start · ${total} min`}
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {wide.map((t, i) => <HeroTile key={i} tile={t} asset={app.asset} />)}
        </div>
      </div>
    </section>
    {allDone && <div className="ribbon" style={{ height: 88, ['--pat-b' as string]: 'var(--orange-500)' }} />}

    <section className="wrap" style={{ paddingTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <H2>Today’s apéro</H2><span style={{ fontSize: 14, color: 'var(--fg-3)' }}>4 steps · about {total} min</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
        {STEPS.map((s, i) => {
          const isDone = !!progress.done[s.id], isNext = next?.id === s.id;
          return (
            <button key={s.id} className="step-tile" onClick={() => go(s.id)} style={{ background: STEP_TILE[i].bg, color: STEP_TILE[i].fg }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: 12 }}>
                <span style={{ font: '900 56px/0.9 var(--font-display)', letterSpacing: '-0.05em' }}>{s.n}</span>
                <span style={{ font: '600 12px/1 var(--font-display)', padding: '7px 10px', borderRadius: 'var(--radius-pill)', background: isDone ? 'var(--green-500)' : isNext ? 'var(--violet-500)' : 'var(--white)', color: isNext && !isDone ? 'var(--white)' : 'var(--ink-900)' }}>
                  {isDone ? 'Done' : isNext ? `Up next · ${mins(s.id)} min` : `${mins(s.id)} min`}
                </span>
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ font: '800 21px/1.1 var(--font-display)', letterSpacing: '-0.03em' }}>{s.label}</span>
                <span style={{ fontSize: 14, lineHeight: 1.45, textWrap: 'pretty' }}>{desc[s.id]}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>

    <section className="wrap" style={{ paddingTop: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <H2>The why behind this story</H2>
        <span className="hand" style={{ fontSize: 24, color: 'var(--violet-500)', transform: 'rotate(-2deg)', alignSelf: 'auto' }}>tap one to dig in</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 12 }}>
        {lesson.notes.slice(0, 4).map(n => (
          <button key={n.id} className="white-card lift" onClick={() => openNote(n.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: 20 }}>
            <Eyebrow color="var(--violet-500)">{n.kicker}</Eyebrow>
            <span style={{ font: '800 18px/1.15 var(--font-display)', letterSpacing: '-0.03em' }}>{n.title}</span>
            <span style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--fg-2)', textWrap: 'pretty' }}>{n.short}</span>
          </button>
        ))}
      </div>
    </section>
  </>;
}

function DGrammar({ app }: P) {
  const { lesson, openNote } = app;
  return <>
    <section style={{ background: 'var(--violet-500)', color: 'var(--white)' }}>
      <div className="band-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ padding: '48px 20px 44px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <Eyebrow color="var(--lilac-500)">Grammar · {lesson.notes.length} notes from today’s story</Eyebrow>
          <h1 style={{ margin: 0, font: '900 clamp(44px,6.4vw,84px)/0.9 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)', overflowWrap: 'anywhere', maxWidth: '100%' }}>Pourquoi&#8239;?</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, maxWidth: '46ch' }}>The grammar behind the stories, explained in English: the rule, how it shows up, how Parisians actually say it, and the usual trap.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignSelf: 'end' }}>
          <ShapeTile shape="arch" bg="lilac-500" fg="violet-900"><Icon name="book-open" size={40} color="var(--lilac-500)" /></ShapeTile>
          <ShapeTile shape="asterisk" />
          <ShapeTile shape="halves" eyes="wide" blink />
          <ShapeTile shape="circle" bg="sun-300" fg="orange-500" />
          <ShapeTile shape="pill" bg="green-900" fg="green-300" />
          <ShapeTile shape="flower" />
        </div>
      </div>
    </section>
    <section className="wrap" style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <H2>From today’s story</H2><span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{lesson.title} · {lesson.notes.length} notes</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
        {lesson.notes.map((n, i) => {
          const t = NOTE_TILES[i % NOTE_TILES.length];
          return (
            <button key={n.id} className="white-card lift" onClick={() => openNote(n.id)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: 24, overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: 0, right: 0, width: 72, height: 72 }}><ShapeTile shape={t.shape} bg={t.tileBg} fg={t.tileFg} accent={t.tileAccent} size={72} /></span>
              <span style={{ display: 'flex', gap: 10, alignItems: 'baseline', paddingRight: 80 }}>
                <span style={{ font: '900 14px/1 var(--font-display)', color: 'var(--violet-500)' }}>{pad(i + 1)}</span>
                <Eyebrow color="var(--violet-700)" style={{ whiteSpace: 'nowrap' }}>{n.kicker}</Eyebrow>
              </span>
              <span style={{ font: '800 22px/1.1 var(--font-display)', letterSpacing: '-0.035em', textWrap: 'balance', paddingRight: 56 }}>{n.title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--fg-2)', textWrap: 'pretty' }}>{n.short}</span>
              <span style={{ marginTop: 'auto', paddingTop: 14, borderTop: '2px solid var(--cream-100)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ font: '700 16px/1.4 var(--font-body)', color: 'var(--violet-500)' }}>« {n.examples[0].fr} »</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 13px/1 var(--font-display)', letterSpacing: '-0.02em' }}>Read the note<Icon name="arrow-right" size={16} /></span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  </>;
}

function DStory({ app }: P) {
  const { lesson, lines, paragraphs, speech: sp, prefs, setPrefs, go, openNote } = app;
  const [started, setStarted] = useState(false);
  const cast = Object.fromEntries(lesson.cast.map(c => [c.id, c]));
  const last = lines.length - 1;
  // unlock() must run inside the tap so browsers allow the background sound.
  const playFrom = (i: number) => { app.ambience.unlock(); setStarted(true); sp.playFrom(i); };
  // Background ambience follows story playback (and the learner's on/off choice).
  const amb = app.ambience;
  useEffect(() => { amb.setActive(prefs.ambience && sp.playing); }, [amb, prefs.ambience, sp.playing]);
  useEffect(() => () => amb.setActive(false), [amb]);
  const toggleAmbience = () => { amb.unlock(); setPrefs({ ambience: !prefs.ambience }); };
  const move = (d: number) => { const i = Math.max(0, Math.min(last, sp.cur + d)); setStarted(true); if (sp.playing) sp.playFrom(i); else sp.setCur(i); };
  const toggleSlow = () => { const was = sp.playing; setPrefs({ slow: !prefs.slow }); setStarted(true); setTimeout(() => (was ? sp.playFrom(sp.cur) : sp.sayLine(sp.cur)), 150); };

  return <>
    <section style={{ background: 'var(--violet-500)' }}>
      <div className="band-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ padding: '40px 20px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          <Eyebrow color="var(--lilac-500)">01 · Listen and read</Eyebrow>
          <h2 style={bandTitle}>{lesson.title}</h2>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--white)' }}>{lines.length} sentences{lesson.place ? ` · ${lesson.place}` : ''}</p>
        </div>
        <BandTiles tiles={[
          { shape: 'arch', bg: 'orange-500', fg: 'sun-300', icon: <Icon name="headphones" size={36} color="var(--orange-700)" /> },
          { shape: 'pill', bg: 'lilac-500', fg: 'violet-500' }, { shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' },
        ]} />
      </div>
    </section>

    <section style={{ maxWidth: 880, margin: '0 auto', padding: '20px 20px 0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', alignItems: 'center', padding: '6px 0 18px' }}>
        {lesson.cast.map((c, i) => (
          <span key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Critter kind={c.critter.kind} color={c.critter.color} size={44} blink blinkDelay={i * 0.8} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: '700 15px/1.1 var(--font-body)', color: tok(c.color) }}>{c.name}</span>
              {c.role && <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{c.role}</span>}
            </span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <span className="hand" style={{ fontSize: 24, color: 'var(--violet-500)', transform: 'rotate(-2deg)', whiteSpace: 'nowrap', alignSelf: 'auto' }}>tap any line to hear it</span>
        {(sp.noFrench || !sp.supported) && <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
          {sp.supported ? 'No French voice on this device, so audio uses the default voice.' : 'This browser can’t play audio, but you can still read along.'}
        </span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {paragraphs.map((ix, pi) => {
          const first = lines[ix[0]], who = cast[first.speaker];
          return (
            <div key={pi} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {isDialogue(first.fr) && <Eyebrow color={tok(who.label ?? who.color)}>{who.name}</Eyebrow>}
              <p style={{ margin: 0, font: '500 clamp(19px,2.4vw,23px)/1.65 var(--font-body)', color: 'var(--ink-900)' }}>
                {ix.map((li, k) => {
                  const line = lines[li], isCur = li === sp.cur, lw = line.words.length - 1;
                  const at = (pos: number) => (line.parts.find(p => pos >= p.start && pos < p.end) ?? line.parts[0]).speaker;
                  return (
                    <span key={li}>
                      <span className="story-line" onClick={() => playFrom(li)} style={{ cursor: 'pointer', borderRadius: 8, WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '3px 2px', background: isCur && started ? 'var(--white)' : 'transparent' }}>
                        {line.words.map((w, j) => {
                          const active = isCur && sp.playing && sp.wordPos >= w.start && (j === lw || sp.wordPos < line.words[j + 1].start);
                          return <span key={j}><span style={{ borderRadius: 6, background: active ? 'var(--violet-500)' : 'transparent', color: active ? 'var(--white)' : tok(cast[at(w.start)].color) }}>{w.t}</span>{j < lw ? ' ' : ''}</span>;
                        })}
                      </span>
                      {line.note && <button className="why-chip" onClick={e => { e.stopPropagation(); sp.stop(); openNote(line.note); }}>why?</button>}
                      {k < ix.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
              {prefs.showEN && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--fg-3)' }}>{ix.map(i => lines[i].en).join(' ')}</p>}
            </div>
          );
        })}
      </div>
    </section>

    <div style={{ position: 'sticky', bottom: 0, zIndex: 5, marginTop: 28, background: 'var(--bg)', borderTop: '2px solid var(--cream-200)', boxShadow: 'var(--shadow-sheet)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '12px 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <IconButton icon="skip-back" label="Previous sentence" variant="outline" shape="circle" onClick={() => move(-1)} />
        <Button icon={sp.playing ? 'pause' : 'play'} onClick={() => (sp.playing ? sp.stop() : playFrom(sp.cur))} style={{ minWidth: 128 }}>{sp.playing ? 'Pause' : 'Play'}</Button>
        <IconButton icon="skip-forward" label="Next sentence" variant="outline" shape="circle" onClick={() => move(1)} />
        <span style={{ font: '700 13px/1 var(--font-display)', fontVariantNumeric: 'tabular-nums', marginRight: 'auto', paddingLeft: 4 }}>{pad(sp.cur + 1)} / {lines.length}</span>
        <div className="seg">
          <button aria-pressed={prefs.slow} onClick={toggleSlow} style={{ fontSize: 12, padding: '0 14px' }}>Slow</button>
          <button aria-pressed={prefs.showEN} onClick={() => setPrefs({ showEN: !prefs.showEN })} style={{ fontSize: 12, padding: '0 14px' }}>EN</button>
          {amb.available && <button aria-pressed={prefs.ambience} onClick={toggleAmbience} title="Background sound while the story plays" style={{ fontSize: 12, padding: '0 14px' }}>Ambience</button>}
        </div>
        <Button variant="secondary" iconRight="arrow-right" onClick={() => go('quiz', 'story')}>Quiz</Button>
      </div>
    </div>
  </>;
}

function DQuiz({ app }: P) {
  const { lesson, lines, speech: sp, go, openNote, setProgress } = app;
  const quiz = lesson.quiz, N = quiz.length;
  const [q, setQ] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const isRight = (i: number) => picks[i] != null && !!quiz[i].options[picks[i]].correct;
  const score = quiz.filter((_, i) => isRight(i)).length;

  const header = (
    <section style={{ background: 'var(--violet-500)' }}>
      <div className="band-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ padding: '40px 20px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
          <Eyebrow color="var(--lilac-500)">02 · Check you understood</Eyebrow>
          <h2 style={bandTitle}>Avez-vous compris&#8239;?</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160, maxWidth: 300, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`, gap: 4 }}>
              {quiz.map((_, i) => <span key={i} style={{ display: 'block', height: 10, borderRadius: 'var(--radius-pill)', background: picks[i] != null ? (isRight(i) ? 'var(--green-500)' : 'var(--orange-500)') : i === q && !finished ? 'var(--white)' : 'var(--violet-700)' }} />)}
            </div>
            <span style={{ font: '700 13px/1 var(--font-display)', color: 'var(--white)', fontVariantNumeric: 'tabular-nums' }}>{finished ? `${score} / ${N} right` : `Question ${q + 1} / ${N}`}</span>
          </div>
        </div>
        <BandTiles tiles={[{ shape: 'arch', bg: 'sky-300', fg: 'violet-500' }, { shape: 'halves', bg: 'sky-500' }, { shape: 'pill', bg: 'green-900', fg: 'green-300' }]} />
      </div>
    </section>
  );

  if (finished) return <>
    {header}
    <section className="wrap" style={{ paddingTop: 32, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <span style={{ font: '900 clamp(72px,12vw,128px)/0.85 var(--font-display)', letterSpacing: '-0.06em', color: 'var(--violet-500)' }}>{score}<span style={{ color: 'var(--ink-500)' }}>/{N}</span></span>
        <span style={{ fontSize: 17, lineHeight: 1.5, maxWidth: '38ch' }}>
          {score === N ? 'Tout juste. Every question right.' : score >= N * 0.66 ? 'Bien joué. Open the explanation for the ones you missed. Each is a pattern you’ll meet again.' : 'Worth a second listen. Each missed question links to its explanation.'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Button size="lg" iconRight="arrow-right" onClick={() => go('spoken', 'quiz')}>Continue</Button>
          <Button variant="outline" size="lg" icon="rotate-ccw" onClick={() => { setQ(0); setSel(null); setPicks({}); setFinished(false); }}>Retry quiz</Button>
        </div>
      </div>
      <div style={{ flex: '2 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 2px var(--cream-200)', overflow: 'hidden' }}>
        {quiz.map((qq, i) => {
          const ok = isRight(i);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px minmax(0,1fr) auto', gap: 12, alignItems: 'center', padding: '14px 18px', borderBottom: '2px solid var(--cream-100)' }}>
              <span style={{ font: '800 12px/1 var(--font-display)', color: 'var(--fg-3)' }}>{pad(i + 1)}</span>
              <span style={{ fontSize: 15 }}>{qq.prompt}</span>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {!ok && qq.note && <Button variant="ghost" size="sm" icon="lightbulb" onClick={() => openNote(qq.note)}>Why?</Button>}
                <Badge tone={ok ? 'green' : 'orange'}>{ok ? 'Right' : 'Review'}</Badge>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  </>;

  const Q = quiz[q], pick = picks[q], answered = pick != null;
  const okIdx = Q.options.findIndex(o => o.correct), correct = answered && !!Q.options[pick].correct;
  const listenLine = Q.listen ? lines.find(l => l.id === Q.listen) : undefined;
  const play = () => (listenLine ? sp.sayLine(listenLine.index) : Q.quote && sp.say(Q.quote));
  const next = () => { sp.stop(); if (q < N - 1) { setQ(q + 1); setSel(null); } else { setFinished(true); setProgress({ score }); } };
  const shape = Q_SHAPES[q % Q_SHAPES.length];

  return <>
    {header}
    <section className="wrap" style={{ paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ border: '2px solid var(--ink-900)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'var(--white)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, borderBottom: '2px solid var(--ink-900)' }}>
          <Eyebrow color="var(--violet-700)">Question {q + 1} / {N} · {Q.kind}</Eyebrow>
          <h3 style={{ margin: 0, font: '800 clamp(20px,2.6vw,28px)/1.15 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--ink-900)', textWrap: 'pretty' }}>{Q.prompt}</h3>
          {listenLine && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <IconButton icon="volume-2" label="Play the line" variant="primary" size="lg" onClick={play} />
              {answered
                ? <span style={{ font: '600 18px/1.4 var(--font-body)' }}>«&#8239;{stripDash(listenLine.fr)}&#8239;»</span>
                : <span className="hand" style={{ fontSize: 26, color: 'var(--violet-500)', transform: 'rotate(-2deg)', alignSelf: 'auto' }}>listen, no peeking!</span>}
            </div>
          )}
          {Q.quote && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <IconButton icon="volume-2" label="Play" variant="primary" onClick={play} />
              <p style={{ margin: 0, font: '800 clamp(18px,2.2vw,22px)/1.3 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--violet-500)' }}>{Q.quote}</p>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, background: 'var(--ink-900)' }}>
          {Q.options.map((o, i) => {
            const state: ChoiceState = !answered ? (sel === i ? 'selected' : 'idle') : o.correct ? 'correct' : i === pick ? 'wrong' : 'disabled';
            const sub = !answered ? undefined : i === pick ? 'Your answer' : o.correct ? 'The right answer' : undefined;
            return <ChoiceBlock key={`${q}-${i}`} index={i + 1} state={state} sublabel={sub} minHeight={150} onClick={() => setSel(i)}>{o.text}</ChoiceBlock>;
          })}
          {Q.options.length % 2 === 1 && <FillTile minHeight={150} shape={shape.shape} bg={shape.bg} fg={shape.fg} />}
        </div>
      </div>

      {!answered ? (
        <div><Button size="lg" disabled={sel == null} onClick={() => { if (sel != null) { sp.stop(); setPicks({ ...picks, [q]: sel }); } }}>Check</Button></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, font: '900 clamp(26px,3.4vw,34px)/1 var(--font-display)', letterSpacing: '-0.04em', color: correct ? 'var(--green-700)' : 'var(--orange-700)', whiteSpace: 'nowrap' }}>{correct ? PRAISE[q % PRAISE.length] : 'Not quite.'}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Q.note && <Button variant="ghost" size="lg" icon="lightbulb" onClick={() => openNote(Q.note)}>Why?</Button>}
              <Button size="lg" iconRight="arrow-right" onClick={next}>{q < N - 1 ? (correct ? 'Next question' : 'Got it') : 'See your score'}</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 12 }}>
            {!correct && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--orange-100)', color: 'var(--orange-900)' }}>
                <span className="t-eyebrow">You picked {pick + 1} · why not</span>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{Q.options[pick].why}</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--green-100)', color: 'var(--green-900)' }}>
              <span className="t-eyebrow">Answer {okIdx + 1} · why it’s right</span>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{Q.options[okIdx].text}</p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{Q.options[okIdx].why}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  </>;
}

function DSayIt({ app }: P) {
  const { lesson, speech: sp, go } = app;
  return <>
    <section style={{ background: 'var(--sun-300)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px' }}>
        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow color="var(--sun-900)">03 · How Parisians say it</Eyebrow>
          <h2 style={{ margin: 0, font: '900 clamp(30px,5vw,50px)/0.95 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--violet-500)' }}>Ce qu’on écrit, ce qu’on dit</h2>
          <p style={{ margin: 0, fontSize: 16, maxWidth: '58ch', color: 'var(--sun-900)' }}>Lines from today’s story, written carefully and as you’d hear them in Paris. Both are correct French. What changes is where you use each one.</p>
        </div>
        <FillTile minHeight={84} shape="asterisk" bg="violet-500" fg="lilac-500" />
      </div>
    </section>
    <section className="wrap" style={{ paddingTop: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14, color: 'var(--fg-2)', marginBottom: 16 }}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Badge tone="sky">Courant</Badge>everyday, fine anywhere</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Badge tone="sun">Familier</Badge>friends and neighbours, never in an email</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lesson.phrases.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexWrap: 'wrap', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ flex: '1 1 260px', minWidth: 0, background: 'var(--white)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Eyebrow>Written</Eyebrow>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <IconButton icon="volume-2" label="Listen" variant="outline" shape="circle" size="sm" onClick={() => sp.say(p.written)} />
                <span style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--ink-700)' }}>{p.written}</span>
              </div>
            </div>
            <div style={{ flex: '1.25 1 300px', minWidth: 0, background: 'var(--violet-500)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><Eyebrow color="var(--lilac-500)">Spoken, in Paris</Eyebrow><Badge tone={REG_TONE[p.register]} size="sm">{p.register}</Badge></span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <IconButton icon="volume-2" label="Listen" variant="secondary" shape="circle" size="sm" onClick={() => sp.say(p.spoken)} />
                <span style={{ font: '800 21px/1.2 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--white)', textWrap: 'balance' }}>{p.spoken}</span>
              </div>
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0, background: 'var(--violet-50)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Eyebrow color="var(--violet-700)">Why</Eyebrow>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-900)', textWrap: 'pretty' }}>{p.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: 24 }}><Button size="lg" iconRight="arrow-right" onClick={() => go('describe', 'spoken')}>Continue</Button></div>
    </section>
  </>;
}

function DDescribe({ app, screen }: P) {
  const { lesson, progress, setProgress, speech: sp, go } = app;
  const d = lesson.describe, r = d.sample.result;
  const text = progress.text ?? '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const shown = screen === 'result';
  const own = text.trim() !== '' && text.trim() !== d.sample.text.trim();
  const setText = (t: string) => setProgress({ text: t });
  const add = (h: string) => setText((text && !/\s$/.test(text) ? text + ' ' : text) + h.replace('…', '') + ' ');

  return <>
    <section className="wrap" style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Eyebrow color="var(--violet-500)">04 · Describe the scene</Eyebrow>
      <h2 style={{ margin: 0, font: '900 clamp(30px,5vw,50px)/0.95 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--violet-500)' }}>Décris la scène</h2>
    </section>
    <section className="wrap" style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 28, alignItems: 'start' }}>
      <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: 'var(--violet-500)', padding: '24px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', aspectRatio: '5/6', borderRadius: 'var(--radius-arch-full)', overflow: 'hidden', background: 'var(--cream-100)' }}>
            <img src={app.asset(d.image)} alt={d.alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: d.imagePosition }} />
          </div>
        </div>
        {d.caption && <figcaption style={{ fontSize: 13, color: 'var(--fg-3)' }}>{d.caption}</figcaption>}
      </figure>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>{d.instructions} Don’t look words up. Write what you can.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {d.helpers.map(h => <button key={h} className="helper-pill" onClick={() => add(h)}>{h}</button>)}
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: '700 14px/1 var(--font-body)' }}>Your description</span>
          <textarea className="textarea" rows={7} lang="fr" value={text} onChange={e => setText(e.target.value)} placeholder={d.placeholder} style={{ minHeight: 180, resize: 'vertical', lineHeight: 1.55 }} />
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Button size="lg" icon="check" onClick={() => go('result')}>Check</Button>
          <Button variant="ghost" size="lg" icon="sparkles" onClick={() => setText(d.sample.text)}>Try a sample</Button>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--fg-3)' }}>{words} word{words === 1 ? '' : 's'}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--fg-3)' }}>Checking your own writing is coming soon. For now, Check shows a typical description with every correction explained.</p>
      </div>
    </section>

    {shown && (
      <section className="wrap" style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 className="t-h3" style={{ margin: 0 }}>Corrections</h3>
          <Badge tone="orange">{r.corrections.length} correction{r.corrections.length === 1 ? '' : 's'}</Badge>
          {!own && r.praise && <span className="hand" style={{ fontSize: 24, color: 'var(--green-700)', alignSelf: 'auto' }}>{r.praise}</span>}
        </div>
        {own && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-700)', maxWidth: '70ch' }}>Here’s a typical description of the scene, corrected. Compare it with yours: the same slips are easy to make.</p>}
        <p lang="fr" style={{ margin: 0, padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)', font: '400 clamp(18px,2.3vw,21px)/1.9 var(--font-body)' }}>
          {r.segments.map((g, i) => 't' in g ? <span key={i}>{g.t}</span> : (
            <span key={i}>
              <del style={{ color: 'var(--orange-700)', textDecorationThickness: 2 }}>{g.from}</del>{g.from && g.to ? ' ' : ''}
              <ins style={{ textDecoration: 'none', fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'var(--green-100)', color: 'var(--green-900)' }}>{g.to}</ins>
              <sup style={{ font: '800 11px/1 var(--font-display)', color: 'var(--violet-500)', marginLeft: 2 }}>{g.n}</sup>
            </span>
          ))}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 12 }}>
          {r.corrections.map(c => (
            <div key={c.n} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
              <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--violet-500)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 12px/1 var(--font-display)' }}>{c.n}</span>
                <Eyebrow color="var(--violet-700)">{c.rule}</Eyebrow>
              </span>
              <span lang="fr" style={{ fontSize: 17 }}><del style={{ color: 'var(--orange-700)' }}>{c.from}</del> → <strong style={{ color: 'var(--green-700)' }}>{c.to}</strong></span>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-700)' }}>{c.why}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--sun-300)', color: 'var(--sun-900)' }}>
          <span className="t-eyebrow">Out loud, a Parisian would say</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <IconButton icon="volume-2" label="Listen" variant="primary" shape="circle" onClick={() => sp.say(r.spoken)} />
            <p lang="fr" style={{ margin: 0, font: '700 19px/1.5 var(--font-body)', color: 'var(--ink-900)' }}>{r.spoken}</p>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{r.spokenNote}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Button size="lg" icon="check" onClick={() => go('home', 'describe')}>Finish session</Button>
          <Button variant="outline" size="lg" icon="rotate-ccw" onClick={() => go('describe')}>Rewrite</Button>
        </div>
      </section>
    )}
  </>;
}

/** Grammar note as a right-hand drawer (desktop). */
export function NoteDrawer({ note, onClose, say }: { note: LessonNote; onClose: () => void; say: (t: string) => void }) {
  return (
    <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label={note.title}>
      <button className="sheet-scrim" aria-label="Close" onClick={onClose} />
      <aside className="drawer">
        <div style={{ background: 'var(--violet-500)', padding: '16px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Eyebrow color="var(--lilac-500)">Why? · {note.kicker}</Eyebrow>
            <IconButton icon="x" label="Close" variant="secondary" shape="circle" size="sm" onClick={onClose} />
          </div>
          <h2 style={{ margin: 0, font: '900 clamp(26px,4vw,34px)/1 var(--font-display)', letterSpacing: '-0.04em', color: 'var(--lilac-500)' }}>{note.title}</h2>
          <p style={{ margin: 0, font: '600 18px/1.4 var(--font-body)', color: 'var(--white)' }}>{note.short}</p>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{note.body.map((p, i) => <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{p}</p>)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Eyebrow>Examples</Eyebrow>
            {note.examples.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: 12, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
                <IconButton icon="volume-2" label="Listen" variant="primary" shape="circle" size="sm" onClick={() => say(ex.fr)} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <span style={{ font: '800 17px/1.25 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--violet-500)' }}>{ex.fr}</span>
                  <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{ex.en}</span>
                  <span style={{ alignSelf: 'flex-start', font: '600 11px/1 var(--font-display)', padding: '5px 9px', borderRadius: 'var(--radius-pill)', background: 'var(--violet-100)', color: 'var(--violet-700)' }}>{ex.tag}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--sun-300)', color: 'var(--sun-900)' }}>
            <span className="t-eyebrow">Spoken, in Paris</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-900)' }}>{note.spoken}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
            <span className="hand" style={{ fontSize: 24, color: 'var(--orange-700)', transform: 'rotate(-2deg)' }}>the trap!</span>
            <span style={{ fontSize: 17 }}><del style={{ color: 'var(--orange-700)', textDecorationThickness: 2 }}>{note.trap.wrong}</del></span>
            <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-700)' }}>{note.trap.right}</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-700)' }}>{note.trap.why}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

const CARD_SHAPES: { shape: ShapeName; bg: string; fg: string }[] = [
  { shape: 'arch', bg: 'orange-500', fg: 'sun-300' }, { shape: 'circle', bg: 'sky-300', fg: 'violet-500' }, { shape: 'flower', bg: 'green-900', fg: 'green-300' },
  { shape: 'halves', bg: 'sun-300', fg: 'orange-500' }, { shape: 'pill', bg: 'violet-500', fg: 'lilac-500' }, { shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' },
];
type Filter = 'all' | 'todo' | 'done';

/** "Toutes les leçons", from the Apero v3 design, without the paywall. */
function DLessons({ app }: P) {
  const { library } = app;
  const { past, upcoming, hasMore, loading, more } = useLessonList(library);
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Lesson | null>(null);
  const today = library.today;
  const shown = past.filter(l => filter === 'all' || (filter === 'done') === isDone(l));
  const groups = groupLessons(shown, library);
  const count = (n: number) => `${n} lesson${n === 1 ? '' : 's'}`;

  const Card = ({ l, note }: { l: Lesson; note?: string }) => {
    const sh = CARD_SHAPES[(l.number - 1) % CARD_SHAPES.length], done = isDone(l);
    return (
      <button className="white-card lift" onClick={() => setOpen(l)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 20, overflow: 'hidden', minHeight: 220 }}>
        <span style={{ position: 'absolute', top: 0, right: 0, width: 64, height: 64 }}><ShapeTile shape={sh.shape} bg={sh.bg} fg={sh.fg} size={64} /></span>
        <Eyebrow style={{ paddingRight: 72 }}>{l.label}</Eyebrow>
        <span style={{ font: '800 20px/1.1 var(--font-display)', letterSpacing: '-0.035em', paddingRight: 52, textWrap: 'balance' }}>{l.title}</span>
        <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--fg-2)', textWrap: 'pretty' }}>{l.summary}</span>
        <span style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', paddingTop: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--violet-700)' }}>{note ?? topicsOf(l).join(' · ')}</span>
          {note ? <Badge tone="ink" size="sm">Preview</Badge> : <Badge tone={done ? 'green' : 'violet'} size="sm">{done ? 'Done' : 'Start'}</Badge>}
        </span>
      </button>
    );
  };
  const Grid = ({ children }: { children: ReactNode }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>{children}</div>;

  return <>
    <section style={{ background: 'var(--violet-500)', color: 'var(--white)' }}>
      <div className="band-grid" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ padding: '48px 20px 44px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <Eyebrow color="var(--lilac-500)">{library.schedule.mode === 'open' ? 'Lessons · stories from everyday Paris' : 'Lessons · a new story every morning'}</Eyebrow>
          <h1 style={{ margin: 0, font: '900 clamp(44px,6.4vw,80px)/0.9 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)' }}>Toutes les leçons</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, maxWidth: '46ch' }}>{library.schedule.mode === 'open' ? 'Every lesson so far' : 'Every daily lesson so far'}, each with its story, quiz, spoken French and writing prompt. Written for learners between A2 and B1.</p>
        </div>
        <BandTiles tiles={[{ shape: 'halves', bg: 'sky-500' }, { shape: 'circle', bg: 'sky-300', fg: 'violet-500' }, { shape: 'arch', bg: 'orange-500', fg: 'sun-300' }]} />
      </div>
    </section>
    <section className="wrap" style={{ paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--violet-500)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: '1 1 320px' }}>
          <Eyebrow color="var(--violet-700)">{library.schedule.mode === 'open' ? 'Dernière leçon' : 'Aujourd’hui'} · {today.label}</Eyebrow>
          <span style={{ font: '900 clamp(24px,3vw,32px)/1 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--violet-500)' }}>{today.title}</span>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--fg-2)' }}>{today.summary}</span>
        </div>
        <Button size="lg" iconRight="arrow-right" onClick={() => (app.isToday ? app.go('home') : library.open(today.number))}>Today’s apéro</Button>
      </div>

      {library.preview && upcoming.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}><H2>Coming up</H2><span style={{ fontSize: 14, color: 'var(--fg-3)' }}>preview only · {count(upcoming.length)}</span></div>
          <Grid>{upcoming.map(l => <Card key={l.id} l={l} note={lessonStatus(l, library)} />)}</Grid>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: -16 }}>
        <div className="seg">
          {([['all', 'All'], ['todo', 'To do'], ['done', 'Done']] as [Filter, string][]).map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
        <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{count(shown.length)} before {library.schedule.mode === 'open' ? 'this one' : 'today'}</span>
      </div>
      {groups.map(g => (
        <div key={g.name} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}><H2>{g.name}</H2><span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{count(g.items.length)}</span></div>
          <Grid>{g.items.map(l => <Card key={l.id} l={l} />)}</Grid>
        </div>
      ))}
      {!loading && past.length === 0 && <p style={{ margin: 0, fontSize: 16, color: 'var(--fg-3)' }}>{library.schedule.mode === 'open' ? 'Earlier lessons will appear here.' : 'Past lessons will appear here, one more every day.'}</p>}
      {past.length > 0 && !groups.length && <p style={{ margin: 0, fontSize: 16, color: 'var(--fg-3)' }}>No lessons match this filter.</p>}
      {hasMore && <div><Button variant="outline" onClick={more} disabled={loading}>{loading ? 'Loading…' : 'Show older lessons'}</Button></div>}
    </section>
    {open && <LessonSheet lesson={open} app={app} onClose={() => setOpen(null)} centered />}
  </>;
}
