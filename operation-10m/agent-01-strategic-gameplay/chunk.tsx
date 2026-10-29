// OP10M_MODULE_BEGIN agent-01-strategic-gameplay
// content-sha256-prefix: e20c9223d2a61eb1
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
  civilizationalCoalitionEndurance: boolean;
  coalitionCivilizationalEnduranceStreakDays: number;
  transcendentCoalitionLegacy: boolean;
  coalitionTranscendentLegacyStreakDays: number;
  sovereignCoalitionContinuum: boolean;
  coalitionSovereignContinuumStreakDays: number;
  eternalCoalitionAscendance: boolean;
  coalitionEternalAscendanceStreakDays: number;
  infiniteCoalitionPersistence: boolean;
  coalitionInfinitePersistenceStreakDays: number;
  primordialCoalitionContinuity: boolean;
  coalitionPrimordialContinuityStreakDays: number;
  absoluteCoalitionSanctity: boolean;
  coalitionAbsoluteSanctityStreakDays: number;
  universalCoalitionImmortality: boolean;
  coalitionUniversalImmortalityStreakDays: number;
  cosmicCoalitionPerpetuity: boolean;
  coalitionCosmicPerpetuityStreakDays: number;
  galacticCoalitionInfinity: boolean;
  coalitionGalacticInfinityStreakDays: number;
  stellarCoalitionTranscendence: boolean;
  coalitionStellarTranscendenceStreakDays: number;
  quantumCoalitionOmnipresence: boolean;
  coalitionQuantumOmnipresenceStreakDays: number;
  multiversalCoalitionPersistence: boolean;
  coalitionMultiversalPersistenceStreakDays: number;
  metaversalCoalitionContinuity: boolean;
  coalitionMetaversalContinuityStreakDays: number;
  omniversalCoalitionSynthesis: boolean;
  coalitionOmniversalSynthesisStreakDays: number;
  hyperversalCoalitionHarmonization: boolean;
  coalitionHyperversalHarmonizationStreakDays: number;
  transcendentCoalitionOmnium: boolean;
  coalitionTranscendentOmniumStreakDays: number;
  supremeCoalitionConvergence: boolean;
  coalitionSupremeConvergenceStreakDays: number;
  apexCoalitionTranscendence: boolean;
  coalitionApexTranscendenceStreakDays: number;
  zenithCoalitionPerpetuity: boolean;
  coalitionZenithPerpetuityStreakDays: number;
  paragonCoalitionInfinity: boolean;
  coalitionParagonInfinityStreakDays: number;
  paramountCoalitionAscendancy: boolean;
  coalitionParamountAscendancyStreakDays: number;
  imperialCoalitionPerpetuity: boolean;
  coalitionImperialPerpetuityStreakDays: number;
  custodialCoalitionEternity: boolean;
  coalitionCustodialEternityStreakDays: number;
  vanguardCoalitionSynthesis: boolean;
  coalitionVanguardSynthesisStreakDays: number;
  sentinelCoalitionAscendancy: boolean;
  coalitionSentinelAscendancyStreakDays: number;
  oracleCoalitionPerpetuity: boolean;
  coalitionOraclePerpetuityStreakDays: number;
  archonCoalitionEternity: boolean;
  coalitionArchonEternityStreakDays: number;
  exarchCoalitionAscendancy: boolean;
  coalitionExarchAscendancyStreakDays: number;
  primarchCoalitionPerpetuity: boolean;
  coalitionPrimarchPerpetuityStreakDays: number;
  patriarchCoalitionEternity: boolean;
  coalitionPatriarchEternityStreakDays: number;
  matriarchCoalitionAscendancy: boolean;
  coalitionMatriarchAscendancyStreakDays: number;
  matriarchCoalitionPerpetuity: boolean;
  coalitionMatriarchPerpetuityStreakDays: number;
  matriarchCoalitionEternity: boolean;
  coalitionMatriarchEternityStreakDays: number;
  matriarchCoalitionInfinity: boolean;
  coalitionMatriarchInfinityStreakDays: number;
  matriarchCoalitionTranscendence: boolean;
  coalitionMatriarchTranscendenceStreakDays: number;
  matriarchCoalitionApotheosis: boolean;
  coalitionMatriarchApotheosisStreakDays: number;
  matriarchCoalitionDeification: boolean;
  coalitionMatriarchDeificationStreakDays: number;
  matriarchCoalitionOmnipotence: boolean;
  coalitionMatriarchOmnipotenceStreakDays: number;
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
  /** Action requires vanguard synthesis streak after custodial eternity. */
  minCoalitionVanguardSynthesisStreakDays?: number;
  /** Action requires sentinel ascendancy streak after vanguard synthesis. */
  minCoalitionSentinelAscendancyStreakDays?: number;
  /** Action requires oracle perpetuity streak after sentinel ascendancy. */
  minCoalitionOraclePerpetuityStreakDays?: number;
  /** Action requires archon eternity streak after oracle perpetuity. */
  minCoalitionArchonEternityStreakDays?: number;
  /** Action requires exarch ascendancy streak after archon eternity. */
  minCoalitionExarchAscendancyStreakDays?: number;
  /** Action requires primarch perpetuity streak after exarch ascendancy. */
  minCoalitionPrimarchPerpetuityStreakDays?: number;
  /** Action requires patriarch eternity streak after primarch perpetuity. */
  minCoalitionPatriarchEternityStreakDays?: number;
  /** Action requires matriarch ascendancy streak after patriarch eternity. */
  minCoalitionMatriarchAscendancyStreakDays?: number;
  /** Action requires matriarch perpetuity streak after matriarch ascendancy. */
  minCoalitionMatriarchPerpetuityStreakDays?: number;
  /** Action requires matriarch eternity streak after matriarch perpetuity. */
  minCoalitionMatriarchEternityStreakDays?: number;
  /** Action requires matriarch infinity streak after matriarch eternity. */
  minCoalitionMatriarchInfinityStreakDays?: number;
  minCoalitionMatriarchTranscendenceStreakDays?: number;
  minCoalitionMatriarchApotheosisStreakDays?: number;
  minCoalitionMatriarchDeificationStreakDays?: number;
  /** Action requires matriarch omnipotence streak after matriarch deification. */
  minCoalitionMatriarchOmnipotenceStreakDays?: number;
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
  | { kind: 'min_coalition_custodial_eternity_streak'; minDays: number }
  | { kind: 'min_coalition_vanguard_synthesis_streak'; minDays: number }
  | { kind: 'min_coalition_sentinel_ascendancy_streak'; minDays: number }
  | { kind: 'min_coalition_oracle_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_archon_eternity_streak'; minDays: number }
  | { kind: 'min_coalition_exarch_ascendancy_streak'; minDays: number }
  | { kind: 'min_coalition_primarch_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_patriarch_eternity_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_ascendancy_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_perpetuity_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_eternity_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_infinity_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_transcendence_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_apotheosis_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_deification_streak'; minDays: number }
  | { kind: 'min_coalition_matriarch_omnipotence_streak'; minDays: number };

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
  /** Days custodial eternity held vanguard synthesis eligibility. */
  coalitionVanguardSynthesisStreakDays?: number;
  /** Days vanguard synthesis held sentinel ascendancy eligibility. */
  coalitionSentinelAscendancyStreakDays?: number;
  /** Days sentinel ascendancy held oracle perpetuity eligibility. */
  coalitionOraclePerpetuityStreakDays?: number;
  /** Days oracle perpetuity held archon eternity eligibility. */
  coalitionArchonEternityStreakDays?: number;
  /** Days archon eternity held exarch ascendancy eligibility. */
  coalitionExarchAscendancyStreakDays?: number;
  /** Days exarch ascendancy held primarch perpetuity eligibility. */
  coalitionPrimarchPerpetuityStreakDays?: number;
  /** Days primarch perpetuity held patriarch eternity eligibility. */
  coalitionPatriarchEternityStreakDays?: number;
  /** Days patriarch eternity held matriarch ascendancy eligibility. */
  coalitionMatriarchAscendancyStreakDays?: number;
  /** Days matriarch ascendancy held matriarch perpetuity eligibility. */
  coalitionMatriarchPerpetuityStreakDays?: number;
  coalitionMatriarchEternityStreakDays?: number;
  /** Days matriarch eternity held matriarch infinity eligibility. */
  coalitionMatriarchInfinityStreakDays?: number;
  coalitionMatriarchTranscendenceStreakDays?: number;
  coalitionMatriarchApotheosisStreakDays?: number;
  coalitionMatriarchDeificationStreakDays?: number;
  coalitionMatriarchOmnipotenceStreakDays?: number;
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

export function civilizationalEnduranceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCivilizationalEnduranceStreakDays === undefined) return 0;
  const streak = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  if (streak >= action.minCoalitionCivilizationalEnduranceStreakDays) return 9;
  return 2;
}

export function transcendentLegacyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionTranscendentLegacyStreakDays === undefined) return 0;
  const streak = state.coalitionTranscendentLegacyStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentLegacyStreakDays) return 10;
  return 2;
}

export function sovereignContinuumRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSovereignContinuumStreakDays === undefined) return 0;
  const streak = state.coalitionSovereignContinuumStreakDays ?? 0;
  if (streak >= action.minCoalitionSovereignContinuumStreakDays) return 11;
  return 2;
}

export function eternalAscendanceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionEternalAscendanceStreakDays === undefined) return 0;
  const streak = state.coalitionEternalAscendanceStreakDays ?? 0;
  if (streak >= action.minCoalitionEternalAscendanceStreakDays) return 12;
  return 2;
}

export function infinitePersistenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionInfinitePersistenceStreakDays === undefined) return 0;
  const streak = state.coalitionInfinitePersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInfinitePersistenceStreakDays) return 13;
  return 2;
}

export function primordialContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPrimordialContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionPrimordialContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimordialContinuityStreakDays) return 14;
  return 2;
}

export function absoluteSanctityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionAbsoluteSanctityStreakDays === undefined) return 0;
  const streak = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  if (streak >= action.minCoalitionAbsoluteSanctityStreakDays) return 15;
  return 2;
}

export function universalImmortalityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionUniversalImmortalityStreakDays === undefined) return 0;
  const streak = state.coalitionUniversalImmortalityStreakDays ?? 0;
  if (streak >= action.minCoalitionUniversalImmortalityStreakDays) return 16;
  return 2;
}

export function cosmicPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCosmicPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionCosmicPerpetuityStreakDays) return 17;
  return 2;
}

export function galacticInfinityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionGalacticInfinityStreakDays === undefined) return 0;
  const streak = state.coalitionGalacticInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionGalacticInfinityStreakDays) return 18;
  return 2;
}

export function stellarTranscendenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionStellarTranscendenceStreakDays === undefined) return 0;
  const streak = state.coalitionStellarTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionStellarTranscendenceStreakDays) return 19;
  return 2;
}

export function quantumOmnipresenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionQuantumOmnipresenceStreakDays === undefined) return 0;
  const streak = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  if (streak >= action.minCoalitionQuantumOmnipresenceStreakDays) return 20;
  return 2;
}

export function multiversalPersistenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMultiversalPersistenceStreakDays === undefined) return 0;
  const streak = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMultiversalPersistenceStreakDays) return 21;
  return 2;
}

export function metaversalContinuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMetaversalContinuityStreakDays === undefined) return 0;
  const streak = state.coalitionMetaversalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMetaversalContinuityStreakDays) return 22;
  return 2;
}

export function omniversalSynthesisRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionOmniversalSynthesisStreakDays === undefined) return 0;
  const streak = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionOmniversalSynthesisStreakDays) return 23;
  return 2;
}

export function hyperversalHarmonizationRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionHyperversalHarmonizationStreakDays === undefined) return 0;
  const streak = state.coalitionHyperversalHarmonizationStreakDays ?? 0;
  if (streak >= action.minCoalitionHyperversalHarmonizationStreakDays) return 24;
  return 2;
}

export function transcendentOmniumRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionTranscendentOmniumStreakDays === undefined) return 0;
  const streak = state.coalitionTranscendentOmniumStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentOmniumStreakDays) return 25;
  return 2;
}

export function supremeConvergenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSupremeConvergenceStreakDays === undefined) return 0;
  const streak = state.coalitionSupremeConvergenceStreakDays ?? 0;
  if (streak >= action.minCoalitionSupremeConvergenceStreakDays) return 26;
  return 2;
}

export function apexTranscendenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionApexTranscendenceStreakDays === undefined) return 0;
  const streak = state.coalitionApexTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionApexTranscendenceStreakDays) return 27;
  return 2;
}

export function zenithPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionZenithPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionZenithPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionZenithPerpetuityStreakDays) return 28;
  return 2;
}

export function paragonInfinityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionParagonInfinityStreakDays === undefined) return 0;
  const streak = state.coalitionParagonInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionParagonInfinityStreakDays) return 29;
  return 2;
}

export function paramountAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionParamountAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionParamountAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionParamountAscendancyStreakDays) return 30;
  return 2;
}

export function imperialPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionImperialPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionImperialPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionImperialPerpetuityStreakDays) return 31;
  return 2;
}

export function custodialEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionCustodialEternityStreakDays === undefined) return 0;
  const streak = state.coalitionCustodialEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionCustodialEternityStreakDays) return 32;
  return 2;
}

export function vanguardSynthesisRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionVanguardSynthesisStreakDays === undefined) return 0;
  const streak = state.coalitionVanguardSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionVanguardSynthesisStreakDays) return 33;
  return 2;
}

export function sentinelAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionSentinelAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionSentinelAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionSentinelAscendancyStreakDays) return 34;
  return 2;
}

export function oraclePerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionOraclePerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionOraclePerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionOraclePerpetuityStreakDays) return 35;
  return 2;
}

export function archonEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionArchonEternityStreakDays === undefined) return 0;
  const streak = state.coalitionArchonEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionArchonEternityStreakDays) return 36;
  return 2;
}

export function exarchAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionExarchAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionExarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionExarchAscendancyStreakDays) return 37;
  return 2;
}

export function primarchPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPrimarchPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimarchPerpetuityStreakDays) return 38;
  return 2;
}

export function patriarchEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionPatriarchEternityStreakDays === undefined) return 0;
  const streak = state.coalitionPatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionPatriarchEternityStreakDays) return 39;
  return 2;
}

export function matriarchAscendancyRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchAscendancyStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchAscendancyStreakDays) return 40;
  return 2;
}

export function matriarchPerpetuityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchPerpetuityStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchPerpetuityStreakDays) return 41;
  return 2;
}

export function matriarchEternityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchEternityStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchEternityStreakDays) return 42;
  return 2;
}


export function matriarchInfinityRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchInfinityStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchInfinityStreakDays) return 43;
  return 2;
}


export function matriarchTranscendenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchTranscendenceStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchTranscendenceStreakDays) return 44;
  return 2;
}


export function matriarchApotheosisRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchApotheosisStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchApotheosisStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchApotheosisStreakDays) return 45;
  return 2;
}


export function matriarchDeificationRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchDeificationStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchDeificationStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchDeificationStreakDays) return 46;
  return 2;
}


