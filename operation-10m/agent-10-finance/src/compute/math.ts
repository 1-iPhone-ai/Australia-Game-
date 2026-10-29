export function finClamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function finRound(n: number, d = 1): number {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}
