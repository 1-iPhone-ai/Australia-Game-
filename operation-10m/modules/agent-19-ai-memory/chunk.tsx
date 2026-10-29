// OP10M_MODULE_BEGIN agent-19-ai-memory
// Agent 19 — AI memory evaluation, audit, explainability (generated; source: operation-10m/agent-19-ai-memory/)

// --- source: types.ts ---
/** Types aligned with V9.4 SECTION 1B (Agent 19 horizon / explainability). */

export const AGENT19_EXPLAINABILITY_DISCLAIMER =
  'Deterministic, capped score adjustments from stored facts — not a neural model. Memory never removes legal options.';

export type AiMemoryHorizon = 'short_term_match' | 'long_term_prior' | 'team_directive';

export interface AiMemoryEvent {
  id: string;
  turn: number;
  actionType: string;
  actorId: string;
  targetId: string | null;
  regionId: string | null;
  summary: string;
  importance: number;
  valence: number;
  stableKey: string;
}

export interface AiRelationship {
  actorId: string;
  trust: number;
  respect: number;
  rivalry: number;
  reliability: number;
  cooperation: number;
  threat: number;
  grievance: number;
  gratitude: number;
  lastUpdatedTurn: number;
}

export interface AiBelief {
  key: string;
  value: number;
  confidence: number;
  observations: number;
  opportunityCount: number;
  source: 'match' | 'persistent_prior';
}

export interface AiOpponentModel {
  actorId: string;
  totalOpportunities: number;
  beliefs: Record<string, AiBelief>;
  regionalInterest: Record<string, number>;
  predictedObjectives: Array<{ objectiveId: string; probability: number; confidence: number }>;
}

export interface AiActorMemory {
  ownerActorId: string;
  events: AiMemoryEvent[];
  relationships: Record<string, AiRelationship>;
  opponentModels: Record<string, AiOpponentModel>;
  adaptivePlan: { objectiveId: string; status: 'active' | 'revised' | 'abandoned'; revisionReason: string | null } | null;
  seenKeys: string[];
  lastDecayTurn: number;
}

export interface AiMemoryInfluenceSlice {
  horizon: AiMemoryHorizon;
  delta: number;
  reason: string;
}

export interface AiMemoryHorizonSnapshot {
  shortTermEventCount: number;
  shortTermRelationshipCount: number;
  matchLearnedObservationCount: number;
  longTermPriorBeliefCount: number;
  longTermPriorActive: boolean;
  qualityNote: string;
  explainabilityDisclaimer: string;
}

export interface AiMemoryInspectionView {
  ownerActorId: string;
  isRedacted: boolean;
  eventCount: number;
  influenceSummary: string | null;
  horizonSnapshot: AiMemoryHorizonSnapshot;
  recentEvents: AiMemoryEvent[];
  relationships: AiRelationship[];
  majorGrievances?: AiMemoryEvent[];
  majorGratitude?: AiMemoryEvent[];
  strategicProfiles: Array<{
    actorId: string;
    aggressionPreference: number;
    expansionPreference: number;
    economicPreference: number;
    cooperationPreference: number;
    confidence: number;
    observationCount: number;
  }>;
  opponentModels?: AiOpponentModel[];
  adaptivePlan: AiActorMemory['adaptivePlan'];
}

export interface MemoryInfluenceDecisionLike {
  type?: string;
  score?: number;
  memoryInfluence?: number;
  memoryReasons?: string[];
  memoryInfluenceSlices?: AiMemoryInfluenceSlice[];
}

export type MemoryAuditSeverity = 'info' | 'warn' | 'fail';

export interface MemoryInfluenceAuditFinding {
  code: string;
  severity: MemoryAuditSeverity;
  message: string;
}

export interface MemoryEvalResult {
  id: string;
  name: string;
  passed: boolean;
  detail?: string;
}


// --- source: horizon.ts ---
  AGENT19_EXPLAINABILITY_DISCLAIMER,
  type AiActorMemory,
  type AiMemoryHorizonSnapshot,
} from './types.ts';

export function createEmptyAiActorMemory(ownerActorId: string): AiActorMemory {
  return {
    ownerActorId,
    events: [],
    relationships: {},
    opponentModels: {},
    adaptivePlan: null,
    seenKeys: [],
    lastDecayTurn: 0,
  };
}

/** Summarize match-local vs cross-match prior (mirrors V9.4 `buildAiMemoryHorizonSnapshot`). */
export function buildAiMemoryHorizonSnapshot(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): AiMemoryHorizonSnapshot {
  const m = memory || createEmptyAiActorMemory('');
  let longTermPriorBeliefCount = 0;
  let matchLearnedObservationCount = 0;
  Object.values(m.opponentModels || {}).forEach(om => {
    matchLearnedObservationCount += om.totalOpportunities || 0;
    Object.values(om.beliefs || {}).forEach(b => {
      if (b.source === 'persistent_prior' && b.confidence > 0.05) longTermPriorBeliefCount += 1;
    });
  });
  const persistentOn = opts?.persistentMemoryEnabled === true;
  const qualityNote =
    longTermPriorBeliefCount > 0 && persistentOn
      ? 'Cross-match priors (saved on this device) nudge expectations; committed actions in this match still update relationships and observed tendencies.'
      : matchLearnedObservationCount > 0 || m.events.length > 0
        ? "Only this match's committed events, relationship scores, and observed actions feed memory influence right now."
        : 'Memory influence is idle until committed actions are recorded this match.';
  return {
    shortTermEventCount: m.events.length,
    shortTermRelationshipCount: Object.keys(m.relationships || {}).length,
    matchLearnedObservationCount,
    longTermPriorBeliefCount,
    longTermPriorActive: persistentOn && longTermPriorBeliefCount > 0,
    qualityNote,
    explainabilityDisclaimer: AGENT19_EXPLAINABILITY_DISCLAIMER,
  };
}


// --- source: explainability.ts ---

export function describeHorizonForPlayer(snapshot: AiMemoryHorizonSnapshot): string {
  const parts: string[] = [snapshot.qualityNote];
  if (snapshot.longTermPriorActive) {
    parts.push(
      `${snapshot.longTermPriorBeliefCount} cross-match prior belief(s) are active alongside ${snapshot.shortTermEventCount} event(s) this match.`,
    );
  } else if (snapshot.shortTermEventCount > 0) {
    parts.push(`${snapshot.shortTermEventCount} remembered event(s) and ${snapshot.shortTermRelationshipCount} relationship track(s) this match.`);
  }
  parts.push(snapshot.explainabilityDisclaimer);
  return parts.join(' ');
}

export function buildMemoryExplainabilityBrief(
  snapshot: AiMemoryHorizonSnapshot,
  slices?: AiMemoryInfluenceSlice[],
): string[] {
  const lines = [describeHorizonForPlayer(snapshot)];
  if (slices?.length) {
    lines.push('Score adjustments from memory this decision:');
    slices.slice(0, 5).forEach(s => {
      const sign = s.delta >= 0 ? '+' : '';
      lines.push(`• [${s.horizon}] ${sign}${s.delta.toFixed(2)} — ${s.reason}`);
    });
  }
  return lines;
}

export function summarizeSlicesByHorizon(
  slices: AiMemoryInfluenceSlice[],
): Record<string, { totalDelta: number; count: number }> {
  const out: Record<string, { totalDelta: number; count: number }> = {};
  slices.forEach(s => {
    const bucket = out[s.horizon] || { totalDelta: 0, count: 0 };
    bucket.totalDelta = Math.round((bucket.totalDelta + s.delta) * 100) / 100;
    bucket.count += 1;
    out[s.horizon] = bucket;
  });
  return out;
}

