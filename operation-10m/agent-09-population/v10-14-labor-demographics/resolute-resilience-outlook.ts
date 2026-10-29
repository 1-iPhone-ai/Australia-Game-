import { v1014laborClamp } from './bands';
import { resoluteEaseForRegion } from './catalog/workforce-resolute-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalAdvocacyResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalResoluteResilienceOutlook,
  type ResoluteResilienceBand
} from './types';

function resilienceBand(index: number): ResoluteResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-54 / wave-54 resolute resilience — advocacy resilience × resolute levers (O10-240). */
export function computeNationalResoluteResilienceOutlook(
  state: NationalLaborDemographicsState,
  advocacyResilience: NationalAdvocacyResilienceOutlook | null | undefined
): NationalResoluteResilienceOutlook {
  if (!state.enabled || !advocacyResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      advocacyDrag: 0,
      summary: 'Resolute resilience idle — advocacy resilience unavailable.',
      stewardNote: 'Compute advocacy resilience before resolute resilience guidance.'
    };
  }

  let resoluteLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    resoluteLift += resoluteEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  resoluteLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacyResilience.steadfastDrag * 0.44 +
      (advocacyResilience.band === 'ebbing' || advocacyResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    advocacyResilience.band === 'rising' || advocacyResilience.band === 'fortified'
      ? advocacyResilience.resilienceIndex * 0.18
      : advocacyResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + resoluteLift * 22 + resilienceLift - advocacyDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy resolute resilience — deploy resolute levers before subject resolute assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify advocacy-resolute coupling before auto workforce pushes.'
        : 'Rising resilience — align with advocacy resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    advocacyDrag,
    summary: `National resolute resilience ${band} (index ${Math.round(resilienceIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
