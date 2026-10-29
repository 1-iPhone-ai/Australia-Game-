import { o6kAgent24Fingerprint } from './fingerprint.ts';

export interface Agent24ReplayEventLike {
  eventType?: string;
  turn?: number;
  sequence?: number;
  day?: number;
}

export interface Agent24ReplayPlaybackIssue {
  kind: 'turn_regression' | 'duplicate_checkpoint' | 'sequence_gap' | 'missing_turn';
  turn: number;
  detail: string;
  severity: 'info' | 'warn' | 'critical';
  fingerprint: string;
}

export interface Agent24ReplayPlaybackIntegrityReport {
  reportId: string;
  matchId: string;
  eventCount: number;
  checkpointEventCount: number;
  issueCount: number;
  issues: Agent24ReplayPlaybackIssue[];
  monotonicTurns: boolean;
  integrityScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayPlaybackIntegrityInput {
  matchId: string;
  currentTurn: number;
  replay?: {
    events?: Agent24ReplayEventLike[];
    checkpoints?: Record<string, unknown>;
  } | null;
}

function issueSeverity(kind: Agent24ReplayPlaybackIssue['kind']): Agent24ReplayPlaybackIssue['severity'] {
  if (kind === 'turn_regression') return 'critical';
  if (kind === 'duplicate_checkpoint') return 'warn';
  if (kind === 'sequence_gap') return 'warn';
  return 'info';
}

export function buildAgent24ReplayPlaybackIntegrityReport(
  input: Agent24ReplayPlaybackIntegrityInput,
): Agent24ReplayPlaybackIntegrityReport {
  const events = [...(input.replay?.events || [])].sort((a, b) => {
    const sa = a.sequence ?? a.turn ?? 0;
    const sb = b.sequence ?? b.turn ?? 0;
    return sa - sb || (a.turn ?? 0) - (b.turn ?? 0);
  });

  const issues: Agent24ReplayPlaybackIssue[] = [];
  let lastTurn = 0;
  let lastSequence: number | null = null;
  const checkpointTurnsSeen = new Set<number>();

  for (const ev of events) {
    const turn = typeof ev.turn === 'number' ? ev.turn : 0;
    const seq = typeof ev.sequence === 'number' ? ev.sequence : null;

    if (turn > 0 && turn < lastTurn) {
      issues.push({
        kind: 'turn_regression',
        turn,
        detail: `Replay event turn ${turn} regresses from prior turn ${lastTurn}`,
        severity: issueSeverity('turn_regression'),
        fingerprint: o6kAgent24Fingerprint('playback_regression', { turn, lastTurn }),
      });
    }
    if (turn > lastTurn) lastTurn = turn;

    if (seq != null && lastSequence != null && seq > lastSequence + 1) {
      issues.push({
        kind: 'sequence_gap',
        turn,
        detail: `Sequence jumped from ${lastSequence} to ${seq}`,
        severity: issueSeverity('sequence_gap'),
        fingerprint: o6kAgent24Fingerprint('playback_seq_gap', { from: lastSequence, to: seq }),
      });
    }
    if (seq != null) lastSequence = seq;

    if (ev.eventType === 'replay_checkpoint' && turn > 0) {
      if (checkpointTurnsSeen.has(turn)) {
        issues.push({
          kind: 'duplicate_checkpoint',
          turn,
          detail: `Duplicate replay_checkpoint at turn ${turn}`,
          severity: issueSeverity('duplicate_checkpoint'),
          fingerprint: o6kAgent24Fingerprint('playback_dup_ckpt', { turn }),
        });
      }
      checkpointTurnsSeen.add(turn);
    }
  }

  const checkpointKeys = Object.keys(input.replay?.checkpoints || {})
    .map(k => Number(k))
    .filter(n => Number.isFinite(n) && n >= 1);
  for (const ck of checkpointKeys) {
    if (!checkpointTurnsSeen.has(ck) && ck <= input.currentTurn) {
      issues.push({
        kind: 'missing_turn',
        turn: ck,
        detail: `Checkpoint map includes turn ${ck} without matching replay_checkpoint event`,
        severity: 'info',
        fingerprint: o6kAgent24Fingerprint('playback_ckpt_orphan', { turn: ck }),
      });
    }
  }

  issues.sort((a, b) => a.turn - b.turn || a.kind.localeCompare(b.kind));
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warnCount = issues.filter(i => i.severity === 'warn').length;
  let integrityScore = 100;
  integrityScore -= criticalCount * 30;
  integrityScore -= warnCount * 10;
  integrityScore -= issues.filter(i => i.severity === 'info').length * 3;
  integrityScore = Math.max(0, Math.min(100, integrityScore));
  const monotonicTurns = criticalCount === 0;

  const checkpointEventCount = events.filter(e => e.eventType === 'replay_checkpoint').length;

  return {
    reportId: o6kAgent24Fingerprint('playback_integrity', { matchId: input.matchId, turn: input.currentTurn }),
    matchId: input.matchId,
    eventCount: events.length,
    checkpointEventCount,
    issueCount: issues.length,
    issues,
    monotonicTurns,
    integrityScore,
    deterministicFingerprint: o6kAgent24Fingerprint('playback_integrity_body', {
      issues: issues.map(i => i.fingerprint),
      monotonicTurns,
      integrityScore,
    }),
  };
}

export function runAgent24PlaybackIntegritySelfTests(): Array<{ name: string; passed: boolean }> {
  const clean = buildAgent24ReplayPlaybackIntegrityReport({
    matchId: 'self',
    currentTurn: 10,
    replay: {
      events: [
        { eventType: 'replay_checkpoint', turn: 4, sequence: 1 },
        { eventType: 'replay_checkpoint', turn: 10, sequence: 2 },
      ],
      checkpoints: { '4': {}, '10': {} },
    },
  });
  const dirty = buildAgent24ReplayPlaybackIntegrityReport({
    matchId: 'self',
    currentTurn: 10,
    replay: {
      events: [
        { eventType: 'replay_checkpoint', turn: 8, sequence: 1 },
        { eventType: 'replay_checkpoint', turn: 5, sequence: 2 },
      ],
    },
  });
  return [
    { name: 'clean_monotonic', passed: clean.monotonicTurns && clean.integrityScore >= 90 },
    { name: 'regression_detected', passed: !dirty.monotonicTurns && dirty.issues.some(i => i.kind === 'turn_regression') },
    {
      name: 'deterministic_fingerprint',
      passed:
        clean.deterministicFingerprint ===
        buildAgent24ReplayPlaybackIntegrityReport({
          matchId: 'self',
          currentTurn: 10,
          replay: clean.eventCount
            ? {
                events: [
                  { eventType: 'replay_checkpoint', turn: 4, sequence: 1 },
                  { eventType: 'replay_checkpoint', turn: 10, sequence: 2 },
                ],
                checkpoints: { '4': {}, '10': {} },
              }
            : undefined,
        }).deterministicFingerprint,
    },
  ];
}
