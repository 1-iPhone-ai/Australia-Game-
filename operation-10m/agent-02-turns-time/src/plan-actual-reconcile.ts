import { TurnTimeSnapshot } from './types.js';
import { planEffectsThroughTurn, type PlannedEffect } from './turn-horizon.js';

export interface HorizonReconcileRow {
  turnIndex: number;
  plannedEffectIds: string[];
  actualEffectIds: string[];
  missing: string[];
  extra: string[];
  ok: boolean;
}

export interface HorizonReconcileReport {
  ok: boolean;
  rows: HorizonReconcileRow[];
}

function plannedIdsForTurn(planned: PlannedEffect[], turnIndex: number): string[] {
  return planned
    .filter((p) => p.turnIndex === turnIndex)
    .map((p) => `${p.kind}:${p.id}`)
    .sort((a, b) => a.localeCompare(b));
}

function actualIdsForTurn(after: TurnTimeSnapshot, turnIndex: number): string[] {
  const ids: string[] = [];
  for (const o of after.obligations) {
    if (o.status === 'fired' && o.firedAtTurn === turnIndex) {
      ids.push(`obligation:${o.id}`);
    }
  }
  for (const e of after.events) {
    if (e.status === 'dispatched' && e.dispatchedAtTurn === turnIndex) {
      ids.push(`event:${e.id}`);
    }
  }
  for (const entry of after.trace) {
    if (entry.turnIndex !== turnIndex) continue;
    if (entry.kind === 'construction_completed' && entry.refId) {
      ids.push(`construction_complete:${entry.refId}`);
    }
  }
  return ids.sort((a, b) => a.localeCompare(b));
}

function diffLists(planned: string[], actual: string[]): { missing: string[]; extra: string[] } {
  const p = new Set(planned);
  const a = new Set(actual);
  const missing = planned.filter((id) => !a.has(id));
  const extra = actual.filter((id) => !p.has(id));
  return { missing, extra };
}

/**
 * Compares horizon plan at `turnIndex` against snapshot delta after one full turn step from `before`.
 */
export function reconcileHorizonForTurn(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  turnIndex: number,
): HorizonReconcileRow {
  const planned = planEffectsThroughTurn(before, turnIndex);
  const plannedEffectIds = plannedIdsForTurn(planned, turnIndex);
  const actualEffectIds = actualIdsForTurn(after, turnIndex);
  const { missing, extra } = diffLists(plannedEffectIds, actualEffectIds);
  return {
    turnIndex,
    plannedEffectIds,
    actualEffectIds,
    missing,
    extra,
    ok: missing.length === 0 && extra.length === 0,
  };
}

export function reconcileHorizonThroughTurns(
  initial: TurnTimeSnapshot,
  final: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
): HorizonReconcileReport {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const rows: HorizonReconcileRow[] = [];
  for (let t = from; t <= to; t += 1) {
    rows.push(reconcileHorizonForTurn(initial, final, t));
  }
  const ok = rows.every((r) => r.ok);
  return { ok, rows };
}

/** After stepping, verify due effects on the stepped turn match the pre-step horizon. */
export function reconcileLastStepHorizon(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
): HorizonReconcileRow {
  const steppedTurn = before.clock.turnIndex;
  return reconcileHorizonForTurn(before, after, steppedTurn);
}
