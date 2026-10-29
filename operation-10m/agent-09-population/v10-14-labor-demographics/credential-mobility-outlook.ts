import { v1014laborClamp } from './bands';
import { skilledPathwayPullForRegion } from './catalog/skilled-labor-pathways';
import {
  V1014_LABOR_CORE_REGIONS,
  type CredentialMobilityBand,
  type NationalCredentialMobilityOutlook,
  type NationalLaborDemographicsState,
  type NationalSkillMismatchIndex,
  type NationalTalentMobilityOutlook
} from './types';

function credentialMobilityBand(index: number): CredentialMobilityBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'narrow';
  if (index <= 62) return 'fluid';
  return 'portable';
}

export function computeNationalCredentialMobilityOutlook(
  state: NationalLaborDemographicsState,
  mismatch: NationalSkillMismatchIndex | null | undefined,
  mobility: NationalTalentMobilityOutlook | null | undefined
): NationalCredentialMobilityOutlook {
  if (!state.enabled || !mismatch || !mobility) {
    return {
      turn: state.turn,
      mobilityIndex: 50,
      band: 'narrow',
      pathwayLift: 0,
      summary: 'Credential mobility idle — mismatch or talent mobility unavailable.',
      stewardNote: 'Compute skill mismatch and talent mobility before credential guidance.'
    };
  }

  let pathwayLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    pathwayLift += skilledPathwayPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  pathwayLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mismatchDrag =
    mismatch.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch.nationalBand === 'elevated_gap'
        ? 12
        : mismatch.nationalBand === 'moderate_gap'
          ? 6
          : 0;
  const mobilityLift =
    mobility.band === 'fluid' || mobility.band === 'hyper_mobile'
      ? mobility.mobilityIndex * 0.28
      : mobility.mobilityIndex * 0.18;
  const linkageLift = state.employmentLinkageScore * 0.15;

  const mobilityIndex = v1014laborClamp(30 + pathwayLift * 24 + mobilityLift + linkageLift - mismatchDrag);
  const band = credentialMobilityBand(mobilityIndex);

  const stewardNote =
    band === 'blocked' || band === 'narrow'
      ? 'Narrow credential mobility — sequence upskilling and reengagement levers before corridor moves.'
      : band === 'portable'
        ? 'Portable credentials — avoid hyper-mobility that drains anchor regions.'
        : 'Fluid credential mobility — align pathway lifts with capacity gaps.';

  return {
    turn: state.turn,
    mobilityIndex,
    band,
    pathwayLift,
    summary: `Credential mobility ${band} (index ${Math.round(mobilityIndex)}); pathway lift ${Math.round(pathwayLift * 100)}%.`,
    stewardNote
  };
}
