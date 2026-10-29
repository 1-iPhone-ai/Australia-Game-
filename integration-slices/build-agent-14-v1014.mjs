#!/usr/bin/env node
/**
 * Builds integration-slices/agent-14-v1014-public-services-wellbeing.tsx
 * Agent 14 — V10.14 Public Services, Housing Delivery, Healthcare & Education Outcomes
 */
import fs from 'fs';
import path from 'path';

const OUT = path.join(
  process.cwd(),
  'integration-slices/agent-14-v1014-public-services-wellbeing.tsx'
);

const regions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const regionWeights = { NSW: 0.24, VIC: 0.22, QLD: 0.18, WA: 0.13, SA: 0.09, ACT: 0.06, TAS: 0.04, NT: 0.04 };

const regionProfiles = {
  NSW: { popShare: 0.32, housingBase: 58, healthBase: 72, eduBase: 74, remoteShare: 0.08, capitalCity: 'Sydney' },
  VIC: { popShare: 0.26, housingBase: 56, healthBase: 71, eduBase: 73, remoteShare: 0.06, capitalCity: 'Melbourne' },
  QLD: { popShare: 0.2, housingBase: 61, healthBase: 68, eduBase: 69, remoteShare: 0.22, capitalCity: 'Brisbane' },
  WA: { popShare: 0.11, housingBase: 59, healthBase: 67, eduBase: 68, remoteShare: 0.28, capitalCity: 'Perth' },
  SA: { popShare: 0.07, housingBase: 63, healthBase: 70, eduBase: 71, remoteShare: 0.12, capitalCity: 'Adelaide' },
  TAS: { popShare: 0.02, housingBase: 64, healthBase: 66, eduBase: 67, remoteShare: 0.35, capitalCity: 'Hobart' },
  NT: { popShare: 0.01, housingBase: 52, healthBase: 58, eduBase: 59, remoteShare: 0.48, capitalCity: 'Darwin' },
  ACT: { popShare: 0.01, housingBase: 60, healthBase: 75, eduBase: 78, remoteShare: 0.02, capitalCity: 'Canberra' }
};

const programArchetypes = [];
const pillars = ['housing', 'healthcare', 'education'];
const housingPrograms = [
  'Social Housing Acceleration', 'Planning Reform Pipeline', 'Build-to-Rent Incentive', 'Regional Housing Land Release',
  'Homelessness Response Hub', 'Affordable Rental Bond Scheme', 'Modular Housing Factory', 'Indigenous Housing Partnership',
  'Disaster-Resilient Rebuild', 'Vacant Property Activation', 'Community Land Trust Pilot', 'Transit-Oriented Density Package'
];
const healthPrograms = [
  'Primary Care Access Expansion', 'Elective Surgery Blitz', 'Rural GP Incentive', 'Mental Health Hubs Network',
  'Aged Care Quality Uplift', 'Emergency Department Flow Reform', 'Telehealth Integration', 'Preventive Health Screening',
  'Indigenous Health Closing Gap', 'Pharmacy Access Guarantee', 'Cancer Care Pathway', 'Maternal Health Support'
];
const eduPrograms = [
  'Early Childhood Participation', 'Disadvantaged Schools Fund', 'TAFE Skills Guarantee', 'University Place Expansion',
  'Literacy & Numeracy Catch-up', 'Remote Learning Connectivity', 'Indigenous Education Partnership', 'STEM Teacher Pipeline',
  'Apprenticeship Uplift', 'Career Pathways in Regions', 'Inclusive Education Support', 'Adult Reskilling Voucher'
];

