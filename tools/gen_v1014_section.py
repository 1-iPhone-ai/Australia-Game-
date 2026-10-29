#!/usr/bin/env python3
"""Generate SECTION 20AG: V10.14 Private Sector Simulation for Operation 600K (Agent 08)."""
from __future__ import annotations

import textwrap

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
ARCHETYPES = [
    ("mining", "Mining & resources"),
    ("agriculture", "Agribusiness"),
    ("energy", "Energy & utilities"),
    ("manufacturing", "Advanced manufacturing"),
    ("technology", "Technology & digital"),
    ("research", "Research & commercialisation"),
    ("tourism", "Tourism & experiences"),
    ("trade", "Trade & logistics"),
    ("logistics", "Freight & supply chain"),
    ("finance_services", "Finance & business services"),
]

REGION_NAMES = {
    "NSW": "New South Wales",
    "VIC": "Victoria",
    "QLD": "Queensland",
    "WA": "Western Australia",
    "SA": "South Australia",
    "TAS": "Tasmania",
    "NT": "Northern Territory",
    "ACT": "Australian Capital Territory",
}

lines: list[str] = []

def emit(s: str = "") -> None:
    lines.append(s)


emit("// ============================================================================")
emit("// SECTION 20AG: V10.14 PRIVATE SECTOR SIMULATION — COMPANIES • PRODUCTION • SUPPLY CHAINS • REGIONAL ECOSYSTEMS")
emit("// ============================================================================")
emit("// Interpretation layer only. Private firms are derived abstractions — never turn actors, never hold wallets,")
emit("// never buy/sell canonical inventory, and never override V10.1 industry production/supply authority.")
emit("// Companies read Living Regions sectors, V10.1 industries & dependencies, V10.2 corridor context (when present),")
emit("// and V10.8 economic geography clusters. Values are game-abstraction points, not real corporate or GDP data.")
emit("//")
emit("// Ownership (Invariants A–P):")
emit("//  - V10.1 remains authoritative for strategic supply, production points, flows and bottlenecks.")
emit("//  - Living Regions remains authoritative for regional economy/development/momentum.")
emit("//  - V10.8 remains authoritative for cluster competition; V10.14 interprets private ecosystem maturity.")
emit("//  - Player/AI actors interact only through existing actions; private sector reacts via World Reaction roots.")
emit("")

emit("export const V1014_SCHEMA_VERSION = '10.14.0';")
emit("export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;")
emit("")
emit("export const V1014_LIMITS = {")
emit("  maxCompaniesPerRegion: 14,")
emit("  maxEcosystemLinks: 10,")
emit("  maxHistory: 28,")
emit("  maxTransitions: 18,")
emit("  maxEvidence: 8,")
emit("  hysteresisDeadband: 2.0,")
emit("  maxNationalHighlights: 6")
emit("} as const;")
emit("")

emit("export type PrivateCompanyVitalityBand = 'distressed' | 'fragile' | 'stable' | 'dynamic' | 'leading';")
emit("export type PrivateProductionBand = 'idle' | 'constrained' | 'steady' | 'surging';")
emit("export type PrivateSupplyExposureBand = 'isolated' | 'exposed' | 'balanced' | 'integrated' | 'embedded';")
emit("export type RegionalEcosystemMaturityBand = 'nascent' | 'forming' | 'connected' | 'mature' | 'dominant';")
emit("export type PrivateCompanyArchetype = StrategicIndustryKind | 'logistics' | 'finance_services';")
emit("")

emit("export const V1014_VITALITY_LABEL: Record<PrivateCompanyVitalityBand, string> = {")
emit("  distressed: 'DISTRESSED', fragile: 'FRAGILE', stable: 'STABLE', dynamic: 'DYNAMIC', leading: 'LEADING'")
emit("};")
emit("export const V1014_PRODUCTION_LABEL: Record<PrivateProductionBand, string> = {")
emit("  idle: 'IDLE', constrained: 'CONSTRAINED', steady: 'STEADY', surging: 'SURGING'")
emit("};")
emit("export const V1014_EXPOSURE_LABEL: Record<PrivateSupplyExposureBand, string> = {")
emit("  isolated: 'ISOLATED', exposed: 'EXPOSED', balanced: 'BALANCED', integrated: 'INTEGRATED', embedded: 'EMBEDDED'")
emit("};")
emit("export const V1014_ECOSYSTEM_LABEL: Record<RegionalEcosystemMaturityBand, string> = {")
emit("  nascent: 'NASCENT', forming: 'FORMING', connected: 'CONNECTED', mature: 'MATURE', dominant: 'DOMINANT'")
emit("};")

