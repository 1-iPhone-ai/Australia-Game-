import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  modalFocusTrapCoachCopy,
  planModalFocusTrapStatus,
} from '../engine/modal-focus-trap-registry.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ModalFocusTrapStatusStripProps {
  openModalId: string | null;
  lastNavTarget: string | null;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ModalFocusTrapStatusStrip({
  openModalId,
  lastNavTarget,
  accessibility,
}: ModalFocusTrapStatusStripProps): React.ReactElement | null {
  const { skipLabel } = planModalFocusTrapStatus({ openModalId, lastNavTarget, accessibility });
  const copy = modalFocusTrapCoachCopy(openModalId);
  if (!copy) return null;

  return (
    <div
      data-testid="modal-focus-trap-status-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-stone-500/35 rounded p-2 space-y-1"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      <p>{copy}</p>
      {skipLabel ? <p className="opacity-80">{skipLabel}</p> : null}
    </div>
  );
}
