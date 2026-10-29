#!/usr/bin/env python3
"""Generate V10.14 Strategic Decision Architecture block for australia-game-with-ai.tsx"""

from pathlib import Path
import textwrap

OUT = Path("/workspace/v1014-sda.fragment.tsx")

lines: list[str] = []

def emit(s: str = ""):
    lines.append(s)

def section_header():
    emit("// ============================================================================")
    emit("// SECTION 20AG: V10.14 STRATEGIC DECISION ARCHITECTURE — ACTIONS, CHAINS, POLICY TRADE-OFFS")
    emit("// ----------------------------------------------------------------------------")
    emit("// Player-initiated strategic commitments with prerequisites, multi-step decision chains,")
    emit("// explicit policy trade-offs, and consequences wired to V10.0–V10.13 derived state.")
    emit("// Never bypasses legality of canonical actions; adds bounded modifiers + World Reaction events.")
    emit("// Deterministic: identical inputs + persisted memory → identical outcomes.")
    emit("// ============================================================================")
    emit("")
    emit("export const V1014_SCHEMA_VERSION = '10.14.0';")
    emit("")
    emit("export const SDA_LIMITS = {")
    emit("  history: 40, activePolicies: 24, activeChains: 8, modifiers: 32, cooldowns: 80,")
    emit("  chainSteps: 6, evidence: 8, catalogPolicies: 96, catalogChains: 24")
    emit("} as const;")
    emit("")
    emit("export type SDADomain = 'economy' | 'infrastructure' | 'industry' | 'diplomacy' | 'workforce' | 'resilience' | 'governance' | 'domestic' | 'strategy';")
    emit("export type SDAPrereqKind = 'min_cash' | 'min_net_worth' | 'network_condition' | 'resilience_band' | 'fiscal_band' | 'state_capacity_band' | 'priority_active' | 'megaproject_stage' | 'project_status' | 'region_control' | 'stability_band' | 'chain_step' | 'policy_not_active' | 'cooldown_clear';")
    emit("export type SDAModifierKind = 'project_cost_pct' | 'project_speed_pct' | 'travel_cost_pct' | 'market_fee_pct' | 'deposit_bonus_pct' | 'stability_delta' | 'faction_goodwill_delta' | 'national_network_delta' | 'fiscal_pressure_delta' | 'workforce_readiness_delta' | 'domestic_demand_delta';")
    emit("export type SDAChainStatus = 'available' | 'in_progress' | 'awaiting_choice' | 'completed' | 'failed' | 'abandoned';")
    emit("export type SDAPolicyStatus = 'available' | 'active' | 'winding_down' | 'expired' | 'blocked';")
    emit("")
    emit("export interface SDAPrerequisite { id: string; kind: SDAPrereqKind; label: string; target?: string; minRank?: number; minValue?: number; regionId?: string; projectId?: string; policyId?: string; chainId?: string; stepIndex?: number }")
    emit("export interface SDATradeoff { benefit: string; cost: string; domains: SDADomain[]; magnitude: 'minor' | 'moderate' | 'major' }")
    emit("export interface SDAModifierDef { kind: SDAModifierKind; value: number; durationTurns: number; regionId?: string; network?: NationalNetworkKind; label: string }")
    emit("export interface SDAPolicyDefinition {")
    emit("  id: string; title: string; summary: string; domain: SDADomain; icon: string;")
    emit("  actionPointCost: number; cashCost: number; cooldownTurns: number; durationTurns: number;")
    emit("  prerequisites: SDAPrerequisite[]; tradeoffs: SDATradeoff[]; modifiers: SDAModifierDef[];")
    emit("  unlocksChainIds?: string[]; tags: string[]")
    emit("}")
    emit("")
    emit("export interface SDAChainStepDef {")
    emit("  index: number; title: string; summary: string; policyId: string | null;")
    emit("  choiceIds?: string[]; autoAdvanceTurns?: number; failIfAbandoned?: boolean")
    emit("}")
    emit("export interface SDAChainDefinition {")
    emit("  id: string; title: string; summary: string; domain: SDADomain; icon: string;")
    emit("  prerequisites: SDAPrerequisite[]; steps: SDAChainStepDef[]; completionModifiers: SDAModifierDef[]; tags: string[]")
    emit("}")
    emit("")
    emit("export interface SDAActivePolicy { definitionId: string; actorId: string; startedTurn: number; expiresTurn: number; status: SDAPolicyStatus; modifiers: SDAModifierDef[] }")
    emit("export interface SDAActiveChain { definitionId: string; actorId: string; startedTurn: number; stepIndex: number; status: SDAChainStatus; pendingChoiceId: string | null; history: Array<{ turn: number; note: string }> }")
    emit("export interface SDAHistoryEntry { id: string; turn: number; kind: 'policy_committed' | 'policy_expired' | 'chain_started' | 'chain_advanced' | 'chain_completed' | 'chain_failed' | 'chain_abandoned'; subjectId: string; summary: string; actorId: string }")
    emit("export interface StrategicDecisionArchitecturePersisted {")
    emit("  schemaVersion: typeof V1014_SCHEMA_VERSION; revision: number; lastUpdatedTurn: number;")
    emit("  activePolicies: Record<string, SDAActivePolicy>; activeChains: Record<string, SDAActiveChain>;")
    emit("  cooldowns: Record<string, number>; modifiers: SDAModifierDef[]; history: SDAHistoryEntry[]; inputHash: string")
    emit("}")
    emit("")
    emit("export interface SDAInputs {")
    emit("  turn: number; actorId: string; cash: number; netWorth: number; currentRegion: string | null;")
    emit("  national: NationalSystemsState | null; fiscal: NationalPublicFinanceState | null; stateCapacity: NationalStateCapacityState | null;")
    emit("  priorities: NationalPrioritiesState | null; megaprojects: MegaprojectsPersisted | null; projects: Record<string, InfrastructureProject>;")
    emit("  stability: number; controlledRegions: string[]")
    emit("}")
    emit("")
    emit("export interface SDAEvaluation { definitionId: string; kind: 'policy' | 'chain'; eligible: boolean; blockedReasons: string[]; metPrerequisites: string[]; unmetPrerequisites: SDAPrerequisite[]; tradeoffs: SDATradeoff[] }")
    emit("export interface StrategicDecisionArchitectureState {")
    emit("  turn: number; revision: number; policies: SDAEvaluation[]; chains: SDAEvaluation[]; activePolicyCount: number; activeChainCount: number; dominantDomain: SDADomain | null; summary: string")
    emit("}")
    emit("")
    emit("const sdaR = (v: number, d = 1) => { const p = Math.pow(10, d); return Math.round((Number.isFinite(v) ? v : 0) * p) / p; };")
    emit("const sdaClamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));")
    emit("")
    emit("export function createEmptyStrategicDecisionArchitecturePersisted(): StrategicDecisionArchitecturePersisted {")
    emit("  return { schemaVersion: V1014_SCHEMA_VERSION, revision: 0, lastUpdatedTurn: 0, activePolicies: {}, activeChains: {}, cooldowns: {}, modifiers: [], history: [], inputHash: '' };")
    emit("}")
    emit("")

