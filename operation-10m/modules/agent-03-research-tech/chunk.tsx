// OP10M_MODULE_BEGIN agent-03-research-tech
// Operation 10M — Agent 03 research / technology / progression (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-03-research-tech/src/ — regenerate via npm run bundle:agent-03-chunk
// --- bundled from src/internal-constants.ts ---
/** Shared status matcher for active infrastructure / project records. */
export const AGENT03_ACTIVE_PROJECT = /^(active|upgraded|partial|operational|completed)/i;

// --- bundled from src/v94-ids.ts ---
/**
 * Canonical V9.4 identifier unions (mirrored for assembly parity checks).
 * Keep in sync with `(V9.4) australia-game-with-ai.tsx` — do not import that file here.
 */

export type V94EmergingCapabilityId =
  | 'advanced_logistics'
  | 'automated_mining'
  | 'advanced_manufacturing'
  | 'grid_scale_storage'
  | 'advanced_water_systems'
  | 'ai_compute_infrastructure'
  | 'precision_agriculture'
  | 'research_commercialization';

export const V94_CAPABILITY_IDS: V94EmergingCapabilityId[] = [
  'advanced_logistics',
  'automated_mining',
  'advanced_manufacturing',
  'grid_scale_storage',
  'advanced_water_systems',
  'ai_compute_infrastructure',
  'precision_agriculture',
  'research_commercialization',
];

export type V94CapabilityMaturity =
  | 'unavailable'
  | 'emerging'
  | 'demonstrated'
  | 'operational'
  | 'scaled'
  | 'nationally_integrated';

export const V94_CAPABILITY_MATURITY_RANK: Record<V94CapabilityMaturity, number> = {
  unavailable: 0,
  emerging: 1,
  demonstrated: 2,
  operational: 3,
  scaled: 4,
  nationally_integrated: 5,
};

export type V94LRSector =
  | 'mining'
  | 'agriculture'
  | 'technology'
  | 'finance'
  | 'manufacturing'
  | 'energy'
  | 'renewables'
  | 'tourism'
  | 'trade'
  | 'logistics'
  | 'research'
  | 'defense'
  | 'infrastructure';

export type V94MegaprojectKind =
  | 'national_high_speed_rail'
  | 'eastern_energy_supergrid'
  | 'national_water_security'
  | 'australian_ai_compute_network'
  | 'northern_export_corridor'
  | 'green_hydrogen_export_network'
  | 'continental_digital_backbone'
  | 'national_freight_modernization';

export const V94_MEGAPROJECT_KINDS: V94MegaprojectKind[] = [
  'national_high_speed_rail',
  'eastern_energy_supergrid',
  'national_water_security',
  'australian_ai_compute_network',
  'northern_export_corridor',
  'green_hydrogen_export_network',
  'continental_digital_backbone',
  'national_freight_modernization',
];

export type V94InfrastructureProjectType =
  | 'research_campus'
  | 'tech_innovation_park'
  | 'data_center'
  | 'subsea_cable_hub'
  | 'advanced_manufacturing'
  | 'desalination_plant'
  | 'water_pipeline'
  | 'hydro_expansion'
  | 'renewable_grid'
  | 'green_hydrogen_terminal'
  | 'inland_rail_hub'
  | 'freight_rail_upgrade'
  | 'automated_port'
  | 'remote_logistics_base';

export type V94ContractType =
  | 'ai_research_center'
  | 'mining_tech_initiative'
  | 'manufacturing_modernization'
  | 'defense_logistics_hub'
  | 'disaster_relief_supply'
  | 'water_security'
  | 'crisis_recovery';

export type V94FactionId =
  | 'csiro_ai_directorate'
  | 'vic_technology_council'
  | 'tas_innovation_network'
  | 'federal_infrastructure_office';

export type V94AustralianRegionCode =
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'SA'
  | 'WA'
  | 'TAS'
  | 'NT'
  | 'ACT'
  | 'AAT';

export const V94_REGION_CODES: V94AustralianRegionCode[] = [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'NT',
  'ACT',
  'AAT',
];

// --- bundled from src/types.ts ---
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

export const RESEARCH_PROGRESS_SCHEMA_VERSION = 'op10m-agent03-v15' as const;

export type ResearchSaveKind = 'manual' | 'autosave' | 'checkpoint';

export type ResearchProgressSchemaVersion =
  | typeof RESEARCH_PROGRESS_SCHEMA_VERSION
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

// --- bundled from src/branches.ts ---
export const RESEARCH_BRANCHES: ResearchBranchDefinition[] = [
  {
    id: 'digital_frontier',
    label: 'Digital Frontier',
    icon: '🧠',
    description:
      'National compute, subsea links, and research campuses — aligned with V10.5 AI compute and continental digital backbone programs.',
    anchorRegions: ['ACT', 'NSW', 'VIC'],
    primaryCapability: 'ai_compute_infrastructure',
    secondaryCapabilities: ['research_commercialization'],
    sectors: ['technology', 'research'],
  },
  {
    id: 'resource_innovation',
    label: 'Resource Innovation',
    icon: '⛏',
    description:
      'Automated mining and export corridors where Pilbara-scale mining meets digital freight and remote logistics.',
    anchorRegions: ['WA', 'QLD', 'NT'],
    primaryCapability: 'automated_mining',
    secondaryCapabilities: ['advanced_logistics'],
    sectors: ['mining', 'logistics', 'technology'],
  },
  {
    id: 'industrial_transformation',
    label: 'Industrial Transformation',
    icon: '🏭',
    description:
      'Advanced manufacturing precincts and research-to-industry pipelines across Victoria and NSW industrial belts.',
    anchorRegions: ['VIC', 'NSW', 'SA'],
    primaryCapability: 'advanced_manufacturing',
    secondaryCapabilities: ['research_commercialization'],
    sectors: ['manufacturing', 'research', 'technology'],
  },
  {
    id: 'energy_transition',
    label: 'Energy Transition',
    icon: '🔋',
    description:
      'Grid-scale storage, renewable supergrids, and hydrogen export — bounded modifiers through existing energy networks.',
    anchorRegions: ['SA', 'QLD', 'TAS'],
    primaryCapability: 'grid_scale_storage',
    secondaryCapabilities: ['advanced_manufacturing'],
    sectors: ['renewables', 'energy'],
  },
  {
    id: 'agri_water_systems',
    label: 'Agri–Water Systems',
    icon: '🌾',
    description:
      'Precision agriculture and advanced water systems for drought-era resilience without eliminating crisis gameplay.',
    anchorRegions: ['NSW', 'VIC', 'SA'],
    primaryCapability: 'precision_agriculture',
    secondaryCapabilities: ['advanced_water_systems'],
    sectors: ['agriculture'],
  },
  {
    id: 'sovereign_research',
    label: 'Sovereign Research',
    icon: '🔬',
    description:
      'Public-good research commercialization, CSIRO-aligned directorates, and nationally integrated research capability.',
    anchorRegions: ['ACT', 'TAS', 'NSW'],
    primaryCapability: 'research_commercialization',
    secondaryCapabilities: ['ai_compute_infrastructure'],
    sectors: ['research', 'technology', 'finance'],
  },
];

const n = (
  partial: Omit<ResearchBranchNodeDefinition, 'requiresNodes' | 'external' | 'diffusionSeed' | 'hookIds'> &
    Partial<Pick<ResearchBranchNodeDefinition, 'requiresNodes' | 'external' | 'diffusionSeed' | 'hookIds'>>
): ResearchBranchNodeDefinition => ({
  requiresNodes: [],
  external: [],
  diffusionSeed: 0.15,
  hookIds: [],
  ...partial,
});

export const RESEARCH_BRANCH_NODES: ResearchBranchNodeDefinition[] = [
  // --- digital_frontier ---
  n({
    id: 'df_t1_campus_foundation',
    branchId: 'digital_frontier',
    tier: 1,
    label: 'Campus Foundation',
    summary: 'Establish research campus capacity in Canberra or Sydney digital belt.',
    external: [{ kind: 'project_active', projectType: 'research_campus', regionId: 'ACT' }],
    hookIds: ['hook_df_campus_online'],
  }),
  n({
    id: 'df_t2_cable_backbone',
    branchId: 'digital_frontier',
    tier: 2,
    label: 'Subsea & Cable Backbone',
    summary: 'Link subsea cable hubs to national digital condition thresholds.',
    requiresNodes: ['df_t1_campus_foundation'],
    external: [{ kind: 'project_active', projectType: 'subsea_cable_hub' }],
    diffusionSeed: 0.22,
    hookIds: ['hook_df_digital_backbone'],
  }),
  n({
    id: 'df_t3_compute_cluster',
    branchId: 'digital_frontier',
    tier: 3,
    label: 'Compute Cluster',
    summary: 'Operational data-centre footprint with energy reliability gates.',
    requiresNodes: ['df_t2_cable_backbone'],
    external: [
      { kind: 'project_active', projectType: 'data_center' },
      { kind: 'capability', capability: 'ai_compute_infrastructure', minMaturity: 'emerging' },
    ],
    diffusionSeed: 0.28,
    hookIds: ['hook_df_ai_compute_operational'],
  }),
  n({
    id: 'df_t4_continental_integrated',
    branchId: 'digital_frontier',
    tier: 4,
    label: 'Continental Integration',
    summary: 'Late-game: continental digital backbone program + nationally integrated compute.',
    requiresNodes: ['df_t3_compute_cluster'],
    external: [
      { kind: 'megaproject_stage', program: 'continental_digital_backbone', minCompletedStages: 2 },
      { kind: 'capability', capability: 'ai_compute_infrastructure', minMaturity: 'nationally_integrated' },
    ],
    diffusionSeed: 0.35,
    hookIds: ['hook_endgame_digital_sovereignty'],
  }),
  n({
    id: 'df_t5_scale_wave_mesh',
    branchId: 'digital_frontier',
    tier: 5,
    label: 'Continental Research Mesh',
    summary: 'Scale wave: sovereign research tier-4 + integrated compute + digital backbone completion.',
    requiresNodes: ['df_t4_continental_integrated'],
    external: [
      { kind: 'branch_progress', branchId: 'sovereign_research', minTier: 4 },
      { kind: 'megaproject_stage', program: 'continental_digital_backbone', minCompletedStages: 4 },
    ],
    diffusionSeed: 0.4,
    hookIds: ['hook_scale_df_research_mesh'],
  }),

  // --- resource_innovation ---
  n({
    id: 'ri_t1_remote_logistics',
    branchId: 'resource_innovation',
    tier: 1,
    label: 'Remote Logistics Base',
    summary: 'Remote logistics supporting Pilbara or northern mining frontiers.',
    external: [{ kind: 'project_active', projectType: 'remote_logistics_base', regionId: 'WA' }],
    hookIds: ['hook_ri_remote_ops'],
  }),
  n({
    id: 'ri_t2_mining_tech',
    branchId: 'resource_innovation',
    tier: 2,
    label: 'Mining Tech Initiative',
    summary: 'Deliver mining technology contracts with technology sector strength.',
    requiresNodes: ['ri_t1_remote_logistics'],
    external: [
      { kind: 'contract_completed', contractType: 'mining_tech_initiative', minCount: 1 },
      { kind: 'sector_strength', regionId: 'WA', sector: 'mining', minScore: 35 },
    ],
    diffusionSeed: 0.2,
    hookIds: ['hook_ri_automation_path'],
  }),
  n({
    id: 'ri_t3_automated_mining',
    branchId: 'resource_innovation',
    tier: 3,
    label: 'Automated Mining Operational',
    summary: 'V10.5 automated mining capability at operational maturity in anchor region.',
    requiresNodes: ['ri_t2_mining_tech'],
    external: [{ kind: 'capability', capability: 'automated_mining', minMaturity: 'operational' }],
    diffusionSeed: 0.3,
    hookIds: ['hook_ri_export_corridor'],
  }),
  n({
    id: 'ri_t4_northern_export',
    branchId: 'resource_innovation',
    tier: 4,
    label: 'Northern Export Power',
    summary: 'Northern export corridor megaproject + scaled logistics capability.',
    requiresNodes: ['ri_t3_automated_mining'],
    external: [
      { kind: 'megaproject_stage', program: 'northern_export_corridor', minCompletedStages: 3 },
      { kind: 'capability', capability: 'advanced_logistics', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.32,
    hookIds: ['hook_endgame_resource_export'],
  }),
  n({
    id: 'ri_t5_scale_wave_autonomy',
    branchId: 'resource_innovation',
    tier: 5,
    label: 'Autonomous Export Mesh',
    summary: 'Scale wave: freight modernization + industrial tier-3+ absorbing mining automation outputs.',
    requiresNodes: ['ri_t4_northern_export'],
    external: [
      { kind: 'megaproject_stage', program: 'national_freight_modernization', minCompletedStages: 2 },
      { kind: 'branch_progress', branchId: 'industrial_transformation', minTier: 3 },
      { kind: 'capability', capability: 'automated_mining', minMaturity: 'nationally_integrated' },
    ],
    diffusionSeed: 0.38,
    hookIds: ['hook_scale_ri_autonomous_mesh'],
  }),

  // --- industrial_transformation ---
  n({
    id: 'it_t1_tech_park',
    branchId: 'industrial_transformation',
    tier: 1,
    label: 'Innovation Park',
    summary: 'Tech innovation park in Victoria or NSW manufacturing corridor.',
    external: [{ kind: 'project_active', projectType: 'tech_innovation_park', regionId: 'VIC' }],
    hookIds: ['hook_it_manufacturing_modernization'],
  }),
  n({
    id: 'it_t2_precinct',
    branchId: 'industrial_transformation',
    tier: 2,
    label: 'Advanced Precinct',
    summary: 'Advanced manufacturing precinct with energy and freight prerequisites.',
    requiresNodes: ['it_t1_tech_park'],
    external: [{ kind: 'project_active', projectType: 'advanced_manufacturing' }],
    diffusionSeed: 0.21,
    hookIds: ['hook_it_supply_chain_depth'],
  }),
  n({
    id: 'it_t3_commercialization',
    branchId: 'industrial_transformation',
    tier: 3,
    label: 'Research Commercialization',
    summary: 'Research commercialization capability demonstrated nationally.',
    requiresNodes: ['it_t2_precinct'],
    external: [{ kind: 'capability', capability: 'research_commercialization', minMaturity: 'demonstrated' }],
    diffusionSeed: 0.27,
    hookIds: ['hook_it_advanced_mfg_operational'],
  }),
  n({
    id: 'it_t4_integrated_economy',
    branchId: 'industrial_transformation',
    tier: 4,
    label: 'Integrated Industrial Economy',
    summary: 'Late-game: advanced manufacturing nationally integrated + council standing.',
    requiresNodes: ['it_t3_commercialization'],
    external: [
      { kind: 'capability', capability: 'advanced_manufacturing', minMaturity: 'nationally_integrated' },
      { kind: 'faction_standing', factionId: 'vic_technology_council', minStanding: 55 },
    ],
    diffusionSeed: 0.33,
    hookIds: ['hook_endgame_industrial_sovereignty'],
  }),
  n({
    id: 'it_t5_scale_wave_value_chain',
    branchId: 'industrial_transformation',
    tier: 5,
    label: 'National Value Chain',
    summary: 'Scale wave: HSR program progress + digital frontier tier-4 feeding manufacturing integration.',
    requiresNodes: ['it_t4_integrated_economy'],
    external: [
      { kind: 'megaproject_stage', program: 'national_high_speed_rail', minCompletedStages: 2 },
      { kind: 'branch_progress', branchId: 'digital_frontier', minTier: 4 },
    ],
    diffusionSeed: 0.37,
    hookIds: ['hook_scale_it_value_chain'],
  }),

  // --- energy_transition ---
  n({
    id: 'et_t1_renewable_grid',
    branchId: 'energy_transition',
    tier: 1,
    label: 'Renewable Grid Anchor',
    summary: 'Renewable grid project active in SA or QLD renewables belt.',
    external: [{ kind: 'project_active', projectType: 'renewable_grid', regionId: 'SA' }],
    hookIds: ['hook_et_supergrid_eligibility'],
  }),
  n({
    id: 'et_t2_storage_emerging',
    branchId: 'energy_transition',
    tier: 2,
    label: 'Storage Emerging',
    summary: 'Grid-scale storage capability emerging with hydro or hydrogen assets.',
    requiresNodes: ['et_t1_renewable_grid'],
    external: [
      { kind: 'capability', capability: 'grid_scale_storage', minMaturity: 'emerging' },
      { kind: 'project_active', projectType: 'hydro_expansion' },
    ],
    diffusionSeed: 0.24,
    hookIds: ['hook_et_energy_supergrid'],
  }),
  n({
    id: 'et_t3_hydrogen_export',
    branchId: 'energy_transition',
    tier: 3,
    label: 'Hydrogen Export Network',
    summary: 'Green hydrogen terminal + export network program progress.',
    requiresNodes: ['et_t2_storage_emerging'],
    external: [
      { kind: 'project_active', projectType: 'green_hydrogen_terminal' },
      { kind: 'megaproject_stage', program: 'green_hydrogen_export_network', minCompletedStages: 1 },
    ],
    diffusionSeed: 0.29,
    hookIds: ['hook_et_hydrogen_corridor'],
  }),
  n({
    id: 'et_t4_renewable_powerhouse',
    branchId: 'energy_transition',
    tier: 4,
    label: 'Renewable Powerhouse',
    summary: 'Endgame: eastern energy supergrid completed stages + scaled storage.',
    requiresNodes: ['et_t3_hydrogen_export'],
    external: [
      { kind: 'megaproject_stage', program: 'eastern_energy_supergrid', minCompletedStages: 4 },
      { kind: 'capability', capability: 'grid_scale_storage', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.34,
    hookIds: ['hook_endgame_renewable_dominance'],
  }),
  n({
    id: 'et_t5_scale_wave_hydrogen_dominance',
    branchId: 'energy_transition',
    tier: 5,
    label: 'Hydrogen Export Dominance',
    summary: 'Scale wave: hydrogen export network advanced stages + agri-water digital load balancing.',
    requiresNodes: ['et_t4_renewable_powerhouse'],
    external: [
      { kind: 'megaproject_stage', program: 'green_hydrogen_export_network', minCompletedStages: 3 },
      { kind: 'branch_progress', branchId: 'agri_water_systems', minTier: 3 },
    ],
    diffusionSeed: 0.39,
    hookIds: ['hook_scale_et_hydrogen_dominance'],
  }),

  // --- agri_water_systems ---
  n({
    id: 'aw_t1_water_security',
    branchId: 'agri_water_systems',
    tier: 1,
    label: 'Water Security Baseline',
    summary: 'Desalination or pipeline infrastructure addressing water need.',
    external: [{ kind: 'project_active', projectType: 'desalination_plant' }],
    hookIds: ['hook_aw_national_water_program'],
  }),
  n({
    id: 'aw_t2_precision_emerging',
    branchId: 'agri_water_systems',
    tier: 2,
    label: 'Precision Ag Emerging',
    summary: 'Precision agriculture emerging with digital connectivity in farm regions.',
    requiresNodes: ['aw_t1_water_security'],
    external: [{ kind: 'capability', capability: 'precision_agriculture', minMaturity: 'emerging' }],
    diffusionSeed: 0.23,
    hookIds: ['hook_aw_farm_technology'],
  }),
  n({
    id: 'aw_t3_advanced_water',
    branchId: 'agri_water_systems',
    tier: 3,
    label: 'Advanced Water Operational',
    summary: 'Advanced water systems operational — drought mitigation support active.',
    requiresNodes: ['aw_t2_precision_emerging'],
    external: [{ kind: 'capability', capability: 'advanced_water_systems', minMaturity: 'operational' }],
    diffusionSeed: 0.26,
    hookIds: ['hook_aw_drought_resilience'],
  }),
  n({
    id: 'aw_t4_ag_export',
    branchId: 'agri_water_systems',
    tier: 4,
    label: 'Agricultural Export Economy',
    summary: 'Late-game: national water security program + precision ag scaled.',
    requiresNodes: ['aw_t3_advanced_water'],
    external: [
      { kind: 'megaproject_stage', program: 'national_water_security', minCompletedStages: 3 },
      { kind: 'capability', capability: 'precision_agriculture', minMaturity: 'scaled' },
    ],
    diffusionSeed: 0.31,
    hookIds: ['hook_endgame_ag_export'],
  }),
  n({
    id: 'aw_t5_scale_wave_national_resilience',
    branchId: 'agri_water_systems',
    tier: 5,
    label: 'National Ag–Water Resilience',
    summary: 'Scale wave: water security program completion + energy transition tier-4 grid support.',
    requiresNodes: ['aw_t4_ag_export'],
    external: [
      { kind: 'megaproject_stage', program: 'national_water_security', minCompletedStages: 4 },
      { kind: 'branch_progress', branchId: 'energy_transition', minTier: 4 },
    ],
    diffusionSeed: 0.36,
    hookIds: ['hook_scale_aw_national_resilience'],
  }),

  // --- sovereign_research ---
  n({
    id: 'sr_t1_csiro_standing',
    branchId: 'sovereign_research',
    tier: 1,
    label: 'CSIRO Partnership',
    summary: 'CSIRO AI Directorate standing sufficient for national lab collaboration.',
    external: [{ kind: 'faction_standing', factionId: 'csiro_ai_directorate', minStanding: 40 }],
    hookIds: ['hook_sr_ai_research_contracts'],
  }),
  n({
    id: 'sr_t2_ai_research_center',
    branchId: 'sovereign_research',
    tier: 2,
    label: 'AI Research Center Delivered',
    summary: 'Complete ai_research_center contract in ACT research ecosystem.',
    requiresNodes: ['sr_t1_csiro_standing'],
    external: [{ kind: 'contract_completed', contractType: 'ai_research_center', minCount: 1 }],
    diffusionSeed: 0.25,
    hookIds: ['hook_sr_compute_network'],
  }),
  n({
    id: 'sr_t3_public_research',
    branchId: 'sovereign_research',
    tier: 3,
    label: 'Public Research Programs',
    summary: 'Australian AI compute network megaproject under construction or partial.',
    requiresNodes: ['sr_t2_ai_research_center'],
    external: [{ kind: 'megaproject_stage', program: 'australian_ai_compute_network', minCompletedStages: 2 }],
    diffusionSeed: 0.28,
    hookIds: ['hook_sr_commercialization_wave'],
  }),
  n({
    id: 'sr_t4_sovereign_integrated',
    branchId: 'sovereign_research',
    tier: 4,
    label: 'Sovereign Integrated Research',
    summary: 'Endgame: research commercialization nationally integrated + federal office alignment.',
    requiresNodes: ['sr_t3_public_research'],
    external: [
      { kind: 'capability', capability: 'research_commercialization', minMaturity: 'nationally_integrated' },
      { kind: 'faction_standing', factionId: 'federal_infrastructure_office', minStanding: 50 },
    ],
    diffusionSeed: 0.36,
    hookIds: ['hook_endgame_sovereign_research'],
  }),
  n({
    id: 'sr_t5_scale_wave_public_private',
    branchId: 'sovereign_research',
    tier: 5,
    label: 'Public–Private Research Compact',
    summary: 'Scale wave: three branches at tier-4+ and CSIRO at national integration standing.',
    requiresNodes: ['sr_t4_sovereign_integrated'],
    external: [
      { kind: 'branch_progress', branchId: 'digital_frontier', minTier: 4 },
      { kind: 'branch_progress', branchId: 'industrial_transformation', minTier: 4 },
      { kind: 'faction_standing', factionId: 'csiro_ai_directorate', minStanding: 78 },
    ],
    diffusionSeed: 0.42,
    hookIds: ['hook_scale_sr_public_private'],
  }),
];

export const RESEARCH_NODE_BY_ID: Record<string, ResearchBranchNodeDefinition> = Object.fromEntries(
  RESEARCH_BRANCH_NODES.map(node => [node.id, node])
);

export const RESEARCH_BRANCH_BY_ID = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, b])) as Record<
  ResearchBranchDefinition['id'],
  ResearchBranchDefinition
>;

// --- bundled from src/institutions.ts ---
export const RESEARCH_INSTITUTIONS: ResearchInstitutionDefinition[] = [
  {
    id: 'csiro_ai_directorate',
    name: 'CSIRO AI Directorate',
    type: 'national_lab',
    homeRegions: ['ACT'],
    supportedBranches: ['digital_frontier', 'sovereign_research'],
    readinessBonus: 12,
    minStanding: 35,
    preferredProjectTypes: ['research_campus', 'tech_innovation_park', 'data_center', 'subsea_cable_hub'],
    preferredContractTypes: ['ai_research_center'],
    description:
      'National research directorate — mirrors V9.4 faction csiro_ai_directorate; boosts digital and sovereign research branches in ACT and nationally when standing holds.',
  },
  {
    id: 'vic_technology_council',
    name: 'Victoria Technology Council',
    type: 'industry_council',
    homeRegions: ['VIC'],
    supportedBranches: ['industrial_transformation', 'digital_frontier'],
    readinessBonus: 10,
    minStanding: 30,
    preferredProjectTypes: ['tech_innovation_park', 'advanced_manufacturing', 'subsea_cable_hub', 'data_center'],
    preferredContractTypes: ['ai_research_center', 'mining_tech_initiative', 'manufacturing_modernization'],
    description:
      'Melbourne technology and advanced manufacturing coalition — accelerates industrial transformation readiness.',
  },
  {
    id: 'tas_innovation_network',
    name: 'Tasmanian Innovation Network',
    type: 'university_network',
    homeRegions: ['TAS'],
    supportedBranches: ['sovereign_research', 'digital_frontier'],
    readinessBonus: 8,
    minStanding: 25,
    preferredProjectTypes: ['subsea_cable_hub', 'tech_innovation_park'],
    preferredContractTypes: ['ai_research_center'],
    description:
      'Emergent Tasmania innovation network — contributes when faction status is active (see V9.4 emergent faction rules).',
  },
  {
    id: 'federal_infrastructure_office',
    name: 'Federal Infrastructure Office',
    type: 'federal_agency',
    homeRegions: ['ACT'],
    supportedBranches: ['energy_transition', 'agri_water_systems', 'sovereign_research'],
    readinessBonus: 9,
    minStanding: 40,
    preferredProjectTypes: ['research_campus', 'desalination_plant', 'inland_rail_hub', 'renewable_grid'],
    preferredContractTypes: ['defense_logistics_hub', 'disaster_relief_supply', 'water_security', 'crisis_recovery'],
    description:
      'Federal coordination for megaprojects and crisis recovery — late-game standing unlocks cross-branch diffusion bonuses.',
  },
  {
    id: 'unsw_research_alliance',
    name: 'UNSW Research Alliance',
    type: 'university_network',
    homeRegions: ['NSW'],
    supportedBranches: ['digital_frontier', 'industrial_transformation', 'sovereign_research'],
    readinessBonus: 7,
    minStanding: 20,
    preferredProjectTypes: ['research_campus', 'data_center'],
    preferredContractTypes: ['ai_research_center', 'manufacturing_modernization'],
    description: 'Sydney–Canberra research corridor — module-local institution for Operation 10M assembly (maps to regional contracts theme).',
  },
  {
    id: 'uq_energy_research',
    name: 'UQ Energy Research Consortium',
    type: 'university_network',
    homeRegions: ['QLD'],
    supportedBranches: ['energy_transition', 'resource_innovation'],
    readinessBonus: 6,
    minStanding: 20,
    preferredProjectTypes: ['renewable_grid', 'green_hydrogen_terminal', 'remote_logistics_base'],
    preferredContractTypes: ['mining_tech_initiative'],
    description: 'Queensland energy and mining research consortium supporting transition and resource innovation branches.',
  },
];

export const RESEARCH_INSTITUTION_BY_ID = Object.fromEntries(
  RESEARCH_INSTITUTIONS.map(i => [i.id, i])
);

/** Regions that receive spillover readiness from an institution home region. */
export const INSTITUTION_DIFFUSION_NEIGHBORS: Record<string, string[]> = {
  ACT: ['NSW', 'VIC'],
  NSW: ['ACT', 'VIC', 'QLD'],
  VIC: ['NSW', 'SA', 'TAS'],
  QLD: ['NSW', 'NT'],
  SA: ['VIC', 'WA', 'NT'],
  WA: ['SA', 'NT'],
  TAS: ['VIC'],
  NT: ['QLD', 'WA', 'SA'],
  AAT: [],
};

// --- bundled from src/prerequisites.ts ---
export interface PrerequisiteEvaluation {
  nodeId: string;
  satisfied: boolean;
  missingNodeIds: string[];
  unmetExternal: ResearchExternalPrerequisite[];
  detail: string[];
}

function countContracts(inputs: ResearchProgressInputs, contractType: string): number {
  return inputs.completedContracts.filter(c => c.contractType === contractType).length;
}

function projectActive(
  inputs: ResearchProgressInputs,
  projectType: string,
  regionId?: string
): boolean {
  return inputs.projects.some(
    p =>
      p.projectType === projectType &&
      AGENT03_ACTIVE_PROJECT.test(p.status) &&
      (regionId == null || p.regionId === regionId)
  );
}

function capabilityAtLeast(
  inputs: ResearchProgressInputs,
  capability: string,
  minMaturity: keyof typeof V94_CAPABILITY_MATURITY_RANK
): boolean {
  const cap = inputs.capabilities[capability as keyof typeof inputs.capabilities];
  if (!cap) return false;
  return V94_CAPABILITY_MATURITY_RANK[cap.maturity] >= V94_CAPABILITY_MATURITY_RANK[minMaturity];
}

function megaprojectStages(inputs: ResearchProgressInputs, program: string): number {
  return inputs.megaprojects[program as keyof typeof inputs.megaprojects]?.completedStages ?? 0;
}

function factionStanding(inputs: ResearchProgressInputs, factionId: string): number {
  return inputs.factionStanding[factionId as keyof typeof inputs.factionStanding] ?? 0;
}

function sectorScore(inputs: ResearchProgressInputs, regionId: string, sector: string): number {
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  return Number(region.sectors[sector as keyof typeof region.sectors] ?? 0);
}

function maxTierOnBranch(unlockedNodeIds: Set<string>, branchId: string): number {
  let max = 0;
  for (const id of unlockedNodeIds) {
    const node = RESEARCH_NODE_BY_ID[id];
    if (node?.branchId === branchId) max = Math.max(max, node.tier);
  }
  return max;
}

export function evaluateExternalPrerequisite(
  inputs: ResearchProgressInputs,
  req: ResearchExternalPrerequisite,
  unlockedNodeIds: Set<string> = new Set()
): boolean {
  switch (req.kind) {
    case 'capability':
      return capabilityAtLeast(inputs, req.capability, req.minMaturity);
    case 'project_active':
      return projectActive(inputs, req.projectType, req.regionId);
    case 'contract_completed':
      return countContracts(inputs, req.contractType) >= (req.minCount ?? 1);
    case 'megaproject_stage':
      return megaprojectStages(inputs, req.program) >= req.minCompletedStages;
    case 'faction_standing':
      return factionStanding(inputs, req.factionId) >= req.minStanding;
    case 'sector_strength':
      return sectorScore(inputs, req.regionId, req.sector) >= req.minScore;
    case 'branch_progress':
      return maxTierOnBranch(unlockedNodeIds, req.branchId) >= req.minTier;
    default:
      return false;
  }
}

export function evaluateNodePrerequisites(
  inputs: ResearchProgressInputs,
  nodeId: string,
  unlockedNodeIds: Set<string>
): PrerequisiteEvaluation {
  const def = RESEARCH_NODE_BY_ID[nodeId];
  if (!def) {
    return {
      nodeId,
      satisfied: false,
      missingNodeIds: [],
      unmetExternal: [],
      detail: ['unknown node'],
    };
  }

  const missingNodeIds = def.requiresNodes.filter(id => !unlockedNodeIds.has(id));
  const unmetExternal = def.external.filter(ext => !evaluateExternalPrerequisite(inputs, ext, unlockedNodeIds));
  const satisfied = missingNodeIds.length === 0 && unmetExternal.length === 0;

  const detail: string[] = [];
  missingNodeIds.forEach(id => detail.push(`requires node ${id}`));
  unmetExternal.forEach(ext => detail.push(`external:${ext.kind}`));

  return { nodeId, satisfied, missingNodeIds, unmetExternal, detail };
}

/** Topological order for branch nodes (respects requiresNodes only). */
export function branchNodeTopologicalOrder(branchId: string): string[] {
  const nodes = Object.values(RESEARCH_NODE_BY_ID).filter(n => n.branchId === branchId);
  const ids = new Set(nodes.map(n => n.id));
  const order: string[] = [];
  const visited = new Set<string>();

  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (!def) return;
    def.requiresNodes.filter(r => ids.has(r)).forEach(visit);
    order.push(id);
  };

  nodes.sort((a, b) => a.tier - b.tier).forEach(n => visit(n.id));
  return order;
}

