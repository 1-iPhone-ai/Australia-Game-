import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only AI memory / explainability snapshot from Agent 19 (contract only). */
export interface Agent19MemorySnapshot {
  turn: number;
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  /** Round 24: memory recall cascade into inflation presentation. */
  memoryInflationRecallCascade?: boolean;
  /** Round 24: explainability inflation salience band. */
  explainabilityInflationSalienceBand?: 'muted' | 'elevated' | 'critical';
  /** Round 34: commonwealth inflation recall latch. */
  memoryCommonwealthInflationLatch?: boolean;
  /** Round 34: realm recall gate band. */
  realmRecallGateBand?: 'sealed' | 'opening' | 'breached';
  /** Round 42: memory recall inflation latch. */
  wave42MemoryRecallLatch?: boolean;
  /** Round 42: realm persistence gate band. */
  realmPersistenceGateBand?: 'anchored' | 'slipping' | 'ruptured';
}

export function mergeAgent19IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent19MemorySnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.narrativeDriftTowardHigherInflation) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.recalledInflationRegimeConfidence > 0.75 && snapshot.explainabilityAlertActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.narrativeDriftTowardHigherInflation &&
    snapshot.recalledInflationRegimeConfidence > 0.7
  ) {
    highInflationScenario = true;
  }
  if (snapshot.memoryInflationRecallCascade && snapshot.explainabilityInflationSalienceBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.memoryCommonwealthInflationLatch && snapshot.realmRecallGateBand === 'breached') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.realmRecallGateBand === 'opening' && snapshot.explainabilityAlertActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave42MemoryRecallLatch && snapshot.realmPersistenceGateBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.realmPersistenceGateBand === 'slipping' && snapshot.narrativeDriftTowardHigherInflation) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent19MemoryBridgeIntegrationNote(): string {
  return 'Agent 19 memory snapshot adjusts recalled inflation regime flags; no memory store writes.';
}
