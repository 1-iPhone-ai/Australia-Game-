import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND36: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_vic_offshore_wind_cable',
    name: 'TAS–VIC Offshore Wind Cable',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['offshore_wind_cable_export', 'subsea_hvdc_feed', 'renewable_export_rail'],
      VIC: ['offshore_wind_cable_export', 'subsea_hvdc_feed', 'renewable_export_rail'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nt_wa_medevac_heli',
    name: 'NT–WA Medevac Heli',
    networkKind: 'mobility',
    regionSequence: ['NT', 'WA'],
    requiredTagsByRegion: {
      NT: ['medevac_heli_staging', 'remote_clinic_airlift', 'emergency_rotary_logistics'],
      WA: ['medevac_heli_staging', 'remote_clinic_airlift', 'emergency_rotary_logistics'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_qld_tas_reef_restoration',
    name: 'QLD–TAS Reef Restoration',
    networkKind: 'trade',
    regionSequence: ['QLD', 'TAS'],
    requiredTagsByRegion: {
      QLD: ['reef_restoration_logistics', 'marine_reef_supply', 'coastal_eco_staging'],
      TAS: ['reef_restoration_logistics', 'marine_reef_supply', 'coastal_eco_staging'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.031,
  },
];
