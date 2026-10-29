import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND32: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_vanadium_flow',
    name: 'WA–SA Vanadium Flow',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['vanadium_flow_export', 'grid_storage_mineral', 'bulk_battery_feed'],
      SA: ['vanadium_flow_export', 'grid_storage_mineral', 'bulk_battery_feed'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_vic_bushfire_evac',
    name: 'NSW–VIC Bushfire Evac',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['bushfire_evac_rail', 'smoke_routing', 'emergency_passenger_haul'],
      VIC: ['bushfire_evac_rail', 'smoke_routing', 'emergency_passenger_haul'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_sa_vic_grain_silo_auto',
    name: 'SA–VIC Grain Silo Auto',
    networkKind: 'freight',
    regionSequence: ['SA', 'VIC'],
    requiredTagsByRegion: {
      SA: ['auto_grain_silo', 'bulk_rail_loadout', 'harvest_peak_staging'],
      VIC: ['auto_grain_silo', 'bulk_rail_loadout', 'harvest_peak_staging'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.031,
  },
];
