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

export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v30' as const;

export type ResearchSaveKind = 'manual' | 'autosave' | 'checkpoint';

export type ResearchProgressSchemaVersion =
  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION
  | 'op10m-agent03-v29'
  | 'op10m-agent03-v28'
  | 'op10m-agent03-v27'
  | 'op10m-agent03-v26'
  | 'op10m-agent03-v25'
  | 'op10m-agent03-v24'
  | 'op10m-agent03-v23'
  | 'op10m-agent03-v22'
  | 'op10m-agent03-v21'
  | 'op10m-agent03-v20'
  | 'op10m-agent03-v19'
  | 'op10m-agent03-v18'
  | 'op10m-agent03-v17'
  | 'op10m-agent03-v16'
  | 'op10m-agent03-v15'
  | 'op10m-agent03-v14'
  | 'op10m-agent03-v13'
  | 'op10m-agent03-v12'
  | 'op10m-agent03-v11'
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

export type ResearchDiffusionIntegrationMilestone = 1 | 2 | 4 | 6;

export interface ResearchDiffusionIntegrationMilestoneEvent {
  seq: number;
  turn: number;
  milestone: ResearchDiffusionIntegrationMilestone;
  integratedRegionCount: number;
  meanDiffusionScore: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchDiffusionIntegrationSnapshot {
  capturedAtTurn: number;
  integratedRegionCount: number;
  adoptingRegionCount: number;
  meanDiffusionScore: number;
  leadingResearchRegion: V94AustralianRegionCode | null;
  peakMilestone: ResearchDiffusionIntegrationMilestone | 0;
  digest: string;
}

export interface ResearchNationalCoherenceLink {
  regionId: V94AustralianRegionCode;
  diffusionScore: number;
  driver: 'integrated_cluster' | 'adoption_wave';
}

export interface ResearchNationalCoherenceOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalCoherenceScore: number;
  projectedCoherenceScore: number;
  integratedRegionCount: number;
  integrationMomentum: number;
  links: ResearchNationalCoherenceLink[];
}

export type ResearchPortfolioBalanceBand = 40 | 55 | 70 | 85;

export interface ResearchPortfolioBalanceBandEvent {
  seq: number;
  turn: number;
  band: ResearchPortfolioBalanceBand;
  nationalBalanceScore: number;
  criticalBranchCount: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchPortfolioBalanceSnapshot {
  capturedAtTurn: number;
  nationalBalanceScore: number;
  criticalBranchCount: number;
  watchBranchCount: number;
  peakBand: ResearchPortfolioBalanceBand | 0;
  digest: string;
}

export interface ResearchStrategicAlignmentLink {
  branchId: ResearchBranchId;
  emphasis: ResearchProgramEmphasis;
  driver: 'critical_gap' | 'emphasis_drift';
}

export interface ResearchStrategicAlignmentOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalAlignmentScore: number;
  projectedAlignmentScore: number;
  misalignedBranchCount: number;
  balanceMomentum: number;
  links: ResearchStrategicAlignmentLink[];
}

export type ResearchDiffusionForecastBand = 20 | 35 | 50 | 65;

export interface ResearchDiffusionForecastBandEvent {
  seq: number;
  turn: number;
  band: ResearchDiffusionForecastBand;
  peakProjectedPercent: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchDiffusionForecastSnapshot {
  capturedAtTurn: number;
  peakProjectedPercent: number;
  horizonTurns: number;
  projectionCount: number;
  peakRegionId: V94AustralianRegionCode | null;
  peakBand: ResearchDiffusionForecastBand | 0;
  digest: string;
}

export interface ResearchHorizonConvergenceLink {
  regionId: V94AustralianRegionCode;
  projectedPercent: number;
  deltaFromNow: number;
}

export interface ResearchHorizonConvergenceOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalConvergenceScore: number;
  projectedConvergenceScore: number;
  peakRegionId: V94AustralianRegionCode | null;
  forecastMomentum: number;
  links: ResearchHorizonConvergenceLink[];
}

export type ResearchHorizonConvergenceBand = 25 | 40 | 55 | 70;

