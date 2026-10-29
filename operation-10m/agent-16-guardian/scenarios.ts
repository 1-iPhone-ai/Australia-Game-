import type { AdvisoryScenarioDescriptor } from './types.js';

/** Deterministic scenarios with real monitor rule ids (replaces placeholder rule_ref_* catalog). */
export const ADVISORY_SCENARIO_CATALOG: AdvisoryScenarioDescriptor[] = [
  {
    id: 'sc_cash_below_reserve',
    category: 'liquidity',
    snapshot: { cash: 100, minCashReserve: 250 },
    expectRuleIds: ['cash_below_reserve'],
    notes: 'Cash under Co-Pilot reserve floor',
  },
  {
    id: 'sc_ap_exhausted',
    category: 'actions',
    snapshot: { apRemaining: 0 },
    expectRuleIds: ['ap_exhausted'],
    notes: 'No AP remaining',
  },
  {
    id: 'sc_copilot_blocked',
    category: 'copilot',
    snapshot: { blockedContinueCount: 2 },
    expectRuleIds: ['copilot_blocked_continues'],
    notes: 'Blocked continue limit hit',
  },
  {
    id: 'sc_guardian_off',
    category: 'guardian',
    snapshot: { guardianEnabled: false },
    expectRuleIds: ['guardian_disabled'],
    notes: 'Guardian master toggle off',
  },
  {
    id: 'sc_contract_expiring',
    category: 'contracts',
    snapshot: { expiringContractCount: 1, activeContractCount: 2 },
    expectRuleIds: ['contract_expiring_soon', 'contract_failure_risk'],
    notes: 'Expiring contract stack',
  },
  {
    id: 'sc_wrong_region',
    category: 'travel',
    snapshot: { region: 'NSW', objectiveRegion: 'VIC' },
    expectRuleIds: ['stranded_wrong_region'],
    notes: 'Objective region mismatch',
  },
  {
    id: 'sc_copilot_control',
    category: 'copilot',
    snapshot: { copilotHoldsControl: true },
    expectRuleIds: ['copilot_holding_control'],
    notes: 'Co-Pilot holds control',
  },
  {
    id: 'sc_team_plan_pending',
    category: 'team',
    snapshot: { teamPlanPending: true },
    expectRuleIds: ['team_plan_pending_approval'],
    notes: 'Team plan awaiting approval',
  },
  {
    id: 'sc_guardian_replay_backlog',
    category: 'guardian',
    snapshot: { guardianReplayCount: 60, guardianProtectionLevel: 'major_mistakes' },
    expectRuleIds: ['guardian_replay_backlog', 'guardian_recent_critical'],
    notes: 'Large replay log',
  },
  {
    id: 'sc_healthy_baseline',
    category: 'liquidity',
    snapshot: {
      cash: 5000,
      minCashReserve: 250,
      apRemaining: 3,
      guardianEnabled: true,
      blockedContinueCount: 0,
      expiringContractCount: 0,
      teamPlanPending: false,
    },
    expectRuleIds: [],
    notes: 'Healthy fixture should emit no critical liquidity alerts',
  },
];
