import { GTEL_ACCESS_RANK, GTEL_COMMODITIES } from './constants.ts';
import type {
  GTELCommodityId,
  GTELCommodityQuote,
  GTELLogisticsStress,
  GTELNationalSystemsSlice,
  GTELPartnerMarket,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

const BULK: GTELCommodityId[] = ['iron_ore', 'coal', 'lng', 'wheat', 'beef', 'aluminium'];

export function computeLogisticsStress(params: {
  nationalSystems: GTELNationalSystemsSlice | null;
  partners: GTELPartnerMarket[];
  exportThroughput: number;
  openDisputeCount: number;
}): GTELLogisticsStress {
  const condition = String(params.nationalSystems?.national?.trade?.condition || 'healthy');
  const rank: Record<string, number> = {
    surplus: 0.12,
    healthy: 0.05,
    strained: -0.08,
    bottlenecked: -0.16,
    critical: -0.28,
  };
  const networkStrain = rank[condition] ?? 0;
  const restrictedRoutes = params.partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] <= 1).length;
  const redundancyScore = gtelClamp(1 - restrictedRoutes * 0.18 - params.openDisputeCount * 0.04, 0.15, 1);
  const throughputRatio = gtelClamp(params.exportThroughput / 120, 0, 1.4);
  const freightPressure = gtelClamp(0.45 - redundancyScore * 0.35 + (throughputRatio > 1 ? 0.08 : 0) - networkStrain, 0, 1);
  const effectiveThroughput = Math.round(params.exportThroughput * (0.75 + redundancyScore * 0.25 + networkStrain) * 10) / 10;
  let band: GTELLogisticsStress['band'] = 'fluid';
  if (freightPressure > 0.72) band = 'congested';
  else if (freightPressure > 0.48) band = 'tight';
  else if (freightPressure > 0.28) band = 'watch';
  const summary =
    band === 'congested'
      ? 'Port and corridor congestion is capping export conversion.'
      : band === 'tight'
        ? 'Freight lanes are tight — schedule risk is elevated.'
        : band === 'watch'
          ? 'Logistics are manageable but redundancy is thin.'
          : 'Export logistics have adequate redundancy.';
  return {
    band,
    freightPressure: Math.round(freightPressure * 1000) / 1000,
    redundancyScore: Math.round(redundancyScore * 1000) / 1000,
    effectiveExportThroughput: effectiveThroughput,
    networkStrain: Math.round(networkStrain * 1000) / 1000,
    summary,
  };
}

export function deriveLogisticsCommodityModifiers(logistics: GTELLogisticsStress): Partial<Record<GTELCommodityId, number>> {
  const penalty = gtelClamp(logistics.freightPressure * 0.12, 0, 0.1);
  const out: Partial<Record<GTELCommodityId, number>> = {};
  BULK.forEach(c => {
    out[c] = -penalty * (c === 'services' ? 0.3 : 1);
  });
  out.services = -penalty * 0.35;
  out.manufacturing = -penalty * 0.55;
  return out;
}

export function applyLogisticsToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  logistics: GTELLogisticsStress,
): GTELCommodityQuote[] {
  const mods = deriveLogisticsCommodityModifiers(logistics);
  return commodities.map(c => {
    const logisticsMod = gtelNum(mods[c.commodity], 0);
    if (!logisticsMod) return c;
    const effectiveIndex = Math.round(c.effectiveIndex * (1 + logisticsMod) * 10) / 10;
    return {
      ...c,
      effectiveIndex,
      evidence: [...c.evidence, `Logistics ${logistics.band}: ${logistics.summary}`],
    };
  });
}

export function logisticsWorldEvent(logistics: GTELLogisticsStress, turn: number): {
  id: string;
  turn: number;
  kind: 'trade';
  title: string;
  summary: string;
  regionIds: string[];
} | null {
  if (logistics.band !== 'congested' && logistics.band !== 'tight') return null;
  return {
    id: `gtel_logistics_${logistics.band}_${turn}`,
    turn,
    kind: 'trade',
    title: logistics.band === 'congested' ? 'Export corridor congestion' : 'Freight lane tightness',
    summary: logistics.summary,
    regionIds: ['NSW', 'VIC', 'QLD', 'WA'],
  };
}
