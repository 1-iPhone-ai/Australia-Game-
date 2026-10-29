import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND15: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_pacific_feeder_chain',
    name: 'Queensland Pacific Feeder Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['pacific_feeder', 'tradelane_pacific', 'feeder'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_act_medical_supply',
    name: 'NSW–ACT Medical Supply Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['medical_supply', 'health_freight', 'pharma_cold'],
      ACT: ['medical_supply', 'pharma_cold', 'capital'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_nsw_vic_data_centre_mesh',
    name: 'NSW–VIC Data Centre Logistics Mesh',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['data_centre', 'hyperscale_logistics', 'digital_infra'],
      VIC: ['data_centre', 'digital_infra'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.035,
  },
];
