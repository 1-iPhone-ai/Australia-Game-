/** Read-only study excerpt: V9.4 lines 15–1030 (SECTION 1B). */
// ---- AI Memory (match memory) ------------------------------------------------------------------

export const AI_MEMORY_EVENT_CAP = 60;

export interface MemoryActorRef { id: string; teamId?: string | null; kind?: string; isAi?: boolean; isHuman?: boolean }

export interface AiMemoryPersonalityScale { hostilityReaction: number; supportReaction: number; respectSensitivity: number; aggressionBias: number }

export interface CommittedMemoryAction {
  actionType: string;
  actorId: string;
  targetId?: string | null;
  regionId?: string | null;
  success?: boolean;
  turn?: number;
  summary: string;
  stableKey?: string;
  amount?: number;
  [key: string]: unknown;
}

export interface AiMemoryEvent {
  id: string;
  turn: number;
  actionType: string;
  actorId: string;
  targetId: string | null;
  regionId: string | null;
  summary: string;
  importance: number;
  valence: number;      // -1 hostile … +1 helpful, from the owner's point of view
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

export interface AiBelief { key: string; value: number; confidence: number; observations: number; opportunityCount: number; source: 'match' | 'persistent_prior' }

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

export type AiMemoriesByActor = Record<string, AiActorMemory>;

const MEM_BELIEF_KEYS = ['aggressive', 'expansion', 'economic', 'cooperative'] as const;
const memClamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n * 100) / 100));
const memNum = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

export function resolveAiMemoryActorId(actorId?: string | null): string {
  if (actorId === null || actorId === undefined) return '';
  return String(actorId).trim();
}

export function isAiActor(actor: { id?: string | number; kind?: string; isAi?: boolean; isHuman?: boolean } | null | undefined): boolean {
  if (!actor) return false;
  if (actor.isHuman === true || actor.kind === 'human') return false;
  if (actor.isAi === true || actor.kind === 'ai') return true;
  return String(actor.id) !== 'player';
}

function createEmptyAiActorMemory(ownerActorId: string): AiActorMemory {
  return { ownerActorId, events: [], relationships: {}, opponentModels: {}, adaptivePlan: null, seenKeys: [], lastDecayTurn: 0 };
}

function createRelationship(actorId: string, turn: number): AiRelationship {
  return { actorId, trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50, threat: 0, grievance: 0, gratitude: 0, lastUpdatedTurn: turn };
}

function createOpponentModel(actorId: string): AiOpponentModel {
  return { actorId, totalOpportunities: 0, beliefs: {}, regionalInterest: {}, predictedObjectives: [] };
}

export function createFreshAiMemories(actorIds: string[]): AiMemoriesByActor {
  const out: AiMemoriesByActor = {};
  (actorIds || []).forEach(id => { const key = resolveAiMemoryActorId(id); if (key) out[key] = createEmptyAiActorMemory(key); });
  return out;
}

export function clearAllAiMemories(actorIds: string[]): AiMemoriesByActor {
  return createFreshAiMemories(actorIds);
}

export function ensureAiMemoriesForActors(memories: AiMemoriesByActor | null | undefined, actorIds: string[]): AiMemoriesByActor {
  const out: AiMemoriesByActor = { ...(memories || {}) };
  (actorIds || []).forEach(id => { const key = resolveAiMemoryActorId(id); if (key && !out[key]) out[key] = createEmptyAiActorMemory(key); });
  return out;
}

/** Save/load safe: anything malformed becomes an empty memory; sizes stay bounded. */
export function migrateAiMemoriesFromSave(raw: unknown): AiMemoriesByActor {
  const out: AiMemoriesByActor = {};
  if (!raw || typeof raw !== 'object') return out;
  Object.entries(raw as Record<string, any>).slice(0, 12).forEach(([id, m]) => {
    if (!m || typeof m !== 'object') return;
    const mem = createEmptyAiActorMemory(String(m.ownerActorId || id));
    mem.events = (Array.isArray(m.events) ? m.events : []).filter((e: any) => e && typeof e === 'object').slice(-AI_MEMORY_EVENT_CAP).map((e: any, i: number) => ({
      id: String(e.id || `mem_${id}_${i}`), turn: memNum(e.turn), actionType: String(e.actionType || 'event'), actorId: String(e.actorId || ''), targetId: e.targetId ? String(e.targetId) : null,
      regionId: e.regionId ? String(e.regionId) : null, summary: String(e.summary || ''), importance: memNum(e.importance, 1), valence: memNum(e.valence), stableKey: String(e.stableKey || e.id || `${id}_${i}`)
    }));
    if (m.relationships && typeof m.relationships === 'object') {
      Object.entries(m.relationships as Record<string, any>).slice(0, 12).forEach(([rid, r]) => {
        if (!r || typeof r !== 'object') return;
        const base = createRelationship(rid, memNum(r.lastUpdatedTurn));
        mem.relationships[rid] = { ...base, ...Object.fromEntries(['trust', 'respect', 'rivalry', 'reliability', 'cooperation', 'threat', 'grievance', 'gratitude'].map(k => [k, memClamp(memNum(r[k], (base as any)[k]))])), actorId: rid };
      });
    }
    if (m.opponentModels && typeof m.opponentModels === 'object') {
      Object.entries(m.opponentModels as Record<string, any>).slice(0, 12).forEach(([oid, om]) => {
        if (!om || typeof om !== 'object') return;
        const model = createOpponentModel(oid);
        model.totalOpportunities = memNum(om.totalOpportunities);
        if (om.beliefs && typeof om.beliefs === 'object') Object.entries(om.beliefs as Record<string, any>).forEach(([k, b]) => { if (b && typeof b === 'object') model.beliefs[k] = { key: k, value: memClamp(memNum(b.value), 0, 1), confidence: memClamp(memNum(b.confidence), 0, 1), observations: memNum(b.observations), opportunityCount: memNum(b.opportunityCount), source: b.source === 'persistent_prior' ? 'persistent_prior' : 'match' }; });
        if (om.regionalInterest && typeof om.regionalInterest === 'object') Object.entries(om.regionalInterest as Record<string, any>).slice(0, 12).forEach(([r, v]) => { model.regionalInterest[r] = memNum(v); });
        model.predictedObjectives = (Array.isArray(om.predictedObjectives) ? om.predictedObjectives : []).slice(0, 4).map((p: any) => ({ objectiveId: String(p?.objectiveId || ''), probability: memClamp(memNum(p?.probability), 0, 1), confidence: memClamp(memNum(p?.confidence), 0, 1) }));
        mem.opponentModels[oid] = model;
      });
    }
    if (m.adaptivePlan && typeof m.adaptivePlan === 'object') mem.adaptivePlan = { objectiveId: String(m.adaptivePlan.objectiveId || ''), status: ['active', 'revised', 'abandoned'].includes(m.adaptivePlan.status) ? m.adaptivePlan.status : 'active', revisionReason: m.adaptivePlan.revisionReason ? String(m.adaptivePlan.revisionReason) : null };
    mem.seenKeys = (Array.isArray(m.seenKeys) ? m.seenKeys : mem.events.map(e => e.stableKey)).map(String).slice(-AI_MEMORY_EVENT_CAP * 2);
    mem.lastDecayTurn = memNum(m.lastDecayTurn);
    out[resolveAiMemoryActorId(id)] = mem;
  });
  return out;
}

/** How an action reads from an observer's point of view (hostile, helpful, neutral). */
function classifyMemoryAction(actionType: string): { category: typeof MEM_BELIEF_KEYS[number] | null; hostility: number; support: number } {
  const t = String(actionType || '').toLowerCase();
  if (/sabotag|steal|attack|hostile|undercut|block/.test(t)) return { category: 'aggressive', hostility: 1, support: 0 };
  if (/challenge/.test(t)) return { category: 'aggressive', hostility: 0.3, support: 0 };
  if (/deposit|region|control|expand|claim|travel|expedition/.test(t)) return { category: 'expansion', hostility: 0.35, support: 0 };
  if (/support|gift|fund|assist|help|proposal_accepted|share|donat/.test(t)) return { category: 'cooperative', hostility: 0, support: 1 };
  if (/proposal_declined|reject|revoke/.test(t)) return { category: 'cooperative', hostility: 0.25, support: 0 };
  if (/sell|buy|invest|work|craft|trade|contract|market|loan|cash/.test(t)) return { category: 'economic', hostility: 0, support: 0 };
  return { category: null, hostility: 0, support: 0 };
}

