import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CostRecoveryLine, CostRecoveryStatement } from './types';
import { COST_RECOVERY_SCHEMA } from './types';

const BASE_LINES: Omit<CostRecoveryLine, 'recoveredPoints' | 'recoveryRatio' | 'withinTarget'>[] = [
  {
    category: 'water_sewerage',
    label: 'Urban water & sewerage',
    fullCostPoints: 14,
    policyTargetRatio: 0.75
  },
  {
    category: 'road_tolling',
    label: 'Major road tolling',
    fullCostPoints: 9,
    policyTargetRatio: 0.55
  },
  {
    category: 'regulatory_licensing',
    label: 'Regulatory licensing fees',
    fullCostPoints: 6,
    policyTargetRatio: 0.85
  },
  {
    category: 'hospital_copayment',
    label: 'Hospital copayments (selected services)',
    fullCostPoints: 11,
    policyTargetRatio: 0.35
  },
  {
    category: 'university_contribution',
    label: 'Higher education student contributions',
    fullCostPoints: 16,
    policyTargetRatio: 0.42
  }
];

function pressureRecoveryScale(v1012: V1012FiscalSnapshot): number {
  if (v1012.revenuePolicy === 'revenue_focused') return 1.08;
  if (v1012.pressure === 'critical') return 0.82;
  if (v1012.pressure === 'strained') return 0.92;
  return 1;
}

export function buildCostRecoveryStatement(turn: number, v1012: V1012FiscalSnapshot): CostRecoveryStatement {
  const scale = pressureRecoveryScale(v1012);
  const headroomAdj = v1012.fiscalHeadroom < 0 ? 0.94 : 1;

  const lines: CostRecoveryLine[] = BASE_LINES.map(row => {
    const jitter = ((turn + row.fullCostPoints) % 7) * 0.005;
    const recoveryRatio = Math.min(
      1,
      Math.round((row.policyTargetRatio * scale * headroomAdj + jitter) * 1000) / 1000
    );
    const recoveredPoints = Math.round(row.fullCostPoints * recoveryRatio * 10) / 10;
    const withinTarget = recoveryRatio >= row.policyTargetRatio * 0.85 || v1012.pressure === 'critical';
    return {
      ...row,
      recoveredPoints,
      recoveryRatio,
      withinTarget
    };
  });

  const aggregateFullCost = lines.reduce((s, l) => s + l.fullCostPoints, 0);
  const aggregateRecovered = lines.reduce((s, l) => s + l.recoveredPoints, 0);
  const weightedRecoveryRatio =
    aggregateFullCost > 0
      ? Math.round((aggregateRecovered / aggregateFullCost) * 1000) / 1000
      : 0;

  const underRecoveryCount = lines.filter(l => !l.withinTarget).length;
  const portfolioFloor = v1012.revenuePolicy === 'revenue_focused' ? 0.48 : 0.42;
  const withinPortfolioTarget =
    weightedRecoveryRatio >= portfolioFloor || v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (underRecoveryCount >= 2 && v1012.fiscalHeadroom < 4) {
    warnings.push(`${underRecoveryCount} charge lines under recovery target with limited headroom.`);
  }
  if (!withinPortfolioTarget) {
    warnings.push(`Portfolio recovery ${weightedRecoveryRatio} below floor ${portfolioFloor}.`);
  }

  const narrative = withinPortfolioTarget
    ? `Cost recovery portfolio at ${(weightedRecoveryRatio * 100).toFixed(1)}% of full cost.`
    : `Cost recovery shortfall: weighted ratio ${weightedRecoveryRatio}.`;

  return {
    schemaVersion: COST_RECOVERY_SCHEMA,
    turn,
    lines,
    aggregateFullCost,
    aggregateRecovered,
    weightedRecoveryRatio,
    withinPortfolioTarget,
    underRecoveryCount,
    narrative,
    warnings
  };
}
