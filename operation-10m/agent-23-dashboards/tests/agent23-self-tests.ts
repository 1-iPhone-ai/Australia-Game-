import { nrDashBuildAuthSnapshot } from '../core/auth-snapshot.ts';
import { nrDashBuildHeatCells } from '../core/heat-matrix.ts';
import { nrDashBuildRegionMapNodes } from '../core/region-map-model.ts';
import { AGENT23_REGION_MAP_LAYOUT, COMM_REGION_CODES, NATIONAL_NETWORKS } from '../core/constants.ts';
import { nrDashClamp01, nrDashHistoryActivityWeight, nrDashOwnerLabel } from '../core/util.ts';
import { createAgent23LrFixture, createAgent23NsFixture } from './fixtures.ts';
import type { Agent23TestResult } from '../types.ts';

export function summarizeAgent23Tests(results: Agent23TestResult[]): {
  total: number;
  passed: number;
  failed: Agent23TestResult[];
} {
  const failed = results.filter(r => !r.passed);
  return { total: results.length, passed: results.length - failed.length, failed };
}

export function runAgent23SelfTests(): Agent23TestResult[] {
  const results: Agent23TestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a23_null_snap', 'Snapshot null when LR and NS missing', () => nrDashBuildAuthSnapshot(1, null, null, null) === null);

  check('a23_lr_only', 'LR-only snapshot has 8 regions and provenance', () => {
    const lr = createAgent23LrFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null);
    return Boolean(
      snap && snap.regions.length === COMM_REGION_CODES.length && snap.provenance.some(p => p.source === 'living_regions')
    );
  });

  check('a23_ns_only', 'NS-only snapshot exposes five network bars', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, null, ns, null);
    return Boolean(snap && snap.networks.length === 5 && snap.provenance.some(p => p.source === 'national_systems'));
  });

  check('a23_heat_full', 'Heat matrix covers region × network grid', () => {
    const ns = createAgent23NsFixture();
    const heat = nrDashBuildHeatCells(ns);
    const expected = Object.keys(ns.regions).length * NATIONAL_NETWORKS.length;
    return heat.cells.length === expected || `cells=${heat.cells.length} expected=${expected}`;
  });

  check('a23_map_layout', 'Strategic map layout lists eight AU codes', () => AGENT23_REGION_MAP_LAYOUT.length === 8);

  check('a23_map_nodes', 'Map nodes align to layout ids', () => {
    const snap = nrDashBuildAuthSnapshot(3, createAgent23LrFixture(), null, null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    return nodes.length === 8 && nodes.every(n => COMM_REGION_CODES.includes(n.regionId as (typeof COMM_REGION_CODES)[number]));
  });

  check('a23_activity_weight', 'History activity weight is bounded 0..1', () => {
    const w = nrDashHistoryActivityWeight([0, 2, 4]);
    return w > 0 && nrDashClamp01(1.5) === 1;
  });

  check('a23_owner_labels', 'Owner labels', () =>
    nrDashOwnerLabel('you') === 'You' && nrDashOwnerLabel('rival') === 'Rival' && nrDashOwnerLabel('unknown') === '—'
  );

  check('a23_merged_counts', 'Merged snapshot counts bottlenecks and deps from NS', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    return snap.bottleneckCount === 1 && snap.dependencyCount === 2 && snap.regions.find(r => r.regionId === 'NSW')?.owner === 'you';
  });

  for (const code of COMM_REGION_CODES) {
    check(`a23_region_${code.toLowerCase()}`, `Regional row includes ${code}`, () => {
      const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
      return snap.regions.some(r => r.regionId === code) || `missing ${code}`;
    });
  }

  for (const net of NATIONAL_NETWORKS) {
    check(`a23_net_${net}`, `Network bar includes ${net}`, () => {
      const snap = nrDashBuildAuthSnapshot(2, null, createAgent23NsFixture(), null)!;
      return snap.networks.some(n => n.network === net);
    });
  }

  check('a23_history_snippets', 'History snippets merge NS history and LR majors', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    return snap.historySnippets.length >= 2;
  });

  return results;
}

/** Merge hook name expected by Agent 25 assembly. */
export function runAgent23NationalRegionalDashboardSelfTests(): Agent23TestResult[] {
  return runAgent23SelfTests();
}
