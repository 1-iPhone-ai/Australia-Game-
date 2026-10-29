export interface ResonancePressureCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure resonance cascading with pressure–cascade stack load.
 */
export function computeResonancePressureCascadeIndex(
  synthesisPressureResonanceIndex: number,
  pressureCascadeStackIndex: number,
  auditPressureIndex: number,
): ResonancePressureCascadeReport {
  const notes: string[] = [];
  if (synthesisPressureResonanceIndex >= 44 && pressureCascadeStackIndex >= 44) {
    notes.push('Pressure resonance and cascade stack both elevated');
  }
  if (auditPressureIndex >= 40 && synthesisPressureResonanceIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisPressureResonanceIndex * 0.37 +
        pressureCascadeStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisPressureResonanceIndex >= 48 && pressureCascadeStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
