import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { listActiveOnboardingStepsForPersisted } from './onboarding-persist-bridge.js';

export interface OnboardingActiveStepsDayCoach {
  activeStepCount: number;
  coachCopy: string | null;
}

export function buildOnboardingActiveStepsDayCoach(input: {
  gameDay: number;
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): OnboardingActiveStepsDayCoach {
  const steps = listActiveOnboardingStepsForPersisted(input.gameDay, input.persisted);
  if (!steps.length) {
    return { activeStepCount: 0, coachCopy: null };
  }
  const extra = steps.length > 1 ? ` (+${steps.length - 1} more)` : '';
  return {
    activeStepCount: steps.length,
    coachCopy: `Day ${input.nextGameDay}: Onboarding — ${steps[0].title}${extra}.`,
  };
}
