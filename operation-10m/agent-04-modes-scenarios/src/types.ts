/** Mirrors canonical `(V9.4) australia-game-with-ai.tsx` scenario/mode shapes for standalone assembly. */

export type GameModeSelection =
  | 'single'
  | 'ai'
  | 'grand_tour'
  | 'team_human_ai_vs_ai_ai'
  | 'team_ai_vs_ai'
  | 'scenario';

export type ScenarioDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type ContentComplexity = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type ScenarioObjectiveTargetType =
  | 'money'
  | 'regions'
  | 'netWorth'
  | 'challenges'
  | 'regionalStanding'
  | 'daysPassed'
  | 'money_accumulated'
  | 'regions_controlled'
  | 'turns_survived'
  | 'standing_reached'
  | 'ai_eliminated'
  | 'challenges_completed'
  | 'public_stability'
  | 'crisis_resolved'
  | 'territory_controlled'
  | 'debt_cleared'
  | 'investments_count'
  | 'standing_threshold'
  | 'specific_region_controlled'
  | 'zero_sabotage_taken'
  | 'governance_proposals_passed'
  | 'multi_actor_standing_avg';

export interface ScenarioObjective {
  id: string;
  label: string;
  description: string;
  targetType: ScenarioObjectiveTargetType;
  targetValue: number;
  isPrimary?: boolean;
  targetRegionId?: string;
  targetActorId?: string;
  timeLimitDays?: number;
}

export type ScenarioModifierDomain =
  | 'economic'
  | 'ai_behavior'
  | 'stability'
  | 'crisis'
  | 'regional_standing'
  | 'resource_prices'
  | 'turn_limits';

export interface ScenarioModifier {
  id: string;
  name: string;
  description: string;
  domain: ScenarioModifierDomain;
  targetKey: string;
  value: number | string | boolean;
  isGlobal: boolean;
  affectedActorIds?: string[];
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'challenge' | 'historical' | 'expert' | 'experimental' | 'custom';
  difficulty: ScenarioDifficulty;
  forcedSeed?: number;
  startingMoney: number;
  startingRegions: string[];
  startingItems?: Array<{ itemId: string; quantity: number }>;
  startingLoans?: Array<{ id: string; amount: number; interestRate: number; termDays: number }>;
  startingStanding?: Record<string, number>;
  forcedSettings: Record<string, unknown>;
  objectives: ScenarioObjective[];
  modifiers: ScenarioModifier[];
  narrativeIntro?: string;
  narrativeOutro?: string;
  badgeId?: string;
  unlockedByDefault?: boolean;
  youWillLearn?: string[];
  complexity?: ContentComplexity;
}

export interface PresetScenario extends ScenarioDefinition {
  badgeId: string;
  unlockedByDefault: boolean;
  author: 'System' | 'Operation10M';
}

export interface ScenarioObjectiveProgress {
  objectiveId: string;
  label: string;
  description: string;
  targetType: ScenarioObjectiveTargetType;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  isPrimary: boolean;
}

export interface ScenarioOutcome {
  isGameOver: boolean;
  isVictory: boolean;
  isDefeat: boolean;
  reason: string;
  objectivesProgress: Record<string, ScenarioObjectiveProgress>;
  allPrimaryCompleted: boolean;
  allOptionalCompleted: boolean;
  completedOnDay: number;
}

export interface GameStateSnapshot {
  day: number;
  regionDeposits?: Record<string, unknown>;
  regionControlStats?: { controlHistory?: unknown[] };
  bankruptcyTracker?: Record<string, number>;
  publicStabilityState?: { nationalStability?: number };
  crisisChainState?: { activeCrisisChains?: Array<{ status: string }> };
  proposals?: Array<{ status: string }>;
  resourcePrices?: Record<string, number>;
}

export interface GameSettingsSnapshot {
  totalDays: number;
}

export interface PlayerSnapshot {
  id?: string;
  money?: number;
  currentRegion?: string;
  visitedRegions?: string[];
  regionalStanding?: Record<string, number>;
  challengeMastery?: Record<string, unknown>;
  challengesCompleted?: string[];
  loans?: unknown[];
  investments?: unknown[];
  sabotageTargetedCount?: number;
}

export interface ScenarioEvalContext {
  player: PlayerSnapshot;
  aiPlayer: PlayerSnapshot;
  gameState: GameStateSnapshot;
  gameSettings: GameSettingsSnapshot;
}

