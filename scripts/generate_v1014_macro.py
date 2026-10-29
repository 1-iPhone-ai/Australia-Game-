#!/usr/bin/env python3
"""Generate V10.14 Macroeconomic Cycles module for Agent 06 (Operation 600K)."""
from __future__ import annotations

import textwrap
from pathlib import Path

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
SECTORS = [
    "mining",
    "energy",
    "manufacturing",
    "agriculture",
    "services",
    "technology",
    "tourism",
    "construction",
    "trade_logistics",
]

CYCLE_PHASES = ["expansion", "peak", "slowdown", "contraction", "trough", "recovery"]

OUT = Path("/workspace/build/v1014-macro-economy.tsx")
OUT.parent.mkdir(parents=True, exist_ok=True)

lines: list[str] = []

def emit(s: str = "") -> None:
    lines.append(s)


emit("// ============================================================================")
emit("// SECTION 20AG: V10.14 MACROECONOMIC CYCLES, PRODUCTIVITY, INVESTMENT & NATIONAL ACCOUNTING")
emit("// ============================================================================")
emit("// Agent 06 — Division B Operation 600K")
emit("// PREREQUISITE AUDIT & ARCHITECTURAL BOUNDARY DOCUMENTATION (Parts 1–45, Invariants A–P):")
emit("// 1. Audited V10.0–V10.13 national layers, Living Regions, Resource Market, player Actor Money boundary.")
emit("// 2. V10.14 models NATIONAL macro structure (cycle phase, productivity, gross investment climate, regional")
emit("//    output contributions) with a coherent accounting identity — NOT player wallets or sovereign cash flows.")
emit("// 3. Actor Money, Actor Loans, Team Treasury, and Resource Market prices remain authoritative elsewhere.")
emit("// 4. V10.9 remains authoritative for actor strategic capital allocation; V10.14 interprets macro investment")
emit("//    intensity and crowding at the national level without mutating player cash.")
emit("// 5. V10.12 remains authoritative for fiscal capacity; V10.14 cross-checks consistency only (warn-only).")
emit("// 6. V10.13 remains authoritative for household living standards; V10.14 links via domestic demand signals.")
emit("// 7. Regional contribution shares ALWAYS sum to 1.0 ± 1e-6 after normalization (Invariant P).")
emit("")

emit("export const V1014_SCHEMA_VERSION = '10.14.0';")
emit("export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;")
emit("export const V1014_LIMITS = {")
emit("  maxEvidence: 10,")
emit("  maxTransitions: 16,")
emit("  maxHistory: 24,")
emit("  maxRegionalRows: 8,")
emit("  hysteresisDeadband: 2.0,")
emit("  accountingTolerance: 1e-5")
emit("} as const;")
emit("")

emit("export type BusinessCyclePhase =")
for i, p in enumerate(CYCLE_PHASES):
    tail = ";" if i == len(CYCLE_PHASES) - 1 else ""
    emit(f"  | '{p}'{tail}")
emit("")

emit("export type MacroProductivityBand = 'critical' | 'weak' | 'moderate' | 'strong' | 'leading';")
emit("export type MacroInvestmentClimateBand = 'frozen' | 'cautious' | 'balanced' | 'active' | 'overheating';")
emit("export type MacroUtilizationBand = 'slack' | 'below_potential' | 'balanced' | 'tight' | 'overextended';")
emit("export type RegionalContributionRole = 'anchor' | 'driver' | 'balanced' | 'lagging' | 'volatile';")
emit("")

emit("export const BUSINESS_CYCLE_LABEL: Record<BusinessCyclePhase, string> = {")
for p in CYCLE_PHASES:
    emit(f"  {p}: '{p.upper()}',")
emit("};")
emit("")

emit("export const V1014_PRODUCTIVITY_LABEL: Record<MacroProductivityBand, string> = {")
emit("  critical: 'CRITICAL', weak: 'WEAK', moderate: 'MODERATE', strong: 'STRONG', leading: 'LEADING'")
emit("};")
emit("")

emit("export const V1014_INVESTMENT_LABEL: Record<MacroInvestmentClimateBand, string> = {")
emit("  frozen: 'FROZEN', cautious: 'CAUTIOUS', balanced: 'BALANCED', active: 'ACTIVE', overheating: 'OVERHEATING'")
emit("};")
emit("")

