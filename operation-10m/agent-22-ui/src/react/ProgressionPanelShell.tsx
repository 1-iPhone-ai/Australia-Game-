import React from 'react';
import { buildProgressionPanelAria, textScaleStyle } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { PanelVisibilityState } from '../types/progression.js';

export interface ProgressionPanelShellProps {
  panelLabel: string;
  visibility: PanelVisibilityState;
  unlockHint?: string;
  accessibility: AccessibilitySettingsSnapshot;
  children?: React.ReactNode;
  onActivate?: () => void;
}

export function ProgressionPanelShell({
  panelLabel,
  visibility,
  unlockHint,
  accessibility,
  children,
  onActivate,
}: ProgressionPanelShellProps): React.ReactElement {
  const aria = buildProgressionPanelAria({
    panelLabel,
    visibility,
    unlockHint,
    disabled: visibility === 'preview',
  });
  const style = textScaleStyle(accessibility);
  if (visibility === 'hidden') {
    return (
      <div {...aria} style={style} data-evolving-ui-state="hidden" data-testid="progression-panel-hidden" />
    );
  }
  return (
    <section {...aria} style={style} data-evolving-ui-state={visibility} data-testid="progression-panel-shell">
      {visibility === 'preview' && (
        <button type="button" className="text-xs opacity-80 underline" onClick={onActivate} data-testid="progression-panel-preview-activate">
          Preview: {panelLabel} — {unlockHint ?? 'Complete requirements to unlock'}
        </button>
      )}
      {visibility === 'visible' && children}
    </section>
  );
}