export function matriarchOmnipotenceRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  if (action.minCoalitionMatriarchOmnipotenceStreakDays === undefined) return 0;
  const streak = state.coalitionMatriarchOmnipotenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchOmnipotenceStreakDays) return 47;
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
  civilizationalCoalitionEndurance: boolean;
  coalitionCivilizationalEnduranceStreakDays: number;
  transcendentCoalitionLegacy: boolean;
  coalitionTranscendentLegacyStreakDays: number;
  sovereignCoalitionContinuum: boolean;
  coalitionSovereignContinuumStreakDays: number;
  eternalCoalitionAscendance: boolean;
  coalitionEternalAscendanceStreakDays: number;
  infiniteCoalitionPersistence: boolean;
  coalitionInfinitePersistenceStreakDays: number;
  primordialCoalitionContinuity: boolean;
  coalitionPrimordialContinuityStreakDays: number;
  absoluteCoalitionSanctity: boolean;
  coalitionAbsoluteSanctityStreakDays: number;
  universalCoalitionImmortality: boolean;
  coalitionUniversalImmortalityStreakDays: number;
  cosmicCoalitionPerpetuity: boolean;
  coalitionCosmicPerpetuityStreakDays: number;
  galacticCoalitionInfinity: boolean;
  coalitionGalacticInfinityStreakDays: number;
  stellarCoalitionTranscendence: boolean;
  coalitionStellarTranscendenceStreakDays: number;
  quantumCoalitionOmnipresence: boolean;
  coalitionQuantumOmnipresenceStreakDays: number;
  multiversalCoalitionPersistence: boolean;
  coalitionMultiversalPersistenceStreakDays: number;
  metaversalCoalitionContinuity: boolean;
  coalitionMetaversalContinuityStreakDays: number;
  omniversalCoalitionSynthesis: boolean;
  coalitionOmniversalSynthesisStreakDays: number;
  hyperversalCoalitionHarmonization: boolean;
  coalitionHyperversalHarmonizationStreakDays: number;
  transcendentCoalitionOmnium: boolean;
  coalitionTranscendentOmniumStreakDays: number;
  supremeCoalitionConvergence: boolean;
  coalitionSupremeConvergenceStreakDays: number;
  apexCoalitionTranscendence: boolean;
  coalitionApexTranscendenceStreakDays: number;
  zenithCoalitionPerpetuity: boolean;
  coalitionZenithPerpetuityStreakDays: number;
  paragonCoalitionInfinity: boolean;
  coalitionParagonInfinityStreakDays: number;
  paramountCoalitionAscendancy: boolean;
  coalitionParamountAscendancyStreakDays: number;
  imperialCoalitionPerpetuity: boolean;
  coalitionImperialPerpetuityStreakDays: number;
  custodialCoalitionEternity: boolean;
  coalitionCustodialEternityStreakDays: number;
  vanguardCoalitionSynthesis: boolean;
  coalitionVanguardSynthesisStreakDays: number;
  sentinelCoalitionAscendancy: boolean;
  coalitionSentinelAscendancyStreakDays: number;
  oracleCoalitionPerpetuity: boolean;
  coalitionOraclePerpetuityStreakDays: number;
  archonCoalitionEternity: boolean;
  coalitionArchonEternityStreakDays: number;
  exarchCoalitionAscendancy: boolean;
  coalitionExarchAscendancyStreakDays: number;
  primarchCoalitionPerpetuity: boolean;
  coalitionPrimarchPerpetuityStreakDays: number;
  patriarchCoalitionEternity: boolean;
  coalitionPatriarchEternityStreakDays: number;
  matriarchCoalitionAscendancy: boolean;
  coalitionMatriarchAscendancyStreakDays: number;
  matriarchCoalitionPerpetuity: boolean;
  coalitionMatriarchPerpetuityStreakDays: number;
  matriarchCoalitionEternity: boolean;
  coalitionMatriarchEternityStreakDays: number;
  matriarchCoalitionInfinity: boolean;
  coalitionMatriarchInfinityStreakDays: number;
  matriarchCoalitionTranscendence: boolean;
  coalitionMatriarchTranscendenceStreakDays: number;
  matriarchCoalitionApotheosis: boolean;
  coalitionMatriarchApotheosisStreakDays: number;
  matriarchCoalitionDeification: boolean;
  coalitionMatriarchDeificationStreakDays: number;
  matriarchCoalitionOmnipotence: boolean;
  coalitionMatriarchOmnipotenceStreakDays: number;
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
    civilizationalCoalitionEndurance: isCivilizationalCoalitionEndurance(state),
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: isTranscendentCoalitionLegacy(state),
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: isSovereignCoalitionContinuum(state),
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: isEternalCoalitionAscendance(state),
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: isInfiniteCoalitionPersistence(state),
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: isPrimordialCoalitionContinuity(state),
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: isAbsoluteCoalitionSanctity(state),
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: isUniversalCoalitionImmortality(state),
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: isCosmicCoalitionPerpetuity(state),
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: isGalacticCoalitionInfinity(state),
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: isStellarCoalitionTranscendence(state),
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: isQuantumCoalitionOmnipresence(state),
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: isMultiversalCoalitionPersistence(state),
    coalitionMultiversalPersistenceStreakDays: state.coalitionMultiversalPersistenceStreakDays ?? 0,
    metaversalCoalitionContinuity: isMetaversalCoalitionContinuity(state),
    coalitionMetaversalContinuityStreakDays: state.coalitionMetaversalContinuityStreakDays ?? 0,
    omniversalCoalitionSynthesis: isOmniversalCoalitionSynthesis(state),
    coalitionOmniversalSynthesisStreakDays: state.coalitionOmniversalSynthesisStreakDays ?? 0,
    hyperversalCoalitionHarmonization: isHyperversalCoalitionHarmonization(state),
    coalitionHyperversalHarmonizationStreakDays:
      state.coalitionHyperversalHarmonizationStreakDays ?? 0,
    transcendentCoalitionOmnium: isTranscendentCoalitionOmnium(state),
    coalitionTranscendentOmniumStreakDays: state.coalitionTranscendentOmniumStreakDays ?? 0,
    supremeCoalitionConvergence: isSupremeCoalitionConvergence(state),
    coalitionSupremeConvergenceStreakDays: state.coalitionSupremeConvergenceStreakDays ?? 0,
    apexCoalitionTranscendence: isApexCoalitionTranscendence(state),
    coalitionApexTranscendenceStreakDays: state.coalitionApexTranscendenceStreakDays ?? 0,
    zenithCoalitionPerpetuity: isZenithCoalitionPerpetuity(state),
    coalitionZenithPerpetuityStreakDays: state.coalitionZenithPerpetuityStreakDays ?? 0,
    paragonCoalitionInfinity: isParagonCoalitionInfinity(state),
    coalitionParagonInfinityStreakDays: state.coalitionParagonInfinityStreakDays ?? 0,
    paramountCoalitionAscendancy: isParamountCoalitionAscendancy(state),
    coalitionParamountAscendancyStreakDays: state.coalitionParamountAscendancyStreakDays ?? 0,
    imperialCoalitionPerpetuity: isImperialCoalitionPerpetuity(state),
    coalitionImperialPerpetuityStreakDays: state.coalitionImperialPerpetuityStreakDays ?? 0,
    custodialCoalitionEternity: isCustodialCoalitionEternity(state),
    coalitionCustodialEternityStreakDays: state.coalitionCustodialEternityStreakDays ?? 0,
    vanguardCoalitionSynthesis: isVanguardCoalitionSynthesis(state),
    coalitionVanguardSynthesisStreakDays: state.coalitionVanguardSynthesisStreakDays ?? 0,
    sentinelCoalitionAscendancy: isSentinelCoalitionAscendancy(state),
    coalitionSentinelAscendancyStreakDays: state.coalitionSentinelAscendancyStreakDays ?? 0,
    oracleCoalitionPerpetuity: isOracleCoalitionPerpetuity(state),
    coalitionOraclePerpetuityStreakDays: state.coalitionOraclePerpetuityStreakDays ?? 0,
    archonCoalitionEternity: isArchonCoalitionEternity(state),
    coalitionArchonEternityStreakDays: state.coalitionArchonEternityStreakDays ?? 0,
    exarchCoalitionAscendancy: isExarchCoalitionAscendancy(state),
    coalitionExarchAscendancyStreakDays: state.coalitionExarchAscendancyStreakDays ?? 0,
    primarchCoalitionPerpetuity: isPrimarchCoalitionPerpetuity(state),
    coalitionPrimarchPerpetuityStreakDays: state.coalitionPrimarchPerpetuityStreakDays ?? 0,
    patriarchCoalitionEternity: isPatriarchCoalitionEternity(state),
    coalitionPatriarchEternityStreakDays: state.coalitionPatriarchEternityStreakDays ?? 0,
    matriarchCoalitionAscendancy: isMatriarchCoalitionAscendancy(state),
    coalitionMatriarchAscendancyStreakDays: state.coalitionMatriarchAscendancyStreakDays ?? 0,
    matriarchCoalitionPerpetuity: isMatriarchCoalitionPerpetuity(state),
    coalitionMatriarchPerpetuityStreakDays: state.coalitionMatriarchPerpetuityStreakDays ?? 0,
    matriarchCoalitionEternity: isMatriarchCoalitionEternity(state),
    coalitionMatriarchEternityStreakDays: state.coalitionMatriarchEternityStreakDays ?? 0,
    matriarchCoalitionInfinity: isMatriarchCoalitionInfinity(state),
    coalitionMatriarchInfinityStreakDays: state.coalitionMatriarchInfinityStreakDays ?? 0,
    matriarchCoalitionTranscendence: isMatriarchCoalitionTranscendence(state),
    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,
    matriarchCoalitionApotheosis: isMatriarchCoalitionApotheosis(state),
    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,
    matriarchCoalitionDeification: isMatriarchCoalitionDeification(state),
    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,
    matriarchCoalitionOmnipotence: isMatriarchCoalitionOmnipotence(state),
    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,
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
    civilizationalCoalitionEndurance: raw?.civilizationalCoalitionEndurance ?? false,
    coalitionCivilizationalEnduranceStreakDays: raw?.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: raw?.transcendentCoalitionLegacy ?? false,
    coalitionTranscendentLegacyStreakDays: raw?.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: raw?.sovereignCoalitionContinuum ?? false,
    coalitionSovereignContinuumStreakDays: raw?.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: raw?.eternalCoalitionAscendance ?? false,
    coalitionEternalAscendanceStreakDays: raw?.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: raw?.infiniteCoalitionPersistence ?? false,
    coalitionInfinitePersistenceStreakDays: raw?.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: raw?.primordialCoalitionContinuity ?? false,
    coalitionPrimordialContinuityStreakDays: raw?.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: raw?.absoluteCoalitionSanctity ?? false,
    coalitionAbsoluteSanctityStreakDays: raw?.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: raw?.universalCoalitionImmortality ?? false,
    coalitionUniversalImmortalityStreakDays: raw?.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: raw?.cosmicCoalitionPerpetuity ?? false,
    coalitionCosmicPerpetuityStreakDays: raw?.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: raw?.galacticCoalitionInfinity ?? false,
    coalitionGalacticInfinityStreakDays: raw?.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: raw?.stellarCoalitionTranscendence ?? false,
    coalitionStellarTranscendenceStreakDays: raw?.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: raw?.quantumCoalitionOmnipresence ?? false,
    coalitionQuantumOmnipresenceStreakDays: raw?.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: raw?.multiversalCoalitionPersistence ?? false,
    coalitionMultiversalPersistenceStreakDays: raw?.coalitionMultiversalPersistenceStreakDays ?? 0,
    metaversalCoalitionContinuity: raw?.metaversalCoalitionContinuity ?? false,
    coalitionMetaversalContinuityStreakDays: raw?.coalitionMetaversalContinuityStreakDays ?? 0,
    omniversalCoalitionSynthesis: raw?.omniversalCoalitionSynthesis ?? false,
    coalitionOmniversalSynthesisStreakDays: raw?.coalitionOmniversalSynthesisStreakDays ?? 0,
    hyperversalCoalitionHarmonization: raw?.hyperversalCoalitionHarmonization ?? false,
    coalitionHyperversalHarmonizationStreakDays:
      raw?.coalitionHyperversalHarmonizationStreakDays ?? 0,
    transcendentCoalitionOmnium: raw?.transcendentCoalitionOmnium ?? false,
    coalitionTranscendentOmniumStreakDays: raw?.coalitionTranscendentOmniumStreakDays ?? 0,
    supremeCoalitionConvergence: raw?.supremeCoalitionConvergence ?? false,
    coalitionSupremeConvergenceStreakDays: raw?.coalitionSupremeConvergenceStreakDays ?? 0,
    apexCoalitionTranscendence: raw?.apexCoalitionTranscendence ?? false,
    coalitionApexTranscendenceStreakDays: raw?.coalitionApexTranscendenceStreakDays ?? 0,
    zenithCoalitionPerpetuity: raw?.zenithCoalitionPerpetuity ?? false,
    coalitionZenithPerpetuityStreakDays: raw?.coalitionZenithPerpetuityStreakDays ?? 0,
    paragonCoalitionInfinity: raw?.paragonCoalitionInfinity ?? false,
    coalitionParagonInfinityStreakDays: raw?.coalitionParagonInfinityStreakDays ?? 0,
    paramountCoalitionAscendancy: raw?.paramountCoalitionAscendancy ?? false,
    coalitionParamountAscendancyStreakDays: raw?.coalitionParamountAscendancyStreakDays ?? 0,
    imperialCoalitionPerpetuity: raw?.imperialCoalitionPerpetuity ?? false,
    coalitionImperialPerpetuityStreakDays: raw?.coalitionImperialPerpetuityStreakDays ?? 0,
    custodialCoalitionEternity: raw?.custodialCoalitionEternity ?? false,
    coalitionCustodialEternityStreakDays: raw?.coalitionCustodialEternityStreakDays ?? 0,
    vanguardCoalitionSynthesis: raw?.vanguardCoalitionSynthesis ?? false,
    coalitionVanguardSynthesisStreakDays: raw?.coalitionVanguardSynthesisStreakDays ?? 0,
    sentinelCoalitionAscendancy: raw?.sentinelCoalitionAscendancy ?? false,
    coalitionSentinelAscendancyStreakDays: raw?.coalitionSentinelAscendancyStreakDays ?? 0,
    oracleCoalitionPerpetuity: raw?.oracleCoalitionPerpetuity ?? false,
    coalitionOraclePerpetuityStreakDays: raw?.coalitionOraclePerpetuityStreakDays ?? 0,
    archonCoalitionEternity: raw?.archonCoalitionEternity ?? false,
    coalitionArchonEternityStreakDays: raw?.coalitionArchonEternityStreakDays ?? 0,
    exarchCoalitionAscendancy: raw?.exarchCoalitionAscendancy ?? false,
    coalitionExarchAscendancyStreakDays: raw?.coalitionExarchAscendancyStreakDays ?? 0,
    primarchCoalitionPerpetuity: raw?.primarchCoalitionPerpetuity ?? false,
    coalitionPrimarchPerpetuityStreakDays: raw?.coalitionPrimarchPerpetuityStreakDays ?? 0,
    patriarchCoalitionEternity: raw?.patriarchCoalitionEternity ?? false,
    coalitionPatriarchEternityStreakDays: raw?.coalitionPatriarchEternityStreakDays ?? 0,
    matriarchCoalitionAscendancy: raw?.matriarchCoalitionAscendancy ?? false,
    coalitionMatriarchAscendancyStreakDays: raw?.coalitionMatriarchAscendancyStreakDays ?? 0,
    matriarchCoalitionPerpetuity: raw?.matriarchCoalitionPerpetuity ?? false,
    coalitionMatriarchPerpetuityStreakDays: raw?.coalitionMatriarchPerpetuityStreakDays ?? 0,
    matriarchCoalitionEternity: raw?.matriarchCoalitionEternity ?? false,
    coalitionMatriarchEternityStreakDays: raw?.coalitionMatriarchEternityStreakDays ?? 0,
    matriarchCoalitionInfinity: raw?.matriarchCoalitionInfinity ?? false,
    coalitionMatriarchInfinityStreakDays: raw?.coalitionMatriarchInfinityStreakDays ?? 0,
    matriarchCoalitionTranscendence: raw?.matriarchCoalitionTranscendence ?? false,
    coalitionMatriarchTranscendenceStreakDays: raw?.coalitionMatriarchTranscendenceStreakDays ?? 0,
    matriarchCoalitionApotheosis: raw?.matriarchCoalitionApotheosis ?? false,
    coalitionMatriarchApotheosisStreakDays: raw?.coalitionMatriarchApotheosisStreakDays ?? 0,
    matriarchCoalitionDeification: raw?.matriarchCoalitionDeification ?? false,
    coalitionMatriarchDeificationStreakDays: raw?.coalitionMatriarchDeificationStreakDays ?? 0,
    matriarchCoalitionOmnipotence: raw?.matriarchCoalitionOmnipotence ?? false,
    coalitionMatriarchOmnipotenceStreakDays: raw?.coalitionMatriarchOmnipotenceStreakDays ?? 0,
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

// --- src/engine/coalition-institutional-permanence.ts ---

export const INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD = 4;
const PERMANENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isInstitutionalCoalitionPermanence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionInstitutionalPermanenceStreakDays ?? 0) >=
    INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD
  );
}

function institutionalPermanenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const anchored = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  return (
    isAnchoredCoalitionGovernance(state) ||
    anchored >= ANCHORED_COALITION_GOVERNANCE_THRESHOLD
  );
}

/** Institutional permanence streak after anchored governance is sustained. */
export function advanceCoalitionInstitutionalPermanenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!institutionalPermanenceEligible(state)) {
    if ((state.coalitionInstitutionalPermanenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionInstitutionalPermanenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionInstitutionalPermanenceStreakDays:
      (state.coalitionInstitutionalPermanenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionInstitutionalPermanenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionInstitutionalPermanenceStreakDays: 0 };
}

export function applyInstitutionalPermanenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isInstitutionalCoalitionPermanence(state)) return state;

  const bonusTotal = daysAdvanced * PERMANENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-institutional-permanence-gates.ts ---

export function coalitionInstitutionalPermanenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionInstitutionalPermanenceStreakDays === undefined) return [];

  const streak = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInstitutionalPermanenceStreakDays) return [];

  return [
    {
      code: 'COALITION_INSTITUTIONAL_PERMANENCE_STREAK_TOO_SHORT',
      message: `Institutional permanence streak ${streak} below required ${action.minCoalitionInstitutionalPermanenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_institutional_permanence_streak',
        minDays: action.minCoalitionInstitutionalPermanenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-generational-continuity.ts ---

export const GENERATIONAL_COALITION_CONTINUITY_THRESHOLD = 4;
const GENERATIONAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isGenerationalCoalitionContinuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionGenerationalContinuityStreakDays ?? 0) >=
    GENERATIONAL_COALITION_CONTINUITY_THRESHOLD
  );
}

function generationalContinuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const permanence = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  return (
    isInstitutionalCoalitionPermanence(state) ||
    permanence >= INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD
  );
}

/** Generational continuity streak after institutional permanence is sustained. */
export function advanceCoalitionGenerationalContinuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!generationalContinuityEligible(state)) {
    if ((state.coalitionGenerationalContinuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionGenerationalContinuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionGenerationalContinuityStreakDays:
      (state.coalitionGenerationalContinuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionGenerationalContinuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionGenerationalContinuityStreakDays: 0 };
}

export function applyGenerationalContinuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isGenerationalCoalitionContinuity(state)) return state;

  const bonusTotal = daysAdvanced * GENERATIONAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-generational-continuity-gates.ts ---

export function coalitionGenerationalContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionGenerationalContinuityStreakDays === undefined) return [];

  const streak = state.coalitionGenerationalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionGenerationalContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_GENERATIONAL_CONTINUITY_STREAK_TOO_SHORT',
      message: `Generational continuity streak ${streak} below required ${action.minCoalitionGenerationalContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_generational_continuity_streak',
        minDays: action.minCoalitionGenerationalContinuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-civilizational-endurance.ts ---

export const CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD = 4;
const CIVILIZATIONAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isCivilizationalCoalitionEndurance(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCivilizationalEnduranceStreakDays ?? 0) >=
    CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD
  );
}

function civilizationalEnduranceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const generational = state.coalitionGenerationalContinuityStreakDays ?? 0;
  return (
    isGenerationalCoalitionContinuity(state) ||
    generational >= GENERATIONAL_COALITION_CONTINUITY_THRESHOLD
  );
}

/** Civilizational endurance streak after generational continuity is sustained. */
export function advanceCoalitionCivilizationalEnduranceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!civilizationalEnduranceEligible(state)) {
    if ((state.coalitionCivilizationalEnduranceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCivilizationalEnduranceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCivilizationalEnduranceStreakDays:
      (state.coalitionCivilizationalEnduranceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCivilizationalEnduranceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCivilizationalEnduranceStreakDays: 0 };
}

export function applyCivilizationalEnduranceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCivilizationalCoalitionEndurance(state)) return state;

  const bonusTotal = daysAdvanced * CIVILIZATIONAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-civilizational-endurance-gates.ts ---

export function coalitionCivilizationalEnduranceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCivilizationalEnduranceStreakDays === undefined) return [];

  const streak = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  if (streak >= action.minCoalitionCivilizationalEnduranceStreakDays) return [];

  return [
    {
      code: 'COALITION_CIVILIZATIONAL_ENDURANCE_STREAK_TOO_SHORT',
      message: `Civilizational endurance streak ${streak} below required ${action.minCoalitionCivilizationalEnduranceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_civilizational_endurance_streak',
        minDays: action.minCoalitionCivilizationalEnduranceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-transcendent-legacy.ts ---

export const TRANSCENDENT_COALITION_LEGACY_THRESHOLD = 4;
const TRANSCENDENT_MANDATE_BONUS_PER_DAY = 1;

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

export function isTranscendentCoalitionLegacy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionTranscendentLegacyStreakDays ?? 0) >= TRANSCENDENT_COALITION_LEGACY_THRESHOLD
  );
}

function transcendentLegacyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const endurance = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  return (
    isCivilizationalCoalitionEndurance(state) ||
    endurance >= CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD
  );
}

/** Transcendent legacy streak after civilizational endurance is sustained. */
export function advanceCoalitionTranscendentLegacyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!transcendentLegacyEligible(state)) {
    if ((state.coalitionTranscendentLegacyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionTranscendentLegacyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionTranscendentLegacyStreakDays:
      (state.coalitionTranscendentLegacyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionTranscendentLegacyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionTranscendentLegacyStreakDays: 0 };
}

export function applyTranscendentLegacyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isTranscendentCoalitionLegacy(state)) return state;

  const bonusTotal = daysAdvanced * TRANSCENDENT_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-transcendent-legacy-gates.ts ---

export function coalitionTranscendentLegacyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionTranscendentLegacyStreakDays === undefined) return [];

  const streak = state.coalitionTranscendentLegacyStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentLegacyStreakDays) return [];

  return [
    {
      code: 'COALITION_TRANSCENDENT_LEGACY_STREAK_TOO_SHORT',
      message: `Transcendent legacy streak ${streak} below required ${action.minCoalitionTranscendentLegacyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_transcendent_legacy_streak',
        minDays: action.minCoalitionTranscendentLegacyStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-sovereign-continuum.ts ---

export const SOVEREIGN_COALITION_CONTINUUM_THRESHOLD = 4;
const SOVEREIGN_MANDATE_BONUS_PER_DAY = 1;

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

export function isSovereignCoalitionContinuum(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSovereignContinuumStreakDays ?? 0) >= SOVEREIGN_COALITION_CONTINUUM_THRESHOLD
  );
}

function sovereignContinuumEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const legacy = state.coalitionTranscendentLegacyStreakDays ?? 0;
  return (
    isTranscendentCoalitionLegacy(state) || legacy >= TRANSCENDENT_COALITION_LEGACY_THRESHOLD
  );
}

/** Sovereign continuum streak after transcendent legacy is sustained. */
export function advanceCoalitionSovereignContinuumStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!sovereignContinuumEligible(state)) {
    if ((state.coalitionSovereignContinuumStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSovereignContinuumStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSovereignContinuumStreakDays:
      (state.coalitionSovereignContinuumStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSovereignContinuumStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSovereignContinuumStreakDays: 0 };
}

export function applySovereignContinuumMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSovereignCoalitionContinuum(state)) return state;

  const bonusTotal = daysAdvanced * SOVEREIGN_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-sovereign-continuum-gates.ts ---

export function coalitionSovereignContinuumStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSovereignContinuumStreakDays === undefined) return [];

  const streak = state.coalitionSovereignContinuumStreakDays ?? 0;
  if (streak >= action.minCoalitionSovereignContinuumStreakDays) return [];

  return [
    {
      code: 'COALITION_SOVEREIGN_CONTINUUM_STREAK_TOO_SHORT',
      message: `Sovereign continuum streak ${streak} below required ${action.minCoalitionSovereignContinuumStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_sovereign_continuum_streak',
        minDays: action.minCoalitionSovereignContinuumStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-eternal-ascendance.ts ---

export const ETERNAL_COALITION_ASCENDANCE_THRESHOLD = 4;
const ETERNAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isEternalCoalitionAscendance(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionEternalAscendanceStreakDays ?? 0) >= ETERNAL_COALITION_ASCENDANCE_THRESHOLD
  );
}

function eternalAscendanceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const sovereign = state.coalitionSovereignContinuumStreakDays ?? 0;
  return (
    isSovereignCoalitionContinuum(state) || sovereign >= SOVEREIGN_COALITION_CONTINUUM_THRESHOLD
  );
}

/** Eternal ascendance streak after sovereign continuum is sustained. */
export function advanceCoalitionEternalAscendanceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!eternalAscendanceEligible(state)) {
    if ((state.coalitionEternalAscendanceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionEternalAscendanceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionEternalAscendanceStreakDays:
      (state.coalitionEternalAscendanceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionEternalAscendanceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionEternalAscendanceStreakDays: 0 };
}

export function applyEternalAscendanceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isEternalCoalitionAscendance(state)) return state;

  const bonusTotal = daysAdvanced * ETERNAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-eternal-ascendance-gates.ts ---

export function coalitionEternalAscendanceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionEternalAscendanceStreakDays === undefined) return [];

  const streak = state.coalitionEternalAscendanceStreakDays ?? 0;
  if (streak >= action.minCoalitionEternalAscendanceStreakDays) return [];

  return [
    {
      code: 'COALITION_ETERNAL_ASCENDANCE_STREAK_TOO_SHORT',
      message: `Eternal ascendance streak ${streak} below required ${action.minCoalitionEternalAscendanceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_eternal_ascendance_streak',
        minDays: action.minCoalitionEternalAscendanceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-infinite-persistence.ts ---

export const INFINITE_COALITION_PERSISTENCE_THRESHOLD = 4;
const INFINITE_MANDATE_BONUS_PER_DAY = 1;

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

export function isInfiniteCoalitionPersistence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionInfinitePersistenceStreakDays ?? 0) >= INFINITE_COALITION_PERSISTENCE_THRESHOLD
  );
}

function infinitePersistenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const eternal = state.coalitionEternalAscendanceStreakDays ?? 0;
  return (
    isEternalCoalitionAscendance(state) || eternal >= ETERNAL_COALITION_ASCENDANCE_THRESHOLD
  );
}

/** Infinite persistence streak after eternal ascendance is sustained. */
export function advanceCoalitionInfinitePersistenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!infinitePersistenceEligible(state)) {
    if ((state.coalitionInfinitePersistenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionInfinitePersistenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionInfinitePersistenceStreakDays:
      (state.coalitionInfinitePersistenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionInfinitePersistenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionInfinitePersistenceStreakDays: 0 };
}

export function applyInfinitePersistenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isInfiniteCoalitionPersistence(state)) return state;

  const bonusTotal = daysAdvanced * INFINITE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-infinite-persistence-gates.ts ---

export function coalitionInfinitePersistenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionInfinitePersistenceStreakDays === undefined) return [];

  const streak = state.coalitionInfinitePersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInfinitePersistenceStreakDays) return [];

  return [
    {
      code: 'COALITION_INFINITE_PERSISTENCE_STREAK_TOO_SHORT',
      message: `Infinite persistence streak ${streak} below required ${action.minCoalitionInfinitePersistenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_infinite_persistence_streak',
        minDays: action.minCoalitionInfinitePersistenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-primordial-continuity.ts ---

export const PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD = 4;
const PRIMORDIAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isPrimordialCoalitionContinuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionPrimordialContinuityStreakDays ?? 0) >= PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD
  );
}

function primordialContinuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const infinite = state.coalitionInfinitePersistenceStreakDays ?? 0;
  return (
    isInfiniteCoalitionPersistence(state) || infinite >= INFINITE_COALITION_PERSISTENCE_THRESHOLD
  );
}

/** Primordial continuity streak after infinite persistence is sustained. */
export function advanceCoalitionPrimordialContinuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!primordialContinuityEligible(state)) {
    if ((state.coalitionPrimordialContinuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionPrimordialContinuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionPrimordialContinuityStreakDays:
      (state.coalitionPrimordialContinuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionPrimordialContinuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionPrimordialContinuityStreakDays: 0 };
}

export function applyPrimordialContinuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isPrimordialCoalitionContinuity(state)) return state;

  const bonusTotal = daysAdvanced * PRIMORDIAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-primordial-continuity-gates.ts ---

export function coalitionPrimordialContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPrimordialContinuityStreakDays === undefined) return [];

  const streak = state.coalitionPrimordialContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimordialContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_PRIMORDIAL_CONTINUITY_STREAK_TOO_SHORT',
      message: `Primordial continuity streak ${streak} below required ${action.minCoalitionPrimordialContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_primordial_continuity_streak',
        minDays: action.minCoalitionPrimordialContinuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-absolute-sanctity.ts ---

export const ABSOLUTE_COALITION_SANCTITY_THRESHOLD = 4;
const ABSOLUTE_MANDATE_BONUS_PER_DAY = 1;

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

export function isAbsoluteCoalitionSanctity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionAbsoluteSanctityStreakDays ?? 0) >= ABSOLUTE_COALITION_SANCTITY_THRESHOLD
  );
}

function absoluteSanctityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const primordial = state.coalitionPrimordialContinuityStreakDays ?? 0;
  return (
    isPrimordialCoalitionContinuity(state) ||
    primordial >= PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD
  );
}

/** Absolute sanctity streak after primordial continuity is sustained. */
export function advanceCoalitionAbsoluteSanctityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!absoluteSanctityEligible(state)) {
    if ((state.coalitionAbsoluteSanctityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionAbsoluteSanctityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionAbsoluteSanctityStreakDays:
      (state.coalitionAbsoluteSanctityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionAbsoluteSanctityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionAbsoluteSanctityStreakDays: 0 };
}

export function applyAbsoluteSanctityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isAbsoluteCoalitionSanctity(state)) return state;

  const bonusTotal = daysAdvanced * ABSOLUTE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-absolute-sanctity-gates.ts ---

export function coalitionAbsoluteSanctityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionAbsoluteSanctityStreakDays === undefined) return [];

  const streak = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  if (streak >= action.minCoalitionAbsoluteSanctityStreakDays) return [];

  return [
    {
      code: 'COALITION_ABSOLUTE_SANCTITY_STREAK_TOO_SHORT',
      message: `Absolute sanctity streak ${streak} below required ${action.minCoalitionAbsoluteSanctityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_absolute_sanctity_streak',
        minDays: action.minCoalitionAbsoluteSanctityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-universal-immortality.ts ---

export const UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD = 4;
const UNIVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isUniversalCoalitionImmortality(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionUniversalImmortalityStreakDays ?? 0) >= UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD
  );
}

function universalImmortalityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const absolute = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  return (
    isAbsoluteCoalitionSanctity(state) || absolute >= ABSOLUTE_COALITION_SANCTITY_THRESHOLD
  );
}

/** Universal immortality streak after absolute sanctity is sustained. */
export function advanceCoalitionUniversalImmortalityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!universalImmortalityEligible(state)) {
    if ((state.coalitionUniversalImmortalityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionUniversalImmortalityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionUniversalImmortalityStreakDays:
      (state.coalitionUniversalImmortalityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionUniversalImmortalityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionUniversalImmortalityStreakDays: 0 };
}

export function applyUniversalImmortalityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isUniversalCoalitionImmortality(state)) return state;

  const bonusTotal = daysAdvanced * UNIVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-universal-immortality-gates.ts ---

export function coalitionUniversalImmortalityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionUniversalImmortalityStreakDays === undefined) return [];

  const streak = state.coalitionUniversalImmortalityStreakDays ?? 0;
  if (streak >= action.minCoalitionUniversalImmortalityStreakDays) return [];

  return [
    {
      code: 'COALITION_UNIVERSAL_IMMORTALITY_STREAK_TOO_SHORT',
      message: `Universal immortality streak ${streak} below required ${action.minCoalitionUniversalImmortalityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_universal_immortality_streak',
        minDays: action.minCoalitionUniversalImmortalityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-cosmic-perpetuity.ts ---

export const COSMIC_COALITION_PERPETUITY_THRESHOLD = 4;
const COSMIC_MANDATE_BONUS_PER_DAY = 1;

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

export function isCosmicCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCosmicPerpetuityStreakDays ?? 0) >= COSMIC_COALITION_PERPETUITY_THRESHOLD
  );
}

function cosmicPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const universal = state.coalitionUniversalImmortalityStreakDays ?? 0;
  return (
    isUniversalCoalitionImmortality(state) ||
    universal >= UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD
  );
}

/** Cosmic perpetuity streak after universal immortality is sustained. */
export function advanceCoalitionCosmicPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!cosmicPerpetuityEligible(state)) {
    if ((state.coalitionCosmicPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCosmicPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCosmicPerpetuityStreakDays:
      (state.coalitionCosmicPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCosmicPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCosmicPerpetuityStreakDays: 0 };
}

export function applyCosmicPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCosmicCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * COSMIC_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-cosmic-perpetuity-gates.ts ---

export function coalitionCosmicPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCosmicPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionCosmicPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_COSMIC_PERPETUITY_STREAK_TOO_SHORT',
      message: `Cosmic perpetuity streak ${streak} below required ${action.minCoalitionCosmicPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_cosmic_perpetuity_streak',
        minDays: action.minCoalitionCosmicPerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-galactic-infinity.ts ---

export const GALACTIC_COALITION_INFINITY_THRESHOLD = 4;
const GALACTIC_MANDATE_BONUS_PER_DAY = 1;

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

export function isGalacticCoalitionInfinity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionGalacticInfinityStreakDays ?? 0) >= GALACTIC_COALITION_INFINITY_THRESHOLD
  );
}

function galacticInfinityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const cosmic = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  return (
    isCosmicCoalitionPerpetuity(state) || cosmic >= COSMIC_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Galactic infinity streak after cosmic perpetuity is sustained. */
export function advanceCoalitionGalacticInfinityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!galacticInfinityEligible(state)) {
    if ((state.coalitionGalacticInfinityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionGalacticInfinityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionGalacticInfinityStreakDays:
      (state.coalitionGalacticInfinityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionGalacticInfinityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionGalacticInfinityStreakDays: 0 };
}

export function applyGalacticInfinityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isGalacticCoalitionInfinity(state)) return state;

  const bonusTotal = daysAdvanced * GALACTIC_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-galactic-infinity-gates.ts ---

export function coalitionGalacticInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionGalacticInfinityStreakDays === undefined) return [];

  const streak = state.coalitionGalacticInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionGalacticInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_GALACTIC_INFINITY_STREAK_TOO_SHORT',
      message: `Galactic infinity streak ${streak} below required ${action.minCoalitionGalacticInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_galactic_infinity_streak',
        minDays: action.minCoalitionGalacticInfinityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-stellar-transcendence.ts ---

export const STELLAR_COALITION_TRANSCENDENCE_THRESHOLD = 4;
const STELLAR_MANDATE_BONUS_PER_DAY = 1;

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

export function isStellarCoalitionTranscendence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionStellarTranscendenceStreakDays ?? 0) >= STELLAR_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

function stellarTranscendenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const galactic = state.coalitionGalacticInfinityStreakDays ?? 0;
  return (
    isGalacticCoalitionInfinity(state) || galactic >= GALACTIC_COALITION_INFINITY_THRESHOLD
  );
}

/** Stellar transcendence streak after galactic infinity is sustained. */
export function advanceCoalitionStellarTranscendenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!stellarTranscendenceEligible(state)) {
    if ((state.coalitionStellarTranscendenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStellarTranscendenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStellarTranscendenceStreakDays:
      (state.coalitionStellarTranscendenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStellarTranscendenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStellarTranscendenceStreakDays: 0 };
}

export function applyStellarTranscendenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isStellarCoalitionTranscendence(state)) return state;

  const bonusTotal = daysAdvanced * STELLAR_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-stellar-transcendence-gates.ts ---

export function coalitionStellarTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStellarTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionStellarTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionStellarTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_STELLAR_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Stellar transcendence streak ${streak} below required ${action.minCoalitionStellarTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_stellar_transcendence_streak',
        minDays: action.minCoalitionStellarTranscendenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-quantum-omnipresence.ts ---

export const QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD = 4;
const QUANTUM_MANDATE_BONUS_PER_DAY = 1;

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

export function isQuantumCoalitionOmnipresence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionQuantumOmnipresenceStreakDays ?? 0) >= QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD
  );
}

function quantumOmnipresenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const stellar = state.coalitionStellarTranscendenceStreakDays ?? 0;
  return (
    isStellarCoalitionTranscendence(state) ||
    stellar >= STELLAR_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

/** Quantum omnipresence streak after stellar transcendence is sustained. */
export function advanceCoalitionQuantumOmnipresenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!quantumOmnipresenceEligible(state)) {
    if ((state.coalitionQuantumOmnipresenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionQuantumOmnipresenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionQuantumOmnipresenceStreakDays:
      (state.coalitionQuantumOmnipresenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionQuantumOmnipresenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionQuantumOmnipresenceStreakDays: 0 };
}

export function applyQuantumOmnipresenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isQuantumCoalitionOmnipresence(state)) return state;

  const bonusTotal = daysAdvanced * QUANTUM_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-quantum-omnipresence-gates.ts ---

export function coalitionQuantumOmnipresenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionQuantumOmnipresenceStreakDays === undefined) return [];

  const streak = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  if (streak >= action.minCoalitionQuantumOmnipresenceStreakDays) return [];

  return [
    {
      code: 'COALITION_QUANTUM_OMNIPRESENCE_STREAK_TOO_SHORT',
      message: `Quantum omnipresence streak ${streak} below required ${action.minCoalitionQuantumOmnipresenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_quantum_omnipresence_streak',
        minDays: action.minCoalitionQuantumOmnipresenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-multiversal-persistence.ts ---

export const MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD = 4;
const MULTIVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isMultiversalCoalitionPersistence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMultiversalPersistenceStreakDays ?? 0) >=
    MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD
  );
}

function multiversalPersistenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const quantum = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  return (
    isQuantumCoalitionOmnipresence(state) || quantum >= QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD
  );
}

/** Multiversal persistence streak after quantum omnipresence is sustained. */
export function advanceCoalitionMultiversalPersistenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!multiversalPersistenceEligible(state)) {
    if ((state.coalitionMultiversalPersistenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMultiversalPersistenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMultiversalPersistenceStreakDays:
      (state.coalitionMultiversalPersistenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMultiversalPersistenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMultiversalPersistenceStreakDays: 0 };
}

export function applyMultiversalPersistenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMultiversalCoalitionPersistence(state)) return state;

  const bonusTotal = daysAdvanced * MULTIVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-multiversal-persistence-gates.ts ---

export function coalitionMultiversalPersistenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMultiversalPersistenceStreakDays === undefined) return [];

  const streak = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMultiversalPersistenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MULTIVERSAL_PERSISTENCE_STREAK_TOO_SHORT',
      message: `Multiversal persistence streak ${streak} below required ${action.minCoalitionMultiversalPersistenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_multiversal_persistence_streak',
        minDays: action.minCoalitionMultiversalPersistenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-metaversal-continuity.ts ---

export const METAVERSE_COALITION_CONTINUITY_THRESHOLD = 4;
const METAVERSE_MANDATE_BONUS_PER_DAY = 1;

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

export function isMetaversalCoalitionContinuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMetaversalContinuityStreakDays ?? 0) >= METAVERSE_COALITION_CONTINUITY_THRESHOLD
  );
}

function metaversalContinuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const multiversal = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  return (
    isMultiversalCoalitionPersistence(state) ||
    multiversal >= MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD
  );
}

/** Metaversal continuity streak after multiversal persistence is sustained. */
export function advanceCoalitionMetaversalContinuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!metaversalContinuityEligible(state)) {
    if ((state.coalitionMetaversalContinuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMetaversalContinuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMetaversalContinuityStreakDays:
      (state.coalitionMetaversalContinuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMetaversalContinuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMetaversalContinuityStreakDays: 0 };
}

export function applyMetaversalContinuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMetaversalCoalitionContinuity(state)) return state;

  const bonusTotal = daysAdvanced * METAVERSE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-metaversal-continuity-gates.ts ---

export function coalitionMetaversalContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMetaversalContinuityStreakDays === undefined) return [];

  const streak = state.coalitionMetaversalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMetaversalContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_METAVERSE_CONTINUITY_STREAK_TOO_SHORT',
      message: `Metaversal continuity streak ${streak} below required ${action.minCoalitionMetaversalContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_metaversal_continuity_streak',
        minDays: action.minCoalitionMetaversalContinuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-omniversal-synthesis.ts ---

export const OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD = 4;
const OMNIVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isOmniversalCoalitionSynthesis(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionOmniversalSynthesisStreakDays ?? 0) >= OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD
  );
}

function omniversalSynthesisEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const metaversal = state.coalitionMetaversalContinuityStreakDays ?? 0;
  return (
    isMetaversalCoalitionContinuity(state) ||
    metaversal >= METAVERSE_COALITION_CONTINUITY_THRESHOLD
  );
}

/** Omniversal synthesis streak after metaversal continuity is sustained. */
export function advanceCoalitionOmniversalSynthesisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!omniversalSynthesisEligible(state)) {
    if ((state.coalitionOmniversalSynthesisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionOmniversalSynthesisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionOmniversalSynthesisStreakDays:
      (state.coalitionOmniversalSynthesisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionOmniversalSynthesisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionOmniversalSynthesisStreakDays: 0 };
}

export function applyOmniversalSynthesisMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isOmniversalCoalitionSynthesis(state)) return state;

  const bonusTotal = daysAdvanced * OMNIVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-omniversal-synthesis-gates.ts ---

export function coalitionOmniversalSynthesisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionOmniversalSynthesisStreakDays === undefined) return [];

  const streak = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionOmniversalSynthesisStreakDays) return [];

  return [
    {
      code: 'COALITION_OMNIVERSAL_SYNTHESIS_STREAK_TOO_SHORT',
      message: `Omniversal synthesis streak ${streak} below required ${action.minCoalitionOmniversalSynthesisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_omniversal_synthesis_streak',
        minDays: action.minCoalitionOmniversalSynthesisStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-hyperversal-harmonization.ts ---

export const HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD = 4;
const HYPERVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isHyperversalCoalitionHarmonization(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionHyperversalHarmonizationStreakDays ?? 0) >=
    HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD
  );
}

function hyperversalHarmonizationEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const omniversal = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  return (
    isOmniversalCoalitionSynthesis(state) ||
    omniversal >= OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD
  );
}

/** Hyperversal harmonization streak after omniversal synthesis is sustained. */
export function advanceCoalitionHyperversalHarmonizationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!hyperversalHarmonizationEligible(state)) {
    if ((state.coalitionHyperversalHarmonizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionHyperversalHarmonizationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionHyperversalHarmonizationStreakDays:
      (state.coalitionHyperversalHarmonizationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionHyperversalHarmonizationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionHyperversalHarmonizationStreakDays: 0 };
}

export function applyHyperversalHarmonizationMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isHyperversalCoalitionHarmonization(state)) return state;

  const bonusTotal = daysAdvanced * HYPERVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-hyperversal-harmonization-gates.ts ---

export function coalitionHyperversalHarmonizationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionHyperversalHarmonizationStreakDays === undefined) return [];

  const streak = state.coalitionHyperversalHarmonizationStreakDays ?? 0;
  if (streak >= action.minCoalitionHyperversalHarmonizationStreakDays) return [];

  return [
    {
      code: 'COALITION_HYPERVERSAL_HARMONIZATION_STREAK_TOO_SHORT',
      message: `Hyperversal harmonization streak ${streak} below required ${action.minCoalitionHyperversalHarmonizationStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_hyperversal_harmonization_streak',
        minDays: action.minCoalitionHyperversalHarmonizationStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-transcendent-omnium.ts ---

export const TRANSCENDENT_COALITION_OMNIUM_THRESHOLD = 4;
const TRANSCENDENT_OMNIUM_MANDATE_BONUS_PER_DAY = 1;

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

export function isTranscendentCoalitionOmnium(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionTranscendentOmniumStreakDays ?? 0) >= TRANSCENDENT_COALITION_OMNIUM_THRESHOLD
  );
}

function transcendentOmniumEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const hyperversal = state.coalitionHyperversalHarmonizationStreakDays ?? 0;
  return (
    isHyperversalCoalitionHarmonization(state) ||
    hyperversal >= HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD
  );
}

/** Transcendent omnium streak after hyperversal harmonization is sustained. */
export function advanceCoalitionTranscendentOmniumStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!transcendentOmniumEligible(state)) {
    if ((state.coalitionTranscendentOmniumStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionTranscendentOmniumStreakDays: 0 };
  }
  return {
    ...state,
    coalitionTranscendentOmniumStreakDays:
      (state.coalitionTranscendentOmniumStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionTranscendentOmniumStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionTranscendentOmniumStreakDays: 0 };
}

export function applyTranscendentOmniumMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isTranscendentCoalitionOmnium(state)) return state;

  const bonusTotal = daysAdvanced * TRANSCENDENT_OMNIUM_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-transcendent-omnium-gates.ts ---

export function coalitionTranscendentOmniumStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionTranscendentOmniumStreakDays === undefined) return [];

  const streak = state.coalitionTranscendentOmniumStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentOmniumStreakDays) return [];

  return [
    {
      code: 'COALITION_TRANSCENDENT_OMNIUM_STREAK_TOO_SHORT',
      message: `Transcendent omnium streak ${streak} below required ${action.minCoalitionTranscendentOmniumStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_transcendent_omnium_streak',
        minDays: action.minCoalitionTranscendentOmniumStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-supreme-convergence.ts ---

export const SUPREME_COALITION_CONVERGENCE_THRESHOLD = 4;
const SUPREME_CONVERGENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isSupremeCoalitionConvergence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSupremeConvergenceStreakDays ?? 0) >= SUPREME_COALITION_CONVERGENCE_THRESHOLD
  );
}

function supremeConvergenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendent = state.coalitionTranscendentOmniumStreakDays ?? 0;
  return (
    isTranscendentCoalitionOmnium(state) ||
    transcendent >= TRANSCENDENT_COALITION_OMNIUM_THRESHOLD
  );
}

