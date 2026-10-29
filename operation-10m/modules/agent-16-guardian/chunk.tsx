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

export function enrichSnapshotGuardianDepth(snapshot: GuardianCoPilotMonitorSnapshot): GuardianCoPilotMonitorSnapshot {
  const posture = deriveGuardianAdvisoryPosture(snapshot);
  const objectiveBehindSchedule = computeObjectiveBehindSchedule(snapshot);
  const merged: GuardianCoPilotMonitorSnapshot = {
    ...snapshot,
    guardianAutomationLikelyBlocked: posture.automationLikelyBlocked,
    guardianConfirmationLikelyRequired: posture.confirmationLikelyRequired,
    objectiveBehindSchedule,
    copilotSpendingHeadroom: computeCopilotSpendingHeadroom(snapshot),
  };
  const guardianRiskScore = computeGuardianRiskScore(merged);
  return {
    ...merged,
    guardianRiskScore,
    guardianRiskBand: classifyGuardianRiskBand(guardianRiskScore),
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

  check(results, 'a16_expansion_count', 'Round 2 scale wave brings monitor catalog to 58+ rules', () => {
    return ADVISORY_MONITOR_RULES.length >= 58;
  });

  check(results, 'a16_risk_score_enrich', 'Enriched snapshot exposes Guardian risk score band', () => {
    const snap = createAdvisoryOpsFixtureSnapshot({
      guardianEnabled: true,
      cash: 10,
      minCashReserve: 500,
      copilotAutonomousActive: true,
      guardianRequiresConfirmation: true,
      objectiveActive: true,
      objectiveProgressPct: 10,
      objectiveTurnsRemaining: 2,
    });
    return snap.guardianRiskScore >= 40 && snap.guardianRiskBand !== 'low';
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
