import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import {
  isPhaseCoachSurfaceAllowed,
  planPhaseCoachSurfaces,
  phaseCoachGateCopy,
} from './phase-coach-gate.js';
import { evaluateShowAllOverrideSafety } from './show-all-progressive-safety.js';
import {
  buildProgressionCoverageSnapshot,
  coverageDeltaCopy,
  mergeCoverageRatioIntoPersisted,
} from './progression-coverage-snapshot.js';
import { planKeyboardHintsDisplay } from './keyboard-hints-priority-plan.js';
import { auditWidgetContextualVisibility, widgetContextualCoachCopy } from './contextual-widget-coach.js';

export function runAgent22Round12SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r12_phase_gate_save_load',
    'save_load suppresses coach surfaces',
    (() => {
      const plan = planPhaseCoachSurfaces('save_load');
      return plan.allowedSurfaces.length === 0;
    })()
  );

  check(
    'r12_phase_gate_human_turn',
    'human turn allows panel unlock coach',
    isPhaseCoachSurfaceAllowed(planPhaseCoachSurfaces('human_turn'), 'panel_unlock_coach')
  );

  check(
    'r12_phase_gate_heavy',
    'heavy band trims onboarding coach',
    (() => {
      const plan = planPhaseCoachSurfaces('human_turn', 'heavy');
      return !isPhaseCoachSurfaceAllowed(plan, 'onboarding_funnel');
    })()
  );

  check(
    'r12_phase_gate_copy',
    'phase gate copy mentions deferred surfaces',
    Boolean(phaseCoachGateCopy(planPhaseCoachSurfaces('main_menu'))?.includes('deferred'))
  );

  check(
    'r12_show_all_safety',
    'show-all safety warns on menu phase',
    (() => {
      const assessment = evaluateShowAllOverrideSafety({
        persisted: { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        phase: 'main_menu',
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
      });
      return Boolean(assessment.coachCopy);
    })()
  );

  check(
    'r12_coverage_snapshot',
    'coverage snapshot includes tier label',
    (() => {
      const snap = buildProgressionCoverageSnapshot(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      return snap.tierLabel === 'early' && snap.total > 0;
    })()
  );

  check(
    'r12_coverage_delta',
    'coverage delta copy reports increase',
    Boolean(coverageDeltaCopy(0.2, 0.35)?.includes('increased'))
  );

  check(
    'r12_tick_persists_coverage',
    'day advance persists coverage ratio',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return typeof r.progressionCoverageRatio === 'number' && r.updatedPersisted.lastProgressionCoverageRatio != null;
    })()
  );

  check(
    'r12_merge_coverage_persisted',
    'merge coverage clamps ratio',
    mergeCoverageRatioIntoPersisted(createDefaultEvolvingUiPersistedState(), 1.5).lastProgressionCoverageRatio === 1
  );

  check(
    'r12_keyboard_hints_plan',
    'keyboard hints plan prioritizes map on human turn',
    (() => {
      const plan = planKeyboardHintsDisplay('simple', 'human_turn');
      return plan.shortcuts[0]?.id === 'kb_open_map';
    })()
  );

  check(
    'r12_widget_contextual_audit',
    'widget audit hides when contextual false',
    (() => {
      const entries = auditWidgetContextualVisibility({
        widgetIds: ['quick_actions'],
        contextualShouldShowByWidget: { quick_actions: false },
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return entries[0]?.show === false && entries[0]?.reason === 'contextual_hiding';
    })()
  );

  check(
    'r12_widget_contextual_copy',
    'widget contextual copy mentions hidden count',
    (() => {
      const entries = auditWidgetContextualVisibility({
        widgetIds: ['quick_actions', 'objectives'],
        contextualShouldShowByWidget: { quick_actions: false, objectives: false },
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return Boolean(widgetContextualCoachCopy(entries)?.includes('2'));
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
