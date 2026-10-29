import React, { useMemo } from 'react';
import { listAvailableKeyboardShortcuts } from '../engine/keyboard-shortcut-progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';

export interface KeyboardHintsOverlayProps {
  interfaceLevel: InterfaceExperienceLevel;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
  onInvoke?: (shortcutId: string, navTarget: string | null) => void;
}

export function KeyboardHintsOverlay({
  interfaceLevel,
  phase,
  accessibility,
  onInvoke,
}: KeyboardHintsOverlayProps): React.ReactElement | null {
  const shortcuts = useMemo(
    () => listAvailableKeyboardShortcuts(interfaceLevel, phase),
    [interfaceLevel, phase]
  );
  if (!accessibility.keyboardNavigationHints || shortcuts.length === 0) return null;
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="keyboard-hints-overlay"
      role="complementary"
      aria-label="Keyboard shortcuts"
      className="text-xs opacity-90 space-y-0.5"
    >
      {shortcuts.slice(0, 6).map(s => (
        <button
          key={s.id}
          type="button"
          className={`block text-left ${focusClass}`}
          onClick={() => onInvoke?.(s.id, s.navTarget ?? null)}
          data-testid={`kb-hint-${s.id}`}
        >
          <kbd>{s.keys}</kbd> — {s.actionLabel}
        </button>
      ))}
    </div>
  );
}
