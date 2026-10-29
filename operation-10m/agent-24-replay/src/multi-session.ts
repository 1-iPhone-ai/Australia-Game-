import { o6kAgent24Fingerprint } from './fingerprint.ts';

export interface Agent24ReplaySessionRecord {
  sessionId: string;
  matchId: string;
  sessionIndex: number;
  startedAtTurn: number;
  endedAtTurn: number;
  replayEventCount: number;
  branchNodeCount: number;
  continuityToken: string;
  fingerprint: string;
}

export interface Agent24MultiSessionInput {
  matchId: string;
  sessions: Array<{
    sessionId: string;
    startedAtTurn: number;
    endedAtTurn: number;
    replayEventCount: number;
    branchNodeCount: number;
  }>;
}

export interface Agent24MultiSessionContinuity {
  continuityId: string;
  matchId: string;
  sessionCount: number;
  totalReplayEvents: number;
  totalBranchNodes: number;
  spanTurns: number;
  sessions: Agent24ReplaySessionRecord[];
  resumeSafe: boolean;
  deterministicFingerprint: string;
}

export function buildAgent24MultiSessionContinuity(input: Agent24MultiSessionInput): Agent24MultiSessionContinuity {
  const sorted = [...input.sessions].sort((a, b) => a.startedAtTurn - b.startedAtTurn || a.sessionId.localeCompare(b.sessionId));
  const sessions: Agent24ReplaySessionRecord[] = sorted.map((s, idx) => {
    const prev = sorted[idx - 1];
    const continuityToken = o6kAgent24Fingerprint('session_link', {
      matchId: input.matchId,
      prev: prev?.sessionId ?? 'none',
      cur: s.sessionId,
      turn: s.startedAtTurn,
    });
    return {
      sessionId: s.sessionId,
      matchId: input.matchId,
      sessionIndex: idx,
      startedAtTurn: s.startedAtTurn,
      endedAtTurn: s.endedAtTurn,
      replayEventCount: s.replayEventCount,
      branchNodeCount: s.branchNodeCount,
      continuityToken,
      fingerprint: o6kAgent24Fingerprint('session_record', { ...s, idx }),
    };
  });

  let resumeSafe = sessions.length > 0;
  for (let i = 1; i < sessions.length; i++) {
    if (sessions[i].startedAtTurn < sessions[i - 1].endedAtTurn) {
      resumeSafe = false;
      break;
    }
  }

  const totalReplayEvents = sessions.reduce((s, r) => s + r.replayEventCount, 0);
  const totalBranchNodes = sessions.reduce((s, r) => s + r.branchNodeCount, 0);
  const minTurn = sessions[0]?.startedAtTurn ?? 0;
  const maxTurn = sessions.at(-1)?.endedAtTurn ?? 0;
  const payload = {
    sessionIds: sessions.map(s => s.sessionId),
    fingerprints: sessions.map(s => s.fingerprint),
    resumeSafe,
    totalReplayEvents,
  };

  return {
    continuityId: o6kAgent24Fingerprint('multi_session', { matchId: input.matchId, count: sessions.length }),
    matchId: input.matchId,
    sessionCount: sessions.length,
    totalReplayEvents,
    totalBranchNodes,
    spanTurns: Math.max(0, maxTurn - minTurn),
    sessions,
    resumeSafe,
    deterministicFingerprint: o6kAgent24Fingerprint('multi_session_body', payload),
  };
}
