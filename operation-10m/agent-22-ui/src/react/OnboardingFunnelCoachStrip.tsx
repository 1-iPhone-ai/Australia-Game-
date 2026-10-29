import React from 'react';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  listActiveOnboardingStepsForPersisted,
  onboardingFunnelStatusCopy,
} from '../engine/onboarding-persist-bridge.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface OnboardingFunnelCoachStripProps {
  signals: ProgressionSignalSnapshot;
  persisted: EvolvingUiPersistedState;
  accessibility: AccessibilitySettingsSnapshot;
  onDismissStep?: (stepId: string) => void;
}

export function OnboardingFunnelCoachStrip({
  signals,
  persisted,
  accessibility,
  onDismissStep,
}: OnboardingFunnelCoachStripProps): React.ReactElement | null {
  const steps = listActiveOnboardingStepsForPersisted(signals.gameDay, persisted);
  const headline = onboardingFunnelStatusCopy(steps);
  if (!headline) return null;

  return (
    <div
      data-testid="onboarding-funnel-coach-strip"
      role="complementary"
      aria-label="Onboarding funnel"
      className="text-xs border border-teal-500/30 rounded p-2 space-y-1"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <p>{headline}</p>
      {steps.slice(0, 2).map(step => (
        <div key={step.id} data-testid={`onboarding-step-${step.id}`}>
          <span>{step.coachMessage}</span>
          {onDismissStep ? (
            <button
              type="button"
              className="ml-2 underline"
              data-testid={`onboarding-dismiss-${step.id}`}
              onClick={() => onDismissStep(step.id)}
            >
              Got it
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
