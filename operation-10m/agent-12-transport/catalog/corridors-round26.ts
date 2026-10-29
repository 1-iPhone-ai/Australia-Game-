import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND26: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_green_steel_export',
    name: 'WA–SA Green Steel Export',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['green_steel', 'hydrogen_dri', 'export_slab'],
      SA: ['green_steel', 'hydrogen_dri', 'export_slab'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nt_wa_indigenous_airlift',
    name: 'NT–WA Indigenous Airlift',
    networkKind: 'mobility',
    regionSequence: ['NT', 'WA'],
    requiredTagsByRegion: {
      NT: ['indigenous_airlift', 'remote_community_supply', 'bush_runway'],
      WA: ['indigenous_airlift', 'remote_community_supply', 'bush_runway'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.029,
  },
  {
    id: 'corr_qld_nsw_berth_slot_relief',
    name: 'QLD–NSW Berth Slot Relief',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['berth_slot_optimizer', 'port_congestion_relief', 'tidal_window'],
      NSW: ['berth_slot_optimizer', 'port_congestion_relief', 'tidal_window'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.033,
  },
];
