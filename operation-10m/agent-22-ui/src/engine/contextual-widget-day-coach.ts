import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  auditWidgetContextualVisibility,
  widgetContextualCoachCopy,
} from './contextual-widget-coach.js';

export const DEFAULT_CONTEXTUAL_WIDGET_AUDIT_IDS = [
  'quick_actions',
  'ask_game_floating_button',
  'guardian_floating_button',
  'strategy_planner_widget',
] as const;

export interface ContextualWidgetDayCoach {
  hiddenWidgetCount: number;
  coachCopy: string | null;
}

export function buildContextualWidgetDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
  widgetIds?: readonly string[];
  contextualShouldShowByWidget?: Record<string, boolean>;
}): ContextualWidgetDayCoach {
  const widgetIds = input.widgetIds ?? DEFAULT_CONTEXTUAL_WIDGET_AUDIT_IDS;
  const entries = auditWidgetContextualVisibility({
    widgetIds: [...widgetIds],
    contextualShouldShowByWidget: input.contextualShouldShowByWidget ?? {},
    signals: input.signals,
    policy: input.policy,
  });
  const base = widgetContextualCoachCopy(entries);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  const hiddenWidgetCount = entries.filter(e => !e.show).length;

  return {
    hiddenWidgetCount,
    coachCopy,
  };
}