function updateBelief(model: AiOpponentModel, category: string | null, regionId: string | null) {
  model.totalOpportunities += 1;
  MEM_BELIEF_KEYS.forEach(key => {
    const b = model.beliefs[key] || { key, value: 0.25, confidence: 0, observations: 0, opportunityCount: 0, source: 'match' as const };
    const hit = key === category ? 1 : 0;
    const opp = b.opportunityCount + 1;
    const obs = b.observations + hit;
    // Deterministic running estimate with a weak prior so early observations do not swing wildly.
    const value = (obs + 1) / (opp + 4);
    model.beliefs[key] = { key, value: memClamp(value, 0, 1), confidence: memClamp(1 - 1 / Math.sqrt(opp + 1), 0, 1), observations: obs, opportunityCount: opp, source: b.source === 'persistent_prior' && opp < 4 ? 'persistent_prior' : 'match' };
  });
  if (regionId) model.regionalInterest[regionId] = (model.regionalInterest[regionId] || 0) + 1;
  const ranked = MEM_BELIEF_KEYS.map(k => model.beliefs[k]).filter(Boolean).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
  const topRegion = Object.entries(model.regionalInterest).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  model.predictedObjectives = ranked.slice(0, 2).map(b => ({
    objectiveId: b.key === 'expansion' && topRegion ? `expand_${topRegion[0]}` : b.key === 'aggressive' ? 'pressure_rivals' : b.key === 'economic' ? 'build_cash' : 'coordinate_team',
    probability: b.value, confidence: b.confidence
  }));
}

/** Record one committed action in every AI observer's memory (the actor never "remembers" itself). */
export function applyCommittedActionToAiMemories(
  memories: AiMemoriesByActor,
  action: CommittedMemoryAction,
  observers: MemoryActorRef[],
  context?: { actorTeamId?: string | null; personalityByActor?: Record<string, AiMemoryPersonalityScale> }
): AiMemoriesByActor {
  const actorId = resolveAiMemoryActorId(action.actorId);
  if (!actorId) return memories;
  const turn = memNum(action.turn);
  const cls = classifyMemoryAction(action.actionType);
  const stableKey = String(action.stableKey || `${action.actionType}:${actorId}:${action.targetId || ''}:${action.regionId || ''}:${turn}`);
  const out: AiMemoriesByActor = { ...memories };
  (observers || []).filter(o => isAiActor(o)).forEach(observer => {
    const ownerId = resolveAiMemoryActorId(observer.id);
    if (!ownerId || ownerId === actorId) return;
    const prev = out[ownerId] || createEmptyAiActorMemory(ownerId);
    if (prev.seenKeys.includes(stableKey)) return;   // idempotent: the same action is never remembered twice
    const sameTeam = Boolean(context?.actorTeamId && observer.teamId && context.actorTeamId === observer.teamId);
    const targetsObserver = resolveAiMemoryActorId(action.targetId || '') === ownerId;
    const p = context?.personalityByActor?.[ownerId] || { hostilityReaction: 1, supportReaction: 1, respectSensitivity: 1, aggressionBias: 1 };
    // Valence from the observer's side: a rival's expansion is mildly hostile, a teammate's is helpful.
    let valence = cls.support - cls.hostility * (targetsObserver ? 1 : sameTeam ? -0.5 : 0.5);
    if (sameTeam && cls.category === 'expansion') valence = 0.3;
    if (action.success === false) valence *= 0.5;
    const importance = Math.max(1, Math.round((Math.abs(valence) * 3 + (targetsObserver ? 2 : 0) + (memNum(action.amount) >= 1000 ? 1 : 0)) * 10) / 10);
    const event: AiMemoryEvent = { id: `mem_${ownerId}_${stableKey}`.slice(0, 120), turn, actionType: String(action.actionType), actorId, targetId: action.targetId ? String(action.targetId) : null, regionId: action.regionId ? String(action.regionId) : null, summary: String(action.summary || action.actionType).slice(0, 200), importance, valence: Math.round(valence * 100) / 100, stableKey };
    const rel = { ...(prev.relationships[actorId] || createRelationship(actorId, turn)) };
    if (valence < 0) {
      const h = -valence * p.hostilityReaction;
      rel.trust = memClamp(rel.trust - 6 * h); rel.rivalry = memClamp(rel.rivalry + 8 * h); rel.threat = memClamp(rel.threat + 6 * h); rel.grievance = memClamp(rel.grievance + (targetsObserver ? 10 : 4) * h);
    } else if (valence > 0) {
      const s = valence * p.supportReaction;
      rel.trust = memClamp(rel.trust + 5 * s); rel.cooperation = memClamp(rel.cooperation + 6 * s); rel.gratitude = memClamp(rel.gratitude + (targetsObserver ? 8 : 3) * s); rel.reliability = memClamp(rel.reliability + 3 * s);
    }
    if (action.success === true && cls.category) rel.respect = memClamp(rel.respect + 2 * p.respectSensitivity);
    rel.lastUpdatedTurn = turn;
    const models = { ...prev.opponentModels };
    if (!sameTeam) { const m = JSON.parse(JSON.stringify(models[actorId] || createOpponentModel(actorId))) as AiOpponentModel; updateBelief(m, cls.category, event.regionId); models[actorId] = m; }
    const events = [...prev.events, event].slice(-AI_MEMORY_EVENT_CAP);
    const top = models[actorId]?.predictedObjectives[0];
    const adaptivePlan = !sameTeam && top ? { objectiveId: `counter_${top.objectiveId}`, status: (prev.adaptivePlan && prev.adaptivePlan.objectiveId !== `counter_${top.objectiveId}` ? 'revised' : 'active') as 'active' | 'revised', revisionReason: prev.adaptivePlan && prev.adaptivePlan.objectiveId !== `counter_${top.objectiveId}` ? `${actorId} now looks focused on ${top.objectiveId.replace(/_/g, ' ')}` : null } : prev.adaptivePlan;
    out[ownerId] = { ...prev, events, relationships: { ...prev.relationships, [actorId]: rel }, opponentModels: models, adaptivePlan, seenKeys: [...prev.seenKeys, stableKey].slice(-AI_MEMORY_EVENT_CAP * 2) };
  });
  return out;
}

/** Emotional scores fade over time; idempotent per turn. */
export function applyTurnDecayToAiMemories(memories: AiMemoriesByActor, turn: number): AiMemoriesByActor {
  const out: AiMemoriesByActor = {};
  Object.entries(memories || {}).forEach(([id, m]) => {
    if (!m) return;
    const elapsed = Math.max(0, memNum(turn) - memNum(m.lastDecayTurn));
    if (!elapsed) { out[id] = m; return; }
    const f = Math.pow(0.95, Math.min(elapsed, 20));
    const relationships: Record<string, AiRelationship> = {};
    Object.entries(m.relationships || {}).forEach(([rid, r]) => { relationships[rid] = { ...r, grievance: memClamp(r.grievance * f), gratitude: memClamp(r.gratitude * f), threat: memClamp(r.threat * f), rivalry: memClamp(r.rivalry * Math.pow(0.98, Math.min(elapsed, 20))) }; });
    out[id] = { ...m, relationships, lastDecayTurn: memNum(turn) };
  });
  return out;
}

export function recordTeamInstructionMemory(memories: AiMemoriesByActor, params: { actorId: string; targetId?: string; teamId?: string | null; status: 'issued' | 'accepted' | 'rejected' | 'revoked' | 'expired'; summary: string; regionId?: string; stableKey: string; turn?: number; observers?: MemoryActorRef[] }): AiMemoriesByActor {
  const target = resolveAiMemoryActorId(params.targetId || '');
  const observers = (params.observers || []).filter(o => isAiActor(o) && (!target || resolveAiMemoryActorId(o.id) === target));
  const type = params.status === 'accepted' ? 'instruction_accepted' : params.status === 'rejected' || params.status === 'revoked' ? 'instruction_revoked' : 'instruction_issued';
  return applyCommittedActionToAiMemories(memories, { actionType: params.status === 'accepted' ? 'support_instruction' : type, actorId: params.actorId, targetId: params.targetId, regionId: params.regionId, turn: params.turn, summary: params.summary, stableKey: `instruction:${params.stableKey}` }, observers.length ? observers : (params.observers || []), { actorTeamId: params.teamId || null });
}

/** Agent 19 / V9.4: honest long vs short memory labels (rule-based, not ML). */
export type AiMemoryHorizon = 'short_term_match' | 'long_term_prior' | 'team_directive';

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

const memActorLabel = (actorId: string) => (actorId === 'player' ? 'you' : actorId);

/** Summarize what is match-local vs cross-match prior for inspection and decision traces. */
export function buildAiMemoryHorizonSnapshot(
  memory: AiActorMemory | null | undefined,
  opts?: { persistentMemoryEnabled?: boolean }
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
  const qualityNote = longTermPriorBeliefCount > 0 && persistentOn
    ? 'Cross-match priors (saved on this device) nudge expectations; committed actions in this match still update relationships and observed tendencies.'
    : matchLearnedObservationCount > 0 || m.events.length > 0
      ? 'Only this match\'s committed events, relationship scores, and observed actions feed memory influence right now.'
      : 'Memory influence is idle until committed actions are recorded this match.';
  return {
    shortTermEventCount: m.events.length,
    shortTermRelationshipCount: Object.keys(m.relationships || {}).length,
    matchLearnedObservationCount,
    longTermPriorBeliefCount,
    longTermPriorActive: persistentOn && longTermPriorBeliefCount > 0,
    qualityNote,
    explainabilityDisclaimer: 'Deterministic, capped score adjustments from stored facts — not a neural model. Memory never removes legal options.'
  };
}