export function formatHorizonBadge(horizon: AiMemoryHorizon): string {
  switch (horizon) {
    case 'short_term_match':
      return 'Match memory';
    case 'long_term_prior':
      return 'Cross-match prior';
    case 'team_directive':
      return 'Team directive';
    default:
      return horizon;
  }
}

export function rankInfluenceSlicesByMagnitude(slices: AiMemoryInfluenceSlice[], limit = 5): AiMemoryInfluenceSlice[] {
  return slices
    .slice()
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.horizon.localeCompare(b.horizon))
    .slice(0, limit);
}


// --- source: negotiation-explainability.ts ---

const memNum = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Negotiation: trust/gratitude lower the acceptance bar, grievance raises it; a shared threat helps. */
export function computeNegotiationThresholdShift(
  rel: Partial<AiRelationship> | null | undefined,
  ctx: { dealAffordable?: boolean; thirdPartyThreat?: number },
): { shift: number; reasons: string[] } {
  const reasons: string[] = [];
  let shift = 0;
  if (rel) {
    const trust = memNum(rel.trust, 50);
    const grievance = memNum(rel.grievance);
    const gratitude = memNum(rel.gratitude);
    if (trust > 60) {
      shift -= (trust - 60) / 400;
      reasons.push('trusts this counterpart');
    }
    if (trust < 40) {
      shift += (40 - trust) / 400;
      reasons.push('distrusts this counterpart');
    }
    if (grievance > 10) {
      shift += Math.min(0.1, grievance / 300);
      reasons.push('holds a grievance');
    }
    if (gratitude > 10) {
      shift -= Math.min(0.08, gratitude / 400);
      reasons.push('is grateful for past help');
    }
  }
  if (memNum(ctx.thirdPartyThreat) > 40 && ctx.dealAffordable) {
    shift -= 0.04;
    reasons.push('a common threat makes a deal attractive');
  }
  return {
    shift: Math.max(-0.2, Math.min(0.2, Math.round(shift * 1000) / 1000)),
    reasons,
  };
}

export function formatNegotiationExplainability(
  rel: Partial<AiRelationship> | null | undefined,
  ctx: { dealAffordable?: boolean; thirdPartyThreat?: number; counterpartLabel?: string },
): string[] {
  const { shift, reasons } = computeNegotiationThresholdShift(rel, ctx);
  const who = ctx.counterpartLabel || rel?.actorId || 'this counterpart';
  const lines = [
    `Memory adjusts the deal acceptance threshold by ${shift >= 0 ? '+' : ''}${shift.toFixed(3)} for ${who}.`,
  ];
  if (reasons.length) {
    lines.push(`Factors: ${reasons.join('; ')}.`);
  } else {
    lines.push('No relationship memory is shifting negotiation yet.');
  }
  lines.push('Negotiation memory is bounded (±0.2) and never blocks legal offers.');
  return lines;
}


// --- source: inspection-explainability.ts ---
  AiActorMemory,
  AiMemoryEvent,
  AiMemoryHorizonSnapshot,
  AiMemoryInspectionView,
  AiOpponentModel,
  AiRelationship,
} from './types.ts';

/** Inspection respects authority: rivals' private beliefs stay hidden without Full Inspection. */
export function getFilteredAiMemoryInspectionView(
  memory: AiActorMemory | null | undefined,
  opts: {
    viewerId?: string;
    viewerTeamId?: string | null;
    ownerTeamId?: string | null;
    teammateIds?: string[];
    fullInspection?: boolean;
    persistentMemoryEnabled?: boolean;
  },
): AiMemoryInspectionView {
  const m = memory || createEmptyAiActorMemory('');
  const ally =
    Boolean(opts.fullInspection) ||
    Boolean(opts.viewerTeamId && opts.ownerTeamId && opts.viewerTeamId === opts.ownerTeamId);
  const redacted = !ally;
  const rels = Object.values(m.relationships).sort((a, b) => a.actorId.localeCompare(b.actorId));
  const profiles = Object.values(m.opponentModels).map(om => ({
    actorId: om.actorId,
    aggressionPreference: om.beliefs.aggressive?.value ?? 0,
    expansionPreference: om.beliefs.expansion?.value ?? 0,
    economicPreference: om.beliefs.economic?.value ?? 0,
    cooperationPreference: om.beliefs.cooperative?.value ?? 0,
    confidence: Math.max(0, ...Object.values(om.beliefs).map(b => b.confidence)),
    observationCount: om.totalOpportunities,
  }));
  const strongest = rels.slice().sort((a, b) => b.rivalry + b.grievance - (a.rivalry + a.grievance))[0];
  const horizonSnapshot = buildAiMemoryHorizonSnapshot(m, { persistentMemoryEnabled: opts.persistentMemoryEnabled });
  return {
    ownerActorId: m.ownerActorId,
    isRedacted: redacted,
    eventCount: m.events.length,
    horizonSnapshot,
    influenceSummary:
      strongest && strongest.rivalry + strongest.grievance > 10
        ? `Most wary of ${strongest.actorId} (rivalry ${strongest.rivalry}, grievance ${strongest.grievance}).`
        : m.events.length
          ? 'Memory is shaping choices only lightly so far.'
          : null,
    recentEvents: (redacted ? m.events.filter(e => Math.abs(e.valence) >= 0.3) : m.events).slice(-8).reverse(),
    relationships: redacted
      ? rels.filter(r => (opts.teammateIds || []).includes(r.actorId) || r.actorId === opts.viewerId)
      : rels,
    majorGrievances: m.events.filter(e => e.valence <= -0.6).slice(-4).reverse(),
    majorGratitude: m.events.filter(e => e.valence >= 0.6).slice(-4).reverse(),
    strategicProfiles: redacted ? [] : profiles,
    opponentModels: redacted ? [] : Object.values(m.opponentModels),
    adaptivePlan: redacted ? null : m.adaptivePlan,
  };
}

export function describeRelationshipForInspection(rel: AiRelationship): string {
  const tone =
    rel.grievance > rel.gratitude + 15
      ? 'wary'
      : rel.gratitude > rel.grievance + 15
        ? 'warm'
        : 'mixed';
  return `${rel.actorId}: trust ${rel.trust.toFixed(0)}, rivalry ${rel.rivalry.toFixed(0)}, grievance ${rel.grievance.toFixed(0)}, gratitude ${rel.gratitude.toFixed(0)} (${tone}).`;
}

export function buildInspectionExplainabilityNarrative(view: AiMemoryInspectionView): string[] {
  const lines: string[] = [];
  lines.push(describeHorizonLine(view.horizonSnapshot));
  if (view.isRedacted) {
    lines.push('Rival private beliefs are hidden — only high-signal events and safe relationship rows are shown.');
  }
  if (view.influenceSummary) lines.push(view.influenceSummary);
  view.relationships.slice(0, 6).forEach(r => lines.push(describeRelationshipForInspection(r)));
  if (view.majorGrievances?.length) {
    lines.push(`Notable grievances (${view.majorGrievances.length}): ${view.majorGrievances.map(e => e.summary).slice(0, 2).join('; ')}`);
  }
  if (view.majorGratitude?.length) {
    lines.push(`Notable gratitude (${view.majorGratitude.length}): ${view.majorGratitude.map(e => e.summary).slice(0, 2).join('; ')}`);
  }
  if (!view.isRedacted && view.strategicProfiles.length) {
    const top = view.strategicProfiles[0];
    lines.push(
      `Learned tendency toward ${top.actorId}: aggression ${(top.aggressionPreference * 100).toFixed(0)}%, expansion ${(top.expansionPreference * 100).toFixed(0)}% (${top.observationCount} observations).`,
    );
  }
  if (view.adaptivePlan && !view.isRedacted) {
    lines.push(`Adaptive plan: ${view.adaptivePlan.objectiveId.replace(/_/g, ' ')} (${view.adaptivePlan.status}).`);
  }
  lines.push(view.horizonSnapshot.explainabilityDisclaimer);
  return lines;
}

