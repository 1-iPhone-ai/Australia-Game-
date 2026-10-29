import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND46: TransportCorridorDefinition[] = [
  {
    id: 'corr_vic_sa_recycled_steel',
    name: 'VIC–SA Recycled Steel',
    networkKind: 'trade',
    regionSequence: ['VIC', 'SA'],
    requiredTagsByRegion: {
      VIC: ['recycled_steel_export', 'eaf_scrap_rail_feed', 'circular_metal_logistics'],
      SA: ['recycled_steel_export', 'eaf_scrap_rail_feed', 'circular_metal_logistics'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_sa_nt_remote_pathology',
    name: 'SA–NT Remote Pathology',
    networkKind: 'mobility',
    regionSequence: ['SA', 'NT'],
    requiredTagsByRegion: {
      SA: ['remote_pathology_supply', 'lab_sample_staging', 'diagnostic_health_logistics'],
      NT: ['remote_pathology_supply', 'lab_sample_staging', 'diagnostic_health_logistics'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_nsw_act_drone_cargo',
    name: 'NSW–ACT Drone Cargo',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['airport_drone_cargo', 'uav_freight_hub', 'aerodrome_micro_delivery'],
      ACT: ['airport_drone_cargo', 'uav_freight_hub', 'aerodrome_micro_delivery'],
    },
    productivitySynergyPoints: 6.7,
    logisticsRelief: 0.038,
  },
];