function pushMemorySlice(slices: AiMemoryInfluenceSlice[], horizon: AiMemoryHorizon, delta: number, reason: string) {
  if (!delta || !reason) return;
  slices.push({ horizon, delta: Math.round(delta * 100) / 100, reason });
}

/** Memory as a bounded scoring input (never a veto). Directives from the team plan add small bonuses. */
export function applyAiMemoryInfluence<T extends { type?: string; score?: number; data?: any; plan?: any; memoryReasons?: string[]; memoryInfluence?: number; memoryInfluenceSlices?: AiMemoryInfluenceSlice[] }>(decisions: T[], ctx: {
  actorId: string;
  memory?: AiActorMemory | null;
  settings?: { aiMemoryEnabled?: boolean; aiMemoryInfluenceStrength?: number; aiStrategicLearningEnabled?: boolean; aiStrategicLearningStrength?: number; aiPersistentMemoryEnabled?: boolean };
  activeDirectives?: Array<{ type?: string; assignedActorId?: string | null; regionId?: string; targetActorId?: string }>;
  personality?: AiMemoryPersonalityScale;
}): T[] {
  if (!Array.isArray(decisions) || !decisions.length) return decisions;
  const enabled = ctx.settings?.aiMemoryEnabled !== false;
  const strengthRaw = memNum(ctx.settings?.aiMemoryInfluenceStrength, 1);
  const strength = Math.max(0, Math.min(2, strengthRaw > 2 ? strengthRaw / 100 : strengthRaw));
  const learning = ctx.settings?.aiStrategicLearningEnabled === false ? 0 : Math.max(0, Math.min(2, memNum(ctx.settings?.aiStrategicLearningStrength, 1)));
  const persistentOn = ctx.settings?.aiPersistentMemoryEnabled === true;
  const directives = (ctx.activeDirectives || []).filter(d => !d.assignedActorId || d.assignedActorId === ctx.actorId);
  const mem = enabled ? ctx.memory || null : null;
  if (!mem && !directives.length) return decisions;
  return decisions.map(d => {
    const data = d.data || {};
    const region: string | undefined = data.region || data.regionId || data.targetRegion || d.plan?.target;
    const target: string | undefined = data.targetActorId || data.targetId || data.target;
    const baseScore = d.score || 0;
    let bonus = 0;
    const slices: AiMemoryInfluenceSlice[] = [];
    directives.forEach(dir => {
      if (dir.regionId && region === dir.regionId) {
        const delta = 25;
        bonus += delta;
        pushMemorySlice(slices, 'team_directive', delta, `Team plan targets ${dir.regionId} (+${delta} score input).`);
      }
      if (dir.targetActorId && target === dir.targetActorId) {
        const delta = 15;
        bonus += delta;
        pushMemorySlice(slices, 'team_directive', delta, `Team plan focuses on ${memActorLabel(dir.targetActorId)} (+${delta} score input).`);
      }
    });
    if (mem) {
      const targetId = target ? resolveAiMemoryActorId(target) : '';
      const rel = targetId ? mem.relationships[targetId] : undefined;
      const hostile = /sabotag|challenge|attack|steal/.test(String(d.type || ''));
      const helpful = /support|gift|fund|proposal|assist/.test(String(d.type || ''));
      if (rel && hostile) {
        const delta = ((rel.rivalry + rel.grievance) / 10 - rel.gratitude / 8) * strength * (ctx.personality?.hostilityReaction ?? 1);
        bonus += delta;
        pushMemorySlice(
          slices,
          'short_term_match',
          delta,
          `This match: rivalry ${rel.rivalry.toFixed(0)} and grievance ${rel.grievance.toFixed(0)} toward ${memActorLabel(targetId)} ${delta >= 0 ? 'favor' : 'discourage'} hostile options.`
        );
      }
      if (rel && helpful) {
        const delta = ((rel.trust - 50) / 5 + rel.gratitude / 10) * strength * (ctx.personality?.supportReaction ?? 1);
        bonus += delta;
        pushMemorySlice(
          slices,
          'short_term_match',
          delta,
          `This match: trust ${rel.trust.toFixed(0)} and gratitude ${rel.gratitude.toFixed(0)} toward ${memActorLabel(targetId)} ${delta >= 0 ? 'favor' : 'discourage'} supportive options.`
        );
      }
      if (learning && region) {
        const interest = Object.values(mem.opponentModels).reduce((s, m) => s + (m.regionalInterest[region] || 0), 0);
        const delta = Math.min(20, interest * 3) * learning * 0.5;
        bonus += delta;
        if (delta) {
          pushMemorySlice(
            slices,
            'short_term_match',
            delta,
            `This match: observed rival focus on ${region} (${interest} logged actions) nudges contesting that region.`
          );
        }
      }
      if (persistentOn && targetId && hostile) {
        const om = mem.opponentModels[targetId];
        const priorAgg = om?.beliefs?.aggressive;
        if (priorAgg && priorAgg.source === 'persistent_prior' && priorAgg.confidence >= 0.2 && (om.totalOpportunities || 0) < 6) {
          const delta = Math.min(6, priorAgg.value * priorAgg.confidence * 8) * strength * 0.35;
          bonus += delta;
          pushMemorySlice(
            slices,
            'long_term_prior',
            delta,
            `Earlier matches (saved prior): expected ${memActorLabel(targetId)} to stay aggressive — small extra weight until this match observes more.`
          );
        }
      }
    }
    if (!bonus) return d;
    const memoryInfluence = Math.round(bonus * 100) / 100;
    const memoryReasons = slices.map(s => s.reason).slice(0, 5);
    return {
      ...d,
      score: Math.round((baseScore + memoryInfluence) * 100) / 100,
      memoryInfluence,
      memoryReasons,
      memoryInfluenceSlices: slices
    };
  });
}


/** Negotiation: trust/gratitude lower the acceptance bar, grievance raises it; a shared threat helps. */
export function computeNegotiationThresholdShift(rel: Partial<AiRelationship> | null | undefined, ctx: { dealAffordable?: boolean; thirdPartyThreat?: number }): { shift: number; reasons: string[] } {
  const reasons: string[] = [];
  let shift = 0;
  if (rel) {
    const trust = memNum(rel.trust, 50); const grievance = memNum(rel.grievance); const gratitude = memNum(rel.gratitude);
    if (trust > 60) { shift -= (trust - 60) / 400; reasons.push('trusts this counterpart'); }
    if (trust < 40) { shift += (40 - trust) / 400; reasons.push('distrusts this counterpart'); }
    if (grievance > 10) { shift += Math.min(0.1, grievance / 300); reasons.push('holds a grievance'); }
    if (gratitude > 10) { shift -= Math.min(0.08, gratitude / 400); reasons.push('is grateful for past help'); }
  }
  if (memNum(ctx.thirdPartyThreat) > 40 && ctx.dealAffordable) { shift -= 0.04; reasons.push('a common threat makes a deal attractive'); }
  return { shift: Math.max(-0.2, Math.min(0.2, Math.round(shift * 1000) / 1000)), reasons };
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
  strategicProfiles: Array<{ actorId: string; aggressionPreference: number; expansionPreference: number; economicPreference: number; cooperationPreference: number; confidence: number; observationCount: number }>;
  opponentModels?: AiOpponentModel[];
  adaptivePlan: AiActorMemory['adaptivePlan'];
}

