import type {
  MacroTransmissionConcentrationBand,
  MacroTransmissionConcentrationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionConcentrationBand, MacroTransmissionConcentrationSnapshot };

/** Herfindahl-style concentration of transmission magnitude across layers. */
export function buildMacroTransmissionConcentrationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionConcentrationSnapshot {
  const weights = report.layers.map(l => layerMagnitude(l));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0.01 || weights.length === 0) {
    return {
      concentrationIndex: 0,
      band: 'diffuse',
      dominantShare: 0,
      summary: 'No material transmission magnitude — concentration read is diffuse.'
    };
  }

  const shares = weights.map(w => w / total);
  const hhi = shares.reduce((a, s) => a + s * s, 0);
  const normalized = v1014macroClamp((hhi - 1 / Math.max(1, shares.length)) / (1 - 1 / Math.max(1, shares.length)), 0, 1);
  const concentrationIndex = Math.round(normalized * 1000) / 10;
  const dominantShare = Math.round(Math.max(...shares) * 1000) / 10;

  let band: MacroTransmissionConcentrationBand = 'diffuse';
  if (concentrationIndex >= 68 || dominantShare >= 42) band = 'dominant_single';
  else if (concentrationIndex >= 48) band = 'concentrated';
  else if (concentrationIndex >= 28) band = 'moderate';

  let summary = `Transmission concentration ${concentrationIndex.toFixed(1)} (${band}); top layer share ${dominantShare.toFixed(1)}%.`;
  if (band === 'dominant_single' || band === 'concentrated') {
    summary += ' Macro read is sensitive to a narrow set of cross-system layers.';
  }

  return { concentrationIndex, band, dominantShare, summary };
}

function layerMagnitude(l: {
  cycleContribution: number;
  investmentContribution: number;
  productivityContribution: number;
}): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}
