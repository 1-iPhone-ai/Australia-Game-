import { v1014laborClamp } from './bands';
import {
  V1014_LABOR_CORE_REGIONS,
  type AutomationParticipationResilienceBand,
  type NationalAutomationParticipationResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalParticipationPressureBrief,
  type NationalWorkforceTransitionFrictionOutlook
} from './types';

function resilienceBand(index: number): AutomationParticipationResilienceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'stable';
  return 'adaptive';
}

export function computeNationalAutomationParticipationResilienceOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  transition: NationalWorkforceTransitionFrictionOutlook | null | undefined
): NationalAutomationParticipationResilienceOutlook {
  if (!state.enabled || !participation || !transition) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'strained',
      automationPressureDrag: 0,
      summary: 'Automation-participation resilience idle — participation or transition unavailable.',
      stewardNote: 'Compute participation and transition friction before automation resilience guidance.'
    };
  }

  let automationPressure = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    automationPressure += state.regions[regionId]?.automationPressureIndex ?? 50;
  });
  automationPressure /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  const automationPressureDrag = v1014laborClamp(automationPressure * 0.42);

  const transitionDrag =
    transition.band === 'bottleneck' ? 14 : transition.band === 'sticky' ? 9 : transition.frictionIndex * 0.18;
  const participationLift = participation.participationIndex * 0.3;
  const linkageLift = state.employmentLinkageScore * 0.16;

  const resilienceIndex = v1014laborClamp(
    34 + participationLift + linkageLift - automationPressureDrag - transitionDrag
  );
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained automation-participation resilience — slow automation stacks until onboarding levers land.'
      : band === 'adaptive'
        ? 'Adaptive resilience — avoid wage surges that erase participation cushions.'
        : 'Stable resilience — monitor transition friction in high-automation regions.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    automationPressureDrag,
    summary: `Automation-participation resilience ${band} (index ${Math.round(resilienceIndex)}); automation drag ${Math.round(automationPressureDrag)}.`,
    stewardNote
  };
}
