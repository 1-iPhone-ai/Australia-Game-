import type { V1014ReplaySnapshotPayload } from './types';
import { V1014_REPLAY_clampTurn, V1014_REPLAY_fingerprint } from './primitives';

export interface V1014ReplayScrubberState {
  cursorTurn: number;
  pinnedHeaderId: string | null;
  followLiveBranch: boolean;
}

export function V1014_REPLAY_initScrubberState(turn = 1): V1014ReplayScrubberState {
  return { cursorTurn: V1014_REPLAY_clampTurn(turn), pinnedHeaderId: null, followLiveBranch: true };
}

export function V1014_REPLAY_resolveScrubberSnapshot(
  ring: V1014ReplaySnapshotPayload[],
  state: V1014ReplayScrubberState,
): V1014ReplaySnapshotPayload | null {
  if (!ring.length) return null;
  if (state.pinnedHeaderId) {
    const pinned = ring.find(s => s.header.headerId === state.pinnedHeaderId);
    if (pinned) return pinned;
  }
  const t = V1014_REPLAY_clampTurn(state.cursorTurn);
  const eligible = ring.filter(s => s.header.coordinate.turn <= t);
  if (!eligible.length) return ring[0];
  return eligible[eligible.length - 1];
}

export function V1014_REPLAY_advanceScrubber(
  state: V1014ReplayScrubberState,
  delta: number,
  maxTurn: number,
): V1014ReplayScrubberState {
  const nextTurn = Math.min(maxTurn, Math.max(1, state.cursorTurn + delta));
  return { ...state, cursorTurn: nextTurn, pinnedHeaderId: null };
}

export function V1014_REPLAY_scrubberTimelineFingerprint(
  ring: V1014ReplaySnapshotPayload[],
  state: V1014ReplayScrubberState,
): string {
  const snap = V1014_REPLAY_resolveScrubberSnapshot(ring, state);
  return V1014_REPLAY_fingerprint('scrubber', { state, snapId: snap?.header.headerId || null, depth: ring.length });
}
