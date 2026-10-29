import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import { mentorshipEaseForRegion } from './catalog/workforce-mentorship-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type HybridRemoteParticipationBand,
  type NationalHybridParticipationFrictionOutlook,
  type NationalHybridRemoteParticipationOutlook,
  type NationalLaborDemographicsState
} from './types';

function hybridRemoteBand(index: number): HybridRemoteParticipationBand {
  if (index <= 34) return 'constrained';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'enabled';
  return 'expansive';
}

export function computeNationalHybridRemoteParticipationOutlook(
  state: NationalLaborDemographicsState,
  hybridFriction: NationalHybridParticipationFrictionOutlook | null | undefined
): NationalHybridRemoteParticipationOutlook {
  if (!state.enabled || !hybridFriction) {
    return {
      turn: state.turn,
      remoteIndex: 50,
      band: 'mixed',
      frictionDrag: 0,
      summary: 'Hybrid-remote participation idle — hybrid friction unavailable.',
      stewardNote: 'Compute hybrid participation friction before remote outlook guidance.'
    };
  }

  let flexibilityLift = 0;
  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    flexibilityLift += flexibilityEaseForRegion(regionId, industry);
    mentorshipLift += mentorshipEaseForRegion(regionId, industry);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const frictionDrag =
    hybridFriction.band === 'binding'
      ? 18
      : hybridFriction.band === 'elevated'
        ? 12
        : hybridFriction.frictionIndex * 0.2;
  const careEase = hybridFriction.careReliefLift * 22;
  const participationLift = (state.participationPressureBrief?.participationIndex ?? 50) * 0.22;

  const remoteIndex = v1014laborClamp(
    28 + participationLift + flexibilityLift * 18 + mentorshipLift * 14 + careEase - frictionDrag
  );
  const band = hybridRemoteBand(remoteIndex);

  const stewardNote =
    band === 'constrained' || band === 'mixed'
      ? 'Mixed hybrid-remote participation — stack flexibility and mentorship before remote automation.'
      : band === 'expansive'
        ? 'Expansive remote band — guard corridor capacity stress in inbound hubs.'
        : 'Enabled remote participation — monitor hybrid friction in caregiver-heavy regions.';

  return {
    turn: state.turn,
    remoteIndex,
    band,
    frictionDrag,
    summary: `Hybrid-remote participation ${band} (index ${Math.round(remoteIndex)}); friction drag ${Math.round(frictionDrag)}.`,
    stewardNote
  };
}
