import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND18: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_lithium_brine_chain',
    name: 'WA–SA Lithium Brine Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['lithium_brine', 'brine_export', 'battery_feedstock'],
      SA: ['lithium_brine', 'brine_export', 'battery_feedstock'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_qld_nsw_inland_rail_express',
    name: 'QLD–NSW Inland Rail Express',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['inland_rail_express', 'express_freight', 'intermodal_express'],
      NSW: ['inland_rail_express', 'express_freight', 'intermodal_express'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_sa_space_launch_spine',
    name: 'NT–SA Space Launch Spine',
    networkKind: 'freight',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['space_launch', 'launch_logistics', 'orbital_supply'],
      SA: ['space_launch', 'launch_logistics', 'orbital_supply'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
];
