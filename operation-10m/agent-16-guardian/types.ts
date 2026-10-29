/** Agent 16 — Guardian & Co-Pilot advisory types (Operation 10M). */

export type AdvisoryOpsKind = 'monitor' | 'advice' | 'alert';
export type AdvisorySeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface AdvisoryGroundingEvidence {
  field: keyof GuardianCoPilotMonitorSnapshot;
  label: string;
  value: string | number | boolean | null;
}

export interface AdvisoryRecommendation {
  id: string;
  kind: AdvisoryOpsKind;
  severity: AdvisorySeverity;
  category: string;
  title: string;
  detail: string;
  recommendationOnly: true;
  mayExecute: false;
  grounding: AdvisoryGroundingEvidence[];
  stateVerified: boolean;
  suggestedFollowUp?: string;
  deepLink?: { tab?: string; section?: string };
  dedupeKey: string;
  turn: number;
  day: number;
  actorId: string;
  ruleId: string;
}

export interface GuardianCoPilotMonitorSnapshot {
  turn: number;
  day: number;
  actorId: string;
  cash: number;
  debt: number;
  apRemaining: number;
  apPerDay: number;
  actionsUsedThisTurn: number;
  region: string;
  guardianEnabled: boolean;
  guardianProtectionLevel: string;
  guardianResponseMode: string;
  copilotEnabled: boolean;
  copilotAuthorityMode: string;
  copilotHoldsControl: boolean;
  copilotAutonomousActive: boolean;
  takeoverSessionActive: boolean;
  takeoverSessionAgeTurns: number;
  minCashReserve: number;
  maxSpendPerAction: number;
  blockedContinueCount: number;
  guardianReplayCount: number;
  activeContractCount: number;
  expiringContractCount: number;
  teamPlanPending: boolean;
  objectiveRegion: string | null;
  objectiveActive: boolean;
  objectivePrimaryLabel: string | null;
  objectiveTargetRegion: string | null;
  objectiveProgressPct: number | null;
  objectiveTurnsRemaining: number | null;
  playerInObjectiveRegion: boolean;
  rivalVictoryProgressPct: number | null;
  victoryThresholdPct: number;
  guardianRequiresConfirmation: boolean;
  guardianProtectionMaximum: boolean;
  guardianAutomationLikelyBlocked: boolean;
  guardianConfirmationLikelyRequired: boolean;
  guardianRiskScore: number;
  guardianRiskBand: 'low' | 'elevated' | 'critical';
  copilotSpendingHeadroom: number;
  objectiveBehindSchedule: boolean;
  liquidityStressIndex: number;
  copilotTrustGapScore: number;
  objectivePacePct: number | null;
  compositePressureIndex: number;
  automationReadinessScore: number;
  actionBurnPressure: number;
  advisorySaturationIndex: number;
  escalationLatchScore: number;
  governanceCoherenceScore: number;
  containmentBurdenIndex: number;
  humanRelayPressure: number;
  recoveryHeadroomScore: number;
  advisoryDepletionIndex: number;
  operatorBandwidthScore: number;
  continuityMarginScore: number;
  stewardshipLoadIndex: number;
  oversightCommitmentScore: number;
  sustainabilityMarginScore: number;
  accountabilityLoadIndex: number;
  delegationFidelityScore: number;
  governanceEnduranceScore: number;
  fiduciaryBurdenIndex: number;
  trustAssuranceScore: number;
  governanceDurabilityScore: number;
  covenantStrainIndex: number;
  mandateIntegrityScore: number;
  governanceTenacityScore: number;
  charterStrainIndex: number;
  authorityIntegrityScore: number;
  governancePersistenceScore: number;
  legitimacyStrainIndex: number;
  oversightIntegrityScore: number;
  governanceContinuityScore: number;
  complianceStrainIndex: number;
  policyIntegrityScore: number;
  governanceResilienceScore: number;
  auditStrainIndex: number;
  controlIntegrityScore: number;
  governanceStabilityScore: number;
  assuranceStrainIndex: number;
  evidenceIntegrityScore: number;
  governanceConfidenceScore: number;
  attestationStrainIndex: number;
  attestationIntegrityScore: number;
  governanceReliabilityScore: number;
  verificationStrainIndex: number;
  verificationIntegrityScore: number;
  governanceValidityScore: number;
  validationStrainIndex: number;
  validationIntegrityScore: number;
  governanceSoundnessScore: number;
  certificationStrainIndex: number;
  certificationIntegrityScore: number;
  governanceAuthenticityScore: number;
  accreditationStrainIndex: number;
  accreditationIntegrityScore: number;
  governanceCredibilityScore: number;
  endorsementStrainIndex: number;
  endorsementIntegrityScore: number;
  governanceTrustworthinessScore: number;
  ratificationStrainIndex: number;
  ratificationIntegrityScore: number;
  governanceDependabilityScore: number;
  authorizationStrainIndex: number;
  authorizationIntegrityScore: number;
  governanceSteadfastnessScore: number;
  affirmationStrainIndex: number;
  affirmationIntegrityScore: number;
  governanceResolutenessScore: number;
  sanctionStrainIndex: number;
  sanctionIntegrityScore: number;
  governanceFirmnessScore: number;
  warrantStrainIndex: number;
  warrantIntegrityScore: number;
  governanceConstancyScore: number;
  clearanceStrainIndex: number;
  clearanceIntegrityScore: number;
  governancePerseveranceScore: number;
  dispensationStrainIndex: number;
  dispensationIntegrityScore: number;
  governanceFortitudeScore: number;
  indulgenceStrainIndex: number;
  indulgenceIntegrityScore: number;
  governanceVigorScore: number;
  exemptionStrainIndex: number;
  exemptionIntegrityScore: number;
  governanceStaminaScore: number;
  remissionStrainIndex: number;
  remissionIntegrityScore: number;
  governanceMettleScore: number;
  absolutionStrainIndex: number;
  absolutionIntegrityScore: number;
  governanceGritScore: number;
  amnestyStrainIndex: number;
  amnestyIntegrityScore: number;
  governanceResolveScore: number;
  pardonStrainIndex: number;
  pardonIntegrityScore: number;
  governanceZealScore: number;
  clemencyStrainIndex: number;
  clemencyIntegrityScore: number;
  governancePluckScore: number;
  reprieveStrainIndex: number;
  reprieveIntegrityScore: number;
  governanceNerveScore: number;
  acquittalStrainIndex: number;
  acquittalIntegrityScore: number;
  governanceMoxieScore: number;
  exonerationStrainIndex: number;
  exonerationIntegrityScore: number;
  governanceSpunkScore: number;
  vindicationStrainIndex: number;
  vindicationIntegrityScore: number;
  governanceDashScore: number;
  justificationStrainIndex: number;
  justificationIntegrityScore: number;
  governanceBrioScore: number;
  legitimationStrainIndex: number;
  legitimationIntegrityScore: number;
  governancePepScore: number;
  substantiationStrainIndex: number;
  substantiationIntegrityScore: number;
  governanceZestScore: number;
  corroborationStrainIndex: number;
  corroborationIntegrityScore: number;
  governanceElanScore: number;
  authenticationStrainIndex: number;
  authenticationIntegrityScore: number;
  governanceVerveScore: number;
  identificationStrainIndex: number;
  identificationIntegrityScore: number;
  governancePanacheScore: number;
  delegationStrainIndex: number;
  delegationIntegrityScore: number;
  governanceFlairScore: number;
  empowermentStrainIndex: number;
  empowermentIntegrityScore: number;
  governanceGustoScore: number;
  entrustmentStrainIndex: number;
  entrustmentIntegrityScore: number;
  governanceVimScore: number;
  assignmentStrainIndex: number;
  assignmentIntegrityScore: number;
  governanceVivacityScore: number;
}

