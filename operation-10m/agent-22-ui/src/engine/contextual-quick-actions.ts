import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

export interface ContextualQuickAction {
  id: string;
  label: string;
  navTarget: string;
  phases: V94StandardizedGamePhase[];
  minDay: number;
  priority: number;
}

/** Contextual quick-action rail entries (complements V9.4 quick_actions dock). */
export const CONTEXTUAL_QUICK_ACTIONS: ContextualQuickAction[] = [
  { id: 'qa_travel', label: 'Travel', navTarget: 'travel', phases: ['human_turn'], minDay: 1, priority: 10 },
  { id: 'qa_map', label: 'Map', navTarget: 'map', phases: ['human_turn', 'paused'], minDay: 1, priority: 5 },
  { id: 'qa_market', label: 'Market', navTarget: 'market', phases: ['human_turn'], minDay: 2, priority: 20 },
  { id: 'qa_workshop', label: 'Workshop', navTarget: 'workshop', phases: ['human_turn'], minDay: 2, priority: 25 },
  { id: 'qa_contracts', label: 'Contracts', navTarget: 'contracts', phases: ['human_turn'], minDay: 4, priority: 30 },
  { id: 'qa_loans', label: 'Credit', navTarget: 'loans', phases: ['human_turn'], minDay: 5, priority: 40 },
  { id: 'qa_ask', label: 'Ask AI', navTarget: 'ask_game', phases: ['human_turn', 'approval_waiting'], minDay: 1, priority: 8 },
  { id: 'qa_progress', label: 'Objectives', navTarget: 'progress', phases: ['human_turn', 'paused'], minDay: 3, priority: 15 },
  { id: 'qa_replay', label: 'Replay', navTarget: 'replay', phases: ['human_turn', 'post_match'], minDay: 10, priority: 90 },
];

export function listContextualQuickActions(
  phase: V94StandardizedGamePhase,
  gameDay: number,
  limit = 6
): ContextualQuickAction[] {
  return CONTEXTUAL_QUICK_ACTIONS.filter(a => a.phases.includes(phase) && gameDay >= a.minDay)
    .sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function contextualActionToNavPatch(action: ContextualQuickAction): Record<string, boolean | string> {
  return resolveIntentNavToUiPatchInline(action.navTarget);
}

/** Local mirror to avoid circular imports in bundled chunk ordering. */
function resolveIntentNavToUiPatchInline(target: string): Record<string, boolean | string> {
  switch (target) {
    case 'map':
      return { showMap: true };
    case 'travel':
      return { showTravelModal: true, showMap: true };
    case 'market':
      return { showMarket: true };
    case 'workshop':
      return { showWorkshop: true };
    case 'contracts':
      return { showRegionalContractsModal: true };
    case 'loans':
      return { showAdvancedLoans: true };
    case 'ask_game':
      return { showAskGameAi: true };
    case 'progress':
      return { showProgress: true };
    case 'replay':
      return { showReplayViewer: true };
    default:
      return {};
  }
}
