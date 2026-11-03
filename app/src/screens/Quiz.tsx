import { useState } from 'react';
import { Badge, Button, ChoiceBlock, FeedbackBanner, IconButton, type ChoiceState } from '../ds/controls';
import { FillTile, type ShapeName } from '../ds/brand';
import { stripDash } from '../lesson/story';
import type { AppCtx } from './common';
import { Eyebrow, pad, PRAISE, SessionHeader } from './common';

type T = { shape: ShapeName; bg: string; fg: string };
/** Decorative tiles per question: [band tile, 4th grid square]. Only shapes that don't distort. */
const Q_SHAPES: [T, T][] = [
  [{ shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' }, { shape: 'pill', bg: 'sky-300', fg: 'violet-500' }],
  [{ shape: 'arch', bg: 'orange-500', fg: 'sun-300' }, { shape: 'halves', bg: 'green-900', fg: 'green-300' }],
  [{ shape: 'halves', bg: 'sun-300', fg: 'orange-500' }, { shape: 'pill', bg: 'sky-300', fg: 'sky-700' }],
  [{ shape: 'pill', bg: 'green-900', fg: 'green-300' }, { shape: 'asterisk', bg: 'violet-500', fg: 'lilac-500' }],
  [{ shape: 'arch', bg: 'sky-300', fg: 'violet-500' }, { shape: 'asterisk', bg: 'sun-300', fg: 'orange-500' }],
  [{ shape: 'pill', bg: 'orange-500', fg: 'sun-300' }, { shape: 'halves', bg: 'green-900', fg: 'green-300' }],
];

export function Quiz({ app }: { app: AppCtx }) {
  const { lesson, lines, speech: sp, go, openNote, setProgress } = app;
  const quiz = lesson.quiz, N = quiz.length;
  const [q, setQ] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const isRight = (i: number) => picks[i] != null && !!quiz[i].options[picks[i]].correct;
  const score = quiz.filter((_, i) => isRight(i)).length;
  const noteTitle = (id?: string) => lesson.notes.find(n => n.id === id)?.title;

  if (finished) {
    const reset = () => { setQ(0); setSel(null); setPicks({}); setFinished(false); };
    return <>
      <SessionHeader value={N} max={N} step="2/4" onClose={() => go('home')} />
      <div className="scroll" style={{ padding: '12px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <span style={{ font: '900 88px/0.85 var(--font-display)', letterSpacing: '-0.06em', color: 'var(--violet-500)' }}>{score}<span style={{ color: 'var(--ink-500)' }}>/{N}</span></span>
          <span className="hand" style={{ fontSize: 26, color: 'var(--violet-500)', transform: 'rotate(-3deg)', paddingBottom: 6, alignSelf: 'auto' }}>
            {score === N ? 'tout juste!' : score >= N * 0.66 ? 'bien joué!' : 'one more listen?'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-700)' }}>
          {score === N ? 'Every question right.' : 'Tap the bulb next to a missed question to see the rule behind it.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {quiz.map((qq, i) => {
            const ok = isRight(i);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
                <span style={{ font: '900 15px/1 var(--font-display)', color: 'var(--violet-500)' }}>{pad(i + 1)}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: 1.35 }}>{qq.prompt}</span>
                {!ok && qq.note && <IconButton icon="lightbulb" label="Why?" variant="ghost" size="sm" onClick={() => openNote(qq.note)} />}
                <Badge tone={ok ? 'green' : 'orange'}>{ok ? 'Right' : 'Review'}</Badge>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bar" style={{ display: 'flex', gap: 10 }}>
        <Button variant="outline" size="lg" icon="rotate-ccw" onClick={reset}>Retry</Button>
        <div style={{ flex: 1 }}><Button size="lg" block iconRight="arrow-right" onClick={() => go('spoken', 'quiz')}>Continue</Button></div>
      </div>
    </>;
  }

  const Q = quiz[q], pick = picks[q], answered = pick != null;
  const okIdx = Q.options.findIndex(o => o.correct), correct = answered && !!Q.options[pick].correct;
  const [band, fourth] = Q_SHAPES[q % Q_SHAPES.length];
  const listenLine = Q.listen ? lines.find(l => l.id === Q.listen) : undefined;
  const play = () => (listenLine ? sp.sayLine(listenLine.index) : Q.quote && sp.say(Q.quote));
  const next = () => {
    sp.stop();
    if (q < N - 1) { setQ(q + 1); setSel(null); }
    else { setFinished(true); setProgress({ score }); }
  };

  return <>
    <SessionHeader value={q + (answered ? 1 : 0)} max={N} step="2/4" onClose={() => go('home')} />
    <div className="scroll">
      <h2 style={{ margin: 0, padding: '12px 20px 16px', font: '800 20px/1.2 var(--font-display)', letterSpacing: '-0.035em', color: 'var(--ink-900)', textWrap: 'pretty' }}>{Q.prompt}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 84px' }}>
        <div style={{ background: 'var(--violet-500)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', minHeight: 120 }}>
          <Eyebrow color="var(--lilac-500)">Question {q + 1} / {N} · {Q.kind}</Eyebrow>
          {listenLine && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <IconButton icon="volume-2" label="Play the line" variant="secondary" size="lg" onClick={play} />
              {answered
                ? <span style={{ font: '600 15px/1.4 var(--font-body)', color: 'var(--white)' }}>« {stripDash(listenLine.fr)} »</span>
                : <span className="hand" style={{ fontSize: 24, color: 'var(--lilac-500)', transform: 'rotate(-3deg)', alignSelf: 'auto' }}>listen, no peeking!</span>}
            </div>
          )}
          {Q.quote && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <IconButton icon="volume-2" label="Play" variant="secondary" shape="circle" size="sm" onClick={play} />
              <p style={{ margin: 0, font: '800 17px/1.3 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--lilac-500)' }}>{Q.quote}</p>
            </div>
          )}
        </div>
        <FillTile minHeight={84} {...band} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--ink-900)', borderTop: '2px solid var(--ink-900)', borderBottom: '2px solid var(--ink-900)' }}>
        {Q.options.map((o, i) => {
          const state: ChoiceState = !answered ? (sel === i ? 'selected' : 'idle') : o.correct ? 'correct' : i === pick ? 'wrong' : 'disabled';
          return <ChoiceBlock key={`${q}-${i}`} index={i + 1} state={state} onClick={() => setSel(i)}>{o.text}</ChoiceBlock>;
        })}
        {Q.options.length % 2 === 1 && <FillTile minHeight={112} {...fourth} />}
      </div>
      {answered && Q.note && (
        <div style={{ padding: '14px 12px 20px' }}>
          <Button variant="ghost" size="sm" icon="lightbulb" onClick={() => openNote(Q.note)}>Why? {noteTitle(Q.note)}</Button>
        </div>
      )}
    </div>
    {!answered
      ? <div className="bar"><Button size="lg" block disabled={sel == null} onClick={() => { if (sel != null) { sp.stop(); setPicks({ ...picks, [q]: sel }); } }}>Check</Button></div>
      : <FeedbackBanner ok={correct} title={correct ? PRAISE[q % PRAISE.length] : 'Not quite'} answer={correct ? '' : Q.options[okIdx].text}
          note={correct ? Q.options[okIdx].why : Q.options[pick].why} continueLabel={correct ? 'Continue' : 'Got it'} onContinue={next}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)' }} />}
  </>;
}
