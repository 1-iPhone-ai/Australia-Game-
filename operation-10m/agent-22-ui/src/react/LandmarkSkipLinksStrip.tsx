import React from 'react';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  landmarkTargetForSurface,
  planLandmarkReadingOrder,
} from '../engine/landmark-reading-order.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface LandmarkSkipLinksStripProps {
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
  /** id/label pairs for primary shells currently mounted. */
  surfaces: Array<{ id: string; label: string; visible?: boolean }>;
}

export function LandmarkSkipLinksStrip({
  phase,
  accessibility,
  surfaces,
}: LandmarkSkipLinksStripProps): React.ReactElement | null {
  if (!accessibility.screenReaderAnnouncements && !accessibility.keyboardNavigationHints) {
    return null;
  }

  const landmarks = surfaces.map((s, index) =>
    landmarkTargetForSurface(s.id, s.label, s.visible !== false, index + 1)
  );
  const plan = planLandmarkReadingOrder({ phase, landmarks });
  if (plan.skipLinkLabels.length === 0) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <nav
      data-testid="landmark-skip-links"
      aria-label="Skip links"
      className="flex flex-wrap gap-2 text-xs sr-only focus-within:not-sr-only"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {plan.skipLinkLabels.map(label => (
        <a key={label} href={`#${label.replace(/\s+/g, '-').toLowerCase()}`} className={focusClass}>
          {label}
        </a>
      ))}
    </nav>
  );
}
