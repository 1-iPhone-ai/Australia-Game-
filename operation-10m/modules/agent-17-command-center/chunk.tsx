// OP10M_MODULE_BEGIN agent-17-command-center
// Agent 17 — Game Intelligence / AI Command Center (generated; source: operation-10m/agent-17-command-center/)

// --- source: types/command-center-types.ts ---
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


// --- source: planning/fingerprint.ts ---

/** FNV-1a 32-bit — matches canonical game helper semantics for ACC17 fingerprints. */
export function fnv1aHashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function acc17ComputeRelevantStateFingerprint(
  state: Agent17GameStateSlice,
  actorId: string
): string {
  const actor: Agent17ActorSlice =
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {};
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const parts = [
    actorId,
    String(turn),
    String(day),
    String(actor.money ?? 0),
    String(actor.netWorth ?? actor.money ?? 0),
    String(actor.currentRegion || actor.currentLocation || ''),
    String(actor.actionsUsedThisTurn ?? 0),
    String((actor.inventory || []).length),
    String(state.lastExecutedAction?.type || state.lastAction?.type || ''),
    String(state.playerTrackedObjective?.sourceId || ''),
    String(state.strategyPlannerState?.activePlan?.id || ''),
  ];
  return fnv1aHashString('acc17:' + parts.join('|'));
}


// --- source: planning/deep-templates.ts ---

/**
 * Multi-phase planning templates (4–6 steps, explicit prerequisite chains).
 * Merged into `AGENT17_PROJECT_TEMPLATE_CATALOG` at module load.
 */
export const AGENT17_DEEP_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_deep_capital_program',
    title: 'Deep capital program (6-phase)',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Cash audit',
        actionType: 'contract',
        summary: 'Establish baseline liquidity and runway.',
        requirements: { minCash: 250 },
      },
      {
        title: 'Phase 2: Liability scan',
        actionType: 'invest',
        summary: 'Map short-term obligations against reserves.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Phase 3: Asset liquidation window',
        actionType: 'sell_market',
        summary: 'Raise cash without breaching strategy constraints.',
        requirements: { prerequisiteStepIndices: [1], minCash: 400 },
      },
      {
        title: 'Phase 4: Regional deposit push',
        actionType: 'deposit',
        summary: 'Convert liquid cash into secured regional position.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Phase 5: Team treasury sync',
        actionType: 'invest',
        summary: 'Align team OS treasury with player runway target.',
        requirements: { prerequisiteStepIndices: [3] },
      },
      {
        title: 'Phase 6: Capital program verification',
        actionType: 'verify_objective',
        summary: 'Close the program with verified net-worth delta.',
        requirements: { prerequisiteStepIndices: [4] },
      },
    ],
  },
  {
    id: 'agent17_tpl_regional_recovery',
    title: 'Regional retreat and re-entry',
    category: 'recovery',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Withdraw to safe region',
        actionType: 'travel',
        summary: 'Reduce exposure in contested territory.',
      },
      {
        title: 'Fortify home deposit',
        actionType: 'deposit',
        summary: 'Rebuild VP buffer in controlled region.',
        requirements: { prerequisiteStepIndices: [0], minCash: 800 },
      },
      {
        title: 'Restock for counter-push',
        actionType: 'restock_supplies',
        summary: 'Prepare supply margin before re-entry.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Verify regional recovery',
        actionType: 'verify_objective',
        summary: 'Confirm standing and cash recovered.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_debt_recovery',
    title: 'Debt pressure relief lane',
    category: 'recovery',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Pause discretionary spend',
        actionType: 'wait',
        summary: 'Stop non-essential actions until ratio improves.',
      },
      {
        title: 'Service minimum obligations',
        actionType: 'contract',
        summary: 'Meet contractual cash outflows first.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Sell non-core inventory',
        actionType: 'sell_market',
        summary: 'Raise cash from market liquidation.',
        requirements: { prerequisiteStepIndices: [1], minNetWorth: 2000 },
      },
      {
        title: 'Verify debt ratio',
        actionType: 'verify_objective',
        summary: 'Confirm debt pressure telemetry normalized.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_crisis_stabilization',
    title: 'Crisis stabilization sequence',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Identify crisis driver',
        actionType: 'wait',
        summary: 'Classify liquidity vs supply vs regional crisis.',
      },
      {
        title: 'Emergency restock',
        actionType: 'restock_supplies',
        summary: 'Prevent condition collapse on active routes.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Emergency cash raise',
        actionType: 'sell_market',
        summary: 'Fund immediate recovery actions.',
        requirements: { prerequisiteStepIndices: [1], minCash: 100 },
      },
      {
        title: 'Stabilizing travel',
        actionType: 'travel',
        summary: 'Move to region with best recovery outlook.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Crisis exit verification',
        actionType: 'verify_objective',
        summary: 'Mark crisis lane complete after fingerprint proof.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_supply_deep_recovery',
    title: 'Deep supply chain recovery',
    category: 'recovery',
    delegateKind: 'manual',
    stepBlueprints: [
      {
        title: 'Audit supply margin',
        actionType: 'wait',
        summary: 'Quantify supply shortfall vs next expedition.',
      },
      {
        title: 'Bulk restock',
        actionType: 'restock_supplies',
        summary: 'Restore supply above critical threshold.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Craft sustainment kit',
        actionType: 'craft',
        summary: 'Convert materials into sustainment gear.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Trade for missing inputs',
        actionType: 'trade',
        summary: 'Fill gaps via regional market.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify supply recovery',
        actionType: 'verify_objective',
        summary: 'Confirm supply lane closed.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_diplomatic_depth',
    title: 'Diplomatic leverage program (deep)',
    category: 'diplomacy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Map rival intent signals',
        actionType: 'wait',
        summary: 'Collect observable diplomacy telemetry only.',
      },
      {
        title: 'Travel to negotiation hub',
        actionType: 'travel',
        summary: 'Position in region with active negotiation window.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Execute trade sweetener',
        actionType: 'trade',
        summary: 'Offer structured trade to shift standing.',
        requirements: { prerequisiteStepIndices: [1], minCash: 600 },
      },
      {
        title: 'Deposit goodwill buffer',
        actionType: 'deposit',
        summary: 'Lock goodwill into regional deposit.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify diplomatic milestone',
        actionType: 'verify_objective',
        summary: 'Confirm diplomacy objective progress.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_automation_oversight',
    title: 'Automation oversight ladder',
    category: 'intelligence',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Review autonomy ceiling',
        actionType: 'wait',
        summary: 'Confirm AI communication autonomy matches plan.',
      },
      {
        title: 'Delegate verification pass',
        actionType: 'contract',
        summary: 'Run delegated step with assisted ceiling.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Copilot session sync',
        actionType: 'invest',
        summary: 'Align copilot session with active plan id.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Manual override checkpoint',
        actionType: 'wait',
        summary: 'Player confirms no silent automation.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify oversight log',
        actionType: 'verify_objective',
        summary: 'Close oversight ladder with fingerprint proof.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
];

export type DeepTemplateBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};


// --- source: planning/templates.ts ---
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17ProjectTemplate,
} from '../types/command-center-types.ts';

type StepBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};

/** Curated template catalog (modular slice; full catalog remains in canonical TSX until assembly). */
export const AGENT17_BASE_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_economy_liquidity',
    title: 'Liquidity stabilization program',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Audit cash runway',
        actionType: 'contract',
        summary: 'Confirm contracts cover minimum liquidity.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Rebalance investments',
        actionType: 'invest',
        summary: 'Shift treasury to liquid instruments.',
      },
      {
        title: 'Verify debt ceiling',
        actionType: 'verify_objective',
        summary: 'Confirm debt ratio under alert threshold.',
      },
    ],
  },
  {
    id: 'agent17_tpl_trade_arbitrage',
    title: 'Regional trade arbitrage',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Scout price delta',
        actionType: 'travel',
        summary: 'Move to opposing region with favorable spread.',
      },
      {
        title: 'Execute market trade',
        actionType: 'trade',
        summary: 'Capture spread before expiration.',
      },
      {
        title: 'Bank proceeds',
        actionType: 'deposit',
        summary: 'Lock gains into regional deposit.',
        requirements: { minCash: 1000 },
      },
    ],
  },
  {
    id: 'agent17_tpl_team_synergy',
    title: 'Team treasury synergy',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Align team directive',
        actionType: 'wait',
        summary: 'Confirm team OS directive matches player objective.',
      },
      {
        title: 'Contribute to treasury',
        actionType: 'invest',
        summary: 'Fund shared infrastructure milestone.',
      },
      {
        title: 'Verify alignment score',
        actionType: 'verify_objective',
        summary: 'Check team alignment telemetry.',
      },
    ],
  },
  {
    id: 'agent17_tpl_recovery',
    title: 'Supply and recovery lane',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Restock expedition supplies',
        actionType: 'restock_supplies',
        summary: 'Avoid condition penalties on long routes.',
      },
      {
        title: 'Craft efficiency upgrade',
        actionType: 'craft',
        summary: 'Improve action efficiency before next push.',
      },
      {
        title: 'Confirm recovery metrics',
        actionType: 'verify_objective',
        summary: 'Validate supplies and net worth recovered.',
      },
    ],
  },
  {
    id: 'agent17_tpl_gi3_strategy',
    title: 'GI3 strategy alignment',
    category: 'intelligence',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Review active strategy headline',
        actionType: 'wait',
        summary: 'Ensure GI3 constraints match next action.',
      },
      {
        title: 'Execute constrained move',
        actionType: 'travel',
        summary: 'Take lowest-divergence action toward milestone.',
      },
      {
        title: 'Verify milestone progress',
        actionType: 'verify_objective',
        summary: 'Record verified fingerprint for strategy phase.',
      },
    ],
  },
];

export const AGENT17_PROJECT_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  ...AGENT17_BASE_TEMPLATE_CATALOG,
  ...AGENT17_DEEP_TEMPLATE_CATALOG,
];

function wirePrerequisiteStepIds(
  steps: Acc17MultiStepPlanStep[],
  blueprints: StepBlueprint[]
): Acc17MultiStepPlanStep[] {
  return steps.map((step, idx) => {
    const indices = blueprints[idx]?.requirements?.prerequisiteStepIndices;
    if (!indices?.length) return step;
    const prerequisiteStepIds = indices
      .filter(i => i >= 0 && i < steps.length)
      .map(i => steps[i].id);
    return {
      ...step,
      requirements: {
        ...step.requirements,
        prerequisiteStepIds,
      },
    };
  }).map(step => {
    const req = { ...step.requirements };
    delete (req as { prerequisiteStepIndices?: number[] }).prerequisiteStepIndices;
    return { ...step, requirements: req };
  });
}

export function acc17InstantiatePlanFromTemplate(
  templateId: string,
  state: Agent17GameStateSlice,
  _actorId: string
): Acc17MultiStepPlan | null {
  const tpl = AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
  if (!tpl) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_plan_${templateId}_${turn}`;
  const blueprints = tpl.stepBlueprints as StepBlueprint[];
  let steps: Acc17MultiStepPlanStep[] = blueprints.map((bp, idx) => ({
    id: `${planId}_step_${idx}`,
    index: idx,
    title: bp.title,
    summary: bp.summary,
    actionType: bp.actionType,
    requirements: { ...(bp.requirements || {}) },
    status: idx === 0 ? 'in_progress' : 'pending',
  }));
  steps = wirePrerequisiteStepIds(steps, blueprints);
  return {
    id: planId,
    title: tpl.title,
    objectiveSource: templateId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function listAgent17TemplateIds(): string[] {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.map(t => t.id);
}


// --- source: planning/ops-state.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17PlanStepStatus,
  Acc17ProjectDelegationStatus,
  Acc17VerifiedExecutionLogEntry,
  Acc17V94DeepContextBundle,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';

export function createDefaultAcc17CommandCenterOpsState(): Acc17CommandCenterOpsState {
  return {
    version: 1,
    activePlan: null,
    delegatedProjects: [],
    verificationLog: [],
    lastContextFingerprint: '',
    enabled: true,
  };
}

function acc17DelegateFallbackId(kind: Acc17DelegateTargetKind): string {
  if (kind === 'team_os') return 'team_os';
  if (kind === 'strategy_planner') return 'strategy_planner';
  return 'copilot';
}

export function sanitizeAcc17CommandCenterOpsState(input: unknown): Acc17CommandCenterOpsState {
  const defaults = createDefaultAcc17CommandCenterOpsState();
  if (!input || typeof input !== 'object') return defaults;
  const obj = input as Record<string, unknown>;
  const enabled = typeof obj.enabled === 'boolean' ? obj.enabled : defaults.enabled;
  const lastContextFingerprint =
    typeof obj.lastContextFingerprint === 'string' ? obj.lastContextFingerprint : '';

  let activePlan: Acc17MultiStepPlan | null = null;
  if (obj.activePlan && typeof obj.activePlan === 'object') {
    const p = obj.activePlan as Record<string, unknown>;
    const steps: Acc17MultiStepPlanStep[] = Array.isArray(p.steps)
      ? (p.steps as unknown[]).map((raw, idx) => {
          const s = raw as Record<string, unknown>;
          const statusList: Acc17PlanStepStatus[] = [
            'pending',
            'in_progress',
            'verified_complete',
            'failed',
            'skipped',
            'blocked',
          ];
          const status = statusList.includes(s?.status as Acc17PlanStepStatus)
            ? (s.status as Acc17PlanStepStatus)
            : 'pending';
          return {
            id: String(s?.id || `step_${idx}`),
            index: typeof s?.index === 'number' ? s.index : idx,
            title: String(s?.title || 'Step'),
            summary: String(s?.summary || ''),
            actionType: String(s?.actionType || 'wait'),
            requirements:
              s?.requirements && typeof s.requirements === 'object'
                ? (s.requirements as Acc17MultiStepPlanStep['requirements'])
                : {},
            status,
            verifiedOnTurn: typeof s?.verifiedOnTurn === 'number' ? s.verifiedOnTurn : undefined,
            verifiedOnDay: typeof s?.verifiedOnDay === 'number' ? s.verifiedOnDay : undefined,
            verifiedStateFingerprint:
              typeof s?.verifiedStateFingerprint === 'string'
                ? s.verifiedStateFingerprint
                : undefined,
            lastEvaluationFingerprint:
              typeof s?.lastEvaluationFingerprint === 'string'
                ? s.lastEvaluationFingerprint
                : undefined,
            blockerReason: typeof s?.blockerReason === 'string' ? s.blockerReason : undefined,
          };
        })
      : [];
    activePlan = {
      id: String(p.id || 'plan'),
      title: String(p.title || 'Plan'),
      objectiveSource: typeof p.objectiveSource === 'string' ? p.objectiveSource : undefined,
      createdTurn: typeof p.createdTurn === 'number' ? p.createdTurn : 1,
      createdDay: typeof p.createdDay === 'number' ? p.createdDay : 1,
      steps,
      activeStepIndex:
        typeof p.activeStepIndex === 'number'
          ? Math.max(0, Math.min(steps.length, p.activeStepIndex))
          : 0,
      completionPercent: typeof p.completionPercent === 'number' ? p.completionPercent : 0,
      isOnTrack: p.isOnTrack !== false,
      replanCount: typeof p.replanCount === 'number' ? p.replanCount : 0,
    };
  }

  const statusList: Acc17ProjectDelegationStatus[] = [
    'draft',
    'delegated',
    'executing',
    'awaiting_verification',
    'completed',
    'cancelled',
    'blocked',
  ];
  const kindList: Acc17DelegateTargetKind[] = [
    'copilot',
    'team_os',
    'teammate',
    'strategy_planner',
    'manual',
  ];

  const delegatedProjects: Acc17DelegatedProject[] = Array.isArray(obj.delegatedProjects)
    ? (obj.delegatedProjects as unknown[]).slice(0, 32).map((raw, i) => {
        const d = raw as Record<string, unknown>;
        const delegateKind = kindList.includes(d?.delegateKind as Acc17DelegateTargetKind)
          ? (d.delegateKind as Acc17DelegateTargetKind)
          : 'copilot';
        return {
          id: String(d?.id || `proj_${i}`),
          planId: String(d?.planId || ''),
          title: String(d?.title || 'Project'),
          delegateKind,
          delegateTargetId: String(
            d?.delegateTargetId || acc17DelegateFallbackId(delegateKind)
          ),
          status: statusList.includes(d?.status as Acc17ProjectDelegationStatus)
            ? (d.status as Acc17ProjectDelegationStatus)
            : 'draft',
          authorityCeiling: (['advisory', 'assisted', 'delegated'] as const).includes(
            d?.authorityCeiling as 'advisory'
          )
            ? (d.authorityCeiling as Acc17DelegatedProject['authorityCeiling'])
            : 'assisted',
          assignedTurn: typeof d?.assignedTurn === 'number' ? d.assignedTurn : 1,
          assignedDay: typeof d?.assignedDay === 'number' ? d.assignedDay : 1,
          lastVerifiedFingerprint:
            typeof d?.lastVerifiedFingerprint === 'string' ? d.lastVerifiedFingerprint : '',
          pendingVerificationStepId:
            typeof d?.pendingVerificationStepId === 'string'
              ? d.pendingVerificationStepId
              : undefined,
          notes: String(d?.notes || ''),
        };
      })
    : [];

  const verificationLog: Acc17VerifiedExecutionLogEntry[] = Array.isArray(obj.verificationLog)
    ? (obj.verificationLog as unknown[]).slice(-120).map((raw, i) => {
        const e = raw as Record<string, unknown>;
        return {
          id: String(e?.id || `vlog_${i}`),
          turn: typeof e?.turn === 'number' ? e.turn : 1,
          day: typeof e?.day === 'number' ? e.day : 1,
          stepId: String(e?.stepId || ''),
          projectId: String(e?.projectId || ''),
          fingerprintBefore: String(e?.fingerprintBefore || ''),
          fingerprintAfter: String(e?.fingerprintAfter || ''),
          verified: e?.verified === true,
          reason: String(e?.reason || ''),
        };
      })
    : [];

  const lastContextBundle =
    obj.lastContextBundle && typeof obj.lastContextBundle === 'object'
      ? (obj.lastContextBundle as Acc17V94DeepContextBundle)
      : undefined;

  return {
    version: 1,
    enabled,
    activePlan,
    delegatedProjects,
    verificationLog,
    lastContextFingerprint,
    lastContextBundle,
  };
}

export function acc17CreateMultiStepPlanFromObjective(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  resolveObjective: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actorId: string
  ) => ResolvedObjective | null
): Acc17MultiStepPlan | null {
  const objective = resolveObjective(state, settings, actorId);
  if (!objective?.title) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_obj_${objective.sourceType || 'goal'}_${turn}`;
  const next = objective.recommendedNextStep;
  const steps: Acc17MultiStepPlanStep[] = [
    {
      id: `${planId}_s0`,
      index: 0,
      title: 'Align with tracked objective',
      summary: objective.description || objective.title,
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'in_progress',
    },
    {
      id: `${planId}_s1`,
      index: 1,
      title: next?.label || 'Execute recommended move',
      summary: 'Complete the recommended next step from the intent layer.',
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'pending',
    },
    {
      id: `${planId}_s2`,
      index: 2,
      title: 'Verify objective progress',
      summary: 'Confirm goal progress after a verified state change.',
      actionType: 'verify_objective',
      requirements: {},
      status: 'pending',
    },
  ];
  return {
    id: planId,
    title: `Plan: ${objective.title}`,
    objectiveSource: objective.sourceId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function defaultObjectiveResolver(
  state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice,
  actorId: string
): ResolvedObjective | null {
  const tracked = state.playerTrackedObjective;
  if (!tracked?.title) return null;
  return {
    title: tracked.title,
    description: tracked.description,
    sourceType: tracked.sourceType,
    sourceId: tracked.sourceId,
    recommendedNextStep: tracked.recommendedNextStep,
  };
}

function acc17StepRequirementsMet(
  step: Acc17MultiStepPlanStep,
  state: Agent17GameStateSlice,
  actorId: string,
  completedIds: Set<string>
): boolean {
  const req = step.requirements || {};
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {};
  if (typeof req.minCash === 'number' && (actor.money || 0) < req.minCash) return false;
  if (typeof req.minNetWorth === 'number' && (actor.netWorth || actor.money || 0) < req.minNetWorth)
    return false;
  const region = actor.currentRegion || actor.currentLocation || '';
  if (req.requiredRegion && region !== req.requiredRegion) return false;
  if (Array.isArray(req.prerequisiteStepIds)) {
    for (const pid of req.prerequisiteStepIds) {
      if (!completedIds.has(pid)) return false;
    }
  }
  return true;
}

function acc17DetectActionMatch(step: Acc17MultiStepPlanStep, state: Agent17GameStateSlice): boolean {
  const last = state.lastExecutedAction || state.lastAction;
  const lastType = typeof last === 'string' ? last : last?.type || last?.actionType || '';
  if (!lastType) return false;
  if (step.actionType === 'verify_objective') {
    return (
      String(lastType).includes('objective') ||
      String(lastType).includes('contract') ||
      String(lastType).includes('track')
    );
  }
  return String(lastType) === step.actionType || String(lastType).includes(step.actionType);
}

export function acc17AdvanceVerifiedPlanProgress(
  plan: Acc17MultiStepPlan,
  state: Agent17GameStateSlice,
  actorId: string,
  previousFingerprint: string
): { plan: Acc17MultiStepPlan; logEntries: Acc17VerifiedExecutionLogEntry[]; fingerprint: string } {
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const logEntries: Acc17VerifiedExecutionLogEntry[] = [];
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const stateChanged = fingerprint !== previousFingerprint && previousFingerprint !== '';
  const completedIds = new Set(
    plan.steps.filter(s => s.status === 'verified_complete').map(s => s.id)
  );
  const steps = plan.steps.map(s => ({ ...s }));
  let activeStepIndex = plan.activeStepIndex;

  if (stateChanged) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.status === 'verified_complete' || step.status === 'skipped') continue;
      step.lastEvaluationFingerprint = fingerprint;
      if (!acc17StepRequirementsMet(step, state, actorId, completedIds)) {
        step.status = 'blocked';
        step.blockerReason = 'Requirements not satisfied after state change.';
        continue;
      }
      if (step.status === 'pending' && i === activeStepIndex) step.status = 'in_progress';
      if (step.status === 'in_progress' && acc17DetectActionMatch(step, state)) {
        step.status = 'verified_complete';
        step.verifiedOnTurn = turn;
        step.verifiedOnDay = day;
        step.verifiedStateFingerprint = fingerprint;
        completedIds.add(step.id);
        logEntries.push({
          id: `acc17_v_${step.id}_${turn}`,
          turn,
          day,
          stepId: step.id,
          projectId: plan.id,
          fingerprintBefore: previousFingerprint,
          fingerprintAfter: fingerprint,
          verified: true,
          reason: 'Verified after canonical state change matched step.',
        });
      }
    }
  }

  while (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'verified_complete') {
    activeStepIndex++;
  }
  if (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'pending') {
    steps[activeStepIndex].status = 'in_progress';
  }
  const done = steps.filter(s => s.status === 'verified_complete').length;
  const completionPercent = steps.length ? Math.round((done / steps.length) * 100) : 100;
  const blocked = steps.some(s => s.status === 'blocked');
  return {
    plan: {
      ...plan,
      steps,
      activeStepIndex,
      completionPercent,
      isOnTrack: !blocked && completionPercent < 100,
    },
    logEntries,
    fingerprint,
  };
}

export function acc17DelegateProject(
  ops: Acc17CommandCenterOpsState,
  plan: Acc17MultiStepPlan,
  delegateKind: Acc17DelegateTargetKind,
  delegateTargetId: string,
  authorityCeiling: Acc17DelegatedProject['authorityCeiling'] = 'assisted'
): Acc17DelegatedProject {
  return {
    id: `acc17_proj_${plan.id}_${ops.delegatedProjects.length}`,
    planId: plan.id,
    title: plan.title,
    delegateKind,
    delegateTargetId,
    status: 'delegated',
    authorityCeiling,
    assignedTurn: plan.createdTurn,
    assignedDay: plan.createdDay,
    lastVerifiedFingerprint: '',
    notes: `Delegated to ${delegateKind}:${delegateTargetId}`,
  };
}


// --- source: planning/recovery-paths.ts ---
  Acc17CommandCenterOpsState,
  Acc17MultiStepPlan,
  Agent17ActorSlice,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';

export type Agent17RecoveryLane =
  | 'liquidity_crisis'
  | 'supply_collapse'
  | 'regional_exposure'
  | 'debt_pressure'
  | 'plan_blocked';

export interface Agent17RecoverySignal {
  lane: Agent17RecoveryLane;
  severity: number;
  reason: string;
}

export interface Agent17RecoveryDecision {
  templateId: string;
  lane: Agent17RecoveryLane;
  rationale: string;
}

const RECOVERY_TEMPLATE_BY_LANE: Record<Agent17RecoveryLane, string> = {
  liquidity_crisis: 'agent17_tpl_deep_capital_program',
  supply_collapse: 'agent17_tpl_supply_deep_recovery',
  regional_exposure: 'agent17_tpl_regional_recovery',
  debt_pressure: 'agent17_tpl_debt_recovery',
  plan_blocked: 'agent17_tpl_crisis_stabilization',
};

function readActor(state: Agent17GameStateSlice, actorId: string): Agent17ActorSlice {
  return (
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {}
  );
}

/** Derive recovery lanes from lightweight state slices (no canonical TSX imports). */
export function detectAgent17RecoverySignals(
  state: Agent17GameStateSlice,
  actorId: string
): Agent17RecoverySignal[] {
  const actor = readActor(state, actorId);
  const signals: Agent17RecoverySignal[] = [];
  const cash = actor.money ?? 0;
  const netWorth = actor.netWorth ?? cash;
  const supplies =
    typeof (actor as { currentSupplies?: number }).currentSupplies === 'number'
      ? (actor as { currentSupplies: number }).currentSupplies
      : 100;
  const region = actor.currentRegion || actor.currentLocation || '';

  if (cash < 400) {
    signals.push({
      lane: 'liquidity_crisis',
      severity: Math.min(100, Math.round(100 - cash / 4)),
      reason: `Cash $${cash} below liquidity crisis threshold.`,
    });
  }
  if (supplies < 35) {
    signals.push({
      lane: 'supply_collapse',
      severity: Math.min(100, Math.round(100 - supplies)),
      reason: `Supplies ${supplies} critically low.`,
    });
  }
  if (netWorth > 0 && cash / netWorth < 0.08) {
    signals.push({
      lane: 'debt_pressure',
      severity: 70,
      reason: 'Cash to net-worth ratio indicates debt pressure.',
    });
  }
  if (region === 'QLD' && cash < 1200) {
    signals.push({
      lane: 'regional_exposure',
      severity: 55,
      reason: 'High exposure region with thin reserves.',
    });
  }
  return signals.sort((a, b) => b.severity - a.severity);
}

export function pickAgent17RecoveryTemplateId(
  signals: Agent17RecoverySignal[],
  planBlocked: boolean
): Agent17RecoveryDecision | null {
  if (planBlocked) {
    const top = signals[0];
    const lane = top?.lane ?? 'plan_blocked';
    return {
      templateId: RECOVERY_TEMPLATE_BY_LANE[lane] ?? RECOVERY_TEMPLATE_BY_LANE.plan_blocked,
      lane: top ? lane : 'plan_blocked',
      rationale: top
        ? `Blocked plan; escalating ${top.lane} recovery.`
        : 'Blocked plan; applying crisis stabilization sequence.',
    };
  }
  const top = signals[0];
  if (!top || top.severity < 40) return null;
  return {
    templateId: RECOVERY_TEMPLATE_BY_LANE[top.lane],
    lane: top.lane,
    rationale: top.reason,
  };
}

export function listAgent17RecoveryTemplateIds(): string[] {
  return Object.values(RECOVERY_TEMPLATE_BY_LANE).filter(
    (id, idx, arr) => arr.indexOf(id) === idx
  );
}

export function replanAcc17WithRecoveryTemplate(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  decision: Agent17RecoveryDecision
): Acc17CommandCenterOpsState {
  const replacement = acc17InstantiatePlanFromTemplate(decision.templateId, state, actorId);
  if (!replacement) return ops;
  const priorPlan = ops.activePlan;
  const replanCount = (priorPlan?.replanCount ?? 0) + 1;
  const plan: Acc17MultiStepPlan = {
    ...replacement,
    replanCount,
    objectiveSource: `recovery:${decision.lane}:${decision.templateId}`,
    title: `Recovery (${decision.lane}): ${replacement.title}`,
  };
  return {
    ...ops,
    activePlan: plan,
    delegatedProjects: [],
  };
}

/** When the active plan has blocked/failed steps, attempt a recovery replan. */
export function maybeApplyAgent17RecoveryPath(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): { ops: Acc17CommandCenterOpsState; applied: boolean; decision?: Agent17RecoveryDecision } {
  const blocked =
    ops.activePlan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const decision = pickAgent17RecoveryTemplateId(signals, blocked);
  if (!decision) return { ops, applied: false };
  if (!blocked && (signals[0]?.severity ?? 0) < 40) return { ops, applied: false };
  const nextOps = replanAcc17WithRecoveryTemplate(ops, state, actorId, decision);
  const changed = nextOps.activePlan?.id !== ops.activePlan?.id;
  return { ops: changed ? nextOps : ops, applied: changed, decision: changed ? decision : undefined };
}

export function resolveTemplateById(templateId: string) {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
}


// --- source: planning/template-selector.ts ---
  Acc17ProjectTemplate,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';
  AGENT17_BASE_TEMPLATE_CATALOG,
  AGENT17_PROJECT_TEMPLATE_CATALOG,
} from './templates.ts';

export interface Agent17TemplateRoute {
  category: string;
  keywords: string[];
  templateIds: string[];
  priority: number;
}

export const AGENT17_TEMPLATE_ROUTE_TABLE: Agent17TemplateRoute[] = [
  {
    category: 'economy',
    keywords: ['cash', 'liquidity', 'debt', 'treasury', 'loan'],
    templateIds: ['agent17_tpl_economy_liquidity', 'agent17_tpl_deep_capital_program', 'agent17_tpl_debt_recovery'],
    priority: 10,
  },
  {
    category: 'trade',
    keywords: ['trade', 'market', 'arbitrage', 'sell', 'buy'],
    templateIds: ['agent17_tpl_trade_arbitrage', 'agent17_tpl_regional_recovery'],
    priority: 9,
  },
  {
    category: 'team',
    keywords: ['team', 'treasury', 'synergy', 'alignment'],
    templateIds: ['agent17_tpl_team_synergy', 'agent17_tpl_automation_oversight'],
    priority: 8,
  },
  {
    category: 'recovery',
    keywords: ['recover', 'supply', 'restock', 'crisis', 'blocked'],
    templateIds: [
      'agent17_tpl_recovery',
      'agent17_tpl_supply_deep_recovery',
      'agent17_tpl_crisis_stabilization',
    ],
    priority: 11,
  },
  {
    category: 'intelligence',
    keywords: ['strategy', 'gi3', 'planner', 'objective', 'plan'],
    templateIds: ['agent17_tpl_gi3_strategy', 'agent17_tpl_automation_oversight'],
    priority: 7,
  },
  {
    category: 'diplomacy',
    keywords: ['diplomacy', 'negotiation', 'rival', 'standing', 'treaty'],
    templateIds: ['agent17_tpl_diplomatic_depth'],
    priority: 6,
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ');
}

export function inferAgent17ObjectiveCategory(
  objective: ResolvedObjective | null,
  state: Agent17GameStateSlice
): string {
  if (!objective?.title) return 'general';
  const blob = normalizeText(
    [objective.title, objective.description || '', objective.sourceType || ''].join(' ')
  );
  let best = { category: 'general', score: 0 };
  for (const route of AGENT17_TEMPLATE_ROUTE_TABLE) {
    let score = 0;
    for (const kw of route.keywords) {
      if (blob.includes(kw)) score += 1;
    }
    if (state.gi3Strategy?.headline && route.category === 'intelligence') score += 1;
    if (score > best.score) best = { category: route.category, score };
  }
  return best.score > 0 ? best.category : 'general';
}

export function rankAgent17TemplateCandidates(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): { matchedCategory: string; candidateTemplateIds: string[] } {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const matchedCategory = inferAgent17ObjectiveCategory(objective, state);
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === matchedCategory);
  const fallbackIds = AGENT17_BASE_TEMPLATE_CATALOG.slice(0, 3).map(t => t.id);
  const candidateTemplateIds = route?.templateIds?.length
    ? [...route.templateIds]
    : fallbackIds;
  const cash = state.player?.money ?? state.actorsById?.[actorId]?.money ?? 0;
  if (cash < 500) {
    candidateTemplateIds.unshift('agent17_tpl_deep_capital_program');
  }
  const unique: string[] = [];
  for (const id of candidateTemplateIds) {
    if (!unique.includes(id) && AGENT17_PROJECT_TEMPLATE_CATALOG.some(t => t.id === id)) {
      unique.push(id);
    }
  }
  return { matchedCategory, candidateTemplateIds: unique.slice(0, 6) };
}

