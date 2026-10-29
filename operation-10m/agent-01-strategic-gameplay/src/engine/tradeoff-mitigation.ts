import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type {
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';
import { pendingTradeOffCount } from './commitment-journal.ts';

/** Spend AP + treasury to defer one pending trade-off by extraDays. */
export function mitigateNextPendingTradeOff(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  options: { apCost: number; treasuryCost: number; extraDays: number },
): { state: StrategicGameplayState; ok: boolean; issues: StrategicValidationIssue[] } {
  const issues: StrategicValidationIssue[] = [];
  if (state.pendingDelayed.length === 0) {
    issues.push({
      code: 'NO_PENDING_TRADEOFFS',
      message: 'No delayed trade-offs to mitigate.',
      requirement: { kind: 'max_pending_tradeoffs', max: 0 },
    });
    return { state, ok: false, issues };
  }

  const econ = contracts.economy.snapshot();
  if (econ.treasuryReserve < options.treasuryCost) {
    issues.push({
      code: 'INSUFFICIENT_FUNDS',
      message: 'Treasury cannot fund mitigation.',
      requirement: { kind: 'min_treasury', amount: options.treasuryCost },
    });
    return { state, ok: false, issues };
  }

  contracts.economy.applyPatch({ treasuryDelta: -options.treasuryCost });
  const sorted = [...state.pendingDelayed].sort((a, b) => a.firesOnDay - b.firesOnDay);
  const [next, ...rest] = sorted;
  const deferred = {
    ...next,
    firesOnDay: next.firesOnDay + options.extraDays,
    label: `${next.label} (deferred +${options.extraDays}d)`,
  };

  contracts.ui.pushToast({
    id: `mitigate_${next.id}_${state.day}`,
    severity: 'info',
    title: 'Trade-off deferred',
    body: deferred.label,
    day: state.day,
  });

  return {
    ok: true,
    issues: [],
    state: {
      ...state,
      pendingDelayed: [...rest, deferred].sort((a, b) => a.firesOnDay - b.firesOnDay),
    },
  };
}

export function summarizePendingTradeOffLoad(state: StrategicGameplayState): {
  count: number;
  nextFireDay: number | null;
  heaviestPopulationStress: number;
} {
  if (state.pendingDelayed.length === 0) {
    return { count: 0, nextFireDay: null, heaviestPopulationStress: 0 };
  }
  const sorted = [...state.pendingDelayed].sort((a, b) => a.firesOnDay - b.firesOnDay);
  let heaviest = 0;
  for (const p of state.pendingDelayed) {
    heaviest = Math.max(
      heaviest,
      p.effects.population?.affordabilityStressDelta ?? 0,
    );
  }
  return {
    count: pendingTradeOffCount(state),
    nextFireDay: sorted[0].firesOnDay,
    heaviestPopulationStress: heaviest,
  };
}
