import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND5: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_bass_trade',
    name: 'Bass Strait Trade Bridge',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['bass_strait', 'export'],
      VIC: ['port_access', 'motorway'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_darwin_gate',
    name: 'Top End Darwin Export Gate',
    networkKind: 'trade',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['export', 'port_access'],
      QLD: ['remote', 'freight'],
    },
    productivitySynergyPoints: 5.1,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_nsw_hunter_export',
    name: 'Hunter Valley Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['coal', 'port_access', 'freight_rail'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.041,
  },
];