export interface GuardianCoPilotAdvisoryCycleResult {
  snapshot: GuardianCoPilotMonitorSnapshot;
  recommendations: AdvisoryRecommendation[];
  alerts: AdvisoryRecommendation[];
  monitors: AdvisoryRecommendation[];
  advice: AdvisoryRecommendation[];
  generatedAtTurn: number;
  policy: typeof import('./policy.js').ADVISORY_OPS_POLICY;
}

export interface BuildMonitorSnapshotInput {
  gameState: Record<string, unknown>;
  player?: Record<string, unknown>;
  gameSettings?: Record<string, unknown>;
  takeoverSession?: { status?: string; startedTurn?: number } | null;
}

export type CommunicationAutonomyLevel = 'advisory' | 'assisted' | 'delegated' | string;

export interface AiSuggestedAction {
  id: string;
  type: string;
  label: string;
  status: 'proposed' | 'approved' | 'rejected' | 'executed' | 'blocked';
}

export interface TeamStrategicPlan {
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_approval' | string;
}

export interface CoPilotCandidateEvaluationResult {
  topRecommendation?: Record<string, unknown> | null;
  candidates?: Record<string, unknown>[];
}

export interface AdvisoryScenarioDescriptor {
  id: string;
  category: string;
  snapshot: Partial<GuardianCoPilotMonitorSnapshot>;
  expectRuleIds: string[];
  notes: string;
}

export interface Agent16SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export type AdvisoryMonitorRule = {
  id: string;
  category: string;
  kind: AdvisoryOpsKind;
  defaultSeverity: AdvisorySeverity;
  title: string;
  detailTemplate: string;
  evidenceFields: (keyof GuardianCoPilotMonitorSnapshot)[];
  evaluate: (s: GuardianCoPilotMonitorSnapshot) => boolean;
  followUp?: string;
  deepLink?: { tab?: string; section?: string };
};
