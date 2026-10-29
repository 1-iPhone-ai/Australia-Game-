/** Shared deterministic helpers for V1014_TRADE_DEPTH. */

export function clampTradeDepth(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function tradeDepthHash(payload: Record<string, unknown>): string {
  const s = JSON.stringify(payload);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `td_${(h >>> 0).toString(16)}`;
}

export function tradeDepthMixSeed(seed: number, turn: number, salt: string): number {
  let x = (seed ^ turn) >>> 0;
  for (let i = 0; i < salt.length; i++) {
    x = Math.imul(x ^ salt.charCodeAt(i), 2654435761) >>> 0;
  }
  return (x % 10000) / 10000;
}

export function tradeDepthAccessRank(band: string): number {
  switch (band) {
    case 'blocked':
      return 0;
    case 'restricted':
      return 1;
    case 'normal':
      return 2;
    case 'preferred':
      return 3;
    case 'strategic':
      return 4;
    default:
      return 2;
  }
}
