/**
 * Agent 18 — Team Intelligence 3.0: in-game AI team coordination, roles, and conflict prevention.
 * Operation 600K integration module (merge into canonical `(V9.4) australia-game-with-ai.tsx`).
 *
 * Planning-only layer: never executes actions; produces scores, assignments, and audit artifacts.
 */
import React, { useMemo, useState } from 'react';

export type TeamCoordination3Role =
  | 'earner'
  | 'explorer'
  | 'crafter'
  | 'support'
  | 'controller'
  | 'saboteur'
  | 'recovery';

export type TeamCoordination3Strictness = 'low' | 'balanced' | 'strict' | 'adaptive';

export type TeamCoordination3ConflictKind =
  | 'same_target_reservation'
  | 'same_region_deposit'
  | 'opposing_directives'
  | 'role_objective_mismatch'
  | 'duplicate_support_target'
  | 'travel_race'
  | 'envelope_over_allocation'
  | 'sabotage_friendly_fire'
  | 'sabotage_cross_team_collision'
  | 'challenge_double_booking'
  | 'craft_resource_contention'
  | 'recovery_role_steal'
  | 'controller_abandon'
  | 'explorer_cluster'
  | 'earner_hoarding'
  | 'treasury_request_storm'
  | 'directive_expiry_race'
  | 'parallel_plan_near_tie'
  | 'team_brain_goal_drift'
  | 'governor_block_chain';
export interface TeamCoordination3ActorSnapshot {
  id: string;
  name: string;
  teamId: string;
  role: TeamCoordination3Role;
  isHuman: boolean;
  money: number;
  protectedCash: number;
  regionId: string | null;
  topCandidateTargetKey: string | null;
  topCandidateScore: number;
  directiveTypes: string[];
  responsibilityFocus: string | null;
}

export interface TeamCoordination3Conflict {
  id: string;
  kind: TeamCoordination3ConflictKind;
  severity: 'info' | 'warning' | 'error';
  actorIds: string[];
  targetKey: string | null;
  message: string;
  detectedTurn: number;
  playbookId: string | null;
}

export interface TeamCoordination3Resolution {
  conflictId: string;
  actorId: string;
  action: 'keep' | 'reassign_candidate' | 'defer' | 'escalate_to_player' | 'swap_role';
  candidateIndex: number | null;
  coordinationNote: string;
  scoreDelta: number;
}

export interface TeamCoordination3Plan {
  teamId: string;
  turn: number;
  strictness: TeamCoordination3Strictness;
  conflicts: TeamCoordination3Conflict[];
  resolutions: TeamCoordination3Resolution[];
  roleAssignments: Record<string, TeamCoordination3Role>;
  ledgerEntries: string[];
  hash: string;
}

export interface TeamCoordination3Playbook {
  id: string;
  kind: TeamCoordination3ConflictKind;
  severity: 'info' | 'warning' | 'error';
  strictness: TeamCoordination3Strictness;
  title: string;
  summary: string;
  steps: string[];
  penaltyScore: number;
}

export interface TeamCoordination3ScenarioFixture {
  id: string;
  label: string;
  turn: number;
  teamId: string;
  actorA: string;
  actorB: string;
  roleA: TeamCoordination3Role;
  roleB: TeamCoordination3Role;
  conflictKind: TeamCoordination3ConflictKind;
  strictness: TeamCoordination3Strictness;
  expectedResolvable: boolean;
}

export const TEAM_COORDINATION3_ROLE_LABELS: Record<TeamCoordination3Role, string> = {
  earner: 'Earner',
  explorer: 'Explorer',
  crafter: 'Crafter',
  support: 'Support',
  controller: 'Controller',
  saboteur: 'Saboteur',
  recovery: 'Recovery',
};

export const TEAM_COORDINATION3_ROLE_PRIORITY: Record<TeamCoordination3Role, number> = {
  recovery: 0,
  support: 1,
  controller: 2,
  earner: 3,
  crafter: 4,
  explorer: 5,
  saboteur: 6,
};

export const TEAM_COORDINATION3_CONFLICT_DESCRIPTIONS: Record<TeamCoordination3ConflictKind, string> = {
  same_target_reservation: 'Two teammates claim the same reservation target.',
  same_region_deposit: 'Two teammates plan deposits into the same region this round.',
  opposing_directives: 'Active team messages contradict each other.',
  role_objective_mismatch: 'Assigned role conflicts with Team OS responsibility.',
  duplicate_support_target: 'Multiple actors target the same weak teammate for cash aid.',
  travel_race: 'Two actors travel to the same region for competing purposes.',
  envelope_over_allocation: 'Planned spends exceed the team resource envelope.',
  sabotage_friendly_fire: 'Sabotage plan risks hitting a disguised ally target.',
  sabotage_cross_team_collision: 'Rival teams pick identical sabotage payloads.',
  challenge_double_booking: 'Two actors attempt the same seasonal challenge.',
  craft_resource_contention: 'Both actors consume the last shared recipe input.',
  recovery_role_steal: 'Recovery actor takes expansion actions against role contract.',
  controller_abandon: 'Controller leaves a defended region while threat is critical.',
  explorer_cluster: 'Explorers converge on the same low-value region.',
  earner_hoarding: 'Earner refuses support while team liquidity is critical.',
  treasury_request_storm: 'Multiple simultaneous treasury withdrawal requests.',
  directive_expiry_race: 'Actors act on directives about to expire.',
  parallel_plan_near_tie: 'Near-tie scores on identical targets in parallel planning.',
  team_brain_goal_drift: 'Team Brain goal diverges from Team OS contract mission.',
  governor_block_chain: 'Governor blocks cascade planned by multiple actors.'};

