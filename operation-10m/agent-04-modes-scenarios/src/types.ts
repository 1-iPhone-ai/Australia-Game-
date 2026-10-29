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
