import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';
import { AGENT19_AI_MEMORY_EVENT_CAP } from './memory-bounds-audit.ts';

/** Read-only retention / ordering checks (eviction is canonical-side; this audits explainability safety). */
export function auditMemoryRetentionOrdering(memory: AiActorMemory | null | undefined): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory?.events?.length) return findings;
  const events = memory.events;
  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const cur = events[i];
    if (cur.turn < prev.turn) {
      findings.push({
        code: 'events_turn_order',
        severity: 'warn',
        message: `Event ${i} turn ${cur.turn} precedes prior turn ${prev.turn} in storage order.`,
      });
    }
  }
  const keyCounts = new Map<string, number>();
  events.forEach(e => {
    const k = e.stableKey?.trim();
    if (!k) return;
    keyCounts.set(k, (keyCounts.get(k) || 0) + 1);
  });
  keyCounts.forEach((count, key) => {
    if (count > 1) {
      findings.push({
        code: 'duplicate_stable_key',
        severity: 'warn',
        message: `stableKey "${key}" appears ${count} times — idempotent commits may be duplicated in narrative.`,
      });
    }
  });
  if (events.length >= AGENT19_AI_MEMORY_EVENT_CAP) {
    findings.push({
      code: 'events_at_cap',
      severity: 'info',
      message: `Event list at cap (${AGENT19_AI_MEMORY_EVENT_CAP}); oldest entries may be evicted canonically while summaries stay bounded.`,
    });
  }
  return findings;
}

export function retentionAuditOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}
