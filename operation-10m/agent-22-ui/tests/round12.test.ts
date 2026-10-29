import { describe, expect, it } from 'vitest';
import { runAgent22Round12SelfTests } from '../src/engine/round12-self-tests.js';
import { planPhaseCoachSurfaces } from '../src/engine/phase-coach-gate.js';
import { buildProgressionCoverageSnapshot } from '../src/engine/progression-coverage-snapshot.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('round 12 self-tests bundle', () => {
  it('passes embedded round12 suite', () => {
    const r = runAgent22Round12SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('phase coach gate', () => {
  it('blocks coaches during replay', () => {
    const plan = planPhaseCoachSurfaces('replay');
    expect(plan.allowedSurfaces.length).toBe(0);
  });
});

describe('progression coverage snapshot', () => {
  it('builds late tier on day 15', () => {
    const snap = buildProgressionCoverageSnapshot(
      { gameDay: 15, turnCount: 15, interfaceLevel: 'advanced' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(snap.tierLabel).toBe('late');
  });
});
