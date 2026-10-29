import type {
  V94AustralianRegionCode,
  V94CapabilityMaturity,
  V94ContractType,
  V94EmergingCapabilityId,
  V94FactionId,
  V94InfrastructureProjectType,
  V94LRSector,
  V94MegaprojectKind,
} from './v94-ids.ts';

export type ResearchBranchId =
  | 'digital_frontier'
  | 'resource_innovation'
  | 'industrial_transformation'
  | 'energy_transition'
  | 'agri_water_systems'
  | 'sovereign_research';

export type ResearchNodeTier = 1 | 2 | 3 | 4;

/** External gate — must be satisfied before a branch node can complete. */
export type ResearchExternalPrerequisite =
  | { kind: 'capability'; capability: V94EmergingCapabilityId; minMaturity: V94CapabilityMaturity }
  | { kind: 'project_active'; projectType: V94InfrastructureProjectType; regionId?: V94AustralianRegionCode }
  | { kind: 'contract_completed'; contractType: V94ContractType; minCount?: number }
  | { kind: 'megaproject_stage'; program: V94MegaprojectKind; minCompletedStages: number }
  | { kind: 'faction_standing'; factionId: V94FactionId; minStanding: number }
  | { kind: 'sector_strength'; regionId: V94AustralianRegionCode; sector: V94LRSector; minScore: number };

export interface ResearchBranchNodeDefinition {
  id: string;
  branchId: ResearchBranchId;
  tier: ResearchNodeTier;
  label: string;
  summary: string;
  /** Other branch nodes that must be unlocked first (same save). */
  requiresNodes: string[];
  external: ResearchExternalPrerequisite[];
  /** Weight for diffusion seed when this node unlocks (0..1). */
  diffusionSeed: number;
  /** Late-game strategic hooks emitted when this node unlocks. */
  hookIds: string[];
}

export interface ResearchBranchDefinition {
  id: ResearchBranchId;
  label: string;
  icon: string;
  description: string;
  anchorRegions: V94AustralianRegionCode[];
  primaryCapability: V94EmergingCapabilityId;
  secondaryCapabilities: V94EmergingCapabilityId[];
  sectors: V94LRSector[];
}

export type InstitutionType = 'national_lab' | 'university_network' | 'industry_council' | 'federal_agency';

export interface ResearchInstitutionDefinition {
  id: V94FactionId | string;
  name: string;
  type: InstitutionType;
  homeRegions: V94AustralianRegionCode[];
  supportedBranches: ResearchBranchId[];
  /** Adds to branch readiness score in home + linked regions (0..15). */
  readinessBonus: number;
  /** Standing threshold before institution contributes (player ↔ faction). */
  minStanding: number;
  preferredProjectTypes: V94InfrastructureProjectType[];
  preferredContractTypes: V94ContractType[];
  description: string;
}

export interface ResearchProgressInputs {
  turn: number;
  regions: Array<{
    code: V94AustralianRegionCode;
    sectors: Partial<Record<V94LRSector, number>>;
  }>;
  capabilities: Partial<
    Record<V94EmergingCapabilityId, { maturity: V94CapabilityMaturity; activeRegionIds: string[] }>
  >;
  projects: Array<{
    id: string;
    regionId: V94AustralianRegionCode | null;
    projectType: string;
    status: string;
  }>;
  completedContracts: Array<{ contractType: string; regionId: string | null }>;
  megaprojects: Partial<
    Record<V94MegaprojectKind, { completedStages: number; status: string }>
  >;
  factionStanding: Partial<Record<V94FactionId, number>>;
}

export interface RegionalDiffusionCell {
  regionId: V94AustralianRegionCode;
  score: number;
  level: 'latent' | 'aware' | 'adopting' | 'integrated';
  sourceNodeIds: string[];
}

export interface UnlockedResearchNode {
  nodeId: string;
  branchId: ResearchBranchId;
  unlockedTurn: number;
  anchorRegionId: V94AustralianRegionCode | null;
}

export interface ResearchProgressState {
  schemaVersion: 'op10m-agent03-v1';
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  diffusion: RegionalDiffusionCell[];
  readinessByBranch: Record<ResearchBranchId, number>;
  activeHookIds: string[];
  leadingResearchRegion: V94AustralianRegionCode | null;
  inputHash: string;
}

export interface StrategyHookDefinition {
  id: string;
  title: string;
  phase: 'mid' | 'late' | 'endgame';
  description: string;
  /** Real V9.4 systems the UI/AI should prioritize when this hook is active. */
  targets: {
    capabilities?: Array<{ id: V94EmergingCapabilityId; aimMaturity: V94CapabilityMaturity }>;
    megaprojects?: V94MegaprojectKind[];
    projectTypes?: V94InfrastructureProjectType[];
    contractTypes?: V94ContractType[];
    factions?: V94FactionId[];
  };
  branchIds: ResearchBranchId[];
  minUnlockedTier?: ResearchNodeTier;
}

export interface Agent03SelfTestResult {
  id: string;
  passed: boolean;
  detail?: string;
}