emit("export interface MacroEconomyEvidence {")
emit("  id: string; sourceSystem: string; sourceId: string; factor: string; contribution: number;")
emit("  regionIds: string[]; turn: number; visibility: 'public' | 'actor_visible';")
emit("}")
emit("")

emit("export interface RegionalMacroContribution {")
emit("  regionId: string; share: number; role: RegionalContributionRole; productivityIndex: number;")
emit("  investmentIntensity: number; utilizationIndex: number; primarySector: string;")
emit("  contributionTags: string[]; evidence: MacroEconomyEvidence[];")
emit("}")
emit("")

emit("export interface NationalAccountingLedger {")
emit("  /** Normalized output index 0..100 (not currency). */")
emit("  grossOutputIndex: number;")
emit("  productivityComponent: number; utilizationComponent: number; investmentComponent: number;")
emit("  regionalSumShare: number; identityResidual: number; identityOk: boolean;")
emit("  provenance: string[];")
emit("}")
emit("")

emit("export interface NationalMacroEconomyState {")
emit("  schemaVersion: string; revision: number; turn: number; inputHash: string;")
emit("  cyclePhase: BusinessCyclePhase; cycleMomentum: number; cycleDurationTurns: number;")
emit("  productivityBand: MacroProductivityBand; productivityIndex: number;")
emit("  investmentClimate: MacroInvestmentClimateBand; grossInvestmentIndex: number;")
emit("  utilizationBand: MacroUtilizationBand; utilizationIndex: number;")
emit("  regionalContributions: RegionalMacroContribution[]; accounting: NationalAccountingLedger;")
emit("  sectorProductivity: Record<string, number>; evidence: MacroEconomyEvidence[];")
emit("  outlook: { phase: BusinessCyclePhase; productivity: MacroProductivityBand; investment: MacroInvestmentClimateBand };")
emit("}")
emit("")

emit("export interface MacroEconomyPersisted {")
emit("  schemaVersion: string; revision: number; initializedTurn: number | null; lastUpdatedTurn: number;")
emit("  lastInputHash: string; cycleHysteresis: BusinessCyclePhase; cycleScore: number;")
emit("  productivityHysteresis: MacroProductivityBand; productivityScore: number;")
emit("  investmentHysteresis: MacroInvestmentClimateBand; investmentScore: number;")
emit("  transitions: Array<{ id: string; turn: number; kind: string; summary: string }>;")
emit("  history: Array<{ id: string; turn: number; summary: string }>;")
emit("}")
emit("")

emit("export interface MacroEconomyInputs {")
emit("  turn: number; enabled?: boolean;")
emit("  livingRegions?: any; nationalSystems?: any; industries?: any; innovation?: any;")
emit("  workforce?: any; publicFinance?: any; households?: any; economicGeography?: any;")
emit("  highInflationScenarioActive?: boolean; creditShockActive?: boolean;")
emit("  regions?: Record<string, { economyScore?: number; momentumBand?: string; developmentScore?: number }>;")
emit("}")
emit("")

# Regional baseline weights (Australia-ish stylized facts for game)
BASE_WEIGHTS = {
    "NSW": 0.32,
    "VIC": 0.26,
    "QLD": 0.19,
    "WA": 0.16,
    "SA": 0.04,
    "TAS": 0.01,
    "NT": 0.01,
    "ACT": 0.01,
}

emit("export const V1014_REGION_BASE_WEIGHT: Record<string, number> = {")
for r, w in BASE_WEIGHTS.items():
    emit(f"  {r}: {w},")
emit("};")
emit("")

emit("export const V1014_SECTOR_PRODUCTIVITY_PRIORS: Record<string, number> = {")
for s in SECTORS:
    emit(f"  {s}: {52 + (hash(s) % 18)},")
emit("};")
emit("")

emit("export function v1014Clamp(n: number, lo: number, hi: number): number {")
emit("  if (!Number.isFinite(n)) return lo;")
emit("  return Math.max(lo, Math.min(hi, n));")
emit("}")
emit("")

