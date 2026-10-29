import {
  buildOP10M_A11_CompositeInputsFromFixtures,
  recomputeOP10M_A11_CitiesRegionsComposite,
  validateOP10M_A11_CompositeState,
} from '../composite-recompute.ts';
import type { OP10M_A11_CompositePersisted } from '../types.ts';

export type OP10M_A11_RegressionTurnSnapshot = {
  turn: number;
  revision: number;
  cohesionIndex: number;
  inequalityIndex: number;
  serviceEquityIndex: number;
  standingSpread: number;
  backlogIndex: number;
  governanceFrictionIndex: number;
  housingSpilloverIndex: number;
  climateDisplacementIndex: number;
  amenityCostIndex: number;
  relocationBurdenIndex: number;
  employmentAnchorIndex: number;
  commuteWedgeIndex: number;
  receptionStrainIndex: number;
  landUseGridlockIndex: number;
  mobilityTrapIndex: number;
  absorptionGapIndex: number;
  reliefOverheadIndex: number;
  corridorEquityDriftIndex: number;
  climateAdaptationLagIndex: number;
  fiscalCapacityStrainIndex: number;
  networkResilienceErosionIndex: number;
  longHorizonCapacityRiskIndex: number;
  cohesionIntegrityIndex: number;
  reliefEquityGapIndex: number;
  systemicFragilityIndex: number;
  governanceResilienceDecayIndex: number;
  migrationStabilityErosionIndex: number;
  adaptiveCapacityCeilingIndex: number;
  fiscalGovernanceCouplingIndex: number;
  networkEquityTensionIndex: number;
  resilienceFrontierIndex: number;
  metaGovernanceFatigueIndex: number;
  capitalMobilityAsymmetryIndex: number;
  compoundShockSaturationIndex: number;
  institutionalTrustErosionIndex: number;
  liquidityFragmentationIndex: number;
  cascadingFailureRiskIndex: number;
  socialContractFragilityIndex: number;
  capitalFlightPanicIndex: number;
  irrecoverableCollapseThresholdIndex: number;
  settlementLegitimacyCollapseIndex: number;
  fiscalPanicContagionIndex: number;
  terminalStateLockInIndex: number;
  governanceVacuumEscalationIndex: number;
  settlementAbandonmentSpiralIndex: number;
  postCollapseRecoveryImpossibilityIndex: number;
  stateCollapseCascadeAmplificationIndex: number;
  hollowRegionContagionIndex: number;
  permanentDepopulationLockIndex: number;
  totalCollapseSingularityIndex: number;
  voidExpansionVelocityIndex: number;
  existentialContinuityFractureIndex: number;
  collapseHorizonConvergenceIndex: number;
  voidTotalizationSurgeIndex: number;
  existentialTerminusLockIndex: number;
  absoluteCollapseHorizonLockIndex: number;
  voidFinalizationCascadeIndex: number;
  existentialObliterationThresholdIndex: number;
  ultimateCollapseSingularitySealIndex: number;
  voidAnnihilationConvergenceIndex: number;
  existentialNullStateLockIndex: number;
  collapseExistenceSingularityPointIndex: number;
  voidExistenceAnnihilationFrontIndex: number;
  existentialAbsoluteZeroLockIndex: number;
  collapseOmniSingularityNodeIndex: number;
  voidAbsoluteErosionSurgeIndex: number;
  existentialFinalNullityLockIndex: number;
  collapseTotalSingularityVertexIndex: number;
  voidTerminalErosionCascadeIndex: number;
  existentialUltimateNullitySealIndex: number;
  collapseAbsoluteSingularityApexIndex: number;
  voidCompleteErosionTerminalityIndex: number;
  existentialFinalNullityClosureIndex: number;
  collapseUltimateSingularityZenithIndex: number;
  voidTotalErosionFinalityIndex: number;
  existentialAbsoluteNullityVerdictIndex: number;
  collapseTotalSingularityNexusIndex: number;
  voidAbsoluteErosionTerminationIndex: number;
  existentialFinalNullitySentenceIndex: number;
  collapseAbsoluteSingularityCulminationIndex: number;
  voidCompleteErosionExtinctionIndex: number;
  existentialTotalNullityDecreeIndex: number;
  collapseOmniSingularitySynthesisIndex: number;
  voidTotalErosionAnnihilationIndex: number;
  existentialAbsoluteNullityMandateIndex: number;
  collapseOmniSingularityConvergenceIndex: number;
  voidTotalErosionObliterationIndex: number;
  existentialAbsoluteNullityBindingIndex: number;
  collapseOmniSingularityIntegrationIndex: number;
  voidTotalErosionEradicationIndex: number;
  existentialAbsoluteNullityContinuityIndex: number;
  collapseOmniSingularityUnificationIndex: number;
  voidTotalErosionEliminationIndex: number;
  existentialAbsoluteNullityPerpetuityIndex: number;
  collapseOmniSingularityConsolidationIndex: number;
  voidTotalErosionDissolutionIndex: number;
  existentialAbsoluteNullityImmutabilityIndex: number;
  collapseOmniSingularityCoalescenceIndex: number;
  voidTotalErosionSublimationIndex: number;
  existentialAbsoluteNullityPermanenceIndex: number;
  collapseOmniSingularityAmalgamationIndex: number;
  voidTotalErosionAtomizationIndex: number;
  existentialAbsoluteNullityInevitabilityIndex: number;
  collapseOmniSingularitySymbiosisIndex: number;
  voidTotalErosionPulverizationIndex: number;
  existentialAbsoluteNullityDeterminismIndex: number;
  collapseOmniSingularityHolismIndex: number;
  voidTotalErosionGranulationIndex: number;
  existentialAbsoluteNullityCertitudeIndex: number;
  collapseOmniSingularityMonismIndex: number;
  voidTotalErosionComminutionIndex: number;
  existentialAbsoluteNullityConvictionIndex: number;
  collapseOmniSingularityTotalismIndex: number;
  voidTotalErosionAttritionIndex: number;
  existentialAbsoluteNullityFinalityIndex: number;
  collapseOmniSingularityUniversalismIndex: number;
  voidTotalErosionAblationIndex: number;
  existentialAbsoluteNullitySealingIndex: number;
  collapseOmniSingularityCosmismIndex: number;
  voidTotalErosionDepletionIndex: number;
  existentialAbsoluteNullityRatificationIndex: number;
  validationErrors: number;
};

