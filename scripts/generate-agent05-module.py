#!/usr/bin/env python3
"""Generate Agent 05 conditional events module for Operation 600K."""
from __future__ import annotations

import textwrap

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
THEMES = [
    "mining",
    "agriculture",
    "energy",
    "renewables",
    "technology",
    "research",
    "trade",
    "logistics",
    "finance",
    "tourism",
    "water",
    "manufacturing",
    "governance",
    "environment",
    "exploration",
]

CRISIS_CATEGORIES = {
    "mining": "economic",
    "agriculture": "environmental",
    "energy": "infrastructure",
    "renewables": "infrastructure",
    "technology": "technological",
    "research": "technological",
    "trade": "infrastructure",
    "logistics": "infrastructure",
    "finance": "economic",
    "tourism": "economic",
    "water": "environmental",
    "manufacturing": "economic",
    "governance": "technological",
    "environment": "environmental",
    "exploration": "economic",
}

SEASONS = {
    "mining": ["Autumn", "Winter"],
    "agriculture": ["Spring", "Summer"],
    "energy": ["Summer", "Winter"],
    "renewables": ["Spring", "Summer"],
    "technology": ["Winter", "Spring"],
    "research": ["Winter", "Spring"],
    "trade": ["Autumn", "Spring"],
    "logistics": ["Autumn", "Winter"],
    "finance": ["Winter", "Spring"],
    "tourism": ["Summer", "Spring"],
    "water": ["Summer", "Autumn"],
    "manufacturing": ["Winter", "Autumn"],
    "governance": ["Spring", "Autumn"],
    "environment": ["Summer", "Spring"],
    "exploration": ["Winter", "Autumn"],
}

SECTORS = {
    "mining": "mining",
    "agriculture": "agriculture",
    "energy": "energy",
    "renewables": "renewables",
    "technology": "technology",
    "research": "research",
    "trade": "trade",
    "logistics": "logistics",
    "finance": "finance",
    "tourism": "tourism",
    "water": "agriculture",
    "manufacturing": "manufacturing",
    "governance": "finance",
    "environment": "renewables",
    "exploration": "mining",
}

lines: list[str] = []

def emit(s: str = "") -> None:
    lines.append(s)


