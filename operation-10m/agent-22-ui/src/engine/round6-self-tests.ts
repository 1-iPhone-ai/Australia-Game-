import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  isAttentionSurfaceAllowed,
  planAttentionSurfaces,
  resolveAttentionBudgetSlots,
} from './attention-budget-scheduler.js';
import {
  assessCognitiveLoad,
  snoozeCognitiveLoadCoachUntilDay,
} from './cognitive-load-governor.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import {
  buildCalmRecoveryPatch,
  isCalmRecoveryActive,
  mergeCalmRecoveryIntoPersisted,
} from './ui-calm-recovery-policy.js';
import { createDefaultEvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  meetsMinimumTouchTarget,
  resolveTouchTargetProfile,
  touchTargetCssVars,
} from './touch-target-scaling.js';

export function runAgent22Round6SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r6_budget_heavy_tighter',
    'heavy band allows fewer slots than light on same phase',
    resolveAttentionBudgetSlots('heavy', 'human_turn') <
      resolveAttentionBudgetSlots('light', 'human_turn')
  );

  check(
    'r6_budget_main_menu',
    'main menu trims attention slots',
    resolveAttentionBudgetSlots('moderate', 'main_menu') <=
      resolveAttentionBudgetSlots('moderate', 'human_turn')
  );

  check(
    'r6_plan_defers_low_priority',
    'planner defers lowest-priority surfaces when over budget',
    (() => {
      const plan = planAttentionSurfaces({
        band: 'heavy',
        phase: 'human_turn',
        candidates: [
          { id: 'focus_session_banner', priority: 1, requested: true },
          { id: 'cognitive_load_coach', priority: 2, requested: true },
          { id: 'panel_unlock_coach', priority: 3, requested: true },
          { id: 'keyboard_hints_overlay', priority: 5, requested: true },
        ],
      });
      return (
        plan.deferredIds.length >= 1 &&
        isAttentionSurfaceAllowed(plan, 'focus_session_banner') &&
        !isAttentionSurfaceAllowed(plan, 'keyboard_hints_overlay')
      );
    })()
  );

  check(
    'r6_calm_patch_heavy_only',
    'calm recovery patch only on heavy load',
    (() => {
      const heavy = assessCognitiveLoad({
        signals: { gameDay: 12, turnCount: 12, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 5,
      });
      const light = assessCognitiveLoad({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return buildCalmRecoveryPatch(heavy, 5) != null && buildCalmRecoveryPatch(light, 1) == null;
    })()
  );

  check(
    'r6_calm_active_window',
    'calm recovery active until day threshold',
    (() => {
      const persisted = { calmRecoveryUntilDay: 8 };
      return isCalmRecoveryActive(persisted, 6) && !isCalmRecoveryActive(persisted, 8);
    })()
  );

  check(
    'r6_calm_merge_persisted',
    'mergeCalmRecoveryIntoPersisted sets spacious density',
    (() => {
      const patch = buildCalmRecoveryPatch(
        assessCognitiveLoad({
          signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
          policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
          pendingCoachAnnouncements: 4,
        }),
        10
      );
      if (!patch) return false;
      const merged = mergeCalmRecoveryIntoPersisted(createDefaultEvolvingUiPersistedState(), patch);
      return merged.preferredDensity === 'spacious' && (merged.calmRecoveryUntilDay ?? 0) > 10;
    })()
  );

  check(
    'r6_touch_spacious_larger',
    'spacious touch targets exceed compact',
    (() => {
      const compact = resolveTouchTargetProfile(
        'compact',
        DEFAULT_ACCESSIBILITY_SNAPSHOT
      );
      const spacious = resolveTouchTargetProfile(
        'spacious',
        DEFAULT_ACCESSIBILITY_SNAPSHOT
      );
      return spacious.minHeightPx > compact.minHeightPx;
    })()
  );

  check(
    'r6_touch_text_scale',
    'large text scale bumps touch minimum',
    (() => {
      const base = resolveTouchTargetProfile('comfortable', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const scaled = resolveTouchTargetProfile('comfortable', {
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        textScaleMultiplier: 1.4,
      });
      return scaled.minHeightPx > base.minHeightPx;
    })()
  );

  check(
    'r6_touch_css_vars',
    'touchTargetCssVars exposes min and slop',
    (() => {
      const vars = touchTargetCssVars(
        resolveTouchTargetProfile(
          resolveUiDensityProfile({ interfaceLevel: 'guided' }).tier,
          DEFAULT_ACCESSIBILITY_SNAPSHOT
        )
      );
      return Number(vars['--evolving-ui-touch-min-px']) >= 40 && Number(vars['--evolving-ui-touch-hit-slop-px']) >= 0;
    })()
  );

  check(
    'r6_touch_hit_slop',
    'meetsMinimumTouchTarget honors hit slop',
    (() => {
      const profile = resolveTouchTargetProfile('compact', DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const almost = profile.minHeightPx - profile.hitSlopPx;
      return meetsMinimumTouchTarget(profile, almost) && !meetsMinimumTouchTarget(profile, almost - 1);
    })()
  );

  check(
    'r6_snooze_coherence',
    'calm patch aligns cognitive snooze with coach helper',
    (() => {
      const assessment = assessCognitiveLoad({
        signals: { gameDay: 8, turnCount: 8, interfaceLevel: 'advanced' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        pendingCoachAnnouncements: 3,
      });
      const patch = buildCalmRecoveryPatch(assessment, 8, 2);
      return patch?.cognitiveLoadCoachSnoozedUntilDay === snoozeCognitiveLoadCoachUntilDay(8, 2);
    })()
  );

  check(
    'r6_plan_empty',
    'no requested candidates yields empty allow list',
    (() => {
      const plan = planAttentionSurfaces({
        band: 'light',
        phase: 'human_turn',
        candidates: [{ id: 'keyboard_hints_overlay', priority: 1, requested: false }],
      });
      return plan.allowedIds.length === 0 && plan.deferredIds.length === 0;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
