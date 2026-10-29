import { describe, expect, it } from 'vitest';
import { runAgent22Round11SelfTests } from '../src/engine/round11-self-tests.js';
import { planNavRailVisibleItems } from '../src/engine/responsive-nav-rail-plan.js';
import { dismissOnboardingStepInPersisted } from '../src/engine/onboarding-persist-bridge.js';
import { createDefaultEvolvingUiPersistedState } from '../src/sim/evolution-hooks.js';

describe('round 11 self-tests bundle', () => {
  it('passes embedded round11 suite', () => {
    const r = runAgent22Round11SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('onboarding persist bridge', () => {
  it('dismisses funnel step', () => {
    const next = dismissOnboardingStepInPersisted(createDefaultEvolvingUiPersistedState(), 'funnel_welcome_map');
    expect(next.onboardingDismissedKeys).toContain('onboarding_map');
  });
});

describe('responsive nav rail plan', () => {
  it('plans overflow on narrow width', () => {
    const plan = planNavRailVisibleItems({
      orderedPanelIds: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      viewportWidthPx: 320,
    });
    expect(plan.visiblePanelIds.length).toBeLessThan(8);
  });
});