export function detectPrerequisiteCycle(): string | null {
  const visiting = new Set<string>();
  const done = new Set<string>();

  const dfs = (id: string): string | null => {
    if (done.has(id)) return null;
    if (visiting.has(id)) return id;
    visiting.add(id);
    const def = RESEARCH_NODE_BY_ID[id];
    if (def) {
      for (const pre of def.requiresNodes) {
        const cycle = dfs(pre);
        if (cycle) return cycle;
      }
    }
    visiting.delete(id);
    done.add(id);
    return null;
  };

  for (const id of Object.keys(RESEARCH_NODE_BY_ID)) {
    const c = dfs(id);
    if (c) return `cycle at ${c}`;
  }
  return null;
}

// --- bundled from src/institution-upgrades.ts ---
export const INSTITUTION_UPGRADE_TIER_RANK: Record<InstitutionUpgradeTier, number> = {
  dormant: 0,
  affiliate: 1,
  partner: 2,
  strategic: 3,
  national_integration: 4,
};

export const INSTITUTION_UPGRADE_LABEL: Record<InstitutionUpgradeTier, string> = {
  dormant: 'Dormant',
  affiliate: 'Affiliate',
  partner: 'Research Partner',
  strategic: 'Strategic Alliance',
  national_integration: 'National Integration',
};

export interface InstitutionUpgradeThresholds {
  partnerStandingDelta: number;
  strategicMinBranchTier: 3 | 4;
  nationalStanding: number;
}

export const DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS: InstitutionUpgradeThresholds = {
  partnerStandingDelta: 12,
  strategicMinBranchTier: 3,
  nationalStanding: 72,
};


function standing(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
}

function hasPreferredProject(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): boolean {
  return inputs.projects.some(
    p =>
      AGENT03_ACTIVE_PROJECT.test(p.status) &&
      inst.preferredProjectTypes.includes(p.projectType as (typeof inst.preferredProjectTypes)[number])
  );
}

function preferredContractCount(inputs: ResearchProgressInputs, inst: ResearchInstitutionDefinition): number {
  return inputs.completedContracts.filter(c =>
    inst.preferredContractTypes.includes(c.contractType as (typeof inst.preferredContractTypes)[number])
  ).length;
}

function maxUnlockedTierOnBranches(
  unlocked: UnlockedResearchNode[],
  branches: ResearchBranchId[]
): number {
  let max = 0;
  for (const u of unlocked) {
    if (!branches.includes(u.branchId)) continue;
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    if (tier > max) max = tier;
  }
  return max;
}

export function evaluateInstitutionUpgrade(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  inst: ResearchInstitutionDefinition,
  thresholds: InstitutionUpgradeThresholds = DEFAULT_INSTITUTION_UPGRADE_THRESHOLDS
): InstitutionUpgradeState {
  const st = standing(inputs, inst);
  const reasons: string[] = [];

  if (st < inst.minStanding) {
    return {
      institutionId: inst.id,
      tier: 'dormant',
      readinessMultiplier: 0,
      diffusionMultiplier: 0,
      assessedTurn: inputs.turn,
      reasons: ['standing below minimum'],
    };
  }

  let tier: InstitutionUpgradeTier = 'affiliate';
  reasons.push('affiliate standing');

  const partnerFloor = inst.minStanding + thresholds.partnerStandingDelta;
  const partnerEvidence =
    st >= partnerFloor && (hasPreferredProject(inputs, inst) || preferredContractCount(inputs, inst) >= 1);
  if (partnerEvidence) {
    tier = 'partner';
    reasons.push('partner project or contract evidence');
  }

  const branchTier = maxUnlockedTierOnBranches(unlocked, inst.supportedBranches);
  if (tier === 'partner' && branchTier >= thresholds.strategicMinBranchTier) {
    tier = 'strategic';
    reasons.push(`tier-${branchTier} branch unlock on supported path`);
  }

  if (
    tier === 'strategic' &&
    (branchTier >= 4 || st >= thresholds.nationalStanding)
  ) {
    tier = 'national_integration';
    reasons.push(branchTier >= 4 ? 'tier-4 branch integration' : 'exceptional standing');
  }

  const rank = INSTITUTION_UPGRADE_TIER_RANK[tier];
  return {
    institutionId: inst.id,
    tier,
    readinessMultiplier: rank === 0 ? 0 : 1 + rank * 0.1,
    diffusionMultiplier: rank === 0 ? 0 : 1 + rank * 0.14,
    assessedTurn: inputs.turn,
    reasons,
  };
}

export function computeInstitutionUpgrades(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): InstitutionUpgradeState[] {
  return RESEARCH_INSTITUTIONS.map(inst => evaluateInstitutionUpgrade(inputs, unlocked, inst)).sort((a, b) =>
    a.institutionId.localeCompare(b.institutionId)
  );
}

export function institutionUpgradesById(
  upgrades: InstitutionUpgradeState[]
): Record<string, InstitutionUpgradeState> {
  return Object.fromEntries(upgrades.map(u => [u.institutionId, u]));
}

// --- bundled from src/late-game-diffusion.ts ---
/** Late-game cascade: max graph hops from integrated anchor regions. */
export const LATE_GAME_CASCADE_MAX_HOPS = 3;
export const LATE_GAME_CASCADE_DECAY = 0.52;
export const LATE_GAME_INTEGRATED_THRESHOLD = 0.68;


function undirectedNeighbors(regionId: string): string[] {
  const out = new Set<string>(INSTITUTION_DIFFUSION_NEIGHBORS[regionId] || []);
  for (const [home, list] of Object.entries(INSTITUTION_DIFFUSION_NEIGHBORS)) {
    if (list.includes(regionId)) out.add(home);
  }
  return [...out];
}

function countTier4Unlocks(unlocked: UnlockedResearchNode[]): number {
  return unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 4).length;
}

function countNationalInstitutions(upgrades: InstitutionUpgradeState[]): number {
  return upgrades.filter(u => u.tier === 'national_integration').length;
}

/**
 * After base diffusion, propagate surplus from integrated regions along neighbor graph.
 * Activates when at least one tier-4 branch node is unlocked OR an institution hits national integration.
 */
export function applyLateGameDiffusionCascade(
  base: RegionalDiffusionCell[],
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[]
): { cells: RegionalDiffusionCell[]; report: LateGameDiffusionReport } {
  const tier4 = countTier4Unlocks(unlocked);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const nationalInst = countNationalInstitutions(institutionUpgrades);
  const trigger =
    tier4 > 0 && nationalInst > 0
      ? 'both'
      : tier4 > 0 || tier5 > 0
        ? 'tier4_unlock'
        : nationalInst > 0
          ? 'national_institution'
          : 'none';
  const active = trigger !== 'none';

  const scores: Record<string, number> = Object.fromEntries(base.map(c => [c.regionId, c.score]));
  const cascadeBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const pulses: LateGameDiffusionPulse[] = [];

  if (active) {
    const sources = base.filter(c => c.score >= LATE_GAME_INTEGRATED_THRESHOLD || c.level === 'integrated');
    const visitedDepth = new Map<string, number>();

    for (const src of sources) {
      const queue: Array<{ id: string; hops: number; strength: number }> = [
        { id: src.regionId, hops: 0, strength: src.score },
      ];
      visitedDepth.set(`${src.regionId}:0`, 0);

      while (queue.length) {
        const cur = queue.shift()!;
        if (cur.hops >= LATE_GAME_CASCADE_MAX_HOPS) continue;

        for (const nxt of undirectedNeighbors(cur.id)) {
          const nextHop = cur.hops + 1;
          const key = `${nxt}:${nextHop}`;
          if (visitedDepth.has(key)) continue;
          visitedDepth.set(key, nextHop);

          const strength = cur.strength * LATE_GAME_CASCADE_DECAY * (1 + nationalInst * 0.04);
          if (strength < 0.015) continue;

          cascadeBoost[nxt] = (cascadeBoost[nxt] ?? 0) + strength;
          pulses.push({
            fromRegionId: src.regionId as V94AustralianRegionCode,
            toRegionId: nxt as V94AustralianRegionCode,
            hops: nextHop,
            strength: Math.round(strength * 1000) / 1000,
          });

          queue.push({ id: nxt, hops: nextHop, strength });
        }
      }
    }
  }

  const cap = 0.85;
  const cells = base.map(cell => {
    const add = cascadeBoost[cell.regionId] ?? 0;
    const score = Math.min(cap, Math.round((cell.score + add) * 1000) / 1000);
    return {
      ...cell,
      score,
      cascadeBoost: Math.round(add * 1000) / 1000,
      level:
        score >= 0.68 ? 'integrated' : score >= 0.42 ? 'adopting' : score >= 0.18 ? 'aware' : 'latent',
      sourceNodeIds: add > 0 ? [...cell.sourceNodeIds, 'late_game_cascade'] : cell.sourceNodeIds,
    };
  });

  const nationalPenetration =
    cells.reduce((s, c) => s + c.score, 0) / Math.max(1, cells.length);

  return {
    cells,
    report: {
      active,
      trigger,
      tier4UnlockCount: tier4,
      nationalInstitutionCount: nationalInst,
      pulses: pulses.slice(0, 48),
      nationalPenetration: Math.round(nationalPenetration * 1000) / 1000,
    },
  };
}

export function topInstitutionUpgradeTier(upgrades: InstitutionUpgradeState[]): InstitutionUpgradeState | null {
  const sorted = upgrades
    .slice()
    .sort(
      (a, b) =>
        INSTITUTION_UPGRADE_TIER_RANK[b.tier] - INSTITUTION_UPGRADE_TIER_RANK[a.tier] ||
        b.readinessMultiplier - a.readinessMultiplier
    );
  return sorted[0]?.tier === 'dormant' ? null : sorted[0];
}

// --- bundled from src/diffusion.ts ---
/** Aligned with V10.5 V105_THRESHOLDS.diffusionCap (0.85) — branch overlay uses same cap. */
export const DIFFUSION_CAP = 0.85;

const LEVEL_THRESHOLDS = {
  latent: 0,
  aware: 0.18,
  adopting: 0.42,
  integrated: 0.68,
} as const;

function diffusionLevel(score: number): RegionalDiffusionCell['level'] {
  if (score >= LEVEL_THRESHOLDS.integrated) return 'integrated';
  if (score >= LEVEL_THRESHOLDS.adopting) return 'adopting';
  if (score >= LEVEL_THRESHOLDS.aware) return 'aware';
  return 'latent';
}

function institutionDiffusionBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  upgrades: Record<string, InstitutionUpgradeState>
): number {
  let boost = 0;
  for (const inst of RESEARCH_INSTITUTIONS) {
    const upgrade = upgrades[inst.id];
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding];
    if (standing == null || standing < inst.minStanding) continue;
    const mult = upgrade?.diffusionMultiplier ?? 1;
    const inHome = inst.homeRegions.includes(regionId);
    const neighborOfHome = inst.homeRegions.some(h =>
      (INSTITUTION_DIFFUSION_NEIGHBORS[h] || []).includes(regionId)
    );
    if (inHome) boost += inst.readinessBonus * 0.008 * mult;
    else if (neighborOfHome) boost += inst.readinessBonus * 0.004 * mult;
  }
  return boost;
}

function sectorAlignmentBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  branchId: string
): number {
  const branch = RESEARCH_BRANCH_BY_ID[branchId as keyof typeof RESEARCH_BRANCH_BY_ID];
  if (!branch) return 0;
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  let sum = 0;
  for (const sec of branch.sectors) {
    sum += Number(region.sectors[sec] ?? 0);
  }
  return Math.min(0.12, sum / 400);
}

/**
 * Spread research influence from unlocked nodes into regional diffusion grid.
 */
export function computeRegionalDiffusion(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[] = []
): RegionalDiffusionCell[] {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const scores: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const institutionBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const sources: Record<string, Set<string>> = Object.fromEntries(
    V94_REGION_CODES.map(c => [c, new Set<string>()])
  );

  for (const u of unlocked) {
    const node = RESEARCH_NODE_BY_ID[u.nodeId];
    if (!node) continue;
    const seed = node.diffusionSeed;
    const branch = RESEARCH_BRANCH_BY_ID[node.branchId];
    const anchors = branch?.anchorRegions ?? [];

    for (const code of V94_REGION_CODES) {
      let add = seed * 0.35;
      if (u.anchorRegionId === code) add += seed * 0.45;
      else if (anchors.includes(code)) add += seed * 0.25;
      add += sectorAlignmentBoost(inputs, code, node.branchId);
      const instAdd = institutionDiffusionBoost(inputs, code, upgrades);
      add += instAdd;
      institutionBoost[code] = (institutionBoost[code] ?? 0) + instAdd;
      if (add > 0) {
        scores[code] = Math.min(DIFFUSION_CAP, (scores[code] ?? 0) + add);
        sources[code]?.add(u.nodeId);
      }
    }
  }

  return V94_REGION_CODES.map(regionId => ({
    regionId,
    score: Math.round((scores[regionId] ?? 0) * 1000) / 1000,
    level: diffusionLevel(scores[regionId] ?? 0),
    sourceNodeIds: [...(sources[regionId] ?? [])],
    institutionBoost: Math.round((institutionBoost[regionId] ?? 0) * 1000) / 1000,
    cascadeBoost: 0,
  }));
}

export function pickLeadingResearchRegion(cells: RegionalDiffusionCell[]): V94AustralianRegionCode | null {
  const sorted = cells.slice().sort((a, b) => b.score - a.score);
  return sorted[0]?.score > 0 ? sorted[0].regionId : null;
}

