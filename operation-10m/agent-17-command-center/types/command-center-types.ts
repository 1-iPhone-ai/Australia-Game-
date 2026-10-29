/** Agent 17 — Game Intelligence / AI Command Center modular types (Operation 10M). */

export type CommandCenterTab =
  | 'overview'
  | 'next_move'
  | 'priorities'
  | 'risks'
  | 'opportunities'
  | 'team'
  | 'opponents'
  | 'ai_activity'
  | 'explain'
  | 'history'
  | 'settings';

export type CommandCenterViewMode = 'simple' | 'detailed' | 'developer';

export type Acc17PlanStepStatus =
  | 'pending'
  | 'in_progress'
  | 'verified_complete'
  | 'failed'
  | 'skipped'
  | 'blocked';

export type Acc17ProjectDelegationStatus =
  | 'draft'
  | 'delegated'
  | 'executing'
  | 'awaiting_verification'
  | 'completed'
  | 'cancelled'
  | 'blocked';

export type Acc17DelegateTargetKind =
  | 'copilot'
  | 'team_os'
  | 'teammate'
  | 'strategy_planner'
  | 'manual';

export interface Acc17PlanStepRequirement {
  minCash?: number;
  minNetWorth?: number;
  requiredRegion?: string;
  requiredActionType?: string;
  prerequisiteStepIds?: string[];
  minRegionalStanding?: number;
}

export interface Acc17MultiStepPlanStep {
  id: string;
  index: number;
  title: string;
  summary: string;
  actionType: string;
  requirements: Acc17PlanStepRequirement;
  status: Acc17PlanStepStatus;
  verifiedOnTurn?: number;
  verifiedOnDay?: number;
  verifiedStateFingerprint?: string;
  lastEvaluationFingerprint?: string;
  blockerReason?: string;
}

export interface Acc17MultiStepPlan {
  id: string;
  title: string;
  objectiveSource?: string;
  createdTurn: number;
  createdDay: number;
  steps: Acc17MultiStepPlanStep[];
  activeStepIndex: number;
  completionPercent: number;
  isOnTrack: boolean;
  replanCount: number;
}

export interface Acc17DelegatedProject {
  id: string;
  planId: string;
  title: string;
  delegateKind: Acc17DelegateTargetKind;
  delegateTargetId: string;
  status: Acc17ProjectDelegationStatus;
  authorityCeiling: 'advisory' | 'assisted' | 'delegated';
  assignedTurn: number;
  assignedDay: number;
  lastVerifiedFingerprint: string;
  pendingVerificationStepId?: string;
  notes: string;
}

export interface Acc17VerifiedExecutionLogEntry {
  id: string;
  turn: number;
  day: number;
  stepId: string;
  projectId: string;
  fingerprintBefore: string;
  fingerprintAfter: string;
  verified: boolean;
  reason: string;
}

export interface Acc17V94DeepContextSlice {
  key: string;
  label: string;
  summary: string;
  weight: number;
  tags: string[];
}

export interface Acc17V94DeepContextBundle {
  actorId: string;
  turn: number;
  day: number;
  fingerprint: string;
  headline: string;
  slices: Acc17V94DeepContextSlice[];
  objectiveTitle?: string;
  attentionLabel?: string;
  strategyHeadline?: string;
}

export interface Acc17CommandCenterOpsState {
  version: 1;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  verificationLog: Acc17VerifiedExecutionLogEntry[];
  lastContextFingerprint: string;
  lastContextBundle?: Acc17V94DeepContextBundle;
  enabled: boolean;
}

export interface Acc17OperationsSnapshot {
  deepContext: Acc17V94DeepContextBundle;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  pendingVerificationCount: number;
  verifiedStepsThisTurn: number;
  blockedSteps: Acc17MultiStepPlanStep[];
  recommendedDelegateKind: Acc17DelegateTargetKind;
  planningDepth?: Agent17PlanningDepthSnapshot;
}

