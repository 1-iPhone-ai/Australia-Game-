import type {
  MacroTransmissionRedundancyBand,
  MacroTransmissionRedundancySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionRedundancyBand, MacroTransmissionRedundancySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of active transmission mass carried by layers with aligned cycle sign. */
export function buildMacroTransmissionRedundancySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionRedundancySnapshot {
  const active = report.layers.filter(l => layerMagnitude(l) >= 0.08);
  if (active.length <= 1) {
    return {
      redundancyIndex: 0,
      band: 'diverse',
      alignedLayerCount: active.length,
      summary: 'Insufficient active transmission mass — redundancy read is diverse.'
    };
  }
  const dominantSign = Math.sign(
    active.reduce((a, l) => a + l.cycleContribution + l.investmentContribution * 0.4, 0)
  );
  const aligned = active.filter(l => {
    const signed = l.cycleContribution + l.investmentContribution * 0.4;
    return dominantSign === 0 ? Math.abs(signed) < 0.05 : Math.sign(signed) === dominantSign;
  });
  const totalMass = active.reduce((a, l) => a + layerMagnitude(l), 0);
  const alignedMass = aligned.reduce((a, l) => a + layerMagnitude(l), 0);
  const ratio = totalMass > 0.01 ? alignedMass / totalMass : 0;
  const redundancyIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionRedundancyBand = 'balanced';
  if (redundancyIndex >= 72) band = 'stacked';
  else if (redundancyIndex <= 35) band = 'diverse';

  const summary = `Transmission redundancy ${redundancyIndex.toFixed(1)} (${band}); ${aligned.length}/${active.length} active layers align on dominant impulse sign.`;

  return {
    redundancyIndex,
    band,
    alignedLayerCount: aligned.length,
    summary
  };
}
