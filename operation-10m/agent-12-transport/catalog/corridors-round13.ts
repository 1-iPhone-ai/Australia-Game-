import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND13: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_adelaide_gauge_bridge',
    name: 'Adelaide Gauge Interoperability Bridge',
    networkKind: 'freight',
    regionSequence: ['SA', 'VIC', 'NSW'],
    requiredTagsByRegion: {
      SA: ['gauge_standard', 'interoperability', 'intermodal'],
      VIC: ['standard_gauge', 'freight_rail'],
      NSW: ['gauge_break', 'interoperability'],
    },
    productivitySynergyPoints: 6.7,
    logisticsRelief: 0.039,
  },
  {
    id: 'corr_nsw_disaster_recovery_ring',
    name: 'NSW Disaster Recovery Ring',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['disaster_recovery', 'emergency_staging'],
      ACT: ['emergency_relief', 'capital'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_vic_circular_freight_loop',
    name: 'Victoria Circular Freight Loop',
    networkKind: 'freight',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['circular_economy', 'waste_logistics', 'recycle_freight'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.031,
  },
];
