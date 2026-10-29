import { v1014laborClamp } from './bands';
import type { NationalHouseholdBudgetDetail } from './types';
import {
  EMPLOYMENT_LINKAGE_LABEL,
  MIGRATION_FLOW_LABEL,
  V1014_LABOR_CORE_REGIONS,
  WAGE_PRESSURE_LABEL,
  type IntegratedLaborMarketBrief,
  type IntegratedLaborPressureBand,
  type NationalLaborDemographicsState
} from './types';

function pressureBand(index: number): IntegratedLaborPressureBand {
  if (index < 35) return 'low';
  if (index < 55) return 'moderate';
  if (index < 72) return 'elevated';
  return 'critical';
}

export function computeIntegratedLaborMarketBrief(
  state: NationalLaborDemographicsState,
  householdBudget?: NationalHouseholdBudgetDetail | null
): IntegratedLaborMarketBrief {
  const regionalScores = V1014_LABOR_CORE_REGIONS.map(c => {
    const r = state.regions[c];
    if (!r) return { regionId: c, strain: 50, opportunity: 50 };
    const strain = v1014laborClamp(
      r.wagePressureScore * 0.35 +
        (r.householdBudgetPressureScore ?? 50) * 0.35 +
        r.workforceStrainIndex * 0.3
    );
    const opportunity = v1014laborClamp(
      r.employmentLinkageScore * 0.45 +
        r.migrationFlowScore * 0.35 +
        (100 - (r.automationPressureIndex ?? 50)) * 0.2
    );
    return { regionId: c, strain, opportunity };
  });

  const topStrainRegions = [...regionalScores]
    .sort((a, b) => b.strain - a.strain)
    .slice(0, 3)
    .map(x => x.regionId);
  const topOpportunityRegions = [...regionalScores]
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, 3)
    .map(x => x.regionId);

  const shockLoad = (state.activeMigrationShocks?.length ?? 0) * 4;
  const budgetLoad = householdBudget?.nationalBudgetPressureScore ?? 50;
  const compositePressureIndex = v1014laborClamp(
    state.wagePressureScore * 0.28 +
      state.employmentLinkageScore * 0.12 +
      (100 - state.migrationFlowScore) * 0.1 +
      budgetLoad * 0.25 +
      shockLoad +
      (state.automationFeedbackSummary ? 6 : 0)
  );

  const band = pressureBand(compositePressureIndex);
  const dominantRisk =
    state.wagePressureScore >= 62
      ? WAGE_PRESSURE_LABEL[state.nationalWagePressure]
      : budgetLoad >= 60
        ? 'Household budget pressure'
        : EMPLOYMENT_LINKAGE_LABEL[state.nationalEmploymentLinkage];
  const dominantOpportunity =
    state.migrationFlowScore >= 58
      ? MIGRATION_FLOW_LABEL[state.nationalMigrationFlow]
      : 'Output-linked employment strength';

  const narrative = `Composite labor pressure ${Math.round(compositePressureIndex)} (${band}): ${dominantRisk}; opportunity via ${dominantOpportunity.toLowerCase()}.`;

  return {
    turn: state.turn,
    compositePressureIndex,
    pressureBand: band,
    topStrainRegions,
    topOpportunityRegions,
    dominantRisk,
    dominantOpportunity,
    narrative,
    evidence: [
      `Strain hubs: ${topStrainRegions.join(', ')}`,
      `Opportunity hubs: ${topOpportunityRegions.join(', ')}`,
      `${state.activeMigrationShocks?.length ?? 0} migration shock(s) active`
    ]
  };
}
