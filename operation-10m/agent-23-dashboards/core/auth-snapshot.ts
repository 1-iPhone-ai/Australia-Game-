import {
  LR_DEV_LABEL,
  LR_ECON_LABEL,
  LR_MOMENTUM_LABEL,
  NATIONAL_NETWORK_ICON,
  NATIONAL_NETWORK_LABEL,
  NATIONAL_NETWORKS,
  NATIONAL_RESILIENCE_LABEL,
} from './constants.ts';
import { nrDashClamp01 } from './util.ts';
import type {
  LivingRegionsWorldView,
  NationalSystemsState,
  NrDashAuthSnapshot,
  NrDashNetworkBar,
  NrDashProvenance,
  NrDashRegionalRow,
} from '../types.ts';

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
      detail: `regions=${Object.keys(lr.state.regions).length} derived=${lr.state.derived.length}`,
    });
  }
  if (ns) {
    provenance.push({
      source: 'national_systems',
      revision: ns.revision,
      turn: ns.turn ?? turn,
      detail: `bottlenecks=${ns.bottlenecks.length} deps=${ns.dependencies.length}`,
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
          bottlenecks: x.bottlenecks,
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
            primaryConstraint: nsReg?.primaryConstraint ?? null,
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
    historySnippets: historySnippets.slice(0, 8),
  };
}
