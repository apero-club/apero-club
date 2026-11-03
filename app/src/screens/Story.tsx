import { useState } from 'react';
import { Button, IconButton } from '../ds/controls';
import { Critter, FillTile, tok } from '../ds/brand';
import { Icon } from '../ds/Icon';
import { isDialogue } from '../lesson/story';
import type { AppCtx } from './common';
import { Eyebrow, SessionHeader } from './common';

export function Story({ app }: { app: AppCtx }) {
  const { lesson, lines, paragraphs, speech: sp, prefs, setPrefs, go, openNote } = app;
  const [started, setStarted] = useState(false);
  const cast = Object.fromEntries(lesson.cast.map(c => [c.id, c]));
  const last = lines.length - 1;

  const playFrom = (i: number) => { setStarted(true); sp.playFrom(i); };
  const toggleSlow = () => {
    const wasPlaying = sp.playing;
    setPrefs({ slow: !prefs.slow });
    // Restart the current line at the new speed (the hook reads the new rate on the next utterance).
    setTimeout(() => (wasPlaying ? sp.playFrom(sp.cur) : sp.sayLine(sp.cur)), 150);
    setStarted(true);
  };
  const move = (d: number) => {
    const i = Math.max(0, Math.min(last, sp.cur + d));
    setStarted(true);
    if (sp.playing) sp.playFrom(i); else sp.setCur(i);
  };

  return <>
    <SessionHeader value={started ? sp.cur + 1 : 0} max={lines.length} step="1/4" onClose={() => go('home')} />
    <div className="scroll">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 88px' }}>
        <div style={{ background: 'var(--violet-500)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Eyebrow color="var(--lilac-500)">01 · Écouter et lire</Eyebrow>
          <h2 style={{ margin: 0, font: '900 26px/0.95 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)' }}>{lesson.title}</h2>
        </div>
        <FillTile minHeight={88} shape="arch" bg="orange-500" fg="sun-300"><Icon name="headphones" size={24} color="var(--orange-700)" /></FillTile>
      </div>

      <div style={{ padding: '16px 20px 4px', display: 'flex', flexWrap: 'wrap', gap: '10px 16px' }}>
        {lesson.cast.map((c, i) => (
          <span key={c.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Critter kind={c.critter.kind} color={c.critter.color} size={30} blink blinkDelay={i * 0.8} />
            <span style={{ font: '700 13px/1 var(--font-body)', color: tok(c.color) }}>{c.name}</span>
          </span>
        ))}
      </div>
      <div style={{ padding: '6px 20px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="hand" style={{ fontSize: 22, color: 'var(--violet-500)', transform: 'rotate(-2deg)', whiteSpace: 'nowrap' }}>tap any line to hear it</span>
        {(sp.noFrench || !sp.supported) && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {sp.supported ? 'No French voice on this device, so audio uses the default voice.' : 'This browser can’t play audio, but you can still read along.'}
        </span>}
      </div>

      <div style={{ padding: '14px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {paragraphs.map((ix, pi) => {
          const first = lines[ix[0]], who = cast[first.speaker];
          return (
            <div key={pi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {isDialogue(first.fr) && <Eyebrow color={tok(who.label ?? who.color)}>{who.name}</Eyebrow>}
              <p style={{ margin: 0, font: '500 18px/1.6 var(--font-body)', color: 'var(--ink-900)' }}>
                {ix.map((li, k) => {
                  const line = lines[li], isCur = li === sp.cur;
                  const lastWord = line.words.length - 1;
                  const speakerAt = (pos: number) => (line.parts.find(p => pos >= p.start && pos < p.end) ?? line.parts[0]).speaker;
                  return (
                    <span key={li}>
                      <span onClick={() => playFrom(li)} style={{ cursor: 'pointer', borderRadius: 8, WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '2px 1px', background: isCur && started ? 'var(--white)' : 'transparent' }}>
                        {line.words.map((w, j) => {
                          const active = isCur && sp.playing && sp.wordPos >= w.start && (j === lastWord || sp.wordPos < line.words[j + 1].start);
                          return <span key={j}>
                            <span style={{ borderRadius: 6, background: active ? 'var(--violet-500)' : 'transparent', color: active ? 'var(--white)' : tok(cast[speakerAt(w.start)].color) }}>{w.t}</span>
                            {j < lastWord ? ' ' : ''}
                          </span>;
                        })}
                      </span>
                      {line.note && <button className="why-chip" onClick={e => { e.stopPropagation(); sp.stop(); openNote(line.note); }}>why?</button>}
                      {k < ix.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
              {prefs.showEN && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--fg-3)' }}>{ix.map(i => lines[i].en).join(' ')}</p>}
            </div>
          );
        })}
      </div>
    </div>

    <div className="bar" style={{ paddingTop: 12, paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <button className="pill-toggle" aria-pressed={prefs.slow} onClick={toggleSlow}><Icon name="turtle" size={16} />Slow</button>
        <IconButton icon="skip-back" label="Previous line" variant="ghost" onClick={() => move(-1)} />
        <IconButton icon={sp.playing ? 'pause' : 'play'} label={sp.playing ? 'Pause' : 'Play'} variant="primary" size="lg" shape="circle" onClick={() => (sp.playing ? sp.stop() : playFrom(sp.cur))} />
        <IconButton icon="skip-forward" label="Next line" variant="ghost" onClick={() => move(1)} />
        <button className="pill-toggle" aria-pressed={prefs.showEN} onClick={() => setPrefs({ showEN: !prefs.showEN })}>EN</button>
      </div>
      <Button variant="secondary" block iconRight="arrow-right" onClick={() => go('quiz', 'story')}>Continue to quiz</Button>
    </div>
  </>;
}
