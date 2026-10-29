import type {
  AuRegionCode,
  StrategicNetworkKind,
  TransportAsset,
  TransportAssetCondition,
} from '../types.ts';

export const CONDITION_OPERATIONAL_FACTOR: Record<TransportAssetCondition, number> = {
  excellent: 1.08,
  good: 1,
  fair: 0.82,
  degraded: 0.55,
  closed: 0,
};

export const UTILIZATION_PENALTY_K = 0.35;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function utilizationEffectiveFactor(utilization: number | undefined): number {
  if (utilization == null || !Number.isFinite(utilization)) return 1;
  const u = clamp(utilization, 0, 1.25);
  return clamp(1 - UTILIZATION_PENALTY_K * Math.max(0, u - 0.7), 0.55, 1.05);
}

export function roadFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'road' }>): number {
  const freightKm = asset.laneKilometres * asset.freightShare;
  const speedFactor = clamp(asset.designSpeedKmh / 100, 0.4, 1.2);
  const urbanPenalty = 1 - asset.urbanShare * 0.25;
  const tollBoost = asset.tollRoad ? 1.04 : 1;
  return clamp((freightKm / 120) * speedFactor * urbanPenalty * tollBoost * 8, 0, 100);
}

export function railFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'rail' }>): number {
  const tonneFactor = clamp(asset.designFreightTonnesPerYear / 25_000_000, 0.2, 1.4);
  const trackFactor = clamp(asset.trackKilometres / 800, 0.15, 1);
  const dualBoost = 1 + asset.dualTrackShare * 0.18;
  const elecBoost = 1 + asset.electrifiedShare * 0.06;
  return clamp(tonneFactor * trackFactor * dualBoost * elecBoost * 42, 0, 100);
}

export function portFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'port' }>): number {
  const teuFactor = clamp(asset.teuCapacityPerYear / 3_000_000, 0.15, 1.5);
  const berthFactor = clamp(asset.berthCount / 12, 0.2, 1.2);
  const draftFactor = clamp(asset.maxDraftMetres / 14, 0.5, 1.15);
  const autoBoost = 1 + asset.automationLevel * 0.05;
  const bulkAdj = 1 + asset.bulkShare * 0.12;
  return clamp(teuFactor * berthFactor * draftFactor * autoBoost * bulkAdj * 38, 0, 100);
}

export function logisticsFreightCapacityIndex(
  asset: Extract<TransportAsset, { category: 'logistics' }>,
): number {
  const sqmFactor = clamp(asset.warehouseSqm / 200_000, 0.1, 1.3);
  const linkBoost = 1 + asset.intermodalLinks.length * 0.07;
  const lastMile = 0.6 + asset.lastMileCoveragePct * 0.004;
  const cold = asset.coldChainCapable ? 1.08 : 1;
  return clamp(sqmFactor * linkBoost * lastMile * cold * 22, 0, 100);
}

export function assetFreightCapacityIndex(asset: TransportAsset): number {
  switch (asset.category) {
    case 'road':
      return roadFreightCapacityIndex(asset);
    case 'rail':
      return railFreightCapacityIndex(asset);
    case 'port':
      return portFreightCapacityIndex(asset);
    case 'logistics':
      return logisticsFreightCapacityIndex(asset);
    default:
      return 0;
  }
}

export function roadTravelTimeFactor(asset: Extract<TransportAsset, { category: 'road' }>): number {
  const congestion = 1 + asset.urbanShare * 0.35;
  const speedRelief = clamp(100 / (asset.designSpeedKmh * congestion), 0.45, 1.1);
  return clamp(speedRelief * (asset.tollRoad ? 0.92 : 1), 0.35, 1);
}

export function railTravelTimeFactor(asset: Extract<TransportAsset, { category: 'rail' }>): number {
  const pax = asset.passengerCapable ? 0.88 : 1;
  const dual = 1 - asset.dualTrackShare * 0.12;
  return clamp(pax * dual, 0.4, 1);
}

export function portTravelTimeFactor(_asset: Extract<TransportAsset, { category: 'port' }>): number {
  return 0.95;
}

export function logisticsTravelTimeFactor(
  asset: Extract<TransportAsset, { category: 'logistics' }>,
): number {
  return clamp(1 - asset.lastMileCoveragePct * 0.0025, 0.7, 1);
}

export function assetTravelTimeFactor(asset: TransportAsset): number {
  switch (asset.category) {
    case 'road':
      return roadTravelTimeFactor(asset);
    case 'rail':
      return railTravelTimeFactor(asset);
    case 'port':
      return portTravelTimeFactor(asset);
    case 'logistics':
      return logisticsTravelTimeFactor(asset);
    default:
      return 1;
  }
}

export function logisticsCostMultiplierFromCapacity(freightIndex: number, travelFactor: number): number {
  const capacityRelief = clamp(1 - freightIndex / 400, 0.72, 1);
  const travelRelief = clamp(travelFactor, 0.35, 1);
  return clamp(capacityRelief * (0.85 + travelRelief * 0.15), 0.55, 1);
}

export function productivityPointsFromAsset(
  asset: TransportAsset,
  operationalFactor: number,
  projectBoost: number,
): number {
  const base = asset.baseProductivityPoints * operationalFactor * projectBoost;
  const categoryWeight =
    asset.category === 'port' ? 1.12 : asset.category === 'rail' ? 1.08 : asset.category === 'logistics' ? 1.05 : 1;
  return clamp(base * categoryWeight, 0, 30);
}

export function networkUtilizationForAsset(
  asset: TransportAsset,
  networkUtilization: Partial<Record<StrategicNetworkKind, number>> | undefined,
): number {
  if (!networkUtilization || asset.strategicNetworks.length === 0) return 0;
  const vals = asset.strategicNetworks.map((k) => networkUtilization[k] ?? 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function emptyRegionalAccumulator(): {
  productivityIndexBonus: number;
  logisticsCostMultiplier: number;
  freightCapacityIndex: number;
  travelTimeFactor: number;
  assetCount: number;
} {
  return {
    productivityIndexBonus: 0,
    logisticsCostMultiplier: 1,
    freightCapacityIndex: 0,
    travelTimeFactor: 1,
    assetCount: 0,
  };
}

export function mergeRegionalContribution(
  acc: ReturnType<typeof emptyRegionalAccumulator>,
  contribution: {
    productivityIndexDelta: number;
    logisticsCostMultiplier: number;
    freightCapacityIndex: number;
    travelTimeFactor: number;
  },
): void {
  acc.productivityIndexBonus += contribution.productivityIndexDelta;
  acc.logisticsCostMultiplier *= contribution.logisticsCostMultiplier;
  acc.freightCapacityIndex += contribution.freightCapacityIndex;
  acc.travelTimeFactor *= contribution.travelTimeFactor;
  acc.assetCount += 1;
}

export function finalizeRegionalLogisticsMultiplier(raw: number): number {
  return clamp(raw, 0.5, 1.05);
}

export function finalizeRegionalTravelFactor(raw: number, count: number): number {
  if (count <= 0) return 1;
  return clamp(Math.pow(raw, 1 / count), 0.35, 1.05);
}

export function isAuRegionCode(value: string): value is AuRegionCode {
  return (
    value === 'NSW' ||
    value === 'VIC' ||
    value === 'QLD' ||
    value === 'WA' ||
    value === 'SA' ||
    value === 'TAS' ||
    value === 'NT' ||
    value === 'ACT'
  );
}
