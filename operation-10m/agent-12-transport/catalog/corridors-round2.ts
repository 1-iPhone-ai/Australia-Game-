import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND2: TransportCorridorDefinition[] = [
  {
    id: 'corr_hunter_export_chain',
    name: 'Hunter Coal Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['mining', 'bulk', 'freight_rail'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_gladstone_energy_export',
    name: 'Gladstone Energy Export Loop',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['bulk', 'multimodal'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_geelong_grain_chain',
    name: 'Geelong Grain & Port Chain',
    networkKind: 'trade',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['grain', 'port_rail'],
    },
    productivitySynergyPoints: 4.5,
    logisticsRelief: 0.028,
  },
  {
    id: 'corr_national_air_freight_feed',
    name: 'Air Freight Feed (Brisbane–Sydney–Melbourne)',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW', 'VIC'],
    requiredTagsByRegion: {
      QLD: ['air', 'perishables'],
      NSW: ['intermodal', 'warehouse'],
      VIC: ['intermodal'],
    },
    productivitySynergyPoints: 4,
    logisticsRelief: 0.025,
  },
  {
    id: 'corr_wa_kwinana_bulk',
    name: 'Kwinana Bulk Export Loop',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['bulk', 'port'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.032,
  },
];