export function pickAgent17TemplateForCategory(category: string): Acc17ProjectTemplate | null {
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === category);
  const id = route?.templateIds?.[0];
  if (!id) return null;
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === id) ?? null;
}

export function summarizeAgent17CatalogDepth(): {
  templateCount: number;
  deepTemplateCount: number;
  maxStepCount: number;
} {
  const templateCount = AGENT17_PROJECT_TEMPLATE_CATALOG.length;
  const deepTemplateCount = AGENT17_DEEP_TEMPLATE_CATALOG.length;
  const maxStepCount = AGENT17_PROJECT_TEMPLATE_CATALOG.reduce(
    (max, t) => Math.max(max, t.stepBlueprints.length),
    0
  );
  return { templateCount, deepTemplateCount, maxStepCount };
}


// --- source: planning/plan-health.ts ---
  Acc17MultiStepPlan,
  Agent17PlanHealthBand,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';

export function assessAgent17PlanHealth(
  plan: Acc17MultiStepPlan | null,
  _state: Agent17GameStateSlice,
  _actorId: string
): Agent17PlanHealthBand {
  if (!plan || plan.steps.length === 0) {
    return {
      band: 'critical',
      score: 0,
      blockedCount: 0,
      verifiedRatio: 0,
      replanCount: 0,
      onTrack: false,
    };
  }
  const blockedCount = plan.steps.filter(
    s => s.status === 'blocked' || s.status === 'failed'
  ).length;
  const verified = plan.steps.filter(s => s.status === 'verified_complete').length;
  const verifiedRatio = verified / plan.steps.length;
  const inFlight = plan.steps.some(s => s.status === 'in_progress' || s.status === 'pending');
  let score = Math.round(verifiedRatio * 70 + (plan.isOnTrack ? 20 : 0));
  if (verifiedRatio === 0 && inFlight && blockedCount === 0) {
    score = Math.max(score, 52);
  }
  score -= blockedCount * 15;
  score -= Math.min(15, plan.replanCount * 3);
  score = Math.max(0, Math.min(100, score));
  let band: Agent17PlanHealthBand['band'] = 'steady';
  if (score < 35 || blockedCount >= 2) band = 'critical';
  else if (score < 50 || blockedCount >= 1) band = 'at_risk';
  else if (score >= 80 && verifiedRatio >= 0.6) band = 'strong';
  else if (verifiedRatio === 0 && inFlight && blockedCount === 0) band = 'steady';
  return {
    band,
    score,
    blockedCount,
    verifiedRatio,
    replanCount: plan.replanCount,
    onTrack: plan.isOnTrack && blockedCount === 0,
  };
}

export function planHealthNeedsRecovery(health: Agent17PlanHealthBand): boolean {
  return health.band === 'critical' || health.band === 'at_risk';
}

export function formatAgent17PlanHealthSummary(health: Agent17PlanHealthBand): string {
  return `${health.band} · score ${health.score} · verified ${Math.round(health.verifiedRatio * 100)}% · replans ${health.replanCount}`;
}


// --- source: planning/delegation-analytics.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const DELEGATE_KINDS: Acc17DelegateTargetKind[] = [
  'copilot',
  'team_os',
  'teammate',
  'strategy_planner',
  'manual',
];

export function buildAgent17DelegationAnalytics(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice
): Agent17DelegationAnalyticsRow[] {
  const projects = ops.delegatedProjects || [];
  return DELEGATE_KINDS.map(delegateKind => {
    const rows = projects.filter(p => p.delegateKind === delegateKind);
    const authorityMix: Record<string, number> = {};
    for (const p of rows) {
      authorityMix[p.authorityCeiling] = (authorityMix[p.authorityCeiling] || 0) + 1;
    }
    const activeProjects = rows.filter(p =>
      ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
    ).length;
    const completedProjects = rows.filter(p => p.status === 'completed').length;
    const blockedProjects = rows.filter(p => p.status === 'blocked').length;
    let recommendedAdjustment: string | undefined;
    const autonomy = settings.aiCommunicationAutonomyLevel;
    if (delegateKind === 'copilot' && autonomy === 'advisory' && activeProjects > 0) {
      recommendedAdjustment = 'Reduce copilot load while autonomy is advisory.';
    }
    if (delegateKind === 'team_os' && autonomy === 'delegated' && activeProjects === 0) {
      recommendedAdjustment = 'Consider team_os delegation under delegated autonomy.';
    }
    if (blockedProjects >= 2) {
      recommendedAdjustment = 'Multiple blocked delegations — replan or downgrade authority ceiling.';
    }
    return {
      delegateKind,
      activeProjects,
      completedProjects,
      blockedProjects,
      authorityMix,
      recommendedAdjustment,
    };
  });
}

export function pickAgent17DelegateKindFromAnalytics(
  rows: Agent17DelegationAnalyticsRow[],
  recommended: Acc17DelegateTargetKind
): Acc17DelegateTargetKind {
  const overloaded = rows.find(r => r.activeProjects >= 3 && r.delegateKind === recommended);
  if (overloaded) {
    const alt = rows.find(r => r.activeProjects === 0 && r.delegateKind !== 'manual');
    return alt?.delegateKind ?? recommended;
  }
  return recommended;
}

export function countAgent17ActiveDelegations(projects: Acc17DelegatedProject[]): number {
  return projects.filter(p =>
    ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
  ).length;
}


// --- source: planning/delegation-ladder.ts ---
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17DelegationLadderRung,
  Agent17DelegationLadderSnapshot,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const MAX_CONCURRENT_BY_KIND: Record<Acc17DelegateTargetKind, number> = {
  copilot: 2,
  team_os: 2,
  teammate: 3,
  strategy_planner: 2,
  manual: 1,
};

const PREFERRED_AUTHORITY_BY_KIND: Record<
  Acc17DelegateTargetKind,
  Acc17DelegatedProject['authorityCeiling']
> = {
  copilot: 'assisted',
  team_os: 'delegated',
  teammate: 'assisted',
  strategy_planner: 'advisory',
  manual: 'advisory',
};

const ESCALATION_CHAIN: Partial<Record<Acc17DelegateTargetKind, Acc17DelegateTargetKind>> = {
  strategy_planner: 'copilot',
  copilot: 'team_os',
  teammate: 'copilot',
  manual: 'copilot',
};

export function buildAgent17DelegationLadder(
  analytics: Agent17DelegationAnalyticsRow[],
  settings: Agent17SettingsSlice,
  recommendedKind: Acc17DelegateTargetKind
): Agent17DelegationLadderSnapshot {
  const autonomy = settings.aiCommunicationAutonomyLevel ?? 'assisted';
  const rungs: Agent17DelegationLadderRung[] = analytics.map(row => {
    const maxConcurrent = MAX_CONCURRENT_BY_KIND[row.delegateKind];
    const loadScore = row.activeProjects * 10 + row.blockedProjects * 25;
    let preferredAuthority = PREFERRED_AUTHORITY_BY_KIND[row.delegateKind];
    if (autonomy === 'advisory' && preferredAuthority === 'delegated') {
      preferredAuthority = 'assisted';
    }
    if (autonomy === 'delegated' && row.delegateKind === 'team_os') {
      preferredAuthority = 'delegated';
    }
    return {
      delegateKind: row.delegateKind,
      loadScore,
      maxConcurrent,
      slotsRemaining: Math.max(0, maxConcurrent - row.activeProjects),
      preferredAuthority,
      escalationTarget: ESCALATION_CHAIN[row.delegateKind],
    };
  });

  const totalActiveLoad = analytics.reduce((sum, r) => sum + r.activeProjects, 0);
  const recommendedRung =
    rungs.find(r => r.delegateKind === recommendedKind) ??
    rungs.find(r => r.slotsRemaining > 0) ??
    rungs[0];
  let recommendedKindResolved = recommendedKind;
  if (recommendedRung && recommendedRung.slotsRemaining === 0 && recommendedRung.escalationTarget) {
    const esc = rungs.find(r => r.delegateKind === recommendedRung.escalationTarget);
    if (esc && esc.slotsRemaining > 0) recommendedKindResolved = esc.delegateKind;
  }

  const loads = rungs.map(r => r.loadScore);
  const maxLoad = Math.max(...loads, 0);
  const minLoad = Math.min(...loads, 0);
  const imbalanceFlag = maxLoad - minLoad >= 40 && totalActiveLoad >= 2;

  const headline = imbalanceFlag
    ? `Delegation imbalance — favor ${recommendedKindResolved} (${recommendedRung?.slotsRemaining ?? 0} slots)`
    : `Delegation ladder balanced — next ${recommendedKindResolved}`;

  return {
    rungs,
    recommendedKind: recommendedKindResolved,
    totalActiveLoad,
    imbalanceFlag,
    headline,
  };
}

export function pickAuthorityCeilingForDelegateKind(
  kind: Acc17DelegateTargetKind,
  settings: Agent17SettingsSlice
): Acc17DelegatedProject['authorityCeiling'] {
  const ladder = buildAgent17DelegationLadder(
    kind === 'copilot'
      ? [{ delegateKind: 'copilot', activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }]
      : [{ delegateKind: kind, activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }],
    settings,
    kind
  );
  return ladder.rungs[0]?.preferredAuthority ?? 'assisted';
}

export function delegationLadderHasCapacity(
  ladder: Agent17DelegationLadderSnapshot,
  kind: Acc17DelegateTargetKind
): boolean {
  const rung = ladder.rungs.find(r => r.delegateKind === kind);
  return (rung?.slotsRemaining ?? 0) > 0;
}


// --- source: planning/plan-ledger.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanLedgerEntry,
  Agent17PlanLedgerSummary,
} from '../types/command-center-types.ts';

const LEDGER_CAP = 24;

export function summarizeAgent17PlanLedger(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice
): Agent17PlanLedgerSummary {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || turn;
  const entries: Agent17PlanLedgerEntry[] = [];

  for (const log of ops.verificationLog.slice(-LEDGER_CAP)) {
    entries.push({
      id: log.id,
      turn: log.turn,
      day: log.day,
      kind: 'verify',
      summary: log.verified
        ? `Verified step ${log.stepId}: ${log.reason}`
        : `Unverified step ${log.stepId}`,
    });
  }

  const plan = ops.activePlan;
  if (plan && plan.replanCount > 0) {
    entries.push({
      id: `ledger_replan_${plan.id}`,
      turn,
      day,
      kind: 'replan',
      summary: `Replan count ${plan.replanCount} on ${plan.title}`,
    });
  }

  for (const proj of ops.delegatedProjects.slice(-8)) {
    entries.push({
      id: `ledger_delegate_${proj.id}`,
      turn: proj.assignedTurn,
      day: proj.assignedDay,
      kind: 'delegate',
      summary: `${proj.delegateKind}:${proj.delegateTargetId} · ${proj.status}`,
    });
  }

  if (plan) {
    for (const step of plan.steps.filter(s => s.status === 'blocked' || s.status === 'failed')) {
      entries.push({
        id: `ledger_block_${step.id}`,
        turn,
        day,
        kind: 'block',
        summary: `${step.title} — ${step.blockerReason || step.status}`,
      });
    }
  }

  entries.sort((a, b) => b.turn - a.turn || b.day - a.day);
  const trimmed = entries.slice(0, LEDGER_CAP);
  return {
    entries: trimmed,
    verifiedEvents: trimmed.filter(e => e.kind === 'verify').length,
    replanEvents: plan?.replanCount ?? 0,
    blockedStepEvents: trimmed.filter(e => e.kind === 'block').length,
    lastFingerprint: ops.lastContextFingerprint || '',
  };
}

export function planLedgerIndicatesInstability(ledger: Agent17PlanLedgerSummary): boolean {
  return ledger.blockedStepEvents >= 2 || ledger.replanEvents >= 2;
}


// --- source: planning/delegation-depth.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Agent17GameStateSlice,
  Agent17PlanningSuggestion,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from './delegation-ladder.ts';

export function refineAgent17DelegationSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  baseSuggestion: Agent17PlanningSuggestion,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  if (baseSuggestion.kind !== 'delegate' && baseSuggestion.kind !== 'hold') {
    return baseSuggestion;
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  const ledger = summarizeAgent17PlanLedger(ops, state);
  const health = assessAgent17PlanHealth(ops.activePlan, state, actorId);

  if (planLedgerIndicatesInstability(ledger) && ladder.recommendedKind !== recommendedDelegateKind) {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Ladder reroute → ${ladder.recommendedKind}`,
      rationale: `${ladder.headline}; ledger instability detected.`,
      confidence: 0.78,
    };
  }

  const targetKind = baseSuggestion.delegateKind ?? recommendedDelegateKind;
  if (!delegationLadderHasCapacity(ladder, targetKind)) {
    const alt = ladder.rungs.find(r => r.slotsRemaining > 0);
    if (alt) {
      return {
        kind: 'delegate',
        delegateKind: alt.delegateKind,
        headline: `Capacity reroute → ${alt.delegateKind}`,
        rationale: `${targetKind} at capacity; ${alt.slotsRemaining} slot(s) on ${alt.delegateKind}.`,
        confidence: 0.71,
      };
    }
  }

  if (health.band === 'at_risk' && baseSuggestion.kind === 'hold') {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Proactive delegate ${ladder.recommendedKind}`,
      rationale: 'Plan health at risk; ladder recommends early delegation.',
      confidence: 0.66,
    };
  }

  return baseSuggestion;
}

export function computeAgent17DelegationDepthScore(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice,
  recommendedDelegateKind: Acc17DelegateTargetKind
): number {
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  let score = 50;
  score += ladder.rungs.filter(r => r.slotsRemaining > 0).length * 5;
  score -= ladder.totalActiveLoad * 4;
  if (ladder.imbalanceFlag) score -= 15;
  else score += 10;
  return Math.max(0, Math.min(100, score));
}


// --- source: planning/intent-synthesis.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentItem,
  Agent17IntentQueueSnapshot,
  Agent17PlanHealthBand,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

export function buildAgent17IntentQueue(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand
): Agent17IntentQueueSnapshot {
  const items: Agent17IntentItem[] = [];
  const push = (item: Agent17IntentItem) => items.push(item);

  const objective = defaultObjectiveResolver(state, settings, actorId);
  if (objective?.title) {
    push({
      id: 'intent_objective',
      priority: 100,
      label: objective.title,
      source: 'objective',
      actionHint: objective.recommendedNextStep?.actionType,
    });
  }

  if (state.gi3Strategy?.headline) {
    push({
      id: 'intent_gi3',
      priority: 90,
      label: state.gi3Strategy.headline,
      source: 'gi3',
      actionHint: 'verify_objective',
    });
  }

  const signals = detectAgent17RecoverySignals(state, actorId);
  if (signals[0]) {
    push({
      id: `intent_recovery_${signals[0].lane}`,
      priority: 80 + Math.min(15, Math.floor(signals[0].severity / 10)),
      label: signals[0].reason,
      source: 'recovery',
      actionHint: 'wait',
    });
  }

  if (planHealth.band === 'at_risk' || planHealth.band === 'critical') {
    push({
      id: 'intent_plan_health',
      priority: 95,
      label: `Plan health ${planHealth.band} (score ${planHealth.score})`,
      source: 'plan_health',
      actionHint: ops.activePlan?.steps.find(s => s.status === 'in_progress')?.actionType,
    });
  }

  if (ops.delegatedProjects.length > 0) {
    push({
      id: 'intent_delegation',
      priority: 70,
      label: `${ops.delegatedProjects.length} active delegation(s)`,
      source: 'delegation',
      actionHint: 'invest',
    });
  }

  items.sort((a, b) => b.priority - a.priority);
  return {
    items: items.slice(0, 8),
    primaryIntentId: items[0]?.id ?? null,
    queueDepth: items.length,
  };
}

export function intentQueueRequiresRecovery(intent: Agent17IntentQueueSnapshot): boolean {
  return intent.items.some(i => i.source === 'recovery' && i.priority >= 90);
}


// --- source: planning/verification-policy.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17VerificationPolicyRule,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17VerificationPolicy(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): Agent17VerificationPolicySnapshot {
  const fp = acc17ComputeRelevantStateFingerprint(state, actorId);
  const prev = ops.lastContextFingerprint || '';
  const rules: Agent17VerificationPolicyRule[] = [
    {
      id: 'vp_fingerprint_delta',
      description: 'State fingerprint must differ from last evaluation to verify progress.',
      satisfied: prev !== '' && fp !== prev,
    },
    {
      id: 'vp_active_plan',
      description: 'An active multi-step plan must exist.',
      satisfied: !!ops.activePlan && ops.activePlan.steps.length > 0,
    },
    {
      id: 'vp_last_action',
      description: 'Last executed action must be recorded.',
      satisfied: !!(state.lastExecutedAction?.type || state.lastAction?.type),
    },
    {
      id: 'vp_not_evaluating',
      description: 'Command center must not be in a blocked-only terminal state.',
      satisfied: !(
        ops.activePlan?.steps.every(s => s.status === 'blocked' || s.status === 'failed') ?? false
      ),
    },
    {
      id: 'vp_ops_enabled',
      description: 'Ops pipeline enabled.',
      satisfied: ops.enabled !== false,
    },
  ];

  const blockingRuleIds = rules.filter(r => !r.satisfied).map(r => r.id);
  return {
    rules,
    allowVerification: blockingRuleIds.length === 0,
    blockingRuleIds,
  };
}

export function verificationPolicyBlocksAdvance(policy: Agent17VerificationPolicySnapshot): boolean {
  return !policy.allowVerification && policy.blockingRuleIds.includes('vp_fingerprint_delta');
}


// --- source: planning/coordination-brief.ts ---
  Acc17CommandCenterOpsState,
  Agent17CoordinationBrief,
  Agent17CoordinationBriefSection,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17SettingsSlice,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17CoordinationBrief(
  depth: Omit<
    Agent17PlanningDepthSnapshot,
    'intentQueue' | 'verificationPolicy' | 'coordinationBrief'
  >,
  intentQueue: Agent17IntentQueueSnapshot,
  verificationPolicy: Agent17VerificationPolicySnapshot,
  ops: Acc17CommandCenterOpsState,
  _state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice
): Agent17CoordinationBrief {
  const sections: Agent17CoordinationBriefSection[] = [];

  sections.push({
    id: 'intent',
    heading: 'Primary intents',
    bullets: intentQueue.items.slice(0, 4).map(i => `[${i.source}] ${i.label}`),
  });

  sections.push({
    id: 'plan',
    heading: 'Plan posture',
    bullets: [
      depth.planHealth
        ? `${depth.planHealth.band} · score ${depth.planHealth.score} · replans ${depth.planHealth.replanCount}`
        : 'No plan health',
      depth.suggestion.headline,
      depth.delegationLadder.headline,
    ],
  });

  sections.push({
    id: 'verify',
    heading: 'Verification policy',
    bullets: verificationPolicy.allowVerification
      ? ['All verification gates satisfied.']
      : verificationPolicy.blockingRuleIds.map(id => `Blocked: ${id}`),
  });

  if (ops.activePlan) {
    sections.push({
      id: 'steps',
      heading: 'Active plan steps',
      bullets: ops.activePlan.steps.slice(0, 5).map(
        (s, idx) => `${idx + 1}. ${s.title} (${s.status})`
      ),
    });
  }

  const giHandoffTags = [
    'agent17_command_center',
    `category_${depth.templateRouting.matchedCategory}`,
    depth.planHealth.band,
    verificationPolicy.allowVerification ? 'verify_ready' : 'verify_hold',
  ];
  if (intentQueue.primaryIntentId) giHandoffTags.push(intentQueue.primaryIntentId);

  const confidence =
    (depth.suggestion.confidence +
      (verificationPolicy.allowVerification ? 0.15 : 0) +
      (depth.planHealth.band === 'strong' ? 0.1 : 0)) /
    1.25;

  return {
    headline: depth.suggestion.headline || 'Command center coordination brief',
    sections,
    giHandoffTags,
    confidence: Math.min(0.99, Math.max(0.35, confidence)),
  };
}

export function coordinationBriefReadyForGi(brief: Agent17CoordinationBrief): boolean {
  return brief.sections.length >= 3 && brief.giHandoffTags.length >= 4;
}


// --- source: planning/execution-pacing.ts ---
  Acc17CommandCenterOpsState,
  Agent17ExecutionPacingSnapshot,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

const DEFAULT_TURN_BUDGET = 12;
const DELEGATE_COOLDOWN_TURNS = 2;

export function buildAgent17ExecutionPacing(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ExecutionPacingSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const plan = ops.activePlan;
  const createdTurn = plan?.createdTurn ?? turn;
  const stepsRemaining =
    plan?.steps.filter(s => s.status !== 'verified_complete' && s.status !== 'skipped').length ?? 0;
  const elapsedOnPlan = Math.max(0, turn - createdTurn);
  const turnBudgetRemaining = Math.max(0, DEFAULT_TURN_BUDGET - elapsedOnPlan);

  const activeStep = plan?.steps[plan.activeStepIndex];
  const verificationGateOpen = verificationPolicy.allowVerification;
  const healthAllowsAdvance =
    planHealth.band !== 'critical' || (planHealth.blockedCount === 0 && planHealth.verifiedRatio > 0.2);
  const canAdvanceActiveStep =
    !!activeStep &&
    (activeStep.status === 'in_progress' || activeStep.status === 'pending') &&
    verificationGateOpen &&
    healthAllowsAdvance;

  const lastDelegateTurn = ops.delegatedProjects.reduce(
    (max, p) => Math.max(max, p.assignedTurn),
    0
  );
  const cooldownTurns = Math.max(0, DELEGATE_COOLDOWN_TURNS - (turn - lastDelegateTurn));

  let pacingBand: Agent17ExecutionPacingSnapshot['pacingBand'] = 'steady';
  if (turnBudgetRemaining <= 2 || planHealth.band === 'critical') {
    pacingBand = 'urgent';
  } else if (!verificationGateOpen || cooldownTurns > 0) {
    pacingBand = 'throttled';
  }

  const headline =
    pacingBand === 'urgent'
      ? `Urgent pacing: ${stepsRemaining} step(s), ${turnBudgetRemaining} turn budget left`
      : pacingBand === 'throttled'
        ? `Throttled: verification or delegate cooldown (${cooldownTurns} turn(s))`
        : `Steady execution: advance ${canAdvanceActiveStep ? 'allowed' : 'held'}`;

  return {
    turn,
    turnBudgetRemaining,
    stepsRemaining,
    canAdvanceActiveStep,
    verificationGateOpen,
    cooldownTurns,
    pacingBand,
    headline,
  };
}

export function executionPacingRequiresThrottle(pacing: Agent17ExecutionPacingSnapshot): boolean {
  return pacing.pacingBand === 'throttled' || !pacing.verificationGateOpen;
}


// --- source: planning/resilience-scorecard.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17ResilienceScorecard,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17ResilienceScorecard(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ResilienceScorecard {
  const signals = detectAgent17RecoverySignals(state, actorId);
  const topSeverity = signals[0]?.severity ?? 0;
  const recoveryPressure = Math.min(100, Math.round(topSeverity * 0.85 + signals.length * 6));

  const satisfiedRules = verificationPolicy.rules.filter(r => r.satisfied).length;
  const ruleTotal = Math.max(1, verificationPolicy.rules.length);
  const verificationStability = Math.round((satisfiedRules / ruleTotal) * 100);

  const healthComponent = planHealth.score;
  const delegationLoad = Math.min(30, ops.delegatedProjects.filter(p => p.status === 'executing').length * 8);
  const compositeIndex = Math.max(
    0,
    Math.min(
      100,
      Math.round(healthComponent * 0.45 + verificationStability * 0.35 + (100 - recoveryPressure) * 0.2 - delegationLoad)
    )
  );

  const mitigationHints: string[] = [];
  if (recoveryPressure >= 55) {
    mitigationHints.push('Prioritize recovery lane template before new delegation.');
  }
  if (!verificationPolicy.allowVerification) {
    mitigationHints.push(`Clear verification gates: ${verificationPolicy.blockingRuleIds.join(', ')}`);
  }
  if (planHealth.blockedCount > 0) {
    mitigationHints.push(`${planHealth.blockedCount} blocked step(s) — run replan or recovery path.`);
  }
  if (mitigationHints.length === 0) {
    mitigationHints.push('Posture stable; maintain verify-then-advance cadence.');
  }

  const band: Agent17ResilienceScorecard['band'] =
    compositeIndex >= 72 ? 'robust' : compositeIndex >= 45 ? 'watch' : 'fragile';

  return {
    recoveryPressure,
    verificationStability,
    compositeIndex,
    band,
    signalCount: signals.length,
    mitigationHints: mitigationHints.slice(0, 4),
    headline: `Resilience ${band} (${compositeIndex}/100) · recovery pressure ${recoveryPressure}`,
  };
}

export function resilienceScorecardNeedsIntervention(card: Agent17ResilienceScorecard): boolean {
  return card.band === 'fragile' || card.recoveryPressure >= 70;
}


// --- source: planning/strategic-alignment.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4)
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 50;
  let hits = 0;
  for (const w of a) {
    if (b.has(w)) hits += 1;
  }
  const denom = Math.max(1, Math.min(a.size, b.size));
  return Math.round((hits / denom) * 100);
}

export function buildAgent17StrategicAlignment(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: import('../types/command-center-types.ts').Agent17SettingsSlice,
  actorId: string,
  intentQueue: Agent17IntentQueueSnapshot
): Agent17StrategicAlignmentSnapshot {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const objectiveText = objective?.title || '';
  const gi3Text = state.gi3Strategy?.headline || '';
  const plannerText = state.strategyPlannerState?.activePlan?.title || '';
  const planText = ops.activePlan?.title || '';

  const objectiveTokens = tokenize(objectiveText);
  const gi3Tokens = tokenize(gi3Text);
  const plannerTokens = tokenize(plannerText);
  const planTokens = tokenize(planText || objectiveText);

  const gi3Overlap = gi3Text ? overlapScore(objectiveTokens, gi3Tokens) : 60;
  const plannerOverlap = plannerText ? overlapScore(objectiveTokens, plannerTokens) : 55;
  const planOverlap = ops.activePlan ? overlapScore(objectiveTokens, planTokens) : 50;

  const alignmentIndex = Math.max(
    0,
    Math.min(100, Math.round(gi3Overlap * 0.4 + plannerOverlap * 0.25 + planOverlap * 0.35))
  );

  const driftFlags: string[] = [];
  if (gi3Text && gi3Overlap < 35) driftFlags.push('gi3_objective_drift');
  if (plannerText && plannerOverlap < 30) driftFlags.push('planner_objective_drift');
  if (ops.activePlan && planOverlap < 25) driftFlags.push('plan_title_drift');
  if (intentQueue.primaryIntentId === 'intent_gi3' && gi3Overlap < 45) {
    driftFlags.push('primary_intent_misaligned');
  }

  const band: Agent17StrategicAlignmentSnapshot['band'] =
    alignmentIndex >= 70 ? 'aligned' : alignmentIndex >= 42 ? 'drifting' : 'divergent';

  const cues = [gi3Text, plannerText, planText].filter(Boolean);
  const headline =
    cues.length >= 2
      ? `Strategic ${band} (${alignmentIndex}/100) · GI3/plan cues ${cues.length}`
      : `Strategic ${band} (${alignmentIndex}/100) · sparse upstream cues`;

  return {
    alignmentIndex,
    band,
    gi3Overlap,
    plannerOverlap,
    planOverlap,
    driftFlags: driftFlags.slice(0, 4),
    primaryIntentId: intentQueue.primaryIntentId,
    headline,
  };
}

export function strategicAlignmentNeedsReconcile(snapshot: Agent17StrategicAlignmentSnapshot): boolean {
  return snapshot.band === 'divergent' || snapshot.driftFlags.length >= 2;
}


// --- source: planning/handoff-readiness.ts ---
  Agent17CoordinationBrief,
  Agent17ExecutionPacingSnapshot,
  Agent17HandoffReadinessSnapshot,
  Agent17ResilienceScorecard,
  Agent17StrategicAlignmentSnapshot,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export interface Agent17HandoffReadinessInputs {
  coordinationBrief: Agent17CoordinationBrief;
  verificationPolicy: Agent17VerificationPolicySnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17HandoffReadiness(
  inputs: Agent17HandoffReadinessInputs
): Agent17HandoffReadinessSnapshot {
  const checks: Agent17HandoffReadinessSnapshot['checks'] = [];

  const giReady = coordinationBriefReadyForGi(inputs.coordinationBrief);
  checks.push({
    id: 'gi_brief',
    label: 'Coordination brief GI-ready',
    passed: giReady,
    weight: 20,
  });

  checks.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    passed: inputs.verificationPolicy.allowVerification,
    weight: 25,
  });

  checks.push({
    id: 'pacing',
    label: 'Execution pacing not throttled',
    passed: inputs.executionPacing.pacingBand !== 'throttled',
    weight: 15,
  });

  checks.push({
    id: 'resilience',
    label: 'Resilience posture stable',
    passed: !resilienceScorecardNeedsIntervention(inputs.resilienceScorecard),
    weight: 20,
  });

  checks.push({
    id: 'alignment',
    label: 'Strategic alignment not divergent',
    passed: !strategicAlignmentNeedsReconcile(inputs.strategicAlignment),
    weight: 20,
  });

  const earned = checks.filter(c => c.passed).reduce((n, c) => n + c.weight, 0);
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const readinessScore = Math.round((earned / Math.max(1, totalWeight)) * 100);

  const blockers = checks.filter(c => !c.passed).map(c => c.id);
  const readyForTeamOs =
    readinessScore >= 72 &&
    inputs.verificationPolicy.allowVerification &&
    inputs.coordinationBrief.giHandoffTags.includes('agent17_command_center');

  const band: Agent17HandoffReadinessSnapshot['band'] =
    readinessScore >= 80 ? 'ready' : readinessScore >= 50 ? 'partial' : 'blocked';

  return {
    readinessScore,
    band,
    readyForTeamOs,
    checks,
    blockers,
    headline: `Handoff ${band} (${readinessScore}/100) · blockers ${blockers.length}`,
  };
}

export function handoffReadinessBlocked(snapshot: Agent17HandoffReadinessSnapshot): boolean {
  return snapshot.band === 'blocked' || snapshot.blockers.includes('verify_gate');
}


// --- source: planning/command-posture.ts ---
  Agent17CommandPostureSnapshot,
  Agent17HandoffReadinessSnapshot,
  Agent17PlanHealthBand,
  Agent17ResilienceScorecard,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17CommandPostureInputs {
  planHealth: Agent17PlanHealthBand;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

function scorePlanHealthContribution(health: Agent17PlanHealthBand): number {
  return Math.max(0, Math.min(100, health.score));
}

export function buildAgent17CommandPosture(
  inputs: Agent17CommandPostureInputs
): Agent17CommandPostureSnapshot {
  const handoffContribution = inputs.handoffReadiness.readinessScore;
  const resilienceContribution = inputs.resilienceScorecard.compositeIndex;
  const planHealthContribution = scorePlanHealthContribution(inputs.planHealth);
  const alignmentContribution = inputs.strategicAlignment.alignmentIndex;

  const postureIndex = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        handoffContribution * 0.3 +
          resilienceContribution * 0.25 +
          planHealthContribution * 0.25 +
          alignmentContribution * 0.2
      )
    )
  );

  const degradedSignals =
    handoffReadinessBlocked(inputs.handoffReadiness) ||
    resilienceScorecardNeedsIntervention(inputs.resilienceScorecard) ||
    strategicAlignmentNeedsReconcile(inputs.strategicAlignment) ||
    inputs.planHealth.band === 'critical';

  const band: Agent17CommandPostureSnapshot['band'] =
    postureIndex >= 72 && !degradedSignals
      ? 'commanding'
      : postureIndex >= 45
        ? 'contested'
        : 'degraded';

  const headline = `Command ${band} (${postureIndex}/100) · handoff ${inputs.handoffReadiness.band}`;

  return {
    postureIndex,
    band,
    handoffContribution,
    resilienceContribution,
    planHealthContribution,
    alignmentContribution,
    headline,
  };
}

export function commandPostureNeedsEscalation(snapshot: Agent17CommandPostureSnapshot): boolean {
  return snapshot.band === 'degraded' || snapshot.postureIndex < 40;
}


// --- source: planning/governance-audit.ts ---
  Acc17CommandCenterOpsState,
  Agent17GovernanceAuditSnapshot,
  Agent17SettingsSlice,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

const MAX_VERIFICATION_LOG = 64;

