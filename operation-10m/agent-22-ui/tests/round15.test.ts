import { describe, expect, it } from 'vitest';
import { runAgent22Round15SelfTests } from '../src/engine/round15-self-tests.js';
import { planPhaseShellVisibility } from '../src/engine/phase-shell-visibility-plan.js';

describe('round 15 self-tests bundle', () => {
  it('passes embedded round15 suite', () => {
    const r = runAgent22Round15SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('phase shell visibility plan', () => {
  it('hides coaches on replay', () => {
    const plan = planPhaseShellVisibility('replay');
    expect(plan.showCoachSurfaces).toBe(false);
  });
});
