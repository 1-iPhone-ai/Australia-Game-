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

/** Persisted under `gameState.o10mModesProgress` after assembly. */
export interface O10mModesPersistedState {
  schemaVersion: number;
  updatedAtTurn: number;
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
export const O10M_MODES_SAVE_SCHEMA_VERSION = 2;
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
  };
}

export function migrateO10mModesPersistedState(raw: unknown): O10mModesPersistedState {
  const base = createEmptyO10mModesPersistedState();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  const v1 = num(o.schemaVersion, 1);
  const merged = sanitizeO10mModesPersistedState({ ...o, schemaVersion: Math.max(v1, 1) }) ?? base;
  if (merged.schemaVersion < O10M_MODES_SAVE_SCHEMA_VERSION) {
    return {
      ...merged,
      schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
      recentRuns: merged.recentRuns ?? [],
      completedChainIds: merged.completedChainIds ?? [],
    };
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

  return {
    schemaVersion: num(o.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION),
    updatedAtTurn: num(o.updatedAtTurn, 0),
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


/** Agent 25 — smoke self-tests (subset of agent-04 npm test). */
export function runAgent04ModesScenariosSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent04_chunk_01', CANONICAL_GAME_MODE_SELECTIONS.length === 6, String(CANONICAL_GAME_MODE_SELECTIONS.length));
  push('agent04_chunk_02', O10M_OPERATION_SCENARIOS.length >= 14, String(O10M_OPERATION_SCENARIOS.length));
  push('agent04_chunk_03', O10M_SCENARIO_CHAINS.length === 4, String(O10M_SCENARIO_CHAINS.length));
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

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT04_MODULE_META = {
  moduleId: 'agent-04-modes-scenarios',
  schemaVersion: 'op10m-agent04-v3',
  touchesSaveFormat: true,
  saveGameStateKey: 'o10mModesProgress',
  saveSchemaVersion: 2,
  integrationDoc: 'operation-10m/agent-04-modes-scenarios/INTEGRATION.md',
  slot: 'scenario-engine-extension',
} as const;
// OP10M_MODULE_END agent-04-modes-scenarios
