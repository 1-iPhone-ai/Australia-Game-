import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND49: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_vic_semiconductor_packaging',
    name: 'NSW–VIC Semiconductor Packaging',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['advanced_semiconductor_packaging', 'chiplet_export_logistics', 'cleanroom_freight_corridor'],
      VIC: ['advanced_semiconductor_packaging', 'chiplet_export_logistics', 'cleanroom_freight_corridor'],
    },
    productivitySynergyPoints: 7.3,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_nt_sa_burn_unit_remote',
    name: 'NT–SA Remote Burn Unit',
    networkKind: 'mobility',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['remote_burn_unit_supply', 'burn_care_staging', 'trauma_logistics'],
      SA: ['remote_burn_unit_supply', 'burn_care_staging', 'trauma_logistics'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_wa_qld_wind_assisted_berthing',
    name: 'WA–QLD Wind-Assisted Berthing',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_wind_assisted_berthing', 'kite_tow_logistics', 'emission_free_mooring'],
      QLD: ['port_wind_assisted_berthing', 'kite_tow_logistics', 'emission_free_mooring'],
    },
    productivitySynergyPoints: 7.0,
    logisticsRelief: 0.041,
  },
];
