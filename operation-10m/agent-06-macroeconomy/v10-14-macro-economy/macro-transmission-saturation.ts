import type {
  MacroTransmissionSaturationBand,
  MacroTransmissionSaturationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionSaturationBand, MacroTransmissionSaturationSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Peak-layer share of gross active transmission mass (saturation read). */
export function buildMacroTransmissionSaturationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSaturationSnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08);
  if (mags.length <= 0) {
    return {
      saturationIndex: 0,
      band: 'diffuse',
      peakLayerMagnitude: 0,
      summary: 'No active transmission mass — saturation read is diffuse.'
    };
  }
  const total = mags.reduce((a, b) => a + b, 0);
  const peak = Math.max(...mags);
  const ratio = total > 0.01 ? peak / total : 0;
  const saturationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionSaturationBand = 'moderate';
  if (saturationIndex >= 38) band = 'saturated';
  else if (saturationIndex <= 15) band = 'diffuse';

  const summary = `Transmission saturation ${saturationIndex.toFixed(1)} (${band}); peak layer carries ${(ratio * 100).toFixed(0)}% of active mass.`;

  return {
    saturationIndex,
    band,
    peakLayerMagnitude: Math.round(peak * 100) / 100,
    summary
  };
}
