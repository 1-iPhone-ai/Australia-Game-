// OP10M_MODULE_BEGIN agent-14-housing
// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending
// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)

// --- source: types.ts ---
/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.3-scale-wave-3' as const;

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
  housingWellbeing?: NationalHousingWellbeingSnapshot;
  serviceAccessLens?: NationalServiceAccessLens;
  wellbeingWarnings?: Agent14WellbeingWarningBundle;
  programRecommendations?: ProgramSequencingRecommendation[];
}

export type HousingPipelineStage =
  | 'planning'
  | 'approvals'
  | 'construction'
  | 'handover'
  | 'stabilized';

export type AffordabilityStressBand = 'low' | 'moderate' | 'elevated' | 'severe';

export interface RegionalHousingPipelineState {
  regionId: string;
  stage: HousingPipelineStage;
  planningBacklogMonths: number;
  dwellingsInPipeline: number;
  socialHousingCompletionsRate: number;
  affordabilityStress: AffordabilityStressBand;
  affordabilityIndex: number;
  remoteShare: number;
  deliveryPressure: number;
  evidence: string[];
}

export interface NationalHousingWellbeingSnapshot {
  turn: number;
  nationalAffordabilityIndex: number;
  affordabilityStress: AffordabilityStressBand;
  averagePlanningBacklogMonths: number;
  totalDwellingsInPipeline: number;
  socialCompletionsIndex: number;
  regionalEquityGap: number;
  regions: Record<string, RegionalHousingPipelineState>;
  narrativeSummary: string;
}

export type ServiceAccessBand = 'critical' | 'weak' | 'adequate' | 'strong';

export interface PillarAccessSlice {
  pillar: PublicServicePillar;
  accessIndex: number;
  band: ServiceAccessBand;
  backlogPressure: number;
}

export interface RegionalServiceAccessState {
  regionId: string;
  pillars: Record<PublicServicePillar, PillarAccessSlice>;
  compositeIndex: number;
}

export interface NationalServiceAccessLens {
  turn: number;
  nationalComposite: number;
  nationalBand: ServiceAccessBand;
  pillarNational: Record<PublicServicePillar, PillarAccessSlice>;
  regions: Record<string, RegionalServiceAccessState>;
  equityGap: number;
}

export type WellbeingWarningSeverity = 'info' | 'watch' | 'elevated' | 'critical';

export interface Agent14WellbeingWarning {
  id: string;
  severity: WellbeingWarningSeverity;
  pillar: PublicServicePillar | 'cross';
  regionId?: string;
  title: string;
  summary: string;
  assumptions: string[];
}

export interface Agent14WellbeingWarningBundle {
  shouldSurface: boolean;
  warnings: Agent14WellbeingWarning[];
}

export interface ProgramSequencingRecommendation {
  rank: number;
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  rationale: string;
  expectedLagTurns: number;
  fitsCapacity: boolean;
}

export interface WellbeingTurnForecastPoint {
  turn: number;
  affordabilityIndex: number;
  deliveryCapacityIndex: number;
  fiscalLoad: number;
  equityGap: number;
}