function describeHorizonLine(snapshot: AiMemoryHorizonSnapshot): string {
  if (snapshot.longTermPriorActive) {
    return `Memory mixes ${snapshot.shortTermEventCount} match event(s) with ${snapshot.longTermPriorBeliefCount} cross-match prior belief(s).`;
  }
  return snapshot.qualityNote;
}

export function summarizeRecentEventsForAskTheGame(events: AiMemoryEvent[], limit = 4): string[] {
  return events.slice(0, limit).map(e => `Turn ${e.turn}: ${e.summary} (${e.valence >= 0 ? 'helpful' : e.valence <= 0 ? 'hostile' : 'neutral'} signal).`);
}


// --- source: memory-bounds-audit.ts ---

/** Match V9.4 bounded event history cap. */
export const AGENT19_AI_MEMORY_EVENT_CAP = 60;
export const AGENT19_MAX_RELATIONSHIP_ACTORS = 12;
export const AGENT19_MAX_OPPONENT_MODELS = 12;
export const AGENT19_MAX_SEEN_KEYS = AGENT19_AI_MEMORY_EVENT_CAP * 2;

export function auditActorMemoryBounds(memory: AiActorMemory | null | undefined): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory) return findings;
  if (memory.events.length > AGENT19_AI_MEMORY_EVENT_CAP) {
    findings.push({
      code: 'events_over_cap',
      severity: 'fail',
      message: `${memory.events.length} events exceeds cap ${AGENT19_AI_MEMORY_EVENT_CAP}.`,
    });
  }
  if (Object.keys(memory.relationships || {}).length > AGENT19_MAX_RELATIONSHIP_ACTORS) {
    findings.push({
      code: 'relationships_over_cap',
      severity: 'fail',
      message: 'Too many relationship tracks stored.',
    });
  }
  if (Object.keys(memory.opponentModels || {}).length > AGENT19_MAX_OPPONENT_MODELS) {
    findings.push({
      code: 'opponent_models_over_cap',
      severity: 'fail',
      message: 'Too many opponent models stored.',
    });
  }
  if ((memory.seenKeys || []).length > AGENT19_MAX_SEEN_KEYS) {
    findings.push({
      code: 'seen_keys_over_cap',
      severity: 'fail',
      message: 'seenKeys exceeds bounded idempotency window.',
    });
  }
  memory.events.forEach((e, i) => {
    if (!e.stableKey?.trim()) {
      findings.push({ code: 'event_missing_stable_key', severity: 'warn', message: `Event ${i} missing stableKey.` });
    }
    if (Math.abs(e.valence) > 1.01) {
      findings.push({ code: 'event_valence_out_of_range', severity: 'warn', message: `Event ${i} valence ${e.valence} outside [-1,1].` });
    }
  });
  return findings;
}

export function memoryBoundsOk(memory: AiActorMemory | null | undefined): boolean {
  return !auditActorMemoryBounds(memory).some(f => f.severity === 'fail');
}


// --- source: decision-trace.ts ---
  AiMemoryHorizonSnapshot,
  AiMemoryInfluenceSlice,
  MemoryInfluenceDecisionLike,
} from './types.ts';

export interface Agent19DecisionTraceReport {
  decisionType: string;
  baseScore: number;
  adjustedScore: number;
  memoryInfluence: number;
  horizonSnapshot: AiMemoryHorizonSnapshot;
  narrativeLines: string[];
  sliceSummaryByHorizon: Record<string, { totalDelta: number; count: number }>;
}

export const AGENT19_HORIZON_LABELS: Record<string, string> = {
  short_term_match: 'This match',
  long_term_prior: 'Earlier matches (saved prior)',
  team_directive: 'Team plan directive',
};

export function labelMemoryHorizon(horizon: AiMemoryInfluenceSlice['horizon']): string {
  return AGENT19_HORIZON_LABELS[horizon] || horizon;
}

export function buildAgent19DecisionTraceReport(params: {
  before: MemoryInfluenceDecisionLike;
  after: MemoryInfluenceDecisionLike;
  horizonSnapshot: AiMemoryHorizonSnapshot;
}): Agent19DecisionTraceReport {
  const baseScore = params.before.score ?? 0;
  const adjustedScore = params.after.score ?? 0;
  const memoryInfluence = params.after.memoryInfluence ?? 0;
  const slices = params.after.memoryInfluenceSlices || [];
  const sliceSummaryByHorizon: Record<string, { totalDelta: number; count: number }> = {};
  slices.forEach(s => {
    const b = sliceSummaryByHorizon[s.horizon] || { totalDelta: 0, count: 0 };
    b.totalDelta = Math.round((b.totalDelta + s.delta) * 100) / 100;
    b.count += 1;
    sliceSummaryByHorizon[s.horizon] = b;
  });
  const narrativeLines = [
    `Decision "${params.after.type || params.before.type || 'unknown'}": base score ${baseScore}, after memory ${adjustedScore} (${memoryInfluence >= 0 ? '+' : ''}${memoryInfluence.toFixed(2)}).`,
    ...buildMemoryExplainabilityBrief(params.horizonSnapshot, slices),
  ];
  return {
    decisionType: String(params.after.type || params.before.type || 'unknown'),
    baseScore,
    adjustedScore,
    memoryInfluence,
    horizonSnapshot: params.horizonSnapshot,
    narrativeLines,
    sliceSummaryByHorizon,
  };
}

export function compareHorizonSnapshots(before: AiMemoryHorizonSnapshot, after: AiMemoryHorizonSnapshot): string[] {
  const lines: string[] = [];
  if (before.shortTermEventCount !== after.shortTermEventCount) {
    lines.push(`Match events: ${before.shortTermEventCount} → ${after.shortTermEventCount}.`);
  }
  if (before.longTermPriorBeliefCount !== after.longTermPriorBeliefCount) {
    lines.push(`Cross-match priors: ${before.longTermPriorBeliefCount} → ${after.longTermPriorBeliefCount}.`);
  }
  if (before.longTermPriorActive !== after.longTermPriorActive) {
    lines.push(
      `Cross-match prior influence: ${before.longTermPriorActive ? 'active' : 'idle'} → ${after.longTermPriorActive ? 'active' : 'idle'}.`,
    );
  }
  if (!lines.length) lines.push('Horizon snapshot unchanged.');
  return lines;
}


// --- source: prior-explainability.ts ---

export interface PersistentPriorExplainLine {
  subjectActorId: string;
  beliefKey: string;
  value: number;
  confidence: number;
  line: string;
}

export function listPersistentPriorBeliefs(memory: AiActorMemory | null | undefined): PersistentPriorExplainLine[] {
  const out: PersistentPriorExplainLine[] = [];
  Object.values(memory?.opponentModels || {}).forEach((om: AiOpponentModel) => {
    Object.values(om.beliefs || {}).forEach((b: AiBelief) => {
      if (b.source !== 'persistent_prior' || b.confidence <= 0.05) return;
      out.push({
        subjectActorId: om.actorId,
        beliefKey: b.key,
        value: b.value,
        confidence: b.confidence,
        line: `Saved prior: ${om.actorId} tends toward ${b.key} (${(b.value * 100).toFixed(0)}% estimate, confidence ${(b.confidence * 100).toFixed(0)}%).`,
      });
    });
  });
  return out.sort((a, b) => b.confidence - a.confidence || a.subjectActorId.localeCompare(b.subjectActorId));
}

