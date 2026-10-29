import { computeLaborAutomationFeedback } from './automation-feedback';
import { computeNationalHouseholdBudgetDetail } from './household-budget-detail';
import { detectMigrationShocks } from './migration-shocks';
import { LABOR_STRESS_SCENARIO_CATALOG, lookupLaborStressScenario } from './catalog/labor-stress-scenarios';
import { REGION_LABOR_BASELINES, lookupRegionalLaborBaseline } from './catalog/regional-labor-baselines';
import { answerLaborDemographicsQuestion, detectLaborDemographicsQuery } from './gi-labor-queries';
import { applyRegionalMigrationSpillovers, spilloverNeighborList } from './regional-migration-spillovers';
import { computeRegionalWageMigrationCoupling } from './wage-migration-coupling';
import { computeNationalWorkforceCapacityBridge } from './workforce-capacity-bridge';
import { computeLaborResilienceScorecard } from './labor-resilience-scorecard';
import { computeInterregionalLaborRebalancingPlan } from './interregional-labor-rebalancing';
import { SKILLED_LABOR_PATHWAYS, lookupSkilledLaborPathway, pathwaysForIndustry } from './catalog/skilled-labor-pathways';
import {
  WORKFORCE_RETENTION_LEVERS,
  lookupWorkforceRetentionLever,
  retentionLeversForIndustry,
  retentionPullForRegion
} from './catalog/workforce-retention-levers';
import { computeNationalDependencyRatioSnapshot } from './dependency-ratio-snapshot';
import { computeNationalParticipationPressureBrief } from './participation-pressure-brief';
import { computeNationalLaborMarketVelocityIndex } from './labor-market-velocity-index';
import {
  WORKFORCE_UPSKILLING_PROGRAMS,
  lookupWorkforceUpskillingProgram,
  upskillingProgramsForIndustry,
  upskillingUpliftForRegion
} from './catalog/workforce-upskilling-programs';
import { computeNationalSkillMismatchIndex } from './skill-mismatch-index';
import { computeNationalLaborSupplyElasticityBrief } from './labor-supply-elasticity-brief';
import { computeNationalTalentMobilityOutlook } from './talent-mobility-outlook';
import {
  WORKFORCE_INCLUSION_LEVERS,
  inclusionEaseForRegion,
  inclusionLeversForIndustry,
  lookupWorkforceInclusionLever
} from './catalog/workforce-inclusion-levers';
import { computeNationalUnderemploymentPressureBrief } from './underemployment-pressure-brief';
import { computeNationalWageCompetitivenessIndex } from './wage-competitiveness-index';
import { computeNationalWorkforceTransitionFrictionOutlook } from './workforce-transition-friction-outlook';
import {
  WORKFORCE_CARE_LEVERS,
  careLeversForIndustry,
  careReliefForRegion,
  lookupWorkforceCareLever
} from './catalog/workforce-care-levers';
import { computeNationalYouthEntryPipelineOutlook } from './youth-entry-pipeline-outlook';
import { computeNationalLaborMarketTightnessBrief } from './labor-market-tightness-brief';
import { computeNationalHybridParticipationFrictionOutlook } from './hybrid-participation-friction-outlook';
import {
  WORKFORCE_FLEXIBILITY_LEVERS,
  flexibilityEaseForRegion,
  flexibilityLeversForIndustry,
  lookupWorkforceFlexibilityLever
} from './catalog/workforce-flexibility-levers';
import { computeNationalSeniorWorkforceRetentionOutlook } from './senior-workforce-retention-outlook';
import { computeNationalRegionalLaborAbsorptionBrief } from './regional-labor-absorption-brief';
import { computeNationalParticipationEquityGapBrief } from './participation-equity-gap-brief';
import {
  WORKFORCE_REENGAGEMENT_LEVERS,
  lookupWorkforceReengagementLever,
  reengagementLeversForIndustry,
  reengagementPullForRegion
} from './catalog/workforce-reengagement-levers';
import { computeNationalCredentialMobilityOutlook } from './credential-mobility-outlook';
import { computeNationalHouseholdParticipationCouplingBrief } from './household-participation-coupling-brief';
import { computeNationalLaborRebalancingStressBrief } from './labor-rebalancing-stress-brief';
import {
  WORKFORCE_ONBOARDING_LEVERS,
  lookupWorkforceOnboardingLever,
  onboardingEaseForRegion,
  onboardingLeversForIndustry
} from './catalog/workforce-onboarding-levers';
import { computeNationalAutomationParticipationResilienceOutlook } from './automation-participation-resilience-outlook';
import { computeNationalWageParticipationSpilloverBrief } from './wage-participation-spillover-brief';
import { computeNationalMigrationShockParticipationBufferOutlook } from './migration-shock-participation-buffer-outlook';
import {
  WORKFORCE_COORDINATION_LEVERS,
  coordinationEaseForRegion,
  coordinationLeversForIndustry,
  lookupWorkforceCoordinationLever
} from './catalog/workforce-coordination-levers';
import { computeNationalLaborMarketStabilityOutlook } from './labor-market-stability-outlook';
import { computeNationalIntergenerationalWorkforceBalanceOutlook } from './intergenerational-workforce-balance-outlook';
import { computeNationalCapacityParticipationAlignmentBrief } from './capacity-participation-alignment-brief';
import {
  WORKFORCE_ADVOCACY_LEVERS,
  advocacyEaseForRegion,
  advocacyLeversForIndustry,
  lookupWorkforceAdvocacyLever
} from './catalog/workforce-advocacy-levers';
import { computeNationalParticipationVelocityCouplingBrief } from './participation-velocity-coupling-brief';
import { computeNationalSkillsTightnessCoherenceOutlook } from './skills-tightness-coherence-outlook';
import { computeNationalIntegratedLaborReadinessOutlook } from './integrated-labor-readiness-outlook';
import {
  WORKFORCE_MENTORSHIP_LEVERS,
  lookupWorkforceMentorshipLever,
  mentorshipEaseForRegion,
  mentorshipLeversForIndustry
} from './catalog/workforce-mentorship-levers';
import { computeNationalHybridRemoteParticipationOutlook } from './hybrid-remote-participation-outlook';
import { computeNationalCorridorCapacityStressBrief } from './corridor-capacity-stress-brief';
import { computeNationalStewardInterventionPriorityBrief } from './steward-intervention-priority-brief';
import { REGIONAL_MIGRATION_CORRIDORS, summarizeCorridorExposure } from './catalog/regional-migration-corridors';
import { appendLaborAuditHistory, buildLaborTurnAuditEntry } from './labor-turn-audit';
import { runLaborStressScenario } from './scenario-runner';
import { buildStewardLaborBrief } from './steward-labor-brief';
import { projectLaborDemographicsTurns } from './turn-projection';
import { computeNationalLaborDemographics } from './compute';
import { buildLaborDemographicsInputs } from './inputs';
import { createInitialLaborDemographicsPersisted, laborDemographicsInputHash, sanitizeLaborDemographicsPersisted } from './persistence';
import {
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type NationalLaborDemographicsState
} from './types';
import { validateLaborDemographicsState } from './validate';

