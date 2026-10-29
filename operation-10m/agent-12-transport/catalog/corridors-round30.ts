import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND30: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_nsw_nickel_precursor',
    name: 'WA–NSW Nickel Precursor',
    networkKind: 'trade',
    regionSequence: ['WA', 'NSW'],
    requiredTagsByRegion: {
      WA: ['nickel_cobalt_precursor', 'battery_cathode_feed', 'critical_mineral_rail'],
      NSW: ['nickel_cobalt_precursor', 'battery_cathode_feed', 'critical_mineral_rail'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_tas_remote_island_sealift',
    name: 'QLD–TAS Remote Island Sealift',
    networkKind: 'trade',
    regionSequence: ['QLD', 'TAS'],
    requiredTagsByRegion: {
      QLD: ['remote_island_sealift', 'pacific_island_supply', 'sea_lift_staging'],
      TAS: ['remote_island_sealift', 'pacific_island_supply', 'sea_lift_staging'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_nsw_vic_inland_terminal_auto',
    name: 'NSW–VIC Inland Terminal Auto',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['inland_terminal_auto', 'rail_terminal_robot', 'automated_gantry'],
      VIC: ['inland_terminal_auto', 'rail_terminal_robot', 'automated_gantry'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
];
