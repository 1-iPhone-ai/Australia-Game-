import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectTrancheReadinessBrief,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceDurabilityIndex,
  type SubjectTrancheReadinessBand
} from './types';

function trancheBand(index: number): SubjectTrancheReadinessBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'tranche_ready';
  return 'cleared';
}

/** Round-20 subject tranche readiness — wave assembly × durability gate for scale commits. */
export function computeNationalSubjectTrancheReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectWaveAssembly: NationalSubjectWaveAssemblyBrief | null | undefined,
  durability: NationalWorkforceDurabilityIndex | null | undefined
): NationalSubjectTrancheReadinessBrief {
  if (!state.enabled || !subjectWaveAssembly || !durability) {
    return {
      turn: state.turn,
      trancheIndex: 50,
      band: 'caution',
      trancheDrag: 0,
      summary: 'Subject tranche readiness idle — subject wave assembly or durability unavailable.',
      stewardNote: 'Compute subject wave assembly and workforce durability before tranche guidance.'
    };
  }

  const trancheDrag = v1014laborClamp(
    subjectWaveAssembly.waveDrag * 0.38 +
      durability.waveDrag * 0.38 +
      (subjectWaveAssembly.band === 'blocked' || durability.band === 'brittle' ? 12 : 3)
  );
  const waveLift =
    subjectWaveAssembly.band === 'ready' || subjectWaveAssembly.band === 'cleared'
      ? subjectWaveAssembly.assemblyIndex * 0.27
      : subjectWaveAssembly.assemblyIndex * 0.14;
  const durabilityLift =
    durability.band === 'grounded' || durability.band === 'fortified'
      ? durability.durabilityIndex * 0.25
      : durability.durabilityIndex * 0.12;

  const trancheIndex = v1014laborClamp(20 + waveLift + durabilityLift - trancheDrag);
  const band = trancheBand(trancheIndex);

  const stewardNote =
    band === 'blocked' || band === 'caution'
      ? 'Caution tranche readiness — hold O10-170 scale commits until durability-advocacy syncs.'
      : band === 'cleared'
        ? 'Cleared tranche band — still monitor mentorship endurance during corridor peaks.'
        : 'Tranche-ready — pair with workforce endurance index each assembly tranche.';

  return {
    turn: state.turn,
    trancheIndex,
    band,
    trancheDrag,
    summary: `Subject tranche readiness ${band} (index ${Math.round(trancheIndex)}); tranche drag ${Math.round(trancheDrag)}.`,
    stewardNote
  };
}
