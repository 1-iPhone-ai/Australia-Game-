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
