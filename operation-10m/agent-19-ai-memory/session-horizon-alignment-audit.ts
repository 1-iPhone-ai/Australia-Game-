import { auditHorizonSliceAlignment, horizonSliceAlignmentOk } from './horizon-slice-alignment-audit.ts';
import type { MemoryInfluenceAuditFinding, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface SessionHorizonAlignmentReport {
  alignmentOk: boolean;
  failedTurns: number[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Validates slice horizons against each turn pack's post-turn snapshot across the session. */
export function auditSessionHorizonAlignment(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{ after: MemoryInfluenceDecisionLike[] }>,
): SessionHorizonAlignmentReport {
  const failedTurns: number[] = [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  packs.forEach((pack, i) => {
    const after = decisionsByTurn[i]?.after ?? [];
    const report = auditHorizonSliceAlignment(pack.horizonAfter, after);
    if (!horizonSliceAlignmentOk(report)) {
      failedTurns.push(pack.turn);
      findings.push(...report.findings);
    }
  });
  const alignmentOk = failedTurns.length === 0;
  const narrativeLines = [
    alignmentOk
      ? `Session horizon alignment ok (${packs.length} turn pack(s)).`
      : `Session horizon alignment FAIL on turn(s) ${failedTurns.join(', ')}.`,
  ];
  return { alignmentOk, failedTurns, findings, narrativeLines };
}

export function sessionHorizonAlignmentOk(report: SessionHorizonAlignmentReport): boolean {
  return report.alignmentOk;
}
