import React, { useMemo } from 'react';
import { planKeyboardHintsDisplay } from '../engine/keyboard-hints-priority-plan.js';
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
  const display = useMemo(
    () => planKeyboardHintsDisplay(interfaceLevel, phase, 6),
    [interfaceLevel, phase]
  );
  if (!accessibility.keyboardNavigationHints || display.shortcuts.length === 0) return null;
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
      {display.coachCopy ? (
        <p data-testid="keyboard-hints-coach-copy" className="opacity-80">
          {display.coachCopy}
        </p>
      ) : null}
      {display.shortcuts.map(s => (
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
