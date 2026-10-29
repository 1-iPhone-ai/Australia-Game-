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

export type ResearchNodeTier = 1 | 2 | 3 | 4 | 5;

/** External gate — must be satisfied before a branch node can complete. */
export type ResearchExternalPrerequisite =
  | { kind: 'capability'; capability: V94EmergingCapabilityId; minMaturity: V94CapabilityMaturity }
  | { kind: 'project_active'; projectType: V94InfrastructureProjectType; regionId?: V94AustralianRegionCode }
  | { kind: 'contract_completed'; contractType: V94ContractType; minCount?: number }
  | { kind: 'megaproject_stage'; program: V94MegaprojectKind; minCompletedStages: number }
  | { kind: 'faction_standing'; factionId: V94FactionId; minStanding: number }
  | { kind: 'sector_strength'; regionId: V94AustralianRegionCode; sector: V94LRSector; minScore: number }
  | { kind: 'branch_progress'; branchId: ResearchBranchId; minTier: ResearchNodeTier };

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

export type InstitutionUpgradeTier =
  | 'dormant'
  | 'affiliate'
  | 'partner'
  | 'strategic'
  | 'national_integration';

export interface InstitutionUpgradeState {
  institutionId: string;
  tier: InstitutionUpgradeTier;
  readinessMultiplier: number;
  diffusionMultiplier: number;
  assessedTurn: number;
  reasons: string[];
}

export interface LateGameDiffusionPulse {
  fromRegionId: V94AustralianRegionCode;
  toRegionId: V94AustralianRegionCode;
  hops: number;
  strength: number;
}

export interface LateGameDiffusionReport {
  active: boolean;
  trigger: 'tier4_unlock' | 'national_institution' | 'both' | 'none';
  tier4UnlockCount: number;
  nationalInstitutionCount: number;
  pulses: LateGameDiffusionPulse[];
  nationalPenetration: number;
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
  institutionBoost?: number;
  cascadeBoost?: number;
}

export interface UnlockedResearchNode {
  nodeId: string;
  branchId: ResearchBranchId;
  unlockedTurn: number;
  anchorRegionId: V94AustralianRegionCode | null;
}

export interface ResearchScaleWaveReport {
  active: boolean;
  tier5UnlockCount: number;
  crossBranchSynergyScore: number;
  technologyTransferLinks: Array<{
    fromBranch: ResearchBranchId;
    toBranch: ResearchBranchId;
    strength: number;
  }>;
  dominantCapabilityCluster: V94EmergingCapabilityId | null;
}

export type ResearchProgramEmphasis = 'applied' | 'fundamental' | 'commercial' | 'sovereign';

export interface ResearchBranchEmphasisState {
  branchId: ResearchBranchId;
  emphasis: ResearchProgramEmphasis;
  setTurn: number;
}

export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v10' as const;

export type ResearchSaveKind = 'manual' | 'autosave' | 'checkpoint';

export type ResearchProgressSchemaVersion =
  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION
  | 'op10m-agent03-v9'
  | 'op10m-agent03-v8'
  | 'op10m-agent03-v7'
  | 'op10m-agent03-v6'
  | 'op10m-agent03-v5'
  | 'op10m-agent03-v4'
  | 'op10m-agent03-v3'
  | 'op10m-agent03-v2'
  | 'op10m-agent03-v1';

export interface ResearchSaveMigrationEntry {
  fromVersion: ResearchProgressSchemaVersion | 'array-legacy';
  toVersion: ResearchProgressSchemaVersion;
  turn: number;
}

export interface ResearchCommercializationHint {
  branchId: ResearchBranchId;
  emphasis: ResearchProgramEmphasis;
  readinessFloor: number;
  exportPriority: 'low' | 'medium' | 'high';
  linkedCapabilityId: V94EmergingCapabilityId;
  rationale: string;
}

export interface ResearchCommercializationReport {
  active: boolean;
  hints: ResearchCommercializationHint[];
  nationalExportScore: number;
}

export interface ResearchUnlockEvent {
  seq: number;
  turn: number;
  nodeId: string;
  branchId: ResearchBranchId;
  hookIds: string[];
}

