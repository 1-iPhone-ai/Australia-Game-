import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type DurabilityAdvocacyCouplingBand,
  type NationalDurabilityAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceDurabilityIndex
} from './types';

function couplingBand(index: number): DurabilityAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'reinforced';
}

export function computeNationalDurabilityAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  durability: NationalWorkforceDurabilityIndex | null | undefined
): NationalDurabilityAdvocacyCouplingBrief {
  if (!state.enabled || !durability) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      durabilityDrag: 0,
      summary: 'Durability-advocacy coupling idle — workforce durability unavailable.',
      stewardNote: 'Compute workforce durability before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const durabilityDrag = v1014laborClamp(
    durability.waveDrag * 0.48 +
      (durability.band === 'brittle' || durability.band === 'thin' ? 11 : 3)
  );
  const durabilityLift =
    durability.band === 'grounded' || durability.band === 'fortified'
      ? durability.durabilityIndex * 0.24
      : durability.durabilityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + durabilityLift - durabilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained durability-advocacy link — deploy advocacy levers before tranche scale commits.'
      : band === 'reinforced'
        ? 'Reinforced coupling — guard mentorship spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair advocacy packs with subject tranche readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    durabilityDrag,
    summary: `Durability-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); durability drag ${Math.round(durabilityDrag)}.`,
    stewardNote
  };
}
