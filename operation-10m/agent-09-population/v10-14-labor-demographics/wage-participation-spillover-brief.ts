import { v1014laborClamp } from './bands';
import type {
  NationalHouseholdParticipationCouplingBrief,
  NationalLaborDemographicsState,
  NationalWageCompetitivenessIndex,
  NationalWageParticipationSpilloverBrief,
  WageParticipationSpilloverBand
} from './types';

function spilloverBand(index: number): WageParticipationSpilloverBand {
  if (index <= 34) return 'suppressive';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'supportive';
  return 'amplifying';
}

export function computeNationalWageParticipationSpilloverBrief(
  state: NationalLaborDemographicsState,
  competitiveness: NationalWageCompetitivenessIndex | null | undefined,
  coupling: NationalHouseholdParticipationCouplingBrief | null | undefined
): NationalWageParticipationSpilloverBrief {
  if (!state.enabled || !competitiveness || !coupling) {
    return {
      turn: state.turn,
      spilloverIndex: 50,
      band: 'mixed',
      wagePressureDrag: 0,
      summary: 'Wage-participation spillover idle — competitiveness or coupling unavailable.',
      stewardNote: 'Compute wage competitiveness and household coupling before spillover guidance.'
    };
  }

  const wagePressureDrag = v1014laborClamp(competitiveness.wagePressureDrag * 0.65 + state.wagePressureScore * 0.12);
  const competitivenessEase =
    competitiveness.band === 'premium' || competitiveness.band === 'balanced'
      ? competitiveness.competitivenessIndex * 0.28
      : 0;
  const couplingLift =
    coupling.band === 'aligned' || coupling.band === 'reinforcing' ? coupling.couplingIndex * 0.22 : 0;
  const couplingDrag =
    coupling.band === 'decoupled' ? 12 : coupling.band === 'strained' ? 7 : 0;

  const spilloverIndex = v1014laborClamp(
    32 + competitivenessEase + couplingLift - wagePressureDrag - couplingDrag
  );
  const band = spilloverBand(spilloverIndex);

  const stewardNote =
    band === 'suppressive' || band === 'mixed'
      ? 'Mixed wage-participation spillover — ease household coupling before competitiveness pushes.'
      : band === 'amplifying'
        ? 'Amplifying spillover — avoid stacked wage surges in tight absorption regions.'
        : 'Supportive spillover — align onboarding with participation expansion bands.';

  return {
    turn: state.turn,
    spilloverIndex,
    band,
    wagePressureDrag,
    summary: `Wage-participation spillover ${band} (index ${Math.round(spilloverIndex)}); wage drag ${Math.round(wagePressureDrag)}.`,
    stewardNote
  };
}
