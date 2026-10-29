import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';

export const AGENT19_RELATIONSHIP_STALE_TURN_GAP = 8;
export const AGENT19_DECAY_STALE_TURN_GAP = 12;

/** Flags explainability risk when relationship axes or decay state may be outdated vs current turn. */
export function auditMemoryStaleness(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory) return findings;
  if (currentTurn - (memory.lastDecayTurn ?? 0) >= AGENT19_DECAY_STALE_TURN_GAP) {
    findings.push({
      code: 'decay_not_recent',
      severity: 'info',
      message: `Last decay turn ${memory.lastDecayTurn ?? 0} is ${currentTurn - (memory.lastDecayTurn ?? 0)} turns behind — long-run weights may lag recent events in briefs.`,
    });
  }
  Object.values(memory.relationships || {}).forEach(rel => {
    const gap = currentTurn - (rel.lastUpdatedTurn ?? 0);
    if (gap >= AGENT19_RELATIONSHIP_STALE_TURN_GAP) {
      findings.push({
        code: 'relationship_stale',
        severity: 'warn',
        message: `Relationship toward ${rel.actorId} last updated turn ${rel.lastUpdatedTurn} (${gap} turns ago) — negotiation copy may understate recent shifts.`,
      });
    }
  });
  return findings;
}

export function stalenessAuditOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}

export function summarizeMemoryStaleness(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): { findings: MemoryInfluenceAuditFinding[]; narrativeLines: string[] } {
  const findings = auditMemoryStaleness(memory, currentTurn);
  const staleRels = findings.filter(f => f.code === 'relationship_stale').length;
  const lines = [
    staleRels
      ? `${staleRels} tracked relationship(s) may be stale vs turn ${currentTurn} — refresh after committed actions.`
      : `Relationship tracks appear fresh for turn ${currentTurn} (gap threshold ${AGENT19_RELATIONSHIP_STALE_TURN_GAP} turns).`,
  ];
  findings.slice(0, 3).forEach(f => lines.push(`[${f.severity}] ${f.message}`));
  return { findings, narrativeLines: lines };
}
