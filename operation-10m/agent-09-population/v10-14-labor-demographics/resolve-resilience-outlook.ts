import { v1014laborClamp } from './bands';
import { resolveEaseForRegion } from './catalog/workforce-resolve-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalGritResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalResolveResilienceOutlook,
  type ResolveResilienceBand
} from './types';

function resilienceBand(index: number): ResolveResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-50 / wave-50 resolve resilience — grit resilience × resolve levers (O10-231). */
export function computeNationalResolveResilienceOutlook(
  state: NationalLaborDemographicsState,
  gritResilience: NationalGritResilienceOutlook | null | undefined
): NationalResolveResilienceOutlook {
  if (!state.enabled || !gritResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      gritDrag: 0,
      summary: 'Resolve resilience idle — grit resilience unavailable.',
      stewardNote: 'Compute grit resilience before resolve resilience guidance.'
    };
  }

  let resolveLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    resolveLift += resolveEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  resolveLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const gritDrag = v1014laborClamp(
    gritResilience.perseveranceDrag * 0.44 +
      (gritResilience.band === 'ebbing' || gritResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    gritResilience.band === 'rising' || gritResilience.band === 'fortified'
      ? gritResilience.resilienceIndex * 0.18
      : gritResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + resolveLift * 22 + resilienceLift - gritDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy resolve resilience — deploy resolve levers before subject resolve assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify grit-resolve coupling before auto workforce pushes.'
        : 'Rising resilience — align with grit resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    gritDrag,
    summary: `National resolve resilience ${band} (index ${Math.round(resilienceIndex)}); grit drag ${Math.round(gritDrag)}.`,
    stewardNote
  };
}
