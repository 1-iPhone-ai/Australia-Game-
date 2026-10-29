import { listActiveOnboardingSteps } from '../sim/onboarding-funnel.js';

export interface OnboardingFunnelDayHint {
  activeStepCount: number;
  coachCopy: string | null;
}

export function buildOnboardingFunnelDayHint(input: {
  nextGameDay: number;
  dismissedKeys: string[];
}): OnboardingFunnelDayHint {
  const active = listActiveOnboardingSteps(input.nextGameDay, input.dismissedKeys);
  if (!active.length) {
    return { activeStepCount: 0, coachCopy: null };
  }

  const step = active[0];
  return {
    activeStepCount: active.length,
    coachCopy: `Day ${input.nextGameDay}: ${step.coachMessage}`,
  };
}