emit("// ============================================================================")
emit("// AGENT 05 — Conditional dynamic events, chains, crises & player responses")
emit("// Operation 600K · V9.4 deep context · simulation-state gated content")
emit("// Branch: cursor/agent-05-dynamic-events-05a4 · Integrator: Agent 25")
emit("// ============================================================================")
emit("")
emit("export const AGENT05_MODULE_VERSION = '1.0.0';")
emit("export const AGENT05_MODULE_ID = 'agent05_conditional_events';")
emit("")
emit("export type Agent05ChainPhase = 'signal' | 'pressure' | 'rupture' | 'recovery';")
emit("export type Agent05ResponseKind = 'crisis_choice' | 'dilemma_choice' | 'defer' | 'escalate';")
emit("")
emit("export interface Agent05ChainDescriptor {")
emit("  chainId: string;")
emit("  region: string;")
emit("  theme: ContentTheme;")
emit("  phases: Agent05ChainPhase[];")
emit("  crisisTemplateId: string;")
emit("  dilemmaTemplateId: string;")
emit("  worldEventTemplateId: string;")
emit("  entryFlag: string;")
emit("  exitFlag: string;")
emit("  simulationKeys: string[];")
emit("}")
emit("")
emit("export interface Agent05PendingPlayerResponse {")
emit("  id: string;")
emit("  chainId: string;")
emit("  templateId: string;")
emit("  regionId: string;")
emit("  kind: Agent05ResponseKind;")
emit("  choiceIds: string[];")
emit("  openedDay: number;")
emit("  expiresDay: number;")
emit("  simulationSnapshot: { day: number; stability: number | null; money: number; activeCrises: number };")
emit("}")
emit("")
emit("export interface Agent05SimulationEventState {")
emit("  version: 1;")
emit("  activeChains: Record<string, { phase: Agent05ChainPhase; startedDay: number; lastTickDay: number }>;")
emit("  pendingResponses: Agent05PendingPlayerResponse[];")
emit("  resolvedChainIds: string[];")
emit("  telemetry: { eligibilityChecks: number; responsesOpened: number; responsesResolved: number };")
emit("}")
emit("")
emit("export function createDefaultAgent05SimulationEventState(): Agent05SimulationEventState {")
emit("  return { version: 1, activeChains: {}, pendingResponses: [], resolvedChainIds: [], telemetry: { eligibilityChecks: 0, responsesOpened: 0, responsesResolved: 0 } };")
emit("}")
emit("")
emit("export function sanitizeAgent05SimulationEventState(raw: unknown): Agent05SimulationEventState {")
emit("  const base = createDefaultAgent05SimulationEventState();")
emit("  if (!raw || typeof raw !== 'object') return base;")
emit("  const r: any = raw;")
emit("  if (r.activeChains && typeof r.activeChains === 'object') {")
emit("    Object.entries(r.activeChains).forEach(([k, v]: any) => {")
emit("      if (v && typeof v === 'object' && typeof v.startedDay === 'number') {")
emit("        base.activeChains[String(k)] = { phase: (['signal', 'pressure', 'rupture', 'recovery'].includes(v.phase) ? v.phase : 'signal') as Agent05ChainPhase, startedDay: Number(v.startedDay) || 1, lastTickDay: Number(v.lastTickDay) || Number(v.startedDay) || 1 };")
emit("      }")
emit("    });")
emit("  }")
emit("  base.pendingResponses = (Array.isArray(r.pendingResponses) ? r.pendingResponses : []).filter((p: any) => p && typeof p.id === 'string').slice(0, 8);")
emit("  base.resolvedChainIds = (Array.isArray(r.resolvedChainIds) ? r.resolvedChainIds : []).map(String).slice(-40);")
emit("  if (r.telemetry && typeof r.telemetry === 'object') {")
emit("    base.telemetry.eligibilityChecks = Math.max(0, Number(r.telemetry.eligibilityChecks) || 0);")
emit("    base.telemetry.responsesOpened = Math.max(0, Number(r.telemetry.responsesOpened) || 0);")
emit("    base.telemetry.responsesResolved = Math.max(0, Number(r.telemetry.responsesResolved) || 0);")
emit("  }")
emit("  return base;")
emit("}")
emit("")
emit("function a05ChainId(region: string, theme: string, idx: number): string {")
emit("  return `a05_${region.toLowerCase()}_${theme}_${idx}`;")
emit("}")
emit("")
emit("function a05PhaseTitle(phase: Agent05ChainPhase, region: string, theme: string): string {")
emit("  const labels: Record<Agent05ChainPhase, string> = { signal: 'Early warning', pressure: 'System pressure', rupture: 'Rupture event', recovery: 'Recovery window' };")
emit("  return `${labels[phase]} — ${region} ${theme}`;")
emit("}")
emit("")

# Generate chain descriptors table
emit("export const AGENT05_CHAIN_DESCRIPTORS: Agent05ChainDescriptor[] = [")
VARIANTS = 5
idx = 0
for region in REGIONS:
    for theme in THEMES:
        for variant in range(VARIANTS):
            cid = f"a05_{region.lower()}_{theme}_v{variant}_{idx}"
            emit(f"  {{ chainId: '{cid}', region: '{region}', theme: '{theme}', phases: ['signal', 'pressure', 'rupture', 'recovery'], crisisTemplateId: '{cid}_crisis', dilemmaTemplateId: '{cid}_dilemma', worldEventTemplateId: '{cid}_pulse', entryFlag: '{cid}_entered', exitFlag: '{cid}_resolved', simulationKeys: ['sector', 'stability', 'crisis', 'season', 'liquidity'] }},")
            idx += 1
