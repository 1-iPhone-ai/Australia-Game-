import React, { useMemo } from 'react';
import { NAV_TARGET_PANELS } from '../registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility, sortPanelsForRail } from '../engine/resolve-panel-visibility.js';
import { buildNavRailItemAria, buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';

export interface EvolvingNavRailProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  selectedNavTarget?: string;
  onNavigate: (navTarget: string, panelId: string) => void;
}

export function EvolvingNavRail({
  signals,
  policy,
  accessibility,
  selectedNavTarget,
  onNavigate,
}: EvolvingNavRailProps): React.ReactElement {
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });
  const ordered = useMemo(() => {
    const ids = NAV_TARGET_PANELS.map(p => p.id);
    return sortPanelsForRail(ids, signals, policy);
  }, [signals, policy]);

  return (
    <nav aria-label="Primary game navigation" data-testid="evolving-nav-rail" className="flex flex-col gap-1">
      {ordered.map(id => {
        const panel = NAV_TARGET_PANELS.find(p => p.id === id);
        if (!panel?.navTarget) return null;
        const vis = resolveEvolvingPanelVisibility(id, signals, policy);
        if (vis.state === 'hidden') return null;
        const preview = vis.state === 'preview';
        const aria = buildNavRailItemAria({
          label: panel.label,
          selected: selectedNavTarget === panel.navTarget,
          preview,
          unlockHint: vis.reason,
        });
        return (
          <button
            key={id}
            type="button"
            {...aria}
            className={`text-left px-2 py-1 rounded ${focusClass} ${preview ? 'opacity-60 italic' : ''}`}
            onClick={() => onNavigate(panel.navTarget!, id)}
            data-testid={`evolving-nav-${panel.navTarget}`}
          >
            {panel.label}
          </button>
        );
      })}
    </nav>
  );
}
