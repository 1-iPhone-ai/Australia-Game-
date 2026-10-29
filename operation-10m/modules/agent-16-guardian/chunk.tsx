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
  return {
    ...withAuthority,
    governancePersistenceScore: computeGovernancePersistenceScore(withAuthority),
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

  check(results, 'a16_expansion_count', 'Round 12 scale wave brings monitor catalog to 178+ rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 178;
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
