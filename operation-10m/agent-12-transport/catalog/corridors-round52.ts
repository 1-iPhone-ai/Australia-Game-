import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND52: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_fusion_tritium_breeding',
    name: 'NSW–VIC Fusion Tritium Breeding',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['fusion_tritium_breeding_export', 'tritium_breeding_logistics', 'fusion_freight_corridor'],
      VIC: ['fusion_tritium_breeding_export', 'tritium_breeding_logistics', 'fusion_freight_corridor'],
    },
    productivitySynergyPoints: 7.3,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_nicu_remote',
    name: 'NT–SA Remote Pediatric Oncology',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_pediatric_oncology_supply', 'pediatric_oncology_staging', 'oncology_critical_care_logistics'],
      SA: ['remote_pediatric_oncology_supply', 'pediatric_oncology_staging', 'oncology_critical_care_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_wa_qld_methanol_liquefied_biofuel_bunkering',
    name: 'WA–QLD Bio-LNG Bunkering',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_bio_lng_bunkering', 'bio_lng_mooring', 'liquefied_biofuel_bunkering'],
      QLD: ['port_bio_lng_bunkering', 'bio_lng_mooring', 'liquefied_biofuel_bunkering'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
];
