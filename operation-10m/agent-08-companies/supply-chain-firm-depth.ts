/**
 * Agent 08 extension — firm-level supply chain depth & capacity stress (interpretation only).
 * Reads V10.14 private ecosystems + V10.1 link metadata already materialized on regional states.
 */

import type {
  NationalPrivateSectorState,
  PrivateCompanyState,
  PrivateProductionBand,
  RegionalEcosystemLink,
  RegionalPrivateEcosystemState,
} from './v1014-private-sector-core';
import type { StrategicSupplyKind } from './upstream-stubs';

export const AGENT08_SUPPLY_DEPTH_SCHEMA_VERSION = '1.1.0';

export type FirmSupplyDepthBand = 'shallow' | 'moderate' | 'deep' | 'entangled';

export interface FirmSupplyChainProfile {
  companyId: string;
  regionId: string;
  archetype: PrivateCompanyState['archetype'];
  upstreamRegions: string[];
  inboundLinkCount: number;
  fragileInbound: number;
  outboundDependentRegions: number;
  concentrationScore: number;
  capacityStress: number;
  utilization: number;
  productionBand: PrivateProductionBand;
  primarySupply: StrategicSupplyKind | null;
  depthBand: FirmSupplyDepthBand;
  evidence: string[];
}

export interface RegionalSupplyDepthSummary {
  regionId: string;
  firmCount: number;
  avgCapacityStress: number;
  entangledFirms: number;
  fragileLinks: number;
  hubScore: number;
}

