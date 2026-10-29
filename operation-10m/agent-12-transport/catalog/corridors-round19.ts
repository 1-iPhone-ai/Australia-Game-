import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND19: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_rare_earth_chain',
    name: 'WA–QLD Rare-Earth Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
      QLD: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_tas_vic_trans_tasman_reefer',
    name: 'TAS–VIC Trans-Tasman Reefer',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['trans_tasman', 'reefer_express', 'cold_chain_sea'],
      VIC: ['trans_tasman', 'reefer_express', 'cold_chain_sea'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_nsw_sa_zero_emission_truck_spine',
    name: 'NSW–SA Zero-Emission Truck Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'SA'],
    requiredTagsByRegion: {
      NSW: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
      SA: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
];
