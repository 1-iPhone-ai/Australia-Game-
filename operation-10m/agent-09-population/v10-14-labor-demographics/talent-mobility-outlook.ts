import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import { skilledPathwayPullForRegion } from './catalog/skilled-labor-pathways';
import type {
  NationalLaborDemographicsState,
  NationalLaborMarketVelocityIndex,
  NationalTalentMobilityOutlook,
  NationalWorkforceCapacityBridge,
  TalentMobilityBand
} from './types';

function mobilityBand(index: number): TalentMobilityBand {
  if (index <= 38) return 'anchored';
  if (index <= 52) return 'balanced';
  if (index <= 65) return 'fluid';
  return 'hyper_mobile';
}

export function computeNationalTalentMobilityOutlook(
  state: NationalLaborDemographicsState,
  velocity: NationalLaborMarketVelocityIndex | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): NationalTalentMobilityOutlook {
  if (!state.enabled || !velocity) {
    return {
      turn: state.turn,
      mobilityIndex: 50,
      band: 'balanced',
      anchorRegion: null,
      corridorHighlight: null,
      summary: 'Talent mobility idle — velocity index unavailable.',
      stewardNote: 'Compute labor velocity before mobility outlook.'
    };
  }

  const velocityPull = velocity.nationalVelocityIndex * 0.45;
  const migrationPull =
    state.nationalMigrationFlow === 'strong_inflow' || state.nationalMigrationFlow === 'inflow' ? 12 : 4;
  const retentionDragSamples: number[] = [];
  const pathwayLiftSamples: number[] = [];

  Object.keys(state.regions).forEach(regionId => {
    const dom = state.regions[regionId]?.dominantIndustry ?? null;
    retentionDragSamples.push(retentionPullForRegion(regionId, dom) * 22);
    pathwayLiftSamples.push(skilledPathwayPullForRegion(regionId, dom) * 18);
  });

  const retentionEase =
    retentionDragSamples.reduce((a, b) => a + b, 0) / Math.max(1, retentionDragSamples.length);
  const pathwayLift =
    pathwayLiftSamples.reduce((a, b) => a + b, 0) / Math.max(1, pathwayLiftSamples.length);
  const gapDrag =
    capacityBridge?.nationalBand === 'critical_gap' ? 10 : capacityBridge?.nationalBand === 'tight' ? 5 : 0;

  const mobilityIndex = v1014laborClamp(
    35 + velocityPull + migrationPull + pathwayLift - retentionEase * 0.35 + gapDrag * 0.4
  );
  const band = mobilityBand(mobilityIndex);

  let minMobility = 999;
  let anchorRegion: string | null = null;
  Object.entries(velocity.regions).forEach(([regionId, row]) => {
    const retention = retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
    const score = row.velocityIndex - retention * 30;
    if (score < minMobility) {
      minMobility = score;
      anchorRegion = regionId;
    }
  });

  const corridorHighlight =
    state.interregionalRebalancingPlan?.moves.find(m => m.priority === 'high')?.toRegionId ??
    velocity.hottestRegion;

  const stewardNote =
    band === 'hyper_mobile'
      ? 'Hyper-mobile talent bands — stabilize retention levers before stacked auto commits.'
      : band === 'anchored'
        ? 'Anchored talent — leverage upskilling before forcing interregional moves.'
        : 'Balanced mobility — align corridor highlights with capacity gaps.';

  return {
    turn: state.turn,
    mobilityIndex,
    band,
    anchorRegion,
    corridorHighlight,
    summary: `Talent mobility ${band.replace('_', ' ')} (index ${Math.round(mobilityIndex)}); corridor ${corridorHighlight ?? 'n/a'}.`,
    stewardNote
  };
}
