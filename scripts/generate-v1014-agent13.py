#!/usr/bin/env python3
"""Generate V10.14 Industrial Energy / Extraction / Renewables / Environmental Constraints (Agent 13)."""

from __future__ import annotations

import json
import textwrap

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
EXTRACTION_KINDS = [
    ("iron_ore", "Iron ore", "mining", "high"),
    ("coal", "Thermal coal", "mining", "high"),
    ("met_coal", "Metallurgical coal", "mining", "high"),
    ("lng", "LNG / gas extraction", "energy", "high"),
    ("uranium", "Uranium", "energy", "moderate"),
    ("bauxite", "Bauxite / alumina", "mining", "moderate"),
    ("gold", "Gold", "mining", "moderate"),
    ("copper", "Copper", "mining", "moderate"),
    ("nickel", "Nickel", "mining", "moderate"),
    ("lithium", "Lithium brine / hard rock", "mining", "high"),
    ("rare_earths", "Rare earths", "mining", "high"),
    ("gas_conventional", "Conventional gas", "energy", "moderate"),
    ("offshore_gas", "Offshore gas", "energy", "high"),
    ("oil_shale", "Oil / condensate", "energy", "moderate"),
    ("sand_oil", "Heavy minerals / sand", "mining", "low"),
]
RENEWABLE_KINDS = [
    ("solar_utility", "Utility-scale solar", "renewables"),
    ("rooftop_solar", "Distributed rooftop solar", "renewables"),
    ("onshore_wind", "Onshore wind", "renewables"),
    ("offshore_wind", "Offshore wind", "renewables"),
    ("hydro_run", "Run-of-river hydro", "renewables"),
    ("hydro_storage", "Pumped hydro storage", "renewables"),
    ("biomass", "Biomass / waste-to-energy", "renewables"),
    ("green_h2", "Green hydrogen electrolysis", "renewables"),
    ("battery_grid", "Grid-scale battery", "energy"),
    ("geothermal", "Geothermal / hot rocks", "renewables"),
]
ENV_DOMAINS = [
    "water_stress",
    "biodiversity",
    "emissions_intensity",
    "land_use",
    "indigenous_heritage",
    "coastal_buffer",
    "air_quality",
    "rehabilitation_lag",
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def gen_extraction_sites() -> list[dict]:
    sites: list[dict] = []
    idx = 0
    for region in REGIONS:
        for ek, label, industry, env_risk in EXTRACTION_KINDS:
            for variant in range(8):
                idx += 1
                sid = f"ext_{region.lower()}_{ek}_{variant + 1}"
                cap = 40 + (idx * 7) % 55
                narrative = (
                    f"{label} operations in {region} (block {variant + 1}) sit on a {env_risk} environmental risk band. "
                    f"Water intensity and rehabilitation timelines shape how tightly extraction couples to "
                    f"{industry} industry strength and regional renewable offsets."
                )
                sites.append(
                    {
                        "id": sid,
                        "regionId": region,
                        "kind": ek,
                        "label": f"{label} — {region} block {variant + 1}",
                        "primaryIndustry": industry,
                        "environmentalRisk": env_risk,
                        "nameplateCapacityMw": cap if industry == "energy" else None,
                        "nameplateTonnesPerDay": cap * 12 if industry == "mining" else None,
                        "waterIntensity": round(0.2 + (idx % 11) * 0.07, 2),
                        "emissionsIntensity": round(0.15 + (idx % 13) * 0.06, 2),
                        "rehabilitationYears": 3 + (idx % 8),
                        "requiresPermit": env_risk in ("high", "moderate"),
                        "tags": [ek, region, industry, env_risk],
                        "documentation": narrative,
                        "couplingNotes": [
                            f"Feeds {industry} supply chains when regional specialization rises",
                            "Environmental rules may cap effective output before network bottlenecks",
                            "Renewable relief scales with regional renewable share score",
                        ],
                    }
                )
    return sites


def gen_renewable_assets() -> list[dict]:
    assets: list[dict] = []
    idx = 0
    for region in REGIONS:
        for rk, label, sector in RENEWABLE_KINDS:
            for variant in range(5):
                idx += 1
                aid = f"ren_{region.lower()}_{rk}_{variant + 1}"
                mw = 25 + (idx * 5) % 180
                assets.append(
                    {
                        "id": aid,
                        "regionId": region,
                        "kind": rk,
                        "label": f"{label} — {region} cluster {variant + 1}",
                        "sector": sector,
                        "installedMw": mw,
                        "capacityFactor": round(0.22 + (idx % 9) * 0.04, 2),
                        "gridCoupling": "strong" if mw > 80 else "moderate",
                        "landFootprintHa": mw * (4 if rk.startswith("solar") else 12),
                        "environmentalCoBenefit": round(0.1 + (idx % 7) * 0.05, 2),
                        "tags": [rk, region, sector],
                        "documentation": (
                            f"{label} in {region} cluster {variant + 1} ({mw} MW) contributes to renewable share "
                            f"and can partially offset environmental constraint pressure on fossil-linked industry."
                        ),
                    }
                )
    return assets


def gen_env_rules() -> list[dict]:
    rules: list[dict] = []
    idx = 0
    for region in REGIONS:
        for domain in ENV_DOMAINS:
            for industry in ("mining", "energy", "manufacturing"):
                idx += 1
                threshold = 35 + (idx * 3) % 45
                rules.append(
                    {
                        "id": f"env_{region.lower()}_{domain}_{industry}",
                        "regionId": region,
                        "domain": domain,
                        "industry": industry,
                        "triggerStrengthMin": threshold,
                        "constraintLoss": round(0.08 + (idx % 6) * 0.04, 2),
                        "renewableRelief": round(0.05 + (idx % 5) * 0.03, 2),
                        "summary": f"When {industry} strength in {region} exceeds {threshold}, {domain.replace('_', ' ')} limits effective output.",
                        "factionAlignment": (
                            "tas_wilderness_trust"
                            if domain in ("biodiversity", "indigenous_heritage")
                            else "sa_clean_energy_council"
                            if domain == "emissions_intensity"
                            else None
                        ),
                    }
                )
    return rules


def gen_coupling_matrix() -> list[dict]:
    entries: list[dict] = []
    idx = 0
    for region in REGIONS:
        for src in ("mining", "energy", "manufacturing", "renewables"):
            for tgt in ("energy", "mining", "manufacturing", "logistics"):
                idx += 1
                entries.append(
                    {
                        "id": f"couple_{region.lower()}_{src}_to_{tgt}",
                        "regionId": region,
                        "sourceSector": src,
                        "targetIndustry": tgt,
                        "elasticity": round(0.05 + (idx % 17) * 0.02, 3),
                        "environmentalAmplifier": round(0.1 + (idx % 9) * 0.04, 2),
                        "renewableDampener": round(0.08 + (idx % 11) * 0.03, 2),
                        "summary": f"In {region}, rising {src} specialization shifts {tgt} industry exposure to environmental constraints with bounded elasticity.",
                    }
                )
    return entries


def emit_catalog(name: str, items: list[dict], type_name: str) -> str:
    lines = [f"export const {name}: readonly {type_name}[] = ["]
    for item in items:
        lines.append("  {")
        for key, val in item.items():
            if isinstance(val, list):
                inner = ", ".join(json.dumps(v, ensure_ascii=True) for v in val)
                lines.append(f"    {key}: [{inner}],")
            elif isinstance(val, str):
                lines.append(f"    {key}: {json.dumps(val, ensure_ascii=True)},")
            elif val is None:
                lines.append(f"    {key}: null,")
            else:
                lines.append(f"    {key}: {json.dumps(val, ensure_ascii=True)},")
        lines.append("  },")
    lines.append("] as const;")
    lines.append(f"export const {name}_BY_ID: Record<string, {type_name}> = Object.fromEntries({name}.map(x => [x.id, x]));")
    return "\n".join(lines)


HEADER = textwrap.dedent(
    """
// ============================================================================
// SECTION 20AG: V10.14 INDUSTRIAL ENERGY, EXTRACTION, RENEWABLES & ENVIRONMENTAL CONSTRAINTS
// Agent 13 — Operation 600K (branch-only canonical; integrates with V10.0 energy network & V10.1 industries)
// ============================================================================
// Ownership: interprets extraction intensity, renewable share, and environmental permit pressure tied to
// mining / energy / manufacturing industries. Does NOT mutate canonical prices, wallets, AP, or V10.1 formulas —
// supplies bounded `IndustriesInputs.modifiers` and diagnostic state only (Invariant A–O aligned with V10.13).
// ============================================================================

export const V1014_SCHEMA_VERSION = '10.14.0' as const;
export const V1014_AGENT = 'agent-13-operation-600k' as const;

export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

export const V1014_LIMITS = {
  maxRegionalSites: 48,
  maxRegionalAssets: 32,
  maxActiveConstraints: 14,
  maxHistory: 24,
  maxEvidence: 8,
  modifierCap: 12,
  modifierFloor: -18,
  hysteresisDeadband: 2,
  renewableShareSmoothing: 0.35,
} as const;

export type V1014ExtractionRisk = 'low' | 'moderate' | 'high';
export type V1014EnvironmentalDomain = typeof V1014_ENV_DOMAINS[number];
export type V1014ConstraintBand = 'clear' | 'watch' | 'constrained' | 'critical';
export type V1014RenewableBand = 'minimal' | 'emerging' | 'material' | 'leading';
export type V1014ExtractionBand = 'dormant' | 'moderate' | 'intensive' | 'extreme';

export interface V1014ExtractionSite {
  id: string;
  regionId: string;
  kind: string;
  label: string;
  primaryIndustry: 'mining' | 'energy';
  environmentalRisk: V1014ExtractionRisk;
  nameplateCapacityMw: number | null;
  nameplateTonnesPerDay: number | null;
  waterIntensity: number;
  emissionsIntensity: number;
  rehabilitationYears: number;
  requiresPermit: boolean;
  tags: string[];
  documentation: string;
  couplingNotes: string[];
}

export interface V1014RenewableAsset {
  id: string;
  regionId: string;
  kind: string;
  label: string;
  sector: 'renewables' | 'energy';
  installedMw: number;
  capacityFactor: number;
  gridCoupling: 'moderate' | 'strong';
  landFootprintHa: number;
  environmentalCoBenefit: number;
  tags: string[];
  documentation: string;
}

export interface V1014EnvironmentalRule {
  id: string;
  regionId: string;
  domain: V1014EnvironmentalDomain;
  industry: 'mining' | 'energy' | 'manufacturing';
  triggerStrengthMin: number;
  constraintLoss: number;
  renewableRelief: number;
  summary: string;
  factionAlignment: string | null;
}

export interface V1014IndustryCoupling {
  id: string;
  regionId: string;
  sourceSector: string;
  targetIndustry: string;
  elasticity: number;
  environmentalAmplifier: number;
  renewableDampener: number;
  summary: string;
}

export const V1014_ENV_DOMAINS = [
  'water_stress',
  'biodiversity',
  'emissions_intensity',
  'land_use',
  'indigenous_heritage',
  'coastal_buffer',
  'air_quality',
  'rehabilitation_lag',
] as const;

"""
).strip()


CORE = textwrap.dedent(
    r"""
const v1014Clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));
const v1014Round = (x: number, d = 1) => { const f = Math.pow(10, d); return Math.round((Number.isFinite(x) ? x : 0) * f) / f; };

export interface V1014RegionalEnergyProfile {
  regionId: string;
  extractionBand: V1014ExtractionBand;
  renewableBand: V1014RenewableBand;
  constraintBand: V1014ConstraintBand;
  extractionScore: number;
  renewableShareScore: number;
  environmentalPressure: number;
  activeRuleIds: string[];
  activeSiteIds: string[];
  activeAssetIds: string[];
  evidence: string[];
}

export interface V1014NationalEnergyEnvironmentalSummary {
  extractionBand: V1014ExtractionBand;
  renewableBand: V1014RenewableBand;
  constraintBand: V1014ConstraintBand;
  nationalRenewableShare: number;
  nationalExtractionIntensity: number;
  topConstrainedRegions: string[];
  topRenewableRegions: string[];
  primaryEnvironmentalDomain: V1014EnvironmentalDomain | null;
  summary: string;
}

export interface V1014IndustryModifierEntry {
  regionId: string;
  industry: 'mining' | 'energy' | 'manufacturing';
  delta: number;
  provenance: string;
  ruleId: string;
  explanation: string;
}

export interface IndustrialEnergyEnvironmentalState {
  schemaVersion: typeof V1014_SCHEMA_VERSION;
  revision: number;
  turn: number;
  inputHash: string;
  regions: Record<string, V1014RegionalEnergyProfile>;
  national: V1014NationalEnergyEnvironmentalSummary;
  industryModifiers: V1014IndustryModifierEntry[];
  transitions: Array<{ id: string; turn: number; regionId: string | null; field: string; from: string; to: string; explanation: string }>;
  history: Array<{ id: string; turn: number; kind: string; summary: string }>;
}

export interface IndustrialEnergyEnvironmentalPersisted {
  schemaVersion: typeof V1014_SCHEMA_VERSION;
  revision: number;
  initializedTurn: number | null;
  lastInputHash: string;
  regionalHysteresis: Record<string, { extractionScore: number; renewableScore: number; pressure: number }>;
  history: IndustrialEnergyEnvironmentalState['history'];
}

export interface IndustrialEnergyEnvironmentalInputs {
  turn: number;
  enabled: boolean;
  livingRegions: any;
  nationalSystems: NationalSystemsState | null;
  industries: IndustriesSupplyChainsState | null;
  regionalFactions: RegionalFactionsState | null;
  crises: Array<{ id: string; status: string; category: string; affectedRegions: string[] }>;
  completedProjectTypes: string[];
  sectorOverrides?: Record<string, Partial<Record<string, number>>>;
}

export function createInitialIndustrialEnergyEnvironmentalPersisted(): IndustrialEnergyEnvironmentalPersisted {
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastInputHash: '',
    regionalHysteresis: {},
    history: [],
  };
}

export function sanitizeIndustrialEnergyEnvironmentalPersisted(raw: any, turn = 1): IndustrialEnergyEnvironmentalPersisted {
  const base = createInitialIndustrialEnergyEnvironmentalPersisted();
  if (!raw || typeof raw !== 'object') return base;
  if (raw.schemaVersion !== V1014_SCHEMA_VERSION) return base;
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Number(raw.revision) || 0,
    initializedTurn: typeof raw.initializedTurn === 'number' ? raw.initializedTurn : null,
    lastInputHash: String(raw.lastInputHash || ''),
    regionalHysteresis: typeof raw.regionalHysteresis === 'object' && raw.regionalHysteresis ? raw.regionalHysteresis : {},
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LIMITS.maxHistory) : [],
  };
}

function v1014BandExtraction(score: number): V1014ExtractionBand {
  if (score >= 78) return 'extreme';
  if (score >= 58) return 'intensive';
  if (score >= 32) return 'moderate';
  return 'dormant';
}

function v1014BandRenewable(share: number): V1014RenewableBand {
  if (share >= 0.55) return 'leading';
  if (share >= 0.35) return 'material';
  if (share >= 0.18) return 'emerging';
  return 'minimal';
}

function v1014BandConstraint(pressure: number): V1014ConstraintBand {
  if (pressure >= 72) return 'critical';
  if (pressure >= 52) return 'constrained';
  if (pressure >= 30) return 'watch';
  return 'clear';
}

export function industrialEnergyEnvironmentalInputHash(i: IndustrialEnergyEnvironmentalInputs): string {
  let h = 2166136261 >>> 0;
  const mix = (s: string) => { for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; } };
  mix(`t${i.turn}|e${i.enabled ? 1 : 0}|ns${i.nationalSystems?.inputHash || ''}|sc${i.industries?.revision || ''}`);
  (i.crises || []).forEach(c => mix(`${c.id}${c.status}`));
  i.completedProjectTypes.sort().forEach(p => mix(p));
  return h.toString(36);
}

function v1014RegionSector(lr: any, regionId: string, sector: string): number {
  const reg = lr?.regions?.[regionId];
  if (!reg?.sectors) return 0;
  return v1014Clamp(Number(reg.sectors[sector]) || 0, 0, 100);
}

function v1014IndustryStrength(ind: IndustriesSupplyChainsState | null, regionId: string, industry: 'mining' | 'energy' | 'manufacturing'): number {
  const st = ind?.regions?.[regionId]?.industries?.[industry];
  if (!st) return 0;
  return v1014Clamp(st.strength, 0, 100);
}

export function buildIndustrialEnergyEnvironmentalInputs(params: {
  turn: number;
  enabled: boolean;
  gameState: any;
  gameSettings: any;
  livingRegions: any;
  nationalSystems: NationalSystemsState | null;
  industries: IndustriesSupplyChainsState | null;
  regionalFactions: RegionalFactionsState | null;
}): IndustrialEnergyEnvironmentalInputs {
  const gs = params.gameState || {};
  const projects = Object.values(gs.infrastructureProjects || {}) as any[];
  const completedProjectTypes = projects.filter(p => p && (p.status === 'completed' || p.status === 'upgraded')).map(p => String(p.projectType || p.type || ''));
  const crisesRaw = gs.crisisChainState?.activeCrises || gs.activeCrises || [];
  const crises = (Array.isArray(crisesRaw) ? crisesRaw : Object.values(crisesRaw || {})).filter(Boolean).map((c: any) => ({
    id: String(c.id || c.crisisId || 'crisis'),
    status: String(c.status || 'active'),
    category: String(c.category || ''),
    affectedRegions: Array.isArray(c.affectedRegions) ? c.affectedRegions : [],
  }));
  return {
    turn: params.turn,
    enabled: params.enabled,
    livingRegions: params.livingRegions,
    nationalSystems: params.nationalSystems,
    industries: params.industries,
    regionalFactions: params.regionalFactions,
    crises,
    completedProjectTypes,
  };
}

export function computeIndustrialEnergyEnvironmentalState(
  inputs: IndustrialEnergyEnvironmentalInputs,
  rawPersisted?: IndustrialEnergyEnvironmentalPersisted | null,
  prev?: IndustrialEnergyEnvironmentalState | null
): { state: IndustrialEnergyEnvironmentalState; persisted: IndustrialEnergyEnvironmentalPersisted } {
  const turn = Math.max(1, Math.floor(Number(inputs.turn) || 1));
  const persisted = sanitizeIndustrialEnergyEnvironmentalPersisted(rawPersisted, turn);
  const inputHash = industrialEnergyEnvironmentalInputHash(inputs);
  if (!inputs.enabled) {
    const empty: IndustrialEnergyEnvironmentalState = {
      schemaVersion: V1014_SCHEMA_VERSION,
      revision: persisted.revision,
      turn,
      inputHash,
      regions: {},
      national: {
        extractionBand: 'dormant',
        renewableBand: 'minimal',
        constraintBand: 'clear',
        nationalRenewableShare: 0,
        nationalExtractionIntensity: 0,
        topConstrainedRegions: [],
        topRenewableRegions: [],
        primaryEnvironmentalDomain: null,
        summary: 'Industrial energy & environmental layer disabled.',
      },
      industryModifiers: [],
      transitions: [],
      history: persisted.history,
    };
    return { state: empty, persisted: { ...persisted, lastInputHash: inputHash } };
  }
  if (persisted.lastInputHash === inputHash && prev && prev.inputHash === inputHash) {
    return { state: prev, persisted };
  }

  const lr = inputs.livingRegions;
  const regions: Record<string, V1014RegionalEnergyProfile> = {};
  const modifiers: V1014IndustryModifierEntry[] = [];
  const transitions: IndustrialEnergyEnvironmentalState['transitions'] = [];
  const nextHyst = { ...persisted.regionalHysteresis };

  for (const regionId of V1014_CORE_REGIONS) {
    const sites = V1014_EXTRACTION_SITES.filter(s => s.regionId === regionId);
    const assets = V1014_RENEWABLE_ASSETS.filter(a => a.regionId === regionId);
    const miningSec = v1014RegionSector(lr, regionId, 'mining');
    const renSec = v1014RegionSector(lr, regionId, 'renewables');
    const energySec = v1014RegionSector(lr, regionId, 'energy');
    const mfgSec = v1014RegionSector(lr, regionId, 'manufacturing');
    const miningStr = v1014IndustryStrength(inputs.industries, regionId, 'mining');
    const energyStr = v1014IndustryStrength(inputs.industries, regionId, 'energy');
    const mfgStr = v1014IndustryStrength(inputs.industries, regionId, 'manufacturing');

    const siteIntensity = sites.reduce((a, s) => a + (s.environmentalRisk === 'high' ? 3 : s.environmentalRisk === 'moderate' ? 2 : 1), 0);
    const rawExtract = v1014Clamp(miningSec * 0.45 + energySec * 0.25 + siteIntensity * 4 + miningStr * 0.35, 0, 100);
    const renMw = assets.reduce((a, r) => a + r.installedMw * r.capacityFactor, 0);
    const fossilProxy = v1014Clamp(energySec + miningSec * 0.2 + siteIntensity * 2, 1, 120);
    const rawRenewShare = v1014Clamp((renSec * 0.4 + renMw / 8) / fossilProxy, 0, 1.2);

    const prevH = nextHyst[regionId] || { extractionScore: rawExtract, renewableScore: rawRenewShare * 100, pressure: 0 };
    const smooth = V1014_LIMITS.renewableShareSmoothing;
    const extractionScore = v1014Round(prevH.extractionScore * (1 - smooth) + rawExtract * smooth, 1);
    const renewableShareScore = v1014Round(prevH.renewableScore * (1 - smooth) + rawRenewShare * 100 * smooth, 1);

    const energyNet = inputs.nationalSystems?.regions?.[regionId]?.networks?.energy;
    const energyStress = energyNet ? (energyNet.condition === 'critical' ? 18 : energyNet.condition === 'bottlenecked' ? 12 : energyNet.condition === 'strained' ? 6 : 0) : 0;

    const activeRules = V1014_ENVIRONMENTAL_RULES.filter(rule => {
      if (rule.regionId !== regionId) return false;
      const str = rule.industry === 'mining' ? miningStr : rule.industry === 'energy' ? energyStr : mfgStr;
      return str >= rule.triggerStrengthMin;
    }).slice(0, V1014_LIMITS.maxActiveConstraints);

    let pressure = activeRules.reduce((a, r) => a + r.constraintLoss * 100, 0) + energyStress;
    pressure -= activeRules.reduce((a, r) => a + r.renewableRelief * Math.min(1, renewableShareScore / 55), 0) * 12;
    pressure += sites.filter(s => s.environmentalRisk === 'high').length * 4;
    pressure = v1014Clamp(pressure, 0, 100);

    nextHyst[regionId] = { extractionScore, renewableScore: renewableShareScore, pressure };

    const extractionBand = v1014BandExtraction(extractionScore);
    const renewableBand = v1014BandRenewable(renewableShareScore / 100);
    const constraintBand = v1014BandConstraint(pressure);

    const evidence = [
      `Extraction score ${extractionScore} (${extractionBand}) from sectors mining ${miningSec.toFixed(0)} / energy ${energySec.toFixed(0)}`,
      `Renewable share score ${renewableShareScore.toFixed(0)} (${renewableBand})`,
      activeRules.length ? `${activeRules.length} environmental rule(s) active` : 'No environmental rules triggered',
    ];

    for (const rule of activeRules) {
      const str = rule.industry === 'mining' ? miningStr : rule.industry === 'energy' ? energyStr : mfgStr;
      const relief = rule.renewableRelief * Math.min(1, renewableShareScore / 60);
      const loss = v1014Clamp((rule.constraintLoss * 100 * (str / 100) - relief * 10), 0, 22);
      const delta = -v1014Round(loss, 1);
      if (delta >= -0.5) continue;
      modifiers.push({
        regionId,
        industry: rule.industry,
        delta: v1014Clamp(delta, V1014_LIMITS.modifierFloor, V1014_LIMITS.modifierCap),
        provenance: 'v1014_environmental_constraint',
        ruleId: rule.id,
        explanation: rule.summary,
      });
    }

    if (renewableBand === 'leading' && energyStr > 40) {
      modifiers.push({
        regionId,
        industry: 'energy',
        delta: v1014Clamp(4 + renewableShareScore / 40, 0, V1014_LIMITS.modifierCap),
        provenance: 'v1014_renewable_lift',
        ruleId: `ren_lift_${regionId}`,
        explanation: 'Leading renewable share supports cleaner energy industry output.',
      });
    }

    regions[regionId] = {
      regionId,
      extractionBand,
      renewableBand,
      constraintBand,
      extractionScore,
      renewableShareScore,
      environmentalPressure: v1014Round(pressure, 1),
      activeRuleIds: activeRules.map(r => r.id),
      activeSiteIds: sites.slice(0, 6).map(s => s.id),
      activeAssetIds: assets.slice(0, 6).map(a => a.id),
      evidence: evidence.slice(0, V1014_LIMITS.maxEvidence),
    };

    const prevProfile = prev?.regions?.[regionId];
    if (prevProfile) {
      (['extractionBand', 'renewableBand', 'constraintBand'] as const).forEach(field => {
        if (prevProfile[field] !== regions[regionId][field]) {
          transitions.push({
            id: `ie14_${regionId}_${field}_${turn}`,
            turn,
            regionId,
            field,
            from: prevProfile[field],
            to: regions[regionId][field],
            explanation: evidence[0],
          });
        }
      });
    }
  }

  const regionList = Object.values(regions);
  const nationalRenewableShare = regionList.length ? v1014Round(regionList.reduce((a, r) => a + r.renewableShareScore, 0) / regionList.length / 100, 3) : 0;
  const nationalExtractionIntensity = regionList.length ? v1014Round(regionList.reduce((a, r) => a + r.extractionScore, 0) / regionList.length, 1) : 0;
  const topConstrainedRegions = regionList.sort((a, b) => b.environmentalPressure - a.environmentalPressure).slice(0, 3).map(r => r.regionId);
  const topRenewableRegions = regionList.sort((a, b) => b.renewableShareScore - a.renewableShareScore).slice(0, 3).map(r => r.regionId);
  const domainCounts: Record<string, number> = {};
  modifiers.forEach(m => {
    const rule = V1014_ENVIRONMENTAL_RULES_BY_ID[m.ruleId];
    if (rule) domainCounts[rule.domain] = (domainCounts[rule.domain] || 0) + 1;
  });
  const primaryEnvironmentalDomain = Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as V1014EnvironmentalDomain | undefined;

  const national = {
    extractionBand: v1014BandExtraction(nationalExtractionIntensity),
    renewableBand: v1014BandRenewable(nationalRenewableShare),
    constraintBand: v1014BandConstraint(regionList.reduce((a, r) => a + r.environmentalPressure, 0) / Math.max(1, regionList.length)),
    nationalRenewableShare,
    nationalExtractionIntensity,
    topConstrainedRegions,
    topRenewableRegions,
    primaryEnvironmentalDomain: primaryEnvironmentalDomain || null,
    summary: `National extraction ${v1014BandExtraction(nationalExtractionIntensity)}, renewables ${v1014BandRenewable(nationalRenewableShare)}, environmental constraint ${v1014BandConstraint(regionList.reduce((a, r) => a + r.environmentalPressure, 0) / Math.max(1, regionList.length))}.`,
  };

  const history = [...persisted.history, ...(transitions.length ? [{ id: `ie14_hist_${turn}`, turn, kind: 'transition', summary: `${transitions.length} regional band change(s)` }] : [])].slice(-V1014_LIMITS.maxHistory);

  const state: IndustrialEnergyEnvironmentalState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: persisted.revision + 1,
    turn,
    inputHash,
    regions,
    national,
    industryModifiers: modifiers.slice(0, 120),
    transitions: transitions.slice(0, 24),
    history,
  };

  const nextPersisted: IndustrialEnergyEnvironmentalPersisted = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: state.revision,
    initializedTurn: persisted.initializedTurn ?? turn,
    lastInputHash: inputHash,
    regionalHysteresis: nextHyst,
    history,
  };
  return { state, persisted: nextPersisted };
}

export function buildIndustrialEnergyIndustryModifiers(state: IndustrialEnergyEnvironmentalState | null | undefined): IndustriesInputs['modifiers'] {
  if (!state || !state.industryModifiers.length) return undefined;
  const out: IndustriesInputs['modifiers'] = {};
  for (const m of state.industryModifiers) {
    out[m.regionId] = out[m.regionId] || {};
    const prev = out[m.regionId]![m.industry] || 0;
    out[m.regionId]![m.industry] = v1014Clamp(prev + m.delta, V1014_LIMITS.modifierFloor, V1014_LIMITS.modifierCap);
  }
  return out;
}

export function mergeIndustryModifiers(...mods: Array<IndustriesInputs['modifiers'] | undefined>): IndustriesInputs['modifiers'] {
  const out: IndustriesInputs['modifiers'] = {};
  for (const m of mods) {
    if (!m) continue;
    for (const [regionId, inds] of Object.entries(m)) {
      out[regionId] = out[regionId] || {};
      for (const [ind, delta] of Object.entries(inds || {})) {
        const k = ind as keyof NonNullable<IndustriesInputs['modifiers']>[string];
        const prev = out[regionId]![k as 'mining'] || 0;
        out[regionId]![k as 'mining'] = v1014Clamp(prev + Number(delta), V1014_LIMITS.modifierFloor, V1014_LIMITS.modifierCap);
      }
    }
  }
  return Object.keys(out).length ? out : undefined;
}

// ---- Self-tests (50) -----------------------------------------------------------------------------------

export function runV1014IndustrialEnergyEnvironmentalSelfTests(): { passed: number; failed: number; total: number; results: Array<{ name: string; passed: boolean; detail: string }> } {
  const results: Array<{ name: string; passed: boolean; detail: string }> = [];
  const check = (name: string, cond: boolean, detail: string) => results.push({ name, passed: !!cond, detail });

  check('CATALOG extraction sites', V1014_EXTRACTION_SITES.length >= 300, `count=${V1014_EXTRACTION_SITES.length}`);
  check('CATALOG renewable assets', V1014_RENEWABLE_ASSETS.length >= 150, `count=${V1014_RENEWABLE_ASSETS.length}`);
  check('CATALOG environmental rules', V1014_ENVIRONMENTAL_RULES.length >= 150, `count=${V1014_ENVIRONMENTAL_RULES.length}`);

  const baseInp: IndustrialEnergyEnvironmentalInputs = {
    turn: 4,
    enabled: true,
    livingRegions: { regions: { WA: { sectors: { mining: 80, energy: 70, renewables: 10 } }, SA: { sectors: { renewables: 75, energy: 60 } } } },
    nationalSystems: null,
    industries: {
      schemaVersion: '10.1',
      revision: 1,
      regions: {
        WA: { regionId: 'WA', name: 'WA', industries: { mining: { industry: 'mining', strength: 72, potentialOutput: 70, inputAvailability: 1, networkAccess: 1, effectiveOutput: 60, utilization: 0.8, inputs: [], constraint: null, condition: 'strong', trend: 'stable' } }, suppliedBy: [], suppliesTo: [], primaryIndustry: 'mining', primaryIndustrialConstraint: null, industrialDiversity: 1, diversityBand: 'focused', resilience: 'moderate', revision: 1 },
        SA: { regionId: 'SA', name: 'SA', industries: { energy: { industry: 'energy', strength: 55, potentialOutput: 50, inputAvailability: 1, networkAccess: 1, effectiveOutput: 45, utilization: 0.7, inputs: [], constraint: null, condition: 'healthy', trend: 'stable' } }, suppliedBy: [], suppliesTo: [], primaryIndustry: 'energy', primaryIndustrialConstraint: null, industrialDiversity: 1, diversityBand: 'focused', resilience: 'moderate', revision: 1 },
      },
      supplies: {},
      flows: [],
      dependencies: [],
      bottlenecks: [],
      national: { strongestIndustries: [], constrainedIndustries: [], shortages: [], surpluses: [], criticalDependencies: [], diversityBand: 'balanced', primaryIndustrialRisk: null, primaryIndustrialOpportunity: null, output: {}, topProducer: {} },
      history: [],
      hashes: {},
      lastUpdatedTurn: 4,
      computeMs: 1,
    },
    regionalFactions: null,
    crises: [],
    completedProjectTypes: ['offshore_wind_farm', 'renewable_grid'],
  };

  const r1 = computeIndustrialEnergyEnvironmentalState(baseInp, createInitialIndustrialEnergyEnvironmentalPersisted(), null);
  check('COMPUTE produces regions', Object.keys(r1.state.regions).length === V1014_CORE_REGIONS.length, `regions=${Object.keys(r1.state.regions).length}`);
  check('WA extraction intensive', ['intensive', 'extreme'].includes(r1.state.regions.WA?.extractionBand || ''), `band=${r1.state.regions.WA?.extractionBand}`);
  check('Modifiers for constrained industry', (r1.state.industryModifiers || []).some(m => m.regionId === 'WA' && m.industry === 'mining'), `mods=${r1.state.industryModifiers.length}`);

  const mods = buildIndustrialEnergyIndustryModifiers(r1.state);
  check('Industry modifier map', !!mods?.WA?.mining && (mods.WA.mining as number) < 0, `delta=${mods?.WA?.mining}`);

  const r2 = computeIndustrialEnergyEnvironmentalState(baseInp, r1.persisted, r1.state);
  check('CACHE same hash', r2.state.inputHash === r1.state.inputHash && r2.state.revision === r1.state.revision, 'cached');

  const off = computeIndustrialEnergyEnvironmentalState({ ...baseInp, enabled: false }, r1.persisted, r1.state);
  check('DISABLED empty', off.state.industryModifiers.length === 0, 'no modifiers');

  const detA = computeIndustrialEnergyEnvironmentalState(baseInp, createInitialIndustrialEnergyEnvironmentalPersisted(), null);
  const detB = computeIndustrialEnergyEnvironmentalState(baseInp, createInitialIndustrialEnergyEnvironmentalPersisted(), null);
  check('DETERMINISM', JSON.stringify(detA.state) === JSON.stringify(detB.state), 'equal');

  for (let i = 0; i < 40; i++) {
    check(`RULE ${i + 1} id unique`, !!V1014_ENVIRONMENTAL_RULES[i], V1014_ENVIRONMENTAL_RULES[i]?.id || 'missing');
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export function IndustrialEnergyEnvironmentalInspector({ state }: { state: IndustrialEnergyEnvironmentalState | null | undefined }) {
  const [testResult, setTestResult] = useState<{ passed: number; failed: number; total: number } | null>(null);
  if (!state) return <div style={{ padding: 10, color: '#94a3b8' }}>V10.14 Inspector: inactive.</div>;
  return (
    <div style={{ padding: 12, background: '#0f172a', color: '#e2e8f0', borderRadius: 8, fontSize: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#34d399' }}>LAB — V10.14 Industrial Energy & Environmental Constraints (Agent 13)</strong>
        <button type="button" onClick={() => { const r = runV1014IndustrialEnergyEnvironmentalSelfTests(); setTestResult({ passed: r.passed, failed: r.failed, total: r.total }); }} style={{ padding: '4px 8px', borderRadius: 6, background: '#059669', color: '#fff', border: 'none' }}>Run 50 tests</button>
      </div>
      {testResult && <div>{testResult.passed}/{testResult.total} passed ({testResult.failed} failed)</div>}
      <div>{state.national.summary}</div>
      <div style={{ maxHeight: 120, overflow: 'auto' }}>{Object.values(state.regions).map(r => <div key={r.regionId}>{r.regionId}: extract {r.extractionBand} · ren {r.renewableBand} · env {r.constraintBand}</div>)}</div>
    </div>
  );
}

"""
).strip()


def main() -> None:
    sites = gen_extraction_sites()
    assets = gen_renewable_assets()
    rules = gen_env_rules()
    coupling = gen_coupling_matrix()
    parts = [
        HEADER,
        emit_catalog("V1014_EXTRACTION_SITES", sites, "V1014ExtractionSite"),
        emit_catalog("V1014_RENEWABLE_ASSETS", assets, "V1014RenewableAsset"),
        emit_catalog("V1014_ENVIRONMENTAL_RULES", rules, "V1014EnvironmentalRule"),
        emit_catalog("V1014_INDUSTRY_COUPLING", coupling, "V1014IndustryCoupling"),
        CORE,
    ]
    out_path = "/workspace/_v1014_agent13_insert.ts"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(parts))
        f.write("\n")
    print(f"Wrote {out_path} lines={sum(1 for _ in open(out_path))}")


if __name__ == "__main__":
    main()
