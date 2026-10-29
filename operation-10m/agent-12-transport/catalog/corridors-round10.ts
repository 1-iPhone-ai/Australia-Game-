import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND10: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_melbourne_deep_sea',
    name: 'Sydney–Melbourne Deep-Sea Gateway',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['deep_sea', 'tradelane', 'mega_container'],
      VIC: ['deep_sea', 'container', 'gateway'],
    },
    productivitySynergyPoints: 7.4,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_qld_brisbane_tradelane',
    name: 'Brisbane Pacific Tradelane Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['deep_sea', 'tradelane', 'gateway'],
    },
    productivitySynergyPoints: 6.9,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_nsw_vic_electric_freight',
    name: 'NSW–VIC Electric Freight Corridor',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['electric_freight', 'charging', 'motorway'],
      VIC: ['bev', 'charging', 'freight'],
      ACT: ['electric_freight', 'capital'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.035,
  },
];
