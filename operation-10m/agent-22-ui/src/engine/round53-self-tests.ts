import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFourteenthUnlockHeadlineDayCoach } from './fourteenth-unlock-headline-day-coach.js';
import { buildDuodecimDeferredQueueDayCoach } from './duodecim-deferred-queue-day-coach.js';
import { buildPreviewCoverageBreadthDayCoach } from './preview-coverage-breadth-day-coach.js';
import { buildPacingDeferredNovDayCoach } from './pacing-deferred-nov-day-coach.js';

export function runAgent22Round53SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const twelveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 14).map(p => p.id);

  check(
    'r53_fourteenth_unlock',
    'fourteenth unlock headline day coach',
    (() => {
      const coach = buildFourteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds,
        signals: { gameDay: 17, turnCount: 17, interfaceLevel: 'guided' },
        nextGameDay: 16,
      });
      return coach.panelId === twelveIds[12] && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r53_duodecim_deferred',
    'duodecim deferred queue day coach',
    (() => {
      const coach = buildDuodecimDeferredQueueDayCoach({ combinedQueueDepth: 12, nextGameDay: 17 });
      return coach.queueDepth === 12 && Boolean(coach.coachCopy?.includes('Day 18'));
    })()
  );

  check(
    'r53_preview_fraction_breadth',
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
    'r53_pacing_deferred_nov',
    'pacing deferred nov day coach',
    (() => {
      const coach = buildPacingDeferredNovDayCoach({ pacingDeferredCount: 8, nextGameDay: 12 });
      return coach.deferredCount === 8 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r53_tick_fourteenth_unlock',
    'tick exposes fourteenth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.fourteenthUnlockHeadlineDayCoachCopy === 'string' ||
        r.fourteenthUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r53_tick_duodecim_deferred',
    'tick exposes duodecim deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.duodecimDeferredQueueDayCoachCopy === 'string' || r.duodecimDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r53_tick_preview_fraction_breadth',
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
    'r53_tick_pacing_nov',
    'tick exposes pacing deferred nov day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredNovDayCoachCopy === 'string' || r.pacingDeferredNovDayCoachCopy === null;
    })()
  );

  check(
    'r53_fourteenth_unlock_short',
    'fourteenth unlock null with fewer than twelve unlocks',
    (() => {
      const coach = buildFourteenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds.slice(0, 12),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r53_duodecim_not_ten',
    'duodecim deferred null when depth not ten',
    (() => {
      const coach = buildDuodecimDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r53_preview_fraction_low',
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
    'r53_pacing_not_nov',
    'pacing deferred nov null when count not seven',
    (() => {
      const coach = buildPacingDeferredNovDayCoach({ pacingDeferredCount: 6, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
