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
import {
  buildMemoryEventTimeline,
  summarizeMemoryEventTimeline,
  AGENT19_TIMELINE_DISPLAY_CAP,
} from '../memory-event-timeline.ts';
import {
  buildRelationshipExplainabilityBrief,
  listTrackedRelationshipActorIds,
} from '../relationship-explainability.ts';
import { auditMemoryRetentionOrdering, retentionAuditOk } from '../memory-retention-audit.ts';
import { buildTurnExplainabilityPack } from '../turn-explainability-pack.ts';
import {
  buildCounterfactualMemoryReport,
  baselineScoresWithoutMemory,
} from '../counterfactual-explainability.ts';
import {
  auditMemoryStaleness,
  summarizeMemoryStaleness,
  AGENT19_RELATIONSHIP_STALE_TURN_GAP,
} from '../memory-staleness-audit.ts';
import { buildSessionExplainabilityRollup } from '../session-explainability-rollup.ts';
import {
  buildExplainabilityDebugExport,
  explainabilityDebugExportWithinCap,
  AGENT19_DEBUG_EXPORT_NARRATIVE_CAP,
} from '../explainability-debug-export.ts';
import { auditExplainabilityIntegrity } from '../memory-explainability-integrity.ts';
import {
  buildOpponentModelExplainabilityBrief,
  listOpponentBeliefExplainLines,
} from '../opponent-model-explainability.ts';
import {
  auditInfluenceDriftBetweenTurns,
  AGENT19_INFLUENCE_DRIFT_SPIKE_THRESHOLD,
} from '../influence-drift-audit.ts';
import { auditPriorEventTension } from '../prior-event-tension-audit.ts';
import { buildMatchExplainabilityDigest, AGENT19_MATCH_DIGEST_LINE_CAP } from '../match-explainability-digest.ts';
import { buildTurnPackGiClaims } from '../turn-pack-gi-bridge.ts';
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