emit("];")
emit("")
emit("export const AGENT05_CHAIN_BY_ID: Record<string, Agent05ChainDescriptor> = Object.fromEntries(AGENT05_CHAIN_DESCRIPTORS.map(d => [d.chainId, d]));")
emit("")

# Crisis registry generation using v93Chain pattern - we'll inline factory
emit("const a05Crtpl = (o: Omit<CrisisContentTemplate, 'kind'>): CrisisContentTemplate => ({ kind: 'crisis', ...o });")
emit("")
emit("function a05BuildCrisisChain(desc: Agent05ChainDescriptor): CrisisChain {")
emit("  const catMap: Record<string, CrisisCategory> = { mining: 'economic', agriculture: 'environmental', energy: 'infrastructure', renewables: 'infrastructure', technology: 'technological', research: 'technological', trade: 'infrastructure', logistics: 'infrastructure', finance: 'economic', tourism: 'economic', water: 'environmental', manufacturing: 'economic', governance: 'technological', environment: 'environmental', exploration: 'economic' };")
emit("  const category = catMap[desc.theme] || 'economic';")
emit("  return v93Chain(desc.chainId.replace(/^a05_/, ''), desc.crisisTemplateId.replace(/_crisis$/, '').replace(/^a05_/, ''), `Simulation-gated ${desc.theme} stress in ${desc.region}.`, category, [desc.region], {")
emit("    signal: { title: a05PhaseTitle('signal', desc.region, desc.theme), description: 'Indicators cross thresholds tied to live regional simulation.', turns: 2, effects: [], choices: [{ id: 'prepare', label: 'Fund early mitigation', description: 'Spend before the rupture phase', cost: 1200, actions: 1, stability: 5, p: 0.78 }, { id: 'wait', label: 'Monitor and defer', description: 'Accept higher rupture risk', cost: 0, actions: 0, stability: 0, p: 0.32 }], onFailure: 'pressure' },")
emit("    pressure: { title: a05PhaseTitle('pressure', desc.region, desc.theme), description: 'Secondary systems load; prices and stability drift.', turns: 2, effects: [['investmentYield', 0.97]], choices: [{ id: 'stabilize', label: 'Stabilize exposed assets', description: 'Cap losses before rupture', cost: 1800, actions: 1, stability: 6, p: 0.75 }], onSuccess: 'recovery', onFailure: 'rupture' },")
emit("    rupture: { title: a05PhaseTitle('rupture', desc.region, desc.theme), description: 'The conditional chain fires its main shock.', turns: 3, effects: [['travelCost', 1.2]], choices: [{ id: 'respond', label: 'Execute response playbook', description: 'Canonical crisis choice path', cost: 2200, actions: 1, stability: 8, p: 0.82 }], onSuccess: 'recovery', onFailure: 'recovery' },")
emit("    recovery: { title: a05PhaseTitle('recovery', desc.region, desc.theme), description: 'Recovery contracts and standing opportunities open.', turns: 3, effects: [], choices: [{ id: 'rebuild', label: 'Fund recovery program', description: 'Sets exit flag for chain memory', cost: 1500, actions: 1, stability: 5, p: 0.9 }] }")
emit("  }, ['signal', 'pressure', 'rupture', 'recovery']);")
emit("}")
emit("")

emit("export const AGENT05_CRISIS_CONTENT_REGISTRY: CrisisContentTemplate[] = AGENT05_CHAIN_DESCRIPTORS.map(desc => a05Crtpl({")
emit("  id: desc.crisisTemplateId,")
emit("  title: `${desc.region} ${desc.theme} conditional chain`,")
emit("  summary: `Multi-phase crisis unlocked when ${desc.region} simulation crosses ${desc.theme} thresholds.`,")
emit("  category: 'economic',")
emit("  regions: [desc.region],")
emit("  themes: [desc.theme],")
emit("  roles: ['crisis', 'stability'],")
emit("  rarity: 'uncommon',")
emit("  cooldownDays: 22,")
emit("  requires: [{ k: 'no_crisis_here' }, { k: 'day_min', day: 4 }, { k: 'no_flag', key: desc.exitFlag }],")
emit("  excludes: [{ k: 'flag', key: desc.entryFlag, value: true }],")
emit("  chain: a05BuildCrisisChain(desc)")
emit("}));")
emit("")

