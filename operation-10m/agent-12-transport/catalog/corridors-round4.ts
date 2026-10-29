import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND4: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_cape_supply',
    name: 'Cape York Remote Supply Chain',
    networkKind: 'freight',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['remote', 'national_highway', 'mining'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_sa_spencer_gulf',
    name: 'Spencer Gulf Grain Export',
    networkKind: 'trade',
    regionSequence: ['SA'],
    requiredTagsByRegion: {
      SA: ['grain', 'bulk', 'port_access'],
    },
    productivitySynergyPoints: 5.4,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_blue_mountains_pass',
    name: 'Blue Mountains Intercapital Pass',
    networkKind: 'freight',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['grade', 'freight_rail', 'motorway'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_wa_onslow_lng',
    name: 'Onslow LNG Logistics Spine',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['lng', 'trade', 'remote'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_act_hume_bypass',
    name: 'Capital Hume Bypass Feed',
    networkKind: 'mobility',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'warehouse'],
      NSW: ['motorway', 'freight'],
    },
    productivitySynergyPoints: 3.8,
    logisticsRelief: 0.026,
  },
];
