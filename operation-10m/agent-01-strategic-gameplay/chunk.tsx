// OP10M_MODULE_BEGIN agent-01-strategic-gameplay
// content-sha256-prefix: 847115580c673b1a
// Operation 10M — Agent 01 Strategic Gameplay

// Bundled for Agent 25 assembly (no external imports).

// --- src/contracts/economy.ts ---

/**
 * Agent 01 — integration contracts (economy slice).
 * Canonical V9.4 adapters implement these shapes; this module consumes snapshots and emits patches.
 */

export type EconomyDomainId =
  | 'treasury'
  | 'markets'
  | 'investments'
  | 'trade'
  | 'households';

export interface EconomySnapshot {
  day: number;
  cashOnHand: number;
  treasuryReserve: number;
  debtOutstanding: number;
  inflationIndex: number;
  priceMultiplier: number;
  investmentLockout: boolean;
  netWorthEstimate: number;
}

export interface EconomyPatch {
  cashDelta?: number;
  treasuryDelta?: number;
  debtDelta?: number;
  inflationDelta?: number;
  priceMultiplierFactor?: number;
  investmentLockout?: boolean;
  netWorthMultiplier?: number;
  domainsTouched?: EconomyDomainId[];
  ledgerNote?: string;
}

export interface EconomyContract {
  readonly moduleId: 'agent-01-economy';
  snapshot(): EconomySnapshot;
  applyPatch(patch: EconomyPatch): EconomySnapshot;
  canAfford(cashCost: number, treasuryCost?: number): boolean;
}

// --- src/contracts/government.ts ---

/** Agent 01 — government / governance contract slice. */

export type GovernanceAuthorityMode = 'off' | 'shadow' | 'shared' | 'mandate';

export interface GovernanceSnapshot {
  day: number;
  approvalRating: number;
  directiveSlotsUsed: number;
  directiveSlotCap: number;
  authorityMode: GovernanceAuthorityMode;
  pendingReliefClaims: number;
  regulatoryBurden: number;
}

export interface GovernancePatch {
  approvalDelta?: number;
  directiveSlotsDelta?: number;
  regulatoryBurdenDelta?: number;
  reliefClaimsDelta?: number;
  authorityMode?: GovernanceAuthorityMode;
  issuedDirectiveId?: string;
  ledgerNote?: string;
}

export interface GovernmentContract {
  readonly moduleId: 'agent-01-government';
  snapshot(): GovernanceSnapshot;
  applyPatch(patch: GovernancePatch): GovernanceSnapshot;
  canIssueDirective(apCost: number): boolean;
}

// --- src/contracts/population.ts ---

/** Agent 01 — population / household contract slice. */

export interface PopulationSnapshot {
  day: number;
  totalPopulation: number;
  migrationBalance: number;
  essentialAccessIndex: number;
  affordabilityStress: number;
  publicStability: number;
}

export interface PopulationPatch {
  populationDelta?: number;
  migrationDelta?: number;
  essentialAccessDelta?: number;
  affordabilityStressDelta?: number;
  publicStabilityDelta?: number;
  ledgerNote?: string;
}

export interface PopulationContract {
  readonly moduleId: 'agent-01-population';
  snapshot(): PopulationSnapshot;
  applyPatch(patch: PopulationPatch): PopulationSnapshot;
  stressBand(): 'stable' | 'strained' | 'critical';
}

// --- src/contracts/tech.ts ---

/** Agent 01 — technology / innovation contract slice. */

export type TechTrackId =
  | 'digital_infrastructure'
  | 'renewable_energy'
  | 'advanced_manufacturing'
  | 'biotech'
  | 'defence_dual_use';

export interface TechSnapshot {
  day: number;
  researchPoints: number;
  unlockedTracks: TechTrackId[];
  readinessByTrack: Record<TechTrackId, number>;
  innovationMomentum: number;
}

export interface TechPatch {
  researchDelta?: number;
  unlockTrack?: TechTrackId;
  readinessDelta?: Partial<Record<TechTrackId, number>>;
  momentumDelta?: number;
  ledgerNote?: string;
}

export interface TechContract {
  readonly moduleId: 'agent-01-tech';
  snapshot(): TechSnapshot;
  applyPatch(patch: TechPatch): TechSnapshot;
  meetsPrerequisite(track: TechTrackId, minReadiness: number): boolean;
}

// --- src/contracts/ui.ts ---

/** Agent 01 — UI / intent surfacing contract slice (no React in this module). */

export interface StrategicChoicePresentation {
  choiceId: string;
  stageId: string;
  title: string;
  summary: string;
  optionLabels: string[];
  blockedReason?: string;
  nationalPriorityHint?: string;
  delayedTradeOffPreview?: string;
}

export interface StrategicActionToast {
  id: string;
  severity: 'info' | 'warning' | 'success';
  title: string;
  body: string;
  day: number;
}

export interface UiContract {
  readonly moduleId: 'agent-01-ui';
  presentChoice(model: StrategicChoicePresentation): void;
  pushToast(toast: StrategicActionToast): void;
  setActionHudSummary(actionsUsed: number, actionsMax: number, pendingDelayed: number): void;
}

// --- src/types/national-priority.ts ---

/** Mirrors V9.4 NationalPriorityId vocabulary for assembly alignment. */

export type NationalPriorityId =
  | 'water_security'
  | 'energy_resilience'
  | 'freight_modernization'
  | 'supply_chain_security'
  | 'economic_diversification'
  | 'technology_competitiveness';

export type NationalPriorityUrgency = 'watch' | 'important' | 'urgent' | 'critical';

export type NationalPriorityAlignmentBand =
  | 'strong'
  | 'moderate'
  | 'weak'
  | 'none'
  | 'conflict';

export interface NationalPrioritySnapshot {
  id: NationalPriorityId;
  title: string;
  urgency: NationalPriorityUrgency;
  progress: number;
  isPrimary: boolean;
}

export interface NationalPriorityAlignment {
  score: number;
  band: NationalPriorityAlignmentBand;
  reason: string;
  priorityId: NationalPriorityId;
}

export interface NationalPriorityRankingContext {
  day: number;
  priorities: NationalPrioritySnapshot[];
  playerFocusId: NationalPriorityId | null;
}

// --- src/types/coalition-mandate.ts ---

export type StakeholderGroupId =
  | 'industry'
  | 'households'
  | 'regions'
  | 'public_services';

export type MandateMilestoneId =
  | 'mandate_priority_engaged'
  | 'mandate_priority_momentum'
  | 'mandate_priority_leadership';

export interface PriorityMandateTrack {
  priorityId: NationalPriorityId;
  points: number;
  milestonesUnlocked: MandateMilestoneId[];
}

export type MandateProgress = Partial<Record<NationalPriorityId, PriorityMandateTrack>>;

export type StakeholderSentiment = Record<StakeholderGroupId, number>;

export type CoalitionCrisisLevel = 'stable' | 'strained' | 'acute';

export interface TurnStrategicBriefing {
  day: number;
  commitmentPressure: number;
  pendingTradeOffCount: number;
  mandateHeadline: string;
  stakeholderWarnings: string[];
  completedActionCount: number;
  activeChoiceId: string | null;
  coalitionBalanceIndex: number;
  coalitionCrisisLevel: CoalitionCrisisLevel;
  coalitionCrisisStreakDays: number;
  coalitionRecoveryStreakDays: number;
  prolongedCoalitionCrisis: boolean;
  sustainedCoalitionRecovery: boolean;
  coalitionVolatilityEvents: number;
  elevatedCoalitionVolatility: boolean;
  coalitionStabilizationStreakDays: number;
  postStabilizationLockIn: boolean;
  coalitionLockInStreakDays: number;
  crossModuleSyncStreakDays: number;
  integratedCoalitionMaturity: boolean;
  integratedCoalitionMaturityStreakDays: number;
  sustainedIntegratedCoalitionStewardship: boolean;
  coalitionStewardshipStreakDays: number;
  anchoredCoalitionGovernance: boolean;
  coalitionAnchoredGovernanceStreakDays: number;
  institutionalCoalitionPermanence: boolean;
  coalitionInstitutionalPermanenceStreakDays: number;
  generationalCoalitionContinuity: boolean;
  coalitionGenerationalContinuityStreakDays: number;
  mandateDriftRisk: 'low' | 'elevated' | 'critical';
  topRecommendationActionId?: string;
  topRecommendationTitle?: string;
}

// --- src/types/strategic-action.ts ---

export type StrategicActionCategory =
  | 'investment'
  | 'governance'
  | 'population'
  | 'research'
  | 'trade_off';

export interface DomainEffectBundle {
  economy?: EconomyPatch;
  government?: GovernancePatch;
  population?: PopulationPatch;
  tech?: TechPatch;
}

export interface DelayedTradeOff {
  id: string;
  firesOnDay: number;
  sourceActionId: string;
  label: string;
  effects: DomainEffectBundle;
  /** Shown when scheduled — honest preview of downstream cost. */
  warning: string;
}

export interface StrategicActionDefinition {
  id: string;
  title: string;
  category: StrategicActionCategory;
  apCost: number;
  cashCost: number;
  treasuryCost: number;
  minApproval: number;
  alignedPriorities: NationalPriorityId[];
  conflictingPriorities: NationalPriorityId[];
  immediateEffects: DomainEffectBundle;
  delayedTradeOffs: Omit<DelayedTradeOff, 'id' | 'firesOnDay' | 'sourceActionId'>[];
  tags: string[];
  /** When false, action may run only once per save (default true). */
  repeatable?: boolean;
  /** Optional cap guard — validated against gameplay state pending queue. */
  requiresMaxPendingTradeOffs?: number;
  /** All listed actions must appear in completedActionIds before this runs. */
  prerequisiteActionIds?: string[];
  /** After execution, block same action id until day + cooldownDays. */
  cooldownDays?: number;
  /** Bonus approval when synergy matches exist (applied in engine). */
  synergyEligible?: boolean;
  /** All listed mandate milestones must be unlocked before execution. */
  requiredMandateMilestones?: { priorityId: NationalPriorityId; milestoneId: MandateMilestoneId }[];
  /** Coalition balance index must be at least this value (0–100). */
  minCoalitionBalanceIndex?: number;
  /** Crisis-only actions — balance index must be at or below this value. */
  maxCoalitionBalanceIndex?: number;
  /** Action requires this many consecutive acute coalition calendar days. */
  minCoalitionCrisisStreakDays?: number;
  /** Action requires this many consecutive stable coalition calendar days. */
  minCoalitionRecoveryStreakDays?: number;
  /** Action requires at least this many coalition volatility events (post crisis/recovery cycles). */
  minCoalitionVolatilityEvents?: number;
  /** Action requires stable coalition days while volatility history remains active. */
  minCoalitionStabilizationStreakDays?: number;
  /** Action requires post-stabilization lock-in streak (volatility cleared). */
  minCoalitionLockInStreakDays?: number;
  /** Action requires coalition volatility events at or below this cap. */
  maxCoalitionVolatilityEvents?: number;
  /** Action requires aligned Agent 02/05 stabilization inbound streak. */
  minCrossModuleSyncStreakDays?: number;
  /** Action requires integrated lock-in + cross-module maturity streak. */
  minIntegratedCoalitionMaturityStreakDays?: number;
  /** Action requires sustained integrated-maturity stewardship streak. */
  minCoalitionStewardshipStreakDays?: number;
  /** Action requires anchored governance streak after sustained stewardship. */
  minCoalitionAnchoredGovernanceStreakDays?: number;
  /** Action requires institutional permanence streak after anchored governance. */
  minCoalitionInstitutionalPermanenceStreakDays?: number;
  /** Action requires generational continuity streak after institutional permanence. */
  minCoalitionGenerationalContinuityStreakDays?: number;
}

export interface MultiStageChoiceOption {
  optionId: string;
  label: string;
  description: string;
  nextStageId: string | null;
  /** Terminal options carry the action to execute. */
  resolvesActionId?: string;
  requirements?: StrategicValidationRequirement[];
}

export interface MultiStageChoiceStage {
  stageId: string;
  prompt: string;
  options: MultiStageChoiceOption[];
}

export interface MultiStageChoiceDefinition {
  choiceId: string;
  title: string;
  entryStageId: string;
  stages: MultiStageChoiceStage[];
  linkedActionId: string;
}

export type StrategicValidationRequirement =
  | { kind: 'min_cash'; amount: number }
  | { kind: 'min_treasury'; amount: number }
  | { kind: 'min_approval'; rating: number }
  | { kind: 'max_affordability_stress'; max: number }
  | { kind: 'tech_readiness'; track: import('../contracts/tech.ts').TechTrackId; min: number }
  | { kind: 'no_investment_lockout' }
  | { kind: 'directive_slot_available' }
  | { kind: 'max_pending_tradeoffs'; max: number }
  | { kind: 'action_not_yet_completed'; actionId: string }
  | { kind: 'mandate_milestone'; priorityId: NationalPriorityId; milestoneId: MandateMilestoneId }
  | { kind: 'min_coalition_balance'; minIndex: number }
  | { kind: 'max_coalition_balance'; maxIndex: number }
  | { kind: 'min_coalition_crisis_streak'; minDays: number }
  | { kind: 'min_coalition_recovery_streak'; minDays: number }
  | { kind: 'min_coalition_volatility_events'; minEvents: number }
  | { kind: 'min_coalition_stabilization_streak'; minDays: number }
  | { kind: 'min_coalition_lock_in_streak'; minDays: number }
  | { kind: 'max_coalition_volatility_events'; maxEvents: number }
  | { kind: 'min_cross_module_sync_streak'; minDays: number }
  | { kind: 'min_integrated_coalition_maturity_streak'; minDays: number }
  | { kind: 'min_coalition_stewardship_streak'; minDays: number }
  | { kind: 'min_coalition_anchored_governance_streak'; minDays: number }
  | { kind: 'min_coalition_institutional_permanence_streak'; minDays: number }
  | { kind: 'min_coalition_generational_continuity_streak'; minDays: number };

export interface StrategicValidationIssue {
  code: string;
  message: string;
  requirement: StrategicValidationRequirement;
}

export interface PlayerActionBudget {
  actionsUsedThisTurn: number;
  actionsPerTurn: number;
}

export interface StrategicActionJournalEntry {
  day: number;
  actionId: string;
  title: string;
  alignmentBand: NationalPriorityAlignmentBand | null;
  scheduledTradeOffCount: number;
}

export interface ConsequenceForecast {
  actionId: string;
  immediateSummary: string[];
  delayedSummary: string[];
  totalDelayedEffects: number;
  earliestTradeOffDay: number | null;
  populationStressDelta: number;
  treasuryDeltaEstimate: number;
}

export interface StrategicGameplayState {
  day: number;
  pendingDelayed: DelayedTradeOff[];
  completedActionIds: string[];
  journal: StrategicActionJournalEntry[];
  priorityMomentum: Partial<Record<NationalPriorityId, number>>;
  actionCooldowns: Record<string, { untilDay: number }>;
  mandateProgress?: MandateProgress;
  stakeholderSentiment?: StakeholderSentiment;
  /** Last calendar day an aligned-priority action completed (mandate idle drift). */
  lastAlignedActionDay?: number;
  /** Consecutive calendar days coalition balance remained acute. */
  coalitionCrisisStreakDays?: number;
  /** Consecutive calendar days coalition balance remained stable. */
  coalitionRecoveryStreakDays?: number;
  /** Times a prolonged crisis or sustained recovery cycle ended (oscillation meter). */
  coalitionVolatilityEvents?: number;
  /** Consecutive stable coalition days while volatility events remain on record. */
  coalitionStabilizationStreakDays?: number;
  /** Stable days after volatility cleared and stabilization matured. */
  coalitionLockInStreakDays?: number;
  /** Calendar days inbound Agent 02/05 stabilization flags stayed aligned. */
  crossModuleSyncStreakDays?: number;
  /** Days lock-in and cross-module sync both held with volatility cleared. */
  integratedCoalitionMaturityStreakDays?: number;
  /** Days integrated maturity remained active with volatility cleared. */
  coalitionStewardshipStreakDays?: number;
  /** Days sustained stewardship held governance anchor eligibility. */
  coalitionAnchoredGovernanceStreakDays?: number;
  /** Days anchored governance held institutional permanence eligibility. */
  coalitionInstitutionalPermanenceStreakDays?: number;
  /** Days institutional permanence held generational continuity eligibility. */
  coalitionGenerationalContinuityStreakDays?: number;
  activeChoice: {
    choiceId: string;
    stageId: string;
  } | null;
}

export interface StrategicActionRecommendation {
  actionId: string;
  title: string;
  feasible: boolean;
  alignmentScore: number;
  alignmentBand: NationalPriorityAlignmentBand | 'unknown';
  blockerCodes: string[];
}

export interface ExecuteActionResult {
  ok: boolean;
  issues?: StrategicValidationIssue[];
  state: StrategicGameplayState;
  appliedActionId?: string;
  scheduledTradeOffs?: DelayedTradeOff[];
}

// --- src/engine/commitment-journal.ts ---

export const DEFAULT_MAX_PENDING_TRADE_OFFS = 8;

export function computeCommitmentPressure(state: StrategicGameplayState): number {
  const pendingWeight = state.pendingDelayed.length * 12;
  const journalWeight = Math.min(state.journal.length, 10) * 3;
  return pendingWeight + journalWeight;
}

export function appendJournalEntry(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  alignmentBand: NationalPriorityAlignmentBand | null,
  scheduledTradeOffCount: number,
): StrategicGameplayState {
  const entry: StrategicActionJournalEntry = {
    day: state.day,
    actionId: action.id,
    title: action.title,
    alignmentBand,
    scheduledTradeOffCount,
  };
  return {
    ...state,
    journal: [...state.journal, entry].slice(-50),
  };
}

