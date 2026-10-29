import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND38: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_deep_geothermal',
    name: 'WA–SA Deep Geothermal',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['deep_geothermal_export', 'geothermal_heat_rail_feed', 'baseload_renewable_export'],
      SA: ['deep_geothermal_export', 'geothermal_heat_rail_feed', 'baseload_renewable_export'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.039,
  },
  {
    id: 'corr_qld_nsw_coastal_flood_evac',
    name: 'QLD–NSW Coastal Flood Evac',
    networkKind: 'mobility',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['coastal_flood_evac_staging', 'levee_evac_hub', 'storm_surge_logistics'],
      NSW: ['coastal_flood_evac_staging', 'levee_evac_hub', 'storm_surge_logistics'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_vic_nsw_warehouse_robot_sortation',
    name: 'VIC–NSW Warehouse Robot Sortation',
    networkKind: 'freight',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['warehouse_robot_sortation', 'automated_pallet_hub', 'ecom_robot_logistics'],
      NSW: ['warehouse_robot_sortation', 'automated_pallet_hub', 'ecom_robot_logistics'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.035,
  },
];