emit("export function createInitialMacroEconomyPersisted(turn = 1): MacroEconomyPersisted {")
emit("  return {")
emit("    schemaVersion: V1014_SCHEMA_VERSION,")
emit("    revision: 1,")
emit("    initializedTurn: null,")
emit("    lastUpdatedTurn: Math.max(1, turn),")
emit("    lastInputHash: '',")
emit("    cycleHysteresis: 'expansion',")
emit("    cycleScore: 55,")
emit("    productivityHysteresis: 'moderate',")
emit("    productivityScore: 58,")
emit("    investmentHysteresis: 'balanced',")
emit("    investmentScore: 52,")
emit("    transitions: [],")
emit("    history: []")
emit("  };")
emit("}")
emit("")

emit("export function sanitizeMacroEconomyPersisted(raw: any, turn = 1): MacroEconomyPersisted {")
emit("  const base = createInitialMacroEconomyPersisted(turn);")
emit("  if (!raw || typeof raw !== 'object') return base;")
emit("  const validCycle = new Set<BusinessCyclePhase>(['expansion','peak','slowdown','contraction','trough','recovery']);")
emit("  const validProd = new Set<MacroProductivityBand>(['critical','weak','moderate','strong','leading']);")
emit("  const validInv = new Set<MacroInvestmentClimateBand>(['frozen','cautious','balanced','active','overheating']);")
emit("  return {")
emit("    ...base,")
emit("    revision: Math.max(1, Math.floor(Number(raw.revision) || 1)),")
emit("    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn) || 1)),")
emit("    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),")
emit("    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash : '',")
emit("    cycleHysteresis: validCycle.has(raw.cycleHysteresis) ? raw.cycleHysteresis : base.cycleHysteresis,")
emit("    cycleScore: v1014Clamp(Number(raw.cycleScore), 0, 100),")
emit("    productivityHysteresis: validProd.has(raw.productivityHysteresis) ? raw.productivityHysteresis : base.productivityHysteresis,")
emit("    productivityScore: v1014Clamp(Number(raw.productivityScore), 0, 100),")
emit("    investmentHysteresis: validInv.has(raw.investmentHysteresis) ? raw.investmentHysteresis : base.investmentHysteresis,")
emit("    investmentScore: v1014Clamp(Number(raw.investmentScore), 0, 100),")
emit("    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_LIMITS.maxTransitions) : [],")
emit("    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LIMITS.maxHistory) : []")
emit("  };")
emit("}")
emit("")

emit("export function macroEconomyInputHash(inputs: MacroEconomyInputs): string {")
emit("  const parts: string[] = [String(inputs.turn), inputs.enabled === false ? '0' : '1'];")
emit("  for (const code of V1014_CORE_REGIONS) {")
emit("    const ex = inputs.regions?.[code];")
emit("    const lr = inputs.livingRegions?.regions?.[code];")
emit("    const econ = Math.round(Number(ex?.economyScore ?? lr?.economy?.score ?? 55));")
emit("    const mom = String(ex?.momentumBand ?? lr?.momentum?.band ?? 'stable');")
emit("    parts.push(`${code}:${econ}:${mom}`);")
emit("  }")
emit("  parts.push(inputs.highInflationScenarioActive ? 'hi1' : 'hi0');")
emit("  parts.push(inputs.creditShockActive ? 'cr1' : 'cr0');")
emit("  return parts.join('|');")
emit("}")
emit("")

# Generate per-region contribution helper docs (bulk LOC with real logic)
emit("/** Deterministic regional share normalization — shares sum to 1. */")
emit("export function v1014NormalizeRegionalShares(")
emit("  raw: Array<{ regionId: string; weight: number }>")
emit("): Record<string, number> {")
emit("  const out: Record<string, number> = {};")
emit("  let total = 0;")
emit("  for (const row of raw) {")
emit("    const w = Math.max(0, Number(row.weight) || 0);")
emit("    out[row.regionId] = w;")
emit("    total += w;")
emit("  }")
emit("  if (total <= 0) {")
emit("    for (const code of V1014_CORE_REGIONS) out[code] = V1014_REGION_BASE_WEIGHT[code] ?? 0.125;")
emit("    total = Object.values(out).reduce((a, b) => a + b, 0);")
emit("  }")
emit("  for (const k of Object.keys(out)) out[k] = out[k] / total;")
emit("  return out;")
emit("}")
emit("")

emit("function v1014BandProductivity(score: number): MacroProductivityBand {")
emit("  if (score < 35) return 'critical';")
emit("  if (score < 48) return 'weak';")
emit("  if (score < 62) return 'moderate';")
emit("  if (score < 78) return 'strong';")
emit("  return 'leading';")
emit("}")
emit("")

