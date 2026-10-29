import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND42: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_nsw_biomethane_grid',
    name: 'QLD–NSW Biomethane Grid',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['biomethane_grid_export', 'anaerobic_digest_rail_feed', 'renewable_gas_logistics'],
      NSW: ['biomethane_grid_export', 'anaerobic_digest_rail_feed', 'renewable_gas_logistics'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.043,
  },
  {
    id: 'corr_wa_nt_mining_camp_resupply',
    name: 'WA–NT Mining Camp Resupply',
    networkKind: 'freight',
    regionSequence: ['WA', 'NT'],
    requiredTagsByRegion: {
      WA: ['mining_camp_resupply', 'fly_in_fly_out_staging', 'remote_site_freight'],
      NT: ['mining_camp_resupply', 'fly_in_fly_out_staging', 'remote_site_freight'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_vic_sa_port_container_reefer',
    name: 'VIC–SA Port Container Reefer',
    networkKind: 'trade',
    regionSequence: ['VIC', 'SA'],
    requiredTagsByRegion: {
      VIC: ['port_container_reefer', 'cold_chain_teus', 'refrigerated_export_hub'],
      SA: ['port_container_reefer', 'cold_chain_teus', 'refrigerated_export_hub'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.039,
  },
];
