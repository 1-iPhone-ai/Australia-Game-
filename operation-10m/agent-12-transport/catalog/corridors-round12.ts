import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND12: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_pilbara_critical_minerals',
    name: 'Pilbara Critical Minerals Export',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['critical_minerals', 'lithium', 'bulk'],
    },
    productivitySynergyPoints: 7.8,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_qld_gladstone_channel_chain',
    name: 'Gladstone Channel Maintenance Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['dredging', 'pilotage', 'channel_depth'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_indigenous_remote_supply',
    name: 'Top End Indigenous Remote Supply',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD', 'WA'],
    requiredTagsByRegion: {
      NT: ['indigenous_supply', 'remote_community', 'remote'],
      QLD: ['remote_community', 'remote'],
      WA: ['indigenous_supply', 'remote'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.036,
  },
];
