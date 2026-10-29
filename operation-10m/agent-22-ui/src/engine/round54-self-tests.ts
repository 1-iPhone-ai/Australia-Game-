import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFifteenthUnlockHeadlineDayCoach } from './fifteenth-unlock-headline-day-coach.js';
import { buildTredecimDeferredQueueDayCoach } from './tredecim-deferred-queue-day-coach.js';
import { buildPreviewCoverageBreadthDayCoach } from './preview-coverage-breadth-day-coach.js';
import { buildPacingDeferredDecDayCoach } from './pacing-deferred-dec-day-coach.js';

export function runAgent22Round54SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const twelveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 15).map(p => p.id);

  check(
    'r54_fifteenth_unlock',
    'fifteenth unlock headline day coach',
    (() => {
      const coach = buildFifteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds,
        signals: { gameDay: 18, turnCount: 18, interfaceLevel: 'guided' },
        nextGameDay: 18,
      });
      return coach.panelId === twelveIds[14] && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r54_tredecim_deferred',
    'tredecim deferred queue day coach',
    (() => {
      const coach = buildTredecimDeferredQueueDayCoach({ combinedQueueDepth: 13, nextGameDay: 18 });
      return coach.queueDepth === 13 && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r54_preview_fraction_breadth',
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
    'r54_pacing_deferred_dec',
    'pacing deferred dec day coach',
    (() => {
      const coach = buildPacingDeferredDecDayCoach({ pacingDeferredCount: 8, nextGameDay: 12 });
      return coach.deferredCount === 8 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r54_tick_fifteenth_unlock',
    'tick exposes fifteenth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.fifteenthUnlockHeadlineDayCoachCopy === 'string' ||
        r.fifteenthUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r54_tick_tredecim_deferred',
    'tick exposes tredecim deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.tredecimDeferredQueueDayCoachCopy === 'string' || r.tredecimDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r54_tick_preview_fraction_breadth',
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
    'r54_tick_pacing_dec',
    'tick exposes pacing deferred dec day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredDecDayCoachCopy === 'string' || r.pacingDeferredDecDayCoachCopy === null;
    })()
  );

  check(
    'r54_fifteenth_unlock_short',
    'fifteenth unlock null with fewer than twelve unlocks',
    (() => {
      const coach = buildFifteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds.slice(0, 14),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r54_tredecim_not_ten',
    'tredecim deferred null when depth not ten',
    (() => {
      const coach = buildTredecimDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r54_preview_fraction_low',
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
    'r54_pacing_not_dec',
    'pacing deferred dec null when count not seven',
    (() => {
      const coach = buildPacingDeferredDecDayCoach({ pacingDeferredCount: 6, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
