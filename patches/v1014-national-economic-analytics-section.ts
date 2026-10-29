// ============================================================================
// SECTION 20AG: V10.14 NATIONAL ECONOMIC ANALYTICS & KPI SYNTHESIS
// ============================================================================
// Operation 111 · Agent 30 (Economic Analytics Engineer)
// Derived-only analytics: no new persisted gameState fields (save class P0).
// Aggregates private actor liquidity, V10.12 fiscal headroom, and V10.13 living standards into KPIs.

export const V1014_SCHEMA_VERSION = 'v10.14.0';

export type EconomicHealthBand = 'strong' | 'healthy' | 'mixed' | 'stressed' | 'critical';

export type EconomicAnalyticsConstraintSeverity = 'info' | 'warning' | 'critical';

export interface NationalEconomicAnalyticsInputs {
  turn: number;
  day: number;
  enabled: boolean;
  actorId: string;
  spendableCash: number;
  netWorth: number;
  creditScore: number;
  economicPhase: string;
  teamTreasury: number;
  publicFinance: NationalPublicFinanceState | null;
  households: NationalHouseholdEconomyState | null;
}

export interface EconomicAnalyticsKpi {
  id: string;
  label: string;
  valueText: string;
  band?: string;
  trend?: 'up' | 'flat' | 'down';
}

export interface EconomicBindingConstraint {
  id: string;
  system: 'private' | 'fiscal' | 'households' | 'synthesis';
  severity: EconomicAnalyticsConstraintSeverity;
  message: string;
}

export interface NationalEconomicAnalyticsSnapshot {
  schemaVersion: string;
  revision: number;
  enabled: boolean;
  turn: number;
  day: number;
  compositeHealthIndex: number;
  healthBand: EconomicHealthBand;
  privateEconomy: {
    liquidityScore: number;
    creditBand: string;
    economicPhase: string;
    headline: string;
  };
  publicEconomy: {
    fiscalHeadroom: number;
    headroomBand: NationalFiscalPosition['headroomBand'];
    pressure: FiscalPressureBand;
    sustainability: FiscalSustainabilityBand;
    revenueTrend: NationalRevenueCapacity['trend'];
  } | null;
  householdEconomy: {
    prosperity: LivingStandardsBand;
    affordability: AffordabilityBand;
    trajectory: NationalLivingStandardsState['trajectory'];
    domesticDemand: DomesticDemandBand;
  } | null;
  bindingConstraints: EconomicBindingConstraint[];
  kpis: EconomicAnalyticsKpi[];
  headline: string;
  inputHash: string;
}

const clamp01 = (n: number) => Math.max(0, Math.min(100, n));

const bandScore = (band: string, map: Record<string, number>, fallback = 50): number =>
  typeof map[band] === 'number' ? map[band] : fallback;

const PROSPERITY_SCORE: Record<string, number> = {
  fragile: 25,
  weak: 40,
  moderate: 55,
  strong: 72,
  prosperous: 88,
  booming: 95
};

const AFFORDABILITY_SCORE: Record<string, number> = {
  very_affordable: 92,
  healthy: 74,
  tight: 58,
  strained: 38,
  severe_pressure: 20
};

const FISCAL_HEADROOM_SCORE: Record<string, number> = {
  high: 88,
  moderate: 68,
  low: 45,
  critical: 22
};

const FISCAL_PRESSURE_SCORE: Record<FiscalPressureBand, number> = {
  comfortable: 92,
  healthy: 78,
  tight: 58,
  strained: 38,
  critical: 18
};

export function nationalEconomicAnalyticsInputHash(inp: NationalEconomicAnalyticsInputs): string {
  const pf = inp.publicFinance;
  const hh = inp.households;
  return [
    inp.turn,
    inp.day,
    inp.enabled ? 1 : 0,
    inp.actorId,
    Math.round(inp.spendableCash),
    Math.round(inp.netWorth),
    inp.creditScore,
    inp.economicPhase,
    Math.round(inp.teamTreasury),
    pf?.inputHash || 'none',
    hh?.inputHash || 'none'
  ].join('|');
}

