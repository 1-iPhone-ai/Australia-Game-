import { v1014laborClamp } from './bands';
import { sovereignEaseForRegion } from './catalog/workforce-sovereign-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResoluteResilienceOutlook,
  type NationalSovereignResilienceOutlook,
  type SovereignResilienceBand
} from './types';

function resilienceBand(index: number): SovereignResilienceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'fortified';
}

/** Round-55 / wave-55 sovereign resilience — resolute resilience × sovereign levers (O10-247). */
export function computeNationalSovereignResilienceOutlook(
  state: NationalLaborDemographicsState,
  resoluteResilience: NationalResoluteResilienceOutlook | null | undefined
): NationalSovereignResilienceOutlook {
  if (!state.enabled || !resoluteResilience) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      resoluteDrag: 0,
      summary: 'Sovereign resilience idle — resolute resilience unavailable.',
      stewardNote: 'Compute resolute resilience before sovereign resilience guidance.'
    };
  }

  let sovereignLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    sovereignLift += sovereignEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  sovereignLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resoluteDrag = v1014laborClamp(
    resoluteResilience.advocacyDrag * 0.44 +
      (resoluteResilience.band === 'ebbing' || resoluteResilience.band === 'patchy' ? 10 : 3)
  );
  const resilienceLift =
    resoluteResilience.band === 'rising' || resoluteResilience.band === 'fortified'
      ? resoluteResilience.resilienceIndex * 0.18
      : resoluteResilience.resilienceIndex * 0.09;

  const resilienceIndex = v1014laborClamp(24 + sovereignLift * 22 + resilienceLift - resoluteDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy sovereign resilience — deploy sovereign levers before subject sovereign assembly.'
      : band === 'fortified'
        ? 'Fortified band — verify resolute-sovereign coupling before auto workforce pushes.'
        : 'Rising resilience — align with resolute resilience outlook checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    resoluteDrag,
    summary: `National sovereign resilience ${band} (index ${Math.round(resilienceIndex)}); resolute drag ${Math.round(resoluteDrag)}.`,
    stewardNote
  };
}
