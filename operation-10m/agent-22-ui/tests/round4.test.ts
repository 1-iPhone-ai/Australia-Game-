import { describe, expect, it } from 'vitest';
import { runAgent22Round4SelfTests } from '../src/engine/round4-self-tests.js';
import { resolveUiDensityProfile } from '../src/engine/ui-density-progression.js';
import { deriveResponsiveLayoutHints } from '../src/engine/responsive-layout-hints.js';
import { recordNavSelection, suggestResumeNavTarget, createDefaultSessionUiMemory } from '../src/sim/session-ui-memory.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';
import { shouldActivateFocusSession } from '../src/engine/focus-session-policy.js';

describe('round 4 self-tests bundle', () => {
  it('passes embedded round4 suite', () => {
    const r = runAgent22Round4SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('ui density progression', () => {
  it('respects preferred tier when eligible', () => {
    const p = resolveUiDensityProfile({ interfaceLevel: 'guided', preferredTier: 'compact' });
    expect(p.tier).toBe('compact');
  });
});

describe('responsive layout hints', () => {
  it('stacks quick actions on medium band', () => {
    expect(deriveResponsiveLayoutHints({ viewportWidthPx: 800 }).stackQuickActions).toBe(true);
  });
});

describe('session ui memory', () => {
  it('tracks nav selections', () => {
    const mem = recordNavSelection(createDefaultSessionUiMemory(), 'travel');
    expect(mem.lastNavTarget).toBe('travel');
  });
});

describe('focus session policy', () => {
  it('inactive on ai turn', () => {
    expect(
      shouldActivateFocusSession({
        phase: 'ai_turn',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      })
    ).toBe(false);
  });
});

describe('resume nav suggestion', () => {
  it('returns null when nothing visible', () => {
    const mem = recordNavSelection(createDefaultSessionUiMemory(), 'automation');
    expect(
      suggestResumeNavTarget(mem, { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY)
    ).toBeNull();
  });
});
