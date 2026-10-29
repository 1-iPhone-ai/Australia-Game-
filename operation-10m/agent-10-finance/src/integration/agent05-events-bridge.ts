import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only dynamic events snapshot from Agent 05 (contract only). */
export interface Agent05EventsSnapshot {
  turn: number;
  inflationShockEventActive: boolean;
  supplyDisruptionSeverity: 'none' | 'localized' | 'national';
  confidenceShockBand: 'calm' | 'uneasy' | 'severe';
  /** Round 19: staged narrative event cost shock band. */
  stagedEventCostShockBand?: 'none' | 'emerging' | 'active' | 'cascade';
  /** Round 19: macro inflation spillover latch from event queue. */
  macroEventInflationSpilloverActive?: boolean;
  /** Round 27: dynamic event inflation latch across narrative queue. */
  dynamicEventInflationLatch?: boolean;
  /** Round 27: supply shock persistence band. */
  supplyShockPersistenceBand?: 'none' | 'building' | 'entrenched';
  /** Round 37: wave event inflation latch. */
  wave37EventInflationLatch?: boolean;
  /** Round 37: staged shock persistence band. */
  stagedShockPersistenceBand?: 'none' | 'building' | 'entrenched';
  /** Round 45: event shock inflation latch. */
  wave45EventShockLatch?: boolean;
  /** Round 45: narrative shock entrench band. */
  narrativeShockEntrenchBand?: 'none' | 'building' | 'entrenched';
}

export function mergeAgent05IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent05EventsSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.12, 0.85, 1.45);
  }
  if (snapshot.supplyDisruptionSeverity === 'national') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.supplyDisruptionSeverity === 'localized') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (
    snapshot.inflationShockEventActive &&
    (snapshot.supplyDisruptionSeverity === 'national' || snapshot.confidenceShockBand === 'severe')
  ) {
    highInflationScenario = true;
  }

  let publicStability = base.publicStability;
  if (snapshot.confidenceShockBand === 'severe') {
    publicStability = Math.max(0, publicStability - 6);
  } else if (snapshot.confidenceShockBand === 'uneasy') {
    publicStability = Math.max(0, publicStability - 3);
  }

  if (snapshot.stagedEventCostShockBand === 'cascade') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.stagedEventCostShockBand === 'active') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.dynamicEventInflationLatch && snapshot.supplyShockPersistenceBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.supplyShockPersistenceBand === 'building' && snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave37EventInflationLatch && snapshot.stagedShockPersistenceBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.stagedShockPersistenceBand === 'building' && snapshot.supplyDisruptionSeverity === 'national') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave45EventShockLatch && snapshot.narrativeShockEntrenchBand === 'entrenched') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.narrativeShockEntrenchBand === 'building' && snapshot.inflationShockEventActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario:
      highInflationScenario ||
      snapshot.macroEventInflationSpilloverActive === true ||
      snapshot.stagedEventCostShockBand === 'cascade',
    publicStability,
    creditShockActive: base.creditShockActive || snapshot.stagedEventCostShockBand === 'cascade',
  };
}

export function agent05EventsBridgeIntegrationNote(): string {
  return 'Agent 05 events snapshot adjusts inflation shock flags from narrative events; no event queue writes.';
}
