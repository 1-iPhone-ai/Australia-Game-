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