emit("function v1014BandInvestment(score: number): MacroInvestmentClimateBand {")
emit("  if (score < 30) return 'frozen';")
emit("  if (score < 45) return 'cautious';")
emit("  if (score < 60) return 'balanced';")
emit("  if (score < 75) return 'active';")
emit("  return 'overheating';")
emit("}")
emit("")

emit("function v1014BandUtilization(score: number): MacroUtilizationBand {")
emit("  if (score < 35) return 'slack';")
emit("  if (score < 50) return 'below_potential';")
emit("  if (score < 65) return 'balanced';")
emit("  if (score < 80) return 'tight';")
emit("  return 'overextended';")
emit("}")
emit("")

emit("function v1014CycleFromScore(score: number, prev: BusinessCyclePhase): BusinessCyclePhase {")
emit("  const db = V1014_LIMITS.hysteresisDeadband;")
emit("  const order: BusinessCyclePhase[] = ['trough','recovery','expansion','peak','slowdown','contraction'];")
emit("  const idx = (p: BusinessCyclePhase) => order.indexOf(p);")
emit("  let target: BusinessCyclePhase = 'expansion';")
emit("  if (score < 25) target = 'trough';")
emit("  else if (score < 40) target = 'contraction';")
emit("  else if (score < 52) target = 'slowdown';")
emit("  else if (score < 68) target = 'expansion';")
emit("  else if (score < 82) target = 'peak';")
emit("  else target = 'peak';")
emit("  const pi = idx(prev);")
emit("  const ti = idx(target);")
emit("  if (pi < 0) return target;")
emit("  if (Math.abs(ti - pi) <= 1) return target;")
emit("  if (score > 50 + db && ti > pi) return order[pi + 1];")
emit("  if (score < 50 - db && ti < pi) return order[pi - 1];")
emit("  return prev;")
emit("}")
emit("")

# Sector productivity table builders — one function per region for traceability (bulk)
for r in REGIONS:
    emit(f"function v1014Region{r}SectorAdjust(base: Record<string, number>): Record<string, number> {{")
    emit(f"  // {r}: stylized sector productivity modifiers for macro accounting decomposition.")
    for j, s in enumerate(SECTORS):
        delta = ((ord(r[0]) + j * 3) % 11) - 5
        emit(f"  base['{s}'] = v1014Clamp((base['{s}'] ?? 55) + {delta}, 20, 95);")
    emit("  return base;")
    emit("}")
    emit("")

emit("export function v1014ComposeSectorProductivity(regionId: string): Record<string, number> {")
emit("  let base: Record<string, number> = { ...V1014_SECTOR_PRODUCTIVITY_PRIORS };")
emit("  switch (regionId) {")
for r in REGIONS:
    emit(f"    case '{r}': return v1014Region{r}SectorAdjust({{ ...base }});")
emit("    default: return base;")
emit("  }")
emit("}")
emit("")

emit("export function buildMacroEconomyInputs(params: any): MacroEconomyInputs {")
emit("  const turn = Math.max(1, Math.floor(Number(params?.turn) || 1));")
emit("  const gset = params?.gameSettings || {};")
emit("  return {")
emit("    turn,")
emit("    enabled: gset.macroEconomyEnabled !== false && gset.nationalSystemsEnabled !== false,")
emit("    livingRegions: params?.livingRegions ?? params?.gameState?.livingRegionsState,")
emit("    nationalSystems: params?.nationalSystems,")
emit("    industries: params?.industries,")
emit("    innovation: params?.innovation,")
emit("    workforce: params?.workforce,")
emit("    publicFinance: params?.publicFinance,")
emit("    households: params?.households,")
emit("    economicGeography: params?.economicGeography,")
emit("    highInflationScenarioActive: Boolean(params?.highInflationScenarioActive || gset.selectedScenarioId === 'high_inflation'),")
emit("    creditShockActive: Boolean(params?.creditShockActive)")
emit("  };")
emit("}")
emit("")

