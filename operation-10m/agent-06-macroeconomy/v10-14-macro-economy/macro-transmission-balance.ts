import type { MacroTransmissionBalanceBand, MacroTransmissionBalanceSnapshot, MacroTransmissionReport } from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionBalanceBand, MacroTransmissionBalanceSnapshot };

/** Measures how aligned vs conflicting cross-layer transmission nudges are. */
export function buildMacroTransmissionBalanceSnapshot(report: MacroTransmissionReport): MacroTransmissionBalanceSnapshot {
  const cycleSigns = report.layers.map(l => Math.sign(l.cycleContribution)).filter(s => s !== 0);
  const invSigns = report.layers.map(l => Math.sign(l.investmentContribution)).filter(s => s !== 0);
  const prodSigns = report.layers.map(l => Math.sign(l.productivityContribution)).filter(s => s !== 0);

  const disagreement =
    signDispersion(cycleSigns) * 0.4 + signDispersion(invSigns) * 0.35 + signDispersion(prodSigns) * 0.25;
  const magnitudeSpread =
    report.layers.length > 0
      ? stdDev(report.layers.map(l => magnitude(l))) / Math.max(1, mean(report.layers.map(l => magnitude(l))))
      : 0;

  const raw = v1014macroClamp(disagreement * 0.55 + Math.min(1, magnitudeSpread) * 0.45, 0, 1);
  const dispersionIndex = Math.round(raw * 1000) / 10;

  let band: MacroTransmissionBalanceBand = 'aligned';
  if (dispersionIndex >= 72) band = 'fragmented';
  else if (dispersionIndex >= 52) band = 'cross_current';
  else if (dispersionIndex >= 32) band = 'mixed';

  let summary = `Transmission dispersion ${dispersionIndex.toFixed(1)} (${band}) across ${report.layers.length} layers.`;
  if (band === 'cross_current' || band === 'fragmented') {
    summary += ' Opposing layer nudges — interpret headline macro scores with caution.';
  } else if (band === 'aligned') {
    summary += ' Layer nudges broadly reinforce the national macro read.';
  }

  return { dispersionIndex, band, summary };
}

function magnitude(l: { cycleContribution: number; investmentContribution: number; productivityContribution: number }): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}

function signDispersion(signs: number[]): number {
  if (signs.length <= 1) return 0;
  const pos = signs.filter(s => s > 0).length;
  const neg = signs.filter(s => s < 0).length;
  return Math.min(1, (Math.min(pos, neg) * 2) / signs.length);
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((a, v) => a + (v - m) ** 2, 0) / values.length);
}
