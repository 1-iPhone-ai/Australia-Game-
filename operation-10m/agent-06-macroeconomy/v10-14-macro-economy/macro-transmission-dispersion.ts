import type {
  MacroTransmissionDispersionBand,
  MacroTransmissionDispersionSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionDispersionBand, MacroTransmissionDispersionSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Coefficient-of-variation style spread of active transmission layer magnitudes. */
export function buildMacroTransmissionDispersionSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionDispersionSnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.05);
  if (mags.length <= 1) {
    return {
      dispersionIndex: 0,
      band: 'uniform',
      activeLayerCount: mags.length,
      summary: 'Insufficient active transmission mass — dispersion read is uniform.'
    };
  }
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((a, m) => a + (m - mean) ** 2, 0) / mags.length;
  const std = Math.sqrt(variance);
  const cv = mean > 0.01 ? std / mean : 0;
  const dispersionIndex = Math.round(v1014macroClamp(cv, 0, 2) * 50 * 10) / 10;

  let band: MacroTransmissionDispersionBand = 'moderate';
  if (dispersionIndex >= 62) band = 'wide';
  else if (dispersionIndex <= 28) band = 'uniform';

  const summary = `Transmission dispersion ${dispersionIndex.toFixed(1)} (${band}); ${mags.length} active layers with CV ${(cv * 100).toFixed(0)}%.`;

  return {
    dispersionIndex,
    band,
    activeLayerCount: mags.length,
    summary
  };
}
