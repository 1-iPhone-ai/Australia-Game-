/**
 * Agent 08 — upstream production stress propagation along inter-regional supply links.
 * Interprets V10.1 + V10.14 link graph only; never mutates industry output.
 */

import type { NationalPrivateSectorState, PrivateCompanyState, RegionalEcosystemLink } from './v1014-private-sector-core';
import type { IndustriesSupplyChainsState, StrategicSupplyKind } from './upstream-stubs';
import { deriveFirmSupplyChainProfiles, type FirmSupplyChainProfile } from './supply-chain-firm-depth';

export const AGENT08_CASCADE_SCHEMA_VERSION = '1.0.0';

export type CascadeSeverityBand = 'none' | 'elevated' | 'high' | 'critical';

export interface ProviderRegionStress {
  regionId: string;
  industryConstraintScore: number;
  privateCapacityStress: number;
  compositeStress: number;
}

export interface SupplyCascadeEdge {
  id: string;
  providerRegionId: string;
  consumerRegionId: string;
  supply: StrategicSupplyKind;
  linkStrength: number;
  fragile: boolean;
  providerStress: number;
  propagatedPressure: number;
  severity: CascadeSeverityBand;
}

export interface FirmCascadeExposure {
  companyId: string;
  regionId: string;
  inboundPressure: number;
  severity: CascadeSeverityBand;
  dominantSupply: StrategicSupplyKind | null;
  evidence: string[];
}

