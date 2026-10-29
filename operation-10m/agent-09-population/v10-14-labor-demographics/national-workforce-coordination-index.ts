import { v1014laborClamp } from './bands';
import {
  type NationalCoordinationMeshOutlook,
  type NationalFlexibilityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalWorkforceCoordinationIndex,
  type WorkforceCoordinationBand
} from './types';

function coordinationBand(index: number): WorkforceCoordinationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'coordination';
}

export function computeNationalWorkforceCoordinationIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalFlexibilityCoordinationCouplingBrief | null | undefined,
  coordinationMesh: NationalCoordinationMeshOutlook | null | undefined,
  subjectCoordination: NationalSubjectCoordinationReadinessBrief | null | undefined
): NationalWorkforceCoordinationIndex {
  if (!state.enabled || !coordinationCoupling || !coordinationMesh || !subjectCoordination) {
    return {
      turn: state.turn,
      coordinationIndex: 50,
      band: 'thin',
      coordinationDrag: 0,
      summary: 'Workforce coordination idle — coordination coupling, mesh, or subject coordination unavailable.',
      stewardNote: 'Compute O10-217 wave-43 depth stack before coordination guidance.'
    };
  }

  const coordinationDrag = v1014laborClamp(
    subjectCoordination.coordinationDrag * 0.35 +
      coordinationCoupling.flexibilityDrag * 0.3 +
      coordinationMesh.flexibilityDrag * 0.25 +
      (subjectCoordination.band === 'below_coordination' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    coordinationCoupling.band === 'amplified' || coordinationCoupling.band === 'elevated'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const meshLift =
    coordinationMesh.band === 'rising' || coordinationMesh.band === 'meshed'
      ? coordinationMesh.meshIndex * 0.18
      : coordinationMesh.meshIndex * 0.09;
  const subjectLift =
    subjectCoordination.band === 'coordination_ready' || subjectCoordination.band === 'flexibility_locked'
      ? subjectCoordination.coordinationIndex * 0.22
      : subjectCoordination.coordinationIndex * 0.11;

  const coordinationIndex = v1014laborClamp(18 + couplingLift + meshLift + subjectLift - coordinationDrag);
  const band = coordinationBand(coordinationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce coordination — sequence flexibility-coordination, coordination mesh, and subject coordination before post-641d7d16 tranche.'
      : band === 'coordination'
        ? 'Coordination band — avoid corridor overload that breaks subject coordination bands.'
        : 'Elevated coordination — refresh subject coordination checks each scale wave.';

  return {
    turn: state.turn,
    coordinationIndex,
    band,
    coordinationDrag,
    summary: `National workforce coordination ${band} (index ${Math.round(coordinationIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}
