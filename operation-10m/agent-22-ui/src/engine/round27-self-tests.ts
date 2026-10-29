import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildShowAllProgressiveSafetyDayCoach } from './show-all-progressive-safety-day-coach.js';
import { buildLegacyNavAutoRememberDayCoach } from './legacy-nav-auto-remember-day-coach.js';
import { buildFocusSessionPolicyDayCoach } from './focus-session-policy-day-coach.js';
import { buildCoachDismissalBackoffDayCoach } from './coach-dismissal-backoff-day-coach.js';

export function runAgent22Round27SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r27_show_all_safety',
    'show-all progressive safety day coach when override on risky phase',
    (() => {
      const coach = buildShowAllProgressiveSafetyDayCoach({
        persisted: { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        phase: 'save_load',
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 3,
      });
      return coach.overrideActive && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r27_legacy_remember',
    'legacy nav auto remember day coach shape',
    (() => {
      const coach = buildLegacyNavAutoRememberDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 2,
      });
      return coach.pendingRememberCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 2'));
    })()
  );

  check(
    'r27_focus_policy',
    'focus session policy day coach on early human_turn',
    (() => {
      const coach = buildFocusSessionPolicyDayCoach({
        phase: 'human_turn',
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 3,
      });
      return (coach.coachCopy === null || coach.coachCopy.includes('Day 3'));
    })()
  );

  check(
    'r27_dismissal_backoff',
    'coach dismissal backoff day coach when quiet',
    (() => {
      const coach = buildCoachDismissalBackoffDayCoach({
        persisted: {
          ...createDefaultEvolvingUiPersistedState(),
          coachDismissalStreak: 2,
          coachDismissalQuietUntilDay: 8,
        },
        nextGameDay: 5,
      });
      return coach.quietActive && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r27_dismissal_clear',
    'coach dismissal backoff day coach null when not quiet',
    (() => {
      const coach = buildCoachDismissalBackoffDayCoach({
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 4,
      });
      return !coach.quietActive && coach.coachCopy === null;
    })()
  );

  check(
    'r27_tick_show_all_field',
    'day advance exposes show-all progressive safety day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        { phase: 'save_load' }
      );
      return typeof r.showAllProgressiveSafetyDayCoachCopy === 'string' || r.showAllProgressiveSafetyDayCoachCopy === null;
    })()
  );

  check(
    'r27_tick_legacy_remember_field',
    'day advance exposes legacy auto remember day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'simple' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavAutoRememberDayCoachCopy === 'string' || r.legacyNavAutoRememberDayCoachCopy === null;
    })()
  );

  check(
    'r27_tick_focus_policy_field',
    'day advance exposes focus session policy day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.focusSessionPolicyDayCoachCopy === 'string' || r.focusSessionPolicyDayCoachCopy === null;
    })()
  );

  check(
    'r27_tick_dismissal_field',
    'day advance exposes coach dismissal backoff day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        {
          ...createDefaultEvolvingUiPersistedState(),
          coachDismissalQuietUntilDay: 10,
          coachDismissalStreak: 1,
        },
        { phase: 'human_turn' }
      );
      return Boolean(r.coachDismissalBackoffDayCoachCopy?.includes('Day 7'));
    })()
  );

  check(
    'r27_tick_show_all_active',
    'show-all safety day coach on save_load with override',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        { gameDay: 9, turnCount: 9, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), showAllPanelsOverride: true },
        { phase: 'save_load' }
      );
      return Boolean(r.showAllProgressiveSafetyDayCoachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r27_focus_policy_active',
    'focus session policy coach when session active',
    (() => {
      const coach = buildFocusSessionPolicyDayCoach({
        phase: 'human_turn',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.focusSessionActive && Boolean(coach.coachCopy?.includes('Focus session'));
    })()
  );

  check(
    'r27_show_all_inactive',
    'show-all progressive safety null without override',
    (() => {
      const coach = buildShowAllProgressiveSafetyDayCoach({
        persisted: createDefaultEvolvingUiPersistedState(),
        phase: 'human_turn',
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 5,
      });
      return !coach.overrideActive && coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