// --- bundled from src/strategy-hooks.ts ---
export const STRATEGY_HOOKS: StrategyHookDefinition[] = [
  {
    id: 'hook_df_campus_online',
    title: 'Research campus online',
    phase: 'mid',
    description: 'Prioritize ACT research campus upgrades and Research Funds contracts.',
    targets: {
      projectTypes: ['research_campus', 'tech_innovation_park'],
      contractTypes: ['ai_research_center'],
      factions: ['csiro_ai_directorate'],
    },
    branchIds: ['digital_frontier'],
  },
  {
    id: 'hook_df_digital_backbone',
    title: 'Digital backbone push',
    phase: 'mid',
    description: 'Invest in subsea cable hubs and continental digital backbone eligibility.',
    targets: {
      megaprojects: ['continental_digital_backbone'],
      projectTypes: ['subsea_cable_hub', 'data_center'],
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'emerging' }],
    },
    branchIds: ['digital_frontier'],
  },
  {
    id: 'hook_df_ai_compute_operational',
    title: 'AI compute operational',
    phase: 'late',
    description: 'Balance energy reliability with data-centre expansion — routes through V10.5 modifier hooks only.',
    targets: {
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'operational' }],
      megaprojects: ['australian_ai_compute_network'],
      projectTypes: ['data_center', 'research_campus'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_digital_sovereignty',
    title: 'Digital sovereignty (endgame)',
    phase: 'endgame',
    description: 'Complete continental backbone and nationally integrated compute — late-game strategy panel anchor.',
    targets: {
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'nationally_integrated' }],
      megaprojects: ['continental_digital_backbone', 'australian_ai_compute_network'],
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_ri_remote_ops',
    title: 'Remote operations',
    phase: 'mid',
    description: 'Remote logistics bases in WA/NT mining frontiers.',
    targets: { projectTypes: ['remote_logistics_base', 'freight_rail_upgrade'] },
    branchIds: ['resource_innovation'],
  },
  {
    id: 'hook_ri_automation_path',
    title: 'Automation path',
    phase: 'mid',
    description: 'Mining tech contracts and technology sector momentum in Pilbara-scale regions.',
    targets: {
      contractTypes: ['mining_tech_initiative'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'emerging' }],
    },
    branchIds: ['resource_innovation'],
  },
  {
    id: 'hook_ri_export_corridor',
    title: 'Export corridor',
    phase: 'late',
    description: 'Align automated mining with northern export corridor megaproject stages.',
    targets: {
      megaprojects: ['northern_export_corridor'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'operational' }, { id: 'advanced_logistics', aimMaturity: 'demonstrated' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_resource_export',
    title: 'Resource export endgame',
    phase: 'endgame',
    description: 'Scaled logistics + northern corridor completion — ties to national development directions.',
    targets: {
      megaprojects: ['northern_export_corridor', 'national_freight_modernization'],
      capabilities: [{ id: 'advanced_logistics', aimMaturity: 'scaled' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_it_manufacturing_modernization',
    title: 'Manufacturing modernization',
    phase: 'mid',
    description: 'Tech parks and manufacturing_modernization contracts in Victoria.',
    targets: {
      projectTypes: ['tech_innovation_park'],
      contractTypes: ['manufacturing_modernization'],
      factions: ['vic_technology_council'],
    },
    branchIds: ['industrial_transformation'],
  },
  {
    id: 'hook_it_supply_chain_depth',
    title: 'Supply chain depth',
    phase: 'mid',
    description: 'Advanced manufacturing precincts with energy and freight inputs.',
    targets: { projectTypes: ['advanced_manufacturing', 'inland_rail_hub'] },
    branchIds: ['industrial_transformation'],
  },
  {
    id: 'hook_it_advanced_mfg_operational',
    title: 'Advanced manufacturing operational',
    phase: 'late',
    description: 'Research commercialization demonstrated — link campuses to precincts.',
    targets: {
      capabilities: [
        { id: 'research_commercialization', aimMaturity: 'demonstrated' },
        { id: 'advanced_manufacturing', aimMaturity: 'operational' },
      ],
      projectTypes: ['research_campus', 'advanced_manufacturing'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_industrial_sovereignty',
    title: 'Industrial sovereignty',
    phase: 'endgame',
    description: 'Nationally integrated manufacturing with Victoria Technology Council backing.',
    targets: {
      capabilities: [{ id: 'advanced_manufacturing', aimMaturity: 'nationally_integrated' }],
      factions: ['vic_technology_council'],
      megaprojects: ['eastern_energy_supergrid'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_et_supergrid_eligibility',
    title: 'Supergrid eligibility',
    phase: 'mid',
    description: 'Renewable grids in SA/QLD — prerequisite for eastern energy supergrid.',
    targets: { projectTypes: ['renewable_grid', 'hydro_expansion'], megaprojects: ['eastern_energy_supergrid'] },
    branchIds: ['energy_transition'],
  },
  {
    id: 'hook_et_energy_supergrid',
    title: 'Energy supergrid',
    phase: 'late',
    description: 'Grid-scale storage emerging — energy network condition gates remain in V10.5.',
    targets: {
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'emerging' }],
      megaprojects: ['eastern_energy_supergrid'],
    },
    branchIds: ['energy_transition'],
  },
  {
    id: 'hook_et_hydrogen_corridor',
    title: 'Hydrogen corridor',
    phase: 'late',
    description: 'Green hydrogen terminal + export network program.',
    targets: {
      projectTypes: ['green_hydrogen_terminal'],
      megaprojects: ['green_hydrogen_export_network'],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_renewable_dominance',
    title: 'Renewable dominance',
    phase: 'endgame',
    description: 'Scaled storage after supergrid completion — invites manufacturing energy demand tradeoff.',
    targets: {
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'scaled' }],
      megaprojects: ['eastern_energy_supergrid', 'green_hydrogen_export_network'],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_aw_national_water_program',
    title: 'National water program',
    phase: 'mid',
    description: 'Desalination/pipeline assets feeding national_water_security program.',
    targets: {
      projectTypes: ['desalination_plant', 'water_pipeline'],
      megaprojects: ['national_water_security'],
      contractTypes: ['water_security'],
    },
    branchIds: ['agri_water_systems'],
  },
  {
    id: 'hook_aw_farm_technology',
    title: 'Farm technology',
    phase: 'mid',
    description: 'Precision agriculture emerging — digital connectivity in farm regions required.',
    targets: { capabilities: [{ id: 'precision_agriculture', aimMaturity: 'emerging' }] },
    branchIds: ['agri_water_systems'],
  },
  {
    id: 'hook_aw_drought_resilience',
    title: 'Drought resilience',
    phase: 'late',
    description: 'Advanced water operational — crisis mitigation support, not immunity.',
    targets: { capabilities: [{ id: 'advanced_water_systems', aimMaturity: 'operational' }] },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_ag_export',
    title: 'Agricultural export endgame',
    phase: 'endgame',
    description: 'National water security + scaled precision agriculture.',
    targets: {
      megaprojects: ['national_water_security'],
      capabilities: [{ id: 'precision_agriculture', aimMaturity: 'scaled' }],
    },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_sr_ai_research_contracts',
    title: 'AI research contracts',
    phase: 'mid',
    description: 'Raise CSIRO standing and bid ai_research_center contracts.',
    targets: { contractTypes: ['ai_research_center'], factions: ['csiro_ai_directorate'] },
    branchIds: ['sovereign_research'],
  },
  {
    id: 'hook_sr_compute_network',
    title: 'Compute network',
    phase: 'late',
    description: 'Australian AI compute network megaproject stages after research center delivery.',
    targets: { megaprojects: ['australian_ai_compute_network'], projectTypes: ['data_center', 'research_campus'] },
    branchIds: ['sovereign_research'],
  },
  {
    id: 'hook_sr_commercialization_wave',
    title: 'Commercialization wave',
    phase: 'late',
    description: 'Bridge sovereign research into manufacturing and technology sectors.',
    targets: {
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'operational' }],
      projectTypes: ['research_campus', 'tech_innovation_park'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 3,
  },
  {
    id: 'hook_endgame_sovereign_research',
    title: 'Sovereign research endgame',
    phase: 'endgame',
    description: 'Nationally integrated research commercialization with federal infrastructure alignment.',
    targets: {
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'nationally_integrated' }],
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
      megaprojects: ['australian_ai_compute_network', 'national_high_speed_rail'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 4,
  },
  {
    id: 'hook_scale_df_research_mesh',
    title: 'Continental research mesh',
    phase: 'endgame',
    description: 'Scale wave capstone: mesh sovereign research with completed digital backbone.',
    targets: {
      megaprojects: ['continental_digital_backbone', 'australian_ai_compute_network'],
      capabilities: [{ id: 'ai_compute_infrastructure', aimMaturity: 'nationally_integrated' }],
      factions: ['csiro_ai_directorate'],
    },
    branchIds: ['digital_frontier'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_ri_autonomous_mesh',
    title: 'Autonomous export mesh',
    phase: 'endgame',
    description: 'Scale wave: nationally integrated automated mining + freight modernization.',
    targets: {
      megaprojects: ['northern_export_corridor', 'national_freight_modernization'],
      capabilities: [{ id: 'automated_mining', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['resource_innovation'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_it_value_chain',
    title: 'National value chain',
    phase: 'endgame',
    description: 'Scale wave: HSR-linked manufacturing fed by continental compute.',
    targets: {
      megaprojects: ['national_high_speed_rail'],
      capabilities: [{ id: 'advanced_manufacturing', aimMaturity: 'nationally_integrated' }],
      projectTypes: ['advanced_manufacturing', 'data_center'],
    },
    branchIds: ['industrial_transformation'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_et_hydrogen_dominance',
    title: 'Hydrogen export dominance',
    phase: 'endgame',
    description: 'Scale wave: hydrogen export network + cross-sector load from agri-water digitization.',
    targets: {
      megaprojects: ['green_hydrogen_export_network', 'eastern_energy_supergrid'],
      capabilities: [{ id: 'grid_scale_storage', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['energy_transition'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_aw_national_resilience',
    title: 'National ag–water resilience',
    phase: 'endgame',
    description: 'Scale wave: completed water security with supergrid-backed desal energy.',
    targets: {
      megaprojects: ['national_water_security'],
      capabilities: [{ id: 'precision_agriculture', aimMaturity: 'nationally_integrated' }],
    },
    branchIds: ['agri_water_systems'],
    minUnlockedTier: 5,
  },
  {
    id: 'hook_scale_sr_public_private',
    title: 'Public–private research compact',
    phase: 'endgame',
    description: 'Scale wave: CSIRO national integration with dual tier-4 industrial/digital branches.',
    targets: {
      factions: ['csiro_ai_directorate', 'federal_infrastructure_office'],
      capabilities: [{ id: 'research_commercialization', aimMaturity: 'nationally_integrated' }],
      megaprojects: ['australian_ai_compute_network'],
    },
    branchIds: ['sovereign_research'],
    minUnlockedTier: 5,
  },
];

export const STRATEGY_HOOK_BY_ID = Object.fromEntries(STRATEGY_HOOKS.map(h => [h.id, h]));

export function resolveActiveStrategyHooks(unlockedNodeIds: Set<string>): StrategyHookDefinition[] {
  const maxTierByBranch: Record<string, number> = {};
  for (const id of unlockedNodeIds) {
    const node = RESEARCH_NODE_BY_ID[id];
    if (!node) continue;
    maxTierByBranch[node.branchId] = Math.max(maxTierByBranch[node.branchId] ?? 0, node.tier);
  }

  const active = new Set<string>();
  for (const id of unlockedNodeIds) {
    RESEARCH_NODE_BY_ID[id]?.hookIds.forEach(h => active.add(h));
  }

  return STRATEGY_HOOKS.filter(h => {
    if (!active.has(h.id)) return false;
    if (!h.minUnlockedTier) return true;
    return h.branchIds.some(b => (maxTierByBranch[b] ?? 0) >= h.minUnlockedTier!);
  });
}

// --- bundled from src/scale-wave.ts ---
/** Pairs of branches that exchange technology transfer when both reach tier 3+. */
export const TECHNOLOGY_TRANSFER_PAIRS: Array<[ResearchBranchId, ResearchBranchId]> = [
  ['digital_frontier', 'industrial_transformation'],
  ['digital_frontier', 'sovereign_research'],
  ['resource_innovation', 'industrial_transformation'],
  ['energy_transition', 'agri_water_systems'],
  ['sovereign_research', 'industrial_transformation'],
  ['energy_transition', 'digital_frontier'],
];

function maxTierByBranch(unlocked: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const tiers = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of unlocked) {
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    tiers[u.branchId] = Math.max(tiers[u.branchId], tier);
  }
  return tiers;
}

export function computeTechnologyTransferLinks(
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['technologyTransferLinks'] {
  const tiers = maxTierByBranch(unlocked);
  const links: ResearchScaleWaveReport['technologyTransferLinks'] = [];
  for (const [a, b] of TECHNOLOGY_TRANSFER_PAIRS) {
    const ta = tiers[a];
    const tb = tiers[b];
    if (ta >= 3 && tb >= 3) {
      const strength = Math.round(((ta + tb) / 10) * 100) / 100;
      links.push({ fromBranch: a, toBranch: b, strength });
    }
  }
  return links.sort((x, y) => y.strength - x.strength);
}

export function computeCrossBranchSynergyScore(unlocked: UnlockedResearchNode[]): number {
  const tiers = maxTierByBranch(unlocked);
  const values = Object.values(tiers).filter(t => t >= 3);
  if (values.length < 2) return 0;
  const avg = values.reduce((s, t) => s + t, 0) / values.length;
  const spread = Math.max(...values) - Math.min(...values);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  return Math.round(Math.min(100, avg * 12 + values.length * 4 + tier5 * 6 - spread * 2));
}

export function pickDominantCapabilityCluster(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport['dominantCapabilityCluster'] {
  const tiers = maxTierByBranch(unlocked);
  let bestBranch: ResearchBranchId | null = null;
  let best = 0;
  for (const b of RESEARCH_BRANCHES) {
    const score = tiers[b.id] * 10 + (inputs.capabilities[b.primaryCapability] ? 15 : 0);
    if (score > best) {
      best = score;
      bestBranch = b.id;
    }
  }
  if (!bestBranch) return null;
  return RESEARCH_BRANCHES.find(b => b.id === bestBranch)?.primaryCapability ?? null;
}

export function computeResearchScaleWaveReport(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[]
): ResearchScaleWaveReport {
  const tier5UnlockCount = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const crossBranchSynergyScore = computeCrossBranchSynergyScore(unlocked);
  const technologyTransferLinks = computeTechnologyTransferLinks(unlocked);
  return {
    active: tier5UnlockCount > 0 || crossBranchSynergyScore >= 40,
    tier5UnlockCount,
    crossBranchSynergyScore,
    technologyTransferLinks,
    dominantCapabilityCluster: pickDominantCapabilityCluster(inputs, unlocked),
  };
}

/** Applies bounded readiness uplift from synergy + transfer (does not bypass V10.5 caps). */
export function applyScaleWaveReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchScaleWaveReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const bonus = Math.min(8, Math.floor(report.crossBranchSynergyScore / 12));
  const out = { ...readinessByBranch };
  for (const link of report.technologyTransferLinks) {
    out[link.fromBranch] = Math.min(100, (out[link.fromBranch] ?? 0) + Math.round(link.strength * 2));
    out[link.toBranch] = Math.min(100, (out[link.toBranch] ?? 0) + Math.round(link.strength * 2));
  }
  for (const b of RESEARCH_BRANCHES) {
    out[b.id] = Math.min(100, (out[b.id] ?? 0) + bonus);
  }
  return out;
}

/** Extra diffusion micro-boost when scale wave is active (still capped downstream). */
export function scaleWaveDiffusionBonus(report: ResearchScaleWaveReport | null): number {
  if (!report?.active) return 0;
  return Math.min(0.06, report.tier5UnlockCount * 0.008 + report.technologyTransferLinks.length * 0.003);
}

// --- bundled from src/commercialization-bridge.ts ---
function maxTierByBranch(unlocked: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const tiers = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of unlocked) {
    const tier = RESEARCH_NODE_BY_ID[u.nodeId]?.tier ?? 0;
    tiers[u.branchId] = Math.max(tiers[u.branchId], tier);
  }
  return tiers;
}

function exportPriorityFor(
  emphasis: ResearchBranchEmphasisState['emphasis'],
  tier: number,
  readiness: number
): ResearchCommercializationReport['hints'][number]['exportPriority'] {
  if (tier >= 4 && (emphasis === 'commercial' || emphasis === 'applied') && readiness >= 45) return 'high';
  if (tier >= 3 && readiness >= 35) return 'medium';
  return 'low';
}

/** Read-only V10.5 commercialization hints for copilot / national strategy panels. */
export function computeResearchCommercializationReport(
  inputs: ResearchProgressInputs,
  state: Pick<
    ResearchProgressState,
    'unlockedNodes' | 'readinessByBranch' | 'branchEmphasis' | 'scaleWave'
  >
): ResearchCommercializationReport {
  const tiers = maxTierByBranch(state.unlockedNodes);
  const emphasis = state.branchEmphasis ?? [];
  const hints: ResearchCommercializationReport['hints'] = [];

  for (const branch of RESEARCH_BRANCHES) {
    const tier = tiers[branch.id];
    if (tier < 1) continue;
    const emph = emphasis.find(e => e.branchId === branch.id)?.emphasis ?? 'fundamental';
    const readiness = state.readinessByBranch[branch.id] ?? 0;
    const cap = inputs.capabilities[branch.primaryCapability];
    hints.push({
      branchId: branch.id,
      emphasis: emph,
      readinessFloor: Math.max(20, readiness - 5),
      exportPriority: exportPriorityFor(emph, tier, readiness),
      linkedCapabilityId: branch.primaryCapability,
      rationale:
        cap?.maturity === 'nationally_integrated'
          ? `${branch.label}: integrated capability — prioritize export contracts`
          : `${branch.label}: tier ${tier} unlocks with ${emph} emphasis`,
    });
  }

  hints.sort((a, b) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return rank[b.exportPriority] - rank[a.exportPriority] || b.readinessFloor - a.readinessFloor;
  });

  const synergy = state.scaleWave?.crossBranchSynergyScore ?? 0;
  const nationalExportScore = Math.min(
    100,
    Math.round(hints.filter(h => h.exportPriority !== 'low').length * 11 + synergy * 0.35 + tier5Count(state) * 4)
  );

  return {
    active: hints.some(h => h.exportPriority !== 'low') || (state.scaleWave?.active ?? false),
    hints: hints.slice(0, 8),
    nationalExportScore,
  };
}

function tier5Count(state: Pick<ResearchProgressState, 'unlockedNodes'>): number {
  return state.unlockedNodes.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
}

/** Bounded readiness nudge when commercial emphasis aligns with tier-3+ progress. */
export function applyCommercializationReadinessNudge(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchCommercializationReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const out = { ...readinessByBranch };
  for (const hint of report.hints) {
    if (hint.exportPriority === 'low') continue;
    const bump = hint.exportPriority === 'high' ? 3 : 1;
    out[hint.branchId] = Math.min(100, (out[hint.branchId] ?? 0) + bump);
  }
  return out;
}

// --- bundled from src/unlock-event-log.ts ---
export const RESEARCH_UNLOCK_EVENT_LOG_CAP = 64;

export function emptyUnlockEventLog(): ResearchUnlockEvent[] {
  return [];
}

/** Rebuild bounded log from unlock list (migration / repair). */
export function rebuildUnlockEventLogFromNodes(
  nodes: UnlockedResearchNode[],
  startSeq = 1
): ResearchUnlockEvent[] {
  const sorted = [...nodes].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );
  return sorted.slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP).map((u, i) => ({
    seq: startSeq + i,
    turn: u.unlockedTurn,
    nodeId: u.nodeId,
    branchId: u.branchId,
    hookIds: RESEARCH_NODE_BY_ID[u.nodeId]?.hookIds ?? [],
  }));
}

export function appendUnlockEvents(
  previousLog: ResearchUnlockEvent[],
  previousNodes: UnlockedResearchNode[],
  currentNodes: UnlockedResearchNode[],
  turn: number,
  unlockSeq: number
): ResearchUnlockEvent[] {
  const prevIds = new Set(previousNodes.map(n => n.nodeId));
  const fresh = currentNodes.filter(n => !prevIds.has(n.nodeId));
  if (fresh.length === 0) return previousLog.slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);

  let nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq), unlockSeq - fresh.length) + 1 : unlockSeq;

  const appended: ResearchUnlockEvent[] = fresh
    .sort((a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId))
    .map(u => {
      const ev: ResearchUnlockEvent = {
        seq: nextSeq++,
        turn: u.unlockedTurn || turn,
        nodeId: u.nodeId,
        branchId: u.branchId as ResearchBranchId,
        hookIds: RESEARCH_NODE_BY_ID[u.nodeId]?.hookIds ?? [],
      };
      return ev;
    });

  return [...previousLog, ...appended].slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);
}

// --- bundled from src/portfolio-advisor.ts ---
function suggestedEmphasisForGap(
  branchId: ResearchBranchId,
  readiness: number,
  current: ResearchProgramEmphasis
): ResearchProgramEmphasis {
  if (readiness < 25) {
    if (branchId === 'sovereign_research') return 'sovereign';
    if (branchId === 'industrial_transformation') return 'commercial';
    return 'fundamental';
  }
  if (readiness < 45 && current === 'fundamental') return 'applied';
  return current;
}

function priorityForGap(gap: number): ResearchPortfolioBalanceReport['hints'][number]['priority'] {
  if (gap >= 28) return 'critical';
  if (gap >= 14) return 'watch';
  return 'balanced';
}

/** Read-only branch balance hints for national strategy / copilot (round 5). */
export function computeResearchPortfolioBalanceReport(
  state: Pick<
    ResearchProgressState,
    'readinessByBranch' | 'branchEmphasis' | 'unlockedNodes' | 'scaleWave'
  >
): ResearchPortfolioBalanceReport {
  const emphasis = state.branchEmphasis ?? [];
  const readiness = state.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const values = RESEARCH_BRANCHES.map(b => readiness[b.id] ?? 0);
  const mean = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);

  const hints: ResearchPortfolioBalanceReport['hints'] = [];
  for (const branch of RESEARCH_BRANCHES) {
    const r = readiness[branch.id] ?? 0;
    const gap = Math.max(0, Math.round(mean - r));
    const emph = emphasis.find(e => e.branchId === branch.id)?.emphasis ?? 'fundamental';
    hints.push({
      branchId: branch.id,
      readinessGap: gap,
      currentEmphasis: emph,
      suggestedEmphasis: suggestedEmphasisForGap(branch.id, r, emph),
      priority: priorityForGap(gap),
    });
  }

  hints.sort((a, b) => b.readinessGap - a.readinessGap || a.branchId.localeCompare(b.branchId));

  const criticalCount = hints.filter(h => h.priority === 'critical').length;
  const synergy = state.scaleWave?.crossBranchSynergyScore ?? 0;
  const nationalBalanceScore = Math.min(
    100,
    Math.round(100 - criticalCount * 9 - hints.filter(h => h.priority === 'watch').length * 4 + synergy * 0.2)
  );

  return {
    active: criticalCount > 0 || hints.some(h => h.suggestedEmphasis !== h.currentEmphasis),
    hints: hints.slice(0, 6),
    nationalBalanceScore,
  };
}

/** Bounded readiness tilt when portfolio is critically imbalanced. */
export function applyPortfolioBalanceReadinessNudge(
  readinessByBranch: Record<ResearchBranchId, number>,
  report: ResearchPortfolioBalanceReport
): Record<ResearchBranchId, number> {
  if (!report.active) return readinessByBranch;
  const out = { ...readinessByBranch };
  for (const hint of report.hints) {
    if (hint.priority !== 'critical') continue;
    out[hint.branchId] = Math.min(100, (out[hint.branchId] ?? 0) + 2);
  }
  return out;
}

// --- bundled from src/diffusion-forecast.ts ---
const MAX_HORIZON = 24;

function clampHorizon(turns: number): number {
  return Math.max(1, Math.min(MAX_HORIZON, Math.floor(turns)));
}

/** Deterministic diffusion projection for dashboards (read-only, round 5). */
export function projectResearchDiffusionHorizon(
  inputs: ResearchProgressInputs,
  state: Pick<ResearchProgressState, 'diffusion' | 'unlockedNodes' | 'institutionUpgrades'>,
  horizonTurns = 6
): ResearchDiffusionForecast {
  const horizon = clampHorizon(horizonTurns);
  const perTurnSeed =
    state.unlockedNodes.reduce((acc, u) => acc + (RESEARCH_NODE_BY_ID[u.nodeId]?.diffusionSeed ?? 0), 0) * 0.012;
  const institutionBoost =
    (state.institutionUpgrades?.reduce((a, u) => a + u.diffusionMultiplier, 0) ?? 0) * 0.004;

  const projections: ResearchDiffusionForecast['projections'] = [];
  for (let h = 1; h <= horizon; h++) {
    const turn = inputs.turn + h;
    for (const cell of state.diffusion) {
      const drift = perTurnSeed + institutionBoost + (cell.institutionBoost ?? 0) * 0.002;
      const projectedScore = Math.min(0.85, Math.round((cell.score + drift * h) * 1000) / 1000);
      projections.push({
        turn,
        regionId: cell.regionId,
        projectedScore,
        deltaFromNow: Math.round((projectedScore - cell.score) * 1000) / 1000,
      });
    }
  }

  const finalTurn = inputs.turn + horizon;
  const atHorizon = projections.filter(p => p.turn === finalTurn);
  const peak = atHorizon.reduce(
    (best, p) => (!best || p.projectedScore > best.projectedScore ? p : best),
    null as (typeof atHorizon)[number] | null
  );

  return {
    active: state.unlockedNodes.length > 0,
    baseTurn: inputs.turn,
    horizonTurns: horizon,
    peakRegionId: peak?.regionId ?? null,
    peakProjectedScore: peak?.projectedScore ?? 0,
    projections: projections.slice(0, horizon * state.diffusion.length),
  };
}

// --- bundled from src/emphasis-change-log.ts ---
export const RESEARCH_EMPHASIS_CHANGE_LOG_CAP = 32;

export function emptyEmphasisChangeLog(): ResearchEmphasisChangeEvent[] {
  return [];
}

/** Rebuild bounded log from emphasis revision history (migration / repair). */
export function rebuildEmphasisChangeLogFromBranchEmphasis(
  branchEmphasis: ResearchBranchEmphasisState[],
  emphasisRevision: number,
  turn: number
): ResearchEmphasisChangeEvent[] {
  if (emphasisRevision <= 0) return emptyEmphasisChangeLog();
  const events: ResearchEmphasisChangeEvent[] = [];
  let seq = 1;
  for (const e of branchEmphasis) {
    if (e.setTurn <= 0) continue;
    events.push({
      seq: seq++,
      turn: e.setTurn,
      branchId: e.branchId,
      fromEmphasis: 'fundamental',
      toEmphasis: e.emphasis,
      emphasisRevision: Math.min(emphasisRevision, seq),
    });
  }
  return events.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}

export function appendEmphasisChangeEvent(
  previousLog: ResearchEmphasisChangeEvent[],
  branchId: ResearchBranchId,
  fromEmphasis: ResearchProgramEmphasis,
  toEmphasis: ResearchProgramEmphasis,
  turn: number,
  emphasisRevision: number
): ResearchEmphasisChangeEvent[] {
  if (fromEmphasis === toEmphasis) return previousLog.slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
  const nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq), emphasisRevision - 1) + 1 : emphasisRevision;
  const ev: ResearchEmphasisChangeEvent = {
    seq: nextSeq,
    turn,
    branchId,
    fromEmphasis,
    toEmphasis,
    emphasisRevision,
  };
  return [...previousLog, ev].slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}

// --- bundled from src/institution-tier-snapshot.ts ---
/** Compact persisted digest of institution tiers for replay / merge guards (round 6). */
export function computeInstitutionTierSnapshot(
  upgrades: InstitutionUpgradeState[],
  turn: number
): ResearchInstitutionTierSnapshot {
  const byId = Object.fromEntries(upgrades.map(u => [u.institutionId, u]));
  const tiers: ResearchInstitutionTierSnapshot['tiers'] = {};
  for (const inst of RESEARCH_INSTITUTIONS) {
    const u = byId[inst.id];
    tiers[inst.id] = u?.tier ?? 'dormant';
  }
  const payload = RESEARCH_INSTITUTIONS.map(i => `${i.id}:${tiers[i.id] ?? 'dormant'}`).join('|');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const nationalIntegrationCount = Object.values(tiers).filter(t => t === 'national_integration').length;
  const strategicOrAbove = Object.values(tiers).filter(
    t => INSTITUTION_UPGRADE_TIER_RANK[t] >= INSTITUTION_UPGRADE_TIER_RANK.strategic
  ).length;
  return {
    capturedAtTurn: turn,
    tiers,
    digest: h.toString(36),
    nationalIntegrationCount,
    strategicOrAboveCount: strategicOrAbove,
  };
}

export function mergeInstitutionTierSnapshots(
  local: ResearchInstitutionTierSnapshot | undefined,
  remote: ResearchInstitutionTierSnapshot | undefined
): ResearchInstitutionTierSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/synergy-outlook.ts ---
function branchTierCounts(nodes: UnlockedResearchNode[]): Record<ResearchBranchId, number> {
  const out = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<ResearchBranchId, number>;
  for (const u of nodes) {
    out[u.branchId] = (out[u.branchId] ?? 0) + 1;
  }
  return out;
}

/** Deterministic scale-wave synergy projection for strategy dashboards (read-only, round 6). */
export function computeResearchSynergyOutlook(
  inputs: ResearchProgressInputs,
  state: Pick<
    ResearchProgressState,
    'unlockedNodes' | 'readinessByBranch' | 'scaleWave' | 'portfolioBalance'
  >
): ResearchSynergyOutlook {
  const scaleWave =
    state.scaleWave ?? computeResearchScaleWaveReport(inputs, state.unlockedNodes ?? []);
  const counts = branchTierCounts(state.unlockedNodes ?? []);
  const activeBranches = RESEARCH_BRANCHES.filter(b => (counts[b.id] ?? 0) >= 2).length;
  const readiness = state.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const meanReadiness =
    RESEARCH_BRANCHES.reduce((sum, b) => sum + (readiness[b.id] ?? 0), 0) / Math.max(1, RESEARCH_BRANCHES.length);

  const horizonTurns = 6;
  const growthPerTurn = Math.min(
    8,
    Math.round(
      scaleWave.crossBranchSynergyScore * 0.04 +
        activeBranches * 1.2 +
        (state.portfolioBalance?.nationalBalanceScore ?? 50) * 0.03
    )
  );
  const projectedSynergyScore = Math.min(
    100,
    Math.round(scaleWave.crossBranchSynergyScore + growthPerTurn * horizonTurns + meanReadiness * 0.05)
  );

  const transferLinks = scaleWave.technologyTransferLinks.slice(0, 4).map(l => ({
    fromBranch: l.fromBranch,
    toBranch: l.toBranch,
    projectedStrength: Math.min(1, Math.round((l.strength + growthPerTurn * 0.02) * 1000) / 1000),
  }));

  return {
    active: scaleWave.active || activeBranches >= 2,
    baseTurn: inputs.turn,
    horizonTurns,
    currentSynergyScore: scaleWave.crossBranchSynergyScore,
    projectedSynergyScore,
    activeMultiBranchCount: activeBranches,
    transferLinks,
    dominantCapabilityCluster: scaleWave.dominantCapabilityCluster,
  };
}

// --- bundled from src/readiness-milestone-log.ts ---
export const RESEARCH_READINESS_MILESTONE_LOG_CAP = 48;

export const RESEARCH_READINESS_MILESTONES: ResearchReadinessMilestone[] = [25, 50, 75, 90];

export function emptyReadinessMilestoneLog(): ResearchReadinessMilestoneEvent[] {
  return [];
}

function highestLoggedMilestone(
  log: ResearchReadinessMilestoneEvent[],
  branchId: ResearchBranchId
): ResearchReadinessMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.branchId !== branchId) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchReadinessMilestone;
}

/** Rebuild bounded log from a captured readiness snapshot (migration / repair). */
export function rebuildReadinessMilestoneLogFromSnapshot(
  snapshot: ResearchReadinessBranchSnapshot | null,
  turn: number
): ResearchReadinessMilestoneEvent[] {
  if (!snapshot) return emptyReadinessMilestoneLog();
  return appendReadinessMilestoneEvents(
    emptyReadinessMilestoneLog(),
    null,
    snapshot.readinessByBranch,
    turn
  );
}

export function appendReadinessMilestoneEvents(
  previousLog: ResearchReadinessMilestoneEvent[],
  previousSnapshot: ResearchReadinessBranchSnapshot | null,
  readinessByBranch: Record<ResearchBranchId, number>,
  turn: number
): ResearchReadinessMilestoneEvent[] {
  const priorFloor: Partial<Record<ResearchBranchId, number>> = {};
  if (previousSnapshot) {
    for (const b of RESEARCH_BRANCHES) {
      priorFloor[b.id] = previousSnapshot.readinessByBranch[b.id] ?? 0;
    }
  }

  const appended: ResearchReadinessMilestoneEvent[] = [];
  let nextSeq =
    previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  for (const branch of RESEARCH_BRANCHES) {
    const readiness = Math.round(Math.min(100, Math.max(0, readinessByBranch[branch.id] ?? 0)));
    const floor = Math.max(highestLoggedMilestone(previousLog, branch.id), priorFloor[branch.id] ?? 0);
    for (const milestone of RESEARCH_READINESS_MILESTONES) {
      if (milestone <= floor) continue;
      if (readiness < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        branchId: branch.id,
        milestone,
        readiness,
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
}

// --- bundled from src/readiness-branch-snapshot.ts ---
/** Compact persisted digest of branch readiness for replay / merge guards (round 7). */
export function computeReadinessBranchSnapshot(
  readinessByBranch: Record<ResearchBranchId, number>,
  turn: number
): ResearchReadinessBranchSnapshot {
  const readiness: ResearchReadinessBranchSnapshot['readinessByBranch'] = {} as ResearchReadinessBranchSnapshot['readinessByBranch'];
  for (const b of RESEARCH_BRANCHES) {
    readiness[b.id] = Math.round(Math.min(100, Math.max(0, readinessByBranch[b.id] ?? 0)));
  }
  const payload = RESEARCH_BRANCHES.map(b => `${b.id}:${readiness[b.id]}`).join('|');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const values = RESEARCH_BRANCHES.map(b => readiness[b.id]);
  const branchAbove75Count = values.filter(v => v >= 75).length;
  const nationalMeanReadiness =
    values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  return {
    capturedAtTurn: turn,
    readinessByBranch: readiness,
    digest: h.toString(36),
    branchAbove75Count,
    nationalMeanReadiness,
  };
}

export function mergeReadinessBranchSnapshots(
  local: ResearchReadinessBranchSnapshot | undefined,
  remote: ResearchReadinessBranchSnapshot | undefined
): ResearchReadinessBranchSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/integration-risk-outlook.ts ---
/** Deterministic integration-risk projection for strategy dashboards (read-only, round 7). */
export function computeResearchIntegrationRiskOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    'readinessByBranch' | 'institutionUpgrades' | 'portfolioBalance' | 'institutionTierSnapshot'
  >
): ResearchIntegrationRiskOutlook {
  const links: ResearchIntegrationRiskLink[] = [];
  const readiness = ctx.readinessByBranch ?? ({} as Record<ResearchBranchId, number>);
  const portfolio = ctx.portfolioBalance ?? null;

  for (const branch of RESEARCH_BRANCHES) {
    const r = readiness[branch.id] ?? 0;
    if (r < 35) {
      links.push({
        branchId: branch.id,
        riskScore: Math.round(100 - r),
        driver: 'readiness_gap',
      });
    }
  }

  const dormantInstitutions = (ctx.institutionUpgrades ?? []).filter(u => u.tier === 'dormant').length;
  if (dormantInstitutions >= 3) {
    links.push({
      branchId: 'digital_frontier',
      riskScore: Math.min(100, dormantInstitutions * 12),
      driver: 'institution_dormant',
    });
  }

  const criticalHints = portfolio?.hints.filter(h => h.priority === 'critical').length ?? 0;
  if (criticalHints >= 2) {
    links.push({
      branchId: 'industrial_transformation',
      riskScore: Math.min(100, criticalHints * 22),
      driver: 'portfolio_imbalance',
    });
  }

  const nationalRiskScore =
    links.length === 0
      ? 0
      : Math.round(links.reduce((sum, l) => sum + l.riskScore, 0) / Math.max(1, links.length));

  return {
    active: links.length > 0 || inputs.turn >= 12,
    baseTurn: inputs.turn,
    nationalRiskScore,
    criticalBranchCount: links.filter(l => l.driver === 'readiness_gap' && l.riskScore >= 65).length,
    links: links.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8),
  };
}

// --- bundled from src/integration-risk-log.ts ---
export const RESEARCH_INTEGRATION_RISK_LOG_CAP = 32;

export const RESEARCH_INTEGRATION_RISK_BANDS: ResearchIntegrationRiskBand[] = [40, 60, 80];

export function emptyIntegrationRiskLog(): ResearchIntegrationRiskEvent[] {
  return [];
}

function highestLoggedBand(
  log: ResearchIntegrationRiskEvent[],
  phase: ResearchIntegrationRiskEvent['phase']
): ResearchIntegrationRiskBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchIntegrationRiskBand;
}

export function rebuildIntegrationRiskLogFromSnapshot(
  snapshot: ResearchIntegrationRiskSnapshot | null,
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskEvent[] {
  if (!snapshot) return emptyIntegrationRiskLog();
  return appendIntegrationRiskEvents(emptyIntegrationRiskLog(), snapshot, outlook, turn);
}

export function appendIntegrationRiskEvents(
  previousLog: ResearchIntegrationRiskEvent[],
  previousSnapshot: ResearchIntegrationRiskSnapshot | null,
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, outlook.nationalRiskScore)));
  const priorScore = previousSnapshot?.nationalRiskScore ?? 0;
  const appended: ResearchIntegrationRiskEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakRiskBand ?? 0);
    for (const band of RESEARCH_INTEGRATION_RISK_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalRiskScore: score,
        criticalBranchCount: outlook.criticalBranchCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakRiskBand ??
      (highestLoggedBand(previousLog, 'escalation') || RESEARCH_INTEGRATION_RISK_BANDS[RESEARCH_INTEGRATION_RISK_BANDS.length - 1]);
    for (const band of [...RESEARCH_INTEGRATION_RISK_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalRiskScore: score,
        criticalBranchCount: outlook.criticalBranchCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}

// --- bundled from src/integration-risk-snapshot.ts ---
/** Compact persisted digest of integration risk for replay / merge guards (round 8). */
export function computeIntegrationRiskSnapshot(
  outlook: ResearchIntegrationRiskOutlook,
  turn: number
): ResearchIntegrationRiskSnapshot {
  const nationalRiskScore = Math.round(Math.min(100, Math.max(0, outlook.nationalRiskScore)));
  let peakRiskBand = 0;
  for (const band of RESEARCH_INTEGRATION_RISK_BANDS) {
    if (nationalRiskScore >= band) peakRiskBand = band;
  }
  const payload = `t${turn}|s${nationalRiskScore}|c${outlook.criticalBranchCount}|l${outlook.links.length}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalRiskScore,
    criticalBranchCount: outlook.criticalBranchCount,
    peakRiskBand: peakRiskBand as ResearchIntegrationRiskSnapshot['peakRiskBand'],
    digest: h.toString(36),
  };
}

export function mergeIntegrationRiskSnapshots(
  local: ResearchIntegrationRiskSnapshot | undefined,
  remote: ResearchIntegrationRiskSnapshot | undefined
): ResearchIntegrationRiskSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/scale-wave-snapshot.ts ---
/** Compact persisted digest of scale-wave posture at seal (round 8). */
export function computeScaleWaveSnapshot(
  report: ResearchScaleWaveReport | null,
  turn: number
): ResearchScaleWaveSnapshot | null {
  if (!report) return null;
  const tier5UnlockCount = report.tier5UnlockCount;
  const crossBranchSynergyScore = report.crossBranchSynergyScore;
  const transferLinkCount = report.technologyTransferLinks.length;
  const payload = `t${turn}|5:${tier5UnlockCount}|sy:${crossBranchSynergyScore}|xl:${transferLinkCount}|${report.dominantCapabilityCluster ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    tier5UnlockCount,
    crossBranchSynergyScore,
    transferLinkCount,
    dominantCapabilityCluster: report.dominantCapabilityCluster,
    digest: h.toString(36),
  };
}

export function mergeScaleWaveSnapshots(
  local: ResearchScaleWaveSnapshot | undefined,
  remote: ResearchScaleWaveSnapshot | undefined
): ResearchScaleWaveSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/adoption-horizon-outlook.ts ---
/** Deterministic national adoption projection (read-only, round 8). */
export function computeResearchAdoptionHorizonOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    'diffusionForecast' | 'scaleWave' | 'synergyOutlook' | 'diffusion' | 'integrationRiskOutlook'
  >
): ResearchAdoptionHorizonOutlook {
  const forecast = ctx.diffusionForecast;
  const scaleWave = ctx.scaleWave;
  const synergy = ctx.synergyOutlook;
  const horizonTurns = forecast?.horizonTurns ?? 6;
  const integratedRegions = (ctx.diffusion ?? []).filter(c => c.level === 'integrated').length;
  const peakRegionId = forecast?.peakRegionId ?? null;
  const peakProjected = forecast?.peakProjectedScore ?? 0;
  const synergyContribution = Math.round(
    (scaleWave?.crossBranchSynergyScore ?? 0) * 0.35 + (synergy?.projectedSynergyScore ?? 0) * 0.15
  );
  const riskPenalty = Math.round((ctx.integrationRiskOutlook?.nationalRiskScore ?? 0) * 0.12);
  const nationalAdoptionScore = Math.min(
    100,
    Math.round(integratedRegions * 8 + peakProjected * 100 + synergyContribution * 0.2 - riskPenalty)
  );
  const growthPerTurn = Math.min(
    6,
    Math.round((scaleWave?.technologyTransferLinks.length ?? 0) * 1.5 + (synergy?.activeMultiBranchCount ?? 0))
  );
  const projectedAdoptionScore = Math.min(
    100,
    Math.round(nationalAdoptionScore + growthPerTurn * horizonTurns + peakProjected * 40)
  );

  return {
    active: inputs.turn >= 8 || nationalAdoptionScore > 0 || (scaleWave?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalAdoptionScore,
    projectedAdoptionScore,
    peakRegionId,
    synergyContribution,
  };
}

// --- bundled from src/synergy-threshold-log.ts ---
export const RESEARCH_SYNERGY_THRESHOLD_LOG_CAP = 32;

export const RESEARCH_SYNERGY_THRESHOLDS: ResearchSynergyThreshold[] = [25, 50, 75, 90];

export function emptySynergyThresholdLog(): ResearchSynergyThresholdEvent[] {
  return [];
}

function highestLoggedThreshold(
  log: ResearchSynergyThresholdEvent[],
  phase: ResearchSynergyThresholdEvent['phase']
): ResearchSynergyThreshold {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.threshold > best) best = ev.threshold;
  }
  return best as ResearchSynergyThreshold;
}

export function rebuildSynergyThresholdLogFromSnapshot(
  snapshot: ResearchSynergySnapshot | null,
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergyThresholdEvent[] {
  if (!snapshot) return emptySynergyThresholdLog();
  return appendSynergyThresholdEvents(emptySynergyThresholdLog(), snapshot, outlook, turn);
}

export function appendSynergyThresholdEvents(
  previousLog: ResearchSynergyThresholdEvent[],
  previousSnapshot: ResearchSynergySnapshot | null,
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergyThresholdEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, outlook.currentSynergyScore)));
  const priorScore = previousSnapshot?.currentSynergyScore ?? 0;
  const appended: ResearchSynergyThresholdEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedThreshold(previousLog, 'escalation'),
      previousSnapshot?.peakThreshold ?? 0
    );
    for (const threshold of RESEARCH_SYNERGY_THRESHOLDS) {
      if (threshold <= floor) continue;
      if (score < threshold) break;
      appended.push({
        seq: nextSeq++,
        turn,
        threshold,
        synergyScore: score,
        activeMultiBranchCount: outlook.activeMultiBranchCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakThreshold ??
      (highestLoggedThreshold(previousLog, 'escalation') ||
        RESEARCH_SYNERGY_THRESHOLDS[RESEARCH_SYNERGY_THRESHOLDS.length - 1]);
    for (const threshold of [...RESEARCH_SYNERGY_THRESHOLDS].reverse()) {
      if (threshold > ceiling) continue;
      if (score > threshold) break;
      if (priorScore < threshold) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        threshold,
        synergyScore: score,
        activeMultiBranchCount: outlook.activeMultiBranchCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}

// --- bundled from src/synergy-snapshot.ts ---
/** Compact persisted digest of synergy posture at seal (round 9). */
export function computeSynergySnapshot(
  outlook: ResearchSynergyOutlook,
  turn: number
): ResearchSynergySnapshot {
  const currentSynergyScore = Math.round(Math.min(100, Math.max(0, outlook.currentSynergyScore)));
  const projectedSynergyScore = Math.round(Math.min(100, Math.max(0, outlook.projectedSynergyScore)));
  let peakThreshold = 0;
  for (const threshold of RESEARCH_SYNERGY_THRESHOLDS) {
    if (currentSynergyScore >= threshold) peakThreshold = threshold;
  }
  const payload = `t${turn}|c${currentSynergyScore}|p${projectedSynergyScore}|m${outlook.activeMultiBranchCount}|${outlook.dominantCapabilityCluster ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    currentSynergyScore,
    projectedSynergyScore,
    activeMultiBranchCount: outlook.activeMultiBranchCount,
    peakThreshold: peakThreshold as ResearchSynergySnapshot['peakThreshold'],
    dominantCapabilityCluster: outlook.dominantCapabilityCluster,
    digest: h.toString(36),
  };
}

export function mergeSynergySnapshots(
  local: ResearchSynergySnapshot | undefined,
  remote: ResearchSynergySnapshot | undefined
): ResearchSynergySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/portfolio-stabilization-outlook.ts ---
/** Deterministic portfolio stabilization horizon (read-only, round 9). */
export function computeResearchPortfolioStabilizationOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'portfolioBalance'
    | 'synergyOutlook'
    | 'integrationRiskOutlook'
    | 'adoptionHorizonOutlook'
    | 'synergySnapshot'
  >
): ResearchPortfolioStabilizationOutlook {
  const balance = ctx.portfolioBalance;
  const synergy = ctx.synergyOutlook;
  const risk = ctx.integrationRiskOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = synergy?.horizonTurns ?? 6;

  const nationalBalanceScore = balance?.nationalBalanceScore ?? 50;
  const criticalHints = balance?.hints.filter(h => h.priority === 'critical') ?? [];
  const nationalStabilizationScore = Math.min(
    100,
    Math.round(
      nationalBalanceScore * 0.55 +
        (synergy?.projectedSynergyScore ?? 0) * 0.25 +
        (adoption?.nationalAdoptionScore ?? 0) * 0.12 -
        (risk?.nationalRiskScore ?? 0) * 0.18
    )
  );
  const projectedStabilizationScore = Math.min(
    100,
    Math.round(
      nationalStabilizationScore +
        Math.max(0, (synergy?.projectedSynergyScore ?? 0) - (synergy?.currentSynergyScore ?? 0)) * 0.4 -
        criticalHints.length * 3
    )
  );

  const links: ResearchPortfolioStabilizationLink[] = criticalHints.slice(0, 4).map(h => ({
    branchId: h.branchId,
    readinessGap: h.readinessGap,
    driver: h.suggestedEmphasis !== h.currentEmphasis ? 'emphasis_mismatch' : 'readiness_lag',
  }));

  const priorPeak = ctx.synergySnapshot?.peakThreshold ?? 0;
  const synergyMomentum = Math.max(0, (synergy?.currentSynergyScore ?? 0) - priorPeak * 0.5);

  return {
    active:
      inputs.turn >= 10 ||
      criticalHints.length > 0 ||
      nationalStabilizationScore < 72 ||
      (balance?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalStabilizationScore,
    projectedStabilizationScore,
    criticalBranchCount: criticalHints.length,
    synergyMomentum: Math.round(synergyMomentum),
    links,
  };
}

// --- bundled from src/commercialization-milestone-log.ts ---
export const RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP = 32;

export const RESEARCH_COMMERCIALIZATION_MILESTONES: ResearchCommercializationMilestone[] = [30, 50, 70, 90];

export function emptyCommercializationMilestoneLog(): ResearchCommercializationMilestoneEvent[] {
  return [];
}

function highestLoggedMilestone(
  log: ResearchCommercializationMilestoneEvent[],
  phase: ResearchCommercializationMilestoneEvent['phase']
): ResearchCommercializationMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchCommercializationMilestone;
}

export function rebuildCommercializationMilestoneLogFromSnapshot(
  snapshot: ResearchCommercializationSnapshot | null,
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationMilestoneEvent[] {
  if (!snapshot) return emptyCommercializationMilestoneLog();
  return appendCommercializationMilestoneEvents(emptyCommercializationMilestoneLog(), snapshot, report, turn);
}

export function appendCommercializationMilestoneEvents(
  previousLog: ResearchCommercializationMilestoneEvent[],
  previousSnapshot: ResearchCommercializationSnapshot | null,
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationMilestoneEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, report.nationalExportScore)));
  const priorScore = previousSnapshot?.nationalExportScore ?? 0;
  const highPriorityCount = report.hints.filter(h => h.exportPriority === 'high').length;
  const appended: ResearchCommercializationMilestoneEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(
      highestLoggedMilestone(previousLog, 'escalation'),
      previousSnapshot?.peakMilestone ?? 0
    );
    for (const milestone of RESEARCH_COMMERCIALIZATION_MILESTONES) {
      if (milestone <= floor) continue;
      if (score < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        nationalExportScore: score,
        highPriorityBranchCount: highPriorityCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakMilestone ??
      (highestLoggedMilestone(previousLog, 'escalation') ||
        RESEARCH_COMMERCIALIZATION_MILESTONES[RESEARCH_COMMERCIALIZATION_MILESTONES.length - 1]);
    for (const milestone of [...RESEARCH_COMMERCIALIZATION_MILESTONES].reverse()) {
      if (milestone > ceiling) continue;
      if (score > milestone) break;
      if (priorScore < milestone) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        nationalExportScore: score,
        highPriorityBranchCount: highPriorityCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}

// --- bundled from src/commercialization-snapshot.ts ---
/** Compact persisted digest of commercialization posture at seal (round 10). */
export function computeCommercializationSnapshot(
  report: ResearchCommercializationReport,
  turn: number
): ResearchCommercializationSnapshot {
  const nationalExportScore = Math.round(Math.min(100, Math.max(0, report.nationalExportScore)));
  const highPriorityBranchCount = report.hints.filter(h => h.exportPriority === 'high').length;
  const mediumPriorityBranchCount = report.hints.filter(h => h.exportPriority === 'medium').length;
  let peakMilestone = 0;
  for (const milestone of RESEARCH_COMMERCIALIZATION_MILESTONES) {
    if (nationalExportScore >= milestone) peakMilestone = milestone;
  }
  const payload = `t${turn}|e${nationalExportScore}|h${highPriorityBranchCount}|m${mediumPriorityBranchCount}|a${report.active ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalExportScore,
    highPriorityBranchCount,
    mediumPriorityBranchCount,
    peakMilestone: peakMilestone as ResearchCommercializationSnapshot['peakMilestone'],
    digest: h.toString(36),
  };
}

export function mergeCommercializationSnapshots(
  local: ResearchCommercializationSnapshot | undefined,
  remote: ResearchCommercializationSnapshot | undefined
): ResearchCommercializationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/export-continuity-outlook.ts ---
/** Deterministic export continuity horizon (read-only, round 10). */
export function computeResearchExportContinuityOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'commercialization'
    | 'portfolioStabilizationOutlook'
    | 'adoptionHorizonOutlook'
    | 'commercializationSnapshot'
  >
): ResearchExportContinuityOutlook {
  const report = ctx.commercialization;
  const stabilization = ctx.portfolioStabilizationOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = stabilization?.horizonTurns ?? adoption?.horizonTurns ?? 6;

  const nationalExportScore = report?.nationalExportScore ?? 0;
  const nationalContinuityScore = Math.min(
    100,
    Math.round(
      nationalExportScore * 0.5 +
        (stabilization?.nationalStabilizationScore ?? 50) * 0.22 +
        (adoption?.projectedAdoptionScore ?? 0) * 0.18 -
        (stabilization?.criticalBranchCount ?? 0) * 4
    )
  );
  const projectedContinuityScore = Math.min(
    100,
    Math.round(
      nationalContinuityScore +
        Math.max(0, (adoption?.projectedAdoptionScore ?? 0) - (adoption?.nationalAdoptionScore ?? 0)) * 0.35 +
        (report?.hints.filter(h => h.exportPriority === 'high').length ?? 0) * 2
    )
  );

  const links: ResearchExportContinuityLink[] = (report?.hints ?? [])
    .filter(h => h.exportPriority !== 'low')
    .slice(0, 5)
    .map(h => ({
      branchId: h.branchId,
      exportPriority: h.exportPriority,
      driver: h.emphasis === 'commercial' ? 'commercial_emphasis' : 'readiness_floor',
    }));

  const priorPeak = ctx.commercializationSnapshot?.peakMilestone ?? 0;
  const exportMomentum = Math.max(0, nationalExportScore - priorPeak * 0.45);

  return {
    active:
      inputs.turn >= 12 ||
      nationalContinuityScore > 0 ||
      (report?.active ?? false) ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalContinuityScore,
    projectedContinuityScore,
    highPriorityExportCount: report?.hints.filter(h => h.exportPriority === 'high').length ?? 0,
    exportMomentum: Math.round(exportMomentum),
    links,
  };
}

// --- bundled from src/diffusion-integration-log.ts ---
export const RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP = 32;

export const RESEARCH_DIFFUSION_INTEGRATION_MILESTONES: ResearchDiffusionIntegrationMilestone[] = [1, 2, 4, 6];

export function emptyDiffusionIntegrationLog(): ResearchDiffusionIntegrationMilestoneEvent[] {
  return [];
}

function integratedRegionCount(cells: RegionalDiffusionCell[]): number {
  return cells.filter(c => c.level === 'integrated').length;
}

function highestLoggedMilestone(
  log: ResearchDiffusionIntegrationMilestoneEvent[],
  phase: ResearchDiffusionIntegrationMilestoneEvent['phase']
): ResearchDiffusionIntegrationMilestone {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.milestone > best) best = ev.milestone;
  }
  return best as ResearchDiffusionIntegrationMilestone;
}

