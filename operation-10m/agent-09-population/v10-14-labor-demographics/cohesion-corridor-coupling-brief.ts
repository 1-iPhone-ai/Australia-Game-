import { v1014laborClamp } from './bands';
import {
  V1014_LABOR_CORE_REGIONS,
  type CohesionCorridorCouplingBand,
  type NationalCohesionCorridorCouplingBrief,
  type NationalCorridorCapacityStressBrief,
  type NationalLaborCohesionIndex,
  type NationalLaborDemographicsState
} from './types';

function couplingBand(index: number): CohesionCorridorCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'linked';
  return 'reinforced';
}

export function computeNationalCohesionCorridorCouplingBrief(
  state: NationalLaborDemographicsState,
  cohesion: NationalLaborCohesionIndex | null | undefined,
  corridorStress: NationalCorridorCapacityStressBrief | null | undefined
): NationalCohesionCorridorCouplingBrief {
  if (!state.enabled || !cohesion || !corridorStress) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      corridorDrag: 0,
      summary: 'Cohesion-corridor coupling idle — cohesion or corridor stress unavailable.',
      stewardNote: 'Compute national cohesion and corridor stress before coupling guidance.'
    };
  }

  const corridorDrag = v1014laborClamp(
    corridorStress.corridorMoveDrag * 0.6 +
      (corridorStress.band === 'overloaded' || corridorStress.band === 'stressed' ? 12 : 4)
  );
  const cohesionLift =
    cohesion.band === 'cohesive' || cohesion.band === 'unified'
      ? cohesion.cohesionIndex * 0.28
      : cohesion.cohesionIndex * 0.14;
  const migrationSpread =
    V1014_LABOR_CORE_REGIONS.reduce((a, r) => a + Math.abs((state.regions[r]?.migrationFlowScore ?? 50) - 50), 0) /
    Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const couplingIndex = v1014laborClamp(24 + cohesionLift - corridorDrag - migrationSpread * 0.08);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained cohesion-corridor link — ease corridor stress before national cohesion campaigns.'
      : band === 'reinforced'
        ? 'Reinforced coupling — avoid overload moves that fragment unified cohesion.'
        : 'Linked coupling — pair scheduling levers with corridor absorption checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    corridorDrag,
    summary: `Cohesion-corridor coupling ${band} (index ${Math.round(couplingIndex)}); corridor drag ${Math.round(corridorDrag)}.`,
    stewardNote
  };
}