export interface NationalSupplyDepthSummary {
  schemaVersion: typeof AGENT08_SUPPLY_DEPTH_SCHEMA_VERSION;
  turn: number;
  firmProfiles: FirmSupplyChainProfile[];
  regions: RegionalSupplyDepthSummary[];
  entangledFirmCount: number;
  singleSourceHotspots: Array<{ regionId: string; supply: StrategicSupplyKind; providerRegionId: string; firmCount: number }>;
  maxCapacityStress: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function productionStress(band: PrivateProductionBand): number {
  switch (band) {
    case 'idle':
      return 0.9;
    case 'constrained':
      return 0.65;
    case 'steady':
      return 0.35;
    case 'surging':
      return 0.15;
    default:
      return 0.4;
  }
}

function concentrationFromShares(shares: number[]): number {
  if (!shares.length) return 0;
  const total = shares.reduce((a, b) => a + b, 0) || 1;
  const normalized = shares.map(s => s / total);
  return clamp(normalized.reduce((a, s) => a + s * s, 0), 0, 1);
}

function depthBandFromSignals(
  inbound: number,
  fragile: number,
  concentration: number,
  outboundDeps: number,
): FirmSupplyDepthBand {
  const score = inbound * 1.2 + fragile * 2.5 + concentration * 4 + outboundDeps * 0.8;
  if (score < 2) return 'shallow';
  if (score < 5) return 'moderate';
  if (score < 9) return 'deep';
  return 'entangled';
}

function inboundLinksForRegion(region: RegionalPrivateEcosystemState): RegionalEcosystemLink[] {
  return region.links.filter(l => l.toRegionId === region.regionId);
}

function outboundDependentCount(
  regionId: string,
  allRegions: Record<string, RegionalPrivateEcosystemState>,
): number {
  let n = 0;
  for (const r of Object.values(allRegions)) {
    if (r.links.some(l => l.fromRegionId === regionId && l.toRegionId !== regionId)) n += 1;
  }
  return n;
}

export function deriveFirmSupplyChainProfile(
  company: PrivateCompanyState,
  region: RegionalPrivateEcosystemState,
  allRegions: Record<string, RegionalPrivateEcosystemState>,
): FirmSupplyChainProfile {
  const inbound = inboundLinksForRegion(region);
  const upstreamRegions = [...new Set(inbound.map(l => l.fromRegionId))];
  const fragileInbound = inbound.filter(l => l.fragile).length;
  const shares = inbound.map(l => l.strength);
  const concentrationScore = concentrationFromShares(shares);
  const outboundDeps = outboundDependentCount(region.regionId, allRegions);
  const utilization = clamp(company.utilization, 0, 1);
  const capacityStress = clamp(productionStress(company.production) * 0.55 + (1 - utilization) * 0.45, 0, 1);
  const depthBand = depthBandFromSignals(inbound.length, fragileInbound, concentrationScore, outboundDeps);
  const evidence: string[] = [
    `inbound_links:${inbound.length}`,
    `fragile_inbound:${fragileInbound}`,
    `concentration:${concentrationScore.toFixed(2)}`,
    `capacity_stress:${capacityStress.toFixed(2)}`,
  ];
  if (company.primarySupply) evidence.push(`primary_supply:${company.primarySupply}`);
  return {
    companyId: company.id,
    regionId: company.regionId,
    archetype: company.archetype,
    upstreamRegions,
    inboundLinkCount: inbound.length,
    fragileInbound,
    outboundDependentRegions: outboundDeps,
    concentrationScore,
    capacityStress,
    utilization,
    productionBand: company.production,
    primarySupply: company.primarySupply,
    depthBand,
    evidence,
  };
}

export function deriveFirmSupplyChainProfiles(
  state: NationalPrivateSectorState,
): FirmSupplyChainProfile[] {
  const profiles: FirmSupplyChainProfile[] = [];
  for (const region of Object.values(state.regions)) {
    for (const company of region.companies) {
      profiles.push(deriveFirmSupplyChainProfile(company, region, state.regions));
    }
  }
  return profiles;
}

export function summarizeRegionalSupplyDepth(
  region: RegionalPrivateEcosystemState,
  profiles: FirmSupplyChainProfile[],
  allRegions: Record<string, RegionalPrivateEcosystemState>,
): RegionalSupplyDepthSummary {
  const regional = profiles.filter(p => p.regionId === region.regionId);
  const avgCapacityStress = regional.length
    ? regional.reduce((a, p) => a + p.capacityStress, 0) / regional.length
    : 0;
  const entangledFirms = regional.filter(p => p.depthBand === 'entangled').length;
  const fragileLinks = region.links.filter(l => l.fragile).length;
  const hubScore = clamp(
    outboundDependentCount(region.regionId, allRegions) + region.links.length * 0.5 + entangledFirms * 2,
    0,
    100,
  );
  return {
    regionId: region.regionId,
    firmCount: regional.length,
    avgCapacityStress: Math.round(avgCapacityStress * 100) / 100,
    entangledFirms,
    fragileLinks,
    hubScore: Math.round(hubScore * 10) / 10,
  };
}

export function computeSingleSourceHotspots(
  profiles: FirmSupplyChainProfile[],
  regions: Record<string, RegionalPrivateEcosystemState>,
): NationalSupplyDepthSummary['singleSourceHotspots'] {
  const buckets = new Map<string, { regionId: string; supply: StrategicSupplyKind; providerRegionId: string; firmCount: number }>();
  for (const region of Object.values(regions)) {
    const inbound = inboundLinksForRegion(region);
    if (inbound.length !== 1) continue;
    const link = inbound[0];
    for (const company of region.companies) {
      if (!company.primarySupply || company.primarySupply !== link.supply) continue;
      const key = `${region.regionId}:${link.supply}:${link.fromRegionId}`;
      const cur = buckets.get(key) || {
        regionId: region.regionId,
        supply: link.supply,
        providerRegionId: link.fromRegionId,
        firmCount: 0,
      };
      cur.firmCount += 1;
      buckets.set(key, cur);
    }
  }
  return [...buckets.values()]
    .filter(b => b.firmCount >= 1)
    .sort((a, b) => b.firmCount - a.firmCount)
    .slice(0, 12);
}

export function computeNationalSupplyDepthSummary(
  state: NationalPrivateSectorState,
): NationalSupplyDepthSummary {
  const firmProfiles = deriveFirmSupplyChainProfiles(state);
  const regions = Object.values(state.regions).map(r =>
    summarizeRegionalSupplyDepth(r, firmProfiles, state.regions),
  );
  const entangledFirmCount = firmProfiles.filter(p => p.depthBand === 'entangled').length;
  const maxCapacityStress = firmProfiles.reduce((m, p) => Math.max(m, p.capacityStress), 0);
  return {
    schemaVersion: AGENT08_SUPPLY_DEPTH_SCHEMA_VERSION,
    turn: state.lastUpdatedTurn,
    firmProfiles,
    regions,
    entangledFirmCount,
    singleSourceHotspots: computeSingleSourceHotspots(firmProfiles, state.regions),
    maxCapacityStress: Math.round(maxCapacityStress * 100) / 100,
  };
}

/** Attach supply-depth evidence onto company rows (bounded). */
export function applySupplyChainDepthEvidence(
  state: NationalPrivateSectorState,
  profiles: FirmSupplyChainProfile[],
): NationalPrivateSectorState {
  const byId = Object.fromEntries(profiles.map(p => [p.companyId, p]));
  const regions: Record<string, RegionalPrivateEcosystemState> = {};
  for (const [code, region] of Object.entries(state.regions)) {
    regions[code] = {
      ...region,
      companies: region.companies.map(c => {
        const profile = byId[c.id];
        if (!profile) return c;
        const extra = {
          label: 'Supply depth',
          value: profile.concentrationScore * 100,
          source: `agent08.depth.${profile.depthBand}`,
        };
        const evidence = [...c.evidence, extra].slice(-8);
        return { ...c, evidence };
      }),
    };
  }
  return { ...state, regions, revision: state.revision + 1 };
}

export function runAgent08SupplyChainSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  const fixtureRegion: RegionalPrivateEcosystemState = {
    regionId: 'NSW',
    name: 'New South Wales',
    maturity: 'connected',
    anchorArchetype: 'mining',
    companyCount: 2,
    activeProduction: 40,
    supplyChainRole: 'linked',
    resilience: 'moderate',
    primaryConstraint: null,
    revision: 3,
    links: [
      {
        id: 'l1',
        fromRegionId: 'QLD',
        toRegionId: 'NSW',
        supply: 'energy',
        strength: 80,
        fragile: true,
        reason: 'test',
      },
      {
        id: 'l2',
        fromRegionId: 'WA',
        toRegionId: 'NSW',
        supply: 'minerals',
        strength: 20,
        fragile: false,
        reason: 'test',
      },
    ],
    companies: [
      {
        id: 'co_a',
        regionId: 'NSW',
        archetype: 'manufacturing',
        name: 'A',
        vitality: 'stable',
        production: 'constrained',
        exposure: 'integrated',
        scale: 12,
        utilization: 0.4,
        primarySupply: 'energy',
        linkedIndustry: 'manufacturing',
        ecosystemId: 'eco_NSW',
        summary: 'x',
        evidence: [],
        revision: 3,
      },
      {
        id: 'co_b',
        regionId: 'NSW',
        archetype: 'mining',
        name: 'B',
        vitality: 'dynamic',
        production: 'steady',
        exposure: 'balanced',
        scale: 20,
        utilization: 0.7,
        primarySupply: 'minerals',
        linkedIndustry: 'mining',
        ecosystemId: 'eco_NSW',
        summary: 'y',
        evidence: [],
        revision: 3,
      },
    ],
  };

