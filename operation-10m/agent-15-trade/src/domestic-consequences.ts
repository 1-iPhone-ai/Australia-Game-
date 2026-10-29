import { AU_TRADE_REGIONS } from './constants.ts';
import type {
  GTELCommodityQuote,
  GTELDomesticCoupling,
  GTELNationalSystemsSlice,
  GTELPartnerMarket,
  RegionalDomesticImpact,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

const REGION_EXPORT_WEIGHT: Record<string, Partial<Record<string, number>>> = {
  WA: { iron_ore: 1, coal: 0.6, lng: 0.8 },
  QLD: { coal: 0.9, beef: 0.5, lng: 0.4 },
  NSW: { services: 0.7, manufacturing: 0.6, wheat: 0.4 },
  VIC: { manufacturing: 0.8, services: 0.6, beef: 0.3 },
  SA: { wheat: 0.7, manufacturing: 0.4, wine: 0.2 },
  TAS: { beef: 0.5, services: 0.3 },
  NT: { beef: 0.4, lng: 0.3 },
  ACT: { services: 0.9 },
};

function regionCommodityExposure(regionId: string, commodities: GTELCommodityQuote[]): number {
  const weights = REGION_EXPORT_WEIGHT[regionId] || { services: 0.4 };
  let exposure = 0;
  Object.entries(weights).forEach(([key, w]) => {
    const c = commodities.find(q => q.commodity === key);
    if (!c) return;
    const move = (c.effectiveIndex - c.baseIndex) / Math.max(1, c.baseIndex);
    exposure += gtelNum(w, 0) * move;
  });
  return exposure;
}

export function computeRegionalDomesticImpacts(params: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  domestic: GTELDomesticCoupling;
  nationalSystems: GTELNationalSystemsSlice | null;
  shockStress: number;
  shockRegions: string[];
}): RegionalDomesticImpact[] {
  const { commodities, partners, domestic, nationalSystems, shockStress, shockRegions } = params;
  const blockedPartners = partners.filter(p => p.access === 'blocked' || p.access === 'restricted').length;
  const networkStrain = ['critical', 'bottlenecked', 'strained'].includes(
    String(nationalSystems?.national?.trade?.condition || 'healthy'),
  );

  return AU_TRADE_REGIONS.map(regionId => {
    const exposure = regionCommodityExposure(regionId, commodities);
    const shockHit = shockRegions.includes(regionId) ? shockStress : shockStress * 0.35;
    const employmentDelta = gtelClamp(
      exposure * 0.12 + (domestic.exportSectorBoom ? 0.04 : 0) - shockHit * 0.15 - (networkStrain ? 0.03 : 0),
      -0.2,
      0.18,
    );
    const consumerPricePressure = gtelClamp(
      domestic.householdOffset * -0.5 + shockHit * 0.2 + (blockedPartners > 1 ? 0.03 : 0),
      -0.15,
      0.25,
    );
    const stabilityDelta = gtelClamp(
      -Math.abs(employmentDelta) * 0.4 - consumerPricePressure * 0.3 + (domestic.exportVsDomesticModel === 'domestically_balanced' ? 0.02 : 0),
      -0.15,
      0.08,
    );
    let narrative = 'Trade spillover is muted this turn.';
    if (employmentDelta > 0.06) narrative = 'Export premiums are supporting regional jobs.';
    else if (employmentDelta < -0.06) narrative = 'Export softness is weighing on regional employment.';
    if (consumerPricePressure > 0.08) narrative += ' Households face higher import-linked prices.';
    if (shockHit > 0.08) narrative += ' An active world shock is amplifying local stress.';

    return {
      regionId,
      employmentDelta: Math.round(employmentDelta * 1000) / 1000,
      consumerPricePressure: Math.round(consumerPricePressure * 1000) / 1000,
      stabilityDelta: Math.round(stabilityDelta * 1000) / 1000,
      narrative,
    };
  });
}

export function summarizeDomesticConsequences(impacts: RegionalDomesticImpact[]): string {
  const worst = [...impacts].sort((a, b) => a.stabilityDelta - b.stabilityDelta)[0];
  const best = [...impacts].sort((a, b) => b.employmentDelta - a.employmentDelta)[0];
  if (!worst || !best) return 'No regional domestic impacts computed.';
  return `Strongest employment lift: ${best.regionId}. Greatest stability pressure: ${worst.regionId} — ${worst.narrative}`;
}

export function aggregateDomesticStabilityPenalty(impacts: RegionalDomesticImpact[]): number {
  if (!impacts.length) return 0;
  const avg = impacts.reduce((a, i) => a + i.stabilityDelta, 0) / impacts.length;
  return gtelClamp(-avg * 10, 0, 8);
}
