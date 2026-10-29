import { v1014laborBandMigration, v1014laborBandWage, v1014laborClamp } from './bands';
import { lookupRegionalLaborBaseline } from './catalog/regional-labor-baselines';
import type { LaborDemographicsRegionSnapshot, WagePressureBand } from './types';

/** Coupling index: high wages + high budget pressure → stronger outflow feedback. */
export function computeRegionalWageMigrationCoupling(snapshot: LaborDemographicsRegionSnapshot): {
  couplingIndex: number;
  wageMigrationFeedback: number;
  explanation: string;
} {
  const baseline = lookupRegionalLaborBaseline(snapshot.regionId);
  const elasticity = baseline?.migrationElasticity ?? 0.7;
  const stickiness = (baseline?.wageStickinessIndex ?? 50) / 100;
  const budgetPressure = snapshot.householdBudgetPressureScore ?? 50;

  const wageHot =
    snapshot.wagePressure === 'elevated' ||
    snapshot.wagePressure === 'surging' ||
    snapshot.wagePressureScore >= 62;
  const wageCool =
    snapshot.wagePressure === 'deflationary' ||
    snapshot.wagePressure === 'soft' ||
    snapshot.wagePressureScore <= 38;

  let feedback = 0;
  if (wageHot && budgetPressure >= 55) {
    feedback = -v1014laborClamp((snapshot.wagePressureScore - 50) * 0.12 * elasticity + budgetPressure * 0.05);
  } else if (wageHot && budgetPressure <= 40) {
    feedback = v1014laborClamp((snapshot.wagePressureScore - 50) * 0.1 * elasticity);
  } else if (wageCool && budgetPressure >= 60) {
    feedback = -v1014laborClamp(budgetPressure * 0.08 * elasticity);
  }

  feedback *= 1 - stickiness * 0.25;
  const couplingIndex = v1014laborClamp(50 + Math.abs(feedback) * 3 + (wageHot ? 8 : 0));

  const explanation = wageHot
    ? `Wage pressure (${snapshot.wagePressure}) interacts with budget pressure ${Math.round(budgetPressure)} → migration feedback ${feedback.toFixed(1)}.`
    : `Wage–migration coupling muted (${snapshot.wagePressure}).`;

  return { couplingIndex, wageMigrationFeedback: feedback, explanation };
}

export function applyWageMigrationCouplingToRegions(
  regions: Record<string, LaborDemographicsRegionSnapshot>
): { explanations: string[] } {
  const explanations: string[] = [];
  Object.values(regions).forEach(reg => {
    const { wageMigrationFeedback, explanation } = computeRegionalWageMigrationCoupling(reg);
    if (Math.abs(wageMigrationFeedback) < 0.5) return;
    const nextMig = v1014laborClamp(reg.migrationFlowScore + wageMigrationFeedback);
    reg.migrationFlowScore = nextMig;
    reg.migrationFlow = v1014laborBandMigration(nextMig);
    const wageAdj = v1014laborClamp(reg.wagePressureScore + wageMigrationFeedback * 0.15);
    reg.wagePressureScore = wageAdj;
    reg.wagePressure = v1014laborBandWage(wageAdj) as WagePressureBand;
    explanations.push(`${reg.regionId}: ${explanation}`);
  });
  return { explanations };
}
