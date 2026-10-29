import type { AdvisoryMonitorRule, GuardianCoPilotMonitorSnapshot } from './types.js';
import { guardianBlocksAutomation, inferGuardianVerdictFromSnapshot } from './guardian-depth.js';

const rivalMidband = (s: GuardianCoPilotMonitorSnapshot): boolean => {
  if (s.rivalVictoryProgressPct === null) return false;
  const lo = s.victoryThresholdPct * 0.65;
  const hi = s.victoryThresholdPct * 0.85;
  return s.rivalVictoryProgressPct >= lo && s.rivalVictoryProgressPct < hi;
};

export const ADVISORY_MONITOR_RULES_SCALE_WAVE: AdvisoryMonitorRule[] = [
  {
    id: 'debt_exceeds_cash',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Debt Exceeds Cash',
    detailTemplate: 'Outstanding debt is higher than liquid cash',
    evidenceFields: ['debt', 'cash'],
    evaluate: s => s.debt > s.cash,
  },
  {
    id: 'liquidity_double_pressure',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Liquidity Double Pressure',
    detailTemplate: 'Cash below reserve while debt service pressure is elevated',
    evidenceFields: ['cash', 'minCashReserve', 'debt'],
    evaluate: s => s.cash < s.minCashReserve && s.debt > s.cash * 0.5,
  },
  {
    id: 'spending_cap_exceeds_cash',
    category: 'liquidity',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Spending Cap Exceeds Cash',
    detailTemplate: 'Co-Pilot max spend per action exceeds cash on hand',
    evidenceFields: ['maxSpendPerAction', 'cash'],
    evaluate: s => s.cash > 0 && s.maxSpendPerAction > s.cash,
  },
  {
    id: 'guardian_automation_block_heuristic',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian May Block Automation',
    detailTemplate: 'Guardian posture suggests the next Co-Pilot automation may be blocked',
    evidenceFields: ['guardianAutomationLikelyBlocked', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianAutomationLikelyBlocked,
    followUp: 'Advisory heuristic only — enforcement remains evaluateGuardianRiskPipeline in canonical.',
  },
  {
    id: 'guardian_confirmation_likely',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Confirmation Likely',
    detailTemplate: 'Next risky action may require Guardian confirmation',
    evidenceFields: ['guardianConfirmationLikelyRequired', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianConfirmationLikelyRequired,
  },
  {
    id: 'guardian_notify_only_copilot_auto',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Notify Only With Co-Pilot Auto',
    detailTemplate: 'Guardian notify-only mode while Co-Pilot autonomous session is active',
    evidenceFields: ['guardianResponseMode', 'copilotAutonomousActive'],
    evaluate: s =>
      s.guardianEnabled && s.guardianResponseMode === 'notify_only' && s.copilotAutonomousActive,
  },
  {
    id: 'guardian_replay_guardian_disabled',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Replay Log Without Guardian',
    detailTemplate: 'Guardian replay events exist but Guardian is currently disabled',
    evidenceFields: ['guardianReplayCount', 'guardianEnabled'],
    evaluate: s => !s.guardianEnabled && s.guardianReplayCount > 0,
  },
  {
    id: 'copilot_rescue_critical_guardian',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Rescue Co-Pilot With Relaxed Guardian',
    detailTemplate: 'Co-Pilot rescue authority with Guardian critical-only protection',
    evidenceFields: ['copilotAuthorityMode', 'guardianProtectionLevel'],
    evaluate: s => s.copilotAuthorityMode === 'rescue' && s.guardianProtectionLevel === 'critical_only',
  },
  {
    id: 'rival_victory_midband',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Rival Victory Midband',
    detailTemplate: 'Rival victory progress is rising but not yet at critical threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: rivalMidband,
  },
  {
    id: 'objective_near_complete',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'info',
    title: 'Objective Near Complete',
    detailTemplate: 'Primary objective is above 90% progress',
    evidenceFields: ['objectiveProgressPct', 'objectiveActive'],
    evaluate: s =>
      s.objectiveActive && s.objectiveProgressPct !== null && s.objectiveProgressPct >= 90 && s.objectiveProgressPct < 100,
  },
  {
    id: 'objective_urgency_ap_remaining',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Objective Urgency With Ap Left',
    detailTemplate: 'Deadline pressure with limited AP and incomplete objective',
    evidenceFields: ['objectiveTurnsRemaining', 'apRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.apRemaining > 0 &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 2 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 80),
  },
  {
    id: 'team_plan_and_objective_deadline',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan And Objective Deadline',
    detailTemplate: 'Team plan pending while objective deadline is imminent',
    evidenceFields: ['teamPlanPending', 'objectiveTurnsRemaining'],
    evaluate: s =>
      s.teamPlanPending && s.objectiveTurnsRemaining !== null && s.objectiveTurnsRemaining <= 2,
  },
  {
    id: 'guardian_verdict_critical_path',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Critical Path',
    detailTemplate: 'Guardian heuristic reports critical severity on current posture',
    evidenceFields: ['guardianEnabled', 'guardianAutomationLikelyBlocked'],
    evaluate: s => {
      if (!s.guardianEnabled) return false;
      const v = inferGuardianVerdictFromSnapshot(s);
      return v.highestSeverity === 'critical' && guardianBlocksAutomation(v, s.guardianProtectionLevel);
    },
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE.length;
