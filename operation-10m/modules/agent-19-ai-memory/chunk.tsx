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


// --- source: match-explainability-delivery-bundle.ts ---
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from './match-explainability-final-gate.ts';

export const AGENT19_DELIVERY_NARRATIVE_CAP = 8;

export interface MatchExplainabilityDeliveryBundle {
  shippable: boolean;
  exportBundle: SessionExportBundle | null;
  giRollup: SessionGiClaimsRollup;
  recoveryPlaybook: MatchRecoveryPlaybook | null;
  narrativeLines: string[];
}

type DeliveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Player-facing delivery bundle: exports when final gate open, playbook when closed. */
export function buildMatchExplainabilityDeliveryBundle(
  packs: TurnExplainabilityPack[],
  params: DeliveryParams,
): MatchExplainabilityDeliveryBundle {
  const finalGate = auditMatchExplainabilityFinalGate(packs, params);
  const giRollup = buildSessionGiClaimsRollup(packs, {
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const sessionRollup = buildSessionExplainabilityRollup(packs);
  const shippable = matchExplainabilityFinalGateOpen(finalGate);
  let exportBundle: SessionExportBundle | null = null;
  let recoveryPlaybook: MatchRecoveryPlaybook | null = null;
  if (shippable) {
    exportBundle = buildSessionExportBundle(packs, params);
  } else {
    recoveryPlaybook = buildMatchRecoveryPlaybook(packs, params);
  }
  const narrativeLines = [
    `Match explainability delivery: ${shippable ? 'SHIPPABLE' : 'BLOCKED'} (${packs.length} turn pack(s)).`,
    ...sessionRollup.narrativeLines.slice(0, 1),
    ...giRollup.narrativeLines.slice(0, 1),
    ...(shippable && exportBundle ? exportBundle.narrativeLines : recoveryPlaybook?.narrativeLines.slice(0, 1) || []),
  ].slice(0, AGENT19_DELIVERY_NARRATIVE_CAP);
  return { shippable, exportBundle, giRollup, recoveryPlaybook, narrativeLines };
}

export function matchExplainabilityDeliveryShippable(bundle: MatchExplainabilityDeliveryBundle): boolean {
  return bundle.shippable;
}


// --- source: session-gi-delivery-bundle.ts ---

export interface SessionGiDeliveryBundle {
  deliverable: boolean;
  giWithinCap: boolean;
  claimCount: number;
  narrativeLines: string[];
}

/** Ask-the-Game delivery bundle: GI rollup only when base match gate is open. */
export function buildSessionGiDeliveryBundle(
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
): SessionGiDeliveryBundle {
  const gate = auditMatchExplainabilityGate(packs, params);
  const giRollup = buildSessionGiClaimsRollup(packs, {
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const giWithinCap = sessionGiRollupWithinCap(giRollup);
  const deliverable = matchExplainabilityGateOpen(gate) && giWithinCap && packs.length > 0;
  const narrativeLines = [
    `Session GI delivery: ${deliverable ? 'READY' : 'HELD'} (${giRollup.claimCount} claim(s), cap ${giWithinCap ? 'ok' : 'FAIL'}).`,
    ...giRollup.narrativeLines.slice(0, 2),
  ];
  return {
    deliverable,
    giWithinCap,
    claimCount: giRollup.claimCount,
    narrativeLines,
  };
}

export function sessionGiDeliveryReady(bundle: SessionGiDeliveryBundle): boolean {
  return bundle.deliverable;
}


// --- source: final-gate-recovery-bridge.ts ---

export const AGENT19_FINAL_RECOVERY_HINT_CAP = 6;

/** Maps final-gate sub-check failures to targeted recovery hints. */
export function buildFinalGateRecoveryHints(report: MatchExplainabilityFinalGateReport): string[] {
  const hints: string[] = [];
  if (!report.matchGateOpen) {
    hints.push('Close session GI cap or confidence band issues before reopening the match gate.');
  }
  if (!report.traceContinuityOpen) {
    hints.push('Restore dropped decision option types — memory must not remove legal choices.');
  }
  if (!report.horizonAlignmentOk) {
    hints.push('Remove influence slices that cite inactive horizons in the post-turn snapshot.');
  }
  if (!report.traceCompositeAllPassed) {
    hints.push('Fix per-turn slice attribution or trace/composite bridge failures.');
  }
  if (report.finalOpen) {
    hints.push('Final explainability gate is open — delivery bundle may ship.');
  }
  return hints.slice(0, AGENT19_FINAL_RECOVERY_HINT_CAP);
}

export function finalGateRecoveryNeeded(report: MatchExplainabilityFinalGateReport): boolean {
  return !report.finalOpen;
}


// --- source: negotiation-export-bridge.ts ---

export interface NegotiationExportBridgeReport {
  includeNegotiationNotes: boolean;
  exportTurnCount: number;
  alignedTurns: number;
  narrativeLines: string[];
}

/** Adds negotiation rollup metadata to export bundle eligibility. */
export function auditNegotiationExportBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    relationship: Partial<AiRelationship> | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): NegotiationExportBridgeReport {
  const negotiation = buildNegotiationSessionRollup(packs, {
    relationship: params.relationship,
    decisionsByTurn: params.decisionsByTurn.map(d => ({ after: d.after })),
  });
  const exportBundle = buildSessionExportBundle(packs, params);
  const includeNegotiationNotes =
    negotiationSessionMostlyAligned(negotiation) && exportBundle.exports.length > 0;
  const narrativeLines = [
    `Negotiation export bridge: notes ${includeNegotiationNotes ? 'included' : 'withheld'} (${negotiation.alignedTurns}/${negotiation.turnCount} aligned).`,
    ...negotiation.narrativeLines,
    ...exportBundle.narrativeLines.slice(0, 1),
  ];
  return {
    includeNegotiationNotes,
    exportTurnCount: exportBundle.exports.length,
    alignedTurns: negotiation.alignedTurns,
    narrativeLines,
  };
}

export function negotiationExportNotesIncluded(report: NegotiationExportBridgeReport): boolean {
  return report.includeNegotiationNotes;
}


// --- source: match-explainability-shipment-gate.ts ---
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from './match-explainability-final-gate.ts';
  buildNegotiationSessionRollup,
  negotiationSessionMostlyAligned,
} from './negotiation-session-rollup.ts';

export interface MatchExplainabilityShipmentGateReport {
  shipmentAllowed: boolean;
  finalGateOpen: boolean;
  confidenceExportOk: boolean;
  negotiationAligned: boolean;
  narrativeLines: string[];
}

/** Shipment gate: final gate + confidence/export bridge + negotiation session alignment. */
export function auditMatchExplainabilityShipmentGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityShipmentGateReport {
  const finalGate = auditMatchExplainabilityFinalGate(packs, params);
  const finalGateOpen = matchExplainabilityFinalGateOpen(finalGate);
  const confidenceExport = auditConfidenceExportBridge(packs, params);
  const confidenceExportOk = confidenceExportBridgeAllowed(confidenceExport);
  const negotiation = buildNegotiationSessionRollup(packs, {
    relationship: params.relationship,
    decisionsByTurn: params.decisionsByTurn.map(d => ({ after: d.after })),
  });
  const negotiationAligned = negotiationSessionMostlyAligned(negotiation);
  const shipmentAllowed = finalGateOpen && confidenceExportOk && negotiationAligned;
  const narrativeLines = [
    `Match explainability shipment: ${shipmentAllowed ? 'ALLOWED' : 'BLOCKED'} (final ${finalGateOpen ? 'ok' : 'fail'}, export ${confidenceExportOk ? 'ok' : 'fail'}, negotiation ${negotiationAligned ? 'ok' : 'fail'}).`,
    ...finalGate.narrativeLines.slice(0, 1),
    ...confidenceExport.narrativeLines.slice(0, 1),
  ];
  return {
    shipmentAllowed,
    finalGateOpen,
    confidenceExportOk,
    negotiationAligned,
    narrativeLines,
  };
}

export function matchExplainabilityShipmentAllowed(report: MatchExplainabilityShipmentGateReport): boolean {
  return report.shipmentAllowed;
}


// --- source: match-explainability-release-bundle.ts ---
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
} from './match-explainability-delivery-bundle.ts';
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';

export const AGENT19_RELEASE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityReleaseBundle {
  releaseReady: boolean;
  deliveryShippable: boolean;
  shipmentAllowed: boolean;
  giDeliveryReady: boolean;
  narrativeLines: string[];
}

type ReleaseParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Release bundle: delivery + shipment + GI delivery must all agree before player launch. */
export function buildMatchExplainabilityReleaseBundle(
  packs: TurnExplainabilityPack[],
  params: ReleaseParams,
): MatchExplainabilityReleaseBundle {
  const delivery = buildMatchExplainabilityDeliveryBundle(packs, params);
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const giDelivery = buildSessionGiDeliveryBundle(packs, params);
  const deliveryShippable = matchExplainabilityDeliveryShippable(delivery);
  const shipmentAllowed = matchExplainabilityShipmentAllowed(shipment);
  const giDeliveryReady = sessionGiDeliveryReady(giDelivery);
  const releaseReady = deliveryShippable && shipmentAllowed && giDeliveryReady;
  const narrativeLines = [
    `Match explainability release: ${releaseReady ? 'READY' : 'HELD'} (delivery ${deliveryShippable ? 'ok' : 'fail'}, shipment ${shipmentAllowed ? 'ok' : 'fail'}, GI ${giDeliveryReady ? 'ok' : 'fail'}).`,
    ...delivery.narrativeLines.slice(0, 2),
    ...shipment.narrativeLines.slice(0, 1),
    ...giDelivery.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_RELEASE_NARRATIVE_CAP);
  return {
    releaseReady,
    deliveryShippable,
    shipmentAllowed,
    giDeliveryReady,
    narrativeLines,
  };
}

export function matchExplainabilityReleaseReady(bundle: MatchExplainabilityReleaseBundle): boolean {
  return bundle.releaseReady;
}


// --- source: shipment-recovery-playbook-bridge.ts ---
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';

export const AGENT19_SHIPMENT_RECOVERY_CAP = 8;

export interface ShipmentRecoveryPlaybookBridge {
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** When shipment is blocked, merge final-gate hints and match recovery playbook steps. */
export function buildShipmentRecoveryPlaybookBridge(
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
): ShipmentRecoveryPlaybookBridge {
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const steps: string[] = [];
  if (!matchExplainabilityShipmentAllowed(shipment)) {
    if (!shipment.finalGateOpen) {
      steps.push(...buildFinalGateRecoveryHints(auditMatchExplainabilityFinalGate(packs, params)));
    }
    if (!shipment.confidenceExportOk) {
      steps.push('Raise session confidence or reopen export gate before shipment.');
    }
    if (!shipment.negotiationAligned) {
      steps.push('Align negotiation threshold shifts with relationship influence slices.');
    }
    steps.push(...buildMatchRecoveryPlaybook(packs, params).steps);
  } else {
    steps.push('Shipment gate open — no recovery steps required.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SHIPMENT_RECOVERY_CAP);
  return {
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Shipment recovery bridge: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function shipmentRecoveryNeeded(
  packs: TurnExplainabilityPack[],
  params: Parameters<typeof buildShipmentRecoveryPlaybookBridge>[1],
): boolean {
  return !matchExplainabilityShipmentAllowed(auditMatchExplainabilityShipmentGate(packs, params));
}


// --- source: delivery-shipment-bridge.ts ---
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
} from './match-explainability-delivery-bundle.ts';
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from './match-explainability-shipment-gate.ts';

export interface DeliveryShipmentBridgeReport {
  aligned: boolean;
  deliveryShippable: boolean;
  shipmentAllowed: boolean;
  narrativeLines: string[];
}

/** Documents whether delivery and shipment gates agree (both must pass for aligned release). */
export function auditDeliveryShipmentBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): DeliveryShipmentBridgeReport {
  const delivery = buildMatchExplainabilityDeliveryBundle(packs, params);
  const shipment = auditMatchExplainabilityShipmentGate(packs, params);
  const deliveryShippable = matchExplainabilityDeliveryShippable(delivery);
  const shipmentAllowed = matchExplainabilityShipmentAllowed(shipment);
  const aligned = deliveryShippable === shipmentAllowed;
  const narrativeLines = [
    `Delivery/shipment bridge: ${aligned ? 'ALIGNED' : 'DIVERGED'} (delivery ${deliveryShippable ? 'ship' : 'block'}, shipment ${shipmentAllowed ? 'allow' : 'deny'}).`,
  ];
  return { aligned, deliveryShippable, shipmentAllowed, narrativeLines };
}

export function deliveryShipmentBridgeAligned(report: DeliveryShipmentBridgeReport): boolean {
  return report.aligned;
}


// --- source: session-release-export-bundle.ts ---
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';

export const AGENT19_SESSION_RELEASE_EXPORT_CAP = 12;

export interface SessionReleaseExportBundle {
  schema: string;
  releaseReady: boolean;
  turnCount: number;
  exports: Record<string, unknown>[];
  giClaimIds: string[];
  narrativeLines: string[];
}

/** JSON-safe session release payload when release bundle is ready. */
export function buildSessionReleaseExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionReleaseExportBundle {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const exportBundle = buildSessionExportBundle(packs, params);
  const gi = buildSessionGiClaimsRollup(packs, { memoryInfluenceEnabled: params.memoryInfluenceEnabled });
  const releaseReady = matchExplainabilityReleaseReady(release);
  const exports = releaseReady
    ? exportBundle.exports.slice(0, AGENT19_SESSION_RELEASE_EXPORT_CAP)
    : [];
  const narrativeLines = [
    `Session release export: ${releaseReady ? 'EMITTED' : 'EMPTY'} (${exports.length} turn record(s), ${gi.claimCount} GI claim(s)).`,
    ...release.narrativeLines.slice(0, 1),
  ];
  return {
    schema: 'agent19.release.v1',
    releaseReady,
    turnCount: packs.length,
    exports,
    giClaimIds: gi.uniqueIds.slice(0, AGENT19_SESSION_RELEASE_EXPORT_CAP),
    narrativeLines,
  };
}

export function sessionReleaseExportEmitted(bundle: SessionReleaseExportBundle): boolean {
  return bundle.releaseReady && bundle.exports.length > 0;
}


// --- source: match-explainability-launch-gate.ts ---
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from './session-release-export-bundle.ts';

export interface MatchExplainabilityLaunchGateReport {
  launchAllowed: boolean;
  releaseReady: boolean;
  releaseExportEmitted: boolean;
  recoveryStepCount: number;
  narrativeLines: string[];
}

type LaunchParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Launch gate: release bundle ready and session release export emitted. */
export function auditMatchExplainabilityLaunchGate(
  packs: TurnExplainabilityPack[],
  params: LaunchParams,
): MatchExplainabilityLaunchGateReport {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const releaseExport = buildSessionReleaseExportBundle(packs, params);
  const recovery = buildShipmentRecoveryPlaybookBridge(packs, params);
  const releaseReady = matchExplainabilityReleaseReady(release);
  const releaseExportEmitted = sessionReleaseExportEmitted(releaseExport);
  const launchAllowed = releaseReady && releaseExportEmitted;
  const narrativeLines = [
    `Match explainability launch: ${launchAllowed ? 'GO' : 'NO-GO'} (release ${releaseReady ? 'ok' : 'fail'}, export ${releaseExportEmitted ? 'ok' : 'fail'}).`,
    ...release.narrativeLines.slice(0, 2),
    ...(launchAllowed ? releaseExport.narrativeLines.slice(0, 1) : recovery.narrativeLines.slice(0, 2)),
  ];
  return {
    launchAllowed,
    releaseReady,
    releaseExportEmitted,
    recoveryStepCount: recovery.stepCount,
    narrativeLines,
  };
}

export function matchExplainabilityLaunchAllowed(report: MatchExplainabilityLaunchGateReport): boolean {
  return report.launchAllowed;
}


// --- source: match-explainability-operations-bundle.ts ---
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from './session-release-export-bundle.ts';

export const AGENT19_OPS_NARRATIVE_CAP = 12;

export interface MatchExplainabilityOperationsBundle {
  operationsReady: boolean;
  launchAllowed: boolean;
  releaseExportEmitted: boolean;
  giDeliveryReady: boolean;
  narrativeLines: string[];
}

type OpsParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Operations bundle: launch gate, release export, and GI delivery for live match tooling. */
export function buildMatchExplainabilityOperationsBundle(
  packs: TurnExplainabilityPack[],
  params: OpsParams,
): MatchExplainabilityOperationsBundle {
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const releaseExport = buildSessionReleaseExportBundle(packs, params);
  const giDelivery = buildSessionGiDeliveryBundle(packs, params);
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  const releaseExportEmitted = sessionReleaseExportEmitted(releaseExport);
  const giDeliveryReady = sessionGiDeliveryReady(giDelivery);
  const operationsReady = launchAllowed && releaseExportEmitted && giDeliveryReady;
  const narrativeLines = [
    `Match explainability operations: ${operationsReady ? 'READY' : 'STANDBY'} (launch ${launchAllowed ? 'GO' : 'NO-GO'}).`,
    ...release.narrativeLines.slice(0, 1),
    ...launch.narrativeLines.slice(0, 2),
    ...giDelivery.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_OPS_NARRATIVE_CAP);
  return {
    operationsReady,
    launchAllowed,
    releaseExportEmitted,
    giDeliveryReady,
    narrativeLines,
  };
}

export function matchExplainabilityOperationsReady(bundle: MatchExplainabilityOperationsBundle): boolean {
  return bundle.operationsReady;
}


// --- source: launch-recovery-orchestrator.ts ---

export const AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP = 10;

export interface LaunchRecoveryOrchestratorReport {
  launchBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** Ordered recovery when launch is blocked — merges shipment, final-gate, and match playbooks. */
export function buildLaunchRecoveryOrchestrator(
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
  launchAllowed: boolean,
): LaunchRecoveryOrchestratorReport {
  const steps: string[] = [];
  if (launchAllowed) {
    steps.push('Launch gate GO — orchestrator idle.');
  } else {
    steps.push(...buildShipmentRecoveryPlaybookBridge(packs, params).steps);
    steps.push(...buildFinalGateRecoveryHints(auditMatchExplainabilityFinalGate(packs, params)));
    steps.push(...buildMatchRecoveryPlaybook(packs, params).steps.slice(0, 3));
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP);
  return {
    launchBlocked: !launchAllowed,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Launch recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 4)],
  };
}

export function launchRecoveryOrchestratorWithinCap(report: LaunchRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP;
}


// --- source: session-operations-export-bundle.ts ---
  buildSessionReleaseExportBundle,
  type SessionReleaseExportBundle,
} from './session-release-export-bundle.ts';
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';

export interface SessionOperationsExportBundle extends SessionReleaseExportBundle {
  launchAllowed: boolean;
  operationsSchema: string;
}

/** Session release export plus launch metadata for replay/ops pipelines. */
export function buildSessionOperationsExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionOperationsExportBundle {
  const base = buildSessionReleaseExportBundle(packs, params);
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  return {
    ...base,
    launchAllowed,
    operationsSchema: 'agent19.operations.v1',
    narrativeLines: [
      ...base.narrativeLines,
      `Operations export: launch ${launchAllowed ? 'GO' : 'NO-GO'}.`,
    ],
  };
}

export function sessionOperationsExportReady(bundle: SessionOperationsExportBundle): boolean {
  return bundle.releaseReady && bundle.launchAllowed && bundle.exports.length > 0;
}


// --- source: release-launch-bridge.ts ---
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';

export interface ReleaseLaunchBridgeReport {
  aligned: boolean;
  releaseReady: boolean;
  launchAllowed: boolean;
  narrativeLines: string[];
}

/** Release-ready sessions should allow launch when export emits; reports divergence. */
export function auditReleaseLaunchBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ReleaseLaunchBridgeReport {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const releaseReady = matchExplainabilityReleaseReady(release);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  const aligned = !releaseReady || launchAllowed;
  const narrativeLines = [
    `Release/launch bridge: ${aligned ? 'ALIGNED' : 'GAP'} (release ${releaseReady ? 'ready' : 'held'}, launch ${launchAllowed ? 'GO' : 'NO-GO'}).`,
    ...release.narrativeLines.slice(0, 1),
    ...launch.narrativeLines.slice(0, 1),
  ];
  return { aligned, releaseReady, launchAllowed, narrativeLines };
}

export function releaseLaunchBridgeAligned(report: ReleaseLaunchBridgeReport): boolean {
  return report.aligned;
}


// --- source: match-explainability-production-gate.ts ---
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from './session-operations-export-bundle.ts';

export interface MatchExplainabilityProductionGateReport {
  productionAllowed: boolean;
  operationsReady: boolean;
  operationsExportReady: boolean;
  releaseLaunchAligned: boolean;
  narrativeLines: string[];
}

/** Production gate: operations bundle + ops export + release/launch alignment. */
export function auditMatchExplainabilityProductionGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityProductionGateReport {
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const opsExport = buildSessionOperationsExportBundle(packs, params);
  const bridge = auditReleaseLaunchBridge(packs, params);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const operationsExportReady = sessionOperationsExportReady(opsExport);
  const releaseLaunchAligned = releaseLaunchBridgeAligned(bridge);
  const productionAllowed = operationsReady && operationsExportReady && releaseLaunchAligned;
  const narrativeLines = [
    `Match explainability production: ${productionAllowed ? 'ALLOWED' : 'BLOCKED'} (ops ${operationsReady ? 'ok' : 'fail'}, export ${operationsExportReady ? 'ok' : 'fail'}).`,
    ...ops.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines.slice(0, 1),
  ];
  return {
    productionAllowed,
    operationsReady,
    operationsExportReady,
    releaseLaunchAligned,
    narrativeLines,
  };
}

export function matchExplainabilityProductionAllowed(report: MatchExplainabilityProductionGateReport): boolean {
  return report.productionAllowed;
}


// --- source: match-explainability-deployment-bundle.ts ---
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from './session-operations-export-bundle.ts';

export const AGENT19_DEPLOYMENT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityDeploymentBundle {
  deploymentReady: boolean;
  productionAllowed: boolean;
  operationsReady: boolean;
  narrativeLines: string[];
}

type DeployParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Deployment bundle: production gate and operations stack must both be green. */
export function buildMatchExplainabilityDeploymentBundle(
  packs: TurnExplainabilityPack[],
  params: DeployParams,
): MatchExplainabilityDeploymentBundle {
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const productionAllowed = matchExplainabilityProductionAllowed(production);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const deploymentReady = productionAllowed && operationsReady;
  const narrativeLines = [
    `Match explainability deployment: ${deploymentReady ? 'READY' : 'PENDING'} (production ${productionAllowed ? 'ok' : 'fail'}, ops ${operationsReady ? 'ok' : 'fail'}).`,
    ...production.narrativeLines.slice(0, 2),
    ...ops.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_DEPLOYMENT_NARRATIVE_CAP);
  return { deploymentReady, productionAllowed, operationsReady, narrativeLines };
}

export function matchExplainabilityDeploymentReady(bundle: MatchExplainabilityDeploymentBundle): boolean {
  return bundle.deploymentReady;
}


// --- source: production-recovery-orchestrator.ts ---
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';

export const AGENT19_PRODUCTION_RECOVERY_CAP = 10;

export interface ProductionRecoveryOrchestratorReport {
  productionBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when production gate blocks deployment. */
export function buildProductionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ProductionRecoveryOrchestratorReport {
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const productionBlocked = !matchExplainabilityProductionAllowed(production);
  const steps: string[] = [];
  if (productionBlocked) {
    if (!production.operationsReady) {
      steps.push('Restore operations bundle: launch, GI delivery, and release export.');
    }
    if (!production.operationsExportReady) {
      steps.push('Emit session operations export before production.');
    }
    if (!production.releaseLaunchAligned) {
      steps.push('Align release readiness with launch GO.');
    }
    steps.push(...buildShipmentRecoveryPlaybookBridge(packs, params).steps.slice(0, 3));
    steps.push(
      ...buildLaunchRecoveryOrchestrator(packs, params, false).steps.slice(0, 3),
    );
  } else {
    steps.push('Production gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PRODUCTION_RECOVERY_CAP);
  return {
    productionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Production recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function productionRecoveryOrchestratorWithinCap(report: ProductionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PRODUCTION_RECOVERY_CAP;
}


// --- source: session-deployment-export-bundle.ts ---
  buildSessionOperationsExportBundle,
  type SessionOperationsExportBundle,
} from './session-operations-export-bundle.ts';
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';

export interface SessionDeploymentExportBundle extends SessionOperationsExportBundle {
  deploymentReady: boolean;
  deploymentSchema: string;
}

/** Deployment export wraps operations export when deployment bundle is ready. */
export function buildSessionDeploymentExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionDeploymentExportBundle {
  const base = buildSessionOperationsExportBundle(packs, params);
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const exports = deploymentReady ? base.exports : [];
  return {
    ...base,
    exports,
    deploymentReady,
    deploymentSchema: 'agent19.deployment.v1',
    releaseReady: deploymentReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Deployment export: ${deploymentReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionDeploymentExportShipped(bundle: SessionDeploymentExportBundle): boolean {
  return bundle.deploymentReady && bundle.exports.length > 0 && bundle.deploymentSchema === 'agent19.deployment.v1';
}


// --- source: operations-production-bridge.ts ---
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from './match-explainability-operations-bundle.ts';
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from './match-explainability-production-gate.ts';

export interface OperationsProductionBridgeReport {
  aligned: boolean;
  operationsReady: boolean;
  productionAllowed: boolean;
  narrativeLines: string[];
}

/** Operations-ready implies production allowed when export and bridge pass. */
export function auditOperationsProductionBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): OperationsProductionBridgeReport {
  const ops = buildMatchExplainabilityOperationsBundle(packs, params);
  const production = auditMatchExplainabilityProductionGate(packs, params);
  const operationsReady = matchExplainabilityOperationsReady(ops);
  const productionAllowed = matchExplainabilityProductionAllowed(production);
  const aligned = operationsReady === productionAllowed;
  const narrativeLines = [
    `Operations/production bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (ops ${operationsReady ? 'ok' : 'fail'}, production ${productionAllowed ? 'ok' : 'fail'}).`,
  ];
  return { aligned, operationsReady, productionAllowed, narrativeLines };
}

export function operationsProductionBridgeHealthy(report: OperationsProductionBridgeReport): boolean {
  return report.operationsReady && report.productionAllowed && report.aligned;
}


// --- source: match-explainability-fleet-gate.ts ---
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from './session-deployment-export-bundle.ts';
  auditOperationsProductionBridge,
  operationsProductionBridgeHealthy,
} from './operations-production-bridge.ts';

export interface MatchExplainabilityFleetGateReport {
  fleetAllowed: boolean;
  deploymentReady: boolean;
  deploymentExportShipped: boolean;
  opsProductionHealthy: boolean;
  narrativeLines: string[];
}

/** Fleet gate: deployment bundle + deployment export + ops/production bridge. */
export function auditMatchExplainabilityFleetGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityFleetGateReport {
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deployExport = buildSessionDeploymentExportBundle(packs, params);
  const bridge = auditOperationsProductionBridge(packs, params);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const deploymentExportShipped = sessionDeploymentExportShipped(deployExport);
  const opsProductionHealthy = operationsProductionBridgeHealthy(bridge);
  const fleetAllowed = deploymentReady && deploymentExportShipped && opsProductionHealthy;
  const narrativeLines = [
    `Match explainability fleet: ${fleetAllowed ? 'ALLOWED' : 'DENIED'} (deploy ${deploymentReady ? 'ok' : 'fail'}, export ${deploymentExportShipped ? 'ok' : 'fail'}).`,
    ...deployment.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    fleetAllowed,
    deploymentReady,
    deploymentExportShipped,
    opsProductionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityFleetAllowed(report: MatchExplainabilityFleetGateReport): boolean {
  return report.fleetAllowed;
}


// --- source: match-explainability-sustainment-bundle.ts ---
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from './match-explainability-deployment-bundle.ts';
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from './session-deployment-export-bundle.ts';

export const AGENT19_SUSTAINMENT_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySustainmentBundle {
  sustainmentReady: boolean;
  fleetAllowed: boolean;
  deploymentReady: boolean;
  deploymentExportShipped: boolean;
  narrativeLines: string[];
}

type SustainmentParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Sustainment bundle: fleet gate and deployment export must both be green. */
export function buildMatchExplainabilitySustainmentBundle(
  packs: TurnExplainabilityPack[],
  params: SustainmentParams,
): MatchExplainabilitySustainmentBundle {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const deployment = buildMatchExplainabilityDeploymentBundle(packs, params);
  const deployExport = buildSessionDeploymentExportBundle(packs, params);
  const fleetAllowed = matchExplainabilityFleetAllowed(fleet);
  const deploymentReady = matchExplainabilityDeploymentReady(deployment);
  const deploymentExportShipped = sessionDeploymentExportShipped(deployExport);
  const sustainmentReady = fleetAllowed && deploymentReady && deploymentExportShipped;
  const narrativeLines = [
    `Match explainability sustainment: ${sustainmentReady ? 'READY' : 'PENDING'} (fleet ${fleetAllowed ? 'ok' : 'fail'}, deploy ${deploymentReady ? 'ok' : 'fail'}).`,
    ...fleet.narrativeLines.slice(0, 2),
    ...deployment.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SUSTAINMENT_NARRATIVE_CAP);
  return {
    sustainmentReady,
    fleetAllowed,
    deploymentReady,
    deploymentExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySustainmentReady(bundle: MatchExplainabilitySustainmentBundle): boolean {
  return bundle.sustainmentReady;
}


// --- source: session-sustainment-export-bundle.ts ---
  buildSessionDeploymentExportBundle,
  type SessionDeploymentExportBundle,
} from './session-deployment-export-bundle.ts';
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';

export interface SessionSustainmentExportBundle extends SessionDeploymentExportBundle {
  sustainmentReady: boolean;
  sustainmentSchema: string;
}

/** Sustainment export wraps deployment export when sustainment bundle is ready. */
export function buildSessionSustainmentExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionSustainmentExportBundle {
  const base = buildSessionDeploymentExportBundle(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const exports = sustainmentReady ? base.exports : [];
  return {
    ...base,
    exports,
    sustainmentReady,
    sustainmentSchema: 'agent19.sustainment.v1',
    releaseReady: sustainmentReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Sustainment export: ${sustainmentReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSustainmentExportShipped(bundle: SessionSustainmentExportBundle): boolean {
  return (
    bundle.sustainmentReady &&
    bundle.exports.length > 0 &&
    bundle.sustainmentSchema === 'agent19.sustainment.v1'
  );
}


// --- source: fleet-sustainment-bridge.ts ---
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';

export interface FleetSustainmentBridgeReport {
  aligned: boolean;
  fleetAllowed: boolean;
  sustainmentReady: boolean;
  narrativeLines: string[];
}

/** Fleet-allowed should match sustainment-ready when export stack passes. */
export function auditFleetSustainmentBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): FleetSustainmentBridgeReport {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const fleetAllowed = matchExplainabilityFleetAllowed(fleet);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const aligned = fleetAllowed === sustainmentReady;
  const narrativeLines = [
    `Fleet/sustainment bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (fleet ${fleetAllowed ? 'ok' : 'fail'}, sustainment ${sustainmentReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, fleetAllowed, sustainmentReady, narrativeLines };
}

export function fleetSustainmentBridgeHealthy(report: FleetSustainmentBridgeReport): boolean {
  return report.fleetAllowed && report.sustainmentReady && report.aligned;
}


// --- source: fleet-recovery-orchestrator.ts ---
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from './match-explainability-fleet-gate.ts';

export const AGENT19_FLEET_RECOVERY_CAP = 10;

export interface FleetRecoveryOrchestratorReport {
  fleetBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when fleet gate blocks sustainment rollout. */
export function buildFleetRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): FleetRecoveryOrchestratorReport {
  const fleet = auditMatchExplainabilityFleetGate(packs, params);
  const fleetBlocked = !matchExplainabilityFleetAllowed(fleet);
  const steps: string[] = [];
  if (fleetBlocked) {
    if (!fleet.deploymentReady) {
      steps.push('Restore deployment bundle: production and operations must pass.');
    }
    if (!fleet.deploymentExportShipped) {
      steps.push('Emit session deployment export before fleet rollout.');
    }
    if (!fleet.opsProductionHealthy) {
      steps.push('Reconcile operations/production bridge before fleet.');
    }
    steps.push(...buildProductionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const deploy = buildMatchExplainabilityDeploymentBundle(packs, params);
    if (!deploy.deploymentReady) {
      steps.push('Re-run deployment readiness checklist on turn packs.');
    }
  } else {
    steps.push('Fleet gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_FLEET_RECOVERY_CAP);
  return {
    fleetBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Fleet recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function fleetRecoveryOrchestratorWithinCap(report: FleetRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_FLEET_RECOVERY_CAP;
}


// --- source: match-explainability-orbit-gate.ts ---
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from './session-sustainment-export-bundle.ts';
  auditFleetSustainmentBridge,
  fleetSustainmentBridgeHealthy,
} from './fleet-sustainment-bridge.ts';

export interface MatchExplainabilityOrbitGateReport {
  orbitAllowed: boolean;
  sustainmentReady: boolean;
  sustainmentExportShipped: boolean;
  fleetSustainmentHealthy: boolean;
  narrativeLines: string[];
}

/** Orbit gate: sustainment bundle + sustainment export + fleet/sustainment bridge. */
export function auditMatchExplainabilityOrbitGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityOrbitGateReport {
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainExport = buildSessionSustainmentExportBundle(packs, params);
  const bridge = auditFleetSustainmentBridge(packs, params);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const sustainmentExportShipped = sessionSustainmentExportShipped(sustainExport);
  const fleetSustainmentHealthy = fleetSustainmentBridgeHealthy(bridge);
  const orbitAllowed = sustainmentReady && sustainmentExportShipped && fleetSustainmentHealthy;
  const narrativeLines = [
    `Match explainability orbit: ${orbitAllowed ? 'ALLOWED' : 'DENIED'} (sustain ${sustainmentReady ? 'ok' : 'fail'}, export ${sustainmentExportShipped ? 'ok' : 'fail'}).`,
    ...sustainment.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    orbitAllowed,
    sustainmentReady,
    sustainmentExportShipped,
    fleetSustainmentHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityOrbitAllowed(report: MatchExplainabilityOrbitGateReport): boolean {
  return report.orbitAllowed;
}


// --- source: match-explainability-transit-bundle.ts ---
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from './match-explainability-sustainment-bundle.ts';
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from './session-sustainment-export-bundle.ts';

export const AGENT19_TRANSIT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityTransitBundle {
  transitReady: boolean;
  orbitAllowed: boolean;
  sustainmentReady: boolean;
  sustainmentExportShipped: boolean;
  narrativeLines: string[];
}

type TransitParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Transit bundle: orbit gate and sustainment export must both be green. */
export function buildMatchExplainabilityTransitBundle(
  packs: TurnExplainabilityPack[],
  params: TransitParams,
): MatchExplainabilityTransitBundle {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
  const sustainExport = buildSessionSustainmentExportBundle(packs, params);
  const orbitAllowed = matchExplainabilityOrbitAllowed(orbit);
  const sustainmentReady = matchExplainabilitySustainmentReady(sustainment);
  const sustainmentExportShipped = sessionSustainmentExportShipped(sustainExport);
  const transitReady = orbitAllowed && sustainmentReady && sustainmentExportShipped;
  const narrativeLines = [
    `Match explainability transit: ${transitReady ? 'READY' : 'PENDING'} (orbit ${orbitAllowed ? 'ok' : 'fail'}, sustain ${sustainmentReady ? 'ok' : 'fail'}).`,
    ...orbit.narrativeLines.slice(0, 2),
    ...sustainment.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_TRANSIT_NARRATIVE_CAP);
  return {
    transitReady,
    orbitAllowed,
    sustainmentReady,
    sustainmentExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityTransitReady(bundle: MatchExplainabilityTransitBundle): boolean {
  return bundle.transitReady;
}


// --- source: session-transit-export-bundle.ts ---
  buildSessionSustainmentExportBundle,
  type SessionSustainmentExportBundle,
} from './session-sustainment-export-bundle.ts';
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';

export interface SessionTransitExportBundle extends SessionSustainmentExportBundle {
  transitReady: boolean;
  transitSchema: string;
}

/** Transit export wraps sustainment export when transit bundle is ready. */
export function buildSessionTransitExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionTransitExportBundle {
  const base = buildSessionSustainmentExportBundle(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitReady = matchExplainabilityTransitReady(transit);
  const exports = transitReady ? base.exports : [];
  return {
    ...base,
    exports,
    transitReady,
    transitSchema: 'agent19.transit.v1',
    releaseReady: transitReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Transit export: ${transitReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionTransitExportShipped(bundle: SessionTransitExportBundle): boolean {
  return (
    bundle.transitReady &&
    bundle.exports.length > 0 &&
    bundle.transitSchema === 'agent19.transit.v1'
  );
}


// --- source: orbit-transit-bridge.ts ---
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';

export interface OrbitTransitBridgeReport {
  aligned: boolean;
  orbitAllowed: boolean;
  transitReady: boolean;
  narrativeLines: string[];
}

/** Orbit-allowed should match transit-ready when sustainment export stack passes. */
export function auditOrbitTransitBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): OrbitTransitBridgeReport {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const orbitAllowed = matchExplainabilityOrbitAllowed(orbit);
  const transitReady = matchExplainabilityTransitReady(transit);
  const aligned = orbitAllowed === transitReady;
  const narrativeLines = [
    `Orbit/transit bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (orbit ${orbitAllowed ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, orbitAllowed, transitReady, narrativeLines };
}

export function orbitTransitBridgeHealthy(report: OrbitTransitBridgeReport): boolean {
  return report.orbitAllowed && report.transitReady && report.aligned;
}


// --- source: match-explainability-relay-gate.ts ---
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from './session-transit-export-bundle.ts';

export interface MatchExplainabilityRelayGateReport {
  relayAllowed: boolean;
  transitReady: boolean;
  transitExportShipped: boolean;
  orbitTransitHealthy: boolean;
  narrativeLines: string[];
}

/** Relay gate: transit bundle + transit export + orbit/transit bridge. */
export function auditMatchExplainabilityRelayGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityRelayGateReport {
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitExport = buildSessionTransitExportBundle(packs, params);
  const bridge = auditOrbitTransitBridge(packs, params);
  const transitReady = matchExplainabilityTransitReady(transit);
  const transitExportShipped = sessionTransitExportShipped(transitExport);
  const orbitTransitHealthy = orbitTransitBridgeHealthy(bridge);
  const relayAllowed = transitReady && transitExportShipped && orbitTransitHealthy;
  const narrativeLines = [
    `Match explainability relay: ${relayAllowed ? 'ALLOWED' : 'DENIED'} (transit ${transitReady ? 'ok' : 'fail'}, export ${transitExportShipped ? 'ok' : 'fail'}).`,
    ...transit.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    relayAllowed,
    transitReady,
    transitExportShipped,
    orbitTransitHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityRelayAllowed(report: MatchExplainabilityRelayGateReport): boolean {
  return report.relayAllowed;
}


// --- source: orbit-recovery-orchestrator.ts ---
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from './match-explainability-orbit-gate.ts';

export const AGENT19_ORBIT_RECOVERY_CAP = 10;

export interface OrbitRecoveryOrchestratorReport {
  orbitBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when orbit gate blocks relay rollout. */
export function buildOrbitRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): OrbitRecoveryOrchestratorReport {
  const orbit = auditMatchExplainabilityOrbitGate(packs, params);
  const orbitBlocked = !matchExplainabilityOrbitAllowed(orbit);
  const steps: string[] = [];
  if (orbitBlocked) {
    if (!orbit.sustainmentReady) {
      steps.push('Restore sustainment bundle: fleet and deployment export must pass.');
    }
    if (!orbit.sustainmentExportShipped) {
      steps.push('Emit session sustainment export before orbit clearance.');
    }
    if (!orbit.fleetSustainmentHealthy) {
      steps.push('Reconcile fleet/sustainment bridge before orbit.');
    }
    steps.push(...buildFleetRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const sustainment = buildMatchExplainabilitySustainmentBundle(packs, params);
    if (!sustainment.sustainmentReady) {
      steps.push('Re-run sustainment readiness checklist on turn packs.');
    }
  } else {
    steps.push('Orbit gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ORBIT_RECOVERY_CAP);
  return {
    orbitBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Orbit recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function orbitRecoveryOrchestratorWithinCap(report: OrbitRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ORBIT_RECOVERY_CAP;
}


// --- source: match-explainability-relay-bundle.ts ---
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from './match-explainability-relay-gate.ts';
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from './session-transit-export-bundle.ts';

export const AGENT19_RELAY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityRelayBundle {
  relayReady: boolean;
  relayAllowed: boolean;
  transitReady: boolean;
  transitExportShipped: boolean;
  narrativeLines: string[];
}

type RelayParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Relay bundle: relay gate and transit export must both be green. */
export function buildMatchExplainabilityRelayBundle(
  packs: TurnExplainabilityPack[],
  params: RelayParams,
): MatchExplainabilityRelayBundle {
  const relay = auditMatchExplainabilityRelayGate(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const transitExport = buildSessionTransitExportBundle(packs, params);
  const relayAllowed = matchExplainabilityRelayAllowed(relay);
  const transitReady = matchExplainabilityTransitReady(transit);
  const transitExportShipped = sessionTransitExportShipped(transitExport);
  const relayReady = relayAllowed && transitReady && transitExportShipped;
  const narrativeLines = [
    `Match explainability relay: ${relayReady ? 'READY' : 'PENDING'} (gate ${relayAllowed ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
    ...relay.narrativeLines.slice(0, 2),
    ...transit.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_RELAY_NARRATIVE_CAP);
  return {
    relayReady,
    relayAllowed,
    transitReady,
    transitExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityRelayReady(bundle: MatchExplainabilityRelayBundle): boolean {
  return bundle.relayReady;
}


// --- source: session-relay-export-bundle.ts ---
  buildSessionTransitExportBundle,
  type SessionTransitExportBundle,
} from './session-transit-export-bundle.ts';
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';

export interface SessionRelayExportBundle extends SessionTransitExportBundle {
  relayReady: boolean;
  relaySchema: string;
}

/** Relay export wraps transit export when relay bundle is ready. */
export function buildSessionRelayExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionRelayExportBundle {
  const base = buildSessionTransitExportBundle(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const exports = relayReady ? base.exports : [];
  return {
    ...base,
    exports,
    relayReady,
    relaySchema: 'agent19.relay.v1',
    releaseReady: relayReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Relay export: ${relayReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionRelayExportShipped(bundle: SessionRelayExportBundle): boolean {
  return (
    bundle.relayReady &&
    bundle.exports.length > 0 &&
    bundle.relaySchema === 'agent19.relay.v1'
  );
}


// --- source: relay-transit-bridge.ts ---
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from './match-explainability-transit-bundle.ts';

export interface RelayTransitBridgeReport {
  aligned: boolean;
  relayReady: boolean;
  transitReady: boolean;
  narrativeLines: string[];
}

/** Relay-ready should match transit-ready when transit export stack passes. */
export function auditRelayTransitBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): RelayTransitBridgeReport {
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const transit = buildMatchExplainabilityTransitBundle(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const transitReady = matchExplainabilityTransitReady(transit);
  const aligned = relayReady === transitReady;
  const narrativeLines = [
    `Relay/transit bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (relay ${relayReady ? 'ok' : 'fail'}, transit ${transitReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, relayReady, transitReady, narrativeLines };
}

export function relayTransitBridgeHealthy(report: RelayTransitBridgeReport): boolean {
  return report.relayReady && report.transitReady && report.aligned;
}


// --- source: match-explainability-beacon-gate.ts ---
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from './session-relay-export-bundle.ts';

export interface MatchExplainabilityBeaconGateReport {
  beaconAllowed: boolean;
  relayReady: boolean;
  relayExportShipped: boolean;
  relayTransitHealthy: boolean;
  narrativeLines: string[];
}

/** Beacon gate: relay bundle + relay export + relay/transit bridge. */
export function auditMatchExplainabilityBeaconGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityBeaconGateReport {
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayExport = buildSessionRelayExportBundle(packs, params);
  const bridge = auditRelayTransitBridge(packs, params);
  const relayReady = matchExplainabilityRelayReady(relay);
  const relayExportShipped = sessionRelayExportShipped(relayExport);
  const relayTransitHealthy = relayTransitBridgeHealthy(bridge);
  const beaconAllowed = relayReady && relayExportShipped && relayTransitHealthy;
  const narrativeLines = [
    `Match explainability beacon: ${beaconAllowed ? 'ALLOWED' : 'DENIED'} (relay ${relayReady ? 'ok' : 'fail'}, export ${relayExportShipped ? 'ok' : 'fail'}).`,
    ...relay.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    beaconAllowed,
    relayReady,
    relayExportShipped,
    relayTransitHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityBeaconAllowed(report: MatchExplainabilityBeaconGateReport): boolean {
  return report.beaconAllowed;
}


// --- source: relay-recovery-orchestrator.ts ---
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from './match-explainability-relay-gate.ts';

export const AGENT19_RELAY_RECOVERY_CAP = 10;

export interface RelayRecoveryOrchestratorReport {
  relayBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when relay gate blocks beacon rollout. */
export function buildRelayRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): RelayRecoveryOrchestratorReport {
  const relay = auditMatchExplainabilityRelayGate(packs, params);
  const relayBlocked = !matchExplainabilityRelayAllowed(relay);
  const steps: string[] = [];
  if (relayBlocked) {
    if (!relay.transitReady) {
      steps.push('Restore transit bundle: orbit and sustainment export must pass.');
    }
    if (!relay.transitExportShipped) {
      steps.push('Emit session transit export before relay clearance.');
    }
    if (!relay.orbitTransitHealthy) {
      steps.push('Reconcile orbit/transit bridge before relay.');
    }
    steps.push(...buildOrbitRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const transit = buildMatchExplainabilityTransitBundle(packs, params);
    if (!transit.transitReady) {
      steps.push('Re-run transit readiness checklist on turn packs.');
    }
  } else {
    steps.push('Relay gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_RELAY_RECOVERY_CAP);
  return {
    relayBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Relay recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function relayRecoveryOrchestratorWithinCap(report: RelayRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_RELAY_RECOVERY_CAP;
}


// --- source: match-explainability-beacon-bundle.ts ---
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from './match-explainability-beacon-gate.ts';
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from './session-relay-export-bundle.ts';

export const AGENT19_BEACON_NARRATIVE_CAP = 10;

export interface MatchExplainabilityBeaconBundle {
  beaconReady: boolean;
  beaconAllowed: boolean;
  relayReady: boolean;
  relayExportShipped: boolean;
  narrativeLines: string[];
}

type BeaconParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Beacon bundle: beacon gate and relay export must both be green. */
export function buildMatchExplainabilityBeaconBundle(
  packs: TurnExplainabilityPack[],
  params: BeaconParams,
): MatchExplainabilityBeaconBundle {
  const beacon = auditMatchExplainabilityBeaconGate(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const relayExport = buildSessionRelayExportBundle(packs, params);
  const beaconAllowed = matchExplainabilityBeaconAllowed(beacon);
  const relayReady = matchExplainabilityRelayReady(relay);
  const relayExportShipped = sessionRelayExportShipped(relayExport);
  const beaconReady = beaconAllowed && relayReady && relayExportShipped;
  const narrativeLines = [
    `Match explainability beacon: ${beaconReady ? 'READY' : 'PENDING'} (gate ${beaconAllowed ? 'ok' : 'fail'}, relay ${relayReady ? 'ok' : 'fail'}).`,
    ...beacon.narrativeLines.slice(0, 2),
    ...relay.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_BEACON_NARRATIVE_CAP);
  return {
    beaconReady,
    beaconAllowed,
    relayReady,
    relayExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityBeaconReady(bundle: MatchExplainabilityBeaconBundle): boolean {
  return bundle.beaconReady;
}


// --- source: session-beacon-export-bundle.ts ---
  buildSessionRelayExportBundle,
  type SessionRelayExportBundle,
} from './session-relay-export-bundle.ts';
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';

export interface SessionBeaconExportBundle extends SessionRelayExportBundle {
  beaconReady: boolean;
  beaconSchema: string;
}

/** Beacon export wraps relay export when beacon bundle is ready. */
export function buildSessionBeaconExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionBeaconExportBundle {
  const base = buildSessionRelayExportBundle(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const exports = beaconReady ? base.exports : [];
  return {
    ...base,
    exports,
    beaconReady,
    beaconSchema: 'agent19.beacon.v1',
    releaseReady: beaconReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Beacon export: ${beaconReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionBeaconExportShipped(bundle: SessionBeaconExportBundle): boolean {
  return (
    bundle.beaconReady &&
    bundle.exports.length > 0 &&
    bundle.beaconSchema === 'agent19.beacon.v1'
  );
}


// --- source: relay-beacon-bridge.ts ---
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from './match-explainability-relay-bundle.ts';

export interface RelayBeaconBridgeReport {
  aligned: boolean;
  beaconReady: boolean;
  relayReady: boolean;
  narrativeLines: string[];
}

/** Beacon-ready should match relay-ready when relay export stack passes. */
export function auditRelayBeaconBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): RelayBeaconBridgeReport {
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const relay = buildMatchExplainabilityRelayBundle(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const relayReady = matchExplainabilityRelayReady(relay);
  const aligned = beaconReady === relayReady;
  const narrativeLines = [
    `Relay/beacon bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (beacon ${beaconReady ? 'ok' : 'fail'}, relay ${relayReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, beaconReady, relayReady, narrativeLines };
}

export function relayBeaconBridgeHealthy(report: RelayBeaconBridgeReport): boolean {
  return report.beaconReady && report.relayReady && report.aligned;
}


// --- source: match-explainability-signal-gate.ts ---
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from './session-beacon-export-bundle.ts';

export interface MatchExplainabilitySignalGateReport {
  signalAllowed: boolean;
  beaconReady: boolean;
  beaconExportShipped: boolean;
  relayBeaconHealthy: boolean;
  narrativeLines: string[];
}

/** Signal gate: beacon bundle + beacon export + relay/beacon bridge. */
export function auditMatchExplainabilitySignalGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilitySignalGateReport {
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconExport = buildSessionBeaconExportBundle(packs, params);
  const bridge = auditRelayBeaconBridge(packs, params);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const beaconExportShipped = sessionBeaconExportShipped(beaconExport);
  const relayBeaconHealthy = relayBeaconBridgeHealthy(bridge);
  const signalAllowed = beaconReady && beaconExportShipped && relayBeaconHealthy;
  const narrativeLines = [
    `Match explainability signal: ${signalAllowed ? 'ALLOWED' : 'DENIED'} (beacon ${beaconReady ? 'ok' : 'fail'}, export ${beaconExportShipped ? 'ok' : 'fail'}).`,
    ...beacon.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    signalAllowed,
    beaconReady,
    beaconExportShipped,
    relayBeaconHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySignalAllowed(report: MatchExplainabilitySignalGateReport): boolean {
  return report.signalAllowed;
}


// --- source: beacon-recovery-orchestrator.ts ---
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from './match-explainability-beacon-gate.ts';

export const AGENT19_BEACON_RECOVERY_CAP = 10;

export interface BeaconRecoveryOrchestratorReport {
  beaconBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when beacon gate blocks signal rollout. */
export function buildBeaconRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): BeaconRecoveryOrchestratorReport {
  const beacon = auditMatchExplainabilityBeaconGate(packs, params);
  const beaconBlocked = !matchExplainabilityBeaconAllowed(beacon);
  const steps: string[] = [];
  if (beaconBlocked) {
    if (!beacon.relayReady) {
      steps.push('Restore relay bundle: transit and relay export must pass.');
    }
    if (!beacon.relayExportShipped) {
      steps.push('Emit session relay export before beacon clearance.');
    }
    if (!beacon.relayTransitHealthy) {
      steps.push('Reconcile relay/transit bridge before beacon.');
    }
    steps.push(...buildRelayRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const relay = buildMatchExplainabilityRelayBundle(packs, params);
    if (!relay.relayReady) {
      steps.push('Re-run relay readiness checklist on turn packs.');
    }
  } else {
    steps.push('Beacon gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_BEACON_RECOVERY_CAP);
  return {
    beaconBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Beacon recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function beaconRecoveryOrchestratorWithinCap(report: BeaconRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_BEACON_RECOVERY_CAP;
}


// --- source: match-explainability-signal-bundle.ts ---
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from './match-explainability-signal-gate.ts';
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from './session-beacon-export-bundle.ts';

export const AGENT19_SIGNAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySignalBundle {
  signalReady: boolean;
  signalAllowed: boolean;
  beaconReady: boolean;
  beaconExportShipped: boolean;
  narrativeLines: string[];
}

type SignalParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Signal bundle: signal gate and beacon export must both be green. */
export function buildMatchExplainabilitySignalBundle(
  packs: TurnExplainabilityPack[],
  params: SignalParams,
): MatchExplainabilitySignalBundle {
  const signal = auditMatchExplainabilitySignalGate(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const beaconExport = buildSessionBeaconExportBundle(packs, params);
  const signalAllowed = matchExplainabilitySignalAllowed(signal);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const beaconExportShipped = sessionBeaconExportShipped(beaconExport);
  const signalReady = signalAllowed && beaconReady && beaconExportShipped;
  const narrativeLines = [
    `Match explainability signal bundle: ${signalReady ? 'READY' : 'PENDING'} (gate ${signalAllowed ? 'ok' : 'fail'}, beacon ${beaconReady ? 'ok' : 'fail'}).`,
    ...signal.narrativeLines.slice(0, 2),
    ...beacon.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SIGNAL_NARRATIVE_CAP);
  return {
    signalReady,
    signalAllowed,
    beaconReady,
    beaconExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySignalReady(bundle: MatchExplainabilitySignalBundle): boolean {
  return bundle.signalReady;
}


// --- source: session-signal-export-bundle.ts ---
  buildSessionBeaconExportBundle,
  type SessionBeaconExportBundle,
} from './session-beacon-export-bundle.ts';
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';

export interface SessionSignalExportBundle extends SessionBeaconExportBundle {
  signalReady: boolean;
  signalSchema: string;
}

/** Signal export wraps beacon export when signal bundle is ready. */
export function buildSessionSignalExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionSignalExportBundle {
  const base = buildSessionBeaconExportBundle(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const exports = signalReady ? base.exports : [];
  return {
    ...base,
    exports,
    signalReady,
    signalSchema: 'agent19.signal.v1',
    releaseReady: signalReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Signal export: ${signalReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSignalExportShipped(bundle: SessionSignalExportBundle): boolean {
  return (
    bundle.signalReady &&
    bundle.exports.length > 0 &&
    bundle.signalSchema === 'agent19.signal.v1'
  );
}


// --- source: beacon-signal-bridge.ts ---
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from './match-explainability-beacon-bundle.ts';

export interface BeaconSignalBridgeReport {
  aligned: boolean;
  signalReady: boolean;
  beaconReady: boolean;
  narrativeLines: string[];
}

/** Signal-ready should match beacon-ready when beacon export stack passes. */
export function auditBeaconSignalBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): BeaconSignalBridgeReport {
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const beaconReady = matchExplainabilityBeaconReady(beacon);
  const aligned = signalReady === beaconReady;
  const narrativeLines = [
    `Beacon/signal bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (signal ${signalReady ? 'ok' : 'fail'}, beacon ${beaconReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, signalReady, beaconReady, narrativeLines };
}

export function beaconSignalBridgeHealthy(report: BeaconSignalBridgeReport): boolean {
  return report.signalReady && report.beaconReady && report.aligned;
}


// --- source: match-explainability-uplink-gate.ts ---
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from './session-signal-export-bundle.ts';

export interface MatchExplainabilityUplinkGateReport {
  uplinkAllowed: boolean;
  signalReady: boolean;
  signalExportShipped: boolean;
  beaconSignalHealthy: boolean;
  narrativeLines: string[];
}

/** Uplink gate: signal bundle + signal export + beacon/signal bridge. */
export function auditMatchExplainabilityUplinkGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityUplinkGateReport {
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalExport = buildSessionSignalExportBundle(packs, params);
  const bridge = auditBeaconSignalBridge(packs, params);
  const signalReady = matchExplainabilitySignalReady(signal);
  const signalExportShipped = sessionSignalExportShipped(signalExport);
  const beaconSignalHealthy = beaconSignalBridgeHealthy(bridge);
  const uplinkAllowed = signalReady && signalExportShipped && beaconSignalHealthy;
  const narrativeLines = [
    `Match explainability uplink: ${uplinkAllowed ? 'ALLOWED' : 'DENIED'} (signal ${signalReady ? 'ok' : 'fail'}, export ${signalExportShipped ? 'ok' : 'fail'}).`,
    ...signal.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    uplinkAllowed,
    signalReady,
    signalExportShipped,
    beaconSignalHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityUplinkAllowed(report: MatchExplainabilityUplinkGateReport): boolean {
  return report.uplinkAllowed;
}


// --- source: signal-recovery-orchestrator.ts ---
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from './match-explainability-signal-gate.ts';

export const AGENT19_SIGNAL_RECOVERY_CAP = 10;

export interface SignalRecoveryOrchestratorReport {
  signalBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when signal gate blocks uplink rollout. */
export function buildSignalRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SignalRecoveryOrchestratorReport {
  const signal = auditMatchExplainabilitySignalGate(packs, params);
  const signalBlocked = !matchExplainabilitySignalAllowed(signal);
  const steps: string[] = [];
  if (signalBlocked) {
    if (!signal.beaconReady) {
      steps.push('Restore beacon bundle: relay and beacon export must pass.');
    }
    if (!signal.beaconExportShipped) {
      steps.push('Emit session beacon export before signal clearance.');
    }
    if (!signal.relayBeaconHealthy) {
      steps.push('Reconcile relay/beacon bridge before signal.');
    }
    steps.push(...buildBeaconRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const beacon = buildMatchExplainabilityBeaconBundle(packs, params);
    if (!beacon.beaconReady) {
      steps.push('Re-run beacon readiness checklist on turn packs.');
    }
  } else {
    steps.push('Signal gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SIGNAL_RECOVERY_CAP);
  return {
    signalBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Signal recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function signalRecoveryOrchestratorWithinCap(report: SignalRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SIGNAL_RECOVERY_CAP;
}


// --- source: match-explainability-uplink-bundle.ts ---
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from './match-explainability-uplink-gate.ts';
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from './session-signal-export-bundle.ts';

export const AGENT19_UPLINK_NARRATIVE_CAP = 10;

export interface MatchExplainabilityUplinkBundle {
  uplinkReady: boolean;
  uplinkAllowed: boolean;
  signalReady: boolean;
  signalExportShipped: boolean;
  narrativeLines: string[];
}

type UplinkParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Uplink bundle: uplink gate and signal export must both be green. */
export function buildMatchExplainabilityUplinkBundle(
  packs: TurnExplainabilityPack[],
  params: UplinkParams,
): MatchExplainabilityUplinkBundle {
  const uplink = auditMatchExplainabilityUplinkGate(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const signalExport = buildSessionSignalExportBundle(packs, params);
  const uplinkAllowed = matchExplainabilityUplinkAllowed(uplink);
  const signalReady = matchExplainabilitySignalReady(signal);
  const signalExportShipped = sessionSignalExportShipped(signalExport);
  const uplinkReady = uplinkAllowed && signalReady && signalExportShipped;
  const narrativeLines = [
    `Match explainability uplink bundle: ${uplinkReady ? 'READY' : 'PENDING'} (gate ${uplinkAllowed ? 'ok' : 'fail'}, signal ${signalReady ? 'ok' : 'fail'}).`,
    ...uplink.narrativeLines.slice(0, 2),
    ...signal.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_UPLINK_NARRATIVE_CAP);
  return {
    uplinkReady,
    uplinkAllowed,
    signalReady,
    signalExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityUplinkReady(bundle: MatchExplainabilityUplinkBundle): boolean {
  return bundle.uplinkReady;
}


// --- source: session-uplink-export-bundle.ts ---
  buildSessionSignalExportBundle,
  type SessionSignalExportBundle,
} from './session-signal-export-bundle.ts';
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';

export interface SessionUplinkExportBundle extends SessionSignalExportBundle {
  uplinkReady: boolean;
  uplinkSchema: string;
}

/** Uplink export wraps signal export when uplink bundle is ready. */
export function buildSessionUplinkExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionUplinkExportBundle {
  const base = buildSessionSignalExportBundle(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const exports = uplinkReady ? base.exports : [];
  return {
    ...base,
    exports,
    uplinkReady,
    uplinkSchema: 'agent19.uplink.v1',
    releaseReady: uplinkReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Uplink export: ${uplinkReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionUplinkExportShipped(bundle: SessionUplinkExportBundle): boolean {
  return (
    bundle.uplinkReady &&
    bundle.exports.length > 0 &&
    bundle.uplinkSchema === 'agent19.uplink.v1'
  );
}


// --- source: signal-uplink-bridge.ts ---
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from './match-explainability-signal-bundle.ts';

export interface SignalUplinkBridgeReport {
  aligned: boolean;
  uplinkReady: boolean;
  signalReady: boolean;
  narrativeLines: string[];
}

/** Uplink-ready should match signal-ready when signal export stack passes. */
export function auditSignalUplinkBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SignalUplinkBridgeReport {
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const signal = buildMatchExplainabilitySignalBundle(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const signalReady = matchExplainabilitySignalReady(signal);
  const aligned = uplinkReady === signalReady;
  const narrativeLines = [
    `Signal/uplink bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (uplink ${uplinkReady ? 'ok' : 'fail'}, signal ${signalReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, uplinkReady, signalReady, narrativeLines };
}

export function signalUplinkBridgeHealthy(report: SignalUplinkBridgeReport): boolean {
  return report.uplinkReady && report.signalReady && report.aligned;
}


// --- source: match-explainability-handshake-gate.ts ---
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from './session-uplink-export-bundle.ts';

export interface MatchExplainabilityHandshakeGateReport {
  handshakeAllowed: boolean;
  uplinkReady: boolean;
  uplinkExportShipped: boolean;
  signalUplinkHealthy: boolean;
  narrativeLines: string[];
}

/** Handshake gate: uplink bundle + uplink export + signal/uplink bridge. */
export function auditMatchExplainabilityHandshakeGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityHandshakeGateReport {
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkExport = buildSessionUplinkExportBundle(packs, params);
  const bridge = auditSignalUplinkBridge(packs, params);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const uplinkExportShipped = sessionUplinkExportShipped(uplinkExport);
  const signalUplinkHealthy = signalUplinkBridgeHealthy(bridge);
  const handshakeAllowed = uplinkReady && uplinkExportShipped && signalUplinkHealthy;
  const narrativeLines = [
    `Match explainability handshake: ${handshakeAllowed ? 'ALLOWED' : 'DENIED'} (uplink ${uplinkReady ? 'ok' : 'fail'}, export ${uplinkExportShipped ? 'ok' : 'fail'}).`,
    ...uplink.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    handshakeAllowed,
    uplinkReady,
    uplinkExportShipped,
    signalUplinkHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityHandshakeAllowed(report: MatchExplainabilityHandshakeGateReport): boolean {
  return report.handshakeAllowed;
}


// --- source: uplink-recovery-orchestrator.ts ---
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from './match-explainability-uplink-gate.ts';

export const AGENT19_UPLINK_RECOVERY_CAP = 10;

export interface UplinkRecoveryOrchestratorReport {
  uplinkBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when uplink gate blocks handshake rollout. */
export function buildUplinkRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): UplinkRecoveryOrchestratorReport {
  const uplink = auditMatchExplainabilityUplinkGate(packs, params);
  const uplinkBlocked = !matchExplainabilityUplinkAllowed(uplink);
  const steps: string[] = [];
  if (uplinkBlocked) {
    if (!uplink.signalReady) {
      steps.push('Restore signal bundle: beacon and signal export must pass.');
    }
    if (!uplink.signalExportShipped) {
      steps.push('Emit session signal export before uplink clearance.');
    }
    if (!uplink.beaconSignalHealthy) {
      steps.push('Reconcile beacon/signal bridge before uplink.');
    }
    steps.push(...buildSignalRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const signal = buildMatchExplainabilitySignalBundle(packs, params);
    if (!signal.signalReady) {
      steps.push('Re-run signal readiness checklist on turn packs.');
    }
  } else {
    steps.push('Uplink gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_UPLINK_RECOVERY_CAP);
  return {
    uplinkBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Uplink recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function uplinkRecoveryOrchestratorWithinCap(report: UplinkRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_UPLINK_RECOVERY_CAP;
}


// --- source: match-explainability-handshake-bundle.ts ---
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from './match-explainability-handshake-gate.ts';
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from './session-uplink-export-bundle.ts';

export const AGENT19_HANDSHAKE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityHandshakeBundle {
  handshakeReady: boolean;
  handshakeAllowed: boolean;
  uplinkReady: boolean;
  uplinkExportShipped: boolean;
  narrativeLines: string[];
}

type HandshakeParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Handshake bundle: handshake gate and uplink export must both be green. */
export function buildMatchExplainabilityHandshakeBundle(
  packs: TurnExplainabilityPack[],
  params: HandshakeParams,
): MatchExplainabilityHandshakeBundle {
  const handshake = auditMatchExplainabilityHandshakeGate(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const uplinkExport = buildSessionUplinkExportBundle(packs, params);
  const handshakeAllowed = matchExplainabilityHandshakeAllowed(handshake);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const uplinkExportShipped = sessionUplinkExportShipped(uplinkExport);
  const handshakeReady = handshakeAllowed && uplinkReady && uplinkExportShipped;
  const narrativeLines = [
    `Match explainability handshake bundle: ${handshakeReady ? 'READY' : 'PENDING'} (gate ${handshakeAllowed ? 'ok' : 'fail'}, uplink ${uplinkReady ? 'ok' : 'fail'}).`,
    ...handshake.narrativeLines.slice(0, 2),
    ...uplink.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_HANDSHAKE_NARRATIVE_CAP);
  return {
    handshakeReady,
    handshakeAllowed,
    uplinkReady,
    uplinkExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityHandshakeReady(bundle: MatchExplainabilityHandshakeBundle): boolean {
  return bundle.handshakeReady;
}


// --- source: session-handshake-export-bundle.ts ---
  buildSessionUplinkExportBundle,
  type SessionUplinkExportBundle,
} from './session-uplink-export-bundle.ts';
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';

export interface SessionHandshakeExportBundle extends SessionUplinkExportBundle {
  handshakeReady: boolean;
  handshakeSchema: string;
}

/** Handshake export wraps uplink export when handshake bundle is ready. */
export function buildSessionHandshakeExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionHandshakeExportBundle {
  const base = buildSessionUplinkExportBundle(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const exports = handshakeReady ? base.exports : [];
  return {
    ...base,
    exports,
    handshakeReady,
    handshakeSchema: 'agent19.handshake.v1',
    releaseReady: handshakeReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Handshake export: ${handshakeReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionHandshakeExportShipped(bundle: SessionHandshakeExportBundle): boolean {
  return (
    bundle.handshakeReady &&
    bundle.exports.length > 0 &&
    bundle.handshakeSchema === 'agent19.handshake.v1'
  );
}


// --- source: uplink-handshake-bridge.ts ---
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from './match-explainability-uplink-bundle.ts';

export interface UplinkHandshakeBridgeReport {
  aligned: boolean;
  handshakeReady: boolean;
  uplinkReady: boolean;
  narrativeLines: string[];
}

/** Handshake-ready should match uplink-ready when uplink export stack passes. */
export function auditUplinkHandshakeBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): UplinkHandshakeBridgeReport {
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const uplinkReady = matchExplainabilityUplinkReady(uplink);
  const aligned = handshakeReady === uplinkReady;
  const narrativeLines = [
    `Uplink/handshake bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (handshake ${handshakeReady ? 'ok' : 'fail'}, uplink ${uplinkReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, handshakeReady, uplinkReady, narrativeLines };
}

export function uplinkHandshakeBridgeHealthy(report: UplinkHandshakeBridgeReport): boolean {
  return report.handshakeReady && report.uplinkReady && report.aligned;
}


// --- source: match-explainability-ack-gate.ts ---
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from './session-handshake-export-bundle.ts';

export interface MatchExplainabilityAckGateReport {
  ackAllowed: boolean;
  handshakeReady: boolean;
  handshakeExportShipped: boolean;
  uplinkHandshakeHealthy: boolean;
  narrativeLines: string[];
}

/** Ack gate: handshake bundle + handshake export + uplink/handshake bridge. */
export function auditMatchExplainabilityAckGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityAckGateReport {
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeExport = buildSessionHandshakeExportBundle(packs, params);
  const bridge = auditUplinkHandshakeBridge(packs, params);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const handshakeExportShipped = sessionHandshakeExportShipped(handshakeExport);
  const uplinkHandshakeHealthy = uplinkHandshakeBridgeHealthy(bridge);
  const ackAllowed = handshakeReady && handshakeExportShipped && uplinkHandshakeHealthy;
  const narrativeLines = [
    `Match explainability ack: ${ackAllowed ? 'ALLOWED' : 'DENIED'} (handshake ${handshakeReady ? 'ok' : 'fail'}, export ${handshakeExportShipped ? 'ok' : 'fail'}).`,
    ...handshake.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    ackAllowed,
    handshakeReady,
    handshakeExportShipped,
    uplinkHandshakeHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAckAllowed(report: MatchExplainabilityAckGateReport): boolean {
  return report.ackAllowed;
}


// --- source: handshake-recovery-orchestrator.ts ---
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from './match-explainability-handshake-gate.ts';

export const AGENT19_HANDSHAKE_RECOVERY_CAP = 10;

export interface HandshakeRecoveryOrchestratorReport {
  handshakeBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when handshake gate blocks ack rollout. */
export function buildHandshakeRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): HandshakeRecoveryOrchestratorReport {
  const handshake = auditMatchExplainabilityHandshakeGate(packs, params);
  const handshakeBlocked = !matchExplainabilityHandshakeAllowed(handshake);
  const steps: string[] = [];
  if (handshakeBlocked) {
    if (!handshake.uplinkReady) {
      steps.push('Restore uplink bundle: signal and uplink export must pass.');
    }
    if (!handshake.uplinkExportShipped) {
      steps.push('Emit session uplink export before handshake clearance.');
    }
    if (!handshake.signalUplinkHealthy) {
      steps.push('Reconcile signal/uplink bridge before handshake.');
    }
    steps.push(...buildUplinkRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const uplink = buildMatchExplainabilityUplinkBundle(packs, params);
    if (!uplink.uplinkReady) {
      steps.push('Re-run uplink readiness checklist on turn packs.');
    }
  } else {
    steps.push('Handshake gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_HANDSHAKE_RECOVERY_CAP);
  return {
    handshakeBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Handshake recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function handshakeRecoveryOrchestratorWithinCap(report: HandshakeRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_HANDSHAKE_RECOVERY_CAP;
}


// --- source: match-explainability-ack-bundle.ts ---
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from './match-explainability-ack-gate.ts';
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from './session-handshake-export-bundle.ts';

export const AGENT19_ACK_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAckBundle {
  ackReady: boolean;
  ackAllowed: boolean;
  handshakeReady: boolean;
  handshakeExportShipped: boolean;
  narrativeLines: string[];
}

type AckParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Ack bundle: ack gate and handshake export must both be green. */
export function buildMatchExplainabilityAckBundle(
  packs: TurnExplainabilityPack[],
  params: AckParams,
): MatchExplainabilityAckBundle {
  const ack = auditMatchExplainabilityAckGate(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const handshakeExport = buildSessionHandshakeExportBundle(packs, params);
  const ackAllowed = matchExplainabilityAckAllowed(ack);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const handshakeExportShipped = sessionHandshakeExportShipped(handshakeExport);
  const ackReady = ackAllowed && handshakeReady && handshakeExportShipped;
  const narrativeLines = [
    `Match explainability ack bundle: ${ackReady ? 'READY' : 'PENDING'} (gate ${ackAllowed ? 'ok' : 'fail'}, handshake ${handshakeReady ? 'ok' : 'fail'}).`,
    ...ack.narrativeLines.slice(0, 2),
    ...handshake.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ACK_NARRATIVE_CAP);
  return {
    ackReady,
    ackAllowed,
    handshakeReady,
    handshakeExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAckReady(bundle: MatchExplainabilityAckBundle): boolean {
  return bundle.ackReady;
}


// --- source: session-ack-export-bundle.ts ---
  buildSessionHandshakeExportBundle,
  type SessionHandshakeExportBundle,
} from './session-handshake-export-bundle.ts';
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';

export interface SessionAckExportBundle extends SessionHandshakeExportBundle {
  ackReady: boolean;
  ackSchema: string;
}

/** Ack export wraps handshake export when ack bundle is ready. */
export function buildSessionAckExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionAckExportBundle {
  const base = buildSessionHandshakeExportBundle(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const exports = ackReady ? base.exports : [];
  return {
    ...base,
    exports,
    ackReady,
    ackSchema: 'agent19.ack.v1',
    releaseReady: ackReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Ack export: ${ackReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAckExportShipped(bundle: SessionAckExportBundle): boolean {
  return bundle.ackReady && bundle.exports.length > 0 && bundle.ackSchema === 'agent19.ack.v1';
}


// --- source: handshake-ack-bridge.ts ---
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from './match-explainability-handshake-bundle.ts';

export interface HandshakeAckBridgeReport {
  aligned: boolean;
  ackReady: boolean;
  handshakeReady: boolean;
  narrativeLines: string[];
}

/** Ack-ready should match handshake-ready when handshake export stack passes. */
export function auditHandshakeAckBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): HandshakeAckBridgeReport {
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const handshakeReady = matchExplainabilityHandshakeReady(handshake);
  const aligned = ackReady === handshakeReady;
  const narrativeLines = [
    `Handshake/ack bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (ack ${ackReady ? 'ok' : 'fail'}, handshake ${handshakeReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, ackReady, handshakeReady, narrativeLines };
}

export function handshakeAckBridgeHealthy(report: HandshakeAckBridgeReport): boolean {
  return report.ackReady && report.handshakeReady && report.aligned;
}


// --- source: match-explainability-confirm-gate.ts ---
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from './session-ack-export-bundle.ts';

export interface MatchExplainabilityConfirmGateReport {
  confirmAllowed: boolean;
  ackReady: boolean;
  ackExportShipped: boolean;
  handshakeAckHealthy: boolean;
  narrativeLines: string[];
}

/** Confirm gate: ack bundle + ack export + handshake/ack bridge. */
export function auditMatchExplainabilityConfirmGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityConfirmGateReport {
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackExport = buildSessionAckExportBundle(packs, params);
  const bridge = auditHandshakeAckBridge(packs, params);
  const ackReady = matchExplainabilityAckReady(ack);
  const ackExportShipped = sessionAckExportShipped(ackExport);
  const handshakeAckHealthy = handshakeAckBridgeHealthy(bridge);
  const confirmAllowed = ackReady && ackExportShipped && handshakeAckHealthy;
  const narrativeLines = [
    `Match explainability confirm: ${confirmAllowed ? 'ALLOWED' : 'DENIED'} (ack ${ackReady ? 'ok' : 'fail'}, export ${ackExportShipped ? 'ok' : 'fail'}).`,
    ...ack.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    confirmAllowed,
    ackReady,
    ackExportShipped,
    handshakeAckHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityConfirmAllowed(report: MatchExplainabilityConfirmGateReport): boolean {
  return report.confirmAllowed;
}


// --- source: ack-recovery-orchestrator.ts ---
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from './match-explainability-ack-gate.ts';

export const AGENT19_ACK_RECOVERY_CAP = 10;

export interface AckRecoveryOrchestratorReport {
  ackBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when ack gate blocks confirm rollout. */
export function buildAckRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AckRecoveryOrchestratorReport {
  const ack = auditMatchExplainabilityAckGate(packs, params);
  const ackBlocked = !matchExplainabilityAckAllowed(ack);
  const steps: string[] = [];
  if (ackBlocked) {
    if (!ack.handshakeReady) {
      steps.push('Restore handshake bundle: uplink and handshake export must pass.');
    }
    if (!ack.handshakeExportShipped) {
      steps.push('Emit session handshake export before ack clearance.');
    }
    if (!ack.uplinkHandshakeHealthy) {
      steps.push('Reconcile uplink/handshake bridge before ack.');
    }
    steps.push(...buildHandshakeRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const handshake = buildMatchExplainabilityHandshakeBundle(packs, params);
    if (!handshake.handshakeReady) {
      steps.push('Re-run handshake readiness checklist on turn packs.');
    }
  } else {
    steps.push('Ack gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ACK_RECOVERY_CAP);
  return {
    ackBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Ack recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function ackRecoveryOrchestratorWithinCap(report: AckRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ACK_RECOVERY_CAP;
}


// --- source: match-explainability-confirm-bundle.ts ---
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from './match-explainability-confirm-gate.ts';
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from './session-ack-export-bundle.ts';

export const AGENT19_CONFIRM_NARRATIVE_CAP = 10;

export interface MatchExplainabilityConfirmBundle {
  confirmReady: boolean;
  confirmAllowed: boolean;
  ackReady: boolean;
  ackExportShipped: boolean;
  narrativeLines: string[];
}

type ConfirmParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Confirm bundle: confirm gate and ack export must both be green. */
export function buildMatchExplainabilityConfirmBundle(
  packs: TurnExplainabilityPack[],
  params: ConfirmParams,
): MatchExplainabilityConfirmBundle {
  const confirm = auditMatchExplainabilityConfirmGate(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const ackExport = buildSessionAckExportBundle(packs, params);
  const confirmAllowed = matchExplainabilityConfirmAllowed(confirm);
  const ackReady = matchExplainabilityAckReady(ack);
  const ackExportShipped = sessionAckExportShipped(ackExport);
  const confirmReady = confirmAllowed && ackReady && ackExportShipped;
  const narrativeLines = [
    `Match explainability confirm bundle: ${confirmReady ? 'READY' : 'PENDING'} (gate ${confirmAllowed ? 'ok' : 'fail'}, ack ${ackReady ? 'ok' : 'fail'}).`,
    ...confirm.narrativeLines.slice(0, 2),
    ...ack.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CONFIRM_NARRATIVE_CAP);
  return {
    confirmReady,
    confirmAllowed,
    ackReady,
    ackExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityConfirmReady(bundle: MatchExplainabilityConfirmBundle): boolean {
  return bundle.confirmReady;
}


// --- source: session-confirm-export-bundle.ts ---
  buildSessionAckExportBundle,
  type SessionAckExportBundle,
} from './session-ack-export-bundle.ts';
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';

export interface SessionConfirmExportBundle extends SessionAckExportBundle {
  confirmReady: boolean;
  confirmSchema: string;
}

/** Confirm export wraps ack export when confirm bundle is ready. */
export function buildSessionConfirmExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionConfirmExportBundle {
  const base = buildSessionAckExportBundle(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const exports = confirmReady ? base.exports : [];
  return {
    ...base,
    exports,
    confirmReady,
    confirmSchema: 'agent19.confirm.v1',
    releaseReady: confirmReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Confirm export: ${confirmReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionConfirmExportShipped(bundle: SessionConfirmExportBundle): boolean {
  return (
    bundle.confirmReady &&
    bundle.exports.length > 0 &&
    bundle.confirmSchema === 'agent19.confirm.v1'
  );
}


// --- source: ack-confirm-bridge.ts ---
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from './match-explainability-ack-bundle.ts';

export interface AckConfirmBridgeReport {
  aligned: boolean;
  confirmReady: boolean;
  ackReady: boolean;
  narrativeLines: string[];
}

/** Confirm-ready should match ack-ready when ack export stack passes. */
export function auditAckConfirmBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): AckConfirmBridgeReport {
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const ack = buildMatchExplainabilityAckBundle(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const ackReady = matchExplainabilityAckReady(ack);
  const aligned = confirmReady === ackReady;
  const narrativeLines = [
    `Ack/confirm bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (confirm ${confirmReady ? 'ok' : 'fail'}, ack ${ackReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, confirmReady, ackReady, narrativeLines };
}

export function ackConfirmBridgeHealthy(report: AckConfirmBridgeReport): boolean {
  return report.confirmReady && report.ackReady && report.aligned;
}


// --- source: match-explainability-seal-gate.ts ---
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from './session-confirm-export-bundle.ts';

export interface MatchExplainabilitySealGateReport {
  sealAllowed: boolean;
  confirmReady: boolean;
  confirmExportShipped: boolean;
  ackConfirmHealthy: boolean;
  narrativeLines: string[];
}

/** Seal gate: confirm bundle + confirm export + ack/confirm bridge. */
export function auditMatchExplainabilitySealGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilitySealGateReport {
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmExport = buildSessionConfirmExportBundle(packs, params);
  const bridge = auditAckConfirmBridge(packs, params);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const confirmExportShipped = sessionConfirmExportShipped(confirmExport);
  const ackConfirmHealthy = ackConfirmBridgeHealthy(bridge);
  const sealAllowed = confirmReady && confirmExportShipped && ackConfirmHealthy;
  const narrativeLines = [
    `Match explainability seal: ${sealAllowed ? 'ALLOWED' : 'DENIED'} (confirm ${confirmReady ? 'ok' : 'fail'}, export ${confirmExportShipped ? 'ok' : 'fail'}).`,
    ...confirm.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    sealAllowed,
    confirmReady,
    confirmExportShipped,
    ackConfirmHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySealAllowed(report: MatchExplainabilitySealGateReport): boolean {
  return report.sealAllowed;
}


// --- source: confirm-recovery-orchestrator.ts ---
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from './match-explainability-confirm-gate.ts';

export const AGENT19_CONFIRM_RECOVERY_CAP = 10;

export interface ConfirmRecoveryOrchestratorReport {
  confirmBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when confirm gate blocks seal rollout. */
export function buildConfirmRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ConfirmRecoveryOrchestratorReport {
  const confirm = auditMatchExplainabilityConfirmGate(packs, params);
  const confirmBlocked = !matchExplainabilityConfirmAllowed(confirm);
  const steps: string[] = [];
  if (confirmBlocked) {
    if (!confirm.ackReady) {
      steps.push('Restore ack bundle: handshake and ack export must pass.');
    }
    if (!confirm.ackExportShipped) {
      steps.push('Emit session ack export before confirm clearance.');
    }
    if (!confirm.handshakeAckHealthy) {
      steps.push('Reconcile handshake/ack bridge before confirm.');
    }
    steps.push(...buildAckRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const ack = buildMatchExplainabilityAckBundle(packs, params);
    if (!ack.ackReady) {
      steps.push('Re-run ack readiness checklist on turn packs.');
    }
  } else {
    steps.push('Confirm gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CONFIRM_RECOVERY_CAP);
  return {
    confirmBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Confirm recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function confirmRecoveryOrchestratorWithinCap(report: ConfirmRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CONFIRM_RECOVERY_CAP;
}


// --- source: match-explainability-seal-bundle.ts ---
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from './match-explainability-seal-gate.ts';
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from './session-confirm-export-bundle.ts';

export const AGENT19_SEAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySealBundle {
  sealReady: boolean;
  sealAllowed: boolean;
  confirmReady: boolean;
  confirmExportShipped: boolean;
  narrativeLines: string[];
}

type SealParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Seal bundle: seal gate and confirm export must both be green. */
export function buildMatchExplainabilitySealBundle(
  packs: TurnExplainabilityPack[],
  params: SealParams,
): MatchExplainabilitySealBundle {
  const seal = auditMatchExplainabilitySealGate(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const confirmExport = buildSessionConfirmExportBundle(packs, params);
  const sealAllowed = matchExplainabilitySealAllowed(seal);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const confirmExportShipped = sessionConfirmExportShipped(confirmExport);
  const sealReady = sealAllowed && confirmReady && confirmExportShipped;
  const narrativeLines = [
    `Match explainability seal bundle: ${sealReady ? 'READY' : 'PENDING'} (gate ${sealAllowed ? 'ok' : 'fail'}, confirm ${confirmReady ? 'ok' : 'fail'}).`,
    ...seal.narrativeLines.slice(0, 2),
    ...confirm.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SEAL_NARRATIVE_CAP);
  return {
    sealReady,
    sealAllowed,
    confirmReady,
    confirmExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySealReady(bundle: MatchExplainabilitySealBundle): boolean {
  return bundle.sealReady;
}


// --- source: session-seal-export-bundle.ts ---
  buildSessionConfirmExportBundle,
  type SessionConfirmExportBundle,
} from './session-confirm-export-bundle.ts';
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';

export interface SessionSealExportBundle extends SessionConfirmExportBundle {
  sealReady: boolean;
  sealSchema: string;
}

/** Seal export wraps confirm export when seal bundle is ready. */
export function buildSessionSealExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionSealExportBundle {
  const base = buildSessionConfirmExportBundle(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const exports = sealReady ? base.exports : [];
  return {
    ...base,
    exports,
    sealReady,
    sealSchema: 'agent19.seal.v1',
    releaseReady: sealReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Seal export: ${sealReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSealExportShipped(bundle: SessionSealExportBundle): boolean {
  return (
    bundle.sealReady &&
    bundle.exports.length > 0 &&
    bundle.sealSchema === 'agent19.seal.v1'
  );
}


// --- source: confirm-seal-bridge.ts ---
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from './match-explainability-confirm-bundle.ts';

export interface ConfirmSealBridgeReport {
  aligned: boolean;
  sealReady: boolean;
  confirmReady: boolean;
  narrativeLines: string[];
}

/** Seal-ready should match confirm-ready when confirm export stack passes. */
export function auditConfirmSealBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ConfirmSealBridgeReport {
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const confirmReady = matchExplainabilityConfirmReady(confirm);
  const aligned = sealReady === confirmReady;
  const narrativeLines = [
    `Confirm/seal bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (seal ${sealReady ? 'ok' : 'fail'}, confirm ${confirmReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, sealReady, confirmReady, narrativeLines };
}

export function confirmSealBridgeHealthy(report: ConfirmSealBridgeReport): boolean {
  return report.sealReady && report.confirmReady && report.aligned;
}


// --- source: match-explainability-covenant-gate.ts ---
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from './session-seal-export-bundle.ts';

export interface MatchExplainabilityCovenantGateReport {
  covenantAllowed: boolean;
  sealReady: boolean;
  sealExportShipped: boolean;
  confirmSealHealthy: boolean;
  narrativeLines: string[];
}

/** Covenant gate: seal bundle + seal export + confirm/seal bridge. */
export function auditMatchExplainabilityCovenantGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityCovenantGateReport {
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealExport = buildSessionSealExportBundle(packs, params);
  const bridge = auditConfirmSealBridge(packs, params);
  const sealReady = matchExplainabilitySealReady(seal);
  const sealExportShipped = sessionSealExportShipped(sealExport);
  const confirmSealHealthy = confirmSealBridgeHealthy(bridge);
  const covenantAllowed = sealReady && sealExportShipped && confirmSealHealthy;
  const narrativeLines = [
    `Match explainability covenant: ${covenantAllowed ? 'ALLOWED' : 'DENIED'} (seal ${sealReady ? 'ok' : 'fail'}, export ${sealExportShipped ? 'ok' : 'fail'}).`,
    ...seal.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    covenantAllowed,
    sealReady,
    sealExportShipped,
    confirmSealHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCovenantAllowed(report: MatchExplainabilityCovenantGateReport): boolean {
  return report.covenantAllowed;
}


// --- source: seal-recovery-orchestrator.ts ---
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from './match-explainability-seal-gate.ts';

export const AGENT19_SEAL_RECOVERY_CAP = 10;

export interface SealRecoveryOrchestratorReport {
  sealBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when seal gate blocks covenant rollout. */
export function buildSealRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SealRecoveryOrchestratorReport {
  const seal = auditMatchExplainabilitySealGate(packs, params);
  const sealBlocked = !matchExplainabilitySealAllowed(seal);
  const steps: string[] = [];
  if (sealBlocked) {
    if (!seal.confirmReady) {
      steps.push('Restore confirm bundle: ack and confirm export must pass.');
    }
    if (!seal.confirmExportShipped) {
      steps.push('Emit session confirm export before seal clearance.');
    }
    if (!seal.ackConfirmHealthy) {
      steps.push('Reconcile ack/confirm bridge before seal.');
    }
    steps.push(...buildConfirmRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const confirm = buildMatchExplainabilityConfirmBundle(packs, params);
    if (!confirm.confirmReady) {
      steps.push('Re-run confirm readiness checklist on turn packs.');
    }
  } else {
    steps.push('Seal gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SEAL_RECOVERY_CAP);
  return {
    sealBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Seal recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function sealRecoveryOrchestratorWithinCap(report: SealRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SEAL_RECOVERY_CAP;
}


// --- source: match-explainability-covenant-bundle.ts ---
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from './match-explainability-covenant-gate.ts';
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from './session-seal-export-bundle.ts';

export const AGENT19_COVENANT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCovenantBundle {
  covenantReady: boolean;
  covenantAllowed: boolean;
  sealReady: boolean;
  sealExportShipped: boolean;
  narrativeLines: string[];
}

type CovenantParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Covenant bundle: covenant gate and seal export must both be green. */
export function buildMatchExplainabilityCovenantBundle(
  packs: TurnExplainabilityPack[],
  params: CovenantParams,
): MatchExplainabilityCovenantBundle {
  const covenant = auditMatchExplainabilityCovenantGate(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const sealExport = buildSessionSealExportBundle(packs, params);
  const covenantAllowed = matchExplainabilityCovenantAllowed(covenant);
  const sealReady = matchExplainabilitySealReady(seal);
  const sealExportShipped = sessionSealExportShipped(sealExport);
  const covenantReady = covenantAllowed && sealReady && sealExportShipped;
  const narrativeLines = [
    `Match explainability covenant bundle: ${covenantReady ? 'READY' : 'PENDING'} (gate ${covenantAllowed ? 'ok' : 'fail'}, seal ${sealReady ? 'ok' : 'fail'}).`,
    ...covenant.narrativeLines.slice(0, 2),
    ...seal.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_COVENANT_NARRATIVE_CAP);
  return {
    covenantReady,
    covenantAllowed,
    sealReady,
    sealExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCovenantReady(bundle: MatchExplainabilityCovenantBundle): boolean {
  return bundle.covenantReady;
}


// --- source: session-covenant-export-bundle.ts ---
  buildSessionSealExportBundle,
  type SessionSealExportBundle,
} from './session-seal-export-bundle.ts';
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';

export interface SessionCovenantExportBundle extends SessionSealExportBundle {
  covenantReady: boolean;
  covenantSchema: string;
}

/** Covenant export wraps seal export when covenant bundle is ready. */
export function buildSessionCovenantExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionCovenantExportBundle {
  const base = buildSessionSealExportBundle(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const exports = covenantReady ? base.exports : [];
  return {
    ...base,
    exports,
    covenantReady,
    covenantSchema: 'agent19.covenant.v1',
    releaseReady: covenantReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Covenant export: ${covenantReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCovenantExportShipped(bundle: SessionCovenantExportBundle): boolean {
  return (
    bundle.covenantReady &&
    bundle.exports.length > 0 &&
    bundle.covenantSchema === 'agent19.covenant.v1'
  );
}


// --- source: seal-covenant-bridge.ts ---
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from './match-explainability-seal-bundle.ts';

export interface SealCovenantBridgeReport {
  aligned: boolean;
  covenantReady: boolean;
  sealReady: boolean;
  narrativeLines: string[];
}

/** Covenant-ready should match seal-ready when seal export stack passes. */
export function auditSealCovenantBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SealCovenantBridgeReport {
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const seal = buildMatchExplainabilitySealBundle(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const sealReady = matchExplainabilitySealReady(seal);
  const aligned = covenantReady === sealReady;
  const narrativeLines = [
    `Seal/covenant bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (covenant ${covenantReady ? 'ok' : 'fail'}, seal ${sealReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, covenantReady, sealReady, narrativeLines };
}

export function sealCovenantBridgeHealthy(report: SealCovenantBridgeReport): boolean {
  return report.covenantReady && report.sealReady && report.aligned;
}


// --- source: match-explainability-charter-gate.ts ---
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from './session-covenant-export-bundle.ts';

export interface MatchExplainabilityCharterGateReport {
  charterAllowed: boolean;
  covenantReady: boolean;
  covenantExportShipped: boolean;
  sealCovenantHealthy: boolean;
  narrativeLines: string[];
}

/** Charter gate: covenant bundle + covenant export + seal/covenant bridge. */
export function auditMatchExplainabilityCharterGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityCharterGateReport {
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantExport = buildSessionCovenantExportBundle(packs, params);
  const bridge = auditSealCovenantBridge(packs, params);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const covenantExportShipped = sessionCovenantExportShipped(covenantExport);
  const sealCovenantHealthy = sealCovenantBridgeHealthy(bridge);
  const charterAllowed = covenantReady && covenantExportShipped && sealCovenantHealthy;
  const narrativeLines = [
    `Match explainability charter: ${charterAllowed ? 'ALLOWED' : 'DENIED'} (covenant ${covenantReady ? 'ok' : 'fail'}, export ${covenantExportShipped ? 'ok' : 'fail'}).`,
    ...covenant.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    charterAllowed,
    covenantReady,
    covenantExportShipped,
    sealCovenantHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCharterAllowed(report: MatchExplainabilityCharterGateReport): boolean {
  return report.charterAllowed;
}


// --- source: covenant-recovery-orchestrator.ts ---
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from './match-explainability-covenant-gate.ts';

export const AGENT19_COVENANT_RECOVERY_CAP = 10;

export interface CovenantRecoveryOrchestratorReport {
  covenantBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when covenant gate blocks charter rollout. */
export function buildCovenantRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CovenantRecoveryOrchestratorReport {
  const covenant = auditMatchExplainabilityCovenantGate(packs, params);
  const covenantBlocked = !matchExplainabilityCovenantAllowed(covenant);
  const steps: string[] = [];
  if (covenantBlocked) {
    if (!covenant.sealReady) {
      steps.push('Restore seal bundle: confirm and seal export must pass.');
    }
    if (!covenant.sealExportShipped) {
      steps.push('Emit session seal export before covenant clearance.');
    }
    if (!covenant.confirmSealHealthy) {
      steps.push('Reconcile confirm/seal bridge before covenant.');
    }
    steps.push(...buildSealRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const seal = buildMatchExplainabilitySealBundle(packs, params);
    if (!seal.sealReady) {
      steps.push('Re-run seal readiness checklist on turn packs.');
    }
  } else {
    steps.push('Covenant gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_COVENANT_RECOVERY_CAP);
  return {
    covenantBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Covenant recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function covenantRecoveryOrchestratorWithinCap(report: CovenantRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_COVENANT_RECOVERY_CAP;
}


// --- source: match-explainability-charter-bundle.ts ---
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from './match-explainability-charter-gate.ts';
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from './session-covenant-export-bundle.ts';

export const AGENT19_CHARTER_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCharterBundle {
  charterReady: boolean;
  charterAllowed: boolean;
  covenantReady: boolean;
  covenantExportShipped: boolean;
  narrativeLines: string[];
}

type CharterParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Charter bundle: charter gate and covenant export must both be green. */
export function buildMatchExplainabilityCharterBundle(
  packs: TurnExplainabilityPack[],
  params: CharterParams,
): MatchExplainabilityCharterBundle {
  const charter = auditMatchExplainabilityCharterGate(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const covenantExport = buildSessionCovenantExportBundle(packs, params);
  const charterAllowed = matchExplainabilityCharterAllowed(charter);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const covenantExportShipped = sessionCovenantExportShipped(covenantExport);
  const charterReady = charterAllowed && covenantReady && covenantExportShipped;
  const narrativeLines = [
    `Match explainability charter bundle: ${charterReady ? 'READY' : 'PENDING'} (gate ${charterAllowed ? 'ok' : 'fail'}, covenant ${covenantReady ? 'ok' : 'fail'}).`,
    ...charter.narrativeLines.slice(0, 2),
    ...covenant.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_CHARTER_NARRATIVE_CAP);
  return {
    charterReady,
    charterAllowed,
    covenantReady,
    covenantExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCharterReady(bundle: MatchExplainabilityCharterBundle): boolean {
  return bundle.charterReady;
}


// --- source: session-charter-export-bundle.ts ---
  buildSessionCovenantExportBundle,
  type SessionCovenantExportBundle,
} from './session-covenant-export-bundle.ts';
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';

export interface SessionCharterExportBundle extends SessionCovenantExportBundle {
  charterReady: boolean;
  charterSchema: string;
}

/** Charter export wraps covenant export when charter bundle is ready. */
export function buildSessionCharterExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionCharterExportBundle {
  const base = buildSessionCovenantExportBundle(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const exports = charterReady ? base.exports : [];
  return {
    ...base,
    exports,
    charterReady,
    charterSchema: 'agent19.charter.v1',
    releaseReady: charterReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Charter export: ${charterReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCharterExportShipped(bundle: SessionCharterExportBundle): boolean {
  return (
    bundle.charterReady &&
    bundle.exports.length > 0 &&
    bundle.charterSchema === 'agent19.charter.v1'
  );
}


// --- source: covenant-charter-bridge.ts ---
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from './match-explainability-covenant-bundle.ts';

export interface CovenantCharterBridgeReport {
  aligned: boolean;
  charterReady: boolean;
  covenantReady: boolean;
  narrativeLines: string[];
}

/** Charter-ready should match covenant-ready when covenant export stack passes. */
export function auditCovenantCharterBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): CovenantCharterBridgeReport {
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const covenantReady = matchExplainabilityCovenantReady(covenant);
  const aligned = charterReady === covenantReady;
  const narrativeLines = [
    `Covenant/charter bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (charter ${charterReady ? 'ok' : 'fail'}, covenant ${covenantReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, charterReady, covenantReady, narrativeLines };
}

export function covenantCharterBridgeHealthy(report: CovenantCharterBridgeReport): boolean {
  return report.charterReady && report.covenantReady && report.aligned;
}


// --- source: match-explainability-pact-gate.ts ---
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from './session-charter-export-bundle.ts';

export interface MatchExplainabilityPactGateReport {
  pactAllowed: boolean;
  charterReady: boolean;
  charterExportShipped: boolean;
  covenantCharterHealthy: boolean;
  narrativeLines: string[];
}

/** Pact gate: charter bundle + charter export + covenant/charter bridge. */
export function auditMatchExplainabilityPactGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityPactGateReport {
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterExport = buildSessionCharterExportBundle(packs, params);
  const bridge = auditCovenantCharterBridge(packs, params);
  const charterReady = matchExplainabilityCharterReady(charter);
  const charterExportShipped = sessionCharterExportShipped(charterExport);
  const covenantCharterHealthy = covenantCharterBridgeHealthy(bridge);
  const pactAllowed = charterReady && charterExportShipped && covenantCharterHealthy;
  const narrativeLines = [
    `Match explainability pact: ${pactAllowed ? 'ALLOWED' : 'DENIED'} (charter ${charterReady ? 'ok' : 'fail'}, export ${charterExportShipped ? 'ok' : 'fail'}).`,
    ...charter.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    pactAllowed,
    charterReady,
    charterExportShipped,
    covenantCharterHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityPactAllowed(report: MatchExplainabilityPactGateReport): boolean {
  return report.pactAllowed;
}


// --- source: charter-recovery-orchestrator.ts ---
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from './match-explainability-charter-gate.ts';

export const AGENT19_CHARTER_RECOVERY_CAP = 10;

export interface CharterRecoveryOrchestratorReport {
  charterBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when charter gate blocks pact rollout. */
export function buildCharterRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CharterRecoveryOrchestratorReport {
  const charter = auditMatchExplainabilityCharterGate(packs, params);
  const charterBlocked = !matchExplainabilityCharterAllowed(charter);
  const steps: string[] = [];
  if (charterBlocked) {
    if (!charter.covenantReady) {
      steps.push('Restore covenant bundle: seal and covenant export must pass.');
    }
    if (!charter.covenantExportShipped) {
      steps.push('Emit session covenant export before charter clearance.');
    }
    if (!charter.sealCovenantHealthy) {
      steps.push('Reconcile seal/covenant bridge before charter.');
    }
    steps.push(...buildCovenantRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const covenant = buildMatchExplainabilityCovenantBundle(packs, params);
    if (!covenant.covenantReady) {
      steps.push('Re-run covenant readiness checklist on turn packs.');
    }
  } else {
    steps.push('Charter gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_CHARTER_RECOVERY_CAP);
  return {
    charterBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Charter recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function charterRecoveryOrchestratorWithinCap(report: CharterRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_CHARTER_RECOVERY_CAP;
}


// --- source: match-explainability-pact-bundle.ts ---
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from './match-explainability-pact-gate.ts';
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from './session-charter-export-bundle.ts';

export const AGENT19_PACT_NARRATIVE_CAP = 10;

export interface MatchExplainabilityPactBundle {
  pactReady: boolean;
  pactAllowed: boolean;
  charterReady: boolean;
  charterExportShipped: boolean;
  narrativeLines: string[];
}

type PactParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Pact bundle: pact gate and charter export must both be green. */
export function buildMatchExplainabilityPactBundle(
  packs: TurnExplainabilityPack[],
  params: PactParams,
): MatchExplainabilityPactBundle {
  const pact = auditMatchExplainabilityPactGate(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const charterExport = buildSessionCharterExportBundle(packs, params);
  const pactAllowed = matchExplainabilityPactAllowed(pact);
  const charterReady = matchExplainabilityCharterReady(charter);
  const charterExportShipped = sessionCharterExportShipped(charterExport);
  const pactReady = pactAllowed && charterReady && charterExportShipped;
  const narrativeLines = [
    `Match explainability pact bundle: ${pactReady ? 'READY' : 'PENDING'} (gate ${pactAllowed ? 'ok' : 'fail'}, charter ${charterReady ? 'ok' : 'fail'}).`,
    ...pact.narrativeLines.slice(0, 2),
    ...charter.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_PACT_NARRATIVE_CAP);
  return {
    pactReady,
    pactAllowed,
    charterReady,
    charterExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityPactReady(bundle: MatchExplainabilityPactBundle): boolean {
  return bundle.pactReady;
}


// --- source: session-pact-export-bundle.ts ---
  buildSessionCharterExportBundle,
  type SessionCharterExportBundle,
} from './session-charter-export-bundle.ts';
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';

export interface SessionPactExportBundle extends SessionCharterExportBundle {
  pactReady: boolean;
  pactSchema: string;
}

/** Pact export wraps charter export when pact bundle is ready. */
export function buildSessionPactExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionPactExportBundle {
  const base = buildSessionCharterExportBundle(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const exports = pactReady ? base.exports : [];
  return {
    ...base,
    exports,
    pactReady,
    pactSchema: 'agent19.pact.v1',
    releaseReady: pactReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Pact export: ${pactReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionPactExportShipped(bundle: SessionPactExportBundle): boolean {
  return (
    bundle.pactReady &&
    bundle.exports.length > 0 &&
    bundle.pactSchema === 'agent19.pact.v1'
  );
}


// --- source: charter-pact-bridge.ts ---
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from './match-explainability-charter-bundle.ts';

export interface CharterPactBridgeReport {
  aligned: boolean;
  pactReady: boolean;
  charterReady: boolean;
  narrativeLines: string[];
}

/** Pact-ready should match charter-ready when charter export stack passes. */
export function auditCharterPactBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): CharterPactBridgeReport {
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const charter = buildMatchExplainabilityCharterBundle(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const charterReady = matchExplainabilityCharterReady(charter);
  const aligned = pactReady === charterReady;
  const narrativeLines = [
    `Charter/pact bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (pact ${pactReady ? 'ok' : 'fail'}, charter ${charterReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, pactReady, charterReady, narrativeLines };
}

export function charterPactBridgeHealthy(report: CharterPactBridgeReport): boolean {
  return report.pactReady && report.charterReady && report.aligned;
}


// --- source: match-explainability-treaty-gate.ts ---
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from './session-pact-export-bundle.ts';

export interface MatchExplainabilityTreatyGateReport {
  treatyAllowed: boolean;
  pactReady: boolean;
  pactExportShipped: boolean;
  charterPactHealthy: boolean;
  narrativeLines: string[];
}

/** Treaty gate: pact bundle + pact export + charter/pact bridge. */
export function auditMatchExplainabilityTreatyGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityTreatyGateReport {
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactExport = buildSessionPactExportBundle(packs, params);
  const bridge = auditCharterPactBridge(packs, params);
  const pactReady = matchExplainabilityPactReady(pact);
  const pactExportShipped = sessionPactExportShipped(pactExport);
  const charterPactHealthy = charterPactBridgeHealthy(bridge);
  const treatyAllowed = pactReady && pactExportShipped && charterPactHealthy;
  const narrativeLines = [
    `Match explainability treaty: ${treatyAllowed ? 'ALLOWED' : 'DENIED'} (pact ${pactReady ? 'ok' : 'fail'}, export ${pactExportShipped ? 'ok' : 'fail'}).`,
    ...pact.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    treatyAllowed,
    pactReady,
    pactExportShipped,
    charterPactHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityTreatyAllowed(report: MatchExplainabilityTreatyGateReport): boolean {
  return report.treatyAllowed;
}


// --- source: pact-recovery-orchestrator.ts ---
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from './match-explainability-pact-gate.ts';

export const AGENT19_PACT_RECOVERY_CAP = 10;

export interface PactRecoveryOrchestratorReport {
  pactBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when pact gate blocks treaty rollout. */
export function buildPactRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): PactRecoveryOrchestratorReport {
  const pact = auditMatchExplainabilityPactGate(packs, params);
  const pactBlocked = !matchExplainabilityPactAllowed(pact);
  const steps: string[] = [];
  if (pactBlocked) {
    if (!pact.charterReady) {
      steps.push('Restore charter bundle: covenant and charter export must pass.');
    }
    if (!pact.charterExportShipped) {
      steps.push('Emit session charter export before pact clearance.');
    }
    if (!pact.covenantCharterHealthy) {
      steps.push('Reconcile covenant/charter bridge before pact.');
    }
    steps.push(...buildCharterRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const charter = buildMatchExplainabilityCharterBundle(packs, params);
    if (!charter.charterReady) {
      steps.push('Re-run charter readiness checklist on turn packs.');
    }
  } else {
    steps.push('Pact gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_PACT_RECOVERY_CAP);
  return {
    pactBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Pact recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function pactRecoveryOrchestratorWithinCap(report: PactRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_PACT_RECOVERY_CAP;
}


// --- source: match-explainability-treaty-bundle.ts ---
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from './match-explainability-treaty-gate.ts';
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from './session-pact-export-bundle.ts';

export const AGENT19_TREATY_NARRATIVE_CAP = 10;

export interface MatchExplainabilityTreatyBundle {
  treatyReady: boolean;
  treatyAllowed: boolean;
  pactReady: boolean;
  pactExportShipped: boolean;
  narrativeLines: string[];
}

type TreatyParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Treaty bundle: treaty gate and pact export must both be green. */
export function buildMatchExplainabilityTreatyBundle(
  packs: TurnExplainabilityPack[],
  params: TreatyParams,
): MatchExplainabilityTreatyBundle {
  const treaty = auditMatchExplainabilityTreatyGate(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const pactExport = buildSessionPactExportBundle(packs, params);
  const treatyAllowed = matchExplainabilityTreatyAllowed(treaty);
  const pactReady = matchExplainabilityPactReady(pact);
  const pactExportShipped = sessionPactExportShipped(pactExport);
  const treatyReady = treatyAllowed && pactReady && pactExportShipped;
  const narrativeLines = [
    `Match explainability treaty bundle: ${treatyReady ? 'READY' : 'PENDING'} (gate ${treatyAllowed ? 'ok' : 'fail'}, pact ${pactReady ? 'ok' : 'fail'}).`,
    ...treaty.narrativeLines.slice(0, 2),
    ...pact.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_TREATY_NARRATIVE_CAP);
  return {
    treatyReady,
    treatyAllowed,
    pactReady,
    pactExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityTreatyReady(bundle: MatchExplainabilityTreatyBundle): boolean {
  return bundle.treatyReady;
}


// --- source: session-treaty-export-bundle.ts ---
  buildSessionPactExportBundle,
  type SessionPactExportBundle,
} from './session-pact-export-bundle.ts';
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';

export interface SessionTreatyExportBundle extends SessionPactExportBundle {
  treatyReady: boolean;
  treatySchema: string;
}

/** Treaty export wraps pact export when treaty bundle is ready. */
export function buildSessionTreatyExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionTreatyExportBundle {
  const base = buildSessionPactExportBundle(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const exports = treatyReady ? base.exports : [];
  return {
    ...base,
    exports,
    treatyReady,
    treatySchema: 'agent19.treaty.v1',
    releaseReady: treatyReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Treaty export: ${treatyReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionTreatyExportShipped(bundle: SessionTreatyExportBundle): boolean {
  return (
    bundle.treatyReady &&
    bundle.exports.length > 0 &&
    bundle.treatySchema === 'agent19.treaty.v1'
  );
}


// --- source: pact-treaty-bridge.ts ---
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from './match-explainability-pact-bundle.ts';

export interface PactTreatyBridgeReport {
  aligned: boolean;
  treatyReady: boolean;
  pactReady: boolean;
  narrativeLines: string[];
}

/** Treaty-ready should match pact-ready when pact export stack passes. */
export function auditPactTreatyBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): PactTreatyBridgeReport {
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const pact = buildMatchExplainabilityPactBundle(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const pactReady = matchExplainabilityPactReady(pact);
  const aligned = treatyReady === pactReady;
  const narrativeLines = [
    `Pact/treaty bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (treaty ${treatyReady ? 'ok' : 'fail'}, pact ${pactReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, treatyReady, pactReady, narrativeLines };
}

export function pactTreatyBridgeHealthy(report: PactTreatyBridgeReport): boolean {
  return report.treatyReady && report.pactReady && report.aligned;
}


// --- source: match-explainability-accord-gate.ts ---
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from './session-treaty-export-bundle.ts';

export interface MatchExplainabilityAccordGateReport {
  accordAllowed: boolean;
  treatyReady: boolean;
  treatyExportShipped: boolean;
  pactTreatyHealthy: boolean;
  narrativeLines: string[];
}

/** Accord gate: treaty bundle + treaty export + pact/treaty bridge. */
export function auditMatchExplainabilityAccordGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityAccordGateReport {
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyExport = buildSessionTreatyExportBundle(packs, params);
  const bridge = auditPactTreatyBridge(packs, params);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const treatyExportShipped = sessionTreatyExportShipped(treatyExport);
  const pactTreatyHealthy = pactTreatyBridgeHealthy(bridge);
  const accordAllowed = treatyReady && treatyExportShipped && pactTreatyHealthy;
  const narrativeLines = [
    `Match explainability accord: ${accordAllowed ? 'ALLOWED' : 'DENIED'} (treaty ${treatyReady ? 'ok' : 'fail'}, export ${treatyExportShipped ? 'ok' : 'fail'}).`,
    ...treaty.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    accordAllowed,
    treatyReady,
    treatyExportShipped,
    pactTreatyHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityAccordAllowed(report: MatchExplainabilityAccordGateReport): boolean {
  return report.accordAllowed;
}


// --- source: treaty-recovery-orchestrator.ts ---
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from './match-explainability-treaty-gate.ts';

export const AGENT19_TREATY_RECOVERY_CAP = 10;

export interface TreatyRecoveryOrchestratorReport {
  treatyBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when treaty gate blocks accord rollout. */
export function buildTreatyRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): TreatyRecoveryOrchestratorReport {
  const treaty = auditMatchExplainabilityTreatyGate(packs, params);
  const treatyBlocked = !matchExplainabilityTreatyAllowed(treaty);
  const steps: string[] = [];
  if (treatyBlocked) {
    if (!treaty.pactReady) {
      steps.push('Restore pact bundle: charter and pact export must pass.');
    }
    if (!treaty.pactExportShipped) {
      steps.push('Emit session pact export before treaty clearance.');
    }
    if (!treaty.charterPactHealthy) {
      steps.push('Reconcile charter/pact bridge before treaty.');
    }
    steps.push(...buildPactRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const pact = buildMatchExplainabilityPactBundle(packs, params);
    if (!pact.pactReady) {
      steps.push('Re-run pact readiness checklist on turn packs.');
    }
  } else {
    steps.push('Treaty gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_TREATY_RECOVERY_CAP);
  return {
    treatyBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Treaty recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function treatyRecoveryOrchestratorWithinCap(report: TreatyRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_TREATY_RECOVERY_CAP;
}


// --- source: match-explainability-accord-bundle.ts ---
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from './match-explainability-accord-gate.ts';
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from './session-treaty-export-bundle.ts';

export const AGENT19_ACCORD_NARRATIVE_CAP = 10;

export interface MatchExplainabilityAccordBundle {
  accordReady: boolean;
  accordAllowed: boolean;
  treatyReady: boolean;
  treatyExportShipped: boolean;
  narrativeLines: string[];
}

type AccordParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Accord bundle: accord gate and treaty export must both be green. */
export function buildMatchExplainabilityAccordBundle(
  packs: TurnExplainabilityPack[],
  params: AccordParams,
): MatchExplainabilityAccordBundle {
  const accord = auditMatchExplainabilityAccordGate(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const treatyExport = buildSessionTreatyExportBundle(packs, params);
  const accordAllowed = matchExplainabilityAccordAllowed(accord);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const treatyExportShipped = sessionTreatyExportShipped(treatyExport);
  const accordReady = accordAllowed && treatyReady && treatyExportShipped;
  const narrativeLines = [
    `Match explainability accord bundle: ${accordReady ? 'READY' : 'PENDING'} (gate ${accordAllowed ? 'ok' : 'fail'}, treaty ${treatyReady ? 'ok' : 'fail'}).`,
    ...accord.narrativeLines.slice(0, 2),
    ...treaty.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_ACCORD_NARRATIVE_CAP);
  return {
    accordReady,
    accordAllowed,
    treatyReady,
    treatyExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityAccordReady(bundle: MatchExplainabilityAccordBundle): boolean {
  return bundle.accordReady;
}


// --- source: session-accord-export-bundle.ts ---
  buildSessionTreatyExportBundle,
  type SessionTreatyExportBundle,
} from './session-treaty-export-bundle.ts';
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';

export interface SessionAccordExportBundle extends SessionTreatyExportBundle {
  accordReady: boolean;
  accordSchema: string;
}

/** Accord export wraps treaty export when accord bundle is ready. */
export function buildSessionAccordExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionAccordExportBundle {
  const base = buildSessionTreatyExportBundle(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const exports = accordReady ? base.exports : [];
  return {
    ...base,
    exports,
    accordReady,
    accordSchema: 'agent19.accord.v1',
    releaseReady: accordReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Accord export: ${accordReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionAccordExportShipped(bundle: SessionAccordExportBundle): boolean {
  return (
    bundle.accordReady &&
    bundle.exports.length > 0 &&
    bundle.accordSchema === 'agent19.accord.v1'
  );
}


// --- source: treaty-accord-bridge.ts ---
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from './match-explainability-treaty-bundle.ts';

export interface TreatyAccordBridgeReport {
  aligned: boolean;
  accordReady: boolean;
  treatyReady: boolean;
  narrativeLines: string[];
}

/** Accord-ready should match treaty-ready when treaty export stack passes. */
export function auditTreatyAccordBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): TreatyAccordBridgeReport {
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const treatyReady = matchExplainabilityTreatyReady(treaty);
  const aligned = accordReady === treatyReady;
  const narrativeLines = [
    `Treaty/accord bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (accord ${accordReady ? 'ok' : 'fail'}, treaty ${treatyReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, accordReady, treatyReady, narrativeLines };
}

export function treatyAccordBridgeHealthy(report: TreatyAccordBridgeReport): boolean {
  return report.accordReady && report.treatyReady && report.aligned;
}


// --- source: match-explainability-league-gate.ts ---
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from './session-accord-export-bundle.ts';

export interface MatchExplainabilityLeagueGateReport {
  leagueAllowed: boolean;
  accordReady: boolean;
  accordExportShipped: boolean;
  treatyAccordHealthy: boolean;
  narrativeLines: string[];
}

/** League gate: accord bundle + accord export + treaty/accord bridge. */
export function auditMatchExplainabilityLeagueGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityLeagueGateReport {
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordExport = buildSessionAccordExportBundle(packs, params);
  const bridge = auditTreatyAccordBridge(packs, params);
  const accordReady = matchExplainabilityAccordReady(accord);
  const accordExportShipped = sessionAccordExportShipped(accordExport);
  const treatyAccordHealthy = treatyAccordBridgeHealthy(bridge);
  const leagueAllowed = accordReady && accordExportShipped && treatyAccordHealthy;
  const narrativeLines = [
    `Match explainability league: ${leagueAllowed ? 'ALLOWED' : 'DENIED'} (accord ${accordReady ? 'ok' : 'fail'}, export ${accordExportShipped ? 'ok' : 'fail'}).`,
    ...accord.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    leagueAllowed,
    accordReady,
    accordExportShipped,
    treatyAccordHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityLeagueAllowed(report: MatchExplainabilityLeagueGateReport): boolean {
  return report.leagueAllowed;
}


// --- source: accord-recovery-orchestrator.ts ---
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from './match-explainability-accord-gate.ts';

export const AGENT19_ACCORD_RECOVERY_CAP = 10;

export interface AccordRecoveryOrchestratorReport {
  accordBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when accord gate blocks league rollout. */
export function buildAccordRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): AccordRecoveryOrchestratorReport {
  const accord = auditMatchExplainabilityAccordGate(packs, params);
  const accordBlocked = !matchExplainabilityAccordAllowed(accord);
  const steps: string[] = [];
  if (accordBlocked) {
    if (!accord.treatyReady) {
      steps.push('Restore treaty bundle: pact and treaty export must pass.');
    }
    if (!accord.treatyExportShipped) {
      steps.push('Emit session treaty export before accord clearance.');
    }
    if (!accord.pactTreatyHealthy) {
      steps.push('Reconcile pact/treaty bridge before accord.');
    }
    steps.push(...buildTreatyRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const treaty = buildMatchExplainabilityTreatyBundle(packs, params);
    if (!treaty.treatyReady) {
      steps.push('Re-run treaty readiness checklist on turn packs.');
    }
  } else {
    steps.push('Accord gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_ACCORD_RECOVERY_CAP);
  return {
    accordBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Accord recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function accordRecoveryOrchestratorWithinCap(report: AccordRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_ACCORD_RECOVERY_CAP;
}


// --- source: match-explainability-league-bundle.ts ---
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from './match-explainability-league-gate.ts';
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from './session-accord-export-bundle.ts';

export const AGENT19_LEAGUE_NARRATIVE_CAP = 10;

export interface MatchExplainabilityLeagueBundle {
  leagueReady: boolean;
  leagueAllowed: boolean;
  accordReady: boolean;
  accordExportShipped: boolean;
  narrativeLines: string[];
}

type LeagueParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** League bundle: league gate and accord export must both be green. */
export function buildMatchExplainabilityLeagueBundle(
  packs: TurnExplainabilityPack[],
  params: LeagueParams,
): MatchExplainabilityLeagueBundle {
  const league = auditMatchExplainabilityLeagueGate(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const accordExport = buildSessionAccordExportBundle(packs, params);
  const leagueAllowed = matchExplainabilityLeagueAllowed(league);
  const accordReady = matchExplainabilityAccordReady(accord);
  const accordExportShipped = sessionAccordExportShipped(accordExport);
  const leagueReady = leagueAllowed && accordReady && accordExportShipped;
  const narrativeLines = [
    `Match explainability league bundle: ${leagueReady ? 'READY' : 'PENDING'} (gate ${leagueAllowed ? 'ok' : 'fail'}, accord ${accordReady ? 'ok' : 'fail'}).`,
    ...league.narrativeLines.slice(0, 2),
    ...accord.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_LEAGUE_NARRATIVE_CAP);
  return {
    leagueReady,
    leagueAllowed,
    accordReady,
    accordExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityLeagueReady(bundle: MatchExplainabilityLeagueBundle): boolean {
  return bundle.leagueReady;
}


// --- source: session-league-export-bundle.ts ---
  buildSessionAccordExportBundle,
  type SessionAccordExportBundle,
} from './session-accord-export-bundle.ts';
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';

export interface SessionLeagueExportBundle extends SessionAccordExportBundle {
  leagueReady: boolean;
  leagueSchema: string;
}

/** League export wraps accord export when league bundle is ready. */
export function buildSessionLeagueExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionLeagueExportBundle {
  const base = buildSessionAccordExportBundle(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const exports = leagueReady ? base.exports : [];
  return {
    ...base,
    exports,
    leagueReady,
    leagueSchema: 'agent19.league.v1',
    releaseReady: leagueReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `League export: ${leagueReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionLeagueExportShipped(bundle: SessionLeagueExportBundle): boolean {
  return (
    bundle.leagueReady &&
    bundle.exports.length > 0 &&
    bundle.leagueSchema === 'agent19.league.v1'
  );
}


// --- source: accord-league-bridge.ts ---
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from './match-explainability-accord-bundle.ts';

export interface AccordLeagueBridgeReport {
  aligned: boolean;
  leagueReady: boolean;
  accordReady: boolean;
  narrativeLines: string[];
}

/** League-ready should match accord-ready when accord export stack passes. */
export function auditAccordLeagueBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): AccordLeagueBridgeReport {
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const accord = buildMatchExplainabilityAccordBundle(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const accordReady = matchExplainabilityAccordReady(accord);
  const aligned = leagueReady === accordReady;
  const narrativeLines = [
    `Accord/league bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (league ${leagueReady ? 'ok' : 'fail'}, accord ${accordReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, leagueReady, accordReady, narrativeLines };
}

export function accordLeagueBridgeHealthy(report: AccordLeagueBridgeReport): boolean {
  return report.leagueReady && report.accordReady && report.aligned;
}


// --- source: match-explainability-federation-gate.ts ---
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from './session-league-export-bundle.ts';

export interface MatchExplainabilityFederationGateReport {
  federationAllowed: boolean;
  leagueReady: boolean;
  leagueExportShipped: boolean;
  accordLeagueHealthy: boolean;
  narrativeLines: string[];
}

/** Federation gate: league bundle + league export + accord/league bridge. */
export function auditMatchExplainabilityFederationGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityFederationGateReport {
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueExport = buildSessionLeagueExportBundle(packs, params);
  const bridge = auditAccordLeagueBridge(packs, params);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const leagueExportShipped = sessionLeagueExportShipped(leagueExport);
  const accordLeagueHealthy = accordLeagueBridgeHealthy(bridge);
  const federationAllowed = leagueReady && leagueExportShipped && accordLeagueHealthy;
  const narrativeLines = [
    `Match explainability federation: ${federationAllowed ? 'ALLOWED' : 'DENIED'} (league ${leagueReady ? 'ok' : 'fail'}, export ${leagueExportShipped ? 'ok' : 'fail'}).`,
    ...league.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    federationAllowed,
    leagueReady,
    leagueExportShipped,
    accordLeagueHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityFederationAllowed(report: MatchExplainabilityFederationGateReport): boolean {
  return report.federationAllowed;
}


// --- source: league-recovery-orchestrator.ts ---
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from './match-explainability-league-gate.ts';

export const AGENT19_LEAGUE_RECOVERY_CAP = 10;

export interface LeagueRecoveryOrchestratorReport {
  leagueBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when league gate blocks federation rollout. */
export function buildLeagueRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): LeagueRecoveryOrchestratorReport {
  const league = auditMatchExplainabilityLeagueGate(packs, params);
  const leagueBlocked = !matchExplainabilityLeagueAllowed(league);
  const steps: string[] = [];
  if (leagueBlocked) {
    if (!league.accordReady) {
      steps.push('Restore accord bundle: treaty and accord export must pass.');
    }
    if (!league.accordExportShipped) {
      steps.push('Emit session accord export before league clearance.');
    }
    if (!league.treatyAccordHealthy) {
      steps.push('Reconcile treaty/accord bridge before league.');
    }
    steps.push(...buildAccordRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const accord = buildMatchExplainabilityAccordBundle(packs, params);
    if (!accord.accordReady) {
      steps.push('Re-run accord readiness checklist on turn packs.');
    }
  } else {
    steps.push('League gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_LEAGUE_RECOVERY_CAP);
  return {
    leagueBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`League recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function leagueRecoveryOrchestratorWithinCap(report: LeagueRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_LEAGUE_RECOVERY_CAP;
}


// --- source: match-explainability-federation-bundle.ts ---
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from './match-explainability-federation-gate.ts';
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from './session-league-export-bundle.ts';

export const AGENT19_FEDERATION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityFederationBundle {
  federationReady: boolean;
  federationAllowed: boolean;
  leagueReady: boolean;
  leagueExportShipped: boolean;
  narrativeLines: string[];
}

type FederationParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Federation bundle: federation gate and league export must both be green. */
export function buildMatchExplainabilityFederationBundle(
  packs: TurnExplainabilityPack[],
  params: FederationParams,
): MatchExplainabilityFederationBundle {
  const federation = auditMatchExplainabilityFederationGate(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const leagueExport = buildSessionLeagueExportBundle(packs, params);
  const federationAllowed = matchExplainabilityFederationAllowed(federation);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const leagueExportShipped = sessionLeagueExportShipped(leagueExport);
  const federationReady = federationAllowed && leagueReady && leagueExportShipped;
  const narrativeLines = [
    `Match explainability federation bundle: ${federationReady ? 'READY' : 'PENDING'} (gate ${federationAllowed ? 'ok' : 'fail'}, league ${leagueReady ? 'ok' : 'fail'}).`,
    ...federation.narrativeLines.slice(0, 2),
    ...league.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_FEDERATION_NARRATIVE_CAP);
  return {
    federationReady,
    federationAllowed,
    leagueReady,
    leagueExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityFederationReady(bundle: MatchExplainabilityFederationBundle): boolean {
  return bundle.federationReady;
}


// --- source: session-federation-export-bundle.ts ---
  buildSessionLeagueExportBundle,
  type SessionLeagueExportBundle,
} from './session-league-export-bundle.ts';
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';

export interface SessionFederationExportBundle extends SessionLeagueExportBundle {
  federationReady: boolean;
  federationSchema: string;
}

/** Federation export wraps league export when federation bundle is ready. */
export function buildSessionFederationExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionFederationExportBundle {
  const base = buildSessionLeagueExportBundle(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const exports = federationReady ? base.exports : [];
  return {
    ...base,
    exports,
    federationReady,
    federationSchema: 'agent19.federation.v1',
    releaseReady: federationReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Federation export: ${federationReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionFederationExportShipped(bundle: SessionFederationExportBundle): boolean {
  return (
    bundle.federationReady &&
    bundle.exports.length > 0 &&
    bundle.federationSchema === 'agent19.federation.v1'
  );
}


// --- source: league-federation-bridge.ts ---
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from './match-explainability-league-bundle.ts';

export interface LeagueFederationBridgeReport {
  aligned: boolean;
  federationReady: boolean;
  leagueReady: boolean;
  narrativeLines: string[];
}

/** Federation-ready should match league-ready when league export stack passes. */
export function auditLeagueFederationBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): LeagueFederationBridgeReport {
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const league = buildMatchExplainabilityLeagueBundle(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const leagueReady = matchExplainabilityLeagueReady(league);
  const aligned = federationReady === leagueReady;
  const narrativeLines = [
    `League/federation bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (federation ${federationReady ? 'ok' : 'fail'}, league ${leagueReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, federationReady, leagueReady, narrativeLines };
}

export function leagueFederationBridgeHealthy(report: LeagueFederationBridgeReport): boolean {
  return report.federationReady && report.leagueReady && report.aligned;
}


// --- source: match-explainability-union-gate.ts ---
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from './session-federation-export-bundle.ts';

export interface MatchExplainabilityUnionGateReport {
  unionAllowed: boolean;
  federationReady: boolean;
  federationExportShipped: boolean;
  leagueFederationHealthy: boolean;
  narrativeLines: string[];
}

/** Union gate: federation bundle + federation export + league/federation bridge. */
export function auditMatchExplainabilityUnionGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityUnionGateReport {
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationExport = buildSessionFederationExportBundle(packs, params);
  const bridge = auditLeagueFederationBridge(packs, params);
  const federationReady = matchExplainabilityFederationReady(federation);
  const federationExportShipped = sessionFederationExportShipped(federationExport);
  const leagueFederationHealthy = leagueFederationBridgeHealthy(bridge);
  const unionAllowed = federationReady && federationExportShipped && leagueFederationHealthy;
  const narrativeLines = [
    `Match explainability union: ${unionAllowed ? 'ALLOWED' : 'DENIED'} (federation ${federationReady ? 'ok' : 'fail'}, export ${federationExportShipped ? 'ok' : 'fail'}).`,
    ...federation.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    unionAllowed,
    federationReady,
    federationExportShipped,
    leagueFederationHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityUnionAllowed(report: MatchExplainabilityUnionGateReport): boolean {
  return report.unionAllowed;
}


// --- source: federation-recovery-orchestrator.ts ---
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from './match-explainability-federation-gate.ts';

export const AGENT19_FEDERATION_RECOVERY_CAP = 10;

export interface FederationRecoveryOrchestratorReport {
  federationBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when federation gate blocks union rollout. */
export function buildFederationRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): FederationRecoveryOrchestratorReport {
  const federation = auditMatchExplainabilityFederationGate(packs, params);
  const federationBlocked = !matchExplainabilityFederationAllowed(federation);
  const steps: string[] = [];
  if (federationBlocked) {
    if (!federation.leagueReady) {
      steps.push('Restore league bundle: accord and league export must pass.');
    }
    if (!federation.leagueExportShipped) {
      steps.push('Emit session league export before federation clearance.');
    }
    if (!federation.accordLeagueHealthy) {
      steps.push('Reconcile accord/league bridge before federation.');
    }
    steps.push(...buildLeagueRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const league = buildMatchExplainabilityLeagueBundle(packs, params);
    if (!league.leagueReady) {
      steps.push('Re-run league readiness checklist on turn packs.');
    }
  } else {
    steps.push('Federation gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_FEDERATION_RECOVERY_CAP);
  return {
    federationBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Federation recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function federationRecoveryOrchestratorWithinCap(report: FederationRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_FEDERATION_RECOVERY_CAP;
}


// --- source: match-explainability-union-bundle.ts ---
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from './match-explainability-union-gate.ts';
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from './session-federation-export-bundle.ts';

export const AGENT19_UNION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityUnionBundle {
  unionReady: boolean;
  unionAllowed: boolean;
  federationReady: boolean;
  federationExportShipped: boolean;
  narrativeLines: string[];
}

type UnionParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Union bundle: union gate and federation export must both be green. */
export function buildMatchExplainabilityUnionBundle(
  packs: TurnExplainabilityPack[],
  params: UnionParams,
): MatchExplainabilityUnionBundle {
  const union = auditMatchExplainabilityUnionGate(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const federationExport = buildSessionFederationExportBundle(packs, params);
  const unionAllowed = matchExplainabilityUnionAllowed(union);
  const federationReady = matchExplainabilityFederationReady(federation);
  const federationExportShipped = sessionFederationExportShipped(federationExport);
  const unionReady = unionAllowed && federationReady && federationExportShipped;
  const narrativeLines = [
    `Match explainability union bundle: ${unionReady ? 'READY' : 'PENDING'} (gate ${unionAllowed ? 'ok' : 'fail'}, federation ${federationReady ? 'ok' : 'fail'}).`,
    ...union.narrativeLines.slice(0, 2),
    ...federation.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_UNION_NARRATIVE_CAP);
  return {
    unionReady,
    unionAllowed,
    federationReady,
    federationExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityUnionReady(bundle: MatchExplainabilityUnionBundle): boolean {
  return bundle.unionReady;
}


// --- source: session-union-export-bundle.ts ---
  buildSessionFederationExportBundle,
  type SessionFederationExportBundle,
} from './session-federation-export-bundle.ts';
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';

export interface SessionUnionExportBundle extends SessionFederationExportBundle {
  unionReady: boolean;
  unionSchema: string;
}

/** Union export wraps federation export when union bundle is ready. */
export function buildSessionUnionExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionUnionExportBundle {
  const base = buildSessionFederationExportBundle(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const exports = unionReady ? base.exports : [];
  return {
    ...base,
    exports,
    unionReady,
    unionSchema: 'agent19.union.v1',
    releaseReady: unionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Union export: ${unionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionUnionExportShipped(bundle: SessionUnionExportBundle): boolean {
  return (
    bundle.unionReady &&
    bundle.exports.length > 0 &&
    bundle.unionSchema === 'agent19.union.v1'
  );
}


// --- source: federation-union-bridge.ts ---
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from './match-explainability-federation-bundle.ts';

export interface FederationUnionBridgeReport {
  aligned: boolean;
  unionReady: boolean;
  federationReady: boolean;
  narrativeLines: string[];
}

/** Union-ready should match federation-ready when federation export stack passes. */
export function auditFederationUnionBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): FederationUnionBridgeReport {
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const federation = buildMatchExplainabilityFederationBundle(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const federationReady = matchExplainabilityFederationReady(federation);
  const aligned = unionReady === federationReady;
  const narrativeLines = [
    `Federation/union bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (union ${unionReady ? 'ok' : 'fail'}, federation ${federationReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, unionReady, federationReady, narrativeLines };
}

export function federationUnionBridgeHealthy(report: FederationUnionBridgeReport): boolean {
  return report.unionReady && report.federationReady && report.aligned;
}


// --- source: match-explainability-commonwealth-gate.ts ---
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from './session-union-export-bundle.ts';

export interface MatchExplainabilityCommonwealthGateReport {
  commonwealthAllowed: boolean;
  unionReady: boolean;
  unionExportShipped: boolean;
  federationUnionHealthy: boolean;
  narrativeLines: string[];
}

/** Commonwealth gate: union bundle + union export + federation/union bridge. */
export function auditMatchExplainabilityCommonwealthGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityCommonwealthGateReport {
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionExport = buildSessionUnionExportBundle(packs, params);
  const bridge = auditFederationUnionBridge(packs, params);
  const unionReady = matchExplainabilityUnionReady(union);
  const unionExportShipped = sessionUnionExportShipped(unionExport);
  const federationUnionHealthy = federationUnionBridgeHealthy(bridge);
  const commonwealthAllowed = unionReady && unionExportShipped && federationUnionHealthy;
  const narrativeLines = [
    `Match explainability commonwealth: ${commonwealthAllowed ? 'ALLOWED' : 'DENIED'} (union ${unionReady ? 'ok' : 'fail'}, export ${unionExportShipped ? 'ok' : 'fail'}).`,
    ...union.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    commonwealthAllowed,
    unionReady,
    unionExportShipped,
    federationUnionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityCommonwealthAllowed(report: MatchExplainabilityCommonwealthGateReport): boolean {
  return report.commonwealthAllowed;
}


// --- source: union-recovery-orchestrator.ts ---
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from './match-explainability-union-gate.ts';

export const AGENT19_UNION_RECOVERY_CAP = 10;

export interface UnionRecoveryOrchestratorReport {
  unionBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when union gate blocks commonwealth rollout. */
export function buildUnionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): UnionRecoveryOrchestratorReport {
  const union = auditMatchExplainabilityUnionGate(packs, params);
  const unionBlocked = !matchExplainabilityUnionAllowed(union);
  const steps: string[] = [];
  if (unionBlocked) {
    if (!union.federationReady) {
      steps.push('Restore federation bundle: league and federation export must pass.');
    }
    if (!union.federationExportShipped) {
      steps.push('Emit session federation export before union clearance.');
    }
    if (!union.leagueFederationHealthy) {
      steps.push('Reconcile league/federation bridge before union.');
    }
    steps.push(...buildFederationRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const federation = buildMatchExplainabilityFederationBundle(packs, params);
    if (!federation.federationReady) {
      steps.push('Re-run federation readiness checklist on turn packs.');
    }
  } else {
    steps.push('Union gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_UNION_RECOVERY_CAP);
  return {
    unionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Union recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function unionRecoveryOrchestratorWithinCap(report: UnionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_UNION_RECOVERY_CAP;
}


// --- source: match-explainability-commonwealth-bundle.ts ---
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from './match-explainability-commonwealth-gate.ts';
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from './session-union-export-bundle.ts';

export const AGENT19_COMMONWEALTH_NARRATIVE_CAP = 10;

export interface MatchExplainabilityCommonwealthBundle {
  commonwealthReady: boolean;
  commonwealthAllowed: boolean;
  unionReady: boolean;
  unionExportShipped: boolean;
  narrativeLines: string[];
}

type CommonwealthParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Commonwealth bundle: commonwealth gate and union export must both be green. */
export function buildMatchExplainabilityCommonwealthBundle(
  packs: TurnExplainabilityPack[],
  params: CommonwealthParams,
): MatchExplainabilityCommonwealthBundle {
  const commonwealth = auditMatchExplainabilityCommonwealthGate(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const unionExport = buildSessionUnionExportBundle(packs, params);
  const commonwealthAllowed = matchExplainabilityCommonwealthAllowed(commonwealth);
  const unionReady = matchExplainabilityUnionReady(union);
  const unionExportShipped = sessionUnionExportShipped(unionExport);
  const commonwealthReady = commonwealthAllowed && unionReady && unionExportShipped;
  const narrativeLines = [
    `Match explainability commonwealth bundle: ${commonwealthReady ? 'READY' : 'PENDING'} (gate ${commonwealthAllowed ? 'ok' : 'fail'}, union ${unionReady ? 'ok' : 'fail'}).`,
    ...commonwealth.narrativeLines.slice(0, 2),
    ...union.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_COMMONWEALTH_NARRATIVE_CAP);
  return {
    commonwealthReady,
    commonwealthAllowed,
    unionReady,
    unionExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityCommonwealthReady(bundle: MatchExplainabilityCommonwealthBundle): boolean {
  return bundle.commonwealthReady;
}


// --- source: session-commonwealth-export-bundle.ts ---
  buildSessionUnionExportBundle,
  type SessionUnionExportBundle,
} from './session-union-export-bundle.ts';
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';

export interface SessionCommonwealthExportBundle extends SessionUnionExportBundle {
  commonwealthReady: boolean;
  commonwealthSchema: string;
}

/** Commonwealth export wraps union export when commonwealth bundle is ready. */
export function buildSessionCommonwealthExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionCommonwealthExportBundle {
  const base = buildSessionUnionExportBundle(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const exports = commonwealthReady ? base.exports : [];
  return {
    ...base,
    exports,
    commonwealthReady,
    commonwealthSchema: 'agent19.commonwealth.v1',
    releaseReady: commonwealthReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Commonwealth export: ${commonwealthReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionCommonwealthExportShipped(bundle: SessionCommonwealthExportBundle): boolean {
  return (
    bundle.commonwealthReady &&
    bundle.exports.length > 0 &&
    bundle.commonwealthSchema === 'agent19.commonwealth.v1'
  );
}


// --- source: union-commonwealth-bridge.ts ---
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from './match-explainability-union-bundle.ts';

export interface UnionCommonwealthBridgeReport {
  aligned: boolean;
  commonwealthReady: boolean;
  unionReady: boolean;
  narrativeLines: string[];
}

/** Commonwealth-ready should match union-ready when union export stack passes. */
export function auditUnionCommonwealthBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): UnionCommonwealthBridgeReport {
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const union = buildMatchExplainabilityUnionBundle(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const unionReady = matchExplainabilityUnionReady(union);
  const aligned = commonwealthReady === unionReady;
  const narrativeLines = [
    `Union/commonwealth bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (commonwealth ${commonwealthReady ? 'ok' : 'fail'}, union ${unionReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, commonwealthReady, unionReady, narrativeLines };
}

export function unionCommonwealthBridgeHealthy(report: UnionCommonwealthBridgeReport): boolean {
  return report.commonwealthReady && report.unionReady && report.aligned;
}


// --- source: match-explainability-realm-gate.ts ---
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from './session-commonwealth-export-bundle.ts';

export interface MatchExplainabilityRealmGateReport {
  realmAllowed: boolean;
  commonwealthReady: boolean;
  commonwealthExportShipped: boolean;
  unionCommonwealthHealthy: boolean;
  narrativeLines: string[];
}

/** Realm gate: commonwealth bundle + commonwealth export + union/commonwealth bridge. */
export function auditMatchExplainabilityRealmGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityRealmGateReport {
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthExport = buildSessionCommonwealthExportBundle(packs, params);
  const bridge = auditUnionCommonwealthBridge(packs, params);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const commonwealthExportShipped = sessionCommonwealthExportShipped(commonwealthExport);
  const unionCommonwealthHealthy = unionCommonwealthBridgeHealthy(bridge);
  const realmAllowed = commonwealthReady && commonwealthExportShipped && unionCommonwealthHealthy;
  const narrativeLines = [
    `Match explainability realm: ${realmAllowed ? 'ALLOWED' : 'DENIED'} (commonwealth ${commonwealthReady ? 'ok' : 'fail'}, export ${commonwealthExportShipped ? 'ok' : 'fail'}).`,
    ...commonwealth.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    realmAllowed,
    commonwealthReady,
    commonwealthExportShipped,
    unionCommonwealthHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityRealmAllowed(report: MatchExplainabilityRealmGateReport): boolean {
  return report.realmAllowed;
}


// --- source: commonwealth-recovery-orchestrator.ts ---
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from './match-explainability-commonwealth-gate.ts';

export const AGENT19_COMMONWEALTH_RECOVERY_CAP = 10;

export interface CommonwealthRecoveryOrchestratorReport {
  commonwealthBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when commonwealth gate blocks realm rollout. */
export function buildCommonwealthRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): CommonwealthRecoveryOrchestratorReport {
  const commonwealth = auditMatchExplainabilityCommonwealthGate(packs, params);
  const commonwealthBlocked = !matchExplainabilityCommonwealthAllowed(commonwealth);
  const steps: string[] = [];
  if (commonwealthBlocked) {
    if (!commonwealth.unionReady) {
      steps.push('Restore union bundle: federation and union export must pass.');
    }
    if (!commonwealth.unionExportShipped) {
      steps.push('Emit session union export before commonwealth clearance.');
    }
    if (!commonwealth.federationUnionHealthy) {
      steps.push('Reconcile federation/union bridge before commonwealth.');
    }
    steps.push(...buildUnionRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const union = buildMatchExplainabilityUnionBundle(packs, params);
    if (!union.unionReady) {
      steps.push('Re-run union readiness checklist on turn packs.');
    }
  } else {
    steps.push('Commonwealth gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_COMMONWEALTH_RECOVERY_CAP);
  return {
    commonwealthBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Commonwealth recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function commonwealthRecoveryOrchestratorWithinCap(report: CommonwealthRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_COMMONWEALTH_RECOVERY_CAP;
}


// --- source: match-explainability-realm-bundle.ts ---
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from './match-explainability-realm-gate.ts';
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from './session-commonwealth-export-bundle.ts';

export const AGENT19_REALM_NARRATIVE_CAP = 10;

export interface MatchExplainabilityRealmBundle {
  realmReady: boolean;
  realmAllowed: boolean;
  commonwealthReady: boolean;
  commonwealthExportShipped: boolean;
  narrativeLines: string[];
}

type RealmParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Realm bundle: realm gate and commonwealth export must both be green. */
export function buildMatchExplainabilityRealmBundle(
  packs: TurnExplainabilityPack[],
  params: RealmParams,
): MatchExplainabilityRealmBundle {
  const realm = auditMatchExplainabilityRealmGate(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const commonwealthExport = buildSessionCommonwealthExportBundle(packs, params);
  const realmAllowed = matchExplainabilityRealmAllowed(realm);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const commonwealthExportShipped = sessionCommonwealthExportShipped(commonwealthExport);
  const realmReady = realmAllowed && commonwealthReady && commonwealthExportShipped;
  const narrativeLines = [
    `Match explainability realm bundle: ${realmReady ? 'READY' : 'PENDING'} (gate ${realmAllowed ? 'ok' : 'fail'}, commonwealth ${commonwealthReady ? 'ok' : 'fail'}).`,
    ...realm.narrativeLines.slice(0, 2),
    ...commonwealth.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_REALM_NARRATIVE_CAP);
  return {
    realmReady,
    realmAllowed,
    commonwealthReady,
    commonwealthExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityRealmReady(bundle: MatchExplainabilityRealmBundle): boolean {
  return bundle.realmReady;
}


// --- source: session-realm-export-bundle.ts ---
  buildSessionCommonwealthExportBundle,
  type SessionCommonwealthExportBundle,
} from './session-commonwealth-export-bundle.ts';
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';

export interface SessionRealmExportBundle extends SessionCommonwealthExportBundle {
  realmReady: boolean;
  realmSchema: string;
}

/** Realm export wraps commonwealth export when realm bundle is ready. */
export function buildSessionRealmExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionRealmExportBundle {
  const base = buildSessionCommonwealthExportBundle(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const exports = realmReady ? base.exports : [];
  return {
    ...base,
    exports,
    realmReady,
    realmSchema: 'agent19.realm.v1',
    releaseReady: realmReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Realm export: ${realmReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionRealmExportShipped(bundle: SessionRealmExportBundle): boolean {
  return (
    bundle.realmReady &&
    bundle.exports.length > 0 &&
    bundle.realmSchema === 'agent19.realm.v1'
  );
}


// --- source: commonwealth-realm-bridge.ts ---
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from './match-explainability-commonwealth-bundle.ts';

export interface CommonwealthRealmBridgeReport {
  aligned: boolean;
  realmReady: boolean;
  commonwealthReady: boolean;
  narrativeLines: string[];
}

/** Realm-ready should match commonwealth-ready when commonwealth export stack passes. */
export function auditCommonwealthRealmBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): CommonwealthRealmBridgeReport {
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const commonwealthReady = matchExplainabilityCommonwealthReady(commonwealth);
  const aligned = realmReady === commonwealthReady;
  const narrativeLines = [
    `Commonwealth/realm bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (realm ${realmReady ? 'ok' : 'fail'}, commonwealth ${commonwealthReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, realmReady, commonwealthReady, narrativeLines };
}

export function commonwealthRealmBridgeHealthy(report: CommonwealthRealmBridgeReport): boolean {
  return report.realmReady && report.commonwealthReady && report.aligned;
}


// --- source: match-explainability-sovereign-gate.ts ---
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from './session-realm-export-bundle.ts';

export interface MatchExplainabilitySovereignGateReport {
  sovereignAllowed: boolean;
  realmReady: boolean;
  realmExportShipped: boolean;
  commonwealthRealmHealthy: boolean;
  narrativeLines: string[];
}

/** Sovereign gate: realm bundle + realm export + commonwealth/realm bridge. */
export function auditMatchExplainabilitySovereignGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilitySovereignGateReport {
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmExport = buildSessionRealmExportBundle(packs, params);
  const bridge = auditCommonwealthRealmBridge(packs, params);
  const realmReady = matchExplainabilityRealmReady(realm);
  const realmExportShipped = sessionRealmExportShipped(realmExport);
  const commonwealthRealmHealthy = commonwealthRealmBridgeHealthy(bridge);
  const sovereignAllowed = realmReady && realmExportShipped && commonwealthRealmHealthy;
  const narrativeLines = [
    `Match explainability sovereign: ${sovereignAllowed ? 'ALLOWED' : 'DENIED'} (realm ${realmReady ? 'ok' : 'fail'}, export ${realmExportShipped ? 'ok' : 'fail'}).`,
    ...realm.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    sovereignAllowed,
    realmReady,
    realmExportShipped,
    commonwealthRealmHealthy,
    narrativeLines,
  };
}

export function matchExplainabilitySovereignAllowed(report: MatchExplainabilitySovereignGateReport): boolean {
  return report.sovereignAllowed;
}


// --- source: realm-recovery-orchestrator.ts ---
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from './match-explainability-realm-gate.ts';

export const AGENT19_REALM_RECOVERY_CAP = 10;

export interface RealmRecoveryOrchestratorReport {
  realmBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when realm gate blocks sovereign rollout. */
export function buildRealmRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): RealmRecoveryOrchestratorReport {
  const realm = auditMatchExplainabilityRealmGate(packs, params);
  const realmBlocked = !matchExplainabilityRealmAllowed(realm);
  const steps: string[] = [];
  if (realmBlocked) {
    if (!realm.commonwealthReady) {
      steps.push('Restore commonwealth bundle: union and commonwealth export must pass.');
    }
    if (!realm.commonwealthExportShipped) {
      steps.push('Emit session commonwealth export before realm clearance.');
    }
    if (!realm.unionCommonwealthHealthy) {
      steps.push('Reconcile union/commonwealth bridge before realm.');
    }
    steps.push(...buildCommonwealthRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const commonwealth = buildMatchExplainabilityCommonwealthBundle(packs, params);
    if (!commonwealth.commonwealthReady) {
      steps.push('Re-run commonwealth readiness checklist on turn packs.');
    }
  } else {
    steps.push('Realm gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_REALM_RECOVERY_CAP);
  return {
    realmBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Realm recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function realmRecoveryOrchestratorWithinCap(report: RealmRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_REALM_RECOVERY_CAP;
}


// --- source: match-explainability-sovereign-bundle.ts ---
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from './match-explainability-sovereign-gate.ts';
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from './session-realm-export-bundle.ts';

export const AGENT19_SOVEREIGN_NARRATIVE_CAP = 10;

export interface MatchExplainabilitySovereignBundle {
  sovereignReady: boolean;
  sovereignAllowed: boolean;
  realmReady: boolean;
  realmExportShipped: boolean;
  narrativeLines: string[];
}

type SovereignParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Sovereign bundle: sovereign gate and realm export must both be green. */
export function buildMatchExplainabilitySovereignBundle(
  packs: TurnExplainabilityPack[],
  params: SovereignParams,
): MatchExplainabilitySovereignBundle {
  const sovereign = auditMatchExplainabilitySovereignGate(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const realmExport = buildSessionRealmExportBundle(packs, params);
  const sovereignAllowed = matchExplainabilitySovereignAllowed(sovereign);
  const realmReady = matchExplainabilityRealmReady(realm);
  const realmExportShipped = sessionRealmExportShipped(realmExport);
  const sovereignReady = sovereignAllowed && realmReady && realmExportShipped;
  const narrativeLines = [
    `Match explainability sovereign bundle: ${sovereignReady ? 'READY' : 'PENDING'} (gate ${sovereignAllowed ? 'ok' : 'fail'}, realm ${realmReady ? 'ok' : 'fail'}).`,
    ...sovereign.narrativeLines.slice(0, 2),
    ...realm.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_SOVEREIGN_NARRATIVE_CAP);
  return {
    sovereignReady,
    sovereignAllowed,
    realmReady,
    realmExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilitySovereignReady(bundle: MatchExplainabilitySovereignBundle): boolean {
  return bundle.sovereignReady;
}


// --- source: session-sovereign-export-bundle.ts ---
  buildSessionRealmExportBundle,
  type SessionRealmExportBundle,
} from './session-realm-export-bundle.ts';
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';

export interface SessionSovereignExportBundle extends SessionRealmExportBundle {
  sovereignReady: boolean;
  sovereignSchema: string;
}

/** Sovereign export wraps realm export when sovereign bundle is ready. */
export function buildSessionSovereignExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionSovereignExportBundle {
  const base = buildSessionRealmExportBundle(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const exports = sovereignReady ? base.exports : [];
  return {
    ...base,
    exports,
    sovereignReady,
    sovereignSchema: 'agent19.sovereign.v1',
    releaseReady: sovereignReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Sovereign export: ${sovereignReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionSovereignExportShipped(bundle: SessionSovereignExportBundle): boolean {
  return (
    bundle.sovereignReady &&
    bundle.exports.length > 0 &&
    bundle.sovereignSchema === 'agent19.sovereign.v1'
  );
}


// --- source: realm-sovereign-bridge.ts ---
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from './match-explainability-realm-bundle.ts';

export interface RealmSovereignBridgeReport {
  aligned: boolean;
  sovereignReady: boolean;
  realmReady: boolean;
  narrativeLines: string[];
}

/** Sovereign-ready should match realm-ready when realm export stack passes. */
export function auditRealmSovereignBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): RealmSovereignBridgeReport {
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const realm = buildMatchExplainabilityRealmBundle(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const realmReady = matchExplainabilityRealmReady(realm);
  const aligned = sovereignReady === realmReady;
  const narrativeLines = [
    `Realm/sovereign bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (sovereign ${sovereignReady ? 'ok' : 'fail'}, realm ${realmReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, sovereignReady, realmReady, narrativeLines };
}

export function realmSovereignBridgeHealthy(report: RealmSovereignBridgeReport): boolean {
  return report.sovereignReady && report.realmReady && report.aligned;
}


// --- source: match-explainability-imperial-gate.ts ---
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
  buildSessionSovereignExportBundle,
  sessionSovereignExportShipped,
} from './session-sovereign-export-bundle.ts';

export interface MatchExplainabilityImperialGateReport {
  imperialAllowed: boolean;
  sovereignReady: boolean;
  sovereignExportShipped: boolean;
  realmSovereignHealthy: boolean;
  narrativeLines: string[];
}

/** Imperial gate: sovereign bundle + sovereign export + realm/sovereign bridge. */
export function auditMatchExplainabilityImperialGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityImperialGateReport {
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignExport = buildSessionSovereignExportBundle(packs, params);
  const bridge = auditRealmSovereignBridge(packs, params);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const sovereignExportShipped = sessionSovereignExportShipped(sovereignExport);
  const realmSovereignHealthy = realmSovereignBridgeHealthy(bridge);
  const imperialAllowed = sovereignReady && sovereignExportShipped && realmSovereignHealthy;
  const narrativeLines = [
    `Match explainability imperial: ${imperialAllowed ? 'ALLOWED' : 'DENIED'} (sovereign ${sovereignReady ? 'ok' : 'fail'}, export ${sovereignExportShipped ? 'ok' : 'fail'}).`,
    ...sovereign.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    imperialAllowed,
    sovereignReady,
    sovereignExportShipped,
    realmSovereignHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityImperialAllowed(report: MatchExplainabilityImperialGateReport): boolean {
  return report.imperialAllowed;
}


// --- source: sovereign-recovery-orchestrator.ts ---
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from './match-explainability-sovereign-gate.ts';

export const AGENT19_SOVEREIGN_RECOVERY_CAP = 10;

export interface SovereignRecoveryOrchestratorReport {
  sovereignBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when sovereign gate blocks imperial rollout. */
export function buildSovereignRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): SovereignRecoveryOrchestratorReport {
  const sovereign = auditMatchExplainabilitySovereignGate(packs, params);
  const sovereignBlocked = !matchExplainabilitySovereignAllowed(sovereign);
  const steps: string[] = [];
  if (sovereignBlocked) {
    if (!sovereign.realmReady) {
      steps.push('Restore realm bundle: commonwealth and realm export must pass.');
    }
    if (!sovereign.realmExportShipped) {
      steps.push('Emit session realm export before sovereign clearance.');
    }
    if (!sovereign.commonwealthRealmHealthy) {
      steps.push('Reconcile commonwealth/realm bridge before sovereign.');
    }
    steps.push(...buildRealmRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const realm = buildMatchExplainabilityRealmBundle(packs, params);
    if (!realm.realmReady) {
      steps.push('Re-run realm readiness checklist on turn packs.');
    }
  } else {
    steps.push('Sovereign gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_SOVEREIGN_RECOVERY_CAP);
  return {
    sovereignBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Sovereign recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function sovereignRecoveryOrchestratorWithinCap(report: SovereignRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_SOVEREIGN_RECOVERY_CAP;
}


// --- source: match-explainability-imperial-bundle.ts ---
  auditMatchExplainabilityImperialGate,
  matchExplainabilityImperialAllowed,
} from './match-explainability-imperial-gate.ts';
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';
  buildSessionSovereignExportBundle,
  sessionSovereignExportShipped,
} from './session-sovereign-export-bundle.ts';

export const AGENT19_IMPERIAL_NARRATIVE_CAP = 10;

export interface MatchExplainabilityImperialBundle {
  imperialReady: boolean;
  imperialAllowed: boolean;
  sovereignReady: boolean;
  sovereignExportShipped: boolean;
  narrativeLines: string[];
}

type ImperialParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Imperial bundle: imperial gate and sovereign export must both be green. */
export function buildMatchExplainabilityImperialBundle(
  packs: TurnExplainabilityPack[],
  params: ImperialParams,
): MatchExplainabilityImperialBundle {
  const imperial = auditMatchExplainabilityImperialGate(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const sovereignExport = buildSessionSovereignExportBundle(packs, params);
  const imperialAllowed = matchExplainabilityImperialAllowed(imperial);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const sovereignExportShipped = sessionSovereignExportShipped(sovereignExport);
  const imperialReady = imperialAllowed && sovereignReady && sovereignExportShipped;
  const narrativeLines = [
    `Match explainability imperial bundle: ${imperialReady ? 'READY' : 'PENDING'} (gate ${imperialAllowed ? 'ok' : 'fail'}, sovereign ${sovereignReady ? 'ok' : 'fail'}).`,
    ...imperial.narrativeLines.slice(0, 2),
    ...sovereign.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_IMPERIAL_NARRATIVE_CAP);
  return {
    imperialReady,
    imperialAllowed,
    sovereignReady,
    sovereignExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityImperialReady(bundle: MatchExplainabilityImperialBundle): boolean {
  return bundle.imperialReady;
}


// --- source: session-imperial-export-bundle.ts ---
  buildSessionSovereignExportBundle,
  type SessionSovereignExportBundle,
} from './session-sovereign-export-bundle.ts';
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';

export interface SessionImperialExportBundle extends SessionSovereignExportBundle {
  imperialReady: boolean;
  imperialSchema: string;
}

/** Imperial export wraps sovereign export when imperial bundle is ready. */
export function buildSessionImperialExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionImperialExportBundle {
  const base = buildSessionSovereignExportBundle(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const exports = imperialReady ? base.exports : [];
  return {
    ...base,
    exports,
    imperialReady,
    imperialSchema: 'agent19.imperial.v1',
    releaseReady: imperialReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Imperial export: ${imperialReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionImperialExportShipped(bundle: SessionImperialExportBundle): boolean {
  return (
    bundle.imperialReady &&
    bundle.exports.length > 0 &&
    bundle.imperialSchema === 'agent19.imperial.v1'
  );
}


// --- source: sovereign-imperial-bridge.ts ---
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from './match-explainability-sovereign-bundle.ts';

export interface SovereignImperialBridgeReport {
  aligned: boolean;
  imperialReady: boolean;
  sovereignReady: boolean;
  narrativeLines: string[];
}

/** Imperial-ready should match sovereign-ready when sovereign export stack passes. */
export function auditSovereignImperialBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SovereignImperialBridgeReport {
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const sovereignReady = matchExplainabilitySovereignReady(sovereign);
  const aligned = imperialReady === sovereignReady;
  const narrativeLines = [
    `Sovereign/imperial bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (imperial ${imperialReady ? 'ok' : 'fail'}, sovereign ${sovereignReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, imperialReady, sovereignReady, narrativeLines };
}

export function sovereignImperialBridgeHealthy(report: SovereignImperialBridgeReport): boolean {
  return report.imperialReady && report.sovereignReady && report.aligned;
}


// --- source: match-explainability-dominion-gate.ts ---
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
  buildSessionImperialExportBundle,
  sessionImperialExportShipped,
} from './session-imperial-export-bundle.ts';

export interface MatchExplainabilityDominionGateReport {
  dominionAllowed: boolean;
  imperialReady: boolean;
  imperialExportShipped: boolean;
  sovereignImperialHealthy: boolean;
  narrativeLines: string[];
}

/** Dominion gate: imperial bundle + imperial export + sovereign/imperial bridge. */
export function auditMatchExplainabilityDominionGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityDominionGateReport {
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialExport = buildSessionImperialExportBundle(packs, params);
  const bridge = auditSovereignImperialBridge(packs, params);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const imperialExportShipped = sessionImperialExportShipped(imperialExport);
  const sovereignImperialHealthy = sovereignImperialBridgeHealthy(bridge);
  const dominionAllowed = imperialReady && imperialExportShipped && sovereignImperialHealthy;
  const narrativeLines = [
    `Match explainability dominion: ${dominionAllowed ? 'ALLOWED' : 'DENIED'} (imperial ${imperialReady ? 'ok' : 'fail'}, export ${imperialExportShipped ? 'ok' : 'fail'}).`,
    ...imperial.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    dominionAllowed,
    imperialReady,
    imperialExportShipped,
    sovereignImperialHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityDominionAllowed(report: MatchExplainabilityDominionGateReport): boolean {
  return report.dominionAllowed;
}


// --- source: imperial-recovery-orchestrator.ts ---
  auditMatchExplainabilityImperialGate,
  matchExplainabilityImperialAllowed,
} from './match-explainability-imperial-gate.ts';

export const AGENT19_IMPERIAL_RECOVERY_CAP = 10;

export interface ImperialRecoveryOrchestratorReport {
  imperialBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when imperial gate blocks dominion rollout. */
export function buildImperialRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): ImperialRecoveryOrchestratorReport {
  const imperial = auditMatchExplainabilityImperialGate(packs, params);
  const imperialBlocked = !matchExplainabilityImperialAllowed(imperial);
  const steps: string[] = [];
  if (imperialBlocked) {
    if (!imperial.sovereignReady) {
      steps.push('Restore sovereign bundle: realm and sovereign export must pass.');
    }
    if (!imperial.sovereignExportShipped) {
      steps.push('Emit session sovereign export before imperial clearance.');
    }
    if (!imperial.realmSovereignHealthy) {
      steps.push('Reconcile realm/sovereign bridge before imperial.');
    }
    steps.push(...buildSovereignRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const sovereign = buildMatchExplainabilitySovereignBundle(packs, params);
    if (!sovereign.sovereignReady) {
      steps.push('Re-run sovereign readiness checklist on turn packs.');
    }
  } else {
    steps.push('Imperial gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_IMPERIAL_RECOVERY_CAP);
  return {
    imperialBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Imperial recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function imperialRecoveryOrchestratorWithinCap(report: ImperialRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_IMPERIAL_RECOVERY_CAP;
}


// --- source: match-explainability-dominion-bundle.ts ---
  auditMatchExplainabilityDominionGate,
  matchExplainabilityDominionAllowed,
} from './match-explainability-dominion-gate.ts';
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';
  buildSessionImperialExportBundle,
  sessionImperialExportShipped,
} from './session-imperial-export-bundle.ts';

export const AGENT19_DOMINION_NARRATIVE_CAP = 10;

export interface MatchExplainabilityDominionBundle {
  dominionReady: boolean;
  dominionAllowed: boolean;
  imperialReady: boolean;
  imperialExportShipped: boolean;
  narrativeLines: string[];
}

type DominionParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Dominion bundle: dominion gate and imperial export must both be green. */
export function buildMatchExplainabilityDominionBundle(
  packs: TurnExplainabilityPack[],
  params: DominionParams,
): MatchExplainabilityDominionBundle {
  const dominion = auditMatchExplainabilityDominionGate(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const imperialExport = buildSessionImperialExportBundle(packs, params);
  const dominionAllowed = matchExplainabilityDominionAllowed(dominion);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const imperialExportShipped = sessionImperialExportShipped(imperialExport);
  const dominionReady = dominionAllowed && imperialReady && imperialExportShipped;
  const narrativeLines = [
    `Match explainability dominion bundle: ${dominionReady ? 'READY' : 'PENDING'} (gate ${dominionAllowed ? 'ok' : 'fail'}, imperial ${imperialReady ? 'ok' : 'fail'}).`,
    ...dominion.narrativeLines.slice(0, 2),
    ...imperial.narrativeLines.slice(0, 1),
  ].slice(0, AGENT19_DOMINION_NARRATIVE_CAP);
  return {
    dominionReady,
    dominionAllowed,
    imperialReady,
    imperialExportShipped,
    narrativeLines,
  };
}

export function matchExplainabilityDominionReady(bundle: MatchExplainabilityDominionBundle): boolean {
  return bundle.dominionReady;
}


// --- source: session-dominion-export-bundle.ts ---
  buildSessionImperialExportBundle,
  type SessionImperialExportBundle,
} from './session-imperial-export-bundle.ts';
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';

export interface SessionDominionExportBundle extends SessionImperialExportBundle {
  dominionReady: boolean;
  dominionSchema: string;
}

/** Dominion export wraps imperial export when dominion bundle is ready. */
export function buildSessionDominionExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionDominionExportBundle {
  const base = buildSessionImperialExportBundle(packs, params);
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const exports = dominionReady ? base.exports : [];
  return {
    ...base,
    exports,
    dominionReady,
    dominionSchema: 'agent19.dominion.v1',
    releaseReady: dominionReady && base.releaseReady,
    narrativeLines: [
      ...base.narrativeLines.slice(0, 1),
      `Dominion export: ${dominionReady ? 'SHIPPED' : 'EMPTY'} (${exports.length} record(s)).`,
    ],
  };
}

export function sessionDominionExportShipped(bundle: SessionDominionExportBundle): boolean {
  return (
    bundle.dominionReady &&
    bundle.exports.length > 0 &&
    bundle.dominionSchema === 'agent19.dominion.v1'
  );
}


// --- source: imperial-dominion-bridge.ts ---
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from './match-explainability-imperial-bundle.ts';

export interface ImperialDominionBridgeReport {
  aligned: boolean;
  dominionReady: boolean;
  imperialReady: boolean;
  narrativeLines: string[];
}

/** Dominion-ready should match imperial-ready when imperial export stack passes. */
export function auditImperialDominionBridge(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ImperialDominionBridgeReport {
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const imperial = buildMatchExplainabilityImperialBundle(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const imperialReady = matchExplainabilityImperialReady(imperial);
  const aligned = dominionReady === imperialReady;
  const narrativeLines = [
    `Imperial/dominion bridge: ${aligned ? 'ALIGNED' : 'CHECK'} (dominion ${dominionReady ? 'ok' : 'fail'}, imperial ${imperialReady ? 'ok' : 'fail'}).`,
  ];
  return { aligned, dominionReady, imperialReady, narrativeLines };
}

export function imperialDominionBridgeHealthy(report: ImperialDominionBridgeReport): boolean {
  return report.dominionReady && report.imperialReady && report.aligned;
}


// --- source: match-explainability-hegemony-gate.ts ---
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from './match-explainability-dominion-bundle.ts';
  buildSessionDominionExportBundle,
  sessionDominionExportShipped,
} from './session-dominion-export-bundle.ts';

export interface MatchExplainabilityHegemonyGateReport {
  hegemonyAllowed: boolean;
  dominionReady: boolean;
  dominionExportShipped: boolean;
  imperialDominionHealthy: boolean;
  narrativeLines: string[];
}

/** Hegemony gate: dominion bundle + dominion export + imperial/dominion bridge. */
export function auditMatchExplainabilityHegemonyGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchExplainabilityHegemonyGateReport {
  const dominion = buildMatchExplainabilityDominionBundle(packs, params);
  const dominionExport = buildSessionDominionExportBundle(packs, params);
  const bridge = auditImperialDominionBridge(packs, params);
  const dominionReady = matchExplainabilityDominionReady(dominion);
  const dominionExportShipped = sessionDominionExportShipped(dominionExport);
  const imperialDominionHealthy = imperialDominionBridgeHealthy(bridge);
  const hegemonyAllowed = dominionReady && dominionExportShipped && imperialDominionHealthy;
  const narrativeLines = [
    `Match explainability hegemony: ${hegemonyAllowed ? 'ALLOWED' : 'DENIED'} (dominion ${dominionReady ? 'ok' : 'fail'}, export ${dominionExportShipped ? 'ok' : 'fail'}).`,
    ...dominion.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    hegemonyAllowed,
    dominionReady,
    dominionExportShipped,
    imperialDominionHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityHegemonyAllowed(report: MatchExplainabilityHegemonyGateReport): boolean {
  return report.hegemonyAllowed;
}


// --- source: dominion-recovery-orchestrator.ts ---
  auditMatchExplainabilityDominionGate,
  matchExplainabilityDominionAllowed,
} from './match-explainability-dominion-gate.ts';

export const AGENT19_DOMINION_RECOVERY_CAP = 10;

export interface DominionRecoveryOrchestratorReport {
  dominionBlocked: boolean;
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

type RecoveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Recovery path when dominion gate blocks hegemony rollout. */
export function buildDominionRecoveryOrchestrator(
  packs: TurnExplainabilityPack[],
  params: RecoveryParams,
): DominionRecoveryOrchestratorReport {
  const dominion = auditMatchExplainabilityDominionGate(packs, params);
  const dominionBlocked = !matchExplainabilityDominionAllowed(dominion);
  const steps: string[] = [];
  if (dominionBlocked) {
    if (!dominion.imperialReady) {
      steps.push('Restore imperial bundle: sovereign and imperial export must pass.');
    }
    if (!dominion.imperialExportShipped) {
      steps.push('Emit session imperial export before dominion clearance.');
    }
    if (!dominion.sovereignImperialHealthy) {
      steps.push('Reconcile sovereign/imperial bridge before dominion.');
    }
    steps.push(...buildImperialRecoveryOrchestrator(packs, params).steps.slice(0, 3));
    const imperial = buildMatchExplainabilityImperialBundle(packs, params);
    if (!imperial.imperialReady) {
      steps.push('Re-run imperial readiness checklist on turn packs.');
    }
  } else {
    steps.push('Dominion gate open — recovery orchestrator idle.');
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_DOMINION_RECOVERY_CAP);
  return {
    dominionBlocked,
    stepCount: unique.length,
    steps: unique,
    narrativeLines: [`Dominion recovery orchestrator: ${unique.length} step(s).`, ...unique.slice(0, 3)],
  };
}

export function dominionRecoveryOrchestratorWithinCap(report: DominionRecoveryOrchestratorReport): boolean {
  return report.stepCount <= AGENT19_DOMINION_RECOVERY_CAP;
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
  buildMatchExplainabilityDeliveryBundle,
  matchExplainabilityDeliveryShippable,
  AGENT19_DELIVERY_NARRATIVE_CAP,
} from '../match-explainability-delivery-bundle.ts';
  buildFinalGateRecoveryHints,
  finalGateRecoveryNeeded,
  AGENT19_FINAL_RECOVERY_HINT_CAP,
} from '../final-gate-recovery-bridge.ts';
  auditNegotiationExportBridge,
  negotiationExportNotesIncluded,
} from '../negotiation-export-bridge.ts';
  auditMatchExplainabilityShipmentGate,
  matchExplainabilityShipmentAllowed,
} from '../match-explainability-shipment-gate.ts';
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from '../match-explainability-release-bundle.ts';
  buildShipmentRecoveryPlaybookBridge,
  shipmentRecoveryNeeded,
  AGENT19_SHIPMENT_RECOVERY_CAP,
} from '../shipment-recovery-playbook-bridge.ts';
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from '../session-release-export-bundle.ts';
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from '../match-explainability-launch-gate.ts';
  buildMatchExplainabilityOperationsBundle,
  matchExplainabilityOperationsReady,
} from '../match-explainability-operations-bundle.ts';
  buildLaunchRecoveryOrchestrator,
  launchRecoveryOrchestratorWithinCap,
  AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP,
} from '../launch-recovery-orchestrator.ts';
  buildSessionOperationsExportBundle,
  sessionOperationsExportReady,
} from '../session-operations-export-bundle.ts';
  auditMatchExplainabilityProductionGate,
  matchExplainabilityProductionAllowed,
} from '../match-explainability-production-gate.ts';
  buildMatchExplainabilityDeploymentBundle,
  matchExplainabilityDeploymentReady,
} from '../match-explainability-deployment-bundle.ts';
  buildProductionRecoveryOrchestrator,
  productionRecoveryOrchestratorWithinCap,
  AGENT19_PRODUCTION_RECOVERY_CAP,
} from '../production-recovery-orchestrator.ts';
  buildSessionDeploymentExportBundle,
  sessionDeploymentExportShipped,
} from '../session-deployment-export-bundle.ts';
  auditOperationsProductionBridge,
  operationsProductionBridgeHealthy,
} from '../operations-production-bridge.ts';
  auditMatchExplainabilityFleetGate,
  matchExplainabilityFleetAllowed,
} from '../match-explainability-fleet-gate.ts';
  buildMatchExplainabilitySustainmentBundle,
  matchExplainabilitySustainmentReady,
} from '../match-explainability-sustainment-bundle.ts';
  buildSessionSustainmentExportBundle,
  sessionSustainmentExportShipped,
} from '../session-sustainment-export-bundle.ts';
  auditFleetSustainmentBridge,
  fleetSustainmentBridgeHealthy,
} from '../fleet-sustainment-bridge.ts';
  buildFleetRecoveryOrchestrator,
  fleetRecoveryOrchestratorWithinCap,
} from '../fleet-recovery-orchestrator.ts';
  auditMatchExplainabilityOrbitGate,
  matchExplainabilityOrbitAllowed,
} from '../match-explainability-orbit-gate.ts';
  buildMatchExplainabilityTransitBundle,
  matchExplainabilityTransitReady,
} from '../match-explainability-transit-bundle.ts';
  buildSessionTransitExportBundle,
  sessionTransitExportShipped,
} from '../session-transit-export-bundle.ts';
  buildOrbitRecoveryOrchestrator,
  orbitRecoveryOrchestratorWithinCap,
} from '../orbit-recovery-orchestrator.ts';
  auditMatchExplainabilityRelayGate,
  matchExplainabilityRelayAllowed,
} from '../match-explainability-relay-gate.ts';
  buildMatchExplainabilityRelayBundle,
  matchExplainabilityRelayReady,
} from '../match-explainability-relay-bundle.ts';
  buildSessionRelayExportBundle,
  sessionRelayExportShipped,
} from '../session-relay-export-bundle.ts';
  buildRelayRecoveryOrchestrator,
  relayRecoveryOrchestratorWithinCap,
} from '../relay-recovery-orchestrator.ts';
  auditMatchExplainabilityBeaconGate,
  matchExplainabilityBeaconAllowed,
} from '../match-explainability-beacon-gate.ts';
  buildMatchExplainabilityBeaconBundle,
  matchExplainabilityBeaconReady,
} from '../match-explainability-beacon-bundle.ts';
  buildSessionBeaconExportBundle,
  sessionBeaconExportShipped,
} from '../session-beacon-export-bundle.ts';
  buildBeaconRecoveryOrchestrator,
  beaconRecoveryOrchestratorWithinCap,
} from '../beacon-recovery-orchestrator.ts';
  auditMatchExplainabilitySignalGate,
  matchExplainabilitySignalAllowed,
} from '../match-explainability-signal-gate.ts';
  buildMatchExplainabilitySignalBundle,
  matchExplainabilitySignalReady,
} from '../match-explainability-signal-bundle.ts';
  buildSessionSignalExportBundle,
  sessionSignalExportShipped,
} from '../session-signal-export-bundle.ts';
  buildSignalRecoveryOrchestrator,
  signalRecoveryOrchestratorWithinCap,
} from '../signal-recovery-orchestrator.ts';
  auditMatchExplainabilityUplinkGate,
  matchExplainabilityUplinkAllowed,
} from '../match-explainability-uplink-gate.ts';
  buildMatchExplainabilityUplinkBundle,
  matchExplainabilityUplinkReady,
} from '../match-explainability-uplink-bundle.ts';
  buildSessionUplinkExportBundle,
  sessionUplinkExportShipped,
} from '../session-uplink-export-bundle.ts';
  buildUplinkRecoveryOrchestrator,
  uplinkRecoveryOrchestratorWithinCap,
} from '../uplink-recovery-orchestrator.ts';
  auditMatchExplainabilityHandshakeGate,
  matchExplainabilityHandshakeAllowed,
} from '../match-explainability-handshake-gate.ts';
  buildMatchExplainabilityHandshakeBundle,
  matchExplainabilityHandshakeReady,
} from '../match-explainability-handshake-bundle.ts';
  buildSessionHandshakeExportBundle,
  sessionHandshakeExportShipped,
} from '../session-handshake-export-bundle.ts';
  buildHandshakeRecoveryOrchestrator,
  handshakeRecoveryOrchestratorWithinCap,
} from '../handshake-recovery-orchestrator.ts';
  auditMatchExplainabilityAckGate,
  matchExplainabilityAckAllowed,
} from '../match-explainability-ack-gate.ts';
  buildMatchExplainabilityAckBundle,
  matchExplainabilityAckReady,
} from '../match-explainability-ack-bundle.ts';
  buildSessionAckExportBundle,
  sessionAckExportShipped,
} from '../session-ack-export-bundle.ts';
  buildAckRecoveryOrchestrator,
  ackRecoveryOrchestratorWithinCap,
} from '../ack-recovery-orchestrator.ts';
  auditMatchExplainabilityConfirmGate,
  matchExplainabilityConfirmAllowed,
} from '../match-explainability-confirm-gate.ts';
  buildMatchExplainabilityConfirmBundle,
  matchExplainabilityConfirmReady,
} from '../match-explainability-confirm-bundle.ts';
  buildSessionConfirmExportBundle,
  sessionConfirmExportShipped,
} from '../session-confirm-export-bundle.ts';
  buildConfirmRecoveryOrchestrator,
  confirmRecoveryOrchestratorWithinCap,
} from '../confirm-recovery-orchestrator.ts';
  auditMatchExplainabilitySealGate,
  matchExplainabilitySealAllowed,
} from '../match-explainability-seal-gate.ts';
  buildMatchExplainabilitySealBundle,
  matchExplainabilitySealReady,
} from '../match-explainability-seal-bundle.ts';
  buildSessionSealExportBundle,
  sessionSealExportShipped,
} from '../session-seal-export-bundle.ts';
  buildSealRecoveryOrchestrator,
  sealRecoveryOrchestratorWithinCap,
} from '../seal-recovery-orchestrator.ts';
  auditMatchExplainabilityCovenantGate,
  matchExplainabilityCovenantAllowed,
} from '../match-explainability-covenant-gate.ts';
  buildMatchExplainabilityCovenantBundle,
  matchExplainabilityCovenantReady,
} from '../match-explainability-covenant-bundle.ts';
  buildSessionCovenantExportBundle,
  sessionCovenantExportShipped,
} from '../session-covenant-export-bundle.ts';
  buildCovenantRecoveryOrchestrator,
  covenantRecoveryOrchestratorWithinCap,
} from '../covenant-recovery-orchestrator.ts';
  auditMatchExplainabilityCharterGate,
  matchExplainabilityCharterAllowed,
} from '../match-explainability-charter-gate.ts';
  buildMatchExplainabilityCharterBundle,
  matchExplainabilityCharterReady,
} from '../match-explainability-charter-bundle.ts';
  buildSessionCharterExportBundle,
  sessionCharterExportShipped,
} from '../session-charter-export-bundle.ts';
  buildCharterRecoveryOrchestrator,
  charterRecoveryOrchestratorWithinCap,
} from '../charter-recovery-orchestrator.ts';
  auditMatchExplainabilityPactGate,
  matchExplainabilityPactAllowed,
} from '../match-explainability-pact-gate.ts';
  buildMatchExplainabilityPactBundle,
  matchExplainabilityPactReady,
} from '../match-explainability-pact-bundle.ts';
  buildSessionPactExportBundle,
  sessionPactExportShipped,
} from '../session-pact-export-bundle.ts';
  buildPactRecoveryOrchestrator,
  pactRecoveryOrchestratorWithinCap,
} from '../pact-recovery-orchestrator.ts';
  auditMatchExplainabilityTreatyGate,
  matchExplainabilityTreatyAllowed,
} from '../match-explainability-treaty-gate.ts';
  buildMatchExplainabilityTreatyBundle,
  matchExplainabilityTreatyReady,
} from '../match-explainability-treaty-bundle.ts';
  buildSessionTreatyExportBundle,
  sessionTreatyExportShipped,
} from '../session-treaty-export-bundle.ts';
  buildTreatyRecoveryOrchestrator,
  treatyRecoveryOrchestratorWithinCap,
} from '../treaty-recovery-orchestrator.ts';
  auditMatchExplainabilityAccordGate,
  matchExplainabilityAccordAllowed,
} from '../match-explainability-accord-gate.ts';
  buildMatchExplainabilityAccordBundle,
  matchExplainabilityAccordReady,
} from '../match-explainability-accord-bundle.ts';
  buildSessionAccordExportBundle,
  sessionAccordExportShipped,
} from '../session-accord-export-bundle.ts';
  buildAccordRecoveryOrchestrator,
  accordRecoveryOrchestratorWithinCap,
} from '../accord-recovery-orchestrator.ts';
  auditMatchExplainabilityLeagueGate,
  matchExplainabilityLeagueAllowed,
} from '../match-explainability-league-gate.ts';
  buildMatchExplainabilityLeagueBundle,
  matchExplainabilityLeagueReady,
} from '../match-explainability-league-bundle.ts';
  buildSessionLeagueExportBundle,
  sessionLeagueExportShipped,
} from '../session-league-export-bundle.ts';
  buildLeagueRecoveryOrchestrator,
  leagueRecoveryOrchestratorWithinCap,
} from '../league-recovery-orchestrator.ts';
  auditMatchExplainabilityFederationGate,
  matchExplainabilityFederationAllowed,
} from '../match-explainability-federation-gate.ts';
  buildMatchExplainabilityFederationBundle,
  matchExplainabilityFederationReady,
} from '../match-explainability-federation-bundle.ts';
  buildSessionFederationExportBundle,
  sessionFederationExportShipped,
} from '../session-federation-export-bundle.ts';
  buildFederationRecoveryOrchestrator,
  federationRecoveryOrchestratorWithinCap,
} from '../federation-recovery-orchestrator.ts';
  auditMatchExplainabilityUnionGate,
  matchExplainabilityUnionAllowed,
} from '../match-explainability-union-gate.ts';
  buildMatchExplainabilityUnionBundle,
  matchExplainabilityUnionReady,
} from '../match-explainability-union-bundle.ts';
  buildSessionUnionExportBundle,
  sessionUnionExportShipped,
} from '../session-union-export-bundle.ts';
  buildUnionRecoveryOrchestrator,
  unionRecoveryOrchestratorWithinCap,
} from '../union-recovery-orchestrator.ts';
  auditMatchExplainabilityCommonwealthGate,
  matchExplainabilityCommonwealthAllowed,
} from '../match-explainability-commonwealth-gate.ts';
  buildMatchExplainabilityCommonwealthBundle,
  matchExplainabilityCommonwealthReady,
} from '../match-explainability-commonwealth-bundle.ts';
  buildSessionCommonwealthExportBundle,
  sessionCommonwealthExportShipped,
} from '../session-commonwealth-export-bundle.ts';
  buildCommonwealthRecoveryOrchestrator,
  commonwealthRecoveryOrchestratorWithinCap,
} from '../commonwealth-recovery-orchestrator.ts';
  auditMatchExplainabilityRealmGate,
  matchExplainabilityRealmAllowed,
} from '../match-explainability-realm-gate.ts';
  buildMatchExplainabilityRealmBundle,
  matchExplainabilityRealmReady,
} from '../match-explainability-realm-bundle.ts';
  buildSessionRealmExportBundle,
  sessionRealmExportShipped,
} from '../session-realm-export-bundle.ts';
  buildRealmRecoveryOrchestrator,
  realmRecoveryOrchestratorWithinCap,
} from '../realm-recovery-orchestrator.ts';
  auditMatchExplainabilitySovereignGate,
  matchExplainabilitySovereignAllowed,
} from '../match-explainability-sovereign-gate.ts';
  buildMatchExplainabilitySovereignBundle,
  matchExplainabilitySovereignReady,
} from '../match-explainability-sovereign-bundle.ts';
  buildSessionSovereignExportBundle,
  sessionSovereignExportShipped,
} from '../session-sovereign-export-bundle.ts';
  buildSovereignRecoveryOrchestrator,
  sovereignRecoveryOrchestratorWithinCap,
} from '../sovereign-recovery-orchestrator.ts';
  auditMatchExplainabilityImperialGate,
  matchExplainabilityImperialAllowed,
} from '../match-explainability-imperial-gate.ts';
  buildMatchExplainabilityImperialBundle,
  matchExplainabilityImperialReady,
} from '../match-explainability-imperial-bundle.ts';
  buildSessionImperialExportBundle,
  sessionImperialExportShipped,
} from '../session-imperial-export-bundle.ts';
  buildImperialRecoveryOrchestrator,
  imperialRecoveryOrchestratorWithinCap,
} from '../imperial-recovery-orchestrator.ts';
  auditMatchExplainabilityDominionGate,
  matchExplainabilityDominionAllowed,
} from '../match-explainability-dominion-gate.ts';
  buildMatchExplainabilityDominionBundle,
  matchExplainabilityDominionReady,
} from '../match-explainability-dominion-bundle.ts';
  buildSessionDominionExportBundle,
  sessionDominionExportShipped,
} from '../session-dominion-export-bundle.ts';
  buildDominionRecoveryOrchestrator,
  dominionRecoveryOrchestratorWithinCap,
} from '../dominion-recovery-orchestrator.ts';
  auditMatchExplainabilityHegemonyGate,
  matchExplainabilityHegemonyAllowed,
} from '../match-explainability-hegemony-gate.ts';

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
      [
        'a19_r12_delivery_ship',
        'Delivery bundle ships exports when final gate open',
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
          const delivery = buildMatchExplainabilityDeliveryBundle([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            matchExplainabilityDeliveryShippable(delivery) &&
            delivery.exportBundle !== null &&
            delivery.recoveryPlaybook === null &&
            delivery.narrativeLines.length <= AGENT19_DELIVERY_NARRATIVE_CAP
          ) || JSON.stringify(delivery);
        },
      ],
      [
        'a19_r12_delivery_blocked',
        'Delivery bundle returns playbook when trace fails',
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
          const delivery = buildMatchExplainabilityDeliveryBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return (
            !matchExplainabilityDeliveryShippable(delivery) &&
            delivery.recoveryPlaybook !== null &&
            delivery.exportBundle === null
          ) || JSON.stringify(delivery);
        },
      ],
      [
        'a19_r12_final_recovery_bridge',
        'Final gate recovery hints cite trace when continuity fails',
        () => {
          const decisionsBefore = [{ type: 'a', score: 1 }, { type: 'b', score: 1 }];
          const decisionsAfter = [{ type: 'a', score: 3, memoryInfluence: 1, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 1, reason: 't' }] }];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const finalGate = auditMatchExplainabilityFinalGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          const hints = buildFinalGateRecoveryHints(finalGate);
          return (
            finalGateRecoveryNeeded(finalGate) &&
            hints.some(h => h.includes('option types') || h.includes('Restore')) &&
            hints.length <= AGENT19_FINAL_RECOVERY_HINT_CAP
          ) || hints.join('|');
        },
      ],
      [
        'a19_r12_gi_delivery',
        'Session GI delivery ready when match gate open',
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
          const gi = buildSessionGiDeliveryBundle([pack], {
            memory: mem,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionGiDeliveryReady(gi) && gi.giWithinCap || JSON.stringify(gi);
        },
      ],
      [
        'a19_r12_negotiation_export',
        'Negotiation export bridge includes notes when aligned',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
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
          const report = auditNegotiationExportBridge([pack], {
            memory: mem,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return negotiationExportNotesIncluded(report) && report.exportTurnCount === 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r12_shipment_gate_ok',
        'Shipment gate allows healthy diplomacy session',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityShipmentGate([pack], {
            memory: mem,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityShipmentAllowed(report) && report.finalGateOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r12_shipment_gate_fail',
        'Shipment gate blocks when final trace continuity fails',
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
          const report = auditMatchExplainabilityShipmentGate([pack], {
            memory: null,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityShipmentAllowed(report) && !report.finalGateOpen || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_release_ready',
        'Release bundle ready when delivery shipment and GI align',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const release = buildMatchExplainabilityReleaseBundle([pack], params);
          return matchExplainabilityReleaseReady(release) && release.giDeliveryReady || JSON.stringify(release);
        },
      ],
      [
        'a19_r13_release_held',
        'Release bundle held when trace continuity fails',
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
          const release = buildMatchExplainabilityReleaseBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityReleaseReady(release) && !release.deliveryShippable || JSON.stringify(release);
        },
      ],
      [
        'a19_r13_shipment_recovery',
        'Shipment recovery bridge lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'a', score: 1 }, { type: 'b', score: 1 }];
          const decisionsAfter = [{ type: 'a', score: 3, memoryInfluence: 1, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 1, reason: 't' }] }];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: null,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bridge = buildShipmentRecoveryPlaybookBridge([pack], params);
          return (
            shipmentRecoveryNeeded([pack], params) &&
            bridge.stepCount >= 1 &&
            bridge.stepCount <= AGENT19_SHIPMENT_RECOVERY_CAP
          ) || bridge.steps.join('|');
        },
      ],
      [
        'a19_r13_delivery_shipment_bridge',
        'Delivery and shipment gates align on healthy session',
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
          const report = auditDeliveryShipmentBridge([pack], {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return deliveryShipmentBridgeAligned(report) && report.deliveryShippable || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_session_release_export',
        'Session release export emits when release ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bundle = buildSessionReleaseExportBundle([pack], params);
          return (
            sessionReleaseExportEmitted(bundle) &&
            bundle.schema === 'agent19.release.v1' &&
            bundle.exports.length === 1
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r13_launch_gate_ok',
        'Launch gate GO when release export emitted',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityLaunchGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityLaunchAllowed(report) && report.releaseExportEmitted || JSON.stringify(report);
        },
      ],
      [
        'a19_r13_launch_gate_no',
        'Launch gate NO-GO when shipment blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 4,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityLaunchGate([pack], {
            memory: null,
            currentTurn: 4,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLaunchAllowed(report) && report.recoveryStepCount >= 1 || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_ops_ready',
        'Operations bundle ready when launch and GI delivery pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const ops = buildMatchExplainabilityOperationsBundle([pack], params);
          return matchExplainabilityOperationsReady(ops) && ops.launchAllowed || JSON.stringify(ops);
        },
      ],
      [
        'a19_r14_launch_recovery_orchestrator',
        'Launch recovery orchestrator lists steps when blocked',
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
          const params = {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const report = buildLaunchRecoveryOrchestrator([pack], params, false);
          return (
            report.launchBlocked &&
            report.stepCount >= 1 &&
            launchRecoveryOrchestratorWithinCap(report) &&
            report.stepCount <= AGENT19_LAUNCH_RECOVERY_ORCHESTRATOR_CAP
          ) || report.steps.join('|');
        },
      ],
      [
        'a19_r14_ops_export',
        'Session operations export ready on healthy launch',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const params = {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const bundle = buildSessionOperationsExportBundle([pack], params);
          return (
            sessionOperationsExportReady(bundle) &&
            bundle.operationsSchema === 'agent19.operations.v1' &&
            bundle.launchAllowed
          ) || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r14_release_launch_bridge',
        'Release launch bridge aligned on GO path',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditReleaseLaunchBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return releaseLaunchBridgeAligned(report) && report.launchAllowed || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_production_gate_ok',
        'Production gate allowed on full healthy stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({
            turn: 1,
            memoryBefore: mem,
            memoryAfter: mem,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityProductionGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityProductionAllowed(report) && report.operationsExportReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_production_gate_block',
        'Production gate blocked when launch NO-GO',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({
            turn: 5,
            memoryBefore: null,
            memoryAfter: null,
            decisionsBefore,
            decisionsAfter,
          });
          const report = auditMatchExplainabilityProductionGate([pack], {
            memory: null,
            currentTurn: 5,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityProductionAllowed(report) && !report.operationsReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r14_launch_recovery_idle',
        'Launch recovery orchestrator idle when GO',
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
          const params = {
            memory: mem,
            currentTurn: 1,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium' as const,
            memoryInfluenceEnabled: true,
          };
          const launch = auditMatchExplainabilityLaunchGate([pack], params);
          const report = buildLaunchRecoveryOrchestrator([pack], params, matchExplainabilityLaunchAllowed(launch));
          return !report.launchBlocked && report.steps[0].includes('idle') || report.steps.join('|');
        },
      ],
      [
        'a19_r15_deployment_ready',
        'Deployment bundle ready when production and ops pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const deploy = buildMatchExplainabilityDeploymentBundle([pack], params);
          return matchExplainabilityDeploymentReady(deploy) && deploy.productionAllowed || JSON.stringify(deploy);
        },
      ],
      [
        'a19_r15_deployment_held',
        'Deployment bundle pending when trace fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 2, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const deploy = buildMatchExplainabilityDeploymentBundle([pack], {
            memory: null,
            currentTurn: 2,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityDeploymentReady(deploy) && !deploy.productionAllowed || JSON.stringify(deploy);
        },
      ],
      [
        'a19_r15_production_recovery',
        'Production recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 1, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildProductionRecoveryOrchestrator([pack], params);
          return report.productionBlocked && productionRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r15_ops_production_bridge',
        'Ops production bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditOperationsProductionBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return operationsProductionBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r15_deployment_export',
        'Deployment export shipped when deployment ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionDeploymentExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionDeploymentExportShipped(bundle) && bundle.deploymentSchema === 'agent19.deployment.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r15_fleet_gate_ok',
        'Fleet gate allowed on healthy deployment stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFleetGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFleetAllowed(report) && report.deploymentExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r15_fleet_gate_block',
        'Fleet gate denied when deployment pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 6, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFleetGate([pack], {
            memory: null,
            currentTurn: 6,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFleetAllowed(report) && !report.deploymentReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_sustainment_ready',
        'Sustainment bundle ready when fleet and deployment export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySustainmentBundle([pack], params);
          return matchExplainabilitySustainmentReady(bundle) && bundle.fleetAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_sustainment_held',
        'Sustainment bundle pending when fleet fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 7, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySustainmentBundle([pack], {
            memory: null,
            currentTurn: 7,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySustainmentReady(bundle) && !bundle.fleetAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_fleet_recovery',
        'Fleet recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 2, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 2, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildFleetRecoveryOrchestrator([pack], params);
          return report.fleetBlocked && fleetRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r16_fleet_sustainment_bridge',
        'Fleet sustainment bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditFleetSustainmentBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return fleetSustainmentBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_sustainment_export',
        'Sustainment export shipped when sustainment ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSustainmentExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSustainmentExportShipped(bundle) && bundle.sustainmentSchema === 'agent19.sustainment.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r16_orbit_gate_ok',
        'Orbit gate allowed on healthy sustainment stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityOrbitGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityOrbitAllowed(report) && report.sustainmentExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r16_orbit_gate_block',
        'Orbit gate denied when sustainment pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 8, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityOrbitGate([pack], {
            memory: null,
            currentTurn: 8,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityOrbitAllowed(report) && !report.sustainmentReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_transit_ready',
        'Transit bundle ready when orbit and sustainment export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityTransitBundle([pack], params);
          return matchExplainabilityTransitReady(bundle) && bundle.orbitAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_transit_held',
        'Transit bundle pending when orbit fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 9, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityTransitBundle([pack], {
            memory: null,
            currentTurn: 9,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTransitReady(bundle) && !bundle.orbitAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_orbit_recovery',
        'Orbit recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 3, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 3, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildOrbitRecoveryOrchestrator([pack], params);
          return report.orbitBlocked && orbitRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r17_orbit_transit_bridge',
        'Orbit transit bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditOrbitTransitBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return orbitTransitBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_transit_export',
        'Transit export shipped when transit ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionTransitExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionTransitExportShipped(bundle) && bundle.transitSchema === 'agent19.transit.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r17_relay_gate_ok',
        'Relay gate allowed on healthy transit stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRelayGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityRelayAllowed(report) && report.transitExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r17_relay_gate_block',
        'Relay gate denied when transit pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 10, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRelayGate([pack], {
            memory: null,
            currentTurn: 10,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRelayAllowed(report) && !report.transitReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_relay_ready',
        'Relay bundle ready when relay gate and transit export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityRelayBundle([pack], params);
          return matchExplainabilityRelayReady(bundle) && bundle.relayAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_relay_held',
        'Relay bundle pending when relay gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 11, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityRelayBundle([pack], {
            memory: null,
            currentTurn: 11,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRelayReady(bundle) && !bundle.relayAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_relay_recovery',
        'Relay recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 4, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 4, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildRelayRecoveryOrchestrator([pack], params);
          return report.relayBlocked && relayRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r18_relay_transit_bridge',
        'Relay transit bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditRelayTransitBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return relayTransitBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_relay_export',
        'Relay export shipped when relay ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionRelayExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionRelayExportShipped(bundle) && bundle.relaySchema === 'agent19.relay.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r18_beacon_gate_ok',
        'Beacon gate allowed on healthy relay stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityBeaconGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityBeaconAllowed(report) && report.relayExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r18_beacon_gate_block',
        'Beacon gate denied when relay pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 12, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityBeaconGate([pack], {
            memory: null,
            currentTurn: 12,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityBeaconAllowed(report) && !report.relayReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_beacon_ready',
        'Beacon bundle ready when beacon gate and relay export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityBeaconBundle([pack], params);
          return matchExplainabilityBeaconReady(bundle) && bundle.beaconAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_beacon_held',
        'Beacon bundle pending when beacon gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 13, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityBeaconBundle([pack], {
            memory: null,
            currentTurn: 13,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityBeaconReady(bundle) && !bundle.beaconAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_beacon_recovery',
        'Beacon recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 5, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 5, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildBeaconRecoveryOrchestrator([pack], params);
          return report.beaconBlocked && beaconRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r19_relay_beacon_bridge',
        'Relay beacon bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditRelayBeaconBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return relayBeaconBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_beacon_export',
        'Beacon export shipped when beacon ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionBeaconExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionBeaconExportShipped(bundle) && bundle.beaconSchema === 'agent19.beacon.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r19_signal_gate_ok',
        'Signal gate allowed on healthy beacon stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySignalGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySignalAllowed(report) && report.beaconExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r19_signal_gate_block',
        'Signal gate denied when beacon pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 14, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySignalGate([pack], {
            memory: null,
            currentTurn: 14,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySignalAllowed(report) && !report.beaconReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_signal_ready',
        'Signal bundle ready when signal gate and beacon export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySignalBundle([pack], params);
          return matchExplainabilitySignalReady(bundle) && bundle.signalAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_signal_held',
        'Signal bundle pending when signal gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 15, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySignalBundle([pack], {
            memory: null,
            currentTurn: 15,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySignalReady(bundle) && !bundle.signalAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_signal_recovery',
        'Signal recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 6, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 6, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildSignalRecoveryOrchestrator([pack], params);
          return report.signalBlocked && signalRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r20_beacon_signal_bridge',
        'Beacon signal bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditBeaconSignalBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return beaconSignalBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_signal_export',
        'Signal export shipped when signal ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSignalExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSignalExportShipped(bundle) && bundle.signalSchema === 'agent19.signal.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r20_uplink_gate_ok',
        'Uplink gate allowed on healthy signal stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUplinkGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityUplinkAllowed(report) && report.signalExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r20_uplink_gate_block',
        'Uplink gate denied when signal pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 16, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUplinkGate([pack], {
            memory: null,
            currentTurn: 16,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUplinkAllowed(report) && !report.signalReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_uplink_ready',
        'Uplink bundle ready when uplink gate and signal export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityUplinkBundle([pack], params);
          return matchExplainabilityUplinkReady(bundle) && bundle.uplinkAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_uplink_held',
        'Uplink bundle pending when uplink gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 17, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityUplinkBundle([pack], {
            memory: null,
            currentTurn: 17,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUplinkReady(bundle) && !bundle.uplinkAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_uplink_recovery',
        'Uplink recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 7, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 7, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildUplinkRecoveryOrchestrator([pack], params);
          return report.uplinkBlocked && uplinkRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r21_signal_uplink_bridge',
        'Signal uplink bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditSignalUplinkBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return signalUplinkBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_uplink_export',
        'Uplink export shipped when uplink ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionUplinkExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionUplinkExportShipped(bundle) && bundle.uplinkSchema === 'agent19.uplink.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r21_handshake_gate_ok',
        'Handshake gate allowed on healthy uplink stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHandshakeGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityHandshakeAllowed(report) && report.uplinkExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r21_handshake_gate_block',
        'Handshake gate denied when uplink pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 18, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHandshakeGate([pack], {
            memory: null,
            currentTurn: 18,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityHandshakeAllowed(report) && !report.uplinkReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_handshake_ready',
        'Handshake bundle ready when handshake gate and uplink export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityHandshakeBundle([pack], params);
          return matchExplainabilityHandshakeReady(bundle) && bundle.handshakeAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_handshake_held',
        'Handshake bundle pending when handshake gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 19, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityHandshakeBundle([pack], {
            memory: null,
            currentTurn: 19,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityHandshakeReady(bundle) && !bundle.handshakeAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_handshake_recovery',
        'Handshake recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 8, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 8, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildHandshakeRecoveryOrchestrator([pack], params);
          return report.handshakeBlocked && handshakeRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r22_uplink_handshake_bridge',
        'Uplink handshake bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditUplinkHandshakeBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return uplinkHandshakeBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_handshake_export',
        'Handshake export shipped when handshake ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionHandshakeExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionHandshakeExportShipped(bundle) && bundle.handshakeSchema === 'agent19.handshake.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r22_ack_gate_ok',
        'Ack gate allowed on healthy handshake stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAckGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityAckAllowed(report) && report.handshakeExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r22_ack_gate_block',
        'Ack gate denied when handshake pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 20, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAckGate([pack], {
            memory: null,
            currentTurn: 20,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAckAllowed(report) && !report.handshakeReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_ack_ready',
        'Ack bundle ready when ack gate and handshake export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityAckBundle([pack], params);
          return matchExplainabilityAckReady(bundle) && bundle.ackAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_ack_held',
        'Ack bundle pending when ack gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 21, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityAckBundle([pack], {
            memory: null,
            currentTurn: 21,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAckReady(bundle) && !bundle.ackAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_ack_recovery',
        'Ack recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 9, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 9, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildAckRecoveryOrchestrator([pack], params);
          return report.ackBlocked && ackRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r23_handshake_ack_bridge',
        'Handshake ack bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditHandshakeAckBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return handshakeAckBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_ack_export',
        'Ack export shipped when ack ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionAckExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionAckExportShipped(bundle) && bundle.ackSchema === 'agent19.ack.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r23_confirm_gate_ok',
        'Confirm gate allowed on healthy ack stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityConfirmGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityConfirmAllowed(report) && report.ackExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r23_confirm_gate_block',
        'Confirm gate denied when ack pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 22, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityConfirmGate([pack], {
            memory: null,
            currentTurn: 22,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityConfirmAllowed(report) && !report.ackReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_confirm_ready',
        'Confirm bundle ready when confirm gate and ack export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityConfirmBundle([pack], params);
          return matchExplainabilityConfirmReady(bundle) && bundle.confirmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_confirm_held',
        'Confirm bundle pending when confirm gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 23, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityConfirmBundle([pack], {
            memory: null,
            currentTurn: 23,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityConfirmReady(bundle) && !bundle.confirmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_confirm_recovery',
        'Confirm recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 10, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 10, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildConfirmRecoveryOrchestrator([pack], params);
          return report.confirmBlocked && confirmRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r24_ack_confirm_bridge',
        'Ack confirm bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditAckConfirmBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return ackConfirmBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_confirm_export',
        'Confirm export shipped when confirm ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionConfirmExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionConfirmExportShipped(bundle) && bundle.confirmSchema === 'agent19.confirm.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r24_seal_gate_ok',
        'Seal gate allowed on healthy confirm stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySealGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySealAllowed(report) && report.confirmExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r24_seal_gate_block',
        'Seal gate denied when confirm pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 24, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySealGate([pack], {
            memory: null,
            currentTurn: 24,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySealAllowed(report) && !report.confirmReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_seal_ready',
        'Seal bundle ready when seal gate and confirm export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySealBundle([pack], params);
          return matchExplainabilitySealReady(bundle) && bundle.sealAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_seal_held',
        'Seal bundle pending when seal gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 25, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySealBundle([pack], {
            memory: null,
            currentTurn: 25,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySealReady(bundle) && !bundle.sealAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_seal_recovery',
        'Seal recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 11, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 11, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildSealRecoveryOrchestrator([pack], params);
          return report.sealBlocked && sealRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r25_confirm_seal_bridge',
        'Confirm seal bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditConfirmSealBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return confirmSealBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_seal_export',
        'Seal export shipped when seal ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSealExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSealExportShipped(bundle) && bundle.sealSchema === 'agent19.seal.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r25_covenant_gate_ok',
        'Covenant gate allowed on healthy seal stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCovenantGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCovenantAllowed(report) && report.sealExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r25_covenant_gate_block',
        'Covenant gate denied when seal pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 26, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCovenantGate([pack], {
            memory: null,
            currentTurn: 26,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCovenantAllowed(report) && !report.sealReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_covenant_ready',
        'Covenant bundle ready when covenant gate and seal export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCovenantBundle([pack], params);
          return matchExplainabilityCovenantReady(bundle) && bundle.covenantAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_covenant_held',
        'Covenant bundle pending when covenant gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 27, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCovenantBundle([pack], {
            memory: null,
            currentTurn: 27,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCovenantReady(bundle) && !bundle.covenantAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_covenant_recovery',
        'Covenant recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 12, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 12, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCovenantRecoveryOrchestrator([pack], params);
          return report.covenantBlocked && covenantRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r26_seal_covenant_bridge',
        'Seal covenant bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditSealCovenantBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sealCovenantBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_covenant_export',
        'Covenant export shipped when covenant ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCovenantExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCovenantExportShipped(bundle) && bundle.covenantSchema === 'agent19.covenant.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r26_charter_gate_ok',
        'Charter gate allowed on healthy covenant stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCharterGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCharterAllowed(report) && report.covenantExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r26_charter_gate_block',
        'Charter gate denied when covenant pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 28, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCharterGate([pack], {
            memory: null,
            currentTurn: 28,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCharterAllowed(report) && !report.covenantReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_charter_ready',
        'Charter bundle ready when charter gate and covenant export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCharterBundle([pack], params);
          return matchExplainabilityCharterReady(bundle) && bundle.charterAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_charter_held',
        'Charter bundle pending when charter gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 29, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCharterBundle([pack], {
            memory: null,
            currentTurn: 29,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCharterReady(bundle) && !bundle.charterAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_charter_recovery',
        'Charter recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 13, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 13, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCharterRecoveryOrchestrator([pack], params);
          return report.charterBlocked && charterRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r27_covenant_charter_bridge',
        'Covenant charter bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCovenantCharterBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return covenantCharterBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_charter_export',
        'Charter export shipped when charter ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCharterExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCharterExportShipped(bundle) && bundle.charterSchema === 'agent19.charter.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r27_pact_gate_ok',
        'Pact gate allowed on healthy charter stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityPactGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityPactAllowed(report) && report.charterExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r27_pact_gate_block',
        'Pact gate denied when charter pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 30, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityPactGate([pack], {
            memory: null,
            currentTurn: 30,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityPactAllowed(report) && !report.charterReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_pact_ready',
        'Pact bundle ready when pact gate and charter export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityPactBundle([pack], params);
          return matchExplainabilityPactReady(bundle) && bundle.pactAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_pact_held',
        'Pact bundle pending when pact gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 31, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityPactBundle([pack], {
            memory: null,
            currentTurn: 31,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityPactReady(bundle) && !bundle.pactAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_pact_recovery',
        'Pact recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 14, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 14, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildPactRecoveryOrchestrator([pack], params);
          return report.pactBlocked && pactRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r28_charter_pact_bridge',
        'Charter pact bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCharterPactBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return charterPactBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_pact_export',
        'Pact export shipped when pact ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionPactExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionPactExportShipped(bundle) && bundle.pactSchema === 'agent19.pact.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r28_treaty_gate_ok',
        'Treaty gate allowed on healthy pact stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityTreatyGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityTreatyAllowed(report) && report.pactExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r28_treaty_gate_block',
        'Treaty gate denied when pact pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 32, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityTreatyGate([pack], {
            memory: null,
            currentTurn: 32,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTreatyAllowed(report) && !report.pactReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_treaty_ready',
        'Treaty bundle ready when treaty gate and pact export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityTreatyBundle([pack], params);
          return matchExplainabilityTreatyReady(bundle) && bundle.treatyAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_treaty_held',
        'Treaty bundle pending when treaty gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 33, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityTreatyBundle([pack], {
            memory: null,
            currentTurn: 33,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityTreatyReady(bundle) && !bundle.treatyAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_treaty_recovery',
        'Treaty recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 15, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 15, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildTreatyRecoveryOrchestrator([pack], params);
          return report.treatyBlocked && treatyRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r29_pact_treaty_bridge',
        'Pact treaty bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditPactTreatyBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return pactTreatyBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_treaty_export',
        'Treaty export shipped when treaty ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionTreatyExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionTreatyExportShipped(bundle) && bundle.treatySchema === 'agent19.treaty.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r29_accord_gate_ok',
        'Accord gate allowed on healthy treaty stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAccordGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityAccordAllowed(report) && report.treatyExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r29_accord_gate_block',
        'Accord gate denied when treaty pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 34, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityAccordGate([pack], {
            memory: null,
            currentTurn: 34,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAccordAllowed(report) && !report.treatyReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_accord_ready',
        'Accord bundle ready when accord gate and treaty export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityAccordBundle([pack], params);
          return matchExplainabilityAccordReady(bundle) && bundle.accordAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_accord_held',
        'Accord bundle pending when accord gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 35, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityAccordBundle([pack], {
            memory: null,
            currentTurn: 35,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityAccordReady(bundle) && !bundle.accordAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_accord_recovery',
        'Accord recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 16, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 16, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildAccordRecoveryOrchestrator([pack], params);
          return report.accordBlocked && accordRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r30_treaty_accord_bridge',
        'Treaty accord bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditTreatyAccordBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return treatyAccordBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_accord_export',
        'Accord export shipped when accord ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionAccordExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionAccordExportShipped(bundle) && bundle.accordSchema === 'agent19.accord.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r30_league_gate_ok',
        'League gate allowed on healthy accord stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityLeagueGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityLeagueAllowed(report) && report.accordExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r30_league_gate_block',
        'League gate denied when accord pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 36, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityLeagueGate([pack], {
            memory: null,
            currentTurn: 36,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLeagueAllowed(report) && !report.accordReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_league_ready',
        'League bundle ready when league gate and accord export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityLeagueBundle([pack], params);
          return matchExplainabilityLeagueReady(bundle) && bundle.leagueAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_league_held',
        'League bundle pending when league gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 37, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityLeagueBundle([pack], {
            memory: null,
            currentTurn: 37,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityLeagueReady(bundle) && !bundle.leagueAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_league_recovery',
        'League recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 17, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 17, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildLeagueRecoveryOrchestrator([pack], params);
          return report.leagueBlocked && leagueRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r31_accord_league_bridge',
        'Accord league bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditAccordLeagueBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return accordLeagueBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_league_export',
        'League export shipped when league ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionLeagueExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionLeagueExportShipped(bundle) && bundle.leagueSchema === 'agent19.league.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r31_federation_gate_ok',
        'Federation gate allowed on healthy league stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFederationGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityFederationAllowed(report) && report.leagueExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r31_federation_gate_block',
        'Federation gate denied when league pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 38, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityFederationGate([pack], {
            memory: null,
            currentTurn: 38,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFederationAllowed(report) && !report.leagueReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_federation_ready',
        'Federation bundle ready when federation gate and league export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityFederationBundle([pack], params);
          return matchExplainabilityFederationReady(bundle) && bundle.federationAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_federation_held',
        'Federation bundle pending when federation gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 39, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityFederationBundle([pack], {
            memory: null,
            currentTurn: 39,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityFederationReady(bundle) && !bundle.federationAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_federation_recovery',
        'Federation recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 18, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 18, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildFederationRecoveryOrchestrator([pack], params);
          return report.federationBlocked && federationRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r32_league_federation_bridge',
        'League federation bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditLeagueFederationBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return leagueFederationBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_federation_export',
        'Federation export shipped when federation ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionFederationExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionFederationExportShipped(bundle) && bundle.federationSchema === 'agent19.federation.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r32_union_gate_ok',
        'Union gate allowed on healthy federation stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUnionGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityUnionAllowed(report) && report.federationExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r32_union_gate_block',
        'Union gate denied when federation pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 40, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityUnionGate([pack], {
            memory: null,
            currentTurn: 40,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUnionAllowed(report) && !report.federationReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_union_ready',
        'Union bundle ready when union gate and federation export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityUnionBundle([pack], params);
          return matchExplainabilityUnionReady(bundle) && bundle.unionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_union_held',
        'Union bundle pending when union gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 41, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityUnionBundle([pack], {
            memory: null,
            currentTurn: 41,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityUnionReady(bundle) && !bundle.unionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_union_recovery',
        'Union recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 19, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 19, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildUnionRecoveryOrchestrator([pack], params);
          return report.unionBlocked && unionRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r33_federation_union_bridge',
        'Federation union bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditFederationUnionBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return federationUnionBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_union_export',
        'Union export shipped when union ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionUnionExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionUnionExportShipped(bundle) && bundle.unionSchema === 'agent19.union.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r33_commonwealth_gate_ok',
        'Commonwealth gate allowed on healthy union stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCommonwealthGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityCommonwealthAllowed(report) && report.unionExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r33_commonwealth_gate_block',
        'Commonwealth gate denied when union pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 42, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityCommonwealthGate([pack], {
            memory: null,
            currentTurn: 42,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCommonwealthAllowed(report) && !report.unionReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_commonwealth_ready',
        'Commonwealth bundle ready when commonwealth gate and union export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityCommonwealthBundle([pack], params);
          return matchExplainabilityCommonwealthReady(bundle) && bundle.commonwealthAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_commonwealth_held',
        'Commonwealth bundle pending when commonwealth gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 43, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityCommonwealthBundle([pack], {
            memory: null,
            currentTurn: 43,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityCommonwealthReady(bundle) && !bundle.commonwealthAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_commonwealth_recovery',
        'Commonwealth recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 20, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 20, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildCommonwealthRecoveryOrchestrator([pack], params);
          return report.commonwealthBlocked && commonwealthRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r34_union_commonwealth_bridge',
        'Union commonwealth bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditUnionCommonwealthBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return unionCommonwealthBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_commonwealth_export',
        'Commonwealth export shipped when commonwealth ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionCommonwealthExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionCommonwealthExportShipped(bundle) && bundle.commonwealthSchema === 'agent19.commonwealth.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r34_realm_gate_ok',
        'Realm gate allowed on healthy commonwealth stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRealmGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityRealmAllowed(report) && report.commonwealthExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r34_realm_gate_block',
        'Realm gate denied when commonwealth pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 44, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityRealmGate([pack], {
            memory: null,
            currentTurn: 44,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRealmAllowed(report) && !report.commonwealthReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_realm_ready',
        'Realm bundle ready when realm gate and commonwealth export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityRealmBundle([pack], params);
          return matchExplainabilityRealmReady(bundle) && bundle.realmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_realm_held',
        'Realm bundle pending when realm gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 45, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityRealmBundle([pack], {
            memory: null,
            currentTurn: 45,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityRealmReady(bundle) && !bundle.realmAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_realm_recovery',
        'Realm recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 21, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 21, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildRealmRecoveryOrchestrator([pack], params);
          return report.realmBlocked && realmRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r35_commonwealth_realm_bridge',
        'Commonwealth realm bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditCommonwealthRealmBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return commonwealthRealmBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_realm_export',
        'Realm export shipped when realm ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionRealmExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionRealmExportShipped(bundle) && bundle.realmSchema === 'agent19.realm.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r35_sovereign_gate_ok',
        'Sovereign gate allowed on healthy realm stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySovereignGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilitySovereignAllowed(report) && report.realmExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r35_sovereign_gate_block',
        'Sovereign gate denied when realm pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 46, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilitySovereignGate([pack], {
            memory: null,
            currentTurn: 46,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySovereignAllowed(report) && !report.realmReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r36_sovereign_ready',
        'Sovereign bundle ready when sovereign gate and realm export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilitySovereignBundle([pack], params);
          return matchExplainabilitySovereignReady(bundle) && bundle.sovereignAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r36_sovereign_held',
        'Sovereign bundle pending when sovereign gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 47, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilitySovereignBundle([pack], {
            memory: null,
            currentTurn: 47,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilitySovereignReady(bundle) && !bundle.sovereignAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r36_sovereign_recovery',
        'Sovereign recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 22, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 22, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildSovereignRecoveryOrchestrator([pack], params);
          return report.sovereignBlocked && sovereignRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r36_realm_sovereign_bridge',
        'Realm sovereign bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditRealmSovereignBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return realmSovereignBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r36_sovereign_export',
        'Sovereign export shipped when sovereign ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionSovereignExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionSovereignExportShipped(bundle) && bundle.sovereignSchema === 'agent19.sovereign.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r36_imperial_gate_ok',
        'Imperial gate allowed on healthy sovereign stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityImperialGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityImperialAllowed(report) && report.sovereignExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r36_imperial_gate_block',
        'Imperial gate denied when sovereign pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 48, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityImperialGate([pack], {
            memory: null,
            currentTurn: 48,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityImperialAllowed(report) && !report.sovereignReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r37_imperial_ready',
        'Imperial bundle ready when imperial gate and sovereign export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityImperialBundle([pack], params);
          return matchExplainabilityImperialReady(bundle) && bundle.imperialAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r37_imperial_held',
        'Imperial bundle pending when imperial gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 49, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityImperialBundle([pack], {
            memory: null,
            currentTurn: 49,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityImperialReady(bundle) && !bundle.imperialAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r37_imperial_recovery',
        'Imperial recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 23, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 23, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildImperialRecoveryOrchestrator([pack], params);
          return report.imperialBlocked && imperialRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r37_sovereign_imperial_bridge',
        'Sovereign imperial bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditSovereignImperialBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sovereignImperialBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r37_imperial_export',
        'Imperial export shipped when imperial ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionImperialExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionImperialExportShipped(bundle) && bundle.imperialSchema === 'agent19.imperial.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r37_dominion_gate_ok',
        'Dominion gate allowed on healthy imperial stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityDominionGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityDominionAllowed(report) && report.imperialExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r37_dominion_gate_block',
        'Dominion gate denied when imperial pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 50, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityDominionGate([pack], {
            memory: null,
            currentTurn: 50,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityDominionAllowed(report) && !report.imperialReady || JSON.stringify(report);
        },
      ],
      [
        'a19_r38_dominion_ready',
        'Dominion bundle ready when dominion gate and imperial export pass',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const params = { memory: mem, currentTurn: 1, relationship: rel, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const bundle = buildMatchExplainabilityDominionBundle([pack], params);
          return matchExplainabilityDominionReady(bundle) && bundle.dominionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r38_dominion_held',
        'Dominion bundle pending when dominion gate fails',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 51, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const bundle = buildMatchExplainabilityDominionBundle([pack], {
            memory: null,
            currentTurn: 51,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityDominionReady(bundle) && !bundle.dominionAllowed || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r38_dominion_recovery',
        'Dominion recovery orchestrator lists steps when blocked',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 24, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const params = { memory: null, currentTurn: 24, decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }], minConfidenceBand: 'medium' as const, memoryInfluenceEnabled: true };
          const report = buildDominionRecoveryOrchestrator([pack], params);
          return report.dominionBlocked && dominionRecoveryOrchestratorWithinCap(report) && report.stepCount >= 1 || report.steps.join('|');
        },
      ],
      [
        'a19_r38_imperial_dominion_bridge',
        'Imperial dominion bridge healthy on full stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditImperialDominionBridge([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return imperialDominionBridgeHealthy(report) && report.aligned || JSON.stringify(report);
        },
      ],
      [
        'a19_r38_dominion_export',
        'Dominion export shipped when dominion ready',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const bundle = buildSessionDominionExportBundle([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return sessionDominionExportShipped(bundle) && bundle.dominionSchema === 'agent19.dominion.v1' || JSON.stringify(bundle);
        },
      ],
      [
        'a19_r38_hegemony_gate_ok',
        'Hegemony gate allowed on healthy dominion stack',
        () => {
          const rel = { actorId: 'player', trust: 85, grievance: 0, gratitude: 20, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, lastUpdatedTurn: 1 };
          const mem = createEmptyAiActorMemory('ai');
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [
            { type: 'sell', score: 7, memoryInfluence: 2, memoryInfluenceSlices: [{ horizon: 'short_term_match', delta: 2, reason: 'trust from prior deal' }] },
            { type: 'hold', score: 3 },
          ];
          const pack = buildTurnExplainabilityPack({ turn: 1, memoryBefore: mem, memoryAfter: mem, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHegemonyGate([pack], {
            memory: mem,
            currentTurn: 1,
            relationship: rel,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return matchExplainabilityHegemonyAllowed(report) && report.dominionExportShipped || JSON.stringify(report);
        },
      ],
      [
        'a19_r38_hegemony_gate_block',
        'Hegemony gate denied when dominion pending',
        () => {
          const decisionsBefore = [{ type: 'sell', score: 5 }, { type: 'hold', score: 3 }];
          const decisionsAfter = [{ type: 'sell', score: 7, memoryInfluence: 2 }];
          const pack = buildTurnExplainabilityPack({ turn: 52, memoryBefore: null, memoryAfter: null, decisionsBefore, decisionsAfter });
          const report = auditMatchExplainabilityHegemonyGate([pack], {
            memory: null,
            currentTurn: 52,
            decisionsByTurn: [{ before: decisionsBefore, after: decisionsAfter }],
            minConfidenceBand: 'medium',
            memoryInfluenceEnabled: true,
          });
          return !matchExplainabilityHegemonyAllowed(report) && !report.dominionReady || JSON.stringify(report);
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