# Per-descriptor requires customization - need to fix the map to include proper requires per theme
# Regenerate crisis registry with explicit entries for better simulation ties

emit("// --- Per-chain simulation gates (sector / season / stability) ---")
emit("const AGENT05_CRISIS_REQUIRES: Record<string, ContentReq[]> = {")
for region in REGIONS:
    for theme in THEMES:
        cid = f"a05_{region.lower()}_{theme}"
        # find idx - actually we used idx in loop
        pass

# Rebuild with indexed loop in python
idx = 0
for region in REGIONS:
    for theme in THEMES:
        for variant in range(VARIANTS):
            tid = f"a05_{region.lower()}_{theme}_v{variant}_{idx}_crisis"
            sector = SECTORS[theme]
            seasons = SEASONS[theme]
            season_str = ", ".join(f"'{s}'" for s in seasons)
            liq = 800 + (idx % 12) * 250
            emit(f"  '{tid}': [{{ k: 'no_crisis_here' }}, {{ k: 'day_min', day: {4 + (idx % 5)} }}, {{ k: 'season', seasons: [{season_str}] }}, {{ k: 'any', of: [{{ k: 'sector', sector: '{sector}', min: {8 + (idx % 12)} }}, {{ k: 'stability_max', value: {72 - (idx % 15)} }}, {{ k: 'liquidity_min', amount: {liq} }}] }}],")
            idx += 1
emit("};")
emit("")

emit("export const AGENT05_CRISIS_CONTENT_REGISTRY_V2: CrisisContentTemplate[] = AGENT05_CHAIN_DESCRIPTORS.map(desc => {")
emit("  const reqs = AGENT05_CRISIS_REQUIRES[desc.crisisTemplateId] || [{ k: 'no_crisis_here' }, { k: 'day_min', day: 5 }];")
emit("  const cat = (CRISIS_CATEGORIES as any)[desc.theme] || 'economic';")
emit("  return a05Crtpl({")
emit("    id: desc.crisisTemplateId,")
emit("    title: `${desc.region} ${desc.theme} conditional chain`,")
emit("    summary: `Simulation-gated crisis chain for ${desc.theme} stress in ${desc.region}.`,")
emit("    category: cat as CrisisCategory,")
emit("    regions: [desc.region],")
emit("    themes: [desc.theme],")
emit("    roles: ['crisis', 'stability'],")
emit("    rarity: idxMod(desc.chainId) === 0 ? 'rare' : 'uncommon',")
emit("    cooldownDays: 18 + (idxMod(desc.chainId) % 10),")
emit("    requires: reqs,")
emit("    chain: a05BuildCrisisChain(desc)")
emit("  });")
emit("});")
emit("function idxMod(chainId: string): number { let h = 0; for (let i = 0; i < chainId.length; i++) h = (h * 31 + chainId.charCodeAt(i)) >>> 0; return h % 17; }")
emit("")

