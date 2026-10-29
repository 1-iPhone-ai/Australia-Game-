import { auditInfluenceDriftBetweenTurns } from './influence-drift-audit.ts';
import { auditTurnPackGiRedaction, giRedactionConsistencyOk } from './gi-redaction-consistency-audit.ts';
import { auditTurnSliceAttribution, turnSliceAttributionOk } from './slice-attribution-audit.ts';
import type { AiMemoryInspectionView, MemoryInfluenceAuditFinding } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface TurnPackCompositeAuditReport {
  sliceOk: boolean;
  giRedactionOk: boolean;
  driftOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Single-turn explainability gate: slice attribution, GI redaction, and optional prior-pack drift. */
export function auditTurnPackComposite(
  pack: TurnExplainabilityPack,
  params: {
    decisionsBefore: import('./types.ts').MemoryInfluenceDecisionLike[];
    decisionsAfter: import('./types.ts').MemoryInfluenceDecisionLike[];
    inspection?: AiMemoryInspectionView | null;
    priorPack?: TurnExplainabilityPack | null;
  },
): TurnPackCompositeAuditReport {
  const sliceReport = auditTurnSliceAttribution(params.decisionsBefore, params.decisionsAfter);
  const sliceOk = turnSliceAttributionOk(sliceReport);
  const giFindings = params.inspection
    ? auditTurnPackGiRedaction(pack, params.inspection)
    : [];
  const giRedactionOk = giRedactionConsistencyOk(giFindings);
  let driftOk = true;
  const driftFindings: MemoryInfluenceAuditFinding[] = params.priorPack
    ? auditInfluenceDriftBetweenTurns(params.priorPack, pack)
    : [];
  if (driftFindings.some(f => f.code === 'influence_spike')) {
    driftOk = false;
  }
  const findings = [...sliceReport.findings, ...giFindings, ...driftFindings];
  const narrativeLines = [
    `Turn ${pack.turn} composite audit: slices ${sliceOk ? 'ok' : 'FAIL'}, GI redaction ${giRedactionOk ? 'ok' : 'FAIL'}, drift ${driftOk ? 'ok' : 'warn'}.`,
    ...sliceReport.narrativeLines,
  ];
  return { sliceOk, giRedactionOk, driftOk, findings, narrativeLines };
}

export function turnPackCompositeOk(report: TurnPackCompositeAuditReport): boolean {
  return report.sliceOk && report.giRedactionOk && report.driftOk;
}
