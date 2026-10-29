import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildTwelfthUnlockHeadlineDayCoach } from './twelfth-unlock-headline-day-coach.js';
import { buildDecemDeferredQueueDayCoach } from './decem-deferred-queue-day-coach.js';
import { buildPreviewFractionBreadthDayCoach } from './preview-fraction-breadth-day-coach.js';
import { buildPacingDeferredSeptDayCoach } from './pacing-deferred-sept-day-coach.js';

export function runAgent22Round51SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const twelveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 12).map(p => p.id);

  check(
    'r51_twelfth_unlock',
    'twelfth unlock headline day coach',
    (() => {
      const coach = buildTwelfthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds,
        signals: { gameDay: 16, turnCount: 16, interfaceLevel: 'guided' },
        nextGameDay: 16,
      });
      return coach.panelId === twelveIds[11] && Boolean(coach.coachCopy?.includes('Day 16'));
    })()
  );

  check(
    'r51_decem_deferred',
    'decem deferred queue day coach',
    (() => {
      const coach = buildDecemDeferredQueueDayCoach({ combinedQueueDepth: 10, nextGameDay: 17 });
      return coach.queueDepth === 10 && Boolean(coach.coachCopy?.includes('Day 17'));
    })()
  );

  check(
    'r51_preview_fraction_breadth',
    'preview fraction breadth day coach',
    (() => {
      const coach = buildPreviewFractionBreadthDayCoach({
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
      return coach.previewFraction === 0.3 && Boolean(coach.coachCopy?.includes('Day 13'));
    })()
  );

  check(
    'r51_pacing_deferred_sept',
    'pacing deferred sept day coach',
    (() => {
      const coach = buildPacingDeferredSeptDayCoach({ pacingDeferredCount: 7, nextGameDay: 12 });
      return coach.deferredCount === 7 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r51_tick_twelfth_unlock',
    'tick exposes twelfth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.twelfthUnlockHeadlineDayCoachCopy === 'string' ||
        r.twelfthUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r51_tick_decem_deferred',
    'tick exposes decem deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.decemDeferredQueueDayCoachCopy === 'string' || r.decemDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r51_tick_preview_fraction_breadth',
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
        typeof r.previewFractionBreadthDayCoachCopy === 'string' ||
        r.previewFractionBreadthDayCoachCopy === null
      );
    })()
  );

  check(
    'r51_tick_pacing_sept',
    'tick exposes pacing deferred sept day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredSeptDayCoachCopy === 'string' || r.pacingDeferredSeptDayCoachCopy === null;
    })()
  );

  check(
    'r51_twelfth_unlock_short',
    'twelfth unlock null with fewer than twelve unlocks',
    (() => {
      const coach = buildTwelfthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: twelveIds.slice(0, 11),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r51_decem_not_ten',
    'decem deferred null when depth not ten',
    (() => {
      const coach = buildDecemDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r51_preview_fraction_low',
    'preview fraction breadth null when fraction below threshold',
    (() => {
      const coach = buildPreviewFractionBreadthDayCoach({
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
    'r51_pacing_not_sept',
    'pacing deferred sept null when count not seven',
    (() => {
      const coach = buildPacingDeferredSeptDayCoach({ pacingDeferredCount: 6, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
