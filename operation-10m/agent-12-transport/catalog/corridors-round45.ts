import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND45: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_floating_solar',
    name: 'WA–QLD Floating Solar',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['floating_solar_export', 'floating_pv_marine_feed', 'offshore_solar_logistics'],
      QLD: ['floating_solar_export', 'floating_pv_marine_feed', 'offshore_solar_logistics'],
    },
    productivitySynergyPoints: 6.9,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_nsw_vic_coastal_rescue',
    name: 'NSW–VIC Coastal Rescue',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['coastal_rescue_staging', 'sar_helicopter_hub', 'maritime_emergency_logistics'],
      VIC: ['coastal_rescue_staging', 'sar_helicopter_hub', 'maritime_emergency_logistics'],
    },
    productivitySynergyPoints: 6.7,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_qld_battery_swap',
    name: 'NSW–QLD Battery Swap',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['port_battery_swapping', 'shore_power_exchange', 'electric_ferry_logistics'],
      QLD: ['port_battery_swapping', 'shore_power_exchange', 'electric_ferry_logistics'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.039,
  },
];
