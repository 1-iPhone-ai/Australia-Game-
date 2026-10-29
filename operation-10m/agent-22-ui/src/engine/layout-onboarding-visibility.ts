import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import { resolveEvolvingPanelVisibilityWithLayout } from './layout-aware-visibility.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import { onboardingHighlightedPanelIds } from './onboarding-persist-bridge.js';

export interface LayoutOnboardingVisibilityHint {
  panelId: string;
  state: 'visible' | 'preview' | 'hidden';
  onboardingHighlight: boolean;
  layoutBlocked: boolean;
}

export function buildLayoutOnboardingVisibilityHints(input: {
  panelIds: string[];
  layoutPreset: V94LayoutPreset | undefined;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
}): LayoutOnboardingVisibilityHint[] {
  const highlights = new Set(onboardingHighlightedPanelIds(input.signals.gameDay, input.persisted));

  return input.panelIds.map(panelId => {
    const vis = resolveEvolvingPanelVisibilityWithLayout(
      panelId,
      input.layoutPreset,
      input.signals,
      input.policy
    );
    return {
      panelId,
      state: vis.state,
      onboardingHighlight: highlights.has(panelId),
      layoutBlocked: vis.reason.includes('layout_preset_tag_blocked'),
    };
  });
}

export function layoutOnboardingCoachCopy(hints: LayoutOnboardingVisibilityHint[]): string | null {
  const blocked = hints.filter(h => h.onboardingHighlight && h.layoutBlocked);
  if (!blocked.length) return null;
  return `${blocked.length} onboarding panels preview-only under the current layout preset.`;
}
