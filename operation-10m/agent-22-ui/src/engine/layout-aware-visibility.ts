import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { isPanelTagEnabledForPreset, type V94LayoutPreset } from './layout-preset-evolution.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { EvolvingUiProgressionConfig, PanelVisibilityResult, ProgressionSignalSnapshot } from '../types/progression.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';

export function resolveEvolvingPanelVisibilityWithLayout(
  panelId: string,
  layoutPreset: V94LayoutPreset | undefined,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): PanelVisibilityResult {
  const base = resolveEvolvingPanelVisibility(panelId, signals, policy, config);
  const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
  if (!panel || base.state === 'hidden') return base;
  const tagOk = isPanelTagEnabledForPreset(panel.tags, layoutPreset);
  if (tagOk) return base;
  if (base.state === 'visible' || base.state === 'preview') {
    return { ...base, state: 'preview', reason: `${base.reason}|layout_preset_tag_blocked` };
  }
  return { ...base, reason: `${base.reason}|layout_preset_tag_blocked` };
}
