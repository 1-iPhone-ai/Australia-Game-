import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type ContinuityCoordinationCouplingBand,
  type NationalContinuityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceContinuityIndex
} from './types';

function couplingBand(index: number): ContinuityCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'synced';
  return 'aligned';
}

export function computeNationalContinuityCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  continuity: NationalWorkforceContinuityIndex | null | undefined
): NationalContinuityCoordinationCouplingBrief {
  if (!state.enabled || !continuity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      continuityDrag: 0,
      summary: 'Continuity-coordination coupling idle — workforce continuity unavailable.',
      stewardNote: 'Compute workforce continuity before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const continuityDrag = v1014laborClamp(
    continuity.assemblyDrag * 0.5 +
      (continuity.band === 'fragile' || continuity.band === 'thin' ? 11 : 3)
  );
  const continuityLift =
    continuity.band === 'stable' || continuity.band === 'durable'
      ? continuity.continuityIndex * 0.24
      : continuity.continuityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + continuityLift - continuityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained continuity-coordination link — ease coordination levers before corridor scale commits.'
      : band === 'aligned'
        ? 'Aligned coupling — guard reengagement spikes that thin coordination buffers.'
        : 'Synced coupling — pair coordination packs with subject wave assembly checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    continuityDrag,
    summary: `Continuity-coordination coupling ${band} (index ${Math.round(couplingIndex)}); continuity drag ${Math.round(continuityDrag)}.`,
    stewardNote
  };
}
