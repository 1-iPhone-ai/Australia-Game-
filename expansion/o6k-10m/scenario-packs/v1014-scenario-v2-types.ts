// ============================================================================
// SECTION 20AY: V10.14 SCENARIO & OBJECTIVE ENGINE V2 (T6-2 / O6K-21)
// Operation 10M — external merge shard (Agent 25 splices before SECTION 21B).
// Prefix: V1014_SCENARIO_V2_*  |  LAB: v1014_scenarios_v2
// Cross-wire: SECTION 20O presets, 20L cohesion, 20I world reaction, 20AH strategic actions.
// ============================================================================

export const V1014_SCENARIO_V2_SCHEMA_VERSION = '10.14.0-scenario-v2' as const;
export const V1014_SCENARIO_V2_AGENT = 'o6k-21-scenario-packs' as const;

export const V1014_SCENARIO_V2_CORE_REGIONS: readonly string[] = [
  'NSW','VIC','QLD','WA','SA','TAS','NT','ACT',
] as const;

export type V1014ScenarioV2Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type V1014ScenarioV2Category =
  | 'beginner' | 'challenge' | 'historical' | 'expert' | 'experimental' | 'custom';
export type V1014ScenarioV2Complexity = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type V1014ScenarioV2ObjectiveTargetType =
  | 'money' | 'regions' | 'netWorth' | 'challenges' | 'regionalStanding' | 'daysPassed'
  | 'money_accumulated' | 'regions_controlled' | 'turns_survived' | 'standing_reached'
  | 'ai_eliminated' | 'challenges_completed' | 'public_stability' | 'crisis_resolved'
  | 'territory_controlled' | 'debt_cleared' | 'investments_count' | 'standing_threshold'
  | 'specific_region_controlled' | 'zero_sabotage_taken' | 'governance_proposals_passed'
  | 'multi_actor_standing_avg';

export interface V1014ScenarioV2Objective {
  id: string;
  label: string;
  description: string;
  targetType: V1014ScenarioV2ObjectiveTargetType;
  targetValue: number;
  isPrimary?: boolean;
  targetRegionId?: string;
  targetActorId?: string;
  timeLimitDays?: number;
  missionNodeId?: string;
}

export type V1014ScenarioV2ModifierDomain =
  | 'economic' | 'ai_behavior' | 'stability' | 'crisis' | 'regional_standing'
  | 'resource_prices' | 'turn_limits';

export interface V1014ScenarioV2Modifier {
  id: string;
  name: string;
  description: string;
  domain: V1014ScenarioV2ModifierDomain;
  targetKey: string;
  value: number | string | boolean;
  isGlobal: boolean;
  affectedActorIds?: string[];
}

export interface V1014ScenarioV2Definition {
  id: string;
  title: string;
  description: string;
  category: V1014ScenarioV2Category;
  difficulty: V1014ScenarioV2Difficulty;
  complexity?: V1014ScenarioV2Complexity;
  forcedSeed: number;
  startingMoney: number;
  startingRegions: string[];
  forcedSettings: Record<string, unknown>;
  objectives: V1014ScenarioV2Objective[];
  modifiers: V1014ScenarioV2Modifier[];
  narrativeIntro?: string;
  narrativeOutro?: string;
  badgeId: string;
  unlockedByDefault: boolean;
  author: 'System';
  youWillLearn?: string[];
  registryGateIds: string[];
  missionGraphId: string;
  replaySafeSeed: number;
  packArchetype: string;
  packRegion: string;
  packTier: string;
}

export type V1014ScenarioV2MissionNodeKind =
  | 'objective' | 'branch' | 'fail_forward' | 'gate' | 'milestone' | 'reaction_hook';

export interface V1014ScenarioV2MissionEdge {
  from: string;
  to: string;
  condition: string;
  failForward?: boolean;
  priority: number;
}

export interface V1014ScenarioV2MissionNode {
  id: string;
  kind: V1014ScenarioV2MissionNodeKind;
  label: string;
  summary: string;
  objectiveId?: string;
  gateId?: string;
  requiredWorldReactionKinds?: string[];
  strategicPolicyIds?: string[];
  cohesionFocusSource?: 'objective' | 'crisis' | 'strategy' | 'decision';
  onFailForwardTo?: string;
  evidence: string[];
}

export interface V1014ScenarioV2MissionGraph {
  id: string;
  scenarioId: string;
  entryNodeId: string;
  nodes: V1014ScenarioV2MissionNode[];
  edges: V1014ScenarioV2MissionEdge[];
  failForwardRules: V1014ScenarioV2FailForwardRule[];
}

export interface V1014ScenarioV2FailForwardRule {
  id: string;
  triggerNodeId: string;
  fallbackNodeId: string;
  reason: string;
  preservePrimaryObjective: boolean;
  adjustTargetType?: V1014ScenarioV2ObjectiveTargetType;
  adjustTargetDelta?: number;
}

export type V1014ScenarioV2RunPhase =
  | 'locked' | 'available' | 'active' | 'branching' | 'completed' | 'failed_forward';

export interface V1014ScenarioV2RuntimeNodeState {
  nodeId: string;
  phase: V1014ScenarioV2RunPhase;
  enteredTurn: number;
  completedTurn: number | null;
  failForwardApplied: boolean;
}

export interface V1014ScenarioV2Persisted {
  schemaVersion: typeof V1014_SCENARIO_V2_SCHEMA_VERSION;
  revision: number;
  activeScenarioId: string | null;
  missionGraphId: string | null;
  nodeStates: Record<string, V1014ScenarioV2RuntimeNodeState>;
  completedGateIds: string[];
  replaySeed: number;
  inputHash: string;
  history: Array<{ turn: number; note: string; nodeId: string }>;
}

export interface V1014ScenarioV2GateDefinition {
  id: string;
  label: string;
  description: string;
  requiresScenarioIds?: string[];
  requiresAchievementIds?: string[];
  minCompletedMissions: number;
  regionAffinity?: string;
  archetypeAffinity?: string;
  unlockTier: 'starter' | 'standard' | 'advanced' | 'expert';
}

export interface V1014ScenarioV2SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
