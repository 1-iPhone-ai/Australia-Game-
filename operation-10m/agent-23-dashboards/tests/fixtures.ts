import type {
  DynamicRegionalState,
  LivingRegionsState,
  LivingRegionsWorldView,
  NationalNetworkKind,
  NationalRegionSystemsState,
  NationalSystemsState,
} from '../types.ts';
import { COMM_REGION_CODES, NATIONAL_NETWORKS } from '../core/constants.ts';

function emptyNetworks(): Record<NationalNetworkKind, NationalRegionSystemsState['networks']['freight']> {
  const base = { utilization: 0.4, condition: 'healthy' as const };
  return {
    freight: { ...base },
    energy: { ...base },
    water: { ...base },
    trade: { ...base },
    digital: { ...base },
  };
}

export function createAgent23LrFixture(): LivingRegionsWorldView {
  const regions: Record<string, DynamicRegionalState> = {};
  COMM_REGION_CODES.forEach((code, i) => {
    regions[code] = {
      regionId: code,
      name: code,
      development: { tier: i % 2 === 0 ? 'developing' : 'advanced' },
      economy: { band: 'moderate' },
      momentum: { band: 'stable', history: [1 + i * 0.1, 1.2 + i * 0.1, 1.15 + i * 0.1] },
      needs: [{ category: 'transport', status: 'open', severity: 'moderate' }],
      risks: i === 0 ? [{ severity: 'high' }] : [],
    };
  });
  const state: LivingRegionsState = {
    revision: 3,
    regions,
    derived: [{ turn: 4, text: 'NSW momentum ticked up', significance: 'major' }],
  };
  return { state };
}

export function createAgent23NsFixture(): NationalSystemsState {
  const regions: Record<string, NationalRegionSystemsState> = {};
  COMM_REGION_CODES.forEach(code => {
    regions[code] = {
      regionId: code,
      name: code,
      networks: emptyNetworks(),
      primaryConstraint: 'freight',
      resilience: 55,
      resilienceBand: 'stable',
    };
  });
  const national = {} as NationalSystemsState['national'];
  NATIONAL_NETWORKS.forEach((n, i) => {
    national[n] = {
      utilization: 0.35 + i * 0.05,
      condition: 'healthy',
      bottlenecks: 0,
    };
  });
  national.resilienceScore = 58;
  national.resilienceBand = 'stable';
  return {
    revision: 2,
    turn: 5,
    regions,
    bottlenecks: [{ id: 'bn1', regionId: 'NSW', network: 'freight', severity: 'meaningful' }],
    dependencies: [
      { id: 'dep1', consumerRegionId: 'SA', providerRegionId: 'NSW', network: 'energy', importance: 'high' },
      { id: 'dep2', consumerRegionId: 'TAS', providerRegionId: 'VIC', network: 'freight', importance: 'moderate' },
    ],
    national,
    history: [{ turn: 5, summary: 'Freight corridor strained in NSW' }],
  };
}