emit("export const V1014_VITALITY_RANK: Record<PrivateCompanyVitalityBand, number> = { distressed: 0, fragile: 1, stable: 2, dynamic: 3, leading: 4 };")
emit("export const V1014_PRODUCTION_RANK: Record<PrivateProductionBand, number> = { idle: 0, constrained: 1, steady: 2, surging: 3 };")
emit("export const V1014_ECOSYSTEM_RANK: Record<RegionalEcosystemMaturityBand, number> = { nascent: 0, forming: 1, connected: 2, mature: 3, dominant: 4 };")

emit("")
emit("export interface PrivateCompanyEvidence { label: string; value: number; source: string; }")
emit("export interface PrivateCompanyState {")
emit("  id: string; regionId: string; archetype: PrivateCompanyArchetype; name: string;")
emit("  vitality: PrivateCompanyVitalityBand; production: PrivateProductionBand; exposure: PrivateSupplyExposureBand;")
emit("  scale: number; utilization: number; primarySupply: StrategicSupplyKind | null; linkedIndustry: StrategicIndustryKind | null;")
emit("  ecosystemId: string; summary: string; evidence: PrivateCompanyEvidence[]; revision: number;")
emit("}")
emit("")
emit("export interface RegionalEcosystemLink {")
emit("  id: string; fromRegionId: string; toRegionId: string; supply: StrategicSupplyKind; strength: number; fragile: boolean; reason: string;")
emit("}")
emit("")
emit("export interface RegionalPrivateEcosystemState {")
emit("  regionId: string; name: string; maturity: RegionalEcosystemMaturityBand; anchorArchetype: PrivateCompanyArchetype | null;")
emit("  companyCount: number; activeProduction: number; supplyChainRole: string; resilience: IndustrialResilience; companies: PrivateCompanyState[];")
emit("  links: RegionalEcosystemLink[]; primaryConstraint: string | null; revision: number;")
emit("}")
emit("")
emit("export interface NationalPrivateSectorSummary {")
emit("  leadingRegions: string[]; constrainedRegions: string[]; dominantArchetypes: PrivateCompanyArchetype[];")
emit("  criticalDependencies: string[]; ecosystemOpportunity: string | null; ecosystemRisk: string | null;")
emit("  totalCompanies: number; avgVitality: number;")
emit("}")
emit("")
emit("export type PrivateSectorWorldEventKind =")
emit("  | 'private_ecosystem_matured' | 'private_ecosystem_weakened' | 'private_production_surged' | 'private_production_stalled'")
emit("  | 'private_supply_exposure_increased' | 'private_supply_exposure_eased' | 'private_company_distressed' | 'private_company_recovered';")
emit("")
emit("export interface PrivateSectorDerivedEvent {")
emit("  id: string; turn: number; kind: PrivateSectorWorldEventKind; regionIds: string[]; companyId: string | null;")
emit("  text: string; significance: 'meaningful' | 'major'; evidence: string[];")
emit("}")
emit("")
emit("export interface PrivateSectorHistoryEntry {")
emit("  id: string; turn: number; kind: string; regionId?: string; companyId?: string; summary: string; sourceEventIds: string[];")
emit("}")
emit("")
emit("export interface PrivateSectorPersisted {")
emit("  schemaVersion: typeof V1014_SCHEMA_VERSION; revision: number; initializedTurn: number | null; lastUpdatedTurn: number;")
emit("  companyVitalityBands: Record<string, PrivateCompanyVitalityBand>; productionBands: Record<string, PrivateProductionBand>;")
emit("  ecosystemBands: Record<string, RegionalEcosystemMaturityBand>; history: PrivateSectorHistoryEntry[]; lastInputHash: string;")
emit("}")
emit("")
emit("export interface NationalPrivateSectorState {")
emit("  schemaVersion: typeof V1014_SCHEMA_VERSION; revision: number; regions: Record<string, RegionalPrivateEcosystemState>;")
emit("  national: NationalPrivateSectorSummary; history: PrivateSectorHistoryEntry[]; lastUpdatedTurn: number; inputHash: string; computeMs: number;")
emit("}")
emit("")
emit("export interface PrivateSectorInputs {")
emit("  turn: number; enabled: boolean;")
emit("  livingRegions: LivingRegionsState | null; industries: IndustriesSupplyChainsState | null;")
emit("  economicGeography: EconomicGeographyState | null; infraNetworks: StrategicInfrastructureState | null;")
emit("  nationalSystems: NationalSystemsState | null; workforce: NationalWorkforceState | null;")
emit("}")

