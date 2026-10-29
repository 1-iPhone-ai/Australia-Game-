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
  counterfactual: ReturnType<typeof buildCounterfactualMemoryReport>;
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
  const counterfactual = buildCounterfactualMemoryReport(params.decisionsBefore, params.decisionsAfter);
  const allSlices = params.decisionsAfter.flatMap(d => d.memoryInfluenceSlices || []);
  const topSlices = rankInfluenceSlicesByMagnitude(allSlices, 4);
  const timelineLines = summarizeMemoryEventTimeline(buildMemoryEventTimeline(params.memoryAfter));
  const narrativeLines = [
    `Turn ${params.turn} memory explainability pack.`,
    ...horizonDiffLines,
    ...influenceSummary.narrativeLines,
    ...counterfactual.narrativeLines.slice(0, 2),
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
    counterfactual,
    timelineLines,
    narrativeLines,
  };
}


// --- source: counterfactual-explainability.ts ---

export interface CounterfactualDecisionDelta {
  type: string;
  baselineScore: number;
  influencedScore: number;
  memoryInfluence: number;
  sliceCount: number;
}

export interface CounterfactualMemoryReport {
  decisionCount: number;
  influencedCount: number;
  totalAbsInfluence: number;
  deltas: CounterfactualDecisionDelta[];
  narrativeLines: string[];
}

/** Scores as if memory influence were stripped (never removes options — only score deltas). */
export function baselineScoresWithoutMemory(decisions: MemoryInfluenceDecisionLike[]): MemoryInfluenceDecisionLike[] {
  return decisions.map(d => {
    const score = d.score ?? 0;
    const influence = d.memoryInfluence ?? 0;
    return {
      ...d,
      score: score - influence,
      memoryInfluence: 0,
      memoryReasons: [],
      memoryInfluenceSlices: [],
    };
  });
}

export function buildCounterfactualMemoryReport(
  decisionsBefore: MemoryInfluenceDecisionLike[],
  decisionsAfter: MemoryInfluenceDecisionLike[],
): CounterfactualMemoryReport {
  const baseline = baselineScoresWithoutMemory(decisionsAfter);
  const deltas: CounterfactualDecisionDelta[] = [];
  let influencedCount = 0;
  let totalAbsInfluence = 0;
  const n = Math.min(decisionsBefore.length, decisionsAfter.length, baseline.length);
  for (let i = 0; i < n; i++) {
    const after = decisionsAfter[i];
    const base = baseline[i];
    const influence = after.memoryInfluence ?? 0;
    if (Math.abs(influence) > 0.001) influencedCount++;
    totalAbsInfluence += Math.abs(influence);
    deltas.push({
      type: after.type || decisionsBefore[i]?.type || `option_${i}`,
      baselineScore: base.score ?? 0,
      influencedScore: after.score ?? 0,
      memoryInfluence: influence,
      sliceCount: after.memoryInfluenceSlices?.length ?? 0,
    });
  }
  const narrativeLines = [
    `Counterfactual: ${influencedCount}/${n} decisions received memory score nudges (total |Δ| ${totalAbsInfluence.toFixed(2)}).`,
    'Without memory, scores revert to pre-influence baselines; legal option sets stay unchanged.',
  ];
  deltas
    .filter(d => Math.abs(d.memoryInfluence) > 0.001)
    .slice(0, 4)
    .forEach(d => {
      narrativeLines.push(
        `• ${d.type}: ${d.baselineScore.toFixed(1)} → ${d.influencedScore.toFixed(1)} (${d.memoryInfluence >= 0 ? '+' : ''}${d.memoryInfluence.toFixed(2)}, ${d.sliceCount} slice(s))`,
      );
    });
  return {
    decisionCount: n,
    influencedCount,
    totalAbsInfluence,
    deltas,
    narrativeLines,
  };
}

export function formatCounterfactualBrief(report: CounterfactualMemoryReport): string[] {
  return report.narrativeLines;
}


// --- source: memory-staleness-audit.ts ---

export const AGENT19_RELATIONSHIP_STALE_TURN_GAP = 8;
export const AGENT19_DECAY_STALE_TURN_GAP = 12;

/** Flags explainability risk when relationship axes or decay state may be outdated vs current turn. */
export function auditMemoryStaleness(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!memory) return findings;
  if (currentTurn - (memory.lastDecayTurn ?? 0) >= AGENT19_DECAY_STALE_TURN_GAP) {
    findings.push({
      code: 'decay_not_recent',
      severity: 'info',
      message: `Last decay turn ${memory.lastDecayTurn ?? 0} is ${currentTurn - (memory.lastDecayTurn ?? 0)} turns behind — long-run weights may lag recent events in briefs.`,
    });
  }
  Object.values(memory.relationships || {}).forEach(rel => {
    const gap = currentTurn - (rel.lastUpdatedTurn ?? 0);
    if (gap >= AGENT19_RELATIONSHIP_STALE_TURN_GAP) {
      findings.push({
        code: 'relationship_stale',
        severity: 'warn',
        message: `Relationship toward ${rel.actorId} last updated turn ${rel.lastUpdatedTurn} (${gap} turns ago) — negotiation copy may understate recent shifts.`,
      });
    }
  });
  return findings;
}

export function stalenessAuditOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}

export function summarizeMemoryStaleness(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): { findings: MemoryInfluenceAuditFinding[]; narrativeLines: string[] } {
  const findings = auditMemoryStaleness(memory, currentTurn);
  const staleRels = findings.filter(f => f.code === 'relationship_stale').length;
  const lines = [
    staleRels
      ? `${staleRels} tracked relationship(s) may be stale vs turn ${currentTurn} — refresh after committed actions.`
      : `Relationship tracks appear fresh for turn ${currentTurn} (gap threshold ${AGENT19_RELATIONSHIP_STALE_TURN_GAP} turns).`,
  ];
  findings.slice(0, 3).forEach(f => lines.push(`[${f.severity}] ${f.message}`));
  return { findings, narrativeLines: lines };
}


// --- source: session-explainability-rollup.ts ---

export interface SessionExplainabilityRollup {
  turnCount: number;
  totalInfluencedDecisions: number;
  totalAbsInfluence: number;
  byHorizon: ReturnType<typeof summarizeSlicesByHorizon>;
  dominantHorizon: AiMemoryHorizon | null;
  narrativeLines: string[];
}

export function buildSessionExplainabilityRollup(packs: TurnExplainabilityPack[]): SessionExplainabilityRollup {
  const merged = packs.flatMap(p =>
    p.topSlices.map(s => ({ horizon: s.horizon, delta: s.delta, reason: s.reason || `turn_${p.turn}` })),
  );
  const byHorizon = summarizeSlicesByHorizon(merged);
  let dominantHorizon: AiMemoryHorizon | null = null;
  let best = 0;
  (Object.keys(byHorizon) as AiMemoryHorizon[]).forEach(h => {
    const mag = Math.abs(byHorizon[h]?.totalDelta ?? 0);
    if (mag > best) {
      best = mag;
      dominantHorizon = h;
    }
  });
  const totalInfluencedDecisions = packs.reduce((s, p) => s + p.influenceSummary.influencedDecisionCount, 0);
  const totalAbsInfluence = packs.reduce((s, p) => s + Math.abs(p.influenceSummary.totalInfluenceDelta), 0);
  const narrativeLines = [
    `Session rollup across ${packs.length} turn pack(s): ${totalInfluencedDecisions} influenced decision(s), |Δ| sum ${totalAbsInfluence.toFixed(2)}.`,
  ];
  if (dominantHorizon) {
    narrativeLines.push(
      `Dominant horizon: ${dominantHorizon} (${(byHorizon[dominantHorizon]?.totalDelta ?? 0).toFixed(2)} cumulative slice delta).`,
    );
  }
  packs.slice(-2).forEach(p => narrativeLines.push(`Turn ${p.turn}: ${p.influenceSummary.narrativeLines[0] || 'no influence'}`));
  return {
    turnCount: packs.length,
    totalInfluencedDecisions,
    totalAbsInfluence,
    byHorizon,
    dominantHorizon,
    narrativeLines,
  };
}


// --- source: explainability-debug-export.ts ---

export const AGENT19_DEBUG_EXPORT_NARRATIVE_CAP = 20;

/** Bounded, JSON-safe snapshot for dashboards / replay tooling (no full memory graph). */
export function buildExplainabilityDebugExport(pack: TurnExplainabilityPack): Record<string, unknown> {
  return {
    schema: 'agent19.explainability.v1',
    turn: pack.turn,
    horizon: {
      beforeEvents: pack.horizonBefore.shortTermEventCount,
      afterEvents: pack.horizonAfter.shortTermEventCount,
      priorActive: pack.horizonAfter.longTermPriorActive,
    },
    influence: {
      influenced: pack.influenceSummary.influencedDecisionCount,
      totalDelta: pack.influenceSummary.totalInfluenceDelta,
      auditOk: pack.influenceSummary.auditOk,
    },
    topSlices: pack.topSlices.slice(0, 5).map(s => ({
      horizon: s.horizon,
      delta: s.delta,
      reason: s.reason,
    })),
    narrative: pack.narrativeLines.slice(0, AGENT19_DEBUG_EXPORT_NARRATIVE_CAP),
    horizonDiff: pack.horizonDiffLines.slice(0, 8),
  };
}

export function explainabilityDebugExportWithinCap(exportObj: Record<string, unknown>): boolean {
  const narrative = exportObj.narrative;
  return Array.isArray(narrative) && narrative.length <= AGENT19_DEBUG_EXPORT_NARRATIVE_CAP;
}


// --- source: memory-explainability-integrity.ts ---