# Dilemma registry
emit("const a05Dtpl = (o: Omit<DilemmaTemplate, 'kind'>): DilemmaTemplate => ({ kind: 'dilemma', ...o });")
emit("")
emit("export const AGENT05_DILEMMA_REGISTRY: DilemmaTemplate[] = [")
idx = 0
for region in REGIONS:
    for theme in THEMES:
        for variant in range(VARIANTS):
            cid = f"a05_{region.lower()}_{theme}_v{variant}_{idx}"
            did = f"{cid}_dilemma"
            sector = SECTORS[theme]
            emit(f"  a05Dtpl({{ id: '{did}', title: '{region} {theme} response fork v{variant}', summary: 'Conditional player response tied to live {theme} simulation in {region} (variant {variant}).', regions: ['{region}'], themes: ['{theme}'], roles: ['crisis', 'stability'], rarity: 'common', cooldownDays: {12 + variant}, conflictType: 'short_vs_long',")
            emit(f"    prompt: 'Simulation telemetry flags {theme} pressure in {region}. Commit resources now or preserve liquidity?',")
            emit(f"    requires: [{{ k: 'day_min', day: {3 + (idx % 4)} }}, {{ k: 'sector', sector: '{sector}', min: {6 + (idx % 10)} }}],")
            emit(f"    choices: [")
            emit(f"      {{ id: 'commit', label: 'Commit regional response', pros: ['Lowers rupture probability', 'Builds standing'], cons: ['Locks cash', 'Delays expansion'], scores: {{ economy: 0, control: 1, stability: 2, longTerm: 1 }}, effects: [{{ k: 'flag', key: '{cid}_entered', value: true }}, {{ k: 'stability', delta: {3 + variant}, turns: 3 }}], nav: null }},")
            emit(f"      {{ id: 'defer', label: 'Defer and monitor', pros: ['Preserves liquidity'], cons: ['Higher crisis risk', 'Rival may capitalize'], scores: {{ economy: 1, control: -1, stability: -1, longTerm: 0 }}, effects: [{{ k: 'flag', key: '{cid}_deferred', value: true }}], nav: null }},")
            emit(f"      {{ id: 'escalate', label: 'Escalate to crisis desk', pros: ['Triggers canonical crisis path'], cons: ['Burns actions', 'Public scrutiny'], scores: {{ economy: -1, control: 2, stability: 1, longTerm: 0 }}, effects: [{{ k: 'flag', key: '{cid}_escalated', value: true }}, {{ k: 'event', eventId: '{cid}_pulse' }}], nav: null }}")
            emit(f"    ] }}),")
            idx += 1
emit("];")
emit("")

# World events
emit("const a05Evtpl = (o: Omit<WorldEventTemplate, 'kind'> & { kind?: 'event' | 'rare' }): WorldEventTemplate => ({ kind: o.kind || 'event', ...o });")
emit("")
emit("export const AGENT05_WORLD_EVENT_REGISTRY: WorldEventTemplate[] = [")
idx = 0
for region in REGIONS:
    for theme in THEMES:
        for variant in range(VARIANTS):
            cid = f"a05_{region.lower()}_{theme}_v{variant}_{idx}"
            eid = f"{cid}_pulse"
            sector = SECTORS[theme]
            seasons = SEASONS[theme]
            season_str = ", ".join(f"'{s}'" for s in seasons)
            mult = 1.05 + (idx % 7) * 0.02
            emit(f"  a05Evtpl({{ id: '{eid}', title: '{region} {theme} simulation pulse v{variant}', summary: 'Short world event when {theme} indicators spike in {region}.', category: 'economic', regions: ['{region}'], themes: ['{theme}'], roles: ['crisis'], rarity: {'rare' if variant == 4 else 'common'}, cooldownDays: {10 + variant}, duration: {2 + (variant % 2)},")
            emit(f"    description: 'Conditional pulse event variant {variant} — sector activity and season gates in {region}.',")
            emit(f"    effect: {{ investmentYieldMultiplier: {mult:.2f} }}, setsFlag: {{ key: '{cid}_pulse', value: true }},")
            emit(f"    requires: [{{ k: 'season', seasons: [{season_str}] }}, {{ k: 'sector', sector: '{sector}', min: {10 + (idx % 8)} }}, {{ k: 'no_flag', key: '{cid}_resolved' }}] }}),")
            idx += 1
emit("];")
emit("")