export function buildPersistentPriorExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): string[] {
  if (!opts?.persistentMemoryEnabled) {
    return ['Cross-match priors are off — only this match’s observations affect expectations.'];
  }
  const priors = listPersistentPriorBeliefs(memory);
  if (!priors.length) {
    return ['Persistent memory is on, but no cross-match prior beliefs are active yet in this match.'];
  }
  return [
    `${priors.length} cross-match prior belief(s) nudge expectations until this match observes more:`,
    ...priors.slice(0, 4).map(p => `• ${p.line}`),
    'Priors are capped and never override committed events or legal actions.',
  ];
}


// --- source: adaptive-plan-explainability.ts ---

export function explainAdaptivePlan(memory: AiActorMemory | null | undefined): string[] {
  const plan = memory?.adaptivePlan;
  if (!plan) {
    return ['No adaptive counter-plan is active — memory has not revised a rival-focused objective yet.'];
  }
  const objective = plan.objectiveId.replace(/_/g, ' ');
  const lines = [`Adaptive plan: ${objective} (${plan.status}).`];
  if (plan.revisionReason) {
    lines.push(`Revision: ${plan.revisionReason}`);
  }
  lines.push('Adaptive plans are suggestions inside scoring — they never execute actions directly.');
  return lines;
}

export function adaptivePlanSummaryForInspection(memory: AiActorMemory | null | undefined): string | null {
  const plan = memory?.adaptivePlan;
  if (!plan) return null;
  return `${plan.status} counter-plan: ${plan.objectiveId.replace(/_/g, ' ')}`;
}


// --- source: memory-health-scorecard.ts ---

export interface MemoryHealthScorecard {
  boundsOk: boolean;
  eventCount: number;
  relationshipCount: number;
  priorBeliefCount: number;
  healthScore: number;
  band: 'excellent' | 'good' | 'fair' | 'degraded';
  findings: MemoryInfluenceAuditFinding[];
  summaryLine: string;
}

export function computeMemoryHealthScorecard(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean },
): MemoryHealthScorecard {
  const findings = auditActorMemoryBounds(memory);
  const boundsOk = memoryBoundsOk(memory);
  const snap = buildAiMemoryHorizonSnapshot(memory, opts);
  let healthScore = 100;
  findings.forEach(f => {
    if (f.severity === 'fail') healthScore -= 25;
    else if (f.severity === 'warn') healthScore -= 8;
  });
  if (!boundsOk) healthScore = Math.min(healthScore, 40);
  healthScore = Math.max(0, Math.min(100, healthScore));
  const band: MemoryHealthScorecard['band'] =
    healthScore >= 90 ? 'excellent' : healthScore >= 75 ? 'good' : healthScore >= 50 ? 'fair' : 'degraded';
  const summaryLine = boundsOk
    ? `Memory health ${healthScore}/100 (${band}): ${snap.shortTermEventCount} events, ${snap.shortTermRelationshipCount} relationships tracked.`
    : `Memory health ${healthScore}/100 (${band}): bounds audit failed — see findings.`;
  return {
    boundsOk,
    eventCount: snap.shortTermEventCount,
    relationshipCount: snap.shortTermRelationshipCount,
    priorBeliefCount: snap.longTermPriorBeliefCount,
    healthScore,
    band,
    findings,
    summaryLine,
  };
}

export function formatMemoryHealthBrief(scorecard: MemoryHealthScorecard): string[] {
  const lines = [scorecard.summaryLine];
  scorecard.findings.slice(0, 4).forEach(f => lines.push(`[${f.severity}] ${f.message}`));
  return lines;
}


// --- source: turn-influence-summary.ts ---

export interface TurnMemoryInfluenceSummary {
  decisionCount: number;
  influencedDecisionCount: number;
  totalInfluenceDelta: number;
  maxSingleInfluence: number;
  auditOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  byHorizon: Record<string, { totalDelta: number; count: number }>;
  narrativeLines: string[];
}

export function summarizeTurnMemoryInfluence<T extends MemoryInfluenceDecisionLike>(
  before: T[],
  after: T[],
): TurnMemoryInfluenceSummary {
  const findings = auditMemoryInfluenceDecisions(before, after);
  const auditOk = auditFindingsOk(findings);
  let influencedDecisionCount = 0;
  let totalInfluenceDelta = 0;
  let maxSingleInfluence = 0;
  const allSlices = after.flatMap(d => d.memoryInfluenceSlices || []);
  after.forEach(d => {
    const inf = d.memoryInfluence ?? 0;
    if (inf) influencedDecisionCount += 1;
    totalInfluenceDelta += inf;
    maxSingleInfluence = Math.max(maxSingleInfluence, Math.abs(inf));
  });
  totalInfluenceDelta = Math.round(totalInfluenceDelta * 100) / 100;
  const byHorizon = summarizeSlicesByHorizon(allSlices);
  const narrativeLines = [
    `${after.length} scored options; ${influencedDecisionCount} adjusted by memory (total Δ ${totalInfluenceDelta >= 0 ? '+' : ''}${totalInfluenceDelta}).`,
    `Largest single adjustment: ${maxSingleInfluence.toFixed(2)}.`,
  ];
  Object.entries(byHorizon).forEach(([h, v]) => {
    narrativeLines.push(`Horizon ${h}: ${v.count} slice(s), Δ ${v.totalDelta >= 0 ? '+' : ''}${v.totalDelta.toFixed(2)}.`);
  });
  if (!auditOk) narrativeLines.push('Audit flagged trace inconsistencies — memory must not drop options.');
  return {
    decisionCount: after.length,
    influencedDecisionCount,
    totalInfluenceDelta,
    maxSingleInfluence,
    auditOk,
    findings,
    byHorizon,
    narrativeLines,
  };
}


// --- source: explainability-claims.ts ---

export type MemoryGiClaimKind = 'fact' | 'interpretation' | 'policy';

export interface MemoryGiClaim {
  id: string;
  kind: MemoryGiClaimKind;
  text: string;
  confidence: 'confirmed' | 'likely' | 'policy';
}

/** Ask-the-Game style claims derived only from inspection-safe memory views. */
export function buildMemoryGiClaims(params: {
  horizon: AiMemoryHorizonSnapshot;
  inspection?: AiMemoryInspectionView | null;
  memoryInfluenceEnabled?: boolean;
}): MemoryGiClaim[] {
  const claims: MemoryGiClaim[] = [];
  if (params.memoryInfluenceEnabled === false) {
    claims.push({
      id: 'mem_off',
      kind: 'policy',
      text: 'AI memory influence is turned off in settings — relationships may still display but do not adjust scores.',
      confidence: 'confirmed',
    });
    return claims;
  }
  claims.push({
    id: 'mem_rule_based',
    kind: 'policy',
    text: AGENT19_EXPLAINABILITY_DISCLAIMER,
    confidence: 'policy',
  });
  if (params.horizon.longTermPriorActive) {
    claims.push({
      id: 'mem_priors',
      kind: 'fact',
      text: `${params.horizon.longTermPriorBeliefCount} cross-match prior belief(s) are active alongside this match’s events.`,
      confidence: 'confirmed',
    });
  } else if (params.horizon.shortTermEventCount > 0) {
    claims.push({
      id: 'mem_match_only',
      kind: 'fact',
      text: `Memory is using ${params.horizon.shortTermEventCount} committed event(s) from this match only.`,
      confidence: 'confirmed',
    });
  } else {
    claims.push({
      id: 'mem_idle',
      kind: 'fact',
      text: 'AI memory has not recorded committed events this match yet.',
      confidence: 'confirmed',
    });
  }
  const view = params.inspection;
  if (view?.isRedacted) {
    claims.push({
      id: 'mem_redacted',
      kind: 'policy',
      text: 'Rival private beliefs stay hidden unless full memory inspection is enabled.',
      confidence: 'policy',
    });
  }
  if (view?.influenceSummary) {
    claims.push({
      id: 'mem_influence',
      kind: 'interpretation',
      text: view.influenceSummary,
      confidence: 'likely',
    });
  }
  return claims;
}