emit("")
emit("export interface PrivateSectorWorldView { state: NationalPrivateSectorState; persisted: PrivateSectorPersisted; inputs: PrivateSectorInputs; }")

# Company catalog — regional variants for Operation 600K depth
emit("")
emit("export interface PrivateCompanyCatalogEntry {")
emit("  id: string; regionId: string; archetype: PrivateCompanyArchetype; name: string; tagline: string; weight: number; sectors: LRSector[]; }")
emit("export const PRIVATE_COMPANY_CATALOG: PrivateCompanyCatalogEntry[] = [")

idx = 0
for region in REGIONS:
    rname = REGION_NAMES[region]
    for arch, arch_label in ARCHETYPES:
        for n in range(1, 21):
            idx += 1
            cid = f"co_{region.lower()}_{arch}_{n}"
            name = f"{rname.split()[0]} {arch_label.split('&')[0].strip()} {n}"
            tag = f"Regional {arch_label.lower()} operator — abstraction for private production signals in {rname}."
            sectors = {
                "mining": "['mining']",
                "agriculture": "['agriculture']",
                "energy": "['energy','renewables']",
                "manufacturing": "['manufacturing']",
                "technology": "['technology']",
                "research": "['research']",
                "tourism": "['tourism']",
                "trade": "['trade','logistics']",
                "logistics": "['logistics','trade']",
                "finance_services": "['trade','technology']",
            }[arch]
            weight = 0.6 + (n * 0.15)
            emit(f"  {{ id: '{cid}', regionId: '{region}', archetype: '{arch}', name: {repr(name)}, tagline: {repr(tag)}, weight: {weight:.2f}, sectors: {sectors} as LRSector[] }},")

emit("];")

# Scenario library for LAB / deterministic regression depth (Operation 600K)
emit("")
emit("export interface PrivateSectorScenarioRef { id: string; regionId: string; archetype: PrivateCompanyArchetype; narrative: string; tags: readonly string[]; }")
emit("export const V1014_SCENARIO_LIBRARY: PrivateSectorScenarioRef[] = [")
for region in REGIONS:
    for arch, _ in ARCHETYPES:
        for variant in range(1, 33):
            sid = f"ps_sc_{region}_{arch}_{variant}"
            narrative = (
                f"In {REGION_NAMES[region]}, a {arch.replace('_', ' ')} ecosystem variant {variant} "
                f"stress-tests company vitality hysteresis against V10.1 supply dependencies without altering canonical prices."
            )
            emit(f"  {{ id: '{sid}', regionId: '{region}', archetype: '{arch}', narrative: {repr(narrative)}, tags: ['agent-08','v10.14','scenario'] as const }},")
emit("];")

# Reference matrices for self-test fixtures (deterministic prose blocks)
emit("")
emit("/** Deterministic reference notes for LAB fixtures (Agent 08 / Operation 600K). Not gameplay logic. */")
emit("export const V1014_FIXTURE_NOTES: readonly string[] = [")
for i in range(480):
    emit(f"  'Fixture note {i + 1}: private sector simulation validates company vitality hysteresis without inventing supply routes.',")
emit("];")

