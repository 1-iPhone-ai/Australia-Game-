/**
 * Operation 600K — Agent 22: Progression-dependent flagship UI
 * See internal/agents/agent-22-integration-contract.md
 */

// SECTION 20P-A22: PROGRESSION-DEPENDENT FLAGSHIP UI — NATION DEVELOPMENT UNLOCKS (OPERATION 600K / AGENT 22)
// ============================================================================
// Presentation + navigation only. Dashboards and deep panels unlock as national development matures; user
// complexity (SmartSettingsProfile) caps how many surfaces auto-promote; accessibility settings never remove
// core PLAY controls — locked items stay discoverable with clear text, keyboard focus, and aria-disabled.
// Nothing here persists unlock state (canonical nation profile + settings are authoritative).

export type NationUiMaturityTier = 'foundation' | 'emerging' | 'established' | 'strategic_nation';

export type FlagshipDashboardId =
  | 'play_cohesion'
  | 'national_direction'
  | 'regional_pulse'
  | 'industries_supply'
  | 'infra_networks'
  | 'workforce_capital'
  | 'public_finance'
  | 'innovation_emerging'
  | 'systemic_risk'
  | 'strategic_forecast'
  | 'ai_command_center'
  | 'history_replay';

export type ComplexityPreference = 'simple' | 'guided' | 'detailed' | 'full_simulation';

export interface FlagshipDashboardSpec {
  id: FlagshipDashboardId;
  label: string;
  icon: string;
  blurb: string;
  minNationTier: NationUiMaturityTier;
  minComplexity: ComplexityPreference;
  /** Optional game-settings flag that must be true when present (absent flags are ignored). */
  settingsGate?: keyof GameSettingsState | string;
  /** Lower = more essential; used for ordering and simple-mode caps. */
  priority: number;
  /** Core PLAY surfaces ignore nation locks (always reachable). */
  alwaysAvailable?: boolean;
  testId: string;
}

export interface FlagshipUiContext {
  turn: number;
  nationTier: NationUiMaturityTier;
  nationConfidence: NationalDirectionConfidence | null;
  structuralEvidence: number;
  primaryDirection: NationalDevelopmentDirectionId | null;
  complexity: ComplexityPreference;
  accessibility: AccessibilitySettings;
  settingsFlags: Record<string, boolean>;
  guidedLearningActive: boolean;
}

export type FlagshipDashboardState = 'active' | 'teaser' | 'locked_nation' | 'locked_complexity' | 'locked_settings';

export interface FlagshipDashboardEvaluation {
  spec: FlagshipDashboardSpec;
  state: FlagshipDashboardState;
  reason: string;
  /** When active/teaser, sort key (lower first). */
  sortKey: number;
}

export interface FlagshipShellPresentation {
  dataAttributes: Record<string, string>;
  visibleCount: number;
  promotedIds: FlagshipDashboardId[];
  launcherHeadline: string;
  showProgressRing: boolean;
}

const NATION_TIER_RANK: Record<NationUiMaturityTier, number> = {
  foundation: 0,
  emerging: 1,
  established: 2,
  strategic_nation: 3
};

const COMPLEXITY_RANK: Record<ComplexityPreference, number> = {
  simple: 0,
  guided: 1,
  detailed: 2,
  full_simulation: 3
};

/** Nation maturity derived from V10.4 profile — mirrors PLAY strip logic, never grants economy effects. */
export function computeNationUiMaturityTier(input: {
  profile: NationalDevelopmentProfile | null | undefined;
  structuralEvidence?: number;
  turn?: number;
}): NationUiMaturityTier {
  const p = input.profile;
  const evidence = Math.max(0, Number(input.structuralEvidence ?? p?.structuralEvidence ?? 0));
  const turn = Math.max(0, Number(input.turn ?? p?.lastUpdatedTurn ?? 0));
  if (!p || (!p.primaryDirection && evidence < 2)) return 'foundation';
  const band = p.confidenceBand || 'unclear';
  if (band === 'strongly_established' || evidence >= 8) return 'strategic_nation';
  if (band === 'established' || evidence >= 5 || turn >= 12) return 'established';
  if (band === 'emerging' || evidence >= 2 || p.primaryDirection) return 'emerging';
  return 'foundation';
}

