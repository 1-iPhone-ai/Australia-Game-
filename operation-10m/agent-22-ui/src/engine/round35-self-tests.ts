import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildProgressionCoverageTierDayCoach } from './progression-coverage-tier-day-coach.js';
import { buildRememberedPanelRosterDayCoach } from './remembered-panel-roster-day-coach.js';
import { buildCalmRecoverySuggestionDayCoach } from './calm-recovery-suggestion-day-coach.js';
import { buildMultiUnlockBatchDayCoach } from './multi-unlock-batch-day-coach.js';

export function runAgent22Round35SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r35_coverage_tier',
    'progression coverage tier day coach',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildProgressionCoverageTierDayCoach({ snapshot, nextGameDay: 2 });
      return coach.tierLabel === 'early' && Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r35_remembered_roster',
    'remembered panel roster day coach',
    (() => {
      const coach = buildRememberedPanelRosterDayCoach({
        rememberedPanelIds: ['nav_market', 'nav_map'],
        nextGameDay: 4,
      });
      return coach.rememberedCount === 2 && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r35_calm_suggest',
    'calm recovery suggestion day coach',
    (() => {
      const coach = buildCalmRecoverySuggestionDayCoach({
        hint: {
          suggestCalmRecovery: true,
          alreadyActive: false,
          coachCopy: 'Busy unlock day — calm recovery can snooze coaches and widen spacing.',
          patch: null,
        },
        nextGameDay: 6,
      });
      return coach.suggestCalmRecovery && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r35_multi_unlock',
    'multi unlock batch day coach',
    (() => {
      const coach = buildMultiUnlockBatchDayCoach({
        newlyUnlockedPanelIds: ['a', 'b', 'c'],
        nextGameDay: 7,
      });
      return coach.unlockCount === 3 && Boolean(coach.coachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r35_tick_tier',
    'tick exposes progression coverage tier day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.progressionCoverageTierDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r35_tick_remembered',
    'tick exposes remembered panel roster day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.rememberedPanelRosterDayCoachCopy === 'string' || r.rememberedPanelRosterDayCoachCopy === null;
    })()
  );

  check(
    'r35_tick_calm',
    'tick exposes calm recovery suggestion day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.calmRecoverySuggestionDayCoachCopy === 'string' || r.calmRecoverySuggestionDayCoachCopy === null;
    })()
  );

  check(
    'r35_tick_multi_unlock',
    'tick exposes multi unlock batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.multiUnlockBatchDayCoachCopy === 'string' || r.multiUnlockBatchDayCoachCopy === null;
    })()
  );

  check(
    'r35_roster_empty',
    'remembered roster null when empty',
    (() => {
      const coach = buildRememberedPanelRosterDayCoach({ rememberedPanelIds: [], nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r35_multi_single',
    'multi unlock null for single unlock',
    (() => {
      const coach = buildMultiUnlockBatchDayCoach({ newlyUnlockedPanelIds: ['one'], nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r35_calm_inactive',
    'calm suggestion null when not suggested',
    (() => {
      const coach = buildCalmRecoverySuggestionDayCoach({
        hint: { suggestCalmRecovery: false, alreadyActive: false, coachCopy: null, patch: null },
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r35_tier_mid',
    'mid tier label on day 8',
    (() => {
      const snapshot = buildProgressionCoverageSnapshot(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY
      );
      const coach = buildProgressionCoverageTierDayCoach({ snapshot, nextGameDay: 8 });
      return coach.tierLabel === 'mid';
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
