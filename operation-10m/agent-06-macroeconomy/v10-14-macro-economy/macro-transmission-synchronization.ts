import type {
  MacroTransmissionReport,
  MacroTransmissionSynchronizationBand,
  MacroTransmissionSynchronizationSnapshot
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionSynchronizationBand, MacroTransmissionSynchronizationSnapshot };

/** Share of active layers with aligned cycle, investment, and productivity sign. */
export function buildMacroTransmissionSynchronizationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSynchronizationSnapshot {
  let synchronized = 0;
  let active = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    active += 1;
    const signs = [c, i, p].filter(v => Math.abs(v) >= 0.05).map(v => Math.sign(v));
    if (signs.length >= 2 && signs.every(s => s === signs[0])) synchronized += 1;
    else if (signs.length === 1) synchronized += 1;
  }
  if (active <= 0) {
    return {
      synchronizationIndex: 100,
      band: 'locked',
      synchronizedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No active transmission nudges — synchronization read is locked.'
    };
  }
  const ratio = synchronized / active;
  const synchronizationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionSynchronizationBand = 'mixed';
  if (synchronizationIndex >= 78) band = 'locked';
  else if (synchronizationIndex >= 58) band = 'coherent';
  else if (synchronizationIndex <= 35) band = 'fractured';

  const summary = `Transmission synchronization ${synchronizationIndex.toFixed(1)} (${band}); ${synchronized}/${active} active layers share aligned nudge signs.`;

  return {
    synchronizationIndex,
    band,
    synchronizedLayerCount: synchronized,
    activeLayerCount: active,
    summary
  };
}
