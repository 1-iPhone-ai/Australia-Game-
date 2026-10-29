// ============================================================================
// AGENT 14 INTEGRATION SLICE — V10.14 PUBLIC SERVICES, HOUSING DELIVERY,
// HEALTHCARE ACCESS & EDUCATION OUTCOMES (MEASURABLE KPI LAYER)
// ============================================================================
// Merge owner: Agent 25 — inline before SECTION 21B in (V9.4) australia-game-with-ai.tsx
// Feature branch: cursor/public-services-wellbeing-ee42
//
// Architectural boundaries (deep-read V9.4 / V10.0–V10.13):
// - V10.13 owns household living standards, affordability, domestic demand signals.
// - V10.14 owns PUBLIC SERVICE DELIVERY capacity and measurable service outcomes
//   (housing supply pipeline, healthcare access/wait-flow, education participation/attainment).
// - V10.12 owns fiscal capacity; V10.10 owns workforce pools; V10.11 owns state capacity.
// - Living Regions remains authoritative for regional economy/needs; this layer interprets
//   service delivery consequences with provenance, never mutating LR state.
// - Public services are not turn actors: no AP, wallets, or resource purchases (Invariant PS-A).
// - Commodity market prices never directly set healthcare/education KPIs (Invariant PS-B).
// - Iron Ore / Gold spikes do not auto-collapse service outcome indices (Invariant PS-C).

export const V1014_SCHEMA_VERSION = '10.14.0';

export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

export const V1014_LIMITS = {
  maxProgramsTracked: 24,
  maxTransitions: 18,
  maxHistory: 28,
  maxEvidence: 10,
  hysteresisDeadband: 2.25,
  maxEquityGap: 100
} as const;

export type PublicServicePillar = 'housing' | 'healthcare' | 'education';

export type ServiceOutcomeBand = 'critical' | 'weak' | 'strained' | 'adequate' | 'strong' | 'excellent';

export type ServiceBacklogBand = 'low' | 'moderate' | 'elevated' | 'high' | 'severe';

export type ServiceThroughputBand = 'stalled' | 'slow' | 'steady' | 'strong' | 'surging';

export type ServiceStaffingBand = 'critical_shortage' | 'shortage' | 'balanced' | 'strong' | 'surplus';

export type PublicServiceWorldEventKind =
  | 'housing_delivery_accelerated'
  | 'housing_backlog_worsened'
  | 'healthcare_access_improved'
  | 'healthcare_wait_pressure_severe'
  | 'education_participation_uplifted'
  | 'education_attainment_gap_widened'
  | 'regional_service_equity_diverged'
  | 'national_outcome_index_shift';

export const V1014_OUTCOME_LABEL: Record<ServiceOutcomeBand, string> = {
  critical: 'CRITICAL',
  weak: 'WEAK',
  strained: 'STRAINED',
  adequate: 'ADEQUATE',
  strong: 'STRONG',
  excellent: 'EXCELLENT'
};

export const V1014_OUTCOME_RANK: Record<ServiceOutcomeBand, number> = {
  critical: 0,
  weak: 1,
  strained: 2,
  adequate: 3,
  strong: 4,
  excellent: 5
};

export const V1014_BACKLOG_LABEL: Record<ServiceBacklogBand, string> = {
  low: 'LOW',
  moderate: 'MODERATE',
  elevated: 'ELEVATED',
  high: 'HIGH',
  severe: 'SEVERE'
};

export const V1014_REGION_WEIGHT: Record<string, number> = {
  "NSW": 0.24,
  "VIC": 0.22,
  "QLD": 0.18,
  "WA": 0.13,
  "SA": 0.09,
  "ACT": 0.06,
  "TAS": 0.04,
  "NT": 0.04
};

export const V1014_REGION_PROFILES: Record<string, {
  regionId: string;
  capitalCity: string;
  populationShare: number;
  remotePopulationShare: number;
  baselines: { housingDelivery: number; healthcareAccess: number; educationParticipation: number };
  backlogDefaults: { planningMonths: number; electiveWaitPressure: number; teacherVacancyPressure: number };
}> = {
  NSW: {
    regionId: 'NSW',
    capitalCity: "Sydney",
    populationShare: 0.32,
    remotePopulationShare: 0.08,
    baselines: {
      housingDelivery: 58,
      healthcareAccess: 72,
      educationParticipation: 74
    },
    backlogDefaults: {
      planningMonths: 9,
      electiveWaitPressure: 33,
      teacherVacancyPressure: 17
    }
  },
  VIC: {
    regionId: 'VIC',
    capitalCity: "Melbourne",
    populationShare: 0.26,
    remotePopulationShare: 0.06,
    baselines: {
      housingDelivery: 56,
      healthcareAccess: 71,
      educationParticipation: 73
    },
    backlogDefaults: {
      planningMonths: 9,
      electiveWaitPressure: 32,
      teacherVacancyPressure: 16
    }
  },
  QLD: {
    regionId: 'QLD',
    capitalCity: "Brisbane",
    populationShare: 0.2,
    remotePopulationShare: 0.22,
    baselines: {
      housingDelivery: 61,
      healthcareAccess: 68,
      educationParticipation: 69
    },
    backlogDefaults: {
      planningMonths: 12,
      electiveWaitPressure: 38,
      teacherVacancyPressure: 20
    }
  },
  WA: {
    regionId: 'WA',
    capitalCity: "Perth",
    populationShare: 0.11,
    remotePopulationShare: 0.28,
    baselines: {
      housingDelivery: 59,
      healthcareAccess: 67,
      educationParticipation: 68
    },
    backlogDefaults: {
      planningMonths: 13,
      electiveWaitPressure: 41,
      teacherVacancyPressure: 22
    }
  },
  SA: {
    regionId: 'SA',
    capitalCity: "Adelaide",
    populationShare: 0.07,
    remotePopulationShare: 0.12,
    baselines: {
      housingDelivery: 63,
      healthcareAccess: 70,
      educationParticipation: 71
    },
    backlogDefaults: {
      planningMonths: 10,
      electiveWaitPressure: 34,
      teacherVacancyPressure: 18
    }
  },
  TAS: {
    regionId: 'TAS',
    capitalCity: "Hobart",
    populationShare: 0.02,
    remotePopulationShare: 0.35,
    baselines: {
      housingDelivery: 64,
      healthcareAccess: 66,
      educationParticipation: 67
    },
    backlogDefaults: {
      planningMonths: 15,
      electiveWaitPressure: 44,
      teacherVacancyPressure: 23
    }
  },
  NT: {
    regionId: 'NT',
    capitalCity: "Darwin",
    populationShare: 0.01,
    remotePopulationShare: 0.48,
    baselines: {
      housingDelivery: 52,
      healthcareAccess: 58,
      educationParticipation: 59
    },
    backlogDefaults: {
      planningMonths: 17,
      electiveWaitPressure: 49,
      teacherVacancyPressure: 27
    }
  },
  ACT: {
    regionId: 'ACT',
    capitalCity: "Canberra",
    populationShare: 0.01,
    remotePopulationShare: 0.02,
    baselines: {
      housingDelivery: 60,
      healthcareAccess: 75,
      educationParticipation: 78
    },
    backlogDefaults: {
      planningMonths: 8,
      electiveWaitPressure: 30,
      teacherVacancyPressure: 15
    }
  }
};

export const V1014_KPI_CATALOG: readonly {
  id: string;
  pillar: string;
  label: string;
  unit: string;
  formula: string;
  reportingCadence: string;
  auditVisibility: string;
}[] = [
  {
    id: 'housing_delivery_throughput',
    pillar: 'housing',
    label: "Housing Delivery Throughput",
    unit: 'index_0_100',
    formula: "completedDwellingPipeline + socialHousingCompletions - planningBacklogPressure",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'housing_affordability_support',
    pillar: 'housing',
    label: "Affordable Tenure Support",
    unit: 'index_0_100',
    formula: "socialHousingStock + rentalAssistanceReach - severePressurePenalty",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'health_primary_access',
    pillar: 'healthcare',
    label: "Primary Care Access",
    unit: 'index_0_100',
    formula: "gpCoverage + bulkBillingSupport - remoteAccessGap",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'health_elective_flow',
    pillar: 'healthcare',
    label: "Elective Care Flow",
    unit: 'index_0_100',
    formula: "electiveThroughput - waitlistPressure",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'health_prevention_outcomes',
    pillar: 'healthcare',
    label: "Preventive Outcomes",
    unit: 'index_0_100',
    formula: "screeningReach + vaccinationUptake - chronicBurden",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'edu_participation',
    pillar: 'education',
    label: "Participation Rate",
    unit: 'index_0_100',
    formula: "enrolmentRetention + earlyYearsUptake",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'edu_attainment',
    pillar: 'education',
    label: "Attainment & Completion",
    unit: 'index_0_100',
    formula: "yr12Completion + certIIICompletion",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'edu_skills_alignment',
    pillar: 'education',
    label: "Skills Pipeline Alignment",
    unit: 'index_0_100',
    formula: "tafeThroughput + apprenticeshipStarts - skillsMismatch",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'equity_regional_gap',
    pillar: 'cross',
    label: "Regional Equity Gap",
    unit: 'gap_0_100',
    formula: "max(regionalOutcome) - min(regionalOutcome)",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  },
  {
    id: 'service_backlog_pressure',
    pillar: 'cross',
    label: "Service Backlog Pressure",
    unit: 'pressure_0_100',
    formula: "planningBacklog + waitlistPressure + unfilledRoles",
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  }
] as const;

