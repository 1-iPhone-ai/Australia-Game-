import type { O10IdleGovernanceAssuranceJournal } from './automation-idle-governance-assurance-journal.js';
import type { O10IdleGovernanceSustainedWatchResult } from './automation-idle-governance-sustained-watch.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceReplayFrame {
  schema: '10m.agent20.idle-governance-replay-frame.v1';
  label: string;
  turn: number;
  digest: string;
}

export interface O10IdleGovernanceReplayTape {
  schema: '10m.agent20.idle-governance-replay-tape.v1';
  frameCount: number;
  frames: O10IdleGovernanceReplayFrame[];
  rollupRecommendation: string;
}

/** Materialize sustained-watch journal into a replay-friendly tape for Agent 24 hooks. */
export function buildIdleGovernanceReplayTapeFromWatch(
  watch: O10IdleGovernanceSustainedWatchResult
): O10IdleGovernanceReplayTape {
  const frames: O10IdleGovernanceReplayFrame[] = watch.journal.entries.map((entry, idx) => ({
    schema: '10m.agent20.idle-governance-replay-frame.v1',
    label: `gov_watch_${entry.turn}`,
    turn: entry.turn,
    digest: `${entry.attestationFingerprint}|${entry.reconcileStatus}|${entry.watchUrgency}|${entry.attestValid ? 1 : 0}`,
  }));

  return {
    schema: '10m.agent20.idle-governance-replay-tape.v1',
    frameCount: frames.length,
    frames,
    rollupRecommendation: watch.rollup.recommendation,
  };
}

export function verifyIdleGovernanceReplayTapeDeterminism(
  watch: O10IdleGovernanceSustainedWatchResult,
  tape: O10IdleGovernanceReplayTape
): { ok: boolean; mismatches: string[] } {
  const rerun = buildIdleGovernanceReplayTapeFromWatch(watch);
  const mismatches: string[] = [];
  if (rerun.frameCount !== tape.frameCount) {
    mismatches.push(`frames:${rerun.frameCount}!=${tape.frameCount}`);
  }
  const n = Math.min(rerun.frames.length, tape.frames.length);
  for (let i = 0; i < n; i++) {
    if (rerun.frames[i].digest !== tape.frames[i].digest) {
      mismatches.push(`${tape.frames[i].label}:digest`);
    }
  }
  if (rerun.rollupRecommendation !== tape.rollupRecommendation) {
    mismatches.push('rollup_recommendation');
  }
  return { ok: mismatches.length === 0, mismatches };
}

export function buildIdleGovernanceReplayTapeFromJournal(
  journal: O10IdleGovernanceAssuranceJournal,
  rollupRecommendation: string
): O10IdleGovernanceReplayTape {
  const frames = journal.entries.map(entry => ({
    schema: '10m.agent20.idle-governance-replay-frame.v1' as const,
    label: `gov_journal_${entry.turn}`,
    turn: entry.turn,
    digest: `${entry.trendDirection}|${entry.watchUrgency}|${entry.attestValid ? 1 : 0}`,
  }));
  return {
    schema: '10m.agent20.idle-governance-replay-tape.v1',
    frameCount: frames.length,
    frames,
    rollupRecommendation,
  };
}

export function runO10Agent20IdleGovernanceWatchReplayTapeSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockWatch: O10IdleGovernanceSustainedWatchResult = {
    schema: '10m.agent20.idle-governance-sustained-watch.v1',
    cyclesRun: 2,
    summaryLine: 'mock',
    finalTrail: { schema: '10m.agent20.idle-governance-audit-trail.v1', entries: [] },
    lastPass: {} as never,
    journal: {
      schema: '10m.agent20.idle-governance-assurance-journal.v1',
      entries: [
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
          turn: 1,
          attestationFingerprint: 'fnv1a_aa',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
          turn: 2,
          attestationFingerprint: 'fnv1a_bb',
          reconcileStatus: 'aligned',
          trendDirection: 'improving',
          watchUrgency: 'low',
          attestValid: true,
        },
      ],
    },
    rollup: {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1',
      entryCount: 2,
      validRatio: 1,
      highUrgencyCount: 0,
      dominantTrend: 'improving',
      recommendation: 'relax_watch_cadence',
      summaryLine: 'rollup ok',
    },
  };

  const tape = buildIdleGovernanceReplayTapeFromWatch(mockWatch);
  push('gov_replay_frames', 'watch journal becomes replay frames', tape.frameCount === 2 && tape.frames[0].label === 'gov_watch_1');
  const verify = verifyIdleGovernanceReplayTapeDeterminism(mockWatch, tape);
  push('gov_replay_deterministic', 'tape rebuild is deterministic', verify.ok);

  const journalTape = buildIdleGovernanceReplayTapeFromJournal(mockWatch.journal, 'continue_scheduled_watch');
  push('gov_replay_journal', 'journal-only tape preserves recommendation', journalTape.rollupRecommendation === 'continue_scheduled_watch');

  push('gov_replay_schema', 'replay tape schema marker', tape.schema === '10m.agent20.idle-governance-replay-tape.v1');

  return results;
}
