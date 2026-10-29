import type { AiActorMemory, AiRelationship } from './types.ts';

export interface RelationshipExplainabilityAxis {
  key: keyof Pick<AiRelationship, 'trust' | 'respect' | 'rivalry' | 'cooperation' | 'grievance' | 'gratitude'>;
  label: string;
  value: number;
}

const AXIS_LABELS: Record<RelationshipExplainabilityAxis['key'], string> = {
  trust: 'Trust',
  respect: 'Respect',
  rivalry: 'Rivalry',
  cooperation: 'Cooperation',
  grievance: 'Grievance',
  gratitude: 'Gratitude',
};

export function pickDominantRelationshipAxes(rel: AiRelationship, limit = 3): RelationshipExplainabilityAxis[] {
  const keys = Object.keys(AXIS_LABELS) as RelationshipExplainabilityAxis['key'][];
  const ranked = keys
    .map(key => ({ key, label: AXIS_LABELS[key], value: rel[key] ?? 0 }))
    .sort((a, b) => Math.abs(b.value - 50) - Math.abs(a.value - 50) || b.value - a.value);
  return ranked.slice(0, limit);
}

export function buildRelationshipExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  targetActorId: string,
): string[] {
  const rel = memory?.relationships?.[targetActorId];
  if (!rel) {
    return [`No relationship track yet toward ${targetActorId} — influence from match events will appear after committed actions.`];
  }
  const axes = pickDominantRelationshipAxes(rel);
  const lines = [
    `Relationship toward ${targetActorId} (updated turn ${rel.lastUpdatedTurn}):`,
    ...axes.map(a => `• ${a.label} ${a.value}/100`),
  ];
  if (rel.threat >= 60) lines.push('High perceived threat may push defensive or aggressive memory nudges.');
  if (rel.grievance >= 55) lines.push('Stored grievances can amplify punitive score adjustments.');
  if (rel.gratitude >= 55) lines.push('Gratitude can soften rivalry-driven penalties when cooperation is high.');
  return lines;
}

export function listTrackedRelationshipActorIds(memory: AiActorMemory | null | undefined): string[] {
  return Object.keys(memory?.relationships || {}).sort();
}
