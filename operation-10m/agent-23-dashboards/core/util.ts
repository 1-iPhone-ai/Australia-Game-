export function nrDashClamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

export function nrDashOwnerLabel(o: 'you' | 'rival' | 'neutral' | 'unknown'): string {
  return o === 'you' ? 'You' : o === 'rival' ? 'Rival' : o === 'neutral' ? 'Neutral' : '—';
}

/** Activity weight from momentum history span only (state field, no simulation). */
export function nrDashHistoryActivityWeight(history: number[]): number {
  const pts = (history || []).filter(v => Number.isFinite(v));
  if (pts.length < 2) return 0.35;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min;
  return nrDashClamp01(span / (Math.abs(max) + 1 || 1));
}
