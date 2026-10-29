import type {
  MacroTransmissionPolarizationBand,
  MacroTransmissionPolarizationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionPolarizationBand, MacroTransmissionPolarizationSnapshot };

/** Restrictive vs supportive layer mass imbalance across transmission stack. */
export function buildMacroTransmissionPolarizationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionPolarizationSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution + layer.productivityContribution;
    if (net > 0.08) support += net;
    else if (net < -0.08) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0) {
    return {
      polarizationIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — polarization read is balanced.'
    };
  }
  const skew = (restrict - support) / total;
  const polarizationIndex = Math.round(v1014macroClamp((Math.abs(skew) + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionPolarizationBand = 'balanced';
  if (polarizationIndex >= 72) band = skew > 0 ? 'restrictive_dominant' : 'supportive_dominant';
  else if (polarizationIndex >= 55) band = 'elevated';

  const summary = `Transmission polarization ${polarizationIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    polarizationIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}
