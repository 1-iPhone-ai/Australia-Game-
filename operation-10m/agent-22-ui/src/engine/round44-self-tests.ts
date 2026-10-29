import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_REGISTRY } from '../registry/panel-definitions.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFifthUnlockHeadlineDayCoach } from './fifth-unlock-headline-day-coach.js';
import { buildTripleDeferredQueueDayCoach } from './triple-deferred-queue-day-coach.js';
import { buildHiddenPanelSnapshotDayCoach } from './hidden-panel-snapshot-day-coach.js';
import { buildFlushRehydrateBatchDayCoach } from './flush-rehydrate-batch-day-coach.js';

export function runAgent22Round44SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  const fiveIds = EVOLVING_UI_PANEL_REGISTRY.slice(0, 5).map(p => p.id);

  check(
    'r44_fifth_unlock',
    'fifth unlock headline day coach',
    (() => {
      const coach = buildFifthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: fiveIds,
        signals: { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        nextGameDay: 7,
      });
      return coach.panelId === fiveIds[4] && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r44_triple_deferred',
    'triple deferred queue day coach',
    (() => {
      const coach = buildTripleDeferredQueueDayCoach({ combinedQueueDepth: 3, nextGameDay: 8 });
      return coach.queueDepth === 3 && Boolean(coach.coachCopy?.includes('Day 8'));
    })()
  );

  check(
    'r44_hidden_snapshot',
    'hidden panel snapshot day coach',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildHiddenPanelSnapshotDayCoach({
        snapshot: { ...snapshot, hidden: Math.max(snapshot.hidden, 4) },
        nextGameDay: 3,
      });
      return coach.hiddenCount >= 4 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r44_flush_rehydrate',
    'flush rehydrate batch day coach',
    (() => {
      const coach = buildFlushRehydrateBatchDayCoach({ flushedCount: 2, nextGameDay: 4 });
      return coach.flushedCount === 2 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r44_tick_fifth_unlock',
    'tick exposes fifth unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.fifthUnlockHeadlineDayCoachCopy === 'string' || r.fifthUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r44_tick_triple_deferred',
    'tick exposes triple deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.tripleDeferredQueueDayCoachCopy === 'string' || r.tripleDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r44_tick_hidden_snapshot',
    'tick exposes hidden panel snapshot day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.hiddenPanelSnapshotDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r44_tick_flush_rehydrate',
    'tick exposes flush rehydrate batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.flushRehydrateBatchDayCoachCopy === 'string' || r.flushRehydrateBatchDayCoachCopy === null;
    })()
  );

  check(
    'r44_fifth_unlock_short',
    'fifth unlock null with fewer than five unlocks',
    (() => {
      const coach = buildFifthUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: fiveIds.slice(0, 4),
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r44_triple_not_three',
    'triple deferred null when depth not three',
    (() => {
      const coach = buildTripleDeferredQueueDayCoach({ combinedQueueDepth: 2, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r44_hidden_late',
    'hidden snapshot null after day 14',
    (() => {
      const coach = buildHiddenPanelSnapshotDayCoach({
        snapshot: {
          visible: 2,
          preview: 1,
          hidden: 10,
          total: 13,
          coverageRatio: 0.2,
          coachCopy: null,
          tierLabel: 'late',
        },
        nextGameDay: 20,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r44_flush_single',
    'flush rehydrate null when flushed count below two',
    (() => {
      const coach = buildFlushRehydrateBatchDayCoach({ flushedCount: 1, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
