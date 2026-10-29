import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND9: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_bass_short_sea',
    name: 'Bass Strait Short-Sea Chain',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['coastal_shipping', 'roro', 'island'],
      VIC: ['short_sea', 'roro', 'container'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.039,
  },
  {
    id: 'corr_qld_gladstone_biosecurity',
    name: 'Gladstone Biosecurity Export Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['biosecurity', 'quarantine', 'bulk'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_nsw_vic_autonomous_freight_spine',
    name: 'NSW–VIC Autonomous Freight Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['autonomous', 'motorway', 'smart_freight'],
      VIC: ['platoon', 'motorway', 'freight'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
];
