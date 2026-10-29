import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildProgressionCoverageDeltaDayCoach } from './progression-coverage-delta-day-coach.js';
import { buildPreviewPanelUnlockHintDayCoach } from './preview-panel-unlock-hint-day-coach.js';
import { buildImmediateCoachBatchDayCoach } from './immediate-coach-batch-day-coach.js';
import { buildDedupLedgerFootprintDayCoach } from './dedup-ledger-footprint-day-coach.js';

export function runAgent22Round32SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r32_coverage_delta_up',
    'progression coverage delta day coach increase',
    (() => {
      const coach = buildProgressionCoverageDeltaDayCoach({
        previousCoverageRatio: 0.2,
        currentCoverageRatio: 0.35,
        nextGameDay: 4,
      });
      return Boolean(coach.coachCopy?.includes('Day 4') && coach.coachCopy.includes('increased'));
    })()
  );

  check(
    'r32_coverage_delta_flat',
    'progression coverage delta null when flat',
    (() => {
      const coach = buildProgressionCoverageDeltaDayCoach({
        previousCoverageRatio: 0.5,
        currentCoverageRatio: 0.505,
        nextGameDay: 5,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r32_preview_hint',
    'preview panel unlock hint day coach shape',
    (() => {
      const coach = buildPreviewPanelUnlockHintDayCoach({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 3,
      });
      return coach.previewPanelId === null || Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r32_immediate_batch',
    'immediate coach batch day coach with lines',
    (() => {
      const coach = buildImmediateCoachBatchDayCoach({
        immediateCoachLineCount: 2,
        nextGameDay: 6,
      });
      return coach.immediateCount === 2 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r32_dedup_footprint',
    'dedup ledger footprint day coach with entries',
    (() => {
      const coach = buildDedupLedgerFootprintDayCoach({
        ledger: { a1: 1, b2: 2 },
        nextGameDay: 7,
      });
      return coach.ledgerEntryCount === 2 && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r32_tick_coverage_delta',
    'tick exposes progression coverage delta day coach field',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        lastProgressionCoverageRatio: 0.1,
      };
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted,
        { phase: 'human_turn' }
      );
      return typeof r.progressionCoverageDeltaDayCoachCopy === 'string' || r.progressionCoverageDeltaDayCoachCopy === null;
    })()
  );

  check(
    'r32_tick_preview_hint',
    'tick exposes preview panel unlock hint day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.previewPanelUnlockHintDayCoachCopy === 'string' || r.previewPanelUnlockHintDayCoachCopy === null;
    })()
  );

  check(
    'r32_tick_immediate_batch',
    'tick exposes immediate coach batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.immediateCoachBatchDayCoachCopy === 'string' || r.immediateCoachBatchDayCoachCopy === null;
    })()
  );

  check(
    'r32_tick_dedup_footprint',
    'tick exposes dedup ledger footprint day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.dedupLedgerFootprintDayCoachCopy === 'string' || r.dedupLedgerFootprintDayCoachCopy === null;
    })()
  );

  check(
    'r32_immediate_empty',
    'immediate coach batch null when zero',
    (() => {
      const coach = buildImmediateCoachBatchDayCoach({ immediateCoachLineCount: 0, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r32_dedup_small_ledger',
    'dedup footprint null with single ledger entry',
    (() => {
      const coach = buildDedupLedgerFootprintDayCoach({ ledger: { only: 1 }, nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r32_coverage_delta_no_prior',
    'coverage delta null without prior ratio',
    (() => {
      const coach = buildProgressionCoverageDeltaDayCoach({
        previousCoverageRatio: undefined,
        currentCoverageRatio: 0.4,
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