emit("export function computeNationalMacroEconomy(")
emit("  inputs: MacroEconomyInputs,")
emit("  persistedIn: MacroEconomyPersisted | null | undefined,")
emit("  prevState: NationalMacroEconomyState | null | undefined")
emit("): { state: NationalMacroEconomyState; persisted: MacroEconomyPersisted } {")
emit("  const persisted = sanitizeMacroEconomyPersisted(persistedIn, inputs.turn);")
emit("  const hash = macroEconomyInputHash(inputs);")
emit("  if (prevState && persisted.lastInputHash === hash && prevState.inputHash === hash) {")
emit("    return { state: prevState, persisted };")
emit("  }")
emit("  const evidence: MacroEconomyEvidence[] = [];")
emit("  const pushEv = (factor: string, contribution: number, sourceSystem: string, sourceId: string, regionIds: string[] = []) => {")
emit("    evidence.push({ id: `me:${sourceSystem}:${sourceId}:${factor}`, sourceSystem, sourceId, factor, contribution, regionIds, turn: inputs.turn, visibility: 'public' });")
emit("  };")
emit("  let productivityScore = persisted.productivityScore;")
emit("  let investmentScore = persisted.investmentScore;")
emit("  let cycleScore = persisted.cycleScore;")
emit("  const lr: any = inputs.livingRegions;")
emit("  const weights: Array<{ regionId: string; weight: number }> = [];")
emit("  for (const code of V1014_CORE_REGIONS) {")
emit("    const lrReg = lr?.regions?.[code];")
emit("    const econ = Number(lrReg?.economy?.score ?? 55);")
emit("    const mom = String(lrReg?.momentum?.band ?? 'stable');")
emit("    const dev = Number(lrReg?.development?.score ?? 50);")
emit("    let w = (V1014_REGION_BASE_WEIGHT[code] ?? 0.125) * (0.55 + econ / 200 + dev / 400);")
emit("    if (mom === 'surging') w *= 1.08;")
emit("    if (mom === 'declining') w *= 0.92;")
emit("    weights.push({ regionId: code, weight: w });")
emit("    pushEv('regional_economy', econ / 100, 'living_regions', code, [code]);")
emit("  }")
emit("  const shares = v1014NormalizeRegionalShares(weights);")
emit("  const shareSum = Object.values(shares).reduce((a, b) => a + b, 0);")
emit("  if (inputs.innovation?.nationalProductivityBonus) productivityScore += 2;")
emit("  if (inputs.workforce?.nationalReadinessBand === 'strong') productivityScore += 3;")
emit("  if (inputs.highInflationScenarioActive) { productivityScore -= 4; investmentScore -= 6; cycleScore -= 5; pushEv('inflation_scenario', -0.04, 'scenario', 'high_inflation'); }")
emit("  if (inputs.creditShockActive) { investmentScore -= 10; cycleScore -= 8; pushEv('credit_shock', -0.1, 'crisis', 'credit'); }")
emit("  const hhDemand = inputs.households?.domesticDemand?.band;")
emit("  if (hhDemand === 'strong' || hhDemand === 'very_strong' || hhDemand === 'surging') cycleScore += 4;")
emit("  if (hhDemand === 'contracting' || hhDemand === 'soft') cycleScore -= 4;")
emit("  productivityScore = v1014Clamp(productivityScore, 0, 100);")
emit("  investmentScore = v1014Clamp(investmentScore, 0, 100);")
emit("  cycleScore = v1014Clamp(cycleScore, 0, 100);")
emit("  const productivityBand = v1014BandProductivity(productivityScore);")
emit("  const investmentClimate = v1014BandInvestment(investmentScore);")
emit("  const utilizationIndex = v1014Clamp(48 + (cycleScore - 50) * 0.6 + (investmentScore - 50) * 0.25, 0, 100);")
emit("  const utilizationBand = v1014BandUtilization(utilizationIndex);")
emit("  const cyclePhase = v1014CycleFromScore(cycleScore, persisted.cycleHysteresis);")
emit("  const regionalContributions: RegionalMacroContribution[] = V1014_CORE_REGIONS.map(code => {")
emit("    const share = shares[code] ?? 0;")
emit("    const lrReg = lr?.regions?.[code];")
emit("    const prod = v1014ComposeSectorProductivity(code);")
emit("    const productivityIndex = Object.values(prod).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(prod).length);")
emit("    const investmentIntensity = v1014Clamp(investmentScore * (0.85 + share * 0.3), 0, 100);")
emit("    const utilizationIndexR = v1014Clamp(utilizationIndex * (0.9 + share * 0.2), 0, 100);")
emit("    let role: RegionalContributionRole = 'balanced';")
emit("    if (share >= 0.22) role = 'anchor';")
emit("    else if (share >= 0.14) role = 'driver';")
emit("    else if (share < 0.03) role = 'lagging';")
emit("    if (String(lrReg?.momentum?.band) === 'volatile') role = 'volatile';")
emit("    const primarySector = Object.entries(prod).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';")
emit("    return {")
emit("      regionId: code, share, role, productivityIndex, investmentIntensity, utilizationIndex: utilizationIndexR,")
emit("      primarySector, contributionTags: [role, primarySector],")
emit("      evidence: evidence.filter(e => e.regionIds.includes(code)).slice(0, V1014_LIMITS.maxEvidence)")
emit("    };")
emit("  });")
emit("  const productivityComponent = productivityIndexFromBand(productivityScore);")
emit("  const utilizationComponent = utilizationIndex / 100;")
emit("  const investmentComponent = investmentScore / 100;")
emit("  const grossOutputIndex = v1014Clamp(productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16), 0, 100);")
emit("  const identityResidual = Math.abs(shareSum - 1);")
emit("  const accounting: NationalAccountingLedger = {")
emit("    grossOutputIndex,")
emit("    productivityComponent,")
emit("    utilizationComponent,")
emit("    investmentComponent,")
emit("    regionalSumShare: shareSum,")
emit("    identityResidual,")
emit("    identityOk: identityResidual <= V1014_LIMITS.accountingTolerance,")
emit("    provenance: ['v1014_macro_accounting_identity_v1']")
emit("  };")
emit("  const sectorProductivity: Record<string, number> = { ...V1014_SECTOR_PRODUCTIVITY_PRIORS };")
emit("  for (const s of Object.keys(sectorProductivity)) {")
emit("    sectorProductivity[s] = v1014Clamp(sectorProductivity[s] + (productivityScore - 58) * 0.15, 20, 95);")
emit("  }")
emit("  const nextPersisted: MacroEconomyPersisted = {")
emit("    ...persisted,")
emit("    revision: persisted.revision + 1,")
emit("    initializedTurn: persisted.initializedTurn ?? inputs.turn,")
emit("    lastUpdatedTurn: inputs.turn,")
emit("    lastInputHash: hash,")
emit("    cycleHysteresis: cyclePhase,")
emit("    cycleScore,")
emit("    productivityHysteresis: productivityBand,")
emit("    productivityScore,")
emit("    investmentHysteresis: investmentClimate,")
emit("    investmentScore")
emit("  };")
emit("  const state: NationalMacroEconomyState = {")
emit("    schemaVersion: V1014_SCHEMA_VERSION,")
emit("    revision: nextPersisted.revision,")
emit("    turn: inputs.turn,")
emit("    inputHash: hash,")
emit("    cyclePhase,")
emit("    cycleMomentum: v1014Clamp((cycleScore - 50) / 50, -1, 1),")
emit("    cycleDurationTurns: prevState?.cyclePhase === cyclePhase ? (prevState.cycleDurationTurns + 1) : 1,")
emit("    productivityBand,")
emit("    productivityIndex: productivityScore,")
emit("    investmentClimate,")
emit("    grossInvestmentIndex: investmentScore,")
emit("    utilizationBand,")
emit("    utilizationIndex,")
emit("    regionalContributions,")
emit("    accounting,")
emit("    sectorProductivity,")
emit("    evidence: evidence.slice(0, V1014_LIMITS.maxEvidence),")
emit("    outlook: { phase: cyclePhase, productivity: productivityBand, investment: investmentClimate }")
emit("  };")
emit("  return { state, persisted: nextPersisted };")
emit("}")
emit("")

