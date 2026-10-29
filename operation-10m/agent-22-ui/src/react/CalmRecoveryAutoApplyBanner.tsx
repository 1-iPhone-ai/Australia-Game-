import React from 'react';
import type { DayAdvanceUiEvolutionResult } from '../sim/evolution-hooks.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CalmRecoveryAutoApplyBannerProps {
  result: Pick<DayAdvanceUiEvolutionResult, 'calmRecoveryAutoApplied' | 'calmRecoveryHintCopy'>;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CalmRecoveryAutoApplyBanner({
  result,
  accessibility,
}: CalmRecoveryAutoApplyBannerProps): React.ReactElement | null {
  if (!result.calmRecoveryAutoApplied && !result.calmRecoveryHintCopy) return null;

  return (
    <div
      data-testid="calm-recovery-auto-apply-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-500/40 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-auto-applied={result.calmRecoveryAutoApplied ? 'true' : 'false'}
    >
      {result.calmRecoveryHintCopy}
    </div>
  );
}
