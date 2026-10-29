import { v1014laborClamp } from './bands';
import { gritEaseForRegion } from './catalog/workforce-grit-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type GritResilienceBand,
  type NationalGritResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalPerseveranceResilienceOutlook
} from './types';

function resilienceBand(index: number): GritResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-49 / wave-49 grit resilience — perseverance resilience × grit levers (O10-229). */
export function computeNationalGritResilienceOutlook(
  state: NationalLaborDemographicsState,
  perseveranceResilience: NationalPerseveranceResilienceOutlook | null | undefined
): NationalGritResilienceOutlook {
  if (!state.enabled || !perseveranceResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      perseveranceDrag: 0,
      summary: 'Grit resilience idle — perseverance resilience unavailable.',
      stewardNote: 'Compute perseverance resilience before grit resilience guidance.'
    };
  }

  let gritLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    gritLift += gritEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  gritLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const perseveranceDrag = v1014laborClamp(
    perseveranceResilience.tenacityDrag * 0.44 +
      (perseveranceResilience.band === 'ebbing' || perseveranceResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    perseveranceResilience.band === 'rising' || perseveranceResilience.band === 'fortified'
      ? perseveranceResilience.resilienceIndex * 0.18
      : perseveranceResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + gritLift * 22 + resilienceLift - perseveranceDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy grit resilience — deploy grit levers before subject grit assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify perseverance-grit coupling before auto workforce pushes.'
        : 'Rising resilience — align with perseverance resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    perseveranceDrag,
    summary: `National grit resilience ${band} (index ${Math.round(resilienceIndex)}); perseverance drag ${Math.round(perseveranceDrag)}.`,
    stewardNote
  };
}