export type O10mChallengeModeId =
  | 'o10m_ap_sprint'
  | 'o10m_ironman'
  | 'o10m_rival_intensity'
  | 'o10m_contract_focus'
  | 'o10m_stability_focus';

export interface O10mChallengeMode {
  id: O10mChallengeModeId;
  title: string;
  description: string;
  /** Base modes this overlay may attach to; empty = all solo/team modes except `single`. */
  compatibleBaseModes: GameModeSelection[];
  incompatibleBaseModes: GameModeSelection[];
  forcedSettingsPatch: Record<string, unknown>;
  modifiers: ScenarioModifier[];
}

export type O10mAltVictoryRuleId =
  | 'o10m_diplomatic_consensus'
  | 'o10m_economic_dominance'
  | 'o10m_speed_primary_clear'
  | 'o10m_optional_perfection';

export interface O10mAltVictoryRule {
  id: O10mAltVictoryRuleId;
  title: string;
  description: string;
  /** Scenario ids this rule applies to; `*` = any O10M scenario. */
  scenarioIds: string[] | '*';
  /** Requires primary objectives incomplete when this alt path triggers. */
  allowsPrimaryIncomplete: boolean;
}

export interface O10mMissionMilestone {
  id: string;
  title: string;
  description: string;
  /** Counted when condition returns true for a run summary. */
  category: 'scenario' | 'challenge' | 'mode' | 'victory';
  badgeId: string;
}

export interface O10mRunSummary {
  baseMode: GameModeSelection;
  scenarioId: string | null;
  challengeModeIds: O10mChallengeModeId[];
  primaryVictory: boolean;
  altVictoryRuleId: O10mAltVictoryRuleId | null;
  day: number;
  playerMoney: number;
  playerNetWorth: number;
  regionsControlled: number;
  maxRegionalStanding: number;
  rivalNetWorth: number;
  optionalObjectivesCompleted: number;
  totalObjectives: number;
  chainCompleted?: boolean;
}

export interface O10mMilestoneProgress {
  milestoneId: string;
  unlocked: boolean;
  unlockedAtRunCount: number;
}

export interface ModeInteractionRequest {
  baseMode: GameModeSelection;
  scenarioId: string | null;
  challengeModeIds: O10mChallengeModeId[];
  scenarioModeEnabled?: boolean;
  sandboxProfileId?: string | null;
  sandboxKnobs?: Partial<Record<O10mSandboxKnobKey, number | string>>;
  chainId?: string | null;
  chainStepIndex?: number;
  chainProgress?: O10mChainProgress | null;
}

export interface ModeInteractionResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  effectiveBaseMode: GameModeSelection;
  forcedSettingsMerge: Record<string, unknown>;
  scenarioStartOverrides?: O10mScenarioStartOverrides;
}

export type O10mSandboxKnobKey =
  | 'economicStartingCashMultiplier'
  | 'totalDaysMultiplier'
  | 'rivalFairnessDelta'
  | 'contractAbundanceOverride'
  | 'crisisIntensityOverride'
  | 'deterministicSeedOffset';

export interface O10mSandboxKnobDefinition {
  key: O10mSandboxKnobKey;
  label: string;
  description: string;
  min?: number;
  max?: number;
  allowedStringValues?: string[];
  defaultValue: number | string;
}

export interface O10mSandboxKnobProfile {
  id: string;
  title: string;
  description: string;
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>;
}

export interface O10mScenarioStartOverrides {
  startingMoneyMultiplier?: number;
  startingStandingDelta?: Record<string, number>;
}

export interface O10mChainCarryBonus {
  startingMoneyDelta?: number;
  standingDelta?: Record<string, number>;
  forcedSettingsPatch?: Record<string, unknown>;
}

export interface O10mScenarioChainStep {
  stepIndex: number;
  scenarioId: string;
  title: string;
  narrativeBridge?: string;
  requiresPrimaryVictory: boolean;
  requiresOptionalCount?: number;
  carryBonusOnComplete?: O10mChainCarryBonus;
}

export interface O10mScenarioChain {
  id: string;
  title: string;
  description: string;
  steps: O10mScenarioChainStep[];
  completionBadgeId: string;
}

export interface O10mChainProgress {
  chainId: string;
  completedStepIndexes: number[];
  activeStepIndex: number;
  accumulatedCarry: O10mChainCarryBonus;
  chainCompleted: boolean;
}

