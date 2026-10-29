import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  applyOnboardingDismissal,
  listActiveOnboardingSteps,
  type OnboardingFunnelStep,
} from '../sim/onboarding-funnel.js';

export function mergeOnboardingDismissalsIntoPersisted(
  persisted: EvolvingUiPersistedState,
  dismissedKeys: string[]
): EvolvingUiPersistedState {
  return {
    ...persisted,
    onboardingDismissedKeys: [...new Set([...(persisted.onboardingDismissedKeys ?? []), ...dismissedKeys])],
  };
}

export function dismissOnboardingStepInPersisted(
  persisted: EvolvingUiPersistedState,
  stepId: string
): EvolvingUiPersistedState {
  const result = applyOnboardingDismissal(
    stepId,
    persisted.onboardingDismissedKeys ?? [],
    persisted.rememberedPanelIds ?? []
  );
  return {
    ...persisted,
    onboardingDismissedKeys: result.dismissedKeys,
    rememberedPanelIds: result.rememberedPanelIds,
  };
}

export function listActiveOnboardingStepsForPersisted(
  gameDay: number,
  persisted: EvolvingUiPersistedState
): OnboardingFunnelStep[] {
  return listActiveOnboardingSteps(gameDay, persisted.onboardingDismissedKeys ?? []);
}

export function onboardingFunnelStatusCopy(steps: OnboardingFunnelStep[]): string | null {
  if (!steps.length) return null;
  if (steps.length === 1) return `Onboarding: ${steps[0].title}`;
  return `Onboarding: ${steps.length} guided steps remain (${steps[0].title}…)`;
}

export function onboardingHighlightedPanelIds(
  gameDay: number,
  persisted: EvolvingUiPersistedState
): string[] {
  const active = listActiveOnboardingStepsForPersisted(gameDay, persisted);
  return [...new Set(active.flatMap(s => s.unlocksPanelIds))];
}
