export interface PressureFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis pressure fusing with fusion–resonance stack under audit load.
 */
export function computePressureFusionStackIndex(
  stackSynthesisPressureIndex: number,
  fusionResonanceStackIndex: number,
  auditPressureIndex: number,
): PressureFusionStackReport {
  const notes: string[] = [];
  if (stackSynthesisPressureIndex >= 44 && fusionResonanceStackIndex >= 44) {
    notes.push('Synthesis pressure and resonance stack both elevated');
  }
  if (auditPressureIndex >= 40 && stackSynthesisPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–fusion stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisPressureIndex * 0.37 +
        fusionResonanceStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (stackSynthesisPressureIndex >= 48 && fusionResonanceStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
