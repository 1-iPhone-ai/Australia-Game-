import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  modalFocusRestoreSkipLabel,
  resolveModalFocusRestorePlan,
} from '../engine/modal-focus-restoration.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';

export interface ModalFocusRestoreStripProps {
  modalId: string;
  lastNavTarget?: string | null;
  accessibility: AccessibilitySettingsSnapshot;
  onSkipToRestore?: (selector: string) => void;
}

export function ModalFocusRestoreStrip({
  modalId,
  lastNavTarget,
  accessibility,
  onSkipToRestore,
}: ModalFocusRestoreStripProps): React.ReactElement | null {
  const plan = resolveModalFocusRestorePlan({ modalId, lastNavTarget, accessibility });
  if (!plan.restoreEnabled) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="modal-focus-restore-strip"
      className="text-xs flex flex-wrap gap-2 items-center"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <span>{modalFocusRestoreSkipLabel(plan)}</span>
      <button
        type="button"
        className={focusClass}
        data-testid="modal-focus-restore-skip"
        data-restore-selector={plan.restoreSelector}
        onClick={() => onSkipToRestore?.(plan.restoreSelector)}
      >
        Jump to restore target
      </button>
      {plan.trapEnabled ? (
        <span className="opacity-70" data-testid="modal-focus-trap-hint">
          Focus is trapped inside this dialog.
        </span>
      ) : null}
    </div>
  );
}
