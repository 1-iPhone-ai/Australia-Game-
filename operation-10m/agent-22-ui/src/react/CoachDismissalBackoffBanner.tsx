import React from 'react';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import {
  coachDismissalQuietCopy,
  isCoachDismissalQuiet,
  mergeCoachDismissalIntoPersisted,
  recordCoachDismissal,
} from '../engine/coach-dismissal-backoff.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CoachDismissalBackoffBannerProps {
  signals: ProgressionSignalSnapshot;
  persisted: EvolvingUiPersistedState;
  accessibility: AccessibilitySettingsSnapshot;
  onPersist?: (next: EvolvingUiPersistedState) => void;
}

export function CoachDismissalBackoffBanner({
  signals,
  persisted,
  accessibility,
  onPersist,
}: CoachDismissalBackoffBannerProps): React.ReactElement | null {
  const quiet = isCoachDismissalQuiet(persisted, signals.gameDay);
  const quietUntil = persisted.coachDismissalQuietUntilDay;
  if (!quiet || quietUntil == null) return null;

  const copy = coachDismissalQuietCopy(quietUntil, signals.gameDay);
  if (!copy) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="coach-dismissal-backoff-banner"
      data-dismissal-streak={persisted.coachDismissalStreak ?? 0}
      role="status"
      aria-live="polite"
      className="text-xs border rounded p-2 opacity-90"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <p>{copy}</p>
      {onPersist ? (
        <button
          type="button"
          className={`underline ${focusClass}`}
          data-testid="coach-dismissal-extend-quiet"
          onClick={() =>
            onPersist(mergeCoachDismissalIntoPersisted(persisted, recordCoachDismissal(persisted, signals.gameDay)))
          }
        >
          Keep coaching quiet longer
        </button>
      ) : null}
    </div>
  );
}