export interface ExplainabilityIntegrityReport {
  boundsOk: boolean;
  retentionOk: boolean;
  stalenessOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Single read-only pass merging bounds, retention ordering, and staleness explainability audits. */
export function auditExplainabilityIntegrity(
  memory: AiActorMemory | null | undefined,
  currentTurn: number,
): ExplainabilityIntegrityReport {
  const findings = [
    ...auditActorMemoryBounds(memory),
    ...auditMemoryRetentionOrdering(memory),
    ...auditMemoryStaleness(memory, currentTurn),
  ];
  const boundsOk = memoryBoundsOk(memory);
  const retentionOk = retentionAuditOk(findings);
  const stalenessOk = stalenessAuditOk(findings);
  const failCount = findings.filter(f => f.severity === 'fail').length;
  const warnCount = findings.filter(f => f.severity === 'warn').length;
  const narrativeLines = [
    `Explainability integrity @ turn ${currentTurn}: bounds ${boundsOk ? 'ok' : 'FAIL'}, ${findings.length} finding(s) (${warnCount} warn, ${failCount} fail).`,
  ];
  findings.slice(0, 5).forEach(f => narrativeLines.push(`[${f.severity}] ${f.code}: ${f.message}`));
  return { boundsOk, retentionOk, stalenessOk, findings, narrativeLines };
}


// --- source: opponent-model-explainability.ts ---

export interface OpponentBeliefExplainLine {
  actorId: string;
  beliefKey: string;
  value: number;
  confidence: number;
  source: AiBelief['source'];
  line: string;
}

export function listOpponentBeliefExplainLines(
  memory: AiActorMemory | null | undefined,
  subjectActorId: string,
  opts?: { minConfidence?: number; limit?: number },
): OpponentBeliefExplainLine[] {
  const minConf = opts?.minConfidence ?? 0.15;
  const limit = opts?.limit ?? 5;
  const om: AiOpponentModel | undefined = memory?.opponentModels?.[subjectActorId];
  if (!om) return [];
  const lines: OpponentBeliefExplainLine[] = [];
  Object.values(om.beliefs || {}).forEach(b => {
    if (b.confidence < minConf) return;
    lines.push({
      actorId: subjectActorId,
      beliefKey: b.key,
      value: b.value,
      confidence: b.confidence,
      source: b.source,
      line: `${b.key} estimate ${(b.value * 100).toFixed(0)}% (${b.source === 'persistent_prior' ? 'cross-match prior' : 'this match'}, conf ${(b.confidence * 100).toFixed(0)}%).`,
    });
  });
  return lines.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
}

/** Player-facing brief for a tracked opponent model (non-redacted inspection contexts only). */
export function buildOpponentModelExplainabilityBrief(
  memory: AiActorMemory | null | undefined,
  subjectActorId: string,
): string[] {
  const om = memory?.opponentModels?.[subjectActorId];
  if (!om) {
    return [`No opponent model tracked yet for ${subjectActorId} — beliefs appear after observed opportunities.`];
  }
  const beliefs = listOpponentBeliefExplainLines(memory, subjectActorId);
  const lines = [
    `Opponent model for ${subjectActorId} (${om.totalOpportunities} observation slot(s)):`,
  ];
  if (!beliefs.length) {
    lines.push('No confident beliefs yet — memory influence stays neutral until patterns emerge.');
    return lines;
  }
  beliefs.forEach(b => lines.push(`• ${b.line}`));
  if (om.predictedObjectives?.length) {
    const top = [...om.predictedObjectives].sort((a, b) => b.probability - a.probability)[0];
    if (top && top.probability >= 0.35) {
      lines.push(
        `Predicted objective ${top.objectiveId} at ${(top.probability * 100).toFixed(0)}% — adaptive plans may reference this.`,
      );
    }
  }
  return lines;
}


// --- source: influence-drift-audit.ts ---

export const AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD = 18;

/** Flags explainability risk when influence magnitude jumps sharply between consecutive turn packs. */
export function auditInfluenceDriftBetweenTurns(
  previous: TurnExplainabilityPack | null | undefined,
  current: TurnExplainabilityPack,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!previous) return findings;
  const prevMag = Math.abs(previous.influenceSummary.totalInfluenceDelta);
  const curMag = Math.abs(current.influenceSummary.totalInfluenceDelta);
  const delta = curMag - prevMag;
  if (delta >= AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD) {
    findings.push({
      code: 'influence_spike',
      severity: 'warn',
      message: `Influence |Δ| jumped from ${prevMag.toFixed(2)} (turn ${previous.turn}) to ${curMag.toFixed(2)} (turn ${current.turn}) — briefs should cite the dominant slice.`,
    });
  }
  const prevEvents = previous.horizonAfter.shortTermEventCount;
  const curEvents = current.horizonAfter.shortTermEventCount;
  if (curEvents > prevEvents + 3) {
    findings.push({
      code: 'event_burst',
      severity: 'info',
      message: `${curEvents - prevEvents} new committed event(s) since prior turn pack — horizon diff may dominate narratives.`,
    });
  }
  const pickDominant = (byHorizon: Record<string, { totalDelta: number; count: number }>) => {
    let best: string | null = null;
    let mag = 0;
    Object.entries(byHorizon).forEach(([h, v]) => {
      const m = Math.abs(v.totalDelta);
      if (m > mag) {
        mag = m;
        best = h;
      }
    });
    return best;
  };
  const prevHorizon = pickDominant(previous.influenceSummary.byHorizon);
  const curHorizon = pickDominant(current.influenceSummary.byHorizon);
  if (prevHorizon && curHorizon && prevHorizon !== curHorizon) {
    findings.push({
      code: 'dominant_horizon_shift',
      severity: 'info',
      message: `Dominant influence horizon shifted ${prevHorizon} → ${curHorizon} between turns ${previous.turn} and ${current.turn}.`,
    });
  }
  return findings;
}

export function summarizeInfluenceDrift(findings: MemoryInfluenceAuditFinding[]): string[] {
  if (!findings.length) {
    return ['Influence drift check: no sharp spikes vs the prior turn pack.'];
  }
  return ['Influence drift check:', ...findings.map(f => `[${f.severity}] ${f.message}`)];
}


// --- source: prior-event-tension-audit.ts ---

export const AGENT19_PRIOR_EVENT_VALENCE_TENSION = -0.35;

/** Warn when cross-match priors imply cooperation but recent committed events are strongly negative. */
export function auditPriorEventTension(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean; recentEventWindow?: number },
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (!opts?.persistentMemoryEnabled || !memory) return findings;
  const window = opts.recentEventWindow ?? 6;
  const recent = [...(memory.events || [])]
    .sort((a, b) => b.turn - a.turn)
    .slice(0, window);
  const hostile = recent.filter(e => e.valence <= AGENT19_PRIOR_EVENT_VALENCE_TENSION);
  if (!hostile.length) return findings;
  const priors = listPersistentPriorBeliefs(memory);
  const cooperativePrior = priors.find(
    p => (p.beliefKey === 'cooperative' || p.beliefKey === 'cooperation') && p.value >= 0.55,
  );
  if (cooperativePrior) {
    findings.push({
      code: 'prior_event_tension',
      severity: 'warn',
      message: `Cross-match prior suggests ${cooperativePrior.subjectActorId} is cooperative, but ${hostile.length} recent event(s) are strongly negative — explainability should mention both.`,
    });
  }
  const aggressivePrior = priors.find(p => p.beliefKey === 'aggressive' && p.value >= 0.65);
  if (aggressivePrior && hostile.every(e => e.actorId === aggressivePrior.subjectActorId)) {
    findings.push({
      code: 'prior_reinforced',
      severity: 'info',
      message: `Recent hostile events toward ${aggressivePrior.subjectActorId} align with saved aggressive prior — influence may compound.`,
    });
  }
  return findings;
}

export function priorEventTensionOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}


// --- source: match-explainability-digest.ts ---

export const AGENT19_MATCH_DIGEST_LINE_CAP = 12;

export interface MatchExplainabilityDigest {
  turnCount: number;
  healthBand: ReturnType<typeof computeMemoryHealthScorecard>['band'];
  integrityOk: boolean;
  session: ReturnType<typeof buildSessionExplainabilityRollup>;
  narrativeLines: string[];
}

