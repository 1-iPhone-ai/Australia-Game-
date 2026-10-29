import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND40: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_desalination_brine',
    name: 'WA–SA Desalination Brine',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['desalination_brine_export', 'desal_plant_rail_feed', 'industrial_brine_logistics'],
      SA: ['desalination_brine_export', 'desal_plant_rail_feed', 'industrial_brine_logistics'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_vic_nsw_wildlife_rescue_airlift',
    name: 'VIC–NSW Wildlife Rescue Airlift',
    networkKind: 'mobility',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['wildlife_rescue_airlift', 'fauna_medevac_staging', 'rescue_rotary_logistics'],
      NSW: ['wildlife_rescue_airlift', 'fauna_medevac_staging', 'rescue_rotary_logistics'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_nsw_vic_urban_ev_freight_charging',
    name: 'NSW–VIC Urban EV Freight Charging',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['urban_ev_freight_charging', 'depot_fast_charge_hub', 'last_mile_ev_logistics'],
      VIC: ['urban_ev_freight_charging', 'depot_fast_charge_hub', 'last_mile_ev_logistics'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.037,
  },
];