export function formatGiClaimsAsBrief(claims: MemoryGiClaim[]): string[] {
  return claims.map(c => `[${c.kind}] ${c.text}`);
}


// --- source: memory-event-timeline.ts ---

export interface MemoryEventTimelineEntry {
  turn: number;
  actionType: string;
  actorId: string;
  targetId: string | null;
  summaryLine: string;
  valenceLabel: 'positive' | 'negative' | 'neutral';
  importance: number;
}

export const AGENT19_TIMELINE_DISPLAY_CAP = 12;

function valenceLabel(valence: number): MemoryEventTimelineEntry['valenceLabel'] {
  if (valence > 0.05) return 'positive';
  if (valence < -0.05) return 'negative';
  return 'neutral';
}

export function formatMemoryEventForTimeline(event: AiMemoryEvent): MemoryEventTimelineEntry {
  const target = event.targetId ? ` → ${event.targetId}` : '';
  return {
    turn: event.turn,
    actionType: event.actionType,
    actorId: event.actorId,
    targetId: event.targetId,
    summaryLine: `Turn ${event.turn}: ${event.actorId} ${event.actionType}${target} — ${event.summary}`,
    valenceLabel: valenceLabel(event.valence),
    importance: event.importance,
  };
}

/** Chronological, capped timeline for explainability panels (newest last). */
export function buildMemoryEventTimeline(
  memory: AiActorMemory | null | undefined,
  opts?: { limit?: number; minImportance?: number },
): MemoryEventTimelineEntry[] {
  const limit = opts?.limit ?? AGENT19_TIMELINE_DISPLAY_CAP;
  const minImportance = opts?.minImportance ?? 0;
  const events = (memory?.events || [])
    .filter(e => e.importance >= minImportance)
    .slice()
    .sort((a, b) => a.turn - b.turn || a.id.localeCompare(b.id));
  const tail = events.length > limit ? events.slice(-limit) : events;
  return tail.map(formatMemoryEventForTimeline);
}

export function summarizeMemoryEventTimeline(entries: MemoryEventTimelineEntry[]): string[] {
  if (!entries.length) return ['No committed memory events in this view yet.'];
  const lines = [`${entries.length} event(s) in timeline (most recent last).`];
  entries.slice(-5).forEach(e => lines.push(`• ${e.summaryLine}`));
  return lines;
}


// --- source: relationship-explainability.ts ---

export interface RelationshipExplainabilityAxis {
  key: keyof Pick<AiRelationship, 'trust' | 'respect' | 'rivalry' | 'cooperation' | 'grievance' | 'gratitude'>;
  label: string;
  value: number;
}

const AXIS_LABELS: Record<RelationshipExplainabilityAxis['key'], string> = {
  trust: 'Trust',
  respect: 'Respect',
  rivalry: 'Rivalry',
  cooperation: 'Cooperation',
  grievance: 'Grievance',
  gratitude: 'Gratitude',
};

export function pickDominantRelationshipAxes(rel: AiRelationship, limit = 3): RelationshipExplainabilityAxis[] {
  const keys = Object.keys(AXIS_LABELS) as RelationshipExplainabilityAxis['key'][];
  const ranked = keys
    .map(key => ({ key, label: AXIS_LABELS[key], value: rel[key] ?? 0 }))
    .sort((a, b) => Math.abs(b.value - 50) - Math.abs(a.value - 50) || b.value - a.value);
  return ranked.slice(0, limit);
}

export function buildRelationshipExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  targetActorId: string,
): string[] {
  const rel = memory?.relationships?.[targetActorId];
  if (!rel) {
    return [`No relationship track yet toward ${targetActorId} — influence from match events will appear after committed actions.`];
  }
  const axes = pickDominantRelationshipAxes(rel);
  const lines = [
    `Relationship toward ${targetActorId} (updated turn ${rel.lastUpdatedTurn}):`,
    ...axes.map(a => `• ${a.label} ${a.value}/100`),
  ];
  if (rel.threat >= 60) lines.push('High perceived threat may push defensive or aggressive memory nudges.');
  if (rel.grievance >= 55) lines.push('Stored grievances can amplify punitive score adjustments.');
  if (rel.gratitude >= 55) lines.push('Gratitude can soften rivalry-driven penalties when cooperation is high.');
  return lines;
}

export function listTrackedRelationshipActorIds(memory: AiActorMemory | null | undefined): string[] {
  return Object.keys(memory?.relationships || {}).sort();
}


// --- source: memory-retention-audit.ts ---

/** Read-only retention / ordering checks (eviction is canonical-side; this audits explainability safety). */
export function auditMemoryRetentionOrdering(memory: AiActorMemory | null | undefined): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory?.events?.length) return findings;
  const events = memory.events;
  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const cur = events[i];
    if (cur.turn < prev.turn) {
      findings.push({
        code: 'events_turn_order',
        severity: 'warn',
        message: `Event ${i} turn ${cur.turn} precedes prior turn ${prev.turn} in storage order.`,
      });
    }
  }
  const keyCounts = new Map<string, number>();
  events.forEach(e => {
    const k = e.stableKey?.trim();
    if (!k) return;
    keyCounts.set(k, (keyCounts.get(k) || 0) + 1);
  });
  keyCounts.forEach((count, key) => {
    if (count > 1) {
      findings.push({
        code: 'duplicate_stable_key',
        severity: 'warn',
        message: `stableKey "${key}" appears ${count} times — idempotent commits may be duplicated in narrative.`,
      });
    }
  });
  if (events.length >= AGENT19_AI_MEMORY_EVENT_CAP) {
    findings.push({
      code: 'events_at_cap',
      severity: 'info',
      message: `Event list at cap (${AGENT19_AI_MEMORY_EVENT_CAP}); oldest entries may be evicted canonically while summaries stay bounded.`,
    });
  }
  return findings;
}

export function retentionAuditOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}


// --- source: turn-explainability-pack.ts ---

export interface TurnExplainabilityPack {
  turn: number;
  horizonBefore: AiMemoryHorizonSnapshot;
  horizonAfter: AiMemoryHorizonSnapshot;
  horizonDiffLines: string[];
  influenceSummary: ReturnType<typeof summarizeTurnMemoryInfluence>;
  topSlices: ReturnType<typeof rankInfluenceSlicesByMagnitude>;
  timelineLines: string[];
  narrativeLines: string[];
}

