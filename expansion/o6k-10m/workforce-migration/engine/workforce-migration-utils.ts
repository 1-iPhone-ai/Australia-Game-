import type { V1014WorkforceMigrationFlowBand, V1014WorkforceReadinessBand } from '../types/core';

export function V1014_WORKFORCE_clamp(value: number, lo: number, hi: number): number {
  if (!Number.isFinite(value)) return lo;
  return Math.min(hi, Math.max(lo, value));
}

export function V1014_WORKFORCE_mixSeed(seed: number, turn: number, tag: string): number {
  let h = (seed ^ turn * 2654435761) >>> 0;
  for (let i = 0; i < tag.length; i++) {
    h = Math.imul(h ^ tag.charCodeAt(i), 1597334677) >>> 0;
  }
  return (h % 10_000) / 10_000;
}

export function V1014_WORKFORCE_hash(payload: Record<string, unknown>): string {
  const s = JSON.stringify(payload);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `wf_${(h >>> 0).toString(16)}`;
}

export function V1014_WORKFORCE_flowBandRank(band: V1014WorkforceMigrationFlowBand): number {
  switch (band) {
    case 'surge':
      return 4;
    case 'balanced':
      return 3;
    case 'constrained':
      return 2;
    case 'outflow':
      return 1;
    default:
      return 2;
  }
}

export function V1014_WORKFORCE_readinessFromScore(score: number): V1014WorkforceReadinessBand {
  const s = V1014_WORKFORCE_clamp(score, 0, 100);
  if (s >= 72) return 'strong';
  if (s >= 58) return 'adequate';
  if (s >= 44) return 'strained';
  if (s >= 30) return 'weak';
  return 'blocking';
}

export function V1014_WORKFORCE_weightedMean(items: Array<{ weight: number; value: number }>): number {
  let wSum = 0;
  let vSum = 0;
  for (const it of items) {
    const w = Math.max(0, it.weight);
    wSum += w;
    vSum += w * it.value;
  }
  return wSum > 0 ? vSum / wSum : 0;
}