export function buildAgent17GovernanceAudit(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17GovernanceAuditSnapshot {
  const findings: Agent17GovernanceAuditSnapshot['findings'] = [];
  const enabled = settings.commandCenterSettings?.enabled !== false && ops.enabled;

  findings.push({
    id: 'cc_enabled',
    category: 'policy',
    severity: 'info',
    passed: enabled,
    detail: enabled ? 'Command center enabled' : 'Command center disabled',
  });

  const verifyOk =
    verificationPolicy.allowVerification || verificationPolicy.blockingRuleIds.length === 0;
  findings.push({
    id: 'verify_policy',
    category: 'verification',
    severity: verifyOk ? 'info' : 'warn',
    passed: verifyOk,
    detail: verifyOk
      ? 'Verification policy allows progress'
      : `Blocked rules: ${verificationPolicy.blockingRuleIds.join(',')}`,
  });

  const logLen = ops.verificationLog.length;
  const logBounded = logLen <= MAX_VERIFICATION_LOG;
  findings.push({
    id: 'verify_log_bound',
    category: 'verification',
    severity: logBounded ? 'info' : 'warn',
    passed: logBounded,
    detail: `Verification log entries: ${logLen}`,
  });

  const staleDelegations = ops.delegatedProjects.filter(
    p => p.status === 'active' && !p.lastVerifiedFingerprint
  ).length;
  findings.push({
    id: 'delegation_fingerprint',
    category: 'delegation',
    severity: staleDelegations > 2 ? 'critical' : staleDelegations > 0 ? 'warn' : 'info',
    passed: staleDelegations === 0,
    detail: `Active delegations missing fingerprint: ${staleDelegations}`,
  });

  const authorityBreaches = ops.delegatedProjects.filter(
    p =>
      p.status === 'active' &&
      settings.aiCommunicationAutonomyLevel === 'advisory' &&
      p.authorityCeiling === 'delegated'
  ).length;
  findings.push({
    id: 'authority_ceiling',
    category: 'delegation',
    severity: authorityBreaches > 0 ? 'critical' : 'info',
    passed: authorityBreaches === 0,
    detail: `Delegated ceiling breaches under advisory autonomy: ${authorityBreaches}`,
  });

  const failedSteps = ops.activePlan?.steps.filter(s => s.status === 'failed').length ?? 0;
  findings.push({
    id: 'plan_integrity',
    category: 'rollback',
    severity: failedSteps > 0 ? 'warn' : 'info',
    passed: failedSteps === 0,
    detail: `Failed plan steps: ${failedSteps}`,
  });

  const passedWeight = findings.filter(f => f.passed).reduce((n, f) => {
    const w = f.severity === 'critical' ? 25 : f.severity === 'warn' ? 15 : 10;
    return n + w;
  }, 0);
  const totalWeight = findings.reduce((n, f) => {
    const w = f.severity === 'critical' ? 25 : f.severity === 'warn' ? 15 : 10;
    return n + w;
  }, 0);
  const auditScore = Math.round((passedWeight / Math.max(1, totalWeight)) * 100);

  const openCriticalCount = findings.filter(f => !f.passed && f.severity === 'critical').length;
  const band: Agent17GovernanceAuditSnapshot['band'] =
    openCriticalCount > 0 ? 'breach' : auditScore >= 80 ? 'compliant' : 'review';

  return {
    auditScore,
    band,
    findings,
    openCriticalCount,
    headline: `Governance ${band} (${auditScore}/100) · ${findings.length} findings`,
  };
}

export function governanceAuditBlocksAutomation(snapshot: Agent17GovernanceAuditSnapshot): boolean {
  return snapshot.band === 'breach' || snapshot.openCriticalCount > 0;
}


// --- source: planning/escalation-matrix.ts ---
  Agent17CommandPostureSnapshot,
  Agent17EscalationMatrixSnapshot,
  Agent17GovernanceAuditSnapshot,
  Agent17HandoffReadinessSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17EscalationMatrixInputs {
  commandPosture: Agent17CommandPostureSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
}

export function buildAgent17EscalationMatrix(
  inputs: Agent17EscalationMatrixInputs
): Agent17EscalationMatrixSnapshot {
  const rungs: Agent17EscalationMatrixSnapshot['rungs'] = [];

  const postureStress = commandPostureNeedsEscalation(inputs.commandPosture)
    ? 35
    : inputs.commandPosture.band === 'contested'
      ? 18
      : 0;
  rungs.push({
    id: 'posture',
    label: 'Command posture',
    triggered: postureStress > 0,
    severity: postureStress >= 35 ? 'high' : postureStress > 0 ? 'medium' : 'low',
    detail: `${inputs.commandPosture.band} (${inputs.commandPosture.postureIndex}/100)`,
  });

  const govStress = governanceAuditBlocksAutomation(inputs.governanceAudit)
    ? 40
    : inputs.governanceAudit.band === 'review'
      ? 15
      : 0;
  rungs.push({
    id: 'governance',
    label: 'Governance audit',
    triggered: govStress > 0,
    severity: govStress >= 40 ? 'high' : govStress > 0 ? 'medium' : 'low',
    detail: `${inputs.governanceAudit.band} (${inputs.governanceAudit.auditScore}/100)`,
  });

  const handoffStress = handoffReadinessBlocked(inputs.handoffReadiness)
    ? 25
    : inputs.handoffReadiness.band === 'partial'
      ? 12
      : 0;
  rungs.push({
    id: 'handoff',
    label: 'Team OS handoff',
    triggered: handoffStress > 0,
    severity: handoffStress >= 25 ? 'high' : handoffStress > 0 ? 'medium' : 'low',
    detail: `${inputs.handoffReadiness.band} (${inputs.handoffReadiness.readinessScore}/100)`,
  });

  const escalationIndex = Math.max(
    0,
    Math.min(100, Math.round(postureStress + govStress + handoffStress))
  );

  const band: Agent17EscalationMatrixSnapshot['band'] =
    escalationIndex >= 55 || inputs.governanceAudit.band === 'breach'
      ? 'urgent'
      : escalationIndex >= 20
        ? 'watch'
        : 'none';

  const triggeredCount = rungs.filter(r => r.triggered).length;

  return {
    escalationIndex,
    band,
    rungs,
    triggeredCount,
    headline: `Escalation ${band} (${escalationIndex}/100) · ${triggeredCount} rungs`,
  };
}

export function escalationMatrixBlocksAutomation(snapshot: Agent17EscalationMatrixSnapshot): boolean {
  return snapshot.band === 'urgent' || snapshot.escalationIndex >= 55;
}


// --- source: planning/rollback-assurance.ts ---
  Acc17CommandCenterOpsState,
  Agent17GovernanceAuditSnapshot,
  Agent17PlanHealthBand,
  Agent17RollbackAssuranceSnapshot,
} from '../types/command-center-types.ts';

const MAX_VERIFICATION_LOG = 64;

export function buildAgent17RollbackAssurance(
  ops: Acc17CommandCenterOpsState,
  planHealth: Agent17PlanHealthBand,
  governanceAudit: Agent17GovernanceAuditSnapshot
): Agent17RollbackAssuranceSnapshot {
  const checks: Agent17RollbackAssuranceSnapshot['checks'] = [];

  const hasPlan = !!ops.activePlan;
  checks.push({
    id: 'active_plan',
    label: 'Active plan checkpoint anchor',
    passed: hasPlan,
    weight: 15,
  });

  const logOk = ops.verificationLog.length <= MAX_VERIFICATION_LOG;
  checks.push({
    id: 'verify_log',
    label: 'Verification log bounded',
    passed: logOk,
    weight: 15,
  });

  const failedSteps = ops.activePlan?.steps.filter(s => s.status === 'failed').length ?? 0;
  checks.push({
    id: 'plan_integrity',
    label: 'No failed plan steps',
    passed: failedSteps === 0,
    weight: 20,
  });

  const replanOk = (ops.activePlan?.replanCount ?? 0) <= 3;
  checks.push({
    id: 'replan_budget',
    label: 'Replan count within budget',
    passed: replanOk,
    weight: 15,
  });

  const govOk = governanceAudit.band !== 'breach' && governanceAudit.openCriticalCount === 0;
  checks.push({
    id: 'governance_clear',
    label: 'Governance not in breach',
    passed: govOk,
    weight: 20,
  });

  const healthOk = planHealth.band !== 'critical';
  checks.push({
    id: 'plan_health',
    label: 'Plan health not critical',
    passed: healthOk,
    weight: 15,
  });

  const earned = checks.filter(c => c.passed).reduce((n, c) => n + c.weight, 0);
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const assuranceScore = Math.round((earned / Math.max(1, totalWeight)) * 100);

  const band: Agent17RollbackAssuranceSnapshot['band'] =
    assuranceScore >= 80 && govOk ? 'protected' : assuranceScore >= 45 ? 'at_risk' : 'exposed';

  const restoreRecommended =
    band === 'exposed' || failedSteps > 0 || governanceAudit.band === 'breach';

  return {
    assuranceScore,
    band,
    checks,
    restoreRecommended,
    headline: `Rollback ${band} (${assuranceScore}/100) · ${checks.filter(c => c.passed).length}/${checks.length} checks`,
  };
}

export function rollbackAssuranceNeedsRestore(snapshot: Agent17RollbackAssuranceSnapshot): boolean {
  return snapshot.restoreRecommended || snapshot.band === 'exposed';
}


// --- source: planning/stabilization-index.ts ---
  Agent17EscalationMatrixSnapshot,
  Agent17RollbackAssuranceSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17StabilizationIndexInputs {
  escalationMatrix: Agent17EscalationMatrixSnapshot;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
}

export function buildAgent17StabilizationIndex(
  inputs: Agent17StabilizationIndexInputs
): Agent17StabilizationIndexSnapshot {
  const factors: Agent17StabilizationIndexSnapshot['factors'] = [];

  const escalationHeadroom = Math.max(0, 100 - inputs.escalationMatrix.escalationIndex);
  factors.push({
    id: 'escalation_headroom',
    label: 'Escalation headroom',
    score: escalationHeadroom,
    weight: 35,
  });

  const assuranceScore = inputs.rollbackAssurance.assuranceScore;
  factors.push({
    id: 'rollback_assurance',
    label: 'Rollback assurance',
    score: assuranceScore,
    weight: 35,
  });

  const rungPenalty = Math.min(40, inputs.escalationMatrix.triggeredCount * 12);
  const rungScore = Math.max(0, 100 - rungPenalty);
  factors.push({
    id: 'rung_calm',
    label: 'Escalation rung calm',
    score: rungScore,
    weight: 15,
  });

  const restorePenalty = inputs.rollbackAssurance.restoreRecommended ? 35 : 0;
  const restoreScore = Math.max(0, 100 - restorePenalty);
  factors.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    score: restoreScore,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const stabilizationIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const volatileSignals =
    inputs.escalationMatrix.band === 'urgent' ||
    escalationMatrixBlocksAutomation(inputs.escalationMatrix) ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17StabilizationIndexSnapshot['band'] =
    volatileSignals || stabilizationIndex < 42
      ? 'volatile'
      : stabilizationIndex >= 70
        ? 'stable'
        : 'adjusting';

  return {
    stabilizationIndex,
    band,
    factors,
    escalationBand: inputs.escalationMatrix.band,
    assuranceBand: inputs.rollbackAssurance.band,
    headline: `Stabilization ${band} (${stabilizationIndex}/100) · esc ${inputs.escalationMatrix.band}`,
  };
}

export function stabilizationIndexBlocksAutomation(
  snapshot: Agent17StabilizationIndexSnapshot
): boolean {
  return snapshot.band === 'volatile' || snapshot.stabilizationIndex < 35;
}


// --- source: planning/command-envelope.ts ---
  Acc17CommandCenterOpsState,
  Agent17CommandEnvelopeSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17CommandEnvelopeInputs {
  ops: Acc17CommandCenterOpsState;
  executionPacing: Agent17ExecutionPacingSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
}

export function buildAgent17CommandEnvelope(
  inputs: Agent17CommandEnvelopeInputs
): Agent17CommandEnvelopeSnapshot {
  const signals: Agent17CommandEnvelopeSnapshot['signals'] = [];

  const activeDelegations = inputs.ops.delegatedProjects.filter(p => p.status === 'active').length;
  const delegationCap = 6;
  const delegationLoad = Math.round((activeDelegations / delegationCap) * 100);
  signals.push({
    id: 'delegation_load',
    label: 'Active delegation load',
    value: delegationLoad,
    unit: 'percent',
  });

  const stepsRemaining = inputs.executionPacing.stepsRemaining;
  signals.push({
    id: 'plan_steps',
    label: 'Plan steps remaining',
    value: stepsRemaining,
    unit: 'steps',
  });

  signals.push({
    id: 'turn_budget',
    label: 'Turn budget remaining',
    value: inputs.executionPacing.turnBudgetRemaining,
    unit: 'turns',
  });

  const cooldown = inputs.executionPacing.cooldownTurns;
  signals.push({
    id: 'delegate_cooldown',
    label: 'Delegate cooldown',
    value: cooldown,
    unit: 'turns',
  });

  signals.push({
    id: 'stabilization',
    label: 'Stabilization index',
    value: inputs.stabilizationIndex.stabilizationIndex,
    unit: 'index',
  });

  const horizonTurns = Math.max(
    1,
    Math.min(
      12,
      Math.ceil(stepsRemaining / 2) +
        cooldown +
        (inputs.stabilizationIndex.band === 'volatile' ? 3 : 0)
    )
  );

  const saturated =
    delegationLoad >= 85 ||
    inputs.executionPacing.pacingBand === 'throttled' ||
    stabilizationIndexBlocksAutomation(inputs.stabilizationIndex);

  const constrained =
    !saturated &&
    (delegationLoad >= 55 ||
      inputs.executionPacing.pacingBand === 'steady' ||
      inputs.stabilizationIndex.band === 'adjusting');

  const capacityBand: Agent17CommandEnvelopeSnapshot['capacityBand'] = saturated
    ? 'saturated'
    : constrained
      ? 'constrained'
      : 'nominal';

  const automationAllowed =
    capacityBand === 'nominal' &&
    inputs.executionPacing.canAdvanceActiveStep &&
    !stabilizationIndexBlocksAutomation(inputs.stabilizationIndex);

  return {
    capacityBand,
    horizonTurns,
    activeDelegationCount: activeDelegations,
    delegationCap,
    automationAllowed,
    signals,
    headline: `Envelope ${capacityBand} · horizon ${horizonTurns}t · ${activeDelegations}/${delegationCap} delegations`,
  };
}

export function commandEnvelopeNeedsThrottle(snapshot: Agent17CommandEnvelopeSnapshot): boolean {
  return snapshot.capacityBand === 'saturated' || !snapshot.automationAllowed;
}


