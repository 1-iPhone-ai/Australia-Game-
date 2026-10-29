import type {
  MacroTransmissionElasticityBand,
  MacroTransmissionElasticitySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionElasticityBand, MacroTransmissionElasticitySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Coefficient-of-variation read on active transmission mass (load-sharing elasticity). */
export function buildMacroTransmissionElasticitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionElasticitySnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08);
  if (mags.length <= 1) {
    return {
      elasticityIndex: 0,
      band: 'rigid',
      activeLayerCount: mags.length,
      summary: 'Insufficient active transmission mass — elasticity read is rigid.'
    };
  }
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((a, m) => a + (m - mean) ** 2, 0) / mags.length;
  const cv = mean > 0.01 ? Math.sqrt(variance) / mean : 0;
  const elasticityIndex = Math.round(v1014macroClamp(cv, 0, 1.5) * 1000) / 10;

  let band: MacroTransmissionElasticityBand = 'balanced';
  if (elasticityIndex >= 55) band = 'flexible';
  else if (elasticityIndex <= 22) band = 'rigid';

  const summary = `Transmission elasticity ${elasticityIndex.toFixed(1)} (${band}); ${mags.length} active layers share spillover mass.`;

  return {
    elasticityIndex,
    band,
    activeLayerCount: mags.length,
    summary
  };
}