export interface ResearchPortfolioBalanceHint {
  branchId: ResearchBranchId;
  readinessGap: number;
  currentEmphasis: ResearchProgramEmphasis;
  suggestedEmphasis: ResearchProgramEmphasis;
  priority: 'critical' | 'watch' | 'balanced';
}

export interface ResearchPortfolioBalanceReport {
  active: boolean;
  hints: ResearchPortfolioBalanceHint[];
  nationalBalanceScore: number;
}

export interface ResearchDiffusionForecastProjection {
  turn: number;
  regionId: V94AustralianRegionCode;
  projectedScore: number;
  deltaFromNow: number;
}

export interface ResearchDiffusionForecast {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  peakRegionId: V94AustralianRegionCode | null;
  peakProjectedScore: number;
  projections: ResearchDiffusionForecastProjection[];
}

export interface ResearchEmphasisChangeEvent {
  seq: number;
  turn: number;
  branchId: ResearchBranchId;
  fromEmphasis: ResearchProgramEmphasis;
  toEmphasis: ResearchProgramEmphasis;
  emphasisRevision: number;
}

export interface ResearchInstitutionTierSnapshot {
  capturedAtTurn: number;
  tiers: Record<string, InstitutionUpgradeTier>;
  digest: string;
  nationalIntegrationCount: number;
  strategicOrAboveCount: number;
}

export interface ResearchSynergyTransferOutlook {
  fromBranch: ResearchBranchId;
  toBranch: ResearchBranchId;
  projectedStrength: number;
}

export interface ResearchSynergyOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  currentSynergyScore: number;
  projectedSynergyScore: number;
  activeMultiBranchCount: number;
  transferLinks: ResearchSynergyTransferOutlook[];
  dominantCapabilityCluster: V94EmergingCapabilityId | null;
}

export type ResearchReadinessMilestone = 25 | 50 | 75 | 90;

export interface ResearchReadinessMilestoneEvent {
  seq: number;
  turn: number;
  branchId: ResearchBranchId;
  milestone: ResearchReadinessMilestone;
  readiness: number;
}

export interface ResearchReadinessBranchSnapshot {
  capturedAtTurn: number;
  readinessByBranch: Record<ResearchBranchId, number>;
  digest: string;
  branchAbove75Count: number;
  nationalMeanReadiness: number;
}

export interface ResearchIntegrationRiskLink {
  branchId: ResearchBranchId;
  riskScore: number;
  driver: 'readiness_gap' | 'institution_dormant' | 'portfolio_imbalance';
}

export interface ResearchIntegrationRiskOutlook {
  active: boolean;
  baseTurn: number;
  nationalRiskScore: number;
  criticalBranchCount: number;
  links: ResearchIntegrationRiskLink[];
}

export type ResearchIntegrationRiskBand = 40 | 60 | 80;

export interface ResearchIntegrationRiskEvent {
  seq: number;
  turn: number;
  band: ResearchIntegrationRiskBand;
  nationalRiskScore: number;
  criticalBranchCount: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchIntegrationRiskSnapshot {
  capturedAtTurn: number;
  nationalRiskScore: number;
  criticalBranchCount: number;
  peakRiskBand: ResearchIntegrationRiskBand | 0;
  digest: string;
}

export interface ResearchScaleWaveSnapshot {
  capturedAtTurn: number;
  tier5UnlockCount: number;
  crossBranchSynergyScore: number;
  transferLinkCount: number;
  dominantCapabilityCluster: V94EmergingCapabilityId | null;
  digest: string;
}

export interface ResearchAdoptionHorizonOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalAdoptionScore: number;
  projectedAdoptionScore: number;
  peakRegionId: V94AustralianRegionCode | null;
  synergyContribution: number;
}

export type ResearchSynergyThreshold = 25 | 50 | 75 | 90;