/** Inspection respects authority: rivals' private beliefs stay hidden without Full Inspection. */
export function getFilteredAiMemoryInspectionView(memory: AiActorMemory | null | undefined, opts: { viewerId?: string; viewerTeamId?: string | null; ownerTeamId?: string | null; teammateIds?: string[]; fullInspection?: boolean; persistentMemoryEnabled?: boolean }): AiMemoryInspectionView {
  const m = memory || createEmptyAiActorMemory('');
  const ally = Boolean(opts.fullInspection) || Boolean(opts.viewerTeamId && opts.ownerTeamId && opts.viewerTeamId === opts.ownerTeamId);
  const redacted = !ally;
  const rels = Object.values(m.relationships).sort((a, b) => a.actorId.localeCompare(b.actorId));
  const profiles = Object.values(m.opponentModels).map(om => ({
    actorId: om.actorId,
    aggressionPreference: om.beliefs.aggressive?.value ?? 0, expansionPreference: om.beliefs.expansion?.value ?? 0, economicPreference: om.beliefs.economic?.value ?? 0, cooperationPreference: om.beliefs.cooperative?.value ?? 0,
    confidence: Math.max(0, ...Object.values(om.beliefs).map(b => b.confidence)), observationCount: om.totalOpportunities
  }));
  const strongest = rels.slice().sort((a, b) => (b.rivalry + b.grievance) - (a.rivalry + a.grievance))[0];
  const horizonSnapshot = buildAiMemoryHorizonSnapshot(m, { persistentMemoryEnabled: opts.persistentMemoryEnabled });
  return {
    ownerActorId: m.ownerActorId,
    isRedacted: redacted,
    eventCount: m.events.length,
    horizonSnapshot,
    influenceSummary: strongest && (strongest.rivalry + strongest.grievance) > 10 ? `Most wary of ${strongest.actorId} (rivalry ${strongest.rivalry}, grievance ${strongest.grievance}).` : m.events.length ? 'Memory is shaping choices only lightly so far.' : null,
    recentEvents: (redacted ? m.events.filter(e => Math.abs(e.valence) >= 0.3) : m.events).slice(-8).reverse(),
    relationships: redacted ? rels.filter(r => (opts.teammateIds || []).includes(r.actorId) || r.actorId === opts.viewerId) : rels,
    majorGrievances: m.events.filter(e => e.valence <= -0.6).slice(-4).reverse(),
    majorGratitude: m.events.filter(e => e.valence >= 0.6).slice(-4).reverse(),
    strategicProfiles: redacted ? [] : profiles,
    opponentModels: redacted ? [] : Object.values(m.opponentModels),
    adaptivePlan: redacted ? null : m.adaptivePlan
  };
}

type MemTestResult = { id: string; name: string; passed: boolean; detail?: string };
const memTests = (cases: Array<[string, string, () => boolean | string]>): { results: MemTestResult[] } => ({
  results: cases.map(([id, name, fn]) => { try { const r = fn(); return { id, name, passed: r === true, detail: r === true ? undefined : String(r) }; } catch (e) { return { id, name, passed: false, detail: e instanceof Error ? e.message : String(e) }; } })
});
const MEM_OBS: MemoryActorRef[] = [{ id: 'player', kind: 'human', teamId: 'team_player' }, { id: 'ai', kind: 'ai', teamId: 'team_opponent' }, { id: 'ally_ai', kind: 'ai', teamId: 'team_player' }];

export function runAiMemoryPhase1SelfTests() {
  return memTests([
    ['p1_fresh', 'Fresh memories are empty and keyed by actor', () => { const m = createFreshAiMemories(['ai', 'ally_ai']); return Object.keys(m).join(',') === 'ai,ally_ai' && m.ai.events.length === 0 || JSON.stringify(Object.keys(m)); }],
    ['p1_record', 'A committed action is remembered by AI observers only', () => { const m = applyCommittedActionToAiMemories(createFreshAiMemories(['ai', 'ally_ai']), { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 3, summary: 'player sabotaged ai', stableKey: 'k1' }, MEM_OBS); return m.ai.events.length === 1 && !m.player || 'not recorded'; }],
    ['p1_idempotent', 'The same action is never remembered twice', () => { let m = createFreshAiMemories(['ai']); const a = { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 3, summary: 's', stableKey: 'dup' }; m = applyCommittedActionToAiMemories(m, a, MEM_OBS); m = applyCommittedActionToAiMemories(m, a, MEM_OBS); return m.ai.events.length === 1 || `${m.ai.events.length} events`; }],
    ['p1_cap', 'Event history is bounded', () => { let m = createFreshAiMemories(['ai']); for (let i = 0; i < AI_MEMORY_EVENT_CAP + 10; i++) m = applyCommittedActionToAiMemories(m, { actionType: 'sell', actorId: 'player', turn: i, summary: 's', stableKey: `c${i}` }, MEM_OBS); return m.ai.events.length === AI_MEMORY_EVENT_CAP || `${m.ai.events.length}`; }]
  ]);
}

export function runAiMemoryPhase2SelfTests() {
  return memTests([
    ['p2_hostile', 'Hostility lowers trust and raises grievance', () => { const m = applyCommittedActionToAiMemories(createFreshAiMemories(['ai']), { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'h' }, MEM_OBS); const r = m.ai.relationships.player; return r.trust < 50 && r.grievance > 0 || JSON.stringify(r); }],
    ['p2_support', 'Support raises trust and gratitude', () => { const m = applyCommittedActionToAiMemories(createFreshAiMemories(['ally_ai']), { actionType: 'support', actorId: 'player', targetId: 'ally_ai', turn: 1, summary: 's', stableKey: 's' }, MEM_OBS, { actorTeamId: 'team_player' }); const r = m.ally_ai.relationships.player; return r.trust > 50 && r.gratitude > 0 || JSON.stringify(r); }],
    ['p2_decay', 'Grievance decays over turns and decay is idempotent per turn', () => { let m = applyCommittedActionToAiMemories(createFreshAiMemories(['ai']), { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'd' }, MEM_OBS); const g0 = m.ai.relationships.player.grievance; m = applyTurnDecayToAiMemories(m, 10); const g1 = m.ai.relationships.player.grievance; m = applyTurnDecayToAiMemories(m, 10); return g1 < g0 && m.ai.relationships.player.grievance === g1 || `${g0} → ${g1}`; }],
    ['p2_negotiation', 'Negotiation shift is bounded and follows trust', () => { const hi = computeNegotiationThresholdShift({ trust: 90 }, {}); const lo = computeNegotiationThresholdShift({ trust: 10, grievance: 50 }, {}); return hi.shift < 0 && lo.shift > 0 && Math.abs(lo.shift) <= 0.2 || JSON.stringify({ hi, lo }); }]
  ]);
}

export function runAiMemoryPhase3SelfTests() {
  return memTests([
    ['p3_model', 'Opponent models learn tendencies from observed actions', () => { let m = createFreshAiMemories(['ai']); for (let i = 0; i < 5; i++) m = applyCommittedActionToAiMemories(m, { actionType: 'region_deposit', actorId: 'player', regionId: 'NSW', turn: i, summary: 'd', stableKey: `m${i}` }, MEM_OBS); const om = m.ai.opponentModels.player; return om.beliefs.expansion.value > om.beliefs.economic.value && om.regionalInterest.NSW === 5 || JSON.stringify(om.beliefs); }],
    ['p3_redaction', 'Rival memory inspection hides private beliefs without Full Inspection', () => { let m = createFreshAiMemories(['ai']); m = applyCommittedActionToAiMemories(m, { actionType: 'region_deposit', actorId: 'player', regionId: 'NSW', turn: 1, summary: 'd', stableKey: 'r' }, MEM_OBS); const v = getFilteredAiMemoryInspectionView(m.ai, { viewerId: 'player', viewerTeamId: 'team_player', ownerTeamId: 'team_opponent' }); const f = getFilteredAiMemoryInspectionView(m.ai, { viewerId: 'player', viewerTeamId: 'team_player', ownerTeamId: 'team_opponent', fullInspection: true }); return v.isRedacted && v.strategicProfiles.length === 0 && !f.isRedacted && f.strategicProfiles.length === 1 || 'redaction failed'; }],
    ['p3_influence', 'Memory influence is bounded and never removes options', () => { let m = createFreshAiMemories(['ai']); m = applyCommittedActionToAiMemories(m, { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'i' }, MEM_OBS); const out = applyAiMemoryInfluence([{ type: 'sabotage', score: 10, data: { targetActorId: 'player' } }, { type: 'sell', score: 10 }], { actorId: 'ai', memory: m.ai }); return out.length === 2 && (out[0].score || 0) > 10 && out[1].score === 10 || JSON.stringify(out); }],
    ['p3_migrate', 'Save migration tolerates garbage', () => { const m = migrateAiMemoriesFromSave({ ai: { events: [null, { summary: 'x' }], relationships: { player: { trust: 'bad' } } }, bad: 5 }); return m.ai.events.length === 1 && m.ai.relationships.player.trust === 50 && !m.bad || JSON.stringify(m); }]
  ]);
}

// ---- Persistent AI Memory (cross-match, opt-in, local storage only) -------------------------------

export const PERSISTENT_MEMORY_STORAGE_KEY = 'australia-game.persistent-ai-memory.v1';
export const PERSISTENCE_POLICY_STORAGE_KEY = 'australia-game.persistent-ai-memory-policy.v1';
export const HUMAN_PROFILE_ID = 'human_player';
export const ENABLE_PERSISTENT_MEMORY_TITLE = 'Enable persistent AI memory?';
export const ENABLE_PERSISTENT_MEMORY_BODY = 'AI opponents will keep a small summary of how you play (tendencies, relationship scores, notable moments) in this browser’s local storage and use it as a capped prior in future matches. Nothing leaves your device. You can export, delete or turn this off at any time.';
export const DISABLE_PERSISTENT_MEMORY_TITLE = 'Disable persistent AI memory?';
export const DISABLE_PERSISTENT_MEMORY_BODY = 'Future matches will stop reading and writing persistent AI memory. Current-match memory is not erased. You can also delete the saved profiles now.';
export const DELETE_PERSISTENT_MEMORY_TITLE = 'Delete all persistent AI memory?';
export const DELETE_PERSISTENT_MEMORY_BODY = 'This permanently deletes every saved AI profile on this device. Current-match memory is not affected. This cannot be undone.';
export const IMPORT_PERSISTENT_MEMORY_TITLE = 'Import persistent AI memory?';
export const IMPORT_PERSISTENT_MEMORY_BODY = 'Importing replaces (or merges into) the AI profiles saved on this device. Automatic persistence is not switched on by importing.';

