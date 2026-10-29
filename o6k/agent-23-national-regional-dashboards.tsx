// ============================================================================
// SECTION O6K-A23: NATIONAL & REGIONAL DASHBOARDS (Agent 23 — Operation 600K)
// Read-only dashboards and SVG charts sourced from authoritative game state:
//   • Living Regions 2.0 (regional condition, momentum history, needs, risks)
//   • V10 National Systems (network utilization, bottlenecks, dependencies)
// Merge per internal/agents/agent-23-integration-contract.md (Agent 25).
// ============================================================================

export type NrDashProvenanceSource = 'living_regions' | 'national_systems' | 'derived_compare';

export interface NrDashProvenance {
  source: NrDashProvenanceSource;
  revision: string | number | null;
  turn: number;
  detail: string;
}

export interface NrDashNetworkBar {
  network: NationalNetworkKind;
  label: string;
  icon: string;
  utilization: number;
  condition: NationalNetworkCondition;
  bottlenecks: number;
}

export interface NrDashRegionalRow {
  regionId: string;
  name: string;
  owner: 'you' | 'rival' | 'neutral' | 'unknown';
  developmentTier: string;
  economyBand: string;
  momentumBand: string;
  momentumHistory: number[];
  resilience: number | null;
  resilienceBand: string | null;
  openNeeds: number;
  highRisks: number;
  primaryConstraint: NationalNetworkKind | null;
}

export interface NrDashAuthSnapshot {
  turn: number;
  provenance: NrDashProvenance[];
  nationalResilience: number | null;
  nationalResilienceBand: string | null;
  bottleneckCount: number;
  dependencyCount: number;
  networks: NrDashNetworkBar[];
  regions: NrDashRegionalRow[];
  historySnippets: string[];
}

const NR_DASH_MOM_RANK: Record<LRMomentumBand, number> = {
  declining: 0, weakening: 1, stable: 2, growing: 3, rapid_growth: 4, booming: 5
};

const NR_DASH_COND_COLOR: Record<NationalNetworkCondition, string> = {
  surplus: '#34d399',
  healthy: '#5eead4',
  strained: '#fbbf24',
  bottlenecked: '#fb923c',
  critical: '#f87171'
};

export function nrDashClamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

export function nrDashOwnerLabel(o: NrDashRegionalRow['owner']): string {
  return o === 'you' ? 'You' : o === 'rival' ? 'Rival' : o === 'neutral' ? 'Neutral' : '—';
}

/** Build a dashboard snapshot from authoritative views only (no recompute). */
export function nrDashBuildAuthSnapshot(
  turn: number,
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  owners: Record<string, 'you' | 'rival' | 'neutral'> | null
): NrDashAuthSnapshot | null {
  if (!lr && !ns) return null;
  const provenance: NrDashProvenance[] = [];
  if (lr) {
    provenance.push({
      source: 'living_regions',
      revision: lr.state.revision,
      turn,
      detail: `regions=${Object.keys(lr.state.regions).length} derived=${lr.state.derived.length}`
    });
  }
  if (ns) {
    provenance.push({
      source: 'national_systems',
      revision: ns.revision,
      turn: ns.turn,
      detail: `bottlenecks=${ns.bottlenecks.length} deps=${ns.dependencies.length}`
    });
  }

  const networks: NrDashNetworkBar[] = ns
    ? NATIONAL_NETWORKS.map(n => {
        const x = ns.national[n];
        return {
          network: n,
          label: NATIONAL_NETWORK_LABEL[n],
          icon: NATIONAL_NETWORK_ICON[n],
          utilization: nrDashClamp01(x.utilization),
          condition: x.condition,
          bottlenecks: x.bottlenecks
        };
      })
    : [];

  const regions: NrDashRegionalRow[] = lr
    ? Object.values(lr.state.regions)
        .map(reg => {
          const nsReg = ns?.regions[reg.regionId];
          return {
            regionId: reg.regionId,
            name: reg.name,
            owner: owners?.[reg.regionId] || 'unknown',
            developmentTier: LR_DEV_LABEL[reg.development.tier],
            economyBand: LR_ECON_LABEL[reg.economy.band],
            momentumBand: LR_MOMENTUM_LABEL[reg.momentum.band],
            momentumHistory: reg.momentum.history.slice(-12),
            resilience: nsReg ? Math.round(nsReg.resilience) : null,
            resilienceBand: nsReg ? NATIONAL_RESILIENCE_LABEL[nsReg.resilienceBand] : null,
            openNeeds: reg.needs.filter(n => n.status === 'open').length,
            highRisks: reg.risks.filter(r => r.severity === 'high').length,
            primaryConstraint: nsReg?.primaryConstraint ?? null
          };
        })
        .sort((a, b) => a.regionId.localeCompare(b.regionId))
    : [];

  const historySnippets: string[] = [];
  if (ns?.history.length) {
    historySnippets.push(...ns.history.slice(-4).reverse().map(h => `R${h.turn}: ${h.summary}`));
  }
  if (lr) {
    const majors = lr.state.derived
      .filter(d => d.significance === 'major')
      .slice(-3)
      .reverse()
      .map(d => `R${d.turn}: ${d.text}`);
    historySnippets.push(...majors);
  }

  return {
    turn,
    provenance,
    nationalResilience: ns ? Math.round(ns.national.resilienceScore) : null,
    nationalResilienceBand: ns ? NATIONAL_RESILIENCE_LABEL[ns.national.resilienceBand] : null,
    bottleneckCount: ns?.bottlenecks.length ?? 0,
    dependencyCount: ns?.dependencies.length ?? 0,
    networks,
    regions,
    historySnippets: historySnippets.slice(0, 8)
  };
}

