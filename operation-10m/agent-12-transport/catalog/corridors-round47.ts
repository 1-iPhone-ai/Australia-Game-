import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND47: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_nsw_e_waste',
    name: 'QLD–NSW E-Waste Critical Minerals',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['e_waste_critical_minerals', 'urban_mining_export', 'circular_electronics_logistics'],
      NSW: ['e_waste_critical_minerals', 'urban_mining_export', 'circular_electronics_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_wa_sa_regional_oncology',
    name: 'WA–SA Regional Oncology',
    networkKind: 'mobility',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['regional_oncology_supply', 'radiotherapy_staging', 'cancer_care_logistics'],
      SA: ['regional_oncology_supply', 'radiotherapy_staging', 'cancer_care_logistics'],
    },
    productivitySynergyPoints: 6.9,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_vic_tas_autonomous_tug',
    name: 'VIC–TAS Autonomous Tug',
    networkKind: 'freight',
    regionSequence: ['VIC', 'TAS'],
    requiredTagsByRegion: {
      VIC: ['port_autonomous_tug', 'smart_berthing_tug', 'harbour_robotics_logistics'],
      TAS: ['port_autonomous_tug', 'smart_berthing_tug', 'harbour_robotics_logistics'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.039,
  },
];
