import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND21: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_floating_wind_staging',
    name: 'WA–SA Floating Wind Staging',
    networkKind: 'freight',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['floating_wind', 'offshore_staging', 'turbine_logistics'],
      SA: ['floating_wind', 'offshore_staging', 'turbine_logistics'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_nt_qld_medicine_airlift',
    name: 'NT–QLD Medicine Airlift',
    networkKind: 'mobility',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['critical_medicine', 'medevac_airlift', 'pharma_cold_chain'],
      QLD: ['critical_medicine', 'medevac_airlift', 'pharma_cold_chain'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_vic_freight_drone_spine',
    name: 'NSW–VIC Freight Drone Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['freight_drone', 'regional_uav', 'last_mile_aerial'],
      VIC: ['freight_drone', 'regional_uav', 'last_mile_aerial'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.029,
  },
];
