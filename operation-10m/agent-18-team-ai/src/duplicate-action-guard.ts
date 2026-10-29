import {
  ActionFingerprint,
  AGENT18_LIMITS,
  CoordinationPlan,
  DuplicateCommitResult,
  DuplicateGuardState,
} from './types.ts';

export function buildActionFingerprint(input: {
  actorId: string;
  actionKind: string;
  targetId?: string | null;
  turn: number;
  executionGeneration: number;
  amount?: number | null;
}): ActionFingerprint {
  const targetId = input.targetId ?? null;
  const amount = input.amount ?? null;
  const key = [
    input.actorId,
    input.actionKind,
    targetId || '_',
    String(input.turn),
    String(input.executionGeneration),
    amount === null ? '_' : String(amount),
  ].join('|');
  return {
    key,
    actorId: input.actorId,
    actionKind: input.actionKind,
    targetId,
    turn: input.turn,
    executionGeneration: input.executionGeneration,
    amount,
  };
}

export function emptyDuplicateGuardState(turn: number): DuplicateGuardState {
  return {
    version: 1,
    committedKeys: [],
    generationByActor: {},
    turn,
    reservations: {},
  };
}

export function advanceDuplicateGuardTurn(state: DuplicateGuardState, turn: number): DuplicateGuardState {
  if (state.turn === turn) return state;
  return {
    ...state,
    turn,
    committedKeys: state.committedKeys.slice(-AGENT18_LIMITS.maxCommittedKeys),
    reservations: Object.fromEntries(
      Object.entries(state.reservations).filter(([, v]) => v.turn >= turn - 1),
    ),
  };
}

export function reserveActionSlot(
  state: DuplicateGuardState,
  reservationKey: string,
  holderActorId: string,
  taskId: string,
  turn: number,
): DuplicateGuardState {
  const keys = Object.keys(state.reservations);
  if (keys.length >= AGENT18_LIMITS.maxReservations && !state.reservations[reservationKey]) {
    return state;
  }
  const existing = state.reservations[reservationKey];
  if (existing && existing.holderActorId !== holderActorId) {
    return state;
  }
  return {
    ...state,
    reservations: {
      ...state.reservations,
      [reservationKey]: { holderActorId, taskId, turn },
    },
  };
}

export function reservationKeyForRegionAction(regionId: string, actionKind: string): string {
  return `res:${regionId}:${actionKind}`;
}

/**
 * Attempt to commit an action fingerprint. Matches canonical executor semantics:
 * same key + generation → duplicate_action_token; stale generation → stale_generation.
 */
export function tryCommitAction(
  state: DuplicateGuardState,
  fingerprint: ActionFingerprint,
  coordination?: CoordinationPlan | null,
): { state: DuplicateGuardState; result: DuplicateCommitResult } {
  const gen = state.generationByActor[fingerprint.actorId] ?? 0;
  if (fingerprint.executionGeneration < gen) {
    return {
      state,
      result: {
        ok: false,
        reason: 'stale_generation',
        detail: `generation ${fingerprint.executionGeneration} < actor ${gen}`,
      },
    };
  }
  if (state.committedKeys.includes(fingerprint.key)) {
    return {
      state,
      result: {
        ok: false,
        reason: 'duplicate_action_token',
        detail: fingerprint.key,
      },
    };
  }
  if (fingerprint.targetId && coordination) {
    const region = fingerprint.targetId;
    const holder = coordination.mutexRegions[region];
    if (holder && holder !== fingerprint.actorId && /deposit|region/i.test(fingerprint.actionKind)) {
      return {
        state,
        result: {
          ok: false,
          reason: 'lease_blocked',
          detail: `${fingerprint.actorId} blocked; mutex held by ${holder}`,
        },
      };
    }
  }
  const reservationKey = fingerprint.targetId
    ? reservationKeyForRegionAction(fingerprint.targetId, fingerprint.actionKind)
    : null;
  if (reservationKey && state.reservations[reservationKey]) {
    const r = state.reservations[reservationKey];
    if (r.holderActorId !== fingerprint.actorId) {
      return {
        state,
        result: {
          ok: false,
          reason: 'conflicting_holder',
          detail: `reservation held by ${r.holderActorId}`,
        },
      };
    }
  }
  const nextKeys = [...state.committedKeys, fingerprint.key].slice(-AGENT18_LIMITS.maxCommittedKeys);
  const nextState: DuplicateGuardState = {
    ...state,
    committedKeys: nextKeys,
    generationByActor: {
      ...state.generationByActor,
      [fingerprint.actorId]: Math.max(gen, fingerprint.executionGeneration),
    },
  };
  return { state: nextState, result: { ok: true, committed: true } };
}

