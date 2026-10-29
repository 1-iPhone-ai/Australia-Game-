import type { PublicServicePillar } from './types.ts';

export const AGENT14_CORE_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type Agent14CoreRegion = (typeof AGENT14_CORE_REGIONS)[number];

export const AGENT14_LIMITS = {
  maxActiveCommitments: 24,
  maxHistory: 32,
  defaultNationalSlots: 8,
  minFiscalAbsorption: 18,
  maxFiscalAbsorption: 72,
  maxSimulationTurns: 48,
} as const;

export const AGENT14_DEFAULT_PROGRAM_TIMING = {
  effectLagTurns: 2,
  rampTurns: 3,
} as const;

export const AGENT14_PILLARS: readonly PublicServicePillar[] = [
  'housing',
  'healthcare',
  'education',
];

/** Baseline housing delivery context per core region (modular slice; not Living Regions state). */
export const AGENT14_HOUSING_REGION_BASELINE: Record<
  Agent14CoreRegion,
  {
    remoteShare: number;
    planningBacklogMonths: number;
    baselinePipelineDwellings: number;
    affordabilityBaseline: number;
  }
> = {
  NSW: { remoteShare: 0.08, planningBacklogMonths: 9, baselinePipelineDwellings: 4200, affordabilityBaseline: 58 },
  VIC: { remoteShare: 0.06, planningBacklogMonths: 9, baselinePipelineDwellings: 3800, affordabilityBaseline: 56 },
  QLD: { remoteShare: 0.22, planningBacklogMonths: 12, baselinePipelineDwellings: 3100, affordabilityBaseline: 52 },
  WA: { remoteShare: 0.28, planningBacklogMonths: 13, baselinePipelineDwellings: 2400, affordabilityBaseline: 50 },
  SA: { remoteShare: 0.12, planningBacklogMonths: 10, baselinePipelineDwellings: 1100, affordabilityBaseline: 54 },
  TAS: { remoteShare: 0.35, planningBacklogMonths: 15, baselinePipelineDwellings: 480, affordabilityBaseline: 48 },
  NT: { remoteShare: 0.55, planningBacklogMonths: 18, baselinePipelineDwellings: 320, affordabilityBaseline: 42 },
  ACT: { remoteShare: 0.04, planningBacklogMonths: 8, baselinePipelineDwellings: 620, affordabilityBaseline: 60 },
};

export const AGENT14_HOUSING_PROGRAM_STUBS: readonly {
  id: string;
  regionId: Agent14CoreRegion;
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  effectLagTurns: number;
}[] = [
  { id: 'ps_h_NSW_social_accel', regionId: 'NSW', fiscalLoadPoints: 22, durationTurns: 6, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_h_VIC_planning_reform', regionId: 'VIC', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_h_QLD_regional_release', regionId: 'QLD', fiscalLoadPoints: 20, durationTurns: 7, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_h_WA_remote_housing', regionId: 'WA', fiscalLoadPoints: 24, durationTurns: 8, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_h_NT_remote_housing', regionId: 'NT', fiscalLoadPoints: 26, durationTurns: 8, baseImpact: 12, effectLagTurns: 4 },
  { id: 'ps_h_TAS_affordable', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_h_SA_modular', regionId: 'SA', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 6, effectLagTurns: 1 },
  { id: 'ps_h_ACT_density', regionId: 'ACT', fiscalLoadPoints: 12, durationTurns: 4, baseImpact: 5, effectLagTurns: 1 },
];

/** Healthcare and education program stubs (scale wave 4). */
export const AGENT14_HEALTH_ED_PROGRAM_STUBS: readonly {
  id: string;
  pillar: Exclude<PublicServicePillar, 'housing'>;
  regionId: Agent14CoreRegion;
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  effectLagTurns: number;
}[] = [
  { id: 'ps_he_NSW_primary_care', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 20, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_he_VIC_hospital_backlog', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 24, durationTurns: 6, baseImpact: 10, effectLagTurns: 3 },
  { id: 'ps_he_QLD_remote_clinic', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 22, durationTurns: 7, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_he_NT_remote_clinic', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 26, durationTurns: 8, baseImpact: 12, effectLagTurns: 4 },
  { id: 'ps_ed_NSW_skills', pillar: 'education', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_ed_VIC_tafe', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_ed_WA_regional_schools', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 21, durationTurns: 6, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_ed_TAS_rural_connect', pillar: 'education', regionId: 'TAS', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wellness_hub', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 23, durationTurns: 6, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_xp_NT_integrated_services', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 25, durationTurns: 7, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_xp_TAS_community_wellbeing', pillar: 'healthcare', regionId: 'TAS', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_remote_lifecycle', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 22, durationTurns: 6, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_SA_integrated_housing_health', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 21, durationTurns: 6, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wellbeing_coordination', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 15, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_governance_reform', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_relief_coordination', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_stakeholder_alignment', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_portfolio_stabilization', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 20, durationTurns: 6, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_NT_recovery_readiness', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_fulfillment_coordination', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_WA_resumption_planning', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_readiness_cohesion', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_TAS_handoff_alignment', pillar: 'healthcare', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_commit_gating', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_integration_handoff', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_gated_commit_wave', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_national_wire_in', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_schedule_readiness', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_turn_boundary', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_agent25_handoff', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_chunk_anchor', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 20, durationTurns: 6, baseImpact: 10, effectLagTurns: 1 },
  { id: 'ps_xp_WA_assembly_merge', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_TAS_inline_merge', pillar: 'education', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wave17_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 1 },
  { id: 'ps_xp_NSW_wave18_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_projection_gate', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave19_projection', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_integration_gate', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 1 },
  { id: 'ps_xp_WA_wave20_projection', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_o10m171_gate', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 7, effectLagTurns: 1 },
  { id: 'ps_xp_NT_wave21_projection', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_VIC_o10m174_gate', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave22_projection', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_o10m176_gate', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave23_projection', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m178_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 1 },
  { id: 'ps_xp_ACT_wave24_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m180_gate', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave25_projection', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m182_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave26_projection', pillar: 'housing', regionId: 'NSW', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m184_gate', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave27_projection', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m186_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wave28_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m188_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_VIC_wave29_projection', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m190_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave30_projection', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m192_gate', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave31_projection', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m194_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave32_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m196_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave33_projection', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m198_gate', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave34_projection', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m200_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave35_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m202_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave36_projection', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m204_gate', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave37_projection', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m206_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_QLD_wave38_projection', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m208_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave39_projection', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m210_gate', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave40_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m212_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave41_projection', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m214_gate', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave42_projection', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m216_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_QLD_wave43_projection', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m218_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave44_projection', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m220_gate', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
];

export const AGENT14_ALL_PROGRAM_STUBS = [
  ...AGENT14_HOUSING_PROGRAM_STUBS.map((s) => ({ ...s, pillar: 'housing' as const })),
  ...AGENT14_HEALTH_ED_PROGRAM_STUBS,
] as const;
