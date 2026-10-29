/**
 * Shared utilities for V1014_AI_FIDELITY expansion shard.
 */

export function clampAiFidelity(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function aiFidelityMixSeed(seed: number, turn: number, tag: string): number {
  let h = (seed ^ turn * 2654435761) >>> 0;
  for (let i = 0; i < tag.length; i++) {
    h = Math.imul(h ^ tag.charCodeAt(i), 2246822519) >>> 0;
  }
  return (h % 1000) / 1000;
}

export function aiFidelityHash(obj: Record<string, unknown>): string {
  const s = JSON.stringify(obj);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

const EXEC_RANK: Record<string, number> = {
  blocked: 0,
  cautious: 1,
  normal: 2,
  accelerated: 3,
  autonomous: 4,
};

export function aiFidelityExecutionRank(band: string): number {
  return EXEC_RANK[band] ?? 2;
}

export function aiFidelityRouteRank(teamLoad: number, directiveCount: number): number {
  return clampAiFidelity(1 - teamLoad * 0.35 - directiveCount * 0.04, 0, 1);
}
