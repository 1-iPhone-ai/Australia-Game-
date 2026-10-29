import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND39: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_vic_offshore_wave_energy',
    name: 'TAS–VIC Offshore Wave Energy',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['offshore_wave_energy_export', 'wave_farm_cable_feed', 'marine_renewable_export'],
      VIC: ['offshore_wave_energy_export', 'wave_farm_cable_feed', 'marine_renewable_export'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_nt_wa_remote_school_supply',
    name: 'NT–WA Remote School Supply',
    networkKind: 'mobility',
    regionSequence: ['NT', 'WA'],
    requiredTagsByRegion: {
      NT: ['remote_school_supply_staging', 'outback_education_logistics', 'community_supply_airlift'],
      WA: ['remote_school_supply_staging', 'outback_education_logistics', 'community_supply_airlift'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_wa_qld_lithium_hydroxide',
    name: 'WA–QLD Lithium Hydroxide',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['port_lithium_hydroxide_logistics', 'battery_precursor_staging', 'cathode_export_hub'],
      QLD: ['port_lithium_hydroxide_logistics', 'battery_precursor_staging', 'cathode_export_hub'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.036,
  },
];
