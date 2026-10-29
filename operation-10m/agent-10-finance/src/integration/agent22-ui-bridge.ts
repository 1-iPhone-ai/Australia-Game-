import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only evolving UI snapshot from Agent 22 (contract only). */
export interface Agent22UiSnapshot {
  turn: number;
  inflationDashboardStressHighlight: boolean;
  playerAttentionOnCostOfLiving: 'low' | 'medium' | 'high';
  uiNudgeInflationExpectationsUp: boolean;
  /** Round 17: utilities stress banner visible in UI shell. */
  utilitiesStressBannerActive?: boolean;
  /** Round 17: phase-shell cost-of-living coach elevating inflation salience. */
  phaseShellCostOfLivingCoachActive?: boolean;
  /** Round 29: player inflation salience latch in UI shell. */
  playerInflationSalienceLatch?: boolean;
  /** Round 29: UI expectations nudge band. */
  uiExpectationsNudgeBand?: 'muted' | 'building' | 'sharp';
  /** Round 35: wave salience escalation latch. */
  wave35SalienceEscalationLatch?: boolean;
  /** Round 35: shell expectations escalation band. */
  shellExpectationsEscalationBand?: 'muted' | 'building' | 'critical';
  /** Round 43: shell attention inflation latch. */
  wave43ShellAttentionLatch?: boolean;
  /** Round 43: player salience pressure band. */
  playerSaliencePressureBand?: 'muted' | 'elevated' | 'critical';
}

export function mergeAgent22IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent22UiSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.inflationDashboardStressHighlight && snapshot.playerAttentionOnCostOfLiving === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.uiNudgeInflationExpectationsUp) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }
  if (snapshot.utilitiesStressBannerActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }
  if (snapshot.phaseShellCostOfLivingCoachActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.playerAttentionOnCostOfLiving === 'high') {
    householdInflationScenarioActive = true;
  }
  if (snapshot.phaseShellCostOfLivingCoachActive && snapshot.utilitiesStressBannerActive) {
    householdInflationScenarioActive = true;
  }

  if (snapshot.playerInflationSalienceLatch && snapshot.uiExpectationsNudgeBand === 'sharp') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
    householdInflationScenarioActive = true;
  } else if (snapshot.uiExpectationsNudgeBand === 'building' && snapshot.uiNudgeInflationExpectationsUp) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.wave35SalienceEscalationLatch && snapshot.shellExpectationsEscalationBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.shellExpectationsEscalationBand === 'building' && snapshot.inflationDashboardStressHighlight) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave43ShellAttentionLatch && snapshot.playerSaliencePressureBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.playerSaliencePressureBand === 'elevated' && snapshot.playerAttentionOnCostOfLiving === 'high') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdInflationScenarioActive,
    highInflationScenario,
  };
}

export function agent22UiBridgeIntegrationNote(): string {
  return 'Agent 22 UI snapshot reflects player-facing inflation stress flags; no UI state writes.';
}
