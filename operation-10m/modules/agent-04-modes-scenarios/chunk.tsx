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
export const O10M_MODES_SAVE_SCHEMA_VERSION = 10;
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
};

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
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
  push('agent04_chunk_03', O10M_SCENARIO_CHAINS.length === 11, String(O10M_SCENARIO_CHAINS.length));
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

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT04_MODULE_META = {
  moduleId: 'agent-04-modes-scenarios',
  schemaVersion: 'op10m-agent04-v11',
  touchesSaveFormat: true,
  saveGameStateKey: 'o10mModesProgress',
  saveSchemaVersion: 10,
  integrationDoc: 'operation-10m/agent-04-modes-scenarios/INTEGRATION.md',
  slot: 'scenario-engine-extension',
} as const;
// OP10M_MODULE_END agent-04-modes-scenarios
