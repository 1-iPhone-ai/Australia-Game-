import type {
  MacroTransmissionFragmentationBand,
  MacroTransmissionFragmentationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionFragmentationBand, MacroTransmissionFragmentationSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of transmission layers carrying negligible spillover mass (fragmentation read). */
export function buildMacroTransmissionFragmentationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionFragmentationSnapshot {
  const total = report.layers.length;
  if (total <= 0) {
    return {
      fragmentationIndex: 0,
      band: 'cohesive',
      inactiveLayerCount: 0,
      summary: 'No transmission layers — fragmentation read is cohesive.'
    };
  }
  const inactive = report.layers.filter(l => layerMagnitude(l) < 0.08).length;
  const ratio = inactive / total;
  const fragmentationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionFragmentationBand = 'moderate';
  if (fragmentationIndex >= 62) band = 'fragmented';
  else if (fragmentationIndex <= 28) band = 'cohesive';

  const summary = `Transmission fragmentation ${fragmentationIndex.toFixed(1)} (${band}); ${inactive}/${total} layers below active mass threshold.`;

  return {
    fragmentationIndex,
    band,
    inactiveLayerCount: inactive,
    summary
  };
}
