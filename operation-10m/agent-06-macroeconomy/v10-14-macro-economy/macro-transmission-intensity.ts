import type {
  MacroTransmissionIntensityBand,
  MacroTransmissionIntensitySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionIntensityBand, MacroTransmissionIntensitySnapshot };

/** Share of transmission layers carrying material multi-channel nudges. */
export function buildMacroTransmissionIntensitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionIntensitySnapshot {
  const total = report.layers.length;
  if (total <= 0) {
    return {
      intensityIndex: 0,
      band: 'dormant',
      activeLayerCount: 0,
      totalLayerCount: 0,
      summary: 'Empty transmission report — intensity read is dormant.'
    };
  }
  let active = 0;
  for (const layer of report.layers) {
    const mag =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (mag >= 0.35) active += 1;
  }
  const ratio = active / total;
  const intensityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionIntensityBand = 'moderate';
  if (intensityIndex >= 72) band = 'acute';
  else if (intensityIndex >= 52) band = 'elevated';
  else if (intensityIndex <= 28) band = 'dormant';

  const summary = `Transmission intensity ${intensityIndex.toFixed(1)} (${band}); ${active}/${total} layers carry material nudges.`;

  return {
    intensityIndex,
    band,
    activeLayerCount: active,
    totalLayerCount: total,
    summary
  };
}
