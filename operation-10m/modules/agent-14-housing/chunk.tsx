// OP10M_MODULE_BEGIN agent-14-housing
// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending
// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)

// --- source: types.ts ---
/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.1-capacity-delay' as const;

export type PublicServicePillar = 'housing' | 'healthcare' | 'education';

export type WorkforceReadiness =
  | 'blocking'
  | 'weak'
  | 'strained'
  | 'balanced'
  | 'strong';

export interface SpendingCommitment {
  id: string;
  programId: string;
  pillar: PublicServicePillar;
  regionId: string;
  committedTurn: number;
  /** Total fiscal load spread across durationTurns (V10.12-style points, not player cash). */
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  /** Turns after commit before any KPI uplift applies. */
  effectLagTurns: number;
  /** Turns after lag to reach full baseImpact on KPI indices. */
  rampTurns: number;
}

export type CapacityBindingConstraint =
  | 'none'
  | 'program_slots'
  | 'fiscal_absorption'
  | 'workforce';

export interface PillarCapacitySlice {
  capacityIndex: number;
  loadRatio: number;
  activeCommitments: number;
}

export interface PublicServiceCapacitySnapshot {
  turn: number;
  nationalProgramSlots: number;
  slotsUsed: number;
  slotsFree: number;
  fiscalAbsorptionCap: number;
  fiscalLoadScheduledThisTurn: number;
  fiscalHeadroomUsedRatio: number;
  workforceUtilization: number;
  deliveryCapacityIndex: number;
  bindingConstraint: CapacityBindingConstraint;
  byPillar: Record<PublicServicePillar, PillarCapacitySlice>;
  evidence: string[];
}

export interface DelayedSpendingTurnEffects {
  turn: number;
  fiscalLoadThisTurn: number;
  /** Effective completed-project equivalents feeding V10.14 pillar delivery math. */
  completedProjectBoost: Record<PublicServicePillar, number>;
  /** Per-region fractional boost from regional programs (0–1 scale × baseImpact). */
  regionalKpiDelta: Record<string, Partial<Record<PublicServicePillar, number>>>;
  maturedCommitmentIds: string[];
  events: Array<{ id: string; kind: string; summary: string }>;
}

export interface DelayedSpendingPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  active: SpendingCommitment[];
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface CapacityAndSpendingInputs {
  turn: number;
  fiscalHeadroom?: number;
  stateCapacityLoad?: number;
  workforceReadiness?: WorkforceReadiness;
  workforceSpecialistGap?: number;
  activeProgramCount?: number;
}

export interface EnrichedPublicServiceTurnInputs extends CapacityAndSpendingInputs {
  fiscalLoadFromActivePrograms: number;
  completedHousingProjects: number;
  completedHealthProjects: number;
  completedEducationProjects: number;
  activeProgramCount: number;
  capacity: PublicServiceCapacitySnapshot;
  spending: DelayedSpendingTurnEffects;
}


// --- source: constants.ts ---
export const AGENT14_CORE_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export const AGENT14_LIMITS = {
  maxActiveCommitments: 24,
  maxHistory: 32,
  defaultNationalSlots: 8,
  minFiscalAbsorption: 18,
  maxFiscalAbsorption: 72,
} as const;

export const AGENT14_DEFAULT_PROGRAM_TIMING = {
  effectLagTurns: 2,
  rampTurns: 3,
} as const;

export const AGENT14_PILLARS: readonly PublicServicePillar[] = [
  'housing',
  'healthcare',
  'education',
];


// --- source: public-service-capacity.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function workforceScore(readiness: WorkforceReadiness | undefined, gap: number): number {
  let score = 62 - gap * 0.45;
  switch (readiness) {
    case 'strong':
      score += 12;
      break;
    case 'balanced':
      score += 4;
      break;
    case 'strained':
      score -= 10;
      break;
    case 'weak':
      score -= 18;
      break;
    case 'blocking':
      score -= 28;
      break;
    default:
      break;
  }
  return clamp(score);
}

