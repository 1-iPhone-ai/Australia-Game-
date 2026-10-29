// OP10M_MODULE_BEGIN agent-04-modes-scenarios
// Operation 10M — Agent 04 modes / missions / scenarios (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-04-modes-scenarios/src/ — regenerate via npm run bundle:agent-04-chunk
// --- bundled from src/types.ts ---
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
export type O10mQuowarrantoPhase = 'filing' | 'review' | 'quowarranto';
export type O10mInjunctionPhase = 'filing' | 'review' | 'injunction';

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

/** Schema v45 — quo warranto arc with score accrual between phases. */
export interface O10mQuowarrantoSession {
  quowarrantoId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  quowarrantoScore: number;
  phaseTag: O10mQuowarrantoPhase;
}

/** Schema v46 — injunction arc with score accrual between phases. */
export interface O10mInjunctionSession {
  injunctionId: string;
  label: string;
  scenarioIds: string[];
  cursor: number;
  active: boolean;
  injunctionScore: number;
  phaseTag: O10mInjunctionPhase;
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
    | 'injunction_step'
    | 'quowarranto_step'
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
  quowarrantoId: string | null;
  quowarrantoCursor: number | null;
  quowarrantoPhase: O10mQuowarrantoPhase | null;
  quowarrantoScore: number | null;
  injunctionId: string | null;
  injunctionCursor: number | null;
  injunctionPhase: O10mInjunctionPhase | null;
  injunctionScore: number | null;
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
  /** Schema v44 — active habeas arc (mutually exclusive with quowarranto / prohibition / mandamus / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  habeasSession?: O10mHabeasSession | null;
  /** Schema v45 — active quo warranto arc (mutually exclusive with injunction / habeas / prohibition / mandamus / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  quowarrantoSession?: O10mQuowarrantoSession | null;
  /** Schema v46 — active injunction arc (mutually exclusive with quowarranto / habeas / prohibition / mandamus / certiorari / supersede / quash / set-aside / reinstatement / annulment / reversal / remand / vacatur / expungement / exoneration / acquittal / commutation / probation / parole / reprieve / amnesty / pardon / clemency / appeal / indictment / tribunal / witness / subject / extraction / escort / convoy / siege / voyage / caravan / pilgrimage / odyssey / expedition / circuit / relay / gauntlet / marathon). */
  injunctionSession?: O10mInjunctionSession | null;
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

// --- bundled from src/canonical-modes.ts ---
/** Canonical `GameModeSelection` values — must stay in sync with V9.4. */
export const CANONICAL_GAME_MODE_SELECTIONS: readonly GameModeSelection[] = [
  'single',
  'ai',
  'grand_tour',
  'team_human_ai_vs_ai_ai',
  'team_ai_vs_ai',
  'scenario',
] as const;

export function isCanonicalGameModeSelection(value: unknown): value is GameModeSelection {
  return typeof value === 'string' && (CANONICAL_GAME_MODE_SELECTIONS as readonly string[]).includes(value);
}

/** Solo modes that drive a single human vs rival loop (matches `isSoloRivalModeSelection`). */
export const SOLO_RIVAL_MODES: readonly GameModeSelection[] = ['ai', 'grand_tour', 'scenario'] as const;

export function isSoloRivalMode(value: unknown): boolean {
  return typeof value === 'string' && (SOLO_RIVAL_MODES as readonly string[]).includes(value);
}

export function assertCanonicalModesPreserved(candidate: readonly string[]): string[] {
  const missing = CANONICAL_GAME_MODE_SELECTIONS.filter(m => !candidate.includes(m));
  return missing.map(m => `Missing canonical mode: ${m}`);
}

// --- bundled from src/objective-evaluator.ts ---
const BANKRUPTCY_THRESHOLD = 0;
const BANKRUPTCY_STREAK_DAYS = 3;

function regionsControlled(player: PlayerSnapshot, gameState: ScenarioEvalContext['gameState']): number {
  const history = gameState.regionControlStats?.controlHistory;
  if (Array.isArray(history) && history.length > 0) {
    return history.length;
  }
  const deposits = gameState.regionDeposits;
  if (deposits && typeof deposits === 'object') {
    return Object.keys(deposits).length;
  }
  return player.visitedRegions?.length ?? 0;
}

export function evaluateScenarioObjectiveProgress(
  objective: ScenarioObjective,
  context: ScenarioEvalContext,
): ScenarioObjectiveProgress {
  const { player, aiPlayer, gameState } = context;
  let currentValue = 0;
  const isPrimary = objective.isPrimary ?? true;

  switch (objective.targetType) {
    case 'money':
    case 'money_accumulated':
      currentValue = player.money ?? 0;
      break;
    case 'regions':
    case 'regions_controlled':
      currentValue = regionsControlled(player, gameState);
      break;
    case 'netWorth':
      currentValue =
        (player.money ?? 0) +
        (player.investments?.length ?? 0) * 1000 +
        regionsControlled(player, gameState) * 500;
      break;
    case 'daysPassed':
    case 'turns_survived':
      currentValue = gameState.day ?? 1;
      break;
    case 'standing_reached':
    case 'regionalStanding': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? Math.max(...vals) : 0;
      break;
    }
    case 'multi_actor_standing_avg': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      break;
    }
    case 'ai_eliminated': {
      const aiMoney = aiPlayer.money ?? 0;
      const streak = gameState.bankruptcyTracker?.ai ?? 0;
      currentValue = aiMoney < BANKRUPTCY_THRESHOLD && streak >= BANKRUPTCY_STREAK_DAYS ? 1 : 0;
      break;
    }
    case 'challenges':
    case 'challenges_completed':
      currentValue = Math.max(
        Object.keys(player.challengeMastery || {}).length,
        player.challengesCompleted?.length ?? 0,
      );
      break;
    case 'public_stability':
      currentValue = gameState.publicStabilityState?.nationalStability ?? 100;
      break;
    case 'crisis_resolved':
      currentValue = (gameState.crisisChainState?.activeCrisisChains || []).filter(c => c.status === 'resolved')
        .length;
      break;
    case 'debt_cleared':
      currentValue = (player.loans || []).length === 0 ? 1 : 0;
      break;
    case 'investments_count':
      currentValue = player.investments?.length ?? 0;
      break;
    case 'standing_threshold': {
      const vals = Object.values(player.regionalStanding || {}) as number[];
      currentValue = vals.length ? Math.max(...vals) : 0;
      break;
    }
    case 'specific_region_controlled': {
      const target = objective.targetRegionId || 'QLD';
      currentValue = player.currentRegion === target ? 1 : 0;
      break;
    }
    case 'zero_sabotage_taken':
      currentValue = (player.sabotageTargetedCount ?? 0) === 0 ? 1 : 0;
      break;
    case 'governance_proposals_passed':
      currentValue = (gameState.proposals || []).filter(p => p.status === 'passed').length;
      break;
    default:
      currentValue = 0;
  }

  const completed = currentValue >= objective.targetValue;
  return {
    objectiveId: objective.id,
    label: objective.label,
    description: objective.description,
    targetType: objective.targetType,
    currentValue,
    targetValue: objective.targetValue,
    completed,
    isPrimary,
  };
}

export { BANKRUPTCY_STREAK_DAYS, BANKRUPTCY_THRESHOLD };

// --- bundled from src/scenarios/o10m-presets.ts ---
const deterministic = (seed: number) => ({
  deterministicRngActive: true,
  aiDeterministic: true,
  aiDeterministicSeed: seed,
  worldRngMode: 'deterministic',
  worldRngSeed: seed,
  scenarioEngineV73Enabled: true,
});

export const O10M_OPERATION_SCENARIOS: PresetScenario[] = [
  {
    id: 'o10m_cyclone_corridor',
    title: 'Cyclone Corridor',
    description:
      'Northern Queensland and the Top End face back-to-back cyclone seasons. Stabilize ports, keep public order, and grow net worth before the window closes.',
    category: 'challenge',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100401,
    startingMoney: 2200,
    startingRegions: ['QLD', 'NT'],
    badgeId: 'badge_o10m_cyclone_corridor',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100401),
      dynamicCrisisChainsEnabled: true,
      publicStabilityEnabled: true,
      regionalContractsEnabled: true,
      v93RegionalOpening: 'resource_cycle',
      v93CrisisIntensity: 'high',
      v93ContentThemes: ['logistics', 'governance'],
      totalDays: 28,
    },
    objectives: [
      {
        id: 'o10m_cc_obj_primary_stability',
        label: 'Hold the Line',
        description: 'Maintain national public stability at or above 65',
        targetType: 'public_stability',
        targetValue: 65,
        isPrimary: true,
      },
      {
        id: 'o10m_cc_obj_primary_worth',
        label: 'Relief Treasury',
        description: 'Reach $22,000 net worth',
        targetType: 'netWorth',
        targetValue: 22000,
        isPrimary: true,
      },
      {
        id: 'o10m_cc_obj_optional_crisis',
        label: 'Chain Breaker',
        description: 'Resolve 2 active crisis chains',
        targetType: 'crisis_resolved',
        targetValue: 2,
        isPrimary: false,
      },
    ],
    modifiers: [
      {
        id: 'o10m_cc_mod_stability_pressure',
        name: 'Cyclone Pressure',
        description: 'Stability decays faster during contract droughts.',
        domain: 'stability',
        targetKey: 'publicStabilityDecayMultiplier',
        value: 1.15,
        isGlobal: true,
      },
    ],
    youWillLearn: ['Crisis chains', 'Public stability', 'Contract timing'],
    narrativeIntro: 'Satellite images show a stacked cyclone season bearing down on the northern corridor.',
    narrativeOutro: 'The ports stayed open and the treasury survived the storm seasons.',
  },
  {
    id: 'o10m_silent_diplomat',
    title: 'Silent Diplomat',
    description:
      'Direct sabotage is off the table. Win through standing, governance, and patience while rivals burn goodwill.',
    category: 'experimental',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100402,
    startingMoney: 3500,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_silent_diplomat',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100402),
      sabotageEnabled: false,
      regionalStandingEnabled: true,
      governanceControlSurfaceEnabled: true,
      regionalContractsEnabled: true,
      v93ContentThemes: ['governance', 'finance'],
    },
    objectives: [
      {
        id: 'o10m_sd_obj_standing',
        label: 'Trusted Broker',
        description: 'Reach regional standing of 72 in any state',
        targetType: 'regionalStanding',
        targetValue: 72,
        isPrimary: true,
      },
      {
        id: 'o10m_sd_obj_governance',
        label: 'Parliamentary Record',
        description: 'Pass 2 governance proposals',
        targetType: 'governance_proposals_passed',
        targetValue: 2,
        isPrimary: true,
      },
      {
        id: 'o10m_sd_obj_no_sabotage',
        label: 'Clean Hands',
        description: 'Take zero sabotage hits',
        targetType: 'zero_sabotage_taken',
        targetValue: 1,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Standing', 'Governance', 'Non-aggressive play'],
  },
  {
    id: 'o10m_tas_battery_rush',
    title: 'Tasmanian Battery Rush',
    description:
      'Tasmania and Victoria compete for storage and grid contracts. Stack investments before the rival undercuts your pipeline.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100403,
    startingMoney: 4200,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_tas_battery_rush',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100403),
      investmentsEnabled: true,
      regionalContractsEnabled: true,
      v93ContentThemes: ['energy', 'technology'],
      v93ContractAbundance: 'normal',
    },
    objectives: [
      {
        id: 'o10m_tbr_obj_invest',
        label: 'Storage Portfolio',
        description: 'Complete 3 investments',
        targetType: 'investments_count',
        targetValue: 3,
        isPrimary: true,
      },
      {
        id: 'o10m_tbr_obj_worth',
        label: 'Grid Capital',
        description: 'Reach $28,000 net worth',
        targetType: 'netWorth',
        targetValue: 28000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Investments', 'Regional contracts', 'Energy timing'],
  },
  {
    id: 'o10m_wheatbelt_squeeze',
    title: 'Wheatbelt Squeeze',
    description:
      'SA and NSW agricultural heartland runs hot on contracts but thin on cash. Clear debt while holding regional map pressure.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100404,
    startingMoney: 1100,
    startingRegions: ['SA'],
    startingLoans: [
      { id: 'o10m_wheat_debt_a', amount: 800, interestRate: 0.22, termDays: 14 },
      { id: 'o10m_wheat_debt_b', amount: 600, interestRate: 0.18, termDays: 18 },
    ],
    badgeId: 'badge_o10m_wheatbelt_squeeze',
    unlockedByDefault: false,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100404),
      advancedLoansEnabled: true,
      regionalContractsEnabled: true,
      v93RegionalOpening: 'great_drought',
      v93CrisisIntensity: 'normal',
    },
    objectives: [
      {
        id: 'o10m_ws_obj_debt',
        label: 'Debt Free Belt',
        description: 'Clear all starting debt',
        targetType: 'debt_cleared',
        targetValue: 1,
        isPrimary: true,
      },
      {
        id: 'o10m_ws_obj_regions',
        label: 'Breadbasket Control',
        description: 'Control 3 regions',
        targetType: 'regions',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Loans', 'Map control under liquidity stress'],
  },
  {
    id: 'o10m_grand_tour_prologue',
    title: 'Grand Tour Prologue',
    description:
      'A shortened grand-tour style opener: complete regional challenges quickly while building mastery streaks.',
    category: 'beginner',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100405,
    startingMoney: 5000,
    startingRegions: ['NSW'],
    badgeId: 'badge_o10m_grand_tour_prologue',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100405),
      equipmentShopEnabled: true,
      actionLimitsEnabled: true,
      totalDays: 20,
    },
    objectives: [
      {
        id: 'o10m_gtp_obj_challenges',
        label: 'Tour Warmup',
        description: 'Complete 4 regional challenges',
        targetType: 'challenges_completed',
        targetValue: 4,
        isPrimary: true,
      },
      {
        id: 'o10m_gtp_obj_cash',
        label: 'Tour Float',
        description: 'Hold $8,000 cash',
        targetType: 'money',
        targetValue: 8000,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Challenges', 'Mastery', 'Grand tour pacing'],
  },
  {
    id: 'o10m_team_ledger',
    title: 'Team Ledger',
    description:
      'Human-AI co-pilot team start in WA with standing spread across actors — built for team_human_ai_vs_ai_ai integration tests.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100406,
    startingMoney: 2800,
    startingRegions: ['WA'],
    startingStanding: { WA: 45, SA: 20 },
    badgeId: 'badge_o10m_team_ledger',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100406),
      regionalStandingEnabled: true,
      teamBrainEnabled: true,
      regionalContractsEnabled: true,
    },
    objectives: [
      {
        id: 'o10m_tl_obj_avg_standing',
        label: 'Coalition Average',
        description: 'Reach average regional standing of 55',
        targetType: 'multi_actor_standing_avg',
        targetValue: 55,
        isPrimary: true,
      },
      {
        id: 'o10m_tl_obj_worth',
        label: 'Shared Balance Sheet',
        description: 'Reach $18,000 net worth',
        targetType: 'netWorth',
        targetValue: 18000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Team modes', 'Standing averages', 'Co-pilot pacing'],
  },
  {
    id: 'o10m_rival_elimination_classic',
    title: 'Rival Elimination Classic',
    description: 'Classic hostile scenario: bankrupt the rival before day 25 while holding QLD.',
    category: 'expert',
    difficulty: 'Expert',
    complexity: 'Advanced',
    forcedSeed: 100407,
    startingMoney: 4500,
    startingRegions: ['QLD'],
    badgeId: 'badge_o10m_rival_elimination_classic',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100407),
      sabotageEnabled: true,
      aiFairnessLevel: 0.88,
      totalDays: 25,
    },
    objectives: [
      {
        id: 'o10m_rec_obj_eliminate',
        label: 'Rival Out',
        description: 'Eliminate the rival via bankruptcy streak',
        targetType: 'ai_eliminated',
        targetValue: 1,
        isPrimary: true,
      },
      {
        id: 'o10m_rec_obj_qld',
        label: 'Sunshine Hold',
        description: 'Control Queensland',
        targetType: 'specific_region_controlled',
        targetValue: 1,
        targetRegionId: 'QLD',
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Rival pressure', 'Bankruptcy timing', 'Regional anchors'],
  },
  {
    id: 'o10m_export_clock',
    title: 'Export Clock',
    description:
      'Abundant contracts but a hard day limit — accumulate cash through trade windows without overextending on map control.',
    category: 'experimental',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100408,
    startingMoney: 1600,
    startingRegions: ['QLD', 'WA'],
    badgeId: 'badge_o10m_export_clock',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100408),
      regionalContractsEnabled: true,
      v93ContractAbundance: 'abundant',
      v93ContentThemes: ['trade', 'logistics'],
      totalDays: 18,
    },
    objectives: [
      {
        id: 'o10m_ec_obj_money',
        label: 'Export Chest',
        description: 'Accumulate $14,000 cash',
        targetType: 'money_accumulated',
        targetValue: 14000,
        isPrimary: true,
      },
      {
        id: 'o10m_ec_obj_days',
        label: 'Beat the Clock',
        description: 'Complete primary goals before day 16',
        targetType: 'daysPassed',
        targetValue: 16,
        isPrimary: false,
        timeLimitDays: 16,
      },
    ],
    modifiers: [],
    youWillLearn: ['Trade windows', 'Time limits', 'Liquidity'],
  },
  {
    id: 'o10m_outback_relay',
    title: 'Outback Relay',
    description:
      'Link NT and SA with freight contracts under extreme travel costs — mastery of logistics beats raw expansion.',
    category: 'challenge',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100409,
    startingMoney: 1900,
    startingRegions: ['NT', 'SA'],
    badgeId: 'badge_o10m_outback_relay',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100409),
      regionalContractsEnabled: true,
      equipmentShopEnabled: true,
      actionLimitsEnabled: true,
      v93ContentThemes: ['logistics', 'trade'],
      totalDays: 22,
    },
    objectives: [
      {
        id: 'o10m_or_obj_challenges',
        label: 'Relay Legs',
        description: 'Complete 5 regional challenges',
        targetType: 'challenges_completed',
        targetValue: 5,
        isPrimary: true,
      },
      {
        id: 'o10m_or_obj_regions',
        label: 'Red Center Link',
        description: 'Control 3 regions',
        targetType: 'regions',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Travel', 'Challenge chains', 'Outback logistics'],
  },
  {
    id: 'o10m_capital_markets_week',
    title: 'Capital Markets Week',
    description:
      'ACT policy window plus NSW liquidity — pass governance while growing investments before the week ends.',
    category: 'experimental',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100410,
    startingMoney: 3200,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_capital_markets_week',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100410),
      investmentsEnabled: true,
      governanceControlSurfaceEnabled: true,
      regionalContractsEnabled: true,
      totalDays: 12,
      v93ContentThemes: ['finance', 'governance'],
    },
    objectives: [
      {
        id: 'o10m_cmw_obj_invest',
        label: 'Market Positions',
        description: 'Hold 2 active investments',
        targetType: 'investments_count',
        targetValue: 2,
        isPrimary: true,
      },
      {
        id: 'o10m_cmw_obj_gov',
        label: 'Policy Window',
        description: 'Pass 1 governance proposal',
        targetType: 'governance_proposals_passed',
        targetValue: 1,
        isPrimary: true,
      },
      {
        id: 'o10m_cmw_obj_worth',
        label: 'Capital Stack',
        description: 'Reach $16,000 net worth',
        targetType: 'netWorth',
        targetValue: 16000,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Investments', 'Governance windows', 'Short horizons'],
  },
  {
    id: 'o10m_island_supply_line',
    title: 'Island Supply Line',
    description:
      'Tasmania depends on fragile supply lines — stability and standing matter more than mainland map rush.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100411,
    startingMoney: 2400,
    startingRegions: ['TAS'],
    badgeId: 'badge_o10m_island_supply_line',
    unlockedByDefault: false,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100411),
      publicStabilityEnabled: true,
      regionalStandingEnabled: true,
      dynamicCrisisChainsEnabled: true,
      v93ContentThemes: ['logistics', 'governance'],
    },
    objectives: [
      {
        id: 'o10m_isl_obj_stability',
        label: 'Island Calm',
        description: 'Maintain public stability at or above 60',
        targetType: 'public_stability',
        targetValue: 60,
        isPrimary: true,
      },
      {
        id: 'o10m_isl_obj_standing',
        label: 'Local Trust',
        description: 'Reach regional standing of 65',
        targetType: 'regionalStanding',
        targetValue: 65,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Island logistics', 'Stability', 'Standing'],
  },
  {
    id: 'o10m_autoplay_observatory',
    title: 'Autoplay Observatory',
    description:
      'Structured scenario for team_ai_vs_ai observation: contracts and standing averages without human co-pilot actions.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100412,
    startingMoney: 5000,
    startingRegions: ['VIC'],
    badgeId: 'badge_o10m_autoplay_observatory',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100412),
      regionalContractsEnabled: true,
      sabotageEnabled: false,
      teamBrainEnabled: true,
      o10mAutoplayObservatoryScenario: true,
      totalDays: 15,
    },
    objectives: [
      {
        id: 'o10m_ao_obj_avg',
        label: 'Observed Equilibrium',
        description: 'Reach average regional standing of 50',
        targetType: 'multi_actor_standing_avg',
        targetValue: 50,
        isPrimary: true,
      },
      {
        id: 'o10m_ao_obj_survive',
        label: 'Observation Window',
        description: 'Survive to day 12',
        targetType: 'daysPassed',
        targetValue: 12,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['AI vs AI modes', 'Standing averages', 'Contract pacing'],
  },
  {
    id: 'o10m_continuity_drill',
    title: 'Continuity Drill',
    description:
      'Short scenario designed to validate save/load of chain progress, milestones, and sandbox profile selection mid-campaign.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100413,
    startingMoney: 2800,
    startingRegions: ['ACT'],
    badgeId: 'badge_o10m_continuity_drill',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100413),
      scenarioEngineV73Enabled: true,
      o10mContinuityDrillScenario: true,
      totalDays: 10,
    },
    objectives: [
      {
        id: 'o10m_cd_obj_survive',
        label: 'Checkpoint',
        description: 'Reach day 5',
        targetType: 'daysPassed',
        targetValue: 5,
        isPrimary: true,
      },
      {
        id: 'o10m_cd_obj_money',
        label: 'Float',
        description: 'Hold $4,000 cash',
        targetType: 'money',
        targetValue: 4000,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Save continuity', 'Scenario checkpoints', 'Campaign pacing'],
  },
  {
    id: 'o10m_federation_standing',
    title: 'Federation Standing',
    description:
      'Multi-region standing average under governance pressure — intended for coalition and save-format milestone tracking.',
    category: 'challenge',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100414,
    startingMoney: 2600,
    startingRegions: ['NSW', 'VIC', 'SA'],
    startingStanding: { NSW: 40, VIC: 38, SA: 35 },
    badgeId: 'badge_o10m_federation_standing',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100414),
      regionalStandingEnabled: true,
      governanceControlSurfaceEnabled: true,
      publicStabilityEnabled: true,
      totalDays: 24,
    },
    objectives: [
      {
        id: 'o10m_fs_obj_avg',
        label: 'Federation Trust',
        description: 'Average regional standing of 58',
        targetType: 'multi_actor_standing_avg',
        targetValue: 58,
        isPrimary: true,
      },
      {
        id: 'o10m_fs_obj_gov',
        label: 'Intergovernmental Accord',
        description: 'Pass 2 governance proposals',
        targetType: 'governance_proposals_passed',
        targetValue: 2,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Multi-region standing', 'Governance', 'Persisted milestones'],
  },
  {
    id: 'o10m_slot_rotation_lab',
    title: 'Slot Rotation Lab',
    description:
      'Micro scenario for validating campaign slot bookmarks and objective checkpoint capture across quick save/load cycles.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100415,
    startingMoney: 2200,
    startingRegions: ['VIC'],
    badgeId: 'badge_o10m_slot_rotation_lab',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100415),
      scenarioEngineV73Enabled: true,
      o10mSlotRotationLab: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_srl_obj_day',
        label: 'Rotation Window',
        description: 'Reach day 4',
        targetType: 'daysPassed',
        targetValue: 4,
        isPrimary: true,
      },
      {
        id: 'o10m_srl_obj_cash',
        label: 'Bookmark Float',
        description: 'Hold $3,200',
        targetType: 'money',
        targetValue: 3200,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Campaign slots', 'Objective checkpoints', 'Quick resume'],
  },
  {
    id: 'o10m_standing_rebound',
    title: 'Standing Rebound',
    description:
      'Recover regional trust after a crisis chain — finale step for the continuity campaign arc.',
    category: 'challenge',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100416,
    startingMoney: 3100,
    startingRegions: ['NSW', 'QLD'],
    startingStanding: { NSW: 32, QLD: 28 },
    badgeId: 'badge_o10m_standing_rebound',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100416),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      publicStabilityEnabled: true,
      totalDays: 18,
    },
    objectives: [
      {
        id: 'o10m_sr_obj_standing',
        label: 'Rebound Threshold',
        description: 'Reach 52 average standing',
        targetType: 'multi_actor_standing_avg',
        targetValue: 52,
        isPrimary: true,
      },
      {
        id: 'o10m_sr_obj_crisis',
        label: 'Crisis Closure',
        description: 'Resolve 1 active crisis chain',
        targetType: 'crisis_resolved',
        targetValue: 1,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Standing recovery', 'Crisis resolution', 'Campaign finales'],
  },
  {
    id: 'o10m_marathon_pace_setter',
    title: 'Marathon Pace Setter',
    description: 'Open a marathon queue with a short cash-and-days gate before longer scenarios.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100417,
    startingMoney: 1800,
    startingRegions: ['SA'],
    badgeId: 'badge_o10m_marathon_pace_setter',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100417),
      scenarioEngineV73Enabled: true,
      o10mMarathonPaceSetter: true,
      totalDays: 10,
    },
    objectives: [
      {
        id: 'o10m_mps_obj_day',
        label: 'Opening Pace',
        description: 'Reach day 5',
        targetType: 'daysPassed',
        targetValue: 5,
        isPrimary: true,
      },
      {
        id: 'o10m_mps_obj_cash',
        label: 'Float Buffer',
        description: 'Hold $2,600',
        targetType: 'money',
        targetValue: 2600,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Marathon queues', 'Rotation pacing', 'Replay ledger'],
  },
  {
    id: 'o10m_marathon_rhythm_hold',
    title: 'Marathon Rhythm Hold',
    description: 'Mid-gauntlet standing maintenance under marathon rotation pressure.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100418,
    startingMoney: 2400,
    startingRegions: ['VIC', 'SA'],
    startingStanding: { VIC: 44, SA: 40 },
    badgeId: 'badge_o10m_marathon_rhythm_hold',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100418),
      regionalStandingEnabled: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_mrh_obj_avg',
        label: 'Hold the Line',
        description: 'Average standing of 50',
        targetType: 'multi_actor_standing_avg',
        targetValue: 50,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Standing maintenance', 'Marathon midpoints'],
  },
  {
    id: 'o10m_marathon_sprint_close',
    title: 'Marathon Sprint Close',
    description: 'Finale scenario for marathon sprint chain and non-looping queue completion.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100419,
    startingMoney: 3600,
    startingRegions: ['NSW', 'QLD', 'VIC'],
    badgeId: 'badge_o10m_marathon_sprint_close',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100419),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      totalDays: 16,
    },
    objectives: [
      {
        id: 'o10m_msc_obj_net',
        label: 'Sprint Net Worth',
        description: 'Reach $18,000 net worth',
        targetType: 'netWorth',
        targetValue: 18000,
        isPrimary: true,
      },
      {
        id: 'o10m_msc_obj_regions',
        label: 'Tri-State Control',
        description: 'Control 3 regions',
        targetType: 'regions_controlled',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Marathon finales', 'Queue completion', 'Gauntlet closure'],
  },
  {
    id: 'o10m_gauntlet_opening_gate',
    title: 'Gauntlet Opening Gate',
    description: 'First iron-locked step: survive with a primary cash gate under challenge overlay pressure.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100420,
    startingMoney: 1500,
    startingRegions: ['NSW'],
    badgeId: 'badge_o10m_gauntlet_opening_gate',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100420),
      scenarioEngineV73Enabled: true,
      o10mGauntletOpeningGate: true,
      totalDays: 12,
    },
    objectives: [
      {
        id: 'o10m_gog_obj_cash',
        label: 'Gate Float',
        description: 'Hold $3,200 cash',
        targetType: 'money',
        targetValue: 3200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Gauntlet sessions', 'Challenge lock-in', 'Lives economy'],
  },
  {
    id: 'o10m_gauntlet_midfield_press',
    title: 'Gauntlet Midfield Press',
    description: 'Mid-gauntlet standing squeeze with regional pressure before the iron finish.',
    category: 'challenge',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100421,
    startingMoney: 2200,
    startingRegions: ['VIC', 'NSW'],
    startingStanding: { VIC: 42, NSW: 45 },
    badgeId: 'badge_o10m_gauntlet_midfield_press',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100421),
      regionalStandingEnabled: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_gmp_obj_avg',
        label: 'Press Through',
        description: 'Average standing of 48',
        targetType: 'multi_actor_standing_avg',
        targetValue: 48,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Gauntlet midpoints', 'Standing under overlay'],
  },
  {
    id: 'o10m_gauntlet_iron_finish',
    title: 'Gauntlet Iron Finish',
    description: 'Final gauntlet scenario — net worth and region control with limited lives remaining.',
    category: 'expert',
    difficulty: 'Expert',
    complexity: 'Expert',
    forcedSeed: 100422,
    startingMoney: 3200,
    startingRegions: ['NSW', 'QLD', 'VIC'],
    badgeId: 'badge_o10m_gauntlet_iron_finish',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100422),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      totalDays: 18,
    },
    objectives: [
      {
        id: 'o10m_gif_obj_net',
        label: 'Iron Net Worth',
        description: 'Reach $16,000 net worth',
        targetType: 'netWorth',
        targetValue: 16000,
        isPrimary: true,
      },
      {
        id: 'o10m_gif_obj_regions',
        label: 'Tri-State Hold',
        description: 'Control 3 regions',
        targetType: 'regions_controlled',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Gauntlet finales', 'Unlock tokens', 'Catalog progression'],
  },
  {
    id: 'o10m_relay_dust_corridor',
    title: 'Relay Dust Corridor',
    description: 'Open a convoy relay with a short cash gate before inland handoffs.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100423,
    startingMoney: 2000,
    startingRegions: ['NT', 'SA'],
    badgeId: 'badge_o10m_relay_dust_corridor',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100423),
      scenarioEngineV73Enabled: true,
      o10mRelayDustCorridor: true,
      totalDays: 9,
    },
    objectives: [
      {
        id: 'o10m_rdc_obj_day',
        label: 'Corridor Window',
        description: 'Reach day 4',
        targetType: 'daysPassed',
        targetValue: 4,
        isPrimary: true,
      },
      {
        id: 'o10m_rdc_obj_cash',
        label: 'Convoy Float',
        description: 'Hold $2,800',
        targetType: 'money',
        targetValue: 2800,
        isPrimary: false,
      },
    ],
    modifiers: [],
    youWillLearn: ['Relay convoys', 'Carry bonuses', 'Leg pacing'],
  },
  {
    id: 'o10m_relay_coastal_handoff',
    title: 'Relay Coastal Handoff',
    description: 'Mid-relay standing maintenance before the terminal sprint.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100424,
    startingMoney: 2600,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 42, SA: 40 },
    badgeId: 'badge_o10m_relay_coastal_handoff',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100424),
      regionalStandingEnabled: true,
      totalDays: 12,
    },
    objectives: [
      {
        id: 'o10m_rch_obj_avg',
        label: 'Handoff Threshold',
        description: 'Average standing of 48',
        targetType: 'multi_actor_standing_avg',
        targetValue: 48,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Relay midpoints', 'Standing carry', 'Convoy continuity'],
  },
  {
    id: 'o10m_relay_terminal_sprint',
    title: 'Relay Terminal Sprint',
    description: 'Finale relay leg — net worth gate with accumulated carry applied at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100425,
    startingMoney: 3000,
    startingRegions: ['NSW', 'VIC', 'QLD'],
    badgeId: 'badge_o10m_relay_terminal_sprint',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100425),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      totalDays: 15,
    },
    objectives: [
      {
        id: 'o10m_rts_obj_net',
        label: 'Terminal Net Worth',
        description: 'Reach $14,000 net worth',
        targetType: 'netWorth',
        targetValue: 14000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Relay finales', 'Carry ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_circuit_warmup_laps',
    title: 'Circuit Warmup Laps',
    description: 'Open a summit circuit with low-pressure pacing before the ridge climb.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100426,
    startingMoney: 2200,
    startingRegions: ['VIC', 'TAS'],
    badgeId: 'badge_o10m_circuit_warmup_laps',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100426),
      o10mCircuitWarmupLaps: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_cwl_obj_day',
        label: 'Warmup Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Summit circuits', 'Momentum pacing', 'Phase warmup'],
  },
  {
    id: 'o10m_circuit_ridge_climb',
    title: 'Circuit Ridge Climb',
    description: 'Mid-circuit standing climb with accrued momentum applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100427,
    startingMoney: 2800,
    startingRegions: ['NSW', 'ACT'],
    startingStanding: { NSW: 44, ACT: 46 },
    badgeId: 'badge_o10m_circuit_ridge_climb',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100427),
      regionalStandingEnabled: true,
      o10mCircuitRidgeClimb: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_crc_obj_avg',
        label: 'Ridge Threshold',
        description: 'Average standing of 50',
        targetType: 'multi_actor_standing_avg',
        targetValue: 50,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Circuit ascent', 'Momentum carry', 'Phase transitions'],
  },
  {
    id: 'o10m_circuit_summit_push',
    title: 'Circuit Summit Push',
    description: 'Finale circuit leg — net worth gate with full momentum bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100428,
    startingMoney: 3200,
    startingRegions: ['QLD', 'NT', 'WA'],
    badgeId: 'badge_o10m_circuit_summit_push',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100428),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mCircuitSummitPush: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_csp_obj_net',
        label: 'Summit Net Worth',
        description: 'Reach $15,500 net worth',
        targetType: 'netWorth',
        targetValue: 15500,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Circuit finales', 'Momentum ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_expedition_departure_dock',
    title: 'Expedition Departure Dock',
    description: 'Open an expedition route with supply staging before the transit pass.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100429,
    startingMoney: 2100,
    startingRegions: ['SA', 'VIC'],
    badgeId: 'badge_o10m_expedition_departure_dock',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100429),
      o10mExpeditionDepartureDock: true,
      totalDays: 7,
    },
    objectives: [
      {
        id: 'o10m_edd_obj_day',
        label: 'Departure Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Expedition routes', 'Supply pacing', 'Leg departure'],
  },
  {
    id: 'o10m_expedition_transit_pass',
    title: 'Expedition Transit Pass',
    description: 'Mid-route transit with accrued supply applied at scenario start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100430,
    startingMoney: 2600,
    startingRegions: ['NT', 'QLD'],
    startingStanding: { NT: 42, QLD: 45 },
    badgeId: 'badge_o10m_expedition_transit_pass',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100430),
      regionalStandingEnabled: true,
      o10mExpeditionTransitPass: true,
      totalDays: 10,
    },
    objectives: [
      {
        id: 'o10m_etp_obj_avg',
        label: 'Transit Threshold',
        description: 'Average standing of 48',
        targetType: 'multi_actor_standing_avg',
        targetValue: 48,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Expedition transit', 'Supply carry', 'Leg transitions'],
  },
  {
    id: 'o10m_expedition_arrival_haven',
    title: 'Expedition Arrival Haven',
    description: 'Finale expedition waypoint — net worth gate with full supply bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100431,
    startingMoney: 3000,
    startingRegions: ['WA', 'TAS'],
    badgeId: 'badge_o10m_expedition_arrival_haven',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100431),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mExpeditionArrivalHaven: true,
      totalDays: 13,
    },
    objectives: [
      {
        id: 'o10m_eah_obj_net',
        label: 'Arrival Net Worth',
        description: 'Reach $14,800 net worth',
        targetType: 'netWorth',
        targetValue: 14800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Expedition finales', 'Supply ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_odyssey_opening_winds',
    title: 'Odyssey Opening Winds',
    description: 'Begin a multi-act odyssey with low-pressure renown building before the crossing.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100432,
    startingMoney: 2300,
    startingRegions: ['VIC', 'NSW'],
    badgeId: 'badge_o10m_odyssey_opening_winds',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100432),
      o10mOdysseyOpeningWinds: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_oow_obj_day',
        label: 'Opening Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Odyssey arcs', 'Renown pacing', 'Act opening'],
  },
  {
    id: 'o10m_odyssey_crossing_shelves',
    title: 'Odyssey Crossing Shelves',
    description: 'Mid-odyssey standing crossing with accrued renown applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100433,
    startingMoney: 2900,
    startingRegions: ['SA', 'NT'],
    startingStanding: { SA: 43, NT: 46 },
    badgeId: 'badge_o10m_odyssey_crossing_shelves',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100433),
      regionalStandingEnabled: true,
      o10mOdysseyCrossingShelves: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_ocs_obj_avg',
        label: 'Crossing Threshold',
        description: 'Average standing of 49',
        targetType: 'multi_actor_standing_avg',
        targetValue: 49,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Odyssey crossing', 'Renown carry', 'Act transitions'],
  },
  {
    id: 'o10m_odyssey_homecoming_harbor',
    title: 'Odyssey Homecoming Harbor',
    description: 'Finale odyssey chapter — net worth gate with full renown bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100434,
    startingMoney: 3300,
    startingRegions: ['WA', 'TAS', 'QLD'],
    badgeId: 'badge_o10m_odyssey_homecoming_harbor',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100434),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mOdysseyHomecomingHarbor: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_ohh_obj_net',
        label: 'Homecoming Net Worth',
        description: 'Reach $15,200 net worth',
        targetType: 'netWorth',
        targetValue: 15200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Odyssey finales', 'Renown ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_pilgrimage_setting_out',
    title: 'Pilgrimage Setting Out',
    description: 'Begin a staged pilgrimage with devotion building before the midway shrine.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100435,
    startingMoney: 2250,
    startingRegions: ['VIC', 'SA'],
    badgeId: 'badge_o10m_pilgrimage_setting_out',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100435),
      o10mPilgrimageSettingOut: true,
      totalDays: 7,
    },
    objectives: [
      {
        id: 'o10m_pso_obj_day',
        label: 'Setting Out Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Pilgrimage routes', 'Devotion pacing', 'Stage setting out'],
  },
  {
    id: 'o10m_pilgrimage_midway_shrine',
    title: 'Pilgrimage Midway Shrine',
    description: 'Mid-pilgrimage standing gate with accrued devotion applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100436,
    startingMoney: 2850,
    startingRegions: ['NSW', 'ACT'],
    startingStanding: { NSW: 44, ACT: 47 },
    badgeId: 'badge_o10m_pilgrimage_midway_shrine',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100436),
      regionalStandingEnabled: true,
      o10mPilgrimageMidwayShrine: true,
      totalDays: 10,
    },
    objectives: [
      {
        id: 'o10m_pms_obj_avg',
        label: 'Shrine Threshold',
        description: 'Average standing of 50',
        targetType: 'multi_actor_standing_avg',
        targetValue: 50,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Pilgrimage midway', 'Devotion carry', 'Stage transitions'],
  },
  {
    id: 'o10m_pilgrimage_sanctuary_rest',
    title: 'Pilgrimage Sanctuary Rest',
    description: 'Finale pilgrimage stop — net worth gate with full devotion bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100437,
    startingMoney: 3350,
    startingRegions: ['QLD', 'NT', 'WA'],
    badgeId: 'badge_o10m_pilgrimage_sanctuary_rest',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100437),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mPilgrimageSanctuaryRest: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_psr_obj_net',
        label: 'Sanctuary Net Worth',
        description: 'Reach $15,400 net worth',
        targetType: 'netWorth',
        targetValue: 15400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Pilgrimage finales', 'Devotion ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_caravan_assembly_yard',
    title: 'Caravan Assembly Yard',
    description: 'Muster a trade caravan and load cargo before the dune crossing.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100438,
    startingMoney: 2400,
    startingRegions: ['SA', 'NT'],
    badgeId: 'badge_o10m_caravan_assembly_yard',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100438),
      o10mCaravanAssemblyYard: true,
      totalDays: 7,
    },
    objectives: [
      {
        id: 'o10m_cay_obj_day',
        label: 'Assembly Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Trade caravans', 'Cargo pacing', 'Leg assembly'],
  },
  {
    id: 'o10m_caravan_dune_crossing',
    title: 'Caravan Dune Crossing',
    description: 'Mid-caravan crossing with accrued cargo bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100439,
    startingMoney: 2950,
    startingRegions: ['WA', 'NT'],
    startingStanding: { WA: 45, NT: 43 },
    badgeId: 'badge_o10m_caravan_dune_crossing',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100439),
      regionalStandingEnabled: true,
      o10mCaravanDuneCrossing: true,
      totalDays: 10,
    },
    objectives: [
      {
        id: 'o10m_cdc_obj_avg',
        label: 'Crossing Threshold',
        description: 'Average standing of 51',
        targetType: 'multi_actor_standing_avg',
        targetValue: 51,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Caravan crossing', 'Cargo carry', 'Leg transitions'],
  },
  {
    id: 'o10m_caravan_bazaar_finale',
    title: 'Caravan Bazaar Finale',
    description: 'Finale caravan leg — net worth gate with full cargo bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100440,
    startingMoney: 3400,
    startingRegions: ['QLD', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_caravan_bazaar_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100440),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mCaravanBazaarFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_cbf_obj_net',
        label: 'Bazaar Net Worth',
        description: 'Reach $15,600 net worth',
        targetType: 'netWorth',
        targetValue: 15600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Caravan finales', 'Cargo ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_voyage_embark_pier',
    title: 'Voyage Embark Pier',
    description: 'Chart a coastal voyage with low-pressure segment pacing before open sea.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100441,
    startingMoney: 2450,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_voyage_embark_pier',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100441),
      o10mVoyageEmbarkPier: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_vep_obj_day',
        label: 'Embark Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Coastal voyages', 'Chart pacing', 'Segment embark'],
  },
  {
    id: 'o10m_voyage_open_sea_passage',
    title: 'Voyage Open Sea Passage',
    description: 'Mid-voyage open sea with accrued chart bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100442,
    startingMoney: 3000,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 46, SA: 44 },
    badgeId: 'badge_o10m_voyage_open_sea_passage',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100442),
      regionalStandingEnabled: true,
      o10mVoyageOpenSeaPassage: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_vosp_obj_avg',
        label: 'Open Sea Threshold',
        description: 'Average standing of 52',
        targetType: 'multi_actor_standing_avg',
        targetValue: 52,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Voyage open sea', 'Chart carry', 'Segment transitions'],
  },
  {
    id: 'o10m_voyage_port_call_finale',
    title: 'Voyage Port Call Finale',
    description: 'Finale voyage segment — net worth gate with full chart bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100443,
    startingMoney: 3450,
    startingRegions: ['QLD', 'NSW', 'NT'],
    badgeId: 'badge_o10m_voyage_port_call_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100443),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mVoyagePortCallFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_vpcf_obj_net',
        label: 'Port Call Net Worth',
        description: 'Reach $15,800 net worth',
        targetType: 'netWorth',
        targetValue: 15800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Voyage finales', 'Chart ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_siege_mustering_yard',
    title: 'Siege Mustering Yard',
    description: 'Gather siege morale with low-pressure mustering before the breach phase.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100444,
    startingMoney: 2500,
    startingRegions: ['NSW', 'ACT'],
    badgeId: 'badge_o10m_siege_mustering_yard',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100444),
      o10mSiegeMusteringYard: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_smy_obj_day',
        label: 'Muster Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Fortress sieges', 'Morale pacing', 'Mustering phase'],
  },
  {
    id: 'o10m_siege_breach_wall',
    title: 'Siege Breach Wall',
    description: 'Mid-siege breach with accrued morale bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100445,
    startingMoney: 3050,
    startingRegions: ['VIC', 'SA'],
    startingStanding: { VIC: 47, SA: 45 },
    badgeId: 'badge_o10m_siege_breach_wall',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100445),
      regionalStandingEnabled: true,
      o10mSiegeBreachWall: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_sbw_obj_avg',
        label: 'Breach Threshold',
        description: 'Average standing of 53',
        targetType: 'multi_actor_standing_avg',
        targetValue: 53,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Siege breach', 'Morale carry', 'Phase transitions'],
  },
  {
    id: 'o10m_siege_relief_finale',
    title: 'Siege Relief Finale',
    description: 'Finale relief phase — net worth gate with full morale bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100446,
    startingMoney: 3500,
    startingRegions: ['QLD', 'NT', 'WA'],
    badgeId: 'badge_o10m_siege_relief_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100446),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mSiegeReliefFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_srf_obj_net',
        label: 'Relief Net Worth',
        description: 'Reach $16,000 net worth',
        targetType: 'netWorth',
        targetValue: 16000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Siege finales', 'Morale ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_convoy_staging_depot',
    title: 'Convoy Staging Depot',
    description: 'Stage an overland convoy with low-pressure haul pacing before transit.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100447,
    startingMoney: 2550,
    startingRegions: ['SA', 'VIC'],
    badgeId: 'badge_o10m_convoy_staging_depot',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100447),
      o10mConvoyStagingDepot: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_csd_obj_day',
        label: 'Staging Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Overland convoys', 'Haul pacing', 'Staging phase'],
  },
  {
    id: 'o10m_convoy_transit_corridor',
    title: 'Convoy Transit Corridor',
    description: 'Mid-convoy transit with accrued haul bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100448,
    startingMoney: 3100,
    startingRegions: ['NT', 'QLD'],
    startingStanding: { NT: 48, QLD: 46 },
    badgeId: 'badge_o10m_convoy_transit_corridor',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100448),
      regionalStandingEnabled: true,
      o10mConvoyTransitCorridor: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_ctc_obj_avg',
        label: 'Transit Threshold',
        description: 'Average standing of 54',
        targetType: 'multi_actor_standing_avg',
        targetValue: 54,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Convoy transit', 'Haul carry', 'Stage transitions'],
  },
  {
    id: 'o10m_convoy_delivery_finale',
    title: 'Convoy Delivery Finale',
    description: 'Finale delivery stage — net worth gate with full haul bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100449,
    startingMoney: 3550,
    startingRegions: ['WA', 'NSW', 'ACT'],
    badgeId: 'badge_o10m_convoy_delivery_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100449),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mConvoyDeliveryFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_cdf_obj_net',
        label: 'Delivery Net Worth',
        description: 'Reach $16,200 net worth',
        targetType: 'netWorth',
        targetValue: 16200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Convoy finales', 'Haul ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_escort_briefing_yard',
    title: 'Escort Briefing Yard',
    description: 'Brief a VIP escort with low-pressure trust pacing before the corridor leg.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100450,
    startingMoney: 2600,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_escort_briefing_yard',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100450),
      o10mEscortBriefingYard: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_eby_obj_day',
        label: 'Briefing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['VIP escorts', 'Trust pacing', 'Briefing phase'],
  },
  {
    id: 'o10m_escort_corridor_patrol',
    title: 'Escort Corridor Patrol',
    description: 'Mid-escort corridor patrol with accrued trust bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100451,
    startingMoney: 3150,
    startingRegions: ['VIC', 'SA'],
    startingStanding: { VIC: 49, SA: 47 },
    badgeId: 'badge_o10m_escort_corridor_patrol',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100451),
      regionalStandingEnabled: true,
      o10mEscortCorridorPatrol: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_ecp_obj_avg',
        label: 'Corridor Threshold',
        description: 'Average standing of 55',
        targetType: 'multi_actor_standing_avg',
        targetValue: 55,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Escort corridor', 'Trust carry', 'Phase transitions'],
  },
  {
    id: 'o10m_escort_handoff_finale',
    title: 'Escort Handoff Finale',
    description: 'Finale handoff stage — net worth gate with full trust bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100452,
    startingMoney: 3600,
    startingRegions: ['QLD', 'WA', 'NT'],
    badgeId: 'badge_o10m_escort_handoff_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100452),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mEscortHandoffFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_ehf_obj_net',
        label: 'Handoff Net Worth',
        description: 'Reach $16,400 net worth',
        targetType: 'netWorth',
        targetValue: 16400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Escort finales', 'Trust ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_extraction_intel_brief',
    title: 'Extraction Intel Brief',
    description: 'Plan an asset extraction with low-pressure asset pacing before the rescue leg.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100460,
    startingMoney: 2650,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_extraction_intel_brief',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100460),
      o10mExtractionIntelBrief: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_eib_obj_day',
        label: 'Intel Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Extraction ops', 'Asset pacing', 'Intel phase'],
  },
  {
    id: 'o10m_extraction_rescue_site',
    title: 'Extraction Rescue Site',
    description: 'Mid-extraction rescue with accrued asset bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100461,
    startingMoney: 3200,
    startingRegions: ['VIC', 'SA'],
    startingStanding: { VIC: 50, SA: 48 },
    badgeId: 'badge_o10m_extraction_rescue_site',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100461),
      regionalStandingEnabled: true,
      o10mExtractionRescueSite: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_ers_obj_avg',
        label: 'Rescue Threshold',
        description: 'Average standing of 56',
        targetType: 'multi_actor_standing_avg',
        targetValue: 56,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Rescue site', 'Asset carry', 'Phase transitions'],
  },
  {
    id: 'o10m_extraction_exfil_finale',
    title: 'Extraction Exfil Finale',
    description: 'Finale exfil stage — net worth gate with full asset bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100462,
    startingMoney: 3650,
    startingRegions: ['QLD', 'WA', 'NT'],
    badgeId: 'badge_o10m_extraction_exfil_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100462),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mExtractionExfilFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_eef_obj_net',
        label: 'Exfil Net Worth',
        description: 'Reach $16,600 net worth',
        targetType: 'netWorth',
        targetValue: 16600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Extraction finales', 'Asset ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_subject_intake_brief',
    title: 'Subject Intake Brief',
    description: 'Open a subject investigation with low-pressure fidelity pacing before field probes.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100463,
    startingMoney: 2700,
    startingRegions: ['ACT', 'TAS'],
    badgeId: 'badge_o10m_subject_intake_brief',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100463),
      o10mSubjectIntakeBrief: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_sib_obj_day',
        label: 'Intake Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Subject arcs', 'Fidelity pacing', 'Intake phase'],
  },
  {
    id: 'o10m_subject_probe_field',
    title: 'Subject Probe Field',
    description: 'Mid-subject field probe with accrued fidelity bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100464,
    startingMoney: 3250,
    startingRegions: ['NSW', 'VIC'],
    startingStanding: { NSW: 51, VIC: 49 },
    badgeId: 'badge_o10m_subject_probe_field',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100464),
      regionalStandingEnabled: true,
      o10mSubjectProbeField: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_spf_obj_avg',
        label: 'Probe Threshold',
        description: 'Average standing of 57',
        targetType: 'multi_actor_standing_avg',
        targetValue: 57,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Field probes', 'Fidelity carry', 'Phase transitions'],
  },
  {
    id: 'o10m_subject_verdict_finale',
    title: 'Subject Verdict Finale',
    description: 'Finale verdict stage — net worth gate with full fidelity bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100465,
    startingMoney: 3700,
    startingRegions: ['QLD', 'WA', 'SA'],
    badgeId: 'badge_o10m_subject_verdict_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100465),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mSubjectVerdictFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_svf_obj_net',
        label: 'Verdict Net Worth',
        description: 'Reach $16,800 net worth',
        targetType: 'netWorth',
        targetValue: 16800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Subject finales', 'Fidelity ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_witness_brief_room',
    title: 'Witness Brief Room',
    description: 'Open a witness arc with low-pressure credibility pacing before testimony.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100466,
    startingMoney: 2750,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_witness_brief_room',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100466),
      o10mWitnessBriefRoom: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_wbr_obj_day',
        label: 'Brief Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Witness arcs', 'Credibility pacing', 'Brief phase'],
  },
  {
    id: 'o10m_witness_testimony_floor',
    title: 'Witness Testimony Floor',
    description: 'Mid-witness testimony with accrued credibility bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100467,
    startingMoney: 3300,
    startingRegions: ['QLD', 'NT'],
    startingStanding: { QLD: 52, NT: 50 },
    badgeId: 'badge_o10m_witness_testimony_floor',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100467),
      regionalStandingEnabled: true,
      o10mWitnessTestimonyFloor: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_wtf_obj_avg',
        label: 'Testimony Threshold',
        description: 'Average standing of 58',
        targetType: 'multi_actor_standing_avg',
        targetValue: 58,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Testimony floor', 'Credibility carry', 'Phase transitions'],
  },
  {
    id: 'o10m_witness_affirm_finale',
    title: 'Witness Affirm Finale',
    description: 'Finale affirm stage — net worth gate with full credibility bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100468,
    startingMoney: 3750,
    startingRegions: ['WA', 'SA', 'VIC'],
    badgeId: 'badge_o10m_witness_affirm_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100468),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mWitnessAffirmFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_waf_obj_net',
        label: 'Affirm Net Worth',
        description: 'Reach $17,000 net worth',
        targetType: 'netWorth',
        targetValue: 17000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Witness finales', 'Credibility ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_tribunal_docket_brief',
    title: 'Tribunal Docket Brief',
    description: 'Open a tribunal arc with low-pressure gravitas pacing before hearings.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100469,
    startingMoney: 2800,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_tribunal_docket_brief',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100469),
      o10mTribunalDocketBrief: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_tdb_obj_day',
        label: 'Docket Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Tribunal arcs', 'Gravitas pacing', 'Docket phase'],
  },
  {
    id: 'o10m_tribunal_hearing_chamber',
    title: 'Tribunal Hearing Chamber',
    description: 'Mid-tribunal hearing with accrued gravitas bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100470,
    startingMoney: 3350,
    startingRegions: ['VIC', 'TAS'],
    startingStanding: { VIC: 53, TAS: 51 },
    badgeId: 'badge_o10m_tribunal_hearing_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100470),
      regionalStandingEnabled: true,
      o10mTribunalHearingChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_thc_obj_avg',
        label: 'Hearing Threshold',
        description: 'Average standing of 59',
        targetType: 'multi_actor_standing_avg',
        targetValue: 59,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Hearing chamber', 'Gravitas carry', 'Phase transitions'],
  },
  {
    id: 'o10m_tribunal_seal_finale',
    title: 'Tribunal Seal Finale',
    description: 'Finale seal stage — net worth gate with full gravitas bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100471,
    startingMoney: 3800,
    startingRegions: ['QLD', 'WA', 'NT'],
    badgeId: 'badge_o10m_tribunal_seal_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100471),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mTribunalSealFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_tsf_obj_net',
        label: 'Seal Net Worth',
        description: 'Reach $17,200 net worth',
        targetType: 'netWorth',
        targetValue: 17200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Tribunal finales', 'Gravitas ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_indictment_charge_docket',
    title: 'Indictment Charge Docket',
    description: 'Open an indictment arc with low-pressure case-weight pacing before arraign.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100472,
    startingMoney: 2850,
    startingRegions: ['ACT', 'QLD'],
    badgeId: 'badge_o10m_indictment_charge_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100472),
      o10mIndictmentChargeDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_icd_obj_day',
        label: 'Charge Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Indictment arcs', 'Case-weight pacing', 'Charge phase'],
  },
  {
    id: 'o10m_indictment_arraign_bench',
    title: 'Indictment Arraign Bench',
    description: 'Mid-indictment arraign with accrued case-weight bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100473,
    startingMoney: 3400,
    startingRegions: ['NSW', 'VIC'],
    startingStanding: { NSW: 54, VIC: 52 },
    badgeId: 'badge_o10m_indictment_arraign_bench',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100473),
      regionalStandingEnabled: true,
      o10mIndictmentArraignBench: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_iab_obj_avg',
        label: 'Arraign Threshold',
        description: 'Average standing of 60',
        targetType: 'multi_actor_standing_avg',
        targetValue: 60,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Arraign bench', 'Case-weight carry', 'Phase transitions'],
  },
  {
    id: 'o10m_indictment_bind_finale',
    title: 'Indictment Bind Finale',
    description: 'Finale bind stage — net worth gate with full case-weight bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100474,
    startingMoney: 3850,
    startingRegions: ['WA', 'NT', 'SA'],
    badgeId: 'badge_o10m_indictment_bind_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100474),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mIndictmentBindFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_ibf_obj_net',
        label: 'Bind Net Worth',
        description: 'Reach $17,400 net worth',
        targetType: 'netWorth',
        targetValue: 17400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Indictment finales', 'Case-weight ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_appeal_petition_filing',
    title: 'Appeal Petition Filing',
    description: 'Open an appeal arc with low-pressure merit pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100475,
    startingMoney: 2900,
    startingRegions: ['ACT', 'TAS'],
    badgeId: 'badge_o10m_appeal_petition_filing',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100475),
      o10mAppealPetitionFiling: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_apf_obj_day',
        label: 'Petition Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Appeal arcs', 'Merit pacing', 'Petition phase'],
  },
  {
    id: 'o10m_appeal_review_chamber',
    title: 'Appeal Review Chamber',
    description: 'Mid-appeal review with accrued merit bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100476,
    startingMoney: 3450,
    startingRegions: ['NSW', 'QLD'],
    startingStanding: { NSW: 55, QLD: 53 },
    badgeId: 'badge_o10m_appeal_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100476),
      regionalStandingEnabled: true,
      o10mAppealReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_arc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 61',
        targetType: 'multi_actor_standing_avg',
        targetValue: 61,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Merit carry', 'Phase transitions'],
  },
  {
    id: 'o10m_appeal_grant_finale',
    title: 'Appeal Grant Finale',
    description: 'Finale grant stage — net worth gate with full merit bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100477,
    startingMoney: 3900,
    startingRegions: ['WA', 'NT', 'SA'],
    badgeId: 'badge_o10m_appeal_grant_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100477),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mAppealGrantFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_agf_obj_net',
        label: 'Grant Net Worth',
        description: 'Reach $17,600 net worth',
        targetType: 'netWorth',
        targetValue: 17600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Appeal finales', 'Merit ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_clemency_plea_docket',
    title: 'Clemency Plea Docket',
    description: 'Open a clemency arc with low-pressure mercy pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100478,
    startingMoney: 2950,
    startingRegions: ['ACT', 'TAS'],
    badgeId: 'badge_o10m_clemency_plea_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100478),
      o10mClemencyPleaDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_cpd_obj_day',
        label: 'Plea Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Clemency arcs', 'Mercy pacing', 'Plea phase'],
  },
  {
    id: 'o10m_clemency_review_chamber',
    title: 'Clemency Review Chamber',
    description: 'Mid-clemency review with accrued mercy bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100479,
    startingMoney: 3500,
    startingRegions: ['VIC', 'SA'],
    startingStanding: { VIC: 56, SA: 54 },
    badgeId: 'badge_o10m_clemency_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100479),
      regionalStandingEnabled: true,
      o10mClemencyReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_crc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 62',
        targetType: 'multi_actor_standing_avg',
        targetValue: 62,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Mercy carry', 'Phase transitions'],
  },
  {
    id: 'o10m_clemency_mercy_finale',
    title: 'Clemency Mercy Finale',
    description: 'Finale clemency stage — net worth gate with full mercy bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100480,
    startingMoney: 3950,
    startingRegions: ['WA', 'NT', 'QLD'],
    badgeId: 'badge_o10m_clemency_mercy_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100480),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mClemencyMercyFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_cmf_obj_net',
        label: 'Mercy Net Worth',
        description: 'Reach $17,800 net worth',
        targetType: 'netWorth',
        targetValue: 17800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Clemency finales', 'Mercy ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_pardon_brief_docket',
    title: 'Pardon Brief Docket',
    description: 'Open a pardon arc with low-pressure grace pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100481,
    startingMoney: 3000,
    startingRegions: ['ACT', 'NT'],
    badgeId: 'badge_o10m_pardon_brief_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100481),
      o10mPardonBriefDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_pbd_obj_day',
        label: 'Brief Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Pardon arcs', 'Grace pacing', 'Brief phase'],
  },
  {
    id: 'o10m_pardon_review_chamber',
    title: 'Pardon Review Chamber',
    description: 'Mid-pardon review with accrued grace bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100482,
    startingMoney: 3550,
    startingRegions: ['QLD', 'WA'],
    startingStanding: { QLD: 57, WA: 55 },
    badgeId: 'badge_o10m_pardon_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100482),
      regionalStandingEnabled: true,
      o10mPardonReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_prc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 63',
        targetType: 'multi_actor_standing_avg',
        targetValue: 63,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Grace carry', 'Phase transitions'],
  },
  {
    id: 'o10m_pardon_grace_finale',
    title: 'Pardon Grace Finale',
    description: 'Finale pardon stage — net worth gate with full grace bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100483,
    startingMoney: 4000,
    startingRegions: ['NSW', 'VIC', 'SA'],
    badgeId: 'badge_o10m_pardon_grace_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100483),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mPardonGraceFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_pgf_obj_net',
        label: 'Grace Net Worth',
        description: 'Reach $18,000 net worth',
        targetType: 'netWorth',
        targetValue: 18000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Pardon finales', 'Grace ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_amnesty_warrant_docket',
    title: 'Amnesty Warrant Docket',
    description: 'Open an amnesty arc with low-pressure absolution pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100484,
    startingMoney: 3050,
    startingRegions: ['ACT', 'SA'],
    badgeId: 'badge_o10m_amnesty_warrant_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100484),
      o10mAmnestyWarrantDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_awd_obj_day',
        label: 'Warrant Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Amnesty arcs', 'Absolution pacing', 'Warrant phase'],
  },
  {
    id: 'o10m_amnesty_review_chamber',
    title: 'Amnesty Review Chamber',
    description: 'Mid-amnesty review with accrued absolution bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100485,
    startingMoney: 3600,
    startingRegions: ['NSW', 'NT'],
    startingStanding: { NSW: 58, NT: 56 },
    badgeId: 'badge_o10m_amnesty_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100485),
      regionalStandingEnabled: true,
      o10mAmnestyReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_arc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 64',
        targetType: 'multi_actor_standing_avg',
        targetValue: 64,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Absolution carry', 'Phase transitions'],
  },
  {
    id: 'o10m_amnesty_absolution_finale',
    title: 'Amnesty Absolution Finale',
    description: 'Finale amnesty stage — net worth gate with full absolution bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100486,
    startingMoney: 4050,
    startingRegions: ['VIC', 'QLD', 'WA'],
    badgeId: 'badge_o10m_amnesty_absolution_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100486),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mAmnestyAbsolutionFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_aaf_obj_net',
        label: 'Absolution Net Worth',
        description: 'Reach $18,200 net worth',
        targetType: 'netWorth',
        targetValue: 18200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Amnesty finales', 'Absolution ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_reprieve_filing_docket',
    title: 'Reprieve Filing Docket',
    description: 'Open a reprieve arc with low-pressure relief pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100487,
    startingMoney: 3100,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_reprieve_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100487),
      o10mReprieveFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_rfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reprieve arcs', 'Relief pacing', 'Filing phase'],
  },
  {
    id: 'o10m_reprieve_review_chamber',
    title: 'Reprieve Review Chamber',
    description: 'Mid-reprieve review with accrued relief bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100488,
    startingMoney: 3650,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 59, WA: 57 },
    badgeId: 'badge_o10m_reprieve_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100488),
      regionalStandingEnabled: true,
      o10mReprieveReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_rrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 65',
        targetType: 'multi_actor_standing_avg',
        targetValue: 65,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Relief carry', 'Phase transitions'],
  },
  {
    id: 'o10m_reprieve_relief_finale',
    title: 'Reprieve Relief Finale',
    description: 'Finale reprieve stage — net worth gate with full relief bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100489,
    startingMoney: 4100,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_reprieve_relief_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100489),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mReprieveReliefFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_rrf_obj_net',
        label: 'Relief Net Worth',
        description: 'Reach $18,400 net worth',
        targetType: 'netWorth',
        targetValue: 18400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reprieve finales', 'Relief ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_parole_intake_docket',
    title: 'Parole Intake Docket',
    description: 'Open a parole arc with low-pressure trust pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100490,
    startingMoney: 3150,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_parole_intake_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100490),
      o10mParoleIntakeDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_pid_obj_day',
        label: 'Intake Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Parole arcs', 'Trust pacing', 'Intake phase'],
  },
  {
    id: 'o10m_parole_review_chamber',
    title: 'Parole Review Chamber',
    description: 'Mid-parole review with accrued trust bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100491,
    startingMoney: 3700,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 60, WA: 58 },
    badgeId: 'badge_o10m_parole_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100491),
      regionalStandingEnabled: true,
      o10mParoleReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_prc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 66',
        targetType: 'multi_actor_standing_avg',
        targetValue: 66,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Trust carry', 'Phase transitions'],
  },
  {
    id: 'o10m_parole_release_finale',
    title: 'Parole Release Finale',
    description: 'Finale parole stage — net worth gate with full trust bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100492,
    startingMoney: 4150,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_parole_release_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100492),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mParoleReleaseFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_prf_obj_net',
        label: 'Release Net Worth',
        description: 'Reach $18,600 net worth',
        targetType: 'netWorth',
        targetValue: 18600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Parole finales', 'Trust ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_probation_enrollment_docket',
    title: 'Probation Enrollment Docket',
    description: 'Open a probation arc with low-pressure compliance pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100493,
    startingMoney: 3200,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_probation_enrollment_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100493),
      o10mProbationEnrollmentDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_ped_obj_day',
        label: 'Enrollment Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Probation arcs', 'Compliance pacing', 'Enrollment phase'],
  },
  {
    id: 'o10m_probation_review_chamber',
    title: 'Probation Review Chamber',
    description: 'Mid-probation review with accrued compliance bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100494,
    startingMoney: 3750,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 61, WA: 59 },
    badgeId: 'badge_o10m_probation_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100494),
      regionalStandingEnabled: true,
      o10mProbationReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_prc2_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 67',
        targetType: 'multi_actor_standing_avg',
        targetValue: 67,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Compliance carry', 'Phase transitions'],
  },
  {
    id: 'o10m_probation_clearance_finale',
    title: 'Probation Clearance Finale',
    description: 'Finale probation stage — net worth gate with full compliance bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100495,
    startingMoney: 4200,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_probation_clearance_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100495),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mProbationClearanceFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_pcf_obj_net',
        label: 'Clearance Net Worth',
        description: 'Reach $18,800 net worth',
        targetType: 'netWorth',
        targetValue: 18800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Probation finales', 'Compliance ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_commutation_petition_docket',
    title: 'Commutation Petition Docket',
    description: 'Open a commutation arc with low-pressure leniency pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100496,
    startingMoney: 3250,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_commutation_petition_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100496),
      o10mCommutationPetitionDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_cpd_obj_day',
        label: 'Petition Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Commutation arcs', 'Leniency pacing', 'Petition phase'],
  },
  {
    id: 'o10m_commutation_review_chamber',
    title: 'Commutation Review Chamber',
    description: 'Mid-commutation review with accrued leniency bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100497,
    startingMoney: 3800,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 62, WA: 60 },
    badgeId: 'badge_o10m_commutation_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100497),
      regionalStandingEnabled: true,
      o10mCommutationReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_crc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 68',
        targetType: 'multi_actor_standing_avg',
        targetValue: 68,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Leniency carry', 'Phase transitions'],
  },
  {
    id: 'o10m_commutation_grant_finale',
    title: 'Commutation Grant Finale',
    description: 'Finale commutation stage — net worth gate with full leniency bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100498,
    startingMoney: 4250,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_commutation_grant_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100498),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mCommutationGrantFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_cgf_obj_net',
        label: 'Grant Net Worth',
        description: 'Reach $19,000 net worth',
        targetType: 'netWorth',
        targetValue: 19000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Commutation finales', 'Leniency ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_acquittal_brief_docket',
    title: 'Acquittal Brief Docket',
    description: 'Open an acquittal arc with low-pressure verdict pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100499,
    startingMoney: 3300,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_acquittal_brief_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100499),
      o10mAcquittalBriefDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_abd_obj_day',
        label: 'Brief Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Acquittal arcs', 'Verdict pacing', 'Brief phase'],
  },
  {
    id: 'o10m_acquittal_review_chamber',
    title: 'Acquittal Review Chamber',
    description: 'Mid-acquittal review with accrued verdict bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100500,
    startingMoney: 3850,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 63, WA: 61 },
    badgeId: 'badge_o10m_acquittal_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100500),
      regionalStandingEnabled: true,
      o10mAcquittalReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_arc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 69',
        targetType: 'multi_actor_standing_avg',
        targetValue: 69,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Verdict carry', 'Phase transitions'],
  },
  {
    id: 'o10m_acquittal_verdict_finale',
    title: 'Acquittal Verdict Finale',
    description: 'Finale acquittal stage — net worth gate with full verdict bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100501,
    startingMoney: 4300,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_acquittal_verdict_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100501),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mAcquittalVerdictFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_avf_obj_net',
        label: 'Verdict Net Worth',
        description: 'Reach $19,200 net worth',
        targetType: 'netWorth',
        targetValue: 19200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Acquittal finales', 'Verdict ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_exoneration_claim_docket',
    title: 'Exoneration Claim Docket',
    description: 'Open an exoneration arc with low-pressure restitution pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100502,
    startingMoney: 3350,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_exoneration_claim_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100502),
      o10mExonerationClaimDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_ecd_obj_day',
        label: 'Claim Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Exoneration arcs', 'Restitution pacing', 'Claim phase'],
  },
  {
    id: 'o10m_exoneration_review_chamber',
    title: 'Exoneration Review Chamber',
    description: 'Mid-exoneration review with accrued restitution bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100503,
    startingMoney: 3900,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 64, WA: 62 },
    badgeId: 'badge_o10m_exoneration_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100503),
      regionalStandingEnabled: true,
      o10mExonerationReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_erc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 70',
        targetType: 'multi_actor_standing_avg',
        targetValue: 70,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Restitution carry', 'Phase transitions'],
  },
  {
    id: 'o10m_exoneration_clearance_finale',
    title: 'Exoneration Clearance Finale',
    description: 'Finale exoneration stage — net worth gate with full restitution bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100504,
    startingMoney: 4350,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_exoneration_clearance_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100504),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mExonerationClearanceFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_ecf_obj_net',
        label: 'Clearance Net Worth',
        description: 'Reach $19,400 net worth',
        targetType: 'netWorth',
        targetValue: 19400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Exoneration finales', 'Restitution ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_expungement_filing_docket',
    title: 'Expungement Filing Docket',
    description: 'Open an expungement arc with low-pressure seal pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100505,
    startingMoney: 3400,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_expungement_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100505),
      o10mExpungementFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_efd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Expungement arcs', 'Seal pacing', 'Filing phase'],
  },
  {
    id: 'o10m_expungement_review_chamber',
    title: 'Expungement Review Chamber',
    description: 'Mid-expungement review with accrued seal bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100506,
    startingMoney: 3950,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 65, WA: 63 },
    badgeId: 'badge_o10m_expungement_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100506),
      regionalStandingEnabled: true,
      o10mExpungementReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_erc2_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 71',
        targetType: 'multi_actor_standing_avg',
        targetValue: 71,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Seal carry', 'Phase transitions'],
  },
  {
    id: 'o10m_expungement_seal_finale',
    title: 'Expungement Seal Finale',
    description: 'Finale expungement stage — net worth gate with full seal bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100507,
    startingMoney: 4400,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_expungement_seal_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100507),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mExpungementSealFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_esf_obj_net',
        label: 'Seal Net Worth',
        description: 'Reach $19,600 net worth',
        targetType: 'netWorth',
        targetValue: 19600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Expungement finales', 'Seal ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_vacatur_petition_docket',
    title: 'Vacatur Petition Docket',
    description: 'Open a vacatur arc with low-pressure merit pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100508,
    startingMoney: 3450,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_vacatur_petition_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100508),
      o10mVacaturPetitionDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_vpd_obj_day',
        label: 'Petition Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Vacatur arcs', 'Merit pacing', 'Petition phase'],
  },
  {
    id: 'o10m_vacatur_review_chamber',
    title: 'Vacatur Review Chamber',
    description: 'Mid-vacatur review with accrued merit bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100509,
    startingMoney: 4000,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 66, WA: 64 },
    badgeId: 'badge_o10m_vacatur_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100509),
      regionalStandingEnabled: true,
      o10mVacaturReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_vrc2_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 72',
        targetType: 'multi_actor_standing_avg',
        targetValue: 72,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Merit carry', 'Phase transitions'],
  },
  {
    id: 'o10m_vacatur_merit_finale',
    title: 'Vacatur Merit Finale',
    description: 'Finale vacatur stage — net worth gate with full merit bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100510,
    startingMoney: 4450,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_vacatur_merit_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100510),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mVacaturMeritFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_vmf_obj_net',
        label: 'Merit Net Worth',
        description: 'Reach $19,800 net worth',
        targetType: 'netWorth',
        targetValue: 19800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Vacatur finales', 'Merit ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_remand_order_docket',
    title: 'Remand Order Docket',
    description: 'Open a remand arc with low-pressure weight pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100511,
    startingMoney: 3500,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_remand_order_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100511),
      o10mRemandOrderDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_rod_obj_day',
        label: 'Order Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Remand arcs', 'Weight pacing', 'Order phase'],
  },
  {
    id: 'o10m_remand_review_chamber',
    title: 'Remand Review Chamber',
    description: 'Mid-remand review with accrued weight bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100512,
    startingMoney: 4050,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 67, WA: 65 },
    badgeId: 'badge_o10m_remand_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100512),
      regionalStandingEnabled: true,
      o10mRemandReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_rrc2_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 73',
        targetType: 'multi_actor_standing_avg',
        targetValue: 73,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Weight carry', 'Phase transitions'],
  },
  {
    id: 'o10m_remand_weight_finale',
    title: 'Remand Weight Finale',
    description: 'Finale remand stage — net worth gate with full weight bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100513,
    startingMoney: 4500,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_remand_weight_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100513),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mRemandWeightFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_rwf_obj_net',
        label: 'Weight Net Worth',
        description: 'Reach $20,000 net worth',
        targetType: 'netWorth',
        targetValue: 20000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Remand finales', 'Weight ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_reversal_motion_docket',
    title: 'Reversal Motion Docket',
    description: 'Open a reversal arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100514,
    startingMoney: 3550,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_reversal_motion_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100514),
      o10mReversalMotionDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_rmd_obj_day',
        label: 'Motion Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reversal arcs', 'Score pacing', 'Motion phase'],
  },
  {
    id: 'o10m_reversal_review_chamber',
    title: 'Reversal Review Chamber',
    description: 'Mid-reversal review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100515,
    startingMoney: 4100,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 68, WA: 66 },
    badgeId: 'badge_o10m_reversal_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100515),
      regionalStandingEnabled: true,
      o10mReversalReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_rrc3_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 74',
        targetType: 'multi_actor_standing_avg',
        targetValue: 74,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_reversal_score_finale',
    title: 'Reversal Score Finale',
    description: 'Finale reversal stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100516,
    startingMoney: 4550,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_reversal_score_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100516),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mReversalScoreFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_rsf_obj_net',
        label: 'Score Net Worth',
        description: 'Reach $20,200 net worth',
        targetType: 'netWorth',
        targetValue: 20200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reversal finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_annulment_filing_docket',
    title: 'Annulment Filing Docket',
    description: 'Open an annulment arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100517,
    startingMoney: 3600,
    startingRegions: ['TAS', 'VIC'],
    badgeId: 'badge_o10m_annulment_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100517),
      o10mAnnulmentFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_afd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Annulment arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_annulment_review_chamber',
    title: 'Annulment Review Chamber',
    description: 'Mid-annulment review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100518,
    startingMoney: 4150,
    startingRegions: ['NSW', 'WA'],
    startingStanding: { NSW: 69, WA: 67 },
    badgeId: 'badge_o10m_annulment_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100518),
      regionalStandingEnabled: true,
      o10mAnnulmentReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_arc3_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_annulment_nullity_finale',
    title: 'Annulment Nullity Finale',
    description: 'Finale annulment stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100519,
    startingMoney: 4600,
    startingRegions: ['QLD', 'NT', 'SA'],
    badgeId: 'badge_o10m_annulment_nullity_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100519),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mAnnulmentNullityFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_anf_obj_net',
        label: 'Nullity Net Worth',
        description: 'Reach $20,600 net worth',
        targetType: 'netWorth',
        targetValue: 20600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Annulment finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_reinstatement_filing_docket',
    title: 'Reinstatement Filing Docket',
    description: 'Open a reinstatement arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100520,
    startingMoney: 3650,
    startingRegions: ['NSW', 'ACT'],
    badgeId: 'badge_o10m_reinstatement_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100520),
      o10mReinstatementFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_rfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reinstatement arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_reinstatement_review_chamber',
    title: 'Reinstatement Review Chamber',
    description: 'Mid-reinstatement review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100521,
    startingMoney: 4200,
    startingRegions: ['VIC', 'TAS'],
    startingStanding: { VIC: 68, TAS: 66 },
    badgeId: 'badge_o10m_reinstatement_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100521),
      regionalStandingEnabled: true,
      o10mReinstatementReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_rrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_reinstatement_restoration_finale',
    title: 'Reinstatement Restoration Finale',
    description: 'Finale reinstatement stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100522,
    startingMoney: 4650,
    startingRegions: ['SA', 'NT', 'WA'],
    badgeId: 'badge_o10m_reinstatement_restoration_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100522),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mReinstatementRestorationFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_rrf_obj_net',
        label: 'Restoration Net Worth',
        description: 'Reach $20,800 net worth',
        targetType: 'netWorth',
        targetValue: 20800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Reinstatement finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_setaside_filing_docket',
    title: 'Set-Aside Filing Docket',
    description: 'Open a set-aside arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100523,
    startingMoney: 3700,
    startingRegions: ['QLD', 'NSW'],
    badgeId: 'badge_o10m_setaside_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100523),
      o10mSetAsideFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_sfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Set-aside arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_setaside_review_chamber',
    title: 'Set-Aside Review Chamber',
    description: 'Mid set-aside review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100524,
    startingMoney: 4250,
    startingRegions: ['WA', 'NT'],
    startingStanding: { WA: 69, NT: 67 },
    badgeId: 'badge_o10m_setaside_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100524),
      regionalStandingEnabled: true,
      o10mSetAsideReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_src_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_setaside_relief_finale',
    title: 'Set-Aside Relief Finale',
    description: 'Finale set-aside stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100525,
    startingMoney: 4700,
    startingRegions: ['VIC', 'TAS', 'SA'],
    badgeId: 'badge_o10m_setaside_relief_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100525),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mSetAsideReliefFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_srf_obj_net',
        label: 'Relief Net Worth',
        description: 'Reach $21,000 net worth',
        targetType: 'netWorth',
        targetValue: 21000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Set-aside finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_quash_filing_docket',
    title: 'Quash Filing Docket',
    description: 'Open a quash arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100526,
    startingMoney: 3750,
    startingRegions: ['ACT', 'NSW'],
    badgeId: 'badge_o10m_quash_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100526),
      o10mQuashFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_qfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Quash arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_quash_review_chamber',
    title: 'Quash Review Chamber',
    description: 'Mid quash review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100527,
    startingMoney: 4300,
    startingRegions: ['TAS', 'VIC'],
    startingStanding: { TAS: 70, VIC: 68 },
    badgeId: 'badge_o10m_quash_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100527),
      regionalStandingEnabled: true,
      o10mQuashReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_qrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_quash_vacate_finale',
    title: 'Quash Vacate Finale',
    description: 'Finale quash stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100528,
    startingMoney: 4750,
    startingRegions: ['NT', 'WA', 'SA'],
    badgeId: 'badge_o10m_quash_vacate_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100528),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mQuashVacateFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_qvf_obj_net',
        label: 'Vacate Net Worth',
        description: 'Reach $21,200 net worth',
        targetType: 'netWorth',
        targetValue: 21200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Quash finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_supersede_filing_docket',
    title: 'Supersede Filing Docket',
    description: 'Open a supersede arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100529,
    startingMoney: 3800,
    startingRegions: ['WA', 'SA'],
    badgeId: 'badge_o10m_supersede_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100529),
      o10mSupersedeFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_sufd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Supersede arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_supersede_review_chamber',
    title: 'Supersede Review Chamber',
    description: 'Mid supersede review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100530,
    startingMoney: 4350,
    startingRegions: ['QLD', 'NSW'],
    startingStanding: { QLD: 71, NSW: 69 },
    badgeId: 'badge_o10m_supersede_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100530),
      regionalStandingEnabled: true,
      o10mSupersedeReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_surc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_supersede_stay_finale',
    title: 'Supersede Stay Finale',
    description: 'Finale supersede stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100531,
    startingMoney: 4800,
    startingRegions: ['ACT', 'VIC', 'TAS'],
    badgeId: 'badge_o10m_supersede_stay_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100531),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mSupersedeStayFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_ssf_obj_net',
        label: 'Stay Net Worth',
        description: 'Reach $21,400 net worth',
        targetType: 'netWorth',
        targetValue: 21400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Supersede finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_certiorari_filing_docket',
    title: 'Certiorari Filing Docket',
    description: 'Open a certiorari arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100532,
    startingMoney: 3850,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_certiorari_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100532),
      o10mCertiorariFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_cfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Certiorari arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_certiorari_review_chamber',
    title: 'Certiorari Review Chamber',
    description: 'Mid certiorari review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100533,
    startingMoney: 4400,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_certiorari_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100533),
      regionalStandingEnabled: true,
      o10mCertiorariReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_crc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_certiorari_mandate_finale',
    title: 'Certiorari Mandate Finale',
    description: 'Finale certiorari stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100534,
    startingMoney: 4850,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_certiorari_mandate_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100534),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mCertiorariMandateFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_cmf_obj_net',
        label: 'Mandate Net Worth',
        description: 'Reach $21,800 net worth',
        targetType: 'netWorth',
        targetValue: 21800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Certiorari finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_mandamus_filing_docket',
    title: 'Mandamus Filing Docket',
    description: 'Open a mandamus arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100535,
    startingMoney: 3900,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_mandamus_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100535),
      o10mMandamusFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_mfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Mandamus arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_mandamus_review_chamber',
    title: 'Mandamus Review Chamber',
    description: 'Mid mandamus review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100536,
    startingMoney: 4450,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_mandamus_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100536),
      regionalStandingEnabled: true,
      o10mMandamusReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_mrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_mandamus_writ_finale',
    title: 'Mandamus Writ Finale',
    description: 'Finale mandamus stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100537,
    startingMoney: 4900,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_mandamus_writ_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100537),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mMandamusWritFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_mwf_obj_net',
        label: 'Writ Net Worth',
        description: 'Reach $22,000 net worth',
        targetType: 'netWorth',
        targetValue: 22000,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Mandamus finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_prohibition_filing_docket',
    title: 'Prohibition Filing Docket',
    description: 'Open a prohibition arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100538,
    startingMoney: 3950,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_prohibition_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100538),
      o10mProhibitionFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_pfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Prohibition arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_prohibition_review_chamber',
    title: 'Prohibition Review Chamber',
    description: 'Mid prohibition review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100539,
    startingMoney: 4500,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_prohibition_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100539),
      regionalStandingEnabled: true,
      o10mProhibitionReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_prc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_prohibition_order_finale',
    title: 'Prohibition Order Finale',
    description: 'Finale prohibition stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100540,
    startingMoney: 4950,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_prohibition_order_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100540),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mProhibitionOrderFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_pof_obj_net',
        label: 'Order Net Worth',
        description: 'Reach $22,200 net worth',
        targetType: 'netWorth',
        targetValue: 22200,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Prohibition finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_habeas_filing_docket',
    title: 'Habeas Filing Docket',
    description: 'Open a habeas arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100541,
    startingMoney: 4000,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_habeas_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100541),
      o10mHabeasFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_hfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Habeas arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_habeas_review_chamber',
    title: 'Habeas Review Chamber',
    description: 'Mid habeas review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100542,
    startingMoney: 4550,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_habeas_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100542),
      regionalStandingEnabled: true,
      o10mHabeasReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_hrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_habeas_corpus_finale',
    title: 'Habeas Corpus Finale',
    description: 'Finale habeas stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100543,
    startingMoney: 5000,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_habeas_corpus_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100543),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mHabeasCorpusFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_hcf_obj_net',
        label: 'Corpus Net Worth',
        description: 'Reach $22,400 net worth',
        targetType: 'netWorth',
        targetValue: 22400,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Habeas finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_quowarranto_filing_docket',
    title: 'Quo Warranto Filing Docket',
    description: 'Open a quo warranto arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100544,
    startingMoney: 4050,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_quowarranto_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100544),
      o10mQuowarrantoFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_qfd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Quo warranto arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_quowarranto_review_chamber',
    title: 'Quo Warranto Review Chamber',
    description: 'Mid quo warranto review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100545,
    startingMoney: 4600,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_quowarranto_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100545),
      regionalStandingEnabled: true,
      o10mQuowarrantoReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_qrc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_quowarranto_warrant_finale',
    title: 'Quo Warranto Warrant Finale',
    description: 'Finale quo warranto stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100546,
    startingMoney: 5050,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_quowarranto_warrant_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100546),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mQuowarrantoWarrantFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_qwf_obj_net',
        label: 'Warrant Net Worth',
        description: 'Reach $22,600 net worth',
        targetType: 'netWorth',
        targetValue: 22600,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Quo warranto finales', 'Score ledger', 'Unlock tokens'],
  },
  {
    id: 'o10m_injunction_filing_docket',
    title: 'Injunction Filing Docket',
    description: 'Open an injunction arc with low-pressure score pacing before review.',
    category: 'experimental',
    difficulty: 'Easy',
    complexity: 'Beginner',
    forcedSeed: 100547,
    startingMoney: 4100,
    startingRegions: ['NT', 'QLD'],
    badgeId: 'badge_o10m_injunction_filing_docket',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100547),
      o10mInjunctionFilingDocket: true,
      totalDays: 8,
    },
    objectives: [
      {
        id: 'o10m_ifd_obj_day',
        label: 'Filing Window',
        description: 'Reach day 3',
        targetType: 'daysPassed',
        targetValue: 3,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Injunction arcs', 'Score pacing', 'Filing phase'],
  },
  {
    id: 'o10m_injunction_review_chamber',
    title: 'Injunction Review Chamber',
    description: 'Mid injunction review with accrued score bonus applied at start.',
    category: 'challenge',
    difficulty: 'Medium',
    complexity: 'Intermediate',
    forcedSeed: 100548,
    startingMoney: 4650,
    startingRegions: ['WA', 'SA'],
    startingStanding: { WA: 72, SA: 70 },
    badgeId: 'badge_o10m_injunction_review_chamber',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100548),
      regionalStandingEnabled: true,
      o10mInjunctionReviewChamber: true,
      totalDays: 11,
    },
    objectives: [
      {
        id: 'o10m_irc_obj_avg',
        label: 'Review Threshold',
        description: 'Average standing of 75',
        targetType: 'multi_actor_standing_avg',
        targetValue: 75,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Review chamber', 'Score carry', 'Phase transitions'],
  },
  {
    id: 'o10m_injunction_relief_finale',
    title: 'Injunction Relief Finale',
    description: 'Finale injunction stage — net worth gate with full score bonus at start.',
    category: 'expert',
    difficulty: 'Hard',
    complexity: 'Advanced',
    forcedSeed: 100549,
    startingMoney: 5100,
    startingRegions: ['ACT', 'NSW', 'VIC'],
    badgeId: 'badge_o10m_injunction_relief_finale',
    unlockedByDefault: true,
    author: 'Operation10M',
    forcedSettings: {
      ...deterministic(100549),
      regionalStandingEnabled: true,
      crisisChainEnabled: true,
      o10mInjunctionReliefFinale: true,
      totalDays: 14,
    },
    objectives: [
      {
        id: 'o10m_irf_obj_net',
        label: 'Relief Net Worth',
        description: 'Reach $22,800 net worth',
        targetType: 'netWorth',
        targetValue: 22800,
        isPrimary: true,
      },
    ],
    modifiers: [],
    youWillLearn: ['Injunction finales', 'Score ledger', 'Unlock tokens'],
  },
];

export const O10M_SCENARIO_IDS = O10M_OPERATION_SCENARIOS.map(s => s.id);

export function findO10mScenario(id: string): PresetScenario | undefined {
  return O10M_OPERATION_SCENARIOS.find(s => s.id === id);
}

// --- bundled from src/challenge-modes.ts ---
export const O10M_CHALLENGE_MODES: O10mChallengeMode[] = [
  {
    id: 'o10m_ap_sprint',
    title: 'Action Sprint',
    description: 'Tighter action economy — shared AP costs increase by one for deposit and travel actions.',
    compatibleBaseModes: ['ai', 'grand_tour', 'scenario', 'team_human_ai_vs_ai_ai'],
    incompatibleBaseModes: ['single', 'team_ai_vs_ai'],
    forcedSettingsPatch: {
      actionLimitsEnabled: true,
      o10mChallengeApSprint: true,
    },
    modifiers: [
      {
        id: 'o10m_ap_sprint_deposit',
        name: 'Sprint Deposit Tax',
        description: 'Region deposit actions cost +1 AP.',
        domain: 'turn_limits',
        targetKey: 'actionCosts.region_deposit',
        value: 2,
        isGlobal: true,
      },
    ],
  },
  {
    id: 'o10m_ironman',
    title: 'Ironman Ledger',
    description: 'Disables mid-run save intent flags used by scenario recovery flows.',
    compatibleBaseModes: ['ai', 'scenario', 'grand_tour'],
    incompatibleBaseModes: ['team_ai_vs_ai'],
    forcedSettingsPatch: {
      o10mIronmanNoMidRunSave: true,
      quickSaveEnabled: false,
    },
    modifiers: [],
  },
  {
    id: 'o10m_rival_intensity',
    title: 'Rival Intensity',
    description: 'Raises AI fairness pressure slightly for solo and team human-AI modes.',
    compatibleBaseModes: ['ai', 'grand_tour', 'scenario', 'team_human_ai_vs_ai_ai'],
    incompatibleBaseModes: ['single'],
    forcedSettingsPatch: {
      aiFairnessLevel: 0.93,
      o10mRivalIntensity: true,
    },
    modifiers: [
      {
        id: 'o10m_rival_market',
        name: 'Hot Market Response',
        description: 'AI market reaction bias increases.',
        domain: 'ai_behavior',
        targetKey: 'aiUsesMarketModifiers',
        value: true,
        isGlobal: true,
      },
    ],
  },
  {
    id: 'o10m_contract_focus',
    title: 'Contract Focus',
    description: 'Forces regional contracts on and increases abundance for scenario grinds.',
    compatibleBaseModes: ['scenario', 'ai'],
    incompatibleBaseModes: ['grand_tour', 'team_ai_vs_ai', 'single'],
    forcedSettingsPatch: {
      regionalContractsEnabled: true,
      v93ContractAbundance: 'abundant',
      o10mContractFocus: true,
    },
    modifiers: [],
  },
  {
    id: 'o10m_stability_focus',
    title: 'Stability Focus',
    description: 'Elevates public stability systems and dampens sabotage frequency in scenario matches.',
    compatibleBaseModes: ['scenario', 'ai', 'team_human_ai_vs_ai_ai'],
    incompatibleBaseModes: ['single'],
    forcedSettingsPatch: {
      publicStabilityEnabled: true,
      sabotageEnabled: false,
      o10mStabilityFocus: true,
    },
    modifiers: [
      {
        id: 'o10m_stability_decay_relief',
        name: 'Stability Relief',
        description: 'Slows stability decay during crisis spikes.',
        domain: 'stability',
        targetKey: 'publicStabilityDecayMultiplier',
        value: 0.9,
        isGlobal: true,
      },
    ],
  },
];

const CHALLENGE_BY_ID: Record<O10mChallengeModeId, O10mChallengeMode> = O10M_CHALLENGE_MODES.reduce(
  (acc, mode) => {
    acc[mode.id] = mode;
    return acc;
  },
  {} as Record<O10mChallengeModeId, O10mChallengeMode>,
);

export function getO10mChallengeMode(id: O10mChallengeModeId): O10mChallengeMode {
  return CHALLENGE_BY_ID[id];
}

export function listO10mChallengeModeIds(): O10mChallengeModeId[] {
  return O10M_CHALLENGE_MODES.map(m => m.id);
}

// --- bundled from src/mission-milestones.ts ---
export const O10M_MISSION_MILESTONES: O10mMissionMilestone[] = [
  {
    id: 'o10m_milestone_first_o10m_scenario',
    title: 'Operation Briefing',
    description: 'Complete any Operation 10M scenario with a primary victory.',
    category: 'scenario',
    badgeId: 'badge_o10m_milestone_first_scenario',
  },
  {
    id: 'o10m_milestone_challenge_stack',
    title: 'Stacked Discipline',
    description: 'Win an O10M scenario with two challenge overlays active.',
    category: 'challenge',
    badgeId: 'badge_o10m_milestone_challenge_stack',
  },
  {
    id: 'o10m_milestone_grand_tour_bridge',
    title: 'Tour Bridge',
    description: 'Complete Grand Tour Prologue in grand_tour or scenario base mode.',
    category: 'mode',
    badgeId: 'badge_o10m_milestone_grand_tour_bridge',
  },
  {
    id: 'o10m_milestone_alt_victory',
    title: 'Alternate Mandate',
    description: 'Secure an alternate victory rule on an O10M scenario.',
    category: 'victory',
    badgeId: 'badge_o10m_milestone_alt_victory',
  },
  {
    id: 'o10m_milestone_team_ledger',
    title: 'Team Ledger Clear',
    description: 'Primary-clear Team Ledger in team_human_ai_vs_ai_ai mode.',
    category: 'mode',
    badgeId: 'badge_o10m_milestone_team_ledger',
  },
  {
    id: 'o10m_milestone_chain_complete',
    title: 'Chain Finisher',
    description: 'Complete any O10M multi-step scenario chain.',
    category: 'scenario',
    badgeId: 'badge_o10m_milestone_chain_complete',
  },
  {
    id: 'o10m_milestone_autoplay_observatory',
    title: 'Observatory Clear',
    description: 'Primary-clear Autoplay Observatory in team_ai_vs_ai mode.',
    category: 'mode',
    badgeId: 'badge_o10m_milestone_autoplay_observatory',
  },
];

function checkMilestone(m: O10mMissionMilestone, run: O10mRunSummary): boolean {
  switch (m.id) {
    case 'o10m_milestone_first_o10m_scenario':
      return Boolean(run.scenarioId?.startsWith('o10m_')) && run.primaryVictory;
    case 'o10m_milestone_challenge_stack':
      return run.primaryVictory && run.challengeModeIds.length >= 2;
    case 'o10m_milestone_grand_tour_bridge':
      return (
        run.scenarioId === 'o10m_grand_tour_prologue' &&
        run.primaryVictory &&
        (run.baseMode === 'grand_tour' || run.baseMode === 'scenario')
      );
    case 'o10m_milestone_alt_victory':
      return run.altVictoryRuleId !== null;
    case 'o10m_milestone_team_ledger':
      return (
        run.scenarioId === 'o10m_team_ledger' &&
        run.baseMode === 'team_human_ai_vs_ai_ai' &&
        run.primaryVictory
      );
    case 'o10m_milestone_silent_perfection':
      return run.scenarioId === 'o10m_silent_diplomat' && run.optionalObjectivesCompleted >= 1 && run.primaryVictory;
    case 'o10m_milestone_chain_complete':
      return Boolean(run.scenarioId?.startsWith('o10m_')) && run.primaryVictory && run.chainCompleted === true;
    case 'o10m_milestone_autoplay_observatory':
      return (
        run.scenarioId === 'o10m_autoplay_observatory' &&
        run.baseMode === 'team_ai_vs_ai' &&
        run.primaryVictory
      );
    default:
      return false;
  }
}

export function evaluateMissionMilestones(
  runs: O10mRunSummary[],
  existing: O10mMilestoneProgress[] = [],
): O10mMilestoneProgress[] {
  const byId = new Map(existing.map(p => [p.milestoneId, p]));
  for (const milestone of O10M_MISSION_MILESTONES) {
    const prev = byId.get(milestone.id) ?? {
      milestoneId: milestone.id,
      unlocked: false,
      unlockedAtRunCount: 0,
    };
    if (prev.unlocked) {
      byId.set(milestone.id, prev);
      continue;
    }
    const unlockRunIndex = runs.findIndex(r => checkMilestone(milestone, r));
    if (unlockRunIndex >= 0) {
      byId.set(milestone.id, {
        milestoneId: milestone.id,
        unlocked: true,
        unlockedAtRunCount: unlockRunIndex + 1,
      });
    } else {
      byId.set(milestone.id, prev);
    }
  }
  return O10M_MISSION_MILESTONES.map(m => byId.get(m.id)!);
}

export function countUnlockedMilestones(progress: O10mMilestoneProgress[]): number {
  return progress.filter(p => p.unlocked).length;
}

// --- bundled from src/alt-victory.ts ---
export const O10M_ALT_VICTORY_RULES: O10mAltVictoryRule[] = [
  {
    id: 'o10m_diplomatic_consensus',
    title: 'Diplomatic Consensus',
    description: 'Win without eliminating the rival when average standing and governance thresholds are met.',
    scenarioIds: ['o10m_silent_diplomat', 'o10m_team_ledger'],
    allowsPrimaryIncomplete: true,
  },
  {
    id: 'o10m_economic_dominance',
    title: 'Economic Dominance',
    description: 'Player net worth is at least double rival net worth at day limit minus one.',
    scenarioIds: '*',
    allowsPrimaryIncomplete: true,
  },
  {
    id: 'o10m_speed_primary_clear',
    title: 'Speed Clear',
    description: 'All primary objectives complete on or before day 14.',
    scenarioIds: ['o10m_export_clock', 'o10m_grand_tour_prologue'],
    allowsPrimaryIncomplete: false,
  },
  {
    id: 'o10m_optional_perfection',
    title: 'Optional Perfection',
    description: 'All objectives including optional ones are complete while primary victory is already true.',
    scenarioIds: '*',
    allowsPrimaryIncomplete: false,
  },
];

const RULES_BY_ID: Record<O10mAltVictoryRuleId, O10mAltVictoryRule> = O10M_ALT_VICTORY_RULES.reduce(
  (acc, rule) => {
    acc[rule.id] = rule;
    return acc;
  },
  {} as Record<O10mAltVictoryRuleId, O10mAltVictoryRule>,
);

export function getO10mAltVictoryRule(id: O10mAltVictoryRuleId): O10mAltVictoryRule {
  return RULES_BY_ID[id];
}

export interface AltVictoryEvalResult {
  triggered: boolean;
  ruleId: O10mAltVictoryRuleId | null;
  reason: string;
}

function scenarioMatchesRule(scenarioId: string, rule: O10mAltVictoryRule): boolean {
  if (rule.scenarioIds === '*') return scenarioId.startsWith('o10m_');
  return rule.scenarioIds.includes(scenarioId);
}

function evaluateRule(
  rule: O10mAltVictoryRule,
  scenarioId: string,
  primary: ScenarioOutcome,
  context: ScenarioEvalContext,
): AltVictoryEvalResult {
  if (!scenarioMatchesRule(scenarioId, rule)) {
    return { triggered: false, ruleId: null, reason: 'Scenario not eligible for rule.' };
  }

  if (!rule.allowsPrimaryIncomplete && !primary.allPrimaryCompleted) {
    return { triggered: false, ruleId: null, reason: 'Primary objectives incomplete.' };
  }

  const standingValues = Object.values(context.player.regionalStanding || {});
  const avgStanding = standingValues.length
    ? standingValues.reduce((a, b) => a + b, 0) / standingValues.length
    : 0;
  const proposalsPassed = (context.gameState.proposals || []).filter(p => p.status === 'passed').length;
  const playerNw = context.player.money ?? 0; // standalone snapshot uses money as NW proxy when investments absent
  const rivalNw = context.aiPlayer.money ?? 0;
  const day = context.gameState.day;

  switch (rule.id) {
    case 'o10m_diplomatic_consensus': {
      const aiEliminated = (context.aiPlayer.money ?? 0) < 0 && (context.gameState.bankruptcyTracker?.ai ?? 0) >= 3;
      const ok = !aiEliminated && avgStanding >= 55 && proposalsPassed >= 1;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Diplomatic consensus: high standing without rival elimination.' }
        : { triggered: false, ruleId: null, reason: 'Diplomatic thresholds not met.' };
    }
    case 'o10m_economic_dominance': {
      const ok = playerNw >= rivalNw * 2 && rivalNw > 0;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Economic dominance: net worth doubled rival.' }
        : { triggered: false, ruleId: null, reason: 'Dominance ratio not met.' };
    }
    case 'o10m_speed_primary_clear': {
      const ok = primary.allPrimaryCompleted && day <= 14;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Speed clear: primaries finished by day 14.' }
        : { triggered: false, ruleId: null, reason: 'Speed day threshold missed.' };
    }
    case 'o10m_optional_perfection': {
      const ok = primary.allOptionalCompleted && primary.isVictory;
      return ok
        ? { triggered: true, ruleId: rule.id, reason: 'Optional perfection: all objectives complete.' }
        : { triggered: false, ruleId: null, reason: 'Optional objectives incomplete.' };
    }
    default:
      return { triggered: false, ruleId: null, reason: 'Unknown rule.' };
  }
}

export function evaluateO10mAltVictory(
  scenarioId: string,
  primary: ScenarioOutcome,
  context: ScenarioEvalContext,
): AltVictoryEvalResult {
  for (const rule of O10M_ALT_VICTORY_RULES) {
    const result = evaluateRule(rule, scenarioId, primary, context);
    if (result.triggered) return result;
  }
  return { triggered: false, ruleId: null, reason: 'No alternate victory triggered.' };
}

/** Standalone primary outcome evaluator (subset of canonical `evaluateScenarioOutcome`). */
export function evaluateO10mScenarioPrimaryOutcome(
  objectives: ScenarioObjective[],
  context: ScenarioEvalContext,
): ScenarioOutcome {
  const objectivesProgress: ScenarioOutcome['objectivesProgress'] = {};
  let primaryCount = 0;
  let primaryCompletedCount = 0;
  let totalCompleted = 0;

  for (const obj of objectives) {
    const prog = evaluateScenarioObjectiveProgress(obj, context);
    objectivesProgress[obj.id] = prog;
    const isPrimary = obj.isPrimary ?? true;
    if (isPrimary) {
      primaryCount++;
      if (prog.completed) primaryCompletedCount++;
    }
    if (prog.completed) totalCompleted++;
  }

  const allPrimaryCompleted = primaryCount > 0 && primaryCompletedCount === primaryCount;
  const allOptionalCompleted = totalCompleted === objectives.length;
  const day = context.gameState.day;
  const bankrupt = (context.player.money ?? 0) < 0 && (context.gameState.bankruptcyTracker?.player ?? 0) >= 3;
  const maxDays = context.gameSettings.totalDays;

  let isGameOver = false;
  let isVictory = false;
  let isDefeat = false;
  let reason = '';

  if (allPrimaryCompleted) {
    isGameOver = true;
    isVictory = true;
    reason = `Scenario victory on day ${day}.`;
  } else if (bankrupt) {
    isGameOver = true;
    isDefeat = true;
    reason = `Bankruptcy on day ${day}.`;
  } else if (day > maxDays) {
    isGameOver = true;
    isDefeat = true;
    reason = `Day limit ${maxDays} exceeded.`;
  }

  return {
    isGameOver,
    isVictory,
    isDefeat,
    reason,
    objectivesProgress,
    allPrimaryCompleted,
    allOptionalCompleted,
    completedOnDay: day,
  };
}

// --- bundled from src/catalog.ts ---
export interface ScenarioCatalogMergeResult {
  scenarios: ScenarioDefinition[];
  o10mIds: string[];
  collisionIds: string[];
}

/** Append O10M presets after canonical `PRESET_GAME_SCENARIOS` without overwriting ids. */
export function mergePlayableScenarioCatalog(
  canonicalPresets: ScenarioDefinition[],
  o10mPresets: PresetScenario[] = O10M_OPERATION_SCENARIOS,
): ScenarioCatalogMergeResult {
  const canonicalIds = new Set(canonicalPresets.map(s => s.id));
  const collisionIds = o10mPresets.filter(s => canonicalIds.has(s.id)).map(s => s.id);
  const safeO10m = o10mPresets.filter(s => !canonicalIds.has(s.id));
  return {
    scenarios: [...canonicalPresets, ...safeO10m],
    o10mIds: safeO10m.map(s => s.id),
    collisionIds,
  };
}

export function indexScenariosById(scenarios: ScenarioDefinition[]): Map<string, ScenarioDefinition> {
  return new Map(scenarios.map(s => [s.id, s]));
}

// --- bundled from src/scenario-chains.ts ---
export const O10M_SCENARIO_CHAINS: O10mScenarioChain[] = [
  {
    id: 'o10m_chain_northern_corridor',
    title: 'Northern Corridor Arc',
    description:
      'Trade sprint into cyclone defense, then a decisive rival elimination finale across Queensland and the Top End.',
    completionBadgeId: 'badge_o10m_chain_northern_corridor',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_export_clock',
        title: 'Open the Export Window',
        narrativeBridge: 'Freight contracts flood the northern ports — prove you can bank cash before the cyclone season.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          startingMoneyDelta: 750,
          forcedSettingsPatch: { o10mChainNorthernExportComplete: true },
        },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Ride the Cyclone Season',
        narrativeBridge: 'The export windfall funds disaster relief — hold stability while rivals exploit the chaos.',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { QLD: 8, NT: 5 },
          forcedSettingsPatch: { o10mChainNorthernStabilityHeld: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_rival_elimination_classic',
        title: 'Sunshine Showdown',
        narrativeBridge: 'With corridors secured, eliminate the rival before they rebound in Queensland.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainNorthernComplete: true },
        },
      },
    ],
  },
  {
    id: 'o10m_chain_diplomatic_arc',
    title: 'Diplomatic Arc',
    description: 'Warm up on challenges, win without sabotage, then prove the coalition model in team co-pilot play.',
    completionBadgeId: 'badge_o10m_chain_diplomatic_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_grand_tour_prologue',
        title: 'Tour Discipline',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 400 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_silent_diplomat',
        title: 'Silent Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { ACT: 5, NSW: 5 },
          forcedSettingsPatch: { o10mChainDiplomaticTrust: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_team_ledger',
        title: 'Coalition Ledger',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainDiplomaticComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_resource_pressure',
    title: 'Resource Pressure Spiral',
    description: 'Battery rush liquidity, wheatbelt debt squeeze, then cyclone corridor under combined economic and stability stress.',
    completionBadgeId: 'badge_o10m_chain_resource_pressure',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_tas_battery_rush',
        title: 'Grid Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 600 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_wheatbelt_squeeze',
        title: 'Debt Squeeze',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainDebtLessons: true, advancedLoansEnabled: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Dual Stress Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainResourcePressureComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_capital_to_coast',
    title: 'Capital to Coast',
    description: 'Markets week in the capital, island supply stress, then an export sprint on the eastern seaboard.',
    completionBadgeId: 'badge_o10m_chain_capital_to_coast',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_capital_markets_week',
        title: 'Policy Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 500 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_island_supply_line',
        title: 'Bass Strait Stress',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { standingDelta: { TAS: 10 } },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_export_clock',
        title: 'Coastal Export Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCapitalToCoastComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_continuity_arc',
    title: 'Continuity Arc',
    description:
      'Validate save checkpoints, federation standing, then rebound trust after compound crises — round-4 campaign path.',
    completionBadgeId: 'badge_o10m_chain_continuity_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_continuity_drill',
        title: 'Checkpoint Discipline',
        narrativeBridge: 'Prove mid-campaign saves preserve chain and milestone state.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 350 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_federation_standing',
        title: 'Federation Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { NSW: 4, VIC: 4, SA: 4 },
          forcedSettingsPatch: { o10mChainContinuityFederationComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_standing_rebound',
        title: 'Trust Rebound',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainContinuityArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_marathon_sprint',
    title: 'Marathon Sprint',
    description:
      'Three-scenario gauntlet with save-safe marathon queue rotation — round-5 campaign path.',
    completionBadgeId: 'badge_o10m_chain_marathon_sprint',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_marathon_pace_setter',
        title: 'Pace Setter',
        narrativeBridge: 'Establish rhythm before the midfield hold.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_marathon_rhythm_hold',
        title: 'Rhythm Hold',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, SA: 6 },
          forcedSettingsPatch: { o10mMarathonMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_marathon_sprint_close',
        title: 'Sprint Close',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainMarathonSprintComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_iron_gauntlet',
    title: 'Iron Gauntlet',
    description:
      'Three-scenario lives-based gauntlet with ironman challenge lock-in — round-6 campaign path.',
    completionBadgeId: 'badge_o10m_chain_iron_gauntlet',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_gauntlet_opening_gate',
        title: 'Opening Gate',
        narrativeBridge: 'Prove the opening gate before the midfield press.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 250 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_gauntlet_midfield_press',
        title: 'Midfield Press',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 5, NSW: 5 },
          forcedSettingsPatch: { o10mGauntletMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_gauntlet_iron_finish',
        title: 'Iron Finish',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainIronGauntletComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_relay_convoy',
    title: 'Relay Convoy',
    description:
      'Three-scenario relay with save-safe carry accumulation between legs — round-7 campaign path.',
    completionBadgeId: 'badge_o10m_chain_relay_convoy',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_relay_dust_corridor',
        title: 'Dust Corridor',
        narrativeBridge: 'Establish convoy rhythm before the coastal handoff.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 180 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_relay_coastal_handoff',
        title: 'Coastal Handoff',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 5, SA: 5 },
          forcedSettingsPatch: { o10mRelayMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_relay_terminal_sprint',
        title: 'Terminal Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainRelayConvoyComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_summit_circuit',
    title: 'Summit Circuit',
    description:
      'Three-phase summit circuit with momentum accrual between legs — round-8 campaign path.',
    completionBadgeId: 'badge_o10m_chain_summit_circuit',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_circuit_warmup_laps',
        title: 'Warmup Laps',
        narrativeBridge: 'Build circuit rhythm before the ridge climb.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_circuit_ridge_climb',
        title: 'Ridge Climb',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 6 },
          forcedSettingsPatch: { o10mCircuitMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_circuit_summit_push',
        title: 'Summit Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSummitCircuitComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_expedition_arc',
    title: 'Expedition Arc',
    description:
      'Three-leg expedition with supply accrual between waypoints — round-9 campaign path.',
    completionBadgeId: 'badge_o10m_chain_expedition_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_expedition_departure_dock',
        title: 'Departure Dock',
        narrativeBridge: 'Stage supplies before the transit pass.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 190 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_expedition_transit_pass',
        title: 'Transit Pass',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NT: 5, QLD: 5 },
          forcedSettingsPatch: { o10mExpeditionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_expedition_arrival_haven',
        title: 'Arrival Haven',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExpeditionArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_odyssey_route',
    title: 'Odyssey Route',
    description:
      'Three-act odyssey with renown accrual between chapters — round-10 campaign path.',
    completionBadgeId: 'badge_o10m_chain_odyssey_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_odyssey_opening_winds',
        title: 'Opening Winds',
        narrativeBridge: 'Build renown rhythm before the shelf crossing.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 210 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_odyssey_crossing_shelves',
        title: 'Crossing Shelves',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 6 },
          forcedSettingsPatch: { o10mOdysseyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_odyssey_homecoming_harbor',
        title: 'Homecoming Harbor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainOdysseyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_pilgrimage_path',
    title: 'Pilgrimage Path',
    description:
      'Three-stage pilgrimage with devotion accrual between shrines — round-11 campaign path.',
    completionBadgeId: 'badge_o10m_chain_pilgrimage_path',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_pilgrimage_setting_out',
        title: 'Setting Out',
        narrativeBridge: 'Gather devotion before the midway shrine.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 205 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_pilgrimage_midway_shrine',
        title: 'Midway Shrine',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mPilgrimageMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_pilgrimage_sanctuary_rest',
        title: 'Sanctuary Rest',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainPilgrimagePathComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_caravan_route',
    title: 'Caravan Route',
    description:
      'Three-leg trade caravan with cargo accrual between stops — round-12 campaign path.',
    completionBadgeId: 'badge_o10m_chain_caravan_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_caravan_assembly_yard',
        title: 'Assembly Yard',
        narrativeBridge: 'Load cargo before the dune crossing.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 220 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_caravan_dune_crossing',
        title: 'Dune Crossing',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 6, NT: 5 },
          forcedSettingsPatch: { o10mCaravanMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_caravan_bazaar_finale',
        title: 'Bazaar Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCaravanRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_voyage_arc',
    title: 'Voyage Arc',
    description:
      'Three-segment coastal voyage with chart accrual between legs — round-13 campaign path.',
    completionBadgeId: 'badge_o10m_chain_voyage_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_voyage_embark_pier',
        title: 'Embark Pier',
        narrativeBridge: 'Plot charts before the open sea passage.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 230 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_voyage_open_sea_passage',
        title: 'Open Sea Passage',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 6, SA: 5 },
          forcedSettingsPatch: { o10mVoyageMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_voyage_port_call_finale',
        title: 'Port Call Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainVoyageArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_siege_arc',
    title: 'Siege Arc',
    description:
      'Three-phase fortress siege with morale accrual between legs — round-14 campaign path.',
    completionBadgeId: 'badge_o10m_chain_siege_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_siege_mustering_yard',
        title: 'Mustering Yard',
        narrativeBridge: 'Rally morale before the breach wall assault.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 240 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_siege_breach_wall',
        title: 'Breach Wall',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mSiegeMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_siege_relief_finale',
        title: 'Relief Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSiegeArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_convoy_route',
    title: 'Convoy Route',
    description:
      'Three-stage overland convoy with haul accrual between legs — round-15 campaign path.',
    completionBadgeId: 'badge_o10m_chain_convoy_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_convoy_staging_depot',
        title: 'Staging Depot',
        narrativeBridge: 'Load haul before the transit corridor run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 250 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_convoy_transit_corridor',
        title: 'Transit Corridor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 5 },
          forcedSettingsPatch: { o10mConvoyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_convoy_delivery_finale',
        title: 'Delivery Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainConvoyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_escort_route',
    title: 'Escort Route',
    description:
      'Three-phase VIP escort with trust accrual between legs — round-16 campaign path.',
    completionBadgeId: 'badge_o10m_chain_escort_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_escort_briefing_yard',
        title: 'Briefing Yard',
        narrativeBridge: 'Earn trust before the corridor patrol run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 260 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_escort_corridor_patrol',
        title: 'Corridor Patrol',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mEscortMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_escort_handoff_finale',
        title: 'Handoff Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainEscortRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_extraction_route',
    title: 'Extraction Route',
    description:
      'Three-phase asset extraction with asset accrual between legs — round-17 campaign path.',
    completionBadgeId: 'badge_o10m_chain_extraction_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_extraction_intel_brief',
        title: 'Intel Brief',
        narrativeBridge: 'Secure assets before the rescue run.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 270 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_extraction_rescue_site',
        title: 'Rescue Site',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mExtractionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_extraction_exfil_finale',
        title: 'Exfil Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExtractionRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_subject_route',
    title: 'Subject Route',
    description:
      'Three-phase subject investigation with fidelity accrual between legs — round-18 campaign path.',
    completionBadgeId: 'badge_o10m_chain_subject_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_subject_intake_brief',
        title: 'Intake Brief',
        narrativeBridge: 'Establish subject context before field probes.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 280 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_subject_probe_field',
        title: 'Probe Field',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 5, QLD: 6 },
          forcedSettingsPatch: { o10mSubjectMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_subject_verdict_finale',
        title: 'Verdict Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSubjectRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_witness_route',
    title: 'Witness Route',
    description:
      'Three-phase witness arc with credibility accrual between legs — round-19 campaign path.',
    completionBadgeId: 'badge_o10m_chain_witness_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_witness_brief_room',
        title: 'Brief Room',
        narrativeBridge: 'Establish witness context before testimony.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 290 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_witness_testimony_floor',
        title: 'Testimony Floor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, SA: 5 },
          forcedSettingsPatch: { o10mWitnessMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_witness_affirm_finale',
        title: 'Affirm Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainWitnessRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_tribunal_route',
    title: 'Tribunal Route',
    description:
      'Three-phase tribunal arc with gravitas accrual between legs — round-20 campaign path.',
    completionBadgeId: 'badge_o10m_chain_tribunal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_tribunal_docket_brief',
        title: 'Docket Brief',
        narrativeBridge: 'Open the docket before the hearing chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 300 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_tribunal_hearing_chamber',
        title: 'Hearing Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mTribunalMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_tribunal_seal_finale',
        title: 'Seal Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainTribunalRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_indictment_route',
    title: 'Indictment Route',
    description:
      'Three-phase indictment arc with case-weight accrual between legs — round-21 campaign path.',
    completionBadgeId: 'badge_o10m_chain_indictment_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_indictment_charge_docket',
        title: 'Charge Docket',
        narrativeBridge: 'File charges before the arraign bench.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 310 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_indictment_arraign_bench',
        title: 'Arraign Bench',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { QLD: 6, WA: 5 },
          forcedSettingsPatch: { o10mIndictmentMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_indictment_bind_finale',
        title: 'Bind Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainIndictmentRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_appeal_route',
    title: 'Appeal Route',
    description:
      'Three-phase appeal arc with merit accrual between legs — round-22 campaign path.',
    completionBadgeId: 'badge_o10m_chain_appeal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_appeal_petition_filing',
        title: 'Petition Filing',
        narrativeBridge: 'File petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 320 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_appeal_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { TAS: 6, NSW: 5 },
          forcedSettingsPatch: { o10mAppealMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_appeal_grant_finale',
        title: 'Grant Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainAppealRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_clemency_route',
    title: 'Clemency Route',
    description:
      'Three-phase clemency arc with mercy accrual between legs — round-23 campaign path.',
    completionBadgeId: 'badge_o10m_chain_clemency_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_clemency_plea_docket',
        title: 'Plea Docket',
        narrativeBridge: 'File plea before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 330 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_clemency_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { TAS: 6, VIC: 5 },
          forcedSettingsPatch: { o10mClemencyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_clemency_mercy_finale',
        title: 'Mercy Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainClemencyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_pardon_route',
    title: 'Pardon Route',
    description:
      'Three-phase pardon arc with grace accrual between legs — round-24 campaign path.',
    completionBadgeId: 'badge_o10m_chain_pardon_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_pardon_brief_docket',
        title: 'Brief Docket',
        narrativeBridge: 'File brief before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 340 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_pardon_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NT: 6, QLD: 5 },
          forcedSettingsPatch: { o10mPardonMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_pardon_grace_finale',
        title: 'Grace Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainPardonRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_amnesty_route',
    title: 'Amnesty Route',
    description:
      'Three-phase amnesty arc with absolution accrual between legs — round-25 campaign path.',
    completionBadgeId: 'badge_o10m_chain_amnesty_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_amnesty_warrant_docket',
        title: 'Warrant Docket',
        narrativeBridge: 'File warrant before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 350 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_amnesty_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NSW: 5 },
          forcedSettingsPatch: { o10mAmnestyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_amnesty_absolution_finale',
        title: 'Absolution Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainAmnestyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_reprieve_route',
    title: 'Reprieve Route',
    description:
      'Three-phase reprieve arc with relief accrual between legs — round-26 campaign path.',
    completionBadgeId: 'badge_o10m_chain_reprieve_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_reprieve_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File relief petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 360 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_reprieve_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mReprieveMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_reprieve_relief_finale',
        title: 'Relief Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainReprieveRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_parole_route',
    title: 'Parole Route',
    description:
      'Three-phase parole arc with trust accrual between legs — round-27 campaign path.',
    completionBadgeId: 'badge_o10m_chain_parole_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_parole_intake_docket',
        title: 'Intake Docket',
        narrativeBridge: 'File intake before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 370 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_parole_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mParoleMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_parole_release_finale',
        title: 'Release Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainParoleRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_probation_route',
    title: 'Probation Route',
    description:
      'Three-phase probation arc with compliance accrual between legs — round-28 campaign path.',
    completionBadgeId: 'badge_o10m_chain_probation_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_probation_enrollment_docket',
        title: 'Enrollment Docket',
        narrativeBridge: 'Enroll before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 380 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_probation_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mProbationMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_probation_clearance_finale',
        title: 'Clearance Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainProbationRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_commutation_route',
    title: 'Commutation Route',
    description:
      'Three-phase commutation arc with leniency accrual between legs — round-29 campaign path.',
    completionBadgeId: 'badge_o10m_chain_commutation_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_commutation_petition_docket',
        title: 'Petition Docket',
        narrativeBridge: 'File petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 390 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_commutation_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mCommutationMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_commutation_grant_finale',
        title: 'Grant Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCommutationRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_acquittal_route',
    title: 'Acquittal Route',
    description:
      'Three-phase acquittal arc with verdict accrual between legs — round-30 campaign path.',
    completionBadgeId: 'badge_o10m_chain_acquittal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_acquittal_brief_docket',
        title: 'Brief Docket',
        narrativeBridge: 'File brief before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 400 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_acquittal_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mAcquittalMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_acquittal_verdict_finale',
        title: 'Verdict Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainAcquittalRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_exoneration_route',
    title: 'Exoneration Route',
    description:
      'Three-phase exoneration arc with restitution accrual between legs — round-31 campaign path.',
    completionBadgeId: 'badge_o10m_chain_exoneration_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_exoneration_claim_docket',
        title: 'Claim Docket',
        narrativeBridge: 'File claim before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 410 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_exoneration_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mExonerationMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_exoneration_clearance_finale',
        title: 'Clearance Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExonerationRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_expungement_route',
    title: 'Expungement Route',
    description:
      'Three-phase expungement arc with seal accrual between legs — round-32 campaign path.',
    completionBadgeId: 'badge_o10m_chain_expungement_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_expungement_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 420 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_expungement_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mExpungementMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_expungement_seal_finale',
        title: 'Seal Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExpungementRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_vacatur_route',
    title: 'Vacatur Route',
    description:
      'Three-phase vacatur arc with merit accrual between legs — round-33 campaign path.',
    completionBadgeId: 'badge_o10m_chain_vacatur_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_vacatur_petition_docket',
        title: 'Petition Docket',
        narrativeBridge: 'File petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 430 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_vacatur_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mVacaturMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_vacatur_merit_finale',
        title: 'Merit Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainVacaturRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_remand_route',
    title: 'Remand Route',
    description:
      'Three-phase remand arc with weight accrual between legs — round-34 campaign path.',
    completionBadgeId: 'badge_o10m_chain_remand_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_remand_order_docket',
        title: 'Order Docket',
        narrativeBridge: 'Enter order before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 440 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_remand_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mRemandMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_remand_weight_finale',
        title: 'Weight Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainRemandRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_reversal_route',
    title: 'Reversal Route',
    description:
      'Three-phase reversal arc with score accrual between legs — round-35 campaign path.',
    completionBadgeId: 'badge_o10m_chain_reversal_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_reversal_motion_docket',
        title: 'Motion Docket',
        narrativeBridge: 'File motion before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 450 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_reversal_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mReversalMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_reversal_score_finale',
        title: 'Score Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainReversalRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_annulment_route',
    title: 'Annulment Route',
    description:
      'Three-phase annulment arc with score accrual between legs — round-36 campaign path.',
    completionBadgeId: 'badge_o10m_chain_annulment_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_annulment_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File annulment petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 460 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_annulment_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, NSW: 5 },
          forcedSettingsPatch: { o10mAnnulmentMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_annulment_nullity_finale',
        title: 'Nullity Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainAnnulmentRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_reinstatement_route',
    title: 'Reinstatement Route',
    description:
      'Three-phase reinstatement arc with score accrual between legs — round-37 campaign path.',
    completionBadgeId: 'badge_o10m_chain_reinstatement_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_reinstatement_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File reinstatement petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 470 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_reinstatement_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 6, QLD: 5 },
          forcedSettingsPatch: { o10mReinstatementMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_reinstatement_restoration_finale',
        title: 'Restoration Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainReinstatementRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_setaside_route',
    title: 'Set-Aside Route',
    description:
      'Three-phase set-aside arc with score accrual between legs — round-38 campaign path.',
    completionBadgeId: 'badge_o10m_chain_setaside_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_setaside_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File set-aside motion before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 480 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_setaside_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mSetAsideMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_setaside_relief_finale',
        title: 'Relief Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSetAsideRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_quash_route',
    title: 'Quash Route',
    description:
      'Three-phase quash arc with score accrual between legs — round-39 campaign path.',
    completionBadgeId: 'badge_o10m_chain_quash_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_quash_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File quash motion before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 490 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_quash_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, QLD: 5 },
          forcedSettingsPatch: { o10mQuashMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_quash_vacate_finale',
        title: 'Vacate Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainQuashRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_supersede_route',
    title: 'Supersede Route',
    description:
      'Three-phase supersede arc with score accrual between legs — round-40 campaign path.',
    completionBadgeId: 'badge_o10m_chain_supersede_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_supersede_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File supersede motion before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 500 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_supersede_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 5 },
          forcedSettingsPatch: { o10mSupersedeMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_supersede_stay_finale',
        title: 'Stay Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSupersedeRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_certiorari_route',
    title: 'Certiorari Route',
    description:
      'Three-phase certiorari arc with score accrual between legs — round-41 campaign path.',
    completionBadgeId: 'badge_o10m_chain_certiorari_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_certiorari_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File certiorari petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 510 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_certiorari_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mCertiorariMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_certiorari_mandate_finale',
        title: 'Mandate Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCertiorariRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_mandamus_route',
    title: 'Mandamus Route',
    description:
      'Three-phase mandamus arc with score accrual between legs — round-42 campaign path.',
    completionBadgeId: 'badge_o10m_chain_mandamus_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_mandamus_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File mandamus petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 520 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_mandamus_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mMandamusMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_mandamus_writ_finale',
        title: 'Writ Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainMandamusRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_prohibition_route',
    title: 'Prohibition Route',
    description:
      'Three-phase prohibition arc with score accrual between legs — round-43 campaign path.',
    completionBadgeId: 'badge_o10m_chain_prohibition_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_prohibition_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File prohibition petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 530 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_prohibition_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mProhibitionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_prohibition_order_finale',
        title: 'Order Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainProhibitionRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_habeas_route',
    title: 'Habeas Route',
    description:
      'Three-phase habeas arc with score accrual between legs — round-44 campaign path.',
    completionBadgeId: 'badge_o10m_chain_habeas_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_habeas_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File habeas petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 540 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_habeas_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mHabeasMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_habeas_corpus_finale',
        title: 'Corpus Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainHabeasRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_quowarranto_route',
    title: 'Quo Warranto Route',
    description:
      'Three-phase quo warranto arc with score accrual between legs — round-45 campaign path.',
    completionBadgeId: 'badge_o10m_chain_quowarranto_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_quowarranto_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File quo warranto petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 550 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_quowarranto_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mQuowarrantoMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_quowarranto_warrant_finale',
        title: 'Warrant Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainQuowarrantoRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_injunction_route',
    title: 'Injunction Route',
    description:
      'Three-phase injunction arc with score accrual between legs — round-46 campaign path.',
    completionBadgeId: 'badge_o10m_chain_injunction_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_injunction_filing_docket',
        title: 'Filing Docket',
        narrativeBridge: 'File injunction petition before the review chamber.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 560 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_injunction_review_chamber',
        title: 'Review Chamber',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, VIC: 5 },
          forcedSettingsPatch: { o10mInjunctionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_injunction_relief_finale',
        title: 'Relief Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainInjunctionRouteComplete: true } },
      },
    ],
  },
];

const CHAIN_BY_ID = new Map(O10M_SCENARIO_CHAINS.map(c => [c.id, c]));

export function getO10mScenarioChain(chainId: string): O10mScenarioChain | undefined {
  return CHAIN_BY_ID.get(chainId);
}

export function initializeChainProgress(chainId: string): O10mChainProgress | null {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return null;
  return {
    chainId,
    completedStepIndexes: [],
    activeStepIndex: 0,
    accumulatedCarry: {},
    chainCompleted: false,
  };
}

function mergeCarry(base: O10mChainCarryBonus, add: O10mChainCarryBonus): O10mChainCarryBonus {
  const standingDelta = { ...(base.standingDelta || {}) };
  for (const [k, v] of Object.entries(add.standingDelta || {})) {
    standingDelta[k] = (standingDelta[k] || 0) + v;
  }
  return {
    startingMoneyDelta: (base.startingMoneyDelta || 0) + (add.startingMoneyDelta || 0),
    standingDelta: Object.keys(standingDelta).length ? standingDelta : undefined,
    forcedSettingsPatch: { ...(base.forcedSettingsPatch || {}), ...(add.forcedSettingsPatch || {}) },
  };
}

export function isChainStepUnlocked(chain: O10mScenarioChain, progress: O10mChainProgress, stepIndex: number): boolean {
  if (progress.chainCompleted) return false;
  if (stepIndex === 0) return progress.completedStepIndexes.length === 0 || progress.activeStepIndex === 0;
  const prev = stepIndex - 1;
  return progress.completedStepIndexes.includes(prev);
}

export function validateChainStepSelection(
  chainId: string,
  progress: O10mChainProgress | null | undefined,
  scenarioId: string,
  stepIndex: number,
): { ok: boolean; errors: string[] } {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return { ok: false, errors: [`Unknown chain: ${chainId}`] };
  const step = chain.steps.find(s => s.stepIndex === stepIndex);
  if (!step) return { ok: false, errors: [`Invalid step index ${stepIndex} for chain ${chainId}`] };
  if (step.scenarioId !== scenarioId) {
    return { ok: false, errors: [`Step ${stepIndex} expects scenario ${step.scenarioId}, got ${scenarioId}`] };
  }
  const prog = progress ?? initializeChainProgress(chainId);
  if (!prog) return { ok: false, errors: ['Could not initialize chain progress.'] };
  if (!isChainStepUnlocked(chain, prog, stepIndex)) {
    return { ok: false, errors: [`Chain step ${stepIndex} is locked.`] };
  }
  return { ok: true, errors: [] };
}

function runMeetsStepRequirements(
  step: O10mScenarioChain['steps'][number],
  run: O10mRunSummary,
): boolean {
  if (step.requiresPrimaryVictory && !run.primaryVictory) return false;
  if (step.requiresOptionalCount != null && run.optionalObjectivesCompleted < step.requiresOptionalCount) {
    return false;
  }
  return true;
}

export function advanceChainAfterRun(
  chainId: string,
  progress: O10mChainProgress,
  run: O10mRunSummary,
): O10mChainAdvanceResult {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  const step = chain.steps.find(s => s.stepIndex === progress.activeStepIndex);
  if (!step || step.scenarioId !== run.scenarioId) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  if (!runMeetsStepRequirements(step, run)) {
    return {
      progress,
      advanced: false,
      chainCompleted: false,
      unlockedNextScenarioId: null,
    };
  }

  const completed = Array.from(new Set([...progress.completedStepIndexes, step.stepIndex])).sort((a, b) => a - b);
  const carry = step.carryBonusOnComplete
    ? mergeCarry(progress.accumulatedCarry, step.carryBonusOnComplete)
    : progress.accumulatedCarry;

  const isLast = step.stepIndex === chain.steps[chain.steps.length - 1]!.stepIndex;
  if (isLast) {
    return {
      progress: {
        chainId,
        completedStepIndexes: completed,
        activeStepIndex: step.stepIndex,
        accumulatedCarry: carry,
        chainCompleted: true,
      },
      advanced: true,
      chainCompleted: true,
      unlockedNextScenarioId: null,
    };
  }

  const nextIndex = step.stepIndex + 1;
  const nextStep = chain.steps.find(s => s.stepIndex === nextIndex);
  return {
    progress: {
      chainId,
      completedStepIndexes: completed,
      activeStepIndex: nextIndex,
      accumulatedCarry: carry,
      chainCompleted: false,
    },
    advanced: true,
    chainCompleted: false,
    unlockedNextScenarioId: nextStep?.scenarioId ?? null,
  };
}

export function buildChainScenarioStartOverrides(progress: O10mChainProgress): O10mScenarioStartOverrides {
  const carry = progress.accumulatedCarry;
  return {
    startingMoneyMultiplier: 1,
    startingStandingDelta: carry.standingDelta ? { ...carry.standingDelta } : undefined,
  };
}

export function buildChainForcedSettingsPatch(progress: O10mChainProgress): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    ...(progress.accumulatedCarry.forcedSettingsPatch || {}),
    o10mActiveChainId: progress.chainId,
    o10mActiveChainStep: progress.activeStepIndex,
  };
  if (progress.accumulatedCarry.startingMoneyDelta) {
    patch.o10mChainStartingMoneyBonus = progress.accumulatedCarry.startingMoneyDelta;
  }
  return patch;
}

export function listO10mScenarioChainIds(): string[] {
  return O10M_SCENARIO_CHAINS.map(c => c.id);
}

// --- bundled from src/sandbox-knobs.ts ---
export const O10M_SANDBOX_KNOB_DEFINITIONS: O10mSandboxKnobDefinition[] = [
  {
    key: 'economicStartingCashMultiplier',
    label: 'Starting cash multiplier',
    description: 'Scales scenario starting money after chain bonuses.',
    min: 0.5,
    max: 2,
    defaultValue: 1,
  },
  {
    key: 'totalDaysMultiplier',
    label: 'Day limit multiplier',
    description: 'Scales scenario totalDays in forced settings.',
    min: 0.5,
    max: 2,
    defaultValue: 1,
  },
  {
    key: 'rivalFairnessDelta',
    label: 'Rival fairness delta',
    description: 'Added to aiFairnessLevel (clamped 0.7–0.98).',
    min: -0.1,
    max: 0.1,
    defaultValue: 0,
  },
  {
    key: 'contractAbundanceOverride',
    label: 'Contract abundance',
    description: 'Overrides v93ContractAbundance when set.',
    allowedStringValues: ['scarce', 'normal', 'abundant'],
    defaultValue: 'normal',
  },
  {
    key: 'crisisIntensityOverride',
    label: 'Crisis intensity',
    description: 'Overrides v93CrisisIntensity when set.',
    allowedStringValues: ['low', 'normal', 'high'],
    defaultValue: 'normal',
  },
  {
    key: 'deterministicSeedOffset',
    label: 'Deterministic seed offset',
    description: 'Added to scenario forcedSeed/world seeds for lab replays.',
    min: -9999,
    max: 9999,
    defaultValue: 0,
  },
];

const DEF_BY_KEY = new Map(O10M_SANDBOX_KNOB_DEFINITIONS.map(d => [d.key, d]));

export const O10M_SANDBOX_KNOB_PROFILES: O10mSandboxKnobProfile[] = [
  {
    id: 'o10m_sandbox_relaxed',
    title: 'Relaxed Economy',
    description: 'More starting cash and longer day limits for learning a scenario.',
    knobs: {
      economicStartingCashMultiplier: 1.25,
      totalDaysMultiplier: 1.2,
      rivalFairnessDelta: -0.04,
      contractAbundanceOverride: 'abundant',
      crisisIntensityOverride: 'low',
    },
  },
  {
    id: 'o10m_sandbox_gauntlet',
    title: 'Gauntlet',
    description: 'Tighter economy, shorter days, hotter rival pressure.',
    knobs: {
      economicStartingCashMultiplier: 0.85,
      totalDaysMultiplier: 0.85,
      rivalFairnessDelta: 0.05,
      contractAbundanceOverride: 'scarce',
      crisisIntensityOverride: 'high',
    },
  },
  {
    id: 'o10m_sandbox_lab_deterministic',
    title: 'Deterministic Lab',
    description: 'Fixed seed offset for regression replays without changing scenario ids.',
    knobs: {
      deterministicSeedOffset: 9001,
      economicStartingCashMultiplier: 1,
      totalDaysMultiplier: 1,
    },
  },
  {
    id: 'o10m_sandbox_chain_friendly',
    title: 'Chain Friendly',
    description: 'Mild boosts intended for multi-step chain progression tests.',
    knobs: {
      economicStartingCashMultiplier: 1.1,
      totalDaysMultiplier: 1.1,
      rivalFairnessDelta: -0.02,
      crisisIntensityOverride: 'normal',
    },
  },
];

const PROFILE_BY_ID = new Map(O10M_SANDBOX_KNOB_PROFILES.map(p => [p.id, p]));

export function getSandboxKnobProfile(id: string): O10mSandboxKnobProfile | undefined {
  return PROFILE_BY_ID.get(id);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function validateSandboxKnobs(
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): { ok: boolean; errors: string[]; normalized: Partial<Record<O10mSandboxKnobKey, number | string>> } {
  const errors: string[] = [];
  const normalized: Partial<Record<O10mSandboxKnobKey, number | string>> = {};

  for (const [rawKey, rawValue] of Object.entries(knobs)) {
    const key = rawKey as O10mSandboxKnobKey;
    const def = DEF_BY_KEY.get(key);
    if (!def) {
      errors.push(`Unknown sandbox knob: ${rawKey}`);
      continue;
    }
    if (def.allowedStringValues) {
      if (typeof rawValue !== 'string' || !def.allowedStringValues.includes(rawValue)) {
        errors.push(`${key} must be one of ${def.allowedStringValues.join(', ')}`);
        continue;
      }
      normalized[key] = rawValue;
      continue;
    }
    const num = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (Number.isNaN(num)) {
      errors.push(`${key} must be numeric`);
      continue;
    }
    if (def.min != null && def.max != null) {
      if (num < def.min || num > def.max) {
        errors.push(`${key} must be between ${def.min} and ${def.max}`);
        continue;
      }
      normalized[key] = num;
    } else {
      normalized[key] = num;
    }
  }

  return { ok: errors.length === 0, errors, normalized };
}

export function resolveSandboxKnobValues(
  profileId?: string | null,
  overrides?: Partial<Record<O10mSandboxKnobKey, number | string>>,
): { ok: boolean; errors: string[]; knobs: Partial<Record<O10mSandboxKnobKey, number | string>> } {
  const profile = profileId ? getSandboxKnobProfile(profileId) : undefined;
  if (profileId && !profile) {
    return { ok: false, errors: [`Unknown sandbox profile: ${profileId}`], knobs: {} };
  }
  const merged = { ...(profile?.knobs || {}), ...(overrides || {}) };
  const validated = validateSandboxKnobs(merged);
  return { ok: validated.ok, errors: validated.errors, knobs: validated.normalized };
}

export function applySandboxKnobsToForcedSettings(
  forcedSettings: Record<string, unknown>,
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): Record<string, unknown> {
  const out = { ...forcedSettings };
  const dayMult = Number(knobs.totalDaysMultiplier ?? 1);
  if (typeof out.totalDays === 'number') {
    out.totalDays = Math.max(5, Math.round(out.totalDays * dayMult));
  } else if (dayMult !== 1) {
    out.totalDays = Math.max(5, Math.round(30 * dayMult));
  }

  const fairnessBase = typeof out.aiFairnessLevel === 'number' ? out.aiFairnessLevel : 0.88;
  const fairness = fairnessBase + Number(knobs.rivalFairnessDelta ?? 0);
  out.aiFairnessLevel = clamp(fairness, 0.7, 0.98);

  if (knobs.contractAbundanceOverride) {
    out.v93ContractAbundance = knobs.contractAbundanceOverride;
  }
  if (knobs.crisisIntensityOverride) {
    out.v93CrisisIntensity = knobs.crisisIntensityOverride;
  }

  const seedOffset = Number(knobs.deterministicSeedOffset ?? 0);
  if (seedOffset !== 0) {
    for (const key of ['forcedSeed', 'worldRngSeed', 'aiDeterministicSeed'] as const) {
      if (typeof out[key] === 'number') {
        out[key] = (out[key] as number) + seedOffset;
      }
    }
    out.o10mSandboxSeedOffset = seedOffset;
  }

  out.o10mSandboxKnobsApplied = { ...knobs };
  return out;
}

export function applySandboxKnobsToScenarioStart(
  overrides: O10mScenarioStartOverrides,
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): O10mScenarioStartOverrides {
  const mult = Number(knobs.economicStartingCashMultiplier ?? 1);
  return {
    ...overrides,
    startingMoneyMultiplier: (overrides.startingMoneyMultiplier ?? 1) * mult,
  };
}

export function listSandboxKnobProfileIds(): string[] {
  return O10M_SANDBOX_KNOB_PROFILES.map(p => p.id);
}

// --- bundled from src/mode-interactions.ts ---
function mergeSettings(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  return { ...base, ...patch };
}

export function resolveModeInteraction(request: ModeInteractionRequest): ModeInteractionResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let effectiveBaseMode: GameModeSelection = request.baseMode;
  let forcedSettingsMerge: Record<string, unknown> = {};
  let scenarioStartOverrides: O10mScenarioStartOverrides = {};

  const scenario = request.scenarioId ? findO10mScenario(request.scenarioId) : undefined;
  const hasScenario = Boolean(scenario || request.scenarioId);

  if (request.scenarioId && !scenario && request.scenarioId.startsWith('o10m_')) {
    errors.push(`Unknown O10M scenario id: ${request.scenarioId}`);
  }

  if (hasScenario && request.baseMode !== 'scenario' && !request.scenarioModeEnabled) {
    warnings.push('Scenario selected while base mode is not `scenario`; assembly should set selectedMode to scenario or enable scenarioModeEnabled.');
  }

  if (request.baseMode === 'single' && hasScenario) {
    errors.push('Single-player sandbox cannot host structured scenario objectives.');
  }

  if (request.baseMode === 'grand_tour' && hasScenario && request.scenarioId !== 'o10m_grand_tour_prologue') {
    warnings.push('Grand tour with non-prologue scenario may double-count challenge progression.');
  }

  if (request.chainId != null && request.chainStepIndex != null && request.scenarioId) {
    const chainCheck = validateChainStepSelection(
      request.chainId,
      request.chainProgress ?? initializeChainProgress(request.chainId),
      request.scenarioId,
      request.chainStepIndex,
    );
    if (!chainCheck.ok) {
      errors.push(...chainCheck.errors);
    } else if (request.chainProgress) {
      forcedSettingsMerge = mergeSettings(forcedSettingsMerge, buildChainForcedSettingsPatch(request.chainProgress));
      scenarioStartOverrides = buildChainScenarioStartOverrides(request.chainProgress);
    }
  }

  if (hasScenario && isSoloRivalMode(request.baseMode)) {
    effectiveBaseMode = request.baseMode === 'grand_tour' ? 'grand_tour' : 'scenario';
  }

  if (scenario) {
    forcedSettingsMerge = mergeSettings(forcedSettingsMerge, scenario.forcedSettings);
    const fit = evaluateModeScenarioFit(request.baseMode, scenario.id);
    if (!fit.ok) {
      errors.push(...fit.warnings.filter(w => w.includes('restricted')));
    } else {
      warnings.push(...fit.warnings);
    }
  }

  const seen = new Set<O10mChallengeModeId>();
  for (const challengeId of request.challengeModeIds) {
    if (seen.has(challengeId)) {
      errors.push(`Duplicate challenge mode: ${challengeId}`);
      continue;
    }
    seen.add(challengeId);
    const mode = getO10mChallengeMode(challengeId);
    if (mode.incompatibleBaseModes.includes(request.baseMode)) {
      errors.push(`Challenge ${challengeId} is incompatible with base mode ${request.baseMode}.`);
    }
    if (
      mode.compatibleBaseModes.length > 0 &&
      !mode.compatibleBaseModes.includes(request.baseMode)
    ) {
      warnings.push(`Challenge ${challengeId} is not in preferred list for ${request.baseMode}.`);
    }
    forcedSettingsMerge = mergeSettings(forcedSettingsMerge, mode.forcedSettingsPatch);
    for (const mod of mode.modifiers) {
      forcedSettingsMerge[`o10mModifier_${mod.id}`] = mod.value;
    }
  }

  if (request.challengeModeIds.length > 3) {
    errors.push('At most three challenge overlays may be active simultaneously.');
  }

  if (request.baseMode === 'team_ai_vs_ai' && request.challengeModeIds.includes('o10m_ironman')) {
    errors.push('Ironman overlay is disabled for team_ai_vs_ai autoplay.');
  }

  const sandboxResolved = resolveSandboxKnobValues(request.sandboxProfileId, request.sandboxKnobs);
  if (!sandboxResolved.ok) {
    errors.push(...sandboxResolved.errors);
  } else if (Object.keys(sandboxResolved.knobs).length > 0) {
    forcedSettingsMerge = applySandboxKnobsToForcedSettings(forcedSettingsMerge, sandboxResolved.knobs);
    scenarioStartOverrides = applySandboxKnobsToScenarioStart(scenarioStartOverrides, sandboxResolved.knobs);
    if (request.sandboxProfileId) {
      forcedSettingsMerge.o10mSandboxProfileId = request.sandboxProfileId;
    }
  }

  if (request.baseMode === 'single' && request.sandboxProfileId === 'o10m_sandbox_gauntlet') {
    warnings.push('Gauntlet sandbox on single mode is for mechanic testing only — no structured objectives.');
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    warnings,
    effectiveBaseMode,
    forcedSettingsMerge,
    scenarioStartOverrides: Object.keys(scenarioStartOverrides).length ? scenarioStartOverrides : undefined,
  };
}

export function listChallengeIncompatibilities(): Array<{ challengeId: O10mChallengeModeId; mode: GameModeSelection }> {
  const pairs: Array<{ challengeId: O10mChallengeModeId; mode: GameModeSelection }> = [];
  for (const c of O10M_CHALLENGE_MODES) {
    for (const mode of c.incompatibleBaseModes) {
      pairs.push({ challengeId: c.id, mode });
    }
  }
  return pairs;
}

/** Computes effective starting money for assembly hooks. */
export function computeEffectiveScenarioStartingMoney(
  scenarioBaseMoney: number,
  startOverrides?: O10mScenarioStartOverrides,
  chainMoneyBonus?: number,
): number {
  const mult = startOverrides?.startingMoneyMultiplier ?? 1;
  const bonus = chainMoneyBonus ?? 0;
  return Math.round(scenarioBaseMoney * mult + bonus);
}

// --- bundled from src/mode-mission-registry.ts ---
export type O10mMissionFocus =
  | 'solo_rival'
  | 'grand_tour_arc'
  | 'team_coop'
  | 'autoplay_lab'
  | 'scenario_sandbox';

export interface O10mModeMissionProfile {
  baseMode: GameModeSelection;
  missionFocus: O10mMissionFocus;
  title: string;
  description: string;
  recommendedScenarioIds: string[];
  /** Scenario ids that should warn when selected outside this mode. */
  restrictedScenarioIds?: string[];
}

const DIFFICULTY_RANK: Record<ScenarioDifficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Expert: 4,
};

export const O10M_MODE_MISSION_PROFILES: O10mModeMissionProfile[] = [
  {
    baseMode: 'ai',
    missionFocus: 'solo_rival',
    title: 'Solo Rival Missions',
    description: 'Standard human vs AI scenario progression with optional challenge overlays.',
    recommendedScenarioIds: [
      'o10m_silent_diplomat',
      'o10m_export_clock',
      'o10m_cyclone_corridor',
      'o10m_rival_elimination_classic',
    ],
  },
  {
    baseMode: 'grand_tour',
    missionFocus: 'grand_tour_arc',
    title: 'Grand Tour Bridge',
    description: 'Challenge-heavy scenarios that complement regional tour pacing.',
    recommendedScenarioIds: ['o10m_grand_tour_prologue', 'o10m_outback_relay', 'o10m_tas_battery_rush'],
  },
  {
    baseMode: 'scenario',
    missionFocus: 'scenario_sandbox',
    title: 'Scenario Campaign',
    description: 'Full scenario engine with chains, milestones, and sandbox knobs.',
    recommendedScenarioIds: O10M_OPERATION_SCENARIOS.map(s => s.id),
  },
  {
    baseMode: 'team_human_ai_vs_ai_ai',
    missionFocus: 'team_coop',
    title: 'Co-Pilot Coalition',
    description: 'Standing-average and governance scenarios tuned for human+AI teams.',
    recommendedScenarioIds: ['o10m_team_ledger', 'o10m_capital_markets_week', 'o10m_silent_diplomat'],
  },
  {
    baseMode: 'team_ai_vs_ai',
    missionFocus: 'autoplay_lab',
    title: 'Autoplay Laboratory',
    description: 'Observation scenarios for AI vs AI balance and contract pacing.',
    recommendedScenarioIds: ['o10m_autoplay_observatory'],
    restrictedScenarioIds: ['o10m_rival_elimination_classic'],
  },
  {
    baseMode: 'single',
    missionFocus: 'scenario_sandbox',
    title: 'Sandbox (Unstructured)',
    description: 'No structured scenario objectives — sandbox knobs only.',
    recommendedScenarioIds: [],
  },
];

export function getModeMissionProfile(mode: GameModeSelection): O10mModeMissionProfile | undefined {
  return O10M_MODE_MISSION_PROFILES.find(p => p.baseMode === mode);
}

export function recommendScenariosForMode(mode: GameModeSelection): PresetScenario[] {
  const profile = getModeMissionProfile(mode);
  if (!profile) return [];
  return profile.recommendedScenarioIds
    .map(id => findO10mScenario(id))
    .filter((s): s is PresetScenario => Boolean(s));
}

export function rankScenarioDifficulty(scenario: PresetScenario): number {
  return DIFFICULTY_RANK[scenario.difficulty] ?? 2;
}

export function listScenariosByDifficulty(mode?: GameModeSelection): PresetScenario[] {
  const pool = mode ? recommendScenariosForMode(mode) : [...O10M_OPERATION_SCENARIOS];
  return [...pool].sort(
    (a, b) => rankScenarioDifficulty(a) - rankScenarioDifficulty(b) || a.id.localeCompare(b.id),
  );
}

export interface O10mModeScenarioFitResult {
  ok: boolean;
  warnings: string[];
  missionFocus: O10mMissionFocus | null;
}

export function evaluateModeScenarioFit(baseMode: GameModeSelection, scenarioId: string): O10mModeScenarioFitResult {
  const profile = getModeMissionProfile(baseMode);
  const warnings: string[] = [];
  if (!profile) return { ok: false, warnings: ['Unknown base mode'], missionFocus: null };

  if (profile.restrictedScenarioIds?.includes(scenarioId)) {
    warnings.push(`Scenario ${scenarioId} is restricted for mode ${baseMode}.`);
  }

  if (baseMode === 'single' && scenarioId.startsWith('o10m_')) {
    warnings.push('Structured O10M scenarios require a rival or scenario base mode.');
  }

  if (baseMode === 'team_ai_vs_ai' && scenarioId !== 'o10m_autoplay_observatory' && scenarioId.startsWith('o10m_')) {
    warnings.push('Only o10m_autoplay_observatory is tuned for team_ai_vs_ai structured play.');
  }

  if (isSoloRivalMode(baseMode) && !profile.recommendedScenarioIds.includes(scenarioId)) {
    warnings.push(`Scenario ${scenarioId} is not in the recommended list for ${baseMode}.`);
  }

  const ok = !profile.restrictedScenarioIds?.includes(scenarioId) && baseMode !== 'single';
  return { ok, warnings, missionFocus: profile.missionFocus };
}

export function scenariosReferencedByChains(): string[] {
  const ids = new Set<string>();
  for (const chain of O10M_SCENARIO_CHAINS) {
    for (const step of chain.steps) ids.add(step.scenarioId);
  }
  return [...ids].sort();
}

export function chainCoverageReport(): Array<{ chainId: string; scenarioCount: number; uniqueRegions: string[] }> {
  return O10M_SCENARIO_CHAINS.map(chain => {
    const regions = new Set<string>();
    for (const step of chain.steps) {
      const sc = findO10mScenario(step.scenarioId);
      sc?.startingRegions.forEach(r => regions.add(r));
    }
    return { chainId: chain.id, scenarioCount: chain.steps.length, uniqueRegions: [...regions].sort() };
  });
}

// --- bundled from src/scenario-content-audit.ts ---
const VALID_REGION_CODES = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT']);

export type O10mContentAuditSeverity = 'error' | 'warning';

export interface O10mContentAuditIssue {
  id: string;
  severity: O10mContentAuditSeverity;
  problem: string;
  detail: string;
}

export interface O10mContentAuditReport {
  issues: O10mContentAuditIssue[];
  checked: {
    scenarios: number;
    chains: number;
    challengeModes: number;
  };
  isClean: boolean;
}

function auditScenario(sc: PresetScenario): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  if (!sc.id.startsWith('o10m_')) {
    issues.push({
      id: sc.id,
      severity: 'warning',
      problem: 'id_prefix',
      detail: 'O10M preset ids should start with o10m_',
    });
  }
  if (sc.objectives.length === 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'no_objectives', detail: 'Scenario has zero objectives' });
  }
  const primary = sc.objectives.filter(o => o.isPrimary !== false);
  if (primary.length === 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'no_primary', detail: 'No primary objectives defined' });
  }
  for (const r of sc.startingRegions) {
    if (!VALID_REGION_CODES.has(r)) {
      issues.push({
        id: sc.id,
        severity: 'error',
        problem: 'bad_region',
        detail: `Invalid starting region code: ${r}`,
      });
    }
  }
  const objIds = new Set<string>();
  for (const o of sc.objectives) {
    if (objIds.has(o.id)) {
      issues.push({ id: sc.id, severity: 'error', problem: 'dup_objective', detail: `Duplicate objective id ${o.id}` });
    }
    objIds.add(o.id);
    if (o.targetType === 'specific_region_controlled' && o.targetRegionId && !VALID_REGION_CODES.has(o.targetRegionId)) {
      issues.push({
        id: sc.id,
        severity: 'error',
        problem: 'bad_target_region',
        detail: `Objective ${o.id} targets unknown region ${o.targetRegionId}`,
      });
    }
  }
  if (typeof sc.startingMoney !== 'number' || sc.startingMoney < 0) {
    issues.push({ id: sc.id, severity: 'error', problem: 'bad_money', detail: 'startingMoney must be non-negative' });
  }
  return issues;
}

export function auditO10mScenarioCatalog(scenarios: PresetScenario[] = O10M_OPERATION_SCENARIOS): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  const ids = new Set<string>();
  for (const sc of scenarios) {
    if (ids.has(sc.id)) {
      issues.push({ id: sc.id, severity: 'error', problem: 'dup_scenario', detail: 'Duplicate scenario id' });
    }
    ids.add(sc.id);
    issues.push(...auditScenario(sc));
  }
  return issues;
}

export function auditO10mScenarioChains(): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  for (const chain of O10M_SCENARIO_CHAINS) {
    const stepIndexes = new Set<number>();
    for (const step of chain.steps) {
      if (stepIndexes.has(step.stepIndex)) {
        issues.push({
          id: chain.id,
          severity: 'error',
          problem: 'dup_step_index',
          detail: `Duplicate step index ${step.stepIndex}`,
        });
      }
      stepIndexes.add(step.stepIndex);
      if (!findO10mScenario(step.scenarioId)) {
        issues.push({
          id: chain.id,
          severity: 'error',
          problem: 'missing_scenario',
          detail: `Step ${step.stepIndex} references unknown scenario ${step.scenarioId}`,
        });
      }
    }
    if (chain.steps.length < 2) {
      issues.push({
        id: chain.id,
        severity: 'warning',
        problem: 'short_chain',
        detail: 'Chains should have at least 2 steps',
      });
    }
  }
  return issues;
}

export function auditO10mChallengeModes(): O10mContentAuditIssue[] {
  const issues: O10mContentAuditIssue[] = [];
  for (const mode of O10M_CHALLENGE_MODES) {
    if (mode.compatibleBaseModes.some(m => mode.incompatibleBaseModes.includes(m))) {
      issues.push({
        id: mode.id,
        severity: 'error',
        problem: 'mode_overlap',
        detail: 'Challenge mode lists the same base mode as compatible and incompatible',
      });
    }
  }
  return issues;
}

export function runO10mContentAudit(): O10mContentAuditReport {
  const issues = [
    ...auditO10mScenarioCatalog(),
    ...auditO10mScenarioChains(),
    ...auditO10mChallengeModes(),
  ];
  const isClean = issues.every(i => i.severity !== 'error');
  return {
    issues,
    checked: {
      scenarios: O10M_OPERATION_SCENARIOS.length,
      chains: O10M_SCENARIO_CHAINS.length,
      challengeModes: O10M_CHALLENGE_MODES.length,
    },
    isClean,
  };
}

export function summarizeContentAudit(report: O10mContentAuditReport): string {
  const err = report.issues.filter(i => i.severity === 'error').length;
  const warn = report.issues.filter(i => i.severity === 'warning').length;
  return `scenarios=${report.checked.scenarios} chains=${report.checked.chains} challenges=${report.checked.challengeModes} errors=${err} warnings=${warn}`;
}

// --- bundled from src/save-format.ts ---
export const O10M_MODES_SAVE_SCHEMA_VERSION = 46;
export const O10M_MODES_GAME_STATE_KEY = 'o10mModesProgress' as const;
export const O10M_MODES_RUN_LOG_CAP = 24;

const VALID_CHALLENGES = new Set(listO10mChallengeModeIds());

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function sanitizeChallengeIds(raw: unknown): O10mChallengeModeId[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is O10mChallengeModeId => typeof id === 'string' && VALID_CHALLENGES.has(id as O10mChallengeModeId));
}

function sanitizeChainProgress(raw: unknown): O10mChainProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const chainId = str(o.chainId);
  if (!chainId) return null;
  const completedStepIndexes = Array.isArray(o.completedStepIndexes)
    ? o.completedStepIndexes.filter((n): n is number => typeof n === 'number').slice(0, 12)
    : [];
  const activeStepIndex = num(o.activeStepIndex, 0);
  const chainCompleted = o.chainCompleted === true;
  const carry = (o.accumulatedCarry || {}) as O10mChainProgress['accumulatedCarry'];
  return {
    chainId,
    completedStepIndexes,
    activeStepIndex,
    chainCompleted,
    accumulatedCarry: {
      startingMoneyDelta: num(carry?.startingMoneyDelta, 0) || undefined,
      standingDelta:
        carry?.standingDelta && typeof carry.standingDelta === 'object'
          ? (carry.standingDelta as Record<string, number>)
          : undefined,
      forcedSettingsPatch:
        carry?.forcedSettingsPatch && typeof carry.forcedSettingsPatch === 'object'
          ? (carry.forcedSettingsPatch as Record<string, unknown>)
          : undefined,
    },
  };
}

function sanitizeMilestones(raw: unknown): O10mMilestoneProgress[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(m => m && typeof m === 'object')
    .map(m => {
      const row = m as Record<string, unknown>;
      return {
        milestoneId: String(row.milestoneId || ''),
        unlocked: row.unlocked === true,
        unlockedAtRunCount: num(row.unlockedAtRunCount, 0),
      };
    })
    .filter(m => m.milestoneId.startsWith('o10m_'));
}

function sanitizeRunLog(raw: unknown): O10mPersistedRunRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(-O10M_MODES_RUN_LOG_CAP)
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      const baseMode = row.baseMode;
      return {
        scenarioId: String(row.scenarioId || ''),
        baseMode: (isCanonicalGameModeSelection(baseMode) ? baseMode : 'scenario') as GameModeSelection,
        primaryVictory: row.primaryVictory === true,
        chainCompleted: row.chainCompleted === true,
        day: num(row.day, 1),
        recordedAtTurn: num(row.recordedAtTurn, 0),
      };
    })
    .filter(r => r.scenarioId.startsWith('o10m_'));
}

export function createEmptyO10mModesPersistedState(baseMode: GameModeSelection = 'scenario'): O10mModesPersistedState {
  return {
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    updatedAtTurn: 0,
    baseMode,
    scenarioId: null,
    chainProgress: null,
    challengeModeIds: [],
    sandboxProfileId: null,
    sandboxKnobs: {},
    milestones: [],
    completedChainIds: [],
    recentRuns: [],
    objectiveProgress: [],
    campaignSlots: [],
    activeCampaignSlotId: null,
    challengeStreak: createEmptyChallengeStreak(),
    marathonQueue: null,
    replayLedger: [],
    gauntletSession: null,
    catalogUnlockTokens: [],
    relaySession: null,
    circuitSession: null,
    expeditionSession: null,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
    extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
  };
}

export function migrateO10mModesPersistedState(raw: unknown): O10mModesPersistedState {
  const base = createEmptyO10mModesPersistedState();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  const v1 = num(o.schemaVersion, 1);
  const merged = sanitizeO10mModesPersistedState({ ...o, schemaVersion: Math.max(v1, 1) }) ?? base;
  if (merged.schemaVersion < O10M_MODES_SAVE_SCHEMA_VERSION) {
    const upgraded: O10mModesPersistedState = {
      ...merged,
      schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
      recentRuns: merged.recentRuns ?? [],
      completedChainIds: merged.completedChainIds ?? [],
      saveKind: merged.saveKind ?? 'manual',
      updatedAtDay: merged.updatedAtDay ?? 0,
      objectiveProgress: merged.objectiveProgress ?? [],
      campaignSlots: merged.campaignSlots ?? [],
      activeCampaignSlotId: merged.activeCampaignSlotId ?? null,
      challengeStreak: merged.challengeStreak ?? createEmptyChallengeStreak(),
      marathonQueue: merged.marathonQueue ?? null,
      replayLedger: merged.replayLedger ?? [],
      gauntletSession: merged.gauntletSession ?? null,
      catalogUnlockTokens: merged.catalogUnlockTokens ?? [],
      relaySession: merged.relaySession ?? null,
      circuitSession: merged.circuitSession ?? null,
      expeditionSession: merged.expeditionSession ?? null,
      odysseySession: merged.odysseySession ?? null,
      pilgrimageSession: merged.pilgrimageSession ?? null,
      caravanSession: merged.caravanSession ?? null,
      voyageSession: merged.voyageSession ?? null,
      siegeSession: merged.siegeSession ?? null,
      convoySession: merged.convoySession ?? null,
      escortSession: merged.escortSession ?? null,
      extractionSession: merged.extractionSession ?? null,
      subjectSession: merged.subjectSession ?? null,
      witnessSession: merged.witnessSession ?? null,
      tribunalSession: merged.tribunalSession ?? null,
      indictmentSession: merged.indictmentSession ?? null,
      appealSession: merged.appealSession ?? null,
      clemencySession: merged.clemencySession ?? null,
      pardonSession: merged.pardonSession ?? null,
      amnestySession: merged.amnestySession ?? null,
      reprieveSession: merged.reprieveSession ?? null,
      paroleSession: merged.paroleSession ?? null,
      probationSession: merged.probationSession ?? null,
      commutationSession: merged.commutationSession ?? null,
      acquittalSession: merged.acquittalSession ?? null,
      exonerationSession: merged.exonerationSession ?? null,
      expungementSession: merged.expungementSession ?? null,
      vacaturSession: merged.vacaturSession ?? null,
      remandSession: merged.remandSession ?? null,
      reversalSession: merged.reversalSession ?? null,
      annulmentSession: merged.annulmentSession ?? null,
      reinstatementSession: merged.reinstatementSession ?? null,
      setAsideSession: merged.setAsideSession ?? null,
      quashSession: merged.quashSession ?? null,
      supersedeSession: merged.supersedeSession ?? null,
      certiorariSession: merged.certiorariSession ?? null,
      mandamusSession: merged.mandamusSession ?? null,
      prohibitionSession: merged.prohibitionSession ?? null,
      habeasSession: merged.habeasSession ?? null,
      quowarrantoSession: merged.quowarrantoSession ?? null,
      injunctionSession: merged.injunctionSession ?? null,
    };
    return upgraded;
  }
  return merged;
}

export function sanitizeO10mModesPersistedState(raw: unknown): O10mModesPersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const baseModeRaw = o.baseMode;
  const baseMode = isCanonicalGameModeSelection(baseModeRaw) ? baseModeRaw : 'scenario';
  const sandboxKnobsRaw = (o.sandboxKnobs && typeof o.sandboxKnobs === 'object' ? o.sandboxKnobs : {}) as Partial<
    Record<O10mSandboxKnobKey, number | string>
  >;
  const knobResolved = resolveSandboxKnobValues(str(o.sandboxProfileId), sandboxKnobsRaw);

  const saveKindRaw = o.saveKind;
  const saveKind =
    saveKindRaw === 'autosave' || saveKindRaw === 'manual' || saveKindRaw === 'checkpoint' ? saveKindRaw : 'manual';

  return {
    schemaVersion: num(o.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION),
    updatedAtTurn: num(o.updatedAtTurn, 0),
    updatedAtDay: num(o.updatedAtDay, 0) || undefined,
    saveKind,
    sessionId: str(o.sessionId) ?? undefined,
    integrityFingerprint: str(o.integrityFingerprint) ?? undefined,
    baseMode,
    scenarioId: str(o.scenarioId),
    chainProgress: sanitizeChainProgress(o.chainProgress),
    challengeModeIds: sanitizeChallengeIds(o.challengeModeIds),
    sandboxProfileId: str(o.sandboxProfileId),
    sandboxKnobs: knobResolved.ok ? knobResolved.knobs : {},
    milestones: sanitizeMilestones(o.milestones),
    completedChainIds: Array.isArray(o.completedChainIds)
      ? o.completedChainIds.filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_chain_'))
      : [],
    recentRuns: sanitizeRunLog(o.recentRuns),
    objectiveProgress: sanitizeObjectiveProgress(o.objectiveProgress),
    campaignSlots: sanitizeCampaignSlots(o.campaignSlots),
    activeCampaignSlotId:
      typeof o.activeCampaignSlotId === 'string' && o.activeCampaignSlotId.startsWith('o10m_slot_')
        ? o.activeCampaignSlotId
        : null,
    challengeStreak: sanitizeChallengeStreak(o.challengeStreak),
    marathonQueue: sanitizeMarathonQueue(o.marathonQueue),
    replayLedger: sanitizeReplayLedger(o.replayLedger),
    gauntletSession: sanitizeGauntletSession(o.gauntletSession),
    catalogUnlockTokens: sanitizeCatalogUnlockTokens(o.catalogUnlockTokens),
    relaySession: sanitizeRelaySession(o.relaySession),
    circuitSession: sanitizeCircuitSession(o.circuitSession),
    expeditionSession: sanitizeExpeditionSession(o.expeditionSession),
    odysseySession: sanitizeOdysseySession(o.odysseySession),
    pilgrimageSession: sanitizePilgrimageSession(o.pilgrimageSession),
    caravanSession: sanitizeCaravanSession(o.caravanSession),
    voyageSession: sanitizeVoyageSession(o.voyageSession),
    siegeSession: sanitizeSiegeSession(o.siegeSession),
    convoySession: sanitizeConvoySession(o.convoySession),
    escortSession: sanitizeEscortSession(o.escortSession),
    extractionSession: sanitizeExtractionSession(o.extractionSession),
    subjectSession: sanitizeSubjectSession(o.subjectSession),
    witnessSession: sanitizeWitnessSession(o.witnessSession),
    tribunalSession: sanitizeTribunalSession(o.tribunalSession),
    indictmentSession: sanitizeIndictmentSession(o.indictmentSession),
    appealSession: sanitizeAppealSession(o.appealSession),
    clemencySession: sanitizeClemencySession(o.clemencySession),
    pardonSession: sanitizePardonSession(o.pardonSession),
    amnestySession: sanitizeAmnestySession(o.amnestySession),
    reprieveSession: sanitizeReprieveSession(o.reprieveSession),
    paroleSession: sanitizeParoleSession(o.paroleSession),
    probationSession: sanitizeProbationSession(o.probationSession),
    commutationSession: sanitizeCommutationSession(o.commutationSession),
    acquittalSession: sanitizeAcquittalSession(o.acquittalSession),
    exonerationSession: sanitizeExonerationSession(o.exonerationSession),
    expungementSession: sanitizeExpungementSession(o.expungementSession),
    vacaturSession: sanitizeVacaturSession(o.vacaturSession),
    remandSession: sanitizeRemandSession(o.remandSession),
    reversalSession: sanitizeReversalSession(o.reversalSession),
    annulmentSession: sanitizeAnnulmentSession(o.annulmentSession),
    reinstatementSession: sanitizeReinstatementSession(o.reinstatementSession),
    setAsideSession: sanitizeSetAsideSession(o.setAsideSession),
    quashSession: sanitizeQuashSession(o.quashSession),
    supersedeSession: sanitizeSupersedeSession(o.supersedeSession),
    certiorariSession: sanitizeCertiorariSession(o.certiorariSession),
    mandamusSession: sanitizeMandamusSession(o.mandamusSession),
    prohibitionSession: sanitizeProhibitionSession(o.prohibitionSession),
    habeasSession: sanitizeHabeasSession(o.habeasSession),
    quowarrantoSession: sanitizeQuowarrantoSession(o.quowarrantoSession),
    injunctionSession: sanitizeInjunctionSession(o.injunctionSession),
  };
}

export function validateO10mModesPersistedForLoad(state: O10mModesPersistedState): O10mSaveFormatValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (state.schemaVersion > O10M_MODES_SAVE_SCHEMA_VERSION) {
    warnings.push(`Save schema ${state.schemaVersion} is newer than module ${O10M_MODES_SAVE_SCHEMA_VERSION}.`);
  }

  if (state.scenarioId && !findO10mScenario(state.scenarioId)) {
    errors.push(`Unknown scenario id in save: ${state.scenarioId}`);
  }

  if (state.chainProgress) {
    if (state.scenarioId) {
      const check = validateChainStepSelection(
        state.chainProgress.chainId,
        state.chainProgress,
        state.scenarioId,
        state.chainProgress.activeStepIndex,
      );
      if (!check.ok && !state.chainProgress.chainCompleted) {
        warnings.push(...check.errors);
      }
    }
    if (state.chainProgress.chainCompleted && !state.completedChainIds.includes(state.chainProgress.chainId)) {
      warnings.push('Chain marked complete but missing from completedChainIds history.');
    }
  }

  if (state.challengeModeIds.length > 3) {
    errors.push('Save contains more than three challenge overlays.');
  }

  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  if (state.marathonQueue && !marathon) {
    warnings.push('Marathon queue failed sanitization; planner will ignore it.');
  } else if (marathon && marathon.cursor >= marathon.scenarioIds.length) {
    warnings.push('Marathon cursor out of range; clamp on next sanitize.');
  }

  const gauntlet = sanitizeGauntletSession(state.gauntletSession);
  if (state.gauntletSession && !gauntlet) {
    warnings.push('Gauntlet session failed sanitization; planner will ignore it.');
  } else if (gauntlet && gauntlet.cursor >= gauntlet.scenarioIds.length) {
    warnings.push('Gauntlet cursor out of range; clamp on next sanitize.');
  }

  const relay = sanitizeRelaySession(state.relaySession);
  if (state.relaySession && !relay) {
    warnings.push('Relay session failed sanitization; planner will ignore it.');
  } else if (relay && relay.cursor >= relay.scenarioIds.length) {
    warnings.push('Relay cursor out of range; clamp on next sanitize.');
  }

  const circuit = sanitizeCircuitSession(state.circuitSession);
  if (state.circuitSession && !circuit) {
    warnings.push('Circuit session failed sanitization; planner will ignore it.');
  } else if (circuit && circuit.cursor >= circuit.scenarioIds.length) {
    warnings.push('Circuit cursor out of range; clamp on next sanitize.');
  }

  const expedition = sanitizeExpeditionSession(state.expeditionSession);
  if (state.expeditionSession && !expedition) {
    warnings.push('Expedition session failed sanitization; planner will ignore it.');
  } else if (expedition && expedition.cursor >= expedition.scenarioIds.length) {
    warnings.push('Expedition cursor out of range; clamp on next sanitize.');
  }

  const odyssey = sanitizeOdysseySession(state.odysseySession);
  if (state.odysseySession && !odyssey) {
    warnings.push('Odyssey session failed sanitization; planner will ignore it.');
  } else if (odyssey && odyssey.cursor >= odyssey.scenarioIds.length) {
    warnings.push('Odyssey cursor out of range; clamp on next sanitize.');
  }

  const pilgrimage = sanitizePilgrimageSession(state.pilgrimageSession);
  if (state.pilgrimageSession && !pilgrimage) {
    warnings.push('Pilgrimage session failed sanitization; planner will ignore it.');
  } else if (pilgrimage && pilgrimage.cursor >= pilgrimage.scenarioIds.length) {
    warnings.push('Pilgrimage cursor out of range; clamp on next sanitize.');
  }

  const caravan = sanitizeCaravanSession(state.caravanSession);
  if (state.caravanSession && !caravan) {
    warnings.push('Caravan session failed sanitization; planner will ignore it.');
  } else if (caravan && caravan.cursor >= caravan.scenarioIds.length) {
    warnings.push('Caravan cursor out of range; clamp on next sanitize.');
  }

  const voyage = sanitizeVoyageSession(state.voyageSession);
  if (state.voyageSession && !voyage) {
    warnings.push('Voyage session failed sanitization; planner will ignore it.');
  } else if (voyage && voyage.cursor >= voyage.scenarioIds.length) {
    warnings.push('Voyage cursor out of range; clamp on next sanitize.');
  }

  const siege = sanitizeSiegeSession(state.siegeSession);
  if (state.siegeSession && !siege) {
    warnings.push('Siege session failed sanitization; planner will ignore it.');
  } else if (siege && siege.cursor >= siege.scenarioIds.length) {
    warnings.push('Siege cursor out of range; clamp on next sanitize.');
  }

  const convoy = sanitizeConvoySession(state.convoySession);
  if (state.convoySession && !convoy) {
    warnings.push('Convoy session failed sanitization; planner will ignore it.');
  } else if (convoy && convoy.cursor >= convoy.scenarioIds.length) {
    warnings.push('Convoy cursor out of range; clamp on next sanitize.');
  }

  const escort = sanitizeEscortSession(state.escortSession);
  if (state.escortSession && !escort) {
    warnings.push('Escort session failed sanitization; planner will ignore it.');
  } else if (escort && escort.cursor >= escort.scenarioIds.length) {
    warnings.push('Escort cursor out of range; clamp on next sanitize.');
  }

  const extraction = sanitizeExtractionSession(state.extractionSession);
  if (state.extractionSession && !extraction) {
    warnings.push('Extraction session failed sanitization; planner will ignore it.');
  } else if (extraction && extraction.cursor >= extraction.scenarioIds.length) {
    warnings.push('Extraction cursor out of range; clamp on next sanitize.');
  }

  const subject = sanitizeSubjectSession(state.subjectSession);
  if (state.subjectSession && !subject) {
    warnings.push('Subject session failed sanitization; planner will ignore it.');
  } else if (subject && subject.cursor >= subject.scenarioIds.length) {
    warnings.push('Subject cursor out of range; clamp on next sanitize.');
  }

  const witness = sanitizeWitnessSession(state.witnessSession);
  if (state.witnessSession && !witness) {
    warnings.push('Witness session failed sanitization; planner will ignore it.');
  } else if (witness && witness.cursor >= witness.scenarioIds.length) {
    warnings.push('Witness cursor out of range; clamp on next sanitize.');
  }

  const tribunal = sanitizeTribunalSession(state.tribunalSession);
  if (state.tribunalSession && !tribunal) {
    warnings.push('Tribunal session failed sanitization; planner will ignore it.');
  } else if (tribunal && tribunal.cursor >= tribunal.scenarioIds.length) {
    warnings.push('Tribunal cursor out of range; clamp on next sanitize.');
  }

  const indictment = sanitizeIndictmentSession(state.indictmentSession);
  if (state.indictmentSession && !indictment) {
    warnings.push('Indictment session failed sanitization; planner will ignore it.');
  } else if (indictment && indictment.cursor >= indictment.scenarioIds.length) {
    warnings.push('Indictment cursor out of range; clamp on next sanitize.');
  }

  const appeal = sanitizeAppealSession(state.appealSession);
  if (state.appealSession && !appeal) {
    warnings.push('Appeal session failed sanitization; planner will ignore it.');
  } else if (appeal && appeal.cursor >= appeal.scenarioIds.length) {
    warnings.push('Appeal cursor out of range; clamp on next sanitize.');
  }

  const clemency = sanitizeClemencySession(state.clemencySession);
  if (state.clemencySession && !clemency) {
    warnings.push('Clemency session failed sanitization; planner will ignore it.');
  } else if (clemency && clemency.cursor >= clemency.scenarioIds.length) {
    warnings.push('Clemency cursor out of range; clamp on next sanitize.');
  }

  const pardon = sanitizePardonSession(state.pardonSession);
  if (state.pardonSession && !pardon) {
    warnings.push('Pardon session failed sanitization; planner will ignore it.');
  } else if (pardon && pardon.cursor >= pardon.scenarioIds.length) {
    warnings.push('Pardon cursor out of range; clamp on next sanitize.');
  }

  const amnesty = sanitizeAmnestySession(state.amnestySession);
  if (state.amnestySession && !amnesty) {
    warnings.push('Amnesty session failed sanitization; planner will ignore it.');
  } else if (amnesty && amnesty.cursor >= amnesty.scenarioIds.length) {
    warnings.push('Amnesty cursor out of range; clamp on next sanitize.');
  }

  const reprieve = sanitizeReprieveSession(state.reprieveSession);
  if (state.reprieveSession && !reprieve) {
    warnings.push('Reprieve session failed sanitization; planner will ignore it.');
  } else if (reprieve && reprieve.cursor >= reprieve.scenarioIds.length) {
    warnings.push('Reprieve cursor out of range; clamp on next sanitize.');
  }

  const parole = sanitizeParoleSession(state.paroleSession);
  if (state.paroleSession && !parole) {
    warnings.push('Parole session failed sanitization; planner will ignore it.');
  } else if (parole && parole.cursor >= parole.scenarioIds.length) {
    warnings.push('Parole cursor out of range; clamp on next sanitize.');
  }

  const probation = sanitizeProbationSession(state.probationSession);
  if (state.probationSession && !probation) {
    warnings.push('Probation session failed sanitization; planner will ignore it.');
  } else if (probation && probation.cursor >= probation.scenarioIds.length) {
    warnings.push('Probation cursor out of range; clamp on next sanitize.');
  }

  const commutation = sanitizeCommutationSession(state.commutationSession);
  if (state.commutationSession && !commutation) {
    warnings.push('Commutation session failed sanitization; planner will ignore it.');
  } else if (commutation && commutation.cursor >= commutation.scenarioIds.length) {
    warnings.push('Commutation cursor out of range; clamp on next sanitize.');
  }

  const acquittal = sanitizeAcquittalSession(state.acquittalSession);
  if (state.acquittalSession && !acquittal) {
    warnings.push('Acquittal session failed sanitization; planner will ignore it.');
  } else if (acquittal && acquittal.cursor >= acquittal.scenarioIds.length) {
    warnings.push('Acquittal cursor out of range; clamp on next sanitize.');
  }

  const exoneration = sanitizeExonerationSession(state.exonerationSession);
  if (state.exonerationSession && !exoneration) {
    warnings.push('Exoneration session failed sanitization; planner will ignore it.');
  } else if (exoneration && exoneration.cursor >= exoneration.scenarioIds.length) {
    warnings.push('Exoneration cursor out of range; clamp on next sanitize.');
  }

  const expungement = sanitizeExpungementSession(state.expungementSession);
  if (state.expungementSession && !expungement) {
    warnings.push('Expungement session failed sanitization; planner will ignore it.');
  } else if (expungement && expungement.cursor >= expungement.scenarioIds.length) {
    warnings.push('Expungement cursor out of range; clamp on next sanitize.');
  }

  const vacatur = sanitizeVacaturSession(state.vacaturSession);
  if (state.vacaturSession && !vacatur) {
    warnings.push('Vacatur session failed sanitization; planner will ignore it.');
  } else if (vacatur && vacatur.cursor >= vacatur.scenarioIds.length) {
    warnings.push('Vacatur cursor out of range; clamp on next sanitize.');
  }

  const remand = sanitizeRemandSession(state.remandSession);
  if (state.remandSession && !remand) {
    warnings.push('Remand session failed sanitization; planner will ignore it.');
  } else if (remand && remand.cursor >= remand.scenarioIds.length) {
    warnings.push('Remand cursor out of range; clamp on next sanitize.');
  }

  const reversal = sanitizeReversalSession(state.reversalSession);
  if (state.reversalSession && !reversal) {
    warnings.push('Reversal session failed sanitization; planner will ignore it.');
  } else if (reversal && reversal.cursor >= reversal.scenarioIds.length) {
    warnings.push('Reversal cursor out of range; clamp on next sanitize.');
  }

  const annulment = sanitizeAnnulmentSession(state.annulmentSession);
  if (state.annulmentSession && !annulment) {
    warnings.push('Annulment session failed sanitization; planner will ignore it.');
  } else if (annulment && annulment.cursor >= annulment.scenarioIds.length) {
    warnings.push('Annulment cursor out of range; clamp on next sanitize.');
  }

  const reinstatement = sanitizeReinstatementSession(state.reinstatementSession);
  if (state.reinstatementSession && !reinstatement) {
    warnings.push('Reinstatement session failed sanitization; planner will ignore it.');
  } else if (reinstatement && reinstatement.cursor >= reinstatement.scenarioIds.length) {
    warnings.push('Reinstatement cursor out of range; clamp on next sanitize.');
  }

  const setAside = sanitizeSetAsideSession(state.setAsideSession);
  if (state.setAsideSession && !setAside) {
    warnings.push('Set-aside session failed sanitization; planner will ignore it.');
  } else if (setAside && setAside.cursor >= setAside.scenarioIds.length) {
    warnings.push('Set-aside cursor out of range; clamp on next sanitize.');
  }

  const quash = sanitizeQuashSession(state.quashSession);
  if (state.quashSession && !quash) {
    warnings.push('Quash session failed sanitization; planner will ignore it.');
  } else if (quash && quash.cursor >= quash.scenarioIds.length) {
    warnings.push('Quash cursor out of range; clamp on next sanitize.');
  }

  const supersede = sanitizeSupersedeSession(state.supersedeSession);
  if (state.supersedeSession && !supersede) {
    warnings.push('Supersede session failed sanitization; planner will ignore it.');
  } else if (supersede && supersede.cursor >= supersede.scenarioIds.length) {
    warnings.push('Supersede cursor out of range; clamp on next sanitize.');
  }

  const certiorari = sanitizeCertiorariSession(state.certiorariSession);
  if (state.certiorariSession && !certiorari) {
    warnings.push('Certiorari session failed sanitization; planner will ignore it.');
  } else if (certiorari && certiorari.cursor >= certiorari.scenarioIds.length) {
    warnings.push('Certiorari cursor out of range; clamp on next sanitize.');
  }

  const mandamus = sanitizeMandamusSession(state.mandamusSession);
  if (state.mandamusSession && !mandamus) {
    warnings.push('Mandamus session failed sanitization; planner will ignore it.');
  } else if (mandamus && mandamus.cursor >= mandamus.scenarioIds.length) {
    warnings.push('Mandamus cursor out of range; clamp on next sanitize.');
  }

  const prohibition = sanitizeProhibitionSession(state.prohibitionSession);
  if (state.prohibitionSession && !prohibition) {
    warnings.push('Prohibition session failed sanitization; planner will ignore it.');
  } else if (prohibition && prohibition.cursor >= prohibition.scenarioIds.length) {
    warnings.push('Prohibition cursor out of range; clamp on next sanitize.');
  }

  const habeas = sanitizeHabeasSession(state.habeasSession);
  if (state.habeasSession && !habeas) {
    warnings.push('Habeas session failed sanitization; planner will ignore it.');
  } else if (habeas && habeas.cursor >= habeas.scenarioIds.length) {
    warnings.push('Habeas cursor out of range; clamp on next sanitize.');
  }

  const quowarranto = sanitizeQuowarrantoSession(state.quowarrantoSession);
  if (state.quowarrantoSession && !quowarranto) {
    warnings.push('Quo warranto session failed sanitization; planner will ignore it.');
  } else if (quowarranto && quowarranto.cursor >= quowarranto.scenarioIds.length) {
    warnings.push('Quo warranto cursor out of range; clamp on next sanitize.');
  }

  const injunction = sanitizeInjunctionSession(state.injunctionSession);
  if (state.injunctionSession && !injunction) {
    warnings.push('Injunction session failed sanitization; planner will ignore it.');
  } else if (injunction && injunction.cursor >= injunction.scenarioIds.length) {
    warnings.push('Injunction cursor out of range; clamp on next sanitize.');
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function appendRunToPersistedLog(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  const entry: O10mPersistedRunRecord = {
    scenarioId: run.scenarioId || '',
    baseMode: run.baseMode,
    primaryVictory: run.primaryVictory,
    chainCompleted: run.chainCompleted === true,
    day: run.day,
    recordedAtTurn: turn,
  };
  const recentRuns = [...state.recentRuns, entry].filter(r => r.scenarioId).slice(-O10M_MODES_RUN_LOG_CAP);
  const completedChainIds = [...state.completedChainIds];
  if (run.chainCompleted && run.scenarioId) {
    const chainId = state.chainProgress?.chainId;
    if (chainId && !completedChainIds.includes(chainId)) completedChainIds.push(chainId);
  }
  return {
    ...state,
    updatedAtTurn: turn,
    recentRuns,
    completedChainIds,
  };
}

export function buildO10mModesPersistedSnapshot(params: {
  turn: number;
  baseMode: GameModeSelection;
  scenarioId: string | null;
  chainProgress: O10mChainProgress | null;
  challengeModeIds: O10mChallengeModeId[];
  sandboxProfileId?: string | null;
  sandboxKnobs?: Partial<Record<O10mSandboxKnobKey, number | string>>;
  milestones: O10mMilestoneProgress[];
  previous?: O10mModesPersistedState | null;
}): O10mModesPersistedState {
  const prev = params.previous ?? createEmptyO10mModesPersistedState(params.baseMode);
  return {
    ...prev,
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    updatedAtTurn: params.turn,
    baseMode: params.baseMode,
    scenarioId: params.scenarioId,
    chainProgress: params.chainProgress,
    challengeModeIds: params.challengeModeIds.slice(0, 3),
    sandboxProfileId: params.sandboxProfileId ?? null,
    sandboxKnobs: params.sandboxKnobs ?? prev.sandboxKnobs,
    milestones: params.milestones,
  };
}

export function restoreModeInteractionFromPersisted(state: O10mModesPersistedState): ModeInteractionRequest {
  return {
    baseMode: state.baseMode,
    scenarioId: state.scenarioId,
    challengeModeIds: state.challengeModeIds,
    scenarioModeEnabled: state.baseMode === 'scenario' || Boolean(state.scenarioId),
    sandboxProfileId: state.sandboxProfileId,
    sandboxKnobs: state.sandboxKnobs,
    chainId: state.chainProgress?.chainId ?? null,
    chainStepIndex: state.chainProgress?.activeStepIndex,
    chainProgress: state.chainProgress,
  };
}

export function attachO10mModesProgressToGameState<T extends Record<string, unknown>>(
  gameState: T,
  persisted: O10mModesPersistedState,
): T & { o10mModesProgress: O10mModesPersistedState } {
  return { ...gameState, [O10M_MODES_GAME_STATE_KEY]: persisted };
}

export function readO10mModesProgressFromGameState(gameState: unknown): O10mModesPersistedState | null {
  if (!gameState || typeof gameState !== 'object') return null;
  const raw = (gameState as Record<string, unknown>)[O10M_MODES_GAME_STATE_KEY];
  return migrateO10mModesPersistedState(raw);
}

export function ensureChainProgressOnLoad(
  state: O10mModesPersistedState,
  chainId: string,
): O10mModesPersistedState {
  if (state.chainProgress?.chainId === chainId) return state;
  const fresh = initializeChainProgress(chainId);
  return fresh ? { ...state, chainProgress: fresh } : state;
}

// --- bundled from src/save-format-lifecycle.ts ---
const FINGERPRINT_KEYS: Array<keyof O10mModesPersistedState> = [
  'baseMode',
  'scenarioId',
  'chainProgress',
  'challengeModeIds',
  'sandboxProfileId',
  'milestones',
  'completedChainIds',
  'objectiveProgress',
  'campaignSlots',
  'activeCampaignSlotId',
  'challengeStreak',
  'marathonQueue',
  'replayLedger',
  'gauntletSession',
  'catalogUnlockTokens',
  'relaySession',
  'circuitSession',
  'expeditionSession',
  'odysseySession',
  'pilgrimageSession',
  'caravanSession',
  'voyageSession',
  'siegeSession',
  'convoySession',
  'escortSession',
  'extractionSession',
  'subjectSession',
  'witnessSession',
  'tribunalSession',
  'indictmentSession',
  'appealSession',
  'clemencySession',
  'pardonSession',
  'amnestySession',
  'reprieveSession',
  'paroleSession',
  'probationSession',
  'commutationSession',
  'acquittalSession',
  'exonerationSession',
  'expungementSession',
  'vacaturSession',
  'remandSession',
  'reversalSession',
  'annulmentSession',
  'reinstatementSession',
  'setAsideSession',
  'quashSession',
  'supersedeSession',
  'certiorariSession',
  'mandamusSession',
  'prohibitionSession',
  'habeasSession',
  'quowarrantoSession',
  'injunctionSession',
];

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

/** Browser-safe fingerprint (no Node crypto) for assembly chunk. */
export function hashO10mModesPayload(payload: string): string {
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function computeO10mModesIntegrityFingerprint(state: O10mModesPersistedState): string {
  const payload: Record<string, unknown> = {};
  for (const key of FINGERPRINT_KEYS) {
    payload[key] = state[key];
  }
  payload.schemaVersion = state.schemaVersion;
  return hashO10mModesPayload(stableStringify(payload));
}

export function sealO10mModesPersistedState(
  state: O10mModesPersistedState,
  saveKind: O10mModesSaveKind = 'manual',
): O10mModesPersistedState {
  const sealed: O10mModesPersistedState = {
    ...state,
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    saveKind,
    sessionId: state.sessionId || `o10m_sess_${state.updatedAtTurn}_${state.scenarioId || 'none'}`,
  };
  return {
    ...sealed,
    integrityFingerprint: computeO10mModesIntegrityFingerprint(sealed),
  };
}

export function verifyO10mModesIntegrity(state: O10mModesPersistedState): boolean {
  if (!state.integrityFingerprint) return true;
  return state.integrityFingerprint === computeO10mModesIntegrityFingerprint({ ...state, integrityFingerprint: undefined });
}

function mergeMilestones(a: O10mMilestoneProgress[], b: O10mMilestoneProgress[]): O10mMilestoneProgress[] {
  const map = new Map<string, O10mMilestoneProgress>();
  for (const m of [...a, ...b]) {
    const prev = map.get(m.milestoneId);
    if (!prev || (m.unlocked && !prev.unlocked)) map.set(m.milestoneId, m);
    else if (m.unlocked && prev.unlocked) {
      map.set(m.milestoneId, {
        ...prev,
        unlockedAtRunCount: Math.min(prev.unlockedAtRunCount || 999, m.unlockedAtRunCount || 999),
      });
    }
  }
  return [...map.values()].sort((x, y) => x.milestoneId.localeCompare(y.milestoneId));
}

export function mergeO10mModesPersistedStates(
  primary: O10mModesPersistedState,
  secondary: O10mModesPersistedState,
  strategy: 'prefer_newest_turn' | 'prefer_primary' | 'union_milestones' = 'prefer_newest_turn',
): O10mModesMergeResult {
  const warnings: string[] = [];
  let base = strategy === 'prefer_primary' ? primary : secondary.updatedAtTurn > primary.updatedAtTurn ? secondary : primary;
  const other = base === primary ? secondary : primary;

  if (base.scenarioId && other.scenarioId && base.scenarioId !== other.scenarioId) {
    warnings.push(`Merged saves disagree on scenarioId (${base.scenarioId} vs ${other.scenarioId}); kept newer turn.`);
  }

  if (strategy === 'union_milestones') {
    base = {
      ...base,
      milestones: mergeMilestones(primary.milestones, secondary.milestones),
      completedChainIds: [...new Set([...primary.completedChainIds, ...secondary.completedChainIds])].sort(),
      recentRuns: [...primary.recentRuns, ...secondary.recentRuns].slice(-24),
      objectiveProgress: mergeObjectiveProgressOnImport(
        primary.objectiveProgress ?? [],
        secondary.objectiveProgress ?? [],
      ),
      campaignSlots: sanitizeCampaignSlots([...(primary.campaignSlots ?? []), ...(secondary.campaignSlots ?? [])]),
      replayLedger: mergeReplayLedgers(primary.replayLedger ?? [], secondary.replayLedger ?? []),
      catalogUnlockTokens: mergeCatalogUnlockTokens(
        primary.catalogUnlockTokens ?? [],
        secondary.catalogUnlockTokens ?? [],
      ),
    };
  }

  const merged = sealO10mModesPersistedState(
    {
      ...base,
      challengeModeIds: base.challengeModeIds.length ? base.challengeModeIds : other.challengeModeIds,
      sandboxProfileId: base.sandboxProfileId ?? other.sandboxProfileId,
      sandboxKnobs: Object.keys(base.sandboxKnobs).length ? base.sandboxKnobs : other.sandboxKnobs,
    },
    base.saveKind ?? 'manual',
  );

  return { merged, warnings };
}

export function reconcileO10mModesOnGameLoad(
  state: O10mModesPersistedState,
  ctx: O10mModesReconcileContext,
): { state: O10mModesPersistedState; warnings: string[] } {
  const warnings: string[] = [];
  let next: O10mModesPersistedState = { ...state, updatedAtDay: ctx.day };

  if (ctx.turn < state.updatedAtTurn) {
    warnings.push('Live turn is behind persisted o10mModesProgress; possible reload of older snapshot.');
  }

  if (ctx.liveBaseMode && ctx.liveBaseMode !== state.baseMode) {
    warnings.push(`Live baseMode ${ctx.liveBaseMode} differs from persisted ${state.baseMode}.`);
    next = { ...next, baseMode: ctx.liveBaseMode };
  }

  if (ctx.liveScenarioId && state.scenarioId && ctx.liveScenarioId !== state.scenarioId) {
    warnings.push(`Live scenarioId ${ctx.liveScenarioId} differs from persisted ${state.scenarioId}.`);
    next = { ...next, scenarioId: ctx.liveScenarioId };
  }

  next = sealO10mModesPersistedState({ ...next, updatedAtTurn: Math.max(state.updatedAtTurn, ctx.turn) }, state.saveKind ?? 'manual');
  return { state: next, warnings };
}

export function diffO10mModesPersisted(before: O10mModesPersistedState, after: O10mModesPersistedState): O10mModesPersistedDiff {
  const changedFields: string[] = [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)] as Array<keyof O10mModesPersistedState>);
  for (const key of keys) {
    if (stableStringify(before[key]) !== stableStringify(after[key])) changedFields.push(String(key));
  }
  return { changedFields: changedFields.sort() };
}

export function exportO10mModesProgressJson(state: O10mModesPersistedState): string {
  return JSON.stringify(sealO10mModesPersistedState(state));
}

export function importO10mModesProgressJson(raw: string): { state: O10mModesPersistedState | null; errors: string[] } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateO10mModesPersistedState(parsed);
    const validation = validateO10mModesPersistedForLoad(migrated);
    if (!validation.ok) return { state: null, errors: validation.errors };
    if (!verifyO10mModesIntegrity(migrated)) {
      return { state: null, errors: ['Integrity fingerprint mismatch on import.'] };
    }
    return { state: migrated, errors: validation.warnings };
  } catch {
    return { state: null, errors: ['Invalid JSON for o10mModesProgress import.'] };
  }
}

export function prepareO10mModesForAutosave(state: O10mModesPersistedState, turn: number, day: number): O10mModesPersistedState {
  return sealO10mModesPersistedState({ ...state, updatedAtTurn: turn, updatedAtDay: day }, 'autosave');
}

export function prepareO10mModesCheckpoint(state: O10mModesPersistedState, turn: number, day: number): O10mModesPersistedState {
  return sealO10mModesPersistedState({ ...state, updatedAtTurn: turn, updatedAtDay: day }, 'checkpoint');
}

// --- bundled from src/save-format-objective-sync.ts ---
export function sanitizeObjectiveProgress(raw: unknown): O10mPersistedObjectiveRow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      return {
        objectiveId: String(row.objectiveId || ''),
        currentValue: typeof row.currentValue === 'number' ? row.currentValue : 0,
        targetValue: typeof row.targetValue === 'number' ? row.targetValue : 0,
        completed: row.completed === true,
        lastUpdatedTurn: typeof row.lastUpdatedTurn === 'number' ? row.lastUpdatedTurn : 0,
      };
    })
    .filter(r => r.objectiveId.length > 0)
    .slice(-48);
}

export function captureObjectiveProgressFromContext(
  state: O10mModesPersistedState,
  scenarioId: string,
  context: ScenarioEvalContext,
  turn: number,
): O10mModesPersistedState {
  const scenario = findO10mScenario(scenarioId);
  if (!scenario) return state;

  const rows: O10mPersistedObjectiveRow[] = scenario.objectives.map(objective => {
    const progress = evaluateScenarioObjectiveProgress(objective, context);
    return {
      objectiveId: objective.id,
      currentValue: progress.currentValue,
      targetValue: progress.targetValue,
      completed: progress.completed,
      lastUpdatedTurn: turn,
    };
  });

  const other = (state.objectiveProgress ?? []).filter(r => !rows.some(n => n.objectiveId === r.objectiveId));
  return {
    ...state,
    objectiveProgress: [...other, ...rows].slice(-48),
  };
}

export function readObjectiveProgressForScenario(
  state: O10mModesPersistedState,
  scenarioId: string,
): O10mPersistedObjectiveRow[] {
  const scenario = findO10mScenario(scenarioId);
  if (!scenario) return [];
  const ids = new Set(scenario.objectives.map(o => o.id));
  return (state.objectiveProgress ?? []).filter(r => ids.has(r.objectiveId));
}

export function objectiveProgressCompletionRatio(state: O10mModesPersistedState, scenarioId: string): number {
  const rows = readObjectiveProgressForScenario(state, scenarioId);
  if (rows.length === 0) return 0;
  const done = rows.filter(r => r.completed).length;
  return done / rows.length;
}

export function mergeObjectiveProgressOnImport(
  primary: O10mPersistedObjectiveRow[],
  secondary: O10mPersistedObjectiveRow[],
): O10mPersistedObjectiveRow[] {
  const map = new Map<string, O10mPersistedObjectiveRow>();
  for (const row of [...primary, ...secondary]) {
    const prev = map.get(row.objectiveId);
    if (!prev || row.lastUpdatedTurn >= prev.lastUpdatedTurn) map.set(row.objectiveId, row);
  }
  return [...map.values()].sort((a, b) => a.objectiveId.localeCompare(b.objectiveId));
}

// --- bundled from src/save-format-campaign.ts ---
export const O10M_CAMPAIGN_SLOT_CAP = 4;

export function createEmptyChallengeStreak(): O10mChallengeStreak {
  return { current: 0, best: 0, lastScenarioId: null };
}

function sanitizeSlot(raw: unknown): O10mCampaignSlot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const slotId = typeof o.slotId === 'string' && o.slotId.startsWith('o10m_slot_') ? o.slotId : null;
  if (!slotId) return null;
  const baseModeRaw = o.baseMode;
  const baseMode = isCanonicalGameModeSelection(baseModeRaw) ? baseModeRaw : 'scenario';
  const scenarioId = typeof o.scenarioId === 'string' && o.scenarioId.startsWith('o10m_') ? o.scenarioId : null;
  const chainId =
    typeof o.chainId === 'string' && o.chainId.startsWith('o10m_chain_') ? o.chainId : null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 64) : slotId;
  const pinnedAtTurn = typeof o.pinnedAtTurn === 'number' && Number.isFinite(o.pinnedAtTurn) ? o.pinnedAtTurn : 0;
  return { slotId, label, baseMode, scenarioId, chainId, pinnedAtTurn };
}

export function sanitizeCampaignSlots(raw: unknown): O10mCampaignSlot[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(sanitizeSlot)
    .filter((s): s is O10mCampaignSlot => s !== null)
    .slice(0, O10M_CAMPAIGN_SLOT_CAP);
}

export function sanitizeChallengeStreak(raw: unknown): O10mChallengeStreak {
  if (!raw || typeof raw !== 'object') return createEmptyChallengeStreak();
  const o = raw as Record<string, unknown>;
  const current = typeof o.current === 'number' && o.current >= 0 ? Math.floor(o.current) : 0;
  const best = typeof o.best === 'number' && o.best >= 0 ? Math.floor(o.best) : 0;
  const lastScenarioId =
    typeof o.lastScenarioId === 'string' && o.lastScenarioId.startsWith('o10m_') ? o.lastScenarioId : null;
  return { current, best: Math.max(best, current), lastScenarioId };
}

export function pinCampaignSlot(
  state: O10mModesPersistedState,
  params: {
    slotId: string;
    label?: string;
    baseMode?: GameModeSelection;
    scenarioId?: string | null;
    chainId?: string | null;
    turn: number;
  },
): { state: O10mModesPersistedState; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.slotId.startsWith('o10m_slot_')) {
    return { state, warnings: ['Campaign slot ids must start with o10m_slot_.'] };
  }
  const baseMode = params.baseMode ?? state.baseMode;
  const scenarioId = params.scenarioId ?? state.scenarioId;
  if (scenarioId && !findO10mScenario(scenarioId)) {
    warnings.push(`Pinned unknown scenario ${scenarioId}.`);
  }
  if (params.chainId && !getO10mScenarioChain(params.chainId)) {
    warnings.push(`Pinned unknown chain ${params.chainId}.`);
  }

  const slot: O10mCampaignSlot = {
    slotId: params.slotId,
    label: params.label ?? params.slotId.replace('o10m_slot_', '').replace(/_/g, ' '),
    baseMode,
    scenarioId,
    chainId: params.chainId ?? state.chainProgress?.chainId ?? null,
    pinnedAtTurn: params.turn,
  };

  const slots = sanitizeCampaignSlots(state.campaignSlots).filter(s => s.slotId !== slot.slotId);
  slots.push(slot);
  slots.sort((a, b) => a.pinnedAtTurn - b.pinnedAtTurn);
  const trimmed = slots.slice(-O10M_CAMPAIGN_SLOT_CAP);

  return {
    state: {
      ...state,
      campaignSlots: trimmed,
      activeCampaignSlotId: params.slotId,
    },
    warnings,
  };
}

export function unpinCampaignSlot(
  state: O10mModesPersistedState,
  slotId: string,
): O10mModesPersistedState {
  const campaignSlots = sanitizeCampaignSlots(state.campaignSlots).filter(s => s.slotId !== slotId);
  const activeCampaignSlotId = state.activeCampaignSlotId === slotId ? null : state.activeCampaignSlotId;
  return { ...state, campaignSlots, activeCampaignSlotId };
}

export function applyCampaignSlotToState(
  state: O10mModesPersistedState,
  slotId: string,
): { state: O10mModesPersistedState; warnings: string[] } {
  const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === slotId);
  if (!slot) return { state, warnings: [`Unknown campaign slot ${slotId}.`] };

  const warnings: string[] = [];
  let next: O10mModesPersistedState = {
    ...state,
    baseMode: slot.baseMode,
    scenarioId: slot.scenarioId,
    activeCampaignSlotId: slotId,
  };

  if (slot.chainId) {
    const chain = getO10mScenarioChain(slot.chainId);
    if (!chain) {
      warnings.push(`Slot chain ${slot.chainId} is no longer registered.`);
    } else if (slot.scenarioId) {
      const step = chain.steps.find(s => s.scenarioId === slot.scenarioId);
      if (!step) warnings.push(`Scenario ${slot.scenarioId} is not a step on chain ${slot.chainId}.`);
    }
  }

  return { state: next, warnings };
}

export function updateChallengeStreakAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const prev = sanitizeChallengeStreak(state.challengeStreak);
  const onChallenge = run.challengeModeIds.length > 0;
  if (!onChallenge) {
    return { ...state, challengeStreak: { ...prev, current: 0, lastScenarioId: run.scenarioId } };
  }
  const current = run.primaryVictory ? prev.current + 1 : 0;
  const best = Math.max(prev.best, current);
  return {
    ...state,
    challengeStreak: {
      current,
      best,
      lastScenarioId: run.scenarioId,
    },
  };
}

export function summarizeCampaignSlots(state: O10mModesPersistedState): {
  slotCount: number;
  activeSlotId: string | null;
  streakCurrent: number;
  streakBest: number;
} {
  const streak = sanitizeChallengeStreak(state.challengeStreak);
  return {
    slotCount: sanitizeCampaignSlots(state.campaignSlots).length,
    activeSlotId: state.activeCampaignSlotId ?? null,
    streakCurrent: streak.current,
    streakBest: streak.best,
  };
}

// --- bundled from src/save-format-marathon.ts ---
export const O10M_MARATHON_QUEUE_CAP = 8;
export const O10M_REPLAY_LEDGER_CAP = 20;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

export function sanitizeReplayLedger(raw: unknown): O10mScenarioReplayRow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      const scenarioId = typeof row.scenarioId === 'string' && row.scenarioId.startsWith('o10m_') ? row.scenarioId : '';
      if (!scenarioId) return null;
      return {
        scenarioId,
        playCount: Math.max(0, Math.floor(num(row.playCount, 0))),
        primaryVictories: Math.max(0, Math.floor(num(row.primaryVictories, 0))),
        lastPlayedTurn: Math.max(0, Math.floor(num(row.lastPlayedTurn, 0))),
      };
    })
    .filter((r): r is O10mScenarioReplayRow => r !== null)
    .slice(0, O10M_REPLAY_LEDGER_CAP);
}

export function sanitizeMarathonQueue(raw: unknown): O10mMarathonQueue | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const queueId =
    typeof o.queueId === 'string' && o.queueId.startsWith('o10m_marathon_') ? o.queueId : null;
  if (!queueId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : queueId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_MARATHON_QUEUE_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const loopOnComplete = o.loopOnComplete === true;
  const active = o.active !== false;
  return { queueId, label, scenarioIds, cursor, loopOnComplete, active };
}

export function createMarathonQueue(params: {
  queueId: string;
  label: string;
  scenarioIds: string[];
  loopOnComplete?: boolean;
}): { queue: O10mMarathonQueue | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.queueId.startsWith('o10m_marathon_')) {
    return { queue: null, warnings: ['Marathon queue ids must start with o10m_marathon_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_MARATHON_QUEUE_CAP);
  if (trimmed.length === 0) {
    return { queue: null, warnings: [...warnings, 'Marathon queue requires at least one valid scenario.'] };
  }
  return {
    queue: {
      queueId: params.queueId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      loopOnComplete: params.loopOnComplete === true,
      active: true,
    },
    warnings,
  };
}

export function attachMarathonQueueToState(
  state: O10mModesPersistedState,
  queue: O10mMarathonQueue,
): O10mModesPersistedState {
  const sanitized = sanitizeMarathonQueue(queue);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    marathonQueue: sanitized,
    gauntletSession: null,
    relaySession: null,
    circuitSession: null,
    expeditionSession: null,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearMarathonQueue(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, marathonQueue: null };
}

export function getMarathonScenarioAtCursor(queue: O10mMarathonQueue | null | undefined): string | null {
  const q = sanitizeMarathonQueue(queue);
  if (!q || !q.active) return null;
  return q.scenarioIds[q.cursor] ?? null;
}

export function recordScenarioReplayEntry(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  const scenarioId = run.scenarioId;
  if (!scenarioId || !scenarioId.startsWith('o10m_')) return state;
  const ledger = sanitizeReplayLedger(state.replayLedger);
  const idx = ledger.findIndex(r => r.scenarioId === scenarioId);
  const prev =
    idx >= 0
      ? ledger[idx]!
      : { scenarioId, playCount: 0, primaryVictories: 0, lastPlayedTurn: 0 };
  const next: O10mScenarioReplayRow = {
    scenarioId,
    playCount: prev.playCount + 1,
    primaryVictories: prev.primaryVictories + (run.primaryVictory ? 1 : 0),
    lastPlayedTurn: turn,
  };
  const merged = idx >= 0 ? ledger.map((r, i) => (i === idx ? next : r)) : [...ledger, next];
  merged.sort((a, b) => b.lastPlayedTurn - a.lastPlayedTurn);
  return { ...state, replayLedger: merged.slice(0, O10M_REPLAY_LEDGER_CAP) };
}

export function advanceMarathonQueueAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const queue = sanitizeMarathonQueue(state.marathonQueue);
  if (!queue || !queue.active) return state;
  const atCursor = queue.scenarioIds[queue.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) {
    return { ...state, marathonQueue: { ...queue, active: true } };
  }

  const atEnd = queue.cursor >= queue.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = queue.cursor + 1;
    const nextScenario = queue.scenarioIds[cursor] ?? null;
    return {
      ...state,
      marathonQueue: { ...queue, cursor },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  if (queue.loopOnComplete) {
    const nextScenario = queue.scenarioIds[0] ?? null;
    return {
      ...state,
      marathonQueue: { ...queue, cursor: 0 },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  return {
    ...state,
    marathonQueue: { ...queue, active: false },
  };
}

export function mergeReplayLedgers(
  a: O10mScenarioReplayRow[],
  b: O10mScenarioReplayRow[],
): O10mScenarioReplayRow[] {
  const map = new Map<string, O10mScenarioReplayRow>();
  for (const row of [...a, ...b]) {
    const prev = map.get(row.scenarioId);
    if (!prev) {
      map.set(row.scenarioId, { ...row });
      continue;
    }
    map.set(row.scenarioId, {
      scenarioId: row.scenarioId,
      playCount: Math.max(prev.playCount, row.playCount),
      primaryVictories: Math.max(prev.primaryVictories, row.primaryVictories),
      lastPlayedTurn: Math.max(prev.lastPlayedTurn, row.lastPlayedTurn),
    });
  }
  return [...map.values()].sort((x, y) => y.lastPlayedTurn - x.lastPlayedTurn).slice(0, O10M_REPLAY_LEDGER_CAP);
}

export function replayLedgerSummary(state: O10mModesPersistedState): {
  trackedScenarios: number;
  totalPlays: number;
  totalPrimaryVictories: number;
} {
  const ledger = sanitizeReplayLedger(state.replayLedger);
  return {
    trackedScenarios: ledger.length,
    totalPlays: ledger.reduce((s, r) => s + r.playCount, 0),
    totalPrimaryVictories: ledger.reduce((s, r) => s + r.primaryVictories, 0),
  };
}

export function applyPostRunPersistedUpdates(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  let next = recordScenarioReplayEntry(state, run, turn);
  next = advanceInjunctionSessionAfterRun(next, run);
  next = advanceQuowarrantoSessionAfterRun(next, run);
  next = advanceHabeasSessionAfterRun(next, run);
  next = advanceProhibitionSessionAfterRun(next, run);
  next = advanceMandamusSessionAfterRun(next, run);
  next = advanceCertiorariSessionAfterRun(next, run);
  next = advanceSupersedeSessionAfterRun(next, run);
  next = advanceQuashSessionAfterRun(next, run);
  next = advanceSetAsideSessionAfterRun(next, run);
  next = advanceReinstatementSessionAfterRun(next, run);
  next = advanceAnnulmentSessionAfterRun(next, run);
  next = advanceReversalSessionAfterRun(next, run);
  next = advanceRemandSessionAfterRun(next, run);
  next = advanceVacaturSessionAfterRun(next, run);
  next = advanceExpungementSessionAfterRun(next, run);
  next = advanceExonerationSessionAfterRun(next, run);
  next = advanceAcquittalSessionAfterRun(next, run);
  next = advanceCommutationSessionAfterRun(next, run);
  next = advanceProbationSessionAfterRun(next, run);
  next = advanceParoleSessionAfterRun(next, run);
  next = advanceReprieveSessionAfterRun(next, run);
  next = advanceAmnestySessionAfterRun(next, run);
  next = advancePardonSessionAfterRun(next, run);
  next = advanceClemencySessionAfterRun(next, run);
  next = advanceAppealSessionAfterRun(next, run);
  next = advanceIndictmentSessionAfterRun(next, run);
  next = advanceTribunalSessionAfterRun(next, run);
  next = advanceWitnessSessionAfterRun(next, run);
  next = advanceSubjectSessionAfterRun(next, run);
  next = advanceExtractionSessionAfterRun(next, run);
  next = advanceEscortSessionAfterRun(next, run);
  next = advanceConvoySessionAfterRun(next, run);
  next = advanceSiegeSessionAfterRun(next, run);
  next = advanceVoyageSessionAfterRun(next, run);
  next = advanceCaravanSessionAfterRun(next, run);
  next = advancePilgrimageSessionAfterRun(next, run);
  next = advanceOdysseySessionAfterRun(next, run);
  next = advanceExpeditionSessionAfterRun(next, run);
  next = advanceCircuitSessionAfterRun(next, run);
  next = advanceRelaySessionAfterRun(next, run);
  next = advanceMarathonQueueAfterRun(next, run);
  next = advanceGauntletSessionAfterRun(next, run);
  return next;
}

// --- bundled from src/save-format-gauntlet.ts ---
export const O10M_GAUNTLET_SCENARIO_CAP = 6;
export const O10M_GAUNTLET_LIVES_MAX = 5;
export const O10M_UNLOCK_TOKEN_CAP = 16;

const VALID_CHALLENGES = new Set(listO10mChallengeModeIds());

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

export function unlockTokenForGauntletId(gauntletId: string): string | null {
  if (!gauntletId.startsWith('o10m_gauntlet_')) return null;
  return `o10m_unlock_${gauntletId.slice('o10m_gauntlet_'.length)}`;
}

export function sanitizeCatalogUnlockTokens(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is string => typeof t === 'string' && t.startsWith('o10m_unlock_'))
    .slice(0, O10M_UNLOCK_TOKEN_CAP);
}

export function sanitizeGauntletSession(raw: unknown): O10mGauntletSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const gauntletId =
    typeof o.gauntletId === 'string' && o.gauntletId.startsWith('o10m_gauntlet_') ? o.gauntletId : null;
  if (!gauntletId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : gauntletId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_GAUNTLET_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const livesRaw = Math.floor(num(o.livesRemaining, O10M_GAUNTLET_LIVES_MAX));
  const livesRemaining = Math.min(Math.max(1, livesRaw), O10M_GAUNTLET_LIVES_MAX);
  const failures = Math.max(0, Math.floor(num(o.failures, 0)));
  const challengeRaw = o.requiredChallengeId;
  const requiredChallengeId =
    typeof challengeRaw === 'string' && VALID_CHALLENGES.has(challengeRaw as O10mChallengeModeId)
      ? (challengeRaw as O10mChallengeModeId)
      : null;
  const active = o.active !== false;
  return {
    gauntletId,
    label,
    scenarioIds,
    cursor,
    livesRemaining,
    requiredChallengeId,
    active,
    failures,
  };
}

export function createGauntletSession(params: {
  gauntletId: string;
  label: string;
  scenarioIds: string[];
  livesRemaining?: number;
  requiredChallengeId?: O10mChallengeModeId | null;
}): { session: O10mGauntletSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.gauntletId.startsWith('o10m_gauntlet_')) {
    return { session: null, warnings: ['Gauntlet ids must start with o10m_gauntlet_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_GAUNTLET_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Gauntlet requires at least one valid scenario.'] };
  }
  const livesRemaining = Math.min(
    O10M_GAUNTLET_LIVES_MAX,
    Math.max(1, params.livesRemaining ?? 3),
  );
  const requiredChallengeId =
    params.requiredChallengeId && VALID_CHALLENGES.has(params.requiredChallengeId)
      ? params.requiredChallengeId
      : null;
  return {
    session: {
      gauntletId: params.gauntletId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      livesRemaining,
      requiredChallengeId,
      active: true,
      failures: 0,
    },
    warnings,
  };
}

export function attachGauntletSessionToState(
  state: O10mModesPersistedState,
  session: O10mGauntletSession,
): O10mModesPersistedState {
  const sanitized = sanitizeGauntletSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  const challengeModeIds = sanitized.requiredChallengeId
    ? [sanitized.requiredChallengeId]
    : state.challengeModeIds;
  return {
    ...state,
    gauntletSession: sanitized,
    marathonQueue: null,
    relaySession: null,
    circuitSession: null,
    expeditionSession: null,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    scenarioId,
    challengeModeIds,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearGauntletSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, gauntletSession: null };
}

export function getGauntletScenarioAtCursor(session: O10mGauntletSession | null | undefined): string | null {
  const g = sanitizeGauntletSession(session);
  if (!g || !g.active) return null;
  return g.scenarioIds[g.cursor] ?? null;
}

export function grantCatalogUnlockToken(
  state: O10mModesPersistedState,
  token: string,
): O10mModesPersistedState {
  if (!token.startsWith('o10m_unlock_')) return state;
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  if (tokens.includes(token)) return state;
  return { ...state, catalogUnlockTokens: [...tokens, token].slice(-O10M_UNLOCK_TOKEN_CAP) };
}

export function mergeCatalogUnlockTokens(a: string[], b: string[]): string[] {
  return [...new Set([...sanitizeCatalogUnlockTokens(a), ...sanitizeCatalogUnlockTokens(b)])].slice(
    0,
    O10M_UNLOCK_TOKEN_CAP,
  );
}

export function advanceGauntletSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeGauntletSession(state.gauntletSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;

  if (session.requiredChallengeId && !run.challengeModeIds.includes(session.requiredChallengeId)) {
    return state;
  }

  if (run.primaryVictory) {
    const atEnd = session.cursor >= session.scenarioIds.length - 1;
    if (!atEnd) {
      const cursor = session.cursor + 1;
      const nextScenario = session.scenarioIds[cursor] ?? null;
      return {
        ...state,
        gauntletSession: { ...session, cursor, failures: session.failures },
        scenarioId: nextScenario ?? state.scenarioId,
      };
    }

    const token = unlockTokenForGauntletId(session.gauntletId);
    let next: O10mModesPersistedState = {
      ...state,
      gauntletSession: { ...session, active: false },
    };
    if (token) next = grantCatalogUnlockToken(next, token);
    return next;
  }

  const failures = session.failures + 1;
  const livesRemaining = session.livesRemaining - 1;
  if (livesRemaining <= 0) {
    return {
      ...state,
      gauntletSession: { ...session, active: false, failures, livesRemaining: 0 },
    };
  }
  return {
    ...state,
    gauntletSession: { ...session, failures, livesRemaining },
  };
}

export function gauntletSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  livesRemaining: number | null;
  unlockTokenCount: number;
} {
  const session = sanitizeGauntletSession(state.gauntletSession);
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    livesRemaining: session?.active ? session.livesRemaining : null,
    unlockTokenCount: tokens.length,
  };
}

// --- bundled from src/save-format-relay.ts ---
export const O10M_RELAY_SCENARIO_CAP = 6;
export const O10M_RELAY_CARRY_MONEY_CAP = 2500;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function mergeLegCarry(base: O10mChainCarryBonus, add: O10mChainCarryBonus): O10mChainCarryBonus {
  const standingDelta = { ...(base.standingDelta || {}) };
  for (const [k, v] of Object.entries(add.standingDelta || {})) {
    standingDelta[k] = (standingDelta[k] || 0) + v;
  }
  const money = Math.min(
    O10M_RELAY_CARRY_MONEY_CAP,
    (base.startingMoneyDelta || 0) + (add.startingMoneyDelta || 0),
  );
  return {
    startingMoneyDelta: money > 0 ? money : undefined,
    standingDelta: Object.keys(standingDelta).length ? standingDelta : undefined,
    forcedSettingsPatch: { ...(base.forcedSettingsPatch || {}), ...(add.forcedSettingsPatch || {}) },
  };
}

function sanitizeLegCarry(raw: unknown): O10mChainCarryBonus {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  const standingDelta =
    o.standingDelta && typeof o.standingDelta === 'object'
      ? (Object.fromEntries(
          Object.entries(o.standingDelta as Record<string, unknown>).filter(
            ([, v]) => typeof v === 'number' && Number.isFinite(v),
          ),
        ) as Record<string, number>)
      : undefined;
  const moneyRaw = num(o.startingMoneyDelta, 0);
  const startingMoneyDelta =
    moneyRaw > 0 ? Math.min(O10M_RELAY_CARRY_MONEY_CAP, Math.floor(moneyRaw)) : undefined;
  const forcedSettingsPatch =
    o.forcedSettingsPatch && typeof o.forcedSettingsPatch === 'object'
      ? (o.forcedSettingsPatch as Record<string, unknown>)
      : undefined;
  return { startingMoneyDelta, standingDelta, forcedSettingsPatch };
}

export function unlockTokenForRelayId(relayId: string): string | null {
  if (!relayId.startsWith('o10m_relay_')) return null;
  return `o10m_unlock_${relayId.slice('o10m_relay_'.length)}`;
}

export function relayLegCarryFromRun(run: O10mRunSummary): O10mChainCarryBonus {
  if (!run.primaryVictory) return {};
  const bonus = Math.min(500, Math.max(50, Math.floor(run.playerMoney / 12)));
  return { startingMoneyDelta: bonus };
}

export function sanitizeRelaySession(raw: unknown): O10mRelaySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const relayId =
    typeof o.relayId === 'string' && o.relayId.startsWith('o10m_relay_') ? o.relayId : null;
  if (!relayId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : relayId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_RELAY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const active = o.active !== false;
  return {
    relayId,
    label,
    scenarioIds,
    cursor,
    active,
    legCarry: sanitizeLegCarry(o.legCarry),
  };
}

export function createRelaySession(params: {
  relayId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mRelaySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.relayId.startsWith('o10m_relay_')) {
    return { session: null, warnings: ['Relay ids must start with o10m_relay_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_RELAY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Relay requires at least one valid scenario.'] };
  }
  return {
    session: {
      relayId: params.relayId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      legCarry: {},
    },
    warnings,
  };
}

export function attachRelaySessionToState(
  state: O10mModesPersistedState,
  session: O10mRelaySession,
): O10mModesPersistedState {
  const sanitized = sanitizeRelaySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    relaySession: sanitized,
    marathonQueue: null,
    gauntletSession: null,
    circuitSession: null,
    expeditionSession: null,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearRelaySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, relaySession: null };
}

export function getRelayScenarioAtCursor(session: O10mRelaySession | null | undefined): string | null {
  const relay = sanitizeRelaySession(session);
  if (!relay || !relay.active) return null;
  return relay.scenarioIds[relay.cursor] ?? null;
}

export function buildRelayScenarioStartOverrides(session: O10mRelaySession | null | undefined): {
  startingMoneyDelta: number;
  startingStandingDelta?: Record<string, number>;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const relay = sanitizeRelaySession(session);
  if (!relay) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const carry = relay.legCarry;
  return {
    startingMoneyDelta: carry.startingMoneyDelta ?? 0,
    startingStandingDelta: carry.standingDelta ? { ...carry.standingDelta } : undefined,
    forcedSettingsPatch: {
      ...(carry.forcedSettingsPatch || {}),
      o10mActiveRelayId: relay.relayId,
      o10mActiveRelayStep: relay.cursor,
    },
  };
}

export function advanceRelaySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeRelaySession(state.relaySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const legCarry = mergeLegCarry(session.legCarry, relayLegCarryFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      relaySession: { ...session, cursor, legCarry },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForRelayId(session.relayId);
  let next: O10mModesPersistedState = {
    ...state,
    relaySession: { ...session, active: false, legCarry },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function relaySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  carryMoney: number;
} {
  const session = sanitizeRelaySession(state.relaySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    carryMoney: session?.legCarry.startingMoneyDelta ?? 0,
  };
}

// --- bundled from src/save-format-circuit.ts ---
export const O10M_CIRCUIT_SCENARIO_CAP = 6;
export const O10M_CIRCUIT_MOMENTUM_CAP = 900;
export const O10M_CIRCUIT_MOMENTUM_MONEY_CAP = 800;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCircuitPhase>(['warmup', 'ascent', 'summit']);

export function unlockTokenForCircuitId(circuitId: string): string | null {
  if (!circuitId.startsWith('o10m_circuit_')) return null;
  return `o10m_unlock_${circuitId.slice('o10m_circuit_'.length)}`;
}

export function circuitPhaseForCursor(cursor: number, scenarioCount: number): O10mCircuitPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'summit';
  if (clamped >= Math.floor(total / 2)) return 'ascent';
  return 'warmup';
}

export function circuitMomentumFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  return Math.min(120, Math.max(15, Math.floor(run.playerNetWorth / 180)));
}

export function sanitizeCircuitSession(raw: unknown): O10mCircuitSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const circuitId =
    typeof o.circuitId === 'string' && o.circuitId.startsWith('o10m_circuit_') ? o.circuitId : null;
  if (!circuitId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : circuitId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CIRCUIT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const momentumScore = Math.min(O10M_CIRCUIT_MOMENTUM_CAP, Math.max(0, Math.floor(num(o.momentumScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCircuitPhase)
      ? (phaseRaw as O10mCircuitPhase)
      : circuitPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    circuitId,
    label,
    scenarioIds,
    cursor,
    active,
    momentumScore,
    phaseTag,
  };
}

export function createCircuitSession(params: {
  circuitId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCircuitSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.circuitId.startsWith('o10m_circuit_')) {
    return { session: null, warnings: ['Circuit ids must start with o10m_circuit_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_CIRCUIT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Circuit requires at least one valid scenario.'] };
  }
  return {
    session: {
      circuitId: params.circuitId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      momentumScore: 0,
      phaseTag: circuitPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCircuitSessionToState(
  state: O10mModesPersistedState,
  session: O10mCircuitSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCircuitSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    circuitSession: sanitized,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    expeditionSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearCircuitSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, circuitSession: null };
}

export function getCircuitScenarioAtCursor(session: O10mCircuitSession | null | undefined): string | null {
  const circuit = sanitizeCircuitSession(session);
  if (!circuit || !circuit.active) return null;
  return circuit.scenarioIds[circuit.cursor] ?? null;
}

export function buildCircuitScenarioStartOverrides(session: O10mCircuitSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const circuit = sanitizeCircuitSession(session);
  if (!circuit) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CIRCUIT_MOMENTUM_MONEY_CAP,
    Math.floor(circuit.momentumScore * 0.85),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCircuitId: circuit.circuitId,
      o10mActiveCircuitStep: circuit.cursor,
      o10mActiveCircuitPhase: circuit.phaseTag,
      o10mCircuitMomentum: circuit.momentumScore,
    },
  };
}

export function advanceCircuitSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCircuitSession(state.circuitSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const momentumScore = Math.min(
    O10M_CIRCUIT_MOMENTUM_CAP,
    session.momentumScore + circuitMomentumFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      circuitSession: {
        ...session,
        cursor,
        momentumScore,
        phaseTag: circuitPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCircuitId(session.circuitId);
  let next: O10mModesPersistedState = {
    ...state,
    circuitSession: { ...session, active: false, momentumScore, phaseTag: 'summit' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function circuitSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  momentum: number;
  phase: O10mCircuitPhase | null;
} {
  const session = sanitizeCircuitSession(state.circuitSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    momentum: session?.momentumScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-expedition.ts ---
export const O10M_EXPEDITION_SCENARIO_CAP = 6;
export const O10M_EXPEDITION_SUPPLY_CAP = 720;
export const O10M_EXPEDITION_SUPPLY_MONEY_CAP = 650;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_LEGS = new Set<O10mExpeditionLeg>(['departure', 'transit', 'arrival']);

export function unlockTokenForExpeditionId(expeditionId: string): string | null {
  if (!expeditionId.startsWith('o10m_expedition_')) return null;
  return `o10m_unlock_${expeditionId.slice('o10m_expedition_'.length)}`;
}

export function expeditionLegForCursor(cursor: number, scenarioCount: number): O10mExpeditionLeg {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'arrival';
  if (clamped >= Math.floor(total / 2)) return 'transit';
  return 'departure';
}

export function expeditionSupplyFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  return Math.min(95, Math.max(12, Math.floor(run.playerNetWorth / 210)));
}

export function sanitizeExpeditionSession(raw: unknown): O10mExpeditionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const expeditionId =
    typeof o.expeditionId === 'string' && o.expeditionId.startsWith('o10m_expedition_')
      ? o.expeditionId
      : null;
  if (!expeditionId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : expeditionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXPEDITION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const supplyScore = Math.min(O10M_EXPEDITION_SUPPLY_CAP, Math.max(0, Math.floor(num(o.supplyScore, 0))));
  const legRaw = o.legTag;
  const legTag =
    typeof legRaw === 'string' && VALID_LEGS.has(legRaw as O10mExpeditionLeg)
      ? (legRaw as O10mExpeditionLeg)
      : expeditionLegForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    expeditionId,
    label,
    scenarioIds,
    cursor,
    active,
    supplyScore,
    legTag,
  };
}

export function createExpeditionSession(params: {
  expeditionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExpeditionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.expeditionId.startsWith('o10m_expedition_')) {
    return { session: null, warnings: ['Expedition ids must start with o10m_expedition_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_EXPEDITION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Expedition requires at least one valid scenario.'] };
  }
  return {
    session: {
      expeditionId: params.expeditionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      supplyScore: 0,
      legTag: expeditionLegForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExpeditionSessionToState(
  state: O10mModesPersistedState,
  session: O10mExpeditionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExpeditionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    expeditionSession: sanitized,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearExpeditionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, expeditionSession: null };
}

export function getExpeditionScenarioAtCursor(session: O10mExpeditionSession | null | undefined): string | null {
  const expedition = sanitizeExpeditionSession(session);
  if (!expedition || !expedition.active) return null;
  return expedition.scenarioIds[expedition.cursor] ?? null;
}

export function buildExpeditionScenarioStartOverrides(session: O10mExpeditionSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const expedition = sanitizeExpeditionSession(session);
  if (!expedition) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXPEDITION_SUPPLY_MONEY_CAP,
    Math.floor(expedition.supplyScore * 0.75),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExpeditionId: expedition.expeditionId,
      o10mActiveExpeditionStep: expedition.cursor,
      o10mActiveExpeditionLeg: expedition.legTag,
      o10mExpeditionSupply: expedition.supplyScore,
    },
  };
}

export function advanceExpeditionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExpeditionSession(state.expeditionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const supplyScore = Math.min(
    O10M_EXPEDITION_SUPPLY_CAP,
    session.supplyScore + expeditionSupplyFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      expeditionSession: {
        ...session,
        cursor,
        supplyScore,
        legTag: expeditionLegForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExpeditionId(session.expeditionId);
  let next: O10mModesPersistedState = {
    ...state,
    expeditionSession: { ...session, active: false, supplyScore, legTag: 'arrival' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function expeditionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  supply: number;
  leg: O10mExpeditionLeg | null;
} {
  const session = sanitizeExpeditionSession(state.expeditionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    supply: session?.supplyScore ?? 0,
    leg: session?.active ? session.legTag : null,
  };
}

// --- bundled from src/save-format-odyssey.ts ---
export const O10M_ODYSSEY_SCENARIO_CAP = 6;
export const O10M_ODYSSEY_RENOWN_CAP = 680;
export const O10M_ODYSSEY_RENOWN_MONEY_CAP = 720;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_ACTS = new Set<O10mOdysseyAct>(['opening', 'crossing', 'homecoming']);

export function unlockTokenForOdysseyId(odysseyId: string): string | null {
  if (!odysseyId.startsWith('o10m_odyssey_')) return null;
  return `o10m_unlock_${odysseyId.slice('o10m_odyssey_'.length)}`;
}

export function odysseyActForCursor(cursor: number, scenarioCount: number): O10mOdysseyAct {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'homecoming';
  if (clamped >= Math.floor(total / 2)) return 'crossing';
  return 'opening';
}

export function odysseyRenownFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingBonus = Math.min(25, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(100, Math.max(14, Math.floor(run.playerNetWorth / 200) + standingBonus));
}

export function sanitizeOdysseySession(raw: unknown): O10mOdysseySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const odysseyId =
    typeof o.odysseyId === 'string' && o.odysseyId.startsWith('o10m_odyssey_') ? o.odysseyId : null;
  if (!odysseyId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : odysseyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ODYSSEY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const renownScore = Math.min(O10M_ODYSSEY_RENOWN_CAP, Math.max(0, Math.floor(num(o.renownScore, 0))));
  const actRaw = o.actTag;
  const actTag =
    typeof actRaw === 'string' && VALID_ACTS.has(actRaw as O10mOdysseyAct)
      ? (actRaw as O10mOdysseyAct)
      : odysseyActForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    odysseyId,
    label,
    scenarioIds,
    cursor,
    active,
    renownScore,
    actTag,
  };
}

export function createOdysseySession(params: {
  odysseyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mOdysseySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.odysseyId.startsWith('o10m_odyssey_')) {
    return { session: null, warnings: ['Odyssey ids must start with o10m_odyssey_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_ODYSSEY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Odyssey requires at least one valid scenario.'] };
  }
  return {
    session: {
      odysseyId: params.odysseyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      renownScore: 0,
      actTag: odysseyActForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachOdysseySessionToState(
  state: O10mModesPersistedState,
  session: O10mOdysseySession,
): O10mModesPersistedState {
  const sanitized = sanitizeOdysseySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    odysseySession: sanitized,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearOdysseySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, odysseySession: null };
}

export function getOdysseyScenarioAtCursor(session: O10mOdysseySession | null | undefined): string | null {
  const odyssey = sanitizeOdysseySession(session);
  if (!odyssey || !odyssey.active) return null;
  return odyssey.scenarioIds[odyssey.cursor] ?? null;
}

export function buildOdysseyScenarioStartOverrides(session: O10mOdysseySession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const odyssey = sanitizeOdysseySession(session);
  if (!odyssey) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_ODYSSEY_RENOWN_MONEY_CAP, Math.floor(odyssey.renownScore * 0.8));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveOdysseyId: odyssey.odysseyId,
      o10mActiveOdysseyStep: odyssey.cursor,
      o10mActiveOdysseyAct: odyssey.actTag,
      o10mOdysseyRenown: odyssey.renownScore,
    },
  };
}

export function advanceOdysseySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeOdysseySession(state.odysseySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const renownScore = Math.min(O10M_ODYSSEY_RENOWN_CAP, session.renownScore + odysseyRenownFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      odysseySession: {
        ...session,
        cursor,
        renownScore,
        actTag: odysseyActForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForOdysseyId(session.odysseyId);
  let next: O10mModesPersistedState = {
    ...state,
    odysseySession: { ...session, active: false, renownScore, actTag: 'homecoming' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function odysseySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  renown: number;
  act: O10mOdysseyAct | null;
} {
  const session = sanitizeOdysseySession(state.odysseySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    renown: session?.renownScore ?? 0,
    act: session?.active ? session.actTag : null,
  };
}

// --- bundled from src/save-format-pilgrimage.ts ---
export const O10M_PILGRIMAGE_SCENARIO_CAP = 6;
export const O10M_PILGRIMAGE_DEVOTION_CAP = 640;
export const O10M_PILGRIMAGE_DEVOTION_MONEY_CAP = 700;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_STAGES = new Set<O10mPilgrimageStage>(['setting_out', 'midway', 'sanctuary']);

export function unlockTokenForPilgrimageId(pilgrimageId: string): string | null {
  if (!pilgrimageId.startsWith('o10m_pilgrimage_')) return null;
  return `o10m_unlock_${pilgrimageId.slice('o10m_pilgrimage_'.length)}`;
}

export function pilgrimageStageForCursor(cursor: number, scenarioCount: number): O10mPilgrimageStage {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'sanctuary';
  if (clamped >= Math.floor(total / 2)) return 'midway';
  return 'setting_out';
}

export function pilgrimageDevotionFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const regionBonus = Math.min(20, run.regionsControlled * 6);
  return Math.min(92, Math.max(11, Math.floor(run.playerNetWorth / 205) + regionBonus));
}

export function sanitizePilgrimageSession(raw: unknown): O10mPilgrimageSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pilgrimageId =
    typeof o.pilgrimageId === 'string' && o.pilgrimageId.startsWith('o10m_pilgrimage_')
      ? o.pilgrimageId
      : null;
  if (!pilgrimageId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : pilgrimageId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PILGRIMAGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const devotionScore = Math.min(
    O10M_PILGRIMAGE_DEVOTION_CAP,
    Math.max(0, Math.floor(num(o.devotionScore, 0))),
  );
  const stageRaw = o.stageTag;
  const stageTag =
    typeof stageRaw === 'string' && VALID_STAGES.has(stageRaw as O10mPilgrimageStage)
      ? (stageRaw as O10mPilgrimageStage)
      : pilgrimageStageForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    pilgrimageId,
    label,
    scenarioIds,
    cursor,
    active,
    devotionScore,
    stageTag,
  };
}

export function createPilgrimageSession(params: {
  pilgrimageId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mPilgrimageSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.pilgrimageId.startsWith('o10m_pilgrimage_')) {
    return { session: null, warnings: ['Pilgrimage ids must start with o10m_pilgrimage_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_PILGRIMAGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Pilgrimage requires at least one valid scenario.'] };
  }
  return {
    session: {
      pilgrimageId: params.pilgrimageId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      devotionScore: 0,
      stageTag: pilgrimageStageForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachPilgrimageSessionToState(
  state: O10mModesPersistedState,
  session: O10mPilgrimageSession,
): O10mModesPersistedState {
  const sanitized = sanitizePilgrimageSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    pilgrimageSession: sanitized,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearPilgrimageSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, pilgrimageSession: null };
}

export function getPilgrimageScenarioAtCursor(session: O10mPilgrimageSession | null | undefined): string | null {
  const pilgrimage = sanitizePilgrimageSession(session);
  if (!pilgrimage || !pilgrimage.active) return null;
  return pilgrimage.scenarioIds[pilgrimage.cursor] ?? null;
}

export function buildPilgrimageScenarioStartOverrides(session: O10mPilgrimageSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const pilgrimage = sanitizePilgrimageSession(session);
  if (!pilgrimage) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PILGRIMAGE_DEVOTION_MONEY_CAP,
    Math.floor(pilgrimage.devotionScore * 0.78),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActivePilgrimageId: pilgrimage.pilgrimageId,
      o10mActivePilgrimageStep: pilgrimage.cursor,
      o10mActivePilgrimageStage: pilgrimage.stageTag,
      o10mPilgrimageDevotion: pilgrimage.devotionScore,
    },
  };
}

export function advancePilgrimageSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizePilgrimageSession(state.pilgrimageSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const devotionScore = Math.min(
    O10M_PILGRIMAGE_DEVOTION_CAP,
    session.devotionScore + pilgrimageDevotionFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      pilgrimageSession: {
        ...session,
        cursor,
        devotionScore,
        stageTag: pilgrimageStageForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForPilgrimageId(session.pilgrimageId);
  let next: O10mModesPersistedState = {
    ...state,
    pilgrimageSession: { ...session, active: false, devotionScore, stageTag: 'sanctuary' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function pilgrimageSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  devotion: number;
  stage: O10mPilgrimageStage | null;
} {
  const session = sanitizePilgrimageSession(state.pilgrimageSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    devotion: session?.devotionScore ?? 0,
    stage: session?.active ? session.stageTag : null,
  };
}

// --- bundled from src/save-format-caravan.ts ---
export const O10M_CARAVAN_SCENARIO_CAP = 6;
export const O10M_CARAVAN_CARGO_CAP = 660;
export const O10M_CARAVAN_CARGO_MONEY_CAP = 680;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_LEGS = new Set<O10mCaravanLeg>(['assembly', 'crossing', 'bazaar']);

export function unlockTokenForCaravanId(caravanId: string): string | null {
  if (!caravanId.startsWith('o10m_caravan_')) return null;
  return `o10m_unlock_${caravanId.slice('o10m_caravan_'.length)}`;
}

export function caravanLegForCursor(cursor: number, scenarioCount: number): O10mCaravanLeg {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'bazaar';
  if (clamped >= Math.floor(total / 2)) return 'crossing';
  return 'assembly';
}

export function caravanCargoFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const moneySlice = Math.floor(run.playerMoney / 240);
  return Math.min(88, Math.max(10, Math.floor(run.playerNetWorth / 215) + moneySlice));
}

export function sanitizeCaravanSession(raw: unknown): O10mCaravanSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const caravanId =
    typeof o.caravanId === 'string' && o.caravanId.startsWith('o10m_caravan_') ? o.caravanId : null;
  if (!caravanId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : caravanId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CARAVAN_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const cargoScore = Math.min(O10M_CARAVAN_CARGO_CAP, Math.max(0, Math.floor(num(o.cargoScore, 0))));
  const legRaw = o.legTag;
  const legTag =
    typeof legRaw === 'string' && VALID_LEGS.has(legRaw as O10mCaravanLeg)
      ? (legRaw as O10mCaravanLeg)
      : caravanLegForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    caravanId,
    label,
    scenarioIds,
    cursor,
    active,
    cargoScore,
    legTag,
  };
}

export function createCaravanSession(params: {
  caravanId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCaravanSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.caravanId.startsWith('o10m_caravan_')) {
    return { session: null, warnings: ['Caravan ids must start with o10m_caravan_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_CARAVAN_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Caravan requires at least one valid scenario.'] };
  }
  return {
    session: {
      caravanId: params.caravanId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      cargoScore: 0,
      legTag: caravanLegForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCaravanSessionToState(
  state: O10mModesPersistedState,
  session: O10mCaravanSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCaravanSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    caravanSession: sanitized,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearCaravanSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, caravanSession: null };
}

export function getCaravanScenarioAtCursor(session: O10mCaravanSession | null | undefined): string | null {
  const caravan = sanitizeCaravanSession(session);
  if (!caravan || !caravan.active) return null;
  return caravan.scenarioIds[caravan.cursor] ?? null;
}

export function buildCaravanScenarioStartOverrides(session: O10mCaravanSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const caravan = sanitizeCaravanSession(session);
  if (!caravan) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_CARAVAN_CARGO_MONEY_CAP, Math.floor(caravan.cargoScore * 0.77));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCaravanId: caravan.caravanId,
      o10mActiveCaravanStep: caravan.cursor,
      o10mActiveCaravanLeg: caravan.legTag,
      o10mCaravanCargo: caravan.cargoScore,
    },
  };
}

export function advanceCaravanSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCaravanSession(state.caravanSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const cargoScore = Math.min(O10M_CARAVAN_CARGO_CAP, session.cargoScore + caravanCargoFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      caravanSession: {
        ...session,
        cursor,
        cargoScore,
        legTag: caravanLegForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCaravanId(session.caravanId);
  let next: O10mModesPersistedState = {
    ...state,
    caravanSession: { ...session, active: false, cargoScore, legTag: 'bazaar' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function caravanSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  cargo: number;
  leg: O10mCaravanLeg | null;
} {
  const session = sanitizeCaravanSession(state.caravanSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    cargo: session?.cargoScore ?? 0,
    leg: session?.active ? session.legTag : null,
  };
}

// --- bundled from src/save-format-voyage.ts ---
export const O10M_VOYAGE_SCENARIO_CAP = 6;
export const O10M_VOYAGE_CHART_CAP = 620;
export const O10M_VOYAGE_CHART_MONEY_CAP = 710;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_SEGMENTS = new Set<O10mVoyageSegment>(['embark', 'open_sea', 'port_call']);

export function unlockTokenForVoyageId(voyageId: string): string | null {
  if (!voyageId.startsWith('o10m_voyage_')) return null;
  return `o10m_unlock_${voyageId.slice('o10m_voyage_'.length)}`;
}

export function voyageSegmentForCursor(cursor: number, scenarioCount: number): O10mVoyageSegment {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'port_call';
  if (clamped >= Math.floor(total / 2)) return 'open_sea';
  return 'embark';
}

export function voyageChartFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingBonus = Math.min(18, Math.floor(run.maxRegionalStanding / 5));
  return Math.min(90, Math.max(13, Math.floor(run.playerNetWorth / 220) + standingBonus));
}

export function sanitizeVoyageSession(raw: unknown): O10mVoyageSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const voyageId =
    typeof o.voyageId === 'string' && o.voyageId.startsWith('o10m_voyage_') ? o.voyageId : null;
  if (!voyageId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : voyageId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_VOYAGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const chartScore = Math.min(O10M_VOYAGE_CHART_CAP, Math.max(0, Math.floor(num(o.chartScore, 0))));
  const segmentRaw = o.segmentTag;
  const segmentTag =
    typeof segmentRaw === 'string' && VALID_SEGMENTS.has(segmentRaw as O10mVoyageSegment)
      ? (segmentRaw as O10mVoyageSegment)
      : voyageSegmentForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    voyageId,
    label,
    scenarioIds,
    cursor,
    active,
    chartScore,
    segmentTag,
  };
}

export function createVoyageSession(params: {
  voyageId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mVoyageSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.voyageId.startsWith('o10m_voyage_')) {
    return { session: null, warnings: ['Voyage ids must start with o10m_voyage_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_VOYAGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Voyage requires at least one valid scenario.'] };
  }
  return {
    session: {
      voyageId: params.voyageId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      chartScore: 0,
      segmentTag: voyageSegmentForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachVoyageSessionToState(
  state: O10mModesPersistedState,
  session: O10mVoyageSession,
): O10mModesPersistedState {
  const sanitized = sanitizeVoyageSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    voyageSession: sanitized,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearVoyageSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, voyageSession: null };
}

export function getVoyageScenarioAtCursor(session: O10mVoyageSession | null | undefined): string | null {
  const voyage = sanitizeVoyageSession(session);
  if (!voyage || !voyage.active) return null;
  return voyage.scenarioIds[voyage.cursor] ?? null;
}

export function buildVoyageScenarioStartOverrides(session: O10mVoyageSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const voyage = sanitizeVoyageSession(session);
  if (!voyage) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_VOYAGE_CHART_MONEY_CAP, Math.floor(voyage.chartScore * 0.76));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveVoyageId: voyage.voyageId,
      o10mActiveVoyageStep: voyage.cursor,
      o10mActiveVoyageSegment: voyage.segmentTag,
      o10mVoyageChart: voyage.chartScore,
    },
  };
}

export function advanceVoyageSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeVoyageSession(state.voyageSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const chartScore = Math.min(O10M_VOYAGE_CHART_CAP, session.chartScore + voyageChartFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      voyageSession: {
        ...session,
        cursor,
        chartScore,
        segmentTag: voyageSegmentForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForVoyageId(session.voyageId);
  let next: O10mModesPersistedState = {
    ...state,
    voyageSession: { ...session, active: false, chartScore, segmentTag: 'port_call' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function voyageSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  chart: number;
  segment: O10mVoyageSegment | null;
} {
  const session = sanitizeVoyageSession(state.voyageSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    chart: session?.chartScore ?? 0,
    segment: session?.active ? session.segmentTag : null,
  };
}

// --- bundled from src/save-format-siege.ts ---
export const O10M_SIEGE_SCENARIO_CAP = 6;
export const O10M_SIEGE_MORALE_CAP = 640;
export const O10M_SIEGE_MORALE_MONEY_CAP = 720;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSiegePhase>(['mustering', 'breach', 'relief']);

export function unlockTokenForSiegeId(siegeId: string): string | null {
  if (!siegeId.startsWith('o10m_siege_')) return null;
  return `o10m_unlock_${siegeId.slice('o10m_siege_'.length)}`;
}

export function siegePhaseForCursor(cursor: number, scenarioCount: number): O10mSiegePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'relief';
  if (clamped >= Math.floor(total / 2)) return 'breach';
  return 'mustering';
}

export function siegeMoraleFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const rivalPenalty = Math.min(14, Math.floor(run.rivalNetWorth / 180));
  return Math.min(92, Math.max(12, Math.floor(run.playerNetWorth / 210) + rivalPenalty));
}

export function sanitizeSiegeSession(raw: unknown): O10mSiegeSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const siegeId =
    typeof o.siegeId === 'string' && o.siegeId.startsWith('o10m_siege_') ? o.siegeId : null;
  if (!siegeId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : siegeId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SIEGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const moraleScore = Math.min(O10M_SIEGE_MORALE_CAP, Math.max(0, Math.floor(num(o.moraleScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSiegePhase)
      ? (phaseRaw as O10mSiegePhase)
      : siegePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    siegeId,
    label,
    scenarioIds,
    cursor,
    active,
    moraleScore,
    phaseTag,
  };
}

export function createSiegeSession(params: {
  siegeId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSiegeSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.siegeId.startsWith('o10m_siege_')) {
    return { session: null, warnings: ['Siege ids must start with o10m_siege_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_SIEGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Siege requires at least one valid scenario.'] };
  }
  return {
    session: {
      siegeId: params.siegeId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      moraleScore: 0,
      phaseTag: siegePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSiegeSessionToState(
  state: O10mModesPersistedState,
  session: O10mSiegeSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSiegeSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    siegeSession: sanitized,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearSiegeSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, siegeSession: null };
}

export function getSiegeScenarioAtCursor(session: O10mSiegeSession | null | undefined): string | null {
  const siege = sanitizeSiegeSession(session);
  if (!siege || !siege.active) return null;
  return siege.scenarioIds[siege.cursor] ?? null;
}

export function buildSiegeScenarioStartOverrides(session: O10mSiegeSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const siege = sanitizeSiegeSession(session);
  if (!siege) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_SIEGE_MORALE_MONEY_CAP, Math.floor(siege.moraleScore * 0.74));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSiegeId: siege.siegeId,
      o10mActiveSiegeStep: siege.cursor,
      o10mActiveSiegePhase: siege.phaseTag,
      o10mSiegeMorale: siege.moraleScore,
    },
  };
}

export function advanceSiegeSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSiegeSession(state.siegeSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const moraleScore = Math.min(O10M_SIEGE_MORALE_CAP, session.moraleScore + siegeMoraleFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      siegeSession: {
        ...session,
        cursor,
        moraleScore,
        phaseTag: siegePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSiegeId(session.siegeId);
  let next: O10mModesPersistedState = {
    ...state,
    siegeSession: { ...session, active: false, moraleScore, phaseTag: 'relief' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function siegeSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  morale: number;
  phase: O10mSiegePhase | null;
} {
  const session = sanitizeSiegeSession(state.siegeSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    morale: session?.moraleScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-convoy.ts ---
export const O10M_CONVOY_SCENARIO_CAP = 6;
export const O10M_CONVOY_HAUL_CAP = 650;
export const O10M_CONVOY_HAUL_MONEY_CAP = 730;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_STAGES = new Set<O10mConvoyStage>(['staging', 'transit', 'delivery']);

export function unlockTokenForConvoyId(convoyId: string): string | null {
  if (!convoyId.startsWith('o10m_convoy_')) return null;
  return `o10m_unlock_${convoyId.slice('o10m_convoy_'.length)}`;
}

export function convoyStageForCursor(cursor: number, scenarioCount: number): O10mConvoyStage {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'delivery';
  if (clamped >= Math.floor(total / 2)) return 'transit';
  return 'staging';
}

export function convoyHaulFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const moneySlice = Math.floor(run.playerMoney / 230);
  return Math.min(90, Math.max(11, Math.floor(run.playerNetWorth / 205) + moneySlice));
}

export function sanitizeConvoySession(raw: unknown): O10mConvoySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const convoyId =
    typeof o.convoyId === 'string' && o.convoyId.startsWith('o10m_convoy_') ? o.convoyId : null;
  if (!convoyId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : convoyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CONVOY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const haulScore = Math.min(O10M_CONVOY_HAUL_CAP, Math.max(0, Math.floor(num(o.haulScore, 0))));
  const stageRaw = o.stageTag;
  const stageTag =
    typeof stageRaw === 'string' && VALID_STAGES.has(stageRaw as O10mConvoyStage)
      ? (stageRaw as O10mConvoyStage)
      : convoyStageForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    convoyId,
    label,
    scenarioIds,
    cursor,
    active,
    haulScore,
    stageTag,
  };
}

export function createConvoySession(params: {
  convoyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mConvoySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.convoyId.startsWith('o10m_convoy_')) {
    return { session: null, warnings: ['Convoy ids must start with o10m_convoy_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_CONVOY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Convoy requires at least one valid scenario.'] };
  }
  return {
    session: {
      convoyId: params.convoyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      haulScore: 0,
      stageTag: convoyStageForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachConvoySessionToState(
  state: O10mModesPersistedState,
  session: O10mConvoySession,
): O10mModesPersistedState {
  const sanitized = sanitizeConvoySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    convoySession: sanitized,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearConvoySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, convoySession: null };
}

export function getConvoyScenarioAtCursor(session: O10mConvoySession | null | undefined): string | null {
  const convoy = sanitizeConvoySession(session);
  if (!convoy || !convoy.active) return null;
  return convoy.scenarioIds[convoy.cursor] ?? null;
}

export function buildConvoyScenarioStartOverrides(session: O10mConvoySession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const convoy = sanitizeConvoySession(session);
  if (!convoy) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_CONVOY_HAUL_MONEY_CAP, Math.floor(convoy.haulScore * 0.75));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveConvoyId: convoy.convoyId,
      o10mActiveConvoyStep: convoy.cursor,
      o10mActiveConvoyStage: convoy.stageTag,
      o10mConvoyHaul: convoy.haulScore,
    },
  };
}

export function advanceConvoySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeConvoySession(state.convoySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const haulScore = Math.min(O10M_CONVOY_HAUL_CAP, session.haulScore + convoyHaulFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      convoySession: {
        ...session,
        cursor,
        haulScore,
        stageTag: convoyStageForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForConvoyId(session.convoyId);
  let next: O10mModesPersistedState = {
    ...state,
    convoySession: { ...session, active: false, haulScore, stageTag: 'delivery' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function convoySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  haul: number;
  stage: O10mConvoyStage | null;
} {
  const session = sanitizeConvoySession(state.convoySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    haul: session?.haulScore ?? 0,
    stage: session?.active ? session.stageTag : null,
  };
}

// --- bundled from src/save-format-escort.ts ---
export const O10M_ESCORT_SCENARIO_CAP = 6;
export const O10M_ESCORT_TRUST_CAP = 660;
export const O10M_ESCORT_TRUST_MONEY_CAP = 740;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mEscortPhase>(['briefing', 'corridor', 'handoff']);

export function unlockTokenForEscortId(escortId: string): string | null {
  if (!escortId.startsWith('o10m_escort_')) return null;
  return `o10m_unlock_${escortId.slice('o10m_escort_'.length)}`;
}

export function escortPhaseForCursor(cursor: number, scenarioCount: number): O10mEscortPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'handoff';
  if (clamped >= Math.floor(total / 2)) return 'corridor';
  return 'briefing';
}

export function escortTrustFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(16, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(94, Math.max(10, Math.floor(run.playerNetWorth / 200) + standingSlice));
}

export function sanitizeEscortSession(raw: unknown): O10mEscortSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const escortId =
    typeof o.escortId === 'string' && o.escortId.startsWith('o10m_escort_') ? o.escortId : null;
  if (!escortId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : escortId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ESCORT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const trustScore = Math.min(O10M_ESCORT_TRUST_CAP, Math.max(0, Math.floor(num(o.trustScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mEscortPhase)
      ? (phaseRaw as O10mEscortPhase)
      : escortPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    escortId,
    label,
    scenarioIds,
    cursor,
    active,
    trustScore,
    phaseTag,
  };
}

export function createEscortSession(params: {
  escortId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mEscortSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.escortId.startsWith('o10m_escort_')) {
    return { session: null, warnings: ['Escort ids must start with o10m_escort_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_ESCORT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Escort requires at least one valid scenario.'] };
  }
  return {
    session: {
      escortId: params.escortId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      trustScore: 0,
      phaseTag: escortPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachEscortSessionToState(
  state: O10mModesPersistedState,
  session: O10mEscortSession,
): O10mModesPersistedState {
  const sanitized = sanitizeEscortSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    escortSession: sanitized,
    extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearEscortSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, escortSession: null };
}

export function getEscortScenarioAtCursor(session: O10mEscortSession | null | undefined): string | null {
  const escort = sanitizeEscortSession(session);
  if (!escort || !escort.active) return null;
  return escort.scenarioIds[escort.cursor] ?? null;
}

export function buildEscortScenarioStartOverrides(session: O10mEscortSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const escort = sanitizeEscortSession(session);
  if (!escort) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_ESCORT_TRUST_MONEY_CAP, Math.floor(escort.trustScore * 0.76));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveEscortId: escort.escortId,
      o10mActiveEscortStep: escort.cursor,
      o10mActiveEscortPhase: escort.phaseTag,
      o10mEscortTrust: escort.trustScore,
    },
  };
}

export function advanceEscortSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeEscortSession(state.escortSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const trustScore = Math.min(O10M_ESCORT_TRUST_CAP, session.trustScore + escortTrustFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      escortSession: {
        ...session,
        cursor,
        trustScore,
        phaseTag: escortPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForEscortId(session.escortId);
  let next: O10mModesPersistedState = {
    ...state,
    escortSession: { ...session, active: false, trustScore, phaseTag: 'handoff' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function escortSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  trust: number;
  phase: O10mEscortPhase | null;
} {
  const session = sanitizeEscortSession(state.escortSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    trust: session?.trustScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-extraction.ts ---
export const O10M_EXTRACTION_SCENARIO_CAP = 6;
export const O10M_EXTRACTION_ASSET_CAP = 680;
export const O10M_EXTRACTION_ASSET_MONEY_CAP = 760;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExtractionPhase>(['intel', 'rescue', 'exfil']);

export function unlockTokenForExtractionId(extractionId: string): string | null {
  if (!extractionId.startsWith('o10m_extraction_')) return null;
  return `o10m_unlock_${extractionId.slice('o10m_extraction_'.length)}`;
}

export function extractionPhaseForCursor(cursor: number, scenarioCount: number): O10mExtractionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'exfil';
  if (clamped >= Math.floor(total / 2)) return 'rescue';
  return 'intel';
}

export function extractionAssetFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(17, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(96, Math.max(11, Math.floor(run.playerNetWorth / 195) + standingSlice));
}

export function sanitizeExtractionSession(raw: unknown): O10mExtractionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const extractionId =
    typeof o.extractionId === 'string' && o.extractionId.startsWith('o10m_extraction_')
      ? o.extractionId
      : null;
  if (!extractionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : extractionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXTRACTION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const assetScore = Math.min(
    O10M_EXTRACTION_ASSET_CAP,
    Math.max(0, Math.floor(num(o.assetScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExtractionPhase)
      ? (phaseRaw as O10mExtractionPhase)
      : extractionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    extractionId,
    label,
    scenarioIds,
    cursor,
    active,
    assetScore,
    phaseTag,
  };
}

export function createExtractionSession(params: {
  extractionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExtractionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.extractionId.startsWith('o10m_extraction_')) {
    return { session: null, warnings: ['Extraction ids must start with o10m_extraction_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_EXTRACTION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Extraction requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      extractionId: params.extractionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      assetScore: 0,
      phaseTag: extractionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExtractionSessionToState(
  state: O10mModesPersistedState,
  session: O10mExtractionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExtractionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    extractionSession: sanitized,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearExtractionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, extractionSession: null };
}

export function getExtractionScenarioAtCursor(
  session: O10mExtractionSession | null | undefined,
): string | null {
  const extraction = sanitizeExtractionSession(session);
  if (!extraction || !extraction.active) return null;
  return extraction.scenarioIds[extraction.cursor] ?? null;
}

export function buildExtractionScenarioStartOverrides(
  session: O10mExtractionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const extraction = sanitizeExtractionSession(session);
  if (!extraction) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXTRACTION_ASSET_MONEY_CAP,
    Math.floor(extraction.assetScore * 0.77),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExtractionId: extraction.extractionId,
      o10mActiveExtractionStep: extraction.cursor,
      o10mActiveExtractionPhase: extraction.phaseTag,
      o10mExtractionAssets: extraction.assetScore,
    },
  };
}

export function advanceExtractionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExtractionSession(state.extractionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const assetScore = Math.min(
    O10M_EXTRACTION_ASSET_CAP,
    session.assetScore + extractionAssetFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      extractionSession: {
        ...session,
        cursor,
        assetScore,
        phaseTag: extractionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExtractionId(session.extractionId);
  let next: O10mModesPersistedState = {
    ...state,
    extractionSession: { ...session, active: false, assetScore, phaseTag: 'exfil' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function extractionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  assets: number;
  phase: O10mExtractionPhase | null;
} {
  const session = sanitizeExtractionSession(state.extractionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    assets: session?.assetScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-subject.ts ---
export const O10M_SUBJECT_SCENARIO_CAP = 6;
export const O10M_SUBJECT_FIDELITY_CAP = 700;
export const O10M_SUBJECT_FIDELITY_MONEY_CAP = 780;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSubjectPhase>(['intake', 'probe', 'verdict']);

export function unlockTokenForSubjectId(subjectId: string): string | null {
  if (!subjectId.startsWith('o10m_subject_')) return null;
  return `o10m_unlock_${subjectId.slice('o10m_subject_'.length)}`;
}

export function subjectPhaseForCursor(cursor: number, scenarioCount: number): O10mSubjectPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'verdict';
  if (clamped >= Math.floor(total / 2)) return 'probe';
  return 'intake';
}

export function subjectFidelityFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(98, Math.max(12, Math.floor(run.playerNetWorth / 188) + standingSlice));
}

export function sanitizeSubjectSession(raw: unknown): O10mSubjectSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const subjectId =
    typeof o.subjectId === 'string' && o.subjectId.startsWith('o10m_subject_') ? o.subjectId : null;
  if (!subjectId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : subjectId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SUBJECT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const fidelityScore = Math.min(
    O10M_SUBJECT_FIDELITY_CAP,
    Math.max(0, Math.floor(num(o.fidelityScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSubjectPhase)
      ? (phaseRaw as O10mSubjectPhase)
      : subjectPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    subjectId,
    label,
    scenarioIds,
    cursor,
    active,
    fidelityScore,
    phaseTag,
  };
}

export function createSubjectSession(params: {
  subjectId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSubjectSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.subjectId.startsWith('o10m_subject_')) {
    return { session: null, warnings: ['Subject ids must start with o10m_subject_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_SUBJECT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Subject arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      subjectId: params.subjectId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      fidelityScore: 0,
      phaseTag: subjectPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSubjectSessionToState(
  state: O10mModesPersistedState,
  session: O10mSubjectSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSubjectSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    subjectSession: sanitized,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearSubjectSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, subjectSession: null };
}

export function getSubjectScenarioAtCursor(
  session: O10mSubjectSession | null | undefined,
): string | null {
  const subject = sanitizeSubjectSession(session);
  if (!subject || !subject.active) return null;
  return subject.scenarioIds[subject.cursor] ?? null;
}

export function buildSubjectScenarioStartOverrides(
  session: O10mSubjectSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const subject = sanitizeSubjectSession(session);
  if (!subject) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SUBJECT_FIDELITY_MONEY_CAP,
    Math.floor(subject.fidelityScore * 0.79),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSubjectId: subject.subjectId,
      o10mActiveSubjectStep: subject.cursor,
      o10mActiveSubjectPhase: subject.phaseTag,
      o10mSubjectFidelity: subject.fidelityScore,
    },
  };
}

export function advanceSubjectSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSubjectSession(state.subjectSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const fidelityScore = Math.min(
    O10M_SUBJECT_FIDELITY_CAP,
    session.fidelityScore + subjectFidelityFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      subjectSession: {
        ...session,
        cursor,
        fidelityScore,
        phaseTag: subjectPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSubjectId(session.subjectId);
  let next: O10mModesPersistedState = {
    ...state,
    subjectSession: { ...session, active: false, fidelityScore, phaseTag: 'verdict' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function subjectSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  fidelity: number;
  phase: O10mSubjectPhase | null;
} {
  const session = sanitizeSubjectSession(state.subjectSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    fidelity: session?.fidelityScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-witness.ts ---
export const O10M_WITNESS_SCENARIO_CAP = 6;
export const O10M_WITNESS_CREDIBILITY_CAP = 720;
export const O10M_WITNESS_CREDIBILITY_MONEY_CAP = 800;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mWitnessPhase>(['brief', 'testimony', 'affirm']);

export function unlockTokenForWitnessId(witnessId: string): string | null {
  if (!witnessId.startsWith('o10m_witness_')) return null;
  return `o10m_unlock_${witnessId.slice('o10m_witness_'.length)}`;
}

export function witnessPhaseForCursor(cursor: number, scenarioCount: number): O10mWitnessPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'affirm';
  if (clamped >= Math.floor(total / 2)) return 'testimony';
  return 'brief';
}

export function witnessCredibilityFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(100, Math.max(13, Math.floor(run.playerNetWorth / 185) + standingSlice));
}

export function sanitizeWitnessSession(raw: unknown): O10mWitnessSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const witnessId =
    typeof o.witnessId === 'string' && o.witnessId.startsWith('o10m_witness_') ? o.witnessId : null;
  if (!witnessId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : witnessId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_WITNESS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const credibilityScore = Math.min(
    O10M_WITNESS_CREDIBILITY_CAP,
    Math.max(0, Math.floor(num(o.credibilityScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mWitnessPhase)
      ? (phaseRaw as O10mWitnessPhase)
      : witnessPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    witnessId,
    label,
    scenarioIds,
    cursor,
    active,
    credibilityScore,
    phaseTag,
  };
}

export function createWitnessSession(params: {
  witnessId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mWitnessSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.witnessId.startsWith('o10m_witness_')) {
    return { session: null, warnings: ['Witness ids must start with o10m_witness_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_WITNESS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Witness arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      witnessId: params.witnessId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      credibilityScore: 0,
      phaseTag: witnessPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachWitnessSessionToState(
  state: O10mModesPersistedState,
  session: O10mWitnessSession,
): O10mModesPersistedState {
  const sanitized = sanitizeWitnessSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    witnessSession: sanitized,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearWitnessSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, witnessSession: null };
}

export function getWitnessScenarioAtCursor(
  session: O10mWitnessSession | null | undefined,
): string | null {
  const witness = sanitizeWitnessSession(session);
  if (!witness || !witness.active) return null;
  return witness.scenarioIds[witness.cursor] ?? null;
}

export function buildWitnessScenarioStartOverrides(
  session: O10mWitnessSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const witness = sanitizeWitnessSession(session);
  if (!witness) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_WITNESS_CREDIBILITY_MONEY_CAP,
    Math.floor(witness.credibilityScore * 0.81),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveWitnessId: witness.witnessId,
      o10mActiveWitnessStep: witness.cursor,
      o10mActiveWitnessPhase: witness.phaseTag,
      o10mWitnessCredibility: witness.credibilityScore,
    },
  };
}

export function advanceWitnessSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeWitnessSession(state.witnessSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const credibilityScore = Math.min(
    O10M_WITNESS_CREDIBILITY_CAP,
    session.credibilityScore + witnessCredibilityFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      witnessSession: {
        ...session,
        cursor,
        credibilityScore,
        phaseTag: witnessPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForWitnessId(session.witnessId);
  let next: O10mModesPersistedState = {
    ...state,
    witnessSession: { ...session, active: false, credibilityScore, phaseTag: 'affirm' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function witnessSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  credibility: number;
  phase: O10mWitnessPhase | null;
} {
  const session = sanitizeWitnessSession(state.witnessSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    credibility: session?.credibilityScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-tribunal.ts ---
export const O10M_TRIBUNAL_SCENARIO_CAP = 6;
export const O10M_TRIBUNAL_GRAVITAS_CAP = 740;
export const O10M_TRIBUNAL_GRAVITAS_MONEY_CAP = 820;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mTribunalPhase>(['docket', 'hearing', 'seal']);

export function unlockTokenForTribunalId(tribunalId: string): string | null {
  if (!tribunalId.startsWith('o10m_tribunal_')) return null;
  return `o10m_unlock_${tribunalId.slice('o10m_tribunal_'.length)}`;
}

export function tribunalPhaseForCursor(cursor: number, scenarioCount: number): O10mTribunalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'seal';
  if (clamped >= Math.floor(total / 2)) return 'hearing';
  return 'docket';
}

export function tribunalGravitasFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(102, Math.max(14, Math.floor(run.playerNetWorth / 182) + standingSlice));
}

export function sanitizeTribunalSession(raw: unknown): O10mTribunalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const tribunalId =
    typeof o.tribunalId === 'string' && o.tribunalId.startsWith('o10m_tribunal_') ? o.tribunalId : null;
  if (!tribunalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : tribunalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_TRIBUNAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const gravitasScore = Math.min(
    O10M_TRIBUNAL_GRAVITAS_CAP,
    Math.max(0, Math.floor(num(o.gravitasScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mTribunalPhase)
      ? (phaseRaw as O10mTribunalPhase)
      : tribunalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    tribunalId,
    label,
    scenarioIds,
    cursor,
    active,
    gravitasScore,
    phaseTag,
  };
}

export function createTribunalSession(params: {
  tribunalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mTribunalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.tribunalId.startsWith('o10m_tribunal_')) {
    return { session: null, warnings: ['Tribunal ids must start with o10m_tribunal_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_TRIBUNAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Tribunal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      tribunalId: params.tribunalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      gravitasScore: 0,
      phaseTag: tribunalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachTribunalSessionToState(
  state: O10mModesPersistedState,
  session: O10mTribunalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeTribunalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    tribunalSession: sanitized,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearTribunalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, tribunalSession: null };
}

export function getTribunalScenarioAtCursor(
  session: O10mTribunalSession | null | undefined,
): string | null {
  const tribunal = sanitizeTribunalSession(session);
  if (!tribunal || !tribunal.active) return null;
  return tribunal.scenarioIds[tribunal.cursor] ?? null;
}

export function buildTribunalScenarioStartOverrides(
  session: O10mTribunalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const tribunal = sanitizeTribunalSession(session);
  if (!tribunal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_TRIBUNAL_GRAVITAS_MONEY_CAP,
    Math.floor(tribunal.gravitasScore * 0.83),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveTribunalId: tribunal.tribunalId,
      o10mActiveTribunalStep: tribunal.cursor,
      o10mActiveTribunalPhase: tribunal.phaseTag,
      o10mTribunalGravitas: tribunal.gravitasScore,
    },
  };
}

export function advanceTribunalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeTribunalSession(state.tribunalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const gravitasScore = Math.min(
    O10M_TRIBUNAL_GRAVITAS_CAP,
    session.gravitasScore + tribunalGravitasFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      tribunalSession: {
        ...session,
        cursor,
        gravitasScore,
        phaseTag: tribunalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForTribunalId(session.tribunalId);
  let next: O10mModesPersistedState = {
    ...state,
    tribunalSession: { ...session, active: false, gravitasScore, phaseTag: 'seal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function tribunalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  gravitas: number;
  phase: O10mTribunalPhase | null;
} {
  const session = sanitizeTribunalSession(state.tribunalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    gravitas: session?.gravitasScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-indictment.ts ---
export const O10M_INDICTMENT_SCENARIO_CAP = 6;
export const O10M_INDICTMENT_CASE_WEIGHT_CAP = 760;
export const O10M_INDICTMENT_CASE_WEIGHT_MONEY_CAP = 840;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mIndictmentPhase>(['charge', 'arraign', 'bind']);

export function unlockTokenForIndictmentId(indictmentId: string): string | null {
  if (!indictmentId.startsWith('o10m_indictment_')) return null;
  return `o10m_unlock_${indictmentId.slice('o10m_indictment_'.length)}`;
}

export function indictmentPhaseForCursor(cursor: number, scenarioCount: number): O10mIndictmentPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'bind';
  if (clamped >= Math.floor(total / 2)) return 'arraign';
  return 'charge';
}

export function indictmentCaseWeightFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(104, Math.max(15, Math.floor(run.playerNetWorth / 179) + standingSlice));
}

export function sanitizeIndictmentSession(raw: unknown): O10mIndictmentSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const indictmentId =
    typeof o.indictmentId === 'string' && o.indictmentId.startsWith('o10m_indictment_') ? o.indictmentId : null;
  if (!indictmentId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : indictmentId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_INDICTMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const caseWeightScore = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_CAP,
    Math.max(0, Math.floor(num(o.caseWeightScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mIndictmentPhase)
      ? (phaseRaw as O10mIndictmentPhase)
      : indictmentPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    indictmentId,
    label,
    scenarioIds,
    cursor,
    active,
    caseWeightScore,
    phaseTag,
  };
}

export function createIndictmentSession(params: {
  indictmentId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mIndictmentSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.indictmentId.startsWith('o10m_indictment_')) {
    return { session: null, warnings: ['Indictment ids must start with o10m_indictment_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_INDICTMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Indictment arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      indictmentId: params.indictmentId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      caseWeightScore: 0,
      phaseTag: indictmentPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachIndictmentSessionToState(
  state: O10mModesPersistedState,
  session: O10mIndictmentSession,
): O10mModesPersistedState {
  const sanitized = sanitizeIndictmentSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    indictmentSession: sanitized,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearIndictmentSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, indictmentSession: null };
}

export function getIndictmentScenarioAtCursor(
  session: O10mIndictmentSession | null | undefined,
): string | null {
  const indictment = sanitizeIndictmentSession(session);
  if (!indictment || !indictment.active) return null;
  return indictment.scenarioIds[indictment.cursor] ?? null;
}

export function buildIndictmentScenarioStartOverrides(
  session: O10mIndictmentSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const indictment = sanitizeIndictmentSession(session);
  if (!indictment) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_MONEY_CAP,
    Math.floor(indictment.caseWeightScore * 0.85),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveIndictmentId: indictment.indictmentId,
      o10mActiveIndictmentStep: indictment.cursor,
      o10mActiveIndictmentPhase: indictment.phaseTag,
      o10mIndictmentCaseWeight: indictment.caseWeightScore,
    },
  };
}

export function advanceIndictmentSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeIndictmentSession(state.indictmentSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const caseWeightScore = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_CAP,
    session.caseWeightScore + indictmentCaseWeightFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      indictmentSession: {
        ...session,
        cursor,
        caseWeightScore,
        phaseTag: indictmentPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForIndictmentId(session.indictmentId);
  let next: O10mModesPersistedState = {
    ...state,
    indictmentSession: { ...session, active: false, caseWeightScore, phaseTag: 'bind' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function indictmentSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  caseWeight: number;
  phase: O10mIndictmentPhase | null;
} {
  const session = sanitizeIndictmentSession(state.indictmentSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    caseWeight: session?.caseWeightScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-appeal.ts ---
export const O10M_APPEAL_SCENARIO_CAP = 6;
export const O10M_APPEAL_MERIT_SCORE_CAP = 780;
export const O10M_APPEAL_MERIT_SCORE_MONEY_CAP = 860;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAppealPhase>(['petition', 'review', 'grant']);

export function unlockTokenForAppealId(appealId: string): string | null {
  if (!appealId.startsWith('o10m_appeal_')) return null;
  return `o10m_unlock_${appealId.slice('o10m_appeal_'.length)}`;
}

export function appealPhaseForCursor(cursor: number, scenarioCount: number): O10mAppealPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'grant';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function appealMeritScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(106, Math.max(16, Math.floor(run.playerNetWorth / 176) + standingSlice));
}

export function sanitizeAppealSession(raw: unknown): O10mAppealSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const appealId =
    typeof o.appealId === 'string' && o.appealId.startsWith('o10m_appeal_') ? o.appealId : null;
  if (!appealId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : appealId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_APPEAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const meritScore = Math.min(
    O10M_APPEAL_MERIT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.meritScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAppealPhase)
      ? (phaseRaw as O10mAppealPhase)
      : appealPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    appealId,
    label,
    scenarioIds,
    cursor,
    active,
    meritScore,
    phaseTag,
  };
}

export function createAppealSession(params: {
  appealId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAppealSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.appealId.startsWith('o10m_appeal_')) {
    return { session: null, warnings: ['Appeal ids must start with o10m_appeal_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_APPEAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Appeal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      appealId: params.appealId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      meritScore: 0,
      phaseTag: appealPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAppealSessionToState(
  state: O10mModesPersistedState,
  session: O10mAppealSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAppealSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    appealSession: sanitized,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearAppealSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, appealSession: null };
}

export function getAppealScenarioAtCursor(
  session: O10mAppealSession | null | undefined,
): string | null {
  const appeal = sanitizeAppealSession(session);
  if (!appeal || !appeal.active) return null;
  return appeal.scenarioIds[appeal.cursor] ?? null;
}

export function buildAppealScenarioStartOverrides(
  session: O10mAppealSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const appeal = sanitizeAppealSession(session);
  if (!appeal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_APPEAL_MERIT_SCORE_MONEY_CAP,
    Math.floor(appeal.meritScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAppealId: appeal.appealId,
      o10mActiveAppealStep: appeal.cursor,
      o10mActiveAppealPhase: appeal.phaseTag,
      o10mAppealMeritScore: appeal.meritScore,
    },
  };
}

export function advanceAppealSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAppealSession(state.appealSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const meritScore = Math.min(
    O10M_APPEAL_MERIT_SCORE_CAP,
    session.meritScore + appealMeritScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      appealSession: {
        ...session,
        cursor,
        meritScore,
        phaseTag: appealPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAppealId(session.appealId);
  let next: O10mModesPersistedState = {
    ...state,
    appealSession: { ...session, active: false, meritScore, phaseTag: 'grant' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function appealSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  meritScore: number;
  phase: O10mAppealPhase | null;
} {
  const session = sanitizeAppealSession(state.appealSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    meritScore: session?.meritScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-clemency.ts ---
export const O10M_CLEMENCY_SCENARIO_CAP = 6;
export const O10M_CLEMENCY_MERCY_SCORE_CAP = 800;
export const O10M_CLEMENCY_MERCY_SCORE_MONEY_CAP = 880;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mClemencyPhase>(['plea', 'review', 'clemency']);

export function unlockTokenForClemencyId(clemencyId: string): string | null {
  if (!clemencyId.startsWith('o10m_clemency_')) return null;
  return `o10m_unlock_${clemencyId.slice('o10m_clemency_'.length)}`;
}

export function clemencyPhaseForCursor(cursor: number, scenarioCount: number): O10mClemencyPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'clemency';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'plea';
}

export function clemencyMercyScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(108, Math.max(17, Math.floor(run.playerNetWorth / 174) + standingSlice));
}

export function sanitizeClemencySession(raw: unknown): O10mClemencySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const clemencyId =
    typeof o.clemencyId === 'string' && o.clemencyId.startsWith('o10m_clemency_') ? o.clemencyId : null;
  if (!clemencyId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : clemencyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CLEMENCY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const mercyScore = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_CAP,
    Math.max(0, Math.floor(num(o.mercyScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mClemencyPhase)
      ? (phaseRaw as O10mClemencyPhase)
      : clemencyPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    clemencyId,
    label,
    scenarioIds,
    cursor,
    active,
    mercyScore,
    phaseTag,
  };
}

export function createClemencySession(params: {
  clemencyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mClemencySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.clemencyId.startsWith('o10m_clemency_')) {
    return { session: null, warnings: ['Clemency ids must start with o10m_clemency_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_CLEMENCY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Clemency arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      clemencyId: params.clemencyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      mercyScore: 0,
      phaseTag: clemencyPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachClemencySessionToState(
  state: O10mModesPersistedState,
  session: O10mClemencySession,
): O10mModesPersistedState {
  const sanitized = sanitizeClemencySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    clemencySession: sanitized,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearClemencySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, clemencySession: null };
}

export function getClemencyScenarioAtCursor(
  session: O10mClemencySession | null | undefined,
): string | null {
  const clemency = sanitizeClemencySession(session);
  if (!clemency || !clemency.active) return null;
  return clemency.scenarioIds[clemency.cursor] ?? null;
}

export function buildClemencyScenarioStartOverrides(
  session: O10mClemencySession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const clemency = sanitizeClemencySession(session);
  if (!clemency) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_MONEY_CAP,
    Math.floor(clemency.mercyScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveClemencyId: clemency.clemencyId,
      o10mActiveClemencyStep: clemency.cursor,
      o10mActiveClemencyPhase: clemency.phaseTag,
      o10mClemencyMercyScore: clemency.mercyScore,
    },
  };
}

export function advanceClemencySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeClemencySession(state.clemencySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const mercyScore = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_CAP,
    session.mercyScore + clemencyMercyScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      clemencySession: {
        ...session,
        cursor,
        mercyScore,
        phaseTag: clemencyPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForClemencyId(session.clemencyId);
  let next: O10mModesPersistedState = {
    ...state,
    clemencySession: { ...session, active: false, mercyScore, phaseTag: 'clemency' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function clemencySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  mercyScore: number;
  phase: O10mClemencyPhase | null;
} {
  const session = sanitizeClemencySession(state.clemencySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    mercyScore: session?.mercyScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-pardon.ts ---
export const O10M_PARDON_SCENARIO_CAP = 6;
export const O10M_PARDON_GRACE_SCORE_CAP = 820;
export const O10M_PARDON_GRACE_SCORE_MONEY_CAP = 900;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mPardonPhase>(['brief', 'review', 'pardon']);

export function unlockTokenForPardonId(pardonId: string): string | null {
  if (!pardonId.startsWith('o10m_pardon_')) return null;
  return `o10m_unlock_${pardonId.slice('o10m_pardon_'.length)}`;
}

export function pardonPhaseForCursor(cursor: number, scenarioCount: number): O10mPardonPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'pardon';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'brief';
}

export function pardonGraceScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(110, Math.max(18, Math.floor(run.playerNetWorth / 172) + standingSlice));
}

export function sanitizePardonSession(raw: unknown): O10mPardonSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pardonId =
    typeof o.pardonId === 'string' && o.pardonId.startsWith('o10m_pardon_') ? o.pardonId : null;
  if (!pardonId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : pardonId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PARDON_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const graceScore = Math.min(
    O10M_PARDON_GRACE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.graceScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mPardonPhase)
      ? (phaseRaw as O10mPardonPhase)
      : pardonPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    pardonId,
    label,
    scenarioIds,
    cursor,
    active,
    graceScore,
    phaseTag,
  };
}

export function createPardonSession(params: {
  pardonId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mPardonSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.pardonId.startsWith('o10m_pardon_')) {
    return { session: null, warnings: ['Pardon ids must start with o10m_pardon_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_PARDON_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Pardon arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      pardonId: params.pardonId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      graceScore: 0,
      phaseTag: pardonPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachPardonSessionToState(
  state: O10mModesPersistedState,
  session: O10mPardonSession,
): O10mModesPersistedState {
  const sanitized = sanitizePardonSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    pardonSession: sanitized,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearPardonSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, pardonSession: null };
}

export function getPardonScenarioAtCursor(
  session: O10mPardonSession | null | undefined,
): string | null {
  const pardon = sanitizePardonSession(session);
  if (!pardon || !pardon.active) return null;
  return pardon.scenarioIds[pardon.cursor] ?? null;
}

export function buildPardonScenarioStartOverrides(
  session: O10mPardonSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const pardon = sanitizePardonSession(session);
  if (!pardon) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PARDON_GRACE_SCORE_MONEY_CAP,
    Math.floor(pardon.graceScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActivePardonId: pardon.pardonId,
      o10mActivePardonStep: pardon.cursor,
      o10mActivePardonPhase: pardon.phaseTag,
      o10mPardonGraceScore: pardon.graceScore,
    },
  };
}

export function advancePardonSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizePardonSession(state.pardonSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const graceScore = Math.min(
    O10M_PARDON_GRACE_SCORE_CAP,
    session.graceScore + pardonGraceScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      pardonSession: {
        ...session,
        cursor,
        graceScore,
        phaseTag: pardonPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForPardonId(session.pardonId);
  let next: O10mModesPersistedState = {
    ...state,
    pardonSession: { ...session, active: false, graceScore, phaseTag: 'pardon' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function pardonSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  graceScore: number;
  phase: O10mPardonPhase | null;
} {
  const session = sanitizePardonSession(state.pardonSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    graceScore: session?.graceScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-amnesty.ts ---
export const O10M_AMNESTY_SCENARIO_CAP = 6;
export const O10M_AMNESTY_ABSOLUTION_SCORE_CAP = 840;
export const O10M_AMNESTY_ABSOLUTION_SCORE_MONEY_CAP = 920;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAmnestyPhase>(['warrant', 'review', 'amnesty']);

export function unlockTokenForAmnestyId(amnestyId: string): string | null {
  if (!amnestyId.startsWith('o10m_amnesty_')) return null;
  return `o10m_unlock_${amnestyId.slice('o10m_amnesty_'.length)}`;
}

export function amnestyPhaseForCursor(cursor: number, scenarioCount: number): O10mAmnestyPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'amnesty';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'warrant';
}

export function amnestyAbsolutionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(112, Math.max(19, Math.floor(run.playerNetWorth / 170) + standingSlice));
}

export function sanitizeAmnestySession(raw: unknown): O10mAmnestySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const amnestyId =
    typeof o.amnestyId === 'string' && o.amnestyId.startsWith('o10m_amnesty_') ? o.amnestyId : null;
  if (!amnestyId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : amnestyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_AMNESTY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const absolutionScore = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.absolutionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAmnestyPhase)
      ? (phaseRaw as O10mAmnestyPhase)
      : amnestyPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    amnestyId,
    label,
    scenarioIds,
    cursor,
    active,
    absolutionScore,
    phaseTag,
  };
}

export function createAmnestySession(params: {
  amnestyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAmnestySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.amnestyId.startsWith('o10m_amnesty_')) {
    return { session: null, warnings: ['Amnesty ids must start with o10m_amnesty_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_AMNESTY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Amnesty arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      amnestyId: params.amnestyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      absolutionScore: 0,
      phaseTag: amnestyPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAmnestySessionToState(
  state: O10mModesPersistedState,
  session: O10mAmnestySession,
): O10mModesPersistedState {
  const sanitized = sanitizeAmnestySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    amnestySession: sanitized,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearAmnestySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, amnestySession: null };
}

export function getAmnestyScenarioAtCursor(
  session: O10mAmnestySession | null | undefined,
): string | null {
  const amnesty = sanitizeAmnestySession(session);
  if (!amnesty || !amnesty.active) return null;
  return amnesty.scenarioIds[amnesty.cursor] ?? null;
}

export function buildAmnestyScenarioStartOverrides(
  session: O10mAmnestySession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const amnesty = sanitizeAmnestySession(session);
  if (!amnesty) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_MONEY_CAP,
    Math.floor(amnesty.absolutionScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAmnestyId: amnesty.amnestyId,
      o10mActiveAmnestyStep: amnesty.cursor,
      o10mActiveAmnestyPhase: amnesty.phaseTag,
      o10mAmnestyAbsolutionScore: amnesty.absolutionScore,
    },
  };
}

export function advanceAmnestySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAmnestySession(state.amnestySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const absolutionScore = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_CAP,
    session.absolutionScore + amnestyAbsolutionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      amnestySession: {
        ...session,
        cursor,
        absolutionScore,
        phaseTag: amnestyPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAmnestyId(session.amnestyId);
  let next: O10mModesPersistedState = {
    ...state,
    amnestySession: { ...session, active: false, absolutionScore, phaseTag: 'amnesty' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function amnestySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  absolutionScore: number;
  phase: O10mAmnestyPhase | null;
} {
  const session = sanitizeAmnestySession(state.amnestySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    absolutionScore: session?.absolutionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-reprieve.ts ---
export const O10M_REPRIEVE_SCENARIO_CAP = 6;
export const O10M_REPRIEVE_RELIEF_SCORE_CAP = 860;
export const O10M_REPRIEVE_RELIEF_SCORE_MONEY_CAP = 940;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReprievePhase>(['filing', 'review', 'reprieve']);

export function unlockTokenForReprieveId(reprieveId: string): string | null {
  if (!reprieveId.startsWith('o10m_reprieve_')) return null;
  return `o10m_unlock_${reprieveId.slice('o10m_reprieve_'.length)}`;
}

export function reprievePhaseForCursor(cursor: number, scenarioCount: number): O10mReprievePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reprieve';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function reprieveReliefScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(114, Math.max(20, Math.floor(run.playerNetWorth / 168) + standingSlice));
}

export function sanitizeReprieveSession(raw: unknown): O10mReprieveSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reprieveId =
    typeof o.reprieveId === 'string' && o.reprieveId.startsWith('o10m_reprieve_') ? o.reprieveId : null;
  if (!reprieveId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reprieveId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REPRIEVE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reliefScore = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reliefScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReprievePhase)
      ? (phaseRaw as O10mReprievePhase)
      : reprievePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reprieveId,
    label,
    scenarioIds,
    cursor,
    active,
    reliefScore,
    phaseTag,
  };
}

export function createReprieveSession(params: {
  reprieveId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReprieveSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reprieveId.startsWith('o10m_reprieve_')) {
    return { session: null, warnings: ['Reprieve ids must start with o10m_reprieve_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_REPRIEVE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reprieve arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reprieveId: params.reprieveId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reliefScore: 0,
      phaseTag: reprievePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReprieveSessionToState(
  state: O10mModesPersistedState,
  session: O10mReprieveSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReprieveSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reprieveSession: sanitized,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearReprieveSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reprieveSession: null };
}

export function getReprieveScenarioAtCursor(
  session: O10mReprieveSession | null | undefined,
): string | null {
  const reprieve = sanitizeReprieveSession(session);
  if (!reprieve || !reprieve.active) return null;
  return reprieve.scenarioIds[reprieve.cursor] ?? null;
}

export function buildReprieveScenarioStartOverrides(
  session: O10mReprieveSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reprieve = sanitizeReprieveSession(session);
  if (!reprieve) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_MONEY_CAP,
    Math.floor(reprieve.reliefScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReprieveId: reprieve.reprieveId,
      o10mActiveReprieveStep: reprieve.cursor,
      o10mActiveReprievePhase: reprieve.phaseTag,
      o10mReprieveReliefScore: reprieve.reliefScore,
    },
  };
}

export function advanceReprieveSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReprieveSession(state.reprieveSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reliefScore = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_CAP,
    session.reliefScore + reprieveReliefScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reprieveSession: {
        ...session,
        cursor,
        reliefScore,
        phaseTag: reprievePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReprieveId(session.reprieveId);
  let next: O10mModesPersistedState = {
    ...state,
    reprieveSession: { ...session, active: false, reliefScore, phaseTag: 'reprieve' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reprieveSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reliefScore: number;
  phase: O10mReprievePhase | null;
} {
  const session = sanitizeReprieveSession(state.reprieveSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reliefScore: session?.reliefScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-parole.ts ---
export const O10M_PAROLE_SCENARIO_CAP = 6;
export const O10M_PAROLE_TRUST_SCORE_CAP = 880;
export const O10M_PAROLE_TRUST_SCORE_MONEY_CAP = 960;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mParolePhase>(['intake', 'review', 'parole']);

export function unlockTokenForParoleId(paroleId: string): string | null {
  if (!paroleId.startsWith('o10m_parole_')) return null;
  return `o10m_unlock_${paroleId.slice('o10m_parole_'.length)}`;
}

export function parolePhaseForCursor(cursor: number, scenarioCount: number): O10mParolePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'parole';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'intake';
}

export function paroleTrustScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(116, Math.max(21, Math.floor(run.playerNetWorth / 166) + standingSlice));
}

export function sanitizeParoleSession(raw: unknown): O10mParoleSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const paroleId =
    typeof o.paroleId === 'string' && o.paroleId.startsWith('o10m_parole_') ? o.paroleId : null;
  if (!paroleId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : paroleId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PAROLE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const trustScore = Math.min(
    O10M_PAROLE_TRUST_SCORE_CAP,
    Math.max(0, Math.floor(num(o.trustScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mParolePhase)
      ? (phaseRaw as O10mParolePhase)
      : parolePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    paroleId,
    label,
    scenarioIds,
    cursor,
    active,
    trustScore,
    phaseTag,
  };
}

export function createParoleSession(params: {
  paroleId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mParoleSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.paroleId.startsWith('o10m_parole_')) {
    return { session: null, warnings: ['Parole ids must start with o10m_parole_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_PAROLE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Parole arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      paroleId: params.paroleId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      trustScore: 0,
      phaseTag: parolePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachParoleSessionToState(
  state: O10mModesPersistedState,
  session: O10mParoleSession,
): O10mModesPersistedState {
  const sanitized = sanitizeParoleSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    paroleSession: sanitized,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearParoleSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, paroleSession: null };
}

export function getParoleScenarioAtCursor(
  session: O10mParoleSession | null | undefined,
): string | null {
  const parole = sanitizeParoleSession(session);
  if (!parole || !parole.active) return null;
  return parole.scenarioIds[parole.cursor] ?? null;
}

export function buildParoleScenarioStartOverrides(
  session: O10mParoleSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const parole = sanitizeParoleSession(session);
  if (!parole) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PAROLE_TRUST_SCORE_MONEY_CAP,
    Math.floor(parole.trustScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveParoleId: parole.paroleId,
      o10mActiveParoleStep: parole.cursor,
      o10mActiveParolePhase: parole.phaseTag,
      o10mParoleTrustScore: parole.trustScore,
    },
  };
}

export function advanceParoleSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeParoleSession(state.paroleSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const trustScore = Math.min(
    O10M_PAROLE_TRUST_SCORE_CAP,
    session.trustScore + paroleTrustScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      paroleSession: {
        ...session,
        cursor,
        trustScore,
        phaseTag: parolePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForParoleId(session.paroleId);
  let next: O10mModesPersistedState = {
    ...state,
    paroleSession: { ...session, active: false, trustScore, phaseTag: 'parole' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function paroleSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  trustScore: number;
  phase: O10mParolePhase | null;
} {
  const session = sanitizeParoleSession(state.paroleSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    trustScore: session?.trustScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-probation.ts ---
export const O10M_PROBATION_SCENARIO_CAP = 6;
export const O10M_PROBATION_COMPLIANCE_SCORE_CAP = 900;
export const O10M_PROBATION_COMPLIANCE_SCORE_MONEY_CAP = 980;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mProbationPhase>(['enrollment', 'review', 'probation']);

export function unlockTokenForProbationId(probationId: string): string | null {
  if (!probationId.startsWith('o10m_probation_')) return null;
  return `o10m_unlock_${probationId.slice('o10m_probation_'.length)}`;
}

export function probationPhaseForCursor(cursor: number, scenarioCount: number): O10mProbationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'probation';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'enrollment';
}

export function probationComplianceScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(118, Math.max(22, Math.floor(run.playerNetWorth / 162) + standingSlice));
}

export function sanitizeProbationSession(raw: unknown): O10mProbationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const probationId =
    typeof o.probationId === 'string' && o.probationId.startsWith('o10m_probation_') ? o.probationId : null;
  if (!probationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : probationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PROBATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const complianceScore = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.complianceScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mProbationPhase)
      ? (phaseRaw as O10mProbationPhase)
      : probationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    probationId,
    label,
    scenarioIds,
    cursor,
    active,
    complianceScore,
    phaseTag,
  };
}

export function createProbationSession(params: {
  probationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mProbationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.probationId.startsWith('o10m_probation_')) {
    return { session: null, warnings: ['Probation ids must start with o10m_probation_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_PROBATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Probation arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      probationId: params.probationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      complianceScore: 0,
      phaseTag: probationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachProbationSessionToState(
  state: O10mModesPersistedState,
  session: O10mProbationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeProbationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    probationSession: sanitized,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearProbationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, probationSession: null };
}

export function getProbationScenarioAtCursor(
  session: O10mProbationSession | null | undefined,
): string | null {
  const probation = sanitizeProbationSession(session);
  if (!probation || !probation.active) return null;
  return probation.scenarioIds[probation.cursor] ?? null;
}

export function buildProbationScenarioStartOverrides(
  session: O10mProbationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const probation = sanitizeProbationSession(session);
  if (!probation) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_MONEY_CAP,
    Math.floor(probation.complianceScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveProbationId: probation.probationId,
      o10mActiveProbationStep: probation.cursor,
      o10mActiveProbationPhase: probation.phaseTag,
      o10mProbationComplianceScore: probation.complianceScore,
    },
  };
}

export function advanceProbationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeProbationSession(state.probationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const complianceScore = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_CAP,
    session.complianceScore + probationComplianceScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      probationSession: {
        ...session,
        cursor,
        complianceScore,
        phaseTag: probationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForProbationId(session.probationId);
  let next: O10mModesPersistedState = {
    ...state,
    probationSession: { ...session, active: false, complianceScore, phaseTag: 'probation' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function probationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  complianceScore: number;
  phase: O10mProbationPhase | null;
} {
  const session = sanitizeProbationSession(state.probationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    complianceScore: session?.complianceScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-commutation.ts ---
export const O10M_COMMUTATION_SCENARIO_CAP = 6;
export const O10M_COMMUTATION_LENIENCY_SCORE_CAP = 920;
export const O10M_COMMUTATION_LENIENCY_SCORE_MONEY_CAP = 1000;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCommutationPhase>(['petition', 'review', 'commutation']);

export function unlockTokenForCommutationId(commutationId: string): string | null {
  if (!commutationId.startsWith('o10m_commutation_')) return null;
  return `o10m_unlock_${commutationId.slice('o10m_commutation_'.length)}`;
}

export function commutationPhaseForCursor(cursor: number, scenarioCount: number): O10mCommutationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'commutation';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function commutationLeniencyScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(120, Math.max(23, Math.floor(run.playerNetWorth / 158) + standingSlice));
}

export function sanitizeCommutationSession(raw: unknown): O10mCommutationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const commutationId =
    typeof o.commutationId === 'string' && o.commutationId.startsWith('o10m_commutation_') ? o.commutationId : null;
  if (!commutationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : commutationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_COMMUTATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const leniencyScore = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_CAP,
    Math.max(0, Math.floor(num(o.leniencyScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCommutationPhase)
      ? (phaseRaw as O10mCommutationPhase)
      : commutationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    commutationId,
    label,
    scenarioIds,
    cursor,
    active,
    leniencyScore,
    phaseTag,
  };
}

export function createCommutationSession(params: {
  commutationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCommutationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.commutationId.startsWith('o10m_commutation_')) {
    return { session: null, warnings: ['Commutation ids must start with o10m_commutation_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_COMMUTATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Commutation arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      commutationId: params.commutationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      leniencyScore: 0,
      phaseTag: commutationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCommutationSessionToState(
  state: O10mModesPersistedState,
  session: O10mCommutationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCommutationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    commutationSession: sanitized,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearCommutationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, commutationSession: null };
}

export function getCommutationScenarioAtCursor(
  session: O10mCommutationSession | null | undefined,
): string | null {
  const commutation = sanitizeCommutationSession(session);
  if (!commutation || !commutation.active) return null;
  return commutation.scenarioIds[commutation.cursor] ?? null;
}

export function buildCommutationScenarioStartOverrides(
  session: O10mCommutationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const commutation = sanitizeCommutationSession(session);
  if (!commutation) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_MONEY_CAP,
    Math.floor(commutation.leniencyScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCommutationId: commutation.commutationId,
      o10mActiveCommutationStep: commutation.cursor,
      o10mActiveCommutationPhase: commutation.phaseTag,
      o10mCommutationLeniencyScore: commutation.leniencyScore,
    },
  };
}

export function advanceCommutationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCommutationSession(state.commutationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const leniencyScore = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_CAP,
    session.leniencyScore + commutationLeniencyScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      commutationSession: {
        ...session,
        cursor,
        leniencyScore,
        phaseTag: commutationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCommutationId(session.commutationId);
  let next: O10mModesPersistedState = {
    ...state,
    commutationSession: { ...session, active: false, leniencyScore, phaseTag: 'commutation' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function commutationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  leniencyScore: number;
  phase: O10mCommutationPhase | null;
} {
  const session = sanitizeCommutationSession(state.commutationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    leniencyScore: session?.leniencyScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-acquittal.ts ---
export const O10M_ACQUITTAL_SCENARIO_CAP = 6;
export const O10M_ACQUITTAL_VERDICT_SCORE_CAP = 940;
export const O10M_ACQUITTAL_VERDICT_SCORE_MONEY_CAP = 1020;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAcquittalPhase>(['brief', 'review', 'acquittal']);

export function unlockTokenForAcquittalId(acquittalId: string): string | null {
  if (!acquittalId.startsWith('o10m_acquittal_')) return null;
  return `o10m_unlock_${acquittalId.slice('o10m_acquittal_'.length)}`;
}

export function acquittalPhaseForCursor(cursor: number, scenarioCount: number): O10mAcquittalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'acquittal';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'brief';
}

export function acquittalVerdictScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(122, Math.max(24, Math.floor(run.playerNetWorth / 154) + standingSlice));
}

export function sanitizeAcquittalSession(raw: unknown): O10mAcquittalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const acquittalId =
    typeof o.acquittalId === 'string' && o.acquittalId.startsWith('o10m_acquittal_') ? o.acquittalId : null;
  if (!acquittalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : acquittalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ACQUITTAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const verdictScore = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.verdictScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAcquittalPhase)
      ? (phaseRaw as O10mAcquittalPhase)
      : acquittalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    acquittalId,
    label,
    scenarioIds,
    cursor,
    active,
    verdictScore,
    phaseTag,
  };
}

export function createAcquittalSession(params: {
  acquittalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAcquittalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.acquittalId.startsWith('o10m_acquittal_')) {
    return { session: null, warnings: ['Acquittal ids must start with o10m_acquittal_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_ACQUITTAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Acquittal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      acquittalId: params.acquittalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      verdictScore: 0,
      phaseTag: acquittalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAcquittalSessionToState(
  state: O10mModesPersistedState,
  session: O10mAcquittalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAcquittalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    acquittalSession: sanitized,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearAcquittalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, acquittalSession: null };
}

export function getAcquittalScenarioAtCursor(
  session: O10mAcquittalSession | null | undefined,
): string | null {
  const acquittal = sanitizeAcquittalSession(session);
  if (!acquittal || !acquittal.active) return null;
  return acquittal.scenarioIds[acquittal.cursor] ?? null;
}

export function buildAcquittalScenarioStartOverrides(
  session: O10mAcquittalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const acquittal = sanitizeAcquittalSession(session);
  if (!acquittal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_MONEY_CAP,
    Math.floor(acquittal.verdictScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAcquittalId: acquittal.acquittalId,
      o10mActiveAcquittalStep: acquittal.cursor,
      o10mActiveAcquittalPhase: acquittal.phaseTag,
      o10mAcquittalVerdictScore: acquittal.verdictScore,
    },
  };
}

export function advanceAcquittalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAcquittalSession(state.acquittalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const verdictScore = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_CAP,
    session.verdictScore + acquittalVerdictScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      acquittalSession: {
        ...session,
        cursor,
        verdictScore,
        phaseTag: acquittalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAcquittalId(session.acquittalId);
  let next: O10mModesPersistedState = {
    ...state,
    acquittalSession: { ...session, active: false, verdictScore, phaseTag: 'acquittal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function acquittalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  verdictScore: number;
  phase: O10mAcquittalPhase | null;
} {
  const session = sanitizeAcquittalSession(state.acquittalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    verdictScore: session?.verdictScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-exoneration.ts ---
export const O10M_EXONERATION_SCENARIO_CAP = 6;
export const O10M_EXONERATION_RESTITUTION_SCORE_CAP = 960;
export const O10M_EXONERATION_RESTITUTION_SCORE_MONEY_CAP = 1040;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExonerationPhase>(['claim', 'review', 'exoneration']);

export function unlockTokenForExonerationId(exonerationId: string): string | null {
  if (!exonerationId.startsWith('o10m_exoneration_')) return null;
  return `o10m_unlock_${exonerationId.slice('o10m_exoneration_'.length)}`;
}

export function exonerationPhaseForCursor(cursor: number, scenarioCount: number): O10mExonerationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'exoneration';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'claim';
}

export function exonerationRestitutionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(124, Math.max(25, Math.floor(run.playerNetWorth / 150) + standingSlice));
}

export function sanitizeExonerationSession(raw: unknown): O10mExonerationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const exonerationId =
    typeof o.exonerationId === 'string' && o.exonerationId.startsWith('o10m_exoneration_') ? o.exonerationId : null;
  if (!exonerationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : exonerationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXONERATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const restitutionScore = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.restitutionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExonerationPhase)
      ? (phaseRaw as O10mExonerationPhase)
      : exonerationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    exonerationId,
    label,
    scenarioIds,
    cursor,
    active,
    restitutionScore,
    phaseTag,
  };
}

export function createExonerationSession(params: {
  exonerationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExonerationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.exonerationId.startsWith('o10m_exoneration_')) {
    return { session: null, warnings: ['Exoneration ids must start with o10m_exoneration_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_EXONERATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Exoneration arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      exonerationId: params.exonerationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      restitutionScore: 0,
      phaseTag: exonerationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExonerationSessionToState(
  state: O10mModesPersistedState,
  session: O10mExonerationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExonerationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    exonerationSession: sanitized,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearExonerationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, exonerationSession: null };
}

export function getExonerationScenarioAtCursor(
  session: O10mExonerationSession | null | undefined,
): string | null {
  const exoneration = sanitizeExonerationSession(session);
  if (!exoneration || !exoneration.active) return null;
  return exoneration.scenarioIds[exoneration.cursor] ?? null;
}

export function buildExonerationScenarioStartOverrides(
  session: O10mExonerationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const exoneration = sanitizeExonerationSession(session);
  if (!exoneration) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_MONEY_CAP,
    Math.floor(exoneration.restitutionScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExonerationId: exoneration.exonerationId,
      o10mActiveExonerationStep: exoneration.cursor,
      o10mActiveExonerationPhase: exoneration.phaseTag,
      o10mExonerationRestitutionScore: exoneration.restitutionScore,
    },
  };
}

export function advanceExonerationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExonerationSession(state.exonerationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const restitutionScore = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_CAP,
    session.restitutionScore + exonerationRestitutionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      exonerationSession: {
        ...session,
        cursor,
        restitutionScore,
        phaseTag: exonerationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExonerationId(session.exonerationId);
  let next: O10mModesPersistedState = {
    ...state,
    exonerationSession: { ...session, active: false, restitutionScore, phaseTag: 'exoneration' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function exonerationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  restitutionScore: number;
  phase: O10mExonerationPhase | null;
} {
  const session = sanitizeExonerationSession(state.exonerationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    restitutionScore: session?.restitutionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-expungement.ts ---
export const O10M_EXPUNGEMENT_SCENARIO_CAP = 6;
export const O10M_EXPUNGEMENT_SEAL_SCORE_CAP = 980;
export const O10M_EXPUNGEMENT_SEAL_SCORE_MONEY_CAP = 1060;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExpungementPhase>(['filing', 'review', 'expungement']);

export function unlockTokenForExpungementId(expungementId: string): string | null {
  if (!expungementId.startsWith('o10m_expungement_')) return null;
  return `o10m_unlock_${expungementId.slice('o10m_expungement_'.length)}`;
}

export function expungementPhaseForCursor(cursor: number, scenarioCount: number): O10mExpungementPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'expungement';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function expungementSealScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(126, Math.max(26, Math.floor(run.playerNetWorth / 146) + standingSlice));
}

export function sanitizeExpungementSession(raw: unknown): O10mExpungementSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const expungementId =
    typeof o.expungementId === 'string' && o.expungementId.startsWith('o10m_expungement_') ? o.expungementId : null;
  if (!expungementId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : expungementId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXPUNGEMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const sealScore = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_CAP,
    Math.max(0, Math.floor(num(o.sealScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExpungementPhase)
      ? (phaseRaw as O10mExpungementPhase)
      : expungementPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    expungementId,
    label,
    scenarioIds,
    cursor,
    active,
    sealScore,
    phaseTag,
  };
}

export function createExpungementSession(params: {
  expungementId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExpungementSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.expungementId.startsWith('o10m_expungement_')) {
    return { session: null, warnings: ['Expungement ids must start with o10m_expungement_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_EXPUNGEMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Expungement arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      expungementId: params.expungementId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      sealScore: 0,
      phaseTag: expungementPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExpungementSessionToState(
  state: O10mModesPersistedState,
  session: O10mExpungementSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExpungementSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    expungementSession: sanitized,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearExpungementSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, expungementSession: null };
}

export function getExpungementScenarioAtCursor(
  session: O10mExpungementSession | null | undefined,
): string | null {
  const expungement = sanitizeExpungementSession(session);
  if (!expungement || !expungement.active) return null;
  return expungement.scenarioIds[expungement.cursor] ?? null;
}

export function buildExpungementScenarioStartOverrides(
  session: O10mExpungementSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const expungement = sanitizeExpungementSession(session);
  if (!expungement) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_MONEY_CAP,
    Math.floor(expungement.sealScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExpungementId: expungement.expungementId,
      o10mActiveExpungementStep: expungement.cursor,
      o10mActiveExpungementPhase: expungement.phaseTag,
      o10mExpungementSealScore: expungement.sealScore,
    },
  };
}

export function advanceExpungementSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExpungementSession(state.expungementSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const sealScore = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_CAP,
    session.sealScore + expungementSealScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      expungementSession: {
        ...session,
        cursor,
        sealScore,
        phaseTag: expungementPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExpungementId(session.expungementId);
  let next: O10mModesPersistedState = {
    ...state,
    expungementSession: { ...session, active: false, sealScore, phaseTag: 'expungement' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function expungementSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  sealScore: number;
  phase: O10mExpungementPhase | null;
} {
  const session = sanitizeExpungementSession(state.expungementSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    sealScore: session?.sealScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-vacatur.ts ---
export const O10M_VACATUR_SCENARIO_CAP = 6;
export const O10M_VACATUR_MERIT_SCORE_CAP = 990;
export const O10M_VACATUR_MERIT_SCORE_MONEY_CAP = 1070;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mVacaturPhase>(['petition', 'review', 'vacatur']);

export function unlockTokenForVacaturId(vacaturId: string): string | null {
  if (!vacaturId.startsWith('o10m_vacatur_')) return null;
  return `o10m_unlock_${vacaturId.slice('o10m_vacatur_'.length)}`;
}

export function vacaturPhaseForCursor(cursor: number, scenarioCount: number): O10mVacaturPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'vacatur';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function vacaturMeritScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(128, Math.max(27, Math.floor(run.playerNetWorth / 144) + standingSlice));
}

export function sanitizeVacaturSession(raw: unknown): O10mVacaturSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const vacaturId =
    typeof o.vacaturId === 'string' && o.vacaturId.startsWith('o10m_vacatur_') ? o.vacaturId : null;
  if (!vacaturId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : vacaturId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_VACATUR_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const meritScore = Math.min(
    O10M_VACATUR_MERIT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.meritScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mVacaturPhase)
      ? (phaseRaw as O10mVacaturPhase)
      : vacaturPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    vacaturId,
    label,
    scenarioIds,
    cursor,
    active,
    meritScore,
    phaseTag,
  };
}

export function createVacaturSession(params: {
  vacaturId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mVacaturSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.vacaturId.startsWith('o10m_vacatur_')) {
    return { session: null, warnings: ['Vacatur ids must start with o10m_vacatur_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_VACATUR_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Vacatur arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      vacaturId: params.vacaturId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      meritScore: 0,
      phaseTag: vacaturPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachVacaturSessionToState(
  state: O10mModesPersistedState,
  session: O10mVacaturSession,
): O10mModesPersistedState {
  const sanitized = sanitizeVacaturSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    vacaturSession: sanitized,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearVacaturSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, vacaturSession: null };
}

export function getVacaturScenarioAtCursor(
  session: O10mVacaturSession | null | undefined,
): string | null {
  const vacatur = sanitizeVacaturSession(session);
  if (!vacatur || !vacatur.active) return null;
  return vacatur.scenarioIds[vacatur.cursor] ?? null;
}

export function buildVacaturScenarioStartOverrides(
  session: O10mVacaturSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const vacatur = sanitizeVacaturSession(session);
  if (!vacatur) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_VACATUR_MERIT_SCORE_MONEY_CAP,
    Math.floor(vacatur.meritScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveVacaturId: vacatur.vacaturId,
      o10mActiveVacaturStep: vacatur.cursor,
      o10mActiveVacaturPhase: vacatur.phaseTag,
      o10mVacaturMeritScore: vacatur.meritScore,
    },
  };
}

export function advanceVacaturSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeVacaturSession(state.vacaturSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const meritScore = Math.min(
    O10M_VACATUR_MERIT_SCORE_CAP,
    session.meritScore + vacaturMeritScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      vacaturSession: {
        ...session,
        cursor,
        meritScore,
        phaseTag: vacaturPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForVacaturId(session.vacaturId);
  let next: O10mModesPersistedState = {
    ...state,
    vacaturSession: { ...session, active: false, meritScore, phaseTag: 'vacatur' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function vacaturSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  meritScore: number;
  phase: O10mVacaturPhase | null;
} {
  const session = sanitizeVacaturSession(state.vacaturSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    meritScore: session?.meritScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-remand.ts ---
export const O10M_REMAND_SCENARIO_CAP = 6;
export const O10M_REMAND_WEIGHT_SCORE_CAP = 1000;
export const O10M_REMAND_WEIGHT_SCORE_MONEY_CAP = 1080;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mRemandPhase>(['order', 'review', 'remand']);

export function unlockTokenForRemandId(remandId: string): string | null {
  if (!remandId.startsWith('o10m_remand_')) return null;
  return `o10m_unlock_${remandId.slice('o10m_remand_'.length)}`;
}

export function remandPhaseForCursor(cursor: number, scenarioCount: number): O10mRemandPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'remand';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'order';
}

export function remandWeightScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(130, Math.max(28, Math.floor(run.playerNetWorth / 142) + standingSlice));
}

export function sanitizeRemandSession(raw: unknown): O10mRemandSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const remandId =
    typeof o.remandId === 'string' && o.remandId.startsWith('o10m_remand_') ? o.remandId : null;
  if (!remandId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : remandId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REMAND_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const weightScore = Math.min(
    O10M_REMAND_WEIGHT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.weightScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mRemandPhase)
      ? (phaseRaw as O10mRemandPhase)
      : remandPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    remandId,
    label,
    scenarioIds,
    cursor,
    active,
    weightScore,
    phaseTag,
  };
}

export function createRemandSession(params: {
  remandId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mRemandSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.remandId.startsWith('o10m_remand_')) {
    return { session: null, warnings: ['Remand ids must start with o10m_remand_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_REMAND_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Remand arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      remandId: params.remandId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      weightScore: 0,
      phaseTag: remandPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachRemandSessionToState(
  state: O10mModesPersistedState,
  session: O10mRemandSession,
): O10mModesPersistedState {
  const sanitized = sanitizeRemandSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    remandSession: sanitized,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearRemandSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, remandSession: null };
}

export function getRemandScenarioAtCursor(
  session: O10mRemandSession | null | undefined,
): string | null {
  const remand = sanitizeRemandSession(session);
  if (!remand || !remand.active) return null;
  return remand.scenarioIds[remand.cursor] ?? null;
}

export function buildRemandScenarioStartOverrides(
  session: O10mRemandSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const remand = sanitizeRemandSession(session);
  if (!remand) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REMAND_WEIGHT_SCORE_MONEY_CAP,
    Math.floor(remand.weightScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveRemandId: remand.remandId,
      o10mActiveRemandStep: remand.cursor,
      o10mActiveRemandPhase: remand.phaseTag,
      o10mRemandWeightScore: remand.weightScore,
    },
  };
}

export function advanceRemandSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeRemandSession(state.remandSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const weightScore = Math.min(
    O10M_REMAND_WEIGHT_SCORE_CAP,
    session.weightScore + remandWeightScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      remandSession: {
        ...session,
        cursor,
        weightScore,
        phaseTag: remandPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForRemandId(session.remandId);
  let next: O10mModesPersistedState = {
    ...state,
    remandSession: { ...session, active: false, weightScore, phaseTag: 'remand' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function remandSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  weightScore: number;
  phase: O10mRemandPhase | null;
} {
  const session = sanitizeRemandSession(state.remandSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    weightScore: session?.weightScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-reversal.ts ---
export const O10M_REVERSAL_SCENARIO_CAP = 6;
export const O10M_REVERSAL_SCORE_CAP = 1010;
export const O10M_REVERSAL_SCORE_MONEY_CAP = 1090;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReversalPhase>(['motion', 'review', 'reversal']);

export function unlockTokenForReversalId(reversalId: string): string | null {
  if (!reversalId.startsWith('o10m_reversal_')) return null;
  return `o10m_unlock_${reversalId.slice('o10m_reversal_'.length)}`;
}

export function reversalPhaseForCursor(cursor: number, scenarioCount: number): O10mReversalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reversal';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'motion';
}

export function reversalScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(132, Math.max(29, Math.floor(run.playerNetWorth / 140) + standingSlice));
}

export function sanitizeReversalSession(raw: unknown): O10mReversalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reversalId =
    typeof o.reversalId === 'string' && o.reversalId.startsWith('o10m_reversal_') ? o.reversalId : null;
  if (!reversalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reversalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REVERSAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reversalScore = Math.min(
    O10M_REVERSAL_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reversalScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReversalPhase)
      ? (phaseRaw as O10mReversalPhase)
      : reversalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reversalId,
    label,
    scenarioIds,
    cursor,
    active,
    reversalScore,
    phaseTag,
  };
}

export function createReversalSession(params: {
  reversalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReversalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reversalId.startsWith('o10m_reversal_')) {
    return { session: null, warnings: ['Reversal ids must start with o10m_reversal_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_REVERSAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reversal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reversalId: params.reversalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reversalScore: 0,
      phaseTag: reversalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReversalSessionToState(
  state: O10mModesPersistedState,
  session: O10mReversalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReversalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reversalSession: sanitized,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearReversalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reversalSession: null };
}

export function getReversalScenarioAtCursor(
  session: O10mReversalSession | null | undefined,
): string | null {
  const reversal = sanitizeReversalSession(session);
  if (!reversal || !reversal.active) return null;
  return reversal.scenarioIds[reversal.cursor] ?? null;
}

export function buildReversalScenarioStartOverrides(
  session: O10mReversalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reversal = sanitizeReversalSession(session);
  if (!reversal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REVERSAL_SCORE_MONEY_CAP,
    Math.floor(reversal.reversalScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReversalId: reversal.reversalId,
      o10mActiveReversalStep: reversal.cursor,
      o10mActiveReversalPhase: reversal.phaseTag,
      o10mReversalScore: reversal.reversalScore,
    },
  };
}

export function advanceReversalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReversalSession(state.reversalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reversalScore = Math.min(
    O10M_REVERSAL_SCORE_CAP,
    session.reversalScore + reversalScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reversalSession: {
        ...session,
        cursor,
        reversalScore,
        phaseTag: reversalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReversalId(session.reversalId);
  let next: O10mModesPersistedState = {
    ...state,
    reversalSession: { ...session, active: false, reversalScore, phaseTag: 'reversal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reversalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reversalScore: number;
  phase: O10mReversalPhase | null;
} {
  const session = sanitizeReversalSession(state.reversalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reversalScore: session?.reversalScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-annulment.ts ---
export const O10M_ANNULMENT_SCENARIO_CAP = 6;
export const O10M_ANNULMENT_SCORE_CAP = 1020;
export const O10M_ANNULMENT_SCORE_MONEY_CAP = 1100;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAnnulmentPhase>(['filing', 'review', 'annulment']);

export function unlockTokenForAnnulmentId(annulmentId: string): string | null {
  if (!annulmentId.startsWith('o10m_annulment_')) return null;
  return `o10m_unlock_${annulmentId.slice('o10m_annulment_'.length)}`;
}

export function annulmentPhaseForCursor(cursor: number, scenarioCount: number): O10mAnnulmentPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'annulment';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function annulmentScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(134, Math.max(30, Math.floor(run.playerNetWorth / 138) + standingSlice));
}

export function sanitizeAnnulmentSession(raw: unknown): O10mAnnulmentSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const annulmentId =
    typeof o.annulmentId === 'string' && o.annulmentId.startsWith('o10m_annulment_') ? o.annulmentId : null;
  if (!annulmentId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : annulmentId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ANNULMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const annulmentScore = Math.min(
    O10M_ANNULMENT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.annulmentScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAnnulmentPhase)
      ? (phaseRaw as O10mAnnulmentPhase)
      : annulmentPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    annulmentId,
    label,
    scenarioIds,
    cursor,
    active,
    annulmentScore,
    phaseTag,
  };
}

export function createAnnulmentSession(params: {
  annulmentId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAnnulmentSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.annulmentId.startsWith('o10m_annulment_')) {
    return { session: null, warnings: ['Annulment ids must start with o10m_annulment_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_ANNULMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Annulment arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      annulmentId: params.annulmentId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      annulmentScore: 0,
      phaseTag: annulmentPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAnnulmentSessionToState(
  state: O10mModesPersistedState,
  session: O10mAnnulmentSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAnnulmentSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    annulmentSession: sanitized,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearAnnulmentSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, annulmentSession: null };
}

export function getAnnulmentScenarioAtCursor(
  session: O10mAnnulmentSession | null | undefined,
): string | null {
  const annulment = sanitizeAnnulmentSession(session);
  if (!annulment || !annulment.active) return null;
  return annulment.scenarioIds[annulment.cursor] ?? null;
}

export function buildAnnulmentScenarioStartOverrides(
  session: O10mAnnulmentSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const annulment = sanitizeAnnulmentSession(session);
  if (!annulment) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_ANNULMENT_SCORE_MONEY_CAP,
    Math.floor(annulment.annulmentScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAnnulmentId: annulment.annulmentId,
      o10mActiveAnnulmentStep: annulment.cursor,
      o10mActiveAnnulmentPhase: annulment.phaseTag,
      o10mAnnulmentScore: annulment.annulmentScore,
    },
  };
}

export function advanceAnnulmentSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAnnulmentSession(state.annulmentSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const annulmentScore = Math.min(
    O10M_ANNULMENT_SCORE_CAP,
    session.annulmentScore + annulmentScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      annulmentSession: {
        ...session,
        cursor,
        annulmentScore,
        phaseTag: annulmentPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAnnulmentId(session.annulmentId);
  let next: O10mModesPersistedState = {
    ...state,
    annulmentSession: { ...session, active: false, annulmentScore, phaseTag: 'annulment' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function annulmentSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  annulmentScore: number;
  phase: O10mAnnulmentPhase | null;
} {
  const session = sanitizeAnnulmentSession(state.annulmentSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    annulmentScore: session?.annulmentScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-reinstatement.ts ---
export const O10M_REINSTATEMENT_SCENARIO_CAP = 6;
export const O10M_REINSTATEMENT_SCORE_CAP = 1030;
export const O10M_REINSTATEMENT_SCORE_MONEY_CAP = 1110;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReinstatementPhase>(['filing', 'review', 'reinstatement']);

export function unlockTokenForReinstatementId(reinstatementId: string): string | null {
  if (!reinstatementId.startsWith('o10m_reinstatement_')) return null;
  return `o10m_unlock_${reinstatementId.slice('o10m_reinstatement_'.length)}`;
}

export function reinstatementPhaseForCursor(cursor: number, scenarioCount: number): O10mReinstatementPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reinstatement';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function reinstatementScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(136, Math.max(31, Math.floor(run.playerNetWorth / 136) + standingSlice));
}

export function sanitizeReinstatementSession(raw: unknown): O10mReinstatementSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reinstatementId =
    typeof o.reinstatementId === 'string' && o.reinstatementId.startsWith('o10m_reinstatement_')
      ? o.reinstatementId
      : null;
  if (!reinstatementId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reinstatementId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REINSTATEMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reinstatementScore = Math.min(
    O10M_REINSTATEMENT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reinstatementScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReinstatementPhase)
      ? (phaseRaw as O10mReinstatementPhase)
      : reinstatementPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reinstatementId,
    label,
    scenarioIds,
    cursor,
    active,
    reinstatementScore,
    phaseTag,
  };
}

export function createReinstatementSession(params: {
  reinstatementId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReinstatementSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reinstatementId.startsWith('o10m_reinstatement_')) {
    return { session: null, warnings: ['Reinstatement ids must start with o10m_reinstatement_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_REINSTATEMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reinstatement arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reinstatementId: params.reinstatementId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reinstatementScore: 0,
      phaseTag: reinstatementPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReinstatementSessionToState(
  state: O10mModesPersistedState,
  session: O10mReinstatementSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReinstatementSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reinstatementSession: sanitized,
    setAsideSession: null,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearReinstatementSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reinstatementSession: null };
}

export function getReinstatementScenarioAtCursor(
  session: O10mReinstatementSession | null | undefined,
): string | null {
  const reinstatement = sanitizeReinstatementSession(session);
  if (!reinstatement || !reinstatement.active) return null;
  return reinstatement.scenarioIds[reinstatement.cursor] ?? null;
}

export function buildReinstatementScenarioStartOverrides(
  session: O10mReinstatementSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reinstatement = sanitizeReinstatementSession(session);
  if (!reinstatement) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REINSTATEMENT_SCORE_MONEY_CAP,
    Math.floor(reinstatement.reinstatementScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReinstatementId: reinstatement.reinstatementId,
      o10mActiveReinstatementStep: reinstatement.cursor,
      o10mActiveReinstatementPhase: reinstatement.phaseTag,
      o10mReinstatementScore: reinstatement.reinstatementScore,
    },
  };
}

export function advanceReinstatementSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReinstatementSession(state.reinstatementSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reinstatementScore = Math.min(
    O10M_REINSTATEMENT_SCORE_CAP,
    session.reinstatementScore + reinstatementScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reinstatementSession: {
        ...session,
        cursor,
        reinstatementScore,
        phaseTag: reinstatementPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReinstatementId(session.reinstatementId);
  let next: O10mModesPersistedState = {
    ...state,
    reinstatementSession: { ...session, active: false, reinstatementScore, phaseTag: 'reinstatement' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reinstatementSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reinstatementScore: number;
  phase: O10mReinstatementPhase | null;
} {
  const session = sanitizeReinstatementSession(state.reinstatementSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reinstatementScore: session?.reinstatementScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-setaside.ts ---
export const O10M_SETASIDE_SCENARIO_CAP = 6;
export const O10M_SETASIDE_SCORE_CAP = 1040;
export const O10M_SETASIDE_SCORE_MONEY_CAP = 1120;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSetAsidePhase>(['filing', 'review', 'setAside']);

export function unlockTokenForSetAsideId(setAsideId: string): string | null {
  if (!setAsideId.startsWith('o10m_setaside_')) return null;
  return `o10m_unlock_${setAsideId.slice('o10m_setaside_'.length)}`;
}

export function setAsidePhaseForCursor(cursor: number, scenarioCount: number): O10mSetAsidePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'setAside';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function setAsideScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(137, Math.max(32, Math.floor(run.playerNetWorth / 134) + standingSlice));
}

export function sanitizeSetAsideSession(raw: unknown): O10mSetAsideSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const setAsideId =
    typeof o.setAsideId === 'string' && o.setAsideId.startsWith('o10m_setaside_')
      ? o.setAsideId
      : null;
  if (!setAsideId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : setAsideId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SETASIDE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const setAsideScore = Math.min(
    O10M_SETASIDE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.setAsideScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSetAsidePhase)
      ? (phaseRaw as O10mSetAsidePhase)
      : setAsidePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    setAsideId,
    label,
    scenarioIds,
    cursor,
    active,
    setAsideScore,
    phaseTag,
  };
}

export function createSetAsideSession(params: {
  setAsideId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSetAsideSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.setAsideId.startsWith('o10m_setaside_')) {
    return { session: null, warnings: ['SetAside ids must start with o10m_setaside_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_SETASIDE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'SetAside arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      setAsideId: params.setAsideId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      setAsideScore: 0,
      phaseTag: setAsidePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSetAsideSessionToState(
  state: O10mModesPersistedState,
  session: O10mSetAsideSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSetAsideSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    setAsideSession: sanitized,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearSetAsideSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, setAsideSession: null };
}

export function getSetAsideScenarioAtCursor(
  session: O10mSetAsideSession | null | undefined,
): string | null {
  const setAside = sanitizeSetAsideSession(session);
  if (!setAside || !setAside.active) return null;
  return setAside.scenarioIds[setAside.cursor] ?? null;
}

export function buildSetAsideScenarioStartOverrides(
  session: O10mSetAsideSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const setAside = sanitizeSetAsideSession(session);
  if (!setAside) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SETASIDE_SCORE_MONEY_CAP,
    Math.floor(setAside.setAsideScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSetAsideId: setAside.setAsideId,
      o10mActiveSetAsideStep: setAside.cursor,
      o10mActiveSetAsidePhase: setAside.phaseTag,
      o10mSetAsideScore: setAside.setAsideScore,
    },
  };
}

export function advanceSetAsideSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSetAsideSession(state.setAsideSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const setAsideScore = Math.min(
    O10M_SETASIDE_SCORE_CAP,
    session.setAsideScore + setAsideScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      setAsideSession: {
        ...session,
        cursor,
        setAsideScore,
        phaseTag: setAsidePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSetAsideId(session.setAsideId);
  let next: O10mModesPersistedState = {
    ...state,
    setAsideSession: { ...session, active: false, setAsideScore, phaseTag: 'setAside' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function setAsideSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  setAsideScore: number;
  phase: O10mSetAsidePhase | null;
} {
  const session = sanitizeSetAsideSession(state.setAsideSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    setAsideScore: session?.setAsideScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-quash.ts ---
export const O10M_QUASH_SCENARIO_CAP = 6;
export const O10M_QUASH_SCORE_CAP = 1050;
export const O10M_QUASH_SCORE_MONEY_CAP = 1130;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mQuashPhase>(['filing', 'review', 'quash']);

export function unlockTokenForQuashId(quashId: string): string | null {
  if (!quashId.startsWith('o10m_quash_')) return null;
  return `o10m_unlock_${quashId.slice('o10m_quash_'.length)}`;
}

export function quashPhaseForCursor(cursor: number, scenarioCount: number): O10mQuashPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'quash';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function quashScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(138, Math.max(33, Math.floor(run.playerNetWorth / 132) + standingSlice));
}

export function sanitizeQuashSession(raw: unknown): O10mQuashSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const quashId =
    typeof o.quashId === 'string' && o.quashId.startsWith('o10m_quash_') ? o.quashId : null;
  if (!quashId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : quashId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_QUASH_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const quashScore = Math.min(
    O10M_QUASH_SCORE_CAP,
    Math.max(0, Math.floor(num(o.quashScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mQuashPhase)
      ? (phaseRaw as O10mQuashPhase)
      : quashPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    quashId,
    label,
    scenarioIds,
    cursor,
    active,
    quashScore,
    phaseTag,
  };
}

export function createQuashSession(params: {
  quashId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mQuashSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.quashId.startsWith('o10m_quash_')) {
    return { session: null, warnings: ['Quash ids must start with o10m_quash_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_QUASH_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Quash arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      quashId: params.quashId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      quashScore: 0,
      phaseTag: quashPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachQuashSessionToState(
  state: O10mModesPersistedState,
  session: O10mQuashSession,
): O10mModesPersistedState {
  const sanitized = sanitizeQuashSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    quashSession: sanitized,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearQuashSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, quashSession: null };
}

export function getQuashScenarioAtCursor(
  session: O10mQuashSession | null | undefined,
): string | null {
  const quash = sanitizeQuashSession(session);
  if (!quash || !quash.active) return null;
  return quash.scenarioIds[quash.cursor] ?? null;
}

export function buildQuashScenarioStartOverrides(
  session: O10mQuashSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const quash = sanitizeQuashSession(session);
  if (!quash) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_QUASH_SCORE_MONEY_CAP,
    Math.floor(quash.quashScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveQuashId: quash.quashId,
      o10mActiveQuashStep: quash.cursor,
      o10mActiveQuashPhase: quash.phaseTag,
      o10mQuashScore: quash.quashScore,
    },
  };
}

export function advanceQuashSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeQuashSession(state.quashSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const quashScore = Math.min(
    O10M_QUASH_SCORE_CAP,
    session.quashScore + quashScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      quashSession: {
        ...session,
        cursor,
        quashScore,
        phaseTag: quashPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForQuashId(session.quashId);
  let next: O10mModesPersistedState = {
    ...state,
    quashSession: { ...session, active: false, quashScore, phaseTag: 'quash' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function quashSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  quashScore: number;
  phase: O10mQuashPhase | null;
} {
  const session = sanitizeQuashSession(state.quashSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    quashScore: session?.quashScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-supersede.ts ---
export const O10M_SUPERSEDE_SCENARIO_CAP = 6;
export const O10M_SUPERSEDE_SCORE_CAP = 1060;
export const O10M_SUPERSEDE_SCORE_MONEY_CAP = 1140;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSupersedePhase>(['filing', 'review', 'supersede']);

export function unlockTokenForSupersedeId(supersedeId: string): string | null {
  if (!supersedeId.startsWith('o10m_supersede_')) return null;
  return `o10m_unlock_${supersedeId.slice('o10m_supersede_'.length)}`;
}

export function supersedePhaseForCursor(cursor: number, scenarioCount: number): O10mSupersedePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'supersede';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function supersedeScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(139, Math.max(34, Math.floor(run.playerNetWorth / 130) + standingSlice));
}

export function sanitizeSupersedeSession(raw: unknown): O10mSupersedeSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const supersedeId =
    typeof o.supersedeId === 'string' && o.supersedeId.startsWith('o10m_supersede_')
      ? o.supersedeId
      : null;
  if (!supersedeId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : supersedeId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SUPERSEDE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const supersedeScore = Math.min(
    O10M_SUPERSEDE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.supersedeScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSupersedePhase)
      ? (phaseRaw as O10mSupersedePhase)
      : supersedePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    supersedeId,
    label,
    scenarioIds,
    cursor,
    active,
    supersedeScore,
    phaseTag,
  };
}

export function createSupersedeSession(params: {
  supersedeId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSupersedeSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.supersedeId.startsWith('o10m_supersede_')) {
    return { session: null, warnings: ['Supersede ids must start with o10m_supersede_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_SUPERSEDE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Supersede arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      supersedeId: params.supersedeId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      supersedeScore: 0,
      phaseTag: supersedePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSupersedeSessionToState(
  state: O10mModesPersistedState,
  session: O10mSupersedeSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSupersedeSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    supersedeSession: sanitized,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearSupersedeSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, supersedeSession: null };
}

export function getSupersedeScenarioAtCursor(
  session: O10mSupersedeSession | null | undefined,
): string | null {
  const supersede = sanitizeSupersedeSession(session);
  if (!supersede || !supersede.active) return null;
  return supersede.scenarioIds[supersede.cursor] ?? null;
}

export function buildSupersedeScenarioStartOverrides(
  session: O10mSupersedeSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const supersede = sanitizeSupersedeSession(session);
  if (!supersede) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SUPERSEDE_SCORE_MONEY_CAP,
    Math.floor(supersede.supersedeScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSupersedeId: supersede.supersedeId,
      o10mActiveSupersedeStep: supersede.cursor,
      o10mActiveSupersedePhase: supersede.phaseTag,
      o10mSupersedeScore: supersede.supersedeScore,
    },
  };
}

export function advanceSupersedeSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSupersedeSession(state.supersedeSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const supersedeScore = Math.min(
    O10M_SUPERSEDE_SCORE_CAP,
    session.supersedeScore + supersedeScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      supersedeSession: {
        ...session,
        cursor,
        supersedeScore,
        phaseTag: supersedePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSupersedeId(session.supersedeId);
  let next: O10mModesPersistedState = {
    ...state,
    supersedeSession: { ...session, active: false, supersedeScore, phaseTag: 'supersede' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function supersedeSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  supersedeScore: number;
  phase: O10mSupersedePhase | null;
} {
  const session = sanitizeSupersedeSession(state.supersedeSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    supersedeScore: session?.supersedeScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-certiorari.ts ---
export const O10M_CERTIORARI_SCENARIO_CAP = 6;
export const O10M_CERTIORARI_SCORE_CAP = 1070;
export const O10M_CERTIORARI_SCORE_MONEY_CAP = 1150;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCertiorariPhase>(['filing', 'review', 'certiorari']);

export function unlockTokenForCertiorariId(certiorariId: string): string | null {
  if (!certiorariId.startsWith('o10m_certiorari_')) return null;
  return `o10m_unlock_${certiorariId.slice('o10m_certiorari_'.length)}`;
}

export function certiorariPhaseForCursor(cursor: number, scenarioCount: number): O10mCertiorariPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'certiorari';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function certiorariScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(140, Math.max(35, Math.floor(run.playerNetWorth / 128) + standingSlice));
}

export function sanitizeCertiorariSession(raw: unknown): O10mCertiorariSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const certiorariId =
    typeof o.certiorariId === 'string' && o.certiorariId.startsWith('o10m_certiorari_')
      ? o.certiorariId
      : null;
  if (!certiorariId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : certiorariId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CERTIORARI_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const certiorariScore = Math.min(
    O10M_CERTIORARI_SCORE_CAP,
    Math.max(0, Math.floor(num(o.certiorariScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCertiorariPhase)
      ? (phaseRaw as O10mCertiorariPhase)
      : certiorariPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    certiorariId,
    label,
    scenarioIds,
    cursor,
    active,
    certiorariScore,
    phaseTag,
  };
}

export function createCertiorariSession(params: {
  certiorariId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCertiorariSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.certiorariId.startsWith('o10m_certiorari_')) {
    return { session: null, warnings: ['Certiorari ids must start with o10m_certiorari_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_CERTIORARI_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Certiorari arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      certiorariId: params.certiorariId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      certiorariScore: 0,
      phaseTag: certiorariPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCertiorariSessionToState(
  state: O10mModesPersistedState,
  session: O10mCertiorariSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCertiorariSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    certiorariSession: sanitized,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearCertiorariSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, certiorariSession: null };
}

export function getCertiorariScenarioAtCursor(
  session: O10mCertiorariSession | null | undefined,
): string | null {
  const certiorari = sanitizeCertiorariSession(session);
  if (!certiorari || !certiorari.active) return null;
  return certiorari.scenarioIds[certiorari.cursor] ?? null;
}

export function buildCertiorariScenarioStartOverrides(
  session: O10mCertiorariSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const certiorari = sanitizeCertiorariSession(session);
  if (!certiorari) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CERTIORARI_SCORE_MONEY_CAP,
    Math.floor(certiorari.certiorariScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCertiorariId: certiorari.certiorariId,
      o10mActiveCertiorariStep: certiorari.cursor,
      o10mActiveCertiorariPhase: certiorari.phaseTag,
      o10mCertiorariScore: certiorari.certiorariScore,
    },
  };
}

export function advanceCertiorariSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCertiorariSession(state.certiorariSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const certiorariScore = Math.min(
    O10M_CERTIORARI_SCORE_CAP,
    session.certiorariScore + certiorariScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      certiorariSession: {
        ...session,
        cursor,
        certiorariScore,
        phaseTag: certiorariPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCertiorariId(session.certiorariId);
  let next: O10mModesPersistedState = {
    ...state,
    certiorariSession: { ...session, active: false, certiorariScore, phaseTag: 'certiorari' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function certiorariSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  certiorariScore: number;
  phase: O10mCertiorariPhase | null;
} {
  const session = sanitizeCertiorariSession(state.certiorariSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    certiorariScore: session?.certiorariScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-mandamus.ts ---
export const O10M_MANDAMUS_SCENARIO_CAP = 6;
export const O10M_MANDAMUS_SCORE_CAP = 1080;
export const O10M_MANDAMUS_SCORE_MONEY_CAP = 1160;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mMandamusPhase>(['filing', 'review', 'mandamus']);

export function unlockTokenForMandamusId(mandamusId: string): string | null {
  if (!mandamusId.startsWith('o10m_mandamus_')) return null;
  return `o10m_unlock_${mandamusId.slice('o10m_mandamus_'.length)}`;
}

export function mandamusPhaseForCursor(cursor: number, scenarioCount: number): O10mMandamusPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'mandamus';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function mandamusScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(141, Math.max(36, Math.floor(run.playerNetWorth / 126) + standingSlice));
}

export function sanitizeMandamusSession(raw: unknown): O10mMandamusSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const mandamusId =
    typeof o.mandamusId === 'string' && o.mandamusId.startsWith('o10m_mandamus_')
      ? o.mandamusId
      : null;
  if (!mandamusId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : mandamusId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_MANDAMUS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const mandamusScore = Math.min(
    O10M_MANDAMUS_SCORE_CAP,
    Math.max(0, Math.floor(num(o.mandamusScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mMandamusPhase)
      ? (phaseRaw as O10mMandamusPhase)
      : mandamusPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    mandamusId,
    label,
    scenarioIds,
    cursor,
    active,
    mandamusScore,
    phaseTag,
  };
}

export function createMandamusSession(params: {
  mandamusId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mMandamusSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.mandamusId.startsWith('o10m_mandamus_')) {
    return { session: null, warnings: ['Mandamus ids must start with o10m_mandamus_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_MANDAMUS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Mandamus arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      mandamusId: params.mandamusId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      mandamusScore: 0,
      phaseTag: mandamusPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachMandamusSessionToState(
  state: O10mModesPersistedState,
  session: O10mMandamusSession,
): O10mModesPersistedState {
  const sanitized = sanitizeMandamusSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    mandamusSession: sanitized,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearMandamusSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, mandamusSession: null };
}

export function getMandamusScenarioAtCursor(
  session: O10mMandamusSession | null | undefined,
): string | null {
  const mandamus = sanitizeMandamusSession(session);
  if (!mandamus || !mandamus.active) return null;
  return mandamus.scenarioIds[mandamus.cursor] ?? null;
}

export function buildMandamusScenarioStartOverrides(
  session: O10mMandamusSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const mandamus = sanitizeMandamusSession(session);
  if (!mandamus) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_MANDAMUS_SCORE_MONEY_CAP,
    Math.floor(mandamus.mandamusScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveMandamusId: mandamus.mandamusId,
      o10mActiveMandamusStep: mandamus.cursor,
      o10mActiveMandamusPhase: mandamus.phaseTag,
      o10mMandamusScore: mandamus.mandamusScore,
    },
  };
}

export function advanceMandamusSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeMandamusSession(state.mandamusSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const mandamusScore = Math.min(
    O10M_MANDAMUS_SCORE_CAP,
    session.mandamusScore + mandamusScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      mandamusSession: {
        ...session,
        cursor,
        mandamusScore,
        phaseTag: mandamusPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForMandamusId(session.mandamusId);
  let next: O10mModesPersistedState = {
    ...state,
    mandamusSession: { ...session, active: false, mandamusScore, phaseTag: 'mandamus' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function mandamusSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  mandamusScore: number;
  phase: O10mMandamusPhase | null;
} {
  const session = sanitizeMandamusSession(state.mandamusSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    mandamusScore: session?.mandamusScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-prohibition.ts ---
export const O10M_PROHIBITION_SCENARIO_CAP = 6;
export const O10M_PROHIBITION_SCORE_CAP = 1090;
export const O10M_PROHIBITION_SCORE_MONEY_CAP = 1170;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mProhibitionPhase>(['filing', 'review', 'prohibition']);

export function unlockTokenForProhibitionId(prohibitionId: string): string | null {
  if (!prohibitionId.startsWith('o10m_prohibition_')) return null;
  return `o10m_unlock_${prohibitionId.slice('o10m_prohibition_'.length)}`;
}

export function prohibitionPhaseForCursor(cursor: number, scenarioCount: number): O10mProhibitionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'prohibition';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function prohibitionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(142, Math.max(36, Math.floor(run.playerNetWorth / 124) + standingSlice));
}

export function sanitizeProhibitionSession(raw: unknown): O10mProhibitionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const prohibitionId =
    typeof o.prohibitionId === 'string' && o.prohibitionId.startsWith('o10m_prohibition_')
      ? o.prohibitionId
      : null;
  if (!prohibitionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : prohibitionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PROHIBITION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const prohibitionScore = Math.min(
    O10M_PROHIBITION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.prohibitionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mProhibitionPhase)
      ? (phaseRaw as O10mProhibitionPhase)
      : prohibitionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    prohibitionId,
    label,
    scenarioIds,
    cursor,
    active,
    prohibitionScore,
    phaseTag,
  };
}

export function createProhibitionSession(params: {
  prohibitionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mProhibitionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.prohibitionId.startsWith('o10m_prohibition_')) {
    return { session: null, warnings: ['Prohibition ids must start with o10m_prohibition_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_PROHIBITION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Prohibition arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      prohibitionId: params.prohibitionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      prohibitionScore: 0,
      phaseTag: prohibitionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachProhibitionSessionToState(
  state: O10mModesPersistedState,
  session: O10mProhibitionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeProhibitionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    prohibitionSession: sanitized,
    mandamusSession: null,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearProhibitionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, prohibitionSession: null };
}

export function getProhibitionScenarioAtCursor(
  session: O10mProhibitionSession | null | undefined,
): string | null {
  const prohibition = sanitizeProhibitionSession(session);
  if (!prohibition || !prohibition.active) return null;
  return prohibition.scenarioIds[prohibition.cursor] ?? null;
}

export function buildProhibitionScenarioStartOverrides(
  session: O10mProhibitionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const prohibition = sanitizeProhibitionSession(session);
  if (!prohibition) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PROHIBITION_SCORE_MONEY_CAP,
    Math.floor(prohibition.prohibitionScore * 0.88),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveProhibitionId: prohibition.prohibitionId,
      o10mActiveProhibitionStep: prohibition.cursor,
      o10mActiveProhibitionPhase: prohibition.phaseTag,
      o10mProhibitionScore: prohibition.prohibitionScore,
    },
  };
}

export function advanceProhibitionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeProhibitionSession(state.prohibitionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const prohibitionScore = Math.min(
    O10M_PROHIBITION_SCORE_CAP,
    session.prohibitionScore + prohibitionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      prohibitionSession: {
        ...session,
        cursor,
        prohibitionScore,
        phaseTag: prohibitionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForProhibitionId(session.prohibitionId);
  let next: O10mModesPersistedState = {
    ...state,
    prohibitionSession: { ...session, active: false, prohibitionScore, phaseTag: 'prohibition' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function prohibitionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  prohibitionScore: number;
  phase: O10mProhibitionPhase | null;
} {
  const session = sanitizeProhibitionSession(state.prohibitionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    prohibitionScore: session?.prohibitionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-habeas.ts ---
export const O10M_HABEAS_SCENARIO_CAP = 6;
export const O10M_HABEAS_SCORE_CAP = 1100;
export const O10M_HABEAS_SCORE_MONEY_CAP = 1180;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mHabeasPhase>(['filing', 'review', 'habeas']);

export function unlockTokenForHabeasId(habeasId: string): string | null {
  if (!habeasId.startsWith('o10m_habeas_')) return null;
  return `o10m_unlock_${habeasId.slice('o10m_habeas_'.length)}`;
}

export function habeasPhaseForCursor(cursor: number, scenarioCount: number): O10mHabeasPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'habeas';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function habeasScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(143, Math.max(36, Math.floor(run.playerNetWorth / 122) + standingSlice));
}

export function sanitizeHabeasSession(raw: unknown): O10mHabeasSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const habeasId =
    typeof o.habeasId === 'string' && o.habeasId.startsWith('o10m_habeas_')
      ? o.habeasId
      : null;
  if (!habeasId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : habeasId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_HABEAS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const habeasScore = Math.min(
    O10M_HABEAS_SCORE_CAP,
    Math.max(0, Math.floor(num(o.habeasScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mHabeasPhase)
      ? (phaseRaw as O10mHabeasPhase)
      : habeasPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    habeasId,
    label,
    scenarioIds,
    cursor,
    active,
    habeasScore,
    phaseTag,
  };
}

export function createHabeasSession(params: {
  habeasId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mHabeasSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.habeasId.startsWith('o10m_habeas_')) {
    return { session: null, warnings: ['Habeas ids must start with o10m_habeas_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_HABEAS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Habeas arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      habeasId: params.habeasId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      habeasScore: 0,
      phaseTag: habeasPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachHabeasSessionToState(
  state: O10mModesPersistedState,
  session: O10mHabeasSession,
): O10mModesPersistedState {
  const sanitized = sanitizeHabeasSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    habeasSession: sanitized,
    prohibitionSession: null,
    mandamusSession: null,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearHabeasSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, habeasSession: null };
}

export function getHabeasScenarioAtCursor(
  session: O10mHabeasSession | null | undefined,
): string | null {
  const habeas = sanitizeHabeasSession(session);
  if (!habeas || !habeas.active) return null;
  return habeas.scenarioIds[habeas.cursor] ?? null;
}

export function buildHabeasScenarioStartOverrides(
  session: O10mHabeasSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const habeas = sanitizeHabeasSession(session);
  if (!habeas) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_HABEAS_SCORE_MONEY_CAP,
    Math.floor(habeas.habeasScore * 0.89),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveHabeasId: habeas.habeasId,
      o10mActiveHabeasStep: habeas.cursor,
      o10mActiveHabeasPhase: habeas.phaseTag,
      o10mHabeasScore: habeas.habeasScore,
    },
  };
}

export function advanceHabeasSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeHabeasSession(state.habeasSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const habeasScore = Math.min(
    O10M_HABEAS_SCORE_CAP,
    session.habeasScore + habeasScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      habeasSession: {
        ...session,
        cursor,
        habeasScore,
        phaseTag: habeasPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForHabeasId(session.habeasId);
  let next: O10mModesPersistedState = {
    ...state,
    habeasSession: { ...session, active: false, habeasScore, phaseTag: 'habeas' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function habeasSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  habeasScore: number;
  phase: O10mHabeasPhase | null;
} {
  const session = sanitizeHabeasSession(state.habeasSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    habeasScore: session?.habeasScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-quowarranto.ts ---
export const O10M_QUOWARRANTO_SCENARIO_CAP = 6;
export const O10M_QUOWARRANTO_SCORE_CAP = 1110;
export const O10M_QUOWARRANTO_SCORE_MONEY_CAP = 1190;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mQuowarrantoPhase>(['filing', 'review', 'quowarranto']);

export function unlockTokenForQuowarrantoId(quowarrantoId: string): string | null {
  if (!quowarrantoId.startsWith('o10m_quowarranto_')) return null;
  return `o10m_unlock_${quowarrantoId.slice('o10m_quowarranto_'.length)}`;
}

export function quowarrantoPhaseForCursor(cursor: number, scenarioCount: number): O10mQuowarrantoPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'quowarranto';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function quowarrantoScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(144, Math.max(36, Math.floor(run.playerNetWorth / 120) + standingSlice));
}

export function sanitizeQuowarrantoSession(raw: unknown): O10mQuowarrantoSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const quowarrantoId =
    typeof o.quowarrantoId === 'string' && o.quowarrantoId.startsWith('o10m_quowarranto_')
      ? o.quowarrantoId
      : null;
  if (!quowarrantoId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : quowarrantoId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_QUOWARRANTO_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const quowarrantoScore = Math.min(
    O10M_QUOWARRANTO_SCORE_CAP,
    Math.max(0, Math.floor(num(o.quowarrantoScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mQuowarrantoPhase)
      ? (phaseRaw as O10mQuowarrantoPhase)
      : quowarrantoPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    quowarrantoId,
    label,
    scenarioIds,
    cursor,
    active,
    quowarrantoScore,
    phaseTag,
  };
}

export function createQuowarrantoSession(params: {
  quowarrantoId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mQuowarrantoSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.quowarrantoId.startsWith('o10m_quowarranto_')) {
    return { session: null, warnings: ['Quowarranto ids must start with o10m_quowarranto_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_QUOWARRANTO_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Quowarranto arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      quowarrantoId: params.quowarrantoId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      quowarrantoScore: 0,
      phaseTag: quowarrantoPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachQuowarrantoSessionToState(
  state: O10mModesPersistedState,
  session: O10mQuowarrantoSession,
): O10mModesPersistedState {
  const sanitized = sanitizeQuowarrantoSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    quowarrantoSession: sanitized,
    injunctionSession: null,
    habeasSession: null,
    prohibitionSession: null,
    mandamusSession: null,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearQuowarrantoSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, quowarrantoSession: null };
}

export function getQuowarrantoScenarioAtCursor(
  session: O10mQuowarrantoSession | null | undefined,
): string | null {
  const quowarranto = sanitizeQuowarrantoSession(session);
  if (!quowarranto || !quowarranto.active) return null;
  return quowarranto.scenarioIds[quowarranto.cursor] ?? null;
}

export function buildQuowarrantoScenarioStartOverrides(
  session: O10mQuowarrantoSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const quowarranto = sanitizeQuowarrantoSession(session);
  if (!quowarranto) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_QUOWARRANTO_SCORE_MONEY_CAP,
    Math.floor(quowarranto.quowarrantoScore * 0.90),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveQuowarrantoId: quowarranto.quowarrantoId,
      o10mActiveQuowarrantoStep: quowarranto.cursor,
      o10mActiveQuowarrantoPhase: quowarranto.phaseTag,
      o10mQuowarrantoScore: quowarranto.quowarrantoScore,
    },
  };
}

export function advanceQuowarrantoSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeQuowarrantoSession(state.quowarrantoSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const quowarrantoScore = Math.min(
    O10M_QUOWARRANTO_SCORE_CAP,
    session.quowarrantoScore + quowarrantoScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      quowarrantoSession: {
        ...session,
        cursor,
        quowarrantoScore,
        phaseTag: quowarrantoPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForQuowarrantoId(session.quowarrantoId);
  let next: O10mModesPersistedState = {
    ...state,
    quowarrantoSession: { ...session, active: false, quowarrantoScore, phaseTag: 'quowarranto' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function quowarrantoSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  quowarrantoScore: number;
  phase: O10mQuowarrantoPhase | null;
} {
  const session = sanitizeQuowarrantoSession(state.quowarrantoSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    quowarrantoScore: session?.quowarrantoScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/save-format-injunction.ts ---
export const O10M_INJUNCTION_SCENARIO_CAP = 6;
export const O10M_INJUNCTION_SCORE_CAP = 1118;
export const O10M_INJUNCTION_SCORE_MONEY_CAP = 1180;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mInjunctionPhase>(['filing', 'review', 'injunction']);

export function unlockTokenForInjunctionId(injunctionId: string): string | null {
  if (!injunctionId.startsWith('o10m_injunction_')) return null;
  return `o10m_unlock_${injunctionId.slice('o10m_injunction_'.length)}`;
}

export function injunctionPhaseForCursor(cursor: number, scenarioCount: number): O10mInjunctionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'injunction';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function injunctionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(145, Math.max(36, Math.floor(run.playerNetWorth / 118) + standingSlice));
}

export function sanitizeInjunctionSession(raw: unknown): O10mInjunctionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const injunctionId =
    typeof o.injunctionId === 'string' && o.injunctionId.startsWith('o10m_injunction_')
      ? o.injunctionId
      : null;
  if (!injunctionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : injunctionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_INJUNCTION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const injunctionScore = Math.min(
    O10M_INJUNCTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.injunctionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mInjunctionPhase)
      ? (phaseRaw as O10mInjunctionPhase)
      : injunctionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    injunctionId,
    label,
    scenarioIds,
    cursor,
    active,
    injunctionScore,
    phaseTag,
  };
}

export function createInjunctionSession(params: {
  injunctionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mInjunctionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.injunctionId.startsWith('o10m_injunction_')) {
    return { session: null, warnings: ['Injunction ids must start with o10m_injunction_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_INJUNCTION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Injunction arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      injunctionId: params.injunctionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      injunctionScore: 0,
      phaseTag: injunctionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachInjunctionSessionToState(
  state: O10mModesPersistedState,
  session: O10mInjunctionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeInjunctionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    injunctionSession: sanitized,
    quowarrantoSession: null,
    habeasSession: null,
    prohibitionSession: null,
    mandamusSession: null,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearInjunctionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, injunctionSession: null };
}

export function getInjunctionScenarioAtCursor(
  session: O10mInjunctionSession | null | undefined,
): string | null {
  const injunction = sanitizeInjunctionSession(session);
  if (!injunction || !injunction.active) return null;
  return injunction.scenarioIds[injunction.cursor] ?? null;
}

export function buildInjunctionScenarioStartOverrides(
  session: O10mInjunctionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const injunction = sanitizeInjunctionSession(session);
  if (!injunction) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_INJUNCTION_SCORE_MONEY_CAP,
    Math.floor(injunction.injunctionScore * 0.91),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveInjunctionId: injunction.injunctionId,
      o10mActiveInjunctionStep: injunction.cursor,
      o10mActiveInjunctionPhase: injunction.phaseTag,
      o10mInjunctionScore: injunction.injunctionScore,
    },
  };
}

export function advanceInjunctionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeInjunctionSession(state.injunctionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const injunctionScore = Math.min(
    O10M_INJUNCTION_SCORE_CAP,
    session.injunctionScore + injunctionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      injunctionSession: {
        ...session,
        cursor,
        injunctionScore,
        phaseTag: injunctionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForInjunctionId(session.injunctionId);
  let next: O10mModesPersistedState = {
    ...state,
    injunctionSession: { ...session, active: false, injunctionScore, phaseTag: 'injunction' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function injunctionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  injunctionScore: number;
  phase: O10mInjunctionPhase | null;
} {
  const session = sanitizeInjunctionSession(state.injunctionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    injunctionScore: session?.injunctionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}

// --- bundled from src/scenario-campaign-planner.ts ---
const emptyQueuePlan = {
  marathonQueueId: null as string | null,
  marathonCursor: null as number | null,
  gauntletId: null as string | null,
  gauntletCursor: null as number | null,
  gauntletLives: null as number | null,
  relayId: null as string | null,
  relayCursor: null as number | null,
  relayCarryMoney: null as number | null,
  circuitId: null as string | null,
  circuitCursor: null as number | null,
  circuitPhase: null as O10mCircuitPhase | null,
  circuitMomentum: null as number | null,
  expeditionId: null as string | null,
  expeditionCursor: null as number | null,
  expeditionLeg: null as O10mExpeditionLeg | null,
  expeditionSupply: null as number | null,
  odysseyId: null as string | null,
  odysseyCursor: null as number | null,
  odysseyAct: null as O10mOdysseyAct | null,
  odysseyRenown: null as number | null,
  pilgrimageId: null as string | null,
  pilgrimageCursor: null as number | null,
  pilgrimageStage: null as O10mPilgrimageStage | null,
  pilgrimageDevotion: null as number | null,
  caravanId: null as string | null,
  caravanCursor: null as number | null,
  caravanLeg: null as O10mCaravanLeg | null,
  caravanCargo: null as number | null,
  voyageId: null as string | null,
  voyageCursor: null as number | null,
  voyageSegment: null as O10mVoyageSegment | null,
  voyageChart: null as number | null,
  siegeId: null as string | null,
  siegeCursor: null as number | null,
  siegePhase: null as O10mSiegePhase | null,
  siegeMorale: null as number | null,
  convoyId: null as string | null,
  convoyCursor: null as number | null,
  convoyStage: null as O10mConvoyStage | null,
  convoyHaul: null as number | null,
  escortId: null as string | null,
  escortCursor: null as number | null,
  escortPhase: null as O10mEscortPhase | null,
  escortTrust: null as number | null,
  extractionId: null as string | null,
  extractionCursor: null as number | null,
  extractionPhase: null as O10mExtractionPhase | null,
  extractionAssets: null as number | null,
  subjectId: null as string | null,
  subjectCursor: null as number | null,
  subjectPhase: null as O10mSubjectPhase | null,
  subjectFidelity: null as number | null,
  witnessId: null as string | null,
  witnessCursor: null as number | null,
  witnessPhase: null as O10mWitnessPhase | null,
  witnessCredibility: null as number | null,
  tribunalId: null as string | null,
  tribunalCursor: null as number | null,
  tribunalPhase: null as O10mTribunalPhase | null,
  tribunalGravitas: null as number | null,
  indictmentId: null as string | null,
  indictmentCursor: null as number | null,
  indictmentPhase: null as O10mIndictmentPhase | null,
  indictmentCaseWeight: null as number | null,
  appealId: null as string | null,
  appealCursor: null as number | null,
  appealPhase: null as O10mAppealPhase | null,
  appealMerit: null as number | null,
  clemencyId: null as string | null,
  clemencyCursor: null as number | null,
  clemencyPhase: null as O10mClemencyPhase | null,
  clemencyMercy: null as number | null,
  pardonId: null as string | null,
  pardonCursor: null as number | null,
  pardonPhase: null as O10mPardonPhase | null,
  pardonGrace: null as number | null,
  amnestyId: null as string | null,
  amnestyCursor: null as number | null,
  amnestyPhase: null as O10mAmnestyPhase | null,
  amnestyAbsolution: null as number | null,
  reprieveId: null as string | null,
  reprieveCursor: null as number | null,
  reprievePhase: null as O10mReprievePhase | null,
  reprieveRelief: null as number | null,
  paroleId: null as string | null,
  paroleCursor: null as number | null,
  parolePhase: null as O10mParolePhase | null,
  paroleTrust: null as number | null,
  probationId: null as string | null,
  probationCursor: null as number | null,
  probationPhase: null as O10mProbationPhase | null,
  probationCompliance: null as number | null,
  commutationId: null as string | null,
  commutationCursor: null as number | null,
  commutationPhase: null as O10mCommutationPhase | null,
  commutationLeniency: null as number | null,
  acquittalId: null as string | null,
  acquittalCursor: null as number | null,
  acquittalPhase: null as O10mAcquittalPhase | null,
  acquittalVerdict: null as number | null,
  exonerationId: null as string | null,
  exonerationCursor: null as number | null,
  exonerationPhase: null as O10mExonerationPhase | null,
  exonerationRestitution: null as number | null,
  expungementId: null as string | null,
  expungementCursor: null as number | null,
  expungementPhase: null as O10mExpungementPhase | null,
  expungementSeal: null as number | null,
  vacaturId: null as string | null,
  vacaturCursor: null as number | null,
  vacaturPhase: null as O10mVacaturPhase | null,
  vacaturMerit: null as number | null,
  remandId: null as string | null,
  remandCursor: null as number | null,
  remandPhase: null as O10mRemandPhase | null,
  remandWeight: null as number | null,
  reversalId: null as string | null,
  reversalCursor: null as number | null,
  reversalPhase: null as O10mReversalPhase | null,
  reversalScore: null as number | null,
  annulmentId: null as string | null,
  annulmentCursor: null as number | null,
  annulmentPhase: null as O10mAnnulmentPhase | null,
  annulmentScore: null as number | null,
  reinstatementId: null as string | null,
  reinstatementCursor: null as number | null,
  reinstatementPhase: null as O10mReinstatementPhase | null,
  reinstatementScore: null as number | null,
  setAsideId: null as string | null,
  setAsideCursor: null as number | null,
  setAsidePhase: null as O10mSetAsidePhase | null,
  setAsideScore: null as number | null,
  quashId: null as string | null,
  quashCursor: null as number | null,
  quashPhase: null as O10mQuashPhase | null,
  quashScore: null as number | null,
  supersedeId: null as string | null,
  supersedeCursor: null as number | null,
  supersedePhase: null as O10mSupersedePhase | null,
  supersedeScore: null as number | null,
  certiorariId: null as string | null,
  certiorariCursor: null as number | null,
  certiorariPhase: null as O10mCertiorariPhase | null,
  certiorariScore: null as number | null,
  mandamusId: null as string | null,
  mandamusCursor: null as number | null,
  mandamusPhase: null as O10mMandamusPhase | null,
  mandamusScore: null as number | null,
  prohibitionId: null as string | null,
  prohibitionCursor: null as number | null,
  prohibitionPhase: null as O10mProhibitionPhase | null,
  prohibitionScore: null as number | null,
  habeasId: null as string | null,
  habeasCursor: null as number | null,
  habeasPhase: null as O10mHabeasPhase | null,
  habeasScore: null as number | null,
  quowarrantoId: null as string | null,
  quowarrantoCursor: null as number | null,
  quowarrantoPhase: null as O10mQuowarrantoPhase | null,
  quowarrantoScore: null as number | null,
  injunctionId: null as string | null,
  injunctionCursor: null as number | null,
  injunctionPhase: null as O10mInjunctionPhase | null,
  injunctionScore: null as number | null,
};

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  const injunction = sanitizeInjunctionSession(state.injunctionSession);
  const injunctionScenario = getInjunctionScenarioAtCursor(injunction);
  if (injunction && injunction.active && injunctionScenario) {
    return {
      kind: 'injunction_step',
      scenarioId: injunctionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      injunctionId: injunction.injunctionId,
      injunctionCursor: injunction.cursor,
      injunctionPhase: injunction.phaseTag,
      injunctionScore: injunction.injunctionScore,
      reason: `Injunction "${injunction.label}" ${injunction.phaseTag} phase ${injunction.cursor + 1}/${injunction.scenarioIds.length} (score ${injunction.injunctionScore}).`,
    };
  }

  const quowarranto = sanitizeQuowarrantoSession(state.quowarrantoSession);
  const quowarrantoScenario = getQuowarrantoScenarioAtCursor(quowarranto);
  if (quowarranto && quowarranto.active && quowarrantoScenario) {
    return {
      kind: 'quowarranto_step',
      scenarioId: quowarrantoScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      quowarrantoId: quowarranto.quowarrantoId,
      quowarrantoCursor: quowarranto.cursor,
      quowarrantoPhase: quowarranto.phaseTag,
      quowarrantoScore: quowarranto.quowarrantoScore,
      reason: `Quo warranto "${quowarranto.label}" ${quowarranto.phaseTag} phase ${quowarranto.cursor + 1}/${quowarranto.scenarioIds.length} (score ${quowarranto.quowarrantoScore}).`,
    };
  }

  const habeas = sanitizeHabeasSession(state.habeasSession);
  const habeasScenario = getHabeasScenarioAtCursor(habeas);
  if (habeas && habeas.active && habeasScenario) {
    return {
      kind: 'habeas_step',
      scenarioId: habeasScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      habeasId: habeas.habeasId,
      habeasCursor: habeas.cursor,
      habeasPhase: habeas.phaseTag,
      habeasScore: habeas.habeasScore,
      reason: `Habeas "${habeas.label}" ${habeas.phaseTag} phase ${habeas.cursor + 1}/${habeas.scenarioIds.length} (score ${habeas.habeasScore}).`,
    };
  }

  const prohibition = sanitizeProhibitionSession(state.prohibitionSession);
  const prohibitionScenario = getProhibitionScenarioAtCursor(prohibition);
  if (prohibition && prohibition.active && prohibitionScenario) {
    return {
      kind: 'prohibition_step',
      scenarioId: prohibitionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      prohibitionId: prohibition.prohibitionId,
      prohibitionCursor: prohibition.cursor,
      prohibitionPhase: prohibition.phaseTag,
      prohibitionScore: prohibition.prohibitionScore,
      reason: `Prohibition "${prohibition.label}" ${prohibition.phaseTag} phase ${prohibition.cursor + 1}/${prohibition.scenarioIds.length} (score ${prohibition.prohibitionScore}).`,
    };
  }

  const mandamus = sanitizeMandamusSession(state.mandamusSession);
  const mandamusScenario = getMandamusScenarioAtCursor(mandamus);
  if (mandamus && mandamus.active && mandamusScenario) {
    return {
      kind: 'mandamus_step',
      scenarioId: mandamusScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      mandamusId: mandamus.mandamusId,
      mandamusCursor: mandamus.cursor,
      mandamusPhase: mandamus.phaseTag,
      mandamusScore: mandamus.mandamusScore,
      reason: `Mandamus "${mandamus.label}" ${mandamus.phaseTag} phase ${mandamus.cursor + 1}/${mandamus.scenarioIds.length} (score ${mandamus.mandamusScore}).`,
    };
  }

  const certiorari = sanitizeCertiorariSession(state.certiorariSession);
  const certiorariScenario = getCertiorariScenarioAtCursor(certiorari);
  if (certiorari && certiorari.active && certiorariScenario) {
    return {
      kind: 'certiorari_step',
      scenarioId: certiorariScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      certiorariId: certiorari.certiorariId,
      certiorariCursor: certiorari.cursor,
      certiorariPhase: certiorari.phaseTag,
      certiorariScore: certiorari.certiorariScore,
      reason: `Certiorari "${certiorari.label}" ${certiorari.phaseTag} phase ${certiorari.cursor + 1}/${certiorari.scenarioIds.length} (score ${certiorari.certiorariScore}).`,
    };
  }

  const supersede = sanitizeSupersedeSession(state.supersedeSession);
  const supersedeScenario = getSupersedeScenarioAtCursor(supersede);
  if (supersede && supersede.active && supersedeScenario) {
    return {
      kind: 'supersede_step',
      scenarioId: supersedeScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      supersedeId: supersede.supersedeId,
      supersedeCursor: supersede.cursor,
      supersedePhase: supersede.phaseTag,
      supersedeScore: supersede.supersedeScore,
      reason: `Supersede "${supersede.label}" ${supersede.phaseTag} phase ${supersede.cursor + 1}/${supersede.scenarioIds.length} (score ${supersede.supersedeScore}).`,
    };
  }

  const quash = sanitizeQuashSession(state.quashSession);
  const quashScenario = getQuashScenarioAtCursor(quash);
  if (quash && quash.active && quashScenario) {
    return {
      kind: 'quash_step',
      scenarioId: quashScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      quashId: quash.quashId,
      quashCursor: quash.cursor,
      quashPhase: quash.phaseTag,
      quashScore: quash.quashScore,
      reason: `Quash "${quash.label}" ${quash.phaseTag} phase ${quash.cursor + 1}/${quash.scenarioIds.length} (score ${quash.quashScore}).`,
    };
  }

  const setAside = sanitizeSetAsideSession(state.setAsideSession);
  const setAsideScenario = getSetAsideScenarioAtCursor(setAside);
  if (setAside && setAside.active && setAsideScenario) {
    return {
      kind: 'setaside_step',
      scenarioId: setAsideScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      setAsideId: setAside.setAsideId,
      setAsideCursor: setAside.cursor,
      setAsidePhase: setAside.phaseTag,
      setAsideScore: setAside.setAsideScore,
      reason: `Set-aside "${setAside.label}" ${setAside.phaseTag} phase ${setAside.cursor + 1}/${setAside.scenarioIds.length} (score ${setAside.setAsideScore}).`,
    };
  }

  const reinstatement = sanitizeReinstatementSession(state.reinstatementSession);
  const reinstatementScenario = getReinstatementScenarioAtCursor(reinstatement);
  if (reinstatement && reinstatement.active && reinstatementScenario) {
    return {
      kind: 'reinstatement_step',
      scenarioId: reinstatementScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reinstatementId: reinstatement.reinstatementId,
      reinstatementCursor: reinstatement.cursor,
      reinstatementPhase: reinstatement.phaseTag,
      reinstatementScore: reinstatement.reinstatementScore,
      reason: `Reinstatement "${reinstatement.label}" ${reinstatement.phaseTag} phase ${reinstatement.cursor + 1}/${reinstatement.scenarioIds.length} (score ${reinstatement.reinstatementScore}).`,
    };
  }

  const annulment = sanitizeAnnulmentSession(state.annulmentSession);
  const annulmentScenario = getAnnulmentScenarioAtCursor(annulment);
  if (annulment && annulment.active && annulmentScenario) {
    return {
      kind: 'annulment_step',
      scenarioId: annulmentScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      annulmentId: annulment.annulmentId,
      annulmentCursor: annulment.cursor,
      annulmentPhase: annulment.phaseTag,
      annulmentScore: annulment.annulmentScore,
      reason: `Annulment "${annulment.label}" ${annulment.phaseTag} phase ${annulment.cursor + 1}/${annulment.scenarioIds.length} (score ${annulment.annulmentScore}).`,
    };
  }

  const reversal = sanitizeReversalSession(state.reversalSession);
  const reversalScenario = getReversalScenarioAtCursor(reversal);
  if (reversal && reversal.active && reversalScenario) {
    return {
      kind: 'reversal_step',
      scenarioId: reversalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reversalId: reversal.reversalId,
      reversalCursor: reversal.cursor,
      reversalPhase: reversal.phaseTag,
      reversalScore: reversal.reversalScore,
      reason: `Reversal "${reversal.label}" ${reversal.phaseTag} phase ${reversal.cursor + 1}/${reversal.scenarioIds.length} (score ${reversal.reversalScore}).`,
    };
  }

  const remand = sanitizeRemandSession(state.remandSession);
  const remandScenario = getRemandScenarioAtCursor(remand);
  if (remand && remand.active && remandScenario) {
    return {
      kind: 'remand_step',
      scenarioId: remandScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      remandId: remand.remandId,
      remandCursor: remand.cursor,
      remandPhase: remand.phaseTag,
      remandWeight: remand.weightScore,
      reason: `Remand "${remand.label}" ${remand.phaseTag} phase ${remand.cursor + 1}/${remand.scenarioIds.length} (weight ${remand.weightScore}).`,
    };
  }

  const vacatur = sanitizeVacaturSession(state.vacaturSession);
  const vacaturScenario = getVacaturScenarioAtCursor(vacatur);
  if (vacatur && vacatur.active && vacaturScenario) {
    return {
      kind: 'vacatur_step',
      scenarioId: vacaturScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      vacaturId: vacatur.vacaturId,
      vacaturCursor: vacatur.cursor,
      vacaturPhase: vacatur.phaseTag,
      vacaturMerit: vacatur.meritScore,
      reason: `Vacatur "${vacatur.label}" ${vacatur.phaseTag} phase ${vacatur.cursor + 1}/${vacatur.scenarioIds.length} (merit ${vacatur.meritScore}).`,
    };
  }

  const expungement = sanitizeExpungementSession(state.expungementSession);
  const expungementScenario = getExpungementScenarioAtCursor(expungement);
  if (expungement && expungement.active && expungementScenario) {
    return {
      kind: 'expungement_step',
      scenarioId: expungementScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      expungementId: expungement.expungementId,
      expungementCursor: expungement.cursor,
      expungementPhase: expungement.phaseTag,
      expungementSeal: expungement.sealScore,
      reason: `Expungement "${expungement.label}" ${expungement.phaseTag} phase ${expungement.cursor + 1}/${expungement.scenarioIds.length} (seal ${expungement.sealScore}).`,
    };
  }

  const exoneration = sanitizeExonerationSession(state.exonerationSession);
  const exonerationScenario = getExonerationScenarioAtCursor(exoneration);
  if (exoneration && exoneration.active && exonerationScenario) {
    return {
      kind: 'exoneration_step',
      scenarioId: exonerationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      exonerationId: exoneration.exonerationId,
      exonerationCursor: exoneration.cursor,
      exonerationPhase: exoneration.phaseTag,
      exonerationRestitution: exoneration.restitutionScore,
      reason: `Exoneration "${exoneration.label}" ${exoneration.phaseTag} phase ${exoneration.cursor + 1}/${exoneration.scenarioIds.length} (restitution ${exoneration.restitutionScore}).`,
    };
  }

  const acquittal = sanitizeAcquittalSession(state.acquittalSession);
  const acquittalScenario = getAcquittalScenarioAtCursor(acquittal);
  if (acquittal && acquittal.active && acquittalScenario) {
    return {
      kind: 'acquittal_step',
      scenarioId: acquittalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      acquittalId: acquittal.acquittalId,
      acquittalCursor: acquittal.cursor,
      acquittalPhase: acquittal.phaseTag,
      acquittalVerdict: acquittal.verdictScore,
      reason: `Acquittal "${acquittal.label}" ${acquittal.phaseTag} phase ${acquittal.cursor + 1}/${acquittal.scenarioIds.length} (verdict ${acquittal.verdictScore}).`,
    };
  }

  const commutation = sanitizeCommutationSession(state.commutationSession);
  const commutationScenario = getCommutationScenarioAtCursor(commutation);
  if (commutation && commutation.active && commutationScenario) {
    return {
      kind: 'commutation_step',
      scenarioId: commutationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      commutationId: commutation.commutationId,
      commutationCursor: commutation.cursor,
      commutationPhase: commutation.phaseTag,
      commutationLeniency: commutation.leniencyScore,
      reason: `Commutation "${commutation.label}" ${commutation.phaseTag} phase ${commutation.cursor + 1}/${commutation.scenarioIds.length} (leniency ${commutation.leniencyScore}).`,
    };
  }

  const probation = sanitizeProbationSession(state.probationSession);
  const probationScenario = getProbationScenarioAtCursor(probation);
  if (probation && probation.active && probationScenario) {
    return {
      kind: 'probation_step',
      scenarioId: probationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      probationId: probation.probationId,
      probationCursor: probation.cursor,
      probationPhase: probation.phaseTag,
      probationCompliance: probation.complianceScore,
      reason: `Probation "${probation.label}" ${probation.phaseTag} phase ${probation.cursor + 1}/${probation.scenarioIds.length} (compliance ${probation.complianceScore}).`,
    };
  }

  const parole = sanitizeParoleSession(state.paroleSession);
  const paroleScenario = getParoleScenarioAtCursor(parole);
  if (parole && parole.active && paroleScenario) {
    return {
      kind: 'parole_step',
      scenarioId: paroleScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      paroleId: parole.paroleId,
      paroleCursor: parole.cursor,
      parolePhase: parole.phaseTag,
      paroleTrust: parole.trustScore,
      reason: `Parole "${parole.label}" ${parole.phaseTag} phase ${parole.cursor + 1}/${parole.scenarioIds.length} (trust ${parole.trustScore}).`,
    };
  }

  const reprieve = sanitizeReprieveSession(state.reprieveSession);
  const reprieveScenario = getReprieveScenarioAtCursor(reprieve);
  if (reprieve && reprieve.active && reprieveScenario) {
    return {
      kind: 'reprieve_step',
      scenarioId: reprieveScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reprieveId: reprieve.reprieveId,
      reprieveCursor: reprieve.cursor,
      reprievePhase: reprieve.phaseTag,
      reprieveRelief: reprieve.reliefScore,
      reason: `Reprieve "${reprieve.label}" ${reprieve.phaseTag} phase ${reprieve.cursor + 1}/${reprieve.scenarioIds.length} (relief ${reprieve.reliefScore}).`,
    };
  }

  const amnesty = sanitizeAmnestySession(state.amnestySession);
  const amnestyScenario = getAmnestyScenarioAtCursor(amnesty);
  if (amnesty && amnesty.active && amnestyScenario) {
    return {
      kind: 'amnesty_step',
      scenarioId: amnestyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      amnestyId: amnesty.amnestyId,
      amnestyCursor: amnesty.cursor,
      amnestyPhase: amnesty.phaseTag,
      amnestyAbsolution: amnesty.absolutionScore,
      reason: `Amnesty "${amnesty.label}" ${amnesty.phaseTag} phase ${amnesty.cursor + 1}/${amnesty.scenarioIds.length} (absolution ${amnesty.absolutionScore}).`,
    };
  }

  const pardon = sanitizePardonSession(state.pardonSession);
  const pardonScenario = getPardonScenarioAtCursor(pardon);
  if (pardon && pardon.active && pardonScenario) {
    return {
      kind: 'pardon_step',
      scenarioId: pardonScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      pardonId: pardon.pardonId,
      pardonCursor: pardon.cursor,
      pardonPhase: pardon.phaseTag,
      pardonGrace: pardon.graceScore,
      reason: `Pardon "${pardon.label}" ${pardon.phaseTag} phase ${pardon.cursor + 1}/${pardon.scenarioIds.length} (grace ${pardon.graceScore}).`,
    };
  }

  const clemency = sanitizeClemencySession(state.clemencySession);
  const clemencyScenario = getClemencyScenarioAtCursor(clemency);
  if (clemency && clemency.active && clemencyScenario) {
    return {
      kind: 'clemency_step',
      scenarioId: clemencyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      clemencyId: clemency.clemencyId,
      clemencyCursor: clemency.cursor,
      clemencyPhase: clemency.phaseTag,
      clemencyMercy: clemency.mercyScore,
      reason: `Clemency "${clemency.label}" ${clemency.phaseTag} phase ${clemency.cursor + 1}/${clemency.scenarioIds.length} (mercy ${clemency.mercyScore}).`,
    };
  }

  const appeal = sanitizeAppealSession(state.appealSession);
  const appealScenario = getAppealScenarioAtCursor(appeal);
  if (appeal && appeal.active && appealScenario) {
    return {
      kind: 'appeal_step',
      scenarioId: appealScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      appealId: appeal.appealId,
      appealCursor: appeal.cursor,
      appealPhase: appeal.phaseTag,
      appealMerit: appeal.meritScore,
      reason: `Appeal "${appeal.label}" ${appeal.phaseTag} phase ${appeal.cursor + 1}/${appeal.scenarioIds.length} (merit ${appeal.meritScore}).`,
    };
  }

  const indictment = sanitizeIndictmentSession(state.indictmentSession);
  const indictmentScenario = getIndictmentScenarioAtCursor(indictment);
  if (indictment && indictment.active && indictmentScenario) {
    return {
      kind: 'indictment_step',
      scenarioId: indictmentScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      indictmentId: indictment.indictmentId,
      indictmentCursor: indictment.cursor,
      indictmentPhase: indictment.phaseTag,
      indictmentCaseWeight: indictment.caseWeightScore,
      reason: `Indictment "${indictment.label}" ${indictment.phaseTag} phase ${indictment.cursor + 1}/${indictment.scenarioIds.length} (case weight ${indictment.caseWeightScore}).`,
    };
  }

  const tribunal = sanitizeTribunalSession(state.tribunalSession);
  const tribunalScenario = getTribunalScenarioAtCursor(tribunal);
  if (tribunal && tribunal.active && tribunalScenario) {
    return {
      kind: 'tribunal_step',
      scenarioId: tribunalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      tribunalId: tribunal.tribunalId,
      tribunalCursor: tribunal.cursor,
      tribunalPhase: tribunal.phaseTag,
      tribunalGravitas: tribunal.gravitasScore,
      reason: `Tribunal "${tribunal.label}" ${tribunal.phaseTag} phase ${tribunal.cursor + 1}/${tribunal.scenarioIds.length} (gravitas ${tribunal.gravitasScore}).`,
    };
  }

  const witness = sanitizeWitnessSession(state.witnessSession);
  const witnessScenario = getWitnessScenarioAtCursor(witness);
  if (witness && witness.active && witnessScenario) {
    return {
      kind: 'witness_step',
      scenarioId: witnessScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      witnessId: witness.witnessId,
      witnessCursor: witness.cursor,
      witnessPhase: witness.phaseTag,
      witnessCredibility: witness.credibilityScore,
      reason: `Witness "${witness.label}" ${witness.phaseTag} phase ${witness.cursor + 1}/${witness.scenarioIds.length} (credibility ${witness.credibilityScore}).`,
    };
  }

  const subject = sanitizeSubjectSession(state.subjectSession);
  const subjectScenario = getSubjectScenarioAtCursor(subject);
  if (subject && subject.active && subjectScenario) {
    return {
      kind: 'subject_step',
      scenarioId: subjectScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      subjectId: subject.subjectId,
      subjectCursor: subject.cursor,
      subjectPhase: subject.phaseTag,
      subjectFidelity: subject.fidelityScore,
      reason: `Subject "${subject.label}" ${subject.phaseTag} phase ${subject.cursor + 1}/${subject.scenarioIds.length} (fidelity ${subject.fidelityScore}).`,
    };
  }

  const extraction = sanitizeExtractionSession(state.extractionSession);
  const extractionScenario = getExtractionScenarioAtCursor(extraction);
  if (extraction && extraction.active && extractionScenario) {
    return {
      kind: 'extraction_step',
      scenarioId: extractionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      extractionId: extraction.extractionId,
      extractionCursor: extraction.cursor,
      extractionPhase: extraction.phaseTag,
      extractionAssets: extraction.assetScore,
      reason: `Extraction "${extraction.label}" ${extraction.phaseTag} phase ${extraction.cursor + 1}/${extraction.scenarioIds.length} (assets ${extraction.assetScore}).`,
    };
  }

  const escort = sanitizeEscortSession(state.escortSession);
  const escortScenario = getEscortScenarioAtCursor(escort);
  if (escort && escort.active && escortScenario) {
    return {
      kind: 'escort_step',
      scenarioId: escortScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      escortId: escort.escortId,
      escortCursor: escort.cursor,
      escortPhase: escort.phaseTag,
      escortTrust: escort.trustScore,
      reason: `Escort "${escort.label}" ${escort.phaseTag} phase ${escort.cursor + 1}/${escort.scenarioIds.length} (trust ${escort.trustScore}).`,
    };
  }

  const convoy = sanitizeConvoySession(state.convoySession);
  const convoyScenario = getConvoyScenarioAtCursor(convoy);
  if (convoy && convoy.active && convoyScenario) {
    return {
      kind: 'convoy_step',
      scenarioId: convoyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      convoyId: convoy.convoyId,
      convoyCursor: convoy.cursor,
      convoyStage: convoy.stageTag,
      convoyHaul: convoy.haulScore,
      reason: `Convoy "${convoy.label}" ${convoy.stageTag} stage ${convoy.cursor + 1}/${convoy.scenarioIds.length} (haul ${convoy.haulScore}).`,
    };
  }

  const siege = sanitizeSiegeSession(state.siegeSession);
  const siegeScenario = getSiegeScenarioAtCursor(siege);
  if (siege && siege.active && siegeScenario) {
    return {
      kind: 'siege_step',
      scenarioId: siegeScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      siegeId: siege.siegeId,
      siegeCursor: siege.cursor,
      siegePhase: siege.phaseTag,
      siegeMorale: siege.moraleScore,
      reason: `Siege "${siege.label}" ${siege.phaseTag} phase ${siege.cursor + 1}/${siege.scenarioIds.length} (morale ${siege.moraleScore}).`,
    };
  }

  const voyage = sanitizeVoyageSession(state.voyageSession);
  const voyageScenario = getVoyageScenarioAtCursor(voyage);
  if (voyage && voyage.active && voyageScenario) {
    return {
      kind: 'voyage_step',
      scenarioId: voyageScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      voyageId: voyage.voyageId,
      voyageCursor: voyage.cursor,
      voyageSegment: voyage.segmentTag,
      voyageChart: voyage.chartScore,
      reason: `Voyage "${voyage.label}" ${voyage.segmentTag} segment ${voyage.cursor + 1}/${voyage.scenarioIds.length} (chart ${voyage.chartScore}).`,
    };
  }

  const caravan = sanitizeCaravanSession(state.caravanSession);
  const caravanScenario = getCaravanScenarioAtCursor(caravan);
  if (caravan && caravan.active && caravanScenario) {
    return {
      kind: 'caravan_step',
      scenarioId: caravanScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      caravanId: caravan.caravanId,
      caravanCursor: caravan.cursor,
      caravanLeg: caravan.legTag,
      caravanCargo: caravan.cargoScore,
      reason: `Caravan "${caravan.label}" ${caravan.legTag} leg ${caravan.cursor + 1}/${caravan.scenarioIds.length} (cargo ${caravan.cargoScore}).`,
    };
  }

  const pilgrimage = sanitizePilgrimageSession(state.pilgrimageSession);
  const pilgrimageScenario = getPilgrimageScenarioAtCursor(pilgrimage);
  if (pilgrimage && pilgrimage.active && pilgrimageScenario) {
    return {
      kind: 'pilgrimage_step',
      scenarioId: pilgrimageScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      pilgrimageId: pilgrimage.pilgrimageId,
      pilgrimageCursor: pilgrimage.cursor,
      pilgrimageStage: pilgrimage.stageTag,
      pilgrimageDevotion: pilgrimage.devotionScore,
      reason: `Pilgrimage "${pilgrimage.label}" ${pilgrimage.stageTag} stop ${pilgrimage.cursor + 1}/${pilgrimage.scenarioIds.length} (devotion ${pilgrimage.devotionScore}).`,
    };
  }

  const odyssey = sanitizeOdysseySession(state.odysseySession);
  const odysseyScenario = getOdysseyScenarioAtCursor(odyssey);
  if (odyssey && odyssey.active && odysseyScenario) {
    return {
      kind: 'odyssey_step',
      scenarioId: odysseyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      odysseyId: odyssey.odysseyId,
      odysseyCursor: odyssey.cursor,
      odysseyAct: odyssey.actTag,
      odysseyRenown: odyssey.renownScore,
      reason: `Odyssey "${odyssey.label}" ${odyssey.actTag} chapter ${odyssey.cursor + 1}/${odyssey.scenarioIds.length} (renown ${odyssey.renownScore}).`,
    };
  }

  const expedition = sanitizeExpeditionSession(state.expeditionSession);
  const expeditionScenario = getExpeditionScenarioAtCursor(expedition);
  if (expedition && expedition.active && expeditionScenario) {
    return {
      kind: 'expedition_step',
      scenarioId: expeditionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      expeditionId: expedition.expeditionId,
      expeditionCursor: expedition.cursor,
      expeditionLeg: expedition.legTag,
      expeditionSupply: expedition.supplyScore,
      reason: `Expedition "${expedition.label}" ${expedition.legTag} waypoint ${expedition.cursor + 1}/${expedition.scenarioIds.length} (supply ${expedition.supplyScore}).`,
    };
  }

  const circuit = sanitizeCircuitSession(state.circuitSession);
  const circuitScenario = getCircuitScenarioAtCursor(circuit);
  if (circuit && circuit.active && circuitScenario) {
    return {
      kind: 'circuit_step',
      scenarioId: circuitScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      circuitId: circuit.circuitId,
      circuitCursor: circuit.cursor,
      circuitPhase: circuit.phaseTag,
      circuitMomentum: circuit.momentumScore,
      reason: `Circuit "${circuit.label}" ${circuit.phaseTag} leg ${circuit.cursor + 1}/${circuit.scenarioIds.length} (momentum ${circuit.momentumScore}).`,
    };
  }

  const relay = sanitizeRelaySession(state.relaySession);
  const relayScenario = getRelayScenarioAtCursor(relay);
  if (relay && relay.active && relayScenario) {
    const carryMoney = relay.legCarry.startingMoneyDelta ?? 0;
    return {
      kind: 'relay_step',
      scenarioId: relayScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      relayId: relay.relayId,
      relayCursor: relay.cursor,
      relayCarryMoney: carryMoney,
      reason: `Relay "${relay.label}" leg ${relay.cursor + 1}/${relay.scenarioIds.length} (+$${carryMoney} carry).`,
    };
  }

  const gauntlet = sanitizeGauntletSession(state.gauntletSession);
  const gauntletScenario = getGauntletScenarioAtCursor(gauntlet);
  if (gauntlet && gauntlet.active && gauntletScenario) {
    return {
      kind: 'gauntlet_step',
      scenarioId: gauntletScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      gauntletId: gauntlet.gauntletId,
      gauntletCursor: gauntlet.cursor,
      gauntletLives: gauntlet.livesRemaining,
      reason: `Gauntlet "${gauntlet.label}" step ${gauntlet.cursor + 1}/${gauntlet.scenarioIds.length} (${gauntlet.livesRemaining} lives).`,
    };
  }

  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const marathonScenario = getMarathonScenarioAtCursor(marathon);
  if (marathon && marathon.active && marathonScenario) {
    return {
      kind: 'marathon_step',
      scenarioId: marathonScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      marathonQueueId: marathon.queueId,
      marathonCursor: marathon.cursor,
      reason: `Marathon "${marathon.label}" step ${marathon.cursor + 1}/${marathon.scenarioIds.length}.`,
    };
  }

  if (state.activeCampaignSlotId) {
    const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === state.activeCampaignSlotId);
    if (slot?.scenarioId) {
      return {
        kind: 'slot_resume',
        scenarioId: slot.scenarioId,
        chainId: slot.chainId,
        chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
        slotId: slot.slotId,
        ...emptyQueuePlan,
        reason: `Resume pinned slot "${slot.label}".`,
      };
    }
  }

  if (state.chainProgress && !state.chainProgress.chainCompleted) {
    const chain = getO10mScenarioChain(state.chainProgress.chainId);
    const step = chain?.steps.find(s => s.stepIndex === state.chainProgress!.activeStepIndex);
    if (step) {
      return {
        kind: 'chain_step',
        scenarioId: step.scenarioId,
        chainId: state.chainProgress.chainId,
        chainStepIndex: step.stepIndex,
        slotId: null,
        ...emptyQueuePlan,
        reason: `Continue chain "${chain?.title ?? state.chainProgress.chainId}" at step ${step.stepIndex + 1}.`,
      };
    }
  }

  if (state.scenarioId && findO10mScenario(state.scenarioId)) {
    const ratio = objectiveProgressCompletionRatio(state, state.scenarioId);
    return {
      kind: 'free_play',
      scenarioId: state.scenarioId,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: null,
      ...emptyQueuePlan,
      reason:
        ratio > 0 && ratio < 1
          ? `Resume in-progress scenario (${Math.round(ratio * 100)}% objectives captured).`
          : 'Continue last selected scenario.',
    };
  }

  return {
    kind: 'free_play',
    scenarioId: null,
    chainId: null,
    chainStepIndex: null,
    slotId: null,
    ...emptyQueuePlan,
    reason: 'No active chain, slot, or scenario — pick from catalog.',
  };
}

export function rankCampaignSlotsByRecency(state: O10mModesPersistedState): string[] {
  return sanitizeCampaignSlots(state.campaignSlots)
    .sort((a, b) => b.pinnedAtTurn - a.pinnedAtTurn)
    .map(s => s.slotId);
}

export function campaignProgressSummary(state: O10mModesPersistedState): {
  completedChains: number;
  recentVictories: number;
  activeChainTitle: string | null;
  marathonActive: boolean;
  gauntletActive: boolean;
  relayActive: boolean;
  circuitActive: boolean;
  expeditionActive: boolean;
  odysseyActive: boolean;
  pilgrimageActive: boolean;
  caravanActive: boolean;
  voyageActive: boolean;
  siegeActive: boolean;
  convoyActive: boolean;
  escortActive: boolean;
  extractionActive: boolean;
  subjectActive: boolean;
  witnessActive: boolean;
  tribunalActive: boolean;
  indictmentActive: boolean;
  appealActive: boolean;
  clemencyActive: boolean;
  pardonActive: boolean;
  amnestyActive: boolean;
  reprieveActive: boolean;
  paroleActive: boolean;
  probationActive: boolean;
  commutationActive: boolean;
  acquittalActive: boolean;
  exonerationActive: boolean;
  expungementActive: boolean;
  vacaturActive: boolean;
  remandActive: boolean;
  reversalActive: boolean;
  annulmentActive: boolean;
  reinstatementActive: boolean;
  setAsideActive: boolean;
  quashActive: boolean;
  supersedeActive: boolean;
  certiorariActive: boolean;
  mandamusActive: boolean;
  prohibitionActive: boolean;
  habeasActive: boolean;
  quowarrantoActive: boolean;
  injunctionActive: boolean;
  replayTracked: number;
  unlockTokens: number;
  nextPlan: O10mCampaignPlan;
} {
  const nextPlan = planNextCampaignAction(state);
  const chain = state.chainProgress ? getO10mScenarioChain(state.chainProgress.chainId) : undefined;
  const recentVictories = state.recentRuns.filter(r => r.primaryVictory).length;
  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const gauntlet = gauntletSessionSummary(state);
  const relay = relaySessionSummary(state);
  const circuit = circuitSessionSummary(state);
  const expedition = expeditionSessionSummary(state);
  const odyssey = odysseySessionSummary(state);
  const pilgrimage = pilgrimageSessionSummary(state);
  const caravan = caravanSessionSummary(state);
  const voyage = voyageSessionSummary(state);
  const siege = siegeSessionSummary(state);
  const convoy = convoySessionSummary(state);
  const escort = escortSessionSummary(state);
  const extraction = extractionSessionSummary(state);
  const subject = subjectSessionSummary(state);
  const witness = witnessSessionSummary(state);
  const tribunal = tribunalSessionSummary(state);
  const indictment = indictmentSessionSummary(state);
  const appeal = appealSessionSummary(state);
  const clemency = clemencySessionSummary(state);
  const pardon = pardonSessionSummary(state);
  const amnesty = amnestySessionSummary(state);
  const reprieve = reprieveSessionSummary(state);
  const parole = paroleSessionSummary(state);
  const probation = probationSessionSummary(state);
  const commutation = commutationSessionSummary(state);
  const acquittal = acquittalSessionSummary(state);
  const exoneration = exonerationSessionSummary(state);
  const expungement = expungementSessionSummary(state);
  const vacatur = vacaturSessionSummary(state);
  const remand = remandSessionSummary(state);
  const reversal = reversalSessionSummary(state);
  const annulment = annulmentSessionSummary(state);
  const reinstatement = reinstatementSessionSummary(state);
  const setAside = setAsideSessionSummary(state);
  const quash = quashSessionSummary(state);
  const supersede = supersedeSessionSummary(state);
  const certiorari = certiorariSessionSummary(state);
  const mandamus = mandamusSessionSummary(state);
  const prohibition = prohibitionSessionSummary(state);
  const habeas = habeasSessionSummary(state);
  const quowarranto = quowarrantoSessionSummary(state);
  const injunction = injunctionSessionSummary(state);
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  return {
    completedChains: state.completedChainIds.length,
    recentVictories,
    activeChainTitle: chain?.title ?? null,
    marathonActive: marathon?.active === true,
    gauntletActive: gauntlet.active,
    relayActive: relay.active,
    circuitActive: circuit.active,
    expeditionActive: expedition.active,
    odysseyActive: odyssey.active,
    pilgrimageActive: pilgrimage.active,
    caravanActive: caravan.active,
    voyageActive: voyage.active,
    siegeActive: siege.active,
    convoyActive: convoy.active,
    escortActive: escort.active,
    extractionActive: extraction.active,
    subjectActive: subject.active,
    witnessActive: witness.active,
    tribunalActive: tribunal.active,
    indictmentActive: indictment.active,
    appealActive: appeal.active,
    clemencyActive: clemency.active,
    pardonActive: pardon.active,
    amnestyActive: amnesty.active,
    reprieveActive: reprieve.active,
    paroleActive: parole.active,
    probationActive: probation.active,
    commutationActive: commutation.active,
    acquittalActive: acquittal.active,
    exonerationActive: exoneration.active,
    expungementActive: expungement.active,
    vacaturActive: vacatur.active,
    remandActive: remand.active,
    reversalActive: reversal.active,
    annulmentActive: annulment.active,
    reinstatementActive: reinstatement.active,
    setAsideActive: setAside.active,
    quashActive: quash.active,
    supersedeActive: supersede.active,
    certiorariActive: certiorari.active,
    mandamusActive: mandamus.active,
    prohibitionActive: prohibition.active,
    habeasActive: habeas.active,
    quowarrantoActive: quowarranto.active,
    injunctionActive: injunction.active,
    replayTracked: (state.replayLedger ?? []).length,
    unlockTokens: tokens.length,
    nextPlan,
  };
}


/** Agent 25 — smoke self-tests (subset of agent-04 npm test). */
export function runAgent04ModesScenariosSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent04_chunk_01', CANONICAL_GAME_MODE_SELECTIONS.length === 6, String(CANONICAL_GAME_MODE_SELECTIONS.length));
  push('agent04_chunk_02', O10M_OPERATION_SCENARIOS.length >= 25, String(O10M_OPERATION_SCENARIOS.length));
  push('agent04_chunk_03', O10M_SCENARIO_CHAINS.length === 47, String(O10M_SCENARIO_CHAINS.length));
  push('agent04_chunk_04', O10M_SANDBOX_KNOB_PROFILES.length >= 4, String(O10M_SANDBOX_KNOB_PROFILES.length));
  push('agent04_chunk_08', O10M_CHALLENGE_MODES.length >= 5, String(O10M_CHALLENGE_MODES.length));
  const audit = runO10mContentAudit();
  push('agent04_chunk_09', audit.isClean, summarizeContentAudit(audit));

  const modeOk = resolveModeInteraction({
    baseMode: 'scenario',
    scenarioId: 'o10m_silent_diplomat',
    challengeModeIds: ['o10m_ironman'],
    scenarioModeEnabled: true,
  });
  push('agent04_chunk_05', modeOk.ok, modeOk.errors.join('; ') || undefined);

  const chainProgress = initializeChainProgress('o10m_chain_northern_corridor');
  push('agent04_chunk_06', chainProgress !== null && chainProgress.activeStepIndex === 0);

  const merged = mergePlayableScenarioCatalog([{ id: 'outback_siege' } as ScenarioDefinition]);
  push('agent04_chunk_07', merged.collisionIds.length === 0 && merged.o10mIds.length === O10M_OPERATION_SCENARIOS.length);

  const saveRoundTrip = sanitizeO10mModesPersistedState(
    attachO10mModesProgressToGameState({}, createEmptyO10mModesPersistedState()).o10mModesProgress,
  );
  push('agent04_chunk_10', saveRoundTrip !== null && saveRoundTrip.schemaVersion === O10M_MODES_SAVE_SCHEMA_VERSION);
  const sealed = sealO10mModesPersistedState(createEmptyO10mModesPersistedState());
  push('agent04_chunk_11', verifyO10mModesIntegrity(sealed));
  const plan = planNextCampaignAction(createEmptyO10mModesPersistedState());
  push('agent04_chunk_12', plan.kind === 'free_play' && plan.reason.length > 0);
  const marathon = createMarathonQueue({
    queueId: 'o10m_marathon_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_marathon_pace_setter'],
  }).queue;
  const marathonState = marathon ? attachMarathonQueueToState(createEmptyO10mModesPersistedState(), marathon) : null;
  push('agent04_chunk_13', marathonState !== null && planNextCampaignAction(marathonState!).kind === 'marathon_step');

  const gauntlet = createGauntletSession({
    gauntletId: 'o10m_gauntlet_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_gauntlet_opening_gate'],
  }).session;
  const gauntletState = gauntlet ? attachGauntletSessionToState(createEmptyO10mModesPersistedState(), gauntlet) : null;
  push('agent04_chunk_14', gauntletState !== null && planNextCampaignAction(gauntletState!).kind === 'gauntlet_step');

  const relay = createRelaySession({
    relayId: 'o10m_relay_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_relay_dust_corridor'],
  }).session;
  const relayState = relay ? attachRelaySessionToState(createEmptyO10mModesPersistedState(), relay) : null;
  push('agent04_chunk_15', relayState !== null && planNextCampaignAction(relayState!).kind === 'relay_step');

  const circuit = createCircuitSession({
    circuitId: 'o10m_circuit_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_circuit_warmup_laps'],
  }).session;
  const circuitState = circuit ? attachCircuitSessionToState(createEmptyO10mModesPersistedState(), circuit) : null;
  push('agent04_chunk_16', circuitState !== null && planNextCampaignAction(circuitState!).kind === 'circuit_step');

  const expedition = createExpeditionSession({
    expeditionId: 'o10m_expedition_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_expedition_departure_dock'],
  }).session;
  const expeditionState = expedition ? attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), expedition) : null;
  push('agent04_chunk_17', expeditionState !== null && planNextCampaignAction(expeditionState!).kind === 'expedition_step');

  const odyssey = createOdysseySession({
    odysseyId: 'o10m_odyssey_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_odyssey_opening_winds'],
  }).session;
  const odysseyState = odyssey ? attachOdysseySessionToState(createEmptyO10mModesPersistedState(), odyssey) : null;
  push('agent04_chunk_18', odysseyState !== null && planNextCampaignAction(odysseyState!).kind === 'odyssey_step');

  const pilgrimage = createPilgrimageSession({
    pilgrimageId: 'o10m_pilgrimage_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_pilgrimage_setting_out'],
  }).session;
  const pilgrimageState = pilgrimage ? attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), pilgrimage) : null;
  push('agent04_chunk_19', pilgrimageState !== null && planNextCampaignAction(pilgrimageState!).kind === 'pilgrimage_step');

  const caravan = createCaravanSession({
    caravanId: 'o10m_caravan_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_caravan_assembly_yard'],
  }).session;
  const caravanState = caravan ? attachCaravanSessionToState(createEmptyO10mModesPersistedState(), caravan) : null;
  push('agent04_chunk_20', caravanState !== null && planNextCampaignAction(caravanState!).kind === 'caravan_step');

  const voyage = createVoyageSession({
    voyageId: 'o10m_voyage_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_voyage_embark_pier'],
  }).session;
  const voyageState = voyage ? attachVoyageSessionToState(createEmptyO10mModesPersistedState(), voyage) : null;
  push('agent04_chunk_21', voyageState !== null && planNextCampaignAction(voyageState!).kind === 'voyage_step');

  const siege = createSiegeSession({
    siegeId: 'o10m_siege_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_siege_mustering_yard'],
  }).session;
  const siegeState = siege ? attachSiegeSessionToState(createEmptyO10mModesPersistedState(), siege) : null;
  push('agent04_chunk_22', siegeState !== null && planNextCampaignAction(siegeState!).kind === 'siege_step');

  const convoy = createConvoySession({
    convoyId: 'o10m_convoy_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_convoy_staging_depot'],
  }).session;
  const convoyState = convoy ? attachConvoySessionToState(createEmptyO10mModesPersistedState(), convoy) : null;
  push('agent04_chunk_23', convoyState !== null && planNextCampaignAction(convoyState!).kind === 'convoy_step');

  const escort = createEscortSession({
    escortId: 'o10m_escort_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_escort_briefing_yard'],
  }).session;
  const escortState = escort ? attachEscortSessionToState(createEmptyO10mModesPersistedState(), escort) : null;
  push('agent04_chunk_24', escortState !== null && planNextCampaignAction(escortState!).kind === 'escort_step');

  const extraction = createExtractionSession({
    extractionId: 'o10m_extraction_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_extraction_intel_brief'],
  }).session;
  const extractionState = extraction ? attachExtractionSessionToState(createEmptyO10mModesPersistedState(), extraction) : null;
  push('agent04_chunk_25', extractionState !== null && planNextCampaignAction(extractionState!).kind === 'extraction_step');

  const subject = createSubjectSession({
    subjectId: 'o10m_subject_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_subject_intake_brief'],
  }).session;
  const subjectState = subject ? attachSubjectSessionToState(createEmptyO10mModesPersistedState(), subject) : null;
  push('agent04_chunk_26', subjectState !== null && planNextCampaignAction(subjectState!).kind === 'subject_step');

  const witness = createWitnessSession({
    witnessId: 'o10m_witness_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_witness_brief_room'],
  }).session;
  const witnessState = witness ? attachWitnessSessionToState(createEmptyO10mModesPersistedState(), witness) : null;
  push('agent04_chunk_27', witnessState !== null && planNextCampaignAction(witnessState!).kind === 'witness_step');

  const tribunal = createTribunalSession({
    tribunalId: 'o10m_tribunal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_tribunal_docket_brief'],
  }).session;
  const tribunalState = tribunal ? attachTribunalSessionToState(createEmptyO10mModesPersistedState(), tribunal) : null;
  push('agent04_chunk_28', tribunalState !== null && planNextCampaignAction(tribunalState!).kind === 'tribunal_step');

  const indictment = createIndictmentSession({
    indictmentId: 'o10m_indictment_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_indictment_charge_docket'],
  }).session;
  const indictmentState = indictment ? attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), indictment) : null;
  push('agent04_chunk_29', indictmentState !== null && planNextCampaignAction(indictmentState!).kind === 'indictment_step');

  const appeal = createAppealSession({
    appealId: 'o10m_appeal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_appeal_petition_filing'],
  }).session;
  const appealState = appeal ? attachAppealSessionToState(createEmptyO10mModesPersistedState(), appeal) : null;
  push('agent04_chunk_30', appealState !== null && planNextCampaignAction(appealState!).kind === 'appeal_step');

  const clemency = createClemencySession({
    clemencyId: 'o10m_clemency_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_clemency_plea_docket'],
  }).session;
  const clemencyState = clemency ? attachClemencySessionToState(createEmptyO10mModesPersistedState(), clemency) : null;
  push('agent04_chunk_31', clemencyState !== null && planNextCampaignAction(clemencyState!).kind === 'clemency_step');

  const pardon = createPardonSession({
    pardonId: 'o10m_pardon_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_pardon_brief_docket'],
  }).session;
  const pardonState = pardon ? attachPardonSessionToState(createEmptyO10mModesPersistedState(), pardon) : null;
  push('agent04_chunk_32', pardonState !== null && planNextCampaignAction(pardonState!).kind === 'pardon_step');

  const amnesty = createAmnestySession({
    amnestyId: 'o10m_amnesty_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_amnesty_warrant_docket'],
  }).session;
  const amnestyState = amnesty ? attachAmnestySessionToState(createEmptyO10mModesPersistedState(), amnesty) : null;
  push('agent04_chunk_33', amnestyState !== null && planNextCampaignAction(amnestyState!).kind === 'amnesty_step');

  const reprieve = createReprieveSession({
    reprieveId: 'o10m_reprieve_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_reprieve_filing_docket'],
  }).session;
  const reprieveState = reprieve ? attachReprieveSessionToState(createEmptyO10mModesPersistedState(), reprieve) : null;
  push('agent04_chunk_34', reprieveState !== null && planNextCampaignAction(reprieveState!).kind === 'reprieve_step');

  const parole = createParoleSession({
    paroleId: 'o10m_parole_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_parole_intake_docket'],
  }).session;
  const paroleState = parole ? attachParoleSessionToState(createEmptyO10mModesPersistedState(), parole) : null;
  push('agent04_chunk_35', paroleState !== null && planNextCampaignAction(paroleState!).kind === 'parole_step');

  const probation = createProbationSession({
    probationId: 'o10m_probation_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_probation_enrollment_docket'],
  }).session;
  const probationState = probation ? attachProbationSessionToState(createEmptyO10mModesPersistedState(), probation) : null;
  push('agent04_chunk_36', probationState !== null && planNextCampaignAction(probationState!).kind === 'probation_step');

  const commutation = createCommutationSession({
    commutationId: 'o10m_commutation_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_commutation_petition_docket'],
  }).session;
  const commutationState = commutation ? attachCommutationSessionToState(createEmptyO10mModesPersistedState(), commutation) : null;
  push('agent04_chunk_37', commutationState !== null && planNextCampaignAction(commutationState!).kind === 'commutation_step');

  const acquittal = createAcquittalSession({
    acquittalId: 'o10m_acquittal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_acquittal_brief_docket'],
  }).session;
  const acquittalState = acquittal ? attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), acquittal) : null;
  push('agent04_chunk_38', acquittalState !== null && planNextCampaignAction(acquittalState!).kind === 'acquittal_step');

  const exoneration = createExonerationSession({
    exonerationId: 'o10m_exoneration_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_exoneration_claim_docket'],
  }).session;
  const exonerationState = exoneration ? attachExonerationSessionToState(createEmptyO10mModesPersistedState(), exoneration) : null;
  push('agent04_chunk_39', exonerationState !== null && planNextCampaignAction(exonerationState!).kind === 'exoneration_step');

  const expungement = createExpungementSession({
    expungementId: 'o10m_expungement_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_expungement_filing_docket'],
  }).session;
  const expungementState = expungement ? attachExpungementSessionToState(createEmptyO10mModesPersistedState(), expungement) : null;
  push('agent04_chunk_40', expungementState !== null && planNextCampaignAction(expungementState!).kind === 'expungement_step');

  const vacatur = createVacaturSession({
    vacaturId: 'o10m_vacatur_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_vacatur_petition_docket'],
  }).session;
  const vacaturState = vacatur ? attachVacaturSessionToState(createEmptyO10mModesPersistedState(), vacatur) : null;
  push('agent04_chunk_41', vacaturState !== null && planNextCampaignAction(vacaturState!).kind === 'vacatur_step');

  const remand = createRemandSession({
    remandId: 'o10m_remand_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_remand_order_docket'],
  }).session;
  const remandState = remand ? attachRemandSessionToState(createEmptyO10mModesPersistedState(), remand) : null;
  push('agent04_chunk_42', remandState !== null && planNextCampaignAction(remandState!).kind === 'remand_step');

  const reversal = createReversalSession({
    reversalId: 'o10m_reversal_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_reversal_motion_docket'],
  }).session;
  const reversalState = reversal ? attachReversalSessionToState(createEmptyO10mModesPersistedState(), reversal) : null;
  push('agent04_chunk_43', reversalState !== null && planNextCampaignAction(reversalState!).kind === 'reversal_step');

  const annulment = createAnnulmentSession({
    annulmentId: 'o10m_annulment_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_annulment_filing_docket'],
  }).session;
  const annulmentState = annulment ? attachAnnulmentSessionToState(createEmptyO10mModesPersistedState(), annulment) : null;
  push('agent04_chunk_44', annulmentState !== null && planNextCampaignAction(annulmentState!).kind === 'annulment_step');

  const reinstatement = createReinstatementSession({
    reinstatementId: 'o10m_reinstatement_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_reinstatement_filing_docket'],
  }).session;
  const reinstatementState = reinstatement ? attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), reinstatement) : null;
  push('agent04_chunk_45', reinstatementState !== null && planNextCampaignAction(reinstatementState!).kind === 'reinstatement_step');

  const setAside = createSetAsideSession({
    setAsideId: 'o10m_setaside_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_setaside_filing_docket'],
  }).session;
  const setAsideState = setAside ? attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), setAside) : null;
  push('agent04_chunk_46', setAsideState !== null && planNextCampaignAction(setAsideState!).kind === 'setaside_step');

  const quash = createQuashSession({
    quashId: 'o10m_quash_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_quash_filing_docket'],
  }).session;
  const quashState = quash ? attachQuashSessionToState(createEmptyO10mModesPersistedState(), quash) : null;
  push('agent04_chunk_47', quashState !== null && planNextCampaignAction(quashState!).kind === 'quash_step');

  const supersede = createSupersedeSession({
    supersedeId: 'o10m_supersede_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_supersede_filing_docket'],
  }).session;
  const supersedeState = supersede ? attachSupersedeSessionToState(createEmptyO10mModesPersistedState(), supersede) : null;
  push('agent04_chunk_48', supersedeState !== null && planNextCampaignAction(supersedeState!).kind === 'supersede_step');

  const certiorari = createCertiorariSession({
    certiorariId: 'o10m_certiorari_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_certiorari_filing_docket'],
  }).session;
  const certiorariState = certiorari ? attachCertiorariSessionToState(createEmptyO10mModesPersistedState(), certiorari) : null;
  push('agent04_chunk_49', certiorariState !== null && planNextCampaignAction(certiorariState!).kind === 'certiorari_step');

  const mandamus = createMandamusSession({
    mandamusId: 'o10m_mandamus_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_mandamus_filing_docket'],
  }).session;
  const mandamusState = mandamus ? attachMandamusSessionToState(createEmptyO10mModesPersistedState(), mandamus) : null;
  push('agent04_chunk_50', mandamusState !== null && planNextCampaignAction(mandamusState!).kind === 'mandamus_step');

  const prohibition = createProhibitionSession({
    prohibitionId: 'o10m_prohibition_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_prohibition_filing_docket'],
  }).session;
  const prohibitionState = prohibition ? attachProhibitionSessionToState(createEmptyO10mModesPersistedState(), prohibition) : null;
  push('agent04_chunk_51', prohibitionState !== null && planNextCampaignAction(prohibitionState!).kind === 'prohibition_step');

  const habeas = createHabeasSession({
    habeasId: 'o10m_habeas_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_habeas_filing_docket'],
  }).session;
  const habeasState = habeas ? attachHabeasSessionToState(createEmptyO10mModesPersistedState(), habeas) : null;
  push('agent04_chunk_52', habeasState !== null && planNextCampaignAction(habeasState!).kind === 'habeas_step');

  const quowarranto = createQuowarrantoSession({
    quowarrantoId: 'o10m_quowarranto_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_quowarranto_filing_docket'],
  }).session;
  const quowarrantoState = quowarranto ? attachQuowarrantoSessionToState(createEmptyO10mModesPersistedState(), quowarranto) : null;
  push('agent04_chunk_53', quowarrantoState !== null && planNextCampaignAction(quowarrantoState!).kind === 'quowarranto_step');

  const injunction = createInjunctionSession({
    injunctionId: 'o10m_injunction_chunk_smoke',
    label: 'Smoke',
    scenarioIds: ['o10m_injunction_filing_docket'],
  }).session;
  const injunctionState = injunction ? attachInjunctionSessionToState(createEmptyO10mModesPersistedState(), injunction) : null;
  push('agent04_chunk_54', injunctionState !== null && planNextCampaignAction(injunctionState!).kind === 'injunction_step');

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT04_MODULE_META = {
  moduleId: 'agent-04-modes-scenarios',
  schemaVersion: 'op10m-agent04-v47',
  touchesSaveFormat: true,
  saveGameStateKey: 'o10mModesProgress',
  saveSchemaVersion: 46,
  integrationDoc: 'operation-10m/agent-04-modes-scenarios/INTEGRATION.md',
  slot: 'scenario-engine-extension',
} as const;
// OP10M_MODULE_END agent-04-modes-scenarios
