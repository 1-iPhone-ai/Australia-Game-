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
  /** Action requires sustained integrated-maturity stewardship streak. */
  minCoalitionStewardshipStreakDays?: number;
  /** Action requires anchored governance streak after sustained stewardship. */
  minCoalitionAnchoredGovernanceStreakDays?: number;
  /** Action requires institutional permanence streak after anchored governance. */
  minCoalitionInstitutionalPermanenceStreakDays?: number;
  /** Action requires generational continuity streak after institutional permanence. */
  minCoalitionGenerationalContinuityStreakDays?: number;
  /** Action requires civilizational endurance streak after generational continuity. */
  minCoalitionCivilizationalEnduranceStreakDays?: number;
  /** Action requires transcendent legacy streak after civilizational endurance. */
  minCoalitionTranscendentLegacyStreakDays?: number;
  /** Action requires sovereign continuum streak after transcendent legacy. */
  minCoalitionSovereignContinuumStreakDays?: number;
  /** Action requires eternal ascendance streak after sovereign continuum. */
  minCoalitionEternalAscendanceStreakDays?: number;
  /** Action requires infinite persistence streak after eternal ascendance. */
  minCoalitionInfinitePersistenceStreakDays?: number;
  /** Action requires primordial continuity streak after infinite persistence. */
  minCoalitionPrimordialContinuityStreakDays?: number;
  /** Action requires absolute sanctity streak after primordial continuity. */
  minCoalitionAbsoluteSanctityStreakDays?: number;
  /** Action requires universal immortality streak after absolute sanctity. */
  minCoalitionUniversalImmortalityStreakDays?: number;
  /** Action requires cosmic perpetuity streak after universal immortality. */
  minCoalitionCosmicPerpetuityStreakDays?: number;
  /** Action requires galactic infinity streak after cosmic perpetuity. */
  minCoalitionGalacticInfinityStreakDays?: number;
  /** Action requires stellar transcendence streak after galactic infinity. */
  minCoalitionStellarTranscendenceStreakDays?: number;
  /** Action requires quantum omnipresence streak after stellar transcendence. */
  minCoalitionQuantumOmnipresenceStreakDays?: number;
  /** Action requires multiversal persistence streak after quantum omnipresence. */
  minCoalitionMultiversalPersistenceStreakDays?: number;
  /** Action requires metaversal continuity streak after multiversal persistence. */
  minCoalitionMetaversalContinuityStreakDays?: number;
  /** Action requires omniversal synthesis streak after metaversal continuity. */
  minCoalitionOmniversalSynthesisStreakDays?: number;
  /** Action requires hyperversal harmonization streak after omniversal synthesis. */
  minCoalitionHyperversalHarmonizationStreakDays?: number;
  /** Action requires transcendent omnium streak after hyperversal harmonization. */
  minCoalitionTranscendentOmniumStreakDays?: number;
  /** Action requires supreme convergence streak after transcendent omnium. */
  minCoalitionSupremeConvergenceStreakDays?: number;
  /** Action requires apex transcendence streak after supreme convergence. */
  minCoalitionApexTranscendenceStreakDays?: number;
  /** Action requires zenith perpetuity streak after apex transcendence. */
  minCoalitionZenithPerpetuityStreakDays?: number;
  /** Action requires paragon infinity streak after zenith perpetuity. */
  minCoalitionParagonInfinityStreakDays?: number;
  /** Action requires paramount ascendancy streak after paragon infinity. */
  minCoalitionParamountAscendancyStreakDays?: number;
  /** Action requires imperial perpetuity streak after paramount ascendancy. */
  minCoalitionImperialPerpetuityStreakDays?: number;
  /** Action requires custodial eternity streak after imperial perpetuity. */
  minCoalitionCustodialEternityStreakDays?: number;
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
  | { kind: 'min_coalition_generational_continuity_streak'; minDays: number }
  | { kind: 'min_coalition_civilizational_endurance_streak'; minDays: number }
  | { kind: 'min_coalition_transcendent_legacy_streak'; minDays: number }
  | { kind: 'min_coalition_sovereign_continuum_streak'; minDays: number }
  | { kind: 'min_coalition_eternal_ascendance_streak'; minDays: number }
  | { kind: 'min_coalition_infinite_persistence_streak'; minDays: number }
  | { kind: 'min_coalition_primordial_continuity_streak'; minDays: number }
  | { kind: 'min_coalition_absolute_sanctity_streak'; minDays: number }
  | { kind: 'min_coalition_universal_immortality_streak'; minDays: number }
  | { kind: 'min_coalition_cosmic_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_galactic_infinity_streak'; minDays: number }
  | { kind: 'min_coalition_stellar_transcendence_streak'; minDays: number }
  | { kind: 'min_coalition_quantum_omnipresence_streak'; minDays: number }
  | { kind: 'min_coalition_multiversal_persistence_streak'; minDays: number }
  | { kind: 'min_coalition_metaversal_continuity_streak'; minDays: number }
  | { kind: 'min_coalition_omniversal_synthesis_streak'; minDays: number }
  | { kind: 'min_coalition_hyperversal_harmonization_streak'; minDays: number }
  | { kind: 'min_coalition_transcendent_omnium_streak'; minDays: number }
  | { kind: 'min_coalition_supreme_convergence_streak'; minDays: number }
  | { kind: 'min_coalition_apex_transcendence_streak'; minDays: number }
  | { kind: 'min_coalition_zenith_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_paragon_infinity_streak'; minDays: number }
  | { kind: 'min_coalition_paramount_ascendancy_streak'; minDays: number }
  | { kind: 'min_coalition_imperial_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_custodial_eternity_streak'; minDays: number };

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
  /** Days generational continuity held civilizational endurance eligibility. */
  coalitionCivilizationalEnduranceStreakDays?: number;
  /** Days civilizational endurance held transcendent legacy eligibility. */
  coalitionTranscendentLegacyStreakDays?: number;
  /** Days transcendent legacy held sovereign continuum eligibility. */
  coalitionSovereignContinuumStreakDays?: number;
  /** Days sovereign continuum held eternal ascendance eligibility. */
  coalitionEternalAscendanceStreakDays?: number;
  /** Days eternal ascendance held infinite persistence eligibility. */
  coalitionInfinitePersistenceStreakDays?: number;
  /** Days infinite persistence held primordial continuity eligibility. */
  coalitionPrimordialContinuityStreakDays?: number;
  /** Days primordial continuity held absolute sanctity eligibility. */
  coalitionAbsoluteSanctityStreakDays?: number;
  /** Days absolute sanctity held universal immortality eligibility. */
  coalitionUniversalImmortalityStreakDays?: number;
  /** Days universal immortality held cosmic perpetuity eligibility. */
  coalitionCosmicPerpetuityStreakDays?: number;
  /** Days cosmic perpetuity held galactic infinity eligibility. */
  coalitionGalacticInfinityStreakDays?: number;
  /** Days galactic infinity held stellar transcendence eligibility. */
  coalitionStellarTranscendenceStreakDays?: number;
  /** Days stellar transcendence held quantum omnipresence eligibility. */
  coalitionQuantumOmnipresenceStreakDays?: number;
  /** Days quantum omnipresence held multiversal persistence eligibility. */
  coalitionMultiversalPersistenceStreakDays?: number;
  /** Days multiversal persistence held metaversal continuity eligibility. */
  coalitionMetaversalContinuityStreakDays?: number;
  /** Days metaversal continuity held omniversal synthesis eligibility. */
  coalitionOmniversalSynthesisStreakDays?: number;
  /** Days omniversal synthesis held hyperversal harmonization eligibility. */
  coalitionHyperversalHarmonizationStreakDays?: number;
  /** Days hyperversal harmonization held transcendent omnium eligibility. */
  coalitionTranscendentOmniumStreakDays?: number;
  /** Days transcendent omnium held supreme convergence eligibility. */
  coalitionSupremeConvergenceStreakDays?: number;
  /** Days supreme convergence held apex transcendence eligibility. */
  coalitionApexTranscendenceStreakDays?: number;
  /** Days apex transcendence held zenith perpetuity eligibility. */
  coalitionZenithPerpetuityStreakDays?: number;
  /** Days zenith perpetuity held paragon infinity eligibility. */
  coalitionParagonInfinityStreakDays?: number;
  /** Days paragon infinity held paramount ascendancy eligibility. */
  coalitionParamountAscendancyStreakDays?: number;
  /** Days paramount ascendancy held imperial perpetuity eligibility. */
  coalitionImperialPerpetuityStreakDays?: number;
  /** Days imperial perpetuity held custodial eternity eligibility. */
  coalitionCustodialEternityStreakDays?: number;
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