export interface ResearchSynergyThresholdEvent {
  seq: number;
  turn: number;
  threshold: ResearchSynergyThreshold;
  synergyScore: number;
  activeMultiBranchCount: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchSynergySnapshot {
  capturedAtTurn: number;
  currentSynergyScore: number;
  projectedSynergyScore: number;
  activeMultiBranchCount: number;
  peakThreshold: ResearchSynergyThreshold | 0;
  dominantCapabilityCluster: V94EmergingCapabilityId | null;
  digest: string;
}

export interface ResearchPortfolioStabilizationLink {
  branchId: ResearchBranchId;
  readinessGap: number;
  driver: 'readiness_lag' | 'emphasis_mismatch';
}

export interface ResearchPortfolioStabilizationOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalStabilizationScore: number;
  projectedStabilizationScore: number;
  criticalBranchCount: number;
  synergyMomentum: number;
  links: ResearchPortfolioStabilizationLink[];
}

export type ResearchCommercializationMilestone = 30 | 50 | 70 | 90;

export interface ResearchCommercializationMilestoneEvent {
  seq: number;
  turn: number;
  milestone: ResearchCommercializationMilestone;
  nationalExportScore: number;
  highPriorityBranchCount: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchCommercializationSnapshot {
  capturedAtTurn: number;
  nationalExportScore: number;
  highPriorityBranchCount: number;
  mediumPriorityBranchCount: number;
  peakMilestone: ResearchCommercializationMilestone | 0;
  digest: string;
}

export interface ResearchExportContinuityLink {
  branchId: ResearchBranchId;
  exportPriority: 'medium' | 'high';
  driver: 'commercial_emphasis' | 'readiness_floor';
}

export interface ResearchExportContinuityOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalContinuityScore: number;
  projectedContinuityScore: number;
  highPriorityExportCount: number;
  exportMomentum: number;
  links: ResearchExportContinuityLink[];
}

export interface ResearchProgressState {
  schemaVersion: ResearchProgressSchemaVersion;
  revision: number;
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  diffusion: RegionalDiffusionCell[];
  readinessByBranch: Record<ResearchBranchId, number>;
  activeHookIds: string[];
  leadingResearchRegion: V94AustralianRegionCode | null;
  inputHash: string;
  institutionUpgrades: InstitutionUpgradeState[];
  lateGameDiffusion: LateGameDiffusionReport | null;
  scaleWave: ResearchScaleWaveReport | null;
  commercialization?: ResearchCommercializationReport | null;
  portfolioBalance?: ResearchPortfolioBalanceReport | null;
  diffusionForecast?: ResearchDiffusionForecast | null;
  synergyOutlook?: ResearchSynergyOutlook | null;
  integrationRiskOutlook?: ResearchIntegrationRiskOutlook | null;
  adoptionHorizonOutlook?: ResearchAdoptionHorizonOutlook | null;
  portfolioStabilizationOutlook?: ResearchPortfolioStabilizationOutlook | null;
  exportContinuityOutlook?: ResearchExportContinuityOutlook | null;
  unlockSeq: number;
  branchEmphasis?: ResearchBranchEmphasisState[];
  emphasisRevision?: number;
  migrationLog?: ResearchSaveMigrationEntry[];
  saveKind?: ResearchSaveKind;
  updatedAtTurn?: number;
  sessionId?: string;
  persistRevision?: number;
  unlockEventLog?: ResearchUnlockEvent[];
  lastReconciledAtTurn?: number;
  emphasisChangeLog?: ResearchEmphasisChangeEvent[];
  institutionTierSnapshot?: ResearchInstitutionTierSnapshot | null;
  readinessMilestoneLog?: ResearchReadinessMilestoneEvent[];
  readinessBranchSnapshot?: ResearchReadinessBranchSnapshot | null;
  integrationRiskLog?: ResearchIntegrationRiskEvent[];
  integrationRiskSnapshot?: ResearchIntegrationRiskSnapshot | null;
  scaleWaveSnapshot?: ResearchScaleWaveSnapshot | null;
  synergyThresholdLog?: ResearchSynergyThresholdEvent[];
  synergySnapshot?: ResearchSynergySnapshot | null;
  commercializationMilestoneLog?: ResearchCommercializationMilestoneEvent[];
  commercializationSnapshot?: ResearchCommercializationSnapshot | null;
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