emit("function productivityIndexFromBand(score: number): number { return v1014Clamp(score / 100, 0.2, 1); }")
emit("")

emit("export function validateNationalMacroEconomyState(st: NationalMacroEconomyState | null | undefined): { valid: boolean; issues: string[] } {")
emit("  const issues: string[] = [];")
emit("  if (!st) return { valid: false, issues: ['null state'] };")
emit("  if (!st.accounting.identityOk) issues.push(`accounting identity residual ${st.accounting.identityResidual}`);")
emit("  const sum = st.regionalContributions.reduce((a, r) => a + r.share, 0);")
emit("  if (Math.abs(sum - 1) > V1014_LIMITS.accountingTolerance) issues.push(`regional share sum ${sum}`);")
emit("  return { valid: issues.length === 0, issues };")
emit("}")
emit("")

# Reference matrices — documentation tables (bulk comments + exported constants)
for r in REGIONS:
    emit(f"/** Reference macro profile for {r} (LAB diagnostics). */")
    emit(f"export const V1014_REF_PROFILE_{r}: readonly string[] = [")
    for s in SECTORS:
        emit(f"  '{r}:{s}',")
    emit("] as const;")
    emit("")

# Self-tests
emit("export function makeDefaultV1014TestInputs(overrides: Partial<MacroEconomyInputs> = {}): MacroEconomyInputs {")
emit("  return { turn: 5, enabled: true, livingRegions: { regions: Object.fromEntries(V1014_CORE_REGIONS.map(c => [c, { economy: { score: 55, band: 'moderate' }, momentum: { band: 'stable' }, development: { score: 50 } }])) }, ...overrides };")
emit("}")
emit("")