// --- source: planning/convergence-index.ts ---
  Agent17CommandEnvelopeSnapshot,
  Agent17ConvergenceIndexSnapshot,
  Agent17StabilizationIndexSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17ConvergenceIndexInputs {
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17ConvergenceIndex(
  inputs: Agent17ConvergenceIndexInputs
): Agent17ConvergenceIndexSnapshot {
  const factors: Agent17ConvergenceIndexSnapshot['factors'] = [];

  factors.push({
    id: 'strategic_alignment',
    label: 'Strategic alignment',
    score: inputs.strategicAlignment.alignmentIndex,
    weight: 35,
  });

  const stabilizationScore =
    inputs.stabilizationIndex.band === 'stable'
      ? inputs.stabilizationIndex.stabilizationIndex
      : inputs.stabilizationIndex.band === 'adjusting'
        ? Math.max(0, inputs.stabilizationIndex.stabilizationIndex - 8)
        : Math.max(0, inputs.stabilizationIndex.stabilizationIndex - 28);
  factors.push({
    id: 'stabilization',
    label: 'Ops stabilization',
    score: stabilizationScore,
    weight: 30,
  });

  const envelopeScore =
    inputs.commandEnvelope.capacityBand === 'nominal'
      ? 88
      : inputs.commandEnvelope.capacityBand === 'constrained'
        ? 58
        : 28;
  factors.push({
    id: 'envelope_capacity',
    label: 'Command envelope capacity',
    score: envelopeScore,
    weight: 20,
  });

  const horizonHeadroom = Math.max(
    0,
    Math.min(100, 100 - Math.max(0, inputs.commandEnvelope.horizonTurns - 6) * 8)
  );
  factors.push({
    id: 'horizon_headroom',
    label: 'Planning horizon headroom',
    score: horizonHeadroom,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const convergenceIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const divergingSignals =
    inputs.stabilizationIndex.band === 'volatile' ||
    inputs.commandEnvelope.capacityBand === 'saturated' ||
    stabilizationIndexBlocksAutomation(inputs.stabilizationIndex) ||
    inputs.strategicAlignment.band === 'divergent';

  const band: Agent17ConvergenceIndexSnapshot['band'] =
    divergingSignals || convergenceIndex < 40
      ? 'diverging'
      : convergenceIndex >= 72
        ? 'aligned'
        : 'adjusting';

  return {
    convergenceIndex,
    band,
    factors,
    envelopeBand: inputs.commandEnvelope.capacityBand,
    stabilizationBand: inputs.stabilizationIndex.band,
    headline: `Convergence ${band} (${convergenceIndex}/100) · env ${inputs.commandEnvelope.capacityBand}`,
  };
}

export function convergenceIndexBlocksDirective(
  snapshot: Agent17ConvergenceIndexSnapshot
): boolean {
  return snapshot.band === 'diverging' || snapshot.convergenceIndex < 38;
}


// --- source: planning/mission-directive.ts ---
  Agent17CommandEnvelopeSnapshot,
  Agent17ConvergenceIndexSnapshot,
  Agent17IntentQueueSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17MissionDirectiveInputs {
  intentQueue: Agent17IntentQueueSnapshot;
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
}

export function buildAgent17MissionDirective(
  inputs: Agent17MissionDirectiveInputs
): Agent17MissionDirectiveSnapshot {
  const lanes: Agent17MissionDirectiveSnapshot['lanes'] = [];

  const objectiveLane: Agent17MissionDirectiveSnapshot['lanes'][number] = {
    id: 'objective_lane',
    label: 'Tracked objective',
    priority: 90,
    clearance: inputs.intentQueue.queueDepth >= 1 ? 'open' : 'conditional',
    weight: 30,
  };
  lanes.push(objectiveLane);

  lanes.push({
    id: 'plan_execution',
    label: 'Active plan execution',
    priority: 80,
    clearance: inputs.commandEnvelope.automationAllowed ? 'open' : 'conditional',
    weight: 25,
  });

  lanes.push({
    id: 'delegation_expansion',
    label: 'Delegation expansion',
    priority: 65,
    clearance:
      inputs.commandEnvelope.capacityBand === 'nominal' &&
      inputs.commandEnvelope.activeDelegationCount < inputs.commandEnvelope.delegationCap
        ? 'open'
        : 'conditional',
    weight: 20,
  });

  lanes.push({
    id: 'recovery_reserve',
    label: 'Recovery reserve',
    priority: 55,
    clearance:
      inputs.convergenceIndex.band === 'diverging' ? 'closed' : 'conditional',
    weight: 15,
  });

  lanes.push({
    id: 'coordination_sync',
    label: 'GI coordination sync',
    priority: 70,
    clearance: inputs.intentQueue.primaryIntentId ? 'open' : 'conditional',
    weight: 10,
  });

  const weightedClearance = lanes.reduce((n, lane) => {
    const laneScore =
      lane.clearance === 'open' ? 100 : lane.clearance === 'conditional' ? 55 : 10;
    return n + laneScore * (lane.weight / 100);
  }, 0);
  const totalWeight = lanes.reduce((n, lane) => n + lane.weight, 0);
  const clearanceScore = Math.max(
    0,
    Math.min(100, Math.round((weightedClearance / Math.max(1, totalWeight)) * 100))
  );

  const heldSignals =
    convergenceIndexBlocksDirective(inputs.convergenceIndex) ||
    inputs.commandEnvelope.capacityBand === 'saturated' ||
    lanes.some(l => l.clearance === 'closed');

  const band: Agent17MissionDirectiveSnapshot['band'] = heldSignals
    ? 'held'
    : clearanceScore >= 70 && inputs.convergenceIndex.band === 'aligned'
      ? 'cleared'
      : 'conditional';

  const primaryLaneId =
    lanes.find(l => l.clearance === 'open')?.id ??
    lanes.sort((a, b) => b.priority - a.priority)[0]?.id ??
    null;

  const executionAllowed =
    band !== 'held' &&
    inputs.commandEnvelope.automationAllowed &&
    !convergenceIndexBlocksDirective(inputs.convergenceIndex) &&
    !commandEnvelopeNeedsThrottle(inputs.commandEnvelope);

  return {
    clearanceScore,
    band,
    lanes,
    primaryLaneId,
    executionAllowed,
    headline: `Directive ${band} (${clearanceScore}/100) · ${lanes.length} lanes`,
  };
}

export function missionDirectiveBlocksExecution(
  snapshot: Agent17MissionDirectiveSnapshot
): boolean {
  return snapshot.band === 'held' || !snapshot.executionAllowed;
}


// --- source: planning/directive-synthesis.ts ---
  Agent17ConvergenceIndexSnapshot,
  Agent17DirectiveSynthesisSnapshot,
  Agent17IntentQueueSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17DirectiveSynthesisInputs {
  missionDirective: Agent17MissionDirectiveSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
  intentQueue: Agent17IntentQueueSnapshot;
}

export function buildAgent17DirectiveSynthesis(
  inputs: Agent17DirectiveSynthesisInputs
): Agent17DirectiveSynthesisSnapshot {
  const factors: Agent17DirectiveSynthesisSnapshot['factors'] = [];

  factors.push({
    id: 'directive_clearance',
    label: 'Mission directive clearance',
    score: inputs.missionDirective.clearanceScore,
    weight: 35,
  });

  factors.push({
    id: 'convergence',
    label: 'Ops convergence',
    score: inputs.convergenceIndex.convergenceIndex,
    weight: 30,
  });

  const intentCoverage =
    inputs.intentQueue.queueDepth >= 3
      ? 92
      : inputs.intentQueue.queueDepth >= 1
        ? 72
        : 40;
  factors.push({
    id: 'intent_coverage',
    label: 'Intent queue coverage',
    score: intentCoverage,
    weight: 20,
  });

  const laneOpenRatio = Math.round(
    (inputs.missionDirective.lanes.filter(l => l.clearance === 'open').length /
      Math.max(1, inputs.missionDirective.lanes.length)) *
      100
  );
  factors.push({
    id: 'lane_open_ratio',
    label: 'Open directive lanes',
    score: laneOpenRatio,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const synthesisIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const lockedSignals =
    inputs.missionDirective.band === 'held' ||
    inputs.convergenceIndex.band === 'diverging' ||
    convergenceIndexBlocksDirective(inputs.convergenceIndex);

  const band: Agent17DirectiveSynthesisSnapshot['band'] = lockedSignals
    ? 'locked'
    : synthesisIndex >= 62 &&
        (inputs.missionDirective.band === 'cleared' ||
          inputs.missionDirective.band === 'conditional')
      ? 'ready'
      : 'pending';

  return {
    synthesisIndex,
    band,
    factors,
    directiveBand: inputs.missionDirective.band,
    convergenceBand: inputs.convergenceIndex.band,
    headline: `Synthesis ${band} (${synthesisIndex}/100) · dir ${inputs.missionDirective.band}`,
  };
}

export function directiveSynthesisBlocksAdvance(
  snapshot: Agent17DirectiveSynthesisSnapshot
): boolean {
  return snapshot.band === 'locked' || snapshot.synthesisIndex < 36;
}


// --- source: planning/execution-closure.ts ---
  Agent17DirectiveSynthesisSnapshot,
  Agent17ExecutionClosureSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17ExecutionClosureInputs {
  directiveSynthesis: Agent17DirectiveSynthesisSnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
  missionDirective: Agent17MissionDirectiveSnapshot;
}

export function buildAgent17ExecutionClosure(
  inputs: Agent17ExecutionClosureInputs
): Agent17ExecutionClosureSnapshot {
  const checkpoints: Agent17ExecutionClosureSnapshot['checkpoints'] = [];

  checkpoints.push({
    id: 'synthesis_ready',
    label: 'Directive synthesis ready',
    satisfied: inputs.directiveSynthesis.band === 'ready',
    weight: 30,
  });

  checkpoints.push({
    id: 'pacing_gate',
    label: 'Execution pacing gate open',
    satisfied:
      inputs.executionPacing.canAdvanceActiveStep &&
      inputs.executionPacing.pacingBand !== 'throttled',
    weight: 25,
  });

  checkpoints.push({
    id: 'directive_exec',
    label: 'Mission directive allows execution',
    satisfied: inputs.missionDirective.executionAllowed,
    weight: 25,
  });

  checkpoints.push({
    id: 'turn_budget',
    label: 'Turn budget available',
    satisfied: inputs.executionPacing.turnBudgetRemaining >= 1,
    weight: 10,
  });

  checkpoints.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    satisfied: inputs.executionPacing.verificationGateOpen,
    weight: 10,
  });

  const weighted = checkpoints.reduce(
    (n, c) => n + (c.satisfied ? 100 : 15) * (c.weight / 100),
    0
  );
  const totalWeight = checkpoints.reduce((n, c) => n + c.weight, 0);
  const closureScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stepsReadyToClose = Math.max(
    0,
    inputs.executionPacing.stepsRemaining -
      (inputs.executionPacing.pacingBand === 'throttled' ? 2 : 0)
  );

  const sealedSignals =
    directiveSynthesisBlocksAdvance(inputs.directiveSynthesis) ||
    inputs.missionDirective.band === 'held';

  const narrowSignals =
    !sealedSignals &&
    (closureScore < 62 ||
      !inputs.executionPacing.canAdvanceActiveStep ||
      inputs.directiveSynthesis.band === 'pending');

  const band: Agent17ExecutionClosureSnapshot['band'] = sealedSignals
    ? 'sealed'
    : narrowSignals
      ? 'narrow'
      : 'open';

  const automationClearance =
    band === 'open' &&
    inputs.missionDirective.executionAllowed &&
    !directiveSynthesisBlocksAdvance(inputs.directiveSynthesis);

  return {
    closureScore,
    band,
    checkpoints,
    stepsReadyToClose,
    automationClearance,
    headline: `Closure ${band} (${closureScore}/100) · ${checkpoints.filter(c => c.satisfied).length}/${checkpoints.length} checks`,
  };
}

export function executionClosureBlocksAdvance(
  snapshot: Agent17ExecutionClosureSnapshot
): boolean {
  return snapshot.band === 'sealed' || !snapshot.automationClearance;
}


// --- source: planning/cadence-lattice.ts ---
  Agent17CadenceLatticeSnapshot,
  Agent17DirectiveSynthesisSnapshot,
  Agent17ExecutionClosureSnapshot,
  Agent17ExecutionPacingSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17CadenceLatticeInputs {
  executionClosure: Agent17ExecutionClosureSnapshot;
  directiveSynthesis: Agent17DirectiveSynthesisSnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
}

export function buildAgent17CadenceLattice(
  inputs: Agent17CadenceLatticeInputs
): Agent17CadenceLatticeSnapshot {
  const factors: Agent17CadenceLatticeSnapshot['factors'] = [];

  factors.push({
    id: 'closure_score',
    label: 'Execution closure',
    score: inputs.executionClosure.closureScore,
    weight: 35,
  });

  factors.push({
    id: 'synthesis_index',
    label: 'Directive synthesis',
    score: inputs.directiveSynthesis.synthesisIndex,
    weight: 30,
  });

  const pacingScore =
    inputs.executionPacing.pacingBand === 'urgent'
      ? 88
      : inputs.executionPacing.pacingBand === 'steady'
        ? 72
        : 38;
  factors.push({
    id: 'pacing_band',
    label: 'Execution pacing band',
    score: pacingScore,
    weight: 20,
  });

  const budgetScore = Math.max(
    0,
    Math.min(100, inputs.executionPacing.turnBudgetRemaining * 12)
  );
  factors.push({
    id: 'turn_budget',
    label: 'Turn budget headroom',
    score: budgetScore,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const cadenceIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stalledSignals =
    inputs.executionClosure.band === 'sealed' ||
    inputs.directiveSynthesis.band === 'locked' ||
    directiveSynthesisBlocksAdvance(inputs.directiveSynthesis);

  const band: Agent17CadenceLatticeSnapshot['band'] = stalledSignals
    ? 'stalled'
    : cadenceIndex >= 62 &&
        (inputs.executionClosure.band === 'open' ||
          inputs.executionClosure.band === 'narrow') &&
        (inputs.directiveSynthesis.band === 'ready' ||
          inputs.directiveSynthesis.band === 'pending')
      ? 'flowing'
      : 'steady';

  return {
    cadenceIndex,
    band,
    factors,
    closureBand: inputs.executionClosure.band,
    synthesisBand: inputs.directiveSynthesis.band,
    headline: `Cadence ${band} (${cadenceIndex}/100) · closure ${inputs.executionClosure.band}`,
  };
}

export function cadenceLatticeBlocksRun(snapshot: Agent17CadenceLatticeSnapshot): boolean {
  return snapshot.band === 'stalled' || snapshot.cadenceIndex < 34;
}


// --- source: planning/readiness-gate.ts ---
  Agent17CadenceLatticeSnapshot,
  Agent17CoordinationBrief,
  Agent17HandoffReadinessSnapshot,
  Agent17ReadinessGateSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17ReadinessGateInputs {
  cadenceLattice: Agent17CadenceLatticeSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  coordinationBrief: Agent17CoordinationBrief;
}

export function buildAgent17ReadinessGate(
  inputs: Agent17ReadinessGateInputs
): Agent17ReadinessGateSnapshot {
  const signals: Agent17ReadinessGateSnapshot['signals'] = [];

  signals.push({
    id: 'cadence_index',
    label: 'Cadence lattice index',
    value: inputs.cadenceLattice.cadenceIndex,
    unit: 'index',
  });

  signals.push({
    id: 'handoff_score',
    label: 'Handoff readiness score',
    value: inputs.handoffReadiness.readinessScore,
    unit: 'index',
  });

  signals.push({
    id: 'brief_sections',
    label: 'Coordination brief sections',
    value: inputs.coordinationBrief.sections.length,
    unit: 'index',
  });

  signals.push({
    id: 'blocker_count',
    label: 'Handoff blockers',
    value: inputs.handoffReadiness.blockers.length,
    unit: 'index',
  });

  signals.push({
    id: 'gi_tags',
    label: 'GI handoff tags',
    value: inputs.coordinationBrief.giHandoffTags.length,
    unit: 'index',
  });

  const handoffReady =
    !handoffReadinessBlocked(inputs.handoffReadiness) &&
    inputs.handoffReadiness.readinessScore >= 55;

  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        inputs.cadenceLattice.cadenceIndex * 0.45 +
          inputs.handoffReadiness.readinessScore * 0.35 +
          Math.min(100, inputs.coordinationBrief.sections.length * 18) * 0.2
      )
    )
  );

  const stopSignals =
    cadenceLatticeBlocksRun(inputs.cadenceLattice) ||
    handoffReadinessBlocked(inputs.handoffReadiness) ||
    inputs.cadenceLattice.band === 'stalled';

  const band: Agent17ReadinessGateSnapshot['band'] = stopSignals
    ? 'stop'
    : readinessScore >= 68 &&
        handoffReady &&
        inputs.cadenceLattice.band !== 'stalled'
      ? 'go'
      : 'caution';

  const runAllowed =
    band === 'go' &&
    handoffReady &&
    !cadenceLatticeBlocksRun(inputs.cadenceLattice);

  return {
    readinessScore,
    band,
    signals,
    handoffReady,
    runAllowed,
    headline: `Readiness ${band} (${readinessScore}/100) · ${signals.length} signals`,
  };
}

export function readinessGateBlocksRun(snapshot: Agent17ReadinessGateSnapshot): boolean {
  return snapshot.band === 'stop' || !snapshot.runAllowed;
}


// --- source: planning/pulse-index.ts ---
  Agent17CadenceLatticeSnapshot,
  Agent17CommandPostureSnapshot,
  Agent17PulseIndexSnapshot,
  Agent17ReadinessGateSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17PulseIndexInputs {
  readinessGate: Agent17ReadinessGateSnapshot;
  cadenceLattice: Agent17CadenceLatticeSnapshot;
  commandPosture: Agent17CommandPostureSnapshot;
}

export function buildAgent17PulseIndex(
  inputs: Agent17PulseIndexInputs
): Agent17PulseIndexSnapshot {
  const factors: Agent17PulseIndexSnapshot['factors'] = [];

  factors.push({
    id: 'readiness_score',
    label: 'Readiness gate score',
    score: inputs.readinessGate.readinessScore,
    weight: 35,
  });

  factors.push({
    id: 'cadence_index',
    label: 'Cadence lattice index',
    score: inputs.cadenceLattice.cadenceIndex,
    weight: 30,
  });

  factors.push({
    id: 'posture_index',
    label: 'Command posture index',
    score: inputs.commandPosture.postureIndex,
    weight: 25,
  });

  const runBonus = inputs.readinessGate.runAllowed ? 85 : 45;
  factors.push({
    id: 'run_clearance',
    label: 'Run clearance',
    score: runBonus,
    weight: 10,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const pulseIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const flatSignals =
    inputs.readinessGate.band === 'stop' ||
    inputs.cadenceLattice.band === 'stalled' ||
    readinessGateBlocksRun(inputs.readinessGate) ||
    cadenceLatticeBlocksRun(inputs.cadenceLattice);

  const band: Agent17PulseIndexSnapshot['band'] = flatSignals
    ? 'flat'
    : pulseIndex >= 68 &&
        inputs.readinessGate.band === 'go' &&
        inputs.cadenceLattice.band === 'flowing'
      ? 'strong'
      : 'moderate';

  return {
    pulseIndex,
    band,
    factors,
    readinessBand: inputs.readinessGate.band,
    cadenceBand: inputs.cadenceLattice.cadenceBand,
    headline: `Pulse ${band} (${pulseIndex}/100) · ready ${inputs.readinessGate.band}`,
  };
}

export function pulseIndexBlocksContinuity(snapshot: Agent17PulseIndexSnapshot): boolean {
  return snapshot.band === 'flat' || snapshot.pulseIndex < 35;
}


// --- source: planning/continuity-bridge.ts ---
  Agent17ContinuityBridgeSnapshot,
  Agent17PulseIndexSnapshot,
  Agent17ResilienceScorecard,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export interface Agent17ContinuityBridgeInputs {
  pulseIndex: Agent17PulseIndexSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  verificationPolicy: Agent17VerificationPolicySnapshot;
}

export function buildAgent17ContinuityBridge(
  inputs: Agent17ContinuityBridgeInputs
): Agent17ContinuityBridgeSnapshot {
  const links: Agent17ContinuityBridgeSnapshot['links'] = [];

  links.push({
    id: 'pulse_resilience',
    label: 'Pulse to resilience mesh',
    connected:
      inputs.pulseIndex.pulseIndex >= 50 &&
      inputs.resilienceScorecard.compositeIndex >= 45,
    weight: 30,
  });

  links.push({
    id: 'verify_pulse',
    label: 'Verification to pulse lane',
    connected:
      inputs.verificationPolicy.allowVerification &&
      inputs.pulseIndex.band !== 'flat',
    weight: 25,
  });

  links.push({
    id: 'resilience_verify',
    label: 'Resilience to verify policy',
    connected:
      inputs.resilienceScorecard.band !== 'fragile' ||
      inputs.verificationPolicy.allowVerification,
    weight: 20,
  });

  links.push({
    id: 'mitigation_pulse',
    label: 'Mitigation hints to pulse',
    connected: inputs.resilienceScorecard.mitigationHints.length >= 1,
    weight: 15,
  });

  links.push({
    id: 'policy_rules',
    label: 'Policy rules satisfied',
    connected: inputs.verificationPolicy.rules.filter(r => r.satisfied).length >= 2,
    weight: 10,
  });

  const weighted = links.reduce(
    (n, link) => n + (link.connected ? 100 : 20) * (link.weight / 100),
    0
  );
  const totalWeight = links.reduce((n, link) => n + link.weight, 0);
  const bridgeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const brokenSignals =
    pulseIndexBlocksContinuity(inputs.pulseIndex) ||
    (inputs.resilienceScorecard.band === 'fragile' &&
      !inputs.verificationPolicy.allowVerification);

  const band: Agent17ContinuityBridgeSnapshot['band'] = brokenSignals
    ? 'broken'
    : bridgeScore >= 70 && inputs.pulseIndex.band !== 'flat'
      ? 'linked'
      : 'partial';

  const continuityClearance =
    band === 'linked' &&
    !pulseIndexBlocksContinuity(inputs.pulseIndex) &&
    inputs.verificationPolicy.allowVerification;

  return {
    bridgeScore,
    band,
    links,
    pulseBand: inputs.pulseIndex.band,
    continuityClearance,
    headline: `Bridge ${band} (${bridgeScore}/100) · ${links.filter(l => l.connected).length}/${links.length} links`,
  };
}

export function continuityBridgeBlocksHandoff(
  snapshot: Agent17ContinuityBridgeSnapshot
): boolean {
  return snapshot.band === 'broken' || !snapshot.continuityClearance;
}


// --- source: planning/flux-index.ts ---
  Agent17ContinuityBridgeSnapshot,
  Agent17FluxIndexSnapshot,
  Agent17GovernanceAuditSnapshot,
  Agent17PulseIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17FluxIndexInputs {
  continuityBridge: Agent17ContinuityBridgeSnapshot;
  pulseIndex: Agent17PulseIndexSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
}

export function buildAgent17FluxIndex(inputs: Agent17FluxIndexInputs): Agent17FluxIndexSnapshot {
  const factors: Agent17FluxIndexSnapshot['factors'] = [];

  factors.push({
    id: 'bridge_score',
    label: 'Continuity bridge score',
    score: inputs.continuityBridge.bridgeScore,
    weight: 35,
  });

  factors.push({
    id: 'pulse_index',
    label: 'Operational pulse index',
    score: inputs.pulseIndex.pulseIndex,
    weight: 30,
  });

  const auditScore = Math.max(0, 100 - inputs.governanceAudit.openCriticalCount * 22);
  factors.push({
    id: 'governance_audit',
    label: 'Governance audit headroom',
    score: auditScore,
    weight: 20,
  });

  const bridgeLinkRatio = Math.round(
    (inputs.continuityBridge.links.filter(l => l.connected).length /
      Math.max(1, inputs.continuityBridge.links.length)) *
      100
  );
  factors.push({
    id: 'bridge_links',
    label: 'Bridge link ratio',
    score: bridgeLinkRatio,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const fluxIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const disruptedSignals =
    inputs.continuityBridge.band === 'broken' ||
    inputs.pulseIndex.band === 'flat' ||
    inputs.governanceAudit.band === 'breach' ||
    pulseIndexBlocksContinuity(inputs.pulseIndex) ||
    governanceAuditBlocksAutomation(inputs.governanceAudit);

  const band: Agent17FluxIndexSnapshot['band'] = disruptedSignals
    ? 'disrupted'
    : fluxIndex >= 62 &&
        inputs.continuityBridge.band !== 'broken' &&
        inputs.pulseIndex.band !== 'flat'
      ? 'coherent'
      : 'noisy';

  return {
    fluxIndex,
    band,
    factors,
    bridgeBand: inputs.continuityBridge.band,
    governanceBand: inputs.governanceAudit.band,
    headline: `Flux ${band} (${fluxIndex}/100) · bridge ${inputs.continuityBridge.band}`,
  };
}

export function fluxIndexBlocksSeal(snapshot: Agent17FluxIndexSnapshot): boolean {
  return snapshot.band === 'disrupted' || snapshot.fluxIndex < 33;
}


// --- source: planning/integrity-seal.ts ---
  Agent17FluxIndexSnapshot,
  Agent17IntegritySealSnapshot,
  Agent17RollbackAssuranceSnapshot,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export interface Agent17IntegritySealInputs {
  fluxIndex: Agent17FluxIndexSnapshot;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
  verificationPolicy: Agent17VerificationPolicySnapshot;
}

export function buildAgent17IntegritySeal(
  inputs: Agent17IntegritySealInputs
): Agent17IntegritySealSnapshot {
  const facets: Agent17IntegritySealSnapshot['facets'] = [];

  facets.push({
    id: 'flux_coherent',
    label: 'Flux coherence lane',
    intact: inputs.fluxIndex.band === 'coherent' || inputs.fluxIndex.band === 'noisy',
    weight: 30,
  });

  facets.push({
    id: 'assurance_score',
    label: 'Rollback assurance score',
    intact: inputs.rollbackAssurance.assuranceScore >= 45,
    weight: 25,
  });

  facets.push({
    id: 'verify_open',
    label: 'Verification policy open',
    intact: inputs.verificationPolicy.allowVerification,
    weight: 20,
  });

  facets.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    intact: !inputs.rollbackAssurance.restoreRecommended,
    weight: 15,
  });

  facets.push({
    id: 'policy_rules',
    label: 'Policy rules satisfied',
    intact: inputs.verificationPolicy.rules.filter(r => r.satisfied).length >= 2,
    weight: 10,
  });

  const weighted = facets.reduce(
    (n, f) => n + (f.intact ? 100 : 18) * (f.weight / 100),
    0
  );
  const totalWeight = facets.reduce((n, f) => n + f.weight, 0);
  const sealScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const breachedSignals =
    fluxIndexBlocksSeal(inputs.fluxIndex) ||
    inputs.rollbackAssurance.band === 'exposed' ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17IntegritySealSnapshot['band'] = breachedSignals
    ? 'breached'
    : sealScore >= 72 &&
        inputs.fluxIndex.band === 'coherent' &&
        !fluxIndexBlocksSeal(inputs.fluxIndex)
      ? 'trusted'
      : 'conditional';

  const commitAllowed =
    band === 'trusted' &&
    inputs.verificationPolicy.allowVerification &&
    !fluxIndexBlocksSeal(inputs.fluxIndex);

  return {
    sealScore,
    band,
    facets,
    fluxBand: inputs.fluxIndex.band,
    commitAllowed,
    headline: `Seal ${band} (${sealScore}/100) · ${facets.filter(f => f.intact).length}/${facets.length} facets`,
  };
}

export function integritySealBlocksCommit(snapshot: Agent17IntegritySealSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.commitAllowed;
}


// --- source: planning/commit-lattice.ts ---
  Agent17CommitLatticeSnapshot,
  Agent17EscalationMatrixSnapshot,
  Agent17FluxIndexSnapshot,
  Agent17IntegritySealSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17CommitLatticeInputs {
  integritySeal: Agent17IntegritySealSnapshot;
  fluxIndex: Agent17FluxIndexSnapshot;
  escalationMatrix: Agent17EscalationMatrixSnapshot;
}

export function buildAgent17CommitLattice(
  inputs: Agent17CommitLatticeInputs
): Agent17CommitLatticeSnapshot {
  const strands: Agent17CommitLatticeSnapshot['strands'] = [];

  strands.push({
    id: 'seal_score',
    label: 'Integrity seal score',
    tension: Math.max(0, 100 - inputs.integritySeal.sealScore),
    weight: 35,
  });

  strands.push({
    id: 'flux_index',
    label: 'Operational flux index',
    tension: Math.max(0, 100 - inputs.fluxIndex.fluxIndex),
    weight: 30,
  });

  const escalationTension = Math.min(100, inputs.escalationMatrix.escalationIndex);
  strands.push({
    id: 'escalation_index',
    label: 'Escalation index tension',
    tension: escalationTension,
    weight: 20,
  });

  const rungTension = Math.min(100, inputs.escalationMatrix.triggeredCount * 18);
  strands.push({
    id: 'rung_load',
    label: 'Escalation rung load',
    tension: rungTension,
    weight: 15,
  });

  const weighted = strands.reduce(
    (n, s) => n + Math.max(0, 100 - s.tension) * (s.weight / 100),
    0
  );
  const totalWeight = strands.reduce((n, s) => n + s.weight, 0);
  const latticeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const fragmentedSignals =
    inputs.integritySeal.band === 'breached' ||
    inputs.fluxIndex.band === 'disrupted' ||
    inputs.escalationMatrix.band === 'urgent' ||
    integritySealBlocksCommit(inputs.integritySeal) ||
    fluxIndexBlocksSeal(inputs.fluxIndex);

  const band: Agent17CommitLatticeSnapshot['band'] = fragmentedSignals
    ? 'fragmented'
    : latticeScore >= 60 &&
        (inputs.integritySeal.band === 'trusted' ||
          inputs.integritySeal.band === 'conditional') &&
        inputs.fluxIndex.band !== 'disrupted'
      ? 'bound'
      : 'flex';

  return {
    latticeScore,
    band,
    strands,
    sealBand: inputs.integritySeal.band,
    escalationBand: inputs.escalationMatrix.band,
    headline: `Lattice ${band} (${latticeScore}/100) · seal ${inputs.integritySeal.band}`,
  };
}

export function commitLatticeBlocksCovenant(snapshot: Agent17CommitLatticeSnapshot): boolean {
  return snapshot.band === 'fragmented' || snapshot.latticeScore < 32;
}


// --- source: planning/covenant-gate.ts ---
  Agent17CommitLatticeSnapshot,
  Agent17CovenantGateSnapshot,
  Agent17PlanHealthBand,
  Agent17RollbackAssuranceSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17CovenantGateInputs {
  commitLattice: Agent17CommitLatticeSnapshot;
  planHealth: Agent17PlanHealthBand;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
}

export function buildAgent17CovenantGate(
  inputs: Agent17CovenantGateInputs
): Agent17CovenantGateSnapshot {
  const clauses: Agent17CovenantGateSnapshot['clauses'] = [];

  clauses.push({
    id: 'lattice_bound',
    label: 'Commit lattice bound',
    upheld: inputs.commitLattice.band === 'bound' || inputs.commitLattice.band === 'flex',
    weight: 30,
  });

  clauses.push({
    id: 'plan_health',
    label: 'Plan health steady',
    upheld: inputs.planHealth.band === 'steady' || inputs.planHealth.band === 'strong',
    weight: 25,
  });

  clauses.push({
    id: 'assurance_score',
    label: 'Rollback assurance score',
    upheld: inputs.rollbackAssurance.assuranceScore >= 50,
    weight: 20,
  });

  clauses.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    upheld: !inputs.rollbackAssurance.restoreRecommended,
    weight: 15,
  });

  clauses.push({
    id: 'on_track',
    label: 'Plan on track flag',
    upheld: inputs.planHealth.onTrack,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.upheld ? 100 : 16) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const covenantScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    commitLatticeBlocksCovenant(inputs.commitLattice) ||
    inputs.rollbackAssurance.band === 'exposed' ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17CovenantGateSnapshot['band'] = voidSignals
    ? 'void'
    : covenantScore >= 70 &&
        inputs.commitLattice.band === 'bound' &&
        !commitLatticeBlocksCovenant(inputs.commitLattice)
      ? 'upheld'
      : 'conditional';

  const opsAllowed =
    band === 'upheld' &&
    inputs.planHealth.band !== 'critical' &&
    !commitLatticeBlocksCovenant(inputs.commitLattice);

  return {
    covenantScore,
    band,
    clauses,
    latticeBand: inputs.commitLattice.band,
    opsAllowed,
    headline: `Covenant ${band} (${covenantScore}/100) · ${clauses.filter(c => c.upheld).length}/${clauses.length} clauses`,
  };
}

export function covenantGateBlocksOps(snapshot: Agent17CovenantGateSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.opsAllowed;
}


// --- source: planning/mandate-weave.ts ---
  Agent17CommitLatticeSnapshot,
  Agent17CovenantGateSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17MandateWeaveInputs {
  covenantGate: Agent17CovenantGateSnapshot;
  commitLattice: Agent17CommitLatticeSnapshot;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17MandateWeave(
  inputs: Agent17MandateWeaveInputs
): Agent17MandateWeaveSnapshot {
  const threads: Agent17MandateWeaveSnapshot['threads'] = [];

  threads.push({
    id: 'covenant_score',
    label: 'Covenant gate score',
    strength: inputs.covenantGate.covenantScore,
    weight: 35,
  });

  threads.push({
    id: 'lattice_score',
    label: 'Commit lattice score',
    strength: inputs.commitLattice.latticeScore,
    weight: 30,
  });

  threads.push({
    id: 'alignment_index',
    label: 'Strategic alignment index',
    strength: inputs.strategicAlignment.alignmentIndex,
    weight: 25,
  });

  const clauseRatio = Math.round(
    (inputs.covenantGate.clauses.filter(c => c.upheld).length /
      Math.max(1, inputs.covenantGate.clauses.length)) *
      100
  );
  threads.push({
    id: 'clause_ratio',
    label: 'Covenant clause ratio',
    strength: clauseRatio,
    weight: 10,
  });

  const weighted = threads.reduce((n, t) => n + t.strength * (t.weight / 100), 0);
  const totalWeight = threads.reduce((n, t) => n + t.weight, 0);
  const weaveScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const frayedSignals =
    inputs.covenantGate.band === 'void' ||
    inputs.commitLattice.band === 'fragmented' ||
    inputs.strategicAlignment.band === 'divergent' ||
    commitLatticeBlocksCovenant(inputs.commitLattice);

  const band: Agent17MandateWeaveSnapshot['band'] = frayedSignals
    ? 'frayed'
    : weaveScore >= 65 &&
        (inputs.covenantGate.band === 'upheld' ||
          inputs.covenantGate.band === 'conditional') &&
        inputs.strategicAlignment.band !== 'divergent'
      ? 'aligned'
      : 'tensioned';

  return {
    weaveScore,
    band,
    threads,
    covenantBand: inputs.covenantGate.band,
    alignmentBand: inputs.strategicAlignment.band,
    headline: `Mandate ${band} (${weaveScore}/100) · covenant ${inputs.covenantGate.band}`,
  };
}

export function mandateWeaveBlocksSovereignty(snapshot: Agent17MandateWeaveSnapshot): boolean {
  return snapshot.band === 'frayed' || snapshot.weaveScore < 34;
}


// --- source: planning/sovereignty-lock.ts ---
  Agent17GovernanceAuditSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17SovereigntyLockSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17SovereigntyLockInputs {
  mandateWeave: Agent17MandateWeaveSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
}

export function buildAgent17SovereigntyLock(
  inputs: Agent17SovereigntyLockInputs
): Agent17SovereigntyLockSnapshot {
  const pins: Agent17SovereigntyLockSnapshot['pins'] = [];

  pins.push({
    id: 'weave_aligned',
    label: 'Mandate weave aligned',
    engaged: inputs.mandateWeave.band === 'aligned' || inputs.mandateWeave.band === 'tensioned',
    weight: 30,
  });

  pins.push({
    id: 'governance_compliant',
    label: 'Governance audit compliant',
    engaged:
      inputs.governanceAudit.band === 'compliant' ||
      inputs.governanceAudit.band === 'review',
    weight: 25,
  });

  pins.push({
    id: 'stabilization_stable',
    label: 'Stabilization lane stable',
    engaged:
      inputs.stabilizationIndex.band === 'stable' ||
      inputs.stabilizationIndex.band === 'adjusting',
    weight: 25,
  });

  pins.push({
    id: 'audit_score',
    label: 'Governance audit score',
    engaged: inputs.governanceAudit.auditScore >= 50,
    weight: 10,
  });

  pins.push({
    id: 'stabilization_index',
    label: 'Stabilization index headroom',
    engaged: inputs.stabilizationIndex.stabilizationIndex >= 45,
    weight: 10,
  });

  const weighted = pins.reduce(
    (n, p) => n + (p.engaged ? 100 : 14) * (p.weight / 100),
    0
  );
  const totalWeight = pins.reduce((n, p) => n + p.weight, 0);
  const lockScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const releasedSignals =
    mandateWeaveBlocksSovereignty(inputs.mandateWeave) ||
    inputs.governanceAudit.band === 'breach' ||
    inputs.stabilizationIndex.band === 'volatile';

  const band: Agent17SovereigntyLockSnapshot['band'] = releasedSignals
    ? 'released'
    : lockScore >= 70 &&
        inputs.mandateWeave.band === 'aligned' &&
        !mandateWeaveBlocksSovereignty(inputs.mandateWeave)
      ? 'secured'
      : 'conditional';

  const commandSovereignty =
    band === 'secured' &&
    !mandateWeaveBlocksSovereignty(inputs.mandateWeave) &&
    inputs.governanceAudit.band !== 'breach';

  return {
    lockScore,
    band,
    pins,
    weaveBand: inputs.mandateWeave.band,
    commandSovereignty,
    headline: `Sovereignty ${band} (${lockScore}/100) · ${pins.filter(p => p.engaged).length}/${pins.length} pins`,
  };
}

export function sovereigntyLockBlocksCommand(snapshot: Agent17SovereigntyLockSnapshot): boolean {
  return snapshot.band === 'released' || !snapshot.commandSovereignty;
}


// --- source: planning/authority-charter.ts ---
  Agent17AuthorityCharterSnapshot,
  Agent17CommandPostureSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17SovereigntyLockSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17AuthorityCharterInputs {
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
  mandateWeave: Agent17MandateWeaveSnapshot;
  commandPosture: Agent17CommandPostureSnapshot;
}

export function buildAgent17AuthorityCharter(
  inputs: Agent17AuthorityCharterInputs
): Agent17AuthorityCharterSnapshot {
  const articles: Agent17AuthorityCharterSnapshot['articles'] = [];

  articles.push({
    id: 'sovereignty_secured',
    label: 'Sovereignty lock engaged',
    ratified:
      inputs.sovereigntyLock.band === 'secured' ||
      inputs.sovereigntyLock.band === 'conditional',
    weight: 30,
  });

  articles.push({
    id: 'command_sovereignty',
    label: 'Command sovereignty asserted',
    ratified: inputs.sovereigntyLock.commandSovereignty,
    weight: 25,
  });

  articles.push({
    id: 'mandate_aligned',
    label: 'Mandate weave not frayed',
    ratified:
      inputs.mandateWeave.band === 'aligned' || inputs.mandateWeave.band === 'tensioned',
    weight: 20,
  });

  articles.push({
    id: 'posture_commanding',
    label: 'Command posture headroom',
    ratified:
      inputs.commandPosture.band === 'commanding' ||
      inputs.commandPosture.band === 'contested',
    weight: 15,
  });

  articles.push({
    id: 'posture_index',
    label: 'Posture index threshold',
    ratified: inputs.commandPosture.postureIndex >= 45,
    weight: 10,
  });

  const weighted = articles.reduce(
    (n, a) => n + (a.ratified ? 100 : 18) * (a.weight / 100),
    0
  );
  const totalWeight = articles.reduce((n, a) => n + a.weight, 0);
  const charterScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    sovereigntyLockBlocksCommand(inputs.sovereigntyLock) ||
    inputs.mandateWeave.band === 'frayed' ||
    inputs.commandPosture.band === 'degraded';

  const band: Agent17AuthorityCharterSnapshot['band'] = revokedSignals
    ? 'revoked'
    : charterScore >= 68 &&
        inputs.sovereigntyLock.band === 'secured' &&
        inputs.sovereigntyLock.commandSovereignty
      ? 'chartered'
      : 'provisional';

  const commandAuthority =
    band === 'chartered' &&
    inputs.sovereigntyLock.commandSovereignty &&
    !sovereigntyLockBlocksCommand(inputs.sovereigntyLock);

  return {
    charterScore,
    band,
    articles,
    lockBand: inputs.sovereigntyLock.band,
    weaveBand: inputs.mandateWeave.band,
    commandAuthority,
    headline: `Authority ${band} (${charterScore}/100) · ${articles.filter(a => a.ratified).length}/${articles.length} articles`,
  };
}

export function authorityCharterBlocksAccord(snapshot: Agent17AuthorityCharterSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.commandAuthority;
}


// --- source: planning/dispatch-accord.ts ---
  Agent17AuthorityCharterSnapshot,
  Agent17DelegationLadderSnapshot,
  Agent17DispatchAccordSnapshot,
  Agent17SovereigntyLockSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17DispatchAccordInputs {
  authorityCharter: Agent17AuthorityCharterSnapshot;
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
  delegationLadder: Agent17DelegationLadderSnapshot;
}

export function buildAgent17DispatchAccord(
  inputs: Agent17DispatchAccordInputs
): Agent17DispatchAccordSnapshot {
  const provisions: Agent17DispatchAccordSnapshot['provisions'] = [];

  provisions.push({
    id: 'charter_chartered',
    label: 'Authority charter chartered',
    active:
      inputs.authorityCharter.band === 'chartered' ||
      inputs.authorityCharter.band === 'provisional',
    weight: 30,
  });

  provisions.push({
    id: 'command_authority',
    label: 'Command authority granted',
    active: inputs.authorityCharter.commandAuthority,
    weight: 25,
  });

  provisions.push({
    id: 'ladder_balance',
    label: 'Delegation ladder balanced',
    active: !inputs.delegationLadder.imbalanceFlag,
    weight: 20,
  });

  provisions.push({
    id: 'ladder_slots',
    label: 'Delegation slots remaining',
    active: inputs.delegationLadder.rungs.some(r => r.slotsRemaining > 0),
    weight: 15,
  });

  provisions.push({
    id: 'sovereignty_lock',
    label: 'Sovereignty lock not released',
    active: !sovereigntyLockBlocksCommand(inputs.sovereigntyLock),
    weight: 10,
  });

  const weighted = provisions.reduce(
    (n, p) => n + (p.active ? 100 : 16) * (p.weight / 100),
    0
  );
  const totalWeight = provisions.reduce((n, p) => n + p.weight, 0);
  const accordScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    authorityCharterBlocksAccord(inputs.authorityCharter) ||
    sovereigntyLockBlocksCommand(inputs.sovereigntyLock);

  const band: Agent17DispatchAccordSnapshot['band'] = voidSignals
    ? 'void'
    : accordScore >= 70 &&
        inputs.authorityCharter.band === 'chartered' &&
        !authorityCharterBlocksAccord(inputs.authorityCharter)
      ? 'ratified'
      : 'provisional';

  const dispatchAllowed =
    band === 'ratified' &&
    inputs.authorityCharter.commandAuthority &&
    !authorityCharterBlocksAccord(inputs.authorityCharter);

  return {
    accordScore,
    band,
    provisions,
    charterBand: inputs.authorityCharter.band,
    dispatchAllowed,
    headline: `Dispatch ${band} (${accordScore}/100) · ${provisions.filter(p => p.active).length}/${provisions.length} provisions`,
  };
}

export function dispatchAccordBlocksDispatch(snapshot: Agent17DispatchAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.dispatchAllowed;
}


// --- source: planning/mobilization-index.ts ---
  Agent17CoordinationBrief,
  Agent17DispatchAccordSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17MobilizationIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17MobilizationIndexInputs {
  dispatchAccord: Agent17DispatchAccordSnapshot;
  coordinationBrief: Agent17CoordinationBrief;
  executionPacing: Agent17ExecutionPacingSnapshot;
}

export function buildAgent17MobilizationIndex(
  inputs: Agent17MobilizationIndexInputs
): Agent17MobilizationIndexSnapshot {
  const vectors: Agent17MobilizationIndexSnapshot['vectors'] = [];

  vectors.push({
    id: 'dispatch_ratified',
    label: 'Dispatch accord ratified or provisional',
    engaged:
      inputs.dispatchAccord.band === 'ratified' ||
      inputs.dispatchAccord.band === 'provisional',
    weight: 30,
  });

  vectors.push({
    id: 'dispatch_allowed',
    label: 'Dispatch lane open',
    engaged: inputs.dispatchAccord.dispatchAllowed && !dispatchAccordBlocksDispatch(inputs.dispatchAccord),
    weight: 25,
  });

  vectors.push({
    id: 'coordination_ready',
    label: 'Coordination brief GI-ready',
    engaged: coordinationBriefReadyForGi(inputs.coordinationBrief),
    weight: 20,
  });

  vectors.push({
    id: 'pacing_steady',
    label: 'Execution pacing not throttled',
    engaged:
      inputs.executionPacing.pacingBand !== 'throttled' &&
      inputs.executionPacing.canAdvanceActiveStep,
    weight: 15,
  });

  vectors.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    engaged: inputs.executionPacing.verificationGateOpen,
    weight: 10,
  });

  const weighted = vectors.reduce(
    (n, v) => n + (v.engaged ? 100 : 14) * (v.weight / 100),
    0
  );
  const totalWeight = vectors.reduce((n, v) => n + v.weight, 0);
  const mobilizationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stalledSignals =
    dispatchAccordBlocksDispatch(inputs.dispatchAccord) ||
    inputs.dispatchAccord.band === 'void' ||
    inputs.executionPacing.pacingBand === 'throttled';

  const band: Agent17MobilizationIndexSnapshot['band'] = stalledSignals
    ? 'stalled'
    : mobilizationScore >= 72 &&
        inputs.dispatchAccord.band === 'ratified' &&
        coordinationBriefReadyForGi(inputs.coordinationBrief)
      ? 'mobilized'
      : 'forming';

  const fieldReady =
    band === 'mobilized' &&
    inputs.dispatchAccord.dispatchAllowed &&
    !dispatchAccordBlocksDispatch(inputs.dispatchAccord);

  return {
    mobilizationScore,
    band,
    vectors,
    accordBand: inputs.dispatchAccord.band,
    pacingBand: inputs.executionPacing.pacingBand,
    fieldReady,
    headline: `Mobilization ${band} (${mobilizationScore}/100) · ${vectors.filter(v => v.engaged).length}/${vectors.length} vectors`,
  };
}

export function mobilizationIndexBlocksSummons(snapshot: Agent17MobilizationIndexSnapshot): boolean {
  return snapshot.band === 'stalled' || !snapshot.fieldReady;
}


// --- source: planning/execution-summons.ts ---
  Agent17DispatchAccordSnapshot,
  Agent17ExecutionSummonsSnapshot,
  Agent17MissionDirectiveSnapshot,
  Agent17MobilizationIndexSnapshot,
} from '../types/command-center-types.ts';

export interface Agent17ExecutionSummonsInputs {
  mobilizationIndex: Agent17MobilizationIndexSnapshot;
  dispatchAccord: Agent17DispatchAccordSnapshot;
  missionDirective: Agent17MissionDirectiveSnapshot;
}

export function buildAgent17ExecutionSummons(
  inputs: Agent17ExecutionSummonsInputs
): Agent17ExecutionSummonsSnapshot {
  const clauses: Agent17ExecutionSummonsSnapshot['clauses'] = [];

  clauses.push({
    id: 'mobilization_ready',
    label: 'Mobilization field-ready',
    satisfied: inputs.mobilizationIndex.fieldReady && !mobilizationIndexBlocksSummons(inputs.mobilizationIndex),
    weight: 30,
  });

  clauses.push({
    id: 'mobilization_band',
    label: 'Mobilization mobilized or forming',
    satisfied:
      inputs.mobilizationIndex.band === 'mobilized' ||
      inputs.mobilizationIndex.band === 'forming',
    weight: 25,
  });

  clauses.push({
    id: 'directive_active',
    label: 'Mission directive not held',
    satisfied: inputs.missionDirective.band !== 'held',
    weight: 20,
  });

  clauses.push({
    id: 'accord_dispatch',
    label: 'Dispatch accord allows dispatch',
    satisfied:
      inputs.dispatchAccord.dispatchAllowed && !dispatchAccordBlocksDispatch(inputs.dispatchAccord),
    weight: 15,
  });

  clauses.push({
    id: 'directive_priority',
    label: 'Mission directive clearance headroom',
    satisfied: inputs.missionDirective.clearanceScore >= 40,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.satisfied ? 100 : 12) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const summonsScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    mobilizationIndexBlocksSummons(inputs.mobilizationIndex) ||
    dispatchAccordBlocksDispatch(inputs.dispatchAccord) ||
    inputs.missionDirective.band === 'held';

  const band: Agent17ExecutionSummonsSnapshot['band'] = revokedSignals
    ? 'revoked'
    : summonsScore >= 70 &&
        inputs.mobilizationIndex.band === 'mobilized' &&
        !mobilizationIndexBlocksSummons(inputs.mobilizationIndex)
      ? 'issued'
      : 'pending';

  const executionAuthorized =
    band === 'issued' &&
    inputs.mobilizationIndex.fieldReady &&
    inputs.dispatchAccord.dispatchAllowed;

  return {
    summonsScore,
    band,
    clauses,
    mobilizationBand: inputs.mobilizationIndex.band,
    directiveBand: inputs.missionDirective.band,
    executionAuthorized,
    headline: `Summons ${band} (${summonsScore}/100) · ${clauses.filter(c => c.satisfied).length}/${clauses.length} clauses`,
  };
}

export function executionSummonsBlocksField(snapshot: Agent17ExecutionSummonsSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.executionAuthorized;
}


// --- source: planning/planning-orchestrator.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17PlanningSuggestion,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  buildAgent17DelegationAnalytics,
  pickAgent17DelegateKindFromAnalytics,
} from './delegation-analytics.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from './template-selector.ts';

export function buildAgent17PlanningSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  const plan = ops.activePlan;
  const health = assessAgent17PlanHealth(plan, state, actorId);
  const blocked = plan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const recovery = pickAgent17RecoveryTemplateId(signals, blocked);
  if (recovery && (blocked || planHealthNeedsRecovery(health))) {
    return {
      kind: 'recovery',
      templateId: recovery.templateId,
      headline: `Recovery lane: ${recovery.lane}`,
      rationale: recovery.rationale,
      confidence: Math.min(0.95, 0.55 + (signals[0]?.severity ?? 40) / 200),
    };
  }
  const routing = rankAgent17TemplateCandidates(state, settings, actorId);
  const templateId = routing.candidateTemplateIds[0];
  if (templateId && (!plan || health.band === 'steady' || health.band === 'strong')) {
    return {
      kind: 'template',
      templateId,
      headline: `Route ${routing.matchedCategory} → ${templateId}`,
      rationale: `Category ${routing.matchedCategory} from objective and state cues.`,
      confidence: 0.72,
    };
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegateKind = pickAgent17DelegateKindFromAnalytics(analytics, recommendedDelegateKind);
  if (plan && plan.completionPercent < 100) {
    return {
      kind: 'delegate',
      delegateKind,
      headline: `Delegate via ${delegateKind}`,
      rationale: 'Active plan incomplete; delegation analytics favor this target.',
      confidence: 0.65,
    };
  }
  return {
    kind: 'hold',
    headline: 'Hold planning posture',
    rationale: 'No recovery, template, or delegation action required this turn.',
    confidence: 0.5,
  };
}

export function buildAgent17PlanningDepthSnapshot(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningDepthSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const planHealth = assessAgent17PlanHealth(ops.activePlan, state, actorId);
  const templateRouting = rankAgent17TemplateCandidates(state, settings, actorId);
  const delegationAnalytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegationLadder = buildAgent17DelegationLadder(
    delegationAnalytics,
    settings,
    recommendedDelegateKind
  );
  const planLedger = summarizeAgent17PlanLedger(ops, state);
  let suggestion = buildAgent17PlanningSuggestion(
    ops,
    state,
    settings,
    actorId,
    recommendedDelegateKind
  );
  suggestion = refineAgent17DelegationSuggestion(
    ops,
    state,
    settings,
    actorId,
    suggestion,
    recommendedDelegateKind
  );
  const intentQueue = buildAgent17IntentQueue(ops, state, settings, actorId, planHealth);
  const verificationPolicy = buildAgent17VerificationPolicy(ops, state, actorId);
  const core = {
    turn,
    actorId,
    planHealth,
    suggestion,
    templateRouting,
    delegationAnalytics,
    delegationLadder,
    planLedger,
    catalogDepth: summarizeAgent17CatalogDepth(),
  };
  const coordinationBrief = buildAgent17CoordinationBrief(
    core,
    intentQueue,
    verificationPolicy,
    ops,
    state,
    settings
  );
  const executionPacing = buildAgent17ExecutionPacing(
    ops,
    state,
    planHealth,
    verificationPolicy
  );
  const resilienceScorecard = buildAgent17ResilienceScorecard(
    ops,
    state,
    actorId,
    planHealth,
    verificationPolicy
  );
  const strategicAlignment = buildAgent17StrategicAlignment(
    ops,
    state,
    settings,
    actorId,
    intentQueue
  );
  const handoffReadiness = buildAgent17HandoffReadiness({
    coordinationBrief,
    verificationPolicy,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
  });
  const commandPosture = buildAgent17CommandPosture({
    planHealth,
    handoffReadiness,
    resilienceScorecard,
    strategicAlignment,
  });
  const governanceAudit = buildAgent17GovernanceAudit(ops, settings, verificationPolicy);
  const escalationMatrix = buildAgent17EscalationMatrix({
    commandPosture,
    governanceAudit,
    handoffReadiness,
  });
  const rollbackAssurance = buildAgent17RollbackAssurance(ops, planHealth, governanceAudit);
  const stabilizationIndex = buildAgent17StabilizationIndex({
    escalationMatrix,
    rollbackAssurance,
  });
  const commandEnvelope = buildAgent17CommandEnvelope({
    ops,
    executionPacing,
    stabilizationIndex,
  });
  const convergenceIndex = buildAgent17ConvergenceIndex({
    commandEnvelope,
    stabilizationIndex,
    strategicAlignment,
  });
  const missionDirective = buildAgent17MissionDirective({
    intentQueue,
    commandEnvelope,
    convergenceIndex,
  });
  const directiveSynthesis = buildAgent17DirectiveSynthesis({
    missionDirective,
    convergenceIndex,
    intentQueue,
  });
  const executionClosure = buildAgent17ExecutionClosure({
    directiveSynthesis,
    executionPacing,
    missionDirective,
  });
  const cadenceLattice = buildAgent17CadenceLattice({
    executionClosure,
    directiveSynthesis,
    executionPacing,
  });
  const readinessGate = buildAgent17ReadinessGate({
    cadenceLattice,
    handoffReadiness,
    coordinationBrief,
  });
  const pulseIndex = buildAgent17PulseIndex({
    readinessGate,
    cadenceLattice,
    commandPosture,
  });
  const continuityBridge = buildAgent17ContinuityBridge({
    pulseIndex,
    resilienceScorecard,
    verificationPolicy,
  });
  const fluxIndex = buildAgent17FluxIndex({
    continuityBridge,
    pulseIndex,
    governanceAudit,
  });
  const integritySeal = buildAgent17IntegritySeal({
    fluxIndex,
    rollbackAssurance,
    verificationPolicy,
  });
  const commitLattice = buildAgent17CommitLattice({
    integritySeal,
    fluxIndex,
    escalationMatrix,
  });
  const covenantGate = buildAgent17CovenantGate({
    commitLattice,
    planHealth,
    rollbackAssurance,
  });
  const mandateWeave = buildAgent17MandateWeave({
    covenantGate,
    commitLattice,
    strategicAlignment,
  });
  const sovereigntyLock = buildAgent17SovereigntyLock({
    mandateWeave,
    governanceAudit,
    stabilizationIndex,
  });
  const authorityCharter = buildAgent17AuthorityCharter({
    sovereigntyLock,
    mandateWeave,
    commandPosture,
  });
  const dispatchAccord = buildAgent17DispatchAccord({
    authorityCharter,
    sovereigntyLock,
    delegationLadder,
  });
  const mobilizationIndex = buildAgent17MobilizationIndex({
    dispatchAccord,
    coordinationBrief,
    executionPacing,
  });
  const executionSummons = buildAgent17ExecutionSummons({
    mobilizationIndex,
    dispatchAccord,
    missionDirective,
  });
  return {
    ...core,
    intentQueue,
    verificationPolicy,
    coordinationBrief,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
    handoffReadiness,
    commandPosture,
    governanceAudit,
    escalationMatrix,
    rollbackAssurance,
    stabilizationIndex,
    commandEnvelope,
    convergenceIndex,
    missionDirective,
    directiveSynthesis,
    executionClosure,
    cadenceLattice,
    readinessGate,
    pulseIndex,
    continuityBridge,
    fluxIndex,
    integritySeal,
    commitLattice,
    covenantGate,
    mandateWeave,
    sovereigntyLock,
    authorityCharter,
    dispatchAccord,
    mobilizationIndex,
    executionSummons,
  };
}

export function attachAgent17PlanningDepth(
  snapshot: Acc17OperationsSnapshot,
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): Acc17OperationsSnapshot {
  return {
    ...snapshot,
    planningDepth: buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      actorId,
      snapshot.recommendedDelegateKind
    ),
  };
}