export function buildTurnExplainabilityPack(params: {
  turn: number;
  memoryBefore: AiActorMemory | null | undefined;
  memoryAfter: AiActorMemory | null | undefined;
  decisionsBefore: MemoryInfluenceDecisionLike[];
  decisionsAfter: MemoryInfluenceDecisionLike[];
  persistentMemoryEnabled?: boolean;
}): TurnExplainabilityPack {
  const horizonBefore = buildAiMemoryHorizonSnapshot(params.memoryBefore, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const horizonAfter = buildAiMemoryHorizonSnapshot(params.memoryAfter, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const horizonDiffLines = compareHorizonSnapshots(horizonBefore, horizonAfter);
  const influenceSummary = summarizeTurnMemoryInfluence(params.decisionsBefore, params.decisionsAfter);
  const allSlices = params.decisionsAfter.flatMap(d => d.memoryInfluenceSlices || []);
  const topSlices = rankInfluenceSlicesByMagnitude(allSlices, 4);
  const timelineLines = summarizeMemoryEventTimeline(buildMemoryEventTimeline(params.memoryAfter));
  const narrativeLines = [
    `Turn ${params.turn} memory explainability pack.`,
    ...horizonDiffLines,
    ...influenceSummary.narrativeLines,
    ...timelineLines.slice(0, 3),
  ];
  if (topSlices.length) {
    narrativeLines.push('Strongest influence slices this turn:');
    topSlices.forEach(s => narrativeLines.push(`• [${s.horizon}] ${s.delta >= 0 ? '+' : ''}${s.delta.toFixed(2)} — ${s.reason}`));
  }
  return {
    turn: params.turn,
    horizonBefore,
    horizonAfter,
    horizonDiffLines,
    influenceSummary,
    topSlices,
    timelineLines,
    narrativeLines,
  };
}


// --- source: influence-audit.ts ---

/** Per-decision cap documented in V9.4 influence (directives + learning + prior nudges). */
export const AGENT19_MAX_SINGLE_DECISION_INFLUENCE = 55;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function auditMemoryInfluenceDecisionPair<T extends MemoryInfluenceDecisionLike>(
  before: T,
  after: T,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  const base = before.score ?? 0;
  const next = after.score ?? 0;
  const influence = after.memoryInfluence;
  if (influence === undefined || influence === 0) {
    if (next !== base) {
      findings.push({
        code: 'score_changed_without_trace',
        severity: 'warn',
        message: `Score changed (${base} → ${next}) without memoryInfluence trace.`,
      });
    }
    return findings;
  }
  const expected = round2(base + influence);
  if (Math.abs(expected - next) > 0.02) {
    findings.push({
      code: 'score_influence_mismatch',
      severity: 'fail',
      message: `score ${next} != base ${base} + influence ${influence} (expected ${expected}).`,
    });
  }
  if (Math.abs(influence) > AGENT19_MAX_SINGLE_DECISION_INFLUENCE) {
    findings.push({
      code: 'influence_cap_exceeded',
      severity: 'fail',
      message: `memoryInfluence ${influence} exceeds cap ${AGENT19_MAX_SINGLE_DECISION_INFLUENCE}.`,
    });
  }
  const slices = after.memoryInfluenceSlices || [];
  const sliceSum = round2(slices.reduce((s, x) => s + x.delta, 0));
  if (slices.length && Math.abs(sliceSum - influence) > 0.05) {
    findings.push({
      code: 'slice_sum_mismatch',
      severity: 'warn',
      message: `Slice sum ${sliceSum} differs from memoryInfluence ${influence}.`,
    });
  }
  const reasons = after.memoryReasons || [];
  if (reasons.length && reasons.length !== Math.min(slices.length, 5)) {
    findings.push({
      code: 'reason_count_drift',
      severity: 'info',
      message: `${reasons.length} memoryReasons vs ${slices.length} slices (canonical caps at 5 reasons).`,
    });
  }
  slices.forEach((s, i) => {
    if (!s.reason?.trim()) {
      findings.push({ code: 'empty_slice_reason', severity: 'fail', message: `Slice ${i} missing reason.` });
    }
  });
  return findings;
}

export function auditMemoryInfluenceDecisions<T extends MemoryInfluenceDecisionLike>(
  before: T[],
  after: T[],
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (before.length !== after.length) {
    findings.push({
      code: 'option_count_changed',
      severity: 'fail',
      message: `Decision count changed (${before.length} → ${after.length}); memory must not remove options.`,
    });
    return findings;
  }
  before.forEach((b, i) => {
    auditMemoryInfluenceDecisionPair(b, after[i]).forEach(f => findings.push(f));
  });
  return findings;
}

export function auditFindingsOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}


// --- source: eval/run-suite.ts ---
  auditFindingsOk,
  auditMemoryInfluenceDecisions,
  AGENT19_MAX_SINGLE_DECISION_INFLUENCE,
} from '../influence-audit.ts';
  buildMemoryExplainabilityBrief,
  formatHorizonBadge,
  rankInfluenceSlicesByMagnitude,
  summarizeSlicesByHorizon,
} from '../explainability.ts';
  buildInspectionExplainabilityNarrative,
  getFilteredAiMemoryInspectionView,
} from '../inspection-explainability.ts';
  buildAgent19DecisionTraceReport,
  compareHorizonSnapshots,
  labelMemoryHorizon,
} from '../decision-trace.ts';
  buildMemoryEventTimeline,
  summarizeMemoryEventTimeline,
  AGENT19_TIMELINE_DISPLAY_CAP,
} from '../memory-event-timeline.ts';
  buildRelationshipExplainabilityBrief,
  listTrackedRelationshipActorIds,
} from '../relationship-explainability.ts';

type Case = [string, string, () => boolean | string];

function runCases(cases: Case[]): MemoryEvalResult[] {
  return cases.map(([id, name, fn]) => {
    try {
      const r = fn();
      return { id, name, passed: r === true, detail: r === true ? undefined : String(r) };
    } catch (e) {
      return { id, name, passed: false, detail: e instanceof Error ? e.message : String(e) };
    }
  });
}