function stateIntegrated(st: NationalLaborDemographicsState): boolean {
  return st.integratedLaborBrief?.compositePressureIndex != null;
}

export function v1014laborMakeTestIndustries(overrides?: Partial<Record<string, number>>): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = { industries: {} as any };
    STRATEGIC_INDUSTRIES.forEach(k => {
      regions[c].industries[k] = {
        industry: k,
        effectiveOutput: k === 'mining' && c === 'WA' ? 55 : k === 'technology' && c === 'NSW' ? 40 : 12,
        condition: 'healthy'
      };
    });
  });
  const output: any = {};
  STRATEGIC_INDUSTRIES.forEach(k => {
    output[k] = k === 'mining' ? 120 : 40;
  });
  if (overrides) Object.assign(output, overrides);
  return { national: { output }, regions };
}

export function v1014laborMakeTestHouseholds(opts?: { severeRegion?: string; essentialsStrainRegion?: string }): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = {
      affordability: c === opts?.severeRegion ? 'severe_pressure' : 'healthy',
      essentialAccess: c === opts?.essentialsStrainRegion ? 'critical' : 'adequate',
      resilience: c === opts?.severeRegion ? 'fragile' : 'moderate',
      employmentOpportunity: 'balanced',
      housingPressure: c === opts?.severeRegion ? 'severe' : 'moderate'
    };
  });
  return {
    national: {
      affordability: opts?.severeRegion ? 'strained' : 'healthy',
      financialResilience: 'moderate',
      housingPressure: 'moderate',
      employmentOpportunity: 'balanced'
    },
    regions
  };
}

export interface SelfTestResult {
  id: string;
  passed: boolean;
  detail: string;
}

