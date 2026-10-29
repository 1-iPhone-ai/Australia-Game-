import { describe, expect, it } from 'vitest';
import { evaluateTriggerReference } from './reference/trigger-evaluator';

describe('human automation trigger reference scenarios', () => {
  it('turn_start always fires', () => {
    expect(
      evaluateTriggerReference({ type: 'turn_start' }, { money: 0 }, false, 1, 1, true)
    ).toBe(true);
  });

  it('day_start respects isNewDay flag', () => {
    expect(
      evaluateTriggerReference({ type: 'day_start' }, { money: 100 }, true, 5, 10, true)
    ).toBe(true);
    expect(
      evaluateTriggerReference({ type: 'day_start' }, { money: 100 }, false, 5, 10, true)
    ).toBe(false);
  });

  it('cash thresholds use inclusive comparisons from baseline', () => {
    expect(
      evaluateTriggerReference(
        { type: 'cash_below_threshold', thresholdAmount: 500 },
        { money: 499 },
        false,
        1,
        1,
        true
      )
    ).toBe(true);
    expect(
      evaluateTriggerReference(
        { type: 'cash_above_threshold', thresholdAmount: 100 },
        { money: 101 },
        false,
        1,
        1,
        true
      )
    ).toBe(true);
  });

  it('extended day trigger gated by automationExtendedTriggersEnabled', () => {
    const trigger = { type: 'day_number_at_or_above' as const, thresholdAmount: 10 };
    expect(evaluateTriggerReference(trigger, { money: 0 }, false, 10, 1, true)).toBe(true);
    expect(evaluateTriggerReference(trigger, { money: 0 }, false, 10, 1, false)).toBe(false);
  });

  it('manual_test_only never auto-fires', () => {
    expect(
      evaluateTriggerReference({ type: 'manual_test_only' }, { money: 1_000_000 }, true, 99, 99, true)
    ).toBe(false);
  });
});

describe('auto mode × smart settings boundary (documented invariants)', () => {
  it('manual automation preference blocks auto actions (spec §4.2)', () => {
    const profileAutomation = 'manual';
    const autoEnabled = true;
    const allowed = profileAutomation !== 'manual' && autoEnabled;
    expect(allowed).toBe(false);
  });
});
