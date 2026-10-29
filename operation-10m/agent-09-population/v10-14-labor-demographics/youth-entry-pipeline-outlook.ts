import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import { V1014_LABOR_CORE_REGIONS, type NationalDependencyRatioSnapshot, type NationalLaborDemographicsState, type NationalParticipationPressureBrief, type NationalYouthEntryPipelineOutlook, type YouthPipelineBand } from './types';

function youthPipelineBand(index: number): YouthPipelineBand {
  if (index <= 34) return 'constricted';
  if (index <= 48) return 'narrow';
  if (index <= 62) return 'healthy';
  return 'expansionary';
}

export function computeNationalYouthEntryPipelineOutlook(
  state: NationalLaborDemographicsState,
  dependency: NationalDependencyRatioSnapshot | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalYouthEntryPipelineOutlook {
  if (!state.enabled || !dependency || !participation) {
    return {
      turn: state.turn,
      pipelineIndex: 50,
      band: 'narrow',
      dependencyHeadwind: 0,
      summary: 'Youth entry pipeline idle — dependency or participation unavailable.',
      stewardNote: 'Compute dependency and participation before youth pipeline guidance.'
    };
  }

  const dependencyHeadwind = v1014laborClamp(dependency.nationalRatioIndex * 0.55);
  const participationLift = participation.participationIndex * 0.32;
  const linkageLift = state.employmentLinkageScore * 0.22;

  let upskillingEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingEase += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationDrag =
    participation.band === 'shrinking' ? 14 : participation.band === 'constrained' ? 8 : 0;

  const pipelineIndex = v1014laborClamp(
    30 + participationLift + linkageLift + upskillingEase * 18 - dependencyHeadwind - participationDrag
  );
  const band = youthPipelineBand(pipelineIndex);

  const stewardNote =
    band === 'constricted' || band === 'narrow'
      ? 'Narrow youth pipeline — pair upskilling with caregiver care levers before automation stacks.'
      : band === 'expansionary'
        ? 'Expansionary youth pipeline — avoid wage surges that erase participation cushions.'
        : 'Healthy youth pipeline — monitor dependency headwinds in aging regions.';

  return {
    turn: state.turn,
    pipelineIndex,
    band,
    dependencyHeadwind,
    summary: `Youth entry pipeline ${band} (index ${Math.round(pipelineIndex)}); dependency headwind ${Math.round(dependencyHeadwind)}.`,
    stewardNote
  };
}
