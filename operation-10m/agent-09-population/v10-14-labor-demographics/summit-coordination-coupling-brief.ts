import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSummitCoordinationCouplingBrief,
  type NationalWorkforceSummitIndex,
  type SummitCoordinationCouplingBand
} from './types';

function couplingBand(index: number): SummitCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-29 / wave-29 summit-coordination coupling — summit × coordination levers (O10-189). */
export function computeNationalSummitCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  summit: NationalWorkforceSummitIndex | null | undefined
): NationalSummitCoordinationCouplingBrief {
  if (!state.enabled || !summit) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      summitDrag: 0,
      summary: 'Summit-coordination coupling idle — workforce summit unavailable.',
      stewardNote: 'Compute workforce summit before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const summitDrag = v1014laborClamp(
    summit.summitDrag * 0.48 + (summit.band === 'fragile' || summit.band === 'thin' ? 11 : 3)
  );
  const summitLift =
    summit.band === 'elevated' || summit.band === 'zenith'
      ? summit.summitIndex * 0.24
      : summit.summitIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + summitLift - summitDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained summit-coordination link — deploy coordination levers before wave-29 zenith commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard coordination horizon spikes that drain summit buffers.'
        : 'Amplified coupling — pair coordination packs with subject zenith readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    summitDrag,
    summary: `Summit-coordination coupling ${band} (index ${Math.round(couplingIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}