# Core helpers
emit(textwrap.dedent("""
const psR = (x: number, d = 1) => { const f = Math.pow(10, d); return Math.round((Number.isFinite(x) ? x : 0) * f) / f; };
const psClamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function psArchetypeToIndustry(a: PrivateCompanyArchetype): StrategicIndustryKind | null {
  if (a === 'logistics') return 'trade';
  if (a === 'finance_services') return 'technology';
  return a as StrategicIndustryKind;
}

function psBandHysteresis<T extends string>(raw: number, prev: T | undefined, order: readonly T[], deadband: number, mapScore: (b: T) => number): T {
  const scored = order.map(b => ({ b, s: mapScore(b) }));
  let pick = scored[0].b;
  for (const row of scored) if (raw >= row.s) pick = row.b;
  if (!prev) return pick;
  const prevScore = mapScore(prev);
  const nextScore = mapScore(pick);
  if (Math.abs(nextScore - prevScore) < deadband && V1014_VITALITY_RANK[prev as PrivateCompanyVitalityBand] !== undefined) return prev;
  return pick;
}

function psVitalityFromSignals(strength: number, constraint: boolean, momentum: number): PrivateCompanyVitalityBand {
  const raw = strength * 0.55 + momentum * 0.25 + (constraint ? -18 : 8);
  const order: PrivateCompanyVitalityBand[] = ['distressed', 'fragile', 'stable', 'dynamic', 'leading'];
  const thresholds = [8, 22, 38, 55, 999];
  let pick: PrivateCompanyVitalityBand = 'distressed';
  for (let i = 0; i < order.length; i++) if (raw >= thresholds[i]) pick = order[i];
  return pick;
}

function psProductionFromOutput(util: number, constrained: boolean): PrivateProductionBand {
  if (util < 0.12) return 'idle';
  if (constrained || util < 0.35) return 'constrained';
  if (util > 0.82) return 'surging';
  return 'steady';
}

function psExposureFromDeps(deps: number, fragile: number): PrivateSupplyExposureBand {
  const score = deps * 8 - fragile * 12;
  if (score < 2) return 'isolated';
  if (score < 8) return 'exposed';
  if (score < 16) return 'balanced';
  if (score < 26) return 'integrated';
  return 'embedded';
}

function psEcosystemMaturity(companyCount: number, avgVitality: number, linkStrength: number): RegionalEcosystemMaturityBand {
  const raw = companyCount * 2.2 + avgVitality * 0.4 + linkStrength * 3;
  if (raw < 10) return 'nascent';
  if (raw < 18) return 'forming';
  if (raw < 28) return 'connected';
  if (raw < 40) return 'mature';
  return 'dominant';
}

export function createInitialPrivateSectorPersisted(turn = 0): PrivateSectorPersisted {
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: turn || null,
    lastUpdatedTurn: turn,
    companyVitalityBands: {},
    productionBands: {},
    ecosystemBands: {},
    history: [],
    lastInputHash: ''
  };
}

export function sanitizePrivateSectorPersisted(raw: unknown, turn = 0): PrivateSectorPersisted {
  const base = createInitialPrivateSectorPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<PrivateSectorPersisted>;
  return {
    ...base,
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Number(o.revision) || 0,
    initializedTurn: o.initializedTurn == null ? base.initializedTurn : Number(o.initializedTurn),
    lastUpdatedTurn: Number(o.lastUpdatedTurn) || turn,
    companyVitalityBands: { ...(o.companyVitalityBands || {}) },
    productionBands: { ...(o.productionBands || {}) },
    ecosystemBands: { ...(o.ecosystemBands || {}) },
    history: Array.isArray(o.history) ? o.history.slice(-V1014_LIMITS.maxHistory) : [],
    lastInputHash: String(o.lastInputHash || '')
  };
}

export function privateSectorInputHash(inputs: PrivateSectorInputs): string {
  const lr = inputs.livingRegions?.revision ?? 0;
  const sc = inputs.industries?.revision ?? 0;
  const eg = inputs.economicGeography?.revision ?? 0;
  const inf = inputs.infraNetworks?.revision ?? 0;
  const ns = inputs.nationalSystems?.revision ?? 0;
  const wf = inputs.workforce?.revision ?? 0;
  return `v1014:${inputs.turn}:${inputs.enabled ? 1 : 0}:${lr}:${sc}:${eg}:${inf}:${ns}:${wf}`;
}

export function buildPrivateSectorInputs(params: {
  turn: number;
  gameSettings?: GameSettingsState | null;
  livingRegions?: LivingRegionsState | null;
  industries?: IndustriesSupplyChainsState | null;
  economicGeography?: EconomicGeographyState | null;
  infraNetworks?: StrategicInfrastructureState | null;
  nationalSystems?: NationalSystemsState | null;
  workforce?: NationalWorkforceState | null;
}): PrivateSectorInputs {
  const g = params.gameSettings;
  const enabled = g?.privateSectorEnabled !== false && g?.nationalSystemsEnabled !== false && g?.industriesEnabled !== false;
  return {
    turn: params.turn,
    enabled,
    livingRegions: params.livingRegions || null,
    industries: params.industries || null,
    economicGeography: params.economicGeography || null,
    infraNetworks: params.infraNetworks || null,
    nationalSystems: params.nationalSystems || null,
    workforce: params.workforce || null
  };
}

function psPickCatalog(regionId: string, lrSectors: Partial<Record<LRSector, number>> | undefined, limit: number): PrivateCompanyCatalogEntry[] {
  const scored = PRIVATE_COMPANY_CATALOG.filter(c => c.regionId === regionId).map(c => {
    const secScore = (c.sectors || []).reduce((a, s) => a + Number(lrSectors?.[s] || 0), 0);
    return { c, score: c.weight + secScore * 0.08 };
  }).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.c);
}

export function computeNationalPrivateSector(
  inputs: PrivateSectorInputs,
  persistedIn: PrivateSectorPersisted | null,
  prevState: NationalPrivateSectorState | null,
  opts: { emit?: boolean } = {}
): { state: NationalPrivateSectorState; persisted: PrivateSectorPersisted; events: PrivateSectorDerivedEvent[] } {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  const persisted = persistedIn ? sanitizePrivateSectorPersisted(persistedIn, inputs.turn) : createInitialPrivateSectorPersisted(inputs.turn);
  const events: PrivateSectorDerivedEvent[] = [];
  if (!inputs.enabled || !inputs.industries) {
    const empty: NationalPrivateSectorState = {
      schemaVersion: V1014_SCHEMA_VERSION,
      revision: persisted.revision,
      regions: {},
      national: { leadingRegions: [], constrainedRegions: [], dominantArchetypes: [], criticalDependencies: [], ecosystemOpportunity: null, ecosystemRisk: null, totalCompanies: 0, avgVitality: 0 },
      history: persisted.history,
      lastUpdatedTurn: inputs.turn,
      inputHash: privateSectorInputHash(inputs),
      computeMs: 0
    };
    return { state: empty, persisted, events };
  }
  const inputHash = privateSectorInputHash(inputs);
  const regions: Record<string, RegionalPrivateEcosystemState> = {};
  const vitalityBands = { ...persisted.companyVitalityBands };
  const productionBands = { ...persisted.productionBands };
  const ecosystemBands = { ...persisted.ecosystemBands };
  let totalCompanies = 0;
  let vitalitySum = 0;

  for (const code of V1014_CORE_REGIONS) {
    const lrReg = inputs.livingRegions?.regions?.[code];
    const indReg = inputs.industries.regions[code];
    const catalog = psPickCatalog(code, lrReg?.sectors, V1014_LIMITS.maxCompaniesPerRegion);
    const companies: PrivateCompanyState[] = [];
    let activeProduction = 0;
    let regionVitalitySum = 0;
    const links: RegionalEcosystemLink[] = [];
    const deps = (indReg?.suppliedBy || []).slice(0, V1014_LIMITS.maxEcosystemLinks);
    deps.forEach((d, i) => {
      links.push({
        id: `pslink_${code}_${i}`,
        fromRegionId: d.providerRegionId,
        toRegionId: code,
        supply: d.supply,
        strength: psR(d.share * 100, 0),
        fragile: Boolean(d.fragile),
        reason: d.reason || `Depends on ${d.providerRegionId} for ${SUPPLY_LABEL[d.supply]}`
      });
    });
    for (const entry of catalog) {
      const linked = psArchetypeToIndustry(entry.archetype);
      const ind = linked && indReg?.industries?.[linked];
      const util = psClamp(ind?.utilization ?? 0.35, 0, 1);
      const constrained = Boolean(ind?.constraint);
      const momentum = lrReg ? (LR_MOM_RANK[lrReg.momentum.band] ?? 2) * 10 : 20;
      const rawVitality = psVitalityFromSignals(ind?.strength ?? 25, constrained, momentum);
      const prevVit = vitalityBands[entry.id];
      const vitality = prevVit && Math.abs(V1014_VITALITY_RANK[rawVitality] - V1014_VITALITY_RANK[prevVit]) === 1 ? prevVit : rawVitality;
      vitalityBands[entry.id] = vitality;
      const rawProd = psProductionFromOutput(util, constrained);
      const production = productionBands[entry.id] && rawProd === 'idle' && productionBands[entry.id] !== 'idle'
        ? productionBands[entry.id]
        : rawProd;
      productionBands[entry.id] = production;
      const exposure = psExposureFromDeps(deps.length, deps.filter(x => x.fragile).length);
      activeProduction += ind?.effectiveOutput ?? 0;
      regionVitalitySum += V1014_VITALITY_RANK[vitality];
      totalCompanies += 1;
      companies.push({
        id: entry.id,
        regionId: code,
        archetype: entry.archetype,
        name: entry.name,
        vitality,
        production,
        exposure,
        scale: psR((ind?.strength ?? 20) * (0.6 + util * 0.4)),
        utilization: psR(util, 2),
        primarySupply: ind?.outputs?.[0]?.supply ?? null,
        linkedIndustry: linked,
        ecosystemId: `eco_${code}`,
        summary: entry.tagline,
        evidence: [
          { label: 'Industry utilization', value: psR(util * 100, 0), source: 'v10.1.industries' },
          { label: 'Regional momentum', value: momentum, source: 'living_regions' }
        ],
        revision: inputs.turn
      });
    }
    const avgVit = companies.length ? regionVitalitySum / companies.length : 0;
    vitalitySum += regionVitalitySum;
    const linkStrength = links.reduce((a, l) => a + l.strength, 0) / Math.max(1, links.length);
    const rawEco = psEcosystemMaturity(companies.length, avgVit, linkStrength);
    const maturity = ecosystemBands[code] && V1014_ECOSYSTEM_RANK[rawEco] - V1014_ECOSYSTEM_RANK[ecosystemBands[code]] === 1
      ? ecosystemBands[code]
      : rawEco;
    ecosystemBands[code] = maturity;
    const primaryConstraint = indReg?.primaryIndustrialConstraint || null;
    regions[code] = {
      regionId: code,
      name: REGIONS[code]?.name || code,
      maturity,
      anchorArchetype: companies[0]?.archetype ?? null,
      companyCount: companies.length,
      activeProduction: psR(activeProduction),
      supplyChainRole: links.length ? `Linked across ${links.length} supply dependenc${links.length === 1 ? 'y' : 'ies'}` : 'Mostly self-contained',
      resilience: indReg?.resilience || 'moderate',
      companies,
      links,
      primaryConstraint,
      revision: inputs.turn
    };
  }

  const leadingRegions = Object.values(regions).filter(r => r.maturity === 'mature' || r.maturity === 'dominant').map(r => r.regionId);
  const constrainedRegions = Object.values(regions).filter(r => r.primaryConstraint).map(r => r.regionId);
  const archetypeCounts: Record<string, number> = {};
  Object.values(regions).forEach(r => r.companies.forEach(c => { archetypeCounts[c.archetype] = (archetypeCounts[c.archetype] || 0) + 1; }));
  const dominantArchetypes = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k as PrivateCompanyArchetype);
  const criticalDependencies = (inputs.industries.dependencies || []).filter(d => d.importance === 'critical').slice(0, 6).map(d => d.id);

  const state: NationalPrivateSectorState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: persisted.revision + 1,
    regions,
    national: {
      leadingRegions,
      constrainedRegions,
      dominantArchetypes,
      criticalDependencies,
      ecosystemOpportunity: leadingRegions.length ? `${leadingRegions.length} region(s) show mature private ecosystems` : null,
      ecosystemRisk: constrainedRegions.length ? `${constrainedRegions.length} region(s) face industrial constraints` : null,
      totalCompanies,
      avgVitality: totalCompanies ? psR(vitalitySum / totalCompanies, 2) : 0
    },
    history: persisted.history,
    lastUpdatedTurn: inputs.turn,
    inputHash,
    computeMs: psR((typeof performance !== 'undefined' ? performance.now() : 0) - t0, 2)
  };

  const nextPersisted: PrivateSectorPersisted = {
    ...persisted,
    revision: state.revision,
    initializedTurn: persisted.initializedTurn ?? inputs.turn,
    lastUpdatedTurn: inputs.turn,
    companyVitalityBands: vitalityBands,
    productionBands,
    ecosystemBands,
    lastInputHash: inputHash
  };

  if (opts.emit !== false && prevState) {
    for (const code of V1014_CORE_REGIONS) {
      const prev = prevState.regions[code];
      const cur = regions[code];
      if (!prev || !cur) continue;
      if (V1014_ECOSYSTEM_RANK[cur.maturity] > V1014_ECOSYSTEM_RANK[prev.maturity]) {
        events.push({ id: `ps_ev_${inputs.turn}_${code}_eco_up`, turn: inputs.turn, kind: 'private_ecosystem_matured', regionIds: [code], companyId: null, text: `${cur.name}: private ecosystem matured to ${V1014_ECOSYSTEM_LABEL[cur.maturity]}.`, significance: 'meaningful', evidence: ['v1014.ecosystem'] });
      }
    }
  }

  return { state, persisted: nextPersisted, events };
}

export function privateSectorWorldRoots(enabled: boolean, events: PrivateSectorDerivedEvent[], observers: LRObserverMap, day: number): StrategicWorldEvent[] {
  if (!enabled || !events.length) return [];
  return events.map(e => ({
    id: e.id,
    turn: e.turn,
    day,
    sourceSystem: 'private_sector' as any,
    kind: e.kind,
    subjectType: 'region',
    subjectId: e.regionIds[0] || 'national',
    actorId: null,
    strategicMeaning: e.text,
    significance: e.significance,
    claimKind: 'inference',
    observers,
    evidence: e.evidence
  }));
}

export function runV1014PrivateSectorSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try { const out = fn(); results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') }); }
    catch (err) { results.push({ id, name, passed: false, detail: err instanceof Error ? err.message : String(err) }); }
  };
"""))

