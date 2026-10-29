import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  PublicServiceCapacitySnapshot,
  ReliefDispatchAction,
  ReliefDispatchPlan,
  ReliefExecutionMonitor,
  ReliefFulfillmentOpenAction,
  ReliefFulfillmentPersisted,
  ReliefFulfillmentSnapshot,
} from './types.ts';

function actionKey(action: ReliefDispatchAction): string {
  return `${action.programId}:${action.regionId}:${action.targetTurn}:${action.priority}`;
}

export function createInitialReliefFulfillment(): ReliefFulfillmentPersisted {
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    openActions: [],
    cumulativeFulfilled: 0,
  };
}

export function sanitizeReliefFulfillment(
  raw?: ReliefFulfillmentPersisted | null
): ReliefFulfillmentPersisted {
  if (!raw || typeof raw !== 'object') return createInitialReliefFulfillment();
  const openActions = Array.isArray(raw.openActions)
    ? raw.openActions.filter(
        (a) => a && typeof a.actionKey === 'string' && typeof a.programId === 'string'
      )
    : [];
  return {
    schemaVersion: '10.14.28-scale-wave-28' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    openActions,
    cumulativeFulfilled:
      typeof raw.cumulativeFulfilled === 'number' && Number.isFinite(raw.cumulativeFulfilled)
        ? Math.max(0, Math.floor(raw.cumulativeFulfilled))
        : 0,
  };
}

function mergeOpenActions(
  existing: ReliefFulfillmentOpenAction[],
  plan: ReliefDispatchPlan
): ReliefFulfillmentOpenAction[] {
  const keys = new Set(existing.map((a) => a.actionKey));
  const merged = [...existing];
  for (const action of plan.actions) {
    const key = actionKey(action);
    if (keys.has(key)) continue;
    keys.add(key);
    merged.push({
      actionKey: key,
      programId: action.programId,
      regionId: action.regionId,
      pillar: action.pillar,
      priority: action.priority,
      targetTurn: action.targetTurn,
    });
  }
  return merged;
}

export function advanceReliefFulfillment(args: {
  turn: number;
  reliefDispatchPlan: ReliefDispatchPlan;
  executionMonitor: ReliefExecutionMonitor;
  capacity: PublicServiceCapacitySnapshot;
  persisted?: ReliefFulfillmentPersisted | null;
}): { snapshot: ReliefFulfillmentSnapshot; persisted: ReliefFulfillmentPersisted } {
  const base = sanitizeReliefFulfillment(args.persisted);
  let openActions = mergeOpenActions(base.openActions, args.reliefDispatchPlan);
  let fulfilledThisTurn = 0;

  const canFulfill =
    args.capacity.bindingConstraint === 'none' &&
    !args.executionMonitor.shouldEscalateExecution &&
    args.capacity.slotsFree > 0;

  if (canFulfill) {
    const remaining: ReliefFulfillmentOpenAction[] = [];
    let slots = args.capacity.slotsFree;
    for (const item of openActions) {
      const due = item.targetTurn <= args.turn && item.priority !== 'hold';
      if (due && slots > 0) {
        fulfilledThisTurn += 1;
        slots -= 1;
        continue;
      }
      remaining.push(item);
    }
    openActions = remaining;
  }

  const openCount = openActions.length;
  const denominator = Math.max(1, openCount + fulfilledThisTurn);
  const fulfillmentRatio = Math.round((fulfilledThisTurn / denominator) * 100) / 100;
  const shouldClearBacklog = openCount === 0 && fulfilledThisTurn === 0 && !args.reliefDispatchPlan.shouldHoldCommits;

  const summary =
    fulfilledThisTurn > 0
      ? `Relief fulfillment: ${fulfilledThisTurn} closed, ${openCount} open`
      : openCount > 0
        ? `Relief fulfillment backlog: ${openCount} open actions`
        : 'Relief fulfillment queue clear';

  return {
    snapshot: {
      turn: args.turn,
      openCount,
      fulfilledThisTurn,
      fulfillmentRatio,
      shouldClearBacklog,
      summary,
    },
    persisted: {
      ...base,
      lastTurn: args.turn,
      openActions,
      cumulativeFulfilled: base.cumulativeFulfilled + fulfilledThisTurn,
    },
  };
}
