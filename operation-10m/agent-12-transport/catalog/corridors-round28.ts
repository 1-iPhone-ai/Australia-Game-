import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND28: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_copper_concentrate',
    name: 'WA–QLD Copper Concentrate',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['copper_concentrate', 'smelter_feed', 'export_bulk'],
      QLD: ['copper_concentrate', 'smelter_feed', 'export_bulk'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nsw_vic_pharma_cold_chain',
    name: 'NSW–VIC Pharma Cold Chain',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['pharma_cold_chain', 'vaccine_logistics', 'gmp_freight'],
      VIC: ['pharma_cold_chain', 'vaccine_logistics', 'gmp_freight'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_nsw_vic_pax_freight_path',
    name: 'NSW–VIC Pax–Freight Path',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['pax_freight_path', 'shared_corridor', 'off_peak_slot'],
      VIC: ['pax_freight_path', 'shared_corridor', 'off_peak_slot'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.029,
  },
];