export interface Agent17PlanHealthBand {
  band: 'critical' | 'at_risk' | 'steady' | 'strong';
  score: number;
  blockedCount: number;
  verifiedRatio: number;
  replanCount: number;
  onTrack: boolean;
}

export interface Agent17PlanningSuggestion {
  kind: 'template' | 'recovery' | 'delegate' | 'hold';
  templateId?: string;
  delegateKind?: Acc17DelegateTargetKind;
  headline: string;
  rationale: string;
  confidence: number;
}

export interface Agent17DelegationAnalyticsRow {
  delegateKind: Acc17DelegateTargetKind;
  activeProjects: number;
  completedProjects: number;
  blockedProjects: number;
  authorityMix: Record<string, number>;
  recommendedAdjustment?: string;
}

export interface Agent17PlanningDepthSnapshot {
  turn: number;
  actorId: string;
  planHealth: Agent17PlanHealthBand;
  suggestion: Agent17PlanningSuggestion;
  templateRouting: { matchedCategory: string; candidateTemplateIds: string[] };
  delegationAnalytics: Agent17DelegationAnalyticsRow[];
  delegationLadder: Agent17DelegationLadderSnapshot;
  planLedger: Agent17PlanLedgerSummary;
  intentQueue: Agent17IntentQueueSnapshot;
  verificationPolicy: Agent17VerificationPolicySnapshot;
  coordinationBrief: Agent17CoordinationBrief;
  executionPacing: Agent17ExecutionPacingSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  commandPosture: Agent17CommandPostureSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
  escalationMatrix: Agent17EscalationMatrixSnapshot;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
  missionDirective: Agent17MissionDirectiveSnapshot;
  directiveSynthesis: Agent17DirectiveSynthesisSnapshot;
  executionClosure: Agent17ExecutionClosureSnapshot;
  cadenceLattice: Agent17CadenceLatticeSnapshot;
  readinessGate: Agent17ReadinessGateSnapshot;
  pulseIndex: Agent17PulseIndexSnapshot;
  continuityBridge: Agent17ContinuityBridgeSnapshot;
  fluxIndex: Agent17FluxIndexSnapshot;
  integritySeal: Agent17IntegritySealSnapshot;
  commitLattice: Agent17CommitLatticeSnapshot;
  covenantGate: Agent17CovenantGateSnapshot;
  mandateWeave: Agent17MandateWeaveSnapshot;
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
  authorityCharter: Agent17AuthorityCharterSnapshot;
  dispatchAccord: Agent17DispatchAccordSnapshot;
  mobilizationIndex: Agent17MobilizationIndexSnapshot;
  executionSummons: Agent17ExecutionSummonsSnapshot;
  fieldIndex: Agent17FieldIndexSnapshot;
  theaterCommitment: Agent17TheaterCommitmentSnapshot;
  campaignIndex: Agent17CampaignIndexSnapshot;
  missionLattice: Agent17MissionLatticeSnapshot;
  strategicIndex: Agent17StrategicIndexSnapshot;
  doctrineAccord: Agent17DoctrineAccordSnapshot;
  commandIndex: Agent17CommandIndexSnapshot;
  federationAccord: Agent17FederationAccordSnapshot;
  allianceIndex: Agent17AllianceIndexSnapshot;
  coalitionAccord: Agent17CoalitionAccordSnapshot;
  pactIndex: Agent17PactIndexSnapshot;
  unityAccord: Agent17UnityAccordSnapshot;
  compactIndex: Agent17CompactIndexSnapshot;
  sovereignAccord: Agent17SovereignAccordSnapshot;
  catalogDepth: { templateCount: number; deepTemplateCount: number; maxStepCount: number };
}

export interface Agent17IntentItem {
  id: string;
  priority: number;
  label: string;
  source: 'objective' | 'gi3' | 'recovery' | 'plan_health' | 'delegation';
  actionHint?: string;
}

