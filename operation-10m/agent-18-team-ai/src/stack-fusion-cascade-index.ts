export interface StackFusionCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–cascade stack cascading with resonance–stack fusion under audit load.
 */
export function computeStackFusionCascadeIndex(
  synthesisCascadeStackIndex: number,
  resonanceStackFusionIndex: number,
  auditPressureIndex: number,
): StackFusionCascadeReport {
  const notes: string[] = [];
  if (synthesisCascadeStackIndex >= 44 && resonanceStackFusionIndex >= 44) {
    notes.push('Cascade stack and stack fusion both elevated');
  }
  if (auditPressureIndex >= 40 && synthesisCascadeStackIndex >= 46) {
    notes.push('Audit pressure driving stack–fusion cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisCascadeStackIndex * 0.37 +
        resonanceStackFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisCascadeStackIndex >= 48 && resonanceStackFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFusionCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
