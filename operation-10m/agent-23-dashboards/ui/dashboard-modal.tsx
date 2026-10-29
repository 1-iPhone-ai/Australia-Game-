import React, { useEffect, useMemo, useState } from 'react';
import { nrDashBuildAuthSnapshot } from '../core/auth-snapshot.ts';
import { nrDashBuildHeatCells } from '../core/heat-matrix.ts';
import { nrDashBuildRegionMapNodes } from '../core/region-map-model.ts';
import {
  NATIONAL_NETWORKS,
  NATIONAL_NETWORK_ICON,
  NATIONAL_NETWORK_LABEL,
  NR_DASH_COND_COLOR,
  NR_DASH_TAB_LABELS,
  NR_DASH_TAB_ORDER,
} from '../core/constants.ts';
import { nrDashOwnerLabel } from '../core/util.ts';
import type {
  LivingRegionsWorldView,
  NationalNetworkKind,
  NationalSystemsState,
  NationalSystemsWorldView,
  NrDashAuthSnapshot,
  NrDashProvenance,
  NrDashTabId,
} from '../types.ts';
import { NrDashBarChart, NrDashHeatMatrix, NrDashSparkline } from './charts.tsx';
import { RegionPositionMap } from './region-position-map.tsx';

const NrDashProvenanceStrip: React.FC<{ items: NrDashProvenance[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 text-[10px] opacity-75" data-testid="nr-dash-provenance">
    {items.map((p, i) => (
      <span key={`${p.source}_${i}`} className="px-1.5 py-0.5 rounded border border-slate-600">
        {p.source === 'living_regions' ? '🗺 LR' : '🔗 NS'} rev {String(p.revision ?? '—')} · {p.detail}
      </span>
    ))}
  </div>
);

export const NrDashOverviewTab: React.FC<{ snap: NrDashAuthSnapshot; onAsk?: (q: string) => void }> = ({
  snap,
  onAsk,
}) => (
  <div className="space-y-4" data-testid="nr-dash-tab-overview">
    <NrDashProvenanceStrip items={snap.provenance} />
    <div className="grid md:grid-cols-3 gap-3 text-sm">
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">National resilience</div>
        <div className="text-xl font-bold">{snap.nationalResilienceBand ?? '—'}</div>
        <div className="text-xs opacity-80">
          {snap.nationalResilience != null ? `${snap.nationalResilience}/100` : 'National Systems off'}
        </div>
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Active bottlenecks</div>
        <div className="text-xl font-bold">{snap.bottleneckCount}</div>
        {onAsk && (
          <button type="button" className="text-xs underline mt-1" onClick={() => onAsk('Where are the national bottlenecks?')}>
            Ask Game AI
          </button>
        )}
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Interregional dependencies</div>
        <div className="text-xl font-bold">{snap.dependencyCount}</div>
      </div>
    </div>
    {snap.networks.length > 0 && (
      <div>
        <h4 className="font-bold text-sm mb-2">Network utilization (authoritative)</h4>
        <NrDashBarChart
          items={snap.networks.map(n => ({
            key: n.network,
            label: `${n.icon} ${n.label}`,
            value: n.utilization,
            color: NR_DASH_COND_COLOR[n.condition],
          }))}
          maxValue={1}
        />
      </div>
    )}
  </div>
);

export const NrDashRegionsTab: React.FC<{
  snap: NrDashAuthSnapshot;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, focusRegionId, onFocusRegion }) => (
  <div className="space-y-2" data-testid="nr-dash-tab-regions">
    <NrDashProvenanceStrip items={snap.provenance.filter(p => p.source === 'living_regions')} />
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="opacity-70 text-left border-b border-slate-700">
            <th className="py-1 pr-2">Region</th>
            <th className="py-1 pr-2">Owner</th>
            <th className="py-1 pr-2">Economy</th>
            <th className="py-1 pr-2">Momentum</th>
            <th className="py-1 pr-2">Trend</th>
            <th className="py-1 pr-2">Needs</th>
            <th className="py-1 pr-2">Resilience</th>
          </tr>
        </thead>
        <tbody>
          {snap.regions.map(r => {
            const focused = focusRegionId === r.regionId;
            return (
              <tr
                key={r.regionId}
                className={`border-b border-slate-800/80 ${focused ? 'bg-sky-950/40' : ''}`}
                data-testid={`nr-dash-region-row-${r.regionId}`}
              >
                <td className="py-1 pr-2">
                  <button type="button" className="font-semibold underline" onClick={() => onFocusRegion?.(r.regionId)}>
                    {r.name}
                  </button>
                  <div className="opacity-60">{r.developmentTier}</div>
                </td>
                <td className="py-1 pr-2">{nrDashOwnerLabel(r.owner)}</td>
                <td className="py-1 pr-2">{r.economyBand}</td>
                <td className="py-1 pr-2">{r.momentumBand}</td>
                <td className="py-1 pr-2">
                  <NrDashSparkline values={r.momentumHistory} ariaLabel={`${r.name} momentum history`} width={100} height={24} />
                </td>
                <td className="py-1 pr-2">{r.openNeeds || '—'}</td>
                <td className="py-1 pr-2">{r.resilienceBand ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const NrDashNetworksTab: React.FC<{
  ns: NationalSystemsState | null;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}> = ({ ns, onMapNetwork }) => {
  if (!ns) {
    return (
      <p className="text-sm opacity-80" data-testid="nr-dash-networks-empty">
        National Systems data is not available in this match.
      </p>
    );
  }
  const heat = nrDashBuildHeatCells(ns);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-networks">
      <div className="flex flex-wrap gap-2">
        {NATIONAL_NETWORKS.map(n => (
          <button
            key={n}
            type="button"
            className="text-xs px-2 py-1 rounded border border-slate-600 hover:border-sky-500"
            onClick={() => onMapNetwork?.(n)}
          >
            {NATIONAL_NETWORK_ICON[n]} Map {NATIONAL_NETWORK_LABEL[n]}
          </button>
        ))}
      </div>
      <NrDashHeatMatrix cells={heat.cells} rowLabels={heat.rows} colLabels={heat.cols} />
      <p className="text-[10px] opacity-70">Cell color reflects network condition from National Systems (not Living Regions).</p>
    </div>
  );
};

export const NrDashTrendsTab: React.FC<{ snap: NrDashAuthSnapshot }> = ({ snap }) => (
  <div data-testid="nr-dash-tab-trends">
    <NrDashProvenanceStrip items={snap.provenance} />
    {snap.historySnippets.length ? (
      <ol className="text-xs space-y-1 mt-2 list-decimal list-inside">
        {snap.historySnippets.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    ) : (
      <p className="text-sm opacity-80">No national or major regional turning points recorded yet.</p>
    )}
  </div>
);

export const NrDashMapTab: React.FC<{
  snap: NrDashAuthSnapshot;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, focusRegionId, onFocusRegion }) => {
  const nodes = useMemo(() => nrDashBuildRegionMapNodes(snap), [snap]);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-map">
      <NrDashProvenanceStrip items={snap.provenance} />
      <RegionPositionMap nodes={nodes} focusRegionId={focusRegionId} onSelect={onFocusRegion} />
      <p className="text-[10px] opacity-70">
        Node size reflects momentum history span from Living Regions; ring color reflects map owner view from National Systems.
      </p>
    </div>
  );
};

export interface NationalRegionalDashboardModalProps {
  open: boolean;
  onClose: () => void;
  theme: { card?: string; border?: string; button?: string; buttonSecondary?: string; scrollbar?: string };
  turn: number;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
  nsView: NationalSystemsWorldView | null;
  focusRegionId?: string | null;
  onFocusRegion?: (id: string) => void;
  onAsk?: (q: string) => void;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}

export const NationalRegionalDashboardModal: React.FC<NationalRegionalDashboardModalProps> = ({
  open,
  onClose,
  theme,
  turn,
  lrView,
  nsState,
  nsView,
  focusRegionId = null,
  onFocusRegion,
  onAsk,
  onMapNetwork,
}) => {
  const [tab, setTab] = useState<NrDashTabId>('overview');
  useEffect(() => {
    if (open) setTab('overview');
  }, [open]);
  const snap = useMemo(
    () => nrDashBuildAuthSnapshot(turn, lrView, nsState, nsView?.regionOwners || null),
    [turn, lrView, nsState, nsView]
  );
  if (!open) return null;
  const card = theme.card || '';
  const border = theme.border || 'border-slate-700';
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 overflow-y-auto z-[9600]"
      data-testid="national-regional-dashboard-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nr-dash-title"
    >
      <div
        className={`${card} ${border} border rounded-xl max-w-5xl w-full max-h-[calc(100dvh-2rem)] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${border}`}>
          <div>
            <h2 id="nr-dash-title" className="text-xl font-bold">
              📊 National & regional dashboard
            </h2>
            <p className="text-xs opacity-75">Round {turn} · authoritative Living Regions + National Systems</p>
          </div>
          <button
            type="button"
            className={`${theme.buttonSecondary || ''} px-3 py-1 rounded`}
            onClick={onClose}
            aria-label="Close dashboard"
          >
            ✕
          </button>
        </div>
        <div className={`flex flex-wrap gap-1 px-4 pt-3 border-b ${border}`} role="tablist">
          {NR_DASH_TAB_ORDER.map(id => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`px-3 py-1.5 text-xs rounded-t border-b-2 ${tab === id ? 'border-sky-400 font-bold' : 'border-transparent opacity-70'}`}
              onClick={() => setTab(id)}
            >
              {NR_DASH_TAB_LABELS[id]}
            </button>
          ))}
        </div>
        <div className={`flex-1 overflow-y-auto p-4 ${theme.scrollbar || ''}`}>
          {!snap ? (
            <p className="text-sm opacity-80">Enable Living Regions or National Systems to populate this dashboard.</p>
          ) : tab === 'overview' ? (
            <NrDashOverviewTab snap={snap} onAsk={onAsk} />
          ) : tab === 'regions' ? (
            <NrDashRegionsTab snap={snap} focusRegionId={focusRegionId} onFocusRegion={onFocusRegion} />
          ) : tab === 'networks' ? (
            <NrDashNetworksTab ns={nsState} onMapNetwork={onMapNetwork} />
          ) : tab === 'map' ? (
            <NrDashMapTab snap={snap} focusRegionId={focusRegionId} onFocusRegion={onFocusRegion} />
          ) : (
            <NrDashTrendsTab snap={snap} />
          )}
        </div>
        <div className={`p-3 border-t ${border} flex justify-end`}>
          <button type="button" className={`${theme.button || ''} px-4 py-2 rounded`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