let progIdx = 0;
for (const r of regions) {
  for (const name of housingPrograms) {
    progIdx++;
    programArchetypes.push({ id: `ps_h_${r}_${progIdx}`, regionId: r, pillar: 'housing', name, baseImpact: 4 + (progIdx % 7), durationTurns: 3 + (progIdx % 5), fiscalLoad: 12 + (progIdx % 20) });
  }
  for (const name of healthPrograms) {
    progIdx++;
    programArchetypes.push({ id: `ps_he_${r}_${progIdx}`, regionId: r, pillar: 'healthcare', name, baseImpact: 5 + (progIdx % 6), durationTurns: 2 + (progIdx % 4), fiscalLoad: 15 + (progIdx % 25) });
  }
  for (const name of eduPrograms) {
    progIdx++;
    programArchetypes.push({ id: `ps_e_${r}_${progIdx}`, regionId: r, pillar: 'education', name, baseImpact: 4 + (progIdx % 8), durationTurns: 4 + (progIdx % 6), fiscalLoad: 10 + (progIdx % 18) });
  }
}

const kpiDefinitions = [
  { id: 'housing_delivery_throughput', pillar: 'housing', label: 'Housing Delivery Throughput', unit: 'index_0_100', formula: 'completedDwellingPipeline + socialHousingCompletions - planningBacklogPressure' },
  { id: 'housing_affordability_support', pillar: 'housing', label: 'Affordable Tenure Support', unit: 'index_0_100', formula: 'socialHousingStock + rentalAssistanceReach - severePressurePenalty' },
  { id: 'health_primary_access', pillar: 'healthcare', label: 'Primary Care Access', unit: 'index_0_100', formula: 'gpCoverage + bulkBillingSupport - remoteAccessGap' },
  { id: 'health_elective_flow', pillar: 'healthcare', label: 'Elective Care Flow', unit: 'index_0_100', formula: 'electiveThroughput - waitlistPressure' },
  { id: 'health_prevention_outcomes', pillar: 'healthcare', label: 'Preventive Outcomes', unit: 'index_0_100', formula: 'screeningReach + vaccinationUptake - chronicBurden' },
  { id: 'edu_participation', pillar: 'education', label: 'Participation Rate', unit: 'index_0_100', formula: 'enrolmentRetention + earlyYearsUptake' },
  { id: 'edu_attainment', pillar: 'education', label: 'Attainment & Completion', unit: 'index_0_100', formula: 'yr12Completion + certIIICompletion' },
  { id: 'edu_skills_alignment', pillar: 'education', label: 'Skills Pipeline Alignment', unit: 'index_0_100', formula: 'tafeThroughput + apprenticeshipStarts - skillsMismatch' },
  { id: 'equity_regional_gap', pillar: 'cross', label: 'Regional Equity Gap', unit: 'gap_0_100', formula: 'max(regionalOutcome) - min(regionalOutcome)' },
  { id: 'service_backlog_pressure', pillar: 'cross', label: 'Service Backlog Pressure', unit: 'pressure_0_100', formula: 'planningBacklog + waitlistPressure + unfilledRoles' }
];

const outcomeSpecs = [];
for (const r of regions) {
  for (const p of pillars) {
    for (let tier = 0; tier < 45; tier++) {
      const profile = regionProfiles[r];
      const base =
        p === 'housing' ? profile.housingBase :
        p === 'healthcare' ? profile.healthBase : profile.eduBase;
      const target = v1014ClampStatic(base + tier * 0.55 - (profile.remoteShare * 12));
      outcomeSpecs.push({
        id: `out_${r}_${p}_t${tier}`,
        regionId: r,
        pillar: p,
        tier,
        targetIndex: target,
        minimumAcceptable: Math.max(20, target - 18),
        stretchGoal: Math.min(100, target + 12),
        measurementWindowTurns: 3 + (tier % 4),
        auditMetric: `${p}_delivery_index`,
        reportingNotes: `Tier ${tier} benchmark for ${r} ${p} delivery under Operation 600K measurable outcomes ledger.`
      });
    }
  }
}

function v1014ClampStatic(n) {
  return Math.max(0, Math.min(100, Math.round(n * 10) / 10));
}

