import { v1014laborClamp } from './bands';
import type {
  NationalAutomationParticipationResilienceOutlook,
  NationalLaborDemographicsState,
  NationalWageAutomationCouplingBrief,
  NationalWageCompetitivenessIndex,
  NationalWageParticipationSpilloverBrief,
  WageAutomationCouplingBand
} from './types';

function couplingBand(index: number): WageAutomationCouplingBand {
  if (index <= 34) return 'disruptive';
  if (index <= 48) return 'tense';
  if (index <= 62) return 'balanced';
  return 'harmonized';
}

export function computeNationalWageAutomationCouplingBrief(
  state: NationalLaborDemographicsState,
  spillover: NationalWageParticipationSpilloverBrief | null | undefined,
  competitiveness: NationalWageCompetitivenessIndex | null | undefined,
  automationResilience: NationalAutomationParticipationResilienceOutlook | null | undefined
): NationalWageAutomationCouplingBrief {
  if (!state.enabled || !spillover || !competitiveness || !automationResilience) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'tense',
      automationDrag: 0,
      summary: 'Wage-automation coupling idle — spillover, competitiveness, or resilience unavailable.',
      stewardNote: 'Compute wage spillover and automation resilience before coupling guidance.'
    };
  }

  const automationDrag = v1014laborClamp(
    automationResilience.automationPressureDrag * 0.6 +
      (automationResilience.band === 'fragile' ? 10 : automationResilience.band === 'strained' ? 6 : 0)
  );
  const spilloverLift =
    spillover.band === 'supportive' || spillover.band === 'amplifying'
      ? spillover.spilloverIndex * 0.24
      : spillover.spilloverIndex * 0.12;
  const competitivenessEase =
    competitiveness.band === 'premium' || competitiveness.band === 'balanced'
      ? competitiveness.competitivenessIndex * 0.22
      : 0;
  const wageDrag =
    spillover.band === 'suppressive' ? 12 : competitiveness.band === 'cost_burden' ? 10 : 0;

  const couplingIndex = v1014laborClamp(32 + spilloverLift + competitivenessEase - automationDrag - wageDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'disruptive' || band === 'tense'
      ? 'Tense wage-automation coupling — slow automation before wage competitiveness pushes.'
      : band === 'harmonized'
        ? 'Harmonized coupling — guard against corridor stress that flips spillover bands.'
        : 'Balanced coupling — align mentorship with automation resilience outlook.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    automationDrag,
    summary: `Wage-automation coupling ${band} (index ${Math.round(couplingIndex)}); automation drag ${Math.round(automationDrag)}.`,
    stewardNote
  };
}