# Simulation tick + player response
emit(textwrap.dedent("""
export function evaluateAgent05ConditionalTick(
  ctx: ContentContext,
  agentStateIn: Agent05SimulationEventState | null | undefined,
  matchContent: MatchContentState | null,
  gameState: { day?: number; publicStabilityState?: PublicStabilityState; players?: any[]; crisisChainState?: CrisisChainState }
): Agent05SimulationEventState {
  const agentState = sanitizeAgent05SimulationEventState(agentStateIn);
  const day = Number(ctx.day || gameState.day || 1);
  const money = Number(ctx.player?.money || 0);
  const stability = ctx.regions?.NSW?.stability ?? gameState.publicStabilityState?.nationalStability ?? null;
  const activeCrises = (ctx.crises || []).filter(c => c.status === 'active').length;
  agentState.telemetry.eligibilityChecks += 1;
  AGENT05_CHAIN_DESCRIPTORS.forEach(desc => {
    if (agentState.resolvedChainIds.includes(desc.chainId)) return;
    const tpl = CONTENT_TEMPLATE_BY_ID[desc.crisisTemplateId] || AGENT05_CRISIS_CONTENT_REGISTRY_V2.find(t => t.id === desc.crisisTemplateId);
    if (!tpl) return;
    const elig = evaluateTemplateEligibility(tpl, desc.region, ctx, matchContent, true);
    if (!elig.ok) return;
    if (!agentState.activeChains[desc.chainId]) {
      agentState.activeChains[desc.chainId] = { phase: 'signal', startedDay: day, lastTickDay: day };
      agentState.telemetry.responsesOpened += 1;
    } else {
      agentState.activeChains[desc.chainId].lastTickDay = day;
    }
    const hasPending = agentState.pendingResponses.some(p => p.chainId === desc.chainId);
    if (!hasPending && day - (agentState.activeChains[desc.chainId]?.startedDay || day) >= 1) {
      agentState.pendingResponses.push({
        id: `${desc.chainId}_pr_${day}`,
        chainId: desc.chainId,
        templateId: desc.dilemmaTemplateId,
        regionId: desc.region,
        kind: 'dilemma_choice',
        choiceIds: ['commit', 'defer'],
        openedDay: day,
        expiresDay: day + 3,
        simulationSnapshot: { day, stability, money, activeCrises }
      });
    }
  });
  agentState.pendingResponses = agentState.pendingResponses.filter(p => p.expiresDay >= day).slice(0, 8);
  return agentState;
}

export function resolveAgent05PlayerResponse(
  agentStateIn: Agent05SimulationEventState,
  responseId: string,
  choiceId: string,
  matchContent: MatchContentState | null,
  day: number
): { agentState: Agent05SimulationEventState; matchContent: MatchContentState | null; effects: DilemmaEffect[]; error: string | null } {
  const agentState = sanitizeAgent05SimulationEventState(agentStateIn);
  const pending = agentState.pendingResponses.find(p => p.id === responseId);
  if (!pending) return { agentState, matchContent, effects: [], error: 'Unknown Agent05 response' };
  const tpl = DILEMMA_TEMPLATE_BY_ID[pending.templateId] || AGENT05_DILEMMA_REGISTRY.find(t => t.id === pending.templateId);
  if (!tpl) return { agentState, matchContent, effects: [], error: 'Missing dilemma template' };
  const choice = tpl.choices.find(c => c.id === choiceId);
  if (!choice) return { agentState, matchContent, effects: [], error: 'Invalid choice' };
  let st = matchContent;
  if (st) {
    const resolved = resolveContentDilemma(st, choiceId, day, pending.simulationSnapshot.money);
    if (resolved.error) return { agentState, matchContent: st, effects: [], error: resolved.error };
    st = resolved.state;
  }
  agentState.pendingResponses = agentState.pendingResponses.filter(p => p.id !== responseId);
  agentState.telemetry.responsesResolved += 1;
  const desc = AGENT05_CHAIN_BY_ID[pending.chainId];
  if (desc && choiceId === 'commit') agentState.resolvedChainIds.push(desc.chainId);
  if (desc && agentState.activeChains[pending.chainId]) agentState.activeChains[pending.chainId].phase = 'recovery';
  return { agentState, matchContent: st, effects: choice.effects, error: null };
}

export function mergeAgent05IntoContentPlan(plan: ContentDayPlan, ctx: ContentContext, agentState: Agent05SimulationEventState | null | undefined, matchContent: MatchContentState | null, gameState: any): { plan: ContentDayPlan; agentState: Agent05SimulationEventState } {
  const nextAgent = evaluateAgent05ConditionalTick(ctx, agentState, matchContent, gameState || {});
  return { plan, agentState: nextAgent };
}
"""))

