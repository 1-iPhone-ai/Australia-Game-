import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import {
  createDefaultEvolvingUiPersistedState,
  tickEvolvingUiOnDayAdvance,
} from '../sim/evolution-hooks.js';
import {
  forecastUpcomingMilestones,
  findMilestoneById,
  milestoneForecastCoachCopy,
} from './milestone-forecast-coach.js';
import {
  buildGuidedLearningPanelHints,
  countIntroducedGuidedConcepts,
  guidedLearningPanelCoachCopy,
} from './guided-learning-panel-bridge.js';
import { summarizeFocusSessionSuppression } from './focus-session-suppression-summary.js';
import {
  buildCoachLandmarkReadingPlan,
  landmarkReadingCoachCopy,
} from './landmark-coach-plan.js';

export function runAgent22Round14SelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'r14_milestone_forecast',
    'forecast lists upcoming milestones',
    forecastUpcomingMilestones({ gameDay: 1, turnCount: 1, interfaceLevel: 'simple' }).length >= 1
  );

  check(
    'r14_milestone_copy',
    'milestone forecast copy mentions next',
    Boolean(
      milestoneForecastCoachCopy(
        forecastUpcomingMilestones({ gameDay: 1, turnCount: 1, interfaceLevel: 'simple' })
      )?.includes('Next') ||
        milestoneForecastCoachCopy(
          forecastUpcomingMilestones({ gameDay: 1, turnCount: 1, interfaceLevel: 'simple' })
        )?.includes('Up next')
    )
  );

  check(
    'r14_milestone_lookup',
    'find milestone by id',
    findMilestoneById('first_market_visit')?.title === 'First market visit'
  );

  check(
    'r14_guided_hints',
    'guided learning hints for introduced concept',
    (() => {
      const hints = buildGuidedLearningPanelHints({
        gameDay: 5,
        turnCount: 5,
        interfaceLevel: 'guided',
        guidedConceptStatuses: { capital_allocation: 'introduced' },
      });
      return hints.length === 1 && hints[0].panelIds.includes('nav_investments');
    })()
  );

  check(
    'r14_guided_copy',
    'guided learning coach copy present',
    Boolean(
      guidedLearningPanelCoachCopy(
        buildGuidedLearningPanelHints({
          gameDay: 5,
          turnCount: 5,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { liquidity: 'mastered' },
        })
      )?.includes('mastered')
    )
  );

  check(
    'r14_guided_count',
    'count introduced guided concepts',
    countIntroducedGuidedConcepts({
      gameDay: 2,
      turnCount: 2,
      interfaceLevel: 'guided',
      guidedConceptStatuses: { capital_allocation: 'introduced', liquidity: 'locked' },
    }) === 1
  );

  check(
    'r14_focus_summary_active',
    'focus session summary on early guided day',
    (() => {
      const summary = summarizeFocusSessionSuppression({
        phase: 'human_turn',
        signals: { gameDay: 2, turnCount: 2, interfaceLevel: 'guided' },
        policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
      });
      return summary.active && summary.suppressedCount >= 0;
    })()
  );

  check(
    'r14_focus_summary_inactive_late',
    'focus session inactive after day 7',
    !summarizeFocusSessionSuppression({
      phase: 'human_turn',
      signals: { gameDay: 10, turnCount: 10, interfaceLevel: 'guided' },
      policy: DEFAULT_EVOLVING_UI_ACCESS_POLICY,
    }).active
  );

  check(
    'r14_landmark_plan',
    'coach landmark plan yields skip labels',
    buildCoachLandmarkReadingPlan('human_turn').skipLinkLabels.length >= 2
  );

  check(
    'r14_landmark_copy',
    'landmark reading coach mentions screen reader',
    Boolean(landmarkReadingCoachCopy(buildCoachLandmarkReadingPlan('human_turn'))?.includes('Screen reader'))
  );

  check(
    'r14_tick_milestone_field',
    'day advance exposes milestone forecast copy field',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
        { gameDay: 2, turnCount: 2, interfaceLevel: 'simple' },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return typeof r.milestoneForecastCoachCopy === 'string' || r.milestoneForecastCoachCopy === null;
    })()
  );

  check(
    'r14_tick_guided_count',
    'day advance reports guided concept count',
    (() => {
      const r = tickEvolvingUiOnDayAdvance(
        { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
        {
          gameDay: 2,
          turnCount: 2,
          interfaceLevel: 'guided',
          guidedConceptStatuses: { capital_allocation: 'introduced' },
        },
        DEFAULT_EVOLVING_UI_ACCESS_POLICY,
        createDefaultEvolvingUiPersistedState()
      );
      return r.guidedLearningConceptCount === 1;
    })()
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
