import { v1014laborClamp } from './bands';
import { reengagementPullForRegion } from './catalog/workforce-reengagement-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type HouseholdParticipationCouplingBand,
  type NationalHouseholdParticipationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalParticipationEquityGapBrief,
  type NationalParticipationPressureBrief
} from './types';

function couplingBand(index: number): HouseholdParticipationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'reinforcing';
}

export function computeNationalHouseholdParticipationCouplingBrief(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  equity: NationalParticipationEquityGapBrief | null | undefined
): NationalHouseholdParticipationCouplingBrief {
  if (!state.enabled || !participation || !equity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      budgetPressureDrag: 0,
      summary: 'Household-participation coupling idle — participation or equity unavailable.',
      stewardNote: 'Compute participation and equity before household coupling guidance.'
    };
  }

  let budgetPressure = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    budgetPressure += state.regions[regionId]?.householdBudgetPressureScore ?? 50;
  });
  budgetPressure /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  const budgetPressureDrag = v1014laborClamp((budgetPressure - 45) * 0.55);

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationLift = participation.participationIndex * 0.32;
  const equityLift = equity.equityIndex * 0.22;
  const equityDrag =
    equity.band === 'wide_gap' ? 14 : equity.band === 'uneven' ? 8 : 0;

  const couplingIndex = v1014laborClamp(
    28 + participationLift + equityLift + reengagementLift * 20 - budgetPressureDrag - equityDrag
  );
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained household-participation coupling — ease budget pressure before participation pushes.'
      : band === 'reinforcing'
        ? 'Reinforcing coupling — maintain reengagement levers while scaling inclusion packs.'
        : 'Aligned coupling — monitor equity gaps in severe affordability regions.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    budgetPressureDrag,
    summary: `Household-participation coupling ${band} (index ${Math.round(couplingIndex)}); budget drag ${Math.round(budgetPressureDrag)}.`,
    stewardNote
  };
}
