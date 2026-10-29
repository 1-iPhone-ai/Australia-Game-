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
  onRunSelfTests?: () => void;
}

/** LAB stub for Agent 25 wiring — shows horizon + explainability brief lines. */
export function MemoryExplainabilityLab(props: MemoryExplainabilityLabProps) {
  const lines = buildMemoryExplainabilityBrief(props.snapshot);
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="agent-19-memory-explainability-lab">
      <strong style={{ color: '#a78bfa' }}>
        {props.title ?? 'LAB — Agent 19 AI Memory Explainability (modular)'}
      </strong>
      <div style={{ marginTop: 8, opacity: 0.9 }}>{props.snapshot.qualityNote}</div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {lines.map((line, i) => (
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