export interface Agent17IntentQueueSnapshot {
  items: Agent17IntentItem[];
  primaryIntentId: string | null;
  queueDepth: number;
}

export interface Agent17VerificationPolicyRule {
  id: string;
  description: string;
  satisfied: boolean;
}

export interface Agent17VerificationPolicySnapshot {
  rules: Agent17VerificationPolicyRule[];
  allowVerification: boolean;
  blockingRuleIds: string[];
}

export interface Agent17CoordinationBriefSection {
  id: string;
  heading: string;
  bullets: string[];
}

export interface Agent17CoordinationBrief {
  headline: string;
  sections: Agent17CoordinationBriefSection[];
  giHandoffTags: string[];
  confidence: number;
}

export interface Agent17ExecutionPacingSnapshot {
  turn: number;
  turnBudgetRemaining: number;
  stepsRemaining: number;
  canAdvanceActiveStep: boolean;
  verificationGateOpen: boolean;
  cooldownTurns: number;
  pacingBand: 'urgent' | 'steady' | 'throttled';
  headline: string;
}

export interface Agent17ResilienceScorecard {
  recoveryPressure: number;
  verificationStability: number;
  compositeIndex: number;
  band: 'robust' | 'watch' | 'fragile';
  signalCount: number;
  mitigationHints: string[];
  headline: string;
}

export interface Agent17StrategicAlignmentSnapshot {
  alignmentIndex: number;
  band: 'aligned' | 'drifting' | 'divergent';
  gi3Overlap: number;
  plannerOverlap: number;
  planOverlap: number;
  driftFlags: string[];
  primaryIntentId: string | null;
  headline: string;
}

export interface Agent17HandoffReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
}

export interface Agent17HandoffReadinessSnapshot {
  readinessScore: number;
  band: 'ready' | 'partial' | 'blocked';
  readyForTeamOs: boolean;
  checks: Agent17HandoffReadinessCheck[];
  blockers: string[];
  headline: string;
}

export interface Agent17CommandPostureSnapshot {
  postureIndex: number;
  band: 'commanding' | 'contested' | 'degraded';
  handoffContribution: number;
  resilienceContribution: number;
  planHealthContribution: number;
  alignmentContribution: number;
  headline: string;
}

export interface Agent17GovernanceAuditFinding {
  id: string;
  category: 'verification' | 'delegation' | 'rollback' | 'policy';
  severity: 'info' | 'warn' | 'critical';
  passed: boolean;
  detail: string;
}

export interface Agent17GovernanceAuditSnapshot {
  auditScore: number;
  band: 'compliant' | 'review' | 'breach';
  findings: Agent17GovernanceAuditFinding[];
  openCriticalCount: number;
  headline: string;
}

export interface Agent17EscalationMatrixRung {
  id: string;
  label: string;
  triggered: boolean;
  severity: 'low' | 'medium' | 'high';
  detail: string;
}

export interface Agent17EscalationMatrixSnapshot {
  escalationIndex: number;
  band: 'none' | 'watch' | 'urgent';
  rungs: Agent17EscalationMatrixRung[];
  triggeredCount: number;
  headline: string;
}

export interface Agent17RollbackAssuranceCheck {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
}

export interface Agent17RollbackAssuranceSnapshot {
  assuranceScore: number;
  band: 'protected' | 'at_risk' | 'exposed';
  checks: Agent17RollbackAssuranceCheck[];
  restoreRecommended: boolean;
  headline: string;
}

export interface Agent17StabilizationFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17StabilizationIndexSnapshot {
  stabilizationIndex: number;
  band: 'stable' | 'adjusting' | 'volatile';
  factors: Agent17StabilizationFactor[];
  escalationBand: Agent17EscalationMatrixSnapshot['band'];
  assuranceBand: Agent17RollbackAssuranceSnapshot['band'];
  headline: string;
}