export interface PersistencePolicy {
  consent: boolean;
  storageMode: 'local_browser' | 'unavailable' | 'unverified';
  storageVerifiedAt?: number;
  profileSaveVerifiedAt?: number;
  profileLoadVerifiedAt?: number;
  lastSuccessfulWriteAt?: number;
  lastSuccessfulReadAt?: number;
  lastError: string | null;
}

export interface PersistentTendency { estimate: number; confidence: number; observations: number }

export interface PersistentProfile {
  profileId: string;
  actorId: string;
  rivalIdentityId: string;
  subjectProfileId: string;
  matchesObserved: number;
  wins: number;
  losses: number;
  draws: number;
  observationCount: number;
  confidence: number;
  aggressionPreference: number;
  expansionPreference: number;
  economicPreference: number;
  cooperationPreference: number;
  strategicTendencies: Record<string, PersistentTendency>;
  relationshipHistory: { trust: number; respect: number; rivalry: number; reliability: number; cooperation: number };
  notableMemories: Array<{ id: string; summary: string; importance: number; count: number }>;
  preferredTeamCoordination: string[];
  committedMatchIds: string[];
  lastUpdatedAt: number;
}

export interface PersistentStore { version: 1; profiles: Record<string, PersistentProfile>; committedMatchIds: string[]; updatedAt: number }

export interface PersistentActorIdentity { actorId: string; rivalIdentityId: string; profileKey: string; identityMode: 'recurring' | 'anonymous' }

export interface PersistentPriorSeed { beliefs: Record<string, { value: number; confidence: number }>; relationship: { trust: number; respect: number; rivalry: number; reliability: number; cooperation: number }; matchesObserved: number; preferredTeamCoordination?: string[] }

export interface PersistentMemorySnapshot {
  matchId: string;
  identityByActor: Record<string, PersistentActorIdentity>;
  priorsByActor: Record<string, PersistentPriorSeed>;
  importedProfileIds: string[];
  frozenAt: number;
}

let persistenceGeneration = 0;
let restoredStoreThisLoad = false;
let restoredProfilesThisLoad = false;

function persistStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch { return null; }
}

function defaultPersistencePolicy(): PersistencePolicy {
  return { consent: false, storageMode: 'unverified', storageVerifiedAt: undefined, profileSaveVerifiedAt: undefined, profileLoadVerifiedAt: undefined, lastSuccessfulWriteAt: undefined, lastSuccessfulReadAt: undefined, lastError: null };
}

export function loadPersistencePolicy(storage?: Storage | null, opts?: { markRestored?: boolean }): PersistencePolicy {
  const s = storage === undefined ? persistStorage() : storage;
  if (!s) return { ...defaultPersistencePolicy(), storageMode: 'unavailable' };
  try {
    const raw = s.getItem(PERSISTENCE_POLICY_STORAGE_KEY);
    if (!raw) return defaultPersistencePolicy();
    const p = JSON.parse(raw);
    const policy: PersistencePolicy = { ...defaultPersistencePolicy(), ...Object.fromEntries(Object.entries(p || {}).filter(([k, v]) => k in defaultPersistencePolicy() && v !== null)) } as PersistencePolicy;
    policy.consent = p?.consent === true;
    if (!['local_browser', 'unavailable', 'unverified'].includes(policy.storageMode)) policy.storageMode = 'unverified';
    if (opts?.markRestored && policy.consent) restoredProfilesThisLoad = true;
    return policy;
  } catch (e) {
    return { ...defaultPersistencePolicy(), lastError: e instanceof Error ? e.message : String(e) };
  }
}

function savePersistencePolicy(policy: PersistencePolicy, storage?: Storage | null): boolean {
  const s = storage === undefined ? persistStorage() : storage;
  if (!s) return false;
  try { s.setItem(PERSISTENCE_POLICY_STORAGE_KEY, JSON.stringify(policy)); return true; } catch { return false; }
}

export function isPersistenceConsentActive(policy: PersistencePolicy | null | undefined): boolean {
  return Boolean(policy && policy.consent && policy.storageMode === 'local_browser' && policy.storageVerifiedAt);
}

/** Persistence is ON only with explicit, verified consent — settings can never switch it on alone. */
export function applyPersistencePolicyToSettings<T extends { aiPersistentMemoryEnabled?: boolean }>(settings: T, policy: PersistencePolicy): T {
  if (!settings) return settings;
  if (!isPersistenceConsentActive(policy) && settings.aiPersistentMemoryEnabled) return { ...settings, aiPersistentMemoryEnabled: false };
  return settings;
}

export type PersistenceStatus = 'off' | 'on' | 'unavailable' | 'error' | 'warning' | 'write_failed' | 'read_failed' | 'verifying' | 'disabling' | 'deleting' | 'consent_required';

export function persistenceStatusFromPolicy(policy: PersistencePolicy): PersistenceStatus {
  if (policy.storageMode === 'unavailable') return 'unavailable';
  if (policy.lastError && !policy.consent) return 'error';
  if (isPersistenceConsentActive(policy)) return 'on';
  if (policy.consent) return 'consent_required';
  return 'off';
}

export function persistenceStatusLabel(status: string): string {
  switch (status) {
    case 'on': return 'ON — verified local storage';
    case 'unavailable': return 'Unavailable — this browser blocks storage';
    case 'error': return 'Error — see details';
    case 'warning': return 'Warning — see details';
    case 'write_failed': return 'Write failed';
    case 'read_failed': return 'Read failed';
    case 'verifying': return 'Verifying storage…';
    case 'disabling': return 'Disabling…';
    case 'deleting': return 'Deleting…';
    case 'consent_required': return 'Needs verification';
    default: return 'OFF';
  }
}

function emptyPersistentStore(): PersistentStore { return { version: 1, profiles: {}, committedMatchIds: [], updatedAt: 0 }; }

function sanitizePersistentProfile(key: string, p: any): PersistentProfile | null {
  if (!p || typeof p !== 'object') return null;
  const n = (v: unknown, d = 0) => memNum(v, d);
  const rh = p.relationshipHistory || {};
  return {
    profileId: String(p.profileId || key), actorId: String(p.actorId || ''), rivalIdentityId: String(p.rivalIdentityId || key), subjectProfileId: String(p.subjectProfileId || HUMAN_PROFILE_ID),
    matchesObserved: n(p.matchesObserved), wins: n(p.wins), losses: n(p.losses), draws: n(p.draws), observationCount: n(p.observationCount), confidence: memClamp(n(p.confidence), 0, 1),
    aggressionPreference: memClamp(n(p.aggressionPreference), 0, 1), expansionPreference: memClamp(n(p.expansionPreference), 0, 1), economicPreference: memClamp(n(p.economicPreference), 0, 1), cooperationPreference: memClamp(n(p.cooperationPreference), 0, 1),
    strategicTendencies: Object.fromEntries(Object.entries(p.strategicTendencies && typeof p.strategicTendencies === 'object' ? p.strategicTendencies : {}).slice(0, 8).map(([k, t]: [string, any]) => [k, { estimate: memClamp(n(t?.estimate), 0, 1), confidence: memClamp(n(t?.confidence), 0, 1), observations: n(t?.observations) }])),
    relationshipHistory: { trust: memClamp(n(rh.trust, 50)), respect: memClamp(n(rh.respect, 50)), rivalry: memClamp(n(rh.rivalry)), reliability: memClamp(n(rh.reliability, 50)), cooperation: memClamp(n(rh.cooperation, 50)) },
    notableMemories: (Array.isArray(p.notableMemories) ? p.notableMemories : []).slice(0, 8).map((m: any, i: number) => ({ id: String(m?.id || `nm_${i}`), summary: String(m?.summary || '').slice(0, 200), importance: n(m?.importance, 1), count: Math.max(1, n(m?.count, 1)) })),
    preferredTeamCoordination: (Array.isArray(p.preferredTeamCoordination) ? p.preferredTeamCoordination : []).slice(0, 6).map(String),
    committedMatchIds: (Array.isArray(p.committedMatchIds) ? p.committedMatchIds : []).slice(-50).map(String),
    lastUpdatedAt: n(p.lastUpdatedAt)
  };
}

function sanitizePersistentStore(raw: any): PersistentStore {
  const store = emptyPersistentStore();
  if (!raw || typeof raw !== 'object') return store;
  Object.entries(raw.profiles && typeof raw.profiles === 'object' ? raw.profiles : {}).slice(0, 50).forEach(([k, p]) => { const s = sanitizePersistentProfile(k, p); if (s) store.profiles[k] = s; });
  store.committedMatchIds = (Array.isArray(raw.committedMatchIds) ? raw.committedMatchIds : []).slice(-200).map(String);
  store.updatedAt = memNum(raw.updatedAt);
  return store;
}

