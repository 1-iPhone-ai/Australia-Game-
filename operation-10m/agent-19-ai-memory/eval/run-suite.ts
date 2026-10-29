import { buildAiMemoryHorizonSnapshot, createEmptyAiActorMemory } from '../horizon.ts';
import {
  auditFindingsOk,
  auditMemoryInfluenceDecisions,
  AGENT19_MAX_SINGLE_DECISION_INFLUENCE,
} from '../influence-audit.ts';
import {
  buildMemoryExplainabilityBrief,
  formatHorizonBadge,
  rankInfluenceSlicesByMagnitude,
  summarizeSlicesByHorizon,
} from '../explainability.ts';
import { computeNegotiationThresholdShift, formatNegotiationExplainability } from '../negotiation-explainability.ts';
import {
  buildInspectionExplainabilityNarrative,
  getFilteredAiMemoryInspectionView,
} from '../inspection-explainability.ts';
import { auditActorMemoryBounds, memoryBoundsOk, AGENT19_AI_MEMORY_EVENT_CAP } from '../memory-bounds-audit.ts';
import {
  buildAgent19DecisionTraceReport,
  compareHorizonSnapshots,
  labelMemoryHorizon,
} from '../decision-trace.ts';
import { buildPersistentPriorExplainabilityBrief, listPersistentPriorBeliefs } from '../prior-explainability.ts';
import { explainAdaptivePlan } from '../adaptive-plan-explainability.ts';
import { computeMemoryHealthScorecard, formatMemoryHealthBrief } from '../memory-health-scorecard.ts';
import { summarizeTurnMemoryInfluence } from '../turn-influence-summary.ts';
import { buildMemoryGiClaims, formatGiClaimsAsBrief } from '../explainability-claims.ts';
import type { MemoryEvalResult } from '../types.ts';

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
