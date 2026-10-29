import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalNexusSchedulingCouplingBrief,
  type NationalWorkforceNexusIndex,
  type NexusSchedulingCouplingBand
} from './types';

function couplingBand(index: number): NexusSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-33 / wave-33 nexus-scheduling coupling — nexus × scheduling levers (O10-197). */
export function computeNationalNexusSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  nexus: NationalWorkforceNexusIndex | null | undefined
): NationalNexusSchedulingCouplingBrief {
  if (!state.enabled || !nexus) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      nexusDrag: 0,
      summary: 'Nexus-scheduling coupling idle — workforce nexus unavailable.',
      stewardNote: 'Compute workforce nexus before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const nexusDrag = v1014laborClamp(
    nexus.nexusDrag * 0.48 + (nexus.band === 'fragile' || nexus.band === 'thin' ? 11 : 3)
  );
  const nexusLift =
    nexus.band === 'elevated' || nexus.band === 'nexus'
      ? nexus.nexusIndex * 0.24
      : nexus.nexusIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + nexusLift - nexusDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained nexus-scheduling link — deploy scheduling levers before wave-33 convergence commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard scheduling resonance spikes that drain nexus buffers.'
        : 'Amplified coupling — pair scheduling packs with subject convergence readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    nexusDrag,
    summary: `Nexus-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}
