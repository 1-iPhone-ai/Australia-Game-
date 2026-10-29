export function gtelNum(v: unknown, d = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
}

export function gtelClamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function gtelHash(parts: unknown[]): string {
  return parts
    .map(p => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    })
    .join('|')
    .slice(0, 240);
}

export function gtelAssert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`Agent15 GTEL: ${msg}`);
}
