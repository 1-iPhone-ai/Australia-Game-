import type { MacroConsistencyGate, MacroTransmissionReport, MacroStressBand, MacroStressIndexSnapshot, NationalMacroEconomyState } from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroStressBand, MacroStressIndexSnapshot };

export function buildMacroStressIndexSnapshot(state: NationalMacroEconomyState): MacroStressIndexSnapshot {
  const transmissionStress = stressFromTransmission(state.transmissionReport);
  const gateStress = stressFromGates(state.consistencyGates);
  const phaseStress = phaseStressWeight(state.cyclePhase);
  const raw = transmissionStress * 0.45 + gateStress * 0.35 + phaseStress * 0.2;
  const score = v1014macroClamp(Math.round(raw * 100) / 100, 0, 100);
  const band: MacroStressBand = score >= 62 ? 'acute' : score >= 34 ? 'elevated' : 'calm';
  const drivers: string[] = [];
  if (transmissionStress > 0.35) drivers.push('transmission_dispersion');
  if (gateStress > 0.25) drivers.push('consistency_gates');
  if (phaseStress > 0.4) drivers.push('cycle_downside');
  if (state.investmentClimate === 'frozen') drivers.push('investment_frozen');
  return {
    score,
    band,
    drivers: drivers.slice(0, 5),
    transmissionStress: Math.round(transmissionStress * 1000) / 1000,
    gateStress: Math.round(gateStress * 1000) / 1000
  };
}

function stressFromTransmission(report: MacroTransmissionReport | null | undefined): number {
  if (!report?.layers?.length) return 0;
  const mag = report.layers.reduce(
    (a, l) =>
      a + Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution),
    0
  );
  return v1014macroClamp(mag / 28, 0, 1);
}

function stressFromGates(gates: MacroConsistencyGate[]): number {
  if (!gates.length) return 0;
  const triggered = gates.filter(g => g.triggered);
  let w = 0;
  for (const g of triggered) {
    w += g.severity === 'warn' ? 0.22 : 0.12;
  }
  return v1014macroClamp(w, 0, 1);
}

function phaseStressWeight(phase: NationalMacroEconomyState['cyclePhase']): number {
  if (phase === 'contraction' || phase === 'trough') return 0.85;
  if (phase === 'slowdown') return 0.55;
  if (phase === 'recovery') return 0.35;
  return 0.15;
}
