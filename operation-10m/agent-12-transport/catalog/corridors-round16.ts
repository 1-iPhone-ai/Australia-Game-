import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND16: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_offshore_wind_chain',
    name: 'WA–SA Offshore Wind Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['offshore_wind', 'wind_farm_logistics', 'turbine_staging'],
      SA: ['offshore_wind', 'offshore_staging', 'wind_farm_logistics'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_wa_battery_export_spine',
    name: 'Western Australia Battery Export Spine',
    networkKind: 'freight',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['battery_supply', 'lithium_logistics', 'ev_freight'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_nsw_cruise_turnaround',
    name: 'QLD–NSW Cruise Turnaround Corridor',
    networkKind: 'mobility',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['cruise_turnaround', 'tourism_port', 'passenger_freight'],
      NSW: ['cruise_turnaround', 'tourism_port'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.033,
  },
];
