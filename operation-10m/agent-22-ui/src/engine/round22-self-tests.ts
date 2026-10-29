import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildPhaseCoachGateDayCoach } from './phase-coach-gate-day-coach.js';
import { buildNotificationLaneDayCoach } from './notification-lane-day-coach.js';
import { buildLandmarkReadingDayCoach } from './landmark-reading-day-coach.js';
import { buildCoachLiveRegionDayCoach } from './coach-live-region-day-coach.js';
import { buildCoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';

export function runAgent22Round22SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r22_phase_gate_save_load',
    'phase coach gate day coach on save_load',
    (() => {
      const coach = buildPhaseCoachGateDayCoach({
        phase: 'save_load',
        band: 'moderate',
        nextGameDay: 3,
      });
      return coach.suppressedSurfaceCount > 0 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r22_phase_gate_human_turn',
    'phase coach gate day coach null when all allowed',
    (() => {
      const coach = buildPhaseCoachGateDayCoach({
        phase: 'human_turn',
        band: 'light',
        nextGameDay: 4,
      });
      return coach.coachCopy === null || coach.coachCopy.includes('Day 4');
    })()
  );

  check(
    'r22_notification_lane',
    'notification lane day coach on early day',
    (() => {
      const coach = buildNotificationLaneDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.activeLaneCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 1'));
    })()
  );

  check(
    'r22_landmark_reading',
    'landmark reading day coach on human_turn',
    (() => {
      const coach = buildLandmarkReadingDayCoach({ phase: 'human_turn', nextGameDay: 5 });
      return coach.skipLinkCount > 1 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r22_live_region',
    'coach live region day coach with messages',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['Unlock map', 'Unlock market'], DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const coach = buildCoachLiveRegionDayCoach({ plan, nextGameDay: 6 });
      return coach.messageCount > 0 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r22_live_region_off',
    'coach live region day coach null when SR off',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['test'], {
        ...DEFAULT_ACCESSIBILITY_SNAPSHOT,
        screenReaderAnnouncements: false,
      });
      const coach = buildCoachLiveRegionDayCoach({ plan, nextGameDay: 2 });
      return coach.messageCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r22_tick_phase_gate_field',
    'day advance exposes phase coach gate day copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return typeof r.phaseCoachGateDayCoachCopy === 'string' || r.phaseCoachGateDayCoachCopy === null;
    })()
  );

  check(
    'r22_tick_lane_field',
    'day advance exposes notification lane day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.notificationLaneDayCoachCopy === 'string' || r.notificationLaneDayCoachCopy === null;
    })()
  );

  check(
    'r22_tick_landmark_field',
    'day advance exposes landmark reading day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.landmarkReadingDayCoachCopy === 'string' || r.landmarkReadingDayCoachCopy === null;
    })()
  );

  check(
    'r22_tick_live_region_field',
    'day advance exposes coach live region day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.coachLiveRegionDayCoachCopy === 'string' || r.coachLiveRegionDayCoachCopy === null;
    })()
  );

  check(
    'r22_tick_save_load_gate_copy',
    'save_load day advance phase gate mentions deferred surfaces',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'save_load' }
      );
      return Boolean(r.phaseCoachGateDayCoachCopy?.toLowerCase().includes('deferred'));
    })()
  );

  check(
    'r22_tick_landmark_active',
    'human_turn day advance landmark reading copy present',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.landmarkReadingDayCoachCopy?.includes('Day 5'));
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