export interface WellbeingMultiTurnForecast {
  scenarioId: string;
  horizonTurns: number;
  points: WellbeingTurnForecastPoint[];
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

export type Agent14CoreRegion = (typeof AGENT14_CORE_REGIONS)[number];

export const AGENT14_LIMITS = {
  maxActiveCommitments: 24,
  maxHistory: 32,
  defaultNationalSlots: 8,
  minFiscalAbsorption: 18,
  maxFiscalAbsorption: 72,
  maxSimulationTurns: 48,
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

/** Baseline housing delivery context per core region (modular slice; not Living Regions state). */
export const AGENT14_HOUSING_REGION_BASELINE: Record<
  Agent14CoreRegion,
  {
    remoteShare: number;
    planningBacklogMonths: number;
    baselinePipelineDwellings: number;
    affordabilityBaseline: number;
  }
> = {
  NSW: { remoteShare: 0.08, planningBacklogMonths: 9, baselinePipelineDwellings: 4200, affordabilityBaseline: 58 },
  VIC: { remoteShare: 0.06, planningBacklogMonths: 9, baselinePipelineDwellings: 3800, affordabilityBaseline: 56 },
  QLD: { remoteShare: 0.22, planningBacklogMonths: 12, baselinePipelineDwellings: 3100, affordabilityBaseline: 52 },
  WA: { remoteShare: 0.28, planningBacklogMonths: 13, baselinePipelineDwellings: 2400, affordabilityBaseline: 50 },
  SA: { remoteShare: 0.12, planningBacklogMonths: 10, baselinePipelineDwellings: 1100, affordabilityBaseline: 54 },
  TAS: { remoteShare: 0.35, planningBacklogMonths: 15, baselinePipelineDwellings: 480, affordabilityBaseline: 48 },
  NT: { remoteShare: 0.55, planningBacklogMonths: 18, baselinePipelineDwellings: 320, affordabilityBaseline: 42 },
  ACT: { remoteShare: 0.04, planningBacklogMonths: 8, baselinePipelineDwellings: 620, affordabilityBaseline: 60 },
};

export const AGENT14_HOUSING_PROGRAM_STUBS: readonly {
  id: string;
  regionId: Agent14CoreRegion;
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  effectLagTurns: number;
}[] = [
  { id: 'ps_h_NSW_social_accel', regionId: 'NSW', fiscalLoadPoints: 22, durationTurns: 6, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_h_VIC_planning_reform', regionId: 'VIC', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_h_QLD_regional_release', regionId: 'QLD', fiscalLoadPoints: 20, durationTurns: 7, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_h_WA_remote_housing', regionId: 'WA', fiscalLoadPoints: 24, durationTurns: 8, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_h_NT_remote_housing', regionId: 'NT', fiscalLoadPoints: 26, durationTurns: 8, baseImpact: 12, effectLagTurns: 4 },
  { id: 'ps_h_TAS_affordable', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_h_SA_modular', regionId: 'SA', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 6, effectLagTurns: 1 },
  { id: 'ps_h_ACT_density', regionId: 'ACT', fiscalLoadPoints: 12, durationTurns: 4, baseImpact: 5, effectLagTurns: 1 },
];


// --- source: housing-delivery-pipeline.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function stressBand(index: number): AffordabilityStressBand {
  if (index >= 62) return 'low';
  if (index >= 48) return 'moderate';
  if (index >= 34) return 'elevated';
  return 'severe';
}

function stageFromBacklog(months: number, pipeline: number): HousingPipelineStage {
  if (months >= 16 || pipeline >= 5000) return 'planning';
  if (months >= 12) return 'approvals';
  if (months >= 8) return 'construction';
  if (months >= 5) return 'handover';
  return 'stabilized';
}

export function computeRegionalHousingPipeline(
  regionId: string,
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): RegionalHousingPipelineState {
  const base =
    AGENT14_HOUSING_REGION_BASELINE[regionId as Agent14CoreRegion] ??
    AGENT14_HOUSING_REGION_BASELINE.NSW;
  const regionalBoost = spending.regionalKpiDelta[regionId]?.housing ?? 0;
  const remoteShare = base.remoteShare;

  let planningBacklogMonths = base.planningBacklogMonths;
  planningBacklogMonths += remoteShare * 14;
  planningBacklogMonths -= regionalBoost * 0.35;
  planningBacklogMonths -= (fiscalHeadroom - 50) * 0.04;
  if (capacity.bindingConstraint === 'fiscal_absorption') planningBacklogMonths += 3;
  if (capacity.byPillar.housing.loadRatio > 1.1) planningBacklogMonths += 2;
  planningBacklogMonths = clamp(planningBacklogMonths, 4, 28);

  let dwellingsInPipeline = base.baselinePipelineDwellings;
  dwellingsInPipeline += Math.floor(regionalBoost * 120);
  dwellingsInPipeline -= Math.floor((planningBacklogMonths - 10) * 40);
  dwellingsInPipeline = Math.max(80, dwellingsInPipeline);

  const socialHousingCompletionsRate = clamp(
    12 + regionalBoost * 4 + (capacity.byPillar.housing.capacityIndex - 50) * 0.12 - remoteShare * 18,
    2,
    45
  );

  let affordabilityIndex = base.affordabilityBaseline;
  affordabilityIndex += (fiscalHeadroom - 50) * 0.15;
  affordabilityIndex += regionalBoost * 1.2;
  affordabilityIndex -= remoteShare * 22;
  affordabilityIndex -= Math.max(0, planningBacklogMonths - 12) * 1.1;
  affordabilityIndex = clamp(affordabilityIndex);

  const deliveryPressure = clamp(
    planningBacklogMonths * 2.8 + remoteShare * 35 - socialHousingCompletionsRate * 0.9
  );

  return {
    regionId,
    stage: stageFromBacklog(planningBacklogMonths, dwellingsInPipeline),
    planningBacklogMonths,
    dwellingsInPipeline,
    socialHousingCompletionsRate,
    affordabilityStress: stressBand(affordabilityIndex),
    affordabilityIndex,
    remoteShare,
    deliveryPressure,
    evidence: [
      `t${turn}`,
      `backlog=${planningBacklogMonths}m`,
      `pipeline=${dwellingsInPipeline}`,
      `boost=${regionalBoost.toFixed(2)}`,
    ],
  };
}

export function computeAllRegionalHousingPipelines(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): Record<string, RegionalHousingPipelineState> {
  const out: Record<string, RegionalHousingPipelineState> = {};
  for (const r of AGENT14_CORE_REGIONS) {
    out[r] = computeRegionalHousingPipeline(r, turn, capacity, spending, fiscalHeadroom);
  }
  return out;
}


// --- source: national-wellbeing-snapshot.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function stressBand(index: number): AffordabilityStressBand {
  if (index >= 62) return 'low';
  if (index >= 48) return 'moderate';
  if (index >= 34) return 'elevated';
  return 'severe';
}

export function computeNationalHousingWellbeingSnapshot(
  turn: number,
  regions: Record<string, RegionalHousingPipelineState>
): NationalHousingWellbeingSnapshot {
  const list = AGENT14_CORE_REGIONS.map((id) => regions[id]).filter(Boolean);
  const affIndices = list.map((r) => r.affordabilityIndex);
  const minAff = Math.min(...affIndices);
  const maxAff = Math.max(...affIndices);
  const nationalAffordabilityIndex =
    affIndices.length > 0 ? clamp(affIndices.reduce((a, b) => a + b, 0) / affIndices.length) : 50;

  const averagePlanningBacklogMonths =
    list.length > 0
      ? clamp(list.reduce((s, r) => s + r.planningBacklogMonths, 0) / list.length)
      : 12;

  const totalDwellingsInPipeline = list.reduce((s, r) => s + r.dwellingsInPipeline, 0);

  const socialCompletionsIndex = clamp(
    list.length > 0
      ? list.reduce((s, r) => s + r.socialHousingCompletionsRate, 0) / list.length
      : 10
  );

  const regionalEquityGap = clamp(maxAff - minAff);

  const worst = list.reduce(
    (w, r) => (r.affordabilityIndex < w.affordabilityIndex ? r : w),
    list[0]!
  );
  const best = list.reduce(
    (b, r) => (r.affordabilityIndex > b.affordabilityIndex ? r : b),
    list[0]!
  );

  const narrativeSummary =
    list.length === 0
      ? 'No regional housing pipeline data.'
      : `National affordability ${nationalAffordabilityIndex} (${stressBand(nationalAffordabilityIndex)}). ` +
        `Backlog avg ${averagePlanningBacklogMonths}m; pipeline ${totalDwellingsInPipeline} dwellings. ` +
        `Equity gap ${regionalEquityGap} (${worst.regionId} ${worst.affordabilityIndex} → ${best.regionId} ${best.affordabilityIndex}).`;

  return {
    turn,
    nationalAffordabilityIndex,
    affordabilityStress: stressBand(nationalAffordabilityIndex),
    averagePlanningBacklogMonths,
    totalDwellingsInPipeline,
    socialCompletionsIndex,
    regionalEquityGap,
    regions,
    narrativeSummary,
  };
}


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
    schemaVersion: '10.14.3-scale-wave-3' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.3-scale-wave-3' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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