// --- source: evaluation/operations-evaluator.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Acc17V94DeepContextSlice,
  Agent17ContextAdapters,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  acc17DelegateProject,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function buildAcc17V94DeepContextBundle(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  adapters: Agent17ContextAdapters = {}
): import('../types/command-center-types.ts').Acc17V94DeepContextBundle {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {
      id: actorId,
    };
  const slices: Acc17V94DeepContextSlice[] = [];
  const pushSlice = (
    key: string,
    label: string,
    summary: string,
    weight: number,
    tags: string[] = []
  ) => {
    if (summary) slices.push({ key, label, summary, weight, tags });
  };

  try {
    const objective = adapters.resolveObjective
      ? adapters.resolveObjective(state, settings, actor, state.playerTrackedObjective)
      : defaultObjectiveResolver(state, settings, actorId);
    if (objective?.title) {
      pushSlice(
        'objective',
        'Current objective',
        `${objective.title} — ${objective.description || ''}`,
        10,
        ['intent']
      );
    }
  } catch {
    /* noop */
  }

  if (adapters.classifyAttention) {
    try {
      const attention = adapters.classifyAttention(state, settings, actor);
      if (attention?.label) {
        pushSlice('attention', 'Attention', `${attention.label}: ${attention.detail || ''}`, 9, [
          'risk',
        ]);
      }
    } catch {
      /* noop */
    }
  }

  const gi3 = state.gi3Strategy;
  if (gi3?.headline) pushSlice('gi3', 'Strategy', String(gi3.headline), 8, ['gi3']);
  const planner = state.strategyPlannerState?.activePlan;
  if (planner?.title) pushSlice('planner', 'Planner', `Blueprint: ${planner.title}`, 7, ['planner']);
  pushSlice(
    'economy',
    'Economy',
    `Cash $${Number(actor.money || 0).toLocaleString()}`,
    5,
    ['economy']
  );
  slices.sort((a, b) => b.weight - a.weight);
  return {
    actorId,
    turn,
    day,
    fingerprint,
    headline: slices[0]?.summary || 'Deep context ready.',
    slices: slices.slice(0, 12),
    objectiveTitle: slices.find(s => s.key === 'objective')?.summary.split(' — ')[0],
    attentionLabel: slices.find(s => s.key === 'attention')?.label,
    strategyHeadline: slices.find(s => s.key === 'gi3')?.summary,
  };
}

export function evaluateAcc17CommandCenterOperations(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  persisted: Acc17CommandCenterOpsState,
  adapters: Agent17ContextAdapters = {}
): { ops: Acc17CommandCenterOpsState; snapshot: Acc17OperationsSnapshot } {
  const enabled = persisted.enabled !== false && settings?.commandCenterSettings?.enabled !== false;
  const deepContext = buildAcc17V94DeepContextBundle(state, settings, actorId, adapters);
  let ops = sanitizeAcc17CommandCenterOpsState(persisted);
  if (!enabled) {
    return {
      ops,
      snapshot: {
        deepContext,
        activePlan: null,
        delegatedProjects: [],
        pendingVerificationCount: 0,
        verifiedStepsThisTurn: 0,
        blockedSteps: [],
        recommendedDelegateKind: 'copilot',
      },
    };
  }
  if (!ops.activePlan) {
    const fromObjective = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      actorId,
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    if (fromObjective) ops = { ...ops, activePlan: fromObjective };
  }
  const prevFp = ops.lastContextFingerprint || '';
  if (ops.activePlan) {
    const { plan, logEntries, fingerprint } = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan,
      state,
      actorId,
      prevFp
    );
    ops = {
      ...ops,
      activePlan: plan,
      lastContextFingerprint: fingerprint,
      lastContextBundle: deepContext,
      verificationLog: [...ops.verificationLog, ...logEntries].slice(-200),
    };
    if (ops.delegatedProjects.length === 0 && plan.completionPercent < 100) {
      ops = {
        ...ops,
        delegatedProjects: [
          acc17DelegateProject(ops, plan, 'copilot', 'copilot_session', 'assisted'),
        ],
      };
    }
    const recovery = maybeApplyAgent17RecoveryPath(ops, state, actorId);
    if (recovery.applied && recovery.ops.activePlan) {
      ops = recovery.ops;
      if (ops.delegatedProjects.length === 0 && ops.activePlan.completionPercent < 100) {
        ops = {
          ...ops,
          delegatedProjects: [
            acc17DelegateProject(ops, ops.activePlan, 'copilot', 'copilot_session', 'assisted'),
          ],
        };
      }
    }
  } else {
    ops = { ...ops, lastContextFingerprint: deepContext.fingerprint, lastContextBundle: deepContext };
  }
  const blockedSteps =
    ops.activePlan?.steps.filter(s => s.status === 'blocked' || s.status === 'failed') || [];
  const pendingVerificationCount =
    ops.activePlan?.steps.filter(s => s.status === 'in_progress').length || 0;
  const verifiedStepsThisTurn = ops.verificationLog.filter(
    e => e.turn === (state.turnCounter || 1) && e.verified
  ).length;
  const autonomy = settings?.aiCommunicationAutonomyLevel;
  const recommendedDelegateKind: Acc17DelegateTargetKind =
    autonomy === 'delegated'
      ? 'team_os'
      : autonomy === 'assisted'
        ? 'copilot'
        : 'strategy_planner';
  return {
    ops,
    snapshot: attachAgent17PlanningDepth(
      {
        deepContext,
        activePlan: ops.activePlan,
        delegatedProjects: ops.delegatedProjects,
        pendingVerificationCount,
        verifiedStepsThisTurn,
        blockedSteps,
        recommendedDelegateKind,
      },
      ops,
      state,
      settings,
      actorId
    ),
  };
}


// --- source: rollback/rollback-controller.ts ---

const MAX_CHECKPOINTS = 16;

export interface Agent17RollbackController {
  capture(label: string, turn: number, ops: Acc17CommandCenterOpsState): Agent17RollbackCheckpoint;
  rollbackToLatest(): Acc17CommandCenterOpsState | null;
  rollbackTo(checkpointId: string): Acc17CommandCenterOpsState | null;
  listCheckpoints(): Agent17RollbackCheckpoint[];
  clear(): void;
}

export function createAgent17RollbackController(): Agent17RollbackController {
  const stack: Agent17RollbackCheckpoint[] = [];

  const trim = () => {
    while (stack.length > MAX_CHECKPOINTS) stack.shift();
  };

  return {
    capture(label, turn, ops) {
      const checkpoint: Agent17RollbackCheckpoint = {
        id: `agent17_cp_${Date.now()}_${stack.length}`,
        label,
        createdAt: Date.now(),
        turn,
        ops: sanitizeAcc17CommandCenterOpsState(ops),
      };
      stack.push(checkpoint);
      trim();
      return checkpoint;
    },
    rollbackToLatest() {
      const cp = stack.pop();
      return cp ? sanitizeAcc17CommandCenterOpsState(cp.ops) : null;
    },
    rollbackTo(checkpointId) {
      const idx = stack.findIndex(c => c.id === checkpointId);
      if (idx < 0) return null;
      const [cp] = stack.splice(idx, 1);
      return sanitizeAcc17CommandCenterOpsState(cp.ops);
    },
    listCheckpoints() {
      return [...stack];
    },
    clear() {
      stack.length = 0;
    },
  };
}

/** Migrate unknown persisted shapes before evaluation (forward-only; rollback handles undo). */
export function migrateAgent17OpsPayload(input: unknown): Acc17CommandCenterOpsState {
  if (!input || typeof input !== 'object') {
    return sanitizeAcc17CommandCenterOpsState(input);
  }
  const obj = input as Record<string, unknown>;
  if (obj.version === 2) {
    return sanitizeAcc17CommandCenterOpsState({ ...obj, version: 1 });
  }
  return sanitizeAcc17CommandCenterOpsState(input);
}


// --- source: goals/goal-registry.ts ---

/** Measurable Agent 17 delivery goals — verified by `validation/goal-verification.ts`, not prose-only. */
export const AGENT17_GOAL_REGISTRY: Agent17GoalDefinition[] = [
  {
    id: 'G17-001',
    title: 'Ops state sanitizer pins version to v1',
    category: 'validation',
    acceptance: 'Unknown version fields downgrade to version 1 with safe defaults.',
    severity: 'critical',
  },
  {
    id: 'G17-002',
    title: 'Fingerprint reacts to canonical state deltas',
    category: 'planning',
    acceptance: 'Money and lastExecutedAction changes produce distinct fingerprints.',
    severity: 'critical',
  },
  {
    id: 'G17-003',
    title: 'Objective spawns multi-step plan',
    category: 'planning',
    acceptance: 'Tracked objective yields ≥3 steps with in_progress head.',
    severity: 'critical',
  },
  {
    id: 'G17-004',
    title: 'Verification gate on unchanged fingerprint',
    category: 'validation',
    acceptance: 'No verification log entries when fingerprint unchanged.',
    severity: 'major',
  },
  {
    id: 'G17-005',
    title: 'Deep context slices populated',
    category: 'telemetry',
    acceptance: 'Evaluation snapshot includes ≥1 weighted context slice.',
    severity: 'major',
  },
  {
    id: 'G17-006',
    title: 'Auto-delegate when plan active',
    category: 'planning',
    acceptance: 'First evaluation creates copilot delegated project when plan incomplete.',
    severity: 'major',
  },
  {
    id: 'G17-007',
    title: 'Template catalog instantiates plans',
    category: 'planning',
    acceptance: 'Each catalog template id returns a non-empty step list.',
    severity: 'major',
  },
  {
    id: 'G17-008',
    title: 'Rollback restores prior ops checkpoint',
    category: 'rollback',
    acceptance: 'Rollback controller restores activePlan id from checkpoint.',
    severity: 'critical',
  },
  {
    id: 'G17-009',
    title: 'Checkpoint stack bounded',
    category: 'rollback',
    acceptance: 'Store retains at most 16 checkpoints (FIFO eviction).',
    severity: 'minor',
  },
  {
    id: 'G17-010',
    title: 'Disabled command center skips mutation',
    category: 'validation',
    acceptance: 'enabled=false yields empty plan and zero delegations.',
    severity: 'major',
  },
  {
    id: 'G17-011',
    title: 'Autonomy maps delegate recommendation',
    category: 'integration',
    acceptance: 'delegated→team_os, assisted→copilot, advisory→strategy_planner.',
    severity: 'minor',
  },
  {
    id: 'G17-012',
    title: 'Modular dev harness reports pass/fail counts',
    category: 'integration',
    acceptance: 'Dev test report exposes totalTests and success boolean.',
    severity: 'critical',
  },
  {
    id: 'G17-013',
    title: 'Deep templates expose prerequisite chains',
    category: 'planning',
    acceptance: 'Six-step capital program wires prerequisiteStepIds on late phases.',
    severity: 'major',
  },
  {
    id: 'G17-014',
    title: 'Recovery signals drive template selection',
    category: 'planning',
    acceptance: 'Blocked plan uses highest-severity lane template (severity-sorted signals).',
    severity: 'major',
  },
  {
    id: 'G17-015',
    title: 'Blocked plan recovery replan in evaluator',
    category: 'validation',
    acceptance: 'evaluateAcc17CommandCenterOperations sets recovery objectiveSource.',
    severity: 'critical',
  },
  {
    id: 'G17-016',
    title: 'Planning depth snapshot on evaluation',
    category: 'telemetry',
    acceptance: 'Snapshot includes planningDepth with catalogDepth.templateCount ≥ 12.',
    severity: 'major',
  },
  {
    id: 'G17-017',
    title: 'Template routing by objective category',
    category: 'planning',
    acceptance: 'Trade-flavored objective routes to trade category candidates.',
    severity: 'major',
  },
  {
    id: 'G17-018',
    title: 'Delegation analytics matrix complete',
    category: 'integration',
    acceptance: 'buildAgent17DelegationAnalytics returns five delegate kinds.',
    severity: 'minor',
  },
  {
    id: 'G17-019',
    title: 'Delegation ladder on planning depth',
    category: 'planning',
    acceptance: 'planningDepth.delegationLadder has five rungs and headline.',
    severity: 'major',
  },
  {
    id: 'G17-020',
    title: 'Plan ledger summarizes ops history',
    category: 'telemetry',
    acceptance: 'planLedger lists delegate entries when projects exist.',
    severity: 'major',
  },
  {
    id: 'G17-021',
    title: 'Delegation depth score bounded',
    category: 'validation',
    acceptance: 'computeAgent17DelegationDepthScore returns 0–100.',
    severity: 'minor',
  },
  {
    id: 'G17-022',
    title: 'Intent queue on planning depth',
    category: 'planning',
    acceptance: 'intentQueue.queueDepth ≥ 1 when objective present.',
    severity: 'major',
  },
  {
    id: 'G17-023',
    title: 'Verification policy gates',
    category: 'validation',
    acceptance: 'Unchanged fingerprint blocks allowVerification.',
    severity: 'major',
  },
  {
    id: 'G17-024',
    title: 'GI coordination brief attached',
    category: 'integration',
    acceptance: 'coordinationBrief has ≥3 sections and GI handoff tags.',
    severity: 'major',
  },
  {
    id: 'G17-025',
    title: 'Execution pacing on planning depth',
    category: 'planning',
    acceptance: 'executionPacing reports turnBudgetRemaining and pacingBand.',
    severity: 'major',
  },
  {
    id: 'G17-026',
    title: 'Resilience scorecard composite bounded',
    category: 'telemetry',
    acceptance: 'resilienceScorecard compositeIndex is 0–100 with mitigation hints.',
    severity: 'major',
  },
  {
    id: 'G17-027',
    title: 'Pacing respects verification gates',
    category: 'validation',
    acceptance: 'Unchanged fingerprint yields throttled pacing or closed gate.',
    severity: 'major',
  },
  {
    id: 'G17-028',
    title: 'Strategic alignment on planning depth',
    category: 'planning',
    acceptance: 'strategicAlignment reports alignmentIndex 0–100 with band.',
    severity: 'major',
  },
  {
    id: 'G17-029',
    title: 'Handoff readiness checklist complete',
    category: 'integration',
    acceptance: 'handoffReadiness exposes ≥5 weighted checks and readinessScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-030',
    title: 'Handoff blocked on verify hold',
    category: 'validation',
    acceptance: 'Closed verification gate yields blocked handoff or verify_gate blocker.',
    severity: 'major',
  },
  {
    id: 'G17-031',
    title: 'Command posture on planning depth',
    category: 'telemetry',
    acceptance: 'commandPosture reports postureIndex 0–100 with commanding/contested/degraded band.',
    severity: 'major',
  },
  {
    id: 'G17-032',
    title: 'Governance audit findings complete',
    category: 'validation',
    acceptance: 'governanceAudit exposes ≥4 findings and auditScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-033',
    title: 'Governance breach blocks automation',
    category: 'integration',
    acceptance: 'Critical delegation breaches yield breach band or governanceAuditBlocksAutomation.',
    severity: 'major',
  },
  {
    id: 'G17-034',
    title: 'Escalation matrix on planning depth',
    category: 'telemetry',
    acceptance: 'escalationMatrix reports escalationIndex 0–100 with none/watch/urgent band.',
    severity: 'major',
  },
  {
    id: 'G17-035',
    title: 'Rollback assurance checklist complete',
    category: 'rollback',
    acceptance: 'rollbackAssurance exposes ≥4 weighted checks and assuranceScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-036',
    title: 'Urgent escalation blocks automation',
    category: 'integration',
    acceptance: 'Governance breach yields urgent band or escalationMatrixBlocksAutomation.',
    severity: 'major',
  },
  {
    id: 'G17-037',
    title: 'Stabilization index on planning depth',
    category: 'telemetry',
    acceptance: 'stabilizationIndex reports stabilizationIndex 0–100 with stable/adjusting/volatile band.',
    severity: 'major',
  },
  {
    id: 'G17-038',
    title: 'Command envelope signals complete',
    category: 'telemetry',
    acceptance: 'commandEnvelope exposes ≥5 capacity signals and horizonTurns ≥ 1.',
    severity: 'major',
  },
  {
    id: 'G17-039',
    title: 'Volatile stabilization throttles envelope',
    category: 'integration',
    acceptance: 'Volatile band or saturated envelope yields commandEnvelopeNeedsThrottle.',
    severity: 'major',
  },
  {
    id: 'G17-040',
    title: 'Convergence index on planning depth',
    category: 'telemetry',
    acceptance: 'convergenceIndex reports convergenceIndex 0–100 with aligned/adjusting/diverging band.',
    severity: 'major',
  },
  {
    id: 'G17-041',
    title: 'Mission directive lanes complete',
    category: 'telemetry',
    acceptance: 'missionDirective exposes ≥5 directive lanes and clearanceScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-042',
    title: 'Diverging convergence holds directive',
    category: 'integration',
    acceptance: 'Diverging band or held directive yields missionDirectiveBlocksExecution.',
    severity: 'major',
  },
  {
    id: 'G17-043',
    title: 'Directive synthesis on planning depth',
    category: 'telemetry',
    acceptance: 'directiveSynthesis reports synthesisIndex 0–100 with ready/pending/locked band.',
    severity: 'major',
  },
  {
    id: 'G17-044',
    title: 'Execution closure checkpoints complete',
    category: 'telemetry',
    acceptance: 'executionClosure exposes ≥5 closure checkpoints and closureScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-045',
    title: 'Locked synthesis seals closure',
    category: 'integration',
    acceptance: 'Locked synthesis or sealed closure yields executionClosureBlocksAdvance.',
    severity: 'major',
  },
  {
    id: 'G17-046',
    title: 'Cadence lattice on planning depth',
    category: 'telemetry',
    acceptance: 'cadenceLattice reports cadenceIndex 0–100 with flowing/steady/stalled band.',
    severity: 'major',
  },
  {
    id: 'G17-047',
    title: 'Readiness gate signals complete',
    category: 'telemetry',
    acceptance: 'readinessGate exposes ≥5 readiness signals and readinessScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-048',
    title: 'Stalled cadence stops readiness run',
    category: 'integration',
    acceptance: 'Stalled cadence or stop band yields readinessGateBlocksRun.',
    severity: 'major',
  },
  {
    id: 'G17-049',
    title: 'Pulse index on planning depth',
    category: 'telemetry',
    acceptance: 'pulseIndex reports pulseIndex 0–100 with strong/moderate/flat band.',
    severity: 'major',
  },
  {
    id: 'G17-050',
    title: 'Continuity bridge links complete',
    category: 'telemetry',
    acceptance: 'continuityBridge exposes ≥5 bridge links and bridgeScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-051',
    title: 'Flat pulse breaks continuity bridge',
    category: 'integration',
    acceptance: 'Flat pulse or broken bridge yields continuityBridgeBlocksHandoff.',
    severity: 'major',
  },
  {
    id: 'G17-052',
    title: 'Flux index on planning depth',
    category: 'telemetry',
    acceptance: 'fluxIndex reports fluxIndex 0–100 with coherent/noisy/disrupted band.',
    severity: 'major',
  },
  {
    id: 'G17-053',
    title: 'Integrity seal facets complete',
    category: 'telemetry',
    acceptance: 'integritySeal exposes ≥5 seal facets and sealScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-054',
    title: 'Disrupted flux breaches integrity seal',
    category: 'integration',
    acceptance: 'Disrupted flux or breached seal yields integritySealBlocksCommit.',
    severity: 'major',
  },
  {
    id: 'G17-055',
    title: 'Commit lattice on planning depth',
    category: 'telemetry',
    acceptance: 'commitLattice reports latticeScore 0–100 with bound/flex/fragmented band.',
    severity: 'major',
  },
  {
    id: 'G17-056',
    title: 'Covenant gate clauses complete',
    category: 'telemetry',
    acceptance: 'covenantGate exposes ≥5 covenant clauses and covenantScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-057',
    title: 'Fragmented lattice voids covenant',
    category: 'integration',
    acceptance: 'Fragmented lattice or void covenant yields covenantGateBlocksOps.',
    severity: 'major',
  },
  {
    id: 'G17-058',
    title: 'Mandate weave on planning depth',
    category: 'telemetry',
    acceptance: 'mandateWeave reports weaveScore 0–100 with aligned/tensioned/frayed band.',
    severity: 'major',
  },
  {
    id: 'G17-059',
    title: 'Sovereignty lock pins complete',
    category: 'telemetry',
    acceptance: 'sovereigntyLock exposes ≥5 lock pins and lockScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-060',
    title: 'Frayed mandate releases sovereignty',
    category: 'integration',
    acceptance: 'Frayed weave or released lock yields sovereigntyLockBlocksCommand.',
    severity: 'major',
  },
  {
    id: 'G17-061',
    title: 'Authority charter on planning depth',
    category: 'telemetry',
    acceptance: 'authorityCharter reports charterScore 0–100 with chartered/provisional/revoked band.',
    severity: 'major',
  },
  {
    id: 'G17-062',
    title: 'Dispatch accord provisions complete',
    category: 'telemetry',
    acceptance: 'dispatchAccord exposes ≥5 provisions and accordScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-063',
    title: 'Released sovereignty voids dispatch accord',
    category: 'integration',
    acceptance: 'Released lock or revoked charter yields dispatchAccordBlocksDispatch.',
    severity: 'major',
  },
  {
    id: 'G17-064',
    title: 'Mobilization index on planning depth',
    category: 'telemetry',
    acceptance: 'mobilizationIndex reports mobilizationScore 0–100 with mobilized/forming/stalled band.',
    severity: 'major',
  },
  {
    id: 'G17-065',
    title: 'Execution summons clauses complete',
    category: 'telemetry',
    acceptance: 'executionSummons exposes ≥5 clauses and summonsScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-066',
    title: 'Void dispatch stalls mobilization summons',
    category: 'integration',
    acceptance: 'Void accord or stalled mobilization yields executionSummonsBlocksField.',
    severity: 'major',
  },
];

export function getAgent17GoalById(id: string): Agent17GoalDefinition | undefined {
  return AGENT17_GOAL_REGISTRY.find(g => g.id === id);
}

export function listAgent17GoalIds(): string[] {
  return AGENT17_GOAL_REGISTRY.map(g => g.id);
}


// --- source: validation/goal-verification.ts ---
  Acc17CommandCenterOpsState,
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17GoalVerificationResult,
  Agent17SettingsSlice,
  Agent17ValidationReport,
} from '../types/command-center-types.ts';
  createDefaultAcc17CommandCenterOpsState,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
} from '../planning/recovery-paths.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17MissionDirective,
  missionDirectiveBlocksExecution,
} from '../planning/mission-directive.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17ExecutionClosure,
  executionClosureBlocksAdvance,
} from '../planning/execution-closure.ts';
  buildAgent17CadenceLattice,
  cadenceLatticeBlocksRun,
} from '../planning/cadence-lattice.ts';
  buildAgent17ReadinessGate,
  readinessGateBlocksRun,
} from '../planning/readiness-gate.ts';
  buildAgent17PulseIndex,
  pulseIndexBlocksContinuity,
} from '../planning/pulse-index.ts';
  buildAgent17ContinuityBridge,
  continuityBridgeBlocksHandoff,
} from '../planning/continuity-bridge.ts';
  buildAgent17FluxIndex,
  fluxIndexBlocksSeal,
} from '../planning/flux-index.ts';
  buildAgent17IntegritySeal,
  integritySealBlocksCommit,
} from '../planning/integrity-seal.ts';
  buildAgent17CommitLattice,
  commitLatticeBlocksCovenant,
} from '../planning/commit-lattice.ts';
  buildAgent17CovenantGate,
  covenantGateBlocksOps,
} from '../planning/covenant-gate.ts';
  buildAgent17MandateWeave,
  mandateWeaveBlocksSovereignty,
} from '../planning/mandate-weave.ts';
  buildAgent17SovereigntyLock,
  sovereigntyLockBlocksCommand,
} from '../planning/sovereignty-lock.ts';
  buildAgent17AuthorityCharter,
  authorityCharterBlocksAccord,
} from '../planning/authority-charter.ts';
  buildAgent17DispatchAccord,
  dispatchAccordBlocksDispatch,
} from '../planning/dispatch-accord.ts';
  buildAgent17MobilizationIndex,
  mobilizationIndexBlocksSummons,
} from '../planning/mobilization-index.ts';
  buildAgent17ExecutionSummons,
  executionSummonsBlocksField,
} from '../planning/execution-summons.ts';
  Agent17RollbackController,
  createAgent17RollbackController,
} from '../rollback/rollback-controller.ts';

export interface GoalVerificationContext {
  rollback: Agent17RollbackController;
  lastDevReport?: Agent17DevTestReport;
}

function result(goalId: string, passed: boolean, evidence: string): Agent17GoalVerificationResult {
  return { goalId, passed, evidence, measuredAt: Date.now() };
}

