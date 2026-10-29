import type {
  V1014EnergyDepthCarbonBand,
  V1014EnergyDepthDepletionBand,
  V1014EnergyDepthGridBand,
  V1014EnergyDepthIntermittencyBand,
  V1014EnergyDepthInputs,
  V1014EnergyDepthRegionId,
} from './types';

export function V1014_ENERGY_DEPTH_clamp(n: number, lo: number, hi: number): number {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

export function V1014_ENERGY_DEPTH_fnv1a(input: string, seed = 0x811c9dc5): number {
  let h = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function V1014_ENERGY_DEPTH_inputHash(i: V1014EnergyDepthInputs): string {
  const parts = [
    `t${i.turn}`,
    `e${i.enabled ? 1 : 0}`,
    `h${i.hourBucket}`,
    `ie${i.industrialEnergy?.nationalRenewableShare ?? 0}`,
    `c${i.activeCrises.length}`,
  ];
  (i.activeCrises || []).forEach(c => parts.push(`${c.id}:${c.status}`));
  return V1014_ENERGY_DEPTH_fnv1a(parts.join('|')).toString(36);
}

export function V1014_ENERGY_DEPTH_bandGrid(reserveMarginPct: number): V1014EnergyDepthGridBand {
  if (reserveMarginPct >= 22) return 'secure';
  if (reserveMarginPct >= 14) return 'comfortable';
  if (reserveMarginPct >= 6) return 'strained';
  if (reserveMarginPct >= 1) return 'critical';
  return 'blackout_risk';
}

export function V1014_ENERGY_DEPTH_bandDepletion(remainingRatio: number): V1014EnergyDepthDepletionBand {
  if (remainingRatio >= 0.75) return 'pristine';
  if (remainingRatio >= 0.5) return 'developing';
  if (remainingRatio >= 0.28) return 'mature';
  if (remainingRatio >= 0.08) return 'depleted';
  return 'exhausted';
}

export function V1014_ENERGY_DEPTH_bandIntermittency(sigma: number, renewableShare: number): V1014EnergyDepthIntermittencyBand {
  const stress = sigma * (0.35 + renewableShare * 0.65);
  if (stress < 0.08) return 'stable';
  if (stress < 0.16) return 'variable';
  if (stress < 0.28) return 'volatile';
  return 'extreme';
}

export function V1014_ENERGY_DEPTH_bandCarbon(
  cumulativeMt: number,
  budgetMt: number,
): V1014EnergyDepthCarbonBand {
  const ratio = budgetMt > 0 ? cumulativeMt / budgetMt : 0;
  if (ratio <= 0.85) return 'within_budget';
  if (ratio <= 1.0) return 'tight';
  if (ratio <= 1.15) return 'overshoot';
  return 'critical_overshoot';
}

export function V1014_ENERGY_DEPTH_applyHysteresisGrid(
  prev: V1014EnergyDepthGridBand | undefined,
  next: V1014EnergyDepthGridBand,
): V1014EnergyDepthGridBand {
  const rank: Record<V1014EnergyDepthGridBand, number> = {
    secure: 5,
    comfortable: 4,
    strained: 3,
    critical: 2,
    blackout_risk: 1,
  };
  if (!prev) return next;
  if (rank[next] < rank[prev] && rank[prev] - rank[next] === 1) return prev;
  return next;
}

export function V1014_ENERGY_DEPTH_modifierFromBands(
  grid: V1014EnergyDepthGridBand,
  carbon: V1014EnergyDepthCarbonBand,
  depletion: V1014EnergyDepthDepletionBand,
): { energy: number; mining: number } {
  const gridPen: Record<V1014EnergyDepthGridBand, number> = {
    secure: 0,
    comfortable: -1,
    strained: -4,
    critical: -8,
    blackout_risk: -12,
  };
  const carbonPen: Record<V1014EnergyDepthCarbonBand, number> = {
    within_budget: 0,
    tight: -1,
    overshoot: -3,
    critical_overshoot: -6,
  };
  const depletionPen: Record<V1014EnergyDepthDepletionBand, number> = {
    pristine: 1,
    developing: 0,
    mature: -2,
    depleted: -5,
    exhausted: -8,
  };
  const energy = V1014_ENERGY_DEPTH_clamp(
    gridPen[grid] + carbonPen[carbon],
    -18,
    12,
  );
  const mining = V1014_ENERGY_DEPTH_clamp(
    depletionPen[depletion] + Math.floor(carbonPen[carbon] / 2),
    -18,
    12,
  );
  return { energy, mining };
}

export function V1014_ENERGY_DEPTH_rankRegionsByStress(
  regions: Record<V1014EnergyDepthRegionId, { reserveMarginPct: number }>,
): V1014EnergyDepthRegionId[] {
  return (Object.keys(regions) as V1014EnergyDepthRegionId[]).sort(
    (a, b) => regions[a].reserveMarginPct - regions[b].reserveMarginPct,
  );
}
