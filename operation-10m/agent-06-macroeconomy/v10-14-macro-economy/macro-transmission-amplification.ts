import type {
  MacroTransmissionAmplificationBand,
  MacroTransmissionAmplificationSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionAmplificationBand, MacroTransmissionAmplificationSnapshot };

/** Net amplification of restrictive vs supportive layer mass (headline macro sensitivity). */
export function buildMacroTransmissionAmplificationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAmplificationSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (net > 0.05) support += net;
    else if (net < -0.05) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0.01) {
    return {
      amplificationIndex: 0,
      band: 'neutral',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — amplification read is neutral.'
    };
  }
  const skew = (restrict - support) / total;
  const amplificationIndex = Math.round(v1014macroClamp((skew + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAmplificationBand = 'neutral';
  if (amplificationIndex >= 68) band = 'restrictive';
  else if (amplificationIndex >= 58) band = 'mild_restrict';
  else if (amplificationIndex <= 32) band = 'supportive';
  else if (amplificationIndex <= 42) band = 'mild_support';

  const summary = `Transmission amplification ${amplificationIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    amplificationIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}