export function buildNationalEconomicAnalyticsInputs(params: {
  turn: number;
  day: number;
  nationalSystemsEnabled: boolean;
  player: any;
  gameSettings: any;
  teamTreasury?: number;
  publicFinance: NationalPublicFinanceState | null;
  households: NationalHouseholdEconomyState | null;
}): NationalEconomicAnalyticsInputs {
  const player = params.player || {};
  const spendableCash = Number(player.money || 0);
  const netWorth = Number(player.netWorth ?? spendableCash);
  return {
    turn: params.turn,
    day: params.day,
    enabled: params.nationalSystemsEnabled !== false,
    actorId: String(player.id || 'player'),
    spendableCash,
    netWorth,
    creditScore: Number(player.creditScore ?? calculateCreditScore(player, { day: params.day })),
    economicPhase: String(player.economicPhase || 'compounding'),
    teamTreasury: Number(params.teamTreasury || 0),
    publicFinance: params.publicFinance,
    households: params.households
  };
}

function derivePrivateLiquidityScore(inp: NationalEconomicAnalyticsInputs): number {
  const cashScore = clamp01(Math.log10(Math.max(1, inp.spendableCash + inp.teamTreasury)) * 22);
  const worthScore = clamp01(Math.log10(Math.max(1, inp.netWorth)) * 20);
  const creditScore = clamp01(inp.creditScore);
  let phaseMod = 0;
  if (inp.economicPhase === 'recovery' || inp.economicPhase === 'survival') phaseMod = -12;
  if (inp.economicPhase === 'compounding' || inp.economicPhase === 'expansion') phaseMod = 6;
  return clamp01(Math.round(cashScore * 0.35 + worthScore * 0.25 + creditScore * 0.4 + phaseMod));
}

function deriveCompositeHealth(
  privateScore: number,
  fiscalScore: number | null,
  householdScore: number | null
): { index: number; band: EconomicHealthBand } {
  const weights: number[] = [0.35];
  const scores: number[] = [privateScore];
  if (fiscalScore != null) {
    scores.push(fiscalScore);
    weights.push(0.35);
  }
  if (householdScore != null) {
    scores.push(householdScore);
    weights.push(0.3);
  }
  const wSum = weights.reduce((a, b) => a + b, 0);
  const index = clamp01(
    Math.round(scores.reduce((acc, s, i) => acc + s * (weights[i] / wSum), 0))
  );
  const band: EconomicHealthBand =
    index >= 82 ? 'strong' :
    index >= 68 ? 'healthy' :
    index >= 50 ? 'mixed' :
    index >= 32 ? 'stressed' : 'critical';
  return { index, band };
}

function deriveBindingConstraints(
  inp: NationalEconomicAnalyticsInputs,
  privateScore: number,
  pf: NationalPublicFinanceState | null,
  hh: NationalHouseholdEconomyState | null
): EconomicBindingConstraint[] {
  const out: EconomicBindingConstraint[] = [];
  if (privateScore < 35) {
    out.push({
      id: 'bind_private_liquidity',
      system: 'private',
      severity: privateScore < 22 ? 'critical' : 'warning',
      message: 'Private liquidity and credit headroom are the binding constraint on tactical investments.'
    });
  }
  if (pf) {
    const headroom = pf.fiscalPosition.fiscalHeadroom;
    const pressure = pf.fiscalPosition.pressure;
    if (pressure === 'critical' || pressure === 'strained' || headroom < 18) {
      out.push({
        id: 'bind_fiscal_capacity',
        system: 'fiscal',
        severity: pressure === 'critical' || headroom < 10 ? 'critical' : 'warning',
        message: 'National fiscal headroom (V10.12) is limiting simultaneous public programs.'
      });
    }
  }
  if (hh) {
    const aff = hh.national.affordability;
    const housing = hh.national.housingPressure;
    if (aff === 'severe_pressure' || housing === 'severe' || housing === 'high') {
      out.push({
        id: 'bind_household_affordability',
        system: 'households',
        severity: aff === 'severe_pressure' || housing === 'severe' ? 'critical' : 'warning',
        message: 'Household affordability and housing pressure (V10.13) are absorbing growth gains.'
      });
    }
  }
  if (!out.length) {
    out.push({
      id: 'bind_balanced',
      system: 'synthesis',
      severity: 'info',
      message: 'No single economic layer is clearly binding; monitor fiscal and household drift.'
    });
  }
  out.sort((a, b) => {
    const rank = { critical: 0, warning: 1, info: 2 };
    return rank[a.severity] - rank[b.severity];
  });
  return out.slice(0, 4);
}