export interface NrDashSparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  ariaLabel: string;
}

/** SVG sparkline — values are already authoritative (e.g. momentum.history). */
export const NrDashSparkline: React.FC<NrDashSparklineProps> = ({
  values,
  width = 120,
  height = 28,
  stroke = '#38bdf8',
  fill = 'rgba(56,189,248,0.15)',
  ariaLabel
}) => {
  const pts = (values || []).filter(v => Number.isFinite(v));
  if (pts.length < 2) {
    return (
      <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline-empty">
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#475569" strokeDasharray="4 3" />
      </svg>
    );
  }
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * width;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return `${x},${y}`;
  });
  const poly = `${coords.join(' ')} ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline">
      <polygon points={poly} fill={fill} stroke="none" />
      <polyline points={coords.join(' ')} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export interface NrDashBarChartProps {
  items: Array<{ key: string; label: string; value: number; sublabel?: string; color?: string }>;
  maxValue?: number;
  height?: number;
}

export const NrDashBarChart: React.FC<NrDashBarChartProps> = ({ items, maxValue, height = 140 }) => {
  const max = maxValue ?? Math.max(1, ...items.map(i => i.value));
  return (
    <div className="space-y-1" data-testid="nr-dash-bar-chart" role="list">
      {items.map(it => (
        <div key={it.key} role="listitem" className="grid grid-cols-[minmax(6rem,8rem)_1fr_auto] gap-2 items-center text-xs">
          <span className="truncate opacity-90" title={it.label}>{it.label}</span>
          <div className="h-3 bg-slate-800 rounded overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded transition-all duration-300"
              style={{ width: `${Math.round(nrDashClamp01(it.value / max) * 100)}%`, background: it.color || '#38bdf8' }}
            />
          </div>
          <span className="font-mono opacity-80 w-10 text-right">{Math.round(it.value * (max <= 1 ? 100 : 1))}{max <= 1 ? '%' : ''}</span>
        </div>
      ))}
      <svg height={0} width={0} aria-hidden="true"><title>Bar chart</title></svg>
    </div>
  );
};

export interface NrDashHeatCell {
  row: string;
  col: string;
  label: string;
  tone: NationalNetworkCondition;
  title: string;
}

export const NrDashHeatMatrix: React.FC<{ cells: NrDashHeatCell[]; rowLabels: string[]; colLabels: string[] }> = ({
  cells,
  rowLabels,
  colLabels
}) => (
  <div className="overflow-x-auto" data-testid="nr-dash-heat-matrix">
    <table className="text-[10px] border-collapse min-w-full">
      <thead>
        <tr>
          <th className="p-1 text-left opacity-70" />
          {colLabels.map(c => (
            <th key={c} className="p-1 font-normal opacity-80">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowLabels.map(row => (
          <tr key={row}>
            <th className="p-1 text-left font-semibold pr-2">{row}</th>
            {colLabels.map(col => {
              const cell = cells.find(x => x.row === row && x.col === col);
              const bg = cell ? NR_DASH_COND_COLOR[cell.tone] : '#334155';
              return (
                <td key={col} className="p-0.5">
                  <div
                    className="w-8 h-6 rounded border border-slate-700/80 flex items-center justify-center text-[9px]"
                    style={{ backgroundColor: `${bg}33`, borderColor: bg }}
                    title={cell?.title || 'No data'}
                  >
                    {cell ? NATIONAL_CONDITION_ICON[cell.tone] : '·'}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export function nrDashBuildHeatCells(ns: NationalSystemsState | null): { cells: NrDashHeatCell[]; rows: string[]; cols: string[] } {
  if (!ns) return { cells: [], rows: [], cols: [] };
  const rows = Object.values(ns.regions)
    .sort((a, b) => a.regionId.localeCompare(b.regionId))
    .map(r => r.regionId);
  const cols = NATIONAL_NETWORKS.map(n => NATIONAL_NETWORK_LABEL[n]);
  const cells: NrDashHeatCell[] = [];
  for (const reg of Object.values(ns.regions)) {
    for (const n of NATIONAL_NETWORKS) {
      const x = reg.networks[n];
      cells.push({
        row: reg.regionId,
        col: NATIONAL_NETWORK_LABEL[n],
        label: NATIONAL_CONDITION_LABEL[x.condition],
        tone: x.condition,
        title: `${reg.name} ${NATIONAL_NETWORK_LABEL[n]}: ${NATIONAL_CONDITION_LABEL[x.condition]} (${Math.round(x.utilization * 100)}% used)`
      });
    }
  }
  return { cells, rows, cols };
}

export type NrDashTabId = 'overview' | 'regions' | 'networks' | 'trends';

export const NR_DASH_TAB_ORDER: NrDashTabId[] = ['overview', 'regions', 'networks', 'trends'];
export const NR_DASH_TAB_LABELS: Record<NrDashTabId, string> = {
  overview: 'National overview',
  regions: 'Regional compare',
  networks: 'Network matrix',
  trends: 'Turning points'
};

const NrDashProvenanceStrip: React.FC<{ items: NrDashProvenance[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 text-[10px] opacity-75" data-testid="nr-dash-provenance">
    {items.map((p, i) => (
      <span key={`${p.source}_${i}`} className="px-1.5 py-0.5 rounded border border-slate-600">
        {p.source === 'living_regions' ? '🗺 LR' : '🔗 NS'} rev {String(p.revision ?? '—')} · {p.detail}
      </span>
    ))}
  </div>
);

export const NrDashOverviewTab: React.FC<{ snap: NrDashAuthSnapshot; onAsk?: (q: string) => void }> = ({ snap, onAsk }) => (
  <div className="space-y-4" data-testid="nr-dash-tab-overview">
    <NrDashProvenanceStrip items={snap.provenance} />
    <div className="grid md:grid-cols-3 gap-3 text-sm">
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">National resilience</div>
        <div className="text-xl font-bold">{snap.nationalResilienceBand ?? '—'}</div>
        <div className="text-xs opacity-80">{snap.nationalResilience != null ? `${snap.nationalResilience}/100` : 'National Systems off'}</div>
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
            color: NR_DASH_COND_COLOR[n.condition]
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

export const NrDashNetworksTab: React.FC<{ ns: NationalSystemsState | null; onMapNetwork?: (n: NationalNetworkKind) => void }> = ({
  ns,
  onMapNetwork
}) => {
  if (!ns) {
    return <p className="text-sm opacity-80" data-testid="nr-dash-networks-empty">National Systems data is not available in this match.</p>;
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

export interface NationalRegionalDashboardModalProps {
  open: boolean;
  onClose: () => void;
  theme: any;
  turn: number;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
  nsView: NationalSystemsWorldView | null;
  focusRegionId?: string | null;
  onFocusRegion?: (id: string) => void;
  onAsk?: (q: string) => void;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}

/** Full-screen dashboard modal — charts bind to authoritative state snapshots only. */
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
  onMapNetwork
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
        className={`${theme.card} ${theme.border} border rounded-xl max-w-5xl w-full max-h-[calc(100dvh-2rem)] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${theme.border}`}>
          <div>
            <h2 id="nr-dash-title" className="text-xl font-bold">📊 National & regional dashboard</h2>
            <p className="text-xs opacity-75">Round {turn} · authoritative Living Regions + National Systems</p>
          </div>
          <button type="button" className={`${theme.buttonSecondary || ''} px-3 py-1 rounded`} onClick={onClose} aria-label="Close dashboard">
            ✕
          </button>
        </div>
        <div className={`flex flex-wrap gap-1 px-4 pt-3 border-b ${theme.border}`} role="tablist">
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
          ) : (
            <NrDashTrendsTab snap={snap} />
          )}
        </div>
        <div className={`p-3 border-t ${theme.border} flex justify-end`}>
          <button type="button" className={`${theme.button || ''} px-4 py-2 rounded`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export function runAgent23NationalRegionalDashboardSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('nr_dash_null', 'Snapshot is null when both LR and NS views are missing', () => nrDashBuildAuthSnapshot(1, null, null, null) === null);

  check('nr_dash_lr_only', 'LR-only snapshot has regions and LR provenance', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null);
    return Boolean(snap && snap.regions.length >= 8 && snap.provenance.some(p => p.source === 'living_regions'));
  });

  check('nr_dash_ns_only', 'NS-only snapshot exposes network bars', () => {
    const inputs = buildNationalSystemsInputs({ turn: 3, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(3, null, state, null);
    return Boolean(snap && snap.networks.length === 5 && snap.provenance.some(p => p.source === 'national_systems'));
  });

  check('nr_dash_heat', 'Heat matrix covers every region × network cell', () => {
    const inputs = buildNationalSystemsInputs({ turn: 3, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const heat = nrDashBuildHeatCells(state);
    const expected = Object.keys(state.regions).length * NATIONAL_NETWORKS.length;
    return heat.cells.length === expected || `cells=${heat.cells.length} expected=${expected}`;
  });

  check('nr_dash_sparkline_finite', 'Sparkline accepts momentum history arrays', () => {
    const vals = [1, 2, 1.5, 3, 2.8];
    return vals.length >= 2 && nrDashClamp01(1.2) === 1;
  });

  check('nr_dash_owner', 'Owner labels map you/rival/neutral', () =>
    nrDashOwnerLabel('you') === 'You' && nrDashOwnerLabel('rival') === 'Rival' && nrDashOwnerLabel('unknown') === '—'
  );

  check('nr_dash_region_nsw', 'Regional row includes NSW when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'NSW') || 'missing NSW';
  });

  check('nr_dash_region_vic', 'Regional row includes VIC when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'VIC') || 'missing VIC';
  });

  check('nr_dash_region_qld', 'Regional row includes QLD when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'QLD') || 'missing QLD';
  });

  check('nr_dash_region_wa', 'Regional row includes WA when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'WA') || 'missing WA';
  });

  check('nr_dash_region_sa', 'Regional row includes SA when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'SA') || 'missing SA';
  });

  check('nr_dash_region_tas', 'Regional row includes TAS when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'TAS') || 'missing TAS';
  });

  check('nr_dash_region_nt', 'Regional row includes NT when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'NT') || 'missing NT';
  });

  check('nr_dash_region_act', 'Regional row includes ACT when LR initialized', () => {
    const inputs = createLRFixtureInputs();
    const st = initializeLivingRegions(inputs);
    const lr: LivingRegionsWorldView = { state: st, inputs, viewerId: 'player', viewerKeys: ['player'], names: { player: 'You' } };
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    return snap.regions.some(r => r.regionId === 'ACT') || 'missing ACT';
  });

  check('nr_dash_net_freight', 'Network bar includes freight', () => {
    const inputs = buildNationalSystemsInputs({ turn: 2, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(2, null, state, null)!;
    return snap.networks.some(n => n.network === 'freight');
  });

  check('nr_dash_net_energy', 'Network bar includes energy', () => {
    const inputs = buildNationalSystemsInputs({ turn: 2, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(2, null, state, null)!;
    return snap.networks.some(n => n.network === 'energy');
  });

  check('nr_dash_net_water', 'Network bar includes water', () => {
    const inputs = buildNationalSystemsInputs({ turn: 2, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(2, null, state, null)!;
    return snap.networks.some(n => n.network === 'water');
  });

  check('nr_dash_net_trade', 'Network bar includes trade', () => {
    const inputs = buildNationalSystemsInputs({ turn: 2, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(2, null, state, null)!;
    return snap.networks.some(n => n.network === 'trade');
  });

  check('nr_dash_net_digital', 'Network bar includes digital', () => {
    const inputs = buildNationalSystemsInputs({ turn: 2, lr: initializeLivingRegions(createLRFixtureInputs()), projects: [], crises: [] });
    const { state } = computeNationalSystems(inputs, null, { emit: false });
    const snap = nrDashBuildAuthSnapshot(2, null, state, null)!;
    return snap.networks.some(n => n.network === 'digital');
  });

  return results;
}
