import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND43: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_vic_tidal_lagoon',
    name: 'TAS–VIC Tidal Lagoon',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['tidal_lagoon_export', 'tidal_barrage_rail_feed', 'marine_renewable_lagoon'],
      VIC: ['tidal_lagoon_export', 'tidal_barrage_rail_feed', 'marine_renewable_lagoon'],
    },
    productivitySynergyPoints: 6.7,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_remote_telehealth',
    name: 'NT–SA Remote Telehealth',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_telehealth_supply', 'clinic_medivac_staging', 'remote_health_logistics'],
      SA: ['remote_telehealth_supply', 'clinic_medivac_staging', 'remote_health_logistics'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nsw_vic_vertical_fulfillment',
    name: 'NSW–VIC Vertical Fulfillment',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['warehouse_vertical_fulfillment', 'urban_tower_sortation', 'dense_last_mile_hub'],
      VIC: ['warehouse_vertical_fulfillment', 'urban_tower_sortation', 'dense_last_mile_hub'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.04,
  },
];
