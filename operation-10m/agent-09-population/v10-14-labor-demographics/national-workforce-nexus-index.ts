import { v1014laborClamp } from './bands';
import {
  type NationalCareEquilibriumOutlook,
  type NationalLaborDemographicsState,
  type NationalOrbitCareCouplingBrief,
  type NationalSubjectNexusReadinessBrief,
  type NationalWorkforceNexusIndex,
  type WorkforceNexusBand
} from './types';

function nexusBand(index: number): WorkforceNexusBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'nexus';
}

export function computeNationalWorkforceNexusIndex(
  state: NationalLaborDemographicsState,
  careCoupling: NationalOrbitCareCouplingBrief | null | undefined,
  careEquilibrium: NationalCareEquilibriumOutlook | null | undefined,
  subjectNexus: NationalSubjectNexusReadinessBrief | null | undefined
): NationalWorkforceNexusIndex {
  if (!state.enabled || !careCoupling || !careEquilibrium || !subjectNexus) {
    return {
      turn: state.turn,
      nexusIndex: 50,
      band: 'thin',
      nexusDrag: 0,
      summary: 'Workforce nexus idle — care coupling, care equilibrium, or subject nexus unavailable.',
      stewardNote: 'Compute O10-195 wave-32 depth stack before nexus guidance.'
    };
  }

  const nexusDrag = v1014laborClamp(
    subjectNexus.nexusDrag * 0.35 +
      careCoupling.orbitDrag * 0.3 +
      careEquilibrium.orbitDrag * 0.25 +
      (subjectNexus.band === 'below_nexus' || careCoupling.band === 'decoupled' ? 8 : 2)
  );
  const careLift =
    careCoupling.band === 'amplified' || careCoupling.band === 'elevated'
      ? careCoupling.couplingIndex * 0.2
      : careCoupling.couplingIndex * 0.1;
  const equilibriumLift =
    careEquilibrium.band === 'rising' || careEquilibrium.band === 'equilibrium'
      ? careEquilibrium.equilibriumIndex * 0.18
      : careEquilibrium.equilibriumIndex * 0.09;
  const subjectLift =
    subjectNexus.band === 'nexus_ready' || subjectNexus.band === 'sealed_locked'
      ? subjectNexus.nexusIndex * 0.22
      : subjectNexus.nexusIndex * 0.11;

  const nexusIndex = v1014laborClamp(18 + careLift + equilibriumLift + subjectLift - nexusDrag);
  const band = nexusBand(nexusIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce nexus — sequence orbit-care, care equilibrium, and subject nexus before post-aa70dac tranche.'
      : band === 'nexus'
        ? 'Nexus band — avoid corridor overload that breaks subject nexus bands.'
        : 'Elevated nexus — refresh subject nexus checks each scale wave.';

  return {
    turn: state.turn,
    nexusIndex,
    band,
    nexusDrag,
    summary: `National workforce nexus ${band} (index ${Math.round(nexusIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}
