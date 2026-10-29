import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only idle automation snapshot from Agent 20 (contract only). */
export interface Agent20AutomationSnapshot {
  turn: number;
  macroAutopilotInflationBias: 'deflate' | 'neutral' | 'inflate';
  unattendedShockDriftActive: boolean;
  automationConfidenceScore: number;
  /** Round 25: idle macro inflation escalation under autopilot. */
  idleMacroInflationEscalation?: boolean;
  /** Round 25: autopilot drift cascade band. */
  autopilotDriftCascadeBand?: 'none' | 'drifting' | 'runaway';
  /** Round 34: synthesis autopilot inflation latch. */
  synthesisAutopilotInflationLatch?: boolean;
  /** Round 34: cascade stack drift band. */
  cascadeStackDriftBand?: 'stable' | 'stacking' | 'runaway';
  /** Round 42: synthesis cascade inflation latch. */
  wave42SynthesisCascadeLatch?: boolean;
  /** Round 42: autopilot stack surge band. */
  autopilotStackSurgeBand?: 'stable' | 'stacking' | 'surge';
}

export function mergeAgent20IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent20AutomationSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.macroAutopilotInflationBias === 'inflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.macroAutopilotInflationBias === 'deflate') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  if (snapshot.unattendedShockDriftActive && snapshot.automationConfidenceScore < 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.macroAutopilotInflationBias === 'inflate' && snapshot.unattendedShockDriftActive) {
    highInflationScenario = true;
  }
  if (snapshot.autopilotDriftCascadeBand === 'runaway' || snapshot.idleMacroInflationEscalation) {
    highInflationScenario = highInflationScenario || snapshot.autopilotDriftCascadeBand === 'runaway';
  }

  if (snapshot.synthesisAutopilotInflationLatch && snapshot.cascadeStackDriftBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.cascadeStackDriftBand === 'stacking' && snapshot.unattendedShockDriftActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave42SynthesisCascadeLatch && snapshot.autopilotStackSurgeBand === 'surge') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.autopilotStackSurgeBand === 'stacking' && snapshot.unattendedShockDriftActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent20AutomationBridgeIntegrationNote(): string {
  return 'Agent 20 automation snapshot adjusts autopilot inflation bias flags; no automation queue writes.';
}
