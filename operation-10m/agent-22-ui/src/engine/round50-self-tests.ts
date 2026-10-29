import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildEleventhUnlockHeadlineDayCoach } from './eleventh-unlock-headline-day-coach.js';
import { buildNovemDeferredQueueDayCoach } from './novem-deferred-queue-day-coach.js';
import { buildVisibleFractionBreadthDayCoach } from './visible-fraction-breadth-day-coach.js';
import { buildPacingDeferredSextDayCoach } from './pacing-deferred-sext-day-coach.js';

export function runAgent22Round50SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const elevenIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 11).map(p => p.id);

  check(
    'r50_eleventh_unlock',
    'eleventh unlock headline day coach',
    (() => {
      const coach = buildEleventhUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: elevenIds,
        signals: { gameDay: 14, turnCount: 14, interfaceLevel: 'guided' },
        nextGameDay: 14,
      });
      return coach.panelId === elevenIds[10] && Boolean(coach.coachCopy?.includes('Day 14'));
    })()
  );

  check(
    'r50_novem_deferred',
    'novem deferred queue day coach',
    (() => {
      const coach = buildNovemDeferredQueueDayCoach({ combinedQueueDepth: 9, nextGameDay: 16 });
      return coach.queueDepth === 9 && Boolean(coach.coachCopy?.includes('Day 16'));
    })()
  );

  check(
    'r50_visible_fraction_breadth',
    'visible fraction breadth day coach',
    (() => {
      const coach = buildVisibleFractionBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 3,
          hidden: 3,
          total: 10,
          coverageRatio: 0.6,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 12,
      });
      return coach.visibleFraction === 0.4 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r50_pacing_deferred_sext',
    'pacing deferred sext day coach',
    (() => {
      const coach = buildPacingDeferredSextDayCoach({ pacingDeferredCount: 6, nextGameDay: 11 });
      return coach.deferredCount === 6 && Boolean(coach.coachCopy?.includes('Day 11'));
    })()
  );

  check(
    'r50_tick_eleventh_unlock',
    'tick exposes eleventh unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.eleventhUnlockHeadlineDayCoachCopy === 'string' ||
        r.eleventhUnlockHeadlineDayCoachCopy === null
      );
    })()
  );

  check(
    'r50_tick_novem_deferred',
    'tick exposes novem deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.novemDeferredQueueDayCoachCopy === 'string' || r.novemDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r50_tick_visible_fraction_breadth',
    'tick exposes visible fraction breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return (
        typeof r.visibleFractionBreadthDayCoachCopy === 'string' ||
        r.visibleFractionBreadthDayCoachCopy === null
      );
    })()
  );

  check(
    'r50_tick_pacing_sext',
    'tick exposes pacing deferred sext day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredSextDayCoachCopy === 'string' || r.pacingDeferredSextDayCoachCopy === null;
    })()
  );

  check(
    'r50_eleventh_unlock_short',
    'eleventh unlock null with fewer than eleven unlocks',
    (() => {
      const coach = buildEleventhUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: elevenIds.slice(0, 10),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r50_novem_not_nine',
    'novem deferred null when depth not nine',
    (() => {
      const coach = buildNovemDeferredQueueDayCoach({ combinedQueueDepth: 8, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r50_visible_fraction_low',
    'visible fraction breadth null when fraction below threshold',
    (() => {
      const coach = buildVisibleFractionBreadthDayCoach({
        snapshot: {
          visible: 1,
          preview: 2,
          hidden: 4,
          total: 7,
          coverageRatio: 0.4,
          coachCopy: null,
          tierLabel: 'early',
        },
        nextGameDay: 10,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r50_pacing_not_sext',
    'pacing deferred sext null when count not six',
    (() => {
      const coach = buildPacingDeferredSextDayCoach({ pacingDeferredCount: 5, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