export function verifyAgent17Goals(ctx: GoalVerificationContext): Agent17ValidationReport {
  const goalResults: Agent17GoalVerificationResult[] = [];

  const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
  const baseState: Agent17GameStateSlice = {
    turnCounter: 3,
    day: 3,
    player: actor,
    actorsById: { player: actor },
    playerTrackedObjective: {
      id: 'c1',
      sourceType: 'contract',
      sourceId: 'c1',
      title: 'Test Contract',
    },
    lastExecutedAction: { type: 'wait' },
  };
  const settings: Agent17SettingsSlice = {
    aiCommunicationAutonomyLevel: 'assisted',
    commandCenterSettings: { enabled: true },
  };

  // G17-001
  goalResults.push(
    result(
      'G17-001',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1,
      'sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1'
    )
  );

  // G17-002
  const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const mutated: Agent17GameStateSlice = {
    ...baseState,
    player: { ...actor, money: 5100 },
    lastExecutedAction: { type: 'travel' },
  };
  const fp2 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
  goalResults.push(result('G17-002', fp1 !== fp2, `fp1=${fp1} fp2=${fp2}`));

  // G17-003
  let ops = createDefaultAcc17CommandCenterOpsState();
  const eval1 = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  ops = eval1.ops;
  goalResults.push(
    result(
      'G17-003',
      !!ops.activePlan && ops.activePlan.steps.length >= 3,
      `steps=${ops.activePlan?.steps.length ?? 0}`
    )
  );

  // G17-004
  ops = { ...ops, lastContextFingerprint: fp1 };
  const noAdvance = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  const prevLogLen = ops.verificationLog.length;
  const newEntries = noAdvance.ops.verificationLog.length - prevLogLen;
  goalResults.push(result('G17-004', newEntries === 0, `newLogEntries=${newEntries}`));

  // G17-005
  goalResults.push(
    result(
      'G17-005',
      eval1.snapshot.deepContext.slices.length >= 1,
      `slices=${eval1.snapshot.deepContext.slices.length}`
    )
  );

  // G17-006
  goalResults.push(
    result(
      'G17-006',
      eval1.snapshot.delegatedProjects.length >= 1,
      `delegated=${eval1.snapshot.delegatedProjects.length}`
    )
  );

  // G17-007
  const tplOk = AGENT17_PROJECT_TEMPLATE_CATALOG.every(
    t => (acc17InstantiatePlanFromTemplate(t.id, baseState, 'player')?.steps.length || 0) > 0
  );
  goalResults.push(result('G17-007', tplOk, `templates=${AGENT17_PROJECT_TEMPLATE_CATALOG.length}`));

  // G17-008 / G17-009 rollback
  ctx.rollback.clear();
  ctx.rollback.capture('pre-mutation', 3, ops);
  const tampered: Acc17CommandCenterOpsState = {
    ...ops,
    activePlan: ops.activePlan
      ? { ...ops.activePlan, id: 'tampered_plan_id' }
      : null,
  };
  const restored = ctx.rollback.rollbackToLatest();
  goalResults.push(
    result(
      'G17-008',
      restored?.activePlan?.id === ops.activePlan?.id,
      `restoredId=${restored?.activePlan?.id}`
    )
  );
  for (let i = 0; i < 20; i++) {
    ctx.rollback.capture(`cp-${i}`, i, createDefaultAcc17CommandCenterOpsState());
  }
  goalResults.push(result('G17-009', ctx.rollback.listCheckpoints().length <= 16, `count=${ctx.rollback.listCheckpoints().length}`));

  // G17-010
  const disabledEval = evaluateAcc17CommandCenterOperations(
    baseState,
    { commandCenterSettings: { enabled: false } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-010',
      !disabledEval.snapshot.activePlan && disabledEval.snapshot.delegatedProjects.length === 0,
      'disabled snapshot empty'
    )
  );

  // G17-011
  const recDelegated = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'delegated' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAssisted = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'assisted' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAdvisory = evaluateAcc17CommandCenterOperations(
    baseState,
    { aiCommunicationAutonomyLevel: 'advisory', commandCenterSettings: { enabled: true } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  goalResults.push(
    result(
      'G17-011',
      recDelegated === 'team_os' && recAssisted === 'copilot' && recAdvisory === 'strategy_planner',
      `${recDelegated}/${recAssisted}/${recAdvisory}`
    )
  );

  // G17-012
  const harnessOk =
    !!ctx.lastDevReport &&
    ctx.lastDevReport.totalTests > 0 &&
    typeof ctx.lastDevReport.success === 'boolean';
  goalResults.push(
    result(
      'G17-012',
      harnessOk === true,
      ctx.lastDevReport
        ? `tests=${ctx.lastDevReport.totalTests} success=${ctx.lastDevReport.success}`
        : 'no dev report'
    )
  );

  const crisisState: Agent17GameStateSlice = {
    turnCounter: 2,
    day: 2,
    player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    actorsById: {
      player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    },
  };
  const deepPlan = acc17InstantiatePlanFromTemplate(
    'agent17_tpl_deep_capital_program',
    crisisState,
    'player'
  );
  goalResults.push(
    result(
      'G17-013',
      (deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.join(',') || 'none'
    )
  );

  const sig = detectAgent17RecoverySignals(crisisState, 'player');
  const rec = pickAgent17RecoveryTemplateId(sig, true);
  goalResults.push(
    result(
      'G17-014',
      rec?.templateId === 'agent17_tpl_supply_deep_recovery' && rec?.lane === 'supply_collapse',
      `${rec?.lane}/${rec?.templateId}`
    )
  );

  let blockedOps = createDefaultAcc17CommandCenterOpsState();
  const tradePlan = acc17InstantiatePlanFromTemplate('agent17_tpl_trade_arbitrage', crisisState, 'player');
  if (tradePlan) {
    tradePlan.steps[2] = { ...tradePlan.steps[2], status: 'blocked', blockerReason: 'test' };
    blockedOps = { ...blockedOps, activePlan: tradePlan };
  }
  const recoveryEval = maybeApplyAgent17RecoveryPath(blockedOps, crisisState, 'player');
  goalResults.push(
    result(
      'G17-015',
      recoveryEval.applied && recoveryEval.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      recoveryEval.ops.activePlan?.objectiveSource || 'not applied'
    )
  );

  const tradeState: Agent17GameStateSlice = {
    turnCounter: 4,
    day: 4,
    player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' },
    actorsById: { player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' } },
    playerTrackedObjective: {
      title: 'Trade market expansion',
      sourceType: 'contract',
      sourceId: 't1',
    },
  };
  const tradeRoute = rankAgent17TemplateCandidates(tradeState, settings, 'player');
  goalResults.push(
    result(
      'G17-017',
      tradeRoute.matchedCategory === 'trade' &&
        tradeRoute.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${tradeRoute.matchedCategory}/${tradeRoute.candidateTemplateIds[0]}`
    )
  );

  const depthEval = evaluateAcc17CommandCenterOperations(
    baseState,
    settings,
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-016',
      (depthEval.snapshot.planningDepth?.catalogDepth.templateCount ?? 0) >= 12,
      String(depthEval.snapshot.planningDepth?.catalogDepth.templateCount)
    )
  );

  const delegationRows = buildAgent17DelegationAnalytics(
    depthEval.ops,
    settings
  );
  goalResults.push(
    result('G17-018', delegationRows.length === 5, String(delegationRows.length))
  );

  const ladder = buildAgent17DelegationLadder(delegationRows, settings, 'copilot');
  goalResults.push(
    result(
      'G17-019',
      ladder.rungs.length === 5 && ladder.headline.length > 0,
      String(ladder.rungs.length)
    )
  );

  const ledger = summarizeAgent17PlanLedger(depthEval.ops, baseState);
  goalResults.push(
    result(
      'G17-020',
      ledger.entries.length >= 0 && typeof ledger.lastFingerprint === 'string',
      `entries=${ledger.entries.length}`
    )
  );

  const depthScore = computeAgent17DelegationDepthScore(depthEval.ops, settings, 'copilot');
  goalResults.push(
    result('G17-021', depthScore >= 0 && depthScore <= 100, String(depthScore))
  );

  const intentQ = buildAgent17IntentQueue(
    depthEval.ops,
    baseState,
    settings,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player')
  );
  goalResults.push(
    result('G17-022', intentQ.queueDepth >= 1, String(intentQ.queueDepth))
  );

  const fp = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pol = buildAgent17VerificationPolicy(
    { ...depthEval.ops, lastContextFingerprint: fp },
    baseState,
    'player'
  );
  goalResults.push(
    result('G17-023', pol.allowVerification === false, pol.blockingRuleIds.join(','))
  );

  const brief = depthEval.snapshot.planningDepth?.coordinationBrief;
  goalResults.push(
    result(
      'G17-024',
      !!brief && coordinationBriefReadyForGi(brief),
      brief?.giHandoffTags?.join(',') || 'none'
    )
  );

  const pacing = depthEval.snapshot.planningDepth?.executionPacing;
  goalResults.push(
    result(
      'G17-025',
      !!pacing &&
        typeof pacing.turnBudgetRemaining === 'number' &&
        (pacing.pacingBand === 'steady' ||
          pacing.pacingBand === 'urgent' ||
          pacing.pacingBand === 'throttled'),
      pacing?.pacingBand || 'none'
    )
  );

  const scorecard = depthEval.snapshot.planningDepth?.resilienceScorecard;
  goalResults.push(
    result(
      'G17-026',
      !!scorecard &&
        scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.mitigationHints.length >= 1,
      String(scorecard?.compositeIndex)
    )
  );

  const fpHold = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pacingHeld = buildAgent17ExecutionPacing(
    { ...depthEval.ops, lastContextFingerprint: fpHold },
    baseState,
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpHold },
      baseState,
      'player'
    )
  );
  goalResults.push(
    result(
      'G17-027',
      pacingHeld.pacingBand === 'throttled' || !pacingHeld.verificationGateOpen,
      `${pacingHeld.pacingBand} gate=${pacingHeld.verificationGateOpen}`
    )
  );

  const strat = depthEval.snapshot.planningDepth?.strategicAlignment;
  goalResults.push(
    result(
      'G17-028',
      !!strat &&
        strat.alignmentIndex >= 0 &&
        strat.alignmentIndex <= 100 &&
        (strat.band === 'aligned' || strat.band === 'drifting' || strat.band === 'divergent'),
      `${strat?.alignmentIndex}/${strat?.band}`
    )
  );

  const handoff = depthEval.snapshot.planningDepth?.handoffReadiness;
  goalResults.push(
    result(
      'G17-029',
      !!handoff &&
        handoff.checks.length >= 5 &&
        handoff.readinessScore >= 0 &&
        handoff.readinessScore <= 100,
      `checks=${handoff?.checks.length} score=${handoff?.readinessScore}`
    )
  );

  const fpBlock = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const blockedHandoff = buildAgent17HandoffReadiness({
    coordinationBrief: brief!,
    verificationPolicy: buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpBlock },
      baseState,
      'player'
    ),
    executionPacing: pacingHeld,
    resilienceScorecard: scorecard!,
    strategicAlignment: strat!,
  });
  goalResults.push(
    result(
      'G17-030',
      blockedHandoff.blockers.includes('verify_gate') || handoffReadinessBlocked(blockedHandoff),
      blockedHandoff.blockers.join(',')
    )
  );

  const posture = depthEval.snapshot.planningDepth?.commandPosture;
  goalResults.push(
    result(
      'G17-031',
      !!posture &&
        posture.postureIndex >= 0 &&
        posture.postureIndex <= 100 &&
        (posture.band === 'commanding' ||
          posture.band === 'contested' ||
          posture.band === 'degraded'),
      `${posture?.postureIndex}/${posture?.band}`
    )
  );

  const govAudit = depthEval.snapshot.planningDepth?.governanceAudit;
  goalResults.push(
    result(
      'G17-032',
      !!govAudit &&
        govAudit.findings.length >= 4 &&
        govAudit.auditScore >= 0 &&
        govAudit.auditScore <= 100,
      `findings=${govAudit?.findings.length} score=${govAudit?.auditScore}`
    )
  );

  const breachOps: Acc17CommandCenterOpsState = {
    ...depthEval.ops,
    delegatedProjects: [
      {
        id: 'g17-breach',
        planId: 'plan',
        title: 'Advisory breach',
        delegateKind: 'team_os',
        delegateTargetId: 'team',
        status: 'active',
        authorityCeiling: 'delegated',
        assignedTurn: 1,
        assignedDay: 1,
        lastVerifiedFingerprint: '',
        notes: '',
      },
    ],
  };
  const breachAudit = buildAgent17GovernanceAudit(
    breachOps,
    { ...settings, aiCommunicationAutonomyLevel: 'advisory' },
    buildAgent17VerificationPolicy(breachOps, baseState, 'player')
  );
  goalResults.push(
    result(
      'G17-033',
      breachAudit.band === 'breach' || governanceAuditBlocksAutomation(breachAudit),
      `${breachAudit.band} critical=${breachAudit.openCriticalCount}`
    )
  );

  const matrix = depthEval.snapshot.planningDepth?.escalationMatrix;
  goalResults.push(
    result(
      'G17-034',
      !!matrix &&
        matrix.escalationIndex >= 0 &&
        matrix.escalationIndex <= 100 &&
        (matrix.band === 'none' || matrix.band === 'watch' || matrix.band === 'urgent'),
      `${matrix?.escalationIndex}/${matrix?.band}`
    )
  );

  const rollbackAssurance = depthEval.snapshot.planningDepth?.rollbackAssurance;
  goalResults.push(
    result(
      'G17-035',
      !!rollbackAssurance &&
        rollbackAssurance.checks.length >= 4 &&
        rollbackAssurance.assuranceScore >= 0 &&
        rollbackAssurance.assuranceScore <= 100,
      `checks=${rollbackAssurance?.checks.length} score=${rollbackAssurance?.assuranceScore}`
    )
  );

  const breachMatrix = buildAgent17EscalationMatrix({
    commandPosture: posture!,
    governanceAudit: breachAudit,
    handoffReadiness: handoff!,
  });
  goalResults.push(
    result(
      'G17-036',
      breachMatrix.band === 'urgent' || escalationMatrixBlocksAutomation(breachMatrix),
      `${breachMatrix.band} idx=${breachMatrix.escalationIndex}`
    )
  );

  const stabilization = depthEval.snapshot.planningDepth?.stabilizationIndex;
  goalResults.push(
    result(
      'G17-037',
      !!stabilization &&
        stabilization.stabilizationIndex >= 0 &&
        stabilization.stabilizationIndex <= 100 &&
        (stabilization.band === 'stable' ||
          stabilization.band === 'adjusting' ||
          stabilization.band === 'volatile'),
      `${stabilization?.stabilizationIndex}/${stabilization?.band}`
    )
  );

  const envelope = depthEval.snapshot.planningDepth?.commandEnvelope;
  goalResults.push(
    result(
      'G17-038',
      !!envelope &&
        envelope.signals.length >= 5 &&
        envelope.horizonTurns >= 1 &&
        envelope.delegationCap >= 1,
      `signals=${envelope?.signals.length} horizon=${envelope?.horizonTurns}`
    )
  );

  const volatileStabilization = buildAgent17StabilizationIndex({
    escalationMatrix: breachMatrix,
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
  });
  const saturatedEnvelope = buildAgent17CommandEnvelope({
    ops: breachOps,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    stabilizationIndex: volatileStabilization,
  });
  goalResults.push(
    result(
      'G17-039',
      stabilizationIndexBlocksAutomation(volatileStabilization) ||
        commandEnvelopeNeedsThrottle(saturatedEnvelope),
      `${volatileStabilization.band}/${saturatedEnvelope.capacityBand}`
    )
  );

  const convergence = depthEval.snapshot.planningDepth?.convergenceIndex;
  goalResults.push(
    result(
      'G17-040',
      !!convergence &&
        convergence.convergenceIndex >= 0 &&
        convergence.convergenceIndex <= 100 &&
        (convergence.band === 'aligned' ||
          convergence.band === 'adjusting' ||
          convergence.band === 'diverging'),
      `${convergence?.convergenceIndex}/${convergence?.band}`
    )
  );

  const missionDirective = depthEval.snapshot.planningDepth?.missionDirective;
  goalResults.push(
    result(
      'G17-041',
      !!missionDirective &&
        missionDirective.lanes.length >= 5 &&
        missionDirective.clearanceScore >= 0 &&
        missionDirective.clearanceScore <= 100,
      `lanes=${missionDirective?.lanes.length} score=${missionDirective?.clearanceScore}`
    )
  );

  const divergingConvergence = buildAgent17ConvergenceIndex({
    commandEnvelope: saturatedEnvelope,
    stabilizationIndex: volatileStabilization,
    strategicAlignment: depthEval.snapshot.planningDepth!.strategicAlignment,
  });
  const heldDirective = buildAgent17MissionDirective({
    intentQueue: depthEval.snapshot.planningDepth!.intentQueue,
    commandEnvelope: saturatedEnvelope,
    convergenceIndex: divergingConvergence,
  });
  goalResults.push(
    result(
      'G17-042',
      convergenceIndexBlocksDirective(divergingConvergence) ||
        missionDirectiveBlocksExecution(heldDirective),
      `${divergingConvergence.band}/${heldDirective.band}`
    )
  );

  const directiveSynthesis = depthEval.snapshot.planningDepth?.directiveSynthesis;
  goalResults.push(
    result(
      'G17-043',
      !!directiveSynthesis &&
        directiveSynthesis.synthesisIndex >= 0 &&
        directiveSynthesis.synthesisIndex <= 100 &&
        (directiveSynthesis.band === 'ready' ||
          directiveSynthesis.band === 'pending' ||
          directiveSynthesis.band === 'locked'),
      `${directiveSynthesis?.synthesisIndex}/${directiveSynthesis?.band}`
    )
  );

  const executionClosure = depthEval.snapshot.planningDepth?.executionClosure;
  goalResults.push(
    result(
      'G17-044',
      !!executionClosure &&
        executionClosure.checkpoints.length >= 5 &&
        executionClosure.closureScore >= 0 &&
        executionClosure.closureScore <= 100,
      `checks=${executionClosure?.checkpoints.length} score=${executionClosure?.closureScore}`
    )
  );

  const lockedSynthesis = buildAgent17DirectiveSynthesis({
    missionDirective: heldDirective,
    convergenceIndex: divergingConvergence,
    intentQueue: depthEval.snapshot.planningDepth!.intentQueue,
  });
  const sealedClosure = buildAgent17ExecutionClosure({
    directiveSynthesis: lockedSynthesis,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    missionDirective: heldDirective,
  });
  goalResults.push(
    result(
      'G17-045',
      directiveSynthesisBlocksAdvance(lockedSynthesis) ||
        executionClosureBlocksAdvance(sealedClosure),
      `${lockedSynthesis.band}/${sealedClosure.band}`
    )
  );

  const cadenceLattice = depthEval.snapshot.planningDepth?.cadenceLattice;
  goalResults.push(
    result(
      'G17-046',
      !!cadenceLattice &&
        cadenceLattice.cadenceIndex >= 0 &&
        cadenceLattice.cadenceIndex <= 100 &&
        (cadenceLattice.band === 'flowing' ||
          cadenceLattice.band === 'steady' ||
          cadenceLattice.band === 'stalled'),
      `${cadenceLattice?.cadenceIndex}/${cadenceLattice?.band}`
    )
  );

  const readinessGate = depthEval.snapshot.planningDepth?.readinessGate;
  goalResults.push(
    result(
      'G17-047',
      !!readinessGate &&
        readinessGate.signals.length >= 5 &&
        readinessGate.readinessScore >= 0 &&
        readinessGate.readinessScore <= 100,
      `signals=${readinessGate?.signals.length} score=${readinessGate?.readinessScore}`
    )
  );

  const stalledCadence = buildAgent17CadenceLattice({
    executionClosure: sealedClosure,
    directiveSynthesis: lockedSynthesis,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
  });
  const stopReadiness = buildAgent17ReadinessGate({
    cadenceLattice: stalledCadence,
    handoffReadiness: handoff!,
    coordinationBrief: depthEval.snapshot.planningDepth!.coordinationBrief,
  });
  goalResults.push(
    result(
      'G17-048',
      cadenceLatticeBlocksRun(stalledCadence) || readinessGateBlocksRun(stopReadiness),
      `${stalledCadence.band}/${stopReadiness.band}`
    )
  );

  const pulseIndexSnap = depthEval.snapshot.planningDepth?.pulseIndex;
  goalResults.push(
    result(
      'G17-049',
      !!pulseIndexSnap &&
        pulseIndexSnap.pulseIndex >= 0 &&
        pulseIndexSnap.pulseIndex <= 100 &&
        (pulseIndexSnap.band === 'strong' ||
          pulseIndexSnap.band === 'moderate' ||
          pulseIndexSnap.band === 'flat'),
      `${pulseIndexSnap?.pulseIndex}/${pulseIndexSnap?.band}`
    )
  );

  const continuityBridge = depthEval.snapshot.planningDepth?.continuityBridge;
  goalResults.push(
    result(
      'G17-050',
      !!continuityBridge &&
        continuityBridge.links.length >= 5 &&
        continuityBridge.bridgeScore >= 0 &&
        continuityBridge.bridgeScore <= 100,
      `links=${continuityBridge?.links.length} score=${continuityBridge?.bridgeScore}`
    )
  );

  const flatPulse = buildAgent17PulseIndex({
    readinessGate: stopReadiness,
    cadenceLattice: stalledCadence,
    commandPosture: posture!,
  });
  const brokenBridge = buildAgent17ContinuityBridge({
    pulseIndex: flatPulse,
    resilienceScorecard: buildAgent17ResilienceScorecard(
      breachOps,
      baseState,
      'player',
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    verificationPolicy: buildAgent17VerificationPolicy(breachOps, baseState, 'player'),
  });
  goalResults.push(
    result(
      'G17-051',
      pulseIndexBlocksContinuity(flatPulse) || continuityBridgeBlocksHandoff(brokenBridge),
      `${flatPulse.band}/${brokenBridge.band}`
    )
  );

  const fluxIndexSnap = depthEval.snapshot.planningDepth?.fluxIndex;
  goalResults.push(
    result(
      'G17-052',
      !!fluxIndexSnap &&
        fluxIndexSnap.fluxIndex >= 0 &&
        fluxIndexSnap.fluxIndex <= 100 &&
        (fluxIndexSnap.band === 'coherent' ||
          fluxIndexSnap.band === 'noisy' ||
          fluxIndexSnap.band === 'disrupted'),
      `${fluxIndexSnap?.fluxIndex}/${fluxIndexSnap?.band}`
    )
  );

  const integritySeal = depthEval.snapshot.planningDepth?.integritySeal;
  goalResults.push(
    result(
      'G17-053',
      !!integritySeal &&
        integritySeal.facets.length >= 5 &&
        integritySeal.sealScore >= 0 &&
        integritySeal.sealScore <= 100,
      `facets=${integritySeal?.facets.length} score=${integritySeal?.sealScore}`
    )
  );

  const disruptedFlux = buildAgent17FluxIndex({
    continuityBridge: brokenBridge,
    pulseIndex: flatPulse,
    governanceAudit: breachAudit,
  });
  const breachedSeal = buildAgent17IntegritySeal({
    fluxIndex: disruptedFlux,
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
    verificationPolicy: buildAgent17VerificationPolicy(breachOps, baseState, 'player'),
  });
  goalResults.push(
    result(
      'G17-054',
      fluxIndexBlocksSeal(disruptedFlux) || integritySealBlocksCommit(breachedSeal),
      `${disruptedFlux.band}/${breachedSeal.band}`
    )
  );

  const commitLattice = depthEval.snapshot.planningDepth?.commitLattice;
  goalResults.push(
    result(
      'G17-055',
      !!commitLattice &&
        commitLattice.latticeScore >= 0 &&
        commitLattice.latticeScore <= 100 &&
        (commitLattice.band === 'bound' ||
          commitLattice.band === 'flex' ||
          commitLattice.band === 'fragmented'),
      `${commitLattice?.latticeScore}/${commitLattice?.band}`
    )
  );

  const covenantGate = depthEval.snapshot.planningDepth?.covenantGate;
  goalResults.push(
    result(
      'G17-056',
      !!covenantGate &&
        covenantGate.clauses.length >= 5 &&
        covenantGate.covenantScore >= 0 &&
        covenantGate.covenantScore <= 100,
      `clauses=${covenantGate?.clauses.length} score=${covenantGate?.covenantScore}`
    )
  );

  const fragmentedLattice = buildAgent17CommitLattice({
    integritySeal: breachedSeal,
    fluxIndex: disruptedFlux,
    escalationMatrix: breachMatrix,
  });
  const voidCovenant = buildAgent17CovenantGate({
    commitLattice: fragmentedLattice,
    planHealth: assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
  });
  goalResults.push(
    result(
      'G17-057',
      commitLatticeBlocksCovenant(fragmentedLattice) || covenantGateBlocksOps(voidCovenant),
      `${fragmentedLattice.band}/${voidCovenant.band}`
    )
  );

  const mandateWeave = depthEval.snapshot.planningDepth?.mandateWeave;
  goalResults.push(
    result(
      'G17-058',
      !!mandateWeave &&
        mandateWeave.weaveScore >= 0 &&
        mandateWeave.weaveScore <= 100 &&
        (mandateWeave.band === 'aligned' ||
          mandateWeave.band === 'tensioned' ||
          mandateWeave.band === 'frayed'),
      `${mandateWeave?.weaveScore}/${mandateWeave?.band}`
    )
  );

  const sovereigntyLock = depthEval.snapshot.planningDepth?.sovereigntyLock;
  goalResults.push(
    result(
      'G17-059',
      !!sovereigntyLock &&
        sovereigntyLock.pins.length >= 5 &&
        sovereigntyLock.lockScore >= 0 &&
        sovereigntyLock.lockScore <= 100,
      `pins=${sovereigntyLock?.pins.length} score=${sovereigntyLock?.lockScore}`
    )
  );

  const frayedWeave = buildAgent17MandateWeave({
    covenantGate: voidCovenant,
    commitLattice: fragmentedLattice,
    strategicAlignment: depthEval.snapshot.planningDepth!.strategicAlignment,
  });
  const releasedLock = buildAgent17SovereigntyLock({
    mandateWeave: frayedWeave,
    governanceAudit: breachAudit,
    stabilizationIndex: volatileStabilization,
  });
  goalResults.push(
    result(
      'G17-060',
      mandateWeaveBlocksSovereignty(frayedWeave) || sovereigntyLockBlocksCommand(releasedLock),
      `${frayedWeave.band}/${releasedLock.band}`
    )
  );

  const authorityCharter = depthEval.snapshot.planningDepth?.authorityCharter;
  goalResults.push(
    result(
      'G17-061',
      !!authorityCharter &&
        authorityCharter.articles.length >= 5 &&
        authorityCharter.charterScore >= 0 &&
        authorityCharter.charterScore <= 100 &&
        (authorityCharter.band === 'chartered' ||
          authorityCharter.band === 'provisional' ||
          authorityCharter.band === 'revoked'),
      `articles=${authorityCharter?.articles.length} score=${authorityCharter?.charterScore}`
    )
  );

  const dispatchAccord = depthEval.snapshot.planningDepth?.dispatchAccord;
  goalResults.push(
    result(
      'G17-062',
      !!dispatchAccord &&
        dispatchAccord.provisions.length >= 5 &&
        dispatchAccord.accordScore >= 0 &&
        dispatchAccord.accordScore <= 100,
      `provisions=${dispatchAccord?.provisions.length} score=${dispatchAccord?.accordScore}`
    )
  );

  const revokedCharter = buildAgent17AuthorityCharter({
    sovereigntyLock: releasedLock,
    mandateWeave: frayedWeave,
    commandPosture: depthEval.snapshot.planningDepth!.commandPosture,
  });
  const voidAccord = buildAgent17DispatchAccord({
    authorityCharter: revokedCharter,
    sovereigntyLock: releasedLock,
    delegationLadder: depthEval.snapshot.planningDepth!.delegationLadder,
  });
  goalResults.push(
    result(
      'G17-063',
      sovereigntyLockBlocksCommand(releasedLock) ||
        authorityCharterBlocksAccord(revokedCharter) ||
        dispatchAccordBlocksDispatch(voidAccord),
      `${revokedCharter.band}/${voidAccord.band}`
    )
  );

  const mobilizationIndex = depthEval.snapshot.planningDepth?.mobilizationIndex;
  goalResults.push(
    result(
      'G17-064',
      !!mobilizationIndex &&
        mobilizationIndex.vectors.length >= 5 &&
        mobilizationIndex.mobilizationScore >= 0 &&
        mobilizationIndex.mobilizationScore <= 100 &&
        (mobilizationIndex.band === 'mobilized' ||
          mobilizationIndex.band === 'forming' ||
          mobilizationIndex.band === 'stalled'),
      `vectors=${mobilizationIndex?.vectors.length} score=${mobilizationIndex?.mobilizationScore}`
    )
  );

  const executionSummons = depthEval.snapshot.planningDepth?.executionSummons;
  goalResults.push(
    result(
      'G17-065',
      !!executionSummons &&
        executionSummons.clauses.length >= 5 &&
        executionSummons.summonsScore >= 0 &&
        executionSummons.summonsScore <= 100,
      `clauses=${executionSummons?.clauses.length} score=${executionSummons?.summonsScore}`
    )
  );

  const stalledMobilization = buildAgent17MobilizationIndex({
    dispatchAccord: voidAccord,
    coordinationBrief: depthEval.snapshot.planningDepth!.coordinationBrief,
    executionPacing: depthEval.snapshot.planningDepth!.executionPacing,
  });
  const revokedSummons = buildAgent17ExecutionSummons({
    mobilizationIndex: stalledMobilization,
    dispatchAccord: voidAccord,
    missionDirective: depthEval.snapshot.planningDepth!.missionDirective,
  });
  goalResults.push(
    result(
      'G17-066',
      dispatchAccordBlocksDispatch(voidAccord) ||
        mobilizationIndexBlocksSummons(stalledMobilization) ||
        executionSummonsBlocksField(revokedSummons),
      `${stalledMobilization.band}/${revokedSummons.band}`
    )
  );

  void buildAgent17ResilienceScorecard(
    depthEval.ops,
    baseState,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(depthEval.ops, baseState, 'player')
  );

  const passedCount = goalResults.filter(r => r.passed).length;
  const failedCount = goalResults.length - passedCount;
  return {
    timestamp: Date.now(),
    goalResults,
    passedCount,
    failedCount,
    success: failedCount === 0,
  };
}

export function assertAgent17Goals(ctx: GoalVerificationContext): void {
  const report = verifyAgent17Goals(ctx);
  if (!report.success) {
    const failed = report.goalResults.filter(r => !r.passed).map(r => r.goalId);
    throw new Error(`Agent 17 goal verification failed: ${failed.join(', ')}`);
  }
}

/** Cross-check registry ids vs verification set. */
export function validateGoalRegistryCoverage(): { ok: boolean; missing: string[] } {
  const verifiedIds = new Set([
    'G17-001',
    'G17-002',
    'G17-003',
    'G17-004',
    'G17-005',
    'G17-006',
    'G17-007',
    'G17-008',
    'G17-009',
    'G17-010',
    'G17-011',
    'G17-012',
    'G17-013',
    'G17-014',
    'G17-015',
    'G17-016',
    'G17-017',
    'G17-018',
    'G17-019',
    'G17-020',
    'G17-021',
    'G17-022',
    'G17-023',
    'G17-024',
    'G17-025',
    'G17-026',
    'G17-027',
    'G17-028',
    'G17-029',
    'G17-030',
    'G17-031',
    'G17-032',
    'G17-033',
    'G17-034',
    'G17-035',
    'G17-036',
    'G17-037',
    'G17-038',
    'G17-039',
    'G17-040',
    'G17-041',
    'G17-042',
    'G17-043',
    'G17-044',
    'G17-045',
    'G17-046',
    'G17-047',
    'G17-048',
    'G17-049',
    'G17-050',
    'G17-051',
    'G17-052',
    'G17-053',
    'G17-054',
    'G17-055',
    'G17-056',
    'G17-057',
    'G17-058',
    'G17-059',
    'G17-060',
    'G17-061',
    'G17-062',
    'G17-063',
    'G17-064',
    'G17-065',
    'G17-066',
  ]);
  const missing = AGENT17_GOAL_REGISTRY.filter(g => !verifiedIds.has(g.id)).map(g => g.id);
  return { ok: missing.length === 0, missing };
}


// --- source: harness/run-acc17-dev-tests.ts ---
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  createDefaultAcc17CommandCenterOpsState,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function runAgent17Acc17DevTests(
  customState?: Agent17GameStateSlice,
  customSettings?: Agent17SettingsSlice
): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
    const baseState: Agent17GameStateSlice = customState || {
      turnCounter: 3,
      day: 3,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        id: 'c1',
        sourceType: 'contract',
        sourceId: 'c1',
        title: 'Test Contract',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings: Agent17SettingsSlice = customSettings || {
      aiCommunicationAutonomyLevel: 'assisted',
      commandCenterSettings: { enabled: true },
    };

    const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const mutated: Agent17GameStateSlice = {
      ...baseState,
      player: { ...actor, money: 5100 },
      lastExecutedAction: { type: 'travel' },
    };
    const fp3 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
    push('acc17_fp_delta', 'Fingerprint reacts to state delta', fp1 !== fp3, `${fp1}/${fp3}`);

    const plan = acc17CreateMultiStepPlanFromObjective(
      baseState,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    push('acc17_plan', 'Objective spawns multi-step plan', !!plan && plan!.steps.length >= 3);

    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = { ...ops, activePlan: plan, lastContextFingerprint: fp1 };
    const noAdvance = acc17AdvanceVerifiedPlanProgress(plan!, baseState, 'player', fp1);
    push(
      'acc17_gate_same_fp',
      'No verification log when fingerprint unchanged',
      noAdvance.logEntries.length === 0
    );

    ops = { ...ops, lastContextFingerprint: fp3 };
    const evalRes = evaluateAcc17CommandCenterOperations(mutated, settings, 'player', ops);
    push(
      'acc17_context',
      'Deep context slices populated',
      evalRes.snapshot.deepContext.slices.length >= 1
    );
    push(
      'acc17_delegate',
      'Delegated project created',
      evalRes.snapshot.delegatedProjects.length >= 1
    );
    push(
      'acc17_sanitize',
      'Sanitizer returns v1',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('acc17_throw', 'Harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 ACC17 Dev Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-recovery-path-tests.ts ---
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
  replanAcc17WithRecoveryTemplate,
} from '../planning/recovery-paths.ts';
  acc17AdvanceVerifiedPlanProgress,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function runAgent17RecoveryPathTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const baseState: Agent17GameStateSlice = {
      turnCounter: 5,
      day: 5,
      player: {
        id: 'player',
        money: 250,
        netWorth: 6000,
        currentRegion: 'QLD',
        currentSupplies: 20,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 250,
          netWorth: 6000,
          currentRegion: 'QLD',
          currentSupplies: 20,
        },
      },
      lastExecutedAction: { type: 'wait' },
    };

    const signals = detectAgent17RecoverySignals(baseState, 'player');
    push(
      'recovery_signals',
      'Low cash and supplies emit recovery signals',
      signals.some(s => s.lane === 'liquidity_crisis') &&
        signals.some(s => s.lane === 'supply_collapse'),
      `lanes=${signals.map(s => s.lane).join(',')}`
    );

    const decision = pickAgent17RecoveryTemplateId(signals, true);
    push(
      'recovery_pick_blocked',
      'Blocked plan picks highest-severity recovery lane',
      decision?.templateId === 'agent17_tpl_supply_deep_recovery' &&
        decision?.lane === 'supply_collapse',
      `${decision?.lane}/${decision?.templateId}`
    );

    const deepPlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_deep_capital_program',
      baseState,
      'player'
    );
    push(
      'deep_template_steps',
      'Deep capital program has six wired steps',
      !!deepPlan && deepPlan.steps.length === 6,
      `steps=${deepPlan?.steps.length}`
    );
    const step5 = deepPlan?.steps[5];
    push(
      'deep_prereq_chain',
      'Final deep phase requires prior step ids',
      (step5?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      step5?.requirements.prerequisiteStepIds?.join(',')
    );

    let ops = createDefaultAcc17CommandCenterOpsState();
    const objectivePlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_trade_arbitrage',
      baseState,
      'player'
    );
    ops = { ...ops, activePlan: objectivePlan };
    const fp0 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const poorState: Agent17GameStateSlice = {
      ...baseState,
      player: { ...baseState.player!, money: 50, netWorth: 6000 },
      actorsById: {
        player: { ...baseState.actorsById!.player!, money: 50, netWorth: 6000 },
      },
      lastExecutedAction: { type: 'deposit' },
    };
    const fp1 = acc17ComputeRelevantStateFingerprint(poorState, 'player');
    ops = { ...ops, lastContextFingerprint: fp0 };
    const advanced = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan!,
      poorState,
      'player',
      fp0
    );
    ops = { ...ops, activePlan: advanced.plan, lastContextFingerprint: fp1 };
    const hasBlocked = advanced.plan.steps.some(s => s.status === 'blocked');
    push('recovery_blocked_step', 'Cash drop blocks template step with minCash', hasBlocked);

    const recovery = maybeApplyAgent17RecoveryPath(ops, poorState, 'player');
    push(
      'recovery_replan',
      'Recovery replan swaps active plan',
      recovery.applied && recovery.ops.activePlan?.replanCount === 1,
      recovery.ops.activePlan?.objectiveSource
    );

    if (recovery.decision) {
      const manual = replanAcc17WithRecoveryTemplate(
        recovery.ops,
        poorState,
        'player',
        recovery.decision
      );
      push(
        'recovery_replan_count',
        'Manual replan increments replanCount',
        (manual.activePlan?.replanCount ?? 0) >= 2,
        String(manual.activePlan?.replanCount)
      );
    } else {
      push('recovery_replan_count', 'Manual replan increments replanCount', false, 'no decision');
    }

    const settings = { commandCenterSettings: { enabled: true }, aiCommunicationAutonomyLevel: 'assisted' as const };
    const evalBlocked = evaluateAcc17CommandCenterOperations(poorState, settings, 'player', {
      ...createDefaultAcc17CommandCenterOpsState(),
      activePlan: advanced.plan,
      lastContextFingerprint: fp1,
    });
    push(
      'recovery_eval_integration',
      'Evaluator applies recovery on blocked plan',
      evalBlocked.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      evalBlocked.ops.activePlan?.objectiveSource
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('recovery_throw', 'Recovery harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Recovery Path Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-planning-depth-tests.ts ---
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17PlanningDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const state: Agent17GameStateSlice = {
      turnCounter: 8,
      day: 8,
      player: {
        id: 'player',
        money: 4200,
        netWorth: 9000,
        currentRegion: 'NSW',
        currentSupplies: 80,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 4200,
          netWorth: 9000,
          currentRegion: 'NSW',
          currentSupplies: 80,
        },
      },
      playerTrackedObjective: {
        title: 'Expand trade routes across markets',
        sourceType: 'contract',
        sourceId: 'trade-1',
        description: 'Focus on trade arbitrage this turn',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };

    const depth = summarizeAgent17CatalogDepth();
    push(
      'depth_catalog_scale',
      'Catalog depth meets scale wave minimums',
      depth.templateCount >= 12 && depth.deepTemplateCount >= 7 && depth.maxStepCount >= 6,
      JSON.stringify(depth)
    );

    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    push(
      'depth_template_routing',
      'Trade objective routes to trade category',
      routing.matchedCategory === 'trade' &&
        routing.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${routing.matchedCategory}/${routing.candidateTemplateIds[0]}`
    );

    const plan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_diplomatic_depth',
      state,
      'player'
    );
    const health = assessAgent17PlanHealth(plan, state, 'player');
    push(
      'depth_plan_health',
      'Fresh deep plan starts steady or strong',
      health.band === 'steady' || health.band === 'strong',
      health.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(
      state,
      settings,
      'player',
      createDefaultAcc17CommandCenterOpsState()
    );
    push(
      'depth_snapshot_attached',
      'Evaluator attaches planningDepth snapshot',
      !!evalRes.snapshot.planningDepth &&
        evalRes.snapshot.planningDepth.catalogDepth.templateCount >= 12,
      String(evalRes.snapshot.planningDepth?.catalogDepth.templateCount)
    );
    push(
      'depth_suggestion',
      'Planning suggestion has kind and confidence',
      !!evalRes.snapshot.planningDepth?.suggestion.kind &&
        (evalRes.snapshot.planningDepth?.suggestion.confidence ?? 0) > 0,
      evalRes.snapshot.planningDepth?.suggestion.kind
    );

    const ops = evalRes.ops;
    const manualDepth = buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      'player',
      'copilot'
    );
    push(
      'depth_delegation_analytics',
      'Delegation analytics covers all delegate kinds',
      manualDepth.delegationAnalytics.length === 5,
      String(manualDepth.delegationAnalytics.length)
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('depth_throw', 'Planning depth harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Planning Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-delegation-depth-tests.ts ---
  acc17DelegateProject,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from '../planning/delegation-ladder.ts';

export function runAgent17DelegationDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'delegated' as const,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 12,
      day: 12,
      player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' },
      actorsById: { player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' } },
      playerTrackedObjective: { title: 'Team treasury coordination', sourceType: 'team' },
      lastExecutedAction: { type: 'invest' },
    };

    const plan = acc17InstantiatePlanFromTemplate('agent17_tpl_team_synergy', state, 'player');
    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = {
      ...ops,
      activePlan: plan,
      delegatedProjects: [
        acc17DelegateProject(ops, plan!, 'copilot', 'c1', 'assisted'),
        acc17DelegateProject(ops, plan!, 'copilot', 'c2', 'assisted'),
      ],
    };

    const analytics = buildAgent17DelegationAnalytics(ops, settings);
    const ladder = buildAgent17DelegationLadder(analytics, settings, 'copilot');
    push(
      'delegation_ladder_rungs',
      'Delegation ladder exposes five rungs',
      ladder.rungs.length === 5,
      String(ladder.rungs.length)
    );
    push(
      'delegation_capacity',
      'Copilot at capacity triggers reroute candidate',
      !delegationLadderHasCapacity(ladder, 'copilot'),
      String(ladder.rungs.find(r => r.delegateKind === 'copilot')?.slotsRemaining)
    );

    const ledger = summarizeAgent17PlanLedger(ops, state);
    push(
      'plan_ledger_delegate',
      'Plan ledger records delegate events',
      ledger.entries.some(e => e.kind === 'delegate'),
      String(ledger.entries.length)
    );

    const score = computeAgent17DelegationDepthScore(ops, settings, 'copilot');
    push('delegation_depth_score', 'Delegation depth score bounded 0-100', score >= 0 && score <= 100, String(score));

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'depth_ladder_attached',
      'Snapshot includes delegation ladder headline',
      !!depth?.delegationLadder.headline,
      depth?.delegationLadder.headline
    );
    push(
      'depth_ledger_attached',
      'Snapshot includes plan ledger fingerprint',
      depth?.planLedger.lastFingerprint !== undefined,
      depth?.planLedger.lastFingerprint
    );

    ops = {
      ...ops,
      activePlan: plan
        ? { ...plan, replanCount: 2, steps: plan.steps.map((s, i) => (i === 1 ? { ...s, status: 'blocked' as const, blockerReason: 'x' } : s)) }
        : null,
    };
    const unstableLedger = summarizeAgent17PlanLedger(ops, state);
    push(
      'ledger_instability',
      'Ledger flags instability on replans and blocks',
      planLedgerIndicatesInstability(unstableLedger),
      `replan=${unstableLedger.replanEvents} blocks=${unstableLedger.blockedStepEvents}`
    );

    const refined = refineAgent17DelegationSuggestion(
      ops,
      state,
      settings,
      'player',
      { kind: 'hold', headline: 'hold', rationale: 'hold', confidence: 0.5 },
      'copilot'
    );
    push(
      'delegation_refine_risk',
      'Refiner upgrades hold under at-risk health',
      refined.kind === 'delegate',
      refined.delegateKind
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('delegation_throw', 'Delegation depth harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Delegation Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-coordination-depth-tests.ts ---
  buildAgent17VerificationPolicy,
  verificationPolicyBlocksAdvance,
} from '../planning/verification-policy.ts';
  buildAgent17CoordinationBrief,
  coordinationBriefReadyForGi,
} from '../planning/coordination-brief.ts';

export function runAgent17CoordinationDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 150,
      netWorth: 4000,
      currentRegion: 'QLD',
      currentSupplies: 15,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 9,
      day: 9,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Restock and recover supplies', sourceType: 'contract' },
      gi3Strategy: { headline: 'Hold liquidity above $500' },
      lastExecutedAction: { type: 'restock_supplies' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(null, state, 'player');
    const intent = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    push(
      'coord_intent_queue',
      'Intent queue prioritizes objective and recovery',
      intent.queueDepth >= 3 && intent.primaryIntentId === 'intent_objective',
      `depth=${intent.queueDepth} primary=${intent.primaryIntentId}`
    );
    push(
      'coord_recovery_intent',
      'Low supplies emit recovery intent',
      intentQueueRequiresRecovery(intent) || intent.items.some(i => i.source === 'recovery'),
      intent.items.map(i => i.source).join(',')
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policySame = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    push(
      'coord_verify_block_same_fp',
      'Verification blocked when fingerprint unchanged',
      !policySame.allowVerification,
      policySame.blockingRuleIds.join(',')
    );

    const policyDelta = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'old_fp' },
      state,
      'player'
    );
    push(
      'coord_verify_allow_delta',
      'Verification allowed when fingerprint delta satisfied',
      policyDelta.allowVerification === true,
      String(policyDelta.allowVerification)
    );
    push(
      'coord_verify_blocks_advance',
      'Policy helper detects fingerprint hold',
      verificationPolicyBlocksAdvance(policySame) === true,
      String(verificationPolicyBlocksAdvance(policySame))
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'coord_brief_attached',
      'Evaluator attaches coordination brief',
      !!depth?.coordinationBrief?.headline && (depth.coordinationBrief.sections.length ?? 0) >= 3,
      String(depth?.coordinationBrief?.sections.length)
    );
    push(
      'coord_gi_handoff',
      'Coordination brief ready for GI handoff tags',
      depth?.coordinationBrief
        ? coordinationBriefReadyForGi(depth.coordinationBrief)
        : false,
      depth?.coordinationBrief?.giHandoffTags?.join(',')
    );

    if (depth) {
      const manualBrief = buildAgent17CoordinationBrief(
        {
          turn: depth.turn,
          actorId: depth.actorId,
          planHealth: depth.planHealth,
          suggestion: depth.suggestion,
          templateRouting: depth.templateRouting,
          delegationAnalytics: depth.delegationAnalytics,
          delegationLadder: depth.delegationLadder,
          planLedger: depth.planLedger,
          catalogDepth: depth.catalogDepth,
        },
        depth.intentQueue,
        depth.verificationPolicy,
        evalRes.ops,
        state,
        settings
      );
      push(
        'coord_brief_confidence',
        'Brief confidence bounded',
        manualBrief.confidence >= 0.35 && manualBrief.confidence <= 0.99,
        String(manualBrief.confidence)
      );
    } else {
      push('coord_brief_confidence', 'Brief confidence bounded', false, 'no depth');
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('coord_throw', 'Coordination harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Coordination Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-execution-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17ExecutionPacing,
  executionPacingRequiresThrottle,
} from '../planning/execution-pacing.ts';
  buildAgent17ResilienceScorecard,
  resilienceScorecardNeedsIntervention,
} from '../planning/resilience-scorecard.ts';

export function runAgent17ExecutionDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 80,
      netWorth: 1200,
      currentRegion: 'VIC',
      currentSupplies: 4,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 14,
      day: 14,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Stabilize supply chain', sourceType: 'contract' },
      gi3Strategy: { headline: 'Avoid cash crunch' },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(plan, state, 'player');
    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'prior_fp' },
      state,
      'player'
    );
    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );

    const pacingOpen = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    push(
      'exec_pacing_attached',
      'Execution pacing exposes budget and steps remaining',
      pacingOpen.stepsRemaining >= 1 && pacingOpen.turnBudgetRemaining >= 0,
      `steps=${pacingOpen.stepsRemaining} budget=${pacingOpen.turnBudgetRemaining}`
    );
    push(
      'exec_advance_when_open',
      'Can advance when verification gate open',
      pacingOpen.verificationGateOpen === true,
      String(pacingOpen.canAdvanceActiveStep)
    );

    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    push(
      'exec_throttle_on_fp',
      'Pacing throttles when fingerprint unchanged',
      pacingClosed.pacingBand === 'throttled' || executionPacingRequiresThrottle(pacingClosed),
      pacingClosed.pacingBand
    );
    push(
      'exec_cooldown_bounded',
      'Delegate cooldown non-negative',
      pacingOpen.cooldownTurns >= 0 && pacingOpen.cooldownTurns <= 2,
      String(pacingOpen.cooldownTurns)
    );

    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
    );
    push(
      'exec_resilience_bounded',
      'Resilience composite index bounded 0–100',
      scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.recoveryPressure >= 0 &&
        scorecard.verificationStability >= 0,
      String(scorecard.compositeIndex)
    );
    push(
      'exec_mitigation_hints',
      'Scorecard emits mitigation hints',
      scorecard.mitigationHints.length >= 1 && scorecard.headline.length > 10,
      scorecard.mitigationHints[0]
    );
    push(
      'exec_low_supplies_intervention',
      'Low supplies raise recovery pressure',
      scorecard.recoveryPressure >= 20 || resilienceScorecardNeedsIntervention(scorecard),
      String(scorecard.recoveryPressure)
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'exec_evaluator_depth',
      'Evaluator attaches execution pacing and resilience scorecard',
      !!depth?.executionPacing?.headline &&
        !!depth?.resilienceScorecard?.headline &&
        depth.resilienceScorecard.mitigationHints.length >= 1,
      `${depth?.executionPacing?.pacingBand}/${depth?.resilienceScorecard?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('exec_throw', 'Execution harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Execution Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-continuity-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17StrategicAlignment,
  strategicAlignmentNeedsReconcile,
} from '../planning/strategic-alignment.ts';
  buildAgent17HandoffReadiness,
  handoffReadinessBlocked,
} from '../planning/handoff-readiness.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17ContinuityDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 21,
      day: 21,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );

    push(
      'cont_align_bounded',
      'Strategic alignment index bounded with band',
      alignment.alignmentIndex >= 0 &&
        alignment.alignmentIndex <= 100 &&
        (alignment.band === 'aligned' ||
          alignment.band === 'drifting' ||
          alignment.band === 'divergent'),
      `${alignment.alignmentIndex}/${alignment.band}`
    );
    push(
      'cont_align_high_when_cues_match',
      'Matching GI3/objective cues raise overlap',
      alignment.gi3Overlap >= 40 && !strategicAlignmentNeedsReconcile(alignment),
      `gi3=${alignment.gi3Overlap} flags=${alignment.driftFlags.length}`
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'other_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policyOpen,
      opsWithPlan,
      state,
      settings
    );
    const handoffOpen = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyOpen,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });

    push(
      'cont_handoff_checks',
      'Handoff readiness exposes weighted checks',
      handoffOpen.checks.length >= 5 &&
        handoffOpen.readinessScore >= 0 &&
        handoffOpen.readinessScore <= 100,
      `checks=${handoffOpen.checks.length} score=${handoffOpen.readinessScore}`
    );
    push(
      'cont_handoff_partial_or_ready',
      'Open gates yield partial or ready band',
      handoffOpen.band === 'partial' || handoffOpen.band === 'ready',
      handoffOpen.band
    );

    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    const handoffClosed = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyClosed,
      executionPacing: pacingClosed,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    push(
      'cont_handoff_blocked_verify',
      'Closed verification blocks handoff',
      handoffClosed.blockers.includes('verify_gate') || handoffReadinessBlocked(handoffClosed),
      handoffClosed.blockers.join(',')
    );

    const divergentState: Agent17GameStateSlice = {
      ...state,
      gi3Strategy: { headline: 'Retreat mining operations entirely' },
      strategyPlannerState: { activePlan: { title: 'Liquidate regional assets' } },
    };
    const alignDrift = buildAgent17StrategicAlignment(
      opsWithPlan,
      divergentState,
      settings,
      'player',
      buildAgent17IntentQueue(opsWithPlan, divergentState, settings, 'player', health)
    );
    push(
      'cont_drift_flags',
      'Divergent upstream cues emit drift flags',
      alignDrift.driftFlags.length >= 1 || alignDrift.band !== 'aligned',
      alignDrift.driftFlags.join(',') || alignDrift.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cont_evaluator_depth',
      'Evaluator attaches strategic alignment and handoff readiness',
      !!depth?.strategicAlignment?.headline &&
        !!depth?.handoffReadiness?.headline &&
        (depth.handoffReadiness.checks?.length ?? 0) >= 5,
      `${depth?.strategicAlignment?.band}/${depth?.handoffReadiness?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cont_throw', 'Continuity harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Continuity Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-governance-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17CommandPosture,
  commandPostureNeedsEscalation,
} from '../planning/command-posture.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17GovernanceDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 22,
      day: 22,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'other_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });

    push(
      'gov_posture_bounded',
      'Command posture index bounded with band',
      posture.postureIndex >= 0 &&
        posture.postureIndex <= 100 &&
        (posture.band === 'commanding' ||
          posture.band === 'contested' ||
          posture.band === 'degraded'),
      `${posture.postureIndex}/${posture.band}`
    );

    push(
      'gov_posture_contributions',
      'Posture exposes weighted contributions',
      posture.handoffContribution >= 0 &&
        posture.resilienceContribution >= 0 &&
        posture.alignmentContribution >= 0,
      `h=${posture.handoffContribution} r=${posture.resilienceContribution}`
    );

    const auditClean = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    push(
      'gov_audit_findings',
      'Governance audit exposes findings',
      auditClean.findings.length >= 4 &&
        auditClean.auditScore >= 0 &&
        auditClean.auditScore <= 100,
      `findings=${auditClean.findings.length} score=${auditClean.auditScore}`
    );

    push(
      'gov_audit_band',
      'Clean ops yields compliant or review band',
      auditClean.band === 'compliant' || auditClean.band === 'review',
      auditClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    push(
      'gov_breach_blocks',
      'Authority breach triggers governance breach',
      auditBreach.band === 'breach' || governanceAuditBlocksAutomation(auditBreach),
      `${auditBreach.band} critical=${auditBreach.openCriticalCount}`
    );

    const divergentState: Agent17GameStateSlice = {
      ...state,
      gi3Strategy: { headline: 'Retreat mining operations entirely' },
    };
    const alignDrift = buildAgent17StrategicAlignment(
      opsWithPlan,
      divergentState,
      settings,
      'player',
      buildAgent17IntentQueue(opsWithPlan, divergentState, settings, 'player', health)
    );
    const postureDrift = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignDrift,
    });
    push(
      'gov_posture_escalation',
      'Degraded alignment can trigger escalation',
      alignDrift.band !== 'aligned' ||
        commandPostureNeedsEscalation(postureDrift) ||
        postureDrift.band !== 'commanding',
      `${alignDrift.band}/${postureDrift.band}`
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'gov_evaluator_depth',
      'Evaluator attaches command posture and governance audit',
      !!depth?.commandPosture?.headline &&
        !!depth?.governanceAudit?.headline &&
        (depth.governanceAudit.findings?.length ?? 0) >= 4,
      `${depth?.commandPosture?.band}/${depth?.governanceAudit?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('gov_throw', 'Governance harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Governance Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-assurance-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17AssuranceDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 24,
      day: 24,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'assurance_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);

    const matrixClean = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    push(
      'asr_matrix_bounded',
      'Escalation matrix index bounded with band',
      matrixClean.escalationIndex >= 0 &&
        matrixClean.escalationIndex <= 100 &&
        (matrixClean.band === 'none' ||
          matrixClean.band === 'watch' ||
          matrixClean.band === 'urgent'),
      `${matrixClean.escalationIndex}/${matrixClean.band}`
    );

    push(
      'asr_matrix_rungs',
      'Escalation matrix exposes posture/governance/handoff rungs',
      matrixClean.rungs.length === 3 && matrixClean.rungs.every(r => r.id && r.severity),
      `rungs=${matrixClean.rungs.length}`
    );

    const assuranceClean = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    push(
      'asr_rollback_checks',
      'Rollback assurance exposes weighted checks',
      assuranceClean.checks.length >= 4 &&
        assuranceClean.assuranceScore >= 0 &&
        assuranceClean.assuranceScore <= 100,
      `checks=${assuranceClean.checks.length} score=${assuranceClean.assuranceScore}`
    );

    push(
      'asr_rollback_band',
      'Healthy ops yields protected or at_risk band',
      assuranceClean.band === 'protected' || assuranceClean.band === 'at_risk',
      assuranceClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    push(
      'asr_urgent_blocks',
      'Governance breach triggers urgent escalation',
      matrixUrgent.band === 'urgent' || escalationMatrixBlocksAutomation(matrixUrgent),
      `${matrixUrgent.band} idx=${matrixUrgent.escalationIndex}`
    );

    const failedPlanOps = {
      ...opsWithPlan,
      activePlan: opsWithPlan.activePlan
        ? {
            ...opsWithPlan.activePlan,
            steps: opsWithPlan.activePlan.steps.map((s, i) =>
              i === 0 ? { ...s, status: 'failed' as const } : s
            ),
          }
        : null,
    };
    const assuranceExposed = buildAgent17RollbackAssurance(
      failedPlanOps,
      assessAgent17PlanHealth(failedPlanOps.activePlan, state, 'player'),
      audit
    );
    push(
      'asr_restore_signal',
      'Failed steps recommend restore',
      assuranceExposed.restoreRecommended || rollbackAssuranceNeedsRestore(assuranceExposed),
      `${assuranceExposed.band} restore=${assuranceExposed.restoreRecommended}`
    );

    push(
      'asr_governance_link',
      'Governance breach blocks automation in matrix path',
      governanceAuditBlocksAutomation(auditBreach) || matrixUrgent.band === 'urgent',
      auditBreach.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'asr_evaluator_depth',
      'Evaluator attaches escalation matrix and rollback assurance',
      !!depth?.escalationMatrix?.headline &&
        !!depth?.rollbackAssurance?.headline &&
        (depth.rollbackAssurance.checks?.length ?? 0) >= 4,
      `${depth?.escalationMatrix?.band}/${depth?.rollbackAssurance?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('asr_throw', 'Assurance harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Assurance Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-stabilization-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17StabilizationDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 26,
      day: 26,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'stab_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);

    const stabilizationClean = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    push(
      'stb_index_bounded',
      'Stabilization index bounded with band',
      stabilizationClean.stabilizationIndex >= 0 &&
        stabilizationClean.stabilizationIndex <= 100 &&
        (stabilizationClean.band === 'stable' ||
          stabilizationClean.band === 'adjusting' ||
          stabilizationClean.band === 'volatile'),
      `${stabilizationClean.stabilizationIndex}/${stabilizationClean.band}`
    );

    push(
      'stb_factors',
      'Stabilization index exposes weighted factors',
      stabilizationClean.factors.length >= 4 &&
        stabilizationClean.factors.every(f => f.weight > 0),
      `factors=${stabilizationClean.factors.length}`
    );

    const envelopeClean = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilizationClean,
    });
    push(
      'stb_envelope_signals',
      'Command envelope exposes capacity signals',
      envelopeClean.signals.length >= 5 && envelopeClean.horizonTurns >= 1,
      `signals=${envelopeClean.signals.length} horizon=${envelopeClean.horizonTurns}`
    );

    push(
      'stb_envelope_nominal',
      'Healthy ops yields nominal or constrained envelope',
      envelopeClean.capacityBand === 'nominal' || envelopeClean.capacityBand === 'constrained',
      envelopeClean.capacityBand
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    push(
      'stb_volatile_blocks',
      'Governance breach yields volatile stabilization or blocks automation',
      stabilizationVolatile.band === 'volatile' ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile),
      `${stabilizationVolatile.band} idx=${stabilizationVolatile.stabilizationIndex}`
    );

    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    push(
      'stb_throttle',
      'Saturated envelope throttles automation',
      envelopeSaturated.capacityBand === 'saturated' ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        !envelopeSaturated.automationAllowed,
      `${envelopeSaturated.capacityBand} auto=${envelopeSaturated.automationAllowed}`
    );

    push(
      'stb_assurance_link',
      'Urgent escalation propagates to stabilization factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'stb_evaluator_depth',
      'Evaluator attaches stabilization index and command envelope',
      !!depth?.stabilizationIndex?.headline &&
        !!depth?.commandEnvelope?.headline &&
        (depth.commandEnvelope.signals?.length ?? 0) >= 5,
      `${depth?.stabilizationIndex?.band}/${depth?.commandEnvelope?.capacityBand}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('stb_throw', 'Stabilization harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Stabilization Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-convergence-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17MissionDirective,
  missionDirectiveBlocksExecution,
} from '../planning/mission-directive.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17ConvergenceDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 27,
      day: 27,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'conv_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });

    const convergenceClean = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    push(
      'conv_index_bounded',
      'Convergence index bounded with band',
      convergenceClean.convergenceIndex >= 0 &&
        convergenceClean.convergenceIndex <= 100 &&
        (convergenceClean.band === 'aligned' ||
          convergenceClean.band === 'adjusting' ||
          convergenceClean.band === 'diverging'),
      `${convergenceClean.convergenceIndex}/${convergenceClean.band}`
    );

    push(
      'conv_factors',
      'Convergence index exposes weighted factors',
      convergenceClean.factors.length >= 4 &&
        convergenceClean.factors.every(f => f.weight > 0),
      `factors=${convergenceClean.factors.length}`
    );

    const directiveClean = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergenceClean,
    });
    push(
      'conv_directive_lanes',
      'Mission directive exposes directive lanes',
      directiveClean.lanes.length >= 5 &&
        directiveClean.clearanceScore >= 0 &&
        directiveClean.clearanceScore <= 100,
      `lanes=${directiveClean.lanes.length} score=${directiveClean.clearanceScore}`
    );

    push(
      'conv_directive_cleared',
      'Healthy ops yields cleared or conditional directive',
      directiveClean.band === 'cleared' || directiveClean.band === 'conditional',
      directiveClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    push(
      'conv_diverging_blocks',
      'Governance breach yields diverging convergence or blocks directive',
      convergenceDiverging.band === 'diverging' ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      `${convergenceDiverging.band} idx=${convergenceDiverging.convergenceIndex}`
    );

    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    push(
      'conv_held_execution',
      'Held directive blocks execution clearance',
      directiveHeld.band === 'held' ||
        missionDirectiveBlocksExecution(directiveHeld) ||
        !directiveHeld.executionAllowed,
      `${directiveHeld.band} exec=${directiveHeld.executionAllowed}`
    );

    push(
      'conv_escalation_link',
      'Urgent escalation propagates to convergence factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'conv_evaluator_depth',
      'Evaluator attaches convergence index and mission directive',
      !!depth?.convergenceIndex?.headline &&
        !!depth?.missionDirective?.headline &&
        (depth.missionDirective.lanes?.length ?? 0) >= 5,
      `${depth?.convergenceIndex?.band}/${depth?.missionDirective?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('conv_throw', 'Convergence harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Convergence Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-synthesis-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17ExecutionClosure,
  executionClosureBlocksAdvance,
} from '../planning/execution-closure.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17SynthesisDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 28,
      day: 28,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'syn_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });

    const synthesisClean = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    push(
      'syn_index_bounded',
      'Directive synthesis bounded with band',
      synthesisClean.synthesisIndex >= 0 &&
        synthesisClean.synthesisIndex <= 100 &&
        (synthesisClean.band === 'ready' ||
          synthesisClean.band === 'pending' ||
          synthesisClean.band === 'locked'),
      `${synthesisClean.synthesisIndex}/${synthesisClean.band}`
    );

    push(
      'syn_factors',
      'Directive synthesis exposes weighted factors',
      synthesisClean.factors.length >= 4 &&
        synthesisClean.factors.every(f => f.weight > 0),
      `factors=${synthesisClean.factors.length}`
    );

    const closureClean = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisClean,
      executionPacing: pacing,
      missionDirective: directive,
    });
    push(
      'syn_closure_checks',
      'Execution closure exposes checkpoints',
      closureClean.checkpoints.length >= 5 &&
        closureClean.closureScore >= 0 &&
        closureClean.closureScore <= 100,
      `checks=${closureClean.checkpoints.length} score=${closureClean.closureScore}`
    );

    push(
      'syn_closure_open',
      'Healthy ops yields open or narrow closure',
      closureClean.band === 'open' || closureClean.band === 'narrow',
      closureClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    push(
      'syn_locked_blocks',
      'Governance breach yields locked synthesis or blocks advance',
      synthesisLocked.band === 'locked' ||
        directiveSynthesisBlocksAdvance(synthesisLocked),
      `${synthesisLocked.band} idx=${synthesisLocked.synthesisIndex}`
    );

    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    push(
      'syn_sealed_advance',
      'Sealed closure blocks automation clearance',
      closureSealed.band === 'sealed' ||
        executionClosureBlocksAdvance(closureSealed) ||
        !closureSealed.automationClearance,
      `${closureSealed.band} auto=${closureSealed.automationClearance}`
    );

    push(
      'syn_escalation_link',
      'Urgent escalation propagates to synthesis factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'syn_evaluator_depth',
      'Evaluator attaches directive synthesis and execution closure',
      !!depth?.directiveSynthesis?.headline &&
        !!depth?.executionClosure?.headline &&
        (depth.executionClosure.checkpoints?.length ?? 0) >= 5,
      `${depth?.directiveSynthesis?.band}/${depth?.executionClosure?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('syn_throw', 'Synthesis harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Synthesis Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-cadence-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17CadenceLattice,
  cadenceLatticeBlocksRun,
} from '../planning/cadence-lattice.ts';
  buildAgent17ReadinessGate,
  readinessGateBlocksRun,
} from '../planning/readiness-gate.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17CadenceDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 29,
      day: 29,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'cad_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });

    const cadenceClean = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    push(
      'cad_index_bounded',
      'Cadence lattice bounded with band',
      cadenceClean.cadenceIndex >= 0 &&
        cadenceClean.cadenceIndex <= 100 &&
        (cadenceClean.band === 'flowing' ||
          cadenceClean.band === 'steady' ||
          cadenceClean.band === 'stalled'),
      `${cadenceClean.cadenceIndex}/${cadenceClean.band}`
    );

    push(
      'cad_factors',
      'Cadence lattice exposes weighted factors',
      cadenceClean.factors.length >= 4 &&
        cadenceClean.factors.every(f => f.weight > 0),
      `factors=${cadenceClean.factors.length}`
    );

    const readinessClean = buildAgent17ReadinessGate({
      cadenceLattice: cadenceClean,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    push(
      'cad_readiness_signals',
      'Readiness gate exposes signals',
      readinessClean.signals.length >= 5 &&
        readinessClean.readinessScore >= 0 &&
        readinessClean.readinessScore <= 100,
      `signals=${readinessClean.signals.length} score=${readinessClean.readinessScore}`
    );

    push(
      'cad_readiness_go',
      'Healthy ops yields go or caution readiness',
      readinessClean.band === 'go' || readinessClean.band === 'caution',
      readinessClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    push(
      'cad_stalled_blocks',
      'Governance breach yields stalled cadence or blocks run',
      cadenceStalled.band === 'stalled' || cadenceLatticeBlocksRun(cadenceStalled),
      `${cadenceStalled.band} idx=${cadenceStalled.cadenceIndex}`
    );

    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    push(
      'cad_stop_run',
      'Stop readiness blocks run clearance',
      readinessStop.band === 'stop' ||
        readinessGateBlocksRun(readinessStop) ||
        !readinessStop.runAllowed,
      `${readinessStop.band} run=${readinessStop.runAllowed}`
    );

    push(
      'cad_escalation_link',
      'Urgent escalation propagates to cadence factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging) ||
        directiveSynthesisBlocksAdvance(synthesisLocked),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cad_evaluator_depth',
      'Evaluator attaches cadence lattice and readiness gate',
      !!depth?.cadenceLattice?.headline &&
        !!depth?.readinessGate?.headline &&
        (depth.readinessGate.signals?.length ?? 0) >= 5,
      `${depth?.cadenceLattice?.band}/${depth?.readinessGate?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cad_throw', 'Cadence harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Cadence Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-pulse-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17ContinuityBridge,
  continuityBridgeBlocksHandoff,
} from '../planning/continuity-bridge.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17PulseDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 30,
      day: 30,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'pulse_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });

    const pulseClean = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    push(
      'pls_index_bounded',
      'Pulse index bounded with band',
      pulseClean.pulseIndex >= 0 &&
        pulseClean.pulseIndex <= 100 &&
        (pulseClean.band === 'strong' ||
          pulseClean.band === 'moderate' ||
          pulseClean.band === 'flat'),
      `${pulseClean.pulseIndex}/${pulseClean.band}`
    );

    push(
      'pls_factors',
      'Pulse index exposes weighted factors',
      pulseClean.factors.length >= 4 && pulseClean.factors.every(f => f.weight > 0),
      `factors=${pulseClean.factors.length}`
    );

    const bridgeClean = buildAgent17ContinuityBridge({
      pulseIndex: pulseClean,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    push(
      'pls_bridge_links',
      'Continuity bridge exposes links',
      bridgeClean.links.length >= 5 &&
        bridgeClean.bridgeScore >= 0 &&
        bridgeClean.bridgeScore <= 100,
      `links=${bridgeClean.links.length} score=${bridgeClean.bridgeScore}`
    );

    push(
      'pls_pulse_moderate',
      'Healthy ops yields moderate or strong pulse',
      pulseClean.band === 'moderate' || pulseClean.band === 'strong',
      pulseClean.band
    );

    push(
      'pls_bridge_partial',
      'Healthy ops yields linked or partial bridge',
      bridgeClean.band === 'linked' || bridgeClean.band === 'partial',
      bridgeClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    push(
      'pls_flat_blocks',
      'Governance breach yields flat pulse or blocks continuity',
      pulseFlat.band === 'flat' || pulseIndexBlocksContinuity(pulseFlat),
      `${pulseFlat.band} idx=${pulseFlat.pulseIndex}`
    );

    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    push(
      'pls_broken_handoff',
      'Broken bridge blocks continuity handoff',
      bridgeBroken.band === 'broken' ||
        continuityBridgeBlocksHandoff(bridgeBroken) ||
        !bridgeBroken.continuityClearance,
      `${bridgeBroken.band} clearance=${bridgeBroken.continuityClearance}`
    );

    push(
      'pls_escalation_link',
      'Urgent escalation propagates to pulse factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        readinessGateBlocksRun(readinessStop) ||
        cadenceLatticeBlocksRun(cadenceStalled),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'pls_evaluator_depth',
      'Evaluator attaches pulse index and continuity bridge',
      !!depth?.pulseIndex?.headline &&
        !!depth?.continuityBridge?.headline &&
        (depth.continuityBridge.links?.length ?? 0) >= 5,
      `${depth?.pulseIndex?.band}/${depth?.continuityBridge?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('pls_throw', 'Pulse harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Pulse Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-flux-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17ContinuityBridge,
  continuityBridgeBlocksHandoff,
} from '../planning/continuity-bridge.ts';
  buildAgent17IntegritySeal,
  integritySealBlocksCommit,
} from '../planning/integrity-seal.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17FluxDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 31,
      day: 31,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'flux_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });

    const fluxClean = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    push(
      'flx_index_bounded',
      'Flux index bounded with band',
      fluxClean.fluxIndex >= 0 &&
        fluxClean.fluxIndex <= 100 &&
        (fluxClean.band === 'coherent' ||
          fluxClean.band === 'noisy' ||
          fluxClean.band === 'disrupted'),
      `${fluxClean.fluxIndex}/${fluxClean.band}`
    );

    push(
      'flx_factors',
      'Flux index exposes weighted factors',
      fluxClean.factors.length >= 4 && fluxClean.factors.every(f => f.weight > 0),
      `factors=${fluxClean.factors.length}`
    );

    const sealClean = buildAgent17IntegritySeal({
      fluxIndex: fluxClean,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });
    push(
      'flx_seal_facets',
      'Integrity seal exposes facets',
      sealClean.facets.length >= 5 &&
        sealClean.sealScore >= 0 &&
        sealClean.sealScore <= 100,
      `facets=${sealClean.facets.length} score=${sealClean.sealScore}`
    );

    push(
      'flx_coherent',
      'Healthy ops yields coherent or noisy flux',
      fluxClean.band === 'coherent' || fluxClean.band === 'noisy',
      fluxClean.band
    );

    push(
      'flx_seal_conditional',
      'Healthy ops yields trusted or conditional seal',
      sealClean.band === 'trusted' || sealClean.band === 'conditional',
      sealClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    push(
      'flx_disrupted_blocks',
      'Governance breach yields disrupted flux or blocks seal',
      fluxDisrupted.band === 'disrupted' || fluxIndexBlocksSeal(fluxDisrupted),
      `${fluxDisrupted.band} idx=${fluxDisrupted.fluxIndex}`
    );

    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    push(
      'flx_breached_commit',
      'Breached seal blocks commit clearance',
      sealBreached.band === 'breached' ||
        integritySealBlocksCommit(sealBreached) ||
        !sealBreached.commitAllowed,
      `${sealBreached.band} commit=${sealBreached.commitAllowed}`
    );

    push(
      'flx_escalation_link',
      'Urgent escalation propagates to flux factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging) ||
        directiveSynthesisBlocksAdvance(synthesisLocked),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'flx_evaluator_depth',
      'Evaluator attaches flux index and integrity seal',
      !!depth?.fluxIndex?.headline &&
        !!depth?.integritySeal?.headline &&
        (depth.integritySeal.facets?.length ?? 0) >= 5,
      `${depth?.fluxIndex?.band}/${depth?.integritySeal?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('flx_throw', 'Flux harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Flux Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-covenant-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17CommitLattice,
  commitLatticeBlocksCovenant,
} from '../planning/commit-lattice.ts';
  buildAgent17CovenantGate,
  covenantGateBlocksOps,
} from '../planning/covenant-gate.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17CovenantDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 32,
      day: 32,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'cov_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    const flux = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    const seal = buildAgent17IntegritySeal({
      fluxIndex: flux,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });

    const latticeClean = buildAgent17CommitLattice({
      integritySeal: seal,
      fluxIndex: flux,
      escalationMatrix: matrix,
    });
    push(
      'cov_lattice_bounded',
      'Commit lattice bounded with band',
      latticeClean.latticeScore >= 0 &&
        latticeClean.latticeScore <= 100 &&
        (latticeClean.band === 'bound' ||
          latticeClean.band === 'flex' ||
          latticeClean.band === 'fragmented'),
      `${latticeClean.latticeScore}/${latticeClean.band}`
    );

    push(
      'cov_lattice_strands',
      'Commit lattice exposes weighted strands',
      latticeClean.strands.length >= 4 &&
        latticeClean.strands.every(s => s.weight > 0),
      `strands=${latticeClean.strands.length}`
    );

    const covenantClean = buildAgent17CovenantGate({
      commitLattice: latticeClean,
      planHealth: health,
      rollbackAssurance: assurance,
    });
    push(
      'cov_clauses',
      'Covenant gate exposes clauses',
      covenantClean.clauses.length >= 5 &&
        covenantClean.covenantScore >= 0 &&
        covenantClean.covenantScore <= 100,
      `clauses=${covenantClean.clauses.length} score=${covenantClean.covenantScore}`
    );

    push(
      'cov_lattice_flex',
      'Healthy ops yields bound or flex lattice',
      latticeClean.band === 'bound' || latticeClean.band === 'flex',
      latticeClean.band
    );

    push(
      'cov_upheld',
      'Healthy ops yields upheld or conditional covenant',
      covenantClean.band === 'upheld' || covenantClean.band === 'conditional',
      covenantClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    const latticeFragmented = buildAgent17CommitLattice({
      integritySeal: sealBreached,
      fluxIndex: fluxDisrupted,
      escalationMatrix: matrixUrgent,
    });
    push(
      'cov_fragmented_blocks',
      'Governance breach yields fragmented lattice or blocks covenant',
      latticeFragmented.band === 'fragmented' ||
        commitLatticeBlocksCovenant(latticeFragmented),
      `${latticeFragmented.band} idx=${latticeFragmented.latticeScore}`
    );

    const covenantVoid = buildAgent17CovenantGate({
      commitLattice: latticeFragmented,
      planHealth: assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      rollbackAssurance: assuranceBreach,
    });
    push(
      'cov_void_ops',
      'Void covenant blocks ops clearance',
      covenantVoid.band === 'void' ||
        covenantGateBlocksOps(covenantVoid) ||
        !covenantVoid.opsAllowed,
      `${covenantVoid.band} ops=${covenantVoid.opsAllowed}`
    );

    push(
      'cov_escalation_link',
      'Urgent escalation propagates to lattice strands',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cov_evaluator_depth',
      'Evaluator attaches commit lattice and covenant gate',
      !!depth?.commitLattice?.headline &&
        !!depth?.covenantGate?.headline &&
        (depth.covenantGate.clauses?.length ?? 0) >= 5,
      `${depth?.commitLattice?.band}/${depth?.covenantGate?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cov_throw', 'Covenant harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Covenant Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-mandate-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17MandateWeave,
  mandateWeaveBlocksSovereignty,
} from '../planning/mandate-weave.ts';
  buildAgent17SovereigntyLock,
  sovereigntyLockBlocksCommand,
} from '../planning/sovereignty-lock.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17MandateDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 33,
      day: 33,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'mdt_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    const flux = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    const seal = buildAgent17IntegritySeal({
      fluxIndex: flux,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });
    const lattice = buildAgent17CommitLattice({
      integritySeal: seal,
      fluxIndex: flux,
      escalationMatrix: matrix,
    });
    const covenant = buildAgent17CovenantGate({
      commitLattice: lattice,
      planHealth: health,
      rollbackAssurance: assurance,
    });

    const weaveClean = buildAgent17MandateWeave({
      covenantGate: covenant,
      commitLattice: lattice,
      strategicAlignment: alignment,
    });
    push(
      'mdt_weave_bounded',
      'Mandate weave bounded with band',
      weaveClean.weaveScore >= 0 &&
        weaveClean.weaveScore <= 100 &&
        (weaveClean.band === 'aligned' ||
          weaveClean.band === 'tensioned' ||
          weaveClean.band === 'frayed'),
      `${weaveClean.weaveScore}/${weaveClean.band}`
    );

    push(
      'mdt_weave_threads',
      'Mandate weave exposes weighted threads',
      weaveClean.threads.length >= 4 && weaveClean.threads.every(t => t.weight > 0),
      `threads=${weaveClean.threads.length}`
    );

    const lockClean = buildAgent17SovereigntyLock({
      mandateWeave: weaveClean,
      governanceAudit: audit,
      stabilizationIndex: stabilization,
    });
    push(
      'mdt_lock_pins',
      'Sovereignty lock exposes pins',
      lockClean.pins.length >= 5 &&
        lockClean.lockScore >= 0 &&
        lockClean.lockScore <= 100,
      `pins=${lockClean.pins.length} score=${lockClean.lockScore}`
    );

    push(
      'mdt_weave_aligned',
      'Healthy ops yields aligned or tensioned weave',
      weaveClean.band === 'aligned' || weaveClean.band === 'tensioned',
      weaveClean.band
    );

    push(
      'mdt_lock_conditional',
      'Healthy ops yields secured or conditional lock',
      lockClean.band === 'secured' || lockClean.band === 'conditional',
      lockClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    const latticeFragmented = buildAgent17CommitLattice({
      integritySeal: sealBreached,
      fluxIndex: fluxDisrupted,
      escalationMatrix: matrixUrgent,
    });
    const covenantVoid = buildAgent17CovenantGate({
      commitLattice: latticeFragmented,
      planHealth: assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      rollbackAssurance: assuranceBreach,
    });
    const weaveFrayed = buildAgent17MandateWeave({
      covenantGate: covenantVoid,
      commitLattice: latticeFragmented,
      strategicAlignment: alignment,
    });
    push(
      'mdt_frayed_blocks',
      'Governance breach yields frayed weave or blocks sovereignty',
      weaveFrayed.band === 'frayed' || mandateWeaveBlocksSovereignty(weaveFrayed),
      `${weaveFrayed.band} idx=${weaveFrayed.weaveScore}`
    );

    const lockReleased = buildAgent17SovereigntyLock({
      mandateWeave: weaveFrayed,
      governanceAudit: auditBreach,
      stabilizationIndex: stabilizationVolatile,
    });
    push(
      'mdt_released_command',
      'Released lock blocks command sovereignty',
      lockReleased.band === 'released' ||
        sovereigntyLockBlocksCommand(lockReleased) ||
        !lockReleased.commandSovereignty,
      `${lockReleased.band} sov=${lockReleased.commandSovereignty}`
    );

    push(
      'mdt_escalation_link',
      'Urgent escalation propagates to weave threads',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'mdt_evaluator_depth',
      'Evaluator attaches mandate weave and sovereignty lock',
      !!depth?.mandateWeave?.headline &&
        !!depth?.sovereigntyLock?.headline &&
        (depth.sovereigntyLock.pins?.length ?? 0) >= 5,
      `${depth?.mandateWeave?.band}/${depth?.sovereigntyLock?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('mdt_throw', 'Mandate harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Mandate Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-authority-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17MandateWeave,
  mandateWeaveBlocksSovereignty,
} from '../planning/mandate-weave.ts';
  buildAgent17SovereigntyLock,
  sovereigntyLockBlocksCommand,
} from '../planning/sovereignty-lock.ts';
  buildAgent17AuthorityCharter,
  authorityCharterBlocksAccord,
} from '../planning/authority-charter.ts';
  buildAgent17DispatchAccord,
  dispatchAccordBlocksDispatch,
} from '../planning/dispatch-accord.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17AuthorityDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 33,
      day: 33,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'adt_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    const flux = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    const seal = buildAgent17IntegritySeal({
      fluxIndex: flux,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });
    const lattice = buildAgent17CommitLattice({
      integritySeal: seal,
      fluxIndex: flux,
      escalationMatrix: matrix,
    });
    const covenant = buildAgent17CovenantGate({
      commitLattice: lattice,
      planHealth: health,
      rollbackAssurance: assurance,
    });

    const weaveClean = buildAgent17MandateWeave({
      covenantGate: covenant,
      commitLattice: lattice,
      strategicAlignment: alignment,
    });
    push(
      'adt_weave_bounded',
      'Mandate weave bounded with band',
      weaveClean.weaveScore >= 0 &&
        weaveClean.weaveScore <= 100 &&
        (weaveClean.band === 'aligned' ||
          weaveClean.band === 'tensioned' ||
          weaveClean.band === 'frayed'),
      `${weaveClean.weaveScore}/${weaveClean.band}`
    );

    push(
      'adt_weave_threads',
      'Mandate weave exposes weighted threads',
      weaveClean.threads.length >= 4 && weaveClean.threads.every(t => t.weight > 0),
      `threads=${weaveClean.threads.length}`
    );

    const lockClean = buildAgent17SovereigntyLock({
      mandateWeave: weaveClean,
      governanceAudit: audit,
      stabilizationIndex: stabilization,
    });
    push(
      'adt_lock_pins',
      'Sovereignty lock exposes pins',
      lockClean.pins.length >= 5 &&
        lockClean.lockScore >= 0 &&
        lockClean.lockScore <= 100,
      `pins=${lockClean.pins.length} score=${lockClean.lockScore}`
    );

    push(
      'adt_weave_aligned',
      'Healthy ops yields aligned or tensioned weave',
      weaveClean.band === 'aligned' || weaveClean.band === 'tensioned',
      weaveClean.band
    );

    push(
      'adt_lock_conditional',
      'Healthy ops yields secured or conditional lock',
      lockClean.band === 'secured' || lockClean.band === 'conditional',
      lockClean.band
    );

    const charterClean = buildAgent17AuthorityCharter({
      sovereigntyLock: lockClean,
      mandateWeave: weaveClean,
      commandPosture: posture,
    });
    push(
      'adt_charter_bounded',
      'Authority charter bounded with band',
      charterClean.charterScore >= 0 &&
        charterClean.charterScore <= 100 &&
        (charterClean.band === 'chartered' ||
          charterClean.band === 'provisional' ||
          charterClean.band === 'revoked'),
      `${charterClean.charterScore}/${charterClean.band}`
    );

    push(
      'adt_charter_articles',
      'Authority charter exposes articles',
      charterClean.articles.length >= 5 &&
        charterClean.articles.every(a => a.weight > 0),
      `articles=${charterClean.articles.length}`
    );

    const accordClean = buildAgent17DispatchAccord({
      authorityCharter: charterClean,
      sovereigntyLock: lockClean,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_accord_provisions',
      'Dispatch accord exposes provisions',
      accordClean.provisions.length >= 5 &&
        accordClean.accordScore >= 0 &&
        accordClean.accordScore <= 100,
      `provisions=${accordClean.provisions.length} score=${accordClean.accordScore}`
    );

    push(
      'adt_accord_ratified',
      'Healthy ops yields ratified or provisional accord',
      accordClean.band === 'ratified' || accordClean.band === 'provisional',
      accordClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    const latticeFragmented = buildAgent17CommitLattice({
      integritySeal: sealBreached,
      fluxIndex: fluxDisrupted,
      escalationMatrix: matrixUrgent,
    });
    const covenantVoid = buildAgent17CovenantGate({
      commitLattice: latticeFragmented,
      planHealth: assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      rollbackAssurance: assuranceBreach,
    });
    const weaveFrayed = buildAgent17MandateWeave({
      covenantGate: covenantVoid,
      commitLattice: latticeFragmented,
      strategicAlignment: alignment,
    });
    push(
      'adt_frayed_blocks',
      'Governance breach yields frayed weave or blocks sovereignty',
      weaveFrayed.band === 'frayed' || mandateWeaveBlocksSovereignty(weaveFrayed),
      `${weaveFrayed.band} idx=${weaveFrayed.weaveScore}`
    );

    const lockReleased = buildAgent17SovereigntyLock({
      mandateWeave: weaveFrayed,
      governanceAudit: auditBreach,
      stabilizationIndex: stabilizationVolatile,
    });
    push(
      'adt_released_command',
      'Released lock blocks command sovereignty',
      lockReleased.band === 'released' ||
        sovereigntyLockBlocksCommand(lockReleased) ||
        !lockReleased.commandSovereignty,
      `${lockReleased.band} sov=${lockReleased.commandSovereignty}`
    );

    push(
      'adt_escalation_link',
      'Urgent escalation propagates to weave threads',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const charterRevoked = buildAgent17AuthorityCharter({
      sovereigntyLock: lockReleased,
      mandateWeave: weaveFrayed,
      commandPosture: posture,
    });
    push(
      'adt_revoked_blocks',
      'Released sovereignty yields revoked charter or blocks accord',
      charterRevoked.band === 'revoked' || authorityCharterBlocksAccord(charterRevoked),
      `${charterRevoked.band} auth=${charterRevoked.commandAuthority}`
    );

    const accordVoid = buildAgent17DispatchAccord({
      authorityCharter: charterRevoked,
      sovereigntyLock: lockReleased,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_void_dispatch',
      'Void accord blocks dispatch',
      accordVoid.band === 'void' ||
        dispatchAccordBlocksDispatch(accordVoid) ||
        !accordVoid.dispatchAllowed,
      `${accordVoid.band} dispatch=${accordVoid.dispatchAllowed}`
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'adt_evaluator_depth',
      'Evaluator attaches authority charter and dispatch accord',
      !!depth?.authorityCharter?.headline &&
        !!depth?.dispatchAccord?.headline &&
        (depth.authorityCharter.articles?.length ?? 0) >= 5 &&
        (depth.dispatchAccord.provisions?.length ?? 0) >= 5,
      `${depth?.authorityCharter?.band}/${depth?.dispatchAccord?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('adt_throw', 'Mandate harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Authority Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-operations-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
  buildAgent17MandateWeave,
  mandateWeaveBlocksSovereignty,
} from '../planning/mandate-weave.ts';
  buildAgent17SovereigntyLock,
  sovereigntyLockBlocksCommand,
} from '../planning/sovereignty-lock.ts';
  buildAgent17AuthorityCharter,
  authorityCharterBlocksAccord,
} from '../planning/authority-charter.ts';
  buildAgent17DispatchAccord,
  dispatchAccordBlocksDispatch,
} from '../planning/dispatch-accord.ts';
  buildAgent17MobilizationIndex,
  mobilizationIndexBlocksSummons,
} from '../planning/mobilization-index.ts';
  buildAgent17ExecutionSummons,
  executionSummonsBlocksField,
} from '../planning/execution-summons.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17OperationsDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 33,
      day: 33,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'adt_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    const flux = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    const seal = buildAgent17IntegritySeal({
      fluxIndex: flux,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });
    const lattice = buildAgent17CommitLattice({
      integritySeal: seal,
      fluxIndex: flux,
      escalationMatrix: matrix,
    });
    const covenant = buildAgent17CovenantGate({
      commitLattice: lattice,
      planHealth: health,
      rollbackAssurance: assurance,
    });

    const weaveClean = buildAgent17MandateWeave({
      covenantGate: covenant,
      commitLattice: lattice,
      strategicAlignment: alignment,
    });
    push(
      'adt_weave_bounded',
      'Mandate weave bounded with band',
      weaveClean.weaveScore >= 0 &&
        weaveClean.weaveScore <= 100 &&
        (weaveClean.band === 'aligned' ||
          weaveClean.band === 'tensioned' ||
          weaveClean.band === 'frayed'),
      `${weaveClean.weaveScore}/${weaveClean.band}`
    );

    push(
      'adt_weave_threads',
      'Mandate weave exposes weighted threads',
      weaveClean.threads.length >= 4 && weaveClean.threads.every(t => t.weight > 0),
      `threads=${weaveClean.threads.length}`
    );

    const lockClean = buildAgent17SovereigntyLock({
      mandateWeave: weaveClean,
      governanceAudit: audit,
      stabilizationIndex: stabilization,
    });
    push(
      'adt_lock_pins',
      'Sovereignty lock exposes pins',
      lockClean.pins.length >= 5 &&
        lockClean.lockScore >= 0 &&
        lockClean.lockScore <= 100,
      `pins=${lockClean.pins.length} score=${lockClean.lockScore}`
    );

    push(
      'adt_weave_aligned',
      'Healthy ops yields aligned or tensioned weave',
      weaveClean.band === 'aligned' || weaveClean.band === 'tensioned',
      weaveClean.band
    );

    push(
      'adt_lock_conditional',
      'Healthy ops yields secured or conditional lock',
      lockClean.band === 'secured' || lockClean.band === 'conditional',
      lockClean.band
    );

    const charterClean = buildAgent17AuthorityCharter({
      sovereigntyLock: lockClean,
      mandateWeave: weaveClean,
      commandPosture: posture,
    });
    push(
      'adt_charter_bounded',
      'Authority charter bounded with band',
      charterClean.charterScore >= 0 &&
        charterClean.charterScore <= 100 &&
        (charterClean.band === 'chartered' ||
          charterClean.band === 'provisional' ||
          charterClean.band === 'revoked'),
      `${charterClean.charterScore}/${charterClean.band}`
    );

    push(
      'adt_charter_articles',
      'Authority charter exposes articles',
      charterClean.articles.length >= 5 &&
        charterClean.articles.every(a => a.weight > 0),
      `articles=${charterClean.articles.length}`
    );

    const accordClean = buildAgent17DispatchAccord({
      authorityCharter: charterClean,
      sovereigntyLock: lockClean,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_accord_provisions',
      'Dispatch accord exposes provisions',
      accordClean.provisions.length >= 5 &&
        accordClean.accordScore >= 0 &&
        accordClean.accordScore <= 100,
      `provisions=${accordClean.provisions.length} score=${accordClean.accordScore}`
    );

    push(
      'adt_accord_ratified',
      'Healthy ops yields ratified or provisional accord',
      accordClean.band === 'ratified' || accordClean.band === 'provisional',
      accordClean.band
    );

    const mobilizationClean = buildAgent17MobilizationIndex({
      dispatchAccord: accordClean,
      coordinationBrief: brief,
      executionPacing: pacing,
    });
    push(
      'odt_mobilization_bounded',
      'Mobilization index bounded with band',
      mobilizationClean.mobilizationScore >= 0 &&
        mobilizationClean.mobilizationScore <= 100 &&
        (mobilizationClean.band === 'mobilized' ||
          mobilizationClean.band === 'forming' ||
          mobilizationClean.band === 'stalled'),
      `${mobilizationClean.mobilizationScore}/${mobilizationClean.band}`
    );

    push(
      'odt_mobilization_vectors',
      'Mobilization index exposes vectors',
      mobilizationClean.vectors.length >= 5 &&
        mobilizationClean.vectors.every(v => v.weight > 0),
      `vectors=${mobilizationClean.vectors.length}`
    );

    const summonsClean = buildAgent17ExecutionSummons({
      mobilizationIndex: mobilizationClean,
      dispatchAccord: accordClean,
      missionDirective: directive,
    });
    push(
      'odt_summons_clauses',
      'Execution summons exposes clauses',
      summonsClean.clauses.length >= 5 &&
        summonsClean.summonsScore >= 0 &&
        summonsClean.summonsScore <= 100,
      `clauses=${summonsClean.clauses.length} score=${summonsClean.summonsScore}`
    );

    push(
      'odt_summons_issued',
      'Healthy ops yields issued or pending summons',
      summonsClean.band === 'issued' || summonsClean.band === 'pending',
      summonsClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    const latticeFragmented = buildAgent17CommitLattice({
      integritySeal: sealBreached,
      fluxIndex: fluxDisrupted,
      escalationMatrix: matrixUrgent,
    });
    const covenantVoid = buildAgent17CovenantGate({
      commitLattice: latticeFragmented,
      planHealth: assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      rollbackAssurance: assuranceBreach,
    });
    const weaveFrayed = buildAgent17MandateWeave({
      covenantGate: covenantVoid,
      commitLattice: latticeFragmented,
      strategicAlignment: alignment,
    });
    push(
      'adt_frayed_blocks',
      'Governance breach yields frayed weave or blocks sovereignty',
      weaveFrayed.band === 'frayed' || mandateWeaveBlocksSovereignty(weaveFrayed),
      `${weaveFrayed.band} idx=${weaveFrayed.weaveScore}`
    );

    const lockReleased = buildAgent17SovereigntyLock({
      mandateWeave: weaveFrayed,
      governanceAudit: auditBreach,
      stabilizationIndex: stabilizationVolatile,
    });
    push(
      'adt_released_command',
      'Released lock blocks command sovereignty',
      lockReleased.band === 'released' ||
        sovereigntyLockBlocksCommand(lockReleased) ||
        !lockReleased.commandSovereignty,
      `${lockReleased.band} sov=${lockReleased.commandSovereignty}`
    );

    push(
      'adt_escalation_link',
      'Urgent escalation propagates to weave threads',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const charterRevoked = buildAgent17AuthorityCharter({
      sovereigntyLock: lockReleased,
      mandateWeave: weaveFrayed,
      commandPosture: posture,
    });
    push(
      'adt_revoked_blocks',
      'Released sovereignty yields revoked charter or blocks accord',
      charterRevoked.band === 'revoked' || authorityCharterBlocksAccord(charterRevoked),
      `${charterRevoked.band} auth=${charterRevoked.commandAuthority}`
    );

    const accordVoid = buildAgent17DispatchAccord({
      authorityCharter: charterRevoked,
      sovereigntyLock: lockReleased,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_void_dispatch',
      'Void accord blocks dispatch',
      accordVoid.band === 'void' ||
        dispatchAccordBlocksDispatch(accordVoid) ||
        !accordVoid.dispatchAllowed,
      `${accordVoid.band} dispatch=${accordVoid.dispatchAllowed}`
    );

    const mobilizationStalled = buildAgent17MobilizationIndex({
      dispatchAccord: accordVoid,
      coordinationBrief: brief,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    push(
      'odt_stalled_blocks',
      'Void accord yields stalled mobilization or blocks summons',
      mobilizationStalled.band === 'stalled' ||
        mobilizationIndexBlocksSummons(mobilizationStalled) ||
        !mobilizationStalled.fieldReady,
      `${mobilizationStalled.band} ready=${mobilizationStalled.fieldReady}`
    );

    const summonsRevoked = buildAgent17ExecutionSummons({
      mobilizationIndex: mobilizationStalled,
      dispatchAccord: accordVoid,
      missionDirective: directiveHeld,
    });
    push(
      'odt_revoked_field',
      'Stalled mobilization yields revoked summons or blocks field',
      summonsRevoked.band === 'revoked' ||
        executionSummonsBlocksField(summonsRevoked) ||
        !summonsRevoked.executionAuthorized,
      `${summonsRevoked.band} auth=${summonsRevoked.executionAuthorized}`
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'odt_evaluator_depth',
      'Evaluator attaches mobilization index and execution summons',
      !!depth?.mobilizationIndex?.headline &&
        !!depth?.executionSummons?.headline &&
        (depth.mobilizationIndex.vectors?.length ?? 0) >= 5 &&
        (depth.executionSummons.clauses?.length ?? 0) >= 5,
      `${depth?.mobilizationIndex?.band}/${depth?.executionSummons?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('odt_throw', 'Operations harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Operations Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


export function runAgent17Op10mModuleSelfTests(): {
  acc17: ReturnType<typeof runAgent17Acc17DevTests>;
  recovery: ReturnType<typeof runAgent17RecoveryPathTests>;
  depth: ReturnType<typeof runAgent17PlanningDepthTests>;
  delegation: ReturnType<typeof runAgent17DelegationDepthTests>;
  coordination: ReturnType<typeof runAgent17CoordinationDepthTests>;
  execution: ReturnType<typeof runAgent17ExecutionDepthTests>;
  continuity: ReturnType<typeof runAgent17ContinuityDepthTests>;
  governance: ReturnType<typeof runAgent17GovernanceDepthTests>;
  assurance: ReturnType<typeof runAgent17AssuranceDepthTests>;
  success: boolean;
} {
  const acc17 = runAgent17Acc17DevTests();
  const recovery = runAgent17RecoveryPathTests();
  const depth = runAgent17PlanningDepthTests();
  const delegation = runAgent17DelegationDepthTests();
  const coordination = runAgent17CoordinationDepthTests();
  const execution = runAgent17ExecutionDepthTests();
  const continuity = runAgent17ContinuityDepthTests();
  const governance = runAgent17GovernanceDepthTests();
  const assurance = runAgent17AssuranceDepthTests();
  return {
    acc17,
    recovery,
    depth,
    delegation,
    coordination,
    execution,
    continuity,
    governance,
    assurance,
    success:
      acc17.success &&
      recovery.success &&
      depth.success &&
      delegation.success &&
      coordination.success &&
      execution.success &&
      continuity.success &&
      governance.success &&
      assurance.success,
  };
}

// OP10M_MODULE_END agent-17-command-center
