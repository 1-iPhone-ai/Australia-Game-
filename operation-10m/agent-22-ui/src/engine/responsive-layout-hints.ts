import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';

export type ViewportBand = 'narrow' | 'medium' | 'wide';

export interface ResponsiveLayoutHints {
  band: ViewportBand;
  collapseNavRail: boolean;
  stackQuickActions: boolean;
  maxVisibleRailItems: number;
  showDensityControl: boolean;
  coachSummary: string;
}

export function classifyViewportWidth(px: number): ViewportBand {
  if (px < 720) return 'narrow';
  if (px < 1100) return 'medium';
  return 'wide';
}

export function deriveResponsiveLayoutHints(input: {
  viewportWidthPx: number;
  layoutPreset?: V94LayoutPreset;
  densityTier?: UiDensityTier;
}): ResponsiveLayoutHints {
  const band = classifyViewportWidth(input.viewportWidthPx);
  const preset = input.layoutPreset ?? 'Assisted';
  const density = input.densityTier ?? 'comfortable';

  const collapseNavRail = band === 'narrow' || (band === 'medium' && preset === 'Developer');
  const stackQuickActions = band !== 'wide' || density === 'compact';
  let maxVisibleRailItems = band === 'wide' ? 12 : band === 'medium' ? 8 : 5;
  if (density === 'compact') maxVisibleRailItems += 1;
  if (density === 'spacious' && band === 'narrow') maxVisibleRailItems = Math.max(4, maxVisibleRailItems - 1);

  const coachSummary =
    band === 'narrow'
      ? 'Narrow viewport: navigation collapses into a compact rail.'
      : band === 'medium'
        ? 'Medium viewport: quick actions stack below the nav rail.'
        : 'Wide viewport: full rail and quick-action row visible.';

  return {
    band,
    collapseNavRail,
    stackQuickActions,
    maxVisibleRailItems,
    showDensityControl: band !== 'narrow' || preset !== 'Clean',
    coachSummary,
  };
}
