import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND44: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_sa_marine_kelp',
    name: 'TAS–SA Marine Kelp',
    networkKind: 'trade',
    regionSequence: ['TAS', 'SA'],
    requiredTagsByRegion: {
      TAS: ['marine_kelp_export', 'kelp_hatchery_rail_feed', 'seaweed_bulk_logistics'],
      SA: ['marine_kelp_export', 'kelp_hatchery_rail_feed', 'seaweed_bulk_logistics'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.043,
  },
  {
    id: 'corr_wa_nt_remote_dialysis',
    name: 'WA–NT Remote Dialysis',
    networkKind: 'mobility',
    regionSequence: ['WA', 'NT'],
    requiredTagsByRegion: {
      WA: ['remote_dialysis_supply', 'clinic_dialysis_staging', 'renal_health_logistics'],
      NT: ['remote_dialysis_supply', 'clinic_dialysis_staging', 'renal_health_logistics'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_qld_rail_inspection',
    name: 'NSW–QLD Rail Inspection',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['rail_automated_inspection', 'track_geometry_scan', 'autonomous_safety_logistics'],
      QLD: ['rail_automated_inspection', 'track_geometry_scan', 'autonomous_safety_logistics'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.041,
  },
];
