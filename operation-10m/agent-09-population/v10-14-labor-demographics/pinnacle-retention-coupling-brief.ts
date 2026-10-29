import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalPinnacleRetentionCouplingBrief,
  type NationalWorkforcePinnacleIndex,
  type PinnacleRetentionCouplingBand
} from './types';

function couplingBand(index: number): PinnacleRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-28 / wave-28 pinnacle-retention coupling — pinnacle × retention levers (O10-187). */
export function computeNationalPinnacleRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  pinnacle: NationalWorkforcePinnacleIndex | null | undefined
): NationalPinnacleRetentionCouplingBrief {
  if (!state.enabled || !pinnacle) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      pinnacleDrag: 0,
      summary: 'Pinnacle-retention coupling idle — workforce pinnacle unavailable.',
      stewardNote: 'Compute workforce pinnacle before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pinnacleDrag = v1014laborClamp(
    pinnacle.pinnacleDrag * 0.48 + (pinnacle.band === 'fragile' || pinnacle.band === 'thin' ? 11 : 3)
  );
  const pinnacleLift =
    pinnacle.band === 'elevated' || pinnacle.band === 'summit'
      ? pinnacle.pinnacleIndex * 0.24
      : pinnacle.pinnacleIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + retentionLift * 21 + pinnacleLift - pinnacleDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained pinnacle-retention link — deploy retention levers before wave-28 summit commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard retention crest spikes that drain pinnacle buffers.'
        : 'Amplified coupling — pair retention packs with subject summit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    pinnacleDrag,
    summary: `Pinnacle-retention coupling ${band} (index ${Math.round(couplingIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}
