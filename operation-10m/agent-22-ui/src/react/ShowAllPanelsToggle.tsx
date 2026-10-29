import React from 'react';
import { buildShowAllToggleAria, buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface ShowAllPanelsToggleProps {
  enabled: boolean;
  accessibility: AccessibilitySettingsSnapshot;
  onChange: (enabled: boolean) => void;
}

export function ShowAllPanelsToggle({ enabled, accessibility, onChange }: ShowAllPanelsToggleProps): React.ReactElement {
  const aria = buildShowAllToggleAria(enabled);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  return (
    <button
      type="button"
      {...aria}
      className={`px-2 py-1 rounded border ${focusClass}`}
      onClick={() => onChange(!enabled)}
      data-testid="show-all-panels-toggle"
    >
      {enabled ? 'Showing all panels' : 'Progressive panels'}
    </button>
  );
}
