import { auditDecisionTraceContinuity, decisionTraceContinuityOk } from './decision-trace-continuity-audit.ts';
import { auditTurnPackComposite, turnPackCompositeOk } from './turn-pack-composite-audit.ts';
import type { MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { TurnPackCompositeAuditReport } from './turn-pack-composite-audit.ts';
import type { DecisionTraceContinuityReport } from './decision-trace-continuity-audit.ts';

export interface TraceCompositeBridgeReport {
  compositeOk: boolean;
  traceOk: boolean;
  combinedOk: boolean;
  composite: TurnPackCompositeAuditReport;
  trace: DecisionTraceContinuityReport;
  narrativeLines: string[];
}

/** Runs composite audit and trace continuity as one player-facing gate. */
export function auditTraceCompositeBridge(
  pack: TurnExplainabilityPack,
  params: {
    decisionsBefore: MemoryInfluenceDecisionLike[];
    decisionsAfter: MemoryInfluenceDecisionLike[];
  },
): TraceCompositeBridgeReport {
  const composite = auditTurnPackComposite(pack, params);
  const trace = auditDecisionTraceContinuity(params.decisionsBefore, params.decisionsAfter);
  const compositeOk = turnPackCompositeOk(composite);
  const traceOk = decisionTraceContinuityOk(trace);
  const combinedOk = compositeOk && traceOk;
  const narrativeLines = [
    `Trace+composite bridge @ turn ${pack.turn}: ${combinedOk ? 'PASS' : 'FAIL'} (composite ${compositeOk ? 'ok' : 'fail'}, trace ${traceOk ? 'ok' : 'fail'}).`,
    ...composite.narrativeLines.slice(0, 1),
    ...trace.narrativeLines,
  ];
  return { compositeOk, traceOk, combinedOk, composite, trace, narrativeLines };
}

export function traceCompositeBridgeOk(report: TraceCompositeBridgeReport): boolean {
  return report.combinedOk;
}
