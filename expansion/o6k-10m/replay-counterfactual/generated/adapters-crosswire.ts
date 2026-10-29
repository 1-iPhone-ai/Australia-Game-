/**
 * Cross-wire adapters — §6 replay slots, 20M/20AQ forecast lab, O6K-A23 dashboard tiles.
 */
import type { V1014ReplayPersistenceSlice, V1014ReplaySnapshotPayload, V1014ReplayTurnDiffReport } from './types';
import { V1014_REPLAY_SECTION6_KEYS, V1014_REPLAY_SECTION6_SLOT_IDS } from './persistence-keys';
import { V1014_REPLAY_encodeSnapshot } from './snapshot-encoder';

export interface V1014ReplaySection6SlotHookInput {
  gameState: Record<string, unknown>;
  slotId: (typeof V1014_REPLAY_SECTION6_SLOT_IDS)[number];
  matchId: string;
  turn: number;
  day: number;
  branchNodeId: string;
}

export function V1014_REPLAY_bindSection6ReplaySlot(input: V1014ReplaySection6SlotHookInput): V1014ReplayPersistenceSlice {
  const snapshot = V1014_REPLAY_encodeSnapshot({
    matchId: input.matchId,
    turn: input.turn,
    day: input.day,
    sequence: 0,
    branchNodeId: input.branchNodeId,
  });
  const prior = (input.gameState?.save as any)?.meta?.v1014?.replay_counterfactual as V1014ReplayPersistenceSlice | undefined;
  const section6SlotBindings = { ...(prior?.section6SlotBindings || {}), [input.slotId]: snapshot.header.headerId };
  return {
    schemaVersion: prior?.schemaVersion || 'v1014.replay_counterfactual.2',
    archiveRing: prior?.archiveRing?.length ? [...prior.archiveRing, snapshot].slice(-48) : [snapshot],
    activeBranch: prior?.activeBranch || null,
    lastDiffReportId: prior?.lastDiffReportId || null,
    section6SlotBindings,
  };
}

export interface V1014ReplayForecastLabOverlayInput {
  diffReport: V1014ReplayTurnDiffReport;
  scenarioPresetId?: string;
}

export function V1014_REPLAY_buildForecastLabOverlay(input: V1014ReplayForecastLabOverlayInput): Record<string, unknown> {
  return {
    source: 'v1014_replay_counterfactual',
    nonAuthoritative: true,
    section20M: { diagnosticsOnly: true, diffOps: input.diffReport.ops.length },
    section20AQ: { policyLabOverlay: true, reportId: input.diffReport.reportId },
    scenarioPresetId: input.scenarioPresetId || null,
    persistenceKey: V1014_REPLAY_SECTION6_KEYS.forecastOverlay,
  };
}

export interface V1014ReplayDashboardTileInput {
  snapshot: V1014ReplaySnapshotPayload | null;
  diffReport: V1014ReplayTurnDiffReport | null;
}

export function V1014_REPLAY_buildO6kA23DashboardTiles(input: V1014ReplayDashboardTileInput): Array<{ tileId: string; label: string; value: string }> {
  const snap = input.snapshot;
  const diff = input.diffReport;
  return [
    { tileId: 'replay_archive_depth', label: 'Archive depth', value: snap ? String(snap.byteLength) : '0' },
    { tileId: 'replay_branch', label: 'Branch', value: snap?.header.coordinate.branchNodeId || 'root' },
    { tileId: 'replay_diff_ops', label: 'Diff ops', value: diff ? String(diff.ops.length) : '0' },
    { tileId: 'replay_isolation', label: 'Isolation OK', value: diff?.branchIsolationVerified ? 'yes' : 'no' },
  ];
}

export function V1014_REPLAY_scrubberHook(turn: number, ring: V1014ReplaySnapshotPayload[]): V1014ReplaySnapshotPayload | null {
  const t = Math.max(1, Math.floor(turn));
  const matches = ring.filter(s => s.header.coordinate.turn <= t);
  return matches.length ? matches[matches.length - 1] : null;
}
