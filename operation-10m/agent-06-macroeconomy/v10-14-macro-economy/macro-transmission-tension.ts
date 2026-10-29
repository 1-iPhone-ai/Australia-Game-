import type {
  MacroTransmissionReport,
  MacroTransmissionTensionBand,
  MacroTransmissionTensionSnapshot
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionTensionBand, MacroTransmissionTensionSnapshot };

/** Net restrictive minus supportive layer mass — macro tension proxy. */
export function buildMacroTransmissionTensionSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionTensionSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (net > 0.05) support += net;
    else if (net < -0.05) restrict += Math.abs(net);
  }
  const raw = restrict - support;
  const normalized = v1014macroClamp((raw + 10) / 20, 0, 1);
  const tensionIndex = Math.round(normalized * 1000) / 10;

  let band: MacroTransmissionTensionBand = 'balanced';
  if (tensionIndex >= 68) band = 'acute';
  else if (tensionIndex >= 52) band = 'elevated';
  else if (tensionIndex <= 32) band = 'supportive';

  const summary = `Transmission tension ${tensionIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    tensionIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}
