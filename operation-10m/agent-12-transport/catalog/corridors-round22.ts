import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND22: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_wa_grid_battery_chain',
    name: 'SA–WA Grid Battery Chain',
    networkKind: 'freight',
    regionSequence: ['SA', 'WA'],
    requiredTagsByRegion: {
      SA: ['grid_battery', 'bess_logistics', 'storage_export'],
      WA: ['grid_battery', 'bess_logistics', 'storage_export'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_qld_nt_pacific_sealift',
    name: 'QLD–NT Pacific Sealift',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NT'],
    requiredTagsByRegion: {
      QLD: ['pacific_humanitarian', 'sealift_relief', 'disaster_supply'],
      NT: ['pacific_humanitarian', 'sealift_relief', 'disaster_supply'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_nsw_vic_autonomous_port_tractor',
    name: 'NSW–VIC Autonomous Port Tractor',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['autonomous_tractor', 'port_yard_robot', 'terminal_automation'],
      VIC: ['autonomous_tractor', 'port_yard_robot', 'terminal_automation'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
];