export function rebuildDiffusionIntegrationLogFromSnapshot(
  snapshot: ResearchDiffusionIntegrationSnapshot | null,
  cells: RegionalDiffusionCell[],
  turn: number
): ResearchDiffusionIntegrationMilestoneEvent[] {
  if (!snapshot) return emptyDiffusionIntegrationLog();
  return appendDiffusionIntegrationEvents(emptyDiffusionIntegrationLog(), snapshot, cells, turn);
}

export function appendDiffusionIntegrationEvents(
  previousLog: ResearchDiffusionIntegrationMilestoneEvent[],
  previousSnapshot: ResearchDiffusionIntegrationSnapshot | null,
  cells: RegionalDiffusionCell[],
  turn: number
): ResearchDiffusionIntegrationMilestoneEvent[] {
  const count = integratedRegionCount(cells);
  const priorCount = previousSnapshot?.integratedRegionCount ?? 0;
  const meanScore =
    cells.length > 0 ? Math.round((cells.reduce((s, c) => s + c.score, 0) / cells.length) * 1000) / 1000 : 0;
  const appended: ResearchDiffusionIntegrationMilestoneEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (count > priorCount) {
    const floor = Math.max(
      highestLoggedMilestone(previousLog, 'escalation'),
      previousSnapshot?.peakMilestone ?? 0
    );
    for (const milestone of RESEARCH_DIFFUSION_INTEGRATION_MILESTONES) {
      if (milestone <= floor) continue;
      if (count < milestone) break;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        integratedRegionCount: count,
        meanDiffusionScore: meanScore,
        phase: 'escalation',
      });
    }
  } else if (count < priorCount) {
    const ceiling =
      previousSnapshot?.peakMilestone ??
      (highestLoggedMilestone(previousLog, 'escalation') ||
        RESEARCH_DIFFUSION_INTEGRATION_MILESTONES[RESEARCH_DIFFUSION_INTEGRATION_MILESTONES.length - 1]);
    for (const milestone of [...RESEARCH_DIFFUSION_INTEGRATION_MILESTONES].reverse()) {
      if (milestone > ceiling) continue;
      if (count > milestone) break;
      if (priorCount < milestone) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        milestone,
        integratedRegionCount: count,
        meanDiffusionScore: meanScore,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}

// --- bundled from src/diffusion-integration-snapshot.ts ---
/** Compact persisted digest of national diffusion integration at seal (round 11). */
export function computeDiffusionIntegrationSnapshot(
  cells: RegionalDiffusionCell[],
  leadingResearchRegion: V94AustralianRegionCode | null,
  turn: number
): ResearchDiffusionIntegrationSnapshot {
  const integratedRegionCount = cells.filter(c => c.level === 'integrated').length;
  const adoptingRegionCount = cells.filter(c => c.level === 'adopting' || c.level === 'integrated').length;
  const meanDiffusionScore =
    cells.length > 0 ? Math.round((cells.reduce((s, c) => s + c.score, 0) / cells.length) * 1000) / 1000 : 0;
  let peakMilestone = 0;
  for (const milestone of RESEARCH_DIFFUSION_INTEGRATION_MILESTONES) {
    if (integratedRegionCount >= milestone) peakMilestone = milestone;
  }
  const payload = `t${turn}|i${integratedRegionCount}|a${adoptingRegionCount}|m${meanDiffusionScore}|${leadingResearchRegion ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    integratedRegionCount,
    adoptingRegionCount,
    meanDiffusionScore,
    leadingResearchRegion,
    peakMilestone: peakMilestone as ResearchDiffusionIntegrationSnapshot['peakMilestone'],
    digest: h.toString(36),
  };
}

export function mergeDiffusionIntegrationSnapshots(
  local: ResearchDiffusionIntegrationSnapshot | undefined,
  remote: ResearchDiffusionIntegrationSnapshot | undefined
): ResearchDiffusionIntegrationSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/national-coherence-outlook.ts ---
/** Deterministic national research coherence horizon (read-only, round 11). */
export function computeResearchNationalCoherenceOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'diffusion'
    | 'diffusionForecast'
    | 'exportContinuityOutlook'
    | 'integrationRiskOutlook'
    | 'diffusionIntegrationSnapshot'
  >
): ResearchNationalCoherenceOutlook {
  const cells = ctx.diffusion ?? [];
  const integrated = cells.filter(c => c.level === 'integrated').length;
  const forecast = ctx.diffusionForecast;
  const exportOutlook = ctx.exportContinuityOutlook;
  const risk = ctx.integrationRiskOutlook;
  const horizonTurns = forecast?.horizonTurns ?? exportOutlook?.horizonTurns ?? 6;

  const nationalCoherenceScore = Math.min(
    100,
    Math.round(
      integrated * 9 +
        (forecast?.peakProjectedScore ?? 0) * 85 +
        (exportOutlook?.nationalContinuityScore ?? 0) * 0.2 -
        (risk?.nationalRiskScore ?? 0) * 0.15
    )
  );
  const projectedCoherenceScore = Math.min(
    100,
    Math.round(
      nationalCoherenceScore +
        (forecast?.peakProjectedScore ?? 0) * 40 +
        Math.max(0, (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)) *
          0.25
    )
  );

  const links: ResearchNationalCoherenceLink[] = cells
    .filter(c => c.level === 'integrated' || c.level === 'adopting')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(c => ({
      regionId: c.regionId,
      diffusionScore: c.score,
      driver: c.level === 'integrated' ? 'integrated_cluster' : 'adoption_wave',
    }));

  const priorPeak = ctx.diffusionIntegrationSnapshot?.peakMilestone ?? 0;
  const integrationMomentum = Math.max(0, integrated - priorPeak * 0.6);

  return {
    active: inputs.turn >= 8 || integrated > 0 || nationalCoherenceScore > 0 || (forecast?.active ?? false),
    baseTurn: inputs.turn,
    horizonTurns,
    nationalCoherenceScore,
    projectedCoherenceScore,
    integratedRegionCount: integrated,
    integrationMomentum: Math.round(integrationMomentum),
    links,
  };
}

// --- bundled from src/portfolio-balance-log.ts ---
export const RESEARCH_PORTFOLIO_BALANCE_LOG_CAP = 32;

export const RESEARCH_PORTFOLIO_BALANCE_BANDS: ResearchPortfolioBalanceBand[] = [40, 55, 70, 85];

export function emptyPortfolioBalanceLog(): ResearchPortfolioBalanceBandEvent[] {
  return [];
}

function highestLoggedBand(
  log: ResearchPortfolioBalanceBandEvent[],
  phase: ResearchPortfolioBalanceBandEvent['phase']
): ResearchPortfolioBalanceBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchPortfolioBalanceBand;
}

export function rebuildPortfolioBalanceLogFromSnapshot(
  snapshot: ResearchPortfolioBalanceSnapshot | null,
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceBandEvent[] {
  if (!snapshot) return emptyPortfolioBalanceLog();
  return appendPortfolioBalanceBandEvents(emptyPortfolioBalanceLog(), snapshot, report, turn);
}

export function appendPortfolioBalanceBandEvents(
  previousLog: ResearchPortfolioBalanceBandEvent[],
  previousSnapshot: ResearchPortfolioBalanceSnapshot | null,
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceBandEvent[] {
  const score = Math.round(Math.min(100, Math.max(0, report.nationalBalanceScore)));
  const priorScore = previousSnapshot?.nationalBalanceScore ?? 0;
  const criticalCount = report.hints.filter(h => h.priority === 'critical').length;
  const appended: ResearchPortfolioBalanceBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_PORTFOLIO_BALANCE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalBalanceScore: score,
        criticalBranchCount: criticalCount,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_PORTFOLIO_BALANCE_BANDS[RESEARCH_PORTFOLIO_BALANCE_BANDS.length - 1]);
    for (const band of [...RESEARCH_PORTFOLIO_BALANCE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalBalanceScore: score,
        criticalBranchCount: criticalCount,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}

// --- bundled from src/portfolio-balance-snapshot.ts ---
/** Compact persisted digest of portfolio balance at seal (round 12). */
export function computePortfolioBalanceSnapshot(
  report: ResearchPortfolioBalanceReport,
  turn: number
): ResearchPortfolioBalanceSnapshot {
  const nationalBalanceScore = Math.round(Math.min(100, Math.max(0, report.nationalBalanceScore)));
  const criticalBranchCount = report.hints.filter(h => h.priority === 'critical').length;
  const watchBranchCount = report.hints.filter(h => h.priority === 'watch').length;
  let peakBand = 0;
  for (const band of RESEARCH_PORTFOLIO_BALANCE_BANDS) {
    if (nationalBalanceScore >= band) peakBand = band;
  }
  const payload = `t${turn}|b${nationalBalanceScore}|c${criticalBranchCount}|w${watchBranchCount}|a${report.active ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalBalanceScore,
    criticalBranchCount,
    watchBranchCount,
    peakBand: peakBand as ResearchPortfolioBalanceSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergePortfolioBalanceSnapshots(
  local: ResearchPortfolioBalanceSnapshot | undefined,
  remote: ResearchPortfolioBalanceSnapshot | undefined
): ResearchPortfolioBalanceSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/strategic-alignment-outlook.ts ---
/** Deterministic cross-branch strategic alignment horizon (read-only, round 12). */
export function computeResearchStrategicAlignmentOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'portfolioBalance'
    | 'nationalCoherenceOutlook'
    | 'synergyOutlook'
    | 'portfolioBalanceSnapshot'
    | 'branchEmphasis'
  >
): ResearchStrategicAlignmentOutlook {
  const balance = ctx.portfolioBalance;
  const coherence = ctx.nationalCoherenceOutlook;
  const synergy = ctx.synergyOutlook;
  const horizonTurns = coherence?.horizonTurns ?? synergy?.horizonTurns ?? 6;

  const nationalAlignmentScore = Math.min(
    100,
    Math.round(
      (balance?.nationalBalanceScore ?? 50) * 0.45 +
        (coherence?.nationalCoherenceScore ?? 0) * 0.28 +
        (synergy?.currentSynergyScore ?? 0) * 0.18 -
        (balance?.hints.filter(h => h.priority === 'critical').length ?? 0) * 5
    )
  );
  const projectedAlignmentScore = Math.min(
    100,
    Math.round(
      nationalAlignmentScore +
        Math.max(0, (synergy?.projectedSynergyScore ?? 0) - (synergy?.currentSynergyScore ?? 0)) * 0.35 +
        (coherence?.projectedCoherenceScore ?? 0) * 0.08
    )
  );

  const emphasis = ctx.branchEmphasis ?? [];
  const links: ResearchStrategicAlignmentLink[] = (balance?.hints ?? [])
    .filter(h => h.suggestedEmphasis !== h.currentEmphasis || h.priority !== 'balanced')
    .slice(0, 5)
    .map(h => {
      const emph = emphasis.find(e => e.branchId === h.branchId)?.emphasis ?? h.currentEmphasis;
      return {
        branchId: h.branchId,
        emphasis: emph,
        driver: h.priority === 'critical' ? 'critical_gap' : 'emphasis_drift',
      };
    });

  const priorPeak = ctx.portfolioBalanceSnapshot?.peakBand ?? 0;
  const balanceMomentum = Math.max(0, (balance?.nationalBalanceScore ?? 0) - priorPeak * 0.5);

  return {
    active:
      inputs.turn >= 10 ||
      (balance?.active ?? false) ||
      links.length > 0 ||
      nationalAlignmentScore < 75,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalAlignmentScore,
    projectedAlignmentScore,
    misalignedBranchCount: links.filter(l => l.driver === 'emphasis_drift').length,
    balanceMomentum: Math.round(balanceMomentum),
    links,
  };
}

// --- bundled from src/diffusion-forecast-band-log.ts ---
export const RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP = 32;

export const RESEARCH_DIFFUSION_FORECAST_BANDS: ResearchDiffusionForecastBand[] = [20, 35, 50, 65];

function peakScorePercent(forecast: ResearchDiffusionForecast): number {
  return Math.round(Math.min(100, Math.max(0, (forecast.peakProjectedScore ?? 0) * 100)));
}

function highestLoggedBand(
  log: ResearchDiffusionForecastBandEvent[],
  phase: ResearchDiffusionForecastBandEvent['phase']
): ResearchDiffusionForecastBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchDiffusionForecastBand;
}

export function emptyDiffusionForecastBandLog(): ResearchDiffusionForecastBandEvent[] {
  return [];
}

export function rebuildDiffusionForecastBandLogFromSnapshot(
  snapshot: ResearchDiffusionForecastSnapshot | null,
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastBandEvent[] {
  if (!snapshot) return emptyDiffusionForecastBandLog();
  return appendDiffusionForecastBandEvents(emptyDiffusionForecastBandLog(), snapshot, forecast, turn);
}

export function appendDiffusionForecastBandEvents(
  previousLog: ResearchDiffusionForecastBandEvent[],
  previousSnapshot: ResearchDiffusionForecastSnapshot | null,
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastBandEvent[] {
  const score = peakScorePercent(forecast);
  const priorScore = previousSnapshot?.peakProjectedPercent ?? 0;
  const appended: ResearchDiffusionForecastBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_DIFFUSION_FORECAST_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        peakProjectedPercent: score,
        horizonTurns: forecast.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_DIFFUSION_FORECAST_BANDS[RESEARCH_DIFFUSION_FORECAST_BANDS.length - 1]);
    for (const band of [...RESEARCH_DIFFUSION_FORECAST_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        peakProjectedPercent: score,
        horizonTurns: forecast.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}

// --- bundled from src/diffusion-forecast-snapshot.ts ---
/** Compact persisted digest of diffusion forecast at seal (round 13). */
export function computeDiffusionForecastSnapshot(
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastSnapshot {
  const peakProjectedPercent = Math.round(Math.min(100, Math.max(0, (forecast.peakProjectedScore ?? 0) * 100)));
  const projectionCount = forecast.projections.length;
  let peakBand = 0;
  for (const band of RESEARCH_DIFFUSION_FORECAST_BANDS) {
    if (peakProjectedPercent >= band) peakBand = band;
  }
  const payload = `t${turn}|p${peakProjectedPercent}|h${forecast.horizonTurns}|n${projectionCount}|${forecast.peakRegionId ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    peakProjectedPercent,
    horizonTurns: forecast.horizonTurns,
    projectionCount,
    peakRegionId: forecast.peakRegionId,
    peakBand: peakBand as ResearchDiffusionForecastSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeDiffusionForecastSnapshots(
  local: ResearchDiffusionForecastSnapshot | undefined,
  remote: ResearchDiffusionForecastSnapshot | undefined
): ResearchDiffusionForecastSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/horizon-convergence-outlook.ts ---
/** Deterministic multi-horizon convergence projection (read-only, round 13). */
export function computeResearchHorizonConvergenceOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'diffusionForecast'
    | 'strategicAlignmentOutlook'
    | 'nationalCoherenceOutlook'
    | 'diffusionForecastSnapshot'
  >
): ResearchHorizonConvergenceOutlook {
  const forecast = ctx.diffusionForecast;
  const alignment = ctx.strategicAlignmentOutlook;
  const coherence = ctx.nationalCoherenceOutlook;
  const horizonTurns = forecast?.horizonTurns ?? alignment?.horizonTurns ?? 6;

  const peakPercent = Math.round(Math.min(100, (forecast?.peakProjectedScore ?? 0) * 100));
  const nationalConvergenceScore = Math.min(
    100,
    Math.round(
      peakPercent * 0.42 +
        (alignment?.nationalAlignmentScore ?? 0) * 0.28 +
        (coherence?.nationalCoherenceScore ?? 0) * 0.22
    )
  );
  const projectedConvergenceScore = Math.min(
    100,
    Math.round(
      nationalConvergenceScore +
        peakPercent * 0.12 +
        Math.max(0, (coherence?.projectedCoherenceScore ?? 0) - (coherence?.nationalCoherenceScore ?? 0)) * 0.2
    )
  );

  const links: ResearchHorizonConvergenceLink[] = (forecast?.projections ?? [])
    .filter(p => p.turn === inputs.turn + horizonTurns)
    .sort((a, b) => b.projectedScore - a.projectedScore)
    .slice(0, 4)
    .map(p => ({
      regionId: p.regionId,
      projectedPercent: Math.round(Math.min(100, p.projectedScore * 100)),
      deltaFromNow: p.deltaFromNow,
    }));

  const priorPeak = ctx.diffusionForecastSnapshot?.peakBand ?? 0;
  const forecastMomentum = Math.max(0, peakPercent - priorPeak * 0.55);

  return {
    active: inputs.turn >= 10 || (forecast?.active ?? false) || peakPercent > 0 || links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalConvergenceScore,
    projectedConvergenceScore,
    peakRegionId: forecast?.peakRegionId ?? null,
    forecastMomentum: Math.round(forecastMomentum),
    links,
  };
}

// --- bundled from src/horizon-convergence-band-log.ts ---
export const RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP = 32;

export const RESEARCH_HORIZON_CONVERGENCE_BANDS: ResearchHorizonConvergenceBand[] = [25, 40, 55, 70];

function convergenceScore(outlook: ResearchHorizonConvergenceOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalConvergenceScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchHorizonConvergenceBandEvent[],
  phase: ResearchHorizonConvergenceBandEvent['phase']
): ResearchHorizonConvergenceBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchHorizonConvergenceBand;
}

export function emptyHorizonConvergenceBandLog(): ResearchHorizonConvergenceBandEvent[] {
  return [];
}

export function rebuildHorizonConvergenceBandLogFromSnapshot(
  snapshot: ResearchHorizonConvergenceSnapshot | null,
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceBandEvent[] {
  if (!snapshot) return emptyHorizonConvergenceBandLog();
  return appendHorizonConvergenceBandEvents(emptyHorizonConvergenceBandLog(), snapshot, outlook, turn);
}

export function appendHorizonConvergenceBandEvents(
  previousLog: ResearchHorizonConvergenceBandEvent[],
  previousSnapshot: ResearchHorizonConvergenceSnapshot | null,
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceBandEvent[] {
  const score = convergenceScore(outlook);
  const priorScore = previousSnapshot?.nationalConvergenceScore ?? 0;
  const appended: ResearchHorizonConvergenceBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_HORIZON_CONVERGENCE_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalConvergenceScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_HORIZON_CONVERGENCE_BANDS[RESEARCH_HORIZON_CONVERGENCE_BANDS.length - 1]);
    for (const band of [...RESEARCH_HORIZON_CONVERGENCE_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalConvergenceScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}

// --- bundled from src/horizon-convergence-snapshot.ts ---
/** Compact persisted digest of horizon convergence at seal (round 14). */
export function computeHorizonConvergenceSnapshot(
  outlook: ResearchHorizonConvergenceOutlook,
  turn: number
): ResearchHorizonConvergenceSnapshot {
  const nationalConvergenceScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalConvergenceScore ?? 0))
  );
  const projectedConvergenceScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedConvergenceScore ?? 0))
  );
  let peakBand = 0;
  for (const band of RESEARCH_HORIZON_CONVERGENCE_BANDS) {
    if (nationalConvergenceScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalConvergenceScore}|p${projectedConvergenceScore}|h${outlook.horizonTurns}|${outlook.peakRegionId ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalConvergenceScore,
    projectedConvergenceScore,
    horizonTurns: outlook.horizonTurns,
    peakRegionId: outlook.peakRegionId,
    peakBand: peakBand as ResearchHorizonConvergenceSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeHorizonConvergenceSnapshots(
  local: ResearchHorizonConvergenceSnapshot | undefined,
  remote: ResearchHorizonConvergenceSnapshot | undefined
): ResearchHorizonConvergenceSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/research-execution-outlook.ts ---
/** Deterministic national research execution readiness (read-only, round 14). */
export function computeResearchExecutionOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'horizonConvergenceOutlook'
    | 'strategicAlignmentOutlook'
    | 'integrationRiskOutlook'
    | 'horizonConvergenceSnapshot'
  >
): ResearchExecutionOutlook {
  const convergence = ctx.horizonConvergenceOutlook;
  const alignment = ctx.strategicAlignmentOutlook;
  const risk = ctx.integrationRiskOutlook;
  const horizonTurns = convergence?.horizonTurns ?? alignment?.horizonTurns ?? 6;

  const nationalExecutionScore = Math.min(
    100,
    Math.round(
      (convergence?.nationalConvergenceScore ?? 0) * 0.38 +
        (alignment?.nationalAlignmentScore ?? 0) * 0.32 +
        Math.max(0, 100 - (risk?.nationalRiskScore ?? 0)) * 0.22
    )
  );
  const projectedExecutionScore = Math.min(
    100,
    Math.round(
      nationalExecutionScore +
        Math.max(0, (convergence?.projectedConvergenceScore ?? 0) - (convergence?.nationalConvergenceScore ?? 0)) *
          0.25 +
        Math.max(0, (alignment?.projectedAlignmentScore ?? 0) - (alignment?.nationalAlignmentScore ?? 0)) * 0.15
    )
  );

  const links: ResearchExecutionLink[] = (convergence?.links ?? [])
    .slice(0, 3)
    .map(l => ({
      regionId: l.regionId,
      executionPriority: l.projectedPercent >= 55 ? 'accelerate' : l.projectedPercent >= 35 ? 'steady' : 'observe',
      convergenceDelta: l.deltaFromNow,
    }));

  const priorPeak = ctx.horizonConvergenceSnapshot?.peakBand ?? 0;
  const convergenceMomentum = Math.max(
    0,
    (convergence?.nationalConvergenceScore ?? 0) - priorPeak * 0.45
  );

  return {
    active:
      inputs.turn >= 12 ||
      (convergence?.active ?? false) ||
      (alignment?.active ?? false) ||
      nationalExecutionScore > 0 ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalExecutionScore,
    projectedExecutionScore,
    criticalRiskBranchCount: risk?.criticalBranchCount ?? 0,
    convergenceMomentum: Math.round(convergenceMomentum),
    links,
  };
}

// --- bundled from src/research-execution-band-log.ts ---
export const RESEARCH_EXECUTION_BAND_LOG_CAP = 32;

export const RESEARCH_EXECUTION_BANDS: ResearchExecutionBand[] = [30, 45, 60, 75];

function executionScore(outlook: ResearchExecutionOutlook): number {
  return Math.round(Math.min(100, Math.max(0, outlook.nationalExecutionScore ?? 0)));
}

function highestLoggedBand(
  log: ResearchExecutionBandEvent[],
  phase: ResearchExecutionBandEvent['phase']
): ResearchExecutionBand {
  let best = 0;
  for (const ev of log) {
    if (ev.phase !== phase) continue;
    if (ev.band > best) best = ev.band;
  }
  return best as ResearchExecutionBand;
}

export function emptyResearchExecutionBandLog(): ResearchExecutionBandEvent[] {
  return [];
}

export function rebuildResearchExecutionBandLogFromSnapshot(
  snapshot: ResearchExecutionSnapshot | null,
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionBandEvent[] {
  if (!snapshot) return emptyResearchExecutionBandLog();
  return appendResearchExecutionBandEvents(emptyResearchExecutionBandLog(), snapshot, outlook, turn);
}

export function appendResearchExecutionBandEvents(
  previousLog: ResearchExecutionBandEvent[],
  previousSnapshot: ResearchExecutionSnapshot | null,
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionBandEvent[] {
  const score = executionScore(outlook);
  const priorScore = previousSnapshot?.nationalExecutionScore ?? 0;
  const appended: ResearchExecutionBandEvent[] = [];
  let nextSeq = previousLog.length > 0 ? Math.max(...previousLog.map(e => e.seq)) + 1 : 1;

  if (score > priorScore) {
    const floor = Math.max(highestLoggedBand(previousLog, 'escalation'), previousSnapshot?.peakBand ?? 0);
    for (const band of RESEARCH_EXECUTION_BANDS) {
      if (band <= floor) continue;
      if (score < band) break;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalExecutionScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'escalation',
      });
    }
  } else if (score < priorScore) {
    const ceiling =
      previousSnapshot?.peakBand ??
      (highestLoggedBand(previousLog, 'escalation') ||
        RESEARCH_EXECUTION_BANDS[RESEARCH_EXECUTION_BANDS.length - 1]);
    for (const band of [...RESEARCH_EXECUTION_BANDS].reverse()) {
      if (band > ceiling) continue;
      if (score > band) break;
      if (priorScore < band) continue;
      appended.push({
        seq: nextSeq++,
        turn,
        band,
        nationalExecutionScore: score,
        horizonTurns: outlook.horizonTurns,
        phase: 'de-escalation',
      });
    }
  }

  if (appended.length === 0) return previousLog.slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
  return [...previousLog, ...appended].slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}

// --- bundled from src/research-execution-snapshot.ts ---
/** Compact persisted digest of research execution at seal (round 15). */
export function computeResearchExecutionSnapshot(
  outlook: ResearchExecutionOutlook,
  turn: number
): ResearchExecutionSnapshot {
  const nationalExecutionScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalExecutionScore ?? 0))
  );
  const projectedExecutionScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedExecutionScore ?? 0))
  );
  let peakBand = 0;
  for (const band of RESEARCH_EXECUTION_BANDS) {
    if (nationalExecutionScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalExecutionScore}|p${projectedExecutionScore}|h${outlook.horizonTurns}|r${outlook.criticalRiskBranchCount}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalExecutionScore,
    projectedExecutionScore,
    horizonTurns: outlook.horizonTurns,
    criticalRiskBranchCount: outlook.criticalRiskBranchCount,
    peakBand: peakBand as ResearchExecutionSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeResearchExecutionSnapshots(
  local: ResearchExecutionSnapshot | undefined,
  remote: ResearchExecutionSnapshot | undefined
): ResearchExecutionSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}

// --- bundled from src/strategic-delivery-outlook.ts ---
/** Deterministic strategic delivery horizon (read-only, round 15). */
export function computeResearchStrategicDeliveryOutlook(
  inputs: ResearchProgressInputs,
  ctx: Pick<
    ResearchProgressState,
    | 'researchExecutionOutlook'
    | 'exportContinuityOutlook'
    | 'adoptionHorizonOutlook'
    | 'researchExecutionSnapshot'
  >
): ResearchStrategicDeliveryOutlook {
  const execution = ctx.researchExecutionOutlook;
  const exportOutlook = ctx.exportContinuityOutlook;
  const adoption = ctx.adoptionHorizonOutlook;
  const horizonTurns = execution?.horizonTurns ?? exportOutlook?.horizonTurns ?? adoption?.horizonTurns ?? 6;

  const nationalDeliveryScore = Math.min(
    100,
    Math.round(
      (execution?.nationalExecutionScore ?? 0) * 0.4 +
        (exportOutlook?.nationalContinuityScore ?? 0) * 0.28 +
        (adoption?.nationalAdoptionScore ?? 0) * 0.22
    )
  );
  const projectedDeliveryScore = Math.min(
    100,
    Math.round(
      nationalDeliveryScore +
        Math.max(0, (execution?.projectedExecutionScore ?? 0) - (execution?.nationalExecutionScore ?? 0)) * 0.3 +
        Math.max(0, (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)) *
          0.12
    )
  );

  const links: ResearchStrategicDeliveryLink[] = (execution?.links ?? [])
    .slice(0, 4)
    .map(l => ({
      regionId: l.regionId,
      deliveryPosture: l.executionPriority === 'accelerate' ? 'expedite' : l.executionPriority === 'steady' ? 'sustain' : 'monitor',
      executionDelta: l.convergenceDelta,
    }));

  const priorPeak = ctx.researchExecutionSnapshot?.peakBand ?? 0;
  const executionMomentum = Math.max(0, (execution?.nationalExecutionScore ?? 0) - priorPeak * 0.4);

  return {
    active:
      inputs.turn >= 14 ||
      (execution?.active ?? false) ||
      (exportOutlook?.active ?? false) ||
      nationalDeliveryScore > 0 ||
      links.length > 0,
    baseTurn: inputs.turn,
    horizonTurns,
    nationalDeliveryScore,
    projectedDeliveryScore,
    exportContinuityHeadroom: Math.max(
      0,
      (exportOutlook?.projectedContinuityScore ?? 0) - (exportOutlook?.nationalContinuityScore ?? 0)
    ),
    executionMomentum: Math.round(executionMomentum),
    links,
  };
}

// --- bundled from src/save-migration.ts ---
export function defaultBranchEmphasis(): ResearchBranchEmphasisState[] {
  return RESEARCH_BRANCHES.map(b => ({
    branchId: b.id,
    emphasis: (
      {
        sovereign_research: 'sovereign',
        industrial_transformation: 'commercial',
        digital_frontier: 'applied',
      } as Partial<Record<ResearchBranchId, ResearchProgramEmphasis>>
    )[b.id] ?? 'fundamental',
    setTurn: 0,
  }));
}

/** Fields written to disk; derived analytics recomputed on load/turn. */
export interface ResearchProgressPersistedCore {
  schemaVersion: typeof RESEARCH_PROGRESS_SCHEMA_VERSION;
  revision: number;
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  institutionUpgrades: InstitutionUpgradeState[];
  leadingResearchRegion: ResearchProgressState['leadingResearchRegion'];
  unlockSeq: number;
  branchEmphasis: ResearchBranchEmphasisState[];
  /** Stable hash of persistable payload (excludes fingerprint field). */
  coreFingerprint: string;
  /** Increment when player/system changes branch emphasis on save core. */
  emphasisRevision: number;
  /** Audit trail of schema hops applied to this blob. */
  migrationLog: ResearchSaveMigrationEntry[];
  saveKind: ResearchSaveKind;
  updatedAtTurn: number;
  sessionId: string;
  /** Monotonic counter incremented on each sealed write (round 4). */
  persistRevision: number;
  /** Bounded unlock audit trail for replay / history (round 5). */
  unlockEventLog: ResearchUnlockEvent[];
  /** Last turn reconcileResearchProgressOnLoad sealed against disk (round 5). */
  lastReconciledAtTurn: number;
  /** Bounded emphasis change audit trail (round 6). */
  emphasisChangeLog: ResearchEmphasisChangeEvent[];
  /** Institution tier digest at last persist seal (round 6). */
  institutionTierSnapshot: ResearchInstitutionTierSnapshot | null;
  /** Bounded readiness milestone audit trail (round 7). */
  readinessMilestoneLog: ResearchReadinessMilestoneEvent[];
  /** Branch readiness digest at last persist seal (round 7). */
  readinessBranchSnapshot: ResearchReadinessBranchSnapshot | null;
  /** Bounded integration-risk band audit trail (round 8). */
  integrationRiskLog: ResearchIntegrationRiskEvent[];
  /** Integration risk digest at last persist seal (round 8). */
  integrationRiskSnapshot: ResearchIntegrationRiskSnapshot | null;
  /** Scale-wave digest at last persist seal (round 8). */
  scaleWaveSnapshot: ResearchScaleWaveSnapshot | null;
  /** Bounded synergy threshold audit trail (round 9). */
  synergyThresholdLog: ResearchSynergyThresholdEvent[];
  /** Synergy digest at last persist seal (round 9). */
  synergySnapshot: ResearchSynergySnapshot | null;
  /** Bounded commercialization milestone audit trail (round 10). */
  commercializationMilestoneLog: ResearchCommercializationMilestoneEvent[];
  /** Commercialization digest at last persist seal (round 10). */
  commercializationSnapshot: ResearchCommercializationSnapshot | null;
  /** Bounded diffusion integration audit trail (round 11). */
  diffusionIntegrationLog: ResearchDiffusionIntegrationMilestoneEvent[];
  /** Diffusion integration digest at last persist seal (round 11). */
  diffusionIntegrationSnapshot: ResearchDiffusionIntegrationSnapshot | null;
  /** Bounded portfolio balance band audit trail (round 12). */
  portfolioBalanceLog: ResearchPortfolioBalanceBandEvent[];
  /** Portfolio balance digest at last persist seal (round 12). */
  portfolioBalanceSnapshot: ResearchPortfolioBalanceSnapshot | null;
  /** Bounded diffusion forecast band audit trail (round 13). */
  diffusionForecastBandLog: ResearchDiffusionForecastBandEvent[];
  /** Diffusion forecast digest at last persist seal (round 13). */
  diffusionForecastSnapshot: ResearchDiffusionForecastSnapshot | null;
  /** Bounded horizon convergence band audit trail (round 14). */
  horizonConvergenceBandLog: ResearchHorizonConvergenceBandEvent[];
  /** Horizon convergence digest at last persist seal (round 14). */
  horizonConvergenceSnapshot: ResearchHorizonConvergenceSnapshot | null;
  /** Bounded research execution band audit trail (round 15). */
  researchExecutionBandLog: ResearchExecutionBandEvent[];
  /** Research execution digest at last persist seal (round 15). */
  researchExecutionSnapshot: ResearchExecutionSnapshot | null;
}


const LEGACY_V1 = 'op10m-agent03-v1' as const;
const LEGACY_V2 = 'op10m-agent03-v2' as const;
const LEGACY_V3 = 'op10m-agent03-v3' as const;
const LEGACY_V4 = 'op10m-agent03-v4' as const;
const LEGACY_V5 = 'op10m-agent03-v5' as const;
const LEGACY_V6 = 'op10m-agent03-v6' as const;
const LEGACY_V7 = 'op10m-agent03-v7' as const;
const LEGACY_V8 = 'op10m-agent03-v8' as const;
const LEGACY_V9 = 'op10m-agent03-v9' as const;
const LEGACY_V10 = 'op10m-agent03-v10' as const;
const LEGACY_V11 = 'op10m-agent03-v11' as const;
const LEGACY_V12 = 'op10m-agent03-v12' as const;
const LEGACY_V13 = 'op10m-agent03-v13' as const;
const LEGACY_V14 = 'op10m-agent03-v14' as const;

/** Keys that must never appear on persisted save blobs (Agent 25 guard). */
export const RESEARCH_SAVE_DERIVED_KEYS = [
  'diffusion',
  'readinessByBranch',
  'activeHookIds',
  'inputHash',
  'lateGameDiffusion',
  'scaleWave',
  'commercialization',
  'portfolioBalance',
  'diffusionForecast',
  'synergyOutlook',
  'integrationRiskOutlook',
  'adoptionHorizonOutlook',
  'portfolioStabilizationOutlook',
  'exportContinuityOutlook',
  'nationalCoherenceOutlook',
  'strategicAlignmentOutlook',
  'horizonConvergenceOutlook',
  'researchExecutionOutlook',
  'strategicDeliveryOutlook',
] as const;

function finalizeCoreForPersist(
  partial: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> & { coreFingerprint?: string }
): ResearchProgressPersistedCore {
  const draft: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: partial.revision,
    turn: partial.turn,
    unlockedNodes: partial.unlockedNodes,
    institutionUpgrades: partial.institutionUpgrades,
    leadingResearchRegion: partial.leadingResearchRegion,
    unlockSeq: partial.unlockSeq,
    branchEmphasis: partial.branchEmphasis,
    emphasisRevision: partial.emphasisRevision ?? 0,
    migrationLog: partial.migrationLog ?? [],
    saveKind: partial.saveKind ?? 'manual',
    updatedAtTurn: partial.updatedAtTurn ?? partial.turn,
    sessionId: partial.sessionId ?? `o10m_r03_${partial.turn}_${partial.revision}`,
    persistRevision: partial.persistRevision ?? 0,
    unlockEventLog: partial.unlockEventLog ?? emptyUnlockEventLog(),
    lastReconciledAtTurn: partial.lastReconciledAtTurn ?? partial.turn,
    emphasisChangeLog: partial.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    institutionTierSnapshot: partial.institutionTierSnapshot ?? null,
    readinessMilestoneLog: partial.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: partial.readinessBranchSnapshot ?? null,
    integrationRiskLog: partial.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: partial.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: partial.scaleWaveSnapshot ?? null,
    synergyThresholdLog: partial.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: partial.synergySnapshot ?? null,
    commercializationMilestoneLog: partial.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: partial.commercializationSnapshot ?? null,
    diffusionIntegrationLog: partial.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: partial.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: partial.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: partial.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: partial.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: partial.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: partial.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: partial.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: partial.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: partial.researchExecutionSnapshot ?? null,
  };
  return { ...draft, coreFingerprint: computePersistedCoreFingerprint(draft) };
}

/** Public alias for lifecycle merge/seal helpers. */
export const finalizePersistedCoreDraft = finalizeCoreForPersist;

export function computePersistedCoreFingerprint(
  core: Omit<ResearchProgressPersistedCore, 'coreFingerprint'>
): string {
  let h = 2166136261 >>> 0;
  const payload = JSON.stringify({
    schemaVersion: core.schemaVersion,
    revision: core.revision,
    turn: core.turn,
    unlockSeq: core.unlockSeq,
    emphasisRevision: core.emphasisRevision,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    branchEmphasis: core.branchEmphasis,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog: core.unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: core.institutionTierSnapshot,
    readinessMilestoneLog: core.readinessMilestoneLog,
    readinessBranchSnapshot: core.readinessBranchSnapshot,
    integrationRiskLog: core.integrationRiskLog,
    integrationRiskSnapshot: core.integrationRiskSnapshot,
    scaleWaveSnapshot: core.scaleWaveSnapshot,
    synergyThresholdLog: core.synergyThresholdLog,
    synergySnapshot: core.synergySnapshot,
    commercializationMilestoneLog: core.commercializationMilestoneLog,
    commercializationSnapshot: core.commercializationSnapshot,
    diffusionIntegrationLog: core.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: core.diffusionIntegrationSnapshot,
    portfolioBalanceLog: core.portfolioBalanceLog,
    portfolioBalanceSnapshot: core.portfolioBalanceSnapshot,
    diffusionForecastBandLog: core.diffusionForecastBandLog,
    diffusionForecastSnapshot: core.diffusionForecastSnapshot,
    horizonConvergenceBandLog: core.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: core.horizonConvergenceSnapshot,
    researchExecutionBandLog: core.researchExecutionBandLog,
    researchExecutionSnapshot: core.researchExecutionSnapshot,
  });
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function upgradeToCurrentCore(
  base: Omit<ResearchProgressPersistedCore, 'coreFingerprint' | 'emphasisRevision' | 'migrationLog'> & {
    emphasisRevision?: number;
    migrationLog?: ResearchSaveMigrationEntry[];
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
    unlockEventLog?: ResearchUnlockEvent[];
    lastReconciledAtTurn?: number;
  },
  fromVersion: ResearchSaveMigrationEntry['fromVersion']
): ResearchProgressPersistedCore {
  const migrationLog: ResearchSaveMigrationEntry[] = [
    ...(base.migrationLog ?? []),
    { fromVersion, toVersion: RESEARCH_PROGRESS_SCHEMA_VERSION, turn: base.turn },
  ];
  return finalizeCoreForPersist({
    ...base,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    emphasisRevision: base.emphasisRevision ?? 0,
    migrationLog,
    emphasisChangeLog:
      base.emphasisChangeLog ??
      rebuildEmphasisChangeLogFromBranchEmphasis(
        base.branchEmphasis ?? defaultBranchEmphasis(),
        base.emphasisRevision ?? 0,
        base.turn
      ),
    institutionTierSnapshot:
      base.institutionTierSnapshot ?? snapshotFromUpgrades(base.institutionUpgrades ?? [], base.turn),
    readinessMilestoneLog:
      base.readinessMilestoneLog ??
      rebuildReadinessMilestoneLogFromSnapshot(base.readinessBranchSnapshot ?? null, base.turn),
    readinessBranchSnapshot: base.readinessBranchSnapshot ?? null,
    integrationRiskLog: base.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: base.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: base.scaleWaveSnapshot ?? null,
    synergyThresholdLog: base.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: base.synergySnapshot ?? null,
    commercializationMilestoneLog: base.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: base.commercializationSnapshot ?? null,
    diffusionIntegrationLog: base.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: base.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: base.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: base.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: base.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: base.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: base.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: base.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: base.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: base.researchExecutionSnapshot ?? null,
    unlockEventLog: base.unlockEventLog ?? rebuildUnlockEventLogFromNodes(base.unlockedNodes ?? []),
    lastReconciledAtTurn: base.lastReconciledAtTurn ?? base.turn,
  });
}

export function emptyResearchProgressCore(turn = 0): ResearchProgressPersistedCore {
  return emptyCore(turn);
}

function emptyCore(turn = 0): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    institutionUpgrades: [],
    leadingResearchRegion: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
    saveKind: 'manual',
    updatedAtTurn: turn,
    sessionId: `o10m_r03_${turn}_0`,
    persistRevision: 0,
    unlockEventLog: emptyUnlockEventLog(),
    lastReconciledAtTurn: turn,
    emphasisChangeLog: emptyEmphasisChangeLog(),
    institutionTierSnapshot: null,
    readinessMilestoneLog: emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: null,
    integrationRiskLog: emptyIntegrationRiskLog(),
    integrationRiskSnapshot: null,
    scaleWaveSnapshot: null,
    synergyThresholdLog: emptySynergyThresholdLog(),
    synergySnapshot: null,
    commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
    commercializationSnapshot: null,
    diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: null,
    portfolioBalanceLog: emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: null,
    diffusionForecastBandLog: emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: null,
    horizonConvergenceBandLog: emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: null,
    researchExecutionBandLog: emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: null,
  });
}

function sanitizeUnlockedNodes(raw: unknown): UnlockedResearchNode[] {
  if (!Array.isArray(raw)) return [];
  const out: UnlockedResearchNode[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as UnlockedResearchNode;
    if (typeof o.nodeId !== 'string' || !RESEARCH_NODE_BY_ID[o.nodeId]) continue;
    const def = RESEARCH_NODE_BY_ID[o.nodeId];
    out.push({
      nodeId: o.nodeId,
      branchId: def.branchId,
      unlockedTurn: Number(o.unlockedTurn) || 0,
      anchorRegionId: o.anchorRegionId ?? null,
    });
  }
  return out.sort((a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId));
}

function sanitizeInstitutionUpgrades(raw: unknown): InstitutionUpgradeState[] {
  if (!Array.isArray(raw)) return [];
  const tiers = new Set<InstitutionUpgradeTier>([
    'dormant',
    'affiliate',
    'partner',
    'strategic',
    'national_integration',
  ]);
  return raw
    .filter(x => x && typeof x === 'object' && typeof (x as InstitutionUpgradeState).institutionId === 'string')
    .map(x => {
      const o = x as InstitutionUpgradeState;
      const tier = tiers.has(o.tier) ? o.tier : 'dormant';
      return {
        institutionId: String(o.institutionId),
        tier,
        readinessMultiplier: Number(o.readinessMultiplier) || 0,
        diffusionMultiplier: Number(o.diffusionMultiplier) || 0,
        assessedTurn: Number(o.assessedTurn) || 0,
        reasons: Array.isArray(o.reasons) ? o.reasons.map(String) : [],
      };
    });
}

function sanitizeBranchEmphasis(raw: unknown): ResearchBranchEmphasisState[] {
  const defaults = defaultBranchEmphasis();
  if (!Array.isArray(raw)) return defaults;
  const byId = Object.fromEntries(defaults.map(d => [d.branchId, d]));
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchBranchEmphasisState;
    if (!byId[o.branchId]) continue;
    const emph = o.emphasis;
    if (emph === 'applied' || emph === 'fundamental' || emph === 'commercial' || emph === 'sovereign') {
      byId[o.branchId] = { branchId: o.branchId, emphasis: emph, setTurn: Number(o.setTurn) || 0 };
    }
  }
  return RESEARCH_BRANCHES.map(b => byId[b.id]);
}

function mergeMonotonicUpgrades(
  incoming: InstitutionUpgradeState[],
  previous: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = Object.fromEntries(previous.map(u => [u.institutionId, u]));
  return incoming.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

function computeUnlockSeq(nodes: UnlockedResearchNode[]): number {
  return nodes.length;
}

function sanitizeUnlockEventLog(raw: unknown): ResearchUnlockEvent[] {
  if (!Array.isArray(raw)) return emptyUnlockEventLog();
  const out: ResearchUnlockEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchUnlockEvent;
    if (typeof o.nodeId !== 'string' || !RESEARCH_NODE_BY_ID[o.nodeId]) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      nodeId: o.nodeId,
      branchId: RESEARCH_NODE_BY_ID[o.nodeId].branchId,
      hookIds: Array.isArray(o.hookIds) ? o.hookIds.map(String) : RESEARCH_NODE_BY_ID[o.nodeId].hookIds,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-64);
}

function sanitizeEmphasisChangeLog(raw: unknown): ResearchEmphasisChangeEvent[] {
  if (!Array.isArray(raw)) return emptyEmphasisChangeLog();
  const emphSet = new Set<ResearchProgramEmphasis>(['applied', 'fundamental', 'commercial', 'sovereign']);
  const out: ResearchEmphasisChangeEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchEmphasisChangeEvent;
    if (typeof o.branchId !== 'string') continue;
    if (!emphSet.has(o.fromEmphasis) || !emphSet.has(o.toEmphasis)) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      branchId: o.branchId as ResearchBranchId,
      fromEmphasis: o.fromEmphasis,
      toEmphasis: o.toEmphasis,
      emphasisRevision: Number(o.emphasisRevision) || 0,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-32);
}

function sanitizeInstitutionTierSnapshot(raw: unknown, turn: number): ResearchInstitutionTierSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchInstitutionTierSnapshot;
  if (typeof o.digest !== 'string') return null;
  const tiers =
    o.tiers && typeof o.tiers === 'object'
      ? (o.tiers as ResearchInstitutionTierSnapshot['tiers'])
      : ({} as ResearchInstitutionTierSnapshot['tiers']);
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    tiers,
    digest: o.digest,
    nationalIntegrationCount: Number(o.nationalIntegrationCount) || 0,
    strategicOrAboveCount: Number(o.strategicOrAboveCount) || 0,
  };
}

function sanitizeReadinessMilestoneLog(raw: unknown): ResearchReadinessMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyReadinessMilestoneLog();
  const milestones = new Set([25, 50, 75, 90]);
  const out: ResearchReadinessMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchReadinessMilestoneEvent;
    if (typeof o.branchId !== 'string') continue;
    if (!milestones.has(Number(o.milestone))) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      branchId: o.branchId as ResearchBranchId,
      milestone: o.milestone,
      readiness: Number(o.readiness) || 0,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-48);
}

function sanitizeReadinessBranchSnapshot(raw: unknown, turn: number): ResearchReadinessBranchSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchReadinessBranchSnapshot;
  if (typeof o.digest !== 'string') return null;
  const readinessByBranch =
    o.readinessByBranch && typeof o.readinessByBranch === 'object'
      ? (o.readinessByBranch as ResearchReadinessBranchSnapshot['readinessByBranch'])
      : ({} as ResearchReadinessBranchSnapshot['readinessByBranch']);
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    readinessByBranch,
    digest: o.digest,
    branchAbove75Count: Number(o.branchAbove75Count) || 0,
    nationalMeanReadiness: Number(o.nationalMeanReadiness) || 0,
  };
}

function sanitizeIntegrationRiskLog(raw: unknown): ResearchIntegrationRiskEvent[] {
  if (!Array.isArray(raw)) return emptyIntegrationRiskLog();
  const bands = new Set([40, 60, 80]);
  const out: ResearchIntegrationRiskEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchIntegrationRiskEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalRiskScore: Number(o.nationalRiskScore) || 0,
      criticalBranchCount: Number(o.criticalBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}

function sanitizeIntegrationRiskSnapshot(raw: unknown, turn: number): ResearchIntegrationRiskSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchIntegrationRiskSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalRiskScore: Number(o.nationalRiskScore) || 0,
    criticalBranchCount: Number(o.criticalBranchCount) || 0,
    peakRiskBand: (Number(o.peakRiskBand) || 0) as ResearchIntegrationRiskSnapshot['peakRiskBand'],
    digest: o.digest,
  };
}

function sanitizeScaleWaveSnapshot(raw: unknown, turn: number): ResearchScaleWaveSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    tier5UnlockCount: Number(o.tier5UnlockCount) || 0,
    crossBranchSynergyScore: Number(o.crossBranchSynergyScore) || 0,
    transferLinkCount: Number(o.transferLinkCount) || 0,
    dominantCapabilityCluster: o.dominantCapabilityCluster ?? null,
    digest: o.digest,
  };
}

function sanitizeSynergyThresholdLog(raw: unknown): ResearchSynergyThresholdEvent[] {
  if (!Array.isArray(raw)) return emptySynergyThresholdLog();
  const thresholds = new Set([25, 50, 75, 90]);
  const out: ResearchSynergyThresholdEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchSynergyThresholdEvent;
    if (!thresholds.has(Number(o.threshold))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      threshold: o.threshold,
      synergyScore: Number(o.synergyScore) || 0,
      activeMultiBranchCount: Number(o.activeMultiBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}

function sanitizeSynergySnapshot(raw: unknown, turn: number): ResearchSynergySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchSynergySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    currentSynergyScore: Number(o.currentSynergyScore) || 0,
    projectedSynergyScore: Number(o.projectedSynergyScore) || 0,
    activeMultiBranchCount: Number(o.activeMultiBranchCount) || 0,
    peakThreshold: (Number(o.peakThreshold) || 0) as ResearchSynergySnapshot['peakThreshold'],
    dominantCapabilityCluster: o.dominantCapabilityCluster ?? null,
    digest: o.digest,
  };
}

function sanitizeCommercializationMilestoneLog(raw: unknown): ResearchCommercializationMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyCommercializationMilestoneLog();
  const milestones = new Set([30, 50, 70, 90]);
  const out: ResearchCommercializationMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchCommercializationMilestoneEvent;
    if (!milestones.has(Number(o.milestone))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      milestone: o.milestone,
      nationalExportScore: Number(o.nationalExportScore) || 0,
      highPriorityBranchCount: Number(o.highPriorityBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}

function sanitizeCommercializationSnapshot(raw: unknown, turn: number): ResearchCommercializationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchCommercializationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalExportScore: Number(o.nationalExportScore) || 0,
    highPriorityBranchCount: Number(o.highPriorityBranchCount) || 0,
    mediumPriorityBranchCount: Number(o.mediumPriorityBranchCount) || 0,
    peakMilestone: (Number(o.peakMilestone) || 0) as ResearchCommercializationSnapshot['peakMilestone'],
    digest: o.digest,
  };
}

function sanitizeDiffusionIntegrationLog(raw: unknown): ResearchDiffusionIntegrationMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyDiffusionIntegrationLog();
  const milestones = new Set([1, 2, 4, 6]);
  const out: ResearchDiffusionIntegrationMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchDiffusionIntegrationMilestoneEvent;
    if (!milestones.has(Number(o.milestone))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      milestone: o.milestone,
      integratedRegionCount: Number(o.integratedRegionCount) || 0,
      meanDiffusionScore: Number(o.meanDiffusionScore) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}

function sanitizeDiffusionIntegrationSnapshot(raw: unknown, turn: number): ResearchDiffusionIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchDiffusionIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integratedRegionCount: Number(o.integratedRegionCount) || 0,
    adoptingRegionCount: Number(o.adoptingRegionCount) || 0,
    meanDiffusionScore: Number(o.meanDiffusionScore) || 0,
    leadingResearchRegion: o.leadingResearchRegion ?? null,
    peakMilestone: (Number(o.peakMilestone) || 0) as ResearchDiffusionIntegrationSnapshot['peakMilestone'],
    digest: o.digest,
  };
}

function sanitizePortfolioBalanceLog(raw: unknown): ResearchPortfolioBalanceBandEvent[] {
  if (!Array.isArray(raw)) return emptyPortfolioBalanceLog();
  const bands = new Set([40, 55, 70, 85]);
  const out: ResearchPortfolioBalanceBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchPortfolioBalanceBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalBalanceScore: Number(o.nationalBalanceScore) || 0,
      criticalBranchCount: Number(o.criticalBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}

function sanitizePortfolioBalanceSnapshot(raw: unknown, turn: number): ResearchPortfolioBalanceSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchPortfolioBalanceSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalBalanceScore: Number(o.nationalBalanceScore) || 0,
    criticalBranchCount: Number(o.criticalBranchCount) || 0,
    watchBranchCount: Number(o.watchBranchCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchPortfolioBalanceSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeDiffusionForecastBandLog(raw: unknown): ResearchDiffusionForecastBandEvent[] {
  if (!Array.isArray(raw)) return emptyDiffusionForecastBandLog();
  const bands = new Set([20, 35, 50, 65]);
  const out: ResearchDiffusionForecastBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchDiffusionForecastBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      peakProjectedPercent: Number(o.peakProjectedPercent) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}

function sanitizeDiffusionForecastSnapshot(raw: unknown, turn: number): ResearchDiffusionForecastSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchDiffusionForecastSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    peakProjectedPercent: Number(o.peakProjectedPercent) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    projectionCount: Number(o.projectionCount) || 0,
    peakRegionId: o.peakRegionId ?? null,
    peakBand: (Number(o.peakBand) || 0) as ResearchDiffusionForecastSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeHorizonConvergenceBandLog(raw: unknown): ResearchHorizonConvergenceBandEvent[] {
  if (!Array.isArray(raw)) return emptyHorizonConvergenceBandLog();
  const bands = new Set([25, 40, 55, 70]);
  const out: ResearchHorizonConvergenceBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchHorizonConvergenceBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalConvergenceScore: Number(o.nationalConvergenceScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}

function sanitizeHorizonConvergenceSnapshot(raw: unknown, turn: number): ResearchHorizonConvergenceSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchHorizonConvergenceSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalConvergenceScore: Number(o.nationalConvergenceScore) || 0,
    projectedConvergenceScore: Number(o.projectedConvergenceScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    peakRegionId: o.peakRegionId ?? null,
    peakBand: (Number(o.peakBand) || 0) as ResearchHorizonConvergenceSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeResearchExecutionBandLog(raw: unknown): ResearchExecutionBandEvent[] {
  if (!Array.isArray(raw)) return emptyResearchExecutionBandLog();
  const bands = new Set([30, 45, 60, 75]);
  const out: ResearchExecutionBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchExecutionBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalExecutionScore: Number(o.nationalExecutionScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}

function sanitizeResearchExecutionSnapshot(raw: unknown, turn: number): ResearchExecutionSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchExecutionSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalExecutionScore: Number(o.nationalExecutionScore) || 0,
    projectedExecutionScore: Number(o.projectedExecutionScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    criticalRiskBranchCount: Number(o.criticalRiskBranchCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchExecutionSnapshot['peakBand'],
    digest: o.digest,
  };
}

function snapshotFromUpgrades(
  upgrades: InstitutionUpgradeState[],
  turn: number
): ResearchInstitutionTierSnapshot {
  return computeInstitutionTierSnapshot(upgrades, turn);
}

export function migrateResearchProgressSave(raw: unknown): ResearchProgressPersistedCore | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion as ResearchProgressSchemaVersion | undefined;

  if (ver === RESEARCH_PROGRESS_SCHEMA_VERSION) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const eventLog = sanitizeUnlockEventLog(o.unlockEventLog);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const draft = finalizeCoreForPersist({
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      revision: Number(o.revision) || 0,
      turn,
      unlockedNodes: nodes,
      institutionUpgrades: upgrades,
      leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
      unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
      branchEmphasis,
      emphasisRevision,
      migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
      saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
      updatedAtTurn: Number(o.updatedAtTurn) || turn,
      sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
      persistRevision: Number(o.persistRevision) || 0,
      unlockEventLog: eventLog.length ? eventLog : rebuildUnlockEventLogFromNodes(nodes),
      lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
      emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
        ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
        : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
      institutionTierSnapshot:
        sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
        snapshotFromUpgrades(upgrades, turn),
      readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
        ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
        : emptyReadinessMilestoneLog(),
      readinessBranchSnapshot: sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn),
      integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
        ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
        : emptyIntegrationRiskLog(),
      integrationRiskSnapshot: sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn),
      scaleWaveSnapshot: sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn),
      synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
        ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
        : emptySynergyThresholdLog(),
      synergySnapshot: sanitizeSynergySnapshot(o.synergySnapshot, turn),
      commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
        ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
        : emptyCommercializationMilestoneLog(),
      commercializationSnapshot: sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn),
      diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
        ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
        : emptyDiffusionIntegrationLog(),
      diffusionIntegrationSnapshot: sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn),
      portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
        ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
        : emptyPortfolioBalanceLog(),
      portfolioBalanceSnapshot: sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn),
      diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
        ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
        : emptyDiffusionForecastBandLog(),
      diffusionForecastSnapshot: sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn),
      horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
        ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
        : emptyHorizonConvergenceBandLog(),
      horizonConvergenceSnapshot: sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn),
      researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
        ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
        : emptyResearchExecutionBandLog(),
      researchExecutionSnapshot: sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn),
    });
    if (typeof o.coreFingerprint === 'string' && o.coreFingerprint !== draft.coreFingerprint) {
      return draft;
    }
    return draft;
  }

  if (ver === LEGACY_V14) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: emptyResearchExecutionBandLog(),
        researchExecutionSnapshot: null,
      },
      LEGACY_V14
    );
  }

  if (ver === LEGACY_V13) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot: null,
      },
      LEGACY_V13
    );
  }

  if (ver === LEGACY_V12) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot: null,
      },
      LEGACY_V12
    );
  }

  if (ver === LEGACY_V11) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V11
    );
  }

  if (ver === LEGACY_V10) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V10
    );
  }

  if (ver === LEGACY_V9) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V9
    );
  }

  if (ver === LEGACY_V8) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V8
    );
  }

  if (ver === LEGACY_V7) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: emptyIntegrationRiskLog(),
        integrationRiskSnapshot: null,
        scaleWaveSnapshot: null,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
      },
      LEGACY_V7
    );
  }

  if (ver === LEGACY_V6) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: emptyReadinessMilestoneLog(),
        readinessBranchSnapshot: null,
        integrationRiskLog: emptyIntegrationRiskLog(),
        integrationRiskSnapshot: null,
        scaleWaveSnapshot: null,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
      },
      LEGACY_V6
    );
  }

  if (ver === LEGACY_V5) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
      },
      LEGACY_V5
    );
  }

  if (ver === LEGACY_V4) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
        emphasisRevision: Number(o.emphasisRevision) || 0,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || Number(o.turn) || 0,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${Number(o.turn) || 0}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.turn) || 0,
      },
      LEGACY_V4
    );
  }

  if (ver === LEGACY_V3) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
        emphasisRevision: Number(o.emphasisRevision) || 0,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: 'manual',
        updatedAtTurn: Number(o.turn) || 0,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${Number(o.turn) || 0}`,
        persistRevision: 0,
      },
      LEGACY_V3
    );
  }

  if (ver === LEGACY_V2) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
      },
      LEGACY_V2
    );
  }

  if (ver === LEGACY_V1) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: 1,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: computeUnlockSeq(nodes),
        branchEmphasis: defaultBranchEmphasis(),
      },
      LEGACY_V1
    );
  }

  if (Array.isArray(raw)) {
    const nodes = sanitizeUnlockedNodes(raw);
    return upgradeToCurrentCore(
      { ...emptyCore(0), revision: 1, unlockedNodes: nodes, unlockSeq: computeUnlockSeq(nodes) },
      'array-legacy'
    );
  }

  return null;
}

