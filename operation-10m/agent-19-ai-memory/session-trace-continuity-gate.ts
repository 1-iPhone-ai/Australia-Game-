import { auditDecisionTraceContinuity, decisionTraceContinuityOk } from './decision-trace-continuity-audit.ts';
import type { MemoryInfluenceAuditFinding, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface SessionTraceContinuityGateReport {
  gateOpen: boolean;
  failedTurns: number[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Session gate: every turn must preserve decision option types after memory influence. */
export function auditSessionTraceContinuityGate(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>,
): SessionTraceContinuityGateReport {
  const failedTurns: number[] = [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  packs.forEach((pack, i) => {
    const d = decisionsByTurn[i];
    if (!d) return;
    const report = auditDecisionTraceContinuity(d.before, d.after);
    if (!decisionTraceContinuityOk(report)) {
      failedTurns.push(pack.turn);
      findings.push(...report.findings);
    }
  });
  const gateOpen = failedTurns.length === 0 && packs.length > 0;
  const narrativeLines = [
    gateOpen
      ? `Session trace continuity: all ${packs.length} turn(s) preserved option types.`
      : `Session trace continuity FAIL on turn(s) ${failedTurns.join(', ') || 'unknown'}.`,
  ];
  return { gateOpen, failedTurns, findings, narrativeLines };
}

export function sessionTraceContinuityGateOpen(report: SessionTraceContinuityGateReport): boolean {
  return report.gateOpen;
}
