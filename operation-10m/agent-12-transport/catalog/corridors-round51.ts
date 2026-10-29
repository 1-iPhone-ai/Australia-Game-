import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND51: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_superconducting_hvdc',
    name: 'NSW–VIC Superconducting HVDC',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['superconducting_hvdc_export', 'hvdc_superconducting_logistics', 'superconducting_freight_corridor'],
      VIC: ['superconducting_hvdc_export', 'hvdc_superconducting_logistics', 'superconducting_freight_corridor'],
    },
    productivitySynergyPoints: 7.3,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_nicu_remote',
    name: 'NT–SA Remote NICU',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_neonatal_icu_supply', 'nicu_care_staging', 'neonatal_critical_care_logistics'],
      SA: ['remote_neonatal_icu_supply', 'nicu_care_staging', 'neonatal_critical_care_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_wa_qld_methanol_dual_fuel_bunkering',
    name: 'WA–QLD Methanol Dual-Fuel Bunkering',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_methanol_dual_fuel_bunkering', 'green_methanol_mooring', 'dual_fuel_bunkering'],
      QLD: ['port_methanol_dual_fuel_bunkering', 'green_methanol_mooring', 'dual_fuel_bunkering'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
];
