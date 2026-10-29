import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND41: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_nsw_molten_salt_solar',
    name: 'SA–NSW Molten Salt Solar',
    networkKind: 'trade',
    regionSequence: ['SA', 'NSW'],
    requiredTagsByRegion: {
      SA: ['molten_salt_solar_export', 'csp_heat_rail_feed', 'thermal_renewable_export'],
      NSW: ['molten_salt_solar_export', 'csp_heat_rail_feed', 'thermal_renewable_export'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_vic_nsw_alpine_ski_resupply',
    name: 'VIC–NSW Alpine Ski Resupply',
    networkKind: 'mobility',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['alpine_ski_resort_supply', 'snowfield_logistics_staging', 'mountain_resort_freight'],
      NSW: ['alpine_ski_resort_supply', 'snowfield_logistics_staging', 'mountain_resort_freight'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_qld_rail_autonomous_shunting',
    name: 'NSW–QLD Rail Autonomous Shunting',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['rail_autonomous_shunting', 'yard_robot_sorting', 'automated_wagon_logistics'],
      QLD: ['rail_autonomous_shunting', 'yard_robot_sorting', 'automated_wagon_logistics'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.038,
  },
];
