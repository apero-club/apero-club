import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Delivery } from '../src/lesson/schema';
import { settingsFor, settingsSignature, suggestDelivery, type DeliveryConfig } from './delivery';
import type { Registry } from './casting';

const config = JSON.parse(readFileSync(join(__dirname, '../audio.config.json'), 'utf8')) as DeliveryConfig;
const reg = JSON.parse(readFileSync(join(__dirname, '../voices/cast.json'), 'utf8')) as Registry;

describe('delivery', () => {
  it('audio.config.json has a preset for every delivery, with sane values', () => {
    for (const d of Delivery.options) {
      const p = config.deliveries?.[d];
      expect(p, `missing preset "${d}"`).toBeDefined();
      for (const k of ['stability', 'style'] as const) if (p![k] !== undefined) { expect(p![k]).toBeGreaterThanOrEqual(0); expect(p![k]).toBeLessThanOrEqual(1); }
      if (p!.speed !== undefined) { expect(p!.speed).toBeGreaterThanOrEqual(0.7); expect(p!.speed).toBeLessThanOrEqual(1.2); }
    }
  });
  it('every character in the registry has a known delivery', () => {
    for (const [id, c] of Object.entries(reg.characters)) if (c.status !== 'future') expect(Delivery.options, id).toContain(c.delivery);
  });
  it('suggests a delivery from the description', () => {
    expect(suggestDelivery('Theatrical and grandiose, a born showman.')).toBe('theatrical');
    expect(suggestDelivery('Dry, deadpan, unhurried.')).toBe('flat');
    expect(suggestDelivery('Bright, brisk, friendly.')).toBe('animated');
    expect(suggestDelivery('Polite, slightly overwhelmed.')).toBe('calm');
    expect(suggestDelivery('Friendly and amused.')).toBe('warm');
    expect(suggestDelivery('A man who sells newspapers.')).toBe('standard');
  });
  it('layers base settings, the character, then the line', () => {
    const c: DeliveryConfig = { voiceSettings: { stability: 0.5, style: 0 }, deliveries: { flat: { stability: 0.8 }, animated: { stability: 0.3, style: 0.4 } } };
    expect(settingsFor(c, { delivery: 'flat', settings: { speed: 0.9 } })).toEqual({ stability: 0.8, style: 0, speed: 0.9 });
    expect(settingsFor(c, { delivery: 'flat', settings: { speed: 0.9 } }, 'animated')).toEqual({ stability: 0.3, style: 0.4 });
    expect(settingsFor(c, undefined)).toEqual({ stability: 0.5, style: 0 });
  });
  it('plain base settings have an empty signature, so older recordings stay valid', () => {
    expect(settingsSignature(config, settingsFor(config, { delivery: 'standard' }))).toBe('');
    expect(settingsSignature(config, settingsFor(config, { delivery: 'theatrical' }))).toMatch(/^[0-9a-f]{8}$/);
  });
});
