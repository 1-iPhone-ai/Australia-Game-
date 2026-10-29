import type { Agent17ActorSlice, Agent17GameStateSlice } from '../types/command-center-types.ts';

/** FNV-1a 32-bit — matches canonical game helper semantics for ACC17 fingerprints. */
export function fnv1aHashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function acc17ComputeRelevantStateFingerprint(
  state: Agent17GameStateSlice,
  actorId: string
): string {
  const actor: Agent17ActorSlice =
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {};
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const parts = [
    actorId,
    String(turn),
    String(day),
    String(actor.money ?? 0),
    String(actor.netWorth ?? actor.money ?? 0),
    String(actor.currentRegion || actor.currentLocation || ''),
    String(actor.actionsUsedThisTurn ?? 0),
    String((actor.inventory || []).length),
    String(state.lastExecutedAction?.type || state.lastAction?.type || ''),
    String(state.playerTrackedObjective?.sourceId || ''),
    String(state.strategyPlannerState?.activePlan?.id || ''),
  ];
  return fnv1aHashString('acc17:' + parts.join('|'));
}
