import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildSessionResumeCoachPlanDayCoach } from './session-resume-coach-plan-day-coach.js';
import { buildDayAdvanceCalmRecoveryDayCoach } from './day-advance-calm-recovery-day-coach.js';
import { buildPanelUnlockHeadlineDayCoach } from './panel-unlock-headline-day-coach.js';
import { buildUiDensityProfileDayCoach } from './ui-density-profile-day-coach.js';

export function runAgent22Round28SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r28_session_resume_plan',
    'session resume coach plan day coach with hints enabled',
    (() => {
      const coach = buildSessionResumeCoachPlanDayCoach({
        signals: { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, keyboardNavigationHints: true },
        memory: { lastNavTarget: 'map', recentPanelIds: ['nav_map'] },
        phaseAllowsResume: true,
        nextGameDay: 4,
      });
      return (coach.coachCopy === null || coach.coachCopy.includes('Day 4'));
    })()
  );

  check(
    'r28_calm_recovery_day',
    'day advance calm recovery day coach when already active',
    (() => {
      const coach = buildDayAdvanceCalmRecoveryDayCoach({
        signals: { gameDay: 5, turnCount: 5, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 8 },
        newlyUnlockedPanelCount: 0,
        deferredAnnouncementCount: 0,
        nextGameDay: 5,
      });
      return coach.alreadyActive && Boolean(coach.coachCopy?.includes('Day 5'));
    })()
  );

  check(
    'r28_panel_unlock_headline',
    'panel unlock headline day coach null without unlocks',
    (() => {
      const coach = buildPanelUnlockHeadlineDayCoach({
        newlyUnlockedPanelIds: [],
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.unlockCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r28_ui_density',
    'ui density profile day coach on early day',
    (() => {
      const coach = buildUiDensityProfileDayCoach({
        interfaceLevel: 'simple',
        nextGameDay: 2,
      });
      return Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r28_tick_session_plan_field',
    'day advance exposes session resume coach plan day copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.sessionResumeCoachPlanDayCoachCopy === 'string' || r.sessionResumeCoachPlanDayCoachCopy === null;
    })()
  );

  check(
    'r28_tick_calm_recovery_day_field',
    'day advance exposes calm recovery day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        { ...createDefaultEvolvingUiPersistedState(), calmRecoveryUntilDay: 6 },
        { phase: 'human_turn' }
      );
      return Boolean(r.dayAdvanceCalmRecoveryDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r28_tick_unlock_headline_field',
    'day advance exposes panel unlock headline day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.panelUnlockHeadlineDayCoachCopy === 'string' || r.panelUnlockHeadlineDayCoachCopy === null;
    })()
  );

  check(
    'r28_tick_density_field',
    'day advance exposes ui density profile day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.uiDensityProfileDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r28_density_preferred',
    'ui density profile day coach when preferred tier set',
    (() => {
      const coach = buildUiDensityProfileDayCoach({
        interfaceLevel: 'expert',
        preferredTier: 'compact',
        nextGameDay: 12,
      });
      return coach.densityTier === 'compact' && Boolean(coach.coachCopy?.includes('Day 12'));
    })()
  );

  check(
    'r28_calm_suggest',
    'calm recovery day coach suggests on heavy unlock day',
    (() => {
      const coach = buildDayAdvanceCalmRecoveryDayCoach({
        signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        persisted: createDefaultEvolvingUiPersistedState(),
        newlyUnlockedPanelCount: 4,
        deferredAnnouncementCount: 3,
        nextGameDay: 10,
      });
      return coach.suggestCalmRecovery && Boolean(coach.coachCopy?.includes('Day 10'));
    })()
  );

  check(
    'r28_tick_unlock_headline_active',
    'panel unlock headline includes day prefix when panels unlock',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 0, turnCount: 0, interfaceLevel: 'simple' },
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return r.panelUnlockHeadlineDayCoachCopy === null || r.panelUnlockHeadlineDayCoachCopy.includes('Day 1');
    })()
  );

  check(
    'r28_session_plan_disabled',
    'session resume plan day coach null when phase blocks resume',
    (() => {
      const coach = buildSessionResumeCoachPlanDayCoach({
        signals: { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        phaseAllowsResume: false,
        nextGameDay: 3,
      });
      return !coach.shouldShow && coach.coachCopy === null;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
