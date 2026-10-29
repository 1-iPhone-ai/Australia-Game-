import type { DebtOutcomeTrajectory, FiscalOutcomeBand, V1012FiscalSnapshot } from './types';

function bandFromRisk(score: number): FiscalOutcomeBand {
  if (score >= 75) return 'strong';
  if (score >= 58) return 'healthy';
  if (score >= 42) return 'mixed';
  if (score >= 25) return 'weak';
  return 'critical';
}

export function computeDebtOutcomeTrajectory(v1012: V1012FiscalSnapshot): DebtOutcomeTrajectory {
  const currentServiceLoad = v1012.debtServiceLoad;
  const debtLevel = v1012.debtEnabled ? v1012.debtLevel : 0;
  const projectedServiceLoad =
    Math.round((currentServiceLoad + debtLevel * 0.04 + v1012.maintenanceLoad * 0.02) * 10) / 10;

  const borrowingHeadroom = Math.max(
    0,
    Math.round((45 - debtLevel - currentServiceLoad * 1.2) * 10) / 10
  );

  let sustainability: DebtOutcomeTrajectory['sustainability'] = 'stable';
  if (!v1012.debtEnabled && debtLevel <= 1) sustainability = 'improving';
  else if (projectedServiceLoad > 18 || debtLevel > 55) sustainability = 'distress';
  else if (projectedServiceLoad > 12 || debtLevel > 38) sustainability = 'stress';
  else if (projectedServiceLoad > 8 || debtLevel > 28) sustainability = 'watch';
  else if (projectedServiceLoad < currentServiceLoad - 0.5) sustainability = 'improving';

  let turnsToStress: number | null = null;
  if (sustainability === 'watch') turnsToStress = 6;
  if (sustainability === 'stress') turnsToStress = 3;
  if (sustainability === 'distress') turnsToStress = 1;

  const riskScore = Math.max(
    0,
    Math.min(
      100,
      88 -
        projectedServiceLoad * 2.2 -
        debtLevel * 0.45 +
        (v1012.sustainability === 'very_strong' ? 8 : v1012.sustainability === 'strong' ? 4 : 0)
    )
  );

  const outcomeRisk = bandFromRisk(riskScore);
  const evidence: string[] = [];
  if (v1012.debtEnabled) evidence.push(`Sovereign debt enabled at level ${debtLevel}.`);
  evidence.push(`Debt service load ${currentServiceLoad} → projected ${projectedServiceLoad}.`);
  if (borrowingHeadroom < 8) evidence.push('Borrowing headroom tight for acceleration programs.');

  const narrative =
    sustainability === 'distress'
      ? 'Debt service and maintenance compound — fiscal outcomes likely weaken without staging or revenue policy adjustment.'
      : sustainability === 'improving'
      ? 'Debt service manageable — room to fund productivity investments if commitments stay disciplined.'
      : `Debt path is ${sustainability}; monitor service load against maintenance and recovery stacks.`;

  return {
    currentServiceLoad,
    projectedServiceLoad,
    borrowingHeadroom,
    sustainability,
    turnsToStress,
    outcomeRisk,
    narrative,
    evidence
  };
}
