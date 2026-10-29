import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import { forecastUpcomingMilestones } from './milestone-forecast-coach.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildSecondUnlockHeadlineDayCoach } from './second-unlock-headline-day-coach.js';
import { buildActiveNotificationLaneCountDayCoach } from './active-notification-lane-count-day-coach.js';
import { buildVisiblePanelSnapshotDayCoach } from './visible-panel-snapshot-day-coach.js';
import { buildNearestMilestoneEtaDayCoach } from './nearest-milestone-eta-day-coach.js';

export function runAgent22Round41SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r41_second_unlock',
    'second unlock headline day coach',
    (() => {
      const coach = buildSecondUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: ['nav_map', 'nav_market'],
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        nextGameDay: 4,
      });
      return coach.panelId === 'nav_market' && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r41_active_lane_count',
    'active notification lane count day coach',
    (() => {
      const coach = buildActiveNotificationLaneCountDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.activeCount > 0 && coach.activeCount < coach.totalLanes && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r41_visible_snapshot',
    'visible panel snapshot day coach',
    (() => {
      const coach = buildVisiblePanelSnapshotDayCoach({
        visiblePanelCount: 5,
        totalPanelCount: EVOLVING_UI_PANEL_REGISTRY.length,
        nextGameDay: 6,
      });
      return Boolean(coach.coachCopy?.includes('Day 6')) && Boolean(coach.coachCopy?.includes('5 of'));
    })()
  );

  check(
    'r41_nearest_eta',
    'nearest milestone eta day coach',
    (() => {
      const entries = forecastUpcomingMilestones(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        4
      );
      const coach = buildNearestMilestoneEtaDayCoach({ entries, nextGameDay: 1 });
      return Boolean(coach.daysAway) && Boolean(coach.coachCopy?.includes('Day 1'));
    })()
  );

  check(
    'r41_tick_second_unlock',
    'tick exposes second unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.secondUnlockHeadlineDayCoachCopy === 'string' || r.secondUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r41_tick_lane_count',
    'tick exposes active notification lane count day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.activeNotificationLaneCountDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r41_tick_visible_snapshot',
    'tick exposes visible panel snapshot day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.visiblePanelSnapshotDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r41_tick_nearest_eta',
    'tick exposes nearest milestone eta day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.nearestMilestoneEtaDayCoachCopy === 'string' || r.nearestMilestoneEtaDayCoachCopy === null;
    })()
  );

  check(
    'r41_second_unlock_single',
    'second unlock null with one unlock',
    (() => {
      const coach = buildSecondUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: ['nav_map'],
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r41_visible_late',
    'visible snapshot null after day 12',
    (() => {
      const coach = buildVisiblePanelSnapshotDayCoach({
        visiblePanelCount: 8,
        totalPanelCount: 20,
        nextGameDay: 15,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r41_lane_all_active',
    'lane count null when all lanes active',
    (() => {
      const coach = buildActiveNotificationLaneCountDayCoach({
        signals: { gameDay: 40, turnCount: 40, interfaceLevel: 'expert' },
        nextGameDay: 40,
      });
      return coach.coachCopy === null || coach.activeCount < coach.totalLanes;
    })()
  );

  check(
    'r41_eta_empty',
    'nearest eta null with empty forecast',
    (() => {
      const coach = buildNearestMilestoneEtaDayCoach({ entries: [], nextGameDay: 3 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
