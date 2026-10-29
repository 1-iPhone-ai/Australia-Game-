import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildTenthUnlockHeadlineDayCoach } from './tenth-unlock-headline-day-coach.js';
import { buildOctDeferredQueueDayCoach } from './oct-deferred-queue-day-coach.js';
import { buildCoverageRatioBreadthDayCoach } from './coverage-ratio-breadth-day-coach.js';
import { buildPacingDeferredQuintDayCoach } from './pacing-deferred-quint-day-coach.js';

export function runAgent22Round49SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const tenIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 10).map(p => p.id);

  check(
    'r49_tenth_unlock',
    'tenth unlock headline day coach',
    (() => {
      const coach = buildTenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: tenIds,
        signals: { gameDay: 12, turnCount: 12, interfaceLevel: 'guided' },
        nextGameDay: 12,
      });
      return coach.panelId === tenIds[9] && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r49_oct_deferred',
    'oct deferred queue day coach',
    (() => {
      const coach = buildOctDeferredQueueDayCoach({ combinedQueueDepth: 8, nextGameDay: 13 });
      return coach.queueDepth === 8 && Boolean(coach.coachCopy?.includes('Day 13'));
    })()
  );

  check(
    'r49_coverage_ratio_breadth',
    'coverage ratio breadth day coach',
    (() => {
      const coach = buildCoverageRatioBreadthDayCoach({
        snapshot: {
          visible: 4,
          preview: 3,
          hidden: 3,
          total: 10,
          coverageRatio: 0.6,
          coachCopy: null,
          tierLabel: 'mid',
        },
        nextGameDay: 15,
      });
      return coach.coverageRatio === 0.6 && Boolean(coach.coachCopy?.includes('Day 15'));
    })()
  );

  check(
    'r49_pacing_deferred_quint',
    'pacing deferred quint day coach',
    (() => {
      const coach = buildPacingDeferredQuintDayCoach({ pacingDeferredCount: 5, nextGameDay: 9 });
      return coach.deferredCount === 5 && Boolean(coach.coachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r49_tick_tenth_unlock',
    'tick exposes tenth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.tenthUnlockHeadlineDayCoachCopy === 'string' || r.tenthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r49_tick_oct_deferred',
    'tick exposes oct deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.octDeferredQueueDayCoachCopy === 'string' || r.octDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r49_tick_coverage_ratio_breadth',
    'tick exposes coverage ratio breadth day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.coverageRatioBreadthDayCoachCopy === 'string' || r.coverageRatioBreadthDayCoachCopy === null;
    })()
  );

  check(
    'r49_tick_pacing_quint',
    'tick exposes pacing deferred quint day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.pacingDeferredQuintDayCoachCopy === 'string' || r.pacingDeferredQuintDayCoachCopy === null;
    })()
  );

  check(
    'r49_tenth_unlock_short',
    'tenth unlock null with fewer than ten unlocks',
    (() => {
      const coach = buildTenthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: tenIds.slice(0, 9),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r49_oct_not_eight',
    'oct deferred null when depth not eight',
    (() => {
      const coach = buildOctDeferredQueueDayCoach({ combinedQueueDepth: 7, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r49_coverage_ratio_low',
    'coverage ratio breadth null when ratio below threshold',
    (() => {
      const coach = buildCoverageRatioBreadthDayCoach({
        snapshot: {
          visible: 2,
          preview: 2,
          hidden: 3,
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
    'r49_pacing_not_quint',
    'pacing deferred quint null when count not five',
    (() => {
      const coach = buildPacingDeferredQuintDayCoach({ pacingDeferredCount: 4, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