export function extractPersistedCore(state: ResearchProgressState): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: state.revision ?? 0,
    turn: state.turn,
    unlockedNodes: state.unlockedNodes,
    institutionUpgrades: state.institutionUpgrades,
    leadingResearchRegion: state.leadingResearchRegion,
    unlockSeq: state.unlockSeq ?? computeUnlockSeq(state.unlockedNodes),
    branchEmphasis: state.branchEmphasis ?? defaultBranchEmphasis(),
    emphasisRevision: state.emphasisRevision ?? 0,
    migrationLog: state.migrationLog ?? [],
    saveKind: state.saveKind ?? 'manual',
    updatedAtTurn: state.updatedAtTurn ?? state.turn,
    sessionId: state.sessionId ?? `o10m_r03_${state.turn}_${state.revision ?? 0}`,
    persistRevision: state.persistRevision ?? 0,
    unlockEventLog: state.unlockEventLog ?? emptyUnlockEventLog(),
    lastReconciledAtTurn: state.lastReconciledAtTurn ?? state.turn,
    emphasisChangeLog: state.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    institutionTierSnapshot:
      state.institutionTierSnapshot ??
      computeInstitutionTierSnapshot(state.institutionUpgrades, state.turn),
    readinessMilestoneLog: state.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: state.readinessBranchSnapshot ?? null,
    integrationRiskLog: state.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: state.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: state.scaleWaveSnapshot ?? null,
    synergyThresholdLog: state.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: state.synergySnapshot ?? null,
    commercializationMilestoneLog: state.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: state.commercializationSnapshot ?? null,
    diffusionIntegrationLog: state.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: state.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: state.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: state.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: state.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: state.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: state.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: state.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: state.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: state.researchExecutionSnapshot ?? null,
  });
}

