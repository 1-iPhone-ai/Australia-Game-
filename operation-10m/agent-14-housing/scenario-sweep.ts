import { AGENT14_HOUSING_PROGRAM_STUBS, AGENT14_LIMITS } from './constants.ts';
import { commitmentFromProgramStub } from './program-stub-commitments.ts';
import { advancePublicServicesTurn } from './turn-advance.ts';
import type {
  CapacityAndSpendingInputs,
  DelayedSpendingPersisted,
  EnrichedPublicServiceTurnInputs,
  SpendingCommitment,
} from './types.ts';

export type Agent14HousingScenarioId =
  | 'baseline_steady'
  | 'fiscal_austerity'
  | 'remote_equity_stress'
  | 'housing_acceleration'
  | 'workforce_blocking'
  | 'crisis_recovery'
  | 'mixed_pillar_push'
  | 'capacity_saturated'
  | 'health_education_surge'
  | 'persisted_recovery_arc'
  | 'coupling_stress_escalation'
  | 'equity_rebalance_push'
  | 'accountability_slip_arc'
  | 'intervention_priority_stress'
  | 'resilience_recovery_arc'
  | 'capacity_relief_governance_stress'
  | 'governance_trajectory_arc'
  | 'relief_dispatch_coordination_stress'
  | 'coordination_trajectory_arc'
  | 'relief_execution_stress'
  | 'stabilization_recovery_arc'
  | 'relief_fulfillment_backlog_stress'
  | 'readiness_trajectory_arc'
  | 'fulfillment_aging_stress'
  | 'resumption_trajectory_arc'
  | 'commit_gating_stress'
  | 'handoff_trajectory_arc'
  | 'gated_commit_scheduler_stress'
  | 'integration_trajectory_arc'
  | 'schedule_readiness_stress'
  | 'wire_in_trajectory_arc'
  | 'turn_boundary_activation_stress'
  | 'assembly_merge_trajectory_arc'
  | 'chunk_anchor_alignment_stress'
  | 'inline_merge_trajectory_arc'
  | 'inline_activation_stress'
  | 'projection_gate_trajectory_arc'
  | 'wave18_projection_stress'
  | 'wave19_gate_trajectory_arc'
  | 'wave19_integration_stress'
  | 'wave20_gate_trajectory_arc'
  | 'wave20_integration_stress'
  | 'wave21_gate_trajectory_arc'
  | 'wave21_integration_stress'
  | 'wave22_gate_trajectory_arc'
  | 'wave22_integration_stress'
  | 'wave23_gate_trajectory_arc'
  | 'wave23_integration_stress'
  | 'wave24_gate_trajectory_arc'
  | 'wave24_integration_stress'
  | 'wave25_gate_trajectory_arc'
  | 'wave25_integration_stress'
  | 'wave26_gate_trajectory_arc'
  | 'wave26_integration_stress'
  | 'wave27_gate_trajectory_arc'
  | 'wave27_integration_stress'
  | 'wave28_gate_trajectory_arc'
  | 'wave28_integration_stress'
  | 'wave29_gate_trajectory_arc'
  | 'wave29_integration_stress'
  | 'wave30_gate_trajectory_arc'
  | 'wave30_integration_stress'
  | 'wave31_gate_trajectory_arc'
  | 'wave31_integration_stress'
  | 'wave32_gate_trajectory_arc'
  | 'wave32_integration_stress'
  | 'wave33_gate_trajectory_arc'
  | 'wave33_integration_stress'
  | 'wave34_gate_trajectory_arc'
  | 'wave34_integration_stress'
  | 'wave35_gate_trajectory_arc'
  | 'wave35_integration_stress'
  | 'wave36_gate_trajectory_arc'
  | 'wave36_integration_stress'
  | 'wave37_gate_trajectory_arc'
  | 'wave37_integration_stress'
  | 'wave38_gate_trajectory_arc'
  | 'wave38_integration_stress'
  | 'wave39_gate_trajectory_arc'
  | 'wave39_integration_stress'
  | 'wave40_gate_trajectory_arc'
  | 'wave40_integration_stress'
  | 'wave41_gate_trajectory_arc'
  | 'wave41_integration_stress'
  | 'wave42_gate_trajectory_arc'
  | 'wave42_integration_stress'
  | 'wave43_gate_trajectory_arc'
  | 'wave43_integration_stress'
  | 'wave44_gate_trajectory_arc'
  | 'wave44_integration_stress'
  | 'wave45_gate_trajectory_arc'
  | 'wave45_integration_stress'
  | 'wave46_gate_trajectory_arc'
  | 'wave46_integration_stress'
  | 'wave47_gate_trajectory_arc'
  | 'wave47_integration_stress'
  | 'wave48_gate_trajectory_arc'
  | 'wave48_integration_stress'
  | 'wave49_gate_trajectory_arc'
  | 'wave49_integration_stress'
  | 'wave50_gate_trajectory_arc'
  | 'wave50_integration_stress';

export interface Agent14HousingScenarioDefinition {
  id: Agent14HousingScenarioId;
  label: string;
  baseInputs: Partial<CapacityAndSpendingInputs>;
  /** Program stub ids committed on turn 1 (from AGENT14_HOUSING_PROGRAM_STUBS). */
  launchProgramIds: string[];
}

