import { auditActorMemoryBounds } from './memory-bounds-audit.ts';
import { auditMemoryRetentionOrdering } from './memory-retention-audit.ts';
import { auditMemoryStaleness, stalenessAuditOk } from './memory-staleness-audit.ts';
import { memoryBoundsOk } from './memory-bounds-audit.ts';
import { retentionAuditOk } from './memory-retention-audit.ts';
import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';

export interface ExplainabilityIntegrityReport {
  boundsOk: boolean;
  retentionOk: boolean;
  stalenessOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Single read-only pass merging bounds, retention ordering, and staleness explainability audits. */
export function auditExplainabilityIntegrity(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): ExplainabilityIntegrityReport {
  const findings = [
    ...auditActorMemoryBounds(memory),
    ...auditMemoryRetentionOrdering(memory),
    ...auditMemoryStaleness(memory, currentTurn),
  ];
  const boundsOk = memoryBoundsOk(memory);
  const retentionOk = retentionAuditOk(findings);
  const stalenessOk = stalenessAuditOk(findings);
  const failCount = findings.filter(f => f.severity === 'fail').length;
  const warnCount = findings.filter(f => f.severity === 'warn').length;
  const narrativeLines = [
    `Explainability integrity @ turn ${currentTurn}: bounds ${boundsOk ? 'ok' : 'FAIL'}, ${findings.length} finding(s) (${warnCount} warn, ${failCount} fail).`,
  ];
  findings.slice(0, 5).forEach(f => narrativeLines.push(`[${f.severity}] ${f.code}: ${f.message}`));
  return { boundsOk, retentionOk, stalenessOk, findings, narrativeLines };
}
