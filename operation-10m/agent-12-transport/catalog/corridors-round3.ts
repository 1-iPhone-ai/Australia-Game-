import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND3: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_sydney_freight_ring',
    name: 'Sydney Freight Ring',
    networkKind: 'freight',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['intermodal', 'port_rail', 'container'],
    },
    productivitySynergyPoints: 6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_coal_chain',
    name: 'Queensland Coal Export Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['bulk', 'mining', 'freight_rail'],
    },
    productivitySynergyPoints: 7.5,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_vic_western_distribution',
    name: 'Western Melbourne Distribution Hub',
    networkKind: 'freight',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['warehouse', 'intermodal', 'motorway'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_tas_devonport_bass',
    name: 'Devonport Bass Gateway',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['island', 'container'],
      VIC: ['intermodal'],
    },
    productivitySynergyPoints: 4.2,
    logisticsRelief: 0.028,
  },
];