export interface Agent17CommandEnvelopeSignal {
  id: string;
  label: string;
  value: number;
  unit: 'percent' | 'steps' | 'turns' | 'index';
}

export interface Agent17CommandEnvelopeSnapshot {
  capacityBand: 'nominal' | 'constrained' | 'saturated';
  horizonTurns: number;
  activeDelegationCount: number;
  delegationCap: number;
  automationAllowed: boolean;
  signals: Agent17CommandEnvelopeSignal[];
  headline: string;
}

export interface Agent17ConvergenceFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17ConvergenceIndexSnapshot {
  convergenceIndex: number;
  band: 'aligned' | 'adjusting' | 'diverging';
  factors: Agent17ConvergenceFactor[];
  envelopeBand: Agent17CommandEnvelopeSnapshot['capacityBand'];
  stabilizationBand: Agent17StabilizationIndexSnapshot['band'];
  headline: string;
}

export interface Agent17MissionDirectiveLane {
  id: string;
  label: string;
  priority: number;
  clearance: 'open' | 'conditional' | 'closed';
  weight: number;
}

export interface Agent17MissionDirectiveSnapshot {
  clearanceScore: number;
  band: 'cleared' | 'conditional' | 'held';
  lanes: Agent17MissionDirectiveLane[];
  primaryLaneId: string | null;
  executionAllowed: boolean;
  headline: string;
}

export interface Agent17DirectiveSynthesisFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17DirectiveSynthesisSnapshot {
  synthesisIndex: number;
  band: 'ready' | 'pending' | 'locked';
  factors: Agent17DirectiveSynthesisFactor[];
  directiveBand: Agent17MissionDirectiveSnapshot['band'];
  convergenceBand: Agent17ConvergenceIndexSnapshot['band'];
  headline: string;
}

export interface Agent17ExecutionClosureCheckpoint {
  id: string;
  label: string;
  satisfied: boolean;
  weight: number;
}

export interface Agent17ExecutionClosureSnapshot {
  closureScore: number;
  band: 'open' | 'narrow' | 'sealed';
  checkpoints: Agent17ExecutionClosureCheckpoint[];
  stepsReadyToClose: number;
  automationClearance: boolean;
  headline: string;
}

export interface Agent17CadenceLatticeFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17CadenceLatticeSnapshot {
  cadenceIndex: number;
  band: 'flowing' | 'steady' | 'stalled';
  factors: Agent17CadenceLatticeFactor[];
  closureBand: Agent17ExecutionClosureSnapshot['band'];
  synthesisBand: Agent17DirectiveSynthesisSnapshot['band'];
  headline: string;
}

export interface Agent17ReadinessGateSignal {
  id: string;
  label: string;
  value: number;
  unit: 'index' | 'percent' | 'turns';
}

export interface Agent17ReadinessGateSnapshot {
  readinessScore: number;
  band: 'go' | 'caution' | 'stop';
  signals: Agent17ReadinessGateSignal[];
  handoffReady: boolean;
  runAllowed: boolean;
  headline: string;
}

export interface Agent17PulseIndexFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17PulseIndexSnapshot {
  pulseIndex: number;
  band: 'strong' | 'moderate' | 'flat';
  factors: Agent17PulseIndexFactor[];
  readinessBand: Agent17ReadinessGateSnapshot['band'];
  cadenceBand: Agent17CadenceLatticeSnapshot['band'];
  headline: string;
}

export interface Agent17ContinuityBridgeLink {
  id: string;
  label: string;
  connected: boolean;
  weight: number;
}

export interface Agent17ContinuityBridgeSnapshot {
  bridgeScore: number;
  band: 'linked' | 'partial' | 'broken';
  links: Agent17ContinuityBridgeLink[];
  pulseBand: Agent17PulseIndexSnapshot['band'];
  continuityClearance: boolean;
  headline: string;
}

export interface Agent17FluxIndexFactor {
  id: string;
  label: string;
  score: number;
  weight: number;
}