export function computeFiscalAbsorptionCap(fiscalHeadroom: number, stateCapacityLoad: number): number {
  const head = clamp(fiscalHeadroom, 0, 100);
  const load = clamp(stateCapacityLoad, 0, 100);
  const cap =
    AGENT14_LIMITS.minFiscalAbsorption +
    (head / 100) * (AGENT14_LIMITS.maxFiscalAbsorption - AGENT14_LIMITS.minFiscalAbsorption) -
    load * 0.22;
  return clamp(cap, AGENT14_LIMITS.minFiscalAbsorption, AGENT14_LIMITS.maxFiscalAbsorption);
}

export function computeNationalProgramSlots(
  fiscalHeadroom: number,
  stateCapacityLoad: number
): number {
  const base = AGENT14_LIMITS.defaultNationalSlots;
  const bonus = fiscalHeadroom >= 70 ? 2 : fiscalHeadroom >= 55 ? 1 : 0;
  const penalty = stateCapacityLoad >= 75 ? 2 : stateCapacityLoad >= 55 ? 1 : 0;
  return Math.max(3, Math.min(AGENT14_LIMITS.maxActiveCommitments, base + bonus - penalty));
}

function pillarLoad(
  active: SpendingCommitment[],
  pillar: PublicServicePillar,
  turn: number
): { loadPoints: number; count: number } {
  let loadPoints = 0;
  let count = 0;
  for (const c of active) {
    if (c.pillar !== pillar) continue;
    if (turn < c.committedTurn) continue;
    const elapsed = turn - c.committedTurn;
    if (elapsed >= c.durationTurns) continue;
    count += 1;
    loadPoints += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  return { loadPoints, count };
}

export function computePublicServiceCapacity(
  inputs: CapacityAndSpendingInputs,
  activeCommitments: SpendingCommitment[]
): PublicServiceCapacitySnapshot {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const fiscalHeadroom = clamp(inputs.fiscalHeadroom ?? 55);
  const stateCapacityLoad = clamp(inputs.stateCapacityLoad ?? 40);
  const gap = clamp(inputs.workforceSpecialistGap ?? 32);
  const wf = workforceScore(inputs.workforceReadiness, gap);

  const nationalProgramSlots = computeNationalProgramSlots(fiscalHeadroom, stateCapacityLoad);
  const slotsUsed = activeCommitments.filter(
    (c) => turn >= c.committedTurn && turn - c.committedTurn < c.durationTurns
  ).length;
  const slotsFree = Math.max(0, nationalProgramSlots - slotsUsed);

  const fiscalAbsorptionCap = computeFiscalAbsorptionCap(fiscalHeadroom, stateCapacityLoad);
  let fiscalLoadScheduledThisTurn = 0;
  for (const c of activeCommitments) {
    if (turn < c.committedTurn || turn - c.committedTurn >= c.durationTurns) continue;
    fiscalLoadScheduledThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  fiscalLoadScheduledThisTurn = Math.round(fiscalLoadScheduledThisTurn * 10) / 10;

  const fiscalHeadroomUsedRatio =
    fiscalAbsorptionCap > 0 ? clamp((fiscalLoadScheduledThisTurn / fiscalAbsorptionCap) * 100) : 100;

  const workforceUtilization = clamp(
    (slotsUsed / Math.max(1, nationalProgramSlots)) * 55 + (100 - wf) * 0.35 + gap * 0.25
  );

  const byPillar = {} as Record<PublicServicePillar, PillarCapacitySlice>;
  let capacitySum = 0;
  for (const pillar of AGENT14_PILLARS) {
    const { loadPoints, count } = pillarLoad(activeCommitments, pillar, turn);
    const pillarCap = fiscalAbsorptionCap / 3;
    const loadRatio = pillarCap > 0 ? loadPoints / pillarCap : 1;
    const capacityIndex = clamp(100 - loadRatio * 38 - (count > 3 ? (count - 3) * 6 : 0));
    byPillar[pillar] = {
      capacityIndex,
      loadRatio: Math.round(loadRatio * 100) / 100,
      activeCommitments: count,
    };
    capacitySum += capacityIndex;
  }

  let bindingConstraint: CapacityBindingConstraint = 'none';
  if (slotsFree <= 0) bindingConstraint = 'program_slots';
  else if (fiscalLoadScheduledThisTurn > fiscalAbsorptionCap * 1.02) bindingConstraint = 'fiscal_absorption';
  else if (workforceUtilization >= 88) bindingConstraint = 'workforce';

  const deliveryCapacityIndex = clamp(
    capacitySum / AGENT14_PILLARS.length -
      (bindingConstraint === 'fiscal_absorption' ? 8 : 0) -
      (bindingConstraint === 'program_slots' ? 6 : 0)
  );

  const evidence = [
    `slots ${slotsUsed}/${nationalProgramSlots}`,
    `fiscal ${fiscalLoadScheduledThisTurn}/${fiscalAbsorptionCap}`,
    `workforce util ${workforceUtilization}`,
    `binding ${bindingConstraint}`,
  ];

  return {
    turn,
    nationalProgramSlots,
    slotsUsed,
    slotsFree,
    fiscalAbsorptionCap,
    fiscalLoadScheduledThisTurn,
    fiscalHeadroomUsedRatio,
    workforceUtilization,
    deliveryCapacityIndex,
    bindingConstraint,
    byPillar,
    evidence,
  };
}

export function canAcceptSpendingCommitment(
  capacity: PublicServiceCapacitySnapshot,
  commitment: Pick<SpendingCommitment, 'fiscalLoadPoints' | 'durationTurns'>
): { allowed: boolean; reason: string } {
  if (capacity.slotsFree <= 0) {
    return { allowed: false, reason: 'No free national program slots for a new commitment.' };
  }
  const incrementalLoad = commitment.fiscalLoadPoints / Math.max(1, commitment.durationTurns);
  if (capacity.fiscalLoadScheduledThisTurn + incrementalLoad > capacity.fiscalAbsorptionCap * 1.05) {
    return {
      allowed: false,
      reason: 'Incremental fiscal load would exceed public finance absorption capacity this turn.',
    };
  }
  return { allowed: true, reason: 'Within capacity.' };
}


// --- source: delayed-spending-effects.ts ---
export function createInitialDelayedSpendingPersisted(): DelayedSpendingPersisted {
  return {
    schemaVersion: '10.14.1-capacity-delay' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active: [],
    history: [],
  };
}

export function sanitizeDelayedSpendingPersisted(
  raw?: DelayedSpendingPersisted | null
): DelayedSpendingPersisted {
  if (!raw || typeof raw !== 'object') return createInitialDelayedSpendingPersisted();
  const active = Array.isArray(raw.active)
    ? raw.active
        .filter(
          (c) =>
            c &&
            typeof c.id === 'string' &&
            typeof c.programId === 'string' &&
            typeof c.committedTurn === 'number'
        )
        .slice(0, AGENT14_LIMITS.maxActiveCommitments)
    : [];
  return {
    schemaVersion: '10.14.1-capacity-delay' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active,
    history: Array.isArray(raw.history) ? raw.history.slice(-AGENT14_LIMITS.maxHistory) : [],
  };
}

export function makeSpendingCommitment(
  partial: Omit<
    SpendingCommitment,
    'effectLagTurns' | 'rampTurns'
  > &
    Partial<Pick<SpendingCommitment, 'effectLagTurns' | 'rampTurns'>>
): SpendingCommitment {
  return {
    ...partial,
    effectLagTurns: partial.effectLagTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.effectLagTurns,
    rampTurns: partial.rampTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.rampTurns,
  };
}

function rampFactor(commit: SpendingCommitment, turn: number): number {
  const effectTurn = commit.committedTurn + commit.effectLagTurns;
  if (turn < effectTurn) return 0;
  const rampEnd = effectTurn + Math.max(1, commit.rampTurns);
  if (turn >= rampEnd) return 1;
  return (turn - effectTurn + 1) / Math.max(1, commit.rampTurns);
}

/** Advance delayed spending one turn; pure function returning new persisted state and derived effects. */
export function advanceDelayedSpendingEffects(
  turn: number,
  persistedIn: DelayedSpendingPersisted | null | undefined
): { persisted: DelayedSpendingPersisted; effects: DelayedSpendingTurnEffects } {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  const t = Math.max(1, Math.floor(turn));
  let fiscalLoadThisTurn = 0;
  const completedProjectBoost: Record<PublicServicePillar, number> = {
    housing: 0,
    healthcare: 0,
    education: 0,
  };
  const regionalKpiDelta: DelayedSpendingTurnEffects['regionalKpiDelta'] = {};
  const maturedCommitmentIds: string[] = [];
  const events: DelayedSpendingTurnEffects['events'] = [];
  const stillActive: SpendingCommitment[] = [];

  for (const c of persisted.active) {
    if (t < c.committedTurn) {
      stillActive.push(c);
      continue;
    }
    const elapsed = t - c.committedTurn;
    if (elapsed < c.durationTurns) {
      stillActive.push(c);
      fiscalLoadThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
    } else if (elapsed === c.durationTurns) {
      maturedCommitmentIds.push(c.id);
      events.push({
        id: `ps_mat_${c.id}_t${t}`,
        kind: 'program_spending_matured',
        summary: `Program ${c.programId} fiscal tranche completed; KPI ramp continues from lag pipeline.`,
      });
    }

    const ramp = rampFactor(c, t);
    if (ramp <= 0) continue;

    const kpiUnits = (c.baseImpact / 10) * ramp;
    if (c.pillar === 'housing') completedProjectBoost.housing += kpiUnits;
    if (c.pillar === 'healthcare') completedProjectBoost.healthcare += kpiUnits;
    if (c.pillar === 'education') completedProjectBoost.education += kpiUnits;

    if (!regionalKpiDelta[c.regionId]) regionalKpiDelta[c.regionId] = {};
    const prev = regionalKpiDelta[c.regionId]![c.pillar] ?? 0;
    regionalKpiDelta[c.regionId]![c.pillar] = prev + kpiUnits * 2.5;
  }

  persisted.active = stillActive.slice(0, AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_spend_t${t}`,
    turn: t,
    summary: `Fiscal load ${Math.round(fiscalLoadThisTurn * 10) / 10}; active ${persisted.active.length}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);

  return {
    persisted,
    effects: {
      turn: t,
      fiscalLoadThisTurn: Math.round(fiscalLoadThisTurn * 10) / 10,
      completedProjectBoost,
      regionalKpiDelta,
      maturedCommitmentIds,
      events,
    },
  };
}

export function commitSpendingProgram(
  persistedIn: DelayedSpendingPersisted | null | undefined,
  commitment: SpendingCommitment
): DelayedSpendingPersisted {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  persisted.active = [...persisted.active, commitment].slice(-AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_commit_${commitment.id}`,
    turn: commitment.committedTurn,
    summary: `Committed ${commitment.programId} (${commitment.pillar}) lag=${commitment.effectLagTurns} ramp=${commitment.rampTurns}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);
  return persisted;
}


// --- source: turn-advance.ts ---
export interface AdvancePublicServicesTurnArgs {
  inputs: CapacityAndSpendingInputs;
  spendingPersisted?: DelayedSpendingPersisted | null;
  /** New commitments queued this turn (already validated or not). */
  newCommitments?: SpendingCommitment[];
  /** When true, reject commitments that fail capacity gate. */
  enforceCapacity?: boolean;
}

export interface AdvancePublicServicesTurnResult {
  inputs: EnrichedPublicServiceTurnInputs;
  spendingPersisted: DelayedSpendingPersisted;
  rejectedCommitments: Array<{ commitment: SpendingCommitment; reason: string }>;
}

export function advancePublicServicesTurn(
  args: AdvancePublicServicesTurnArgs
): AdvancePublicServicesTurnResult {
  const turn = Math.max(1, Math.floor(args.inputs.turn || 1));
  let spendingPersisted = args.spendingPersisted ?? null;
  const rejectedCommitments: AdvancePublicServicesTurnResult['rejectedCommitments'] = [];

  for (const c of args.newCommitments ?? []) {
    const capacityNow = computePublicServiceCapacity(
      args.inputs,
      spendingPersisted?.active ?? []
    );
    const gate = canAcceptSpendingCommitment(capacityNow, c);
    if (!gate.allowed && args.enforceCapacity !== false) {
      rejectedCommitments.push({ commitment: c, reason: gate.reason });
      continue;
    }
    spendingPersisted = commitSpendingProgram(spendingPersisted, c);
  }

  const { effects, persisted: afterTick } = advanceDelayedSpendingEffects(turn, spendingPersisted);
  spendingPersisted = afterTick;

  const capacity = computePublicServiceCapacity(args.inputs, spendingPersisted.active);

  const enriched: EnrichedPublicServiceTurnInputs = {
    ...args.inputs,
    turn,
    fiscalLoadFromActivePrograms: Math.round(
      (effects.fiscalLoadThisTurn + (args.inputs.activeProgramCount ?? 0) * 0.5) * 10
    ) / 10,
    completedHousingProjects: effects.completedProjectBoost.housing,
    completedHealthProjects: effects.completedProjectBoost.healthcare,
    completedEducationProjects: effects.completedProjectBoost.education,
    activeProgramCount: spendingPersisted.active.length,
    capacity,
    spending: effects,
  };

  return { inputs: enriched, spendingPersisted, rejectedCommitments };
}


// --- source: self-tests.ts ---
export interface Agent14SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function check(
  results: Agent14SelfTestResult[],
  id: string,
  name: string,
  condition: boolean,
  detail: string
): void {
  results.push({ id, name, passed: Boolean(condition), detail });
}

export function runAgent14WellbeingSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Agent14SelfTestResult[];
} {
  const results: Agent14SelfTestResult[] = [];

  check(
    results,
    'cap_fiscal_absorption_bounds',
    'Fiscal absorption cap stays within configured bounds',
    computeFiscalAbsorptionCap(10, 90) >= 18 && computeFiscalAbsorptionCap(95, 5) <= 72,
    `low=${computeFiscalAbsorptionCap(10, 90)} high=${computeFiscalAbsorptionCap(95, 5)}`
  );

  check(
    results,
    'cap_program_slots_fiscal_headroom',
    'High fiscal headroom grants extra program slots',
    computeNationalProgramSlots(75, 30) > computeNationalProgramSlots(35, 30),
    `high=${computeNationalProgramSlots(75, 30)} low=${computeNationalProgramSlots(35, 30)}`
  );

  {
    const cap = computePublicServiceCapacity(
      { turn: 3, fiscalHeadroom: 60, stateCapacityLoad: 40, workforceSpecialistGap: 30 },
      []
    );
    check(
      results,
      'cap_empty_active_delivery_index',
      'Empty commitment set yields non-zero delivery capacity index',
      cap.deliveryCapacityIndex >= 70 && cap.bindingConstraint === 'none',
      `index=${cap.deliveryCapacityIndex} binding=${cap.bindingConstraint}`
    );
  }

  {
    const heavy = makeSpendingCommitment({
      id: 'c1',
      programId: 'ps_h_NSW_1',
      pillar: 'housing',
      regionId: 'NSW',
      committedTurn: 1,
      fiscalLoadPoints: 60,
      durationTurns: 4,
      baseImpact: 8,
      effectLagTurns: 1,
      rampTurns: 2,
    });
    const cap = computePublicServiceCapacity(
      { turn: 2, fiscalHeadroom: 40, stateCapacityLoad: 70 },
      [heavy]
    );
    const gate = canAcceptSpendingCommitment(cap, {
      fiscalLoadPoints: 80,
      durationTurns: 2,
    });
    check(
      results,
      'cap_fiscal_binding_rejects',
      'Saturated fiscal absorption rejects new commitments',
      cap.fiscalLoadScheduledThisTurn > 0 && (!gate.allowed || cap.bindingConstraint !== 'none'),
      `scheduled=${cap.fiscalLoadScheduledThisTurn} allowed=${gate.allowed} binding=${cap.bindingConstraint}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    const c = makeSpendingCommitment({
      id: 'lag1',
      programId: 'ps_he_VIC_1',
      pillar: 'healthcare',
      regionId: 'VIC',
      committedTurn: 5,
      fiscalLoadPoints: 24,
      durationTurns: 3,
      baseImpact: 10,
      effectLagTurns: 2,
      rampTurns: 2,
    });
    persisted = commitSpendingProgram(persisted, c);
    const t5 = advanceDelayedSpendingEffects(5, persisted);
    const t6 = advanceDelayedSpendingEffects(6, t5.persisted);
    const t7 = advanceDelayedSpendingEffects(7, t6.persisted);
    check(
      results,
      'delay_fiscal_before_kpi',
      'Fiscal load applies before KPI lag elapses',
      t5.effects.fiscalLoadThisTurn > 0 &&
        t5.effects.completedProjectBoost.healthcare === 0 &&
        t7.effects.completedProjectBoost.healthcare > 0,
      `t5 fiscal=${t5.effects.fiscalLoadThisTurn} t5 kpi=${t5.effects.completedProjectBoost.healthcare} t7 kpi=${t7.effects.completedProjectBoost.healthcare}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    persisted = commitSpendingProgram(
      persisted,
      makeSpendingCommitment({
        id: 'r1',
        programId: 'ps_ed_QLD_1',
        pillar: 'education',
        regionId: 'QLD',
        committedTurn: 1,
        fiscalLoadPoints: 12,
        durationTurns: 2,
        baseImpact: 6,
        effectLagTurns: 0,
        rampTurns: 1,
      })
    );
    const end = advanceDelayedSpendingEffects(3, persisted);
    check(
      results,
      'delay_maturity_event',
      'Completed fiscal duration emits maturity marker',
      end.effects.maturedCommitmentIds.includes('r1'),
      `matured=${end.effects.maturedCommitmentIds.join(',')}`
    );
  }

  {
    const slots = computeNationalProgramSlots(55, 40);
    const commitments = Array.from({ length: slots + 1 }, (_, i) =>
      makeSpendingCommitment({
        id: `fill_${i}`,
        programId: `p_${i}`,
        pillar: 'housing',
        regionId: 'NSW',
        committedTurn: 1,
        fiscalLoadPoints: 8,
        durationTurns: 5,
        baseImpact: 4,
      })
    );
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 55, stateCapacityLoad: 40 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: commitments,
      enforceCapacity: true,
    });
    check(
      results,
      'turn_advance_capacity_gate',
      'Turn advance rejects commitments beyond slot capacity',
      adv.rejectedCommitments.length >= 1 && adv.inputs.activeProgramCount <= slots,
      `active=${adv.inputs.activeProgramCount} slots=${slots} rejected=${adv.rejectedCommitments.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 70, stateCapacityLoad: 25 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: [
        makeSpendingCommitment({
          id: 'enrich1',
          programId: 'ps_h_ACT_1',
          pillar: 'housing',
          regionId: 'ACT',
          committedTurn: 4,
          fiscalLoadPoints: 20,
          durationTurns: 4,
          baseImpact: 12,
          effectLagTurns: 0,
          rampTurns: 2,
        }),
      ],
    });
    check(
      results,
      'turn_advance_enriched_inputs',
      'Enriched inputs expose fiscal load and capacity snapshot',
      adv.inputs.fiscalLoadFromActivePrograms > 0 &&
        adv.inputs.capacity.deliveryCapacityIndex > 0 &&
        adv.inputs.completedHousingProjects > 0,
      `fiscalLoad=${adv.inputs.fiscalLoadFromActivePrograms} housingBoost=${adv.inputs.completedHousingProjects}`
    );
  }

  {
    const a = advancePublicServicesTurn({
      inputs: { turn: 1, fiscalHeadroom: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const b = advancePublicServicesTurn({
      inputs: { turn: 1, fiscalHeadroom: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'turn_advance_deterministic',
      'Identical inputs produce identical enriched fiscal load',
      a.inputs.fiscalLoadFromActivePrograms === b.inputs.fiscalLoadFromActivePrograms,
      `a=${a.inputs.fiscalLoadFromActivePrograms} b=${b.inputs.fiscalLoadFromActivePrograms}`
    );
  }

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}


// OP10M_MODULE_END agent-14-housing
