import type { AdvisoryMonitorRule, GuardianCoPilotMonitorSnapshot } from './types.js';

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_2: AdvisoryMonitorRule[] = [
  {
    id: 'guardian_risk_score_elevated',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Risk Score Elevated',
    detailTemplate: 'Composite Guardian risk score is in the elevated band',
    evidenceFields: ['guardianRiskScore', 'guardianRiskBand'],
    evaluate: s => s.guardianEnabled && s.guardianRiskBand === 'elevated',
  },
  {
    id: 'guardian_risk_score_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Guardian Risk Score Critical',
    detailTemplate: 'Composite Guardian risk score is critical — review before spending AP',
    evidenceFields: ['guardianRiskScore', 'guardianRiskBand'],
    evaluate: s => s.guardianEnabled && s.guardianRiskBand === 'critical',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'copilot_spending_headroom_zero',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Co-Pilot Spending Headroom Zero',
    detailTemplate: 'Cash is at or below the Co-Pilot reserve — discretionary spend blocked',
    evidenceFields: ['copilotSpendingHeadroom', 'cash', 'minCashReserve'],
    evaluate: s => s.copilotEnabled && s.copilotSpendingHeadroom <= 0,
  },
  {
    id: 'copilot_spending_headroom_tight',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Co-Pilot Spending Headroom Tight',
    detailTemplate: 'Less than one max-spend action of headroom above reserve',
    evidenceFields: ['copilotSpendingHeadroom', 'maxSpendPerAction'],
    evaluate: s => s.copilotEnabled && s.copilotSpendingHeadroom > 0 && s.copilotSpendingHeadroom < s.maxSpendPerAction,
  },
  {
    id: 'objective_behind_schedule',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Objective Behind Schedule',
    detailTemplate: 'Primary objective progress trails the deadline pace',
    evidenceFields: ['objectiveBehindSchedule', 'objectiveProgressPct', 'objectiveTurnsRemaining'],
    evaluate: s => s.objectiveActive && s.objectiveBehindSchedule,
  },
  {
    id: 'objective_ap_exhausted_active',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Objective Active Ap Exhausted',
    detailTemplate: 'Primary objective still open but no AP remains this turn',
    evidenceFields: ['objectiveActive', 'apRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.apRemaining <= 0 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 100),
  },
  {
    id: 'guardian_strict_copilot_disabled',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Strict Guardian Co-Pilot Off',
    detailTemplate: 'Guardian confirmations enabled while Co-Pilot master toggle is off',
    evidenceFields: ['guardianRequiresConfirmation', 'copilotEnabled'],
    evaluate: s => s.guardianEnabled && s.guardianRequiresConfirmation && !s.copilotEnabled,
  },
  {
    id: 'guardian_major_mistakes_autonomous',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Major Mistakes With Autonomous Co-Pilot',
    detailTemplate: 'Co-Pilot autonomous session under major-mistakes Guardian protection',
    evidenceFields: ['guardianProtectionLevel', 'copilotAutonomousActive'],
    evaluate: s =>
      s.guardianEnabled && s.guardianProtectionLevel === 'major_mistakes' && s.copilotAutonomousActive,
  },
  {
    id: 'contract_expiring_wrong_region',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contract Expiring Wrong Region',
    detailTemplate: 'Contract expiring soon while you are not in the objective region',
    evidenceFields: ['expiringContractCount', 'playerInObjectiveRegion', 'objectiveTargetRegion'],
    evaluate: s =>
      s.expiringContractCount > 0 && s.objectiveActive && Boolean(s.objectiveTargetRegion) && !s.playerInObjectiveRegion,
  },
  {
    id: 'takeover_stale_guardian_replay',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Takeover Stale With Replay Log',
    detailTemplate: 'Long takeover session with Guardian replay history — verify posture',
    evidenceFields: ['takeoverSessionActive', 'takeoverSessionAgeTurns', 'guardianReplayCount'],
    evaluate: s => s.takeoverSessionActive && s.takeoverSessionAgeTurns >= 3 && s.guardianReplayCount > 5,
  },
  {
    id: 'rival_victory_watch_band',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Rival Victory Watch Band',
    detailTemplate: 'Rival victory progress crossed 75% of threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: (s: GuardianCoPilotMonitorSnapshot) => {
      if (s.rivalVictoryProgressPct === null) return false;
      const watch = s.victoryThresholdPct * 0.75;
      const critical = s.victoryThresholdPct * 0.85;
      return s.rivalVictoryProgressPct >= watch && s.rivalVictoryProgressPct < critical;
    },
  },
  {
    id: 'team_plan_objective_behind',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Plan While Objective Behind',
    detailTemplate: 'Team plan pending approval while objective is behind schedule',
    evidenceFields: ['teamPlanPending', 'objectiveBehindSchedule'],
    evaluate: s => s.teamPlanPending && s.objectiveBehindSchedule,
  },
];

export const ADVISORY_MONITOR_RULES_SCALE_WAVE_2_COUNT = ADVISORY_MONITOR_RULES_SCALE_WAVE_2.length;
