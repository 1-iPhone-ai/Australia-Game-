import type { V1019MtrdLaneBand, V1019MtrdPortBand } from '../types/core';

export function V1019_MTRD_clamp(value: number, lo: number, hi: number): number {
  if (!Number.isFinite(value)) return lo;
  return Math.min(hi, Math.max(lo, value));
}

export function V1019_MTRD_mixSeed(seed: number, turn: number, tag: string): number {
  let h = (seed ^ turn * 2654435761) >>> 0;
  for (let i = 0; i < tag.length; i++) {
    h = Math.imul(h ^ tag.charCodeAt(i), 1597334677) >>> 0;
  }
  return (h % 10_000) / 10_000;
}

export function V1019_MTRD_hash(payload: Record<string, unknown>): string {
  const s = JSON.stringify(payload);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `mtrd_${(h >>> 0).toString(16)}`;
}

export function V1019_MTRD_laneBandRank(band: V1019MtrdLaneBand): number {
  switch (band) {
    case 'critical':
      return 5;
    case 'active':
      return 4;
    case 'emerging':
      return 3;
    case 'recovering':
      return 2;
    case 'latent':
    default:
      return 1;
  }
}

export function V1019_MTRD_portFromScore(score: number): V1019MtrdPortBand {
  const s = V1019_MTRD_clamp(score, 0, 100);
  if (s >= 74) return 'robust';
  if (s >= 60) return 'stable';
  if (s >= 46) return 'strained';
  if (s >= 32) return 'fragile';
  return 'critical';
}

export function V1019_MTRD_weightedMean(items: Array<{ weight: number; value: number }>): number {
  let wSum = 0;
  let vSum = 0;
  for (const it of items) {
    const w = Math.max(0, it.weight);
    wSum += w;
    vSum += w * it.value;
  }
  return wSum > 0 ? vSum / wSum : 0;
}

export function V1019_MTRD_laneGraphHash(edges: readonly { weight: number; lagTurns: number }[]): string {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    acc += edges[i].weight * 1000 + edges[i].lagTurns * 17 + i;
  }
  return `cg_${(acc >>> 0).toString(16)}`;
}
