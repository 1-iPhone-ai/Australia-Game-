import type {
  MacroTransmissionPersistenceBand,
  MacroTransmissionPersistenceSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionPersistenceBand, MacroTransmissionPersistenceSnapshot };

/** Share of active layers whose net nudge sign matches the report aggregate net sign. */
export function buildMacroTransmissionPersistenceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionPersistenceSnapshot {
  const net =
    report.netCycleNudge + report.netInvestmentNudge * 0.35 + report.netProductivityNudge * 0.2;
  const aggregateSign = Math.sign(net);
  if (aggregateSign === 0) {
    return {
      persistenceIndex: 50,
      band: 'mixed',
      alignedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'Flat aggregate transmission — persistence read is mixed.'
    };
  }
  let aligned = 0;
  let active = 0;
  for (const layer of report.layers) {
    const layerNet = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(layerNet) < 0.05) continue;
    active++;
    if (Math.sign(layerNet) === aggregateSign) aligned++;
  }
  if (active <= 0) {
    return {
      persistenceIndex: 0,
      band: 'fragile',
      alignedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No directional layer mass — persistence read is fragile.'
    };
  }
  const ratio = aligned / active;
  const persistenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionPersistenceBand = 'cohesive';
  if (persistenceIndex >= 72) band = 'cohesive';
  else if (persistenceIndex >= 52) band = 'mixed';
  else band = 'fragile';

  const summary = `Transmission persistence ${persistenceIndex.toFixed(1)} (${band}); ${aligned}/${active} layers align with aggregate sign.`;

  return {
    persistenceIndex,
    band,
    alignedLayerCount: aligned,
    activeLayerCount: active,
    summary
  };
}