export function prepareResearchProgressForSave(state: ResearchProgressState): ResearchProgressPersistedCore {
  return extractPersistedCore(state);
}

export function hydrateResearchProgressCore(core: ResearchProgressPersistedCore | null): ResearchProgressState | null {
  if (!core) return null;
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision,
    turn: core.turn,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockSeq: core.unlockSeq,
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog: core.unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: core.institutionTierSnapshot,
    readinessMilestoneLog: core.readinessMilestoneLog,
    readinessBranchSnapshot: core.readinessBranchSnapshot,
    integrationRiskLog: core.integrationRiskLog,
    integrationRiskSnapshot: core.integrationRiskSnapshot,
    scaleWaveSnapshot: core.scaleWaveSnapshot,
    synergyThresholdLog: core.synergyThresholdLog,
    synergySnapshot: core.synergySnapshot,
    commercializationMilestoneLog: core.commercializationMilestoneLog,
    commercializationSnapshot: core.commercializationSnapshot,
    diffusionIntegrationLog: core.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: core.diffusionIntegrationSnapshot,
    portfolioBalanceLog: core.portfolioBalanceLog,
    portfolioBalanceSnapshot: core.portfolioBalanceSnapshot,
    diffusionForecastBandLog: core.diffusionForecastBandLog,
    diffusionForecastSnapshot: core.diffusionForecastSnapshot,
    horizonConvergenceBandLog: core.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: core.horizonConvergenceSnapshot,
    researchExecutionBandLog: core.researchExecutionBandLog,
    researchExecutionSnapshot: core.researchExecutionSnapshot,
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent' as const,
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    inputHash: '',
    lateGameDiffusion: null,
    scaleWave: null,
  };
}

