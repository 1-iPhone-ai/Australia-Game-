import { v1014laborClamp } from './bands';
import { tenacityEaseForRegion } from './catalog/workforce-tenacity-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalCareBalanceOutlook,
  type NationalLaborDemographicsState,
  type NationalTenacityResilienceOutlook,
  type TenacityResilienceBand
} from './types';

function resilienceBand(index: number): TenacityResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

export function computeNationalTenacityResilienceOutlook(
  state: NationalLaborDemographicsState,
  careBalance: NationalCareBalanceOutlook | null | undefined
): NationalTenacityResilienceOutlook {
  if (!state.enabled || !careBalance) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      careDrag: 0,
      summary: 'Tenacity resilience idle — care balance unavailable.',
      stewardNote: 'Compute care balance before tenacity resilience guidance.'
    };
  }

  let tenacityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    tenacityLift += tenacityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  tenacityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const careDrag = v1014laborClamp(
    careBalance.safetyDrag * 0.46 +
      (careBalance.band === 'ebbing' || careBalance.band === 'patchy' ? 10 : 3)
  );
  const balanceLift =
    careBalance.band === 'rising' || careBalance.band === 'balanced'
      ? careBalance.balanceIndex * 0.2
      : careBalance.balanceIndex * 0.1;

  const resilienceIndex = v1014laborClamp(24 + tenacityLift * 22 + balanceLift - careDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy tenacity resilience — deploy tenacity levers before subject tenacity assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify care-tenacity coupling before auto workforce pushes.'
        : 'Rising resilience — align with care balance outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    careDrag,
    summary: `National tenacity resilience ${band} (index ${Math.round(resilienceIndex)}); care drag ${Math.round(careDrag)}.`,
    stewardNote
  };
}