/** Supreme convergence streak after transcendent omnium is sustained. */
export function advanceCoalitionSupremeConvergenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!supremeConvergenceEligible(state)) {
    if ((state.coalitionSupremeConvergenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSupremeConvergenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSupremeConvergenceStreakDays:
      (state.coalitionSupremeConvergenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSupremeConvergenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSupremeConvergenceStreakDays: 0 };
}

export function applySupremeConvergenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSupremeCoalitionConvergence(state)) return state;

  const bonusTotal = daysAdvanced * SUPREME_CONVERGENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-supreme-convergence-gates.ts ---

export function coalitionSupremeConvergenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSupremeConvergenceStreakDays === undefined) return [];

  const streak = state.coalitionSupremeConvergenceStreakDays ?? 0;
  if (streak >= action.minCoalitionSupremeConvergenceStreakDays) return [];

  return [
    {
      code: 'COALITION_SUPREME_CONVERGENCE_STREAK_TOO_SHORT',
      message: `Supreme convergence streak ${streak} below required ${action.minCoalitionSupremeConvergenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_supreme_convergence_streak',
        minDays: action.minCoalitionSupremeConvergenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-apex-transcendence.ts ---

export const APEX_COALITION_TRANSCENDENCE_THRESHOLD = 4;
const APEX_TRANSCENDENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isApexCoalitionTranscendence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionApexTranscendenceStreakDays ?? 0) >= APEX_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

function apexTranscendenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const supreme = state.coalitionSupremeConvergenceStreakDays ?? 0;
  return (
    isSupremeCoalitionConvergence(state) ||
    supreme >= SUPREME_COALITION_CONVERGENCE_THRESHOLD
  );
}

/** Apex transcendence streak after supreme convergence is sustained. */
export function advanceCoalitionApexTranscendenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!apexTranscendenceEligible(state)) {
    if ((state.coalitionApexTranscendenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionApexTranscendenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionApexTranscendenceStreakDays:
      (state.coalitionApexTranscendenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionApexTranscendenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionApexTranscendenceStreakDays: 0 };
}

export function applyApexTranscendenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isApexCoalitionTranscendence(state)) return state;

  const bonusTotal = daysAdvanced * APEX_TRANSCENDENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-apex-transcendence-gates.ts ---

export function coalitionApexTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionApexTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionApexTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionApexTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_APEX_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Apex transcendence streak ${streak} below required ${action.minCoalitionApexTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_apex_transcendence_streak',
        minDays: action.minCoalitionApexTranscendenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-zenith-perpetuity.ts ---

export const ZENITH_COALITION_PERPETUITY_THRESHOLD = 4;
const ZENITH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isZenithCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionZenithPerpetuityStreakDays ?? 0) >= ZENITH_COALITION_PERPETUITY_THRESHOLD
  );
}

function zenithPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const apex = state.coalitionApexTranscendenceStreakDays ?? 0;
  return (
    isApexCoalitionTranscendence(state) || apex >= APEX_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

/** Zenith perpetuity streak after apex transcendence is sustained. */
export function advanceCoalitionZenithPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!zenithPerpetuityEligible(state)) {
    if ((state.coalitionZenithPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionZenithPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionZenithPerpetuityStreakDays:
      (state.coalitionZenithPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionZenithPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionZenithPerpetuityStreakDays: 0 };
}

export function applyZenithPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isZenithCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * ZENITH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-zenith-perpetuity-gates.ts ---

export function coalitionZenithPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionZenithPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionZenithPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionZenithPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_ZENITH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Zenith perpetuity streak ${streak} below required ${action.minCoalitionZenithPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_zenith_perpetuity_streak',
        minDays: action.minCoalitionZenithPerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-paragon-infinity.ts ---

export const PARAGON_COALITION_INFINITY_THRESHOLD = 4;
const PARAGON_INFINITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isParagonCoalitionInfinity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionParagonInfinityStreakDays ?? 0) >= PARAGON_COALITION_INFINITY_THRESHOLD
  );
}

function paragonInfinityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const zenith = state.coalitionZenithPerpetuityStreakDays ?? 0;
  return (
    isZenithCoalitionPerpetuity(state) || zenith >= ZENITH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Paragon infinity streak after zenith perpetuity is sustained. */
export function advanceCoalitionParagonInfinityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!paragonInfinityEligible(state)) {
    if ((state.coalitionParagonInfinityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionParagonInfinityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionParagonInfinityStreakDays:
      (state.coalitionParagonInfinityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionParagonInfinityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionParagonInfinityStreakDays: 0 };
}

export function applyParagonInfinityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isParagonCoalitionInfinity(state)) return state;

  const bonusTotal = daysAdvanced * PARAGON_INFINITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-paragon-infinity-gates.ts ---

export function coalitionParagonInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionParagonInfinityStreakDays === undefined) return [];

  const streak = state.coalitionParagonInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionParagonInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_PARAGON_INFINITY_STREAK_TOO_SHORT',
      message: `Paragon infinity streak ${streak} below required ${action.minCoalitionParagonInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_paragon_infinity_streak',
        minDays: action.minCoalitionParagonInfinityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-paramount-ascendancy.ts ---

export const PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD = 4;
const PARAMOUNT_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isParamountCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionParamountAscendancyStreakDays ?? 0) >= PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD
  );
}

function paramountAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const paragon = state.coalitionParagonInfinityStreakDays ?? 0;
  return isParagonCoalitionInfinity(state) || paragon >= PARAGON_COALITION_INFINITY_THRESHOLD;
}

/** Paramount ascendancy streak after paragon infinity is sustained. */
export function advanceCoalitionParamountAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!paramountAscendancyEligible(state)) {
    if ((state.coalitionParamountAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionParamountAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionParamountAscendancyStreakDays:
      (state.coalitionParamountAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionParamountAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionParamountAscendancyStreakDays: 0 };
}

export function applyParamountAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isParamountCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * PARAMOUNT_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-paramount-ascendancy-gates.ts ---

export function coalitionParamountAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionParamountAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionParamountAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionParamountAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_PARAMOUNT_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Paramount ascendancy streak ${streak} below required ${action.minCoalitionParamountAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_paramount_ascendancy_streak',
        minDays: action.minCoalitionParamountAscendancyStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-imperial-perpetuity.ts ---

export const IMPERIAL_COALITION_PERPETUITY_THRESHOLD = 4;
const IMPERIAL_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isImperialCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionImperialPerpetuityStreakDays ?? 0) >= IMPERIAL_COALITION_PERPETUITY_THRESHOLD
  );
}

function imperialPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const paramount = state.coalitionParamountAscendancyStreakDays ?? 0;
  return (
    isParamountCoalitionAscendancy(state) || paramount >= PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Imperial perpetuity streak after paramount ascendancy is sustained. */
export function advanceCoalitionImperialPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!imperialPerpetuityEligible(state)) {
    if ((state.coalitionImperialPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionImperialPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionImperialPerpetuityStreakDays:
      (state.coalitionImperialPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionImperialPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionImperialPerpetuityStreakDays: 0 };
}

export function applyImperialPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isImperialCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * IMPERIAL_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-imperial-perpetuity-gates.ts ---

export function coalitionImperialPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionImperialPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionImperialPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionImperialPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_IMPERIAL_PERPETUITY_STREAK_TOO_SHORT',
      message: `Imperial perpetuity streak ${streak} below required ${action.minCoalitionImperialPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_imperial_perpetuity_streak',
        minDays: action.minCoalitionImperialPerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-custodial-eternity.ts ---

export const CUSTODIAL_COALITION_ETERNITY_THRESHOLD = 4;
const CUSTODIAL_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isCustodialCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCustodialEternityStreakDays ?? 0) >= CUSTODIAL_COALITION_ETERNITY_THRESHOLD
  );
}

function custodialEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const imperial = state.coalitionImperialPerpetuityStreakDays ?? 0;
  return (
    isImperialCoalitionPerpetuity(state) || imperial >= IMPERIAL_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Custodial eternity streak after imperial perpetuity is sustained. */
export function advanceCoalitionCustodialEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!custodialEternityEligible(state)) {
    if ((state.coalitionCustodialEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCustodialEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCustodialEternityStreakDays:
      (state.coalitionCustodialEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCustodialEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCustodialEternityStreakDays: 0 };
}

export function applyCustodialEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCustodialCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * CUSTODIAL_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-custodial-eternity-gates.ts ---

export function coalitionCustodialEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCustodialEternityStreakDays === undefined) return [];

  const streak = state.coalitionCustodialEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionCustodialEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_CUSTODIAL_ETERNITY_STREAK_TOO_SHORT',
      message: `Custodial eternity streak ${streak} below required ${action.minCoalitionCustodialEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_custodial_eternity_streak',
        minDays: action.minCoalitionCustodialEternityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-vanguard-synthesis.ts ---

export const VANGUARD_COALITION_SYNTHESIS_THRESHOLD = 4;
const VANGUARD_SYNTHESIS_MANDATE_BONUS_PER_DAY = 1;

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

export function isVanguardCoalitionSynthesis(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionVanguardSynthesisStreakDays ?? 0) >= VANGUARD_COALITION_SYNTHESIS_THRESHOLD
  );
}

function vanguardSynthesisEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const custodial = state.coalitionCustodialEternityStreakDays ?? 0;
  return (
    isCustodialCoalitionEternity(state) || custodial >= CUSTODIAL_COALITION_ETERNITY_THRESHOLD
  );
}

/** Vanguard synthesis streak after custodial eternity is sustained. */
export function advanceCoalitionVanguardSynthesisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!vanguardSynthesisEligible(state)) {
    if ((state.coalitionVanguardSynthesisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionVanguardSynthesisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionVanguardSynthesisStreakDays:
      (state.coalitionVanguardSynthesisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionVanguardSynthesisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionVanguardSynthesisStreakDays: 0 };
}

export function applyVanguardSynthesisMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isVanguardCoalitionSynthesis(state)) return state;

  const bonusTotal = daysAdvanced * VANGUARD_SYNTHESIS_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-vanguard-synthesis-gates.ts ---

export function coalitionVanguardSynthesisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionVanguardSynthesisStreakDays === undefined) return [];

  const streak = state.coalitionVanguardSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionVanguardSynthesisStreakDays) return [];

  return [
    {
      code: 'COALITION_VANGUARD_SYNTHESIS_STREAK_TOO_SHORT',
      message: `Vanguard synthesis streak ${streak} below required ${action.minCoalitionVanguardSynthesisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_vanguard_synthesis_streak',
        minDays: action.minCoalitionVanguardSynthesisStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-sentinel-ascendancy.ts ---

export const SENTINEL_COALITION_ASCENDANCY_THRESHOLD = 4;
const SENTINEL_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isSentinelCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSentinelAscendancyStreakDays ?? 0) >= SENTINEL_COALITION_ASCENDANCY_THRESHOLD
  );
}

function sentinelAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const vanguard = state.coalitionVanguardSynthesisStreakDays ?? 0;
  return (
    isVanguardCoalitionSynthesis(state) || vanguard >= VANGUARD_COALITION_SYNTHESIS_THRESHOLD
  );
}

/** Sentinel ascendancy streak after vanguard synthesis is sustained. */
export function advanceCoalitionSentinelAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!sentinelAscendancyEligible(state)) {
    if ((state.coalitionSentinelAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSentinelAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSentinelAscendancyStreakDays:
      (state.coalitionSentinelAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSentinelAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSentinelAscendancyStreakDays: 0 };
}

export function applySentinelAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSentinelCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * SENTINEL_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-sentinel-ascendancy-gates.ts ---

export function coalitionSentinelAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSentinelAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionSentinelAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionSentinelAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_SENTINEL_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Sentinel ascendancy streak ${streak} below required ${action.minCoalitionSentinelAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_sentinel_ascendancy_streak',
        minDays: action.minCoalitionSentinelAscendancyStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-oracle-perpetuity.ts ---

export const ORACLE_COALITION_PERPETUITY_THRESHOLD = 4;
const ORACLE_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isOracleCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionOraclePerpetuityStreakDays ?? 0) >= ORACLE_COALITION_PERPETUITY_THRESHOLD
  );
}

function oraclePerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const sentinel = state.coalitionSentinelAscendancyStreakDays ?? 0;
  return (
    isSentinelCoalitionAscendancy(state) || sentinel >= SENTINEL_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Oracle perpetuity streak after sentinel ascendancy is sustained. */
export function advanceCoalitionOraclePerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!oraclePerpetuityEligible(state)) {
    if ((state.coalitionOraclePerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionOraclePerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionOraclePerpetuityStreakDays:
      (state.coalitionOraclePerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionOraclePerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionOraclePerpetuityStreakDays: 0 };
}

export function applyOraclePerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isOracleCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * ORACLE_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-oracle-perpetuity-gates.ts ---

export function coalitionOraclePerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionOraclePerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionOraclePerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionOraclePerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_ORACLE_PERPETUITY_STREAK_TOO_SHORT',
      message: `Oracle perpetuity streak ${streak} below required ${action.minCoalitionOraclePerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_oracle_perpetuity_streak',
        minDays: action.minCoalitionOraclePerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-archon-eternity.ts ---

export const ARCHON_COALITION_ETERNITY_THRESHOLD = 4;
const ARCHON_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isArchonCoalitionEternity(state: StrategicGameplayState): boolean {
  return (state.coalitionArchonEternityStreakDays ?? 0) >= ARCHON_COALITION_ETERNITY_THRESHOLD;
}

function archonEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const oracle = state.coalitionOraclePerpetuityStreakDays ?? 0;
  return isOracleCoalitionPerpetuity(state) || oracle >= ORACLE_COALITION_PERPETUITY_THRESHOLD;
}

/** Archon eternity streak after oracle perpetuity is sustained. */
export function advanceCoalitionArchonEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!archonEternityEligible(state)) {
    if ((state.coalitionArchonEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionArchonEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionArchonEternityStreakDays: (state.coalitionArchonEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionArchonEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionArchonEternityStreakDays: 0 };
}

export function applyArchonEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isArchonCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * ARCHON_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-archon-eternity-gates.ts ---

export function coalitionArchonEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionArchonEternityStreakDays === undefined) return [];

  const streak = state.coalitionArchonEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionArchonEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_ARCHON_ETERNITY_STREAK_TOO_SHORT',
      message: `Archon eternity streak ${streak} below required ${action.minCoalitionArchonEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_archon_eternity_streak',
        minDays: action.minCoalitionArchonEternityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-exarch-ascendancy.ts ---

export const EXARCH_COALITION_ASCENDANCY_THRESHOLD = 4;
const EXARCH_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isExarchCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionExarchAscendancyStreakDays ?? 0) >= EXARCH_COALITION_ASCENDANCY_THRESHOLD
  );
}

function exarchAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const archon = state.coalitionArchonEternityStreakDays ?? 0;
  return isArchonCoalitionEternity(state) || archon >= ARCHON_COALITION_ETERNITY_THRESHOLD;
}

/** Exarch ascendancy streak after archon eternity is sustained. */
export function advanceCoalitionExarchAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!exarchAscendancyEligible(state)) {
    if ((state.coalitionExarchAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionExarchAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionExarchAscendancyStreakDays:
      (state.coalitionExarchAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionExarchAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionExarchAscendancyStreakDays: 0 };
}

export function applyExarchAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isExarchCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * EXARCH_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-exarch-ascendancy-gates.ts ---

export function coalitionExarchAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionExarchAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionExarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionExarchAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_EXARCH_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Exarch ascendancy streak ${streak} below required ${action.minCoalitionExarchAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_exarch_ascendancy_streak',
        minDays: action.minCoalitionExarchAscendancyStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-primarch-perpetuity.ts ---

export const PRIMARCH_COALITION_PERPETUITY_THRESHOLD = 4;
const PRIMARCH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isPrimarchCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionPrimarchPerpetuityStreakDays ?? 0) >= PRIMARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

function primarchPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const exarch = state.coalitionExarchAscendancyStreakDays ?? 0;
  return isExarchCoalitionAscendancy(state) || exarch >= EXARCH_COALITION_ASCENDANCY_THRESHOLD;
}

/** Primarch perpetuity streak after exarch ascendancy is sustained. */
export function advanceCoalitionPrimarchPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!primarchPerpetuityEligible(state)) {
    if ((state.coalitionPrimarchPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionPrimarchPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionPrimarchPerpetuityStreakDays:
      (state.coalitionPrimarchPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionPrimarchPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionPrimarchPerpetuityStreakDays: 0 };
}

export function applyPrimarchPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isPrimarchCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * PRIMARCH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-primarch-perpetuity-gates.ts ---

export function coalitionPrimarchPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPrimarchPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimarchPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_PRIMARCH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Primarch perpetuity streak ${streak} below required ${action.minCoalitionPrimarchPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_primarch_perpetuity_streak',
        minDays: action.minCoalitionPrimarchPerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-patriarch-eternity.ts ---

export const PATRIARCH_COALITION_ETERNITY_THRESHOLD = 4;
const PATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isPatriarchCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionPatriarchEternityStreakDays ?? 0) >= PATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

function patriarchEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const primarch = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  return (
    isPrimarchCoalitionPerpetuity(state) || primarch >= PRIMARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Patriarch eternity streak after primarch perpetuity is sustained. */
export function advanceCoalitionPatriarchEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!patriarchEternityEligible(state)) {
    if ((state.coalitionPatriarchEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionPatriarchEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionPatriarchEternityStreakDays:
      (state.coalitionPatriarchEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionPatriarchEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionPatriarchEternityStreakDays: 0 };
}

export function applyPatriarchEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isPatriarchCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * PATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-patriarch-eternity-gates.ts ---

export function coalitionPatriarchEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPatriarchEternityStreakDays === undefined) return [];

  const streak = state.coalitionPatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionPatriarchEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_PATRIARCH_ETERNITY_STREAK_TOO_SHORT',
      message: `Patriarch eternity streak ${streak} below required ${action.minCoalitionPatriarchEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_patriarch_eternity_streak',
        minDays: action.minCoalitionPatriarchEternityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-ascendancy.ts ---

export const MATRIARCH_COALITION_ASCENDANCY_THRESHOLD = 4;
const MATRIARCH_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchAscendancyStreakDays ?? 0) >= MATRIARCH_COALITION_ASCENDANCY_THRESHOLD
  );
}

function matriarchAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const patriarch = state.coalitionPatriarchEternityStreakDays ?? 0;
  return (
    isPatriarchCoalitionEternity(state) || patriarch >= PATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

/** Matriarch ascendancy streak after patriarch eternity is sustained. */
export function advanceCoalitionMatriarchAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchAscendancyEligible(state)) {
    if ((state.coalitionMatriarchAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchAscendancyStreakDays:
      (state.coalitionMatriarchAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchAscendancyStreakDays: 0 };
}

export function applyMatriarchAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-ascendancy-gates.ts ---

export function coalitionMatriarchAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Matriarch ascendancy streak ${streak} below required ${action.minCoalitionMatriarchAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_ascendancy_streak',
        minDays: action.minCoalitionMatriarchAscendancyStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-perpetuity.ts ---

export const MATRIARCH_COALITION_PERPETUITY_THRESHOLD = 4;
const MATRIARCH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchPerpetuityStreakDays ?? 0) >= MATRIARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

function matriarchPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const ascendancy = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  return (
    isMatriarchCoalitionAscendancy(state) || ascendancy >= MATRIARCH_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Matriarch perpetuity streak after matriarch ascendancy is sustained. */
export function advanceCoalitionMatriarchPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchPerpetuityEligible(state)) {
    if ((state.coalitionMatriarchPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchPerpetuityStreakDays:
      (state.coalitionMatriarchPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchPerpetuityStreakDays: 0 };
}

export function applyMatriarchPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-perpetuity-gates.ts ---

export function coalitionMatriarchPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Matriarch perpetuity streak ${streak} below required ${action.minCoalitionMatriarchPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_perpetuity_streak',
        minDays: action.minCoalitionMatriarchPerpetuityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-eternity.ts ---

export const MATRIARCH_COALITION_ETERNITY_THRESHOLD = 4;
const MATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchEternityStreakDays ?? 0) >= MATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

function matriarchEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const perpetuity = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  return (
    isMatriarchCoalitionPerpetuity(state) || perpetuity >= MATRIARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Matriarch eternity streak after matriarch perpetuity is sustained. */
export function advanceCoalitionMatriarchEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchEternityEligible(state)) {
    if ((state.coalitionMatriarchEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchEternityStreakDays:
      (state.coalitionMatriarchEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchEternityStreakDays: 0 };
}

export function applyMatriarchEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-eternity-gates.ts ---

export function coalitionMatriarchEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchEternityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_ETERNITY_STREAK_TOO_SHORT',
      message: `Matriarch eternity streak ${streak} below required ${action.minCoalitionMatriarchEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_eternity_streak',
        minDays: action.minCoalitionMatriarchEternityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-infinity.ts ---

export const MATRIARCH_COALITION_INFINITY_THRESHOLD = 4;
const MATRIARCH_INFINITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionInfinity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchInfinityStreakDays ?? 0) >= MATRIARCH_COALITION_INFINITY_THRESHOLD
  );
}

function matriarchInfinityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const eternity = state.coalitionMatriarchEternityStreakDays ?? 0;
  return (
    isMatriarchCoalitionEternity(state) || eternity >= MATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

/** Matriarch infinity streak after matriarch eternity is sustained. */
export function advanceCoalitionMatriarchInfinityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchInfinityEligible(state)) {
    if ((state.coalitionMatriarchInfinityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchInfinityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchInfinityStreakDays:
      (state.coalitionMatriarchInfinityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchInfinityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchInfinityStreakDays: 0 };
}

export function applyMatriarchInfinityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionInfinity(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_INFINITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-infinity-gates.ts ---

export function coalitionMatriarchInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchInfinityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_INFINITY_STREAK_TOO_SHORT',
      message: `Matriarch infinity streak ${streak} below required ${action.minCoalitionMatriarchInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_infinity_streak',
        minDays: action.minCoalitionMatriarchInfinityStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-transcendence.ts ---

export const MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD = 4;
const MATRIARCH_TRANSCENDENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionTranscendence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchTranscendenceStreakDays ?? 0) >= MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

function matriarchTranscendenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const infinity = state.coalitionMatriarchInfinityStreakDays ?? 0;
  return (
    isMatriarchCoalitionInfinity(state) || infinity >= MATRIARCH_COALITION_INFINITY_THRESHOLD
  );
}

/** Matriarch transcendence streak after matriarch infinity is sustained. */
export function advanceCoalitionMatriarchTranscendenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchTranscendenceEligible(state)) {
    if ((state.coalitionMatriarchTranscendenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchTranscendenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchTranscendenceStreakDays:
      (state.coalitionMatriarchTranscendenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchTranscendenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchTranscendenceStreakDays: 0 };
}

export function applyMatriarchTranscendenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionTranscendence(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_TRANSCENDENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-transcendence-gates.ts ---

export function coalitionMatriarchTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Matriarch infinity streak ${streak} below required ${action.minCoalitionMatriarchTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_transcendence_streak',
        minDays: action.minCoalitionMatriarchTranscendenceStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-apotheosis.ts ---

export const MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD = 4;
const MATRIARCH_APOTHEOSIS_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionApotheosis(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchApotheosisStreakDays ?? 0) >= MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD
  );
}

function matriarchApotheosisEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendence = state.coalitionMatriarchTranscendenceStreakDays ?? 0;
  return (
    isMatriarchCoalitionTranscendence(state) ||
    transcendence >= MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

/** Matriarch apotheosis streak after matriarch transcendence is sustained. */
export function advanceCoalitionMatriarchApotheosisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchApotheosisEligible(state)) {
    if ((state.coalitionMatriarchApotheosisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchApotheosisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchApotheosisStreakDays:
      (state.coalitionMatriarchApotheosisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchApotheosisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchApotheosisStreakDays: 0 };
}

export function applyMatriarchApotheosisMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionApotheosis(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_APOTHEOSIS_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-apotheosis-gates.ts ---

export function coalitionMatriarchApotheosisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchApotheosisStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchApotheosisStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchApotheosisStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_APOTHEOSIS_STREAK_TOO_SHORT',
      message: `Matriarch transcendence streak ${streak} below required ${action.minCoalitionMatriarchApotheosisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_apotheosis_streak',
        minDays: action.minCoalitionMatriarchApotheosisStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-deification.ts ---

export const MATRIARCH_COALITION_DEIFICATION_THRESHOLD = 4;
const MATRIARCH_DEIFICATION_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionDeification(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchDeificationStreakDays ?? 0) >= MATRIARCH_COALITION_DEIFICATION_THRESHOLD
  );
}

function matriarchDeificationEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendence = state.coalitionMatriarchApotheosisStreakDays ?? 0;
  return (
    isMatriarchCoalitionApotheosis(state) ||
    transcendence >= MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD
  );
}

/** Matriarch deification streak after matriarch apotheosis is sustained. */
export function advanceCoalitionMatriarchDeificationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchDeificationEligible(state)) {
    if ((state.coalitionMatriarchDeificationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchDeificationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchDeificationStreakDays:
      (state.coalitionMatriarchDeificationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchDeificationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchDeificationStreakDays: 0 };
}

export function applyMatriarchDeificationMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionDeification(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_DEIFICATION_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-deification-gates.ts ---

export function coalitionMatriarchDeificationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchDeificationStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchDeificationStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchDeificationStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_DEIFICATION_STREAK_TOO_SHORT',
      message: `Matriarch apotheosis streak ${streak} below required ${action.minCoalitionMatriarchDeificationStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_deification_streak',
        minDays: action.minCoalitionMatriarchDeificationStreakDays,
      },
    },
  ];
}

// --- src/engine/coalition-matriarch-omnipotence.ts ---

export const MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD = 4;
const MATRIARCH_OMNIPOTENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionOmnipotence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchOmnipotenceStreakDays ?? 0) >= MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD
  );
}

function matriarchOmnipotenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const deification = state.coalitionMatriarchDeificationStreakDays ?? 0;
  return (
    isMatriarchCoalitionDeification(state) ||
    deification >= MATRIARCH_COALITION_DEIFICATION_THRESHOLD
  );
}

/** Matriarch omnipotence streak after matriarch deification is sustained. */
export function advanceCoalitionMatriarchOmnipotenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchOmnipotenceEligible(state)) {
    if ((state.coalitionMatriarchOmnipotenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchOmnipotenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchOmnipotenceStreakDays:
      (state.coalitionMatriarchOmnipotenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchOmnipotenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchOmnipotenceStreakDays: 0 };
}

export function applyMatriarchOmnipotenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionOmnipotence(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_OMNIPOTENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}

// --- src/engine/coalition-matriarch-omnipotence-gates.ts ---

export function coalitionMatriarchOmnipotenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchOmnipotenceStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchOmnipotenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchOmnipotenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_OMNIPOTENCE_STREAK_TOO_SHORT',
      message: `Matriarch deification streak ${streak} below required ${action.minCoalitionMatriarchOmnipotenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_omnipotence_streak',
        minDays: action.minCoalitionMatriarchOmnipotenceStreakDays,
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

export interface StrategicGameplaySaveV14 extends Omit<StrategicGameplaySaveV13, 'version'> {
  version: 14;
  coalitionCivilizationalEnduranceStreakDays: number;
}

export interface StrategicGameplaySaveV15 extends Omit<StrategicGameplaySaveV14, 'version'> {
  version: 15;
  coalitionTranscendentLegacyStreakDays: number;
}

export interface StrategicGameplaySaveV16 extends Omit<StrategicGameplaySaveV15, 'version'> {
  version: 16;
  coalitionSovereignContinuumStreakDays: number;
}

export interface StrategicGameplaySaveV17 extends Omit<StrategicGameplaySaveV16, 'version'> {
  version: 17;
  coalitionEternalAscendanceStreakDays: number;
}

export interface StrategicGameplaySaveV18 extends Omit<StrategicGameplaySaveV17, 'version'> {
  version: 18;
  coalitionInfinitePersistenceStreakDays: number;
}

export interface StrategicGameplaySaveV19 extends Omit<StrategicGameplaySaveV18, 'version'> {
  version: 19;
  coalitionPrimordialContinuityStreakDays: number;
}

export interface StrategicGameplaySaveV20 extends Omit<StrategicGameplaySaveV19, 'version'> {
  version: 20;
  coalitionAbsoluteSanctityStreakDays: number;
}

export interface StrategicGameplaySaveV21 extends Omit<StrategicGameplaySaveV20, 'version'> {
  version: 21;
  coalitionUniversalImmortalityStreakDays: number;
}

export interface StrategicGameplaySaveV22 extends Omit<StrategicGameplaySaveV21, 'version'> {
  version: 22;
  coalitionCosmicPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV23 extends Omit<StrategicGameplaySaveV22, 'version'> {
  version: 23;
  coalitionGalacticInfinityStreakDays: number;
}

export interface StrategicGameplaySaveV24 extends Omit<StrategicGameplaySaveV23, 'version'> {
  version: 24;
  coalitionStellarTranscendenceStreakDays: number;
}

export interface StrategicGameplaySaveV25 extends Omit<StrategicGameplaySaveV24, 'version'> {
  version: 25;
  coalitionQuantumOmnipresenceStreakDays: number;
}

export interface StrategicGameplaySaveV26 extends Omit<StrategicGameplaySaveV25, 'version'> {
  version: 26;
  coalitionMultiversalPersistenceStreakDays: number;
}

export interface StrategicGameplaySaveV27 extends Omit<StrategicGameplaySaveV26, 'version'> {
  version: 27;
  coalitionMetaversalContinuityStreakDays: number;
}

export interface StrategicGameplaySaveV28 extends Omit<StrategicGameplaySaveV27, 'version'> {
  version: 28;
  coalitionOmniversalSynthesisStreakDays: number;
}

export interface StrategicGameplaySaveV29 extends Omit<StrategicGameplaySaveV28, 'version'> {
  version: 29;
  coalitionHyperversalHarmonizationStreakDays: number;
}

export interface StrategicGameplaySaveV30 extends Omit<StrategicGameplaySaveV29, 'version'> {
  version: 30;
  coalitionTranscendentOmniumStreakDays: number;
}

export interface StrategicGameplaySaveV31 extends Omit<StrategicGameplaySaveV30, 'version'> {
  version: 31;
  coalitionSupremeConvergenceStreakDays: number;
}

export interface StrategicGameplaySaveV32 extends Omit<StrategicGameplaySaveV31, 'version'> {
  version: 32;
  coalitionApexTranscendenceStreakDays: number;
}

export interface StrategicGameplaySaveV33 extends Omit<StrategicGameplaySaveV32, 'version'> {
  version: 33;
  coalitionZenithPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV34 extends Omit<StrategicGameplaySaveV33, 'version'> {
  version: 34;
  coalitionParagonInfinityStreakDays: number;
}

export interface StrategicGameplaySaveV35 extends Omit<StrategicGameplaySaveV34, 'version'> {
  version: 35;
  coalitionParamountAscendancyStreakDays: number;
}

export interface StrategicGameplaySaveV36 extends Omit<StrategicGameplaySaveV35, 'version'> {
  version: 36;
  coalitionImperialPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV37 extends Omit<StrategicGameplaySaveV36, 'version'> {
  version: 37;
  coalitionCustodialEternityStreakDays: number;
}

export interface StrategicGameplaySaveV38 extends Omit<StrategicGameplaySaveV37, 'version'> {
  version: 38;
  coalitionVanguardSynthesisStreakDays: number;
}

export interface StrategicGameplaySaveV39 extends Omit<StrategicGameplaySaveV38, 'version'> {
  version: 39;
  coalitionSentinelAscendancyStreakDays: number;
}

export interface StrategicGameplaySaveV40 extends Omit<StrategicGameplaySaveV39, 'version'> {
  version: 40;
  coalitionOraclePerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV41 extends Omit<StrategicGameplaySaveV40, 'version'> {
  version: 41;
  coalitionArchonEternityStreakDays: number;
}

export interface StrategicGameplaySaveV42 extends Omit<StrategicGameplaySaveV41, 'version'> {
  version: 42;
  coalitionExarchAscendancyStreakDays: number;
}

export interface StrategicGameplaySaveV43 extends Omit<StrategicGameplaySaveV42, 'version'> {
  version: 43;
  coalitionPrimarchPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV44 extends Omit<StrategicGameplaySaveV43, 'version'> {
  version: 44;
  coalitionPatriarchEternityStreakDays: number;
}

export interface StrategicGameplaySaveV45 extends Omit<StrategicGameplaySaveV44, 'version'> {
  version: 45;
  coalitionMatriarchAscendancyStreakDays: number;
}

export interface StrategicGameplaySaveV46 extends Omit<StrategicGameplaySaveV45, 'version'> {
  version: 46;
  coalitionMatriarchPerpetuityStreakDays: number;
}

export interface StrategicGameplaySaveV47 extends Omit<StrategicGameplaySaveV46, 'version'> {
  version: 47;
  coalitionMatriarchEternityStreakDays: number;
}

export interface StrategicGameplaySaveV48 extends Omit<StrategicGameplaySaveV47, 'version'> {
  version: 48;
  coalitionMatriarchInfinityStreakDays: number;
}

export interface StrategicGameplaySaveV49 extends Omit<StrategicGameplaySaveV48, 'version'> {
  version: 49;
  coalitionMatriarchTranscendenceStreakDays: number;
}

export interface StrategicGameplaySaveV50 extends Omit<StrategicGameplaySaveV49, 'version'> {
  version: 50;
  coalitionMatriarchApotheosisStreakDays: number;
}

export interface StrategicGameplaySaveV51 extends Omit<StrategicGameplaySaveV50, 'version'> {
  version: 51;
  coalitionMatriarchDeificationStreakDays: number;
}

export interface StrategicGameplaySaveV52 extends Omit<StrategicGameplaySaveV51, 'version'> {
  version: 52;
  coalitionMatriarchOmnipotenceStreakDays: number;
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
  | StrategicGameplaySaveV13
  | StrategicGameplaySaveV14
  | StrategicGameplaySaveV15
  | StrategicGameplaySaveV16
  | StrategicGameplaySaveV17
  | StrategicGameplaySaveV18
  | StrategicGameplaySaveV19
  | StrategicGameplaySaveV20
  | StrategicGameplaySaveV21
  | StrategicGameplaySaveV22
  | StrategicGameplaySaveV23
  | StrategicGameplaySaveV24
  | StrategicGameplaySaveV25
  | StrategicGameplaySaveV26
  | StrategicGameplaySaveV27
  | StrategicGameplaySaveV28
  | StrategicGameplaySaveV29
  | StrategicGameplaySaveV30
  | StrategicGameplaySaveV31
  | StrategicGameplaySaveV32
  | StrategicGameplaySaveV33
  | StrategicGameplaySaveV34
  | StrategicGameplaySaveV35
  | StrategicGameplaySaveV36
  | StrategicGameplaySaveV37
  | StrategicGameplaySaveV38
  | StrategicGameplaySaveV39
  | StrategicGameplaySaveV40
  | StrategicGameplaySaveV41
  | StrategicGameplaySaveV42
  | StrategicGameplaySaveV43
  | StrategicGameplaySaveV44
  | StrategicGameplaySaveV45
  | StrategicGameplaySaveV46
  | StrategicGameplaySaveV47
  | StrategicGameplaySaveV48
  | StrategicGameplaySaveV49
  | StrategicGameplaySaveV50
  | StrategicGameplaySaveV51
  | StrategicGameplaySaveV52;

export function serializeStrategicGameplayState(
  state: StrategicGameplayState,
): StrategicGameplaySaveV52 {
  return {
    version: 52,
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
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
    coalitionMultiversalPersistenceStreakDays: state.coalitionMultiversalPersistenceStreakDays ?? 0,
    coalitionMetaversalContinuityStreakDays: state.coalitionMetaversalContinuityStreakDays ?? 0,
    coalitionOmniversalSynthesisStreakDays: state.coalitionOmniversalSynthesisStreakDays ?? 0,
    coalitionHyperversalHarmonizationStreakDays: state.coalitionHyperversalHarmonizationStreakDays ?? 0,
    coalitionTranscendentOmniumStreakDays: state.coalitionTranscendentOmniumStreakDays ?? 0,
    coalitionSupremeConvergenceStreakDays: state.coalitionSupremeConvergenceStreakDays ?? 0,
    coalitionApexTranscendenceStreakDays: state.coalitionApexTranscendenceStreakDays ?? 0,
    coalitionZenithPerpetuityStreakDays: state.coalitionZenithPerpetuityStreakDays ?? 0,
    coalitionParagonInfinityStreakDays: state.coalitionParagonInfinityStreakDays ?? 0,
    coalitionParamountAscendancyStreakDays: state.coalitionParamountAscendancyStreakDays ?? 0,
    coalitionImperialPerpetuityStreakDays: state.coalitionImperialPerpetuityStreakDays ?? 0,
    coalitionCustodialEternityStreakDays: state.coalitionCustodialEternityStreakDays ?? 0,
    coalitionVanguardSynthesisStreakDays: state.coalitionVanguardSynthesisStreakDays ?? 0,
    coalitionSentinelAscendancyStreakDays: state.coalitionSentinelAscendancyStreakDays ?? 0,
    coalitionOraclePerpetuityStreakDays: state.coalitionOraclePerpetuityStreakDays ?? 0,
    coalitionArchonEternityStreakDays: state.coalitionArchonEternityStreakDays ?? 0,
    coalitionExarchAscendancyStreakDays: state.coalitionExarchAscendancyStreakDays ?? 0,
    coalitionPrimarchPerpetuityStreakDays: state.coalitionPrimarchPerpetuityStreakDays ?? 0,
    coalitionPatriarchEternityStreakDays: state.coalitionPatriarchEternityStreakDays ?? 0,
    coalitionMatriarchAscendancyStreakDays: state.coalitionMatriarchAscendancyStreakDays ?? 0,
    coalitionMatriarchPerpetuityStreakDays: state.coalitionMatriarchPerpetuityStreakDays ?? 0,
    coalitionMatriarchEternityStreakDays: state.coalitionMatriarchEternityStreakDays ?? 0,
    coalitionMatriarchInfinityStreakDays: state.coalitionMatriarchInfinityStreakDays ?? 0,
    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,
    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,
    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,
    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
    };
  }
  if (save.version === 13) {
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
      coalitionCivilizationalEnduranceStreakDays: 0,
      coalitionTranscendentLegacyStreakDays: 0,
      coalitionSovereignContinuumStreakDays: 0,
      coalitionEternalAscendanceStreakDays: 0,
      coalitionInfinitePersistenceStreakDays: 0,
      coalitionPrimordialContinuityStreakDays: 0,
      coalitionAbsoluteSanctityStreakDays: 0,
      coalitionUniversalImmortalityStreakDays: 0,
      coalitionCosmicPerpetuityStreakDays: 0,
      coalitionGalacticInfinityStreakDays: 0,
      coalitionStellarTranscendenceStreakDays: 0,
      coalitionQuantumOmnipresenceStreakDays: 0,
      coalitionMultiversalPersistenceStreakDays: 0,
      coalitionMetaversalContinuityStreakDays: 0,
      coalitionOmniversalSynthesisStreakDays: 0,
      coalitionHyperversalHarmonizationStreakDays: 0,
      coalitionTranscendentOmniumStreakDays: 0,
      coalitionSupremeConvergenceStreakDays: 0,
      coalitionApexTranscendenceStreakDays: 0,
      coalitionZenithPerpetuityStreakDays: 0,
      coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
    };
  }
  if (save.version === 14) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: 0,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 15) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 16) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 17) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 18) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 19) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 20) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 21) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 22) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 23) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 24) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 25) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 26) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 27) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 28) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 29) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 30) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 31) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 32) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 33) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 34) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 35) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 36) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 37) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 38) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 39) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 40) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 41) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 42) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 43) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 44) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 45) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 46) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version === 47) {
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
      coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
      coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
      coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
      coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
      coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
      coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
      coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
      coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
      coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
      coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
      coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
      coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
      coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
      coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
      coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
      coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
      coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
      coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
      coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
      coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
      coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
      coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
      coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
      coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
      coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
      coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
      coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
      coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
      coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
      coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
      coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
      coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
      coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
      coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
      coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
    };
  }
  if (save.version === 48) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
    coalitionMatriarchInfinityStreakDays: save.coalitionMatriarchInfinityStreakDays,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
  };
  }
  if (save.version !== 49 && save.version !== 50 && save.version !== 51 && save.version !== 52) {
    throw new Error(`Unsupported strategic save version: ${(save as { version: number }).version}`);
  }
  if (save.version === 52) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
    coalitionMatriarchInfinityStreakDays: save.coalitionMatriarchInfinityStreakDays,
    coalitionMatriarchTranscendenceStreakDays: save.coalitionMatriarchTranscendenceStreakDays,
    coalitionMatriarchApotheosisStreakDays: save.coalitionMatriarchApotheosisStreakDays,
    coalitionMatriarchDeificationStreakDays: (save as StrategicGameplaySaveV52).coalitionMatriarchDeificationStreakDays,
    coalitionMatriarchOmnipotenceStreakDays: (save as StrategicGameplaySaveV52).coalitionMatriarchOmnipotenceStreakDays,
  };
  }
  if (save.version === 51) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
    coalitionMatriarchInfinityStreakDays: save.coalitionMatriarchInfinityStreakDays,
    coalitionMatriarchTranscendenceStreakDays: save.coalitionMatriarchTranscendenceStreakDays,
    coalitionMatriarchApotheosisStreakDays: save.coalitionMatriarchApotheosisStreakDays,
    coalitionMatriarchDeificationStreakDays: (save as StrategicGameplaySaveV51).coalitionMatriarchDeificationStreakDays,
  };
  }
  if (save.version === 50) {
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
    coalitionMatriarchInfinityStreakDays: save.coalitionMatriarchInfinityStreakDays,
    coalitionMatriarchTranscendenceStreakDays: save.coalitionMatriarchTranscendenceStreakDays,
    coalitionMatriarchApotheosisStreakDays: save.coalitionMatriarchApotheosisStreakDays,
  };
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
    coalitionCivilizationalEnduranceStreakDays: save.coalitionCivilizationalEnduranceStreakDays,
    coalitionTranscendentLegacyStreakDays: save.coalitionTranscendentLegacyStreakDays,
    coalitionSovereignContinuumStreakDays: save.coalitionSovereignContinuumStreakDays,
    coalitionEternalAscendanceStreakDays: save.coalitionEternalAscendanceStreakDays,
    coalitionInfinitePersistenceStreakDays: save.coalitionInfinitePersistenceStreakDays,
    coalitionPrimordialContinuityStreakDays: save.coalitionPrimordialContinuityStreakDays,
    coalitionAbsoluteSanctityStreakDays: save.coalitionAbsoluteSanctityStreakDays,
    coalitionUniversalImmortalityStreakDays: save.coalitionUniversalImmortalityStreakDays,
    coalitionCosmicPerpetuityStreakDays: save.coalitionCosmicPerpetuityStreakDays,
    coalitionGalacticInfinityStreakDays: save.coalitionGalacticInfinityStreakDays,
    coalitionStellarTranscendenceStreakDays: save.coalitionStellarTranscendenceStreakDays,
    coalitionQuantumOmnipresenceStreakDays: save.coalitionQuantumOmnipresenceStreakDays,
    coalitionMultiversalPersistenceStreakDays: save.coalitionMultiversalPersistenceStreakDays,
    coalitionMetaversalContinuityStreakDays: save.coalitionMetaversalContinuityStreakDays,
    coalitionOmniversalSynthesisStreakDays: save.coalitionOmniversalSynthesisStreakDays,
    coalitionHyperversalHarmonizationStreakDays: save.coalitionHyperversalHarmonizationStreakDays,
    coalitionTranscendentOmniumStreakDays: save.coalitionTranscendentOmniumStreakDays,
    coalitionSupremeConvergenceStreakDays: save.coalitionSupremeConvergenceStreakDays,
    coalitionApexTranscendenceStreakDays: save.coalitionApexTranscendenceStreakDays,
    coalitionZenithPerpetuityStreakDays: save.coalitionZenithPerpetuityStreakDays,
    coalitionParagonInfinityStreakDays: save.coalitionParagonInfinityStreakDays,
    coalitionParamountAscendancyStreakDays: save.coalitionParamountAscendancyStreakDays,
    coalitionImperialPerpetuityStreakDays: save.coalitionImperialPerpetuityStreakDays,
    coalitionCustodialEternityStreakDays: save.coalitionCustodialEternityStreakDays,
    coalitionVanguardSynthesisStreakDays: save.coalitionVanguardSynthesisStreakDays,
    coalitionSentinelAscendancyStreakDays: save.coalitionSentinelAscendancyStreakDays,
    coalitionOraclePerpetuityStreakDays: save.coalitionOraclePerpetuityStreakDays,
    coalitionArchonEternityStreakDays: save.coalitionArchonEternityStreakDays,
    coalitionExarchAscendancyStreakDays: save.coalitionExarchAscendancyStreakDays,
    coalitionPrimarchPerpetuityStreakDays: save.coalitionPrimarchPerpetuityStreakDays,
    coalitionPatriarchEternityStreakDays: save.coalitionPatriarchEternityStreakDays,
    coalitionMatriarchAscendancyStreakDays: save.coalitionMatriarchAscendancyStreakDays,
    coalitionMatriarchPerpetuityStreakDays: save.coalitionMatriarchPerpetuityStreakDays,
    coalitionMatriarchEternityStreakDays: save.coalitionMatriarchEternityStreakDays,
    coalitionMatriarchInfinityStreakDays: save.coalitionMatriarchInfinityStreakDays,
    coalitionMatriarchTranscendenceStreakDays: save.coalitionMatriarchTranscendenceStreakDays,
    coalitionMatriarchApotheosisStreakDays: 0,
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
    issues.push(...coalitionCivilizationalEnduranceStreakIssues(action, state));
    issues.push(...coalitionTranscendentLegacyStreakIssues(action, state));
    issues.push(...coalitionSovereignContinuumStreakIssues(action, state));
    issues.push(...coalitionEternalAscendanceStreakIssues(action, state));
    issues.push(...coalitionInfinitePersistenceStreakIssues(action, state));
    issues.push(...coalitionPrimordialContinuityStreakIssues(action, state));
    issues.push(...coalitionAbsoluteSanctityStreakIssues(action, state));
    issues.push(...coalitionUniversalImmortalityStreakIssues(action, state));
    issues.push(...coalitionCosmicPerpetuityStreakIssues(action, state));
    issues.push(...coalitionGalacticInfinityStreakIssues(action, state));
    issues.push(...coalitionStellarTranscendenceStreakIssues(action, state));
    issues.push(...coalitionQuantumOmnipresenceStreakIssues(action, state));
    issues.push(...coalitionMultiversalPersistenceStreakIssues(action, state));
    issues.push(...coalitionMetaversalContinuityStreakIssues(action, state));
    issues.push(...coalitionOmniversalSynthesisStreakIssues(action, state));
    issues.push(...coalitionHyperversalHarmonizationStreakIssues(action, state));
    issues.push(...coalitionTranscendentOmniumStreakIssues(action, state));
    issues.push(...coalitionSupremeConvergenceStreakIssues(action, state));
    issues.push(...coalitionApexTranscendenceStreakIssues(action, state));
    issues.push(...coalitionZenithPerpetuityStreakIssues(action, state));
    issues.push(...coalitionParagonInfinityStreakIssues(action, state));
    issues.push(...coalitionParamountAscendancyStreakIssues(action, state));
    issues.push(...coalitionImperialPerpetuityStreakIssues(action, state));
    issues.push(...coalitionCustodialEternityStreakIssues(action, state));
    issues.push(...coalitionVanguardSynthesisStreakIssues(action, state));
    issues.push(...coalitionSentinelAscendancyStreakIssues(action, state));
    issues.push(...coalitionOraclePerpetuityStreakIssues(action, state));
    issues.push(...coalitionArchonEternityStreakIssues(action, state));
    issues.push(...coalitionExarchAscendancyStreakIssues(action, state));
    issues.push(...coalitionPrimarchPerpetuityStreakIssues(action, state));
    issues.push(...coalitionPatriarchEternityStreakIssues(action, state));
    issues.push(...coalitionMatriarchAscendancyStreakIssues(action, state));
    issues.push(...coalitionMatriarchPerpetuityStreakIssues(action, state));
    issues.push(...coalitionMatriarchEternityStreakIssues(action, state));
    issues.push(...coalitionMatriarchInfinityStreakIssues(action, state));
    issues.push(...coalitionMatriarchTranscendenceStreakIssues(action, state));
    issues.push(...coalitionMatriarchApotheosisStreakIssues(action, state));
    issues.push(...coalitionMatriarchDeificationStreakIssues(action, state));
    issues.push(...coalitionMatriarchOmnipotenceStreakIssues(action, state));
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
        generationalContinuityRankingBonus(state, action) +
        civilizationalEnduranceRankingBonus(state, action) +
        transcendentLegacyRankingBonus(state, action) +
        sovereignContinuumRankingBonus(state, action) +
        eternalAscendanceRankingBonus(state, action) +
        infinitePersistenceRankingBonus(state, action) +
        primordialContinuityRankingBonus(state, action) +
        absoluteSanctityRankingBonus(state, action) +
        universalImmortalityRankingBonus(state, action) +
        cosmicPerpetuityRankingBonus(state, action) +
        galacticInfinityRankingBonus(state, action) +
        stellarTranscendenceRankingBonus(state, action) +
        quantumOmnipresenceRankingBonus(state, action) +
        multiversalPersistenceRankingBonus(state, action) +
        metaversalContinuityRankingBonus(state, action) +
        omniversalSynthesisRankingBonus(state, action) +
        hyperversalHarmonizationRankingBonus(state, action) +
        transcendentOmniumRankingBonus(state, action) +
        supremeConvergenceRankingBonus(state, action) +
        apexTranscendenceRankingBonus(state, action) +
        zenithPerpetuityRankingBonus(state, action) +
        paragonInfinityRankingBonus(state, action) +
        paramountAscendancyRankingBonus(state, action) +
        imperialPerpetuityRankingBonus(state, action) +
        custodialEternityRankingBonus(state, action) +
        vanguardSynthesisRankingBonus(state, action) +
        sentinelAscendancyRankingBonus(state, action) +
        oraclePerpetuityRankingBonus(state, action) +
        archonEternityRankingBonus(state, action) +
        exarchAscendancyRankingBonus(state, action) +
        primarchPerpetuityRankingBonus(state, action) +
        patriarchEternityRankingBonus(state, action) +
        matriarchAscendancyRankingBonus(state, action) +
        matriarchPerpetuityRankingBonus(state, action) +
        matriarchEternityRankingBonus(state, action) +
        matriarchInfinityRankingBonus(state, action) +
        matriarchTranscendenceRankingBonus(state, action) +
        matriarchApotheosisRankingBonus(state, action) +
        matriarchDeificationRankingBonus(state, action) +
        matriarchOmnipotenceRankingBonus(state, action),
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
    civilizationalCoalitionEndurance: isCivilizationalCoalitionEndurance(state),
    coalitionCivilizationalEnduranceStreakDays: state.coalitionCivilizationalEnduranceStreakDays ?? 0,
    transcendentCoalitionLegacy: isTranscendentCoalitionLegacy(state),
    coalitionTranscendentLegacyStreakDays: state.coalitionTranscendentLegacyStreakDays ?? 0,
    sovereignCoalitionContinuum: isSovereignCoalitionContinuum(state),
    coalitionSovereignContinuumStreakDays: state.coalitionSovereignContinuumStreakDays ?? 0,
    eternalCoalitionAscendance: isEternalCoalitionAscendance(state),
    coalitionEternalAscendanceStreakDays: state.coalitionEternalAscendanceStreakDays ?? 0,
    infiniteCoalitionPersistence: isInfiniteCoalitionPersistence(state),
    coalitionInfinitePersistenceStreakDays: state.coalitionInfinitePersistenceStreakDays ?? 0,
    primordialCoalitionContinuity: isPrimordialCoalitionContinuity(state),
    coalitionPrimordialContinuityStreakDays: state.coalitionPrimordialContinuityStreakDays ?? 0,
    absoluteCoalitionSanctity: isAbsoluteCoalitionSanctity(state),
    coalitionAbsoluteSanctityStreakDays: state.coalitionAbsoluteSanctityStreakDays ?? 0,
    universalCoalitionImmortality: isUniversalCoalitionImmortality(state),
    coalitionUniversalImmortalityStreakDays: state.coalitionUniversalImmortalityStreakDays ?? 0,
    cosmicCoalitionPerpetuity: isCosmicCoalitionPerpetuity(state),
    coalitionCosmicPerpetuityStreakDays: state.coalitionCosmicPerpetuityStreakDays ?? 0,
    galacticCoalitionInfinity: isGalacticCoalitionInfinity(state),
    coalitionGalacticInfinityStreakDays: state.coalitionGalacticInfinityStreakDays ?? 0,
    stellarCoalitionTranscendence: isStellarCoalitionTranscendence(state),
    coalitionStellarTranscendenceStreakDays: state.coalitionStellarTranscendenceStreakDays ?? 0,
    quantumCoalitionOmnipresence: isQuantumCoalitionOmnipresence(state),
    coalitionQuantumOmnipresenceStreakDays: state.coalitionQuantumOmnipresenceStreakDays ?? 0,
    multiversalCoalitionPersistence: isMultiversalCoalitionPersistence(state),
    coalitionMultiversalPersistenceStreakDays: state.coalitionMultiversalPersistenceStreakDays ?? 0,
    metaversalCoalitionContinuity: isMetaversalCoalitionContinuity(state),
    coalitionMetaversalContinuityStreakDays: state.coalitionMetaversalContinuityStreakDays ?? 0,
    omniversalCoalitionSynthesis: isOmniversalCoalitionSynthesis(state),
    coalitionOmniversalSynthesisStreakDays: state.coalitionOmniversalSynthesisStreakDays ?? 0,
    hyperversalCoalitionHarmonization: isHyperversalCoalitionHarmonization(state),
    coalitionHyperversalHarmonizationStreakDays:
      state.coalitionHyperversalHarmonizationStreakDays ?? 0,
    transcendentCoalitionOmnium: isTranscendentCoalitionOmnium(state),
    coalitionTranscendentOmniumStreakDays: state.coalitionTranscendentOmniumStreakDays ?? 0,
    supremeCoalitionConvergence: isSupremeCoalitionConvergence(state),
    coalitionSupremeConvergenceStreakDays: state.coalitionSupremeConvergenceStreakDays ?? 0,
    apexCoalitionTranscendence: isApexCoalitionTranscendence(state),
    coalitionApexTranscendenceStreakDays: state.coalitionApexTranscendenceStreakDays ?? 0,
    zenithCoalitionPerpetuity: isZenithCoalitionPerpetuity(state),
    coalitionZenithPerpetuityStreakDays: state.coalitionZenithPerpetuityStreakDays ?? 0,
    paragonCoalitionInfinity: isParagonCoalitionInfinity(state),
    coalitionParagonInfinityStreakDays: state.coalitionParagonInfinityStreakDays ?? 0,
    paramountCoalitionAscendancy: isParamountCoalitionAscendancy(state),
    coalitionParamountAscendancyStreakDays: state.coalitionParamountAscendancyStreakDays ?? 0,
    imperialCoalitionPerpetuity: isImperialCoalitionPerpetuity(state),
    coalitionImperialPerpetuityStreakDays: state.coalitionImperialPerpetuityStreakDays ?? 0,
    custodialCoalitionEternity: isCustodialCoalitionEternity(state),
    coalitionCustodialEternityStreakDays: state.coalitionCustodialEternityStreakDays ?? 0,
    vanguardCoalitionSynthesis: isVanguardCoalitionSynthesis(state),
    coalitionVanguardSynthesisStreakDays: state.coalitionVanguardSynthesisStreakDays ?? 0,
    sentinelCoalitionAscendancy: isSentinelCoalitionAscendancy(state),
    coalitionSentinelAscendancyStreakDays: state.coalitionSentinelAscendancyStreakDays ?? 0,
    oracleCoalitionPerpetuity: isOracleCoalitionPerpetuity(state),
    coalitionOraclePerpetuityStreakDays: state.coalitionOraclePerpetuityStreakDays ?? 0,
    archonCoalitionEternity: isArchonCoalitionEternity(state),
    coalitionArchonEternityStreakDays: state.coalitionArchonEternityStreakDays ?? 0,
    exarchCoalitionAscendancy: isExarchCoalitionAscendancy(state),
    coalitionExarchAscendancyStreakDays: state.coalitionExarchAscendancyStreakDays ?? 0,
    primarchCoalitionPerpetuity: isPrimarchCoalitionPerpetuity(state),
    coalitionPrimarchPerpetuityStreakDays: state.coalitionPrimarchPerpetuityStreakDays ?? 0,
    patriarchCoalitionEternity: isPatriarchCoalitionEternity(state),
    coalitionPatriarchEternityStreakDays: state.coalitionPatriarchEternityStreakDays ?? 0,
    matriarchCoalitionAscendancy: isMatriarchCoalitionAscendancy(state),
    coalitionMatriarchAscendancyStreakDays: state.coalitionMatriarchAscendancyStreakDays ?? 0,
    matriarchCoalitionPerpetuity: isMatriarchCoalitionPerpetuity(state),
    coalitionMatriarchPerpetuityStreakDays: state.coalitionMatriarchPerpetuityStreakDays ?? 0,
    matriarchCoalitionEternity: isMatriarchCoalitionEternity(state),
    coalitionMatriarchEternityStreakDays: state.coalitionMatriarchEternityStreakDays ?? 0,
    matriarchCoalitionInfinity: isMatriarchCoalitionInfinity(state),
    coalitionMatriarchInfinityStreakDays: state.coalitionMatriarchInfinityStreakDays ?? 0,
    matriarchCoalitionTranscendence: isMatriarchCoalitionTranscendence(state),
    coalitionMatriarchTranscendenceStreakDays: state.coalitionMatriarchTranscendenceStreakDays ?? 0,
    matriarchCoalitionApotheosis: isMatriarchCoalitionApotheosis(state),
    coalitionMatriarchApotheosisStreakDays: state.coalitionMatriarchApotheosisStreakDays ?? 0,
    matriarchCoalitionDeification: isMatriarchCoalitionDeification(state),
    coalitionMatriarchDeificationStreakDays: state.coalitionMatriarchDeificationStreakDays ?? 0,
    matriarchCoalitionOmnipotence: isMatriarchCoalitionOmnipotence(state),
    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,
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
  next = advanceCoalitionCivilizationalEnduranceStreak(next, daysAdvanced);
  next = applyCivilizationalEnduranceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionTranscendentLegacyStreak(next, daysAdvanced);
  next = applyTranscendentLegacyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionSovereignContinuumStreak(next, daysAdvanced);
  next = applySovereignContinuumMandateBonus(next, daysAdvanced);
  next = advanceCoalitionEternalAscendanceStreak(next, daysAdvanced);
  next = applyEternalAscendanceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionInfinitePersistenceStreak(next, daysAdvanced);
  next = applyInfinitePersistenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionPrimordialContinuityStreak(next, daysAdvanced);
  next = applyPrimordialContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionAbsoluteSanctityStreak(next, daysAdvanced);
  next = applyAbsoluteSanctityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionUniversalImmortalityStreak(next, daysAdvanced);
  next = applyUniversalImmortalityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionCosmicPerpetuityStreak(next, daysAdvanced);
  next = applyCosmicPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionGalacticInfinityStreak(next, daysAdvanced);
  next = applyGalacticInfinityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionStellarTranscendenceStreak(next, daysAdvanced);
  next = applyStellarTranscendenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionQuantumOmnipresenceStreak(next, daysAdvanced);
  next = applyQuantumOmnipresenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMultiversalPersistenceStreak(next, daysAdvanced);
  next = applyMultiversalPersistenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMetaversalContinuityStreak(next, daysAdvanced);
  next = applyMetaversalContinuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionOmniversalSynthesisStreak(next, daysAdvanced);
  next = applyOmniversalSynthesisMandateBonus(next, daysAdvanced);
  next = advanceCoalitionHyperversalHarmonizationStreak(next, daysAdvanced);
  next = applyHyperversalHarmonizationMandateBonus(next, daysAdvanced);
  next = advanceCoalitionTranscendentOmniumStreak(next, daysAdvanced);
  next = applyTranscendentOmniumMandateBonus(next, daysAdvanced);
  next = advanceCoalitionSupremeConvergenceStreak(next, daysAdvanced);
  next = applySupremeConvergenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionApexTranscendenceStreak(next, daysAdvanced);
  next = applyApexTranscendenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionZenithPerpetuityStreak(next, daysAdvanced);
  next = applyZenithPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionParagonInfinityStreak(next, daysAdvanced);
  next = applyParagonInfinityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionParamountAscendancyStreak(next, daysAdvanced);
  next = applyParamountAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionImperialPerpetuityStreak(next, daysAdvanced);
  next = applyImperialPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionCustodialEternityStreak(next, daysAdvanced);
  next = applyCustodialEternityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionVanguardSynthesisStreak(next, daysAdvanced);
  next = applyVanguardSynthesisMandateBonus(next, daysAdvanced);
  next = advanceCoalitionSentinelAscendancyStreak(next, daysAdvanced);
  next = applySentinelAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionOraclePerpetuityStreak(next, daysAdvanced);
  next = applyOraclePerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionArchonEternityStreak(next, daysAdvanced);
  next = applyArchonEternityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionExarchAscendancyStreak(next, daysAdvanced);
  next = applyExarchAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionPrimarchPerpetuityStreak(next, daysAdvanced);
  next = applyPrimarchPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionPatriarchEternityStreak(next, daysAdvanced);
  next = applyPatriarchEternityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchAscendancyStreak(next, daysAdvanced);
  next = applyMatriarchAscendancyMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchPerpetuityStreak(next, daysAdvanced);
  next = applyMatriarchPerpetuityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchEternityStreak(next, daysAdvanced);
  next = applyMatriarchEternityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchInfinityStreak(next, daysAdvanced);
  next = applyMatriarchInfinityMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchTranscendenceStreak(next, daysAdvanced);
  next = applyMatriarchTranscendenceMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchApotheosisStreak(next, daysAdvanced);
  next = applyMatriarchApotheosisMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchDeificationStreak(next, daysAdvanced);
  next = applyMatriarchDeificationMandateBonus(next, daysAdvanced);
  next = advanceCoalitionMatriarchOmnipotenceStreak(next, daysAdvanced);
  next = applyMatriarchOmnipotenceMandateBonus(next, daysAdvanced);
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
    coalitionCivilizationalEnduranceStreakDays: 0,
    coalitionTranscendentLegacyStreakDays: 0,
    coalitionSovereignContinuumStreakDays: 0,
    coalitionEternalAscendanceStreakDays: 0,
    coalitionInfinitePersistenceStreakDays: 0,
    coalitionPrimordialContinuityStreakDays: 0,
    coalitionAbsoluteSanctityStreakDays: 0,
    coalitionUniversalImmortalityStreakDays: 0,
    coalitionCosmicPerpetuityStreakDays: 0,
    coalitionGalacticInfinityStreakDays: 0,
    coalitionStellarTranscendenceStreakDays: 0,
    coalitionQuantumOmnipresenceStreakDays: 0,
    coalitionMultiversalPersistenceStreakDays: 0,
    coalitionMetaversalContinuityStreakDays: 0,
    coalitionOmniversalSynthesisStreakDays: 0,
    coalitionHyperversalHarmonizationStreakDays: 0,
    coalitionTranscendentOmniumStreakDays: 0,
    coalitionSupremeConvergenceStreakDays: 0,
    coalitionApexTranscendenceStreakDays: 0,
    coalitionZenithPerpetuityStreakDays: 0,
    coalitionParagonInfinityStreakDays: 0,
    coalitionParamountAscendancyStreakDays: 0,
    coalitionImperialPerpetuityStreakDays: 0,
    coalitionCustodialEternityStreakDays: 0,
    coalitionVanguardSynthesisStreakDays: 0,
    coalitionSentinelAscendancyStreakDays: 0,
    coalitionOraclePerpetuityStreakDays: 0,
    coalitionArchonEternityStreakDays: 0,
    coalitionExarchAscendancyStreakDays: 0,
    coalitionPrimarchPerpetuityStreakDays: 0,
    coalitionPatriarchEternityStreakDays: 0,
    coalitionMatriarchAscendancyStreakDays: 0,
    coalitionMatriarchPerpetuityStreakDays: 0,
    coalitionMatriarchEternityStreakDays: 0,
    coalitionMatriarchInfinityStreakDays: 0,
    coalitionMatriarchTranscendenceStreakDays: 0,
    coalitionMatriarchApotheosisStreakDays: 0,
    coalitionMatriarchDeificationStreakDays: 0,
    coalitionMatriarchOmnipotenceStreakDays: 0,
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
  if (action.id === 'sga_coalition_civilizational_endurance_charter') {
    nextState = resetCoalitionCivilizationalEnduranceStreak(nextState);
  }
  if (action.id === 'sga_coalition_civilizational_heritage_covenant') {
    nextState = resetCoalitionCivilizationalEnduranceStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_legacy_charter') {
    nextState = resetCoalitionTranscendentLegacyStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_enduring_covenant') {
    nextState = resetCoalitionTranscendentLegacyStreak(nextState);
  }
  if (action.id === 'sga_coalition_sovereign_continuum_charter') {
    nextState = resetCoalitionSovereignContinuumStreak(nextState);
  }
  if (action.id === 'sga_coalition_sovereign_continuity_endowment') {
    nextState = resetCoalitionSovereignContinuumStreak(nextState);
  }
  if (action.id === 'sga_coalition_eternal_ascendance_charter') {
    nextState = resetCoalitionEternalAscendanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_eternal_continuity_covenant') {
    nextState = resetCoalitionEternalAscendanceStreak(nextState);
  }
  if (action.id === 'sga_coalition_infinite_persistence_charter') {
    nextState = resetCoalitionInfinitePersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_infinite_continuity_accord') {
    nextState = resetCoalitionInfinitePersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_primordial_continuity_charter') {
    nextState = resetCoalitionPrimordialContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_primordial_continuity_endowment') {
    nextState = resetCoalitionPrimordialContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_absolute_sanctity_charter') {
    nextState = resetCoalitionAbsoluteSanctityStreak(nextState);
  }
  if (action.id === 'sga_coalition_absolute_continuity_pact') {
    nextState = resetCoalitionAbsoluteSanctityStreak(nextState);
  }
  if (action.id === 'sga_coalition_universal_immortality_charter') {
    nextState = resetCoalitionUniversalImmortalityStreak(nextState);
  }
  if (action.id === 'sga_coalition_universal_continuity_compact') {
    nextState = resetCoalitionUniversalImmortalityStreak(nextState);
  }
  if (action.id === 'sga_coalition_cosmic_perpetuity_charter') {
    nextState = resetCoalitionCosmicPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_cosmic_continuity_covenant') {
    nextState = resetCoalitionCosmicPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_galactic_infinity_charter') {
    nextState = resetCoalitionGalacticInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_galactic_continuity_endowment') {
    nextState = resetCoalitionGalacticInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_stellar_transcendence_charter') {
    nextState = resetCoalitionStellarTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_stellar_continuity_compact') {
    nextState = resetCoalitionStellarTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_quantum_omnipresence_charter') {
    nextState = resetCoalitionQuantumOmnipresenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_quantum_continuity_covenant') {
    nextState = resetCoalitionQuantumOmnipresenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_multiversal_persistence_charter') {
    nextState = resetCoalitionMultiversalPersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_multiversal_continuity_pact') {
    nextState = resetCoalitionMultiversalPersistenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_metaversal_continuity_charter') {
    nextState = resetCoalitionMetaversalContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_metaversal_permanence_endowment') {
    nextState = resetCoalitionMetaversalContinuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_omniversal_synthesis_charter') {
    nextState = resetCoalitionOmniversalSynthesisStreak(nextState);
  }
  if (action.id === 'sga_coalition_omniversal_continuity_covenant') {
    nextState = resetCoalitionOmniversalSynthesisStreak(nextState);
  }
  if (action.id === 'sga_coalition_hyperversal_harmonization_charter') {
    nextState = resetCoalitionHyperversalHarmonizationStreak(nextState);
  }
  if (action.id === 'sga_coalition_hyperversal_continuity_pact') {
    nextState = resetCoalitionHyperversalHarmonizationStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_omnium_charter') {
    nextState = resetCoalitionTranscendentOmniumStreak(nextState);
  }
  if (action.id === 'sga_coalition_transcendent_permanence_endowment') {
    nextState = resetCoalitionTranscendentOmniumStreak(nextState);
  }
  if (action.id === 'sga_coalition_supreme_convergence_charter') {
    nextState = resetCoalitionSupremeConvergenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_supreme_continuity_covenant') {
    nextState = resetCoalitionSupremeConvergenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_apex_transcendence_charter') {
    nextState = resetCoalitionApexTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_apex_continuity_pact') {
    nextState = resetCoalitionApexTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_zenith_perpetuity_charter') {
    nextState = resetCoalitionZenithPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_zenith_continuity_endowment') {
    nextState = resetCoalitionZenithPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_paragon_infinity_charter') {
    nextState = resetCoalitionParagonInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_paragon_continuity_covenant') {
    nextState = resetCoalitionParagonInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_paramount_ascendancy_charter') {
    nextState = resetCoalitionParamountAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_paramount_continuity_pact') {
    nextState = resetCoalitionParamountAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_imperial_perpetuity_charter') {
    nextState = resetCoalitionImperialPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_imperial_continuity_compact') {
    nextState = resetCoalitionImperialPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_custodial_eternity_charter') {
    nextState = resetCoalitionCustodialEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_custodial_continuity_accord') {
    nextState = resetCoalitionCustodialEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_vanguard_synthesis_charter') {
    nextState = resetCoalitionVanguardSynthesisStreak(nextState);
  }
  if (action.id === 'sga_coalition_vanguard_continuity_protocol') {
    nextState = resetCoalitionVanguardSynthesisStreak(nextState);
  }
  if (action.id === 'sga_coalition_sentinel_ascendancy_charter') {
    nextState = resetCoalitionSentinelAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_sentinel_continuity_mandate') {
    nextState = resetCoalitionSentinelAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_oracle_perpetuity_charter') {
    nextState = resetCoalitionOraclePerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_oracle_continuity_covenant') {
    nextState = resetCoalitionOraclePerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_archon_eternity_charter') {
    nextState = resetCoalitionArchonEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_archon_continuity_covenant') {
    nextState = resetCoalitionArchonEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_exarch_ascendancy_charter') {
    nextState = resetCoalitionExarchAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_exarch_continuity_covenant') {
    nextState = resetCoalitionExarchAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_primarch_perpetuity_charter') {
    nextState = resetCoalitionPrimarchPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_primarch_continuity_covenant') {
    nextState = resetCoalitionPrimarchPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_patriarch_eternity_charter') {
    nextState = resetCoalitionPatriarchEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_patriarch_continuity_covenant') {
    nextState = resetCoalitionPatriarchEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_ascendancy_charter') {
    nextState = resetCoalitionMatriarchAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_continuity_covenant') {
    nextState = resetCoalitionMatriarchAscendancyStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_perpetuity_charter') {
    nextState = resetCoalitionMatriarchPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_perpetuity_covenant') {
    nextState = resetCoalitionMatriarchPerpetuityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_eternity_charter') {
    nextState = resetCoalitionMatriarchEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_eternity_covenant') {
    nextState = resetCoalitionMatriarchEternityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_infinity_charter') {
    nextState = resetCoalitionMatriarchInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_infinity_covenant') {
    nextState = resetCoalitionMatriarchInfinityStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_transcendence_charter') {
    nextState = resetCoalitionMatriarchTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_transcendence_covenant') {
    nextState = resetCoalitionMatriarchTranscendenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_apotheosis_charter') {
    nextState = resetCoalitionMatriarchApotheosisStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_apotheosis_covenant') {
    nextState = resetCoalitionMatriarchApotheosisStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_deification_charter') {
    nextState = resetCoalitionMatriarchDeificationStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_deification_covenant') {
    nextState = resetCoalitionMatriarchDeificationStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_omnipotence_charter') {
    nextState = resetCoalitionMatriarchOmnipotenceStreak(nextState);
  }
  if (action.id === 'sga_coalition_matriarch_omnipotence_covenant') {
    nextState = resetCoalitionMatriarchOmnipotenceStreak(nextState);
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
  'sga_coalition_civilizational_endurance_charter': {
    id: 'sga_coalition_civilizational_endurance_charter',
    title: 'Civilizational Coalition Endurance Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 24_000,
    treasuryCost: 84_000,
    minApproval: 58,
    alignedPriorities: ['economic_diversification', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'civilizational_endurance', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 79,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionGenerationalContinuityStreakDays: 4,
    minCoalitionCivilizationalEnduranceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -24_000, treasuryDelta: -84_000, netWorthMultiplier: 1.009 },
      government: { approvalDelta: 7, directiveSlotsDelta: 1, regulatoryBurdenDelta: -4 },
      population: { publicStabilityDelta: 7, migrationDelta: 3 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_civilizational_heritage_covenant': {
    id: 'sga_coalition_civilizational_heritage_covenant',
    title: 'Civilizational Coalition Heritage Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 17_000,
    treasuryCost: 62_000,
    minApproval: 55,
    alignedPriorities: ['technology_competitiveness', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'civilizational', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCivilizationalEnduranceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -17_000, treasuryDelta: -62_000 },
      government: { approvalDelta: 5 },
      population: { publicStabilityDelta: 5, essentialAccessDelta: 3 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_transcendent_legacy_charter': {
    id: 'sga_coalition_transcendent_legacy_charter',
    title: 'Transcendent Coalition Legacy Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 25_000,
    treasuryCost: 88_000,
    minApproval: 59,
    alignedPriorities: ['economic_diversification', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'transcendent_legacy', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 80,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCivilizationalEnduranceStreakDays: 4,
    minCoalitionTranscendentLegacyStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -25_000, treasuryDelta: -88_000, netWorthMultiplier: 1.01 },
      government: { approvalDelta: 8, directiveSlotsDelta: 1, regulatoryBurdenDelta: -4 },
      population: { publicStabilityDelta: 7, migrationDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_transcendent_enduring_covenant': {
    id: 'sga_coalition_transcendent_enduring_covenant',
    title: 'Transcendent Coalition Enduring Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 18_000,
    treasuryCost: 64_000,
    minApproval: 55,
    alignedPriorities: ['supply_chain_security', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'transcendent', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionTranscendentLegacyStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -18_000, treasuryDelta: -64_000 },
      government: { approvalDelta: 5 },
      population: { publicStabilityDelta: 6, essentialAccessDelta: 3 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_sovereign_continuum_charter': {
    id: 'sga_coalition_sovereign_continuum_charter',
    title: 'Sovereign Coalition Continuum Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 26_000,
    treasuryCost: 92_000,
    minApproval: 60,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'sovereign_continuum', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 81,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionTranscendentLegacyStreakDays: 4,
    minCoalitionSovereignContinuumStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -26_000, treasuryDelta: -92_000, netWorthMultiplier: 1.011 },
      government: { approvalDelta: 8, directiveSlotsDelta: 1, regulatoryBurdenDelta: -5 },
      population: { publicStabilityDelta: 8, migrationDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_sovereign_continuity_endowment': {
    id: 'sga_coalition_sovereign_continuity_endowment',
    title: 'Sovereign Coalition Continuity Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 19_000,
    treasuryCost: 66_000,
    minApproval: 55,
    alignedPriorities: ['technology_competitiveness', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'sovereign', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSovereignContinuumStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -19_000, treasuryDelta: -66_000 },
      government: { approvalDelta: 6 },
      population: { publicStabilityDelta: 6, essentialAccessDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_eternal_ascendance_charter': {
    id: 'sga_coalition_eternal_ascendance_charter',
    title: 'Eternal Coalition Ascendance Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 27_000,
    treasuryCost: 96_000,
    minApproval: 60,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'eternal_ascendance', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 82,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSovereignContinuumStreakDays: 4,
    minCoalitionEternalAscendanceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -27_000, treasuryDelta: -96_000, netWorthMultiplier: 1.012 },
      government: { approvalDelta: 9, directiveSlotsDelta: 1, regulatoryBurdenDelta: -5 },
      population: { publicStabilityDelta: 8, migrationDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_eternal_continuity_covenant': {
    id: 'sga_coalition_eternal_continuity_covenant',
    title: 'Eternal Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 20_000,
    treasuryCost: 68_000,
    minApproval: 55,
    alignedPriorities: ['economic_diversification', 'supply_chain_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'eternal', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionEternalAscendanceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -20_000, treasuryDelta: -68_000 },
      government: { approvalDelta: 6 },
      population: { publicStabilityDelta: 6, essentialAccessDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_infinite_persistence_charter': {
    id: 'sga_coalition_infinite_persistence_charter',
    title: 'Infinite Coalition Persistence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 28_000,
    treasuryCost: 100_000,
    minApproval: 61,
    alignedPriorities: ['freight_modernization', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'infinite_persistence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 83,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionEternalAscendanceStreakDays: 4,
    minCoalitionInfinitePersistenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -28_000, treasuryDelta: -100_000, netWorthMultiplier: 1.013 },
      government: { approvalDelta: 9, directiveSlotsDelta: 1, regulatoryBurdenDelta: -5 },
      population: { publicStabilityDelta: 9, migrationDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_infinite_continuity_accord': {
    id: 'sga_coalition_infinite_continuity_accord',
    title: 'Infinite Coalition Continuity Accord',
    category: 'investment',
    apCost: 1,
    cashCost: 21_000,
    treasuryCost: 70_000,
    minApproval: 55,
    alignedPriorities: ['water_security', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'infinite', 'accord'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionInfinitePersistenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -21_000, treasuryDelta: -70_000 },
      government: { approvalDelta: 6 },
      population: { publicStabilityDelta: 7, essentialAccessDelta: 4 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_primordial_continuity_charter': {
    id: 'sga_coalition_primordial_continuity_charter',
    title: 'Primordial Coalition Continuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 29_000,
    treasuryCost: 104_000,
    minApproval: 62,
    alignedPriorities: ['supply_chain_security', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'primordial_continuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 84,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionInfinitePersistenceStreakDays: 4,
    minCoalitionPrimordialContinuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -29_000, treasuryDelta: -104_000, netWorthMultiplier: 1.014 },
      government: { approvalDelta: 10, directiveSlotsDelta: 1, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 9, migrationDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_primordial_continuity_endowment': {
    id: 'sga_coalition_primordial_continuity_endowment',
    title: 'Primordial Coalition Continuity Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 22_000,
    treasuryCost: 72_000,
    minApproval: 55,
    alignedPriorities: ['technology_competitiveness', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'primordial', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPrimordialContinuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -22_000, treasuryDelta: -72_000 },
      government: { approvalDelta: 6 },
      population: { publicStabilityDelta: 7, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_absolute_sanctity_charter': {
    id: 'sga_coalition_absolute_sanctity_charter',
    title: 'Absolute Coalition Sanctity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 30_000,
    treasuryCost: 108_000,
    minApproval: 63,
    alignedPriorities: ['energy_resilience', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'absolute_sanctity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 85,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPrimordialContinuityStreakDays: 4,
    minCoalitionAbsoluteSanctityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -30_000, treasuryDelta: -108_000, netWorthMultiplier: 1.015 },
      government: { approvalDelta: 10, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 9, migrationDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_absolute_continuity_pact': {
    id: 'sga_coalition_absolute_continuity_pact',
    title: 'Absolute Coalition Continuity Pact',
    category: 'investment',
    apCost: 1,
    cashCost: 23_000,
    treasuryCost: 74_000,
    minApproval: 55,
    alignedPriorities: ['freight_modernization', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'absolute', 'pact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionAbsoluteSanctityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -23_000, treasuryDelta: -74_000 },
      government: { approvalDelta: 6 },
      population: { publicStabilityDelta: 7, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_universal_immortality_charter': {
    id: 'sga_coalition_universal_immortality_charter',
    title: 'Universal Coalition Immortality Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 31_000,
    treasuryCost: 112_000,
    minApproval: 64,
    alignedPriorities: ['supply_chain_security', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'universal_immortality', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 86,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionAbsoluteSanctityStreakDays: 4,
    minCoalitionUniversalImmortalityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -31_000, treasuryDelta: -112_000, netWorthMultiplier: 1.016 },
      government: { approvalDelta: 10, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_universal_continuity_compact': {
    id: 'sga_coalition_universal_continuity_compact',
    title: 'Universal Coalition Continuity Compact',
    category: 'investment',
    apCost: 1,
    cashCost: 24_000,
    treasuryCost: 76_000,
    minApproval: 55,
    alignedPriorities: ['water_security', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'universal', 'compact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionUniversalImmortalityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -24_000, treasuryDelta: -76_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 7, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_cosmic_perpetuity_charter': {
    id: 'sga_coalition_cosmic_perpetuity_charter',
    title: 'Cosmic Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 32_000,
    treasuryCost: 116_000,
    minApproval: 65,
    alignedPriorities: ['energy_resilience', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'cosmic_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 87,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionUniversalImmortalityStreakDays: 4,
    minCoalitionCosmicPerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -32_000, treasuryDelta: -116_000, netWorthMultiplier: 1.017 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_cosmic_continuity_covenant': {
    id: 'sga_coalition_cosmic_continuity_covenant',
    title: 'Cosmic Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 25_000,
    treasuryCost: 78_000,
    minApproval: 55,
    alignedPriorities: ['economic_diversification', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'cosmic', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCosmicPerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -25_000, treasuryDelta: -78_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_galactic_infinity_charter': {
    id: 'sga_coalition_galactic_infinity_charter',
    title: 'Galactic Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 33_000,
    treasuryCost: 118_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'galactic_infinity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 88,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCosmicPerpetuityStreakDays: 4,
    minCoalitionGalacticInfinityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -33_000, treasuryDelta: -118_000, netWorthMultiplier: 1.018 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_galactic_continuity_endowment': {
    id: 'sga_coalition_galactic_continuity_endowment',
    title: 'Galactic Coalition Continuity Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 26_000,
    treasuryCost: 80_000,
    minApproval: 55,
    alignedPriorities: ['freight_modernization', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'galactic', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionGalacticInfinityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -26_000, treasuryDelta: -80_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_stellar_transcendence_charter': {
    id: 'sga_coalition_stellar_transcendence_charter',
    title: 'Stellar Coalition Transcendence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 34_000,
    treasuryCost: 120_000,
    minApproval: 65,
    alignedPriorities: ['energy_resilience', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'stellar_transcendence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 89,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionGalacticInfinityStreakDays: 4,
    minCoalitionStellarTranscendenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -34_000, treasuryDelta: -120_000, netWorthMultiplier: 1.019 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_stellar_continuity_compact': {
    id: 'sga_coalition_stellar_continuity_compact',
    title: 'Stellar Coalition Continuity Compact',
    category: 'investment',
    apCost: 1,
    cashCost: 27_000,
    treasuryCost: 82_000,
    minApproval: 55,
    alignedPriorities: ['water_security', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'stellar', 'compact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionStellarTranscendenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -27_000, treasuryDelta: -82_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_quantum_omnipresence_charter': {
    id: 'sga_coalition_quantum_omnipresence_charter',
    title: 'Quantum Coalition Omnipresence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 35_000,
    treasuryCost: 122_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'quantum_omnipresence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 90,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionStellarTranscendenceStreakDays: 4,
    minCoalitionQuantumOmnipresenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -35_000, treasuryDelta: -122_000, netWorthMultiplier: 1.02 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_quantum_continuity_covenant': {
    id: 'sga_coalition_quantum_continuity_covenant',
    title: 'Quantum Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 28_000,
    treasuryCost: 84_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'water_security'],
    conflictingPriorities: [],
    tags: ['coalition', 'quantum', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionQuantumOmnipresenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -28_000, treasuryDelta: -84_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_multiversal_persistence_charter': {
    id: 'sga_coalition_multiversal_persistence_charter',
    title: 'Multiversal Coalition Persistence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 36_000,
    treasuryCost: 124_000,
    minApproval: 65,
    alignedPriorities: ['economic_diversification', 'technology_competitiveness'],
    conflictingPriorities: [],
    tags: ['coalition', 'multiversal_persistence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 91,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionQuantumOmnipresenceStreakDays: 4,
    minCoalitionMultiversalPersistenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -36_000, treasuryDelta: -124_000, netWorthMultiplier: 1.021 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_multiversal_continuity_pact': {
    id: 'sga_coalition_multiversal_continuity_pact',
    title: 'Multiversal Coalition Continuity Pact',
    category: 'investment',
    apCost: 1,
    cashCost: 29_000,
    treasuryCost: 86_000,
    minApproval: 55,
    alignedPriorities: ['freight_modernization', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'multiversal', 'pact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMultiversalPersistenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -29_000, treasuryDelta: -86_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_metaversal_continuity_charter': {
    id: 'sga_coalition_metaversal_continuity_charter',
    title: 'Metaversal Coalition Continuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 37_000,
    treasuryCost: 126_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'energy_resilience'],
    conflictingPriorities: [],
    tags: ['coalition', 'metaversal_continuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 92,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMultiversalPersistenceStreakDays: 4,
    minCoalitionMetaversalContinuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -37_000, treasuryDelta: -126_000, netWorthMultiplier: 1.022 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_metaversal_permanence_endowment': {
    id: 'sga_coalition_metaversal_permanence_endowment',
    title: 'Metaversal Coalition Permanence Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 30_000,
    treasuryCost: 88_000,
    minApproval: 55,
    alignedPriorities: ['water_security', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'metaversal', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMetaversalContinuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -30_000, treasuryDelta: -88_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_omniversal_synthesis_charter': {
    id: 'sga_coalition_omniversal_synthesis_charter',
    title: 'Omniversal Coalition Synthesis Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 38_000,
    treasuryCost: 128_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'omniversal_synthesis', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 93,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMetaversalContinuityStreakDays: 4,
    minCoalitionOmniversalSynthesisStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -38_000, treasuryDelta: -128_000, netWorthMultiplier: 1.023 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_omniversal_continuity_covenant': {
    id: 'sga_coalition_omniversal_continuity_covenant',
    title: 'Omniversal Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 31_000,
    treasuryCost: 90_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'omniversal', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionOmniversalSynthesisStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -31_000, treasuryDelta: -90_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_hyperversal_harmonization_charter': {
    id: 'sga_coalition_hyperversal_harmonization_charter',
    title: 'Hyperversal Coalition Harmonization Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 40_000,
    treasuryCost: 132_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'hyperversal_harmonization', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 94,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionOmniversalSynthesisStreakDays: 4,
    minCoalitionHyperversalHarmonizationStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -40_000, treasuryDelta: -132_000, netWorthMultiplier: 1.024 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_hyperversal_continuity_pact': {
    id: 'sga_coalition_hyperversal_continuity_pact',
    title: 'Hyperversal Coalition Continuity Pact',
    category: 'investment',
    apCost: 1,
    cashCost: 32_000,
    treasuryCost: 92_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'hyperversal', 'pact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionHyperversalHarmonizationStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -32_000, treasuryDelta: -92_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_transcendent_omnium_charter': {
    id: 'sga_coalition_transcendent_omnium_charter',
    title: 'Transcendent Coalition Omnium Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 42_000,
    treasuryCost: 136_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'transcendent_omnium', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 95,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionHyperversalHarmonizationStreakDays: 4,
    minCoalitionTranscendentOmniumStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -42_000, treasuryDelta: -136_000, netWorthMultiplier: 1.025 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_transcendent_permanence_endowment': {
    id: 'sga_coalition_transcendent_permanence_endowment',
    title: 'Transcendent Coalition Permanence Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 33_000,
    treasuryCost: 94_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'transcendent', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionTranscendentOmniumStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -33_000, treasuryDelta: -94_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_supreme_convergence_charter': {
    id: 'sga_coalition_supreme_convergence_charter',
    title: 'Supreme Coalition Convergence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 44_000,
    treasuryCost: 140_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'supreme_convergence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 96,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionTranscendentOmniumStreakDays: 4,
    minCoalitionSupremeConvergenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -44_000, treasuryDelta: -140_000, netWorthMultiplier: 1.026 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_supreme_continuity_covenant': {
    id: 'sga_coalition_supreme_continuity_covenant',
    title: 'Supreme Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 34_000,
    treasuryCost: 96_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'supreme', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSupremeConvergenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -34_000, treasuryDelta: -96_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_apex_transcendence_charter': {
    id: 'sga_coalition_apex_transcendence_charter',
    title: 'Apex Coalition Transcendence Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 46_000,
    treasuryCost: 144_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'apex_transcendence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 97,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSupremeConvergenceStreakDays: 4,
    minCoalitionApexTranscendenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -46_000, treasuryDelta: -144_000, netWorthMultiplier: 1.027 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_apex_continuity_pact': {
    id: 'sga_coalition_apex_continuity_pact',
    title: 'Apex Coalition Continuity Pact',
    category: 'investment',
    apCost: 1,
    cashCost: 35_000,
    treasuryCost: 98_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'apex', 'pact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionApexTranscendenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -35_000, treasuryDelta: -98_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_zenith_perpetuity_charter': {
    id: 'sga_coalition_zenith_perpetuity_charter',
    title: 'Zenith Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 48_000,
    treasuryCost: 148_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'zenith_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 98,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionApexTranscendenceStreakDays: 4,
    minCoalitionZenithPerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -48_000, treasuryDelta: -148_000, netWorthMultiplier: 1.028 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_zenith_continuity_endowment': {
    id: 'sga_coalition_zenith_continuity_endowment',
    title: 'Zenith Coalition Continuity Endowment',
    category: 'investment',
    apCost: 1,
    cashCost: 36_000,
    treasuryCost: 100_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'zenith', 'endowment'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionZenithPerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -36_000, treasuryDelta: -100_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_paragon_infinity_charter': {
    id: 'sga_coalition_paragon_infinity_charter',
    title: 'Paragon Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 50_000,
    treasuryCost: 152_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'paragon_infinity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 99,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionZenithPerpetuityStreakDays: 4,
    minCoalitionParagonInfinityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -50_000, treasuryDelta: -152_000, netWorthMultiplier: 1.029 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_paragon_continuity_covenant': {
    id: 'sga_coalition_paragon_continuity_covenant',
    title: 'Paragon Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 37_000,
    treasuryCost: 102_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'paragon', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionParagonInfinityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -37_000, treasuryDelta: -102_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_paramount_ascendancy_charter': {
    id: 'sga_coalition_paramount_ascendancy_charter',
    title: 'Paramount Coalition Ascendancy Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 52_000,
    treasuryCost: 156_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'paramount_ascendancy', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 100,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionParagonInfinityStreakDays: 4,
    minCoalitionParamountAscendancyStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -52_000, treasuryDelta: -156_000, netWorthMultiplier: 1.03 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_paramount_continuity_pact': {
    id: 'sga_coalition_paramount_continuity_pact',
    title: 'Paramount Coalition Continuity Pact',
    category: 'investment',
    apCost: 1,
    cashCost: 38_000,
    treasuryCost: 104_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'paramount', 'pact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionParamountAscendancyStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -38_000, treasuryDelta: -104_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_imperial_perpetuity_charter': {
    id: 'sga_coalition_imperial_perpetuity_charter',
    title: 'Imperial Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 54_000,
    treasuryCost: 160_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'imperial_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 101,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionParamountAscendancyStreakDays: 4,
    minCoalitionImperialPerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -54_000, treasuryDelta: -160_000, netWorthMultiplier: 1.031 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_imperial_continuity_compact': {
    id: 'sga_coalition_imperial_continuity_compact',
    title: 'Imperial Coalition Continuity Compact',
    category: 'investment',
    apCost: 1,
    cashCost: 39_000,
    treasuryCost: 106_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'imperial', 'compact'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionImperialPerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -39_000, treasuryDelta: -106_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_custodial_eternity_charter': {
    id: 'sga_coalition_custodial_eternity_charter',
    title: 'Custodial Coalition Eternity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 56_000,
    treasuryCost: 164_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'custodial_eternity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 102,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionImperialPerpetuityStreakDays: 4,
    minCoalitionCustodialEternityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -56_000, treasuryDelta: -164_000, netWorthMultiplier: 1.032 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_custodial_continuity_accord': {
    id: 'sga_coalition_custodial_continuity_accord',
    title: 'Custodial Coalition Continuity Accord',
    category: 'investment',
    apCost: 1,
    cashCost: 40_000,
    treasuryCost: 108_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'custodial', 'accord'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCustodialEternityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -40_000, treasuryDelta: -108_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_vanguard_synthesis_charter': {
    id: 'sga_coalition_vanguard_synthesis_charter',
    title: 'Vanguard Coalition Synthesis Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 58_000,
    treasuryCost: 168_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'vanguard_synthesis', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 103,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionCustodialEternityStreakDays: 4,
    minCoalitionVanguardSynthesisStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -58_000, treasuryDelta: -168_000, netWorthMultiplier: 1.033 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_vanguard_continuity_protocol': {
    id: 'sga_coalition_vanguard_continuity_protocol',
    title: 'Vanguard Coalition Continuity Protocol',
    category: 'investment',
    apCost: 1,
    cashCost: 41_000,
    treasuryCost: 110_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'vanguard', 'protocol'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionVanguardSynthesisStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -41_000, treasuryDelta: -110_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_sentinel_ascendancy_charter': {
    id: 'sga_coalition_sentinel_ascendancy_charter',
    title: 'Sentinel Coalition Ascendancy Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 60_000,
    treasuryCost: 172_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'sentinel_ascendancy', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 104,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionVanguardSynthesisStreakDays: 4,
    minCoalitionSentinelAscendancyStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -60_000, treasuryDelta: -172_000, netWorthMultiplier: 1.034 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_sentinel_continuity_mandate': {
    id: 'sga_coalition_sentinel_continuity_mandate',
    title: 'Sentinel Coalition Continuity Mandate',
    category: 'investment',
    apCost: 1,
    cashCost: 42_000,
    treasuryCost: 112_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'sentinel', 'mandate'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSentinelAscendancyStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -42_000, treasuryDelta: -112_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_oracle_perpetuity_charter': {
    id: 'sga_coalition_oracle_perpetuity_charter',
    title: 'Oracle Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 62_000,
    treasuryCost: 176_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'oracle_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 105,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionSentinelAscendancyStreakDays: 4,
    minCoalitionOraclePerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -62_000, treasuryDelta: -176_000, netWorthMultiplier: 1.035 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_oracle_continuity_covenant': {
    id: 'sga_coalition_oracle_continuity_covenant',
    title: 'Oracle Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 43_000,
    treasuryCost: 114_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'oracle', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionOraclePerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -43_000, treasuryDelta: -114_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_archon_eternity_charter': {
    id: 'sga_coalition_archon_eternity_charter',
    title: 'Archon Coalition Eternity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 64_000,
    treasuryCost: 180_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'archon_eternity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 106,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionOraclePerpetuityStreakDays: 4,
    minCoalitionArchonEternityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -64_000, treasuryDelta: -180_000, netWorthMultiplier: 1.036 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_archon_continuity_covenant': {
    id: 'sga_coalition_archon_continuity_covenant',
    title: 'Archon Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 45_000,
    treasuryCost: 118_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'archon', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionArchonEternityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -45_000, treasuryDelta: -118_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_exarch_ascendancy_charter': {
    id: 'sga_coalition_exarch_ascendancy_charter',
    title: 'Exarch Coalition Ascendancy Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 66_000,
    treasuryCost: 184_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'exarch_ascendancy', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 107,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionArchonEternityStreakDays: 4,
    minCoalitionExarchAscendancyStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -66_000, treasuryDelta: -184_000, netWorthMultiplier: 1.037 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_exarch_continuity_covenant': {
    id: 'sga_coalition_exarch_continuity_covenant',
    title: 'Exarch Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 47_000,
    treasuryCost: 122_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'exarch', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionExarchAscendancyStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -47_000, treasuryDelta: -122_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_primarch_perpetuity_charter': {
    id: 'sga_coalition_primarch_perpetuity_charter',
    title: 'Primarch Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 68_000,
    treasuryCost: 188_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'primarch_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 108,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionExarchAscendancyStreakDays: 4,
    minCoalitionPrimarchPerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -68_000, treasuryDelta: -188_000, netWorthMultiplier: 1.038 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_primarch_continuity_covenant': {
    id: 'sga_coalition_primarch_continuity_covenant',
    title: 'Primarch Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 49_000,
    treasuryCost: 126_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'primarch', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPrimarchPerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -49_000, treasuryDelta: -126_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_patriarch_eternity_charter': {
    id: 'sga_coalition_patriarch_eternity_charter',
    title: 'Patriarch Coalition Eternity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 70_000,
    treasuryCost: 192_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'patriarch_eternity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 109,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPrimarchPerpetuityStreakDays: 4,
    minCoalitionPatriarchEternityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -70_000, treasuryDelta: -192_000, netWorthMultiplier: 1.039 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_patriarch_continuity_covenant': {
    id: 'sga_coalition_patriarch_continuity_covenant',
    title: 'Patriarch Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 51_000,
    treasuryCost: 130_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'patriarch', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPatriarchEternityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -51_000, treasuryDelta: -130_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_ascendancy_charter': {
    id: 'sga_coalition_matriarch_ascendancy_charter',
    title: 'Matriarch Coalition Ascendancy Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 72_000,
    treasuryCost: 196_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_ascendancy', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 110,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionPatriarchEternityStreakDays: 4,
    minCoalitionMatriarchAscendancyStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -72_000, treasuryDelta: -196_000, netWorthMultiplier: 1.04 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_continuity_covenant': {
    id: 'sga_coalition_matriarch_continuity_covenant',
    title: 'Matriarch Coalition Continuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 53_000,
    treasuryCost: 134_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchAscendancyStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -53_000, treasuryDelta: -134_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_perpetuity_charter': {
    id: 'sga_coalition_matriarch_perpetuity_charter',
    title: 'Matriarch Coalition Perpetuity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 74_000,
    treasuryCost: 200_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_perpetuity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 111,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchAscendancyStreakDays: 4,
    minCoalitionMatriarchPerpetuityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -74_000, treasuryDelta: -200_000, netWorthMultiplier: 1.041 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_perpetuity_covenant': {
    id: 'sga_coalition_matriarch_perpetuity_covenant',
    title: 'Matriarch Coalition Perpetuity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 55_000,
    treasuryCost: 138_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_perpetuity', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchPerpetuityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -55_000, treasuryDelta: -138_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_eternity_charter': {
    id: 'sga_coalition_matriarch_eternity_charter',
    title: 'Matriarch Coalition Eternity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 76_000,
    treasuryCost: 204_000,
    minApproval: 65,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_eternity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 112,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchPerpetuityStreakDays: 4,
    minCoalitionMatriarchEternityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -76_000, treasuryDelta: -204_000, netWorthMultiplier: 1.042 },
      government: { approvalDelta: 11, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 10, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_infinity_charter': {
    id: 'sga_coalition_matriarch_infinity_charter',
    title: 'Matriarch Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 78_000,
    treasuryCost: 210_000,
    minApproval: 66,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_infinity', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 114,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchEternityStreakDays: 4,
    minCoalitionMatriarchInfinityStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -78_000, treasuryDelta: -210_000, netWorthMultiplier: 1.044 },
      government: { approvalDelta: 12, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 11, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_infinity_covenant': {
    id: 'sga_coalition_matriarch_infinity_covenant',
    title: 'Matriarch Coalition Infinity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 59_000,
    treasuryCost: 146_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_infinity', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchInfinityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -59_000, treasuryDelta: -146_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_transcendence_charter': {
    id: 'sga_coalition_matriarch_transcendence_charter',
    title: 'Matriarch Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 80_000,
    treasuryCost: 216_000,
    minApproval: 67,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_transcendence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 116,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchInfinityStreakDays: 4,
    minCoalitionMatriarchTranscendenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -80_000, treasuryDelta: -216_000, netWorthMultiplier: 1.046 },
      government: { approvalDelta: 13, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 11, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_transcendence_covenant': {
    id: 'sga_coalition_matriarch_transcendence_covenant',
    title: 'Matriarch Coalition Infinity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 61_000,
    treasuryCost: 150_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_transcendence', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchTranscendenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -61_000, treasuryDelta: -150_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_apotheosis_charter': {
    id: 'sga_coalition_matriarch_apotheosis_charter',
    title: 'Matriarch Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 82_000,
    treasuryCost: 218_000,
    minApproval: 67,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_apotheosis', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 118,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchTranscendenceStreakDays: 4,
    minCoalitionMatriarchApotheosisStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -82_000, treasuryDelta: -218_000, netWorthMultiplier: 1.046 },
      government: { approvalDelta: 13, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 11, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_apotheosis_covenant': {
    id: 'sga_coalition_matriarch_apotheosis_covenant',
    title: 'Matriarch Coalition Infinity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 63_000,
    treasuryCost: 152_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_apotheosis', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchApotheosisStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -63_000, treasuryDelta: -152_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_deification_charter': {
    id: 'sga_coalition_matriarch_deification_charter',
    title: 'Matriarch Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 82_000,
    treasuryCost: 218_000,
    minApproval: 67,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_deification', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 118,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchTranscendenceStreakDays: 4,
    minCoalitionMatriarchDeificationStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -82_000, treasuryDelta: -218_000, netWorthMultiplier: 1.046 },
      government: { approvalDelta: 13, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 11, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_deification_covenant': {
    id: 'sga_coalition_matriarch_deification_covenant',
    title: 'Matriarch Coalition Infinity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 63_000,
    treasuryCost: 152_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_deification', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchDeificationStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -63_000, treasuryDelta: -152_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_omnipotence_charter': {
    id: 'sga_coalition_matriarch_omnipotence_charter',
    title: 'Matriarch Coalition Infinity Charter',
    category: 'governance',
    apCost: 2,
    cashCost: 84_000,
    treasuryCost: 220_000,
    minApproval: 67,
    alignedPriorities: ['technology_competitiveness', 'economic_diversification'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_omnipotence', 'charter'],
    repeatable: false,
    minCoalitionBalanceIndex: 120,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchTranscendenceStreakDays: 4,
    minCoalitionMatriarchOmnipotenceStreakDays: 4,
    immediateEffects: {
      economy: { cashDelta: -84_000, treasuryDelta: -220_000, netWorthMultiplier: 1.046 },
      government: { approvalDelta: 13, directiveSlotsDelta: 2, regulatoryBurdenDelta: -6 },
      population: { publicStabilityDelta: 11, migrationDelta: 6 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_omnipotence_covenant': {
    id: 'sga_coalition_matriarch_omnipotence_covenant',
    title: 'Matriarch Coalition Infinity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 65_000,
    treasuryCost: 154_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_omnipotence', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchOmnipotenceStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -65_000, treasuryDelta: -154_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
    },
    delayedTradeOffs: [],
  },
  'sga_coalition_matriarch_eternity_covenant': {
    id: 'sga_coalition_matriarch_eternity_covenant',
    title: 'Matriarch Coalition Eternity Covenant',
    category: 'investment',
    apCost: 1,
    cashCost: 57_000,
    treasuryCost: 142_000,
    minApproval: 55,
    alignedPriorities: ['energy_resilience', 'freight_modernization'],
    conflictingPriorities: [],
    tags: ['coalition', 'matriarch_eternity', 'covenant'],
    repeatable: true,
    maxCoalitionVolatilityEvents: 0,
    minCoalitionMatriarchEternityStreakDays: 2,
    cooldownDays: 4,
    immediateEffects: {
      economy: { cashDelta: -57_000, treasuryDelta: -142_000 },
      government: { approvalDelta: 7 },
      population: { publicStabilityDelta: 8, essentialAccessDelta: 5 },
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

export const AGENT_01_MODULE_VERSION = '5.12.0';



export function runOp10mAgent01StrategicGameplaySelfTests(): {

  passed: number;

  failed: number;

  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;

} {

  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];

  results.push({

    id: 'agent01_catalog',

    name: 'strategic action catalog non-empty',

    passed: listStrategicActions().length >= 36,

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
