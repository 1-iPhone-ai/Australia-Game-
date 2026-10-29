/**
 * V10.14 replay counterfactual — core types (T6-3 / Agent 24 depth pass).
 * Symbol prefix: V1014_REPLAY_*
 */
export const V1014_REPLAY_MODULE_VERSION = '2.0.0';
export const V1014_REPLAY_MODULE_ID = 'replay_counterfactual_analytics';
export const V1014_REPLAY_SCHEMA_VERSION = 'v1014.replay_counterfactual.2';

export type V1014ReplayArchiveDomain = typeof V1014_REPLAY_ARCHIVE_DOMAINS[number];
export const V1014_REPLAY_ARCHIVE_DOMAINS = [
  'macro', 'fiscal', 'trade', 'labor', 'energy', 'household',
  'diplomacy', 'crisis', 'infrastructure', 'forecast',
] as const;

export type V1014ReplayDiffKind = typeof V1014_REPLAY_DIFF_KINDS[number];
export const V1014_REPLAY_DIFF_KINDS = [
  'scalar_delta', 'record_patch', 'array_splice', 'branch_fork',
  'rng_stream', 'ledger_event', 'replay_checkpoint', 'counterfactual_overlay',
] as const;

export interface V1014ReplayTurnCoordinate {
  turn: number;
  day: number;
  sequence: number;
  branchNodeId: string;
}

export interface V1014ReplaySnapshotHeader {
  headerId: string;
  matchId: string;
  coordinate: V1014ReplayTurnCoordinate;
  encoderVersion: string;
  payloadHash: string;
  liveStateFingerprint: string;
  isolatedBranchId: string | null;
}

export interface V1014ReplaySnapshotPayload {
  header: V1014ReplaySnapshotHeader;
  encodedBlob: string;
  byteLength: number;
  domainSlices: Record<V1014ReplayArchiveDomain, V1014ReplayDomainSlice>;
}

export interface V1014ReplayDomainSlice {
  sliceId: string;
  domain: V1014ReplayArchiveDomain;
  turnSpan: { from: number; to: number };
  scalarMetrics: Record<string, number>;
  recordRefs: string[];
  deterministicFingerprint: string;
}

export interface V1014ReplayTurnDiffOp {
  opId: string;
  kind: V1014ReplayDiffKind;
  path: string;
  fromValue: unknown;
  toValue: unknown;
  magnitude: number;
  ruleId: string;
  coordinate: V1014ReplayTurnCoordinate;
}

export interface V1014ReplayTurnDiffReport {
  reportId: string;
  baseSnapshotId: string;
  headSnapshotId: string;
  ops: V1014ReplayTurnDiffOp[];
  netScalarDelta: number;
  branchIsolationVerified: boolean;
  fingerprint: string;
}

export interface V1014ReplayBranchIsolationEnvelope {
  envelopeId: string;
  liveStateRef: string;
  sandboxStateRef: string;
  parentBranchNodeId: string;
  childBranchNodeId: string;
  rngStreamsCopied: number;
  counterfactualOnly: boolean;
  corruptionGuard: { liveMutationsBlocked: boolean; reason: string };
}

export interface V1014ReplayCounterfactualBranch {
  branchId: string;
  label: string;
  forkCoordinate: V1014ReplayTurnCoordinate;
  presetId: string;
  overlayFingerprint: string;
  authoritative: false;
}

export interface V1014ReplayPersistenceSlice {
  schemaVersion: string;
  archiveRing: V1014ReplaySnapshotPayload[];
  activeBranch: V1014ReplayCounterfactualBranch | null;
  lastDiffReportId: string | null;
  section6SlotBindings: Record<string, string>;
}

export interface V1014ReplaySelfTestResult {
  caseName: string;
  passed: boolean;
  detail: string;
  durationMs?: number;
}
