import { describe, expect, it } from 'vitest';
import { runAgent22Round17SelfTests } from '../src/engine/round17-self-tests.js';
import { buildCalmRecoveryExpiryDayHint } from '../src/engine/calm-recovery-expiry-day-hint.js';
import { createDefaultEvolvingUiPersistedState } from '../src/sim/evolution-hooks.js';

describe('round 17 self-tests bundle', () => {
  it('passes embedded round17 suite', () => {
    const r = runAgent22Round17SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(10);
  });
});

describe('calm recovery expiry day hint', () => {
  it('flags active calm recovery nearing expiry', () => {
    const hint = buildCalmRecoveryExpiryDayHint(
      { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 8 },
      6
    );
    expect(hint.active).toBe(true);
  });
});
