import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND23: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_autonomous_heavy_haul',
    name: 'WA–QLD Autonomous Heavy Haul',
    networkKind: 'freight',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['autonomous_heavy_haul', 'ore_auto_rail', 'driverless_pilbara'],
      QLD: ['autonomous_heavy_haul', 'ore_auto_rail'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_nsw_gbr_biosecurity',
    name: 'QLD–NSW GBR Biosecurity',
    networkKind: 'trade',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['gbr_biosecurity', 'reef_quarantine', 'coral_trade_guard'],
      NSW: ['gbr_biosecurity', 'reef_quarantine', 'coral_trade_guard'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_vic_night_freight_window',
    name: 'NSW–VIC Night Freight Window',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['night_freight', 'curfew_logistics', 'off_peak_urban'],
      VIC: ['night_freight', 'curfew_logistics', 'off_peak_urban'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.031,
  },
];
