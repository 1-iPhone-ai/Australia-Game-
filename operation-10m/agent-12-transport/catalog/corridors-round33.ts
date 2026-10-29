import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND33: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_green_pellet',
    name: 'WA–QLD Green Pellet',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['green_pellet_export', 'dri_feed_stock', 'decarb_bulk_rail'],
      QLD: ['green_pellet_export', 'dri_feed_stock', 'decarb_bulk_rail'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nsw_qld_flood_levee',
    name: 'NSW–QLD Flood Levee',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['flood_levee_rail', 'river_crossing_harden', 'inland_flood_routing'],
      QLD: ['flood_levee_rail', 'river_crossing_harden', 'inland_flood_routing'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_nsw_vic_zero_drayage',
    name: 'NSW–VIC Zero Drayage',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['zero_emission_drayage', 'port_gate_electric', 'short_haul_e_truck'],
      VIC: ['zero_emission_drayage', 'port_gate_electric', 'short_haul_e_truck'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.03,
  },
];
