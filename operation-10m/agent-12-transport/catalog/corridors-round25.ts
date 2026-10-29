import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND25: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_nsw_saf_blending',
    name: 'QLD–NSW SAF Blending',
    networkKind: 'mobility',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['saf_blending', 'sustainable_aviation_fuel', 'airport_fuel_hub'],
      NSW: ['saf_blending', 'sustainable_aviation_fuel', 'airport_fuel_hub'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_nt_wa_outback_diesel',
    name: 'NT–WA Outback Diesel',
    networkKind: 'freight',
    regionSequence: ['NT', 'WA'],
    requiredTagsByRegion: {
      NT: ['outback_diesel', 'remote_fuel_security', 'haul_road_supply'],
      WA: ['outback_diesel', 'remote_fuel_security', 'haul_road_supply'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_nsw_vic_double_stack_rail',
    name: 'NSW–VIC Double-Stack Rail',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['double_stack', 'container_rail_duplication', 'clearance_gauge'],
      VIC: ['double_stack', 'container_rail_duplication', 'clearance_gauge'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
];
