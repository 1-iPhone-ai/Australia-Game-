import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildFlushedDeferredQueueDayCoach } from './flushed-deferred-queue-day-coach.js';
import { buildLegacyNavProgressionHiddenDayCoach } from './legacy-nav-progression-hidden-day-coach.js';
import { buildLargeDayJumpDayCoach } from './large-day-jump-day-coach.js';
import { buildOnboardingHighlightRosterDayCoach } from './onboarding-highlight-roster-day-coach.js';

export function runAgent22Round33SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r33_flushed_queue',
    'flushed deferred queue day coach',
    (() => {
      const coach = buildFlushedDeferredQueueDayCoach({ flushedCount: 2, nextGameDay: 5 });
      return coach.flushedCount === 2 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r33_legacy_hidden',
    'legacy nav progression hidden day coach shape',
    (() => {
      const coach = buildLegacyNavProgressionHiddenDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.hiddenTargetCount >= 0;
    })()
  );

  check(
    'r33_large_jump',
    'large day jump day coach on big delta',
    (() => {
      const coach = buildLargeDayJumpDayCoach({
        prior: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        next: { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        nextGameDay: 5,
      });
      return coach.dayDelta === 4 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r33_onboarding_roster',
    'onboarding highlight roster day coach',
    (() => {
      const coach = buildOnboardingHighlightRosterDayCoach({
        highlightedPanelIds: ['market_panel', 'map_panel'],
        nextGameDay: 3,
      });
      return coach.highlightCount === 2 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r33_tick_flushed',
    'tick exposes flushed deferred queue day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.flushedDeferredQueueDayCoachCopy === 'string' || r.flushedDeferredQueueDayCoachCopy === null;
    })()
  );

  check(
    'r33_tick_legacy_hidden',
    'tick exposes legacy nav progression hidden day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavProgressionHiddenDayCoachCopy === 'string' || r.legacyNavProgressionHiddenDayCoachCopy === null;
    })()
  );

  check(
    'r33_tick_large_jump',
    'tick exposes large day jump day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 6, turnCount: 6, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.largeDayJumpDayCoachCopy?.includes('Day 6'));
    })()
  );

  check(
    'r33_tick_onboarding_roster',
    'tick exposes onboarding highlight roster day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.onboardingHighlightRosterDayCoachCopy === 'string' || r.onboardingHighlightRosterDayCoachCopy === null;
    })()
  );

  check(
    'r33_flushed_empty',
    'flushed deferred queue null when zero',
    (() => {
      const coach = buildFlushedDeferredQueueDayCoach({ flushedCount: 0, nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r33_roster_empty',
    'onboarding roster null when empty',
    (() => {
      const coach = buildOnboardingHighlightRosterDayCoach({ highlightedPanelIds: [], nextGameDay: 2 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r33_jump_skipped',
    'large day jump null on small delta',
    (() => {
      const coach = buildLargeDayJumpDayCoach({
        prior: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        next: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r33_jump_interface_change',
    'large day jump null when interface level changes',
    (() => {
      const coach = buildLargeDayJumpDayCoach({
        prior: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        next: { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        nextGameDay: 8,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
