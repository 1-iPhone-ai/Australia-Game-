import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalAdvocacyResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSteadfastResilienceOutlook,
  type AdvocacyResilienceBand
} from './types';

function resilienceBand(index: number): AdvocacyResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-52 / wave-52 advocacy resilience — steadfast resilience × advocacy levers (O10-235). */
export function computeNationalAdvocacyResilienceOutlook(
  state: NationalLaborDemographicsState,
  steadfastResilience: NationalSteadfastResilienceOutlook | null | undefined
): NationalAdvocacyResilienceOutlook {
  if (!state.enabled || !steadfastResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      steadfastDrag: 0,
      summary: 'Advocacy resilience idle — steadfast resilience unavailable.',
      stewardNote: 'Compute steadfast resilience before advocacy resilience guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const steadfastDrag = v1014laborClamp(
    steadfastResilience.resolveDrag * 0.44 +
      (steadfastResilience.band === 'ebbing' || steadfastResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    steadfastResilience.band === 'rising' || steadfastResilience.band === 'fortified'
      ? steadfastResilience.resilienceIndex * 0.18
      : steadfastResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + advocacyLift * 22 + resilienceLift - steadfastDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy advocacy resilience — deploy advocacy levers before subject advocacy assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify steadfast-advocacy coupling before auto workforce pushes.'
        : 'Rising resilience — align with steadfast resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    steadfastDrag,
    summary: `National advocacy resilience ${band} (index ${Math.round(resilienceIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}