  const fiscalHeadroom = args.inputs.fiscalHeadroom ?? 55;
  const regionalPipelines = computeAllRegionalHousingPipelines(
    turn,
    capacity,
    effects,
    fiscalHeadroom
  );
  const housingWellbeing = computeNationalHousingWellbeingSnapshot(turn, regionalPipelines);

  const remoteShareByRegion = Object.fromEntries(
    AGENT14_CORE_REGIONS.map((r) => [r, AGENT14_HOUSING_REGION_BASELINE[r].remoteShare])
  );
  const serviceAccessLens = computeNationalServiceAccessLens(
    turn,
    capacity,
    effects,
    remoteShareByRegion
  );
  const wellbeingWarnings = evaluateAgent14WellbeingWarnings(
    capacity,
    housingWellbeing,
    serviceAccessLens
  );
  const programRecommendations = recommendAgent14ProgramSequence(
    turn,
    capacity,
    housingWellbeing,
    serviceAccessLens,
    6
  );

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
    housingWellbeing,
    serviceAccessLens,
    wellbeingWarnings,
    programRecommendations,
  };

  return { inputs: enriched, spendingPersisted, rejectedCommitments };
}


// --- source: scenario-sweep.ts ---
export type Agent14HousingScenarioId =
  | 'baseline_steady'
  | 'fiscal_austerity'
  | 'remote_equity_stress'
  | 'housing_acceleration'
  | 'workforce_blocking'
  | 'crisis_recovery'
  | 'mixed_pillar_push'
  | 'capacity_saturated';

export interface Agent14HousingScenarioDefinition {
  id: Agent14HousingScenarioId;
  label: string;
  baseInputs: Partial<CapacityAndSpendingInputs>;
  /** Program stub ids committed on turn 1 (from AGENT14_HOUSING_PROGRAM_STUBS). */
  launchProgramIds: string[];
}

