import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND6: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_illawarra_steel',
    name: 'Illawarra Steel Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['steel', 'port_access', 'freight_rail'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.043,
  },
  {
    id: 'corr_qld_cairns_trade',
    name: 'Cairns Tropical Trade Loop',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['export', 'container', 'port_access'],
    },
    productivitySynergyPoints: 5.4,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_act_capital_cold_chain',
    name: 'Capital Cold Chain Feed',
    networkKind: 'freight',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'warehouse'],
      NSW: ['motorway', 'freight'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.031,
  },
];