/** Modular eval cases (no React / localStorage). */
export function runAgent19ModuleSelfTests(): { results: MemoryEvalResult[] } {
  return {
    results: runCases([
      [
        'a19_horizon_idle',
        'Idle memory reports explainability disclaimer',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          return snap.shortTermEventCount === 0 && snap.explainabilityDisclaimer.includes('not a neural') || JSON.stringify(snap);
        },
      ],
      [
        'a19_explain_brief',
        'Explainability brief includes quality note',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const lines = buildMemoryExplainabilityBrief(snap);
          return lines.length >= 1 && lines[0].includes('idle') || lines.join('|');
        },
      ],
      [
        'a19_audit_pass',
        'Audit accepts consistent influence trace',
        () => {
          const before = [{ type: 'sell', score: 10 }];
          const after = [
            {
              type: 'sell',
              score: 12.5,
              memoryInfluence: 2.5,
              memoryReasons: ['test'],
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2.5, reason: 'test' }],
            },
          ];
          const findings = auditMemoryInfluenceDecisions(before, after);
          return auditFindingsOk(findings) || JSON.stringify(findings);
        },
      ],
      [
        'a19_audit_fail_options',
        'Audit fails when decision count drops',
        () => {
          const findings = auditMemoryInfluenceDecisions([{ score: 1 }, { score: 2 }], [{ score: 1 }]);
          return findings.some(f => f.code === 'option_count_changed') || JSON.stringify(findings);
        },
      ],
      [
        'a19_slice_summary',
        'Horizon slice rollup aggregates deltas',
        () => {
          const sum = summarizeSlicesByHorizon([
            { horizon: 'team_directive', delta: 25, reason: 'a' },
            { horizon: 'short_term_match', delta: 3, reason: 'b' },
          ]);
          return sum.team_directive?.totalDelta === 25 && sum.short_term_match?.count === 1 || JSON.stringify(sum);
        },
      ],
      [
        'a19_cap_constant',
        'Documented influence cap is positive',
        () => AGENT19_MAX_SINGLE_DECISION_INFLUENCE >= 40 || String(AGENT19_MAX_SINGLE_DECISION_INFLUENCE),
      ],
      [
        'a19_negotiation_bounded',
        'Negotiation shift stays within ±0.2',
        () => {
          const lo = computeNegotiationThresholdShift({ trust: 10, grievance: 50 }, {});
          const hi = computeNegotiationThresholdShift({ trust: 90, gratitude: 40 }, { dealAffordable: true, thirdPartyThreat: 50 });
          return lo.shift > 0 && hi.shift < 0 && Math.abs(lo.shift) <= 0.2 && Math.abs(hi.shift) <= 0.2 || JSON.stringify({ lo, hi });
        },
      ],
      [
        'a19_negotiation_copy',
        'Negotiation explainability mentions bounded threshold',
        () => {
          const lines = formatNegotiationExplainability({ actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 }, {});
          return lines.some(l => l.includes('±0.2')) || lines.join('|');
        },
      ],
      [
        'a19_inspection_redaction',
        'Inspection narrative notes redaction for rivals',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 3,
            beliefs: { aggressive: { key: 'aggressive', value: 0.6, confidence: 0.4, observations: 2, opportunityCount: 3, source: 'match' } },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const view = getFilteredAiMemoryInspectionView(mem, {
            viewerTeamId: 'team_player',
            ownerTeamId: 'team_opponent',
            persistentMemoryEnabled: false,
          });
          const lines = buildInspectionExplainabilityNarrative(view);
          return view.isRedacted && view.strategicProfiles.length === 0 && lines.some(l => l.includes('hidden')) || JSON.stringify({ view, lines });
        },
      ],
      [
        'a19_bounds_ok',
        'Empty actor memory passes bounds audit',
        () => memoryBoundsOk(createEmptyAiActorMemory('ai')) || JSON.stringify(auditActorMemoryBounds(createEmptyAiActorMemory('ai'))),
      ],
      [
        'a19_bounds_fail',
        'Oversized event list fails bounds audit',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 1 }, (_, i) => ({
            id: `e${i}`,
            turn: i,
            actionType: 'sell',
            actorId: 'player',
            targetId: null,
            regionId: null,
            summary: 's',
            importance: 1,
            valence: 0,
            stableKey: `k${i}`,
          }));
          return !memoryBoundsOk(mem) || 'accepted oversize events';
        },
      ],
      [
        'a19_decision_trace',
        'Decision trace report merges horizon and slices',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const report = buildAgent19DecisionTraceReport({
            before: { type: 'sabotage', score: 10 },
            after: {
              type: 'sabotage',
              score: 14,
              memoryInfluence: 4,
              memoryInfluenceSlices: [
                { horizon: 'short_term_match', delta: 4, reason: 'rivalry' },
                { horizon: 'team_directive', delta: 0, reason: '' },
              ].filter(s => s.delta),
            },
            horizonSnapshot: snap,
          });
          return report.memoryInfluence === 4 && report.narrativeLines.length >= 2 || JSON.stringify(report);
        },
      ],
      [
        'a19_horizon_compare',
        'Horizon diff detects event count change',
        () => {
          const a = buildAiMemoryHorizonSnapshot(null);
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'e1',
              turn: 1,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 's',
              importance: 1,
              valence: 0,
              stableKey: 'k1',
            },
            {
              id: 'e2',
              turn: 2,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 's2',
              importance: 1,
              valence: 0,
              stableKey: 'k2',
            },
          ];
          const b = buildAiMemoryHorizonSnapshot(mem);
          const lines = compareHorizonSnapshots(a, b);
          return lines.some(l => l.includes('Match events')) || lines.join('|');
        },
      ],
      [
        'a19_horizon_labels',
        'Horizon labels are human readable',
        () => labelMemoryHorizon('long_term_prior').includes('Earlier') || labelMemoryHorizon('long_term_prior'),
      ],
      [
        'a19_slice_rank',
        'Influence slices rank by magnitude',
        () => {
          const ranked = rankInfluenceSlicesByMagnitude([
            { horizon: 'short_term_match', delta: 1, reason: 'a' },
            { horizon: 'team_directive', delta: 25, reason: 'b' },
          ]);
          return ranked[0].delta === 25 && formatHorizonBadge('team_directive') === 'Team directive' || JSON.stringify(ranked);
        },
      ],
      [
        'a19_r3_prior_lines',
        'Persistent prior brief lists saved beliefs when enabled',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 1,
            beliefs: {
              aggressive: { key: 'aggressive', value: 0.7, confidence: 0.4, observations: 0, opportunityCount: 1, source: 'persistent_prior' },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const lines = buildPersistentPriorExplainabilityBrief(mem, { persistentMemoryEnabled: true });
          return listPersistentPriorBeliefs(mem).length === 1 && lines.some(l => l.includes('Saved prior')) || lines.join('|');
        },
      ],
      [
        'a19_r3_adaptive_plan',
        'Adaptive plan explainability describes status',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.adaptivePlan = { objectiveId: 'counter_expand_NSW', status: 'revised', revisionReason: 'Rival focus shifted' };
          const lines = explainAdaptivePlan(mem);
          return lines.some(l => l.includes('revised')) && lines.some(l => l.includes('never execute')) || lines.join('|');
        },
      ],
      [
        'a19_r3_health_scorecard',
        'Health scorecard is excellent for empty bounded memory',
        () => {
          const card = computeMemoryHealthScorecard(createEmptyAiActorMemory('ai'));
          return card.boundsOk && card.band === 'excellent' && card.healthScore >= 90 || JSON.stringify(card);
        },
      ],
      [
        'a19_r3_turn_summary',
        'Turn influence summary aggregates horizons',
        () => {
          const before = [{ type: 'a', score: 5 }, { type: 'b', score: 5 }];
          const after = [
            { type: 'a', score: 30, memoryInfluence: 25, memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }] },
            { type: 'b', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust' }] },
          ];
          const sum = summarizeTurnMemoryInfluence(before, after);
          return sum.auditOk && sum.influencedDecisionCount === 2 && sum.byHorizon.team_directive?.totalDelta === 25 || JSON.stringify(sum);
        },
      ],
      [
        'a19_r3_gi_claims',
        'GI claims include policy disclaimer and redaction',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const claims = buildMemoryGiClaims({
            horizon: snap,
            inspection: getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
              viewerTeamId: 'a',
              ownerTeamId: 'b',
            }),
          });
          const brief = formatGiClaimsAsBrief(claims);
          return brief.some(l => l.includes('[policy]')) && brief.some(l => l.includes('hidden')) || brief.join('|');
        },
      ],
      [
        'a19_r3_health_brief',
        'Health brief formats scorecard summary',
        () => {
          const lines = formatMemoryHealthBrief(computeMemoryHealthScorecard(createEmptyAiActorMemory('x')));
          return lines[0].includes('100') || lines[0];
        },
      ],
      [
        'a19_r4_timeline_order',
        'Event timeline sorts by turn and caps display',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'b',
              turn: 2,
              actionType: 'sell',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 'late',
              importance: 1,
              valence: 0.2,
              stableKey: 'k2',
            },
            {
              id: 'a',
              turn: 1,
              actionType: 'buy',
              actorId: 'player',
              targetId: null,
              regionId: null,
              summary: 'early',
              importance: 1,
              valence: -0.1,
              stableKey: 'k1',
            },
          ];
          const tl = buildMemoryEventTimeline(mem);
          return tl.length === 2 && tl[0].turn === 1 && tl[1].valenceLabel === 'positive' || JSON.stringify(tl);
        },
      ],
      [
        'a19_r4_timeline_cap',
        'Timeline respects display cap constant',
        () => AGENT19_TIMELINE_DISPLAY_CAP >= 5 && AGENT19_TIMELINE_DISPLAY_CAP <= 20,
      ],
      [
        'a19_r4_relationship_brief',
        'Relationship brief surfaces dominant axes',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 30,
            respect: 40,
            rivalry: 80,
            reliability: 50,
            cooperation: 20,
            threat: 70,
            grievance: 60,
            gratitude: 10,
            lastUpdatedTurn: 3,
          };
          const lines = buildRelationshipExplainabilityBrief(mem, 'player');
          return lines.some(l => l.includes('Rivalry')) && listTrackedRelationshipActorIds(mem).includes('player') || lines.join('|');
        },
      ],
      [
        'a19_r4_retention_dup_key',
        'Retention audit warns on duplicate stableKey',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: '1',
              turn: 1,
              actionType: 'sell',
              actorId: 'p',
              targetId: null,
              regionId: null,
              summary: 'a',
              importance: 1,
              valence: 0,
              stableKey: 'dup',
            },
            {
              id: '2',
              turn: 2,
              actionType: 'buy',
              actorId: 'p',
              targetId: null,
              regionId: null,
              summary: 'b',
              importance: 1,
              valence: 0,
              stableKey: 'dup',
            },
          ];
          const findings = auditMemoryRetentionOrdering(mem);
          return retentionAuditOk(findings) && findings.some(f => f.code === 'duplicate_stable_key') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r4_turn_pack',
        'Turn explainability pack merges horizon, influence, timeline',
        () => {
          const before = createEmptyAiActorMemory('ai');
          const after = createEmptyAiActorMemory('ai');
          after.events = [
            {
              id: 'e1',
              turn: 1,
              actionType: 'sabotage',
              actorId: 'player',
              targetId: 'ai',
              regionId: null,
              summary: 'hit',
              importance: 2,
              valence: -0.5,
              stableKey: 's1',
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: before,
            memoryAfter: after,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 8,
                memoryInfluence: 3,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'grievance' }],
              },
            ],
          });
          const summaryLines = summarizeMemoryEventTimeline(buildMemoryEventTimeline(after));
          return (
            pack.influenceSummary.influencedDecisionCount === 1 &&
            pack.horizonDiffLines.some(l => l.includes('Match events')) &&
            pack.narrativeLines.length >= 4 &&
            summaryLines[0].includes('1 event')
          ) || JSON.stringify({ pack, summaryLines });
        },
      ],
      [
        'a19_r4_timeline_empty',
        'Empty timeline summary is explicit',
        () => {
          const lines = summarizeMemoryEventTimeline([]);
          return lines[0].includes('No committed') || lines[0];
        },
      ],
    ]),
  };
}

