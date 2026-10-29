import { v1014laborClamp } from './bands';
import { steadfastEaseForRegion } from './catalog/workforce-steadfast-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResolveResilienceOutlook,
  type NationalSteadfastResilienceOutlook,
  type SteadfastResilienceBand
} from './types';

function resilienceBand(index: number): SteadfastResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-51 / wave-51 steadfast resilience — resolve resilience × steadfast levers (O10-233). */
export function computeNationalSteadfastResilienceOutlook(
  state: NationalLaborDemographicsState,
  resolveResilience: NationalResolveResilienceOutlook | null | undefined
): NationalSteadfastResilienceOutlook {
  if (!state.enabled || !resolveResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      resolveDrag: 0,
      summary: 'Steadfast resilience idle — resolve resilience unavailable.',
      stewardNote: 'Compute resolve resilience before steadfast resilience guidance.'
    };
  }

  let steadfastLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    steadfastLift += steadfastEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  steadfastLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resolveDrag = v1014laborClamp(
    resolveResilience.gritDrag * 0.44 +
      (resolveResilience.band === 'ebbing' || resolveResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    resolveResilience.band === 'rising' || resolveResilience.band === 'fortified'
      ? resolveResilience.resilienceIndex * 0.18
      : resolveResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + steadfastLift * 22 + resilienceLift - resolveDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy steadfast resilience — deploy steadfast levers before subject steadfast assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify resolve-steadfast coupling before auto workforce pushes.'
        : 'Rising resilience — align with resolve resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    resolveDrag,
    summary: `National steadfast resilience ${band} (index ${Math.round(resilienceIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}
