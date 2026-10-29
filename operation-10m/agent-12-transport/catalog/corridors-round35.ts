import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND35: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_silicon_wafer',
    name: 'NSW–VIC Silicon Wafer',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['silicon_wafer_export', 'pv_supply_chain', 'clean_energy_rail'],
      VIC: ['silicon_wafer_export', 'pv_supply_chain', 'clean_energy_rail'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_qld_coal_phaseout',
    name: 'NSW–QLD Coal Phaseout',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['coal_phaseout_rail', 'thermal_retirement_logistics', 'transition_freight'],
      QLD: ['coal_phaseout_rail', 'thermal_retirement_logistics', 'transition_freight'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_vic_baggage_robot',
    name: 'NSW–VIC Baggage Robot',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['baggage_robot_logistics', 'airport_sortation_auto', 'terminal_robot_staging'],
      VIC: ['baggage_robot_logistics', 'airport_sortation_auto', 'terminal_robot_staging'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.029,
  },
];
