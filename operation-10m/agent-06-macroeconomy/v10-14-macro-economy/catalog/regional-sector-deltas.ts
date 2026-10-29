import type { MacroSectorId } from './types.ts';

/** Stylized sector productivity deltas per region (matches canonical Section 20AG). */
export const V1014_MACRO_REGION_SECTOR_DELTAS: Record<string, Partial<Record<MacroSectorId, number>>> = {
  NSW: {
    mining: -4,
    energy: -1,
    manufacturing: 2,
    agriculture: 5,
    services: -3,
    technology: 0,
    tourism: 3,
    construction: -5,
    trade_logistics: -2
  },
  VIC: {
    mining: 4,
    energy: -4,
    manufacturing: -1,
    agriculture: 2,
    services: 5,
    technology: -3,
    tourism: 0,
    construction: 3,
    trade_logistics: -5
  },
  QLD: {
    mining: -1,
    energy: 2,
    manufacturing: 5,
    agriculture: -3,
    services: 0,
    technology: 3,
    tourism: -5,
    construction: -2,
    trade_logistics: 1
  },
  WA: {
    mining: 5,
    energy: -3,
    manufacturing: 0,
    agriculture: 3,
    services: -5,
    technology: -2,
    tourism: 1,
    construction: 4,
    trade_logistics: -4
  },
  SA: {
    mining: 1,
    energy: 4,
    manufacturing: -4,
    agriculture: -1,
    services: 2,
    technology: 5,
    tourism: -3,
    construction: 0,
    trade_logistics: 3
  },
  TAS: {
    mining: 2,
    energy: 5,
    manufacturing: -3,
    agriculture: 0,
    services: 3,
    technology: -5,
    tourism: -2,
    construction: 1,
    trade_logistics: 4
  },
  NT: {
    mining: -4,
    energy: -1,
    manufacturing: 2,
    agriculture: 5,
    services: -3,
    technology: 0,
    tourism: 3,
    construction: -5,
    trade_logistics: -2
  },
  ACT: {
    mining: 5,
    energy: -3,
    manufacturing: 0,
    agriculture: 3,
    services: -5,
    technology: -2,
    tourism: 1,
    construction: 4,
    trade_logistics: -4
  }
};