export interface O10mChainAdvanceResult {
  progress: O10mChainProgress;
  advanced: boolean;
  chainCompleted: boolean;
  unlockedNextScenarioId: string | null;
}

export interface O10mPersistedObjectiveRow {
  objectiveId: string;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  lastUpdatedTurn: number;
}

export interface O10mCampaignSlot {
  slotId: string;
  label: string;
  baseMode: GameModeSelection;
  scenarioId: string | null;
  chainId: string | null;
  pinnedAtTurn: number;
}

export interface O10mChallengeStreak {
  current: number;
  best: number;
  lastScenarioId: string | null;
}

/** Schema v5 — ordered scenario rotation for marathon / gauntlet play. */
export interface O10mMarathonQueue {
  queueId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  loopOnComplete: boolean;
  active: boolean;
}

/** Schema v5 — bounded replay statistics per scenario id. */
export interface O10mScenarioReplayRow {
  scenarioId: string;
  playCount: number;
  primaryVictories: number;
  lastPlayedTurn: number;
}

export type O10mCircuitPhase = 'warmup' | 'ascent' | 'summit';

export type O10mExpeditionLeg = 'departure' | 'transit' | 'arrival';

export type O10mOdysseyAct = 'opening' | 'crossing' | 'homecoming';

export type O10mPilgrimageStage = 'setting_out' | 'midway' | 'sanctuary';

export type O10mCaravanLeg = 'assembly' | 'crossing' | 'bazaar';

export type O10mVoyageSegment = 'embark' | 'open_sea' | 'port_call';

export type O10mSiegePhase = 'mustering' | 'breach' | 'relief';

export type O10mConvoyStage = 'staging' | 'transit' | 'delivery';

export type O10mEscortPhase = 'briefing' | 'corridor' | 'handoff';
export type O10mExtractionPhase = 'intel' | 'rescue' | 'exfil';
export type O10mSubjectPhase = 'intake' | 'probe' | 'verdict';
export type O10mWitnessPhase = 'brief' | 'testimony' | 'affirm';
export type O10mTribunalPhase = 'docket' | 'hearing' | 'seal';
export type O10mIndictmentPhase = 'charge' | 'arraign' | 'bind';
export type O10mAppealPhase = 'petition' | 'review' | 'grant';
export type O10mClemencyPhase = 'plea' | 'review' | 'clemency';
export type O10mPardonPhase = 'brief' | 'review' | 'pardon';
export type O10mAmnestyPhase = 'warrant' | 'review' | 'amnesty';
export type O10mReprievePhase = 'filing' | 'review' | 'reprieve';
export type O10mParolePhase = 'intake' | 'review' | 'parole';
export type O10mProbationPhase = 'enrollment' | 'review' | 'probation';
export type O10mCommutationPhase = 'petition' | 'review' | 'commutation';
export type O10mAcquittalPhase = 'brief' | 'review' | 'acquittal';
export type O10mExonerationPhase = 'claim' | 'review' | 'exoneration';
export type O10mExpungementPhase = 'filing' | 'review' | 'expungement';
export type O10mVacaturPhase = 'petition' | 'review' | 'vacatur';
export type O10mRemandPhase = 'order' | 'review' | 'remand';
export type O10mReversalPhase = 'motion' | 'review' | 'reversal';
export type O10mAnnulmentPhase = 'filing' | 'review' | 'annulment';
export type O10mReinstatementPhase = 'filing' | 'review' | 'reinstatement';
export type O10mSetAsidePhase = 'filing' | 'review' | 'setAside';
export type O10mQuashPhase = 'filing' | 'review' | 'quash';
export type O10mSupersedePhase = 'filing' | 'review' | 'supersede';
export type O10mCertiorariPhase = 'filing' | 'review' | 'certiorari';
export type O10mMandamusPhase = 'filing' | 'review' | 'mandamus';
export type O10mProhibitionPhase = 'filing' | 'review' | 'prohibition';
export type O10mHabeasPhase = 'filing' | 'review' | 'habeas';

/** Schema v8 — phased summit circuit with momentum accrual between legs. */
export interface O10mCircuitSession {
  circuitId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  momentumScore: number;
  phaseTag: O10mCircuitPhase;
}

/** Schema v9 — multi-leg expedition with supply accrual between waypoints. */
export interface O10mExpeditionSession {
  expeditionId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  supplyScore: number;
  legTag: O10mExpeditionLeg;
}

