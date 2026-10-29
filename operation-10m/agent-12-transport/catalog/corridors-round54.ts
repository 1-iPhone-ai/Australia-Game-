import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND54: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_tokamak_deuterium',
    name: 'NSW–VIC Stellarator Helium-3',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['tokamak_deuterium_export', 'helium3_export_logistics', 'stellarator_freight_corridor'],
      VIC: ['tokamak_deuterium_export', 'helium3_export_logistics', 'stellarator_freight_corridor'],
    },
    productivitySynergyPoints: 7.3,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_nicu_remote',
    name: 'NT–SA Remote Burn Center',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_burn_center_supply', 'burn_center_staging', 'burn_center_critical_care_logistics'],
      SA: ['remote_burn_center_supply', 'burn_center_staging', 'burn_center_critical_care_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_wa_qld_methanol_liquid_hydrogen_bunkering',
    name: 'WA–QLD Green Ammonia E-Fuel Bunkering',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_liquid_hydrogen_bunkering', 'liquid_hydrogen_mooring', 'liquid_hydrogen_bunkering'],
      QLD: ['port_liquid_hydrogen_bunkering', 'liquid_hydrogen_mooring', 'liquid_hydrogen_bunkering'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
];
