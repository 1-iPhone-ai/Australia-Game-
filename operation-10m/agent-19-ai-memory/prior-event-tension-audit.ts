import { listPersistentPriorBeliefs } from './prior-explainability.ts';
import type { AiActorMemory, MemoryInfluenceAuditFinding } from './types.ts';

export const AGENT19_PRIOR_EVENT_VALENCE_TENSION = -0.35;

/** Warn when cross-match priors imply cooperation but recent committed events are strongly negative. */
export function auditPriorEventTension(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean; recentEventWindow?: number },
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!opts?.persistentMemoryEnabled || !memory) return findings;
  const window = opts.recentEventWindow ?? 6;
  const recent = [...(memory.events || [])]
    .sort((a, b) => b.turn - a.turn)
    .slice(0, window);
  const hostile = recent.filter(e => e.valence <= AGENT19_PRIOR_EVENT_VALENCE_TENSION);
  if (!hostile.length) return findings;
  const priors = listPersistentPriorBeliefs(memory);
  const cooperativePrior = priors.find(
    p => (p.beliefKey === 'cooperative' || p.beliefKey === 'cooperation') && p.value >= 0.55,
  );
  if (cooperativePrior) {
    findings.push({
      code: 'prior_event_tension',
      severity: 'warn',
      message: `Cross-match prior suggests ${cooperativePrior.subjectActorId} is cooperative, but ${hostile.length} recent event(s) are strongly negative — explainability should mention both.`,
    });
  }
  const aggressivePrior = priors.find(p => p.beliefKey === 'aggressive' && p.value >= 0.65);
  if (aggressivePrior && hostile.every(e => e.actorId === aggressivePrior.subjectActorId)) {
    findings.push({
      code: 'prior_reinforced',
      severity: 'info',
      message: `Recent hostile events toward ${aggressivePrior.subjectActorId} align with saved aggressive prior — influence may compound.`,
    });
  }
  return findings;
}

export function priorEventTensionOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}
