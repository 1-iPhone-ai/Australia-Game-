import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';

/** Match V9.4 bounded event history cap. */
export const AGENT19_AI_MEMORY_EVENT_CAP = 60;
export const AGENT19_MAX_RELATIONSHIP_ACTORS = 12;
export const AGENT19_MAX_OPPONENT_MODELS = 12;
export const AGENT19_MAX_SEEN_KEYS = AGENT19_AI_MEMORY_EVENT_CAP * 2;

export function auditActorMemoryBounds(memory: AiActorMemory | null | undefined): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory) return findings;
  if (memory.events.length > AGENT19_AI_MEMORY_EVENT_CAP) {
    findings.push({
      code: 'events_over_cap',
      severity: 'fail',
      message: `${memory.events.length} events exceeds cap ${AGENT19_AI_MEMORY_EVENT_CAP}.`,
    });
  }
  if (Object.keys(memory.relationships || {}).length > AGENT19_MAX_RELATIONSHIP_ACTORS) {
    findings.push({
      code: 'relationships_over_cap',
      severity: 'fail',
      message: 'Too many relationship tracks stored.',
    });
  }
  if (Object.keys(memory.opponentModels || {}).length > AGENT19_MAX_OPPONENT_MODELS) {
    findings.push({
      code: 'opponent_models_over_cap',
      severity: 'fail',
      message: 'Too many opponent models stored.',
    });
  }
  if ((memory.seenKeys || []).length > AGENT19_MAX_SEEN_KEYS) {
    findings.push({
      code: 'seen_keys_over_cap',
      severity: 'fail',
      message: 'seenKeys exceeds bounded idempotency window.',
    });
  }
  memory.events.forEach((e, i) => {
    if (!e.stableKey?.trim()) {
      findings.push({ code: 'event_missing_stable_key', severity: 'warn', message: `Event ${i} missing stableKey.` });
    }
    if (Math.abs(e.valence) > 1.01) {
      findings.push({ code: 'event_valence_out_of_range', severity: 'warn', message: `Event ${i} valence ${e.valence} outside [-1,1].` });
    }
  });
  return findings;
}

export function memoryBoundsOk(memory: AiActorMemory | null | undefined): boolean {
  return !auditActorMemoryBounds(memory).some(f => f.severity === 'fail');
}
