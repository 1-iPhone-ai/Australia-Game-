import React from 'react';
import type { PhaseShellAttentionGatePlan } from '../engine/phase-shell-attention-gate.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface PhaseShellAttentionCoachStripProps {
  plan: PhaseShellAttentionGatePlan;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PhaseShellAttentionCoachStrip({
  plan,
  accessibility,
}: PhaseShellAttentionCoachStripProps): React.ReactElement | null {
  if (!plan.coachCopy) return null;

  return (
    <div
      data-testid="phase-shell-attention-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-phase={plan.phase}
      data-deferred-count={plan.deferredSurfaceCount}
    >
      {plan.coachCopy}
    </div>
  );
}
