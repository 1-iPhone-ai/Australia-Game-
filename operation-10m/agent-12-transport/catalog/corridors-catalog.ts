import type { AuRegionCode, StrategicNetworkKind, TransportCorridorDefinition } from '../types.ts';
import { TRANSPORT_CORRIDORS_ROUND2 } from './corridors-round2.ts';
import { TRANSPORT_CORRIDORS_ROUND3 } from './corridors-round3.ts';
import { TRANSPORT_CORRIDORS_ROUND4 } from './corridors-round4.ts';
import { TRANSPORT_CORRIDORS_ROUND5 } from './corridors-round5.ts';
import { TRANSPORT_CORRIDORS_ROUND6 } from './corridors-round6.ts';
import { TRANSPORT_CORRIDORS_ROUND7 } from './corridors-round7.ts';
import { TRANSPORT_CORRIDORS_ROUND8 } from './corridors-round8.ts';
import { TRANSPORT_CORRIDORS_ROUND9 } from './corridors-round9.ts';
import { TRANSPORT_CORRIDORS_ROUND10 } from './corridors-round10.ts';
import { TRANSPORT_CORRIDORS_ROUND11 } from './corridors-round11.ts';
import { TRANSPORT_CORRIDORS_ROUND12 } from './corridors-round12.ts';
import { TRANSPORT_CORRIDORS_ROUND13 } from './corridors-round13.ts';
import { TRANSPORT_CORRIDORS_ROUND14 } from './corridors-round14.ts';
import { TRANSPORT_CORRIDORS_ROUND15 } from './corridors-round15.ts';
import { TRANSPORT_CORRIDORS_ROUND16 } from './corridors-round16.ts';
import { TRANSPORT_CORRIDORS_ROUND17 } from './corridors-round17.ts';
import { TRANSPORT_CORRIDORS_ROUND18 } from './corridors-round18.ts';
import { TRANSPORT_CORRIDORS_ROUND19 } from './corridors-round19.ts';
import { TRANSPORT_CORRIDORS_ROUND20 } from './corridors-round20.ts';
import { TRANSPORT_CORRIDORS_ROUND21 } from './corridors-round21.ts';
import { TRANSPORT_CORRIDORS_ROUND22 } from './corridors-round22.ts';
import { TRANSPORT_CORRIDORS_ROUND23 } from './corridors-round23.ts';
import { TRANSPORT_CORRIDORS_ROUND24 } from './corridors-round24.ts';
import { TRANSPORT_CORRIDORS_ROUND25 } from './corridors-round25.ts';
import { TRANSPORT_CORRIDORS_ROUND26 } from './corridors-round26.ts';
import { TRANSPORT_CORRIDORS_ROUND27 } from './corridors-round27.ts';
import { TRANSPORT_CORRIDORS_ROUND28 } from './corridors-round28.ts';

