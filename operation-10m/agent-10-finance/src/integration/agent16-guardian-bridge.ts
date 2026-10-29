import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only guardian co-pilot snapshot from Agent 16 (contract only). */
export interface Agent16GuardianSnapshot {
  turn: number;
  inflationGuardrailTripped: boolean;
  stabilityInterventionBand: 'none' | 'advisory' | 'urgent';
  narrativeShockSeverity: 'low' | 'medium' | 'high';
  /** Round 16: guardian flags financial-services fee shock feeding CPI metadata. */
  financialServicesFeeShockActive?: boolean;
  /** Round 23: co-pilot inflation escalation latch. */
  copilotInflationEscalationActive?: boolean;
  /** Round 23: guardrail narrative cascade band. */
  guardrailNarrativeCascadeBand?: 'none' | 'building' | 'urgent';
  /** Round 33: guardrail inflation latch. */
  guardrailInflationLatch?: boolean;
  /** Round 33: co-pilot escalation band. */
  copilotEscalationBand?: 'calm' | 'elevated' | 'critical';
}

export function mergeAgent16IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent16GuardianSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  }
  if (snapshot.financialServicesFeeShockActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.narrativeShockSeverity === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let publicStability = base.publicStability;
  if (snapshot.stabilityInterventionBand === 'urgent') {
    publicStability = Math.max(0, publicStability - 8);
  } else if (snapshot.stabilityInterventionBand === 'advisory') {
    publicStability = Math.max(0, publicStability - 4);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    (snapshot.inflationGuardrailTripped && snapshot.stabilityInterventionBand === 'urgent') ||
    snapshot.financialServicesFeeShockActive
  ) {
    highInflationScenario = true;
  }

  let creditShockActive = base.creditShockActive;
  if (snapshot.financialServicesFeeShockActive) {
    creditShockActive = true;
  }
  if (snapshot.copilotInflationEscalationActive || snapshot.guardrailNarrativeCascadeBand === 'urgent') {
    highInflationScenario = true;
  }
  if (snapshot.guardrailNarrativeCascadeBand === 'urgent') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.guardrailInflationLatch && snapshot.copilotEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.copilotEscalationBand === 'elevated' && snapshot.inflationGuardrailTripped) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    publicStability,
    highInflationScenario,
    creditShockActive,
  };
}

export function agent16GuardianBridgeIntegrationNote(): string {
  return 'Agent 16 guardian snapshot reflects inflation guardrail state; no co-pilot action writes.';
}