export function actionAlreadyCompleted(
  state: StrategicGameplayState,
  actionId: string,
): boolean {
  return state.completedActionIds.includes(actionId);
}

export function pendingTradeOffCount(state: StrategicGameplayState): number {
  return state.pendingDelayed.length;
}

// --- src/engine/action-prerequisites.ts ---

export function validatePrerequisites(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicValidationIssue[] {
  const ids = action.prerequisiteActionIds ?? [];
  if (ids.length === 0) return [];

  const missing = ids.filter((id) => !actionAlreadyCompleted(state, id));
  if (missing.length === 0) return [];

  return [
    {
      code: 'MISSING_PREREQUISITES',
      message: `Complete first: ${missing.join(', ')}`,
      requirement: { kind: 'action_not_yet_completed', actionId: missing[0] },
    },
  ];
}

// --- src/engine/priority-momentum.ts ---

export function createEmptyPriorityMomentum(): Partial<Record<NationalPriorityId, number>> {
  return {};
}

export function applyPriorityMomentum(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const momentum = { ...state.priorityMomentum };
  for (const id of action.alignedPriorities) {
    momentum[id] = Math.min(100, (momentum[id] ?? 0) + 8);
  }
  for (const id of action.conflictingPriorities) {
    momentum[id] = Math.max(0, (momentum[id] ?? 0) - 5);
  }
  return { ...state, priorityMomentum: momentum };
}

export function priorityMomentumBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  let bonus = 0;
  for (const id of action.alignedPriorities) {
    bonus += Math.floor((state.priorityMomentum[id] ?? 0) / 10);
  }
  return bonus;
}

// --- src/engine/consequence-forecast.ts ---

function sumTreasuryFromAction(action: StrategicActionDefinition): number {
  let total = 0;
  const immediate = action.immediateEffects.economy;
  if (immediate?.cashDelta) total += immediate.cashDelta;
  if (immediate?.treasuryDelta) total += immediate.treasuryDelta;
  for (const trade of action.delayedTradeOffs) {
    total += trade.effects.economy?.cashDelta ?? 0;
    total += trade.effects.economy?.treasuryDelta ?? 0;
    total += trade.effects.economy?.debtDelta ?? 0;
  }
  return total;
}

function sumPopulationStressFromAction(action: StrategicActionDefinition): number {
  let total = 0;
  total += action.immediateEffects.population?.affordabilityStressDelta ?? 0;
  for (const trade of action.delayedTradeOffs) {
    total += trade.effects.population?.affordabilityStressDelta ?? 0;
  }
  return total;
}

export function buildConsequenceForecast(
  action: StrategicActionDefinition,
  currentDay: number,
  delayDays = 3,
): ConsequenceForecast {
  const immediateSummary: string[] = [];
  if (action.immediateEffects.economy?.ledgerNote) {
    immediateSummary.push(action.immediateEffects.economy.ledgerNote);
  }
  immediateSummary.push(
    `Up-front: cash ${action.cashCost.toLocaleString()}, treasury ${action.treasuryCost.toLocaleString()}, AP ${action.apCost}.`,
  );

  const delayedSummary = action.delayedTradeOffs.map(
    (t, i) => `Day ${currentDay + delayDays + i}: ${t.warning}`,
  );

  return {
    actionId: action.id,
    immediateSummary,
    delayedSummary,
    totalDelayedEffects: action.delayedTradeOffs.length,
    earliestTradeOffDay:
      action.delayedTradeOffs.length > 0 ? currentDay + delayDays : null,
    populationStressDelta: sumPopulationStressFromAction(action),
    treasuryDeltaEstimate: sumTreasuryFromAction(action),
  };
}

export function mergeConsequenceForecasts(
  forecasts: ConsequenceForecast[],
): ConsequenceForecast | null {
  if (forecasts.length === 0) return null;
  const first = forecasts[0];
  return forecasts.slice(1).reduce(
    (acc, f) => ({
      actionId: acc.actionId,
      immediateSummary: [...acc.immediateSummary, ...f.immediateSummary],
      delayedSummary: [...acc.delayedSummary, ...f.delayedSummary],
      totalDelayedEffects: acc.totalDelayedEffects + f.totalDelayedEffects,
      earliestTradeOffDay:
        acc.earliestTradeOffDay === null
          ? f.earliestTradeOffDay
          : f.earliestTradeOffDay === null
            ? acc.earliestTradeOffDay
            : Math.min(acc.earliestTradeOffDay, f.earliestTradeOffDay),
      populationStressDelta: acc.populationStressDelta + f.populationStressDelta,
      treasuryDeltaEstimate: acc.treasuryDeltaEstimate + f.treasuryDeltaEstimate,
    }),
    { ...first },
  );
}

// --- src/engine/strategic-synergies.ts ---

export interface StrategicSynergyMatch {
  priorityId: NationalPriorityId;
  completedActionId: string;
  bonusScore: number;
  reason: string;
}

export function detectStrategicSynergies(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  catalog: Record<string, StrategicActionDefinition>,
): StrategicSynergyMatch[] {
  const matches: StrategicSynergyMatch[] = [];
  for (const priorityId of action.alignedPriorities) {
    for (const completedId of state.completedActionIds) {
      if (completedId === action.id) continue;
      const prior = catalog[completedId];
      if (!prior?.alignedPriorities.includes(priorityId)) continue;
      matches.push({
        priorityId,
        completedActionId: completedId,
        bonusScore: 6,
        reason: `Builds on ${prior.title} for ${priorityId.replace(/_/g, ' ')}.`,
      });
    }
  }
  return matches;
}

export function synergyScoreBonus(matches: StrategicSynergyMatch[]): number {
  return matches.reduce((sum, m) => sum + m.bonusScore, 0);
}

export function applySynergyApprovalBoost(
  matches: StrategicSynergyMatch[],
): number {
  if (matches.length === 0) return 0;
  return Math.min(4, 1 + Math.floor(matches.length / 2));
}

export function canExecuteAfterCooldown(
  state: StrategicGameplayState,
  actionId: string,
): boolean {
  const entry = state.actionCooldowns[actionId];
  if (!entry) return true;
  return state.day >= entry.untilDay;
}

export function startActionCooldown(
  state: StrategicGameplayState,
  actionId: string,
  cooldownDays: number,
): StrategicGameplayState {
  return {
    ...state,
    actionCooldowns: {
      ...state.actionCooldowns,
      [actionId]: { untilDay: state.day + cooldownDays },
    },
  };
}

export function countCompletedInCategory(
  state: StrategicGameplayState,
  catalog: Record<string, StrategicActionDefinition>,
  category: StrategicActionDefinition['category'],
): number {
  return state.completedActionIds.filter((id) => catalog[id]?.category === category).length;
}

export function hasCompletedPrerequisiteChain(
  state: StrategicGameplayState,
  chain: string[],
): boolean {
  return chain.every((id) => actionAlreadyCompleted(state, id));
}

// --- src/engine/strategic-mandate.ts ---

const MILESTONE_THRESHOLDS: { id: MandateMilestoneId; minPoints: number }[] = [
  { id: 'mandate_priority_engaged', minPoints: 25 },
  { id: 'mandate_priority_momentum', minPoints: 50 },
  { id: 'mandate_priority_leadership', minPoints: 75 },
];

export function createEmptyMandateProgress(): MandateProgress {
  return {};
}

function ensureTrack(
  progress: MandateProgress,
  priorityId: NationalPriorityId,
): PriorityMandateTrack {
  const existing = progress[priorityId];
  if (existing) return existing;
  return {
    priorityId,
    points: 0,
    milestonesUnlocked: [],
  };
}

function unlockMilestones(track: PriorityMandateTrack): PriorityMandateTrack {
  const unlocked = new Set(track.milestonesUnlocked);
  for (const step of MILESTONE_THRESHOLDS) {
    if (track.points >= step.minPoints) unlocked.add(step.id);
  }
  return { ...track, milestonesUnlocked: [...unlocked] };
}

export function advanceMandateOnAction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const priorityId of action.alignedPriorities) {
    let track = ensureTrack(progress, priorityId);
    track = { ...track, points: track.points + 12 };
    progress[priorityId] = unlockMilestones(track);
  }
  return { ...state, mandateProgress: progress };
}

export function mandateRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  const progress = state.mandateProgress ?? {};
  let bonus = 0;
  for (const priorityId of action.alignedPriorities) {
    const track = progress[priorityId];
    if (!track) continue;
    bonus += track.milestonesUnlocked.length * 4;
  }
  return bonus;
}

export function summarizeMandateProgress(state: StrategicGameplayState): string {
  const progress = state.mandateProgress ?? {};
  const tracks = Object.values(progress).filter(Boolean) as PriorityMandateTrack[];
  if (tracks.length === 0) {
    return 'No mandate momentum yet — aligned actions build national priority tracks.';
  }
  const leader = tracks.sort((a, b) => b.points - a.points)[0];
  const milestoneCount = leader.milestonesUnlocked.length;
  return `${leader.priorityId} mandate at ${leader.points} pts (${milestoneCount}/3 milestones).`;
}

// --- src/engine/stakeholder-coalition.ts ---

const BASE_SENTIMENT = 55;

const TAG_STAKEHOLDER_SHIFT: Record<string, Partial<Record<StakeholderGroupId, number>>> = {
  infrastructure: { regions: 6, industry: 2 },
  logistics: { industry: 5, regions: 3 },
  innovation: { industry: 8, households: -2 },
  contingency: { public_services: 4, households: 3 },
  buffer: { households: 5, industry: 2 },
  national_priority: { public_services: 3, regions: 4 },
};

const CONFLICTING_STAKEHOLDER: Partial<
  Record<StakeholderGroupId, { drop: number; groups: StakeholderGroupId[] }>
> = {
  households: { drop: 8, groups: ['households'] },
};

export function createDefaultStakeholderSentiment(): StakeholderSentiment {
  return {
    industry: BASE_SENTIMENT,
    households: BASE_SENTIMENT,
    regions: BASE_SENTIMENT,
    public_services: BASE_SENTIMENT,
  };
}

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function primaryStakeholdersForAction(
  action: StrategicActionDefinition,
): StakeholderGroupId[] {
  const groups = new Set<StakeholderGroupId>();
  for (const tag of action.tags) {
    const shift = TAG_STAKEHOLDER_SHIFT[tag];
    if (shift) {
      for (const g of Object.keys(shift) as StakeholderGroupId[]) groups.add(g);
    }
  }
  if (groups.size === 0) groups.add('public_services');
  return [...groups];
}

export function applyStakeholderReaction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const sentiment: StakeholderSentiment = {
    ...(state.stakeholderSentiment ?? createDefaultStakeholderSentiment()),
  };

  for (const tag of action.tags) {
    const shift = TAG_STAKEHOLDER_SHIFT[tag];
    if (!shift) continue;
    for (const [group, delta] of Object.entries(shift) as [StakeholderGroupId, number][]) {
      sentiment[group] = clampSentiment(sentiment[group] + delta);
    }
  }

  if (action.conflictingPriorities.length > 0) {
    sentiment.households = clampSentiment(sentiment.households - 4);
  }

  return { ...state, stakeholderSentiment: sentiment };
}

export function stakeholderApprovalPenalty(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const groups = primaryStakeholdersForAction(action);
  let penalty = 0;
  for (const group of groups) {
    const value = sentiment[group];
    if (value < 35) penalty += 6;
    else if (value < 45) penalty += 3;
  }
  if (action.conflictingPriorities.length > 0 && sentiment.households < 50) {
    penalty += CONFLICTING_STAKEHOLDER.households?.drop ? 2 : 0;
  }
  return penalty;
}

export function stakeholderOppositionIssues(
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const penalty = stakeholderApprovalPenalty(state, action);
  if (penalty === 0) return [];
  const gov = contracts.government.snapshot();
  const required = action.minApproval + penalty;
  if (gov.approvalRating >= required) return [];
  return [
    {
      code: 'STAKEHOLDER_OPPOSITION',
      message: `Coalition sentiment requires approval ${required} (currently ${gov.approvalRating}).`,
      requirement: { kind: 'min_approval', rating: required },
    },
  ];
}

export function listStakeholderWarnings(state: StrategicGameplayState): string[] {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const warnings: string[] = [];
  for (const [group, value] of Object.entries(sentiment) as [StakeholderGroupId, number][]) {
    if (value < 40) {
      warnings.push(`${group.replace('_', ' ')} coalition wary (${value}/100).`);
    }
  }
  return warnings;
}

// --- src/engine/coalition-balance.ts ---

const STAKEHOLDER_GROUPS: (keyof StakeholderSentiment)[] = [
  'industry',
  'households',
  'regions',
  'public_services',
];

export function computeCoalitionBalanceIndex(
  sentiment: StakeholderSentiment = createDefaultStakeholderSentiment(),
): number {
  const values = STAKEHOLDER_GROUPS.map((g) => sentiment[g]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const spreadPenalty = Math.sqrt(variance) * 1.4;
  return Math.max(0, Math.min(100, Math.round(100 - spreadPenalty)));
}

export function coalitionBalanceRankingBonus(state: StrategicGameplayState): number {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  if (index >= 85) return 6;
  if (index >= 70) return 3;
  if (index < 45) return -4;
  return 0;
}

export function coalitionRecoveryRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionRecoveryStreakDays === undefined) return 0;
  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= action.minCoalitionRecoveryStreakDays) return 5;
  return 2;
}

export function sustainedRecoveryRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionRecoveryStreakDays === undefined) return 0;
  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= 4) return 4;
  return 0;
}

export function stabilizationRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStabilizationStreakDays === undefined) return 0;
  const streak = state.coalitionStabilizationStreakDays ?? 0;
  if (streak >= action.minCoalitionStabilizationStreakDays) return 5;
  return 2;
}

export function lockInRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionLockInStreakDays === undefined) return 0;
  const streak = state.coalitionLockInStreakDays ?? 0;
  if (streak >= action.minCoalitionLockInStreakDays) return 4;
  return 0;
}

export function crossModuleSyncRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCrossModuleSyncStreakDays === undefined) return 0;
  const streak = state.crossModuleSyncStreakDays ?? 0;
  if (streak >= action.minCrossModuleSyncStreakDays) return 5;
  return 2;
}

export function integratedMaturityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minIntegratedCoalitionMaturityStreakDays === undefined) return 0;
  const streak = state.integratedCoalitionMaturityStreakDays ?? 0;
  if (streak >= action.minIntegratedCoalitionMaturityStreakDays) return 6;
  return 2;
}

export function stewardshipRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStewardshipStreakDays === undefined) return 0;
  const streak = state.coalitionStewardshipStreakDays ?? 0;
  if (streak >= action.minCoalitionStewardshipStreakDays) return 5;
  return 2;
}

export function anchoredGovernanceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionAnchoredGovernanceStreakDays === undefined) return 0;
  const streak = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  if (streak >= action.minCoalitionAnchoredGovernanceStreakDays) return 6;
  return 2;
}

export function institutionalPermanenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionInstitutionalPermanenceStreakDays === undefined) return 0;
  const streak = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInstitutionalPermanenceStreakDays) return 7;
  return 2;
}

export function generationalContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionGenerationalContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionGenerationalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionGenerationalContinuityStreakDays) return 8;
  return 2;
}

// --- src/engine/mandate-idle-drift.ts ---

const IDLE_GRACE_DAYS = 3;
const DRIFT_POINTS_PER_DAY = 2;

export function classifyMandateDriftRisk(
  state: StrategicGameplayState,
): 'low' | 'elevated' | 'critical' {
  const last = state.lastAlignedActionDay ?? state.day;
  const idleDays = Math.max(0, state.day - last);
  if (idleDays <= IDLE_GRACE_DAYS) return 'low';
  if (idleDays <= IDLE_GRACE_DAYS + 4) return 'elevated';
  return 'critical';
}

function decayTrack(track: PriorityMandateTrack, pointsLost: number): PriorityMandateTrack {
  const points = Math.max(0, track.points - pointsLost);
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  return { ...track, points, milestonesUnlocked };
}

export function applyMandateIdleDrift(
  state: StrategicGameplayState,
  toDay: number,
): StrategicGameplayState {
  const last = state.lastAlignedActionDay ?? state.day;
  const idleDays = Math.max(0, toDay - last - IDLE_GRACE_DAYS);
  if (idleDays <= 0) return { ...state, day: toDay };

  const driftTotal = idleDays * DRIFT_POINTS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, day: toDay, mandateProgress: progress };
}

export function touchLastAlignedActionDay(
  state: StrategicGameplayState,
  day: number,
): StrategicGameplayState {
  return { ...state, lastAlignedActionDay: day };
}

// --- src/engine/coalition-crisis.ts ---

const STABLE_MIN_INDEX = 70;
const STRAINED_MIN_INDEX = 45;

export function classifyCoalitionCrisisLevel(
  state: StrategicGameplayState,
): CoalitionCrisisLevel {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  if (index >= STABLE_MIN_INDEX) return 'stable';
  if (index >= STRAINED_MIN_INDEX) return 'strained';
  return 'acute';
}

