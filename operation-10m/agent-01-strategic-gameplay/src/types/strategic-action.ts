import type { EconomyPatch } from '../contracts/economy.ts';
import type { GovernancePatch } from '../contracts/government.ts';
import type { PopulationPatch } from '../contracts/population.ts';
import type { TechPatch } from '../contracts/tech.ts';
import type {
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
  | { kind: 'action_not_yet_completed'; actionId: string };

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
