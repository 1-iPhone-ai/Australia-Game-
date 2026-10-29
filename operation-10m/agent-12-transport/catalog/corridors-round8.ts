import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND8: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_brisbane_air_cargo_chain',
    name: 'Brisbane Air Cargo Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['air_freight', 'cargo_terminal', 'gateway'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_wa_kwinana_hydrogen_export',
    name: 'Kwinana Hydrogen Export Chain',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['hydrogen', 'energy_export', 'bulk'],
    },
    productivitySynergyPoints: 8.2,
    logisticsRelief: 0.046,
  },
  {
    id: 'corr_nsw_western_sydney_air_rail',
    name: 'Western Sydney Air-Rail Loop',
    networkKind: 'trade',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['air_freight', 'cargo_terminal'],
      ACT: ['air_freight', 'capital'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
];