export function computeNationalEconomicAnalytics(
  inputs: NationalEconomicAnalyticsInputs
): NationalEconomicAnalyticsSnapshot {
  const inputHash = nationalEconomicAnalyticsInputHash(inputs);
  if (!inputs.enabled) {
    return {
      schemaVersion: V1014_SCHEMA_VERSION,
      revision: 1,
      enabled: false,
      turn: inputs.turn,
      day: inputs.day,
      compositeHealthIndex: 0,
      healthBand: 'mixed',
      privateEconomy: {
        liquidityScore: 0,
        creditBand: 'n/a',
        economicPhase: inputs.economicPhase,
        headline: 'National economic analytics require National Systems.'
      },
      publicEconomy: null,
      householdEconomy: null,
      bindingConstraints: [],
      kpis: [],
      headline: 'Economic analytics paused (National Systems off).',
      inputHash
    };
  }

  const privateScore = derivePrivateLiquidityScore(inputs);
  const creditBand = getCreditScoreRange(inputs.creditScore).label;
  const pf = inputs.publicFinance;
  const hh = inputs.households;

  const fiscalScore = pf
    ? clamp01(
        Math.round(
          FISCAL_HEADROOM_SCORE[pf.fiscalPosition.headroomBand] * 0.55 +
            FISCAL_PRESSURE_SCORE[pf.fiscalPosition.pressure] * 0.45
        )
      )
    : null;

  const householdScore = hh
    ? clamp01(
        Math.round(
          bandScore(hh.national.prosperity, PROSPERITY_SCORE) * 0.45 +
            bandScore(hh.national.affordability, AFFORDABILITY_SCORE) * 0.55
        )
      )
    : null;

  const { index, band } = deriveCompositeHealth(privateScore, fiscalScore, householdScore);
  const bindingConstraints = deriveBindingConstraints(inputs, privateScore, pf, hh);

  const kpis: EconomicAnalyticsKpi[] = [
    {
      id: 'composite',
      label: 'Composite economic health',
      valueText: `${index}/100`,
      band
    },
    {
      id: 'private_liquidity',
      label: 'Private liquidity',
      valueText: `${privateScore}/100`,
      band: creditBand
    }
  ];
  if (pf) {
    kpis.push({
      id: 'fiscal_headroom',
      label: 'Fiscal headroom (V10.12)',
      valueText: `${Math.round(pf.fiscalPosition.fiscalHeadroom)} pts`,
      band: pf.fiscalPosition.headroomBand,
      trend: pf.revenue.trend === 'rising' ? 'up' : pf.revenue.trend === 'weakening' ? 'down' : 'flat'
    });
  }
  if (hh) {
    kpis.push({
      id: 'living_standards',
      label: 'Living standards (V10.13)',
      valueText: `${hh.national.prosperity} / ${hh.national.affordability}`,
      band: hh.national.trajectory,
      trend:
        hh.national.trajectory === 'improving' ? 'up' :
        hh.national.trajectory === 'weakening' || hh.national.trajectory === 'deteriorating' ? 'down' : 'flat'
    });
  }

  const top = bindingConstraints[0];
  const headline = top
    ? `Day ${inputs.day}: ${top.message}`
    : `Day ${inputs.day}: Balanced economic posture (${band}).`;

  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 1,
    enabled: true,
    turn: inputs.turn,
    day: inputs.day,
    compositeHealthIndex: index,
    healthBand: band,
    privateEconomy: {
      liquidityScore: privateScore,
      creditBand,
      economicPhase: inputs.economicPhase,
      headline: `Spendable $${Math.round(inputs.spendableCash).toLocaleString()} · phase ${inputs.economicPhase}`
    },
    publicEconomy: pf
      ? {
          fiscalHeadroom: pf.fiscalPosition.fiscalHeadroom,
          headroomBand: pf.fiscalPosition.headroomBand,
          pressure: pf.fiscalPosition.pressure,
          sustainability: pf.fiscalPosition.sustainability,
          revenueTrend: pf.revenue.trend
        }
      : null,
    householdEconomy: hh
      ? {
          prosperity: hh.national.prosperity,
          affordability: hh.national.affordability,
          trajectory: hh.national.trajectory,
          domesticDemand: hh.national.domesticDemand.level
        }
      : null,
    bindingConstraints,
    kpis,
    headline,
    inputHash
  };
}