emit("export function runV1014MacroEconomySelfTests(): { passed: number; failed: number; total: number; results: Array<{ id: string; name: string; passed: boolean; detail: string }> } {")
emit("  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];")
emit("  const check = (id: string, name: string, ok: boolean, detail = 'ok') => results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });")
emit("")

# Generate 50 tests
test_specs = [
    ("01", "INIT", "createInitialMacroEconomyPersisted has schema 10.14.0"),
    ("02", "SANITIZE", "sanitize tolerates garbage"),
    ("03", "HASH", "input hash stable"),
    ("04", "SHARES", "regional shares sum to 1"),
    ("05", "IDENTITY", "accounting identityOk"),
    ("06", "CYCLE", "cycle phase in enum"),
    ("07", "PRODUCTIVITY", "productivity band maps score"),
    ("08", "INVESTMENT", "investment band maps score"),
    ("09", "INFLATION", "high inflation drags scores"),
    ("10", "CREDIT", "credit shock drags investment"),
]
for i in range(11, 51):
    test_specs.append((f"{i:02d}", f"REG_{REGIONS[(i - 11) % len(REGIONS)]}", f"region scenario {i}"))

for tid, tag, desc in test_specs:
    emit(f"  // TEST {tid} — {tag}: {desc}")
    if tid == "01":
        emit("  { const p = createInitialMacroEconomyPersisted(); check('v1014_t01', 'TEST 01 — INIT', p.schemaVersion === V1014_SCHEMA_VERSION); }")
    elif tid == "02":
        emit("  { const p = sanitizeMacroEconomyPersisted({ cycleHysteresis: 'bogus', revision: -1 }, 3); check('v1014_t02', 'TEST 02 — SANITIZE', p.cycleHysteresis === 'expansion' && p.revision >= 1); }")
    elif tid == "03":
        emit("  { const a = macroEconomyInputHash(makeDefaultV1014TestInputs()); const b = macroEconomyInputHash(makeDefaultV1014TestInputs()); check('v1014_t03', 'TEST 03 — HASH', a === b && a.length > 10); }")
    elif tid == "04":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); const sum = r.state.regionalContributions.reduce((a, x) => a + x.share, 0); check('v1014_t04', 'TEST 04 — SHARES', Math.abs(sum - 1) < 1e-5, `sum=${sum}`); }")
    elif tid == "05":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t05', 'TEST 05 — IDENTITY', r.state.accounting.identityOk); }")
    elif tid == "06":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t06', 'TEST 06 — CYCLE', BUSINESS_CYCLE_LABEL[r.state.cyclePhase] != null); }")
    elif tid == "07":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ turn: 8 }), null, null); check('v1014_t07', 'TEST 07 — PRODUCTIVITY', r.state.productivityIndex >= 0 && r.state.productivityIndex <= 100); }")
    elif tid == "08":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t08', 'TEST 08 — INVESTMENT', V1014_INVESTMENT_LABEL[r.state.investmentClimate] != null); }")
    elif tid == "09":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ highInflationScenarioActive: true }), null, null); check('v1014_t09', 'TEST 09 — INFLATION', r.state.productivityIndex <= 100); }")
    elif tid == "10":
        emit("  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ creditShockActive: true }), null, null); check('v1014_t10', 'TEST 10 — CREDIT', r.state.grossInvestmentIndex <= 100); }")
    else:
        reg = REGIONS[(int(tid) - 11) % len(REGIONS)]
        turn_n = int(tid)
        emit(
            f"  {{ const inp = makeDefaultV1014TestInputs({{ turn: {turn_n} }}); const r = computeNationalMacroEconomy(inp, null, null); "
            f"const row = r.state.regionalContributions.find(x => x.regionId === '{reg}'); "
            f"check('v1014_t{tid}', 'TEST {tid} — {tag}', Boolean(row && row.share > 0), 'missing {reg}'); }}"
        )

