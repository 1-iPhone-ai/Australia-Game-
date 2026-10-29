import type { EconomyPatch } from '../contracts/economy.ts';
import type { GovernancePatch } from '../contracts/government.ts';
import type { PopulationPatch } from '../contracts/population.ts';
import type { TechPatch } from '../contracts/tech.ts';
import type {
  MandateMilestoneId,
  MandateProgress,
  StakeholderSentiment,
} from './coalition-mandate.ts';
import type {
  NationalPriorityAlignmentBand,
  NationalPriorityId,
} from './national-priority.ts';

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
  | { kind: 'min_integrated_coalition_maturity_streak'; minDays: number };

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