/** Detect duplicate intents among proposed AI actions before they reach the executor. */
export function detectDuplicateIntents(fingerprints: ActionFingerprint[]): string[] {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  fingerprints.forEach(fp => {
    const logical = [fp.actorId, fp.actionKind, fp.targetId || '_', String(fp.turn)].join('|');
    if (seen.has(logical) && seen.get(logical) !== fp.key) {
      dupes.push(logical);
    }
    seen.set(logical, fp.key);
  });
  return dupes;
}

export function mergeDuplicateGuardStates(
  a: DuplicateGuardState,
  b: DuplicateGuardState,
): DuplicateGuardState {
  const turn = Math.max(a.turn, b.turn);
  const committedKeys = [...new Set([...a.committedKeys, ...b.committedKeys])].slice(
    -AGENT18_LIMITS.maxCommittedKeys,
  );
  const generationByActor = { ...a.generationByActor, ...b.generationByActor };
  Object.keys(generationByActor).forEach(k => {
    generationByActor[k] = Math.max(a.generationByActor[k] ?? 0, b.generationByActor[k] ?? 0);
  });
  return {
    version: 1,
    turn,
    committedKeys,
    generationByActor,
    reservations: { ...a.reservations, ...b.reservations },
  };
}

export function sanitizeDuplicateGuardState(raw: unknown, turn: number): DuplicateGuardState {
  const base = emptyDuplicateGuardState(turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const committedKeys = Array.isArray(r.committedKeys)
    ? r.committedKeys.map(String).slice(-AGENT18_LIMITS.maxCommittedKeys)
    : [];
  const generationByActor =
    r.generationByActor && typeof r.generationByActor === 'object'
      ? Object.fromEntries(
          Object.entries(r.generationByActor as Record<string, unknown>).map(([k, v]) => [
            String(k),
            Number(v) || 0,
          ]),
        )
      : {};
  const reservations: DuplicateGuardState['reservations'] = {};
  if (r.reservations && typeof r.reservations === 'object') {
    Object.entries(r.reservations as Record<string, unknown>).slice(0, AGENT18_LIMITS.maxReservations).forEach(([k, v]) => {
      if (!v || typeof v !== 'object') return;
      const o = v as Record<string, unknown>;
      reservations[k] = {
        holderActorId: String(o.holderActorId || ''),
        taskId: String(o.taskId || ''),
        turn: Number(o.turn) || turn,
      };
    });
  }
  return {
    version: 1,
    turn: Number(r.turn) || turn,
    committedKeys,
    generationByActor,
    reservations,
  };
}

export class DuplicateActionGuard {
  private state: DuplicateGuardState;

  constructor(initial?: DuplicateGuardState, turn: number = 0) {
    this.state = initial ? sanitizeDuplicateGuardState(initial, turn) : emptyDuplicateGuardState(turn);
  }

  snapshot(): DuplicateGuardState {
    return { ...this.state, committedKeys: [...this.state.committedKeys], reservations: { ...this.state.reservations } };
  }

  onTurn(turn: number): void {
    this.state = advanceDuplicateGuardTurn(this.state, turn);
  }

  tryCommit(fingerprint: ActionFingerprint, coordination?: CoordinationPlan | null): DuplicateCommitResult {
    const out = tryCommitAction(this.state, fingerprint, coordination);
    this.state = out.state;
    return out.result;
  }
}
