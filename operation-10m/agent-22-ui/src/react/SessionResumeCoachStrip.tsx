import React from 'react';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import {
  buildSessionResumeCoachPlan,
  sessionResumeSkipLinkLabel,
} from '../engine/session-resume-coach.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';

export interface SessionResumeCoachStripProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  memory?: SessionUiMemory;
  phaseAllowsResume?: boolean;
  onResume?: (navTarget: string) => void;
}

export function SessionResumeCoachStrip({
  signals,
  policy,
  accessibility,
  memory,
  phaseAllowsResume,
  onResume,
}: SessionResumeCoachStripProps): React.ReactElement | null {
  const plan = buildSessionResumeCoachPlan({
    memory,
    signals,
    policy,
    accessibility,
    phaseAllowsResume,
  });

  if (!plan.shouldShow || !plan.navTarget || !plan.coachCopy) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  const skipLabel = sessionResumeSkipLinkLabel(plan);

  return (
    <div
      data-testid="session-resume-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-500/30 rounded p-2 space-y-1"
    >
      <p>{plan.coachCopy}</p>
      {skipLabel ? (
        <a
          href={`#${plan.focusSelector?.replace(/^\[#?/, '').replace(/\]$/, '') ?? plan.navTarget}`}
          className={`underline ${focusClass}`}
          data-testid="session-resume-skip-link"
          onClick={e => {
            if (onResume) {
              e.preventDefault();
              onResume(plan.navTarget!);
            }
          }}
        >
          {skipLabel}
        </a>
      ) : null}
    </div>
  );
}
