import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildMilestoneForecastDayCoach } from './milestone-forecast-day-coach.js';
import { buildFocusSessionSuppressionDayCoach } from './focus-session-suppression-day-coach.js';
import { buildProgressionSignalDeltaDayCoach } from './progression-signal-delta-day-coach.js';
import { buildLayoutOnboardingDayCoach } from './layout-onboarding-day-coach.js';

export function runAgent22Round25SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r25_milestone_forecast',
    'milestone forecast day coach on early day',
    (() => {
      const coach = buildMilestoneForecastDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
      });
      return coach.forecastCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 1'));
    })()
  );

  check(
    'r25_focus_suppression',
    'focus session suppression day coach shape',
    (() => {
      const coach = buildFocusSessionSuppressionDayCoach({
        phase: 'human_turn',
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 5,
      });
      return typeof coach.active === 'boolean' && (coach.coachCopy === null || coach.coachCopy.includes('Day 5'));
    })()
  );

  check(
    'r25_signal_delta_jump',
    'progression signal delta day coach on large jump',
    (() => {
      const coach = buildProgressionSignalDeltaDayCoach({
        prior: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        next: { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        nextGameDay: 5,
      });
      return coach.dayDelta === 4 && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r25_signal_delta_level',
    'progression signal delta day coach on level change',
    (() => {
      const coach = buildProgressionSignalDeltaDayCoach({
        prior: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        next: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        nextGameDay: 4,
      });
      return coach.interfaceLevelChanged && Boolean(coach.coachCopy?.includes('guided'));
    })()
  );

  check(
    'r25_layout_onboarding',
    'layout onboarding day coach with panel ids',
    (() => {
      const coach = buildLayoutOnboardingDayCoach({
        panelIds: Object.keys(EVOLVING_UI_PANEL_BY_ID).slice(0, 8),
        layoutPreset: 'Clean',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 2,
      });
      return coach.layoutBlockedHighlightCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 2'));
    })()
  );

  check(
    'r25_tick_milestone_field',
    'day advance exposes milestone forecast day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.milestoneForecastDayCoachCopy === 'string' || r.milestoneForecastDayCoachCopy === null;
    })()
  );

  check(
    'r25_tick_focus_field',
    'day advance exposes focus suppression day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.focusSessionSuppressionDayCoachCopy === 'string' || r.focusSessionSuppressionDayCoachCopy === null;
    })()
  );

  check(
    'r25_tick_delta_field',
    'day advance exposes progression signal delta day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.progressionSignalDeltaDayCoachCopy === 'string' || r.progressionSignalDeltaDayCoachCopy === null;
    })()
  );

  check(
    'r25_tick_layout_field',
    'day advance exposes layout onboarding day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'guided' },
        { gameDay: 7, turnCount: 7, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn', layoutPreset: 'Clean' }
      );
      return typeof r.layoutOnboardingDayCoachCopy === 'string' || r.layoutOnboardingDayCoachCopy === null;
    })()
  );

  check(
    'r25_tick_delta_active',
    'day advance signal delta copy on interface shift',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 8, turnCount: 8, interfaceLevel: 'guided' },
        { gameDay: 9, turnCount: 9, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.progressionSignalDeltaDayCoachCopy?.includes('Day 9'));
    })()
  );

  check(
    'r25_tick_milestone_active',
    'day advance milestone forecast includes day prefix when present',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return r.milestoneForecastDayCoachCopy === null || r.milestoneForecastDayCoachCopy.includes('Day 2');
    })()
  );

  check(
    'r25_milestone_nonempty',
    'milestone forecast day coach copy when milestones pending',
    (() => {
      const coach = buildMilestoneForecastDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
        limit: 3,
      });
      return coach.forecastCount > 0 && Boolean(coach.coachCopy);
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