export interface ResearchHorizonConvergenceBandEvent {
  seq: number;
  turn: number;
  band: ResearchHorizonConvergenceBand;
  nationalConvergenceScore: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchHorizonConvergenceSnapshot {
  capturedAtTurn: number;
  nationalConvergenceScore: number;
  projectedConvergenceScore: number;
  horizonTurns: number;
  peakRegionId: V94AustralianRegionCode | null;
  peakBand: ResearchHorizonConvergenceBand | 0;
  digest: string;
}

export interface ResearchExecutionLink {
  regionId: V94AustralianRegionCode;
  executionPriority: 'accelerate' | 'steady' | 'observe';
  convergenceDelta: number;
}

export interface ResearchExecutionOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalExecutionScore: number;
  projectedExecutionScore: number;
  criticalRiskBranchCount: number;
  convergenceMomentum: number;
  links: ResearchExecutionLink[];
}

export type ResearchExecutionBand = 30 | 45 | 60 | 75;

export interface ResearchExecutionBandEvent {
  seq: number;
  turn: number;
  band: ResearchExecutionBand;
  nationalExecutionScore: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchExecutionSnapshot {
  capturedAtTurn: number;
  nationalExecutionScore: number;
  projectedExecutionScore: number;
  horizonTurns: number;
  criticalRiskBranchCount: number;
  peakBand: ResearchExecutionBand | 0;
  digest: string;
}

export interface ResearchStrategicDeliveryLink {
  regionId: V94AustralianRegionCode;
  deliveryPosture: 'expedite' | 'sustain' | 'monitor';
  executionDelta: number;
}

export interface ResearchStrategicDeliveryOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalDeliveryScore: number;
  projectedDeliveryScore: number;
  exportContinuityHeadroom: number;
  executionMomentum: number;
  links: ResearchStrategicDeliveryLink[];
}

export type ResearchStrategicDeliveryBand = 35 | 50 | 65 | 80;

export interface ResearchStrategicDeliveryBandEvent {
  seq: number;
  turn: number;
  band: ResearchStrategicDeliveryBand;
  nationalDeliveryScore: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchStrategicDeliverySnapshot {
  capturedAtTurn: number;
  nationalDeliveryScore: number;
  projectedDeliveryScore: number;
  horizonTurns: number;
  executionMomentum: number;
  peakBand: ResearchStrategicDeliveryBand | 0;
  digest: string;
}

export interface ResearchScaleWaveMaturityLink {
  branchId: ResearchBranchId;
  maturityPosture: 'leading' | 'aligned' | 'lagging';
  synergyDelta: number;
}

export interface ResearchScaleWaveMaturityOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalMaturityScore: number;
  projectedMaturityScore: number;
  synergyHeadroom: number;
  deliveryMomentum: number;
  tierFiveUnlockedCount: number;
  links: ResearchScaleWaveMaturityLink[];
}

export type ResearchScaleWaveMaturityBand = 40 | 55 | 70 | 85;

export interface ResearchScaleWaveMaturityBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveMaturityBand;
  nationalMaturityScore: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveMaturitySnapshot {
  capturedAtTurn: number;
  nationalMaturityScore: number;
  projectedMaturityScore: number;
  horizonTurns: number;
  deliveryMomentum: number;
  tierFiveUnlockedCount: number;
  peakBand: ResearchScaleWaveMaturityBand | 0;
  digest: string;
}

export interface ResearchNationalIntegrationLink {
  branchId: ResearchBranchId;
  integrationPosture: 'anchor' | 'integrate' | 'observe';
  maturityDelta: number;
}

export interface ResearchNationalIntegrationOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  nationalIntegrationScore: number;
  projectedIntegrationScore: number;
  institutionIntegrationHeadroom: number;
  maturityMomentum: number;
  nationalIntegrationCount: number;
  links: ResearchNationalIntegrationLink[];
}

export type ResearchNationalIntegrationBand = 45 | 60 | 75 | 90;