section_header()

# Generate policy catalog programmatically
DOMAINS = [
    ("economy", "💰", ["fiscal_discipline", "growth_stimulus", "savings_mobilization", "debt_restructure_plan", "export_push", "import_substitution_drive"]),
    ("infrastructure", "🏗", ["corridor_acceleration", "grid_hardening", "digital_backbone", "port_modernization", "water_security_program", "freight_priority"]),
    ("industry", "🏭", ["manufacturing_revival", "mining_efficiency", "agtech_rollout", "research_commercialization_push", "supply_chain_resilience", "industrial_diversification"]),
    ("diplomacy", "🤝", ["trade_mission", "regional_pact", "investment_treaty", "sanctions_relief", "cooperation_summit", "neutral_arbitration"]),
    ("workforce", "👷", ["skills_academy", "migration_fast_track", "apprenticeship_surge", "productivity_compact", "regional_relocation_incentive", "union_mediation"]),
    ("resilience", "🛡", ["emergency_stockpile", "cascade_containment", "recovery_accelerator", "redundancy_mandate", "stress_test_program", "insurance_pool"]),
    ("governance", "🏛", ["institutional_reform", "anti_corruption_drive", "regulatory_sandbox", "transparency_initiative", "delivery_unit", "interagency_fusion"]),
    ("domestic", "🏠", ["affordability_package", "housing_accelerator", "essential_services_guarantee", "regional_living_bonus", "cost_of_living_relief", "community_resilience_fund"]),
]

POLICY_DEFS: list[str] = []
for domain, icon, ids in DOMAINS:
    for i, pid in enumerate(ids):
        title = pid.replace("_", " ").title()
        emit(f"const SDA_POLICY_{pid.upper()}: SDAPolicyDefinition = {{")
        emit(f"  id: '{pid}', title: '{title}', summary: 'Strategic {domain} commitment with explicit costs and delayed benefits tied to national simulation state.', domain: '{domain}', icon: '{icon}',")
        emit(f"  actionPointCost: {1 + (i % 3)}, cashCost: {500 * (1 + i)}, cooldownTurns: {2 + (i % 4)}, durationTurns: {4 + (i % 5)},")
        emit("  prerequisites: [")
        if domain == "economy":
            emit("    { id: 'cash', kind: 'min_cash', label: 'Minimum cash reserves', minValue: 400 },")
        elif domain == "infrastructure":
            emit("    { id: 'ns', kind: 'network_condition', label: 'National freight not critical', target: 'freight', minRank: 3 },")
        elif domain == "resilience":
            emit("    { id: 'res', kind: 'resilience_band', label: 'National resilience at least exposed', minRank: 1 },")
        else:
            emit("    { id: 'stab', kind: 'stability_band', label: 'Public stability moderate', minValue: 35 },")
        emit("  ],")
        emit("  tradeoffs: [")
        emit(f"    {{ benefit: 'Improves {domain} outcomes over {4 + (i % 5)} turns', cost: 'Raises short-term pressure elsewhere', domains: ['{domain}', 'strategy'], magnitude: '{['minor','moderate','major'][i % 3]}' }},")
        emit("  ],")
        emit("  modifiers: [")
        mod_kind = {
            "economy": "deposit_bonus_pct",
            "infrastructure": "project_speed_pct",
            "industry": "project_cost_pct",
            "diplomacy": "faction_goodwill_delta",
            "workforce": "workforce_readiness_delta",
            "resilience": "stability_delta",
            "governance": "fiscal_pressure_delta",
            "domestic": "domestic_demand_delta",
        }[domain]
        val = round(0.05 + 0.02 * i, 2)
        emit(f"    {{ kind: '{mod_kind}', value: {val if 'delta' in mod_kind else -val if mod_kind == 'project_cost_pct' else val}, durationTurns: {4 + (i % 5)}, label: '{title} effect' }},")
        emit("  ],")
        unlock = f"['chain_{domain}_master']" if i == 0 else "[]"
        emit(f"  unlocksChainIds: {unlock},")
        emit(f"  tags: ['{domain}', 'v1014', 'policy']")
        emit("};")
        emit("")
        POLICY_DEFS.append(pid)

emit("export const SDA_POLICY_CATALOG: Record<string, SDAPolicyDefinition> = {")
for pid in POLICY_DEFS:
    emit(f"  {pid}: SDA_POLICY_{pid.upper()},")
emit("};")
emit("export const SDA_POLICY_IDS = Object.keys(SDA_POLICY_CATALOG);")
emit("")

