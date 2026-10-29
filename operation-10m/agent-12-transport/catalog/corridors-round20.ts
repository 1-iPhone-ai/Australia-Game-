import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND20: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_offshore_ccs_chain',
    name: 'WA Offshore CCS Chain',
    networkKind: 'freight',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['offshore_ccs', 'co2_injection', 'carbon_hub'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_qld_nsw_h2_lng_export',
    name: 'QLD–NSW H2 LNG Export',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['hydrogen_lng', 'h2_liquefaction', 'export_cryogenic'],
      NSW: ['hydrogen_lng', 'export_cryogenic'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_vic_microfreight_spine',
    name: 'NSW–VIC Microfreight Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['microfreight', 'last_mile_hub', 'e_cargo_bike'],
      VIC: ['microfreight', 'last_mile_hub', 'e_cargo_bike'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.03,
  },
];