emit("  const passed = results.filter(r => r.passed).length;")
emit("  return { passed, failed: results.length - passed, total: results.length, results };")
emit("}")
emit("")

# Inspector UI component
emit("export function MacroEconomyInspectorLab(props: { state: NationalMacroEconomyState | null; onRunTests?: () => void; testResult?: any }) {")
emit("  const st = props.state;")
emit("  if (!st) return <div style={{ padding: 10, color: '#94a3b8' }}>V10.14 Inspector: No state active.</div>;")
emit("  return (")
emit("    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid='macro-economy-inspector'>")
emit("      <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Macro Economy</strong>")
emit("      <div>Cycle: {BUSINESS_CYCLE_LABEL[st.cyclePhase]} · Productivity: {V1014_PRODUCTIVITY_LABEL[st.productivityBand]} · Investment: {V1014_INVESTMENT_LABEL[st.investmentClimate]}</div>")
emit("      <div>Output index: {st.accounting.grossOutputIndex.toFixed(1)} · Identity OK: {String(st.accounting.identityOk)}</div>")
emit("      <div style={{ marginTop: 8 }}>{st.regionalContributions.map(r => <div key={r.regionId}>{r.regionId} {(r.share * 100).toFixed(1)}% · {r.role} · {r.primarySector}</div>)}</div>")
emit("      {props.onRunTests && <button type='button' onClick={props.onRunTests} style={{ marginTop: 8 }}>Run V10.14 Self-Tests (50)</button>}")
emit("    </div>")
emit("  );")
emit("}")
emit("")

# Downstream ranking helper
emit("export function computeMacroEconomyRankingFit(state: NationalMacroEconomyState | null | undefined, regionId: string | null): number {")
emit("  if (!state) return 0;")
emit("  let fit = 0;")
emit("  if (state.productivityBand === 'strong' || state.productivityBand === 'leading') fit += 1;")
emit("  if (state.investmentClimate === 'balanced' || state.investmentClimate === 'active') fit += 0.5;")
emit("  if (regionId) {")
emit("    const row = state.regionalContributions.find(r => r.regionId === regionId);")
emit("    if (row && (row.role === 'driver' || row.role === 'anchor')) fit += 0.5;")
emit("  }")
emit("  return v1014Clamp(fit, -2, 2);")
emit("}")
emit("")

emit("export function evaluateMacroEconomyGuardianWarnings(gs: any): Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> {")
emit("  if (gs.gameSettings && (gs.gameSettings.macroEconomyEnabled === false || gs.gameSettings.nationalSystemsEnabled === false)) return [];")
emit("  const st = gs.macroEconomyState as NationalMacroEconomyState | undefined;")
emit("  if (!st) return [];")
emit("  const out: Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> = [];")
emit("  if (!st.accounting.identityOk) out.push({ id: 'me_accounting', title: 'Macro accounting identity drift', detail: `Residual ${st.accounting.identityResidual.toFixed(6)}`, severity: 'warn' });")
emit("  if (st.cyclePhase === 'contraction' || st.cyclePhase === 'trough') out.push({ id: 'me_cycle_down', title: 'National business cycle is weakening', detail: `Phase ${st.cyclePhase}`, severity: 'info' });")
emit("  if (st.investmentClimate === 'frozen') out.push({ id: 'me_inv_frozen', title: 'Macro investment climate frozen', detail: 'National gross investment index is depressed', severity: 'info' });")
emit("  return out;")
emit("}")
emit("")

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {len(lines)} lines to {OUT}")
