import {
  computeNationalHouseholdBudgetDetail,
  householdBudgetLaborAdjustments
} from './household-budget-detail';
import { computeLaborAutomationFeedback, mergeAutomationFeedbackIntoRegionalScores } from './automation-feedback';
import {
  applyMigrationShocksToRegions,
  detectMigrationShocks,
  mergeMigrationShocks,
  toMigrationShockViews
} from './migration-shocks';
import {
  v1014laborApplyHysteresis,
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
import { computeRegionalDemographicRaw, livingRegionsMomentumBoost } from './demographics';
import {
  buildIndustryLinks,
  computeRegionalEmploymentLinkageRaw,
  formatIndustryEvidence,
  householdEmploymentFit,
  v1014laborRegionIndustryOutputIndex
} from './employment-linkage';
import {
  applyMigrationScoresToRegions,
  computeRegionalAttractiveness,
  nationalMigrationAverage
} from './migration';
import { applyRegionalMigrationSpillovers } from './regional-migration-spillovers';
import { applyCorridorPullToRegions } from './catalog/regional-migration-corridors';
import { computeIntegratedLaborMarketBrief } from './integrated-labor-synthesis';
import { buildLaborTurnAuditEntry } from './labor-turn-audit';
import { buildStewardLaborBrief } from './steward-labor-brief';
import { computeNationalWorkforceCapacityBridge } from './workforce-capacity-bridge';
import { computeLaborResilienceScorecard } from './labor-resilience-scorecard';
import { computeInterregionalLaborRebalancingPlan } from './interregional-labor-rebalancing';
import { computeNationalDependencyRatioSnapshot } from './dependency-ratio-snapshot';
import { computeNationalParticipationPressureBrief } from './participation-pressure-brief';
import { computeNationalLaborMarketVelocityIndex } from './labor-market-velocity-index';
import { computeNationalSkillMismatchIndex } from './skill-mismatch-index';
import { computeNationalLaborSupplyElasticityBrief } from './labor-supply-elasticity-brief';
import { computeNationalTalentMobilityOutlook } from './talent-mobility-outlook';
import { computeNationalUnderemploymentPressureBrief } from './underemployment-pressure-brief';
import { computeNationalWageCompetitivenessIndex } from './wage-competitiveness-index';
import { computeNationalWorkforceTransitionFrictionOutlook } from './workforce-transition-friction-outlook';
import { computeNationalYouthEntryPipelineOutlook } from './youth-entry-pipeline-outlook';
import { computeNationalLaborMarketTightnessBrief } from './labor-market-tightness-brief';
import { computeNationalHybridParticipationFrictionOutlook } from './hybrid-participation-friction-outlook';
import { computeNationalSeniorWorkforceRetentionOutlook } from './senior-workforce-retention-outlook';
import { computeNationalRegionalLaborAbsorptionBrief } from './regional-labor-absorption-brief';
import { computeNationalParticipationEquityGapBrief } from './participation-equity-gap-brief';
import { computeNationalCredentialMobilityOutlook } from './credential-mobility-outlook';
import { computeNationalHouseholdParticipationCouplingBrief } from './household-participation-coupling-brief';
import { computeNationalLaborRebalancingStressBrief } from './labor-rebalancing-stress-brief';
import { computeNationalAutomationParticipationResilienceOutlook } from './automation-participation-resilience-outlook';
import { computeNationalWageParticipationSpilloverBrief } from './wage-participation-spillover-brief';
import { computeNationalMigrationShockParticipationBufferOutlook } from './migration-shock-participation-buffer-outlook';
import { computeNationalLaborMarketStabilityOutlook } from './labor-market-stability-outlook';
import { computeNationalIntergenerationalWorkforceBalanceOutlook } from './intergenerational-workforce-balance-outlook';
import { computeNationalCapacityParticipationAlignmentBrief } from './capacity-participation-alignment-brief';
import { computeNationalParticipationVelocityCouplingBrief } from './participation-velocity-coupling-brief';
import { computeNationalSkillsTightnessCoherenceOutlook } from './skills-tightness-coherence-outlook';
import { computeNationalIntegratedLaborReadinessOutlook } from './integrated-labor-readiness-outlook';
import { computeNationalHybridRemoteParticipationOutlook } from './hybrid-remote-participation-outlook';
import { computeNationalCorridorCapacityStressBrief } from './corridor-capacity-stress-brief';
import { computeNationalStewardInterventionPriorityBrief } from './steward-intervention-priority-brief';
import { computeNationalEssentialWorkerParticipationOutlook } from './essential-worker-participation-outlook';
import { computeNationalWageAutomationCouplingBrief } from './wage-automation-coupling-brief';
import { computeNationalLaborCohesionIndex } from './national-labor-cohesion-index';
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
import { computeNationalSafetyCareCouplingBrief } from './safety-care-coupling-brief';
import { computeNationalCareBalanceOutlook } from './care-balance-outlook';
import { computeNationalSubjectCareReadinessBrief } from './subject-care-readiness-brief';
import { computeNationalWorkforceCareIndex } from './national-workforce-care-index';
import { computeNationalCareTenacityCouplingBrief } from './care-tenacity-coupling-brief';
import { computeNationalTenacityResilienceOutlook } from './tenacity-resilience-outlook';
import { computeNationalSubjectTenacityReadinessBrief } from './subject-tenacity-readiness-brief';
import { computeNationalWorkforceTenacityDepthIndex } from './national-workforce-tenacity-depth-index';
import { computeNationalTenacityPerseveranceCouplingBrief } from './tenacity-perseverance-coupling-brief';
import { computeNationalPerseveranceResilienceOutlook } from './perseverance-resilience-outlook';
import { computeNationalSubjectPerseveranceReadinessBrief } from './subject-perseverance-readiness-brief';
import { computeNationalWorkforcePerseveranceDepthIndex } from './national-workforce-perseverance-depth-index';
import { computeNationalPerseveranceGritCouplingBrief } from './perseverance-grit-coupling-brief';
import { computeNationalGritResilienceOutlook } from './grit-resilience-outlook';
import { computeNationalSubjectGritReadinessBrief } from './subject-grit-readiness-brief';
import { computeNationalWorkforceGritDepthIndex } from './national-workforce-grit-depth-index';
import { computeNationalGritResolveCouplingBrief } from './grit-resolve-coupling-brief';
import { computeNationalResolveResilienceOutlook } from './resolve-resilience-outlook';
import { computeNationalSubjectResolveReadinessBrief } from './subject-resolve-readiness-brief';
import { computeNationalWorkforceResolveDepthIndex } from './national-workforce-resolve-depth-index';
import { computeNationalResolveSteadfastCouplingBrief } from './resolve-steadfast-coupling-brief';
import { computeNationalSteadfastResilienceOutlook } from './steadfast-resilience-outlook';
import { computeNationalSubjectSteadfastReadinessBrief } from './subject-steadfast-readiness-brief';
import { computeNationalWorkforceSteadfastDepthIndex } from './national-workforce-steadfast-depth-index';
import { computeNationalSteadfastAdvocacyCouplingBrief } from './steadfast-advocacy-coupling-brief';
import { computeNationalAdvocacyResilienceOutlook } from './advocacy-resilience-outlook';
import { computeNationalSubjectAdvocacySteadfastReadinessBrief } from './subject-advocacy-steadfast-readiness-brief';
import { computeNationalWorkforceAdvocacyDepthIndex } from './national-workforce-advocacy-depth-index';
import { applyWageMigrationCouplingToRegions } from './wage-migration-coupling';
import { laborDemographicsInputHash, sanitizeLaborDemographicsPersisted } from './persistence';
import { lookupRegionalLaborBaseline } from './catalog/regional-labor-baselines';
import { computeRegionalWagePressureRaw, workforceStrainForRegion } from './wages';
import {
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  WAGE_PRESSURE_LABEL,
  type DemographicStructureBand,
  type EmploymentLinkageBand,
  type LaborDemographicsRegionSnapshot,
  type LaborDemographicsTransition,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted,
  type MigrationFlowBand,
  type NationalLaborDemographicsState,
  type WagePressureBand
} from './types';

export function computeNationalLaborDemographics(
  inputs: LaborDemographicsInputs,
  rawPersisted?: LaborDemographicsPersisted | null,
  prevState?: NationalLaborDemographicsState | null
): { state: NationalLaborDemographicsState; persisted: LaborDemographicsPersisted; events: string[] } {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const persisted = sanitizeLaborDemographicsPersisted(rawPersisted, turn);
  const hash = laborDemographicsInputHash(inputs);
  const events: string[] = [];
  if (!inputs.enabled) {
    const off: NationalLaborDemographicsState = {
      schemaVersion: V1014_LABOR_SCHEMA_VERSION,
      turn,
      revision: persisted.revision,
      inputHash: hash,
      enabled: false,
      nationalDemographicStructure: 'stable',
      nationalEmploymentLinkage: 'balanced',
      nationalWagePressure: 'stable',
      nationalMigrationFlow: 'balanced',
      demographicScore: 50,
      employmentLinkageScore: 50,
      wagePressureScore: 50,
      migrationFlowScore: 50,
      regions: {},
      industryLinks: [],
      summary: 'Labor demographics layer disabled.',
      outlook: 'Enable National Systems, Industries, and Labor Demographics to compute industry-linked structure.',
      transitions: [],
      evidence: []
    };
    return { state: off, persisted, events };
  }
  if (persisted.lastInputHash === hash && prevState && prevState.inputHash === hash) {
    return { state: prevState, persisted, events };
  }

  const nh = persisted.nationalHysteresis;
  const householdBudget = computeNationalHouseholdBudgetDetail(inputs.households);
  const regions: Record<string, LaborDemographicsRegionSnapshot> = {};
  const attractiveness: Record<string, number> = {};

  const wfStrainSamples: number[] = [];
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    wfStrainSamples.push(workforceStrainForRegion(regionId, inputs.workforce));
  });
  const wfStrainNational =
    wfStrainSamples.reduce((a, b) => a + b, 0) / Math.max(1, wfStrainSamples.length);

  const automationFeedback = computeLaborAutomationFeedback({
    workforce: inputs.workforce,
    capabilities: inputs.capabilities,
    wfStrainNational
  });

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const { index: outputIndex, dominant } = v1014laborRegionIndustryOutputIndex(regionId, inputs.industries);
    const wfStrain = workforceStrainForRegion(regionId, inputs.workforce);
    const hhFit = householdEmploymentFit(regionId, inputs.households);
    const momentumBoost = livingRegionsMomentumBoost(inputs.livingRegions, regionId);

    const hhDetail = householdBudget.regions[regionId];
    const budgetAdj = householdBudgetLaborAdjustments(hhDetail);

    let empLinkageRaw = computeRegionalEmploymentLinkageRaw({ outputIndex, hhFit, wfStrain });
    empLinkageRaw = v1014laborClamp(empLinkageRaw + budgetAdj.employmentFitDelta);
    let wageRaw = computeRegionalWagePressureRaw({ wfStrain, outputIndex, momentumBoost });
    wageRaw = v1014laborClamp(wageRaw + budgetAdj.wagePressureDelta);
    let demoRaw = computeRegionalDemographicRaw({ momentumBoost, dominant });
    const baseline = lookupRegionalLaborBaseline(regionId);
    if (baseline) {
      demoRaw = v1014laborClamp(
        demoRaw * (1 - baseline.demographicInertia / 400) + 50 * (baseline.demographicInertia / 400)
      );
      empLinkageRaw = v1014laborClamp(empLinkageRaw * (0.92 + baseline.laborMobilityIndex / 1200));
    }
    ({ empLinkageRaw, wageRaw, demoRaw } = mergeAutomationFeedbackIntoRegionalScores(
      { empLinkageRaw, wageRaw, demoRaw },
      automationFeedback
    ));

    attractiveness[regionId] = computeRegionalAttractiveness({ empLinkageRaw, wfStrain, hhFit }) + budgetAdj.attractivenessDelta;

    regions[regionId] = {
      regionId,
      demographicStructure: v1014laborBandDemographic(demoRaw),
      demographicScore: demoRaw,
      employmentLinkage: v1014laborBandEmployment(empLinkageRaw),
      employmentLinkageScore: empLinkageRaw,
      wagePressure: v1014laborBandWage(wageRaw),
      wagePressureScore: wageRaw,
      migrationFlow: 'balanced',
      migrationFlowScore: 50,
      dominantIndustry: dominant,
      industryOutputIndex: outputIndex,
      workforceStrainIndex: wfStrain,
      householdEmploymentFit: hhFit,
      automationPressureIndex: automationFeedback.nationalAutomationIndex,
      householdBudgetPressureScore: hhDetail.budgetPressureScore,
      householdEssentialsGapScore: hhDetail.essentialsGapScore
    };
    persisted.regionalHysteresis[regionId] = {
      demographicStructure: regions[regionId].demographicStructure,
      employmentLinkage: regions[regionId].employmentLinkage,
      wagePressure: regions[regionId].wagePressure,
      migrationFlow: regions[regionId].migrationFlow
    };
  });

  applyMigrationScoresToRegions(regions, applyRegionalMigrationSpillovers(attractiveness));

  const tickedShocks = (persisted.activeMigrationShocks || [])
    .map(s => ({
      ...s,
      turnsRemaining:
        turn > s.startedTurn ? Math.max(0, s.turnsRemaining - 1) : s.turnsRemaining
    }))
    .filter(s => s.turnsRemaining > 0);

  const detectedShocks = detectMigrationShocks({ turn, inputs, householdBudget });
  const activeShocks = mergeMigrationShocks(
    tickedShocks,
    detectedShocks,
    inputs.migrationShockOverrides,
    turn
  );
  const shockApply = applyMigrationShocksToRegions(regions, activeShocks);
  if (shockApply.regionsTouched.length) {
    events.push(
      `Migration shocks active in ${shockApply.regionsTouched.join(', ')} (${activeShocks.length} shock(s)).`
    );
  }

  const coupling = applyWageMigrationCouplingToRegions(regions);
  if (coupling.explanations.length) {
    events.push(`Wage–migration coupling adjusted ${coupling.explanations.length} region(s).`);
  }

  const corridorNotes = applyCorridorPullToRegions(regions);
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    regions[regionId].migrationFlow = v1014laborBandMigration(regions[regionId].migrationFlowScore);
  });

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    persisted.regionalHysteresis[regionId].migrationFlow = regions[regionId].migrationFlow;
  });

  const nationalEmp = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].employmentLinkageScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalWage = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].wagePressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalDemo = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].demographicScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalMig = nationalMigrationAverage(regions);

  const empNat = v1014laborApplyHysteresis(
    nh.employmentLinkage,
    nationalEmp,
    nh.employmentLinkageScore,
    v1014laborBandEmployment
  );
  const wageNat = v1014laborApplyHysteresis(nh.wagePressure, nationalWage, nh.wagePressureScore, v1014laborBandWage);
  const demoNat = v1014laborApplyHysteresis(
    nh.demographicStructure,
    nationalDemo,
    nh.demographicScore,
    v1014laborBandDemographic
  );
  const migNat = v1014laborApplyHysteresis(
    nh.migrationFlow,
    nationalMig,
    nh.migrationFlowScore,
    v1014laborBandMigration
  );

  const industryLinks = buildIndustryLinks(inputs.industries);

  const transitions: LaborDemographicsTransition[] = [...persisted.transitions];
  const pushTransition = (
    scope: 'national' | 'regional',
    field: string,
    from: string,
    to: string,
    reason: string,
    regionId?: string
  ) => {
    if (from === to) return;
    transitions.push({
      id: `ld14_${turn}_${field}_${regionId || 'nat'}_${transitions.length}`,
      turn,
      scope,
      regionId,
      field,
      from,
      to,
      reason
    });
  };
  pushTransition(
    'national',
    'employmentLinkage',
    nh.employmentLinkage,
    empNat.band,
    'Industry output and workforce strain shifted national employment linkage.'
  );
  pushTransition(
    'national',
    'wagePressure',
    nh.wagePressure,
    wageNat.band,
    'Output momentum and workforce pressure adjusted wage bands.'
  );
  pushTransition(
    'national',
    'migrationFlow',
    nh.migrationFlow,
    migNat.band,
    'Regional employment attractiveness diverged.'
  );

  const nextPersisted: LaborDemographicsPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? turn,
    lastUpdatedTurn: turn,
    lastInputHash: hash,
    nationalHysteresis: {
      demographicStructure: demoNat.band as DemographicStructureBand,
      employmentLinkage: empNat.band as EmploymentLinkageBand,
      wagePressure: wageNat.band as WagePressureBand,
      migrationFlow: migNat.band as MigrationFlowBand,
      demographicScore: demoNat.score,
      employmentLinkageScore: empNat.score,
      wagePressureScore: wageNat.score,
      migrationFlowScore: migNat.score
    },
    regionalHysteresis: persisted.regionalHysteresis,
    transitions: transitions.slice(-V1014_LABOR_LIMITS.maxTransitions),
    history: [
      ...persisted.history,
      { turn, hash, summary: `emp=${empNat.band}, wage=${wageNat.band}, mig=${migNat.band}` }
    ].slice(-V1014_LABOR_LIMITS.maxHistory),
    activeMigrationShocks: activeShocks
  };

  const dominantLink = industryLinks[0];
  const summary = dominantLink
    ? `National employment linkage tracks ${INDUSTRY_LABEL[dominantLink.industry].toLowerCase()} output (${Math.round(dominantLink.nationalOutputShare * 100)}% share) with ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()}.`
    : `National employment linkage is ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()} with stable industry mix.`;
  const outlook = `Wage pressure ${WAGE_PRESSURE_LABEL[wageNat.band as WagePressureBand].toLowerCase()}; migration ${MIGRATION_FLOW_LABEL[migNat.band as MigrationFlowBand].toLowerCase()} toward high-output regions.`;

  const state: NationalLaborDemographicsState = {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    turn,
    revision: nextPersisted.revision,
    inputHash: hash,
    enabled: true,
    nationalDemographicStructure: demoNat.band as DemographicStructureBand,
    nationalEmploymentLinkage: empNat.band as EmploymentLinkageBand,
    nationalWagePressure: wageNat.band as WagePressureBand,
    nationalMigrationFlow: migNat.band as MigrationFlowBand,
    demographicScore: demoNat.score,
    employmentLinkageScore: empNat.score,
    wagePressureScore: wageNat.score,
    migrationFlowScore: migNat.score,
    regions,
    industryLinks,
    summary,
    outlook,
    transitions: nextPersisted.transitions,
    evidence: [
      ...formatIndustryEvidence(industryLinks),
      ...(householdBudget.nationalBudgetPressureScore >= 60
        ? [`Household budget pressure elevated (${Math.round(householdBudget.nationalBudgetPressureScore)})`]
        : []),
      ...coupling.explanations.slice(0, 2)
    ],
    automationFeedbackSummary: automationFeedback.playerFacingSummary,
    householdBudgetSummary: householdBudget.summary,
    activeMigrationShocks: toMigrationShockViews(activeShocks)
  };

  const integratedBrief = computeIntegratedLaborMarketBrief(state, householdBudget);
  state.integratedLaborBrief = integratedBrief;
  state.laborAuditTip = buildLaborTurnAuditEntry(state, integratedBrief);

  const capacityBridge = computeNationalWorkforceCapacityBridge(turn, regions, industryLinks);
  state.workforceCapacityBridge = capacityBridge;
  state.laborResilienceScorecard = computeLaborResilienceScorecard(
    state,
    integratedBrief,
    householdBudget,
    capacityBridge
  );
  state.interregionalRebalancingPlan = computeInterregionalLaborRebalancingPlan(
    state,
    integratedBrief,
    capacityBridge
  );
  const dependencySnapshot = computeNationalDependencyRatioSnapshot(turn, regions);
  state.dependencyRatioSnapshot = dependencySnapshot;
  state.participationPressureBrief = computeNationalParticipationPressureBrief(
    state,
    integratedBrief,
    dependencySnapshot
  );
  state.laborMarketVelocityIndex = computeNationalLaborMarketVelocityIndex(turn, regions);
  state.skillMismatchIndex = computeNationalSkillMismatchIndex(turn, capacityBridge);
  state.laborSupplyElasticityBrief = computeNationalLaborSupplyElasticityBrief(
    state,
    integratedBrief,
    state.participationPressureBrief
  );
  state.talentMobilityOutlook = computeNationalTalentMobilityOutlook(
    state,
    state.laborMarketVelocityIndex,
    capacityBridge
  );
  state.underemploymentPressureBrief = computeNationalUnderemploymentPressureBrief(
    state,
    integratedBrief,
    state.participationPressureBrief
  );
  state.wageCompetitivenessIndex = computeNationalWageCompetitivenessIndex(
    state,
    integratedBrief,
    state.skillMismatchIndex
  );
  state.workforceTransitionFrictionOutlook = computeNationalWorkforceTransitionFrictionOutlook(
    state,
    state.laborMarketVelocityIndex,
    state.laborSupplyElasticityBrief
  );
  state.youthEntryPipelineOutlook = computeNationalYouthEntryPipelineOutlook(
    state,
    dependencySnapshot,
    state.participationPressureBrief
  );
  state.laborMarketTightnessBrief = computeNationalLaborMarketTightnessBrief(
    state,
    integratedBrief,
    capacityBridge,
    state.underemploymentPressureBrief
  );
  state.hybridParticipationFrictionOutlook = computeNationalHybridParticipationFrictionOutlook(
    state,
    state.workforceTransitionFrictionOutlook,
    state.talentMobilityOutlook
  );
  state.seniorWorkforceRetentionOutlook = computeNationalSeniorWorkforceRetentionOutlook(
    state,
    state.dependencyRatioSnapshot,
    state.participationPressureBrief
  );
  state.regionalLaborAbsorptionBrief = computeNationalRegionalLaborAbsorptionBrief(
    state,
    capacityBridge,
    state.laborMarketTightnessBrief
  );
  state.participationEquityGapBrief = computeNationalParticipationEquityGapBrief(
    state,
    state.underemploymentPressureBrief
  );
  state.credentialMobilityOutlook = computeNationalCredentialMobilityOutlook(
    state,
    state.skillMismatchIndex,
    state.talentMobilityOutlook
  );
  state.householdParticipationCouplingBrief = computeNationalHouseholdParticipationCouplingBrief(
    state,
    state.participationPressureBrief,
    state.participationEquityGapBrief
  );
  state.laborRebalancingStressBrief = computeNationalLaborRebalancingStressBrief(
    state,
    state.interregionalRebalancingPlan,
    state.regionalLaborAbsorptionBrief,
    state.laborMarketTightnessBrief
  );
  state.automationParticipationResilienceOutlook = computeNationalAutomationParticipationResilienceOutlook(
    state,
    state.participationPressureBrief,
    state.workforceTransitionFrictionOutlook
  );
  state.wageParticipationSpilloverBrief = computeNationalWageParticipationSpilloverBrief(
    state,
    state.wageCompetitivenessIndex,
    state.householdParticipationCouplingBrief
  );
  state.migrationShockParticipationBufferOutlook = computeNationalMigrationShockParticipationBufferOutlook(
    state,
    state.participationPressureBrief,
    state.regionalLaborAbsorptionBrief
  );
  state.laborMarketStabilityOutlook = computeNationalLaborMarketStabilityOutlook(
    state,
    integratedBrief,
    state.laborRebalancingStressBrief,
    state.automationParticipationResilienceOutlook
  );
  state.intergenerationalWorkforceBalanceOutlook = computeNationalIntergenerationalWorkforceBalanceOutlook(
    state,
    state.youthEntryPipelineOutlook,
    state.seniorWorkforceRetentionOutlook
  );
  state.capacityParticipationAlignmentBrief = computeNationalCapacityParticipationAlignmentBrief(
    state,
    capacityBridge,
    state.participationEquityGapBrief,
    state.regionalLaborAbsorptionBrief
  );
  state.participationVelocityCouplingBrief = computeNationalParticipationVelocityCouplingBrief(
    state,
    state.participationPressureBrief,
    state.laborMarketVelocityIndex
  );
  state.skillsTightnessCoherenceOutlook = computeNationalSkillsTightnessCoherenceOutlook(
    state,
    state.skillMismatchIndex,
    state.laborMarketTightnessBrief,
    state.credentialMobilityOutlook
  );
  state.integratedLaborReadinessOutlook = computeNationalIntegratedLaborReadinessOutlook(
    state,
    state.laborMarketStabilityOutlook,
    state.capacityParticipationAlignmentBrief,
    state.migrationShockParticipationBufferOutlook,
    state.laborResilienceScorecard
  );
  state.hybridRemoteParticipationOutlook = computeNationalHybridRemoteParticipationOutlook(
    state,
    state.hybridParticipationFrictionOutlook
  );
  state.corridorCapacityStressBrief = computeNationalCorridorCapacityStressBrief(
    state,
    state.interregionalRebalancingPlan,
    state.regionalLaborAbsorptionBrief,
    state.laborRebalancingStressBrief,
    state.laborMarketTightnessBrief
  );
  state.stewardInterventionPriorityBrief = computeNationalStewardInterventionPriorityBrief(
    state,
    state.integratedLaborReadinessOutlook,
    state.laborMarketStabilityOutlook,
    state.laborRebalancingStressBrief
  );
  state.essentialWorkerParticipationOutlook = computeNationalEssentialWorkerParticipationOutlook(
    state,
    state.participationPressureBrief,
    state.migrationShockParticipationBufferOutlook
  );
  state.wageAutomationCouplingBrief = computeNationalWageAutomationCouplingBrief(
    state,
    state.wageParticipationSpilloverBrief,
    state.wageCompetitivenessIndex,
    state.automationParticipationResilienceOutlook
  );
  state.nationalLaborCohesionIndex = computeNationalLaborCohesionIndex(
    state,
    state.laborMarketStabilityOutlook,
    state.intergenerationalWorkforceBalanceOutlook,
    state.capacityParticipationAlignmentBrief
  );
  state.seasonalParticipationSwingOutlook = computeNationalSeasonalParticipationSwingOutlook(
    state,
    state.essentialWorkerParticipationOutlook,
    state.laborMarketTightnessBrief
  );
  state.cohesionCorridorCouplingBrief = computeNationalCohesionCorridorCouplingBrief(
    state,
    state.nationalLaborCohesionIndex,
    state.corridorCapacityStressBrief
  );
  state.nationalWorkforceReliabilityIndex = computeNationalWorkforceReliabilityIndex(
    state,
    state.seasonalParticipationSwingOutlook,
    state.cohesionCorridorCouplingBrief
  );
  state.retentionReliabilityCouplingBrief = computeNationalRetentionReliabilityCouplingBrief(
    state,
    state.nationalWorkforceReliabilityIndex
  );
  state.upskillingVelocityOutlook = computeNationalUpskillingVelocityOutlook(
    state,
    state.skillsTightnessCoherenceOutlook
  );
  state.subjectWorkforceReadinessBrief = computeNationalSubjectWorkforceReadinessBrief(
    state,
    state.retentionReliabilityCouplingBrief,
    state.integratedLaborReadinessOutlook
  );
  state.nationalWorkforceSustainmentIndex = computeNationalWorkforceSustainmentIndex(
    state,
    state.nationalWorkforceReliabilityIndex,
    state.upskillingVelocityOutlook,
    state.subjectWorkforceReadinessBrief
  );
  state.sustainmentRetentionCouplingBrief = computeNationalSustainmentRetentionCouplingBrief(
    state,
    state.nationalWorkforceSustainmentIndex,
    state.retentionReliabilityCouplingBrief
  );
  state.onboardingVelocityOutlook = computeNationalOnboardingVelocityOutlook(
    state,
    state.upskillingVelocityOutlook
  );
  state.subjectAssemblyContinuityBrief = computeNationalSubjectAssemblyContinuityBrief(
    state,
    state.subjectWorkforceReadinessBrief,
    state.nationalWorkforceSustainmentIndex
  );
  state.nationalWorkforceContinuityIndex = computeNationalWorkforceContinuityIndex(
    state,
    state.sustainmentRetentionCouplingBrief,
    state.onboardingVelocityOutlook,
    state.subjectAssemblyContinuityBrief
  );
  state.continuityCoordinationCouplingBrief = computeNationalContinuityCoordinationCouplingBrief(
    state,
    state.nationalWorkforceContinuityIndex
  );
  state.reengagementMomentumOutlook = computeNationalReengagementMomentumOutlook(
    state,
    state.onboardingVelocityOutlook
  );
  state.subjectWaveAssemblyBrief = computeNationalSubjectWaveAssemblyBrief(
    state,
    state.subjectAssemblyContinuityBrief,
    state.nationalWorkforceContinuityIndex
  );
  state.nationalWorkforceDurabilityIndex = computeNationalWorkforceDurabilityIndex(
    state,
    state.continuityCoordinationCouplingBrief,
    state.reengagementMomentumOutlook,
    state.subjectWaveAssemblyBrief
  );
  state.durabilityAdvocacyCouplingBrief = computeNationalDurabilityAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceDurabilityIndex
  );
  state.mentorshipEnduranceOutlook = computeNationalMentorshipEnduranceOutlook(
    state,
    state.reengagementMomentumOutlook
  );
  state.subjectTrancheReadinessBrief = computeNationalSubjectTrancheReadinessBrief(
    state,
    state.subjectWaveAssemblyBrief,
    state.nationalWorkforceDurabilityIndex
  );
  state.nationalWorkforceEnduranceIndex = computeNationalWorkforceEnduranceIndex(
    state,
    state.durabilityAdvocacyCouplingBrief,
    state.mentorshipEnduranceOutlook,
    state.subjectTrancheReadinessBrief
  );
  state.enduranceFlexibilityCouplingBrief = computeNationalEnduranceFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceEnduranceIndex
  );
  state.inclusionResilienceOutlook = computeNationalInclusionResilienceOutlook(
    state,
    state.mentorshipEnduranceOutlook
  );
  state.subjectCommitReadinessBrief = computeNationalSubjectCommitReadinessBrief(
    state,
    state.subjectTrancheReadinessBrief,
    state.nationalWorkforceEnduranceIndex
  );
  state.nationalWorkforceTenacityIndex = computeNationalWorkforceTenacityIndex(
    state,
    state.enduranceFlexibilityCouplingBrief,
    state.inclusionResilienceOutlook,
    state.subjectCommitReadinessBrief
  );
  state.tenacityCareCouplingBrief = computeNationalTenacityCareCouplingBrief(
    state,
    state.nationalWorkforceTenacityIndex
  );
  state.safetyCohesionOutlook = computeNationalSafetyCohesionOutlook(
    state,
    state.inclusionResilienceOutlook
  );
  state.subjectReleaseReadinessBrief = computeNationalSubjectReleaseReadinessBrief(
    state,
    state.subjectCommitReadinessBrief,
    state.nationalWorkforceTenacityIndex
  );
  state.nationalWorkforceSteadfastIndex = computeNationalWorkforceSteadfastIndex(
    state,
    state.tenacityCareCouplingBrief,
    state.safetyCohesionOutlook,
    state.subjectReleaseReadinessBrief
  );
  state.steadfastSchedulingCouplingBrief = computeNationalSteadfastSchedulingCouplingBrief(
    state,
    state.nationalWorkforceSteadfastIndex
  );
  state.retentionAnchorOutlook = computeNationalRetentionAnchorOutlook(state, state.safetyCohesionOutlook);
  state.subjectSealReadinessBrief = computeNationalSubjectSealReadinessBrief(
    state,
    state.subjectReleaseReadinessBrief,
    state.nationalWorkforceSteadfastIndex
  );
  state.nationalWorkforceResolveIndex = computeNationalWorkforceResolveIndex(
    state,
    state.steadfastSchedulingCouplingBrief,
    state.retentionAnchorOutlook,
    state.subjectSealReadinessBrief
  );
  state.resolveUpskillingCouplingBrief = computeNationalResolveUpskillingCouplingBrief(
    state,
    state.nationalWorkforceResolveIndex,
    state.upskillingVelocityOutlook
  );
  state.coordinationBindOutlook = computeNationalCoordinationBindOutlook(
    state,
    state.steadfastSchedulingCouplingBrief
  );
  state.subjectBindReadinessBrief = computeNationalSubjectBindReadinessBrief(
    state,
    state.subjectSealReadinessBrief,
    state.nationalWorkforceResolveIndex
  );
  state.nationalWorkforceFortitudeIndex = computeNationalWorkforceFortitudeIndex(
    state,
    state.resolveUpskillingCouplingBrief,
    state.coordinationBindOutlook,
    state.subjectBindReadinessBrief
  );
  state.fortitudeInclusionCouplingBrief = computeNationalFortitudeInclusionCouplingBrief(
    state,
    state.nationalWorkforceFortitudeIndex
  );
  state.hybridAnchorOutlook = computeNationalHybridAnchorOutlook(state, state.coordinationBindOutlook);
  state.subjectCrownReadinessBrief = computeNationalSubjectCrownReadinessBrief(
    state,
    state.subjectBindReadinessBrief,
    state.nationalWorkforceFortitudeIndex
  );
  state.nationalWorkforceCulminationIndex = computeNationalWorkforceCulminationIndex(
    state,
    state.fortitudeInclusionCouplingBrief,
    state.hybridAnchorOutlook,
    state.subjectCrownReadinessBrief
  );
  state.culminationMentorshipCouplingBrief = computeNationalCulminationMentorshipCouplingBrief(
    state,
    state.nationalWorkforceCulminationIndex
  );
  state.onboardingSustainOutlook = computeNationalOnboardingSustainOutlook(state, state.hybridAnchorOutlook);
  state.subjectApexReadinessBrief = computeNationalSubjectApexReadinessBrief(
    state,
    state.subjectCrownReadinessBrief,
    state.nationalWorkforceCulminationIndex
  );
  state.nationalWorkforceApexIndex = computeNationalWorkforceApexIndex(
    state,
    state.culminationMentorshipCouplingBrief,
    state.onboardingSustainOutlook,
    state.subjectApexReadinessBrief
  );
  state.apexAdvocacyCouplingBrief = computeNationalApexAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceApexIndex
  );
  state.reengagementThrustOutlook = computeNationalReengagementThrustOutlook(
    state,
    state.onboardingSustainOutlook
  );
  state.subjectPinnacleReadinessBrief = computeNationalSubjectPinnacleReadinessBrief(
    state,
    state.subjectApexReadinessBrief,
    state.nationalWorkforceApexIndex
  );
  state.nationalWorkforcePinnacleIndex = computeNationalWorkforcePinnacleIndex(
    state,
    state.apexAdvocacyCouplingBrief,
    state.reengagementThrustOutlook,
    state.subjectPinnacleReadinessBrief
  );
  state.pinnacleRetentionCouplingBrief = computeNationalPinnacleRetentionCouplingBrief(
    state,
    state.nationalWorkforcePinnacleIndex
  );
  state.retentionCrestOutlook = computeNationalRetentionCrestOutlook(
    state,
    state.reengagementThrustOutlook
  );
  state.subjectSummitReadinessBrief = computeNationalSubjectSummitReadinessBrief(
    state,
    state.subjectPinnacleReadinessBrief,
    state.nationalWorkforcePinnacleIndex
  );
  state.nationalWorkforceSummitIndex = computeNationalWorkforceSummitIndex(
    state,
    state.pinnacleRetentionCouplingBrief,
    state.retentionCrestOutlook,
    state.subjectSummitReadinessBrief
  );
  state.summitCoordinationCouplingBrief = computeNationalSummitCoordinationCouplingBrief(
    state,
    state.nationalWorkforceSummitIndex
  );
  state.coordinationHorizonOutlook = computeNationalCoordinationHorizonOutlook(
    state,
    state.retentionCrestOutlook
  );
  state.subjectZenithReadinessBrief = computeNationalSubjectZenithReadinessBrief(
    state,
    state.subjectSummitReadinessBrief,
    state.nationalWorkforceSummitIndex
  );
  state.nationalWorkforceZenithIndex = computeNationalWorkforceZenithIndex(
    state,
    state.summitCoordinationCouplingBrief,
    state.coordinationHorizonOutlook,
    state.subjectZenithReadinessBrief
  );
  state.zenithFlexibilityCouplingBrief = computeNationalZenithFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceZenithIndex
  );
  state.flexibilityAscentOutlook = computeNationalFlexibilityAscentOutlook(
    state,
    state.coordinationHorizonOutlook
  );
  state.subjectApogeeReadinessBrief = computeNationalSubjectApogeeReadinessBrief(
    state,
    state.subjectZenithReadinessBrief,
    state.nationalWorkforceZenithIndex
  );
  state.nationalWorkforceApogeeIndex = computeNationalWorkforceApogeeIndex(
    state,
    state.zenithFlexibilityCouplingBrief,
    state.flexibilityAscentOutlook,
    state.subjectApogeeReadinessBrief
  );
  state.apogeeInclusionCouplingBrief = computeNationalApogeeInclusionCouplingBrief(
    state,
    state.nationalWorkforceApogeeIndex
  );
  state.inclusionOrbitOutlook = computeNationalInclusionOrbitOutlook(
    state,
    state.flexibilityAscentOutlook
  );
  state.subjectOrbitReadinessBrief = computeNationalSubjectOrbitReadinessBrief(
    state,
    state.subjectApogeeReadinessBrief,
    state.nationalWorkforceApogeeIndex
  );
  state.nationalWorkforceOrbitIndex = computeNationalWorkforceOrbitIndex(
    state,
    state.apogeeInclusionCouplingBrief,
    state.inclusionOrbitOutlook,
    state.subjectOrbitReadinessBrief
  );
  state.orbitCareCouplingBrief = computeNationalOrbitCareCouplingBrief(
    state,
    state.nationalWorkforceOrbitIndex
  );
  state.careEquilibriumOutlook = computeNationalCareEquilibriumOutlook(
    state,
    state.inclusionOrbitOutlook
  );
  state.subjectNexusReadinessBrief = computeNationalSubjectNexusReadinessBrief(
    state,
    state.subjectOrbitReadinessBrief,
    state.nationalWorkforceOrbitIndex
  );
  state.nationalWorkforceNexusIndex = computeNationalWorkforceNexusIndex(
    state,
    state.orbitCareCouplingBrief,
    state.careEquilibriumOutlook,
    state.subjectNexusReadinessBrief
  );
  state.nexusSchedulingCouplingBrief = computeNationalNexusSchedulingCouplingBrief(
    state,
    state.nationalWorkforceNexusIndex
  );
  state.schedulingResonanceOutlook = computeNationalSchedulingResonanceOutlook(
    state,
    state.careEquilibriumOutlook
  );
  state.subjectConvergenceReadinessBrief = computeNationalSubjectConvergenceReadinessBrief(
    state,
    state.subjectNexusReadinessBrief,
    state.nationalWorkforceNexusIndex
  );
  state.nationalWorkforceConvergenceIndex = computeNationalWorkforceConvergenceIndex(
    state,
    state.nexusSchedulingCouplingBrief,
    state.schedulingResonanceOutlook,
    state.subjectConvergenceReadinessBrief
  );
  state.convergenceSafetyCouplingBrief = computeNationalConvergenceSafetyCouplingBrief(
    state,
    state.nationalWorkforceConvergenceIndex
  );
  state.safetyHarmonyOutlook = computeNationalSafetyHarmonyOutlook(
    state,
    state.schedulingResonanceOutlook
  );
  state.subjectUnificationReadinessBrief = computeNationalSubjectUnificationReadinessBrief(
    state,
    state.subjectConvergenceReadinessBrief,
    state.nationalWorkforceConvergenceIndex
  );
  state.nationalWorkforceUnificationIndex = computeNationalWorkforceUnificationIndex(
    state,
    state.convergenceSafetyCouplingBrief,
    state.safetyHarmonyOutlook,
    state.subjectUnificationReadinessBrief
  );
  state.unificationUpskillingCouplingBrief = computeNationalUnificationUpskillingCouplingBrief(
    state,
    state.nationalWorkforceUnificationIndex
  );
  state.upskillingSynthesisOutlook = computeNationalUpskillingSynthesisOutlook(
    state,
    state.safetyHarmonyOutlook
  );
  state.subjectSynthesisReadinessBrief = computeNationalSubjectSynthesisReadinessBrief(
    state,
    state.subjectUnificationReadinessBrief,
    state.nationalWorkforceUnificationIndex
  );
  state.nationalWorkforceSynthesisIndex = computeNationalWorkforceSynthesisIndex(
    state,
    state.unificationUpskillingCouplingBrief,
    state.upskillingSynthesisOutlook,
    state.subjectSynthesisReadinessBrief
  );
  state.synthesisOnboardingCouplingBrief = computeNationalSynthesisOnboardingCouplingBrief(
    state,
    state.nationalWorkforceSynthesisIndex
  );
  state.onboardingIntegrationOutlook = computeNationalOnboardingIntegrationOutlook(
    state,
    state.upskillingSynthesisOutlook
  );
  state.subjectIntegrationReadinessBrief = computeNationalSubjectIntegrationReadinessBrief(
    state,
    state.subjectSynthesisReadinessBrief,
    state.nationalWorkforceSynthesisIndex
  );
  state.nationalWorkforceIntegrationIndex = computeNationalWorkforceIntegrationIndex(
    state,
    state.synthesisOnboardingCouplingBrief,
    state.onboardingIntegrationOutlook,
    state.subjectIntegrationReadinessBrief
  );
  state.integrationRetentionCouplingBrief = computeNationalIntegrationRetentionCouplingBrief(
    state,
    state.nationalWorkforceIntegrationIndex
  );
  state.retentionCohesionOutlook = computeNationalRetentionCohesionOutlook(
    state,
    state.onboardingIntegrationOutlook
  );
  state.subjectRetentionReadinessBrief = computeNationalSubjectRetentionReadinessBrief(
    state,
    state.subjectIntegrationReadinessBrief,
    state.nationalWorkforceIntegrationIndex
  );
  state.nationalWorkforceRetentionIndex = computeNationalWorkforceRetentionIndex(
    state,
    state.integrationRetentionCouplingBrief,
    state.retentionCohesionOutlook,
    state.subjectRetentionReadinessBrief
  );
  state.retentionReengagementCouplingBrief = computeNationalRetentionReengagementCouplingBrief(
    state,
    state.nationalWorkforceRetentionIndex
  );
  state.reengagementAlignmentOutlook = computeNationalReengagementAlignmentOutlook(
    state,
    state.retentionCohesionOutlook
  );
  state.subjectReengagementReadinessBrief = computeNationalSubjectReengagementReadinessBrief(
    state,
    state.subjectRetentionReadinessBrief,
    state.nationalWorkforceRetentionIndex
  );
  state.nationalWorkforceReengagementIndex = computeNationalWorkforceReengagementIndex(
    state,
    state.retentionReengagementCouplingBrief,
    state.reengagementAlignmentOutlook,
    state.subjectReengagementReadinessBrief
  );
  state.reengagementMentorshipCouplingBrief = computeNationalReengagementMentorshipCouplingBrief(
    state,
    state.nationalWorkforceReengagementIndex
  );
  state.mentorshipSustainOutlook = computeNationalMentorshipSustainOutlook(
    state,
    state.reengagementAlignmentOutlook
  );
  state.subjectMentorshipReadinessBrief = computeNationalSubjectMentorshipReadinessBrief(
    state,
    state.subjectReengagementReadinessBrief,
    state.nationalWorkforceReengagementIndex
  );
  state.nationalWorkforceMentorshipIndex = computeNationalWorkforceMentorshipIndex(
    state,
    state.reengagementMentorshipCouplingBrief,
    state.mentorshipSustainOutlook,
    state.subjectMentorshipReadinessBrief
  );
  state.mentorshipAdvocacyCouplingBrief = computeNationalMentorshipAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceMentorshipIndex
  );
  state.advocacyResonanceOutlook = computeNationalAdvocacyResonanceOutlook(
    state,
    state.mentorshipSustainOutlook
  );
  state.subjectAdvocacyReadinessBrief = computeNationalSubjectAdvocacyReadinessBrief(
    state,
    state.subjectMentorshipReadinessBrief,
    state.nationalWorkforceMentorshipIndex
  );
  state.nationalWorkforceAdvocacyIndex = computeNationalWorkforceAdvocacyIndex(
    state,
    state.mentorshipAdvocacyCouplingBrief,
    state.advocacyResonanceOutlook,
    state.subjectAdvocacyReadinessBrief
  );
  state.advocacyInclusionCouplingBrief = computeNationalAdvocacyInclusionCouplingBrief(
    state,
    state.nationalWorkforceAdvocacyIndex
  );
  state.inclusionEquityOutlook = computeNationalInclusionEquityOutlook(
    state,
    state.advocacyResonanceOutlook
  );
  state.subjectInclusionReadinessBrief = computeNationalSubjectInclusionReadinessBrief(
    state,
    state.subjectAdvocacyReadinessBrief,
    state.nationalWorkforceAdvocacyIndex
  );
  state.nationalWorkforceInclusionIndex = computeNationalWorkforceInclusionIndex(
    state,
    state.advocacyInclusionCouplingBrief,
    state.inclusionEquityOutlook,
    state.subjectInclusionReadinessBrief
  );
  state.inclusionFlexibilityCouplingBrief = computeNationalInclusionFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceInclusionIndex
  );
  state.flexibilityFlowOutlook = computeNationalFlexibilityFlowOutlook(
    state,
    state.inclusionEquityOutlook
  );
  state.subjectFlexibilityReadinessBrief = computeNationalSubjectFlexibilityReadinessBrief(
    state,
    state.subjectInclusionReadinessBrief,
    state.nationalWorkforceInclusionIndex
  );
  state.nationalWorkforceFlexibilityIndex = computeNationalWorkforceFlexibilityIndex(
    state,
    state.inclusionFlexibilityCouplingBrief,
    state.flexibilityFlowOutlook,
    state.subjectFlexibilityReadinessBrief
  );
  state.flexibilityCoordinationCouplingBrief = computeNationalFlexibilityCoordinationCouplingBrief(
    state,
    state.nationalWorkforceFlexibilityIndex
  );
  state.coordinationMeshOutlook = computeNationalCoordinationMeshOutlook(
    state,
    state.flexibilityFlowOutlook
  );
  state.subjectCoordinationReadinessBrief = computeNationalSubjectCoordinationReadinessBrief(
    state,
    state.subjectFlexibilityReadinessBrief,
    state.nationalWorkforceFlexibilityIndex
  );
  state.nationalWorkforceCoordinationIndex = computeNationalWorkforceCoordinationIndex(
    state,
    state.flexibilityCoordinationCouplingBrief,
    state.coordinationMeshOutlook,
    state.subjectCoordinationReadinessBrief
  );
  state.coordinationSchedulingCouplingBrief = computeNationalCoordinationSchedulingCouplingBrief(
    state,
    state.nationalWorkforceCoordinationIndex
  );
  state.schedulingPulseOutlook = computeNationalSchedulingPulseOutlook(
    state,
    state.coordinationMeshOutlook
  );
  state.subjectSchedulingReadinessBrief = computeNationalSubjectSchedulingReadinessBrief(
    state,
    state.subjectCoordinationReadinessBrief,
    state.nationalWorkforceCoordinationIndex
  );
  state.nationalWorkforceSchedulingIndex = computeNationalWorkforceSchedulingIndex(
    state,
    state.coordinationSchedulingCouplingBrief,
    state.schedulingPulseOutlook,
    state.subjectSchedulingReadinessBrief
  );
  state.schedulingSafetyCouplingBrief = computeNationalSchedulingSafetyCouplingBrief(
    state,
    state.nationalWorkforceSchedulingIndex
  );
  state.safetyCalibrationOutlook = computeNationalSafetyCalibrationOutlook(
    state,
    state.schedulingPulseOutlook
  );
  state.subjectSafetyReadinessBrief = computeNationalSubjectSafetyReadinessBrief(
    state,
    state.subjectSchedulingReadinessBrief,
    state.nationalWorkforceSchedulingIndex
  );
  state.nationalWorkforceSafetyIndex = computeNationalWorkforceSafetyIndex(
    state,
    state.schedulingSafetyCouplingBrief,
    state.safetyCalibrationOutlook,
    state.subjectSafetyReadinessBrief
  );
  state.safetyCareCouplingBrief = computeNationalSafetyCareCouplingBrief(
    state,
    state.nationalWorkforceSafetyIndex
  );
  state.careBalanceOutlook = computeNationalCareBalanceOutlook(
    state,
    state.safetyCalibrationOutlook
  );
  state.subjectCareReadinessBrief = computeNationalSubjectCareReadinessBrief(
    state,
    state.subjectSafetyReadinessBrief,
    state.nationalWorkforceSafetyIndex
  );
  state.nationalWorkforceCareIndex = computeNationalWorkforceCareIndex(
    state,
    state.safetyCareCouplingBrief,
    state.careBalanceOutlook,
    state.subjectCareReadinessBrief
  );
  state.careTenacityCouplingBrief = computeNationalCareTenacityCouplingBrief(
    state,
    state.nationalWorkforceCareIndex
  );
  state.tenacityResilienceOutlook = computeNationalTenacityResilienceOutlook(
    state,
    state.careBalanceOutlook
  );
  state.subjectTenacityReadinessBrief = computeNationalSubjectTenacityReadinessBrief(
    state,
    state.subjectCareReadinessBrief,
    state.nationalWorkforceCareIndex
  );
  state.nationalWorkforceTenacityDepthIndex = computeNationalWorkforceTenacityDepthIndex(
    state,
    state.careTenacityCouplingBrief,
    state.tenacityResilienceOutlook,
    state.subjectTenacityReadinessBrief
  );
  state.tenacityPerseveranceCouplingBrief = computeNationalTenacityPerseveranceCouplingBrief(
    state,
    state.nationalWorkforceTenacityDepthIndex
  );
  state.perseveranceResilienceOutlook = computeNationalPerseveranceResilienceOutlook(
    state,
    state.tenacityResilienceOutlook
  );
  state.subjectPerseveranceReadinessBrief = computeNationalSubjectPerseveranceReadinessBrief(
    state,
    state.subjectTenacityReadinessBrief,
    state.nationalWorkforceTenacityDepthIndex
  );
  state.nationalWorkforcePerseveranceDepthIndex = computeNationalWorkforcePerseveranceDepthIndex(
    state,
    state.tenacityPerseveranceCouplingBrief,
    state.perseveranceResilienceOutlook,
    state.subjectPerseveranceReadinessBrief
  );
  state.perseveranceGritCouplingBrief = computeNationalPerseveranceGritCouplingBrief(
    state,
    state.nationalWorkforcePerseveranceDepthIndex
  );
  state.gritResilienceOutlook = computeNationalGritResilienceOutlook(
    state,
    state.perseveranceResilienceOutlook
  );
  state.subjectGritReadinessBrief = computeNationalSubjectGritReadinessBrief(
    state,
    state.subjectPerseveranceReadinessBrief,
    state.nationalWorkforcePerseveranceDepthIndex
  );
  state.nationalWorkforceGritDepthIndex = computeNationalWorkforceGritDepthIndex(
    state,
    state.perseveranceGritCouplingBrief,
    state.gritResilienceOutlook,
    state.subjectGritReadinessBrief
  );
  state.gritResolveCouplingBrief = computeNationalGritResolveCouplingBrief(
    state,
    state.nationalWorkforceGritDepthIndex
  );
  state.resolveResilienceOutlook = computeNationalResolveResilienceOutlook(
    state,
    state.gritResilienceOutlook
  );
  state.subjectResolveReadinessBrief = computeNationalSubjectResolveReadinessBrief(
    state,
    state.subjectGritReadinessBrief,
    state.nationalWorkforceGritDepthIndex
  );
  state.nationalWorkforceResolveDepthIndex = computeNationalWorkforceResolveDepthIndex(
    state,
    state.gritResolveCouplingBrief,
    state.resolveResilienceOutlook,
    state.subjectResolveReadinessBrief
  );
  state.resolveSteadfastCouplingBrief = computeNationalResolveSteadfastCouplingBrief(
    state,
    state.nationalWorkforceResolveDepthIndex
  );
  state.steadfastResilienceOutlook = computeNationalSteadfastResilienceOutlook(
    state,
    state.resolveResilienceOutlook
  );
  state.subjectSteadfastReadinessBrief = computeNationalSubjectSteadfastReadinessBrief(
    state,
    state.subjectResolveReadinessBrief,
    state.nationalWorkforceResolveDepthIndex
  );
  state.nationalWorkforceSteadfastDepthIndex = computeNationalWorkforceSteadfastDepthIndex(
    state,
    state.resolveSteadfastCouplingBrief,
    state.steadfastResilienceOutlook,
    state.subjectSteadfastReadinessBrief
  );
  state.steadfastAdvocacyCouplingBrief = computeNationalSteadfastAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceSteadfastDepthIndex
  );
  state.advocacyResilienceOutlook = computeNationalAdvocacyResilienceOutlook(
    state,
    state.steadfastResilienceOutlook
  );
  state.subjectAdvocacySteadfastReadinessBrief = computeNationalSubjectAdvocacySteadfastReadinessBrief(
    state,
    state.subjectSteadfastReadinessBrief,
    state.nationalWorkforceSteadfastDepthIndex
  );
  state.nationalWorkforceAdvocacyDepthIndex = computeNationalWorkforceAdvocacyDepthIndex(
    state,
    state.steadfastAdvocacyCouplingBrief,
    state.advocacyResilienceOutlook,
    state.subjectAdvocacySteadfastReadinessBrief
  );
  if (capacityBridge.summary) {
    state.evidence.push(capacityBridge.summary.slice(0, 120));
  }
  if (state.laborResilienceScorecard.stewardNote && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.laborResilienceScorecard.stewardNote.slice(0, 120));
  }
  if (state.participationPressureBrief.summary && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.participationPressureBrief.summary.slice(0, 120));
  }
  if (state.laborMarketVelocityIndex.nationalBand === 'volatile' && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.laborMarketVelocityIndex.summary.slice(0, 120));
  }
  if (
    (state.skillMismatchIndex?.nationalBand === 'critical_mismatch' ||
      state.skillMismatchIndex?.nationalBand === 'elevated_gap') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.skillMismatchIndex.summary.slice(0, 120));
  }
  if (
    state.talentMobilityOutlook?.band === 'hyper_mobile' &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.talentMobilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.underemploymentPressureBrief?.band === 'severe_underuse' ||
      state.underemploymentPressureBrief?.band === 'tight_hidden') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.underemploymentPressureBrief.summary.slice(0, 120));
  }
  if (
    (state.wageCompetitivenessIndex?.band === 'cost_burden' ||
      state.wageCompetitivenessIndex?.band === 'stretched') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageCompetitivenessIndex.summary.slice(0, 120));
  }
  if (
    (state.workforceTransitionFrictionOutlook?.band === 'bottleneck' ||
      state.workforceTransitionFrictionOutlook?.band === 'sticky') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.workforceTransitionFrictionOutlook.summary.slice(0, 120));
  }
  if (
    (state.youthEntryPipelineOutlook?.band === 'constricted' ||
      state.youthEntryPipelineOutlook?.band === 'narrow') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.youthEntryPipelineOutlook.summary.slice(0, 120));
  }
  if (
    (state.laborMarketTightnessBrief?.band === 'critical_shortage' ||
      state.laborMarketTightnessBrief?.band === 'tight') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborMarketTightnessBrief.summary.slice(0, 120));
  }
  if (
    (state.hybridParticipationFrictionOutlook?.band === 'binding' ||
      state.hybridParticipationFrictionOutlook?.band === 'elevated') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridParticipationFrictionOutlook.summary.slice(0, 120));
  }
  if (
    (state.seniorWorkforceRetentionOutlook?.band === 'fragile' ||
      state.seniorWorkforceRetentionOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.seniorWorkforceRetentionOutlook.summary.slice(0, 120));
  }
  if (
    (state.regionalLaborAbsorptionBrief?.band === 'saturated' ||
      state.regionalLaborAbsorptionBrief?.band === 'constrained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.regionalLaborAbsorptionBrief.summary.slice(0, 120));
  }
  if (
    (state.participationEquityGapBrief?.band === 'wide_gap' ||
      state.participationEquityGapBrief?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.participationEquityGapBrief.summary.slice(0, 120));
  }
  if (
    (state.credentialMobilityOutlook?.band === 'blocked' ||
      state.credentialMobilityOutlook?.band === 'narrow') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.credentialMobilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.householdParticipationCouplingBrief?.band === 'decoupled' ||
      state.householdParticipationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.householdParticipationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.laborRebalancingStressBrief?.band === 'critical' ||
      state.laborRebalancingStressBrief?.band === 'acute') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborRebalancingStressBrief.summary.slice(0, 120));
  }
  if (
    (state.automationParticipationResilienceOutlook?.band === 'fragile' ||
      state.automationParticipationResilienceOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.automationParticipationResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.wageParticipationSpilloverBrief?.band === 'suppressive' ||
      state.wageParticipationSpilloverBrief?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageParticipationSpilloverBrief.summary.slice(0, 120));
  }
  if (
    (state.migrationShockParticipationBufferOutlook?.band === 'depleted' ||
      state.migrationShockParticipationBufferOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.migrationShockParticipationBufferOutlook.summary.slice(0, 120));
  }
  if (
    (state.laborMarketStabilityOutlook?.band === 'volatile' ||
      state.laborMarketStabilityOutlook?.band === 'fragile') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborMarketStabilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.intergenerationalWorkforceBalanceOutlook?.band === 'skewed_aged' ||
      state.intergenerationalWorkforceBalanceOutlook?.band === 'narrow_youth') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.intergenerationalWorkforceBalanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.capacityParticipationAlignmentBrief?.band === 'misaligned' ||
      state.capacityParticipationAlignmentBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.capacityParticipationAlignmentBrief.summary.slice(0, 120));
  }
  if (
    (state.participationVelocityCouplingBrief?.band === 'divergent' ||
      state.participationVelocityCouplingBrief?.band === 'lagging') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.participationVelocityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.skillsTightnessCoherenceOutlook?.band === 'incoherent' ||
      state.skillsTightnessCoherenceOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.skillsTightnessCoherenceOutlook.summary.slice(0, 120));
  }
  if (
    (state.integratedLaborReadinessOutlook?.band === 'unprepared' ||
      state.integratedLaborReadinessOutlook?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.integratedLaborReadinessOutlook.summary.slice(0, 120));
  }
  if (
    (state.hybridRemoteParticipationOutlook?.band === 'constrained' ||
      state.hybridRemoteParticipationOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridRemoteParticipationOutlook.summary.slice(0, 120));
  }
  if (
    (state.corridorCapacityStressBrief?.band === 'stressed' ||
      state.corridorCapacityStressBrief?.band === 'overloaded') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.corridorCapacityStressBrief.summary.slice(0, 120));
  }
  if (
    (state.stewardInterventionPriorityBrief?.band === 'act' ||
      state.stewardInterventionPriorityBrief?.band === 'urgent') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.stewardInterventionPriorityBrief.summary.slice(0, 120));
  }
  if (
    (state.essentialWorkerParticipationOutlook?.band === 'strained' ||
      state.essentialWorkerParticipationOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.essentialWorkerParticipationOutlook.summary.slice(0, 120));
  }
  if (
    (state.wageAutomationCouplingBrief?.band === 'disruptive' ||
      state.wageAutomationCouplingBrief?.band === 'tense') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageAutomationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalLaborCohesionIndex?.band === 'fragmented' ||
      state.nationalLaborCohesionIndex?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalLaborCohesionIndex.summary.slice(0, 120));
  }
  if (
    (state.seasonalParticipationSwingOutlook?.band === 'volatile' ||
      state.seasonalParticipationSwingOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.seasonalParticipationSwingOutlook.summary.slice(0, 120));
  }
  if (
    (state.cohesionCorridorCouplingBrief?.band === 'decoupled' ||
      state.cohesionCorridorCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.cohesionCorridorCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceReliabilityIndex?.band === 'fragile' ||
      state.nationalWorkforceReliabilityIndex?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceReliabilityIndex.summary.slice(0, 120));
  }
  if (
    (state.retentionReliabilityCouplingBrief?.band === 'fragile' ||
      state.retentionReliabilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionReliabilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.upskillingVelocityOutlook?.band === 'stalled' ||
      state.upskillingVelocityOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.upskillingVelocityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectWorkforceReadinessBrief?.band === 'unready' ||
      state.subjectWorkforceReadinessBrief?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectWorkforceReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSustainmentIndex?.band === 'depleted' ||
      state.nationalWorkforceSustainmentIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSustainmentIndex.summary.slice(0, 120));
  }
  if (
    (state.sustainmentRetentionCouplingBrief?.band === 'decoupled' ||
      state.sustainmentRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.sustainmentRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingVelocityOutlook?.band === 'stalled' ||
      state.onboardingVelocityOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingVelocityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectAssemblyContinuityBrief?.band === 'broken' ||
      state.subjectAssemblyContinuityBrief?.band === 'gapped') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectAssemblyContinuityBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceContinuityIndex?.band === 'fragile' ||
      state.nationalWorkforceContinuityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceContinuityIndex.summary.slice(0, 120));
  }
  if (
    (state.continuityCoordinationCouplingBrief?.band === 'decoupled' ||
      state.continuityCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.continuityCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementMomentumOutlook?.band === 'stalled' ||
      state.reengagementMomentumOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementMomentumOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectWaveAssemblyBrief?.band === 'blocked' ||
      state.subjectWaveAssemblyBrief?.band === 'gapped') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectWaveAssemblyBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceDurabilityIndex?.band === 'brittle' ||
      state.nationalWorkforceDurabilityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceDurabilityIndex.summary.slice(0, 120));
  }
  if (
    (state.durabilityAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.durabilityAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.durabilityAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.mentorshipEnduranceOutlook?.band === 'depleted' ||
      state.mentorshipEnduranceOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipEnduranceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectTrancheReadinessBrief?.band === 'blocked' ||
      state.subjectTrancheReadinessBrief?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectTrancheReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceEnduranceIndex?.band === 'fragile' ||
      state.nationalWorkforceEnduranceIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceEnduranceIndex.summary.slice(0, 120));
  }
  if (
    (state.enduranceFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.enduranceFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.enduranceFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionResilienceOutlook?.band === 'fragile' ||
      state.inclusionResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCommitReadinessBrief?.band === 'held' ||
      state.subjectCommitReadinessBrief?.band === 'review') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCommitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceTenacityIndex?.band === 'brittle' ||
      state.nationalWorkforceTenacityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceTenacityIndex.summary.slice(0, 120));
  }
  if (
    (state.tenacityCareCouplingBrief?.band === 'decoupled' ||
      state.tenacityCareCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.tenacityCareCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.safetyCohesionOutlook?.band === 'exposed' ||
      state.safetyCohesionOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyCohesionOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectReleaseReadinessBrief?.band === 'held' ||
      state.subjectReleaseReadinessBrief?.band === 'staged') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectReleaseReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSteadfastIndex?.band === 'fragile' ||
      state.nationalWorkforceSteadfastIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSteadfastIndex.summary.slice(0, 120));
  }
  if (
    (state.steadfastSchedulingCouplingBrief?.band === 'decoupled' ||
      state.steadfastSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.steadfastSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionAnchorOutlook?.band === 'drifting' ||
      state.retentionAnchorOutlook?.band === 'loose') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionAnchorOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSealReadinessBrief?.band === 'open' ||
      state.subjectSealReadinessBrief?.band === 'pending') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSealReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceResolveIndex?.band === 'fragile' ||
      state.nationalWorkforceResolveIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceResolveIndex.summary.slice(0, 120));
  }
  if (
    (state.resolveUpskillingCouplingBrief?.band === 'decoupled' ||
      state.resolveUpskillingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.resolveUpskillingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationBindOutlook?.band === 'loose' ||
      state.coordinationBindOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationBindOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectBindReadinessBrief?.band === 'unbound' ||
      state.subjectBindReadinessBrief?.band === 'tension') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectBindReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceFortitudeIndex?.band === 'fragile' ||
      state.nationalWorkforceFortitudeIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceFortitudeIndex.summary.slice(0, 120));
  }
  if (
    (state.fortitudeInclusionCouplingBrief?.band === 'decoupled' ||
      state.fortitudeInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.fortitudeInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.hybridAnchorOutlook?.band === 'drifting' ||
      state.hybridAnchorOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridAnchorOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCrownReadinessBrief?.band === 'uncrowned' ||
      state.subjectCrownReadinessBrief?.band === 'pending') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCrownReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceCulminationIndex?.band === 'fragile' ||
      state.nationalWorkforceCulminationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceCulminationIndex.summary.slice(0, 120));
  }
  if (
    (state.culminationMentorshipCouplingBrief?.band === 'decoupled' ||
      state.culminationMentorshipCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.culminationMentorshipCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingSustainOutlook?.band === 'depleted' ||
      state.onboardingSustainOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingSustainOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectApexReadinessBrief?.band === 'below_apex' ||
      state.subjectApexReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectApexReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceApexIndex?.band === 'fragile' ||
      state.nationalWorkforceApexIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceApexIndex.summary.slice(0, 120));
  }
  if (
    (state.apexAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.apexAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.apexAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementThrustOutlook?.band === 'stalled' ||
      state.reengagementThrustOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementThrustOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectPinnacleReadinessBrief?.band === 'below_pinnacle' ||
      state.subjectPinnacleReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectPinnacleReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforcePinnacleIndex?.band === 'fragile' ||
      state.nationalWorkforcePinnacleIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforcePinnacleIndex.summary.slice(0, 120));
  }
  if (
    (state.pinnacleRetentionCouplingBrief?.band === 'decoupled' ||
      state.pinnacleRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.pinnacleRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionCrestOutlook?.band === 'ebbing' ||
      state.retentionCrestOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionCrestOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSummitReadinessBrief?.band === 'below_summit' ||
      state.subjectSummitReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSummitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSummitIndex?.band === 'fragile' ||
      state.nationalWorkforceSummitIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSummitIndex.summary.slice(0, 120));
  }
  if (
    (state.summitCoordinationCouplingBrief?.band === 'decoupled' ||
      state.summitCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.summitCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationHorizonOutlook?.band === 'ebbing' ||
      state.coordinationHorizonOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationHorizonOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectZenithReadinessBrief?.band === 'below_zenith' ||
      state.subjectZenithReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectZenithReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceZenithIndex?.band === 'fragile' ||
      state.nationalWorkforceZenithIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceZenithIndex.summary.slice(0, 120));
  }
  if (
    (state.zenithFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.zenithFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.zenithFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.flexibilityAscentOutlook?.band === 'ebbing' ||
      state.flexibilityAscentOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityAscentOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectApogeeReadinessBrief?.band === 'below_apogee' ||
      state.subjectApogeeReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectApogeeReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceApogeeIndex?.band === 'fragile' ||
      state.nationalWorkforceApogeeIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceApogeeIndex.summary.slice(0, 120));
  }
  if (
    (state.apogeeInclusionCouplingBrief?.band === 'decoupled' ||
      state.apogeeInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.apogeeInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionOrbitOutlook?.band === 'ebbing' ||
      state.inclusionOrbitOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionOrbitOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectOrbitReadinessBrief?.band === 'below_orbit' ||
      state.subjectOrbitReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectOrbitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceOrbitIndex?.band === 'fragile' ||
      state.nationalWorkforceOrbitIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceOrbitIndex.summary.slice(0, 120));
  }
  if (
    (state.orbitCareCouplingBrief?.band === 'decoupled' ||
      state.orbitCareCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.orbitCareCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.careEquilibriumOutlook?.band === 'ebbing' ||
      state.careEquilibriumOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.careEquilibriumOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectNexusReadinessBrief?.band === 'below_nexus' ||
      state.subjectNexusReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectNexusReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceNexusIndex?.band === 'fragile' ||
      state.nationalWorkforceNexusIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceNexusIndex.summary.slice(0, 120));
  }
  if (
    (state.nexusSchedulingCouplingBrief?.band === 'decoupled' ||
      state.nexusSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nexusSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.schedulingResonanceOutlook?.band === 'ebbing' ||
      state.schedulingResonanceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.schedulingResonanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectConvergenceReadinessBrief?.band === 'below_convergence' ||
      state.subjectConvergenceReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectConvergenceReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceConvergenceIndex?.band === 'fragile' ||
      state.nationalWorkforceConvergenceIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceConvergenceIndex.summary.slice(0, 120));
  }
  if (
    (state.convergenceSafetyCouplingBrief?.band === 'decoupled' ||
      state.convergenceSafetyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.convergenceSafetyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.safetyHarmonyOutlook?.band === 'ebbing' ||
      state.safetyHarmonyOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyHarmonyOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectUnificationReadinessBrief?.band === 'below_unification' ||
      state.subjectUnificationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectUnificationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceUnificationIndex?.band === 'fragile' ||
      state.nationalWorkforceUnificationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceUnificationIndex.summary.slice(0, 120));
  }
  if (
    (state.unificationUpskillingCouplingBrief?.band === 'decoupled' ||
      state.unificationUpskillingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.unificationUpskillingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.upskillingSynthesisOutlook?.band === 'ebbing' ||
      state.upskillingSynthesisOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.upskillingSynthesisOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSynthesisReadinessBrief?.band === 'below_synthesis' ||
      state.subjectSynthesisReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSynthesisReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSynthesisIndex?.band === 'fragile' ||
      state.nationalWorkforceSynthesisIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSynthesisIndex.summary.slice(0, 120));
  }
  if (
    (state.synthesisOnboardingCouplingBrief?.band === 'decoupled' ||
      state.synthesisOnboardingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.synthesisOnboardingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingIntegrationOutlook?.band === 'ebbing' ||
      state.onboardingIntegrationOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingIntegrationOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectIntegrationReadinessBrief?.band === 'below_integration' ||
      state.subjectIntegrationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectIntegrationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceIntegrationIndex?.band === 'fragile' ||
      state.nationalWorkforceIntegrationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceIntegrationIndex.summary.slice(0, 120));
  }
  if (
    (state.integrationRetentionCouplingBrief?.band === 'decoupled' ||
      state.integrationRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.integrationRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionCohesionOutlook?.band === 'ebbing' ||
      state.retentionCohesionOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionCohesionOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectRetentionReadinessBrief?.band === 'below_retention' ||
      state.subjectRetentionReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectRetentionReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceRetentionIndex?.band === 'fragile' ||
      state.nationalWorkforceRetentionIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceRetentionIndex.summary.slice(0, 120));
  }
  if (
    (state.retentionReengagementCouplingBrief?.band === 'decoupled' ||
      state.retentionReengagementCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionReengagementCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementAlignmentOutlook?.band === 'ebbing' ||
      state.reengagementAlignmentOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementAlignmentOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectReengagementReadinessBrief?.band === 'below_reengagement' ||
      state.subjectReengagementReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectReengagementReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceReengagementIndex?.band === 'fragile' ||
      state.nationalWorkforceReengagementIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceReengagementIndex.summary.slice(0, 120));
  }
  if (
    (state.reengagementMentorshipCouplingBrief?.band === 'decoupled' ||
      state.reengagementMentorshipCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementMentorshipCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.mentorshipSustainOutlook?.band === 'ebbing' ||
      state.mentorshipSustainOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipSustainOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectMentorshipReadinessBrief?.band === 'below_mentorship' ||
      state.subjectMentorshipReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectMentorshipReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceMentorshipIndex?.band === 'fragile' ||
      state.nationalWorkforceMentorshipIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceMentorshipIndex.summary.slice(0, 120));
  }
  if (
    (state.mentorshipAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.mentorshipAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.advocacyResonanceOutlook?.band === 'ebbing' ||
      state.advocacyResonanceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.advocacyResonanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectAdvocacyReadinessBrief?.band === 'below_advocacy' ||
      state.subjectAdvocacyReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectAdvocacyReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceAdvocacyIndex?.band === 'fragile' ||
      state.nationalWorkforceAdvocacyIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceAdvocacyIndex.summary.slice(0, 120));
  }
  if (
    (state.advocacyInclusionCouplingBrief?.band === 'decoupled' ||
      state.advocacyInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.advocacyInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionEquityOutlook?.band === 'ebbing' ||
      state.inclusionEquityOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionEquityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectInclusionReadinessBrief?.band === 'below_inclusion' ||
      state.subjectInclusionReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectInclusionReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceInclusionIndex?.band === 'fragile' ||
      state.nationalWorkforceInclusionIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceInclusionIndex.summary.slice(0, 120));
  }
  if (
    (state.inclusionFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.inclusionFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.flexibilityFlowOutlook?.band === 'ebbing' ||
      state.flexibilityFlowOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityFlowOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectFlexibilityReadinessBrief?.band === 'below_flexibility' ||
      state.subjectFlexibilityReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectFlexibilityReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceFlexibilityIndex?.band === 'fragile' ||
      state.nationalWorkforceFlexibilityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceFlexibilityIndex.summary.slice(0, 120));
  }
  if (
    (state.flexibilityCoordinationCouplingBrief?.band === 'decoupled' ||
      state.flexibilityCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationMeshOutlook?.band === 'ebbing' ||
      state.coordinationMeshOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationMeshOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCoordinationReadinessBrief?.band === 'below_coordination' ||
      state.subjectCoordinationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCoordinationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceCoordinationIndex?.band === 'fragile' ||
      state.nationalWorkforceCoordinationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceCoordinationIndex.summary.slice(0, 120));
  }
  if (
    (state.coordinationSchedulingCouplingBrief?.band === 'decoupled' ||
      state.coordinationSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.schedulingPulseOutlook?.band === 'ebbing' ||
      state.schedulingPulseOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.schedulingPulseOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSchedulingReadinessBrief?.band === 'below_scheduling' ||
      state.subjectSchedulingReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSchedulingReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSchedulingIndex?.band === 'fragile' ||
      state.nationalWorkforceSchedulingIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSchedulingIndex.summary.slice(0, 120));
  }
  if (
    (state.schedulingSafetyCouplingBrief?.band === 'decoupled' ||
      state.schedulingSafetyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.schedulingSafetyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.safetyCalibrationOutlook?.band === 'ebbing' ||
      state.safetyCalibrationOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyCalibrationOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSafetyReadinessBrief?.band === 'below_safety' ||
      state.subjectSafetyReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSafetyReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSafetyIndex?.band === 'fragile' ||
      state.nationalWorkforceSafetyIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSafetyIndex.summary.slice(0, 120));
  }
  if (
    (state.safetyCareCouplingBrief?.band === 'decoupled' ||
      state.safetyCareCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyCareCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.careBalanceOutlook?.band === 'ebbing' || state.careBalanceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.careBalanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCareReadinessBrief?.band === 'below_care' ||
      state.subjectCareReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCareReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceCareIndex?.band === 'fragile' ||
      state.nationalWorkforceCareIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceCareIndex.summary.slice(0, 120));
  }
  if (
    (state.careTenacityCouplingBrief?.band === 'decoupled' ||
      state.careTenacityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.careTenacityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.tenacityResilienceOutlook?.band === 'ebbing' ||
      state.tenacityResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.tenacityResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectTenacityReadinessBrief?.band === 'below_tenacity' ||
      state.subjectTenacityReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectTenacityReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceTenacityDepthIndex?.band === 'fragile' ||
      state.nationalWorkforceTenacityDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceTenacityDepthIndex.summary.slice(0, 120));
  }
  if (
    (state.tenacityPerseveranceCouplingBrief?.band === 'decoupled' ||
      state.tenacityPerseveranceCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.tenacityPerseveranceCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.perseveranceResilienceOutlook?.band === 'ebbing' ||
      state.perseveranceResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.perseveranceResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectPerseveranceReadinessBrief?.band === 'below_perseverance' ||
      state.subjectPerseveranceReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectPerseveranceReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforcePerseveranceDepthIndex?.band === 'fragile' ||
      state.nationalWorkforcePerseveranceDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforcePerseveranceDepthIndex.summary.slice(0, 120));
  }
  if (
    (state.perseveranceGritCouplingBrief?.band === 'decoupled' ||
      state.perseveranceGritCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.perseveranceGritCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.gritResilienceOutlook?.band === 'ebbing' || state.gritResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.gritResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectGritReadinessBrief?.band === 'below_grit' ||
      state.subjectGritReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectGritReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceGritDepthIndex?.band === 'fragile' ||
      state.nationalWorkforceGritDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceGritDepthIndex.summary.slice(0, 120));
  }
  if (
    (state.gritResolveCouplingBrief?.band === 'decoupled' ||
      state.gritResolveCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.gritResolveCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.resolveResilienceOutlook?.band === 'ebbing' || state.resolveResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.resolveResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectResolveReadinessBrief?.band === 'below_resolve' ||
      state.subjectResolveReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectResolveReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceResolveDepthIndex?.band === 'fragile' ||
      state.nationalWorkforceResolveDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceResolveDepthIndex.summary.slice(0, 120));
  }
  if (
    (state.resolveSteadfastCouplingBrief?.band === 'decoupled' ||
      state.resolveSteadfastCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.resolveSteadfastCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.steadfastResilienceOutlook?.band === 'ebbing' || state.steadfastResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.steadfastResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSteadfastReadinessBrief?.band === 'below_steadfast' ||
      state.subjectSteadfastReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSteadfastReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSteadfastDepthIndex?.band === 'fragile' ||
      state.nationalWorkforceSteadfastDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSteadfastDepthIndex.summary.slice(0, 120));
  }
  if (
    (state.steadfastAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.steadfastAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.steadfastAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.advocacyResilienceOutlook?.band === 'ebbing' ||
      state.advocacyResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.advocacyResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectAdvocacySteadfastReadinessBrief?.band === 'below_advocacy' ||
      state.subjectAdvocacySteadfastReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectAdvocacySteadfastReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceAdvocacyDepthIndex?.band === 'fragile' ||
      state.nationalWorkforceAdvocacyDepthIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceAdvocacyDepthIndex.summary.slice(0, 120));
  }
  if (corridorNotes.length) {
    state.evidence.push(corridorNotes[0]);
  }

  const stewardBrief = buildStewardLaborBrief(state, integratedBrief, events);
  stewardBrief.hints.forEach(h => {
    if (!events.includes(h) && events.length < V1014_LABOR_LIMITS.maxEventsPerTurn) events.push(h);
  });

  if (automationFeedback.stewardHints.length) {
    events.push(...automationFeedback.stewardHints.slice(0, V1014_LABOR_LIMITS.maxEventsPerTurn));
  }

  return { state, persisted: nextPersisted, events };
}
