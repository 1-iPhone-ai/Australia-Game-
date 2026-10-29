import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildAgent24CausalRecordIndex, pickCausalChain } from '../src/causal-records.ts';
import { buildAgent24TimelineRegistry } from '../src/timeline-registry.ts';
import { classifyAgent24MatchPhase, assessAgent24LateGameReplay } from '../src/late-game-replay.ts';
import {
  buildAgent24ReplayDeterminismBundle,
  verifyAgent24ReplayDeterminism,
} from '../src/replay-determinism.ts';
import {
  buildAgent24ReplayAnalyticsDepth,
  diffAgent24ReplayBundles,
  runAgent24AnalyticsDepthSelfTests,
} from '../src/analytics-depth.ts';
import { runAgent24ReplayScenarioSuite } from '../src/replay-scenarios.ts';
import { buildAgent24AuditTrail, mergeAgent24AuditTrails } from '../src/audit-trails.ts';
import { buildAgent24MultiSessionContinuity } from '../src/multi-session.ts';
import { o6kAgent24StableStringify, runO6kAgent24SelfTests } from '../src/history-replay-analytics.ts';

describe('Agent 24 causal records', () => {
  it('indexes chains with stable ordering', () => {
    const index = buildAgent24CausalRecordIndex([
      { id: 'a', turn: 1, title: 'root', causalChainId: 'c1', causalDepth: 0 },
      { id: 'b', turn: 2, title: 'child', parentEventId: 'a', causalChainId: 'c1', causalDepth: 1 },
    ]);
    assert.equal(index.recordCount, 2);
    assert.equal(index.chainCount, 1);
    const chain = pickCausalChain(index, 'c1');
    assert.equal(chain[0]?.eventId, 'a');
    assert.equal(chain[1]?.eventId, 'b');
    const index2 = buildAgent24CausalRecordIndex([
      { id: 'a', turn: 1, title: 'root', causalChainId: 'c1', causalDepth: 0 },
      { id: 'b', turn: 2, title: 'child', parentEventId: 'a', causalChainId: 'c1', causalDepth: 1 },
    ]);
    assert.equal(index.deterministicFingerprint, index2.deterministicFingerprint);
  });
});

describe('Agent 24 timeline registry', () => {
  it('lists main and branch timelines deterministically', () => {
    const reg = buildAgent24TimelineRegistry({
      matchId: 'm1',
      activeTimelineId: 'main',
      activeNodeId: 'root',
      nodesById: {
        b2: { nodeId: 'b2', parentNodeId: 'root', branchTurn: 10, label: 'Risk fork' },
        b1: { nodeId: 'b1', parentNodeId: 'root', branchTurn: 5, label: 'Early fork' },
      },
    });
    assert.ok(reg.entries.some(e => e.timelineId === 'main'));
    assert.equal(reg.branchNodeOrder[0], 'b1');
    assert.equal(reg.branchNodeOrder[1], 'b2');
  });
});

describe('Agent 24 late game replay', () => {
  it('classifies endgame and overtime', () => {
    assert.equal(classifyAgent24MatchPhase({ turn: 10, day: 10, maxTurns: 100 }), 'opening');
    assert.equal(classifyAgent24MatchPhase({ turn: 80, day: 80, maxTurns: 100 }), 'endgame');
    assert.equal(classifyAgent24MatchPhase({ turn: 95, day: 95, maxTurns: 100 }), 'overtime');
    const late = assessAgent24LateGameReplay({ turn: 95, day: 95, maxTurns: 100, checkpointKinds: ['turn'] });
    assert.equal(late.isLateGame, true);
    assert.equal(late.requiresEndgameCheckpoint, true);
  });
});