/** Compare modular horizon builder to canonical V9.4 export (parity gate). */
export function runAgent19CanonicalParityTests(
  canonical: {
    buildAiMemoryHorizonSnapshot: typeof buildAiMemoryHorizonSnapshot;
    createFreshAiMemories: (ids: string[]) => Record<string, import('../types.ts').AiActorMemory>;
    applyPriorsToFreshMemories: (m: Record<string, import('../types.ts').AiActorMemory>, priors: Record<string, unknown>) => Record<string, import('../types.ts').AiActorMemory>;
    profileToPriorSeed: (profile: unknown, subjectId: string) => unknown;
    HUMAN_PROFILE_ID: string;
  },
): { results: MemoryEvalResult[] } {
  return {
    results: runCases([
      [
        'a19_parity_empty',
        'Modular horizon matches canonical for empty memory',
        () => {
          const mod = buildAiMemoryHorizonSnapshot(null);
          const can = canonical.buildAiMemoryHorizonSnapshot(null);
          return JSON.stringify(mod) === JSON.stringify(can) || `mod ${JSON.stringify(mod)} can ${JSON.stringify(can)}`;
        },
      ],
      [
        'a19_parity_prior',
        'Modular horizon matches canonical with persistent priors',
        () => {
          let m = canonical.createFreshAiMemories(['ai']);
          m = canonical.applyPriorsToFreshMemories(m, {
            ai: canonical.profileToPriorSeed(
              {
                profileId: 'p',
                actorId: 'ai',
                rivalIdentityId: 'r',
                subjectProfileId: canonical.HUMAN_PROFILE_ID,
                matchesObserved: 2,
                wins: 1,
                losses: 1,
                draws: 0,
                observationCount: 4,
                confidence: 0.5,
                aggressionPreference: 0.7,
                expansionPreference: 0.3,
                economicPreference: 0.25,
                cooperationPreference: 0.25,
                strategicTendencies: {},
                relationshipHistory: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 },
                notableMemories: [],
                preferredTeamCoordination: [],
                committedMatchIds: [],
                lastUpdatedAt: 0,
              },
              'player',
            ),
          });
          const mod = buildAiMemoryHorizonSnapshot(m.ai, { persistentMemoryEnabled: true });
          const can = canonical.buildAiMemoryHorizonSnapshot(m.ai, { persistentMemoryEnabled: true });
          return JSON.stringify(mod) === JSON.stringify(can) || JSON.stringify({ mod, can });
        },
      ],
    ]),
  };
}

export function runAgent19MemoryEvalSuite(canonical?: Parameters<typeof runAgent19CanonicalParityTests>[0]): {
  results: MemoryEvalResult[];
  passed: number;
  failed: number;
} {
  const module = runAgent19ModuleSelfTests().results;
  const parity = canonical ? runAgent19CanonicalParityTests(canonical).results : [];
  const results = [...module, ...parity];
  const passed = results.filter(r => r.passed).length;
  return { results, passed, failed: results.length - passed };
}


// --- source: chunk-self-tests.ts ---
/** Inline self-tests bundled into assembly chunk (no V9.4 / no imports). */

export function runAgent19ChunkSelfTests(): { results: MemoryEvalResult[]; passed: number; failed: number } {
  const { results, passed, failed } = runAgent19MemoryEvalSuite();
  return { results, passed, failed };
}


// --- source: react/MemoryExplainabilityLab.tsx ---

export interface MemoryExplainabilityLabProps {
  snapshot: AiMemoryHorizonSnapshot;
  title?: string;
  ownerActorId?: string;
  viewerTeamId?: string | null;
  ownerTeamId?: string | null;
  fullInspection?: boolean;
  onRunSelfTests?: () => void;
}

/** LAB stub for Agent 25 wiring — shows horizon + explainability brief lines. */
export function MemoryExplainabilityLab(props: MemoryExplainabilityLabProps) {
  const lines = buildMemoryExplainabilityBrief(props.snapshot);
  const inspectionLines =
    props.ownerActorId != null
      ? buildInspectionExplainabilityNarrative(
          getFilteredAiMemoryInspectionView(
            { ownerActorId: props.ownerActorId, events: [], relationships: {}, opponentModels: {}, adaptivePlan: null, seenKeys: [], lastDecayTurn: 0 },
            {
              viewerTeamId: props.viewerTeamId,
              ownerTeamId: props.ownerTeamId,
              fullInspection: props.fullInspection,
              persistentMemoryEnabled: false,
            },
          ),
        )
      : [];
  const allLines = inspectionLines.length > 1 ? [...lines, ...inspectionLines.slice(0, 4)] : lines;
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="agent-19-memory-explainability-lab">
      <strong style={{ color: '#a78bfa' }}>
        {props.title ?? 'LAB — Agent 19 AI Memory Explainability (modular)'}
      </strong>
      <div style={{ marginTop: 8, opacity: 0.9 }}>{props.snapshot.qualityNote}</div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {allLines.map((line, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {line}
          </li>
        ))}
      </ul>
      {props.onRunSelfTests && (
        <button type="button" onClick={props.onRunSelfTests} style={{ marginTop: 8 }}>
          Run Agent 19 Module Self-Tests
        </button>
      )}
    </div>
  );
}


// OP10M_MODULE_END agent-19-ai-memory
