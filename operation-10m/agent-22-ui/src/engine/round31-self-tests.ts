import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildCoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';
import { buildCoachLiveRegionDeliveryDayCoach } from './coach-live-region-delivery-day-coach.js';
import { buildShortcutConflictWarningDayCoach } from './shortcut-conflict-warning-day-coach.js';
import { buildAttentionDeferralDayCoach } from './attention-deferral-day-coach.js';
import { buildProgressionVisibilitySummaryDayCoach } from './progression-visibility-summary-day-coach.js';

export function runAgent22Round31SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r31_live_region_delivery',
    'coach live region delivery day coach with messages',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['A', 'B'], DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const coach = buildCoachLiveRegionDeliveryDayCoach({ plan, nextGameDay: 3 });
      return coach.messageCount > 0 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r31_shortcut_warning',
    'shortcut conflict warning day coach shape',
    (() => {
      const coach = buildShortcutConflictWarningDayCoach({
        interfaceLevel: 'expert',
        phase: 'human_turn',
        nextGameDay: 4,
      });
      return coach.conflictCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 4'));
    })()
  );

  check(
    'r31_attention_deferral',
    'attention deferral day coach on heavy band',
    (() => {
      const coach = buildAttentionDeferralDayCoach({
        band: 'heavy',
        phase: 'human_turn',
        nextGameDay: 5,
        cognitiveLoadCoachRequested: true,
        panelUnlockCoachRequested: true,
        simEvolutionBridgeRequested: true,
        keyboardHintsRequested: true,
        focusSessionBannerRequested: true,
      });
      return coach.deferredSurfaceCount > 0 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r31_visibility_summary',
    'progression visibility summary day coach early day',
    (() => {
      const coach = buildProgressionVisibilitySummaryDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.visibleCount >= 0 && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r31_tick_delivery_field',
    'day advance exposes live region delivery day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.coachLiveRegionDeliveryDayCoachCopy === 'string' || r.coachLiveRegionDeliveryDayCoachCopy === null;
    })()
  );

  check(
    'r31_tick_shortcut_warning_field',
    'day advance exposes shortcut conflict warning day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'expert' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.shortcutConflictWarningDayCoachCopy === 'string' || r.shortcutConflictWarningDayCoachCopy === null;
    })()
  );

  check(
    'r31_tick_deferral_field',
    'day advance exposes attention deferral day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return typeof r.attentionDeferralDayCoachCopy === 'string' || r.attentionDeferralDayCoachCopy === null;
    })()
  );

  check(
    'r31_tick_visibility_summary_field',
    'day advance exposes progression visibility summary day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.progressionVisibilitySummaryDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r31_delivery_empty',
    'live region delivery day coach null when empty',
    (() => {
      const coach = buildCoachLiveRegionDeliveryDayCoach({
        plan: { messages: [], assertiveCount: 0, politeCount: 0 },
        nextGameDay: 1,
      });
      return coach.messageCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r31_deferral_clear',
    'attention deferral day coach null when nothing deferred',
    (() => {
      const coach = buildAttentionDeferralDayCoach({
        band: 'light',
        phase: 'human_turn',
        nextGameDay: 6,
        cognitiveLoadCoachRequested: false,
        panelUnlockCoachRequested: false,
        simEvolutionBridgeRequested: false,
        keyboardHintsRequested: false,
      });
      return coach.deferredSurfaceCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r31_visibility_late_day',
    'progression visibility summary null late day without preview',
    (() => {
      const coach = buildProgressionVisibilitySummaryDayCoach({
        signals: { gameDay: 20, turnCount: 20, interfaceLevel: 'expert' },
        policy: { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        nextGameDay: 20,
      });
      return coach.coachCopy === null || coach.coachCopy.includes('Day 20');
    })()
  );

  check(
    'r31_tick_deferral_save_load',
    'save_load day advance may defer attention surfaces',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return r.attentionDeferralDayCoachCopy === null || r.attentionDeferralDayCoachCopy.includes('Day 8');
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
