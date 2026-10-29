import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import {
  auditLegacyNavTargets,
  countLegacyNavPatchCoverage,
  legacyNavAuditCoachCopy,
} from './legacy-nav-audit-coach.js';
import {
  planPhaseShellVisibility,
  phaseShellVisibilitySummary,
} from './phase-shell-visibility-plan.js';
import { assessTextScaleReadability } from './text-scale-readability-coach.js';
import { evaluateDayAdvanceCalmRecoveryHint } from './day-advance-calm-recovery-hint.js';

export function runAgent22Round15SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r15_legacy_audit_missing',
    'legacy audit flags missing patch target',
    (() => {
      const entries = auditLegacyNavTargets(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return entries.some(e => e.target === 'unknown_target' && !e.hasPatch);
    })()
  );

  check(
    'r15_legacy_audit_copy',
    'legacy audit copy mentions missing patches',
    Boolean(
      legacyNavAuditCoachCopy(
        auditLegacyNavTargets(
          { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
          DEFAULT_EVOLVING_UI_ACCESS_POLICY
        )
      )?.includes('patches')
    )
  );

  check(
    'r15_legacy_coverage_count',
    'coverage count excludes missing patches',
    (() => {
      const entries = auditLegacyNavTargets(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return countLegacyNavPatchCoverage(entries) >= 5;
    })()
  );

  check(
    'r15_phase_save_load',
    'save_load hides nav rail',
    !planPhaseShellVisibility('save_load').showNavRail
  );

  check(
    'r15_phase_human_turn',
    'human turn shows quick actions',
    planPhaseShellVisibility('human_turn').showQuickActions
  );

  check(
    'r15_phase_summary',
    'phase summary lists visible shells',
    phaseShellVisibilitySummary(planPhaseShellVisibility('human_turn')).includes('nav')
  );

  check(
    'r15_text_scale_compact',
    'large text warns on compact density',
    Boolean(
      assessTextScaleReadability({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, textScaleMultiplier: 1.2 },
        activeDensity: 'compact',
      }).coachCopy?.includes('compact')
    )
  );

  check(
    'r15_text_scale_ok',
    'default scale may omit coach on comfortable',
    assessTextScaleReadability({
      accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
      activeDensity: 'comfortable',
    }).coachCopy == null
  );

  check(
    'r15_calm_hint_busy',
    'calm hint suggests on busy unlock day',
    (() => {
      const hint = evaluateDayAdvanceCalmRecoveryHint({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
        newlyUnlockedPanelCount: 4,
        deferredAnnouncementCount: 3,
      });
      return hint.suggestCalmRecovery || Boolean(hint.coachCopy);
    })()
  );

  check(
    'r15_calm_active',
    'calm hint notes when already active',
    (() => {
      const hint = evaluateDayAdvanceCalmRecoveryHint({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 5 },
        newlyUnlockedPanelCount: 0,
        deferredAnnouncementCount: 0,
      });
      return hint.alreadyActive && Boolean(hint.coachCopy?.includes('Calm recovery'));
    })()
  );

  check(
    'r15_tick_legacy_coverage',
    'day advance reports legacy nav coverage count',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return r.legacyNavPatchCoverageCount >= 5;
    })()
  );

  check(
    'r15_tick_calm_fields',
    'day advance exposes calm recovery hint fields',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return typeof r.calmRecoverySuggested === 'boolean';
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