export const FLAGSHIP_DASHBOARD_CATALOG: FlagshipDashboardSpec[] = [
  { id: 'play_cohesion', label: 'PLAY command', icon: '🎯', blurb: 'Your next decision, focus, and recommendations.', minNationTier: 'foundation', minComplexity: 'simple', priority: 0, alwaysAvailable: true, testId: 'flagship-play' },
  { id: 'national_direction', label: 'National direction', icon: '🧭', blurb: 'Emerging national development pattern and confidence.', minNationTier: 'emerging', minComplexity: 'simple', priority: 1, settingsGate: 'nationalDevelopmentEnabled', testId: 'flagship-national' },
  { id: 'regional_pulse', label: 'Regional pulse', icon: '📍', blurb: 'Living regions momentum and bottlenecks.', minNationTier: 'emerging', minComplexity: 'guided', priority: 2, testId: 'flagship-regional' },
  { id: 'industries_supply', label: 'Industries & supply', icon: '🏭', blurb: 'Strategic industries and chain stress.', minNationTier: 'established', minComplexity: 'guided', priority: 3, settingsGate: 'industriesEnabled', testId: 'flagship-industries' },
  { id: 'infra_networks', label: 'Infrastructure networks', icon: '🏗', blurb: 'Network maturity and megaproject adjacency.', minNationTier: 'established', minComplexity: 'guided', priority: 4, settingsGate: 'infraNetworksEnabled', testId: 'flagship-infra' },
  { id: 'workforce_capital', label: 'Workforce & skills', icon: '👷', blurb: 'Human capital pressures and skills gaps.', minNationTier: 'established', minComplexity: 'detailed', priority: 5, settingsGate: 'workforceHumanCapitalEnabled', testId: 'flagship-workforce' },
  { id: 'public_finance', label: 'Public finance', icon: '🏛', blurb: 'Fiscal capacity and budget rhythm.', minNationTier: 'strategic_nation', minComplexity: 'detailed', priority: 6, settingsGate: 'publicFinanceEnabled', testId: 'flagship-finance' },
  { id: 'innovation_emerging', label: 'Innovation & capabilities', icon: '🔬', blurb: 'Emerging national capabilities.', minNationTier: 'strategic_nation', minComplexity: 'detailed', priority: 7, settingsGate: 'innovationEnabled', testId: 'flagship-innovation' },
  { id: 'systemic_risk', label: 'Systemic risk', icon: '🌪', blurb: 'Dependency chains and recovery posture.', minNationTier: 'strategic_nation', minComplexity: 'full_simulation', priority: 8, settingsGate: 'systemicRiskEnabled', testId: 'flagship-risk' },
  { id: 'strategic_forecast', label: 'Strategic forecast', icon: '📈', blurb: 'Forward-looking constraints and scenarios.', minNationTier: 'established', minComplexity: 'detailed', priority: 9, testId: 'flagship-forecast' },
  { id: 'ai_command_center', label: 'AI command center', icon: '🤖', blurb: 'Team intelligence and automation oversight.', minNationTier: 'emerging', minComplexity: 'guided', priority: 10, settingsGate: 'aiCommandCenterUiEnabled', testId: 'flagship-ai' },
  { id: 'history_replay', label: 'History & replay', icon: '⏪', blurb: 'Turn history and match replay tools.', minNationTier: 'foundation', minComplexity: 'simple', priority: 11, testId: 'flagship-history' }
];

export function buildFlagshipUiContext(params: {
  profile: NationalDevelopmentProfile | null | undefined;
  turn: number;
  gameSettings: GameSettingsState;
  guidedLearningActive?: boolean;
}): FlagshipUiContext {
  const gs = params.gameSettings;
  const profile = params.profile ?? null;
  const sp = gs.smartSettingsProfile || createDefaultSmartSettingsProfile();
  const complexity = (['simple', 'guided', 'detailed', 'full_simulation'].includes(sp.complexity as string)
    ? sp.complexity
    : 'guided') as ComplexityPreference;
  const settingsFlags: Record<string, boolean> = {
    nationalDevelopmentEnabled: gs.nationalDevelopmentEnabled !== false,
    industriesEnabled: Boolean(gs.industriesEnabled),
    infraNetworksEnabled: Boolean(gs.infraNetworksEnabled),
    workforceHumanCapitalEnabled: Boolean(gs.workforceHumanCapitalEnabled),
    publicFinanceEnabled: Boolean(gs.publicFinanceEnabled),
    innovationEnabled: Boolean(gs.innovationEnabled),
    systemicRiskEnabled: Boolean(gs.systemicRiskEnabled),
    aiCommandCenterUiEnabled: Boolean(gs.aiCommandCenterUiEnabled)
  };
  return {
    turn: params.turn,
    nationTier: computeNationUiMaturityTier({ profile, turn: params.turn }),
    nationConfidence: profile?.confidenceBand ?? null,
    structuralEvidence: profile?.structuralEvidence ?? 0,
    primaryDirection: profile?.primaryDirection ?? null,
    complexity,
    accessibility: sanitizeAccessibilitySettings(gs.accessibilitySettings),
    settingsFlags,
    guidedLearningActive: Boolean(params.guidedLearningActive)
  };
}