export interface NationalProductionCapacityCascade {
  schemaVersion: typeof AGENT08_CASCADE_SCHEMA_VERSION;
  turn: number;
  providerStress: ProviderRegionStress[];
  edges: SupplyCascadeEdge[];
  firmExposure: FirmCascadeExposure[];
  criticalEdgeCount: number;
  maxPropagatedPressure: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function severityFromPressure(p: number): CascadeSeverityBand {
  if (p < 0.12) return 'none';
  if (p < 0.28) return 'elevated';
  if (p < 0.45) return 'high';
  return 'critical';
}

export function computeProviderRegionStress(
  state: NationalPrivateSectorState,
  industries: IndustriesSupplyChainsState | null,
  firmProfiles: FirmSupplyChainProfile[],
): ProviderRegionStress[] {
  const byRegion = new Map<string, FirmSupplyChainProfile[]>();
  for (const p of firmProfiles) {
    const list = byRegion.get(p.regionId) || [];
    list.push(p);
    byRegion.set(p.regionId, list);
  }

  return Object.values(state.regions).map(region => {
    const profiles = byRegion.get(region.regionId) || [];
    const privateCapacityStress = profiles.length
      ? profiles.reduce((a, p) => a + p.capacityStress, 0) / profiles.length
      : 0.35;
    const indReg = industries?.regions?.[region.regionId];
    let constraintHits = 0;
    let industryCount = 0;
    if (indReg?.industries) {
      for (const ind of Object.values(indReg.industries)) {
        if (!ind) continue;
        industryCount += 1;
        if (ind.constraint) constraintHits += 1;
        if (ind.utilization < 0.35) constraintHits += 0.5;
      }
    }
    const industryConstraintScore = industryCount
      ? clamp(constraintHits / industryCount, 0, 1)
      : clamp(region.primaryConstraint ? 0.6 : 0.2, 0, 1);
    const compositeStress = clamp(privateCapacityStress * 0.55 + industryConstraintScore * 0.45, 0, 1);
    return {
      regionId: region.regionId,
      industryConstraintScore: Math.round(industryConstraintScore * 1000) / 1000,
      privateCapacityStress: Math.round(privateCapacityStress * 1000) / 1000,
      compositeStress: Math.round(compositeStress * 1000) / 1000,
    };
  });
}

export function propagateSupplyCascadeEdge(
  link: RegionalEcosystemLink,
  providerStress: number,
): SupplyCascadeEdge {
  const strengthNorm = clamp(link.strength / 100, 0, 1);
  const fragilityMultiplier = link.fragile ? 1.35 : 1;
  const propagatedPressure = clamp(providerStress * strengthNorm * fragilityMultiplier * 0.85, 0, 1);
  return {
    id: link.id,
    providerRegionId: link.fromRegionId,
    consumerRegionId: link.toRegionId,
    supply: link.supply,
    linkStrength: link.strength,
    fragile: link.fragile,
    providerStress: Math.round(providerStress * 1000) / 1000,
    propagatedPressure: Math.round(propagatedPressure * 1000) / 1000,
    severity: severityFromPressure(propagatedPressure),
  };
}

export function computeFirmCascadeExposure(
  company: PrivateCompanyState,
  inboundEdges: SupplyCascadeEdge[],
): FirmCascadeExposure {
  const relevant = inboundEdges.filter(
    e => e.consumerRegionId === company.regionId && (!company.primarySupply || e.supply === company.primarySupply),
  );
  const inboundPressure = relevant.length
    ? relevant.reduce((a, e) => a + e.propagatedPressure, 0) / relevant.length
    : 0;
  const dominantSupply = relevant.sort((a, b) => b.propagatedPressure - a.propagatedPressure)[0]?.supply ?? company.primarySupply;
  const evidence = relevant.slice(0, 3).map(e => `cascade:${e.providerRegionId}->${e.consumerRegionId}:${e.supply}:${e.propagatedPressure}`);
  return {
    companyId: company.id,
    regionId: company.regionId,
    inboundPressure: Math.round(inboundPressure * 1000) / 1000,
    severity: severityFromPressure(inboundPressure),
    dominantSupply,
    evidence,
  };
}

export function computeNationalProductionCapacityCascade(params: {
  turn: number;
  privateState: NationalPrivateSectorState;
  industries: IndustriesSupplyChainsState | null;
}): NationalProductionCapacityCascade {
  const firmProfiles = deriveFirmSupplyChainProfiles(params.privateState);
  const providerStress = computeProviderRegionStress(params.privateState, params.industries, firmProfiles);
  const stressByRegion = Object.fromEntries(providerStress.map(p => [p.regionId, p.compositeStress]));

  const edges: SupplyCascadeEdge[] = [];
  for (const region of Object.values(params.privateState.regions)) {
    for (const link of region.links) {
      if (link.toRegionId !== region.regionId) continue;
      const ps = stressByRegion[link.fromRegionId] ?? 0.35;
      edges.push(propagateSupplyCascadeEdge(link, ps));
    }
  }

  const edgesByConsumer = new Map<string, SupplyCascadeEdge[]>();
  for (const e of edges) {
    const list = edgesByConsumer.get(e.consumerRegionId) || [];
    list.push(e);
    edgesByConsumer.set(e.consumerRegionId, list);
  }

  const firmExposure: FirmCascadeExposure[] = [];
  for (const region of Object.values(params.privateState.regions)) {
    const inbound = edgesByConsumer.get(region.regionId) || [];
    for (const company of region.companies) {
      firmExposure.push(computeFirmCascadeExposure(company, inbound));
    }
  }

  const criticalEdgeCount = edges.filter(e => e.severity === 'critical' || e.severity === 'high').length;
  const maxPropagatedPressure = edges.reduce((m, e) => Math.max(m, e.propagatedPressure), 0);

  return {
    schemaVersion: AGENT08_CASCADE_SCHEMA_VERSION,
    turn: params.turn,
    providerStress,
    edges,
    firmExposure,
    criticalEdgeCount,
    maxPropagatedPressure: Math.round(maxPropagatedPressure * 1000) / 1000,
  };
}

export function runAgent08CascadeSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const results: Array<{ id: string; passed: boolean; detail: string }> = [];
  const check = (id: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, passed: out === true, detail: out === true ? 'ok' : String(out) });
    } catch (e) {
      results.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a08_casc_01', () => {
    const edge = propagateSupplyCascadeEdge(
      {
        id: 'l',
        fromRegionId: 'QLD',
        toRegionId: 'NSW',
        supply: 'energy',
        strength: 80,
        fragile: true,
        reason: 't',
      },
      0.7,
    );
    return edge.propagatedPressure > 0.4 && edge.severity !== 'none';
  });

  check('a08_casc_02', () => {
    const edge = propagateSupplyCascadeEdge(
      {
        id: 'l2',
        fromRegionId: 'WA',
        toRegionId: 'NSW',
        supply: 'minerals',
        strength: 10,
        fragile: false,
        reason: 't',
      },
      0.2,
    );
    return edge.severity === 'none' || edge.severity === 'elevated';
  });

  check('a08_casc_03', () => {
    const cascade = computeNationalProductionCapacityCascade({
      turn: 2,
      privateState: {
        schemaVersion: '10.14.0',
        revision: 1,
        regions: {
          NSW: {
            regionId: 'NSW',
            name: 'NSW',
            maturity: 'connected',
            anchorArchetype: 'manufacturing',
            companyCount: 1,
            activeProduction: 30,
            supplyChainRole: 'linked',
            resilience: 'moderate',
            primaryConstraint: null,
            revision: 2,
            links: [
              {
                id: 'lk',
                fromRegionId: 'QLD',
                toRegionId: 'NSW',
                supply: 'energy',
                strength: 90,
                fragile: true,
                reason: 'energy dep',
              },
            ],
            companies: [
              {
                id: 'co1',
                regionId: 'NSW',
                archetype: 'manufacturing',
                name: 'M',
                vitality: 'fragile',
                production: 'constrained',
                exposure: 'exposed',
                scale: 15,
                utilization: 0.4,
                primarySupply: 'energy',
                linkedIndustry: 'manufacturing',
                ecosystemId: 'eco',
                summary: 's',
                evidence: [],
                revision: 2,
              },
            ],
          },
          QLD: {
            regionId: 'QLD',
            name: 'QLD',
            maturity: 'forming',
            anchorArchetype: 'energy',
            companyCount: 0,
            activeProduction: 10,
            supplyChainRole: 'provider',
            resilience: 'exposed',
            primaryConstraint: 'energy constraint',
            revision: 2,
            links: [],
            companies: [],
          },
        },
        national: {
          leadingRegions: [],
          constrainedRegions: ['QLD'],
          dominantArchetypes: [],
          criticalDependencies: [],
          ecosystemOpportunity: null,
          ecosystemRisk: null,
          totalCompanies: 1,
          avgVitality: 1,
        },
        history: [],
        lastUpdatedTurn: 2,
        inputHash: 'x',
        computeMs: 0,
      },
      industries: {
        revision: 1,
        regions: {
          QLD: {
            regionId: 'QLD',
            industries: {
              energy: {
                industry: 'energy',
                strength: 18,
                effectiveOutput: 8,
                utilization: 0.25,
                constraint: { kind: 'production_constraint' },
                outputs: [{ supply: 'energy', amount: 8 }],
              },
            },
            suppliedBy: [],
            primaryIndustrialConstraint: 'energy',
            resilience: 'exposed',
          },
        },
        dependencies: [],
      },
    });
    return cascade.edges.length === 1 && cascade.firmExposure.length === 1 && cascade.firmExposure[0].inboundPressure > 0;
  });

  check('a08_casc_04', () => severityFromPressure(0.5) === 'critical');
  check('a08_casc_05', () => {
    const exp = computeFirmCascadeExposure(
      {
        id: 'c',
        regionId: 'NSW',
        archetype: 'mining',
        name: 'n',
        vitality: 'stable',
        production: 'steady',
        exposure: 'balanced',
        scale: 1,
        utilization: 0.5,
        primarySupply: 'minerals',
        linkedIndustry: 'mining',
        ecosystemId: 'e',
        summary: '',
        evidence: [],
        revision: 0,
      },
      [],
    );
    return exp.inboundPressure === 0 && exp.severity === 'none';
  });

  return results;
}
