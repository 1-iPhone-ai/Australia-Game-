import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type { SupplementaryEstimatesReport } from '../supplementary-estimates/types';
import type { BudgetNeutralPackageLine, BudgetNeutralPackagesReport } from './types';
import { BUDGET_NEUTRAL_PACKAGES_SCHEMA } from './types';

const NET_NEUTRALITY_CAP = 1.8;

function pkg(
  id: string,
  title: string,
  spend: number,
  offset: number
): BudgetNeutralPackageLine {
  const netPoints = Math.round((spend - offset) * 10) / 10;
  return {
    id,
    title,
    newSpendingPoints: Math.round(spend * 10) / 10,
    offsetPoints: Math.round(offset * 10) / 10,
    netPoints,
    withinNeutralityBand: Math.abs(netPoints) <= NET_NEUTRALITY_CAP
  };
}

export function buildBudgetNeutralPackagesReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  spendingOffsets: SpendingOffsetsReport,
  supplementary: SupplementaryEstimatesReport
): BudgetNeutralPackagesReport {
  const electionWindow = turn % 12 >= 9;
  const baseSpend = spendingOffsets.aggregateNewSpending / Math.max(1, spendingOffsets.lines.length);
  const baseOffset = spendingOffsets.aggregateOffsets / Math.max(1, spendingOffsets.lines.length);

  let packages: BudgetNeutralPackageLine[] = [
    pkg('bnp_care', 'Care economy bundle', baseSpend * 1.05, baseOffset * 1.02),
    pkg('bnp_energy', 'Energy transition bundle', baseSpend * 0.95, baseOffset * 0.98),
    pkg('bnp_skills', 'Skills and migration bundle', baseSpend * 1.1, baseOffset * 1.05 + (electionWindow ? 0.3 : 0)),
    pkg('bnp_infra', 'Infrastructure pinch bundle', baseSpend * 0.9, baseOffset * 0.92)
  ];

  if (v1012.pressure !== 'critical') {
    packages = packages.map(p => {
      if (p.withinNeutralityBand) return p;
      const targetNet = Math.sign(p.netPoints) * NET_NEUTRALITY_CAP;
      const offsetPoints = Math.round((p.newSpendingPoints - targetNet) * 10) / 10;
      return {
        ...p,
        offsetPoints,
        netPoints: targetNet,
        withinNeutralityBand: true
      };
    });
  }

  const aggregateNewSpending = Math.round(packages.reduce((s, p) => s + p.newSpendingPoints, 0) * 10) / 10;
  const aggregateOffsets = Math.round(packages.reduce((s, p) => s + p.offsetPoints, 0) * 10) / 10;
  const aggregateNetPoints = Math.round(packages.reduce((s, p) => s + p.netPoints, 0) * 10) / 10;

  const withinPortfolioNeutrality =
    Math.abs(aggregateNetPoints) <= NET_NEUTRALITY_CAP * 2.2 ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateNetPoints) <= NET_NEUTRALITY_CAP * 2.8);

  const coherentWithSpendingOffsets =
    Math.abs(aggregateNewSpending - spendingOffsets.aggregateNewSpending) <= 6 ||
    Math.abs(aggregateOffsets - spendingOffsets.aggregateOffsets) <= 6 ||
    supplementary.withinRevisionTolerance ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioNeutrality) {
    warnings.push(`Aggregate net ${aggregateNetPoints} exceeds neutrality band.`);
  }
  if (!coherentWithSpendingOffsets) {
    warnings.push('Package totals diverge from spending offsets portfolio.');
  }

  const narrative = withinPortfolioNeutrality
    ? `Budget-neutral packages net ${aggregateNetPoints} (new ${aggregateNewSpending}, offsets ${aggregateOffsets}).`
    : `Neutrality review: net ${aggregateNetPoints}.`;

  return {
    schemaVersion: BUDGET_NEUTRAL_PACKAGES_SCHEMA,
    turn,
    packages,
    aggregateNewSpending,
    aggregateOffsets,
    aggregateNetPoints,
    withinPortfolioNeutrality,
    coherentWithSpendingOffsets,
    narrative,
    warnings
  };
}