export interface Agent17FluxIndexSnapshot {
  fluxIndex: number;
  band: 'coherent' | 'noisy' | 'disrupted';
  factors: Agent17FluxIndexFactor[];
  bridgeBand: Agent17ContinuityBridgeSnapshot['band'];
  governanceBand: Agent17GovernanceAuditSnapshot['band'];
  headline: string;
}

export interface Agent17IntegritySealFacet {
  id: string;
  label: string;
  intact: boolean;
  weight: number;
}

export interface Agent17IntegritySealSnapshot {
  sealScore: number;
  band: 'trusted' | 'conditional' | 'breached';
  facets: Agent17IntegritySealFacet[];
  fluxBand: Agent17FluxIndexSnapshot['band'];
  commitAllowed: boolean;
  headline: string;
}

export interface Agent17CommitLatticeStrand {
  id: string;
  label: string;
  tension: number;
  weight: number;
}

export interface Agent17CommitLatticeSnapshot {
  latticeScore: number;
  band: 'bound' | 'flex' | 'fragmented';
  strands: Agent17CommitLatticeStrand[];
  sealBand: Agent17IntegritySealSnapshot['band'];
  escalationBand: Agent17EscalationMatrixSnapshot['band'];
  headline: string;
}

export interface Agent17CovenantGateClause {
  id: string;
  label: string;
  upheld: boolean;
  weight: number;
}

export interface Agent17CovenantGateSnapshot {
  covenantScore: number;
  band: 'upheld' | 'conditional' | 'void';
  clauses: Agent17CovenantGateClause[];
  latticeBand: Agent17CommitLatticeSnapshot['band'];
  opsAllowed: boolean;
  headline: string;
}

export interface Agent17MandateWeaveThread {
  id: string;
  label: string;
  strength: number;
  weight: number;
}

export interface Agent17MandateWeaveSnapshot {
  weaveScore: number;
  band: 'aligned' | 'tensioned' | 'frayed';
  threads: Agent17MandateWeaveThread[];
  covenantBand: Agent17CovenantGateSnapshot['band'];
  alignmentBand: Agent17StrategicAlignmentSnapshot['band'];
  headline: string;
}

export interface Agent17SovereigntyLockPin {
  id: string;
  label: string;
  engaged: boolean;
  weight: number;
}

export interface Agent17SovereigntyLockSnapshot {
  lockScore: number;
  band: 'secured' | 'conditional' | 'released';
  pins: Agent17SovereigntyLockPin[];
  weaveBand: Agent17MandateWeaveSnapshot['band'];
  commandSovereignty: boolean;
  headline: string;
}

export interface Agent17AuthorityCharterArticle {
  id: string;
  label: string;
  ratified: boolean;
  weight: number;
}

export interface Agent17AuthorityCharterSnapshot {
  charterScore: number;
  band: 'chartered' | 'provisional' | 'revoked';
  articles: Agent17AuthorityCharterArticle[];
  lockBand: Agent17SovereigntyLockSnapshot['band'];
  weaveBand: Agent17MandateWeaveSnapshot['band'];
  commandAuthority: boolean;
  headline: string;
}

export interface Agent17DispatchAccordProvision {
  id: string;
  label: string;
  active: boolean;
  weight: number;
}

export interface Agent17DispatchAccordSnapshot {
  accordScore: number;
  band: 'ratified' | 'provisional' | 'void';
  provisions: Agent17DispatchAccordProvision[];
  charterBand: Agent17AuthorityCharterSnapshot['band'];
  dispatchAllowed: boolean;
  headline: string;
}

export interface Agent17MobilizationVector {
  id: string;
  label: string;
  engaged: boolean;
  weight: number;
}

export interface Agent17MobilizationIndexSnapshot {
  mobilizationScore: number;
  band: 'mobilized' | 'forming' | 'stalled';
  vectors: Agent17MobilizationVector[];
  accordBand: Agent17DispatchAccordSnapshot['band'];
  pacingBand: Agent17ExecutionPacingSnapshot['pacingBand'];
  fieldReady: boolean;
  headline: string;
}

