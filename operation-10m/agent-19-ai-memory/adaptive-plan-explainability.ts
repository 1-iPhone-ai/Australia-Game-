import type { AiActorMemory } from './types.ts';

export function explainAdaptivePlan(memory: AiActorMemory | null | undefined): string[] {
  const plan = memory?.adaptivePlan;
  if (!plan) {
    return ['No adaptive counter-plan is active — memory has not revised a rival-focused objective yet.'];
  }
  const objective = plan.objectiveId.replace(/_/g, ' ');
  const lines = [`Adaptive plan: ${objective} (${plan.status}).`];
  if (plan.revisionReason) {
    lines.push(`Revision: ${plan.revisionReason}`);
  }
  lines.push('Adaptive plans are suggestions inside scoring — they never execute actions directly.');
  return lines;
}

export function adaptivePlanSummaryForInspection(memory: AiActorMemory | null | undefined): string | null {
  const plan = memory?.adaptivePlan;
  if (!plan) return null;
  return `${plan.status} counter-plan: ${plan.objectiveId.replace(/_/g, ' ')}`;
}