# Self tests
emit("export function runAgent05ConditionalSelfTests(): { passed: number; total: number; failures: string[] } {")
emit("  const failures: string[] = [];")
emit("  const ok = (name: string, cond: boolean | string) => { if (cond !== true) failures.push(`${name}: ${cond}`); };")
emit("  ok('descriptors', AGENT05_CHAIN_DESCRIPTORS.length === 600);")
emit("  ok('crises', AGENT05_CRISIS_CONTENT_REGISTRY_V2.length === 600);")
emit("  ok('dilemmas', AGENT05_DILEMMA_REGISTRY.length === 600);")
emit("  ok('events', AGENT05_WORLD_EVENT_REGISTRY.length === 600);")
emit("  ok('unique crisis ids', new Set(AGENT05_CRISIS_CONTENT_REGISTRY_V2.map(t => t.id)).size === 600);")
emit("  const prof = buildMatchContentProfile({ seed: 42, totalDays: 30, themes: ['mining', 'water'] });")
emit("  let st = createMatchContentState(prof, 42, 1);")
emit("  const ctx = contentNeutralContext(10, 30);")
emit("  AGENT05_CRISIS_CONTENT_REGISTRY_V2.slice(0, 5).forEach(t => {")
emit("    const r = evaluateTemplateEligibility(t, t.regions[0], ctx, st, false);")
emit("    ok(`eligibility ${t.id}`, typeof r.ok === 'boolean');")
emit("  });")
emit("  let a05 = createDefaultAgent05SimulationEventState();")
emit("  a05 = evaluateAgent05ConditionalTick(ctx, a05, st, { day: 10 });")
emit("  ok('tick', a05.telemetry.eligibilityChecks >= 600);")
emit("  const total = 7;")
emit("  return { passed: total - failures.length, total, failures };")
emit("}")
emit("")

# Fix CRISIS_CATEGORIES reference in generated TS - use inline map
# Replace broken reference
content = "\n".join(lines)
content = content.replace(
    "  const cat = (CRISIS_CATEGORIES as any)[desc.theme] || 'economic';",
    """  const catMap: Record<string, CrisisCategory> = { mining: 'economic', agriculture: 'environmental', energy: 'infrastructure', renewables: 'infrastructure', technology: 'technological', research: 'technological', trade: 'infrastructure', logistics: 'infrastructure', finance: 'economic', tourism: 'economic', water: 'environmental', manufacturing: 'economic', governance: 'technological', environment: 'environmental', exploration: 'economic' };
  const cat = catMap[desc.theme] || 'economic';"""
)

# Remove duplicate AGENT05_CRISIS_CONTENT_REGISTRY first broken map - keep V2 only
content = content.replace(
    "export const AGENT05_CRISIS_CONTENT_REGISTRY: CrisisContentTemplate[] = AGENT05_CHAIN_DESCRIPTORS.map(desc => a05Crtpl({\n  id: desc.crisisTemplateId,\n  title: `${desc.region} ${desc.theme} conditional chain`,\n  summary: `Multi-phase crisis unlocked when ${desc.region} simulation crosses ${desc.theme} thresholds.`,\n  category: 'economic',\n  regions: [desc.region],\n  themes: [desc.theme],\n  roles: ['crisis', 'stability'],\n  rarity: 'uncommon',\n  cooldownDays: 22,\n  requires: [{ k: 'no_crisis_here' }, { k: 'day_min', day: 4 }, { k: 'no_flag', key: desc.exitFlag }],\n  excludes: [{ k: 'flag', key: desc.entryFlag, value: true }],\n  chain: a05BuildCrisisChain(desc)\n}));\n\n",
    ""
)

out_path = "/workspace/agent05-conditional-events.fragment.tsx"
with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Wrote {out_path} ({len(content.splitlines())} lines)")
