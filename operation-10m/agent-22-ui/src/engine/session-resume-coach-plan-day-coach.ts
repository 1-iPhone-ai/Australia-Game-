import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import { buildSessionResumeCoachPlan } from './session-resume-coach.js';

export interface SessionResumeCoachPlanDayCoach {
  shouldShow: boolean;
  navTarget: string | null;
  coachCopy: string | null;
}

export function buildSessionResumeCoachPlanDayCoach(input: {
  memory?: SessionUiMemory;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  phaseAllowsResume?: boolean;
  nextGameDay: number;
}): SessionResumeCoachPlanDayCoach {
  const plan = buildSessionResumeCoachPlan({
    memory: input.memory,
    signals: input.signals,
    policy: input.policy,
    accessibility: input.accessibility,
    phaseAllowsResume: input.phaseAllowsResume,
  });
  const coachCopy = plan.coachCopy ? `Day ${input.nextGameDay}: ${plan.coachCopy}` : null;
  return {
    shouldShow: plan.shouldShow,
    navTarget: plan.navTarget,
    coachCopy,
  };
}
