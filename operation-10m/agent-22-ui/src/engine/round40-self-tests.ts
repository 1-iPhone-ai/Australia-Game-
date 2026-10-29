import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { forecastUpcomingMilestones } from './milestone-forecast-coach.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFirstUnlockHeadlineDayCoach } from './first-unlock-headline-day-coach.js';
import { buildMilestoneForecastBreadthDayCoach } from './milestone-forecast-breadth-day-coach.js';
import { buildNotificationLaneSuppressedDayCoach } from './notification-lane-suppressed-day-coach.js';
import { buildSingleDeferredCoachLineDayCoach } from './single-deferred-coach-line-day-coach.js';

export function runAgent22Round40SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r40_first_unlock',
    'first unlock headline day coach',
    (() => {
      const coach = buildFirstUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: ['nav_map'],
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        nextGameDay: 3,
      });
      return coach.panelId === 'nav_map' && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r40_milestone_breadth',
    'milestone forecast breadth day coach',
    (() => {
      const entries = forecastUpcomingMilestones(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        5
      );
      const coach = buildMilestoneForecastBreadthDayCoach({
        entries,
        nextGameDay: 2,
      });
      return entries.length > 0 && coach.forecastCount === entries.length && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r40_lane_suppressed',
    'notification lane suppressed day coach',
    (() => {
      const coach = buildNotificationLaneSuppressedDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.suppressedCount > 0 && Boolean(coach.coachCopy?.includes('Day 1'));
    })()
  );

  check(
    'r40_single_deferred',
    'single deferred coach line day coach',
    (() => {
      const coach = buildSingleDeferredCoachLineDayCoach({
        combinedQueueDepth: 1,
        nextGameDay: 5,
      });
      return coach.queueDepth === 1 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r40_tick_first_unlock',
    'tick exposes first unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.firstUnlockHeadlineDayCoachCopy === 'string' || r.firstUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r40_tick_milestone_breadth',
    'tick exposes milestone forecast breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.milestoneForecastBreadthDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r40_tick_lane_suppressed',
    'tick exposes notification lane suppressed day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.notificationLaneSuppressedDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r40_tick_single_deferred',
    'tick exposes single deferred coach line day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.singleDeferredCoachLineDayCoachCopy === 'string' || r.singleDeferredCoachLineDayCoachCopy === null;
    })()
  );

  check(
    'r40_first_unlock_empty',
    'first unlock headline null when no unlocks',
    (() => {
      const coach = buildFirstUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: [],
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r40_milestone_breadth_empty',
    'milestone breadth null when no entries',
    (() => {
      const coach = buildMilestoneForecastBreadthDayCoach({ entries: [], nextGameDay: 3 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r40_single_deferred_not_one',
    'single deferred null when depth not one',
    (() => {
      const coach = buildSingleDeferredCoachLineDayCoach({ combinedQueueDepth: 2, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r40_lane_suppressed_expert',
    'lane suppressed may clear on expert late game',
    (() => {
      const coach = buildNotificationLaneSuppressedDayCoach({
        signals: { gameDay: 30, turnCount: 30, interfaceLevel: 'expert' },
        nextGameDay: 30,
      });
      return typeof coach.coachCopy === 'string' || coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