export interface Agent17ExecutionSummonsClause {
  id: string;
  label: string;
  satisfied: boolean;
  weight: number;
}

export interface Agent17ExecutionSummonsSnapshot {
  summonsScore: number;
  band: 'issued' | 'pending' | 'revoked';
  clauses: Agent17ExecutionSummonsClause[];
  mobilizationBand: Agent17MobilizationIndexSnapshot['band'];
  directiveBand: Agent17MissionDirectiveSnapshot['band'];
  executionAuthorized: boolean;
  headline: string;
}

export interface Agent17FieldVector {
  id: string;
  label: string;
  engaged: boolean;
  weight: number;
}

export interface Agent17FieldIndexSnapshot {
  fieldScore: number;
  band: 'engaged' | 'staging' | 'contested';
  vectors: Agent17FieldVector[];
  summonsBand: Agent17ExecutionSummonsSnapshot['band'];
  closureBand: Agent17ExecutionClosureSnapshot['band'];
  theaterReady: boolean;
  headline: string;
}

export interface Agent17TheaterCommitmentPledge {
  id: string;
  label: string;
  pledged: boolean;
  weight: number;
}

export interface Agent17TheaterCommitmentSnapshot {
  commitmentScore: number;
  band: 'bound' | 'provisional' | 'withdrawn';
  pledges: Agent17TheaterCommitmentPledge[];
  fieldBand: Agent17FieldIndexSnapshot['band'];
  theaterBound: boolean;
  headline: string;
}

export interface Agent17CampaignVector {
  id: string;
  label: string;
  engaged: boolean;
  weight: number;
}

export interface Agent17CampaignIndexSnapshot {
  campaignScore: number;
  band: 'active' | 'forming' | 'stalled';
  vectors: Agent17CampaignVector[];
  theaterBand: Agent17TheaterCommitmentSnapshot['band'];
  pulseBand: Agent17PulseIndexSnapshot['band'];
  campaignReady: boolean;
  headline: string;
}

export interface Agent17MissionLatticeRung {
  id: string;
  label: string;
  seated: boolean;
  weight: number;
}

export interface Agent17MissionLatticeSnapshot {
  latticeScore: number;
  band: 'locked' | 'flexible' | 'collapsed';
  rungs: Agent17MissionLatticeRung[];
  campaignBand: Agent17CampaignIndexSnapshot['band'];
  cadenceBand: Agent17CadenceLatticeSnapshot['band'];
  missionLocked: boolean;
  headline: string;
}

export interface Agent17StrategicIndexSignal {
  id: string;
  label: string;
  engaged: boolean;
  weight: number;
}

export interface Agent17StrategicIndexSnapshot {
  strategicScore: number;
  band: 'coherent' | 'forming' | 'fractured';
  signals: Agent17StrategicIndexSignal[];
  latticeBand: Agent17MissionLatticeSnapshot['band'];
  convergenceBand: Agent17ConvergenceIndexSnapshot['band'];
  strategicReady: boolean;
  headline: string;
}

export interface Agent17DoctrineAccordArticle {
  id: string;
  label: string;
  ratified: boolean;
  weight: number;
}

export interface Agent17DoctrineAccordSnapshot {
  doctrineScore: number;
  band: 'ratified' | 'provisional' | 'void';
  articles: Agent17DoctrineAccordArticle[];
  strategicBand: Agent17StrategicIndexSnapshot['band'];
  covenantBand: Agent17CovenantGateSnapshot['band'];
  doctrineRatified: boolean;
  headline: string;
}

export interface Agent17CommandIndexPillar {
  id: string;
  label: string;
  standing: boolean;
  weight: number;
}

