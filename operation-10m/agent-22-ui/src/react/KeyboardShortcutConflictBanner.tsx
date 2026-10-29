import React from 'react';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  planKeyboardShortcutConflicts,
  shortcutConflictWarningCopy,
} from '../engine/keyboard-shortcut-conflict-guard.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface KeyboardShortcutConflictBannerProps {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function KeyboardShortcutConflictBanner({
  interfaceLevel,
  phase,
  accessibility,
}: KeyboardShortcutConflictBannerProps): React.ReactElement | null {
  const conflicts = planKeyboardShortcutConflicts(interfaceLevel, phase);
  const copy = shortcutConflictWarningCopy(conflicts);
  if (!copy) return null;

  return (
    <div
      data-testid="keyboard-shortcut-conflict-banner"
      role="alert"
      className="text-xs border border-amber-500/40 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
