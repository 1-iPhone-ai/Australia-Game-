import type {
  GTELCommodityQuote,
  GTELExportCapacitySnapshot,
  GTELLogisticsStress,
  GTELMarketDiversificationSnapshot,
  GTELPartnerMarket,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELExportCapacityBand = GTELExportCapacitySnapshot['band'];

function capacityBand(utilization: number): GTELExportCapacityBand {
  if (utilization >= 0.94) return 'saturated';
  if (utilization >= 0.78) return 'tight';
  if (utilization >= 0.55) return 'balanced';
  return 'slack';
}

export function sanitizeExportCapacitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.62), 0.35, 0.98);
}

export function createEmptyExportCapacitySnapshot(): GTELExportCapacitySnapshot {
  return {
    utilization: 0.62,
    band: 'balanced',
    allocationEfficiency: 0.58,
    priorityCommodities: [],
    summary: 'Export capacity is broadly balanced across commodity lanes.',
  };
}

export function advanceExportCapacitySmoothing(
  persisted: GTELPersisted,
  rawUtilization: number,
): GTELPersisted {
  const prev = sanitizeExportCapacitySmoothing(persisted.exportCapacitySmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawUtilization, 0.35, 0.98) * 0.26, 0.35, 0.98);
  return { ...persisted, exportCapacitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeExportCapacitySnapshot(input: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  logistics: GTELLogisticsStress;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  exportThroughput: number;
  persisted: GTELPersisted;
}): { snapshot: GTELExportCapacitySnapshot; persisted: GTELPersisted } {
  const throughputNorm = gtelClamp(input.exportThroughput / 130, 0.35, 1.05);
  const logisticsLoad = gtelClamp(
    (input.logistics.band === 'congested' ? 0.18 : input.logistics.band === 'tight' ? 0.1 : 0.04) +
      input.logistics.networkStrain * 0.12,
    0,
    0.28,
  );
  const diversificationDrag =
    input.marketDiversification.band === 'critical'
      ? 0.08
      : input.marketDiversification.band === 'concentrated'
        ? 0.05
        : 0.02;
  const termsLift =
    input.termsOfTrade.band === 'favorable' ? -0.04 : input.termsOfTrade.band === 'severely_unfavorable' ? 0.06 : 0;
  const avgQuote =
    input.commodities.reduce((a, c) => a + c.effectiveIndex, 0) / Math.max(1, input.commodities.length);
  const quoteHeat = gtelClamp((avgQuote - 98) / 55, -0.05, 0.12);
  const rawUtilization = gtelClamp(
    throughputNorm * 0.55 + logisticsLoad + diversificationDrag + termsLift + quoteHeat + 0.08,
    0.35,
    0.98,
  );
  const persisted = advanceExportCapacitySmoothing(input.persisted, rawUtilization);
  const utilization = sanitizeExportCapacitySmoothing(persisted.exportCapacitySmoothing);
  const band = capacityBand(utilization);

  const weights = input.commodities.map(c => {
    const partnerDemand = input.partners.reduce((acc, p) => {
      const w = gtelNum(p.demandWeights[c.commodity], 0.35);
      return acc + w * (p.access === 'blocked' ? 0.2 : p.access === 'restricted' ? 0.55 : 1);
    }, 0);
    return {
      commodity: c.commodity,
      weight: gtelClamp(c.effectiveIndex / 105 + partnerDemand * 0.08 + (c.trend === 'rising' ? 0.04 : 0), 0.2, 1.4),
    };
  });
  weights.sort((a, b) => b.weight - a.weight);
  const priorityCommodities = weights.slice(0, 3).map(w => w.commodity);
  const spread =
    weights.length > 1 ? weights[0].weight - weights[weights.length - 1].weight : 0;
  const allocationEfficiency = gtelClamp(
    0.52 +
      (band === 'slack' ? 0.08 : band === 'balanced' ? 0.04 : -0.06) -
      spread * 0.05 +
      (input.marketDiversification.band === 'well_spread' ? 0.05 : 0),
    0.28,
    0.92,
  );

  const summary =
    band === 'saturated'
      ? 'Port and rail slots are saturated — export allocation is rationing lower-priority commodities.'
      : band === 'tight'
        ? 'Capacity is tight; planners are prioritising high-value export lanes.'
        : band === 'slack'
          ? 'Spare export capacity allows broader commodity mix without rationing.'
          : 'Export capacity utilisation is balanced across major commodity lanes.';

  return {
    snapshot: {
      utilization: Math.round(utilization * 1000) / 1000,
      band,
      allocationEfficiency: Math.round(allocationEfficiency * 1000) / 1000,
      priorityCommodities,
      summary,
    },
    persisted,
  };
}

export function applyExportCapacityToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  snapshot: GTELExportCapacitySnapshot,
): GTELCommodityQuote[] {
  if (snapshot.band === 'balanced' || snapshot.band === 'slack') return commodities;
  const boost = snapshot.band === 'saturated' ? -0.018 : -0.01;
  const priority = new Set(snapshot.priorityCommodities);
  return commodities.map(c => {
    const isPriority = priority.has(c.commodity);
    const delta = isPriority ? Math.abs(boost) * 0.65 : boost;
    const effectiveIndex = gtelClamp(Math.round((c.effectiveIndex * (1 + delta)) * 10) / 10, 45, 175);
    return {
      ...c,
      effectiveIndex,
      evidence: [
        ...c.evidence,
        isPriority
          ? 'Export capacity rationing prioritised this commodity lane'
          : 'Export capacity rationing trimmed non-priority quotes',
      ],
    };
  });
}

export function exportCapacityExportScale(snapshot: GTELExportCapacitySnapshot): number {
  if (snapshot.band === 'slack') return gtelClamp(1 + (0.62 - snapshot.utilization) * 0.08, 1, 1.04);
  if (snapshot.band === 'saturated') return gtelClamp(0.9 + snapshot.allocationEfficiency * 0.08, 0.88, 0.96);
  if (snapshot.band === 'tight') return gtelClamp(0.94 + snapshot.allocationEfficiency * 0.05, 0.9, 0.99);
  return gtelClamp(0.96 + snapshot.allocationEfficiency * 0.04, 0.92, 1.02);
}

export function exportCapacityDomesticStress(snapshot: GTELExportCapacitySnapshot): number {
  if (snapshot.band === 'saturated') return gtelClamp((snapshot.utilization - 0.78) * 0.18, 0, 0.08);
  if (snapshot.band === 'tight') return gtelClamp((snapshot.utilization - 0.7) * 0.1, 0, 0.05);
  return 0;
}

export function exportCapacityWorldEvent(
  snapshot: GTELExportCapacitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'saturated' || snapshot.utilization < 0.92) return null;
  return {
    id: `gtel_capacity_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export capacity rationing',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function exportCapacityGiNotes(
  capacity: GTELExportCapacitySnapshot | null | undefined,
): string[] {
  if (!capacity) return [];
  return [
    `Export capacity: ${capacity.band.replace(/_/g, ' ')} (${Math.round(capacity.utilization * 100)}% utilisation).`,
    capacity.summary,
  ];
}