export interface Agent17CommandIndexSnapshot {
  commandScore: number;
  band: 'supreme' | 'delegated' | 'degraded';
  pillars: Agent17CommandIndexPillar[];
  doctrineBand: Agent17DoctrineAccordSnapshot['band'];
  lockBand: Agent17SovereigntyLockSnapshot['band'];
  commandReady: boolean;
  headline: string;
}

export interface Agent17FederationCovenant {
  id: string;
  label: string;
  bound: boolean;
  weight: number;
}

export interface Agent17FederationAccordSnapshot {
  federationScore: number;
  band: 'unified' | 'partial' | 'dissolved';
  covenants: Agent17FederationCovenant[];
  commandBand: Agent17CommandIndexSnapshot['band'];
  latticeBand: Agent17CommitLatticeSnapshot['band'];
  federationUnified: boolean;
  headline: string;
}

export interface Agent17AllianceTie {
  id: string;
  label: string;
  secured: boolean;
  weight: number;
}

export interface Agent17AllianceIndexSnapshot {
  allianceScore: number;
  band: 'allied' | 'forming' | 'ruptured';
  ties: Agent17AllianceTie[];
  federationBand: Agent17FederationAccordSnapshot['band'];
  dispatchBand: Agent17DispatchAccordSnapshot['band'];
  allianceReady: boolean;
  headline: string;
}

export interface Agent17CoalitionCompact {
  id: string;
  label: string;
  sealed: boolean;
  weight: number;
}

export interface Agent17CoalitionAccordSnapshot {
  coalitionScore: number;
  band: 'sealed' | 'draft' | 'broken';
  compacts: Agent17CoalitionCompact[];
  allianceBand: Agent17AllianceIndexSnapshot['band'];
  mobilizationBand: Agent17MobilizationIndexSnapshot['band'];
  coalitionSealed: boolean;
  headline: string;
}

export interface Agent17PactClause {
  id: string;
  label: string;
  binding: boolean;
  weight: number;
}

export interface Agent17PactIndexSnapshot {
  pactScore: number;
  band: 'binding' | 'provisional' | 'void';
  clauses: Agent17PactClause[];
  coalitionBand: Agent17CoalitionAccordSnapshot['band'];
  theaterBand: Agent17TheaterCommitmentSnapshot['band'];
  pactBinding: boolean;
  headline: string;
}

export interface Agent17UnityTenet {
  id: string;
  label: string;
  affirmed: boolean;
  weight: number;
}

export interface Agent17UnityAccordSnapshot {
  unityScore: number;
  band: 'unified' | 'partial' | 'shattered';
  tenets: Agent17UnityTenet[];
  pactBand: Agent17PactIndexSnapshot['band'];
  strategicBand: Agent17StrategicIndexSnapshot['band'];
  unityAchieved: boolean;
  headline: string;
}

export interface Agent17CompactFacet {
  id: string;
  label: string;
  locked: boolean;
  weight: number;
}

export interface Agent17CompactIndexSnapshot {
  compactScore: number;
  band: 'tight' | 'forming' | 'loose';
  facets: Agent17CompactFacet[];
  unityBand: Agent17UnityAccordSnapshot['band'];
  federationBand: Agent17FederationAccordSnapshot['band'];
  compactLocked: boolean;
  headline: string;
}

export interface Agent17SovereignSeal {
  id: string;
  label: string;
  affixed: boolean;
  weight: number;
}

export interface Agent17SovereignAccordSnapshot {
  sovereignScore: number;
  band: 'crowned' | 'regent' | 'abdicated';
  seals: Agent17SovereignSeal[];
  compactBand: Agent17CompactIndexSnapshot['band'];
  commandBand: Agent17CommandIndexSnapshot['band'];
  sovereigntyCrowned: boolean;
  headline: string;
}

export interface Agent17DelegationLadderRung {
  delegateKind: Acc17DelegateTargetKind;
  loadScore: number;
  maxConcurrent: number;
  slotsRemaining: number;
  preferredAuthority: Acc17DelegatedProject['authorityCeiling'];
  escalationTarget?: Acc17DelegateTargetKind;
}

