import { applyConsequenceMutation } from './consequence-applier.ts';
import type {
  Op10mConsequenceMutation,
  Op10mDeferredNarrativeMutation,
  Op10mNarrativeEngineState,
  Op10mSimulationSlice,
  Op10mTurnComputeLedger,
} from './types.ts';

export function createDefaultOp10mTurnComputeLedger(): Op10mTurnComputeLedger {
  return {
    lastTurn: 0,
    lastDay: 0,
    computePassCount: 0,
    turnComputeDigest: 'init',
    deferredMutations: [],
    lastStages: [],
  };
}

export function sanitizeOp10mTurnComputeLedger(raw: unknown): Op10mTurnComputeLedger {
  const base = createDefaultOp10mTurnComputeLedger();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  base.lastTurn = Math.max(0, Number(r.lastTurn) || 0);
  base.lastDay = Math.max(0, Number(r.lastDay) || 0);
  base.computePassCount = Math.max(0, Number(r.computePassCount) || 0);
  base.turnComputeDigest = typeof r.turnComputeDigest === 'string' ? r.turnComputeDigest : base.turnComputeDigest;
  base.lastStages = (Array.isArray(r.lastStages) ? r.lastStages : []).map(String).slice(-8) as Op10mTurnComputeLedger['lastStages'];
  base.deferredMutations = (Array.isArray(r.deferredMutations) ? r.deferredMutations : [])
    .filter((m): m is Op10mDeferredNarrativeMutation => {
      return (
        !!m &&
        typeof m === 'object' &&
        typeof (m as { id?: unknown }).id === 'string' &&
        typeof (m as { chainId?: unknown }).chainId === 'string'
      );
    })
    .slice(-24);
  return base;
}

export function getDeferredQueueDepth(narrative: Op10mNarrativeEngineState): number {
  return narrative.turnCompute?.deferredMutations.length ?? 0;
}

export function getTurnComputePassCount(narrative: Op10mNarrativeEngineState): number {
  return narrative.turnCompute?.computePassCount ?? narrative.telemetry.computeTurnPasses ?? 0;
}

export function enqueueDeferredNarrativeMutation(
  narrative: Op10mNarrativeEngineState,
  input: {
    chainId: string;
    firesOnTurn: number;
    enqueuedDay: number;
    mutation: Op10mConsequenceMutation;
  }
): Op10mNarrativeEngineState {
  const ledger = sanitizeOp10mTurnComputeLedger(narrative.turnCompute);
  const id = `${input.chainId}_def_${input.firesOnTurn}_${ledger.deferredMutations.length}`;
  return {
    ...narrative,
    turnCompute: {
      ...ledger,
      deferredMutations: [
        ...ledger.deferredMutations,
        {
          id,
          chainId: input.chainId,
          firesOnTurn: input.firesOnTurn,
          enqueuedDay: input.enqueuedDay,
          mutation: input.mutation,
        },
      ].slice(-24),
    },
  };
}

export function drainDeferredNarrativeMutationsForTurn(
  simulation: Op10mSimulationSlice,
  narrative: Op10mNarrativeEngineState,
  turn: number
): { simulation: Op10mSimulationSlice; narrative: Op10mNarrativeEngineState; log: string[] } {
  const ledger = sanitizeOp10mTurnComputeLedger(narrative.turnCompute);
  const log: string[] = [];
  let sim = simulation;
  let nar = narrative;
  const remaining: Op10mDeferredNarrativeMutation[] = [];
  let fired = 0;

  for (const item of ledger.deferredMutations) {
    if (item.firesOnTurn <= turn) {
      const applied = applyConsequenceMutation(sim, nar, item.chainId, item.mutation);
      sim = applied.simulation;
      nar = applied.narrative;
      fired += 1;
      log.push(`deferred fired ${item.id}`);
    } else {
      remaining.push(item);
    }
  }

  nar = {
    ...nar,
    turnCompute: { ...ledger, deferredMutations: remaining },
    telemetry: {
      ...nar.telemetry,
      deferredMutationsFired: nar.telemetry.deferredMutationsFired + fired,
    },
  };

  return { simulation: sim, narrative: nar, log };
}