# Chain definitions
for domain, icon, ids in DOMAINS:
    cid = f"chain_{domain}_master"
    emit(f"const SDA_CHAIN_{domain.upper()}_MASTER: SDAChainDefinition = {{")
    emit(f"  id: '{cid}', title: '{domain.title()} Master Chain', summary: 'Multi-step national {domain} program with branching commitments.', domain: '{domain}', icon: '{icon}',")
    emit("  prerequisites: [")
    emit(f"    {{ id: 'policy_seed', kind: 'policy_not_active', label: 'Seed policy available', policyId: '{ids[0]}' }},")
    emit("  ],")
    emit("  steps: [")
    for si, pid in enumerate(ids[:4]):
        choice = "['commit', 'defer']" if si == 1 else "null"
        emit(f"    {{ index: {si}, title: 'Step {si + 1}: {pid.replace('_', ' ').title()}', summary: 'Commit or advance the {pid} policy.', policyId: '{pid}', choiceIds: {choice} }},")
    emit("  ],")
    emit("  completionModifiers: [")
    emit(f"    {{ kind: 'national_network_delta', value: 0.08, durationTurns: 8, network: '{'digital' if domain == 'infrastructure' else 'trade'}', label: '{domain} chain completion' }},")
    emit("  ],")
    emit(f"  tags: ['{domain}', 'chain', 'v1014']")
    emit("};")
    emit("")

emit("export const SDA_CHAIN_CATALOG: Record<string, SDAChainDefinition> = {")
for domain, _, _ in DOMAINS:
    emit(f"  chain_{domain}_master: SDA_CHAIN_{domain.upper()}_MASTER,")
emit("};")
emit("export const SDA_CHAIN_IDS = Object.keys(SDA_CHAIN_CATALOG);")
emit("")

