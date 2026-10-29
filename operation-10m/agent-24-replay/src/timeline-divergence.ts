import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24TimelineRegistry } from './timeline-registry.ts';

export interface Agent24BranchDivergenceMetric {
  timelineAId: string;
  timelineBId: string;
  divergenceTurnEstimate: number;
  branchLabelDelta: string;
  fingerprint: string;
}

export interface Agent24TimelineDivergenceReport {
  reportId: string;
  matchId: string;
  pairCount: number;
  metrics: Agent24BranchDivergenceMetric[];
  maxDivergenceTurn: number;
  deterministicFingerprint: string;
}

export interface Agent24TimelineDivergenceInput {
  matchId: string;
  registry: Agent24TimelineRegistry;
  branchTurnHints?: Record<string, number>;
}

export function buildAgent24TimelineDivergenceReport(input: Agent24TimelineDivergenceInput): Agent24TimelineDivergenceReport {
  const branches = input.registry.entries.filter(e => e.status === 'branch' || e.status === 'simulated');
  const main = input.registry.entries.find(e => e.status === 'main');
  const metrics: Agent24BranchDivergenceMetric[] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const a = branches[i];
      const b = branches[j];
      const turnA = a.branchTurn ?? input.branchTurnHints?.[a.branchedAtNodeId ?? ''] ?? 0;
      const turnB = b.branchTurn ?? input.branchTurnHints?.[b.branchedAtNodeId ?? ''] ?? 0;
      const divergenceTurnEstimate = Math.min(turnA, turnB);
      metrics.push({
        timelineAId: a.timelineId,
        timelineBId: b.timelineId,
        divergenceTurnEstimate,
        branchLabelDelta: `${a.label} vs ${b.label}`,
        fingerprint: o6kAgent24Fingerprint('branch_divergence', { a: a.timelineId, b: b.timelineId, divergenceTurnEstimate }),
      });
    }
  }

  if (main && branches.length > 0) {
    for (const br of branches) {
      const turnB = br.branchTurn ?? input.branchTurnHints?.[br.branchedAtNodeId ?? ''] ?? 0;
      metrics.push({
        timelineAId: main.timelineId,
        timelineBId: br.timelineId,
        divergenceTurnEstimate: turnB,
        branchLabelDelta: `main vs ${br.label}`,
        fingerprint: o6kAgent24Fingerprint('main_branch_divergence', { main: main.timelineId, br: br.timelineId, turnB }),
      });
    }
  }

  metrics.sort((x, y) => x.timelineAId.localeCompare(y.timelineAId) || x.timelineBId.localeCompare(y.timelineBId));
  const maxDivergenceTurn = metrics.reduce((m, r) => Math.max(m, r.divergenceTurnEstimate), 0);
  const payload = metrics.map(m => m.fingerprint);

  return {
    reportId: o6kAgent24Fingerprint('divergence_report', { matchId: input.matchId, count: metrics.length }),
    matchId: input.matchId,
    pairCount: metrics.length,
    metrics,
    maxDivergenceTurn,
    deterministicFingerprint: o6kAgent24Fingerprint('divergence_report_body', payload),
  };
}
