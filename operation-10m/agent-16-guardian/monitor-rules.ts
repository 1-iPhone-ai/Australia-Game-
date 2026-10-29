import type { AdvisoryMonitorRule, AdvisoryOpsKind, AdvisorySeverity, GuardianCoPilotMonitorSnapshot } from './types.js';
import { COPILOT_MAX_BLOCKED_CONTINUES } from './policy.js';
import { ADVISORY_MONITOR_RULES_EXPANSION } from './monitor-rules-expansion.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE } from './monitor-rules-scale-wave.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_2 } from './monitor-rules-scale-wave-2.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_3 } from './monitor-rules-scale-wave-3.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_4 } from './monitor-rules-scale-wave-4.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_5 } from './monitor-rules-scale-wave-5.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_6 } from './monitor-rules-scale-wave-6.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_7 } from './monitor-rules-scale-wave-7.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_8 } from './monitor-rules-scale-wave-8.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_9 } from './monitor-rules-scale-wave-9.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_10 } from './monitor-rules-scale-wave-10.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_11 } from './monitor-rules-scale-wave-11.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_12 } from './monitor-rules-scale-wave-12.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_13 } from './monitor-rules-scale-wave-13.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_14 } from './monitor-rules-scale-wave-14.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_15 } from './monitor-rules-scale-wave-15.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_16 } from './monitor-rules-scale-wave-16.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_17 } from './monitor-rules-scale-wave-17.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_18 } from './monitor-rules-scale-wave-18.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_19 } from './monitor-rules-scale-wave-19.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_20 } from './monitor-rules-scale-wave-20.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_21 } from './monitor-rules-scale-wave-21.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_22 } from './monitor-rules-scale-wave-22.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_23 } from './monitor-rules-scale-wave-23.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_24 } from './monitor-rules-scale-wave-24.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_25 } from './monitor-rules-scale-wave-25.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_26 } from './monitor-rules-scale-wave-26.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_27 } from './monitor-rules-scale-wave-27.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_28 } from './monitor-rules-scale-wave-28.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_29 } from './monitor-rules-scale-wave-29.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_30 } from './monitor-rules-scale-wave-30.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_31 } from './monitor-rules-scale-wave-31.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_32 } from './monitor-rules-scale-wave-32.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_33 } from './monitor-rules-scale-wave-33.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_34 } from './monitor-rules-scale-wave-34.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_35 } from './monitor-rules-scale-wave-35.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_36 } from './monitor-rules-scale-wave-36.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_37 } from './monitor-rules-scale-wave-37.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_38 } from './monitor-rules-scale-wave-38.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_39 } from './monitor-rules-scale-wave-39.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_40 } from './monitor-rules-scale-wave-40.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_41 } from './monitor-rules-scale-wave-41.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_42 } from './monitor-rules-scale-wave-42.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_43 } from './monitor-rules-scale-wave-43.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_44 } from './monitor-rules-scale-wave-44.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_45 } from './monitor-rules-scale-wave-45.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_46 } from './monitor-rules-scale-wave-46.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_47 } from './monitor-rules-scale-wave-47.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_48 } from './monitor-rules-scale-wave-48.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_49 } from './monitor-rules-scale-wave-49.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_50 } from './monitor-rules-scale-wave-50.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_51 } from './monitor-rules-scale-wave-51.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_52 } from './monitor-rules-scale-wave-52.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_53 } from './monitor-rules-scale-wave-53.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_54 } from './monitor-rules-scale-wave-54.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_55 } from './monitor-rules-scale-wave-55.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_56 } from './monitor-rules-scale-wave-56.js';
import { ADVISORY_MONITOR_RULES_SCALE_WAVE_57 } from './monitor-rules-scale-wave-57.js';

export type { AdvisoryMonitorRule };

