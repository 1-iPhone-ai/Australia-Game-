import type { TransportCorridorDefinition } from '../types.ts';

export const TRANSPORT_CORRIDORS_ROUND7: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_pilbara_lithium_bulk',
    name: 'Pilbara Lithium Bulk Export Chain',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['mining', 'heavy_haul', 'bulk'],
    },
    productivitySynergyPoints: 8.6,
    logisticsRelief: 0.048,
  },
  {
    id: 'corr_nt_barkly_remote_supply',
    name: 'Barkly Remote Supply Chain',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote', 'gateway'],
      QLD: ['national_highway', 'freight'],
    },
    productivitySynergyPoints: 5.2,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_tas_devonport_fresh_export',
    name: 'Devonport Fresh Export Loop',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['island', 'export'],
      VIC: ['intermodal', 'container'],
    },
    productivitySynergyPoints: 4.6,
    logisticsRelief: 0.029,
  },
];
