export interface PressureStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Pressure–stack fusion synthesizing with fusion–stack synthesis under audit load.
 */
export function computePressureStackSynthesisIndex(
  pressureStackFusionIndex: number,
  fusionStackSynthesisIndex: number,
  auditPressureIndex: number,
): PressureStackSynthesisReport {
  const notes: string[] = [];
  if (pressureStackFusionIndex >= 44 && fusionStackSynthesisIndex >= 44) {
    notes.push('Stack fusion and stack synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && pressureStackFusionIndex >= 46) {
    notes.push('Audit pressure driving pressure–stack synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      pressureStackFusionIndex * 0.37 +
        fusionStackSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureStackFusionIndex >= 48 && fusionStackSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
