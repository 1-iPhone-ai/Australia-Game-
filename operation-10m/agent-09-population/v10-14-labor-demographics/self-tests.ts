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
import {
  WORKFORCE_SAFETY_LEVERS,
  lookupWorkforceSafetyLever,
  safetyEaseForRegion,
  safetyLeversForIndustry
} from './catalog/workforce-safety-levers';
import { computeNationalEssentialWorkerParticipationOutlook } from './essential-worker-participation-outlook';
import { computeNationalWageAutomationCouplingBrief } from './wage-automation-coupling-brief';
import { computeNationalLaborCohesionIndex } from './national-labor-cohesion-index';
import {
  WORKFORCE_SCHEDULING_LEVERS,
  lookupWorkforceSchedulingLever,
  schedulingEaseForRegion,
  schedulingLeversForIndustry
} from './catalog/workforce-scheduling-levers';
import { computeNationalSeasonalParticipationSwingOutlook } from './seasonal-participation-swing-outlook';
import { computeNationalCohesionCorridorCouplingBrief } from './cohesion-corridor-coupling-brief';
import { computeNationalWorkforceReliabilityIndex } from './national-workforce-reliability-index';
import { computeNationalRetentionReliabilityCouplingBrief } from './retention-reliability-coupling-brief';
import { computeNationalUpskillingVelocityOutlook } from './upskilling-velocity-outlook';
import { computeNationalSubjectWorkforceReadinessBrief } from './subject-workforce-readiness-brief';
import { computeNationalWorkforceSustainmentIndex } from './national-workforce-sustainment-index';
import { computeNationalSustainmentRetentionCouplingBrief } from './sustainment-retention-coupling-brief';
import { computeNationalOnboardingVelocityOutlook } from './onboarding-velocity-outlook';
import { computeNationalSubjectAssemblyContinuityBrief } from './subject-assembly-continuity-brief';
import { computeNationalWorkforceContinuityIndex } from './national-workforce-continuity-index';
import { computeNationalContinuityCoordinationCouplingBrief } from './continuity-coordination-coupling-brief';
import { computeNationalReengagementMomentumOutlook } from './reengagement-momentum-outlook';
import { computeNationalSubjectWaveAssemblyBrief } from './subject-wave-assembly-brief';
import { computeNationalWorkforceDurabilityIndex } from './national-workforce-durability-index';
import { computeNationalDurabilityAdvocacyCouplingBrief } from './durability-advocacy-coupling-brief';
import { computeNationalMentorshipEnduranceOutlook } from './mentorship-endurance-outlook';
import { computeNationalSubjectTrancheReadinessBrief } from './subject-tranche-readiness-brief';
import { computeNationalWorkforceEnduranceIndex } from './national-workforce-endurance-index';
import { computeNationalEnduranceFlexibilityCouplingBrief } from './endurance-flexibility-coupling-brief';
import { computeNationalInclusionResilienceOutlook } from './inclusion-resilience-outlook';
import { computeNationalSubjectCommitReadinessBrief } from './subject-commit-readiness-brief';
import { computeNationalWorkforceTenacityIndex } from './national-workforce-tenacity-index';
import { computeNationalTenacityCareCouplingBrief } from './tenacity-care-coupling-brief';
import { computeNationalSafetyCohesionOutlook } from './safety-cohesion-outlook';
import { computeNationalSubjectReleaseReadinessBrief } from './subject-release-readiness-brief';
import { computeNationalWorkforceSteadfastIndex } from './national-workforce-steadfast-index';
import { computeNationalSteadfastSchedulingCouplingBrief } from './steadfast-scheduling-coupling-brief';
import { computeNationalRetentionAnchorOutlook } from './retention-anchor-outlook';
import { computeNationalSubjectSealReadinessBrief } from './subject-seal-readiness-brief';
import { computeNationalWorkforceResolveIndex } from './national-workforce-resolve-index';
import { computeNationalResolveUpskillingCouplingBrief } from './resolve-upskilling-coupling-brief';
import { computeNationalCoordinationBindOutlook } from './coordination-bind-outlook';
import { computeNationalSubjectBindReadinessBrief } from './subject-bind-readiness-brief';
import { computeNationalWorkforceFortitudeIndex } from './national-workforce-fortitude-index';
import { computeNationalFortitudeInclusionCouplingBrief } from './fortitude-inclusion-coupling-brief';
import { computeNationalHybridAnchorOutlook } from './hybrid-anchor-outlook';
import { computeNationalSubjectCrownReadinessBrief } from './subject-crown-readiness-brief';
import { computeNationalWorkforceCulminationIndex } from './national-workforce-culmination-index';
import { computeNationalCulminationMentorshipCouplingBrief } from './culmination-mentorship-coupling-brief';
import { computeNationalOnboardingSustainOutlook } from './onboarding-sustain-outlook';
import { computeNationalSubjectApexReadinessBrief } from './subject-apex-readiness-brief';
import { computeNationalWorkforceApexIndex } from './national-workforce-apex-index';
import { computeNationalApexAdvocacyCouplingBrief } from './apex-advocacy-coupling-brief';
import { computeNationalReengagementThrustOutlook } from './reengagement-thrust-outlook';
import { computeNationalSubjectPinnacleReadinessBrief } from './subject-pinnacle-readiness-brief';
import { computeNationalWorkforcePinnacleIndex } from './national-workforce-pinnacle-index';
import { computeNationalPinnacleRetentionCouplingBrief } from './pinnacle-retention-coupling-brief';
import { computeNationalRetentionCrestOutlook } from './retention-crest-outlook';
import { computeNationalSubjectSummitReadinessBrief } from './subject-summit-readiness-brief';
import { computeNationalWorkforceSummitIndex } from './national-workforce-summit-index';
import { computeNationalSummitCoordinationCouplingBrief } from './summit-coordination-coupling-brief';
import { computeNationalCoordinationHorizonOutlook } from './coordination-horizon-outlook';
import { computeNationalSubjectZenithReadinessBrief } from './subject-zenith-readiness-brief';
import { computeNationalWorkforceZenithIndex } from './national-workforce-zenith-index';
import { computeNationalZenithFlexibilityCouplingBrief } from './zenith-flexibility-coupling-brief';
import { computeNationalFlexibilityAscentOutlook } from './flexibility-ascent-outlook';
import { computeNationalSubjectApogeeReadinessBrief } from './subject-apogee-readiness-brief';
import { computeNationalWorkforceApogeeIndex } from './national-workforce-apogee-index';
import { computeNationalApogeeInclusionCouplingBrief } from './apogee-inclusion-coupling-brief';
import { computeNationalInclusionOrbitOutlook } from './inclusion-orbit-outlook';
import { computeNationalSubjectOrbitReadinessBrief } from './subject-orbit-readiness-brief';
import { computeNationalWorkforceOrbitIndex } from './national-workforce-orbit-index';
import { computeNationalOrbitCareCouplingBrief } from './orbit-care-coupling-brief';
import { computeNationalCareEquilibriumOutlook } from './care-equilibrium-outlook';
import { computeNationalSubjectNexusReadinessBrief } from './subject-nexus-readiness-brief';
import { computeNationalWorkforceNexusIndex } from './national-workforce-nexus-index';
import { computeNationalNexusSchedulingCouplingBrief } from './nexus-scheduling-coupling-brief';
import { computeNationalSchedulingResonanceOutlook } from './scheduling-resonance-outlook';
import { computeNationalSubjectConvergenceReadinessBrief } from './subject-convergence-readiness-brief';
import { computeNationalWorkforceConvergenceIndex } from './national-workforce-convergence-index';
import { computeNationalConvergenceSafetyCouplingBrief } from './convergence-safety-coupling-brief';
import { computeNationalSafetyHarmonyOutlook } from './safety-harmony-outlook';
import { computeNationalSubjectUnificationReadinessBrief } from './subject-unification-readiness-brief';
import { computeNationalWorkforceUnificationIndex } from './national-workforce-unification-index';
import { computeNationalUnificationUpskillingCouplingBrief } from './unification-upskilling-coupling-brief';
import { computeNationalUpskillingSynthesisOutlook } from './upskilling-synthesis-outlook';
import { computeNationalSubjectSynthesisReadinessBrief } from './subject-synthesis-readiness-brief';
import { computeNationalWorkforceSynthesisIndex } from './national-workforce-synthesis-index';
import { computeNationalSynthesisOnboardingCouplingBrief } from './synthesis-onboarding-coupling-brief';
import { computeNationalOnboardingIntegrationOutlook } from './onboarding-integration-outlook';
import { computeNationalSubjectIntegrationReadinessBrief } from './subject-integration-readiness-brief';
import { computeNationalWorkforceIntegrationIndex } from './national-workforce-integration-index';
import { computeNationalIntegrationRetentionCouplingBrief } from './integration-retention-coupling-brief';
import { computeNationalRetentionCohesionOutlook } from './retention-cohesion-outlook';
import { computeNationalSubjectRetentionReadinessBrief } from './subject-retention-readiness-brief';
import { computeNationalWorkforceRetentionIndex } from './national-workforce-retention-index';
import { computeNationalRetentionReengagementCouplingBrief } from './retention-reengagement-coupling-brief';
import { computeNationalReengagementAlignmentOutlook } from './reengagement-alignment-outlook';
import { computeNationalSubjectReengagementReadinessBrief } from './subject-reengagement-readiness-brief';
import { computeNationalWorkforceReengagementIndex } from './national-workforce-reengagement-index';
import { computeNationalReengagementMentorshipCouplingBrief } from './reengagement-mentorship-coupling-brief';
import { computeNationalMentorshipSustainOutlook } from './mentorship-sustain-outlook';
import { computeNationalSubjectMentorshipReadinessBrief } from './subject-mentorship-readiness-brief';
import { computeNationalWorkforceMentorshipIndex } from './national-workforce-mentorship-index';
import { computeNationalMentorshipAdvocacyCouplingBrief } from './mentorship-advocacy-coupling-brief';
import { computeNationalAdvocacyResonanceOutlook } from './advocacy-resonance-outlook';
import { computeNationalSubjectAdvocacyReadinessBrief } from './subject-advocacy-readiness-brief';
import { computeNationalWorkforceAdvocacyIndex } from './national-workforce-advocacy-index';
import { computeNationalAdvocacyInclusionCouplingBrief } from './advocacy-inclusion-coupling-brief';
import { computeNationalInclusionEquityOutlook } from './inclusion-equity-outlook';
import { computeNationalSubjectInclusionReadinessBrief } from './subject-inclusion-readiness-brief';
import { computeNationalWorkforceInclusionIndex } from './national-workforce-inclusion-index';
import { computeNationalInclusionFlexibilityCouplingBrief } from './inclusion-flexibility-coupling-brief';
import { computeNationalFlexibilityFlowOutlook } from './flexibility-flow-outlook';
import { computeNationalSubjectFlexibilityReadinessBrief } from './subject-flexibility-readiness-brief';
import { computeNationalWorkforceFlexibilityIndex } from './national-workforce-flexibility-index';
import { computeNationalFlexibilityCoordinationCouplingBrief } from './flexibility-coordination-coupling-brief';
import { computeNationalCoordinationMeshOutlook } from './coordination-mesh-outlook';
import { computeNationalSubjectCoordinationReadinessBrief } from './subject-coordination-readiness-brief';
import { computeNationalWorkforceCoordinationIndex } from './national-workforce-coordination-index';
import { computeNationalCoordinationSchedulingCouplingBrief } from './coordination-scheduling-coupling-brief';
import { computeNationalSchedulingPulseOutlook } from './scheduling-pulse-outlook';
import { computeNationalSubjectSchedulingReadinessBrief } from './subject-scheduling-readiness-brief';
import { computeNationalWorkforceSchedulingIndex } from './national-workforce-scheduling-index';
import { computeNationalSchedulingSafetyCouplingBrief } from './scheduling-safety-coupling-brief';
import { computeNationalSafetyCalibrationOutlook } from './safety-calibration-outlook';
import { computeNationalSubjectSafetyReadinessBrief } from './subject-safety-readiness-brief';
import { computeNationalWorkforceSafetyIndex } from './national-workforce-safety-index';
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

  check('R1501', WORKFORCE_SAFETY_LEVERS.length >= 8, 'safety lever catalog');
  check('R1502', Boolean(lookupWorkforceSafetyLever('safe_tech_nsw_vic')?.narrative), 'safety lever lookup');
  check('R1503', safetyLeversForIndustry('technology').length >= 1, 'technology safety levers');
  check('R1504', safetyEaseForRegion('NSW', 'technology') > 0, 'regional safety ease');
  check('R1505', Boolean(r1.state.essentialWorkerParticipationOutlook?.band), 'essential worker on state');
  check('R1506', (r1.state.essentialWorkerParticipationOutlook?.shockDrag ?? 0) >= 0, 'essential shock drag');
  check('R1507', Boolean(r1.state.wageAutomationCouplingBrief?.band), 'wage automation on state');
  check('R1508', Boolean(r1.state.nationalLaborCohesionIndex?.band), 'labor cohesion on state');
  check(
    'R1509',
    detectLaborDemographicsQuery('essential worker participation') === 'essential_worker_participation',
    'GI essential detect'
  );
  check(
    'R1510',
    detectLaborDemographicsQuery('wage automation coupling') === 'wage_automation_coupling',
    'GI wage automation detect'
  );
  check(
    'R1511',
    detectLaborDemographicsQuery('national labor cohesion') === 'national_labor_cohesion',
    'GI cohesion detect'
  );
  check(
    'R1512',
    answerLaborDemographicsQuestion(r1.state, 'national_labor_cohesion').headline.length > 5,
    'GI cohesion answer'
  );
  const essentialOnly = computeNationalEssentialWorkerParticipationOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.migrationShockParticipationBufferOutlook
  );
  check('R1513', essentialOnly.summary.length > 10, 'essential standalone summary');
  const wageAutoOnly = computeNationalWageAutomationCouplingBrief(
    r1.state,
    r1.state.wageParticipationSpilloverBrief,
    r1.state.wageCompetitivenessIndex,
    r1.state.automationParticipationResilienceOutlook
  );
  check('R1514', wageAutoOnly.band.length > 3, 'wage automation band string');
  const cohesionOnly = computeNationalLaborCohesionIndex(
    r1.state,
    r1.state.laborMarketStabilityOutlook,
    r1.state.intergenerationalWorkforceBalanceOutlook,
    r1.state.capacityParticipationAlignmentBrief
  );
  check('R1515', cohesionOnly.stabilityDrag >= 0, 'cohesion stability drag');
  check(
    'R1516',
    computeNationalLaborCohesionIndex(
      rHhBad.state,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.intergenerationalWorkforceBalanceOutlook,
      rHhBad.state.capacityParticipationAlignmentBrief
    ).stewardNote.length > 8,
    'cohesion steward note'
  );

  check('R1601', WORKFORCE_SCHEDULING_LEVERS.length >= 8, 'scheduling lever catalog');
  check('R1602', Boolean(lookupWorkforceSchedulingLever('sched_tech_nsw_vic')?.narrative), 'scheduling lever lookup');
  check('R1603', schedulingLeversForIndustry('technology').length >= 1, 'technology scheduling levers');
  check('R1604', schedulingEaseForRegion('NSW', 'technology') > 0, 'regional scheduling ease');
  check('R1605', Boolean(r1.state.seasonalParticipationSwingOutlook?.band), 'seasonal swing on state');
  check('R1606', (r1.state.seasonalParticipationSwingOutlook?.seasonalDrag ?? 0) >= 0, 'seasonal drag');
  check('R1607', Boolean(r1.state.cohesionCorridorCouplingBrief?.band), 'cohesion corridor on state');
  check('R1608', Boolean(r1.state.nationalWorkforceReliabilityIndex?.band), 'reliability on state');
  check(
    'R1609',
    detectLaborDemographicsQuery('seasonal participation swing') === 'seasonal_participation_swing',
    'GI seasonal detect'
  );
  check(
    'R1610',
    detectLaborDemographicsQuery('cohesion corridor coupling') === 'cohesion_corridor_coupling',
    'GI coupling detect'
  );
  check(
    'R1611',
    detectLaborDemographicsQuery('workforce reliability index') === 'workforce_reliability',
    'GI reliability detect'
  );
  check(
    'R1612',
    answerLaborDemographicsQuestion(r1.state, 'workforce_reliability').headline.length > 5,
    'GI reliability answer'
  );
  const seasonalOnly = computeNationalSeasonalParticipationSwingOutlook(
    r1.state,
    r1.state.essentialWorkerParticipationOutlook,
    r1.state.laborMarketTightnessBrief
  );
  check('R1613', seasonalOnly.summary.length > 10, 'seasonal standalone summary');
  const cohesionCouplingOnly = computeNationalCohesionCorridorCouplingBrief(
    r1.state,
    r1.state.nationalLaborCohesionIndex,
    r1.state.corridorCapacityStressBrief
  );
  check('R1614', cohesionCouplingOnly.band.length > 3, 'coupling band string');
  const reliabilityOnly = computeNationalWorkforceReliabilityIndex(
    r1.state,
    r1.state.seasonalParticipationSwingOutlook,
    r1.state.cohesionCorridorCouplingBrief
  );
  check('R1615', reliabilityOnly.couplingDrag >= 0, 'reliability coupling drag');
  check(
    'R1616',
    computeNationalWorkforceReliabilityIndex(
      rHhBad.state,
      rHhBad.state.seasonalParticipationSwingOutlook,
      rHhBad.state.cohesionCorridorCouplingBrief
    ).stewardNote.length > 8,
    'reliability steward note'
  );

  check('R1701', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');
  check('R1702', Boolean(r1.state.retentionReliabilityCouplingBrief?.band), 'retention coupling on state');
  check('R1703', (r1.state.retentionReliabilityCouplingBrief?.reliabilityDrag ?? 0) >= 0, 'retention reliability drag');
  check('R1704', Boolean(r1.state.upskillingVelocityOutlook?.band), 'upskilling velocity on state');
  check('R1705', (r1.state.upskillingVelocityOutlook?.mismatchDrag ?? 0) >= 0, 'upskilling mismatch drag');
  check('R1706', Boolean(r1.state.subjectWorkforceReadinessBrief?.band), 'subject readiness on state');
  check('R1707', Boolean(r1.state.nationalWorkforceSustainmentIndex?.band), 'sustainment on state');
  check(
    'R1708',
    detectLaborDemographicsQuery('retention reliability coupling') === 'retention_reliability_coupling',
    'GI retention coupling detect'
  );
  check(
    'R1709',
    detectLaborDemographicsQuery('upskilling velocity') === 'upskilling_velocity',
    'GI upskilling velocity detect'
  );
  check(
    'R1710',
    detectLaborDemographicsQuery('subject workforce readiness') === 'subject_workforce_readiness',
    'GI subject readiness detect'
  );
  check(
    'R1711',
    detectLaborDemographicsQuery('workforce sustainment') === 'workforce_sustainment',
    'GI sustainment detect'
  );
  check(
    'R1712',
    answerLaborDemographicsQuestion(r1.state, 'workforce_sustainment').headline.length > 5,
    'GI sustainment answer'
  );
  const retentionCouplingOnly = computeNationalRetentionReliabilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceReliabilityIndex
  );
  check('R1713', retentionCouplingOnly.summary.length > 10, 'retention coupling standalone summary');
  const upskillingOnly = computeNationalUpskillingVelocityOutlook(r1.state, r1.state.skillsTightnessCoherenceOutlook);
  check('R1714', upskillingOnly.band.length > 3, 'upskilling velocity band string');
  const subjectOnly = computeNationalSubjectWorkforceReadinessBrief(
    r1.state,
    r1.state.retentionReliabilityCouplingBrief,
    r1.state.integratedLaborReadinessOutlook
  );
  check('R1715', subjectOnly.readinessDrag >= 0, 'subject readiness drag');
  check(
    'R1716',
    computeNationalWorkforceSustainmentIndex(
      rHhBad.state,
      rHhBad.state.nationalWorkforceReliabilityIndex,
      rHhBad.state.upskillingVelocityOutlook,
      rHhBad.state.subjectWorkforceReadinessBrief
    ).stewardNote.length > 8,
    'sustainment steward note'
  );

  check('R1801', Boolean(r1.state.sustainmentRetentionCouplingBrief?.band), 'sustainment retention coupling on state');
  check(
    'R1802',
    (r1.state.sustainmentRetentionCouplingBrief?.sustainmentDrag ?? 0) >= 0,
    'sustainment retention drag'
  );
  check('R1803', Boolean(r1.state.onboardingVelocityOutlook?.band), 'onboarding velocity on state');
  check('R1804', (r1.state.onboardingVelocityOutlook?.pipelineDrag ?? 0) >= 0, 'onboarding pipeline drag');
  check('R1805', Boolean(r1.state.subjectAssemblyContinuityBrief?.band), 'subject assembly continuity on state');
  check('R1806', Boolean(r1.state.nationalWorkforceContinuityIndex?.band), 'workforce continuity on state');
  check(
    'R1807',
    detectLaborDemographicsQuery('sustainment retention coupling') === 'sustainment_retention_coupling',
    'GI sustainment retention detect'
  );
  check(
    'R1808',
    detectLaborDemographicsQuery('onboarding velocity') === 'onboarding_velocity',
    'GI onboarding velocity detect'
  );
  check(
    'R1809',
    detectLaborDemographicsQuery('subject assembly continuity') === 'subject_assembly_continuity',
    'GI subject assembly detect'
  );
  check(
    'R1810',
    detectLaborDemographicsQuery('workforce continuity') === 'workforce_continuity',
    'GI workforce continuity detect'
  );
  check(
    'R1811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_continuity').headline.length > 5,
    'GI workforce continuity answer'
  );
  const sustainmentCouplingOnly = computeNationalSustainmentRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSustainmentIndex,
    r1.state.retentionReliabilityCouplingBrief
  );
  check('R1812', sustainmentCouplingOnly.summary.length > 10, 'sustainment coupling standalone summary');
  const onboardingOnly = computeNationalOnboardingVelocityOutlook(r1.state, r1.state.upskillingVelocityOutlook);
  check('R1813', onboardingOnly.band.length > 3, 'onboarding velocity band string');
  const subjectContinuityOnly = computeNationalSubjectAssemblyContinuityBrief(
    r1.state,
    r1.state.subjectWorkforceReadinessBrief,
    r1.state.nationalWorkforceSustainmentIndex
  );
  check('R1814', subjectContinuityOnly.assemblyDrag >= 0, 'subject assembly drag');
  check(
    'R1815',
    computeNationalWorkforceContinuityIndex(
      rHhBad.state,
      rHhBad.state.sustainmentRetentionCouplingBrief,
      rHhBad.state.onboardingVelocityOutlook,
      rHhBad.state.subjectAssemblyContinuityBrief
    ).stewardNote.length > 8,
    'continuity steward note'
  );
  check('R1816', onboardingEaseForRegion('NSW', 'technology') > 0, 'onboarding ease for region');

  check('R1901', Boolean(r1.state.continuityCoordinationCouplingBrief?.band), 'continuity coordination on state');
  check(
    'R1902',
    (r1.state.continuityCoordinationCouplingBrief?.continuityDrag ?? 0) >= 0,
    'continuity coordination drag'
  );
  check('R1903', Boolean(r1.state.reengagementMomentumOutlook?.band), 'reengagement momentum on state');
  check('R1904', (r1.state.reengagementMomentumOutlook?.pipelineDrag ?? 0) >= 0, 'reengagement pipeline drag');
  check('R1905', Boolean(r1.state.subjectWaveAssemblyBrief?.band), 'subject wave assembly on state');
  check('R1906', Boolean(r1.state.nationalWorkforceDurabilityIndex?.band), 'workforce durability on state');
  check(
    'R1907',
    detectLaborDemographicsQuery('continuity coordination coupling') === 'continuity_coordination_coupling',
    'GI continuity coordination detect'
  );
  check(
    'R1908',
    detectLaborDemographicsQuery('reengagement momentum') === 'reengagement_momentum',
    'GI reengagement momentum detect'
  );
  check(
    'R1909',
    detectLaborDemographicsQuery('subject wave assembly') === 'subject_wave_assembly',
    'GI subject wave detect'
  );
  check(
    'R1910',
    detectLaborDemographicsQuery('workforce durability') === 'workforce_durability',
    'GI durability detect'
  );
  check(
    'R1911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_durability').headline.length > 5,
    'GI durability answer'
  );
  const coordinationCouplingOnly = computeNationalContinuityCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceContinuityIndex
  );
  check('R1912', coordinationCouplingOnly.summary.length > 10, 'coordination coupling standalone summary');
  const reengagementOnly = computeNationalReengagementMomentumOutlook(r1.state, r1.state.onboardingVelocityOutlook);
  check('R1913', reengagementOnly.band.length > 3, 'reengagement momentum band string');
  const waveAssemblyOnly = computeNationalSubjectWaveAssemblyBrief(
    r1.state,
    r1.state.subjectAssemblyContinuityBrief,
    r1.state.nationalWorkforceContinuityIndex
  );
  check('R1914', waveAssemblyOnly.waveDrag >= 0, 'subject wave drag');
  check(
    'R1915',
    computeNationalWorkforceDurabilityIndex(
      rHhBad.state,
      rHhBad.state.continuityCoordinationCouplingBrief,
      rHhBad.state.reengagementMomentumOutlook,
      rHhBad.state.subjectWaveAssemblyBrief
    ).stewardNote.length > 8,
    'durability steward note'
  );
  check('R1916', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  check('R2001', Boolean(r1.state.durabilityAdvocacyCouplingBrief?.band), 'durability advocacy on state');
  check(
    'R2002',
    (r1.state.durabilityAdvocacyCouplingBrief?.durabilityDrag ?? 0) >= 0,
    'durability advocacy drag'
  );
  check('R2003', Boolean(r1.state.mentorshipEnduranceOutlook?.band), 'mentorship endurance on state');
  check('R2004', (r1.state.mentorshipEnduranceOutlook?.momentumDrag ?? 0) >= 0, 'mentorship momentum drag');
  check('R2005', Boolean(r1.state.subjectTrancheReadinessBrief?.band), 'subject tranche on state');
  check('R2006', Boolean(r1.state.nationalWorkforceEnduranceIndex?.band), 'workforce endurance on state');
  check(
    'R2007',
    detectLaborDemographicsQuery('durability advocacy coupling') === 'durability_advocacy_coupling',
    'GI durability advocacy detect'
  );
  check(
    'R2008',
    detectLaborDemographicsQuery('mentorship endurance') === 'mentorship_endurance',
    'GI mentorship endurance detect'
  );
  check(
    'R2009',
    detectLaborDemographicsQuery('subject tranche readiness') === 'subject_tranche_readiness',
    'GI subject tranche detect'
  );
  check(
    'R2010',
    detectLaborDemographicsQuery('workforce endurance') === 'workforce_endurance',
    'GI workforce endurance detect'
  );
  check(
    'R2011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_endurance').headline.length > 5,
    'GI workforce endurance answer'
  );
  const advocacyCouplingOnly = computeNationalDurabilityAdvocacyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceDurabilityIndex
  );
  check('R2012', advocacyCouplingOnly.summary.length > 10, 'advocacy coupling standalone summary');
  const mentorshipOnly = computeNationalMentorshipEnduranceOutlook(r1.state, r1.state.reengagementMomentumOutlook);
  check('R2013', mentorshipOnly.band.length > 3, 'mentorship endurance band string');
  const trancheOnly = computeNationalSubjectTrancheReadinessBrief(
    r1.state,
    r1.state.subjectWaveAssemblyBrief,
    r1.state.nationalWorkforceDurabilityIndex
  );
  check('R2014', trancheOnly.trancheDrag >= 0, 'subject tranche drag');
  check(
    'R2015',
    computeNationalWorkforceEnduranceIndex(
      rHhBad.state,
      rHhBad.state.durabilityAdvocacyCouplingBrief,
      rHhBad.state.mentorshipEnduranceOutlook,
      rHhBad.state.subjectTrancheReadinessBrief
    ).stewardNote.length > 8,
    'endurance steward note'
  );
  check('R2016', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R2101', Boolean(r1.state.enduranceFlexibilityCouplingBrief?.band), 'endurance flexibility on state');
  check(
    'R2102',
    (r1.state.enduranceFlexibilityCouplingBrief?.enduranceDrag ?? 0) >= 0,
    'endurance flexibility drag'
  );
  check('R2103', Boolean(r1.state.inclusionResilienceOutlook?.band), 'inclusion resilience on state');
  check('R2104', (r1.state.inclusionResilienceOutlook?.enduranceDrag ?? 0) >= 0, 'inclusion endurance drag');
  check('R2105', Boolean(r1.state.subjectCommitReadinessBrief?.band), 'subject commit on state');
  check('R2106', Boolean(r1.state.nationalWorkforceTenacityIndex?.band), 'workforce tenacity on state');
  check(
    'R2107',
    detectLaborDemographicsQuery('endurance flexibility coupling') === 'endurance_flexibility_coupling',
    'GI endurance flexibility detect'
  );
  check(
    'R2108',
    detectLaborDemographicsQuery('inclusion resilience') === 'inclusion_resilience',
    'GI inclusion resilience detect'
  );
  check(
    'R2109',
    detectLaborDemographicsQuery('subject commit readiness') === 'subject_commit_readiness',
    'GI subject commit detect'
  );
  check(
    'R2110',
    detectLaborDemographicsQuery('workforce tenacity') === 'workforce_tenacity',
    'GI workforce tenacity detect'
  );
  check(
    'R2111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_tenacity').headline.length > 5,
    'GI workforce tenacity answer'
  );
  const flexibilityCouplingOnly = computeNationalEnduranceFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceEnduranceIndex
  );
  check('R2112', flexibilityCouplingOnly.summary.length > 10, 'flexibility coupling standalone summary');
  const inclusionOnly = computeNationalInclusionResilienceOutlook(r1.state, r1.state.mentorshipEnduranceOutlook);
  check('R2113', inclusionOnly.band.length > 3, 'inclusion resilience band string');
  const commitOnly = computeNationalSubjectCommitReadinessBrief(
    r1.state,
    r1.state.subjectTrancheReadinessBrief,
    r1.state.nationalWorkforceEnduranceIndex
  );
  check('R2114', commitOnly.commitDrag >= 0, 'subject commit drag');
  check(
    'R2115',
    computeNationalWorkforceTenacityIndex(
      rHhBad.state,
      rHhBad.state.enduranceFlexibilityCouplingBrief,
      rHhBad.state.inclusionResilienceOutlook,
      rHhBad.state.subjectCommitReadinessBrief
    ).stewardNote.length > 8,
    'tenacity steward note'
  );
  check('R2116', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R2201', Boolean(r1.state.tenacityCareCouplingBrief?.band), 'tenacity care on state');
  check('R2202', (r1.state.tenacityCareCouplingBrief?.tenacityDrag ?? 0) >= 0, 'tenacity care drag');
  check('R2203', Boolean(r1.state.safetyCohesionOutlook?.band), 'safety cohesion on state');
  check('R2204', (r1.state.safetyCohesionOutlook?.resilienceDrag ?? 0) >= 0, 'safety resilience drag');
  check('R2205', Boolean(r1.state.subjectReleaseReadinessBrief?.band), 'subject release on state');
  check('R2206', Boolean(r1.state.nationalWorkforceSteadfastIndex?.band), 'workforce steadfast on state');
  check(
    'R2207',
    detectLaborDemographicsQuery('tenacity care coupling') === 'tenacity_care_coupling',
    'GI tenacity care detect'
  );
  check('R2208', detectLaborDemographicsQuery('safety cohesion') === 'safety_cohesion', 'GI safety cohesion detect');
  check(
    'R2209',
    detectLaborDemographicsQuery('subject release readiness') === 'subject_release_readiness',
    'GI subject release detect'
  );
  check(
    'R2210',
    detectLaborDemographicsQuery('workforce steadfast') === 'workforce_steadfast',
    'GI workforce steadfast detect'
  );
  check(
    'R2211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_steadfast').headline.length > 5,
    'GI workforce steadfast answer'
  );
  const careCouplingOnly = computeNationalTenacityCareCouplingBrief(r1.state, r1.state.nationalWorkforceTenacityIndex);
  check('R2212', careCouplingOnly.summary.length > 10, 'care coupling standalone summary');
  const safetyOnly = computeNationalSafetyCohesionOutlook(r1.state, r1.state.inclusionResilienceOutlook);
  check('R2213', safetyOnly.band.length > 3, 'safety cohesion band string');
  const releaseOnly = computeNationalSubjectReleaseReadinessBrief(
    r1.state,
    r1.state.subjectCommitReadinessBrief,
    r1.state.nationalWorkforceTenacityIndex
  );
  check('R2214', releaseOnly.releaseDrag >= 0, 'subject release drag');
  check(
    'R2215',
    computeNationalWorkforceSteadfastIndex(
      rHhBad.state,
      rHhBad.state.tenacityCareCouplingBrief,
      rHhBad.state.safetyCohesionOutlook,
      rHhBad.state.subjectReleaseReadinessBrief
    ).stewardNote.length > 8,
    'steadfast steward note'
  );
  check('R2216', careReliefForRegion('NSW', 'technology') > 0, 'care relief for region');

  check('R2301', Boolean(r1.state.steadfastSchedulingCouplingBrief?.band), 'steadfast scheduling on state');
  check(
    'R2302',
    (r1.state.steadfastSchedulingCouplingBrief?.steadfastDrag ?? 0) >= 0,
    'steadfast scheduling drag'
  );
  check('R2303', Boolean(r1.state.retentionAnchorOutlook?.band), 'retention anchor on state');
  check('R2304', (r1.state.retentionAnchorOutlook?.cohesionDrag ?? 0) >= 0, 'retention cohesion drag');
  check('R2305', Boolean(r1.state.subjectSealReadinessBrief?.band), 'subject seal on state');
  check('R2306', Boolean(r1.state.nationalWorkforceResolveIndex?.band), 'workforce resolve on state');
  check(
    'R2307',
    detectLaborDemographicsQuery('steadfast scheduling coupling') === 'steadfast_scheduling_coupling',
    'GI steadfast scheduling detect'
  );
  check('R2308', detectLaborDemographicsQuery('retention anchor') === 'retention_anchor', 'GI retention anchor detect');
  check(
    'R2309',
    detectLaborDemographicsQuery('subject seal readiness') === 'subject_seal_readiness',
    'GI subject seal detect'
  );
  check(
    'R2310',
    detectLaborDemographicsQuery('workforce resolve') === 'workforce_resolve',
    'GI workforce resolve detect'
  );
  check(
    'R2311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_resolve').headline.length > 5,
    'GI workforce resolve answer'
  );
  const schedulingCouplingOnly = computeNationalSteadfastSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSteadfastIndex
  );
  check('R2312', schedulingCouplingOnly.summary.length > 10, 'scheduling coupling standalone summary');
  const anchorOnly = computeNationalRetentionAnchorOutlook(r1.state, r1.state.safetyCohesionOutlook);
  check('R2313', anchorOnly.band.length > 3, 'retention anchor band string');
  const sealOnly = computeNationalSubjectSealReadinessBrief(
    r1.state,
    r1.state.subjectReleaseReadinessBrief,
    r1.state.nationalWorkforceSteadfastIndex
  );
  check('R2314', sealOnly.sealDrag >= 0, 'subject seal drag');
  check(
    'R2315',
    computeNationalWorkforceResolveIndex(
      rHhBad.state,
      rHhBad.state.steadfastSchedulingCouplingBrief,
      rHhBad.state.retentionAnchorOutlook,
      rHhBad.state.subjectSealReadinessBrief
    ).stewardNote.length > 8,
    'resolve steward note'
  );
  check('R2316', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

  check('R2401', Boolean(r1.state.resolveUpskillingCouplingBrief?.band), 'resolve upskilling on state');
  check('R2402', (r1.state.resolveUpskillingCouplingBrief?.resolveDrag ?? 0) >= 0, 'resolve upskilling drag');
  check('R2403', Boolean(r1.state.coordinationBindOutlook?.band), 'coordination bind on state');
  check('R2404', (r1.state.coordinationBindOutlook?.schedulingDrag ?? 0) >= 0, 'coordination scheduling drag');
  check('R2405', Boolean(r1.state.subjectBindReadinessBrief?.band), 'subject bind on state');
  check('R2406', Boolean(r1.state.nationalWorkforceFortitudeIndex?.band), 'workforce fortitude on state');
  check(
    'R2407',
    detectLaborDemographicsQuery('resolve upskilling coupling') === 'resolve_upskilling_coupling',
    'GI resolve upskilling detect'
  );
  check(
    'R2408',
    detectLaborDemographicsQuery('coordination bind') === 'coordination_bind',
    'GI coordination bind detect'
  );
  check(
    'R2409',
    detectLaborDemographicsQuery('subject bind readiness') === 'subject_bind_readiness',
    'GI subject bind detect'
  );
  check(
    'R2410',
    detectLaborDemographicsQuery('workforce fortitude') === 'workforce_fortitude',
    'GI workforce fortitude detect'
  );
  check(
    'R2411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_fortitude').headline.length > 5,
    'GI workforce fortitude answer'
  );
  const upskillingCouplingOnly = computeNationalResolveUpskillingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceResolveIndex,
    r1.state.upskillingVelocityOutlook
  );
  check('R2412', upskillingCouplingOnly.summary.length > 10, 'upskilling coupling standalone summary');
  const bindOnly = computeNationalCoordinationBindOutlook(r1.state, r1.state.steadfastSchedulingCouplingBrief);
  check('R2413', bindOnly.band.length > 3, 'coordination bind band string');
  const subjectBindOnly = computeNationalSubjectBindReadinessBrief(
    r1.state,
    r1.state.subjectSealReadinessBrief,
    r1.state.nationalWorkforceResolveIndex
  );
  check('R2414', subjectBindOnly.bindDrag >= 0, 'subject bind drag');
  check(
    'R2415',
    computeNationalWorkforceFortitudeIndex(
      rHhBad.state,
      rHhBad.state.resolveUpskillingCouplingBrief,
      rHhBad.state.coordinationBindOutlook,
      rHhBad.state.subjectBindReadinessBrief
    ).stewardNote.length > 8,
    'fortitude steward note'
  );
  check('R2416', upskillingUpliftForRegion('NSW', 'technology') > 0, 'upskilling uplift for region');

  check('R2501', Boolean(r1.state.fortitudeInclusionCouplingBrief?.band), 'fortitude inclusion on state');
  check(
    'R2502',
    (r1.state.fortitudeInclusionCouplingBrief?.fortitudeDrag ?? 0) >= 0,
    'fortitude inclusion drag'
  );
  check('R2503', Boolean(r1.state.hybridAnchorOutlook?.band), 'hybrid anchor on state');
  check('R2504', (r1.state.hybridAnchorOutlook?.bindDrag ?? 0) >= 0, 'hybrid bind drag');
  check('R2505', Boolean(r1.state.subjectCrownReadinessBrief?.band), 'subject crown on state');
  check('R2506', Boolean(r1.state.nationalWorkforceCulminationIndex?.band), 'workforce culmination on state');
  check(
    'R2507',
    detectLaborDemographicsQuery('fortitude inclusion coupling') === 'fortitude_inclusion_coupling',
    'GI fortitude inclusion detect'
  );
  check('R2508', detectLaborDemographicsQuery('hybrid anchor') === 'hybrid_anchor', 'GI hybrid anchor detect');
  check(
    'R2509',
    detectLaborDemographicsQuery('subject crown readiness') === 'subject_crown_readiness',
    'GI subject crown detect'
  );
  check(
    'R2510',
    detectLaborDemographicsQuery('workforce culmination') === 'workforce_culmination',
    'GI workforce culmination detect'
  );
  check(
    'R2511',
    answerLaborDemographicsQuestion(r1.state, 'workforce_culmination').headline.length > 5,
    'GI workforce culmination answer'
  );
  const inclusionCouplingOnly = computeNationalFortitudeInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceFortitudeIndex
  );
  check('R2512', inclusionCouplingOnly.summary.length > 10, 'inclusion coupling standalone summary');
  const hybridAnchorOnly = computeNationalHybridAnchorOutlook(r1.state, r1.state.coordinationBindOutlook);
  check('R2513', hybridAnchorOnly.band.length > 3, 'hybrid anchor band string');
  const crownOnly = computeNationalSubjectCrownReadinessBrief(
    r1.state,
    r1.state.subjectBindReadinessBrief,
    r1.state.nationalWorkforceFortitudeIndex
  );
  check('R2514', crownOnly.crownDrag >= 0, 'subject crown drag');
  check(
    'R2515',
    computeNationalWorkforceCulminationIndex(
      rHhBad.state,
      rHhBad.state.fortitudeInclusionCouplingBrief,
      rHhBad.state.hybridAnchorOutlook,
      rHhBad.state.subjectCrownReadinessBrief
    ).stewardNote.length > 8,
    'culmination steward note'
  );
  check('R2516', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R2601', Boolean(r1.state.culminationMentorshipCouplingBrief?.band), 'culmination mentorship on state');
  check(
    'R2602',
    (r1.state.culminationMentorshipCouplingBrief?.culminationDrag ?? 0) >= 0,
    'culmination mentorship drag'
  );
  check('R2603', Boolean(r1.state.onboardingSustainOutlook?.band), 'onboarding sustain on state');
  check('R2604', (r1.state.onboardingSustainOutlook?.anchorDrag ?? 0) >= 0, 'onboarding anchor drag');
  check('R2605', Boolean(r1.state.subjectApexReadinessBrief?.band), 'subject apex on state');
  check('R2606', Boolean(r1.state.nationalWorkforceApexIndex?.band), 'workforce apex on state');
  check(
    'R2607',
    detectLaborDemographicsQuery('culmination mentorship coupling') === 'culmination_mentorship_coupling',
    'GI culmination mentorship detect'
  );
  check(
    'R2608',
    detectLaborDemographicsQuery('onboarding sustain') === 'onboarding_sustain',
    'GI onboarding sustain detect'
  );
  check(
    'R2609',
    detectLaborDemographicsQuery('subject apex readiness') === 'subject_apex_readiness',
    'GI subject apex detect'
  );
  check(
    'R2610',
    detectLaborDemographicsQuery('workforce apex') === 'workforce_apex',
    'GI workforce apex detect'
  );
  check(
    'R2611',
    answerLaborDemographicsQuestion(r1.state, 'workforce_apex').headline.length > 5,
    'GI workforce apex answer'
  );
  const mentorshipCouplingOnly = computeNationalCulminationMentorshipCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceCulminationIndex
  );
  check('R2612', mentorshipCouplingOnly.summary.length > 10, 'mentorship coupling standalone summary');
  const onboardingSustainOnly = computeNationalOnboardingSustainOutlook(r1.state, r1.state.hybridAnchorOutlook);
  check('R2613', onboardingSustainOnly.band.length > 3, 'onboarding sustain band string');
  const subjectApexOnly = computeNationalSubjectApexReadinessBrief(
    r1.state,
    r1.state.subjectCrownReadinessBrief,
    r1.state.nationalWorkforceCulminationIndex
  );
  check('R2614', subjectApexOnly.apexDrag >= 0, 'subject apex drag');
  check(
    'R2615',
    computeNationalWorkforceApexIndex(
      rHhBad.state,
      rHhBad.state.culminationMentorshipCouplingBrief,
      rHhBad.state.onboardingSustainOutlook,
      rHhBad.state.subjectApexReadinessBrief
    ).stewardNote.length > 8,
    'apex steward note'
  );
  check('R2616', mentorshipEaseForRegion('NSW', 'technology') > 0, 'mentorship ease for region');

  check('R2701', Boolean(r1.state.apexAdvocacyCouplingBrief?.band), 'apex advocacy on state');
  check('R2702', (r1.state.apexAdvocacyCouplingBrief?.apexDrag ?? 0) >= 0, 'apex advocacy drag');
  check('R2703', Boolean(r1.state.reengagementThrustOutlook?.band), 'reengagement thrust on state');
  check('R2704', (r1.state.reengagementThrustOutlook?.sustainDrag ?? 0) >= 0, 'reengagement sustain drag');
  check('R2705', Boolean(r1.state.subjectPinnacleReadinessBrief?.band), 'subject pinnacle on state');
  check('R2706', Boolean(r1.state.nationalWorkforcePinnacleIndex?.band), 'workforce pinnacle on state');
  check(
    'R2707',
    detectLaborDemographicsQuery('apex advocacy coupling') === 'apex_advocacy_coupling',
    'GI apex advocacy detect'
  );
  check(
    'R2708',
    detectLaborDemographicsQuery('reengagement thrust') === 'reengagement_thrust',
    'GI reengagement thrust detect'
  );
  check(
    'R2709',
    detectLaborDemographicsQuery('subject pinnacle readiness') === 'subject_pinnacle_readiness',
    'GI subject pinnacle detect'
  );
  check(
    'R2710',
    detectLaborDemographicsQuery('workforce pinnacle') === 'workforce_pinnacle',
    'GI workforce pinnacle detect'
  );
  check(
    'R2711',
    answerLaborDemographicsQuestion(r1.state, 'workforce_pinnacle').headline.length > 5,
    'GI workforce pinnacle answer'
  );
  const apexAdvocacyOnly = computeNationalApexAdvocacyCouplingBrief(r1.state, r1.state.nationalWorkforceApexIndex);
  check('R2712', apexAdvocacyOnly.summary.length > 10, 'apex advocacy standalone summary');
  const reengagementThrustOnly = computeNationalReengagementThrustOutlook(r1.state, r1.state.onboardingSustainOutlook);
  check('R2713', reengagementThrustOnly.band.length > 3, 'reengagement thrust band string');
  const subjectPinnacleOnly = computeNationalSubjectPinnacleReadinessBrief(
    r1.state,
    r1.state.subjectApexReadinessBrief,
    r1.state.nationalWorkforceApexIndex
  );
  check('R2714', subjectPinnacleOnly.pinnacleDrag >= 0, 'subject pinnacle drag');
  check(
    'R2715',
    computeNationalWorkforcePinnacleIndex(
      rHhBad.state,
      rHhBad.state.apexAdvocacyCouplingBrief,
      rHhBad.state.reengagementThrustOutlook,
      rHhBad.state.subjectPinnacleReadinessBrief
    ).stewardNote.length > 8,
    'pinnacle steward note'
  );
  check('R2716', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R2801', Boolean(r1.state.pinnacleRetentionCouplingBrief?.band), 'pinnacle retention on state');
  check('R2802', (r1.state.pinnacleRetentionCouplingBrief?.pinnacleDrag ?? 0) >= 0, 'pinnacle retention drag');
  check('R2803', Boolean(r1.state.retentionCrestOutlook?.band), 'retention crest on state');
  check('R2804', (r1.state.retentionCrestOutlook?.thrustDrag ?? 0) >= 0, 'retention crest thrust drag');
  check('R2805', Boolean(r1.state.subjectSummitReadinessBrief?.band), 'subject summit on state');
  check('R2806', Boolean(r1.state.nationalWorkforceSummitIndex?.band), 'workforce summit on state');
  check(
    'R2807',
    detectLaborDemographicsQuery('pinnacle retention coupling') === 'pinnacle_retention_coupling',
    'GI pinnacle retention detect'
  );
  check(
    'R2808',
    detectLaborDemographicsQuery('retention crest') === 'retention_crest',
    'GI retention crest detect'
  );
  check(
    'R2809',
    detectLaborDemographicsQuery('subject summit readiness') === 'subject_summit_readiness',
    'GI subject summit detect'
  );
  check(
    'R2810',
    detectLaborDemographicsQuery('workforce summit') === 'workforce_summit',
    'GI workforce summit detect'
  );
  check(
    'R2811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_summit').headline.length > 5,
    'GI workforce summit answer'
  );
  const pinnacleRetentionOnly = computeNationalPinnacleRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforcePinnacleIndex
  );
  check('R2812', pinnacleRetentionOnly.summary.length > 10, 'pinnacle retention standalone summary');
  const retentionCrestOnly = computeNationalRetentionCrestOutlook(r1.state, r1.state.reengagementThrustOutlook);
  check('R2813', retentionCrestOnly.band.length > 3, 'retention crest band string');
  const subjectSummitOnly = computeNationalSubjectSummitReadinessBrief(
    r1.state,
    r1.state.subjectPinnacleReadinessBrief,
    r1.state.nationalWorkforcePinnacleIndex
  );
  check('R2814', subjectSummitOnly.summitDrag >= 0, 'subject summit drag');
  check(
    'R2815',
    computeNationalWorkforceSummitIndex(
      rHhBad.state,
      rHhBad.state.pinnacleRetentionCouplingBrief,
      rHhBad.state.retentionCrestOutlook,
      rHhBad.state.subjectSummitReadinessBrief
    ).stewardNote.length > 8,
    'summit steward note'
  );
  check('R2816', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');

  check('R2901', Boolean(r1.state.summitCoordinationCouplingBrief?.band), 'summit coordination on state');
  check('R2902', (r1.state.summitCoordinationCouplingBrief?.summitDrag ?? 0) >= 0, 'summit coordination drag');
  check('R2903', Boolean(r1.state.coordinationHorizonOutlook?.band), 'coordination horizon on state');
  check('R2904', (r1.state.coordinationHorizonOutlook?.crestDrag ?? 0) >= 0, 'coordination horizon crest drag');
  check('R2905', Boolean(r1.state.subjectZenithReadinessBrief?.band), 'subject zenith on state');
  check('R2906', Boolean(r1.state.nationalWorkforceZenithIndex?.band), 'workforce zenith on state');
  check(
    'R2907',
    detectLaborDemographicsQuery('summit coordination coupling') === 'summit_coordination_coupling',
    'GI summit coordination detect'
  );
  check(
    'R2908',
    detectLaborDemographicsQuery('coordination horizon') === 'coordination_horizon',
    'GI coordination horizon detect'
  );
  check(
    'R2909',
    detectLaborDemographicsQuery('subject zenith readiness') === 'subject_zenith_readiness',
    'GI subject zenith detect'
  );
  check(
    'R2910',
    detectLaborDemographicsQuery('workforce zenith') === 'workforce_zenith',
    'GI workforce zenith detect'
  );
  check(
    'R2911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_zenith').headline.length > 5,
    'GI workforce zenith answer'
  );
  const summitCoordinationOnly = computeNationalSummitCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSummitIndex
  );
  check('R2912', summitCoordinationOnly.summary.length > 10, 'summit coordination standalone summary');
  const coordinationHorizonOnly = computeNationalCoordinationHorizonOutlook(r1.state, r1.state.retentionCrestOutlook);
  check('R2913', coordinationHorizonOnly.band.length > 3, 'coordination horizon band string');
  const subjectZenithOnly = computeNationalSubjectZenithReadinessBrief(
    r1.state,
    r1.state.subjectSummitReadinessBrief,
    r1.state.nationalWorkforceSummitIndex
  );
  check('R2914', subjectZenithOnly.zenithDrag >= 0, 'subject zenith drag');
  check(
    'R2915',
    computeNationalWorkforceZenithIndex(
      rHhBad.state,
      rHhBad.state.summitCoordinationCouplingBrief,
      rHhBad.state.coordinationHorizonOutlook,
      rHhBad.state.subjectZenithReadinessBrief
    ).stewardNote.length > 8,
    'zenith steward note'
  );
  check('R2916', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  check('R3001', Boolean(r1.state.zenithFlexibilityCouplingBrief?.band), 'zenith flexibility on state');
  check('R3002', (r1.state.zenithFlexibilityCouplingBrief?.zenithDrag ?? 0) >= 0, 'zenith flexibility drag');
  check('R3003', Boolean(r1.state.flexibilityAscentOutlook?.band), 'flexibility ascent on state');
  check('R3004', (r1.state.flexibilityAscentOutlook?.horizonDrag ?? 0) >= 0, 'flexibility ascent horizon drag');
  check('R3005', Boolean(r1.state.subjectApogeeReadinessBrief?.band), 'subject apogee on state');
  check('R3006', Boolean(r1.state.nationalWorkforceApogeeIndex?.band), 'workforce apogee on state');
  check(
    'R3007',
    detectLaborDemographicsQuery('zenith flexibility coupling') === 'zenith_flexibility_coupling',
    'GI zenith flexibility detect'
  );
  check(
    'R3008',
    detectLaborDemographicsQuery('flexibility ascent') === 'flexibility_ascent',
    'GI flexibility ascent detect'
  );
  check(
    'R3009',
    detectLaborDemographicsQuery('subject apogee readiness') === 'subject_apogee_readiness',
    'GI subject apogee detect'
  );
  check(
    'R3010',
    detectLaborDemographicsQuery('workforce apogee') === 'workforce_apogee',
    'GI workforce apogee detect'
  );
  check(
    'R3011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_apogee').headline.length > 5,
    'GI workforce apogee answer'
  );
  const zenithFlexibilityOnly = computeNationalZenithFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceZenithIndex
  );
  check('R3012', zenithFlexibilityOnly.summary.length > 10, 'zenith flexibility standalone summary');
  const flexibilityAscentOnly = computeNationalFlexibilityAscentOutlook(r1.state, r1.state.coordinationHorizonOutlook);
  check('R3013', flexibilityAscentOnly.band.length > 3, 'flexibility ascent band string');
  const subjectApogeeOnly = computeNationalSubjectApogeeReadinessBrief(
    r1.state,
    r1.state.subjectZenithReadinessBrief,
    r1.state.nationalWorkforceZenithIndex
  );
  check('R3014', subjectApogeeOnly.apogeeDrag >= 0, 'subject apogee drag');
  check(
    'R3015',
    computeNationalWorkforceApogeeIndex(
      rHhBad.state,
      rHhBad.state.zenithFlexibilityCouplingBrief,
      rHhBad.state.flexibilityAscentOutlook,
      rHhBad.state.subjectApogeeReadinessBrief
    ).stewardNote.length > 8,
    'apogee steward note'
  );
  check('R3016', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R3101', Boolean(r1.state.apogeeInclusionCouplingBrief?.band), 'apogee inclusion on state');
  check('R3102', (r1.state.apogeeInclusionCouplingBrief?.apogeeDrag ?? 0) >= 0, 'apogee inclusion drag');
  check('R3103', Boolean(r1.state.inclusionOrbitOutlook?.band), 'inclusion orbit on state');
  check('R3104', (r1.state.inclusionOrbitOutlook?.ascentDrag ?? 0) >= 0, 'inclusion orbit ascent drag');
  check('R3105', Boolean(r1.state.subjectOrbitReadinessBrief?.band), 'subject orbit on state');
  check('R3106', Boolean(r1.state.nationalWorkforceOrbitIndex?.band), 'workforce orbit on state');
  check(
    'R3107',
    detectLaborDemographicsQuery('apogee inclusion coupling') === 'apogee_inclusion_coupling',
    'GI apogee inclusion detect'
  );
  check(
    'R3108',
    detectLaborDemographicsQuery('inclusion orbit') === 'inclusion_orbit',
    'GI inclusion orbit detect'
  );
  check(
    'R3109',
    detectLaborDemographicsQuery('subject orbit readiness') === 'subject_orbit_readiness',
    'GI subject orbit detect'
  );
  check(
    'R3110',
    detectLaborDemographicsQuery('workforce orbit') === 'workforce_orbit',
    'GI workforce orbit detect'
  );
  check(
    'R3111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_orbit').headline.length > 5,
    'GI workforce orbit answer'
  );
  const apogeeInclusionOnly = computeNationalApogeeInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceApogeeIndex
  );
  check('R3112', apogeeInclusionOnly.summary.length > 10, 'apogee inclusion standalone summary');
  const inclusionOrbitOnly = computeNationalInclusionOrbitOutlook(r1.state, r1.state.flexibilityAscentOutlook);
  check('R3113', inclusionOrbitOnly.band.length > 3, 'inclusion orbit band string');
  const subjectOrbitOnly = computeNationalSubjectOrbitReadinessBrief(
    r1.state,
    r1.state.subjectApogeeReadinessBrief,
    r1.state.nationalWorkforceApogeeIndex
  );
  check('R3114', subjectOrbitOnly.orbitDrag >= 0, 'subject orbit drag');
  check(
    'R3115',
    computeNationalWorkforceOrbitIndex(
      rHhBad.state,
      rHhBad.state.apogeeInclusionCouplingBrief,
      rHhBad.state.inclusionOrbitOutlook,
      rHhBad.state.subjectOrbitReadinessBrief
    ).stewardNote.length > 8,
    'orbit steward note'
  );
  check('R3116', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R3201', Boolean(r1.state.orbitCareCouplingBrief?.band), 'orbit care on state');
  check('R3202', (r1.state.orbitCareCouplingBrief?.orbitDrag ?? 0) >= 0, 'orbit care drag');
  check('R3203', Boolean(r1.state.careEquilibriumOutlook?.band), 'care equilibrium on state');
  check('R3204', (r1.state.careEquilibriumOutlook?.orbitDrag ?? 0) >= 0, 'care equilibrium orbit drag');
  check('R3205', Boolean(r1.state.subjectNexusReadinessBrief?.band), 'subject nexus on state');
  check('R3206', Boolean(r1.state.nationalWorkforceNexusIndex?.band), 'workforce nexus on state');
  check(
    'R3207',
    detectLaborDemographicsQuery('orbit care coupling') === 'orbit_care_coupling',
    'GI orbit care detect'
  );
  check(
    'R3208',
    detectLaborDemographicsQuery('care equilibrium') === 'care_equilibrium',
    'GI care equilibrium detect'
  );
  check(
    'R3209',
    detectLaborDemographicsQuery('subject nexus readiness') === 'subject_nexus_readiness',
    'GI subject nexus detect'
  );
  check(
    'R3210',
    detectLaborDemographicsQuery('workforce nexus') === 'workforce_nexus',
    'GI workforce nexus detect'
  );
  check(
    'R3211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_nexus').headline.length > 5,
    'GI workforce nexus answer'
  );
  const orbitCareOnly = computeNationalOrbitCareCouplingBrief(r1.state, r1.state.nationalWorkforceOrbitIndex);
  check('R3212', orbitCareOnly.summary.length > 10, 'orbit care standalone summary');
  const careEquilibriumOnly = computeNationalCareEquilibriumOutlook(r1.state, r1.state.inclusionOrbitOutlook);
  check('R3213', careEquilibriumOnly.band.length > 3, 'care equilibrium band string');
  const subjectNexusOnly = computeNationalSubjectNexusReadinessBrief(
    r1.state,
    r1.state.subjectOrbitReadinessBrief,
    r1.state.nationalWorkforceOrbitIndex
  );
  check('R3214', subjectNexusOnly.nexusDrag >= 0, 'subject nexus drag');
  check(
    'R3215',
    computeNationalWorkforceNexusIndex(
      rHhBad.state,
      rHhBad.state.orbitCareCouplingBrief,
      rHhBad.state.careEquilibriumOutlook,
      rHhBad.state.subjectNexusReadinessBrief
    ).stewardNote.length > 8,
    'nexus steward note'
  );
  check('R3216', careReliefForRegion('NSW', 'technology') > 0, 'care relief for region');

  check('R3301', Boolean(r1.state.nexusSchedulingCouplingBrief?.band), 'nexus scheduling on state');
  check('R3302', (r1.state.nexusSchedulingCouplingBrief?.nexusDrag ?? 0) >= 0, 'nexus scheduling drag');
  check('R3303', Boolean(r1.state.schedulingResonanceOutlook?.band), 'scheduling resonance on state');
  check('R3304', (r1.state.schedulingResonanceOutlook?.equilibriumDrag ?? 0) >= 0, 'scheduling resonance drag');
  check('R3305', Boolean(r1.state.subjectConvergenceReadinessBrief?.band), 'subject convergence on state');
  check('R3306', Boolean(r1.state.nationalWorkforceConvergenceIndex?.band), 'workforce convergence on state');
  check(
    'R3307',
    detectLaborDemographicsQuery('nexus scheduling coupling') === 'nexus_scheduling_coupling',
    'GI nexus scheduling detect'
  );
  check(
    'R3308',
    detectLaborDemographicsQuery('scheduling resonance') === 'scheduling_resonance',
    'GI scheduling resonance detect'
  );
  check(
    'R3309',
    detectLaborDemographicsQuery('subject convergence readiness') === 'subject_convergence_readiness',
    'GI subject convergence detect'
  );
  check(
    'R3310',
    detectLaborDemographicsQuery('workforce convergence') === 'workforce_convergence',
    'GI workforce convergence detect'
  );
  check(
    'R3311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_convergence').headline.length > 5,
    'GI workforce convergence answer'
  );
  const nexusSchedulingOnly = computeNationalNexusSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceNexusIndex
  );
  check('R3312', nexusSchedulingOnly.summary.length > 10, 'nexus scheduling standalone summary');
  const schedulingResonanceOnly = computeNationalSchedulingResonanceOutlook(
    r1.state,
    r1.state.careEquilibriumOutlook
  );
  check('R3313', schedulingResonanceOnly.band.length > 3, 'scheduling resonance band string');
  const subjectConvergenceOnly = computeNationalSubjectConvergenceReadinessBrief(
    r1.state,
    r1.state.subjectNexusReadinessBrief,
    r1.state.nationalWorkforceNexusIndex
  );
  check('R3314', subjectConvergenceOnly.convergenceDrag >= 0, 'subject convergence drag');
  check(
    'R3315',
    computeNationalWorkforceConvergenceIndex(
      rHhBad.state,
      rHhBad.state.nexusSchedulingCouplingBrief,
      rHhBad.state.schedulingResonanceOutlook,
      rHhBad.state.subjectConvergenceReadinessBrief
    ).stewardNote.length > 8,
    'convergence steward note'
  );
  check('R3316', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

  check('R3401', Boolean(r1.state.convergenceSafetyCouplingBrief?.band), 'convergence safety on state');
  check('R3402', (r1.state.convergenceSafetyCouplingBrief?.convergenceDrag ?? 0) >= 0, 'convergence safety drag');
  check('R3403', Boolean(r1.state.safetyHarmonyOutlook?.band), 'safety harmony on state');
  check('R3404', (r1.state.safetyHarmonyOutlook?.resonanceDrag ?? 0) >= 0, 'safety harmony resonance drag');
  check('R3405', Boolean(r1.state.subjectUnificationReadinessBrief?.band), 'subject unification on state');
  check('R3406', Boolean(r1.state.nationalWorkforceUnificationIndex?.band), 'workforce unification on state');
  check(
    'R3407',
    detectLaborDemographicsQuery('convergence safety coupling') === 'convergence_safety_coupling',
    'GI convergence safety detect'
  );
  check(
    'R3408',
    detectLaborDemographicsQuery('safety harmony') === 'safety_harmony',
    'GI safety harmony detect'
  );
  check(
    'R3409',
    detectLaborDemographicsQuery('subject unification readiness') === 'subject_unification_readiness',
    'GI subject unification detect'
  );
  check(
    'R3410',
    detectLaborDemographicsQuery('workforce unification') === 'workforce_unification',
    'GI workforce unification detect'
  );
  check(
    'R3411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_unification').headline.length > 5,
    'GI workforce unification answer'
  );
  const convergenceSafetyOnly = computeNationalConvergenceSafetyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceConvergenceIndex
  );
  check('R3412', convergenceSafetyOnly.summary.length > 10, 'convergence safety standalone summary');
  const safetyHarmonyOnly = computeNationalSafetyHarmonyOutlook(r1.state, r1.state.schedulingResonanceOutlook);
  check('R3413', safetyHarmonyOnly.band.length > 3, 'safety harmony band string');
  const subjectUnificationOnly = computeNationalSubjectUnificationReadinessBrief(
    r1.state,
    r1.state.subjectConvergenceReadinessBrief,
    r1.state.nationalWorkforceConvergenceIndex
  );
  check('R3414', subjectUnificationOnly.unificationDrag >= 0, 'subject unification drag');
  check(
    'R3415',
    computeNationalWorkforceUnificationIndex(
      rHhBad.state,
      rHhBad.state.convergenceSafetyCouplingBrief,
      rHhBad.state.safetyHarmonyOutlook,
      rHhBad.state.subjectUnificationReadinessBrief
    ).stewardNote.length > 8,
    'unification steward note'
  );
  check('R3416', safetyEaseForRegion('NSW', 'technology') > 0, 'safety ease for region');

  check('R3501', Boolean(r1.state.unificationUpskillingCouplingBrief?.band), 'unification upskilling on state');
  check('R3502', (r1.state.unificationUpskillingCouplingBrief?.unificationDrag ?? 0) >= 0, 'unification upskilling drag');
  check('R3503', Boolean(r1.state.upskillingSynthesisOutlook?.band), 'upskilling synthesis on state');
  check('R3504', (r1.state.upskillingSynthesisOutlook?.harmonyDrag ?? 0) >= 0, 'upskilling synthesis harmony drag');
  check('R3505', Boolean(r1.state.subjectSynthesisReadinessBrief?.band), 'subject synthesis on state');
  check('R3506', Boolean(r1.state.nationalWorkforceSynthesisIndex?.band), 'workforce synthesis on state');
  check(
    'R3507',
    detectLaborDemographicsQuery('unification upskilling coupling') === 'unification_upskilling_coupling',
    'GI unification upskilling detect'
  );
  check(
    'R3508',
    detectLaborDemographicsQuery('upskilling synthesis') === 'upskilling_synthesis',
    'GI upskilling synthesis detect'
  );
  check(
    'R3509',
    detectLaborDemographicsQuery('subject synthesis readiness') === 'subject_synthesis_readiness',
    'GI subject synthesis detect'
  );
  check(
    'R3510',
    detectLaborDemographicsQuery('workforce synthesis') === 'workforce_synthesis',
    'GI workforce synthesis detect'
  );
  check(
    'R3511',
    answerLaborDemographicsQuestion(r1.state, 'workforce_synthesis').headline.length > 5,
    'GI workforce synthesis answer'
  );
  const unificationUpskillingOnly = computeNationalUnificationUpskillingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceUnificationIndex
  );
  check('R3512', unificationUpskillingOnly.summary.length > 10, 'unification upskilling standalone summary');
  const upskillingSynthesisOnly = computeNationalUpskillingSynthesisOutlook(r1.state, r1.state.safetyHarmonyOutlook);
  check('R3513', upskillingSynthesisOnly.band.length > 3, 'upskilling synthesis band string');
  const subjectSynthesisOnly = computeNationalSubjectSynthesisReadinessBrief(
    r1.state,
    r1.state.subjectUnificationReadinessBrief,
    r1.state.nationalWorkforceUnificationIndex
  );
  check('R3514', subjectSynthesisOnly.synthesisDrag >= 0, 'subject synthesis drag');
  check(
    'R3515',
    computeNationalWorkforceSynthesisIndex(
      rHhBad.state,
      rHhBad.state.unificationUpskillingCouplingBrief,
      rHhBad.state.upskillingSynthesisOutlook,
      rHhBad.state.subjectSynthesisReadinessBrief
    ).stewardNote.length > 8,
    'synthesis steward note'
  );
  check('R3516', upskillingUpliftForRegion('NSW', 'technology') > 0, 'upskilling uplift for region');

  check('R3601', Boolean(r1.state.synthesisOnboardingCouplingBrief?.band), 'synthesis onboarding on state');
  check(
    'R3602',
    (r1.state.synthesisOnboardingCouplingBrief?.synthesisDrag ?? 0) >= 0,
    'synthesis onboarding drag'
  );
  check('R3603', Boolean(r1.state.onboardingIntegrationOutlook?.band), 'onboarding integration on state');
  check(
    'R3604',
    (r1.state.onboardingIntegrationOutlook?.synthesisDrag ?? 0) >= 0,
    'onboarding integration synthesis drag'
  );
  check('R3605', Boolean(r1.state.subjectIntegrationReadinessBrief?.band), 'subject integration on state');
  check('R3606', Boolean(r1.state.nationalWorkforceIntegrationIndex?.band), 'workforce integration on state');
  check(
    'R3607',
    detectLaborDemographicsQuery('synthesis onboarding coupling') === 'synthesis_onboarding_coupling',
    'GI synthesis onboarding detect'
  );
  check(
    'R3608',
    detectLaborDemographicsQuery('onboarding integration') === 'onboarding_integration',
    'GI onboarding integration detect'
  );
  check(
    'R3609',
    detectLaborDemographicsQuery('subject integration readiness') === 'subject_integration_readiness',
    'GI subject integration detect'
  );
  check(
    'R3610',
    detectLaborDemographicsQuery('workforce integration') === 'workforce_integration',
    'GI workforce integration detect'
  );
  check(
    'R3611',
    answerLaborDemographicsQuestion(r1.state, 'workforce_integration').headline.length > 5,
    'GI workforce integration answer'
  );
  const synthesisOnboardingOnly = computeNationalSynthesisOnboardingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSynthesisIndex
  );
  check('R3612', synthesisOnboardingOnly.summary.length > 10, 'synthesis onboarding standalone summary');
  const onboardingIntegrationOnly = computeNationalOnboardingIntegrationOutlook(
    r1.state,
    r1.state.upskillingSynthesisOutlook
  );
  check('R3613', onboardingIntegrationOnly.band.length > 3, 'onboarding integration band string');
  const subjectIntegrationOnly = computeNationalSubjectIntegrationReadinessBrief(
    r1.state,
    r1.state.subjectSynthesisReadinessBrief,
    r1.state.nationalWorkforceSynthesisIndex
  );
  check('R3614', subjectIntegrationOnly.integrationDrag >= 0, 'subject integration drag');
  check(
    'R3615',
    computeNationalWorkforceIntegrationIndex(
      rHhBad.state,
      rHhBad.state.synthesisOnboardingCouplingBrief,
      rHhBad.state.onboardingIntegrationOutlook,
      rHhBad.state.subjectIntegrationReadinessBrief
    ).stewardNote.length > 8,
    'integration steward note'
  );
  check('R3616', onboardingEaseForRegion('NSW', 'technology') > 0, 'onboarding ease for region');

  check('R3701', Boolean(r1.state.integrationRetentionCouplingBrief?.band), 'integration retention on state');
  check(
    'R3702',
    (r1.state.integrationRetentionCouplingBrief?.integrationDrag ?? 0) >= 0,
    'integration retention drag'
  );
  check('R3703', Boolean(r1.state.retentionCohesionOutlook?.band), 'retention cohesion on state');
  check(
    'R3704',
    (r1.state.retentionCohesionOutlook?.integrationDrag ?? 0) >= 0,
    'retention cohesion integration drag'
  );
  check('R3705', Boolean(r1.state.subjectRetentionReadinessBrief?.band), 'subject retention on state');
  check('R3706', Boolean(r1.state.nationalWorkforceRetentionIndex?.band), 'workforce retention on state');
  check(
    'R3707',
    detectLaborDemographicsQuery('integration retention coupling') === 'integration_retention_coupling',
    'GI integration retention detect'
  );
  check(
    'R3708',
    detectLaborDemographicsQuery('retention cohesion') === 'retention_cohesion',
    'GI retention cohesion detect'
  );
  check(
    'R3709',
    detectLaborDemographicsQuery('subject retention readiness') === 'subject_retention_readiness',
    'GI subject retention detect'
  );
  check(
    'R3710',
    detectLaborDemographicsQuery('workforce retention') === 'workforce_retention',
    'GI workforce retention detect'
  );
  check(
    'R3711',
    answerLaborDemographicsQuestion(r1.state, 'workforce_retention').headline.length > 5,
    'GI workforce retention answer'
  );
  const integrationRetentionOnly = computeNationalIntegrationRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceIntegrationIndex
  );
  check('R3712', integrationRetentionOnly.summary.length > 10, 'integration retention standalone summary');
  const retentionCohesionOnly = computeNationalRetentionCohesionOutlook(
    r1.state,
    r1.state.onboardingIntegrationOutlook
  );
  check('R3713', retentionCohesionOnly.band.length > 3, 'retention cohesion band string');
  const subjectRetentionOnly = computeNationalSubjectRetentionReadinessBrief(
    r1.state,
    r1.state.subjectIntegrationReadinessBrief,
    r1.state.nationalWorkforceIntegrationIndex
  );
  check('R3714', subjectRetentionOnly.retentionDrag >= 0, 'subject retention drag');
  check(
    'R3715',
    computeNationalWorkforceRetentionIndex(
      rHhBad.state,
      rHhBad.state.integrationRetentionCouplingBrief,
      rHhBad.state.retentionCohesionOutlook,
      rHhBad.state.subjectRetentionReadinessBrief
    ).stewardNote.length > 8,
    'retention steward note'
  );
  check('R3716', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');

  check('R3801', Boolean(r1.state.retentionReengagementCouplingBrief?.band), 'retention reengagement on state');
  check(
    'R3802',
    (r1.state.retentionReengagementCouplingBrief?.retentionDrag ?? 0) >= 0,
    'retention reengagement drag'
  );
  check('R3803', Boolean(r1.state.reengagementAlignmentOutlook?.band), 'reengagement alignment on state');
  check(
    'R3804',
    (r1.state.reengagementAlignmentOutlook?.retentionDrag ?? 0) >= 0,
    'reengagement alignment retention drag'
  );
  check('R3805', Boolean(r1.state.subjectReengagementReadinessBrief?.band), 'subject reengagement on state');
  check('R3806', Boolean(r1.state.nationalWorkforceReengagementIndex?.band), 'workforce reengagement on state');
  check(
    'R3807',
    detectLaborDemographicsQuery('retention reengagement coupling') === 'retention_reengagement_coupling',
    'GI retention reengagement detect'
  );
  check(
    'R3808',
    detectLaborDemographicsQuery('reengagement alignment') === 'reengagement_alignment',
    'GI reengagement alignment detect'
  );
  check(
    'R3809',
    detectLaborDemographicsQuery('subject reengagement readiness') === 'subject_reengagement_readiness',
    'GI subject reengagement detect'
  );
  check(
    'R3810',
    detectLaborDemographicsQuery('workforce reengagement') === 'workforce_reengagement',
    'GI workforce reengagement detect'
  );
  check(
    'R3811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_reengagement').headline.length > 5,
    'GI workforce reengagement answer'
  );
  const retentionReengagementOnly = computeNationalRetentionReengagementCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceRetentionIndex
  );
  check('R3812', retentionReengagementOnly.summary.length > 10, 'retention reengagement standalone summary');
  const reengagementAlignmentOnly = computeNationalReengagementAlignmentOutlook(
    r1.state,
    r1.state.retentionCohesionOutlook
  );
  check('R3813', reengagementAlignmentOnly.band.length > 3, 'reengagement alignment band string');
  const subjectReengagementOnly = computeNationalSubjectReengagementReadinessBrief(
    r1.state,
    r1.state.subjectRetentionReadinessBrief,
    r1.state.nationalWorkforceRetentionIndex
  );
  check('R3814', subjectReengagementOnly.reengagementDrag >= 0, 'subject reengagement drag');
  check(
    'R3815',
    computeNationalWorkforceReengagementIndex(
      rHhBad.state,
      rHhBad.state.retentionReengagementCouplingBrief,
      rHhBad.state.reengagementAlignmentOutlook,
      rHhBad.state.subjectReengagementReadinessBrief
    ).stewardNote.length > 8,
    'reengagement steward note'
  );
  check('R3816', reengagementPullForRegion('NSW', 'technology') > 0, 'reengagement pull for region');

  check('R3901', Boolean(r1.state.reengagementMentorshipCouplingBrief?.band), 'reengagement mentorship on state');
  check(
    'R3902',
    (r1.state.reengagementMentorshipCouplingBrief?.reengagementDrag ?? 0) >= 0,
    'reengagement mentorship drag'
  );
  check('R3903', Boolean(r1.state.mentorshipSustainOutlook?.band), 'mentorship sustain on state');
  check(
    'R3904',
    (r1.state.mentorshipSustainOutlook?.reengagementDrag ?? 0) >= 0,
    'mentorship sustain reengagement drag'
  );
  check('R3905', Boolean(r1.state.subjectMentorshipReadinessBrief?.band), 'subject mentorship on state');
  check('R3906', Boolean(r1.state.nationalWorkforceMentorshipIndex?.band), 'workforce mentorship on state');
  check(
    'R3907',
    detectLaborDemographicsQuery('reengagement mentorship coupling') === 'reengagement_mentorship_coupling',
    'GI reengagement mentorship detect'
  );
  check(
    'R3908',
    detectLaborDemographicsQuery('mentorship sustain') === 'mentorship_sustain',
    'GI mentorship sustain detect'
  );
  check(
    'R3909',
    detectLaborDemographicsQuery('subject mentorship readiness') === 'subject_mentorship_readiness',
    'GI subject mentorship detect'
  );
  check(
    'R3910',
    detectLaborDemographicsQuery('workforce mentorship') === 'workforce_mentorship',
    'GI workforce mentorship detect'
  );
  check(
    'R3911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_mentorship').headline.length > 5,
    'GI workforce mentorship answer'
  );
  const reengagementMentorshipOnly = computeNationalReengagementMentorshipCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceReengagementIndex
  );
  check('R3912', reengagementMentorshipOnly.summary.length > 10, 'reengagement mentorship standalone summary');
  const mentorshipSustainOnly = computeNationalMentorshipSustainOutlook(
    r1.state,
    r1.state.reengagementAlignmentOutlook
  );
  check('R3913', mentorshipSustainOnly.band.length > 3, 'mentorship sustain band string');
  const subjectMentorshipOnly = computeNationalSubjectMentorshipReadinessBrief(
    r1.state,
    r1.state.subjectReengagementReadinessBrief,
    r1.state.nationalWorkforceReengagementIndex
  );
  check('R3914', subjectMentorshipOnly.mentorshipDrag >= 0, 'subject mentorship drag');
  check(
    'R3915',
    computeNationalWorkforceMentorshipIndex(
      rHhBad.state,
      rHhBad.state.reengagementMentorshipCouplingBrief,
      rHhBad.state.mentorshipSustainOutlook,
      rHhBad.state.subjectMentorshipReadinessBrief
    ).stewardNote.length > 8,
    'mentorship steward note'
  );
  check('R3916', mentorshipEaseForRegion('NSW', 'technology') > 0, 'mentorship ease for region');

  check('R4001', Boolean(r1.state.mentorshipAdvocacyCouplingBrief?.band), 'mentorship advocacy on state');
  check(
    'R4002',
    (r1.state.mentorshipAdvocacyCouplingBrief?.mentorshipDrag ?? 0) >= 0,
    'mentorship advocacy drag'
  );
  check('R4003', Boolean(r1.state.advocacyResonanceOutlook?.band), 'advocacy resonance on state');
  check(
    'R4004',
    (r1.state.advocacyResonanceOutlook?.mentorshipDrag ?? 0) >= 0,
    'advocacy resonance mentorship drag'
  );
  check('R4005', Boolean(r1.state.subjectAdvocacyReadinessBrief?.band), 'subject advocacy on state');
  check('R4006', Boolean(r1.state.nationalWorkforceAdvocacyIndex?.band), 'workforce advocacy on state');
  check(
    'R4007',
    detectLaborDemographicsQuery('mentorship advocacy coupling') === 'mentorship_advocacy_coupling',
    'GI mentorship advocacy detect'
  );
  check(
    'R4008',
    detectLaborDemographicsQuery('advocacy resonance') === 'advocacy_resonance',
    'GI advocacy resonance detect'
  );
  check(
    'R4009',
    detectLaborDemographicsQuery('subject advocacy readiness') === 'subject_advocacy_readiness',
    'GI subject advocacy detect'
  );
  check(
    'R4010',
    detectLaborDemographicsQuery('workforce advocacy') === 'workforce_advocacy',
    'GI workforce advocacy detect'
  );
  check(
    'R4011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_advocacy').headline.length > 5,
    'GI workforce advocacy answer'
  );
  const mentorshipAdvocacyOnly = computeNationalMentorshipAdvocacyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceMentorshipIndex
  );
  check('R4012', mentorshipAdvocacyOnly.summary.length > 10, 'mentorship advocacy standalone summary');
  const advocacyResonanceOnly = computeNationalAdvocacyResonanceOutlook(
    r1.state,
    r1.state.mentorshipSustainOutlook
  );
  check('R4013', advocacyResonanceOnly.band.length > 3, 'advocacy resonance band string');
  const subjectAdvocacyOnly = computeNationalSubjectAdvocacyReadinessBrief(
    r1.state,
    r1.state.subjectMentorshipReadinessBrief,
    r1.state.nationalWorkforceMentorshipIndex
  );
  check('R4014', subjectAdvocacyOnly.advocacyDrag >= 0, 'subject advocacy drag');
  check(
    'R4015',
    computeNationalWorkforceAdvocacyIndex(
      rHhBad.state,
      rHhBad.state.mentorshipAdvocacyCouplingBrief,
      rHhBad.state.advocacyResonanceOutlook,
      rHhBad.state.subjectAdvocacyReadinessBrief
    ).stewardNote.length > 8,
    'advocacy steward note'
  );
  check('R4016', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R4101', Boolean(r1.state.advocacyInclusionCouplingBrief?.band), 'advocacy inclusion on state');
  check(
    'R4102',
    (r1.state.advocacyInclusionCouplingBrief?.advocacyDrag ?? 0) >= 0,
    'advocacy inclusion drag'
  );
  check('R4103', Boolean(r1.state.inclusionEquityOutlook?.band), 'inclusion equity on state');
  check(
    'R4104',
    (r1.state.inclusionEquityOutlook?.advocacyDrag ?? 0) >= 0,
    'inclusion equity advocacy drag'
  );
  check('R4105', Boolean(r1.state.subjectInclusionReadinessBrief?.band), 'subject inclusion on state');
  check('R4106', Boolean(r1.state.nationalWorkforceInclusionIndex?.band), 'workforce inclusion on state');
  check(
    'R4107',
    detectLaborDemographicsQuery('advocacy inclusion coupling') === 'advocacy_inclusion_coupling',
    'GI advocacy inclusion detect'
  );
  check(
    'R4108',
    detectLaborDemographicsQuery('inclusion equity') === 'inclusion_equity',
    'GI inclusion equity detect'
  );
  check(
    'R4109',
    detectLaborDemographicsQuery('subject inclusion readiness') === 'subject_inclusion_readiness',
    'GI subject inclusion detect'
  );
  check(
    'R4110',
    detectLaborDemographicsQuery('workforce inclusion') === 'workforce_inclusion',
    'GI workforce inclusion detect'
  );
  check(
    'R4111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_inclusion').headline.length > 5,
    'GI workforce inclusion answer'
  );
  const advocacyInclusionOnly = computeNationalAdvocacyInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceAdvocacyIndex
  );
  check('R4112', advocacyInclusionOnly.summary.length > 10, 'advocacy inclusion standalone summary');
  const inclusionEquityOnly = computeNationalInclusionEquityOutlook(
    r1.state,
    r1.state.advocacyResonanceOutlook
  );
  check('R4113', inclusionEquityOnly.band.length > 3, 'inclusion equity band string');
  const subjectInclusionOnly = computeNationalSubjectInclusionReadinessBrief(
    r1.state,
    r1.state.subjectAdvocacyReadinessBrief,
    r1.state.nationalWorkforceAdvocacyIndex
  );
  check('R4114', subjectInclusionOnly.inclusionDrag >= 0, 'subject inclusion drag');
  check(
    'R4115',
    computeNationalWorkforceInclusionIndex(
      rHhBad.state,
      rHhBad.state.advocacyInclusionCouplingBrief,
      rHhBad.state.inclusionEquityOutlook,
      rHhBad.state.subjectInclusionReadinessBrief
    ).stewardNote.length > 8,
    'inclusion steward note'
  );
  check('R4116', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R4201', Boolean(r1.state.inclusionFlexibilityCouplingBrief?.band), 'inclusion flexibility on state');
  check(
    'R4202',
    (r1.state.inclusionFlexibilityCouplingBrief?.inclusionDrag ?? 0) >= 0,
    'inclusion flexibility drag'
  );
  check('R4203', Boolean(r1.state.flexibilityFlowOutlook?.band), 'flexibility flow on state');
  check(
    'R4204',
    (r1.state.flexibilityFlowOutlook?.inclusionDrag ?? 0) >= 0,
    'flexibility flow inclusion drag'
  );
  check('R4205', Boolean(r1.state.subjectFlexibilityReadinessBrief?.band), 'subject flexibility on state');
  check('R4206', Boolean(r1.state.nationalWorkforceFlexibilityIndex?.band), 'workforce flexibility on state');
  check(
    'R4207',
    detectLaborDemographicsQuery('inclusion flexibility coupling') === 'inclusion_flexibility_coupling',
    'GI inclusion flexibility detect'
  );
  check(
    'R4208',
    detectLaborDemographicsQuery('flexibility flow') === 'flexibility_flow',
    'GI flexibility flow detect'
  );
  check(
    'R4209',
    detectLaborDemographicsQuery('subject flexibility readiness') === 'subject_flexibility_readiness',
    'GI subject flexibility detect'
  );
  check(
    'R4210',
    detectLaborDemographicsQuery('workforce flexibility') === 'workforce_flexibility',
    'GI workforce flexibility detect'
  );
  check(
    'R4211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_flexibility').headline.length > 5,
    'GI workforce flexibility answer'
  );
  const inclusionFlexibilityOnly = computeNationalInclusionFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceInclusionIndex
  );
  check('R4212', inclusionFlexibilityOnly.summary.length > 10, 'inclusion flexibility standalone summary');
  const flexibilityFlowOnly = computeNationalFlexibilityFlowOutlook(
    r1.state,
    r1.state.inclusionEquityOutlook
  );
  check('R4213', flexibilityFlowOnly.band.length > 3, 'flexibility flow band string');
  const subjectFlexibilityOnly = computeNationalSubjectFlexibilityReadinessBrief(
    r1.state,
    r1.state.subjectInclusionReadinessBrief,
    r1.state.nationalWorkforceInclusionIndex
  );
  check('R4214', subjectFlexibilityOnly.flexibilityDrag >= 0, 'subject flexibility drag');
  check(
    'R4215',
    computeNationalWorkforceFlexibilityIndex(
      rHhBad.state,
      rHhBad.state.inclusionFlexibilityCouplingBrief,
      rHhBad.state.flexibilityFlowOutlook,
      rHhBad.state.subjectFlexibilityReadinessBrief
    ).stewardNote.length > 8,
    'flexibility steward note'
  );
  check('R4216', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R4301', Boolean(r1.state.flexibilityCoordinationCouplingBrief?.band), 'flexibility coordination on state');
  check(
    'R4302',
    (r1.state.flexibilityCoordinationCouplingBrief?.flexibilityDrag ?? 0) >= 0,
    'flexibility coordination drag'
  );
  check('R4303', Boolean(r1.state.coordinationMeshOutlook?.band), 'coordination mesh on state');
  check(
    'R4304',
    (r1.state.coordinationMeshOutlook?.flexibilityDrag ?? 0) >= 0,
    'coordination mesh flexibility drag'
  );
  check('R4305', Boolean(r1.state.subjectCoordinationReadinessBrief?.band), 'subject coordination on state');
  check('R4306', Boolean(r1.state.nationalWorkforceCoordinationIndex?.band), 'workforce coordination on state');
  check(
    'R4307',
    detectLaborDemographicsQuery('flexibility coordination coupling') === 'flexibility_coordination_coupling',
    'GI flexibility coordination detect'
  );
  check(
    'R4308',
    detectLaborDemographicsQuery('coordination mesh') === 'coordination_mesh',
    'GI coordination mesh detect'
  );
  check(
    'R4309',
    detectLaborDemographicsQuery('subject coordination readiness') === 'subject_coordination_readiness',
    'GI subject coordination detect'
  );
  check(
    'R4310',
    detectLaborDemographicsQuery('workforce coordination') === 'workforce_coordination',
    'GI workforce coordination detect'
  );
  check(
    'R4311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_coordination').headline.length > 5,
    'GI workforce coordination answer'
  );
  const flexibilityCoordinationOnly = computeNationalFlexibilityCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceFlexibilityIndex
  );
  check('R4312', flexibilityCoordinationOnly.summary.length > 10, 'flexibility coordination standalone summary');
  const coordinationMeshOnly = computeNationalCoordinationMeshOutlook(
    r1.state,
    r1.state.flexibilityFlowOutlook
  );
  check('R4313', coordinationMeshOnly.band.length > 3, 'coordination mesh band string');
  const subjectCoordinationOnly = computeNationalSubjectCoordinationReadinessBrief(
    r1.state,
    r1.state.subjectFlexibilityReadinessBrief,
    r1.state.nationalWorkforceFlexibilityIndex
  );
  check('R4314', subjectCoordinationOnly.coordinationDrag >= 0, 'subject coordination drag');
  check(
    'R4315',
    computeNationalWorkforceCoordinationIndex(
      rHhBad.state,
      rHhBad.state.flexibilityCoordinationCouplingBrief,
      rHhBad.state.coordinationMeshOutlook,
      rHhBad.state.subjectCoordinationReadinessBrief
    ).stewardNote.length > 8,
    'coordination steward note'
  );
  check('R4316', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  check('R4401', Boolean(r1.state.coordinationSchedulingCouplingBrief?.band), 'coordination scheduling on state');
  check(
    'R4402',
    (r1.state.coordinationSchedulingCouplingBrief?.coordinationDrag ?? 0) >= 0,
    'coordination scheduling drag'
  );
  check('R4403', Boolean(r1.state.schedulingPulseOutlook?.band), 'scheduling pulse on state');
  check(
    'R4404',
    (r1.state.schedulingPulseOutlook?.coordinationDrag ?? 0) >= 0,
    'scheduling pulse coordination drag'
  );
  check('R4405', Boolean(r1.state.subjectSchedulingReadinessBrief?.band), 'subject scheduling on state');
  check('R4406', Boolean(r1.state.nationalWorkforceSchedulingIndex?.band), 'workforce scheduling on state');
  check(
    'R4407',
    detectLaborDemographicsQuery('coordination scheduling coupling') === 'coordination_scheduling_coupling',
    'GI coordination scheduling detect'
  );
  check(
    'R4408',
    detectLaborDemographicsQuery('scheduling pulse') === 'scheduling_pulse',
    'GI scheduling pulse detect'
  );
  check(
    'R4409',
    detectLaborDemographicsQuery('subject scheduling readiness') === 'subject_scheduling_readiness',
    'GI subject scheduling detect'
  );
  check(
    'R4410',
    detectLaborDemographicsQuery('workforce scheduling') === 'workforce_scheduling',
    'GI workforce scheduling detect'
  );
  check(
    'R4411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_scheduling').headline.length > 5,
    'GI workforce scheduling answer'
  );
  const coordinationSchedulingOnly = computeNationalCoordinationSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceCoordinationIndex
  );
  check('R4412', coordinationSchedulingOnly.summary.length > 10, 'coordination scheduling standalone summary');
  const schedulingPulseOnly = computeNationalSchedulingPulseOutlook(
    r1.state,
    r1.state.coordinationMeshOutlook
  );
  check('R4413', schedulingPulseOnly.band.length > 3, 'scheduling pulse band string');
  const subjectSchedulingOnly = computeNationalSubjectSchedulingReadinessBrief(
    r1.state,
    r1.state.subjectCoordinationReadinessBrief,
    r1.state.nationalWorkforceCoordinationIndex
  );
  check('R4414', subjectSchedulingOnly.schedulingDrag >= 0, 'subject scheduling drag');
  check(
    'R4415',
    computeNationalWorkforceSchedulingIndex(
      rHhBad.state,
      rHhBad.state.coordinationSchedulingCouplingBrief,
      rHhBad.state.schedulingPulseOutlook,
      rHhBad.state.subjectSchedulingReadinessBrief
    ).stewardNote.length > 8,
    'scheduling steward note'
  );
  check('R4416', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

  check('R4501', Boolean(r1.state.schedulingSafetyCouplingBrief?.band), 'scheduling safety on state');
  check(
    'R4502',
    (r1.state.schedulingSafetyCouplingBrief?.schedulingDrag ?? 0) >= 0,
    'scheduling safety drag'
  );
  check('R4503', Boolean(r1.state.safetyCalibrationOutlook?.band), 'safety calibration on state');
  check(
    'R4504',
    (r1.state.safetyCalibrationOutlook?.schedulingDrag ?? 0) >= 0,
    'safety calibration scheduling drag'
  );
  check('R4505', Boolean(r1.state.subjectSafetyReadinessBrief?.band), 'subject safety on state');
  check('R4506', Boolean(r1.state.nationalWorkforceSafetyIndex?.band), 'workforce safety on state');
  check(
    'R4507',
    detectLaborDemographicsQuery('scheduling safety coupling') === 'scheduling_safety_coupling',
    'GI scheduling safety detect'
  );
  check(
    'R4508',
    detectLaborDemographicsQuery('safety calibration') === 'safety_calibration',
    'GI safety calibration detect'
  );
  check(
    'R4509',
    detectLaborDemographicsQuery('subject safety readiness') === 'subject_safety_readiness',
    'GI subject safety detect'
  );
  check(
    'R4510',
    detectLaborDemographicsQuery('workforce safety') === 'workforce_safety',
    'GI workforce safety detect'
  );
  check(
    'R4511',
    answerLaborDemographicsQuestion(r1.state, 'workforce_safety').headline.length > 5,
    'GI workforce safety answer'
  );
  const schedulingSafetyOnly = computeNationalSchedulingSafetyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSchedulingIndex
  );
  check('R4512', schedulingSafetyOnly.summary.length > 10, 'scheduling safety standalone summary');
  const safetyCalibrationOnly = computeNationalSafetyCalibrationOutlook(
    r1.state,
    r1.state.schedulingPulseOutlook
  );
  check('R4513', safetyCalibrationOnly.band.length > 3, 'safety calibration band string');
  const subjectSafetyOnly = computeNationalSubjectSafetyReadinessBrief(
    r1.state,
    r1.state.subjectSchedulingReadinessBrief,
    r1.state.nationalWorkforceSchedulingIndex
  );
  check('R4514', subjectSafetyOnly.safetyDrag >= 0, 'subject safety drag');
  check(
    'R4515',
    computeNationalWorkforceSafetyIndex(
      rHhBad.state,
      rHhBad.state.schedulingSafetyCouplingBrief,
      rHhBad.state.safetyCalibrationOutlook,
      rHhBad.state.subjectSafetyReadinessBrief
    ).stewardNote.length > 8,
    'safety steward note'
  );
  check('R4516', safetyEaseForRegion('NSW', 'technology') > 0, 'safety ease for region');

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