/** Schema v10 — multi-act odyssey with renown accrual between chapters. */
export interface O10mOdysseySession {
  odysseyId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  renownScore: number;
  actTag: O10mOdysseyAct;
}

/** Schema v11 — staged pilgrimage with devotion accrual between shrines. */
export interface O10mPilgrimageSession {
  pilgrimageId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  devotionScore: number;
  stageTag: O10mPilgrimageStage;
}

/** Schema v12 — staged trade caravan with cargo accrual between legs. */
export interface O10mCaravanSession {
  caravanId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  cargoScore: number;
  legTag: O10mCaravanLeg;
}

/** Schema v13 — coastal voyage with chart accrual between segments. */
export interface O10mVoyageSession {
  voyageId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  chartScore: number;
  segmentTag: O10mVoyageSegment;
}

/** Schema v14 — staged fortress siege with morale accrual between phases. */
export interface O10mSiegeSession {
  siegeId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  moraleScore: number;
  phaseTag: O10mSiegePhase;
}

/** Schema v15 — overland convoy with haul accrual between stages. */
export interface O10mConvoySession {
  convoyId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  haulScore: number;
  stageTag: O10mConvoyStage;
}

/** Schema v16 — VIP escort with trust accrual between phases. */
export interface O10mEscortSession {
  escortId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  trustScore: number;
  phaseTag: O10mEscortPhase;
}

/** Schema v17 — asset extraction op with asset accrual between phases. */
export interface O10mExtractionSession {
  extractionId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  assetScore: number;
  phaseTag: O10mExtractionPhase;
}

/** Schema v18 — subject investigation arc with fidelity accrual between phases. */
export interface O10mSubjectSession {
  subjectId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  fidelityScore: number;
  phaseTag: O10mSubjectPhase;
}

/** Schema v19 — witness arc with credibility accrual between phases. */
export interface O10mWitnessSession {
  witnessId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  credibilityScore: number;
  phaseTag: O10mWitnessPhase;
}

/** Schema v20 — tribunal arc with gravitas accrual between phases. */
export interface O10mTribunalSession {
  tribunalId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  gravitasScore: number;
  phaseTag: O10mTribunalPhase;
}

/** Schema v21 — indictment arc with case-weight accrual between phases. */
export interface O10mIndictmentSession {
  indictmentId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  caseWeightScore: number;
  phaseTag: O10mIndictmentPhase;
}

/** Schema v22 — appeal arc with merit accrual between phases. */
export interface O10mAppealSession {
  appealId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  meritScore: number;
  phaseTag: O10mAppealPhase;
}

/** Schema v23 — clemency arc with mercy accrual between phases. */
export interface O10mClemencySession {
  clemencyId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  mercyScore: number;
  phaseTag: O10mClemencyPhase;
}

/** Schema v24 — pardon arc with grace accrual between phases. */
export interface O10mPardonSession {
  pardonId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  graceScore: number;
  phaseTag: O10mPardonPhase;
}

/** Schema v25 — amnesty arc with absolution accrual between phases. */
export interface O10mAmnestySession {
  amnestyId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  absolutionScore: number;
  phaseTag: O10mAmnestyPhase;
}

/** Schema v26 — reprieve arc with relief accrual between phases. */
export interface O10mReprieveSession {
  reprieveId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  reliefScore: number;
  phaseTag: O10mReprievePhase;
}

/** Schema v27 — parole arc with trust accrual between phases. */
export interface O10mParoleSession {
  paroleId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  trustScore: number;
  phaseTag: O10mParolePhase;
}

/** Schema v28 — probation arc with compliance accrual between phases. */
export interface O10mProbationSession {
  probationId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  complianceScore: number;
  phaseTag: O10mProbationPhase;
}

/** Schema v29 — commutation arc with leniency accrual between phases. */
export interface O10mCommutationSession {
  commutationId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  leniencyScore: number;
  phaseTag: O10mCommutationPhase;
}

/** Schema v30 — acquittal arc with verdict accrual between phases. */
export interface O10mAcquittalSession {
  acquittalId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  verdictScore: number;
  phaseTag: O10mAcquittalPhase;
}

/** Schema v31 — exoneration arc with restitution accrual between phases. */
export interface O10mExonerationSession {
  exonerationId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  restitutionScore: number;
  phaseTag: O10mExonerationPhase;
}

/** Schema v32 — expungement arc with seal accrual between phases. */
export interface O10mExpungementSession {
  expungementId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  sealScore: number;
  phaseTag: O10mExpungementPhase;
}