describe('Agent 24 replay determinism bundle', () => {
  const sampleInput = () => ({
    matchId: 'test_match',
    turn: 12,
    day: 12,
    maxTurns: 100,
    gameActivityLedger: {
      events: [
        { id: 'e1', turn: 3, title: 'Regional contract completed', causalChainId: 'chain_a' },
        { id: 'e2', turn: 4, title: 'Lead change detected', parentEventId: 'e1', causalChainId: 'chain_a', causalDepth: 1 },
      ],
    },
    replay: { events: [{ eventType: 'replay_checkpoint', turn: 12 }], checkpoints: { '12': {} } },
    replayBranchTree: {
      activeNodeId: 'root',
      nodesById: { alt: { nodeId: 'alt', branchTurn: 8, label: 'Alt' } },
    },
    teamsById: { t1: { netWorth: 500 } },
    deterministicMode: true,
  });

  it('builds composite bundle with twin-build pass', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(sampleInput());
    assert.equal(bundle.twinBuildPassed, true);
    assert.ok(bundle.causalIndex.recordCount >= 2);
    assert.ok(bundle.timelineRegistry.entries.length >= 2);
  });

  it('verifies twin determinism across full bundle', () => {
    const result = verifyAgent24ReplayDeterminism(sampleInput);
    assert.equal(result.passed, true);
    assert.ok(result.probes.some(p => p.name === 'analytics_depth_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'scenario_suite_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'audit_trail_twin' && p.passed));
    assert.ok(result.probes.some(p => p.name === 'multi_session_twin' && p.passed));
  });

  it('includes analytics depth rollups and stable twin fingerprint', () => {
    const bundle = buildAgent24ReplayDeterminismBundle(sampleInput());
    assert.ok(bundle.analyticsDepth.totalMilestoneWeight >= 0);
    assert.ok(bundle.analyticsDepth.longestCausalChainLength >= 1);
    const twinDepth = buildAgent24ReplayAnalyticsDepth({
      snapshot: bundle.snapshot,
      causalIndex: bundle.causalIndex,
      timelineRegistry: bundle.timelineRegistry,
      lateGame: bundle.lateGame,
      twinBuildPassed: bundle.twinBuildPassed,
    });
    assert.equal(bundle.analyticsDepth.deterministicFingerprint, twinDepth.deterministicFingerprint);
  });

  it('diffs bundles across turns', () => {
    const early = buildAgent24ReplayDeterminismBundle({ ...sampleInput(), turn: 5, day: 5 });
    const late = buildAgent24ReplayDeterminismBundle(sampleInput());
    const diff = diffAgent24ReplayBundles(early, late);
    assert.ok(diff.summary.includes('Milestones'));
  });
});

describe('Agent 24 replay scenarios', () => {
  it('evaluates scenario suite deterministically', () => {
    const suite = runAgent24ReplayScenarioSuite({
      replayEventCount: 3,
      branchNodeCount: 2,
      isLateGame: true,
      maxCausalDepth: 3,
      sessionCount: 2,
    });
    assert.equal(suite.assessments.length, 5);
    assert.ok(suite.satisfiedCount >= 4);
    const suite2 = runAgent24ReplayScenarioSuite({
      replayEventCount: 3,
      branchNodeCount: 2,
      isLateGame: true,
      maxCausalDepth: 3,
      sessionCount: 2,
    });
    assert.equal(suite.deterministicFingerprint, suite2.deterministicFingerprint);
  });
});

describe('Agent 24 audit trails', () => {
  it('builds and merges trails with stable fingerprints', () => {
    const t1 = buildAgent24AuditTrail({
      matchId: 'm',
      turn: 5,
      day: 5,
      entries: [{ action: 'session_saved', summary: 'Saved slot A', relatedSessionId: 's1' }],
    });
    const t2 = buildAgent24AuditTrail({
      matchId: 'm',
      turn: 6,
      day: 6,
      entries: [{ action: 'session_resumed', summary: 'Resumed slot A', relatedSessionId: 's1' }],
    });
    const merged = mergeAgent24AuditTrails(t1, t2);
    assert.equal(merged.entryCount, 2);
    assert.equal(merged.actionCounts.session_saved, 1);
  });
});

describe('Agent 24 multi-session continuity', () => {
  it('flags resume-safe non-overlapping sessions', () => {
    const c = buildAgent24MultiSessionContinuity({
      matchId: 'm',
      sessions: [
        { sessionId: 's1', startedAtTurn: 1, endedAtTurn: 10, replayEventCount: 4, branchNodeCount: 1 },
        { sessionId: 's2', startedAtTurn: 11, endedAtTurn: 20, replayEventCount: 5, branchNodeCount: 2 },
      ],
    });
    assert.equal(c.sessionCount, 2);
    assert.equal(c.resumeSafe, true);
    assert.equal(c.totalReplayEvents, 9);
  });
});

describe('Agent 24 analytics depth self-tests', () => {
  it('runs bundled depth self-tests', () => {
    const results = runAgent24AnalyticsDepthSelfTests();
    assert.ok(results.every(r => r.passed), results.filter(r => !r.passed).map(r => r.name).join(','));
  });
});

describe('Agent 24 legacy self-tests', () => {
  it('runs inlined V9.4 self-tests', () => {
    const results = runO6kAgent24SelfTests();
    assert.ok(results.every(r => r.passed), results.filter(r => !r.passed).map(r => r.name).join(','));
  });

  it('stable stringify is key-order independent', () => {
    assert.equal(o6kAgent24StableStringify({ b: 1, a: 2 }), o6kAgent24StableStringify({ a: 2, b: 1 }));
  });
});
