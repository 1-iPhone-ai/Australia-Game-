import { BUSINESS_CYCLE_LABEL, V1014_MACRO_INVESTMENT_LABEL, V1014_MACRO_PRODUCTIVITY_LABEL } from './constants.ts';
import type { MacroDebriefSnapshot, NationalMacroEconomyState } from './types.ts';

export function composeMacroEconomyDebrief(state: NationalMacroEconomyState): MacroDebriefSnapshot {
  const bullets: string[] = [
    `Cycle ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} · productivity ${V1014_MACRO_PRODUCTIVITY_LABEL[state.productivityBand]} · investment ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]}`,
    `Gross output index ${state.accounting.grossOutputIndex.toFixed(1)} · identity ${state.accounting.identityOk ? 'OK' : 'DRIFT'}`,
    `Leading region ${state.regionalDivergence.leadingRegionId} · divergence ${state.regionalDivergence.band}`
  ];
  if (state.activeCyclicalShockIds.length) {
    bullets.push(`Active shocks: ${state.activeCyclicalShockIds.join(', ')}`);
  }
  if (state.fiscalSpilloverSummary) bullets.push(state.fiscalSpilloverSummary);
  if (state.householdSpilloverSummary) bullets.push(state.householdSpilloverSummary);
  if (state.industrySpilloverSummary) bullets.push(state.industrySpilloverSummary);
  const triggered = state.consistencyGates.filter(g => g.triggered);
  if (triggered.length) bullets.push(`Consistency notes: ${triggered.map(g => g.id).join(', ')}`);
  return {
    headline: `Macro T${state.turn}: ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} / ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]}`,
    bullets: bullets.slice(0, 8)
  };
}

export function buildMacroDerivedSignals(
  state: NationalMacroEconomyState,
  previousPhase: string | null | undefined
): Array<{ id: string; kind: string; text: string }> {
  const out: Array<{ id: string; kind: string; text: string }> = [];
  if (previousPhase && previousPhase !== state.cyclePhase) {
    out.push({
      id: `macro:cycle:${state.turn}:${state.cyclePhase}`,
      kind: 'cycle_phase_change',
      text: `National cycle shifted to ${BUSINESS_CYCLE_LABEL[state.cyclePhase]}.`
    });
  }
  for (const gate of state.consistencyGates.filter(g => g.triggered && g.severity === 'warn')) {
    out.push({
      id: `macro:gate:${gate.id}:t${state.turn}`,
      kind: 'consistency_gate',
      text: gate.summary
    });
  }
  return out.slice(0, 6);
}
