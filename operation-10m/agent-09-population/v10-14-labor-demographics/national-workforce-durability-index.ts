import { v1014laborClamp } from './bands';
import {
  type NationalContinuityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalReengagementMomentumOutlook,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceDurabilityIndex,
  type WorkforceDurabilityBand
} from './types';

function durabilityBand(index: number): WorkforceDurabilityBand {
  if (index <= 34) return 'brittle';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'grounded';
  return 'fortified';
}

export function computeNationalWorkforceDurabilityIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalContinuityCoordinationCouplingBrief | null | undefined,
  reengagementMomentum: NationalReengagementMomentumOutlook | null | undefined,
  subjectWaveAssembly: NationalSubjectWaveAssemblyBrief | null | undefined
): NationalWorkforceDurabilityIndex {
  if (!state.enabled || !coordinationCoupling || !reengagementMomentum || !subjectWaveAssembly) {
    return {
      turn: state.turn,
      durabilityIndex: 50,
      band: 'thin',
      waveDrag: 0,
      summary: 'Workforce durability idle — coordination coupling, reengagement momentum, or subject wave assembly unavailable.',
      stewardNote: 'Compute round-19 depth stack before durability guidance.'
    };
  }

  const waveDrag = v1014laborClamp(
    subjectWaveAssembly.waveDrag * 0.35 +
      coordinationCoupling.continuityDrag * 0.3 +
      reengagementMomentum.pipelineDrag * 0.25 +
      (subjectWaveAssembly.band === 'blocked' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const coordinationLift =
    coordinationCoupling.band === 'synced' || coordinationCoupling.band === 'aligned'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const momentumLift =
    reengagementMomentum.band === 'building' || reengagementMomentum.band === 'surging'
      ? reengagementMomentum.momentumIndex * 0.18
      : reengagementMomentum.momentumIndex * 0.09;
  const waveLift =
    subjectWaveAssembly.band === 'ready' || subjectWaveAssembly.band === 'cleared'
      ? subjectWaveAssembly.assemblyIndex * 0.22
      : subjectWaveAssembly.assemblyIndex * 0.11;

  const durabilityIndex = v1014laborClamp(18 + coordinationLift + momentumLift + waveLift - waveDrag);
  const band = durabilityBand(durabilityIndex);

  const stewardNote =
    band === 'brittle' || band === 'thin'
      ? 'Thin workforce durability — sequence continuity-coordination, reengagement, and subject wave before post-O10-167 tranche.'
      : band === 'fortified'
        ? 'Fortified durability — avoid corridor overload that breaks subject wave assembly.'
        : 'Grounded durability — refresh subject wave checks each scale wave.';

  return {
    turn: state.turn,
    durabilityIndex,
    band,
    waveDrag,
    summary: `National workforce durability ${band} (index ${Math.round(durabilityIndex)}); wave drag ${Math.round(waveDrag)}.`,
    stewardNote
  };
}
