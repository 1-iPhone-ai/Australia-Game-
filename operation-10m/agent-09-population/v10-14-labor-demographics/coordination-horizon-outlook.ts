import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CoordinationHorizonBand,
  type NationalCoordinationHorizonOutlook,
  type NationalLaborDemographicsState,
  type NationalRetentionCrestOutlook
} from './types';

function horizonBand(index: number): CoordinationHorizonBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'horizon';
}

export function computeNationalCoordinationHorizonOutlook(
  state: NationalLaborDemographicsState,
  retentionCrest: NationalRetentionCrestOutlook | null | undefined
): NationalCoordinationHorizonOutlook {
  if (!state.enabled || !retentionCrest) {
    return {
      turn: state.turn,
      horizonIndex: 50,
      band: 'patchy',
      crestDrag: 0,
      summary: 'Coordination horizon idle — retention crest unavailable.',
      stewardNote: 'Compute retention crest before coordination horizon guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const crestDrag = v1014laborClamp(
    retentionCrest.thrustDrag * 0.46 +
      (retentionCrest.band === 'ebbing' || retentionCrest.band === 'patchy' ? 10 : 3)
  );
  const crestLift =
    retentionCrest.band === 'rising' || retentionCrest.band === 'cresting'
      ? retentionCrest.crestIndex * 0.2
      : retentionCrest.crestIndex * 0.1;

  const horizonIndex = v1014laborClamp(24 + coordinationLift * 22 + crestLift - crestDrag);
  const band = horizonBand(horizonIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy coordination horizon — deploy coordination levers before subject zenith assembly.'
      : band === 'horizon'
        ? 'Horizon band — verify summit-coordination coupling before auto workforce pushes.'
        : 'Rising horizon — align with coordination bind outlook checks.';

  return {
    turn: state.turn,
    horizonIndex,
    band,
    crestDrag,
    summary: `National coordination horizon ${band} (index ${Math.round(horizonIndex)}); crest drag ${Math.round(crestDrag)}.`,
    stewardNote
  };
}
