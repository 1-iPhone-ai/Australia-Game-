import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND50: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_quantum_cryogenic',
    name: 'NSW–VIC Quantum Cryogenic',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['quantum_cryogenic_export', 'dilution_refrigerator_logistics', 'cryo_freight_corridor'],
      VIC: ['quantum_cryogenic_export', 'dilution_refrigerator_logistics', 'cryo_freight_corridor'],
    },
    productivitySynergyPoints: 7.3,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_ecmo_remote',
    name: 'NT–SA Remote ECMO',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_ecmo_supply', 'ecmo_care_staging', 'critical_care_logistics'],
      SA: ['remote_ecmo_supply', 'ecmo_care_staging', 'critical_care_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_wa_qld_ammonia_bunkering',
    name: 'WA–QLD Ammonia Bunkering',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_ammonia_bunkering', 'green_ammonia_mooring', 'emission_free_bunkering'],
      QLD: ['port_ammonia_bunkering', 'green_ammonia_mooring', 'emission_free_bunkering'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
];
