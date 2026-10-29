import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND37: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_sa_pumped_hydro_renewable',
    name: 'NSW–SA Pumped Hydro Renewable',
    networkKind: 'trade',
    regionSequence: ['NSW', 'SA'],
    requiredTagsByRegion: {
      NSW: ['pumped_hydro_renewable_export', 'grid_storage_rail_feed', 'renewable_pumped_export'],
      SA: ['pumped_hydro_renewable_export', 'grid_storage_rail_feed', 'renewable_pumped_export'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_vic_nsw_wildfire_airtanker',
    name: 'VIC–NSW Wildfire Airtanker',
    networkKind: 'mobility',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['wildfire_airtanker_staging', 'aerial_firefighting_base', 'bushfire_tanker_logistics'],
      NSW: ['wildfire_airtanker_staging', 'aerial_firefighting_base', 'bushfire_tanker_logistics'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_qld_suburban_micro_fulfillment',
    name: 'NSW–QLD Suburban Micro Fulfillment',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['suburban_micro_fulfillment', 'ecom_sortation_hub', 'last_mile_micro_hub'],
      QLD: ['suburban_micro_fulfillment', 'ecom_sortation_hub', 'last_mile_micro_hub'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.033,
  },
];
