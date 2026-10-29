// OP10M_MODULE_BEGIN agent-16-guardian
// Agent 16 — Guardian AI & Human Co-Pilot advisory ops (generated; source: operation-10m/agent-16-guardian/)

// --- source: types.ts ---
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


// --- source: policy.ts ---
/** Agent 16 advisory mandate — recommendations never execute. */

export const ADVISORY_OPS_POLICY = {
  mandate: 'recommendations_only',
  mayExecuteActions: false,
  mayMutateGameState: false,
  mayWidenPermissions: false,
  mayBypassGuardian: false,
  mayAutoEndTurn: false,
} as const;

export const COPILOT_MAX_BLOCKED_CONTINUES = 2;


// --- source: grounding.ts ---

const FIELD_LABELS: Partial<Record<keyof GuardianCoPilotMonitorSnapshot, string>> = {
  cash: 'Cash on hand',
  debt: 'Outstanding debt',
  apRemaining: 'Action points remaining',
  minCashReserve: 'Co-Pilot minimum cash reserve',
  maxSpendPerAction: 'Co-Pilot max spend per action',
  copilotHoldsControl: 'Co-Pilot holds control',
  blockedContinueCount: 'Co-Pilot blocked continue count',
  guardianEnabled: 'Guardian AI enabled',
  guardianResponseMode: 'Guardian response mode',
  guardianReplayCount: 'Guardian replay events',
  expiringContractCount: 'Contracts expiring within 2 turns',
  teamPlanPending: 'Team plan pending approval',
  objectiveRegion: 'Objective region',
  region: 'Current region',
  objectiveActive: 'Primary objective active',
  objectivePrimaryLabel: 'Primary objective label',
  objectiveTargetRegion: 'Objective target region',
  objectiveProgressPct: 'Objective progress %',
  objectiveTurnsRemaining: 'Objective turns remaining',
  playerInObjectiveRegion: 'Player in objective region',
  rivalVictoryProgressPct: 'Rival victory progress %',
  victoryThresholdPct: 'Victory threshold %',
  guardianRequiresConfirmation: 'Guardian requires confirmation',
  guardianProtectionMaximum: 'Guardian maximum protection',
  guardianProtectionLevel: 'Guardian protection level',
  guardianAutomationLikelyBlocked: 'Guardian may block automation',
  guardianConfirmationLikelyRequired: 'Guardian confirmation likely',
  guardianRiskScore: 'Guardian risk score',
  guardianRiskBand: 'Guardian risk band',
  copilotSpendingHeadroom: 'Co-Pilot spending headroom',
  objectiveBehindSchedule: 'Objective behind schedule',
  liquidityStressIndex: 'Liquidity stress index',
  copilotTrustGapScore: 'Co-Pilot trust gap score',
  objectivePacePct: 'Objective pace % per turn',
  compositePressureIndex: 'Composite advisory pressure index',
  automationReadinessScore: 'Co-Pilot automation readiness score',
  actionBurnPressure: 'Action burn pressure index',
};

export function formatSnapshotValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
}

export function buildGroundingForRule(
  rule: AdvisoryMonitorRule,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation['grounding'] {
  return rule.evidenceFields.map(field => ({
    field,
    label: FIELD_LABELS[field] || field,
    value: formatSnapshotValue(snapshot[field]),
  }));
}

export function enrichDetailWithGrounding(
  template: string,
  grounding: AdvisoryRecommendation['grounding']
): string {
  if (!grounding.length) return template;
  const facts = grounding
    .slice(0, 4)
    .map(g => `${g.label}: ${g.value === null ? '—' : g.value}`)
    .join(' · ');
  return `${template} (${facts})`;
}

/** Re-run rule predicate — warnings must still match live snapshot fields. */
export function verifyStateVerifiedWarning(
  rec: AdvisoryRecommendation,
  snapshot: GuardianCoPilotMonitorSnapshot,
  rule: AdvisoryMonitorRule
): boolean {
  try {
    return rule.evaluate(snapshot);
  } catch {
    return false;
  }
}

export function verifyAdvisoryGrounding(
  rec: AdvisoryRecommendation,
  snapshot: GuardianCoPilotMonitorSnapshot
): boolean {
  if (!rec.grounding.length) return false;
  return rec.grounding.every(g => {
    const live = snapshot[g.field];
    const formatted = formatSnapshotValue(live);
    return formatted === g.value || String(formatted) === String(g.value);
  });
}

export function assertAdvisoryRecommendationOnly(rec: AdvisoryRecommendation): boolean {
  return (
    rec.recommendationOnly === true &&
    rec.mayExecute === false &&
    ADVISORY_OPS_POLICY.mayExecuteActions === false &&
    rec.stateVerified === true &&
    rec.grounding.length > 0
  );
}


// --- source: suggestion-gate.ts ---

/** Co-Pilot / team suggested actions — never auto-execute on the advisory path. */

export function evaluateSuggestedActionGate(params: {
  autonomy: CommunicationAutonomyLevel | string;
  copilotEnabled: boolean;
  copilotAuthority?: string;
  plan?: TeamStrategicPlan | null;
  action: AiSuggestedAction;
  alreadyCommittedIds: string[];
}): { allowed: boolean; needsApproval: boolean; reason: string | null } {
  if (params.alreadyCommittedIds.includes(params.action.id)) {
    return { allowed: false, needsApproval: false, reason: 'This suggested action was already handled.' };
  }
  if (params.action.status === 'rejected' || params.action.status === 'executed') {
    return { allowed: false, needsApproval: false, reason: `This suggestion is already ${params.action.status}.` };
  }
  if (params.autonomy === 'advisory') {
    return {
      allowed: false,
      needsApproval: false,
      reason: 'Advisory communication only explains — it never acts. Switch autonomy to Assisted to approve suggestions.',
    };
  }
  if (params.plan && (params.plan.status === 'paused' || params.plan.status === 'cancelled')) {
    return {
      allowed: false,
      needsApproval: false,
      reason: `The team plan is ${params.plan.status}, so plan-driven suggestions are on hold.`,
    };
  }
  if (params.autonomy === 'assisted') return { allowed: true, needsApproval: true, reason: null };
  if (!params.copilotEnabled) {
    return {
      allowed: true,
      needsApproval: true,
      reason: 'Delegated actions still need the Co-Pilot; approval required while it is off.',
    };
  }
  if (params.autonomy === 'delegated') return { allowed: true, needsApproval: true, reason: null };
  return { allowed: true, needsApproval: false, reason: null };
}

export function markSuggestedAction(
  action: AiSuggestedAction,
  status: AiSuggestedAction['status'],
  committedIds: string[]
): { action: AiSuggestedAction; committedIds: string[]; executed: boolean } {
  const already = committedIds.includes(action.id);
  if (status === 'executed' && already) return { action, committedIds, executed: false };
  const commit = status === 'executed' || status === 'rejected';
  return {
    action: { ...action, status },
    committedIds: commit && !already ? [...committedIds, action.id].slice(-100) : committedIds,
    executed: status === 'executed',
  };
}

export function describeSuggestedActionOutcome(action: AiSuggestedAction): string {
  switch (action.status) {
    case 'executed':
      return `Done: ${action.label}. It went through the normal team-directive path.`;
    case 'approved':
      return `Sent for approval: ${action.label}. Nothing happens until you confirm in Co-Pilot.`;
    case 'rejected':
      return `Rejected: ${action.label}. Nothing was changed.`;
    case 'blocked':
      return `Not executed: ${action.label}. Advisory communication never acts on its own.`;
    default:
      return `Suggestion: ${action.label}. Approve or reject it; nothing happens automatically.`;
  }
}

export function stripExecutionFromCoPilotCandidate<T extends { execute?: unknown; dispatch?: unknown; autoApply?: unknown }>(
  candidate: T
): T & { recommendationOnly: true; mayExecute: false } {
  const copy = { ...candidate, recommendationOnly: true as const, mayExecute: false as const };
  delete (copy as Record<string, unknown>).execute;
  delete (copy as Record<string, unknown>).dispatch;
  delete (copy as Record<string, unknown>).autoApply;
  return copy as T & { recommendationOnly: true; mayExecute: false };
}

/** Explicit boundary: advisory stream must never carry executable payloads. */
export function partitionSuggestionFromExecution<T extends { mayExecute?: boolean; execute?: unknown }>(
  item: T
): { suggestion: T & { mayExecute: false }; executable: null } {
  const suggestion = stripExecutionFromCoPilotCandidate(item as T & { execute?: unknown });
  return { suggestion, executable: null };
}


// --- source: guardian-depth.ts ---

/** Mirrors canonical V9.4 guardianBlocksAutomation (advisory module copy). */
export function guardianBlocksAutomation(
  result: { allowedToProceed?: boolean; highestSeverity?: string; confirmationRequired?: boolean } | null | undefined,
  protectionLevel?: string
): boolean {
  if (!result) return false;
  if (result.allowedToProceed === false) return true;
  if (result.highestSeverity === 'critical') return true;
  if (protectionLevel === 'maximum_protection' && result.confirmationRequired) return true;
  return false;
}

export type GuardianRiskVerdictLite = {
  allowedToProceed: boolean;
  highestSeverity: 'none' | 'caution' | 'critical';
  confirmationRequired: boolean;
  summary: string;
};

export interface GuardianAdvisoryPosture {
  protectionLevel: string;
  responseMode: string;
  guardianEnabled: boolean;
  automationLikelyBlocked: boolean;
  confirmationLikelyRequired: boolean;
  advisoryReasons: string[];
}

export function inferGuardianVerdictFromSnapshot(snapshot: GuardianCoPilotMonitorSnapshot): GuardianRiskVerdictLite {
  const reasons: string[] = [];
  let highestSeverity: GuardianRiskVerdictLite['highestSeverity'] = 'none';
  let confirmationRequired = false;
  let allowedToProceed = true;

  if (!snapshot.guardianEnabled) {
    return { allowedToProceed: true, highestSeverity: 'none', confirmationRequired: false, summary: 'Guardian disabled' };
  }

  if (snapshot.cash < snapshot.minCashReserve) {
    reasons.push('cash_below_reserve');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.debt > snapshot.cash) {
    reasons.push('debt_exceeds_cash');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) {
    reasons.push('spend_exceeds_cash');
    highestSeverity = 'caution';
    confirmationRequired = true;
  }
  if (snapshot.copilotAutonomousActive && snapshot.guardianRequiresConfirmation) {
    reasons.push('autonomy_confirmation_tension');
    highestSeverity = 'critical';
    confirmationRequired = true;
    allowedToProceed = false;
  }
  if (snapshot.takeoverSessionActive && !snapshot.guardianEnabled) {
    reasons.push('takeover_without_guardian');
    highestSeverity = 'critical';
    allowedToProceed = false;
  }

  if (snapshot.guardianProtectionMaximum && confirmationRequired) {
    allowedToProceed = false;
  }

  return {
    allowedToProceed,
    highestSeverity,
    confirmationRequired,
    summary: reasons.length ? reasons.join(',') : 'clear',
  };
}

export function deriveGuardianAdvisoryPosture(snapshot: GuardianCoPilotMonitorSnapshot): GuardianAdvisoryPosture {
  const verdict = inferGuardianVerdictFromSnapshot(snapshot);
  const automationLikelyBlocked = guardianBlocksAutomation(verdict, snapshot.guardianProtectionLevel);
  const advisoryReasons: string[] = [];
  if (automationLikelyBlocked) advisoryReasons.push('Guardian posture may block Co-Pilot automation on the next risky action');
  if (verdict.confirmationRequired && snapshot.guardianRequiresConfirmation) {
    advisoryReasons.push('Confirmation likely required before spend or travel');
  }
  if (!snapshot.guardianEnabled && snapshot.copilotHoldsControl) {
    advisoryReasons.push('Co-Pilot holds control without Guardian safety net');
  }
  return {
    protectionLevel: snapshot.guardianProtectionLevel,
    responseMode: snapshot.guardianResponseMode,
    guardianEnabled: snapshot.guardianEnabled,
    automationLikelyBlocked,
    confirmationLikelyRequired: verdict.confirmationRequired,
    advisoryReasons,
  };
}

export function buildGuardianDepthAdviceLines(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const posture = deriveGuardianAdvisoryPosture(snapshot);
  const lines = [...posture.advisoryReasons];
  const verdict = inferGuardianVerdictFromSnapshot(snapshot);
  if (verdict.summary !== 'clear') {
    lines.push(`Guardian heuristic flags: ${verdict.summary.replace(/,/g, ' · ')}`);
  }
  return lines.slice(0, 4);
}

export function computeCopilotSpendingHeadroom(snapshot: GuardianCoPilotMonitorSnapshot): number {
  return Math.max(0, snapshot.cash - snapshot.minCashReserve);
}

export function computeObjectiveBehindSchedule(snapshot: GuardianCoPilotMonitorSnapshot): boolean {
  if (!snapshot.objectiveActive || snapshot.objectiveProgressPct === null || snapshot.objectiveTurnsRemaining === null) {
    return false;
  }
  if (snapshot.objectiveProgressPct >= 100) return false;
  const turns = Math.max(1, snapshot.objectiveTurnsRemaining);
  const paceRequired = (100 - snapshot.objectiveProgressPct) / turns;
  return paceRequired > 22;
}

export function computeGuardianRiskScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.guardianEnabled) return 0;
  let score = 0;
  if (snapshot.cash < snapshot.minCashReserve) score += 25;
  if (snapshot.debt > snapshot.cash) score += 20;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) score += 15;
  if (snapshot.guardianAutomationLikelyBlocked) score += 20;
  if (snapshot.copilotAutonomousActive && snapshot.guardianRequiresConfirmation) score += 15;
  if (snapshot.takeoverSessionActive && snapshot.takeoverSessionAgeTurns >= 3) score += 10;
  if (snapshot.blockedContinueCount >= 1) score += 10;
  if (snapshot.objectiveBehindSchedule) score += 15;
  if (snapshot.rivalVictoryProgressPct !== null && snapshot.rivalVictoryProgressPct >= snapshot.victoryThresholdPct * 0.75) {
    score += 15;
  }
  return Math.min(100, score);
}

export function classifyGuardianRiskBand(score: number): GuardianCoPilotMonitorSnapshot['guardianRiskBand'] {
  if (score >= 70) return 'critical';
  if (score >= 40) return 'elevated';
  return 'low';
}

export function computeObjectivePacePct(snapshot: GuardianCoPilotMonitorSnapshot): number | null {
  if (!snapshot.objectiveActive || snapshot.objectiveProgressPct === null || snapshot.objectiveTurnsRemaining === null) {
    return null;
  }
  if (snapshot.objectiveTurnsRemaining <= 0) return snapshot.objectiveProgressPct >= 100 ? 0 : 100;
  return Math.round((100 - snapshot.objectiveProgressPct) / Math.max(1, snapshot.objectiveTurnsRemaining));
}

export function computeLiquidityStressIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let stress = 0;
  if (snapshot.cash <= 0) stress += 35;
  else if (snapshot.cash < snapshot.minCashReserve) stress += 25;
  if (snapshot.debt > snapshot.cash) stress += 25;
  if (snapshot.copilotSpendingHeadroom <= 0) stress += 20;
  else if (snapshot.copilotSpendingHeadroom < snapshot.maxSpendPerAction * 0.5) stress += 10;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) stress += 15;
  return Math.min(100, stress);
}

export function computeCopilotTrustGapScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.copilotEnabled && !snapshot.copilotAutonomousActive) return 0;
  let gap = 0;
  if (snapshot.guardianRequiresConfirmation) gap += 25;
  if (snapshot.guardianProtectionMaximum) gap += 20;
  if (snapshot.copilotAutonomousActive) gap += 25;
  if (snapshot.copilotHoldsControl) gap += 15;
  if (!snapshot.guardianEnabled) gap += 30;
  if (snapshot.guardianAutomationLikelyBlocked) gap += 15;
  return Math.min(100, gap);
}

export function buildGuardianDepthCouplingReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.liquidityStressIndex >= 60) {
    lines.push(`Liquidity stress index ${snapshot.liquidityStressIndex} — discretionary Co-Pilot spend is constrained`);
  }
  if (snapshot.copilotTrustGapScore >= 50) {
    lines.push(`Co-Pilot / Guardian trust gap ${snapshot.copilotTrustGapScore} — align authority and protection before automation`);
  }
  if (snapshot.objectivePacePct !== null && snapshot.objectivePacePct > 30) {
    lines.push(`Objective needs ~${snapshot.objectivePacePct}% progress per remaining turn (advisory estimate)`);
  }
  return lines.slice(0, 3);
}

export function computeCompositePressureIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  const blended =
    snapshot.liquidityStressIndex * 0.35 +
    snapshot.guardianRiskScore * 0.35 +
    snapshot.copilotTrustGapScore * 0.3;
  return Math.min(100, Math.round(blended));
}

export function computeAutomationReadinessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  if (!snapshot.copilotEnabled && !snapshot.guardianEnabled) return 100;
  let score = 100;
  if (snapshot.guardianAutomationLikelyBlocked) score -= 25;
  if (snapshot.copilotTrustGapScore >= 40) score -= Math.min(35, Math.round(snapshot.copilotTrustGapScore * 0.35));
  if (snapshot.guardianConfirmationLikelyRequired) score -= 15;
  if (!snapshot.guardianEnabled && snapshot.copilotHoldsControl) score -= 30;
  if (snapshot.blockedContinueCount >= 1) score -= 10;
  if (snapshot.liquidityStressIndex >= 50) score -= 15;
  if (snapshot.compositePressureIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeActionBurnPressure(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let pressure = 0;
  if (snapshot.apRemaining <= 1 && snapshot.apPerDay >= 2) pressure += 30;
  if (snapshot.apPerDay > 0 && snapshot.actionsUsedThisTurn >= snapshot.apPerDay - 1) pressure += 20;
  if (snapshot.maxSpendPerAction > snapshot.cash && snapshot.cash > 0) pressure += 20;
  if (snapshot.objectiveBehindSchedule && snapshot.objectiveActive) pressure += 25;
  if (snapshot.apRemaining > 0 && snapshot.copilotSpendingHeadroom <= 0) pressure += 15;
  return Math.min(100, pressure);
}

export function buildGuardianDepthInterlockReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.compositePressureIndex >= 60) {
    lines.push(
      `Composite advisory pressure ${snapshot.compositePressureIndex} — liquidity, Guardian risk, and trust gap align`
    );
  }
  if (snapshot.automationReadinessScore < 40 && snapshot.copilotEnabled) {
    lines.push(
      `Automation readiness ${snapshot.automationReadinessScore} — defer Co-Pilot auto-actions until posture improves`
    );
  }
  if (snapshot.actionBurnPressure >= 50) {
    lines.push(`Action burn pressure ${snapshot.actionBurnPressure} — remaining AP may not cover discretionary spend`);
  }
  return lines.slice(0, 3);
}

export function computeAdvisorySaturationIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let saturation = 0;
  if (snapshot.compositePressureIndex >= 45) saturation += 25;
  if (snapshot.compositePressureIndex >= 65) saturation += 10;
  if (snapshot.automationReadinessScore < 55) saturation += 20;
  if (snapshot.automationReadinessScore < 35) saturation += 10;
  if (snapshot.actionBurnPressure >= 40) saturation += 20;
  if (snapshot.actionBurnPressure >= 60) saturation += 10;
  if (snapshot.guardianRiskBand === 'elevated') saturation += 15;
  if (snapshot.guardianRiskBand === 'critical') saturation += 25;
  if (snapshot.liquidityStressIndex >= 50) saturation += 10;
  return Math.min(100, saturation);
}

export function computeEscalationLatchScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let latch = 0;
  if (snapshot.guardianConfirmationLikelyRequired) latch += 20;
  if (snapshot.guardianAutomationLikelyBlocked) latch += 15;
  if (snapshot.takeoverSessionActive && snapshot.automationReadinessScore < 45) latch += 25;
  if (snapshot.copilotAutonomousActive && snapshot.automationReadinessScore < 40) latch += 20;
  if (snapshot.blockedContinueCount >= 1) latch += 15;
  if (snapshot.compositePressureIndex >= 60) latch += 15;
  if (snapshot.advisorySaturationIndex >= 55) latch += 10;
  if (snapshot.guardianRiskBand === 'critical') latch += 20;
  if (snapshot.copilotHoldsControl && snapshot.governanceCoherenceScore < 40) latch += 15;
  return Math.min(100, latch);
}

export function computeGovernanceCoherenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.copilotTrustGapScore >= 40) score -= Math.min(35, Math.round(snapshot.copilotTrustGapScore * 0.4));
  if (!snapshot.guardianEnabled && snapshot.copilotEnabled) score -= 25;
  if (snapshot.guardianProtectionMaximum && snapshot.copilotAutonomousActive) score -= 15;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAuthorityMode === 'autonomous') score -= 10;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 15;
  if (snapshot.compositePressureIndex >= 55) score -= 10;
  if (snapshot.advisorySaturationIndex >= 60) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthStabilityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.advisorySaturationIndex >= 55) {
    lines.push(
      `Advisory saturation ${snapshot.advisorySaturationIndex} — overlapping Guardian and Co-Pilot warnings likely`
    );
  }
  if (snapshot.escalationLatchScore >= 50) {
    lines.push(`Escalation latch ${snapshot.escalationLatchScore} — human confirmation path may engage repeatedly`);
  }
  if (snapshot.governanceCoherenceScore < 45) {
    lines.push(
      `Governance coherence ${snapshot.governanceCoherenceScore} — align protection level and Co-Pilot authority`
    );
  }
  return lines.slice(0, 3);
}

export function computeContainmentBurdenIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let burden = 0;
  if (snapshot.advisorySaturationIndex >= 50) burden += 25;
  if (snapshot.advisorySaturationIndex >= 70) burden += 15;
  if (snapshot.escalationLatchScore >= 45) burden += 20;
  if (snapshot.escalationLatchScore >= 65) burden += 10;
  if (snapshot.governanceCoherenceScore < 50) burden += 15;
  if (snapshot.governanceCoherenceScore < 35) burden += 10;
  if (snapshot.compositePressureIndex >= 55) burden += 15;
  if (snapshot.guardianRiskBand === 'critical') burden += 20;
  if (snapshot.takeoverSessionActive) burden += 10;
  return Math.min(100, burden);
}

export function computeHumanRelayPressure(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let pressure = 0;
  if (snapshot.guardianConfirmationLikelyRequired) pressure += 20;
  if (snapshot.takeoverSessionActive) pressure += 25;
  if (snapshot.copilotHoldsControl && snapshot.automationReadinessScore < 45) pressure += 20;
  if (snapshot.blockedContinueCount >= 1) pressure += 15;
  if (snapshot.escalationLatchScore >= 50) pressure += 15;
  if (snapshot.containmentBurdenIndex >= 55) pressure += 10;
  if (snapshot.teamPlanPending) pressure += 10;
  if (snapshot.guardianReplayCount >= 2) pressure += 10;
  return Math.min(100, pressure);
}

export function computeRecoveryHeadroomScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.containmentBurdenIndex >= 45) score -= Math.min(30, Math.round(snapshot.containmentBurdenIndex * 0.35));
  if (snapshot.humanRelayPressure >= 40) score -= Math.min(25, Math.round(snapshot.humanRelayPressure * 0.3));
  if (snapshot.liquidityStressIndex >= 50) score -= 15;
  if (snapshot.automationReadinessScore < 40) score -= 15;
  if (snapshot.governanceCoherenceScore < 40) score -= 10;
  if (snapshot.actionBurnPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthResilienceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.containmentBurdenIndex >= 55) {
    lines.push(
      `Containment burden ${snapshot.containmentBurdenIndex} — advisory envelope may need manual triage before automation`
    );
  }
  if (snapshot.humanRelayPressure >= 50) {
    lines.push(`Human relay pressure ${snapshot.humanRelayPressure} — expect repeated Guardian or Co-Pilot handoffs`);
  }
  if (snapshot.recoveryHeadroomScore < 40) {
    lines.push(
      `Recovery headroom ${snapshot.recoveryHeadroomScore} — limited slack to absorb another advisory shock`
    );
  }
  return lines.slice(0, 3);
}

export function computeAdvisoryDepletionIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let depletion = 0;
  if (snapshot.recoveryHeadroomScore < 50) depletion += Math.min(25, 50 - snapshot.recoveryHeadroomScore);
  if (snapshot.recoveryHeadroomScore < 35) depletion += 10;
  if (snapshot.containmentBurdenIndex >= 50) depletion += 20;
  if (snapshot.containmentBurdenIndex >= 70) depletion += 10;
  if (snapshot.humanRelayPressure >= 45) depletion += 15;
  if (snapshot.advisorySaturationIndex >= 55) depletion += 15;
  if (snapshot.guardianReplayCount >= 2) depletion += 10;
  if (snapshot.blockedContinueCount >= 1) depletion += 10;
  if (snapshot.actionBurnPressure >= 50) depletion += 10;
  return Math.min(100, depletion);
}

export function computeOperatorBandwidthScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.humanRelayPressure >= 40) score -= Math.min(30, Math.round(snapshot.humanRelayPressure * 0.35));
  if (snapshot.advisoryDepletionIndex >= 45) score -= Math.min(25, Math.round(snapshot.advisoryDepletionIndex * 0.3));
  if (snapshot.takeoverSessionActive) score -= 15;
  if (snapshot.teamPlanPending) score -= 10;
  if (snapshot.guardianConfirmationLikelyRequired) score -= 10;
  if (snapshot.copilotHoldsControl && snapshot.automationReadinessScore < 40) score -= 15;
  return Math.max(0, Math.min(100, score));
}

export function computeContinuityMarginScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.advisoryDepletionIndex >= 40) score -= Math.min(30, Math.round(snapshot.advisoryDepletionIndex * 0.35));
  if (snapshot.operatorBandwidthScore < 50) score -= Math.min(25, 50 - snapshot.operatorBandwidthScore);
  if (snapshot.recoveryHeadroomScore < 45) score -= 15;
  if (snapshot.governanceCoherenceScore < 45) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthContinuityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.advisoryDepletionIndex >= 55) {
    lines.push(
      `Advisory depletion ${snapshot.advisoryDepletionIndex} — sustained advisory load may exhaust operator attention`
    );
  }
  if (snapshot.operatorBandwidthScore < 45) {
    lines.push(
      `Operator bandwidth ${snapshot.operatorBandwidthScore} — reduce parallel Guardian and Co-Pilot demands`
    );
  }
  if (snapshot.continuityMarginScore < 40) {
    lines.push(
      `Continuity margin ${snapshot.continuityMarginScore} — fragile margin to maintain advisory coverage across turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeStewardshipLoadIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.continuityMarginScore < 50) load += Math.min(25, 50 - snapshot.continuityMarginScore);
  if (snapshot.continuityMarginScore < 35) load += 10;
  if (snapshot.advisoryDepletionIndex >= 45) load += 20;
  if (snapshot.advisoryDepletionIndex >= 65) load += 10;
  if (snapshot.operatorBandwidthScore < 45) load += 20;
  if (snapshot.governanceCoherenceScore < 45) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.humanRelayPressure >= 50) load += 10;
  return Math.min(100, load);
}

export function computeOversightCommitmentScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.stewardshipLoadIndex >= 45) score -= Math.min(30, Math.round(snapshot.stewardshipLoadIndex * 0.35));
  if (snapshot.continuityMarginScore < 40) score -= 15;
  if (!snapshot.guardianEnabled && snapshot.copilotEnabled) score -= 20;
  if (snapshot.guardianConfirmationLikelyRequired && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  if (snapshot.governanceCoherenceScore < 40) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeSustainabilityMarginScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.stewardshipLoadIndex >= 40) score -= Math.min(30, Math.round(snapshot.stewardshipLoadIndex * 0.32));
  if (snapshot.oversightCommitmentScore < 50) score -= Math.min(25, 50 - snapshot.oversightCommitmentScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  if (snapshot.continuityMarginScore < 35) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthStewardshipReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.stewardshipLoadIndex >= 55) {
    lines.push(
      `Stewardship load ${snapshot.stewardshipLoadIndex} — operator stewardship may not scale with advisory volume`
    );
  }
  if (snapshot.oversightCommitmentScore < 45) {
    lines.push(
      `Oversight commitment ${snapshot.oversightCommitmentScore} — align Guardian oversight with Co-Pilot autonomy`
    );
  }
  if (snapshot.sustainabilityMarginScore < 40) {
    lines.push(
      `Sustainability margin ${snapshot.sustainabilityMarginScore} — little margin to sustain warn-only governance across turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAccountabilityLoadIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.sustainabilityMarginScore < 50) load += Math.min(25, 50 - snapshot.sustainabilityMarginScore);
  if (snapshot.sustainabilityMarginScore < 35) load += 10;
  if (snapshot.oversightCommitmentScore < 45) load += 20;
  if (snapshot.oversightCommitmentScore < 35) load += 10;
  if (snapshot.stewardshipLoadIndex >= 55) load += 20;
  if (snapshot.stewardshipLoadIndex >= 70) load += 10;
  if (snapshot.copilotTrustGapScore >= 50) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 10;
  return Math.min(100, load);
}

export function computeDelegationFidelityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accountabilityLoadIndex >= 45) score -= Math.min(30, Math.round(snapshot.accountabilityLoadIndex * 0.35));
  if (snapshot.copilotTrustGapScore >= 45) score -= Math.min(25, Math.round(snapshot.copilotTrustGapScore * 0.35));
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianConfirmationLikelyRequired && snapshot.copilotHoldsControl) score -= 10;
  if (snapshot.oversightCommitmentScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceEnduranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accountabilityLoadIndex >= 40) score -= Math.min(30, Math.round(snapshot.accountabilityLoadIndex * 0.32));
  if (snapshot.delegationFidelityScore < 50) score -= Math.min(25, 50 - snapshot.delegationFidelityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.continuityMarginScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAccountabilityReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.accountabilityLoadIndex >= 55) {
    lines.push(
      `Accountability load ${snapshot.accountabilityLoadIndex} — stacked warn-only obligations may exceed operator review capacity`
    );
  }
  if (snapshot.delegationFidelityScore < 45) {
    lines.push(
      `Delegation fidelity ${snapshot.delegationFidelityScore} — align Co-Pilot delegation with Guardian accountability posture`
    );
  }
  if (snapshot.governanceEnduranceScore < 40) {
    lines.push(
      `Governance endurance ${snapshot.governanceEnduranceScore} — little endurance to sustain oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeFiduciaryBurdenIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceEnduranceScore < 50) load += Math.min(25, 50 - snapshot.governanceEnduranceScore);
  if (snapshot.governanceEnduranceScore < 35) load += 10;
  if (snapshot.delegationFidelityScore < 45) load += 20;
  if (snapshot.delegationFidelityScore < 35) load += 10;
  if (snapshot.accountabilityLoadIndex >= 55) load += 20;
  if (snapshot.accountabilityLoadIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.escalationLatchScore >= 55) load += 10;
  return Math.min(100, load);
}

export function computeTrustAssuranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.fiduciaryBurdenIndex >= 45) score -= Math.min(30, Math.round(snapshot.fiduciaryBurdenIndex * 0.35));
  if (snapshot.delegationFidelityScore < 50) score -= Math.min(25, 50 - snapshot.delegationFidelityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotHoldsControl) score -= 10;
  if (snapshot.governanceEnduranceScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceDurabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.fiduciaryBurdenIndex >= 40) score -= Math.min(30, Math.round(snapshot.fiduciaryBurdenIndex * 0.32));
  if (snapshot.trustAssuranceScore < 50) score -= Math.min(25, 50 - snapshot.trustAssuranceScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.sustainabilityMarginScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthFiduciaryReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.fiduciaryBurdenIndex >= 55) {
    lines.push(
      `Fiduciary burden ${snapshot.fiduciaryBurdenIndex} — stacked fiduciary review may exceed operator assurance capacity`
    );
  }
  if (snapshot.trustAssuranceScore < 45) {
    lines.push(
      `Trust assurance ${snapshot.trustAssuranceScore} — align Co-Pilot autonomy with Guardian fiduciary posture`
    );
  }
  if (snapshot.governanceDurabilityScore < 40) {
    lines.push(
      `Governance durability ${snapshot.governanceDurabilityScore} — little durability to sustain fiduciary oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCovenantStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceDurabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceDurabilityScore);
  if (snapshot.governanceDurabilityScore < 35) load += 10;
  if (snapshot.trustAssuranceScore < 45) load += 20;
  if (snapshot.trustAssuranceScore < 35) load += 10;
  if (snapshot.fiduciaryBurdenIndex >= 55) load += 20;
  if (snapshot.fiduciaryBurdenIndex >= 70) load += 10;
  if (snapshot.compositePressureIndex >= 58) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 10;
  return Math.min(100, load);
}

export function computeMandateIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.covenantStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.covenantStrainIndex * 0.35));
  if (snapshot.trustAssuranceScore < 50) score -= Math.min(25, 50 - snapshot.trustAssuranceScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceDurabilityScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceTenacityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.covenantStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.covenantStrainIndex * 0.32));
  if (snapshot.mandateIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.mandateIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceEnduranceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCovenantReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.covenantStrainIndex >= 55) {
    lines.push(
      `Covenant strain ${snapshot.covenantStrainIndex} — stacked mandate review may exceed operator covenant capacity`
    );
  }
  if (snapshot.mandateIntegrityScore < 45) {
    lines.push(
      `Mandate integrity ${snapshot.mandateIntegrityScore} — align Co-Pilot mandate with Guardian covenant posture`
    );
  }
  if (snapshot.governanceTenacityScore < 40) {
    lines.push(
      `Governance tenacity ${snapshot.governanceTenacityScore} — little tenacity to sustain covenant oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCharterStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceTenacityScore < 50) load += Math.min(25, 50 - snapshot.governanceTenacityScore);
  if (snapshot.governanceTenacityScore < 35) load += 10;
  if (snapshot.mandateIntegrityScore < 45) load += 20;
  if (snapshot.mandateIntegrityScore < 35) load += 10;
  if (snapshot.covenantStrainIndex >= 55) load += 20;
  if (snapshot.covenantStrainIndex >= 70) load += 10;
  if (snapshot.actionBurnPressure >= 50) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.advisoryDepletionIndex >= 55) load += 10;
  return Math.min(100, load);
}

export function computeAuthorityIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.charterStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.charterStrainIndex * 0.35));
  if (snapshot.mandateIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.mandateIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.copilotAuthorityMode === 'autonomous' && snapshot.guardianProtectionMaximum) score -= 10;
  if (snapshot.governanceTenacityScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernancePersistenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.charterStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.charterStrainIndex * 0.32));
  if (snapshot.authorityIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorityIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceDurabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCharterReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.charterStrainIndex >= 55) {
    lines.push(
      `Charter strain ${snapshot.charterStrainIndex} — stacked charter review may exceed operator authority capacity`
    );
  }
  if (snapshot.authorityIntegrityScore < 45) {
    lines.push(
      `Authority integrity ${snapshot.authorityIntegrityScore} — align Co-Pilot authority with Guardian charter posture`
    );
  }
  if (snapshot.governancePersistenceScore < 40) {
    lines.push(
      `Governance persistence ${snapshot.governancePersistenceScore} — little persistence to sustain charter oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeLegitimacyStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governancePersistenceScore < 50) load += Math.min(25, 50 - snapshot.governancePersistenceScore);
  if (snapshot.governancePersistenceScore < 35) load += 10;
  if (snapshot.authorityIntegrityScore < 45) load += 20;
  if (snapshot.authorityIntegrityScore < 35) load += 10;
  if (snapshot.charterStrainIndex >= 55) load += 20;
  if (snapshot.charterStrainIndex >= 70) load += 10;
  if (snapshot.escalationLatchScore >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.containmentBurdenIndex >= 55) load += 10;
  return Math.min(100, load);
}

export function computeOversightIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.legitimacyStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.legitimacyStrainIndex * 0.35));
  if (snapshot.authorityIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorityIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.oversightCommitmentScore < 40) score -= 10;
  if (snapshot.governancePersistenceScore < 40) score -= 15;
  if (snapshot.humanRelayPressure >= 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceContinuityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.legitimacyStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.legitimacyStrainIndex * 0.32));
  if (snapshot.oversightIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.oversightIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceTenacityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthLegitimacyReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.legitimacyStrainIndex >= 55) {
    lines.push(
      `Legitimacy strain ${snapshot.legitimacyStrainIndex} — stacked legitimacy review may exceed operator oversight capacity`
    );
  }
  if (snapshot.oversightIntegrityScore < 45) {
    lines.push(
      `Oversight integrity ${snapshot.oversightIntegrityScore} — align Co-Pilot oversight with Guardian legitimacy posture`
    );
  }
  if (snapshot.governanceContinuityScore < 40) {
    lines.push(
      `Governance continuity ${snapshot.governanceContinuityScore} — little continuity to sustain legitimacy oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeComplianceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceContinuityScore < 50) load += Math.min(25, 50 - snapshot.governanceContinuityScore);
  if (snapshot.governanceContinuityScore < 35) load += 10;
  if (snapshot.oversightIntegrityScore < 45) load += 20;
  if (snapshot.oversightIntegrityScore < 35) load += 10;
  if (snapshot.legitimacyStrainIndex >= 55) load += 20;
  if (snapshot.legitimacyStrainIndex >= 70) load += 10;
  if (snapshot.governanceCoherenceScore < 45) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.humanRelayPressure >= 50) load += 10;
  return Math.min(100, load);
}

export function computePolicyIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.complianceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.complianceStrainIndex * 0.35));
  if (snapshot.oversightIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.oversightIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianRequiresConfirmation && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceContinuityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResilienceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.complianceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.complianceStrainIndex * 0.32));
  if (snapshot.policyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.policyIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governancePersistenceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthComplianceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.complianceStrainIndex >= 55) {
    lines.push(
      `Compliance strain ${snapshot.complianceStrainIndex} — stacked policy review may exceed operator compliance capacity`
    );
  }
  if (snapshot.policyIntegrityScore < 45) {
    lines.push(
      `Policy integrity ${snapshot.policyIntegrityScore} — align Co-Pilot policy with Guardian compliance posture`
    );
  }
  if (snapshot.governanceResilienceScore < 40) {
    lines.push(
      `Governance resilience ${snapshot.governanceResilienceScore} — little resilience to sustain compliance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAuditStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceResilienceScore < 50) load += Math.min(25, 50 - snapshot.governanceResilienceScore);
  if (snapshot.governanceResilienceScore < 35) load += 10;
  if (snapshot.policyIntegrityScore < 45) load += 20;
  if (snapshot.policyIntegrityScore < 35) load += 10;
  if (snapshot.complianceStrainIndex >= 55) load += 20;
  if (snapshot.complianceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeControlIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.auditStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.auditStrainIndex * 0.35));
  if (snapshot.policyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.policyIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceResilienceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceStabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.auditStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.auditStrainIndex * 0.32));
  if (snapshot.controlIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.controlIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceContinuityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAuditReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.auditStrainIndex >= 55) {
    lines.push(
      `Audit strain ${snapshot.auditStrainIndex} — stacked control review may exceed operator audit capacity`
    );
  }
  if (snapshot.controlIntegrityScore < 45) {
    lines.push(
      `Control integrity ${snapshot.controlIntegrityScore} — align Co-Pilot controls with Guardian audit posture`
    );
  }
  if (snapshot.governanceStabilityScore < 40) {
    lines.push(
      `Governance stability ${snapshot.governanceStabilityScore} — little stability to sustain audit oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAssuranceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceStabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceStabilityScore);
  if (snapshot.governanceStabilityScore < 35) load += 10;
  if (snapshot.controlIntegrityScore < 45) load += 20;
  if (snapshot.controlIntegrityScore < 35) load += 10;
  if (snapshot.auditStrainIndex >= 55) load += 20;
  if (snapshot.auditStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeEvidenceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.assuranceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.assuranceStrainIndex * 0.35));
  if (snapshot.controlIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.controlIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceStabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceConfidenceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.assuranceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.assuranceStrainIndex * 0.32));
  if (snapshot.evidenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.evidenceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceResilienceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAssuranceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.assuranceStrainIndex >= 55) {
    lines.push(
      `Assurance strain ${snapshot.assuranceStrainIndex} — stacked evidence review may exceed operator assurance capacity`
    );
  }
  if (snapshot.evidenceIntegrityScore < 45) {
    lines.push(
      `Evidence integrity ${snapshot.evidenceIntegrityScore} — align Co-Pilot evidence with Guardian assurance posture`
    );
  }
  if (snapshot.governanceConfidenceScore < 40) {
    lines.push(
      `Governance confidence ${snapshot.governanceConfidenceScore} — little confidence to sustain assurance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAttestationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceConfidenceScore < 50) load += Math.min(25, 50 - snapshot.governanceConfidenceScore);
  if (snapshot.governanceConfidenceScore < 35) load += 10;
  if (snapshot.evidenceIntegrityScore < 45) load += 20;
  if (snapshot.evidenceIntegrityScore < 35) load += 10;
  if (snapshot.assuranceStrainIndex >= 55) load += 20;
  if (snapshot.assuranceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAttestationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.attestationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.attestationStrainIndex * 0.35));
  if (snapshot.evidenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.evidenceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceConfidenceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceReliabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.attestationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.attestationStrainIndex * 0.32));
  if (snapshot.attestationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.attestationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceStabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAttestationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.attestationStrainIndex >= 55) {
    lines.push(
      `Attestation strain ${snapshot.attestationStrainIndex} — stacked attestation review may exceed operator attestation capacity`
    );
  }
  if (snapshot.attestationIntegrityScore < 45) {
    lines.push(
      `Attestation integrity ${snapshot.attestationIntegrityScore} — align Co-Pilot attestations with Guardian attestation posture`
    );
  }
  if (snapshot.governanceReliabilityScore < 40) {
    lines.push(
      `Governance reliability ${snapshot.governanceReliabilityScore} — little reliability to sustain attestation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeVerificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceReliabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceReliabilityScore);
  if (snapshot.governanceReliabilityScore < 35) load += 10;
  if (snapshot.attestationIntegrityScore < 45) load += 20;
  if (snapshot.attestationIntegrityScore < 35) load += 10;
  if (snapshot.attestationStrainIndex >= 55) load += 20;
  if (snapshot.attestationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeVerificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.verificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.verificationStrainIndex * 0.35));
  if (snapshot.attestationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.attestationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceReliabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceValidityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.verificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.verificationStrainIndex * 0.32));
  if (snapshot.verificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.verificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceReliabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthVerificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.verificationStrainIndex >= 55) {
    lines.push(
      `Verification strain ${snapshot.verificationStrainIndex} — stacked verification review may exceed operator verification capacity`
    );
  }
  if (snapshot.verificationIntegrityScore < 45) {
    lines.push(
      `Verification integrity ${snapshot.verificationIntegrityScore} — align Co-Pilot verifications with Guardian verification posture`
    );
  }
  if (snapshot.governanceValidityScore < 40) {
    lines.push(
      `Governance validity ${snapshot.governanceValidityScore} — little validity to sustain verification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeValidationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceValidityScore < 50) load += Math.min(25, 50 - snapshot.governanceValidityScore);
  if (snapshot.governanceValidityScore < 35) load += 10;
  if (snapshot.verificationIntegrityScore < 45) load += 20;
  if (snapshot.verificationIntegrityScore < 35) load += 10;
  if (snapshot.verificationStrainIndex >= 55) load += 20;
  if (snapshot.verificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeValidationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.validationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.validationStrainIndex * 0.35));
  if (snapshot.verificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.verificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceValidityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceSoundnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.validationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.validationStrainIndex * 0.32));
  if (snapshot.validationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.validationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceValidityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthValidationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.validationStrainIndex >= 55) {
    lines.push(
      `Validation strain ${snapshot.validationStrainIndex} — stacked validation review may exceed operator validation capacity`
    );
  }
  if (snapshot.validationIntegrityScore < 45) {
    lines.push(
      `Validation integrity ${snapshot.validationIntegrityScore} — align Co-Pilot validations with Guardian validation posture`
    );
  }
  if (snapshot.governanceSoundnessScore < 40) {
    lines.push(
      `Governance soundness ${snapshot.governanceSoundnessScore} — little soundness to sustain validation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeCertificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceSoundnessScore < 50) load += Math.min(25, 50 - snapshot.governanceSoundnessScore);
  if (snapshot.governanceSoundnessScore < 35) load += 10;
  if (snapshot.validationIntegrityScore < 45) load += 20;
  if (snapshot.validationIntegrityScore < 35) load += 10;
  if (snapshot.validationStrainIndex >= 55) load += 20;
  if (snapshot.validationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeCertificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.certificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.certificationStrainIndex * 0.35));
  if (snapshot.validationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.validationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceSoundnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceAuthenticityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.certificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.certificationStrainIndex * 0.32));
  if (snapshot.certificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.certificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceSoundnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthCertificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.certificationStrainIndex >= 55) {
    lines.push(
      `Certification strain ${snapshot.certificationStrainIndex} — stacked certification review may exceed operator certification capacity`
    );
  }
  if (snapshot.certificationIntegrityScore < 45) {
    lines.push(
      `Certification integrity ${snapshot.certificationIntegrityScore} — align Co-Pilot certifications with Guardian certification posture`
    );
  }
  if (snapshot.governanceAuthenticityScore < 40) {
    lines.push(
      `Governance authenticity ${snapshot.governanceAuthenticityScore} — little authenticity to sustain certification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAccreditationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceAuthenticityScore < 50) load += Math.min(25, 50 - snapshot.governanceAuthenticityScore);
  if (snapshot.governanceAuthenticityScore < 35) load += 10;
  if (snapshot.certificationIntegrityScore < 45) load += 20;
  if (snapshot.certificationIntegrityScore < 35) load += 10;
  if (snapshot.certificationStrainIndex >= 55) load += 20;
  if (snapshot.certificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAccreditationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accreditationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.accreditationStrainIndex * 0.35));
  if (snapshot.certificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.certificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceAuthenticityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceCredibilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.accreditationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.accreditationStrainIndex * 0.32));
  if (snapshot.accreditationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.accreditationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceAuthenticityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAccreditationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.accreditationStrainIndex >= 55) {
    lines.push(
      `Accreditation strain ${snapshot.accreditationStrainIndex} — stacked accreditation review may exceed operator accreditation capacity`
    );
  }
  if (snapshot.accreditationIntegrityScore < 45) {
    lines.push(
      `Accreditation integrity ${snapshot.accreditationIntegrityScore} — align Co-Pilot accreditations with Guardian accreditation posture`
    );
  }
  if (snapshot.governanceCredibilityScore < 40) {
    lines.push(
      `Governance credibility ${snapshot.governanceCredibilityScore} — little credibility to sustain accreditation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeEndorsementStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceCredibilityScore < 50) load += Math.min(25, 50 - snapshot.governanceCredibilityScore);
  if (snapshot.governanceCredibilityScore < 35) load += 10;
  if (snapshot.accreditationIntegrityScore < 45) load += 20;
  if (snapshot.accreditationIntegrityScore < 35) load += 10;
  if (snapshot.accreditationStrainIndex >= 55) load += 20;
  if (snapshot.accreditationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeEndorsementIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.endorsementStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.endorsementStrainIndex * 0.35));
  if (snapshot.accreditationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.accreditationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceCredibilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceTrustworthinessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.endorsementStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.endorsementStrainIndex * 0.32));
  if (snapshot.endorsementIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.endorsementIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceCredibilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthEndorsementReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.endorsementStrainIndex >= 55) {
    lines.push(
      `Endorsement strain ${snapshot.endorsementStrainIndex} — stacked endorsement review may exceed operator endorsement capacity`
    );
  }
  if (snapshot.endorsementIntegrityScore < 45) {
    lines.push(
      `Endorsement integrity ${snapshot.endorsementIntegrityScore} — align Co-Pilot endorsements with Guardian endorsement posture`
    );
  }
  if (snapshot.governanceTrustworthinessScore < 40) {
    lines.push(
      `Governance trustworthiness ${snapshot.governanceTrustworthinessScore} — little trustworthiness to sustain endorsement oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeRatificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceTrustworthinessScore < 50) load += Math.min(25, 50 - snapshot.governanceTrustworthinessScore);
  if (snapshot.governanceTrustworthinessScore < 35) load += 10;
  if (snapshot.endorsementIntegrityScore < 45) load += 20;
  if (snapshot.endorsementIntegrityScore < 35) load += 10;
  if (snapshot.endorsementStrainIndex >= 55) load += 20;
  if (snapshot.endorsementStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeRatificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.ratificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.ratificationStrainIndex * 0.35));
  if (snapshot.endorsementIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.endorsementIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceTrustworthinessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceDependabilityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.ratificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.ratificationStrainIndex * 0.32));
  if (snapshot.ratificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.ratificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceTrustworthinessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthRatificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.ratificationStrainIndex >= 55) {
    lines.push(
      `Ratification strain ${snapshot.ratificationStrainIndex} — stacked ratification review may exceed operator ratification capacity`
    );
  }
  if (snapshot.ratificationIntegrityScore < 45) {
    lines.push(
      `Ratification integrity ${snapshot.ratificationIntegrityScore} — align Co-Pilot ratifications with Guardian ratification posture`
    );
  }
  if (snapshot.governanceDependabilityScore < 40) {
    lines.push(
      `Governance dependability ${snapshot.governanceDependabilityScore} — little dependability to sustain ratification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAuthorizationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceDependabilityScore < 50) load += Math.min(25, 50 - snapshot.governanceDependabilityScore);
  if (snapshot.governanceDependabilityScore < 35) load += 10;
  if (snapshot.ratificationIntegrityScore < 45) load += 20;
  if (snapshot.ratificationIntegrityScore < 35) load += 10;
  if (snapshot.ratificationStrainIndex >= 55) load += 20;
  if (snapshot.ratificationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAuthorizationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.authorizationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.authorizationStrainIndex * 0.35));
  if (snapshot.ratificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.ratificationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceDependabilityScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceSteadfastnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.authorizationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.authorizationStrainIndex * 0.32));
  if (snapshot.authorizationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorizationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceDependabilityScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAuthorizationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.authorizationStrainIndex >= 55) {
    lines.push(
      `Authorization strain ${snapshot.authorizationStrainIndex} — stacked authorization review may exceed operator authorization capacity`
    );
  }
  if (snapshot.authorizationIntegrityScore < 45) {
    lines.push(
      `Authorization integrity ${snapshot.authorizationIntegrityScore} — align Co-Pilot authorizations with Guardian authorization posture`
    );
  }
  if (snapshot.governanceSteadfastnessScore < 40) {
    lines.push(
      `Governance steadfastness ${snapshot.governanceSteadfastnessScore} — little steadfastness to sustain authorization oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAffirmationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceSteadfastnessScore < 50) load += Math.min(25, 50 - snapshot.governanceSteadfastnessScore);
  if (snapshot.governanceSteadfastnessScore < 35) load += 10;
  if (snapshot.authorizationIntegrityScore < 45) load += 20;
  if (snapshot.authorizationIntegrityScore < 35) load += 10;
  if (snapshot.authorizationStrainIndex >= 55) load += 20;
  if (snapshot.authorizationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAffirmationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.affirmationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.affirmationStrainIndex * 0.35));
  if (snapshot.authorizationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.authorizationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceSteadfastnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResolutenessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.affirmationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.affirmationStrainIndex * 0.32));
  if (snapshot.affirmationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.affirmationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceSteadfastnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAffirmationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.affirmationStrainIndex >= 55) {
    lines.push(
      `Affirmation strain ${snapshot.affirmationStrainIndex} — stacked affirmation review may exceed operator affirmation capacity`
    );
  }
  if (snapshot.affirmationIntegrityScore < 45) {
    lines.push(
      `Affirmation integrity ${snapshot.affirmationIntegrityScore} — align Co-Pilot affirmations with Guardian affirmation posture`
    );
  }
  if (snapshot.governanceResolutenessScore < 40) {
    lines.push(
      `Governance resoluteness ${snapshot.governanceResolutenessScore} — little resoluteness to sustain affirmation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeSanctionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceResolutenessScore < 50) load += Math.min(25, 50 - snapshot.governanceResolutenessScore);
  if (snapshot.governanceResolutenessScore < 35) load += 10;
  if (snapshot.affirmationIntegrityScore < 45) load += 20;
  if (snapshot.affirmationIntegrityScore < 35) load += 10;
  if (snapshot.affirmationStrainIndex >= 55) load += 20;
  if (snapshot.affirmationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeSanctionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.sanctionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.sanctionStrainIndex * 0.35));
  if (snapshot.affirmationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.affirmationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceResolutenessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceFirmnessScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.sanctionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.sanctionStrainIndex * 0.32));
  if (snapshot.sanctionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.sanctionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceResolutenessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthSanctionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.sanctionStrainIndex >= 55) {
    lines.push(
      `Sanction strain ${snapshot.sanctionStrainIndex} — stacked sanction review may exceed operator sanction capacity`
    );
  }
  if (snapshot.sanctionIntegrityScore < 45) {
    lines.push(
      `Sanction integrity ${snapshot.sanctionIntegrityScore} — align Co-Pilot sanctions with Guardian sanction posture`
    );
  }
  if (snapshot.governanceFirmnessScore < 40) {
    lines.push(
      `Governance firmness ${snapshot.governanceFirmnessScore} — little firmness to sustain sanction oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeWarrantStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceFirmnessScore < 50) load += Math.min(25, 50 - snapshot.governanceFirmnessScore);
  if (snapshot.governanceFirmnessScore < 35) load += 10;
  if (snapshot.sanctionIntegrityScore < 45) load += 20;
  if (snapshot.sanctionIntegrityScore < 35) load += 10;
  if (snapshot.sanctionStrainIndex >= 55) load += 20;
  if (snapshot.sanctionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeWarrantIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.warrantStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.warrantStrainIndex * 0.35));
  if (snapshot.sanctionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.sanctionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceFirmnessScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceConstancyScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.warrantStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.warrantStrainIndex * 0.32));
  if (snapshot.warrantIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.warrantIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceFirmnessScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthWarrantReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.warrantStrainIndex >= 55) {
    lines.push(
      `Warrant strain ${snapshot.warrantStrainIndex} — stacked warrant review may exceed operator warrant capacity`
    );
  }
  if (snapshot.warrantIntegrityScore < 45) {
    lines.push(
      `Warrant integrity ${snapshot.warrantIntegrityScore} — align Co-Pilot warrants with Guardian warrant posture`
    );
  }
  if (snapshot.governanceConstancyScore < 40) {
    lines.push(
      `Governance constancy ${snapshot.governanceConstancyScore} — little constancy to sustain warrant oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeClearanceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceConstancyScore < 50) load += Math.min(25, 50 - snapshot.governanceConstancyScore);
  if (snapshot.governanceConstancyScore < 35) load += 10;
  if (snapshot.warrantIntegrityScore < 45) load += 20;
  if (snapshot.warrantIntegrityScore < 35) load += 10;
  if (snapshot.warrantStrainIndex >= 55) load += 20;
  if (snapshot.warrantStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeClearanceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clearanceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.clearanceStrainIndex * 0.35));
  if (snapshot.warrantIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.warrantIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceConstancyScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernancePerseveranceScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clearanceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.clearanceStrainIndex * 0.32));
  if (snapshot.clearanceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clearanceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceConstancyScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthClearanceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.clearanceStrainIndex >= 55) {
    lines.push(
      `Clearance strain ${snapshot.clearanceStrainIndex} — stacked clearance review may exceed operator clearance capacity`
    );
  }
  if (snapshot.clearanceIntegrityScore < 45) {
    lines.push(
      `Clearance integrity ${snapshot.clearanceIntegrityScore} — align Co-Pilot clearances with Guardian clearance posture`
    );
  }
  if (snapshot.governancePerseveranceScore < 40) {
    lines.push(
      `Governance perseverance ${snapshot.governancePerseveranceScore} — little perseverance to sustain clearance oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeDispensationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governancePerseveranceScore < 50) load += Math.min(25, 50 - snapshot.governancePerseveranceScore);
  if (snapshot.governancePerseveranceScore < 35) load += 10;
  if (snapshot.clearanceIntegrityScore < 45) load += 20;
  if (snapshot.clearanceIntegrityScore < 35) load += 10;
  if (snapshot.clearanceStrainIndex >= 55) load += 20;
  if (snapshot.clearanceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeDispensationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.dispensationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.dispensationStrainIndex * 0.35));
  if (snapshot.clearanceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clearanceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governancePerseveranceScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceFortitudeScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.dispensationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.dispensationStrainIndex * 0.32));
  if (snapshot.dispensationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.dispensationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governancePerseveranceScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthDispensationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.dispensationStrainIndex >= 55) {
    lines.push(
      `Dispensation strain ${snapshot.dispensationStrainIndex} — stacked dispensation review may exceed operator dispensation capacity`
    );
  }
  if (snapshot.dispensationIntegrityScore < 45) {
    lines.push(
      `Dispensation integrity ${snapshot.dispensationIntegrityScore} — align Co-Pilot dispensations with Guardian dispensation posture`
    );
  }
  if (snapshot.governanceFortitudeScore < 40) {
    lines.push(
      `Governance fortitude ${snapshot.governanceFortitudeScore} — little fortitude to sustain dispensation oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeIndulgenceStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceFortitudeScore < 50) load += Math.min(25, 50 - snapshot.governanceFortitudeScore);
  if (snapshot.governanceFortitudeScore < 35) load += 10;
  if (snapshot.dispensationIntegrityScore < 45) load += 20;
  if (snapshot.dispensationIntegrityScore < 35) load += 10;
  if (snapshot.dispensationStrainIndex >= 55) load += 20;
  if (snapshot.dispensationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeIndulgenceIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.indulgenceStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.indulgenceStrainIndex * 0.35));
  if (snapshot.dispensationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.dispensationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceFortitudeScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceVigorScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.indulgenceStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.indulgenceStrainIndex * 0.32));
  if (snapshot.indulgenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.indulgenceIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceFortitudeScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthIndulgenceReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.indulgenceStrainIndex >= 55) {
    lines.push(
      `Indulgence strain ${snapshot.indulgenceStrainIndex} — stacked indulgence review may exceed operator indulgence capacity`
    );
  }
  if (snapshot.indulgenceIntegrityScore < 45) {
    lines.push(
      `Indulgence integrity ${snapshot.indulgenceIntegrityScore} — align Co-Pilot indulgences with Guardian indulgence posture`
    );
  }
  if (snapshot.governanceVigorScore < 40) {
    lines.push(
      `Governance vigor ${snapshot.governanceVigorScore} — little vigor to sustain indulgence oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeExemptionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceVigorScore < 50) load += Math.min(25, 50 - snapshot.governanceVigorScore);
  if (snapshot.governanceVigorScore < 35) load += 10;
  if (snapshot.indulgenceIntegrityScore < 45) load += 20;
  if (snapshot.indulgenceIntegrityScore < 35) load += 10;
  if (snapshot.indulgenceStrainIndex >= 55) load += 20;
  if (snapshot.indulgenceStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeExemptionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exemptionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.exemptionStrainIndex * 0.35));
  if (snapshot.indulgenceIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.indulgenceIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceVigorScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceStaminaScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exemptionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.exemptionStrainIndex * 0.32));
  if (snapshot.exemptionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exemptionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceVigorScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthExemptionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.exemptionStrainIndex >= 55) {
    lines.push(
      `Exemption strain ${snapshot.exemptionStrainIndex} — stacked exemption review may exceed operator exemption capacity`
    );
  }
  if (snapshot.exemptionIntegrityScore < 45) {
    lines.push(
      `Exemption integrity ${snapshot.exemptionIntegrityScore} — align Co-Pilot exemptions with Guardian exemption posture`
    );
  }
  if (snapshot.governanceStaminaScore < 40) {
    lines.push(
      `Governance stamina ${snapshot.governanceStaminaScore} — little stamina to sustain exemption oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeRemissionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceStaminaScore < 50) load += Math.min(25, 50 - snapshot.governanceStaminaScore);
  if (snapshot.governanceStaminaScore < 35) load += 10;
  if (snapshot.exemptionIntegrityScore < 45) load += 20;
  if (snapshot.exemptionIntegrityScore < 35) load += 10;
  if (snapshot.exemptionStrainIndex >= 55) load += 20;
  if (snapshot.exemptionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeRemissionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.remissionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.remissionStrainIndex * 0.35));
  if (snapshot.exemptionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exemptionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceStaminaScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceMettleScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.remissionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.remissionStrainIndex * 0.32));
  if (snapshot.remissionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.remissionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceStaminaScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthRemissionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.remissionStrainIndex >= 55) {
    lines.push(
      `Remission strain ${snapshot.remissionStrainIndex} — stacked remission review may exceed operator remission capacity`
    );
  }
  if (snapshot.remissionIntegrityScore < 45) {
    lines.push(
      `Remission integrity ${snapshot.remissionIntegrityScore} — align Co-Pilot remissions with Guardian remission posture`
    );
  }
  if (snapshot.governanceMettleScore < 40) {
    lines.push(
      `Governance mettle ${snapshot.governanceMettleScore} — little mettle to sustain remission oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAbsolutionStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceMettleScore < 50) load += Math.min(25, 50 - snapshot.governanceMettleScore);
  if (snapshot.governanceMettleScore < 35) load += 10;
  if (snapshot.remissionIntegrityScore < 45) load += 20;
  if (snapshot.remissionIntegrityScore < 35) load += 10;
  if (snapshot.remissionStrainIndex >= 55) load += 20;
  if (snapshot.remissionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAbsolutionIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.absolutionStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.absolutionStrainIndex * 0.35));
  if (snapshot.remissionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.remissionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceMettleScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceGritScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.absolutionStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.absolutionStrainIndex * 0.32));
  if (snapshot.absolutionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.absolutionIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceMettleScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAbsolutionReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.absolutionStrainIndex >= 55) {
    lines.push(
      `Absolution strain ${snapshot.absolutionStrainIndex} — stacked absolution review may exceed operator absolution capacity`
    );
  }
  if (snapshot.absolutionIntegrityScore < 45) {
    lines.push(
      `Absolution integrity ${snapshot.absolutionIntegrityScore} — align Co-Pilot absolutions with Guardian absolution posture`
    );
  }
  if (snapshot.governanceGritScore < 40) {
    lines.push(
      `Governance grit ${snapshot.governanceGritScore} — little grit to sustain absolution oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAmnestyStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceGritScore < 50) load += Math.min(25, 50 - snapshot.governanceGritScore);
  if (snapshot.governanceGritScore < 35) load += 10;
  if (snapshot.absolutionIntegrityScore < 45) load += 20;
  if (snapshot.absolutionIntegrityScore < 35) load += 10;
  if (snapshot.absolutionStrainIndex >= 55) load += 20;
  if (snapshot.absolutionStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAmnestyIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.amnestyStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.amnestyStrainIndex * 0.35));
  if (snapshot.absolutionIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.absolutionIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceGritScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceResolveScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.amnestyStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.amnestyStrainIndex * 0.32));
  if (snapshot.amnestyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.amnestyIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceGritScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAmnestyReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.amnestyStrainIndex >= 55) {
    lines.push(
      `Amnesty strain ${snapshot.amnestyStrainIndex} — stacked amnesty review may exceed operator amnesty capacity`
    );
  }
  if (snapshot.amnestyIntegrityScore < 45) {
    lines.push(
      `Amnesty integrity ${snapshot.amnestyIntegrityScore} — align Co-Pilot amnesties with Guardian amnesty posture`
    );
  }
  if (snapshot.governanceResolveScore < 40) {
    lines.push(
      `Governance resolve ${snapshot.governanceResolveScore} — little resolve to sustain amnesty oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computePardonStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceResolveScore < 50) load += Math.min(25, 50 - snapshot.governanceResolveScore);
  if (snapshot.governanceResolveScore < 35) load += 10;
  if (snapshot.amnestyIntegrityScore < 45) load += 20;
  if (snapshot.amnestyIntegrityScore < 35) load += 10;
  if (snapshot.amnestyStrainIndex >= 55) load += 20;
  if (snapshot.amnestyStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computePardonIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.pardonStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.pardonStrainIndex * 0.35));
  if (snapshot.amnestyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.amnestyIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceResolveScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceZealScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.pardonStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.pardonStrainIndex * 0.32));
  if (snapshot.pardonIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.pardonIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceResolveScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthPardonReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.pardonStrainIndex >= 55) {
    lines.push(
      `Pardon strain ${snapshot.pardonStrainIndex} — stacked pardon review may exceed operator pardon capacity`
    );
  }
  if (snapshot.pardonIntegrityScore < 45) {
    lines.push(
      `Pardon integrity ${snapshot.pardonIntegrityScore} — align Co-Pilot pardons with Guardian pardon posture`
    );
  }
  if (snapshot.governanceZealScore < 40) {
    lines.push(
      `Governance zeal ${snapshot.governanceZealScore} — little zeal to sustain pardon oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeClemencyStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceZealScore < 50) load += Math.min(25, 50 - snapshot.governanceZealScore);
  if (snapshot.governanceZealScore < 35) load += 10;
  if (snapshot.pardonIntegrityScore < 45) load += 20;
  if (snapshot.pardonIntegrityScore < 35) load += 10;
  if (snapshot.pardonStrainIndex >= 55) load += 20;
  if (snapshot.pardonStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeClemencyIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clemencyStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.clemencyStrainIndex * 0.35));
  if (snapshot.pardonIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.pardonIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceZealScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernancePluckScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.clemencyStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.clemencyStrainIndex * 0.32));
  if (snapshot.clemencyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clemencyIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceZealScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthClemencyReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.clemencyStrainIndex >= 55) {
    lines.push(
      `Clemency strain ${snapshot.clemencyStrainIndex} — stacked clemency review may exceed operator clemency capacity`
    );
  }
  if (snapshot.clemencyIntegrityScore < 45) {
    lines.push(
      `Clemency integrity ${snapshot.clemencyIntegrityScore} — align Co-Pilot clemencies with Guardian clemency posture`
    );
  }
  if (snapshot.governancePluckScore < 40) {
    lines.push(
      `Governance pluck ${snapshot.governancePluckScore} — little pluck to sustain clemency oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeReprieveStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governancePluckScore < 50) load += Math.min(25, 50 - snapshot.governancePluckScore);
  if (snapshot.governancePluckScore < 35) load += 10;
  if (snapshot.clemencyIntegrityScore < 45) load += 20;
  if (snapshot.clemencyIntegrityScore < 35) load += 10;
  if (snapshot.clemencyStrainIndex >= 55) load += 20;
  if (snapshot.clemencyStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeReprieveIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.reprieveStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.reprieveStrainIndex * 0.35));
  if (snapshot.clemencyIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.clemencyIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governancePluckScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceNerveScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.reprieveStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.reprieveStrainIndex * 0.32));
  if (snapshot.reprieveIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.reprieveIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governancePluckScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthReprieveReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.reprieveStrainIndex >= 55) {
    lines.push(
      `Reprieve strain ${snapshot.reprieveStrainIndex} — stacked reprieve review may exceed operator reprieve capacity`
    );
  }
  if (snapshot.reprieveIntegrityScore < 45) {
    lines.push(
      `Reprieve integrity ${snapshot.reprieveIntegrityScore} — align Co-Pilot reprieves with Guardian reprieve posture`
    );
  }
  if (snapshot.governanceNerveScore < 40) {
    lines.push(
      `Governance nerve ${snapshot.governanceNerveScore} — little nerve to sustain reprieve oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeAcquittalStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceNerveScore < 50) load += Math.min(25, 50 - snapshot.governanceNerveScore);
  if (snapshot.governanceNerveScore < 35) load += 10;
  if (snapshot.reprieveIntegrityScore < 45) load += 20;
  if (snapshot.reprieveIntegrityScore < 35) load += 10;
  if (snapshot.reprieveStrainIndex >= 55) load += 20;
  if (snapshot.reprieveStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeAcquittalIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.acquittalStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.acquittalStrainIndex * 0.35));
  if (snapshot.reprieveIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.reprieveIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceNerveScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceMoxieScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.acquittalStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.acquittalStrainIndex * 0.32));
  if (snapshot.acquittalIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.acquittalIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceNerveScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthAcquittalReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.acquittalStrainIndex >= 55) {
    lines.push(
      `Acquittal strain ${snapshot.acquittalStrainIndex} — stacked acquittal review may exceed operator acquittal capacity`
    );
  }
  if (snapshot.acquittalIntegrityScore < 45) {
    lines.push(
      `Acquittal integrity ${snapshot.acquittalIntegrityScore} — align Co-Pilot acquittals with Guardian acquittal posture`
    );
  }
  if (snapshot.governanceMoxieScore < 40) {
    lines.push(
      `Governance moxie ${snapshot.governanceMoxieScore} — little moxie to sustain acquittal oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeExonerationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceMoxieScore < 50) load += Math.min(25, 50 - snapshot.governanceMoxieScore);
  if (snapshot.governanceMoxieScore < 35) load += 10;
  if (snapshot.acquittalIntegrityScore < 45) load += 20;
  if (snapshot.acquittalIntegrityScore < 35) load += 10;
  if (snapshot.acquittalStrainIndex >= 55) load += 20;
  if (snapshot.acquittalStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeExonerationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exonerationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.exonerationStrainIndex * 0.35));
  if (snapshot.acquittalIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.acquittalIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceMoxieScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceSpunkScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.exonerationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.exonerationStrainIndex * 0.32));
  if (snapshot.exonerationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exonerationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceMoxieScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthExonerationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.exonerationStrainIndex >= 55) {
    lines.push(
      `Exoneration strain ${snapshot.exonerationStrainIndex} — stacked exoneration review may exceed operator exoneration capacity`
    );
  }
  if (snapshot.exonerationIntegrityScore < 45) {
    lines.push(
      `Exoneration integrity ${snapshot.exonerationIntegrityScore} — align Co-Pilot exonerations with Guardian exoneration posture`
    );
  }
  if (snapshot.governanceSpunkScore < 40) {
    lines.push(
      `Governance spunk ${snapshot.governanceSpunkScore} — little spunk to sustain exoneration oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeVindicationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceSpunkScore < 50) load += Math.min(25, 50 - snapshot.governanceSpunkScore);
  if (snapshot.governanceSpunkScore < 35) load += 10;
  if (snapshot.exonerationIntegrityScore < 45) load += 20;
  if (snapshot.exonerationIntegrityScore < 35) load += 10;
  if (snapshot.exonerationStrainIndex >= 55) load += 20;
  if (snapshot.exonerationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeVindicationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.vindicationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.vindicationStrainIndex * 0.35));
  if (snapshot.exonerationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.exonerationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceSpunkScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceDashScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.vindicationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.vindicationStrainIndex * 0.32));
  if (snapshot.vindicationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.vindicationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceSpunkScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthVindicationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.vindicationStrainIndex >= 55) {
    lines.push(
      `Vindication strain ${snapshot.vindicationStrainIndex} — stacked vindication review may exceed operator vindication capacity`
    );
  }
  if (snapshot.vindicationIntegrityScore < 45) {
    lines.push(
      `Vindication integrity ${snapshot.vindicationIntegrityScore} — align Co-Pilot vindications with Guardian vindication posture`
    );
  }
  if (snapshot.governanceDashScore < 40) {
    lines.push(
      `Governance dash ${snapshot.governanceDashScore} — little dash to sustain vindication oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function computeJustificationStrainIndex(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let load = 0;
  if (snapshot.governanceDashScore < 50) load += Math.min(25, 50 - snapshot.governanceDashScore);
  if (snapshot.governanceDashScore < 35) load += 10;
  if (snapshot.vindicationIntegrityScore < 45) load += 20;
  if (snapshot.vindicationIntegrityScore < 35) load += 10;
  if (snapshot.vindicationStrainIndex >= 55) load += 20;
  if (snapshot.vindicationStrainIndex >= 70) load += 10;
  if (snapshot.advisorySaturationIndex >= 55) load += 15;
  if (snapshot.takeoverSessionActive) load += 10;
  if (snapshot.teamPlanPending) load += 10;
  if (snapshot.guardianReplayCount >= 3) load += 10;
  return Math.min(100, load);
}

export function computeJustificationIntegrityScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.justificationStrainIndex >= 45) score -= Math.min(30, Math.round(snapshot.justificationStrainIndex * 0.35));
  if (snapshot.vindicationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.vindicationIntegrityScore);
  if (!snapshot.guardianEnabled && snapshot.copilotAutonomousActive) score -= 20;
  if (snapshot.guardianAutomationLikelyBlocked && snapshot.copilotAutonomousActive) score -= 10;
  if (snapshot.governanceDashScore < 40) score -= 15;
  if (snapshot.blockedContinueCount >= 2) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeGovernanceBrioScore(snapshot: GuardianCoPilotMonitorSnapshot): number {
  let score = 100;
  if (snapshot.justificationStrainIndex >= 40) score -= Math.min(30, Math.round(snapshot.justificationStrainIndex * 0.32));
  if (snapshot.justificationIntegrityScore < 50) score -= Math.min(25, 50 - snapshot.justificationIntegrityScore);
  if (snapshot.recoveryHeadroomScore < 40) score -= 10;
  if (snapshot.governanceDashScore < 35) score -= 10;
  if (snapshot.liquidityStressIndex >= 55) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function buildGuardianDepthJustificationReport(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const lines: string[] = [];
  if (snapshot.justificationStrainIndex >= 55) {
    lines.push(
      `Justification strain ${snapshot.justificationStrainIndex} — stacked justification review may exceed operator justification capacity`
    );
  }
  if (snapshot.justificationIntegrityScore < 45) {
    lines.push(
      `Justification integrity ${snapshot.justificationIntegrityScore} — align Co-Pilot justifications with Guardian justification posture`
    );
  }
  if (snapshot.governanceBrioScore < 40) {
    lines.push(
      `Governance brio ${snapshot.governanceBrioScore} — little brio to sustain justification oversight across upcoming turns`
    );
  }
  return lines.slice(0, 3);
}

export function enrichSnapshotGuardianDepth(snapshot: GuardianCoPilotMonitorSnapshot): GuardianCoPilotMonitorSnapshot {
  const posture = deriveGuardianAdvisoryPosture(snapshot);
  const objectiveBehindSchedule = computeObjectiveBehindSchedule(snapshot);
  const copilotSpendingHeadroom = computeCopilotSpendingHeadroom(snapshot);
  const merged: GuardianCoPilotMonitorSnapshot = {
    ...snapshot,
    guardianAutomationLikelyBlocked: posture.automationLikelyBlocked,
    guardianConfirmationLikelyRequired: posture.confirmationLikelyRequired,
    objectiveBehindSchedule,
    copilotSpendingHeadroom,
  };
  const guardianRiskScore = computeGuardianRiskScore(merged);
  const withRisk: GuardianCoPilotMonitorSnapshot = {
    ...merged,
    guardianRiskScore,
    guardianRiskBand: classifyGuardianRiskBand(guardianRiskScore),
  };
  const withCoupling: GuardianCoPilotMonitorSnapshot = {
    ...withRisk,
    liquidityStressIndex: computeLiquidityStressIndex(withRisk),
    copilotTrustGapScore: computeCopilotTrustGapScore(withRisk),
    objectivePacePct: computeObjectivePacePct(withRisk),
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
  };
  const compositePressureIndex = computeCompositePressureIndex(withCoupling);
  const withPressure: GuardianCoPilotMonitorSnapshot = { ...withCoupling, compositePressureIndex };
  const withInterlock: GuardianCoPilotMonitorSnapshot = {
    ...withPressure,
    automationReadinessScore: computeAutomationReadinessScore(withPressure),
    actionBurnPressure: computeActionBurnPressure(withPressure),
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
  };
  const advisorySaturationIndex = computeAdvisorySaturationIndex(withInterlock);
  const withSaturation: GuardianCoPilotMonitorSnapshot = { ...withInterlock, advisorySaturationIndex };
  const governanceCoherenceScore = computeGovernanceCoherenceScore(withSaturation);
  const withGovernance: GuardianCoPilotMonitorSnapshot = { ...withSaturation, governanceCoherenceScore };
  const withLatch: GuardianCoPilotMonitorSnapshot = {
    ...withGovernance,
    escalationLatchScore: computeEscalationLatchScore(withGovernance),
    containmentBurdenIndex: 0,
    humanRelayPressure: 0,
    recoveryHeadroomScore: 100,
  };
  const containmentBurdenIndex = computeContainmentBurdenIndex(withLatch);
  const withBurden: GuardianCoPilotMonitorSnapshot = { ...withLatch, containmentBurdenIndex };
  const humanRelayPressure = computeHumanRelayPressure(withBurden);
  const withRelay: GuardianCoPilotMonitorSnapshot = { ...withBurden, humanRelayPressure };
  const withRecovery: GuardianCoPilotMonitorSnapshot = {
    ...withRelay,
    recoveryHeadroomScore: computeRecoveryHeadroomScore(withRelay),
    advisoryDepletionIndex: 0,
    operatorBandwidthScore: 100,
    continuityMarginScore: 100,
  };
  const advisoryDepletionIndex = computeAdvisoryDepletionIndex(withRecovery);
  const withDepletion: GuardianCoPilotMonitorSnapshot = { ...withRecovery, advisoryDepletionIndex };
  const operatorBandwidthScore = computeOperatorBandwidthScore(withDepletion);
  const withBandwidth: GuardianCoPilotMonitorSnapshot = { ...withDepletion, operatorBandwidthScore };
  const withContinuity: GuardianCoPilotMonitorSnapshot = {
    ...withBandwidth,
    continuityMarginScore: computeContinuityMarginScore(withBandwidth),
    stewardshipLoadIndex: 0,
    oversightCommitmentScore: 100,
    sustainabilityMarginScore: 100,
  };
  const stewardshipLoadIndex = computeStewardshipLoadIndex(withContinuity);
  const withLoad: GuardianCoPilotMonitorSnapshot = { ...withContinuity, stewardshipLoadIndex };
  const oversightCommitmentScore = computeOversightCommitmentScore(withLoad);
  const withOversight: GuardianCoPilotMonitorSnapshot = { ...withLoad, oversightCommitmentScore };
  const withSustainability: GuardianCoPilotMonitorSnapshot = {
    ...withOversight,
    sustainabilityMarginScore: computeSustainabilityMarginScore(withOversight),
    accountabilityLoadIndex: 0,
    delegationFidelityScore: 100,
    governanceEnduranceScore: 100,
  };
  const accountabilityLoadIndex = computeAccountabilityLoadIndex(withSustainability);
  const withAccountability: GuardianCoPilotMonitorSnapshot = { ...withSustainability, accountabilityLoadIndex };
  const delegationFidelityScore = computeDelegationFidelityScore(withAccountability);
  const withFidelity: GuardianCoPilotMonitorSnapshot = { ...withAccountability, delegationFidelityScore };
  const withEndurance: GuardianCoPilotMonitorSnapshot = {
    ...withFidelity,
    governanceEnduranceScore: computeGovernanceEnduranceScore(withFidelity),
    fiduciaryBurdenIndex: 0,
    trustAssuranceScore: 100,
    governanceDurabilityScore: 100,
  };
  const fiduciaryBurdenIndex = computeFiduciaryBurdenIndex(withEndurance);
  const withFiduciaryBurden: GuardianCoPilotMonitorSnapshot = { ...withEndurance, fiduciaryBurdenIndex };
  const trustAssuranceScore = computeTrustAssuranceScore(withFiduciaryBurden);
  const withAssurance: GuardianCoPilotMonitorSnapshot = { ...withFiduciaryBurden, trustAssuranceScore };
  const withDurability: GuardianCoPilotMonitorSnapshot = {
    ...withAssurance,
    governanceDurabilityScore: computeGovernanceDurabilityScore(withAssurance),
    covenantStrainIndex: 0,
    mandateIntegrityScore: 100,
    governanceTenacityScore: 100,
  };
  const covenantStrainIndex = computeCovenantStrainIndex(withDurability);
  const withCovenantStrain: GuardianCoPilotMonitorSnapshot = { ...withDurability, covenantStrainIndex };
  const mandateIntegrityScore = computeMandateIntegrityScore(withCovenantStrain);
  const withMandate: GuardianCoPilotMonitorSnapshot = { ...withCovenantStrain, mandateIntegrityScore };
  const withTenacity: GuardianCoPilotMonitorSnapshot = {
    ...withMandate,
    governanceTenacityScore: computeGovernanceTenacityScore(withMandate),
    charterStrainIndex: 0,
    authorityIntegrityScore: 100,
    governancePersistenceScore: 100,
  };
  const charterStrainIndex = computeCharterStrainIndex(withTenacity);
  const withCharterStrain: GuardianCoPilotMonitorSnapshot = { ...withTenacity, charterStrainIndex };
  const authorityIntegrityScore = computeAuthorityIntegrityScore(withCharterStrain);
  const withAuthority: GuardianCoPilotMonitorSnapshot = { ...withCharterStrain, authorityIntegrityScore };
  const withPersistence: GuardianCoPilotMonitorSnapshot = {
    ...withAuthority,
    governancePersistenceScore: computeGovernancePersistenceScore(withAuthority),
    legitimacyStrainIndex: 0,
    oversightIntegrityScore: 100,
    governanceContinuityScore: 100,
  };
  const legitimacyStrainIndex = computeLegitimacyStrainIndex(withPersistence);
  const withLegitimacyStrain: GuardianCoPilotMonitorSnapshot = { ...withPersistence, legitimacyStrainIndex };
  const oversightIntegrityScore = computeOversightIntegrityScore(withLegitimacyStrain);
  const withOversightIntegrity: GuardianCoPilotMonitorSnapshot = { ...withLegitimacyStrain, oversightIntegrityScore };
  const withGovernanceContinuity: GuardianCoPilotMonitorSnapshot = {
    ...withOversightIntegrity,
    governanceContinuityScore: computeGovernanceContinuityScore(withOversightIntegrity),
    complianceStrainIndex: 0,
    policyIntegrityScore: 100,
    governanceResilienceScore: 100,
  };
  const complianceStrainIndex = computeComplianceStrainIndex(withGovernanceContinuity);
  const withComplianceStrain: GuardianCoPilotMonitorSnapshot = { ...withGovernanceContinuity, complianceStrainIndex };
  const policyIntegrityScore = computePolicyIntegrityScore(withComplianceStrain);
  const withPolicy: GuardianCoPilotMonitorSnapshot = { ...withComplianceStrain, policyIntegrityScore };
  const withResilience: GuardianCoPilotMonitorSnapshot = {
    ...withPolicy,
    governanceResilienceScore: computeGovernanceResilienceScore(withPolicy),
    auditStrainIndex: 0,
    controlIntegrityScore: 100,
    governanceStabilityScore: 100,
  };
  const auditStrainIndex = computeAuditStrainIndex(withResilience);
  const withAuditStrain: GuardianCoPilotMonitorSnapshot = { ...withResilience, auditStrainIndex };
  const controlIntegrityScore = computeControlIntegrityScore(withAuditStrain);
  const withControl: GuardianCoPilotMonitorSnapshot = { ...withAuditStrain, controlIntegrityScore };
  const withStability: GuardianCoPilotMonitorSnapshot = {
    ...withControl,
    governanceStabilityScore: computeGovernanceStabilityScore(withControl),
    assuranceStrainIndex: 0,
    evidenceIntegrityScore: 100,
    governanceConfidenceScore: 100,
  };
  const assuranceStrainIndex = computeAssuranceStrainIndex(withStability);
  const withAssuranceStrain: GuardianCoPilotMonitorSnapshot = { ...withStability, assuranceStrainIndex };
  const evidenceIntegrityScore = computeEvidenceIntegrityScore(withAssuranceStrain);
  const withEvidence: GuardianCoPilotMonitorSnapshot = { ...withAssuranceStrain, evidenceIntegrityScore };
  const withConfidence: GuardianCoPilotMonitorSnapshot = {
    ...withEvidence,
    governanceConfidenceScore: computeGovernanceConfidenceScore(withEvidence),
    attestationStrainIndex: 0,
    attestationIntegrityScore: 100,
    governanceReliabilityScore: 100,
  };
  const attestationStrainIndex = computeAttestationStrainIndex(withConfidence);
  const withAttestationStrain: GuardianCoPilotMonitorSnapshot = { ...withConfidence, attestationStrainIndex };
  const attestationIntegrityScore = computeAttestationIntegrityScore(withAttestationStrain);
  const withAttestation: GuardianCoPilotMonitorSnapshot = { ...withAttestationStrain, attestationIntegrityScore };
  const withReliability: GuardianCoPilotMonitorSnapshot = {
    ...withAttestation,
    governanceReliabilityScore: computeGovernanceReliabilityScore(withAttestation),
    verificationStrainIndex: 0,
    verificationIntegrityScore: 100,
    governanceValidityScore: 100,
  };
  const verificationStrainIndex = computeVerificationStrainIndex(withReliability);
  const withVerificationStrain: GuardianCoPilotMonitorSnapshot = { ...withReliability, verificationStrainIndex };
  const verificationIntegrityScore = computeVerificationIntegrityScore(withVerificationStrain);
  const withVerification: GuardianCoPilotMonitorSnapshot = { ...withVerificationStrain, verificationIntegrityScore };
  const withValidity: GuardianCoPilotMonitorSnapshot = {
    ...withVerification,
    governanceValidityScore: computeGovernanceValidityScore(withVerification),
    validationStrainIndex: 0,
    validationIntegrityScore: 100,
    governanceSoundnessScore: 100,
  };
  const validationStrainIndex = computeValidationStrainIndex(withValidity);
  const withValidationStrain: GuardianCoPilotMonitorSnapshot = { ...withValidity, validationStrainIndex };
  const validationIntegrityScore = computeValidationIntegrityScore(withValidationStrain);
  const withValidation: GuardianCoPilotMonitorSnapshot = { ...withValidationStrain, validationIntegrityScore };
  const withSoundness: GuardianCoPilotMonitorSnapshot = {
    ...withValidation,
    governanceSoundnessScore: computeGovernanceSoundnessScore(withValidation),
    certificationStrainIndex: 0,
    certificationIntegrityScore: 100,
    governanceAuthenticityScore: 100,
  };
  const certificationStrainIndex = computeCertificationStrainIndex(withSoundness);
  const withCertificationStrain: GuardianCoPilotMonitorSnapshot = { ...withSoundness, certificationStrainIndex };
  const certificationIntegrityScore = computeCertificationIntegrityScore(withCertificationStrain);
  const withCertification: GuardianCoPilotMonitorSnapshot = { ...withCertificationStrain, certificationIntegrityScore };
  const withAuthenticity: GuardianCoPilotMonitorSnapshot = {
    ...withCertification,
    governanceAuthenticityScore: computeGovernanceAuthenticityScore(withCertification),
    accreditationStrainIndex: 0,
    accreditationIntegrityScore: 100,
    governanceCredibilityScore: 100,
  };
  const accreditationStrainIndex = computeAccreditationStrainIndex(withAuthenticity);
  const withAccreditationStrain: GuardianCoPilotMonitorSnapshot = { ...withAuthenticity, accreditationStrainIndex };
  const accreditationIntegrityScore = computeAccreditationIntegrityScore(withAccreditationStrain);
  const withAccreditation: GuardianCoPilotMonitorSnapshot = { ...withAccreditationStrain, accreditationIntegrityScore };
  const withCredibility: GuardianCoPilotMonitorSnapshot = {
    ...withAccreditation,
    governanceCredibilityScore: computeGovernanceCredibilityScore(withAccreditation),
    endorsementStrainIndex: 0,
    endorsementIntegrityScore: 100,
    governanceTrustworthinessScore: 100,
  };
  const endorsementStrainIndex = computeEndorsementStrainIndex(withCredibility);
  const withEndorsementStrain: GuardianCoPilotMonitorSnapshot = { ...withCredibility, endorsementStrainIndex };
  const endorsementIntegrityScore = computeEndorsementIntegrityScore(withEndorsementStrain);
  const withEndorsement: GuardianCoPilotMonitorSnapshot = { ...withEndorsementStrain, endorsementIntegrityScore };
  const withTrustworthiness: GuardianCoPilotMonitorSnapshot = {
    ...withEndorsement,
    governanceTrustworthinessScore: computeGovernanceTrustworthinessScore(withEndorsement),
    ratificationStrainIndex: 0,
    ratificationIntegrityScore: 100,
    governanceDependabilityScore: 100,
  };
  const ratificationStrainIndex = computeRatificationStrainIndex(withTrustworthiness);
  const withRatificationStrain: GuardianCoPilotMonitorSnapshot = { ...withTrustworthiness, ratificationStrainIndex };
  const ratificationIntegrityScore = computeRatificationIntegrityScore(withRatificationStrain);
  const withRatification: GuardianCoPilotMonitorSnapshot = { ...withRatificationStrain, ratificationIntegrityScore };
  const withDependability: GuardianCoPilotMonitorSnapshot = {
    ...withRatification,
    governanceDependabilityScore: computeGovernanceDependabilityScore(withRatification),
    authorizationStrainIndex: 0,
    authorizationIntegrityScore: 100,
    governanceSteadfastnessScore: 100,
  };
  const authorizationStrainIndex = computeAuthorizationStrainIndex(withDependability);
  const withAuthorizationStrain: GuardianCoPilotMonitorSnapshot = { ...withDependability, authorizationStrainIndex };
  const authorizationIntegrityScore = computeAuthorizationIntegrityScore(withAuthorizationStrain);
  const withAuthorization: GuardianCoPilotMonitorSnapshot = { ...withAuthorizationStrain, authorizationIntegrityScore };
  const withSteadfastness: GuardianCoPilotMonitorSnapshot = {
    ...withAuthorization,
    governanceSteadfastnessScore: computeGovernanceSteadfastnessScore(withAuthorization),
    affirmationStrainIndex: 0,
    affirmationIntegrityScore: 100,
    governanceResolutenessScore: 100,
  };
  const affirmationStrainIndex = computeAffirmationStrainIndex(withSteadfastness);
  const withAffirmationStrain: GuardianCoPilotMonitorSnapshot = { ...withSteadfastness, affirmationStrainIndex };
  const affirmationIntegrityScore = computeAffirmationIntegrityScore(withAffirmationStrain);
  const withAffirmation: GuardianCoPilotMonitorSnapshot = { ...withAffirmationStrain, affirmationIntegrityScore };
  const withResoluteness: GuardianCoPilotMonitorSnapshot = {
    ...withAffirmation,
    governanceResolutenessScore: computeGovernanceResolutenessScore(withAffirmation),
    sanctionStrainIndex: 0,
    sanctionIntegrityScore: 100,
    governanceFirmnessScore: 100,
  };
  const sanctionStrainIndex = computeSanctionStrainIndex(withResoluteness);
  const withSanctionStrain: GuardianCoPilotMonitorSnapshot = { ...withResoluteness, sanctionStrainIndex };
  const sanctionIntegrityScore = computeSanctionIntegrityScore(withSanctionStrain);
  const withSanction: GuardianCoPilotMonitorSnapshot = { ...withSanctionStrain, sanctionIntegrityScore };
  const withFirmness: GuardianCoPilotMonitorSnapshot = {
    ...withSanction,
    governanceFirmnessScore: computeGovernanceFirmnessScore(withSanction),
    warrantStrainIndex: 0,
    warrantIntegrityScore: 100,
    governanceConstancyScore: 100,
  };
  const warrantStrainIndex = computeWarrantStrainIndex(withFirmness);
  const withWarrantStrain: GuardianCoPilotMonitorSnapshot = { ...withFirmness, warrantStrainIndex };
  const warrantIntegrityScore = computeWarrantIntegrityScore(withWarrantStrain);
  const withWarrant: GuardianCoPilotMonitorSnapshot = { ...withWarrantStrain, warrantIntegrityScore };
  const withConstancy: GuardianCoPilotMonitorSnapshot = {
    ...withWarrant,
    governanceConstancyScore: computeGovernanceConstancyScore(withWarrant),
    clearanceStrainIndex: 0,
    clearanceIntegrityScore: 100,
    governancePerseveranceScore: 100,
  };
  const clearanceStrainIndex = computeClearanceStrainIndex(withConstancy);
  const withClearanceStrain: GuardianCoPilotMonitorSnapshot = { ...withConstancy, clearanceStrainIndex };
  const clearanceIntegrityScore = computeClearanceIntegrityScore(withClearanceStrain);
  const withClearance: GuardianCoPilotMonitorSnapshot = { ...withClearanceStrain, clearanceIntegrityScore };
  const withPerseverance: GuardianCoPilotMonitorSnapshot = {
    ...withClearance,
    governancePerseveranceScore: computeGovernancePerseveranceScore(withClearance),
    dispensationStrainIndex: 0,
    dispensationIntegrityScore: 100,
    governanceFortitudeScore: 100,
  };
  const dispensationStrainIndex = computeDispensationStrainIndex(withPerseverance);
  const withDispensationStrain: GuardianCoPilotMonitorSnapshot = { ...withPerseverance, dispensationStrainIndex };
  const dispensationIntegrityScore = computeDispensationIntegrityScore(withDispensationStrain);
  const withDispensation: GuardianCoPilotMonitorSnapshot = { ...withDispensationStrain, dispensationIntegrityScore };
  const withFortitude: GuardianCoPilotMonitorSnapshot = {
    ...withDispensation,
    governanceFortitudeScore: computeGovernanceFortitudeScore(withDispensation),
    indulgenceStrainIndex: 0,
    indulgenceIntegrityScore: 100,
    governanceVigorScore: 100,
  };
  const indulgenceStrainIndex = computeIndulgenceStrainIndex(withFortitude);
  const withIndulgenceStrain: GuardianCoPilotMonitorSnapshot = { ...withFortitude, indulgenceStrainIndex };
  const indulgenceIntegrityScore = computeIndulgenceIntegrityScore(withIndulgenceStrain);
  const withIndulgence: GuardianCoPilotMonitorSnapshot = { ...withIndulgenceStrain, indulgenceIntegrityScore };
  const withVigor: GuardianCoPilotMonitorSnapshot = {
    ...withIndulgence,
    governanceVigorScore: computeGovernanceVigorScore(withIndulgence),
    exemptionStrainIndex: 0,
    exemptionIntegrityScore: 100,
    governanceStaminaScore: 100,
  };
  const exemptionStrainIndex = computeExemptionStrainIndex(withVigor);
  const withExemptionStrain: GuardianCoPilotMonitorSnapshot = { ...withVigor, exemptionStrainIndex };
  const exemptionIntegrityScore = computeExemptionIntegrityScore(withExemptionStrain);
  const withExemption: GuardianCoPilotMonitorSnapshot = { ...withExemptionStrain, exemptionIntegrityScore };
  const withStamina: GuardianCoPilotMonitorSnapshot = {
    ...withExemption,
    governanceStaminaScore: computeGovernanceStaminaScore(withExemption),
    remissionStrainIndex: 0,
    remissionIntegrityScore: 100,
    governanceMettleScore: 100,
  };
  const remissionStrainIndex = computeRemissionStrainIndex(withStamina);
  const withRemissionStrain: GuardianCoPilotMonitorSnapshot = { ...withStamina, remissionStrainIndex };
  const remissionIntegrityScore = computeRemissionIntegrityScore(withRemissionStrain);
  const withRemission: GuardianCoPilotMonitorSnapshot = { ...withRemissionStrain, remissionIntegrityScore };
  const withMettle: GuardianCoPilotMonitorSnapshot = {
    ...withRemission,
    governanceMettleScore: computeGovernanceMettleScore(withRemission),
    absolutionStrainIndex: 0,
    absolutionIntegrityScore: 100,
    governanceGritScore: 100,
  };
  const absolutionStrainIndex = computeAbsolutionStrainIndex(withMettle);
  const withAbsolutionStrain: GuardianCoPilotMonitorSnapshot = { ...withMettle, absolutionStrainIndex };
  const absolutionIntegrityScore = computeAbsolutionIntegrityScore(withAbsolutionStrain);
  const withAbsolution: GuardianCoPilotMonitorSnapshot = { ...withAbsolutionStrain, absolutionIntegrityScore };
  const withGrit: GuardianCoPilotMonitorSnapshot = {
    ...withAbsolution,
    governanceGritScore: computeGovernanceGritScore(withAbsolution),
    amnestyStrainIndex: 0,
    amnestyIntegrityScore: 100,
    governanceResolveScore: 100,
  };
  const amnestyStrainIndex = computeAmnestyStrainIndex(withGrit);
  const withAmnestyStrain: GuardianCoPilotMonitorSnapshot = { ...withGrit, amnestyStrainIndex };
  const amnestyIntegrityScore = computeAmnestyIntegrityScore(withAmnestyStrain);
  const withAmnesty: GuardianCoPilotMonitorSnapshot = { ...withAmnestyStrain, amnestyIntegrityScore };
  const withResolve: GuardianCoPilotMonitorSnapshot = {
    ...withAmnesty,
    governanceResolveScore: computeGovernanceResolveScore(withAmnesty),
    pardonStrainIndex: 0,
    pardonIntegrityScore: 100,
    governanceZealScore: 100,
  };
  const pardonStrainIndex = computePardonStrainIndex(withResolve);
  const withPardonStrain: GuardianCoPilotMonitorSnapshot = { ...withResolve, pardonStrainIndex };
  const pardonIntegrityScore = computePardonIntegrityScore(withPardonStrain);
  const withPardon: GuardianCoPilotMonitorSnapshot = { ...withPardonStrain, pardonIntegrityScore };
  const withZeal: GuardianCoPilotMonitorSnapshot = {
    ...withPardon,
    governanceZealScore: computeGovernanceZealScore(withPardon),
    clemencyStrainIndex: 0,
    clemencyIntegrityScore: 100,
    governancePluckScore: 100,
  };
  const clemencyStrainIndex = computeClemencyStrainIndex(withZeal);
  const withClemencyStrain: GuardianCoPilotMonitorSnapshot = { ...withZeal, clemencyStrainIndex };
  const clemencyIntegrityScore = computeClemencyIntegrityScore(withClemencyStrain);
  const withClemency: GuardianCoPilotMonitorSnapshot = { ...withClemencyStrain, clemencyIntegrityScore };
  const withPluck: GuardianCoPilotMonitorSnapshot = {
    ...withClemency,
    governancePluckScore: computeGovernancePluckScore(withClemency),
    reprieveStrainIndex: 0,
    reprieveIntegrityScore: 100,
    governanceNerveScore: 100,
  };
  const reprieveStrainIndex = computeReprieveStrainIndex(withPluck);
  const withReprieveStrain: GuardianCoPilotMonitorSnapshot = { ...withPluck, reprieveStrainIndex };
  const reprieveIntegrityScore = computeReprieveIntegrityScore(withReprieveStrain);
  const withReprieve: GuardianCoPilotMonitorSnapshot = { ...withReprieveStrain, reprieveIntegrityScore };
  const withNerve: GuardianCoPilotMonitorSnapshot = {
    ...withReprieve,
    governanceNerveScore: computeGovernanceNerveScore(withReprieve),
    acquittalStrainIndex: 0,
    acquittalIntegrityScore: 100,
    governanceMoxieScore: 100,
  };
  const acquittalStrainIndex = computeAcquittalStrainIndex(withNerve);
  const withAcquittalStrain: GuardianCoPilotMonitorSnapshot = { ...withNerve, acquittalStrainIndex };
  const acquittalIntegrityScore = computeAcquittalIntegrityScore(withAcquittalStrain);
  const withAcquittal: GuardianCoPilotMonitorSnapshot = { ...withAcquittalStrain, acquittalIntegrityScore };
  const withMoxie: GuardianCoPilotMonitorSnapshot = {
    ...withAcquittal,
    governanceMoxieScore: computeGovernanceMoxieScore(withAcquittal),
    exonerationStrainIndex: 0,
    exonerationIntegrityScore: 100,
    governanceSpunkScore: 100,
  };
  const exonerationStrainIndex = computeExonerationStrainIndex(withMoxie);
  const withExonerationStrain: GuardianCoPilotMonitorSnapshot = { ...withMoxie, exonerationStrainIndex };
  const exonerationIntegrityScore = computeExonerationIntegrityScore(withExonerationStrain);
  const withExoneration: GuardianCoPilotMonitorSnapshot = { ...withExonerationStrain, exonerationIntegrityScore };
  const withSpunk: GuardianCoPilotMonitorSnapshot = {
    ...withExoneration,
    governanceSpunkScore: computeGovernanceSpunkScore(withExoneration),
    vindicationStrainIndex: 0,
    vindicationIntegrityScore: 100,
    governanceDashScore: 100,
  };
  const vindicationStrainIndex = computeVindicationStrainIndex(withSpunk);
  const withVindicationStrain: GuardianCoPilotMonitorSnapshot = { ...withSpunk, vindicationStrainIndex };
  const vindicationIntegrityScore = computeVindicationIntegrityScore(withVindicationStrain);
  const withVindication: GuardianCoPilotMonitorSnapshot = { ...withVindicationStrain, vindicationIntegrityScore };
  const withDash: GuardianCoPilotMonitorSnapshot = {
    ...withVindication,
    governanceDashScore: computeGovernanceDashScore(withVindication),
    justificationStrainIndex: 0,
    justificationIntegrityScore: 100,
    governanceBrioScore: 100,
  };
  const justificationStrainIndex = computeJustificationStrainIndex(withDash);
  const withJustificationStrain: GuardianCoPilotMonitorSnapshot = { ...withDash, justificationStrainIndex };
  const justificationIntegrityScore = computeJustificationIntegrityScore(withJustificationStrain);
  const withJustification: GuardianCoPilotMonitorSnapshot = { ...withJustificationStrain, justificationIntegrityScore };
  return {
    ...withJustification,
    governanceBrioScore: computeGovernanceBrioScore(withJustification),
  };
}

export function runGuardianDepthUnitSelfTests(): Array<{ id: string; passed: boolean; detail: string }> {
  const out: Array<{ id: string; passed: boolean; detail: string }> = [];
  const ok = (id: string, fn: () => boolean) => {
    try {
      const passed = fn();
      out.push({ id, passed, detail: passed ? 'ok' : 'failed' });
    } catch (e) {
      out.push({ id, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };
  ok('gd_blocks_critical', () =>
    guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'critical', confirmationRequired: false }, 'major_mistakes')
  );
  ok('gd_max_confirm', () =>
    guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'caution', confirmationRequired: true }, 'maximum_protection')
  );
  ok('gd_clear', () =>
    !guardianBlocksAutomation({ allowedToProceed: true, highestSeverity: 'none', confirmationRequired: false }, 'major_mistakes')
  );
  ok('gd_risk_score_band', () => {
    const snap = {
      guardianEnabled: true,
      cash: 10,
      minCashReserve: 500,
      debt: 0,
      maxSpendPerAction: 2500,
      guardianAutomationLikelyBlocked: true,
      guardianRequiresConfirmation: true,
      copilotAutonomousActive: true,
      takeoverSessionActive: false,
      takeoverSessionAgeTurns: 0,
      blockedContinueCount: 0,
      objectiveBehindSchedule: true,
      rivalVictoryProgressPct: 70,
      victoryThresholdPct: 80,
    } as GuardianCoPilotMonitorSnapshot;
    const score = computeGuardianRiskScore(snap);
    return score >= 70 && classifyGuardianRiskBand(score) === 'critical';
  });
  ok('gd_objective_behind', () => {
    const snap = {
      objectiveActive: true,
      objectiveProgressPct: 20,
      objectiveTurnsRemaining: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeObjectiveBehindSchedule(snap);
  });
  ok('gd_liquidity_stress', () => {
    const snap = {
      cash: 50,
      minCashReserve: 500,
      debt: 800,
      maxSpendPerAction: 2000,
      copilotSpendingHeadroom: 0,
    } as GuardianCoPilotMonitorSnapshot;
    return computeLiquidityStressIndex(snap) >= 60;
  });
  ok('gd_trust_gap', () => {
    const snap = {
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianEnabled: true,
      guardianAutomationLikelyBlocked: true,
      copilotHoldsControl: false,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCopilotTrustGapScore(snap) >= 50;
  });
  ok('gd_composite_pressure', () => {
    const snap = {
      liquidityStressIndex: 70,
      guardianRiskScore: 65,
      copilotTrustGapScore: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCompositePressureIndex(snap) >= 60;
  });
  ok('gd_automation_readiness', () => {
    const snap = {
      copilotEnabled: true,
      guardianEnabled: true,
      guardianAutomationLikelyBlocked: true,
      copilotTrustGapScore: 60,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: false,
      blockedContinueCount: 2,
      liquidityStressIndex: 55,
      compositePressureIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAutomationReadinessScore(snap) < 40;
  });
  ok('gd_action_burn', () => {
    const snap = {
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      maxSpendPerAction: 5000,
      cash: 400,
      objectiveBehindSchedule: true,
      objectiveActive: true,
      copilotSpendingHeadroom: 0,
    } as GuardianCoPilotMonitorSnapshot;
    return computeActionBurnPressure(snap) >= 50;
  });
  ok('gd_advisory_saturation', () => {
    const snap = {
      compositePressureIndex: 68,
      automationReadinessScore: 30,
      actionBurnPressure: 55,
      guardianRiskBand: 'critical' as const,
      liquidityStressIndex: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAdvisorySaturationIndex(snap) >= 70;
  });
  ok('gd_escalation_latch', () => {
    const snap = {
      guardianConfirmationLikelyRequired: true,
      guardianAutomationLikelyBlocked: true,
      takeoverSessionActive: true,
      automationReadinessScore: 30,
      blockedContinueCount: 2,
      compositePressureIndex: 65,
      advisorySaturationIndex: 60,
      guardianRiskBand: 'critical' as const,
      copilotHoldsControl: false,
      governanceCoherenceScore: 30,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEscalationLatchScore(snap) >= 65;
  });
  ok('gd_governance_coherence', () => {
    const snap = {
      copilotTrustGapScore: 70,
      guardianEnabled: false,
      copilotEnabled: true,
      guardianProtectionMaximum: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      copilotAuthorityMode: 'autonomous',
      guardianAutomationLikelyBlocked: true,
      compositePressureIndex: 60,
      advisorySaturationIndex: 65,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceCoherenceScore(snap) < 35;
  });
  ok('gd_containment_burden', () => {
    const snap = {
      advisorySaturationIndex: 72,
      escalationLatchScore: 68,
      governanceCoherenceScore: 30,
      compositePressureIndex: 62,
      guardianRiskBand: 'critical' as const,
      takeoverSessionActive: true,
    } as GuardianCoPilotMonitorSnapshot;
    return computeContainmentBurdenIndex(snap) >= 70;
  });
  ok('gd_human_relay', () => {
    const snap = {
      guardianConfirmationLikelyRequired: true,
      takeoverSessionActive: true,
      copilotHoldsControl: true,
      automationReadinessScore: 30,
      blockedContinueCount: 2,
      escalationLatchScore: 55,
      containmentBurdenIndex: 60,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeHumanRelayPressure(snap) >= 65;
  });
  ok('gd_recovery_headroom', () => {
    const snap = {
      containmentBurdenIndex: 75,
      humanRelayPressure: 70,
      liquidityStressIndex: 60,
      automationReadinessScore: 25,
      governanceCoherenceScore: 30,
      actionBurnPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRecoveryHeadroomScore(snap) < 35;
  });
  ok('gd_advisory_depletion', () => {
    const snap = {
      recoveryHeadroomScore: 30,
      containmentBurdenIndex: 72,
      humanRelayPressure: 55,
      advisorySaturationIndex: 60,
      guardianReplayCount: 3,
      blockedContinueCount: 2,
      actionBurnPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAdvisoryDepletionIndex(snap) >= 70;
  });
  ok('gd_operator_bandwidth', () => {
    const snap = {
      humanRelayPressure: 70,
      advisoryDepletionIndex: 65,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: true,
      automationReadinessScore: 30,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOperatorBandwidthScore(snap) < 40;
  });
  ok('gd_continuity_margin', () => {
    const snap = {
      advisoryDepletionIndex: 70,
      operatorBandwidthScore: 35,
      recoveryHeadroomScore: 30,
      governanceCoherenceScore: 35,
      liquidityStressIndex: 60,
    } as GuardianCoPilotMonitorSnapshot;
    return computeContinuityMarginScore(snap) < 35;
  });
  ok('gd_stewardship_load', () => {
    const snap = {
      continuityMarginScore: 30,
      advisoryDepletionIndex: 68,
      operatorBandwidthScore: 38,
      governanceCoherenceScore: 35,
      takeoverSessionActive: true,
      teamPlanPending: true,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeStewardshipLoadIndex(snap) >= 70;
  });
  ok('gd_oversight_commitment', () => {
    const snap = {
      stewardshipLoadIndex: 72,
      continuityMarginScore: 32,
      guardianEnabled: false,
      copilotEnabled: true,
      guardianConfirmationLikelyRequired: true,
      copilotAutonomousActive: true,
      humanRelayPressure: 55,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOversightCommitmentScore(snap) < 40;
  });
  ok('gd_sustainability_margin', () => {
    const snap = {
      stewardshipLoadIndex: 78,
      oversightCommitmentScore: 32,
      recoveryHeadroomScore: 28,
      liquidityStressIndex: 62,
      continuityMarginScore: 28,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSustainabilityMarginScore(snap) < 35;
  });
  ok('gd_accountability_load', () => {
    const snap = {
      sustainabilityMarginScore: 30,
      oversightCommitmentScore: 32,
      stewardshipLoadIndex: 72,
      copilotTrustGapScore: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccountabilityLoadIndex(snap) >= 70;
  });
  ok('gd_delegation_fidelity', () => {
    const snap = {
      accountabilityLoadIndex: 72,
      copilotTrustGapScore: 65,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianConfirmationLikelyRequired: true,
      copilotHoldsControl: true,
      oversightCommitmentScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDelegationFidelityScore(snap) < 40;
  });
  ok('gd_governance_endurance', () => {
    const snap = {
      accountabilityLoadIndex: 78,
      delegationFidelityScore: 32,
      recoveryHeadroomScore: 28,
      continuityMarginScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceEnduranceScore(snap) < 35;
  });
  ok('gd_fiduciary_burden', () => {
    const snap = {
      governanceEnduranceScore: 30,
      delegationFidelityScore: 32,
      accountabilityLoadIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      escalationLatchScore: 60,
    } as GuardianCoPilotMonitorSnapshot;
    return computeFiduciaryBurdenIndex(snap) >= 70;
  });
  ok('gd_trust_assurance', () => {
    const snap = {
      fiduciaryBurdenIndex: 72,
      delegationFidelityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      copilotHoldsControl: true,
      governanceEnduranceScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeTrustAssuranceScore(snap) < 40;
  });
  ok('gd_governance_durability', () => {
    const snap = {
      fiduciaryBurdenIndex: 78,
      trustAssuranceScore: 32,
      recoveryHeadroomScore: 28,
      sustainabilityMarginScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceDurabilityScore(snap) < 35;
  });
  ok('gd_covenant_strain', () => {
    const snap = {
      governanceDurabilityScore: 30,
      trustAssuranceScore: 32,
      fiduciaryBurdenIndex: 72,
      compositePressureIndex: 62,
      takeoverSessionActive: true,
      teamPlanPending: true,
      governanceCoherenceScore: 35,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCovenantStrainIndex(snap) >= 70;
  });
  ok('gd_mandate_integrity', () => {
    const snap = {
      covenantStrainIndex: 72,
      trustAssuranceScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      governanceDurabilityScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeMandateIntegrityScore(snap) < 40;
  });
  ok('gd_governance_tenacity', () => {
    const snap = {
      covenantStrainIndex: 78,
      mandateIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceEnduranceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceTenacityScore(snap) < 35;
  });
  ok('gd_charter_strain', () => {
    const snap = {
      governanceTenacityScore: 30,
      mandateIntegrityScore: 32,
      covenantStrainIndex: 72,
      actionBurnPressure: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      advisoryDepletionIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCharterStrainIndex(snap) >= 70;
  });
  ok('gd_authority_integrity', () => {
    const snap = {
      charterStrainIndex: 72,
      mandateIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
      guardianProtectionMaximum: true,
      governanceTenacityScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorityIntegrityScore(snap) < 40;
  });
  ok('gd_governance_persistence', () => {
    const snap = {
      charterStrainIndex: 78,
      authorityIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceDurabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernancePersistenceScore(snap) < 35;
  });
  ok('gd_legitimacy_strain', () => {
    const snap = {
      governancePersistenceScore: 30,
      authorityIntegrityScore: 32,
      charterStrainIndex: 72,
      escalationLatchScore: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      containmentBurdenIndex: 58,
    } as GuardianCoPilotMonitorSnapshot;
    return computeLegitimacyStrainIndex(snap) >= 70;
  });
  ok('gd_oversight_integrity', () => {
    const snap = {
      legitimacyStrainIndex: 72,
      authorityIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      oversightCommitmentScore: 32,
      governancePersistenceScore: 32,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeOversightIntegrityScore(snap) < 40;
  });
  ok('gd_governance_continuity', () => {
    const snap = {
      legitimacyStrainIndex: 78,
      oversightIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceTenacityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceContinuityScore(snap) < 35;
  });
  ok('gd_compliance_strain', () => {
    const snap = {
      governanceContinuityScore: 30,
      oversightIntegrityScore: 32,
      legitimacyStrainIndex: 72,
      governanceCoherenceScore: 35,
      takeoverSessionActive: true,
      teamPlanPending: true,
      humanRelayPressure: 55,
    } as GuardianCoPilotMonitorSnapshot;
    return computeComplianceStrainIndex(snap) >= 70;
  });
  ok('gd_policy_integrity', () => {
    const snap = {
      complianceStrainIndex: 72,
      oversightIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      governanceContinuityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computePolicyIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resilience', () => {
    const snap = {
      complianceStrainIndex: 78,
      policyIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governancePersistenceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResilienceScore(snap) < 35;
  });
  ok('gd_audit_strain', () => {
    const snap = {
      governanceResilienceScore: 30,
      policyIntegrityScore: 32,
      complianceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuditStrainIndex(snap) >= 70;
  });
  ok('gd_control_integrity', () => {
    const snap = {
      auditStrainIndex: 72,
      policyIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceResilienceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeControlIntegrityScore(snap) < 40;
  });
  ok('gd_governance_stability', () => {
    const snap = {
      auditStrainIndex: 78,
      controlIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceContinuityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceStabilityScore(snap) < 35;
  });
  ok('gd_assurance_strain', () => {
    const snap = {
      governanceStabilityScore: 30,
      controlIntegrityScore: 32,
      auditStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAssuranceStrainIndex(snap) >= 70;
  });
  ok('gd_evidence_integrity', () => {
    const snap = {
      assuranceStrainIndex: 72,
      controlIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceStabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEvidenceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_confidence', () => {
    const snap = {
      assuranceStrainIndex: 78,
      evidenceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceResilienceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceConfidenceScore(snap) < 35;
  });
  ok('gd_attestation_strain', () => {
    const snap = {
      governanceConfidenceScore: 30,
      evidenceIntegrityScore: 32,
      assuranceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAttestationStrainIndex(snap) >= 70;
  });
  ok('gd_attestation_integrity', () => {
    const snap = {
      attestationStrainIndex: 72,
      evidenceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceConfidenceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAttestationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_reliability', () => {
    const snap = {
      attestationStrainIndex: 78,
      attestationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceStabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceReliabilityScore(snap) < 35;
  });
  ok('gd_verification_strain', () => {
    const snap = {
      governanceReliabilityScore: 30,
      attestationIntegrityScore: 32,
      attestationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVerificationStrainIndex(snap) >= 70;
  });
  ok('gd_verification_integrity', () => {
    const snap = {
      verificationStrainIndex: 72,
      attestationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceReliabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVerificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_validity', () => {
    const snap = {
      verificationStrainIndex: 78,
      verificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceReliabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceValidityScore(snap) < 35;
  });
  ok('gd_validation_strain', () => {
    const snap = {
      governanceValidityScore: 30,
      verificationIntegrityScore: 32,
      verificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeValidationStrainIndex(snap) >= 70;
  });
  ok('gd_validation_integrity', () => {
    const snap = {
      validationStrainIndex: 72,
      verificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceValidityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeValidationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_soundness', () => {
    const snap = {
      validationStrainIndex: 78,
      validationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceValidityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceSoundnessScore(snap) < 35;
  });
  ok('gd_certification_strain', () => {
    const snap = {
      governanceSoundnessScore: 30,
      validationIntegrityScore: 32,
      validationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCertificationStrainIndex(snap) >= 70;
  });
  ok('gd_certification_integrity', () => {
    const snap = {
      certificationStrainIndex: 72,
      validationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceSoundnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeCertificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_authenticity', () => {
    const snap = {
      certificationStrainIndex: 78,
      certificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceSoundnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceAuthenticityScore(snap) < 35;
  });
  ok('gd_accreditation_strain', () => {
    const snap = {
      governanceAuthenticityScore: 30,
      certificationIntegrityScore: 32,
      certificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccreditationStrainIndex(snap) >= 70;
  });
  ok('gd_accreditation_integrity', () => {
    const snap = {
      accreditationStrainIndex: 72,
      certificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceAuthenticityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAccreditationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_credibility', () => {
    const snap = {
      accreditationStrainIndex: 78,
      accreditationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceAuthenticityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceCredibilityScore(snap) < 35;
  });
  ok('gd_endorsement_strain', () => {
    const snap = {
      governanceCredibilityScore: 30,
      accreditationIntegrityScore: 32,
      accreditationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEndorsementStrainIndex(snap) >= 70;
  });
  ok('gd_endorsement_integrity', () => {
    const snap = {
      endorsementStrainIndex: 72,
      accreditationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceCredibilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeEndorsementIntegrityScore(snap) < 40;
  });
  ok('gd_governance_trustworthiness', () => {
    const snap = {
      endorsementStrainIndex: 78,
      endorsementIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceCredibilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceTrustworthinessScore(snap) < 35;
  });
  ok('gd_ratification_strain', () => {
    const snap = {
      governanceTrustworthinessScore: 30,
      endorsementIntegrityScore: 32,
      endorsementStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRatificationStrainIndex(snap) >= 70;
  });
  ok('gd_ratification_integrity', () => {
    const snap = {
      ratificationStrainIndex: 72,
      endorsementIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceTrustworthinessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRatificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_dependability', () => {
    const snap = {
      ratificationStrainIndex: 78,
      ratificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceTrustworthinessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceDependabilityScore(snap) < 35;
  });
  ok('gd_authorization_strain', () => {
    const snap = {
      governanceDependabilityScore: 30,
      ratificationIntegrityScore: 32,
      ratificationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorizationStrainIndex(snap) >= 70;
  });
  ok('gd_authorization_integrity', () => {
    const snap = {
      authorizationStrainIndex: 72,
      ratificationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceDependabilityScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAuthorizationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_steadfastness', () => {
    const snap = {
      authorizationStrainIndex: 78,
      authorizationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceDependabilityScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceSteadfastnessScore(snap) < 35;
  });
  ok('gd_affirmation_strain', () => {
    const snap = {
      governanceSteadfastnessScore: 30,
      authorizationIntegrityScore: 32,
      authorizationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAffirmationStrainIndex(snap) >= 70;
  });
  ok('gd_affirmation_integrity', () => {
    const snap = {
      affirmationStrainIndex: 72,
      authorizationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceSteadfastnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAffirmationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resoluteness', () => {
    const snap = {
      affirmationStrainIndex: 78,
      affirmationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceSteadfastnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResolutenessScore(snap) < 35;
  });
  ok('gd_sanction_strain', () => {
    const snap = {
      governanceResolutenessScore: 30,
      affirmationIntegrityScore: 32,
      affirmationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSanctionStrainIndex(snap) >= 70;
  });
  ok('gd_sanction_integrity', () => {
    const snap = {
      sanctionStrainIndex: 72,
      affirmationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceResolutenessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeSanctionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_firmness', () => {
    const snap = {
      sanctionStrainIndex: 78,
      sanctionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceResolutenessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceFirmnessScore(snap) < 35;
  });
  ok('gd_warrant_strain', () => {
    const snap = {
      governanceFirmnessScore: 30,
      sanctionIntegrityScore: 32,
      sanctionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeWarrantStrainIndex(snap) >= 70;
  });
  ok('gd_warrant_integrity', () => {
    const snap = {
      warrantStrainIndex: 72,
      sanctionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceFirmnessScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeWarrantIntegrityScore(snap) < 40;
  });
  ok('gd_governance_constancy', () => {
    const snap = {
      warrantStrainIndex: 78,
      warrantIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceFirmnessScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceConstancyScore(snap) < 35;
  });
  ok('gd_clearance_strain', () => {
    const snap = {
      governanceConstancyScore: 30,
      warrantIntegrityScore: 32,
      warrantStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClearanceStrainIndex(snap) >= 70;
  });
  ok('gd_clearance_integrity', () => {
    const snap = {
      clearanceStrainIndex: 72,
      warrantIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceConstancyScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClearanceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_perseverance', () => {
    const snap = {
      clearanceStrainIndex: 78,
      clearanceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceConstancyScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernancePerseveranceScore(snap) < 35;
  });
  ok('gd_dispensation_strain', () => {
    const snap = {
      governancePerseveranceScore: 30,
      clearanceIntegrityScore: 32,
      clearanceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDispensationStrainIndex(snap) >= 70;
  });
  ok('gd_dispensation_integrity', () => {
    const snap = {
      dispensationStrainIndex: 72,
      clearanceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governancePerseveranceScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeDispensationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_fortitude', () => {
    const snap = {
      dispensationStrainIndex: 78,
      dispensationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governancePerseveranceScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceFortitudeScore(snap) < 35;
  });
  ok('gd_indulgence_strain', () => {
    const snap = {
      governanceFortitudeScore: 30,
      dispensationIntegrityScore: 32,
      dispensationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeIndulgenceStrainIndex(snap) >= 70;
  });
  ok('gd_indulgence_integrity', () => {
    const snap = {
      indulgenceStrainIndex: 72,
      dispensationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceFortitudeScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeIndulgenceIntegrityScore(snap) < 40;
  });
  ok('gd_governance_vigor', () => {
    const snap = {
      indulgenceStrainIndex: 78,
      indulgenceIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceFortitudeScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceVigorScore(snap) < 35;
  });
  ok('gd_exemption_strain', () => {
    const snap = {
      governanceVigorScore: 30,
      indulgenceIntegrityScore: 32,
      indulgenceStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExemptionStrainIndex(snap) >= 70;
  });
  ok('gd_exemption_integrity', () => {
    const snap = {
      exemptionStrainIndex: 72,
      indulgenceIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceVigorScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExemptionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_stamina', () => {
    const snap = {
      exemptionStrainIndex: 78,
      exemptionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceVigorScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceStaminaScore(snap) < 35;
  });
  ok('gd_remission_strain', () => {
    const snap = {
      governanceStaminaScore: 30,
      exemptionIntegrityScore: 32,
      exemptionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRemissionStrainIndex(snap) >= 70;
  });
  ok('gd_remission_integrity', () => {
    const snap = {
      remissionStrainIndex: 72,
      exemptionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceStaminaScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeRemissionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_mettle', () => {
    const snap = {
      remissionStrainIndex: 78,
      remissionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceStaminaScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceMettleScore(snap) < 35;
  });
  ok('gd_absolution_strain', () => {
    const snap = {
      governanceMettleScore: 30,
      remissionIntegrityScore: 32,
      remissionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAbsolutionStrainIndex(snap) >= 70;
  });
  ok('gd_absolution_integrity', () => {
    const snap = {
      absolutionStrainIndex: 72,
      remissionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceMettleScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAbsolutionIntegrityScore(snap) < 40;
  });
  ok('gd_governance_grit', () => {
    const snap = {
      absolutionStrainIndex: 78,
      absolutionIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceMettleScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceGritScore(snap) < 35;
  });
  ok('gd_amnesty_strain', () => {
    const snap = {
      governanceGritScore: 30,
      absolutionIntegrityScore: 32,
      absolutionStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAmnestyStrainIndex(snap) >= 70;
  });
  ok('gd_amnesty_integrity', () => {
    const snap = {
      amnestyStrainIndex: 72,
      absolutionIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceGritScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAmnestyIntegrityScore(snap) < 40;
  });
  ok('gd_governance_resolve', () => {
    const snap = {
      amnestyStrainIndex: 78,
      amnestyIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceGritScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceResolveScore(snap) < 35;
  });
  ok('gd_pardon_strain', () => {
    const snap = {
      governanceResolveScore: 30,
      amnestyIntegrityScore: 32,
      amnestyStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computePardonStrainIndex(snap) >= 70;
  });
  ok('gd_pardon_integrity', () => {
    const snap = {
      pardonStrainIndex: 72,
      amnestyIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceResolveScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computePardonIntegrityScore(snap) < 40;
  });
  ok('gd_governance_zeal', () => {
    const snap = {
      pardonStrainIndex: 78,
      pardonIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceResolveScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceZealScore(snap) < 35;
  });
  ok('gd_clemency_strain', () => {
    const snap = {
      governanceZealScore: 30,
      pardonIntegrityScore: 32,
      pardonStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClemencyStrainIndex(snap) >= 70;
  });
  ok('gd_clemency_integrity', () => {
    const snap = {
      clemencyStrainIndex: 72,
      pardonIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceZealScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeClemencyIntegrityScore(snap) < 40;
  });
  ok('gd_governance_pluck', () => {
    const snap = {
      clemencyStrainIndex: 78,
      clemencyIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceZealScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernancePluckScore(snap) < 35;
  });
  ok('gd_reprieve_strain', () => {
    const snap = {
      governancePluckScore: 30,
      clemencyIntegrityScore: 32,
      clemencyStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeReprieveStrainIndex(snap) >= 70;
  });
  ok('gd_reprieve_integrity', () => {
    const snap = {
      reprieveStrainIndex: 72,
      clemencyIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governancePluckScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeReprieveIntegrityScore(snap) < 40;
  });
  ok('gd_governance_nerve', () => {
    const snap = {
      reprieveStrainIndex: 78,
      reprieveIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governancePluckScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceNerveScore(snap) < 35;
  });
  ok('gd_acquittal_strain', () => {
    const snap = {
      governanceNerveScore: 30,
      reprieveIntegrityScore: 32,
      reprieveStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAcquittalStrainIndex(snap) >= 70;
  });
  ok('gd_acquittal_integrity', () => {
    const snap = {
      acquittalStrainIndex: 72,
      reprieveIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceNerveScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeAcquittalIntegrityScore(snap) < 40;
  });
  ok('gd_governance_moxie', () => {
    const snap = {
      acquittalStrainIndex: 78,
      acquittalIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceNerveScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceMoxieScore(snap) < 35;
  });
  ok('gd_exoneration_strain', () => {
    const snap = {
      governanceMoxieScore: 30,
      acquittalIntegrityScore: 32,
      acquittalStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExonerationStrainIndex(snap) >= 70;
  });
  ok('gd_exoneration_integrity', () => {
    const snap = {
      exonerationStrainIndex: 72,
      acquittalIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceMoxieScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeExonerationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_spunk', () => {
    const snap = {
      exonerationStrainIndex: 78,
      exonerationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceMoxieScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceSpunkScore(snap) < 35;
  });
  ok('gd_vindication_strain', () => {
    const snap = {
      governanceSpunkScore: 30,
      exonerationIntegrityScore: 32,
      exonerationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVindicationStrainIndex(snap) >= 70;
  });
  ok('gd_vindication_integrity', () => {
    const snap = {
      vindicationStrainIndex: 72,
      exonerationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceSpunkScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeVindicationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_dash', () => {
    const snap = {
      vindicationStrainIndex: 78,
      vindicationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceSpunkScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceDashScore(snap) < 35;
  });
  ok('gd_justification_strain', () => {
    const snap = {
      governanceDashScore: 30,
      vindicationIntegrityScore: 32,
      vindicationStrainIndex: 72,
      advisorySaturationIndex: 58,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    } as GuardianCoPilotMonitorSnapshot;
    return computeJustificationStrainIndex(snap) >= 70;
  });
  ok('gd_justification_integrity', () => {
    const snap = {
      justificationStrainIndex: 72,
      vindicationIntegrityScore: 38,
      guardianEnabled: false,
      copilotAutonomousActive: true,
      guardianAutomationLikelyBlocked: true,
      governanceDashScore: 32,
      blockedContinueCount: 2,
    } as GuardianCoPilotMonitorSnapshot;
    return computeJustificationIntegrityScore(snap) < 40;
  });
  ok('gd_governance_brio', () => {
    const snap = {
      justificationStrainIndex: 78,
      justificationIntegrityScore: 32,
      recoveryHeadroomScore: 28,
      governanceDashScore: 28,
      liquidityStressIndex: 62,
    } as GuardianCoPilotMonitorSnapshot;
    return computeGovernanceBrioScore(snap) < 35;
  });
  return out;
}


// --- source: monitor-rules-expansion.ts ---

const rivalNearVictoryThreshold = (s: GuardianCoPilotMonitorSnapshot): boolean => {
  if (s.rivalVictoryProgressPct === null) return false;
  return s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85;
};

export const ADVISORY_MONITOR_RULES_EXPANSION: AdvisoryMonitorRule[] = [
  {
    id: 'rival_near_victory',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Near Victory',
    detailTemplate: 'Rival victory progress is approaching the scenario threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: rivalNearVictoryThreshold,
    followUp: 'Prioritize blocking rival primary objectives or accelerating yours.',
    deepLink: { tab: 'strategy', section: 'victory' },
  },
  {
    id: 'objective_deadline_imminent',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Objective Deadline Imminent',
    detailTemplate: 'Primary objective deadline within 2 turns',
    evidenceFields: ['objectiveTurnsRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 2 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 100),
  },
  {
    id: 'objective_stalled',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Objective Stalled',
    detailTemplate: 'Primary objective progress is behind schedule',
    evidenceFields: ['objectiveProgressPct', 'objectiveTurnsRemaining'],
    evaluate: s =>
      s.objectiveActive &&
      s.objectiveProgressPct !== null &&
      s.objectiveProgressPct < 35 &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 5,
  },
  {
    id: 'objective_travel_recommended',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Travel Toward Objective',
    detailTemplate: 'You have AP but are not in the objective region',
    evidenceFields: ['region', 'objectiveTargetRegion', 'apRemaining', 'playerInObjectiveRegion'],
    evaluate: s =>
      s.objectiveActive &&
      Boolean(s.objectiveTargetRegion) &&
      !s.playerInObjectiveRegion &&
      s.apRemaining > 0,
    followUp: 'Travel is a suggestion only — confirm in Co-Pilot or act manually.',
  },
  {
    id: 'objective_region_aligned',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'info',
    title: 'Objective Region Aligned',
    detailTemplate: 'Current region matches primary objective target',
    evidenceFields: ['region', 'objectiveTargetRegion', 'playerInObjectiveRegion'],
    evaluate: s => s.objectiveActive && s.playerInObjectiveRegion,
  },
  {
    id: 'objective_no_tracked_primary',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'No Tracked Primary Objective',
    detailTemplate: 'Scenario focus detected but no primary objective progress is tracked',
    evidenceFields: ['objectiveActive', 'objectiveProgressPct'],
    evaluate: s => !s.objectiveActive && s.objectiveRegion !== null,
  },
  {
    id: 'guardian_maximum_protection',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Guardian Maximum Protection',
    detailTemplate: 'Guardian is on maximum protection — more actions will require confirmation',
    evidenceFields: ['guardianEnabled', 'guardianProtectionMaximum', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianProtectionMaximum,
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'guardian_require_confirmation_mode',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Requires Confirmation',
    detailTemplate: 'Guardian response mode requires confirmation before risky actions',
    evidenceFields: ['guardianEnabled', 'guardianRequiresConfirmation', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianRequiresConfirmation,
  },
  {
    id: 'guardian_critical_only_mode',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Critical Only',
    detailTemplate: 'Guardian will warn on critical mistakes only',
    evidenceFields: ['guardianEnabled', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianProtectionLevel === 'critical_only',
  },
  {
    id: 'guardian_copilot_autonomy_mismatch',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Guardian And Co-Pilot Autonomy Mismatch',
    detailTemplate: 'Co-Pilot autonomous mode with strict Guardian confirmations may stall turns',
    evidenceFields: ['copilotAutonomousActive', 'guardianRequiresConfirmation', 'copilotAuthorityMode'],
    evaluate: s =>
      s.copilotAutonomousActive &&
      s.guardianRequiresConfirmation &&
      (s.copilotAuthorityMode === 'autonomous' || s.copilotAuthorityMode === 'rescue'),
    followUp: 'Review Guardian response mode or Co-Pilot authority — advisory only.',
  },
  {
    id: 'guardian_off_during_takeover',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian Off During Takeover',
    detailTemplate: 'Guardian is disabled while a Co-Pilot takeover session is active',
    evidenceFields: ['guardianEnabled', 'takeoverSessionActive'],
    evaluate: s => !s.guardianEnabled && s.takeoverSessionActive,
  },
];

export function countExpansionRulesByKind(): Record<AdvisoryOpsKind, number> {
  const out: Record<AdvisoryOpsKind, number> = { monitor: 0, advice: 0, alert: 0 };
  for (const r of ADVISORY_MONITOR_RULES_EXPANSION) out[r.kind] += 1;
  return out;
}


// --- source: monitor-rules-scale-wave.ts ---

const rivalMidband = (s: GuardianCoPilotMonitorSnapshot): boolean => {
  if (s.rivalVictoryProgressPct === null) return false;
  const lo = s.victoryThresholdPct * 0.65;
  const hi = s.victoryThresholdPct * 0.85;
  return s.rivalVictoryProgressPct >= lo && s.rivalVictoryProgressPct < hi;
};

export const ADVISORY_MONITOR_RULES_SCALE_WAVE: AdvisoryMonitorRule[] = [
  {
    id: 'debt_exceeds_cash',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Debt Exceeds Cash',
    detailTemplate: 'Outstanding debt is higher than liquid cash',
    evidenceFields: ['debt', 'cash'],
    evaluate: s => s.debt > s.cash,
  },
  {
    id: 'liquidity_double_pressure',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Liquidity Double Pressure',
    detailTemplate: 'Cash below reserve while debt service pressure is elevated',
    evidenceFields: ['cash', 'minCashReserve', 'debt'],
    evaluate: s => s.cash < s.minCashReserve && s.debt > s.cash * 0.5,
  },
  {
    id: 'spending_cap_exceeds_cash',
    category: 'liquidity',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Spending Cap Exceeds Cash',
    detailTemplate: 'Co-Pilot max spend per action exceeds cash on hand',
    evidenceFields: ['maxSpendPerAction', 'cash'],
    evaluate: s => s.cash > 0 && s.maxSpendPerAction > s.cash,
  },
  {
    id: 'guardian_automation_block_heuristic',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian May Block Automation',
    detailTemplate: 'Guardian posture suggests the next Co-Pilot automation may be blocked',
    evidenceFields: ['guardianAutomationLikelyBlocked', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianAutomationLikelyBlocked,
    followUp: 'Advisory heuristic only — enforcement remains evaluateGuardianRiskPipeline in canonical.',
  },
  {
    id: 'guardian_confirmation_likely',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Confirmation Likely',
    detailTemplate: 'Next risky action may require Guardian confirmation',
    evidenceFields: ['guardianConfirmationLikelyRequired', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianConfirmationLikelyRequired,
  },
  {
    id: 'guardian_notify_only_copilot_auto',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Notify Only With Co-Pilot Auto',
    detailTemplate: 'Guardian notify-only mode while Co-Pilot autonomous session is active',
    evidenceFields: ['guardianResponseMode', 'copilotAutonomousActive'],
    evaluate: s =>
      s.guardianEnabled && s.guardianResponseMode === 'notify_only' && s.copilotAutonomousActive,
  },
  {
    id: 'guardian_replay_guardian_disabled',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Replay Log Without Guardian',
    detailTemplate: 'Guardian replay events exist but Guardian is currently disabled',
    evidenceFields: ['guardianReplayCount', 'guardianEnabled'],
    evaluate: s => !s.guardianEnabled && s.guardianReplayCount > 0,
  },
  {
    id: 'copilot_rescue_critical_guardian',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Rescue Co-Pilot With Relaxed Guardian',
    detailTemplate: 'Co-Pilot rescue authority with Guardian critical-only protection',
    evidenceFields: ['copilotAuthorityMode', 'guardianProtectionLevel'],
    evaluate: s => s.copilotAuthorityMode === 'rescue' && s.guardianProtectionLevel === 'critical_only',
  },
  {
    id: 'rival_victory_midband',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Rival Victory Midband',
    detailTemplate: 'Rival victory progress is rising but not yet at critical threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: rivalMidband,
  },
  {
    id: 'objective_near_complete',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'info',
    title: 'Objective Near Complete',
    detailTemplate: 'Primary objective is above 90% progress',
    evidenceFields: ['objectiveProgressPct', 'objectiveActive'],
    evaluate: s =>
      s.objectiveActive && s.objectiveProgressPct !== null && s.objectiveProgressPct >= 90 && s.objectiveProgressPct < 100,
  },
  {
    id: 'objective_urgency_ap_remaining',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Objective Urgency With Ap Left',
    detailTemplate: 'Deadline pressure with limited AP and incomplete objective',
    evidenceFields: ['objectiveTurnsRemaining', 'apRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.apRemaining > 0 &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 2 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 80),
  },
  {
    id: 'team_plan_and_objective_deadline',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan And Objective Deadline',
    detailTemplate: 'Team plan pending while objective deadline is imminent',
    evidenceFields: ['teamPlanPending', 'objectiveTurnsRemaining'],
    evaluate: s =>
      s.teamPlanPending && s.objectiveTurnsRemaining !== null && s.objectiveTurnsRemaining <= 2,
  },
  {
    id: 'guardian_verdict_critical_path',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Critical Path',
    detailTemplate: 'Guardian heuristic reports critical severity on current posture',
    evidenceFields: ['guardianEnabled', 'guardianAutomationLikelyBlocked'],
    evaluate: s => {
      if (!s.guardianEnabled) return false;
      const v = inferGuardianVerdictFromSnapshot(s);
      return v.highestSeverity === 'critical' && guardianBlocksAutomation(v, s.guardianProtectionLevel);
    },
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE.length;


// --- source: monitor-rules-scale-wave-2.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_2: AdvisoryMonitorRule[] = [
  {
    id: 'guardian_risk_score_elevated',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Risk Score Elevated',
    detailTemplate: 'Composite Guardian risk score is in the elevated band',
    evidenceFields: ['guardianRiskScore', 'guardianRiskBand'],
    evaluate: s => s.guardianEnabled && s.guardianRiskBand === 'elevated',
  },
  {
    id: 'guardian_risk_score_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Risk Score Critical',
    detailTemplate: 'Composite Guardian risk score is critical — review before spending AP',
    evidenceFields: ['guardianRiskScore', 'guardianRiskBand'],
    evaluate: s => s.guardianEnabled && s.guardianRiskBand === 'critical',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'copilot_spending_headroom_zero',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Co-Pilot Spending Headroom Zero',
    detailTemplate: 'Cash is at or below the Co-Pilot reserve — discretionary spend blocked',
    evidenceFields: ['copilotSpendingHeadroom', 'cash', 'minCashReserve'],
    evaluate: s => s.copilotEnabled && s.copilotSpendingHeadroom <= 0,
  },
  {
    id: 'copilot_spending_headroom_tight',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Co-Pilot Spending Headroom Tight',
    detailTemplate: 'Less than one max-spend action of headroom above reserve',
    evidenceFields: ['copilotSpendingHeadroom', 'maxSpendPerAction'],
    evaluate: s => s.copilotEnabled && s.copilotSpendingHeadroom > 0 && s.copilotSpendingHeadroom < s.maxSpendPerAction,
  },
  {
    id: 'objective_behind_schedule',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Objective Behind Schedule',
    detailTemplate: 'Primary objective progress trails the deadline pace',
    evidenceFields: ['objectiveBehindSchedule', 'objectiveProgressPct', 'objectiveTurnsRemaining'],
    evaluate: s => s.objectiveActive && s.objectiveBehindSchedule,
  },
  {
    id: 'objective_ap_exhausted_active',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Objective Active Ap Exhausted',
    detailTemplate: 'Primary objective still open but no AP remains this turn',
    evidenceFields: ['objectiveActive', 'apRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.apRemaining <= 0 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 100),
  },
  {
    id: 'guardian_strict_copilot_disabled',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Strict Guardian Co-Pilot Off',
    detailTemplate: 'Guardian confirmations enabled while Co-Pilot master toggle is off',
    evidenceFields: ['guardianRequiresConfirmation', 'copilotEnabled'],
    evaluate: s => s.guardianEnabled && s.guardianRequiresConfirmation && !s.copilotEnabled,
  },
  {
    id: 'guardian_major_mistakes_autonomous',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Major Mistakes With Autonomous Co-Pilot',
    detailTemplate: 'Co-Pilot autonomous session under major-mistakes Guardian protection',
    evidenceFields: ['guardianProtectionLevel', 'copilotAutonomousActive'],
    evaluate: s =>
      s.guardianEnabled && s.guardianProtectionLevel === 'major_mistakes' && s.copilotAutonomousActive,
  },
  {
    id: 'contract_expiring_wrong_region',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contract Expiring Wrong Region',
    detailTemplate: 'Contract expiring soon while you are not in the objective region',
    evidenceFields: ['expiringContractCount', 'playerInObjectiveRegion', 'objectiveTargetRegion'],
    evaluate: s =>
      s.expiringContractCount > 0 && s.objectiveActive && Boolean(s.objectiveTargetRegion) && !s.playerInObjectiveRegion,
  },
  {
    id: 'takeover_stale_guardian_replay',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Takeover Stale With Replay Log',
    detailTemplate: 'Long takeover session with Guardian replay history — verify posture',
    evidenceFields: ['takeoverSessionActive', 'takeoverSessionAgeTurns', 'guardianReplayCount'],
    evaluate: s => s.takeoverSessionActive && s.takeoverSessionAgeTurns >= 3 && s.guardianReplayCount > 5,
  },
  {
    id: 'rival_victory_watch_band',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Rival Victory Watch Band',
    detailTemplate: 'Rival victory progress crossed 75% of threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: (s: GuardianCoPilotMonitorSnapshot) => {
      if (s.rivalVictoryProgressPct === null) return false;
      const watch = s.victoryThresholdPct * 0.75;
      const critical = s.victoryThresholdPct * 0.85;
      return s.rivalVictoryProgressPct >= watch && s.rivalVictoryProgressPct < critical;
    },
  },
  {
    id: 'team_plan_objective_behind',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan While Objective Behind',
    detailTemplate: 'Team plan pending approval while objective is behind schedule',
    evidenceFields: ['teamPlanPending', 'objectiveBehindSchedule'],
    evaluate: s => s.teamPlanPending && s.objectiveBehindSchedule,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_2_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_2.length;


// --- source: monitor-rules-scale-wave-3.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_3: AdvisoryMonitorRule[] = [
  {
    id: 'liquidity_stress_high',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Liquidity Stress High',
    detailTemplate: 'Composite liquidity stress index is in the high band',
    evidenceFields: ['liquidityStressIndex', 'cash', 'debt'],
    evaluate: s => s.liquidityStressIndex >= 60,
  },
  {
    id: 'liquidity_stress_elevated',
    category: 'liquidity',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Liquidity Stress Elevated',
    detailTemplate: 'Liquidity stress index is elevated — watch discretionary spend',
    evidenceFields: ['liquidityStressIndex', 'copilotSpendingHeadroom'],
    evaluate: s => s.liquidityStressIndex >= 40 && s.liquidityStressIndex < 60,
  },
  {
    id: 'copilot_trust_gap_wide',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Co-Pilot Trust Gap Wide',
    detailTemplate: 'Co-Pilot automation and Guardian protection levels are misaligned',
    evidenceFields: ['copilotTrustGapScore', 'copilotAuthorityMode', 'guardianProtectionLevel'],
    evaluate: s => s.copilotTrustGapScore >= 50,
    followUp: 'Advisory only — adjust authority or Guardian response mode manually.',
  },
  {
    id: 'objective_pace_steep',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Objective Pace Steep',
    detailTemplate: 'Required objective pace per turn exceeds 30%',
    evidenceFields: ['objectivePacePct', 'objectiveTurnsRemaining', 'objectiveProgressPct'],
    evaluate: s => s.objectivePacePct !== null && s.objectivePacePct > 30,
  },
  {
    id: 'rival_and_objective_pressure',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival And Objective Pressure',
    detailTemplate: 'Rival victory watch band while primary objective is behind schedule',
    evidenceFields: ['rivalVictoryProgressPct', 'objectiveBehindSchedule', 'victoryThresholdPct'],
    evaluate: s => {
      if (s.rivalVictoryProgressPct === null) return false;
      const watch = s.victoryThresholdPct * 0.75;
      return s.rivalVictoryProgressPct >= watch && s.objectiveBehindSchedule;
    },
  },
  {
    id: 'guardian_elevated_takeover_active',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Elevated Risk During Takeover',
    detailTemplate: 'Guardian risk band elevated or critical during an active takeover session',
    evidenceFields: ['guardianRiskBand', 'takeoverSessionActive', 'guardianRiskScore'],
    evaluate: s =>
      s.takeoverSessionActive && s.guardianEnabled && (s.guardianRiskBand === 'elevated' || s.guardianRiskBand === 'critical'),
  },
  {
    id: 'copilot_blocked_elevated_risk',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Blocked Continues With Elevated Risk',
    detailTemplate: 'Co-Pilot blocked continues with elevated Guardian risk score',
    evidenceFields: ['blockedContinueCount', 'guardianRiskScore'],
    evaluate: s => s.blockedContinueCount >= 1 && s.guardianRiskScore >= 40,
  },
  {
    id: 'contracts_and_liquidity_stress',
    category: 'contracts',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Contracts Under Liquidity Stress',
    detailTemplate: 'Expiring contracts while liquidity stress is elevated',
    evidenceFields: ['expiringContractCount', 'liquidityStressIndex'],
    evaluate: s => s.expiringContractCount > 0 && s.liquidityStressIndex >= 40,
  },
  {
    id: 'guardian_adaptive_response_mode',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Adaptive Response',
    detailTemplate: 'Guardian adaptive response mode is active',
    evidenceFields: ['guardianResponseMode', 'guardianEnabled'],
    evaluate: s => s.guardianEnabled && s.guardianResponseMode === 'adaptive',
  },
  {
    id: 'ap_bank_critical_guardian',
    category: 'actions',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Ap Bank With Critical Guardian Risk',
    detailTemplate: 'AP remain but Guardian risk is critical — spend deliberately',
    evidenceFields: ['apRemaining', 'guardianRiskBand'],
    evaluate: s => s.apRemaining >= 2 && s.guardianRiskBand === 'critical',
  },
  {
    id: 'headroom_expiring_contracts',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Tight Headroom Expiring Contracts',
    detailTemplate: 'Low spending headroom with contracts expiring soon',
    evidenceFields: ['copilotSpendingHeadroom', 'expiringContractCount', 'maxSpendPerAction'],
    evaluate: s =>
      s.expiringContractCount > 0 && s.copilotSpendingHeadroom > 0 && s.copilotSpendingHeadroom < s.maxSpendPerAction,
  },
  {
    id: 'guardian_replay_elevated_risk',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Replay Log With Elevated Risk',
    detailTemplate: 'Guardian replay history present while risk band is elevated',
    evidenceFields: ['guardianReplayCount', 'guardianRiskBand'],
    evaluate: s => s.guardianReplayCount > 10 && s.guardianRiskBand === 'elevated',
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_3_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_3.length;


// --- source: monitor-rules-scale-wave-4.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_4: AdvisoryMonitorRule[] = [
  {
    id: 'composite_pressure_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Composite Advisory Pressure Critical',
    detailTemplate: 'Liquidity, Guardian risk, and trust-gap signals combine in the critical pressure band',
    evidenceFields: ['compositePressureIndex', 'guardianRiskScore', 'liquidityStressIndex'],
    evaluate: s => s.compositePressureIndex >= 70,
  },
  {
    id: 'composite_pressure_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Composite Advisory Pressure Elevated',
    detailTemplate: 'Multiple advisory subsystems report elevated composite pressure',
    evidenceFields: ['compositePressureIndex', 'copilotTrustGapScore'],
    evaluate: s => s.compositePressureIndex >= 45 && s.compositePressureIndex < 70,
  },
  {
    id: 'automation_readiness_low',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Automation Readiness Low',
    detailTemplate: 'Co-Pilot automation readiness score is in the low band',
    evidenceFields: ['automationReadinessScore', 'copilotAuthorityMode', 'guardianProtectionLevel'],
    evaluate: s => s.copilotEnabled && s.automationReadinessScore < 35,
    followUp: 'Advisory only — tighten Guardian posture or reduce Co-Pilot autonomy manually.',
  },
  {
    id: 'automation_readiness_moderate_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Moderate Readiness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot session with only moderate automation readiness',
    evidenceFields: ['automationReadinessScore', 'copilotAutonomousActive'],
    evaluate: s => s.copilotAutonomousActive && s.automationReadinessScore >= 35 && s.automationReadinessScore < 55,
  },
  {
    id: 'action_burn_pressure_high',
    category: 'actions',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Action Burn Pressure High',
    detailTemplate: 'Remaining AP and spend posture indicate high action burn pressure',
    evidenceFields: ['actionBurnPressure', 'apRemaining', 'maxSpendPerAction'],
    evaluate: s => s.actionBurnPressure >= 60,
  },
  {
    id: 'ap_bank_composite_pressure',
    category: 'actions',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Banked AP Under Composite Pressure',
    detailTemplate: 'Multiple AP remain but composite advisory pressure is elevated',
    evidenceFields: ['apRemaining', 'compositePressureIndex'],
    evaluate: s => s.apRemaining >= 2 && s.compositePressureIndex >= 50,
  },
  {
    id: 'team_plan_composite_pressure',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan Under Composite Pressure',
    detailTemplate: 'Pending team plan while composite advisory pressure is elevated',
    evidenceFields: ['teamPlanPending', 'compositePressureIndex'],
    evaluate: s => s.teamPlanPending && s.compositePressureIndex >= 45,
  },
  {
    id: 'takeover_low_automation_readiness',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Takeover With Low Automation Readiness',
    detailTemplate: 'Active takeover session while automation readiness is low',
    evidenceFields: ['takeoverSessionActive', 'automationReadinessScore', 'copilotHoldsControl'],
    evaluate: s => s.takeoverSessionActive && s.automationReadinessScore < 40,
  },
  {
    id: 'objective_composite_pressure',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Objective Under Composite Pressure',
    detailTemplate: 'Primary objective behind schedule with elevated composite pressure',
    evidenceFields: ['objectiveActive', 'objectiveBehindSchedule', 'compositePressureIndex'],
    evaluate: s => s.objectiveActive && s.objectiveBehindSchedule && s.compositePressureIndex >= 55,
  },
  {
    id: 'guardian_interlock_critical_liquidity',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Interlock Critical Liquidity',
    detailTemplate: 'Critical Guardian risk band with elevated liquidity stress',
    evidenceFields: ['guardianRiskBand', 'liquidityStressIndex', 'compositePressureIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.liquidityStressIndex >= 50,
  },
  {
    id: 'copilot_auto_low_readiness',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Co-Pilot Low Readiness',
    detailTemplate: 'Autonomous Co-Pilot active while automation readiness remains low',
    evidenceFields: ['copilotAutonomousActive', 'automationReadinessScore', 'guardianAutomationLikelyBlocked'],
    evaluate: s => s.copilotAutonomousActive && s.automationReadinessScore < 45,
  },
  {
    id: 'contracts_composite_pressure',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Expiring Contracts Under Composite Pressure',
    detailTemplate: 'Contracts expiring soon while composite advisory pressure is elevated',
    evidenceFields: ['expiringContractCount', 'compositePressureIndex', 'copilotSpendingHeadroom'],
    evaluate: s => s.expiringContractCount > 0 && s.compositePressureIndex >= 50,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_4_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_4.length;


// --- source: monitor-rules-scale-wave-5.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_5: AdvisoryMonitorRule[] = [
  {
    id: 'advisory_saturation_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Advisory Saturation High',
    detailTemplate: 'Multiple advisory subsystems report saturation in the high band',
    evidenceFields: ['advisorySaturationIndex', 'compositePressureIndex', 'guardianRiskBand'],
    evaluate: s => s.advisorySaturationIndex >= 70,
  },
  {
    id: 'advisory_saturation_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Advisory Saturation Elevated',
    detailTemplate: 'Advisory saturation index is elevated — expect overlapping warnings',
    evidenceFields: ['advisorySaturationIndex', 'actionBurnPressure'],
    evaluate: s => s.advisorySaturationIndex >= 45 && s.advisorySaturationIndex < 70,
  },
  {
    id: 'escalation_latch_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Escalation Latch Critical',
    detailTemplate: 'Human escalation likely before risky Co-Pilot or spend actions',
    evidenceFields: ['escalationLatchScore', 'guardianConfirmationLikelyRequired', 'copilotHoldsControl'],
    evaluate: s => s.escalationLatchScore >= 65,
  },
  {
    id: 'escalation_latch_elevated',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Escalation Latch Elevated',
    detailTemplate: 'Escalation latch score is elevated — confirm authority before automation',
    evidenceFields: ['escalationLatchScore', 'automationReadinessScore'],
    evaluate: s => s.escalationLatchScore >= 40 && s.escalationLatchScore < 65,
    followUp: 'Advisory only — review Guardian confirmation settings manually.',
  },
  {
    id: 'governance_coherence_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Coherence Low',
    detailTemplate: 'Guardian and Co-Pilot governance signals are misaligned',
    evidenceFields: ['governanceCoherenceScore', 'copilotTrustGapScore', 'guardianProtectionLevel'],
    evaluate: s => s.governanceCoherenceScore < 35,
  },
  {
    id: 'governance_coherence_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Governance While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance coherence',
    evidenceFields: ['governanceCoherenceScore', 'copilotAutonomousActive', 'copilotAuthorityMode'],
    evaluate: s => s.copilotAutonomousActive && s.governanceCoherenceScore >= 35 && s.governanceCoherenceScore < 55,
  },
  {
    id: 'stability_lattice_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Stability Lattice Pressured',
    detailTemplate: 'Composite pressure and advisory saturation align in the pressured lattice band',
    evidenceFields: ['compositePressureIndex', 'advisorySaturationIndex', 'escalationLatchScore'],
    evaluate: s => s.compositePressureIndex >= 55 && s.advisorySaturationIndex >= 50,
  },
  {
    id: 'rival_escalation_latch',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Escalation Latch',
    detailTemplate: 'Rival victory progress plus elevated escalation latch',
    evidenceFields: ['rivalVictoryProgressPct', 'escalationLatchScore', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.7 &&
      s.escalationLatchScore >= 45,
  },
  {
    id: 'team_plan_escalation_latch',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan Escalation Latch',
    detailTemplate: 'Pending team plan while escalation latch is elevated',
    evidenceFields: ['teamPlanPending', 'escalationLatchScore', 'governanceCoherenceScore'],
    evaluate: s => s.teamPlanPending && s.escalationLatchScore >= 50,
  },
  {
    id: 'guardian_stability_lattice_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Stability Lattice Critical',
    detailTemplate: 'Critical Guardian band with low governance coherence',
    evidenceFields: ['guardianRiskBand', 'governanceCoherenceScore', 'advisorySaturationIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceCoherenceScore < 45,
  },
  {
    id: 'copilot_saturation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Advisory Saturation',
    detailTemplate: 'Autonomous Co-Pilot while advisory saturation is high',
    evidenceFields: ['copilotAutonomousActive', 'advisorySaturationIndex', 'automationReadinessScore'],
    evaluate: s => s.copilotAutonomousActive && s.advisorySaturationIndex >= 55,
  },
  {
    id: 'contracts_escalation_latch',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Escalation Latch',
    detailTemplate: 'Expiring contracts while escalation latch is elevated',
    evidenceFields: ['expiringContractCount', 'escalationLatchScore', 'liquidityStressIndex'],
    evaluate: s => s.expiringContractCount > 0 && s.escalationLatchScore >= 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_5_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_5.length;


// --- source: monitor-rules-scale-wave-6.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_6: AdvisoryMonitorRule[] = [
  {
    id: 'containment_burden_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Containment Burden High',
    detailTemplate: 'Advisory containment burden is in the high band — triage overlapping warnings',
    evidenceFields: ['containmentBurdenIndex', 'advisorySaturationIndex', 'escalationLatchScore'],
    evaluate: s => s.containmentBurdenIndex >= 70,
  },
  {
    id: 'containment_burden_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Containment Burden Elevated',
    detailTemplate: 'Containment burden is elevated — expect stacked Guardian and Co-Pilot advisories',
    evidenceFields: ['containmentBurdenIndex', 'governanceCoherenceScore'],
    evaluate: s => s.containmentBurdenIndex >= 45 && s.containmentBurdenIndex < 70,
  },
  {
    id: 'human_relay_pressure_critical',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Human Relay Pressure Critical',
    detailTemplate: 'Human operator relay load is critical — defer autonomous actions',
    evidenceFields: ['humanRelayPressure', 'takeoverSessionActive', 'guardianConfirmationLikelyRequired'],
    evaluate: s => s.humanRelayPressure >= 65,
  },
  {
    id: 'human_relay_pressure_elevated',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Human Relay Pressure Elevated',
    detailTemplate: 'Human relay pressure is elevated — batch confirmations when possible',
    evidenceFields: ['humanRelayPressure', 'blockedContinueCount', 'escalationLatchScore'],
    evaluate: s => s.humanRelayPressure >= 40 && s.humanRelayPressure < 65,
    followUp: 'Advisory only — review takeover and confirmation settings manually.',
  },
  {
    id: 'recovery_headroom_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Recovery Headroom Low',
    detailTemplate: 'Little slack remains to absorb another advisory shock',
    evidenceFields: ['recoveryHeadroomScore', 'containmentBurdenIndex', 'liquidityStressIndex'],
    evaluate: s => s.recoveryHeadroomScore < 35,
  },
  {
    id: 'recovery_headroom_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Recovery While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate recovery headroom',
    evidenceFields: ['recoveryHeadroomScore', 'copilotAutonomousActive', 'automationReadinessScore'],
    evaluate: s => s.copilotAutonomousActive && s.recoveryHeadroomScore >= 35 && s.recoveryHeadroomScore < 55,
  },
  {
    id: 'resilience_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Resilience Envelope Pressured',
    detailTemplate: 'Containment burden and human relay pressure align in the pressured envelope band',
    evidenceFields: ['containmentBurdenIndex', 'humanRelayPressure', 'recoveryHeadroomScore'],
    evaluate: s => s.containmentBurdenIndex >= 55 && s.humanRelayPressure >= 50,
  },
  {
    id: 'rival_containment_burden',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Containment Burden',
    detailTemplate: 'Rival victory progress plus elevated containment burden',
    evidenceFields: ['rivalVictoryProgressPct', 'containmentBurdenIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.7 &&
      s.containmentBurdenIndex >= 50,
  },
  {
    id: 'team_plan_human_relay',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan Human Relay Load',
    detailTemplate: 'Pending team plan while human relay pressure is elevated',
    evidenceFields: ['teamPlanPending', 'humanRelayPressure', 'recoveryHeadroomScore'],
    evaluate: s => s.teamPlanPending && s.humanRelayPressure >= 50,
  },
  {
    id: 'guardian_resilience_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Resilience Envelope Critical',
    detailTemplate: 'Critical Guardian band with low recovery headroom',
    evidenceFields: ['guardianRiskBand', 'recoveryHeadroomScore', 'containmentBurdenIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.recoveryHeadroomScore < 40,
  },
  {
    id: 'copilot_burden_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Containment Burden',
    detailTemplate: 'Autonomous Co-Pilot while containment burden is high',
    evidenceFields: ['copilotAutonomousActive', 'containmentBurdenIndex', 'humanRelayPressure'],
    evaluate: s => s.copilotAutonomousActive && s.containmentBurdenIndex >= 55,
  },
  {
    id: 'contracts_recovery_headroom',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Recovery Headroom',
    detailTemplate: 'Expiring contracts while recovery headroom is low',
    evidenceFields: ['expiringContractCount', 'recoveryHeadroomScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.recoveryHeadroomScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_6_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_6.length;


// --- source: monitor-rules-scale-wave-7.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_7: AdvisoryMonitorRule[] = [
  {
    id: 'advisory_depletion_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Advisory Depletion High',
    detailTemplate: 'Advisory depletion is in the high band — pause non-essential automation',
    evidenceFields: ['advisoryDepletionIndex', 'recoveryHeadroomScore', 'containmentBurdenIndex'],
    evaluate: s => s.advisoryDepletionIndex >= 70,
  },
  {
    id: 'advisory_depletion_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Advisory Depletion Elevated',
    detailTemplate: 'Advisory depletion is elevated — expect slower operator response cycles',
    evidenceFields: ['advisoryDepletionIndex', 'humanRelayPressure'],
    evaluate: s => s.advisoryDepletionIndex >= 45 && s.advisoryDepletionIndex < 70,
  },
  {
    id: 'operator_bandwidth_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Operator Bandwidth Low',
    detailTemplate: 'Operator bandwidth is critically low — defer stacked confirmations',
    evidenceFields: ['operatorBandwidthScore', 'humanRelayPressure', 'advisoryDepletionIndex'],
    evaluate: s => s.operatorBandwidthScore < 35,
  },
  {
    id: 'operator_bandwidth_constrained',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Operator Bandwidth Constrained',
    detailTemplate: 'Operator bandwidth is constrained — batch Guardian advisories when possible',
    evidenceFields: ['operatorBandwidthScore', 'teamPlanPending', 'takeoverSessionActive'],
    evaluate: s => s.operatorBandwidthScore >= 35 && s.operatorBandwidthScore < 55,
    followUp: 'Advisory only — review takeover and team plan queues manually.',
  },
  {
    id: 'continuity_margin_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Continuity Margin Low',
    detailTemplate: 'Little continuity margin remains across turns of advisory load',
    evidenceFields: ['continuityMarginScore', 'advisoryDepletionIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.continuityMarginScore < 35,
  },
  {
    id: 'continuity_margin_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Continuity While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate continuity margin',
    evidenceFields: ['continuityMarginScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.continuityMarginScore >= 35 && s.continuityMarginScore < 55,
  },
  {
    id: 'continuity_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Continuity Envelope Pressured',
    detailTemplate: 'Advisory depletion and low operator bandwidth align in the pressured continuity band',
    evidenceFields: ['advisoryDepletionIndex', 'operatorBandwidthScore', 'continuityMarginScore'],
    evaluate: s => s.advisoryDepletionIndex >= 55 && s.operatorBandwidthScore < 50,
  },
  {
    id: 'rival_continuity_depletion',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Advisory Depletion',
    detailTemplate: 'Rival victory progress plus elevated advisory depletion',
    evidenceFields: ['rivalVictoryProgressPct', 'advisoryDepletionIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.7 &&
      s.advisoryDepletionIndex >= 50,
  },
  {
    id: 'team_plan_continuity_margin',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan Continuity Margin',
    detailTemplate: 'Pending team plan while continuity margin is low',
    evidenceFields: ['teamPlanPending', 'continuityMarginScore', 'operatorBandwidthScore'],
    evaluate: s => s.teamPlanPending && s.continuityMarginScore < 45,
  },
  {
    id: 'guardian_continuity_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Continuity Envelope Critical',
    detailTemplate: 'Critical Guardian band with low continuity margin',
    evidenceFields: ['guardianRiskBand', 'continuityMarginScore', 'advisoryDepletionIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.continuityMarginScore < 40,
  },
  {
    id: 'copilot_depletion_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Advisory Depletion',
    detailTemplate: 'Autonomous Co-Pilot while advisory depletion is high',
    evidenceFields: ['copilotAutonomousActive', 'advisoryDepletionIndex', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.advisoryDepletionIndex >= 55,
  },
  {
    id: 'contracts_continuity_margin',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Continuity Margin',
    detailTemplate: 'Expiring contracts while continuity margin is low',
    evidenceFields: ['expiringContractCount', 'continuityMarginScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.continuityMarginScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_7_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_7.length;


// --- source: monitor-rules-scale-wave-8.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_8: AdvisoryMonitorRule[] = [
  {
    id: 'stewardship_load_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Stewardship Load High',
    detailTemplate: 'Stewardship load is in the high band — reduce overlapping warn-only governance demands',
    evidenceFields: ['stewardshipLoadIndex', 'continuityMarginScore', 'oversightCommitmentScore'],
    evaluate: s => s.stewardshipLoadIndex >= 70,
  },
  {
    id: 'stewardship_load_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Stewardship Load Elevated',
    detailTemplate: 'Stewardship load is elevated — expect slower oversight cycles across turns',
    evidenceFields: ['stewardshipLoadIndex', 'advisoryDepletionIndex'],
    evaluate: s => s.stewardshipLoadIndex >= 45 && s.stewardshipLoadIndex < 70,
  },
  {
    id: 'oversight_commitment_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Oversight Commitment Low',
    detailTemplate: 'Oversight commitment is critically low — defer stacked autonomous actions',
    evidenceFields: ['oversightCommitmentScore', 'stewardshipLoadIndex', 'governanceCoherenceScore'],
    evaluate: s => s.oversightCommitmentScore < 35,
  },
  {
    id: 'oversight_commitment_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Oversight While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate oversight commitment',
    evidenceFields: ['oversightCommitmentScore', 'copilotAutonomousActive', 'stewardshipLoadIndex'],
    evaluate: s => s.copilotAutonomousActive && s.oversightCommitmentScore >= 35 && s.oversightCommitmentScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'sustainability_margin_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Sustainability Margin Low',
    detailTemplate: 'Little sustainability margin remains for warn-only governance across turns',
    evidenceFields: ['sustainabilityMarginScore', 'stewardshipLoadIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.sustainabilityMarginScore < 35,
  },
  {
    id: 'sustainability_margin_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Sustainability While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate sustainability margin',
    evidenceFields: ['sustainabilityMarginScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.sustainabilityMarginScore >= 35 && s.sustainabilityMarginScore < 55,
  },
  {
    id: 'stewardship_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Stewardship Envelope Pressured',
    detailTemplate: 'Stewardship load and low oversight commitment align in the pressured envelope band',
    evidenceFields: ['stewardshipLoadIndex', 'oversightCommitmentScore', 'sustainabilityMarginScore'],
    evaluate: s => s.stewardshipLoadIndex >= 55 && s.oversightCommitmentScore < 50,
  },
  {
    id: 'rival_stewardship_load',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Stewardship Load',
    detailTemplate: 'Rival victory progress plus elevated stewardship load',
    evidenceFields: ['rivalVictoryProgressPct', 'stewardshipLoadIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.7 &&
      s.stewardshipLoadIndex >= 50,
  },
  {
    id: 'team_plan_stewardship_load',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan Stewardship Load',
    detailTemplate: 'Pending team plan while stewardship load is elevated',
    evidenceFields: ['teamPlanPending', 'stewardshipLoadIndex', 'sustainabilityMarginScore'],
    evaluate: s => s.teamPlanPending && s.stewardshipLoadIndex >= 55,
  },
  {
    id: 'guardian_stewardship_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Stewardship Envelope Critical',
    detailTemplate: 'Critical Guardian band with low sustainability margin',
    evidenceFields: ['guardianRiskBand', 'sustainabilityMarginScore', 'stewardshipLoadIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.sustainabilityMarginScore < 40,
  },
  {
    id: 'copilot_stewardship_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Stewardship Load',
    detailTemplate: 'Autonomous Co-Pilot while stewardship load is high',
    evidenceFields: ['copilotAutonomousActive', 'stewardshipLoadIndex', 'oversightCommitmentScore'],
    evaluate: s => s.copilotAutonomousActive && s.stewardshipLoadIndex >= 55,
  },
  {
    id: 'contracts_sustainability_margin',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Sustainability Margin',
    detailTemplate: 'Expiring contracts while sustainability margin is low',
    evidenceFields: ['expiringContractCount', 'sustainabilityMarginScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.sustainabilityMarginScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_8_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_8.length;


// --- source: monitor-rules-scale-wave-9.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_9: AdvisoryMonitorRule[] = [
  {
    id: 'accountability_load_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Accountability Load High',
    detailTemplate: 'Accountability load is in the high band — reduce stacked warn-only governance obligations',
    evidenceFields: ['accountabilityLoadIndex', 'sustainabilityMarginScore', 'delegationFidelityScore'],
    evaluate: s => s.accountabilityLoadIndex >= 70,
  },
  {
    id: 'accountability_load_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Accountability Load Elevated',
    detailTemplate: 'Accountability load is elevated — expect slower delegation review across turns',
    evidenceFields: ['accountabilityLoadIndex', 'stewardshipLoadIndex'],
    evaluate: s => s.accountabilityLoadIndex >= 45 && s.accountabilityLoadIndex < 70,
  },
  {
    id: 'delegation_fidelity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Delegation Fidelity Low',
    detailTemplate: 'Delegation fidelity is critically low — defer stacked autonomous actions',
    evidenceFields: ['delegationFidelityScore', 'accountabilityLoadIndex', 'oversightCommitmentScore'],
    evaluate: s => s.delegationFidelityScore < 35,
  },
  {
    id: 'delegation_fidelity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Delegation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate delegation fidelity',
    evidenceFields: ['delegationFidelityScore', 'copilotAutonomousActive', 'accountabilityLoadIndex'],
    evaluate: s => s.copilotAutonomousActive && s.delegationFidelityScore >= 35 && s.delegationFidelityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_endurance_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Endurance Low',
    detailTemplate: 'Little governance endurance remains for warn-only oversight across turns',
    evidenceFields: ['governanceEnduranceScore', 'accountabilityLoadIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceEnduranceScore < 35,
  },
  {
    id: 'governance_endurance_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Endurance While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance endurance',
    evidenceFields: ['governanceEnduranceScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceEnduranceScore >= 35 && s.governanceEnduranceScore < 55,
  },
  {
    id: 'accountability_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Accountability Envelope Pressured',
    detailTemplate: 'Accountability load and low delegation fidelity align in the pressured envelope band',
    evidenceFields: ['accountabilityLoadIndex', 'delegationFidelityScore', 'governanceEnduranceScore'],
    evaluate: s => s.accountabilityLoadIndex >= 55 && s.delegationFidelityScore < 50,
  },
  {
    id: 'rival_accountability_load',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Accountability Load',
    detailTemplate: 'Rival victory progress plus elevated accountability load',
    evidenceFields: ['rivalVictoryProgressPct', 'accountabilityLoadIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.accountabilityLoadIndex >= 50,
  },
  {
    id: 'team_plan_accountability_load',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Accountability Load',
    detailTemplate: 'Pending team plan while accountability load is elevated',
    evidenceFields: ['teamPlanPending', 'accountabilityLoadIndex', 'governanceEnduranceScore'],
    evaluate: s => s.teamPlanPending && s.accountabilityLoadIndex >= 55,
  },
  {
    id: 'guardian_accountability_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Accountability Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance endurance',
    evidenceFields: ['guardianRiskBand', 'governanceEnduranceScore', 'accountabilityLoadIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceEnduranceScore < 40,
  },
  {
    id: 'copilot_accountability_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Accountability Load',
    detailTemplate: 'Autonomous Co-Pilot while accountability load is high',
    evidenceFields: ['copilotAutonomousActive', 'accountabilityLoadIndex', 'delegationFidelityScore'],
    evaluate: s => s.copilotAutonomousActive && s.accountabilityLoadIndex >= 55,
  },
  {
    id: 'contracts_governance_endurance',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Endurance',
    detailTemplate: 'Expiring contracts while governance endurance is low',
    evidenceFields: ['expiringContractCount', 'governanceEnduranceScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceEnduranceScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_9_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_9.length;


// --- source: monitor-rules-scale-wave-10.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_10: AdvisoryMonitorRule[] = [
  {
    id: 'fiduciary_burden_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Fiduciary Burden High',
    detailTemplate: 'Fiduciary burden is in the high band — reduce overlapping warn-only fiduciary review demands',
    evidenceFields: ['fiduciaryBurdenIndex', 'governanceEnduranceScore', 'trustAssuranceScore'],
    evaluate: s => s.fiduciaryBurdenIndex >= 70,
  },
  {
    id: 'fiduciary_burden_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fiduciary Burden Elevated',
    detailTemplate: 'Fiduciary burden is elevated — expect slower assurance review across turns',
    evidenceFields: ['fiduciaryBurdenIndex', 'accountabilityLoadIndex'],
    evaluate: s => s.fiduciaryBurdenIndex >= 45 && s.fiduciaryBurdenIndex < 70,
  },
  {
    id: 'trust_assurance_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Trust Assurance Low',
    detailTemplate: 'Trust assurance is critically low — defer stacked autonomous actions',
    evidenceFields: ['trustAssuranceScore', 'fiduciaryBurdenIndex', 'delegationFidelityScore'],
    evaluate: s => s.trustAssuranceScore < 35,
  },
  {
    id: 'trust_assurance_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Assurance While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate trust assurance',
    evidenceFields: ['trustAssuranceScore', 'copilotAutonomousActive', 'fiduciaryBurdenIndex'],
    evaluate: s => s.copilotAutonomousActive && s.trustAssuranceScore >= 35 && s.trustAssuranceScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_durability_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Durability Low',
    detailTemplate: 'Little governance durability remains for warn-only fiduciary oversight across turns',
    evidenceFields: ['governanceDurabilityScore', 'fiduciaryBurdenIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceDurabilityScore < 35,
  },
  {
    id: 'governance_durability_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Durability While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance durability',
    evidenceFields: ['governanceDurabilityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceDurabilityScore >= 35 && s.governanceDurabilityScore < 55,
  },
  {
    id: 'fiduciary_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Fiduciary Envelope Pressured',
    detailTemplate: 'Fiduciary burden and low trust assurance align in the pressured envelope band',
    evidenceFields: ['fiduciaryBurdenIndex', 'trustAssuranceScore', 'governanceDurabilityScore'],
    evaluate: s => s.fiduciaryBurdenIndex >= 55 && s.trustAssuranceScore < 50,
  },
  {
    id: 'rival_fiduciary_burden',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Fiduciary Burden',
    detailTemplate: 'Rival victory progress plus elevated fiduciary burden',
    evidenceFields: ['rivalVictoryProgressPct', 'fiduciaryBurdenIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.fiduciaryBurdenIndex >= 50,
  },
  {
    id: 'team_plan_fiduciary_burden',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Fiduciary Burden',
    detailTemplate: 'Pending team plan while fiduciary burden is elevated',
    evidenceFields: ['teamPlanPending', 'fiduciaryBurdenIndex', 'governanceDurabilityScore'],
    evaluate: s => s.teamPlanPending && s.fiduciaryBurdenIndex >= 55,
  },
  {
    id: 'guardian_fiduciary_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Fiduciary Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance durability',
    evidenceFields: ['guardianRiskBand', 'governanceDurabilityScore', 'fiduciaryBurdenIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceDurabilityScore < 40,
  },
  {
    id: 'copilot_fiduciary_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Fiduciary Burden',
    detailTemplate: 'Autonomous Co-Pilot while fiduciary burden is high',
    evidenceFields: ['copilotAutonomousActive', 'fiduciaryBurdenIndex', 'trustAssuranceScore'],
    evaluate: s => s.copilotAutonomousActive && s.fiduciaryBurdenIndex >= 55,
  },
  {
    id: 'contracts_governance_durability',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Durability',
    detailTemplate: 'Expiring contracts while governance durability is low',
    evidenceFields: ['expiringContractCount', 'governanceDurabilityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceDurabilityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_10_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_10.length;


// --- source: monitor-rules-scale-wave-11.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_11: AdvisoryMonitorRule[] = [
  {
    id: 'covenant_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Covenant Strain High',
    detailTemplate: 'Covenant strain is in the high band — reduce overlapping warn-only mandate review demands',
    evidenceFields: ['covenantStrainIndex', 'governanceDurabilityScore', 'mandateIntegrityScore'],
    evaluate: s => s.covenantStrainIndex >= 70,
  },
  {
    id: 'covenant_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Covenant Strain Elevated',
    detailTemplate: 'Covenant strain is elevated — expect slower mandate review across turns',
    evidenceFields: ['covenantStrainIndex', 'fiduciaryBurdenIndex'],
    evaluate: s => s.covenantStrainIndex >= 45 && s.covenantStrainIndex < 70,
  },
  {
    id: 'mandate_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Mandate Integrity Low',
    detailTemplate: 'Mandate integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['mandateIntegrityScore', 'covenantStrainIndex', 'trustAssuranceScore'],
    evaluate: s => s.mandateIntegrityScore < 35,
  },
  {
    id: 'mandate_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Mandate While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate mandate integrity',
    evidenceFields: ['mandateIntegrityScore', 'copilotAutonomousActive', 'covenantStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.mandateIntegrityScore >= 35 && s.mandateIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_tenacity_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Tenacity Low',
    detailTemplate: 'Little governance tenacity remains for warn-only covenant oversight across turns',
    evidenceFields: ['governanceTenacityScore', 'covenantStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceTenacityScore < 35,
  },
  {
    id: 'governance_tenacity_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Tenacity While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance tenacity',
    evidenceFields: ['governanceTenacityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceTenacityScore >= 35 && s.governanceTenacityScore < 55,
  },
  {
    id: 'covenant_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Covenant Envelope Pressured',
    detailTemplate: 'Covenant strain and low mandate integrity align in the pressured envelope band',
    evidenceFields: ['covenantStrainIndex', 'mandateIntegrityScore', 'governanceTenacityScore'],
    evaluate: s => s.covenantStrainIndex >= 55 && s.mandateIntegrityScore < 50,
  },
  {
    id: 'rival_covenant_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Covenant Strain',
    detailTemplate: 'Rival victory progress plus elevated covenant strain',
    evidenceFields: ['rivalVictoryProgressPct', 'covenantStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.covenantStrainIndex >= 50,
  },
  {
    id: 'team_plan_covenant_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Covenant Strain',
    detailTemplate: 'Pending team plan while covenant strain is elevated',
    evidenceFields: ['teamPlanPending', 'covenantStrainIndex', 'governanceTenacityScore'],
    evaluate: s => s.teamPlanPending && s.covenantStrainIndex >= 55,
  },
  {
    id: 'guardian_covenant_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Covenant Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance tenacity',
    evidenceFields: ['guardianRiskBand', 'governanceTenacityScore', 'covenantStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceTenacityScore < 40,
  },
  {
    id: 'copilot_covenant_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Covenant Strain',
    detailTemplate: 'Autonomous Co-Pilot while covenant strain is high',
    evidenceFields: ['copilotAutonomousActive', 'covenantStrainIndex', 'mandateIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.covenantStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_tenacity',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Tenacity',
    detailTemplate: 'Expiring contracts while governance tenacity is low',
    evidenceFields: ['expiringContractCount', 'governanceTenacityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceTenacityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_11_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_11.length;


// --- source: monitor-rules-scale-wave-12.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_12: AdvisoryMonitorRule[] = [
  {
    id: 'charter_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Charter Strain High',
    detailTemplate: 'Charter strain is in the high band — reduce overlapping warn-only charter review demands',
    evidenceFields: ['charterStrainIndex', 'governanceTenacityScore', 'authorityIntegrityScore'],
    evaluate: s => s.charterStrainIndex >= 70,
  },
  {
    id: 'charter_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Charter Strain Elevated',
    detailTemplate: 'Charter strain is elevated — expect slower authority review across turns',
    evidenceFields: ['charterStrainIndex', 'covenantStrainIndex'],
    evaluate: s => s.charterStrainIndex >= 45 && s.charterStrainIndex < 70,
  },
  {
    id: 'authority_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Authority Integrity Low',
    detailTemplate: 'Authority integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['authorityIntegrityScore', 'charterStrainIndex', 'mandateIntegrityScore'],
    evaluate: s => s.authorityIntegrityScore < 35,
  },
  {
    id: 'authority_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Authority While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate authority integrity',
    evidenceFields: ['authorityIntegrityScore', 'copilotAutonomousActive', 'charterStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.authorityIntegrityScore >= 35 && s.authorityIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_persistence_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Persistence Low',
    detailTemplate: 'Little governance persistence remains for warn-only charter oversight across turns',
    evidenceFields: ['governancePersistenceScore', 'charterStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governancePersistenceScore < 35,
  },
  {
    id: 'governance_persistence_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Persistence While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance persistence',
    evidenceFields: ['governancePersistenceScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governancePersistenceScore >= 35 && s.governancePersistenceScore < 55,
  },
  {
    id: 'charter_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Charter Envelope Pressured',
    detailTemplate: 'Charter strain and low authority integrity align in the pressured envelope band',
    evidenceFields: ['charterStrainIndex', 'authorityIntegrityScore', 'governancePersistenceScore'],
    evaluate: s => s.charterStrainIndex >= 55 && s.authorityIntegrityScore < 50,
  },
  {
    id: 'rival_charter_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Charter Strain',
    detailTemplate: 'Rival victory progress plus elevated charter strain',
    evidenceFields: ['rivalVictoryProgressPct', 'charterStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.charterStrainIndex >= 50,
  },
  {
    id: 'team_plan_charter_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Charter Strain',
    detailTemplate: 'Pending team plan while charter strain is elevated',
    evidenceFields: ['teamPlanPending', 'charterStrainIndex', 'governancePersistenceScore'],
    evaluate: s => s.teamPlanPending && s.charterStrainIndex >= 55,
  },
  {
    id: 'guardian_charter_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Charter Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance persistence',
    evidenceFields: ['guardianRiskBand', 'governancePersistenceScore', 'charterStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governancePersistenceScore < 40,
  },
  {
    id: 'copilot_charter_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Charter Strain',
    detailTemplate: 'Autonomous Co-Pilot while charter strain is high',
    evidenceFields: ['copilotAutonomousActive', 'charterStrainIndex', 'authorityIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.charterStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_persistence',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Persistence',
    detailTemplate: 'Expiring contracts while governance persistence is low',
    evidenceFields: ['expiringContractCount', 'governancePersistenceScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governancePersistenceScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_12_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_12.length;


// --- source: monitor-rules-scale-wave-13.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_13: AdvisoryMonitorRule[] = [
  {
    id: 'legitimacy_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Legitimacy Strain High',
    detailTemplate: 'Legitimacy strain is in the high band — reduce overlapping warn-only legitimacy review demands',
    evidenceFields: ['legitimacyStrainIndex', 'governancePersistenceScore', 'oversightIntegrityScore'],
    evaluate: s => s.legitimacyStrainIndex >= 70,
  },
  {
    id: 'legitimacy_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Legitimacy Strain Elevated',
    detailTemplate: 'Legitimacy strain is elevated — expect slower oversight review across turns',
    evidenceFields: ['legitimacyStrainIndex', 'charterStrainIndex'],
    evaluate: s => s.legitimacyStrainIndex >= 45 && s.legitimacyStrainIndex < 70,
  },
  {
    id: 'oversight_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Oversight Integrity Low',
    detailTemplate: 'Oversight integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['oversightIntegrityScore', 'legitimacyStrainIndex', 'authorityIntegrityScore'],
    evaluate: s => s.oversightIntegrityScore < 35,
  },
  {
    id: 'oversight_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Oversight While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate oversight integrity',
    evidenceFields: ['oversightIntegrityScore', 'copilotAutonomousActive', 'legitimacyStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.oversightIntegrityScore >= 35 && s.oversightIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_continuity_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Continuity Low',
    detailTemplate: 'Little governance continuity remains for warn-only legitimacy oversight across turns',
    evidenceFields: ['governanceContinuityScore', 'legitimacyStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceContinuityScore < 35,
  },
  {
    id: 'governance_continuity_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Continuity While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance continuity',
    evidenceFields: ['governanceContinuityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceContinuityScore >= 35 && s.governanceContinuityScore < 55,
  },
  {
    id: 'legitimacy_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Legitimacy Envelope Pressured',
    detailTemplate: 'Legitimacy strain and low oversight integrity align in the pressured envelope band',
    evidenceFields: ['legitimacyStrainIndex', 'oversightIntegrityScore', 'governanceContinuityScore'],
    evaluate: s => s.legitimacyStrainIndex >= 55 && s.oversightIntegrityScore < 50,
  },
  {
    id: 'rival_legitimacy_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Legitimacy Strain',
    detailTemplate: 'Rival victory progress plus elevated legitimacy strain',
    evidenceFields: ['rivalVictoryProgressPct', 'legitimacyStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.legitimacyStrainIndex >= 50,
  },
  {
    id: 'team_plan_legitimacy_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Legitimacy Strain',
    detailTemplate: 'Pending team plan while legitimacy strain is elevated',
    evidenceFields: ['teamPlanPending', 'legitimacyStrainIndex', 'governanceContinuityScore'],
    evaluate: s => s.teamPlanPending && s.legitimacyStrainIndex >= 55,
  },
  {
    id: 'guardian_legitimacy_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Legitimacy Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance continuity',
    evidenceFields: ['guardianRiskBand', 'governanceContinuityScore', 'legitimacyStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceContinuityScore < 40,
  },
  {
    id: 'copilot_legitimacy_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Legitimacy Strain',
    detailTemplate: 'Autonomous Co-Pilot while legitimacy strain is high',
    evidenceFields: ['copilotAutonomousActive', 'legitimacyStrainIndex', 'oversightIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.legitimacyStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_continuity',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Continuity',
    detailTemplate: 'Expiring contracts while governance continuity is low',
    evidenceFields: ['expiringContractCount', 'governanceContinuityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceContinuityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_13_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_13.length;


// --- source: monitor-rules-scale-wave-14.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_14: AdvisoryMonitorRule[] = [
  {
    id: 'compliance_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Compliance Strain High',
    detailTemplate: 'Compliance strain is in the high band — reduce overlapping warn-only policy review demands',
    evidenceFields: ['complianceStrainIndex', 'governanceContinuityScore', 'policyIntegrityScore'],
    evaluate: s => s.complianceStrainIndex >= 70,
  },
  {
    id: 'compliance_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Compliance Strain Elevated',
    detailTemplate: 'Compliance strain is elevated — expect slower policy review across turns',
    evidenceFields: ['complianceStrainIndex', 'legitimacyStrainIndex'],
    evaluate: s => s.complianceStrainIndex >= 45 && s.complianceStrainIndex < 70,
  },
  {
    id: 'policy_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Policy Integrity Low',
    detailTemplate: 'Policy integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['policyIntegrityScore', 'complianceStrainIndex', 'oversightIntegrityScore'],
    evaluate: s => s.policyIntegrityScore < 35,
  },
  {
    id: 'policy_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Policy While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate policy integrity',
    evidenceFields: ['policyIntegrityScore', 'copilotAutonomousActive', 'complianceStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.policyIntegrityScore >= 35 && s.policyIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_resilience_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Resilience Low',
    detailTemplate: 'Little governance resilience remains for warn-only compliance oversight across turns',
    evidenceFields: ['governanceResilienceScore', 'complianceStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceResilienceScore < 35,
  },
  {
    id: 'governance_resilience_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Resilience While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance resilience',
    evidenceFields: ['governanceResilienceScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceResilienceScore >= 35 && s.governanceResilienceScore < 55,
  },
  {
    id: 'compliance_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Compliance Envelope Pressured',
    detailTemplate: 'Compliance strain and low policy integrity align in the pressured envelope band',
    evidenceFields: ['complianceStrainIndex', 'policyIntegrityScore', 'governanceResilienceScore'],
    evaluate: s => s.complianceStrainIndex >= 55 && s.policyIntegrityScore < 50,
  },
  {
    id: 'rival_compliance_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Compliance Strain',
    detailTemplate: 'Rival victory progress plus elevated compliance strain',
    evidenceFields: ['rivalVictoryProgressPct', 'complianceStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.complianceStrainIndex >= 50,
  },
  {
    id: 'team_plan_compliance_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Compliance Strain',
    detailTemplate: 'Pending team plan while compliance strain is elevated',
    evidenceFields: ['teamPlanPending', 'complianceStrainIndex', 'governanceResilienceScore'],
    evaluate: s => s.teamPlanPending && s.complianceStrainIndex >= 55,
  },
  {
    id: 'guardian_compliance_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Compliance Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance resilience',
    evidenceFields: ['guardianRiskBand', 'governanceResilienceScore', 'complianceStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceResilienceScore < 40,
  },
  {
    id: 'copilot_compliance_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Compliance Strain',
    detailTemplate: 'Autonomous Co-Pilot while compliance strain is high',
    evidenceFields: ['copilotAutonomousActive', 'complianceStrainIndex', 'policyIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.complianceStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_resilience',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Resilience',
    detailTemplate: 'Expiring contracts while governance resilience is low',
    evidenceFields: ['expiringContractCount', 'governanceResilienceScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceResilienceScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_14_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_14.length;


// --- source: monitor-rules-scale-wave-15.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_15: AdvisoryMonitorRule[] = [
  {
    id: 'audit_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Audit Strain High',
    detailTemplate: 'Audit strain is in the high band — reduce overlapping warn-only control review demands',
    evidenceFields: ['auditStrainIndex', 'governanceResilienceScore', 'controlIntegrityScore'],
    evaluate: s => s.auditStrainIndex >= 70,
  },
  {
    id: 'audit_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Audit Strain Elevated',
    detailTemplate: 'Audit strain is elevated — expect slower control review across turns',
    evidenceFields: ['auditStrainIndex', 'complianceStrainIndex'],
    evaluate: s => s.auditStrainIndex >= 45 && s.auditStrainIndex < 70,
  },
  {
    id: 'control_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Control Integrity Low',
    detailTemplate: 'Control integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['controlIntegrityScore', 'auditStrainIndex', 'policyIntegrityScore'],
    evaluate: s => s.controlIntegrityScore < 35,
  },
  {
    id: 'control_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Controls While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate control integrity',
    evidenceFields: ['controlIntegrityScore', 'copilotAutonomousActive', 'auditStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.controlIntegrityScore >= 35 && s.controlIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_stability_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Stability Low',
    detailTemplate: 'Little governance stability remains for warn-only audit oversight across turns',
    evidenceFields: ['governanceStabilityScore', 'auditStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceStabilityScore < 35,
  },
  {
    id: 'governance_stability_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Stability While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance stability',
    evidenceFields: ['governanceStabilityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceStabilityScore >= 35 && s.governanceStabilityScore < 55,
  },
  {
    id: 'audit_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Audit Envelope Pressured',
    detailTemplate: 'Audit strain and low control integrity align in the pressured envelope band',
    evidenceFields: ['auditStrainIndex', 'controlIntegrityScore', 'governanceStabilityScore'],
    evaluate: s => s.auditStrainIndex >= 55 && s.controlIntegrityScore < 50,
  },
  {
    id: 'rival_audit_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Audit Strain',
    detailTemplate: 'Rival victory progress plus elevated audit strain',
    evidenceFields: ['rivalVictoryProgressPct', 'auditStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.auditStrainIndex >= 50,
  },
  {
    id: 'team_plan_audit_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Audit Strain',
    detailTemplate: 'Pending team plan while audit strain is elevated',
    evidenceFields: ['teamPlanPending', 'auditStrainIndex', 'governanceStabilityScore'],
    evaluate: s => s.teamPlanPending && s.auditStrainIndex >= 55,
  },
  {
    id: 'guardian_audit_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Audit Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance stability',
    evidenceFields: ['guardianRiskBand', 'governanceStabilityScore', 'auditStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceStabilityScore < 40,
  },
  {
    id: 'copilot_audit_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Audit Strain',
    detailTemplate: 'Autonomous Co-Pilot while audit strain is high',
    evidenceFields: ['copilotAutonomousActive', 'auditStrainIndex', 'controlIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.auditStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_stability',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Stability',
    detailTemplate: 'Expiring contracts while governance stability is low',
    evidenceFields: ['expiringContractCount', 'governanceStabilityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceStabilityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_15_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_15.length;


// --- source: monitor-rules-scale-wave-16.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_16: AdvisoryMonitorRule[] = [
  {
    id: 'assurance_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Assurance Strain High',
    detailTemplate: 'Assurance strain is in the high band — reduce overlapping warn-only evidence review demands',
    evidenceFields: ['assuranceStrainIndex', 'governanceStabilityScore', 'evidenceIntegrityScore'],
    evaluate: s => s.assuranceStrainIndex >= 70,
  },
  {
    id: 'assurance_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Assurance Strain Elevated',
    detailTemplate: 'Assurance strain is elevated — expect slower evidence review across turns',
    evidenceFields: ['assuranceStrainIndex', 'auditStrainIndex'],
    evaluate: s => s.assuranceStrainIndex >= 45 && s.assuranceStrainIndex < 70,
  },
  {
    id: 'evidence_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Evidence Integrity Low',
    detailTemplate: 'Evidence integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['evidenceIntegrityScore', 'assuranceStrainIndex', 'controlIntegrityScore'],
    evaluate: s => s.evidenceIntegrityScore < 35,
  },
  {
    id: 'evidence_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Evidence While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate evidence integrity',
    evidenceFields: ['evidenceIntegrityScore', 'copilotAutonomousActive', 'assuranceStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.evidenceIntegrityScore >= 35 && s.evidenceIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_confidence_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Confidence Low',
    detailTemplate: 'Little governance confidence remains for warn-only assurance oversight across turns',
    evidenceFields: ['governanceConfidenceScore', 'assuranceStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceConfidenceScore < 35,
  },
  {
    id: 'governance_confidence_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Confidence While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance confidence',
    evidenceFields: ['governanceConfidenceScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceConfidenceScore >= 35 && s.governanceConfidenceScore < 55,
  },
  {
    id: 'assurance_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Assurance Envelope Pressured',
    detailTemplate: 'Assurance strain and low evidence integrity align in the pressured envelope band',
    evidenceFields: ['assuranceStrainIndex', 'evidenceIntegrityScore', 'governanceConfidenceScore'],
    evaluate: s => s.assuranceStrainIndex >= 55 && s.evidenceIntegrityScore < 50,
  },
  {
    id: 'rival_assurance_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Assurance Strain',
    detailTemplate: 'Rival victory progress plus elevated assurance strain',
    evidenceFields: ['rivalVictoryProgressPct', 'assuranceStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.assuranceStrainIndex >= 50,
  },
  {
    id: 'team_plan_assurance_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Assurance Strain',
    detailTemplate: 'Pending team plan while assurance strain is elevated',
    evidenceFields: ['teamPlanPending', 'assuranceStrainIndex', 'governanceConfidenceScore'],
    evaluate: s => s.teamPlanPending && s.assuranceStrainIndex >= 55,
  },
  {
    id: 'guardian_assurance_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Assurance Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance confidence',
    evidenceFields: ['guardianRiskBand', 'governanceConfidenceScore', 'assuranceStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceConfidenceScore < 40,
  },
  {
    id: 'copilot_assurance_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Assurance Strain',
    detailTemplate: 'Autonomous Co-Pilot while assurance strain is high',
    evidenceFields: ['copilotAutonomousActive', 'assuranceStrainIndex', 'evidenceIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.assuranceStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_confidence',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Confidence',
    detailTemplate: 'Expiring contracts while governance confidence is low',
    evidenceFields: ['expiringContractCount', 'governanceConfidenceScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceConfidenceScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_16_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_16.length;


// --- source: monitor-rules-scale-wave-17.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_17: AdvisoryMonitorRule[] = [
  {
    id: 'attestation_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Attestation Strain High',
    detailTemplate: 'Attestation strain is in the high band — reduce overlapping warn-only attestation review demands',
    evidenceFields: ['attestationStrainIndex', 'governanceConfidenceScore', 'attestationIntegrityScore'],
    evaluate: s => s.attestationStrainIndex >= 70,
  },
  {
    id: 'attestation_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Attestation Strain Elevated',
    detailTemplate: 'Attestation strain is elevated — expect slower attestation review across turns',
    evidenceFields: ['attestationStrainIndex', 'assuranceStrainIndex'],
    evaluate: s => s.attestationStrainIndex >= 45 && s.attestationStrainIndex < 70,
  },
  {
    id: 'attestation_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Attestation Integrity Low',
    detailTemplate: 'Attestation integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['attestationIntegrityScore', 'attestationStrainIndex', 'evidenceIntegrityScore'],
    evaluate: s => s.attestationIntegrityScore < 35,
  },
  {
    id: 'attestation_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Attestation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate attestation integrity',
    evidenceFields: ['attestationIntegrityScore', 'copilotAutonomousActive', 'attestationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.attestationIntegrityScore >= 35 && s.attestationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_reliability_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Reliability Low',
    detailTemplate: 'Little governance reliability remains for warn-only attestation oversight across turns',
    evidenceFields: ['governanceReliabilityScore', 'attestationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceReliabilityScore < 35,
  },
  {
    id: 'governance_reliability_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Reliability While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance reliability',
    evidenceFields: ['governanceReliabilityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceReliabilityScore >= 35 && s.governanceReliabilityScore < 55,
  },
  {
    id: 'attestation_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Attestation Envelope Pressured',
    detailTemplate: 'Attestation strain and low attestation integrity align in the pressured envelope band',
    evidenceFields: ['attestationStrainIndex', 'attestationIntegrityScore', 'governanceReliabilityScore'],
    evaluate: s => s.attestationStrainIndex >= 55 && s.attestationIntegrityScore < 50,
  },
  {
    id: 'rival_attestation_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Attestation Strain',
    detailTemplate: 'Rival victory progress plus elevated attestation strain',
    evidenceFields: ['rivalVictoryProgressPct', 'attestationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.attestationStrainIndex >= 50,
  },
  {
    id: 'team_plan_attestation_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Attestation Strain',
    detailTemplate: 'Pending team plan while attestation strain is elevated',
    evidenceFields: ['teamPlanPending', 'attestationStrainIndex', 'governanceReliabilityScore'],
    evaluate: s => s.teamPlanPending && s.attestationStrainIndex >= 55,
  },
  {
    id: 'guardian_attestation_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Attestation Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance reliability',
    evidenceFields: ['guardianRiskBand', 'governanceReliabilityScore', 'attestationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceReliabilityScore < 40,
  },
  {
    id: 'copilot_attestation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Attestation Strain',
    detailTemplate: 'Autonomous Co-Pilot while attestation strain is high',
    evidenceFields: ['copilotAutonomousActive', 'attestationStrainIndex', 'attestationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.attestationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_reliability',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Reliability',
    detailTemplate: 'Expiring contracts while governance reliability is low',
    evidenceFields: ['expiringContractCount', 'governanceReliabilityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceReliabilityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_17_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_17.length;


// --- source: monitor-rules-scale-wave-18.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_18: AdvisoryMonitorRule[] = [
  {
    id: 'verification_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Verification Strain High',
    detailTemplate: 'Verification strain is in the high band — reduce overlapping warn-only verification review demands',
    evidenceFields: ['verificationStrainIndex', 'governanceReliabilityScore', 'verificationIntegrityScore'],
    evaluate: s => s.verificationStrainIndex >= 70,
  },
  {
    id: 'verification_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Verification Strain Elevated',
    detailTemplate: 'Verification strain is elevated — expect slower verification review across turns',
    evidenceFields: ['verificationStrainIndex', 'attestationStrainIndex'],
    evaluate: s => s.verificationStrainIndex >= 45 && s.verificationStrainIndex < 70,
  },
  {
    id: 'verification_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Verification Integrity Low',
    detailTemplate: 'Verification integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['verificationIntegrityScore', 'verificationStrainIndex', 'attestationIntegrityScore'],
    evaluate: s => s.verificationIntegrityScore < 35,
  },
  {
    id: 'verification_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Verification While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate verification integrity',
    evidenceFields: ['verificationIntegrityScore', 'copilotAutonomousActive', 'verificationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.verificationIntegrityScore >= 35 && s.verificationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_validity_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Validity Low',
    detailTemplate: 'Little governance validity remains for warn-only verification oversight across turns',
    evidenceFields: ['governanceValidityScore', 'verificationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceValidityScore < 35,
  },
  {
    id: 'governance_validity_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Validity While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance validity',
    evidenceFields: ['governanceValidityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceValidityScore >= 35 && s.governanceValidityScore < 55,
  },
  {
    id: 'verification_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Verification Envelope Pressured',
    detailTemplate: 'Verification strain and low verification integrity align in the pressured envelope band',
    evidenceFields: ['verificationStrainIndex', 'verificationIntegrityScore', 'governanceValidityScore'],
    evaluate: s => s.verificationStrainIndex >= 55 && s.verificationIntegrityScore < 50,
  },
  {
    id: 'rival_verification_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Verification Strain',
    detailTemplate: 'Rival victory progress plus elevated verification strain',
    evidenceFields: ['rivalVictoryProgressPct', 'verificationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.verificationStrainIndex >= 50,
  },
  {
    id: 'team_plan_verification_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Verification Strain',
    detailTemplate: 'Pending team plan while verification strain is elevated',
    evidenceFields: ['teamPlanPending', 'verificationStrainIndex', 'governanceValidityScore'],
    evaluate: s => s.teamPlanPending && s.verificationStrainIndex >= 55,
  },
  {
    id: 'guardian_verification_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Verification Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance validity',
    evidenceFields: ['guardianRiskBand', 'governanceValidityScore', 'verificationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceValidityScore < 40,
  },
  {
    id: 'copilot_verification_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Verification Strain',
    detailTemplate: 'Autonomous Co-Pilot while verification strain is high',
    evidenceFields: ['copilotAutonomousActive', 'verificationStrainIndex', 'verificationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.verificationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_validity',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Validity',
    detailTemplate: 'Expiring contracts while governance validity is low',
    evidenceFields: ['expiringContractCount', 'governanceValidityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceValidityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_18_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_18.length;


// --- source: monitor-rules-scale-wave-19.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_19: AdvisoryMonitorRule[] = [
  {
    id: 'validation_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Validation Strain High',
    detailTemplate: 'Validation strain is in the high band — reduce overlapping warn-only validation review demands',
    evidenceFields: ['validationStrainIndex', 'governanceValidityScore', 'validationIntegrityScore'],
    evaluate: s => s.validationStrainIndex >= 70,
  },
  {
    id: 'validation_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Validation Strain Elevated',
    detailTemplate: 'Validation strain is elevated — expect slower validation review across turns',
    evidenceFields: ['validationStrainIndex', 'verificationStrainIndex'],
    evaluate: s => s.validationStrainIndex >= 45 && s.validationStrainIndex < 70,
  },
  {
    id: 'validation_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Validation Integrity Low',
    detailTemplate: 'Validation integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['validationIntegrityScore', 'validationStrainIndex', 'verificationIntegrityScore'],
    evaluate: s => s.validationIntegrityScore < 35,
  },
  {
    id: 'validation_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Validation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate validation integrity',
    evidenceFields: ['validationIntegrityScore', 'copilotAutonomousActive', 'validationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.validationIntegrityScore >= 35 && s.validationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_soundness_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Soundness Low',
    detailTemplate: 'Little governance soundness remains for warn-only validation oversight across turns',
    evidenceFields: ['governanceSoundnessScore', 'validationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceSoundnessScore < 35,
  },
  {
    id: 'governance_soundness_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Soundness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance soundness',
    evidenceFields: ['governanceSoundnessScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceSoundnessScore >= 35 && s.governanceSoundnessScore < 55,
  },
  {
    id: 'validation_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Validation Envelope Pressured',
    detailTemplate: 'Validation strain and low validation integrity align in the pressured envelope band',
    evidenceFields: ['validationStrainIndex', 'validationIntegrityScore', 'governanceSoundnessScore'],
    evaluate: s => s.validationStrainIndex >= 55 && s.validationIntegrityScore < 50,
  },
  {
    id: 'rival_validation_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Validation Strain',
    detailTemplate: 'Rival victory progress plus elevated validation strain',
    evidenceFields: ['rivalVictoryProgressPct', 'validationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.validationStrainIndex >= 50,
  },
  {
    id: 'team_plan_validation_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Validation Strain',
    detailTemplate: 'Pending team plan while validation strain is elevated',
    evidenceFields: ['teamPlanPending', 'validationStrainIndex', 'governanceSoundnessScore'],
    evaluate: s => s.teamPlanPending && s.validationStrainIndex >= 55,
  },
  {
    id: 'guardian_validation_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Validation Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance soundness',
    evidenceFields: ['guardianRiskBand', 'governanceSoundnessScore', 'validationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceSoundnessScore < 40,
  },
  {
    id: 'copilot_validation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Validation Strain',
    detailTemplate: 'Autonomous Co-Pilot while validation strain is high',
    evidenceFields: ['copilotAutonomousActive', 'validationStrainIndex', 'validationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.validationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_soundness',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Soundness',
    detailTemplate: 'Expiring contracts while governance soundness is low',
    evidenceFields: ['expiringContractCount', 'governanceSoundnessScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceSoundnessScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_19_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_19.length;


// --- source: monitor-rules-scale-wave-20.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_20: AdvisoryMonitorRule[] = [
  {
    id: 'certification_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Certification Strain High',
    detailTemplate: 'Certification strain is in the high band — reduce overlapping warn-only certification review demands',
    evidenceFields: ['certificationStrainIndex', 'governanceSoundnessScore', 'certificationIntegrityScore'],
    evaluate: s => s.certificationStrainIndex >= 70,
  },
  {
    id: 'certification_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Certification Strain Elevated',
    detailTemplate: 'Certification strain is elevated — expect slower certification review across turns',
    evidenceFields: ['certificationStrainIndex', 'validationStrainIndex'],
    evaluate: s => s.certificationStrainIndex >= 45 && s.certificationStrainIndex < 70,
  },
  {
    id: 'certification_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Certification Integrity Low',
    detailTemplate: 'Certification integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['certificationIntegrityScore', 'certificationStrainIndex', 'validationIntegrityScore'],
    evaluate: s => s.certificationIntegrityScore < 35,
  },
  {
    id: 'certification_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Certification While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate certification integrity',
    evidenceFields: ['certificationIntegrityScore', 'copilotAutonomousActive', 'certificationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.certificationIntegrityScore >= 35 && s.certificationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_authenticity_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Authenticity Low',
    detailTemplate: 'Little governance authenticity remains for warn-only certification oversight across turns',
    evidenceFields: ['governanceAuthenticityScore', 'certificationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceAuthenticityScore < 35,
  },
  {
    id: 'governance_authenticity_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Authenticity While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance authenticity',
    evidenceFields: ['governanceAuthenticityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceAuthenticityScore >= 35 && s.governanceAuthenticityScore < 55,
  },
  {
    id: 'certification_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Certification Envelope Pressured',
    detailTemplate: 'Certification strain and low certification integrity align in the pressured envelope band',
    evidenceFields: ['certificationStrainIndex', 'certificationIntegrityScore', 'governanceAuthenticityScore'],
    evaluate: s => s.certificationStrainIndex >= 55 && s.certificationIntegrityScore < 50,
  },
  {
    id: 'rival_certification_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Certification Strain',
    detailTemplate: 'Rival victory progress plus elevated certification strain',
    evidenceFields: ['rivalVictoryProgressPct', 'certificationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.certificationStrainIndex >= 50,
  },
  {
    id: 'team_plan_certification_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Certification Strain',
    detailTemplate: 'Pending team plan while certification strain is elevated',
    evidenceFields: ['teamPlanPending', 'certificationStrainIndex', 'governanceAuthenticityScore'],
    evaluate: s => s.teamPlanPending && s.certificationStrainIndex >= 55,
  },
  {
    id: 'guardian_certification_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Certification Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance authenticity',
    evidenceFields: ['guardianRiskBand', 'governanceAuthenticityScore', 'certificationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceAuthenticityScore < 40,
  },
  {
    id: 'copilot_certification_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Certification Strain',
    detailTemplate: 'Autonomous Co-Pilot while certification strain is high',
    evidenceFields: ['copilotAutonomousActive', 'certificationStrainIndex', 'certificationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.certificationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_authenticity',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Authenticity',
    detailTemplate: 'Expiring contracts while governance authenticity is low',
    evidenceFields: ['expiringContractCount', 'governanceAuthenticityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceAuthenticityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_20_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_20.length;


// --- source: monitor-rules-scale-wave-21.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_21: AdvisoryMonitorRule[] = [
  {
    id: 'accreditation_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Accreditation Strain High',
    detailTemplate: 'Accreditation strain is in the high band — reduce overlapping warn-only accreditation review demands',
    evidenceFields: ['accreditationStrainIndex', 'governanceAuthenticityScore', 'accreditationIntegrityScore'],
    evaluate: s => s.accreditationStrainIndex >= 70,
  },
  {
    id: 'accreditation_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Accreditation Strain Elevated',
    detailTemplate: 'Accreditation strain is elevated — expect slower accreditation review across turns',
    evidenceFields: ['accreditationStrainIndex', 'certificationStrainIndex'],
    evaluate: s => s.accreditationStrainIndex >= 45 && s.accreditationStrainIndex < 70,
  },
  {
    id: 'accreditation_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Accreditation Integrity Low',
    detailTemplate: 'Accreditation integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['accreditationIntegrityScore', 'accreditationStrainIndex', 'certificationIntegrityScore'],
    evaluate: s => s.accreditationIntegrityScore < 35,
  },
  {
    id: 'accreditation_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Accreditation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate accreditation integrity',
    evidenceFields: ['accreditationIntegrityScore', 'copilotAutonomousActive', 'accreditationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.accreditationIntegrityScore >= 35 && s.accreditationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_credibility_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Credibility Low',
    detailTemplate: 'Little governance credibility remains for warn-only accreditation oversight across turns',
    evidenceFields: ['governanceCredibilityScore', 'accreditationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceCredibilityScore < 35,
  },
  {
    id: 'governance_credibility_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Credibility While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance credibility',
    evidenceFields: ['governanceCredibilityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceCredibilityScore >= 35 && s.governanceCredibilityScore < 55,
  },
  {
    id: 'accreditation_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Accreditation Envelope Pressured',
    detailTemplate: 'Accreditation strain and low accreditation integrity align in the pressured envelope band',
    evidenceFields: ['accreditationStrainIndex', 'accreditationIntegrityScore', 'governanceCredibilityScore'],
    evaluate: s => s.accreditationStrainIndex >= 55 && s.accreditationIntegrityScore < 50,
  },
  {
    id: 'rival_accreditation_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Accreditation Strain',
    detailTemplate: 'Rival victory progress plus elevated accreditation strain',
    evidenceFields: ['rivalVictoryProgressPct', 'accreditationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.accreditationStrainIndex >= 50,
  },
  {
    id: 'team_plan_accreditation_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Accreditation Strain',
    detailTemplate: 'Pending team plan while accreditation strain is elevated',
    evidenceFields: ['teamPlanPending', 'accreditationStrainIndex', 'governanceCredibilityScore'],
    evaluate: s => s.teamPlanPending && s.accreditationStrainIndex >= 55,
  },
  {
    id: 'guardian_accreditation_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Accreditation Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance credibility',
    evidenceFields: ['guardianRiskBand', 'governanceCredibilityScore', 'accreditationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceCredibilityScore < 40,
  },
  {
    id: 'copilot_accreditation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Accreditation Strain',
    detailTemplate: 'Autonomous Co-Pilot while accreditation strain is high',
    evidenceFields: ['copilotAutonomousActive', 'accreditationStrainIndex', 'accreditationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.accreditationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_credibility',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Credibility',
    detailTemplate: 'Expiring contracts while governance credibility is low',
    evidenceFields: ['expiringContractCount', 'governanceCredibilityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceCredibilityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_21_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_21.length;


// --- source: monitor-rules-scale-wave-22.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_22: AdvisoryMonitorRule[] = [
  {
    id: 'endorsement_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Endorsement Strain High',
    detailTemplate: 'Endorsement strain is in the high band — reduce overlapping warn-only endorsement review demands',
    evidenceFields: ['endorsementStrainIndex', 'governanceCredibilityScore', 'endorsementIntegrityScore'],
    evaluate: s => s.endorsementStrainIndex >= 70,
  },
  {
    id: 'endorsement_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Endorsement Strain Elevated',
    detailTemplate: 'Endorsement strain is elevated — expect slower endorsement review across turns',
    evidenceFields: ['endorsementStrainIndex', 'accreditationStrainIndex'],
    evaluate: s => s.endorsementStrainIndex >= 45 && s.endorsementStrainIndex < 70,
  },
  {
    id: 'endorsement_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Endorsement Integrity Low',
    detailTemplate: 'Endorsement integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['endorsementIntegrityScore', 'endorsementStrainIndex', 'accreditationIntegrityScore'],
    evaluate: s => s.endorsementIntegrityScore < 35,
  },
  {
    id: 'endorsement_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Endorsement While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate endorsement integrity',
    evidenceFields: ['endorsementIntegrityScore', 'copilotAutonomousActive', 'endorsementStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.endorsementIntegrityScore >= 35 && s.endorsementIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_trustworthiness_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Trustworthiness Low',
    detailTemplate: 'Little governance trustworthiness remains for warn-only endorsement oversight across turns',
    evidenceFields: ['governanceTrustworthinessScore', 'endorsementStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceTrustworthinessScore < 35,
  },
  {
    id: 'governance_trustworthiness_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Trustworthiness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance trustworthiness',
    evidenceFields: ['governanceTrustworthinessScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceTrustworthinessScore >= 35 && s.governanceTrustworthinessScore < 55,
  },
  {
    id: 'endorsement_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Endorsement Envelope Pressured',
    detailTemplate: 'Endorsement strain and low endorsement integrity align in the pressured envelope band',
    evidenceFields: ['endorsementStrainIndex', 'endorsementIntegrityScore', 'governanceTrustworthinessScore'],
    evaluate: s => s.endorsementStrainIndex >= 55 && s.endorsementIntegrityScore < 50,
  },
  {
    id: 'rival_endorsement_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Endorsement Strain',
    detailTemplate: 'Rival victory progress plus elevated endorsement strain',
    evidenceFields: ['rivalVictoryProgressPct', 'endorsementStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.endorsementStrainIndex >= 50,
  },
  {
    id: 'team_plan_endorsement_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Endorsement Strain',
    detailTemplate: 'Pending team plan while endorsement strain is elevated',
    evidenceFields: ['teamPlanPending', 'endorsementStrainIndex', 'governanceTrustworthinessScore'],
    evaluate: s => s.teamPlanPending && s.endorsementStrainIndex >= 55,
  },
  {
    id: 'guardian_endorsement_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Endorsement Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance trustworthiness',
    evidenceFields: ['guardianRiskBand', 'governanceTrustworthinessScore', 'endorsementStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceTrustworthinessScore < 40,
  },
  {
    id: 'copilot_endorsement_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Endorsement Strain',
    detailTemplate: 'Autonomous Co-Pilot while endorsement strain is high',
    evidenceFields: ['copilotAutonomousActive', 'endorsementStrainIndex', 'endorsementIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.endorsementStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_trustworthiness',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Trustworthiness',
    detailTemplate: 'Expiring contracts while governance trustworthiness is low',
    evidenceFields: ['expiringContractCount', 'governanceTrustworthinessScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceTrustworthinessScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_22_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_22.length;


// --- source: monitor-rules-scale-wave-23.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_23: AdvisoryMonitorRule[] = [
  {
    id: 'ratification_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Ratification Strain High',
    detailTemplate: 'Ratification strain is in the high band — reduce overlapping warn-only ratification review demands',
    evidenceFields: ['ratificationStrainIndex', 'governanceTrustworthinessScore', 'ratificationIntegrityScore'],
    evaluate: s => s.ratificationStrainIndex >= 70,
  },
  {
    id: 'ratification_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Ratification Strain Elevated',
    detailTemplate: 'Ratification strain is elevated — expect slower ratification review across turns',
    evidenceFields: ['ratificationStrainIndex', 'endorsementStrainIndex'],
    evaluate: s => s.ratificationStrainIndex >= 45 && s.ratificationStrainIndex < 70,
  },
  {
    id: 'ratification_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Ratification Integrity Low',
    detailTemplate: 'Ratification integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['ratificationIntegrityScore', 'ratificationStrainIndex', 'endorsementIntegrityScore'],
    evaluate: s => s.ratificationIntegrityScore < 35,
  },
  {
    id: 'ratification_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Ratification While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate ratification integrity',
    evidenceFields: ['ratificationIntegrityScore', 'copilotAutonomousActive', 'ratificationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.ratificationIntegrityScore >= 35 && s.ratificationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_dependability_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Dependability Low',
    detailTemplate: 'Little governance dependability remains for warn-only ratification oversight across turns',
    evidenceFields: ['governanceDependabilityScore', 'ratificationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceDependabilityScore < 35,
  },
  {
    id: 'governance_dependability_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Dependability While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance dependability',
    evidenceFields: ['governanceDependabilityScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceDependabilityScore >= 35 && s.governanceDependabilityScore < 55,
  },
  {
    id: 'ratification_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Ratification Envelope Pressured',
    detailTemplate: 'Ratification strain and low ratification integrity align in the pressured envelope band',
    evidenceFields: ['ratificationStrainIndex', 'ratificationIntegrityScore', 'governanceDependabilityScore'],
    evaluate: s => s.ratificationStrainIndex >= 55 && s.ratificationIntegrityScore < 50,
  },
  {
    id: 'rival_ratification_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Ratification Strain',
    detailTemplate: 'Rival victory progress plus elevated ratification strain',
    evidenceFields: ['rivalVictoryProgressPct', 'ratificationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.ratificationStrainIndex >= 50,
  },
  {
    id: 'team_plan_ratification_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Ratification Strain',
    detailTemplate: 'Pending team plan while ratification strain is elevated',
    evidenceFields: ['teamPlanPending', 'ratificationStrainIndex', 'governanceDependabilityScore'],
    evaluate: s => s.teamPlanPending && s.ratificationStrainIndex >= 55,
  },
  {
    id: 'guardian_ratification_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Ratification Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance dependability',
    evidenceFields: ['guardianRiskBand', 'governanceDependabilityScore', 'ratificationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceDependabilityScore < 40,
  },
  {
    id: 'copilot_ratification_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Ratification Strain',
    detailTemplate: 'Autonomous Co-Pilot while ratification strain is high',
    evidenceFields: ['copilotAutonomousActive', 'ratificationStrainIndex', 'ratificationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.ratificationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_dependability',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Dependability',
    detailTemplate: 'Expiring contracts while governance dependability is low',
    evidenceFields: ['expiringContractCount', 'governanceDependabilityScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceDependabilityScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_23_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_23.length;


// --- source: monitor-rules-scale-wave-24.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_24: AdvisoryMonitorRule[] = [
  {
    id: 'authorization_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Authorization Strain High',
    detailTemplate: 'Authorization strain is in the high band — reduce overlapping warn-only authorization review demands',
    evidenceFields: ['authorizationStrainIndex', 'governanceDependabilityScore', 'authorizationIntegrityScore'],
    evaluate: s => s.authorizationStrainIndex >= 70,
  },
  {
    id: 'authorization_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Authorization Strain Elevated',
    detailTemplate: 'Authorization strain is elevated — expect slower authorization review across turns',
    evidenceFields: ['authorizationStrainIndex', 'ratificationStrainIndex'],
    evaluate: s => s.authorizationStrainIndex >= 45 && s.authorizationStrainIndex < 70,
  },
  {
    id: 'authorization_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Authorization Integrity Low',
    detailTemplate: 'Authorization integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['authorizationIntegrityScore', 'authorizationStrainIndex', 'ratificationIntegrityScore'],
    evaluate: s => s.authorizationIntegrityScore < 35,
  },
  {
    id: 'authorization_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Authorization While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate authorization integrity',
    evidenceFields: ['authorizationIntegrityScore', 'copilotAutonomousActive', 'authorizationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.authorizationIntegrityScore >= 35 && s.authorizationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_steadfastness_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Steadfastness Low',
    detailTemplate: 'Little governance steadfastness remains for warn-only authorization oversight across turns',
    evidenceFields: ['governanceSteadfastnessScore', 'authorizationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceSteadfastnessScore < 35,
  },
  {
    id: 'governance_steadfastness_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Steadfastness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance steadfastness',
    evidenceFields: ['governanceSteadfastnessScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceSteadfastnessScore >= 35 && s.governanceSteadfastnessScore < 55,
  },
  {
    id: 'authorization_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Authorization Envelope Pressured',
    detailTemplate: 'Authorization strain and low authorization integrity align in the pressured envelope band',
    evidenceFields: ['authorizationStrainIndex', 'authorizationIntegrityScore', 'governanceSteadfastnessScore'],
    evaluate: s => s.authorizationStrainIndex >= 55 && s.authorizationIntegrityScore < 50,
  },
  {
    id: 'rival_authorization_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Authorization Strain',
    detailTemplate: 'Rival victory progress plus elevated authorization strain',
    evidenceFields: ['rivalVictoryProgressPct', 'authorizationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.authorizationStrainIndex >= 50,
  },
  {
    id: 'team_plan_authorization_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Authorization Strain',
    detailTemplate: 'Pending team plan while authorization strain is elevated',
    evidenceFields: ['teamPlanPending', 'authorizationStrainIndex', 'governanceSteadfastnessScore'],
    evaluate: s => s.teamPlanPending && s.authorizationStrainIndex >= 55,
  },
  {
    id: 'guardian_authorization_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Authorization Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance steadfastness',
    evidenceFields: ['guardianRiskBand', 'governanceSteadfastnessScore', 'authorizationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceSteadfastnessScore < 40,
  },
  {
    id: 'copilot_authorization_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Authorization Strain',
    detailTemplate: 'Autonomous Co-Pilot while authorization strain is high',
    evidenceFields: ['copilotAutonomousActive', 'authorizationStrainIndex', 'authorizationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.authorizationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_steadfastness',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Steadfastness',
    detailTemplate: 'Expiring contracts while governance steadfastness is low',
    evidenceFields: ['expiringContractCount', 'governanceSteadfastnessScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceSteadfastnessScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_24_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_24.length;


// --- source: monitor-rules-scale-wave-25.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_25: AdvisoryMonitorRule[] = [
  {
    id: 'affirmation_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Affirmation Strain High',
    detailTemplate: 'Affirmation strain is in the high band — reduce overlapping warn-only affirmation review demands',
    evidenceFields: ['affirmationStrainIndex', 'governanceSteadfastnessScore', 'affirmationIntegrityScore'],
    evaluate: s => s.affirmationStrainIndex >= 70,
  },
  {
    id: 'affirmation_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Affirmation Strain Elevated',
    detailTemplate: 'Affirmation strain is elevated — expect slower affirmation review across turns',
    evidenceFields: ['affirmationStrainIndex', 'authorizationStrainIndex'],
    evaluate: s => s.affirmationStrainIndex >= 45 && s.affirmationStrainIndex < 70,
  },
  {
    id: 'affirmation_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Affirmation Integrity Low',
    detailTemplate: 'Affirmation integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['affirmationIntegrityScore', 'affirmationStrainIndex', 'authorizationIntegrityScore'],
    evaluate: s => s.affirmationIntegrityScore < 35,
  },
  {
    id: 'affirmation_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Affirmation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate affirmation integrity',
    evidenceFields: ['affirmationIntegrityScore', 'copilotAutonomousActive', 'affirmationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.affirmationIntegrityScore >= 35 && s.affirmationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_resoluteness_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Resoluteness Low',
    detailTemplate: 'Little governance resoluteness remains for warn-only affirmation oversight across turns',
    evidenceFields: ['governanceResolutenessScore', 'affirmationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceResolutenessScore < 35,
  },
  {
    id: 'governance_resoluteness_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Resoluteness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance resoluteness',
    evidenceFields: ['governanceResolutenessScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceResolutenessScore >= 35 && s.governanceResolutenessScore < 55,
  },
  {
    id: 'affirmation_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Affirmation Envelope Pressured',
    detailTemplate: 'Affirmation strain and low affirmation integrity align in the pressured envelope band',
    evidenceFields: ['affirmationStrainIndex', 'affirmationIntegrityScore', 'governanceResolutenessScore'],
    evaluate: s => s.affirmationStrainIndex >= 55 && s.affirmationIntegrityScore < 50,
  },
  {
    id: 'rival_affirmation_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Affirmation Strain',
    detailTemplate: 'Rival victory progress plus elevated affirmation strain',
    evidenceFields: ['rivalVictoryProgressPct', 'affirmationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.affirmationStrainIndex >= 50,
  },
  {
    id: 'team_plan_affirmation_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Affirmation Strain',
    detailTemplate: 'Pending team plan while affirmation strain is elevated',
    evidenceFields: ['teamPlanPending', 'affirmationStrainIndex', 'governanceResolutenessScore'],
    evaluate: s => s.teamPlanPending && s.affirmationStrainIndex >= 55,
  },
  {
    id: 'guardian_affirmation_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Affirmation Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance resoluteness',
    evidenceFields: ['guardianRiskBand', 'governanceResolutenessScore', 'affirmationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceResolutenessScore < 40,
  },
  {
    id: 'copilot_affirmation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Affirmation Strain',
    detailTemplate: 'Autonomous Co-Pilot while affirmation strain is high',
    evidenceFields: ['copilotAutonomousActive', 'affirmationStrainIndex', 'affirmationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.affirmationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_resoluteness',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Resoluteness',
    detailTemplate: 'Expiring contracts while governance resoluteness is low',
    evidenceFields: ['expiringContractCount', 'governanceResolutenessScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceResolutenessScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_25_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_25.length;


// --- source: monitor-rules-scale-wave-26.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_26: AdvisoryMonitorRule[] = [
  {
    id: 'sanction_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Sanction Strain High',
    detailTemplate: 'Sanction strain is in the high band — reduce overlapping warn-only sanction review demands',
    evidenceFields: ['sanctionStrainIndex', 'governanceResolutenessScore', 'sanctionIntegrityScore'],
    evaluate: s => s.sanctionStrainIndex >= 70,
  },
  {
    id: 'sanction_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Sanction Strain Elevated',
    detailTemplate: 'Sanction strain is elevated — expect slower sanction review across turns',
    evidenceFields: ['sanctionStrainIndex', 'affirmationStrainIndex'],
    evaluate: s => s.sanctionStrainIndex >= 45 && s.sanctionStrainIndex < 70,
  },
  {
    id: 'sanction_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Sanction Integrity Low',
    detailTemplate: 'Sanction integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['sanctionIntegrityScore', 'sanctionStrainIndex', 'affirmationIntegrityScore'],
    evaluate: s => s.sanctionIntegrityScore < 35,
  },
  {
    id: 'sanction_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Sanction While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate sanction integrity',
    evidenceFields: ['sanctionIntegrityScore', 'copilotAutonomousActive', 'sanctionStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.sanctionIntegrityScore >= 35 && s.sanctionIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_firmness_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Firmness Low',
    detailTemplate: 'Little governance firmness remains for warn-only sanction oversight across turns',
    evidenceFields: ['governanceFirmnessScore', 'sanctionStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceFirmnessScore < 35,
  },
  {
    id: 'governance_firmness_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Firmness While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance firmness',
    evidenceFields: ['governanceFirmnessScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceFirmnessScore >= 35 && s.governanceFirmnessScore < 55,
  },
  {
    id: 'sanction_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Sanction Envelope Pressured',
    detailTemplate: 'Sanction strain and low sanction integrity align in the pressured envelope band',
    evidenceFields: ['sanctionStrainIndex', 'sanctionIntegrityScore', 'governanceFirmnessScore'],
    evaluate: s => s.sanctionStrainIndex >= 55 && s.sanctionIntegrityScore < 50,
  },
  {
    id: 'rival_sanction_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Sanction Strain',
    detailTemplate: 'Rival victory progress plus elevated sanction strain',
    evidenceFields: ['rivalVictoryProgressPct', 'sanctionStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.sanctionStrainIndex >= 50,
  },
  {
    id: 'team_plan_sanction_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Sanction Strain',
    detailTemplate: 'Pending team plan while sanction strain is elevated',
    evidenceFields: ['teamPlanPending', 'sanctionStrainIndex', 'governanceFirmnessScore'],
    evaluate: s => s.teamPlanPending && s.sanctionStrainIndex >= 55,
  },
  {
    id: 'guardian_sanction_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Sanction Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance firmness',
    evidenceFields: ['guardianRiskBand', 'governanceFirmnessScore', 'sanctionStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceFirmnessScore < 40,
  },
  {
    id: 'copilot_sanction_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Sanction Strain',
    detailTemplate: 'Autonomous Co-Pilot while sanction strain is high',
    evidenceFields: ['copilotAutonomousActive', 'sanctionStrainIndex', 'sanctionIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.sanctionStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_firmness',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Firmness',
    detailTemplate: 'Expiring contracts while governance firmness is low',
    evidenceFields: ['expiringContractCount', 'governanceFirmnessScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceFirmnessScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_26_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_26.length;


// --- source: monitor-rules-scale-wave-27.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_27: AdvisoryMonitorRule[] = [
  {
    id: 'warrant_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Warrant Strain High',
    detailTemplate: 'Warrant strain is in the high band — reduce overlapping warn-only warrant review demands',
    evidenceFields: ['warrantStrainIndex', 'governanceFirmnessScore', 'warrantIntegrityScore'],
    evaluate: s => s.warrantStrainIndex >= 70,
  },
  {
    id: 'warrant_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Warrant Strain Elevated',
    detailTemplate: 'Warrant strain is elevated — expect slower warrant review across turns',
    evidenceFields: ['warrantStrainIndex', 'sanctionStrainIndex'],
    evaluate: s => s.warrantStrainIndex >= 45 && s.warrantStrainIndex < 70,
  },
  {
    id: 'warrant_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Warrant Integrity Low',
    detailTemplate: 'Warrant integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['warrantIntegrityScore', 'warrantStrainIndex', 'sanctionIntegrityScore'],
    evaluate: s => s.warrantIntegrityScore < 35,
  },
  {
    id: 'warrant_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Warrant While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate warrant integrity',
    evidenceFields: ['warrantIntegrityScore', 'copilotAutonomousActive', 'warrantStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.warrantIntegrityScore >= 35 && s.warrantIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_constancy_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Constancy Low',
    detailTemplate: 'Little governance constancy remains for warn-only warrant oversight across turns',
    evidenceFields: ['governanceConstancyScore', 'warrantStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceConstancyScore < 35,
  },
  {
    id: 'governance_constancy_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Constancy While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance constancy',
    evidenceFields: ['governanceConstancyScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceConstancyScore >= 35 && s.governanceConstancyScore < 55,
  },
  {
    id: 'warrant_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Warrant Envelope Pressured',
    detailTemplate: 'Warrant strain and low warrant integrity align in the pressured envelope band',
    evidenceFields: ['warrantStrainIndex', 'warrantIntegrityScore', 'governanceConstancyScore'],
    evaluate: s => s.warrantStrainIndex >= 55 && s.warrantIntegrityScore < 50,
  },
  {
    id: 'rival_warrant_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Warrant Strain',
    detailTemplate: 'Rival victory progress plus elevated warrant strain',
    evidenceFields: ['rivalVictoryProgressPct', 'warrantStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.warrantStrainIndex >= 50,
  },
  {
    id: 'team_plan_warrant_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Warrant Strain',
    detailTemplate: 'Pending team plan while warrant strain is elevated',
    evidenceFields: ['teamPlanPending', 'warrantStrainIndex', 'governanceConstancyScore'],
    evaluate: s => s.teamPlanPending && s.warrantStrainIndex >= 55,
  },
  {
    id: 'guardian_warrant_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Warrant Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance constancy',
    evidenceFields: ['guardianRiskBand', 'governanceConstancyScore', 'warrantStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceConstancyScore < 40,
  },
  {
    id: 'copilot_warrant_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Warrant Strain',
    detailTemplate: 'Autonomous Co-Pilot while warrant strain is high',
    evidenceFields: ['copilotAutonomousActive', 'warrantStrainIndex', 'warrantIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.warrantStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_constancy',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Constancy',
    detailTemplate: 'Expiring contracts while governance constancy is low',
    evidenceFields: ['expiringContractCount', 'governanceConstancyScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceConstancyScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_27_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_27.length;


// --- source: monitor-rules-scale-wave-28.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_28: AdvisoryMonitorRule[] = [
  {
    id: 'clearance_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Clearance Strain High',
    detailTemplate: 'Clearance strain is in the high band — reduce overlapping warn-only clearance review demands',
    evidenceFields: ['clearanceStrainIndex', 'governanceConstancyScore', 'clearanceIntegrityScore'],
    evaluate: s => s.clearanceStrainIndex >= 70,
  },
  {
    id: 'clearance_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Clearance Strain Elevated',
    detailTemplate: 'Clearance strain is elevated — expect slower clearance review across turns',
    evidenceFields: ['clearanceStrainIndex', 'warrantStrainIndex'],
    evaluate: s => s.clearanceStrainIndex >= 45 && s.clearanceStrainIndex < 70,
  },
  {
    id: 'clearance_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Clearance Integrity Low',
    detailTemplate: 'Clearance integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['clearanceIntegrityScore', 'clearanceStrainIndex', 'warrantIntegrityScore'],
    evaluate: s => s.clearanceIntegrityScore < 35,
  },
  {
    id: 'clearance_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Clearance While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate clearance integrity',
    evidenceFields: ['clearanceIntegrityScore', 'copilotAutonomousActive', 'clearanceStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.clearanceIntegrityScore >= 35 && s.clearanceIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_perseverance_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Perseverance Low',
    detailTemplate: 'Little governance perseverance remains for warn-only clearance oversight across turns',
    evidenceFields: ['governancePerseveranceScore', 'clearanceStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governancePerseveranceScore < 35,
  },
  {
    id: 'governance_perseverance_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Perseverance While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance perseverance',
    evidenceFields: ['governancePerseveranceScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governancePerseveranceScore >= 35 && s.governancePerseveranceScore < 55,
  },
  {
    id: 'clearance_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Clearance Envelope Pressured',
    detailTemplate: 'Clearance strain and low clearance integrity align in the pressured envelope band',
    evidenceFields: ['clearanceStrainIndex', 'clearanceIntegrityScore', 'governancePerseveranceScore'],
    evaluate: s => s.clearanceStrainIndex >= 55 && s.clearanceIntegrityScore < 50,
  },
  {
    id: 'rival_clearance_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Clearance Strain',
    detailTemplate: 'Rival victory progress plus elevated clearance strain',
    evidenceFields: ['rivalVictoryProgressPct', 'clearanceStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.clearanceStrainIndex >= 50,
  },
  {
    id: 'team_plan_clearance_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Clearance Strain',
    detailTemplate: 'Pending team plan while clearance strain is elevated',
    evidenceFields: ['teamPlanPending', 'clearanceStrainIndex', 'governancePerseveranceScore'],
    evaluate: s => s.teamPlanPending && s.clearanceStrainIndex >= 55,
  },
  {
    id: 'guardian_clearance_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Clearance Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance perseverance',
    evidenceFields: ['guardianRiskBand', 'governancePerseveranceScore', 'clearanceStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governancePerseveranceScore < 40,
  },
  {
    id: 'copilot_clearance_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Clearance Strain',
    detailTemplate: 'Autonomous Co-Pilot while clearance strain is high',
    evidenceFields: ['copilotAutonomousActive', 'clearanceStrainIndex', 'clearanceIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.clearanceStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_perseverance',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Perseverance',
    detailTemplate: 'Expiring contracts while governance perseverance is low',
    evidenceFields: ['expiringContractCount', 'governancePerseveranceScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governancePerseveranceScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_28_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_28.length;


// --- source: monitor-rules-scale-wave-29.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_29: AdvisoryMonitorRule[] = [
  {
    id: 'dispensation_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Dispensation Strain High',
    detailTemplate: 'Dispensation strain is in the high band — reduce overlapping warn-only dispensation review demands',
    evidenceFields: ['dispensationStrainIndex', 'governancePerseveranceScore', 'dispensationIntegrityScore'],
    evaluate: s => s.dispensationStrainIndex >= 70,
  },
  {
    id: 'dispensation_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Dispensation Strain Elevated',
    detailTemplate: 'Dispensation strain is elevated — expect slower dispensation review across turns',
    evidenceFields: ['dispensationStrainIndex', 'clearanceStrainIndex'],
    evaluate: s => s.dispensationStrainIndex >= 45 && s.dispensationStrainIndex < 70,
  },
  {
    id: 'dispensation_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Dispensation Integrity Low',
    detailTemplate: 'Dispensation integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['dispensationIntegrityScore', 'dispensationStrainIndex', 'clearanceIntegrityScore'],
    evaluate: s => s.dispensationIntegrityScore < 35,
  },
  {
    id: 'dispensation_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Dispensation While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate dispensation integrity',
    evidenceFields: ['dispensationIntegrityScore', 'copilotAutonomousActive', 'dispensationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.dispensationIntegrityScore >= 35 && s.dispensationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_fortitude_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Fortitude Low',
    detailTemplate: 'Little governance fortitude remains for warn-only dispensation oversight across turns',
    evidenceFields: ['governanceFortitudeScore', 'dispensationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceFortitudeScore < 35,
  },
  {
    id: 'governance_fortitude_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Fortitude While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance fortitude',
    evidenceFields: ['governanceFortitudeScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceFortitudeScore >= 35 && s.governanceFortitudeScore < 55,
  },
  {
    id: 'dispensation_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Dispensation Envelope Pressured',
    detailTemplate: 'Dispensation strain and low dispensation integrity align in the pressured envelope band',
    evidenceFields: ['dispensationStrainIndex', 'dispensationIntegrityScore', 'governanceFortitudeScore'],
    evaluate: s => s.dispensationStrainIndex >= 55 && s.dispensationIntegrityScore < 50,
  },
  {
    id: 'rival_dispensation_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Dispensation Strain',
    detailTemplate: 'Rival victory progress plus elevated dispensation strain',
    evidenceFields: ['rivalVictoryProgressPct', 'dispensationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.dispensationStrainIndex >= 50,
  },
  {
    id: 'team_plan_dispensation_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Dispensation Strain',
    detailTemplate: 'Pending team plan while dispensation strain is elevated',
    evidenceFields: ['teamPlanPending', 'dispensationStrainIndex', 'governanceFortitudeScore'],
    evaluate: s => s.teamPlanPending && s.dispensationStrainIndex >= 55,
  },
  {
    id: 'guardian_dispensation_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Dispensation Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance fortitude',
    evidenceFields: ['guardianRiskBand', 'governanceFortitudeScore', 'dispensationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceFortitudeScore < 40,
  },
  {
    id: 'copilot_dispensation_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Dispensation Strain',
    detailTemplate: 'Autonomous Co-Pilot while dispensation strain is high',
    evidenceFields: ['copilotAutonomousActive', 'dispensationStrainIndex', 'dispensationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.dispensationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_fortitude',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Fortitude',
    detailTemplate: 'Expiring contracts while governance fortitude is low',
    evidenceFields: ['expiringContractCount', 'governanceFortitudeScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceFortitudeScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_29_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_29.length;


// --- source: monitor-rules-scale-wave-30.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_30: AdvisoryMonitorRule[] = [
  {
    id: 'indulgence_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Indulgence Strain High',
    detailTemplate: 'Indulgence strain is in the high band — reduce overlapping warn-only indulgence review demands',
    evidenceFields: ['indulgenceStrainIndex', 'governanceFortitudeScore', 'indulgenceIntegrityScore'],
    evaluate: s => s.indulgenceStrainIndex >= 70,
  },
  {
    id: 'indulgence_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Indulgence Strain Elevated',
    detailTemplate: 'Indulgence strain is elevated — expect slower indulgence review across turns',
    evidenceFields: ['indulgenceStrainIndex', 'dispensationStrainIndex'],
    evaluate: s => s.indulgenceStrainIndex >= 45 && s.indulgenceStrainIndex < 70,
  },
  {
    id: 'indulgence_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Indulgence Integrity Low',
    detailTemplate: 'Indulgence integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['indulgenceIntegrityScore', 'indulgenceStrainIndex', 'dispensationIntegrityScore'],
    evaluate: s => s.indulgenceIntegrityScore < 35,
  },
  {
    id: 'indulgence_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Indulgence While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate indulgence integrity',
    evidenceFields: ['indulgenceIntegrityScore', 'copilotAutonomousActive', 'indulgenceStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.indulgenceIntegrityScore >= 35 && s.indulgenceIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_vigor_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Vigor Low',
    detailTemplate: 'Little governance vigor remains for warn-only indulgence oversight across turns',
    evidenceFields: ['governanceVigorScore', 'indulgenceStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceVigorScore < 35,
  },
  {
    id: 'governance_vigor_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Vigor While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance vigor',
    evidenceFields: ['governanceVigorScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceVigorScore >= 35 && s.governanceVigorScore < 55,
  },
  {
    id: 'indulgence_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Indulgence Envelope Pressured',
    detailTemplate: 'Indulgence strain and low indulgence integrity align in the pressured envelope band',
    evidenceFields: ['indulgenceStrainIndex', 'indulgenceIntegrityScore', 'governanceVigorScore'],
    evaluate: s => s.indulgenceStrainIndex >= 55 && s.indulgenceIntegrityScore < 50,
  },
  {
    id: 'rival_indulgence_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Indulgence Strain',
    detailTemplate: 'Rival victory progress plus elevated indulgence strain',
    evidenceFields: ['rivalVictoryProgressPct', 'indulgenceStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.indulgenceStrainIndex >= 50,
  },
  {
    id: 'team_plan_indulgence_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Indulgence Strain',
    detailTemplate: 'Pending team plan while indulgence strain is elevated',
    evidenceFields: ['teamPlanPending', 'indulgenceStrainIndex', 'governanceVigorScore'],
    evaluate: s => s.teamPlanPending && s.indulgenceStrainIndex >= 55,
  },
  {
    id: 'guardian_indulgence_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Indulgence Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance vigor',
    evidenceFields: ['guardianRiskBand', 'governanceVigorScore', 'indulgenceStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceVigorScore < 40,
  },
  {
    id: 'copilot_indulgence_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Indulgence Strain',
    detailTemplate: 'Autonomous Co-Pilot while indulgence strain is high',
    evidenceFields: ['copilotAutonomousActive', 'indulgenceStrainIndex', 'indulgenceIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.indulgenceStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_vigor',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Vigor',
    detailTemplate: 'Expiring contracts while governance vigor is low',
    evidenceFields: ['expiringContractCount', 'governanceVigorScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceVigorScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_30_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_30.length;


// --- source: monitor-rules-scale-wave-31.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_31: AdvisoryMonitorRule[] = [
  {
    id: 'exemption_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Exemption Strain High',
    detailTemplate: 'Exemption strain is in the high band — reduce overlapping warn-only exemption review demands',
    evidenceFields: ['exemptionStrainIndex', 'governanceVigorScore', 'exemptionIntegrityScore'],
    evaluate: s => s.exemptionStrainIndex >= 70,
  },
  {
    id: 'exemption_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Exemption Strain Elevated',
    detailTemplate: 'Exemption strain is elevated — expect slower exemption review across turns',
    evidenceFields: ['exemptionStrainIndex', 'indulgenceStrainIndex'],
    evaluate: s => s.exemptionStrainIndex >= 45 && s.exemptionStrainIndex < 70,
  },
  {
    id: 'exemption_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Exemption Integrity Low',
    detailTemplate: 'Exemption integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['exemptionIntegrityScore', 'exemptionStrainIndex', 'indulgenceIntegrityScore'],
    evaluate: s => s.exemptionIntegrityScore < 35,
  },
  {
    id: 'exemption_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Exemption While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate exemption integrity',
    evidenceFields: ['exemptionIntegrityScore', 'copilotAutonomousActive', 'exemptionStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.exemptionIntegrityScore >= 35 && s.exemptionIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_stamina_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Stamina Low',
    detailTemplate: 'Little governance stamina remains for warn-only exemption oversight across turns',
    evidenceFields: ['governanceStaminaScore', 'exemptionStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceStaminaScore < 35,
  },
  {
    id: 'governance_stamina_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Stamina While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance stamina',
    evidenceFields: ['governanceStaminaScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceStaminaScore >= 35 && s.governanceStaminaScore < 55,
  },
  {
    id: 'exemption_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Exemption Envelope Pressured',
    detailTemplate: 'Exemption strain and low exemption integrity align in the pressured envelope band',
    evidenceFields: ['exemptionStrainIndex', 'exemptionIntegrityScore', 'governanceStaminaScore'],
    evaluate: s => s.exemptionStrainIndex >= 55 && s.exemptionIntegrityScore < 50,
  },
  {
    id: 'rival_exemption_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Exemption Strain',
    detailTemplate: 'Rival victory progress plus elevated exemption strain',
    evidenceFields: ['rivalVictoryProgressPct', 'exemptionStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.exemptionStrainIndex >= 50,
  },
  {
    id: 'team_plan_exemption_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Exemption Strain',
    detailTemplate: 'Pending team plan while exemption strain is elevated',
    evidenceFields: ['teamPlanPending', 'exemptionStrainIndex', 'governanceStaminaScore'],
    evaluate: s => s.teamPlanPending && s.exemptionStrainIndex >= 55,
  },
  {
    id: 'guardian_exemption_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Exemption Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance stamina',
    evidenceFields: ['guardianRiskBand', 'governanceStaminaScore', 'exemptionStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceStaminaScore < 40,
  },
  {
    id: 'copilot_exemption_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Exemption Strain',
    detailTemplate: 'Autonomous Co-Pilot while exemption strain is high',
    evidenceFields: ['copilotAutonomousActive', 'exemptionStrainIndex', 'exemptionIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.exemptionStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_stamina',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Stamina',
    detailTemplate: 'Expiring contracts while governance stamina is low',
    evidenceFields: ['expiringContractCount', 'governanceStaminaScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceStaminaScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_31_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_31.length;


// --- source: monitor-rules-scale-wave-32.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_32: AdvisoryMonitorRule[] = [
  {
    id: 'remission_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Remission Strain High',
    detailTemplate: 'Remission strain is in the high band — reduce overlapping warn-only remission review demands',
    evidenceFields: ['remissionStrainIndex', 'governanceStaminaScore', 'remissionIntegrityScore'],
    evaluate: s => s.remissionStrainIndex >= 70,
  },
  {
    id: 'remission_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Remission Strain Elevated',
    detailTemplate: 'Remission strain is elevated — expect slower remission review across turns',
    evidenceFields: ['remissionStrainIndex', 'exemptionStrainIndex'],
    evaluate: s => s.remissionStrainIndex >= 45 && s.remissionStrainIndex < 70,
  },
  {
    id: 'remission_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Remission Integrity Low',
    detailTemplate: 'Remission integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['remissionIntegrityScore', 'remissionStrainIndex', 'exemptionIntegrityScore'],
    evaluate: s => s.remissionIntegrityScore < 35,
  },
  {
    id: 'remission_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Remission While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate remission integrity',
    evidenceFields: ['remissionIntegrityScore', 'copilotAutonomousActive', 'remissionStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.remissionIntegrityScore >= 35 && s.remissionIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_mettle_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Mettle Low',
    detailTemplate: 'Little governance mettle remains for warn-only remission oversight across turns',
    evidenceFields: ['governanceMettleScore', 'remissionStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceMettleScore < 35,
  },
  {
    id: 'governance_mettle_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Mettle While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance mettle',
    evidenceFields: ['governanceMettleScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceMettleScore >= 35 && s.governanceMettleScore < 55,
  },
  {
    id: 'remission_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Remission Envelope Pressured',
    detailTemplate: 'Remission strain and low remission integrity align in the pressured envelope band',
    evidenceFields: ['remissionStrainIndex', 'remissionIntegrityScore', 'governanceMettleScore'],
    evaluate: s => s.remissionStrainIndex >= 55 && s.remissionIntegrityScore < 50,
  },
  {
    id: 'rival_remission_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Remission Strain',
    detailTemplate: 'Rival victory progress plus elevated remission strain',
    evidenceFields: ['rivalVictoryProgressPct', 'remissionStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.remissionStrainIndex >= 50,
  },
  {
    id: 'team_plan_remission_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Remission Strain',
    detailTemplate: 'Pending team plan while remission strain is elevated',
    evidenceFields: ['teamPlanPending', 'remissionStrainIndex', 'governanceMettleScore'],
    evaluate: s => s.teamPlanPending && s.remissionStrainIndex >= 55,
  },
  {
    id: 'guardian_remission_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Remission Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance mettle',
    evidenceFields: ['guardianRiskBand', 'governanceMettleScore', 'remissionStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceMettleScore < 40,
  },
  {
    id: 'copilot_remission_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Remission Strain',
    detailTemplate: 'Autonomous Co-Pilot while remission strain is high',
    evidenceFields: ['copilotAutonomousActive', 'remissionStrainIndex', 'remissionIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.remissionStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_mettle',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Mettle',
    detailTemplate: 'Expiring contracts while governance mettle is low',
    evidenceFields: ['expiringContractCount', 'governanceMettleScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceMettleScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_32_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_32.length;


// --- source: monitor-rules-scale-wave-33.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_33: AdvisoryMonitorRule[] = [
  {
    id: 'absolution_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Absolution Strain High',
    detailTemplate: 'Absolution strain is in the high band — reduce overlapping warn-only absolution review demands',
    evidenceFields: ['absolutionStrainIndex', 'governanceMettleScore', 'absolutionIntegrityScore'],
    evaluate: s => s.absolutionStrainIndex >= 70,
  },
  {
    id: 'absolution_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Absolution Strain Elevated',
    detailTemplate: 'Absolution strain is elevated — expect slower absolution review across turns',
    evidenceFields: ['absolutionStrainIndex', 'remissionStrainIndex'],
    evaluate: s => s.absolutionStrainIndex >= 45 && s.absolutionStrainIndex < 70,
  },
  {
    id: 'absolution_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Absolution Integrity Low',
    detailTemplate: 'Absolution integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['absolutionIntegrityScore', 'absolutionStrainIndex', 'remissionIntegrityScore'],
    evaluate: s => s.absolutionIntegrityScore < 35,
  },
  {
    id: 'absolution_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Absolution While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate absolution integrity',
    evidenceFields: ['absolutionIntegrityScore', 'copilotAutonomousActive', 'absolutionStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.absolutionIntegrityScore >= 35 && s.absolutionIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_grit_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Grit Low',
    detailTemplate: 'Little governance grit remains for warn-only absolution oversight across turns',
    evidenceFields: ['governanceGritScore', 'absolutionStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceGritScore < 35,
  },
  {
    id: 'governance_grit_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Grit While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance grit',
    evidenceFields: ['governanceGritScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceGritScore >= 35 && s.governanceGritScore < 55,
  },
  {
    id: 'absolution_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Absolution Envelope Pressured',
    detailTemplate: 'Absolution strain and low absolution integrity align in the pressured envelope band',
    evidenceFields: ['absolutionStrainIndex', 'absolutionIntegrityScore', 'governanceGritScore'],
    evaluate: s => s.absolutionStrainIndex >= 55 && s.absolutionIntegrityScore < 50,
  },
  {
    id: 'rival_absolution_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Absolution Strain',
    detailTemplate: 'Rival victory progress plus elevated absolution strain',
    evidenceFields: ['rivalVictoryProgressPct', 'absolutionStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.absolutionStrainIndex >= 50,
  },
  {
    id: 'team_plan_absolution_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Absolution Strain',
    detailTemplate: 'Pending team plan while absolution strain is elevated',
    evidenceFields: ['teamPlanPending', 'absolutionStrainIndex', 'governanceGritScore'],
    evaluate: s => s.teamPlanPending && s.absolutionStrainIndex >= 55,
  },
  {
    id: 'guardian_absolution_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Absolution Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance grit',
    evidenceFields: ['guardianRiskBand', 'governanceGritScore', 'absolutionStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceGritScore < 40,
  },
  {
    id: 'copilot_absolution_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Absolution Strain',
    detailTemplate: 'Autonomous Co-Pilot while absolution strain is high',
    evidenceFields: ['copilotAutonomousActive', 'absolutionStrainIndex', 'absolutionIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.absolutionStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_grit',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Grit',
    detailTemplate: 'Expiring contracts while governance grit is low',
    evidenceFields: ['expiringContractCount', 'governanceGritScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceGritScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_33_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_33.length;


// --- source: monitor-rules-scale-wave-34.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_34: AdvisoryMonitorRule[] = [
  {
    id: 'amnesty_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Amnesty Strain High',
    detailTemplate: 'Amnesty strain is in the high band — reduce overlapping warn-only amnesty review demands',
    evidenceFields: ['amnestyStrainIndex', 'governanceGritScore', 'amnestyIntegrityScore'],
    evaluate: s => s.amnestyStrainIndex >= 70,
  },
  {
    id: 'amnesty_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Amnesty Strain Elevated',
    detailTemplate: 'Amnesty strain is elevated — expect slower amnesty review across turns',
    evidenceFields: ['amnestyStrainIndex', 'absolutionStrainIndex'],
    evaluate: s => s.amnestyStrainIndex >= 45 && s.amnestyStrainIndex < 70,
  },
  {
    id: 'amnesty_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Amnesty Integrity Low',
    detailTemplate: 'Amnesty integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['amnestyIntegrityScore', 'amnestyStrainIndex', 'absolutionIntegrityScore'],
    evaluate: s => s.amnestyIntegrityScore < 35,
  },
  {
    id: 'amnesty_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Amnesty While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate amnesty integrity',
    evidenceFields: ['amnestyIntegrityScore', 'copilotAutonomousActive', 'amnestyStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.amnestyIntegrityScore >= 35 && s.amnestyIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_resolve_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Resolve Low',
    detailTemplate: 'Little governance resolve remains for warn-only amnesty oversight across turns',
    evidenceFields: ['governanceResolveScore', 'amnestyStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceResolveScore < 35,
  },
  {
    id: 'governance_resolve_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Resolve While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance resolve',
    evidenceFields: ['governanceResolveScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceResolveScore >= 35 && s.governanceResolveScore < 55,
  },
  {
    id: 'amnesty_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Amnesty Envelope Pressured',
    detailTemplate: 'Amnesty strain and low amnesty integrity align in the pressured envelope band',
    evidenceFields: ['amnestyStrainIndex', 'amnestyIntegrityScore', 'governanceResolveScore'],
    evaluate: s => s.amnestyStrainIndex >= 55 && s.amnestyIntegrityScore < 50,
  },
  {
    id: 'rival_amnesty_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Amnesty Strain',
    detailTemplate: 'Rival victory progress plus elevated amnesty strain',
    evidenceFields: ['rivalVictoryProgressPct', 'amnestyStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.amnestyStrainIndex >= 50,
  },
  {
    id: 'team_plan_amnesty_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Amnesty Strain',
    detailTemplate: 'Pending team plan while amnesty strain is elevated',
    evidenceFields: ['teamPlanPending', 'amnestyStrainIndex', 'governanceResolveScore'],
    evaluate: s => s.teamPlanPending && s.amnestyStrainIndex >= 55,
  },
  {
    id: 'guardian_amnesty_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Amnesty Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance resolve',
    evidenceFields: ['guardianRiskBand', 'governanceResolveScore', 'amnestyStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceResolveScore < 40,
  },
  {
    id: 'copilot_amnesty_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Amnesty Strain',
    detailTemplate: 'Autonomous Co-Pilot while amnesty strain is high',
    evidenceFields: ['copilotAutonomousActive', 'amnestyStrainIndex', 'amnestyIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.amnestyStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_resolve',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Resolve',
    detailTemplate: 'Expiring contracts while governance resolve is low',
    evidenceFields: ['expiringContractCount', 'governanceResolveScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceResolveScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_34_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_34.length;


// --- source: monitor-rules-scale-wave-35.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_35: AdvisoryMonitorRule[] = [
  {
    id: 'pardon_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Pardon Strain High',
    detailTemplate: 'Pardon strain is in the high band — reduce overlapping warn-only pardon review demands',
    evidenceFields: ['pardonStrainIndex', 'governanceResolveScore', 'pardonIntegrityScore'],
    evaluate: s => s.pardonStrainIndex >= 70,
  },
  {
    id: 'pardon_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Pardon Strain Elevated',
    detailTemplate: 'Pardon strain is elevated — expect slower pardon review across turns',
    evidenceFields: ['pardonStrainIndex', 'amnestyStrainIndex'],
    evaluate: s => s.pardonStrainIndex >= 45 && s.pardonStrainIndex < 70,
  },
  {
    id: 'pardon_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Pardon Integrity Low',
    detailTemplate: 'Pardon integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['pardonIntegrityScore', 'pardonStrainIndex', 'amnestyIntegrityScore'],
    evaluate: s => s.pardonIntegrityScore < 35,
  },
  {
    id: 'pardon_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Pardon While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate pardon integrity',
    evidenceFields: ['pardonIntegrityScore', 'copilotAutonomousActive', 'pardonStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.pardonIntegrityScore >= 35 && s.pardonIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_zeal_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Zeal Low',
    detailTemplate: 'Little governance zeal remains for warn-only pardon oversight across turns',
    evidenceFields: ['governanceZealScore', 'pardonStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceZealScore < 35,
  },
  {
    id: 'governance_zeal_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Zeal While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance zeal',
    evidenceFields: ['governanceZealScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceZealScore >= 35 && s.governanceZealScore < 55,
  },
  {
    id: 'pardon_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Pardon Envelope Pressured',
    detailTemplate: 'Pardon strain and low pardon integrity align in the pressured envelope band',
    evidenceFields: ['pardonStrainIndex', 'pardonIntegrityScore', 'governanceZealScore'],
    evaluate: s => s.pardonStrainIndex >= 55 && s.pardonIntegrityScore < 50,
  },
  {
    id: 'rival_pardon_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Pardon Strain',
    detailTemplate: 'Rival victory progress plus elevated pardon strain',
    evidenceFields: ['rivalVictoryProgressPct', 'pardonStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.pardonStrainIndex >= 50,
  },
  {
    id: 'team_plan_pardon_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Pardon Strain',
    detailTemplate: 'Pending team plan while pardon strain is elevated',
    evidenceFields: ['teamPlanPending', 'pardonStrainIndex', 'governanceZealScore'],
    evaluate: s => s.teamPlanPending && s.pardonStrainIndex >= 55,
  },
  {
    id: 'guardian_pardon_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Pardon Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance zeal',
    evidenceFields: ['guardianRiskBand', 'governanceZealScore', 'pardonStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceZealScore < 40,
  },
  {
    id: 'copilot_pardon_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Pardon Strain',
    detailTemplate: 'Autonomous Co-Pilot while pardon strain is high',
    evidenceFields: ['copilotAutonomousActive', 'pardonStrainIndex', 'pardonIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.pardonStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_zeal',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Zeal',
    detailTemplate: 'Expiring contracts while governance zeal is low',
    evidenceFields: ['expiringContractCount', 'governanceZealScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceZealScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_35_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_35.length;


// --- source: monitor-rules-scale-wave-36.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_36: AdvisoryMonitorRule[] = [
  {
    id: 'clemency_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Clemency Strain High',
    detailTemplate: 'Clemency strain is in the high band — reduce overlapping warn-only clemency review demands',
    evidenceFields: ['clemencyStrainIndex', 'governanceZealScore', 'clemencyIntegrityScore'],
    evaluate: s => s.clemencyStrainIndex >= 70,
  },
  {
    id: 'clemency_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Clemency Strain Elevated',
    detailTemplate: 'Clemency strain is elevated — expect slower clemency review across turns',
    evidenceFields: ['clemencyStrainIndex', 'pardonStrainIndex'],
    evaluate: s => s.clemencyStrainIndex >= 45 && s.clemencyStrainIndex < 70,
  },
  {
    id: 'clemency_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Clemency Integrity Low',
    detailTemplate: 'Clemency integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['clemencyIntegrityScore', 'clemencyStrainIndex', 'pardonIntegrityScore'],
    evaluate: s => s.clemencyIntegrityScore < 35,
  },
  {
    id: 'clemency_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Clemency While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate clemency integrity',
    evidenceFields: ['clemencyIntegrityScore', 'copilotAutonomousActive', 'clemencyStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.clemencyIntegrityScore >= 35 && s.clemencyIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_pluck_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Pluck Low',
    detailTemplate: 'Little governance pluck remains for warn-only clemency oversight across turns',
    evidenceFields: ['governancePluckScore', 'clemencyStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governancePluckScore < 35,
  },
  {
    id: 'governance_pluck_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Pluck While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance pluck',
    evidenceFields: ['governancePluckScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governancePluckScore >= 35 && s.governancePluckScore < 55,
  },
  {
    id: 'clemency_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Clemency Envelope Pressured',
    detailTemplate: 'Clemency strain and low clemency integrity align in the pressured envelope band',
    evidenceFields: ['clemencyStrainIndex', 'clemencyIntegrityScore', 'governancePluckScore'],
    evaluate: s => s.clemencyStrainIndex >= 55 && s.clemencyIntegrityScore < 50,
  },
  {
    id: 'rival_clemency_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Clemency Strain',
    detailTemplate: 'Rival victory progress plus elevated clemency strain',
    evidenceFields: ['rivalVictoryProgressPct', 'clemencyStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.clemencyStrainIndex >= 50,
  },
  {
    id: 'team_plan_clemency_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Clemency Strain',
    detailTemplate: 'Pending team plan while clemency strain is elevated',
    evidenceFields: ['teamPlanPending', 'clemencyStrainIndex', 'governancePluckScore'],
    evaluate: s => s.teamPlanPending && s.clemencyStrainIndex >= 55,
  },
  {
    id: 'guardian_clemency_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Clemency Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance pluck',
    evidenceFields: ['guardianRiskBand', 'governancePluckScore', 'clemencyStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governancePluckScore < 40,
  },
  {
    id: 'copilot_clemency_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Clemency Strain',
    detailTemplate: 'Autonomous Co-Pilot while clemency strain is high',
    evidenceFields: ['copilotAutonomousActive', 'clemencyStrainIndex', 'clemencyIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.clemencyStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_pluck',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Pluck',
    detailTemplate: 'Expiring contracts while governance pluck is low',
    evidenceFields: ['expiringContractCount', 'governancePluckScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governancePluckScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_36_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_36.length;


// --- source: monitor-rules-scale-wave-37.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_37: AdvisoryMonitorRule[] = [
  {
    id: 'reprieve_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Reprieve Strain High',
    detailTemplate: 'Reprieve strain is in the high band — reduce overlapping warn-only reprieve review demands',
    evidenceFields: ['reprieveStrainIndex', 'governancePluckScore', 'reprieveIntegrityScore'],
    evaluate: s => s.reprieveStrainIndex >= 70,
  },
  {
    id: 'reprieve_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Reprieve Strain Elevated',
    detailTemplate: 'Reprieve strain is elevated — expect slower reprieve review across turns',
    evidenceFields: ['reprieveStrainIndex', 'clemencyStrainIndex'],
    evaluate: s => s.reprieveStrainIndex >= 45 && s.reprieveStrainIndex < 70,
  },
  {
    id: 'reprieve_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Reprieve Integrity Low',
    detailTemplate: 'Reprieve integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['reprieveIntegrityScore', 'reprieveStrainIndex', 'clemencyIntegrityScore'],
    evaluate: s => s.reprieveIntegrityScore < 35,
  },
  {
    id: 'reprieve_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Reprieve While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate reprieve integrity',
    evidenceFields: ['reprieveIntegrityScore', 'copilotAutonomousActive', 'reprieveStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.reprieveIntegrityScore >= 35 && s.reprieveIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_nerve_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Nerve Low',
    detailTemplate: 'Little governance nerve remains for warn-only reprieve oversight across turns',
    evidenceFields: ['governanceNerveScore', 'reprieveStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceNerveScore < 35,
  },
  {
    id: 'governance_nerve_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Nerve While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance nerve',
    evidenceFields: ['governanceNerveScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceNerveScore >= 35 && s.governanceNerveScore < 55,
  },
  {
    id: 'reprieve_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Reprieve Envelope Pressured',
    detailTemplate: 'Reprieve strain and low reprieve integrity align in the pressured envelope band',
    evidenceFields: ['reprieveStrainIndex', 'reprieveIntegrityScore', 'governanceNerveScore'],
    evaluate: s => s.reprieveStrainIndex >= 55 && s.reprieveIntegrityScore < 50,
  },
  {
    id: 'rival_reprieve_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Reprieve Strain',
    detailTemplate: 'Rival victory progress plus elevated reprieve strain',
    evidenceFields: ['rivalVictoryProgressPct', 'reprieveStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.reprieveStrainIndex >= 50,
  },
  {
    id: 'team_plan_reprieve_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Reprieve Strain',
    detailTemplate: 'Pending team plan while reprieve strain is elevated',
    evidenceFields: ['teamPlanPending', 'reprieveStrainIndex', 'governanceNerveScore'],
    evaluate: s => s.teamPlanPending && s.reprieveStrainIndex >= 55,
  },
  {
    id: 'guardian_reprieve_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Reprieve Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance nerve',
    evidenceFields: ['guardianRiskBand', 'governanceNerveScore', 'reprieveStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceNerveScore < 40,
  },
  {
    id: 'copilot_reprieve_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Reprieve Strain',
    detailTemplate: 'Autonomous Co-Pilot while reprieve strain is high',
    evidenceFields: ['copilotAutonomousActive', 'reprieveStrainIndex', 'reprieveIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.reprieveStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_nerve',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Nerve',
    detailTemplate: 'Expiring contracts while governance nerve is low',
    evidenceFields: ['expiringContractCount', 'governanceNerveScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceNerveScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_37_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_37.length;


// --- source: monitor-rules-scale-wave-38.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_38: AdvisoryMonitorRule[] = [
  {
    id: 'acquittal_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Acquittal Strain High',
    detailTemplate: 'Acquittal strain is in the high band — reduce overlapping warn-only acquittal review demands',
    evidenceFields: ['acquittalStrainIndex', 'governanceNerveScore', 'acquittalIntegrityScore'],
    evaluate: s => s.acquittalStrainIndex >= 70,
  },
  {
    id: 'acquittal_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Acquittal Strain Elevated',
    detailTemplate: 'Acquittal strain is elevated — expect slower acquittal review across turns',
    evidenceFields: ['acquittalStrainIndex', 'reprieveStrainIndex'],
    evaluate: s => s.acquittalStrainIndex >= 45 && s.acquittalStrainIndex < 70,
  },
  {
    id: 'acquittal_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Acquittal Integrity Low',
    detailTemplate: 'Acquittal integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['acquittalIntegrityScore', 'acquittalStrainIndex', 'reprieveIntegrityScore'],
    evaluate: s => s.acquittalIntegrityScore < 35,
  },
  {
    id: 'acquittal_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Acquittal While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate acquittal integrity',
    evidenceFields: ['acquittalIntegrityScore', 'copilotAutonomousActive', 'acquittalStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.acquittalIntegrityScore >= 35 && s.acquittalIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_moxie_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Moxie Low',
    detailTemplate: 'Little governance moxie remains for warn-only acquittal oversight across turns',
    evidenceFields: ['governanceMoxieScore', 'acquittalStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceMoxieScore < 35,
  },
  {
    id: 'governance_moxie_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Moxie While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance moxie',
    evidenceFields: ['governanceMoxieScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceMoxieScore >= 35 && s.governanceMoxieScore < 55,
  },
  {
    id: 'acquittal_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Acquittal Envelope Pressured',
    detailTemplate: 'Acquittal strain and low acquittal integrity align in the pressured envelope band',
    evidenceFields: ['acquittalStrainIndex', 'acquittalIntegrityScore', 'governanceMoxieScore'],
    evaluate: s => s.acquittalStrainIndex >= 55 && s.acquittalIntegrityScore < 50,
  },
  {
    id: 'rival_acquittal_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Acquittal Strain',
    detailTemplate: 'Rival victory progress plus elevated acquittal strain',
    evidenceFields: ['rivalVictoryProgressPct', 'acquittalStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.acquittalStrainIndex >= 50,
  },
  {
    id: 'team_plan_acquittal_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Acquittal Strain',
    detailTemplate: 'Pending team plan while acquittal strain is elevated',
    evidenceFields: ['teamPlanPending', 'acquittalStrainIndex', 'governanceMoxieScore'],
    evaluate: s => s.teamPlanPending && s.acquittalStrainIndex >= 55,
  },
  {
    id: 'guardian_acquittal_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Acquittal Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance moxie',
    evidenceFields: ['guardianRiskBand', 'governanceMoxieScore', 'acquittalStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceMoxieScore < 40,
  },
  {
    id: 'copilot_acquittal_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Acquittal Strain',
    detailTemplate: 'Autonomous Co-Pilot while acquittal strain is high',
    evidenceFields: ['copilotAutonomousActive', 'acquittalStrainIndex', 'acquittalIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.acquittalStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_moxie',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Moxie',
    detailTemplate: 'Expiring contracts while governance moxie is low',
    evidenceFields: ['expiringContractCount', 'governanceMoxieScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceMoxieScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_38_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_38.length;


// --- source: monitor-rules-scale-wave-39.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_39: AdvisoryMonitorRule[] = [
  {
    id: 'exoneration_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Exoneration Strain High',
    detailTemplate: 'Exoneration strain is in the high band — reduce overlapping warn-only exoneration review demands',
    evidenceFields: ['exonerationStrainIndex', 'governanceMoxieScore', 'exonerationIntegrityScore'],
    evaluate: s => s.exonerationStrainIndex >= 70,
  },
  {
    id: 'exoneration_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Exoneration Strain Elevated',
    detailTemplate: 'Exoneration strain is elevated — expect slower exoneration review across turns',
    evidenceFields: ['exonerationStrainIndex', 'acquittalStrainIndex'],
    evaluate: s => s.exonerationStrainIndex >= 45 && s.exonerationStrainIndex < 70,
  },
  {
    id: 'exoneration_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Exoneration Integrity Low',
    detailTemplate: 'Exoneration integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['exonerationIntegrityScore', 'exonerationStrainIndex', 'acquittalIntegrityScore'],
    evaluate: s => s.exonerationIntegrityScore < 35,
  },
  {
    id: 'exoneration_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Exoneration While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate exoneration integrity',
    evidenceFields: ['exonerationIntegrityScore', 'copilotAutonomousActive', 'exonerationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.exonerationIntegrityScore >= 35 && s.exonerationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_spunk_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Spunk Low',
    detailTemplate: 'Little governance spunk remains for warn-only exoneration oversight across turns',
    evidenceFields: ['governanceSpunkScore', 'exonerationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceSpunkScore < 35,
  },
  {
    id: 'governance_spunk_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Spunk While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance spunk',
    evidenceFields: ['governanceSpunkScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceSpunkScore >= 35 && s.governanceSpunkScore < 55,
  },
  {
    id: 'exoneration_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Exoneration Envelope Pressured',
    detailTemplate: 'Exoneration strain and low exoneration integrity align in the pressured envelope band',
    evidenceFields: ['exonerationStrainIndex', 'exonerationIntegrityScore', 'governanceSpunkScore'],
    evaluate: s => s.exonerationStrainIndex >= 55 && s.exonerationIntegrityScore < 50,
  },
  {
    id: 'rival_exoneration_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Exoneration Strain',
    detailTemplate: 'Rival victory progress plus elevated exoneration strain',
    evidenceFields: ['rivalVictoryProgressPct', 'exonerationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.exonerationStrainIndex >= 50,
  },
  {
    id: 'team_plan_exoneration_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Exoneration Strain',
    detailTemplate: 'Pending team plan while exoneration strain is elevated',
    evidenceFields: ['teamPlanPending', 'exonerationStrainIndex', 'governanceSpunkScore'],
    evaluate: s => s.teamPlanPending && s.exonerationStrainIndex >= 55,
  },
  {
    id: 'guardian_exoneration_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Exoneration Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance spunk',
    evidenceFields: ['guardianRiskBand', 'governanceSpunkScore', 'exonerationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceSpunkScore < 40,
  },
  {
    id: 'copilot_exoneration_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Exoneration Strain',
    detailTemplate: 'Autonomous Co-Pilot while exoneration strain is high',
    evidenceFields: ['copilotAutonomousActive', 'exonerationStrainIndex', 'exonerationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.exonerationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_spunk',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Spunk',
    detailTemplate: 'Expiring contracts while governance spunk is low',
    evidenceFields: ['expiringContractCount', 'governanceSpunkScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceSpunkScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_39_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_39.length;


// --- source: monitor-rules-scale-wave-40.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_40: AdvisoryMonitorRule[] = [
  {
    id: 'vindication_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Vindication Strain High',
    detailTemplate: 'Vindication strain is in the high band — reduce overlapping warn-only vindication review demands',
    evidenceFields: ['vindicationStrainIndex', 'governanceSpunkScore', 'vindicationIntegrityScore'],
    evaluate: s => s.vindicationStrainIndex >= 70,
  },
  {
    id: 'vindication_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Vindication Strain Elevated',
    detailTemplate: 'Vindication strain is elevated — expect slower vindication review across turns',
    evidenceFields: ['vindicationStrainIndex', 'exonerationStrainIndex'],
    evaluate: s => s.vindicationStrainIndex >= 45 && s.vindicationStrainIndex < 70,
  },
  {
    id: 'vindication_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Vindication Integrity Low',
    detailTemplate: 'Vindication integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['vindicationIntegrityScore', 'vindicationStrainIndex', 'exonerationIntegrityScore'],
    evaluate: s => s.vindicationIntegrityScore < 35,
  },
  {
    id: 'vindication_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Vindication While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate vindication integrity',
    evidenceFields: ['vindicationIntegrityScore', 'copilotAutonomousActive', 'vindicationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.vindicationIntegrityScore >= 35 && s.vindicationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_dash_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Dash Low',
    detailTemplate: 'Little governance dash remains for warn-only vindication oversight across turns',
    evidenceFields: ['governanceDashScore', 'vindicationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceDashScore < 35,
  },
  {
    id: 'governance_dash_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Dash While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance dash',
    evidenceFields: ['governanceDashScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceDashScore >= 35 && s.governanceDashScore < 55,
  },
  {
    id: 'vindication_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Vindication Envelope Pressured',
    detailTemplate: 'Vindication strain and low vindication integrity align in the pressured envelope band',
    evidenceFields: ['vindicationStrainIndex', 'vindicationIntegrityScore', 'governanceDashScore'],
    evaluate: s => s.vindicationStrainIndex >= 55 && s.vindicationIntegrityScore < 50,
  },
  {
    id: 'rival_vindication_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Vindication Strain',
    detailTemplate: 'Rival victory progress plus elevated vindication strain',
    evidenceFields: ['rivalVictoryProgressPct', 'vindicationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.vindicationStrainIndex >= 50,
  },
  {
    id: 'team_plan_vindication_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Vindication Strain',
    detailTemplate: 'Pending team plan while vindication strain is elevated',
    evidenceFields: ['teamPlanPending', 'vindicationStrainIndex', 'governanceDashScore'],
    evaluate: s => s.teamPlanPending && s.vindicationStrainIndex >= 55,
  },
  {
    id: 'guardian_vindication_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Vindication Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance dash',
    evidenceFields: ['guardianRiskBand', 'governanceDashScore', 'vindicationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceDashScore < 40,
  },
  {
    id: 'copilot_vindication_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Vindication Strain',
    detailTemplate: 'Autonomous Co-Pilot while vindication strain is high',
    evidenceFields: ['copilotAutonomousActive', 'vindicationStrainIndex', 'vindicationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.vindicationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_dash',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Dash',
    detailTemplate: 'Expiring contracts while governance dash is low',
    evidenceFields: ['expiringContractCount', 'governanceDashScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceDashScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_40_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_40.length;


// --- source: monitor-rules-scale-wave-41.ts ---

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_41: AdvisoryMonitorRule[] = [
  {
    id: 'justification_strain_high',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Justification Strain High',
    detailTemplate: 'Justification strain is in the high band — reduce overlapping warn-only justification review demands',
    evidenceFields: ['justificationStrainIndex', 'governanceDashScore', 'justificationIntegrityScore'],
    evaluate: s => s.justificationStrainIndex >= 70,
  },
  {
    id: 'justification_strain_elevated',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Justification Strain Elevated',
    detailTemplate: 'Justification strain is elevated — expect slower justification review across turns',
    evidenceFields: ['justificationStrainIndex', 'vindicationStrainIndex'],
    evaluate: s => s.justificationStrainIndex >= 45 && s.justificationStrainIndex < 70,
  },
  {
    id: 'justification_integrity_low',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Justification Integrity Low',
    detailTemplate: 'Justification integrity is critically low — defer stacked autonomous actions',
    evidenceFields: ['justificationIntegrityScore', 'justificationStrainIndex', 'vindicationIntegrityScore'],
    evaluate: s => s.justificationIntegrityScore < 35,
  },
  {
    id: 'justification_integrity_fragile_autonomous',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Fragile Justification While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate justification integrity',
    evidenceFields: ['justificationIntegrityScore', 'copilotAutonomousActive', 'justificationStrainIndex'],
    evaluate: s => s.copilotAutonomousActive && s.justificationIntegrityScore >= 35 && s.justificationIntegrityScore < 55,
    followUp: 'Advisory only — review Guardian protection and Co-Pilot authority manually.',
  },
  {
    id: 'governance_brio_low',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Governance Brio Low',
    detailTemplate: 'Little governance brio remains for warn-only justification oversight across turns',
    evidenceFields: ['governanceBrioScore', 'justificationStrainIndex', 'recoveryHeadroomScore'],
    evaluate: s => s.governanceBrioScore < 35,
  },
  {
    id: 'governance_brio_fragile_autonomous',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Fragile Brio While Autonomous',
    detailTemplate: 'Autonomous Co-Pilot with only moderate governance brio',
    evidenceFields: ['governanceBrioScore', 'copilotAutonomousActive', 'operatorBandwidthScore'],
    evaluate: s => s.copilotAutonomousActive && s.governanceBrioScore >= 35 && s.governanceBrioScore < 55,
  },
  {
    id: 'justification_envelope_pressured',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Justification Envelope Pressured',
    detailTemplate: 'Justification strain and low justification integrity align in the pressured envelope band',
    evidenceFields: ['justificationStrainIndex', 'justificationIntegrityScore', 'governanceBrioScore'],
    evaluate: s => s.justificationStrainIndex >= 55 && s.justificationIntegrityScore < 50,
  },
  {
    id: 'rival_justification_strain',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Pressure Justification Strain',
    detailTemplate: 'Rival victory progress plus elevated justification strain',
    evidenceFields: ['rivalVictoryProgressPct', 'justificationStrainIndex', 'victoryThresholdPct'],
    evaluate: s =>
      s.rivalVictoryProgressPct !== null &&
      s.victoryThresholdPct !== null &&
      s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85 &&
      s.justificationStrainIndex >= 50,
  },
  {
    id: 'team_plan_justification_strain',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Under Justification Strain',
    detailTemplate: 'Pending team plan while justification strain is elevated',
    evidenceFields: ['teamPlanPending', 'justificationStrainIndex', 'governanceBrioScore'],
    evaluate: s => s.teamPlanPending && s.justificationStrainIndex >= 55,
  },
  {
    id: 'guardian_justification_envelope_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Justification Envelope Critical',
    detailTemplate: 'Critical Guardian band with low governance brio',
    evidenceFields: ['guardianRiskBand', 'governanceBrioScore', 'justificationStrainIndex'],
    evaluate: s => s.guardianRiskBand === 'critical' && s.governanceBrioScore < 40,
  },
  {
    id: 'copilot_justification_autonomous',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Autonomous Session Justification Strain',
    detailTemplate: 'Autonomous Co-Pilot while justification strain is high',
    evidenceFields: ['copilotAutonomousActive', 'justificationStrainIndex', 'justificationIntegrityScore'],
    evaluate: s => s.copilotAutonomousActive && s.justificationStrainIndex >= 55,
  },
  {
    id: 'contracts_governance_brio',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contracts Under Low Governance Brio',
    detailTemplate: 'Expiring contracts while governance brio is low',
    evidenceFields: ['expiringContractCount', 'governanceBrioScore', 'actionBurnPressure'],
    evaluate: s => s.expiringContractCount > 0 && s.governanceBrioScore < 45,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_41_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_41.length;


// --- source: monitor-rules.ts ---

export type { AdvisoryMonitorRule };

export const ADVISORY_MONITOR_RULES: AdvisoryMonitorRule[] = [
  {
    id: 'cash_below_reserve',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Cash Below Reserve',
    detailTemplate: 'Cash is below your Co-Pilot minimum reserve floor',
    evidenceFields: ['cash', 'minCashReserve'],
    evaluate: s => s.cash < s.minCashReserve,
  },
  {
    id: 'cash_runway_short',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Cash Runway Short',
    detailTemplate: 'Projected runway under 3 turns at current burn',
    evidenceFields: ['cash', 'minCashReserve'],
    evaluate: s => s.cash > 0 && s.cash < s.minCashReserve * 3,
  },
  {
    id: 'debt_service_pressure',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Debt Service Pressure',
    detailTemplate: 'Loan payments may exceed next-turn income',
    evidenceFields: ['debt', 'cash'],
    evaluate: s => s.debt > s.cash * 0.5,
  },
  {
    id: 'reserve_floor_unset',
    category: 'liquidity',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Reserve Floor Unset',
    detailTemplate: 'No minimum cash reserve configured for Co-Pilot',
    evidenceFields: ['minCashReserve'],
    evaluate: s => s.minCashReserve <= 0,
  },
  {
    id: 'ap_exhausted',
    category: 'actions',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Ap Exhausted',
    detailTemplate: 'No action points remain — end turn or wait',
    evidenceFields: ['apRemaining'],
    evaluate: s => s.apRemaining <= 0,
  },
  {
    id: 'ap_single_remaining',
    category: 'actions',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Ap Single Remaining',
    detailTemplate: 'One action left — spend deliberately',
    evidenceFields: ['apRemaining'],
    evaluate: s => s.apRemaining === 1,
  },
  {
    id: 'actions_per_day_mismatch',
    category: 'actions',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Actions Per Day Mismatch',
    detailTemplate: 'Action usage pattern differs from daily budget',
    evidenceFields: ['actionsUsedThisTurn', 'apPerDay'],
    evaluate: s => s.actionsUsedThisTurn > s.apPerDay,
  },
  {
    id: 'copilot_holding_control',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Copilot Holding Control',
    detailTemplate: 'Co-Pilot is executing — Take Control to act yourself',
    evidenceFields: ['copilotHoldsControl'],
    evaluate: s => s.copilotHoldsControl,
    followUp: 'Use Take Control in the Co-Pilot panel.',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.coPilot' },
  },
  {
    id: 'copilot_autonomous_without_start',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Copilot Autonomous Without Start',
    detailTemplate: 'Autonomous mode selected but Co-Pilot not started',
    evidenceFields: ['copilotAuthorityMode', 'copilotAutonomousActive'],
    evaluate: s => s.copilotAuthorityMode === 'autonomous' && !s.copilotAutonomousActive,
  },
  {
    id: 'takeover_session_stale',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Takeover Session Stale',
    detailTemplate: 'Takeover session age exceeds safe threshold',
    evidenceFields: ['takeoverSessionActive', 'takeoverSessionAgeTurns'],
    evaluate: s => s.takeoverSessionActive && s.takeoverSessionAgeTurns >= 5,
  },
  {
    id: 'copilot_blocked_continues',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Copilot Blocked Continues',
    detailTemplate: 'Co-Pilot hit blocked-action limit — review permissions',
    evidenceFields: ['blockedContinueCount'],
    evaluate: s => s.blockedContinueCount >= COPILOT_MAX_BLOCKED_CONTINUES,
  },
  {
    id: 'authority_escalation_pending',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Authority Escalation Pending',
    detailTemplate: 'A higher authority mode was requested but not confirmed',
    evidenceFields: ['copilotAuthorityMode', 'copilotEnabled'],
    evaluate: s => s.copilotAuthorityMode === 'assist' && s.copilotEnabled,
  },
  {
    id: 'guardian_disabled',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Disabled',
    detailTemplate: 'Guardian AI is off — mistake protection inactive',
    evidenceFields: ['guardianEnabled'],
    evaluate: s => !s.guardianEnabled,
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'guardian_notify_only',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Notify Only',
    detailTemplate: 'Guardian is notify-only — confirmations still required for blocks',
    evidenceFields: ['guardianEnabled', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianResponseMode === 'notify_only',
  },
  {
    id: 'guardian_recent_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian Recent Critical',
    detailTemplate: 'Recent critical Guardian evaluation on record',
    evidenceFields: ['guardianReplayCount', 'guardianProtectionLevel'],
    evaluate: s => s.guardianReplayCount > 0 && s.guardianProtectionLevel !== 'off',
  },
  {
    id: 'guardian_replay_backlog',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Replay Backlog',
    detailTemplate: 'Guardian replay log growing — verify determinism in LAB',
    evidenceFields: ['guardianReplayCount'],
    evaluate: s => s.guardianReplayCount > 50,
  },
  {
    id: 'contract_expiring_soon',
    category: 'contracts',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Contract Expiring Soon',
    detailTemplate: 'An active contract expires within 2 turns',
    evidenceFields: ['expiringContractCount'],
    evaluate: s => s.expiringContractCount > 0,
  },
  {
    id: 'contract_failure_risk',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contract Failure Risk',
    detailTemplate: 'Contract progress behind schedule',
    evidenceFields: ['activeContractCount', 'expiringContractCount'],
    evaluate: s => s.activeContractCount > 0 && s.expiringContractCount > 0,
  },
  {
    id: 'travel_high_cost',
    category: 'travel',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Travel High Cost',
    detailTemplate: 'Next travel exceeds 25% of liquid cash',
    evidenceFields: ['maxSpendPerAction', 'cash'],
    evaluate: s => s.cash > 0 && s.maxSpendPerAction > s.cash * 0.25,
  },
  {
    id: 'stranded_wrong_region',
    category: 'travel',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Stranded Wrong Region',
    detailTemplate: 'Objective region differs from current location',
    evidenceFields: ['objectiveRegion', 'region'],
    evaluate: s => Boolean(s.objectiveRegion && s.objectiveRegion !== s.region),
  },
  {
    id: 'team_plan_pending_approval',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Pending Approval',
    detailTemplate: 'Team strategic plan awaits human approval',
    evidenceFields: ['teamPlanPending'],
    evaluate: s => s.teamPlanPending,
  },
  {
    id: 'team_spending_cap_near',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Spending Cap Near',
    detailTemplate: 'Team spend approaching configured cap',
    evidenceFields: ['cash', 'maxSpendPerAction'],
    evaluate: s => s.cash < s.maxSpendPerAction * 2,
  },
  ...ADVISORY_MONITOR_RULES_EXPANSION,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_2,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_3,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_4,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_5,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_6,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_7,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_8,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_9,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_10,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_11,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_12,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_13,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_14,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_15,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_16,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_17,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_18,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_19,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_20,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_21,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_22,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_23,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_24,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_25,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_26,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_27,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_28,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_29,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_30,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_31,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_32,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_33,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_34,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_35,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_36,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_37,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_38,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_39,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_40,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_41,
];

export function getAdvisoryMonitorRuleById(id: string): AdvisoryMonitorRule | undefined {
  return ADVISORY_MONITOR_RULES.find(r => r.id === id);
}


// --- source: objective-context.ts ---

export interface ParsedObjectiveContext {
  objectiveActive: boolean;
  objectivePrimaryLabel: string | null;
  objectiveTargetRegion: string | null;
  objectiveProgressPct: number | null;
  objectiveTurnsRemaining: number | null;
  playerInObjectiveRegion: boolean;
  rivalVictoryProgressPct: number | null;
  victoryThresholdPct: number;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function clampPct(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function pickPrimaryObjective(gs: Record<string, unknown>): Record<string, unknown> | null {
  const direct = gs.activePrimaryObjective || gs.currentPrimaryObjective;
  if (direct && typeof direct === 'object') return direct as Record<string, unknown>;

  const mission = (gs.activeMission || gs.currentMission || gs.missionState) as Record<string, unknown> | undefined;
  if (mission && typeof mission === 'object') {
    const objs = mission.objectives;
    if (Array.isArray(objs)) {
      const primary = objs.find(
        (o: unknown) =>
          o &&
          typeof o === 'object' &&
          ((o as Record<string, unknown>).isMandatory !== false && (o as Record<string, unknown>).completed !== true)
      );
      if (primary && typeof primary === 'object') return primary as Record<string, unknown>;
    }
    if (typeof mission.primaryObjective === 'object') return mission.primaryObjective as Record<string, unknown>;
  }

  const lists = [gs.primaryObjectives, gs.objectives, gs.scenarioObjectives];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const row = list.find(
      (o: unknown) => o && typeof o === 'object' && (o as Record<string, unknown>).completed !== true
    );
    if (row && typeof row === 'object') return row as Record<string, unknown>;
  }
  return null;
}

function objectiveProgressPct(obj: Record<string, unknown> | null): number | null {
  if (!obj) return null;
  if (typeof obj.progressPct === 'number') return clampPct(obj.progressPct);
  const target = num(obj.targetValue, num(obj.target, 0));
  const current = num(obj.currentProgress, num(obj.progress, 0));
  if (target <= 0) return obj.completed === true ? 100 : 0;
  return clampPct((current / target) * 100);
}

function objectiveTurnsRemaining(obj: Record<string, unknown> | null, gs: Record<string, unknown>, turn: number): number | null {
  if (!obj) return null;
  if (typeof obj.turnsRemaining === 'number') return Math.max(0, Math.floor(obj.turnsRemaining));
  if (typeof obj.deadlineTurn === 'number') return Math.max(0, obj.deadlineTurn - turn);
  const missionDeadline = num(gs.missionDeadlineTurn, num(gs.scenarioDeadlineTurn, 0));
  if (missionDeadline > 0) return Math.max(0, missionDeadline - turn);
  return null;
}

export function parseObjectiveContextFromGame(
  gs: Record<string, unknown>,
  playerRegion: string
): ParsedObjectiveContext {
  const turn = num(gs.turnCounter, num(gs.turn, 1));
  const primary = pickPrimaryObjective(gs);
  const focus = (gs.currentFocus || gs.objectiveFocus) as { regionId?: string; region?: string; label?: string } | null;
  const targetRegion = String(
    primary?.targetRegion ||
      primary?.regionId ||
      primary?.region ||
      focus?.regionId ||
      focus?.region ||
      ''
  ).trim();
  const objectiveTargetRegion = targetRegion || null;
  const labelRaw =
    (typeof primary?.description === 'string' && primary.description) ||
    (typeof primary?.title === 'string' && primary.title) ||
    (typeof focus?.label === 'string' && focus.label) ||
    null;
  const objectivePrimaryLabel = labelRaw ? labelRaw.slice(0, 120) : null;
  const progress = objectiveProgressPct(primary);
  const turnsRemaining = objectiveTurnsRemaining(primary, gs, turn);
  const objectiveActive = Boolean(primary || objectiveTargetRegion || objectivePrimaryLabel);

  const rivalRaw = gs.rivalVictoryProgress ?? gs.rivalDominanceShare ?? gs.rivalVictoryShare;
  const rivalVictoryProgressPct =
    rivalRaw === null || rivalRaw === undefined
      ? null
      : clampPct(num(rivalRaw, 0) <= 1 ? num(rivalRaw, 0) * 100 : num(rivalRaw, 0));

  const thresholdRaw = gs.victoryThreshold ?? gs.scenarioVictoryThreshold ?? 0.8;
  const victoryThresholdPct = clampPct(num(thresholdRaw, 0.8) <= 1 ? num(thresholdRaw, 0.8) * 100 : num(thresholdRaw, 80));

  const playerInObjectiveRegion = Boolean(
    objectiveTargetRegion && playerRegion && objectiveTargetRegion.toUpperCase() === playerRegion.toUpperCase()
  );

  return {
    objectiveActive,
    objectivePrimaryLabel,
    objectiveTargetRegion,
    objectiveProgressPct: progress,
    objectiveTurnsRemaining: turnsRemaining,
    playerInObjectiveRegion,
    rivalVictoryProgressPct,
    victoryThresholdPct,
  };
}

export function mergeObjectiveContextIntoSnapshot(
  base: GuardianCoPilotMonitorSnapshot,
  ctx: ParsedObjectiveContext
): GuardianCoPilotMonitorSnapshot {
  const objectiveRegion = base.objectiveRegion || ctx.objectiveTargetRegion;
  return {
    ...base,
    objectiveRegion,
    objectiveActive: ctx.objectiveActive,
    objectivePrimaryLabel: ctx.objectivePrimaryLabel,
    objectiveTargetRegion: ctx.objectiveTargetRegion,
    objectiveProgressPct: ctx.objectiveProgressPct,
    objectiveTurnsRemaining: ctx.objectiveTurnsRemaining,
    playerInObjectiveRegion: ctx.playerInObjectiveRegion,
    rivalVictoryProgressPct: ctx.rivalVictoryProgressPct,
    victoryThresholdPct: ctx.victoryThresholdPct,
    guardianRequiresConfirmation: base.guardianResponseMode === 'require_confirmation',
    guardianProtectionMaximum: base.guardianProtectionLevel === 'maximum_protection',
  };
}

/** Recommendation-only hints tied to live objective fields (never executable). */
export function buildObjectiveAwareAdviceHints(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const hints: string[] = [];
  if (snapshot.objectiveActive && snapshot.objectivePrimaryLabel) {
    hints.push(`Primary objective: ${snapshot.objectivePrimaryLabel}`);
  }
  if (
    snapshot.objectiveActive &&
    snapshot.objectiveTargetRegion &&
    !snapshot.playerInObjectiveRegion &&
    snapshot.apRemaining > 0
  ) {
    hints.push(
      `Consider travel to ${snapshot.objectiveTargetRegion} — you are in ${snapshot.region} with ${snapshot.apRemaining} AP left`
    );
  }
  if (snapshot.objectiveProgressPct !== null && snapshot.objectiveProgressPct < 100) {
    hints.push(`Objective progress is ${snapshot.objectiveProgressPct}% from live mission state`);
  }
  return hints.slice(0, 3);
}


// --- source: snapshot.ts ---

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function getRemainingActionPoints(player: Record<string, unknown>, settings: Record<string, unknown>): number {
  if (settings && settings.actionLimitsEnabled === false) {
    if (typeof player?.actionPoints === 'number') return Math.max(0, player.actionPoints);
    return Number.POSITIVE_INFINITY;
  }
  const isAi = Boolean(player?.isAi || player?.kind === 'ai');
  const maxActions = isAi ? num(settings?.aiActionsPerDay, 3) : num(settings?.playerActionsPerDay, 3);
  const used = num(player?.actionsUsedThisTurn);
  const granted = num(player?.overrideActionsGranted);
  return Math.max(0, maxActions + granted - used);
}

function sanitizeGuardianAiSettings(raw: unknown): { enabled: boolean; protectionLevel: string; responseMode: string } {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    enabled: src.enabled !== false,
    protectionLevel: String(src.protectionLevel || 'major_mistakes'),
    responseMode: String(src.responseMode || 'confirm_risky'),
  };
}

function sanitizeCoPilotSettings(raw: unknown): {
  enabled: boolean;
  authorityMode: string;
  autonomousSessionActive: boolean;
  spendingCaps: { minimumCashReserve: number; maximumSpendPerAction: number };
} {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const caps = (src.spendingCaps && typeof src.spendingCaps === 'object' ? src.spendingCaps : {}) as Record<
    string,
    unknown
  >;
  return {
    enabled: Boolean(src.enabled),
    authorityMode: String(src.authorityMode || 'assist'),
    autonomousSessionActive: Boolean(src.autonomousSessionActive),
    spendingCaps: {
      minimumCashReserve: num(caps.minimumCashReserve, 250),
      maximumSpendPerAction: num(caps.maximumSpendPerAction, 2500),
    },
  };
}

function deriveCopilotHoldsControl(
  gs: Record<string, unknown>,
  settings: Record<string, unknown>,
  takeover: BuildMonitorSnapshotInput['takeoverSession']
): boolean {
  if (typeof gs.copilotHoldsControl === 'boolean') return gs.copilotHoldsControl;
  const session = takeover ?? (gs.takeoverSession as BuildMonitorSnapshotInput['takeoverSession']);
  if (session && session.status !== 'ended') return true;
  const cp = sanitizeCoPilotSettings(settings.coPilotSettings || gs.coPilotSettings);
  if (!cp.enabled) return false;
  return cp.authorityMode === 'rescue' || cp.authorityMode === 'autonomous';
}

export function buildGuardianCoPilotMonitorSnapshot(input: BuildMonitorSnapshotInput): GuardianCoPilotMonitorSnapshot {
  const gs = input.gameState || {};
  const player = (input.player || gs.player || {}) as Record<string, unknown>;
  const settings = (input.gameSettings || gs.gameSettings || {}) as Record<string, unknown>;
  const actorId = String(player.id || gs.humanPlayerId || 'player_1');
  const turn = num(gs.turnCounter, num(gs.turn, 1));
  const day = num(gs.day, turn);
  const apRemaining = getRemainingActionPoints(player, settings);
  const apPerDay = num(settings.playerActionsPerDay, 3);
  const actionsUsedThisTurn = num(player.actionsUsedThisTurn, Math.max(0, apPerDay - apRemaining));
  const cash = num(player.money);
  const debt = num(player.debt, num(player.loans));
  const region = String(player.currentRegion || player.location || 'NSW');
  const guardian = sanitizeGuardianAiSettings(settings.guardianAiSettings);
  const cp = sanitizeCoPilotSettings(settings.coPilotSettings || gs.coPilotSettings);
  const minCashReserve = cp.spendingCaps.minimumCashReserve;
  const maxSpendPerAction = cp.spendingCaps.maximumSpendPerAction;
  const takeover = input.takeoverSession ?? (gs.takeoverSession as BuildMonitorSnapshotInput['takeoverSession']);
  const takeoverSessionActive = Boolean(takeover && takeover.status !== 'ended');
  const takeoverSessionAgeTurns =
    takeoverSessionActive && typeof takeover?.startedTurn === 'number' ? Math.max(0, turn - takeover.startedTurn) : 0;
  const contracts = gs.contracts || gs.activeContracts || {};
  const contractList = Array.isArray(contracts) ? contracts : Object.values(contracts || {});
  const activeContractCount = contractList.filter(
    (c: unknown) => c && typeof c === 'object' && ((c as Record<string, unknown>).status === 'active' || (c as Record<string, unknown>).status === 'in_progress')
  ).length;
  const expiringContractCount = contractList.filter((c: unknown) => {
    if (!c || typeof c !== 'object') return false;
    const row = c as Record<string, unknown>;
    if (row.status !== 'active') return false;
    const rem =
      typeof row.turnsRemaining === 'number'
        ? row.turnsRemaining
        : typeof row.deadlineTurn === 'number'
          ? row.deadlineTurn - turn
          : 99;
    return rem <= 2;
  }).length;
  const replay = gs.guardianReplayEvents;
  const guardianReplayCount = Array.isArray(replay) ? replay.length : 0;
  const teamPlans = (gs.teamStrategicPlansByTeam || {}) as Record<string, { status?: string }>;
  const teamPlanPending = Object.values(teamPlans).some(p => p && p.status === 'pending_approval');
  const focus = (gs.currentFocus || gs.objectiveFocus) as { regionId?: string; region?: string } | null;
  const objectiveRegion = focus?.regionId || focus?.region || null;
  const objectiveCtx = parseObjectiveContextFromGame(gs, region);

  const base: GuardianCoPilotMonitorSnapshot = {
    turn,
    day,
    actorId,
    cash,
    debt,
    apRemaining,
    apPerDay,
    actionsUsedThisTurn,
    region,
    guardianEnabled: guardian.enabled,
    guardianProtectionLevel: guardian.protectionLevel,
    guardianResponseMode: guardian.responseMode,
    copilotEnabled: cp.enabled,
    copilotAuthorityMode: cp.authorityMode,
    copilotHoldsControl: deriveCopilotHoldsControl(gs, settings, takeover),
    copilotAutonomousActive: cp.autonomousSessionActive,
    takeoverSessionActive,
    takeoverSessionAgeTurns,
    minCashReserve,
    maxSpendPerAction,
    blockedContinueCount: num(gs.coPilotBlockedContinueCount),
    guardianReplayCount,
    activeContractCount,
    expiringContractCount,
    teamPlanPending,
    objectiveRegion: objectiveRegion ? String(objectiveRegion) : null,
    objectiveActive: false,
    objectivePrimaryLabel: null,
    objectiveTargetRegion: null,
    objectiveProgressPct: null,
    objectiveTurnsRemaining: null,
    playerInObjectiveRegion: true,
    rivalVictoryProgressPct: null,
    victoryThresholdPct: 80,
    guardianRequiresConfirmation: guardian.responseMode === 'require_confirmation',
    guardianProtectionMaximum: guardian.protectionLevel === 'maximum_protection',
    guardianAutomationLikelyBlocked: false,
    guardianConfirmationLikelyRequired: false,
    guardianRiskScore: 0,
    guardianRiskBand: 'low',
    copilotSpendingHeadroom: 0,
    objectiveBehindSchedule: false,
    liquidityStressIndex: 0,
    copilotTrustGapScore: 0,
    objectivePacePct: null,
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
    containmentBurdenIndex: 0,
    humanRelayPressure: 0,
    recoveryHeadroomScore: 100,
    advisoryDepletionIndex: 0,
    operatorBandwidthScore: 100,
    continuityMarginScore: 100,
    stewardshipLoadIndex: 0,
    oversightCommitmentScore: 100,
    sustainabilityMarginScore: 100,
    accountabilityLoadIndex: 0,
    delegationFidelityScore: 100,
    governanceEnduranceScore: 100,
    fiduciaryBurdenIndex: 0,
    trustAssuranceScore: 100,
    governanceDurabilityScore: 100,
    covenantStrainIndex: 0,
    mandateIntegrityScore: 100,
    governanceTenacityScore: 100,
    charterStrainIndex: 0,
    authorityIntegrityScore: 100,
    governancePersistenceScore: 100,
    legitimacyStrainIndex: 0,
    oversightIntegrityScore: 100,
    governanceContinuityScore: 100,
    complianceStrainIndex: 0,
    policyIntegrityScore: 100,
    governanceResilienceScore: 100,
    auditStrainIndex: 0,
    controlIntegrityScore: 100,
    governanceStabilityScore: 100,
    assuranceStrainIndex: 0,
    evidenceIntegrityScore: 100,
    governanceConfidenceScore: 100,
    attestationStrainIndex: 0,
    attestationIntegrityScore: 100,
    governanceReliabilityScore: 100,
    verificationStrainIndex: 0,
    verificationIntegrityScore: 100,
    governanceValidityScore: 100,
    validationStrainIndex: 0,
    validationIntegrityScore: 100,
    governanceSoundnessScore: 100,
    certificationStrainIndex: 0,
    certificationIntegrityScore: 100,
    governanceAuthenticityScore: 100,
    accreditationStrainIndex: 0,
    accreditationIntegrityScore: 100,
    governanceCredibilityScore: 100,
    endorsementStrainIndex: 0,
    endorsementIntegrityScore: 100,
    governanceTrustworthinessScore: 100,
    ratificationStrainIndex: 0,
    ratificationIntegrityScore: 100,
    governanceDependabilityScore: 100,
    authorizationStrainIndex: 0,
    authorizationIntegrityScore: 100,
    governanceSteadfastnessScore: 100,
    affirmationStrainIndex: 0,
    affirmationIntegrityScore: 100,
    governanceResolutenessScore: 100,
    sanctionStrainIndex: 0,
    sanctionIntegrityScore: 100,
    governanceFirmnessScore: 100,
    warrantStrainIndex: 0,
    warrantIntegrityScore: 100,
    governanceConstancyScore: 100,
    clearanceStrainIndex: 0,
    clearanceIntegrityScore: 100,
    governancePerseveranceScore: 100,
    dispensationStrainIndex: 0,
    dispensationIntegrityScore: 100,
    governanceFortitudeScore: 100,
    indulgenceStrainIndex: 0,
    indulgenceIntegrityScore: 100,
    governanceVigorScore: 100,
    exemptionStrainIndex: 0,
    exemptionIntegrityScore: 100,
    governanceStaminaScore: 100,
    remissionStrainIndex: 0,
    remissionIntegrityScore: 100,
    governanceMettleScore: 100,
    absolutionStrainIndex: 0,
    absolutionIntegrityScore: 100,
    governanceGritScore: 100,
    amnestyStrainIndex: 0,
    amnestyIntegrityScore: 100,
    governanceResolveScore: 100,
    pardonStrainIndex: 0,
    pardonIntegrityScore: 100,
    governanceZealScore: 100,
    clemencyStrainIndex: 0,
    clemencyIntegrityScore: 100,
    governancePluckScore: 100,
    reprieveStrainIndex: 0,
    reprieveIntegrityScore: 100,
    governanceNerveScore: 100,
    acquittalStrainIndex: 0,
    acquittalIntegrityScore: 100,
    governanceMoxieScore: 100,
    exonerationStrainIndex: 0,
    exonerationIntegrityScore: 100,
    governanceSpunkScore: 100,
    vindicationStrainIndex: 0,
    vindicationIntegrityScore: 100,
    governanceDashScore: 100,
    justificationStrainIndex: 0,
    justificationIntegrityScore: 100,
    governanceBrioScore: 100,
  };

  return enrichSnapshotGuardianDepth(mergeObjectiveContextIntoSnapshot(base, objectiveCtx));
}


// --- source: advisory-cycle.ts ---

const ADVISORY_SEVERITY_RANK: Record<AdvisoryRecommendation['severity'], number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export function createAdvisoryOpsFixtureSnapshot(
  overrides: Partial<GuardianCoPilotMonitorSnapshot> = {}
): GuardianCoPilotMonitorSnapshot {
  const snap: GuardianCoPilotMonitorSnapshot = {
    turn: 4,
    day: 4,
    actorId: 'player_1',
    cash: 1200,
    debt: 0,
    apRemaining: 2,
    apPerDay: 3,
    actionsUsedThisTurn: 1,
    region: 'NSW',
    guardianEnabled: true,
    guardianProtectionLevel: 'major_mistakes',
    guardianResponseMode: 'confirm_risky',
    copilotEnabled: true,
    copilotAuthorityMode: 'assist',
    copilotHoldsControl: false,
    copilotAutonomousActive: false,
    takeoverSessionActive: false,
    takeoverSessionAgeTurns: 0,
    minCashReserve: 250,
    maxSpendPerAction: 2500,
    blockedContinueCount: 0,
    guardianReplayCount: 2,
    activeContractCount: 1,
    expiringContractCount: 0,
    teamPlanPending: false,
    objectiveRegion: null,
    objectiveActive: false,
    objectivePrimaryLabel: null,
    objectiveTargetRegion: null,
    objectiveProgressPct: null,
    objectiveTurnsRemaining: null,
    playerInObjectiveRegion: true,
    rivalVictoryProgressPct: null,
    victoryThresholdPct: 80,
    guardianRequiresConfirmation: false,
    guardianProtectionMaximum: false,
    guardianAutomationLikelyBlocked: false,
    guardianConfirmationLikelyRequired: false,
    guardianRiskScore: 0,
    guardianRiskBand: 'low',
    copilotSpendingHeadroom: 950,
    objectiveBehindSchedule: false,
    liquidityStressIndex: 0,
    copilotTrustGapScore: 0,
    objectivePacePct: null,
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
    containmentBurdenIndex: 0,
    humanRelayPressure: 0,
    recoveryHeadroomScore: 100,
    advisoryDepletionIndex: 0,
    operatorBandwidthScore: 100,
    continuityMarginScore: 100,
    stewardshipLoadIndex: 0,
    oversightCommitmentScore: 100,
    sustainabilityMarginScore: 100,
    accountabilityLoadIndex: 0,
    delegationFidelityScore: 100,
    governanceEnduranceScore: 100,
    fiduciaryBurdenIndex: 0,
    trustAssuranceScore: 100,
    governanceDurabilityScore: 100,
    covenantStrainIndex: 0,
    mandateIntegrityScore: 100,
    governanceTenacityScore: 100,
    charterStrainIndex: 0,
    authorityIntegrityScore: 100,
    governancePersistenceScore: 100,
    legitimacyStrainIndex: 0,
    oversightIntegrityScore: 100,
    governanceContinuityScore: 100,
    complianceStrainIndex: 0,
    policyIntegrityScore: 100,
    governanceResilienceScore: 100,
    auditStrainIndex: 0,
    controlIntegrityScore: 100,
    governanceStabilityScore: 100,
    assuranceStrainIndex: 0,
    evidenceIntegrityScore: 100,
    governanceConfidenceScore: 100,
    ...overrides,
  };
  if (snap.objectiveTargetRegion && !snap.objectiveRegion) {
    snap.objectiveRegion = snap.objectiveTargetRegion;
  }
  return enrichSnapshotGuardianDepth(snap);
}

function materializeAdvisoryFromRule(
  rule: AdvisoryMonitorRule,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation | null {
  const grounding = buildGroundingForRule(rule, snapshot);
  const draft: AdvisoryRecommendation = {
    id: `adv_${rule.id}_t${snapshot.turn}`,
    kind: rule.kind,
    severity: rule.defaultSeverity,
    category: rule.category,
    title: rule.title,
    detail: enrichDetailWithGrounding(rule.detailTemplate, grounding),
    recommendationOnly: true,
    mayExecute: false,
    grounding,
    stateVerified: false,
    suggestedFollowUp: rule.followUp,
    deepLink: rule.deepLink || (rule.category === 'guardian' ? { tab: 'aiTeams', section: 'aiTeams.coPilot' } : undefined),
    dedupeKey: `${rule.id}:${snapshot.actorId}`,
    turn: snapshot.turn,
    day: snapshot.day,
    actorId: snapshot.actorId,
    ruleId: rule.id,
  };
  if (!verifyStateVerifiedWarning(draft, snapshot, rule)) return null;
  return { ...draft, stateVerified: true };
}

export function materializeAdvisoryAlerts(items: AdvisoryRecommendation[]): AdvisoryRecommendation[] {
  const seen = new Set<string>();
  const out: AdvisoryRecommendation[] = [];
  const sorted = [...items].sort(
    (a, b) =>
      ADVISORY_SEVERITY_RANK[b.severity] - ADVISORY_SEVERITY_RANK[a.severity] || a.id.localeCompare(b.id)
  );
  for (const item of sorted) {
    if (!item.stateVerified || !assertAdvisoryRecommendationOnly(item)) continue;
    if (seen.has(item.dedupeKey)) continue;
    seen.add(item.dedupeKey);
    out.push(item);
  }
  return out;
}

export function runGuardianCoPilotAdvisoryCycle(input: BuildMonitorSnapshotInput): GuardianCoPilotAdvisoryCycleResult {
  const snapshot = buildGuardianCoPilotMonitorSnapshot(input);
  const recommendations: AdvisoryRecommendation[] = [];
  for (const rule of ADVISORY_MONITOR_RULES) {
    try {
      if (!rule.evaluate(snapshot)) continue;
      const rec = materializeAdvisoryFromRule(rule, snapshot);
      if (rec) recommendations.push(rec);
    } catch {
      /* fail-safe: skip rule */
    }
  }
  const alerts = recommendations.filter(r => r.kind === 'alert');
  const advice = recommendations.filter(r => r.kind === 'advice');
  const monitors = recommendations.filter(r => r.kind === 'monitor');
  return {
    snapshot,
    recommendations: materializeAdvisoryAlerts(recommendations),
    alerts: materializeAdvisoryAlerts(alerts),
    advice: materializeAdvisoryAlerts(advice),
    monitors: materializeAdvisoryAlerts(monitors),
    generatedAtTurn: snapshot.turn,
    policy: ADVISORY_OPS_POLICY,
  };
}

export function advisoryRecommendationsFromCoPilotEvaluation(
  evalResult: CoPilotCandidateEvaluationResult,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation[] {
  const top = evalResult.topRecommendation || evalResult.candidates?.[0];
  if (!top) return [];
  const stripped = stripExecutionFromCoPilotCandidate(top as Record<string, unknown> & { execute?: unknown });
  const label =
    (stripped as Record<string, unknown>).title ||
    (stripped as Record<string, unknown>).label ||
    stripped.actionType ||
    'Action';
  const grounding: AdvisoryRecommendation['grounding'] = [
    { field: 'turn', label: 'Turn', value: snapshot.turn },
    { field: 'copilotEnabled', label: 'Co-Pilot enabled', value: snapshot.copilotEnabled },
  ];
  const rec: AdvisoryRecommendation = {
    id: `adv_copilot_candidate_t${snapshot.turn}`,
    kind: 'advice',
    severity: 'medium',
    category: 'copilot',
    title: 'Co-Pilot suggested action (approval required)',
    detail: `${label} — review in Co-Pilot; nothing runs without your confirmation.`,
    recommendationOnly: true,
    mayExecute: false,
    grounding,
    stateVerified: true,
    suggestedFollowUp: 'Open Co-Pilot panel to approve or dismiss.',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.coPilot' },
    dedupeKey: `copilot_top:${snapshot.turn}:${(stripped as Record<string, unknown>).id || stripped.actionType}`,
    turn: snapshot.turn,
    day: snapshot.day,
    actorId: snapshot.actorId,
    ruleId: 'copilot_suggested_candidate',
  };
  return materializeAdvisoryAlerts([rec]);
}

export function evaluateAdvisoryScenario(descriptor: {
  snapshot: Partial<GuardianCoPilotMonitorSnapshot>;
}): { fired: string[]; recommendations: AdvisoryRecommendation[] } {
  const snap = createAdvisoryOpsFixtureSnapshot(descriptor.snapshot);
  const fired: string[] = [];
  const recommendations: AdvisoryRecommendation[] = [];
  for (const rule of ADVISORY_MONITOR_RULES) {
    if (!rule.evaluate(snap)) continue;
    fired.push(rule.id);
    const rec = materializeAdvisoryFromRule(rule, snap);
    if (rec) recommendations.push(rec);
  }
  return { fired, recommendations: materializeAdvisoryAlerts(recommendations) };
}


// --- source: scenarios.ts ---

/** Deterministic scenarios with real monitor rule ids (replaces placeholder rule_ref_* catalog). */
export const ADVISORY_SCENARIO_CATALOG: AdvisoryScenarioDescriptor[] = [
  {
    id: 'sc_cash_below_reserve',
    category: 'liquidity',
    snapshot: { cash: 100, minCashReserve: 250 },
    expectRuleIds: ['cash_below_reserve'],
    notes: 'Cash under Co-Pilot reserve floor',
  },
  {
    id: 'sc_ap_exhausted',
    category: 'actions',
    snapshot: { apRemaining: 0 },
    expectRuleIds: ['ap_exhausted'],
    notes: 'No AP remaining',
  },
  {
    id: 'sc_copilot_blocked',
    category: 'copilot',
    snapshot: { blockedContinueCount: 2 },
    expectRuleIds: ['copilot_blocked_continues'],
    notes: 'Blocked continue limit hit',
  },
  {
    id: 'sc_guardian_off',
    category: 'guardian',
    snapshot: { guardianEnabled: false },
    expectRuleIds: ['guardian_disabled'],
    notes: 'Guardian master toggle off',
  },
  {
    id: 'sc_contract_expiring',
    category: 'contracts',
    snapshot: { expiringContractCount: 1, activeContractCount: 2 },
    expectRuleIds: ['contract_expiring_soon', 'contract_failure_risk'],
    notes: 'Expiring contract stack',
  },
  {
    id: 'sc_wrong_region',
    category: 'travel',
    snapshot: { region: 'NSW', objectiveRegion: 'VIC' },
    expectRuleIds: ['stranded_wrong_region'],
    notes: 'Objective region mismatch',
  },
  {
    id: 'sc_copilot_control',
    category: 'copilot',
    snapshot: { copilotHoldsControl: true },
    expectRuleIds: ['copilot_holding_control'],
    notes: 'Co-Pilot holds control',
  },
  {
    id: 'sc_team_plan_pending',
    category: 'team',
    snapshot: { teamPlanPending: true },
    expectRuleIds: ['team_plan_pending_approval'],
    notes: 'Team plan awaiting approval',
  },
  {
    id: 'sc_guardian_replay_backlog',
    category: 'guardian',
    snapshot: { guardianReplayCount: 60, guardianProtectionLevel: 'major_mistakes' },
    expectRuleIds: ['guardian_replay_backlog', 'guardian_recent_critical'],
    notes: 'Large replay log',
  },
  {
    id: 'sc_healthy_baseline',
    category: 'liquidity',
    snapshot: {
      cash: 5000,
      minCashReserve: 250,
      apRemaining: 3,
      guardianEnabled: true,
      blockedContinueCount: 0,
      expiringContractCount: 0,
      teamPlanPending: false,
      objectiveActive: false,
      rivalVictoryProgressPct: null,
      objectiveRegion: null,
    },
    expectRuleIds: [],
    notes: 'Healthy fixture should emit no critical liquidity alerts',
  },
  {
    id: 'sc_rival_near_victory',
    category: 'objective',
    snapshot: { rivalVictoryProgressPct: 72, victoryThresholdPct: 80 },
    expectRuleIds: ['rival_near_victory'],
    notes: 'Rival above 85% of victory threshold',
  },
  {
    id: 'sc_objective_travel',
    category: 'objective',
    snapshot: {
      objectiveActive: true,
      objectiveTargetRegion: 'VIC',
      objectiveRegion: 'VIC',
      region: 'NSW',
      playerInObjectiveRegion: false,
      apRemaining: 2,
    },
    expectRuleIds: ['objective_travel_recommended', 'stranded_wrong_region'],
    notes: 'AP available but wrong region for objective',
  },
  {
    id: 'sc_objective_deadline',
    category: 'objective',
    snapshot: {
      objectiveActive: true,
      objectiveTurnsRemaining: 1,
      objectiveProgressPct: 25,
    },
    expectRuleIds: ['objective_deadline_imminent', 'objective_stalled'],
    notes: 'Deadline pressure with low progress',
  },
  {
    id: 'sc_guardian_autonomy_mismatch',
    category: 'guardian',
    snapshot: {
      guardianEnabled: true,
      guardianRequiresConfirmation: true,
      guardianResponseMode: 'require_confirmation',
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
    },
    expectRuleIds: ['guardian_require_confirmation_mode', 'guardian_copilot_autonomy_mismatch'],
    notes: 'Strict Guardian with autonomous Co-Pilot',
  },
  {
    id: 'sc_guardian_off_takeover',
    category: 'guardian',
    snapshot: { guardianEnabled: false, takeoverSessionActive: true },
    expectRuleIds: ['guardian_off_during_takeover'],
    notes: 'Takeover without Guardian safety net',
  },
  {
    id: 'sc_debt_exceeds_cash',
    category: 'liquidity',
    snapshot: { cash: 400, debt: 900 },
    expectRuleIds: ['debt_exceeds_cash'],
    notes: 'Debt above liquid cash',
  },
  {
    id: 'sc_guardian_automation_block',
    category: 'guardian',
    snapshot: {
      guardianEnabled: true,
      guardianProtectionLevel: 'maximum_protection',
      guardianProtectionMaximum: true,
      guardianRequiresConfirmation: true,
      guardianResponseMode: 'require_confirmation',
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
      cash: 100,
      minCashReserve: 500,
    },
    expectRuleIds: ['guardian_automation_block_heuristic', 'guardian_copilot_autonomy_mismatch', 'cash_below_reserve'],
    notes: 'Heuristic automation block under max protection',
  },
  {
    id: 'sc_rival_midband',
    category: 'objective',
    snapshot: { rivalVictoryProgressPct: 55, victoryThresholdPct: 80 },
    expectRuleIds: ['rival_victory_midband'],
    notes: 'Rival between 65% and 85% of threshold',
  },
  {
    id: 'sc_objective_near_complete',
    category: 'objective',
    snapshot: { objectiveActive: true, objectiveProgressPct: 92 },
    expectRuleIds: ['objective_near_complete'],
    notes: 'Objective above 90%',
  },
  {
    id: 'sc_guardian_risk_critical',
    category: 'guardian',
    snapshot: {
      guardianEnabled: true,
      cash: 10,
      minCashReserve: 500,
      maxSpendPerAction: 3000,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianResponseMode: 'require_confirmation',
      guardianProtectionLevel: 'maximum_protection',
      guardianProtectionMaximum: true,
      objectiveActive: true,
      objectiveProgressPct: 15,
      objectiveTurnsRemaining: 2,
      rivalVictoryProgressPct: 62,
      victoryThresholdPct: 80,
    },
    expectRuleIds: ['guardian_risk_score_critical', 'objective_behind_schedule'],
    notes: 'Composite risk score critical band',
  },
  {
    id: 'sc_copilot_headroom_zero',
    category: 'copilot',
    snapshot: { copilotEnabled: true, cash: 200, minCashReserve: 250 },
    expectRuleIds: ['copilot_spending_headroom_zero', 'cash_below_reserve'],
    notes: 'No headroom above reserve',
  },
  {
    id: 'sc_rival_watch_band',
    category: 'objective',
    snapshot: { rivalVictoryProgressPct: 62, victoryThresholdPct: 80 },
    expectRuleIds: ['rival_victory_watch_band'],
    notes: 'Rival between 75% and 85% of threshold',
  },
  {
    id: 'sc_liquidity_stress_high',
    category: 'liquidity',
    snapshot: { cash: 40, minCashReserve: 500, debt: 900, maxSpendPerAction: 5000 },
    expectRuleIds: ['liquidity_stress_high', 'debt_exceeds_cash'],
    notes: 'High composite liquidity stress',
  },
  {
    id: 'sc_copilot_trust_gap',
    category: 'copilot',
    snapshot: {
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
      guardianEnabled: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      guardianResponseMode: 'require_confirmation',
    },
    expectRuleIds: ['copilot_trust_gap_wide'],
    notes: 'Wide automation vs protection gap',
  },
  {
    id: 'sc_rival_objective_pressure',
    category: 'objective',
    snapshot: {
      rivalVictoryProgressPct: 62,
      victoryThresholdPct: 80,
      objectiveActive: true,
      objectiveProgressPct: 18,
      objectiveTurnsRemaining: 2,
    },
    expectRuleIds: ['rival_and_objective_pressure', 'objective_behind_schedule'],
    notes: 'Rival watch band plus objective behind',
  },
  {
    id: 'sc_objective_pace_steep',
    category: 'objective',
    snapshot: { objectiveActive: true, objectiveProgressPct: 10, objectiveTurnsRemaining: 2 },
    expectRuleIds: ['objective_pace_steep', 'objective_behind_schedule'],
    notes: 'Steep required pace per turn',
  },
  {
    id: 'sc_composite_pressure_critical',
    category: 'guardian',
    snapshot: {
      cash: 20,
      minCashReserve: 500,
      debt: 1200,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      guardianResponseMode: 'require_confirmation',
      blockedContinueCount: 2,
    },
    expectRuleIds: ['composite_pressure_critical', 'liquidity_stress_high'],
    notes: 'Critical composite pressure from stacked liquidity and trust signals',
  },
  {
    id: 'sc_automation_readiness_low',
    category: 'copilot',
    snapshot: {
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianEnabled: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      guardianResponseMode: 'require_confirmation',
      blockedContinueCount: 2,
      cash: 50,
      minCashReserve: 500,
      debt: 700,
    },
    expectRuleIds: ['automation_readiness_low', 'copilot_auto_low_readiness'],
    notes: 'Low automation readiness under autonomous session',
  },
  {
    id: 'sc_action_burn_pressure',
    category: 'actions',
    snapshot: {
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      cash: 300,
      maxSpendPerAction: 6000,
      minCashReserve: 400,
      objectiveActive: true,
      objectiveProgressPct: 15,
      objectiveTurnsRemaining: 1,
    },
    expectRuleIds: ['action_burn_pressure_high', 'objective_behind_schedule'],
    notes: 'High AP burn pressure near objective deadline',
  },
  {
    id: 'sc_advisory_saturation_high',
    category: 'guardian',
    snapshot: {
      cash: 15,
      minCashReserve: 500,
      debt: 1500,
      maxSpendPerAction: 9000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      blockedContinueCount: 2,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 12,
      objectiveTurnsRemaining: 1,
    },
    expectRuleIds: ['advisory_saturation_high', 'escalation_latch_critical'],
    notes: 'High advisory saturation with critical escalation latch',
  },
  {
    id: 'sc_governance_coherence_low',
    category: 'copilot',
    snapshot: {
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotAuthorityMode: 'autonomous',
      guardianEnabled: false,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      cash: 40,
      minCashReserve: 500,
      debt: 800,
    },
    expectRuleIds: ['governance_coherence_low', 'guardian_disabled'],
    notes: 'Low governance coherence with Guardian off and autonomous Co-Pilot',
  },
  {
    id: 'sc_stability_lattice_pressured',
    category: 'guardian',
    snapshot: {
      cash: 25,
      minCashReserve: 500,
      debt: 1100,
      maxSpendPerAction: 7500,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      teamPlanPending: true,
      expiringContractCount: 1,
    },
    expectRuleIds: ['stability_lattice_pressured', 'team_plan_escalation_latch'],
    notes: 'Pressured stability lattice with team plan pending',
  },
  {
    id: 'sc_containment_burden_high',
    category: 'guardian',
    snapshot: {
      cash: 20,
      minCashReserve: 500,
      debt: 1200,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      guardianProtectionLevel: 'maximum_protection',
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    },
    expectRuleIds: ['containment_burden_high', 'human_relay_pressure_critical'],
    notes: 'High containment burden with critical human relay pressure',
  },
  {
    id: 'sc_recovery_headroom_low',
    category: 'guardian',
    snapshot: {
      cash: 35,
      minCashReserve: 500,
      debt: 900,
      maxSpendPerAction: 7000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
    },
    expectRuleIds: ['recovery_headroom_low', 'contracts_recovery_headroom'],
    notes: 'Low recovery headroom with expiring contracts',
  },
  {
    id: 'sc_resilience_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 28,
      minCashReserve: 500,
      debt: 1000,
      maxSpendPerAction: 7500,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['resilience_envelope_pressured', 'guardian_resilience_envelope_critical'],
    notes: 'Pressured resilience envelope with critical Guardian band',
  },
  {
    id: 'sc_advisory_depletion_high',
    category: 'guardian',
    snapshot: {
      cash: 18,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8500,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['advisory_depletion_high', 'operator_bandwidth_low'],
    notes: 'High advisory depletion with critical operator bandwidth',
  },
  {
    id: 'sc_continuity_margin_low',
    category: 'guardian',
    snapshot: {
      cash: 32,
      minCashReserve: 500,
      debt: 950,
      maxSpendPerAction: 7200,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 12,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
    },
    expectRuleIds: ['continuity_margin_low', 'contracts_continuity_margin'],
    notes: 'Low continuity margin with expiring contracts',
  },
  {
    id: 'sc_continuity_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 22,
      minCashReserve: 500,
      debt: 1100,
      maxSpendPerAction: 7800,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['continuity_envelope_pressured', 'guardian_continuity_envelope_critical'],
    notes: 'Pressured continuity envelope with critical Guardian band',
  },
  {
    id: 'sc_stewardship_load_high',
    category: 'guardian',
    snapshot: {
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      maxSpendPerAction: 8800,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['stewardship_load_high', 'oversight_commitment_low'],
    notes: 'High stewardship load with critical oversight commitment',
  },
  {
    id: 'sc_sustainability_margin_low',
    category: 'guardian',
    snapshot: {
      cash: 28,
      minCashReserve: 500,
      debt: 980,
      maxSpendPerAction: 7100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['sustainability_margin_low', 'contracts_sustainability_margin'],
    notes: 'Low sustainability margin with expiring contracts',
  },
  {
    id: 'sc_stewardship_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 20,
      minCashReserve: 500,
      debt: 1150,
      maxSpendPerAction: 7900,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['stewardship_envelope_pressured', 'guardian_stewardship_envelope_critical'],
    notes: 'Pressured stewardship envelope with critical Guardian band',
  },
  {
    id: 'sc_accountability_load_high',
    category: 'guardian',
    snapshot: {
      cash: 14,
      minCashReserve: 500,
      debt: 1500,
      maxSpendPerAction: 9000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
      governanceCoherenceScore: 30,
    },
    expectRuleIds: ['accountability_load_high', 'delegation_fidelity_low'],
    notes: 'High accountability load with critical delegation fidelity',
  },
  {
    id: 'sc_governance_endurance_low',
    category: 'guardian',
    snapshot: {
      cash: 26,
      minCashReserve: 500,
      debt: 1020,
      maxSpendPerAction: 7200,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_endurance_low', 'contracts_governance_endurance'],
    notes: 'Low governance endurance with expiring contracts',
  },
  {
    id: 'sc_accountability_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 18,
      minCashReserve: 500,
      debt: 1200,
      maxSpendPerAction: 8100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['accountability_envelope_pressured', 'guardian_accountability_envelope_critical'],
    notes: 'Pressured accountability envelope with critical Guardian band',
  },
  {
    id: 'sc_fiduciary_burden_high',
    category: 'guardian',
    snapshot: {
      cash: 12,
      minCashReserve: 500,
      debt: 1580,
      maxSpendPerAction: 9200,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['fiduciary_burden_high', 'trust_assurance_low'],
    notes: 'High fiduciary burden with critical trust assurance',
  },
  {
    id: 'sc_governance_durability_low',
    category: 'guardian',
    snapshot: {
      cash: 24,
      minCashReserve: 500,
      debt: 1050,
      maxSpendPerAction: 7300,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_durability_low', 'contracts_governance_durability'],
    notes: 'Low governance durability with expiring contracts',
  },
  {
    id: 'sc_fiduciary_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 17,
      minCashReserve: 500,
      debt: 1180,
      maxSpendPerAction: 8050,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['fiduciary_envelope_pressured', 'guardian_fiduciary_envelope_critical'],
    notes: 'Pressured fiduciary envelope with critical Guardian band',
  },
  {
    id: 'sc_covenant_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 11,
      minCashReserve: 500,
      debt: 1620,
      maxSpendPerAction: 9300,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['covenant_strain_high', 'mandate_integrity_low'],
    notes: 'High covenant strain with critical mandate integrity',
  },
  {
    id: 'sc_governance_tenacity_low',
    category: 'guardian',
    snapshot: {
      cash: 22,
      minCashReserve: 500,
      debt: 1080,
      maxSpendPerAction: 7350,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_tenacity_low', 'contracts_governance_tenacity'],
    notes: 'Low governance tenacity with expiring contracts',
  },
  {
    id: 'sc_covenant_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 16,
      minCashReserve: 500,
      debt: 1160,
      maxSpendPerAction: 8020,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['covenant_envelope_pressured', 'guardian_covenant_envelope_critical'],
    notes: 'Pressured covenant envelope with critical Guardian band',
  },
  {
    id: 'sc_charter_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 10,
      minCashReserve: 500,
      debt: 1650,
      maxSpendPerAction: 9400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['charter_strain_high', 'authority_integrity_low'],
    notes: 'High charter strain with critical authority integrity',
  },
  {
    id: 'sc_governance_persistence_low',
    category: 'guardian',
    snapshot: {
      cash: 21,
      minCashReserve: 500,
      debt: 1100,
      maxSpendPerAction: 7400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_persistence_low', 'contracts_governance_persistence'],
    notes: 'Low governance persistence with expiring contracts',
  },
  {
    id: 'sc_charter_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 15,
      minCashReserve: 500,
      debt: 1140,
      maxSpendPerAction: 7980,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['charter_envelope_pressured', 'guardian_charter_envelope_critical'],
    notes: 'Pressured charter envelope with critical Guardian band',
  },
  {
    id: 'sc_legitimacy_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 9,
      minCashReserve: 500,
      debt: 1680,
      maxSpendPerAction: 9500,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['legitimacy_strain_high', 'oversight_integrity_low'],
    notes: 'High legitimacy strain with critical oversight integrity',
  },
  {
    id: 'sc_governance_continuity_low',
    category: 'guardian',
    snapshot: {
      cash: 20,
      minCashReserve: 500,
      debt: 1120,
      maxSpendPerAction: 7450,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_continuity_low', 'contracts_governance_continuity'],
    notes: 'Low governance continuity with expiring contracts',
  },
  {
    id: 'sc_legitimacy_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 14,
      minCashReserve: 500,
      debt: 1130,
      maxSpendPerAction: 7950,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['legitimacy_envelope_pressured', 'guardian_legitimacy_envelope_critical'],
    notes: 'Pressured legitimacy envelope with critical Guardian band',
  },
  {
    id: 'sc_compliance_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 8,
      minCashReserve: 500,
      debt: 1710,
      maxSpendPerAction: 9600,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['compliance_strain_high', 'policy_integrity_low'],
    notes: 'High compliance strain with critical policy integrity',
  },
  {
    id: 'sc_governance_resilience_low',
    category: 'guardian',
    snapshot: {
      cash: 19,
      minCashReserve: 500,
      debt: 1140,
      maxSpendPerAction: 7480,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_resilience_low', 'contracts_governance_resilience'],
    notes: 'Low governance resilience with expiring contracts',
  },
  {
    id: 'sc_compliance_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 13,
      minCashReserve: 500,
      debt: 1120,
      maxSpendPerAction: 7920,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['compliance_envelope_pressured', 'guardian_compliance_envelope_critical'],
    notes: 'Pressured compliance envelope with critical Guardian band',
  },
  {
    id: 'sc_audit_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 7,
      minCashReserve: 500,
      debt: 1740,
      maxSpendPerAction: 9700,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['audit_strain_high', 'control_integrity_low'],
    notes: 'High audit strain with critical control integrity',
  },
  {
    id: 'sc_governance_stability_low',
    category: 'guardian',
    snapshot: {
      cash: 18,
      minCashReserve: 500,
      debt: 1160,
      maxSpendPerAction: 7510,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_stability_low', 'contracts_governance_stability'],
    notes: 'Low governance stability with expiring contracts',
  },
  {
    id: 'sc_audit_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 12,
      minCashReserve: 500,
      debt: 1110,
      maxSpendPerAction: 7890,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['audit_envelope_pressured', 'guardian_audit_envelope_critical'],
    notes: 'Pressured audit envelope with critical Guardian band',
  },
  {
    id: 'sc_assurance_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 5,
      minCashReserve: 500,
      debt: 1780,
      maxSpendPerAction: 9850,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['assurance_strain_high', 'evidence_integrity_low'],
    notes: 'High assurance strain with critical evidence integrity',
  },
  {
    id: 'sc_governance_confidence_low',
    category: 'guardian',
    snapshot: {
      cash: 17,
      minCashReserve: 500,
      debt: 1140,
      maxSpendPerAction: 7480,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_confidence_low', 'contracts_governance_confidence'],
    notes: 'Low governance confidence with expiring contracts',
  },
  {
    id: 'sc_assurance_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 10,
      minCashReserve: 500,
      debt: 1090,
      maxSpendPerAction: 7860,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['assurance_envelope_pressured', 'guardian_assurance_envelope_critical'],
    notes: 'Pressured assurance envelope with critical Guardian band',
  },
  {
    id: 'sc_attestation_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1820,
      maxSpendPerAction: 9920,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['attestation_strain_high', 'attestation_integrity_low'],
    notes: 'High attestation strain with critical attestation integrity',
  },
  {
    id: 'sc_governance_reliability_low',
    category: 'guardian',
    snapshot: {
      cash: 15,
      minCashReserve: 500,
      debt: 1160,
      maxSpendPerAction: 7420,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_reliability_low', 'contracts_governance_reliability'],
    notes: 'Low governance reliability with expiring contracts',
  },
  {
    id: 'sc_attestation_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 9,
      minCashReserve: 500,
      debt: 1080,
      maxSpendPerAction: 7840,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['attestation_envelope_pressured', 'guardian_attestation_envelope_critical'],
    notes: 'Pressured attestation envelope with critical Guardian band',
  },
  {
    id: 'sc_verification_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 3,
      minCashReserve: 500,
      debt: 1860,
      maxSpendPerAction: 9980,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['verification_strain_high', 'verification_integrity_low'],
    notes: 'High verification strain with critical verification integrity',
  },
  {
    id: 'sc_governance_validity_low',
    category: 'guardian',
    snapshot: {
      cash: 14,
      minCashReserve: 500,
      debt: 1180,
      maxSpendPerAction: 7480,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_validity_low', 'contracts_governance_validity'],
    notes: 'Low governance validity with expiring contracts',
  },
  {
    id: 'sc_verification_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 8,
      minCashReserve: 500,
      debt: 1100,
      maxSpendPerAction: 7880,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['verification_envelope_pressured', 'guardian_verification_envelope_critical'],
    notes: 'Pressured verification envelope with critical Guardian band',
  },
  {
    id: 'sc_validation_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 2,
      minCashReserve: 500,
      debt: 1900,
      maxSpendPerAction: 10040,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['validation_strain_high', 'validation_integrity_low'],
    notes: 'High validation strain with critical validation integrity',
  },
  {
    id: 'sc_governance_soundness_low',
    category: 'guardian',
    snapshot: {
      cash: 13,
      minCashReserve: 500,
      debt: 1200,
      maxSpendPerAction: 7540,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_soundness_low', 'contracts_governance_soundness'],
    notes: 'Low governance soundness with expiring contracts',
  },
  {
    id: 'sc_validation_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 7,
      minCashReserve: 500,
      debt: 1120,
      maxSpendPerAction: 7920,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['validation_envelope_pressured', 'guardian_validation_envelope_critical'],
    notes: 'Pressured validation envelope with critical Guardian band',
  },
  {
    id: 'sc_certification_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 1,
      minCashReserve: 500,
      debt: 1940,
      maxSpendPerAction: 10100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['certification_strain_high', 'certification_integrity_low'],
    notes: 'High certification strain with critical certification integrity',
  },
  {
    id: 'sc_governance_authenticity_low',
    category: 'guardian',
    snapshot: {
      cash: 12,
      minCashReserve: 500,
      debt: 1220,
      maxSpendPerAction: 7600,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_authenticity_low', 'contracts_governance_authenticity'],
    notes: 'Low governance authenticity with expiring contracts',
  },
  {
    id: 'sc_certification_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 6,
      minCashReserve: 500,
      debt: 1140,
      maxSpendPerAction: 7960,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['certification_envelope_pressured', 'guardian_certification_envelope_critical'],
    notes: 'Pressured certification envelope with critical Guardian band',
  },
  {
    id: 'sc_accreditation_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1980,
      maxSpendPerAction: 10160,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['accreditation_strain_high', 'accreditation_integrity_low'],
    notes: 'High accreditation strain with critical accreditation integrity',
  },
  {
    id: 'sc_governance_credibility_low',
    category: 'guardian',
    snapshot: {
      cash: 11,
      minCashReserve: 500,
      debt: 1240,
      maxSpendPerAction: 7660,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_credibility_low', 'contracts_governance_credibility'],
    notes: 'Low governance credibility with expiring contracts',
  },
  {
    id: 'sc_accreditation_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 5,
      minCashReserve: 500,
      debt: 1160,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['accreditation_envelope_pressured', 'guardian_accreditation_envelope_critical'],
    notes: 'Pressured accreditation envelope with critical Guardian band',
  },
  {
    id: 'sc_endorsement_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2020,
      maxSpendPerAction: 10220,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['endorsement_strain_high', 'endorsement_integrity_low'],
    notes: 'High endorsement strain with critical endorsement integrity',
  },
  {
    id: 'sc_governance_trustworthiness_low',
    category: 'guardian',
    snapshot: {
      cash: 10,
      minCashReserve: 500,
      debt: 1260,
      maxSpendPerAction: 7720,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_trustworthiness_low', 'contracts_governance_trustworthiness'],
    notes: 'Low governance trustworthiness with expiring contracts',
  },
  {
    id: 'sc_endorsement_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1180,
      maxSpendPerAction: 8040,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['endorsement_envelope_pressured', 'guardian_endorsement_envelope_critical'],
    notes: 'Pressured endorsement envelope with critical Guardian band',
  },
  {
    id: 'sc_ratification_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2060,
      maxSpendPerAction: 10280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['ratification_strain_high', 'ratification_integrity_low'],
    notes: 'High ratification strain with critical ratification integrity',
  },
  {
    id: 'sc_governance_dependability_low',
    category: 'guardian',
    snapshot: {
      cash: 9,
      minCashReserve: 500,
      debt: 1280,
      maxSpendPerAction: 7780,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_dependability_low', 'contracts_governance_dependability'],
    notes: 'Low governance dependability with expiring contracts',
  },
  {
    id: 'sc_ratification_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 3,
      minCashReserve: 500,
      debt: 1200,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['ratification_envelope_pressured', 'guardian_ratification_envelope_critical'],
    notes: 'Pressured ratification envelope with critical Guardian band',
  },
  {
    id: 'sc_authorization_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2100,
      maxSpendPerAction: 10340,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['authorization_strain_high', 'authorization_integrity_low'],
    notes: 'High authorization strain with critical authorization integrity',
  },
  {
    id: 'sc_governance_steadfastness_low',
    category: 'guardian',
    snapshot: {
      cash: 8,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 7840,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_steadfastness_low', 'contracts_governance_steadfastness'],
    notes: 'Low governance steadfastness with expiring contracts',
  },
  {
    id: 'sc_authorization_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 2,
      minCashReserve: 500,
      debt: 1220,
      maxSpendPerAction: 8120,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['authorization_envelope_pressured', 'guardian_authorization_envelope_critical'],
    notes: 'Pressured authorization envelope with critical Guardian band',
  },
  {
    id: 'sc_affirmation_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2140,
      maxSpendPerAction: 10400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['affirmation_strain_high', 'affirmation_integrity_low'],
    notes: 'High affirmation strain with critical affirmation integrity',
  },
  {
    id: 'sc_governance_resoluteness_low',
    category: 'guardian',
    snapshot: {
      cash: 7,
      minCashReserve: 500,
      debt: 1320,
      maxSpendPerAction: 7900,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_resoluteness_low', 'contracts_governance_resoluteness'],
    notes: 'Low governance resoluteness with expiring contracts',
  },
  {
    id: 'sc_affirmation_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 1,
      minCashReserve: 500,
      debt: 1240,
      maxSpendPerAction: 8160,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['affirmation_envelope_pressured', 'guardian_affirmation_envelope_critical'],
    notes: 'Pressured affirmation envelope with critical Guardian band',
  },
  {
    id: 'sc_sanction_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2180,
      maxSpendPerAction: 10460,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['sanction_strain_high', 'sanction_integrity_low'],
    notes: 'High sanction strain with critical sanction integrity',
  },
  {
    id: 'sc_governance_firmness_low',
    category: 'guardian',
    snapshot: {
      cash: 6,
      minCashReserve: 500,
      debt: 1340,
      maxSpendPerAction: 7960,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_firmness_low', 'contracts_governance_firmness'],
    notes: 'Low governance firmness with expiring contracts',
  },
  {
    id: 'sc_sanction_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1260,
      maxSpendPerAction: 8200,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['sanction_envelope_pressured', 'guardian_sanction_envelope_critical'],
    notes: 'Pressured sanction envelope with critical Guardian band',
  },
  {
    id: 'sc_warrant_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2220,
      maxSpendPerAction: 10520,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['warrant_strain_high', 'warrant_integrity_low'],
    notes: 'High warrant strain with critical warrant integrity',
  },
  {
    id: 'sc_governance_constancy_low',
    category: 'guardian',
    snapshot: {
      cash: 5,
      minCashReserve: 500,
      debt: 1360,
      maxSpendPerAction: 8020,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_constancy_low', 'contracts_governance_constancy'],
    notes: 'Low governance constancy with expiring contracts',
  },
  {
    id: 'sc_warrant_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1280,
      maxSpendPerAction: 8240,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['warrant_envelope_pressured', 'guardian_warrant_envelope_critical'],
    notes: 'Pressured warrant envelope with critical Guardian band',
  },
  {
    id: 'sc_clearance_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['clearance_strain_high', 'clearance_integrity_low'],
    notes: 'High clearance strain with critical clearance integrity',
  },
  {
    id: 'sc_governance_perseverance_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_perseverance_low', 'contracts_governance_perseverance'],
    notes: 'Low governance perseverance with expiring contracts',
  },
  {
    id: 'sc_clearance_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['clearance_envelope_pressured', 'guardian_clearance_envelope_critical'],
    notes: 'Pressured clearance envelope with critical Guardian band',
  },
  {
    id: 'sc_dispensation_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['dispensation_strain_high', 'dispensation_integrity_low'],
    notes: 'High dispensation strain with critical dispensation integrity',
  },
  {
    id: 'sc_governance_fortitude_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_fortitude_low', 'contracts_governance_fortitude'],
    notes: 'Low governance fortitude with expiring contracts',
  },
  {
    id: 'sc_dispensation_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['dispensation_envelope_pressured', 'guardian_dispensation_envelope_critical'],
    notes: 'Pressured dispensation envelope with critical Guardian band',
  },
  {
    id: 'sc_indulgence_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['indulgence_strain_high', 'indulgence_integrity_low'],
    notes: 'High indulgence strain with critical indulgence integrity',
  },
  {
    id: 'sc_governance_vigor_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_vigor_low', 'contracts_governance_vigor'],
    notes: 'Low governance vigor with expiring contracts',
  },
  {
    id: 'sc_indulgence_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['indulgence_envelope_pressured', 'guardian_indulgence_envelope_critical'],
    notes: 'Pressured indulgence envelope with critical Guardian band',
  },
  {
    id: 'sc_exemption_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['exemption_strain_high', 'exemption_integrity_low'],
    notes: 'High exemption strain with critical exemption integrity',
  },
  {
    id: 'sc_governance_stamina_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_stamina_low', 'contracts_governance_stamina'],
    notes: 'Low governance stamina with expiring contracts',
  },
  {
    id: 'sc_exemption_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['exemption_envelope_pressured', 'guardian_exemption_envelope_critical'],
    notes: 'Pressured exemption envelope with critical Guardian band',
  },
  {
    id: 'sc_remission_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['remission_strain_high', 'remission_integrity_low'],
    notes: 'High remission strain with critical remission integrity',
  },
  {
    id: 'sc_governance_mettle_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_mettle_low', 'contracts_governance_mettle'],
    notes: 'Low governance mettle with expiring contracts',
  },
  {
    id: 'sc_remission_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['remission_envelope_pressured', 'guardian_remission_envelope_critical'],
    notes: 'Pressured remission envelope with critical Guardian band',
  },
  {
    id: 'sc_absolution_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['absolution_strain_high', 'absolution_integrity_low'],
    notes: 'High absolution strain with critical absolution integrity',
  },
  {
    id: 'sc_governance_grit_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_grit_low', 'contracts_governance_grit'],
    notes: 'Low governance grit with expiring contracts',
  },
  {
    id: 'sc_absolution_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['absolution_envelope_pressured', 'guardian_absolution_envelope_critical'],
    notes: 'Pressured absolution envelope with critical Guardian band',
  },
  {
    id: 'sc_amnesty_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['amnesty_strain_high', 'amnesty_integrity_low'],
    notes: 'High amnesty strain with critical amnesty integrity',
  },
  {
    id: 'sc_governance_resolve_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_resolve_low', 'contracts_governance_resolve'],
    notes: 'Low governance resolve with expiring contracts',
  },
  {
    id: 'sc_amnesty_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['amnesty_envelope_pressured', 'guardian_amnesty_envelope_critical'],
    notes: 'Pressured amnesty envelope with critical Guardian band',
  },
  {
    id: 'sc_pardon_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['pardon_strain_high', 'pardon_integrity_low'],
    notes: 'High pardon strain with critical pardon integrity',
  },
  {
    id: 'sc_governance_zeal_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_zeal_low', 'contracts_governance_zeal'],
    notes: 'Low governance zeal with expiring contracts',
  },
  {
    id: 'sc_pardon_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['pardon_envelope_pressured', 'guardian_pardon_envelope_critical'],
    notes: 'Pressured pardon envelope with critical Guardian band',
  },
  {
    id: 'sc_clemency_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['clemency_strain_high', 'clemency_integrity_low'],
    notes: 'High clemency strain with critical clemency integrity',
  },
  {
    id: 'sc_governance_pluck_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_pluck_low', 'contracts_governance_pluck'],
    notes: 'Low governance pluck with expiring contracts',
  },
  {
    id: 'sc_clemency_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['clemency_envelope_pressured', 'guardian_clemency_envelope_critical'],
    notes: 'Pressured clemency envelope with critical Guardian band',
  },
  {
    id: 'sc_reprieve_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['reprieve_strain_high', 'reprieve_integrity_low'],
    notes: 'High reprieve strain with critical reprieve integrity',
  },
  {
    id: 'sc_governance_nerve_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_nerve_low', 'contracts_governance_nerve'],
    notes: 'Low governance nerve with expiring contracts',
  },
  {
    id: 'sc_reprieve_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['reprieve_envelope_pressured', 'guardian_reprieve_envelope_critical'],
    notes: 'Pressured reprieve envelope with critical Guardian band',
  },
  {
    id: 'sc_acquittal_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['acquittal_strain_high', 'acquittal_integrity_low'],
    notes: 'High acquittal strain with critical acquittal integrity',
  },
  {
    id: 'sc_governance_moxie_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_moxie_low', 'contracts_governance_moxie'],
    notes: 'Low governance moxie with expiring contracts',
  },
  {
    id: 'sc_acquittal_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['acquittal_envelope_pressured', 'guardian_acquittal_envelope_critical'],
    notes: 'Pressured acquittal envelope with critical Guardian band',
  },
  {
    id: 'sc_exoneration_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['exoneration_strain_high', 'exoneration_integrity_low'],
    notes: 'High exoneration strain with critical exoneration integrity',
  },
  {
    id: 'sc_governance_spunk_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_spunk_low', 'contracts_governance_spunk'],
    notes: 'Low governance spunk with expiring contracts',
  },
  {
    id: 'sc_exoneration_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['exoneration_envelope_pressured', 'guardian_exoneration_envelope_critical'],
    notes: 'Pressured exoneration envelope with critical Guardian band',
  },
  {
    id: 'sc_vindication_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['vindication_strain_high', 'vindication_integrity_low'],
    notes: 'High vindication strain with critical vindication integrity',
  },
  {
    id: 'sc_governance_dash_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_dash_low', 'contracts_governance_dash'],
    notes: 'Low governance dash with expiring contracts',
  },
  {
    id: 'sc_vindication_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['vindication_envelope_pressured', 'guardian_vindication_envelope_critical'],
    notes: 'Pressured vindication envelope with critical Guardian band',
  },
  {
    id: 'sc_justification_strain_high',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 2260,
      maxSpendPerAction: 10580,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    },
    expectRuleIds: ['justification_strain_high', 'justification_integrity_low'],
    notes: 'High justification strain with critical justification integrity',
  },
  {
    id: 'sc_governance_brio_low',
    category: 'guardian',
    snapshot: {
      cash: 4,
      minCashReserve: 500,
      debt: 1380,
      maxSpendPerAction: 8080,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
      expiringContractCount: 1,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['governance_brio_low', 'contracts_governance_brio'],
    notes: 'Low governance brio with expiring contracts',
  },
  {
    id: 'sc_justification_envelope_pressured',
    category: 'guardian',
    snapshot: {
      cash: 0,
      minCashReserve: 500,
      debt: 1300,
      maxSpendPerAction: 8280,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 2,
    },
    expectRuleIds: ['justification_envelope_pressured', 'guardian_justification_envelope_critical'],
    notes: 'Pressured justification envelope with critical Guardian band',
  },
];


// --- source: self-tests.ts ---

function check(
  results: Agent16SelfTestResult[],
  id: string,
  name: string,
  fn: () => boolean | string
): void {
  try {
    const out = fn();
    results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
  } catch (e) {
    results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
  }
}

export function runAgent16GuardianCoPilotSelfTests(): Agent16SelfTestResult[] {
  const results: Agent16SelfTestResult[] = [];
  const J = (v: unknown) => JSON.stringify(v);

  check(results, 'a16_policy', 'Advisory ops policy forbids execution and mutation', () =>
    ADVISORY_OPS_POLICY.mayExecuteActions === false &&
    ADVISORY_OPS_POLICY.mayMutateGameState === false &&
    ADVISORY_OPS_POLICY.mandate === 'recommendations_only'
  );

  check(results, 'a16_recommendation_flags', 'Every emitted recommendation is grounded and state-verified', () => {
    const cycle = runGuardianCoPilotAdvisoryCycle({
      gameState: {
        turnCounter: 4,
        day: 4,
        player: { id: 'player_1', money: 100 },
        gameSettings: { coPilotSettings: { enabled: true, spendingCaps: { minimumCashReserve: 250 } } },
      },
    });
    return (
      cycle.recommendations.length > 0 &&
      cycle.recommendations.every(r => assertAdvisoryRecommendationOnly(r) && verifyAdvisoryGrounding(r, cycle.snapshot))
    );
  });

  check(results, 'a16_deterministic', 'Same snapshot inputs → same advisory ordering', () => {
    const gs = {
      turnCounter: 7,
      day: 7,
      player: { id: 'p', money: 50, actionsUsedThisTurn: 3 },
      gameSettings: {
        playerActionsPerDay: 3,
        coPilotSettings: {
          enabled: true,
          authorityMode: 'autonomous',
          spendingCaps: { minimumCashReserve: 500, maximumSpendPerAction: 100 },
        },
      },
      coPilotBlockedContinueCount: 3,
    };
    const a = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    const b = runGuardianCoPilotAdvisoryCycle({ gameState: gs });
    return J(a.recommendations.map(r => r.id)) === J(b.recommendations.map(r => r.id));
  });

  check(results, 'a16_dedupe', 'materializeAdvisoryAlerts dedupes by dedupeKey', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const dup: AdvisoryRecommendation = {
      id: 'a',
      kind: 'alert',
      severity: 'high',
      category: 'x',
      title: 't',
      detail: 'd',
      recommendationOnly: true,
      mayExecute: false,
      grounding: [{ field: 'cash', label: 'Cash', value: snap.cash }],
      stateVerified: true,
      dedupeKey: 'k',
      turn: 1,
      day: 1,
      actorId: 'p',
      ruleId: 'test',
    };
    const out = materializeAdvisoryAlerts([dup, { ...dup, id: 'b', severity: 'low' }]);
    return out.length === 1 && out[0].severity === 'high';
  });

  check(results, 'a16_strip_execute', 'stripExecutionFromCoPilotCandidate removes execution hooks', () => {
    const s = stripExecutionFromCoPilotCandidate({
      label: 'Buy',
      execute: () => {},
      dispatch: () => {},
      autoApply: true,
    });
    return s.mayExecute === false && s.recommendationOnly === true && !('execute' in s) && !('dispatch' in s);
  });

  check(results, 'a16_partition', 'partitionSuggestionFromExecution never returns executable payload', () => {
    const { suggestion, executable } = partitionSuggestionFromExecution({
      label: 'Travel',
      mayExecute: true,
      execute: () => {},
    });
    return suggestion.mayExecute === false && executable === null;
  });

  check(results, 'a16_advisory_gate', 'Advisory autonomy never executes a suggestion', () => {
    const g = evaluateSuggestedActionGate({
      autonomy: 'advisory',
      copilotEnabled: true,
      action: { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' },
      alreadyCommittedIds: [],
    });
    return !g.allowed || 'advisory allowed execution';
  });

  check(results, 'a16_once', 'A suggested action executes at most once', () => {
    const a: AiSuggestedAction = { id: 'a', type: 'reserve_region', label: 'x', status: 'proposed' };
    const first = markSuggestedAction(a, 'executed', []);
    const second = markSuggestedAction(first.action, 'executed', first.committedIds);
    return first.executed && !second.executed || 'executed twice';
  });

  check(results, 'a16_copilot_advice', 'Co-Pilot evaluation maps to advisory copy only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot();
    const recs = advisoryRecommendationsFromCoPilotEvaluation(
      { topRecommendation: { id: 'c1', label: 'Travel', actionType: 'travel', execute: () => {} }, candidates: [] },
      snap
    );
    return (
      recs.length === 1 &&
      recs[0].mayExecute === false &&
      (/approval required/i.test(recs[0].title) || /without your confirmation/i.test(recs[0].detail))
    );
  });

  check(results, 'a16_objective_parse', 'Mission objectives parse into snapshot fields', () => {
    const gs = {
      turnCounter: 9,
      activeMission: {
        objectives: [
          {
            description: 'Deliver wheat to NSW',
            targetRegion: 'NSW',
            targetValue: 100,
            currentProgress: 20,
            isMandatory: true,
          },
        ],
      },
      player: { id: 'p1', money: 500, currentRegion: 'VIC' },
    };
    const snap = buildGuardianCoPilotMonitorSnapshot({ gameState: gs });
    return (
      snap.objectiveActive &&
      snap.objectiveProgressPct === 20 &&
      snap.objectiveTargetRegion === 'NSW' &&
      !snap.playerInObjectiveRegion
    );
  });

  check(results, 'a16_objective_hints', 'Objective-aware hints cite live snapshot fields only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      objectiveActive: true,
      objectivePrimaryLabel: 'Hold VIC',
      objectiveTargetRegion: 'VIC',
      region: 'NSW',
      playerInObjectiveRegion: false,
      apRemaining: 2,
      objectiveProgressPct: 15,
    });
    const hints = buildObjectiveAwareAdviceHints(snap);
    return hints.length >= 2 && hints.some(h => /VIC/.test(h)) && hints.every(h => !/execute/i.test(h));
  });

  check(results, 'a16_expansion_count', 'Round 41 scale wave brings monitor catalog to 526+ rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 526;
  });

  check(results, 'a16_coupling_report', 'Guardian depth coupling report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 400,
      debt: 600,
      maxSpendPerAction: 8000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      objectiveActive: true,
      objectiveProgressPct: 12,
      objectiveTurnsRemaining: 2,
    });
    const report = buildGuardianDepthCouplingReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round4_metrics', 'Round 4 interlock metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 40,
      minCashReserve: 500,
      debt: 800,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
    });
    return snap.compositePressureIndex >= 40 && snap.automationReadinessScore <= 100 && snap.actionBurnPressure >= 0;
  });

  check(results, 'a16_stability_report', 'Guardian depth stability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
    });
    const report = buildGuardianDepthStabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round5_metrics', 'Round 5 stability lattice metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
    });
    return (
      snap.advisorySaturationIndex >= 40 &&
      snap.escalationLatchScore >= 30 &&
      snap.governanceCoherenceScore <= 100
    );
  });

  check(results, 'a16_round6_metrics', 'Round 6 resilience envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    return (
      snap.containmentBurdenIndex >= 40 &&
      snap.humanRelayPressure >= 35 &&
      snap.recoveryHeadroomScore <= 100
    );
  });

  check(results, 'a16_resilience_report', 'Guardian depth resilience report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 25,
      minCashReserve: 500,
      debt: 1000,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
    });
    const report = buildGuardianDepthResilienceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round7_metrics', 'Round 7 continuity envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.advisoryDepletionIndex >= 40 &&
      snap.operatorBandwidthScore <= 100 &&
      snap.continuityMarginScore <= 100
    );
  });

  check(results, 'a16_continuity_report', 'Guardian depth continuity report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 20,
      minCashReserve: 500,
      debt: 1100,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthContinuityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round8_metrics', 'Round 8 stewardship envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.stewardshipLoadIndex >= 40 &&
      snap.oversightCommitmentScore <= 100 &&
      snap.sustainabilityMarginScore <= 100
    );
  });

  check(results, 'a16_stewardship_report', 'Guardian depth stewardship report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthStewardshipReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round9_metrics', 'Round 9 accountability envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.accountabilityLoadIndex >= 40 &&
      snap.delegationFidelityScore <= 100 &&
      snap.governanceEnduranceScore <= 100
    );
  });

  check(results, 'a16_accountability_report', 'Guardian depth accountability report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAccountabilityReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round10_metrics', 'Round 10 fiduciary envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.fiduciaryBurdenIndex >= 40 &&
      snap.trustAssuranceScore <= 100 &&
      snap.governanceDurabilityScore <= 100
    );
  });

  check(results, 'a16_fiduciary_report', 'Guardian depth fiduciary report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthFiduciaryReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round11_metrics', 'Round 11 covenant envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.covenantStrainIndex >= 40 &&
      snap.mandateIntegrityScore <= 100 &&
      snap.governanceTenacityScore <= 100
    );
  });

  check(results, 'a16_covenant_report', 'Guardian depth covenant report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCovenantReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round12_metrics', 'Round 12 charter envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.charterStrainIndex >= 40 &&
      snap.authorityIntegrityScore <= 100 &&
      snap.governancePersistenceScore <= 100
    );
  });

  check(results, 'a16_charter_report', 'Guardian depth charter report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCharterReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round13_metrics', 'Round 13 legitimacy envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.legitimacyStrainIndex >= 40 &&
      snap.oversightIntegrityScore <= 100 &&
      snap.governanceContinuityScore <= 100
    );
  });

  check(results, 'a16_legitimacy_report', 'Guardian depth legitimacy report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthLegitimacyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round14_metrics', 'Round 14 compliance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.complianceStrainIndex >= 40 &&
      snap.policyIntegrityScore <= 100 &&
      snap.governanceResilienceScore <= 100
    );
  });

  check(results, 'a16_compliance_report', 'Guardian depth compliance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthComplianceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round15_metrics', 'Round 15 audit envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.auditStrainIndex >= 40 &&
      snap.controlIntegrityScore <= 100 &&
      snap.governanceStabilityScore <= 100
    );
  });

  check(results, 'a16_audit_report', 'Guardian depth audit report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAuditReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round16_metrics', 'Round 16 assurance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.assuranceStrainIndex >= 40 &&
      snap.evidenceIntegrityScore <= 100 &&
      snap.governanceConfidenceScore <= 100
    );
  });

  check(results, 'a16_assurance_report', 'Guardian depth assurance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAssuranceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round17_metrics', 'Round 17 attestation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.attestationStrainIndex >= 40 &&
      snap.attestationIntegrityScore <= 100 &&
      snap.governanceReliabilityScore <= 100
    );
  });

  check(results, 'a16_attestation_report', 'Guardian depth attestation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAttestationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round18_metrics', 'Round 18 verification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.verificationStrainIndex >= 40 &&
      snap.verificationIntegrityScore <= 100 &&
      snap.governanceValidityScore <= 100
    );
  });

  check(results, 'a16_verification_report', 'Guardian depth verification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthVerificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round19_metrics', 'Round 19 validation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.validationStrainIndex >= 40 &&
      snap.validationIntegrityScore <= 100 &&
      snap.governanceSoundnessScore <= 100
    );
  });

  check(results, 'a16_validation_report', 'Guardian depth validation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthValidationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round20_metrics', 'Round 20 certification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.certificationStrainIndex >= 40 &&
      snap.certificationIntegrityScore <= 100 &&
      snap.governanceAuthenticityScore <= 100
    );
  });

  check(results, 'a16_certification_report', 'Guardian depth certification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthCertificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round21_metrics', 'Round 21 accreditation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.accreditationStrainIndex >= 40 &&
      snap.accreditationIntegrityScore <= 100 &&
      snap.governanceCredibilityScore <= 100
    );
  });

  check(results, 'a16_accreditation_report', 'Guardian depth accreditation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAccreditationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round22_metrics', 'Round 22 endorsement envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.endorsementStrainIndex >= 40 &&
      snap.endorsementIntegrityScore <= 100 &&
      snap.governanceTrustworthinessScore <= 100
    );
  });

  check(results, 'a16_endorsement_report', 'Guardian depth endorsement report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthEndorsementReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round23_metrics', 'Round 23 ratification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.ratificationStrainIndex >= 40 &&
      snap.ratificationIntegrityScore <= 100 &&
      snap.governanceDependabilityScore <= 100
    );
  });

  check(results, 'a16_ratification_report', 'Guardian depth ratification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthRatificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round24_metrics', 'Round 24 authorization envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.authorizationStrainIndex >= 40 &&
      snap.authorizationIntegrityScore <= 100 &&
      snap.governanceSteadfastnessScore <= 100
    );
  });

  check(results, 'a16_authorization_report', 'Guardian depth authorization report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAuthorizationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round25_metrics', 'Round 25 affirmation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.affirmationStrainIndex >= 40 &&
      snap.affirmationIntegrityScore <= 100 &&
      snap.governanceResolutenessScore <= 100
    );
  });

  check(results, 'a16_affirmation_report', 'Guardian depth affirmation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAffirmationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round26_metrics', 'Round 26 sanction envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.sanctionStrainIndex >= 40 &&
      snap.sanctionIntegrityScore <= 100 &&
      snap.governanceFirmnessScore <= 100
    );
  });

  check(results, 'a16_sanction_report', 'Guardian depth sanction report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthSanctionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round27_metrics', 'Round 27 warrant envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.warrantStrainIndex >= 40 &&
      snap.warrantIntegrityScore <= 100 &&
      snap.governanceConstancyScore <= 100
    );
  });

  check(results, 'a16_warrant_report', 'Guardian depth warrant report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthWarrantReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round28_metrics', 'Round 28 clearance envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.clearanceStrainIndex >= 40 &&
      snap.clearanceIntegrityScore <= 100 &&
      snap.governancePerseveranceScore <= 100
    );
  });

  check(results, 'a16_clearance_report', 'Guardian depth clearance report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthClearanceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round29_metrics', 'Round 29 dispensation envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.dispensationStrainIndex >= 40 &&
      snap.dispensationIntegrityScore <= 100 &&
      snap.governanceFortitudeScore <= 100
    );
  });

  check(results, 'a16_dispensation_report', 'Guardian depth dispensation report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthDispensationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round30_metrics', 'Round 30 indulgence envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.indulgenceStrainIndex >= 40 &&
      snap.indulgenceIntegrityScore <= 100 &&
      snap.governanceVigorScore <= 100
    );
  });

  check(results, 'a16_indulgence_report', 'Guardian depth indulgence report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthIndulgenceReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round31_metrics', 'Round 31 exemption envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.exemptionStrainIndex >= 40 &&
      snap.exemptionIntegrityScore <= 100 &&
      snap.governanceStaminaScore <= 100
    );
  });

  check(results, 'a16_exemption_report', 'Guardian depth exemption report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthExemptionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round32_metrics', 'Round 32 remission envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.remissionStrainIndex >= 40 &&
      snap.remissionIntegrityScore <= 100 &&
      snap.governanceMettleScore <= 100
    );
  });

  check(results, 'a16_remission_report', 'Guardian depth remission report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthRemissionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round33_metrics', 'Round 33 absolution envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.absolutionStrainIndex >= 40 &&
      snap.absolutionIntegrityScore <= 100 &&
      snap.governanceGritScore <= 100
    );
  });

  check(results, 'a16_absolution_report', 'Guardian depth absolution report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAbsolutionReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round34_metrics', 'Round 34 amnesty envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.amnestyStrainIndex >= 40 &&
      snap.amnestyIntegrityScore <= 100 &&
      snap.governanceResolveScore <= 100
    );
  });

  check(results, 'a16_amnesty_report', 'Guardian depth amnesty report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAmnestyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round35_metrics', 'Round 35 pardon envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.pardonStrainIndex >= 40 &&
      snap.pardonIntegrityScore <= 100 &&
      snap.governanceZealScore <= 100
    );
  });

  check(results, 'a16_pardon_report', 'Guardian depth pardon report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthPardonReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round36_metrics', 'Round 36 clemency envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.clemencyStrainIndex >= 40 &&
      snap.clemencyIntegrityScore <= 100 &&
      snap.governancePluckScore <= 100
    );
  });

  check(results, 'a16_clemency_report', 'Guardian depth clemency report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthClemencyReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round37_metrics', 'Round 37 reprieve envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.reprieveStrainIndex >= 40 &&
      snap.reprieveIntegrityScore <= 100 &&
      snap.governanceNerveScore <= 100
    );
  });

  check(results, 'a16_reprieve_report', 'Guardian depth reprieve report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthReprieveReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round38_metrics', 'Round 38 acquittal envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.acquittalStrainIndex >= 40 &&
      snap.acquittalIntegrityScore <= 100 &&
      snap.governanceMoxieScore <= 100
    );
  });

  check(results, 'a16_acquittal_report', 'Guardian depth acquittal report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthAcquittalReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round39_metrics', 'Round 39 exoneration envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.exonerationStrainIndex >= 40 &&
      snap.exonerationIntegrityScore <= 100 &&
      snap.governanceSpunkScore <= 100
    );
  });

  check(results, 'a16_exoneration_report', 'Guardian depth exoneration report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthExonerationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round40_metrics', 'Round 40 vindication envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.vindicationStrainIndex >= 40 &&
      snap.vindicationIntegrityScore <= 100 &&
      snap.governanceDashScore <= 100
    );
  });

  check(results, 'a16_vindication_report', 'Guardian depth vindication report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthVindicationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round41_metrics', 'Round 41 justification envelope metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    return (
      snap.justificationStrainIndex >= 40 &&
      snap.justificationIntegrityScore <= 100 &&
      snap.governanceBrioScore <= 100
    );
  });

  check(results, 'a16_justification_report', 'Guardian depth justification report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 16,
      minCashReserve: 500,
      debt: 1400,
      copilotEnabled: true,
      copilotAutonomousActive: true,
      copilotHoldsControl: true,
      guardianRequiresConfirmation: true,
      guardianProtectionMaximum: true,
      blockedContinueCount: 2,
      takeoverSessionActive: true,
      teamPlanPending: true,
      guardianReplayCount: 3,
    });
    const report = buildGuardianDepthJustificationReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_interlock_report', 'Guardian depth interlock report stays advisory-only', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      cash: 30,
      minCashReserve: 500,
      debt: 900,
      apRemaining: 1,
      apPerDay: 3,
      actionsUsedThisTurn: 2,
      copilotEnabled: true,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 1,
    });
    const report = buildGuardianDepthInterlockReport(snap);
    return report.length >= 1 && report.every(line => !/\bexecute\b/i.test(line));
  });

  check(results, 'a16_round3_metrics', 'Round 3 depth metrics populate on enriched snapshot', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({ cash: 50, minCashReserve: 400, debt: 700 });
    return snap.liquidityStressIndex >= 40 && snap.copilotSpendingHeadroom >= 0;
  });

  check(results, 'a16_depth_advice_lines', 'Guardian depth advice lines are non-executable strings', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      guardianEnabled: true,
      cash: 50,
      minCashReserve: 500,
      copilotHoldsControl: true,
    });
    const lines = buildGuardianDepthAdviceLines(snap);
    return lines.length > 0 && lines.every(l => typeof l === 'string' && !/\bexecute\b/i.test(l));
  });

  check(results, 'a16_snapshot_depth_enrich', 'Snapshot builder enriches Guardian depth flags', () => {
    const snap = buildGuardianCoPilotMonitorSnapshot({
      gameState: {
        player: { money: 50, currentRegion: 'NSW' },
        gameSettings: {
          guardianAiSettings: { enabled: true, protectionLevel: 'maximum_protection', responseMode: 'require_confirmation' },
          coPilotSettings: { enabled: true, autonomousSessionActive: true, authorityMode: 'autonomous', spendingCaps: { minimumCashReserve: 500 } },
        },
      },
    });
    return snap.guardianAutomationLikelyBlocked === true;
  });

  for (const t of runGuardianDepthUnitSelfTests()) {
    check(results, `a16_${t.id}`, `Guardian depth ${t.id}`, () => t.passed);
  }

  for (const rule of ADVISORY_MONITOR_RULES) {
    check(results, `a16_rule_${rule.id}`, `Rule ${rule.id} evaluates without throw on fixture`, () => {
      rule.evaluate(createAdvisoryOpsFixtureSnapshot());
      return true;
    });
  }

  for (const sc of ADVISORY_SCENARIO_CATALOG) {
    check(results, `a16_sc_${sc.id}`, `Scenario ${sc.id} fires expected rules`, () => {
      const out = evaluateAdvisoryScenario(sc);
      if (!out.recommendations.every(assertAdvisoryRecommendationOnly)) return 'recommendation flags';
      const missing = sc.expectRuleIds.filter(id => !out.fired.includes(id));
      if (missing.length) return `missing rules: ${missing.join(', ')}`;
      if (sc.expectRuleIds.length === 0 && out.fired.includes('cash_below_reserve')) return 'unexpected cash alert on healthy baseline';
      return true;
    });
  }

  return results;
}

export function summarizeAgent16SelfTests(results: Agent16SelfTestResult[]): { passed: number; failed: number; ok: boolean } {
  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, ok: failed === 0 };
}


// OP10M_MODULE_END agent-16-guardian
