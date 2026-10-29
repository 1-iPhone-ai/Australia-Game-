import { auditMatchExplainabilityGate, matchExplainabilityGateOpen } from './match-explainability-gate.ts';
import {
  auditSessionTraceContinuityGate,
  sessionTraceContinuityGateOpen,
} from './session-trace-continuity-gate.ts';
import {
  auditSessionHorizonAlignment,
  sessionHorizonAlignmentOk,
} from './session-horizon-alignment-audit.ts';
import {
  buildSessionTraceCompositeRollup,
  sessionTraceCompositeAllPassed,
} from './session-trace-composite-rollup.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityFinalGateReport {
  finalOpen: boolean;
  matchGateOpen: boolean;
  traceContinuityOpen: boolean;
  horizonAlignmentOk: boolean;
  traceCompositeAllPassed: boolean;
  narrativeLines: string[];
}

/** Top-level match gate: match rollup + trace continuity + horizon alignment + trace/composite rollup. */
export function auditMatchExplainabilityFinalGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityFinalGateReport {
  const matchGate = auditMatchExplainabilityGate(packs, params);
  const matchGateOpen = matchExplainabilityGateOpen(matchGate);
  const traceGate = auditSessionTraceContinuityGate(packs, params.decisionsByTurn);
  const traceContinuityOpen = sessionTraceContinuityGateOpen(traceGate);
  const horizonReport = auditSessionHorizonAlignment(
    packs,
    params.decisionsByTurn.map(d => ({ after: d.after })),
  );
  const horizonAlignmentOk = sessionHorizonAlignmentOk(horizonReport);
  const compositeRollup = buildSessionTraceCompositeRollup(packs, params.decisionsByTurn);
  const traceCompositeAllPassed = sessionTraceCompositeAllPassed(compositeRollup);
  const finalOpen =
    matchGateOpen && traceContinuityOpen && horizonAlignmentOk && traceCompositeAllPassed;
  const narrativeLines = [
    `Match final explainability gate: ${finalOpen ? 'OPEN' : 'CLOSED'} (match ${matchGateOpen ? 'ok' : 'fail'}, trace ${traceContinuityOpen ? 'ok' : 'fail'}, horizon ${horizonAlignmentOk ? 'ok' : 'fail'}, composite ${traceCompositeAllPassed ? 'ok' : 'fail'}).`,
    ...matchGate.narrativeLines.slice(0, 1),
    ...traceGate.narrativeLines,
    ...compositeRollup.narrativeLines,
  ];
  return {
    finalOpen,
    matchGateOpen,
    traceContinuityOpen,
    horizonAlignmentOk,
    traceCompositeAllPassed,
    narrativeLines,
  };
}

export function matchExplainabilityFinalGateOpen(report: MatchExplainabilityFinalGateReport): boolean {
  return report.finalOpen;
}
