import { describe, expect, it } from 'vitest';
import { runAgent22Round7SelfTests } from '../src/engine/round7-self-tests.js';
import {
  isCoachDismissalQuiet,
  recordCoachDismissal,
  resolveCoachDismissalSnoozeDays,
} from '../src/engine/coach-dismissal-backoff.js';
import { planLandmarkReadingOrder, landmarkTargetForSurface } from '../src/engine/landmark-reading-order.js';
import {
  highContrastChromeCssVars,
  resolveHighContrastChromeProfile,
} from '../src/engine/high-contrast-chrome-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';

describe('round 7 self-tests bundle', () => {
  it('passes embedded round7 suite', () => {
    const r = runAgent22Round7SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('coach dismissal backoff', () => {
  it('extends quiet window on repeated dismissals', () => {
    expect(resolveCoachDismissalSnoozeDays(3)).toBeGreaterThan(resolveCoachDismissalSnoozeDays(1));
    const first = recordCoachDismissal({}, 4);
    const second = recordCoachDismissal({ coachDismissalStreak: first.streak }, 4);
    expect(second.quietUntilDay).toBeGreaterThanOrEqual(first.quietUntilDay);
  });

  it('detects active quiet period', () => {
    expect(isCoachDismissalQuiet({ coachDismissalQuietUntilDay: 6 }, 5)).toBe(true);
  });
});

describe('landmark reading order', () => {
  it('builds skip links for human turn', () => {
    const plan = planLandmarkReadingOrder({
      phase: 'human_turn',
      landmarks: [landmarkTargetForSurface('nav_core', 'Core navigation', true, 1)],
    });
    expect(plan.skipLinkLabels.some(l => l.includes('Core navigation'))).toBe(true);
  });
});

describe('high contrast chrome', () => {
  it('exports border css var', () => {
    const vars = highContrastChromeCssVars(
      resolveHighContrastChromeProfile({ ...DEFAULT_ACCESSIBILITY_SNAPSHOT, highContrastFocusRings: true })
    );
    expect(vars['--evolving-ui-chrome-border-px']).toBeDefined();
  });
});