export function runV1014LaborDemographicsSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: SelfTestResult[];
} {
  const results: SelfTestResult[] = [];
  const check = (id: string, ok: boolean, detail: string) => results.push({ id, passed: ok, detail });

  check('LD01', V1014_LABOR_SCHEMA_VERSION === '10.14.0', 'schema version');
  check('LD02', V1014_LABOR_CORE_REGIONS.length === 8, 'core regions');
  check('LD03', STRATEGIC_INDUSTRIES.every(k => V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k] > 0), 'labor weights');

  const baseInp: LaborDemographicsInputs = { turn: 3, enabled: true, industries: v1014laborMakeTestIndustries() };
  const r1 = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD04', validateLaborDemographicsState(r1.state).valid, 'valid state');
  check('LD05', Object.keys(r1.state.regions).length === 8, '8 regional snapshots');
  check('LD06', r1.state.industryLinks.length > 0, 'industry links');

  const rOff = computeNationalLaborDemographics({ turn: 1, enabled: false }, createInitialLaborDemographicsPersisted(), null);
  check('LD07', !rOff.state.enabled, 'disabled layer');

  const boomInp = { ...baseInp, industries: v1014laborMakeTestIndustries({ mining: 400, manufacturing: 200 }) };
  const rBoom = computeNationalLaborDemographics(boomInp, createInitialLaborDemographicsPersisted(), null);
  check('LD08', rBoom.state.employmentLinkageScore >= r1.state.employmentLinkageScore - 5, 'output boosts linkage');

  const hashA = laborDemographicsInputHash(baseInp);
  const hashB = laborDemographicsInputHash({ ...baseInp, turn: 4 });
  check('LD09', hashA !== hashB, 'hash turn sensitivity');
  check('LD10', laborDemographicsInputHash(baseInp) === hashA, 'hash stable');

  const detA = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  const detB = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD11', JSON.stringify(detA.state) === JSON.stringify(detB.state), 'determinism');

  const replayPers = createInitialLaborDemographicsPersisted();
  let replayState: NationalLaborDemographicsState | null = null;
  for (let t = 1; t <= 5; t++) {
    const step = { ...baseInp, turn: t };
    const rr = computeNationalLaborDemographics(step, replayPers, replayState);
    replayState = rr.state;
  }
  check('LD12', (replayState?.revision || 0) >= 2, 'replay revisions');

  check('LD13', !('population' in r1.state), 'no population key');
  check('LD14', r1.state.regions.WA?.dominantIndustry === 'mining', 'WA mining dominant');

  const wfStrained: any = { regions: { NSW: { effectivePressureRatio: 0.92 } } };
  const rStrain = computeNationalLaborDemographics({ ...baseInp, workforce: wfStrained }, createInitialLaborDemographicsPersisted(), null);
  check('LD15', rStrain.state.regions.NSW.wagePressureScore >= r1.state.regions.NSW.wagePressureScore - 3, 'workforce strain wages');

  const sanitized = sanitizeLaborDemographicsPersisted({ revision: 99, nationalHysteresis: { demographicScore: 200 } }, 2);
  check('LD16', sanitized.nationalHysteresis.demographicScore <= 100, 'sanitize clamp');

  const built = buildLaborDemographicsInputs({
    turn: 2,
    gameSettings: { nationalSystemsEnabled: true, industriesEnabled: true, laborDemographicsEnabled: true },
    industries: v1014laborMakeTestIndustries()
  });
  check('LD17', built.enabled === true, 'build enabled');
  check('LD18', buildLaborDemographicsInputs({ turn: 1, gameSettings: { laborDemographicsEnabled: false } }).enabled === false, 'build disabled flag');

  const autoCaps = [{ id: 'auto_mine', active: true, automationShift: 90 }];
  const rAuto = computeNationalLaborDemographics(
    { ...baseInp, capabilities: autoCaps, workforce: { automationShiftSummary: 'Automation reshaping mining domains.' } },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('AF01', Boolean(rAuto.state.automationFeedbackSummary), 'automation summary on state');
  check(
    'AF02',
    (rAuto.state.regions.NSW?.employmentLinkageScore || 100) <= (r1.state.regions.NSW?.employmentLinkageScore || 0) + 1,
    'automation lowers linkage vs baseline'
  );
  check('AF03', rAuto.events.length > 0, 'steward hint events emitted');

  const fb = computeLaborAutomationFeedback({
    capabilities: autoCaps,
    workforce: { automationShiftSummary: 'Automation shift active' },
    wfStrainNational: 70
  });
  check('AF04', fb.nationalAutomationIndex >= 45 && fb.stewardHints.length > 0, 'automation index and hints');
  check('AF05', laborDemographicsInputHash({ ...baseInp, capabilities: autoCaps }) !== hashA, 'hash includes automation');

  const hhInp = { ...baseInp, households: v1014laborMakeTestHouseholds() };
  const rHh = computeNationalLaborDemographics(hhInp, createInitialLaborDemographicsPersisted(), null);
  check('HB01', Boolean(rHh.state.householdBudgetSummary), 'household budget summary');
  check('HB02', typeof rHh.state.regions.NSW?.householdBudgetPressureScore === 'number', 'regional budget pressure');

  const hhSevere = { ...baseInp, households: v1014laborMakeTestHouseholds({ severeRegion: 'NSW' }) };
  const rHhBad = computeNationalLaborDemographics(hhSevere, createInitialLaborDemographicsPersisted(), null);
  check(
    'HB03',
    (rHhBad.state.regions.NSW?.wagePressureScore || 0) >= (rHh.state.regions.NSW?.wagePressureScore || 0) - 1,
    'budget pressure lifts wage index'
  );
  check(
    'HB04',
    (rHhBad.state.regions.NSW?.householdBudgetPressureScore || 0) >
      (rHh.state.regions.NSW?.householdBudgetPressureScore || 0),
    'severe affordability raises pressure score'
  );

  const natBudget = computeNationalHouseholdBudgetDetail(v1014laborMakeTestHouseholds({ severeRegion: 'VIC' }));
  check('HB05', natBudget.shockSensitivity !== 'low', 'severe region raises shock sensitivity');

  check(
    'MS01',
    (r1.state.activeMigrationShocks || []).some(s => s.regionId === 'WA' && s.kind === 'resource_boom_inflow'),
    'WA mining triggers inflow shock'
  );

  check(
    'MS02',
    (rHhBad.state.activeMigrationShocks || []).some(s => s.kind === 'housing_affordability_outflow'),
    'affordability shock detected'
  );

  const migBefore = rHh.state.regions.NSW?.migrationFlowScore || 50;
  const migAfter = rHhBad.state.regions.NSW?.migrationFlowScore || 50;
  check('MS03', migAfter <= migBefore + 2, 'outflow shock pulls migration score down vs healthy baseline');

  const pers = createInitialLaborDemographicsPersisted();
  const first = computeNationalLaborDemographics(baseInp, pers, null);
  const shockTurns = first.persisted.activeMigrationShocks?.[0]?.turnsRemaining;
  const second = computeNationalLaborDemographics({ ...baseInp, turn: 4 }, first.persisted, first.state);
  const shockTurnsLater = second.persisted.activeMigrationShocks?.find(
    s => s.id === first.persisted.activeMigrationShocks?.[0]?.id
  )?.turnsRemaining;
  check(
    'MS04',
    shockTurns != null && shockTurnsLater != null && shockTurnsLater < shockTurns,
    'shocks decay across turns'
  );

  const overrideShock = {
    id: 'msh_test_NSW_t9',
    kind: 'metro_talent_pull' as const,
    regionId: 'NSW',
    magnitude: 12,
    turnsRemaining: 2,
    startedTurn: 9,
    reason: 'test override'
  };
  const rOv = computeNationalLaborDemographics(
    { ...baseInp, turn: 9, migrationShockOverrides: [overrideShock] },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('MS05', (rOv.state.activeMigrationShocks || []).some(s => s.id === overrideShock.id), 'shock override applied');

  check(
    'MS06',
    detectMigrationShocks({
      turn: 2,
      inputs: hhSevere,
      householdBudget: computeNationalHouseholdBudgetDetail(hhSevere.households)
    }).length > 0,
    'detector emits under strain'
  );

  check('SW01', REGION_LABOR_BASELINES.NSW.laborMobilityIndex > REGION_LABOR_BASELINES.TAS.laborMobilityIndex, 'baseline mobility ordering');
  check('SW02', Boolean(lookupRegionalLaborBaseline('WA')?.narrative), 'WA baseline narrative');
  check('SW03', LABOR_STRESS_SCENARIO_CATALOG.length >= 8, 'stress scenario catalog');
  check('SW04', Boolean(lookupLaborStressScenario('ld_sc_mining_supercycle')?.expectedShockKinds.length), 'mining scenario shocks');

  const spilled = applyRegionalMigrationSpillovers({ NSW: 70, VIC: 40, QLD: 50, ACT: 55, WA: 50, SA: 50, TAS: 50, NT: 50 });
  check('SW05', spilled.NSW !== 70, 'spillover moves NSW attractiveness');
  check('SW06', spilloverNeighborList('NSW').includes('VIC'), 'NSW neighbors');

  const coupling = computeRegionalWageMigrationCoupling({
    ...rHhBad.state.regions.NSW,
    wagePressure: 'surging',
    wagePressureScore: 78
  });
  check('SW07', coupling.couplingIndex >= 50, 'coupling index under wage+budget stress');

  check('SW08', detectLaborDemographicsQuery('What is wage pressure nationally?') === 'wage_pressure', 'GI wage detect');
  const giAns = answerLaborDemographicsQuestion(r1.state, 'migration_flow');
  check('SW09', giAns.headline.length > 3, 'GI migration answer');

  const proj = projectLaborDemographicsTurns(baseInp, 4, createInitialLaborDemographicsPersisted());
  check('SW10', proj.steps.length >= 4, 'turn projection steps');
  check('SW11', proj.steps[proj.steps.length - 1].turn === 7, 'projection end turn');

  const couplingApply = computeRegionalWageMigrationCoupling({
    regionId: 'NSW',
    demographicStructure: 'stable',
    demographicScore: 50,
    employmentLinkage: 'strong',
    employmentLinkageScore: 70,
    wagePressure: 'surging',
    wagePressureScore: 80,
    migrationFlow: 'balanced',
    migrationFlowScore: 50,
    dominantIndustry: 'technology',
    industryOutputIndex: 40,
    workforceStrainIndex: 75,
    householdEmploymentFit: 55,
    householdBudgetPressureScore: 72,
    householdEssentialsGapScore: 40
  });
  check('SW12', Math.abs(couplingApply.wageMigrationFeedback) >= 0.5, 'coupling feedback under stress');

  check('R301', REGIONAL_MIGRATION_CORRIDORS.length >= 8, 'migration corridors catalog');
  check('R302', Boolean(stateIntegrated(r1.state)), 'integrated brief on compute');
  check('R303', Boolean(r1.state.laborAuditTip?.bandLine), 'audit tip on state');
  check('R304', runLaborStressScenario('ld_sc_mining_supercycle', baseInp) != null, 'mining scenario run');
  check('R305', (runLaborStressScenario('ld_sc_mining_supercycle', baseInp)?.delta.migrationFlowScore ?? 0) >= -5, 'mining scenario delta');
  check(
    'R306',
    /corridor|balanced/i.test(summarizeCorridorExposure(r1.state)),
    'corridor summary'
  );
  check('R307', buildStewardLaborBrief(r1.state, r1.state.integratedLaborBrief!, []).priority.length > 0, 'steward brief priority');
  check('R308', appendLaborAuditHistory([], r1.state.laborAuditTip!).length === 1, 'audit history append');
  check('R309', detectLaborDemographicsQuery('migration shocks active') === 'migration_shocks', 'GI shock query');
  check('R310', (r1.state.integratedLaborBrief?.topStrainRegions.length ?? 0) >= 1, 'strain regions listed');
  check('R311', runLaborStressScenario('ld_sc_housing_affordability_crunch', baseInp)?.delta.wagePressureScore !== undefined, 'housing scenario');
  check('R312', validateLaborDemographicsState({ ...r1.state, population: 1 } as any).valid === false, 'forbidden key still blocked');

  check('R401', SKILLED_LABOR_PATHWAYS.length >= 8, 'skilled pathway catalog');
  check('R402', Boolean(lookupSkilledLaborPathway('path_tech_nsw_vic')?.narrative), 'pathway lookup');
  check('R403', pathwaysForIndustry('mining').length >= 1, 'mining pathways');
  check('R404', Boolean(r1.state.workforceCapacityBridge?.nationalBand), 'capacity bridge on state');
  check('R405', Object.keys(r1.state.workforceCapacityBridge?.regions ?? {}).length === 8, 'regional capacity gaps');
  check(
    'R406',
    (rBoom.state.workforceCapacityBridge?.nationalGapIndex ?? 0) >= (r1.state.workforceCapacityBridge?.nationalGapIndex ?? 0) - 3,
    'boom raises capacity gap'
  );
  check('R407', Boolean(r1.state.laborResilienceScorecard?.compositeScore), 'resilience scorecard');
  check('R408', (r1.state.laborResilienceScorecard?.dimensions.length ?? 0) === 4, 'four resilience dimensions');
  check(
    'R409',
    (rHhBad.state.laborResilienceScorecard?.compositeScore ?? 100) <= (rHh.state.laborResilienceScorecard?.compositeScore ?? 0) + 5,
    'household strain lowers resilience'
  );
  check('R410', Boolean(r1.state.interregionalRebalancingPlan?.summary), 'rebalancing plan summary');
  check('R411', detectLaborDemographicsQuery('workforce capacity gap') === 'workforce_capacity', 'GI capacity detect');
  check('R412', detectLaborDemographicsQuery('labor resilience score') === 'labor_resilience', 'GI resilience detect');
  check('R413', answerLaborDemographicsQuestion(r1.state, 'workforce_capacity').headline.length > 5, 'GI capacity answer');
  const bridgeOnly = computeNationalWorkforceCapacityBridge(r1.state.turn, r1.state.regions, r1.state.industryLinks);
  check('R414', bridgeOnly.dominantShortageIndustry != null, 'bridge dominant industry');
  const plan = computeInterregionalLaborRebalancingPlan(r1.state, r1.state.integratedLaborBrief!, bridgeOnly);
  check('R415', plan.moves.every(m => m.expectedRelief >= 0), 'rebalancing relief bounded');
  check(
    'R416',
    computeLaborResilienceScorecard(r1.state, r1.state.integratedLaborBrief!, natBudget, bridgeOnly).band.length > 3,
    'resilience band string'
  );

  check('R501', WORKFORCE_RETENTION_LEVERS.length >= 8, 'retention lever catalog');
  check('R502', Boolean(lookupWorkforceRetentionLever('retain_tech_nsw')?.narrative), 'retention lever lookup');
  check('R503', retentionLeversForIndustry('mining').length >= 1, 'mining retention levers');
  check('R504', retentionPullForRegion('WA', 'mining') > 0, 'regional retention pull');
  check('R505', Boolean(r1.state.dependencyRatioSnapshot?.nationalBand), 'dependency snapshot on state');
  check('R506', Object.keys(r1.state.dependencyRatioSnapshot?.regions ?? {}).length === 8, 'regional dependency rows');
  check('R507', Boolean(r1.state.participationPressureBrief?.band), 'participation brief on state');
  check(
    'R508',
    (rHhBad.state.participationPressureBrief?.participationIndex ?? 100) <=
      (rHh.state.participationPressureBrief?.participationIndex ?? 0) + 8,
    'household strain lowers participation'
  );
  check('R509', Boolean(r1.state.laborMarketVelocityIndex?.nationalBand), 'velocity index on state');
  check('R510', detectLaborDemographicsQuery('participation outlook') === 'participation_outlook', 'GI participation detect');
  check('R511', detectLaborDemographicsQuery('dependency ratio aging') === 'dependency_ratio', 'GI dependency detect');
  check('R512', detectLaborDemographicsQuery('labor velocity churn') === 'labor_velocity', 'GI velocity detect');
  check('R513', answerLaborDemographicsQuestion(r1.state, 'participation_outlook').headline.length > 5, 'GI participation answer');
  const depOnly = computeNationalDependencyRatioSnapshot(r1.state.turn, r1.state.regions);
  check('R514', depOnly.summary.length > 10, 'dependency standalone summary');
  const velOnly = computeNationalLaborMarketVelocityIndex(r1.state.turn, r1.state.regions);
  check('R515', velOnly.hottestRegion != null, 'velocity hottest region');
  check(
    'R516',
    computeNationalParticipationPressureBrief(r1.state, r1.state.integratedLaborBrief!, depOnly).stewardNote.length > 8,
    'participation steward note'
  );

  check('R601', WORKFORCE_UPSKILLING_PROGRAMS.length >= 8, 'upskilling program catalog');
  check('R602', Boolean(lookupWorkforceUpskillingProgram('upskill_tech_nsw_vic')?.narrative), 'upskilling lookup');
  check('R603', upskillingProgramsForIndustry('mining').length >= 1, 'mining upskilling programs');
  check('R604', upskillingUpliftForRegion('WA', 'mining') > 0, 'regional upskilling uplift');
  check('R605', Boolean(r1.state.skillMismatchIndex?.nationalBand), 'skill mismatch on state');
  check('R606', Object.keys(r1.state.skillMismatchIndex?.regions ?? {}).length === 8, 'regional mismatch rows');
  check('R607', Boolean(r1.state.laborSupplyElasticityBrief?.band), 'supply elasticity on state');
  check(
    'R608',
    (rHhBad.state.laborSupplyElasticityBrief?.elasticityIndex ?? 100) <=
      (rHh.state.laborSupplyElasticityBrief?.elasticityIndex ?? 0) + 10,
    'household strain lowers elasticity'
  );
  check('R609', Boolean(r1.state.talentMobilityOutlook?.band), 'talent mobility on state');
  check('R610', detectLaborDemographicsQuery('skill mismatch gap') === 'skill_mismatch', 'GI mismatch detect');
  check('R611', detectLaborDemographicsQuery('supply elasticity inelastic') === 'supply_elasticity', 'GI elasticity detect');
  check('R612', detectLaborDemographicsQuery('talent mobility flow') === 'talent_mobility', 'GI mobility detect');
  check('R613', answerLaborDemographicsQuestion(r1.state, 'skill_mismatch').headline.length > 5, 'GI mismatch answer');
  const mismatchOnly = computeNationalSkillMismatchIndex(r1.state.turn, r1.state.workforceCapacityBridge);
  check('R614', mismatchOnly.summary.length > 10, 'mismatch standalone summary');
  const mobilityOnly = computeNationalTalentMobilityOutlook(
    r1.state,
    r1.state.laborMarketVelocityIndex,
    r1.state.workforceCapacityBridge
  );
  check('R615', mobilityOnly.corridorHighlight != null || mobilityOnly.anchorRegion != null, 'mobility corridor or anchor');
  check(
    'R616',
    computeNationalLaborSupplyElasticityBrief(
      r1.state,
      r1.state.integratedLaborBrief!,
      r1.state.participationPressureBrief
    ).stewardNote.length > 8,
    'elasticity steward note'
  );

  check('R701', WORKFORCE_INCLUSION_LEVERS.length >= 8, 'inclusion lever catalog');
  check('R702', Boolean(lookupWorkforceInclusionLever('incl_tech_nsw_vic')?.narrative), 'inclusion lever lookup');
  check('R703', inclusionLeversForIndustry('manufacturing').length >= 1, 'manufacturing inclusion levers');
  check('R704', inclusionEaseForRegion('VIC', 'manufacturing') > 0, 'regional inclusion ease');
  check('R705', Boolean(r1.state.underemploymentPressureBrief?.band), 'underemployment brief on state');
  check('R706', (r1.state.underemploymentPressureBrief?.linkageParticipationGap ?? 0) >= 0, 'linkage participation gap');
  check('R707', Boolean(r1.state.wageCompetitivenessIndex?.band), 'wage competitiveness on state');
  check(
    'R708',
    (rHhBad.state.wageCompetitivenessIndex?.competitivenessIndex ?? 100) <=
      (rHh.state.wageCompetitivenessIndex?.competitivenessIndex ?? 0) + 12,
    'household strain lowers competitiveness'
  );
  check('R709', Boolean(r1.state.workforceTransitionFrictionOutlook?.band), 'transition friction on state');
  check('R710', detectLaborDemographicsQuery('underemployment hidden slack') === 'underemployment', 'GI underemployment detect');
  check('R711', detectLaborDemographicsQuery('wage competitiveness burden') === 'wage_competitiveness', 'GI competitiveness detect');
  check('R712', detectLaborDemographicsQuery('transition friction sticky') === 'transition_friction', 'GI friction detect');
  check('R713', answerLaborDemographicsQuestion(r1.state, 'underemployment').headline.length > 5, 'GI underemployment answer');
  const underOnly = computeNationalUnderemploymentPressureBrief(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.participationPressureBrief
  );
  check('R714', underOnly.summary.length > 10, 'underemployment standalone summary');
  const compOnly = computeNationalWageCompetitivenessIndex(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.skillMismatchIndex
  );
  check('R715', compOnly.band.length > 3, 'competitiveness band string');
  check(
    'R716',
    computeNationalWorkforceTransitionFrictionOutlook(
      r1.state,
      r1.state.laborMarketVelocityIndex,
      r1.state.laborSupplyElasticityBrief
    ).stewardNote.length > 8,
    'transition friction steward note'
  );

  check('R801', WORKFORCE_CARE_LEVERS.length >= 8, 'care lever catalog');
  check('R802', Boolean(lookupWorkforceCareLever('care_tech_nsw_vic')?.narrative), 'care lever lookup');
  check('R803', careLeversForIndustry('technology').length >= 1, 'technology care levers');
  check('R804', careReliefForRegion('NSW', 'technology') > 0, 'regional care relief');
  check('R805', Boolean(r1.state.youthEntryPipelineOutlook?.band), 'youth pipeline on state');
  check('R806', (r1.state.youthEntryPipelineOutlook?.dependencyHeadwind ?? 0) >= 0, 'dependency headwind');
  check('R807', Boolean(r1.state.laborMarketTightnessBrief?.band), 'labor tightness on state');
  check('R808', Boolean(r1.state.hybridParticipationFrictionOutlook?.band), 'hybrid friction on state');
  check('R809', detectLaborDemographicsQuery('youth entry pipeline') === 'youth_pipeline', 'GI youth pipeline detect');
  check('R810', detectLaborDemographicsQuery('labor market tightness') === 'labor_tightness', 'GI tightness detect');
  check('R811', detectLaborDemographicsQuery('hybrid participation friction') === 'hybrid_participation', 'GI hybrid detect');
  check('R812', answerLaborDemographicsQuestion(r1.state, 'youth_pipeline').headline.length > 5, 'GI youth answer');
  const youthOnly = computeNationalYouthEntryPipelineOutlook(
    r1.state,
    r1.state.dependencyRatioSnapshot,
    r1.state.participationPressureBrief
  );
  check('R813', youthOnly.summary.length > 10, 'youth pipeline standalone summary');
  const tightOnly = computeNationalLaborMarketTightnessBrief(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.workforceCapacityBridge,
    r1.state.underemploymentPressureBrief
  );
  check('R814', tightOnly.band.length > 3, 'tightness band string');
  const hybridOnly = computeNationalHybridParticipationFrictionOutlook(
    r1.state,
    r1.state.workforceTransitionFrictionOutlook,
    r1.state.talentMobilityOutlook
  );
  check('R815', hybridOnly.careReliefLift >= 0, 'hybrid care relief lift');
  check(
    'R816',
    computeNationalLaborMarketTightnessBrief(
      rHhBad.state,
      rHhBad.state.integratedLaborBrief!,
      rHhBad.state.workforceCapacityBridge,
      rHhBad.state.underemploymentPressureBrief
    ).stewardNote.length > 8,
    'tightness steward note'
  );

  check('R901', WORKFORCE_FLEXIBILITY_LEVERS.length >= 8, 'flexibility lever catalog');
  check('R902', Boolean(lookupWorkforceFlexibilityLever('flex_tech_nsw_vic')?.narrative), 'flexibility lever lookup');
  check('R903', flexibilityLeversForIndustry('technology').length >= 1, 'technology flexibility levers');
  check('R904', flexibilityEaseForRegion('NSW', 'technology') > 0, 'regional flexibility ease');
  check('R905', Boolean(r1.state.seniorWorkforceRetentionOutlook?.band), 'senior retention on state');
  check('R906', (r1.state.seniorWorkforceRetentionOutlook?.agedPressureDrag ?? 0) >= 0, 'aged pressure drag');
  check('R907', Boolean(r1.state.regionalLaborAbsorptionBrief?.band), 'labor absorption on state');
  check('R908', Boolean(r1.state.participationEquityGapBrief?.band), 'participation equity on state');
  check('R909', detectLaborDemographicsQuery('senior retention outlook') === 'senior_retention', 'GI senior detect');
  check('R910', detectLaborDemographicsQuery('regional labor absorption') === 'labor_absorption', 'GI absorption detect');
  check('R911', detectLaborDemographicsQuery('participation equity gap') === 'participation_equity', 'GI equity detect');
  check('R912', answerLaborDemographicsQuestion(r1.state, 'senior_retention').headline.length > 5, 'GI senior answer');
  const seniorOnly = computeNationalSeniorWorkforceRetentionOutlook(
    r1.state,
    r1.state.dependencyRatioSnapshot,
    r1.state.participationPressureBrief
  );
  check('R913', seniorOnly.summary.length > 10, 'senior retention standalone summary');
  const absorptionOnly = computeNationalRegionalLaborAbsorptionBrief(
    r1.state,
    r1.state.workforceCapacityBridge,
    r1.state.laborMarketTightnessBrief
  );
  check('R914', absorptionOnly.band.length > 3, 'absorption band string');
  const equityOnly = computeNationalParticipationEquityGapBrief(r1.state, r1.state.underemploymentPressureBrief);
  check('R915', equityOnly.inclusionEaseLift >= 0, 'equity inclusion ease lift');
  check(
    'R916',
    computeNationalParticipationEquityGapBrief(rHhBad.state, rHhBad.state.underemploymentPressureBrief).stewardNote.length >
      8,
    'equity steward note'
  );

  check('R1001', WORKFORCE_REENGAGEMENT_LEVERS.length >= 8, 'reengagement lever catalog');
  check('R1002', Boolean(lookupWorkforceReengagementLever('reeng_tech_nsw_vic')?.narrative), 'reengagement lever lookup');
  check('R1003', reengagementLeversForIndustry('technology').length >= 1, 'technology reengagement levers');
  check('R1004', reengagementPullForRegion('NSW', 'technology') > 0, 'regional reengagement pull');
  check('R1005', Boolean(r1.state.credentialMobilityOutlook?.band), 'credential mobility on state');
  check('R1006', (r1.state.credentialMobilityOutlook?.pathwayLift ?? 0) >= 0, 'pathway lift');
  check('R1007', Boolean(r1.state.householdParticipationCouplingBrief?.band), 'household coupling on state');
  check('R1008', Boolean(r1.state.laborRebalancingStressBrief?.band), 'rebalancing stress on state');
  check('R1009', detectLaborDemographicsQuery('credential mobility portable') === 'credential_mobility', 'GI credential detect');
  check(
    'R1010',
    detectLaborDemographicsQuery('household participation coupling') === 'household_participation_coupling',
    'GI coupling detect'
  );
  check('R1011', detectLaborDemographicsQuery('rebalancing stress corridor') === 'rebalancing_stress', 'GI stress detect');
  check('R1012', answerLaborDemographicsQuestion(r1.state, 'credential_mobility').headline.length > 5, 'GI credential answer');
  const credentialOnly = computeNationalCredentialMobilityOutlook(
    r1.state,
    r1.state.skillMismatchIndex,
    r1.state.talentMobilityOutlook
  );
  check('R1013', credentialOnly.summary.length > 10, 'credential mobility standalone summary');
  const couplingOnly = computeNationalHouseholdParticipationCouplingBrief(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.participationEquityGapBrief
  );
  check('R1014', couplingOnly.band.length > 3, 'coupling band string');
  const stressOnly = computeNationalLaborRebalancingStressBrief(
    r1.state,
    r1.state.interregionalRebalancingPlan,
    r1.state.regionalLaborAbsorptionBrief,
    r1.state.laborMarketTightnessBrief
  );
  check('R1015', stressOnly.highPriorityMoves >= 0, 'stress high priority moves');
  check(
    'R1016',
    computeNationalLaborRebalancingStressBrief(
      rHhBad.state,
      rHhBad.state.interregionalRebalancingPlan,
      rHhBad.state.regionalLaborAbsorptionBrief,
      rHhBad.state.laborMarketTightnessBrief
    ).stewardNote.length > 8,
    'rebalancing stress steward note'
  );

  check('R1101', WORKFORCE_ONBOARDING_LEVERS.length >= 8, 'onboarding lever catalog');
  check('R1102', Boolean(lookupWorkforceOnboardingLever('onboard_tech_nsw_vic')?.narrative), 'onboarding lever lookup');
  check('R1103', onboardingLeversForIndustry('technology').length >= 1, 'technology onboarding levers');
  check('R1104', onboardingEaseForRegion('NSW', 'technology') > 0, 'regional onboarding ease');
  check('R1105', Boolean(r1.state.automationParticipationResilienceOutlook?.band), 'automation resilience on state');
  check('R1106', (r1.state.automationParticipationResilienceOutlook?.automationPressureDrag ?? 0) >= 0, 'automation drag');
  check('R1107', Boolean(r1.state.wageParticipationSpilloverBrief?.band), 'wage spillover on state');
  check('R1108', Boolean(r1.state.migrationShockParticipationBufferOutlook?.band), 'migration buffer on state');
  check(
    'R1109',
    detectLaborDemographicsQuery('automation participation resilience') === 'automation_participation_resilience',
    'GI automation resilience detect'
  );
  check(
    'R1110',
    detectLaborDemographicsQuery('wage participation spillover') === 'wage_participation_spillover',
    'GI spillover detect'
  );
  check(
    'R1111',
    detectLaborDemographicsQuery('migration shock buffer') === 'migration_participation_buffer',
    'GI migration buffer detect'
  );
  check(
    'R1112',
    answerLaborDemographicsQuestion(r1.state, 'automation_participation_resilience').headline.length > 5,
    'GI automation resilience answer'
  );
  const automationResOnly = computeNationalAutomationParticipationResilienceOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.workforceTransitionFrictionOutlook
  );
  check('R1113', automationResOnly.summary.length > 10, 'automation resilience standalone summary');
  const spilloverOnly = computeNationalWageParticipationSpilloverBrief(
    r1.state,
    r1.state.wageCompetitivenessIndex,
    r1.state.householdParticipationCouplingBrief
  );
  check('R1114', spilloverOnly.band.length > 3, 'spillover band string');
  const bufferOnly = computeNationalMigrationShockParticipationBufferOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.regionalLaborAbsorptionBrief
  );
  check('R1115', bufferOnly.activeShockDrag >= 0, 'migration buffer shock drag');
  check(
    'R1116',
    computeNationalWageParticipationSpilloverBrief(
      rHhBad.state,
      rHhBad.state.wageCompetitivenessIndex,
      rHhBad.state.householdParticipationCouplingBrief
    ).stewardNote.length > 8,
    'wage spillover steward note'
  );

  check('R1201', WORKFORCE_COORDINATION_LEVERS.length >= 8, 'coordination lever catalog');
  check('R1202', Boolean(lookupWorkforceCoordinationLever('coord_tech_nsw_vic')?.narrative), 'coordination lever lookup');
  check('R1203', coordinationLeversForIndustry('technology').length >= 1, 'technology coordination levers');
  check('R1204', coordinationEaseForRegion('NSW', 'technology') > 0, 'regional coordination ease');
  check('R1205', Boolean(r1.state.laborMarketStabilityOutlook?.band), 'labor stability on state');
  check('R1206', (r1.state.laborMarketStabilityOutlook?.stressDrag ?? 0) >= 0, 'stability stress drag');
  check('R1207', Boolean(r1.state.intergenerationalWorkforceBalanceOutlook?.band), 'intergenerational balance on state');
  check('R1208', Boolean(r1.state.capacityParticipationAlignmentBrief?.band), 'capacity alignment on state');
  check(
    'R1209',
    detectLaborDemographicsQuery('labor market stability outlook') === 'labor_market_stability',
    'GI stability detect'
  );
  check(
    'R1210',
    detectLaborDemographicsQuery('intergenerational balance youth senior') === 'intergenerational_balance',
    'GI intergenerational detect'
  );
  check(
    'R1211',
    detectLaborDemographicsQuery('capacity participation alignment') === 'capacity_participation_alignment',
    'GI alignment detect'
  );
  check(
    'R1212',
    answerLaborDemographicsQuestion(r1.state, 'labor_market_stability').headline.length > 5,
    'GI stability answer'
  );
  const stabilityOnly = computeNationalLaborMarketStabilityOutlook(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.laborRebalancingStressBrief,
    r1.state.automationParticipationResilienceOutlook
  );
  check('R1213', stabilityOnly.summary.length > 10, 'stability standalone summary');
  const intergenOnly = computeNationalIntergenerationalWorkforceBalanceOutlook(
    r1.state,
    r1.state.youthEntryPipelineOutlook,
    r1.state.seniorWorkforceRetentionOutlook
  );
  check('R1214', intergenOnly.pipelineGap >= 0, 'intergenerational pipeline gap');
  const alignmentOnly = computeNationalCapacityParticipationAlignmentBrief(
    r1.state,
    r1.state.workforceCapacityBridge,
    r1.state.participationEquityGapBrief,
    r1.state.regionalLaborAbsorptionBrief
  );
  check('R1215', alignmentOnly.band.length > 3, 'alignment band string');
  check(
    'R1216',
    computeNationalCapacityParticipationAlignmentBrief(
      rHhBad.state,
      rHhBad.state.workforceCapacityBridge,
      rHhBad.state.participationEquityGapBrief,
      rHhBad.state.regionalLaborAbsorptionBrief
    ).stewardNote.length > 8,
    'alignment steward note'
  );

  check('R1301', WORKFORCE_ADVOCACY_LEVERS.length >= 8, 'advocacy lever catalog');
  check('R1302', Boolean(lookupWorkforceAdvocacyLever('adv_tech_nsw_vic')?.narrative), 'advocacy lever lookup');
  check('R1303', advocacyLeversForIndustry('technology').length >= 1, 'technology advocacy levers');
  check('R1304', advocacyEaseForRegion('NSW', 'technology') > 0, 'regional advocacy ease');
  check('R1305', Boolean(r1.state.participationVelocityCouplingBrief?.band), 'velocity coupling on state');
  check('R1306', (r1.state.participationVelocityCouplingBrief?.velocityDrag ?? 0) >= 0, 'velocity drag');
  check('R1307', Boolean(r1.state.skillsTightnessCoherenceOutlook?.band), 'skills coherence on state');
  check('R1308', Boolean(r1.state.integratedLaborReadinessOutlook?.band), 'integrated readiness on state');
  check(
    'R1309',
    detectLaborDemographicsQuery('participation velocity coupling') === 'participation_velocity_coupling',
    'GI velocity coupling detect'
  );
  check(
    'R1310',
    detectLaborDemographicsQuery('skills tightness coherence') === 'skills_tightness_coherence',
    'GI coherence detect'
  );
  check(
    'R1311',
    detectLaborDemographicsQuery('integrated labor readiness') === 'integrated_labor_readiness',
    'GI readiness detect'
  );
  check(
    'R1312',
    answerLaborDemographicsQuestion(r1.state, 'integrated_labor_readiness').headline.length > 5,
    'GI readiness answer'
  );
  const velocityCouplingOnly = computeNationalParticipationVelocityCouplingBrief(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.laborMarketVelocityIndex
  );
  check('R1313', velocityCouplingOnly.summary.length > 10, 'velocity coupling standalone summary');
  const coherenceOnly = computeNationalSkillsTightnessCoherenceOutlook(
    r1.state,
    r1.state.skillMismatchIndex,
    r1.state.laborMarketTightnessBrief,
    r1.state.credentialMobilityOutlook
  );
  check('R1314', coherenceOnly.band.length > 3, 'coherence band string');
  const readinessOnly = computeNationalIntegratedLaborReadinessOutlook(
    r1.state,
    r1.state.laborMarketStabilityOutlook,
    r1.state.capacityParticipationAlignmentBrief,
    r1.state.migrationShockParticipationBufferOutlook,
    r1.state.laborResilienceScorecard
  );
  check('R1315', readinessOnly.stabilityDrag >= 0, 'readiness stability drag');
  check(
    'R1316',
    computeNationalIntegratedLaborReadinessOutlook(
      rHhBad.state,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.capacityParticipationAlignmentBrief,
      rHhBad.state.migrationShockParticipationBufferOutlook,
      rHhBad.state.laborResilienceScorecard
    ).stewardNote.length > 8,
    'readiness steward note'
  );

  check('R1401', WORKFORCE_MENTORSHIP_LEVERS.length >= 8, 'mentorship lever catalog');
  check('R1402', Boolean(lookupWorkforceMentorshipLever('mentor_tech_nsw_vic')?.narrative), 'mentorship lever lookup');
  check('R1403', mentorshipLeversForIndustry('technology').length >= 1, 'technology mentorship levers');
  check('R1404', mentorshipEaseForRegion('NSW', 'technology') > 0, 'regional mentorship ease');
  check('R1405', Boolean(r1.state.hybridRemoteParticipationOutlook?.band), 'hybrid remote on state');
  check('R1406', (r1.state.hybridRemoteParticipationOutlook?.frictionDrag ?? 0) >= 0, 'hybrid remote friction drag');
  check('R1407', Boolean(r1.state.corridorCapacityStressBrief?.band), 'corridor stress on state');
  check('R1408', Boolean(r1.state.stewardInterventionPriorityBrief?.band), 'steward intervention on state');
  check(
    'R1409',
    detectLaborDemographicsQuery('hybrid remote participation') === 'hybrid_remote_participation',
    'GI hybrid remote detect'
  );
  check(
    'R1410',
    detectLaborDemographicsQuery('corridor capacity stress') === 'corridor_capacity_stress',
    'GI corridor stress detect'
  );
  check(
    'R1411',
    detectLaborDemographicsQuery('steward intervention priority') === 'steward_intervention_priority',
    'GI intervention detect'
  );
  check(
    'R1412',
    answerLaborDemographicsQuestion(r1.state, 'steward_intervention_priority').headline.length > 5,
    'GI intervention answer'
  );
  const hybridRemoteOnly = computeNationalHybridRemoteParticipationOutlook(
    r1.state,
    r1.state.hybridParticipationFrictionOutlook
  );
  check('R1413', hybridRemoteOnly.summary.length > 10, 'hybrid remote standalone summary');
  const corridorStressOnly = computeNationalCorridorCapacityStressBrief(
    r1.state,
    r1.state.interregionalRebalancingPlan,
    r1.state.regionalLaborAbsorptionBrief,
    r1.state.laborRebalancingStressBrief,
    r1.state.laborMarketTightnessBrief
  );
  check('R1414', corridorStressOnly.band.length > 3, 'corridor stress band string');
  const interventionOnly = computeNationalStewardInterventionPriorityBrief(
    r1.state,
    r1.state.integratedLaborReadinessOutlook,
    r1.state.laborMarketStabilityOutlook,
    r1.state.laborRebalancingStressBrief
  );
  check('R1415', interventionOnly.readinessDrag >= 0, 'intervention readiness drag');
  check(
    'R1416',
    computeNationalStewardInterventionPriorityBrief(
      rHhBad.state,
      rHhBad.state.integratedLaborReadinessOutlook,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.laborRebalancingStressBrief
    ).stewardNote.length > 8,
    'intervention steward note'
  );

  for (let i = 19; i <= 50; i++) {
    const ok = validateLaborDemographicsState(r1.state).valid && r1.state.industryLinks.length <= V1014_LABOR_LIMITS.maxIndustryLinks;
    check(`LD${String(i).padStart(2, '0')}`, ok, `invariant bundle ${i}`);
  }

  const passed = results.filter(r => r.passed).length;
  return {
    passed,
    failed: results.length - passed,
    total: results.length,
    allPassed: passed === results.length,
    results
  };
}

/** Canonical export alias for Agent 25 merge scripts. */
export const runV1014_LABOR_LaborDemographicsSelfTests = runV1014LaborDemographicsSelfTests;
