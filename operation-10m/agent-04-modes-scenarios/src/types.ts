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
