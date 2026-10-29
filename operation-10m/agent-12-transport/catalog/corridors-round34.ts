import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND34: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_titanium_sponge',
    name: 'WA–SA Titanium Sponge',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['titanium_sponge_export', 'defense_aero_feed', 'critical_metal_rail'],
      SA: ['titanium_sponge_export', 'defense_aero_feed', 'critical_metal_rail'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_sa_heatwave_rail',
    name: 'NSW–SA Heatwave Rail',
    networkKind: 'freight',
    regionSequence: ['NSW', 'SA'],
    requiredTagsByRegion: {
      NSW: ['heatwave_rail_caution', 'thermal_track_limit', 'summer_freight_hold'],
      SA: ['heatwave_rail_caution', 'thermal_track_limit', 'summer_freight_hold'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_qld_nt_livestock_export',
    name: 'QLD–NT Livestock Export',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NT'],
    requiredTagsByRegion: {
      QLD: ['auto_livestock_yard', 'export_quarantine_staging', 'cattle_rail_loadout'],
      NT: ['auto_livestock_yard', 'export_quarantine_staging', 'cattle_rail_loadout'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.031,
  },
];
