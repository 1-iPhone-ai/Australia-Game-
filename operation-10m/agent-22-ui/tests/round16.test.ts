import { describe, expect, it } from 'vitest';
import { runAgent22Round16SelfTests } from '../src/engine/round16-self-tests.js';
import { planPhaseShellAttentionGate } from '../src/engine/phase-shell-attention-gate.js';
import { createDefaultEvolvingUiPersistedState } from '../src/sim/evolution-hooks.js';

describe('round 16 self-tests bundle', () => {
  it('passes embedded round16 suite', () => {
    const r = runAgent22Round16SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(10);
  });
});

describe('phase shell attention gate', () => {
  it('blocks coaches during calm recovery', () => {
    const plan = planPhaseShellAttentionGate({
      phase: 'human_turn',
      band: 'light',
      persisted: { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 9 },
      gameDay: 4,
    });
    expect(plan.calmRecoveryActive).toBe(true);
  });
});
