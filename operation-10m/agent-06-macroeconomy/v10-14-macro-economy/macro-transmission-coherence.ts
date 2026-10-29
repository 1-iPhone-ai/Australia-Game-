import type {
  BusinessCyclePhase,
  MacroTransmissionCoherenceBand,
  MacroTransmissionCoherenceSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionCoherenceBand, MacroTransmissionCoherenceSnapshot };

/** Share of transmission layers whose net nudge aligns with the current cycle phase read. */
export function buildMacroTransmissionCoherenceSnapshot(
  report: MacroTransmissionReport,
  cyclePhase: BusinessCyclePhase
): MacroTransmissionCoherenceSnapshot {
  const expectUp = cyclePhase === 'expansion' || cyclePhase === 'recovery' || cyclePhase === 'peak';
  const expectDown = cyclePhase === 'contraction' || cyclePhase === 'trough' || cyclePhase === 'slowdown';

  let aligned = 0;
  let considered = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(net) < 0.05) continue;
    considered++;
    const sign = Math.sign(net);
    if (expectUp && sign > 0) aligned++;
    else if (expectDown && sign < 0) aligned++;
    else if (!expectUp && !expectDown) aligned++;
  }

  const ratio = considered > 0 ? aligned / considered : 1;
  const coherenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCoherenceBand = 'coherent';
  if (coherenceIndex < 45) band = 'contradictory';
  else if (coherenceIndex < 62) band = 'mixed';
  else if (coherenceIndex < 78) band = 'partial';

  let summary = `Transmission coherence ${coherenceIndex.toFixed(1)} (${band}) for ${cyclePhase} phase across ${report.layers.length} layers.`;
  if (band === 'contradictory' || band === 'mixed') {
    summary += ' Layer nudges partially oppose the headline cycle phase.';
  }

  return { coherenceIndex, band, alignedLayerCount: aligned, consideredLayerCount: considered, summary };
}
