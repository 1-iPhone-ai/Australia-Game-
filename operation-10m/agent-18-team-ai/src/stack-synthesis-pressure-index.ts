export interface StackSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Pressure–stack synthesis pressuring with fusion–stack resonance under audit load.
 */
export function computeStackSynthesisPressureIndex(
  pressureStackSynthesisIndex: number,
  fusionStackResonanceIndex: number,
  auditPressureIndex: number,
): StackSynthesisPressureReport {
  const notes: string[] = [];
  if (pressureStackSynthesisIndex >= 44 && fusionStackResonanceIndex >= 44) {
    notes.push('Stack synthesis and stack resonance both elevated');
  }
  if (auditPressureIndex >= 40 && pressureStackSynthesisIndex >= 46) {
    notes.push('Audit pressure driving stack–synthesis pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      pressureStackSynthesisIndex * 0.37 +
        fusionStackResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureStackSynthesisIndex >= 48 && fusionStackResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