export function loadPersistentStore(storage?: Storage | null): PersistentStore {
  const s = storage === undefined ? persistStorage() : storage;
  if (!s) return emptyPersistentStore();
  try {
    const raw = s.getItem(PERSISTENT_MEMORY_STORAGE_KEY);
    if (!raw) return emptyPersistentStore();
    const store = sanitizePersistentStore(JSON.parse(raw));
    if (Object.keys(store.profiles).length) restoredStoreThisLoad = true;
    return store;
  } catch { return emptyPersistentStore(); }
}

export function getPersistenceGeneration(): number { return persistenceGeneration; }
export function didRestorePersistentStoreThisLoad(): boolean { return restoredStoreThisLoad; }
export function didRestorePersistentProfilesThisLoad(): boolean { return restoredProfilesThisLoad; }

/** A write is only allowed while consent holds and no disable/delete happened since the commit began. */
export function assertPersistenceWriteAllowed(storage?: Storage | null, opts?: { purpose?: string; generation?: number }): boolean {
  const policy = loadPersistencePolicy(storage);
  if (opts?.purpose === 'commit' && !isPersistenceConsentActive(policy)) return false;
  if (typeof opts?.generation === 'number' && opts.generation !== persistenceGeneration) return false;
  return policy.storageMode !== 'unavailable';
}

export function savePersistentStore(store: PersistentStore, storage?: Storage | null, opts?: { purpose?: string; generation?: number }): boolean {
  const s = storage === undefined ? persistStorage() : storage;
  if (!s || !assertPersistenceWriteAllowed(s, opts)) return false;
  try {
    s.setItem(PERSISTENT_MEMORY_STORAGE_KEY, JSON.stringify({ ...store, updatedAt: Date.now() }));
    const policy = loadPersistencePolicy(s);
    savePersistencePolicy({ ...policy, lastSuccessfulWriteAt: Date.now(), lastError: null }, s);
    return true;
  } catch (e) {
    const policy = loadPersistencePolicy(s);
    savePersistencePolicy({ ...policy, lastError: e instanceof Error ? e.message : String(e) }, s);
    return false;
  }
}

function verifyStorageRoundTrip(s: Storage | null): { ok: boolean; error?: string } {
  if (!s) return { ok: false, error: 'This browser does not allow local storage here, so persistent AI memory cannot be used.' };
  try {
    const key = `${PERSISTENT_MEMORY_STORAGE_KEY}.probe`;
    const value = `probe:${Date.now()}`;
    s.setItem(key, value);
    const back = s.getItem(key);
    s.removeItem(key);
    return back === value ? { ok: true } : { ok: false, error: 'Storage read-back did not match.' };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : String(e) }; }
}

export function confirmEnableAndVerifyPersistentMemory(storage?: Storage | null): { policy: PersistencePolicy; verification: { ok: boolean; error?: string } } {
  const s = storage === undefined ? persistStorage() : storage;
  const verification = verifyStorageRoundTrip(s);
  const now = Date.now();
  const policy: PersistencePolicy = verification.ok
    ? { ...loadPersistencePolicy(s), consent: true, storageMode: 'local_browser', storageVerifiedAt: now, profileSaveVerifiedAt: now, profileLoadVerifiedAt: now, lastSuccessfulReadAt: now, lastSuccessfulWriteAt: now, lastError: null }
    : { ...loadPersistencePolicy(s), consent: false, storageMode: s ? 'unverified' : 'unavailable', lastError: verification.error || 'Verification failed.' };
  savePersistencePolicy(policy, s);
  persistenceGeneration += 1;
  return { policy, verification };
}

export function reverifyPersistentStorage(storage?: Storage | null): { policy: PersistencePolicy; verification: { ok: boolean; error?: string } } {
  const s = storage === undefined ? persistStorage() : storage;
  const verification = verifyStorageRoundTrip(s);
  const now = Date.now();
  const prev = loadPersistencePolicy(s);
  const policy: PersistencePolicy = verification.ok
    ? { ...prev, storageMode: 'local_browser', storageVerifiedAt: now, lastSuccessfulReadAt: now, lastError: null }
    : { ...prev, storageMode: s ? 'unverified' : 'unavailable', lastError: verification.error || 'Verification failed.' };
  savePersistencePolicy(policy, s);
  return { policy, verification };
}

export function disablePersistentMemory(storage?: Storage | null, opts?: { deleteProfiles?: boolean }): PersistencePolicy {
  const s = storage === undefined ? persistStorage() : storage;
  persistenceGeneration += 1;   // any in-flight commit is now stale and will not write
  const policy: PersistencePolicy = { ...loadPersistencePolicy(s), consent: false };
  savePersistencePolicy(policy, s);
  if (opts?.deleteProfiles && s) { try { s.removeItem(PERSISTENT_MEMORY_STORAGE_KEY); } catch { /* storage blocked */ } }
  return policy;
}

export function deletePersistentAiMemory(storage?: Storage | null): { ok: boolean; removed: number; error?: string } {
  const s = storage === undefined ? persistStorage() : storage;
  const removed = Object.keys(loadPersistentStore(s).profiles).length;
  persistenceGeneration += 1;
  if (!s) return { ok: false, removed: 0, error: 'Storage is unavailable.' };
  try { s.removeItem(PERSISTENT_MEMORY_STORAGE_KEY); return { ok: true, removed }; } catch (e) { return { ok: false, removed: 0, error: e instanceof Error ? e.message : String(e) }; }
}

export function persistResetAll(storage?: Storage | null) { return deletePersistentAiMemory(storage); }

export function persistResetProfile(profileId: string, storage?: Storage | null): boolean {
  const s = storage === undefined ? persistStorage() : storage;
  const store = loadPersistentStore(s);
  if (!store.profiles[profileId]) return false;
  delete store.profiles[profileId];
  persistenceGeneration += 1;
  if (!s) return false;
  try { s.setItem(PERSISTENT_MEMORY_STORAGE_KEY, JSON.stringify({ ...store, updatedAt: Date.now() })); return true; } catch { return false; }
}

export function peekLegacyProfileCount(storage?: Storage | null): number {
  return Object.keys(loadPersistentStore(storage).profiles).length;
}

function stableIdHash(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36);
}

export function createPersistentMatchId(seed: string): string { return `match_${stableIdHash(String(seed))}`; }

export function resolveActorIdentity(params: { actorId: string; characterName?: string; personality?: string; matchId: string; identityMode?: string; subjectProfileId?: string }): PersistentActorIdentity {
  const recurring = params.identityMode === 'recurring' && Boolean(params.characterName);
  const rivalIdentityId = recurring ? `rival:${String(params.characterName).toLowerCase().replace(/[^a-z0-9]+/g, '_')}:${params.personality || 'balanced'}` : `anon:${params.matchId}:${params.actorId}`;
  return { actorId: params.actorId, rivalIdentityId, profileKey: `${rivalIdentityId}|${params.subjectProfileId || HUMAN_PROFILE_ID}`, identityMode: recurring ? 'recurring' : 'anonymous' };
}

interface PersistCtx { settings?: any; selectedMode?: string; identityMode?: string; gameMode?: string; gameOver?: boolean; isLiveIntentMatch?: boolean; isolatedReplayRuntime?: boolean; isWhatIf?: boolean; policy?: PersistencePolicy }

function persistenceUsable(ctx: PersistCtx): boolean {
  return Boolean(ctx.settings?.aiPersistentMemoryEnabled) && ctx.identityMode === 'recurring' && ctx.isLiveIntentMatch !== false && !ctx.isolatedReplayRuntime && !ctx.isWhatIf && isPersistenceConsentActive(ctx.policy || loadPersistencePolicy());
}

export function shouldApplyPersistentPriors(ctx: PersistCtx): boolean { return persistenceUsable(ctx) && ctx.settings?.aiPersistentLearningEnabled !== false; }
export function shouldCommitPersistentMemory(ctx: PersistCtx): boolean { return persistenceUsable(ctx); }
export function shouldAskPersistentAbandon(ctx: PersistCtx): boolean {
  return persistenceUsable({ ...ctx, isLiveIntentMatch: true }) && ctx.gameMode === 'game' && !ctx.gameOver && ctx.settings?.aiPersistentAskOnAbandon !== false;
}

export function isMatchAlreadyCommitted(store: PersistentStore, matchId: string): boolean { return store.committedMatchIds.includes(matchId); }

