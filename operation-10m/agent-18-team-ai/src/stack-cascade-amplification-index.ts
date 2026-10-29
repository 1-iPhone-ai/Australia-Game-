export interface StackCascadeAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion stack amplified by resonance–audit cascade load.
 */
export function computeStackCascadeAmplificationIndex(
  convergenceFusionStackIndex: number,
  resonanceAuditCascadeIndex: number,
  auditPressureIndex: number,
): StackCascadeAmplificationReport {
  const notes: string[] = [];
  if (convergenceFusionStackIndex >= 44 && resonanceAuditCascadeIndex >= 42) {
    notes.push('Convergence stack and audit cascade both elevated');
  }
  if (auditPressureIndex >= 40 && convergenceFusionStackIndex >= 46) {
    notes.push('Audit pressure amplifying stack–cascade load');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      convergenceFusionStackIndex * 0.36 +
        resonanceAuditCascadeIndex * 0.38 +
        auditPressureIndex * 0.2 +
        (convergenceFusionStackIndex >= 48 && resonanceAuditCascadeIndex >= 44 ? 15 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackCascadeAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
