import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import {
  buildNotificationLaneCoachPlan,
  countActiveNotificationLanes,
  notificationLaneStatusLine,
} from './notification-lane-coach-plan.js';
import {
  buildLayoutPresetDensityRecommendation,
  layoutDensityMismatchCopy,
  recommendDensityForLayoutPreset,
} from './layout-preset-density-bridge.js';
import {
  computeProgressionSignalDelta,
  mergeLastInterfaceLevelIntoPersisted,
} from './progression-signal-delta.js';
import {
  listRegisteredModalFocusTraps,
  modalFocusTrapCoachCopy,
  planModalFocusTrapStatus,
} from './modal-focus-trap-registry.js';

export function runAgent22Round13SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r13_lane_plan_early_day',
    'early day suppresses automation lane',
    (() => {
      const plan = buildNotificationLaneCoachPlan({ gameDay: 1, turnCount: 1, interfaceLevel: 'simple' });
      return plan.suppressedCategories.includes('automation');
    })()
  );

  check(
    'r13_lane_count',
    'lane count matches active categories',
    (() => {
      const signals = { gameDay: 10, turnCount: 10, interfaceLevel: 'advanced' as const };
      return countActiveNotificationLanes(signals) >= 4;
    })()
  );

  check(
    'r13_lane_status_line',
    'lane status line mentions gated',
    notificationLaneStatusLine('automation', false).includes('gated')
  );

  check(
    'r13_layout_density_recommend',
    'Clean preset recommends spacious density',
    recommendDensityForLayoutPreset('Clean') === 'spacious'
  );

  check(
    'r13_layout_density_mismatch',
    'mismatch copy references density',
    Boolean(layoutDensityMismatchCopy('Advanced', 'spacious')?.includes('compact'))
  );

  check(
    'r13_layout_density_coach',
    'recommendation includes coach copy',
    buildLayoutPresetDensityRecommendation({ interfaceLevel: 'guided' }).coachCopy.includes('density')
  );

  check(
    'r13_signal_delta_level',
    'signal delta detects interface level change',
    (() => {
      const delta = computeProgressionSignalDelta(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' }
      );
      return delta.interfaceLevelChanged && Boolean(delta.coachCopy?.includes('guided'));
    })()
  );

  check(
    'r13_signal_delta_day_jump',
    'signal delta flags large day jump',
    Boolean(
      computeProgressionSignalDelta(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' }
      ).coachCopy?.includes('Large time jump')
    )
  );

  check(
    'r13_tick_signal_delta',
    'day advance exposes signal delta copy field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return r.progressionSignalDeltaCopy != null && r.updatedPersisted.lastInterfaceLevel === 'guided';
    })()
  );

  check(
    'r13_merge_last_level',
    'merge last interface level into persisted',
    mergeLastInterfaceLevelIntoPersisted(createDefaultEvolvingUiPersistedState(), 'advanced').lastInterfaceLevel ===
      'advanced'
  );

  check(
    'r13_modal_trap_registry',
    'modal trap registry lists modals',
    listRegisteredModalFocusTraps().length >= 5
  );

  check(
    'r13_modal_trap_coach',
    'modal trap coach mentions trap',
    Boolean(
      modalFocusTrapCoachCopy('settings_modal')?.includes('trapped') &&
        planModalFocusTrapStatus({
          openModalId: 'settings_modal',
          lastNavTarget: 'map',
          accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        }).plan?.trapEnabled
    )
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