/** Priors are capped so a previous match can only nudge, never dictate, this match's beliefs. */
export function profileToPriorSeed(profile: PersistentProfile, _subjectActorId: string): PersistentPriorSeed {
  const cap = (c: number) => Math.min(0.5, c);
  return {
    beliefs: {
      aggressive: { value: profile.aggressionPreference, confidence: cap(profile.confidence) },
      expansion: { value: profile.expansionPreference, confidence: cap(profile.confidence) },
      economic: { value: profile.economicPreference, confidence: cap(profile.confidence) },
      cooperative: { value: profile.cooperationPreference, confidence: cap(profile.confidence) }
    },
    relationship: { ...profile.relationshipHistory },
    matchesObserved: profile.matchesObserved,
    preferredTeamCoordination: profile.preferredTeamCoordination.slice(0, 3)
  };
}

export function applyPriorsToFreshMemories(memories: AiMemoriesByActor, priorsByActor: Record<string, PersistentPriorSeed>): AiMemoriesByActor {
  const out: AiMemoriesByActor = { ...memories };
  Object.entries(priorsByActor || {}).forEach(([actorId, prior]) => {
    const mem = out[actorId] ? { ...out[actorId] } : createEmptyAiActorMemory(actorId);
    const model = createOpponentModel('player');
    Object.entries(prior.beliefs).forEach(([key, b]) => { model.beliefs[key] = { key, value: memClamp(b.value, 0, 1), confidence: memClamp(b.confidence, 0, 1), observations: 0, opportunityCount: 0, source: 'persistent_prior' }; });
    mem.opponentModels = { ...mem.opponentModels, player: model };
    mem.relationships = { ...mem.relationships, player: { ...createRelationship('player', 0), ...prior.relationship, actorId: 'player' } };
    out[actorId] = mem;
  });
  return out;
}

export function freezePersistentSnapshot(params: { matchId: string; identityByActor: Record<string, PersistentActorIdentity>; priorsByActor: Record<string, PersistentPriorSeed>; importedProfileIds: string[] }): PersistentMemorySnapshot {
  return JSON.parse(JSON.stringify({ ...params, frozenAt: 0 }));
}

export function sanitizePersistentSnapshot(raw: unknown): PersistentMemorySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as any;
  if (typeof r.matchId !== 'string' || !r.matchId) return null;
  return {
    matchId: r.matchId,
    identityByActor: r.identityByActor && typeof r.identityByActor === 'object' ? r.identityByActor : {},
    priorsByActor: r.priorsByActor && typeof r.priorsByActor === 'object' ? r.priorsByActor : {},
    importedProfileIds: Array.isArray(r.importedProfileIds) ? r.importedProfileIds.map(String).slice(0, 12) : [],
    frozenAt: memNum(r.frozenAt)
  };
}

export interface PersistentMatchSummary { subjectProfileId: string; rivalIdentityId: string; profileKey: string; actorId: string; outcome: 'win' | 'loss' | 'draw'; beliefs: Record<string, { value: number; confidence: number; observations: number }>; relationship: PersistentProfile['relationshipHistory']; notable: Array<{ summary: string; importance: number }>; observations: number }

export function extractMatchSummary(memory: AiActorMemory | null | undefined, subjectActorId: string, meta: { subjectProfileId: string; rivalIdentityId: string; profileKey: string; outcome: 'win' | 'loss' | 'draw' }): PersistentMatchSummary {
  const m = memory || createEmptyAiActorMemory('');
  const model = m.opponentModels[subjectActorId];
  const rel = m.relationships[subjectActorId] || createRelationship(subjectActorId, 0);
  return {
    ...meta,
    actorId: m.ownerActorId,
    beliefs: Object.fromEntries(Object.entries(model?.beliefs || {}).map(([k, b]) => [k, { value: b.value, confidence: b.confidence, observations: b.observations }])),
    relationship: { trust: rel.trust, respect: rel.respect, rivalry: rel.rivalry, reliability: rel.reliability, cooperation: rel.cooperation },
    notable: m.events.filter(e => e.actorId === subjectActorId && e.importance >= 3).slice(-5).map(e => ({ summary: e.summary, importance: e.importance })),
    observations: model?.totalOpportunities || 0
  };
}

/** Blend a match summary into a long-term profile (running average weighted by matches observed). */
export function consolidateProfile(existing: PersistentProfile | null | undefined, summary: PersistentMatchSummary, meta: { matchId: string }): PersistentProfile {
  const base: PersistentProfile = existing || {
    profileId: summary.profileKey, actorId: summary.actorId, rivalIdentityId: summary.rivalIdentityId, subjectProfileId: summary.subjectProfileId,
    matchesObserved: 0, wins: 0, losses: 0, draws: 0, observationCount: 0, confidence: 0,
    aggressionPreference: 0.25, expansionPreference: 0.25, economicPreference: 0.25, cooperationPreference: 0.25,
    strategicTendencies: {}, relationshipHistory: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 },
    notableMemories: [], preferredTeamCoordination: [], committedMatchIds: [], lastUpdatedAt: 0
  };
  if (base.committedMatchIds.includes(meta.matchId)) return base;
  const n = base.matchesObserved;
  const blend = (old: number, next: number | undefined) => (typeof next === 'number' ? Math.round(((old * n + next) / (n + 1)) * 1000) / 1000 : old);
  const tendencies = { ...base.strategicTendencies };
  Object.entries(summary.beliefs).forEach(([k, b]) => {
    const t = tendencies[k] || { estimate: 0.25, confidence: 0, observations: 0 };
    tendencies[k] = { estimate: blend(t.estimate, b.value), confidence: Math.min(0.9, Math.round((t.confidence + b.confidence * 0.3) * 100) / 100), observations: t.observations + b.observations };
  });
  const notable = [...base.notableMemories];
  summary.notable.forEach((m, i) => {
    const hit = notable.find(x => x.summary === m.summary);
    if (hit) hit.count += 1; else notable.push({ id: `nm_${meta.matchId}_${i}`, summary: m.summary, importance: m.importance, count: 1 });
  });
  return {
    ...base,
    matchesObserved: n + 1,
    wins: base.wins + (summary.outcome === 'win' ? 1 : 0),
    losses: base.losses + (summary.outcome === 'loss' ? 1 : 0),
    draws: base.draws + (summary.outcome === 'draw' ? 1 : 0),
    observationCount: base.observationCount + summary.observations,
    confidence: Math.min(0.9, Math.round((base.confidence + 0.15) * 100) / 100),
    aggressionPreference: blend(base.aggressionPreference, summary.beliefs.aggressive?.value),
    expansionPreference: blend(base.expansionPreference, summary.beliefs.expansion?.value),
    economicPreference: blend(base.economicPreference, summary.beliefs.economic?.value),
    cooperationPreference: blend(base.cooperationPreference, summary.beliefs.cooperative?.value),
    strategicTendencies: tendencies,
    relationshipHistory: {
      trust: blend(base.relationshipHistory.trust, summary.relationship.trust), respect: blend(base.relationshipHistory.respect, summary.relationship.respect),
      rivalry: blend(base.relationshipHistory.rivalry, summary.relationship.rivalry), reliability: blend(base.relationshipHistory.reliability, summary.relationship.reliability),
      cooperation: blend(base.relationshipHistory.cooperation, summary.relationship.cooperation)
    },
    notableMemories: notable.sort((a, b) => b.importance * b.count - a.importance * a.count).slice(0, 8),
    committedMatchIds: [...base.committedMatchIds, meta.matchId].slice(-50),
    lastUpdatedAt: Date.now()
  };
}

export function commitMatchToStore(store: PersistentStore, profile: PersistentProfile, matchId: string): PersistentStore {
  return { ...store, profiles: { ...store.profiles, [profile.profileId]: profile }, committedMatchIds: Array.from(new Set([...store.committedMatchIds, matchId])).slice(-200), updatedAt: Date.now() };
}

export function exportPersistentMemoryBackup(storage?: Storage | null, opts?: { profileId?: string }): { format: string; version: 1; exportedAt: number; profiles: Record<string, PersistentProfile> } {
  const store = loadPersistentStore(storage);
  const profiles = opts?.profileId ? (store.profiles[opts.profileId] ? { [opts.profileId]: store.profiles[opts.profileId] } : {}) : store.profiles;
  return { format: 'australia-game-persistent-ai-memory', version: 1, exportedAt: Date.now(), profiles };
}

export function previewPersistentMemoryBackup(raw: string): { ok: boolean; error?: string; profileCount: number; identities: string[]; lastUpdatedAt: number | null } {
  try {
    const parsed = JSON.parse(raw);
    const store = sanitizePersistentStore({ profiles: parsed?.profiles || {} });
    const profiles = Object.values(store.profiles);
    if (!profiles.length) return { ok: false, error: 'The file contains no AI profiles.', profileCount: 0, identities: [], lastUpdatedAt: null };
    return { ok: true, profileCount: profiles.length, identities: profiles.map(p => p.rivalIdentityId).slice(0, 10), lastUpdatedAt: Math.max(...profiles.map(p => p.lastUpdatedAt)) || null };
  } catch (e) {
    return { ok: false, error: `The file is not a valid backup (${e instanceof Error ? e.message : String(e)}).`, profileCount: 0, identities: [], lastUpdatedAt: null };
  }
}