export const ADVISORY_MONITOR_RULES: AdvisoryMonitorRule[] = [
  {
    id: 'cash_below_reserve',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Cash Below Reserve',
    detailTemplate: 'Cash is below your Co-Pilot minimum reserve floor',
    evidenceFields: ['cash', 'minCashReserve'],
    evaluate: s => s.cash < s.minCashReserve,
  },
  {
    id: 'cash_runway_short',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Cash Runway Short',
    detailTemplate: 'Projected runway under 3 turns at current burn',
    evidenceFields: ['cash', 'minCashReserve'],
    evaluate: s => s.cash > 0 && s.cash < s.minCashReserve * 3,
  },
  {
    id: 'debt_service_pressure',
    category: 'liquidity',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Debt Service Pressure',
    detailTemplate: 'Loan payments may exceed next-turn income',
    evidenceFields: ['debt', 'cash'],
    evaluate: s => s.debt > s.cash * 0.5,
  },
  {
    id: 'reserve_floor_unset',
    category: 'liquidity',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Reserve Floor Unset',
    detailTemplate: 'No minimum cash reserve configured for Co-Pilot',
    evidenceFields: ['minCashReserve'],
    evaluate: s => s.minCashReserve <= 0,
  },
  {
    id: 'ap_exhausted',
    category: 'actions',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Ap Exhausted',
    detailTemplate: 'No action points remain — end turn or wait',
    evidenceFields: ['apRemaining'],
    evaluate: s => s.apRemaining <= 0,
  },
  {
    id: 'ap_single_remaining',
    category: 'actions',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Ap Single Remaining',
    detailTemplate: 'One action left — spend deliberately',
    evidenceFields: ['apRemaining'],
    evaluate: s => s.apRemaining === 1,
  },
  {
    id: 'actions_per_day_mismatch',
    category: 'actions',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Actions Per Day Mismatch',
    detailTemplate: 'Action usage pattern differs from daily budget',
    evidenceFields: ['actionsUsedThisTurn', 'apPerDay'],
    evaluate: s => s.actionsUsedThisTurn > s.apPerDay,
  },
  {
    id: 'copilot_holding_control',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Copilot Holding Control',
    detailTemplate: 'Co-Pilot is executing — Take Control to act yourself',
    evidenceFields: ['copilotHoldsControl'],
    evaluate: s => s.copilotHoldsControl,
    followUp: 'Use Take Control in the Co-Pilot panel.',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.coPilot' },
  },
  {
    id: 'copilot_autonomous_without_start',
    category: 'copilot',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Copilot Autonomous Without Start',
    detailTemplate: 'Autonomous mode selected but Co-Pilot not started',
    evidenceFields: ['copilotAuthorityMode', 'copilotAutonomousActive'],
    evaluate: s => s.copilotAuthorityMode === 'autonomous' && !s.copilotAutonomousActive,
  },
  {
    id: 'takeover_session_stale',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Takeover Session Stale',
    detailTemplate: 'Takeover session age exceeds safe threshold',
    evidenceFields: ['takeoverSessionActive', 'takeoverSessionAgeTurns'],
    evaluate: s => s.takeoverSessionActive && s.takeoverSessionAgeTurns >= 5,
  },
  {
    id: 'copilot_blocked_continues',
    category: 'copilot',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Copilot Blocked Continues',
    detailTemplate: 'Co-Pilot hit blocked-action limit — review permissions',
    evidenceFields: ['blockedContinueCount'],
    evaluate: s => s.blockedContinueCount >= COPILOT_MAX_BLOCKED_CONTINUES,
  },
  {
    id: 'authority_escalation_pending',
    category: 'copilot',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Authority Escalation Pending',
    detailTemplate: 'A higher authority mode was requested but not confirmed',
    evidenceFields: ['copilotAuthorityMode', 'copilotEnabled'],
    evaluate: s => s.copilotAuthorityMode === 'assist' && s.copilotEnabled,
  },
  {
    id: 'guardian_disabled',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Disabled',
    detailTemplate: 'Guardian AI is off — mistake protection inactive',
    evidenceFields: ['guardianEnabled'],
    evaluate: s => !s.guardianEnabled,
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'guardian_notify_only',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Notify Only',
    detailTemplate: 'Guardian is notify-only — confirmations still required for blocks',
    evidenceFields: ['guardianEnabled', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianResponseMode === 'notify_only',
  },
  {
    id: 'guardian_recent_critical',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian Recent Critical',
    detailTemplate: 'Recent critical Guardian evaluation on record',
    evidenceFields: ['guardianReplayCount', 'guardianProtectionLevel'],
    evaluate: s => s.guardianReplayCount > 0 && s.guardianProtectionLevel !== 'off',
  },
  {
    id: 'guardian_replay_backlog',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Replay Backlog',
    detailTemplate: 'Guardian replay log growing — verify determinism in LAB',
    evidenceFields: ['guardianReplayCount'],
    evaluate: s => s.guardianReplayCount > 50,
  },
  {
    id: 'contract_expiring_soon',
    category: 'contracts',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Contract Expiring Soon',
    detailTemplate: 'An active contract expires within 2 turns',
    evidenceFields: ['expiringContractCount'],
    evaluate: s => s.expiringContractCount > 0,
  },
  {
    id: 'contract_failure_risk',
    category: 'contracts',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Contract Failure Risk',
    detailTemplate: 'Contract progress behind schedule',
    evidenceFields: ['activeContractCount', 'expiringContractCount'],
    evaluate: s => s.activeContractCount > 0 && s.expiringContractCount > 0,
  },
  {
    id: 'travel_high_cost',
    category: 'travel',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Travel High Cost',
    detailTemplate: 'Next travel exceeds 25% of liquid cash',
    evidenceFields: ['maxSpendPerAction', 'cash'],
    evaluate: s => s.cash > 0 && s.maxSpendPerAction > s.cash * 0.25,
  },
  {
    id: 'stranded_wrong_region',
    category: 'travel',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Stranded Wrong Region',
    detailTemplate: 'Objective region differs from current location',
    evidenceFields: ['objectiveRegion', 'region'],
    evaluate: s => Boolean(s.objectiveRegion && s.objectiveRegion !== s.region),
  },
  {
    id: 'team_plan_pending_approval',
    category: 'team',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Team Plan Pending Approval',
    detailTemplate: 'Team strategic plan awaits human approval',
    evidenceFields: ['teamPlanPending'],
    evaluate: s => s.teamPlanPending,
  },
  {
    id: 'team_spending_cap_near',
    category: 'team',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Team Spending Cap Near',
    detailTemplate: 'Team spend approaching configured cap',
    evidenceFields: ['cash', 'maxSpendPerAction'],
    evaluate: s => s.cash < s.maxSpendPerAction * 2,
  },
  ...ADVISORY_MONITOR_RULES_EXPANSION,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_2,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_3,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_4,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_5,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_6,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_7,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_8,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_9,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_10,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_11,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_12,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_13,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_14,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_15,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_16,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_17,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_18,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_19,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_20,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_21,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_22,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_23,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_24,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_25,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_26,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_27,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_28,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_29,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_30,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_31,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_32,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_33,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_34,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_35,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_36,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_37,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_38,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_39,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_40,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_41,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_42,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_43,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_44,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_45,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_46,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_47,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_48,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_49,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_50,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_51,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_52,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_53,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_54,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_55,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_56,
  ...ADVISORY_MONITOR_RULES_SCALE_WAVE_57,
];

export function getAdvisoryMonitorRuleById(id: string): AdvisoryMonitorRule | undefined {
  return ADVISORY_MONITOR_RULES.find(r => r.id === id);
}
