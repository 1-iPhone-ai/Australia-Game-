import type { OP10M_A11_GrowthBand, OP10M_A11_InequalityBand } from './types.ts';

export const OP10M_A11_LIMITS = {
  history: 24,
  derivedPerTurn: 12,
  inequalityIndexCap: 100,
} as const;

export const OP10M_A11_THRESHOLDS = {
  inequalityBalanced: 18,
  inequalityModerate: 32,
  inequalityWide: 48,
  metroGapMeaningful: 14,
  spilloverWeak: 28,
  spilloverConnected: 52,
  spilloverIntegrated: 72,
  catchUpDelta: 6,
  widenDelta: 4,
} as const;

const GROWTH_ORDER: OP10M_A11_GrowthBand[] = [
  'contracting',
  'slow',
  'steady',
  'fast',
  'surging',
];

export function op10mA11Clamp(x: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

export function op10mA11Round(x: number, digits = 1): number {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}

export function op10mA11GrowthBandFromScore(score: number): OP10M_A11_GrowthBand {
  if (score < 18) return 'contracting';
  if (score < 35) return 'slow';
  if (score < 55) return 'steady';
  if (score < 75) return 'fast';
  return 'surging';
}

export function op10mA11InequalityBand(index: number): OP10M_A11_InequalityBand {
  if (index < OP10M_A11_THRESHOLDS.inequalityBalanced) return 'balanced';
  if (index < OP10M_A11_THRESHOLDS.inequalityModerate) return 'moderate_gap';
  if (index < OP10M_A11_THRESHOLDS.inequalityWide) return 'wide_gap';
  return 'polarized';
}

export function op10mA11GrowthBandRank(b: OP10M_A11_GrowthBand): number {
  return GROWTH_ORDER.indexOf(b);
}

/** Normalized mean absolute deviation — stable inequality proxy on 0–100 scale. */
export function op10mA11InequalityIndex(values: number[]): number {
  if (!values.length) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const mad = values.reduce((a, v) => a + Math.abs(v - mean), 0) / values.length;
  return op10mA11Clamp(mad * 1.35);
}

export function op10mA11HashInputs(payload: {
  turn: number;
  cityCount: number;
  regionKeys: string;
  nationalGrowth: string;
}): string {
  return `a11:${payload.turn}:${payload.cityCount}:${payload.regionKeys}:${payload.nationalGrowth}`;
}
