import type {
  OP10M_A11_RegionalBottleneck,
  OP10M_A11_RegionId,
  OP10M_A11_ReliefPlaybookItem,
  OP10M_A11_UrbanHierarchyRow,
} from './types.ts';

export function op10mA11BuildReliefPlaybook(args: {
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  hierarchy: OP10M_A11_UrbanHierarchyRow[];
  weakLinkageRegions: OP10M_A11_RegionId[];
}): OP10M_A11_ReliefPlaybookItem[] {
  const out: OP10M_A11_ReliefPlaybookItem[] = [];

  for (const rid of args.weakLinkageRegions) {
    out.push({
      regionId: rid,
      priority: 'medium',
      actions: [
        'Restore redundant intercity corridor capacity',
        'Prioritize strategic freight/digital backbone upgrades',
      ],
      rationale: `${rid} sits on multiple weak regional linkages — growth spillovers are fragile.`,
    });
  }

  for (const b of args.bottlenecks) {
    const h = args.hierarchy.find((x) => x.regionId === b.regionId);
    const actions: string[] = [];
    if (b.drivers.some((d) => d.includes('transport need'))) {
      actions.push('Clear open transport infrastructure needs before new urban projects');
    }
    if (b.drivers.some((d) => d.includes('headroom'))) {
      actions.push('Sequence housing/transport absorption projects in gateway cities');
    }
    if (b.drivers.some((d) => d.includes('infrastructure'))) {
      actions.push('Target regional infrastructure quality uplift (not cash transfers)');
    }
    if (h && (h.primateBand === 'concentrated' || h.primateBand === 'hyper_concentrated')) {
      actions.push('Seed secondary-city growth programs to reduce primate concentration');
    }
    if (!actions.length) actions.push('Monitor binding constraints; no automatic capital dispatch');

    const priority =
      b.severity === 'critical' ? 'urgent' : b.severity === 'meaningful' ? 'high' : 'medium';

    out.push({
      regionId: b.regionId,
      priority,
      actions: actions.slice(0, 4),
      rationale: b.explanation,
    });
  }

  const byRegion = new Map<OP10M_A11_RegionId, OP10M_A11_ReliefPlaybookItem>();
  for (const item of out) {
    const prev = byRegion.get(item.regionId);
    if (!prev || item.priority === 'urgent' || (item.priority === 'high' && prev.priority !== 'urgent')) {
      byRegion.set(item.regionId, item);
    }
  }
  return [...byRegion.values()].sort((a, b) => {
    const rank = { urgent: 4, high: 3, medium: 2, low: 1 };
    return rank[b.priority] - rank[a.priority];
  });
}
