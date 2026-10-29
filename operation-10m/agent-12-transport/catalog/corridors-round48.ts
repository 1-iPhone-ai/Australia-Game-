import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND48: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_green_h2_electrolyzer',
    name: 'WA–QLD Green H2 Electrolyzer',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['green_hydrogen_electrolyzer', 'electrolyzer_export', 'renewable_h2_logistics'],
      QLD: ['green_hydrogen_electrolyzer', 'electrolyzer_export', 'renewable_h2_logistics'],
    },
    productivitySynergyPoints: 7.2,
    logisticsRelief: 0.043,
  },
  {
    id: 'corr_nsw_act_organ_transplant',
    name: 'NSW–ACT Organ Transplant',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['remote_organ_transplant', 'organ_cold_chain_staging', 'transplant_logistics'],
      ACT: ['remote_organ_transplant', 'organ_cold_chain_staging', 'transplant_logistics'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_vic_shore_power',
    name: 'NSW–VIC Shore Power',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['port_shore_power', 'cold_ironing_logistics', 'zero_emission_berthing'],
      VIC: ['port_shore_power', 'cold_ironing_logistics', 'zero_emission_berthing'],
    },
    productivitySynergyPoints: 6.9,
    logisticsRelief: 0.04,
  },
];
