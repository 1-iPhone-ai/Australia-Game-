import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildThirdUnlockHeadlineDayCoach } from './third-unlock-headline-day-coach.js';
import { buildTurnPaceMomentumDayCoach } from './turn-pace-momentum-day-coach.js';
import { buildLiveRegionAssertiveBatchDayCoach } from './live-region-assertive-batch-day-coach.js';
import { buildLegacyNavPatchCoverageDayCoach } from './legacy-nav-patch-coverage-day-coach.js';

export function runAgent22Round42SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r42_third_unlock',
    'third unlock headline day coach',
    (() => {
      const coach = buildThirdUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: ['nav_map', 'nav_market', 'nav_workshop'],
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        nextGameDay: 5,
      });
      return coach.panelId === 'nav_workshop' && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r42_turn_pace',
    'turn pace momentum day coach',
    (() => {
      const coach = buildTurnPaceMomentumDayCoach({
        signals: { gameDay: 4, turnCount: 10, interfaceLevel: 'simple' },
        nextGameDay: 4,
      });
      return Boolean(coach.coachCopy?.includes('Day 4')) && Boolean(coach.coachCopy?.includes('10 turns'));
    })()
  );

  check(
    'r42_assertive_batch',
    'live region assertive batch day coach',
    (() => {
      const coach = buildLiveRegionAssertiveBatchDayCoach({
        assertiveCount: 2,
        messageCount: 3,
        nextGameDay: 3,
      });
      return coach.assertiveCount === 2 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r42_legacy_patch',
    'legacy nav patch coverage day coach',
    (() => {
      const coach = buildLegacyNavPatchCoverageDayCoach({
        patchCoverageCount: 4,
        nextGameDay: 6,
      });
      return coach.patchCoverageCount === 4 && Boolean(coach.coachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r42_tick_third_unlock',
    'tick exposes third unlock headline day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.thirdUnlockHeadlineDayCoachCopy === 'string' || r.thirdUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r42_tick_turn_pace',
    'tick exposes turn pace momentum day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 6, interfaceLevel: 'simple' },
        { gameDay: 4, turnCount: 8, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.turnPaceMomentumDayCoachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r42_tick_assertive',
    'tick exposes live region assertive batch day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.liveRegionAssertiveBatchDayCoachCopy === 'string' || r.liveRegionAssertiveBatchDayCoachCopy === null;
    })()
  );

  check(
    'r42_tick_legacy_patch',
    'tick exposes legacy nav patch coverage day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavPatchCoverageDayCoachCopy === 'string' || r.legacyNavPatchCoverageDayCoachCopy === null;
    })()
  );

  check(
    'r42_third_unlock_short',
    'third unlock null with fewer than three unlocks',
    (() => {
      const coach = buildThirdUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: ['nav_map', 'nav_market'],
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r42_turn_pace_slow',
    'turn pace null when turns low',
    (() => {
      const coach = buildTurnPaceMomentumDayCoach({
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        nextGameDay: 5,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r42_assertive_zero',
    'assertive batch null when no assertive messages',
    (() => {
      const coach = buildLiveRegionAssertiveBatchDayCoach({
        assertiveCount: 0,
        messageCount: 2,
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r42_legacy_late',
    'legacy patch null after day 14',
    (() => {
      const coach = buildLegacyNavPatchCoverageDayCoach({
        patchCoverageCount: 3,
        nextGameDay: 20,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
