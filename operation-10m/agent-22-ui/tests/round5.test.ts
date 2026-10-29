import { describe, expect, it } from 'vitest';
import { runAgent22Round5SelfTests } from '../src/engine/round5-self-tests.js';
import { paceUnlockAnnouncements } from '../src/engine/announcement-pacing-policy.js';
import { assessCognitiveLoad } from '../src/engine/cognitive-load-governor.js';
import { resolveMotionTimingProfile } from '../src/engine/motion-timing-profile.js';
import { resolveUiDensityProfile } from '../src/engine/ui-density-progression.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('round 5 self-tests bundle', () => {
  it('passes embedded round5 suite', () => {
    const r = runAgent22Round5SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('announcement pacing', () => {
  it('respects assertive lead batch', () => {
    const batches = paceUnlockAnnouncements(['critical', 'coach'], {
      reducedMotion: false,
      announceVerbosity: 'assertive',
      allowAssertiveLead: true,
    });
    expect(batches[0]?.politeness).toBe('assertive');
  });
});

describe('motion timing profile', () => {
  it('tags density on data attributes', () => {
    const profile = resolveMotionTimingProfile(
      DEFAULT_ACCESSIBILITY_SNAPSHOT,
      resolveUiDensityProfile({ interfaceLevel: 'guided', preferredTier: 'compact' })
    );
    expect(profile.dataAttributes['data-ui-density']).toBe('compact');
  });
});

describe('cognitive load governor', () => {
  it('light band on day-1 simple', () => {
    const a = assessCognitiveLoad({
      signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    });
    expect(a.band).toBe('light');
  });
});
