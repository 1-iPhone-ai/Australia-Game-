import { describe, expect, it } from 'vitest';
import { runAgent22Round14SelfTests } from '../src/engine/round14-self-tests.js';
import { summarizeFocusSessionSuppression } from '../src/engine/focus-session-suppression-summary.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('round 14 self-tests bundle', () => {
  it('passes embedded round14 suite', () => {
    const r = runAgent22Round14SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('focus session suppression summary', () => {
  it('deactivates on ai_turn phase', () => {
    const summary = summarizeFocusSessionSuppression({
      phase: 'ai_turn',
      signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    });
    expect(summary.active).toBe(false);
  });
});
