import React, { useMemo } from 'react';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94LayoutPreset } from '../engine/layout-preset-evolution.js';
import {
  cycleUiDensityTier,
  listEligibleDensityTiers,
  resolveUiDensityProfile,
  type UiDensityTier,
} from '../engine/ui-density-progression.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface UiDensitySelectorProps {
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: V94LayoutPreset;
  textScaleMultiplier?: number;
  value?: UiDensityTier | null;
  accessibility: AccessibilitySettingsSnapshot;
  onChange?: (tier: UiDensityTier) => void;
}

export function UiDensitySelector({
  interfaceLevel,
  layoutPreset,
  textScaleMultiplier,
  value,
  accessibility,
  onChange,
}: UiDensitySelectorProps): React.ReactElement {
  const profile = useMemo(
    () =>
      resolveUiDensityProfile({
        interfaceLevel,
        layoutPreset,
        textScaleMultiplier,
        preferredTier: value,
      }),
    [interfaceLevel, layoutPreset, textScaleMultiplier, value]
  );
  const eligible = listEligibleDensityTiers(interfaceLevel);
  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div data-testid="ui-density-selector" role="group" aria-label="Interface density" className="flex gap-1">
      {eligible.map(tier => (
        <button
          key={tier}
          type="button"
          className={focusClass}
          aria-pressed={profile.tier === tier}
          data-testid={`density-${tier}`}
          onClick={() => onChange?.(tier)}
        >
          {tier}
        </button>
      ))}
      <button
        type="button"
        className={focusClass}
        data-testid="density-cycle"
        aria-label="Cycle density"
        onClick={() => onChange?.(cycleUiDensityTier(profile.tier, interfaceLevel))}
      >
        Cycle
      </button>
    </div>
  );
}