export interface Agent17DelegationLadderSnapshot {
  rungs: Agent17DelegationLadderRung[];
  recommendedKind: Acc17DelegateTargetKind;
  totalActiveLoad: number;
  imbalanceFlag: boolean;
  headline: string;
}

export interface Agent17PlanLedgerEntry {
  id: string;
  turn: number;
  day: number;
  kind: 'verify' | 'replan' | 'delegate' | 'block';
  summary: string;
}

export interface Agent17PlanLedgerSummary {
  entries: Agent17PlanLedgerEntry[];
  verifiedEvents: number;
  replanEvents: number;
  blockedStepEvents: number;
  lastFingerprint: string;
}

export interface Acc17ProjectTemplate {
  id: string;
  title: string;
  category: string;
  delegateKind: Acc17DelegateTargetKind;
  stepBlueprints: Array<{
    title: string;
    actionType: string;
    summary: string;
    requirements?: Partial<Acc17PlanStepRequirement>;
  }>;
}

export interface Agent17GoalDefinition {
  id: string;
  title: string;
  category: 'planning' | 'validation' | 'rollback' | 'integration' | 'telemetry';
  acceptance: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface Agent17GoalVerificationResult {
  goalId: string;
  passed: boolean;
  evidence: string;
  measuredAt: number;
}

export interface Agent17ValidationReport {
  timestamp: number;
  goalResults: Agent17GoalVerificationResult[];
  passedCount: number;
  failedCount: number;
  success: boolean;
}

export interface Agent17RollbackCheckpoint {
  id: string;
  label: string;
  createdAt: number;
  turn: number;
  ops: Acc17CommandCenterOpsState;
}

export interface Agent17DevTestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed';
  durationMs: number;
  errorMessage?: string;
}

export interface Agent17DevTestReport {
  timestamp: number;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  executionTimeMs: number;
  overallStatus: 'passed' | 'failed';
  success: boolean;
  testResults: Agent17DevTestResult[];
  validationReport?: Agent17ValidationReport;
  summary: string;
}

/** Minimal game-state shape for modular evaluation (canonical game is richer). */
export interface Agent17GameStateSlice {
  turnCounter?: number;
  day?: number;
  player?: Agent17ActorSlice;
  actorsById?: Record<string, Agent17ActorSlice>;
  lastExecutedAction?: { type?: string; actionType?: string };
  lastAction?: { type?: string; actionType?: string };
  playerTrackedObjective?: {
    id?: string;
    sourceType?: string;
    sourceId?: string;
    title?: string;
    description?: string;
    recommendedNextStep?: { label?: string; actionType?: string };
  };
  strategyPlannerState?: { activePlan?: { id?: string; title?: string } };
  gi3Strategy?: { headline?: string };
}

export interface Agent17ActorSlice {
  id?: string;
  money?: number;
  netWorth?: number;
  currentRegion?: string;
  currentLocation?: string;
  actionsUsedThisTurn?: number;
  inventory?: unknown[];
  currentSupplies?: number;
}

export interface Agent17SettingsSlice {
  commandCenterSettings?: { enabled?: boolean };
  aiCommunicationAutonomyLevel?: 'advisory' | 'assisted' | 'delegated';
}

export interface ResolvedObjective {
  title: string;
  description?: string;
  sourceType?: string;
  sourceId?: string;
  recommendedNextStep?: { label?: string; actionType?: string };
}

export interface AttentionClassification {
  label: string;
  detail?: string;
}

export interface Agent17ContextAdapters {
  resolveObjective?: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actor: Agent17ActorSlice,
    tracked: Agent17GameStateSlice['playerTrackedObjective']
  ) => ResolvedObjective | null;
  classifyAttention?: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actor: Agent17ActorSlice
  ) => AttentionClassification | null;
}