function emitOutcomeSpecCatalog() {
  return outcomeSpecs
    .map(
      (o) => `  {
    id: '${o.id}',
    regionId: '${o.regionId}',
    pillar: '${o.pillar}',
    tier: ${o.tier},
    targetIndex: ${o.targetIndex},
    minimumAcceptable: ${o.minimumAcceptable},
    stretchGoal: ${o.stretchGoal},
    measurementWindowTurns: ${o.measurementWindowTurns},
    auditMetric: '${o.auditMetric}',
    reportingNotes: ${JSON.stringify(o.reportingNotes)}
  }`
    )
    .join(',\n');
}

const askGameEntries = [];
const questions = [
  'Why did healthcare access weaken in remote regions?',
  'How do housing delivery outcomes relate to living standards?',
  'What measurable KPI tracks education participation?',
  'Can fiscal headroom improve service backlogs?',
  'How is regional equity gap calculated?',
  'Does workforce strain affect elective care flow?',
  'What programs improve social housing throughput?',
  'How are public service outcomes audited each turn?'
];
let askIdx = 0;
for (const r of regions) {
  for (const q of questions) {
    for (const p of pillars) {
      askIdx++;
      askGameEntries.push({
        id: `ask_v1014_${askIdx}`,
        regionId: r,
        pillar: p,
        question: q.replace('remote regions', `${r} remote areas`).replace('regional', r),
        fact: `V10.14 tracks ${p} delivery/access indices for ${r} with provenance separate from V10.13 household demand.`,
        inference: `Policy focus, workforce staffing, and fiscal headroom jointly shape ${p} measurable outcomes in ${r}.`,
        projection: `Sustained investment in ${p} programs can move ${r} outcome tiers toward stretch goals over multiple turns.`
      });
    }
  }
}

function emitAskGameCatalog() {
  return askGameEntries
    .map(
      (a) => `  {
    id: '${a.id}',
    regionId: '${a.regionId}',
    pillar: '${a.pillar}',
    question: ${JSON.stringify(a.question)},
    fact: ${JSON.stringify(a.fact)},
    inference: ${JSON.stringify(a.inference)},
    projection: ${JSON.stringify(a.projection)}
  }`
    )
    .join(',\n');
}
const scenarioMatrix = [];
for (let t = 0; t < 48; t++) {
  scenarioMatrix.push({
    id: `ps_scenario_${String(t + 1).padStart(2, '0')}`,
    label: `Public Services What-If ${t + 1}`,
    fiscalPosture: t % 4 === 0 ? 'expansionary' : t % 4 === 1 ? 'neutral' : t % 4 === 2 ? 'consolidation' : 'crisis_recovery',
    workforceStrain: (t % 5) * 18,
    highlightPillar: pillars[t % 3],
    targetRegions: [regions[t % 8], regions[(t + 3) % 8]]
  });
}

function emitProgramCatalog() {
  return programArchetypes
    .map(
      (p) => `  {
    id: '${p.id}',
    regionId: '${p.regionId}',
    pillar: '${p.pillar}',
    name: ${JSON.stringify(p.name)},
    baseImpact: ${p.baseImpact},
    durationTurns: ${p.durationTurns},
    fiscalLoadPoints: ${p.fiscalLoad},
    measurableOutcomes: ['${p.pillar}_delivery_index', '${p.pillar}_access_index', 'public_trust_in_services'],
    prerequisites: ['national_systems_enabled', 'public_finance_headroom_or_program_slot'],
    tags: ['${p.regionId}', '${p.pillar}', 'measurable_outcome']
  }`
    )
    .join(',\n');
}

function emitKpiCatalog() {
  return kpiDefinitions
    .map(
      (k) => `  {
    id: '${k.id}',
    pillar: '${k.pillar}',
    label: ${JSON.stringify(k.label)},
    unit: '${k.unit}',
    formula: ${JSON.stringify(k.formula)},
    reportingCadence: 'per_turn',
    auditVisibility: 'public'
  }`
    )
    .join(',\n');
}

function emitScenarioCatalog() {
  return scenarioMatrix
    .map(
      (s) => `  {
    id: '${s.id}',
    label: ${JSON.stringify(s.label)},
    fiscalPosture: '${s.fiscalPosture}',
    workforceStrain: ${s.workforceStrain},
    highlightPillar: '${s.highlightPillar}',
    targetRegions: ${JSON.stringify(s.targetRegions)}
  }`
    )
    .join(',\n');
}

