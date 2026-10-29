import { describe, expect, it } from 'vitest';
import { runAgent22Round6SelfTests } from '../src/engine/round6-self-tests.js';
import {
  planAttentionSurfaces,
  resolveAttentionBudgetSlots,
} from '../src/engine/attention-budget-scheduler.js';
import {
  buildCalmRecoveryPatch,
  isCalmRecoveryActive,
} from '../src/engine/ui-calm-recovery-policy.js';
import { assessCognitiveLoad } from '../src/engine/cognitive-load-governor.js';
import { resolveTouchTargetProfile, touchTargetCssVars } from '../src/engine/touch-target-scaling.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';
import { resolveUiDensityProfile } from '../src/engine/ui-density-progression.js';

describe('round 6 self-tests bundle', () => {
  it('passes embedded round6 suite', () => {
    const r = runAgent22Round6SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('attention budget scheduler', () => {
  it('defers keyboard hints under pressure', () => {
    const plan = planAttentionSurfaces({
      band: 'heavy',
      phase: 'main_menu',
      candidates: [
        { id: 'focus_session_banner', priority: 1, requested: true },
        { id: 'cognitive_load_coach', priority: 2, requested: true },
        { id: 'keyboard_hints_overlay', priority: 5, requested: true },
      ],
    });
    expect(plan.deferredIds).toContain('keyboard_hints_overlay');
    expect(resolveAttentionBudgetSlots('heavy', 'main_menu')).toBeGreaterThanOrEqual(1);
  });
});

describe('calm recovery policy', () => {
  it('activates within day window', () => {
    expect(isCalmRecoveryActive({ calmRecoveryUntilDay: 5 }, 4)).toBe(true);
  });

  it('builds patch when load is heavy', () => {
    const assessment = assessCognitiveLoad({
      signals: { gameDay: 15, turnCount: 15, interfaceLevel: 'expert' },
      policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
      pendingCoachAnnouncements: 6,
    });
    expect(assessment.band).toBe('heavy');
    expect(buildCalmRecoveryPatch(assessment, 15)).not.toBeNull();
  });
});

describe('touch target scaling', () => {
  it('exports css vars from density profile', () => {
    const tier = resolveUiDensityProfile({ interfaceLevel: 'simple' }).tier;
    const vars = touchTargetCssVars(resolveTouchTargetProfile(tier, DEFAULT_ACCESSIBILITY_SNAPSHOT));
    expect(vars['--evolving-ui-touch-min-px']).toBeDefined();
  });
});
