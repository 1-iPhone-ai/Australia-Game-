import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildCoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';
import { buildLiveRegionQueueDayCoach } from './live-region-queue-day-coach.js';
import { buildModalFocusRestoreDayCoach } from './modal-focus-restore-day-coach.js';
import { buildLayoutDensityMismatchDayCoach } from './layout-density-mismatch-day-coach.js';
import { buildNewlyUnlockedBatchDayCoach } from './newly-unlocked-batch-day-coach.js';

export function runAgent22Round30SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r30_live_region_queue',
    'live region queue day coach with messages',
    (() => {
      const plan = buildCoachLiveRegionDeliveryPlan(['Unlock map', 'Unlock market'], DEFAULT_ACCESSIBILITY_SNAPSHOT);
      const coach = buildLiveRegionQueueDayCoach({ plan, nextGameDay: 4 });
      return coach.queuedMessageCount > 0 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r30_modal_restore',
    'modal focus restore day coach when modal open',
    (() => {
      const coach = buildModalFocusRestoreDayCoach({
        openModalId: 'market_modal',
        lastNavTarget: 'market',
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        nextGameDay: 5,
      });
      return coach.restoreEnabled && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r30_layout_mismatch',
    'layout density mismatch day coach when preset conflicts',
    (() => {
      const coach = buildLayoutDensityMismatchDayCoach({
        layoutPreset: 'Clean',
        activeDensity: 'compact',
        nextGameDay: 3,
      });
      return Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r30_unlock_batch',
    'newly unlocked batch day coach for multi unlock',
    (() => {
      const coach = buildNewlyUnlockedBatchDayCoach({
        newlyUnlockedPanelIds: ['nav_map', 'nav_market', 'nav_workshop'],
        nextGameDay: 6,
      });
      return coach.unlockCount === 3 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r30_unlock_batch_single',
    'newly unlocked batch day coach null for single unlock',
    (() => {
      const coach = buildNewlyUnlockedBatchDayCoach({
        newlyUnlockedPanelIds: ['nav_map'],
        nextGameDay: 2,
      });
      return coach.unlockCount === 1 && coach.coachCopy === null;
    })()
  );

  check(
    'r30_tick_live_region_field',
    'day advance exposes live region queue day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
        { gameDay: 11, turnCount: 11, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.liveRegionQueueDayCoachCopy === 'string' || r.liveRegionQueueDayCoachCopy === null;
    })()
  );

  check(
    'r30_tick_modal_restore_field',
    'day advance exposes modal focus restore day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), lastNavTarget: 'map' },
        { phase: 'human_turn', openModalId: 'map_modal' }
      );
      return Boolean(r.modalFocusRestoreDayCoachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r30_tick_layout_mismatch_field',
    'day advance exposes layout density mismatch day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', layoutPreset: 'Clean' }
      );
      return typeof r.layoutDensityMismatchDayCoachCopy === 'string' || r.layoutDensityMismatchDayCoachCopy === null;
    })()
  );

  check(
    'r30_tick_batch_field',
    'day advance exposes newly unlocked batch day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 0, turnCount: 0, interfaceLevel: 'simple' },
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.newlyUnlockedBatchDayCoachCopy === 'string' || r.newlyUnlockedBatchDayCoachCopy === null;
    })()
  );

  check(
    'r30_live_region_empty',
    'live region queue day coach null when queue empty',
    (() => {
      const coach = buildLiveRegionQueueDayCoach({
        plan: { messages: [], assertiveCount: 0, politeCount: 0 },
        nextGameDay: 1,
      });
      return coach.queuedMessageCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r30_modal_restore_closed',
    'modal focus restore day coach null without modal',
    (() => {
      const coach = buildModalFocusRestoreDayCoach({
        openModalId: null,
        lastNavTarget: 'map',
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        nextGameDay: 7,
      });
      return !coach.restoreEnabled && coach.coachCopy === null;
    })()
  );

  check(
    'r30_layout_match',
    'layout density mismatch null when aligned',
    (() => {
      const coach = buildLayoutDensityMismatchDayCoach({
        layoutPreset: 'Clean',
        activeDensity: 'spacious',
        nextGameDay: 8,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
