import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND11: TransportCorridorDefinition[] = [
  {
    id: 'corr_nt_defence_northern_mobility',
    name: 'Northern Defence Mobility Chain',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD', 'WA'],
    requiredTagsByRegion: {
      NT: ['defence_logistics', 'strategic_mobility', 'remote'],
      QLD: ['defence_logistics', 'military_freight'],
      WA: ['strategic_mobility', 'remote'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_nsw_weather_resilience_spine',
    name: 'NSW Weather Resilience Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['weather_resilience', 'flood_bypass', 'motorway'],
      ACT: ['weather_resilience', 'capital'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_vic_digital_freight_mesh',
    name: 'Victoria Digital Freight Mesh',
    networkKind: 'trade',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['digital_freight', 'visibility', 'telemetry'],
      NSW: ['digital_freight', 'gateway'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.037,
  },
];