/** Schema v33 — vacatur arc with merit accrual between phases. */
export interface O10mVacaturSession {
  vacaturId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  meritScore: number;
  phaseTag: O10mVacaturPhase;
}

/** Schema v34 — remand arc with weight accrual between phases. */
export interface O10mRemandSession {
  remandId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  weightScore: number;
  phaseTag: O10mRemandPhase;
}

/** Schema v35 — reversal arc with score accrual between phases. */
export interface O10mReversalSession {
  reversalId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  reversalScore: number;
  phaseTag: O10mReversalPhase;
}

/** Schema v36 — annulment arc with score accrual between phases. */
export interface O10mAnnulmentSession {
  annulmentId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  annulmentScore: number;
  phaseTag: O10mAnnulmentPhase;
}

/** Schema v37 — reinstatement arc with score accrual between phases. */
export interface O10mReinstatementSession {
  reinstatementId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  reinstatementScore: number;
  phaseTag: O10mReinstatementPhase;
}

/** Schema v38 — set-aside arc with score accrual between phases. */
export interface O10mSetAsideSession {
  setAsideId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  setAsideScore: number;
  phaseTag: O10mSetAsidePhase;
}

/** Schema v39 — quash arc with score accrual between phases. */
export interface O10mQuashSession {
  quashId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  quashScore: number;
  phaseTag: O10mQuashPhase;
}

/** Schema v40 — supersede arc with score accrual between phases. */
export interface O10mSupersedeSession {
  supersedeId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  supersedeScore: number;
  phaseTag: O10mSupersedePhase;
}

/** Schema v41 — certiorari arc with score accrual between phases. */
export interface O10mCertiorariSession {
  certiorariId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  certiorariScore: number;
  phaseTag: O10mCertiorariPhase;
}

/** Schema v42 — mandamus arc with score accrual between phases. */
export interface O10mMandamusSession {
  mandamusId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  mandamusScore: number;
  phaseTag: O10mMandamusPhase;
}

/** Schema v43 — prohibition arc with score accrual between phases. */
export interface O10mProhibitionSession {
  prohibitionId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  prohibitionScore: number;
  phaseTag: O10mProhibitionPhase;
}

/** Schema v44 — habeas arc with score accrual between phases. */
export interface O10mHabeasSession {
  habeasId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  habeasScore: number;
  phaseTag: O10mHabeasPhase;
}

/** Schema v7 — sequential relay with accumulated carry between legs. */
export interface O10mRelaySession {
  relayId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  legCarry: O10mChainCarryBonus;
}

/** Schema v6 — lives-based sequential gauntlet with optional challenge lock-in. */
export interface O10mGauntletSession {
  gauntletId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  livesRemaining: number;
  requiredChallengeId: O10mChallengeModeId | null;
  active: boolean;
  failures: number;
}

