import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';
import {
  planNavRailVisibleItems,
  responsiveNavRailCoachCopy,
} from './responsive-nav-rail-plan.js';

export interface ResponsiveNavRailDayCoach {
  overflowCount: number;
  coachCopy: string | null;
}

export function buildResponsiveNavRailDayCoach(input: {
  orderedPanelIds: string[];
  viewportWidthPx: number;
  layoutPreset?: V94LayoutPreset;
  densityTier?: UiDensityTier;
  sessionMemory?: SessionUiMemory;
  nextGameDay: number;
}): ResponsiveNavRailDayCoach {
  const plan = planNavRailVisibleItems({
    orderedPanelIds: input.orderedPanelIds,
    viewportWidthPx: input.viewportWidthPx,
    layoutPreset: input.layoutPreset,
    densityTier: input.densityTier,
    sessionMemory: input.sessionMemory,
  });
  const base = responsiveNavRailCoachCopy(plan);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    overflowCount: plan.overflowCount,
    coachCopy,
  };
}