export const TRANSPORT_CORRIDORS: TransportCorridorDefinition[] = [
  {
    id: 'corr_east_coast_freight',
    name: 'East Coast Freight Chain',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW', 'VIC'],
    requiredTagsByRegion: {
      QLD: ['national_highway', 'freight'],
      NSW: ['freight', 'motorway'],
      VIC: ['motorway', 'port_access'],
    },
    productivitySynergyPoints: 8,
    logisticsRelief: 0.06,
  },
  {
    id: 'corr_sydney_melbourne_mobility',
    name: 'Sydney–Melbourne Mobility Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['freight', 'national_highway'],
      VIC: ['motorway'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_transcontinental_road',
    name: 'Transcontinental Road Link',
    networkKind: 'freight',
    regionSequence: ['WA', 'SA', 'NSW'],
    requiredTagsByRegion: {
      WA: ['mining', 'port_access'],
      SA: ['transcontinental', 'east_west'],
      NSW: ['national_highway'],
    },
    productivitySynergyPoints: 7,
    logisticsRelief: 0.05,
  },
  {
    id: 'corr_pilbara_export',
    name: 'Pilbara Export System',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['mining', 'bulk', 'heavy_haul'],
    },
    productivitySynergyPoints: 9,
    logisticsRelief: 0.07,
  },
  {
    id: 'corr_qld_inland_rail',
    name: 'Queensland Inland Rail Feed',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['inland_rail', 'freight'],
      NSW: ['freight_rail', 'intercapital'],
    },
    productivitySynergyPoints: 7.5,
    logisticsRelief: 0.055,
  },
  {
    id: 'corr_northern_gateway',
    name: 'Northern Gateway (Darwin)',
    networkKind: 'trade',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote', 'gateway'],
      QLD: ['multimodal', 'port'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_southeast_ports',
    name: 'South-East Container Ports Triangle',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC', 'SA'],
    requiredTagsByRegion: {
      NSW: ['container'],
      VIC: ['container'],
      SA: ['grain'],
    },
    productivitySynergyPoints: 6,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_tas_bass_link',
    name: 'Tasmanian Bass Strait Supply',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['regional', 'island'],
      VIC: ['container', 'intermodal'],
    },
    productivitySynergyPoints: 4,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_act_capital_feed',
    name: 'Capital Region Feed',
    networkKind: 'mobility',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'retail'],
      NSW: ['motorway', 'intermodal'],
    },
    productivitySynergyPoints: 3.5,
    logisticsRelief: 0.025,
  },
  {
    id: 'corr_wa_perth_port_ring',
    name: 'Perth Port Ring',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['port_access', 'container'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_sa_adelaide_hub',
    name: 'Adelaide Intermodal Hub',
    networkKind: 'freight',
    regionSequence: ['SA'],
    requiredTagsByRegion: {
      SA: ['intermodal', 'gauge_standard'],
    },
    productivitySynergyPoints: 4.5,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_national_remote_logistics',
    name: 'Remote Logistics Resilience',
    networkKind: 'freight',
    regionSequence: ['NT', 'WA', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote'],
      WA: ['remote'],
      QLD: ['grain_corridor'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.04,
  },
  ...TRANSPORT_CORRIDORS_ROUND2,
  ...TRANSPORT_CORRIDORS_ROUND3,
  ...TRANSPORT_CORRIDORS_ROUND4,
  ...TRANSPORT_CORRIDORS_ROUND5,
  ...TRANSPORT_CORRIDORS_ROUND6,
  ...TRANSPORT_CORRIDORS_ROUND7,
  ...TRANSPORT_CORRIDORS_ROUND8,
  ...TRANSPORT_CORRIDORS_ROUND9,
  ...TRANSPORT_CORRIDORS_ROUND10,
  ...TRANSPORT_CORRIDORS_ROUND11,
  ...TRANSPORT_CORRIDORS_ROUND12,
  ...TRANSPORT_CORRIDORS_ROUND13,
  ...TRANSPORT_CORRIDORS_ROUND14,
  ...TRANSPORT_CORRIDORS_ROUND15,
  ...TRANSPORT_CORRIDORS_ROUND16,
  ...TRANSPORT_CORRIDORS_ROUND17,
  ...TRANSPORT_CORRIDORS_ROUND18,
  ...TRANSPORT_CORRIDORS_ROUND19,
  ...TRANSPORT_CORRIDORS_ROUND20,
  ...TRANSPORT_CORRIDORS_ROUND21,
  ...TRANSPORT_CORRIDORS_ROUND22,
  ...TRANSPORT_CORRIDORS_ROUND23,
  ...TRANSPORT_CORRIDORS_ROUND24,
  ...TRANSPORT_CORRIDORS_ROUND25,
  ...TRANSPORT_CORRIDORS_ROUND26,
  ...TRANSPORT_CORRIDORS_ROUND27,
  ...TRANSPORT_CORRIDORS_ROUND28,
];

export function corridorsByNetwork(): Record<StrategicNetworkKind, TransportCorridorDefinition[]> {
  const out: Record<StrategicNetworkKind, TransportCorridorDefinition[]> = {
    freight: [],
    trade: [],
    mobility: [],
  };
  for (const c of TRANSPORT_CORRIDORS) out[c.networkKind].push(c);
  return out;
}

export function getCorridorById(id: string): TransportCorridorDefinition | undefined {
  return TRANSPORT_CORRIDORS.find((c) => c.id === id);
}

export function corridorTouchesRegion(corridor: TransportCorridorDefinition, region: AuRegionCode): boolean {
  return corridor.regionSequence.includes(region);
}
