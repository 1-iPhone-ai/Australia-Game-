import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityCoordinationCouplingBand,
  type NationalFlexibilityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceFlexibilityIndex
} from './types';

function couplingBand(index: number): FlexibilityCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-43 / wave-43 flexibility-coordination coupling — flexibility × coordination (O10-217). */
export function computeNationalFlexibilityCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  flexibility: NationalWorkforceFlexibilityIndex | null | undefined
): NationalFlexibilityCoordinationCouplingBrief {
  if (!state.enabled || !flexibility) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      flexibilityDrag: 0,
      summary: 'Flexibility-coordination coupling idle — workforce flexibility unavailable.',
      stewardNote: 'Compute workforce flexibility before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const flexibilityDrag = v1014laborClamp(
    flexibility.flexibilityDrag * 0.48 + (flexibility.band === 'fragile' || flexibility.band === 'thin' ? 11 : 3)
  );
  const flexibilityLift =
    flexibility.band === 'elevated' || flexibility.band === 'flexibility'
      ? flexibility.flexibilityIndex * 0.24
      : flexibility.flexibilityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + flexibilityLift - flexibilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained flexibility-coordination link — deploy coordination levers before wave-43 coordination commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard coordination mesh spikes that drain flexibility buffers.'
        : 'Amplified coupling — pair coordination packs with subject coordination readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    flexibilityDrag,
    summary: `Flexibility-coordination coupling ${band} (index ${Math.round(couplingIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}