export interface ResearchNationalIntegrationBandEvent {
  seq: number;
  turn: number;
  band: ResearchNationalIntegrationBand;
  nationalIntegrationScore: number;
  horizonTurns: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchNationalIntegrationSnapshot {
  capturedAtTurn: number;
  nationalIntegrationScore: number;
  projectedIntegrationScore: number;
  horizonTurns: number;
  maturityMomentum: number;
  nationalIntegrationCount: number;
  peakBand: ResearchNationalIntegrationBand | 0;
  digest: string;
}

export interface ResearchScaleWaveProjectionOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  projectionReadinessScore: number;
  integrationBandHeadroom: number;
  maturityBandHeadroom: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchScaleWaveProjectionBand = 50 | 65 | 80 | 92;

export interface ResearchScaleWaveProjectionBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveProjectionBand;
  projectionReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveProjectionSnapshot {
  capturedAtTurn: number;
  projectionReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationBandHeadroom: number;
  maturityBandHeadroom: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveProjectionBand | 0;
  digest: string;
}

export interface ResearchTrancheProjectionReadinessOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  trancheReadinessScore: number;
  projectionMomentum: number;
  integrationBaselineShaHint: string;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchTrancheProjectionBand = 55 | 70 | 85 | 95;

export interface ResearchTrancheProjectionBandEvent {
  seq: number;
  turn: number;
  band: ResearchTrancheProjectionBand;
  trancheReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchTrancheProjectionSnapshot {
  capturedAtTurn: number;
  trancheReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  projectionMomentum: number;
  dryRunEligible: boolean;
  peakBand: ResearchTrancheProjectionBand | 0;
  digest: string;
}

export interface ResearchScaleWaveIntegrationGateOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationGateScore: number;
  gateMomentum: number;
  integrationBaselineShaHint: string;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchScaleWaveIntegrationGateBand = 58 | 72 | 86 | 96;

export interface ResearchScaleWaveIntegrationGateBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveIntegrationGateBand;
  integrationGateScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveIntegrationGateSnapshot {
  capturedAtTurn: number;
  integrationGateScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  gateMomentum: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveIntegrationGateBand | 0;
  digest: string;
}

export interface ResearchTrancheDryRunHandoffOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffReadinessScore: number;
  handoffMomentum: number;
  integrationBaselineShaHint: string;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchTrancheDryRunHandoffBand = 60 | 74 | 88 | 97;

export interface ResearchTrancheDryRunHandoffBandEvent {
  seq: number;
  turn: number;
  band: ResearchTrancheDryRunHandoffBand;
  handoffReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchTrancheDryRunHandoffSnapshot {
  capturedAtTurn: number;
  handoffReadinessScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffMomentum: number;
  dryRunEligible: boolean;
  peakBand: ResearchTrancheDryRunHandoffBand | 0;
  digest: string;
}

export interface ResearchMergedIntegrationBaselineOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  mergedBaselineScore: number;
  mergeMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchMergedIntegrationBaselineBand = 62 | 76 | 90 | 98;

export interface ResearchMergedIntegrationBaselineBandEvent {
  seq: number;
  turn: number;
  band: ResearchMergedIntegrationBaselineBand;
  mergedBaselineScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchMergedIntegrationBaselineSnapshot {
  capturedAtTurn: number;
  mergedBaselineScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  mergeMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchMergedIntegrationBaselineBand | 0;
  digest: string;
}

export interface ResearchScaleWavePostIntegrationDryRunOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  postIntegrationDryRunScore: number;
  dryRunMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchScaleWavePostIntegrationDryRunBand = 64 | 78 | 92 | 99;

export interface ResearchScaleWavePostIntegrationDryRunBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWavePostIntegrationDryRunBand;
  postIntegrationDryRunScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWavePostIntegrationDryRunSnapshot {
  capturedAtTurn: number;
  postIntegrationDryRunScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  dryRunMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWavePostIntegrationDryRunBand | 0;
  digest: string;
}

export interface ResearchScaleWaveIntegrationSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchScaleWaveIntegrationSealBand = 66 | 80 | 94 | 100;

export interface ResearchScaleWaveIntegrationSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveIntegrationSealBand;
  integrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveIntegrationSealSnapshot {
  capturedAtTurn: number;
  integrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveIntegrationSealBand | 0;
  digest: string;
}

export interface ResearchScaleWavePostSealHandoffOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  postSealHandoffScore: number;
  handoffMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export type ResearchScaleWavePostSealHandoffBand = 68 | 82 | 96 | 100;

export interface ResearchScaleWavePostSealHandoffBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWavePostSealHandoffBand;
  postSealHandoffScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWavePostSealHandoffSnapshot {
  capturedAtTurn: number;
  postSealHandoffScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWavePostSealHandoffBand | 0;
  digest: string;
}

export interface ResearchScaleWaveIntegrationContinuityOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationContinuityScore: number;
  continuityMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}


export type ResearchScaleWaveIntegrationContinuityBand = 70 | 84 | 98 | 100;

export interface ResearchScaleWaveIntegrationContinuityBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveIntegrationContinuityBand;
  integrationContinuityScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveIntegrationContinuitySnapshot {
  capturedAtTurn: number;
  integrationContinuityScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  continuityMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveIntegrationContinuityBand | 0;
  digest: string;
}


export type ResearchScaleWaveContinuityHandoffBand = 71 | 85 | 99 | 100;

export interface ResearchScaleWaveContinuityHandoffBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveContinuityHandoffBand;
  continuityHandoffScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveContinuityHandoffSnapshot {
  capturedAtTurn: number;
  continuityHandoffScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveContinuityHandoffBand | 0;
  digest: string;
}


export type ResearchScaleWaveHandoffIntegrationBand = 73 | 87 | 98 | 100;

export interface ResearchScaleWaveHandoffIntegrationBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveHandoffIntegrationBand;
  handoffIntegrationScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveHandoffIntegrationSnapshot {
  capturedAtTurn: number;
  handoffIntegrationScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveHandoffIntegrationBand | 0;
  digest: string;
}


export type ResearchScaleWaveHandoffIntegrationSealBand = 74 | 88 | 99 | 100;

export interface ResearchScaleWaveHandoffIntegrationSealBandEvent {
  seq: number;
  turn: number;
  band: ResearchScaleWaveHandoffIntegrationSealBand;
  handoffIntegrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  phase: 'escalation' | 'de-escalation';
}

export interface ResearchScaleWaveHandoffIntegrationSealSnapshot {
  capturedAtTurn: number;
  handoffIntegrationSealScore: number;
  horizonTurns: number;
  waveOrdinal: number;
  sealMomentum: number;
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  peakBand: ResearchScaleWaveHandoffIntegrationSealBand | 0;
  digest: string;
}

export interface ResearchScaleWaveIntegrationSealHandoffOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  integrationSealHandoffScore: number;
  handoffMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveHandoffIntegrationSealOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffIntegrationSealScore: number;
  sealMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveHandoffIntegrationOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  handoffIntegrationScore: number;
  integrationMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
}

export interface ResearchScaleWaveContinuityHandoffOutlook {
  active: boolean;
  baseTurn: number;
  horizonTurns: number;
  waveOrdinal: number;
  continuityHandoffScore: number;
  handoffMomentum: number;
  integrationBaselineShaHint: string;
  priorBaselineHints: string[];
  projectedFunctionalHint: number;
  dryRunEligible: boolean;
  ticketHint: string | null;
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
  nationalCoherenceOutlook?: ResearchNationalCoherenceOutlook | null;
  strategicAlignmentOutlook?: ResearchStrategicAlignmentOutlook | null;
  horizonConvergenceOutlook?: ResearchHorizonConvergenceOutlook | null;
  researchExecutionOutlook?: ResearchExecutionOutlook | null;
  strategicDeliveryOutlook?: ResearchStrategicDeliveryOutlook | null;
  scaleWaveMaturityOutlook?: ResearchScaleWaveMaturityOutlook | null;
  nationalIntegrationOutlook?: ResearchNationalIntegrationOutlook | null;
  scaleWaveProjectionOutlook?: ResearchScaleWaveProjectionOutlook | null;
  trancheProjectionReadinessOutlook?: ResearchTrancheProjectionReadinessOutlook | null;
  scaleWaveIntegrationGateOutlook?: ResearchScaleWaveIntegrationGateOutlook | null;
  trancheDryRunHandoffOutlook?: ResearchTrancheDryRunHandoffOutlook | null;
  mergedIntegrationBaselineOutlook?: ResearchMergedIntegrationBaselineOutlook | null;
  scaleWavePostIntegrationDryRunOutlook?: ResearchScaleWavePostIntegrationDryRunOutlook | null;
  scaleWaveIntegrationSealOutlook?: ResearchScaleWaveIntegrationSealOutlook | null;
  scaleWavePostSealHandoffOutlook?: ResearchScaleWavePostSealHandoffOutlook | null;
  scaleWaveIntegrationContinuityOutlook?: ResearchScaleWaveIntegrationContinuityOutlook | null;
  scaleWaveContinuityHandoffOutlook?: ResearchScaleWaveContinuityHandoffOutlook | null;
  scaleWaveHandoffIntegrationOutlook?: ResearchScaleWaveHandoffIntegrationOutlook | null;
  scaleWaveHandoffIntegrationSealOutlook?: ResearchScaleWaveHandoffIntegrationSealOutlook | null;
  scaleWaveIntegrationSealHandoffOutlook?: ResearchScaleWaveIntegrationSealHandoffOutlook | null;
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
  diffusionIntegrationLog?: ResearchDiffusionIntegrationMilestoneEvent[];
  diffusionIntegrationSnapshot?: ResearchDiffusionIntegrationSnapshot | null;
  portfolioBalanceLog?: ResearchPortfolioBalanceBandEvent[];
  portfolioBalanceSnapshot?: ResearchPortfolioBalanceSnapshot | null;
  diffusionForecastBandLog?: ResearchDiffusionForecastBandEvent[];
  diffusionForecastSnapshot?: ResearchDiffusionForecastSnapshot | null;
  horizonConvergenceBandLog?: ResearchHorizonConvergenceBandEvent[];
  horizonConvergenceSnapshot?: ResearchHorizonConvergenceSnapshot | null;
  researchExecutionBandLog?: ResearchExecutionBandEvent[];
  researchExecutionSnapshot?: ResearchExecutionSnapshot | null;
  strategicDeliveryBandLog?: ResearchStrategicDeliveryBandEvent[];
  strategicDeliverySnapshot?: ResearchStrategicDeliverySnapshot | null;
  scaleWaveMaturityBandLog?: ResearchScaleWaveMaturityBandEvent[];
  scaleWaveMaturitySnapshot?: ResearchScaleWaveMaturitySnapshot | null;
  nationalIntegrationBandLog?: ResearchNationalIntegrationBandEvent[];
  nationalIntegrationSnapshot?: ResearchNationalIntegrationSnapshot | null;
  scaleWaveProjectionBandLog?: ResearchScaleWaveProjectionBandEvent[];
  scaleWaveProjectionSnapshot?: ResearchScaleWaveProjectionSnapshot | null;
  trancheProjectionBandLog?: ResearchTrancheProjectionBandEvent[];
  trancheProjectionSnapshot?: ResearchTrancheProjectionSnapshot | null;
  integrationGateBandLog?: ResearchScaleWaveIntegrationGateBandEvent[];
  integrationGateSnapshot?: ResearchScaleWaveIntegrationGateSnapshot | null;
  dryRunHandoffBandLog?: ResearchTrancheDryRunHandoffBandEvent[];
  dryRunHandoffSnapshot?: ResearchTrancheDryRunHandoffSnapshot | null;
  mergedIntegrationBaselineBandLog?: ResearchMergedIntegrationBaselineBandEvent[];
  mergedIntegrationBaselineSnapshot?: ResearchMergedIntegrationBaselineSnapshot | null;
  postIntegrationDryRunBandLog?: ResearchScaleWavePostIntegrationDryRunBandEvent[];
  postIntegrationDryRunSnapshot?: ResearchScaleWavePostIntegrationDryRunSnapshot | null;
  integrationSealBandLog?: ResearchScaleWaveIntegrationSealBandEvent[];
  integrationSealSnapshot?: ResearchScaleWaveIntegrationSealSnapshot | null;
  postSealHandoffBandLog?: ResearchScaleWavePostSealHandoffBandEvent[];
  postSealHandoffSnapshot?: ResearchScaleWavePostSealHandoffSnapshot | null;
  integrationContinuityBandLog?: ResearchScaleWaveIntegrationContinuityBandEvent[];
  integrationContinuitySnapshot?: ResearchScaleWaveIntegrationContinuitySnapshot | null;
  continuityHandoffBandLog?: ResearchScaleWaveContinuityHandoffBandEvent[];
  continuityHandoffSnapshot?: ResearchScaleWaveContinuityHandoffSnapshot | null;
  handoffIntegrationBandLog?: ResearchScaleWaveHandoffIntegrationBandEvent[];
  handoffIntegrationSnapshot?: ResearchScaleWaveHandoffIntegrationSnapshot | null;
  handoffIntegrationSealBandLog?: ResearchScaleWaveHandoffIntegrationSealBandEvent[];
  handoffIntegrationSealSnapshot?: ResearchScaleWaveHandoffIntegrationSealSnapshot | null;
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