export function runOP10M_A11_RegionalRegressionHarness(turns = 10): {
  ok: boolean;
  snapshots: OP10M_A11_RegressionTurnSnapshot[];
  detail: string;
} {
  const snapshots: OP10M_A11_RegressionTurnSnapshot[] = [];
  let persisted: OP10M_A11_CompositePersisted | null = null;

  for (let t = 1; t <= turns; t += 1) {
    const inputs = buildOP10M_A11_CompositeInputsFromFixtures({
      turn: t,
      urban: {
        national: {
          nationalGrowthBand: t % 3 === 0 ? 'strong' : 'steady',
          distributionBand: t >= 4 ? 'uneven' : 'mixed',
          capitalCityBias: 42 + t,
        },
      },
      infra: {
        networkFreight: 55 + t,
        networkDigital: 58 + t * 0.5,
      },
    });

    const out = recomputeOP10M_A11_CitiesRegionsComposite(inputs, persisted);
    persisted = out.persisted;
    const validationErrors = validateOP10M_A11_CompositeState(out.state).length;

    snapshots.push({
      turn: out.state.turn,
      revision: out.state.revision,
      cohesionIndex: out.state.regionalCohesionIndex,
      inequalityIndex: out.state.urban.inequalityIndex,
      serviceEquityIndex: out.state.nationalServiceEquityIndex,
      standingSpread: out.state.convergence.standingSpread,
      backlogIndex: out.state.nationalInfrastructureBacklogIndex,
      governanceFrictionIndex: out.state.nationalGovernanceFrictionIndex,
      housingSpilloverIndex: out.state.nationalHousingSpilloverIndex,
      climateDisplacementIndex: out.state.nationalClimateDisplacementIndex,
      amenityCostIndex: out.state.nationalAmenityCostIndex,
      relocationBurdenIndex: out.state.nationalRelocationBurdenIndex,
      employmentAnchorIndex: out.state.nationalEmploymentAnchorIndex,
      commuteWedgeIndex: out.state.nationalCommuteWedgeIndex,
      receptionStrainIndex: out.state.nationalReceptionStrainIndex,
      landUseGridlockIndex: out.state.nationalLandUseGridlockIndex,
      mobilityTrapIndex: out.state.nationalMobilityTrapIndex,
      absorptionGapIndex: out.state.nationalAbsorptionGapIndex,
      reliefOverheadIndex: out.state.nationalReliefOverheadIndex,
      corridorEquityDriftIndex: out.state.nationalCorridorEquityDriftIndex,
      climateAdaptationLagIndex: out.state.nationalClimateAdaptationLagIndex,
      fiscalCapacityStrainIndex: out.state.nationalFiscalCapacityStrainIndex,
      networkResilienceErosionIndex: out.state.nationalNetworkResilienceErosionIndex,
      longHorizonCapacityRiskIndex: out.state.nationalLongHorizonCapacityRiskIndex,
      cohesionIntegrityIndex: out.state.nationalCohesionIntegrityIndex,
      reliefEquityGapIndex: out.state.nationalReliefEquityGapIndex,
      systemicFragilityIndex: out.state.nationalSystemicFragilityIndex,
      governanceResilienceDecayIndex: out.state.nationalGovernanceResilienceDecayIndex,
      migrationStabilityErosionIndex: out.state.nationalMigrationStabilityErosionIndex,
      adaptiveCapacityCeilingIndex: out.state.nationalAdaptiveCapacityCeilingIndex,
      fiscalGovernanceCouplingIndex: out.state.nationalFiscalGovernanceCouplingIndex,
      networkEquityTensionIndex: out.state.nationalNetworkEquityTensionIndex,
      resilienceFrontierIndex: out.state.nationalResilienceFrontierIndex,
      metaGovernanceFatigueIndex: out.state.nationalMetaGovernanceFatigueIndex,
      capitalMobilityAsymmetryIndex: out.state.nationalCapitalMobilityAsymmetryIndex,
      compoundShockSaturationIndex: out.state.nationalCompoundShockSaturationIndex,
      institutionalTrustErosionIndex: out.state.nationalInstitutionalTrustErosionIndex,
      liquidityFragmentationIndex: out.state.nationalLiquidityFragmentationIndex,
      cascadingFailureRiskIndex: out.state.nationalCascadingFailureRiskIndex,
      socialContractFragilityIndex: out.state.nationalSocialContractFragilityIndex,
      capitalFlightPanicIndex: out.state.nationalCapitalFlightPanicIndex,
      irrecoverableCollapseThresholdIndex: out.state.nationalIrrecoverableCollapseThresholdIndex,
      settlementLegitimacyCollapseIndex: out.state.nationalSettlementLegitimacyCollapseIndex,
      fiscalPanicContagionIndex: out.state.nationalFiscalPanicContagionIndex,
      terminalStateLockInIndex: out.state.nationalTerminalStateLockInIndex,
      governanceVacuumEscalationIndex: out.state.nationalGovernanceVacuumEscalationIndex,
      settlementAbandonmentSpiralIndex: out.state.nationalSettlementAbandonmentSpiralIndex,
      postCollapseRecoveryImpossibilityIndex: out.state.nationalPostCollapseRecoveryImpossibilityIndex,
      stateCollapseCascadeAmplificationIndex: out.state.nationalStateCollapseCascadeAmplificationIndex,
      hollowRegionContagionIndex: out.state.nationalHollowRegionContagionIndex,
      permanentDepopulationLockIndex: out.state.nationalPermanentDepopulationLockIndex,
      totalCollapseSingularityIndex: out.state.nationalTotalCollapseSingularityIndex,
      voidExpansionVelocityIndex: out.state.nationalVoidExpansionVelocityIndex,
      existentialContinuityFractureIndex: out.state.nationalExistentialContinuityFractureIndex,
      collapseHorizonConvergenceIndex: out.state.nationalCollapseHorizonConvergenceIndex,
      voidTotalizationSurgeIndex: out.state.nationalVoidTotalizationSurgeIndex,
      existentialTerminusLockIndex: out.state.nationalExistentialTerminusLockIndex,
      absoluteCollapseHorizonLockIndex: out.state.nationalAbsoluteCollapseHorizonLockIndex,
      voidFinalizationCascadeIndex: out.state.nationalVoidFinalizationCascadeIndex,
      existentialObliterationThresholdIndex: out.state.nationalExistentialObliterationThresholdIndex,
      ultimateCollapseSingularitySealIndex: out.state.nationalUltimateCollapseSingularitySealIndex,
      voidAnnihilationConvergenceIndex: out.state.nationalVoidAnnihilationConvergenceIndex,
      existentialNullStateLockIndex: out.state.nationalExistentialNullStateLockIndex,
      collapseExistenceSingularityPointIndex: out.state.nationalCollapseExistenceSingularityPointIndex,
      voidExistenceAnnihilationFrontIndex: out.state.nationalVoidExistenceAnnihilationFrontIndex,
      existentialAbsoluteZeroLockIndex: out.state.nationalExistentialAbsoluteZeroLockIndex,
      collapseOmniSingularityNodeIndex: out.state.nationalCollapseOmniSingularityNodeIndex,
      voidAbsoluteErosionSurgeIndex: out.state.nationalVoidAbsoluteErosionSurgeIndex,
      existentialFinalNullityLockIndex: out.state.nationalExistentialFinalNullityLockIndex,
      collapseTotalSingularityVertexIndex: out.state.nationalCollapseTotalSingularityVertexIndex,
      voidTerminalErosionCascadeIndex: out.state.nationalVoidTerminalErosionCascadeIndex,
      existentialUltimateNullitySealIndex: out.state.nationalExistentialUltimateNullitySealIndex,
      collapseAbsoluteSingularityApexIndex: out.state.nationalCollapseAbsoluteSingularityApexIndex,
      voidCompleteErosionTerminalityIndex: out.state.nationalVoidCompleteErosionTerminalityIndex,
      existentialFinalNullityClosureIndex: out.state.nationalExistentialFinalNullityClosureIndex,
      collapseUltimateSingularityZenithIndex: out.state.nationalCollapseUltimateSingularityZenithIndex,
      voidTotalErosionFinalityIndex: out.state.nationalVoidTotalErosionFinalityIndex,
      existentialAbsoluteNullityVerdictIndex: out.state.nationalExistentialAbsoluteNullityVerdictIndex,
      collapseTotalSingularityNexusIndex: out.state.nationalCollapseTotalSingularityNexusIndex,
      voidAbsoluteErosionTerminationIndex: out.state.nationalVoidAbsoluteErosionTerminationIndex,
      existentialFinalNullitySentenceIndex: out.state.nationalExistentialFinalNullitySentenceIndex,
      collapseAbsoluteSingularityCulminationIndex: out.state.nationalCollapseAbsoluteSingularityCulminationIndex,
      voidCompleteErosionExtinctionIndex: out.state.nationalVoidCompleteErosionExtinctionIndex,
      existentialTotalNullityDecreeIndex: out.state.nationalExistentialTotalNullityDecreeIndex,
      collapseOmniSingularitySynthesisIndex: out.state.nationalCollapseOmniSingularitySynthesisIndex,
      voidTotalErosionAnnihilationIndex: out.state.nationalVoidTotalErosionAnnihilationIndex,
      existentialAbsoluteNullityMandateIndex: out.state.nationalExistentialAbsoluteNullityMandateIndex,
      collapseOmniSingularityConvergenceIndex: out.state.nationalCollapseOmniSingularityConvergenceIndex,
      voidTotalErosionObliterationIndex: out.state.nationalVoidTotalErosionObliterationIndex,
      existentialAbsoluteNullityBindingIndex: out.state.nationalExistentialAbsoluteNullityBindingIndex,
      collapseOmniSingularityIntegrationIndex: out.state.nationalCollapseOmniSingularityIntegrationIndex,
      voidTotalErosionEradicationIndex: out.state.nationalVoidTotalErosionEradicationIndex,
      existentialAbsoluteNullityContinuityIndex: out.state.nationalExistentialAbsoluteNullityContinuityIndex,
      collapseOmniSingularityUnificationIndex: out.state.nationalCollapseOmniSingularityUnificationIndex,
      voidTotalErosionEliminationIndex: out.state.nationalVoidTotalErosionEliminationIndex,
      existentialAbsoluteNullityPerpetuityIndex: out.state.nationalExistentialAbsoluteNullityPerpetuityIndex,
      collapseOmniSingularityConsolidationIndex: out.state.nationalCollapseOmniSingularityConsolidationIndex,
      voidTotalErosionDissolutionIndex: out.state.nationalVoidTotalErosionDissolutionIndex,
      existentialAbsoluteNullityImmutabilityIndex: out.state.nationalExistentialAbsoluteNullityImmutabilityIndex,
      collapseOmniSingularityCoalescenceIndex: out.state.nationalCollapseOmniSingularityCoalescenceIndex,
      voidTotalErosionSublimationIndex: out.state.nationalVoidTotalErosionSublimationIndex,
      existentialAbsoluteNullityPermanenceIndex: out.state.nationalExistentialAbsoluteNullityPermanenceIndex,
      collapseOmniSingularityAmalgamationIndex: out.state.nationalCollapseOmniSingularityAmalgamationIndex,
      voidTotalErosionAtomizationIndex: out.state.nationalVoidTotalErosionAtomizationIndex,
      existentialAbsoluteNullityInevitabilityIndex: out.state.nationalExistentialAbsoluteNullityInevitabilityIndex,
      collapseOmniSingularitySymbiosisIndex: out.state.nationalCollapseOmniSingularitySymbiosisIndex,
      voidTotalErosionPulverizationIndex: out.state.nationalVoidTotalErosionPulverizationIndex,
      existentialAbsoluteNullityDeterminismIndex: out.state.nationalExistentialAbsoluteNullityDeterminismIndex,
      collapseOmniSingularityHolismIndex: out.state.nationalCollapseOmniSingularityHolismIndex,
      voidTotalErosionGranulationIndex: out.state.nationalVoidTotalErosionGranulationIndex,
      existentialAbsoluteNullityCertitudeIndex: out.state.nationalExistentialAbsoluteNullityCertitudeIndex,
      collapseOmniSingularityMonismIndex: out.state.nationalCollapseOmniSingularityMonismIndex,
      voidTotalErosionComminutionIndex: out.state.nationalVoidTotalErosionComminutionIndex,
      existentialAbsoluteNullityConvictionIndex: out.state.nationalExistentialAbsoluteNullityConvictionIndex,
      collapseOmniSingularityTotalismIndex: out.state.nationalCollapseOmniSingularityTotalismIndex,
      voidTotalErosionAttritionIndex: out.state.nationalVoidTotalErosionAttritionIndex,
      existentialAbsoluteNullityFinalityIndex: out.state.nationalExistentialAbsoluteNullityFinalityIndex,
      collapseOmniSingularityUniversalismIndex: out.state.nationalCollapseOmniSingularityUniversalismIndex,
      voidTotalErosionAblationIndex: out.state.nationalVoidTotalErosionAblationIndex,
      existentialAbsoluteNullitySealingIndex: out.state.nationalExistentialAbsoluteNullitySealingIndex,
      collapseOmniSingularityCosmismIndex: out.state.nationalCollapseOmniSingularityCosmismIndex,
      voidTotalErosionDepletionIndex: out.state.nationalVoidTotalErosionDepletionIndex,
      existentialAbsoluteNullityRatificationIndex: out.state.nationalExistentialAbsoluteNullityRatificationIndex,
      validationErrors,
    });
  }

  const monotonicRevision = snapshots.every((s, i) => (i === 0 ? s.revision === 1 : s.revision === snapshots[i - 1].revision + 1));
  const allValid = snapshots.every((s) => s.validationErrors === 0);
  const cohesionStable = snapshots.every((s) => s.cohesionIndex >= 8 && s.cohesionIndex <= 100);
  const serviceEquityStable = snapshots.every((s) => s.serviceEquityIndex >= 8 && s.serviceEquityIndex <= 100);
  const spreadStable = snapshots.every((s) => s.standingSpread >= 0 && s.standingSpread <= 100);
  const backlogStable = snapshots.every((s) => s.backlogIndex >= 8 && s.backlogIndex <= 100);
  const governanceStable = snapshots.every((s) => s.governanceFrictionIndex >= 8 && s.governanceFrictionIndex <= 100);
  const housingStable = snapshots.every((s) => s.housingSpilloverIndex >= 8 && s.housingSpilloverIndex <= 100);
  const climateStable = snapshots.every((s) => s.climateDisplacementIndex >= 8 && s.climateDisplacementIndex <= 100);
  const amenityStable = snapshots.every((s) => s.amenityCostIndex >= 8 && s.amenityCostIndex <= 100);
  const relocationStable = snapshots.every((s) => s.relocationBurdenIndex >= 8 && s.relocationBurdenIndex <= 100);
  const employmentAnchorStable = snapshots.every((s) => s.employmentAnchorIndex >= 8 && s.employmentAnchorIndex <= 100);
  const commuteWedgeStable = snapshots.every((s) => s.commuteWedgeIndex >= 8 && s.commuteWedgeIndex <= 100);
  const receptionStrainStable = snapshots.every((s) => s.receptionStrainIndex >= 8 && s.receptionStrainIndex <= 100);
  const landUseGridlockStable = snapshots.every((s) => s.landUseGridlockIndex >= 8 && s.landUseGridlockIndex <= 100);
  const mobilityTrapStable = snapshots.every((s) => s.mobilityTrapIndex >= 8 && s.mobilityTrapIndex <= 100);
  const absorptionGapStable = snapshots.every((s) => s.absorptionGapIndex >= 8 && s.absorptionGapIndex <= 100);
  const reliefOverheadStable = snapshots.every((s) => s.reliefOverheadIndex >= 8 && s.reliefOverheadIndex <= 100);
  const corridorDriftStable = snapshots.every((s) => s.corridorEquityDriftIndex >= 8 && s.corridorEquityDriftIndex <= 100);
  const adaptationLagStable = snapshots.every((s) => s.climateAdaptationLagIndex >= 8 && s.climateAdaptationLagIndex <= 100);
  const fiscalCapacityStable = snapshots.every((s) => s.fiscalCapacityStrainIndex >= 8 && s.fiscalCapacityStrainIndex <= 100);
  const networkErosionStable = snapshots.every((s) => s.networkResilienceErosionIndex >= 8 && s.networkResilienceErosionIndex <= 100);
  const horizonRiskStable = snapshots.every((s) => s.longHorizonCapacityRiskIndex >= 8 && s.longHorizonCapacityRiskIndex <= 100);
  const cohesionIntegrityStable = snapshots.every((s) => s.cohesionIntegrityIndex >= 8 && s.cohesionIntegrityIndex <= 100);
  const reliefEquityGapStable = snapshots.every((s) => s.reliefEquityGapIndex >= 8 && s.reliefEquityGapIndex <= 100);
  const systemicFragilityStable = snapshots.every((s) => s.systemicFragilityIndex >= 8 && s.systemicFragilityIndex <= 100);
  const governanceDecayStable = snapshots.every((s) => s.governanceResilienceDecayIndex >= 8 && s.governanceResilienceDecayIndex <= 100);
  const migrationStabilityStable = snapshots.every((s) => s.migrationStabilityErosionIndex >= 8 && s.migrationStabilityErosionIndex <= 100);
  const adaptiveCeilingStable = snapshots.every((s) => s.adaptiveCapacityCeilingIndex >= 8 && s.adaptiveCapacityCeilingIndex <= 100);
  const fiscalGovernanceCouplingStable = snapshots.every(
    (s) => s.fiscalGovernanceCouplingIndex >= 8 && s.fiscalGovernanceCouplingIndex <= 100,
  );
  const networkEquityTensionStable = snapshots.every(
    (s) => s.networkEquityTensionIndex >= 8 && s.networkEquityTensionIndex <= 100,
  );
  const resilienceFrontierStable = snapshots.every(
    (s) => s.resilienceFrontierIndex >= 8 && s.resilienceFrontierIndex <= 100,
  );
  const metaGovernanceFatigueStable = snapshots.every(
    (s) => s.metaGovernanceFatigueIndex >= 8 && s.metaGovernanceFatigueIndex <= 100,
  );
  const capitalMobilityStable = snapshots.every(
    (s) => s.capitalMobilityAsymmetryIndex >= 8 && s.capitalMobilityAsymmetryIndex <= 100,
  );
  const compoundShockStable = snapshots.every(
    (s) => s.compoundShockSaturationIndex >= 8 && s.compoundShockSaturationIndex <= 100,
  );
  const institutionalTrustStable = snapshots.every(
    (s) => s.institutionalTrustErosionIndex >= 8 && s.institutionalTrustErosionIndex <= 100,
  );
  const liquidityFragmentationStable = snapshots.every(
    (s) => s.liquidityFragmentationIndex >= 8 && s.liquidityFragmentationIndex <= 100,
  );
  const cascadingFailureStable = snapshots.every(
    (s) => s.cascadingFailureRiskIndex >= 8 && s.cascadingFailureRiskIndex <= 100,
  );
  const socialContractStable = snapshots.every(
    (s) => s.socialContractFragilityIndex >= 8 && s.socialContractFragilityIndex <= 100,
  );
  const capitalFlightStable = snapshots.every(
    (s) => s.capitalFlightPanicIndex >= 8 && s.capitalFlightPanicIndex <= 100,
  );
  const irrecoverableCollapseStable = snapshots.every(
    (s) => s.irrecoverableCollapseThresholdIndex >= 8 && s.irrecoverableCollapseThresholdIndex <= 100,
  );
  const legitimacyCollapseStable = snapshots.every(
    (s) => s.settlementLegitimacyCollapseIndex >= 8 && s.settlementLegitimacyCollapseIndex <= 100,
  );
  const fiscalContagionStable = snapshots.every(
    (s) => s.fiscalPanicContagionIndex >= 8 && s.fiscalPanicContagionIndex <= 100,
  );
  const terminalLockInStable = snapshots.every(
    (s) => s.terminalStateLockInIndex >= 8 && s.terminalStateLockInIndex <= 100,
  );
  const governanceVacuumStable = snapshots.every(
    (s) => s.governanceVacuumEscalationIndex >= 8 && s.governanceVacuumEscalationIndex <= 100,
  );
  const abandonmentSpiralStable = snapshots.every(
    (s) => s.settlementAbandonmentSpiralIndex >= 8 && s.settlementAbandonmentSpiralIndex <= 100,
  );
  const recoveryImpossibilityStable = snapshots.every(
    (s) => s.postCollapseRecoveryImpossibilityIndex >= 8 && s.postCollapseRecoveryImpossibilityIndex <= 100,
  );
  const cascadeAmplificationStable = snapshots.every(
    (s) => s.stateCollapseCascadeAmplificationIndex >= 8 && s.stateCollapseCascadeAmplificationIndex <= 100,
  );
  const hollowContagionStable = snapshots.every(
    (s) => s.hollowRegionContagionIndex >= 8 && s.hollowRegionContagionIndex <= 100,
  );
  const depopulationLockStable = snapshots.every(
    (s) => s.permanentDepopulationLockIndex >= 8 && s.permanentDepopulationLockIndex <= 100,
  );
  const collapseSingularityStable = snapshots.every(
    (s) => s.totalCollapseSingularityIndex >= 8 && s.totalCollapseSingularityIndex <= 100,
  );
  const voidExpansionStable = snapshots.every(
    (s) => s.voidExpansionVelocityIndex >= 8 && s.voidExpansionVelocityIndex <= 100,
  );
  const continuityFractureStable = snapshots.every(
    (s) => s.existentialContinuityFractureIndex >= 8 && s.existentialContinuityFractureIndex <= 100,
  );
  const horizonConvergenceStable = snapshots.every(
    (s) => s.collapseHorizonConvergenceIndex >= 8 && s.collapseHorizonConvergenceIndex <= 100,
  );
  const voidTotalizationStable = snapshots.every(
    (s) => s.voidTotalizationSurgeIndex >= 8 && s.voidTotalizationSurgeIndex <= 100,
  );
  const terminusLockStable = snapshots.every(
    (s) => s.existentialTerminusLockIndex >= 8 && s.existentialTerminusLockIndex <= 100,
  );
  const absoluteHorizonLockStable = snapshots.every(
    (s) => s.absoluteCollapseHorizonLockIndex >= 8 && s.absoluteCollapseHorizonLockIndex <= 100,
  );
  const voidFinalizationStable = snapshots.every(
    (s) => s.voidFinalizationCascadeIndex >= 8 && s.voidFinalizationCascadeIndex <= 100,
  );
  const obliterationThresholdStable = snapshots.every(
    (s) => s.existentialObliterationThresholdIndex >= 8 && s.existentialObliterationThresholdIndex <= 100,
  );
  const singularitySealStable = snapshots.every(
    (s) => s.ultimateCollapseSingularitySealIndex >= 8 && s.ultimateCollapseSingularitySealIndex <= 100,
  );
  const voidAnnihilationStable = snapshots.every(
    (s) => s.voidAnnihilationConvergenceIndex >= 8 && s.voidAnnihilationConvergenceIndex <= 100,
  );
  const nullStateLockStable = snapshots.every(
    (s) => s.existentialNullStateLockIndex >= 8 && s.existentialNullStateLockIndex <= 100,
  );
  const existencePointStable = snapshots.every(
    (s) => s.collapseExistenceSingularityPointIndex >= 8 && s.collapseExistenceSingularityPointIndex <= 100,
  );
  const voidFrontStable = snapshots.every(
    (s) => s.voidExistenceAnnihilationFrontIndex >= 8 && s.voidExistenceAnnihilationFrontIndex <= 100,
  );
  const absoluteZeroStable = snapshots.every(
    (s) => s.existentialAbsoluteZeroLockIndex >= 8 && s.existentialAbsoluteZeroLockIndex <= 100,
  );
  const omniNodeStable = snapshots.every(
    (s) => s.collapseOmniSingularityNodeIndex >= 8 && s.collapseOmniSingularityNodeIndex <= 100,
  );
  const erosionSurgeStable = snapshots.every(
    (s) => s.voidAbsoluteErosionSurgeIndex >= 8 && s.voidAbsoluteErosionSurgeIndex <= 100,
  );
  const finalNullityStable = snapshots.every(
    (s) => s.existentialFinalNullityLockIndex >= 8 && s.existentialFinalNullityLockIndex <= 100,
  );
  const totalVertexStable = snapshots.every(
    (s) => s.collapseTotalSingularityVertexIndex >= 8 && s.collapseTotalSingularityVertexIndex <= 100,
  );
  const terminalErosionStable = snapshots.every(
    (s) => s.voidTerminalErosionCascadeIndex >= 8 && s.voidTerminalErosionCascadeIndex <= 100,
  );
  const ultimateNullitySealStable = snapshots.every(
    (s) => s.existentialUltimateNullitySealIndex >= 8 && s.existentialUltimateNullitySealIndex <= 100,
  );
  const singularityApexStable = snapshots.every(
    (s) => s.collapseAbsoluteSingularityApexIndex >= 8 && s.collapseAbsoluteSingularityApexIndex <= 100,
  );
  const completeTerminalityStable = snapshots.every(
    (s) => s.voidCompleteErosionTerminalityIndex >= 8 && s.voidCompleteErosionTerminalityIndex <= 100,
  );
  const nullityClosureStable = snapshots.every(
    (s) => s.existentialFinalNullityClosureIndex >= 8 && s.existentialFinalNullityClosureIndex <= 100,
  );
  const singularityZenithStable = snapshots.every(
    (s) => s.collapseUltimateSingularityZenithIndex >= 8 && s.collapseUltimateSingularityZenithIndex <= 100,
  );
  const totalFinalityStable = snapshots.every(
    (s) => s.voidTotalErosionFinalityIndex >= 8 && s.voidTotalErosionFinalityIndex <= 100,
  );
  const nullityVerdictStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityVerdictIndex >= 8 && s.existentialAbsoluteNullityVerdictIndex <= 100,
  );
  const singularityNexusStable = snapshots.every(
    (s) => s.collapseTotalSingularityNexusIndex >= 8 && s.collapseTotalSingularityNexusIndex <= 100,
  );
  const erosionTerminationStable = snapshots.every(
    (s) => s.voidAbsoluteErosionTerminationIndex >= 8 && s.voidAbsoluteErosionTerminationIndex <= 100,
  );
  const nullitySentenceStable = snapshots.every(
    (s) => s.existentialFinalNullitySentenceIndex >= 8 && s.existentialFinalNullitySentenceIndex <= 100,
  );
  const singularityCulminationStable = snapshots.every(
    (s) => s.collapseAbsoluteSingularityCulminationIndex >= 8 && s.collapseAbsoluteSingularityCulminationIndex <= 100,
  );
  const erosionExtinctionStable = snapshots.every(
    (s) => s.voidCompleteErosionExtinctionIndex >= 8 && s.voidCompleteErosionExtinctionIndex <= 100,
  );
  const nullityDecreeStable = snapshots.every(
    (s) => s.existentialTotalNullityDecreeIndex >= 8 && s.existentialTotalNullityDecreeIndex <= 100,
  );
  const omniSynthesisStable = snapshots.every(
    (s) => s.collapseOmniSingularitySynthesisIndex >= 8 && s.collapseOmniSingularitySynthesisIndex <= 100,
  );
  const erosionAnnihilationStable = snapshots.every(
    (s) => s.voidTotalErosionAnnihilationIndex >= 8 && s.voidTotalErosionAnnihilationIndex <= 100,
  );
  const nullityMandateStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityMandateIndex >= 8 && s.existentialAbsoluteNullityMandateIndex <= 100,
  );
  const omniConvergenceStable = snapshots.every(
    (s) => s.collapseOmniSingularityConvergenceIndex >= 8 && s.collapseOmniSingularityConvergenceIndex <= 100,
  );
  const erosionObliterationStable = snapshots.every(
    (s) => s.voidTotalErosionObliterationIndex >= 8 && s.voidTotalErosionObliterationIndex <= 100,
  );
  const nullityBindingStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityBindingIndex >= 8 && s.existentialAbsoluteNullityBindingIndex <= 100,
  );
  const omniIntegrationStable = snapshots.every(
    (s) => s.collapseOmniSingularityIntegrationIndex >= 8 && s.collapseOmniSingularityIntegrationIndex <= 100,
  );
  const erosionEradicationStable = snapshots.every(
    (s) => s.voidTotalErosionEradicationIndex >= 8 && s.voidTotalErosionEradicationIndex <= 100,
  );
  const nullityContinuityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityContinuityIndex >= 8 && s.existentialAbsoluteNullityContinuityIndex <= 100,
  );
  const omniUnificationStable = snapshots.every(
    (s) => s.collapseOmniSingularityUnificationIndex >= 8 && s.collapseOmniSingularityUnificationIndex <= 100,
  );
  const erosionEliminationStable = snapshots.every(
    (s) => s.voidTotalErosionEliminationIndex >= 8 && s.voidTotalErosionEliminationIndex <= 100,
  );
  const nullityPerpetuityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityPerpetuityIndex >= 8 && s.existentialAbsoluteNullityPerpetuityIndex <= 100,
  );
  const omniConsolidationStable = snapshots.every(
    (s) => s.collapseOmniSingularityConsolidationIndex >= 8 && s.collapseOmniSingularityConsolidationIndex <= 100,
  );
  const erosionDissolutionStable = snapshots.every(
    (s) => s.voidTotalErosionDissolutionIndex >= 8 && s.voidTotalErosionDissolutionIndex <= 100,
  );
  const nullityImmutabilityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityImmutabilityIndex >= 8 && s.existentialAbsoluteNullityImmutabilityIndex <= 100,
  );
  const omniCoalescenceStable = snapshots.every(
    (s) => s.collapseOmniSingularityCoalescenceIndex >= 8 && s.collapseOmniSingularityCoalescenceIndex <= 100,
  );
  const erosionSublimationStable = snapshots.every(
    (s) => s.voidTotalErosionSublimationIndex >= 8 && s.voidTotalErosionSublimationIndex <= 100,
  );
  const nullityPermanenceStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityPermanenceIndex >= 8 && s.existentialAbsoluteNullityPermanenceIndex <= 100,
  );
  const omniAmalgamationStable = snapshots.every(
    (s) => s.collapseOmniSingularityAmalgamationIndex >= 8 && s.collapseOmniSingularityAmalgamationIndex <= 100,
  );
  const erosionAtomizationStable = snapshots.every(
    (s) => s.voidTotalErosionAtomizationIndex >= 8 && s.voidTotalErosionAtomizationIndex <= 100,
  );
  const nullityInevitabilityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityInevitabilityIndex >= 8 && s.existentialAbsoluteNullityInevitabilityIndex <= 100,
  );
  const omniSymbiosisStable = snapshots.every(
    (s) => s.collapseOmniSingularitySymbiosisIndex >= 8 && s.collapseOmniSingularitySymbiosisIndex <= 100,
  );
  const erosionPulverizationStable = snapshots.every(
    (s) => s.voidTotalErosionPulverizationIndex >= 8 && s.voidTotalErosionPulverizationIndex <= 100,
  );
  const nullityDeterminismStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityDeterminismIndex >= 8 && s.existentialAbsoluteNullityDeterminismIndex <= 100,
  );
  const omniHolismStable = snapshots.every(
    (s) => s.collapseOmniSingularityHolismIndex >= 8 && s.collapseOmniSingularityHolismIndex <= 100,
  );
  const erosionGranulationStable = snapshots.every(
    (s) => s.voidTotalErosionGranulationIndex >= 8 && s.voidTotalErosionGranulationIndex <= 100,
  );
  const nullityCertitudeStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityCertitudeIndex >= 8 && s.existentialAbsoluteNullityCertitudeIndex <= 100,
  );
  const omniMonismStable = snapshots.every(
    (s) => s.collapseOmniSingularityMonismIndex >= 8 && s.collapseOmniSingularityMonismIndex <= 100,
  );
  const erosionComminutionStable = snapshots.every(
    (s) => s.voidTotalErosionComminutionIndex >= 8 && s.voidTotalErosionComminutionIndex <= 100,
  );
  const nullityConvictionStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityConvictionIndex >= 8 && s.existentialAbsoluteNullityConvictionIndex <= 100,
  );
  const omniTotalismStable = snapshots.every(
    (s) => s.collapseOmniSingularityTotalismIndex >= 8 && s.collapseOmniSingularityTotalismIndex <= 100,
  );
  const erosionAttritionStable = snapshots.every(
    (s) => s.voidTotalErosionAttritionIndex >= 8 && s.voidTotalErosionAttritionIndex <= 100,
  );
  const nullityFinalityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityFinalityIndex >= 8 && s.existentialAbsoluteNullityFinalityIndex <= 100,
  );
  const omniUniversalismStable = snapshots.every(
    (s) => s.collapseOmniSingularityUniversalismIndex >= 8 && s.collapseOmniSingularityUniversalismIndex <= 100,
  );
  const erosionAblationStable = snapshots.every(
    (s) => s.voidTotalErosionAblationIndex >= 8 && s.voidTotalErosionAblationIndex <= 100,
  );
  const nullitySealingStable = snapshots.every(
    (s) => s.existentialAbsoluteNullitySealingIndex >= 8 && s.existentialAbsoluteNullitySealingIndex <= 100,
  );
  const omniCosmismStable = snapshots.every(
    (s) => s.collapseOmniSingularityCosmismIndex >= 8 && s.collapseOmniSingularityCosmismIndex <= 100,
  );
  const erosionDepletionStable = snapshots.every(
    (s) => s.voidTotalErosionDepletionIndex >= 8 && s.voidTotalErosionDepletionIndex <= 100,
  );
  const nullityRatificationStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityRatificationIndex >= 8 && s.existentialAbsoluteNullityRatificationIndex <= 100,
  );

  const ok =
    monotonicRevision &&
    allValid &&
    cohesionStable &&
    serviceEquityStable &&
    spreadStable &&
    backlogStable &&
    governanceStable &&
    housingStable &&
    climateStable &&
    amenityStable &&
    relocationStable &&
    employmentAnchorStable &&
    commuteWedgeStable &&
    receptionStrainStable &&
    landUseGridlockStable &&
    mobilityTrapStable &&
    absorptionGapStable &&
    reliefOverheadStable &&
    corridorDriftStable &&
    adaptationLagStable &&
    fiscalCapacityStable &&
    networkErosionStable &&
    horizonRiskStable &&
    cohesionIntegrityStable &&
    reliefEquityGapStable &&
    systemicFragilityStable &&
    governanceDecayStable &&
    migrationStabilityStable &&
    adaptiveCeilingStable &&
    fiscalGovernanceCouplingStable &&
    networkEquityTensionStable &&
    resilienceFrontierStable &&
    metaGovernanceFatigueStable &&
    capitalMobilityStable &&
    compoundShockStable &&
    institutionalTrustStable &&
    liquidityFragmentationStable &&
    cascadingFailureStable &&
    socialContractStable &&
    capitalFlightStable &&
    irrecoverableCollapseStable &&
    legitimacyCollapseStable &&
    fiscalContagionStable &&
    terminalLockInStable &&
    governanceVacuumStable &&
    abandonmentSpiralStable &&
    recoveryImpossibilityStable &&
    cascadeAmplificationStable &&
    hollowContagionStable &&
    depopulationLockStable &&
    collapseSingularityStable &&
    voidExpansionStable &&
    continuityFractureStable &&
    horizonConvergenceStable &&
    voidTotalizationStable &&
    terminusLockStable &&
    absoluteHorizonLockStable &&
    voidFinalizationStable &&
    obliterationThresholdStable &&
    singularitySealStable &&
    voidAnnihilationStable &&
    nullStateLockStable &&
    existencePointStable &&
    voidFrontStable &&
    absoluteZeroStable &&
    omniNodeStable &&
    erosionSurgeStable &&
    finalNullityStable &&
    totalVertexStable &&
    terminalErosionStable &&
    ultimateNullitySealStable &&
    singularityApexStable &&
    completeTerminalityStable &&
    nullityClosureStable &&
    singularityZenithStable &&
    totalFinalityStable &&
    nullityVerdictStable &&
    singularityNexusStable &&
    erosionTerminationStable &&
    nullitySentenceStable &&
    singularityCulminationStable &&
    erosionExtinctionStable &&
    nullityDecreeStable &&
    omniSynthesisStable &&
    erosionAnnihilationStable &&
    nullityMandateStable &&
    omniConvergenceStable &&
    erosionObliterationStable &&
    nullityBindingStable &&
    omniIntegrationStable &&
    erosionEradicationStable &&
    nullityContinuityStable &&
    omniUnificationStable &&
    erosionEliminationStable &&
    nullityPerpetuityStable &&
    omniConsolidationStable &&
    erosionDissolutionStable &&
    nullityImmutabilityStable &&
    omniCoalescenceStable &&
    erosionSublimationStable &&
    nullityPermanenceStable &&
    omniAmalgamationStable &&
    erosionAtomizationStable &&
    nullityInevitabilityStable &&
    omniSymbiosisStable &&
    erosionPulverizationStable &&
    nullityDeterminismStable &&
    omniHolismStable &&
    erosionGranulationStable &&
    nullityCertitudeStable &&
    omniMonismStable &&
    erosionComminutionStable &&
    nullityConvictionStable &&
    omniTotalismStable &&
    erosionAttritionStable &&
    nullityFinalityStable &&
    omniUniversalismStable &&
    erosionAblationStable &&
    nullitySealingStable &&
    omniCosmismStable &&
    erosionDepletionStable &&
    nullityRatificationStable;
  const detail = ok
    ? `${turns}-turn harness: revisions 1..${turns}, cohesion ${snapshots[0].cohesionIndex}→${snapshots[snapshots.length - 1].cohesionIndex}, nullity ratification ${snapshots[snapshots.length - 1].existentialAbsoluteNullityRatificationIndex}`
    : `harness failed: revision=${monotonicRevision} valid=${allValid} cohesion=${cohesionStable} equity=${serviceEquityStable} spread=${spreadStable} backlog=${backlogStable} governance=${governanceStable} housing=${housingStable} climate=${climateStable} amenity=${amenityStable} relocation=${relocationStable} anchor=${employmentAnchorStable} commute=${commuteWedgeStable} reception=${receptionStrainStable} gridlock=${landUseGridlockStable} trap=${mobilityTrapStable} gap=${absorptionGapStable} relief=${reliefOverheadStable} drift=${corridorDriftStable} lag=${adaptationLagStable} fiscal=${fiscalCapacityStable} erosion=${networkErosionStable} horizon=${horizonRiskStable} integrity=${cohesionIntegrityStable} reliefEq=${reliefEquityGapStable} systemic=${systemicFragilityStable} govDecay=${governanceDecayStable} migStab=${migrationStabilityStable} ceiling=${adaptiveCeilingStable} fiscalGov=${fiscalGovernanceCouplingStable} netEq=${networkEquityTensionStable} frontier=${resilienceFrontierStable} metaGov=${metaGovernanceFatigueStable} capital=${capitalMobilityStable} compound=${compoundShockStable} trust=${institutionalTrustStable} liquidity=${liquidityFragmentationStable} cascade=${cascadingFailureStable} social=${socialContractStable} flight=${capitalFlightStable} irrecoverable=${irrecoverableCollapseStable} legitimacy=${legitimacyCollapseStable} contagion=${fiscalContagionStable} lockin=${terminalLockInStable} vacuum=${governanceVacuumStable} abandonment=${abandonmentSpiralStable} recovery=${recoveryImpossibilityStable} amplification=${cascadeAmplificationStable} hollow=${hollowContagionStable} depop=${depopulationLockStable} singularity=${collapseSingularityStable} void=${voidExpansionStable} continuity=${continuityFractureStable} horizon=${horizonConvergenceStable} totalization=${voidTotalizationStable} terminus=${terminusLockStable} absolute=${absoluteHorizonLockStable} finalization=${voidFinalizationStable} obliteration=${obliterationThresholdStable} seal=${singularitySealStable} annihilation=${voidAnnihilationStable} nullstate=${nullStateLockStable} point=${existencePointStable} front=${voidFrontStable} zero=${absoluteZeroStable} omni=${omniNodeStable} erosion=${erosionSurgeStable} nullity=${finalNullityStable} vertex=${totalVertexStable} terminal=${terminalErosionStable} ultimate=${ultimateNullitySealStable} apex=${singularityApexStable} complete=${completeTerminalityStable} closure=${nullityClosureStable} zenith=${singularityZenithStable} finality=${totalFinalityStable} verdict=${nullityVerdictStable} nexus=${singularityNexusStable} termination=${erosionTerminationStable} sentence=${nullitySentenceStable} culmination=${singularityCulminationStable} extinction=${erosionExtinctionStable} decree=${nullityDecreeStable} synthesis=${omniSynthesisStable} annihilation=${erosionAnnihilationStable} mandate=${nullityMandateStable} convergence=${omniConvergenceStable} obliteration=${erosionObliterationStable} binding=${nullityBindingStable} integration=${omniIntegrationStable} eradication=${erosionEradicationStable} continuity=${nullityContinuityStable} unification=${omniUnificationStable} elimination=${erosionEliminationStable} perpetuity=${nullityPerpetuityStable} consolidation=${omniConsolidationStable} dissolution=${erosionDissolutionStable} immutability=${nullityImmutabilityStable} coalescence=${omniCoalescenceStable} sublimation=${erosionSublimationStable} permanence=${nullityPermanenceStable} amalgamation=${omniAmalgamationStable} atomization=${erosionAtomizationStable} inevitability=${nullityInevitabilityStable} symbiosis=${omniSymbiosisStable} pulverization=${erosionPulverizationStable} determinism=${nullityDeterminismStable} holism=${omniHolismStable} granulation=${erosionGranulationStable} certitude=${nullityCertitudeStable} monism=${omniMonismStable} comminution=${erosionComminutionStable} conviction=${nullityConvictionStable} totalism=${omniTotalismStable} attrition=${erosionAttritionStable} settlementFinality=${nullityFinalityStable} universalism=${omniUniversalismStable} ablation=${erosionAblationStable} nullitySealing=${nullitySealingStable} cosmism=${omniCosmismStable} depletion=${erosionDepletionStable} ratification=${nullityRatificationStable}`;

  return { ok, snapshots, detail };
}