# Prerequisite evaluation engine
emit(textwrap.dedent("""
const NS_COND_RANK_SDA: Record<NationalNetworkCondition, number> = { surplus: 0, healthy: 1, strained: 2, bottlenecked: 3, critical: 4 };
const NS_RES_RANK_SDA: Record<NationalResilienceBand, number> = { fragile: 0, exposed: 1, stable: 2, resilient: 3, highly_resilient: 4 };

function sdaFiscalBandRank(band: string | undefined): number {
  const m: Record<string, number> = { comfortable: 3, stable: 2, strained: 1, critical: 0 };
  return m[String(band || 'stable')] ?? 1;
}
function sdaStateCapBandRank(band: string | undefined): number {
  const m: Record<string, number> = { strong: 3, adequate: 2, strained: 1, overloaded: 0 };
  return m[String(band || 'adequate')] ?? 1;
}

export function evaluateSDAPrerequisite(p: SDAPrerequisite, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): { met: boolean; reason: string } {
  const turn = inp.turn;
  switch (p.kind) {
    case 'min_cash':
      return { met: inp.cash >= (p.minValue ?? 0), reason: inp.cash >= (p.minValue ?? 0) ? 'cash ok' : `Need $${p.minValue} cash (have $${Math.round(inp.cash)})` };
    case 'min_net_worth':
      return { met: inp.netWorth >= (p.minValue ?? 0), reason: inp.netWorth >= (p.minValue ?? 0) ? 'net worth ok' : `Need net worth ${p.minValue}` };
    case 'network_condition': {
      const n = (p.target || 'freight') as NationalNetworkKind;
      const cond = inp.national?.national?.[n]?.condition || 'healthy';
      const rank = NS_COND_RANK_SDA[cond];
      const need = p.minRank ?? 3;
      return { met: rank <= need, reason: rank <= need ? `${n} ${cond}` : `${NATIONAL_NETWORK_LABEL[n]} is ${cond} (too stressed)` };
    }
    case 'resilience_band': {
      const band = inp.national?.national?.resilienceBand || 'stable';
      const rank = NS_RES_RANK_SDA[band];
      return { met: rank >= (p.minRank ?? 1), reason: rank >= (p.minRank ?? 1) ? band : `Resilience ${band} too low` };
    }
    case 'fiscal_band': {
      const band = (inp.fiscal as any)?.load?.band || (inp.fiscal as any)?.summary?.band || 'stable';
      return { met: sdaFiscalBandRank(band) >= (p.minRank ?? 1), reason: `Fiscal ${band}` };
    }
    case 'state_capacity_band': {
      const band = (inp.stateCapacity as any)?.summary?.readinessBand || 'adequate';
      return { met: sdaStateCapBandRank(band) >= (p.minRank ?? 1), reason: `State capacity ${band}` };
    }
    case 'priority_active': {
      const id = p.target || '';
      const active = inp.priorities?.active?.some(x => x.definitionId === id && x.status === 'active');
      return { met: Boolean(active), reason: active ? 'priority active' : 'Required national priority not active' };
    }
    case 'megaproject_stage': {
      const kind = p.target || '';
      const mp = inp.megaprojects?.programs?.[kind];
      const stage = mp?.stage || 'proposed';
      const order = ['proposed', 'committed', 'under_construction', 'partially_operational', 'operational', 'completed'];
      const met = order.indexOf(stage) >= (p.minRank ?? 2);
      return { met, reason: met ? `Megaproject ${stage}` : `Megaproject needs stage ≥ ${p.minRank}` };
    }
    case 'project_status': {
      const proj = p.projectId ? inp.projects[p.projectId] : null;
      const st = proj?.status || 'locked';
      const order = ['locked', 'unlocked', 'under_construction', 'active', 'upgraded'];
      return { met: order.indexOf(st) >= (p.minRank ?? 3), reason: proj ? `${proj.title}: ${st}` : 'Project not found' };
    }
    case 'region_control': {
      const r = p.regionId || 'NSW';
      return { met: inp.controlledRegions.includes(r), reason: inp.controlledRegions.includes(r) ? `Control ${r}` : `Need control of ${r}` };
    }
    case 'stability_band':
      return { met: inp.stability >= (p.minValue ?? 35), reason: inp.stability >= (p.minValue ?? 35) ? 'stability ok' : `Stability ${Math.round(inp.stability)} too low` };
    case 'cooldown_clear': {
      const key = p.target || p.policyId || p.chainId || '';
      const until = persisted?.cooldowns?.[key] ?? 0;
      return { met: until <= turn, reason: until <= turn ? 'cooldown clear' : `Cooldown until turn ${until}` };
    }
    case 'policy_not_active': {
      const pid = p.policyId || p.target || '';
      const active = Object.values(persisted?.activePolicies || {}).some(x => x.definitionId === pid && x.status === 'active');
      return { met: !active, reason: active ? 'Policy already active' : 'available' };
    }
    case 'chain_step': {
      const ch = p.chainId ? persisted?.activeChains?.[p.chainId] : null;
      return { met: Boolean(ch && ch.stepIndex >= (p.stepIndex ?? 0)), reason: ch ? `chain step ${ch.stepIndex}` : 'chain not started' };
    }
    default:
      return { met: true, reason: 'unknown prereq treated as met' };
  }
}

export function evaluateSDAPolicy(def: SDAPolicyDefinition, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): SDAEvaluation {
  const blocked: string[] = [];
  const met: string[] = [];
  const unmet: SDAPrerequisite[] = [];
  def.prerequisites.forEach(pr => {
    const r = evaluateSDAPrerequisite(pr, inp, persisted);
    if (r.met) met.push(r.reason); else { blocked.push(r.reason); unmet.push(pr); }
  });
  const cd = evaluateSDAPrerequisite({ id: 'cd', kind: 'cooldown_clear', label: 'cooldown', target: def.id }, inp, persisted);
  if (!cd.met) { blocked.push(cd.reason); unmet.push({ id: 'cd', kind: 'cooldown_clear', label: cd.reason, target: def.id }); }
  if (inp.cash < def.cashCost) { blocked.push(`Need $${def.cashCost} (have $${Math.round(inp.cash)})`); }
  return { definitionId: def.id, kind: 'policy', eligible: blocked.length === 0, blockedReasons: blocked, metPrerequisites: met, unmetPrerequisites: unmet, tradeoffs: def.tradeoffs };
}

export function evaluateSDAChain(def: SDAChainDefinition, inp: SDAInputs, persisted: StrategicDecisionArchitecturePersisted | null): SDAEvaluation {
  const blocked: string[] = [];
  const met: string[] = [];
  const unmet: SDAPrerequisite[] = [];
  def.prerequisites.forEach(pr => {
    const r = evaluateSDAPrerequisite(pr, inp, persisted);
    if (r.met) met.push(r.reason); else { blocked.push(r.reason); unmet.push(pr); }
  });
  const cd = evaluateSDAPrerequisite({ id: 'cd', kind: 'cooldown_clear', label: 'cooldown', target: def.id }, inp, persisted);
  if (!cd.met) blocked.push(cd.reason);
  const already = Object.values(persisted?.activeChains || {}).some(c => c.definitionId === def.id && c.status === 'in_progress');
  if (already) blocked.push('Chain already in progress');
  return { definitionId: def.id, kind: 'chain', eligible: blocked.length === 0, blockedReasons: blocked, metPrerequisites: met, unmetPrerequisites: unmet, tradeoffs: [] };
}

export function strategicDecisionInputHash(inp: SDAInputs): string {
  const raw = JSON.stringify([inp.turn, Math.round(inp.cash), Math.round(inp.netWorth), inp.currentRegion, inp.controlledRegions.sort().join(','), Math.round(inp.stability),
    inp.national?.inputHash || '', inp.priorities ? inp.priorities.revision : 0, Object.keys(inp.projects).length]);
  let h = 2166136261;
  for (let k = 0; k < raw.length; k++) { h ^= raw.charCodeAt(k); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

export function computeStrategicDecisionArchitecture(inp: SDAInputs, persistedIn: StrategicDecisionArchitecturePersisted | null): { state: StrategicDecisionArchitectureState; persisted: StrategicDecisionArchitecturePersisted } {
  const persisted = persistedIn ? { ...persistedIn, activePolicies: { ...persistedIn.activePolicies }, activeChains: { ...persistedIn.activeChains }, cooldowns: { ...persistedIn.cooldowns }, modifiers: [...(persistedIn.modifiers || [])], history: [...(persistedIn.history || [])] } : createEmptyStrategicDecisionArchitecturePersisted();
  const hash = strategicDecisionInputHash(inp);
  const policies = SDA_POLICY_IDS.map(id => evaluateSDAPolicy(SDA_POLICY_CATALOG[id], inp, persisted));
  const chains = SDA_CHAIN_IDS.map(id => evaluateSDAChain(SDA_CHAIN_CATALOG[id], inp, persisted));
  const activePolicyCount = Object.values(persisted.activePolicies).filter(p => p.status === 'active').length;
  const activeChainCount = Object.values(persisted.activeChains).filter(c => c.status === 'in_progress' || c.status === 'awaiting_choice').length;
  const dom = (Object.values(persisted.activePolicies).map(p => SDA_POLICY_CATALOG[p.definitionId]?.domain).filter(Boolean)[0] || null) as SDADomain | null;
  const state: StrategicDecisionArchitectureState = {
    turn: inp.turn,
    revision: persisted.revision,
    policies,
    chains,
    activePolicyCount,
    activeChainCount,
    dominantDomain: dom,
    summary: activePolicyCount || activeChainCount ? `${activePolicyCount} active policies · ${activeChainCount} chains in flight` : 'No active strategic commitments'
  };
  if (persisted.inputHash !== hash) { persisted.inputHash = hash; persisted.revision += 1; persisted.lastUpdatedTurn = inp.turn; }
  return { state, persisted };
}

export function sanitizeStrategicDecisionArchitecturePersisted(raw: unknown): StrategicDecisionArchitecturePersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as any;
  if (r.schemaVersion !== V1014_SCHEMA_VERSION) return null;
  const ap: Record<string, SDAActivePolicy> = {};
  Object.entries(r.activePolicies && typeof r.activePolicies === 'object' ? r.activePolicies : {}).slice(0, SDA_LIMITS.activePolicies).forEach(([k, v]: [string, any]) => {
    if (!v || typeof v !== 'object' || !SDA_POLICY_CATALOG[v.definitionId]) return;
    ap[k.slice(0, 80)] = { definitionId: v.definitionId, actorId: String(v.actorId || 'player').slice(0, 40), startedTurn: Math.floor(Number(v.startedTurn) || 0), expiresTurn: Math.floor(Number(v.expiresTurn) || 0), status: (['available', 'active', 'winding_down', 'expired', 'blocked'].includes(v.status) ? v.status : 'active') as SDAPolicyStatus, modifiers: Array.isArray(v.modifiers) ? v.modifiers.slice(0, 6) : [] };
  });
  const ac: Record<string, SDAActiveChain> = {};
  Object.entries(r.activeChains && typeof r.activeChains === 'object' ? r.activeChains : {}).slice(0, SDA_LIMITS.activeChains).forEach(([k, v]: [string, any]) => {
    if (!v || typeof v !== 'object' || !SDA_CHAIN_CATALOG[v.definitionId]) return;
    ac[k.slice(0, 80)] = { definitionId: v.definitionId, actorId: String(v.actorId || 'player').slice(0, 40), startedTurn: Math.floor(Number(v.startedTurn) || 0), stepIndex: Math.floor(Number(v.stepIndex) || 0), status: (['available', 'in_progress', 'awaiting_choice', 'completed', 'failed', 'abandoned'].includes(v.status) ? v.status : 'in_progress') as SDAChainStatus, pendingChoiceId: v.pendingChoiceId ? String(v.pendingChoiceId).slice(0, 40) : null, history: Array.isArray(v.history) ? v.history.slice(-SDA_LIMITS.chainSteps) : [] };
  });
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Math.floor(Number(r.revision) || 0),
    lastUpdatedTurn: Math.floor(Number(r.lastUpdatedTurn) || 0),
    activePolicies: ap,
    activeChains: ac,
    cooldowns: Object.fromEntries(Object.entries(r.cooldowns && typeof r.cooldowns === 'object' ? r.cooldowns : {}).slice(0, SDA_LIMITS.cooldowns).map(([k, v]) => [String(k).slice(0, 60), Math.floor(Number(v) || 0)])),
    modifiers: Array.isArray(r.modifiers) ? r.modifiers.slice(0, SDA_LIMITS.modifiers) : [],
    history: Array.isArray(r.history) ? r.history.slice(-SDA_LIMITS.history).map((h: any, i: number) => ({ id: String(h?.id || `h${i}`).slice(0, 80), turn: Math.floor(Number(h?.turn) || 0), kind: h?.kind || 'policy_committed', subjectId: String(h?.subjectId || '').slice(0, 60), summary: String(h?.summary || '').slice(0, 200), actorId: String(h?.actorId || 'player').slice(0, 40) })) : [],
    inputHash: String(r.inputHash || '').slice(0, 32)
  };
}

function sdaNextId(p: StrategicDecisionArchitecturePersisted, prefix: string): string {
  return `${prefix}_${p.revision}_${Object.keys(p.activePolicies).length + Object.keys(p.activeChains).length}`.slice(0, 72);
}

export function commitStrategicPolicyAction(state: CanonicalGameState, actorId: string, policyId: string, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null } {
  const def = SDA_POLICY_CATALOG[policyId];
  if (!def) return { ok: false, reason: 'Unknown policy', persisted: sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) };
  const actor = state.actorsById[actorId] || state.player;
  if (!actor) return { ok: false, reason: 'No actor', persisted: null };
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inp = buildStrategicDecisionInputsFromCanonical(state, actorId);
  const ev = evaluateSDAPolicy(def, inp, persisted);
  if (!ev.eligible) return { ok: false, reason: ev.blockedReasons[0] || 'Blocked', persisted };
  const apCost = def.actionPointCost;
  if (state.gameSettings?.actionLimitsEnabled !== false && getRemainingActionPoints(actor as any, state.gameSettings || DEFAULT_GAME_SETTINGS) < apCost) {
    return { ok: false, reason: 'Not enough action points', persisted };
  }
  if (Number(actor.money) < def.cashCost) return { ok: false, reason: 'Insufficient cash', persisted };
  actor.money = Number(actor.money) - def.cashCost;
  actor.actionsUsedThisTurn = (actor.actionsUsedThisTurn || 0) + apCost;
  const instId = sdaNextId(persisted, 'pol');
  persisted.activePolicies[instId] = { definitionId: policyId, actorId, startedTurn: turn, expiresTurn: turn + def.durationTurns, status: 'active', modifiers: def.modifiers.map(m => ({ ...m })) };
  persisted.modifiers = [...persisted.modifiers, ...def.modifiers.map(m => ({ ...m }))].slice(-SDA_LIMITS.modifiers);
  persisted.cooldowns[policyId] = turn + def.cooldownTurns;
  persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'policy_committed', subjectId: policyId, summary: `Committed ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: def.title, persisted };
}

export function startStrategicDecisionChain(state: CanonicalGameState, actorId: string, chainId: string, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null } {
  const def = SDA_CHAIN_CATALOG[chainId];
  if (!def) return { ok: false, reason: 'Unknown chain', persisted: null };
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inp = buildStrategicDecisionInputsFromCanonical(state, actorId);
  const ev = evaluateSDAChain(def, inp, persisted);
  if (!ev.eligible) return { ok: false, reason: ev.blockedReasons[0] || 'Blocked', persisted };
  const instId = sdaNextId(persisted, 'chn');
  persisted.activeChains[instId] = { definitionId: chainId, actorId, startedTurn: turn, stepIndex: 0, status: 'in_progress', pendingChoiceId: null, history: [{ turn, note: `Started ${def.title}` }] };
  persisted.cooldowns[chainId] = turn + 3;
  persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'chain_started', subjectId: chainId, summary: `Started chain ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: def.title, persisted };
}

export function advanceStrategicDecisionChain(state: CanonicalGameState, actorId: string, chainInstanceId: string, choiceId: string | null, turn: number): { ok: boolean; reason: string; persisted: StrategicDecisionArchitecturePersisted | null; completed: boolean } {
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  const inst = persisted.activeChains[chainInstanceId];
  if (!inst || inst.actorId !== actorId) return { ok: false, reason: 'Chain not found', persisted, completed: false };
  const def = SDA_CHAIN_CATALOG[inst.definitionId];
  if (!def) return { ok: false, reason: 'Unknown chain definition', persisted, completed: false };
  const step = def.steps[inst.stepIndex];
  if (!step) return { ok: false, reason: 'Chain already finished', persisted, completed: false };
  if (choiceId === 'defer') {
    inst.history = [...inst.history, { turn, note: 'Deferred step' }].slice(-SDA_LIMITS.chainSteps);
    persisted.revision += 1;
    (state as any).strategicDecisionArchitecture = persisted;
    return { ok: true, reason: 'Deferred', persisted, completed: false };
  }
  if (step.policyId) {
    const pr = commitStrategicPolicyAction(state, actorId, step.policyId, turn);
    if (!pr.ok) return { ok: false, reason: pr.reason, persisted, completed: false };
    persisted = pr.persisted || persisted;
  }
  inst.stepIndex += 1;
  inst.history = [...inst.history, { turn, note: `Advanced to step ${inst.stepIndex}` }].slice(-SDA_LIMITS.chainSteps);
  let completed = false;
  if (inst.stepIndex >= def.steps.length) {
    inst.status = 'completed';
    persisted.modifiers = [...persisted.modifiers, ...def.completionModifiers.map(m => ({ ...m }))].slice(-SDA_LIMITS.modifiers);
    persisted.history = [...persisted.history, { id: sdaNextId(persisted, 'hist'), turn, kind: 'chain_completed', subjectId: inst.definitionId, summary: `Completed ${def.title}`, actorId }].slice(-SDA_LIMITS.history);
    completed = true;
  } else {
    inst.status = def.steps[inst.stepIndex].choiceIds ? 'awaiting_choice' : 'in_progress';
  }
  persisted.revision += 1;
  (state as any).strategicDecisionArchitecture = persisted;
  return { ok: true, reason: completed ? 'Chain completed' : 'Advanced', persisted, completed };
}

export function tickStrategicDecisionArchitecture(state: CanonicalGameState, turn: number): StrategicDecisionArchitecturePersisted {
  let persisted = sanitizeStrategicDecisionArchitecturePersisted((state as any).strategicDecisionArchitecture) || createEmptyStrategicDecisionArchitecturePersisted();
  Object.values(persisted.activePolicies).forEach(p => {
    if (p.status === 'active' && turn >= p.expiresTurn) p.status = 'expired';
  });
  persisted.modifiers = persisted.modifiers.map(m => ({ ...m, durationTurns: m.durationTurns - 1 })).filter(m => m.durationTurns > 0);
  persisted.revision += 1;
  persisted.lastUpdatedTurn = turn;
  (state as any).strategicDecisionArchitecture = persisted;
  return persisted;
}

export function buildStrategicDecisionInputsFromCanonical(state: CanonicalGameState, actorId: string): SDAInputs {
  const actor = state.actorsById[actorId] || state.player;
  const gs = state.gameSettings || DEFAULT_GAME_SETTINGS;
  const turn = state.turn || 1;
  const projects = (state.infrastructureProjects || {}) as Record<string, InfrastructureProject>;
  const controlled = Object.entries(state.regions || {}).filter(([, r]: [string, any]) => r?.controller === actorId || r?.owner === actorId).map(([c]) => c);
  const netWorth = typeof (actor as any)?.netWorth === 'number' ? (actor as any).netWorth : Number(actor?.money) || 0;
  const stab = Number((state as any).publicStabilityState?.nationalStability) || 50;
  return {
    turn,
    actorId,
    cash: Number(actor?.money) || 0,
    netWorth,
    currentRegion: actor?.currentRegion || null,
    national: (state as any).nationalSystemsSnapshot || null,
    fiscal: (state as any).publicFinanceState || null,
    stateCapacity: (state as any).stateCapacityState || null,
    priorities: (state as any).nationalPrioritiesSnapshot || null,
    megaprojects: sanitizeMegaprojectsPersisted((state as any).megaprojects),
    projects,
    stability: stab,
    controlledRegions: controlled.length ? controlled : ['NSW', 'VIC']
  };
}

export function buildStrategicDecisionInputsLive(params: {
  turn: number; actorId: string; actor: any; national: NationalSystemsState | null; fiscal: any; stateCapacity: any;
  priorities: NationalPrioritiesState | null; megaprojects: MegaprojectsPersisted | null; projects: Record<string, InfrastructureProject>; stability: number; controlledRegions: string[];
}): SDAInputs {
  return {
    turn: params.turn,
    actorId: params.actorId,
    cash: Number(params.actor?.money) || 0,
    netWorth: typeof params.actor?.netWorth === 'number' ? params.actor.netWorth : Number(params.actor?.money) || 0,
    currentRegion: params.actor?.currentRegion || null,
    national: params.national,
    fiscal: params.fiscal,
    stateCapacity: params.stateCapacity,
    priorities: params.priorities,
    megaprojects: params.megaprojects,
    projects: params.projects,
    stability: params.stability,
    controlledRegions: params.controlledRegions
  };
}

/** Downstream: small bounded tie-breaker for infrastructure / project ranking (never legality). */
export function strategicDecisionProjectRankingBonus(persisted: StrategicDecisionArchitecturePersisted | null, projectType: string, regionId: string | null): number {
  if (!persisted) return 0;
  let bonus = 0;
  persisted.modifiers.forEach(m => {
    if (m.kind === 'project_speed_pct') bonus += m.value * 10;
    if (m.kind === 'project_cost_pct') bonus += m.value * 8;
    if (m.kind === 'national_network_delta' && regionId) bonus += m.value * 5;
  });
  Object.values(persisted.activePolicies).filter(p => p.status === 'active').forEach(p => {
    const def = SDA_POLICY_CATALOG[p.definitionId];
    if (!def) return;
    if (def.domain === 'infrastructure' && /rail|port|grid|pipeline|freight|energy|digital/.test(projectType)) bonus += 1.5;
    if (def.domain === 'industry' && /manufacturing|mining|research|agriculture/.test(projectType)) bonus += 1.2;
  });
  return sdaClamp(sdaR(bonus, 2), -4, 4);
}

export function strategicDecisionDepositBonusPct(persisted: StrategicDecisionArchitecturePersisted | null): number {
  if (!persisted) return 0;
  return persisted.modifiers.filter(m => m.kind === 'deposit_bonus_pct').reduce((a, m) => a + m.value, 0);
}

export interface SDADerivedEvent { id: string; turn: number; kind: 'strategic_policy_committed' | 'strategic_chain_completed' | 'strategic_chain_failed'; subjectId: string; text: string; significance: 'meaningful' | 'major'; actorId: string }

export function strategicDecisionToWorldEvent(ev: SDADerivedEvent, day: number, observers: string[]): StrategicWorldEvent {
  return {
    id: `sda_${ev.id}`.slice(0, 80),
    turn: ev.turn,
    day,
    sourceSystem: 'v10.14_strategic_decision_architecture',
    sourceEventId: ev.id,
    actorId: ev.actorId,
    teamId: null,
    kind: ev.kind === 'strategic_chain_completed' ? 'strategy_phase_changed' : 'objective_unblocked',
    subjectType: 'strategy',
    subjectId: ev.subjectId,
    magnitude: ev.significance === 'major' ? 0.85 : 0.55,
    significance: ev.significance,
    visibility: 'public',
    observers,
    evidence: [ev.text],
    before: {},
    after: { subjectId: ev.subjectId },
    delta: {},
    strategicMeaning: ev.text,
    affectedDomains: ['strategy', 'team'],
    tags: ['v1014', 'strategic_decision'],
    layer: 'strategic',
    claimKind: 'fact',
    rootEventId: ev.id,
    depth: 0,
    sequenceIndex: 0
  } as StrategicWorldEvent;
}

export interface StrategicDecisionWorldView { state: StrategicDecisionArchitectureState; persisted: StrategicDecisionArchitecturePersisted | null; inputs: SDAInputs; evaluations: { policies: SDAEvaluation[]; chains: SDAEvaluation[] } }

"""))

