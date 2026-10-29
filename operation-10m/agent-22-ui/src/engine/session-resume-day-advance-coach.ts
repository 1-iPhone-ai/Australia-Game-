import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import { buildSessionResumeCoachPlan } from './session-resume-coach.js';

export interface SessionResumeDayAdvanceCoach {
  shouldMentionResume: boolean;
  navTarget: string | null;
  coachCopy: string | null;
}

export function buildSessionResumeDayAdvanceCoach(input: {
  priorGameDay: number;
  nextGameDay: number;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  sessionMemory?: SessionUiMemory;
  phaseAllowsResume?: boolean;
}): SessionResumeDayAdvanceCoach {
  if (input.nextGameDay <= input.priorGameDay) {
    return { shouldMentionResume: false, navTarget: null, coachCopy: null };
  }

  const plan = buildSessionResumeCoachPlan({
    memory: input.sessionMemory,
    signals: input.signals,
    policy: input.policy,
    accessibility: input.accessibility,
    phaseAllowsResume: input.phaseAllowsResume ?? true,
  });

  if (!plan.shouldShow || !plan.navTarget) {
    return { shouldMentionResume: false, navTarget: null, coachCopy: null };
  }

  return {
    shouldMentionResume: true,
    navTarget: plan.navTarget,
    coachCopy: `Day ${input.nextGameDay}: ${plan.coachCopy ?? 'Resume your last panel from session memory.'}`,
  };
}
