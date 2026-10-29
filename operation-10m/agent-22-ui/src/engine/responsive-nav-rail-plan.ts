import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { deriveResponsiveLayoutHints, type ResponsiveLayoutHints } from './responsive-layout-hints.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';

export interface NavRailVisibilityPlan {
  visiblePanelIds: string[];
  overflowCount: number;
  overflowCopy: string | null;
  hints: ResponsiveLayoutHints;
}

export function planNavRailVisibleItems(input: {
  orderedPanelIds: string[];
  viewportWidthPx: number;
  layoutPreset?: V94LayoutPreset;
  densityTier?: UiDensityTier;
  sessionMemory?: SessionUiMemory;
  pinnedPanelIds?: string[];
}): NavRailVisibilityPlan {
  const hints = deriveResponsiveLayoutHints({
    viewportWidthPx: input.viewportWidthPx,
    layoutPreset: input.layoutPreset,
    densityTier: input.densityTier,
  });

  const mustInclude = new Set<string>(input.pinnedPanelIds ?? []);
  if (input.sessionMemory?.lastNavTarget) {
    for (const id of input.orderedPanelIds) {
      const panel = EVOLVING_UI_PANEL_BY_ID[id];
      if (panel?.navTarget === input.sessionMemory.lastNavTarget) mustInclude.add(id);
    }
  }
  for (const id of input.sessionMemory?.recentPanelIds ?? []) {
    mustInclude.add(id);
  }

  const cap = hints.maxVisibleRailItems;
  const visible: string[] = [];
  for (const id of input.orderedPanelIds) {
    if (mustInclude.has(id) && !visible.includes(id)) visible.push(id);
  }
  for (const id of input.orderedPanelIds) {
    if (visible.length >= cap) break;
    if (!visible.includes(id)) visible.push(id);
  }

  const overflowCount = Math.max(0, input.orderedPanelIds.length - visible.length);
  const overflowCopy =
    overflowCount > 0
      ? `${overflowCount} navigation destinations tucked into overflow for this viewport.`
      : null;

  return { visiblePanelIds: visible, overflowCount, overflowCopy, hints };
}

export function responsiveNavRailCoachCopy(plan: NavRailVisibilityPlan): string | null {
  if (plan.overflowCount <= 0) return plan.hints.coachSummary;
  return `${plan.hints.coachSummary} ${plan.overflowCopy ?? ''}`.trim();
}
