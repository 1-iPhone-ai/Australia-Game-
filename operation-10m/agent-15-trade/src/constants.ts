import type { GTELAccessBand, GTELCommodityId, GTELPartnerId } from './types.ts';

export const GTEL_COMMODITIES: GTELCommodityId[] = [
  'iron_ore',
  'coal',
  'lng',
  'wheat',
  'beef',
  'aluminium',
  'services',
  'manufacturing',
];

export const GTEL_COMMODITY_LABEL: Record<GTELCommodityId, string> = {
  iron_ore: 'Iron ore',
  coal: 'Coal',
  lng: 'LNG',
  wheat: 'Wheat',
  beef: 'Beef',
  aluminium: 'Aluminium',
  services: 'Services exports',
  manufacturing: 'Manufactured goods',
};

export const GTEL_PARTNER_DEFS: Array<{
  id: GTELPartnerId;
  label: string;
  baseOpenness: number;
  demandWeights: Partial<Record<GTELCommodityId, number>>;
  priceSensitivity: number;
  diplomaticActorIds: string[];
}> = [
  {
    id: 'asia_pacific',
    label: 'Asia–Pacific buyers',
    baseOpenness: 0.92,
    demandWeights: { iron_ore: 1.2, coal: 0.9, lng: 1.1, aluminium: 1.0, manufacturing: 0.85, services: 0.7 },
    priceSensitivity: 1.05,
    diplomaticActorIds: ['ai', 'rival_east', 'team_blue_lead'],
  },
  {
    id: 'india_ocean',
    label: 'Indian Ocean & ASEAN',
    baseOpenness: 0.88,
    demandWeights: { wheat: 1.1, beef: 0.95, coal: 0.8, services: 0.75, manufacturing: 0.9 },
    priceSensitivity: 1.0,
    diplomaticActorIds: ['rival_south'],
  },
  {
    id: 'north_america',
    label: 'North America',
    baseOpenness: 0.75,
    demandWeights: { lng: 0.9, services: 1.15, manufacturing: 1.05, beef: 0.85 },
    priceSensitivity: 0.95,
    diplomaticActorIds: ['rival_west'],
  },
  {
    id: 'europe',
    label: 'Europe',
    baseOpenness: 0.7,
    demandWeights: { lng: 1.0, services: 1.1, aluminium: 0.95, wheat: 0.6 },
    priceSensitivity: 0.9,
    diplomaticActorIds: ['rival_north'],
  },
  {
    id: 'domestic_premium',
    label: 'Domestic premium channels',
    baseOpenness: 1.0,
    demandWeights: { wheat: 0.8, beef: 0.85, services: 0.5, manufacturing: 0.55 },
    priceSensitivity: 0.85,
    diplomaticActorIds: ['player'],
  },
];

export const GTEL_LIMITS = { history: 24, embargoCooldown: 8, smoothing: 0.35, maxEvent: 6, maxAgreements: 12 } as const;

export const GTEL_ACCESS_RANK: Record<GTELAccessBand, number> = {
  blocked: 0,
  restricted: 1,
  normal: 2,
  preferred: 3,
  strategic: 4,
};

export const GTEL_BASE_COMMODITY_INDEX: Record<GTELCommodityId, number> = {
  iron_ore: 100,
  coal: 88,
  lng: 112,
  wheat: 76,
  beef: 82,
  aluminium: 95,
  services: 105,
  manufacturing: 98,
};

export const AU_TRADE_REGIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;