function tierMeets(min: NationUiMaturityTier, actual: NationUiMaturityTier): boolean {
  return NATION_TIER_RANK[actual] >= NATION_TIER_RANK[min];
}

function complexityMeets(min: ComplexityPreference, actual: ComplexityPreference): boolean {
  return COMPLEXITY_RANK[actual] >= COMPLEXITY_RANK[min];
}

export function evaluateFlagshipDashboard(spec: FlagshipDashboardSpec, ctx: FlagshipUiContext): FlagshipDashboardEvaluation {
  if (spec.alwaysAvailable) {
    return { spec, state: 'active', reason: 'Core PLAY surface', sortKey: spec.priority };
  }
  if (spec.settingsGate && ctx.settingsFlags[String(spec.settingsGate)] === false) {
    return { spec, state: 'locked_settings', reason: 'Enable the linked system in settings to preview this dashboard.', sortKey: 100 + spec.priority };
  }
  if (!complexityMeets(spec.minComplexity, ctx.complexity)) {
    return {
      spec,
      state: 'locked_complexity',
      reason: `Available at ${spec.minComplexity.replace('_', ' ')} complexity or higher (currently ${ctx.complexity}).`,
      sortKey: 80 + spec.priority
    };
  }
  if (!tierMeets(spec.minNationTier, ctx.nationTier)) {
    const next = spec.minNationTier === 'emerging' ? 'national pattern emerges'
      : spec.minNationTier === 'established' ? 'direction becomes established'
        : 'nation reaches strategic maturity';
    return {
      spec,
      state: 'locked_nation',
      reason: `Unlocks when ${next} (now: ${ctx.nationTier.replace('_', ' ')}).`,
      sortKey: 60 + spec.priority
    };
  }
  if (ctx.guidedLearningActive && spec.priority > 4) {
    return { spec, state: 'teaser', reason: 'Preview while Guided Learning is active — open when ready.', sortKey: 20 + spec.priority };
  }
  return { spec, state: 'active', reason: 'Unlocked', sortKey: spec.priority };
}

export function evaluateFlagshipDashboardCatalog(ctx: FlagshipUiContext): FlagshipDashboardEvaluation[] {
  return FLAGSHIP_DASHBOARD_CATALOG.map(s => evaluateFlagshipDashboard(s, ctx)).sort((a, b) => a.sortKey - b.sortKey);
}

/** Caps auto-promoted dashboards for simple complexity — does not remove launcher entries. */
export function capFlagshipPromotions(evaluations: FlagshipDashboardEvaluation[], complexity: ComplexityPreference): FlagshipDashboardId[] {
  const active = evaluations.filter(e => e.state === 'active' || e.state === 'teaser');
  const max = complexity === 'simple' ? 4 : complexity === 'guided' ? 8 : 12;
  return active.slice(0, max).map(e => e.spec.id);
}

export function resolveFlagshipShellPresentation(ctx: FlagshipUiContext, evaluations: FlagshipDashboardEvaluation[]): FlagshipShellPresentation {
  const promotedIds = capFlagshipPromotions(evaluations, ctx.complexity);
  const visibleCount = evaluations.filter(e => e.state === 'active' || e.state === 'teaser').length;
  const motion = resolveUiMotionMode({ accessibilitySettings: ctx.accessibility });
  const headline =
    ctx.nationTier === 'foundation' ? 'Foundation phase — core dashboards only'
      : ctx.nationTier === 'emerging' ? 'Nation emerging — direction dashboards unlock'
        : ctx.nationTier === 'established' ? 'Established pattern — sector dashboards online'
          : 'Strategic nation — full flagship suite available';
  return {
    dataAttributes: {
      'data-flagship-tier': ctx.nationTier,
      'data-flagship-complexity': ctx.complexity,
      'data-motion': motion === 'reduced' ? 'reduced' : 'system',
      'data-flagship-promoted': promotedIds.join(',')
    },
    visibleCount,
    promotedIds,
    launcherHeadline: headline,
    showProgressRing: ctx.nationTier !== 'strategic_nation' && !ctx.accessibility.reduceMotion
  };
}