  const fixtureState: NationalPrivateSectorState = {
    schemaVersion: '10.14.0',
    revision: 1,
    regions: {
      NSW: fixtureRegion,
      QLD: {
        ...fixtureRegion,
        regionId: 'QLD',
        name: 'Queensland',
        companies: [],
        companyCount: 0,
        links: [{ id: 'l3', fromRegionId: 'NSW', toRegionId: 'QLD', supply: 'manufactured_goods', strength: 50, fragile: false, reason: 'backlink' }],
      },
    },
    national: {
      leadingRegions: [],
      constrainedRegions: [],
      dominantArchetypes: ['mining'],
      criticalDependencies: [],
      ecosystemOpportunity: null,
      ecosystemRisk: null,
      totalCompanies: 2,
      avgVitality: 2,
    },
    history: [],
    lastUpdatedTurn: 3,
    inputHash: 'fixture',
    computeMs: 0,
  };

  check('a08_sc_01', () => {
    const profiles = deriveFirmSupplyChainProfiles(fixtureState);
    return profiles.length === 2 && profiles.every(p => p.inboundLinkCount === 2);
  });

  check('a08_sc_02', () => {
    const p = deriveFirmSupplyChainProfile(fixtureRegion.companies[0], fixtureRegion, fixtureState.regions);
    return p.fragileInbound === 1 && p.capacityStress > 0.5 && p.depthBand !== 'shallow';
  });

  check('a08_sc_03', () => {
    const summary = computeNationalSupplyDepthSummary(fixtureState);
    return summary.firmProfiles.length === 2 && summary.regions.length === 2 && summary.schemaVersion === AGENT08_SUPPLY_DEPTH_SCHEMA_VERSION;
  });

  check('a08_sc_04', () => {
    const summary = computeNationalSupplyDepthSummary(fixtureState);
    const enriched = applySupplyChainDepthEvidence(fixtureState, summary.firmProfiles);
    return enriched.regions.NSW.companies[0].evidence.some(e => e.source.startsWith('agent08.depth.'));
  });

  check('a08_sc_05', () => {
    const shares = concentrationFromShares([100]);
    return shares === 1;
  });

  check('a08_sc_06', () => {
    const hotspots = computeSingleSourceHotspots([], {});
    return Array.isArray(hotspots);
  });

  return results;
}
