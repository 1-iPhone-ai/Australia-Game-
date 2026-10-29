import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { applyPhasePolicyToVisibility } from './phase-panel-policy.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import {
  DEFAULT_EVOLVING_UI_PROGRESSION_CONFIG,
  evaluateUnlockRule,
  type EvolvingUiProgressionConfig,
  type PanelVisibilityResult,
  type PanelVisibilityState,
  type ProgressionSignalSnapshot,
  tierFromInterfaceLevel,
} from '../types/progression.js';

function shouldBypassGating(
  policy: EvolvingUiAccessPolicy,
  signals: ProgressionSignalSnapshot,
  panelId: string
): boolean {
  if (policy.showAllPanelsOverride) return true;
  if (policy.implicitShowAllLevels.includes(signals.interfaceLevel)) return true;
  if (policy.rememberedPanelIds.includes(panelId)) return true;
  return false;
}

export function resolveEvolvingPanelVisibility(
  panelId: string,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config: EvolvingUiProgressionConfig = DEFAULT_EVOLVING_UI_PROGRESSION_CONFIG
): PanelVisibilityResult {
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) {
    return {
      panelId,
      state: 'visible',
      reason: 'unknown_panel_defaults_visible',
      progressionTier: 0,
      satisfiesUnlock: true,
    };
  }

  const unlockEval = evaluateUnlockRule(panel.unlock, signals);
  const maxTier = tierFromInterfaceLevel(signals.interfaceLevel);
  const tierOk = panel.progressionTier <= maxTier || panel.progressionTier === 0;

  if (policy.honorEssentialPanels && panel.essential) {
    return {
      panelId,
      state: 'visible',
      reason: 'essential_panel',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  if (config.respectShowAllOverride && shouldBypassGating(policy, signals, panelId)) {
    return {
      panelId,
      state: 'visible',
      reason: policy.showAllPanelsOverride ? 'show_all_override' : 'remembered_or_implicit_advanced',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  if (!config.enableProgressionGating) {
    return {
      panelId,
      state: 'visible',
      reason: 'progression_gating_disabled',
      progressionTier: panel.progressionTier,
      satisfiesUnlock: unlockEval.ok,
    };
  }

  const fullyUnlocked = unlockEval.ok && tierOk;
  let state: PanelVisibilityState = 'hidden';
  let reason = `locked:${unlockEval.reasons.join(',') || 'tier'}`;

  if (fullyUnlocked) {
    state = 'visible';
    reason = 'unlock_satisfied';
  } else if (config.showPreviewForLocked && (unlockEval.ok || panel.progressionTier <= maxTier + 1)) {
    state = 'preview';
    reason = unlockEval.ok ? 'preview_tier' : `preview_pending:${unlockEval.reasons.join(',')}`;
  }

  return {
    panelId,
    state,
    reason,
    progressionTier: panel.progressionTier,
    satisfiesUnlock: unlockEval.ok,
  };
}

export function resolveAllPanelVisibilities(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult[] {
  return Object.keys(EVOLVING_UI_PANEL_BY_ID).map(id =>
    resolveEvolvingPanelVisibility(id, signals, policy, config)
  );
}

export function sortPanelsForRail(
  panelIds: string[],
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): string[] {
  const withMeta = panelIds.map(id => {
    const panel = EVOLVING_UI_PANEL_BY_ID[id];
    const vis = resolveEvolvingPanelVisibility(id, signals, policy, config);
    return {
      id,
      order: panel?.railOrder ?? 999,
      tier: panel?.progressionTier ?? 0,
      state: vis.state,
    };
  });
  const rank = (s: PanelVisibilityState) => (s === 'visible' ? 0 : s === 'preview' ? 1 : 2);
  return withMeta
    .sort((a, b) => rank(a.state) - rank(b.state) || a.tier - b.tier || a.order - b.order || a.id.localeCompare(b.id))
    .map(x => x.id);
}

export function resolveEvolvingPanelVisibilityWithPhase(
  panelId: string,
  phase: V94StandardizedGamePhase,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult {
  const base = resolveEvolvingPanelVisibility(panelId, signals, policy, config);
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel) return base;
  const phased = applyPhasePolicyToVisibility(phase, panelId, panel.category, base.state);
  if (phased.state === base.state && phased.reason === 'phase_no_change') return base;
  return {
    ...base,
    state: phased.state,
    reason: `${base.reason}|${phased.reason}`,
  };
}