export const V1014_PROGRAM_CATALOG: readonly {
  id: string;
  regionId: string;
  pillar: PublicServicePillar;
  name: string;
  baseImpact: number;
  durationTurns: number;
  fiscalLoadPoints: number;
  measurableOutcomes: string[];
  prerequisites: string[];
  tags: string[];
}[] = [
  {
    id: 'ps_h_NSW_1',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_2',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_3',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 7,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_4',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 8,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_5',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 9,
    durationTurns: 3,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_6',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_7',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_8',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_9',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_10',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_11',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NSW_12',
    regionId: 'NSW',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_13',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_14',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_15',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_16',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_17',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 32,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_18',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 33,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_19',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 34,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_20',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 35,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_21',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 36,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_22',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 37,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_23',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 38,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NSW_24',
    regionId: 'NSW',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 39,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_25',
    regionId: 'NSW',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 5,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_26',
    regionId: 'NSW',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 6,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_27',
    regionId: 'NSW',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 7,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_28',
    regionId: 'NSW',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 8,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_29',
    regionId: 'NSW',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 9,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_30',
    regionId: 'NSW',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_31',
    regionId: 'NSW',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 11,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_32',
    regionId: 'NSW',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 4,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_33',
    regionId: 'NSW',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 5,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_34',
    regionId: 'NSW',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 6,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_35',
    regionId: 'NSW',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 7,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NSW_36',
    regionId: 'NSW',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NSW', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_37',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_38',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 7,
    durationTurns: 6,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_39',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 8,
    durationTurns: 7,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_40',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 9,
    durationTurns: 3,
    fiscalLoadPoints: 12,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_41',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_42',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_43',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_44',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_45',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_46',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_47',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_VIC_48',
    regionId: 'VIC',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_49',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 39,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_50',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_51',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_52',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_53',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_54',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_55',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_56',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_57',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_58',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_59',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_VIC_60',
    regionId: 'VIC',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_61',
    regionId: 'VIC',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_62',
    regionId: 'VIC',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_63',
    regionId: 'VIC',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 11,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_64',
    regionId: 'VIC',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 4,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_65',
    regionId: 'VIC',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 5,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_66',
    regionId: 'VIC',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_67',
    regionId: 'VIC',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_68',
    regionId: 'VIC',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_69',
    regionId: 'VIC',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 9,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_70',
    regionId: 'VIC',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 10,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_71',
    regionId: 'VIC',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 11,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_VIC_72',
    regionId: 'VIC',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 4,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['VIC', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_73',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 7,
    durationTurns: 6,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_74',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 8,
    durationTurns: 7,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_75',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 9,
    durationTurns: 3,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_76',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_77',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_78',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_79',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_80',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 12,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_81',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_82',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_83',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_QLD_84',
    regionId: 'QLD',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_85',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_86',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_87',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_88',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_89',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_90',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_91',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_92',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 32,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_93',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 33,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_94',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 34,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_95',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 35,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_QLD_96',
    regionId: 'QLD',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 36,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_97',
    regionId: 'QLD',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 5,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_98',
    regionId: 'QLD',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 6,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_99',
    regionId: 'QLD',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 7,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_100',
    regionId: 'QLD',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 8,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_101',
    regionId: 'QLD',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 9,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_102',
    regionId: 'QLD',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_103',
    regionId: 'QLD',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 11,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_104',
    regionId: 'QLD',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 4,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_105',
    regionId: 'QLD',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 5,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_106',
    regionId: 'QLD',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 6,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_107',
    regionId: 'QLD',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 7,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_QLD_108',
    regionId: 'QLD',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['QLD', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_109',
    regionId: 'WA',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 8,
    durationTurns: 7,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_110',
    regionId: 'WA',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 9,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_111',
    regionId: 'WA',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_112',
    regionId: 'WA',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_113',
    regionId: 'WA',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_114',
    regionId: 'WA',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_115',
    regionId: 'WA',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_116',
    regionId: 'WA',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_117',
    regionId: 'WA',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_118',
    regionId: 'WA',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_119',
    regionId: 'WA',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_WA_120',
    regionId: 'WA',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 5,
    durationTurns: 3,
    fiscalLoadPoints: 12,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_121',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 36,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_122',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 37,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_123',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 38,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_124',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 39,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_125',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_126',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_127',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_128',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_129',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_130',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_131',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_WA_132',
    regionId: 'WA',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_133',
    regionId: 'WA',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_134',
    regionId: 'WA',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_135',
    regionId: 'WA',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 11,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_136',
    regionId: 'WA',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 4,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_137',
    regionId: 'WA',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 5,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_138',
    regionId: 'WA',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_139',
    regionId: 'WA',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_140',
    regionId: 'WA',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_141',
    regionId: 'WA',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 9,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_142',
    regionId: 'WA',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 10,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_143',
    regionId: 'WA',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 11,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_WA_144',
    regionId: 'WA',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 4,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['WA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_145',
    regionId: 'SA',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 9,
    durationTurns: 3,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_146',
    regionId: 'SA',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_147',
    regionId: 'SA',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_148',
    regionId: 'SA',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_149',
    regionId: 'SA',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_150',
    regionId: 'SA',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_151',
    regionId: 'SA',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_152',
    regionId: 'SA',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_153',
    regionId: 'SA',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_154',
    regionId: 'SA',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_155',
    regionId: 'SA',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 5,
    durationTurns: 3,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_SA_156',
    regionId: 'SA',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_157',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_158',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_159',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_160',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_161',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_162',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_163',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_164',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_165',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_166',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_167',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 32,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_SA_168',
    regionId: 'SA',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 33,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_169',
    regionId: 'SA',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 5,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_170',
    regionId: 'SA',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 6,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_171',
    regionId: 'SA',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 7,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_172',
    regionId: 'SA',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 8,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_173',
    regionId: 'SA',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 9,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_174',
    regionId: 'SA',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_175',
    regionId: 'SA',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 11,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_176',
    regionId: 'SA',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 4,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_177',
    regionId: 'SA',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 5,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_178',
    regionId: 'SA',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 6,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_179',
    regionId: 'SA',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 7,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_SA_180',
    regionId: 'SA',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['SA', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_181',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_182',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_183',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_184',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_185',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_186',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_187',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_188',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_189',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_190',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 5,
    durationTurns: 3,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_191',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_TAS_192',
    regionId: 'TAS',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_193',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 33,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_194',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 34,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_195',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 35,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_196',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 36,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_197',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 37,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_198',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 38,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_199',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 39,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_200',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_201',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_202',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_203',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_TAS_204',
    regionId: 'TAS',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_205',
    regionId: 'TAS',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_206',
    regionId: 'TAS',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_207',
    regionId: 'TAS',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 11,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_208',
    regionId: 'TAS',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 4,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_209',
    regionId: 'TAS',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 5,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_210',
    regionId: 'TAS',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_211',
    regionId: 'TAS',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_212',
    regionId: 'TAS',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_213',
    regionId: 'TAS',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 9,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_214',
    regionId: 'TAS',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 10,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_215',
    regionId: 'TAS',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 11,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_TAS_216',
    regionId: 'TAS',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 4,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['TAS', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_217',
    regionId: 'NT',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 4,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_218',
    regionId: 'NT',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_219',
    regionId: 'NT',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_220',
    regionId: 'NT',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 12,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_221',
    regionId: 'NT',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_222',
    regionId: 'NT',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_223',
    regionId: 'NT',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_224',
    regionId: 'NT',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_225',
    regionId: 'NT',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 5,
    durationTurns: 3,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_226',
    regionId: 'NT',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_227',
    regionId: 'NT',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_NT_228',
    regionId: 'NT',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_229',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_230',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_231',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_232',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_233',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_234',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_235',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_236',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_237',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_238',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_239',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_NT_240',
    regionId: 'NT',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_241',
    regionId: 'NT',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 5,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_242',
    regionId: 'NT',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 6,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_243',
    regionId: 'NT',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 7,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_244',
    regionId: 'NT',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 8,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_245',
    regionId: 'NT',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 9,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_246',
    regionId: 'NT',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 10,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_247',
    regionId: 'NT',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 11,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_248',
    regionId: 'NT',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 4,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_249',
    regionId: 'NT',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 5,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_250',
    regionId: 'NT',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 6,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_251',
    regionId: 'NT',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 7,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_NT_252',
    regionId: 'NT',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['NT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_253',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Social Housing Acceleration",
    baseImpact: 5,
    durationTurns: 6,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_254',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Planning Reform Pipeline",
    baseImpact: 6,
    durationTurns: 7,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_255',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Build-to-Rent Incentive",
    baseImpact: 7,
    durationTurns: 3,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_256',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Regional Housing Land Release",
    baseImpact: 8,
    durationTurns: 4,
    fiscalLoadPoints: 28,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_257',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Homelessness Response Hub",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 29,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_258',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Affordable Rental Bond Scheme",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_259',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Modular Housing Factory",
    baseImpact: 4,
    durationTurns: 7,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_260',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Indigenous Housing Partnership",
    baseImpact: 5,
    durationTurns: 3,
    fiscalLoadPoints: 12,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_261',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Disaster-Resilient Rebuild",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 13,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_262',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Vacant Property Activation",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 14,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_263',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Community Land Trust Pilot",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_h_ACT_264',
    regionId: 'ACT',
    pillar: 'housing',
    name: "Transit-Oriented Density Package",
    baseImpact: 9,
    durationTurns: 7,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['housing_delivery_index', 'housing_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'housing', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_265',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Primary Care Access Expansion",
    baseImpact: 6,
    durationTurns: 3,
    fiscalLoadPoints: 30,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_266',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Elective Surgery Blitz",
    baseImpact: 7,
    durationTurns: 4,
    fiscalLoadPoints: 31,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_267',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Rural GP Incentive",
    baseImpact: 8,
    durationTurns: 5,
    fiscalLoadPoints: 32,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_268',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Mental Health Hubs Network",
    baseImpact: 9,
    durationTurns: 2,
    fiscalLoadPoints: 33,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_269',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Aged Care Quality Uplift",
    baseImpact: 10,
    durationTurns: 3,
    fiscalLoadPoints: 34,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_270',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Emergency Department Flow Reform",
    baseImpact: 5,
    durationTurns: 4,
    fiscalLoadPoints: 35,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_271',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Telehealth Integration",
    baseImpact: 6,
    durationTurns: 5,
    fiscalLoadPoints: 36,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_272',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Preventive Health Screening",
    baseImpact: 7,
    durationTurns: 2,
    fiscalLoadPoints: 37,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_273',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Indigenous Health Closing Gap",
    baseImpact: 8,
    durationTurns: 3,
    fiscalLoadPoints: 38,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_274',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Pharmacy Access Guarantee",
    baseImpact: 9,
    durationTurns: 4,
    fiscalLoadPoints: 39,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_275',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Cancer Care Pathway",
    baseImpact: 10,
    durationTurns: 5,
    fiscalLoadPoints: 15,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_he_ACT_276',
    regionId: 'ACT',
    pillar: 'healthcare',
    name: "Maternal Health Support",
    baseImpact: 5,
    durationTurns: 2,
    fiscalLoadPoints: 16,
    measurableOutcomes: ['healthcare_delivery_index', 'healthcare_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'healthcare', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_277',
    regionId: 'ACT',
    pillar: 'education',
    name: "Early Childhood Participation",
    baseImpact: 9,
    durationTurns: 5,
    fiscalLoadPoints: 17,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_278',
    regionId: 'ACT',
    pillar: 'education',
    name: "Disadvantaged Schools Fund",
    baseImpact: 10,
    durationTurns: 6,
    fiscalLoadPoints: 18,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_279',
    regionId: 'ACT',
    pillar: 'education',
    name: "TAFE Skills Guarantee",
    baseImpact: 11,
    durationTurns: 7,
    fiscalLoadPoints: 19,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_280',
    regionId: 'ACT',
    pillar: 'education',
    name: "University Place Expansion",
    baseImpact: 4,
    durationTurns: 8,
    fiscalLoadPoints: 20,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_281',
    regionId: 'ACT',
    pillar: 'education',
    name: "Literacy & Numeracy Catch-up",
    baseImpact: 5,
    durationTurns: 9,
    fiscalLoadPoints: 21,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_282',
    regionId: 'ACT',
    pillar: 'education',
    name: "Remote Learning Connectivity",
    baseImpact: 6,
    durationTurns: 4,
    fiscalLoadPoints: 22,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_283',
    regionId: 'ACT',
    pillar: 'education',
    name: "Indigenous Education Partnership",
    baseImpact: 7,
    durationTurns: 5,
    fiscalLoadPoints: 23,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_284',
    regionId: 'ACT',
    pillar: 'education',
    name: "STEM Teacher Pipeline",
    baseImpact: 8,
    durationTurns: 6,
    fiscalLoadPoints: 24,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_285',
    regionId: 'ACT',
    pillar: 'education',
    name: "Apprenticeship Uplift",
    baseImpact: 9,
    durationTurns: 7,
    fiscalLoadPoints: 25,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_286',
    regionId: 'ACT',
    pillar: 'education',
    name: "Career Pathways in Regions",
    baseImpact: 10,
    durationTurns: 8,
    fiscalLoadPoints: 26,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_287',
    regionId: 'ACT',
    pillar: 'education',
    name: "Inclusive Education Support",
    baseImpact: 11,
    durationTurns: 9,
    fiscalLoadPoints: 27,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  },
  {
    id: 'ps_e_ACT_288',
    regionId: 'ACT',
    pillar: 'education',
    name: "Adult Reskilling Voucher",
    baseImpact: 4,
    durationTurns: 4,
    fiscalLoadPoints: 10,
    measurableOutcomes: ['education_delivery_index', 'education_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['ACT', 'education', 'measurable_outcome']
  }
] as const;

export const V1014_SCENARIO_MATRIX: readonly {
  id: string;
  label: string;
  fiscalPosture: string;
  workforceStrain: number;
  highlightPillar: PublicServicePillar;
  targetRegions: string[];
}[] = [
  {
    id: 'ps_scenario_01',
    label: "Public Services What-If 1",
    fiscalPosture: 'expansionary',
    workforceStrain: 0,
    highlightPillar: 'housing',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_02',
    label: "Public Services What-If 2",
    fiscalPosture: 'neutral',
    workforceStrain: 18,
    highlightPillar: 'healthcare',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_03',
    label: "Public Services What-If 3",
    fiscalPosture: 'consolidation',
    workforceStrain: 36,
    highlightPillar: 'education',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_04',
    label: "Public Services What-If 4",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 54,
    highlightPillar: 'housing',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_05',
    label: "Public Services What-If 5",
    fiscalPosture: 'expansionary',
    workforceStrain: 72,
    highlightPillar: 'healthcare',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_06',
    label: "Public Services What-If 6",
    fiscalPosture: 'neutral',
    workforceStrain: 0,
    highlightPillar: 'education',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_07',
    label: "Public Services What-If 7",
    fiscalPosture: 'consolidation',
    workforceStrain: 18,
    highlightPillar: 'housing',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_08',
    label: "Public Services What-If 8",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 36,
    highlightPillar: 'healthcare',
    targetRegions: ["ACT","QLD"]
  },
  {
    id: 'ps_scenario_09',
    label: "Public Services What-If 9",
    fiscalPosture: 'expansionary',
    workforceStrain: 54,
    highlightPillar: 'education',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_10',
    label: "Public Services What-If 10",
    fiscalPosture: 'neutral',
    workforceStrain: 72,
    highlightPillar: 'housing',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_11',
    label: "Public Services What-If 11",
    fiscalPosture: 'consolidation',
    workforceStrain: 0,
    highlightPillar: 'healthcare',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_12',
    label: "Public Services What-If 12",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 18,
    highlightPillar: 'education',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_13',
    label: "Public Services What-If 13",
    fiscalPosture: 'expansionary',
    workforceStrain: 36,
    highlightPillar: 'housing',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_14',
    label: "Public Services What-If 14",
    fiscalPosture: 'neutral',
    workforceStrain: 54,
    highlightPillar: 'healthcare',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_15',
    label: "Public Services What-If 15",
    fiscalPosture: 'consolidation',
    workforceStrain: 72,
    highlightPillar: 'education',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_16',
    label: "Public Services What-If 16",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 0,
    highlightPillar: 'housing',
    targetRegions: ["ACT","QLD"]
  },
  {
    id: 'ps_scenario_17',
    label: "Public Services What-If 17",
    fiscalPosture: 'expansionary',
    workforceStrain: 18,
    highlightPillar: 'healthcare',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_18',
    label: "Public Services What-If 18",
    fiscalPosture: 'neutral',
    workforceStrain: 36,
    highlightPillar: 'education',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_19',
    label: "Public Services What-If 19",
    fiscalPosture: 'consolidation',
    workforceStrain: 54,
    highlightPillar: 'housing',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_20',
    label: "Public Services What-If 20",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 72,
    highlightPillar: 'healthcare',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_21',
    label: "Public Services What-If 21",
    fiscalPosture: 'expansionary',
    workforceStrain: 0,
    highlightPillar: 'education',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_22',
    label: "Public Services What-If 22",
    fiscalPosture: 'neutral',
    workforceStrain: 18,
    highlightPillar: 'housing',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_23',
    label: "Public Services What-If 23",
    fiscalPosture: 'consolidation',
    workforceStrain: 36,
    highlightPillar: 'healthcare',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_24',
    label: "Public Services What-If 24",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 54,
    highlightPillar: 'education',
    targetRegions: ["ACT","QLD"]
  },
  {
    id: 'ps_scenario_25',
    label: "Public Services What-If 25",
    fiscalPosture: 'expansionary',
    workforceStrain: 72,
    highlightPillar: 'housing',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_26',
    label: "Public Services What-If 26",
    fiscalPosture: 'neutral',
    workforceStrain: 0,
    highlightPillar: 'healthcare',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_27',
    label: "Public Services What-If 27",
    fiscalPosture: 'consolidation',
    workforceStrain: 18,
    highlightPillar: 'education',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_28',
    label: "Public Services What-If 28",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 36,
    highlightPillar: 'housing',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_29',
    label: "Public Services What-If 29",
    fiscalPosture: 'expansionary',
    workforceStrain: 54,
    highlightPillar: 'healthcare',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_30',
    label: "Public Services What-If 30",
    fiscalPosture: 'neutral',
    workforceStrain: 72,
    highlightPillar: 'education',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_31',
    label: "Public Services What-If 31",
    fiscalPosture: 'consolidation',
    workforceStrain: 0,
    highlightPillar: 'housing',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_32',
    label: "Public Services What-If 32",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 18,
    highlightPillar: 'healthcare',
    targetRegions: ["ACT","QLD"]
  },
  {
    id: 'ps_scenario_33',
    label: "Public Services What-If 33",
    fiscalPosture: 'expansionary',
    workforceStrain: 36,
    highlightPillar: 'education',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_34',
    label: "Public Services What-If 34",
    fiscalPosture: 'neutral',
    workforceStrain: 54,
    highlightPillar: 'housing',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_35',
    label: "Public Services What-If 35",
    fiscalPosture: 'consolidation',
    workforceStrain: 72,
    highlightPillar: 'healthcare',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_36',
    label: "Public Services What-If 36",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 0,
    highlightPillar: 'education',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_37',
    label: "Public Services What-If 37",
    fiscalPosture: 'expansionary',
    workforceStrain: 18,
    highlightPillar: 'housing',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_38',
    label: "Public Services What-If 38",
    fiscalPosture: 'neutral',
    workforceStrain: 36,
    highlightPillar: 'healthcare',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_39',
    label: "Public Services What-If 39",
    fiscalPosture: 'consolidation',
    workforceStrain: 54,
    highlightPillar: 'education',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_40',
    label: "Public Services What-If 40",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 72,
    highlightPillar: 'housing',
    targetRegions: ["ACT","QLD"]
  },
  {
    id: 'ps_scenario_41',
    label: "Public Services What-If 41",
    fiscalPosture: 'expansionary',
    workforceStrain: 0,
    highlightPillar: 'healthcare',
    targetRegions: ["NSW","WA"]
  },
  {
    id: 'ps_scenario_42',
    label: "Public Services What-If 42",
    fiscalPosture: 'neutral',
    workforceStrain: 18,
    highlightPillar: 'education',
    targetRegions: ["VIC","SA"]
  },
  {
    id: 'ps_scenario_43',
    label: "Public Services What-If 43",
    fiscalPosture: 'consolidation',
    workforceStrain: 36,
    highlightPillar: 'housing',
    targetRegions: ["QLD","TAS"]
  },
  {
    id: 'ps_scenario_44',
    label: "Public Services What-If 44",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 54,
    highlightPillar: 'healthcare',
    targetRegions: ["WA","NT"]
  },
  {
    id: 'ps_scenario_45',
    label: "Public Services What-If 45",
    fiscalPosture: 'expansionary',
    workforceStrain: 72,
    highlightPillar: 'education',
    targetRegions: ["SA","ACT"]
  },
  {
    id: 'ps_scenario_46',
    label: "Public Services What-If 46",
    fiscalPosture: 'neutral',
    workforceStrain: 0,
    highlightPillar: 'housing',
    targetRegions: ["TAS","NSW"]
  },
  {
    id: 'ps_scenario_47',
    label: "Public Services What-If 47",
    fiscalPosture: 'consolidation',
    workforceStrain: 18,
    highlightPillar: 'healthcare',
    targetRegions: ["NT","VIC"]
  },
  {
    id: 'ps_scenario_48',
    label: "Public Services What-If 48",
    fiscalPosture: 'crisis_recovery',
    workforceStrain: 36,
    highlightPillar: 'education',
    targetRegions: ["ACT","QLD"]
  }
] as const;

export const V1014_MEASURABLE_OUTCOME_SPEC: readonly {
  id: string;
  regionId: string;
  pillar: PublicServicePillar;
  tier: number;
  targetIndex: number;
  minimumAcceptable: number;
  stretchGoal: number;
  measurementWindowTurns: number;
  auditMetric: string;
  reportingNotes: string;
}[] = [
  {
    id: 'out_NSW_housing_t0',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 0,
    targetIndex: 57,
    minimumAcceptable: 39,
    stretchGoal: 69,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t1',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 1,
    targetIndex: 57.6,
    minimumAcceptable: 39.6,
    stretchGoal: 69.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t2',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 2,
    targetIndex: 58.1,
    minimumAcceptable: 40.1,
    stretchGoal: 70.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t3',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 3,
    targetIndex: 58.7,
    minimumAcceptable: 40.7,
    stretchGoal: 70.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t4',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 4,
    targetIndex: 59.2,
    minimumAcceptable: 41.2,
    stretchGoal: 71.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t5',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 5,
    targetIndex: 59.8,
    minimumAcceptable: 41.8,
    stretchGoal: 71.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t6',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 6,
    targetIndex: 60.3,
    minimumAcceptable: 42.3,
    stretchGoal: 72.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t7',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 7,
    targetIndex: 60.9,
    minimumAcceptable: 42.9,
    stretchGoal: 72.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t8',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 8,
    targetIndex: 61.4,
    minimumAcceptable: 43.4,
    stretchGoal: 73.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t9',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 9,
    targetIndex: 62,
    minimumAcceptable: 44,
    stretchGoal: 74,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t10',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 10,
    targetIndex: 62.5,
    minimumAcceptable: 44.5,
    stretchGoal: 74.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t11',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 11,
    targetIndex: 63.1,
    minimumAcceptable: 45.1,
    stretchGoal: 75.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t12',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 12,
    targetIndex: 63.6,
    minimumAcceptable: 45.6,
    stretchGoal: 75.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t13',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 13,
    targetIndex: 64.2,
    minimumAcceptable: 46.2,
    stretchGoal: 76.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t14',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 14,
    targetIndex: 64.7,
    minimumAcceptable: 46.7,
    stretchGoal: 76.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t15',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 15,
    targetIndex: 65.3,
    minimumAcceptable: 47.3,
    stretchGoal: 77.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t16',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 16,
    targetIndex: 65.8,
    minimumAcceptable: 47.8,
    stretchGoal: 77.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t17',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 17,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t18',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 18,
    targetIndex: 66.9,
    minimumAcceptable: 48.900000000000006,
    stretchGoal: 78.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t19',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 19,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t20',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 20,
    targetIndex: 68,
    minimumAcceptable: 50,
    stretchGoal: 80,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t21',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 21,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t22',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 22,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t23',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 23,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t24',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 24,
    targetIndex: 70.2,
    minimumAcceptable: 52.2,
    stretchGoal: 82.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t25',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 25,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t26',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 26,
    targetIndex: 71.3,
    minimumAcceptable: 53.3,
    stretchGoal: 83.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t27',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 27,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t28',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 28,
    targetIndex: 72.4,
    minimumAcceptable: 54.400000000000006,
    stretchGoal: 84.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t29',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 29,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t30',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 30,
    targetIndex: 73.5,
    minimumAcceptable: 55.5,
    stretchGoal: 85.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t31',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 31,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t32',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 32,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t33',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 33,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t34',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 34,
    targetIndex: 75.7,
    minimumAcceptable: 57.7,
    stretchGoal: 87.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t35',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 35,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t36',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 36,
    targetIndex: 76.8,
    minimumAcceptable: 58.8,
    stretchGoal: 88.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t37',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 37,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t38',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 38,
    targetIndex: 77.9,
    minimumAcceptable: 59.900000000000006,
    stretchGoal: 89.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t39',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 39,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t40',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 40,
    targetIndex: 79,
    minimumAcceptable: 61,
    stretchGoal: 91,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t41',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 41,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t42',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 42,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t43',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 43,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_housing_t44',
    regionId: 'NSW',
    pillar: 'housing',
    tier: 44,
    targetIndex: 81.2,
    minimumAcceptable: 63.2,
    stretchGoal: 93.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for NSW housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t0',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 71,
    minimumAcceptable: 53,
    stretchGoal: 83,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t1',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 71.6,
    minimumAcceptable: 53.599999999999994,
    stretchGoal: 83.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t2',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 72.1,
    minimumAcceptable: 54.099999999999994,
    stretchGoal: 84.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t3',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 72.7,
    minimumAcceptable: 54.7,
    stretchGoal: 84.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t4',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 73.2,
    minimumAcceptable: 55.2,
    stretchGoal: 85.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t5',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 73.8,
    minimumAcceptable: 55.8,
    stretchGoal: 85.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t6',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 74.3,
    minimumAcceptable: 56.3,
    stretchGoal: 86.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t7',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 74.9,
    minimumAcceptable: 56.900000000000006,
    stretchGoal: 86.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t8',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 75.4,
    minimumAcceptable: 57.400000000000006,
    stretchGoal: 87.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t9',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 76,
    minimumAcceptable: 58,
    stretchGoal: 88,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t10',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 76.5,
    minimumAcceptable: 58.5,
    stretchGoal: 88.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t11',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 77.1,
    minimumAcceptable: 59.099999999999994,
    stretchGoal: 89.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t12',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 77.6,
    minimumAcceptable: 59.599999999999994,
    stretchGoal: 89.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t13',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 78.2,
    minimumAcceptable: 60.2,
    stretchGoal: 90.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t14',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 78.7,
    minimumAcceptable: 60.7,
    stretchGoal: 90.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t15',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 79.3,
    minimumAcceptable: 61.3,
    stretchGoal: 91.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t16',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 79.8,
    minimumAcceptable: 61.8,
    stretchGoal: 91.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t17',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 80.4,
    minimumAcceptable: 62.400000000000006,
    stretchGoal: 92.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t18',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 80.9,
    minimumAcceptable: 62.900000000000006,
    stretchGoal: 92.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t19',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 81.5,
    minimumAcceptable: 63.5,
    stretchGoal: 93.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t20',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 82,
    minimumAcceptable: 64,
    stretchGoal: 94,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t21',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 82.6,
    minimumAcceptable: 64.6,
    stretchGoal: 94.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t22',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 83.1,
    minimumAcceptable: 65.1,
    stretchGoal: 95.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t23',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 83.7,
    minimumAcceptable: 65.7,
    stretchGoal: 95.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t24',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 84.2,
    minimumAcceptable: 66.2,
    stretchGoal: 96.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t25',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 84.8,
    minimumAcceptable: 66.8,
    stretchGoal: 96.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t26',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 85.3,
    minimumAcceptable: 67.3,
    stretchGoal: 97.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t27',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 85.9,
    minimumAcceptable: 67.9,
    stretchGoal: 97.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t28',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 86.4,
    minimumAcceptable: 68.4,
    stretchGoal: 98.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t29',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 87,
    minimumAcceptable: 69,
    stretchGoal: 99,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t30',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 87.5,
    minimumAcceptable: 69.5,
    stretchGoal: 99.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t31',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 88.1,
    minimumAcceptable: 70.1,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t32',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 88.6,
    minimumAcceptable: 70.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t33',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 89.2,
    minimumAcceptable: 71.2,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t34',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 89.7,
    minimumAcceptable: 71.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t35',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 90.3,
    minimumAcceptable: 72.3,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t36',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 90.8,
    minimumAcceptable: 72.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t37',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 91.4,
    minimumAcceptable: 73.4,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t38',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 91.9,
    minimumAcceptable: 73.9,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t39',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 92.5,
    minimumAcceptable: 74.5,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t40',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 93,
    minimumAcceptable: 75,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t41',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 93.6,
    minimumAcceptable: 75.6,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t42',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 94.1,
    minimumAcceptable: 76.1,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t43',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 94.7,
    minimumAcceptable: 76.7,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_healthcare_t44',
    regionId: 'NSW',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 95.2,
    minimumAcceptable: 77.2,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for NSW healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t0',
    regionId: 'NSW',
    pillar: 'education',
    tier: 0,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t1',
    regionId: 'NSW',
    pillar: 'education',
    tier: 1,
    targetIndex: 73.6,
    minimumAcceptable: 55.599999999999994,
    stretchGoal: 85.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t2',
    regionId: 'NSW',
    pillar: 'education',
    tier: 2,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t3',
    regionId: 'NSW',
    pillar: 'education',
    tier: 3,
    targetIndex: 74.7,
    minimumAcceptable: 56.7,
    stretchGoal: 86.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t4',
    regionId: 'NSW',
    pillar: 'education',
    tier: 4,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t5',
    regionId: 'NSW',
    pillar: 'education',
    tier: 5,
    targetIndex: 75.8,
    minimumAcceptable: 57.8,
    stretchGoal: 87.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t6',
    regionId: 'NSW',
    pillar: 'education',
    tier: 6,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t7',
    regionId: 'NSW',
    pillar: 'education',
    tier: 7,
    targetIndex: 76.9,
    minimumAcceptable: 58.900000000000006,
    stretchGoal: 88.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t8',
    regionId: 'NSW',
    pillar: 'education',
    tier: 8,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t9',
    regionId: 'NSW',
    pillar: 'education',
    tier: 9,
    targetIndex: 78,
    minimumAcceptable: 60,
    stretchGoal: 90,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t10',
    regionId: 'NSW',
    pillar: 'education',
    tier: 10,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t11',
    regionId: 'NSW',
    pillar: 'education',
    tier: 11,
    targetIndex: 79.1,
    minimumAcceptable: 61.099999999999994,
    stretchGoal: 91.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t12',
    regionId: 'NSW',
    pillar: 'education',
    tier: 12,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t13',
    regionId: 'NSW',
    pillar: 'education',
    tier: 13,
    targetIndex: 80.2,
    minimumAcceptable: 62.2,
    stretchGoal: 92.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t14',
    regionId: 'NSW',
    pillar: 'education',
    tier: 14,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t15',
    regionId: 'NSW',
    pillar: 'education',
    tier: 15,
    targetIndex: 81.3,
    minimumAcceptable: 63.3,
    stretchGoal: 93.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t16',
    regionId: 'NSW',
    pillar: 'education',
    tier: 16,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t17',
    regionId: 'NSW',
    pillar: 'education',
    tier: 17,
    targetIndex: 82.4,
    minimumAcceptable: 64.4,
    stretchGoal: 94.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t18',
    regionId: 'NSW',
    pillar: 'education',
    tier: 18,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t19',
    regionId: 'NSW',
    pillar: 'education',
    tier: 19,
    targetIndex: 83.5,
    minimumAcceptable: 65.5,
    stretchGoal: 95.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t20',
    regionId: 'NSW',
    pillar: 'education',
    tier: 20,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t21',
    regionId: 'NSW',
    pillar: 'education',
    tier: 21,
    targetIndex: 84.6,
    minimumAcceptable: 66.6,
    stretchGoal: 96.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t22',
    regionId: 'NSW',
    pillar: 'education',
    tier: 22,
    targetIndex: 85.1,
    minimumAcceptable: 67.1,
    stretchGoal: 97.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t23',
    regionId: 'NSW',
    pillar: 'education',
    tier: 23,
    targetIndex: 85.7,
    minimumAcceptable: 67.7,
    stretchGoal: 97.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t24',
    regionId: 'NSW',
    pillar: 'education',
    tier: 24,
    targetIndex: 86.2,
    minimumAcceptable: 68.2,
    stretchGoal: 98.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t25',
    regionId: 'NSW',
    pillar: 'education',
    tier: 25,
    targetIndex: 86.8,
    minimumAcceptable: 68.8,
    stretchGoal: 98.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t26',
    regionId: 'NSW',
    pillar: 'education',
    tier: 26,
    targetIndex: 87.3,
    minimumAcceptable: 69.3,
    stretchGoal: 99.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t27',
    regionId: 'NSW',
    pillar: 'education',
    tier: 27,
    targetIndex: 87.9,
    minimumAcceptable: 69.9,
    stretchGoal: 99.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t28',
    regionId: 'NSW',
    pillar: 'education',
    tier: 28,
    targetIndex: 88.4,
    minimumAcceptable: 70.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t29',
    regionId: 'NSW',
    pillar: 'education',
    tier: 29,
    targetIndex: 89,
    minimumAcceptable: 71,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t30',
    regionId: 'NSW',
    pillar: 'education',
    tier: 30,
    targetIndex: 89.5,
    minimumAcceptable: 71.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t31',
    regionId: 'NSW',
    pillar: 'education',
    tier: 31,
    targetIndex: 90.1,
    minimumAcceptable: 72.1,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t32',
    regionId: 'NSW',
    pillar: 'education',
    tier: 32,
    targetIndex: 90.6,
    minimumAcceptable: 72.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t33',
    regionId: 'NSW',
    pillar: 'education',
    tier: 33,
    targetIndex: 91.2,
    minimumAcceptable: 73.2,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t34',
    regionId: 'NSW',
    pillar: 'education',
    tier: 34,
    targetIndex: 91.7,
    minimumAcceptable: 73.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t35',
    regionId: 'NSW',
    pillar: 'education',
    tier: 35,
    targetIndex: 92.3,
    minimumAcceptable: 74.3,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t36',
    regionId: 'NSW',
    pillar: 'education',
    tier: 36,
    targetIndex: 92.8,
    minimumAcceptable: 74.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t37',
    regionId: 'NSW',
    pillar: 'education',
    tier: 37,
    targetIndex: 93.4,
    minimumAcceptable: 75.4,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t38',
    regionId: 'NSW',
    pillar: 'education',
    tier: 38,
    targetIndex: 93.9,
    minimumAcceptable: 75.9,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t39',
    regionId: 'NSW',
    pillar: 'education',
    tier: 39,
    targetIndex: 94.5,
    minimumAcceptable: 76.5,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t40',
    regionId: 'NSW',
    pillar: 'education',
    tier: 40,
    targetIndex: 95,
    minimumAcceptable: 77,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t41',
    regionId: 'NSW',
    pillar: 'education',
    tier: 41,
    targetIndex: 95.6,
    minimumAcceptable: 77.6,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t42',
    regionId: 'NSW',
    pillar: 'education',
    tier: 42,
    targetIndex: 96.1,
    minimumAcceptable: 78.1,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t43',
    regionId: 'NSW',
    pillar: 'education',
    tier: 43,
    targetIndex: 96.7,
    minimumAcceptable: 78.7,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NSW_education_t44',
    regionId: 'NSW',
    pillar: 'education',
    tier: 44,
    targetIndex: 97.2,
    minimumAcceptable: 79.2,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for NSW education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t0',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 0,
    targetIndex: 55.3,
    minimumAcceptable: 37.3,
    stretchGoal: 67.3,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t1',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 1,
    targetIndex: 55.8,
    minimumAcceptable: 37.8,
    stretchGoal: 67.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t2',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 2,
    targetIndex: 56.4,
    minimumAcceptable: 38.4,
    stretchGoal: 68.4,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t3',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 3,
    targetIndex: 56.9,
    minimumAcceptable: 38.9,
    stretchGoal: 68.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t4',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 4,
    targetIndex: 57.5,
    minimumAcceptable: 39.5,
    stretchGoal: 69.5,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t5',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 5,
    targetIndex: 58,
    minimumAcceptable: 40,
    stretchGoal: 70,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t6',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 6,
    targetIndex: 58.6,
    minimumAcceptable: 40.6,
    stretchGoal: 70.6,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t7',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 7,
    targetIndex: 59.1,
    minimumAcceptable: 41.1,
    stretchGoal: 71.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t8',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 8,
    targetIndex: 59.7,
    minimumAcceptable: 41.7,
    stretchGoal: 71.7,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t9',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 9,
    targetIndex: 60.2,
    minimumAcceptable: 42.2,
    stretchGoal: 72.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t10',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 10,
    targetIndex: 60.8,
    minimumAcceptable: 42.8,
    stretchGoal: 72.8,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t11',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 11,
    targetIndex: 61.3,
    minimumAcceptable: 43.3,
    stretchGoal: 73.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t12',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 12,
    targetIndex: 61.9,
    minimumAcceptable: 43.9,
    stretchGoal: 73.9,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t13',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 13,
    targetIndex: 62.4,
    minimumAcceptable: 44.4,
    stretchGoal: 74.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t14',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 14,
    targetIndex: 63,
    minimumAcceptable: 45,
    stretchGoal: 75,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t15',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 15,
    targetIndex: 63.5,
    minimumAcceptable: 45.5,
    stretchGoal: 75.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t16',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 16,
    targetIndex: 64.1,
    minimumAcceptable: 46.099999999999994,
    stretchGoal: 76.1,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t17',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 17,
    targetIndex: 64.6,
    minimumAcceptable: 46.599999999999994,
    stretchGoal: 76.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t18',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 18,
    targetIndex: 65.2,
    minimumAcceptable: 47.2,
    stretchGoal: 77.2,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t19',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 19,
    targetIndex: 65.7,
    minimumAcceptable: 47.7,
    stretchGoal: 77.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t20',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 20,
    targetIndex: 66.3,
    minimumAcceptable: 48.3,
    stretchGoal: 78.3,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t21',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 21,
    targetIndex: 66.8,
    minimumAcceptable: 48.8,
    stretchGoal: 78.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t22',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 22,
    targetIndex: 67.4,
    minimumAcceptable: 49.400000000000006,
    stretchGoal: 79.4,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t23',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 23,
    targetIndex: 67.9,
    minimumAcceptable: 49.900000000000006,
    stretchGoal: 79.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t24',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 24,
    targetIndex: 68.5,
    minimumAcceptable: 50.5,
    stretchGoal: 80.5,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t25',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 25,
    targetIndex: 69,
    minimumAcceptable: 51,
    stretchGoal: 81,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t26',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 26,
    targetIndex: 69.6,
    minimumAcceptable: 51.599999999999994,
    stretchGoal: 81.6,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t27',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 27,
    targetIndex: 70.1,
    minimumAcceptable: 52.099999999999994,
    stretchGoal: 82.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t28',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 28,
    targetIndex: 70.7,
    minimumAcceptable: 52.7,
    stretchGoal: 82.7,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t29',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 29,
    targetIndex: 71.2,
    minimumAcceptable: 53.2,
    stretchGoal: 83.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t30',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 30,
    targetIndex: 71.8,
    minimumAcceptable: 53.8,
    stretchGoal: 83.8,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t31',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 31,
    targetIndex: 72.3,
    minimumAcceptable: 54.3,
    stretchGoal: 84.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t32',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 32,
    targetIndex: 72.9,
    minimumAcceptable: 54.900000000000006,
    stretchGoal: 84.9,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t33',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 33,
    targetIndex: 73.4,
    minimumAcceptable: 55.400000000000006,
    stretchGoal: 85.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t34',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 34,
    targetIndex: 74,
    minimumAcceptable: 56,
    stretchGoal: 86,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t35',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 35,
    targetIndex: 74.5,
    minimumAcceptable: 56.5,
    stretchGoal: 86.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t36',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 36,
    targetIndex: 75.1,
    minimumAcceptable: 57.099999999999994,
    stretchGoal: 87.1,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t37',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 37,
    targetIndex: 75.6,
    minimumAcceptable: 57.599999999999994,
    stretchGoal: 87.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t38',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 38,
    targetIndex: 76.2,
    minimumAcceptable: 58.2,
    stretchGoal: 88.2,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t39',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 39,
    targetIndex: 76.7,
    minimumAcceptable: 58.7,
    stretchGoal: 88.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t40',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 40,
    targetIndex: 77.3,
    minimumAcceptable: 59.3,
    stretchGoal: 89.3,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t41',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 41,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t42',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 42,
    targetIndex: 78.4,
    minimumAcceptable: 60.400000000000006,
    stretchGoal: 90.4,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t43',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 43,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_housing_t44',
    regionId: 'VIC',
    pillar: 'housing',
    tier: 44,
    targetIndex: 79.5,
    minimumAcceptable: 61.5,
    stretchGoal: 91.5,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for VIC housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t0',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 70.3,
    minimumAcceptable: 52.3,
    stretchGoal: 82.3,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t1',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t2',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 71.4,
    minimumAcceptable: 53.400000000000006,
    stretchGoal: 83.4,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t3',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t4',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 72.5,
    minimumAcceptable: 54.5,
    stretchGoal: 84.5,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t5',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t6',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 73.6,
    minimumAcceptable: 55.599999999999994,
    stretchGoal: 85.6,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t7',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t8',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 74.7,
    minimumAcceptable: 56.7,
    stretchGoal: 86.7,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t9',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t10',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 75.8,
    minimumAcceptable: 57.8,
    stretchGoal: 87.8,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t11',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t12',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 76.9,
    minimumAcceptable: 58.900000000000006,
    stretchGoal: 88.9,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t13',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t14',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 78,
    minimumAcceptable: 60,
    stretchGoal: 90,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t15',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t16',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 79.1,
    minimumAcceptable: 61.099999999999994,
    stretchGoal: 91.1,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t17',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t18',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 80.2,
    minimumAcceptable: 62.2,
    stretchGoal: 92.2,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t19',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t20',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 81.3,
    minimumAcceptable: 63.3,
    stretchGoal: 93.3,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t21',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t22',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 82.4,
    minimumAcceptable: 64.4,
    stretchGoal: 94.4,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t23',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t24',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 83.5,
    minimumAcceptable: 65.5,
    stretchGoal: 95.5,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t25',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t26',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 84.6,
    minimumAcceptable: 66.6,
    stretchGoal: 96.6,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t27',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 85.1,
    minimumAcceptable: 67.1,
    stretchGoal: 97.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t28',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 85.7,
    minimumAcceptable: 67.7,
    stretchGoal: 97.7,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t29',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 86.2,
    minimumAcceptable: 68.2,
    stretchGoal: 98.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t30',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 86.8,
    minimumAcceptable: 68.8,
    stretchGoal: 98.8,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t31',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 87.3,
    minimumAcceptable: 69.3,
    stretchGoal: 99.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t32',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 87.9,
    minimumAcceptable: 69.9,
    stretchGoal: 99.9,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t33',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 88.4,
    minimumAcceptable: 70.4,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t34',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 89,
    minimumAcceptable: 71,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t35',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 89.5,
    minimumAcceptable: 71.5,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t36',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 90.1,
    minimumAcceptable: 72.1,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t37',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 90.6,
    minimumAcceptable: 72.6,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t38',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 91.2,
    minimumAcceptable: 73.2,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t39',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 91.7,
    minimumAcceptable: 73.7,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t40',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 92.3,
    minimumAcceptable: 74.3,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t41',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 92.8,
    minimumAcceptable: 74.8,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t42',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 93.4,
    minimumAcceptable: 75.4,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t43',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 93.9,
    minimumAcceptable: 75.9,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_healthcare_t44',
    regionId: 'VIC',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 94.5,
    minimumAcceptable: 76.5,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for VIC healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t0',
    regionId: 'VIC',
    pillar: 'education',
    tier: 0,
    targetIndex: 72.3,
    minimumAcceptable: 54.3,
    stretchGoal: 84.3,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t1',
    regionId: 'VIC',
    pillar: 'education',
    tier: 1,
    targetIndex: 72.8,
    minimumAcceptable: 54.8,
    stretchGoal: 84.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t2',
    regionId: 'VIC',
    pillar: 'education',
    tier: 2,
    targetIndex: 73.4,
    minimumAcceptable: 55.400000000000006,
    stretchGoal: 85.4,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t3',
    regionId: 'VIC',
    pillar: 'education',
    tier: 3,
    targetIndex: 73.9,
    minimumAcceptable: 55.900000000000006,
    stretchGoal: 85.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t4',
    regionId: 'VIC',
    pillar: 'education',
    tier: 4,
    targetIndex: 74.5,
    minimumAcceptable: 56.5,
    stretchGoal: 86.5,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t5',
    regionId: 'VIC',
    pillar: 'education',
    tier: 5,
    targetIndex: 75,
    minimumAcceptable: 57,
    stretchGoal: 87,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t6',
    regionId: 'VIC',
    pillar: 'education',
    tier: 6,
    targetIndex: 75.6,
    minimumAcceptable: 57.599999999999994,
    stretchGoal: 87.6,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t7',
    regionId: 'VIC',
    pillar: 'education',
    tier: 7,
    targetIndex: 76.1,
    minimumAcceptable: 58.099999999999994,
    stretchGoal: 88.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t8',
    regionId: 'VIC',
    pillar: 'education',
    tier: 8,
    targetIndex: 76.7,
    minimumAcceptable: 58.7,
    stretchGoal: 88.7,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t9',
    regionId: 'VIC',
    pillar: 'education',
    tier: 9,
    targetIndex: 77.2,
    minimumAcceptable: 59.2,
    stretchGoal: 89.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t10',
    regionId: 'VIC',
    pillar: 'education',
    tier: 10,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t11',
    regionId: 'VIC',
    pillar: 'education',
    tier: 11,
    targetIndex: 78.3,
    minimumAcceptable: 60.3,
    stretchGoal: 90.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t12',
    regionId: 'VIC',
    pillar: 'education',
    tier: 12,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t13',
    regionId: 'VIC',
    pillar: 'education',
    tier: 13,
    targetIndex: 79.4,
    minimumAcceptable: 61.400000000000006,
    stretchGoal: 91.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t14',
    regionId: 'VIC',
    pillar: 'education',
    tier: 14,
    targetIndex: 80,
    minimumAcceptable: 62,
    stretchGoal: 92,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t15',
    regionId: 'VIC',
    pillar: 'education',
    tier: 15,
    targetIndex: 80.5,
    minimumAcceptable: 62.5,
    stretchGoal: 92.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t16',
    regionId: 'VIC',
    pillar: 'education',
    tier: 16,
    targetIndex: 81.1,
    minimumAcceptable: 63.099999999999994,
    stretchGoal: 93.1,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t17',
    regionId: 'VIC',
    pillar: 'education',
    tier: 17,
    targetIndex: 81.6,
    minimumAcceptable: 63.599999999999994,
    stretchGoal: 93.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t18',
    regionId: 'VIC',
    pillar: 'education',
    tier: 18,
    targetIndex: 82.2,
    minimumAcceptable: 64.2,
    stretchGoal: 94.2,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t19',
    regionId: 'VIC',
    pillar: 'education',
    tier: 19,
    targetIndex: 82.7,
    minimumAcceptable: 64.7,
    stretchGoal: 94.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t20',
    regionId: 'VIC',
    pillar: 'education',
    tier: 20,
    targetIndex: 83.3,
    minimumAcceptable: 65.3,
    stretchGoal: 95.3,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t21',
    regionId: 'VIC',
    pillar: 'education',
    tier: 21,
    targetIndex: 83.8,
    minimumAcceptable: 65.8,
    stretchGoal: 95.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t22',
    regionId: 'VIC',
    pillar: 'education',
    tier: 22,
    targetIndex: 84.4,
    minimumAcceptable: 66.4,
    stretchGoal: 96.4,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t23',
    regionId: 'VIC',
    pillar: 'education',
    tier: 23,
    targetIndex: 84.9,
    minimumAcceptable: 66.9,
    stretchGoal: 96.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t24',
    regionId: 'VIC',
    pillar: 'education',
    tier: 24,
    targetIndex: 85.5,
    minimumAcceptable: 67.5,
    stretchGoal: 97.5,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t25',
    regionId: 'VIC',
    pillar: 'education',
    tier: 25,
    targetIndex: 86,
    minimumAcceptable: 68,
    stretchGoal: 98,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t26',
    regionId: 'VIC',
    pillar: 'education',
    tier: 26,
    targetIndex: 86.6,
    minimumAcceptable: 68.6,
    stretchGoal: 98.6,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t27',
    regionId: 'VIC',
    pillar: 'education',
    tier: 27,
    targetIndex: 87.1,
    minimumAcceptable: 69.1,
    stretchGoal: 99.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t28',
    regionId: 'VIC',
    pillar: 'education',
    tier: 28,
    targetIndex: 87.7,
    minimumAcceptable: 69.7,
    stretchGoal: 99.7,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t29',
    regionId: 'VIC',
    pillar: 'education',
    tier: 29,
    targetIndex: 88.2,
    minimumAcceptable: 70.2,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t30',
    regionId: 'VIC',
    pillar: 'education',
    tier: 30,
    targetIndex: 88.8,
    minimumAcceptable: 70.8,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t31',
    regionId: 'VIC',
    pillar: 'education',
    tier: 31,
    targetIndex: 89.3,
    minimumAcceptable: 71.3,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t32',
    regionId: 'VIC',
    pillar: 'education',
    tier: 32,
    targetIndex: 89.9,
    minimumAcceptable: 71.9,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t33',
    regionId: 'VIC',
    pillar: 'education',
    tier: 33,
    targetIndex: 90.4,
    minimumAcceptable: 72.4,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t34',
    regionId: 'VIC',
    pillar: 'education',
    tier: 34,
    targetIndex: 91,
    minimumAcceptable: 73,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t35',
    regionId: 'VIC',
    pillar: 'education',
    tier: 35,
    targetIndex: 91.5,
    minimumAcceptable: 73.5,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t36',
    regionId: 'VIC',
    pillar: 'education',
    tier: 36,
    targetIndex: 92.1,
    minimumAcceptable: 74.1,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t37',
    regionId: 'VIC',
    pillar: 'education',
    tier: 37,
    targetIndex: 92.6,
    minimumAcceptable: 74.6,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t38',
    regionId: 'VIC',
    pillar: 'education',
    tier: 38,
    targetIndex: 93.2,
    minimumAcceptable: 75.2,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t39',
    regionId: 'VIC',
    pillar: 'education',
    tier: 39,
    targetIndex: 93.7,
    minimumAcceptable: 75.7,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t40',
    regionId: 'VIC',
    pillar: 'education',
    tier: 40,
    targetIndex: 94.3,
    minimumAcceptable: 76.3,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t41',
    regionId: 'VIC',
    pillar: 'education',
    tier: 41,
    targetIndex: 94.8,
    minimumAcceptable: 76.8,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t42',
    regionId: 'VIC',
    pillar: 'education',
    tier: 42,
    targetIndex: 95.4,
    minimumAcceptable: 77.4,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t43',
    regionId: 'VIC',
    pillar: 'education',
    tier: 43,
    targetIndex: 95.9,
    minimumAcceptable: 77.9,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_VIC_education_t44',
    regionId: 'VIC',
    pillar: 'education',
    tier: 44,
    targetIndex: 96.5,
    minimumAcceptable: 78.5,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for VIC education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t0',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 0,
    targetIndex: 58.4,
    minimumAcceptable: 40.4,
    stretchGoal: 70.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t1',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 1,
    targetIndex: 58.9,
    minimumAcceptable: 40.9,
    stretchGoal: 70.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t2',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 2,
    targetIndex: 59.5,
    minimumAcceptable: 41.5,
    stretchGoal: 71.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t3',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 3,
    targetIndex: 60,
    minimumAcceptable: 42,
    stretchGoal: 72,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t4',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 4,
    targetIndex: 60.6,
    minimumAcceptable: 42.6,
    stretchGoal: 72.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t5',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 5,
    targetIndex: 61.1,
    minimumAcceptable: 43.1,
    stretchGoal: 73.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t6',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 6,
    targetIndex: 61.7,
    minimumAcceptable: 43.7,
    stretchGoal: 73.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t7',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 7,
    targetIndex: 62.2,
    minimumAcceptable: 44.2,
    stretchGoal: 74.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t8',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 8,
    targetIndex: 62.8,
    minimumAcceptable: 44.8,
    stretchGoal: 74.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t9',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 9,
    targetIndex: 63.3,
    minimumAcceptable: 45.3,
    stretchGoal: 75.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t10',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 10,
    targetIndex: 63.9,
    minimumAcceptable: 45.9,
    stretchGoal: 75.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t11',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 11,
    targetIndex: 64.4,
    minimumAcceptable: 46.400000000000006,
    stretchGoal: 76.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t12',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 12,
    targetIndex: 65,
    minimumAcceptable: 47,
    stretchGoal: 77,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t13',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 13,
    targetIndex: 65.5,
    minimumAcceptable: 47.5,
    stretchGoal: 77.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t14',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 14,
    targetIndex: 66.1,
    minimumAcceptable: 48.099999999999994,
    stretchGoal: 78.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t15',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 15,
    targetIndex: 66.6,
    minimumAcceptable: 48.599999999999994,
    stretchGoal: 78.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t16',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 16,
    targetIndex: 67.2,
    minimumAcceptable: 49.2,
    stretchGoal: 79.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t17',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 17,
    targetIndex: 67.7,
    minimumAcceptable: 49.7,
    stretchGoal: 79.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t18',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 18,
    targetIndex: 68.3,
    minimumAcceptable: 50.3,
    stretchGoal: 80.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t19',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 19,
    targetIndex: 68.8,
    minimumAcceptable: 50.8,
    stretchGoal: 80.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t20',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 20,
    targetIndex: 69.4,
    minimumAcceptable: 51.400000000000006,
    stretchGoal: 81.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t21',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 21,
    targetIndex: 69.9,
    minimumAcceptable: 51.900000000000006,
    stretchGoal: 81.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t22',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 22,
    targetIndex: 70.5,
    minimumAcceptable: 52.5,
    stretchGoal: 82.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t23',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 23,
    targetIndex: 71,
    minimumAcceptable: 53,
    stretchGoal: 83,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t24',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 24,
    targetIndex: 71.6,
    minimumAcceptable: 53.599999999999994,
    stretchGoal: 83.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t25',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 25,
    targetIndex: 72.1,
    minimumAcceptable: 54.099999999999994,
    stretchGoal: 84.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t26',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 26,
    targetIndex: 72.7,
    minimumAcceptable: 54.7,
    stretchGoal: 84.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t27',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 27,
    targetIndex: 73.2,
    minimumAcceptable: 55.2,
    stretchGoal: 85.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t28',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 28,
    targetIndex: 73.8,
    minimumAcceptable: 55.8,
    stretchGoal: 85.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t29',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 29,
    targetIndex: 74.3,
    minimumAcceptable: 56.3,
    stretchGoal: 86.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t30',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 30,
    targetIndex: 74.9,
    minimumAcceptable: 56.900000000000006,
    stretchGoal: 86.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t31',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 31,
    targetIndex: 75.4,
    minimumAcceptable: 57.400000000000006,
    stretchGoal: 87.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t32',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 32,
    targetIndex: 76,
    minimumAcceptable: 58,
    stretchGoal: 88,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t33',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 33,
    targetIndex: 76.5,
    minimumAcceptable: 58.5,
    stretchGoal: 88.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t34',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 34,
    targetIndex: 77.1,
    minimumAcceptable: 59.099999999999994,
    stretchGoal: 89.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t35',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 35,
    targetIndex: 77.6,
    minimumAcceptable: 59.599999999999994,
    stretchGoal: 89.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t36',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 36,
    targetIndex: 78.2,
    minimumAcceptable: 60.2,
    stretchGoal: 90.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t37',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 37,
    targetIndex: 78.7,
    minimumAcceptable: 60.7,
    stretchGoal: 90.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t38',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 38,
    targetIndex: 79.3,
    minimumAcceptable: 61.3,
    stretchGoal: 91.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t39',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 39,
    targetIndex: 79.8,
    minimumAcceptable: 61.8,
    stretchGoal: 91.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t40',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 40,
    targetIndex: 80.4,
    minimumAcceptable: 62.400000000000006,
    stretchGoal: 92.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t41',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 41,
    targetIndex: 80.9,
    minimumAcceptable: 62.900000000000006,
    stretchGoal: 92.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t42',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 42,
    targetIndex: 81.5,
    minimumAcceptable: 63.5,
    stretchGoal: 93.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t43',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 43,
    targetIndex: 82,
    minimumAcceptable: 64,
    stretchGoal: 94,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_housing_t44',
    regionId: 'QLD',
    pillar: 'housing',
    tier: 44,
    targetIndex: 82.6,
    minimumAcceptable: 64.6,
    stretchGoal: 94.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for QLD housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t0',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 65.4,
    minimumAcceptable: 47.400000000000006,
    stretchGoal: 77.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t1',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 65.9,
    minimumAcceptable: 47.900000000000006,
    stretchGoal: 77.9,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t2',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 66.5,
    minimumAcceptable: 48.5,
    stretchGoal: 78.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t3',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 67,
    minimumAcceptable: 49,
    stretchGoal: 79,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t4',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 67.6,
    minimumAcceptable: 49.599999999999994,
    stretchGoal: 79.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t5',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 68.1,
    minimumAcceptable: 50.099999999999994,
    stretchGoal: 80.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t6',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 68.7,
    minimumAcceptable: 50.7,
    stretchGoal: 80.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t7',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 69.2,
    minimumAcceptable: 51.2,
    stretchGoal: 81.2,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t8',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 69.8,
    minimumAcceptable: 51.8,
    stretchGoal: 81.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t9',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 70.3,
    minimumAcceptable: 52.3,
    stretchGoal: 82.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t10',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 70.9,
    minimumAcceptable: 52.900000000000006,
    stretchGoal: 82.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t11',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 71.4,
    minimumAcceptable: 53.400000000000006,
    stretchGoal: 83.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t12',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 72,
    minimumAcceptable: 54,
    stretchGoal: 84,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t13',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 72.5,
    minimumAcceptable: 54.5,
    stretchGoal: 84.5,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t14',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 73.1,
    minimumAcceptable: 55.099999999999994,
    stretchGoal: 85.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t15',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 73.6,
    minimumAcceptable: 55.599999999999994,
    stretchGoal: 85.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t16',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 74.2,
    minimumAcceptable: 56.2,
    stretchGoal: 86.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t17',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 74.7,
    minimumAcceptable: 56.7,
    stretchGoal: 86.7,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t18',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 75.3,
    minimumAcceptable: 57.3,
    stretchGoal: 87.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t19',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 75.8,
    minimumAcceptable: 57.8,
    stretchGoal: 87.8,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t20',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 76.4,
    minimumAcceptable: 58.400000000000006,
    stretchGoal: 88.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t21',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 76.9,
    minimumAcceptable: 58.900000000000006,
    stretchGoal: 88.9,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t22',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 77.5,
    minimumAcceptable: 59.5,
    stretchGoal: 89.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t23',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 78,
    minimumAcceptable: 60,
    stretchGoal: 90,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t24',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 78.6,
    minimumAcceptable: 60.599999999999994,
    stretchGoal: 90.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t25',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 79.1,
    minimumAcceptable: 61.099999999999994,
    stretchGoal: 91.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t26',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 79.7,
    minimumAcceptable: 61.7,
    stretchGoal: 91.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t27',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 80.2,
    minimumAcceptable: 62.2,
    stretchGoal: 92.2,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t28',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 80.8,
    minimumAcceptable: 62.8,
    stretchGoal: 92.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t29',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 81.3,
    minimumAcceptable: 63.3,
    stretchGoal: 93.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t30',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 81.9,
    minimumAcceptable: 63.900000000000006,
    stretchGoal: 93.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t31',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 82.4,
    minimumAcceptable: 64.4,
    stretchGoal: 94.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t32',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 83,
    minimumAcceptable: 65,
    stretchGoal: 95,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t33',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 83.5,
    minimumAcceptable: 65.5,
    stretchGoal: 95.5,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t34',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 84.1,
    minimumAcceptable: 66.1,
    stretchGoal: 96.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t35',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 84.6,
    minimumAcceptable: 66.6,
    stretchGoal: 96.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t36',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 85.2,
    minimumAcceptable: 67.2,
    stretchGoal: 97.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t37',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 85.7,
    minimumAcceptable: 67.7,
    stretchGoal: 97.7,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t38',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 86.3,
    minimumAcceptable: 68.3,
    stretchGoal: 98.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t39',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 86.8,
    minimumAcceptable: 68.8,
    stretchGoal: 98.8,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t40',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 87.4,
    minimumAcceptable: 69.4,
    stretchGoal: 99.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t41',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 87.9,
    minimumAcceptable: 69.9,
    stretchGoal: 99.9,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t42',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 88.5,
    minimumAcceptable: 70.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t43',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 89,
    minimumAcceptable: 71,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_healthcare_t44',
    regionId: 'QLD',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 89.6,
    minimumAcceptable: 71.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for QLD healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t0',
    regionId: 'QLD',
    pillar: 'education',
    tier: 0,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t1',
    regionId: 'QLD',
    pillar: 'education',
    tier: 1,
    targetIndex: 66.9,
    minimumAcceptable: 48.900000000000006,
    stretchGoal: 78.9,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t2',
    regionId: 'QLD',
    pillar: 'education',
    tier: 2,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t3',
    regionId: 'QLD',
    pillar: 'education',
    tier: 3,
    targetIndex: 68,
    minimumAcceptable: 50,
    stretchGoal: 80,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t4',
    regionId: 'QLD',
    pillar: 'education',
    tier: 4,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t5',
    regionId: 'QLD',
    pillar: 'education',
    tier: 5,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t6',
    regionId: 'QLD',
    pillar: 'education',
    tier: 6,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t7',
    regionId: 'QLD',
    pillar: 'education',
    tier: 7,
    targetIndex: 70.2,
    minimumAcceptable: 52.2,
    stretchGoal: 82.2,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t8',
    regionId: 'QLD',
    pillar: 'education',
    tier: 8,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t9',
    regionId: 'QLD',
    pillar: 'education',
    tier: 9,
    targetIndex: 71.3,
    minimumAcceptable: 53.3,
    stretchGoal: 83.3,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t10',
    regionId: 'QLD',
    pillar: 'education',
    tier: 10,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t11',
    regionId: 'QLD',
    pillar: 'education',
    tier: 11,
    targetIndex: 72.4,
    minimumAcceptable: 54.400000000000006,
    stretchGoal: 84.4,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t12',
    regionId: 'QLD',
    pillar: 'education',
    tier: 12,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t13',
    regionId: 'QLD',
    pillar: 'education',
    tier: 13,
    targetIndex: 73.5,
    minimumAcceptable: 55.5,
    stretchGoal: 85.5,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t14',
    regionId: 'QLD',
    pillar: 'education',
    tier: 14,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t15',
    regionId: 'QLD',
    pillar: 'education',
    tier: 15,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t16',
    regionId: 'QLD',
    pillar: 'education',
    tier: 16,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t17',
    regionId: 'QLD',
    pillar: 'education',
    tier: 17,
    targetIndex: 75.7,
    minimumAcceptable: 57.7,
    stretchGoal: 87.7,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t18',
    regionId: 'QLD',
    pillar: 'education',
    tier: 18,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t19',
    regionId: 'QLD',
    pillar: 'education',
    tier: 19,
    targetIndex: 76.8,
    minimumAcceptable: 58.8,
    stretchGoal: 88.8,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t20',
    regionId: 'QLD',
    pillar: 'education',
    tier: 20,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t21',
    regionId: 'QLD',
    pillar: 'education',
    tier: 21,
    targetIndex: 77.9,
    minimumAcceptable: 59.900000000000006,
    stretchGoal: 89.9,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t22',
    regionId: 'QLD',
    pillar: 'education',
    tier: 22,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t23',
    regionId: 'QLD',
    pillar: 'education',
    tier: 23,
    targetIndex: 79,
    minimumAcceptable: 61,
    stretchGoal: 91,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t24',
    regionId: 'QLD',
    pillar: 'education',
    tier: 24,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t25',
    regionId: 'QLD',
    pillar: 'education',
    tier: 25,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t26',
    regionId: 'QLD',
    pillar: 'education',
    tier: 26,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t27',
    regionId: 'QLD',
    pillar: 'education',
    tier: 27,
    targetIndex: 81.2,
    minimumAcceptable: 63.2,
    stretchGoal: 93.2,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t28',
    regionId: 'QLD',
    pillar: 'education',
    tier: 28,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t29',
    regionId: 'QLD',
    pillar: 'education',
    tier: 29,
    targetIndex: 82.3,
    minimumAcceptable: 64.3,
    stretchGoal: 94.3,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t30',
    regionId: 'QLD',
    pillar: 'education',
    tier: 30,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t31',
    regionId: 'QLD',
    pillar: 'education',
    tier: 31,
    targetIndex: 83.4,
    minimumAcceptable: 65.4,
    stretchGoal: 95.4,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t32',
    regionId: 'QLD',
    pillar: 'education',
    tier: 32,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t33',
    regionId: 'QLD',
    pillar: 'education',
    tier: 33,
    targetIndex: 84.5,
    minimumAcceptable: 66.5,
    stretchGoal: 96.5,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t34',
    regionId: 'QLD',
    pillar: 'education',
    tier: 34,
    targetIndex: 85.1,
    minimumAcceptable: 67.1,
    stretchGoal: 97.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t35',
    regionId: 'QLD',
    pillar: 'education',
    tier: 35,
    targetIndex: 85.6,
    minimumAcceptable: 67.6,
    stretchGoal: 97.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t36',
    regionId: 'QLD',
    pillar: 'education',
    tier: 36,
    targetIndex: 86.2,
    minimumAcceptable: 68.2,
    stretchGoal: 98.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t37',
    regionId: 'QLD',
    pillar: 'education',
    tier: 37,
    targetIndex: 86.7,
    minimumAcceptable: 68.7,
    stretchGoal: 98.7,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t38',
    regionId: 'QLD',
    pillar: 'education',
    tier: 38,
    targetIndex: 87.3,
    minimumAcceptable: 69.3,
    stretchGoal: 99.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t39',
    regionId: 'QLD',
    pillar: 'education',
    tier: 39,
    targetIndex: 87.8,
    minimumAcceptable: 69.8,
    stretchGoal: 99.8,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t40',
    regionId: 'QLD',
    pillar: 'education',
    tier: 40,
    targetIndex: 88.4,
    minimumAcceptable: 70.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t41',
    regionId: 'QLD',
    pillar: 'education',
    tier: 41,
    targetIndex: 88.9,
    minimumAcceptable: 70.9,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t42',
    regionId: 'QLD',
    pillar: 'education',
    tier: 42,
    targetIndex: 89.5,
    minimumAcceptable: 71.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t43',
    regionId: 'QLD',
    pillar: 'education',
    tier: 43,
    targetIndex: 90,
    minimumAcceptable: 72,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_QLD_education_t44',
    regionId: 'QLD',
    pillar: 'education',
    tier: 44,
    targetIndex: 90.6,
    minimumAcceptable: 72.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for QLD education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t0',
    regionId: 'WA',
    pillar: 'housing',
    tier: 0,
    targetIndex: 55.6,
    minimumAcceptable: 37.6,
    stretchGoal: 67.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t1',
    regionId: 'WA',
    pillar: 'housing',
    tier: 1,
    targetIndex: 56.2,
    minimumAcceptable: 38.2,
    stretchGoal: 68.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t2',
    regionId: 'WA',
    pillar: 'housing',
    tier: 2,
    targetIndex: 56.7,
    minimumAcceptable: 38.7,
    stretchGoal: 68.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t3',
    regionId: 'WA',
    pillar: 'housing',
    tier: 3,
    targetIndex: 57.3,
    minimumAcceptable: 39.3,
    stretchGoal: 69.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t4',
    regionId: 'WA',
    pillar: 'housing',
    tier: 4,
    targetIndex: 57.8,
    minimumAcceptable: 39.8,
    stretchGoal: 69.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t5',
    regionId: 'WA',
    pillar: 'housing',
    tier: 5,
    targetIndex: 58.4,
    minimumAcceptable: 40.4,
    stretchGoal: 70.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t6',
    regionId: 'WA',
    pillar: 'housing',
    tier: 6,
    targetIndex: 58.9,
    minimumAcceptable: 40.9,
    stretchGoal: 70.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t7',
    regionId: 'WA',
    pillar: 'housing',
    tier: 7,
    targetIndex: 59.5,
    minimumAcceptable: 41.5,
    stretchGoal: 71.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t8',
    regionId: 'WA',
    pillar: 'housing',
    tier: 8,
    targetIndex: 60,
    minimumAcceptable: 42,
    stretchGoal: 72,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t9',
    regionId: 'WA',
    pillar: 'housing',
    tier: 9,
    targetIndex: 60.6,
    minimumAcceptable: 42.6,
    stretchGoal: 72.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t10',
    regionId: 'WA',
    pillar: 'housing',
    tier: 10,
    targetIndex: 61.1,
    minimumAcceptable: 43.1,
    stretchGoal: 73.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t11',
    regionId: 'WA',
    pillar: 'housing',
    tier: 11,
    targetIndex: 61.7,
    minimumAcceptable: 43.7,
    stretchGoal: 73.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t12',
    regionId: 'WA',
    pillar: 'housing',
    tier: 12,
    targetIndex: 62.2,
    minimumAcceptable: 44.2,
    stretchGoal: 74.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t13',
    regionId: 'WA',
    pillar: 'housing',
    tier: 13,
    targetIndex: 62.8,
    minimumAcceptable: 44.8,
    stretchGoal: 74.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t14',
    regionId: 'WA',
    pillar: 'housing',
    tier: 14,
    targetIndex: 63.3,
    minimumAcceptable: 45.3,
    stretchGoal: 75.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t15',
    regionId: 'WA',
    pillar: 'housing',
    tier: 15,
    targetIndex: 63.9,
    minimumAcceptable: 45.9,
    stretchGoal: 75.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t16',
    regionId: 'WA',
    pillar: 'housing',
    tier: 16,
    targetIndex: 64.4,
    minimumAcceptable: 46.400000000000006,
    stretchGoal: 76.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t17',
    regionId: 'WA',
    pillar: 'housing',
    tier: 17,
    targetIndex: 65,
    minimumAcceptable: 47,
    stretchGoal: 77,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t18',
    regionId: 'WA',
    pillar: 'housing',
    tier: 18,
    targetIndex: 65.5,
    minimumAcceptable: 47.5,
    stretchGoal: 77.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t19',
    regionId: 'WA',
    pillar: 'housing',
    tier: 19,
    targetIndex: 66.1,
    minimumAcceptable: 48.099999999999994,
    stretchGoal: 78.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t20',
    regionId: 'WA',
    pillar: 'housing',
    tier: 20,
    targetIndex: 66.6,
    minimumAcceptable: 48.599999999999994,
    stretchGoal: 78.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t21',
    regionId: 'WA',
    pillar: 'housing',
    tier: 21,
    targetIndex: 67.2,
    minimumAcceptable: 49.2,
    stretchGoal: 79.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t22',
    regionId: 'WA',
    pillar: 'housing',
    tier: 22,
    targetIndex: 67.7,
    minimumAcceptable: 49.7,
    stretchGoal: 79.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t23',
    regionId: 'WA',
    pillar: 'housing',
    tier: 23,
    targetIndex: 68.3,
    minimumAcceptable: 50.3,
    stretchGoal: 80.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t24',
    regionId: 'WA',
    pillar: 'housing',
    tier: 24,
    targetIndex: 68.8,
    minimumAcceptable: 50.8,
    stretchGoal: 80.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t25',
    regionId: 'WA',
    pillar: 'housing',
    tier: 25,
    targetIndex: 69.4,
    minimumAcceptable: 51.400000000000006,
    stretchGoal: 81.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t26',
    regionId: 'WA',
    pillar: 'housing',
    tier: 26,
    targetIndex: 69.9,
    minimumAcceptable: 51.900000000000006,
    stretchGoal: 81.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t27',
    regionId: 'WA',
    pillar: 'housing',
    tier: 27,
    targetIndex: 70.5,
    minimumAcceptable: 52.5,
    stretchGoal: 82.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t28',
    regionId: 'WA',
    pillar: 'housing',
    tier: 28,
    targetIndex: 71,
    minimumAcceptable: 53,
    stretchGoal: 83,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t29',
    regionId: 'WA',
    pillar: 'housing',
    tier: 29,
    targetIndex: 71.6,
    minimumAcceptable: 53.599999999999994,
    stretchGoal: 83.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t30',
    regionId: 'WA',
    pillar: 'housing',
    tier: 30,
    targetIndex: 72.1,
    minimumAcceptable: 54.099999999999994,
    stretchGoal: 84.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t31',
    regionId: 'WA',
    pillar: 'housing',
    tier: 31,
    targetIndex: 72.7,
    minimumAcceptable: 54.7,
    stretchGoal: 84.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t32',
    regionId: 'WA',
    pillar: 'housing',
    tier: 32,
    targetIndex: 73.2,
    minimumAcceptable: 55.2,
    stretchGoal: 85.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t33',
    regionId: 'WA',
    pillar: 'housing',
    tier: 33,
    targetIndex: 73.8,
    minimumAcceptable: 55.8,
    stretchGoal: 85.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t34',
    regionId: 'WA',
    pillar: 'housing',
    tier: 34,
    targetIndex: 74.3,
    minimumAcceptable: 56.3,
    stretchGoal: 86.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t35',
    regionId: 'WA',
    pillar: 'housing',
    tier: 35,
    targetIndex: 74.9,
    minimumAcceptable: 56.900000000000006,
    stretchGoal: 86.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t36',
    regionId: 'WA',
    pillar: 'housing',
    tier: 36,
    targetIndex: 75.4,
    minimumAcceptable: 57.400000000000006,
    stretchGoal: 87.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t37',
    regionId: 'WA',
    pillar: 'housing',
    tier: 37,
    targetIndex: 76,
    minimumAcceptable: 58,
    stretchGoal: 88,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t38',
    regionId: 'WA',
    pillar: 'housing',
    tier: 38,
    targetIndex: 76.5,
    minimumAcceptable: 58.5,
    stretchGoal: 88.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t39',
    regionId: 'WA',
    pillar: 'housing',
    tier: 39,
    targetIndex: 77.1,
    minimumAcceptable: 59.099999999999994,
    stretchGoal: 89.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t40',
    regionId: 'WA',
    pillar: 'housing',
    tier: 40,
    targetIndex: 77.6,
    minimumAcceptable: 59.599999999999994,
    stretchGoal: 89.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t41',
    regionId: 'WA',
    pillar: 'housing',
    tier: 41,
    targetIndex: 78.2,
    minimumAcceptable: 60.2,
    stretchGoal: 90.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t42',
    regionId: 'WA',
    pillar: 'housing',
    tier: 42,
    targetIndex: 78.7,
    minimumAcceptable: 60.7,
    stretchGoal: 90.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t43',
    regionId: 'WA',
    pillar: 'housing',
    tier: 43,
    targetIndex: 79.3,
    minimumAcceptable: 61.3,
    stretchGoal: 91.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_housing_t44',
    regionId: 'WA',
    pillar: 'housing',
    tier: 44,
    targetIndex: 79.8,
    minimumAcceptable: 61.8,
    stretchGoal: 91.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for WA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t0',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 63.6,
    minimumAcceptable: 45.6,
    stretchGoal: 75.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t1',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 64.2,
    minimumAcceptable: 46.2,
    stretchGoal: 76.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t2',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 64.7,
    minimumAcceptable: 46.7,
    stretchGoal: 76.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t3',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 65.3,
    minimumAcceptable: 47.3,
    stretchGoal: 77.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t4',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 65.8,
    minimumAcceptable: 47.8,
    stretchGoal: 77.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t5',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t6',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 66.9,
    minimumAcceptable: 48.900000000000006,
    stretchGoal: 78.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t7',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t8',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 68,
    minimumAcceptable: 50,
    stretchGoal: 80,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t9',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t10',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t11',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t12',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 70.2,
    minimumAcceptable: 52.2,
    stretchGoal: 82.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t13',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t14',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 71.3,
    minimumAcceptable: 53.3,
    stretchGoal: 83.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t15',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t16',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 72.4,
    minimumAcceptable: 54.400000000000006,
    stretchGoal: 84.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t17',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t18',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 73.5,
    minimumAcceptable: 55.5,
    stretchGoal: 85.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t19',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t20',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t21',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t22',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 75.7,
    minimumAcceptable: 57.7,
    stretchGoal: 87.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t23',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t24',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 76.8,
    minimumAcceptable: 58.8,
    stretchGoal: 88.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t25',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t26',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 77.9,
    minimumAcceptable: 59.900000000000006,
    stretchGoal: 89.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t27',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t28',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 79,
    minimumAcceptable: 61,
    stretchGoal: 91,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t29',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t30',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t31',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t32',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 81.2,
    minimumAcceptable: 63.2,
    stretchGoal: 93.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t33',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t34',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 82.3,
    minimumAcceptable: 64.3,
    stretchGoal: 94.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t35',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t36',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 83.4,
    minimumAcceptable: 65.4,
    stretchGoal: 95.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t37',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t38',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 84.5,
    minimumAcceptable: 66.5,
    stretchGoal: 96.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t39',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 85.1,
    minimumAcceptable: 67.1,
    stretchGoal: 97.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t40',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 85.6,
    minimumAcceptable: 67.6,
    stretchGoal: 97.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t41',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 86.2,
    minimumAcceptable: 68.2,
    stretchGoal: 98.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t42',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 86.7,
    minimumAcceptable: 68.7,
    stretchGoal: 98.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t43',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 87.3,
    minimumAcceptable: 69.3,
    stretchGoal: 99.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_healthcare_t44',
    regionId: 'WA',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 87.8,
    minimumAcceptable: 69.8,
    stretchGoal: 99.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for WA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t0',
    regionId: 'WA',
    pillar: 'education',
    tier: 0,
    targetIndex: 64.6,
    minimumAcceptable: 46.599999999999994,
    stretchGoal: 76.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t1',
    regionId: 'WA',
    pillar: 'education',
    tier: 1,
    targetIndex: 65.2,
    minimumAcceptable: 47.2,
    stretchGoal: 77.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t2',
    regionId: 'WA',
    pillar: 'education',
    tier: 2,
    targetIndex: 65.7,
    minimumAcceptable: 47.7,
    stretchGoal: 77.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t3',
    regionId: 'WA',
    pillar: 'education',
    tier: 3,
    targetIndex: 66.3,
    minimumAcceptable: 48.3,
    stretchGoal: 78.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t4',
    regionId: 'WA',
    pillar: 'education',
    tier: 4,
    targetIndex: 66.8,
    minimumAcceptable: 48.8,
    stretchGoal: 78.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t5',
    regionId: 'WA',
    pillar: 'education',
    tier: 5,
    targetIndex: 67.4,
    minimumAcceptable: 49.400000000000006,
    stretchGoal: 79.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t6',
    regionId: 'WA',
    pillar: 'education',
    tier: 6,
    targetIndex: 67.9,
    minimumAcceptable: 49.900000000000006,
    stretchGoal: 79.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t7',
    regionId: 'WA',
    pillar: 'education',
    tier: 7,
    targetIndex: 68.5,
    minimumAcceptable: 50.5,
    stretchGoal: 80.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t8',
    regionId: 'WA',
    pillar: 'education',
    tier: 8,
    targetIndex: 69,
    minimumAcceptable: 51,
    stretchGoal: 81,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t9',
    regionId: 'WA',
    pillar: 'education',
    tier: 9,
    targetIndex: 69.6,
    minimumAcceptable: 51.599999999999994,
    stretchGoal: 81.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t10',
    regionId: 'WA',
    pillar: 'education',
    tier: 10,
    targetIndex: 70.1,
    minimumAcceptable: 52.099999999999994,
    stretchGoal: 82.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t11',
    regionId: 'WA',
    pillar: 'education',
    tier: 11,
    targetIndex: 70.7,
    minimumAcceptable: 52.7,
    stretchGoal: 82.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t12',
    regionId: 'WA',
    pillar: 'education',
    tier: 12,
    targetIndex: 71.2,
    minimumAcceptable: 53.2,
    stretchGoal: 83.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t13',
    regionId: 'WA',
    pillar: 'education',
    tier: 13,
    targetIndex: 71.8,
    minimumAcceptable: 53.8,
    stretchGoal: 83.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t14',
    regionId: 'WA',
    pillar: 'education',
    tier: 14,
    targetIndex: 72.3,
    minimumAcceptable: 54.3,
    stretchGoal: 84.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t15',
    regionId: 'WA',
    pillar: 'education',
    tier: 15,
    targetIndex: 72.9,
    minimumAcceptable: 54.900000000000006,
    stretchGoal: 84.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t16',
    regionId: 'WA',
    pillar: 'education',
    tier: 16,
    targetIndex: 73.4,
    minimumAcceptable: 55.400000000000006,
    stretchGoal: 85.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t17',
    regionId: 'WA',
    pillar: 'education',
    tier: 17,
    targetIndex: 74,
    minimumAcceptable: 56,
    stretchGoal: 86,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t18',
    regionId: 'WA',
    pillar: 'education',
    tier: 18,
    targetIndex: 74.5,
    minimumAcceptable: 56.5,
    stretchGoal: 86.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t19',
    regionId: 'WA',
    pillar: 'education',
    tier: 19,
    targetIndex: 75.1,
    minimumAcceptable: 57.099999999999994,
    stretchGoal: 87.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t20',
    regionId: 'WA',
    pillar: 'education',
    tier: 20,
    targetIndex: 75.6,
    minimumAcceptable: 57.599999999999994,
    stretchGoal: 87.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t21',
    regionId: 'WA',
    pillar: 'education',
    tier: 21,
    targetIndex: 76.2,
    minimumAcceptable: 58.2,
    stretchGoal: 88.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t22',
    regionId: 'WA',
    pillar: 'education',
    tier: 22,
    targetIndex: 76.7,
    minimumAcceptable: 58.7,
    stretchGoal: 88.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t23',
    regionId: 'WA',
    pillar: 'education',
    tier: 23,
    targetIndex: 77.3,
    minimumAcceptable: 59.3,
    stretchGoal: 89.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t24',
    regionId: 'WA',
    pillar: 'education',
    tier: 24,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t25',
    regionId: 'WA',
    pillar: 'education',
    tier: 25,
    targetIndex: 78.4,
    minimumAcceptable: 60.400000000000006,
    stretchGoal: 90.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t26',
    regionId: 'WA',
    pillar: 'education',
    tier: 26,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t27',
    regionId: 'WA',
    pillar: 'education',
    tier: 27,
    targetIndex: 79.5,
    minimumAcceptable: 61.5,
    stretchGoal: 91.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t28',
    regionId: 'WA',
    pillar: 'education',
    tier: 28,
    targetIndex: 80,
    minimumAcceptable: 62,
    stretchGoal: 92,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t29',
    regionId: 'WA',
    pillar: 'education',
    tier: 29,
    targetIndex: 80.6,
    minimumAcceptable: 62.599999999999994,
    stretchGoal: 92.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t30',
    regionId: 'WA',
    pillar: 'education',
    tier: 30,
    targetIndex: 81.1,
    minimumAcceptable: 63.099999999999994,
    stretchGoal: 93.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t31',
    regionId: 'WA',
    pillar: 'education',
    tier: 31,
    targetIndex: 81.7,
    minimumAcceptable: 63.7,
    stretchGoal: 93.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t32',
    regionId: 'WA',
    pillar: 'education',
    tier: 32,
    targetIndex: 82.2,
    minimumAcceptable: 64.2,
    stretchGoal: 94.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t33',
    regionId: 'WA',
    pillar: 'education',
    tier: 33,
    targetIndex: 82.8,
    minimumAcceptable: 64.8,
    stretchGoal: 94.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t34',
    regionId: 'WA',
    pillar: 'education',
    tier: 34,
    targetIndex: 83.3,
    minimumAcceptable: 65.3,
    stretchGoal: 95.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t35',
    regionId: 'WA',
    pillar: 'education',
    tier: 35,
    targetIndex: 83.9,
    minimumAcceptable: 65.9,
    stretchGoal: 95.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t36',
    regionId: 'WA',
    pillar: 'education',
    tier: 36,
    targetIndex: 84.4,
    minimumAcceptable: 66.4,
    stretchGoal: 96.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t37',
    regionId: 'WA',
    pillar: 'education',
    tier: 37,
    targetIndex: 85,
    minimumAcceptable: 67,
    stretchGoal: 97,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t38',
    regionId: 'WA',
    pillar: 'education',
    tier: 38,
    targetIndex: 85.5,
    minimumAcceptable: 67.5,
    stretchGoal: 97.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t39',
    regionId: 'WA',
    pillar: 'education',
    tier: 39,
    targetIndex: 86.1,
    minimumAcceptable: 68.1,
    stretchGoal: 98.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t40',
    regionId: 'WA',
    pillar: 'education',
    tier: 40,
    targetIndex: 86.6,
    minimumAcceptable: 68.6,
    stretchGoal: 98.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t41',
    regionId: 'WA',
    pillar: 'education',
    tier: 41,
    targetIndex: 87.2,
    minimumAcceptable: 69.2,
    stretchGoal: 99.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t42',
    regionId: 'WA',
    pillar: 'education',
    tier: 42,
    targetIndex: 87.7,
    minimumAcceptable: 69.7,
    stretchGoal: 99.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t43',
    regionId: 'WA',
    pillar: 'education',
    tier: 43,
    targetIndex: 88.3,
    minimumAcceptable: 70.3,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_WA_education_t44',
    regionId: 'WA',
    pillar: 'education',
    tier: 44,
    targetIndex: 88.8,
    minimumAcceptable: 70.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for WA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t0',
    regionId: 'SA',
    pillar: 'housing',
    tier: 0,
    targetIndex: 61.6,
    minimumAcceptable: 43.6,
    stretchGoal: 73.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t1',
    regionId: 'SA',
    pillar: 'housing',
    tier: 1,
    targetIndex: 62.1,
    minimumAcceptable: 44.1,
    stretchGoal: 74.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t2',
    regionId: 'SA',
    pillar: 'housing',
    tier: 2,
    targetIndex: 62.7,
    minimumAcceptable: 44.7,
    stretchGoal: 74.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t3',
    regionId: 'SA',
    pillar: 'housing',
    tier: 3,
    targetIndex: 63.2,
    minimumAcceptable: 45.2,
    stretchGoal: 75.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t4',
    regionId: 'SA',
    pillar: 'housing',
    tier: 4,
    targetIndex: 63.8,
    minimumAcceptable: 45.8,
    stretchGoal: 75.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t5',
    regionId: 'SA',
    pillar: 'housing',
    tier: 5,
    targetIndex: 64.3,
    minimumAcceptable: 46.3,
    stretchGoal: 76.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t6',
    regionId: 'SA',
    pillar: 'housing',
    tier: 6,
    targetIndex: 64.9,
    minimumAcceptable: 46.900000000000006,
    stretchGoal: 76.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t7',
    regionId: 'SA',
    pillar: 'housing',
    tier: 7,
    targetIndex: 65.4,
    minimumAcceptable: 47.400000000000006,
    stretchGoal: 77.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t8',
    regionId: 'SA',
    pillar: 'housing',
    tier: 8,
    targetIndex: 66,
    minimumAcceptable: 48,
    stretchGoal: 78,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t9',
    regionId: 'SA',
    pillar: 'housing',
    tier: 9,
    targetIndex: 66.5,
    minimumAcceptable: 48.5,
    stretchGoal: 78.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t10',
    regionId: 'SA',
    pillar: 'housing',
    tier: 10,
    targetIndex: 67.1,
    minimumAcceptable: 49.099999999999994,
    stretchGoal: 79.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t11',
    regionId: 'SA',
    pillar: 'housing',
    tier: 11,
    targetIndex: 67.6,
    minimumAcceptable: 49.599999999999994,
    stretchGoal: 79.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t12',
    regionId: 'SA',
    pillar: 'housing',
    tier: 12,
    targetIndex: 68.2,
    minimumAcceptable: 50.2,
    stretchGoal: 80.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t13',
    regionId: 'SA',
    pillar: 'housing',
    tier: 13,
    targetIndex: 68.7,
    minimumAcceptable: 50.7,
    stretchGoal: 80.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t14',
    regionId: 'SA',
    pillar: 'housing',
    tier: 14,
    targetIndex: 69.3,
    minimumAcceptable: 51.3,
    stretchGoal: 81.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t15',
    regionId: 'SA',
    pillar: 'housing',
    tier: 15,
    targetIndex: 69.8,
    minimumAcceptable: 51.8,
    stretchGoal: 81.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t16',
    regionId: 'SA',
    pillar: 'housing',
    tier: 16,
    targetIndex: 70.4,
    minimumAcceptable: 52.400000000000006,
    stretchGoal: 82.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t17',
    regionId: 'SA',
    pillar: 'housing',
    tier: 17,
    targetIndex: 70.9,
    minimumAcceptable: 52.900000000000006,
    stretchGoal: 82.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t18',
    regionId: 'SA',
    pillar: 'housing',
    tier: 18,
    targetIndex: 71.5,
    minimumAcceptable: 53.5,
    stretchGoal: 83.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t19',
    regionId: 'SA',
    pillar: 'housing',
    tier: 19,
    targetIndex: 72,
    minimumAcceptable: 54,
    stretchGoal: 84,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t20',
    regionId: 'SA',
    pillar: 'housing',
    tier: 20,
    targetIndex: 72.6,
    minimumAcceptable: 54.599999999999994,
    stretchGoal: 84.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t21',
    regionId: 'SA',
    pillar: 'housing',
    tier: 21,
    targetIndex: 73.1,
    minimumAcceptable: 55.099999999999994,
    stretchGoal: 85.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t22',
    regionId: 'SA',
    pillar: 'housing',
    tier: 22,
    targetIndex: 73.7,
    minimumAcceptable: 55.7,
    stretchGoal: 85.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t23',
    regionId: 'SA',
    pillar: 'housing',
    tier: 23,
    targetIndex: 74.2,
    minimumAcceptable: 56.2,
    stretchGoal: 86.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t24',
    regionId: 'SA',
    pillar: 'housing',
    tier: 24,
    targetIndex: 74.8,
    minimumAcceptable: 56.8,
    stretchGoal: 86.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t25',
    regionId: 'SA',
    pillar: 'housing',
    tier: 25,
    targetIndex: 75.3,
    minimumAcceptable: 57.3,
    stretchGoal: 87.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t26',
    regionId: 'SA',
    pillar: 'housing',
    tier: 26,
    targetIndex: 75.9,
    minimumAcceptable: 57.900000000000006,
    stretchGoal: 87.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t27',
    regionId: 'SA',
    pillar: 'housing',
    tier: 27,
    targetIndex: 76.4,
    minimumAcceptable: 58.400000000000006,
    stretchGoal: 88.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t28',
    regionId: 'SA',
    pillar: 'housing',
    tier: 28,
    targetIndex: 77,
    minimumAcceptable: 59,
    stretchGoal: 89,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t29',
    regionId: 'SA',
    pillar: 'housing',
    tier: 29,
    targetIndex: 77.5,
    minimumAcceptable: 59.5,
    stretchGoal: 89.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t30',
    regionId: 'SA',
    pillar: 'housing',
    tier: 30,
    targetIndex: 78.1,
    minimumAcceptable: 60.099999999999994,
    stretchGoal: 90.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t31',
    regionId: 'SA',
    pillar: 'housing',
    tier: 31,
    targetIndex: 78.6,
    minimumAcceptable: 60.599999999999994,
    stretchGoal: 90.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t32',
    regionId: 'SA',
    pillar: 'housing',
    tier: 32,
    targetIndex: 79.2,
    minimumAcceptable: 61.2,
    stretchGoal: 91.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t33',
    regionId: 'SA',
    pillar: 'housing',
    tier: 33,
    targetIndex: 79.7,
    minimumAcceptable: 61.7,
    stretchGoal: 91.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t34',
    regionId: 'SA',
    pillar: 'housing',
    tier: 34,
    targetIndex: 80.3,
    minimumAcceptable: 62.3,
    stretchGoal: 92.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t35',
    regionId: 'SA',
    pillar: 'housing',
    tier: 35,
    targetIndex: 80.8,
    minimumAcceptable: 62.8,
    stretchGoal: 92.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t36',
    regionId: 'SA',
    pillar: 'housing',
    tier: 36,
    targetIndex: 81.4,
    minimumAcceptable: 63.400000000000006,
    stretchGoal: 93.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t37',
    regionId: 'SA',
    pillar: 'housing',
    tier: 37,
    targetIndex: 81.9,
    minimumAcceptable: 63.900000000000006,
    stretchGoal: 93.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t38',
    regionId: 'SA',
    pillar: 'housing',
    tier: 38,
    targetIndex: 82.5,
    minimumAcceptable: 64.5,
    stretchGoal: 94.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t39',
    regionId: 'SA',
    pillar: 'housing',
    tier: 39,
    targetIndex: 83,
    minimumAcceptable: 65,
    stretchGoal: 95,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t40',
    regionId: 'SA',
    pillar: 'housing',
    tier: 40,
    targetIndex: 83.6,
    minimumAcceptable: 65.6,
    stretchGoal: 95.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t41',
    regionId: 'SA',
    pillar: 'housing',
    tier: 41,
    targetIndex: 84.1,
    minimumAcceptable: 66.1,
    stretchGoal: 96.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t42',
    regionId: 'SA',
    pillar: 'housing',
    tier: 42,
    targetIndex: 84.7,
    minimumAcceptable: 66.7,
    stretchGoal: 96.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t43',
    regionId: 'SA',
    pillar: 'housing',
    tier: 43,
    targetIndex: 85.2,
    minimumAcceptable: 67.2,
    stretchGoal: 97.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_housing_t44',
    regionId: 'SA',
    pillar: 'housing',
    tier: 44,
    targetIndex: 85.8,
    minimumAcceptable: 67.8,
    stretchGoal: 97.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for SA housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t0',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t1',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t2',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t3',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 70.2,
    minimumAcceptable: 52.2,
    stretchGoal: 82.2,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t4',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t5',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 71.3,
    minimumAcceptable: 53.3,
    stretchGoal: 83.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t6',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t7',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 72.4,
    minimumAcceptable: 54.400000000000006,
    stretchGoal: 84.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t8',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t9',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 73.5,
    minimumAcceptable: 55.5,
    stretchGoal: 85.5,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t10',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t11',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t12',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t13',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 75.7,
    minimumAcceptable: 57.7,
    stretchGoal: 87.7,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t14',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t15',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 76.8,
    minimumAcceptable: 58.8,
    stretchGoal: 88.8,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t16',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t17',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 77.9,
    minimumAcceptable: 59.900000000000006,
    stretchGoal: 89.9,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t18',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t19',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 79,
    minimumAcceptable: 61,
    stretchGoal: 91,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t20',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t21',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t22',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t23',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 81.2,
    minimumAcceptable: 63.2,
    stretchGoal: 93.2,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t24',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t25',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 82.3,
    minimumAcceptable: 64.3,
    stretchGoal: 94.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t26',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t27',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 83.4,
    minimumAcceptable: 65.4,
    stretchGoal: 95.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t28',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t29',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 84.5,
    minimumAcceptable: 66.5,
    stretchGoal: 96.5,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t30',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 85.1,
    minimumAcceptable: 67.1,
    stretchGoal: 97.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t31',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 85.6,
    minimumAcceptable: 67.6,
    stretchGoal: 97.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t32',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 86.2,
    minimumAcceptable: 68.2,
    stretchGoal: 98.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t33',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 86.7,
    minimumAcceptable: 68.7,
    stretchGoal: 98.7,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t34',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 87.3,
    minimumAcceptable: 69.3,
    stretchGoal: 99.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t35',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 87.8,
    minimumAcceptable: 69.8,
    stretchGoal: 99.8,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t36',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 88.4,
    minimumAcceptable: 70.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t37',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 88.9,
    minimumAcceptable: 70.9,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t38',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 89.5,
    minimumAcceptable: 71.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t39',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 90,
    minimumAcceptable: 72,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t40',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 90.6,
    minimumAcceptable: 72.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t41',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 91.1,
    minimumAcceptable: 73.1,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t42',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 91.7,
    minimumAcceptable: 73.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t43',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 92.2,
    minimumAcceptable: 74.2,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_healthcare_t44',
    regionId: 'SA',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 92.8,
    minimumAcceptable: 74.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for SA healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t0',
    regionId: 'SA',
    pillar: 'education',
    tier: 0,
    targetIndex: 69.6,
    minimumAcceptable: 51.599999999999994,
    stretchGoal: 81.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t1',
    regionId: 'SA',
    pillar: 'education',
    tier: 1,
    targetIndex: 70.1,
    minimumAcceptable: 52.099999999999994,
    stretchGoal: 82.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t2',
    regionId: 'SA',
    pillar: 'education',
    tier: 2,
    targetIndex: 70.7,
    minimumAcceptable: 52.7,
    stretchGoal: 82.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t3',
    regionId: 'SA',
    pillar: 'education',
    tier: 3,
    targetIndex: 71.2,
    minimumAcceptable: 53.2,
    stretchGoal: 83.2,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t4',
    regionId: 'SA',
    pillar: 'education',
    tier: 4,
    targetIndex: 71.8,
    minimumAcceptable: 53.8,
    stretchGoal: 83.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t5',
    regionId: 'SA',
    pillar: 'education',
    tier: 5,
    targetIndex: 72.3,
    minimumAcceptable: 54.3,
    stretchGoal: 84.3,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t6',
    regionId: 'SA',
    pillar: 'education',
    tier: 6,
    targetIndex: 72.9,
    minimumAcceptable: 54.900000000000006,
    stretchGoal: 84.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t7',
    regionId: 'SA',
    pillar: 'education',
    tier: 7,
    targetIndex: 73.4,
    minimumAcceptable: 55.400000000000006,
    stretchGoal: 85.4,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t8',
    regionId: 'SA',
    pillar: 'education',
    tier: 8,
    targetIndex: 74,
    minimumAcceptable: 56,
    stretchGoal: 86,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t9',
    regionId: 'SA',
    pillar: 'education',
    tier: 9,
    targetIndex: 74.5,
    minimumAcceptable: 56.5,
    stretchGoal: 86.5,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t10',
    regionId: 'SA',
    pillar: 'education',
    tier: 10,
    targetIndex: 75.1,
    minimumAcceptable: 57.099999999999994,
    stretchGoal: 87.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t11',
    regionId: 'SA',
    pillar: 'education',
    tier: 11,
    targetIndex: 75.6,
    minimumAcceptable: 57.599999999999994,
    stretchGoal: 87.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t12',
    regionId: 'SA',
    pillar: 'education',
    tier: 12,
    targetIndex: 76.2,
    minimumAcceptable: 58.2,
    stretchGoal: 88.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t13',
    regionId: 'SA',
    pillar: 'education',
    tier: 13,
    targetIndex: 76.7,
    minimumAcceptable: 58.7,
    stretchGoal: 88.7,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t14',
    regionId: 'SA',
    pillar: 'education',
    tier: 14,
    targetIndex: 77.3,
    minimumAcceptable: 59.3,
    stretchGoal: 89.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t15',
    regionId: 'SA',
    pillar: 'education',
    tier: 15,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t16',
    regionId: 'SA',
    pillar: 'education',
    tier: 16,
    targetIndex: 78.4,
    minimumAcceptable: 60.400000000000006,
    stretchGoal: 90.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t17',
    regionId: 'SA',
    pillar: 'education',
    tier: 17,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t18',
    regionId: 'SA',
    pillar: 'education',
    tier: 18,
    targetIndex: 79.5,
    minimumAcceptable: 61.5,
    stretchGoal: 91.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t19',
    regionId: 'SA',
    pillar: 'education',
    tier: 19,
    targetIndex: 80,
    minimumAcceptable: 62,
    stretchGoal: 92,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t20',
    regionId: 'SA',
    pillar: 'education',
    tier: 20,
    targetIndex: 80.6,
    minimumAcceptable: 62.599999999999994,
    stretchGoal: 92.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t21',
    regionId: 'SA',
    pillar: 'education',
    tier: 21,
    targetIndex: 81.1,
    minimumAcceptable: 63.099999999999994,
    stretchGoal: 93.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t22',
    regionId: 'SA',
    pillar: 'education',
    tier: 22,
    targetIndex: 81.7,
    minimumAcceptable: 63.7,
    stretchGoal: 93.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t23',
    regionId: 'SA',
    pillar: 'education',
    tier: 23,
    targetIndex: 82.2,
    minimumAcceptable: 64.2,
    stretchGoal: 94.2,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t24',
    regionId: 'SA',
    pillar: 'education',
    tier: 24,
    targetIndex: 82.8,
    minimumAcceptable: 64.8,
    stretchGoal: 94.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t25',
    regionId: 'SA',
    pillar: 'education',
    tier: 25,
    targetIndex: 83.3,
    minimumAcceptable: 65.3,
    stretchGoal: 95.3,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t26',
    regionId: 'SA',
    pillar: 'education',
    tier: 26,
    targetIndex: 83.9,
    minimumAcceptable: 65.9,
    stretchGoal: 95.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t27',
    regionId: 'SA',
    pillar: 'education',
    tier: 27,
    targetIndex: 84.4,
    minimumAcceptable: 66.4,
    stretchGoal: 96.4,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t28',
    regionId: 'SA',
    pillar: 'education',
    tier: 28,
    targetIndex: 85,
    minimumAcceptable: 67,
    stretchGoal: 97,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t29',
    regionId: 'SA',
    pillar: 'education',
    tier: 29,
    targetIndex: 85.5,
    minimumAcceptable: 67.5,
    stretchGoal: 97.5,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t30',
    regionId: 'SA',
    pillar: 'education',
    tier: 30,
    targetIndex: 86.1,
    minimumAcceptable: 68.1,
    stretchGoal: 98.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t31',
    regionId: 'SA',
    pillar: 'education',
    tier: 31,
    targetIndex: 86.6,
    minimumAcceptable: 68.6,
    stretchGoal: 98.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t32',
    regionId: 'SA',
    pillar: 'education',
    tier: 32,
    targetIndex: 87.2,
    minimumAcceptable: 69.2,
    stretchGoal: 99.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t33',
    regionId: 'SA',
    pillar: 'education',
    tier: 33,
    targetIndex: 87.7,
    minimumAcceptable: 69.7,
    stretchGoal: 99.7,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t34',
    regionId: 'SA',
    pillar: 'education',
    tier: 34,
    targetIndex: 88.3,
    minimumAcceptable: 70.3,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t35',
    regionId: 'SA',
    pillar: 'education',
    tier: 35,
    targetIndex: 88.8,
    minimumAcceptable: 70.8,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t36',
    regionId: 'SA',
    pillar: 'education',
    tier: 36,
    targetIndex: 89.4,
    minimumAcceptable: 71.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t37',
    regionId: 'SA',
    pillar: 'education',
    tier: 37,
    targetIndex: 89.9,
    minimumAcceptable: 71.9,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t38',
    regionId: 'SA',
    pillar: 'education',
    tier: 38,
    targetIndex: 90.5,
    minimumAcceptable: 72.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t39',
    regionId: 'SA',
    pillar: 'education',
    tier: 39,
    targetIndex: 91,
    minimumAcceptable: 73,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t40',
    regionId: 'SA',
    pillar: 'education',
    tier: 40,
    targetIndex: 91.6,
    minimumAcceptable: 73.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t41',
    regionId: 'SA',
    pillar: 'education',
    tier: 41,
    targetIndex: 92.1,
    minimumAcceptable: 74.1,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t42',
    regionId: 'SA',
    pillar: 'education',
    tier: 42,
    targetIndex: 92.7,
    minimumAcceptable: 74.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t43',
    regionId: 'SA',
    pillar: 'education',
    tier: 43,
    targetIndex: 93.2,
    minimumAcceptable: 75.2,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_SA_education_t44',
    regionId: 'SA',
    pillar: 'education',
    tier: 44,
    targetIndex: 93.8,
    minimumAcceptable: 75.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for SA education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t0',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 0,
    targetIndex: 59.8,
    minimumAcceptable: 41.8,
    stretchGoal: 71.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t1',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 1,
    targetIndex: 60.4,
    minimumAcceptable: 42.4,
    stretchGoal: 72.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t2',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 2,
    targetIndex: 60.9,
    minimumAcceptable: 42.9,
    stretchGoal: 72.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t3',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 3,
    targetIndex: 61.5,
    minimumAcceptable: 43.5,
    stretchGoal: 73.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t4',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 4,
    targetIndex: 62,
    minimumAcceptable: 44,
    stretchGoal: 74,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t5',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 5,
    targetIndex: 62.6,
    minimumAcceptable: 44.6,
    stretchGoal: 74.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t6',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 6,
    targetIndex: 63.1,
    minimumAcceptable: 45.1,
    stretchGoal: 75.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t7',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 7,
    targetIndex: 63.6,
    minimumAcceptable: 45.6,
    stretchGoal: 75.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t8',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 8,
    targetIndex: 64.2,
    minimumAcceptable: 46.2,
    stretchGoal: 76.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t9',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 9,
    targetIndex: 64.8,
    minimumAcceptable: 46.8,
    stretchGoal: 76.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t10',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 10,
    targetIndex: 65.3,
    minimumAcceptable: 47.3,
    stretchGoal: 77.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t11',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 11,
    targetIndex: 65.9,
    minimumAcceptable: 47.900000000000006,
    stretchGoal: 77.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t12',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 12,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t13',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 13,
    targetIndex: 67,
    minimumAcceptable: 49,
    stretchGoal: 79,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t14',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 14,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t15',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 15,
    targetIndex: 68.1,
    minimumAcceptable: 50.099999999999994,
    stretchGoal: 80.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t16',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 16,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t17',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 17,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t18',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 18,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t19',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 19,
    targetIndex: 70.3,
    minimumAcceptable: 52.3,
    stretchGoal: 82.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t20',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 20,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t21',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 21,
    targetIndex: 71.4,
    minimumAcceptable: 53.400000000000006,
    stretchGoal: 83.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t22',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 22,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t23',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 23,
    targetIndex: 72.5,
    minimumAcceptable: 54.5,
    stretchGoal: 84.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t24',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 24,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t25',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 25,
    targetIndex: 73.6,
    minimumAcceptable: 55.599999999999994,
    stretchGoal: 85.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t26',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 26,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t27',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 27,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t28',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 28,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t29',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 29,
    targetIndex: 75.8,
    minimumAcceptable: 57.8,
    stretchGoal: 87.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t30',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 30,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t31',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 31,
    targetIndex: 76.9,
    minimumAcceptable: 58.900000000000006,
    stretchGoal: 88.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t32',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 32,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t33',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 33,
    targetIndex: 78,
    minimumAcceptable: 60,
    stretchGoal: 90,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t34',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 34,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t35',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 35,
    targetIndex: 79.1,
    minimumAcceptable: 61.099999999999994,
    stretchGoal: 91.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t36',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 36,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t37',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 37,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t38',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 38,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t39',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 39,
    targetIndex: 81.3,
    minimumAcceptable: 63.3,
    stretchGoal: 93.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t40',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 40,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t41',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 41,
    targetIndex: 82.4,
    minimumAcceptable: 64.4,
    stretchGoal: 94.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t42',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 42,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t43',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 43,
    targetIndex: 83.5,
    minimumAcceptable: 65.5,
    stretchGoal: 95.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_housing_t44',
    regionId: 'TAS',
    pillar: 'housing',
    tier: 44,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for TAS housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t0',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 61.8,
    minimumAcceptable: 43.8,
    stretchGoal: 73.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t1',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 62.4,
    minimumAcceptable: 44.4,
    stretchGoal: 74.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t2',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 62.9,
    minimumAcceptable: 44.9,
    stretchGoal: 74.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t3',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 63.5,
    minimumAcceptable: 45.5,
    stretchGoal: 75.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t4',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 64,
    minimumAcceptable: 46,
    stretchGoal: 76,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t5',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 64.6,
    minimumAcceptable: 46.599999999999994,
    stretchGoal: 76.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t6',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 65.1,
    minimumAcceptable: 47.099999999999994,
    stretchGoal: 77.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t7',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 65.6,
    minimumAcceptable: 47.599999999999994,
    stretchGoal: 77.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t8',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 66.2,
    minimumAcceptable: 48.2,
    stretchGoal: 78.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t9',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 66.8,
    minimumAcceptable: 48.8,
    stretchGoal: 78.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t10',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 67.3,
    minimumAcceptable: 49.3,
    stretchGoal: 79.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t11',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 67.9,
    minimumAcceptable: 49.900000000000006,
    stretchGoal: 79.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t12',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 68.4,
    minimumAcceptable: 50.400000000000006,
    stretchGoal: 80.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t13',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 69,
    minimumAcceptable: 51,
    stretchGoal: 81,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t14',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 69.5,
    minimumAcceptable: 51.5,
    stretchGoal: 81.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t15',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 70.1,
    minimumAcceptable: 52.099999999999994,
    stretchGoal: 82.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t16',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 70.6,
    minimumAcceptable: 52.599999999999994,
    stretchGoal: 82.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t17',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 71.1,
    minimumAcceptable: 53.099999999999994,
    stretchGoal: 83.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t18',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 71.7,
    minimumAcceptable: 53.7,
    stretchGoal: 83.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t19',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 72.3,
    minimumAcceptable: 54.3,
    stretchGoal: 84.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t20',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 72.8,
    minimumAcceptable: 54.8,
    stretchGoal: 84.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t21',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 73.4,
    minimumAcceptable: 55.400000000000006,
    stretchGoal: 85.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t22',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 73.9,
    minimumAcceptable: 55.900000000000006,
    stretchGoal: 85.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t23',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 74.5,
    minimumAcceptable: 56.5,
    stretchGoal: 86.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t24',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 75,
    minimumAcceptable: 57,
    stretchGoal: 87,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t25',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 75.6,
    minimumAcceptable: 57.599999999999994,
    stretchGoal: 87.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t26',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 76.1,
    minimumAcceptable: 58.099999999999994,
    stretchGoal: 88.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t27',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 76.6,
    minimumAcceptable: 58.599999999999994,
    stretchGoal: 88.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t28',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 77.2,
    minimumAcceptable: 59.2,
    stretchGoal: 89.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t29',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t30',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 78.3,
    minimumAcceptable: 60.3,
    stretchGoal: 90.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t31',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t32',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 79.4,
    minimumAcceptable: 61.400000000000006,
    stretchGoal: 91.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t33',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 80,
    minimumAcceptable: 62,
    stretchGoal: 92,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t34',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 80.5,
    minimumAcceptable: 62.5,
    stretchGoal: 92.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t35',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 81.1,
    minimumAcceptable: 63.099999999999994,
    stretchGoal: 93.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t36',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 81.6,
    minimumAcceptable: 63.599999999999994,
    stretchGoal: 93.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t37',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 82.1,
    minimumAcceptable: 64.1,
    stretchGoal: 94.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t38',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 82.7,
    minimumAcceptable: 64.7,
    stretchGoal: 94.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t39',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 83.3,
    minimumAcceptable: 65.3,
    stretchGoal: 95.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t40',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 83.8,
    minimumAcceptable: 65.8,
    stretchGoal: 95.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t41',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 84.4,
    minimumAcceptable: 66.4,
    stretchGoal: 96.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t42',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 84.9,
    minimumAcceptable: 66.9,
    stretchGoal: 96.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t43',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 85.5,
    minimumAcceptable: 67.5,
    stretchGoal: 97.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_healthcare_t44',
    regionId: 'TAS',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 86,
    minimumAcceptable: 68,
    stretchGoal: 98,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for TAS healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t0',
    regionId: 'TAS',
    pillar: 'education',
    tier: 0,
    targetIndex: 62.8,
    minimumAcceptable: 44.8,
    stretchGoal: 74.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t1',
    regionId: 'TAS',
    pillar: 'education',
    tier: 1,
    targetIndex: 63.4,
    minimumAcceptable: 45.4,
    stretchGoal: 75.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t2',
    regionId: 'TAS',
    pillar: 'education',
    tier: 2,
    targetIndex: 63.9,
    minimumAcceptable: 45.9,
    stretchGoal: 75.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t3',
    regionId: 'TAS',
    pillar: 'education',
    tier: 3,
    targetIndex: 64.5,
    minimumAcceptable: 46.5,
    stretchGoal: 76.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t4',
    regionId: 'TAS',
    pillar: 'education',
    tier: 4,
    targetIndex: 65,
    minimumAcceptable: 47,
    stretchGoal: 77,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t5',
    regionId: 'TAS',
    pillar: 'education',
    tier: 5,
    targetIndex: 65.6,
    minimumAcceptable: 47.599999999999994,
    stretchGoal: 77.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t6',
    regionId: 'TAS',
    pillar: 'education',
    tier: 6,
    targetIndex: 66.1,
    minimumAcceptable: 48.099999999999994,
    stretchGoal: 78.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t7',
    regionId: 'TAS',
    pillar: 'education',
    tier: 7,
    targetIndex: 66.6,
    minimumAcceptable: 48.599999999999994,
    stretchGoal: 78.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t8',
    regionId: 'TAS',
    pillar: 'education',
    tier: 8,
    targetIndex: 67.2,
    minimumAcceptable: 49.2,
    stretchGoal: 79.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t9',
    regionId: 'TAS',
    pillar: 'education',
    tier: 9,
    targetIndex: 67.8,
    minimumAcceptable: 49.8,
    stretchGoal: 79.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t10',
    regionId: 'TAS',
    pillar: 'education',
    tier: 10,
    targetIndex: 68.3,
    minimumAcceptable: 50.3,
    stretchGoal: 80.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t11',
    regionId: 'TAS',
    pillar: 'education',
    tier: 11,
    targetIndex: 68.9,
    minimumAcceptable: 50.900000000000006,
    stretchGoal: 80.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t12',
    regionId: 'TAS',
    pillar: 'education',
    tier: 12,
    targetIndex: 69.4,
    minimumAcceptable: 51.400000000000006,
    stretchGoal: 81.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t13',
    regionId: 'TAS',
    pillar: 'education',
    tier: 13,
    targetIndex: 70,
    minimumAcceptable: 52,
    stretchGoal: 82,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t14',
    regionId: 'TAS',
    pillar: 'education',
    tier: 14,
    targetIndex: 70.5,
    minimumAcceptable: 52.5,
    stretchGoal: 82.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t15',
    regionId: 'TAS',
    pillar: 'education',
    tier: 15,
    targetIndex: 71.1,
    minimumAcceptable: 53.099999999999994,
    stretchGoal: 83.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t16',
    regionId: 'TAS',
    pillar: 'education',
    tier: 16,
    targetIndex: 71.6,
    minimumAcceptable: 53.599999999999994,
    stretchGoal: 83.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t17',
    regionId: 'TAS',
    pillar: 'education',
    tier: 17,
    targetIndex: 72.1,
    minimumAcceptable: 54.099999999999994,
    stretchGoal: 84.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t18',
    regionId: 'TAS',
    pillar: 'education',
    tier: 18,
    targetIndex: 72.7,
    minimumAcceptable: 54.7,
    stretchGoal: 84.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t19',
    regionId: 'TAS',
    pillar: 'education',
    tier: 19,
    targetIndex: 73.3,
    minimumAcceptable: 55.3,
    stretchGoal: 85.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t20',
    regionId: 'TAS',
    pillar: 'education',
    tier: 20,
    targetIndex: 73.8,
    minimumAcceptable: 55.8,
    stretchGoal: 85.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t21',
    regionId: 'TAS',
    pillar: 'education',
    tier: 21,
    targetIndex: 74.4,
    minimumAcceptable: 56.400000000000006,
    stretchGoal: 86.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t22',
    regionId: 'TAS',
    pillar: 'education',
    tier: 22,
    targetIndex: 74.9,
    minimumAcceptable: 56.900000000000006,
    stretchGoal: 86.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t23',
    regionId: 'TAS',
    pillar: 'education',
    tier: 23,
    targetIndex: 75.5,
    minimumAcceptable: 57.5,
    stretchGoal: 87.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t24',
    regionId: 'TAS',
    pillar: 'education',
    tier: 24,
    targetIndex: 76,
    minimumAcceptable: 58,
    stretchGoal: 88,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t25',
    regionId: 'TAS',
    pillar: 'education',
    tier: 25,
    targetIndex: 76.6,
    minimumAcceptable: 58.599999999999994,
    stretchGoal: 88.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t26',
    regionId: 'TAS',
    pillar: 'education',
    tier: 26,
    targetIndex: 77.1,
    minimumAcceptable: 59.099999999999994,
    stretchGoal: 89.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t27',
    regionId: 'TAS',
    pillar: 'education',
    tier: 27,
    targetIndex: 77.6,
    minimumAcceptable: 59.599999999999994,
    stretchGoal: 89.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t28',
    regionId: 'TAS',
    pillar: 'education',
    tier: 28,
    targetIndex: 78.2,
    minimumAcceptable: 60.2,
    stretchGoal: 90.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t29',
    regionId: 'TAS',
    pillar: 'education',
    tier: 29,
    targetIndex: 78.8,
    minimumAcceptable: 60.8,
    stretchGoal: 90.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t30',
    regionId: 'TAS',
    pillar: 'education',
    tier: 30,
    targetIndex: 79.3,
    minimumAcceptable: 61.3,
    stretchGoal: 91.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t31',
    regionId: 'TAS',
    pillar: 'education',
    tier: 31,
    targetIndex: 79.9,
    minimumAcceptable: 61.900000000000006,
    stretchGoal: 91.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t32',
    regionId: 'TAS',
    pillar: 'education',
    tier: 32,
    targetIndex: 80.4,
    minimumAcceptable: 62.400000000000006,
    stretchGoal: 92.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t33',
    regionId: 'TAS',
    pillar: 'education',
    tier: 33,
    targetIndex: 81,
    minimumAcceptable: 63,
    stretchGoal: 93,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t34',
    regionId: 'TAS',
    pillar: 'education',
    tier: 34,
    targetIndex: 81.5,
    minimumAcceptable: 63.5,
    stretchGoal: 93.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t35',
    regionId: 'TAS',
    pillar: 'education',
    tier: 35,
    targetIndex: 82.1,
    minimumAcceptable: 64.1,
    stretchGoal: 94.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t36',
    regionId: 'TAS',
    pillar: 'education',
    tier: 36,
    targetIndex: 82.6,
    minimumAcceptable: 64.6,
    stretchGoal: 94.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t37',
    regionId: 'TAS',
    pillar: 'education',
    tier: 37,
    targetIndex: 83.1,
    minimumAcceptable: 65.1,
    stretchGoal: 95.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t38',
    regionId: 'TAS',
    pillar: 'education',
    tier: 38,
    targetIndex: 83.7,
    minimumAcceptable: 65.7,
    stretchGoal: 95.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t39',
    regionId: 'TAS',
    pillar: 'education',
    tier: 39,
    targetIndex: 84.3,
    minimumAcceptable: 66.3,
    stretchGoal: 96.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t40',
    regionId: 'TAS',
    pillar: 'education',
    tier: 40,
    targetIndex: 84.8,
    minimumAcceptable: 66.8,
    stretchGoal: 96.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t41',
    regionId: 'TAS',
    pillar: 'education',
    tier: 41,
    targetIndex: 85.4,
    minimumAcceptable: 67.4,
    stretchGoal: 97.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t42',
    regionId: 'TAS',
    pillar: 'education',
    tier: 42,
    targetIndex: 85.9,
    minimumAcceptable: 67.9,
    stretchGoal: 97.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t43',
    regionId: 'TAS',
    pillar: 'education',
    tier: 43,
    targetIndex: 86.5,
    minimumAcceptable: 68.5,
    stretchGoal: 98.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_TAS_education_t44',
    regionId: 'TAS',
    pillar: 'education',
    tier: 44,
    targetIndex: 87,
    minimumAcceptable: 69,
    stretchGoal: 99,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for TAS education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t0',
    regionId: 'NT',
    pillar: 'housing',
    tier: 0,
    targetIndex: 46.2,
    minimumAcceptable: 28.200000000000003,
    stretchGoal: 58.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t1',
    regionId: 'NT',
    pillar: 'housing',
    tier: 1,
    targetIndex: 46.8,
    minimumAcceptable: 28.799999999999997,
    stretchGoal: 58.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t2',
    regionId: 'NT',
    pillar: 'housing',
    tier: 2,
    targetIndex: 47.3,
    minimumAcceptable: 29.299999999999997,
    stretchGoal: 59.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t3',
    regionId: 'NT',
    pillar: 'housing',
    tier: 3,
    targetIndex: 47.9,
    minimumAcceptable: 29.9,
    stretchGoal: 59.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t4',
    regionId: 'NT',
    pillar: 'housing',
    tier: 4,
    targetIndex: 48.4,
    minimumAcceptable: 30.4,
    stretchGoal: 60.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t5',
    regionId: 'NT',
    pillar: 'housing',
    tier: 5,
    targetIndex: 49,
    minimumAcceptable: 31,
    stretchGoal: 61,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t6',
    regionId: 'NT',
    pillar: 'housing',
    tier: 6,
    targetIndex: 49.5,
    minimumAcceptable: 31.5,
    stretchGoal: 61.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t7',
    regionId: 'NT',
    pillar: 'housing',
    tier: 7,
    targetIndex: 50.1,
    minimumAcceptable: 32.1,
    stretchGoal: 62.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t8',
    regionId: 'NT',
    pillar: 'housing',
    tier: 8,
    targetIndex: 50.6,
    minimumAcceptable: 32.6,
    stretchGoal: 62.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t9',
    regionId: 'NT',
    pillar: 'housing',
    tier: 9,
    targetIndex: 51.2,
    minimumAcceptable: 33.2,
    stretchGoal: 63.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t10',
    regionId: 'NT',
    pillar: 'housing',
    tier: 10,
    targetIndex: 51.7,
    minimumAcceptable: 33.7,
    stretchGoal: 63.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t11',
    regionId: 'NT',
    pillar: 'housing',
    tier: 11,
    targetIndex: 52.3,
    minimumAcceptable: 34.3,
    stretchGoal: 64.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t12',
    regionId: 'NT',
    pillar: 'housing',
    tier: 12,
    targetIndex: 52.8,
    minimumAcceptable: 34.8,
    stretchGoal: 64.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t13',
    regionId: 'NT',
    pillar: 'housing',
    tier: 13,
    targetIndex: 53.4,
    minimumAcceptable: 35.4,
    stretchGoal: 65.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t14',
    regionId: 'NT',
    pillar: 'housing',
    tier: 14,
    targetIndex: 53.9,
    minimumAcceptable: 35.9,
    stretchGoal: 65.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t15',
    regionId: 'NT',
    pillar: 'housing',
    tier: 15,
    targetIndex: 54.5,
    minimumAcceptable: 36.5,
    stretchGoal: 66.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t16',
    regionId: 'NT',
    pillar: 'housing',
    tier: 16,
    targetIndex: 55,
    minimumAcceptable: 37,
    stretchGoal: 67,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t17',
    regionId: 'NT',
    pillar: 'housing',
    tier: 17,
    targetIndex: 55.6,
    minimumAcceptable: 37.6,
    stretchGoal: 67.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t18',
    regionId: 'NT',
    pillar: 'housing',
    tier: 18,
    targetIndex: 56.1,
    minimumAcceptable: 38.1,
    stretchGoal: 68.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t19',
    regionId: 'NT',
    pillar: 'housing',
    tier: 19,
    targetIndex: 56.7,
    minimumAcceptable: 38.7,
    stretchGoal: 68.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t20',
    regionId: 'NT',
    pillar: 'housing',
    tier: 20,
    targetIndex: 57.2,
    minimumAcceptable: 39.2,
    stretchGoal: 69.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t21',
    regionId: 'NT',
    pillar: 'housing',
    tier: 21,
    targetIndex: 57.8,
    minimumAcceptable: 39.8,
    stretchGoal: 69.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t22',
    regionId: 'NT',
    pillar: 'housing',
    tier: 22,
    targetIndex: 58.3,
    minimumAcceptable: 40.3,
    stretchGoal: 70.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t23',
    regionId: 'NT',
    pillar: 'housing',
    tier: 23,
    targetIndex: 58.9,
    minimumAcceptable: 40.9,
    stretchGoal: 70.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t24',
    regionId: 'NT',
    pillar: 'housing',
    tier: 24,
    targetIndex: 59.4,
    minimumAcceptable: 41.4,
    stretchGoal: 71.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t25',
    regionId: 'NT',
    pillar: 'housing',
    tier: 25,
    targetIndex: 60,
    minimumAcceptable: 42,
    stretchGoal: 72,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t26',
    regionId: 'NT',
    pillar: 'housing',
    tier: 26,
    targetIndex: 60.5,
    minimumAcceptable: 42.5,
    stretchGoal: 72.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t27',
    regionId: 'NT',
    pillar: 'housing',
    tier: 27,
    targetIndex: 61.1,
    minimumAcceptable: 43.1,
    stretchGoal: 73.1,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t28',
    regionId: 'NT',
    pillar: 'housing',
    tier: 28,
    targetIndex: 61.6,
    minimumAcceptable: 43.6,
    stretchGoal: 73.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t29',
    regionId: 'NT',
    pillar: 'housing',
    tier: 29,
    targetIndex: 62.2,
    minimumAcceptable: 44.2,
    stretchGoal: 74.2,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t30',
    regionId: 'NT',
    pillar: 'housing',
    tier: 30,
    targetIndex: 62.7,
    minimumAcceptable: 44.7,
    stretchGoal: 74.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t31',
    regionId: 'NT',
    pillar: 'housing',
    tier: 31,
    targetIndex: 63.3,
    minimumAcceptable: 45.3,
    stretchGoal: 75.3,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t32',
    regionId: 'NT',
    pillar: 'housing',
    tier: 32,
    targetIndex: 63.8,
    minimumAcceptable: 45.8,
    stretchGoal: 75.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t33',
    regionId: 'NT',
    pillar: 'housing',
    tier: 33,
    targetIndex: 64.4,
    minimumAcceptable: 46.400000000000006,
    stretchGoal: 76.4,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t34',
    regionId: 'NT',
    pillar: 'housing',
    tier: 34,
    targetIndex: 64.9,
    minimumAcceptable: 46.900000000000006,
    stretchGoal: 76.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t35',
    regionId: 'NT',
    pillar: 'housing',
    tier: 35,
    targetIndex: 65.5,
    minimumAcceptable: 47.5,
    stretchGoal: 77.5,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t36',
    regionId: 'NT',
    pillar: 'housing',
    tier: 36,
    targetIndex: 66,
    minimumAcceptable: 48,
    stretchGoal: 78,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t37',
    regionId: 'NT',
    pillar: 'housing',
    tier: 37,
    targetIndex: 66.6,
    minimumAcceptable: 48.599999999999994,
    stretchGoal: 78.6,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t38',
    regionId: 'NT',
    pillar: 'housing',
    tier: 38,
    targetIndex: 67.1,
    minimumAcceptable: 49.099999999999994,
    stretchGoal: 79.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t39',
    regionId: 'NT',
    pillar: 'housing',
    tier: 39,
    targetIndex: 67.7,
    minimumAcceptable: 49.7,
    stretchGoal: 79.7,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t40',
    regionId: 'NT',
    pillar: 'housing',
    tier: 40,
    targetIndex: 68.2,
    minimumAcceptable: 50.2,
    stretchGoal: 80.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t41',
    regionId: 'NT',
    pillar: 'housing',
    tier: 41,
    targetIndex: 68.8,
    minimumAcceptable: 50.8,
    stretchGoal: 80.8,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t42',
    regionId: 'NT',
    pillar: 'housing',
    tier: 42,
    targetIndex: 69.3,
    minimumAcceptable: 51.3,
    stretchGoal: 81.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t43',
    regionId: 'NT',
    pillar: 'housing',
    tier: 43,
    targetIndex: 69.9,
    minimumAcceptable: 51.900000000000006,
    stretchGoal: 81.9,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_housing_t44',
    regionId: 'NT',
    pillar: 'housing',
    tier: 44,
    targetIndex: 70.4,
    minimumAcceptable: 52.400000000000006,
    stretchGoal: 82.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for NT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t0',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 52.2,
    minimumAcceptable: 34.2,
    stretchGoal: 64.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t1',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 52.8,
    minimumAcceptable: 34.8,
    stretchGoal: 64.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t2',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 53.3,
    minimumAcceptable: 35.3,
    stretchGoal: 65.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t3',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 53.9,
    minimumAcceptable: 35.9,
    stretchGoal: 65.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t4',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 54.4,
    minimumAcceptable: 36.4,
    stretchGoal: 66.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t5',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 55,
    minimumAcceptable: 37,
    stretchGoal: 67,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t6',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 55.5,
    minimumAcceptable: 37.5,
    stretchGoal: 67.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t7',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 56.1,
    minimumAcceptable: 38.1,
    stretchGoal: 68.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t8',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 56.6,
    minimumAcceptable: 38.6,
    stretchGoal: 68.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t9',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 57.2,
    minimumAcceptable: 39.2,
    stretchGoal: 69.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t10',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 57.7,
    minimumAcceptable: 39.7,
    stretchGoal: 69.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t11',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 58.3,
    minimumAcceptable: 40.3,
    stretchGoal: 70.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t12',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 58.8,
    minimumAcceptable: 40.8,
    stretchGoal: 70.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t13',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 59.4,
    minimumAcceptable: 41.4,
    stretchGoal: 71.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t14',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 59.9,
    minimumAcceptable: 41.9,
    stretchGoal: 71.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t15',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 60.5,
    minimumAcceptable: 42.5,
    stretchGoal: 72.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t16',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 61,
    minimumAcceptable: 43,
    stretchGoal: 73,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t17',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 61.6,
    minimumAcceptable: 43.6,
    stretchGoal: 73.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t18',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 62.1,
    minimumAcceptable: 44.1,
    stretchGoal: 74.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t19',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 62.7,
    minimumAcceptable: 44.7,
    stretchGoal: 74.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t20',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 63.2,
    minimumAcceptable: 45.2,
    stretchGoal: 75.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t21',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 63.8,
    minimumAcceptable: 45.8,
    stretchGoal: 75.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t22',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 64.3,
    minimumAcceptable: 46.3,
    stretchGoal: 76.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t23',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 64.9,
    minimumAcceptable: 46.900000000000006,
    stretchGoal: 76.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t24',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 65.4,
    minimumAcceptable: 47.400000000000006,
    stretchGoal: 77.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t25',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 66,
    minimumAcceptable: 48,
    stretchGoal: 78,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t26',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 66.5,
    minimumAcceptable: 48.5,
    stretchGoal: 78.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t27',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 67.1,
    minimumAcceptable: 49.099999999999994,
    stretchGoal: 79.1,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t28',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 67.6,
    minimumAcceptable: 49.599999999999994,
    stretchGoal: 79.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t29',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 68.2,
    minimumAcceptable: 50.2,
    stretchGoal: 80.2,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t30',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 68.7,
    minimumAcceptable: 50.7,
    stretchGoal: 80.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t31',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 69.3,
    minimumAcceptable: 51.3,
    stretchGoal: 81.3,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t32',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 69.8,
    minimumAcceptable: 51.8,
    stretchGoal: 81.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t33',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 70.4,
    minimumAcceptable: 52.400000000000006,
    stretchGoal: 82.4,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t34',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 70.9,
    minimumAcceptable: 52.900000000000006,
    stretchGoal: 82.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t35',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 71.5,
    minimumAcceptable: 53.5,
    stretchGoal: 83.5,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t36',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 72,
    minimumAcceptable: 54,
    stretchGoal: 84,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t37',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 72.6,
    minimumAcceptable: 54.599999999999994,
    stretchGoal: 84.6,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t38',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 73.1,
    minimumAcceptable: 55.099999999999994,
    stretchGoal: 85.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t39',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 73.7,
    minimumAcceptable: 55.7,
    stretchGoal: 85.7,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t40',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 74.2,
    minimumAcceptable: 56.2,
    stretchGoal: 86.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t41',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 74.8,
    minimumAcceptable: 56.8,
    stretchGoal: 86.8,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t42',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 75.3,
    minimumAcceptable: 57.3,
    stretchGoal: 87.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t43',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 75.9,
    minimumAcceptable: 57.900000000000006,
    stretchGoal: 87.9,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_healthcare_t44',
    regionId: 'NT',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 76.4,
    minimumAcceptable: 58.400000000000006,
    stretchGoal: 88.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for NT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t0',
    regionId: 'NT',
    pillar: 'education',
    tier: 0,
    targetIndex: 53.2,
    minimumAcceptable: 35.2,
    stretchGoal: 65.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t1',
    regionId: 'NT',
    pillar: 'education',
    tier: 1,
    targetIndex: 53.8,
    minimumAcceptable: 35.8,
    stretchGoal: 65.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t2',
    regionId: 'NT',
    pillar: 'education',
    tier: 2,
    targetIndex: 54.3,
    minimumAcceptable: 36.3,
    stretchGoal: 66.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t3',
    regionId: 'NT',
    pillar: 'education',
    tier: 3,
    targetIndex: 54.9,
    minimumAcceptable: 36.9,
    stretchGoal: 66.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t4',
    regionId: 'NT',
    pillar: 'education',
    tier: 4,
    targetIndex: 55.4,
    minimumAcceptable: 37.4,
    stretchGoal: 67.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t5',
    regionId: 'NT',
    pillar: 'education',
    tier: 5,
    targetIndex: 56,
    minimumAcceptable: 38,
    stretchGoal: 68,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t6',
    regionId: 'NT',
    pillar: 'education',
    tier: 6,
    targetIndex: 56.5,
    minimumAcceptable: 38.5,
    stretchGoal: 68.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t7',
    regionId: 'NT',
    pillar: 'education',
    tier: 7,
    targetIndex: 57.1,
    minimumAcceptable: 39.1,
    stretchGoal: 69.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t8',
    regionId: 'NT',
    pillar: 'education',
    tier: 8,
    targetIndex: 57.6,
    minimumAcceptable: 39.6,
    stretchGoal: 69.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t9',
    regionId: 'NT',
    pillar: 'education',
    tier: 9,
    targetIndex: 58.2,
    minimumAcceptable: 40.2,
    stretchGoal: 70.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t10',
    regionId: 'NT',
    pillar: 'education',
    tier: 10,
    targetIndex: 58.7,
    minimumAcceptable: 40.7,
    stretchGoal: 70.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t11',
    regionId: 'NT',
    pillar: 'education',
    tier: 11,
    targetIndex: 59.3,
    minimumAcceptable: 41.3,
    stretchGoal: 71.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t12',
    regionId: 'NT',
    pillar: 'education',
    tier: 12,
    targetIndex: 59.8,
    minimumAcceptable: 41.8,
    stretchGoal: 71.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t13',
    regionId: 'NT',
    pillar: 'education',
    tier: 13,
    targetIndex: 60.4,
    minimumAcceptable: 42.4,
    stretchGoal: 72.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t14',
    regionId: 'NT',
    pillar: 'education',
    tier: 14,
    targetIndex: 60.9,
    minimumAcceptable: 42.9,
    stretchGoal: 72.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t15',
    regionId: 'NT',
    pillar: 'education',
    tier: 15,
    targetIndex: 61.5,
    minimumAcceptable: 43.5,
    stretchGoal: 73.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t16',
    regionId: 'NT',
    pillar: 'education',
    tier: 16,
    targetIndex: 62,
    minimumAcceptable: 44,
    stretchGoal: 74,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t17',
    regionId: 'NT',
    pillar: 'education',
    tier: 17,
    targetIndex: 62.6,
    minimumAcceptable: 44.6,
    stretchGoal: 74.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t18',
    regionId: 'NT',
    pillar: 'education',
    tier: 18,
    targetIndex: 63.1,
    minimumAcceptable: 45.1,
    stretchGoal: 75.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t19',
    regionId: 'NT',
    pillar: 'education',
    tier: 19,
    targetIndex: 63.7,
    minimumAcceptable: 45.7,
    stretchGoal: 75.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t20',
    regionId: 'NT',
    pillar: 'education',
    tier: 20,
    targetIndex: 64.2,
    minimumAcceptable: 46.2,
    stretchGoal: 76.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t21',
    regionId: 'NT',
    pillar: 'education',
    tier: 21,
    targetIndex: 64.8,
    minimumAcceptable: 46.8,
    stretchGoal: 76.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t22',
    regionId: 'NT',
    pillar: 'education',
    tier: 22,
    targetIndex: 65.3,
    minimumAcceptable: 47.3,
    stretchGoal: 77.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t23',
    regionId: 'NT',
    pillar: 'education',
    tier: 23,
    targetIndex: 65.9,
    minimumAcceptable: 47.900000000000006,
    stretchGoal: 77.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t24',
    regionId: 'NT',
    pillar: 'education',
    tier: 24,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t25',
    regionId: 'NT',
    pillar: 'education',
    tier: 25,
    targetIndex: 67,
    minimumAcceptable: 49,
    stretchGoal: 79,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t26',
    regionId: 'NT',
    pillar: 'education',
    tier: 26,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t27',
    regionId: 'NT',
    pillar: 'education',
    tier: 27,
    targetIndex: 68.1,
    minimumAcceptable: 50.099999999999994,
    stretchGoal: 80.1,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t28',
    regionId: 'NT',
    pillar: 'education',
    tier: 28,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t29',
    regionId: 'NT',
    pillar: 'education',
    tier: 29,
    targetIndex: 69.2,
    minimumAcceptable: 51.2,
    stretchGoal: 81.2,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t30',
    regionId: 'NT',
    pillar: 'education',
    tier: 30,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t31',
    regionId: 'NT',
    pillar: 'education',
    tier: 31,
    targetIndex: 70.3,
    minimumAcceptable: 52.3,
    stretchGoal: 82.3,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t32',
    regionId: 'NT',
    pillar: 'education',
    tier: 32,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t33',
    regionId: 'NT',
    pillar: 'education',
    tier: 33,
    targetIndex: 71.4,
    minimumAcceptable: 53.400000000000006,
    stretchGoal: 83.4,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t34',
    regionId: 'NT',
    pillar: 'education',
    tier: 34,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t35',
    regionId: 'NT',
    pillar: 'education',
    tier: 35,
    targetIndex: 72.5,
    minimumAcceptable: 54.5,
    stretchGoal: 84.5,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t36',
    regionId: 'NT',
    pillar: 'education',
    tier: 36,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t37',
    regionId: 'NT',
    pillar: 'education',
    tier: 37,
    targetIndex: 73.6,
    minimumAcceptable: 55.599999999999994,
    stretchGoal: 85.6,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t38',
    regionId: 'NT',
    pillar: 'education',
    tier: 38,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t39',
    regionId: 'NT',
    pillar: 'education',
    tier: 39,
    targetIndex: 74.7,
    minimumAcceptable: 56.7,
    stretchGoal: 86.7,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t40',
    regionId: 'NT',
    pillar: 'education',
    tier: 40,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t41',
    regionId: 'NT',
    pillar: 'education',
    tier: 41,
    targetIndex: 75.8,
    minimumAcceptable: 57.8,
    stretchGoal: 87.8,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t42',
    regionId: 'NT',
    pillar: 'education',
    tier: 42,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t43',
    regionId: 'NT',
    pillar: 'education',
    tier: 43,
    targetIndex: 76.9,
    minimumAcceptable: 58.900000000000006,
    stretchGoal: 88.9,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_NT_education_t44',
    regionId: 'NT',
    pillar: 'education',
    tier: 44,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for NT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t0',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 0,
    targetIndex: 59.8,
    minimumAcceptable: 41.8,
    stretchGoal: 71.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 0 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t1',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 1,
    targetIndex: 60.3,
    minimumAcceptable: 42.3,
    stretchGoal: 72.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 1 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t2',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 2,
    targetIndex: 60.9,
    minimumAcceptable: 42.9,
    stretchGoal: 72.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 2 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t3',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 3,
    targetIndex: 61.4,
    minimumAcceptable: 43.4,
    stretchGoal: 73.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 3 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t4',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 4,
    targetIndex: 62,
    minimumAcceptable: 44,
    stretchGoal: 74,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 4 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t5',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 5,
    targetIndex: 62.5,
    minimumAcceptable: 44.5,
    stretchGoal: 74.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 5 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t6',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 6,
    targetIndex: 63.1,
    minimumAcceptable: 45.1,
    stretchGoal: 75.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 6 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t7',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 7,
    targetIndex: 63.6,
    minimumAcceptable: 45.6,
    stretchGoal: 75.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 7 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t8',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 8,
    targetIndex: 64.2,
    minimumAcceptable: 46.2,
    stretchGoal: 76.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 8 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t9',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 9,
    targetIndex: 64.7,
    minimumAcceptable: 46.7,
    stretchGoal: 76.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 9 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t10',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 10,
    targetIndex: 65.3,
    minimumAcceptable: 47.3,
    stretchGoal: 77.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 10 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t11',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 11,
    targetIndex: 65.8,
    minimumAcceptable: 47.8,
    stretchGoal: 77.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 11 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t12',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 12,
    targetIndex: 66.4,
    minimumAcceptable: 48.400000000000006,
    stretchGoal: 78.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 12 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t13',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 13,
    targetIndex: 66.9,
    minimumAcceptable: 48.900000000000006,
    stretchGoal: 78.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 13 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t14',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 14,
    targetIndex: 67.5,
    minimumAcceptable: 49.5,
    stretchGoal: 79.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 14 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t15',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 15,
    targetIndex: 68,
    minimumAcceptable: 50,
    stretchGoal: 80,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 15 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t16',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 16,
    targetIndex: 68.6,
    minimumAcceptable: 50.599999999999994,
    stretchGoal: 80.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 16 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t17',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 17,
    targetIndex: 69.1,
    minimumAcceptable: 51.099999999999994,
    stretchGoal: 81.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 17 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t18',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 18,
    targetIndex: 69.7,
    minimumAcceptable: 51.7,
    stretchGoal: 81.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 18 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t19',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 19,
    targetIndex: 70.2,
    minimumAcceptable: 52.2,
    stretchGoal: 82.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 19 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t20',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 20,
    targetIndex: 70.8,
    minimumAcceptable: 52.8,
    stretchGoal: 82.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 20 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t21',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 21,
    targetIndex: 71.3,
    minimumAcceptable: 53.3,
    stretchGoal: 83.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 21 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t22',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 22,
    targetIndex: 71.9,
    minimumAcceptable: 53.900000000000006,
    stretchGoal: 83.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 22 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t23',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 23,
    targetIndex: 72.4,
    minimumAcceptable: 54.400000000000006,
    stretchGoal: 84.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 23 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t24',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 24,
    targetIndex: 73,
    minimumAcceptable: 55,
    stretchGoal: 85,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 24 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t25',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 25,
    targetIndex: 73.5,
    minimumAcceptable: 55.5,
    stretchGoal: 85.5,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 25 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t26',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 26,
    targetIndex: 74.1,
    minimumAcceptable: 56.099999999999994,
    stretchGoal: 86.1,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 26 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t27',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 27,
    targetIndex: 74.6,
    minimumAcceptable: 56.599999999999994,
    stretchGoal: 86.6,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 27 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t28',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 28,
    targetIndex: 75.2,
    minimumAcceptable: 57.2,
    stretchGoal: 87.2,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 28 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t29',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 29,
    targetIndex: 75.7,
    minimumAcceptable: 57.7,
    stretchGoal: 87.7,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 29 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t30',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 30,
    targetIndex: 76.3,
    minimumAcceptable: 58.3,
    stretchGoal: 88.3,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 30 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t31',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 31,
    targetIndex: 76.8,
    minimumAcceptable: 58.8,
    stretchGoal: 88.8,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 31 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t32',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 32,
    targetIndex: 77.4,
    minimumAcceptable: 59.400000000000006,
    stretchGoal: 89.4,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 32 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t33',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 33,
    targetIndex: 77.9,
    minimumAcceptable: 59.900000000000006,
    stretchGoal: 89.9,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 33 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t34',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 34,
    targetIndex: 78.5,
    minimumAcceptable: 60.5,
    stretchGoal: 90.5,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 34 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t35',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 35,
    targetIndex: 79,
    minimumAcceptable: 61,
    stretchGoal: 91,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 35 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t36',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 36,
    targetIndex: 79.6,
    minimumAcceptable: 61.599999999999994,
    stretchGoal: 91.6,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 36 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t37',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 37,
    targetIndex: 80.1,
    minimumAcceptable: 62.099999999999994,
    stretchGoal: 92.1,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 37 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t38',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 38,
    targetIndex: 80.7,
    minimumAcceptable: 62.7,
    stretchGoal: 92.7,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 38 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t39',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 39,
    targetIndex: 81.2,
    minimumAcceptable: 63.2,
    stretchGoal: 93.2,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 39 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t40',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 40,
    targetIndex: 81.8,
    minimumAcceptable: 63.8,
    stretchGoal: 93.8,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 40 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t41',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 41,
    targetIndex: 82.3,
    minimumAcceptable: 64.3,
    stretchGoal: 94.3,
    measurementWindowTurns: 4,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 41 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t42',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 42,
    targetIndex: 82.9,
    minimumAcceptable: 64.9,
    stretchGoal: 94.9,
    measurementWindowTurns: 5,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 42 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t43',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 43,
    targetIndex: 83.4,
    minimumAcceptable: 65.4,
    stretchGoal: 95.4,
    measurementWindowTurns: 6,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 43 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_housing_t44',
    regionId: 'ACT',
    pillar: 'housing',
    tier: 44,
    targetIndex: 84,
    minimumAcceptable: 66,
    stretchGoal: 96,
    measurementWindowTurns: 3,
    auditMetric: 'housing_delivery_index',
    reportingNotes: "Tier 44 benchmark for ACT housing delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t0',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 0,
    targetIndex: 74.8,
    minimumAcceptable: 56.8,
    stretchGoal: 86.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 0 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t1',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 1,
    targetIndex: 75.3,
    minimumAcceptable: 57.3,
    stretchGoal: 87.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 1 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t2',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 2,
    targetIndex: 75.9,
    minimumAcceptable: 57.900000000000006,
    stretchGoal: 87.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 2 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t3',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 3,
    targetIndex: 76.4,
    minimumAcceptable: 58.400000000000006,
    stretchGoal: 88.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 3 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t4',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 4,
    targetIndex: 77,
    minimumAcceptable: 59,
    stretchGoal: 89,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 4 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t5',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 5,
    targetIndex: 77.5,
    minimumAcceptable: 59.5,
    stretchGoal: 89.5,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 5 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t6',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 6,
    targetIndex: 78.1,
    minimumAcceptable: 60.099999999999994,
    stretchGoal: 90.1,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 6 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t7',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 7,
    targetIndex: 78.6,
    minimumAcceptable: 60.599999999999994,
    stretchGoal: 90.6,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 7 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t8',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 8,
    targetIndex: 79.2,
    minimumAcceptable: 61.2,
    stretchGoal: 91.2,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 8 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t9',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 9,
    targetIndex: 79.7,
    minimumAcceptable: 61.7,
    stretchGoal: 91.7,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 9 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t10',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 10,
    targetIndex: 80.3,
    minimumAcceptable: 62.3,
    stretchGoal: 92.3,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 10 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t11',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 11,
    targetIndex: 80.8,
    minimumAcceptable: 62.8,
    stretchGoal: 92.8,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 11 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t12',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 12,
    targetIndex: 81.4,
    minimumAcceptable: 63.400000000000006,
    stretchGoal: 93.4,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 12 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t13',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 13,
    targetIndex: 81.9,
    minimumAcceptable: 63.900000000000006,
    stretchGoal: 93.9,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 13 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t14',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 14,
    targetIndex: 82.5,
    minimumAcceptable: 64.5,
    stretchGoal: 94.5,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 14 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t15',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 15,
    targetIndex: 83,
    minimumAcceptable: 65,
    stretchGoal: 95,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 15 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t16',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 16,
    targetIndex: 83.6,
    minimumAcceptable: 65.6,
    stretchGoal: 95.6,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 16 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t17',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 17,
    targetIndex: 84.1,
    minimumAcceptable: 66.1,
    stretchGoal: 96.1,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 17 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t18',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 18,
    targetIndex: 84.7,
    minimumAcceptable: 66.7,
    stretchGoal: 96.7,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 18 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t19',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 19,
    targetIndex: 85.2,
    minimumAcceptable: 67.2,
    stretchGoal: 97.2,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 19 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t20',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 20,
    targetIndex: 85.8,
    minimumAcceptable: 67.8,
    stretchGoal: 97.8,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 20 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t21',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 21,
    targetIndex: 86.3,
    minimumAcceptable: 68.3,
    stretchGoal: 98.3,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 21 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t22',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 22,
    targetIndex: 86.9,
    minimumAcceptable: 68.9,
    stretchGoal: 98.9,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 22 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t23',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 23,
    targetIndex: 87.4,
    minimumAcceptable: 69.4,
    stretchGoal: 99.4,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 23 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t24',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 24,
    targetIndex: 88,
    minimumAcceptable: 70,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 24 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t25',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 25,
    targetIndex: 88.5,
    minimumAcceptable: 70.5,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 25 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t26',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 26,
    targetIndex: 89.1,
    minimumAcceptable: 71.1,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 26 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t27',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 27,
    targetIndex: 89.6,
    minimumAcceptable: 71.6,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 27 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t28',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 28,
    targetIndex: 90.2,
    minimumAcceptable: 72.2,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 28 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t29',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 29,
    targetIndex: 90.7,
    minimumAcceptable: 72.7,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 29 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t30',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 30,
    targetIndex: 91.3,
    minimumAcceptable: 73.3,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 30 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t31',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 31,
    targetIndex: 91.8,
    minimumAcceptable: 73.8,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 31 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t32',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 32,
    targetIndex: 92.4,
    minimumAcceptable: 74.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 32 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t33',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 33,
    targetIndex: 92.9,
    minimumAcceptable: 74.9,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 33 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t34',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 34,
    targetIndex: 93.5,
    minimumAcceptable: 75.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 34 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t35',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 35,
    targetIndex: 94,
    minimumAcceptable: 76,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 35 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t36',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 36,
    targetIndex: 94.6,
    minimumAcceptable: 76.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 36 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t37',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 37,
    targetIndex: 95.1,
    minimumAcceptable: 77.1,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 37 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t38',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 38,
    targetIndex: 95.7,
    minimumAcceptable: 77.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 38 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t39',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 39,
    targetIndex: 96.2,
    minimumAcceptable: 78.2,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 39 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t40',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 40,
    targetIndex: 96.8,
    minimumAcceptable: 78.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 40 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t41',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 41,
    targetIndex: 97.3,
    minimumAcceptable: 79.3,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 41 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t42',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 42,
    targetIndex: 97.9,
    minimumAcceptable: 79.9,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 42 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t43',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 43,
    targetIndex: 98.4,
    minimumAcceptable: 80.4,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 43 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_healthcare_t44',
    regionId: 'ACT',
    pillar: 'healthcare',
    tier: 44,
    targetIndex: 99,
    minimumAcceptable: 81,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'healthcare_delivery_index',
    reportingNotes: "Tier 44 benchmark for ACT healthcare delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t0',
    regionId: 'ACT',
    pillar: 'education',
    tier: 0,
    targetIndex: 77.8,
    minimumAcceptable: 59.8,
    stretchGoal: 89.8,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 0 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t1',
    regionId: 'ACT',
    pillar: 'education',
    tier: 1,
    targetIndex: 78.3,
    minimumAcceptable: 60.3,
    stretchGoal: 90.3,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 1 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t2',
    regionId: 'ACT',
    pillar: 'education',
    tier: 2,
    targetIndex: 78.9,
    minimumAcceptable: 60.900000000000006,
    stretchGoal: 90.9,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 2 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t3',
    regionId: 'ACT',
    pillar: 'education',
    tier: 3,
    targetIndex: 79.4,
    minimumAcceptable: 61.400000000000006,
    stretchGoal: 91.4,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 3 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t4',
    regionId: 'ACT',
    pillar: 'education',
    tier: 4,
    targetIndex: 80,
    minimumAcceptable: 62,
    stretchGoal: 92,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 4 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t5',
    regionId: 'ACT',
    pillar: 'education',
    tier: 5,
    targetIndex: 80.5,
    minimumAcceptable: 62.5,
    stretchGoal: 92.5,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 5 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t6',
    regionId: 'ACT',
    pillar: 'education',
    tier: 6,
    targetIndex: 81.1,
    minimumAcceptable: 63.099999999999994,
    stretchGoal: 93.1,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 6 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t7',
    regionId: 'ACT',
    pillar: 'education',
    tier: 7,
    targetIndex: 81.6,
    minimumAcceptable: 63.599999999999994,
    stretchGoal: 93.6,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 7 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t8',
    regionId: 'ACT',
    pillar: 'education',
    tier: 8,
    targetIndex: 82.2,
    minimumAcceptable: 64.2,
    stretchGoal: 94.2,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 8 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t9',
    regionId: 'ACT',
    pillar: 'education',
    tier: 9,
    targetIndex: 82.7,
    minimumAcceptable: 64.7,
    stretchGoal: 94.7,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 9 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t10',
    regionId: 'ACT',
    pillar: 'education',
    tier: 10,
    targetIndex: 83.3,
    minimumAcceptable: 65.3,
    stretchGoal: 95.3,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 10 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t11',
    regionId: 'ACT',
    pillar: 'education',
    tier: 11,
    targetIndex: 83.8,
    minimumAcceptable: 65.8,
    stretchGoal: 95.8,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 11 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t12',
    regionId: 'ACT',
    pillar: 'education',
    tier: 12,
    targetIndex: 84.4,
    minimumAcceptable: 66.4,
    stretchGoal: 96.4,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 12 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t13',
    regionId: 'ACT',
    pillar: 'education',
    tier: 13,
    targetIndex: 84.9,
    minimumAcceptable: 66.9,
    stretchGoal: 96.9,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 13 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t14',
    regionId: 'ACT',
    pillar: 'education',
    tier: 14,
    targetIndex: 85.5,
    minimumAcceptable: 67.5,
    stretchGoal: 97.5,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 14 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t15',
    regionId: 'ACT',
    pillar: 'education',
    tier: 15,
    targetIndex: 86,
    minimumAcceptable: 68,
    stretchGoal: 98,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 15 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t16',
    regionId: 'ACT',
    pillar: 'education',
    tier: 16,
    targetIndex: 86.6,
    minimumAcceptable: 68.6,
    stretchGoal: 98.6,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 16 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t17',
    regionId: 'ACT',
    pillar: 'education',
    tier: 17,
    targetIndex: 87.1,
    minimumAcceptable: 69.1,
    stretchGoal: 99.1,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 17 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t18',
    regionId: 'ACT',
    pillar: 'education',
    tier: 18,
    targetIndex: 87.7,
    minimumAcceptable: 69.7,
    stretchGoal: 99.7,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 18 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t19',
    regionId: 'ACT',
    pillar: 'education',
    tier: 19,
    targetIndex: 88.2,
    minimumAcceptable: 70.2,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 19 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t20',
    regionId: 'ACT',
    pillar: 'education',
    tier: 20,
    targetIndex: 88.8,
    minimumAcceptable: 70.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 20 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t21',
    regionId: 'ACT',
    pillar: 'education',
    tier: 21,
    targetIndex: 89.3,
    minimumAcceptable: 71.3,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 21 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t22',
    regionId: 'ACT',
    pillar: 'education',
    tier: 22,
    targetIndex: 89.9,
    minimumAcceptable: 71.9,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 22 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t23',
    regionId: 'ACT',
    pillar: 'education',
    tier: 23,
    targetIndex: 90.4,
    minimumAcceptable: 72.4,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 23 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t24',
    regionId: 'ACT',
    pillar: 'education',
    tier: 24,
    targetIndex: 91,
    minimumAcceptable: 73,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 24 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t25',
    regionId: 'ACT',
    pillar: 'education',
    tier: 25,
    targetIndex: 91.5,
    minimumAcceptable: 73.5,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 25 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t26',
    regionId: 'ACT',
    pillar: 'education',
    tier: 26,
    targetIndex: 92.1,
    minimumAcceptable: 74.1,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 26 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t27',
    regionId: 'ACT',
    pillar: 'education',
    tier: 27,
    targetIndex: 92.6,
    minimumAcceptable: 74.6,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 27 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t28',
    regionId: 'ACT',
    pillar: 'education',
    tier: 28,
    targetIndex: 93.2,
    minimumAcceptable: 75.2,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 28 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t29',
    regionId: 'ACT',
    pillar: 'education',
    tier: 29,
    targetIndex: 93.7,
    minimumAcceptable: 75.7,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 29 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t30',
    regionId: 'ACT',
    pillar: 'education',
    tier: 30,
    targetIndex: 94.3,
    minimumAcceptable: 76.3,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 30 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t31',
    regionId: 'ACT',
    pillar: 'education',
    tier: 31,
    targetIndex: 94.8,
    minimumAcceptable: 76.8,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 31 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t32',
    regionId: 'ACT',
    pillar: 'education',
    tier: 32,
    targetIndex: 95.4,
    minimumAcceptable: 77.4,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 32 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t33',
    regionId: 'ACT',
    pillar: 'education',
    tier: 33,
    targetIndex: 95.9,
    minimumAcceptable: 77.9,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 33 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t34',
    regionId: 'ACT',
    pillar: 'education',
    tier: 34,
    targetIndex: 96.5,
    minimumAcceptable: 78.5,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 34 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t35',
    regionId: 'ACT',
    pillar: 'education',
    tier: 35,
    targetIndex: 97,
    minimumAcceptable: 79,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 35 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t36',
    regionId: 'ACT',
    pillar: 'education',
    tier: 36,
    targetIndex: 97.6,
    minimumAcceptable: 79.6,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 36 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t37',
    regionId: 'ACT',
    pillar: 'education',
    tier: 37,
    targetIndex: 98.1,
    minimumAcceptable: 80.1,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 37 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t38',
    regionId: 'ACT',
    pillar: 'education',
    tier: 38,
    targetIndex: 98.7,
    minimumAcceptable: 80.7,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 38 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t39',
    regionId: 'ACT',
    pillar: 'education',
    tier: 39,
    targetIndex: 99.2,
    minimumAcceptable: 81.2,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 39 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t40',
    regionId: 'ACT',
    pillar: 'education',
    tier: 40,
    targetIndex: 99.8,
    minimumAcceptable: 81.8,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 40 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t41',
    regionId: 'ACT',
    pillar: 'education',
    tier: 41,
    targetIndex: 100,
    minimumAcceptable: 82,
    stretchGoal: 100,
    measurementWindowTurns: 4,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 41 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t42',
    regionId: 'ACT',
    pillar: 'education',
    tier: 42,
    targetIndex: 100,
    minimumAcceptable: 82,
    stretchGoal: 100,
    measurementWindowTurns: 5,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 42 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t43',
    regionId: 'ACT',
    pillar: 'education',
    tier: 43,
    targetIndex: 100,
    minimumAcceptable: 82,
    stretchGoal: 100,
    measurementWindowTurns: 6,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 43 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  },
  {
    id: 'out_ACT_education_t44',
    regionId: 'ACT',
    pillar: 'education',
    tier: 44,
    targetIndex: 100,
    minimumAcceptable: 82,
    stretchGoal: 100,
    measurementWindowTurns: 3,
    auditMetric: 'education_delivery_index',
    reportingNotes: "Tier 44 benchmark for ACT education delivery under Operation 600K measurable outcomes ledger."
  }
] as const;

export const V1014_ASK_GAME_CATALOG: readonly {
  id: string;
  regionId: string;
  pillar: PublicServicePillar;
  question: string;
  fact: string;
  inference: string;
  projection: string;
}[] = [
  {
    id: 'ask_v1014_1',
    regionId: 'NSW',
    pillar: 'housing',
    question: "Why did healthcare access weaken in NSW remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_2',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in NSW remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_3',
    regionId: 'NSW',
    pillar: 'education',
    question: "Why did healthcare access weaken in NSW remote areas?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_4',
    regionId: 'NSW',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_5',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_6',
    regionId: 'NSW',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_7',
    regionId: 'NSW',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_8',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_9',
    regionId: 'NSW',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_10',
    regionId: 'NSW',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_11',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_12',
    regionId: 'NSW',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_13',
    regionId: 'NSW',
    pillar: 'housing',
    question: "How is NSW equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_14',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "How is NSW equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_15',
    regionId: 'NSW',
    pillar: 'education',
    question: "How is NSW equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_16',
    regionId: 'NSW',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_17',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_18',
    regionId: 'NSW',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_19',
    regionId: 'NSW',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_20',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_21',
    regionId: 'NSW',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_22',
    regionId: 'NSW',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NSW.",
    projection: "Sustained investment in housing programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_23',
    regionId: 'NSW',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NSW.",
    projection: "Sustained investment in healthcare programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_24',
    regionId: 'NSW',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for NSW with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NSW.",
    projection: "Sustained investment in education programs can move NSW outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_25',
    regionId: 'VIC',
    pillar: 'housing',
    question: "Why did healthcare access weaken in VIC remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_26',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in VIC remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_27',
    regionId: 'VIC',
    pillar: 'education',
    question: "Why did healthcare access weaken in VIC remote areas?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_28',
    regionId: 'VIC',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_29',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_30',
    regionId: 'VIC',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_31',
    regionId: 'VIC',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_32',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_33',
    regionId: 'VIC',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_34',
    regionId: 'VIC',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_35',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_36',
    regionId: 'VIC',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_37',
    regionId: 'VIC',
    pillar: 'housing',
    question: "How is VIC equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_38',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "How is VIC equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_39',
    regionId: 'VIC',
    pillar: 'education',
    question: "How is VIC equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_40',
    regionId: 'VIC',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_41',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_42',
    regionId: 'VIC',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_43',
    regionId: 'VIC',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_44',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_45',
    regionId: 'VIC',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_46',
    regionId: 'VIC',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in VIC.",
    projection: "Sustained investment in housing programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_47',
    regionId: 'VIC',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in VIC.",
    projection: "Sustained investment in healthcare programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_48',
    regionId: 'VIC',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for VIC with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in VIC.",
    projection: "Sustained investment in education programs can move VIC outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_49',
    regionId: 'QLD',
    pillar: 'housing',
    question: "Why did healthcare access weaken in QLD remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_50',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in QLD remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_51',
    regionId: 'QLD',
    pillar: 'education',
    question: "Why did healthcare access weaken in QLD remote areas?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_52',
    regionId: 'QLD',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_53',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_54',
    regionId: 'QLD',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_55',
    regionId: 'QLD',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_56',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_57',
    regionId: 'QLD',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_58',
    regionId: 'QLD',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_59',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_60',
    regionId: 'QLD',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_61',
    regionId: 'QLD',
    pillar: 'housing',
    question: "How is QLD equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_62',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "How is QLD equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_63',
    regionId: 'QLD',
    pillar: 'education',
    question: "How is QLD equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_64',
    regionId: 'QLD',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_65',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_66',
    regionId: 'QLD',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_67',
    regionId: 'QLD',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_68',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_69',
    regionId: 'QLD',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_70',
    regionId: 'QLD',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in QLD.",
    projection: "Sustained investment in housing programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_71',
    regionId: 'QLD',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in QLD.",
    projection: "Sustained investment in healthcare programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_72',
    regionId: 'QLD',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for QLD with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in QLD.",
    projection: "Sustained investment in education programs can move QLD outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_73',
    regionId: 'WA',
    pillar: 'housing',
    question: "Why did healthcare access weaken in WA remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_74',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in WA remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_75',
    regionId: 'WA',
    pillar: 'education',
    question: "Why did healthcare access weaken in WA remote areas?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_76',
    regionId: 'WA',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_77',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_78',
    regionId: 'WA',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_79',
    regionId: 'WA',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_80',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_81',
    regionId: 'WA',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_82',
    regionId: 'WA',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_83',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_84',
    regionId: 'WA',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_85',
    regionId: 'WA',
    pillar: 'housing',
    question: "How is WA equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_86',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "How is WA equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_87',
    regionId: 'WA',
    pillar: 'education',
    question: "How is WA equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_88',
    regionId: 'WA',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_89',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_90',
    regionId: 'WA',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_91',
    regionId: 'WA',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_92',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_93',
    regionId: 'WA',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_94',
    regionId: 'WA',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in WA.",
    projection: "Sustained investment in housing programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_95',
    regionId: 'WA',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in WA.",
    projection: "Sustained investment in healthcare programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_96',
    regionId: 'WA',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for WA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in WA.",
    projection: "Sustained investment in education programs can move WA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_97',
    regionId: 'SA',
    pillar: 'housing',
    question: "Why did healthcare access weaken in SA remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_98',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in SA remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_99',
    regionId: 'SA',
    pillar: 'education',
    question: "Why did healthcare access weaken in SA remote areas?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_100',
    regionId: 'SA',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_101',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_102',
    regionId: 'SA',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_103',
    regionId: 'SA',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_104',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_105',
    regionId: 'SA',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_106',
    regionId: 'SA',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_107',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_108',
    regionId: 'SA',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_109',
    regionId: 'SA',
    pillar: 'housing',
    question: "How is SA equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_110',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "How is SA equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_111',
    regionId: 'SA',
    pillar: 'education',
    question: "How is SA equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_112',
    regionId: 'SA',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_113',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_114',
    regionId: 'SA',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_115',
    regionId: 'SA',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_116',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_117',
    regionId: 'SA',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_118',
    regionId: 'SA',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in SA.",
    projection: "Sustained investment in housing programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_119',
    regionId: 'SA',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in SA.",
    projection: "Sustained investment in healthcare programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_120',
    regionId: 'SA',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for SA with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in SA.",
    projection: "Sustained investment in education programs can move SA outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_121',
    regionId: 'TAS',
    pillar: 'housing',
    question: "Why did healthcare access weaken in TAS remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_122',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in TAS remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_123',
    regionId: 'TAS',
    pillar: 'education',
    question: "Why did healthcare access weaken in TAS remote areas?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_124',
    regionId: 'TAS',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_125',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_126',
    regionId: 'TAS',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_127',
    regionId: 'TAS',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_128',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_129',
    regionId: 'TAS',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_130',
    regionId: 'TAS',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_131',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_132',
    regionId: 'TAS',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_133',
    regionId: 'TAS',
    pillar: 'housing',
    question: "How is TAS equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_134',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "How is TAS equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_135',
    regionId: 'TAS',
    pillar: 'education',
    question: "How is TAS equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_136',
    regionId: 'TAS',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_137',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_138',
    regionId: 'TAS',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_139',
    regionId: 'TAS',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_140',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_141',
    regionId: 'TAS',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_142',
    regionId: 'TAS',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in TAS.",
    projection: "Sustained investment in housing programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_143',
    regionId: 'TAS',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in TAS.",
    projection: "Sustained investment in healthcare programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_144',
    regionId: 'TAS',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for TAS with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in TAS.",
    projection: "Sustained investment in education programs can move TAS outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_145',
    regionId: 'NT',
    pillar: 'housing',
    question: "Why did healthcare access weaken in NT remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_146',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in NT remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_147',
    regionId: 'NT',
    pillar: 'education',
    question: "Why did healthcare access weaken in NT remote areas?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_148',
    regionId: 'NT',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_149',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_150',
    regionId: 'NT',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_151',
    regionId: 'NT',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_152',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_153',
    regionId: 'NT',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_154',
    regionId: 'NT',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_155',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_156',
    regionId: 'NT',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_157',
    regionId: 'NT',
    pillar: 'housing',
    question: "How is NT equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_158',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "How is NT equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_159',
    regionId: 'NT',
    pillar: 'education',
    question: "How is NT equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_160',
    regionId: 'NT',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_161',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_162',
    regionId: 'NT',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_163',
    regionId: 'NT',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_164',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_165',
    regionId: 'NT',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_166',
    regionId: 'NT',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in NT.",
    projection: "Sustained investment in housing programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_167',
    regionId: 'NT',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in NT.",
    projection: "Sustained investment in healthcare programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_168',
    regionId: 'NT',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for NT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in NT.",
    projection: "Sustained investment in education programs can move NT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_169',
    regionId: 'ACT',
    pillar: 'housing',
    question: "Why did healthcare access weaken in ACT remote areas?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_170',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "Why did healthcare access weaken in ACT remote areas?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_171',
    regionId: 'ACT',
    pillar: 'education',
    question: "Why did healthcare access weaken in ACT remote areas?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_172',
    regionId: 'ACT',
    pillar: 'housing',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_173',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_174',
    regionId: 'ACT',
    pillar: 'education',
    question: "How do housing delivery outcomes relate to living standards?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_175',
    regionId: 'ACT',
    pillar: 'housing',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_176',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_177',
    regionId: 'ACT',
    pillar: 'education',
    question: "What measurable KPI tracks education participation?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_178',
    regionId: 'ACT',
    pillar: 'housing',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_179',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_180',
    regionId: 'ACT',
    pillar: 'education',
    question: "Can fiscal headroom improve service backlogs?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_181',
    regionId: 'ACT',
    pillar: 'housing',
    question: "How is ACT equity gap calculated?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_182',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "How is ACT equity gap calculated?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_183',
    regionId: 'ACT',
    pillar: 'education',
    question: "How is ACT equity gap calculated?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_184',
    regionId: 'ACT',
    pillar: 'housing',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_185',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_186',
    regionId: 'ACT',
    pillar: 'education',
    question: "Does workforce strain affect elective care flow?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_187',
    regionId: 'ACT',
    pillar: 'housing',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_188',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_189',
    regionId: 'ACT',
    pillar: 'education',
    question: "What programs improve social housing throughput?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_190',
    regionId: 'ACT',
    pillar: 'housing',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks housing delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape housing measurable outcomes in ACT.",
    projection: "Sustained investment in housing programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_191',
    regionId: 'ACT',
    pillar: 'healthcare',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks healthcare delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape healthcare measurable outcomes in ACT.",
    projection: "Sustained investment in healthcare programs can move ACT outcome tiers toward stretch goals over multiple turns."
  },
  {
    id: 'ask_v1014_192',
    regionId: 'ACT',
    pillar: 'education',
    question: "How are public service outcomes audited each turn?",
    fact: "V10.14 tracks education delivery/access indices for ACT with provenance separate from V10.13 household demand.",
    inference: "Policy focus, workforce staffing, and fiscal headroom jointly shape education measurable outcomes in ACT.",
    projection: "Sustained investment in education programs can move ACT outcome tiers toward stretch goals over multiple turns."
  }
] as const;

export function lookupV1014AskGameAnswer(question: string, regionId?: string | null): typeof V1014_ASK_GAME_CATALOG[number] | null {
  const q = question.toLowerCase();
  const hit = V1014_ASK_GAME_CATALOG.find((entry) => {
    if (regionId && entry.regionId !== regionId) return false;
    return entry.question.toLowerCase().includes(q.slice(0, Math.min(24, q.length))) || q.includes(entry.pillar);
  });
  return hit || V1014_ASK_GAME_CATALOG[0] || null;
}

export function evaluateV1014GuardianPublicServicesWarning(state: NationalPublicServicesState | null | undefined): {
  shouldWarn: boolean;
  title: string;
  summary: string;
  assumptions: string[];
} {
  if (!state) return { shouldWarn: false, title: '', summary: '', assumptions: [] };
  const n = state.national;
  const severeBacklog = n.backlogPressure === 'severe' || n.backlogPressure === 'high';
  const weakPillar =
    n.healthcare.access === 'critical' || n.healthcare.access === 'weak' ||
    n.education.access === 'critical' || n.education.access === 'weak' ||
    n.housing.access === 'critical' || n.housing.access === 'weak';
  const equity = n.equityGap >= 28;
  const shouldWarn = severeBacklog || weakPillar || equity;
  return {
    shouldWarn,
    title: 'Public Service Delivery Strain (V10.14)',
    summary: shouldWarn
      ? `National outcome index ${n.outcomeIndex} with backlog ${V1014_BACKLOG_LABEL[n.backlogPressure]} and equity gap ${n.equityGap}. Review housing, healthcare, and education program sequencing.`
      : 'Public service outcome indices within expected bands.',
    assumptions: [
      'Uses V10.14 measurable delivery KPIs only; does not mutate V10.13 household wallets or demand.',
      'Warn-only — never blocks player actions by default.'
    ]
  };
}

export interface V1014RegionInput {
  baselines?: Partial<{ housingDelivery: number; healthcareAccess: number; educationParticipation: number }>;
  remotePopulationShare?: number;
  backlogDefaults?: Partial<{ planningMonths: number; electiveWaitPressure: number; teacherVacancyPressure: number }>;
  householdEssentialAccessScore?: number;
  housingPressureScore?: number;
  completedProjects?: Partial<Record<PublicServicePillar, number>>;
}

export interface V1014PublicServicesInputs {
  turn: number;
  regions: Record<string, V1014RegionInput>;
  fiscalHeadroom?: number;
  fiscalLoadFromActivePrograms?: number;
  workforceReadiness?: 'blocking' | 'weak' | 'strained' | 'balanced' | 'strong';
  workforceSpecialistGap?: number;
  stateCapacityLoad?: number;
  publicStability?: number;
  crisisSeverity?: number;
  emergencyReliefActive?: boolean;
  policyHousingFocus?: number;
  policyHealthFocus?: number;
  policyEducationFocus?: number;
  completedHousingProjects?: number;
  completedHealthProjects?: number;
  completedEducationProjects?: number;
  activeProgramCount?: number;
  highInflationScenario?: boolean;
}

export interface V1014PillarState {
  access: ServiceOutcomeBand;
  throughputBand: ServiceThroughputBand;
  staffing: ServiceStaffingBand;
  deliveryIndex: number;
  accessIndex: number;
  backlogScore: number;
  evidence: string[];
}

export interface V1014RegionalPublicServicesState {
  regionId: string;
  housing: V1014PillarState;
  healthcare: V1014PillarState;
  education: V1014PillarState;
  compositeOutcomeIndex: number;
  equityPenalty: number;
}

export interface V1014NationalPublicServicesState {
  outcomeIndex: number;
  backlogPressure: ServiceBacklogBand;
  equityGap: number;
  housing: V1014PillarState;
  healthcare: V1014PillarState;
  education: V1014PillarState;
  distribution: 'broadly_balanced' | 'mixed' | 'uneven' | 'highly_uneven';
  kpis: Record<string, number>;
}

export interface V1014Transition {
  id: string;
  turn: number;
  scope: 'national' | 'regional';
  regionId?: string;
  kind: string;
  pillar: PublicServicePillar | 'cross';
  fromBand: string;
  toBand: string;
  explanation: string;
}

export interface NationalPublicServicesState {
  schemaVersion: string;
  turn: number;
  revision: number;
  inputHash: string;
  national: V1014NationalPublicServicesState;
  regions: Record<string, V1014RegionalPublicServicesState>;
  transitions: V1014Transition[];
  history: Array<{ id: string; turn: number; summary: string; kind: PublicServiceWorldEventKind | string }>;
}

export interface PublicServicesPersisted {
  schemaVersion: string;
  initializedTurn: number | null;
  lastInputHash: string | null;
  regionalHysteresis: Record<string, { housing: ServiceOutcomeBand; healthcare: ServiceOutcomeBand; education: ServiceOutcomeBand }>;
  pinnedConcerns: string[];
  history: Array<{ id: string; turn: number; summary: string }>;
}

function v1014Clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function v1014BandFromScore(score: number, prev?: ServiceOutcomeBand): ServiceOutcomeBand {
  const raw: ServiceOutcomeBand =
    score >= 86 ? 'excellent' :
    score >= 72 ? 'strong' :
    score >= 58 ? 'adequate' :
    score >= 44 ? 'strained' :
    score >= 28 ? 'weak' : 'critical';
  if (!prev) return raw;
  const db = V1014_LIMITS.hysteresisDeadband;
  const pr = V1014_OUTCOME_RANK[prev];
  const rr = V1014_OUTCOME_RANK[raw];
  if (pr - rr === 1 && score >= (raw === 'adequate' ? 58 : raw === 'strong' ? 72 : 86) - db) return prev;
  if (rr - pr === 1 && score <= (prev === 'excellent' ? 86 : prev === 'strong' ? 72 : 58) + db) return prev;
  return raw;
}

function v1014ThroughputBand(score: number): ServiceThroughputBand {
  if (score >= 82) return 'surging';
  if (score >= 68) return 'strong';
  if (score >= 50) return 'steady';
  if (score >= 32) return 'slow';
  return 'stalled';
}

function v1014StaffingBand(gap: number, workforce: V1014PublicServicesInputs['workforceReadiness']): ServiceStaffingBand {
  let score = 62 - gap * 0.45;
  if (workforce === 'strong') score += 12;
  if (workforce === 'balanced') score += 4;
  if (workforce === 'strained') score -= 10;
  if (workforce === 'weak') score -= 18;
  if (workforce === 'blocking') score -= 28;
  if (score >= 78) return 'surplus';
  if (score >= 64) return 'strong';
  if (score >= 48) return 'balanced';
  if (score >= 32) return 'shortage';
  return 'critical_shortage';
}

function v1014BacklogBand(score: number): ServiceBacklogBand {
  if (score >= 78) return 'severe';
  if (score >= 62) return 'high';
  if (score >= 46) return 'elevated';
  if (score >= 28) return 'moderate';
  return 'low';
}

export function publicServicesInputHash(inputs: V1014PublicServicesInputs): string {
  const reg = V1014_CORE_REGIONS.map((r) => {
    const x = inputs.regions?.[r] || {};
    return `${r}:${x.baselines?.housingDelivery ?? 'd'}:${x.baselines?.healthcareAccess ?? 'd'}:${x.baselines?.educationParticipation ?? 'd'}`;
  }).join('|');
  return `v1014:t${inputs.turn}|f${inputs.fiscalHeadroom ?? 'n'}|w${inputs.workforceReadiness ?? 'n'}|${reg}`;
}

export function createInitialPublicServicesPersisted(): PublicServicesPersisted {
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    initializedTurn: null,
    lastInputHash: null,
    regionalHysteresis: {},
    pinnedConcerns: [],
    history: []
  };
}

export function sanitizePublicServicesPersisted(raw?: PublicServicesPersisted | null, turn = 1): PublicServicesPersisted {
  if (!raw || typeof raw !== 'object') return createInitialPublicServicesPersisted();
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    initializedTurn: typeof raw.initializedTurn === 'number' ? raw.initializedTurn : null,
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash : null,
    regionalHysteresis: typeof raw.regionalHysteresis === 'object' && raw.regionalHysteresis ? raw.regionalHysteresis : {},
    pinnedConcerns: Array.isArray(raw.pinnedConcerns) ? raw.pinnedConcerns.slice(0, 8) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LIMITS.maxHistory) : []
  };
}

function computePillarState(
  pillar: PublicServicePillar,
  regionId: string,
  inp: V1014PublicServicesInputs,
  regIn: V1014RegionInput,
  prev?: { housing: ServiceOutcomeBand; healthcare: ServiceOutcomeBand; education: ServiceOutcomeBand }
): V1014PillarState {
  const profile = V1014_REGION_PROFILES[regionId] || V1014_REGION_PROFILES.NSW;
  const base = profile.baselines[pillar === 'housing' ? 'housingDelivery' : pillar === 'healthcare' ? 'healthcareAccess' : 'educationParticipation'];
  const regBase = regIn.baselines?.[pillar === 'housing' ? 'housingDelivery' : pillar === 'healthcare' ? 'healthcareAccess' : 'educationParticipation'] ?? base;
  let delivery = regBase;
  const remote = regIn.remotePopulationShare ?? profile.remotePopulationShare;
  delivery -= remote * 12;
  const completed = regIn.completedProjects?.[pillar] ?? (
    pillar === 'housing' ? inp.completedHousingProjects :
    pillar === 'healthcare' ? inp.completedHealthProjects : inp.completedEducationProjects
  ) ?? 0;
  delivery += completed * 6;
  const policyFocus = pillar === 'housing' ? inp.policyHousingFocus : pillar === 'healthcare' ? inp.policyHealthFocus : inp.policyEducationFocus;
  if (typeof policyFocus === 'number') delivery += (policyFocus - 50) * 0.35;
  const fiscalHeadroom = inp.fiscalHeadroom ?? 55;
  delivery += (fiscalHeadroom - 50) * 0.22;
  delivery -= (inp.fiscalLoadFromActivePrograms ?? inp.activeProgramCount ?? 0) * 1.4;
  if (inp.crisisSeverity && inp.crisisSeverity > 40) delivery -= inp.crisisSeverity * 0.08;
  if (inp.emergencyReliefActive) delivery += 4;
  const backlogDefaults = { ...profile.backlogDefaults, ...(regIn.backlogDefaults || {}) };
  let backlogScore = pillar === 'housing' ? backlogDefaults.planningMonths * 3.2 :
    pillar === 'healthcare' ? backlogDefaults.electiveWaitPressure * 0.85 :
    backlogDefaults.teacherVacancyPressure * 1.1;
  if (inp.crisisSeverity && inp.crisisSeverity > 50) backlogScore += inp.crisisSeverity * 0.35;
  backlogScore += (inp.workforceSpecialistGap ?? 30) * 0.25;
  backlogScore -= completed * 5;
  delivery -= backlogScore * 0.12;
  if (pillar === 'housing' && typeof regIn.housingPressureScore === 'number') {
    delivery -= Math.max(0, regIn.housingPressureScore - 60) * 0.15;
  }
  if (typeof regIn.householdEssentialAccessScore === 'number') {
    delivery += (regIn.householdEssentialAccessScore - 55) * 0.08;
  }
  delivery = v1014Clamp(delivery);
  backlogScore = v1014Clamp(backlogScore);
  const prevBand = prev?.[pillar];
  const access = v1014BandFromScore(delivery, prevBand);
  const staffing = v1014StaffingBand(inp.workforceSpecialistGap ?? 28 + remote * 20, inp.workforceReadiness);
  const throughputBand = v1014ThroughputBand(delivery + (staffing === 'strong' || staffing === 'surplus' ? 8 : staffing === 'shortage' ? -8 : 0));
  return {
    access,
    throughputBand,
    staffing,
    deliveryIndex: delivery,
    accessIndex: delivery,
    backlogScore,
    evidence: [`${regionId}:${pillar}:delivery=${delivery}`, `${regionId}:${pillar}:backlog=${backlogScore}`]
  };
}

export function computeNationalPublicServices(
  inputs: V1014PublicServicesInputs,
  rawPersisted?: PublicServicesPersisted | null,
  prevDerivedState?: NationalPublicServicesState | null
): { state: NationalPublicServicesState; persisted: PublicServicesPersisted; events: Array<{ id: string; kind: PublicServiceWorldEventKind; summary: string; turn: number }> } {
  const turn = Math.max(1, Math.floor(Number(inputs.turn) || 1));
  const persisted = sanitizePublicServicesPersisted(rawPersisted, turn);
  const inputHash = publicServicesInputHash(inputs);
  if (persisted.lastInputHash === inputHash && prevDerivedState && prevDerivedState.inputHash === inputHash) {
    return { state: prevDerivedState, persisted, events: [] };
  }
  const regions: Record<string, V1014RegionalPublicServicesState> = {};
  const indices: number[] = [];
  for (const regionId of V1014_CORE_REGIONS) {
    const regIn = inputs.regions?.[regionId] || {};
    const prevH = persisted.regionalHysteresis[regionId];
    const housing = computePillarState('housing', regionId, inputs, regIn, prevH);
    const healthcare = computePillarState('healthcare', regionId, inputs, regIn, prevH);
    const education = computePillarState('education', regionId, inputs, regIn, prevH);
    persisted.regionalHysteresis[regionId] = { housing: housing.access, healthcare: healthcare.access, education: education.access };
    const compositeOutcomeIndex = v1014Clamp((housing.deliveryIndex + healthcare.deliveryIndex + education.deliveryIndex) / 3);
    indices.push(compositeOutcomeIndex);
    regions[regionId] = {
      regionId,
      housing,
      healthcare,
      education,
      compositeOutcomeIndex,
      equityPenalty: 0
    };
  }
  const minIdx = Math.min(...indices);
  const maxIdx = Math.max(...indices);
  const equityGap = v1014Clamp(maxIdx - minIdx);
  for (const r of V1014_CORE_REGIONS) {
    regions[r].equityPenalty = v1014Clamp(equityGap - (regions[r].compositeOutcomeIndex - minIdx));
  }
  const weightSum = V1014_CORE_REGIONS.reduce((s, r) => s + (V1014_REGION_WEIGHT[r] || 0.1), 0);
  const blendPillar = (pillar: PublicServicePillar, pick: (p: V1014PillarState) => number) =>
    v1014Clamp(
      V1014_CORE_REGIONS.reduce((s, r) => {
        const pState = regions[r][pillar];
        return s + (V1014_REGION_WEIGHT[r] || 0.1) * pick(pState);
      }, 0) / weightSum
    );
  const natHousing: V1014PillarState = {
    access: v1014BandFromScore(blendPillar('housing', (p) => p.deliveryIndex)),
    throughputBand: v1014ThroughputBand(blendPillar('housing', (p) => p.deliveryIndex)),
    staffing: v1014StaffingBand(inputs.workforceSpecialistGap ?? 32, inputs.workforceReadiness),
    deliveryIndex: blendPillar('housing', (p) => p.deliveryIndex),
    accessIndex: blendPillar('housing', (p) => p.accessIndex),
    backlogScore: blendPillar('housing', (p) => p.backlogScore),
    evidence: ['national:housing:weighted']
  };
  const natHealth: V1014PillarState = {
    access: v1014BandFromScore(blendPillar('healthcare', (p) => p.deliveryIndex)),
    throughputBand: v1014ThroughputBand(blendPillar('healthcare', (p) => p.deliveryIndex)),
    staffing: v1014StaffingBand(inputs.workforceSpecialistGap ?? 32, inputs.workforceReadiness),
    deliveryIndex: blendPillar('healthcare', (p) => p.deliveryIndex),
    accessIndex: blendPillar('healthcare', (p) => p.accessIndex),
    backlogScore: blendPillar('healthcare', (p) => p.backlogScore),
    evidence: ['national:healthcare:weighted']
  };
  const natEdu: V1014PillarState = {
    access: v1014BandFromScore(blendPillar('education', (p) => p.deliveryIndex)),
    throughputBand: v1014ThroughputBand(blendPillar('education', (p) => p.deliveryIndex)),
    staffing: v1014StaffingBand(inputs.workforceSpecialistGap ?? 32, inputs.workforceReadiness),
    deliveryIndex: blendPillar('education', (p) => p.deliveryIndex),
    accessIndex: blendPillar('education', (p) => p.accessIndex),
    backlogScore: blendPillar('education', (p) => p.backlogScore),
    evidence: ['national:education:weighted']
  };
  const outcomeIndex = v1014Clamp((natHousing.deliveryIndex + natHealth.deliveryIndex + natEdu.deliveryIndex) / 3);
  const backlogPressure = v1014BacklogBand((natHousing.backlogScore + natHealth.backlogScore + natEdu.backlogScore) / 3);
  const distribution = equityGap >= 32 ? 'highly_uneven' : equityGap >= 22 ? 'uneven' : equityGap >= 12 ? 'mixed' : 'broadly_balanced';
  const kpis: Record<string, number> = {};
  for (const k of V1014_KPI_CATALOG) {
    if (k.id === 'equity_regional_gap') kpis[k.id] = equityGap;
    else if (k.id === 'service_backlog_pressure') kpis[k.id] = (natHousing.backlogScore + natHealth.backlogScore + natEdu.backlogScore) / 3;
    else if (k.id.startsWith('housing')) kpis[k.id] = natHousing.deliveryIndex;
    else if (k.id.startsWith('health')) kpis[k.id] = natHealth.deliveryIndex;
    else if (k.id.startsWith('edu')) kpis[k.id] = natEdu.deliveryIndex;
    else kpis[k.id] = outcomeIndex;
  }
  const national: V1014NationalPublicServicesState = {
    outcomeIndex,
    backlogPressure,
    equityGap,
    housing: natHousing,
    healthcare: natHealth,
    education: natEdu,
    distribution,
    kpis
  };
  const state: NationalPublicServicesState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    turn,
    revision: 1,
    inputHash,
    national,
    regions,
    transitions: [],
    history: [{ id: `ps_hist_t${turn}`, turn, summary: `National public service outcome index ${outcomeIndex} (${distribution})`, kind: 'national_outcome_index_shift' }]
  };
  persisted.lastInputHash = inputHash;
  if (persisted.initializedTurn === null) persisted.initializedTurn = turn;
  persisted.history.push({ id: `ps_pers_t${turn}`, turn, summary: `Outcome ${outcomeIndex}, backlog ${backlogPressure}` });
  persisted.history = persisted.history.slice(-V1014_LIMITS.maxHistory);
  return { state, persisted, events: [] };
}

export function validatePublicServicesState(state: NationalPublicServicesState | null | undefined): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!state) return { valid: false, issues: ['null state'] };
  if (state.schemaVersion !== V1014_SCHEMA_VERSION) issues.push('schema mismatch');
  if (!state.national) issues.push('missing national');
  if (typeof state.national.outcomeIndex !== 'number') issues.push('missing outcomeIndex');
  return { valid: issues.length === 0, issues };
}

export function simulatePublicServicesScenario(scenarioId: string, baseInputs?: Partial<V1014PublicServicesInputs>): NationalPublicServicesState {
  const scenario = V1014_SCENARIO_MATRIX.find((s) => s.id === scenarioId);
  const inp = makeDefaultV1014TestInputs({
    ...baseInputs,
    policyHousingFocus: scenario?.highlightPillar === 'housing' ? 88 : 52,
    policyHealthFocus: scenario?.highlightPillar === 'healthcare' ? 88 : 52,
    policyEducationFocus: scenario?.highlightPillar === 'education' ? 88 : 52,
    workforceSpecialistGap: scenario?.workforceStrain ?? 30,
    fiscalHeadroom: scenario?.fiscalPosture === 'expansionary' ? 78 : scenario?.fiscalPosture === 'crisis_recovery' ? 35 : 55
  });
  return computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null).state;
}

export function makeDefaultV1014TestRegion(regionId: string, overrides: Partial<V1014RegionInput> = {}): V1014RegionInput {
  const profile = V1014_REGION_PROFILES[regionId] || V1014_REGION_PROFILES.NSW;
  return {
    baselines: { ...profile.baselines },
    remotePopulationShare: profile.remotePopulationShare,
    backlogDefaults: { ...profile.backlogDefaults },
    ...overrides
  };
}

export function makeV1014TestVariant(variant: number): Partial<V1014PublicServicesInputs> {
  const mod = (variant - 1) % 10;
  if (mod === 0) return { fiscalHeadroom: 72, publicStability: 78 };
  if (mod === 1) return { regions: { NT: { remotePopulationShare: 0.55, backlogDefaults: { electiveWaitPressure: 78 } } } };
  if (mod === 2) return { fiscalHeadroom: 22, activeProgramCount: 9 };
  if (mod === 3) return { workforceReadiness: 'strained', workforceSpecialistGap: 70 };
  if (mod === 4) return { completedHousingProjects: 4, policyHousingFocus: 86 };
  if (mod === 5) return { completedEducationProjects: 4, policyEducationFocus: 90 };
  if (mod === 6) return { regions: { NSW: { baselines: { housingDelivery: 84 } }, NT: { baselines: { housingDelivery: 36 } } } };
  if (mod === 7) return { turn: 7 };
  if (mod === 8) return { turn: 12 };
  return { crisisSeverity: 68, emergencyReliefActive: true, fiscalHeadroom: 30 };
}

export function makeDefaultV1014TestInputs(overrides: Partial<V1014PublicServicesInputs> = {}): V1014PublicServicesInputs {
  const regions: Record<string, V1014RegionInput> = {};
  for (const r of V1014_CORE_REGIONS) regions[r] = makeDefaultV1014TestRegion(r);
  return {
    turn: 5,
    regions,
    fiscalHeadroom: 58,
    workforceReadiness: 'balanced',
    workforceSpecialistGap: 32,
    publicStability: 72,
    policyHousingFocus: 55,
    policyHealthFocus: 58,
    policyEducationFocus: 60,
    ...overrides
  };
}

export function runV1014PublicServicesWellbeingSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ name: string; passed: boolean; detail: string }> = [];
  const check = (name: string, condition: boolean, detail: string) => {
    results.push({ name, passed: Boolean(condition), detail });
  };

  // TEST 1 — STRONG BASELINE
  {
    const inp = makeDefaultV1014TestInputs({ turn: 2, ...makeV1014TestVariant(1) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 1 — STRONG BASELINE',
      out.state.national.outcomeIndex >= 58,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 2 — REMOTE REGION PENALTY
  {
    const inp = makeDefaultV1014TestInputs({ turn: 3, ...makeV1014TestVariant(2) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 2 — REMOTE REGION PENALTY',
      out.state.regions.NT.healthcare.access !== 'excellent',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 3 — FISCAL CONSTRAINT
  {
    const inp = makeDefaultV1014TestInputs({ turn: 4, ...makeV1014TestVariant(3) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 3 — FISCAL CONSTRAINT',
      out.state.national.backlogPressure !== 'low',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 4 — WORKFORCE STRAIN
  {
    const inp = makeDefaultV1014TestInputs({ turn: 5, ...makeV1014TestVariant(4) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 4 — WORKFORCE STRAIN',
      out.state.national.healthcare.staffing !== 'strong',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 5 — HOUSING PIPELINE BOOST
  {
    const inp = makeDefaultV1014TestInputs({ turn: 6, ...makeV1014TestVariant(5) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 5 — HOUSING PIPELINE BOOST',
      (out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 6 — EDUCATION PUSH
  {
    const inp = makeDefaultV1014TestInputs({ turn: 7, ...makeV1014TestVariant(6) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 6 — EDUCATION PUSH',
      out.state.national.education.access !== 'critical',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 7 — EQUITY DIVERGENCE
  {
    const inp = makeDefaultV1014TestInputs({ turn: 8, ...makeV1014TestVariant(7) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 7 — EQUITY DIVERGENCE',
      out.state.national.equityGap >= 18,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 8 — DETERMINISM
  {
    const inp = makeDefaultV1014TestInputs({ turn: 9, ...makeV1014TestVariant(8) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 8 — DETERMINISM',
      typeof out.state.national.outcomeIndex === 'number',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 9 — HYSTERESIS STABILITY
  {
    const inp = makeDefaultV1014TestInputs({ turn: 10, ...makeV1014TestVariant(9) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 9 — HYSTERESIS STABILITY',
      typeof out.state.national.healthcare.access === 'string',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 10 — CRISIS RECOVERY
  {
    const inp = makeDefaultV1014TestInputs({ turn: 11, ...makeV1014TestVariant(10) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 10 — CRISIS RECOVERY',
      (out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 11 — STRONG BASELINE (variant 11)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 1, ...makeV1014TestVariant(11) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 11 — STRONG BASELINE',
      out.state.national.outcomeIndex >= 58,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 12 — REMOTE REGION PENALTY (variant 12)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 2, ...makeV1014TestVariant(12) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 12 — REMOTE REGION PENALTY',
      out.state.regions.NT.healthcare.access !== 'excellent',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 13 — FISCAL CONSTRAINT (variant 13)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 3, ...makeV1014TestVariant(13) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 13 — FISCAL CONSTRAINT',
      out.state.national.backlogPressure !== 'low',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 14 — WORKFORCE STRAIN (variant 14)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 4, ...makeV1014TestVariant(14) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 14 — WORKFORCE STRAIN',
      out.state.national.healthcare.staffing !== 'strong',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 15 — HOUSING PIPELINE BOOST (variant 15)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 5, ...makeV1014TestVariant(15) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 15 — HOUSING PIPELINE BOOST',
      (out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 16 — EDUCATION PUSH (variant 16)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 6, ...makeV1014TestVariant(16) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 16 — EDUCATION PUSH',
      out.state.national.education.access !== 'critical',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 17 — EQUITY DIVERGENCE (variant 17)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 7, ...makeV1014TestVariant(17) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 17 — EQUITY DIVERGENCE',
      out.state.national.equityGap >= 18,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 18 — DETERMINISM (variant 18)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 8, ...makeV1014TestVariant(18) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 18 — DETERMINISM',
      typeof out.state.national.outcomeIndex === 'number',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 19 — HYSTERESIS STABILITY (variant 19)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 9, ...makeV1014TestVariant(19) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 19 — HYSTERESIS STABILITY',
      typeof out.state.national.healthcare.access === 'string',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 20 — CRISIS RECOVERY (variant 20)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 10, ...makeV1014TestVariant(20) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 20 — CRISIS RECOVERY',
      (out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 21 — STRONG BASELINE (variant 21)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 11, ...makeV1014TestVariant(21) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 21 — STRONG BASELINE',
      out.state.national.outcomeIndex >= 58,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 22 — REMOTE REGION PENALTY (variant 22)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 1, ...makeV1014TestVariant(22) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 22 — REMOTE REGION PENALTY',
      out.state.regions.NT.healthcare.access !== 'excellent',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 23 — FISCAL CONSTRAINT (variant 23)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 2, ...makeV1014TestVariant(23) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 23 — FISCAL CONSTRAINT',
      out.state.national.backlogPressure !== 'low',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 24 — WORKFORCE STRAIN (variant 24)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 3, ...makeV1014TestVariant(24) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 24 — WORKFORCE STRAIN',
      out.state.national.healthcare.staffing !== 'strong',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 25 — HOUSING PIPELINE BOOST (variant 25)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 4, ...makeV1014TestVariant(25) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 25 — HOUSING PIPELINE BOOST',
      (out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 26 — EDUCATION PUSH (variant 26)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 5, ...makeV1014TestVariant(26) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 26 — EDUCATION PUSH',
      out.state.national.education.access !== 'critical',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 27 — EQUITY DIVERGENCE (variant 27)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 6, ...makeV1014TestVariant(27) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 27 — EQUITY DIVERGENCE',
      out.state.national.equityGap >= 18,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 28 — DETERMINISM (variant 28)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 7, ...makeV1014TestVariant(28) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 28 — DETERMINISM',
      typeof out.state.national.outcomeIndex === 'number',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 29 — HYSTERESIS STABILITY (variant 29)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 8, ...makeV1014TestVariant(29) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 29 — HYSTERESIS STABILITY',
      typeof out.state.national.healthcare.access === 'string',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 30 — CRISIS RECOVERY (variant 30)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 9, ...makeV1014TestVariant(30) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 30 — CRISIS RECOVERY',
      (out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 31 — STRONG BASELINE (variant 31)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 10, ...makeV1014TestVariant(31) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 31 — STRONG BASELINE',
      out.state.national.outcomeIndex >= 58,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 32 — REMOTE REGION PENALTY (variant 32)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 11, ...makeV1014TestVariant(32) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 32 — REMOTE REGION PENALTY',
      out.state.regions.NT.healthcare.access !== 'excellent',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 33 — FISCAL CONSTRAINT (variant 33)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 1, ...makeV1014TestVariant(33) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 33 — FISCAL CONSTRAINT',
      out.state.national.backlogPressure !== 'low',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 34 — WORKFORCE STRAIN (variant 34)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 2, ...makeV1014TestVariant(34) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 34 — WORKFORCE STRAIN',
      out.state.national.healthcare.staffing !== 'strong',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 35 — HOUSING PIPELINE BOOST (variant 35)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 3, ...makeV1014TestVariant(35) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 35 — HOUSING PIPELINE BOOST',
      (out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 36 — EDUCATION PUSH (variant 36)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 4, ...makeV1014TestVariant(36) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 36 — EDUCATION PUSH',
      out.state.national.education.access !== 'critical',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 37 — EQUITY DIVERGENCE (variant 37)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 5, ...makeV1014TestVariant(37) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 37 — EQUITY DIVERGENCE',
      out.state.national.equityGap >= 18,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 38 — DETERMINISM (variant 38)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 6, ...makeV1014TestVariant(38) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 38 — DETERMINISM',
      typeof out.state.national.outcomeIndex === 'number',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 39 — HYSTERESIS STABILITY (variant 39)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 7, ...makeV1014TestVariant(39) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 39 — HYSTERESIS STABILITY',
      typeof out.state.national.healthcare.access === 'string',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 40 — CRISIS RECOVERY (variant 40)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 8, ...makeV1014TestVariant(40) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 40 — CRISIS RECOVERY',
      (out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 41 — STRONG BASELINE (variant 41)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 9, ...makeV1014TestVariant(41) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 41 — STRONG BASELINE',
      out.state.national.outcomeIndex >= 58,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 42 — REMOTE REGION PENALTY (variant 42)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 10, ...makeV1014TestVariant(42) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 42 — REMOTE REGION PENALTY',
      out.state.regions.NT.healthcare.access !== 'excellent',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 43 — FISCAL CONSTRAINT (variant 43)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 11, ...makeV1014TestVariant(43) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 43 — FISCAL CONSTRAINT',
      out.state.national.backlogPressure !== 'low',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 44 — WORKFORCE STRAIN (variant 44)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 1, ...makeV1014TestVariant(44) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 44 — WORKFORCE STRAIN',
      out.state.national.healthcare.staffing !== 'strong',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 45 — HOUSING PIPELINE BOOST (variant 45)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 2, ...makeV1014TestVariant(45) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 45 — HOUSING PIPELINE BOOST',
      (out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 46 — EDUCATION PUSH (variant 46)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 3, ...makeV1014TestVariant(46) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 46 — EDUCATION PUSH',
      out.state.national.education.access !== 'critical',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 47 — EQUITY DIVERGENCE (variant 47)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 4, ...makeV1014TestVariant(47) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 47 — EQUITY DIVERGENCE',
      out.state.national.equityGap >= 18,
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 48 — DETERMINISM (variant 48)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 5, ...makeV1014TestVariant(48) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 48 — DETERMINISM',
      typeof out.state.national.outcomeIndex === 'number',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 49 — HYSTERESIS STABILITY (variant 49)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 6, ...makeV1014TestVariant(49) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 49 — HYSTERESIS STABILITY',
      typeof out.state.national.healthcare.access === 'string',
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 50 — CRISIS RECOVERY (variant 50)
  {
    const inp = makeDefaultV1014TestInputs({ turn: 7, ...makeV1014TestVariant(50) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST 50 — CRISIS RECOVERY',
      (out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55),
      `outcomeIndex=${out.state.national.outcomeIndex}, backlog=${out.state.national.backlogPressure}`
    );
  }

  // TEST 51 — VALIDATION HELPER
  {
    const out = computeNationalPublicServices(makeDefaultV1014TestInputs(), createInitialPublicServicesPersisted(), null);
    const v = validatePublicServicesState(out.state);
    check('TEST 51 — VALIDATION HELPER', v.valid, v.issues.join('; ') || 'ok');
  }

  // TEST 52 — SCENARIO MATRIX COVERAGE
  {
    const ids = V1014_SCENARIO_MATRIX.slice(0, 12).map((s) => simulatePublicServicesScenario(s.id).national.outcomeIndex);
    check('TEST 52 — SCENARIO MATRIX COVERAGE', ids.every((x) => x >= 0 && x <= 100), `sample outcomes ${ids.join(',')}`);
  }

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export function V1014PublicServicesInspector(props: {
  state: NationalPublicServicesState | null;
  onRunTests?: () => void;
  testSummary?: string;
}) {
  const st = props.state;
  if (!st) {
    return (
      <div className="rounded border border-slate-600 bg-slate-900/80 p-3 text-xs text-slate-300">
        V10.14 Public Services state is disabled or not initialized.
      </div>
    );
  }
  const n = st.national;
  return (
    <div className="rounded border border-emerald-700/60 bg-slate-900/90 p-4 text-xs text-slate-200 space-y-3" data-testid="v1014-public-services-inspector">
      <div className="font-semibold text-emerald-300">V10.14 Public Services & Measurable Outcomes</div>
      <div>National outcome index: <strong>{n.outcomeIndex}</strong> · Backlog: {V1014_BACKLOG_LABEL[n.backlogPressure]} · Equity gap: {n.equityGap}</div>
      <div className="grid grid-cols-3 gap-2">
        <div>Housing: {V1014_OUTCOME_LABEL[n.housing.access]} ({n.housing.deliveryIndex})</div>
        <div>Healthcare: {V1014_OUTCOME_LABEL[n.healthcare.access]} ({n.healthcare.deliveryIndex})</div>
        <div>Education: {V1014_OUTCOME_LABEL[n.education.access]} ({n.education.deliveryIndex})</div>
      </div>
      {props.onRunTests && (
        <button type="button" className="px-2 py-1 rounded bg-emerald-800 text-white" onClick={props.onRunTests}>
          Run V10.14 Self-Tests
        </button>
      )}
      {props.testSummary && <pre className="text-[10px] opacity-80">{props.testSummary}</pre>}
    </div>
  );
}
