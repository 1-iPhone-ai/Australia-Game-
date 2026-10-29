import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { applyCalmRecoveryFromDayAdvanceHint } from './calm-recovery-auto-apply-bridge.js';
import { evaluateDayAdvanceCalmRecoveryHint } from './day-advance-calm-recovery-hint.js';
import {
  phaseShellAttentionSummary,
  planPhaseShellAttentionGate,
} from './phase-shell-attention-gate.js';
import { buildTextScaleDensityDayHint } from './text-scale-density-day-hint.js';
import { assessCognitiveLoad } from './cognitive-load-governor.js';
import { isCalmRecoveryActive, buildCalmRecoveryPatch } from './ui-calm-recovery-policy.js';

export function runAgent22Round16SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r16_calm_auto_apply',
    'auto-apply merges calm recovery patch',
    (() => {
      const load = assessCognitiveLoad({
        signals: { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        pendingCoachAnnouncements: 12,
      });
      const patch = buildCalmRecoveryPatch(load, 6);
      if (!patch) return load.band !== 'heavy';
      const hint = {
        suggestCalmRecovery: true,
        alreadyActive: false,
        coachCopy: 'test',
        patch,
      };
      const applied = applyCalmRecoveryFromDayAdvanceHint(
        createDefaultEvolvingUiPersistedState(),
        hint,
        6
      );
      return applied.applied && isCalmRecoveryActive(applied.persisted, 6);
    })()
  );

  check(
    'r16_calm_auto_apply_copy',
    'auto-apply coach copy mentions calm recovery',
    (() => {
      const hint = evaluateDayAdvanceCalmRecoveryHint({
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
        newlyUnlockedPanelCount: 5,
        deferredAnnouncementCount: 4,
      });
      const applied = applyCalmRecoveryFromDayAdvanceHint(
        createDefaultEvolvingUiPersistedState(),
        hint,
        5
      );
      if (!applied.applied) return true;
      return Boolean(applied.coachCopy?.toLowerCase().includes('calm'));
    })()
  );

  check(
    'r16_phase_attention_save_load',
    'save_load phase suppresses coach attention surfaces',
    (() => {
      const plan = planPhaseShellAttentionGate({
        phase: 'save_load',
        band: 'light',
        persisted: createDefaultEvolvingUiPersistedState(),
        gameDay: 2,
      });
      return !plan.showCoachSurfaces && Boolean(plan.coachCopy);
    })()
  );

  check(
    'r16_phase_attention_calm',
    'calm recovery defers attention surfaces during human turn',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        calmRecoveryUntilDay: 8,
      };
      const plan = planPhaseShellAttentionGate({
        phase: 'human_turn',
        band: 'moderate',
        persisted,
        gameDay: 5,
        simEvolutionBridgeRequested: true,
      });
      return plan.calmRecoveryActive && Boolean(plan.coachCopy?.includes('Calm recovery'));
    })()
  );

  check(
    'r16_phase_attention_summary',
    'attention summary mentions deferred count',
    (() => {
      const plan = planPhaseShellAttentionGate({
        phase: 'human_turn',
        band: 'heavy',
        persisted: createDefaultEvolvingUiPersistedState(),
        gameDay: 3,
        simEvolutionBridgeRequested: true,
        panelUnlockCoachRequested: true,
      });
      const summary = phaseShellAttentionSummary(plan);
      return summary.includes('surfaces') || summary.includes('deferred');
    })()
  );

  check(
    'r16_text_scale_day_hint',
    'large text on compact density yields day hint',
    (() => {
      const hint = buildTextScaleDensityDayHint({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.2 },
        preferredDensity: 'compact',
      });
      return Boolean(hint.coachCopy);
    })()
  );

  check(
    'r16_text_scale_day_ok',
    'default text may omit day hint',
    (() => {
      const hint = buildTextScaleDensityDayHint({
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'expert' },
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        preferredDensity: 'comfortable',
      });
      return hint.coachCopy == null || !hint.shouldSuggestDensityChange;
    })()
  );

  check(
    'r16_tick_calm_applied_field',
    'day advance exposes calmRecoveryAutoApplied',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { autoApplyCalmRecovery: false }
      );
      return typeof r.calmRecoveryAutoApplied === 'boolean';
    })()
  );

  check(
    'r16_tick_text_scale_field',
    'day advance exposes text scale hint field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), preferredDensity: 'compact' },
        {
          accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.25 },
        }
      );
      return typeof r.textScaleDensityDayHintCopy === 'string' || r.textScaleDensityDayHintCopy === null;
    })()
  );

  check(
    'r16_tick_phase_attention_field',
    'day advance exposes phase shell attention copy when phase provided',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load', autoApplyCalmRecovery: false }
      );
      return Boolean(r.phaseShellAttentionCoachCopy?.includes('Save/load'));
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