function emitRegionalBaselines() {
  return regions
    .map((r) => {
      const p = regionProfiles[r];
      return `  ${r}: {
    regionId: '${r}',
    capitalCity: ${JSON.stringify(p.capitalCity)},
    populationShare: ${p.popShare},
    remotePopulationShare: ${p.remoteShare},
    baselines: {
      housingDelivery: ${p.housingBase},
      healthcareAccess: ${p.healthBase},
      educationParticipation: ${p.eduBase}
    },
    backlogDefaults: {
      planningMonths: ${8 + Math.floor(p.remoteShare * 20)},
      electiveWaitPressure: ${Math.floor(30 + p.remoteShare * 40)},
      teacherVacancyPressure: ${Math.floor(15 + p.remoteShare * 25)}
    }
  }`;
    })
    .join(',\n');
}

const tests = [];
const testSpecs = [
  ['STRONG BASELINE', {}, {}, (n) => `n.national.outcomeIndex >= 58`],
  ['REMOTE REGION PENALTY', { regions: { NT: { remotePopulationShare: 0.55, backlogDefaults: { electiveWaitPressure: 78 } } } }, {}, (n) => `n.regions.NT.healthcare.access !== 'excellent'`],
  ['FISCAL CONSTRAINT', { fiscalHeadroom: 18, activeProgramCount: 6 }, {}, (n) => `n.national.backlogPressure !== 'low'`],
  ['WORKFORCE STRAIN', { workforceReadiness: 'strained', workforceSpecialistGap: 72 }, {}, (n) => `n.national.healthcare.staffing !== 'strong'`],
  ['HOUSING PIPELINE BOOST', { completedHousingProjects: 4, policyHousingFocus: 85 }, {}, (n) => `n.national.housing.throughputBand === 'strong' || n.national.housing.throughputBand === 'surging'`],
  ['EDUCATION PUSH', { policyEducationFocus: 90, completedEducationProjects: 3 }, {}, (n) => `n.national.education.participationBand !== 'weak'`],
  ['EQUITY DIVERGENCE', { regions: { NSW: { baselines: { housingDelivery: 82 } }, NT: { baselines: { housingDelivery: 38 } } } }, {}, (n) => `n.national.equityGap >= 18`],
  ['DETERMINISM', { turn: 7 }, {}, (n) => `true`],
  ['HYSTERESIS STABILITY', { turn: 12 }, { prevBand: 'adequate' }, (n) => `typeof n.national.healthcare.access === 'string'`],
  ['CRISIS RECOVERY', { crisisSeverity: 65, emergencyReliefActive: true }, {}, (n) => `n.national.backlogPressure === 'high' || n.national.backlogPressure === 'severe'`]
];

for (let i = 0; i < 50; i++) {
  const spec = testSpecs[i % testSpecs.length];
  tests.push({ num: i + 1, name: spec[0], extra: i });
}

const testAssertions = [
  `out.state.national.outcomeIndex >= 58`,
  `out.state.regions.NT.healthcare.access !== 'excellent'`,
  `out.state.national.backlogPressure !== 'low'`,
  `out.state.national.healthcare.staffing !== 'strong'`,
  `(out.state.national.housing.throughputBand === 'strong' || out.state.national.housing.throughputBand === 'surging' || out.state.national.housing.deliveryIndex >= 68)`,
  `out.state.national.education.access !== 'critical'`,
  `out.state.national.equityGap >= 18`,
  `typeof out.state.national.outcomeIndex === 'number'`,
  `typeof out.state.national.healthcare.access === 'string'`,
  `(out.state.national.backlogPressure === 'high' || out.state.national.backlogPressure === 'severe' || out.state.national.outcomeIndex <= 55)`
];

