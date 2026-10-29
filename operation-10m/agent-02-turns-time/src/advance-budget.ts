export interface TurnAdvanceBudgetState {
  limit: number;
  consumed: number;
}

export function createTurnAdvanceBudget(limit: number): TurnAdvanceBudgetState {
  const safe = Math.floor(limit);
  if (!Number.isFinite(safe) || safe < 1) {
    throw new Error('createTurnAdvanceBudget: limit must be >= 1');
  }
  return { limit: safe, consumed: 0 };
}

export interface AdvanceBudgetConsumeResult {
  state: TurnAdvanceBudgetState;
  allowed: boolean;
  remaining: number;
  detail?: string;
}

export function tryConsumeTurnAdvanceBudget(
  state: TurnAdvanceBudgetState,
  steps = 1,
): AdvanceBudgetConsumeResult {
  const count = Math.max(1, Math.floor(steps));
  const nextConsumed = state.consumed + count;
  if (nextConsumed > state.limit) {
    return {
      state,
      allowed: false,
      remaining: Math.max(0, state.limit - state.consumed),
      detail: `Turn advance budget exceeded (${nextConsumed}/${state.limit})`,
    };
  }
  return {
    state: { ...state, consumed: nextConsumed },
    allowed: true,
    remaining: state.limit - nextConsumed,
  };
}

export function advanceBudgetRemaining(state: TurnAdvanceBudgetState): number {
  return Math.max(0, state.limit - state.consumed);
}
