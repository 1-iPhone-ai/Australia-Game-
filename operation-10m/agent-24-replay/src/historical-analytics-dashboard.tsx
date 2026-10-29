import { useCallback, useMemo, useState } from 'react';
import type { O6kHistoricalAnalyticsSnapshot } from './history-replay-analytics.ts';

export type O6kHistoricalAnalyticsDashboardTab = 'overview' | 'milestones' | 'timelines' | 'replay' | 'integrity';

const O6K_HISTORICAL_TAB_ORDER: O6kHistoricalAnalyticsDashboardTab[] = ['overview', 'milestones', 'timelines', 'replay', 'integrity'];
const O6K_HISTORICAL_TAB_LABELS: Record<O6kHistoricalAnalyticsDashboardTab, string> = {
  overview: 'Overview',
  milestones: 'Milestones',
  timelines: 'Timelines',
  replay: 'Replay Link',
  integrity: 'Integrity',
};

export interface O6kHistoricalAnalyticsDashboardProps {
  snapshot: O6kHistoricalAnalyticsSnapshot | null;
  onClose: () => void;
  themeClass?: string;
}

export function O6kHistoricalAnalyticsDashboard(props: O6kHistoricalAnalyticsDashboardProps) {
  const { snapshot, onClose, themeClass = 'bg-gray-900 text-white' } = props;
  const [tab, setTab] = useState<O6kHistoricalAnalyticsDashboardTab>('overview');
  const topMilestones = useMemo(() => {
    if (!snapshot) return [];
    return [...snapshot.milestoneHits].sort((x, y) => y.weight - x.weight || y.turn - x.turn).slice(0, 12);
  }, [snapshot]);
  const onTab = useCallback((id: O6kHistoricalAnalyticsDashboardTab) => setTab(id), []);
  if (!snapshot) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center p-4 ${themeClass}`}>
        <div className="max-w-lg w-full rounded-lg border border-gray-600 p-6">
          <p className="text-sm opacity-80">No historical analytics snapshot yet. Play turns or load a replay to populate milestones.</p>
          <button type="button" className="mt-4 px-4 py-2 rounded bg-blue-600" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  return (
    <div className={`fixed inset-0 flex items-start justify-center p-4 overflow-y-auto ${themeClass}`} onClick={onClose}>
      <div className="max-w-5xl w-full rounded-xl border border-gray-600 bg-black/40 p-4 my-8" onClick={e => e.stopPropagation()}>
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Historical Analytics — Match {snapshot.matchId}</h2>
          <button type="button" className="px-3 py-1 rounded bg-gray-700 text-sm" onClick={onClose}>Close</button>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {O6K_HISTORICAL_TAB_ORDER.map(id => (
            <button key={id} type="button" className={`px-3 py-1 rounded text-sm ${tab === id ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => onTab(id)}>{O6K_HISTORICAL_TAB_LABELS[id]}</button>
          ))}
        </div>
        {tab === 'overview' && (
          <div className="space-y-2 text-sm">
            <p>Turn {snapshot.generatedAtTurn} · Day {snapshot.generatedAtDay} · Timeline {snapshot.activeTimelineId}</p>
            <p>Milestone hits: {snapshot.milestoneHits.length} · Branches: {snapshot.replayBranchNodeIds.length}</p>
            <p className="font-mono text-xs opacity-75">Integrity: {snapshot.integrity.fingerprint}</p>
          </div>
        )}
        {tab === 'milestones' && (
          <ul className="space-y-2 text-sm max-h-96 overflow-y-auto">
            {topMilestones.map(m => (
              <li key={m.fingerprint} className="border border-gray-700 rounded p-2">
                <div className="font-semibold">{m.title} <span className="opacity-60">({m.category})</span></div>
                <div className="text-xs opacity-75">Turn {m.turn} · weight {m.weight} · {m.fingerprint}</div>
              </li>
            ))}
          </ul>
        )}
        {tab === 'timelines' && (
          <div className="space-y-3 text-sm">
            {snapshot.timelineSlices.map(s => (
              <div key={s.sliceId} className="border border-gray-700 rounded p-3">
                <div className="font-semibold">{s.timelineId} · turns {s.fromTurn}–{s.toTurn}</div>
                <div className="text-xs font-mono opacity-75">{s.deterministicFingerprint}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'replay' && (
          <div className="text-sm space-y-2">
            <p>Replay events recorded: {snapshot.integrity.replayEventCount}</p>
            <p>Checkpoints: {snapshot.integrity.checkpointCount}</p>
            <p className="opacity-75">Cross-link with Replay Dashboard branches: {snapshot.replayBranchNodeIds.join(', ') || 'main only'}</p>
          </div>
        )}
        {tab === 'integrity' && (
          <div className="text-sm space-y-2">
            <p>Deterministic mode: {snapshot.integrity.deterministicMode ? 'ON' : 'OFF'}</p>
            <p className="font-mono text-xs break-all">{snapshot.integrity.fingerprint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

