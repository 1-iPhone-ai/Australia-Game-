import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND24: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_methanol_bunkering',
    name: 'WA–QLD Methanol Bunkering',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['methanol_bunkering', 'green_methanol', 'bunker_export'],
      QLD: ['methanol_bunkering', 'green_methanol', 'bunker_export'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_tas_sa_antarctic_resupply',
    name: 'TAS–SA Antarctic Resupply',
    networkKind: 'trade',
    regionSequence: ['TAS', 'SA'],
    requiredTagsByRegion: {
      TAS: ['antarctic_resupply', 'polar_logistics', 'icebreaker_staging'],
      SA: ['antarctic_resupply', 'polar_logistics', 'icebreaker_staging'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_nsw_vic_smart_border_preclear',
    name: 'NSW–VIC Smart Border Preclear',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['smart_border', 'preclear_freight', 'digital_customs_gate'],
      VIC: ['smart_border', 'preclear_freight', 'digital_customs_gate'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.03,
  },
];
