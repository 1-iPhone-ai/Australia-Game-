import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND29: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_alumina_export',
    name: 'WA–QLD Alumina Export',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['alumina_refining', 'bauxite_export', 'smelter_input'],
      QLD: ['alumina_refining', 'bauxite_export', 'smelter_input'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_qld_nsw_disaster_relief_air',
    name: 'QLD–NSW Disaster Relief Air',
    networkKind: 'mobility',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['disaster_relief_air', 'emergency_air_bridge', 'humanitarian_lift'],
      NSW: ['disaster_relief_air', 'emergency_air_bridge', 'humanitarian_lift'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_nsw_vic_yard_automation',
    name: 'NSW–VIC Yard Automation',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['yard_automation', 'straddle_crane_auto', 'terminal_throughput'],
      VIC: ['yard_automation', 'straddle_crane_auto', 'terminal_throughput'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
];