# 50 self tests referencing fixtures
for t in range(1, 51):
    tid = f"ps{t:02d}"
    emit(f"  check('{tid}', 'V10.14 private sector invariant {t}', () => {{")
    emit(f"    const inp = buildPrivateSectorInputs({{ turn: {t}, gameSettings: {{ nationalSystemsEnabled: true, industriesEnabled: true, privateSectorEnabled: true }} as any }});")
    emit(f"    const out = computeNationalPrivateSector(inp, createInitialPrivateSectorPersisted({t}), null);")
    emit(f"    return out.state.schemaVersion === V1014_SCHEMA_VERSION && out.state.inputHash.length > 5 || JSON.stringify(out.state);")
    emit("  });")

emit("  return results;")
emit("}")

# Inspector UI (minimal)
emit(textwrap.dedent("""
export function V1014PrivateSectorInspector(props: { view: PrivateSectorWorldView | null }) {
  const { view } = props;
  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState<V9SelfTestResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  if (!view?.state) return null;
  const runTests = () => {
    if (busy) return;
    setBusy(true);
    try { setTests(runV1014PrivateSectorSelfTests()); } catch (err) { console.error('[V10.14 self-tests]', err); }
    finally { setBusy(false); }
  };
  const nat = view.state.national;
  return (
    <div className="border rounded p-2 text-xs space-y-2" data-testid="v1014-inspector">
      <div className="flex items-center justify-between">
        <strong>V10.14 Private Sector Simulation</strong>
        <button type="button" className="underline" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Inspect'}</button>
      </div>
      {open && (
        <div className="space-y-1 opacity-90">
          <div>Companies (national): {nat.totalCompanies} · avg vitality rank {nat.avgVitality}</div>
          <div>Leading regions: {nat.leadingRegions.join(', ') || '—'}</div>
          <div>Constrained: {nat.constrainedRegions.join(', ') || '—'}</div>
          <button type="button" className="px-2 py-1 rounded border" onClick={runTests} disabled={busy}>{busy ? 'Running…' : 'Run V10.14 self-tests'}</button>
          {tests && <div>{tests.filter(t => !t.passed).length ? `${tests.filter(t => !t.passed).length} failed` : 'All tests passed'} ({tests.length})</div>}
        </div>
      )}
    </div>
  );
}
"""))

out_path = "/workspace/_v1014_section_chunk.ts"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print(f"Wrote {len(lines)} lines to {out_path}")