export interface O10mCampaignPlan {
  kind:
    | 'habeas_step'
    | 'prohibition_step'
    | 'mandamus_step'
    | 'certiorari_step'
    | 'supersede_step'
    | 'quash_step'
    | 'setaside_step'
    | 'reinstatement_step'
    | 'annulment_step'
    | 'reversal_step'
    | 'remand_step'
    | 'vacatur_step'
    | 'expungement_step'
    | 'exoneration_step'
    | 'acquittal_step'
    | 'commutation_step'
    | 'probation_step'
    | 'parole_step'
    | 'reprieve_step'
    | 'amnesty_step'
    | 'pardon_step'
    | 'clemency_step'
    | 'appeal_step'
    | 'indictment_step'
    | 'tribunal_step'
    | 'witness_step'
    | 'subject_step'
    | 'extraction_step'
    | 'escort_step'
    | 'convoy_step'
    | 'siege_step'
    | 'voyage_step'
    | 'caravan_step'
    | 'pilgrimage_step'
    | 'odyssey_step'
    | 'expedition_step'
    | 'circuit_step'
    | 'relay_step'
    | 'gauntlet_step'
    | 'marathon_step'
    | 'chain_step'
    | 'slot_resume'
    | 'free_play';
  scenarioId: string | null;
  chainId: string | null;
  chainStepIndex: number | null;
  slotId: string | null;
  marathonQueueId: string | null;
  marathonCursor: number | null;
  gauntletId: string | null;
  gauntletCursor: number | null;
  gauntletLives: number | null;
  relayId: string | null;
  relayCursor: number | null;
  relayCarryMoney: number | null;
  circuitId: string | null;
  circuitCursor: number | null;
  circuitPhase: O10mCircuitPhase | null;
  circuitMomentum: number | null;
  expeditionId: string | null;
  expeditionCursor: number | null;
  expeditionLeg: O10mExpeditionLeg | null;
  expeditionSupply: number | null;
  odysseyId: string | null;
  odysseyCursor: number | null;
  odysseyAct: O10mOdysseyAct | null;
  odysseyRenown: number | null;
  pilgrimageId: string | null;
  pilgrimageCursor: number | null;
  pilgrimageStage: O10mPilgrimageStage | null;
  pilgrimageDevotion: number | null;
  caravanId: string | null;
  caravanCursor: number | null;
  caravanLeg: O10mCaravanLeg | null;
  caravanCargo: number | null;
  voyageId: string | null;
  voyageCursor: number | null;
  voyageSegment: O10mVoyageSegment | null;
  voyageChart: number | null;
  siegeId: string | null;
  siegeCursor: number | null;
  siegePhase: O10mSiegePhase | null;
  siegeMorale: number | null;
  convoyId: string | null;
  convoyCursor: number | null;
  convoyStage: O10mConvoyStage | null;
  convoyHaul: number | null;
  escortId: string | null;
  escortCursor: number | null;
  escortPhase: O10mEscortPhase | null;
  escortTrust: number | null;
  extractionId: string | null;
  extractionCursor: number | null;
  extractionPhase: O10mExtractionPhase | null;
  extractionAssets: number | null;
  subjectId: string | null;
  subjectCursor: number | null;
  subjectPhase: O10mSubjectPhase | null;
  subjectFidelity: number | null;
  witnessId: string | null;
  witnessCursor: number | null;
  witnessPhase: O10mWitnessPhase | null;
  witnessCredibility: number | null;
  tribunalId: string | null;
  tribunalCursor: number | null;
  tribunalPhase: O10mTribunalPhase | null;
  tribunalGravitas: number | null;
  indictmentId: string | null;
  indictmentCursor: number | null;
  indictmentPhase: O10mIndictmentPhase | null;
  indictmentCaseWeight: number | null;
  appealId: string | null;
  appealCursor: number | null;
  appealPhase: O10mAppealPhase | null;
  appealMerit: number | null;
  clemencyId: string | null;
  clemencyCursor: number | null;
  clemencyPhase: O10mClemencyPhase | null;
  clemencyMercy: number | null;
  pardonId: string | null;
  pardonCursor: number | null;
  pardonPhase: O10mPardonPhase | null;
  pardonGrace: number | null;
  amnestyId: string | null;
  amnestyCursor: number | null;
  amnestyPhase: O10mAmnestyPhase | null;
  amnestyAbsolution: number | null;
  reprieveId: string | null;
  reprieveCursor: number | null;
  reprievePhase: O10mReprievePhase | null;
  reprieveRelief: number | null;
  paroleId: string | null;
  paroleCursor: number | null;
  parolePhase: O10mParolePhase | null;
  paroleTrust: number | null;
  probationId: string | null;
  probationCursor: number | null;
  probationPhase: O10mProbationPhase | null;
  probationCompliance: number | null;
  commutationId: string | null;
  commutationCursor: number | null;
  commutationPhase: O10mCommutationPhase | null;
  commutationLeniency: number | null;
  acquittalId: string | null;
  acquittalCursor: number | null;
  acquittalPhase: O10mAcquittalPhase | null;
  acquittalVerdict: number | null;
  exonerationId: string | null;
  exonerationCursor: number | null;
  exonerationPhase: O10mExonerationPhase | null;
  exonerationRestitution: number | null;
  expungementId: string | null;
  expungementCursor: number | null;
  expungementPhase: O10mExpungementPhase | null;
  expungementSeal: number | null;
  vacaturId: string | null;
  vacaturCursor: number | null;
  vacaturPhase: O10mVacaturPhase | null;
  vacaturMerit: number | null;
  remandId: string | null;
  remandCursor: number | null;
  remandPhase: O10mRemandPhase | null;
  remandWeight: number | null;
  reversalId: string | null;
  reversalCursor: number | null;
  reversalPhase: O10mReversalPhase | null;
  reversalScore: number | null;
  annulmentId: string | null;
  annulmentCursor: number | null;
  annulmentPhase: O10mAnnulmentPhase | null;
  annulmentScore: number | null;
  reinstatementId: string | null;
  reinstatementCursor: number | null;
  reinstatementPhase: O10mReinstatementPhase | null;
  reinstatementScore: number | null;
  setAsideId: string | null;
  setAsideCursor: number | null;
  setAsidePhase: O10mSetAsidePhase | null;
  setAsideScore: number | null;
  quashId: string | null;
  quashCursor: number | null;
  quashPhase: O10mQuashPhase | null;
  quashScore: number | null;
  supersedeId: string | null;
  supersedeCursor: number | null;
  supersedePhase: O10mSupersedePhase | null;
  supersedeScore: number | null;
  certiorariId: string | null;
  certiorariCursor: number | null;
  certiorariPhase: O10mCertiorariPhase | null;
  certiorariScore: number | null;
  mandamusId: string | null;
  mandamusCursor: number | null;
  mandamusPhase: O10mMandamusPhase | null;
  mandamusScore: number | null;
  prohibitionId: string | null;
  prohibitionCursor: number | null;
  prohibitionPhase: O10mProhibitionPhase | null;
  prohibitionScore: number | null;
  habeasId: string | null;
  habeasCursor: number | null;
  habeasPhase: O10mHabeasPhase | null;
  habeasScore: number | null;
  reason: string;
}