export const TEAM_COORDINATION3_PLAYBOOKS: TeamCoordination3Playbook[] = [
  {'id': 'pb_same_target_reservation_info_low', 'kind': 'same_target_reservation', 'severity': 'info', 'strictness': 'low', 'title': 'Same Target Reservation (low)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 1},
  {'id': 'pb_same_target_reservation_info_balanced', 'kind': 'same_target_reservation', 'severity': 'info', 'strictness': 'balanced', 'title': 'Same Target Reservation (balanced)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 1},
  {'id': 'pb_same_target_reservation_info_strict', 'kind': 'same_target_reservation', 'severity': 'info', 'strictness': 'strict', 'title': 'Same Target Reservation (strict)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 1},
  {'id': 'pb_same_target_reservation_info_adaptive', 'kind': 'same_target_reservation', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Same Target Reservation (adaptive)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 1},
  {'id': 'pb_same_target_reservation_warning_low', 'kind': 'same_target_reservation', 'severity': 'warning', 'strictness': 'low', 'title': 'Same Target Reservation (low)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_target_reservation_warning_balanced', 'kind': 'same_target_reservation', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Same Target Reservation (balanced)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_target_reservation_warning_strict', 'kind': 'same_target_reservation', 'severity': 'warning', 'strictness': 'strict', 'title': 'Same Target Reservation (strict)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_target_reservation_warning_adaptive', 'kind': 'same_target_reservation', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Same Target Reservation (adaptive)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_target_reservation_error_low', 'kind': 'same_target_reservation', 'severity': 'error', 'strictness': 'low', 'title': 'Same Target Reservation (low)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_target_reservation_error_balanced', 'kind': 'same_target_reservation', 'severity': 'error', 'strictness': 'balanced', 'title': 'Same Target Reservation (balanced)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_target_reservation_error_strict', 'kind': 'same_target_reservation', 'severity': 'error', 'strictness': 'strict', 'title': 'Same Target Reservation (strict)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_target_reservation_error_adaptive', 'kind': 'same_target_reservation', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Same Target Reservation (adaptive)', 'summary': 'Two teammates claim the same reservation target.', 'steps': ['Identify actors involved in same_target_reservation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_region_deposit_info_low', 'kind': 'same_region_deposit', 'severity': 'info', 'strictness': 'low', 'title': 'Same Region Deposit (low)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_region_deposit_info_balanced', 'kind': 'same_region_deposit', 'severity': 'info', 'strictness': 'balanced', 'title': 'Same Region Deposit (balanced)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_region_deposit_info_strict', 'kind': 'same_region_deposit', 'severity': 'info', 'strictness': 'strict', 'title': 'Same Region Deposit (strict)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_region_deposit_info_adaptive', 'kind': 'same_region_deposit', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Same Region Deposit (adaptive)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 2},
  {'id': 'pb_same_region_deposit_warning_low', 'kind': 'same_region_deposit', 'severity': 'warning', 'strictness': 'low', 'title': 'Same Region Deposit (low)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_region_deposit_warning_balanced', 'kind': 'same_region_deposit', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Same Region Deposit (balanced)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_region_deposit_warning_strict', 'kind': 'same_region_deposit', 'severity': 'warning', 'strictness': 'strict', 'title': 'Same Region Deposit (strict)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_region_deposit_warning_adaptive', 'kind': 'same_region_deposit', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Same Region Deposit (adaptive)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_same_region_deposit_error_low', 'kind': 'same_region_deposit', 'severity': 'error', 'strictness': 'low', 'title': 'Same Region Deposit (low)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_same_region_deposit_error_balanced', 'kind': 'same_region_deposit', 'severity': 'error', 'strictness': 'balanced', 'title': 'Same Region Deposit (balanced)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_same_region_deposit_error_strict', 'kind': 'same_region_deposit', 'severity': 'error', 'strictness': 'strict', 'title': 'Same Region Deposit (strict)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_same_region_deposit_error_adaptive', 'kind': 'same_region_deposit', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Same Region Deposit (adaptive)', 'summary': 'Two teammates plan deposits into the same region this round.', 'steps': ['Identify actors involved in same_region_deposit.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_opposing_directives_info_low', 'kind': 'opposing_directives', 'severity': 'info', 'strictness': 'low', 'title': 'Opposing Directives (low)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 3},
  {'id': 'pb_opposing_directives_info_balanced', 'kind': 'opposing_directives', 'severity': 'info', 'strictness': 'balanced', 'title': 'Opposing Directives (balanced)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 3},
  {'id': 'pb_opposing_directives_info_strict', 'kind': 'opposing_directives', 'severity': 'info', 'strictness': 'strict', 'title': 'Opposing Directives (strict)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 3},
  {'id': 'pb_opposing_directives_info_adaptive', 'kind': 'opposing_directives', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Opposing Directives (adaptive)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 3},
  {'id': 'pb_opposing_directives_warning_low', 'kind': 'opposing_directives', 'severity': 'warning', 'strictness': 'low', 'title': 'Opposing Directives (low)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_opposing_directives_warning_balanced', 'kind': 'opposing_directives', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Opposing Directives (balanced)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_opposing_directives_warning_strict', 'kind': 'opposing_directives', 'severity': 'warning', 'strictness': 'strict', 'title': 'Opposing Directives (strict)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_opposing_directives_warning_adaptive', 'kind': 'opposing_directives', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Opposing Directives (adaptive)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_opposing_directives_error_low', 'kind': 'opposing_directives', 'severity': 'error', 'strictness': 'low', 'title': 'Opposing Directives (low)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_opposing_directives_error_balanced', 'kind': 'opposing_directives', 'severity': 'error', 'strictness': 'balanced', 'title': 'Opposing Directives (balanced)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_opposing_directives_error_strict', 'kind': 'opposing_directives', 'severity': 'error', 'strictness': 'strict', 'title': 'Opposing Directives (strict)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_opposing_directives_error_adaptive', 'kind': 'opposing_directives', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Opposing Directives (adaptive)', 'summary': 'Active team messages contradict each other.', 'steps': ['Identify actors involved in opposing_directives.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_role_objective_mismatch_info_low', 'kind': 'role_objective_mismatch', 'severity': 'info', 'strictness': 'low', 'title': 'Role Objective Mismatch (low)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_role_objective_mismatch_info_balanced', 'kind': 'role_objective_mismatch', 'severity': 'info', 'strictness': 'balanced', 'title': 'Role Objective Mismatch (balanced)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_role_objective_mismatch_info_strict', 'kind': 'role_objective_mismatch', 'severity': 'info', 'strictness': 'strict', 'title': 'Role Objective Mismatch (strict)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_role_objective_mismatch_info_adaptive', 'kind': 'role_objective_mismatch', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Role Objective Mismatch (adaptive)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 4},
  {'id': 'pb_role_objective_mismatch_warning_low', 'kind': 'role_objective_mismatch', 'severity': 'warning', 'strictness': 'low', 'title': 'Role Objective Mismatch (low)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_role_objective_mismatch_warning_balanced', 'kind': 'role_objective_mismatch', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Role Objective Mismatch (balanced)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_role_objective_mismatch_warning_strict', 'kind': 'role_objective_mismatch', 'severity': 'warning', 'strictness': 'strict', 'title': 'Role Objective Mismatch (strict)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_role_objective_mismatch_warning_adaptive', 'kind': 'role_objective_mismatch', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Role Objective Mismatch (adaptive)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_role_objective_mismatch_error_low', 'kind': 'role_objective_mismatch', 'severity': 'error', 'strictness': 'low', 'title': 'Role Objective Mismatch (low)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_role_objective_mismatch_error_balanced', 'kind': 'role_objective_mismatch', 'severity': 'error', 'strictness': 'balanced', 'title': 'Role Objective Mismatch (balanced)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_role_objective_mismatch_error_strict', 'kind': 'role_objective_mismatch', 'severity': 'error', 'strictness': 'strict', 'title': 'Role Objective Mismatch (strict)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_role_objective_mismatch_error_adaptive', 'kind': 'role_objective_mismatch', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Role Objective Mismatch (adaptive)', 'summary': 'Assigned role conflicts with Team OS responsibility.', 'steps': ['Identify actors involved in role_objective_mismatch.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_duplicate_support_target_info_low', 'kind': 'duplicate_support_target', 'severity': 'info', 'strictness': 'low', 'title': 'Duplicate Support Target (low)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 5},
  {'id': 'pb_duplicate_support_target_info_balanced', 'kind': 'duplicate_support_target', 'severity': 'info', 'strictness': 'balanced', 'title': 'Duplicate Support Target (balanced)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 5},
  {'id': 'pb_duplicate_support_target_info_strict', 'kind': 'duplicate_support_target', 'severity': 'info', 'strictness': 'strict', 'title': 'Duplicate Support Target (strict)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 5},
  {'id': 'pb_duplicate_support_target_info_adaptive', 'kind': 'duplicate_support_target', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Duplicate Support Target (adaptive)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 5},
  {'id': 'pb_duplicate_support_target_warning_low', 'kind': 'duplicate_support_target', 'severity': 'warning', 'strictness': 'low', 'title': 'Duplicate Support Target (low)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_duplicate_support_target_warning_balanced', 'kind': 'duplicate_support_target', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Duplicate Support Target (balanced)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_duplicate_support_target_warning_strict', 'kind': 'duplicate_support_target', 'severity': 'warning', 'strictness': 'strict', 'title': 'Duplicate Support Target (strict)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_duplicate_support_target_warning_adaptive', 'kind': 'duplicate_support_target', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Duplicate Support Target (adaptive)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_duplicate_support_target_error_low', 'kind': 'duplicate_support_target', 'severity': 'error', 'strictness': 'low', 'title': 'Duplicate Support Target (low)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_duplicate_support_target_error_balanced', 'kind': 'duplicate_support_target', 'severity': 'error', 'strictness': 'balanced', 'title': 'Duplicate Support Target (balanced)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_duplicate_support_target_error_strict', 'kind': 'duplicate_support_target', 'severity': 'error', 'strictness': 'strict', 'title': 'Duplicate Support Target (strict)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_duplicate_support_target_error_adaptive', 'kind': 'duplicate_support_target', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Duplicate Support Target (adaptive)', 'summary': 'Multiple actors target the same weak teammate for cash aid.', 'steps': ['Identify actors involved in duplicate_support_target.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_travel_race_info_low', 'kind': 'travel_race', 'severity': 'info', 'strictness': 'low', 'title': 'Travel Race (low)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_travel_race_info_balanced', 'kind': 'travel_race', 'severity': 'info', 'strictness': 'balanced', 'title': 'Travel Race (balanced)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_travel_race_info_strict', 'kind': 'travel_race', 'severity': 'info', 'strictness': 'strict', 'title': 'Travel Race (strict)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_travel_race_info_adaptive', 'kind': 'travel_race', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Travel Race (adaptive)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 6},
  {'id': 'pb_travel_race_warning_low', 'kind': 'travel_race', 'severity': 'warning', 'strictness': 'low', 'title': 'Travel Race (low)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_travel_race_warning_balanced', 'kind': 'travel_race', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Travel Race (balanced)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_travel_race_warning_strict', 'kind': 'travel_race', 'severity': 'warning', 'strictness': 'strict', 'title': 'Travel Race (strict)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_travel_race_warning_adaptive', 'kind': 'travel_race', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Travel Race (adaptive)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_travel_race_error_low', 'kind': 'travel_race', 'severity': 'error', 'strictness': 'low', 'title': 'Travel Race (low)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_travel_race_error_balanced', 'kind': 'travel_race', 'severity': 'error', 'strictness': 'balanced', 'title': 'Travel Race (balanced)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_travel_race_error_strict', 'kind': 'travel_race', 'severity': 'error', 'strictness': 'strict', 'title': 'Travel Race (strict)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_travel_race_error_adaptive', 'kind': 'travel_race', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Travel Race (adaptive)', 'summary': 'Two actors travel to the same region for competing purposes.', 'steps': ['Identify actors involved in travel_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_envelope_over_allocation_info_low', 'kind': 'envelope_over_allocation', 'severity': 'info', 'strictness': 'low', 'title': 'Envelope Over Allocation (low)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 7},
  {'id': 'pb_envelope_over_allocation_info_balanced', 'kind': 'envelope_over_allocation', 'severity': 'info', 'strictness': 'balanced', 'title': 'Envelope Over Allocation (balanced)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 7},
  {'id': 'pb_envelope_over_allocation_info_strict', 'kind': 'envelope_over_allocation', 'severity': 'info', 'strictness': 'strict', 'title': 'Envelope Over Allocation (strict)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 7},
  {'id': 'pb_envelope_over_allocation_info_adaptive', 'kind': 'envelope_over_allocation', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Envelope Over Allocation (adaptive)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 7},
  {'id': 'pb_envelope_over_allocation_warning_low', 'kind': 'envelope_over_allocation', 'severity': 'warning', 'strictness': 'low', 'title': 'Envelope Over Allocation (low)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_envelope_over_allocation_warning_balanced', 'kind': 'envelope_over_allocation', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Envelope Over Allocation (balanced)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_envelope_over_allocation_warning_strict', 'kind': 'envelope_over_allocation', 'severity': 'warning', 'strictness': 'strict', 'title': 'Envelope Over Allocation (strict)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_envelope_over_allocation_warning_adaptive', 'kind': 'envelope_over_allocation', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Envelope Over Allocation (adaptive)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_envelope_over_allocation_error_low', 'kind': 'envelope_over_allocation', 'severity': 'error', 'strictness': 'low', 'title': 'Envelope Over Allocation (low)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_envelope_over_allocation_error_balanced', 'kind': 'envelope_over_allocation', 'severity': 'error', 'strictness': 'balanced', 'title': 'Envelope Over Allocation (balanced)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_envelope_over_allocation_error_strict', 'kind': 'envelope_over_allocation', 'severity': 'error', 'strictness': 'strict', 'title': 'Envelope Over Allocation (strict)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_envelope_over_allocation_error_adaptive', 'kind': 'envelope_over_allocation', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Envelope Over Allocation (adaptive)', 'summary': 'Planned spends exceed the team resource envelope.', 'steps': ['Identify actors involved in envelope_over_allocation.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_sabotage_friendly_fire_info_low', 'kind': 'sabotage_friendly_fire', 'severity': 'info', 'strictness': 'low', 'title': 'Sabotage Friendly Fire (low)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_sabotage_friendly_fire_info_balanced', 'kind': 'sabotage_friendly_fire', 'severity': 'info', 'strictness': 'balanced', 'title': 'Sabotage Friendly Fire (balanced)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_sabotage_friendly_fire_info_strict', 'kind': 'sabotage_friendly_fire', 'severity': 'info', 'strictness': 'strict', 'title': 'Sabotage Friendly Fire (strict)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_sabotage_friendly_fire_info_adaptive', 'kind': 'sabotage_friendly_fire', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Sabotage Friendly Fire (adaptive)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 8},
  {'id': 'pb_sabotage_friendly_fire_warning_low', 'kind': 'sabotage_friendly_fire', 'severity': 'warning', 'strictness': 'low', 'title': 'Sabotage Friendly Fire (low)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_sabotage_friendly_fire_warning_balanced', 'kind': 'sabotage_friendly_fire', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Sabotage Friendly Fire (balanced)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_sabotage_friendly_fire_warning_strict', 'kind': 'sabotage_friendly_fire', 'severity': 'warning', 'strictness': 'strict', 'title': 'Sabotage Friendly Fire (strict)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_sabotage_friendly_fire_warning_adaptive', 'kind': 'sabotage_friendly_fire', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Sabotage Friendly Fire (adaptive)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_sabotage_friendly_fire_error_low', 'kind': 'sabotage_friendly_fire', 'severity': 'error', 'strictness': 'low', 'title': 'Sabotage Friendly Fire (low)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_sabotage_friendly_fire_error_balanced', 'kind': 'sabotage_friendly_fire', 'severity': 'error', 'strictness': 'balanced', 'title': 'Sabotage Friendly Fire (balanced)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_sabotage_friendly_fire_error_strict', 'kind': 'sabotage_friendly_fire', 'severity': 'error', 'strictness': 'strict', 'title': 'Sabotage Friendly Fire (strict)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_sabotage_friendly_fire_error_adaptive', 'kind': 'sabotage_friendly_fire', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Sabotage Friendly Fire (adaptive)', 'summary': 'Sabotage plan risks hitting a disguised ally target.', 'steps': ['Identify actors involved in sabotage_friendly_fire.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_sabotage_cross_team_collision_info_low', 'kind': 'sabotage_cross_team_collision', 'severity': 'info', 'strictness': 'low', 'title': 'Sabotage Cross Team Collision (low)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 9},
  {'id': 'pb_sabotage_cross_team_collision_info_balanced', 'kind': 'sabotage_cross_team_collision', 'severity': 'info', 'strictness': 'balanced', 'title': 'Sabotage Cross Team Collision (balanced)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 9},
  {'id': 'pb_sabotage_cross_team_collision_info_strict', 'kind': 'sabotage_cross_team_collision', 'severity': 'info', 'strictness': 'strict', 'title': 'Sabotage Cross Team Collision (strict)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 9},
  {'id': 'pb_sabotage_cross_team_collision_info_adaptive', 'kind': 'sabotage_cross_team_collision', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Sabotage Cross Team Collision (adaptive)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 9},
  {'id': 'pb_sabotage_cross_team_collision_warning_low', 'kind': 'sabotage_cross_team_collision', 'severity': 'warning', 'strictness': 'low', 'title': 'Sabotage Cross Team Collision (low)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_sabotage_cross_team_collision_warning_balanced', 'kind': 'sabotage_cross_team_collision', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Sabotage Cross Team Collision (balanced)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_sabotage_cross_team_collision_warning_strict', 'kind': 'sabotage_cross_team_collision', 'severity': 'warning', 'strictness': 'strict', 'title': 'Sabotage Cross Team Collision (strict)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_sabotage_cross_team_collision_warning_adaptive', 'kind': 'sabotage_cross_team_collision', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Sabotage Cross Team Collision (adaptive)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_sabotage_cross_team_collision_error_low', 'kind': 'sabotage_cross_team_collision', 'severity': 'error', 'strictness': 'low', 'title': 'Sabotage Cross Team Collision (low)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_sabotage_cross_team_collision_error_balanced', 'kind': 'sabotage_cross_team_collision', 'severity': 'error', 'strictness': 'balanced', 'title': 'Sabotage Cross Team Collision (balanced)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_sabotage_cross_team_collision_error_strict', 'kind': 'sabotage_cross_team_collision', 'severity': 'error', 'strictness': 'strict', 'title': 'Sabotage Cross Team Collision (strict)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_sabotage_cross_team_collision_error_adaptive', 'kind': 'sabotage_cross_team_collision', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Sabotage Cross Team Collision (adaptive)', 'summary': 'Rival teams pick identical sabotage payloads.', 'steps': ['Identify actors involved in sabotage_cross_team_collision.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_challenge_double_booking_info_low', 'kind': 'challenge_double_booking', 'severity': 'info', 'strictness': 'low', 'title': 'Challenge Double Booking (low)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_challenge_double_booking_info_balanced', 'kind': 'challenge_double_booking', 'severity': 'info', 'strictness': 'balanced', 'title': 'Challenge Double Booking (balanced)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_challenge_double_booking_info_strict', 'kind': 'challenge_double_booking', 'severity': 'info', 'strictness': 'strict', 'title': 'Challenge Double Booking (strict)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_challenge_double_booking_info_adaptive', 'kind': 'challenge_double_booking', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Challenge Double Booking (adaptive)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 10},
  {'id': 'pb_challenge_double_booking_warning_low', 'kind': 'challenge_double_booking', 'severity': 'warning', 'strictness': 'low', 'title': 'Challenge Double Booking (low)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_challenge_double_booking_warning_balanced', 'kind': 'challenge_double_booking', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Challenge Double Booking (balanced)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_challenge_double_booking_warning_strict', 'kind': 'challenge_double_booking', 'severity': 'warning', 'strictness': 'strict', 'title': 'Challenge Double Booking (strict)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_challenge_double_booking_warning_adaptive', 'kind': 'challenge_double_booking', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Challenge Double Booking (adaptive)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_challenge_double_booking_error_low', 'kind': 'challenge_double_booking', 'severity': 'error', 'strictness': 'low', 'title': 'Challenge Double Booking (low)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_challenge_double_booking_error_balanced', 'kind': 'challenge_double_booking', 'severity': 'error', 'strictness': 'balanced', 'title': 'Challenge Double Booking (balanced)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_challenge_double_booking_error_strict', 'kind': 'challenge_double_booking', 'severity': 'error', 'strictness': 'strict', 'title': 'Challenge Double Booking (strict)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_challenge_double_booking_error_adaptive', 'kind': 'challenge_double_booking', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Challenge Double Booking (adaptive)', 'summary': 'Two actors attempt the same seasonal challenge.', 'steps': ['Identify actors involved in challenge_double_booking.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_craft_resource_contention_info_low', 'kind': 'craft_resource_contention', 'severity': 'info', 'strictness': 'low', 'title': 'Craft Resource Contention (low)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 11},
  {'id': 'pb_craft_resource_contention_info_balanced', 'kind': 'craft_resource_contention', 'severity': 'info', 'strictness': 'balanced', 'title': 'Craft Resource Contention (balanced)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 11},
  {'id': 'pb_craft_resource_contention_info_strict', 'kind': 'craft_resource_contention', 'severity': 'info', 'strictness': 'strict', 'title': 'Craft Resource Contention (strict)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 11},
  {'id': 'pb_craft_resource_contention_info_adaptive', 'kind': 'craft_resource_contention', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Craft Resource Contention (adaptive)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 11},
  {'id': 'pb_craft_resource_contention_warning_low', 'kind': 'craft_resource_contention', 'severity': 'warning', 'strictness': 'low', 'title': 'Craft Resource Contention (low)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 22},
  {'id': 'pb_craft_resource_contention_warning_balanced', 'kind': 'craft_resource_contention', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Craft Resource Contention (balanced)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 22},
  {'id': 'pb_craft_resource_contention_warning_strict', 'kind': 'craft_resource_contention', 'severity': 'warning', 'strictness': 'strict', 'title': 'Craft Resource Contention (strict)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 22},
  {'id': 'pb_craft_resource_contention_warning_adaptive', 'kind': 'craft_resource_contention', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Craft Resource Contention (adaptive)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 22},
  {'id': 'pb_craft_resource_contention_error_low', 'kind': 'craft_resource_contention', 'severity': 'error', 'strictness': 'low', 'title': 'Craft Resource Contention (low)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 44},
  {'id': 'pb_craft_resource_contention_error_balanced', 'kind': 'craft_resource_contention', 'severity': 'error', 'strictness': 'balanced', 'title': 'Craft Resource Contention (balanced)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 44},
  {'id': 'pb_craft_resource_contention_error_strict', 'kind': 'craft_resource_contention', 'severity': 'error', 'strictness': 'strict', 'title': 'Craft Resource Contention (strict)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 44},
  {'id': 'pb_craft_resource_contention_error_adaptive', 'kind': 'craft_resource_contention', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Craft Resource Contention (adaptive)', 'summary': 'Both actors consume the last shared recipe input.', 'steps': ['Identify actors involved in craft_resource_contention.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 44},
  {'id': 'pb_recovery_role_steal_info_low', 'kind': 'recovery_role_steal', 'severity': 'info', 'strictness': 'low', 'title': 'Recovery Role Steal (low)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_recovery_role_steal_info_balanced', 'kind': 'recovery_role_steal', 'severity': 'info', 'strictness': 'balanced', 'title': 'Recovery Role Steal (balanced)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_recovery_role_steal_info_strict', 'kind': 'recovery_role_steal', 'severity': 'info', 'strictness': 'strict', 'title': 'Recovery Role Steal (strict)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_recovery_role_steal_info_adaptive', 'kind': 'recovery_role_steal', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Recovery Role Steal (adaptive)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 12},
  {'id': 'pb_recovery_role_steal_warning_low', 'kind': 'recovery_role_steal', 'severity': 'warning', 'strictness': 'low', 'title': 'Recovery Role Steal (low)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_recovery_role_steal_warning_balanced', 'kind': 'recovery_role_steal', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Recovery Role Steal (balanced)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_recovery_role_steal_warning_strict', 'kind': 'recovery_role_steal', 'severity': 'warning', 'strictness': 'strict', 'title': 'Recovery Role Steal (strict)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_recovery_role_steal_warning_adaptive', 'kind': 'recovery_role_steal', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Recovery Role Steal (adaptive)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 24},
  {'id': 'pb_recovery_role_steal_error_low', 'kind': 'recovery_role_steal', 'severity': 'error', 'strictness': 'low', 'title': 'Recovery Role Steal (low)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 48},
  {'id': 'pb_recovery_role_steal_error_balanced', 'kind': 'recovery_role_steal', 'severity': 'error', 'strictness': 'balanced', 'title': 'Recovery Role Steal (balanced)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 48},
  {'id': 'pb_recovery_role_steal_error_strict', 'kind': 'recovery_role_steal', 'severity': 'error', 'strictness': 'strict', 'title': 'Recovery Role Steal (strict)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 48},
  {'id': 'pb_recovery_role_steal_error_adaptive', 'kind': 'recovery_role_steal', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Recovery Role Steal (adaptive)', 'summary': 'Recovery actor takes expansion actions against role contract.', 'steps': ['Identify actors involved in recovery_role_steal.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 48},
  {'id': 'pb_controller_abandon_info_low', 'kind': 'controller_abandon', 'severity': 'info', 'strictness': 'low', 'title': 'Controller Abandon (low)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 13},
  {'id': 'pb_controller_abandon_info_balanced', 'kind': 'controller_abandon', 'severity': 'info', 'strictness': 'balanced', 'title': 'Controller Abandon (balanced)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 13},
  {'id': 'pb_controller_abandon_info_strict', 'kind': 'controller_abandon', 'severity': 'info', 'strictness': 'strict', 'title': 'Controller Abandon (strict)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 13},
  {'id': 'pb_controller_abandon_info_adaptive', 'kind': 'controller_abandon', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Controller Abandon (adaptive)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 13},
  {'id': 'pb_controller_abandon_warning_low', 'kind': 'controller_abandon', 'severity': 'warning', 'strictness': 'low', 'title': 'Controller Abandon (low)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 26},
  {'id': 'pb_controller_abandon_warning_balanced', 'kind': 'controller_abandon', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Controller Abandon (balanced)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 26},
  {'id': 'pb_controller_abandon_warning_strict', 'kind': 'controller_abandon', 'severity': 'warning', 'strictness': 'strict', 'title': 'Controller Abandon (strict)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 26},
  {'id': 'pb_controller_abandon_warning_adaptive', 'kind': 'controller_abandon', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Controller Abandon (adaptive)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 26},
  {'id': 'pb_controller_abandon_error_low', 'kind': 'controller_abandon', 'severity': 'error', 'strictness': 'low', 'title': 'Controller Abandon (low)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 52},
  {'id': 'pb_controller_abandon_error_balanced', 'kind': 'controller_abandon', 'severity': 'error', 'strictness': 'balanced', 'title': 'Controller Abandon (balanced)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 52},
  {'id': 'pb_controller_abandon_error_strict', 'kind': 'controller_abandon', 'severity': 'error', 'strictness': 'strict', 'title': 'Controller Abandon (strict)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 52},
  {'id': 'pb_controller_abandon_error_adaptive', 'kind': 'controller_abandon', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Controller Abandon (adaptive)', 'summary': 'Controller leaves a defended region while threat is critical.', 'steps': ['Identify actors involved in controller_abandon.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 52},
  {'id': 'pb_explorer_cluster_info_low', 'kind': 'explorer_cluster', 'severity': 'info', 'strictness': 'low', 'title': 'Explorer Cluster (low)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_explorer_cluster_info_balanced', 'kind': 'explorer_cluster', 'severity': 'info', 'strictness': 'balanced', 'title': 'Explorer Cluster (balanced)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_explorer_cluster_info_strict', 'kind': 'explorer_cluster', 'severity': 'info', 'strictness': 'strict', 'title': 'Explorer Cluster (strict)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_explorer_cluster_info_adaptive', 'kind': 'explorer_cluster', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Explorer Cluster (adaptive)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 14},
  {'id': 'pb_explorer_cluster_warning_low', 'kind': 'explorer_cluster', 'severity': 'warning', 'strictness': 'low', 'title': 'Explorer Cluster (low)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_explorer_cluster_warning_balanced', 'kind': 'explorer_cluster', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Explorer Cluster (balanced)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_explorer_cluster_warning_strict', 'kind': 'explorer_cluster', 'severity': 'warning', 'strictness': 'strict', 'title': 'Explorer Cluster (strict)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_explorer_cluster_warning_adaptive', 'kind': 'explorer_cluster', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Explorer Cluster (adaptive)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 28},
  {'id': 'pb_explorer_cluster_error_low', 'kind': 'explorer_cluster', 'severity': 'error', 'strictness': 'low', 'title': 'Explorer Cluster (low)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 56},
  {'id': 'pb_explorer_cluster_error_balanced', 'kind': 'explorer_cluster', 'severity': 'error', 'strictness': 'balanced', 'title': 'Explorer Cluster (balanced)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 56},
  {'id': 'pb_explorer_cluster_error_strict', 'kind': 'explorer_cluster', 'severity': 'error', 'strictness': 'strict', 'title': 'Explorer Cluster (strict)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 56},
  {'id': 'pb_explorer_cluster_error_adaptive', 'kind': 'explorer_cluster', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Explorer Cluster (adaptive)', 'summary': 'Explorers converge on the same low-value region.', 'steps': ['Identify actors involved in explorer_cluster.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 56},
  {'id': 'pb_earner_hoarding_info_low', 'kind': 'earner_hoarding', 'severity': 'info', 'strictness': 'low', 'title': 'Earner Hoarding (low)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 15},
  {'id': 'pb_earner_hoarding_info_balanced', 'kind': 'earner_hoarding', 'severity': 'info', 'strictness': 'balanced', 'title': 'Earner Hoarding (balanced)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 15},
  {'id': 'pb_earner_hoarding_info_strict', 'kind': 'earner_hoarding', 'severity': 'info', 'strictness': 'strict', 'title': 'Earner Hoarding (strict)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 15},
  {'id': 'pb_earner_hoarding_info_adaptive', 'kind': 'earner_hoarding', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Earner Hoarding (adaptive)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 15},
  {'id': 'pb_earner_hoarding_warning_low', 'kind': 'earner_hoarding', 'severity': 'warning', 'strictness': 'low', 'title': 'Earner Hoarding (low)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 30},
  {'id': 'pb_earner_hoarding_warning_balanced', 'kind': 'earner_hoarding', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Earner Hoarding (balanced)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 30},
  {'id': 'pb_earner_hoarding_warning_strict', 'kind': 'earner_hoarding', 'severity': 'warning', 'strictness': 'strict', 'title': 'Earner Hoarding (strict)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 30},
  {'id': 'pb_earner_hoarding_warning_adaptive', 'kind': 'earner_hoarding', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Earner Hoarding (adaptive)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 30},
  {'id': 'pb_earner_hoarding_error_low', 'kind': 'earner_hoarding', 'severity': 'error', 'strictness': 'low', 'title': 'Earner Hoarding (low)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 60},
  {'id': 'pb_earner_hoarding_error_balanced', 'kind': 'earner_hoarding', 'severity': 'error', 'strictness': 'balanced', 'title': 'Earner Hoarding (balanced)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 60},
  {'id': 'pb_earner_hoarding_error_strict', 'kind': 'earner_hoarding', 'severity': 'error', 'strictness': 'strict', 'title': 'Earner Hoarding (strict)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 60},
  {'id': 'pb_earner_hoarding_error_adaptive', 'kind': 'earner_hoarding', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Earner Hoarding (adaptive)', 'summary': 'Earner refuses support while team liquidity is critical.', 'steps': ['Identify actors involved in earner_hoarding.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 60},
  {'id': 'pb_treasury_request_storm_info_low', 'kind': 'treasury_request_storm', 'severity': 'info', 'strictness': 'low', 'title': 'Treasury Request Storm (low)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_treasury_request_storm_info_balanced', 'kind': 'treasury_request_storm', 'severity': 'info', 'strictness': 'balanced', 'title': 'Treasury Request Storm (balanced)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_treasury_request_storm_info_strict', 'kind': 'treasury_request_storm', 'severity': 'info', 'strictness': 'strict', 'title': 'Treasury Request Storm (strict)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_treasury_request_storm_info_adaptive', 'kind': 'treasury_request_storm', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Treasury Request Storm (adaptive)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 16},
  {'id': 'pb_treasury_request_storm_warning_low', 'kind': 'treasury_request_storm', 'severity': 'warning', 'strictness': 'low', 'title': 'Treasury Request Storm (low)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_treasury_request_storm_warning_balanced', 'kind': 'treasury_request_storm', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Treasury Request Storm (balanced)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_treasury_request_storm_warning_strict', 'kind': 'treasury_request_storm', 'severity': 'warning', 'strictness': 'strict', 'title': 'Treasury Request Storm (strict)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_treasury_request_storm_warning_adaptive', 'kind': 'treasury_request_storm', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Treasury Request Storm (adaptive)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 32},
  {'id': 'pb_treasury_request_storm_error_low', 'kind': 'treasury_request_storm', 'severity': 'error', 'strictness': 'low', 'title': 'Treasury Request Storm (low)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 64},
  {'id': 'pb_treasury_request_storm_error_balanced', 'kind': 'treasury_request_storm', 'severity': 'error', 'strictness': 'balanced', 'title': 'Treasury Request Storm (balanced)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 64},
  {'id': 'pb_treasury_request_storm_error_strict', 'kind': 'treasury_request_storm', 'severity': 'error', 'strictness': 'strict', 'title': 'Treasury Request Storm (strict)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 64},
  {'id': 'pb_treasury_request_storm_error_adaptive', 'kind': 'treasury_request_storm', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Treasury Request Storm (adaptive)', 'summary': 'Multiple simultaneous treasury withdrawal requests.', 'steps': ['Identify actors involved in treasury_request_storm.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 64},
  {'id': 'pb_directive_expiry_race_info_low', 'kind': 'directive_expiry_race', 'severity': 'info', 'strictness': 'low', 'title': 'Directive Expiry Race (low)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 17},
  {'id': 'pb_directive_expiry_race_info_balanced', 'kind': 'directive_expiry_race', 'severity': 'info', 'strictness': 'balanced', 'title': 'Directive Expiry Race (balanced)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 17},
  {'id': 'pb_directive_expiry_race_info_strict', 'kind': 'directive_expiry_race', 'severity': 'info', 'strictness': 'strict', 'title': 'Directive Expiry Race (strict)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 17},
  {'id': 'pb_directive_expiry_race_info_adaptive', 'kind': 'directive_expiry_race', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Directive Expiry Race (adaptive)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 17},
  {'id': 'pb_directive_expiry_race_warning_low', 'kind': 'directive_expiry_race', 'severity': 'warning', 'strictness': 'low', 'title': 'Directive Expiry Race (low)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 34},
  {'id': 'pb_directive_expiry_race_warning_balanced', 'kind': 'directive_expiry_race', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Directive Expiry Race (balanced)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 34},
  {'id': 'pb_directive_expiry_race_warning_strict', 'kind': 'directive_expiry_race', 'severity': 'warning', 'strictness': 'strict', 'title': 'Directive Expiry Race (strict)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 34},
  {'id': 'pb_directive_expiry_race_warning_adaptive', 'kind': 'directive_expiry_race', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Directive Expiry Race (adaptive)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 34},
  {'id': 'pb_directive_expiry_race_error_low', 'kind': 'directive_expiry_race', 'severity': 'error', 'strictness': 'low', 'title': 'Directive Expiry Race (low)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 68},
  {'id': 'pb_directive_expiry_race_error_balanced', 'kind': 'directive_expiry_race', 'severity': 'error', 'strictness': 'balanced', 'title': 'Directive Expiry Race (balanced)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 68},
  {'id': 'pb_directive_expiry_race_error_strict', 'kind': 'directive_expiry_race', 'severity': 'error', 'strictness': 'strict', 'title': 'Directive Expiry Race (strict)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 68},
  {'id': 'pb_directive_expiry_race_error_adaptive', 'kind': 'directive_expiry_race', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Directive Expiry Race (adaptive)', 'summary': 'Actors act on directives about to expire.', 'steps': ['Identify actors involved in directive_expiry_race.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 68},
  {'id': 'pb_parallel_plan_near_tie_info_low', 'kind': 'parallel_plan_near_tie', 'severity': 'info', 'strictness': 'low', 'title': 'Parallel Plan Near Tie (low)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_parallel_plan_near_tie_info_balanced', 'kind': 'parallel_plan_near_tie', 'severity': 'info', 'strictness': 'balanced', 'title': 'Parallel Plan Near Tie (balanced)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_parallel_plan_near_tie_info_strict', 'kind': 'parallel_plan_near_tie', 'severity': 'info', 'strictness': 'strict', 'title': 'Parallel Plan Near Tie (strict)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_parallel_plan_near_tie_info_adaptive', 'kind': 'parallel_plan_near_tie', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Parallel Plan Near Tie (adaptive)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 18},
  {'id': 'pb_parallel_plan_near_tie_warning_low', 'kind': 'parallel_plan_near_tie', 'severity': 'warning', 'strictness': 'low', 'title': 'Parallel Plan Near Tie (low)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_parallel_plan_near_tie_warning_balanced', 'kind': 'parallel_plan_near_tie', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Parallel Plan Near Tie (balanced)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_parallel_plan_near_tie_warning_strict', 'kind': 'parallel_plan_near_tie', 'severity': 'warning', 'strictness': 'strict', 'title': 'Parallel Plan Near Tie (strict)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_parallel_plan_near_tie_warning_adaptive', 'kind': 'parallel_plan_near_tie', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Parallel Plan Near Tie (adaptive)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 36},
  {'id': 'pb_parallel_plan_near_tie_error_low', 'kind': 'parallel_plan_near_tie', 'severity': 'error', 'strictness': 'low', 'title': 'Parallel Plan Near Tie (low)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 72},
  {'id': 'pb_parallel_plan_near_tie_error_balanced', 'kind': 'parallel_plan_near_tie', 'severity': 'error', 'strictness': 'balanced', 'title': 'Parallel Plan Near Tie (balanced)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 72},
  {'id': 'pb_parallel_plan_near_tie_error_strict', 'kind': 'parallel_plan_near_tie', 'severity': 'error', 'strictness': 'strict', 'title': 'Parallel Plan Near Tie (strict)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 72},
  {'id': 'pb_parallel_plan_near_tie_error_adaptive', 'kind': 'parallel_plan_near_tie', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Parallel Plan Near Tie (adaptive)', 'summary': 'Near-tie scores on identical targets in parallel planning.', 'steps': ['Identify actors involved in parallel_plan_near_tie.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 72},
  {'id': 'pb_team_brain_goal_drift_info_low', 'kind': 'team_brain_goal_drift', 'severity': 'info', 'strictness': 'low', 'title': 'Team Brain Goal Drift (low)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 19},
  {'id': 'pb_team_brain_goal_drift_info_balanced', 'kind': 'team_brain_goal_drift', 'severity': 'info', 'strictness': 'balanced', 'title': 'Team Brain Goal Drift (balanced)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 19},
  {'id': 'pb_team_brain_goal_drift_info_strict', 'kind': 'team_brain_goal_drift', 'severity': 'info', 'strictness': 'strict', 'title': 'Team Brain Goal Drift (strict)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 19},
  {'id': 'pb_team_brain_goal_drift_info_adaptive', 'kind': 'team_brain_goal_drift', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Team Brain Goal Drift (adaptive)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 19},
  {'id': 'pb_team_brain_goal_drift_warning_low', 'kind': 'team_brain_goal_drift', 'severity': 'warning', 'strictness': 'low', 'title': 'Team Brain Goal Drift (low)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 38},
  {'id': 'pb_team_brain_goal_drift_warning_balanced', 'kind': 'team_brain_goal_drift', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Team Brain Goal Drift (balanced)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 38},
  {'id': 'pb_team_brain_goal_drift_warning_strict', 'kind': 'team_brain_goal_drift', 'severity': 'warning', 'strictness': 'strict', 'title': 'Team Brain Goal Drift (strict)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 38},
  {'id': 'pb_team_brain_goal_drift_warning_adaptive', 'kind': 'team_brain_goal_drift', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Team Brain Goal Drift (adaptive)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 38},
  {'id': 'pb_team_brain_goal_drift_error_low', 'kind': 'team_brain_goal_drift', 'severity': 'error', 'strictness': 'low', 'title': 'Team Brain Goal Drift (low)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 76},
  {'id': 'pb_team_brain_goal_drift_error_balanced', 'kind': 'team_brain_goal_drift', 'severity': 'error', 'strictness': 'balanced', 'title': 'Team Brain Goal Drift (balanced)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 76},
  {'id': 'pb_team_brain_goal_drift_error_strict', 'kind': 'team_brain_goal_drift', 'severity': 'error', 'strictness': 'strict', 'title': 'Team Brain Goal Drift (strict)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 76},
  {'id': 'pb_team_brain_goal_drift_error_adaptive', 'kind': 'team_brain_goal_drift', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Team Brain Goal Drift (adaptive)', 'summary': 'Team Brain goal diverges from Team OS contract mission.', 'steps': ['Identify actors involved in team_brain_goal_drift.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 76},
  {'id': 'pb_governor_block_chain_info_low', 'kind': 'governor_block_chain', 'severity': 'info', 'strictness': 'low', 'title': 'Governor Block Chain (low)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_governor_block_chain_info_balanced', 'kind': 'governor_block_chain', 'severity': 'info', 'strictness': 'balanced', 'title': 'Governor Block Chain (balanced)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_governor_block_chain_info_strict', 'kind': 'governor_block_chain', 'severity': 'info', 'strictness': 'strict', 'title': 'Governor Block Chain (strict)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_governor_block_chain_info_adaptive', 'kind': 'governor_block_chain', 'severity': 'info', 'strictness': 'adaptive', 'title': 'Governor Block Chain (adaptive)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 20},
  {'id': 'pb_governor_block_chain_warning_low', 'kind': 'governor_block_chain', 'severity': 'warning', 'strictness': 'low', 'title': 'Governor Block Chain (low)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_governor_block_chain_warning_balanced', 'kind': 'governor_block_chain', 'severity': 'warning', 'strictness': 'balanced', 'title': 'Governor Block Chain (balanced)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_governor_block_chain_warning_strict', 'kind': 'governor_block_chain', 'severity': 'warning', 'strictness': 'strict', 'title': 'Governor Block Chain (strict)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_governor_block_chain_warning_adaptive', 'kind': 'governor_block_chain', 'severity': 'warning', 'strictness': 'adaptive', 'title': 'Governor Block Chain (adaptive)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 40},
  {'id': 'pb_governor_block_chain_error_low', 'kind': 'governor_block_chain', 'severity': 'error', 'strictness': 'low', 'title': 'Governor Block Chain (low)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply low coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 80},
  {'id': 'pb_governor_block_chain_error_balanced', 'kind': 'governor_block_chain', 'severity': 'error', 'strictness': 'balanced', 'title': 'Governor Block Chain (balanced)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply balanced coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 80},
  {'id': 'pb_governor_block_chain_error_strict', 'kind': 'governor_block_chain', 'severity': 'error', 'strictness': 'strict', 'title': 'Governor Block Chain (strict)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply strict coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 80},
  {'id': 'pb_governor_block_chain_error_adaptive', 'kind': 'governor_block_chain', 'severity': 'error', 'strictness': 'adaptive', 'title': 'Governor Block Chain (adaptive)', 'summary': 'Governor blocks cascade planned by multiple actors.', 'steps': ['Identify actors involved in governor_block_chain.', 'Apply adaptive coordination strictness thresholds.', 'Prefer higher-scoring actor unless role contract forbids.', 'Emit coordination note for transparency ledger.'], 'penaltyScore': 80}
];

export const TEAM_COORDINATION3_SCENARIO_FIXTURES: TeamCoordination3ScenarioFixture[] = [
  {'id': 'scenario_001', 'label': 'Synthetic coordination case 1', 'turn': 2, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_002', 'label': 'Synthetic coordination case 2', 'turn': 3, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_003', 'label': 'Synthetic coordination case 3', 'turn': 4, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_004', 'label': 'Synthetic coordination case 4', 'turn': 5, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_005', 'label': 'Synthetic coordination case 5', 'turn': 6, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_006', 'label': 'Synthetic coordination case 6', 'turn': 7, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_007', 'label': 'Synthetic coordination case 7', 'turn': 8, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': false},
  {'id': 'scenario_008', 'label': 'Synthetic coordination case 8', 'turn': 9, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_009', 'label': 'Synthetic coordination case 9', 'turn': 10, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_010', 'label': 'Synthetic coordination case 10', 'turn': 11, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_011', 'label': 'Synthetic coordination case 11', 'turn': 12, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_012', 'label': 'Synthetic coordination case 12', 'turn': 13, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_013', 'label': 'Synthetic coordination case 13', 'turn': 14, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_014', 'label': 'Synthetic coordination case 14', 'turn': 15, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': false},
  {'id': 'scenario_015', 'label': 'Synthetic coordination case 15', 'turn': 16, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_016', 'label': 'Synthetic coordination case 16', 'turn': 17, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_017', 'label': 'Synthetic coordination case 17', 'turn': 18, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_018', 'label': 'Synthetic coordination case 18', 'turn': 19, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_019', 'label': 'Synthetic coordination case 19', 'turn': 20, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_020', 'label': 'Synthetic coordination case 20', 'turn': 21, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_021', 'label': 'Synthetic coordination case 21', 'turn': 22, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': false},
  {'id': 'scenario_022', 'label': 'Synthetic coordination case 22', 'turn': 23, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_023', 'label': 'Synthetic coordination case 23', 'turn': 24, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_024', 'label': 'Synthetic coordination case 24', 'turn': 25, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_025', 'label': 'Synthetic coordination case 25', 'turn': 26, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_026', 'label': 'Synthetic coordination case 26', 'turn': 27, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_027', 'label': 'Synthetic coordination case 27', 'turn': 28, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_028', 'label': 'Synthetic coordination case 28', 'turn': 29, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': false},
  {'id': 'scenario_029', 'label': 'Synthetic coordination case 29', 'turn': 30, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_030', 'label': 'Synthetic coordination case 30', 'turn': 31, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_031', 'label': 'Synthetic coordination case 31', 'turn': 32, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_032', 'label': 'Synthetic coordination case 32', 'turn': 33, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_033', 'label': 'Synthetic coordination case 33', 'turn': 34, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_034', 'label': 'Synthetic coordination case 34', 'turn': 35, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_035', 'label': 'Synthetic coordination case 35', 'turn': 36, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': false},
  {'id': 'scenario_036', 'label': 'Synthetic coordination case 36', 'turn': 37, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_037', 'label': 'Synthetic coordination case 37', 'turn': 38, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_038', 'label': 'Synthetic coordination case 38', 'turn': 39, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_039', 'label': 'Synthetic coordination case 39', 'turn': 40, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_040', 'label': 'Synthetic coordination case 40', 'turn': 1, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_041', 'label': 'Synthetic coordination case 41', 'turn': 2, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_042', 'label': 'Synthetic coordination case 42', 'turn': 3, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': false},
  {'id': 'scenario_043', 'label': 'Synthetic coordination case 43', 'turn': 4, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_044', 'label': 'Synthetic coordination case 44', 'turn': 5, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_045', 'label': 'Synthetic coordination case 45', 'turn': 6, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_046', 'label': 'Synthetic coordination case 46', 'turn': 7, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_047', 'label': 'Synthetic coordination case 47', 'turn': 8, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_048', 'label': 'Synthetic coordination case 48', 'turn': 9, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_049', 'label': 'Synthetic coordination case 49', 'turn': 10, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': false},
  {'id': 'scenario_050', 'label': 'Synthetic coordination case 50', 'turn': 11, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_051', 'label': 'Synthetic coordination case 51', 'turn': 12, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_052', 'label': 'Synthetic coordination case 52', 'turn': 13, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_053', 'label': 'Synthetic coordination case 53', 'turn': 14, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_054', 'label': 'Synthetic coordination case 54', 'turn': 15, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_055', 'label': 'Synthetic coordination case 55', 'turn': 16, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_056', 'label': 'Synthetic coordination case 56', 'turn': 17, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': false},
  {'id': 'scenario_057', 'label': 'Synthetic coordination case 57', 'turn': 18, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_058', 'label': 'Synthetic coordination case 58', 'turn': 19, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_059', 'label': 'Synthetic coordination case 59', 'turn': 20, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_060', 'label': 'Synthetic coordination case 60', 'turn': 21, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_061', 'label': 'Synthetic coordination case 61', 'turn': 22, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_062', 'label': 'Synthetic coordination case 62', 'turn': 23, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_063', 'label': 'Synthetic coordination case 63', 'turn': 24, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': false},
  {'id': 'scenario_064', 'label': 'Synthetic coordination case 64', 'turn': 25, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_065', 'label': 'Synthetic coordination case 65', 'turn': 26, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_066', 'label': 'Synthetic coordination case 66', 'turn': 27, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_067', 'label': 'Synthetic coordination case 67', 'turn': 28, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_068', 'label': 'Synthetic coordination case 68', 'turn': 29, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_069', 'label': 'Synthetic coordination case 69', 'turn': 30, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_070', 'label': 'Synthetic coordination case 70', 'turn': 31, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': false},
  {'id': 'scenario_071', 'label': 'Synthetic coordination case 71', 'turn': 32, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_072', 'label': 'Synthetic coordination case 72', 'turn': 33, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_073', 'label': 'Synthetic coordination case 73', 'turn': 34, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_074', 'label': 'Synthetic coordination case 74', 'turn': 35, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_075', 'label': 'Synthetic coordination case 75', 'turn': 36, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_076', 'label': 'Synthetic coordination case 76', 'turn': 37, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_077', 'label': 'Synthetic coordination case 77', 'turn': 38, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': false},
  {'id': 'scenario_078', 'label': 'Synthetic coordination case 78', 'turn': 39, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_079', 'label': 'Synthetic coordination case 79', 'turn': 40, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_080', 'label': 'Synthetic coordination case 80', 'turn': 1, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_081', 'label': 'Synthetic coordination case 81', 'turn': 2, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_082', 'label': 'Synthetic coordination case 82', 'turn': 3, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_083', 'label': 'Synthetic coordination case 83', 'turn': 4, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_084', 'label': 'Synthetic coordination case 84', 'turn': 5, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': false},
  {'id': 'scenario_085', 'label': 'Synthetic coordination case 85', 'turn': 6, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_086', 'label': 'Synthetic coordination case 86', 'turn': 7, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_087', 'label': 'Synthetic coordination case 87', 'turn': 8, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_088', 'label': 'Synthetic coordination case 88', 'turn': 9, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_089', 'label': 'Synthetic coordination case 89', 'turn': 10, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_090', 'label': 'Synthetic coordination case 90', 'turn': 11, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_091', 'label': 'Synthetic coordination case 91', 'turn': 12, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': false},
  {'id': 'scenario_092', 'label': 'Synthetic coordination case 92', 'turn': 13, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_093', 'label': 'Synthetic coordination case 93', 'turn': 14, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_094', 'label': 'Synthetic coordination case 94', 'turn': 15, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_095', 'label': 'Synthetic coordination case 95', 'turn': 16, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_096', 'label': 'Synthetic coordination case 96', 'turn': 17, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_097', 'label': 'Synthetic coordination case 97', 'turn': 18, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_098', 'label': 'Synthetic coordination case 98', 'turn': 19, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': false},
  {'id': 'scenario_099', 'label': 'Synthetic coordination case 99', 'turn': 20, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_100', 'label': 'Synthetic coordination case 100', 'turn': 21, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_101', 'label': 'Synthetic coordination case 101', 'turn': 22, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'same_region_deposit', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_102', 'label': 'Synthetic coordination case 102', 'turn': 23, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'opposing_directives', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_103', 'label': 'Synthetic coordination case 103', 'turn': 24, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'role_objective_mismatch', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_104', 'label': 'Synthetic coordination case 104', 'turn': 25, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'duplicate_support_target', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_105', 'label': 'Synthetic coordination case 105', 'turn': 26, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'travel_race', 'strictness': 'balanced', 'expectedResolvable': false},
  {'id': 'scenario_106', 'label': 'Synthetic coordination case 106', 'turn': 27, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'envelope_over_allocation', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_107', 'label': 'Synthetic coordination case 107', 'turn': 28, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'sabotage_friendly_fire', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_108', 'label': 'Synthetic coordination case 108', 'turn': 29, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'sabotage_cross_team_collision', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_109', 'label': 'Synthetic coordination case 109', 'turn': 30, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'challenge_double_booking', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_110', 'label': 'Synthetic coordination case 110', 'turn': 31, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'craft_resource_contention', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_111', 'label': 'Synthetic coordination case 111', 'turn': 32, 'teamId': 'team_player', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'recovery_role_steal', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_112', 'label': 'Synthetic coordination case 112', 'turn': 33, 'teamId': 'team_ai', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'controller_abandon', 'strictness': 'low', 'expectedResolvable': false},
  {'id': 'scenario_113', 'label': 'Synthetic coordination case 113', 'turn': 34, 'teamId': 'team_player', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'explorer_cluster', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_114', 'label': 'Synthetic coordination case 114', 'turn': 35, 'teamId': 'team_ai', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'crafter', 'roleB': 'recovery', 'conflictKind': 'earner_hoarding', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_115', 'label': 'Synthetic coordination case 115', 'turn': 36, 'teamId': 'team_player', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'support', 'roleB': 'crafter', 'conflictKind': 'treasury_request_storm', 'strictness': 'adaptive', 'expectedResolvable': true},
  {'id': 'scenario_116', 'label': 'Synthetic coordination case 116', 'turn': 37, 'teamId': 'team_ai', 'actorA': 'actor_1', 'actorB': 'actor_3', 'roleA': 'controller', 'roleB': 'saboteur', 'conflictKind': 'directive_expiry_race', 'strictness': 'low', 'expectedResolvable': true},
  {'id': 'scenario_117', 'label': 'Synthetic coordination case 117', 'turn': 38, 'teamId': 'team_player', 'actorA': 'actor_2', 'actorB': 'actor_4', 'roleA': 'saboteur', 'roleB': 'explorer', 'conflictKind': 'parallel_plan_near_tie', 'strictness': 'balanced', 'expectedResolvable': true},
  {'id': 'scenario_118', 'label': 'Synthetic coordination case 118', 'turn': 39, 'teamId': 'team_ai', 'actorA': 'actor_3', 'actorB': 'actor_0', 'roleA': 'recovery', 'roleB': 'controller', 'conflictKind': 'team_brain_goal_drift', 'strictness': 'strict', 'expectedResolvable': true},
  {'id': 'scenario_119', 'label': 'Synthetic coordination case 119', 'turn': 40, 'teamId': 'team_player', 'actorA': 'actor_4', 'actorB': 'actor_1', 'roleA': 'earner', 'roleB': 'earner', 'conflictKind': 'governor_block_chain', 'strictness': 'adaptive', 'expectedResolvable': false},
  {'id': 'scenario_120', 'label': 'Synthetic coordination case 120', 'turn': 1, 'teamId': 'team_ai', 'actorA': 'actor_0', 'actorB': 'actor_2', 'roleA': 'explorer', 'roleB': 'support', 'conflictKind': 'same_target_reservation', 'strictness': 'low', 'expectedResolvable': true}
];

function tc3Hash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function inspectDepth(strictness: TeamCoordination3Strictness): number {
  if (strictness === 'strict' || strictness === 'adaptive') return 5;
  if (strictness === 'balanced') return 3;
  return 1;
}

function nearTieThreshold(strictness: TeamCoordination3Strictness): number {
  if (strictness === 'strict') return 0.12;
  if (strictness === 'adaptive') return 0.08;
  if (strictness === 'balanced') return 0.04;
  return 0;
}

export function findPlaybook(
  kind: TeamCoordination3ConflictKind,
  severity: TeamCoordination3Conflict['severity'],
  strictness: TeamCoordination3Strictness
): TeamCoordination3Playbook | null {
  return TEAM_COORDINATION3_PLAYBOOKS.find(p => p.kind === kind && p.severity === severity && p.strictness === strictness) || null;
}


// ---- Role assignment engine (complements assignTeamAiRole + Team OS responsibilities) ----

export interface TeamCoordination3RoleContext {
  winMetric: string;
  teamProfile: string;
  teammateWeakness: boolean;
  lowCash: boolean;
  inventoryCount: number;
  visitedRegionCount: number;
  activeDirectiveTypes: string[];
  osResponsibilityFocus: string | null;
  actorIndex: number;
  teamSize: number;
}

export interface TeamCoordination3RoleAssignment {
  role: TeamCoordination3Role;
  reason: string;
  confidence: number;
  alternatives: Array<{ role: TeamCoordination3Role; reason: string; confidence: number }>;
}

export const TEAM_COORDINATION3_ROLE_FIT_MATRIX: Array<{
  role: TeamCoordination3Role;
  focus: string;
  winMetric: string;
  fitScore: number;
  notes: string;
}> = [
  {'role': 'earner', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.1, 'notes': 'When win metric is money, earner aligned to economy focus.'},
  {'role': 'earner', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.69, 'notes': 'When win metric is regions, earner aligned to economy focus.'},
  {'role': 'earner', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.49, 'notes': 'When win metric is net_worth, earner aligned to economy focus.'},
  {'role': 'earner', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.95, 'notes': 'When win metric is challenges, earner aligned to economy focus.'},
  {'role': 'earner', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.44, 'notes': 'When win metric is money, earner aligned to expansion focus.'},
  {'role': 'earner', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.02, 'notes': 'When win metric is regions, earner aligned to expansion focus.'},
  {'role': 'earner', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.56, 'notes': 'When win metric is net_worth, earner aligned to expansion focus.'},
  {'role': 'earner', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.47, 'notes': 'When win metric is challenges, earner aligned to expansion focus.'},
  {'role': 'earner', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.14, 'notes': 'When win metric is money, earner aligned to defense focus.'},
  {'role': 'earner', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.24, 'notes': 'When win metric is regions, earner aligned to defense focus.'},
  {'role': 'earner', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.15, 'notes': 'When win metric is net_worth, earner aligned to defense focus.'},
  {'role': 'earner', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.62, 'notes': 'When win metric is challenges, earner aligned to defense focus.'},
  {'role': 'earner', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.8, 'notes': 'When win metric is money, earner aligned to support focus.'},
  {'role': 'earner', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.37, 'notes': 'When win metric is regions, earner aligned to support focus.'},
  {'role': 'earner', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.92, 'notes': 'When win metric is net_worth, earner aligned to support focus.'},
  {'role': 'earner', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.06, 'notes': 'When win metric is challenges, earner aligned to support focus.'},
  {'role': 'earner', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.04, 'notes': 'When win metric is money, earner aligned to sabotage focus.'},
  {'role': 'earner', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.25, 'notes': 'When win metric is regions, earner aligned to sabotage focus.'},
  {'role': 'earner', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.51, 'notes': 'When win metric is net_worth, earner aligned to sabotage focus.'},
  {'role': 'earner', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.55, 'notes': 'When win metric is challenges, earner aligned to sabotage focus.'},
  {'role': 'earner', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.94, 'notes': 'When win metric is money, earner aligned to recovery focus.'},
  {'role': 'earner', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.54, 'notes': 'When win metric is regions, earner aligned to recovery focus.'},
  {'role': 'earner', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.49, 'notes': 'When win metric is net_worth, earner aligned to recovery focus.'},
  {'role': 'earner', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.93, 'notes': 'When win metric is challenges, earner aligned to recovery focus.'},
  {'role': 'earner', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.26, 'notes': 'When win metric is money, earner aligned to flex focus.'},
  {'role': 'earner', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.19, 'notes': 'When win metric is regions, earner aligned to flex focus.'},
  {'role': 'earner', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.97, 'notes': 'When win metric is net_worth, earner aligned to flex focus.'},
  {'role': 'earner', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.23, 'notes': 'When win metric is challenges, earner aligned to flex focus.'},
  {'role': 'explorer', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.99, 'notes': 'When win metric is money, explorer aligned to economy focus.'},
  {'role': 'explorer', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.6, 'notes': 'When win metric is regions, explorer aligned to economy focus.'},
  {'role': 'explorer', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.71, 'notes': 'When win metric is net_worth, explorer aligned to economy focus.'},
  {'role': 'explorer', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.19, 'notes': 'When win metric is challenges, explorer aligned to economy focus.'},
  {'role': 'explorer', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.49, 'notes': 'When win metric is money, explorer aligned to expansion focus.'},
  {'role': 'explorer', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.0, 'notes': 'When win metric is regions, explorer aligned to expansion focus.'},
  {'role': 'explorer', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.45, 'notes': 'When win metric is net_worth, explorer aligned to expansion focus.'},
  {'role': 'explorer', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.96, 'notes': 'When win metric is challenges, explorer aligned to expansion focus.'},
  {'role': 'explorer', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.11, 'notes': 'When win metric is money, explorer aligned to defense focus.'},
  {'role': 'explorer', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.34, 'notes': 'When win metric is regions, explorer aligned to defense focus.'},
  {'role': 'explorer', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.08, 'notes': 'When win metric is net_worth, explorer aligned to defense focus.'},
  {'role': 'explorer', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.77, 'notes': 'When win metric is challenges, explorer aligned to defense focus.'},
  {'role': 'explorer', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.5, 'notes': 'When win metric is money, explorer aligned to support focus.'},
  {'role': 'explorer', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.44, 'notes': 'When win metric is regions, explorer aligned to support focus.'},
  {'role': 'explorer', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.72, 'notes': 'When win metric is net_worth, explorer aligned to support focus.'},
  {'role': 'explorer', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.01, 'notes': 'When win metric is challenges, explorer aligned to support focus.'},
  {'role': 'explorer', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.74, 'notes': 'When win metric is money, explorer aligned to sabotage focus.'},
  {'role': 'explorer', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.61, 'notes': 'When win metric is regions, explorer aligned to sabotage focus.'},
  {'role': 'explorer', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.08, 'notes': 'When win metric is net_worth, explorer aligned to sabotage focus.'},
  {'role': 'explorer', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.63, 'notes': 'When win metric is challenges, explorer aligned to sabotage focus.'},
  {'role': 'explorer', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.23, 'notes': 'When win metric is money, explorer aligned to recovery focus.'},
  {'role': 'explorer', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.37, 'notes': 'When win metric is regions, explorer aligned to recovery focus.'},
  {'role': 'explorer', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.71, 'notes': 'When win metric is net_worth, explorer aligned to recovery focus.'},
  {'role': 'explorer', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.75, 'notes': 'When win metric is challenges, explorer aligned to recovery focus.'},
  {'role': 'explorer', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.64, 'notes': 'When win metric is money, explorer aligned to flex focus.'},
  {'role': 'explorer', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.05, 'notes': 'When win metric is regions, explorer aligned to flex focus.'},
  {'role': 'explorer', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.03, 'notes': 'When win metric is net_worth, explorer aligned to flex focus.'},
  {'role': 'explorer', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.92, 'notes': 'When win metric is challenges, explorer aligned to flex focus.'},
  {'role': 'crafter', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.83, 'notes': 'When win metric is money, crafter aligned to economy focus.'},
  {'role': 'crafter', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.47, 'notes': 'When win metric is regions, crafter aligned to economy focus.'},
  {'role': 'crafter', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.0, 'notes': 'When win metric is net_worth, crafter aligned to economy focus.'},
  {'role': 'crafter', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.3, 'notes': 'When win metric is challenges, crafter aligned to economy focus.'},
  {'role': 'crafter', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.78, 'notes': 'When win metric is money, crafter aligned to expansion focus.'},
  {'role': 'crafter', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.05, 'notes': 'When win metric is regions, crafter aligned to expansion focus.'},
  {'role': 'crafter', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.51, 'notes': 'When win metric is net_worth, crafter aligned to expansion focus.'},
  {'role': 'crafter', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.43, 'notes': 'When win metric is challenges, crafter aligned to expansion focus.'},
  {'role': 'crafter', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.28, 'notes': 'When win metric is money, crafter aligned to defense focus.'},
  {'role': 'crafter', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.45, 'notes': 'When win metric is regions, crafter aligned to defense focus.'},
  {'role': 'crafter', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.97, 'notes': 'When win metric is net_worth, crafter aligned to defense focus.'},
  {'role': 'crafter', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.06, 'notes': 'When win metric is challenges, crafter aligned to defense focus.'},
  {'role': 'crafter', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.01, 'notes': 'When win metric is money, crafter aligned to support focus.'},
  {'role': 'crafter', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.41, 'notes': 'When win metric is regions, crafter aligned to support focus.'},
  {'role': 'crafter', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.35, 'notes': 'When win metric is net_worth, crafter aligned to support focus.'},
  {'role': 'crafter', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.64, 'notes': 'When win metric is challenges, crafter aligned to support focus.'},
  {'role': 'crafter', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.24, 'notes': 'When win metric is money, crafter aligned to sabotage focus.'},
  {'role': 'crafter', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.65, 'notes': 'When win metric is regions, crafter aligned to sabotage focus.'},
  {'role': 'crafter', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.2, 'notes': 'When win metric is net_worth, crafter aligned to sabotage focus.'},
  {'role': 'crafter', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.09, 'notes': 'When win metric is challenges, crafter aligned to sabotage focus.'},
  {'role': 'crafter', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.72, 'notes': 'When win metric is money, crafter aligned to recovery focus.'},
  {'role': 'crafter', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.58, 'notes': 'When win metric is regions, crafter aligned to recovery focus.'},
  {'role': 'crafter', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.82, 'notes': 'When win metric is net_worth, crafter aligned to recovery focus.'},
  {'role': 'crafter', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.77, 'notes': 'When win metric is challenges, crafter aligned to recovery focus.'},
  {'role': 'crafter', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.31, 'notes': 'When win metric is money, crafter aligned to flex focus.'},
  {'role': 'crafter', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.02, 'notes': 'When win metric is regions, crafter aligned to flex focus.'},
  {'role': 'crafter', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.01, 'notes': 'When win metric is net_worth, crafter aligned to flex focus.'},
  {'role': 'crafter', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.11, 'notes': 'When win metric is challenges, crafter aligned to flex focus.'},
  {'role': 'support', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.83, 'notes': 'When win metric is money, support aligned to economy focus.'},
  {'role': 'support', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.67, 'notes': 'When win metric is regions, support aligned to economy focus.'},
  {'role': 'support', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.72, 'notes': 'When win metric is net_worth, support aligned to economy focus.'},
  {'role': 'support', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.27, 'notes': 'When win metric is challenges, support aligned to economy focus.'},
  {'role': 'support', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.69, 'notes': 'When win metric is money, support aligned to expansion focus.'},
  {'role': 'support', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.69, 'notes': 'When win metric is regions, support aligned to expansion focus.'},
  {'role': 'support', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.51, 'notes': 'When win metric is net_worth, support aligned to expansion focus.'},
  {'role': 'support', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.83, 'notes': 'When win metric is challenges, support aligned to expansion focus.'},
  {'role': 'support', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.57, 'notes': 'When win metric is money, support aligned to defense focus.'},
  {'role': 'support', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.39, 'notes': 'When win metric is regions, support aligned to defense focus.'},
  {'role': 'support', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.19, 'notes': 'When win metric is net_worth, support aligned to defense focus.'},
  {'role': 'support', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.06, 'notes': 'When win metric is challenges, support aligned to defense focus.'},
  {'role': 'support', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.25, 'notes': 'When win metric is money, support aligned to support focus.'},
  {'role': 'support', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.29, 'notes': 'When win metric is regions, support aligned to support focus.'},
  {'role': 'support', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.6, 'notes': 'When win metric is net_worth, support aligned to support focus.'},
  {'role': 'support', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.76, 'notes': 'When win metric is challenges, support aligned to support focus.'},
  {'role': 'support', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.13, 'notes': 'When win metric is money, support aligned to sabotage focus.'},
  {'role': 'support', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.61, 'notes': 'When win metric is regions, support aligned to sabotage focus.'},
  {'role': 'support', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.85, 'notes': 'When win metric is net_worth, support aligned to sabotage focus.'},
  {'role': 'support', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.21, 'notes': 'When win metric is challenges, support aligned to sabotage focus.'},
  {'role': 'support', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.73, 'notes': 'When win metric is money, support aligned to recovery focus.'},
  {'role': 'support', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.34, 'notes': 'When win metric is regions, support aligned to recovery focus.'},
  {'role': 'support', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.32, 'notes': 'When win metric is net_worth, support aligned to recovery focus.'},
  {'role': 'support', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.93, 'notes': 'When win metric is challenges, support aligned to recovery focus.'},
  {'role': 'support', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.95, 'notes': 'When win metric is money, support aligned to flex focus.'},
  {'role': 'support', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.03, 'notes': 'When win metric is regions, support aligned to flex focus.'},
  {'role': 'support', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.17, 'notes': 'When win metric is net_worth, support aligned to flex focus.'},
  {'role': 'support', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.6, 'notes': 'When win metric is challenges, support aligned to flex focus.'},
  {'role': 'controller', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.7, 'notes': 'When win metric is money, controller aligned to economy focus.'},
  {'role': 'controller', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.18, 'notes': 'When win metric is regions, controller aligned to economy focus.'},
  {'role': 'controller', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.83, 'notes': 'When win metric is net_worth, controller aligned to economy focus.'},
  {'role': 'controller', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.54, 'notes': 'When win metric is challenges, controller aligned to economy focus.'},
  {'role': 'controller', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.11, 'notes': 'When win metric is money, controller aligned to expansion focus.'},
  {'role': 'controller', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.0, 'notes': 'When win metric is regions, controller aligned to expansion focus.'},
  {'role': 'controller', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.31, 'notes': 'When win metric is net_worth, controller aligned to expansion focus.'},
  {'role': 'controller', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.01, 'notes': 'When win metric is challenges, controller aligned to expansion focus.'},
  {'role': 'controller', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.74, 'notes': 'When win metric is money, controller aligned to defense focus.'},
  {'role': 'controller', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.8, 'notes': 'When win metric is regions, controller aligned to defense focus.'},
  {'role': 'controller', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.2, 'notes': 'When win metric is net_worth, controller aligned to defense focus.'},
  {'role': 'controller', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.89, 'notes': 'When win metric is challenges, controller aligned to defense focus.'},
  {'role': 'controller', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.54, 'notes': 'When win metric is money, controller aligned to support focus.'},
  {'role': 'controller', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.55, 'notes': 'When win metric is regions, controller aligned to support focus.'},
  {'role': 'controller', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.97, 'notes': 'When win metric is net_worth, controller aligned to support focus.'},
  {'role': 'controller', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.15, 'notes': 'When win metric is challenges, controller aligned to support focus.'},
  {'role': 'controller', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.11, 'notes': 'When win metric is money, controller aligned to sabotage focus.'},
  {'role': 'controller', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.36, 'notes': 'When win metric is regions, controller aligned to sabotage focus.'},
  {'role': 'controller', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.89, 'notes': 'When win metric is net_worth, controller aligned to sabotage focus.'},
  {'role': 'controller', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.94, 'notes': 'When win metric is challenges, controller aligned to sabotage focus.'},
  {'role': 'controller', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.6, 'notes': 'When win metric is money, controller aligned to recovery focus.'},
  {'role': 'controller', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.19, 'notes': 'When win metric is regions, controller aligned to recovery focus.'},
  {'role': 'controller', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.92, 'notes': 'When win metric is net_worth, controller aligned to recovery focus.'},
  {'role': 'controller', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.11, 'notes': 'When win metric is challenges, controller aligned to recovery focus.'},
  {'role': 'controller', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.24, 'notes': 'When win metric is money, controller aligned to flex focus.'},
  {'role': 'controller', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.14, 'notes': 'When win metric is regions, controller aligned to flex focus.'},
  {'role': 'controller', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.3, 'notes': 'When win metric is net_worth, controller aligned to flex focus.'},
  {'role': 'controller', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.72, 'notes': 'When win metric is challenges, controller aligned to flex focus.'},
  {'role': 'saboteur', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.02, 'notes': 'When win metric is money, saboteur aligned to economy focus.'},
  {'role': 'saboteur', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.43, 'notes': 'When win metric is regions, saboteur aligned to economy focus.'},
  {'role': 'saboteur', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.69, 'notes': 'When win metric is net_worth, saboteur aligned to economy focus.'},
  {'role': 'saboteur', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.9, 'notes': 'When win metric is challenges, saboteur aligned to economy focus.'},
  {'role': 'saboteur', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.76, 'notes': 'When win metric is money, saboteur aligned to expansion focus.'},
  {'role': 'saboteur', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.37, 'notes': 'When win metric is regions, saboteur aligned to expansion focus.'},
  {'role': 'saboteur', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.81, 'notes': 'When win metric is net_worth, saboteur aligned to expansion focus.'},
  {'role': 'saboteur', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.62, 'notes': 'When win metric is challenges, saboteur aligned to expansion focus.'},
  {'role': 'saboteur', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.84, 'notes': 'When win metric is money, saboteur aligned to defense focus.'},
  {'role': 'saboteur', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.33, 'notes': 'When win metric is regions, saboteur aligned to defense focus.'},
  {'role': 'saboteur', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.12, 'notes': 'When win metric is net_worth, saboteur aligned to defense focus.'},
  {'role': 'saboteur', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.85, 'notes': 'When win metric is challenges, saboteur aligned to defense focus.'},
  {'role': 'saboteur', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.63, 'notes': 'When win metric is money, saboteur aligned to support focus.'},
  {'role': 'saboteur', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.92, 'notes': 'When win metric is regions, saboteur aligned to support focus.'},
  {'role': 'saboteur', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.3, 'notes': 'When win metric is net_worth, saboteur aligned to support focus.'},
  {'role': 'saboteur', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.87, 'notes': 'When win metric is challenges, saboteur aligned to support focus.'},
  {'role': 'saboteur', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.17, 'notes': 'When win metric is money, saboteur aligned to sabotage focus.'},
  {'role': 'saboteur', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.06, 'notes': 'When win metric is regions, saboteur aligned to sabotage focus.'},
  {'role': 'saboteur', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.34, 'notes': 'When win metric is net_worth, saboteur aligned to sabotage focus.'},
  {'role': 'saboteur', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.57, 'notes': 'When win metric is challenges, saboteur aligned to sabotage focus.'},
  {'role': 'saboteur', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.93, 'notes': 'When win metric is money, saboteur aligned to recovery focus.'},
  {'role': 'saboteur', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.39, 'notes': 'When win metric is regions, saboteur aligned to recovery focus.'},
  {'role': 'saboteur', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.25, 'notes': 'When win metric is net_worth, saboteur aligned to recovery focus.'},
  {'role': 'saboteur', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.27, 'notes': 'When win metric is challenges, saboteur aligned to recovery focus.'},
  {'role': 'saboteur', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.93, 'notes': 'When win metric is money, saboteur aligned to flex focus.'},
  {'role': 'saboteur', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.58, 'notes': 'When win metric is regions, saboteur aligned to flex focus.'},
  {'role': 'saboteur', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.17, 'notes': 'When win metric is net_worth, saboteur aligned to flex focus.'},
  {'role': 'saboteur', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.27, 'notes': 'When win metric is challenges, saboteur aligned to flex focus.'},
  {'role': 'recovery', 'focus': 'economy', 'winMetric': 'money', 'fitScore': 0.78, 'notes': 'When win metric is money, recovery aligned to economy focus.'},
  {'role': 'recovery', 'focus': 'economy', 'winMetric': 'regions', 'fitScore': 0.11, 'notes': 'When win metric is regions, recovery aligned to economy focus.'},
  {'role': 'recovery', 'focus': 'economy', 'winMetric': 'net_worth', 'fitScore': 0.06, 'notes': 'When win metric is net_worth, recovery aligned to economy focus.'},
  {'role': 'recovery', 'focus': 'economy', 'winMetric': 'challenges', 'fitScore': 0.73, 'notes': 'When win metric is challenges, recovery aligned to economy focus.'},
  {'role': 'recovery', 'focus': 'expansion', 'winMetric': 'money', 'fitScore': 0.85, 'notes': 'When win metric is money, recovery aligned to expansion focus.'},
  {'role': 'recovery', 'focus': 'expansion', 'winMetric': 'regions', 'fitScore': 0.76, 'notes': 'When win metric is regions, recovery aligned to expansion focus.'},
  {'role': 'recovery', 'focus': 'expansion', 'winMetric': 'net_worth', 'fitScore': 0.71, 'notes': 'When win metric is net_worth, recovery aligned to expansion focus.'},
  {'role': 'recovery', 'focus': 'expansion', 'winMetric': 'challenges', 'fitScore': 0.44, 'notes': 'When win metric is challenges, recovery aligned to expansion focus.'},
  {'role': 'recovery', 'focus': 'defense', 'winMetric': 'money', 'fitScore': 0.79, 'notes': 'When win metric is money, recovery aligned to defense focus.'},
  {'role': 'recovery', 'focus': 'defense', 'winMetric': 'regions', 'fitScore': 0.61, 'notes': 'When win metric is regions, recovery aligned to defense focus.'},
  {'role': 'recovery', 'focus': 'defense', 'winMetric': 'net_worth', 'fitScore': 0.71, 'notes': 'When win metric is net_worth, recovery aligned to defense focus.'},
  {'role': 'recovery', 'focus': 'defense', 'winMetric': 'challenges', 'fitScore': 0.33, 'notes': 'When win metric is challenges, recovery aligned to defense focus.'},
  {'role': 'recovery', 'focus': 'support', 'winMetric': 'money', 'fitScore': 0.71, 'notes': 'When win metric is money, recovery aligned to support focus.'},
  {'role': 'recovery', 'focus': 'support', 'winMetric': 'regions', 'fitScore': 0.05, 'notes': 'When win metric is regions, recovery aligned to support focus.'},
  {'role': 'recovery', 'focus': 'support', 'winMetric': 'net_worth', 'fitScore': 0.23, 'notes': 'When win metric is net_worth, recovery aligned to support focus.'},
  {'role': 'recovery', 'focus': 'support', 'winMetric': 'challenges', 'fitScore': 0.75, 'notes': 'When win metric is challenges, recovery aligned to support focus.'},
  {'role': 'recovery', 'focus': 'sabotage', 'winMetric': 'money', 'fitScore': 0.45, 'notes': 'When win metric is money, recovery aligned to sabotage focus.'},
  {'role': 'recovery', 'focus': 'sabotage', 'winMetric': 'regions', 'fitScore': 0.45, 'notes': 'When win metric is regions, recovery aligned to sabotage focus.'},
  {'role': 'recovery', 'focus': 'sabotage', 'winMetric': 'net_worth', 'fitScore': 0.93, 'notes': 'When win metric is net_worth, recovery aligned to sabotage focus.'},
  {'role': 'recovery', 'focus': 'sabotage', 'winMetric': 'challenges', 'fitScore': 0.34, 'notes': 'When win metric is challenges, recovery aligned to sabotage focus.'},
  {'role': 'recovery', 'focus': 'recovery', 'winMetric': 'money', 'fitScore': 0.93, 'notes': 'When win metric is money, recovery aligned to recovery focus.'},
  {'role': 'recovery', 'focus': 'recovery', 'winMetric': 'regions', 'fitScore': 0.38, 'notes': 'When win metric is regions, recovery aligned to recovery focus.'},
  {'role': 'recovery', 'focus': 'recovery', 'winMetric': 'net_worth', 'fitScore': 0.75, 'notes': 'When win metric is net_worth, recovery aligned to recovery focus.'},
  {'role': 'recovery', 'focus': 'recovery', 'winMetric': 'challenges', 'fitScore': 0.61, 'notes': 'When win metric is challenges, recovery aligned to recovery focus.'},
  {'role': 'recovery', 'focus': 'flex', 'winMetric': 'money', 'fitScore': 0.75, 'notes': 'When win metric is money, recovery aligned to flex focus.'},
  {'role': 'recovery', 'focus': 'flex', 'winMetric': 'regions', 'fitScore': 0.81, 'notes': 'When win metric is regions, recovery aligned to flex focus.'},
  {'role': 'recovery', 'focus': 'flex', 'winMetric': 'net_worth', 'fitScore': 0.15, 'notes': 'When win metric is net_worth, recovery aligned to flex focus.'},
  {'role': 'recovery', 'focus': 'flex', 'winMetric': 'challenges', 'fitScore': 0.58, 'notes': 'When win metric is challenges, recovery aligned to flex focus.'}
];

export function scoreRoleFit(role: TeamCoordination3Role, focus: string, winMetric: string): number {
  const row = TEAM_COORDINATION3_ROLE_FIT_MATRIX.find(r => r.role === role && r.focus === focus && r.winMetric === winMetric);
  return row ? row.fitScore : 0.35;
}

export function assignTeamCoordination3Role(ctx: TeamCoordination3RoleContext): TeamCoordination3RoleAssignment {
  const directives = new Set(ctx.activeDirectiveTypes);
  const candidates: TeamCoordination3RoleAssignment[] = [];
  const push = (role: TeamCoordination3Role, reason: string, confidence: number) => {
    candidates.push({ role, reason, confidence, alternatives: [] });
  };
  if (ctx.lowCash) push('recovery', 'Liquidity floor triggered recovery assignment.', 0.92);
  if (ctx.teammateWeakness || directives.has('request_help') || directives.has('protect_me')) {
    push('support', 'Teammate weakness or help directive favors support.', 0.88);
  }
  if (directives.has('reserve_region') || directives.has('request_cover') || ctx.osResponsibilityFocus === 'defense') {
    push('controller', 'Region defense responsibility or cover directive.', 0.86);
  }
  if (ctx.teamProfile === 'chaos_team' || (ctx.teamProfile === 'competitive' && directives.has('combo_setup'))) {
    push('saboteur', 'Chaotic/competitive profile with combo setup.', 0.74);
  }
  if (ctx.inventoryCount >= 2 && (ctx.winMetric === 'net_worth' || ctx.osResponsibilityFocus === 'economy')) {
    push('crafter', 'Inventory depth supports crafting role.', 0.8);
  }
  if (ctx.visitedRegionCount < 4) push('explorer', 'Low regional coverage — explore.', 0.7);
  push('earner', 'Default earner fallback for team cash generation.', 0.55);
  candidates.sort((a, b) => b.confidence - a.confidence || a.role.localeCompare(b.role));
  const top = candidates[0];
  return {
    ...top,
    alternatives: candidates.slice(1, 4).map(c => ({ role: c.role, reason: c.reason, confidence: c.confidence })),
  };
}

export function detectSameTargetConflicts(actors: TeamCoordination3ActorSnapshot[], turn: number): TeamCoordination3Conflict[] {
  const out: TeamCoordination3Conflict[] = [];
  const byTeam: Record<string, TeamCoordination3ActorSnapshot[]> = {};
  actors.forEach(a => {
    byTeam[a.teamId] = byTeam[a.teamId] || [];
    byTeam[a.teamId].push(a);
  });
  Object.entries(byTeam).forEach(([teamId, list]) => {
    const targetMap: Record<string, TeamCoordination3ActorSnapshot[]> = {};
    list.forEach(a => {
      if (!a.topCandidateTargetKey) return;
      targetMap[a.topCandidateTargetKey] = targetMap[a.topCandidateTargetKey] || [];
      targetMap[a.topCandidateTargetKey].push(a);
    });
    Object.entries(targetMap).forEach(([targetKey, group]) => {
      if (group.length < 2) return;
      const sorted = [...group].sort((x, y) => (y.topCandidateScore - x.topCandidateScore) || x.id.localeCompare(y.id));
      const severity: TeamCoordination3Conflict['severity'] = sorted[0].topCandidateScore > 0 ? 'warning' : 'info';
      out.push({
        id: `conf_same_target_${teamId}_${targetKey}_${turn}`,
        kind: 'same_target_reservation',
        severity,
        actorIds: sorted.map(s => s.id),
        targetKey,
        message: `${sorted.length} teammates selected the same target ${targetKey}.`,
        detectedTurn: turn,
        playbookId: null,
      });
    });
  });
  return out;
}

export function detectDirectiveConflicts(actors: TeamCoordination3ActorSnapshot[], turn: number): TeamCoordination3Conflict[] {
  const conflicts: TeamCoordination3Conflict[] = [];
  const independent = actors.filter(a => a.directiveTypes.includes('play_independently'));
  const lead = actors.filter(a => a.directiveTypes.includes('follow_my_lead') || a.directiveTypes.includes('request_cover'));
  if (independent.length && lead.length) {
    conflicts.push({
      id: `conf_directive_${turn}_${independent[0].teamId}`,
      kind: 'opposing_directives',
      severity: 'error',
      actorIds: [...new Set([...independent, ...lead].map(a => a.id))],
      targetKey: null,
      message: 'Independent-play directives conflict with follow-lead / cover requests.',
      detectedTurn: turn,
      playbookId: null,
    });
  }
  return conflicts;
}

export function detectRoleObjectiveMismatches(actors: TeamCoordination3ActorSnapshot[], turn: number): TeamCoordination3Conflict[] {
  const out: TeamCoordination3Conflict[] = [];
  actors.forEach(a => {
    if (a.role === 'recovery' && a.responsibilityFocus === 'expansion') {
      out.push({
        id: `conf_role_mismatch_${a.id}_${turn}`,
        kind: 'role_objective_mismatch',
        severity: 'warning',
        actorIds: [a.id],
        targetKey: a.topCandidateTargetKey,
        message: `${a.name} is in recovery role but assigned expansion responsibility.`,
        detectedTurn: turn,
        playbookId: null,
      });
    }
    if (a.role === 'support' && a.topCandidateTargetKey?.startsWith('region:') && !a.directiveTypes.includes('request_help')) {
      out.push({
        id: `conf_support_region_${a.id}_${turn}`,
        kind: 'role_objective_mismatch',
        severity: 'info',
        actorIds: [a.id],
        targetKey: a.topCandidateTargetKey,
        message: `${a.name} support role is pursuing region control without a help directive.`,
        detectedTurn: turn,
        playbookId: null,
      });
    }
  });
  return out;
}

export function detectDuplicateSupportTargets(actors: TeamCoordination3ActorSnapshot[], turn: number): TeamCoordination3Conflict[] {
  const supportActors = actors.filter(a => a.role === 'support' || a.directiveTypes.includes('request_help'));
  const targetCounts: Record<string, string[]> = {};
  supportActors.forEach(a => {
    const key = a.responsibilityFocus || a.topCandidateTargetKey || 'unknown';
    targetCounts[key] = targetCounts[key] || [];
    targetCounts[key].push(a.id);
  });
  const out: TeamCoordination3Conflict[] = [];
  Object.entries(targetCounts).forEach(([key, ids]) => {
    if (ids.length < 2) return;
    out.push({
      id: `conf_dup_support_${turn}_${key}`,
      kind: 'duplicate_support_target',
      severity: 'warning',
      actorIds: ids,
      targetKey: key,
      message: 'Multiple support actors converge on the same weak target.',
      detectedTurn: turn,
      playbookId: null,
    });
  });
  return out;
}

export function detectTravelRaceConflicts(actors: TeamCoordination3ActorSnapshot[], turn: number): TeamCoordination3Conflict[] {
  const byRegion: Record<string, TeamCoordination3ActorSnapshot[]> = {};
  actors.forEach(a => {
    const dest = a.topCandidateTargetKey?.startsWith('region:') ? a.topCandidateTargetKey : null;
    if (!dest) return;
    byRegion[dest] = byRegion[dest] || [];
    byRegion[dest].push(a);
  });
  const out: TeamCoordination3Conflict[] = [];
  Object.entries(byRegion).forEach(([dest, list]) => {
    if (list.length < 2) return;
    const sameTeam = list.every(a => a.teamId === list[0].teamId);
    if (!sameTeam) return;
    out.push({
      id: `conf_travel_${turn}_${dest}`,
      kind: 'travel_race',
      severity: 'info',
      actorIds: list.map(l => l.id),
      targetKey: dest,
      message: 'Travel race: multiple teammates heading to the same region.',
      detectedTurn: turn,
      playbookId: null,
    });
  });
  return out;
}

export function detectTeamCoordinationConflicts(
  actors: TeamCoordination3ActorSnapshot[],
  turn: number,
  strictness: TeamCoordination3Strictness
): TeamCoordination3Conflict[] {
  const merged = [
    ...detectSameTargetConflicts(actors, turn),
    ...detectDirectiveConflicts(actors, turn),
    ...detectRoleObjectiveMismatches(actors, turn),
    ...detectDuplicateSupportTargets(actors, turn),
    ...detectTravelRaceConflicts(actors, turn),
  ];
  return merged.map(c => {
    const pb = findPlaybook(c.kind, c.severity, strictness);
    return pb ? { ...c, playbookId: pb.id } : c;
  }).sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
}

/** Bridge for parallel round planning: apply resolutions as candidate index overrides. */
export function applyCoordination3ToCandidateIndices(
  resolutions: TeamCoordination3Resolution[],
  chosenIndexByActor: Record<string, number>,
  candidateCounts: Record<string, number>
): Record<string, number> {
  const next = { ...chosenIndexByActor };
  resolutions.forEach(r => {
    if (r.action !== 'reassign_candidate') return;
    const count = candidateCounts[r.actorId] || 0;
    const idx = Math.min(Math.max(0, r.candidateIndex ?? 1), Math.max(0, count - 1));
    next[r.actorId] = idx;
  });
  return next;
}

export function explainCoordination3Plan(plan: TeamCoordination3Plan): string[] {
  const lines: string[] = [];
  lines.push(`Team ${plan.teamId} turn ${plan.turn} strictness=${plan.strictness}`);
  plan.conflicts.forEach(c => lines.push(`Conflict ${c.kind}: ${c.message}`));
  plan.resolutions.forEach(r => lines.push(`${r.actorId} → ${r.action}: ${r.coordinationNote}`));
  return lines;
}

export function resolveTeamCoordinationConflicts(
  conflicts: TeamCoordination3Conflict[],
  actors: TeamCoordination3ActorSnapshot[],
  strictness: TeamCoordination3Strictness
): TeamCoordination3Resolution[] {
  const actorById = Object.fromEntries(actors.map(a => [a.id, a]));
  const resolutions: TeamCoordination3Resolution[] = [];
  conflicts.forEach(conflict => {
    if (conflict.kind === 'same_target_reservation' && conflict.actorIds.length >= 2) {
      const involved = conflict.actorIds.map(id => actorById[id]).filter(Boolean);
      const sorted = [...involved].sort((a, b) => (b.topCandidateScore - a.topCandidateScore) || TEAM_COORDINATION3_ROLE_PRIORITY[a.role] - TEAM_COORDINATION3_ROLE_PRIORITY[b.role] || a.id.localeCompare(b.id));
      const [keeper, ...others] = sorted;
      others.forEach(other => {
        const threshold = nearTieThreshold(strictness);
        const nearTie = Math.abs((keeper.topCandidateScore || 0) - (other.topCandidateScore || 0)) <= threshold * Math.max(1, keeper.topCandidateScore || 1);
        resolutions.push({
          conflictId: conflict.id,
          actorId: other.id,
          action: nearTie && strictness === 'strict' ? 'escalate_to_player' : 'reassign_candidate',
          candidateIndex: inspectDepth(strictness),
          coordinationNote: nearTie ? 'Near-tie same-target collision; inspect alternate candidates.' : 'Lower-priority teammate reassigned off shared target.',
          scoreDelta: -Math.min(40, (other.topCandidateScore || 0) * 0.05),
        });
      });
      resolutions.push({
        conflictId: conflict.id,
        actorId: keeper.id,
        action: 'keep',
        candidateIndex: 0,
        coordinationNote: 'Retained top candidate after same-team coordination pass.',
        scoreDelta: 0,
      });
    } else if (conflict.kind === 'opposing_directives') {
      const human = conflict.actorIds.map(id => actorById[id]).find(a => a?.isHuman);
      resolutions.push({
        conflictId: conflict.id,
        actorId: human?.id || conflict.actorIds[0],
        action: 'escalate_to_player',
        candidateIndex: null,
        coordinationNote: 'Directive conflict requires human clarification — AI will not pick a side.',
        scoreDelta: 0,
      });
    } else if (conflict.kind === 'role_objective_mismatch') {
      conflict.actorIds.forEach(actorId => {
        const actor = actorById[actorId];
        if (!actor) return;
        const swap: TeamCoordination3Role = actor.role === 'recovery' ? 'support' : actor.role === 'support' ? 'recovery' : 'earner';
        resolutions.push({
          conflictId: conflict.id,
          actorId,
          action: strictness === 'low' ? 'defer' : 'swap_role',
          candidateIndex: null,
          coordinationNote: `Suggested role adjustment toward ${TEAM_COORDINATION3_ROLE_LABELS[swap]}.`,
          scoreDelta: -5,
        });
      });
    }
  });
  return resolutions;
}

export function buildTeamCoordination3Plan(
  teamId: string,
  actors: TeamCoordination3ActorSnapshot[],
  turn: number,
  strictness: TeamCoordination3Strictness
): TeamCoordination3Plan {
  const teamActors = actors.filter(a => a.teamId === teamId);
  const conflicts = detectTeamCoordinationConflicts(teamActors, turn, strictness);
  const resolutions = resolveTeamCoordinationConflicts(conflicts, teamActors, strictness);
  const roleAssignments: Record<string, TeamCoordination3Role> = {};
  teamActors.forEach(a => { roleAssignments[a.id] = a.role; });
  resolutions.filter(r => r.action === 'swap_role').forEach(r => {
    const actor = teamActors.find(a => a.id === r.actorId);
    if (!actor) return;
    roleAssignments[r.actorId] = actor.role === 'recovery' ? 'support' : actor.role === 'support' ? 'recovery' : 'earner';
  });
  const ledgerEntries = resolutions.map(r => `[turn ${turn}] ${r.actorId}: ${r.coordinationNote}`);
  const hash = tc3Hash(JSON.stringify({ teamId, turn, strictness, conflicts, resolutions, roleAssignments }));
  return { teamId, turn, strictness, conflicts, resolutions, roleAssignments, ledgerEntries, hash };
}

export function simulateTeamCoordination3Fixture(fixture: TeamCoordination3ScenarioFixture): { ok: boolean; detail: string } {
  const actors: TeamCoordination3ActorSnapshot[] = [
    {
      id: fixture.actorA,
      name: fixture.actorA,
      teamId: fixture.teamId,
      role: fixture.roleA,
      isHuman: false,
      money: 1200,
      protectedCash: 200,
      regionId: 'NSW',
      topCandidateTargetKey: `region:REG_${fixture.turn % 9}`,
      topCandidateScore: 800 - (fixture.turn % 50),
      directiveTypes: fixture.conflictKind === 'opposing_directives' ? ['play_independently'] : [],
      responsibilityFocus: fixture.roleA === 'recovery' ? 'expansion' : null,
    },
    {
      id: fixture.actorB,
      name: fixture.actorB,
      teamId: fixture.teamId,
      role: fixture.roleB,
      isHuman: false,
      money: 900,
      protectedCash: 150,
      regionId: 'VIC',
      topCandidateTargetKey: `region:REG_${fixture.turn % 9}`,
      topCandidateScore: 790 - (fixture.turn % 50),
      directiveTypes: fixture.conflictKind === 'opposing_directives' ? ['follow_my_lead'] : [],
      responsibilityFocus: null,
    },
  ];
  const plan = buildTeamCoordination3Plan(fixture.teamId, actors, fixture.turn, fixture.strictness);
  const hasConflict = plan.conflicts.some(c => c.kind === fixture.conflictKind);
  const resolved = plan.resolutions.length > 0;
  const ok = !fixture.expectedResolvable || !hasConflict || resolved;
  return { ok, detail: `${fixture.id} conflicts=${plan.conflicts.length} resolutions=${plan.resolutions.length}` };
}

export function runTeamCoordination3SelfTests(): string[] {
  const failures: string[] = [];
  if (TEAM_COORDINATION3_PLAYBOOKS.length < 200) failures.push('playbook catalog too small');
  if (TEAM_COORDINATION3_SCENARIO_FIXTURES.length < 100) failures.push('scenario fixtures too small');
  TEAM_COORDINATION3_SCENARIO_FIXTURES.forEach(fixture => {
    const result = simulateTeamCoordination3Fixture(fixture);
    if (!result.ok) failures.push(`${fixture.id}: ${result.detail}`);
  });
  const samplePlan = buildTeamCoordination3Plan('team_player', [
    { id: 'a1', name: 'A1', teamId: 'team_player', role: 'earner', isHuman: false, money: 1000, protectedCash: 0, regionId: 'NSW', topCandidateTargetKey: 'region:X', topCandidateScore: 500, directiveTypes: [], responsibilityFocus: null },
    { id: 'a2', name: 'A2', teamId: 'team_player', role: 'explorer', isHuman: false, money: 900, protectedCash: 0, regionId: 'VIC', topCandidateTargetKey: 'region:X', topCandidateScore: 400, directiveTypes: [], responsibilityFocus: null },
  ], 3, 'balanced');
  if (samplePlan.resolutions.length < 2) failures.push('sample same-target plan did not produce resolutions');
  if (!samplePlan.hash) failures.push('sample plan missing hash');
  return failures;
}

export interface TeamCoordination3DashboardProps {
  plan: TeamCoordination3Plan | null;
  theme?: { panel?: string; heading?: string; muted?: string; badge?: string };
}

export function TeamCoordination3Dashboard({ plan, theme }: TeamCoordination3DashboardProps): JSX.Element {
  const [filter, setFilter] = useState<'all' | 'warning' | 'error'>('all');
  const conflicts = useMemo(() => {
    if (!plan) return [] as TeamCoordination3Conflict[];
    if (filter === 'all') return plan.conflicts;
    return plan.conflicts.filter(c => c.severity === filter);
  }, [plan, filter]);
  const panel = theme?.panel || 'rounded-xl border border-white/10 bg-black/20 p-3';
  const heading = theme?.heading || 'font-semibold text-sm';
  const muted = theme?.muted || 'text-xs opacity-70';
  if (!plan) {
    return <div className={panel}><div className={heading}>Team Coordination 3.0</div><div className={muted}>No coordination plan for this turn.</div></div>;
  }
  return (
    <div className={panel} data-testid="team-coordination-3-dashboard">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={heading}>Team Coordination 3.0</div>
        <div className={muted}>Turn {plan.turn} · {plan.strictness} · {plan.conflicts.length} conflicts</div>
      </div>
      <div className="flex gap-2 mb-2 text-xs">
        {(['all','warning','error'] as const).map(key => (
          <button key={key} type="button" className={theme?.badge || 'px-2 py-0.5 rounded bg-white/10'} onClick={() => setFilter(key)}>{key}</button>
        ))}
      </div>
      <ul className="text-xs space-y-1 max-h-40 overflow-auto">
        {conflicts.map(c => (
          <li key={c.id}><span className="opacity-60">{c.severity}</span> · {c.message}</li>
        ))}
      </ul>
      {plan.ledgerEntries.length > 0 && (
        <div className={`${muted} mt-2`}>Ledger: {plan.ledgerEntries.slice(0, 3).join(' · ')}</div>
      )}
    </div>
  );
}

/** Integration hook: map parallel-planning strictness to Coordination 3.0 strictness. */
export function mapParallelStrictnessToCoordination3(value: string | null | undefined): TeamCoordination3Strictness {
  if (value === 'high' || value === 'strict') return 'strict';
  if (value === 'low') return 'low';
  if (value === 'adaptive') return 'adaptive';
  return 'balanced';
}

export const TEAM_COORDINATION3_INTEGRATION = {
  version: 1,
  mergeAnchor: 'coordinateRoundPlannedDecisions',
  settingsKeys: [
    'teamCoordination3Enabled',
    'teamCoordination3Strictness',
    'teamCoordination3TransparencyEnabled',
  ],
  exports: [
    'buildTeamCoordination3Plan',
    'detectTeamCoordinationConflicts',
    'resolveTeamCoordinationConflicts',
    'TeamCoordination3Dashboard',
    'runTeamCoordination3SelfTests',
  ],
} as const;
