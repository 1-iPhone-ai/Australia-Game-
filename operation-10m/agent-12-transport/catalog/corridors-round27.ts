import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND27: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_vic_offshore_wind_tow',
    name: 'WA–VIC Offshore Wind Tow',
    networkKind: 'trade',
    regionSequence: ['WA', 'VIC'],
    requiredTagsByRegion: {
      WA: ['wind_tow_install', 'nacelle_lift', 'offshore_staging'],
      VIC: ['wind_tow_install', 'nacelle_lift', 'offshore_staging'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_nsw_qld_ev_battery_recycle',
    name: 'NSW–QLD EV Battery Recycle',
    networkKind: 'freight',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['ev_battery_recycle', 'black_mass_logistics', 'circular_battery'],
      QLD: ['ev_battery_recycle', 'black_mass_logistics', 'circular_battery'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_nsw_vic_courier_microhub',
    name: 'NSW–VIC Courier Microhub',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['courier_microhub', 'same_day_urban', 'e_cargo_bike'],
      VIC: ['courier_microhub', 'same_day_urban', 'e_cargo_bike'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.03,
  },
];
