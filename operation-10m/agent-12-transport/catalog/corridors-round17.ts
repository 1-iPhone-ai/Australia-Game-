import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND17: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_qld_subsea_cable_chain',
    name: 'NSW–QLD Subsea Cable Chain',
    networkKind: 'trade',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['subsea_cable', 'cable_landing', 'digital_trade'],
      QLD: ['subsea_cable', 'telecom_landing', 'digital_trade'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_wa_sa_green_ammonia_export',
    name: 'WA–SA Green Ammonia Export Spine',
    networkKind: 'freight',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['green_ammonia', 'ammonia_export', 'hydrogen_derivative'],
      SA: ['green_ammonia', 'renewable_export', 'ammonia_export'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_vic_airport_express_spine',
    name: 'NSW–VIC Airport Express Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['airport_express', 'air_rail', 'passenger_freight'],
      VIC: ['airport_express', 'air_rail'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
];
