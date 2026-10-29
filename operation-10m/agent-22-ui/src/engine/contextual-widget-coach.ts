import { listPanelsForWidget } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { mergeEvolvingUiWithContextualHiding } from './merge-with-v94-contextual-hiding.js';

export interface WidgetContextualCoachEntry {
  widgetId: string;
  show: boolean;
  reason: string;
  panelIds: string[];
}

export function auditWidgetContextualVisibility(input: {
  widgetIds: string[];
  contextualShouldShowByWidget: Record<string, boolean>;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
}): WidgetContextualCoachEntry[] {
  return input.widgetIds.map(widgetId => {
    const contextualShouldShow = input.contextualShouldShowByWidget[widgetId] ?? true;
    const merged = mergeEvolvingUiWithContextualHiding(
      { widgetId, contextualShouldShow },
      input.signals,
      input.policy
    );
    return {
      widgetId,
      show: merged.show,
      reason: merged.reason,
      panelIds: listPanelsForWidget(widgetId).map(p => p.id),
    };
  });
}

export function widgetContextualCoachCopy(entries: WidgetContextualCoachEntry[]): string | null {
  const hidden = entries.filter(e => !e.show);
  if (!hidden.length) return null;
  return `${hidden.length} widgets stay hidden by contextual or progression rules.`;
}