/** Increment crisis streak while coalition balance stays acute; reset otherwise. */
export function advanceCoalitionCrisisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'acute') {
    if ((state.coalitionCrisisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCrisisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCrisisStreakDays: (state.coalitionCrisisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCrisisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const peak = state.coalitionCrisisStreakDays ?? 0;
  let next: StrategicGameplayState = { ...state, coalitionCrisisStreakDays: 0 };
  if (peak >= PROLONGED_COALITION_CRISIS_THRESHOLD) {
    next = incrementCoalitionVolatilityEvents(next);
  }
  return next;
}

// --- src/engine/coalition-crisis-pressure.ts ---

export const PROLONGED_COALITION_CRISIS_THRESHOLD = 4;
const CRISIS_MANDATE_DRIFT_PER_DAY = 1;

function decayTrack(track: PriorityMandateTrack, pointsLost: number): PriorityMandateTrack {
  const points = Math.max(0, track.points - pointsLost);
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  return { ...track, points, milestonesUnlocked };
}

export function isProlongedCoalitionCrisis(state: StrategicGameplayState): boolean {
  return (state.coalitionCrisisStreakDays ?? 0) >= PROLONGED_COALITION_CRISIS_THRESHOLD;
}

/** Extra mandate decay while acute coalition crisis persists beyond the prolonged threshold. */
export function applyProlongedCrisisMandatePressure(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isProlongedCoalitionCrisis(state)) return state;

  const driftTotal = daysAdvanced * CRISIS_MANDATE_DRIFT_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-recovery-pressure.ts ---

export const SUSTAINED_COALITION_RECOVERY_THRESHOLD = 4;
const RECOVERY_MANDATE_BONUS_PER_DAY = 1;

function boostTrack(track: PriorityMandateTrack, pointsGained: number): PriorityMandateTrack {
  const points = track.points + pointsGained;
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  for (const step of [
    { id: 'mandate_priority_engaged' as const, min: 25 },
    { id: 'mandate_priority_momentum' as const, min: 50 },
    { id: 'mandate_priority_leadership' as const, min: 75 },
  ]) {
    if (points >= step.min && !milestonesUnlocked.includes(step.id)) {
      milestonesUnlocked.push(step.id);
    }
  }
  return { ...track, points, milestonesUnlocked };
}

export function isSustainedCoalitionRecovery(state: StrategicGameplayState): boolean {
  return (state.coalitionRecoveryStreakDays ?? 0) >= SUSTAINED_COALITION_RECOVERY_THRESHOLD;
}

/** Mandate momentum bonus while coalition balance stays in sustained recovery. */
export function applySustainedRecoveryMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSustainedCoalitionRecovery(state)) return state;

  const bonusTotal = daysAdvanced * RECOVERY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-crisis-gates.ts ---

export function coalitionCrisisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCrisisStreakDays === undefined) return [];

  const streak = state.coalitionCrisisStreakDays ?? 0;
  if (streak >= action.minCoalitionCrisisStreakDays) return [];

  return [
    {
      code: 'COALITION_CRISIS_STREAK_TOO_SHORT',
      message: `Coalition crisis streak ${streak} below required ${action.minCoalitionCrisisStreakDays} acute day(s).`,
      requirement: {
        kind: 'min_coalition_crisis_streak',
        minDays: action.minCoalitionCrisisStreakDays,
      },
    },
  ];
}

export function coalitionRecoveryStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionRecoveryStreakDays === undefined) return [];

  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= action.minCoalitionRecoveryStreakDays) return [];

  return [
    {
      code: 'COALITION_RECOVERY_STREAK_TOO_SHORT',
      message: `Coalition recovery streak ${streak} below required ${action.minCoalitionRecoveryStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_recovery_streak',
        minDays: action.minCoalitionRecoveryStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-recovery.ts ---

/** Increment recovery streak while coalition balance stays stable; reset when strained or acute. */
export function advanceCoalitionRecoveryStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionRecoveryStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionRecoveryStreakDays: 0 };
  }
  return {
    ...state,
    coalitionRecoveryStreakDays: (state.coalitionRecoveryStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionRecoveryStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const peak = state.coalitionRecoveryStreakDays ?? 0;
  let next: StrategicGameplayState = { ...state, coalitionRecoveryStreakDays: 0 };
  if (peak >= SUSTAINED_COALITION_RECOVERY_THRESHOLD) {
    next = incrementCoalitionVolatilityEvents(next);
  }
  return next;
}

// --- src/engine/coalition-volatility.ts ---

export function resetCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionVolatilityEvents: 0 };
}

export function incrementCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return {
    ...state,
    coalitionVolatilityEvents: (state.coalitionVolatilityEvents ?? 0) + 1,
  };
}

export function decrementCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const current = state.coalitionVolatilityEvents ?? 0;
  return { ...state, coalitionVolatilityEvents: Math.max(0, current - 1) };
}

// --- src/engine/coalition-volatility-pressure.ts ---

export const ELEVATED_COALITION_VOLATILITY_THRESHOLD = 2;
const VOLATILITY_MANDATE_DRIFT_PER_DAY = 1;

function decayTrack(track: PriorityMandateTrack, pointsLost: number): PriorityMandateTrack {
  const points = Math.max(0, track.points - pointsLost);
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  return { ...track, points, milestonesUnlocked };
}

export function isElevatedCoalitionVolatility(state: StrategicGameplayState): boolean {
  return (state.coalitionVolatilityEvents ?? 0) >= ELEVATED_COALITION_VOLATILITY_THRESHOLD;
}

/** Mandate decay while coalition oscillation history stays elevated after crisis/recovery cycles. */
export function applyElevatedVolatilityMandateDrag(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isElevatedCoalitionVolatility(state)) return state;

  const driftTotal = daysAdvanced * VOLATILITY_MANDATE_DRIFT_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-volatility-gates.ts ---

export function coalitionVolatilityIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionVolatilityEvents === undefined) return [];

  const events = state.coalitionVolatilityEvents ?? 0;
  if (events >= action.minCoalitionVolatilityEvents) return [];

  return [
    {
      code: 'COALITION_VOLATILITY_TOO_LOW',
      message: `Coalition volatility events ${events} below required ${action.minCoalitionVolatilityEvents}.`,
      requirement: {
        kind: 'min_coalition_volatility_events',
        minEvents: action.minCoalitionVolatilityEvents,
      },
    },
  ];
}

// --- src/engine/coalition-stabilization.ts ---

export const COALITION_STABILIZATION_STREAK_THRESHOLD = 3;

/** Stable coalition days while volatility history is still nonzero — path to a stabilization pact. */
export function advanceCoalitionStabilizationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionStabilizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStabilizationStreakDays: 0 };
  }
  if ((state.coalitionVolatilityEvents ?? 0) < 1) {
    if ((state.coalitionStabilizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStabilizationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStabilizationStreakDays:
      (state.coalitionStabilizationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStabilizationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStabilizationStreakDays: 0 };
}

export function isCoalitionStabilizationReady(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionStabilizationStreakDays ?? 0) >= COALITION_STABILIZATION_STREAK_THRESHOLD
  );
}

// --- src/engine/coalition-stabilization-gates.ts ---

export function coalitionStabilizationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStabilizationStreakDays === undefined) return [];

  const streak = state.coalitionStabilizationStreakDays ?? 0;
  if (streak >= action.minCoalitionStabilizationStreakDays) return [];

  return [
    {
      code: 'COALITION_STABILIZATION_STREAK_TOO_SHORT',
      message: `Coalition stabilization streak ${streak} below required ${action.minCoalitionStabilizationStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_stabilization_streak',
        minDays: action.minCoalitionStabilizationStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-lock-in.ts ---

export const POST_STABILIZATION_LOCK_IN_THRESHOLD = 2;

export function isPostStabilizationLockIn(state: StrategicGameplayState): boolean {
  return (state.coalitionLockInStreakDays ?? 0) >= POST_STABILIZATION_LOCK_IN_THRESHOLD;
}

/** Stable days with volatility cleared after coalition stabilization matured. */
export function advanceCoalitionLockInStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  const volatility = state.coalitionVolatilityEvents ?? 0;
  if (volatility > 0) {
    if ((state.coalitionLockInStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionLockInStreakDays: 0 };
  }
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionLockInStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionLockInStreakDays: 0 };
  }
  const stabilization = state.coalitionStabilizationStreakDays ?? 0;
  const lockIn = state.coalitionLockInStreakDays ?? 0;
  const eligible =
    lockIn > 0 || stabilization >= COALITION_STABILIZATION_STREAK_THRESHOLD;
  if (!eligible) return state;
  return {
    ...state,
    coalitionLockInStreakDays: lockIn + daysAdvanced,
  };
}

export function resetCoalitionLockInStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionLockInStreakDays: 0 };
}

// --- src/engine/coalition-lock-in-gates.ts ---