export function validateNationalEconomicAnalyticsSnapshot(
  snap: NationalEconomicAnalyticsSnapshot | null | undefined
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!snap) return { valid: false, issues: ['snapshot is null'] };
  if (snap.schemaVersion !== V1014_SCHEMA_VERSION) issues.push('unexpected schemaVersion');
  if (!Number.isFinite(snap.compositeHealthIndex)) issues.push('non-finite compositeHealthIndex');
  if (snap.enabled && snap.kpis.length < 2) issues.push('expected at least private KPIs when enabled');
  return { valid: issues.length === 0, issues };
}

export function summarizeNationalEconomicAnalyticsForPlay(
  snap: NationalEconomicAnalyticsSnapshot | null | undefined
): string {
  if (!snap || !snap.enabled) return 'Economic analytics unavailable.';
  return snap.headline;
}

export function runV1014EconomicAnalyticsSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ name: string; passed: boolean; detail: string }> = [];
  const check = (name: string, condition: boolean, detail: string) => {
    results.push({ name, passed: Boolean(condition), detail });
  };

  const baseInputs = (): NationalEconomicAnalyticsInputs => ({
    turn: 4,
    day: 4,
    enabled: true,
    actorId: 'player',
    spendableCash: 4200,
    netWorth: 9000,
    creditScore: 62,
    economicPhase: 'compounding',
    teamTreasury: 0,
    publicFinance: null,
    households: null
  });

  check('T01 disabled national systems', (() => {
    const s = computeNationalEconomicAnalytics({ ...baseInputs(), enabled: false });
    return !s.enabled && s.compositeHealthIndex === 0;
  })(), 'disabled snapshot');

  check('T02 private-only analytics', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    return s.enabled && s.kpis.length === 2 && s.publicEconomy === null;
  })(), 'two KPIs');

  check('T03 determinism', (() => {
    const a = computeNationalEconomicAnalytics(baseInputs());
    const b = computeNationalEconomicAnalytics(baseInputs());
    return JSON.stringify(a) === JSON.stringify(b);
  })(), 'identical JSON');

  check('T04 validation', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    return validateNationalEconomicAnalyticsSnapshot(s).valid;
  })(), 'valid snapshot');

  check('T05 player cash does not invent fiscal headroom', (() => {
    const low = computeNationalEconomicAnalytics({ ...baseInputs(), spendableCash: 100 });
    const high = computeNationalEconomicAnalytics({ ...baseInputs(), spendableCash: 9_000_000 });
    return low.publicEconomy === null && high.publicEconomy === null && high.privateEconomy.liquidityScore >= low.privateEconomy.liquidityScore;
  })(), 'private only delta');

  check('T06 fiscal strain raises binding constraint', (() => {
    const p0 = createInitialPublicFinancePersisted();
    const pf = computeNationalPublicFinance(
      {
        turn: 5,
        enabled: true,
        debtEnabled: true,
        completedInfrastructureCount: 0,
        completedInfrastructureByNetwork: { freight: 0, energy: 0, water: 0, digital: 0, research: 0, regional_infra: 0 },
        programs: [
          {
            id: 'stress_program',
            title: 'Stress',
            kind: 'national_rail',
            subjectType: 'megaproject',
            status: 'under_construction',
            regionIds: ['NSW'],
            category: 'infrastructure',
            turnsToCompletion: 8
          }
        ],
        crises: []
      },
      p0
    ).state;
    const s = computeNationalEconomicAnalytics({ ...baseInputs(), publicFinance: pf });
    const fiscalBind = s.bindingConstraints.find(c => c.system === 'fiscal');
    return Boolean(fiscalBind && s.publicEconomy);
  })(), 'fiscal binding');

  check('T07 low private liquidity binding', (() => {
    const s = computeNationalEconomicAnalytics({
      ...baseInputs(),
      spendableCash: 20,
      netWorth: 40,
      creditScore: 18,
      economicPhase: 'survival'
    });
    return s.bindingConstraints.some(c => c.system === 'private');
  })(), 'private bind');

  check('T08 household affordability binding', (() => {
    const inp = makeDefaultV1013TestInputs(
      {},
      {
        VIC: {
          economyBand: 'booming',
          housingNeedSeverity: 'critical',
          investmentPressure: 'overheated',
          clusterConcentration: 90
        }
      }
    );
    const hh = computeNationalHouseholdEconomy(inp, createInitialHouseholdEconomyPersisted(), null).state;
    const s = computeNationalEconomicAnalytics({ ...baseInputs(), households: hh });
    return s.householdEconomy != null && s.kpis.length >= 3;
  })(), 'household KPI present');

  check('T09 composite bounded 0-100', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    return s.compositeHealthIndex >= 0 && s.compositeHealthIndex <= 100;
  })(), '0-100');

  check('T10 input hash changes with pf hash', (() => {
    const p0 = createInitialPublicFinancePersisted();
    const pf = computeNationalPublicFinance(
      {
        turn: 2,
        enabled: true,
        debtEnabled: false,
        completedInfrastructureCount: 1,
        completedInfrastructureByNetwork: { freight: 1, energy: 0, water: 0, digital: 0, research: 0, regional_infra: 0 },
        programs: [],
        crises: []
      },
      p0
    ).state;
    const a = computeNationalEconomicAnalytics({ ...baseInputs(), publicFinance: pf });
    const b = computeNationalEconomicAnalytics({ ...baseInputs() });
    return a.inputHash !== b.inputHash;
  })(), 'hash delta');

  check('T11 summarize helper', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    const t = summarizeNationalEconomicAnalyticsForPlay(s);
    return t.includes('Day');
  })(), 'headline includes Day');

  check('T12 buildNationalEconomicAnalyticsInputs', (() => {
    const built = buildNationalEconomicAnalyticsInputs({
      turn: 2,
      day: 2,
      nationalSystemsEnabled: true,
      player: { id: 'player', money: 500, creditScore: 55 },
      gameSettings: {},
      publicFinance: null,
      households: null
    });
    return built.spendableCash === 500 && built.enabled;
  })(), 'builder');

  check('T13 team treasury boosts private score', (() => {
    const a = computeNationalEconomicAnalytics({ ...baseInputs(), teamTreasury: 0 });
    const b = computeNationalEconomicAnalytics({ ...baseInputs(), teamTreasury: 50000 });
    return b.privateEconomy.liquidityScore >= a.privateEconomy.liquidityScore;
  })(), 'treasury');

  check('T14 actor cash unchanged fiscal snapshot', (() => {
    const p0 = createInitialPublicFinancePersisted();
    const pf = computeNationalPublicFinance(
      {
        turn: 3,
        enabled: true,
        debtEnabled: false,
        completedInfrastructureCount: 0,
        completedInfrastructureByNetwork: { freight: 0, energy: 0, water: 0, digital: 0, research: 0, regional_infra: 0 },
        programs: [],
        crises: []
      },
      p0
    ).state;
    const a = computeNationalEconomicAnalytics({ ...baseInputs(), spendableCash: 100, publicFinance: pf });
    const b = computeNationalEconomicAnalytics({ ...baseInputs(), spendableCash: 500000, publicFinance: pf });
    return a.publicEconomy?.fiscalHeadroom === b.publicEconomy?.fiscalHeadroom;
  })(), 'fiscal isolated');

  check('T15 max four binding constraints', (() => {
    const p0 = createInitialPublicFinancePersisted();
    const pf = computeNationalPublicFinance(
      {
        turn: 6,
        enabled: true,
        debtEnabled: true,
        completedInfrastructureCount: 0,
        completedInfrastructureByNetwork: { freight: 0, energy: 0, water: 0, digital: 0, research: 0, regional_infra: 0 },
        programs: [
          {
            id: 'mega',
            title: 'Mega',
            kind: 'national_rail',
            subjectType: 'megaproject',
            status: 'under_construction',
            regionIds: ['NSW', 'VIC'],
            category: 'infrastructure',
            turnsToCompletion: 10
          }
        ],
        crises: [{ id: 'c1', severity: 'major' } as any]
      },
      p0
    ).state;
    const hh = computeNationalHouseholdEconomy(
      makeDefaultV1013TestInputs({}, { NSW: { housingNeedSeverity: 'critical', economyBand: 'weak' } }),
      createInitialHouseholdEconomyPersisted(),
      null
    ).state;
    const s = computeNationalEconomicAnalytics({
      ...baseInputs(),
      spendableCash: 10,
      creditScore: 10,
      publicFinance: pf,
      households: hh
    });
    return s.bindingConstraints.length <= 4;
  })(), 'max 4 constraints');

  check('T16 health band matches index', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    const ok =
      (s.compositeHealthIndex >= 82 && s.healthBand === 'strong') ||
      (s.compositeHealthIndex < 82 && s.compositeHealthIndex >= 68 && s.healthBand === 'healthy') ||
      (s.compositeHealthIndex < 68 && s.compositeHealthIndex >= 50 && s.healthBand === 'mixed') ||
      (s.compositeHealthIndex < 50 && s.compositeHealthIndex >= 32 && s.healthBand === 'stressed') ||
      (s.compositeHealthIndex < 32 && s.healthBand === 'critical');
    return ok;
  })(), 'band thresholds');

  check('T17 schema constant', (() => V1014_SCHEMA_VERSION === 'v10.14.0')(), V1014_SCHEMA_VERSION);

  check('T18 null validation', (() => !validateNationalEconomicAnalyticsSnapshot(null).valid)(), 'null');

  check('T19 KPI ids unique', (() => {
    const s = computeNationalEconomicAnalytics(baseInputs());
    const ids = s.kpis.map(k => k.id);
    return new Set(ids).size === ids.length;
  })(), 'unique');

  check('T20 revision stable', (() => computeNationalEconomicAnalytics(baseInputs()).revision === 1)(), 'rev1');

  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export const NationalEconomicAnalyticsInspector: React.FC<{
  snapshot: NationalEconomicAnalyticsSnapshot | null;
}> = ({ snapshot }) => {
  const [testResult, setTestResult] = useState<ReturnType<typeof runV1014EconomicAnalyticsSelfTests> | null>(null);
  if (!snapshot || !snapshot.enabled) {
    return (
      <div className="rounded-xl border border-slate-600/40 bg-slate-900/80 p-3 text-xs text-slate-400">
        V10.14 Economic Analytics — enable National Systems to synthesize KPIs.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-teal-500/30 bg-slate-900/90 p-3 text-xs text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">V10.14 National Economic Analytics</div>
          <div className="text-sm font-bold text-white">Composite {snapshot.compositeHealthIndex}/100 · {snapshot.healthBand}</div>
        </div>
        <button
          type="button"
          className="rounded border border-teal-500/40 px-2 py-1 text-[10px] text-teal-200 hover:bg-teal-950/50"
          onClick={() => setTestResult(runV1014EconomicAnalyticsSelfTests())}
        >
          Run V10.14 Self-Tests (20)
        </button>
      </div>
      <p className="mt-2 text-[11px] text-slate-300">{snapshot.headline}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
        {snapshot.kpis.map(k => (
          <div key={k.id} className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-2 text-center">
            <div className="text-[10px] uppercase text-slate-500">{k.label}</div>
            <div className="text-sm font-bold text-teal-300">{k.valueText}</div>
            {k.band && <div className="text-[10px] text-slate-400">{k.band}</div>}
          </div>
        ))}
      </div>
      {snapshot.bindingConstraints.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-amber-200/90">
          {snapshot.bindingConstraints.map(c => (
            <li key={c.id}>[{c.severity}] {c.message}</li>
          ))}
        </ul>
      )}
      {testResult && (
        <div className="mt-2 rounded border border-slate-700 bg-slate-950/80 p-2 text-[10px]">
          Self-tests: {testResult.passed}/{testResult.total} passed
          {!testResult.failed ? null : (
            <div className="mt-1 max-h-24 overflow-y-auto text-red-300">
              {testResult.results.filter(r => !r.passed).map(r => (
                <div key={r.name}>{r.name}: {r.detail}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
