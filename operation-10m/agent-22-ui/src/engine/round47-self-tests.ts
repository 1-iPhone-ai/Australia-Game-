import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildEighthUnlockHeadlineDayCoach } from './eighth-unlock-headline-day-coach.js';
import { buildHexDeferredQueueDayCoach } from './hex-deferred-queue-day-coach.js';
import { buildHiddenPanelBreadthDayCoach } from './hidden-panel-breadth-day-coach.js';
import { buildPacingDeferredTripleDayCoach } from './pacing-deferred-triple-day-coach.js';

export function runAgent22Round47SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const eightIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 8).map(p => p.id);

  check(
    'r47_eighth_unlock',
    'eighth unlock headline day coach',
    (() => {
      const coach = buildEighthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: eightIds,
        signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
        nextGameDay: 10,
      });
      return coach.panelId === eightIds[7] && Boolean(coach.coachCopy?.includes('Day 10'));
    })()
  );

  check(
    'r47_hex_deferred',
    'hex deferred queue day coach',
    (() => {
      const coach = buildHexDeferredQueueDayCoach({ combinedQueueDepth: 6, nextGameDay: 11 });
      return coach.queueDepth === 6 && Boolean(coach.coachCopy?.includes('Day 11'));
    })()
  );

  check(
    'r47_hidden_breadth',
    'hidden panel breadth day coach',
    (() => {
      const coach = buildHiddenPanelBreadthDayCoach({
        snapshot: {
          visible: 3,
          preview: 2,
          hidden: 5,
          total: 10,
          coverageRatio: 0.3,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 12,
      });
      return coach.hiddenCount === 5 && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r47_pacing_deferred_triple',
    'pacing deferred triple day coach',
    (() => {
      const coach = buildPacingDeferredTripleDayCoach({ pacingDeferredCount: 3, nextGameDay: 7 });
      return coach.deferredCount === 3 && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r47_tick_eighth_unlock',
    'tick exposes eighth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.eighthUnlockHeadlineDayCoachCopy === 'string' || r.eighthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r47_tick_hex_deferred',
    'tick exposes hex deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.hexDeferredQueueDayCoachCopy === 'string' || r.hexDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r47_tick_hidden_breadth',
    'tick exposes hidden panel breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.hiddenPanelBreadthDayCoachCopy === 'string' || r.hiddenPanelBreadthDayCoachCopy === null;
    })()
  );

  check(
    'r47_tick_pacing_triple',
    'tick exposes pacing deferred triple day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredTripleDayCoachCopy === 'string' || r.pacingDeferredTripleDayCoachCopy === null;
    })()
  );

  check(
    'r47_eighth_unlock_short',
    'eighth unlock null with fewer than eight unlocks',
    (() => {
      const coach = buildEighthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: eightIds.slice(0, 7),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r47_hex_not_six',
    'hex deferred null when depth not six',
    (() => {
      const coach = buildHexDeferredQueueDayCoach({ combinedQueueDepth: 5, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r47_hidden_low',
    'hidden breadth null when hidden below threshold',
    (() => {
      const coach = buildHiddenPanelBreadthDayCoach({
        snapshot: {
          visible: 2,
          preview: 2,
          hidden: 4,
          total: 8,
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
    'r47_pacing_not_triple',
    'pacing deferred triple null when count not three',
    (() => {
      const coach = buildPacingDeferredTripleDayCoach({ pacingDeferredCount: 2, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
