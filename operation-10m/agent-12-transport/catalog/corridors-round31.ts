import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND31: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_graphite_anode',
    name: 'WA–QLD Graphite Anode',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['graphite_anode_export', 'battery_anode_feed', 'synthetic_graphite_rail'],
      QLD: ['graphite_anode_export', 'battery_anode_feed', 'synthetic_graphite_rail'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nt_qld_cyclone_coastal',
    name: 'NT–QLD Cyclone Coastal',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['cyclone_resilient_coastal', 'tropical_storm_routing', 'coastal_freight_harden'],
      QLD: ['cyclone_resilient_coastal', 'tropical_storm_routing', 'coastal_freight_harden'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_vic_ebus_depot',
    name: 'NSW–VIC E-Bus Depot',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['e_bus_depot_charge', 'transit_depot_logistics', 'fleet_charge_staging'],
      VIC: ['e_bus_depot_charge', 'transit_depot_logistics', 'fleet_charge_staging'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.029,
  },
];
