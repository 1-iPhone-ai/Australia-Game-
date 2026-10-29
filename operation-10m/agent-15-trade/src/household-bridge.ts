import { GTEL_BASE_COMMODITY_INDEX } from './constants.ts';
import type { GTELState } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export function applyGlobalTradeHouseholdOverrides<T extends Record<string, any>>(inputs: T, view: GTELState | null): T {
  if (!view || inputs.enabled === false) return inputs;
  const prices: Record<string, number> = { ...(inputs.commodityPrices || {}) };
  view.commodities.forEach(c => {
    prices[c.commodity] = c.effectiveIndex;
  });
  const base = inputs.baseCommodityPrices || { ...GTEL_BASE_COMMODITY_INDEX };
  return {
    ...inputs,
    exportSectorBoom: Boolean(inputs.exportSectorBoom) || view.domestic.exportSectorBoom,
    commodityPrices: prices,
    baseCommodityPrices: base,
    transportNetworkHealth: gtelClamp(gtelNum(inputs.transportNetworkHealth, 70) + view.domestic.transportHealthDelta, 35, 100),
    existingIndustryDemandSources: [...(inputs.existingIndustryDemandSources || []), `gtel:${view.domestic.exportVsDomesticModel}`],
    regionalTradeStress: view.regionalImpacts?.map(r => `${r.regionId}:${r.stabilityDelta}`) || [],
  };
}
