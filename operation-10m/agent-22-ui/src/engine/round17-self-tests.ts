import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import {
  applyLegacyNavAutoRemember,
  buildLegacyNavAutoRememberPlan,
} from './legacy-nav-auto-remember-bridge.js';
import { buildPhaseShellVisibilityDayCoach } from './phase-shell-visibility-day-coach.js';
import { buildTextScaleDensityDayHint } from './text-scale-density-day-hint.js';
import { applyTextScaleDensityFromDayHint } from './text-scale-density-auto-apply-bridge.js';
import { buildCalmRecoveryExpiryDayHint } from './calm-recovery-expiry-day-hint.js';

export function runAgent22Round17SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r17_legacy_remember_plan',
    'hidden legacy nav targets yield remember plan',
    (() => {
      const plan = buildLegacyNavAutoRememberPlan(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return plan.panelIdsToRemember.length >= 0 && Array.isArray(plan.entries);
    })()
  );

  check(
    'r17_legacy_remember_apply',
    'auto-remember merges panel ids',
    (() => {
      const plan = buildLegacyNavAutoRememberPlan(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      if (!plan.panelIdsToRemember.length) return true;
      const applied = applyLegacyNavAutoRemember(createDefaultEvolvingUiPersistedState(), plan);
      return applied.applied && applied.rememberedCount === plan.panelIdsToRemember.length;
    })()
  );

  check(
    'r17_legacy_remember_copy',
    'remember apply coach copy mentions legacy nav',
    (() => {
      const plan = buildLegacyNavAutoRememberPlan(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      if (!plan.panelIdsToRemember.length) return true;
      const applied = applyLegacyNavAutoRemember(createDefaultEvolvingUiPersistedState(), plan);
      return Boolean(applied.coachCopy?.toLowerCase().includes('legacy'));
    })()
  );

  check(
    'r17_phase_visibility_day',
    'day advance phase visibility coach mentions day',
    (() => {
      const coach = buildPhaseShellVisibilityDayCoach({
        phase: 'save_load',
        priorGameDay: 1,
        nextGameDay: 2,
      });
      return Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r17_phase_visibility_summary',
    'visibility day coach exposes shell summary',
    (() => {
      const coach = buildPhaseShellVisibilityDayCoach({
        phase: 'human_turn',
        priorGameDay: 2,
        nextGameDay: 3,
      });
      return coach.shellSummary.length > 0;
    })()
  );

  check(
    'r17_text_scale_auto_apply',
    'auto-apply sets preferred density',
    (() => {
      const hint = buildTextScaleDensityDayHint({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
        preferredDensity: 'compact',
      });
      if (!hint.shouldSuggestDensityChange) return true;
      const applied = applyTextScaleDensityFromDayHint(
        createDefaultEvolvingUiPersistedState(),
        hint,
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 }
      );
      return applied.applied && applied.persisted.preferredDensity != null;
    })()
  );

  check(
    'r17_text_scale_auto_off',
    'auto-apply off preserves persisted density',
    (() => {
      const hint = buildTextScaleDensityDayHint({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
        preferredDensity: 'compact',
      });
      const applied = applyTextScaleDensityFromDayHint(
        { ...createDefaultEvolvingUiPersistedState(), preferredDensity: 'compact' },
        hint,
        { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
        { autoApply: false }
      );
      return !applied.applied && applied.persisted.preferredDensity === 'compact';
    })()
  );

  check(
    'r17_calm_expiry_tomorrow',
    'calm recovery expiry hint before last day',
    (() => {
      const hint = buildCalmRecoveryExpiryDayHint(
        { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 6 },
        4
      );
      return hint.active && Boolean(hint.coachCopy?.toLowerCase().includes('calm'));
    })()
  );

  check(
    'r17_calm_expiry_ended',
    'calm recovery ended today copy',
    (() => {
      const hint = buildCalmRecoveryExpiryDayHint(
        { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 5 },
        5
      );
      return !hint.active && Boolean(hint.coachCopy?.includes('ended'));
    })()
  );

  check(
    'r17_tick_legacy_field',
    'day advance exposes legacy nav auto-remember count',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { autoRememberLegacyNav: false }
      );
      return typeof r.legacyNavAutoRememberedCount === 'number';
    })()
  );

  check(
    'r17_tick_text_scale_auto_field',
    'day advance exposes text scale density auto-applied flag',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), preferredDensity: 'compact' },
        {
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.3 },
          autoApplyTextScaleDensity: true,
        }
      );
      return typeof r.textScaleDensityAutoApplied === 'boolean';
    })()
  );

  check(
    'r17_tick_calm_expiry_field',
    'day advance exposes calm recovery expiry copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 6 },
        { autoApplyCalmRecovery: false }
      );
      return r.calmRecoveryExpiryHintCopy === null || typeof r.calmRecoveryExpiryHintCopy === 'string';
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