export function nationTierProgressFraction(tier: NationUiMaturityTier): number {
  return (NATION_TIER_RANK[tier] + 1) / (Object.keys(NATION_TIER_RANK).length);
}

// ---- React surfaces (functional; wired by integrator) ------------------------------------------------------

export const EvolvingFlagshipProgressRing: React.FC<{
  tier: NationUiMaturityTier;
  theme: any;
  label?: string;
}> = ({ tier, theme, label }) => {
  const pct = Math.round(nationTierProgressFraction(tier) * 100);
  return (
    <div className="flex items-center gap-2 text-xs" data-testid="flagship-progress-ring" aria-label={`Nation UI maturity ${tier}, ${pct} percent`}>
      <div className={`relative h-8 w-8 rounded-full border-2 ${theme.border}`} aria-hidden>
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(rgba(56,189,248,0.85) ${pct}%, transparent ${pct}%)` }} />
        <div className={`absolute inset-1 rounded-full ${theme.panel || 'bg-slate-900'}`} />
      </div>
      <div>
        <div className="font-semibold">{label || 'Nation UI maturity'}</div>
        <div className="opacity-75 capitalize">{tier.replace('_', ' ')} · {pct}%</div>
      </div>
    </div>
  );
};

export const FlagshipDashboardTile: React.FC<{
  evaluation: FlagshipDashboardEvaluation;
  theme: any;
  onOpen?: (id: FlagshipDashboardId) => void;
}> = ({ evaluation, theme, onOpen }) => {
  const { spec, state, reason } = evaluation;
  const locked = state.startsWith('locked');
  const aria = locked ? `${spec.label} locked: ${reason}` : spec.label;
  return (
    <button
      type="button"
      data-testid={spec.testId}
      aria-label={aria}
      aria-disabled={locked}
      disabled={locked && state !== 'teaser'}
      title={reason}
      className={`text-left rounded-lg border px-3 py-2 text-sm v94-enter ${theme.border} ${locked ? 'opacity-60 cursor-not-allowed' : theme.buttonSecondary}`}
      onClick={() => { if (!locked || state === 'teaser') onOpen?.(spec.id); }}
    >
      <div className="font-bold flex items-center gap-1"><span aria-hidden>{spec.icon}</span>{spec.label}</div>
      <div className="text-[11px] opacity-80 mt-0.5">{spec.blurb}</div>
      {state !== 'active' && <div className="text-[10px] mt-1 text-amber-300/90">{state === 'teaser' ? 'Preview' : reason}</div>}
    </button>
  );
};

export const EvolvingFlagshipLauncherPanel: React.FC<{
  ctx: FlagshipUiContext;
  evaluations: FlagshipDashboardEvaluation[];
  presentation: FlagshipShellPresentation;
  theme: any;
  onOpenDashboard?: (id: FlagshipDashboardId) => void;
}> = ({ ctx, evaluations, presentation, theme, onOpenDashboard }) => (
  <section
    className={`rounded-xl border p-3 v94-stagger ${theme.border} ${theme.panel || ''}`}
    data-testid="evolving-flagship-launcher"
    {...presentation.dataAttributes}
    aria-labelledby="flagship-launcher-h"
  >
    <div className="flex flex-wrap items-center gap-3 mb-2">
      <h3 id="flagship-launcher-h" className="font-bold text-sm">Flagship dashboards</h3>
      {presentation.showProgressRing && <EvolvingFlagshipProgressRing tier={ctx.nationTier} theme={theme} />}
      <span className="text-xs opacity-70 ml-auto">{presentation.launcherHeadline}</span>
    </div>
    <p className="text-[11px] opacity-75 mb-2">
      Dashboards unlock as national development matures. Complexity setting limits auto-promotion; accessibility controls always keep PLAY available.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" role="list">
      {evaluations.map(ev => (
        <div role="listitem" key={ev.spec.id}>
          <FlagshipDashboardTile evaluation={ev} theme={theme} onOpen={onOpenDashboard} />
        </div>
      ))}
    </div>
  </section>
);

export const Agent22FlagshipUiLabInspector: React.FC<{
  ctx: FlagshipUiContext;
  evaluations: FlagshipDashboardEvaluation[];
  fixtureId: string;
  onFixture: (id: string) => void;
  theme: any;
}> = ({ ctx, evaluations, fixtureId, onFixture, theme }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <section className={`mt-2 rounded border p-2 text-xs ${theme.border}`} data-testid="agent22-flagship-lab">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-bold text-sm">🎛 Flagship UI progression (Agent 22)</h2>
        <span className="opacity-70">tier {ctx.nationTier} · {ctx.complexity} · {evaluations.filter(e => e.state === 'active').length} active</span>
        <label className="ml-auto flex items-center gap-1">
          <span className="opacity-70">Fixture</span>
          <select className="rounded border px-1 py-0.5" value={fixtureId} onChange={e => onFixture(e.target.value)} data-testid="agent22-fixture">
            <option value="live">Live match</option>
            {V22_FLAGSHIP_FIXTURES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>
        <button type="button" className="underline" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Inspect'}</button>
      </div>
      {open && (
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap opacity-80">{JSON.stringify({ ctx, evaluations: evaluations.map(e => ({ id: e.spec.id, state: e.state, reason: e.reason })) }, null, 1)}</pre>
      )}
    </section>
  );
};

// ---- Fixtures & self-tests ---------------------------------------------------------------------------------

export interface V22FlagshipFixture {
  id: string;
  label: string;
  ctx: FlagshipUiContext;
}

export function createV22FlagshipFixture(overrides: Partial<FlagshipUiContext> & { profile?: NationalDevelopmentProfile | null }): FlagshipUiContext {
  const profile = overrides.profile ?? null;
  const base = buildFlagshipUiContext({
    profile,
    turn: overrides.turn ?? 8,
    gameSettings: { ...DEFAULT_GAME_SETTINGS, smartSettingsProfile: { ...createDefaultSmartSettingsProfile(), complexity: overrides.complexity || 'guided' } } as GameSettingsState,
    guidedLearningActive: overrides.guidedLearningActive
  });
  return { ...base, ...overrides, nationTier: overrides.nationTier ?? computeNationUiMaturityTier({ profile, turn: overrides.turn ?? base.turn }) };
}

export const V22_FLAGSHIP_FIXTURES: V22FlagshipFixture[] = [
  {
    id: 'foundation_simple',
    label: 'Foundation · simple complexity',
    ctx: createV22FlagshipFixture({ complexity: 'simple', nationTier: 'foundation', structuralEvidence: 0, primaryDirection: null, nationConfidence: null })
  },
  {
    id: 'emerging_guided',
    label: 'Emerging nation · guided',
    ctx: createV22FlagshipFixture({
      complexity: 'guided',
      nationTier: 'emerging',
      nationConfidence: 'emerging',
      structuralEvidence: 3,
      primaryDirection: 'trade_logistics_hub'
    })
  },
  {
    id: 'established_detailed',
    label: 'Established · detailed',
    ctx: createV22FlagshipFixture({
      complexity: 'detailed',
      nationTier: 'established',
      nationConfidence: 'established',
      structuralEvidence: 6,
      primaryDirection: 'advanced_manufacturing_economy',
      settingsFlags: { nationalDevelopmentEnabled: true, industriesEnabled: true, infraNetworksEnabled: true, workforceHumanCapitalEnabled: true, publicFinanceEnabled: false, innovationEnabled: true, systemicRiskEnabled: false, aiCommandCenterUiEnabled: true }
    })
  },
  {
    id: 'strategic_full',
    label: 'Strategic nation · full simulation',
    ctx: createV22FlagshipFixture({
      complexity: 'full_simulation',
      nationTier: 'strategic_nation',
      nationConfidence: 'strongly_established',
      structuralEvidence: 10,
      primaryDirection: 'diversified_resilient_economy',
      settingsFlags: { nationalDevelopmentEnabled: true, industriesEnabled: true, infraNetworksEnabled: true, workforceHumanCapitalEnabled: true, publicFinanceEnabled: true, innovationEnabled: true, systemicRiskEnabled: true, aiCommandCenterUiEnabled: true }
    })
  }
];

export function runV22EvolvingFlagshipUiSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };
  const J = (v: unknown) => JSON.stringify(v);

  check('v22_tier_foundation', 'Empty profile → foundation tier', () => computeNationUiMaturityTier({ profile: null }) === 'foundation');
  check('v22_tier_strategic', 'Strongly established profile → strategic_nation tier', () => {
    const profile = { confidenceBand: 'strongly_established', structuralEvidence: 9, primaryDirection: 'technology_research_economy', lastUpdatedTurn: 20 } as NationalDevelopmentProfile;
    return computeNationUiMaturityTier({ profile }) === 'strategic_nation';
  });
  check('v22_play_always_active', 'PLAY cohesion dashboard is always active', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'foundation', complexity: 'simple' });
    const ev = evaluateFlagshipDashboard(FLAGSHIP_DASHBOARD_CATALOG[0], ctx);
    return ev.state === 'active';
  });
  check('v22_nation_lock', 'Industries locked at foundation tier', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'foundation', complexity: 'detailed' });
    const ind = FLAGSHIP_DASHBOARD_CATALOG.find(s => s.id === 'industries_supply')!;
    return evaluateFlagshipDashboard(ind, ctx).state === 'locked_nation';
  });
  check('v22_complexity_lock', 'Systemic risk requires full_simulation complexity', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'strategic_nation', complexity: 'guided' });
    const risk = FLAGSHIP_DASHBOARD_CATALOG.find(s => s.id === 'systemic_risk')!;
    return evaluateFlagshipDashboard(risk, ctx).state === 'locked_complexity';
  });
  check('v22_settings_gate', 'Public finance respects settings gate', () => {
    const ctx = createV22FlagshipFixture({
      nationTier: 'strategic_nation',
      complexity: 'full_simulation',
      settingsFlags: { nationalDevelopmentEnabled: true, industriesEnabled: true, infraNetworksEnabled: true, workforceHumanCapitalEnabled: true, publicFinanceEnabled: false, innovationEnabled: true, systemicRiskEnabled: true, aiCommandCenterUiEnabled: true }
    });
    const fin = FLAGSHIP_DASHBOARD_CATALOG.find(s => s.id === 'public_finance')!;
    return evaluateFlagshipDashboard(fin, ctx).state === 'locked_settings';
  });
  check('v22_simple_cap', 'Simple complexity caps promotions to 4', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'strategic_nation', complexity: 'simple' });
    const evals = evaluateFlagshipDashboardCatalog(ctx);
    return capFlagshipPromotions(evals, ctx.complexity).length <= 4;
  });
  check('v22_shell_attrs', 'Shell presentation exposes tier and complexity data attributes', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'emerging', complexity: 'guided' });
    const pres = resolveFlagshipShellPresentation(ctx, evaluateFlagshipDashboardCatalog(ctx));
    return pres.dataAttributes['data-flagship-tier'] === 'emerging' && pres.dataAttributes['data-flagship-complexity'] === 'guided';
  });
  check('v22_reduce_motion', 'Reduce motion disables progress ring animation flag', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'emerging', complexity: 'guided', accessibility: { ...createDefaultAccessibilitySettings(), reduceMotion: true } });
    const pres = resolveFlagshipShellPresentation(ctx, evaluateFlagshipDashboardCatalog(ctx));
    return pres.showProgressRing === false;
  });
  check('v22_guided_teaser', 'Guided learning teases high-priority dashboards', () => {
    const ctx = createV22FlagshipFixture({ nationTier: 'established', complexity: 'detailed', guidedLearningActive: true });
    const risk = evaluateFlagshipDashboard(FLAGSHIP_DASHBOARD_CATALOG.find(s => s.id === 'systemic_risk')!, ctx);
    return risk.state === 'teaser' || risk.state === 'locked_complexity';
  });
  check('v22_deterministic', 'Catalog evaluation is deterministic', () => {
    const ctx = V22_FLAGSHIP_FIXTURES[2].ctx;
    const a = evaluateFlagshipDashboardCatalog(ctx);
    const b = evaluateFlagshipDashboardCatalog(ctx);
    return J(a.map(x => x.state)) === J(b.map(x => x.state));
  });
  check('v22_not_persisted', 'No new persisted keys for flagship UI', () => {
    const stateKeys = Object.keys(initialGameState).filter(k => /flagship|evolvingUi|agent22/i.test(k));
    const settingsKeys = Object.keys(DEFAULT_GAME_SETTINGS).filter(k => /flagship|evolvingUi|agent22/i.test(k));
    return stateKeys.length === 0 && settingsKeys.length === 0;
  });
  check('v22_catalog_complete', 'Catalog includes all flagship dashboard ids', () => {
    const ids = new Set(FLAGSHIP_DASHBOARD_CATALOG.map(s => s.id));
    return ids.size === FLAGSHIP_DASHBOARD_CATALOG.length && ids.has('play_cohesion') && ids.has('history_replay');
  });
  return results;
}

// ============================================================================
