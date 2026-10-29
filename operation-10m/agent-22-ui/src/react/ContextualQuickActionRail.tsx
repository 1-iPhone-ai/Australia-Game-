import React from 'react';
import { listContextualQuickActions, contextualActionToNavPatch } from '../engine/contextual-quick-actions.js';
import { rankContextualQuickActionsWithMemory } from '../engine/memory-weighted-quick-actions.js';
import type { SessionUiMemory } from '../sim/session-ui-memory.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

export interface ContextualQuickActionRailProps {
  phase: V94StandardizedGamePhase;
  gameDay: number;
  sessionMemory?: SessionUiMemory;
  onNavigate?: (navTarget: string, patch: Record<string, boolean | string>) => void;
}

export function ContextualQuickActionRail({
  phase,
  gameDay,
  sessionMemory,
  onNavigate,
}: ContextualQuickActionRailProps): React.ReactElement {
  const base = listContextualQuickActions(phase, gameDay);
  const actions = sessionMemory ? rankContextualQuickActionsWithMemory(base, sessionMemory) : base;
  return (
    <div data-testid="contextual-quick-action-rail" role="toolbar" aria-label="Contextual quick actions" className="flex flex-wrap gap-1">
      {actions.map(a => (
        <button
          key={a.id}
          type="button"
          className="px-2 py-0.5 rounded text-xs border"
          onClick={() => onNavigate?.(a.navTarget, contextualActionToNavPatch(a))}
          data-testid={`cqa-${a.id}`}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
