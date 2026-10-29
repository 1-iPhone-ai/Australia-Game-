import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

export interface HighContrastChromeProfile {
  elevated: boolean;
  borderWidthPx: number;
  separatorOpacity: number;
  focusOffsetPx: number;
  dataAttributes: Record<string, string>;
}

export function resolveHighContrastChromeProfile(
  accessibility: AccessibilitySettingsSnapshot
): HighContrastChromeProfile {
  const elevated =
    accessibility.highContrastFocusRings ||
    accessibility.textScaleMultiplier >= 1.15 ||
    accessibility.announceVerbosity === 'assertive';

  const scaleBoost = accessibility.textScaleMultiplier > 1 ? 1 : 0;
  const borderWidthPx = elevated ? 2 + scaleBoost : 1;
  const separatorOpacity = elevated ? 0.55 : 0.28;
  const focusOffsetPx = elevated ? 4 : 2;

  return {
    elevated,
    borderWidthPx,
    separatorOpacity,
    focusOffsetPx,
    dataAttributes: {
      'data-hc-chrome': elevated ? 'elevated' : 'standard',
      'data-hc-border-px': String(borderWidthPx),
    },
  };
}

export function highContrastChromeCssVars(profile: HighContrastChromeProfile): Record<string, string> {
  return {
    '--evolving-ui-chrome-border-px': String(profile.borderWidthPx),
    '--evolving-ui-chrome-separator-opacity': String(profile.separatorOpacity),
    '--evolving-ui-chrome-focus-offset-px': String(profile.focusOffsetPx),
  };
}

export function mergeHighContrastChromeStyle(
  accessibility: AccessibilitySettingsSnapshot,
  baseStyle?: Record<string, string>
): Record<string, string> {
  const profile = resolveHighContrastChromeProfile(accessibility);
  return {
    ...(baseStyle ?? {}),
    ...highContrastChromeCssVars(profile),
  };
}
