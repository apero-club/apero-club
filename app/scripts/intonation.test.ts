import { describe, expect, it } from 'vitest';
import { isIntonationQuestion } from './intonation';

describe('isIntonationQuestion', () => {
  it('checks yes/no questions in statement word order', () => {
    expect(isIntonationQuestion('« Ils sont comme ça avec tout le monde ? »')).toBe(true);
    expect(isIntonationQuestion('— Madame souhaiterait-elle autre chose ? Un coussin ? Un deuxième violoniste ?')).toBe(true);
    expect(isIntonationQuestion('Ce serait possible d’avoir un peu d’eau ?')).toBe(true);
  });
  it('skips question words, inversion, est-ce que and statements', () => {
    expect(isIntonationQuestion('« Madame Dupont ?! Alors… eux, c’est qui ? »')).toBe(false);
    expect(isIntonationQuestion('Tu te souviens de la fois où l’ascenseur a marché ?')).toBe(false);
    expect(isIntonationQuestion('Pourriez-vous nous conseiller un vin ?')).toBe(false);
    expect(isIntonationQuestion('Est-ce que tu viens ?')).toBe(false);
    expect(isIntonationQuestion('Je viens jusqu’à la gare.')).toBe(false);
    expect(isIntonationQuestion('On va jusqu’à la gare ?')).toBe(true);
  });
});
