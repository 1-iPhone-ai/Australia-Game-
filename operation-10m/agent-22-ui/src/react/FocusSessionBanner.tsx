import React from 'react';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  focusSessionCoachCopy,
  listPanelsSuppressedByFocusSession,
  shouldActivateFocusSession,
  snoozeFocusSessionUntilDay,
} from '../engine/focus-session-policy.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface FocusSessionBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
  accessibility: AccessibilitySettingsSnapshot;
  onSnooze?: (untilDay: number) => void;
}

export function FocusSessionBanner({
  phase,
  signals,
  policy,
  focusSessionSnoozedUntilDay,
  accessibility,
  onSnooze,
}: FocusSessionBannerProps): React.ReactElement | null {
  const ctx = { phase, signals, policy, focusSessionSnoozedUntilDay };
  if (!shouldActivateFocusSession(ctx)) return null;
  const copy = focusSessionCoachCopy(ctx);
  const suppressed = listPanelsSuppressedByFocusSession(signals, policy, phase, focusSessionSnoozedUntilDay);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="focus-session-banner"
      role="status"
      aria-live="polite"
      className="text-sm border border-amber-500/40 rounded p-2"
    >
      <p>{copy}</p>
      {suppressed.length > 0 ? (
        <p className="text-xs opacity-80" data-testid="focus-session-suppressed-count">
          {suppressed.length} advanced panels tucked away for now.
        </p>
      ) : null}
      <button
        type="button"
        className={focusClass}
        data-testid="focus-session-snooze"
        onClick={() => onSnooze?.(snoozeFocusSessionUntilDay(signals.gameDay))}
      >
        Snooze focus mode
      </button>
    </div>
  );
}