# Self tests
emit("export function runV1014StrategicDecisionArchitectureSelfTests(): V9SelfTestResult[] {")
emit("  const results: V9SelfTestResult[] = [];")
emit("  const check = (id: string, name: string, fn: () => boolean | string) => {")
emit("    try { const out = fn(); results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') }); }")
emit("    catch (e) { results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) }); }")
emit("  };")
emit("  const baseState = (): CanonicalGameState => ({")
emit("    turn: 5, day: 5, gameSettings: { ...createDefaultGameSettings(), strategicDecisionArchitectureEnabled: true, nationalSystemsEnabled: true },")
emit("    player: { id: 'player', name: 'Player', money: 8000, currentRegion: 'NSW', actionsUsedThisTurn: 0, teamId: TEAM_PLAYER_ID } as any,")
emit("    actorsById: { player: { id: 'player', money: 8000, currentRegion: 'NSW', actionsUsedThisTurn: 0, teamId: TEAM_PLAYER_ID } } as any,")
emit("    infrastructureProjects: {}, regions: { NSW: { controller: 'player' }, VIC: { controller: 'player' } } as any,")
emit("    publicStabilityState: { nationalStability: 55 } as any,")
emit("    strategicDecisionArchitecture: null")
emit("  } as any);")
emit("")
for i, pid in enumerate(POLICY_DEFS[:24]):
    emit(f"  check('sda_pol_def_{i}', 'Policy catalog includes {pid}', () => Boolean(SDA_POLICY_CATALOG['{pid}']?.id === '{pid}'));")
