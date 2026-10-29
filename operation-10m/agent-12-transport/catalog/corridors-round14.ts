import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND14: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_grain_export_belt',
    name: 'SA Grain Export Belt',
    networkKind: 'trade',
    regionSequence: ['SA', 'VIC'],
    requiredTagsByRegion: {
      SA: ['grain_export', 'agricultural_bulk', 'grain'],
      VIC: ['harvest_corridor', 'grain'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nsw_track_possession_mesh',
    name: 'NSW Track Possession Mesh',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['track_possession', 'maintenance_window', 'rail_availability'],
      ACT: ['rail_availability', 'freight_rail'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_qld_green_bunkering_chain',
    name: 'Queensland Green Bunkering Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['green_bunkering', 'ammonia_fuel', 'shore_power'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.037,
  },
];