/** Checkpoint / match-end rollup combining session influence, integrity, and health scorecard. */
export function buildMatchExplainabilityDigest(params: {
  packs: TurnExplainabilityPack[];
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  persistentMemoryEnabled?: boolean;
}): MatchExplainabilityDigest {
  const session = buildSessionExplainabilityRollup(params.packs);
  const integrity = auditExplainabilityIntegrity(params.memory, params.currentTurn);
  const health = computeMemoryHealthScorecard(params.memory, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const integrityOk = integrity.boundsOk && integrity.stalenessOk;
  const narrativeLines = [
    `Match explainability digest @ turn ${params.currentTurn} (${params.packs.length} turn pack(s)).`,
    health.summaryLine,
    session.narrativeLines[0],
    integrity.narrativeLines[0],
  ];
  if (session.dominantHorizon) {
    narrativeLines.push(`Session dominant horizon: ${session.dominantHorizon}.`);
  }
  params.packs.slice(-1).forEach(p => {
    if (p.counterfactual.influencedCount > 0) {
      narrativeLines.push(
        `Latest counterfactual: ${p.counterfactual.influencedCount} decision(s) would score differently without memory on turn ${p.turn}.`,
      );
    }
  });
  return {
    turnCount: params.packs.length,
    healthBand: health.band,
    integrityOk,
    session,
    narrativeLines: narrativeLines.slice(0, AGENT19_MATCH_DIGEST_LINE_CAP),
  };
}


// --- source: turn-pack-gi-bridge.ts ---

/** Ask-the-Game claims extended with turn-pack influence and counterfactual facts. */
export function buildTurnPackGiClaims(params: {
  pack: TurnExplainabilityPack;
  horizon: AiMemoryHorizonSnapshot;
  inspection?: AiMemoryInspectionView | null;
  memoryInfluenceEnabled?: boolean;
}): MemoryGiClaim[] {
  const base = buildMemoryGiClaims({
    horizon: params.horizon,
    inspection: params.inspection,
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const extra: MemoryGiClaim[] = [];
  const inf = params.pack.influenceSummary;
  if (inf.influencedDecisionCount > 0) {
    extra.push({
      id: 'turn_influence',
      kind: 'fact',
      text: `Turn ${params.pack.turn}: memory adjusted ${inf.influencedDecisionCount} decision score(s) (total Δ ${inf.totalInfluenceDelta.toFixed(2)}).`,
      confidence: inf.auditOk ? 'confirmed' : 'likely',
    });
  }
  if (params.pack.counterfactual.influencedCount > 0) {
    extra.push({
      id: 'turn_counterfactual',
      kind: 'interpretation',
      text: `Without memory influence, ${params.pack.counterfactual.influencedCount} option(s) on turn ${params.pack.turn} would use baseline scores instead.`,
      confidence: 'likely',
    });
  }
  if (params.pack.topSlices[0]) {
    const s = params.pack.topSlices[0];
    extra.push({
      id: 'turn_top_slice',
      kind: 'interpretation',
      text: `Strongest slice this turn: ${s.horizon} (${s.delta >= 0 ? '+' : ''}${s.delta.toFixed(2)} — ${s.reason}).`,
      confidence: 'likely',
    });
  }
  return [...base, ...extra];
}


// --- source: slice-attribution-audit.ts ---

export const AGENT19_SLICE_ATTRIBUTION_TOLERANCE = 0.05;

export interface TurnSliceAttributionReport {
  auditOk: boolean;
  sliceMismatchCount: number;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Turn-level explainability check that influence slices reconcile to memoryInfluence per decision. */
export function auditTurnSliceAttribution(
  before: MemoryInfluenceDecisionLike[],
  after: MemoryInfluenceDecisionLike[],
): TurnSliceAttributionReport {
  const findings = auditMemoryInfluenceDecisions(before, after);
  const sliceMismatchCount = findings.filter(f => f.code === 'slice_sum_mismatch').length;
  const auditOk = auditFindingsOk(findings) && sliceMismatchCount === 0;
  const narrativeLines = [
    sliceMismatchCount
      ? `Slice attribution audit: ${sliceMismatchCount} decision(s) have slice sums outside ±${AGENT19_SLICE_ATTRIBUTION_TOLERANCE}.`
      : 'Slice attribution audit: influenced decisions reconcile slices to memoryInfluence.',
  ];
  findings
    .filter(f => f.code === 'slice_sum_mismatch')
    .forEach(f => narrativeLines.push(`[warn] ${f.message}`));
  return { auditOk, sliceMismatchCount, findings, narrativeLines };
}

export function turnSliceAttributionOk(report: TurnSliceAttributionReport): boolean {
  return report.auditOk;
}


// --- source: gi-redaction-consistency-audit.ts ---

const REDACTED_LEAK_PATTERNS = [/aggressionPreference/i, /expansionPreference/i, /economicPreference/i, /strategic profile/i];

/** Ensures Ask-the-Game claims do not expose rival-only inspection fields when view is redacted. */
export function auditGiRedactionConsistency(params: {
  claims: Array<{ text: string }>;
  inspection: AiMemoryInspectionView | null | undefined;
}): MemoryInfluenceAuditFinding[] {
  if (!params.inspection?.isRedacted) return [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  params.claims.forEach((c, i) => {
    if (REDACTED_LEAK_PATTERNS.some(p => p.test(c.text))) {
      findings.push({
        code: 'gi_redaction_leak',
        severity: 'fail',
        message: `Claim ${i} may expose redacted rival data.`,
      });
    }
  });
  return findings;
}

export function auditTurnPackGiRedaction(
  pack: TurnExplainabilityPack,
  inspection: AiMemoryInspectionView,
): MemoryInfluenceAuditFinding[] {
  const claims = buildTurnPackGiClaims({
    pack,
    horizon: pack.horizonAfter,
    inspection,
  });
  return auditGiRedactionConsistency({ claims, inspection });
}

export function giRedactionConsistencyOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}


// --- source: multi-turn-drift-rollup.ts ---

export interface MultiTurnDriftRollup {
  pairCount: number;
  spikeCount: number;
  horizonShiftCount: number;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Walk consecutive turn packs and aggregate influence drift warnings for session briefs. */
export function buildMultiTurnDriftRollup(packs: TurnExplainabilityPack[]): MultiTurnDriftRollup {
  const findings: MemoryInfluenceAuditFinding[] = [];
  for (let i = 1; i < packs.length; i++) {
    auditInfluenceDriftBetweenTurns(packs[i - 1], packs[i]).forEach(f => findings.push(f));
  }
  const spikeCount = findings.filter(f => f.code === 'influence_spike').length;
  const horizonShiftCount = findings.filter(f => f.code === 'dominant_horizon_shift').length;
  const narrativeLines =
    packs.length >= 2
      ? [`Multi-turn drift scan across ${packs.length - 1} consecutive pair(s).`, ...summarizeInfluenceDrift(findings).slice(1)]
      : summarizeInfluenceDrift(findings);
  return {
    pairCount: Math.max(0, packs.length - 1),
    spikeCount,
    horizonShiftCount,
    findings,
    narrativeLines,
  };
}


// --- source: integrity-recovery-hints.ts ---

export const AGENT19_RECOVERY_HINT_CAP = 6;

/** Player-facing hints when integrity audits fail — keeps explainability honest without vetoing play. */
export function buildIntegrityRecoveryHints(report: ExplainabilityIntegrityReport): string[] {
  const hints: string[] = [];
  if (!report.boundsOk) {
    hints.push('Trim committed events or opponent beliefs to documented caps before showing detailed explainability.');
  }
  if (!report.retentionOk) {
    hints.push('Resolve duplicate stableKey events — retention flags may confuse timeline narratives.');
  }
  if (!report.stalenessOk) {
    hints.push('Refresh relationship snapshots or disclose staleness in Ask-the-Game claims.');
  }
  report.findings
    .filter(f => f.severity === 'fail')
    .slice(0, 3)
    .forEach(f => hints.push(`Address ${f.code}: ${f.message}`));
  if (!hints.length) {
    hints.push('Integrity checks passed — turn packs and GI claims can use full detail.');
  }
  return hints.slice(0, AGENT19_RECOVERY_HINT_CAP);
}


// --- source: adaptive-plan-influence-bridge.ts ---

export const AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD = 5;

/** Links team_directive influence slices to adaptive counter-plan narratives for the same turn. */
export function buildAdaptivePlanInfluenceBridge(
  memory: AiActorMemory | null | undefined,
  pack: TurnExplainabilityPack,
): string[] {
  const directiveMag = Math.abs(pack.influenceSummary.byHorizon.team_directive?.totalDelta ?? 0);
  const lines = explainAdaptivePlan(memory);
  if (directiveMag >= AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD && memory?.adaptivePlan) {
    lines.push(
      `Team-directive slices contributed ${directiveMag.toFixed(2)} |Δ| this turn — cross-check adaptive plan (${memory.adaptivePlan.status}).`,
    );
  } else if (directiveMag >= AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD) {
    lines.push(
      `Team-directive influence ${directiveMag.toFixed(2)} |Δ| without an adaptive plan — cite team directives only.`,
    );
  }
  return lines;
}

export function adaptivePlanInfluenceAligned(
  memory: AiActorMemory | null | undefined,
  pack: TurnExplainabilityPack,
): boolean {
  const directiveMag = Math.abs(pack.influenceSummary.byHorizon.team_directive?.totalDelta ?? 0);
  if (directiveMag < AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD) return true;
  if (!memory?.adaptivePlan) return true;
  return memory.adaptivePlan.status !== 'abandoned' || directiveMag < 15;
}


// --- source: turn-pack-composite-audit.ts ---

export interface TurnPackCompositeAuditReport {
  sliceOk: boolean;
  giRedactionOk: boolean;
  driftOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Single-turn explainability gate: slice attribution, GI redaction, and optional prior-pack drift. */
export function auditTurnPackComposite(
  pack: TurnExplainabilityPack,
  params: {
    decisionsBefore: import('./types.ts').MemoryInfluenceDecisionLike[];
    decisionsAfter: import('./types.ts').MemoryInfluenceDecisionLike[];
    inspection?: AiMemoryInspectionView | null;
    priorPack?: TurnExplainabilityPack | null;
  },
): TurnPackCompositeAuditReport {
  const sliceReport = auditTurnSliceAttribution(params.decisionsBefore, params.decisionsAfter);
  const sliceOk = turnSliceAttributionOk(sliceReport);
  const giFindings = params.inspection
    ? auditTurnPackGiRedaction(pack, params.inspection)
    : [];
  const giRedactionOk = giRedactionConsistencyOk(giFindings);
  let driftOk = true;
  const driftFindings: MemoryInfluenceAuditFinding[] = params.priorPack
    ? auditInfluenceDriftBetweenTurns(params.priorPack, pack)
    : [];
  if (driftFindings.some(f => f.code === 'influence_spike')) {
    driftOk = false;
  }
  const findings = [...sliceReport.findings, ...giFindings, ...driftFindings];
  const narrativeLines = [
    `Turn ${pack.turn} composite audit: slices ${sliceOk ? 'ok' : 'FAIL'}, GI redaction ${giRedactionOk ? 'ok' : 'FAIL'}, drift ${driftOk ? 'ok' : 'warn'}.`,
    ...sliceReport.narrativeLines,
  ];
  return { sliceOk, giRedactionOk, driftOk, findings, narrativeLines };
}

export function turnPackCompositeOk(report: TurnPackCompositeAuditReport): boolean {
  return report.sliceOk && report.giRedactionOk && report.driftOk;
}


// --- source: session-gi-claims-rollup.ts ---

export const AGENT19_SESSION_GI_CLAIM_CAP = 24;

export interface SessionGiClaimsRollup {
  claimCount: number;
  uniqueIds: string[];
  claims: MemoryGiClaim[];
  narrativeLines: string[];
}

/** Merges Ask-the-Game claims across turn packs; dedupes by id keeping latest turn text. */
export function buildSessionGiClaimsRollup(
  packs: TurnExplainabilityPack[],
  params?: {
    inspection?: AiMemoryInspectionView | null;
    memoryInfluenceEnabled?: boolean;
  },
): SessionGiClaimsRollup {
  const byId = new Map<string, MemoryGiClaim>();
  packs.forEach(pack => {
    const claims = buildTurnPackGiClaims({
      pack,
      horizon: pack.horizonAfter,
      inspection: params?.inspection,
      memoryInfluenceEnabled: params?.memoryInfluenceEnabled,
    });
    claims.forEach(c => byId.set(c.id, c));
  });
  const claims = [...byId.values()].slice(0, AGENT19_SESSION_GI_CLAIM_CAP);
  const narrativeLines = [
    `Session GI rollup: ${claims.length} claim(s) from ${packs.length} turn pack(s) (cap ${AGENT19_SESSION_GI_CLAIM_CAP}).`,
  ];
  claims.slice(0, 4).forEach(c => narrativeLines.push(`• [${c.id}] ${c.text.slice(0, 120)}`));
  return {
    claimCount: claims.length,
    uniqueIds: claims.map(c => c.id),
    claims,
    narrativeLines,
  };
}

export function sessionGiRollupWithinCap(rollup: SessionGiClaimsRollup): boolean {
  return rollup.claimCount <= AGENT19_SESSION_GI_CLAIM_CAP;
}


// --- source: negotiation-influence-bridge.ts ---

export const AGENT19_NEGOTIATION_SLICE_MIN = 0.5;

export interface NegotiationInfluenceBridgeReport {
  negotiationShift: number;
  relationshipSliceDelta: number;
  aligned: boolean;
  narrativeLines: string[];
}

/** Links diplomacy negotiation threshold shift to relationship-flavored influence slices on the same turn. */
export function buildNegotiationInfluenceBridge(
  rel: Partial<AiRelationship> | null | undefined,
  decisionsAfter: MemoryInfluenceDecisionLike[],
  ctx?: { dealAffordable?: boolean; thirdPartyThreat?: number },
): NegotiationInfluenceBridgeReport {
  const { shift } = computeNegotiationThresholdShift(rel, ctx || {});
  const relSlices = decisionsAfter.flatMap(d => d.memoryInfluenceSlices || []).filter(s => /trust|griev|gratitude|relationship/i.test(s.reason));
  const relationshipSliceDelta = relSlices.reduce((s, x) => s + x.delta, 0);
  const signMatch =
    Math.abs(shift) < 0.01 ||
    Math.abs(relationshipSliceDelta) < AGENT19_NEGOTIATION_SLICE_MIN ||
    (shift < 0 && relationshipSliceDelta > 0) ||
    (shift > 0 && relationshipSliceDelta < 0);
  const aligned = signMatch;
  const narrativeLines = [
    `Negotiation bridge: threshold shift ${shift >= 0 ? '+' : ''}${shift.toFixed(3)} vs relationship slice Δ ${relationshipSliceDelta.toFixed(2)} (${aligned ? 'consistent' : 'mismatch'}).`,
  ];
  if (relSlices[0]) {
    narrativeLines.push(`Primary relationship slice: ${relSlices[0].reason} (${relSlices[0].delta >= 0 ? '+' : ''}${relSlices[0].delta.toFixed(2)}).`);
  }
  return { negotiationShift: shift, relationshipSliceDelta, aligned, narrativeLines };
}

export function negotiationInfluenceAligned(report: NegotiationInfluenceBridgeReport): boolean {
  return report.aligned;
}


// --- source: decision-trace-continuity-audit.ts ---

export interface DecisionTraceContinuityReport {
  continuityOk: boolean;
  droppedTypes: string[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Ensures every before decision still produces a trace after memory influence (no silent drops). */
export function auditDecisionTraceContinuity(
  before: MemoryInfluenceDecisionLike[],
  after: MemoryInfluenceDecisionLike[],
): DecisionTraceContinuityReport {
  const afterTypes = new Set(after.map(d => String(d.type || 'unknown')));
  const droppedTypes = before.map(d => String(d.type || 'unknown')).filter(t => !afterTypes.has(t));
  const findings: MemoryInfluenceAuditFinding[] = [];
  droppedTypes.forEach(t => {
    findings.push({
      code: 'trace_option_dropped',
      severity: 'fail',
      message: `Decision type "${t}" missing after memory pass.`,
    });
  });
  const horizon = buildAiMemoryHorizonSnapshot(null);
  before.forEach((b, i) => {
    const a = after[i];
    if (!a) return;
    buildAgent19DecisionTraceReport({ before: b, after: a, horizonSnapshot: horizon });
  });
  const continuityOk = droppedTypes.length === 0;
  const narrativeLines = [
    continuityOk
      ? 'Decision trace continuity: all option types preserved.'
      : `Decision trace continuity: ${droppedTypes.length} type(s) dropped (${droppedTypes.join(', ')}).`,
  ];
  return { continuityOk, droppedTypes, findings, narrativeLines };
}

export function decisionTraceContinuityOk(report: DecisionTraceContinuityReport): boolean {
  return report.continuityOk;
}


// --- source: explainability-confidence-band.ts ---

export type ExplainabilityConfidenceBand = 'high' | 'medium' | 'low';

export interface ExplainabilityConfidenceReport {
  band: ExplainabilityConfidenceBand;
  score: number;
  narrativeLines: string[];
}

/** Derives player-facing confidence from integrity + composite turn audits. */
export function computeExplainabilityConfidence(params: {
  integrity: ExplainabilityIntegrityReport;
  composite?: TurnPackCompositeAuditReport | null;
}): ExplainabilityConfidenceReport {
  let score = 100;
  if (!params.integrity.boundsOk) score -= 35;
  if (!params.integrity.retentionOk) score -= 15;
  if (!params.integrity.stalenessOk) score -= 10;
  params.integrity.findings.filter(f => f.severity === 'warn').forEach(() => {
    score -= 3;
  });
  if (params.composite) {
    if (!params.composite.sliceOk) score -= 20;
    if (!params.composite.giRedactionOk) score -= 25;
    if (!params.composite.driftOk) score -= 8;
  }
  score = Math.max(0, Math.min(100, score));
  let band: ExplainabilityConfidenceBand = 'high';
  if (score < 55) band = 'low';
  else if (score < 80) band = 'medium';
  const narrativeLines = [
    `Explainability confidence: ${band} (${score}/100) — integrity bounds ${params.integrity.boundsOk ? 'ok' : 'fail'}.`,
  ];
  if (params.composite && !params.composite.sliceOk) {
    narrativeLines.push('Slice attribution issues reduce confidence.');
  }
  return { band, score, narrativeLines };
}

export function explainabilityConfidenceAtLeast(
  report: ExplainabilityConfidenceReport,
  minBand: ExplainabilityConfidenceBand,
): boolean {
  const order: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  return order.indexOf(report.band) >= order.indexOf(minBand);
}


// --- source: composite-recovery-bridge.ts ---

export const AGENT19_COMPOSITE_RECOVERY_HINT_CAP = 5;

/** Maps composite turn-pack audit failures to player-facing recovery hints. */
export function buildCompositeRecoveryHints(report: TurnPackCompositeAuditReport): string[] {
  const hints: string[] = [];
  if (!report.sliceOk) {
    hints.push('Reconcile memoryInfluence with slice deltas before publishing turn explainability.');
  }
  if (!report.giRedactionOk) {
    hints.push('Align Ask-the-Game claims with redacted inspection view for this turn.');
  }
  if (!report.driftOk) {
    hints.push('Review influence spike vs prior turn — disclose drift in session rollup.');
  }
  report.findings
    .filter(f => f.severity === 'fail')
    .slice(0, 2)
    .forEach(f => hints.push(`Fix ${f.code}: ${f.message}`));
  if (!hints.length) {
    hints.push('Composite audit passed — turn pack ready for session rollup.');
  }
  return hints.slice(0, AGENT19_COMPOSITE_RECOVERY_HINT_CAP);
}

export function compositeRecoveryNeeded(report: TurnPackCompositeAuditReport): boolean {
  return !report.sliceOk || !report.giRedactionOk || !report.driftOk;
}


// --- source: session-confidence-rollup.ts ---
  computeExplainabilityConfidence,
  type ExplainabilityConfidenceBand,
} from './explainability-confidence-band.ts';

export interface SessionConfidenceRollup {
  turnCount: number;
  minBand: ExplainabilityConfidenceBand;
  averageScore: number;
  narrativeLines: string[];
}

/** Rolls up per-turn confidence (integrity + optional composite) across a session. */
export function buildSessionConfidenceRollup(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
  },
): SessionConfidenceRollup {
  const bands: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  let scoreSum = 0;
  let minIdx = bands.length - 1;
  packs.forEach((pack, i) => {
    const integrity = auditExplainabilityIntegrity(params.memory, pack.turn);
    const composite = auditTurnPackComposite(pack, {
      decisionsBefore: params.decisionsByTurn[i]?.before ?? [],
      decisionsAfter: params.decisionsByTurn[i]?.after ?? [],
    });
    const conf = computeExplainabilityConfidence({ integrity, composite });
    scoreSum += conf.score;
    const idx = bands.indexOf(conf.band);
    if (idx >= 0 && idx < minIdx) minIdx = idx;
  });
  const turnCount = packs.length;
  const averageScore = turnCount ? Math.round(scoreSum / turnCount) : 100;
  const minBand = bands[minIdx] ?? 'high';
  const narrativeLines = [
    `Session confidence rollup (${turnCount} turn(s)): min band ${minBand}, avg score ${averageScore}/100.`,
  ];
  return { turnCount, minBand, averageScore, narrativeLines };
}

export function sessionConfidenceAtLeast(rollup: SessionConfidenceRollup, minBand: ExplainabilityConfidenceBand): boolean {
  const order: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  return order.indexOf(rollup.minBand) >= order.indexOf(minBand);
}


// --- source: horizon-slice-alignment-audit.ts ---
  AiMemoryHorizonSnapshot,
  AiMemoryInfluenceSlice,
  MemoryInfluenceAuditFinding,
  MemoryInfluenceDecisionLike,
} from './types.ts';

export interface HorizonSliceAlignmentReport {
  alignmentOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Flags slices that cite horizons inactive in the current snapshot. */
export function auditHorizonSliceAlignment(
  snapshot: AiMemoryHorizonSnapshot,
  decisions: MemoryInfluenceDecisionLike[],
): HorizonSliceAlignmentReport {
  const slices: AiMemoryInfluenceSlice[] = decisions.flatMap(d => d.memoryInfluenceSlices || []);
  const findings: MemoryInfluenceAuditFinding[] = [];
  slices.forEach(s => {
    if (s.horizon === 'long_term_prior' && !snapshot.longTermPriorActive) {
      findings.push({
        code: 'horizon_slice_inactive',
        severity: 'fail',
        message: `long_term_prior slice (${s.delta}) but prior horizon inactive in snapshot.`,
      });
    }
    if (s.horizon === 'long_term_prior' && snapshot.longTermPriorBeliefCount === 0) {
      findings.push({
        code: 'horizon_slice_empty_prior',
        severity: 'warn',
        message: 'long_term_prior slice with zero prior beliefs in snapshot.',
      });
    }
  });
  const alignmentOk = !findings.some(f => f.severity === 'fail');
  const narrativeLines = [
    alignmentOk
      ? `Horizon slice alignment ok (${slices.length} slice(s) checked).`
      : `Horizon slice alignment FAIL — ${findings.filter(f => f.severity === 'fail').length} inactive horizon cite(s).`,
  ];
  return { alignmentOk, findings, narrativeLines };
}

export function horizonSliceAlignmentOk(report: HorizonSliceAlignmentReport): boolean {
  return report.alignmentOk;
}


// --- source: match-explainability-gate.ts ---
  buildSessionConfidenceRollup,
  sessionConfidenceAtLeast,
} from './session-confidence-rollup.ts';

export interface MatchExplainabilityGateReport {
  gateOpen: boolean;
  giWithinCap: boolean;
  sessionRollupTurns: number;
  narrativeLines: string[];
}

/** Match-level gate: session rollup present, GI cap respected, min confidence band. */
export function auditMatchExplainabilityGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityGateReport {
  const minBand = params.minConfidenceBand ?? 'medium';
  const session = buildSessionExplainabilityRollup(packs);
  const gi = buildSessionGiClaimsRollup(packs, { memoryInfluenceEnabled: params.memoryInfluenceEnabled });
  const confidence = buildSessionConfidenceRollup(packs, {
    memory: params.memory,
    decisionsByTurn: params.decisionsByTurn,
  });
  const giWithinCap = sessionGiRollupWithinCap(gi);
  const confidenceOk = sessionConfidenceAtLeast(confidence, minBand);
  const gateOpen = packs.length > 0 && giWithinCap && confidenceOk;
  const narrativeLines = [
    `Match explainability gate: ${gateOpen ? 'OPEN' : 'CLOSED'} (${packs.length} pack(s), GI cap ${giWithinCap ? 'ok' : 'FAIL'}, confidence ${confidence.minBand}).`,
    ...session.narrativeLines.slice(0, 1),
    ...confidence.narrativeLines,
  ];
  return {
    gateOpen,
    giWithinCap,
    sessionRollupTurns: session.turnCount,
    narrativeLines,
  };
}

export function matchExplainabilityGateOpen(report: MatchExplainabilityGateReport): boolean {
  return report.gateOpen;
}


// --- source: trace-composite-bridge.ts ---

export interface TraceCompositeBridgeReport {
  compositeOk: boolean;
  traceOk: boolean;
  combinedOk: boolean;
  composite: TurnPackCompositeAuditReport;
  trace: DecisionTraceContinuityReport;
  narrativeLines: string[];
}

/** Runs composite audit and trace continuity as one player-facing gate. */
export function auditTraceCompositeBridge(
  pack: TurnExplainabilityPack,
  params: {
    decisionsBefore: MemoryInfluenceDecisionLike[];
    decisionsAfter: MemoryInfluenceDecisionLike[];
  },
): TraceCompositeBridgeReport {
  const composite = auditTurnPackComposite(pack, params);
  const trace = auditDecisionTraceContinuity(params.decisionsBefore, params.decisionsAfter);
  const compositeOk = turnPackCompositeOk(composite);
  const traceOk = decisionTraceContinuityOk(trace);
  const combinedOk = compositeOk && traceOk;
  const narrativeLines = [
    `Trace+composite bridge @ turn ${pack.turn}: ${combinedOk ? 'PASS' : 'FAIL'} (composite ${compositeOk ? 'ok' : 'fail'}, trace ${traceOk ? 'ok' : 'fail'}).`,
    ...composite.narrativeLines.slice(0, 1),
    ...trace.narrativeLines,
  ];
  return { compositeOk, traceOk, combinedOk, composite, trace, narrativeLines };
}

export function traceCompositeBridgeOk(report: TraceCompositeBridgeReport): boolean {
  return report.combinedOk;
}


// --- source: match-gate-recovery-bridge.ts ---

export const AGENT19_MATCH_RECOVERY_HINT_CAP = 8;

/** Player hints when match explainability gate is closed — merges integrity, GI, and last-turn composite/trace failures. */
export function buildMatchGateRecoveryHints(
  gate: MatchExplainabilityGateReport,
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    lastPack?: TurnExplainabilityPack | null;
    lastDecisions?: { before: MemoryInfluenceDecisionLike[]; after: MemoryInfluenceDecisionLike[] };
  },
): string[] {
  const hints: string[] = [];
  if (gate.gateOpen) {
    hints.push('Match explainability gate is open — session rollup and GI claims may ship at full detail.');
    return hints.slice(0, AGENT19_MATCH_RECOVERY_HINT_CAP);
  }
  if (!gate.giWithinCap) {
    hints.push('Reduce or dedupe Ask-the-Game claims to stay within the session GI cap.');
  }
  hints.push(...buildIntegrityRecoveryHints(auditExplainabilityIntegrity(params.memory, params.currentTurn)));
  if (params.lastPack && params.lastDecisions) {
    const bridge = auditTraceCompositeBridge(params.lastPack, {
      decisionsBefore: params.lastDecisions.before,
      decisionsAfter: params.lastDecisions.after,
    });
    if (!bridge.combinedOk) {
      hints.push(...buildCompositeRecoveryHints(bridge.composite));
    }
  }
  if (!hints.length) {
    hints.push('Review session confidence band — composite audits may be failing on recent turns.');
  }
  return [...new Set(hints)].slice(0, AGENT19_MATCH_RECOVERY_HINT_CAP);
}

export function matchGateRecoveryNeeded(gate: MatchExplainabilityGateReport): boolean {
  return !gate.gateOpen;
}


// --- source: session-trace-continuity-gate.ts ---

export interface SessionTraceContinuityGateReport {
  gateOpen: boolean;
  failedTurns: number[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Session gate: every turn must preserve decision option types after memory influence. */
export function auditSessionTraceContinuityGate(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>,
): SessionTraceContinuityGateReport {
  const failedTurns: number[] = [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  packs.forEach((pack, i) => {
    const d = decisionsByTurn[i];
    if (!d) return;
    const report = auditDecisionTraceContinuity(d.before, d.after);
    if (!decisionTraceContinuityOk(report)) {
      failedTurns.push(pack.turn);
      findings.push(...report.findings);
    }
  });
  const gateOpen = failedTurns.length === 0 && packs.length > 0;
  const narrativeLines = [
    gateOpen
      ? `Session trace continuity: all ${packs.length} turn(s) preserved option types.`
      : `Session trace continuity FAIL on turn(s) ${failedTurns.join(', ') || 'unknown'}.`,
  ];
  return { gateOpen, failedTurns, findings, narrativeLines };
}

export function sessionTraceContinuityGateOpen(report: SessionTraceContinuityGateReport): boolean {
  return report.gateOpen;
}


// --- source: session-horizon-alignment-audit.ts ---

export interface SessionHorizonAlignmentReport {
  alignmentOk: boolean;
  failedTurns: number[];
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Validates slice horizons against each turn pack's post-turn snapshot across the session. */
export function auditSessionHorizonAlignment(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{ after: MemoryInfluenceDecisionLike[] }>,
): SessionHorizonAlignmentReport {
  const failedTurns: number[] = [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  packs.forEach((pack, i) => {
    const after = decisionsByTurn[i]?.after ?? [];
    const report = auditHorizonSliceAlignment(pack.horizonAfter, after);
    if (!horizonSliceAlignmentOk(report)) {
      failedTurns.push(pack.turn);
      findings.push(...report.findings);
    }
  });
  const alignmentOk = failedTurns.length === 0;
  const narrativeLines = [
    alignmentOk
      ? `Session horizon alignment ok (${packs.length} turn pack(s)).`
      : `Session horizon alignment FAIL on turn(s) ${failedTurns.join(', ')}.`,
  ];
  return { alignmentOk, failedTurns, findings, narrativeLines };
}

export function sessionHorizonAlignmentOk(report: SessionHorizonAlignmentReport): boolean {
  return report.alignmentOk;
}


// --- source: explainability-export-gate.ts ---
  buildExplainabilityDebugExport,
  explainabilityDebugExportWithinCap,
} from './explainability-debug-export.ts';

export interface ExplainabilityExportGateReport {
  exportAllowed: boolean;
  gateOpen: boolean;
  exportPayload: Record<string, unknown> | null;
  narrativeLines: string[];
}

/** Debug export is allowed only when match explainability gate is open for the session slice. */
export function auditExplainabilityExportGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    exportTurnIndex?: number;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ExplainabilityExportGateReport {
  const gate = auditMatchExplainabilityGate(packs, params);
  const gateOpen = matchExplainabilityGateOpen(gate);
  const idx = params.exportTurnIndex ?? Math.max(0, packs.length - 1);
  const pack = packs[idx];
  let exportPayload: Record<string, unknown> | null = null;
  if (gateOpen && pack) {
    exportPayload = buildExplainabilityDebugExport(pack);
  }
  const exportAllowed =
    gateOpen && exportPayload !== null && explainabilityDebugExportWithinCap(exportPayload);
  const narrativeLines = [
    `Explainability export gate: ${exportAllowed ? 'ALLOWED' : 'BLOCKED'} (match gate ${gateOpen ? 'open' : 'closed'}).`,
    ...gate.narrativeLines.slice(0, 1),
  ];
  return { exportAllowed, gateOpen, exportPayload, narrativeLines };
}

export function explainabilityExportAllowed(report: ExplainabilityExportGateReport): boolean {
  return report.exportAllowed;
}


// --- source: session-trace-composite-rollup.ts ---

export interface SessionTraceCompositeRollup {
  turnCount: number;
  passCount: number;
  failCount: number;
  allPassed: boolean;
  narrativeLines: string[];
}

/** Counts per-turn trace+composite bridge outcomes across a session. */
export function buildSessionTraceCompositeRollup(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>,
): SessionTraceCompositeRollup {
  let passCount = 0;
  let failCount = 0;
  packs.forEach((pack, i) => {
    const d = decisionsByTurn[i];
    if (!d) return;
    const report = auditTraceCompositeBridge(pack, {
      decisionsBefore: d.before,
      decisionsAfter: d.after,
    });
    if (traceCompositeBridgeOk(report)) passCount += 1;
    else failCount += 1;
  });
  const allPassed = failCount === 0 && passCount === packs.length && packs.length > 0;
  const narrativeLines = [
    `Session trace+composite rollup: ${passCount}/${packs.length} turn(s) passed (${failCount} fail).`,
  ];
  return {
    turnCount: packs.length,
    passCount,
    failCount,
    allPassed,
    narrativeLines,
  };
}

export function sessionTraceCompositeAllPassed(rollup: SessionTraceCompositeRollup): boolean {
  return rollup.allPassed;
}


// --- source: match-explainability-final-gate.ts ---
  auditSessionTraceContinuityGate,
  sessionTraceContinuityGateOpen,
} from './session-trace-continuity-gate.ts';
  auditSessionHorizonAlignment,
  sessionHorizonAlignmentOk,
} from './session-horizon-alignment-audit.ts';
  buildSessionTraceCompositeRollup,
  sessionTraceCompositeAllPassed,
} from './session-trace-composite-rollup.ts';

export interface MatchExplainabilityFinalGateReport {
  finalOpen: boolean;
  matchGateOpen: boolean;
  traceContinuityOpen: boolean;
  horizonAlignmentOk: boolean;
  traceCompositeAllPassed: boolean;
  narrativeLines: string[];
}

/** Top-level match gate: match rollup + trace continuity + horizon alignment + trace/composite rollup. */
export function auditMatchExplainabilityFinalGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityFinalGateReport {
  const matchGate = auditMatchExplainabilityGate(packs, params);
  const matchGateOpen = matchExplainabilityGateOpen(matchGate);
  const traceGate = auditSessionTraceContinuityGate(packs, params.decisionsByTurn);
  const traceContinuityOpen = sessionTraceContinuityGateOpen(traceGate);
  const horizonReport = auditSessionHorizonAlignment(
    packs,
    params.decisionsByTurn.map(d => ({ after: d.after })),
  );
  const horizonAlignmentOk = sessionHorizonAlignmentOk(horizonReport);
  const compositeRollup = buildSessionTraceCompositeRollup(packs, params.decisionsByTurn);
  const traceCompositeAllPassed = sessionTraceCompositeAllPassed(compositeRollup);
  const finalOpen =
    matchGateOpen && traceContinuityOpen && horizonAlignmentOk && traceCompositeAllPassed;
  const narrativeLines = [
    `Match final explainability gate: ${finalOpen ? 'OPEN' : 'CLOSED'} (match ${matchGateOpen ? 'ok' : 'fail'}, trace ${traceContinuityOpen ? 'ok' : 'fail'}, horizon ${horizonAlignmentOk ? 'ok' : 'fail'}, composite ${traceCompositeAllPassed ? 'ok' : 'fail'}).`,
    ...matchGate.narrativeLines.slice(0, 1),
    ...traceGate.narrativeLines,
    ...compositeRollup.narrativeLines,
  ];
  return {
    finalOpen,
    matchGateOpen,
    traceContinuityOpen,
    horizonAlignmentOk,
    traceCompositeAllPassed,
    narrativeLines,
  };
}

export function matchExplainabilityFinalGateOpen(report: MatchExplainabilityFinalGateReport): boolean {
  return report.finalOpen;
}


// --- source: session-export-bundle.ts ---

export const AGENT19_SESSION_EXPORT_TURN_CAP = 12;

export interface SessionExportBundle {
  turnCount: number;
  exports: Record<string, unknown>[];
  narrativeLines: string[];
}

/** Builds capped per-turn debug exports when session export gate allows. */
export function buildSessionExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionExportBundle {
  const exports: Record<string, unknown>[] = [];
  packs.slice(0, AGENT19_SESSION_EXPORT_TURN_CAP).forEach((pack, i) => {
    const gate = auditExplainabilityExportGate(packs, {
      ...params,
      exportTurnIndex: i,
    });
    if (explainabilityExportAllowed(gate) && gate.exportPayload) {
      exports.push({ turn: pack.turn, ...gate.exportPayload });
    }
  });
  const narrativeLines = [
    `Session export bundle: ${exports.length}/${Math.min(packs.length, AGENT19_SESSION_EXPORT_TURN_CAP)} turn export(s) materialized.`,
  ];
  return { turnCount: packs.length, exports, narrativeLines };
}

export function sessionExportBundleWithinCap(bundle: SessionExportBundle): boolean {
  return bundle.exports.length <= AGENT19_SESSION_EXPORT_TURN_CAP;
}


// --- source: negotiation-session-rollup.ts ---
  buildNegotiationInfluenceBridge,
  negotiationInfluenceAligned,
} from './negotiation-influence-bridge.ts';

export interface NegotiationSessionRollup {
  turnCount: number;
  alignedTurns: number;
  mismatchTurns: number;
  narrativeLines: string[];
}

/** Tracks negotiation vs relationship-slice alignment across turn packs. */
export function buildNegotiationSessionRollup(
  packs: TurnExplainabilityPack[],
  params: {
    relationship: Partial<AiRelationship> | null | undefined;
    decisionsByTurn: Array<{ after: MemoryInfluenceDecisionLike[] }>;
  },
): NegotiationSessionRollup {
  let alignedTurns = 0;
  let mismatchTurns = 0;
  packs.forEach((pack, i) => {
    const after = params.decisionsByTurn[i]?.after ?? [];
    const bridge = buildNegotiationInfluenceBridge(params.relationship, after);
    if (negotiationInfluenceAligned(bridge)) alignedTurns += 1;
    else mismatchTurns += 1;
  });
  const narrativeLines = [
    `Negotiation session rollup: ${alignedTurns}/${packs.length} turn(s) aligned (${mismatchTurns} mismatch).`,
  ];
  return { turnCount: packs.length, alignedTurns, mismatchTurns, narrativeLines };
}

export function negotiationSessionMostlyAligned(rollup: NegotiationSessionRollup): boolean {
  return rollup.turnCount === 0 || rollup.mismatchTurns === 0;
}


// --- source: confidence-export-bridge.ts ---

export interface ConfidenceExportBridgeReport {
  exportAllowed: boolean;
  confidenceOk: boolean;
  minBand: ExplainabilityConfidenceBand;
  narrativeLines: string[];
}

/** Export gate plus explicit session confidence band check. */
export function auditConfidenceExportBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ConfidenceExportBridgeReport {
  const minBand = params.minConfidenceBand ?? 'medium';
  const confidence = buildSessionConfidenceRollup(packs, {
    memory: params.memory,
    decisionsByTurn: params.decisionsByTurn,
  });
  const confidenceOk = sessionConfidenceAtLeast(confidence, minBand);
  const exportGate = auditExplainabilityExportGate(packs, params);
  const exportAllowed = confidenceOk && explainabilityExportAllowed(exportGate);
  const narrativeLines = [
    `Confidence+export bridge: ${exportAllowed ? 'ALLOWED' : 'BLOCKED'} (confidence min ${minBand}, actual min ${confidence.minBand}).`,
    ...confidence.narrativeLines,
    ...exportGate.narrativeLines.slice(0, 1),
  ];
  return { exportAllowed, confidenceOk, minBand, narrativeLines };
}

export function confidenceExportBridgeAllowed(report: ConfidenceExportBridgeReport): boolean {
  return report.exportAllowed;
}


// --- source: match-recovery-playbook.ts ---

export const AGENT19_RECOVERY_PLAYBOOK_CAP = 10;

export interface MatchRecoveryPlaybook {
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** Ordered, deduped recovery steps for a closed match explainability path. */
export function buildMatchRecoveryPlaybook(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchRecoveryPlaybook {
  const gate = auditMatchExplainabilityGate(packs, params);
  const lastIdx = Math.max(0, packs.length - 1);
  const lastPack = packs[lastIdx];
  const lastDecisions = params.decisionsByTurn[lastIdx];
  const steps = buildMatchGateRecoveryHints(gate, {
    memory: params.memory,
    currentTurn: params.currentTurn,
    lastPack,
    lastDecisions: lastDecisions
      ? { before: lastDecisions.before, after: lastDecisions.after }
      : undefined,
  });
  if (lastPack && lastDecisions) {
    const bridge = auditTraceCompositeBridge(lastPack, {
      decisionsBefore: lastDecisions.before,
      decisionsAfter: lastDecisions.after,
    });
    if (!bridge.combinedOk) {
      steps.push(...buildCompositeRecoveryHints(bridge.composite));
    }
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_RECOVERY_PLAYBOOK_CAP);
  const narrativeLines = [
    `Match recovery playbook: ${unique.length} step(s) for ${packs.length} turn pack(s).`,
    ...unique.slice(0, 3).map((s, i) => `${i + 1}. ${s}`),
  ];
  return { stepCount: unique.length, steps: unique, narrativeLines };
}

export function matchRecoveryPlaybookWithinCap(playbook: MatchRecoveryPlaybook): boolean {
  return playbook.stepCount <= AGENT19_RECOVERY_PLAYBOOK_CAP;
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
  buildCounterfactualMemoryReport,
  baselineScoresWithoutMemory,
} from '../counterfactual-explainability.ts';
  auditMemoryStaleness,
  summarizeMemoryStaleness,
  AGENT19_RELATIONSHIP_STALE_TURN_GAP,
} from '../memory-staleness-audit.ts';
  buildExplainabilityDebugExport,
  explainabilityDebugExportWithinCap,
  AGENT19_DEBUG_EXPORT_NARRATIVE_CAP,
} from '../explainability-debug-export.ts';
  buildOpponentModelExplainabilityBrief,
  listOpponentBeliefExplainLines,
} from '../opponent-model-explainability.ts';
  auditInfluenceDriftBetweenTurns,
  AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD,
} from '../influence-drift-audit.ts';
  auditGiRedactionConsistency,
  auditTurnPackGiRedaction,
  giRedactionConsistencyOk,
} from '../gi-redaction-consistency-audit.ts';
  adaptivePlanInfluenceAligned,
  buildAdaptivePlanInfluenceBridge,
  AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD,
} from '../adaptive-plan-influence-bridge.ts';
  buildSessionGiClaimsRollup,
  sessionGiRollupWithinCap,
  AGENT19_SESSION_GI_CLAIM_CAP,
} from '../session-gi-claims-rollup.ts';
  buildNegotiationInfluenceBridge,
  negotiationInfluenceAligned,
} from '../negotiation-influence-bridge.ts';
  auditDecisionTraceContinuity,
  decisionTraceContinuityOk,
} from '../decision-trace-continuity-audit.ts';
  computeExplainabilityConfidence,
  explainabilityConfidenceAtLeast,
} from '../explainability-confidence-band.ts';
  buildCompositeRecoveryHints,
  compositeRecoveryNeeded,
  AGENT19_COMPOSITE_RECOVERY_HINT_CAP,
} from '../composite-recovery-bridge.ts';
  buildSessionConfidenceRollup,
  sessionConfidenceAtLeast,
} from '../session-confidence-rollup.ts';
  auditHorizonSliceAlignment,
  horizonSliceAlignmentOk,
} from '../horizon-slice-alignment-audit.ts';
  auditMatchExplainabilityGate,
  matchExplainabilityGateOpen,
} from '../match-explainability-gate.ts';
  buildMatchGateRecoveryHints,
  matchGateRecoveryNeeded,
  AGENT19_MATCH_RECOVERY_HINT_CAP,
} from '../match-gate-recovery-bridge.ts';
  auditSessionTraceContinuityGate,
  sessionTraceContinuityGateOpen,
} from '../session-trace-continuity-gate.ts';
  auditSessionHorizonAlignment,
  sessionHorizonAlignmentOk,
} from '../session-horizon-alignment-audit.ts';
  auditExplainabilityExportGate,
  explainabilityExportAllowed,
} from '../explainability-export-gate.ts';
  buildSessionTraceCompositeRollup,
  sessionTraceCompositeAllPassed,
} from '../session-trace-composite-rollup.ts';
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from '../match-explainability-final-gate.ts';
  buildSessionExportBundle,
  sessionExportBundleWithinCap,
  AGENT19_SESSION_EXPORT_TURN_CAP,
} from '../session-export-bundle.ts';
  buildNegotiationSessionRollup,
  negotiationSessionMostlyAligned,
} from '../negotiation-session-rollup.ts';
  auditConfidenceExportBridge,
  confidenceExportBridgeAllowed,
} from '../confidence-export-bridge.ts';
  buildMatchRecoveryPlaybook,
  matchRecoveryPlaybookWithinCap,
  AGENT19_RECOVERY_PLAYBOOK_CAP,
} from '../match-recovery-playbook.ts';

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
      [
        'a19_r5_counterfactual_delta',
        'Counterfactual report quantifies memory score nudges',
        () => {
          const before = [{ type: 'sell', score: 10 }];
          const after = [{ type: 'sell', score: 15, memoryInfluence: 5, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }] }];
          const report = buildCounterfactualMemoryReport(before, after);
          return report.influencedCount === 1 && report.deltas[0].baselineScore === 10 || JSON.stringify(report);
        },
      ],
      [
        'a19_r5_counterfactual_baseline',
        'Baseline strip removes influence but keeps option count',
        () => {
          const after = [{ type: 'a', score: 12, memoryInfluence: 2 }];
          const stripped = baselineScoresWithoutMemory(after);
          return stripped[0].score === 10 && (stripped[0].memoryInfluence ?? 1) === 0 || JSON.stringify(stripped);
        },
      ],
      [
        'a19_r5_staleness_relationship',
        'Staleness audit warns on old relationship updates',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 50,
            respect: 50,
            rivalry: 0,
            reliability: 50,
            cooperation: 50,
            threat: 0,
            grievance: 0,
            gratitude: 0,
            lastUpdatedTurn: 1,
          };
          const findings = auditMemoryStaleness(mem, 1 + AGENT19_RELATIONSHIP_STALE_TURN_GAP);
          return findings.some(f => f.code === 'relationship_stale') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r5_staleness_fresh',
        'Fresh relationships produce no staleness warnings',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.relationships.player = {
            actorId: 'player',
            trust: 50,
            respect: 50,
            rivalry: 0,
            reliability: 50,
            cooperation: 50,
            threat: 0,
            grievance: 0,
            gratitude: 0,
            lastUpdatedTurn: 10,
          };
          const summary = summarizeMemoryStaleness(mem, 10);
          return summary.findings.filter(f => f.code === 'relationship_stale').length === 0 || summary.narrativeLines.join('|');
        },
      ],
      [
        'a19_r5_session_rollup',
        'Session rollup aggregates turn packs by horizon',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const rollup = buildSessionExplainabilityRollup([pack, { ...pack, turn: 2 }]);
          return rollup.turnCount === 2 && rollup.dominantHorizon === 'team_directive' || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r5_debug_export_cap',
        'Debug export caps narrative lines',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [{ type: 'x', score: 1 }],
          });
          const exp = buildExplainabilityDebugExport(pack);
          return (
            exp.schema === 'agent19.explainability.v1' &&
            explainabilityDebugExportWithinCap(exp) &&
            AGENT19_DEBUG_EXPORT_NARRATIVE_CAP >= 10
          ) || JSON.stringify(exp);
        },
      ],
      [
        'a19_r5_integrity_merge',
        'Integrity audit merges bounds retention and staleness',
        () => {
          const report = auditExplainabilityIntegrity(createEmptyAiActorMemory('ai'), 1);
          return report.boundsOk && report.findings.length >= 0 && report.narrativeLines[0].includes('integrity') || report.narrativeLines[0];
        },
      ],
      [
        'a19_r6_opponent_brief',
        'Opponent model brief lists confident match beliefs',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 4,
            beliefs: {
              aggressive: {
                key: 'aggressive',
                value: 0.72,
                confidence: 0.55,
                observations: 3,
                opportunityCount: 4,
                source: 'match',
              },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const lines = buildOpponentModelExplainabilityBrief(mem, 'player');
          return lines.some(l => l.includes('aggressive')) && listOpponentBeliefExplainLines(mem, 'player').length === 1 || lines.join('|');
        },
      ],
      [
        'a19_r6_opponent_empty',
        'Missing opponent model returns explicit idle copy',
        () => {
          const lines = buildOpponentModelExplainabilityBrief(createEmptyAiActorMemory('ai'), 'player');
          return lines[0].includes('No opponent model') || lines[0];
        },
      ],
      [
        'a19_r6_drift_spike',
        'Influence drift warns on sharp turn-to-turn spike',
        () => {
          const low = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const high = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const findings = auditInfluenceDriftBetweenTurns(low, high);
          return (
            findings.some(f => f.code === 'influence_spike') &&
            AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD >= 10
          ) || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_drift_stable',
        'Stable influence between turns yields no spike warning',
        () => {
          const a = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 3, memoryInfluence: 2 }],
          });
          const b = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 4, memoryInfluence: 3 }],
          });
          const findings = auditInfluenceDriftBetweenTurns(a, b);
          return !findings.some(f => f.code === 'influence_spike') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_match_digest',
        'Match digest merges session health and integrity',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 5, memoryInfluence: 4 }],
          });
          const digest = buildMatchExplainabilityDigest({
            packs: [pack],
            memory: createEmptyAiActorMemory('ai'),
            currentTurn: 2,
          });
          return (
            digest.integrityOk &&
            digest.narrativeLines.length <= AGENT19_MATCH_DIGEST_LINE_CAP &&
            digest.narrativeLines[0].includes('digest')
          ) || JSON.stringify(digest);
        },
      ],
      [
        'a19_r6_prior_tension',
        'Prior/event tension warns when cooperative prior meets hostile events',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = [
            {
              id: 'e1',
              turn: 5,
              actionType: 'sabotage',
              actorId: 'player',
              targetId: 'ai',
              regionId: null,
              summary: 'hit',
              importance: 2,
              valence: -0.6,
              stableKey: 's1',
            },
          ];
          mem.opponentModels.player = {
            actorId: 'player',
            totalOpportunities: 2,
            beliefs: {
              cooperative: {
                key: 'cooperative',
                value: 0.7,
                confidence: 0.4,
                observations: 1,
                opportunityCount: 2,
                source: 'persistent_prior',
              },
            },
            regionalInterest: {},
            predictedObjectives: [],
          };
          const findings = auditPriorEventTension(mem, { persistentMemoryEnabled: true });
          return findings.some(f => f.code === 'prior_event_tension') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r6_turn_gi_bridge',
        'Turn pack GI bridge adds influence and counterfactual claims',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'grievance' }],
              },
            ],
          });
          const claims = buildTurnPackGiClaims({
            pack,
            horizon: pack.horizonAfter,
            memoryInfluenceEnabled: true,
          });
          return (
            claims.some(c => c.id === 'turn_influence') &&
            claims.some(c => c.id === 'turn_counterfactual') &&
            claims.some(c => c.id === 'mem_rule_based')
          ) || claims.map(c => c.id).join(',');
        },
      ],
      [
        'a19_r7_slice_attribution_ok',
        'Turn slice attribution passes when slices sum to influence',
        () => {
          const report = auditTurnSliceAttribution(
            [{ type: 'a', score: 5 }],
            [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          );
          return turnSliceAttributionOk(report) && report.sliceMismatchCount === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r7_slice_attribution_fail',
        'Slice attribution flags mismatched slice sums',
        () => {
          const report = auditTurnSliceAttribution(
            [{ type: 'a', score: 5 }],
            [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust' }],
              },
            ],
          );
          return !turnSliceAttributionOk(report) && report.sliceMismatchCount === 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r7_gi_redaction_ok',
        'Turn pack GI claims stay consistent under redacted inspection',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const inspection = getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
            viewerTeamId: 'team_player',
            ownerTeamId: 'team_opponent',
          });
          const findings = auditTurnPackGiRedaction(pack, inspection);
          return giRedactionConsistencyOk(findings) && inspection.isRedacted || JSON.stringify(findings);
        },
      ],
      [
        'a19_r7_gi_redaction_leak',
        'GI redaction audit fails when claims mention private profiles',
        () => {
          const findings = auditGiRedactionConsistency({
            claims: [{ text: 'Rival strategic profile aggressionPreference is 0.9' }],
            inspection: getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), {
              viewerTeamId: 'a',
              ownerTeamId: 'b',
            }),
          });
          return findings.some(f => f.code === 'gi_redaction_leak') || JSON.stringify(findings);
        },
      ],
      [
        'a19_r7_multi_drift_rollup',
        'Multi-turn drift rollup counts spikes across turn packs',
        () => {
          const low = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 2, memoryInfluence: 1 }],
          });
          const high = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 30,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const rollup = buildMultiTurnDriftRollup([low, high]);
          return rollup.pairCount === 1 && rollup.spikeCount >= 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r7_recovery_hints',
        'Integrity recovery hints cap and mention bounds when failing',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.events = Array.from({ length: AGENT19_AI_MEMORY_EVENT_CAP + 2 }, (_, i) => ({
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
          const integrity = auditExplainabilityIntegrity(mem, 1);
          const hints = buildIntegrityRecoveryHints(integrity);
          return (
            !integrity.boundsOk &&
            hints.some(h => h.includes('caps')) &&
            hints.length <= AGENT19_RECOVERY_HINT_CAP
          ) || JSON.stringify({ integrity, hints });
        },
      ],
      [
        'a19_r7_adaptive_bridge',
        'Adaptive plan bridge cites team_directive magnitude',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          mem.adaptivePlan = { objectiveId: 'counter_expand', status: 'active', revisionReason: null };
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 35,
                memoryInfluence: 25,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 25, reason: 'plan' }],
              },
            ],
          });
          const lines = buildAdaptivePlanInfluenceBridge(mem, pack);
          return (
            adaptivePlanInfluenceAligned(mem, pack) &&
            lines.some(l => l.includes('Team-directive')) &&
            AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD >= 5
          ) || lines.join('|');
        },
      ],
      [
        'a19_r8_composite_ok',
        'Turn pack composite audit passes slice + GI checks',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: pack.influenceSummary.influencedDecisionCount
              ? [
                  {
                    type: 'a',
                    score: 10,
                    memoryInfluence: 5,
                    memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
                  },
                ]
              : [{ type: 'a', score: 5 }],
          });
          return turnPackCompositeOk(report) && report.sliceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_composite_fail',
        'Composite audit fails when slice sums mismatch',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'b', score: 1 }],
            decisionsAfter: [
              {
                type: 'b',
                score: 8,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'b', score: 1 }],
            decisionsAfter: [
              {
                type: 'b',
                score: 8,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          return !turnPackCompositeOk(report) && !report.sliceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_session_gi_rollup',
        'Session GI rollup dedupes claims and respects cap',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 1 }],
            decisionsAfter: [{ type: 'a', score: 3, memoryInfluence: 2 }],
          });
          const rollup = buildSessionGiClaimsRollup([pack, pack], { memoryInfluenceEnabled: true });
          return (
            sessionGiRollupWithinCap(rollup) &&
            rollup.uniqueIds.includes('turn_influence') &&
            rollup.claimCount <= AGENT19_SESSION_GI_CLAIM_CAP
          ) || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r8_negotiation_bridge',
        'Negotiation bridge aligns trust shift with relationship slices',
        () => {
          const bridge = buildNegotiationInfluenceBridge(
            { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 },
            [
              {
                type: 'diplomacy',
                score: 12,
                memoryInfluence: 3,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'trust from prior deal' }],
              },
            ],
          );
          return negotiationInfluenceAligned(bridge) && bridge.negotiationShift < 0 || JSON.stringify(bridge);
        },
      ],
      [
        'a19_r8_trace_continuity_ok',
        'Trace continuity ok when option types preserved',
        () => {
          const report = auditDecisionTraceContinuity(
            [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }],
            [
              { type: 'sell', score: 7, memoryInfluence: 2 },
              { type: 'hold', score: 3 },
            ],
          );
          return decisionTraceContinuityOk(report) && report.droppedTypes.length === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_trace_continuity_fail',
        'Trace continuity fails when an option type disappears',
        () => {
          const report = auditDecisionTraceContinuity(
            [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }],
            [{ type: 'sell', score: 7, memoryInfluence: 2 }],
          );
          return !decisionTraceContinuityOk(report) && report.droppedTypes.includes('hold') || JSON.stringify(report);
        },
      ],
      [
        'a19_r8_confidence_band',
        'Confidence band drops when integrity bounds fail',
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
          const integrity = auditExplainabilityIntegrity(mem, 1);
          const confidence = computeExplainabilityConfidence({ integrity });
          return (
            !integrity.boundsOk &&
            confidence.band === 'low' &&
            !explainabilityConfidenceAtLeast(confidence, 'medium')
          ) || JSON.stringify({ integrity, confidence });
        },
      ],
      [
        'a19_r9_composite_recovery',
        'Composite recovery hints when slice audit fails',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [
              {
                type: 'x',
                score: 9,
                memoryInfluence: 4,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'x', score: 1 }],
            decisionsAfter: [
              {
                type: 'x',
                score: 9,
                memoryInfluence: 4,
                memoryInfluenceSlices: [{ horizon: 'team_directive', delta: 1, reason: 'plan' }],
              },
            ],
          });
          const hints = buildCompositeRecoveryHints(report);
          return (
            compositeRecoveryNeeded(report) &&
            hints.some(h => h.includes('slice')) &&
            hints.length <= AGENT19_COMPOSITE_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r9_composite_recovery_pass',
        'Composite recovery hints praise clean audit',
        () => {
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const report = auditTurnPackComposite(pack, {
            decisionsBefore: [{ type: 'a', score: 5 }],
            decisionsAfter: [
              {
                type: 'a',
                score: 10,
                memoryInfluence: 5,
                memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 'trust' }],
              },
            ],
          });
          const hints = buildCompositeRecoveryHints(report);
          return !compositeRecoveryNeeded(report) && hints[0].includes('passed') || hints.join('|');
        },
      ],
      [
        'a19_r9_session_confidence',
        'Session confidence rollup tracks min band across turns',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const rollup = buildSessionConfidenceRollup([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
          });
          return (
            rollup.turnCount === 1 &&
            sessionConfidenceAtLeast(rollup, 'medium') &&
            rollup.averageScore >= 55
          ) || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r9_horizon_slice_ok',
        'Horizon slice alignment ok for short-term slices',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null);
          const report = auditHorizonSliceAlignment(snap, [
            {
              type: 'sell',
              score: 10,
              memoryInfluence: 2,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'event' }],
            },
          ]);
          return horizonSliceAlignmentOk(report) || JSON.stringify(report);
        },
      ],
      [
        'a19_r9_horizon_slice_fail',
        'Horizon slice alignment fails on inactive long-term prior',
        () => {
          const snap = buildAiMemoryHorizonSnapshot(null, { persistentMemoryEnabled: false });
          const report = auditHorizonSliceAlignment(snap, [
            {
              type: 'sell',
              score: 10,
              memoryInfluence: 3,
              memoryInfluenceSlices: [{ horizon: 'long_term_prior', delta: 3, reason: 'prior' }],
            },
          ]);
          return !horizonSliceAlignmentOk(report) && report.findings.some(f => f.code === 'horizon_slice_inactive') || JSON.stringify(report);
        },
      ],
      [
        'a19_r9_match_gate',
        'Match gate opens for healthy single-turn session',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityGateOpen(gate) && gate.sessionRollupTurns === 1 || JSON.stringify(gate);
        },
      ],
      [
        'a19_r9_trace_composite',
        'Trace composite bridge requires slice + continuity',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 4,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditTraceCompositeBridge(pack, { decisionsBefore, decisionsAfter });
          return traceCompositeBridgeOk(report) && report.traceOk && report.compositeOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_gate_recovery',
        'Match gate recovery hints when confidence gate fails',
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
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildMatchGateRecoveryHints(gate, {
            memory: mem,
            currentTurn: 1,
            lastPack: pack,
            lastDecisions: { before: decisionsBefore, after: decisionsAfter },
          });
          return (
            matchGateRecoveryNeeded(gate) &&
            hints.some(h => h.includes('Trim') || h.includes('bounds')) &&
            hints.length <= AGENT19_MATCH_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r10_gate_recovery_open',
        'Match gate recovery is minimal when gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const gate = auditMatchExplainabilityGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildMatchGateRecoveryHints(gate, { memory: mem, currentTurn: 1 });
          return !matchGateRecoveryNeeded(gate) && hints[0].includes('open') || hints.join('|');
        },
      ],
      [
        'a19_r10_session_trace_ok',
        'Session trace continuity gate passes clean turns',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2 },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditSessionTraceContinuityGate([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return sessionTraceContinuityGateOpen(report) && report.failedTurns.length === 0 || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_session_trace_fail',
        'Session trace continuity gate fails when option dropped',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 3,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditSessionTraceContinuityGate([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return !sessionTraceContinuityGateOpen(report) && report.failedTurns.includes(3) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_session_horizon',
        'Session horizon alignment flags inactive prior slices',
        () => {
          const decisionsAfter = [
            {
              type: 'x',
              score: 8,
              memoryInfluence: 2,
              memoryInfluenceSlices: [{ horizon: 'long_term_prior', delta: 2, reason: 'prior' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'x', score: 6 }],
            decisionsAfter,
            persistentMemoryEnabled: false,
          });
          const report = auditSessionHorizonAlignment([pack], [{ after: decisionsAfter }]);
          return !sessionHorizonAlignmentOk(report) && report.failedTurns.includes(1) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_export_gate',
        'Explainability export allowed when match gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditExplainabilityExportGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            explainabilityExportAllowed(report) &&
            report.exportPayload !== null &&
            report.exportPayload.schema === 'agent19.explainability.v1'
          ) || JSON.stringify(report);
        },
      ],
      [
        'a19_r10_trace_composite_rollup',
        'Session trace composite rollup counts passes',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 5,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const rollup = buildSessionTraceCompositeRollup([pack], [{ before: decisionsBefore, after: decisionsAfter }]);
          return sessionTraceCompositeAllPassed(rollup) && rollup.passCount === 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r11_final_gate_ok',
        'Final match gate opens when all session checks pass',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'm' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityFinalGate([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFinalGateOpen(report) && report.traceCompositeAllPassed || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_final_gate_fail',
        'Final match gate closed when trace continuity fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 2,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityFinalGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFinalGateOpen(report) && !report.traceContinuityOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_export_bundle',
        'Session export bundle materializes when gates pass',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const bundle = buildSessionExportBundle([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            bundle.exports.length === 1 &&
            sessionExportBundleWithinCap(bundle) &&
            AGENT19_SESSION_EXPORT_TURN_CAP >= 1
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r11_negotiation_session',
        'Negotiation session rollup counts aligned diplomacy turns',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const decisionsAfter = [
            {
              type: 'diplomacy',
              score: 12,
              memoryInfluence: 3,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 3, reason: 'trust from prior deal' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore: [{ type: 'diplomacy', score: 9 }],
            decisionsAfter,
          });
          const rollup = buildNegotiationSessionRollup([pack], {
            relationship: rel,
            decisionsByTurn: [{ after: decisionsAfter }],
          });
          return negotiationSessionMostlyAligned(rollup) && rollup.alignedTurns === 1 || JSON.stringify(rollup);
        },
      ],
      [
        'a19_r11_confidence_export',
        'Confidence export bridge allows export on healthy session',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditConfidenceExportBridge([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return confidenceExportBridgeAllowed(report) && report.confidenceOk || JSON.stringify(report);
        },
      ],
      [
        'a19_r11_recovery_playbook',
        'Recovery playbook lists bounds steps when gate closed',
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
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const playbook = buildMatchRecoveryPlaybook([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            matchRecoveryPlaybookWithinCap(playbook) &&
            playbook.steps.some(s => s.includes('Trim') || s.includes('bounds')) &&
            playbook.stepCount <= AGENT19_RECOVERY_PLAYBOOK_CAP
          ) || playbook.steps.join('|');
        },
      ],
      [
        'a19_r11_recovery_playbook_clean',
        'Recovery playbook is short when match gate open',
        () => {
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'a', score: 5 }];
          const decisionsAfter = [
            {
              type: 'a',
              score: 10,
              memoryInfluence: 5,
              memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 5, reason: 't' }],
            },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const playbook = buildMatchRecoveryPlaybook([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return playbook.steps[0].includes('open') && playbook.stepCount >= 1 || playbook.steps.join('|');
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
