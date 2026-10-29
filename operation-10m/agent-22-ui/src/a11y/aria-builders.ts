import type { AccessibilitySettingsSnapshot, FocusRingClassOptions, FocusRingStyle } from '../types/accessibility.js';

const RING_CLASSES: Record<FocusRingStyle, string> = {
  emerald: 'focus-visible:ring-emerald-400',
  cyan: 'focus-visible:ring-cyan-400',
  amber: 'focus-visible:ring-amber-400',
  white: 'focus-visible:ring-white',
};

export function buildFocusRingClassName(options: FocusRingClassOptions): string {
  const base = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';
  const ring = RING_CLASSES[options.style] ?? RING_CLASSES.emerald;
  const contrast = options.highContrast ? ' focus-visible:ring-offset-4 focus-visible:ring-4' : '';
  return `${base} ${ring}${contrast}`;
}

export function buildProgressionPanelAria(input: {
  panelLabel: string;
  visibility: 'visible' | 'preview' | 'hidden';
  unlockHint?: string;
  disabled?: boolean;
}): Record<string, string | boolean | undefined> {
  const expanded = input.visibility === 'visible';
  const hidden = input.visibility === 'hidden';
  return {
    role: 'region',
    'aria-label': input.panelLabel,
    'aria-expanded': expanded,
    'aria-hidden': hidden || undefined,
    'aria-disabled': input.disabled || input.visibility === 'preview' || undefined,
    'aria-description': input.unlockHint,
  };
}

export function buildNavRailItemAria(input: {
  label: string;
  selected: boolean;
  preview: boolean;
  unlockHint?: string;
}): Record<string, string | boolean | undefined> {
  return {
    role: 'button',
    'aria-label': input.preview ? `${input.label} (preview — ${input.unlockHint ?? 'locked'})` : input.label,
    'aria-current': input.selected ? 'page' : undefined,
    'aria-disabled': input.preview || undefined,
  };
}

export function buildShowAllToggleAria(enabled: boolean): Record<string, string | boolean> {
  return {
    role: 'switch',
    'aria-checked': enabled,
    'aria-label': 'Show all interface panels regardless of progression',
  };
}

export function textScaleStyle(settings: AccessibilitySettingsSnapshot): Record<string, string> {
  const mult = settings.textScaleMultiplier;
  if (mult === 1) return {};
  return { fontSize: `${mult * 100}%` };
}
