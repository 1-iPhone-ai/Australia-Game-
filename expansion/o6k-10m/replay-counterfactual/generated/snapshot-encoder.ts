import {
  V1014_REPLAY_ARCHIVE_SLICE_CATALOG,
  V1014_REPLAY_lookupArchiveSlice,
} from './archive-slice-catalog.generated';
import { V1014_REPLAY_runSliceEncoderHandler } from './slice-encoder-handlers.generated';
import {
  V1014_REPLAY_fingerprint,
  V1014_REPLAY_stableStringify,
  V1014_REPLAY_clampTurn,
} from './primitives';
import type {
  V1014ReplayArchiveDomain,
  V1014ReplayDomainSlice,
  V1014ReplaySnapshotHeader,
  V1014ReplaySnapshotPayload,
  V1014ReplayTurnCoordinate,
} from './types';
import { V1014_REPLAY_MODULE_VERSION, V1014_REPLAY_SCHEMA_VERSION } from './types';

export interface V1014ReplaySnapshotEncodeInput {
  matchId: string;
  turn: number;
  day: number;
  sequence: number;
  branchNodeId: string;
  isolatedBranchId?: string | null;
  metricsByDomain?: Partial<Record<V1014ReplayArchiveDomain, Record<string, number>>>;
  liveStateFingerprint?: string;
}

function encodeDomainSlice(
  defId: string,
  coordinate: V1014ReplayTurnCoordinate,
  metrics: Record<string, number>,
): V1014ReplayDomainSlice | null {
  const def = V1014_REPLAY_lookupArchiveSlice(defId);
  if (!def) return null;
  const scalarMetrics: Record<string, number> = {};
  const normalized = V1014_REPLAY_runSliceEncoderHandler(defId, metrics, def.encoderWeight);
  for (const key of def.metricKeys) {
    const base = Number(metrics[key] ?? metrics[`${def.domain}_${key}`] ?? normalized);
    scalarMetrics[key] = base + normalized * 0.001;
  }
  const sliceId = V1014_REPLAY_fingerprint('domain_slice', { defId, coordinate, scalarMetrics });
  return {
    sliceId,
    domain: def.domain,
    turnSpan: { from: coordinate.turn, to: coordinate.turn },
    scalarMetrics,
    recordRefs: def.diffRuleIds.slice(0, 3),
    deterministicFingerprint: sliceId,
  };
}

export function V1014_REPLAY_buildSnapshotHeader(input: V1014ReplaySnapshotEncodeInput): V1014ReplaySnapshotHeader {
  const coordinate: V1014ReplayTurnCoordinate = {
    turn: V1014_REPLAY_clampTurn(input.turn),
    day: V1014_REPLAY_clampTurn(input.day),
    sequence: Math.max(0, Math.floor(Number(input.sequence) || 0)),
    branchNodeId: String(input.branchNodeId || 'root'),
  };
  const payloadHash = V1014_REPLAY_fingerprint('snapshot_payload', {
    matchId: input.matchId,
    coordinate,
    metricsByDomain: input.metricsByDomain || {},
  });
  return {
    headerId: V1014_REPLAY_fingerprint('snapshot_header', payloadHash),
    matchId: String(input.matchId || 'unknown_match'),
    coordinate,
    encoderVersion: V1014_REPLAY_MODULE_VERSION,
    payloadHash,
    liveStateFingerprint: String(input.liveStateFingerprint || payloadHash),
    isolatedBranchId: input.isolatedBranchId ?? null,
  };
}

export function V1014_REPLAY_encodeSnapshot(input: V1014ReplaySnapshotEncodeInput): V1014ReplaySnapshotPayload {
  const header = V1014_REPLAY_buildSnapshotHeader(input);
  const domainSlices = {} as Record<V1014ReplayArchiveDomain, V1014ReplayDomainSlice>;
  const metricsByDomain = input.metricsByDomain || {};
  for (const def of V1014_REPLAY_ARCHIVE_SLICE_CATALOG) {
    if (def.regionCode !== 'NSW' && (header.coordinate.turn + def.encoderWeight) % 3 !== 0) {
      continue;
    }
    const metrics = metricsByDomain[def.domain] || {};
    const slice = encodeDomainSlice(def.id, header.coordinate, metrics);
    if (slice && !domainSlices[def.domain]) {
      domainSlices[def.domain] = slice;
    }
  }
  const encodedBlob = V1014_REPLAY_stableStringify({ header, domainSlices });
  return {
    header,
    encodedBlob,
    byteLength: encodedBlob.length,
    domainSlices,
  };
}

export function V1014_REPLAY_decodeSnapshot(blob: string): V1014ReplaySnapshotPayload | null {
  try {
    const parsed = JSON.parse(blob) as V1014ReplaySnapshotPayload;
    if (!parsed?.header?.headerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function V1014_REPLAY_pushArchiveRing(
  ring: V1014ReplaySnapshotPayload[],
  snapshot: V1014ReplaySnapshotPayload,
  maxLen = 48,
): V1014ReplaySnapshotPayload[] {
  return [...ring, snapshot].slice(-maxLen);
}
