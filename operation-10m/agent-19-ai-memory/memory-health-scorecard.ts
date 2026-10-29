import { buildAiMemoryHorizonSnapshot } from './horizon.ts';
import { auditActorMemoryBounds, memoryBoundsOk } from './memory-bounds-audit.ts';
import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';

export interface MemoryHealthScorecard {
  boundsOk: boolean;
  eventCount: number;
  relationshipCount: number;
  priorBeliefCount: number;
  healthScore: number;
  band: 'excellent' | 'good' | 'fair' | 'degraded';
  findings: MemoryInfluenceAuditFinding[];
  summaryLine: string;
}

export function computeMemoryHealthScorecard(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): MemoryHealthScorecard {
  const findings = auditActorMemoryBounds(memory);
  const boundsOk = memoryBoundsOk(memory);
  const snap = buildAiMemoryHorizonSnapshot(memory, opts);
  let healthScore = 100;
  findings.forEach(f => {
    if (f.severity === 'fail') healthScore -= 25;
    else if (f.severity === 'warn') healthScore -= 8;
  });
  if (!boundsOk) healthScore = Math.min(healthScore, 40);
  healthScore = Math.max(0, Math.min(100, healthScore));
  const band: MemoryHealthScorecard['band'] =
    healthScore >= 90 ? 'excellent' : healthScore >= 75 ? 'good' : healthScore >= 50 ? 'fair' : 'degraded';
  const summaryLine = boundsOk
    ? `Memory health ${healthScore}/100 (${band}): ${snap.shortTermEventCount} events, ${snap.shortTermRelationshipCount} relationships tracked.`
    : `Memory health ${healthScore}/100 (${band}): bounds audit failed — see findings.`;
  return {
    boundsOk,
    eventCount: snap.shortTermEventCount,
    relationshipCount: snap.shortTermRelationshipCount,
    priorBeliefCount: snap.longTermPriorBeliefCount,
    healthScore,
    band,
    findings,
    summaryLine,
  };
}

export function formatMemoryHealthBrief(scorecard: MemoryHealthScorecard): string[] {
  const lines = [scorecard.summaryLine];
  scorecard.findings.slice(0, 4).forEach(f => lines.push(`[${f.severity}] ${f.message}`));
  return lines;
}
