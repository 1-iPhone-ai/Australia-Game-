import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildNinthUnlockHeadlineDayCoach } from './ninth-unlock-headline-day-coach.js';
import { buildHeptDeferredQueueDayCoach } from './hept-deferred-queue-day-coach.js';
import { buildTotalPanelBreadthDayCoach } from './total-panel-breadth-day-coach.js';
import { buildPacingDeferredQuadDayCoach } from './pacing-deferred-quad-day-coach.js';

export function runAgent22Round48SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const nineIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 9).map(p => p.id);

  check(
    'r48_ninth_unlock',
    'ninth unlock headline day coach',
    (() => {
      const coach = buildNinthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: nineIds,
        signals: { gameDay: 11, turnCount: 11, interfaceLevel: 'guided' },
        nextGameDay: 11,
      });
      return coach.panelId === nineIds[8] && Boolean(coach.coachCopy?.includes('Day 11'));
    })()
  );

  check(
    'r48_hept_deferred',
    'hept deferred queue day coach',
    (() => {
      const coach = buildHeptDeferredQueueDayCoach({ combinedQueueDepth: 7, nextGameDay: 12 });
      return coach.queueDepth === 7 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r48_total_breadth',
    'total panel breadth day coach',
    (() => {
      const coach = buildTotalPanelBreadthDayCoach({
        snapshot: {
          visible: 3,
          preview: 2,
          hidden: 5,
          total: 10,
          coverageRatio: 0.3,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 14,
      });
      return coach.totalCount === 10 && Boolean(coach.coachCopy?.includes('Day 14'));
    })()
  );

  check(
    'r48_pacing_deferred_quad',
    'pacing deferred quad day coach',
    (() => {
      const coach = buildPacingDeferredQuadDayCoach({ pacingDeferredCount: 4, nextGameDay: 8 });
      return coach.deferredCount === 4 && Boolean(coach.coachCopy?.includes('Day 8'));
    })()
  );

  check(
    'r48_tick_ninth_unlock',
    'tick exposes ninth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.ninthUnlockHeadlineDayCoachCopy === 'string' || r.ninthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r48_tick_hept_deferred',
    'tick exposes hept deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.heptDeferredQueueDayCoachCopy === 'string' || r.heptDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r48_tick_total_breadth',
    'tick exposes total panel breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.totalPanelBreadthDayCoachCopy === 'string' || r.totalPanelBreadthDayCoachCopy === null;
    })()
  );

  check(
    'r48_tick_pacing_quad',
    'tick exposes pacing deferred quad day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredQuadDayCoachCopy === 'string' || r.pacingDeferredQuadDayCoachCopy === null;
    })()
  );

  check(
    'r48_ninth_unlock_short',
    'ninth unlock null with fewer than nine unlocks',
    (() => {
      const coach = buildNinthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: nineIds.slice(0, 8),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r48_hept_not_seven',
    'hept deferred null when depth not seven',
    (() => {
      const coach = buildHeptDeferredQueueDayCoach({ combinedQueueDepth: 6, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r48_total_low',
    'total breadth null when total below threshold',
    (() => {
      const coach = buildTotalPanelBreadthDayCoach({
        snapshot: {
          visible: 2,
          preview: 2,
          hidden: 3,
          total: 7,
          coverageRatio: 0.2,
          coachCopy: null,
          tierLabel: 'early',
        },
        nextGameDay: 10,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r48_pacing_not_quad',
    'pacing deferred quad null when count not four',
    (() => {
      const coach = buildPacingDeferredQuadDayCoach({ pacingDeferredCount: 3, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
