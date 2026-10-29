export interface PersistenceGradientFrictionReport {
  frictionIndex: number;
  notes: string[];
}

/**
 * Persistence churn amplifying gradient–audit tension on layer state.
 */
export function computePersistenceGradientFrictionIndex(
  persistenceChurnIndex: number,
  gradientAuditTensionIndex: number,
  compositeHealthTrend: string | undefined,
): PersistenceGradientFrictionReport {
  const notes: string[] = [];
  if (persistenceChurnIndex >= 35 && gradientAuditTensionIndex >= 38) {
    notes.push('Persistence churn under gradient–audit tension');
  }
  if (compositeHealthTrend === 'declining' && persistenceChurnIndex >= 40) {
    notes.push('State churn while composite health is declining');
  }

  const trendBoost = compositeHealthTrend === 'declining' ? 10 : 0;
  const frictionIndex = Math.round(
    Math.min(
      100,
      persistenceChurnIndex * 0.4 +
        gradientAuditTensionIndex * 0.35 +
        trendBoost +
        (persistenceChurnIndex >= 42 && gradientAuditTensionIndex >= 42 ? 15 : 0),
    ),
  );

  return { frictionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPersistenceGradientFriction(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