export function mergeComputedResearchState(
  core: ResearchProgressPersistedCore,
  computed: ResearchProgressState
): ResearchProgressState {
  const mergedUpgrades = mergeMonotonicUpgrades(computed.institutionUpgrades, core.institutionUpgrades);
  const unlockSet = new Map<string, UnlockedResearchNode>();
  core.unlockedNodes.forEach(u => unlockSet.set(u.nodeId, u));
  computed.unlockedNodes.forEach(u => {
    if (!unlockSet.has(u.nodeId)) unlockSet.set(u.nodeId, u);
  });
  const unlockedNodes = [...unlockSet.values()].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );
  const newUnlocks = unlockedNodes.length - core.unlockedNodes.length;
  const unlockEventLog = appendUnlockEvents(
    core.unlockEventLog ?? emptyUnlockEventLog(),
    core.unlockedNodes,
    unlockedNodes,
    computed.turn,
    Math.max(core.unlockSeq, unlockedNodes.length)
  );
  const integrationRiskOutlook =
    computed.integrationRiskOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      nationalRiskScore: 0,
      criticalBranchCount: 0,
      links: [],
    } as const);
  const integrationRiskLog = appendIntegrationRiskEvents(
    core.integrationRiskLog ?? emptyIntegrationRiskLog(),
    core.integrationRiskSnapshot ?? null,
    integrationRiskOutlook,
    computed.turn
  );
  const synergyOutlook =
    computed.synergyOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      currentSynergyScore: 0,
      projectedSynergyScore: 0,
      activeMultiBranchCount: 0,
      transferLinks: [],
      dominantCapabilityCluster: null,
    } as const);
  const synergyThresholdLog = appendSynergyThresholdEvents(
    core.synergyThresholdLog ?? emptySynergyThresholdLog(),
    core.synergySnapshot ?? null,
    synergyOutlook,
    computed.turn
  );
  const commercialization =
    computed.commercialization ??
    ({
      active: false,
      hints: [],
      nationalExportScore: 0,
    } as const);
  const commercializationMilestoneLog = appendCommercializationMilestoneEvents(
    core.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    core.commercializationSnapshot ?? null,
    commercialization,
    computed.turn
  );
  const diffusionIntegrationLog = appendDiffusionIntegrationEvents(
    core.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    core.diffusionIntegrationSnapshot ?? null,
    computed.diffusion,
    computed.turn
  );
  const portfolioBalance =
    computed.portfolioBalance ??
    ({
      active: false,
      hints: [],
      nationalBalanceScore: 50,
    } as const);
  const portfolioBalanceLog = appendPortfolioBalanceBandEvents(
    core.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    core.portfolioBalanceSnapshot ?? null,
    portfolioBalance,
    computed.turn
  );
  const diffusionForecast =
    computed.diffusionForecast ??
    ({
      active: false,
      horizonTurns: 6,
      peakProjectedScore: 0,
      peakRegionId: null,
      projections: [],
    } as const);
  const diffusionForecastBandLog = appendDiffusionForecastBandEvents(
    core.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    core.diffusionForecastSnapshot ?? null,
    diffusionForecast,
    computed.turn
  );
  const horizonConvergenceOutlook =
    computed.horizonConvergenceOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalConvergenceScore: 0,
      projectedConvergenceScore: 0,
      peakRegionId: null,
      forecastMomentum: 0,
      links: [],
    } as const);
  const horizonConvergenceBandLog = appendHorizonConvergenceBandEvents(
    core.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    core.horizonConvergenceSnapshot ?? null,
    horizonConvergenceOutlook,
    computed.turn
  );
  const researchExecutionOutlook =
    computed.researchExecutionOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalExecutionScore: 0,
      projectedExecutionScore: 0,
      criticalRiskBranchCount: 0,
      convergenceMomentum: 0,
      links: [],
    } as const);
  const researchExecutionBandLog = appendResearchExecutionBandEvents(
    core.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    core.researchExecutionSnapshot ?? null,
    researchExecutionOutlook,
    computed.turn
  );
  return {
    ...computed,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision + (newUnlocks > 0 ? 1 : 0),
    turn: computed.turn,
    unlockedNodes,
    institutionUpgrades: mergedUpgrades,
    unlockSeq: Math.max(core.unlockSeq, unlockedNodes.length),
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: computeInstitutionTierSnapshot(mergedUpgrades, computed.turn),
    readinessMilestoneLog: appendReadinessMilestoneEvents(
      core.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
      core.readinessBranchSnapshot ?? null,
      computed.readinessByBranch,
      computed.turn
    ),
    readinessBranchSnapshot: computeReadinessBranchSnapshot(computed.readinessByBranch, computed.turn),
    integrationRiskLog,
    integrationRiskSnapshot: computeIntegrationRiskSnapshot(integrationRiskOutlook, computed.turn),
    scaleWaveSnapshot: computeScaleWaveSnapshot(computed.scaleWave, computed.turn),
    synergyThresholdLog,
    synergySnapshot: computeSynergySnapshot(synergyOutlook, computed.turn),
    commercializationMilestoneLog,
    commercializationSnapshot: computeCommercializationSnapshot(commercialization, computed.turn),
    diffusionIntegrationLog,
    diffusionIntegrationSnapshot: computeDiffusionIntegrationSnapshot(
      computed.diffusion,
      computed.leadingResearchRegion,
      computed.turn
    ),
    portfolioBalanceLog,
    portfolioBalanceSnapshot: computePortfolioBalanceSnapshot(portfolioBalance, computed.turn),
    diffusionForecastBandLog,
    diffusionForecastSnapshot: computeDiffusionForecastSnapshot(diffusionForecast, computed.turn),
    horizonConvergenceBandLog,
    horizonConvergenceSnapshot: computeHorizonConvergenceSnapshot(horizonConvergenceOutlook, computed.turn),
    researchExecutionBandLog,
    researchExecutionSnapshot: computeResearchExecutionSnapshot(researchExecutionOutlook, computed.turn),
  };
}

export function detectForeignSaveFields(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
  const o = raw as Record<string, unknown>;
  return RESEARCH_SAVE_DERIVED_KEYS.filter(k => k in o);
}

export function validatePersistedCoreForWrite(core: ResearchProgressPersistedCore): string[] {
  const issues: string[] = [];
  if (core.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION) {
    issues.push(`schema must be ${RESEARCH_PROGRESS_SCHEMA_VERSION}`);
  }
  const { coreFingerprint, ...rest } = core;
  if (coreFingerprint !== computePersistedCoreFingerprint(rest)) {
    issues.push('coreFingerprint mismatch');
  }
  if ((core.unlockSeq ?? 0) < core.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  return issues;
}

export function setResearchBranchEmphasisOnCore(
  core: ResearchProgressPersistedCore,
  branchId: ResearchBranchId,
  emphasis: ResearchProgramEmphasis,
  turn: number
): ResearchProgressPersistedCore {
  const branchEmphasis = core.branchEmphasis.map(e =>
    e.branchId === branchId ? { ...e, emphasis, setTurn: turn } : e
  );
  const prev = core.branchEmphasis.find(e => e.branchId === branchId);
  const nextRevision = core.emphasisRevision + 1;
  const emphasisChangeLog = appendEmphasisChangeEvent(
    core.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    branchId,
    prev?.emphasis ?? 'fundamental',
    emphasis,
    turn,
    nextRevision
  );
  return finalizeCoreForPersist({
    ...core,
    branchEmphasis,
    emphasisRevision: nextRevision,
    turn: Math.max(core.turn, turn),
    emphasisChangeLog,
  });
}

export function sanitizeResearchProgressPersisted(raw: unknown): ResearchProgressState | null {
  const core = migrateResearchProgressSave(raw);
  return hydrateResearchProgressCore(core);
}

export function assertResearchProgressSaveIntegrity(state: ResearchProgressState): string[] {
  const issues: string[] = [];
  if (
    state.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION &&
    state.schemaVersion !== LEGACY_V6 &&
    state.schemaVersion !== LEGACY_V7 &&
    state.schemaVersion !== LEGACY_V8 &&
    state.schemaVersion !== LEGACY_V9 &&
    state.schemaVersion !== LEGACY_V10 &&
    state.schemaVersion !== LEGACY_V11 &&
    state.schemaVersion !== LEGACY_V12 &&
    state.schemaVersion !== LEGACY_V13 &&
    state.schemaVersion !== LEGACY_V14 &&
    state.schemaVersion !== LEGACY_V5 &&
    state.schemaVersion !== LEGACY_V3 &&
    state.schemaVersion !== LEGACY_V4 &&
    state.schemaVersion !== LEGACY_V1 &&
    state.schemaVersion !== LEGACY_V2
  ) {
    issues.push(`unexpected schema ${state.schemaVersion}`);
  }
  if ((state.unlockSeq ?? 0) < state.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  for (const id of state.unlockedNodes.map(u => u.nodeId)) {
    if (!RESEARCH_NODE_BY_ID[id]) issues.push(`unknown node ${id}`);
  }
  const readinessKeys = Object.keys(state.readinessByBranch ?? {});
  if (readinessKeys.length && readinessKeys.length !== RESEARCH_BRANCHES.length) {
    issues.push('readinessByBranch incomplete');
  }
  for (const cell of state.diffusion ?? []) {
    if (!V94_REGION_CODES.includes(cell.regionId)) issues.push(`bad region ${cell.regionId}`);
  }
  return issues;
}

export function applyBranchEmphasisReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  emphasis: ResearchBranchEmphasisState[]
): Record<ResearchBranchId, number> {
  const out = { ...readinessByBranch };
  for (const e of emphasis) {
    out[e.branchId] = Math.min(100, (out[e.branchId] ?? 0) + (e.emphasis === 'sovereign' ? 2 : 1));
  }
  return out;
}

// --- bundled from src/save-lifecycle.ts ---
export type ResearchSaveKind = 'manual' | 'autosave' | 'checkpoint';

export interface ResearchPersistedCoreDiff {
  path: string;
  before: unknown;
  after: unknown;
}

export interface ResearchReconcileContext {
  turn: number;
  /** When loading autosave behind manual checkpoint, prefer higher persistRevision. */
  preferHigherPersistRevision?: boolean;
}

function mergeUnlockEventLogs(
  local: ResearchUnlockEvent[] | undefined,
  remote: ResearchUnlockEvent[] | undefined
): ResearchUnlockEvent[] {
  const byKey = new Map<string, ResearchUnlockEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.nodeId}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq || a.nodeId.localeCompare(b.nodeId)).slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);
}

function mergeEmphasisChangeLogs(
  local: ResearchEmphasisChangeEvent[] | undefined,
  remote: ResearchEmphasisChangeEvent[] | undefined
): ResearchEmphasisChangeEvent[] {
  const byKey = new Map<string, ResearchEmphasisChangeEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.branchId}:${ev.emphasisRevision}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}

function mergeReadinessMilestoneLogs(
  local: ResearchReadinessMilestoneEvent[] | undefined,
  remote: ResearchReadinessMilestoneEvent[] | undefined
): ResearchReadinessMilestoneEvent[] {
  const byKey = new Map<string, ResearchReadinessMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.branchId}:${ev.milestone}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
}

function mergeIntegrationRiskLogs(
  local: ResearchIntegrationRiskEvent[] | undefined,
  remote: ResearchIntegrationRiskEvent[] | undefined
): ResearchIntegrationRiskEvent[] {
  const byKey = new Map<string, ResearchIntegrationRiskEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}

function mergeSynergyThresholdLogs(
  local: ResearchSynergyThresholdEvent[] | undefined,
  remote: ResearchSynergyThresholdEvent[] | undefined
): ResearchSynergyThresholdEvent[] {
  const byKey = new Map<string, ResearchSynergyThresholdEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.threshold}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}

function mergeCommercializationMilestoneLogs(
  local: ResearchCommercializationMilestoneEvent[] | undefined,
  remote: ResearchCommercializationMilestoneEvent[] | undefined
): ResearchCommercializationMilestoneEvent[] {
  const byKey = new Map<string, ResearchCommercializationMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.milestone}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}

function mergeDiffusionIntegrationLogs(
  local: ResearchDiffusionIntegrationMilestoneEvent[] | undefined,
  remote: ResearchDiffusionIntegrationMilestoneEvent[] | undefined
): ResearchDiffusionIntegrationMilestoneEvent[] {
  const byKey = new Map<string, ResearchDiffusionIntegrationMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.milestone}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}

function mergePortfolioBalanceLogs(
  local: ResearchPortfolioBalanceBandEvent[] | undefined,
  remote: ResearchPortfolioBalanceBandEvent[] | undefined
): ResearchPortfolioBalanceBandEvent[] {
  const byKey = new Map<string, ResearchPortfolioBalanceBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}

function mergeDiffusionForecastBandLogs(
  local: ResearchDiffusionForecastBandEvent[] | undefined,
  remote: ResearchDiffusionForecastBandEvent[] | undefined
): ResearchDiffusionForecastBandEvent[] {
  const byKey = new Map<string, ResearchDiffusionForecastBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}

function mergeHorizonConvergenceBandLogs(
  local: ResearchHorizonConvergenceBandEvent[] | undefined,
  remote: ResearchHorizonConvergenceBandEvent[] | undefined
): ResearchHorizonConvergenceBandEvent[] {
  const byKey = new Map<string, ResearchHorizonConvergenceBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}

function mergeResearchExecutionBandLogs(
  local: ResearchExecutionBandEvent[] | undefined,
  remote: ResearchExecutionBandEvent[] | undefined
): ResearchExecutionBandEvent[] {
  const byKey = new Map<string, ResearchExecutionBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}

function stableCoreSnapshot(core: ResearchProgressPersistedCore): Record<string, unknown> {
  const { coreFingerprint, ...rest } = core;
  void coreFingerprint;
  return rest as Record<string, unknown>;
}

export function diffResearchPersistedCore(
  before: ResearchProgressPersistedCore,
  after: ResearchProgressPersistedCore
): ResearchPersistedCoreDiff[] {
  const diffs: ResearchPersistedCoreDiff[] = [];
  const keys = new Set([...Object.keys(stableCoreSnapshot(before)), ...Object.keys(stableCoreSnapshot(after))]);
  for (const key of [...keys].sort()) {
    const a = (stableCoreSnapshot(before) as Record<string, unknown>)[key];
    const b = (stableCoreSnapshot(after) as Record<string, unknown>)[key];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({ path: key, before: a, after: b });
    }
  }
  return diffs;
}

export function sealResearchProgressForSave(
  core: ResearchProgressPersistedCore,
  opts: { saveKind?: ResearchSaveKind; turn?: number; sessionId?: string } = {}
): ResearchProgressPersistedCore {
  const turn = opts.turn ?? core.turn;
  const saveKind = opts.saveKind ?? core.saveKind ?? 'manual';
  const sessionId =
    opts.sessionId ??
    core.sessionId ??
    `o10m_r03_${turn}_${core.revision}_${core.emphasisRevision}`;
  return finalizePersistedCoreDraft({
    ...core,
    saveKind,
    updatedAtTurn: turn,
    sessionId,
    persistRevision: (core.persistRevision ?? 0) + 1,
    turn: Math.max(core.turn, turn),
    institutionTierSnapshot: computeInstitutionTierSnapshot(core.institutionUpgrades, Math.max(core.turn, turn)),
    readinessBranchSnapshot: core.readinessBranchSnapshot,
  });
}

export function mergeResearchPersistedCores(
  local: ResearchProgressPersistedCore,
  remote: ResearchProgressPersistedCore
): ResearchProgressPersistedCore {
  const pick =
    (remote.persistRevision ?? 0) > (local.persistRevision ?? 0)
      ? remote
      : (local.persistRevision ?? 0) > (remote.persistRevision ?? 0)
        ? local
        : remote.updatedAtTurn >= local.updatedAtTurn
          ? remote
          : local;

  const unlockById = new Map<string, (typeof local.unlockedNodes)[number]>();
  for (const u of [...local.unlockedNodes, ...remote.unlockedNodes]) {
    const prev = unlockById.get(u.nodeId);
    if (!prev || u.unlockedTurn >= prev.unlockedTurn) unlockById.set(u.nodeId, u);
  }
  const unlockedNodes = [...unlockById.values()].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );

  const instById = new Map<string, (typeof local.institutionUpgrades)[number]>();
  for (const u of [...local.institutionUpgrades, ...remote.institutionUpgrades]) {
    instById.set(u.institutionId, u);
  }

  return finalizePersistedCoreDraft({
    ...pick,
    unlockedNodes,
    institutionUpgrades: [...instById.values()],
    unlockSeq: Math.max(local.unlockSeq, remote.unlockSeq, unlockedNodes.length),
    revision: Math.max(local.revision, remote.revision),
    emphasisRevision: Math.max(local.emphasisRevision, remote.emphasisRevision),
    migrationLog: [...(local.migrationLog ?? []), ...(remote.migrationLog ?? [])].slice(-32),
    unlockEventLog: mergeUnlockEventLogs(local.unlockEventLog, remote.unlockEventLog),
    emphasisChangeLog: mergeEmphasisChangeLogs(local.emphasisChangeLog, remote.emphasisChangeLog),
    institutionTierSnapshot: mergeInstitutionTierSnapshots(
      local.institutionTierSnapshot ?? undefined,
      remote.institutionTierSnapshot ?? undefined
    ) ?? computeInstitutionTierSnapshot([...instById.values()], pick.turn),
    readinessMilestoneLog: mergeReadinessMilestoneLogs(local.readinessMilestoneLog, remote.readinessMilestoneLog),
    readinessBranchSnapshot:
      mergeReadinessBranchSnapshots(
        local.readinessBranchSnapshot ?? undefined,
        remote.readinessBranchSnapshot ?? undefined
      ) ?? null,
    integrationRiskLog: mergeIntegrationRiskLogs(local.integrationRiskLog, remote.integrationRiskLog),
    integrationRiskSnapshot:
      mergeIntegrationRiskSnapshots(
        local.integrationRiskSnapshot ?? undefined,
        remote.integrationRiskSnapshot ?? undefined
      ) ?? null,
    scaleWaveSnapshot:
      mergeScaleWaveSnapshots(local.scaleWaveSnapshot ?? undefined, remote.scaleWaveSnapshot ?? undefined) ?? null,
    synergyThresholdLog: mergeSynergyThresholdLogs(local.synergyThresholdLog, remote.synergyThresholdLog),
    synergySnapshot:
      mergeSynergySnapshots(local.synergySnapshot ?? undefined, remote.synergySnapshot ?? undefined) ?? null,
    commercializationMilestoneLog: mergeCommercializationMilestoneLogs(
      local.commercializationMilestoneLog,
      remote.commercializationMilestoneLog
    ),
    commercializationSnapshot:
      mergeCommercializationSnapshots(
        local.commercializationSnapshot ?? undefined,
        remote.commercializationSnapshot ?? undefined
      ) ?? null,
    diffusionIntegrationLog: mergeDiffusionIntegrationLogs(
      local.diffusionIntegrationLog,
      remote.diffusionIntegrationLog
    ),
    diffusionIntegrationSnapshot:
      mergeDiffusionIntegrationSnapshots(
        local.diffusionIntegrationSnapshot ?? undefined,
        remote.diffusionIntegrationSnapshot ?? undefined
      ) ?? null,
    portfolioBalanceLog: mergePortfolioBalanceLogs(local.portfolioBalanceLog, remote.portfolioBalanceLog),
    portfolioBalanceSnapshot:
      mergePortfolioBalanceSnapshots(
        local.portfolioBalanceSnapshot ?? undefined,
        remote.portfolioBalanceSnapshot ?? undefined
      ) ?? null,
    diffusionForecastBandLog: mergeDiffusionForecastBandLogs(
      local.diffusionForecastBandLog,
      remote.diffusionForecastBandLog
    ),
    diffusionForecastSnapshot:
      mergeDiffusionForecastSnapshots(
        local.diffusionForecastSnapshot ?? undefined,
        remote.diffusionForecastSnapshot ?? undefined
      ) ?? null,
    horizonConvergenceBandLog: mergeHorizonConvergenceBandLogs(
      local.horizonConvergenceBandLog,
      remote.horizonConvergenceBandLog
    ),
    horizonConvergenceSnapshot:
      mergeHorizonConvergenceSnapshots(
        local.horizonConvergenceSnapshot ?? undefined,
        remote.horizonConvergenceSnapshot ?? undefined
      ) ?? null,
    researchExecutionBandLog: mergeResearchExecutionBandLogs(
      local.researchExecutionBandLog,
      remote.researchExecutionBandLog
    ),
    researchExecutionSnapshot:
      mergeResearchExecutionSnapshots(
        local.researchExecutionSnapshot ?? undefined,
        remote.researchExecutionSnapshot ?? undefined
      ) ?? null,
    lastReconciledAtTurn: Math.max(local.lastReconciledAtTurn ?? 0, remote.lastReconciledAtTurn ?? 0),
  });
}

