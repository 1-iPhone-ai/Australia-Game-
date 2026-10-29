import { listPanelsForWidget } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { EvolvingUiProgressionConfig, ProgressionSignalSnapshot } from '../types/progression.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';

export interface ContextualHidingInput {
  widgetId: string;
  contextualShouldShow: boolean;
}

/**
 * Combines V9.4 contextual hiding with evolving UI progression.
 * Emergency widgets should pass contextualShouldShow=true from canonical engine first.
 */
export function mergeEvolvingUiWithContextualHiding(
  input: ContextualHidingInput,
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  config?: EvolvingUiProgressionConfig
): { show: boolean; reason: string } {
  if (!input.contextualShouldShow) {
    return { show: false, reason: 'contextual_hiding' };
  }
  const panels = listPanelsForWidget(input.widgetId);
  if (panels.length === 0) {
    return { show: true, reason: 'unregistered_widget' };
  }
  const vis = resolveEvolvingPanelVisibility(panels[0].id, signals, policy, config);
  if (vis.state === 'hidden') {
    return { show: false, reason: `evolving_ui:${vis.reason}` };
  }
  return { show: true, reason: vis.state === 'preview' ? 'evolving_ui_preview' : 'visible' };
}
