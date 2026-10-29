import { v1014laborClamp } from './bands';
import { perseveranceEaseForRegion } from './catalog/workforce-perseverance-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalPerseveranceResilienceOutlook,
  type NationalTenacityResilienceOutlook,
  type PerseveranceResilienceBand
} from './types';

function resilienceBand(index: number): PerseveranceResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-48 / wave-48 perseverance resilience — tenacity resilience × perseverance levers (O10-227). */
export function computeNationalPerseveranceResilienceOutlook(
  state: NationalLaborDemographicsState,
  tenacityResilience: NationalTenacityResilienceOutlook | null | undefined
): NationalPerseveranceResilienceOutlook {
  if (!state.enabled || !tenacityResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      tenacityDrag: 0,
      summary: 'Perseverance resilience idle — tenacity resilience unavailable.',
      stewardNote: 'Compute tenacity resilience before perseverance resilience guidance.'
    };
  }

  let perseveranceLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    perseveranceLift += perseveranceEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  perseveranceLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const tenacityDrag = v1014laborClamp(
    tenacityResilience.careDrag * 0.45 +
      (tenacityResilience.band === 'ebbing' || tenacityResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    tenacityResilience.band === 'rising' || tenacityResilience.band === 'fortified'
      ? tenacityResilience.resilienceIndex * 0.19
      : tenacityResilience.resilienceIndex * 0.1;

  const resilienceIndex = v1014laborClamp(24 + perseveranceLift * 22 + resilienceLift - tenacityDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy perseverance resilience — deploy perseverance levers before subject perseverance assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify tenacity-perseverance coupling before auto workforce pushes.'
        : 'Rising resilience — align with tenacity resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    tenacityDrag,
    summary: `National perseverance resilience ${band} (index ${Math.round(resilienceIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}