export const AGENT14_HOUSING_SCENARIOS: readonly Agent14HousingScenarioDefinition[] = [
  {
    id: 'baseline_steady',
    label: 'Steady baseline',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_VIC_planning_reform'],
  },
  {
    id: 'fiscal_austerity',
    label: 'Fiscal austerity',
    baseInputs: { fiscalHeadroom: 28, stateCapacityLoad: 62, workforceReadiness: 'strained' },
    launchProgramIds: ['ps_h_SA_modular'],
  },
  {
    id: 'remote_equity_stress',
    label: 'Remote equity stress',
    baseInputs: { fiscalHeadroom: 45, stateCapacityLoad: 55, workforceSpecialistGap: 48 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_h_WA_remote_housing'],
  },
  {
    id: 'housing_acceleration',
    label: 'Housing acceleration',
    baseInputs: { fiscalHeadroom: 78, stateCapacityLoad: 30, workforceReadiness: 'strong' },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_ACT_density', 'ps_h_NSW_social_accel'],
  },
  {
    id: 'workforce_blocking',
    label: 'Workforce blocking',
    baseInputs: { fiscalHeadroom: 52, stateCapacityLoad: 50, workforceReadiness: 'blocking', workforceSpecialistGap: 72 },
    launchProgramIds: ['ps_h_TAS_affordable'],
  },
  {
    id: 'crisis_recovery',
    label: 'Crisis recovery',
    baseInputs: { fiscalHeadroom: 32, stateCapacityLoad: 78, workforceReadiness: 'weak', workforceSpecialistGap: 55 },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_SA_modular'],
  },
  {
    id: 'mixed_pillar_push',
    label: 'Mixed pillar push',
    baseInputs: { fiscalHeadroom: 62, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_WA_remote_housing', 'ps_h_ACT_density'],
  },
  {
    id: 'capacity_saturated',
    label: 'Capacity saturated',
    baseInputs: { fiscalHeadroom: 35, stateCapacityLoad: 80, workforceReadiness: 'strained', workforceSpecialistGap: 60 },
    launchProgramIds: [
      'ps_h_NSW_social_accel',
      'ps_h_VIC_planning_reform',
      'ps_h_QLD_regional_release',
      'ps_h_WA_remote_housing',
      'ps_h_NT_remote_housing',
      'ps_h_TAS_affordable',
      'ps_h_SA_modular',
      'ps_h_ACT_density',
    ],
  },
  {
    id: 'health_education_surge',
    label: 'Health and education surge',
    baseInputs: { fiscalHeadroom: 68, stateCapacityLoad: 35, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_he_NSW_primary_care',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_ed_WA_regional_schools',
    ],
  },
  {
    id: 'persisted_recovery_arc',
    label: 'Persisted recovery arc',
    baseInputs: { fiscalHeadroom: 38, stateCapacityLoad: 65, workforceReadiness: 'weak' },
    launchProgramIds: ['ps_h_SA_modular', 'ps_he_QLD_remote_clinic', 'ps_ed_TAS_rural_connect'],
  },
  {
    id: 'coupling_stress_escalation',
    label: 'Coupling stress escalation',
    baseInputs: { fiscalHeadroom: 18, stateCapacityLoad: 88, workforceReadiness: 'blocking', workforceSpecialistGap: 75 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_h_TAS_affordable', 'ps_he_NT_remote_clinic'],
  },
  {
    id: 'equity_rebalance_push',
    label: 'Equity rebalance push',
    baseInputs: { fiscalHeadroom: 55, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_QLD_wellness_hub',
      'ps_xp_NT_integrated_services',
      'ps_h_WA_remote_housing',
      'ps_ed_WA_regional_schools',
    ],
  },
  {
    id: 'accountability_slip_arc',
    label: 'Accountability slip arc',
    baseInputs: { fiscalHeadroom: 22, stateCapacityLoad: 82, workforceReadiness: 'blocking', workforceSpecialistGap: 68 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_he_VIC_hospital_backlog', 'ps_ed_NSW_skills'],
  },
  {
    id: 'intervention_priority_stress',
    label: 'Intervention priority stress',
    baseInputs: { fiscalHeadroom: 42, stateCapacityLoad: 72, workforceReadiness: 'strained', workforceSpecialistGap: 58 },
    launchProgramIds: [
      'ps_xp_TAS_community_wellbeing',
      'ps_xp_WA_remote_lifecycle',
      'ps_h_WA_remote_housing',
      'ps_he_QLD_remote_clinic',
    ],
  },
  {
    id: 'resilience_recovery_arc',
    label: 'Resilience recovery arc',
    baseInputs: { fiscalHeadroom: 48, stateCapacityLoad: 52, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_SA_integrated_housing_health',
      'ps_h_SA_modular',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'capacity_relief_governance_stress',
    label: 'Capacity relief governance stress',
    baseInputs: { fiscalHeadroom: 26, stateCapacityLoad: 86, workforceReadiness: 'blocking', workforceSpecialistGap: 70 },
    launchProgramIds: [
      'ps_xp_ACT_wellbeing_coordination',
      'ps_h_ACT_density',
      'ps_ed_NSW_skills',
      'ps_he_VIC_hospital_backlog',
    ],
  },
  {
    id: 'governance_trajectory_arc',
    label: 'Governance trajectory arc',
    baseInputs: { fiscalHeadroom: 34, stateCapacityLoad: 68, workforceReadiness: 'strained' },
    launchProgramIds: [
      'ps_xp_NSW_governance_reform',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'relief_dispatch_coordination_stress',
    label: 'Relief dispatch coordination stress',
    baseInputs: { fiscalHeadroom: 20, stateCapacityLoad: 92, workforceReadiness: 'blocking', workforceSpecialistGap: 74 },
    launchProgramIds: [
      'ps_xp_VIC_relief_coordination',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_VIC_tafe',
    ],
  },
  {
    id: 'coordination_trajectory_arc',
    label: 'Coordination trajectory arc',
    baseInputs: { fiscalHeadroom: 32, stateCapacityLoad: 74, workforceReadiness: 'strained', workforceSpecialistGap: 62 },
    launchProgramIds: [
      'ps_xp_QLD_stakeholder_alignment',
      'ps_h_QLD_regional_release',
      'ps_he_QLD_remote_clinic',
    ],
  },
  {
    id: 'relief_execution_stress',
    label: 'Relief execution stress',
    baseInputs: { fiscalHeadroom: 19, stateCapacityLoad: 90, workforceReadiness: 'blocking', workforceSpecialistGap: 76 },
    launchProgramIds: [
      'ps_xp_SA_portfolio_stabilization',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
    ],
  },
  {
    id: 'stabilization_recovery_arc',
    label: 'Stabilization recovery arc',
    baseInputs: { fiscalHeadroom: 44, stateCapacityLoad: 55, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NT_recovery_readiness',
      'ps_h_NT_remote_housing',
      'ps_he_NT_remote_clinic',
    ],
  },
  {
    id: 'relief_fulfillment_backlog_stress',
    label: 'Relief fulfillment backlog stress',
    baseInputs: { fiscalHeadroom: 17, stateCapacityLoad: 93, workforceReadiness: 'blocking', workforceSpecialistGap: 78 },
    launchProgramIds: [
      'ps_xp_VIC_fulfillment_coordination',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_VIC_tafe',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'readiness_trajectory_arc',
    label: 'Readiness trajectory arc',
    baseInputs: { fiscalHeadroom: 50, stateCapacityLoad: 50, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_ACT_readiness_cohesion',
      'ps_h_ACT_density',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'fulfillment_aging_stress',
    label: 'Fulfillment aging stress',
    baseInputs: { fiscalHeadroom: 16, stateCapacityLoad: 94, workforceReadiness: 'blocking', workforceSpecialistGap: 80 },
    launchProgramIds: [
      'ps_xp_WA_resumption_planning',
      'ps_h_WA_remote_housing',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_WA_regional_schools',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'resumption_trajectory_arc',
    label: 'Resumption trajectory arc',
    baseInputs: { fiscalHeadroom: 52, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_TAS_handoff_alignment',
      'ps_h_TAS_affordable',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'commit_gating_stress',
    label: 'Commit gating stress',
    baseInputs: { fiscalHeadroom: 15, stateCapacityLoad: 95, workforceReadiness: 'blocking', workforceSpecialistGap: 82 },
    launchProgramIds: [
      'ps_xp_QLD_commit_gating',
      'ps_h_QLD_regional_release',
      'ps_he_QLD_remote_clinic',
      'ps_ed_NSW_skills',
      'ps_h_NSW_social_accel',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'handoff_trajectory_arc',
    label: 'Handoff trajectory arc',
    baseInputs: { fiscalHeadroom: 54, stateCapacityLoad: 46, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NSW_integration_handoff',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'gated_commit_scheduler_stress',
    label: 'Gated commit scheduler stress',
    baseInputs: { fiscalHeadroom: 14, stateCapacityLoad: 96, workforceReadiness: 'blocking', workforceSpecialistGap: 84 },
    launchProgramIds: [
      'ps_xp_SA_gated_commit_wave',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'integration_trajectory_arc',
    label: 'Integration trajectory arc',
    baseInputs: { fiscalHeadroom: 56, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_VIC_national_wire_in',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
    ],
  },
  {
    id: 'schedule_readiness_stress',
    label: 'Schedule readiness stress',
    baseInputs: { fiscalHeadroom: 13, stateCapacityLoad: 97, workforceReadiness: 'blocking', workforceSpecialistGap: 86 },
    launchProgramIds: [
      'ps_xp_NT_schedule_readiness',
      'ps_h_NT_remote_housing',
      'ps_he_NT_remote_clinic',
      'ps_ed_NSW_skills',
      'ps_h_NSW_social_accel',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wire_in_trajectory_arc',
    label: 'Wire-in trajectory arc',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NSW_turn_boundary',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'turn_boundary_activation_stress',
    label: 'Turn boundary activation stress',
    baseInputs: { fiscalHeadroom: 12, stateCapacityLoad: 98, workforceReadiness: 'blocking', workforceSpecialistGap: 88 },
    launchProgramIds: [
      'ps_xp_SA_agent25_handoff',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_QLD_regional_release',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'assembly_merge_trajectory_arc',
    label: 'Assembly merge trajectory arc',
    baseInputs: { fiscalHeadroom: 60, stateCapacityLoad: 38, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_chunk_anchor',
      'ps_xp_NSW_turn_boundary',
      'ps_h_QLD_regional_release',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'chunk_anchor_alignment_stress',
    label: 'Chunk anchor alignment stress',
    baseInputs: { fiscalHeadroom: 18, stateCapacityLoad: 92, workforceReadiness: 'blocking', workforceSpecialistGap: 80 },
    launchProgramIds: [
      'ps_xp_WA_assembly_merge',
      'ps_xp_SA_agent25_handoff',
      'ps_h_WA_remote_housing',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'inline_merge_trajectory_arc',
    label: 'Inline merge trajectory arc',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_TAS_inline_merge',
      'ps_xp_QLD_chunk_anchor',
      'ps_xp_NSW_turn_boundary',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'inline_activation_stress',
    label: 'Inline activation stress',
    baseInputs: { fiscalHeadroom: 14, stateCapacityLoad: 96, workforceReadiness: 'blocking', workforceSpecialistGap: 85 },
    launchProgramIds: [
      'ps_xp_ACT_wave17_projection',
      'ps_xp_WA_assembly_merge',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'projection_gate_trajectory_arc',
    label: 'Projection gate trajectory arc',
    baseInputs: { fiscalHeadroom: 56, stateCapacityLoad: 40, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave18_projection',
      'ps_xp_TAS_inline_merge',
      'ps_xp_QLD_chunk_anchor',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave18_projection_stress',
    label: 'Wave 18 projection stress',
    baseInputs: { fiscalHeadroom: 13, stateCapacityLoad: 97, workforceReadiness: 'blocking', workforceSpecialistGap: 86 },
    launchProgramIds: [
      'ps_xp_VIC_projection_gate',
      'ps_xp_ACT_wave17_projection',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave19_gate_trajectory_arc',
    label: 'Wave 19 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 57, stateCapacityLoad: 38, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave19_projection',
      'ps_xp_NSW_wave18_projection',
      'ps_xp_TAS_inline_merge',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave19_integration_stress',
    label: 'Wave 19 integration stress',
    baseInputs: { fiscalHeadroom: 12, stateCapacityLoad: 98, workforceReadiness: 'blocking', workforceSpecialistGap: 87 },
    launchProgramIds: [
      'ps_xp_SA_integration_gate',
      'ps_xp_VIC_projection_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave20_gate_trajectory_arc',
    label: 'Wave 20 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 59, stateCapacityLoad: 36, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave20_projection',
      'ps_xp_QLD_wave19_projection',
      'ps_xp_NSW_wave18_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave20_integration_stress',
    label: 'Wave 20 integration stress',
    baseInputs: { fiscalHeadroom: 11, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 88 },
    launchProgramIds: [
      'ps_xp_ACT_o10m171_gate',
      'ps_xp_SA_integration_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave21_gate_trajectory_arc',
    label: 'Wave 21 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 60, stateCapacityLoad: 35, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NT_wave21_projection',
      'ps_xp_WA_wave20_projection',
      'ps_xp_QLD_wave19_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave21_integration_stress',
    label: 'Wave 21 integration stress',
    baseInputs: { fiscalHeadroom: 10, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 89 },
    launchProgramIds: [
      'ps_xp_VIC_o10m174_gate',
      'ps_xp_ACT_o10m171_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave22_gate_trajectory_arc',
    label: 'Wave 22 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 61, stateCapacityLoad: 34, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave22_projection',
      'ps_xp_NT_wave21_projection',
      'ps_xp_WA_wave20_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave22_integration_stress',
    label: 'Wave 22 integration stress',
    baseInputs: { fiscalHeadroom: 9, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 90 },
    launchProgramIds: [
      'ps_xp_NSW_o10m176_gate',
      'ps_xp_VIC_o10m174_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave23_gate_trajectory_arc',
    label: 'Wave 23 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 62, stateCapacityLoad: 33, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave23_projection',
      'ps_xp_QLD_wave22_projection',
      'ps_xp_NT_wave21_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave23_integration_stress',
    label: 'Wave 23 integration stress',
    baseInputs: { fiscalHeadroom: 8, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 91 },
    launchProgramIds: [
      'ps_xp_QLD_o10m178_gate',
      'ps_xp_NSW_o10m176_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave24_gate_trajectory_arc',
    label: 'Wave 24 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 63, stateCapacityLoad: 32, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_ACT_wave24_projection',
      'ps_xp_SA_wave23_projection',
      'ps_xp_QLD_wave22_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave24_integration_stress',
    label: 'Wave 24 integration stress',
    baseInputs: { fiscalHeadroom: 7, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 92 },
    launchProgramIds: [
      'ps_xp_WA_o10m180_gate',
      'ps_xp_QLD_o10m178_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave25_gate_trajectory_arc',
    label: 'Wave 25 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 64, stateCapacityLoad: 31, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave25_projection',
      'ps_xp_ACT_wave24_projection',
      'ps_xp_SA_wave23_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave25_integration_stress',
    label: 'Wave 25 integration stress',
    baseInputs: { fiscalHeadroom: 6, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 93 },
    launchProgramIds: [
      'ps_xp_NT_o10m182_gate',
      'ps_xp_WA_o10m180_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave26_gate_trajectory_arc',
    label: 'Wave 26 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 65, stateCapacityLoad: 30, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave26_projection',
      'ps_xp_VIC_wave25_projection',
      'ps_xp_ACT_wave24_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave26_integration_stress',
    label: 'Wave 26 integration stress',
    baseInputs: { fiscalHeadroom: 5, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 94 },
    launchProgramIds: [
      'ps_xp_SA_o10m184_gate',
      'ps_xp_NT_o10m182_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave27_gate_trajectory_arc',
    label: 'Wave 27 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 66, stateCapacityLoad: 29, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave27_projection',
      'ps_xp_NSW_wave26_projection',
      'ps_xp_VIC_wave25_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave27_integration_stress',
    label: 'Wave 27 integration stress',
    baseInputs: { fiscalHeadroom: 4, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 95 },
    launchProgramIds: [
      'ps_xp_WA_o10m186_gate',
      'ps_xp_SA_o10m184_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave28_gate_trajectory_arc',
    label: 'Wave 28 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 67, stateCapacityLoad: 28, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_ACT_wave28_projection',
      'ps_xp_QLD_wave27_projection',
      'ps_xp_NSW_wave26_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave28_integration_stress',
    label: 'Wave 28 integration stress',
    baseInputs: { fiscalHeadroom: 3, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 96 },
    launchProgramIds: [
      'ps_xp_NT_o10m188_gate',
      'ps_xp_WA_o10m186_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave29_gate_trajectory_arc',
    label: 'Wave 29 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 68, stateCapacityLoad: 27, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave29_projection',
      'ps_xp_ACT_wave28_projection',
      'ps_xp_QLD_wave27_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave29_integration_stress',
    label: 'Wave 29 integration stress',
    baseInputs: { fiscalHeadroom: 2, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 97 },
    launchProgramIds: [
      'ps_xp_SA_o10m190_gate',
      'ps_xp_NT_o10m188_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave30_gate_trajectory_arc',
    label: 'Wave 30 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 69, stateCapacityLoad: 26, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave30_projection',
      'ps_xp_VIC_wave29_projection',
      'ps_xp_ACT_wave28_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave30_integration_stress',
    label: 'Wave 30 integration stress',
    baseInputs: { fiscalHeadroom: 1, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 98 },
    launchProgramIds: [
      'ps_xp_QLD_o10m192_gate',
      'ps_xp_SA_o10m190_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave31_gate_trajectory_arc',
    label: 'Wave 31 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 70, stateCapacityLoad: 25, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave31_projection',
      'ps_xp_SA_wave30_projection',
      'ps_xp_VIC_wave29_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave31_integration_stress',
    label: 'Wave 31 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 99 },
    launchProgramIds: [
      'ps_xp_NT_o10m194_gate',
      'ps_xp_QLD_o10m192_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave32_gate_trajectory_arc',
    label: 'Wave 32 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 71, stateCapacityLoad: 24, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave32_projection',
      'ps_xp_WA_wave31_projection',
      'ps_xp_SA_wave30_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave32_integration_stress',
    label: 'Wave 32 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m196_gate',
      'ps_xp_NT_o10m194_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave33_gate_trajectory_arc',
    label: 'Wave 33 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 72, stateCapacityLoad: 23, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave33_projection',
      'ps_xp_NSW_wave32_projection',
      'ps_xp_WA_wave31_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave33_integration_stress',
    label: 'Wave 33 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m198_gate',
      'ps_xp_WA_o10m196_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave34_gate_trajectory_arc',
    label: 'Wave 34 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 73, stateCapacityLoad: 22, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave34_projection',
      'ps_xp_QLD_wave33_projection',
      'ps_xp_NSW_wave32_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave34_integration_stress',
    label: 'Wave 34 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m200_gate',
      'ps_xp_SA_o10m198_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave35_gate_trajectory_arc',
    label: 'Wave 35 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 74, stateCapacityLoad: 21, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave35_projection',
      'ps_xp_WA_wave34_projection',
      'ps_xp_QLD_wave33_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave35_integration_stress',
    label: 'Wave 35 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m202_gate',
      'ps_xp_NT_o10m200_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave36_gate_trajectory_arc',
    label: 'Wave 36 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 75, stateCapacityLoad: 20, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave36_projection',
      'ps_xp_NSW_wave35_projection',
      'ps_xp_WA_wave34_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave36_integration_stress',
    label: 'Wave 36 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m204_gate',
      'ps_xp_QLD_o10m202_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave37_gate_trajectory_arc',
    label: 'Wave 37 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 76, stateCapacityLoad: 19, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave37_projection',
      'ps_xp_VIC_wave36_projection',
      'ps_xp_NSW_wave35_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave37_integration_stress',
    label: 'Wave 37 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m206_gate',
      'ps_xp_WA_o10m204_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave38_gate_trajectory_arc',
    label: 'Wave 38 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 77, stateCapacityLoad: 18, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave38_projection',
      'ps_xp_SA_wave37_projection',
      'ps_xp_VIC_wave36_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave38_integration_stress',
    label: 'Wave 38 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m208_gate',
      'ps_xp_NT_o10m206_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave39_gate_trajectory_arc',
    label: 'Wave 39 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 78, stateCapacityLoad: 17, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave39_projection',
      'ps_xp_QLD_wave38_projection',
      'ps_xp_SA_wave37_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave39_integration_stress',
    label: 'Wave 39 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m210_gate',
      'ps_xp_SA_o10m208_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave40_gate_trajectory_arc',
    label: 'Wave 40 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 79, stateCapacityLoad: 16, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave40_projection',
      'ps_xp_WA_wave39_projection',
      'ps_xp_QLD_wave38_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave40_integration_stress',
    label: 'Wave 40 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m212_gate',
      'ps_xp_NT_o10m210_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave41_gate_trajectory_arc',
    label: 'Wave 41 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 80, stateCapacityLoad: 15, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave41_projection',
      'ps_xp_NSW_wave40_projection',
      'ps_xp_WA_wave39_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave41_integration_stress',
    label: 'Wave 41 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m214_gate',
      'ps_xp_QLD_o10m212_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave42_gate_trajectory_arc',
    label: 'Wave 42 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 81, stateCapacityLoad: 14, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave42_projection',
      'ps_xp_VIC_wave41_projection',
      'ps_xp_NSW_wave40_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave42_integration_stress',
    label: 'Wave 42 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m216_gate',
      'ps_xp_WA_o10m214_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave43_gate_trajectory_arc',
    label: 'Wave 43 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 82, stateCapacityLoad: 13, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave43_projection',
      'ps_xp_SA_wave42_projection',
      'ps_xp_VIC_wave41_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave43_integration_stress',
    label: 'Wave 43 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m218_gate',
      'ps_xp_NT_o10m216_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave44_gate_trajectory_arc',
    label: 'Wave 44 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 83, stateCapacityLoad: 12, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave44_projection',
      'ps_xp_QLD_wave43_projection',
      'ps_xp_SA_wave42_projection',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'wave44_integration_stress',
    label: 'Wave 44 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m220_gate',
      'ps_xp_SA_o10m218_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave45_gate_trajectory_arc',
    label: 'Wave 45 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 84, stateCapacityLoad: 11, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave45_projection',
      'ps_xp_WA_wave44_projection',
      'ps_xp_QLD_wave43_projection',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave45_integration_stress',
    label: 'Wave 45 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m222_gate',
      'ps_xp_NT_o10m220_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave46_gate_trajectory_arc',
    label: 'Wave 46 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 85, stateCapacityLoad: 10, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave46_projection',
      'ps_xp_VIC_wave45_projection',
      'ps_xp_WA_wave44_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave46_integration_stress',
    label: 'Wave 46 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m224_gate',
      'ps_xp_QLD_o10m222_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave47_gate_trajectory_arc',
    label: 'Wave 47 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 86, stateCapacityLoad: 9, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave47_projection',
      'ps_xp_NSW_wave46_projection',
      'ps_xp_VIC_wave45_projection',
      'ps_h_ACT_density',
    ],
  },
  {
    id: 'wave47_integration_stress',
    label: 'Wave 47 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m225_gate',
      'ps_xp_QLD_o10m224_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
{
    id: 'wave48_gate_trajectory_arc',
    label: 'Wave 48 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 87, stateCapacityLoad: 8, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave48_projection',
      'ps_xp_QLD_wave47_projection',
      'ps_xp_NSW_wave46_projection',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave48_integration_stress',
    label: 'Wave 48 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m226_gate',
      'ps_xp_WA_o10m225_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_ACT_density',
    ],
  },
{
    id: 'wave49_gate_trajectory_arc',
    label: 'Wave 49 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 88, stateCapacityLoad: 7, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave49_projection',
      'ps_xp_VIC_wave48_projection',
      'ps_xp_QLD_wave47_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave49_integration_stress',
    label: 'Wave 49 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m227_gate',
      'ps_xp_SA_o10m226_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'wave50_gate_trajectory_arc',
    label: 'Wave 50 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 88, stateCapacityLoad: 7, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave50_projection',
      'ps_xp_QLD_wave49_projection',
      'ps_xp_VIC_wave48_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave50_integration_stress',
    label: 'Wave 50 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m229_gate',
      'ps_xp_WA_o10m227_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_ACT_density',
    ],
  },
];

export { commitmentFromProgramStub } from './program-stub-commitments.ts';

export function simulateAgent14HousingScenario(
  scenarioId: Agent14HousingScenarioId,
  turnCount: number
): {
  scenario: Agent14HousingScenarioDefinition;
  turns: EnrichedPublicServiceTurnInputs[];
  spendingPersisted: DelayedSpendingPersisted;
} {
  const scenario = AGENT14_HOUSING_SCENARIOS.find((s) => s.id === scenarioId)!;
  const maxTurns = Math.min(Math.max(1, turnCount), AGENT14_LIMITS.maxSimulationTurns);
  let spendingPersisted: DelayedSpendingPersisted | null = null;
  let wellbeingMemoryPersisted = null;
  let couplingTrajectoryPersisted = null;
  let accountabilityTrajectoryPersisted = null;
  let resilienceTrajectoryPersisted = null;
  let governanceTrajectoryPersisted = null;
  let coordinationTrajectoryPersisted = null;
  let stabilizationTrajectoryPersisted = null;
  let reliefFulfillmentPersisted = null;
  let readinessTrajectoryPersisted = null;
  let resumptionTrajectoryPersisted = null;
  let handoffTrajectoryPersisted = null;
  let integrationTrajectoryPersisted = null;
  let wireInTrajectoryPersisted = null;
  let assemblyMergeTrajectoryPersisted = null;
  let inlineMergeTrajectoryPersisted = null;
  let projectionGateTrajectoryPersisted = null;
  let wave19GateTrajectoryPersisted = null;
  let wave20GateTrajectoryPersisted = null;
  let wave21GateTrajectoryPersisted = null;
  let wave22GateTrajectoryPersisted = null;
  let wave23GateTrajectoryPersisted = null;
  let wave24GateTrajectoryPersisted = null;
  let wave25GateTrajectoryPersisted = null;
  let wave26GateTrajectoryPersisted = null;
  let wave27GateTrajectoryPersisted = null;
  let wave28GateTrajectoryPersisted = null;
  let wave29GateTrajectoryPersisted = null;
  let wave30GateTrajectoryPersisted = null;
  let wave31GateTrajectoryPersisted = null;
  let wave32GateTrajectoryPersisted = null;
  let wave33GateTrajectoryPersisted = null;
  let wave34GateTrajectoryPersisted = null;
  let wave35GateTrajectoryPersisted = null;
  let wave36GateTrajectoryPersisted = null;
  let wave37GateTrajectoryPersisted = null;
  let wave38GateTrajectoryPersisted = null;
  let wave39GateTrajectoryPersisted = null;
  let wave40GateTrajectoryPersisted = null;
  let wave41GateTrajectoryPersisted = null;
  let wave42GateTrajectoryPersisted = null;
  let wave43GateTrajectoryPersisted = null;
  let wave44GateTrajectoryPersisted = null;
  let wave45GateTrajectoryPersisted = null;
  let wave46GateTrajectoryPersisted = null;
  let wave47GateTrajectoryPersisted = null;
  let wave48GateTrajectoryPersisted = null;
  let wave49GateTrajectoryPersisted = null;
  let wave50GateTrajectoryPersisted = null;
  const turns: EnrichedPublicServiceTurnInputs[] = [];

  for (let t = 1; t <= maxTurns; t += 1) {
    const newCommitments: SpendingCommitment[] = [];
    if (t === 1) {
      scenario.launchProgramIds.forEach((pid, i) => {
        const c = commitmentFromProgramStub(pid, 1, i);
        if (c) newCommitments.push(c);
      });
    }
    const result = advancePublicServicesTurn({
      inputs: { turn: t, ...scenario.baseInputs },
      spendingPersisted,
      wellbeingMemoryPersisted,
      couplingTrajectoryPersisted,
      accountabilityTrajectoryPersisted,
      resilienceTrajectoryPersisted,
      governanceTrajectoryPersisted,
      coordinationTrajectoryPersisted,
      stabilizationTrajectoryPersisted,
      reliefFulfillmentPersisted,
      readinessTrajectoryPersisted,
      resumptionTrajectoryPersisted,
      handoffTrajectoryPersisted,
      integrationTrajectoryPersisted,
      wireInTrajectoryPersisted,
      assemblyMergeTrajectoryPersisted,
      inlineMergeTrajectoryPersisted,
      projectionGateTrajectoryPersisted,
      wave19GateTrajectoryPersisted,
      wave20GateTrajectoryPersisted,
      wave21GateTrajectoryPersisted,
      wave22GateTrajectoryPersisted,
      wave23GateTrajectoryPersisted,
      wave24GateTrajectoryPersisted,
      wave25GateTrajectoryPersisted,
      wave26GateTrajectoryPersisted,
      wave27GateTrajectoryPersisted,
      wave28GateTrajectoryPersisted,
      wave29GateTrajectoryPersisted,
      wave30GateTrajectoryPersisted,
      wave31GateTrajectoryPersisted,
      wave32GateTrajectoryPersisted,
      wave33GateTrajectoryPersisted,
      wave34GateTrajectoryPersisted,
      wave35GateTrajectoryPersisted,
      wave36GateTrajectoryPersisted,
      wave37GateTrajectoryPersisted,
      wave38GateTrajectoryPersisted,
      wave39GateTrajectoryPersisted,
      wave40GateTrajectoryPersisted,
      wave41GateTrajectoryPersisted,
      wave42GateTrajectoryPersisted,
      wave43GateTrajectoryPersisted,
      wave44GateTrajectoryPersisted,
      wave45GateTrajectoryPersisted,
      wave46GateTrajectoryPersisted,
      wave47GateTrajectoryPersisted,
      wave48GateTrajectoryPersisted,
      wave49GateTrajectoryPersisted,
      wave50GateTrajectoryPersisted,
      newCommitments,
      enforceCapacity: true,
    });
    spendingPersisted = result.spendingPersisted;
    wellbeingMemoryPersisted = result.wellbeingMemoryPersisted;
    couplingTrajectoryPersisted = result.couplingTrajectoryPersisted;
    accountabilityTrajectoryPersisted = result.accountabilityTrajectoryPersisted;
    resilienceTrajectoryPersisted = result.resilienceTrajectoryPersisted;
    governanceTrajectoryPersisted = result.governanceTrajectoryPersisted;
    coordinationTrajectoryPersisted = result.coordinationTrajectoryPersisted;
    stabilizationTrajectoryPersisted = result.stabilizationTrajectoryPersisted;
    reliefFulfillmentPersisted = result.reliefFulfillmentPersisted;
    readinessTrajectoryPersisted = result.readinessTrajectoryPersisted;
    resumptionTrajectoryPersisted = result.resumptionTrajectoryPersisted;
    handoffTrajectoryPersisted = result.handoffTrajectoryPersisted;
    integrationTrajectoryPersisted = result.integrationTrajectoryPersisted;
    wireInTrajectoryPersisted = result.wireInTrajectoryPersisted;
    assemblyMergeTrajectoryPersisted = result.assemblyMergeTrajectoryPersisted;
    inlineMergeTrajectoryPersisted = result.inlineMergeTrajectoryPersisted;
    projectionGateTrajectoryPersisted = result.projectionGateTrajectoryPersisted;
    wave19GateTrajectoryPersisted = result.wave19GateTrajectoryPersisted;
    wave20GateTrajectoryPersisted = result.wave20GateTrajectoryPersisted;
    wave21GateTrajectoryPersisted = result.wave21GateTrajectoryPersisted;
    wave22GateTrajectoryPersisted = result.wave22GateTrajectoryPersisted;
    wave23GateTrajectoryPersisted = result.wave23GateTrajectoryPersisted;
    wave24GateTrajectoryPersisted = result.wave24GateTrajectoryPersisted;
    wave25GateTrajectoryPersisted = result.wave25GateTrajectoryPersisted;
    wave26GateTrajectoryPersisted = result.wave26GateTrajectoryPersisted;
    wave27GateTrajectoryPersisted = result.wave27GateTrajectoryPersisted;
    wave28GateTrajectoryPersisted = result.wave28GateTrajectoryPersisted;
    wave29GateTrajectoryPersisted = result.wave29GateTrajectoryPersisted;
    wave30GateTrajectoryPersisted = result.wave30GateTrajectoryPersisted;
    wave31GateTrajectoryPersisted = result.wave31GateTrajectoryPersisted;
    wave32GateTrajectoryPersisted = result.wave32GateTrajectoryPersisted;
    wave33GateTrajectoryPersisted = result.wave33GateTrajectoryPersisted;
    wave34GateTrajectoryPersisted = result.wave34GateTrajectoryPersisted;
    wave35GateTrajectoryPersisted = result.wave35GateTrajectoryPersisted;
    wave36GateTrajectoryPersisted = result.wave36GateTrajectoryPersisted;
    wave37GateTrajectoryPersisted = result.wave37GateTrajectoryPersisted;
    wave38GateTrajectoryPersisted = result.wave38GateTrajectoryPersisted;
    wave39GateTrajectoryPersisted = result.wave39GateTrajectoryPersisted;
    wave40GateTrajectoryPersisted = result.wave40GateTrajectoryPersisted;
    wave41GateTrajectoryPersisted = result.wave41GateTrajectoryPersisted;
    wave42GateTrajectoryPersisted = result.wave42GateTrajectoryPersisted;
    wave43GateTrajectoryPersisted = result.wave43GateTrajectoryPersisted;
    wave44GateTrajectoryPersisted = result.wave44GateTrajectoryPersisted;
    wave45GateTrajectoryPersisted = result.wave45GateTrajectoryPersisted;
    wave46GateTrajectoryPersisted = result.wave46GateTrajectoryPersisted;
    wave47GateTrajectoryPersisted = result.wave47GateTrajectoryPersisted;
    wave48GateTrajectoryPersisted = result.wave48GateTrajectoryPersisted;
    wave49GateTrajectoryPersisted = result.wave49GateTrajectoryPersisted;
    wave50GateTrajectoryPersisted = result.wave50GateTrajectoryPersisted;
    turns.push(result.inputs);
  }

  return { scenario, turns, spendingPersisted: spendingPersisted! };
}

export function runAgent14HousingScenarioSweep(): Array<{
  scenarioId: Agent14HousingScenarioId;
  passed: boolean;
  detail: string;
}> {
  const out: Array<{ scenarioId: Agent14HousingScenarioId; passed: boolean; detail: string }> = [];
  for (const sc of AGENT14_HOUSING_SCENARIOS) {
    const sim = simulateAgent14HousingScenario(sc.id, 12);
    const last = sim.turns[sim.turns.length - 1];
    const wb = last.housingWellbeing;
    const ok =
      Boolean(wb) &&
      last.capacity.deliveryCapacityIndex > 0 &&
      wb!.totalDwellingsInPipeline > 0 &&
      wb!.narrativeSummary.length > 20;
    out.push({
      scenarioId: sc.id,
      passed: ok,
      detail: ok
        ? `aff=${wb!.nationalAffordabilityIndex} gap=${wb!.regionalEquityGap}`
        : 'missing wellbeing snapshot',
    });
  }
  return out;
}