export function importPersistentMemoryBackup(raw: string, storage?: Storage | null, opts?: { confirmed?: boolean; mode?: 'replace' | 'merge' }): { ok: boolean; error?: string; imported: number } {
  if (!opts?.confirmed) return { ok: false, error: 'Import needs confirmation.', imported: 0 };
  const preview = previewPersistentMemoryBackup(raw);
  if (!preview.ok) return { ok: false, error: preview.error, imported: 0 };
  const s = storage === undefined ? persistStorage() : storage;
  if (!s) return { ok: false, error: 'Storage is unavailable in this browser.', imported: 0 };
  try {
    const incoming = sanitizePersistentStore({ profiles: JSON.parse(raw).profiles });
    const current = loadPersistentStore(s);
    const next: PersistentStore = opts.mode === 'merge' ? { ...current, profiles: { ...current.profiles, ...incoming.profiles } } : { ...current, profiles: incoming.profiles };
    s.setItem(PERSISTENT_MEMORY_STORAGE_KEY, JSON.stringify({ ...next, updatedAt: Date.now() }));
    persistenceGeneration += 1;
    return { ok: true, imported: Object.keys(incoming.profiles).length };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : String(e), imported: 0 }; }
}

/** In-memory Storage stand-in used by the self-tests (never touches the real browser storage). */
function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    key: (i: number) => Array.from(data.keys())[i] ?? null,
    removeItem: (k: string) => { data.delete(k); },
    setItem: (k: string, v: string) => { data.set(k, String(v)); }
  } as Storage;
}

export function runAiMemoryPhase4SelfTests() {
  return memTests([
    ['p4_default_off', 'Persistence is off without explicit verified consent', () => { const s = createMemoryStorage(); const p = loadPersistencePolicy(s); return !isPersistenceConsentActive(p) && applyPersistencePolicyToSettings({ aiPersistentMemoryEnabled: true } as { aiPersistentMemoryEnabled?: boolean }, p).aiPersistentMemoryEnabled === false || 'persisted without consent'; }],
    ['p4_enable', 'Enabling verifies a storage round-trip', () => { const s = createMemoryStorage(); const r = confirmEnableAndVerifyPersistentMemory(s); return r.verification.ok && isPersistenceConsentActive(loadPersistencePolicy(s)) || JSON.stringify(r); }],
    ['p4_disable', 'Disabling stops writes immediately (stale commits cannot write)', () => { const s = createMemoryStorage(); confirmEnableAndVerifyPersistentMemory(s); const gen = getPersistenceGeneration(); disablePersistentMemory(s); return !savePersistentStore(emptyPersistentStore(), s, { purpose: 'commit', generation: gen }) || 'stale write allowed'; }]
  ]);
}

export function runAiMemoryPhase6SelfTests() {
  return memTests([
    ['p6_consolidate', 'A match summary consolidates into a profile once per match', () => { const sum: PersistentMatchSummary = { subjectProfileId: HUMAN_PROFILE_ID, rivalIdentityId: 'rival:x', profileKey: 'rival:x|human_player', actorId: 'ai', outcome: 'win', beliefs: { aggressive: { value: 0.8, confidence: 0.5, observations: 4 } }, relationship: { trust: 40, respect: 50, rivalry: 30, reliability: 50, cooperation: 50 }, notable: [], observations: 4 }; const a = consolidateProfile(null, sum, { matchId: 'm1' }); const b = consolidateProfile(a, sum, { matchId: 'm1' }); return a.matchesObserved === 1 && b.matchesObserved === 1 && a.wins === 1 || JSON.stringify({ a: a.matchesObserved, b: b.matchesObserved }); }],
    ['p6_prior_cap', 'Priors are capped (a past match only nudges)', () => { const p = consolidateProfile(null, { subjectProfileId: HUMAN_PROFILE_ID, rivalIdentityId: 'r', profileKey: 'r|h', actorId: 'ai', outcome: 'loss', beliefs: {}, relationship: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 }, notable: [], observations: 0 }, { matchId: 'm' }); const seed = profileToPriorSeed({ ...p, confidence: 0.9 }, 'player'); return Object.values(seed.beliefs).every(b => b.confidence <= 0.5) || 'cap exceeded'; }],
    ['p6_identity', 'Anonymous identities never persist', () => resolveActorIdentity({ actorId: 'ai', matchId: 'm', identityMode: 'anonymous' }).rivalIdentityId.startsWith('anon:') || 'not anonymous']
  ]);
}

export function runAiMemoryPhase61SelfTests() {
  return memTests([
    ['p61_backup', 'Export → preview → import round-trips profiles', () => { const s = createMemoryStorage(); confirmEnableAndVerifyPersistentMemory(s); const prof = consolidateProfile(null, { subjectProfileId: HUMAN_PROFILE_ID, rivalIdentityId: 'rival:y', profileKey: 'rival:y|human_player', actorId: 'ai', outcome: 'draw', beliefs: {}, relationship: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 }, notable: [], observations: 0 }, { matchId: 'm2' }); savePersistentStore(commitMatchToStore(emptyPersistentStore(), prof, 'm2'), s, { generation: getPersistenceGeneration() }); const raw = JSON.stringify(exportPersistentMemoryBackup(s)); const t = createMemoryStorage(); const r = importPersistentMemoryBackup(raw, t, { confirmed: true, mode: 'replace' }); return r.ok && previewPersistentMemoryBackup(raw).profileCount === 1 && Object.keys(loadPersistentStore(t).profiles).length === 1 || JSON.stringify(r); }],
    ['p61_bad_backup', 'A corrupt backup is rejected without changes', () => !previewPersistentMemoryBackup('{not json').ok && !importPersistentMemoryBackup('{"profiles":{}}', createMemoryStorage(), { confirmed: true }).ok || 'accepted a bad backup'],
    ['p61_no_storage', 'No storage (sandboxed browser) never throws', () => { const r = confirmEnableAndVerifyPersistentMemory(null); return !r.verification.ok && loadPersistentStore(null).version === 1 || 'threw or enabled'; }]
  ]);
}

export function runAiMemoryPhase7SelfTests() {
  return memTests([
    ['p7_horizon', 'Horizon snapshot separates match events from cross-match priors', () => {
      let m = createFreshAiMemories(['ai']);
      m = applyPriorsToFreshMemories(m, { ai: profileToPriorSeed({ profileId: 'p', actorId: 'ai', rivalIdentityId: 'r', subjectProfileId: HUMAN_PROFILE_ID, matchesObserved: 2, wins: 1, losses: 1, draws: 0, observationCount: 4, confidence: 0.5, aggressionPreference: 0.7, expansionPreference: 0.3, economicPreference: 0.25, cooperationPreference: 0.25, strategicTendencies: {}, relationshipHistory: { trust: 50, respect: 50, rivalry: 0, reliability: 50, cooperation: 50 }, notableMemories: [], preferredTeamCoordination: [], committedMatchIds: [], lastUpdatedAt: 0 }, 'player') });
      const snap = buildAiMemoryHorizonSnapshot(m.ai, { persistentMemoryEnabled: true });
      return snap.longTermPriorBeliefCount >= 1 && snap.shortTermEventCount === 0 && snap.explainabilityDisclaimer.includes('not a neural') || JSON.stringify(snap);
    }],
    ['p7_reasons', 'Memory influence attaches human-readable reasons for decision traces', () => {
      let m = createFreshAiMemories(['ai']);
      m = applyCommittedActionToAiMemories(m, { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'i' }, MEM_OBS);
      const out = applyAiMemoryInfluence([{ type: 'sabotage', score: 10, data: { targetActorId: 'player' } }], { actorId: 'ai', memory: m.ai });
      const c = out[0] as { memoryReasons?: string[]; memoryInfluence?: number; score?: number };
      return (c.memoryReasons || []).length > 0 && typeof c.memoryInfluence === 'number' && (c.score || 0) > 10 || JSON.stringify(c);
    }],
    ['p7_inspection', 'Inspection view includes horizon snapshot', () => {
      const v = getFilteredAiMemoryInspectionView(createEmptyAiActorMemory('ai'), { persistentMemoryEnabled: false });
      return v.horizonSnapshot && typeof v.horizonSnapshot.qualityNote === 'string' || 'missing horizon';
    }],
    ['p7_bounded', 'Memory influence still never removes decision options', () => {
      let m = createFreshAiMemories(['ai']);
      m = applyCommittedActionToAiMemories(m, { actionType: 'sabotage', actorId: 'player', targetId: 'ai', turn: 1, summary: 's', stableKey: 'b' }, MEM_OBS);
      const out = applyAiMemoryInfluence([{ type: 'sabotage', score: 10, data: { targetActorId: 'player' } }, { type: 'sell', score: 10 }], { actorId: 'ai', memory: m.ai });
      return out.length === 2 || `${out.length}`;
    }]
  ]);
}
