/**
 * Partner and corridor constants for V1014_TRADE_DEPTH.
 */
export const V1014_TRADE_DEPTH_PARTNERS = [
  'asia_pacific',
  'india_ocean',
  'north_america',
  'europe',
  'domestic_premium',
  'china',
  'japan',
  'indonesia',
  'south_korea',
  'united_kingdom',
  'singapore',
  'new_zealand',
] as const;

export const V1014_TRADE_DEPTH_COMMODITIES = [
  'iron_ore',
  'coal',
  'lng',
  'wheat',
  'beef',
  'aluminium',
  'services',
  'manufacturing',
  'rare_earths',
  'lithium_battery',
  'education_exports',
  'tourism_services',
] as const;

export type V1014TradeDepthPartnerId = (typeof V1014_TRADE_DEPTH_PARTNERS)[number];
export type V1014TradeDepthCommodityId = (typeof V1014_TRADE_DEPTH_COMMODITIES)[number];
