import { auditInfluenceDriftBetweenTurns, summarizeInfluenceDrift } from './influence-drift-audit.ts';
import type { MemoryInfluenceAuditFinding } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface MultiTurnDriftRollup {
  pairCount: number;
  spikeCount: number;
  horizonShiftCount: number;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Walk consecutive turn packs and aggregate influence drift warnings for session briefs. */
export function buildMultiTurnDriftRollup(packs: TurnExplainabilityPack[]): MultiTurnDriftRollup {
  const findings: MemoryInfluenceAuditFinding[] = [];
  for (let i = 1; i < packs.length; i++) {
    auditInfluenceDriftBetweenTurns(packs[i - 1], packs[i]).forEach(f => findings.push(f));
  }
  const spikeCount = findings.filter(f => f.code === 'influence_spike').length;
  const horizonShiftCount = findings.filter(f => f.code === 'dominant_horizon_shift').length;
  const narrativeLines =
    packs.length >= 2
      ? [`Multi-turn drift scan across ${packs.length - 1} consecutive pair(s).`, ...summarizeInfluenceDrift(findings).slice(1)]
      : summarizeInfluenceDrift(findings);
  return {
    pairCount: Math.max(0, packs.length - 1),
    spikeCount,
    horizonShiftCount,
    findings,
    narrativeLines,
  };
}
