import type {
  MacroTransmissionCentralityBand,
  MacroTransmissionCentralitySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionCentralityBand, MacroTransmissionCentralitySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of active transmission mass carried by the top three layers. */
export function buildMacroTransmissionCentralitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCentralitySnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08).sort((a, b) => b - a);
  if (mags.length <= 0) {
    return {
      centralityIndex: 0,
      band: 'diffuse',
      topLayerCount: 0,
      summary: 'No active transmission mass — centrality read is diffuse.'
    };
  }
  const total = mags.reduce((a, b) => a + b, 0);
  const top3 = mags.slice(0, 3).reduce((a, b) => a + b, 0);
  const ratio = top3 / total;
  const centralityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCentralityBand = 'balanced';
  if (centralityIndex >= 68) band = 'concentrated';
  else if (centralityIndex <= 32) band = 'diffuse';

  const summary = `Transmission centrality ${centralityIndex.toFixed(1)} (${band}); top-3 share ${(ratio * 100).toFixed(0)}% of active mass.`;

  return {
    centralityIndex,
    band,
    topLayerCount: Math.min(3, mags.length),
    summary
  };
}