for domain, _, _ in DOMAINS:
    emit(f"  check('sda_chain_{domain}', 'Chain catalog includes chain_{domain}_master', () => Boolean(SDA_CHAIN_CATALOG['chain_{domain}_master']?.steps?.length >= 2));")
emit("  check('sda_sanitize_null', 'sanitize null → null', () => sanitizeStrategicDecisionArchitecturePersisted(null) === null);")
emit("  check('sda_sanitize_empty', 'sanitize creates valid persisted', () => sanitizeStrategicDecisionArchitecturePersisted(createEmptyStrategicDecisionArchitecturePersisted())?.schemaVersion === V1014_SCHEMA_VERSION);")
emit("  check('sda_commit_policy', 'commit policy deducts cash and writes persisted', () => {")
emit("    const st = baseState();")
emit("    const pid = SDA_POLICY_IDS[0];")
emit("    const r = commitStrategicPolicyAction(st, 'player', pid, 5);")
emit("    const p = sanitizeStrategicDecisionArchitecturePersisted((st as any).strategicDecisionArchitecture);")
emit("    return r.ok && p && Object.keys(p.activePolicies).length === 1 && st.actorsById.player.money < 8000 || JSON.stringify({ ok: r.ok, n: p && Object.keys(p.activePolicies).length });")
emit("  });")
emit("  check('sda_chain_flow', 'start + advance chain progresses', () => {")
emit("    const st = baseState();")
emit("    const cid = SDA_CHAIN_IDS[0];")
emit("    const s = startStrategicDecisionChain(st, 'player', cid, 5);")
emit("    if (!s.ok) return s.reason;")
emit("    const inst = Object.keys((st as any).strategicDecisionArchitecture.activeChains)[0];")
emit("    const a = advanceStrategicDecisionChain(st, 'player', inst, 'commit', 5);")
emit("    return a.ok || a.reason;")
emit("  });")
emit("  check('sda_ranking_bonus_bounded', 'project ranking bonus bounded ±4', () => {")
emit("    const p = createEmptyStrategicDecisionArchitecturePersisted();")
emit("    p.modifiers = Array.from({ length: 20 }, (_, i) => ({ kind: 'project_speed_pct' as SDAModifierKind, value: 0.5, durationTurns: 5, label: 'x' }));")
emit("    const b = strategicDecisionProjectRankingBonus(p, 'freight_rail_upgrade', 'NSW');")
emit("    return b <= 4 && b >= -4 || b;")
emit("  });")
emit("  check('sda_tick_expires', 'tick expires policies', () => {")
emit("    const st = baseState();")
emit("    commitStrategicPolicyAction(st, 'player', SDA_POLICY_IDS[0], 5);")
emit("    tickStrategicDecisionArchitecture(st, 999);")
emit("    const p = sanitizeStrategicDecisionArchitecturePersisted((st as any).strategicDecisionArchitecture);")
emit("    return Boolean(p && Object.values(p.activePolicies).every(x => x.status === 'expired'));")
emit("  });")
emit("  check('sda_reduce_commit', 'reduceGameAction commit_strategic_policy path', () => {")
emit("    const st = baseState();")
emit("    const res = reduceGameAction(st, { type: 'commit_strategic_policy', actorId: 'player', parameters: { policyId: SDA_POLICY_IDS[0] } } as any, { active: true, actorId: 'player' } as any);")
emit("    return res.actionExecuted && sanitizeStrategicDecisionArchitecturePersisted((res.nextState as any).strategicDecisionArchitecture) !== null || 'not executed';")
emit("  });")
emit("  return results;")
emit("}")
emit("")

