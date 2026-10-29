import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24CausalRecordIndex } from './causal-records.ts';
import type { Agent24TimelineRegistry } from './timeline-registry.ts';
import type { Agent24LateGameReplayAssessment } from './late-game-replay.ts';
import type { O6kHistoricalAnalyticsSnapshot } from './history-replay-analytics.ts';

export interface Agent24ReplayDeterminismBundleSlice {
  snapshot: O6kHistoricalAnalyticsSnapshot;
  causalIndex: Agent24CausalRecordIndex;
  timelineRegistry: Agent24TimelineRegistry;
  lateGame: Agent24LateGameReplayAssessment;
  twinBuildPassed: boolean;
}

export interface Agent24MilestoneCategoryRollup {
  category: string;
  hitCount: number;
  weightSum: number;
}

export interface Agent24CausalDepthHistogram {
  depth: number;
  count: number;
}

export interface Agent24ReplayAnalyticsDepth {
  depthId: string;
  milestoneCategoryRollups: Agent24MilestoneCategoryRollup[];
  totalMilestoneWeight: number;
  causalDepthHistogram: Agent24CausalDepthHistogram[];
  longestCausalChainLength: number;
  timelineEntryCount: number;
  branchTimelineCount: number;
  replayEventCount: number;
  checkpointCount: number;
  lateGamePhase: string;
  integrityScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayBundleDiff {
  milestoneHitDelta: number;
  causalRecordDelta: number;
  timelineEntryDelta: number;
  integrityChanged: boolean;
  compositeChanged: boolean;
  summary: string;
}

function buildCategoryRollups(snapshot: O6kHistoricalAnalyticsSnapshot): Agent24MilestoneCategoryRollup[] {
  const map = new Map<string, { hitCount: number; weightSum: number }>();
  for (const hit of snapshot.milestoneHits) {
    const cur = map.get(hit.category) || { hitCount: 0, weightSum: 0 };
    cur.hitCount += 1;
    cur.weightSum += hit.weight;
    map.set(hit.category, cur);
  }
  return [...map.entries()]
    .map(([category, v]) => ({ category, hitCount: v.hitCount, weightSum: v.weightSum }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

function buildCausalDepthHistogram(index: Agent24CausalRecordIndex): Agent24CausalDepthHistogram[] {
  const counts = new Map<number, number>();
  for (const rec of Object.values(index.recordsByEventId)) {
    const d = rec.causalDepth;
    counts.set(d, (counts.get(d) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([depth, count]) => ({ depth, count }))
    .sort((a, b) => a.depth - b.depth);
}

function longestChainLength(index: Agent24CausalRecordIndex): number {
  let max = 0;
  for (const ids of Object.values(index.chainsById)) {
    if (ids.length > max) max = ids.length;
  }
  return max;
}

function computeIntegrityScore(input: {
  snapshot: O6kHistoricalAnalyticsSnapshot;
  causalIndex: Agent24CausalRecordIndex;
  timelineRegistry: Agent24TimelineRegistry;
  lateGame: Agent24LateGameReplayAssessment;
  twinBuildPassed: boolean;
}): number {
  let score = 0;
  if (input.snapshot.integrity.deterministicMode) score += 25;
  if (input.twinBuildPassed) score += 25;
  if (input.causalIndex.recordCount > 0) score += 15;
  if (input.timelineRegistry.entries.length >= 1) score += 10;
  if (!input.lateGame.requiresEndgameCheckpoint || !input.lateGame.isLateGame) score += 15;
  else score += 5;
  if (input.snapshot.integrity.replayEventCount >= 0) score += 10;
  return Math.min(100, score);
}

export function buildAgent24ReplayAnalyticsDepth(
  bundle: Agent24ReplayDeterminismBundleSlice,
): Agent24ReplayAnalyticsDepth {
  const rollups = buildCategoryRollups(bundle.snapshot);
  const histogram = buildCausalDepthHistogram(bundle.causalIndex);
  const branchCount = bundle.timelineRegistry.entries.filter(e => e.status === 'branch').length;
  const totalWeight = rollups.reduce((s, r) => s + r.weightSum, 0);
  const integrityScore = computeIntegrityScore({
    snapshot: bundle.snapshot,
    causalIndex: bundle.causalIndex,
    timelineRegistry: bundle.timelineRegistry,
    lateGame: bundle.lateGame,
    twinBuildPassed: bundle.twinBuildPassed,
  });
  const payload = {
    rollups,
    histogram,
    branchCount,
    totalWeight,
    integrityScore,
    replayEventCount: bundle.snapshot.integrity.replayEventCount,
    checkpointCount: bundle.snapshot.integrity.checkpointCount,
    phase: bundle.lateGame.phase,
  };
  return {
    depthId: o6kAgent24Fingerprint('analytics_depth', payload),
    milestoneCategoryRollups: rollups,
    totalMilestoneWeight: totalWeight,
    causalDepthHistogram: histogram,
    longestCausalChainLength: longestChainLength(bundle.causalIndex),
    timelineEntryCount: bundle.timelineRegistry.entries.length,
    branchTimelineCount: branchCount,
    replayEventCount: bundle.snapshot.integrity.replayEventCount,
    checkpointCount: bundle.snapshot.integrity.checkpointCount,
    lateGamePhase: bundle.lateGame.phase,
    integrityScore,
    deterministicFingerprint: o6kAgent24Fingerprint('analytics_depth_body', payload),
  };
}

export function diffAgent24ReplayBundles(
  before: Agent24ReplayDeterminismBundleSlice & { compositeFingerprint: string },
  after: Agent24ReplayDeterminismBundleSlice & { compositeFingerprint: string },
): Agent24ReplayBundleDiff {
  const milestoneHitDelta = after.snapshot.milestoneHits.length - before.snapshot.milestoneHits.length;
  const causalRecordDelta = after.causalIndex.recordCount - before.causalIndex.recordCount;
  const timelineEntryDelta = after.timelineRegistry.entries.length - before.timelineRegistry.entries.length;
  const integrityChanged = before.snapshot.integrity.fingerprint !== after.snapshot.integrity.fingerprint;
  const compositeChanged = before.compositeFingerprint !== after.compositeFingerprint;
  return {
    milestoneHitDelta,
    causalRecordDelta,
    timelineEntryDelta,
    integrityChanged,
    compositeChanged,
    summary: `Milestones ${milestoneHitDelta >= 0 ? '+' : ''}${milestoneHitDelta}; causal ${causalRecordDelta >= 0 ? '+' : ''}${causalRecordDelta}; timelines ${timelineEntryDelta >= 0 ? '+' : ''}${timelineEntryDelta}; integrity ${integrityChanged ? 'changed' : 'stable'}.`,
  };
}

export function runAgent24AnalyticsDepthSelfTests(): Array<{ name: string; passed: boolean; detail: string }> {
  const results: Array<{ name: string; passed: boolean; detail: string }> = [];
  const emptySnap = {
    snapshotId: 's',
    matchId: 'm',
    activeTimelineId: 'main',
    generatedAtTurn: 1,
    generatedAtDay: 1,
    milestoneHits: [],
    timelineSlices: [],
    replayBranchNodeIds: [],
    integrity: { deterministicMode: true, replayEventCount: 0, checkpointCount: 0, fingerprint: 'fp' },
  } as O6kHistoricalAnalyticsSnapshot;
  const depth = buildAgent24ReplayAnalyticsDepth({
    snapshot: emptySnap,
    causalIndex: {
      indexId: 'i',
      recordCount: 0,
      chainCount: 0,
      maxDepth: 0,
      recordsByEventId: {},
      chainsById: {},
      deterministicFingerprint: 'c',
    },
    timelineRegistry: {
      registryId: 'r',
      matchId: 'm',
      activeTimelineId: 'main',
      activeNodeId: 'root',
      entries: [],
      branchNodeOrder: [],
      deterministicFingerprint: 't',
    },
    lateGame: {
      phase: 'opening',
      isLateGame: false,
      requiresEndgameCheckpoint: false,
      recommendedCheckpointKinds: ['turn'],
      fingerprint: 'l',
    },
    twinBuildPassed: true,
  });
  results.push({
    name: 'depth_empty_integrity_score',
    passed: depth.integrityScore === 75,
    detail: `score=${depth.integrityScore}`,
  });
  results.push({
    name: 'depth_fingerprint_stable',
    passed: depth.deterministicFingerprint === buildAgent24ReplayAnalyticsDepth({
      snapshot: emptySnap,
      causalIndex: {
        indexId: 'i',
        recordCount: 0,
        chainCount: 0,
        maxDepth: 0,
        recordsByEventId: {},
        chainsById: {},
        deterministicFingerprint: 'c',
      },
      timelineRegistry: {
        registryId: 'r',
        matchId: 'm',
        activeTimelineId: 'main',
        activeNodeId: 'root',
        entries: [],
        branchNodeOrder: [],
        deterministicFingerprint: 't',
      },
      lateGame: {
        phase: 'opening',
        isLateGame: false,
        requiresEndgameCheckpoint: false,
        recommendedCheckpointKinds: ['turn'],
        fingerprint: 'l',
      },
      twinBuildPassed: true,
    }).deterministicFingerprint,
    detail: 'twin depth fingerprint',
  });
  return results;
}
