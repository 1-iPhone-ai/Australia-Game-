import type {
  MacroTransmissionAttenuationBand,
  MacroTransmissionAttenuationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionAttenuationBand, MacroTransmissionAttenuationSnapshot };

/** Mean layer magnitude relative to the strongest active layer (attenuation / tail softness). */
export function buildMacroTransmissionAttenuationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAttenuationSnapshot {
  const magnitudes: number[] = [];
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m >= 0.08) magnitudes.push(m);
  }
  if (magnitudes.length <= 0) {
    return {
      attenuationIndex: 0,
      band: 'muted',
      activeLayerCount: 0,
      peakMagnitude: 0,
      summary: 'No active transmission mass — attenuation read is muted.'
    };
  }
  const peak = Math.max(...magnitudes);
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const ratio = peak > 0 ? mean / peak : 0;
  const attenuationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAttenuationBand = 'balanced';
  if (attenuationIndex >= 72) band = 'diffuse';
  else if (attenuationIndex >= 52) band = 'balanced';
  else if (attenuationIndex <= 28) band = 'muted';

  const summary = `Transmission attenuation ${attenuationIndex.toFixed(1)} (${band}); mean/peak ${ratio.toFixed(2)} across ${magnitudes.length} layers.`;

  return {
    attenuationIndex,
    band,
    activeLayerCount: magnitudes.length,
    peakMagnitude: Math.round(peak * 100) / 100,
    summary
  };
}
