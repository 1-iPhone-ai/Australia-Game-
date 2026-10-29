import {
  AU_REGION_CODES,
  type AuRegionCode,
  type NationalTransportProductivityReport,
  type ProductivityContribution,
  type RegionalTransportProductivity,
  type TransportProductivityInputs,
} from '../types.ts';
import {
  assetFreightCapacityIndex,
  assetTravelTimeFactor,
  CONDITION_OPERATIONAL_FACTOR,
  emptyRegionalAccumulator,
  finalizeRegionalLogisticsMultiplier,
  finalizeRegionalTravelFactor,
  isAuRegionCode,
  logisticsCostMultiplierFromCapacity,
  mergeRegionalContribution,
  networkUtilizationForAsset,
  productivityPointsFromAsset,
  utilizationEffectiveFactor,
} from './formulas.ts';

function projectBoostForAsset(
  inputs: TransportProductivityInputs,
  asset: { linkedProjectId?: string; linkedProjectType?: string },
): number {
  if (!inputs.activeProjectIds || inputs.activeProjectIds.size === 0) return 1;
  if (asset.linkedProjectId && inputs.activeProjectIds.has(asset.linkedProjectId)) return 1.22;
  return 1;
}

function conditionForAsset(
  inputs: TransportProductivityInputs,
  assetId: string,
): keyof typeof CONDITION_OPERATIONAL_FACTOR {
  const override = inputs.conditionByAssetId?.get(assetId);
  return override ?? 'good';
}

export function computeAssetProductivityContribution(
  inputs: TransportProductivityInputs,
  asset: TransportProductivityInputs['assets'][number],
): ProductivityContribution | null {
  if (!inputs.operationalAssetIds.has(asset.id)) return null;

  const condition = conditionForAsset(inputs, asset.id);
  const operationalFactor = CONDITION_OPERATIONAL_FACTOR[condition];
  if (operationalFactor <= 0) return null;

  const util = networkUtilizationForAsset(asset, inputs.networkUtilization);
  const utilFactor = utilizationEffectiveFactor(util);
  const projectBoost = projectBoostForAsset(inputs, asset);

  const freightCapacityIndex = assetFreightCapacityIndex(asset) * operationalFactor * utilFactor;
  const travelTimeFactor = assetTravelTimeFactor(asset);
  const productivityIndexDelta =
    productivityPointsFromAsset(asset, operationalFactor * utilFactor, projectBoost);
  const logisticsCostMultiplier = logisticsCostMultiplierFromCapacity(freightCapacityIndex, travelTimeFactor);

  const evidence: string[] = [
    `condition=${condition} operationalFactor=${operationalFactor.toFixed(2)}`,
    `freightCapacityIndex=${freightCapacityIndex.toFixed(1)}`,
    `productivityIndexDelta=${productivityIndexDelta.toFixed(2)}`,
    `logisticsCostMultiplier=${logisticsCostMultiplier.toFixed(3)}`,
  ];
  if (projectBoost > 1) evidence.push(`activeProjectBoost=${projectBoost.toFixed(2)}`);
  if (util > 0) evidence.push(`networkUtilization=${util.toFixed(2)} utilFactor=${utilFactor.toFixed(2)}`);

  return {
    assetId: asset.id,
    category: asset.category,
    hostRegion: asset.hostRegion,
    productivityIndexDelta,
    logisticsCostMultiplier,
    freightCapacityIndex,
    travelTimeFactor,
    evidence,
  };
}

function initByRegion(): Record<AuRegionCode, RegionalTransportProductivity> {
  const out = {} as Record<AuRegionCode, RegionalTransportProductivity>;
  for (const code of AU_REGION_CODES) {
    out[code] = {
      regionId: code,
      productivityIndexBonus: 0,
      logisticsCostMultiplier: 1,
      freightCapacityIndex: 0,
      travelTimeFactor: 1,
      assetCount: 0,
      contributions: [],
    };
  }
  return out;
}

export function computeNationalTransportProductivity(
  inputs: TransportProductivityInputs,
): NationalTransportProductivityReport {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const byRegion = initByRegion();
  const servedAccum: Record<AuRegionCode, ReturnType<typeof emptyRegionalAccumulator>> = {} as Record<
    AuRegionCode,
    ReturnType<typeof emptyRegionalAccumulator>
  >;
  for (const code of AU_REGION_CODES) servedAccum[code] = emptyRegionalAccumulator();

  for (const asset of inputs.assets) {
    const contribution = computeAssetProductivityContribution(inputs, asset);
    if (!contribution) continue;

    const hostAcc = servedAccum[asset.hostRegion];
    mergeRegionalContribution(hostAcc, contribution);
    byRegion[asset.hostRegion].contributions.push(contribution);

    for (const regionId of asset.servedRegions) {
      if (regionId === asset.hostRegion) continue;
      if (!isAuRegionCode(regionId)) continue;
      const spill = {
        productivityIndexDelta: contribution.productivityIndexDelta * 0.35,
        logisticsCostMultiplier: 1 - (1 - contribution.logisticsCostMultiplier) * 0.4,
        freightCapacityIndex: contribution.freightCapacityIndex * 0.25,
        travelTimeFactor: 1 - (1 - contribution.travelTimeFactor) * 0.5,
      };
      mergeRegionalContribution(servedAccum[regionId], spill);
    }
  }

  for (const code of AU_REGION_CODES) {
    const acc = servedAccum[code];
    byRegion[code].productivityIndexBonus = acc.productivityIndexBonus;
    byRegion[code].logisticsCostMultiplier = finalizeRegionalLogisticsMultiplier(acc.logisticsCostMultiplier);
    byRegion[code].freightCapacityIndex = acc.freightCapacityIndex;
    byRegion[code].travelTimeFactor = finalizeRegionalTravelFactor(acc.travelTimeFactor, acc.assetCount);
    byRegion[code].assetCount = acc.assetCount;
  }

  let nationalProductivityIndexBonus = 0;
  let nationalLogisticsCostMultiplier = 1;
  let nationalFreightCapacityIndex = 0;
  for (const code of AU_REGION_CODES) {
    const r = byRegion[code];
    nationalProductivityIndexBonus += r.productivityIndexBonus;
    nationalLogisticsCostMultiplier *= r.logisticsCostMultiplier;
    nationalFreightCapacityIndex += r.freightCapacityIndex;
  }
  nationalLogisticsCostMultiplier = finalizeRegionalLogisticsMultiplier(
    Math.pow(nationalLogisticsCostMultiplier, 1 / AU_REGION_CODES.length),
  );
  nationalFreightCapacityIndex /= AU_REGION_CODES.length;

  const computeMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;

  return {
    schemaVersion: 'agent12/1',
    turn: inputs.turn,
    byRegion,
    nationalProductivityIndexBonus,
    nationalLogisticsCostMultiplier,
    nationalFreightCapacityIndex,
    computeMs,
  };
}

export function formatRegionalProductivitySummary(region: RegionalTransportProductivity): string {
  return [
    region.regionId,
    `Δprod=${region.productivityIndexBonus.toFixed(1)}`,
    `logistics×=${region.logisticsCostMultiplier.toFixed(3)}`,
    `freightIdx=${region.freightCapacityIndex.toFixed(0)}`,
    `travel×=${region.travelTimeFactor.toFixed(3)}`,
    `assets=${region.assetCount}`,
  ].join(' ');
}
