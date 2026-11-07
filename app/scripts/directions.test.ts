import { describe, expect, it } from 'vitest';
import { directedText, untag } from './directions';

describe('acting directions', () => {
  const text = "Madame Dupont ?! Alors… eux, c'est qui ?";
  it('puts start tags first and mid-line tags before their words', () => {
    const r = directedText(text, ['gasps', { at: 'Alors', tags: ['slowly', 'scared'] }]);
    expect(r.sent).toBe("[gasps] Madame Dupont ?! [slowly] [scared] Alors… eux, c'est qui ?");
    expect(r.missing).toEqual([]);
  });
  it('reports a direction whose words aren’t in the line', () => {
    expect(directedText(text, [{ at: 'Bonjour', tags: ['calm'] }]).missing).toEqual(['Bonjour']);
  });
  it('takes the tags back out of the timing', () => {
    const { sent, tags } = directedText(text, ['gasps', { at: 'Alors', tags: ['slowly'] }]);
    const chars = [...sent];
    const a = untag({ characters: chars, character_start_times_seconds: chars.map((_, i) => i) }, tags);
    expect(a.characters.join('')).toBe(text);
    expect(a.character_start_times_seconds[0]).toBe('[gasps] '.length);
  });
});
