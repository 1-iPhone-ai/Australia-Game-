import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborMarketBrief,
  LaborResilienceBand,
  LaborResilienceDimension,
  LaborResilienceScorecard,
  NationalHouseholdBudgetDetail,
  NationalLaborDemographicsState,
  NationalWorkforceCapacityBridge
} from './types';

function resilienceBand(score: number): LaborResilienceBand {
  if (score < 38) return 'fragile';
  if (score < 52) return 'watchful';
  if (score < 68) return 'steady';
  return 'robust';
}

function dimBand(score: number): LaborResilienceBand {
  return resilienceBand(score);
}

export function computeLaborResilienceScorecard(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  householdBudget: NationalHouseholdBudgetDetail | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): LaborResilienceScorecard {
  const shockCount = state.activeMigrationShocks?.length ?? 0;
  const shockBuffer = v1014laborClamp(72 - shockCount * 9 - (brief?.compositePressureIndex ?? 50) * 0.12);
  const budgetCushion = v1014laborClamp(100 - (householdBudget?.nationalBudgetPressureScore ?? 50));
  const automationHeadroom = v1014laborClamp(
    100 - (state.regions.NSW?.automationPressureIndex ?? 50) * 0.45 - (state.automationFeedbackSummary ? 8 : 0)
  );
  const capacityMargin = v1014laborClamp(100 - (capacityBridge?.nationalGapIndex ?? 40));

  const dimensions: LaborResilienceDimension[] = [
    {
      id: 'shock_buffer',
      score: shockBuffer,
      band: dimBand(shockBuffer),
      label: 'Migration shock buffer'
    },
    {
      id: 'budget_cushion',
      score: budgetCushion,
      band: dimBand(budgetCushion),
      label: 'Household budget cushion'
    },
    {
      id: 'automation_headroom',
      score: automationHeadroom,
      band: dimBand(automationHeadroom),
      label: 'Automation transition headroom'
    },
    {
      id: 'capacity_margin',
      score: capacityMargin,
      band: dimBand(capacityMargin),
      label: 'Workforce capacity margin'
    }
  ];

  const compositeScore = v1014laborClamp(
    dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length
  );
  const band = resilienceBand(compositeScore);
  const headline = `Labor resilience ${band} (${Math.round(compositeScore)}) — ${dimensions.sort((a, b) => a.score - b.score)[0]?.label.toLowerCase() ?? 'mixed'} weakest.`;
  const stewardNote =
    band === 'fragile'
      ? 'Resilience fragile — defer stacked automation and ease household strain before migration shocks.'
      : band === 'watchful'
        ? 'Resilience watchful — monitor strain hubs and corridor pull before major workforce shifts.'
        : 'Resilience adequate for bounded labor band movement.';

  return {
    turn: state.turn,
    compositeScore,
    band,
    dimensions,
    headline,
    stewardNote
  };
}
