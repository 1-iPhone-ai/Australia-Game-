import type {
  MacroTransmissionGradientBand,
  MacroTransmissionGradientSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionGradientBand, MacroTransmissionGradientSnapshot };

/** Spread between strongest and weakest active transmission layer magnitudes. */
export function buildMacroTransmissionGradientSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionGradientSnapshot {
  const magnitudes: number[] = [];
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m >= 0.08) magnitudes.push(m);
  }
  if (magnitudes.length <= 1) {
    return {
      gradientIndex: 0,
      band: 'flat',
      peakMagnitude: magnitudes[0] ?? 0,
      floorMagnitude: magnitudes[0] ?? 0,
      summary: 'Insufficient active transmission spread — gradient read is flat.'
    };
  }
  const peak = Math.max(...magnitudes);
  const floor = Math.min(...magnitudes);
  const spread = peak - floor;
  const gradientIndex = Math.round(v1014macroClamp(spread / 8, 0, 1) * 1000) / 10;

  let band: MacroTransmissionGradientBand = 'moderate';
  if (gradientIndex >= 68) band = 'steep';
  else if (gradientIndex >= 48) band = 'sloped';
  else if (gradientIndex <= 22) band = 'flat';

  const summary = `Transmission gradient ${gradientIndex.toFixed(1)} (${band}); peak ${peak.toFixed(2)} vs floor ${floor.toFixed(2)}.`;

  return {
    gradientIndex,
    band,
    peakMagnitude: Math.round(peak * 100) / 100,
    floorMagnitude: Math.round(floor * 100) / 100,
    summary
  };
}
