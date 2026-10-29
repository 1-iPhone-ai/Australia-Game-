import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import { buildContextualQuickActionDayCoach } from './contextual-quick-action-day-coach.js';
import { buildNextUnlockRecommendationDayCoach } from './next-unlock-recommendation-day-coach.js';
import { buildMilestoneApproachingDayCoach } from './milestone-approaching-day-coach.js';
import { buildAccessibleChromeShellDayCoach } from './accessible-chrome-shell-day-coach.js';

export function runAgent22Round29SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r29_contextual_qa',
    'contextual quick action day coach on human_turn',
    (() => {
      const coach = buildContextualQuickActionDayCoach({
        phase: 'human_turn',
        gameDay: 3,
        nextGameDay: 3,
      });
      return coach.actionCount > 0 && Boolean(coach.coachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r29_next_unlock',
    'next unlock recommendation day coach on early day',
    (() => {
      const coach = buildNextUnlockRecommendationDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 1,
      });
      return coach.recommendationCount > 0 && Boolean(coach.coachCopy?.includes('Day 1'));
    })()
  );

  check(
    'r29_milestone_approaching',
    'milestone approaching day coach shape',
    (() => {
      const coach = buildMilestoneApproachingDayCoach({
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        nextGameDay: 2,
      });
      return coach.approachingCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Day 2'));
    })()
  );

  check(
    'r29_chrome_shell',
    'accessible chrome shell day coach on early day',
    (() => {
      const coach = buildAccessibleChromeShellDayCoach({
        accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
        interfaceLevel: 'simple',
        nextGameDay: 2,
      });
      return Boolean(coach.coachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r29_chrome_reduced_motion',
    'accessible chrome shell day coach with reduced motion',
    (() => {
      const coach = buildAccessibleChromeShellDayCoach({
        accessibility: { ...DEFAULT_ACCESSIBILITY_SNAPSHOT, reducedMotion: true },
        interfaceLevel: 'guided',
        nextGameDay: 10,
      });
      return coach.reducedMotion && Boolean(coach.coachCopy?.includes('reduced motion'));
    })()
  );

  check(
    'r29_tick_qa_field',
    'day advance exposes contextual quick action day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        { gameDay: 3, turnCount: 3, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.contextualQuickActionDayCoachCopy?.includes('Day 3'));
    })()
  );

  check(
    'r29_tick_unlock_rec_field',
    'day advance exposes next unlock recommendation day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.nextUnlockRecommendationDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r29_tick_milestone_field',
    'day advance exposes milestone approaching day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 4, turnCount: 4, interfaceLevel: 'guided' },
        { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return typeof r.milestoneApproachingDayCoachCopy === 'string' || r.milestoneApproachingDayCoachCopy === null;
    })()
  );

  check(
    'r29_tick_chrome_field',
    'day advance exposes accessible chrome shell day coach copy',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState(),
        { phase: 'human_turn' }
      );
      return Boolean(r.accessibleChromeShellDayCoachCopy?.includes('Day 2'));
    })()
  );

  check(
    'r29_qa_save_load',
    'contextual quick action day coach null on save_load',
    (() => {
      const coach = buildContextualQuickActionDayCoach({
        phase: 'save_load',
        gameDay: 5,
        nextGameDay: 5,
      });
      return coach.actionCount === 0 && coach.coachCopy === null;
    })()
  );

  check(
    'r29_next_unlock_nonempty',
    'next unlock recommendation includes headline',
    (() => {
      const coach = buildNextUnlockRecommendationDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        nextGameDay: 1,
      });
      return Boolean(coach.coachCopy?.includes('Next unlock focus'));
    })()
  );

  check(
    'r29_milestone_active',
    'milestone approaching day coach when milestones near',
    (() => {
      const coach = buildMilestoneApproachingDayCoach({
        signals: { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        nextGameDay: 1,
        limit: 3,
      });
      return coach.approachingCount >= 0 && (coach.coachCopy === null || coach.coachCopy.includes('Milestone'));
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