/** Persisted under `gameState.o10mModesProgress` after assembly. */
export interface O10mModesPersistedState {
  schemaVersion: number;
  updatedAtTurn: number;
  updatedAtDay?: number;
  saveKind?: O10mModesSaveKind;
  sessionId?: string;
  integrityFingerprint?: string;
  baseMode: GameModeSelection;
  scenarioId: string | null;
  chainProgress: O10mChainProgress | null;
  challengeModeIds: O10mChallengeModeId[];
  sandboxProfileId: string | null;
  sandboxKnobs: Partial<Record<O10mSandboxKnobKey, number | string>>;
  milestones: O10mMilestoneProgress[];
  completedChainIds: string[];
  recentRuns: O10mPersistedRunRecord[];
  /** Schema v4 — mid-run objective checkpoints for save/resume. */
  objectiveProgress?: O10mPersistedObjectiveRow[];
  /** Schema v4 — bookmarked mode/scenario combinations (max 4). */
  campaignSlots?: O10mCampaignSlot[];
  activeCampaignSlotId?: string | null;
  /** Schema v4 — consecutive primary-victory streak on challenge overlays. */
  challengeStreak?: O10mChallengeStreak;
  /** Schema v5 — active marathon rotation queue. */
  marathonQueue?: O10mMarathonQueue | null;
  /** Schema v5 — replay counts for scenario selection UX. */
  replayLedger?: O10mScenarioReplayRow[];
  /** Schema v6 — active gauntlet rotation (mutually exclusive with marathon queue). */
  gauntletSession?: O10mGauntletSession | null;
  /** Schema v6 — catalog unlock tokens earned from gauntlet completion. */
  catalogUnlockTokens?: string[];
  /** Schema v7 — active relay convoy (mutually exclusive with marathon / gauntlet). */
  relaySession?: O10mRelaySession | null;
  /** Schema v8 — active summit circuit (mutually exclusive with marathon / gauntlet / relay). */
  circuitSession?: O10mCircuitSession | null;
  /** Schema v9 — active expedition route (mutually exclusive with circuit / relay / gauntlet / marathon). */
  expeditionSession?: O10mExpeditionSession | null;
  /** Schema v10 — active odyssey arc (mutually exclusive with expedition / circuit / relay / gauntlet / marathon). */
  odysseySession?: O10mOdysseySession | null;
  /** Schema v11 — active pilgrimage route (mutually exclusive with odyssey / expedition / circuit / relay / gauntlet / marathon). */
  pilgrimageSession?: O10mPilgrimageSession | null;
  /** Schema v12 — active trade caravan (mutually exclusive with pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  caravanSession?: O10mCaravanSession | null;
  /** Schema v13 — active coastal voyage (mutually exclusive with caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  voyageSession?: O10mVoyageSession | null;
  /** Schema v14 — active fortress siege (mutually exclusive with voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  siegeSession?: O10mSiegeSession | null;
  /** Schema v15 — active overland convoy (mutually exclusive with siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  convoySession?: O10mConvoySession | null;
  /** Schema v16 — active VIP escort (mutually exclusive with convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  escortSession?: O10mEscortSession | null;
  /** Schema v17 — active extraction op (mutually exclusive with escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  extractionSession?: O10mExtractionSession | null;
  /** Schema v18 — active subject investigation (mutually exclusive with extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  subjectSession?: O10mSubjectSession | null;
  /** Schema v19 — active witness arc (mutually exclusive with subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  witnessSession?: O10mWitnessSession | null;
  /** Schema v20 — active tribunal arc (mutually exclusive with witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  tribunalSession?: O10mTribunalSession | null;
  /** Schema v21 — active indictment arc (mutually exclusive with tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  indictmentSession?: O10mIndictmentSession | null;
  /** Schema v22 — active appeal arc (mutually exclusive with indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  appealSession?: O10mAppealSession | null;
  /** Schema v23 — active clemency arc (mutually exclusive with appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  clemencySession?: O10mClemencySession | null;
  /** Schema v24 — active pardon arc (mutually exclusive with clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  pardonSession?: O10mPardonSession | null;
  /** Schema v25 — active amnesty arc (mutually exclusive with pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  amnestySession?: O10mAmnestySession | null;
  /** Schema v26 — active reprieve arc (mutually exclusive with amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  reprieveSession?: O10mReprieveSession | null;
  /** Schema v27 — active parole arc (mutually exclusive with probation / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  paroleSession?: O10mParoleSession | null;
  /** Schema v28 — active probation arc (mutually exclusive with commutation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  probationSession?: O10mProbationSession | null;
  /** Schema v29 — active commutation arc (mutually exclusive with acquittal / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  commutationSession?: O10mCommutationSession | null;
  /** Schema v30 — active acquittal arc (mutually exclusive with exoneration / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  acquittalSession?: O10mAcquittalSession | null;
  /** Schema v31 — active exoneration arc (mutually exclusive with expungement / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  exonerationSession?: O10mExonerationSession | null;
  /** Schema v32 — active expungement arc (mutually exclusive with vacatur / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  expungementSession?: O10mExpungementSession | null;
  /** Schema v33 — active vacatur arc (mutually exclusive with remand / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  vacaturSession?: O10mVacaturSession | null;
  /** Schema v34 — active remand arc (mutually exclusive with reversal / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  remandSession?: O10mRemandSession | null;
  /** Schema v35 — active reversal arc (mutually exclusive with annulment / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  reversalSession?: O10mReversalSession | null;
  /** Schema v36 — active annulment arc (mutually exclusive with set-aside / reinstatement / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  annulmentSession?: O10mAnnulmentSession | null;
  /** Schema v37 — active reinstatement arc (mutually exclusive with set-aside / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  reinstatementSession?: O10mReinstatementSession | null;
  /** Schema v38 — active set-aside arc (mutually exclusive with quash / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  setAsideSession?: O10mSetAsideSession | null;
  /** Schema v39 — active quash arc (mutually exclusive with supersede / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  quashSession?: O10mQuashSession | null;
  /** Schema v40 — active supersede arc (mutually exclusive with certiorari / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  supersedeSession?: O10mSupersedeSession | null;
  /** Schema v41 — active certiorari arc (mutually exclusive with mandamus / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  certiorariSession?: O10mCertiorariSession | null;
  /** Schema v42 — active mandamus arc (mutually exclusive with prohibition / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  mandamusSession?: O10mMandamusSession | null;
  /** Schema v43 — active prohibition arc (mutually exclusive with habeas / mandamus / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  prohibitionSession?: O10mProhibitionSession | null;
  /** Schema v44 — active habeas arc (mutually exclusive with prohibition / mandamus / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  habeasSession?: O10mHabeasSession | null;
}

export type O10mModesSaveKind = 'autosave' | 'manual' | 'checkpoint';

export interface O10mModesReconcileContext {
  turn: number;
  day: number;
  liveBaseMode?: GameModeSelection | null;
  liveScenarioId?: string | null;
}

export interface O10mModesMergeResult {
  merged: O10mModesPersistedState;
  warnings: string[];
}

export interface O10mModesPersistedDiff {
  changedFields: string[];
}

export interface O10mPersistedRunRecord {
  scenarioId: string;
  baseMode: GameModeSelection;
  primaryVictory: boolean;
  chainCompleted: boolean;
  day: number;
  recordedAtTurn: number;
}

export interface O10mSaveFormatValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
}