# UI Component
emit(textwrap.dedent("""
export const StrategicDecisionArchitecturePanel: React.FC<{
  view: StrategicDecisionWorldView | null;
  theme: any;
  onCommitPolicy: (policyId: string) => void;
  onStartChain: (chainId: string) => void;
  onAdvanceChain: (instanceId: string, choiceId: string | null) => void;
}> = ({ view, theme, onCommitPolicy, onStartChain, onAdvanceChain }) => {
  if (!view) return null;
  const { state, persisted, evaluations } = view;
  const activeChains = Object.entries(persisted?.activeChains || {});
  return (
    <section aria-labelledby="sda-panel-h" className={`${theme.card} ${theme.border} border rounded-xl p-4 ${theme.shadow} text-xs space-y-2`} data-testid="sda-panel">
      <h3 id="sda-panel-h" className="font-bold text-sm">🎯 Strategic Decision Architecture</h3>
      <div className="opacity-80">{state.summary} · Turn {state.turn}</div>
      <details open data-testid="sda-policies">
        <summary className="cursor-pointer font-semibold">Policy portfolio ({evaluations.policies.filter(p => p.eligible).length} ready)</summary>
        <div className="max-h-48 overflow-y-auto space-y-1 mt-1">
          {evaluations.policies.slice(0, 24).map(ev => {
            const def = SDA_POLICY_CATALOG[ev.definitionId];
            return (
              <div key={ev.definitionId} className="flex flex-wrap items-center gap-1 border-b border-slate-700/40 pb-1">
                <span>{def?.icon} <b>{def?.title || ev.definitionId}</b></span>
                <span className={ev.eligible ? 'text-emerald-400' : 'text-amber-400'}>{ev.eligible ? 'Ready' : ev.blockedReasons[0] || 'Blocked'}</span>
                {ev.eligible && <button type="button" className="px-1.5 py-0.5 rounded border border-teal-500" onClick={() => onCommitPolicy(ev.definitionId)} data-testid={`sda-commit-${ev.definitionId}`}>Commit</button>}
              </div>
            );
          })}
        </div>
      </details>
      <details data-testid="sda-chains">
        <summary className="cursor-pointer font-semibold">Decision chains</summary>
        {evaluations.chains.map(ev => {
          const def = SDA_CHAIN_CATALOG[ev.definitionId];
          return (
            <div key={ev.definitionId} className="flex flex-wrap gap-1 items-center">
              <span>{def?.icon} {def?.title}</span>
              {ev.eligible && <button type="button" className="underline" onClick={() => onStartChain(ev.definitionId)} data-testid={`sda-start-${ev.definitionId}`}>Start</button>}
            </div>
          );
        })}
        {activeChains.map(([id, ch]) => (
          <div key={id} className="mt-1 p-1 rounded border border-slate-600/50">
            <div>{SDA_CHAIN_CATALOG[ch.definitionId]?.title} — step {ch.stepIndex + 1}/{SDA_CHAIN_CATALOG[ch.definitionId]?.steps.length || '?'}</div>
            <button type="button" className="underline mr-2" onClick={() => onAdvanceChain(id, 'commit')}>Advance</button>
            <button type="button" className="underline opacity-70" onClick={() => onAdvanceChain(id, 'defer')}>Defer</button>
          </div>
        ))}
      </details>
    </section>
  );
};
"""))

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {len(lines)} lines to {OUT}")
