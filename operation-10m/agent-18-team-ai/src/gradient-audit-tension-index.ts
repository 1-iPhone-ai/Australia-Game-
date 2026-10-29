export interface GradientAuditTensionReport {
  tensionIndex: number;
  notes: string[];
}

/**
 * Composite health gradient decline under rising audit pressure.
 */
export function computeGradientAuditTensionIndex(
  compositeHealthGradientIndex: number,
  compositeHealthTrend: string | undefined,
  auditPressureIndex: number,
): GradientAuditTensionReport {
  const notes: string[] = [];
  const declining =
    compositeHealthTrend === 'declining' || compositeHealthGradientIndex >= 42;
  if (declining && auditPressureIndex >= 35) {
    notes.push('Composite health declining while audit pressure rises');
  }
  if (auditPressureIndex >= 45 && compositeHealthGradientIndex >= 38) {
    notes.push('High audit pressure against negative composite gradient');
  }

  const trendBoost = compositeHealthTrend === 'declining' ? 12 : 0;
  const tensionIndex = Math.round(
    Math.min(
      100,
      compositeHealthGradientIndex * 0.3 +
        auditPressureIndex * 0.42 +
        trendBoost +
        (declining && auditPressureIndex >= 40 ? 15 : 0),
    ),
  );

  return { tensionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamGradientAuditTension(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