export function reconcileResearchProgressOnLoad(
  ctx: ResearchReconcileContext,
  diskRaw: unknown,
  computed: ResearchProgressState
): { state: ResearchProgressState; persist: ResearchProgressPersistedCore } {
  const diskCore = migrateResearchProgressSave(diskRaw);
  const computedCore = extractPersistedCore(computed);
  if (!diskCore) {
    const persist = sealResearchProgressForSave(
      { ...prepareResearchProgressForSave(computed), lastReconciledAtTurn: ctx.turn },
      {
        turn: ctx.turn,
        saveKind: 'manual',
      }
    );
    return {
      state: {
        ...computed,
        migrationLog: persist.migrationLog,
        lastReconciledAtTurn: persist.lastReconciledAtTurn,
        unlockEventLog: persist.unlockEventLog,
        emphasisChangeLog: persist.emphasisChangeLog,
        institutionTierSnapshot: persist.institutionTierSnapshot,
        readinessMilestoneLog: persist.readinessMilestoneLog,
        readinessBranchSnapshot: persist.readinessBranchSnapshot,
        integrationRiskLog: persist.integrationRiskLog,
        integrationRiskSnapshot: persist.integrationRiskSnapshot,
        scaleWaveSnapshot: persist.scaleWaveSnapshot,
        synergyThresholdLog: persist.synergyThresholdLog,
        synergySnapshot: persist.synergySnapshot,
        commercializationMilestoneLog: persist.commercializationMilestoneLog,
        commercializationSnapshot: persist.commercializationSnapshot,
        diffusionIntegrationLog: persist.diffusionIntegrationLog,
        diffusionIntegrationSnapshot: persist.diffusionIntegrationSnapshot,
        portfolioBalanceLog: persist.portfolioBalanceLog,
        portfolioBalanceSnapshot: persist.portfolioBalanceSnapshot,
        diffusionForecastBandLog: persist.diffusionForecastBandLog,
        diffusionForecastSnapshot: persist.diffusionForecastSnapshot,
        horizonConvergenceBandLog: persist.horizonConvergenceBandLog,
        horizonConvergenceSnapshot: persist.horizonConvergenceSnapshot,
        researchExecutionBandLog: persist.researchExecutionBandLog,
        researchExecutionSnapshot: persist.researchExecutionSnapshot,
      },
      persist,
    };
  }

  const mergedCore = mergeResearchPersistedCores(diskCore, computedCore);
  const mergedState: ResearchProgressState = {
    ...computed,
    revision: mergedCore.revision,
    turn: Math.max(computed.turn, mergedCore.turn, ctx.turn),
    unlockedNodes: mergedCore.unlockedNodes,
    institutionUpgrades: mergedCore.institutionUpgrades,
    unlockSeq: mergedCore.unlockSeq,
    branchEmphasis: mergedCore.branchEmphasis,
    emphasisRevision: mergedCore.emphasisRevision,
    migrationLog: mergedCore.migrationLog,
    unlockEventLog: mergedCore.unlockEventLog,
    emphasisChangeLog: mergedCore.emphasisChangeLog,
    institutionTierSnapshot: mergedCore.institutionTierSnapshot,
    readinessMilestoneLog: mergedCore.readinessMilestoneLog,
    readinessBranchSnapshot: mergedCore.readinessBranchSnapshot,
    integrationRiskLog: mergedCore.integrationRiskLog,
    integrationRiskSnapshot: mergedCore.integrationRiskSnapshot,
    scaleWaveSnapshot: mergedCore.scaleWaveSnapshot,
    synergyThresholdLog: mergedCore.synergyThresholdLog,
    synergySnapshot: mergedCore.synergySnapshot,
    commercializationMilestoneLog: mergedCore.commercializationMilestoneLog,
    commercializationSnapshot: mergedCore.commercializationSnapshot,
    diffusionIntegrationLog: mergedCore.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: mergedCore.diffusionIntegrationSnapshot,
    portfolioBalanceLog: mergedCore.portfolioBalanceLog,
    portfolioBalanceSnapshot: mergedCore.portfolioBalanceSnapshot,
    diffusionForecastBandLog: mergedCore.diffusionForecastBandLog,
    diffusionForecastSnapshot: mergedCore.diffusionForecastSnapshot,
    horizonConvergenceBandLog: mergedCore.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: mergedCore.horizonConvergenceSnapshot,
    researchExecutionBandLog: mergedCore.researchExecutionBandLog,
    researchExecutionSnapshot: mergedCore.researchExecutionSnapshot,
    lastReconciledAtTurn: ctx.turn,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
  };

  const persist = sealResearchProgressForSave(
    { ...extractPersistedCore(mergedState), lastReconciledAtTurn: ctx.turn },
    {
      turn: ctx.turn,
      saveKind: mergedCore.saveKind,
      sessionId: mergedCore.sessionId,
    }
  );
  return {
    state: {
      ...mergedState,
      persistRevision: persist.persistRevision,
      lastReconciledAtTurn: persist.lastReconciledAtTurn,
      unlockEventLog: persist.unlockEventLog,
      emphasisChangeLog: persist.emphasisChangeLog,
      institutionTierSnapshot: persist.institutionTierSnapshot,
      readinessMilestoneLog: persist.readinessMilestoneLog,
      readinessBranchSnapshot: persist.readinessBranchSnapshot,
      integrationRiskLog: persist.integrationRiskLog,
      integrationRiskSnapshot: persist.integrationRiskSnapshot,
      scaleWaveSnapshot: persist.scaleWaveSnapshot,
      synergyThresholdLog: persist.synergyThresholdLog,
      synergySnapshot: persist.synergySnapshot,
      commercializationMilestoneLog: persist.commercializationMilestoneLog,
      commercializationSnapshot: persist.commercializationSnapshot,
      diffusionIntegrationLog: persist.diffusionIntegrationLog,
      diffusionIntegrationSnapshot: persist.diffusionIntegrationSnapshot,
      portfolioBalanceLog: persist.portfolioBalanceLog,
      portfolioBalanceSnapshot: persist.portfolioBalanceSnapshot,
      diffusionForecastBandLog: persist.diffusionForecastBandLog,
      diffusionForecastSnapshot: persist.diffusionForecastSnapshot,
      horizonConvergenceBandLog: persist.horizonConvergenceBandLog,
      horizonConvergenceSnapshot: persist.horizonConvergenceSnapshot,
      researchExecutionBandLog: persist.researchExecutionBandLog,
      researchExecutionSnapshot: persist.researchExecutionSnapshot,
    },
    persist,
  };
}

export function exportResearchProgressCheckpointJson(core: ResearchProgressPersistedCore): string {
  const sealed = sealResearchProgressForSave(core, { saveKind: 'checkpoint' });
  const { coreFingerprint, ...rest } = sealed;
  return JSON.stringify(
    {
      module: 'agent-03-research-tech',
      schemaVersion: sealed.schemaVersion,
      exportedTurn: sealed.updatedAtTurn,
      core: sealed,
      fingerprint: computePersistedCoreFingerprint(rest),
    },
    null,
    2
  );
}

export function importResearchProgressCheckpointJson(raw: string): ResearchProgressPersistedCore | null {
  try {
    const parsed = JSON.parse(raw) as { core?: unknown };
    return migrateResearchProgressSave(parsed.core ?? parsed);
  } catch {
    return null;
  }
}

// --- bundled from src/regression-harness.ts ---
export interface ResearchRegressionStep {
  turn: number;
  unlockedCount: number;
  synergyScore: number;
  persistRevision: number;
}

export interface ResearchRegressionResult {
  steps: ResearchRegressionStep[];
  monotonicUnlocks: boolean;
  monotonicPersistRevision: boolean;
}

/** Multi-turn deterministic harness for Agent 25 integration smoke. */
export function runResearchProgressRegressionHarness(
  baseInputs: ResearchProgressInputs,
  turns: number[]
): ResearchRegressionResult {
  let state: ResearchProgressState | null = null;
  const steps: ResearchRegressionStep[] = [];
  let prevUnlocks = 0;
  let prevPersist = 0;
  let monotonicUnlocks = true;
  let monotonicPersistRevision = true;

  for (const turn of turns) {
    const inputs = { ...baseInputs, turn };
    state = computeResearchProgress(inputs, state ?? createEmptyResearchProgressState(turn));
    const unlocks = state.unlockedNodes.length;
    if (unlocks < prevUnlocks) monotonicUnlocks = false;
    prevUnlocks = unlocks;
    const persistRev = state.persistRevision ?? 0;
    if (persistRev < prevPersist) monotonicPersistRevision = false;
    prevPersist = persistRev;
    steps.push({
      turn,
      unlockedCount: unlocks,
      synergyScore: state.scaleWave?.crossBranchSynergyScore ?? 0,
      persistRevision: persistRev,
    });
  }

  return { steps, monotonicUnlocks, monotonicPersistRevision };
}

// --- bundled from src/compute.ts ---
export function researchInputHash(inputs: ResearchProgressInputs): string {
  let h = 2166136261 >>> 0;
  const mix = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  };
  mix(`t${inputs.turn}`);
  inputs.regions.forEach(r => {
    mix(r.code);
    Object.keys(r.sectors)
      .sort()
      .forEach(k => mix(`${k}:${Math.round(Number(r.sectors[k as keyof typeof r.sectors] ?? 0) / 5)}`));
  });
  Object.keys(inputs.capabilities)
    .sort()
    .forEach(k => {
      const c = inputs.capabilities[k as keyof typeof inputs.capabilities];
      if (c) mix(`cap:${k}:${c.maturity}:${c.activeRegionIds.join(',')}`);
    });
  inputs.projects.forEach(p => mix(`${p.id}:${p.status}:${p.projectType}`));
  inputs.completedContracts.forEach(c => mix(`cc:${c.contractType}`));
  Object.keys(inputs.megaprojects)
    .sort()
    .forEach(k => {
      const m = inputs.megaprojects[k as keyof typeof inputs.megaprojects];
      if (m) mix(`mp:${k}:${m.completedStages}:${m.status}`);
    });
  Object.keys(inputs.factionStanding)
    .sort()
    .forEach(k => mix(`fs:${k}:${inputs.factionStanding[k as keyof typeof inputs.factionStanding]}`));
  return h.toString(36);
}

function computeBranchReadiness(
  inputs: ResearchProgressInputs,
  branchId: ResearchBranchId,
  institutionUpgrades: InstitutionUpgradeState[]
): number {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return 0;

  let score = 0;
  for (const anchor of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === anchor);
    if (!region) continue;
    for (const sec of branch.sectors) {
      score += Number(region.sectors[sec] ?? 0) * 0.15;
    }
  }

  const cap = inputs.capabilities[branch.primaryCapability];
  if (cap) {
    score += { unavailable: 0, emerging: 12, demonstrated: 22, operational: 32, scaled: 42, nationally_integrated: 52 }[
      cap.maturity
    ];
  }

  for (const inst of RESEARCH_INSTITUTIONS) {
    if (!inst.supportedBranches.includes(branchId)) continue;
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
    const upgrade = upgrades[inst.id];
    if (standing >= inst.minStanding) {
      score += inst.readinessBonus * (upgrade?.readinessMultiplier ?? 1);
    }
  }

  return Math.round(Math.min(100, score));
}

function inferAnchorRegion(inputs: ResearchProgressInputs, branchId: ResearchBranchId): string | null {
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return null;
  let best: { code: string; score: number } | null = null;
  for (const code of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === code);
    if (!region) continue;
    let s = 0;
    branch.sectors.forEach(sec => {
      s += Number(region.sectors[sec] ?? 0);
    });
    if (!best || s > best.score) best = { code, score: s };
  }
  return best?.code ?? branch.anchorRegions[0] ?? null;
}

export function createEmptyResearchProgressState(turn = 0): ResearchProgressState {
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent',
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    leadingResearchRegion: null,
    inputHash: '',
    institutionUpgrades: [],
    lateGameDiffusion: null,
    scaleWave: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
    saveKind: 'manual',
    updatedAtTurn: turn,
    sessionId: `o10m_r03_${turn}_0`,
    persistRevision: 0,
    unlockEventLog: [],
    lastReconciledAtTurn: turn,
    emphasisChangeLog: [],
    institutionTierSnapshot: null,
  };
}

export function computeResearchProgress(
  inputs: ResearchProgressInputs,
  previous: ResearchProgressState | null
): ResearchProgressState {
  const coreBase = previous ? extractPersistedCore(previous) : emptyResearchProgressCore(inputs.turn);
  const unlockedMap = new Map<string, UnlockedResearchNode>();
  (previous?.unlockedNodes ?? []).forEach(u => unlockedMap.set(u.nodeId, u));

  const unlockedIds = () => new Set(unlockedMap.keys());

  for (const branch of RESEARCH_BRANCHES) {
    const order = branchNodeTopologicalOrder(branch.id);
    for (const nodeId of order) {
      if (unlockedMap.has(nodeId)) continue;
      const evalResult = evaluateNodePrerequisites(inputs, nodeId, unlockedIds());
      if (!evalResult.satisfied) continue;
      const def = RESEARCH_NODE_BY_ID[nodeId];
      unlockedMap.set(nodeId, {
        nodeId,
        branchId: def.branchId,
        unlockedTurn: inputs.turn,
        anchorRegionId: inferAnchorRegion(inputs, def.branchId) as UnlockedResearchNode['anchorRegionId'],
      });
    }
  }

  const unlockedNodes = [...unlockedMap.values()].sort((a, b) =>
    a.unlockedTurn !== b.unlockedTurn ? a.unlockedTurn - b.unlockedTurn : a.nodeId.localeCompare(b.nodeId)
  );

  const institutionUpgrades = mergeMonotonicInstitutionUpgrades(
    computeInstitutionUpgrades(inputs, unlockedNodes),
    previous?.institutionUpgrades ?? []
  );

  const baseDiffusion = computeRegionalDiffusion(inputs, unlockedNodes, institutionUpgrades);
  const { cells: diffusionRaw, report: lateGameDiffusion } = applyLateGameDiffusionCascade(
    baseDiffusion,
    unlockedNodes,
    institutionUpgrades
  );

  const scaleWave = computeResearchScaleWaveReport(inputs, unlockedNodes);
  const swBonus = scaleWaveDiffusionBonus(scaleWave);
  const diffusion = diffusionRaw.map(cell => ({
    ...cell,
    score: Math.min(0.85, Math.round((cell.score + swBonus) * 1000) / 1000),
  }));

  const hooks = resolveActiveStrategyHooks(new Set(unlockedNodes.map(u => u.nodeId)));

  let readinessByBranch = Object.fromEntries(
    RESEARCH_BRANCHES.map(b => [b.id, computeBranchReadiness(inputs, b.id, institutionUpgrades)])
  ) as Record<ResearchBranchId, number>;
  readinessByBranch = applyScaleWaveReadinessBonus(readinessByBranch, scaleWave);
  readinessByBranch = applyBranchEmphasisReadinessBonus(readinessByBranch, coreBase.branchEmphasis);

  const commercialization = computeResearchCommercializationReport(inputs, {
    unlockedNodes,
    readinessByBranch,
    branchEmphasis: coreBase.branchEmphasis,
    scaleWave,
  });
  readinessByBranch = applyCommercializationReadinessNudge(readinessByBranch, commercialization);

  const portfolioBalance = computeResearchPortfolioBalanceReport({
    unlockedNodes,
    readinessByBranch,
    branchEmphasis: coreBase.branchEmphasis,
    scaleWave,
  });
  readinessByBranch = applyPortfolioBalanceReadinessNudge(readinessByBranch, portfolioBalance);

  const diffusionForecast = projectResearchDiffusionHorizon(inputs, {
    diffusion,
    unlockedNodes,
    institutionUpgrades,
  });

  const synergyOutlook = computeResearchSynergyOutlook(inputs, {
    unlockedNodes,
    readinessByBranch,
    scaleWave,
    portfolioBalance,
  });

  const integrationRiskOutlook = computeResearchIntegrationRiskOutlook(inputs, {
    readinessByBranch,
    institutionUpgrades,
    portfolioBalance,
    institutionTierSnapshot: coreBase.institutionTierSnapshot ?? null,
  });

  const adoptionHorizonOutlook = computeResearchAdoptionHorizonOutlook(inputs, {
    diffusionForecast,
    scaleWave,
    synergyOutlook,
    diffusion,
    integrationRiskOutlook,
  });

  const portfolioStabilizationOutlook = computeResearchPortfolioStabilizationOutlook(inputs, {
    portfolioBalance,
    synergyOutlook,
    integrationRiskOutlook,
    adoptionHorizonOutlook,
    synergySnapshot: coreBase.synergySnapshot ?? null,
  });

  const exportContinuityOutlook = computeResearchExportContinuityOutlook(inputs, {
    commercialization,
    portfolioStabilizationOutlook,
    adoptionHorizonOutlook,
    commercializationSnapshot: coreBase.commercializationSnapshot ?? null,
  });

  const nationalCoherenceOutlook = computeResearchNationalCoherenceOutlook(inputs, {
    diffusion,
    diffusionForecast,
    exportContinuityOutlook,
    integrationRiskOutlook,
    diffusionIntegrationSnapshot: coreBase.diffusionIntegrationSnapshot ?? null,
  });

  const strategicAlignmentOutlook = computeResearchStrategicAlignmentOutlook(inputs, {
    portfolioBalance,
    nationalCoherenceOutlook,
    synergyOutlook,
    portfolioBalanceSnapshot: coreBase.portfolioBalanceSnapshot ?? null,
    branchEmphasis: coreBase.branchEmphasis,
  });

  const horizonConvergenceOutlook = computeResearchHorizonConvergenceOutlook(inputs, {
    diffusionForecast,
    strategicAlignmentOutlook,
    nationalCoherenceOutlook,
    diffusionForecastSnapshot: coreBase.diffusionForecastSnapshot ?? null,
  });

  const researchExecutionOutlook = computeResearchExecutionOutlook(inputs, {
    horizonConvergenceOutlook,
    strategicAlignmentOutlook,
    integrationRiskOutlook,
    horizonConvergenceSnapshot: coreBase.horizonConvergenceSnapshot ?? null,
  });

  const strategicDeliveryOutlook = computeResearchStrategicDeliveryOutlook(inputs, {
    researchExecutionOutlook,
    exportContinuityOutlook,
    adoptionHorizonOutlook,
    researchExecutionSnapshot: coreBase.researchExecutionSnapshot ?? null,
  });

  const computed: ResearchProgressState = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: coreBase.revision,
    turn: inputs.turn,
    unlockedNodes,
    diffusion,
    readinessByBranch,
    activeHookIds: hooks.map(h => h.id),
    leadingResearchRegion: pickLeadingResearchRegion(diffusion),
    inputHash: researchInputHash(inputs),
    institutionUpgrades,
    lateGameDiffusion,
    scaleWave,
    commercialization,
    portfolioBalance,
    diffusionForecast,
    synergyOutlook,
    integrationRiskOutlook,
    adoptionHorizonOutlook,
    portfolioStabilizationOutlook,
    exportContinuityOutlook,
    nationalCoherenceOutlook,
    strategicAlignmentOutlook,
    horizonConvergenceOutlook,
    researchExecutionOutlook,
    strategicDeliveryOutlook,
    unlockSeq: coreBase.unlockSeq,
    branchEmphasis: coreBase.branchEmphasis,
  };

  return mergeComputedResearchState(coreBase, computed);
}

export function computeResearchProgressFromSave(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): ResearchProgressState {
  const hydrated = sanitizeResearchProgressPersisted(persistedRaw);
  return computeResearchProgress(inputs, hydrated);
}

export function applyResearchProgressSavePipeline(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): { state: ResearchProgressState; persist: ReturnType<typeof prepareResearchProgressForSave> } {
  const state = computeResearchProgressFromSave(inputs, persistedRaw);
  const persist = sealResearchProgressForSave(prepareResearchProgressForSave(state), {
    turn: inputs.turn,
    saveKind: state.saveKind,
    sessionId: state.sessionId,
  });
  return { state: { ...state, persistRevision: persist.persistRevision, saveKind: persist.saveKind }, persist };
}

function mergeMonotonicInstitutionUpgrades(
  next: InstitutionUpgradeState[],
  prev: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = institutionUpgradesById(prev);
  return next.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

/** Integration adapter: map V10.5 innovation snapshot fields into Agent 03 inputs (pure). */
export function buildResearchProgressInputs(src: {
  turn: number;
  regions: ResearchProgressInputs['regions'];
  innovationCapabilities?: ResearchProgressInputs['capabilities'];
  projects: ResearchProgressInputs['projects'];
  completedContracts: ResearchProgressInputs['completedContracts'];
  megaprojects: ResearchProgressInputs['megaprojects'];
  factionStanding: ResearchProgressInputs['factionStanding'];
}): ResearchProgressInputs {
  return {
    turn: src.turn,
    regions: src.regions,
    capabilities: src.innovationCapabilities ?? {},
    projects: src.projects,
    completedContracts: src.completedContracts,
    megaprojects: src.megaprojects,
    factionStanding: src.factionStanding,
  };
}

export function getStrategyHooksForState(state: ResearchProgressState) {
  return state.activeHookIds.map(id => STRATEGY_HOOK_BY_ID[id]).filter(Boolean);
}

export const AGENT03_CATALOG = {
  branches: RESEARCH_BRANCHES,
  nodes: RESEARCH_BRANCH_NODES,
  institutions: RESEARCH_INSTITUTIONS,
};


/** Agent 25 — smoke self-tests (subset of npm run test:agent-03). */
export function runAgent03ResearchTechSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });

  push('agent03_chunk_01', detectPrerequisiteCycle() === null, detectPrerequisiteCycle() ?? undefined);
  push('agent03_chunk_02', RESEARCH_BRANCH_NODES.length === 30, String(RESEARCH_BRANCH_NODES.length));
  push('agent03_chunk_03', STRATEGY_HOOKS.length === 30, String(STRATEGY_HOOKS.length));

  const inputs: ResearchProgressInputs = {
    turn: 10,
    regions: [{ code: 'ACT', sectors: { research: 40, technology: 35 } }],
    capabilities: {},
    projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    completedContracts: [],
    megaprojects: {},
    factionStanding: { csiro_ai_directorate: 45 },
  };
  const state = computeResearchProgress(inputs, createEmptyResearchProgressState());
  push('agent03_chunk_04', state.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'));
  push('agent03_chunk_05', (state.institutionUpgrades?.length ?? 0) >= 6, String(state.institutionUpgrades?.length));
  push('agent03_chunk_06', OP10M_AGENT03_MODULE_META.schemaVersion === 'op10m-agent03-v15');
  const saved = prepareResearchProgressForSave(state);
  push('agent03_chunk_07', validatePersistedCoreForWrite(saved).length === 0);

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export function runAgent03ResearchSaveFormatSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  const push = (id: string, passed: boolean, detail?: string) => results.push({ id, passed, detail });
  const v2 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v2', turn: 1, revision: 0, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [] });
  push('savefmt_v2_to_v13', v2?.schemaVersion === 'op10m-agent03-v15');
  const v3 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v3', turn: 2, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], coreFingerprint: 'x' });
  push('savefmt_v3_to_v13', v3?.schemaVersion === 'op10m-agent03-v15' && (v3?.persistRevision ?? 0) === 0);
  const v4 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v4', turn: 3, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 2, saveKind: 'manual', updatedAtTurn: 3, sessionId: 'x' });
  push('savefmt_v4_to_v13', v4?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v4?.unlockEventLog));
  const v5 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v5', turn: 4, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 1, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 4, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 4 });
  push('savefmt_v5_to_v13', v5?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v5?.emphasisChangeLog));
  const v6 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v6', turn: 5, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 5, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 5, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 5, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 } });
  push('savefmt_v6_to_v13', v6?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v6?.readinessMilestoneLog));
  const v7 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v7', turn: 6, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 6, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 6, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 6, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null });
  push('savefmt_v7_to_v13', v7?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v7?.integrationRiskLog));
  const v8 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v8', turn: 7, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 7, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 7, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 7, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null });
  push('savefmt_v8_to_v13', v8?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v8?.synergyThresholdLog));
  const v9 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v9', turn: 8, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 8, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 8, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 8, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null });
  push('savefmt_v9_to_v13', v9?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v9?.commercializationMilestoneLog));
  const v10 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v10', turn: 9, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 9, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 9, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 9, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null });
  push('savefmt_v10_to_v13', v10?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v10?.diffusionIntegrationLog));
  const v11 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v11', turn: 10, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 10, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 10, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 10, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null });
  push('savefmt_v11_to_v13', v11?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v11?.portfolioBalanceLog));
  const v12 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v12', turn: 11, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 11, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 11, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 11, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null, portfolioBalanceLog: [], portfolioBalanceSnapshot: null });
  push('savefmt_v12_to_v15', v12?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v12?.diffusionForecastBandLog));
  const v13 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v13', turn: 12, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 12, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 12, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 12, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null, portfolioBalanceLog: [], portfolioBalanceSnapshot: null, diffusionForecastBandLog: [], diffusionForecastSnapshot: null });
  push('savefmt_v13_to_v15', v13?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v13?.horizonConvergenceBandLog));
  const v14 = migrateResearchProgressSave({ schemaVersion: 'op10m-agent03-v14', turn: 13, revision: 1, unlockedNodes: [], institutionUpgrades: [], unlockSeq: 0, branchEmphasis: [], emphasisRevision: 0, migrationLog: [], persistRevision: 1, saveKind: 'manual', updatedAtTurn: 13, sessionId: 'x', unlockEventLog: [], lastReconciledAtTurn: 13, emphasisChangeLog: [], institutionTierSnapshot: { capturedAtTurn: 13, tiers: {}, digest: 'd', nationalIntegrationCount: 0, strategicOrAboveCount: 0 }, readinessMilestoneLog: [], readinessBranchSnapshot: null, integrationRiskLog: [], integrationRiskSnapshot: null, scaleWaveSnapshot: null, synergyThresholdLog: [], synergySnapshot: null, commercializationMilestoneLog: [], commercializationSnapshot: null, diffusionIntegrationLog: [], diffusionIntegrationSnapshot: null, portfolioBalanceLog: [], portfolioBalanceSnapshot: null, diffusionForecastBandLog: [], diffusionForecastSnapshot: null, horizonConvergenceBandLog: [], horizonConvergenceSnapshot: null });
  push('savefmt_v14_to_v15', v14?.schemaVersion === 'op10m-agent03-v15' && Array.isArray(v14?.researchExecutionBandLog));
  push('savefmt_foreign', detectForeignSaveFields({ diffusion: [] }).includes('diffusion'));
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}

export const OP10M_AGENT03_MODULE_META = {
  moduleId: 'agent-03-research-tech',
  schemaVersion: 'op10m-agent03-v15',
  saveFormatVersion: 15,
  touchesSaveFormat: true,
  proposedGameStateField: 'researchProgress',
  integrationDoc: 'operation-10m/agent-03-research-tech/INTEGRATION.md',
  slot: 'post-v10z',
} as const;
// OP10M_MODULE_END agent-03-research-tech
