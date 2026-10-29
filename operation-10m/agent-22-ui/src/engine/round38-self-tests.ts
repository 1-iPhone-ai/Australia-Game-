import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildLegacyNavAutoRememberPlan } from './legacy-nav-auto-remember-bridge.js';
import { buildShowAllOverrideActiveDayCoach } from './show-all-override-active-day-coach.js';
import { buildCognitiveLoadBandDayCoach } from './cognitive-load-band-day-coach.js';
import { buildOnboardingActiveStepsDayCoach } from './onboarding-active-steps-day-coach.js';
import { buildLegacyNavRememberPlanDayCoach } from './legacy-nav-remember-plan-day-coach.js';

export function runAgent22Round38SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r38_show_all',
    'show all override active day coach',
    (() => {
      const coach = buildShowAllOverrideActiveDayCoach({
        persisted: { showAllPanelsOverride: true },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 3,
      });
      return coach.overrideActive && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r38_load_band',
    'cognitive load band day coach heavy',
    (() => {
      const coach = buildCognitiveLoadBandDayCoach({ band: 'heavy', nextGameDay: 4 });
      return coach.band === 'heavy' && Boolean(coach.coachCopy?.includes('Day 4'));
    })()
  );

  check(
    'r38_onboarding_steps',
    'onboarding active steps day coach',
    (() => {
      const coach = buildOnboardingActiveStepsDayCoach({
        gameDay: 1,
        persisted: createDefaultEvolvingUiPersistedState(),
        nextGameDay: 1,
      });
      return coach.activeStepCount >= 1 && Boolean(coach.coachCopy?.includes('Day 1'));
    })()
  );

  check(
    'r38_legacy_plan',
    'legacy nav remember plan day coach',
    (() => {
      const plan = buildLegacyNavAutoRememberPlan(
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      const coach = buildLegacyNavRememberPlanDayCoach({ plan, nextGameDay: 5 });
      return plan.panelIdsToRemember.length === 0 || Boolean(coach.coachCopy?.includes('Day 5') || coach.coachCopy === null);
    })()
  );

  check(
    'r38_tick_show_all',
    'tick exposes show all override active day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true },
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.showAllOverrideActiveDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r38_tick_load_band',
    'tick exposes cognitive load band day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 6, turnCount: 6, interfaceLevel: 'expert' },
        { gameDay: 7, turnCount: 7, interfaceLevel: 'expert' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.cognitiveLoadBandDayCoachCopy === 'string' || r.cognitiveLoadBandDayCoachCopy === null;
    })()
  );

  check(
    'r38_tick_onboarding',
    'tick exposes onboarding active steps day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.onboardingActiveStepsDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r38_tick_legacy_plan',
    'tick exposes legacy nav remember plan day coach field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.legacyNavRememberPlanDayCoachCopy === 'string' || r.legacyNavRememberPlanDayCoachCopy === null;
    })()
  );

  check(
    'r38_show_all_off',
    'show all null when override off',
    (() => {
      const coach = buildShowAllOverrideActiveDayCoach({
        persisted: {},
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 2,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r38_load_light',
    'load band null when light',
    (() => {
      const coach = buildCognitiveLoadBandDayCoach({ band: 'light', nextGameDay: 1 });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r38_plan_empty',
    'legacy plan null when empty',
    (() => {
      const coach = buildLegacyNavRememberPlanDayCoach({
        plan: { entries: [], panelIdsToRemember: [], coachCopy: null },
        nextGameDay: 3,
      });
      return coach.coachCopy === null;
    })()
  );

  check(
    'r38_onboarding_dismissed',
    'onboarding steps null when all dismissed',
    (() => {
      const persisted = {
        ...createDefaultEvolvingUiPersistedState(),
        onboardingDismissedKeys: [
          'onboarding_map',
          'onboarding_economy',
          'onboarding_standing',
          'onboarding_advanced',
        ],
      };
      const coach = buildOnboardingActiveStepsDayCoach({
        gameDay: 10,
        persisted,
        nextGameDay: 10,
      });
      return coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
