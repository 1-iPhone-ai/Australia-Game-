import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildThirteenthUnlockHeadlineDayCoach } from './thirteenth-unlock-headline-day-coach.js';
import { buildUndecimDeferredQueueDayCoach } from './undecim-deferred-queue-day-coach.js';
import { buildPreviewCoverageBreadthDayCoach } from './preview-coverage-breadth-day-coach.js';
import { buildPacingDeferredOctDayCoach } from './pacing-deferred-oct-day-coach.js';

export function runAgent22Round52SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const twelveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 13).map(p => p.id);

  check(
    'r52_thirteenth_unlock',
    'thirteenth unlock headline day coach',
    (() => {
      const coach = buildThirteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds,
        signals: { gameDay: 16, turnCount: 16, interfaceLevel: 'guided' },
        nextGameDay: 16,
      });
      return coach.panelId === twelveIds[12] && Boolean(coach.coachCopy?.includes('Day 16'));
    })()
  );

  check(
    'r52_undecim_deferred',
    'undecim deferred queue day coach',
    (() => {
      const coach = buildUndecimDeferredQueueDayCoach({ combinedQueueDepth: 11, nextGameDay: 17 });
      return coach.queueDepth === 11 && Boolean(coach.coachCopy?.includes('Day 17'));
    })()
  );

  check(
    'r52_preview_fraction_breadth',
    'preview fraction breadth day coach',
    (() => {
      const coach = buildPreviewCoverageBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 3,
          hidden: 3,
          total: 10,
          coverageRatio: 0.6,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 13,
      });
      return coach.coverageRatio === 0.6 && Boolean(coach.coachCopy?.includes('Day 13'));
    })()
  );

  check(
    'r52_pacing_deferred_oct',
    'pacing deferred oct day coach',
    (() => {
      const coach = buildPacingDeferredOctDayCoach({ pacingDeferredCount: 8, nextGameDay: 12 });
      return coach.deferredCount === 8 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r52_tick_thirteenth_unlock',
    'tick exposes thirteenth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.thirteenthUnlockHeadlineDayCoachCopy === 'string' ||
        r.thirteenthUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r52_tick_undecim_deferred',
    'tick exposes undecim deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.undecimDeferredQueueDayCoachCopy === 'string' || r.undecimDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r52_tick_preview_fraction_breadth',
    'tick exposes preview fraction breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.previewCoverageBreadthDayCoachCopy === 'string' ||
        r.previewCoverageBreadthDayCoachCopy === null
      );
    })()
  );

  check(
    'r52_tick_pacing_oct',
    'tick exposes pacing deferred oct day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredOctDayCoachCopy === 'string' || r.pacingDeferredOctDayCoachCopy === null;
    })()
  );

  check(
    'r52_thirteenth_unlock_short',
    'thirteenth unlock null with fewer than twelve unlocks',
    (() => {
      const coach = buildThirteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds.slice(0, 12),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r52_undecim_not_ten',
    'undecim deferred null when depth not ten',
    (() => {
      const coach = buildUndecimDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r52_preview_fraction_low',
    'preview fraction breadth null when fraction below threshold',
    (() => {
      const coach = buildPreviewCoverageBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 2,
          hidden: 4,
          total: 10,
          coverageRatio: 0.5,
          coachCopy: null,
          tierLabel: 'early',
        },
        nextGameDay: 10,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r52_pacing_not_oct',
    'pacing deferred oct null when count not seven',
    (() => {
      const coach = buildPacingDeferredOctDayCoach({ pacingDeferredCount: 6, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