export const AGENT14_HOUSING_SCENARIOS: readonly Agent14HousingScenarioDefinition[] = [
  {
    id: 'baseline_steady',
    label: 'Steady baseline',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_VIC_planning_reform'],
  },
  {
    id: 'fiscal_austerity',
    label: 'Fiscal austerity',
    baseInputs: { fiscalHeadroom: 28, stateCapacityLoad: 62, workforceReadiness: 'strained' },
    launchProgramIds: ['ps_h_SA_modular'],
  },
  {
    id: 'remote_equity_stress',
    label: 'Remote equity stress',
    baseInputs: { fiscalHeadroom: 45, stateCapacityLoad: 55, workforceSpecialistGap: 48 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_h_WA_remote_housing'],
  },
  {
    id: 'housing_acceleration',
    label: 'Housing acceleration',
    baseInputs: { fiscalHeadroom: 78, stateCapacityLoad: 30, workforceReadiness: 'strong' },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_ACT_density', 'ps_h_NSW_social_accel'],
  },
  {
    id: 'workforce_blocking',
    label: 'Workforce blocking',
    baseInputs: { fiscalHeadroom: 52, stateCapacityLoad: 50, workforceReadiness: 'blocking', workforceSpecialistGap: 72 },
    launchProgramIds: ['ps_h_TAS_affordable'],
  },
  {
    id: 'crisis_recovery',
    label: 'Crisis recovery',
    baseInputs: { fiscalHeadroom: 32, stateCapacityLoad: 78, workforceReadiness: 'weak', workforceSpecialistGap: 55 },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_SA_modular'],
  },
  {
    id: 'mixed_pillar_push',
    label: 'Mixed pillar push',
    baseInputs: { fiscalHeadroom: 62, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_WA_remote_housing', 'ps_h_ACT_density'],
  },
  {
    id: 'capacity_saturated',
    label: 'Capacity saturated',
    baseInputs: { fiscalHeadroom: 35, stateCapacityLoad: 80, workforceReadiness: 'strained', workforceSpecialistGap: 60 },
    launchProgramIds: [
      'ps_h_NSW_social_accel',
      'ps_h_VIC_planning_reform',
      'ps_h_QLD_regional_release',
      'ps_h_WA_remote_housing',
      'ps_h_NT_remote_housing',
      'ps_h_TAS_affordable',
      'ps_h_SA_modular',
      'ps_h_ACT_density',
    ],
  },
];

export function commitmentFromProgramStub(
  stubId: string,
  committedTurn: number,
  seq: number
): SpendingCommitment | null {
  const stub = AGENT14_HOUSING_PROGRAM_STUBS.find((p) => p.id === stubId);
  if (!stub) return null;
  return makeSpendingCommitment({
    id: `${stub.id}_c${seq}`,
    programId: stub.id,
    pillar: 'housing',
    regionId: stub.regionId,
    committedTurn,
    fiscalLoadPoints: stub.fiscalLoadPoints,
    durationTurns: stub.durationTurns,
    baseImpact: stub.baseImpact,
    effectLagTurns: stub.effectLagTurns,
    rampTurns: 3,
  });
}

export function simulateAgent14HousingScenario(
  scenarioId: Agent14HousingScenarioId,
  turnCount: number
): {
  scenario: Agent14HousingScenarioDefinition;
  turns: EnrichedPublicServiceTurnInputs[];
  spendingPersisted: DelayedSpendingPersisted;
} {
  const scenario = AGENT14_HOUSING_SCENARIOS.find((s) => s.id === scenarioId)!;
  const maxTurns = Math.min(Math.max(1, turnCount), AGENT14_LIMITS.maxSimulationTurns);
  let spendingPersisted: DelayedSpendingPersisted | null = null;
  const turns: EnrichedPublicServiceTurnInputs[] = [];

  for (let t = 1; t <= maxTurns; t += 1) {
    const newCommitments: SpendingCommitment[] = [];
    if (t === 1) {
      scenario.launchProgramIds.forEach((pid, i) => {
        const c = commitmentFromProgramStub(pid, 1, i);
        if (c) newCommitments.push(c);
      });
    }
    const result = advancePublicServicesTurn({
      inputs: { turn: t, ...scenario.baseInputs },
      spendingPersisted,
      newCommitments,
      enforceCapacity: true,
    });
    spendingPersisted = result.spendingPersisted;
    turns.push(result.inputs);
  }

  return { scenario, turns, spendingPersisted: spendingPersisted! };
}

export function runAgent14HousingScenarioSweep(): Array<{
  scenarioId: Agent14HousingScenarioId;
  passed: boolean;
  detail: string;
}> {
  const out: Array<{ scenarioId: Agent14HousingScenarioId; passed: boolean; detail: string }> = [];
  for (const sc of AGENT14_HOUSING_SCENARIOS) {
    const sim = simulateAgent14HousingScenario(sc.id, 12);
    const last = sim.turns[sim.turns.length - 1];
    const wb = last.housingWellbeing;
    const ok =
      Boolean(wb) &&
      last.capacity.deliveryCapacityIndex > 0 &&
      wb!.totalDwellingsInPipeline > 0 &&
      wb!.narrativeSummary.length > 20;
    out.push({
      scenarioId: sc.id,
      passed: ok,
      detail: ok
        ? `aff=${wb!.nationalAffordabilityIndex} gap=${wb!.regionalEquityGap}`
        : 'missing wellbeing snapshot',
    });
  }
  return out;
}


// --- source: service-access-lens.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromIndex(index: number): ServiceAccessBand {
  if (index >= 72) return 'strong';
  if (index >= 55) return 'adequate';
  if (index >= 38) return 'weak';
  return 'critical';
}

function pillarSlice(
  pillar: PublicServicePillar,
  base: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  regionalDelta: number
): PillarAccessSlice {
  const capSlice = capacity.byPillar[pillar];
  const boost = spending.completedProjectBoost[pillar];
  let accessIndex = base;
  accessIndex += boost * 8;
  accessIndex += (capSlice.capacityIndex - 50) * 0.25;
  accessIndex += regionalDelta * 1.5;
  accessIndex -= capSlice.loadRatio > 1 ? (capSlice.loadRatio - 1) * 12 : 0;
  accessIndex = clamp(accessIndex);
  const backlogPressure = clamp(100 - accessIndex + capSlice.loadRatio * 15);
  return { pillar, accessIndex, band: bandFromIndex(accessIndex), backlogPressure };
}

export function computeRegionalServiceAccess(
  regionId: string,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShare: number
): RegionalServiceAccessState {
  const delta = spending.regionalKpiDelta[regionId] ?? {};
  const remotePenalty = remoteShare * 18;
  const housing = pillarSlice(
    'housing',
    58 - remotePenalty,
    capacity,
    spending,
    delta.housing ?? 0
  );
  const healthcare = pillarSlice(
    'healthcare',
    62 - remotePenalty * 0.9,
    capacity,
    spending,
    delta.healthcare ?? 0
  );
  const education = pillarSlice(
    'education',
    60 - remotePenalty * 0.85,
    capacity,
    spending,
    delta.education ?? 0
  );
  const compositeIndex = clamp((housing.accessIndex + healthcare.accessIndex + education.accessIndex) / 3);
  return {
    regionId,
    pillars: { housing, healthcare, education },
    compositeIndex,
  };
}

export function computeNationalServiceAccessLens(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShareByRegion: Record<string, number>
): NationalServiceAccessLens {
  const regions: Record<string, RegionalServiceAccessState> = {};
  const composites: number[] = [];
  for (const r of AGENT14_CORE_REGIONS) {
    const st = computeRegionalServiceAccess(
      r,
      capacity,
      spending,
      remoteShareByRegion[r] ?? 0.1
    );
    regions[r] = st;
    composites.push(st.compositeIndex);
  }
  const nationalComposite =
    composites.length > 0 ? clamp(composites.reduce((a, b) => a + b, 0) / composites.length) : 50;
  const equityGap = clamp(Math.max(...composites) - Math.min(...composites));

  const pillarNational = {} as Record<PublicServicePillar, PillarAccessSlice>;
  for (const pillar of ['housing', 'healthcare', 'education'] as PublicServicePillar[]) {
    const avg =
      AGENT14_CORE_REGIONS.reduce((s, rid) => s + regions[rid]!.pillars[pillar].accessIndex, 0) /
      AGENT14_CORE_REGIONS.length;
    pillarNational[pillar] = {
      pillar,
      accessIndex: clamp(avg),
      band: bandFromIndex(avg),
      backlogPressure: clamp(100 - avg),
    };
  }

  return {
    turn,
    nationalComposite,
    nationalBand: bandFromIndex(nationalComposite),
    pillarNational,
    regions,
    equityGap,
  };
}


// --- source: wellbeing-guardian-warnings.ts ---
export function evaluateAgent14WellbeingWarnings(
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens
): Agent14WellbeingWarningBundle {
  const warnings: Agent14WellbeingWarning[] = [];
  const assumptions = [
    'Warn-only V10.14 modular slice; does not block player actions.',
    'Uses capacity, housing pipeline, and service access lens only.',
  ];

  if (capacity.bindingConstraint === 'fiscal_absorption') {
    warnings.push({
      id: 'warn_fiscal_absorption',
      severity: 'elevated',
      pillar: 'cross',
      title: 'Fiscal absorption saturated',
      summary: `Public program fiscal load (${capacity.fiscalLoadScheduledThisTurn}) exceeds absorption cap (${capacity.fiscalAbsorptionCap}). Delay new commitments or relieve load.`,
      assumptions,
    });
  }

  if (capacity.bindingConstraint === 'program_slots') {
    warnings.push({
      id: 'warn_program_slots',
      severity: 'watch',
      pillar: 'cross',
      title: 'National program slots full',
      summary: `All ${capacity.nationalProgramSlots} national program slots are in use; sequencing required before new housing/health/education packages.`,
      assumptions,
    });
  }

  if (housing.regionalEquityGap >= 40) {
    warnings.push({
      id: 'warn_housing_equity',
      severity: 'elevated',
      pillar: 'housing',
      title: 'Regional housing equity gap',
      summary: `Affordability equity gap ${housing.regionalEquityGap} exceeds tolerance; remote and backlog-heavy regions lag capitals.`,
      assumptions,
    });
  }

  if (housing.affordabilityStress === 'severe') {
    warnings.push({
      id: 'warn_affordability_severe',
      severity: 'critical',
      pillar: 'housing',
      title: 'Severe affordability stress',
      summary: `National affordability index ${housing.nationalAffordabilityIndex} (${housing.affordabilityStress}).`,
      assumptions,
    });
  }

  for (const pillar of ['healthcare', 'education', 'housing'] as const) {
    const p = access.pillarNational[pillar];
    if (p.band === 'critical' || p.band === 'weak') {
      warnings.push({
        id: `warn_${pillar}_access`,
        severity: p.band === 'critical' ? 'critical' : 'watch',
        pillar,
        title: `${pillar} access strain`,
        summary: `National ${pillar} access index ${p.accessIndex} (${p.band}); backlog pressure ${p.backlogPressure}.`,
        assumptions,
      });
    }
  }

  if (access.equityGap >= 35) {
    warnings.push({
      id: 'warn_service_equity',
      severity: 'watch',
      pillar: 'cross',
      title: 'Service access equity divergence',
      summary: `Cross-pillar regional composite equity gap ${access.equityGap}.`,
      assumptions,
    });
  }

  const shouldSurface = warnings.some((w) => w.severity === 'critical' || w.severity === 'elevated');
  return { shouldSurface, warnings: warnings.slice(0, 8) };
}


// --- source: program-sequencing.ts ---
export function recommendAgent14ProgramSequence(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens,
  limit = 5
): ProgramSequencingRecommendation[] {
  const recs: ProgramSequencingRecommendation[] = [];
  const worstRegions = Object.values(housing.regions)
    .sort((a, b) => a.affordabilityIndex - b.affordabilityIndex)
    .slice(0, 4)
    .map((r) => r.regionId);

  const pillarPriority: PublicServicePillar[] =
    access.pillarNational.healthcare.band === 'critical' || access.pillarNational.healthcare.band === 'weak'
      ? ['healthcare', 'housing', 'education']
      : access.pillarNational.education.band === 'critical' || access.pillarNational.education.band === 'weak'
        ? ['education', 'housing', 'healthcare']
        : ['housing', 'healthcare', 'education'];

  let rank = 1;
  for (const regionId of worstRegions) {
    for (const pillar of pillarPriority) {
      const stub = AGENT14_HOUSING_PROGRAM_STUBS.find(
        (p) => p.regionId === (regionId as Agent14CoreRegion) && pillar === 'housing'
      );
      if (!stub && pillar !== 'housing') continue;
      const programId =
        stub?.id ??
        `ps_seq_${regionId}_${pillar}_${turn}`;
      const commitment =
        commitmentFromProgramStub(stub?.id ?? AGENT14_HOUSING_PROGRAM_STUBS[0]!.id, turn, rank) ??
        null;
      const fitsCapacity = commitment
        ? canAcceptSpendingCommitment(capacity, commitment).allowed
        : false;
      recs.push({
        rank,
        programId,
        regionId,
        pillar,
        rationale:
          pillar === 'housing'
            ? `Backlog ${housing.regions[regionId]?.planningBacklogMonths ?? '?'}m in ${regionId}; affordability ${housing.regions[regionId]?.affordabilityIndex ?? '?'}`
            : `${pillar} national band ${access.pillarNational[pillar].band}; uplift ${regionId} composite ${access.regions[regionId]?.compositeIndex ?? '?'}`,
        expectedLagTurns: stub?.effectLagTurns ?? 2,
        fitsCapacity,
      });
      rank += 1;
      if (recs.length >= limit) return recs;
    }
  }

  for (const stub of AGENT14_HOUSING_PROGRAM_STUBS) {
    if (recs.some((r) => r.programId === stub.id)) continue;
    const baseline = AGENT14_HOUSING_REGION_BASELINE[stub.regionId];
    const commitment = commitmentFromProgramStub(stub.id, turn, rank)!;
    recs.push({
      rank,
      programId: stub.id,
      regionId: stub.regionId,
      pillar: 'housing',
      rationale: `Catalog stub; remote ${baseline.remoteShare} planning ${baseline.planningBacklogMonths}m`,
      expectedLagTurns: stub.effectLagTurns,
      fitsCapacity: canAcceptSpendingCommitment(capacity, commitment).allowed,
    });
    rank += 1;
    if (recs.length >= limit) break;
  }

  return recs;
}


// --- source: wellbeing-forecast.ts ---
export function forecastAgent14WellbeingTurns(
  scenarioId: Agent14HousingScenarioId,
  horizonTurns: number,
  startTurn = 1
): WellbeingMultiTurnForecast {
  const sim = simulateAgent14HousingScenario(scenarioId, startTurn + horizonTurns - 1);
  const points: WellbeingTurnForecastPoint[] = sim.turns.slice(-horizonTurns).map((inp) => ({
    turn: inp.turn,
    affordabilityIndex: inp.housingWellbeing?.nationalAffordabilityIndex ?? 0,
    deliveryCapacityIndex: inp.capacity.deliveryCapacityIndex,
    fiscalLoad: inp.fiscalLoadFromActivePrograms,
    equityGap: inp.housingWellbeing?.regionalEquityGap ?? 0,
  }));
  return { scenarioId, horizonTurns, points };
}

export function forecastFromInputs(
  baseInputs: CapacityAndSpendingInputs,
  horizonTurns: number
): WellbeingTurnForecastPoint[] {
  const remoteShareByRegion = Object.fromEntries(
    Object.entries(AGENT14_HOUSING_REGION_BASELINE).map(([k, v]) => [k, v.remoteShare])
  );
  void remoteShareByRegion;
  let spendingPersisted = null;
  const points: WellbeingTurnForecastPoint[] = [];
  const start = Math.max(1, baseInputs.turn || 1);
  for (let t = start; t < start + horizonTurns; t += 1) {
    const r = advancePublicServicesTurn({
      inputs: { ...baseInputs, turn: t },
      spendingPersisted,
    });
    spendingPersisted = r.spendingPersisted;
    points.push({
      turn: t,
      affordabilityIndex: r.inputs.housingWellbeing?.nationalAffordabilityIndex ?? 0,
      deliveryCapacityIndex: r.inputs.capacity.deliveryCapacityIndex,
      fiscalLoad: r.inputs.fiscalLoadFromActivePrograms,
      equityGap: r.inputs.housingWellbeing?.regionalEquityGap ?? 0,
    });
  }
  return points;
}

export function listAgent14ScenarioIds(): Agent14HousingScenarioId[] {
  return AGENT14_HOUSING_SCENARIOS.map((s) => s.id);
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

  check(
    results,
    'housing_region_baselines_count',
    'Eight core regions have housing baselines',
    AGENT14_CORE_REGIONS.length === 8 &&
      AGENT14_CORE_REGIONS.every((r) => r in AGENT14_HOUSING_REGION_BASELINE),
    `regions=${AGENT14_CORE_REGIONS.length} stubs=${AGENT14_HOUSING_PROGRAM_STUBS.length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 65, stateCapacityLoad: 35 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wb = adv.inputs.housingWellbeing;
    check(
      results,
      'housing_wellbeing_snapshot_attached',
      'Turn advance attaches national housing wellbeing snapshot',
      Boolean(wb) && Object.keys(wb!.regions).length === 8,
      `aff=${wb?.nationalAffordabilityIndex} stress=${wb?.affordabilityStress}`
    );
  }

  {
    const cap = computePublicServiceCapacity(
      { turn: 4, fiscalHeadroom: 70, stateCapacityLoad: 25 },
      []
    );
    const spending = advanceDelayedSpendingEffects(4, createInitialDelayedSpendingPersisted()).effects;
    const regions = computeAllRegionalHousingPipelines(4, cap, spending, 70);
    const nt = regions.NT;
    const act = regions.ACT;
    check(
      results,
      'housing_remote_nt_pressure',
      'NT remote share yields higher planning backlog than ACT',
      nt.planningBacklogMonths > act.planningBacklogMonths && nt.remoteShare > act.remoteShare,
      `NT=${nt.planningBacklogMonths}m ACT=${act.planningBacklogMonths}m`
    );
  }

  {
    const capLow = computePublicServiceCapacity({ turn: 3, fiscalHeadroom: 25, stateCapacityLoad: 60 }, []);
    const capHigh = computePublicServiceCapacity({ turn: 3, fiscalHeadroom: 80, stateCapacityLoad: 60 }, []);
    const spend = advanceDelayedSpendingEffects(3, createInitialDelayedSpendingPersisted()).effects;
    const low = computeAllRegionalHousingPipelines(3, capLow, spend, 25).NSW;
    const high = computeAllRegionalHousingPipelines(3, capHigh, spend, 80).NSW;
    check(
      results,
      'housing_fiscal_headroom_affordability',
      'Higher fiscal headroom improves NSW affordability index',
      high.affordabilityIndex > low.affordabilityIndex,
      `low=${low.affordabilityIndex} high=${high.affordabilityIndex}`
    );
  }

  {
    const snap = computeNationalHousingWellbeingSnapshot(
      5,
      computeAllRegionalHousingPipelines(
        5,
        computePublicServiceCapacity({ turn: 5, fiscalHeadroom: 50 }, []),
        advanceDelayedSpendingEffects(5, createInitialDelayedSpendingPersisted()).effects,
        50
      )
    );
    check(
      results,
      'housing_national_narrative',
      'National snapshot produces non-empty narrative',
      snap.narrativeSummary.length > 40 && snap.regionalEquityGap >= 0,
      snap.narrativeSummary.slice(0, 60)
    );
  }

  {
    const c = commitmentFromProgramStub('ps_h_NSW_social_accel', 2, 0);
    check(
      results,
      'housing_program_stub_commitment',
      'Program stub maps to spending commitment',
      c !== null && c!.pillar === 'housing' && c!.regionId === 'NSW',
      `id=${c?.id} load=${c?.fiscalLoadPoints}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('housing_acceleration', 10);
    const t1 = sim.turns[0];
    const t10 = sim.turns[9];
    check(
      results,
      'housing_scenario_acceleration',
      'Housing acceleration scenario runs 10 turns with programs',
      sim.turns.length === 10 &&
        t1.activeProgramCount >= 1 &&
        t10.housingWellbeing!.socialCompletionsIndex > 0,
      `active t1=${t1.activeProgramCount} social t10=${t10.housingWellbeing?.socialCompletionsIndex}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('fiscal_austerity', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'housing_scenario_austerity_capacity',
      'Austerity scenario keeps delivery capacity index bounded',
      last.capacity.deliveryCapacityIndex >= 20 && last.capacity.deliveryCapacityIndex <= 100,
      `delivery=${last.capacity.deliveryCapacityIndex} binding=${last.capacity.bindingConstraint}`
    );
  }

  {
    const remote = simulateAgent14HousingScenario('remote_equity_stress', 12);
    check(
      results,
      'housing_scenario_equity_gap',
      'Remote stress scenario reports regional equity gap',
      remote.turns[11].housingWellbeing!.regionalEquityGap >= 5,
      `gap=${remote.turns[11].housingWellbeing?.regionalEquityGap}`
    );
  }

  for (const row of runAgent14HousingScenarioSweep()) {
    check(
      results,
      `housing_sweep_${row.scenarioId}`,
      `Scenario sweep: ${row.scenarioId}`,
      row.passed,
      row.detail
    );
  }

  {
    const bad = sanitizeDelayedSpendingPersisted({
      schemaVersion: '10.14.2-housing-depth' as any,
      active: [{ id: 'x', committedTurn: 1 } as any],
      history: [],
    });
    check(
      results,
      'housing_sanitize_commitment_filter',
      'Sanitize drops malformed commitments',
      bad.active.length === 0,
      `active=${bad.active.length}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    for (let i = 0; i < 30; i += 1) {
      persisted = commitSpendingProgram(
        persisted,
        makeSpendingCommitment({
          id: `hist_${i}`,
          programId: 'p',
          pillar: 'housing',
          regionId: 'NSW',
          committedTurn: 1,
          fiscalLoadPoints: 4,
          durationTurns: 2,
          baseImpact: 3,
        })
      );
    }
    check(
      results,
      'housing_history_cap',
      'Commit history respects max active cap',
      persisted.active.length <= 24,
      `active=${persisted.active.length}`
    );
  }

  for (let v = 0; v < 8; v += 1) {
    const adv = advancePublicServicesTurn({
      inputs: {
        turn: v + 1,
        fiscalHeadroom: 40 + v * 5,
        stateCapacityLoad: 50 - v * 2,
        workforceReadiness: v % 2 === 0 ? 'balanced' : 'strained',
      },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      `housing_variant_turn_${v + 1}`,
      `Variant turn ${v + 1} wellbeing snapshot valid`,
      adv.inputs.housingWellbeing !== undefined &&
        adv.inputs.housingWellbeing!.nationalAffordabilityIndex >= 0 &&
        adv.inputs.housingWellbeing!.nationalAffordabilityIndex <= 100,
      `aff=${adv.inputs.housingWellbeing?.nationalAffordabilityIndex}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 55, stateCapacityLoad: 45 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave3_service_access_lens',
      'Turn advance attaches national service access lens',
      adv.inputs.serviceAccessLens !== undefined &&
        adv.inputs.serviceAccessLens!.nationalComposite > 0 &&
        adv.inputs.serviceAccessLens!.pillarNational.healthcare.accessIndex > 0,
      `composite=${adv.inputs.serviceAccessLens?.nationalComposite} band=${adv.inputs.serviceAccessLens?.nationalBand}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 25, stateCapacityLoad: 75, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: Array.from({ length: 6 }, (_, i) =>
        makeSpendingCommitment({
          id: `sat_${i}`,
          programId: 'p',
          pillar: 'housing',
          regionId: 'NSW',
          committedTurn: 3,
          fiscalLoadPoints: 30,
          durationTurns: 5,
          baseImpact: 6,
        })
      ),
      enforceCapacity: false,
    });
    check(
      results,
      'wave3_wellbeing_warnings',
      'Strained inputs produce guardian warning bundle',
      adv.inputs.wellbeingWarnings !== undefined &&
        adv.inputs.wellbeingWarnings!.warnings.length >= 1,
      `surface=${adv.inputs.wellbeingWarnings?.shouldSurface} n=${adv.inputs.wellbeingWarnings?.warnings.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 60, stateCapacityLoad: 40 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave3_program_recommendations',
      'Program sequencing returns ranked recommendations',
      (adv.inputs.programRecommendations?.length ?? 0) >= 3 &&
        adv.inputs.programRecommendations![0].rank === 1,
      `n=${adv.inputs.programRecommendations?.length} first=${adv.inputs.programRecommendations?.[0]?.programId}`
    );
  }

  {
    const fc = forecastAgent14WellbeingTurns('baseline_steady', 6);
    check(
      results,
      'wave3_forecast_scenario',
      'Scenario forecast returns horizon points',
      fc.points.length === 6 && fc.points[0].turn >= 1,
      `scenario=${fc.scenarioId} turns=${fc.points.length}`
    );
  }

  {
    const pts = forecastFromInputs({ turn: 1, fiscalHeadroom: 50, stateCapacityLoad: 45 }, 4);
    check(
      results,
      'wave3_forecast_inputs',
      'Input forecast monotonic turn labels',
      pts.length === 4 && pts[3].turn === 4,
      `t4 aff=${pts[3].affordabilityIndex}`
    );
  }

  check(
    results,
    'wave3_scenario_catalog_size',
    'Eight housing scenarios registered',
    listAgent14ScenarioIds().length === 8,
    `ids=${listAgent14ScenarioIds().join(',')}`
  );

  {
    const sim = simulateAgent14HousingScenario('capacity_saturated', 6);
    check(
      results,
      'wave3_capacity_saturated_scenario',
      'Saturated scenario runs with rejections or binding',
      sim.turns.length === 6 &&
        (sim.turns[5].capacity.bindingConstraint !== 'none' ||
          sim.turns[5].activeProgramCount >= 3),
      `binding=${sim.turns[5].capacity.bindingConstraint} active=${sim.turns[5].activeProgramCount}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 48, stateCapacityLoad: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const lens = adv.inputs.serviceAccessLens!;
    const wb = adv.inputs.housingWellbeing!;
    const direct = evaluateAgent14WellbeingWarnings(adv.inputs.capacity, wb, lens);
    check(
      results,
      'wave3_warnings_idempotent',
      'Standalone warning evaluator matches turn bundle shape',
      direct.warnings.length === adv.inputs.wellbeingWarnings!.warnings.length,
      `n=${direct.warnings.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 68, stateCapacityLoad: 32 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const recs = recommendAgent14ProgramSequence(
      7,
      adv.inputs.capacity,
      adv.inputs.housingWellbeing!,
      adv.inputs.serviceAccessLens!,
      4
    );
    check(
      results,
      'wave3_recommendations_sorted',
      'Recommendations have contiguous ranks',
      recs.every((r, i) => r.rank === i + 1),
      recs.map((r) => r.programId).join(',')
    );
  }

  {
    const cap = computePublicServiceCapacity({ turn: 1, fiscalHeadroom: 55 }, []);
    const spend = advanceDelayedSpendingEffects(1, createInitialDelayedSpendingPersisted()).effects;
    const lens = computeNationalServiceAccessLens(1, cap, spend, { NSW: 0.08, NT: 0.55 });
    check(
      results,
      'wave3_access_lens_equity',
      'Service access lens computes equity gap',
      lens.equityGap >= 0 && lens.regions.NSW!.compositeIndex >= lens.regions.NT!.compositeIndex - 5,
      `gap=${lens.equityGap} NSW=${lens.regions.NSW?.compositeIndex} NT=${lens.regions.NT?.compositeIndex}`
    );
  }

  for (const id of ['crisis_recovery', 'mixed_pillar_push'] as const) {
    const sim = simulateAgent14HousingScenario(id, 8);
    const last = sim.turns[7];
    check(
      results,
      `wave3_scenario_${id}`,
      `Scenario ${id} completes 8 turns with access lens`,
      last.serviceAccessLens !== undefined && last.programRecommendations!.length >= 3,
      `composite=${last.serviceAccessLens?.nationalComposite}`
    );
  }

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}


// OP10M_MODULE_END agent-14-housing