export function coalitionLockInStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionLockInStreakDays === undefined) return [];

  const streak = state.coalitionLockInStreakDays ?? 0;
  if (streak >= action.minCoalitionLockInStreakDays) return [];

  return [
    {
      code: 'COALITION_LOCK_IN_STREAK_TOO_SHORT',
      message: `Coalition lock-in streak ${streak} below required ${action.minCoalitionLockInStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_lock_in_streak',
        minDays: action.minCoalitionLockInStreakDays,
      },
    },
  ];
}

export function coalitionVolatilityCapIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.maxCoalitionVolatilityEvents === undefined) return [];

  const events = state.coalitionVolatilityEvents ?? 0;
  if (events <= action.maxCoalitionVolatilityEvents) return [];

  return [
    {
      code: 'COALITION_VOLATILITY_TOO_HIGH',
      message: `Coalition volatility events ${events} above cap ${action.maxCoalitionVolatilityEvents}.`,
      requirement: {
        kind: 'max_coalition_volatility_events',
        maxEvents: action.maxCoalitionVolatilityEvents,
      },
    },
  ];
}

// --- src/engine/cross-module-sync-gates.ts ---

export function crossModuleSyncStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCrossModuleSyncStreakDays === undefined) return [];

  const streak = state.crossModuleSyncStreakDays ?? 0;
  if (streak >= action.minCrossModuleSyncStreakDays) return [];

  return [
    {
      code: 'CROSS_MODULE_SYNC_STREAK_TOO_SHORT',
      message: `Cross-module sync streak ${streak} below required ${action.minCrossModuleSyncStreakDays} day(s).`,
      requirement: {
        kind: 'min_cross_module_sync_streak',
        minDays: action.minCrossModuleSyncStreakDays,
      },
    },
  ];
}

// --- src/integrations/strategic-cross-module-hooks.ts ---

/** Inbound flags mirrored from Agent 05 pending-response / Agent 02 batch stabilization exports. */
export interface StrategicCrossModuleInbound {
  postQueueCalm?: boolean;
  pendingStabilizationWave?: boolean;
}

export function normalizeStrategicCrossModuleInbound(
  raw: StrategicCrossModuleInbound | undefined,
): Required<StrategicCrossModuleInbound> {
  return {
    postQueueCalm: raw?.postQueueCalm ?? false,
    pendingStabilizationWave: raw?.pendingStabilizationWave ?? false,
  };
}

export function crossModuleStabilizationAligned(
  state: StrategicGameplayState,
  inbound: StrategicCrossModuleInbound | undefined,
): boolean {
  const flags = normalizeStrategicCrossModuleInbound(inbound);
  if (!flags.postQueueCalm || !flags.pendingStabilizationWave) return false;
  if (isElevatedCoalitionVolatility(state)) return false;
  return (
    isCoalitionStabilizationReady(state) ||
    (state.coalitionStabilizationStreakDays ?? 0) >= 1
  );
}

export function advanceCrossModuleSyncStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
  inbound: StrategicCrossModuleInbound | undefined,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!crossModuleStabilizationAligned(state, inbound)) {
    if ((state.crossModuleSyncStreakDays ?? 0) === 0) return state;
    return { ...state, crossModuleSyncStreakDays: 0 };
  }
  return {
    ...state,
    crossModuleSyncStreakDays: (state.crossModuleSyncStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCrossModuleSyncStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, crossModuleSyncStreakDays: 0 };
}

// --- src/integrations/external-coalition-turn-signals.ts ---

/** Outbound coalition telemetry for Agent 02 / Agent 05 assembly hooks (round 10+). */
export interface ExternalCoalitionTurnSignals {
  coalitionCrisisLevel: CoalitionCrisisLevel;
  coalitionBalanceIndex: number;
  coalitionVolatilityEvents: number;
  elevatedCoalitionVolatility: boolean;
  coalitionStabilizationReady: boolean;
  postStabilizationLockIn: boolean;
  crossModuleSyncStreakDays: number;
  integratedCoalitionMaturity: boolean;
  integratedCoalitionMaturityStreakDays: number;
  sustainedIntegratedCoalitionStewardship: boolean;
  coalitionStewardshipStreakDays: number;
  anchoredCoalitionGovernance: boolean;
  coalitionAnchoredGovernanceStreakDays: number;
  institutionalCoalitionPermanence: boolean;
  coalitionInstitutionalPermanenceStreakDays: number;
  generationalCoalitionContinuity: boolean;
  coalitionGenerationalContinuityStreakDays: number;
}

export function buildExternalCoalitionTurnSignals(
  state: StrategicGameplayState,
): ExternalCoalitionTurnSignals {
  const sentiment = state.stakeholderSentiment;
  return {
    coalitionCrisisLevel: classifyCoalitionCrisisLevel(state),
    coalitionBalanceIndex: computeCoalitionBalanceIndex(sentiment),
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: isElevatedCoalitionVolatility(state),
    coalitionStabilizationReady: isCoalitionStabilizationReady(state),
    postStabilizationLockIn: isPostStabilizationLockIn(state),
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: isIntegratedCoalitionMaturity(state),
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: isSustainedIntegratedCoalitionStewardship(state),
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: isAnchoredCoalitionGovernance(state),
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: isInstitutionalCoalitionPermanence(state),
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
    generationalCoalitionContinuity: isGenerationalCoalitionContinuity(state),
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
  };
}

export function normalizeExternalCoalitionTurnSignals(
  raw: ExternalCoalitionTurnSignals | undefined,
): ExternalCoalitionTurnSignals {
  return {
    coalitionCrisisLevel: raw?.coalitionCrisisLevel ?? 'stable',
    coalitionBalanceIndex: raw?.coalitionBalanceIndex ?? 0,
    coalitionVolatilityEvents: raw?.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: raw?.elevatedCoalitionVolatility ?? false,
    coalitionStabilizationReady: raw?.coalitionStabilizationReady ?? false,
    postStabilizationLockIn: raw?.postStabilizationLockIn ?? false,
    crossModuleSyncStreakDays: raw?.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: raw?.integratedCoalitionMaturity ?? false,
    integratedCoalitionMaturityStreakDays: raw?.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: raw?.sustainedIntegratedCoalitionStewardship ?? false,
    coalitionStewardshipStreakDays: raw?.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: raw?.anchoredCoalitionGovernance ?? false,
    coalitionAnchoredGovernanceStreakDays: raw?.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: raw?.institutionalCoalitionPermanence ?? false,
    coalitionInstitutionalPermanenceStreakDays: raw?.coalitionInstitutionalPermanenceStreakDays ?? 0,
    generationalCoalitionContinuity: raw?.generationalCoalitionContinuity ?? false,
    coalitionGenerationalContinuityStreakDays: raw?.coalitionGenerationalContinuityStreakDays ?? 0,
  };
}

// --- src/engine/coalition-integrated-maturity.ts ---

export const INTEGRATED_COALITION_MATURITY_THRESHOLD = 2;
export const INTEGRATED_CROSS_MODULE_SYNC_MIN = 2;

const MATURITY_MANDATE_BONUS_PER_DAY = 1;

function boostTrack(track: PriorityMandateTrack, pointsGained: number): PriorityMandateTrack {
  const points = track.points + pointsGained;
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  for (const step of [
    { id: 'mandate_priority_engaged' as const, min: 25 },
    { id: 'mandate_priority_momentum' as const, min: 50 },
    { id: 'mandate_priority_leadership' as const, min: 75 },
  ]) {
    if (points >= step.min && !milestonesUnlocked.includes(step.id)) {
      milestonesUnlocked.push(step.id);
    }
  }
  return { ...track, points, milestonesUnlocked };
}

export function isIntegratedCoalitionMaturity(state: StrategicGameplayState): boolean {
  return (
    (state.integratedCoalitionMaturityStreakDays ?? 0) >= INTEGRATED_COALITION_MATURITY_THRESHOLD
  );
}

function integratedMaturityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  if ((state.crossModuleSyncStreakDays ?? 0) < INTEGRATED_CROSS_MODULE_SYNC_MIN) return false;
  const lockIn = state.coalitionLockInStreakDays ?? 0;
  return lockIn >= POST_STABILIZATION_LOCK_IN_THRESHOLD || isPostStabilizationLockIn(state);
}

/** Days where lock-in and cross-module sync both hold while volatility stays cleared. */
export function advanceIntegratedCoalitionMaturityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!integratedMaturityEligible(state)) {
    if ((state.integratedCoalitionMaturityStreakDays ?? 0) === 0) return state;
    return { ...state, integratedCoalitionMaturityStreakDays: 0 };
  }
  return {
    ...state,
    integratedCoalitionMaturityStreakDays:
      (state.integratedCoalitionMaturityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetIntegratedCoalitionMaturityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, integratedCoalitionMaturityStreakDays: 0 };
}

export function applyIntegratedCoalitionMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isIntegratedCoalitionMaturity(state)) return state;

  const bonusTotal = daysAdvanced * MATURITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-integrated-maturity-gates.ts ---

export function integratedCoalitionMaturityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minIntegratedCoalitionMaturityStreakDays === undefined) return [];

  const streak = state.integratedCoalitionMaturityStreakDays ?? 0;
  if (streak >= action.minIntegratedCoalitionMaturityStreakDays) return [];

  return [
    {
      code: 'INTEGRATED_COALITION_MATURITY_TOO_LOW',
      message: `Integrated coalition maturity streak ${streak} below required ${action.minIntegratedCoalitionMaturityStreakDays} day(s).`,
      requirement: {
        kind: 'min_integrated_coalition_maturity_streak',
        minDays: action.minIntegratedCoalitionMaturityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-stewardship.ts ---

export const SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD = 3;
const STEWARDSHIP_SENTIMENT_CALM_PER_DAY = 1;

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function isSustainedIntegratedCoalitionStewardship(
  state: StrategicGameplayState,
): boolean {
  return (state.coalitionStewardshipStreakDays ?? 0) >= SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD;
}

function stewardshipEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  return isIntegratedCoalitionMaturity(state);
}

/** Stewardship days while integrated maturity remains active and volatility stays cleared. */
export function advanceCoalitionStewardshipStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!stewardshipEligible(state)) {
    if ((state.coalitionStewardshipStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStewardshipStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStewardshipStreakDays: (state.coalitionStewardshipStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStewardshipStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStewardshipStreakDays: 0 };
}

/** Gentle stakeholder calm while integrated stewardship is sustained. */
export function applyStewardshipStakeholderCalm(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSustainedIntegratedCoalitionStewardship(state)) return state;

  const base = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const sentiment: StakeholderSentiment = { ...base };
  const step = STEWARDSHIP_SENTIMENT_CALM_PER_DAY * daysAdvanced;

  for (const group of Object.keys(sentiment) as StakeholderGroupId[]) {
    const value = sentiment[group];
    if (value < 55) {
      sentiment[group] = clampSentiment(value + step);
    } else if (value > 55) {
      sentiment[group] = clampSentiment(value - Math.ceil(step / 2));
    }
  }

  return { ...state, stakeholderSentiment: sentiment };
}

// --- src/engine/coalition-stewardship-gates.ts ---

export function coalitionStewardshipStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStewardshipStreakDays === undefined) return [];

  const streak = state.coalitionStewardshipStreakDays ?? 0;
  if (streak >= action.minCoalitionStewardshipStreakDays) return [];

  return [
    {
      code: 'COALITION_STEWARDSHIP_STREAK_TOO_SHORT',
      message: `Coalition stewardship streak ${streak} below required ${action.minCoalitionStewardshipStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_stewardship_streak',
        minDays: action.minCoalitionStewardshipStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-anchored-governance.ts ---

export const ANCHORED_COALITION_GOVERNANCE_THRESHOLD = 4;
const ANCHORED_MANDATE_BONUS_PER_DAY = 1;

function boostTrack(track: PriorityMandateTrack, pointsGained: number): PriorityMandateTrack {
  const points = track.points + pointsGained;
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  for (const step of [
    { id: 'mandate_priority_engaged' as const, min: 25 },
    { id: 'mandate_priority_momentum' as const, min: 50 },
    { id: 'mandate_priority_leadership' as const, min: 75 },
  ]) {
    if (points >= step.min && !milestonesUnlocked.includes(step.id)) {
      milestonesUnlocked.push(step.id);
    }
  }
  return { ...track, points, milestonesUnlocked };
}

export function isAnchoredCoalitionGovernance(state: StrategicGameplayState): boolean {
  return (state.coalitionAnchoredGovernanceStreakDays ?? 0) >= ANCHORED_COALITION_GOVERNANCE_THRESHOLD;
}

function anchoredGovernanceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const stewardship = state.coalitionStewardshipStreakDays ?? 0;
  return (
    isSustainedIntegratedCoalitionStewardship(state) ||
    stewardship >= SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD
  );
}

/** Governance anchor streak after integrated stewardship is sustained. */
export function advanceCoalitionAnchoredGovernanceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!anchoredGovernanceEligible(state)) {
    if ((state.coalitionAnchoredGovernanceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionAnchoredGovernanceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionAnchoredGovernanceStreakDays:
      (state.coalitionAnchoredGovernanceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionAnchoredGovernanceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionAnchoredGovernanceStreakDays: 0 };
}

export function applyAnchoredGovernanceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isAnchoredCoalitionGovernance(state)) return state;

  const bonusTotal = daysAdvanced * ANCHORED_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-anchored-governance-gates.ts ---

export function coalitionAnchoredGovernanceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionAnchoredGovernanceStreakDays === undefined) return [];

  const streak = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  if (streak >= action.minCoalitionAnchoredGovernanceStreakDays) return [];

  return [
    {
      code: 'COALITION_ANCHORED_GOVERNANCE_STREAK_TOO_SHORT',
      message: `Anchored governance streak ${streak} below required ${action.minCoalitionAnchoredGovernanceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_anchored_governance_streak',
        minDays: action.minCoalitionAnchoredGovernanceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-gates.ts ---

export function coalitionBalanceIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  const issues: StrategicValidationIssue[] = [];

  if (
    action.minCoalitionBalanceIndex !== undefined &&
    index < action.minCoalitionBalanceIndex
  ) {
    issues.push({
      code: 'COALITION_BALANCE_TOO_LOW',
      message: `Coalition balance ${index} below required ${action.minCoalitionBalanceIndex}.`,
      requirement: {
        kind: 'min_coalition_balance',
        minIndex: action.minCoalitionBalanceIndex,
      },
    });
  }

  if (
    action.maxCoalitionBalanceIndex !== undefined &&
    index > action.maxCoalitionBalanceIndex
  ) {
    issues.push({
      code: 'COALITION_NOT_IN_CRISIS',
      message: `Coalition balance ${index} is too healthy for crisis-only action (max ${action.maxCoalitionBalanceIndex}).`,
      requirement: {
        kind: 'max_coalition_balance',
        maxIndex: action.maxCoalitionBalanceIndex,
      },
    });
  }

  return issues;
}

// --- src/engine/mandate-gates.ts ---

function trackHasMilestone(
  progress: MandateProgress,
  priorityId: string,
  milestoneId: string,
): boolean {
  const track = progress[priorityId as keyof MandateProgress];
  if (!track) return false;
  return track.milestonesUnlocked.includes(
    milestoneId as (typeof track.milestonesUnlocked)[number],
  );
}

export function mandateMilestoneIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const required = action.requiredMandateMilestones;
  if (!required?.length) return [];

  const progress = state.mandateProgress ?? {};
  const issues: StrategicValidationIssue[] = [];

  for (const gate of required) {
    if (trackHasMilestone(progress, gate.priorityId, gate.milestoneId)) continue;
    issues.push({
      code: 'MANDATE_MILESTONE_REQUIRED',
      message: `Requires ${gate.milestoneId} on ${gate.priorityId} mandate track.`,
      requirement: {
        kind: 'mandate_milestone',
        priorityId: gate.priorityId,
        milestoneId: gate.milestoneId,
      },
    });
  }

  return issues;
}

// --- src/engine/strategic-save.ts ---

export interface StrategicGameplaySaveV1 {
  version: 1;
  day: number;
  completedActionIds: string[];
  pendingDelayed: StrategicGameplayState['pendingDelayed'];
  journal: StrategicGameplayState['journal'];
  priorityMomentum: StrategicGameplayState['priorityMomentum'];
  actionCooldowns: StrategicGameplayState['actionCooldowns'];
  activeChoice: StrategicGameplayState['activeChoice'];
}

export interface StrategicGameplaySaveV2 extends Omit<StrategicGameplaySaveV1, 'version'> {
  version: 2;
  mandateProgress: MandateProgress;
  stakeholderSentiment: StakeholderSentiment;
}

export interface StrategicGameplaySaveV3 extends Omit<StrategicGameplaySaveV2, 'version'> {
  version: 3;
  lastAlignedActionDay: number;
}

export interface StrategicGameplaySaveV4 extends Omit<StrategicGameplaySaveV3, 'version'> {
  version: 4;
  coalitionCrisisStreakDays: number;
}

export interface StrategicGameplaySaveV5 extends Omit<StrategicGameplaySaveV4, 'version'> {
  version: 5;
  coalitionRecoveryStreakDays: number;
}

export interface StrategicGameplaySaveV6 extends Omit<StrategicGameplaySaveV5, 'version'> {
  version: 6;
  coalitionVolatilityEvents: number;
}

export interface StrategicGameplaySaveV7 extends Omit<StrategicGameplaySaveV6, 'version'> {
  version: 7;
  coalitionStabilizationStreakDays: number;
}

export interface StrategicGameplaySaveV8 extends Omit<StrategicGameplaySaveV7, 'version'> {
  version: 8;
  coalitionLockInStreakDays: number;
  crossModuleSyncStreakDays: number;
}

export interface StrategicGameplaySaveV9 extends Omit<StrategicGameplaySaveV8, 'version'> {
  version: 9;
  integratedCoalitionMaturityStreakDays: number;
}

export interface StrategicGameplaySaveV10 extends Omit<StrategicGameplaySaveV9, 'version'> {
  version: 10;
  coalitionStewardshipStreakDays: number;
}

export interface StrategicGameplaySaveV11 extends Omit<StrategicGameplaySaveV10, 'version'> {
  version: 11;
  coalitionAnchoredGovernanceStreakDays: number;
}

export interface StrategicGameplaySaveV12 extends Omit<StrategicGameplaySaveV11, 'version'> {
  version: 12;
  coalitionInstitutionalPermanenceStreakDays: number;
}

export interface StrategicGameplaySaveV13 extends Omit<StrategicGameplaySaveV12, 'version'> {
  version: 13;
  coalitionGenerationalContinuityStreakDays: number;
}

export type StrategicGameplaySaveBlob =
  | StrategicGameplaySaveV1
  | StrategicGameplaySaveV2
  | StrategicGameplaySaveV3
  | StrategicGameplaySaveV4
  | StrategicGameplaySaveV5
  | StrategicGameplaySaveV6
  | StrategicGameplaySaveV7
  | StrategicGameplaySaveV8
  | StrategicGameplaySaveV9
  | StrategicGameplaySaveV10
  | StrategicGameplaySaveV11
  | StrategicGameplaySaveV12
  | StrategicGameplaySaveV13;

export function serializeStrategicGameplayState(
  state: StrategicGameplayState,
): StrategicGameplaySaveV13 {
  return {
    version: 13,
    day: state.day,
    completedActionIds: [...state.completedActionIds],
    pendingDelayed: state.pendingDelayed.map((p) => ({ ...p, effects: { ...p.effects } })),
    journal: state.journal.slice(),
    priorityMomentum: { ...state.priorityMomentum },
    actionCooldowns: { ...state.actionCooldowns },
    activeChoice: state.activeChoice ? { ...state.activeChoice } : null,
    mandateProgress: { ...(state.mandateProgress ?? createEmptyMandateProgress()) },
    stakeholderSentiment: {
      ...(state.stakeholderSentiment ?? createDefaultStakeholderSentiment()),
    },
    lastAlignedActionDay: state.lastAlignedActionDay ?? state.day,
    coalitionCrisisStreakDays: state.coalitionCrisisStreakDays ?? 0,
    coalitionRecoveryStreakDays: state.coalitionRecoveryStreakDays ?? 0,
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    coalitionStabilizationStreakDays: state.coalitionStabilizationStreakDays ?? 0,
    coalitionLockInStreakDays: state.coalitionLockInStreakDays ?? 0,
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
  };
}

export function deserializeStrategicGameplayState(
  save: StrategicGameplaySaveBlob,
): StrategicGameplayState {
  if (save.version === 1) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: createEmptyMandateProgress(),
      stakeholderSentiment: createDefaultStakeholderSentiment(),
      lastAlignedActionDay: save.day,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 2) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.day,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 3) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: 0,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 4) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: 0,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 5) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 6) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: 0,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 7) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: 0,
      crossModuleSyncStreakDays: 0,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 8) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: save.coalitionLockInStreakDays,
      crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
      integratedCoalitionMaturityStreakDays: 0,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 9) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: save.coalitionLockInStreakDays,
      crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: 0,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 10) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: save.coalitionLockInStreakDays,
      crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: 0,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 11) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: save.coalitionLockInStreakDays,
      crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
      coalitionInstitutionalPermanenceStreakDays: 0,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version === 12) {
    return {
      day: save.day,
      completedActionIds: [...save.completedActionIds],
      pendingDelayed: save.pendingDelayed.slice(),
      journal: save.journal.slice(),
      priorityMomentum: { ...save.priorityMomentum },
      actionCooldowns: { ...save.actionCooldowns },
      activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
      mandateProgress: { ...save.mandateProgress },
      stakeholderSentiment: { ...save.stakeholderSentiment },
      lastAlignedActionDay: save.lastAlignedActionDay,
      coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
      coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
      coalitionVolatilityEvents: save.coalitionVolatilityEvents,
      coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
      coalitionLockInStreakDays: save.coalitionLockInStreakDays,
      crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
      integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
      coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
      coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
      coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
      coalitionGenerationalContinuityStreakDays: 0,
    };
  }
  if (save.version !== 13) {
    throw new Error(`Unsupported strategic save version: ${(save as { version: number }).version}`);
  }
  return {
    day: save.day,
    completedActionIds: [...save.completedActionIds],
    pendingDelayed: save.pendingDelayed.slice(),
    journal: save.journal.slice(),
    priorityMomentum: { ...save.priorityMomentum },
    actionCooldowns: { ...save.actionCooldowns },
    activeChoice: save.activeChoice ? { ...save.activeChoice } : null,
    mandateProgress: { ...save.mandateProgress },
    stakeholderSentiment: { ...save.stakeholderSentiment },
    lastAlignedActionDay: save.lastAlignedActionDay,
    coalitionCrisisStreakDays: save.coalitionCrisisStreakDays,
    coalitionRecoveryStreakDays: save.coalitionRecoveryStreakDays,
    coalitionVolatilityEvents: save.coalitionVolatilityEvents,
    coalitionStabilizationStreakDays: save.coalitionStabilizationStreakDays,
    coalitionLockInStreakDays: save.coalitionLockInStreakDays,
    crossModuleSyncStreakDays: save.crossModuleSyncStreakDays,
    integratedCoalitionMaturityStreakDays: save.integratedCoalitionMaturityStreakDays,
    coalitionStewardshipStreakDays: save.coalitionStewardshipStreakDays,
    coalitionAnchoredGovernanceStreakDays: save.coalitionAnchoredGovernanceStreakDays,
    coalitionInstitutionalPermanenceStreakDays: save.coalitionInstitutionalPermanenceStreakDays,
    coalitionGenerationalContinuityStreakDays: save.coalitionGenerationalContinuityStreakDays,
  };
}

export function mergeStrategicSaveIntoState(
  base: StrategicGameplayState,
  save: StrategicGameplaySaveBlob,
): StrategicGameplayState {
  const loaded = deserializeStrategicGameplayState(save);
  return {
    ...base,
    ...loaded,
    day: Math.max(base.day, loaded.day),
  };
}

// --- src/engine/tradeoff-mitigation.ts ---

/** Spend AP + treasury to defer one pending trade-off by extraDays. */
export function mitigateNextPendingTradeOff(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  options: { apCost: number; treasuryCost: number; extraDays: number },
): { state: StrategicGameplayState; ok: boolean; issues: StrategicValidationIssue[] } {
  const issues: StrategicValidationIssue[] = [];
  if (state.pendingDelayed.length === 0) {
    issues.push({
      code: 'NO_PENDING_TRADEOFFS',
      message: 'No delayed trade-offs to mitigate.',
      requirement: { kind: 'max_pending_tradeoffs', max: 0 },
    });
    return { state, ok: false, issues };
  }

  const econ = contracts.economy.snapshot();
  if (econ.treasuryReserve < options.treasuryCost) {
    issues.push({
      code: 'INSUFFICIENT_FUNDS',
      message: 'Treasury cannot fund mitigation.',
      requirement: { kind: 'min_treasury', amount: options.treasuryCost },
    });
    return { state, ok: false, issues };
  }

  contracts.economy.applyPatch({ treasuryDelta: -options.treasuryCost });
  const sorted = [...state.pendingDelayed].sort((a, b) => a.firesOnDay - b.firesOnDay);
  const [next, ...rest] = sorted;
  const deferred = {
    ...next,
    firesOnDay: next.firesOnDay + options.extraDays,
    label: `${next.label} (deferred +${options.extraDays}d)`,
  };

  contracts.ui.pushToast({
    id: `mitigate_${next.id}_${state.day}`,
    severity: 'info',
    title: 'Trade-off deferred',
    body: deferred.label,
    day: state.day,
  });

  return {
    ok: true,
    issues: [],
    state: {
      ...state,
      pendingDelayed: [...rest, deferred].sort((a, b) => a.firesOnDay - b.firesOnDay),
    },
  };
}

export function summarizePendingTradeOffLoad(state: StrategicGameplayState): {
  count: number;
  nextFireDay: number | null;
  heaviestPopulationStress: number;
} {
  if (state.pendingDelayed.length === 0) {
    return { count: 0, nextFireDay: null, heaviestPopulationStress: 0 };
  }
  const sorted = [...state.pendingDelayed].sort((a, b) => a.firesOnDay - b.firesOnDay);
  let heaviest = 0;
  for (const p of state.pendingDelayed) {
    heaviest = Math.max(
      heaviest,
      p.effects.population?.affordabilityStressDelta ?? 0,
    );
  }
  return {
    count: pendingTradeOffCount(state),
    nextFireDay: sorted[0].firesOnDay,
    heaviestPopulationStress: heaviest,
  };
}

// --- src/engine/validation.ts ---

export function evaluateRequirements(
  requirements: StrategicValidationRequirement[] | undefined,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  action?: Pick<
    StrategicActionDefinition,
    'apCost' | 'cashCost' | 'treasuryCost' | 'minApproval'
  >,
  state?: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicValidationIssue[] {
  const issues: StrategicValidationIssue[] = [];
  const econ = contracts.economy.snapshot();
  const gov = contracts.government.snapshot();
  const pop = contracts.population.snapshot();
  const tech = contracts.tech.snapshot();

  if (action) {
    if (budget.actionsUsedThisTurn + action.apCost > budget.actionsPerTurn) {
      issues.push({
        code: 'AP_EXHAUSTED',
        message: 'Not enough action points remaining this turn.',
        requirement: { kind: 'directive_slot_available' },
      });
    }
    if (!contracts.economy.canAfford(action.cashCost, action.treasuryCost)) {
      issues.push({
        code: 'INSUFFICIENT_FUNDS',
        message: 'Cash or treasury cannot cover this action.',
        requirement: { kind: 'min_cash', amount: action.cashCost },
      });
    }
    if (gov.approvalRating < action.minApproval) {
      issues.push({
        code: 'LOW_APPROVAL',
        message: `Approval ${gov.approvalRating} below required ${action.minApproval}.`,
        requirement: { kind: 'min_approval', rating: action.minApproval },
      });
    }
  }

  for (const req of requirements ?? []) {
    switch (req.kind) {
      case 'min_cash':
        if (econ.cashOnHand < req.amount) {
          issues.push({
            code: 'MIN_CASH',
            message: `Need at least $${req.amount} cash.`,
            requirement: req,
          });
        }
        break;
      case 'min_treasury':
        if (econ.treasuryReserve < req.amount) {
          issues.push({
            code: 'MIN_TREASURY',
            message: `Treasury reserve below ${req.amount}.`,
            requirement: req,
          });
        }
        break;
      case 'min_approval':
        if (gov.approvalRating < req.rating) {
          issues.push({
            code: 'MIN_APPROVAL',
            message: `Approval must be at least ${req.rating}.`,
            requirement: req,
          });
        }
        break;
      case 'max_affordability_stress':
        if (pop.affordabilityStress > req.max) {
          issues.push({
            code: 'POPULATION_STRESS',
            message: 'Household affordability stress is too high for this path.',
            requirement: req,
          });
        }
        break;
      case 'tech_readiness':
        if (!contracts.tech.meetsPrerequisite(req.track, req.min)) {
          issues.push({
            code: 'TECH_NOT_READY',
            message: `${req.track} readiness below ${req.min}.`,
            requirement: req,
          });
        }
        break;
      case 'no_investment_lockout':
        if (econ.investmentLockout) {
          issues.push({
            code: 'INVESTMENT_LOCKOUT',
            message: 'Markets are in investment lockout.',
            requirement: req,
          });
        }
        break;
      case 'directive_slot_available':
        if (!contracts.government.canIssueDirective(0)) {
          issues.push({
            code: 'NO_DIRECTIVE_SLOT',
            message: 'No governance directive capacity remaining.',
            requirement: req,
          });
        }
        break;
      case 'max_pending_tradeoffs':
        if (state && pendingTradeOffCount(state) >= req.max) {
          issues.push({
            code: 'TOO_MANY_PENDING_TRADEOFFS',
            message: `Cannot schedule more than ${req.max} delayed trade-offs.`,
            requirement: req,
          });
        }
        break;
      case 'action_not_yet_completed':
        if (state && !actionAlreadyCompleted(state, req.actionId)) {
          issues.push({
            code: 'PREREQUISITE_ACTION',
            message: `Requires completing ${req.actionId} first.`,
            requirement: req,
          });
        }
        break;
      case 'mandate_milestone':
        if (state) {
          issues.push(
            ...mandateMilestoneIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                requiredMandateMilestones: [
                  { priorityId: req.priorityId, milestoneId: req.milestoneId },
                ],
              },
              state,
            ),
          );
        }
        break;
      case 'min_coalition_balance':
        if (state) {
          issues.push(
            ...coalitionBalanceIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                minCoalitionBalanceIndex: req.minIndex,
              },
              state,
            ),
          );
        }
        break;
      case 'max_coalition_balance':
        if (state) {
          issues.push(
            ...coalitionBalanceIssues(
              {
                id: '_gate',
                title: '',
                category: 'governance',
                apCost: 0,
                cashCost: 0,
                treasuryCost: 0,
                minApproval: 0,
                alignedPriorities: [],
                conflictingPriorities: [],
                immediateEffects: {},
                delayedTradeOffs: [],
                tags: [],
                maxCoalitionBalanceIndex: req.maxIndex,
              },
              state,
            ),
          );
        }
        break;
      default:
        break;
    }
  }

  return issues;
}

export function validateAction(
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  extraRequirements: StrategicValidationRequirement[] = [],
  state?: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicValidationIssue[] {
  const issues = evaluateRequirements(
    extraRequirements,
    contracts,
    budget,
    action,
    state,
    options,
  );

  if (state && action.repeatable === false && actionAlreadyCompleted(state, action.id)) {
    issues.push({
      code: 'ALREADY_COMPLETED',
      message: `${action.title} cannot be repeated.`,
      requirement: { kind: 'action_not_yet_completed', actionId: action.id },
    });
  }

  const maxPending =
    action.requiresMaxPendingTradeOffs ?? options?.maxPendingTradeOffs;
  if (state && maxPending !== undefined && pendingTradeOffCount(state) >= maxPending) {
    issues.push({
      code: 'TOO_MANY_PENDING_TRADEOFFS',
      message: `Delayed trade-off queue full (max ${maxPending}).`,
      requirement: { kind: 'max_pending_tradeoffs', max: maxPending },
    });
  }

  if (state) {
    issues.push(...stakeholderOppositionIssues(action, contracts, state));
    issues.push(...mandateMilestoneIssues(action, state));
    issues.push(...coalitionBalanceIssues(action, state));
    issues.push(...coalitionCrisisStreakIssues(action, state));
    issues.push(...coalitionRecoveryStreakIssues(action, state));
    issues.push(...coalitionVolatilityIssues(action, state));
    issues.push(...coalitionStabilizationStreakIssues(action, state));
    issues.push(...coalitionLockInStreakIssues(action, state));
    issues.push(...coalitionVolatilityCapIssues(action, state));
    issues.push(...crossModuleSyncStreakIssues(action, state));
    issues.push(...integratedCoalitionMaturityStreakIssues(action, state));
    issues.push(...coalitionStewardshipStreakIssues(action, state));
    issues.push(...coalitionAnchoredGovernanceStreakIssues(action, state));
    issues.push(...coalitionInstitutionalPermanenceStreakIssues(action, state));
    issues.push(...coalitionGenerationalContinuityStreakIssues(action, state));
    issues.push(...validatePrerequisites(state, action));
    if (!canExecuteAfterCooldown(state, action.id)) {
      issues.push({
        code: 'COOLDOWN_ACTIVE',
        message: `${action.title} is on cooldown.`,
        requirement: { kind: 'action_not_yet_completed', actionId: action.id },
      });
    }
  }

  return issues;
}

export function validateChoiceOption(
  choice: MultiStageChoiceDefinition,
  stageId: string,
  optionId: string,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
): StrategicValidationIssue[] {
  const stage = choice.stages.find((s) => s.stageId === stageId);
  const option = stage?.options.find((o) => o.optionId === optionId);
  if (!stage || !option) {
    return [
      {
        code: 'UNKNOWN_CHOICE',
        message: 'Invalid choice stage or option.',
        requirement: { kind: 'min_cash', amount: 0 },
      },
    ];
  }
  return evaluateRequirements(option.requirements, contracts, budget);
}

export function scoreNationalPriorityAlignment(
  action: StrategicActionDefinition,
  ctx: NationalPriorityRankingContext | null,
): NationalPriorityAlignment | null {
  if (!ctx || ctx.priorities.length === 0) return null;
  const primary = ctx.priorities.find((p) => p.isPrimary) ?? ctx.priorities[0];
  if (action.conflictingPriorities.includes(primary.id)) {
    return {
      score: -25,
      band: 'conflict',
      reason: `Undermines primary priority: ${primary.title}.`,
      priorityId: primary.id,
    };
  }
  if (action.alignedPriorities.includes(primary.id)) {
    const urgencyBoost =
      primary.urgency === 'critical'
        ? 20
        : primary.urgency === 'urgent'
          ? 12
          : primary.urgency === 'important'
            ? 6
            : 2;
    return {
      score: 15 + urgencyBoost,
      band: 'strong',
      reason: `Directly supports ${primary.title}.`,
      priorityId: primary.id,
    };
  }
  if (action.alignedPriorities.length > 0) {
    return {
      score: 8,
      band: 'moderate',
      reason: 'Supports a secondary national priority.',
      priorityId: action.alignedPriorities[0],
    };
  }
  return {
    score: 0,
    band: 'none',
    reason: 'No strong link to current national priorities.',
    priorityId: primary.id,
  };
}

// --- src/engine/strategic-recommendations.ts ---

export function rankStrategicActions(
  actions: StrategicActionDefinition[],
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  state: StrategicGameplayState,
  options?: { maxPendingTradeOffs?: number },
): StrategicActionRecommendation[] {
  const maxPending = options?.maxPendingTradeOffs ?? 8;
  const recommendations: StrategicActionRecommendation[] = [];

  for (const action of actions) {
    const issues = validateAction(action, contracts, budget, [], state, {
      maxPendingTradeOffs: maxPending,
    });
    const alignment = scoreNationalPriorityAlignment(action, priorityCtx);
    const synergies = detectStrategicSynergies(state, action, STRATEGIC_ACTION_CATALOG);
    recommendations.push({
      actionId: action.id,
      title: action.title,
      feasible: issues.length === 0,
      alignmentScore:
        (alignment?.score ?? 0) +
        priorityMomentumBonus(state, action) +
        synergyScoreBonus(synergies) +
        mandateRankingBonus(state, action) +
        coalitionBalanceRankingBonus(state) +
        coalitionRecoveryRankingBonus(state, action) +
        sustainedRecoveryRankingBonus(state, action) +
        stabilizationRankingBonus(state, action) +
        lockInRankingBonus(state, action) +
        crossModuleSyncRankingBonus(state, action) +
        integratedMaturityRankingBonus(state, action) +
        stewardshipRankingBonus(state, action) +
        anchoredGovernanceRankingBonus(state, action) +
        institutionalPermanenceRankingBonus(state, action) +
        generationalContinuityRankingBonus(state, action),
      alignmentBand: alignment?.band ?? 'unknown',
      blockerCodes: issues.map((i) => i.code),
    });
  }

  return recommendations.sort((a, b) => {
    if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
    return b.alignmentScore - a.alignmentScore;
  });
}

// --- src/engine/turn-briefing.ts ---

export function buildTurnStrategicBriefing(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  priorityCtx: NationalPriorityRankingContext | null,
  budget: { actionsUsedThisTurn: number; actionsPerTurn: number },
): TurnStrategicBriefing {
  const ranked = rankStrategicActions(
    listStrategicActions(),
    contracts,
    budget,
    priorityCtx,
    state,
  );
  const topFeasible = ranked.find((r) => r.feasible);

  return {
    day: state.day,
    commitmentPressure: computeCommitmentPressure(state),
    pendingTradeOffCount: pendingTradeOffCount(state),
    mandateHeadline: summarizeMandateProgress(state),
    stakeholderWarnings: listStakeholderWarnings(state),
    coalitionBalanceIndex: computeCoalitionBalanceIndex(state.stakeholderSentiment),
    coalitionCrisisLevel: classifyCoalitionCrisisLevel(state),
    coalitionCrisisStreakDays: state.coalitionCrisisStreakDays ?? 0,
    coalitionRecoveryStreakDays: state.coalitionRecoveryStreakDays ?? 0,
    prolongedCoalitionCrisis: isProlongedCoalitionCrisis(state),
    sustainedCoalitionRecovery: isSustainedCoalitionRecovery(state),
    coalitionVolatilityEvents: state.coalitionVolatilityEvents ?? 0,
    elevatedCoalitionVolatility: isElevatedCoalitionVolatility(state),
    coalitionStabilizationStreakDays: state.coalitionStabilizationStreakDays ?? 0,
    postStabilizationLockIn: isPostStabilizationLockIn(state),
    coalitionLockInStreakDays: state.coalitionLockInStreakDays ?? 0,
    crossModuleSyncStreakDays: state.crossModuleSyncStreakDays ?? 0,
    integratedCoalitionMaturity: isIntegratedCoalitionMaturity(state),
    integratedCoalitionMaturityStreakDays: state.integratedCoalitionMaturityStreakDays ?? 0,
    sustainedIntegratedCoalitionStewardship: isSustainedIntegratedCoalitionStewardship(state),
    coalitionStewardshipStreakDays: state.coalitionStewardshipStreakDays ?? 0,
    anchoredCoalitionGovernance: isAnchoredCoalitionGovernance(state),
    coalitionAnchoredGovernanceStreakDays: state.coalitionAnchoredGovernanceStreakDays ?? 0,
    institutionalCoalitionPermanence: isInstitutionalCoalitionPermanence(state),
    coalitionInstitutionalPermanenceStreakDays: state.coalitionInstitutionalPermanenceStreakDays ?? 0,
    generationalCoalitionContinuity: isGenerationalCoalitionContinuity(state),
    coalitionGenerationalContinuityStreakDays: state.coalitionGenerationalContinuityStreakDays ?? 0,
    mandateDriftRisk: classifyMandateDriftRisk(state),
    completedActionCount: state.completedActionIds.length,
    activeChoiceId: state.activeChoice?.choiceId ?? null,
    ...(topFeasible
      ? {
          topRecommendationActionId: topFeasible.actionId,
          topRecommendationTitle: topFeasible.title,
        }
      : {}),
  };
}

// --- src/engine/delayed-effects.ts ---

let tradeOffSeq = 0;

export function resetDelayedEffectSequence(forTests = 0): void {
  tradeOffSeq = forTests;
}

function nextTradeOffId(): string {
  tradeOffSeq += 1;
  return `tradeoff_${tradeOffSeq}`;
}

export function scheduleDelayedTradeOffs(
  state: StrategicGameplayState,
  sourceActionId: string,
  templates: Omit<DelayedTradeOff, 'id' | 'firesOnDay' | 'sourceActionId'>[],
  delayDays: number,
): StrategicGameplayState {
  const scheduled: DelayedTradeOff[] = templates.map((t) => ({
    ...t,
    id: nextTradeOffId(),
    sourceActionId,
    firesOnDay: state.day + delayDays,
  }));
  return {
    ...state,
    pendingDelayed: [...state.pendingDelayed, ...scheduled].sort(
      (a, b) => a.firesOnDay - b.firesOnDay,
    ),
  };
}

export function applyDomainEffects(
  contracts: StrategicGameplayContracts,
  bundle: DomainEffectBundle,
): void {
  if (bundle.economy) contracts.economy.applyPatch(bundle.economy);
  if (bundle.government) contracts.government.applyPatch(bundle.government);
  if (bundle.population) contracts.population.applyPatch(bundle.population);
  if (bundle.tech) contracts.tech.applyPatch(bundle.tech);
}

export interface AdvanceDayResult {
  state: StrategicGameplayState;
  fired: DelayedTradeOff[];
}

/** Process due delayed trade-offs when the calendar advances. */
export function advanceDayAndResolveDelayed(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  toDay: number,
): AdvanceDayResult {
  const fired: DelayedTradeOff[] = [];
  let pending = [...state.pendingDelayed];
  let day = state.day;

  while (day < toDay) {
    day += 1;
    const due = pending.filter((p) => p.firesOnDay <= day);
    pending = pending.filter((p) => p.firesOnDay > day);
    for (const tradeOff of due) {
      applyDomainEffects(contracts, tradeOff.effects);
      fired.push(tradeOff);
      contracts.ui.pushToast({
        id: tradeOff.id,
        severity: 'warning',
        title: 'Delayed trade-off',
        body: tradeOff.label,
        day,
      });
    }
  }

  return {
    state: { ...state, day, pendingDelayed: pending },
    fired,
  };
}

// --- src/engine/strategic-calendar.ts ---

const MEAN_SENTIMENT = 55;
const PASSIVE_EROSION_PER_DAY = 1;

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Pull extreme coalition sentiment slightly toward the long-run mean each day. */
export function applyPassiveStakeholderReversion(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  const base = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const sentiment: StakeholderSentiment = { ...base };
  const step = PASSIVE_EROSION_PER_DAY * daysAdvanced;

  for (const group of Object.keys(sentiment) as StakeholderGroupId[]) {
    const value = sentiment[group];
    if (value > MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value - step);
    } else if (value < MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value + step);
    }
  }

  return { ...state, stakeholderSentiment: sentiment };
}

export interface AdvanceStrategicCalendarResult {
  state: StrategicGameplayState;
  firedTradeOffCount: number;
}

/** Agent 02 calendar hook — resolves delayed trade-offs, mandate drift, coalition reversion. */
export function advanceStrategicGameplayCalendar(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  toDay: number,
  crossModuleInbound?: StrategicCrossModuleInbound,
): AdvanceStrategicCalendarResult {
  if (toDay <= state.day) {
    return { state, firedTradeOffCount: 0 };
  }

  const daysAdvanced = toDay - state.day;
  const { state: afterDelayed, fired } = advanceDayAndResolveDelayed(state, contracts, toDay);
  let next = applyMandateIdleDrift(afterDelayed, toDay);
  next = advanceCoalitionCrisisStreak(next, daysAdvanced);
  next = applyProlongedCrisisMandatePressure(next, daysAdvanced);
  next = advanceCoalitionRecoveryStreak(next, daysAdvanced);
  next = applySustainedRecoveryMandateBonus(next, daysAdvanced);
  next = applyElevatedVolatilityMandateDrag(next, daysAdvanced);
  next = advanceCoalitionLockInStreak(next, daysAdvanced);
  next = advanceCrossModuleSyncStreak(next, daysAdvanced, crossModuleInbound);
  next = advanceIntegratedCoalitionMaturityStreak(next, daysAdvanced);
  next = applyIntegratedCoalitionMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStewardshipStreak(next, daysAdvanced);
  next = applyStewardshipStakeholderCalm(next, daysAdvanced);
  next = advanceCoalitionAnchoredGovernanceStreak(next, daysAdvanced);
  next = applyAnchoredGovernanceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionInstitutionalPermanenceStreak(next, daysAdvanced);
  next = applyInstitutionalPermanenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionGenerationalContinuityStreak(next, daysAdvanced);
  next = applyGenerationalContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStabilizationStreak(next, daysAdvanced);
  next = applyPassiveStakeholderReversion(next, daysAdvanced);

  return { state: next, firedTradeOffCount: fired.length };
}

// --- src/engine/strategic-gameplay-engine.ts ---

export function createInitialStrategicState(day = 1): StrategicGameplayState {
  return {
    day,
    pendingDelayed: [],
    completedActionIds: [],
    journal: [],
    priorityMomentum: {},
    actionCooldowns: {},
    mandateProgress: createEmptyMandateProgress(),
    stakeholderSentiment: createDefaultStakeholderSentiment(),
    lastAlignedActionDay: day,
    coalitionCrisisStreakDays: 0,
    coalitionRecoveryStreakDays: 0,
    coalitionVolatilityEvents: 0,
    coalitionStabilizationStreakDays: 0,
    coalitionLockInStreakDays: 0,
    crossModuleSyncStreakDays: 0,
    integratedCoalitionMaturityStreakDays: 0,
    coalitionStewardshipStreakDays: 0,
    coalitionAnchoredGovernanceStreakDays: 0,
    coalitionInstitutionalPermanenceStreakDays: 0,
    coalitionGenerationalContinuityStreakDays: 0,
    activeChoice: null,
  };
}

export function beginMultiStageChoice(
  state: StrategicGameplayState,
  choice: MultiStageChoiceDefinition,
): StrategicGameplayState {
  return {
    ...state,
    activeChoice: { choiceId: choice.choiceId, stageId: choice.entryStageId },
  };
}

export interface AdvanceChoiceResult {
  state: StrategicGameplayState;
  resolvedActionId?: string;
  issues?: ExecuteActionResult['issues'];
}

export function advanceMultiStageChoice(
  state: StrategicGameplayState,
  choice: MultiStageChoiceDefinition,
  optionId: string,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
): AdvanceChoiceResult {
  if (!state.activeChoice || state.activeChoice.choiceId !== choice.choiceId) {
    return {
      state,
      issues: [
        {
          code: 'NO_ACTIVE_CHOICE',
          message: 'No matching multi-stage choice in progress.',
          requirement: { kind: 'min_cash', amount: 0 },
        },
      ],
    };
  }

  const issues = validateChoiceOption(
    choice,
    state.activeChoice.stageId,
    optionId,
    contracts,
    budget,
  );
  if (issues.length > 0) return { state, issues };

  const stage = choice.stages.find((s) => s.stageId === state.activeChoice!.stageId)!;
  const option = stage.options.find((o) => o.optionId === optionId)!;

  if (option.nextStageId) {
    return {
      state: {
        ...state,
        activeChoice: { choiceId: choice.choiceId, stageId: option.nextStageId },
      },
    };
  }

  if (!option.resolvesActionId) {
    return {
      state: { ...state, activeChoice: null },
      issues: [
        {
          code: 'DEAD_END',
          message: 'Choice path does not resolve to an action.',
          requirement: { kind: 'min_cash', amount: 0 },
        },
      ],
    };
  }

  return {
    state: { ...state, activeChoice: null },
    resolvedActionId: option.resolvesActionId,
  };
}

export function executeStrategicAction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  options?: { delayDays?: number; maxPendingTradeOffs?: number },
): ExecuteActionResult {
  const maxPending = options?.maxPendingTradeOffs ?? DEFAULT_MAX_PENDING_TRADE_OFFS;
  const issues = validateAction(action, contracts, budget, [], state, {
    maxPendingTradeOffs: maxPending,
  });
  if (issues.length > 0) return { ok: false, issues, state };

  applyDomainEffects(contracts, action.immediateEffects);

  const alignment = scoreNationalPriorityAlignment(action, priorityCtx);
  const synergies =
    action.synergyEligible !== false
      ? detectStrategicSynergies(state, action, STRATEGIC_ACTION_CATALOG)
      : [];
  const synergyApproval = applySynergyApprovalBoost(synergies);

  if (alignment && alignment.band === 'strong') {
    contracts.government.applyPatch({
      approvalDelta: 1 + synergyApproval,
      ledgerNote: alignment.reason,
    });
  } else if (alignment && alignment.band === 'conflict') {
    contracts.government.applyPatch({ approvalDelta: -2, ledgerNote: alignment.reason });
  }

  const delayDays = options?.delayDays ?? 3;
  let nextState = scheduleDelayedTradeOffs(
    state,
    action.id,
    action.delayedTradeOffs,
    delayDays,
  );
  nextState = {
    ...nextState,
    completedActionIds: [...nextState.completedActionIds, action.id],
  };
  nextState = appendJournalEntry(
    nextState,
    action,
    alignment?.band ?? null,
    action.delayedTradeOffs.length,
  );
  nextState = applyPriorityMomentum(nextState, action);
  nextState = advanceMandateOnAction(nextState, action);
  nextState = applyStakeholderReaction(nextState, action);
  if (action.alignedPriorities.length > 0) {
    nextState = touchLastAlignedActionDay(nextState, state.day);
  }
  if (action.cooldownDays && action.cooldownDays > 0) {
    nextState = startActionCooldown(nextState, action.id, action.cooldownDays);
  }
  if (action.id === 'sga_coalition_reconciliation_forum') {
    nextState = resetCoalitionCrisisStreak(nextState);
  }
  if (action.id === 'sga_coalition_emergency_compact') {
    nextState = resetCoalitionCrisisStreak(nextState);
  }
  if (action.id === 'sga_coalition_stability_dividend') {
    nextState = resetCoalitionRecoveryStreak(nextState);
  }
  if (action.id === 'sga_coalition_sustained_trust_charter') {
    nextState = resetCoalitionRecoveryStreak(nextState);
  }
  if (action.id === 'sga_coalition_volatility_review') {
    nextState = resetCoalitionVolatilityEvents(nextState);
  }
  if (action.id === 'sga_coalition_volatility_mediation') {
    nextState = decrementCoalitionVolatilityEvents(nextState);
  }
  if (action.id === 'sga_coalition_stabilization_accord') {
    nextState = resetCoalitionVolatilityEvents(nextState);
    nextState = resetCoalitionStabilizationStreak(nextState);
    nextState = resetCoalitionLockInStreak(nextState);
  }
  if (action.id === 'sga_coalition_lock_in_charter') {
    nextState = resetCoalitionLockInStreak(nextState);
  }
  if (action.id === 'sga_coalition_integrated_stabilization_review') {
    nextState = resetCrossModuleSyncStreak(nextState);
  }
  if (action.id === 'sga_coalition_integrated_maturity_compact') {
    nextState = resetIntegratedCoalitionMaturityStreak(nextState);
  }
  if (action.id === 'sga_coalition_resilience_endowment') {
    nextState = resetIntegratedCoalitionMaturityStreak(nextState);
  }
  if (action.id === 'sga_coalition_stewardship_charter') {
    nextState = resetCoalitionStewardshipStreak(nextState);
  }
  if (action.id === 'sga_coalition_anchored_trust_dividend') {
    nextState = resetCoalitionStewardshipStreak(nextState);
  }
  if (action.id === 'sga_coalition_anchored_governance_compact') {
    nextState = resetCoalitionAnchoredGovernanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_legacy_trust_endowment') {
    nextState = resetCoalitionAnchoredGovernanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_institutional_permanence_charter') {
    nextState = resetCoalitionInstitutionalPermanenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_succession_resilience_covenant') {
    nextState = resetCoalitionInstitutionalPermanenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_generational_continuity_charter') {
    nextState = resetCoalitionGenerationalContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_intergenerational_trust_endowment') {
    nextState = resetCoalitionGenerationalContinuityStreak(nextState);
  }

  contracts.ui.pushToast({
    id: `action_${action.id}_${state.day}`,
    severity: 'success',
    title: action.title,
    body:
      action.delayedTradeOffs.length > 0
        ? `${action.title} committed — ${action.delayedTradeOffs.length} delayed trade-off(s) scheduled.`
        : `${action.title} completed.`,
    day: state.day,
  });

  contracts.ui.setActionHudSummary(
    budget.actionsUsedThisTurn + action.apCost,
    budget.actionsPerTurn,
    nextState.pendingDelayed.length,
  );

  return {
    ok: true,
    state: nextState,
    appliedActionId: action.id,
    scheduledTradeOffs: nextState.pendingDelayed.filter(
      (p) => p.sourceActionId === action.id,
    ),
  };
}

export function presentActiveChoiceStage(
  choice: MultiStageChoiceDefinition,
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  budget: PlayerActionBudget,
  priorityCtx: NationalPriorityRankingContext | null,
  actionCatalog: Record<string, StrategicActionDefinition>,
): void {
  if (!state.activeChoice) return;
  const stage = choice.stages.find((s) => s.stageId === state.activeChoice!.stageId);
  if (!stage) return;

  const linked = actionCatalog[choice.linkedActionId];
  const alignment = linked ? scoreNationalPriorityAlignment(linked, priorityCtx) : null;
  const preview =
    linked?.delayedTradeOffs[0]?.warning ??
    (linked?.delayedTradeOffs.length ? 'Downstream costs apply later.' : undefined);

  const blocked = stage.options.every(
    (o) =>
      validateChoiceOption(choice, stage.stageId, o.optionId, contracts, budget).length > 0,
  );

  contracts.ui.presentChoice({
    choiceId: choice.choiceId,
    stageId: stage.stageId,
    title: choice.title,
    summary: stage.prompt,
    optionLabels: stage.options.map((o) => o.label),
    blockedReason: blocked ? 'No legal option at this stage.' : undefined,
    nationalPriorityHint: alignment?.reason,
    delayedTradeOffPreview: preview,
  });
}

// --- src/catalog/strategic-action-catalog.ts ---

export const STRATEGIC_ACTION_CATALOG: Record<string, StrategicActionDefinition> = {
  'sga_water_grid_upgrade': {
    id: 'sga_water_grid_upgrade',
    title: 'National Water Grid Upgrade',
    category: 'investment',
    apCost: 2,
    cashCost: 50_000,
    treasuryCost: 200_000,
    minApproval: 45,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: ['economic_diversification'],
    tags: ['infrastructure', 'national_priority'],
    repeatable: false,
    immediateEffects: {
      economy: {
        cashDelta: -50_000,
        treasuryDelta: -200_000,
        ledgerNote: 'Up-front capital for water grid tranche.',
      },
      government: { approvalDelta: 3, directiveSlotsDelta: 1 },
      population: { essentialAccessDelta: 4, publicStabilityDelta: 2 },
      tech: { readinessDelta: { renewable_energy: 5 } },
    },
    delayedTradeOffs: [
      {
        label: 'Maintenance levy hits households',
        warning: 'In 3 days: affordability stress rises while debt is serviced.',
        effects: {
          economy: { debtDelta: 75_000, netWorthMultiplier: 0.98 },
          population: { affordabilityStressDelta: 6 },
          government: { approvalDelta: -1 },
        },
      },
    ],
  },
  'sga_supply_chain_buffer': {
    id: 'sga_supply_chain_buffer',
    title: 'Strategic Supply Chain Buffer',
    category: 'trade_off',
    apCost: 1,
    cashCost: 25_000,
    treasuryCost: 100_000,
    minApproval: 40,
    alignedPriorities: ['supply_chain_security', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['logistics', 'buffer'],
    immediateEffects: {
      economy: {
        cashDelta: -25_000,
        treasuryDelta: -100_000,
        priceMultiplierFactor: 0.95,
      },
      population: { essentialAccessDelta: 2 },
      tech: { momentumDelta: 3 },
    },
    delayedTradeOffs: [
      {
        label: 'Warehouse carrying costs',
        warning: 'Storage fees reduce treasury reserve next week.',
        effects: {
          economy: { treasuryDelta: -40_000 },
          government: { regulatoryBurdenDelta: 2 },
        },
      },
    ],
  },
  'sga_tech_accelerator': {
    id: 'sga_tech_accelerator',
    title: 'Technology Competitiveness Accelerator',
    category: 'research',
    apCost: 2,
    cashCost: 80_000,
    treasuryCost: 50_000,
    minApproval: 50,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: ['water_security'],
    tags: ['innovation'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -80_000, treasuryDelta: -50_000 },
      tech: {
        researchDelta: 120,
        readinessDelta: {
          digital_infrastructure: 8,
          advanced_manufacturing: 6,
        },
        momentumDelta: 10,
      },
      government: { approvalDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Brain-drain pressure on essential services',
        warning: 'Skilled migration toward tech hubs strains regional access.',
        effects: {
          population: {
            migrationDelta: -3,
            essentialAccessDelta: -2,
            affordabilityStressDelta: 3,
          },
        },
      },
    ],
  },
  'sga_freight_corridor_modernization': {
    id: 'sga_freight_corridor_modernization',
    title: 'Freight Corridor Modernization',
    category: 'investment',
    apCost: 2,
    cashCost: 40_000,
    treasuryCost: 180_000,
    minApproval: 42,
    alignedPriorities: ['freight_modernization', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['infrastructure', 'logistics'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -40_000, treasuryDelta: -180_000, priceMultiplierFactor: 0.92 },
      government: { approvalDelta: 2, regulatoryBurdenDelta: 1 },
      population: { essentialAccessDelta: 1, publicStabilityDelta: 1 },
      tech: { readinessDelta: { advanced_manufacturing: 4 } },
    },
    delayedTradeOffs: [
      {
        label: 'Corridor disruption during upgrades',
        warning: 'Short-term freight delays increase market prices.',
        effects: {
          economy: { priceMultiplierFactor: 1.08, treasuryDelta: -25_000 },
          population: { affordabilityStressDelta: 4 },
        },
      },
    ],
  },
  'sga_energy_resilience_reserve': {
    id: 'sga_energy_resilience_reserve',
    title: 'Energy Resilience Reserve',
    category: 'governance',
    apCost: 1,
    cashCost: 20_000,
    treasuryCost: 120_000,
    minApproval: 38,
    alignedPriorities: ['energy_resilience', 'water_security'],
    conflictingPriorities: ['technology_competitiveness'],
    tags: ['energy', 'reserve'],
    repeatable: true,
    requiresMaxPendingTradeOffs: 7,
    immediateEffects: {
      economy: { cashDelta: -20_000, treasuryDelta: -120_000 },
      government: { approvalDelta: 4, directiveSlotsDelta: 1 },
      population: { essentialAccessDelta: 3 },
      tech: { readinessDelta: { renewable_energy: 6 }, momentumDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Reserve storage operating costs',
        warning: 'Ongoing O&M draws from treasury.',
        effects: { economy: { treasuryDelta: -30_000 } },
      },
    ],
  },
  'sga_economic_diversification_pilot': {
    id: 'sga_economic_diversification_pilot',
    title: 'Economic Diversification Pilot',
    category: 'investment',
    apCost: 1,
    cashCost: 35_000,
    treasuryCost: 75_000,
    minApproval: 44,
    alignedPriorities: ['economic_diversification', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['pilot', 'industry'],
    repeatable: false,
    immediateEffects: {
      economy: { cashDelta: -35_000, treasuryDelta: -75_000, netWorthMultiplier: 1.01 },
      tech: {
        researchDelta: 40,
        readinessDelta: { advanced_manufacturing: 5, biotech: 3 },
      },
      population: { migrationDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Pilot sunset review',
        warning: 'Failed sectors require relief spending.',
        effects: {
          economy: { treasuryDelta: -50_000 },
          government: { approvalDelta: -2, reliefClaimsDelta: 3 },
          population: { publicStabilityDelta: -2 },
        },
      },
      {
        label: 'Supply chain rebalancing',
        warning: 'Secondary logistics strain after pivot.',
        effects: {
          population: { affordabilityStressDelta: 2 },
          economy: { priceMultiplierFactor: 1.04 },
        },
      },
    ],
  },
  'sga_national_resilience_compact': {
    id: 'sga_national_resilience_compact',
    title: 'National Resilience Compact',
    category: 'governance',
    apCost: 3,
    cashCost: 60_000,
    treasuryCost: 250_000,
    minApproval: 48,
    alignedPriorities: ['energy_resilience', 'supply_chain_security', 'water_security'],
    conflictingPriorities: [],
    tags: ['compact', 'cross-domain'],
    repeatable: false,
    prerequisiteActionIds: ['sga_energy_resilience_reserve', 'sga_supply_chain_buffer'],
    immediateEffects: {
      economy: { cashDelta: -60_000, treasuryDelta: -250_000 },
      government: { approvalDelta: 6, directiveSlotsDelta: 1 },
      population: { publicStabilityDelta: 5, essentialAccessDelta: 4 },
      tech: { momentumDelta: 8 },
    },
    delayedTradeOffs: [
      {
        label: 'Compact compliance audits',
        warning: 'Audits increase regulatory burden before dividends arrive.',
        effects: {
          government: { regulatoryBurdenDelta: 4, approvalDelta: -1 },
          economy: { treasuryDelta: -35_000 },
        },
      },
    ],
  },
  'sga_water_energy_nexus_program': {
    id: 'sga_water_energy_nexus_program',
    title: 'Water–Energy Nexus Program',
    category: 'investment',
    apCost: 2,
    cashCost: 55_000,
    treasuryCost: 160_000,
    minApproval: 46,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: ['economic_diversification'],
    tags: ['nexus', 'infrastructure'],
    repeatable: false,
    prerequisiteActionIds: ['sga_water_grid_upgrade'],
    immediateEffects: {
      economy: { cashDelta: -55_000, treasuryDelta: -160_000 },
      population: { essentialAccessDelta: 5 },
      tech: { readinessDelta: { renewable_energy: 10 } },
      government: { approvalDelta: 3 },
    },
    delayedTradeOffs: [
      {
        label: 'Integrated tariff adjustment',
        warning: 'Combined utilities pricing stresses households temporarily.',
        effects: {
          population: { affordabilityStressDelta: 5 },
          economy: { priceMultiplierFactor: 1.05 },
        },
      },
    ],
  },
  'sga_critical_priority_surge': {
    id: 'sga_critical_priority_surge',
    title: 'Critical Priority Surge',
    category: 'governance',
    apCost: 2,
    cashCost: 15_000,
    treasuryCost: 90_000,
    minApproval: 52,
    alignedPriorities: [
      'water_security',
      'energy_resilience',
      'supply_chain_security',
      'freight_modernization',
    ],
    conflictingPriorities: [],
    tags: ['surge', 'directive'],
    repeatable: true,
    cooldownDays: 4,
    synergyEligible: true,
    immediateEffects: {
      economy: { cashDelta: -15_000, treasuryDelta: -90_000 },
      government: { approvalDelta: 2, directiveSlotsDelta: 1 },
      population: { publicStabilityDelta: 1 },
    },
    delayedTradeOffs: [
      {
        label: 'Surge fatigue',
        warning: 'Staff burnout increases regulatory burden.',
        effects: { government: { regulatoryBurdenDelta: 3, approvalDelta: -1 } },
      },
    ],
  },
  'sga_supply_chain_contingency_plan': {
    id: 'sga_supply_chain_contingency_plan',
    title: 'Supply Chain Contingency Plan',
    category: 'trade_off',
    apCost: 1,
    cashCost: 18_000,
    treasuryCost: 45_000,
    minApproval: 40,
    alignedPriorities: ['supply_chain_security', 'freight_modernization'],
    conflictingPriorities: ['technology_competitiveness'],
    tags: ['contingency', 'logistics'],
    repeatable: true,
    prerequisiteActionIds: ['sga_supply_chain_buffer'],
    synergyEligible: true,
    immediateEffects: {
      economy: { cashDelta: -18_000, treasuryDelta: -45_000, priceMultiplierFactor: 0.97 },
      population: { essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_stabilization_pact': {
    id: 'sga_coalition_stabilization_pact',
    title: 'Coalition Stabilization Pact',
    category: 'governance',
    apCost: 2,
    cashCost: 12_000,
    treasuryCost: 60_000,
    minApproval: 46,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['national_priority', 'contingency'],
    repeatable: false,
    prerequisiteActionIds: ['sga_national_resilience_compact'],
    synergyEligible: true,
    immediateEffects: {
      economy: { cashDelta: -12_000, treasuryDelta: -60_000 },
      government: { approvalDelta: 4, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, affordabilityStressDelta: -2 },
    },
    delayedTradeOffs: [
      {
        label: 'Pact monitoring costs',
        warning: 'Independent audits increase regulatory load next week.',
        effects: {
          government: { regulatoryBurdenDelta: 2 },
          economy: { treasuryDelta: -25_000 },
        },
      },
    ],
  },
  'sga_mandate_leadership_summit': {
    id: 'sga_mandate_leadership_summit',
    title: 'Mandate Leadership Summit',
    category: 'governance',
    apCost: 2,
    cashCost: 22_000,
    treasuryCost: 85_000,
    minApproval: 50,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['national_priority', 'compact'],
    repeatable: false,
    requiredMandateMilestones: [
      { priorityId: 'water_security', milestoneId: 'mandate_priority_leadership' },
    ],
    immediateEffects: {
      economy: { cashDelta: -22_000, treasuryDelta: -85_000 },
      government: { approvalDelta: 5, directiveSlotsDelta: 1, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 4, essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Summit follow-through audits',
        warning: 'Independent reviewers increase regulatory load briefly.',
        effects: {
          government: { regulatoryBurdenDelta: 2 },
          economy: { treasuryDelta: -20_000 },
        },
      },
    ],
  },
  'sga_coalition_reconciliation_forum': {
    id: 'sga_coalition_reconciliation_forum',
    title: 'Coalition Reconciliation Forum',
    category: 'governance',
    apCost: 1,
    cashCost: 8_000,
    treasuryCost: 35_000,
    minApproval: 38,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'crisis_response'],
    repeatable: true,
    maxCoalitionBalanceIndex: 44,
    cooldownDays: 2,
    immediateEffects: {
      economy: { cashDelta: -8_000, treasuryDelta: -35_000 },
      government: { approvalDelta: 2, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 3, affordabilityStressDelta: -1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_unity_roundtable': {
    id: 'sga_coalition_unity_roundtable',
    title: 'Coalition Unity Roundtable',
    category: 'governance',
    apCost: 2,
    cashCost: 15_000,
    treasuryCost: 55_000,
    minApproval: 48,
    alignedPriorities: ['economic_diversification', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'compact'],
    repeatable: false,
    minCoalitionBalanceIndex: 72,
    immediateEffects: {
      economy: { cashDelta: -15_000, treasuryDelta: -55_000 },
      government: { approvalDelta: 4, directiveSlotsDelta: 1 },
      population: { publicStabilityDelta: 4 },
    },
    delayedTradeOffs: [
      {
        label: 'Roundtable facilitation costs',
        warning: 'Extended stakeholder sessions add treasury draw next week.',
        effects: {
          economy: { treasuryDelta: -18_000 },
          government: { regulatoryBurdenDelta: 1 },
        },
      },
    ],
  },
  'sga_coalition_emergency_compact': {
    id: 'sga_coalition_emergency_compact',
    title: 'Coalition Emergency Compact',
    category: 'governance',
    apCost: 2,
    cashCost: 12_000,
    treasuryCost: 48_000,
    minApproval: 36,
    alignedPriorities: ['supply_chain_security', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'crisis_response', 'emergency'],
    repeatable: false,
    maxCoalitionBalanceIndex: 44,
    minCoalitionCrisisStreakDays: 3,
    immediateEffects: {
      economy: { cashDelta: -12_000, treasuryDelta: -48_000 },
      government: { approvalDelta: 3, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, affordabilityStressDelta: -2 },
    },
    delayedTradeOffs: [
      {
        label: 'Emergency compact oversight',
        warning: 'Independent monitors increase regulatory load next week.',
        effects: {
          government: { regulatoryBurdenDelta: 2 },
          economy: { treasuryDelta: -15_000 },
        },
      },
    ],
  },
  'sga_coalition_stability_dividend': {
    id: 'sga_coalition_stability_dividend',
    title: 'Coalition Stability Dividend',
    category: 'governance',
    apCost: 1,
    cashCost: 10_000,
    treasuryCost: 40_000,
    minApproval: 52,
    alignedPriorities: ['freight_modernization', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'recovery'],
    repeatable: true,
    minCoalitionBalanceIndex: 68,
    minCoalitionRecoveryStreakDays: 2,
    cooldownDays: 3,
    immediateEffects: {
      economy: { cashDelta: -10_000, treasuryDelta: -40_000, netWorthMultiplier: 1.005 },
      government: { approvalDelta: 3, directiveSlotsDelta: 1 },
      population: { publicStabilityDelta: 2, migrationDelta: 1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_sustained_trust_charter': {
    id: 'sga_coalition_sustained_trust_charter',
    title: 'Coalition Sustained Trust Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 14_000,
    treasuryCost: 52_000,
    minApproval: 54,
    alignedPriorities: ['economic_diversification', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'sustained_recovery', 'trust'],
    repeatable: false,
    minCoalitionBalanceIndex: 74,
    minCoalitionRecoveryStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -14_000, treasuryDelta: -52_000 },
      government: { approvalDelta: 5, directiveSlotsDelta: 1, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 4, migrationDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Charter audit cadence',
        warning: 'Independent trust audits add treasury draw next week.',
        effects: {
          economy: { treasuryDelta: -16_000 },
          government: { regulatoryBurdenDelta: 1 },
        },
      },
    ],
  },
  'sga_coalition_volatility_review': {
    id: 'sga_coalition_volatility_review',
    title: 'Coalition Volatility Review',
    category: 'governance',
    apCost: 1,
    cashCost: 8_000,
    treasuryCost: 32_000,
    minApproval: 44,
    alignedPriorities: ['supply_chain_security', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'volatility', 'governance'],
    repeatable: true,
    minCoalitionVolatilityEvents: 1,
    cooldownDays: 2,
    immediateEffects: {
      economy: { cashDelta: -8_000, treasuryDelta: -32_000 },
      government: { approvalDelta: 2, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 3, affordabilityStressDelta: -1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_volatility_mediation': {
    id: 'sga_coalition_volatility_mediation',
    title: 'Coalition Volatility Mediation',
    category: 'governance',
    apCost: 1,
    cashCost: 9_000,
    treasuryCost: 36_000,
    minApproval: 46,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'volatility', 'mediation'],
    repeatable: true,
    minCoalitionVolatilityEvents: 2,
    cooldownDays: 2,
    immediateEffects: {
      economy: { cashDelta: -9_000, treasuryDelta: -36_000 },
      government: { approvalDelta: 2, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 2, affordabilityStressDelta: -1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_stabilization_accord': {
    id: 'sga_coalition_stabilization_accord',
    title: 'Coalition Stabilization Accord',
    category: 'governance',
    apCost: 2,
    cashCost: 16_000,
    treasuryCost: 58_000,
    minApproval: 55,
    alignedPriorities: ['freight_modernization', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'stabilization', 'accord'],
    repeatable: false,
    minCoalitionBalanceIndex: 70,
    minCoalitionVolatilityEvents: 1,
    minCoalitionStabilizationStreakDays: 3,
    immediateEffects: {
      economy: { cashDelta: -16_000, treasuryDelta: -58_000, netWorthMultiplier: 1.004 },
      government: { approvalDelta: 4, directiveSlotsDelta: 1, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, migrationDelta: 2 },
    },
    delayedTradeOffs: [
      {
        label: 'Accord compliance reviews',
        warning: 'Quarterly accord reviews add modest treasury draw.',
        effects: {
          economy: { treasuryDelta: -14_000 },
          government: { regulatoryBurdenDelta: 1 },
        },
      },
    ],
  },
  'sga_coalition_lock_in_charter': {
    id: 'sga_coalition_lock_in_charter',
    title: 'Coalition Lock-In Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 15_000,
    treasuryCost: 55_000,
    minApproval: 55,
    alignedPriorities: ['economic_diversification', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'lock_in', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 72,
    minCoalitionLockInStreakDays: 2,
    maxCoalitionVolatilityEvents: 0,
    immediateEffects: {
      economy: { cashDelta: -15_000, treasuryDelta: -55_000 },
      government: { approvalDelta: 5, directiveSlotsDelta: 1, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 4, migrationDelta: 1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_integrated_stabilization_review': {
    id: 'sga_coalition_integrated_stabilization_review',
    title: 'Integrated Stabilization Review',
    category: 'governance',
    apCost: 1,
    cashCost: 11_000,
    treasuryCost: 42_000,
    minApproval: 50,
    alignedPriorities: ['supply_chain_security', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'cross_module', 'stabilization'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCrossModuleSyncStreakDays: 2,
    cooldownDays: 3,
    immediateEffects: {
      economy: { cashDelta: -11_000, treasuryDelta: -42_000 },
      government: { approvalDelta: 3, regulatoryBurdenDelta: -1 },
      population: { publicStabilityDelta: 3, affordabilityStressDelta: -1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_integrated_maturity_compact': {
    id: 'sga_coalition_integrated_maturity_compact',
    title: 'Integrated Coalition Maturity Compact',
    category: 'governance',
    apCost: 2,
    cashCost: 17_000,
    treasuryCost: 62_000,
    minApproval: 55,
    alignedPriorities: ['freight_modernization', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'integrated_maturity', 'compact'],
    repeatable: false,
    minCoalitionBalanceIndex: 74,
    maxCoalitionVolatilityEvents: 0,
    minIntegratedCoalitionMaturityStreakDays: 2,
    immediateEffects: {
      economy: { cashDelta: -17_000, treasuryDelta: -62_000, netWorthMultiplier: 1.005 },
      government: { approvalDelta: 5, directiveSlotsDelta: 1, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, migrationDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_resilience_endowment': {
    id: 'sga_coalition_resilience_endowment',
    title: 'Coalition Resilience Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 13_000,
    treasuryCost: 48_000,
    minApproval: 52,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'resilience', 'endowment'],
    repeatable: true,
    minCoalitionLockInStreakDays: 2,
    minCrossModuleSyncStreakDays: 2,
    minIntegratedCoalitionMaturityStreakDays: 1,
    maxCoalitionVolatilityEvents: 0,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -13_000, treasuryDelta: -48_000 },
      government: { approvalDelta: 3 },
      population: { publicStabilityDelta: 3, essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_stewardship_charter': {
    id: 'sga_coalition_stewardship_charter',
    title: 'Coalition Stewardship Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 16_000,
    treasuryCost: 60_000,
    minApproval: 55,
    alignedPriorities: ['technology_competitiveness', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'stewardship', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 75,
    maxCoalitionVolatilityEvents: 0,
    minIntegratedCoalitionMaturityStreakDays: 2,
    minCoalitionStewardshipStreakDays: 3,
    immediateEffects: {
      economy: { cashDelta: -16_000, treasuryDelta: -60_000 },
      government: { approvalDelta: 5, directiveSlotsDelta: 1, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, migrationDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_anchored_trust_dividend': {
    id: 'sga_coalition_anchored_trust_dividend',
    title: 'Anchored Coalition Trust Dividend',
    category: 'governance',
    apCost: 1,
    cashCost: 12_000,
    treasuryCost: 44_000,
    minApproval: 52,
    alignedPriorities: ['freight_modernization', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'stewardship', 'dividend'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionStewardshipStreakDays: 2,
    cooldownDays: 3,
    immediateEffects: {
      economy: { cashDelta: -12_000, treasuryDelta: -44_000, netWorthMultiplier: 1.003 },
      government: { approvalDelta: 3 },
      population: { publicStabilityDelta: 4, affordabilityStressDelta: -1 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_anchored_governance_compact': {
    id: 'sga_coalition_anchored_governance_compact',
    title: 'Anchored Coalition Governance Compact',
    category: 'governance',
    apCost: 2,
    cashCost: 18_000,
    treasuryCost: 64_000,
    minApproval: 55,
    alignedPriorities: ['economic_diversification', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'anchored_governance', 'compact'],
    repeatable: false,
    minCoalitionBalanceIndex: 76,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionStewardshipStreakDays: 3,
    minCoalitionAnchoredGovernanceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -18_000, treasuryDelta: -64_000, netWorthMultiplier: 1.006 },
      government: { approvalDelta: 6, directiveSlotsDelta: 1, regulatoryBurdenDelta: -2 },
      population: { publicStabilityDelta: 5, migrationDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_legacy_trust_endowment': {
    id: 'sga_coalition_legacy_trust_endowment',
    title: 'Coalition Legacy Trust Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 14_000,
    treasuryCost: 50_000,
    minApproval: 52,
    alignedPriorities: ['water_security', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'legacy', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionAnchoredGovernanceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -14_000, treasuryDelta: -50_000 },
      government: { approvalDelta: 3 },
      population: { publicStabilityDelta: 4, essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_institutional_permanence_charter': {
    id: 'sga_coalition_institutional_permanence_charter',
    title: 'Institutional Coalition Permanence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 20_000,
    treasuryCost: 72_000,
    minApproval: 56,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'institutional_permanence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 77,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionAnchoredGovernanceStreakDays: 4,
    minCoalitionInstitutionalPermanenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -20_000, treasuryDelta: -72_000, netWorthMultiplier: 1.007 },
      government: { approvalDelta: 6, directiveSlotsDelta: 1, regulatoryBurdenDelta: -3 },
      population: { publicStabilityDelta: 6, migrationDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_succession_resilience_covenant': {
    id: 'sga_coalition_succession_resilience_covenant',
    title: 'Coalition Succession Resilience Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 15_000,
    treasuryCost: 54_000,
    minApproval: 53,
    alignedPriorities: ['technology_competitiveness', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'succession', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionInstitutionalPermanenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -15_000, treasuryDelta: -54_000 },
      government: { approvalDelta: 4 },
      population: { publicStabilityDelta: 4, essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_generational_continuity_charter': {
    id: 'sga_coalition_generational_continuity_charter',
    title: 'Generational Coalition Continuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 22_000,
    treasuryCost: 78_000,
    minApproval: 57,
    alignedPriorities: ['economic_diversification', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'generational_continuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 78,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionInstitutionalPermanenceStreakDays: 4,
    minCoalitionGenerationalContinuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -22_000, treasuryDelta: -78_000, netWorthMultiplier: 1.008 },
      government: { approvalDelta: 7, directiveSlotsDelta: 1, regulatoryBurdenDelta: -3 },
      population: { publicStabilityDelta: 6, migrationDelta: 3 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_intergenerational_trust_endowment': {
    id: 'sga_coalition_intergenerational_trust_endowment',
    title: 'Intergenerational Coalition Trust Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 16_000,
    treasuryCost: 58_000,
    minApproval: 54,
    alignedPriorities: ['freight_modernization', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'intergenerational', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionGenerationalContinuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -16_000, treasuryDelta: -58_000 },
      government: { approvalDelta: 4 },
      population: { publicStabilityDelta: 5, essentialAccessDelta: 2 },
    },
    delayedTradeOffs: [],
  },
};

export const MULTI_STAGE_CHOICE_CATALOG: Record<string, MultiStageChoiceDefinition> = {
  'msc_water_commitment': {
    choiceId: 'msc_water_commitment',
    title: 'Commit to Water Security',
    linkedActionId: 'sga_water_grid_upgrade',
    entryStageId: 'stage_scope',
    stages: [
      {
        stageId: 'stage_scope',
        prompt: 'Choose the scope of the water grid intervention.',
        options: [
          {
            optionId: 'scope_regional',
            label: 'Regional tranche only',
            description: 'Lower cost, slower security gains.',
            nextStageId: 'stage_finance',
            requirements: [{ kind: 'min_cash', amount: 30_000 }],
          },
          {
            optionId: 'scope_national',
            label: 'National backbone',
            description: 'Full grid upgrade path.',
            nextStageId: 'stage_finance',
            requirements: [
              { kind: 'min_cash', amount: 50_000 },
              { kind: 'min_treasury', amount: 150_000 },
            ],
          },
        ],
      },
      {
        stageId: 'stage_finance',
        prompt: 'Select financing — each path has different delayed costs.',
        options: [
          {
            optionId: 'finance_bonds',
            label: 'Issue recovery bonds',
            description: 'Spread cost; higher delayed debt load.',
            nextStageId: 'stage_confirm',
            requirements: [{ kind: 'min_approval', rating: 45 }],
          },
          {
            optionId: 'finance_treasury',
            label: 'Direct treasury draw',
            description: 'Immediate fiscal hit, cleaner long-term books.',
            nextStageId: 'stage_confirm',
            requirements: [{ kind: 'directive_slot_available' }],
          },
        ],
      },
      {
        stageId: 'stage_confirm',
        prompt: 'Confirm execution — maintenance levy will apply in 3 days.',
        options: [
          {
            optionId: 'confirm_execute',
            label: 'Execute upgrade',
            description: 'Commit to consequential investment.',
            nextStageId: null,
            resolvesActionId: 'sga_water_grid_upgrade',
            requirements: [{ kind: 'max_affordability_stress', max: 85 }],
          },
          {
            optionId: 'confirm_abort',
            label: 'Defer',
            description: 'Exit without spending.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
  'msc_freight_corridor': {
    choiceId: 'msc_freight_corridor',
    title: 'Freight Corridor Commitment',
    linkedActionId: 'sga_freight_corridor_modernization',
    entryStageId: 'freight_route',
    stages: [
      {
        stageId: 'freight_route',
        prompt: 'Select primary corridor to modernize.',
        options: [
          {
            optionId: 'route_inland',
            label: 'Inland rail spine',
            description: 'Higher upfront cost, stronger supply chain redundancy.',
            nextStageId: 'freight_risk',
            requirements: [{ kind: 'min_treasury', amount: 120_000 }],
          },
          {
            optionId: 'route_coastal',
            label: 'Coastal highway upgrade',
            description: 'Faster delivery wins; less redundancy.',
            nextStageId: 'freight_risk',
            requirements: [{ kind: 'min_cash', amount: 25_000 }],
          },
        ],
      },
      {
        stageId: 'freight_risk',
        prompt: 'Accept disruption risk during construction?',
        options: [
          {
            optionId: 'risk_accept',
            label: 'Accept short-term disruption',
            description: 'Proceed knowing delayed price shock is likely.',
            nextStageId: 'freight_confirm',
            requirements: [{ kind: 'max_pending_tradeoffs', max: 6 }],
          },
          {
            optionId: 'risk_mitigate',
            label: 'Fund mitigation contracts',
            description: 'Higher immediate spend, smoother trade profile.',
            nextStageId: 'freight_confirm',
            requirements: [
              { kind: 'min_cash', amount: 45_000 },
              { kind: 'no_investment_lockout' },
            ],
          },
        ],
      },
      {
        stageId: 'freight_confirm',
        prompt: 'Confirm corridor modernization.',
        options: [
          {
            optionId: 'freight_execute',
            label: 'Execute modernization',
            description: 'Commit freight investment.',
            nextStageId: null,
            resolvesActionId: 'sga_freight_corridor_modernization',
            requirements: [{ kind: 'min_approval', rating: 42 }],
          },
          {
            optionId: 'freight_defer',
            label: 'Defer',
            description: 'Exit without commitment.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
  'msc_diversification_pilot': {
    choiceId: 'msc_diversification_pilot',
    title: 'Diversification Pilot Path',
    linkedActionId: 'sga_economic_diversification_pilot',
    entryStageId: 'div_sector',
    stages: [
      {
        stageId: 'div_sector',
        prompt: 'Pick pilot sector focus.',
        options: [
          {
            optionId: 'sector_manufacturing',
            label: 'Advanced manufacturing',
            description: 'Industrial diversification track.',
            nextStageId: 'div_commit',
            requirements: [{ kind: 'tech_readiness', track: 'advanced_manufacturing', min: 8 }],
          },
          {
            optionId: 'sector_biotech',
            label: 'Biotech cluster',
            description: 'High research, slower household payoff.',
            nextStageId: 'div_commit',
            requirements: [{ kind: 'tech_readiness', track: 'biotech', min: 3 }],
          },
        ],
      },
      {
        stageId: 'div_commit',
        prompt: 'Confirm pilot — two delayed trade-offs will queue.',
        options: [
          {
            optionId: 'div_execute',
            label: 'Launch pilot',
            description: 'Execute diversification pilot.',
            nextStageId: null,
            resolvesActionId: 'sga_economic_diversification_pilot',
            requirements: [{ kind: 'max_pending_tradeoffs', max: 7 }],
          },
          {
            optionId: 'div_cancel',
            label: 'Cancel',
            description: 'Exit without launch.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
  'msc_resilience_compact': {
    choiceId: 'msc_resilience_compact',
    title: 'National Resilience Compact',
    linkedActionId: 'sga_national_resilience_compact',
    entryStageId: 'resilience_terms',
    stages: [
      {
        stageId: 'resilience_terms',
        prompt: 'Choose compact enforcement level.',
        options: [
          {
            optionId: 'terms_standard',
            label: 'Standard compliance',
            description: 'Balanced audits and timelines.',
            nextStageId: 'resilience_sign',
            requirements: [{ kind: 'min_approval', rating: 48 }],
          },
          {
            optionId: 'terms_strict',
            label: 'Strict compliance',
            description: 'Higher approval bar, faster dividends.',
            nextStageId: 'resilience_sign',
            requirements: [
              { kind: 'min_approval', rating: 52 },
              { kind: 'directive_slot_available' },
            ],
          },
        ],
      },
      {
        stageId: 'resilience_sign',
        prompt: 'Sign compact — prerequisites must already be complete.',
        options: [
          {
            optionId: 'resilience_sign_execute',
            label: 'Sign and execute',
            description: 'Launch National Resilience Compact.',
            nextStageId: null,
            resolvesActionId: 'sga_national_resilience_compact',
            requirements: [{ kind: 'max_pending_tradeoffs', max: 6 }],
          },
          {
            optionId: 'resilience_sign_defer',
            label: 'Defer',
            description: 'Exit without signing.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
  'msc_coalition_stabilization': {
    choiceId: 'msc_coalition_stabilization',
    title: 'Coalition Stabilization Path',
    linkedActionId: 'sga_coalition_stabilization_pact',
    entryStageId: 'coalition_scope',
    stages: [
      {
        stageId: 'coalition_scope',
        prompt: 'Choose which coalitions to bind into the stabilization pact.',
        options: [
          {
            optionId: 'scope_industry_regions',
            label: 'Industry + regions compact',
            description: 'Balances freight and diversification stakeholders.',
            nextStageId: 'coalition_terms',
            requirements: [{ kind: 'min_approval', rating: 46 }],
          },
          {
            optionId: 'scope_public_households',
            label: 'Public services + households',
            description: 'Household-focused stabilization with higher approval bar.',
            nextStageId: 'coalition_terms',
            requirements: [
              { kind: 'min_approval', rating: 48 },
              { kind: 'max_affordability_stress', max: 80 },
            ],
          },
        ],
      },
      {
        stageId: 'coalition_terms',
        prompt: 'Set enforcement cadence — stricter terms reduce stakeholder volatility.',
        options: [
          {
            optionId: 'terms_balanced',
            label: 'Balanced enforcement',
            description: 'Standard monitoring with one delayed audit cost.',
            nextStageId: 'coalition_sign',
            requirements: [{ kind: 'min_treasury', amount: 40_000 }],
          },
          {
            optionId: 'terms_strict',
            label: 'Strict enforcement',
            description: 'Higher treasury draw, stronger immediate stability.',
            nextStageId: 'coalition_sign',
            requirements: [
              { kind: 'min_treasury', amount: 55_000 },
              { kind: 'directive_slot_available' },
            ],
          },
        ],
      },
      {
        stageId: 'coalition_sign',
        prompt: 'Sign pact — resilience compact must already be complete.',
        options: [
          {
            optionId: 'coalition_sign_execute',
            label: 'Sign stabilization pact',
            description: 'Execute coalition stabilization.',
            nextStageId: null,
            resolvesActionId: 'sga_coalition_stabilization_pact',
            requirements: [{ kind: 'max_pending_tradeoffs', max: 7 }],
          },
          {
            optionId: 'coalition_sign_defer',
            label: 'Defer',
            description: 'Exit without signing.',
            nextStageId: null,
          },
        ],
      },
    ],
  },
};

export function getStrategicAction(id: string): StrategicActionDefinition | undefined {
  return STRATEGIC_ACTION_CATALOG[id];
}

export function listStrategicActions(): StrategicActionDefinition[] {
  return Object.values(STRATEGIC_ACTION_CATALOG);
}

// --- src/adapters/memory-contracts.ts ---

/**
 * In-memory contract adapters for unit tests and assembly stubs.
 * Agent 25 replaces these with bridges into canonical V9.4 state.
 */


export interface MemoryAdapterOptions {
  economy?: Partial<EconomySnapshot>;
  government?: Partial<GovernanceSnapshot>;
  population?: Partial<PopulationSnapshot>;
  tech?: Partial<TechSnapshot>;
}

const defaultTechReadiness = (): Record<TechTrackId, number> => ({
  digital_infrastructure: 20,
  renewable_energy: 15,
  advanced_manufacturing: 10,
  biotech: 5,
  defence_dual_use: 8,
});

export function createMemoryStrategicContracts(
  opts: MemoryAdapterOptions = {},
): StrategicGameplayContracts & {
  uiLog: { choices: StrategicChoicePresentation[]; toasts: StrategicActionToast[] };
} {
  let economy: EconomySnapshot = {
    day: 1,
    cashOnHand: 500_000,
    treasuryReserve: 1_000_000,
    debtOutstanding: 0,
    inflationIndex: 1,
    priceMultiplier: 1,
    investmentLockout: false,
    netWorthEstimate: 2_000_000,
    ...opts.economy,
  };

  let government: GovernanceSnapshot = {
    day: 1,
    approvalRating: 55,
    directiveSlotsUsed: 0,
    directiveSlotCap: 3,
    authorityMode: 'shared',
    pendingReliefClaims: 0,
    regulatoryBurden: 10,
    ...opts.government,
  };

  let population: PopulationSnapshot = {
    day: 1,
    totalPopulation: 26_000_000,
    migrationBalance: 0,
    essentialAccessIndex: 70,
    affordabilityStress: 35,
    publicStability: 72,
    ...opts.population,
  };

  let tech: TechSnapshot = {
    day: 1,
    researchPoints: 0,
    unlockedTracks: ['digital_infrastructure'],
    readinessByTrack: defaultTechReadiness(),
    innovationMomentum: 10,
    ...opts.tech,
  };

  const uiLog = { choices: [] as StrategicChoicePresentation[], toasts: [] as StrategicActionToast[] };
  let hud = { used: 0, max: 3, pending: 0 };

  const economyContract: EconomyContract = {
    moduleId: 'agent-01-economy',
    snapshot: () => economy,
    applyPatch(patch: EconomyPatch) {
      economy = {
        ...economy,
        cashOnHand: economy.cashOnHand + (patch.cashDelta ?? 0),
        treasuryReserve: economy.treasuryReserve + (patch.treasuryDelta ?? 0),
        debtOutstanding: economy.debtOutstanding + (patch.debtDelta ?? 0),
        inflationIndex: economy.inflationIndex + (patch.inflationDelta ?? 0),
        priceMultiplier: patch.priceMultiplierFactor
          ? economy.priceMultiplier * patch.priceMultiplierFactor
          : economy.priceMultiplier,
        investmentLockout: patch.investmentLockout ?? economy.investmentLockout,
        netWorthEstimate: patch.netWorthMultiplier
          ? economy.netWorthEstimate * patch.netWorthMultiplier
          : economy.netWorthEstimate,
      };
      return economy;
    },
    canAfford(cashCost, treasuryCost = 0) {
      return (
        economy.cashOnHand >= cashCost && economy.treasuryReserve >= treasuryCost
      );
    },
  };

  const governmentContract: GovernmentContract = {
    moduleId: 'agent-01-government',
    snapshot: () => government,
    applyPatch(patch: GovernancePatch) {
      government = {
        ...government,
        approvalRating: Math.max(
          0,
          Math.min(100, government.approvalRating + (patch.approvalDelta ?? 0)),
        ),
        directiveSlotsUsed:
          government.directiveSlotsUsed + (patch.directiveSlotsDelta ?? 0),
        regulatoryBurden: government.regulatoryBurden + (patch.regulatoryBurdenDelta ?? 0),
        pendingReliefClaims:
          government.pendingReliefClaims + (patch.reliefClaimsDelta ?? 0),
        authorityMode: patch.authorityMode ?? government.authorityMode,
      };
      return government;
    },
    canIssueDirective() {
      return government.directiveSlotsUsed < government.directiveSlotCap;
    },
  };

  const populationContract: PopulationContract = {
    moduleId: 'agent-01-population',
    snapshot: () => population,
    applyPatch(patch: PopulationPatch) {
      population = {
        ...population,
        totalPopulation: population.totalPopulation + (patch.populationDelta ?? 0),
        migrationBalance: population.migrationBalance + (patch.migrationDelta ?? 0),
        essentialAccessIndex: Math.max(
          0,
          Math.min(100, population.essentialAccessIndex + (patch.essentialAccessDelta ?? 0)),
        ),
        affordabilityStress: Math.max(
          0,
          Math.min(100, population.affordabilityStress + (patch.affordabilityStressDelta ?? 0)),
        ),
        publicStability: Math.max(
          0,
          Math.min(100, population.publicStability + (patch.publicStabilityDelta ?? 0)),
        ),
      };
      return population;
    },
    stressBand() {
      if (population.affordabilityStress >= 80) return 'critical';
      if (population.affordabilityStress >= 55) return 'strained';
      return 'stable';
    },
  };

  const techContract: TechContract = {
    moduleId: 'agent-01-tech',
    snapshot: () => tech,
    applyPatch(patch: TechPatch) {
      const readiness = { ...tech.readinessByTrack };
      if (patch.readinessDelta) {
        for (const [track, delta] of Object.entries(patch.readinessDelta)) {
          const id = track as TechTrackId;
          readiness[id] = Math.max(0, Math.min(100, (readiness[id] ?? 0) + (delta ?? 0)));
        }
      }
      const unlocked = [...tech.unlockedTracks];
      if (patch.unlockTrack && !unlocked.includes(patch.unlockTrack)) {
        unlocked.push(patch.unlockTrack);
      }
      tech = {
        ...tech,
        researchPoints: tech.researchPoints + (patch.researchDelta ?? 0),
        unlockedTracks: unlocked,
        readinessByTrack: readiness,
        innovationMomentum: tech.innovationMomentum + (patch.momentumDelta ?? 0),
      };
      return tech;
    },
    meetsPrerequisite(track, minReadiness) {
      return (tech.readinessByTrack[track] ?? 0) >= minReadiness;
    },
  };

  const uiContract: UiContract = {
    moduleId: 'agent-01-ui',
    presentChoice(model) {
      uiLog.choices.push(model);
    },
    pushToast(toast) {
      uiLog.toasts.push(toast);
    },
    setActionHudSummary(actionsUsed, actionsMax, pendingDelayed) {
      hud = { used: actionsUsed, max: actionsMax, pending: pendingDelayed };
    },
  };

  return {
    economy: economyContract,
    government: governmentContract,
    population: populationContract,
    tech: techContract,
    ui: uiContract,
    uiLog,
  };
}

export const AGENT_01_MODULE_ID = 'operation-10m/agent-01-strategic-gameplay';

export const AGENT_01_MODULE_VERSION = '2.5.0';



export function runOp10mAgent01StrategicGameplaySelfTests(): {

  passed: number;

  failed: number;

  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;

} {

  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];

  results.push({

    id: 'agent01_catalog',

    name: 'strategic action catalog non-empty',

    passed: listStrategicActions().length >= 32,

  });

  const contracts = createMemoryStrategicContracts();

  const action = getStrategicAction('sga_supply_chain_buffer');

  results.push({

    id: 'agent01_validate',

    name: 'default validate supply chain action',

    passed:

      !!action &&

      validateAction(action, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 3 }).length === 0,

  });

  const failed = results.filter((r) => !r.passed).length;

  return { passed: results.length - failed, failed, results };

}
// OP10M_MODULE_END agent-01-strategic-gameplay
