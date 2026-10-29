import React from 'react';
import type { CalmRecoveryExpiryDayHint } from '../engine/calm-recovery-expiry-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CalmRecoveryExpiryDayHintStripProps {
  hint: CalmRecoveryExpiryDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CalmRecoveryExpiryDayHintStrip({
  hint,
  accessibility,
}: CalmRecoveryExpiryDayHintStripProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="calm-recovery-expiry-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-expires-today={hint.expiresToday ? 'true' : 'false'}
      data-expires-tomorrow={hint.expiresTomorrow ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