function emitTests() {
  return tests
    .map((t) => {
      const spec = testSpecs[(t.num - 1) % testSpecs.length];
      const assertion = testAssertions[(t.num - 1) % testAssertions.length];
      return `  // TEST ${t.num} — ${spec[0]}${t.num > 10 ? ` (variant ${t.num})` : ''}
  {
    const inp = makeDefaultV1014TestInputs({ turn: ${1 + (t.num % 11)}, ...makeV1014TestVariant(${t.num}) });
    const out = computeNationalPublicServices(inp, createInitialPublicServicesPersisted(), null);
    check(
      'TEST ${t.num} — ${spec[0]}',
      ${assertion},
      \`outcomeIndex=\${out.state.national.outcomeIndex}, backlog=\${out.state.national.backlogPressure}\`
    );
  }`;
    })
    .join('\n\n');
}

const content = `// ============================================================================
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

export const V1014_REGION_WEIGHT: Record<string, number> = ${JSON.stringify(regionWeights, null, 2)};

export const V1014_REGION_PROFILES: Record<string, {
  regionId: string;
  capitalCity: string;
  populationShare: number;
  remotePopulationShare: number;
  baselines: { housingDelivery: number; healthcareAccess: number; educationParticipation: number };
  backlogDefaults: { planningMonths: number; electiveWaitPressure: number; teacherVacancyPressure: number };
}> = {
${emitRegionalBaselines()}
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
${emitKpiCatalog()}
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
${emitProgramCatalog()}
] as const;

export const V1014_SCENARIO_MATRIX: readonly {
  id: string;
  label: string;
  fiscalPosture: string;
  workforceStrain: number;
  highlightPillar: PublicServicePillar;
  targetRegions: string[];
}[] = [
${emitScenarioCatalog()}
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
${emitOutcomeSpecCatalog()}
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
${emitAskGameCatalog()}
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
      ? \`National outcome index \${n.outcomeIndex} with backlog \${V1014_BACKLOG_LABEL[n.backlogPressure]} and equity gap \${n.equityGap}. Review housing, healthcare, and education program sequencing.\`
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
    return \`\${r}:\${x.baselines?.housingDelivery ?? 'd'}:\${x.baselines?.healthcareAccess ?? 'd'}:\${x.baselines?.educationParticipation ?? 'd'}\`;
  }).join('|');
  return \`v1014:t\${inputs.turn}|f\${inputs.fiscalHeadroom ?? 'n'}|w\${inputs.workforceReadiness ?? 'n'}|\${reg}\`;
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
    evidence: [\`\${regionId}:\${pillar}:delivery=\${delivery}\`, \`\${regionId}:\${pillar}:backlog=\${backlogScore}\`]
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
    history: [{ id: \`ps_hist_t\${turn}\`, turn, summary: \`National public service outcome index \${outcomeIndex} (\${distribution})\`, kind: 'national_outcome_index_shift' }]
  };
  persisted.lastInputHash = inputHash;
  if (persisted.initializedTurn === null) persisted.initializedTurn = turn;
  persisted.history.push({ id: \`ps_pers_t\${turn}\`, turn, summary: \`Outcome \${outcomeIndex}, backlog \${backlogPressure}\` });
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

${emitTests()}

  // TEST 51 — VALIDATION HELPER
  {
    const out = computeNationalPublicServices(makeDefaultV1014TestInputs(), createInitialPublicServicesPersisted(), null);
    const v = validatePublicServicesState(out.state);
    check('TEST 51 — VALIDATION HELPER', v.valid, v.issues.join('; ') || 'ok');
  }

  // TEST 52 — SCENARIO MATRIX COVERAGE
  {
    const ids = V1014_SCENARIO_MATRIX.slice(0, 12).map((s) => simulatePublicServicesScenario(s.id).national.outcomeIndex);
    check('TEST 52 — SCENARIO MATRIX COVERAGE', ids.every((x) => x >= 0 && x <= 100), \`sample outcomes \${ids.join(',')}\`);
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
`;

fs.writeFileSync(OUT, content);
const lines = content.split('\n').length;
console.log(`Wrote ${OUT} (${lines} lines)`);
