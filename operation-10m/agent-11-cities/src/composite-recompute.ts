import { op10mA11HashInputs } from './constants.ts';
import { op10mA11BuildReliefPlaybook } from './relief-playbook.ts';
import {
  op10mA11BuildRegionalLinkageMatrix,
  op10mA11LinkageFragilityIndex,
  op10mA11RegionsWithWeakLinkage,
} from './regional-linkage-matrix.ts';
import {
  buildOP10M_A11_InfraInputsFromFixtures,
  createEmptyOP10M_A11_InfraPersisted,
  recomputeOP10M_A11_IntercityInfraLayer,
} from './recompute-intercity-infra.ts';
import {
  buildOP10M_A11_InputsFromFixtures,
  createEmptyOP10M_A11_Persisted,
  recomputeOP10M_A11_RegionalUrbanLayer,
} from './recompute.ts';
import {
  OP10M_A11_COMPOSITE_SCHEMA_VERSION,
  type OP10M_A11_CompositeDerivedEvent,
  type OP10M_A11_CompositeInputs,
  type OP10M_A11_CompositePersisted,
  type OP10M_A11_CompositeState,
  type OP10M_A11_RegionId,
} from './types.ts';
import { op10mA11ComputeUrbanHierarchy, op10mA11NationalPrimateIndex } from './urban-hierarchy.ts';
import {
  op10mA11ComputeCorridorFlows,
  op10mA11MaxCorridorFlow,
  op10mA11SurgeCorridors,
} from './urban-corridor-flow.ts';
import {
  op10mA11AnalyzeLinkageHubs,
  op10mA11DeeplyIsolatedRegions,
  op10mA11OverloadedHubs,
} from './linkage-hub-centrality.ts';
import {
  op10mA11ComputeFiscalUrbanCoupling,
  op10mA11MisalignedFiscalRegions,
  op10mA11RegionalCohesionIndex,
} from './fiscal-urban-coupling.ts';
import {
  op10mA11ComputeMigrationPressure,
  op10mA11RegionsWithMigrationSurge,
} from './regional-migration-pressure.ts';
import {
  op10mA11ComputeSettlementVulnerability,
  op10mA11CriticalSettlementRegions,
} from './settlement-vulnerability.ts';
import {
  op10mA11ComputeMetropolitanAbsorptionStress,
  op10mA11NationalMetropolitanSaturation,
  op10mA11RegionsWithAbsorptionBreach,
} from './metropolitan-absorption-stress.ts';
import {
  op10mA11ComputeRegionalServiceEquity,
  op10mA11RegionsWithServiceEquityGap,
} from './regional-service-equity.ts';
import {
  op10mA11ComputeRegionalConvergence,
  op10mA11ConvergenceStalled,
  op10mA11LaggingRegionsNotClosing,
  op10mA11StandingSpread,
} from './regional-convergence-velocity.ts';
import {
  op10mA11ComputePeriUrbanExpansionPressure,
  op10mA11NationalPeriUrbanPressureIndex,
  op10mA11RegionsWithPeriUrbanSprawl,
} from './peri-urban-expansion-pressure.ts';
import {
  op10mA11ComputeRegionalInfrastructureBacklog,
  op10mA11RegionsWithCriticalBacklog,
} from './regional-infrastructure-backlog.ts';
import {
  op10mA11ComputeMultiTierGovernanceFriction,
  op10mA11GovernanceFrictionEscalating,
  op10mA11RegionsWithGovernanceBreakdown,
} from './multi-tier-governance-friction.ts';
import {
  op10mA11ComputeRegionalHousingSpilloverPressure,
  op10mA11HousingSpilloverEscalating,
  op10mA11RegionsWithHousingSpilloverCascade,
} from './regional-housing-spillover-pressure.ts';
import {
  op10mA11ComputeInterregionalTalentRetentionStress,
  op10mA11RegionsWithTalentDrain,
} from './interregional-talent-retention-stress.ts';
import {
  op10mA11ComputeClimateSettlementDisplacementRisk,
  op10mA11RegionsWithCriticalClimateDisplacement,
} from './climate-settlement-displacement-risk.ts';
import {
  op10mA11AmenityCostEscalating,
  op10mA11ComputeRegionalAmenityCostPressure,
  op10mA11RegionsWithAmenityCostCrisis,
} from './regional-amenity-cost-pressure.ts';
import {
  op10mA11ComputeDigitalConnectivityDecentralizationShift,
  op10mA11RegionsWithAcceleratingDecentralization,
} from './digital-connectivity-decentralization-shift.ts';
import {
  op10mA11ComputeSettlementRelocationBurden,
  op10mA11RegionsWithOverwhelmingRelocationBurden,
  op10mA11RelocationBurdenEscalating,
} from './settlement-relocation-burden.ts';
import {
  op10mA11ComputeRegionalEmploymentAnchorStress,
  op10mA11EmploymentAnchorStressEscalating,
  op10mA11RegionsWithFragileEmploymentAnchors,
} from './regional-employment-anchor-stress.ts';
import {
  op10mA11CommuteWedgeWidening,
  op10mA11ComputeInterregionalCommuteAffordabilityWedge,
  op10mA11RegionsWithSevereCommuteWedge,
} from './interregional-commute-affordability-wedge.ts';
import {
  op10mA11ComputeSettlementReceptionCapacityStrain,
  op10mA11ReceptionStrainEscalating,
  op10mA11RegionsWithReceptionCapacityStrain,
} from './settlement-reception-capacity-strain.ts';
import {
  op10mA11ComputeRegionalLandUseRegulatoryGridlock,
  op10mA11LandUseGridlockEscalating,
  op10mA11RegionsWithLandUseGridlock,
} from './regional-land-use-regulatory-gridlock.ts';
import {
  op10mA11ComputeInterregionalMobilityAffordabilityTrap,
  op10mA11MobilityTrapEscalating,
  op10mA11RegionsWithMobilityTrap,
} from './interregional-mobility-affordability-trap.ts';
import {
  op10mA11AbsorptionGapEscalating,
  op10mA11ComputeSettlementInfrastructureAbsorptionGap,
  op10mA11RegionsWithCriticalAbsorptionGap,
} from './settlement-infrastructure-absorption-gap.ts';
import {
  op10mA11ComputeRegionalReliefCoordinationOverhead,
  op10mA11RegionsWithReliefOverheadCritical,
  op10mA11ReliefOverheadEscalating,
} from './regional-relief-coordination-overhead.ts';
import {
  op10mA11ComputeInterregionalCorridorEquityDrift,
  op10mA11CorridorEquityDriftEscalating,
  op10mA11RegionsWithCorridorEquityFracture,
} from './interregional-corridor-equity-drift.ts';
import {
  op10mA11AdaptationLagEscalating,
  op10mA11ComputeSettlementClimateAdaptationLag,
  op10mA11RegionsWithCriticalAdaptationLag,
} from './settlement-climate-adaptation-lag.ts';
import {
  op10mA11ComputeRegionalFiscalCapacityStrain,
  op10mA11FiscalCapacityStrainEscalating,
  op10mA11RegionsWithFiscalCapacityFragility,
} from './regional-fiscal-capacity-strain.ts';
import {
  op10mA11ComputeInterregionalNetworkResilienceErosion,
  op10mA11NetworkErosionEscalating,
  op10mA11RegionsWithNetworkFracture,
} from './interregional-network-resilience-erosion.ts';
import {
  op10mA11ComputeSettlementLongHorizonCapacityRisk,
  op10mA11HorizonRiskEscalating,
  op10mA11RegionsWithCriticalHorizonRisk,
} from './settlement-long-horizon-capacity-risk.ts';
import {
  op10mA11CohesionIntegrityEscalating,
  op10mA11ComputeRegionalCohesionIntegrityPressure,
  op10mA11RegionsWithCohesionIntegrityFracture,
} from './regional-cohesion-integrity-pressure.ts';
import {
  op10mA11ComputeInterregionalReliefDeliveryEquityGap,
  op10mA11RegionsWithPolarizedReliefEquity,
  op10mA11ReliefEquityGapEscalating,
} from './interregional-relief-delivery-equity-gap.ts';
import {
  op10mA11ComputeSettlementSystemicFragilityComposite,
  op10mA11RegionsWithSystemicCascadeRisk,
  op10mA11SystemicFragilityEscalating,
} from './settlement-systemic-fragility-composite.ts';
import {
  op10mA11ComputeRegionalGovernanceResilienceDecay,
  op10mA11GovernanceResilienceDecayEscalating,
  op10mA11RegionsWithGovernanceResilienceCollapse,
} from './regional-governance-resilience-decay.ts';
import {
  op10mA11ComputeInterregionalMigrationStabilityErosion,
  op10mA11MigrationStabilityErosionEscalating,
  op10mA11RegionsWithMigrationChaos,
} from './interregional-migration-stability-erosion.ts';
import {
  op10mA11AdaptiveCeilingEscalating,
  op10mA11ComputeSettlementAdaptiveCapacityCeiling,
  op10mA11RegionsWithBreachedAdaptiveCeiling,
} from './settlement-adaptive-capacity-ceiling.ts';
import {
  op10mA11ComputeRegionalFiscalGovernanceCouplingStrain,
  op10mA11FiscalGovernanceCouplingEscalating,
  op10mA11RegionsWithFiscalGovernanceRupture,
} from './regional-fiscal-governance-coupling-strain.ts';
import {
  op10mA11ComputeInterregionalNetworkEquityTension,
  op10mA11NetworkEquityTensionEscalating,
  op10mA11RegionsWithNetworkEquityFracture,
} from './interregional-network-equity-tension.ts';
import {
  op10mA11ComputeSettlementResilienceFrontierPressure,
  op10mA11RegionsWithBreachedResilienceFrontier,
  op10mA11ResilienceFrontierEscalating,
} from './settlement-resilience-frontier-pressure.ts';
import {
  op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue,
  op10mA11MetaGovernanceFatigueEscalating,
  op10mA11RegionsWithMetaGovernanceExhaustion,
} from './regional-meta-governance-coordination-fatigue.ts';
import {
  op10mA11CapitalMobilityAsymmetryEscalating,
  op10mA11ComputeInterregionalCapitalMobilityAsymmetry,
  op10mA11RegionsWithLockedCapitalMobility,
} from './interregional-capital-mobility-asymmetry.ts';
import {
  op10mA11CompoundShockSaturationEscalating,
  op10mA11ComputeSettlementCompoundShockSaturation,
  op10mA11RegionsWithOverwhelmingCompoundShocks,
} from './settlement-compound-shock-saturation.ts';
import {
  op10mA11ComputeRegionalInstitutionalTrustErosion,
  op10mA11InstitutionalTrustErosionEscalating,
  op10mA11RegionsWithInstitutionalTrustBreakdown,
} from './regional-institutional-trust-erosion.ts';
import {
  op10mA11ComputeInterregionalLiquidityFragmentationStress,
  op10mA11LiquidityFragmentationEscalating,
  op10mA11RegionsWithFrozenLiquidity,
} from './interregional-liquidity-fragmentation-stress.ts';
import {
  op10mA11CascadingFailureRiskEscalating,
  op10mA11ComputeSettlementCascadingFailureRisk,
  op10mA11RegionsWithSystemicCascadeRisk,
} from './settlement-cascading-failure-risk.ts';
import {
  op10mA11ComputeRegionalSocialContractFragility,
  op10mA11RegionsWithRupturedSocialContract,
  op10mA11SocialContractFragilityEscalating,
} from './regional-social-contract-fragility.ts';
import {
  op10mA11CapitalFlightPanicEscalating,
  op10mA11ComputeInterregionalCapitalFlightPanic,
  op10mA11RegionsWithCapitalFlightStampede,
} from './interregional-capital-flight-panic.ts';
import {
  op10mA11ComputeSettlementIrrecoverableCollapseThreshold,
  op10mA11IrrecoverableCollapseThresholdEscalating,
  op10mA11RegionsWithIrrecoverableCollapse,
} from './settlement-irrecoverable-collapse-threshold.ts';
import {
  op10mA11ComputeRegionalSettlementLegitimacyCollapse,
  op10mA11RegionsWithCollapsedSettlementLegitimacy,
  op10mA11SettlementLegitimacyCollapseEscalating,
} from './regional-settlement-legitimacy-collapse.ts';
import {
  op10mA11ComputeInterregionalFiscalPanicContagion,
  op10mA11FiscalPanicContagionEscalating,
  op10mA11RegionsWithSystemicFiscalPanicContagion,
} from './interregional-fiscal-panic-contagion.ts';
import {
  op10mA11ComputeSettlementTerminalStateLockIn,
  op10mA11RegionsWithTerminalStateLockIn,
  op10mA11TerminalStateLockInEscalating,
} from './settlement-terminal-state-lock-in.ts';
import {
  op10mA11ComputeRegionalGovernanceVacuumEscalation,
  op10mA11GovernanceVacuumEscalating,
  op10mA11RegionsWithGovernanceVacuum,
} from './regional-governance-vacuum-escalation.ts';
import {
  op10mA11ComputeInterregionalSettlementAbandonmentSpiral,
  op10mA11RegionsWithSettlementAbandonment,
  op10mA11SettlementAbandonmentSpiralEscalating,
} from './interregional-settlement-abandonment-spiral.ts';
import {
  op10mA11ComputeSettlementPostCollapseRecoveryImpossibility,
  op10mA11PostCollapseRecoveryImpossibilityEscalating,
  op10mA11RegionsWithImpossibleRecovery,
} from './settlement-post-collapse-recovery-impossibility.ts';
import {
  op10mA11ComputeRegionalStateCollapseCascadeAmplification,
  op10mA11RegionsWithRunawayCollapseCascade,
  op10mA11StateCollapseCascadeAmplificationEscalating,
} from './regional-state-collapse-cascade-amplification.ts';
import {
  op10mA11ComputeInterregionalHollowRegionContagion,
  op10mA11HollowRegionContagionEscalating,
  op10mA11RegionsWithVoidedHollowContagion,
} from './interregional-hollow-region-contagion.ts';
import {
  op10mA11ComputeSettlementPermanentDepopulationLock,
  op10mA11PermanentDepopulationLockEscalating,
  op10mA11RegionsWithPermanentDepopulationLock,
} from './settlement-permanent-depopulation-lock.ts';
import {
  op10mA11ComputeRegionalTotalCollapseSingularityPressure,
  op10mA11RegionsWithTotalCollapseSingularity,
  op10mA11TotalCollapseSingularityEscalating,
} from './regional-total-collapse-singularity-pressure.ts';
import {
  op10mA11ComputeInterregionalVoidExpansionVelocity,
  op10mA11RegionsWithUnboundedVoidExpansion,
  op10mA11VoidExpansionVelocityEscalating,
} from './interregional-void-expansion-velocity.ts';
import {
  op10mA11ComputeSettlementExistentialContinuityFracture,
  op10mA11ExistentialContinuityFractureEscalating,
  op10mA11RegionsWithExtinguishedContinuity,
} from './settlement-existential-continuity-fracture.ts';
import {
  op10mA11CollapseHorizonConvergenceEscalating,
  op10mA11ComputeRegionalCollapseHorizonConvergence,
  op10mA11RegionsWithLockedCollapseHorizon,
} from './regional-collapse-horizon-convergence.ts';
import {
  op10mA11ComputeInterregionalVoidTotalizationSurge,
  op10mA11RegionsWithAbsoluteVoidTotalization,
  op10mA11VoidTotalizationSurgeEscalating,
} from './interregional-void-totalization-surge.ts';
import {
  op10mA11ComputeSettlementExistentialTerminusLock,
  op10mA11ExistentialTerminusLockEscalating,
  op10mA11RegionsWithTerminalExistentialLock,
} from './settlement-existential-terminus-lock.ts';
import {
  op10mA11AbsoluteCollapseHorizonLockEscalating,
  op10mA11ComputeRegionalAbsoluteCollapseHorizonLock,
  op10mA11RegionsWithAbsoluteCollapseHorizonLock,
} from './regional-absolute-collapse-horizon-lock.ts';
import {
  op10mA11ComputeInterregionalVoidFinalizationCascade,
  op10mA11RegionsWithCompleteVoidFinalization,
  op10mA11VoidFinalizationCascadeEscalating,
} from './interregional-void-finalization-cascade.ts';
import {
  op10mA11ComputeSettlementExistentialObliterationThreshold,
  op10mA11ExistentialObliterationThresholdEscalating,
  op10mA11RegionsWithObliteratedExistentialThreshold,
} from './settlement-existential-obliteration-threshold.ts';
import {
  op10mA11ComputeRegionalUltimateCollapseSingularitySeal,
  op10mA11RegionsWithUltimateCollapseSeal,
  op10mA11UltimateCollapseSingularitySealEscalating,
} from './regional-ultimate-collapse-singularity-seal.ts';
import {
  op10mA11ComputeInterregionalVoidAnnihilationConvergence,
  op10mA11RegionsWithTotalVoidAnnihilation,
  op10mA11VoidAnnihilationConvergenceEscalating,
} from './interregional-void-annihilation-convergence.ts';
import {
  op10mA11ComputeSettlementExistentialNullStateLock,
  op10mA11ExistentialNullStateLockEscalating,
  op10mA11RegionsWithAbsoluteExistentialNull,
} from './settlement-existential-null-state-lock.ts';
import {
  op10mA11CollapseExistenceSingularityPointEscalating,
  op10mA11ComputeRegionalCollapseExistenceSingularityPoint,
  op10mA11RegionsWithExistentialSingularityPoint,
} from './regional-collapse-existence-singularity-point.ts';
import {
  op10mA11ComputeInterregionalVoidExistenceAnnihilationFront,
  op10mA11RegionsWithTotalVoidExistenceFront,
  op10mA11VoidExistenceAnnihilationFrontEscalating,
} from './interregional-void-existence-annihilation-front.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteZeroLock,
  op10mA11ExistentialAbsoluteZeroLockEscalating,
  op10mA11RegionsWithAbsoluteZeroLock,
} from './settlement-existential-absolute-zero-lock.ts';
import {
  op10mA11CollapseOmniSingularityNodeEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityNode,
  op10mA11RegionsWithTotalOmniSingularityNode,
} from './regional-collapse-omni-singularity-node.ts';
import {
  op10mA11ComputeInterregionalVoidAbsoluteErosionSurge,
  op10mA11RegionsWithOmniVoidErosion,
  op10mA11VoidAbsoluteErosionSurgeEscalating,
} from './interregional-void-absolute-erosion-surge.ts';
import {
  op10mA11ComputeSettlementExistentialFinalNullityLock,
  op10mA11ExistentialFinalNullityLockEscalating,
  op10mA11RegionsWithFinalNullityLock,
} from './settlement-existential-final-nullity-lock.ts';
import {
  op10mA11CollapseTotalSingularityVertexEscalating,
  op10mA11ComputeRegionalCollapseTotalSingularityVertex,
  op10mA11RegionsWithCollapseSingularityVertex,
} from './regional-collapse-total-singularity-vertex.ts';
import {
  op10mA11ComputeInterregionalVoidTerminalErosionCascade,
  op10mA11RegionsWithTotalTerminalErosion,
  op10mA11VoidTerminalErosionCascadeEscalating,
} from './interregional-void-terminal-erosion-cascade.ts';
import {
  op10mA11ComputeSettlementExistentialUltimateNullitySeal,
  op10mA11ExistentialUltimateNullitySealEscalating,
  op10mA11RegionsWithTotalUltimateNullitySeal,
} from './settlement-existential-ultimate-nullity-seal.ts';
import {
  op10mA11CollapseAbsoluteSingularityApexEscalating,
  op10mA11ComputeRegionalCollapseAbsoluteSingularityApex,
  op10mA11RegionsWithCollapseSingularityApex,
} from './regional-collapse-absolute-singularity-apex.ts';
import {
  op10mA11ComputeInterregionalVoidCompleteErosionTerminality,
  op10mA11RegionsWithCompleteErosionTerminality,
  op10mA11VoidCompleteErosionTerminalityEscalating,
} from './interregional-void-complete-erosion-terminality.ts';
import {
  op10mA11ComputeSettlementExistentialFinalNullityClosure,
  op10mA11ExistentialFinalNullityClosureEscalating,
  op10mA11RegionsWithTotalFinalNullityClosure,
} from './settlement-existential-final-nullity-closure.ts';
import {
  op10mA11CollapseUltimateSingularityZenithEscalating,
  op10mA11ComputeRegionalCollapseUltimateSingularityZenith,
  op10mA11RegionsWithCollapseSingularityZenith,
} from './regional-collapse-ultimate-singularity-zenith.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionFinality,
  op10mA11RegionsWithTotalErosionFinality,
  op10mA11VoidTotalErosionFinalityEscalating,
} from './interregional-void-total-erosion-finality.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict,
  op10mA11ExistentialAbsoluteNullityVerdictEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityVerdict,
} from './settlement-existential-absolute-nullity-verdict.ts';
import {
  op10mA11CollapseTotalSingularityNexusEscalating,
  op10mA11ComputeRegionalCollapseTotalSingularityNexus,
  op10mA11RegionsWithCollapseSingularityNexus,
} from './regional-collapse-total-singularity-nexus.ts';
import {
  op10mA11ComputeInterregionalVoidAbsoluteErosionTermination,
  op10mA11RegionsWithAbsoluteErosionTermination,
  op10mA11VoidAbsoluteErosionTerminationEscalating,
} from './interregional-void-absolute-erosion-termination.ts';
import {
  op10mA11ComputeSettlementExistentialFinalNullitySentence,
  op10mA11ExistentialFinalNullitySentenceEscalating,
  op10mA11RegionsWithTotalFinalNullitySentence,
} from './settlement-existential-final-nullity-sentence.ts';
import {
  op10mA11CollapseAbsoluteSingularityCulminationEscalating,
  op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination,
  op10mA11RegionsWithCollapseSingularityCulmination,
} from './regional-collapse-absolute-singularity-culmination.ts';
import {
  op10mA11ComputeInterregionalVoidCompleteErosionExtinction,
  op10mA11RegionsWithCompleteErosionExtinction,
  op10mA11VoidCompleteErosionExtinctionEscalating,
} from './interregional-void-complete-erosion-extinction.ts';
import {
  op10mA11ComputeSettlementExistentialTotalNullityDecree,
  op10mA11ExistentialTotalNullityDecreeEscalating,
  op10mA11RegionsWithTotalNullityDecree,
} from './settlement-existential-total-nullity-decree.ts';
import {
  op10mA11CollapseOmniSingularitySynthesisEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularitySynthesis,
  op10mA11RegionsWithCollapseSingularitySynthesis,
} from './regional-collapse-omni-singularity-synthesis.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionAnnihilation,
  op10mA11RegionsWithTotalErosionAnnihilation,
  op10mA11VoidTotalErosionAnnihilationEscalating,
} from './interregional-void-total-erosion-annihilation.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityMandate,
  op10mA11ExistentialAbsoluteNullityMandateEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityMandate,
} from './settlement-existential-absolute-nullity-mandate.ts';
import {
  op10mA11CollapseOmniSingularityConvergenceEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityConvergence,
  op10mA11RegionsWithCollapseSingularityConvergence,
} from './regional-collapse-omni-singularity-convergence.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionObliteration,
  op10mA11RegionsWithTotalErosionObliteration,
  op10mA11VoidTotalErosionObliterationEscalating,
} from './interregional-void-total-erosion-obliteration.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityBinding,
  op10mA11ExistentialAbsoluteNullityBindingEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityBinding,
} from './settlement-existential-absolute-nullity-binding.ts';
import {
  op10mA11CollapseOmniSingularityIntegrationEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityIntegration,
  op10mA11RegionsWithCollapseSingularityIntegration,
} from './regional-collapse-omni-singularity-integration.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionEradication,
  op10mA11RegionsWithTotalErosionEradication,
  op10mA11VoidTotalErosionEradicationEscalating,
} from './interregional-void-total-erosion-eradication.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity,
  op10mA11ExistentialAbsoluteNullityContinuityEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityContinuity,
} from './settlement-existential-absolute-nullity-continuity.ts';
import {
  op10mA11CollapseOmniSingularityUnificationEscalating,
  op10mA11ComputeRegionalCollapseOmniSingularityUnification,
  op10mA11RegionsWithCollapseSingularityUnification,
} from './regional-collapse-omni-singularity-unification.ts';
import {
  op10mA11ComputeInterregionalVoidTotalErosionElimination,
  op10mA11RegionsWithTotalErosionElimination,
  op10mA11VoidTotalErosionEliminationEscalating,
} from './interregional-void-total-erosion-elimination.ts';
import {
  op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity,
  op10mA11ExistentialAbsoluteNullityPerpetuityEscalating,
  op10mA11RegionsWithTotalAbsoluteNullityPerpetuity,
} from './settlement-existential-absolute-nullity-perpetuity.ts';

export function createEmptyOP10M_A11_CompositePersisted(): OP10M_A11_CompositePersisted {
  return {
    schemaVersion: OP10M_A11_COMPOSITE_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    urban: createEmptyOP10M_A11_Persisted(),
    infra: createEmptyOP10M_A11_InfraPersisted(),
    lastFragilityIndex: 0,
    lastMaxCorridorFlow: 0,
    lastCohesionIndex: 0,
    lastStandingSpread: 0,
    lastServiceEquityIndex: 0,
    lastInfrastructureBacklogIndex: 0,
    lastGovernanceFrictionIndex: 0,
    lastHousingSpilloverIndex: 0,
    lastClimateDisplacementIndex: 0,
    lastAmenityCostIndex: 0,
    lastRelocationBurdenIndex: 0,
    lastEmploymentAnchorIndex: 0,
    lastCommuteWedgeIndex: 0,
    lastReceptionStrainIndex: 0,
    lastLandUseGridlockIndex: 0,
    lastMobilityTrapIndex: 0,
    lastAbsorptionGapIndex: 0,
    lastReliefOverheadIndex: 0,
    lastCorridorEquityDriftIndex: 0,
    lastClimateAdaptationLagIndex: 0,
    lastFiscalCapacityStrainIndex: 0,
    lastNetworkResilienceErosionIndex: 0,
    lastLongHorizonCapacityRiskIndex: 0,
    lastCohesionIntegrityIndex: 0,
    lastReliefEquityGapIndex: 0,
    lastSystemicFragilityIndex: 0,
    lastGovernanceResilienceDecayIndex: 0,
    lastMigrationStabilityErosionIndex: 0,
    lastAdaptiveCapacityCeilingIndex: 0,
    lastFiscalGovernanceCouplingIndex: 0,
    lastNetworkEquityTensionIndex: 0,
    lastResilienceFrontierIndex: 0,
    lastMetaGovernanceFatigueIndex: 0,
    lastCapitalMobilityAsymmetryIndex: 0,
    lastCompoundShockSaturationIndex: 0,
    lastInstitutionalTrustErosionIndex: 0,
    lastLiquidityFragmentationIndex: 0,
    lastCascadingFailureRiskIndex: 0,
    lastSocialContractFragilityIndex: 0,
    lastCapitalFlightPanicIndex: 0,
    lastIrrecoverableCollapseThresholdIndex: 0,
    lastSettlementLegitimacyCollapseIndex: 0,
    lastFiscalPanicContagionIndex: 0,
    lastTerminalStateLockInIndex: 0,
    lastGovernanceVacuumEscalationIndex: 0,
    lastSettlementAbandonmentSpiralIndex: 0,
    lastPostCollapseRecoveryImpossibilityIndex: 0,
    lastStateCollapseCascadeAmplificationIndex: 0,
    lastHollowRegionContagionIndex: 0,
    lastPermanentDepopulationLockIndex: 0,
    lastTotalCollapseSingularityIndex: 0,
    lastVoidExpansionVelocityIndex: 0,
    lastExistentialContinuityFractureIndex: 0,
    lastCollapseHorizonConvergenceIndex: 0,
    lastVoidTotalizationSurgeIndex: 0,
    lastExistentialTerminusLockIndex: 0,
    lastAbsoluteCollapseHorizonLockIndex: 0,
    lastVoidFinalizationCascadeIndex: 0,
    lastExistentialObliterationThresholdIndex: 0,
    lastUltimateCollapseSingularitySealIndex: 0,
    lastVoidAnnihilationConvergenceIndex: 0,
    lastExistentialNullStateLockIndex: 0,
    lastCollapseExistenceSingularityPointIndex: 0,
    lastVoidExistenceAnnihilationFrontIndex: 0,
    lastExistentialAbsoluteZeroLockIndex: 0,
    lastCollapseOmniSingularityNodeIndex: 0,
    lastVoidAbsoluteErosionSurgeIndex: 0,
    lastExistentialFinalNullityLockIndex: 0,
    lastCollapseTotalSingularityVertexIndex: 0,
    lastVoidTerminalErosionCascadeIndex: 0,
    lastExistentialUltimateNullitySealIndex: 0,
    lastCollapseAbsoluteSingularityApexIndex: 0,
    lastVoidCompleteErosionTerminalityIndex: 0,
    lastExistentialFinalNullityClosureIndex: 0,
    lastCollapseUltimateSingularityZenithIndex: 0,
    lastVoidTotalErosionFinalityIndex: 0,
    lastExistentialAbsoluteNullityVerdictIndex: 0,
    lastCollapseTotalSingularityNexusIndex: 0,
    lastVoidAbsoluteErosionTerminationIndex: 0,
    lastExistentialFinalNullitySentenceIndex: 0,
    lastCollapseAbsoluteSingularityCulminationIndex: 0,
    lastVoidCompleteErosionExtinctionIndex: 0,
    lastExistentialTotalNullityDecreeIndex: 0,
    lastCollapseOmniSingularitySynthesisIndex: 0,
    lastVoidTotalErosionAnnihilationIndex: 0,
    lastExistentialAbsoluteNullityMandateIndex: 0,
    lastCollapseOmniSingularityConvergenceIndex: 0,
    lastVoidTotalErosionObliterationIndex: 0,
    lastExistentialAbsoluteNullityBindingIndex: 0,
    lastCollapseOmniSingularityIntegrationIndex: 0,
    lastVoidTotalErosionEradicationIndex: 0,
    lastExistentialAbsoluteNullityContinuityIndex: 0,
    lastCollapseOmniSingularityUnificationIndex: 0,
    lastVoidTotalErosionEliminationIndex: 0,
    lastExistentialAbsoluteNullityPerpetuityIndex: 0,
    inputHash: '',
  };
}

export function validateOP10M_A11_CompositeState(state: OP10M_A11_CompositeState | null): string[] {
  if (!state) return ['null composite state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_COMPOSITE_SCHEMA_VERSION) errs.push('composite schema mismatch');
  if (state.fragilityIndex < 0 || state.fragilityIndex > 100) errs.push('fragility out of range');
  if (state.hierarchy.length !== 8) errs.push('hierarchy row count');
  if (state.linkageHubs.length !== 8) errs.push('hub profile count');
  if (state.maxCorridorFlow < 0 || state.maxCorridorFlow > 100) errs.push('max corridor flow');
  if (state.migrationPressure.length !== 8) errs.push('migration pressure row count');
  if (state.settlementVulnerability.length !== 8) errs.push('settlement vulnerability count');
  if (state.fiscalUrbanCoupling.length !== 8) errs.push('fiscal coupling count');
  if (state.regionalCohesionIndex < 0 || state.regionalCohesionIndex > 100) errs.push('cohesion out of range');
  if (state.absorptionStress.length !== 8) errs.push('absorption stress row count');
  if (state.serviceEquity.length !== 8) errs.push('service equity row count');
  if (state.metropolitanSaturationIndex < 0 || state.metropolitanSaturationIndex > 100) errs.push('saturation out of range');
  if (state.nationalServiceEquityIndex < 0 || state.nationalServiceEquityIndex > 100) errs.push('service equity index out of range');
  if (!state.convergence?.narrative) errs.push('convergence row missing');
  if (state.periUrbanPressure.length !== 8) errs.push('peri-urban pressure row count');
  if (state.infrastructureBacklog.length !== 8) errs.push('infrastructure backlog row count');
  if (state.governanceFriction.length !== 8) errs.push('governance friction row count');
  if (state.nationalPeriUrbanPressureIndex < 0 || state.nationalPeriUrbanPressureIndex > 100) errs.push('peri-urban index out of range');
  if (state.nationalInfrastructureBacklogIndex < 0 || state.nationalInfrastructureBacklogIndex > 100) errs.push('backlog index out of range');
  if (state.nationalGovernanceFrictionIndex < 0 || state.nationalGovernanceFrictionIndex > 100) errs.push('governance friction index out of range');
  if (state.housingSpillover.length !== 8) errs.push('housing spillover row count');
  if (state.talentRetention.length !== 8) errs.push('talent retention row count');
  if (state.climateDisplacement.length !== 8) errs.push('climate displacement row count');
  if (state.nationalHousingSpilloverIndex < 0 || state.nationalHousingSpilloverIndex > 100) errs.push('housing spillover index out of range');
  if (state.nationalTalentDrainIndex < 0 || state.nationalTalentDrainIndex > 100) errs.push('talent drain index out of range');
  if (state.nationalClimateDisplacementIndex < 0 || state.nationalClimateDisplacementIndex > 100) errs.push('climate displacement index out of range');
  if (state.amenityCost.length !== 8) errs.push('amenity cost row count');
  if (state.decentralizationShift.length !== 8) errs.push('decentralization shift row count');
  if (state.relocationBurden.length !== 8) errs.push('relocation burden row count');
  if (state.nationalAmenityCostIndex < 0 || state.nationalAmenityCostIndex > 100) errs.push('amenity cost index out of range');
  if (state.nationalDecentralizationIndex < 0 || state.nationalDecentralizationIndex > 100) errs.push('decentralization index out of range');
  if (state.nationalRelocationBurdenIndex < 0 || state.nationalRelocationBurdenIndex > 100) errs.push('relocation burden index out of range');
  if (state.employmentAnchor.length !== 8) errs.push('employment anchor row count');
  if (state.commuteWedge.length !== 8) errs.push('commute wedge row count');
  if (state.receptionStrain.length !== 8) errs.push('reception strain row count');
  if (state.nationalEmploymentAnchorIndex < 0 || state.nationalEmploymentAnchorIndex > 100) errs.push('employment anchor index out of range');
  if (state.nationalCommuteWedgeIndex < 0 || state.nationalCommuteWedgeIndex > 100) errs.push('commute wedge index out of range');
  if (state.nationalReceptionStrainIndex < 0 || state.nationalReceptionStrainIndex > 100) errs.push('reception strain index out of range');
  if (state.landUseGridlock.length !== 8) errs.push('land use gridlock row count');
  if (state.mobilityTrap.length !== 8) errs.push('mobility trap row count');
  if (state.absorptionGap.length !== 8) errs.push('absorption gap row count');
  if (state.nationalLandUseGridlockIndex < 0 || state.nationalLandUseGridlockIndex > 100) errs.push('land use gridlock index out of range');
  if (state.nationalMobilityTrapIndex < 0 || state.nationalMobilityTrapIndex > 100) errs.push('mobility trap index out of range');
  if (state.nationalAbsorptionGapIndex < 0 || state.nationalAbsorptionGapIndex > 100) errs.push('absorption gap index out of range');
  if (state.reliefOverhead.length !== 8) errs.push('relief overhead row count');
  if (state.corridorEquityDrift.length !== 8) errs.push('corridor equity drift row count');
  if (state.climateAdaptationLag.length !== 8) errs.push('climate adaptation lag row count');
  if (state.nationalReliefOverheadIndex < 0 || state.nationalReliefOverheadIndex > 100) errs.push('relief overhead index out of range');
  if (state.nationalCorridorEquityDriftIndex < 0 || state.nationalCorridorEquityDriftIndex > 100) errs.push('corridor equity drift index out of range');
  if (state.nationalClimateAdaptationLagIndex < 0 || state.nationalClimateAdaptationLagIndex > 100) errs.push('climate adaptation lag index out of range');
  if (state.fiscalCapacityStrain.length !== 8) errs.push('fiscal capacity strain row count');
  if (state.networkResilienceErosion.length !== 8) errs.push('network erosion row count');
  if (state.longHorizonCapacityRisk.length !== 8) errs.push('long horizon risk row count');
  if (state.nationalFiscalCapacityStrainIndex < 0 || state.nationalFiscalCapacityStrainIndex > 100) errs.push('fiscal capacity strain index out of range');
  if (state.nationalNetworkResilienceErosionIndex < 0 || state.nationalNetworkResilienceErosionIndex > 100) errs.push('network erosion index out of range');
  if (state.nationalLongHorizonCapacityRiskIndex < 0 || state.nationalLongHorizonCapacityRiskIndex > 100) errs.push('long horizon risk index out of range');
  if (state.cohesionIntegrity.length !== 8) errs.push('cohesion integrity row count');
  if (state.reliefEquityGap.length !== 8) errs.push('relief equity gap row count');
  if (state.systemicFragility.length !== 8) errs.push('systemic fragility row count');
  if (state.nationalCohesionIntegrityIndex < 0 || state.nationalCohesionIntegrityIndex > 100) errs.push('cohesion integrity index out of range');
  if (state.nationalReliefEquityGapIndex < 0 || state.nationalReliefEquityGapIndex > 100) errs.push('relief equity gap index out of range');
  if (state.nationalSystemicFragilityIndex < 0 || state.nationalSystemicFragilityIndex > 100) errs.push('systemic fragility index out of range');
  if (state.governanceResilienceDecay.length !== 8) errs.push('governance resilience decay row count');
  if (state.migrationStabilityErosion.length !== 8) errs.push('migration stability erosion row count');
  if (state.adaptiveCapacityCeiling.length !== 8) errs.push('adaptive capacity ceiling row count');
  if (state.nationalGovernanceResilienceDecayIndex < 0 || state.nationalGovernanceResilienceDecayIndex > 100) errs.push('governance resilience decay index out of range');
  if (state.nationalMigrationStabilityErosionIndex < 0 || state.nationalMigrationStabilityErosionIndex > 100) errs.push('migration stability erosion index out of range');
  if (state.nationalAdaptiveCapacityCeilingIndex < 0 || state.nationalAdaptiveCapacityCeilingIndex > 100) errs.push('adaptive capacity ceiling index out of range');
  if (state.fiscalGovernanceCoupling.length !== 8) errs.push('fiscal governance coupling row count');
  if (state.networkEquityTension.length !== 8) errs.push('network equity tension row count');
  if (state.resilienceFrontier.length !== 8) errs.push('resilience frontier row count');
  if (state.nationalFiscalGovernanceCouplingIndex < 0 || state.nationalFiscalGovernanceCouplingIndex > 100) errs.push('fiscal governance coupling index out of range');
  if (state.nationalNetworkEquityTensionIndex < 0 || state.nationalNetworkEquityTensionIndex > 100) errs.push('network equity tension index out of range');
  if (state.nationalResilienceFrontierIndex < 0 || state.nationalResilienceFrontierIndex > 100) errs.push('resilience frontier index out of range');
  if (state.metaGovernanceFatigue.length !== 8) errs.push('meta governance fatigue row count');
  if (state.capitalMobilityAsymmetry.length !== 8) errs.push('capital mobility asymmetry row count');
  if (state.compoundShockSaturation.length !== 8) errs.push('compound shock saturation row count');
  if (state.nationalMetaGovernanceFatigueIndex < 0 || state.nationalMetaGovernanceFatigueIndex > 100) errs.push('meta governance fatigue index out of range');
  if (state.nationalCapitalMobilityAsymmetryIndex < 0 || state.nationalCapitalMobilityAsymmetryIndex > 100) errs.push('capital mobility asymmetry index out of range');
  if (state.nationalCompoundShockSaturationIndex < 0 || state.nationalCompoundShockSaturationIndex > 100) errs.push('compound shock saturation index out of range');
  if (state.institutionalTrustErosion.length !== 8) errs.push('institutional trust erosion row count');
  if (state.liquidityFragmentation.length !== 8) errs.push('liquidity fragmentation row count');
  if (state.cascadingFailureRisk.length !== 8) errs.push('cascading failure risk row count');
  if (state.nationalInstitutionalTrustErosionIndex < 0 || state.nationalInstitutionalTrustErosionIndex > 100) errs.push('institutional trust erosion index out of range');
  if (state.nationalLiquidityFragmentationIndex < 0 || state.nationalLiquidityFragmentationIndex > 100) errs.push('liquidity fragmentation index out of range');
  if (state.nationalCascadingFailureRiskIndex < 0 || state.nationalCascadingFailureRiskIndex > 100) errs.push('cascading failure risk index out of range');
  if (state.socialContractFragility.length !== 8) errs.push('social contract fragility row count');
  if (state.capitalFlightPanic.length !== 8) errs.push('capital flight panic row count');
  if (state.irrecoverableCollapseThreshold.length !== 8) errs.push('irrecoverable collapse threshold row count');
  if (state.nationalSocialContractFragilityIndex < 0 || state.nationalSocialContractFragilityIndex > 100) errs.push('social contract fragility index out of range');
  if (state.nationalCapitalFlightPanicIndex < 0 || state.nationalCapitalFlightPanicIndex > 100) errs.push('capital flight panic index out of range');
  if (state.nationalIrrecoverableCollapseThresholdIndex < 0 || state.nationalIrrecoverableCollapseThresholdIndex > 100) errs.push('irrecoverable collapse threshold index out of range');
  if (state.settlementLegitimacyCollapse.length !== 8) errs.push('settlement legitimacy collapse row count');
  if (state.fiscalPanicContagion.length !== 8) errs.push('fiscal panic contagion row count');
  if (state.terminalStateLockIn.length !== 8) errs.push('terminal state lock-in row count');
  if (state.nationalSettlementLegitimacyCollapseIndex < 0 || state.nationalSettlementLegitimacyCollapseIndex > 100) errs.push('settlement legitimacy collapse index out of range');
  if (state.nationalFiscalPanicContagionIndex < 0 || state.nationalFiscalPanicContagionIndex > 100) errs.push('fiscal panic contagion index out of range');
  if (state.nationalTerminalStateLockInIndex < 0 || state.nationalTerminalStateLockInIndex > 100) errs.push('terminal state lock-in index out of range');
  if (state.governanceVacuumEscalation.length !== 8) errs.push('governance vacuum escalation row count');
  if (state.settlementAbandonmentSpiral.length !== 8) errs.push('settlement abandonment spiral row count');
  if (state.postCollapseRecoveryImpossibility.length !== 8) errs.push('post-collapse recovery impossibility row count');
  if (state.nationalGovernanceVacuumEscalationIndex < 0 || state.nationalGovernanceVacuumEscalationIndex > 100) errs.push('governance vacuum escalation index out of range');
  if (state.nationalSettlementAbandonmentSpiralIndex < 0 || state.nationalSettlementAbandonmentSpiralIndex > 100) errs.push('settlement abandonment spiral index out of range');
  if (state.nationalPostCollapseRecoveryImpossibilityIndex < 0 || state.nationalPostCollapseRecoveryImpossibilityIndex > 100) errs.push('post-collapse recovery impossibility index out of range');
  if (state.stateCollapseCascadeAmplification.length !== 8) errs.push('state collapse cascade amplification row count');
  if (state.hollowRegionContagion.length !== 8) errs.push('hollow region contagion row count');
  if (state.permanentDepopulationLock.length !== 8) errs.push('permanent depopulation lock row count');
  if (state.nationalStateCollapseCascadeAmplificationIndex < 0 || state.nationalStateCollapseCascadeAmplificationIndex > 100) errs.push('state collapse cascade amplification index out of range');
  if (state.nationalHollowRegionContagionIndex < 0 || state.nationalHollowRegionContagionIndex > 100) errs.push('hollow region contagion index out of range');
  if (state.nationalPermanentDepopulationLockIndex < 0 || state.nationalPermanentDepopulationLockIndex > 100) errs.push('permanent depopulation lock index out of range');
  if (state.totalCollapseSingularity.length !== 8) errs.push('total collapse singularity row count');
  if (state.voidExpansionVelocity.length !== 8) errs.push('void expansion velocity row count');
  if (state.existentialContinuityFracture.length !== 8) errs.push('existential continuity fracture row count');
  if (state.nationalTotalCollapseSingularityIndex < 0 || state.nationalTotalCollapseSingularityIndex > 100) errs.push('total collapse singularity index out of range');
  if (state.nationalVoidExpansionVelocityIndex < 0 || state.nationalVoidExpansionVelocityIndex > 100) errs.push('void expansion velocity index out of range');
  if (state.nationalExistentialContinuityFractureIndex < 0 || state.nationalExistentialContinuityFractureIndex > 100) errs.push('existential continuity fracture index out of range');
  if (state.collapseHorizonConvergence.length !== 8) errs.push('collapse horizon convergence row count');
  if (state.voidTotalizationSurge.length !== 8) errs.push('void totalization surge row count');
  if (state.existentialTerminusLock.length !== 8) errs.push('existential terminus lock row count');
  if (state.nationalCollapseHorizonConvergenceIndex < 0 || state.nationalCollapseHorizonConvergenceIndex > 100) errs.push('collapse horizon convergence index out of range');
  if (state.nationalVoidTotalizationSurgeIndex < 0 || state.nationalVoidTotalizationSurgeIndex > 100) errs.push('void totalization surge index out of range');
  if (state.nationalExistentialTerminusLockIndex < 0 || state.nationalExistentialTerminusLockIndex > 100) errs.push('existential terminus lock index out of range');
  if (state.absoluteCollapseHorizonLock.length !== 8) errs.push('absolute collapse horizon lock row count');
  if (state.voidFinalizationCascade.length !== 8) errs.push('void finalization cascade row count');
  if (state.existentialObliterationThreshold.length !== 8) errs.push('existential obliteration threshold row count');
  if (state.nationalAbsoluteCollapseHorizonLockIndex < 0 || state.nationalAbsoluteCollapseHorizonLockIndex > 100) errs.push('absolute collapse horizon lock index out of range');
  if (state.nationalVoidFinalizationCascadeIndex < 0 || state.nationalVoidFinalizationCascadeIndex > 100) errs.push('void finalization cascade index out of range');
  if (state.nationalExistentialObliterationThresholdIndex < 0 || state.nationalExistentialObliterationThresholdIndex > 100) errs.push('existential obliteration threshold index out of range');
  if (state.ultimateCollapseSingularitySeal.length !== 8) errs.push('ultimate collapse singularity seal row count');
  if (state.voidAnnihilationConvergence.length !== 8) errs.push('void annihilation convergence row count');
  if (state.existentialNullStateLock.length !== 8) errs.push('existential null-state lock row count');
  if (state.nationalUltimateCollapseSingularitySealIndex < 0 || state.nationalUltimateCollapseSingularitySealIndex > 100) errs.push('ultimate collapse singularity seal index out of range');
  if (state.nationalVoidAnnihilationConvergenceIndex < 0 || state.nationalVoidAnnihilationConvergenceIndex > 100) errs.push('void annihilation convergence index out of range');
  if (state.nationalExistentialNullStateLockIndex < 0 || state.nationalExistentialNullStateLockIndex > 100) errs.push('existential null-state lock index out of range');
  if (state.collapseExistenceSingularityPoint.length !== 8) errs.push('collapse existence singularity point row count');
  if (state.voidExistenceAnnihilationFront.length !== 8) errs.push('void existence annihilation front row count');
  if (state.existentialAbsoluteZeroLock.length !== 8) errs.push('existential absolute zero lock row count');
  if (state.nationalCollapseExistenceSingularityPointIndex < 0 || state.nationalCollapseExistenceSingularityPointIndex > 100) errs.push('collapse existence singularity point index out of range');
  if (state.nationalVoidExistenceAnnihilationFrontIndex < 0 || state.nationalVoidExistenceAnnihilationFrontIndex > 100) errs.push('void existence annihilation front index out of range');
  if (state.nationalExistentialAbsoluteZeroLockIndex < 0 || state.nationalExistentialAbsoluteZeroLockIndex > 100) errs.push('existential absolute zero lock index out of range');
  if (state.collapseOmniSingularityNode.length !== 8) errs.push('collapse omni singularity node row count');
  if (state.voidAbsoluteErosionSurge.length !== 8) errs.push('void absolute erosion surge row count');
  if (state.existentialFinalNullityLock.length !== 8) errs.push('existential final nullity lock row count');
  if (state.nationalCollapseOmniSingularityNodeIndex < 0 || state.nationalCollapseOmniSingularityNodeIndex > 100) errs.push('collapse omni singularity node index out of range');
  if (state.nationalVoidAbsoluteErosionSurgeIndex < 0 || state.nationalVoidAbsoluteErosionSurgeIndex > 100) errs.push('void absolute erosion surge index out of range');
  if (state.nationalExistentialFinalNullityLockIndex < 0 || state.nationalExistentialFinalNullityLockIndex > 100) errs.push('existential final nullity lock index out of range');
  if (state.collapseTotalSingularityVertex.length !== 8) errs.push('collapse total singularity vertex row count');
  if (state.voidTerminalErosionCascade.length !== 8) errs.push('void terminal erosion cascade row count');
  if (state.existentialUltimateNullitySeal.length !== 8) errs.push('existential ultimate nullity seal row count');
  if (state.nationalCollapseTotalSingularityVertexIndex < 0 || state.nationalCollapseTotalSingularityVertexIndex > 100) errs.push('collapse total singularity vertex index out of range');
  if (state.nationalVoidTerminalErosionCascadeIndex < 0 || state.nationalVoidTerminalErosionCascadeIndex > 100) errs.push('void terminal erosion cascade index out of range');
  if (state.nationalExistentialUltimateNullitySealIndex < 0 || state.nationalExistentialUltimateNullitySealIndex > 100) errs.push('existential ultimate nullity seal index out of range');
  if (state.collapseAbsoluteSingularityApex.length !== 8) errs.push('collapse absolute singularity apex row count');
  if (state.voidCompleteErosionTerminality.length !== 8) errs.push('void complete erosion terminality row count');
  if (state.existentialFinalNullityClosure.length !== 8) errs.push('existential final nullity closure row count');
  if (state.nationalCollapseAbsoluteSingularityApexIndex < 0 || state.nationalCollapseAbsoluteSingularityApexIndex > 100) errs.push('collapse absolute singularity apex index out of range');
  if (state.nationalVoidCompleteErosionTerminalityIndex < 0 || state.nationalVoidCompleteErosionTerminalityIndex > 100) errs.push('void complete erosion terminality index out of range');
  if (state.nationalExistentialFinalNullityClosureIndex < 0 || state.nationalExistentialFinalNullityClosureIndex > 100) errs.push('existential final nullity closure index out of range');
  if (state.collapseUltimateSingularityZenith.length !== 8) errs.push('collapse ultimate singularity zenith row count');
  if (state.voidTotalErosionFinality.length !== 8) errs.push('void total erosion finality row count');
  if (state.existentialAbsoluteNullityVerdict.length !== 8) errs.push('existential absolute nullity verdict row count');
  if (state.nationalCollapseUltimateSingularityZenithIndex < 0 || state.nationalCollapseUltimateSingularityZenithIndex > 100) errs.push('collapse ultimate singularity zenith index out of range');
  if (state.nationalVoidTotalErosionFinalityIndex < 0 || state.nationalVoidTotalErosionFinalityIndex > 100) errs.push('void total erosion finality index out of range');
  if (state.nationalExistentialAbsoluteNullityVerdictIndex < 0 || state.nationalExistentialAbsoluteNullityVerdictIndex > 100) errs.push('existential absolute nullity verdict index out of range');
  if (state.collapseTotalSingularityNexus.length !== 8) errs.push('collapse total singularity nexus row count');
  if (state.voidAbsoluteErosionTermination.length !== 8) errs.push('void absolute erosion termination row count');
  if (state.existentialFinalNullitySentence.length !== 8) errs.push('existential final nullity sentence row count');
  if (state.nationalCollapseTotalSingularityNexusIndex < 0 || state.nationalCollapseTotalSingularityNexusIndex > 100) errs.push('collapse total singularity nexus index out of range');
  if (state.nationalVoidAbsoluteErosionTerminationIndex < 0 || state.nationalVoidAbsoluteErosionTerminationIndex > 100) errs.push('void absolute erosion termination index out of range');
  if (state.nationalExistentialFinalNullitySentenceIndex < 0 || state.nationalExistentialFinalNullitySentenceIndex > 100) errs.push('existential final nullity sentence index out of range');
  if (state.collapseAbsoluteSingularityCulmination.length !== 8) errs.push('collapse absolute singularity culmination row count');
  if (state.voidCompleteErosionExtinction.length !== 8) errs.push('void complete erosion extinction row count');
  if (state.existentialTotalNullityDecree.length !== 8) errs.push('existential total nullity decree row count');
  if (state.nationalCollapseAbsoluteSingularityCulminationIndex < 0 || state.nationalCollapseAbsoluteSingularityCulminationIndex > 100) errs.push('collapse absolute singularity culmination index out of range');
  if (state.nationalVoidCompleteErosionExtinctionIndex < 0 || state.nationalVoidCompleteErosionExtinctionIndex > 100) errs.push('void complete erosion extinction index out of range');
  if (state.nationalExistentialTotalNullityDecreeIndex < 0 || state.nationalExistentialTotalNullityDecreeIndex > 100) errs.push('existential total nullity decree index out of range');
  if (state.collapseOmniSingularitySynthesis.length !== 8) errs.push('collapse omni singularity synthesis row count');
  if (state.voidTotalErosionAnnihilation.length !== 8) errs.push('void total erosion annihilation row count');
  if (state.existentialAbsoluteNullityMandate.length !== 8) errs.push('existential absolute nullity mandate row count');
  if (state.nationalCollapseOmniSingularitySynthesisIndex < 0 || state.nationalCollapseOmniSingularitySynthesisIndex > 100) errs.push('collapse omni singularity synthesis index out of range');
  if (state.nationalVoidTotalErosionAnnihilationIndex < 0 || state.nationalVoidTotalErosionAnnihilationIndex > 100) errs.push('void total erosion annihilation index out of range');
  if (state.nationalExistentialAbsoluteNullityMandateIndex < 0 || state.nationalExistentialAbsoluteNullityMandateIndex > 100) errs.push('existential absolute nullity mandate index out of range');
  if (state.collapseOmniSingularityConvergence.length !== 8) errs.push('collapse omni singularity convergence row count');
  if (state.voidTotalErosionObliteration.length !== 8) errs.push('void total erosion obliteration row count');
  if (state.existentialAbsoluteNullityBinding.length !== 8) errs.push('existential absolute nullity binding row count');
  if (state.nationalCollapseOmniSingularityConvergenceIndex < 0 || state.nationalCollapseOmniSingularityConvergenceIndex > 100) errs.push('collapse omni singularity convergence index out of range');
  if (state.nationalVoidTotalErosionObliterationIndex < 0 || state.nationalVoidTotalErosionObliterationIndex > 100) errs.push('void total erosion obliteration index out of range');
  if (state.nationalExistentialAbsoluteNullityBindingIndex < 0 || state.nationalExistentialAbsoluteNullityBindingIndex > 100) errs.push('existential absolute nullity binding index out of range');
  if (state.collapseOmniSingularityIntegration.length !== 8) errs.push('collapse omni singularity integration row count');
  if (state.voidTotalErosionEradication.length !== 8) errs.push('void total erosion eradication row count');
  if (state.existentialAbsoluteNullityContinuity.length !== 8) errs.push('existential absolute nullity continuity row count');
  if (state.nationalCollapseOmniSingularityIntegrationIndex < 0 || state.nationalCollapseOmniSingularityIntegrationIndex > 100) errs.push('collapse omni singularity integration index out of range');
  if (state.nationalVoidTotalErosionEradicationIndex < 0 || state.nationalVoidTotalErosionEradicationIndex > 100) errs.push('void total erosion eradication index out of range');
  if (state.nationalExistentialAbsoluteNullityContinuityIndex < 0 || state.nationalExistentialAbsoluteNullityContinuityIndex > 100) errs.push('existential absolute nullity continuity index out of range');
  if (state.collapseOmniSingularityUnification.length !== 8) errs.push('collapse omni singularity unification row count');
  if (state.voidTotalErosionElimination.length !== 8) errs.push('void total erosion elimination row count');
  if (state.existentialAbsoluteNullityPerpetuity.length !== 8) errs.push('existential absolute nullity perpetuity row count');
  if (state.nationalCollapseOmniSingularityUnificationIndex < 0 || state.nationalCollapseOmniSingularityUnificationIndex > 100) errs.push('collapse omni singularity unification index out of range');
  if (state.nationalVoidTotalErosionEliminationIndex < 0 || state.nationalVoidTotalErosionEliminationIndex > 100) errs.push('void total erosion elimination index out of range');
  if (state.nationalExistentialAbsoluteNullityPerpetuityIndex < 0 || state.nationalExistentialAbsoluteNullityPerpetuityIndex > 100) errs.push('existential absolute nullity perpetuity index out of range');
  return errs;
}

function pushCompositeDerived(
  list: Omit<OP10M_A11_CompositeDerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_CompositeDerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  text: string,
  significance: OP10M_A11_CompositeDerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= 12) return;
  list.push({ turn, kind, regionIds, text, significance });
}

export function recomputeOP10M_A11_CitiesRegionsComposite(
  inputs: OP10M_A11_CompositeInputs,
  persisted: OP10M_A11_CompositePersisted | null,
): {
  state: OP10M_A11_CompositeState;
  derived: OP10M_A11_CompositeDerivedEvent[];
  persisted: OP10M_A11_CompositePersisted;
} {
  const base = persisted
    ? {
        ...persisted,
        urban: { ...persisted.urban, history: [...persisted.urban.history] },
        infra: { ...persisted.infra, stressedLinkIds: [...persisted.infra.stressedLinkIds] },
      }
    : createEmptyOP10M_A11_CompositePersisted();

  if (base.initializedTurn === null) base.initializedTurn = inputs.urban.turn;

  const urbanOut = recomputeOP10M_A11_RegionalUrbanLayer(inputs.urban, base.urban);
  const infraOut = recomputeOP10M_A11_IntercityInfraLayer(inputs.infra, base.infra);

  const hierarchy = op10mA11ComputeUrbanHierarchy(inputs.urban.cities);
  const nationalPrimateIndex = op10mA11NationalPrimateIndex(hierarchy);
  const linkages = op10mA11BuildRegionalLinkageMatrix(inputs.infra.links);
  const corridorFlows = op10mA11ComputeCorridorFlows({
    cities: inputs.urban.cities,
    links: inputs.infra.links,
    linkages,
  });
  const maxCorridorFlow = op10mA11MaxCorridorFlow(corridorFlows);
  const linkageHubs = op10mA11AnalyzeLinkageHubs(linkages);
  const fragilityIndex = op10mA11LinkageFragilityIndex(linkages, infraOut.state.corridorStressIndex);
  const weakRegions = op10mA11RegionsWithWeakLinkage(linkages);
  const reliefPlaybook = op10mA11BuildReliefPlaybook({
    bottlenecks: infraOut.state.bottlenecks,
    hierarchy,
    weakLinkageRegions: weakRegions,
  });

  const migrationPressure = op10mA11ComputeMigrationPressure({
    regions: urbanOut.state.regions,
    bottlenecks: infraOut.state.bottlenecks,
    linkageHubs,
    corridorFlows,
  });
  const maxMigrationPressure = migrationPressure[0]?.netPressure ?? 0;

  const settlementVulnerability = op10mA11ComputeSettlementVulnerability({
    regions: urbanOut.state.regions,
    bottlenecks: infraOut.state.bottlenecks,
    linkageHubs,
    fragilityIndex,
  });

  const fiscalOut = op10mA11ComputeFiscalUrbanCoupling({
    national: inputs.urban.national,
    regions: urbanOut.state.regions,
  });

  const regionalCohesionIndex = op10mA11RegionalCohesionIndex({
    inequalityIndex: urbanOut.state.inequalityIndex,
    fragilityIndex,
    fiscalNationalIndex: fiscalOut.nationalIndex,
    maxMigrationPressure,
  });

  const absorptionStress = op10mA11ComputeMetropolitanAbsorptionStress(inputs.urban.cities);
  const metropolitanSaturationIndex = op10mA11NationalMetropolitanSaturation(absorptionStress);

  const serviceEquityOut = op10mA11ComputeRegionalServiceEquity({
    settlement: settlementVulnerability,
    fiscal: fiscalOut.rows,
  });

  const standingSpread = op10mA11StandingSpread(urbanOut.state.regions);
  const convergence = op10mA11ComputeRegionalConvergence({
    regions: urbanOut.state.regions,
    priorStandingSpread: base.revision > 0 ? base.lastStandingSpread : null,
  });

  const periUrbanPressure = op10mA11ComputePeriUrbanExpansionPressure({
    cities: inputs.urban.cities,
    corridorFlows,
  });
  const nationalPeriUrbanPressureIndex = op10mA11NationalPeriUrbanPressureIndex(periUrbanPressure);

  const backlogOut = op10mA11ComputeRegionalInfrastructureBacklog({
    bottlenecks: infraOut.state.bottlenecks,
    absorptionStress,
    corridorStressIndex: infraOut.state.corridorStressIndex,
  });

  const governanceOut = op10mA11ComputeMultiTierGovernanceFriction({
    national: inputs.urban.national,
    reliefPlaybook,
    serviceEquity: serviceEquityOut.rows,
  });

  const housingSpilloverOut = op10mA11ComputeRegionalHousingSpilloverPressure({
    absorptionStress,
    periUrbanPressure,
    corridorFlows,
  });

  const talentOut = op10mA11ComputeInterregionalTalentRetentionStress({
    migrationPressure,
    linkageHubs,
    fiscalUrbanCoupling: fiscalOut.rows,
  });

  const climateOut = op10mA11ComputeClimateSettlementDisplacementRisk({
    settlementVulnerability,
    bottlenecks: infraOut.state.bottlenecks,
    networkDigital: inputs.infra.networkDigital,
    corridorStressIndex: infraOut.state.corridorStressIndex,
  });

  const amenityOut = op10mA11ComputeRegionalAmenityCostPressure({
    housingSpillover: housingSpilloverOut.rows,
    talentRetention: talentOut.rows,
    fiscalUrbanCoupling: fiscalOut.rows,
  });

  const decentralOut = op10mA11ComputeDigitalConnectivityDecentralizationShift({
    networkDigital: inputs.urban.national.networkDigital,
    migrationPressure,
    linkageHubs,
    hierarchy,
  });

  const relocationOut = op10mA11ComputeSettlementRelocationBurden({
    climateDisplacement: climateOut.rows,
    governanceFriction: governanceOut.rows,
    housingSpillover: housingSpilloverOut.rows,
  });

  const employmentAnchorOut = op10mA11ComputeRegionalEmploymentAnchorStress({
    decentralizationShift: decentralOut.rows,
    talentRetention: talentOut.rows,
    linkageHubs,
  });

  const commuteWedgeOut = op10mA11ComputeInterregionalCommuteAffordabilityWedge({
    amenityCost: amenityOut.rows,
    periUrbanPressure,
    corridorFlows,
  });

  const receptionStrainOut = op10mA11ComputeSettlementReceptionCapacityStrain({
    relocationBurden: relocationOut.rows,
    absorptionStress,
    serviceEquity: serviceEquityOut.rows,
  });

  const landUseGridlockOut = op10mA11ComputeRegionalLandUseRegulatoryGridlock({
    governanceFriction: governanceOut.rows,
    periUrbanPressure,
    housingSpillover: housingSpilloverOut.rows,
  });

  const mobilityTrapOut = op10mA11ComputeInterregionalMobilityAffordabilityTrap({
    commuteWedge: commuteWedgeOut.rows,
    migrationPressure,
    amenityCost: amenityOut.rows,
  });

  const absorptionGapOut = op10mA11ComputeSettlementInfrastructureAbsorptionGap({
    infrastructureBacklog: backlogOut.rows,
    receptionStrain: receptionStrainOut.rows,
    absorptionStress,
  });

  const reliefOverheadOut = op10mA11ComputeRegionalReliefCoordinationOverhead({
    reliefPlaybook,
    governanceFriction: governanceOut.rows,
    receptionStrain: receptionStrainOut.rows,
  });

  const corridorEquityDriftOut = op10mA11ComputeInterregionalCorridorEquityDrift({
    corridorFlows,
    serviceEquity: serviceEquityOut.rows,
    commuteWedge: commuteWedgeOut.rows,
  });

  const climateAdaptationLagOut = op10mA11ComputeSettlementClimateAdaptationLag({
    climateDisplacement: climateOut.rows,
    absorptionGap: absorptionGapOut.rows,
    infrastructureBacklog: backlogOut.rows,
  });

  const fiscalCapacityStrainOut = op10mA11ComputeRegionalFiscalCapacityStrain({
    fiscalUrbanCoupling: fiscalOut.rows,
    reliefOverhead: reliefOverheadOut.rows,
    governanceFriction: governanceOut.rows,
  });

  const networkErosionOut = op10mA11ComputeInterregionalNetworkResilienceErosion({
    linkageHubs,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    infrastructureBacklog: backlogOut.rows,
    fragilityIndex,
  });

  const longHorizonRiskOut = op10mA11ComputeSettlementLongHorizonCapacityRisk({
    climateAdaptationLag: climateAdaptationLagOut.rows,
    mobilityTrap: mobilityTrapOut.rows,
    convergence,
  });

  const cohesionIntegrityOut = op10mA11ComputeRegionalCohesionIntegrityPressure({
    regionalCohesionIndex,
    networkResilienceErosion: networkErosionOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const reliefEquityGapOut = op10mA11ComputeInterregionalReliefDeliveryEquityGap({
    reliefOverhead: reliefOverheadOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    serviceEquity: serviceEquityOut.rows,
  });

  const systemicFragilityOut = op10mA11ComputeSettlementSystemicFragilityComposite({
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
    landUseGridlock: landUseGridlockOut.rows,
    relocationBurden: relocationOut.rows,
  });

  const governanceResilienceDecayOut = op10mA11ComputeRegionalGovernanceResilienceDecay({
    governanceFriction: governanceOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    reliefEquityGap: reliefEquityGapOut.rows,
  });

  const migrationStabilityErosionOut = op10mA11ComputeInterregionalMigrationStabilityErosion({
    migrationPressure,
    mobilityTrap: mobilityTrapOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const adaptiveCapacityCeilingOut = op10mA11ComputeSettlementAdaptiveCapacityCeiling({
    climateAdaptationLag: climateAdaptationLagOut.rows,
    receptionStrain: receptionStrainOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const fiscalGovernanceCouplingOut = op10mA11ComputeRegionalFiscalGovernanceCouplingStrain({
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const networkEquityTensionOut = op10mA11ComputeInterregionalNetworkEquityTension({
    networkResilienceErosion: networkErosionOut.rows,
    reliefEquityGap: reliefEquityGapOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
  });

  const resilienceFrontierOut = op10mA11ComputeSettlementResilienceFrontierPressure({
    systemicFragility: systemicFragilityOut.rows,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
  });

  const metaGovernanceFatigueOut = op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue({
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    governanceFriction: governanceOut.rows,
    reliefOverhead: reliefOverheadOut.rows,
  });

  const capitalMobilityAsymmetryOut = op10mA11ComputeInterregionalCapitalMobilityAsymmetry({
    networkEquityTension: networkEquityTensionOut.rows,
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
  });

  const compoundShockSaturationOut = op10mA11ComputeSettlementCompoundShockSaturation({
    resilienceFrontier: resilienceFrontierOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    migrationStabilityErosion: migrationStabilityErosionOut.rows,
  });

  const institutionalTrustErosionOut = op10mA11ComputeRegionalInstitutionalTrustErosion({
    metaGovernanceFatigue: metaGovernanceFatigueOut.rows,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const liquidityFragmentationOut = op10mA11ComputeInterregionalLiquidityFragmentationStress({
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
    networkEquityTension: networkEquityTensionOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const cascadingFailureRiskOut = op10mA11ComputeSettlementCascadingFailureRisk({
    compoundShockSaturation: compoundShockSaturationOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
  });

  const socialContractFragilityOut = op10mA11ComputeRegionalSocialContractFragility({
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
  });

  const capitalFlightPanicOut = op10mA11ComputeInterregionalCapitalFlightPanic({
    liquidityFragmentation: liquidityFragmentationOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
  });

  const irrecoverableCollapseOut = op10mA11ComputeSettlementIrrecoverableCollapseThreshold({
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    compoundShockSaturation: compoundShockSaturationOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
  });

  const settlementLegitimacyCollapseOut = op10mA11ComputeRegionalSettlementLegitimacyCollapse({
    socialContractFragility: socialContractFragilityOut.rows,
    capitalFlightPanic: capitalFlightPanicOut.rows,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
  });

  const fiscalPanicContagionOut = op10mA11ComputeInterregionalFiscalPanicContagion({
    capitalFlightPanic: capitalFlightPanicOut.rows,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    socialContractFragility: socialContractFragilityOut.rows,
  });

  const terminalStateLockInOut = op10mA11ComputeSettlementTerminalStateLockIn({
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    socialContractFragility: socialContractFragilityOut.rows,
  });

  const governanceVacuumEscalationOut = op10mA11ComputeRegionalGovernanceVacuumEscalation({
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
  });

  const settlementAbandonmentSpiralOut = op10mA11ComputeInterregionalSettlementAbandonmentSpiral({
    terminalStateLockIn: terminalStateLockInOut.rows,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    capitalFlightPanic: capitalFlightPanicOut.rows,
  });

  const postCollapseRecoveryImpossibilityOut = op10mA11ComputeSettlementPostCollapseRecoveryImpossibility({
    terminalStateLockIn: terminalStateLockInOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
  });

  const stateCollapseCascadeAmplificationOut = op10mA11ComputeRegionalStateCollapseCascadeAmplification({
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
  });

  const hollowRegionContagionOut = op10mA11ComputeInterregionalHollowRegionContagion({
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
  });

  const permanentDepopulationLockOut = op10mA11ComputeSettlementPermanentDepopulationLock({
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    terminalStateLockIn: terminalStateLockInOut.rows,
  });

  const totalCollapseSingularityOut = op10mA11ComputeRegionalTotalCollapseSingularityPressure({
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
    hollowRegionContagion: hollowRegionContagionOut.rows,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
  });

  const voidExpansionVelocityOut = op10mA11ComputeInterregionalVoidExpansionVelocity({
    hollowRegionContagion: hollowRegionContagionOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
  });

  const existentialContinuityFractureOut = op10mA11ComputeSettlementExistentialContinuityFracture({
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
  });

  const collapseHorizonConvergenceOut = op10mA11ComputeRegionalCollapseHorizonConvergence({
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
  });

  const voidTotalizationSurgeOut = op10mA11ComputeInterregionalVoidTotalizationSurge({
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    hollowRegionContagion: hollowRegionContagionOut.rows,
  });

  const existentialTerminusLockOut = op10mA11ComputeSettlementExistentialTerminusLock({
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
  });

  const absoluteCollapseHorizonLockOut = op10mA11ComputeRegionalAbsoluteCollapseHorizonLock({
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    existentialTerminusLock: existentialTerminusLockOut.rows,
  });

  const voidFinalizationCascadeOut = op10mA11ComputeInterregionalVoidFinalizationCascade({
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
  });

  const existentialObliterationThresholdOut = op10mA11ComputeSettlementExistentialObliterationThreshold({
    existentialTerminusLock: existentialTerminusLockOut.rows,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
  });

  const ultimateCollapseSingularitySealOut = op10mA11ComputeRegionalUltimateCollapseSingularitySeal({
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
  });

  const voidAnnihilationConvergenceOut = op10mA11ComputeInterregionalVoidAnnihilationConvergence({
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
  });

  const existentialNullStateLockOut = op10mA11ComputeSettlementExistentialNullStateLock({
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    existentialTerminusLock: existentialTerminusLockOut.rows,
  });

  const collapseExistenceSingularityPointOut = op10mA11ComputeRegionalCollapseExistenceSingularityPoint({
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    existentialNullStateLock: existentialNullStateLockOut.rows,
  });

  const voidExistenceAnnihilationFrontOut = op10mA11ComputeInterregionalVoidExistenceAnnihilationFront({
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
  });

  const existentialAbsoluteZeroLockOut = op10mA11ComputeSettlementExistentialAbsoluteZeroLock({
    existentialNullStateLock: existentialNullStateLockOut.rows,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
  });

  const collapseOmniSingularityNodeOut = op10mA11ComputeRegionalCollapseOmniSingularityNode({
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
  });

  const voidAbsoluteErosionSurgeOut = op10mA11ComputeInterregionalVoidAbsoluteErosionSurge({
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
  });

  const existentialFinalNullityLockOut = op10mA11ComputeSettlementExistentialFinalNullityLock({
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    existentialNullStateLock: existentialNullStateLockOut.rows,
  });

  const collapseTotalSingularityVertexOut = op10mA11ComputeRegionalCollapseTotalSingularityVertex({
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
  });

  const voidTerminalErosionCascadeOut = op10mA11ComputeInterregionalVoidTerminalErosionCascade({
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialUltimateNullitySealOut = op10mA11ComputeSettlementExistentialUltimateNullitySeal({
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
  });

  const collapseAbsoluteSingularityApexOut = op10mA11ComputeRegionalCollapseAbsoluteSingularityApex({
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
  });

  const voidCompleteErosionTerminalityOut = op10mA11ComputeInterregionalVoidCompleteErosionTerminality({
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialFinalNullityClosureOut = op10mA11ComputeSettlementExistentialFinalNullityClosure({
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
  });

  const collapseUltimateSingularityZenithOut = op10mA11ComputeRegionalCollapseUltimateSingularityZenith({
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
  });

  const voidTotalErosionFinalityOut = op10mA11ComputeInterregionalVoidTotalErosionFinality({
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityVerdictOut = op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict({
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
  });

  const collapseTotalSingularityNexusOut = op10mA11ComputeRegionalCollapseTotalSingularityNexus({
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
  });

  const voidAbsoluteErosionTerminationOut = op10mA11ComputeInterregionalVoidAbsoluteErosionTermination({
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialFinalNullitySentenceOut = op10mA11ComputeSettlementExistentialFinalNullitySentence({
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
  });

  const collapseAbsoluteSingularityCulminationOut = op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination({
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const voidCompleteErosionExtinctionOut = op10mA11ComputeInterregionalVoidCompleteErosionExtinction({
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialTotalNullityDecreeOut = op10mA11ComputeSettlementExistentialTotalNullityDecree({
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
  });

  const collapseOmniSingularitySynthesisOut = op10mA11ComputeRegionalCollapseOmniSingularitySynthesis({
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
  });

  const voidTotalErosionAnnihilationOut = op10mA11ComputeInterregionalVoidTotalErosionAnnihilation({
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityMandateOut = op10mA11ComputeSettlementExistentialAbsoluteNullityMandate({
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityConvergenceOut = op10mA11ComputeRegionalCollapseOmniSingularityConvergence({
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
  });

  const voidTotalErosionObliterationOut = op10mA11ComputeInterregionalVoidTotalErosionObliteration({
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityBindingOut = op10mA11ComputeSettlementExistentialAbsoluteNullityBinding({
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityIntegrationOut = op10mA11ComputeRegionalCollapseOmniSingularityIntegration({
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
  });

  const voidTotalErosionEradicationOut = op10mA11ComputeInterregionalVoidTotalErosionEradication({
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityContinuityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity({
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityUnificationOut = op10mA11ComputeRegionalCollapseOmniSingularityUnification({
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
  });

  const voidTotalErosionEliminationOut = op10mA11ComputeInterregionalVoidTotalErosionElimination({
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityPerpetuityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity({
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const derivedRaw: Omit<OP10M_A11_CompositeDerivedEvent, 'id'>[] = [];
  if (nationalPrimateIndex >= 58) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'primate_concentration_risk',
      hierarchy.filter((h) => h.primateBand === 'concentrated' || h.primateBand === 'hyper_concentrated').map((h) => h.regionId),
      `National primate concentration elevated (index ${nationalPrimateIndex}).`,
      nationalPrimateIndex >= 68 ? 'major' : 'meaningful',
    );
  }
  if (fragilityIndex >= 45 || (base.revision > 0 && fragilityIndex > base.lastFragilityIndex + 5)) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_linkage_fragility',
      weakRegions,
      `Regional linkage fragility index ${fragilityIndex.toFixed(1)}.`,
    );
  }
  const urgent = reliefPlaybook.filter((r) => r.priority === 'urgent' || r.priority === 'high');
  if (urgent.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'integrated_relief_priority',
      urgent.map((u) => u.regionId),
      `Integrated relief priorities: ${urgent.map((u) => u.regionId).join(', ')}.`,
    );
  }

  const surge = op10mA11SurgeCorridors(corridorFlows);
  if (surge.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'corridor_flow_surge',
      [...new Set(surge.flatMap((s) => [s.fromRegion, s.toRegion]))],
      `Corridor flow surge on ${surge.length} regional pair(s); peak pressure ${maxCorridorFlow.toFixed(1)}.`,
      maxCorridorFlow >= 72 ? 'major' : 'meaningful',
    );
  }

  const overloaded = op10mA11OverloadedHubs(linkageHubs);
  if (overloaded.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'linkage_hub_overload',
      overloaded.map((h) => h.regionId),
      `Linkage hubs under load: ${overloaded.map((h) => h.regionId).join(', ')}.`,
    );
  }

  const isolated = op10mA11DeeplyIsolatedRegions(linkageHubs);
  if (isolated.length >= 2) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'peripheral_isolation_deepening',
      isolated,
      `Peripheral isolation deepening for ${isolated.join(', ')}.`,
      'minor',
    );
  }

  const migrationSurge = op10mA11RegionsWithMigrationSurge(migrationPressure);
  if (migrationSurge.length >= 2) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'migration_pressure_spike',
      migrationSurge,
      `Migration pressure elevated in ${migrationSurge.join(', ')} (peak ${maxMigrationPressure.toFixed(1)}).`,
      maxMigrationPressure >= 58 ? 'major' : 'meaningful',
    );
  }

  const criticalSettlement = op10mA11CriticalSettlementRegions(settlementVulnerability);
  if (criticalSettlement.length >= 1) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_vulnerability_critical',
      criticalSettlement.slice(0, 4),
      `Settlement vulnerability critical for ${criticalSettlement.slice(0, 3).join(', ')}.`,
      criticalSettlement.length >= 3 ? 'major' : 'meaningful',
    );
  }

  const fiscalMisaligned = op10mA11MisalignedFiscalRegions(fiscalOut.rows);
  if (
    fiscalMisaligned.length >= 3 ||
    (inputs.urban.national.distributionBand === 'highly_uneven' && fiscalOut.nationalIndex < 40)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_coupling_mismatch',
      fiscalMisaligned.slice(0, 5),
      `Fiscal–urban coupling strained (national index ${fiscalOut.nationalIndex.toFixed(1)}).`,
      fiscalOut.nationalIndex < 32 ? 'major' : 'meaningful',
    );
  }

  if (
    base.revision > 0 &&
    regionalCohesionIndex < base.lastCohesionIndex - 8 &&
    regionalCohesionIndex < 45
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_linkage_fragility',
      weakRegions,
      `Regional cohesion slipped to ${regionalCohesionIndex.toFixed(1)} (was ${base.lastCohesionIndex.toFixed(1)}).`,
    );
  }

  const absorptionBreach = op10mA11RegionsWithAbsorptionBreach(absorptionStress);
  if (absorptionBreach.length >= 2 || metropolitanSaturationIndex >= 58) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'absorption_capacity_breach',
      absorptionBreach.slice(0, 5),
      `Metropolitan absorption strained (saturation ${metropolitanSaturationIndex.toFixed(1)}); ${absorptionBreach.slice(0, 3).join(', ')}.`,
      metropolitanSaturationIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const equityGap = op10mA11RegionsWithServiceEquityGap(serviceEquityOut.rows);
  if (
    equityGap.length >= 3 ||
    (serviceEquityOut.nationalIndex < 38 && base.revision > 0 && serviceEquityOut.nationalIndex < base.lastServiceEquityIndex - 6)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'service_equity_gap',
      equityGap.slice(0, 5),
      `Regional service equity gap (national index ${serviceEquityOut.nationalIndex.toFixed(1)}).`,
      serviceEquityOut.nationalIndex < 30 ? 'major' : 'meaningful',
    );
  }

  const laggingStuck = op10mA11LaggingRegionsNotClosing(urbanOut.state.regions, convergence);
  if (op10mA11ConvergenceStalled(convergence) && (standingSpread >= 32 || laggingStuck.length >= 2)) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'convergence_stall',
      laggingStuck.slice(0, 4),
      `Regional convergence ${convergence.band}; standing spread ${standingSpread.toFixed(1)}.`,
      convergence.band === 'diverging' ? 'major' : 'meaningful',
    );
  }

  const periUrbanHot = op10mA11RegionsWithPeriUrbanSprawl(periUrbanPressure);
  if (periUrbanHot.length >= 2 || nationalPeriUrbanPressureIndex >= 55) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'peri_urban_sprawl_pressure',
      periUrbanHot.slice(0, 5),
      `Peri-urban expansion pressure elevated (index ${nationalPeriUrbanPressureIndex.toFixed(1)}).`,
      nationalPeriUrbanPressureIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const backlogCritical = op10mA11RegionsWithCriticalBacklog(backlogOut.rows);
  if (
    backlogCritical.length >= 2 ||
    backlogOut.nationalIndex >= 52 ||
    (base.revision > 0 && backlogOut.nationalIndex > base.lastInfrastructureBacklogIndex + 7)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'infrastructure_backlog_critical',
      backlogCritical.slice(0, 5),
      `Regional infrastructure backlog critical (index ${backlogOut.nationalIndex.toFixed(1)}).`,
      backlogOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const governanceBreakdown = op10mA11RegionsWithGovernanceBreakdown(governanceOut.rows);
  if (
    governanceBreakdown.length >= 3 ||
    op10mA11GovernanceFrictionEscalating(governanceOut.nationalIndex, base.revision > 0 ? base.lastGovernanceFrictionIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_coordination_breakdown',
      governanceBreakdown.slice(0, 5),
      `Multi-tier governance friction (index ${governanceOut.nationalIndex.toFixed(1)}).`,
      governanceOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const spilloverHot = op10mA11RegionsWithHousingSpilloverCascade(housingSpilloverOut.rows);
  if (
    spilloverHot.length >= 2 ||
    housingSpilloverOut.nationalIndex >= 52 ||
    op10mA11HousingSpilloverEscalating(
      housingSpilloverOut.nationalIndex,
      base.revision > 0 ? base.lastHousingSpilloverIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'housing_spillover_cascade',
      spilloverHot.slice(0, 5),
      `Regional housing spillover cascade (index ${housingSpilloverOut.nationalIndex.toFixed(1)}).`,
      housingSpilloverOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const talentDrain = op10mA11RegionsWithTalentDrain(talentOut.rows);
  if (talentDrain.length >= 2 || talentOut.nationalIndex >= 50) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_talent_drain',
      talentDrain.slice(0, 5),
      `Interregional talent retention stress (drain index ${talentOut.nationalIndex.toFixed(1)}).`,
      talentOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const climateCritical = op10mA11RegionsWithCriticalClimateDisplacement(climateOut.rows);
  if (
    climateCritical.length >= 2 ||
    climateOut.nationalIndex >= 48 ||
    (base.revision > 0 && climateOut.nationalIndex > base.lastClimateDisplacementIndex + 6)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'climate_displacement_exposure',
      climateCritical.slice(0, 5),
      `Climate settlement displacement exposure (index ${climateOut.nationalIndex.toFixed(1)}).`,
      climateOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const amenityCrisis = op10mA11RegionsWithAmenityCostCrisis(amenityOut.rows);
  if (
    amenityCrisis.length >= 2 ||
    amenityOut.nationalIndex >= 50 ||
    op10mA11AmenityCostEscalating(amenityOut.nationalIndex, base.revision > 0 ? base.lastAmenityCostIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'amenity_cost_spiral',
      amenityCrisis.slice(0, 5),
      `Regional amenity cost spiral (index ${amenityOut.nationalIndex.toFixed(1)}).`,
      amenityOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const decentralHot = op10mA11RegionsWithAcceleratingDecentralization(decentralOut.rows);
  if (decentralHot.length >= 3 || decentralOut.nationalIndex >= 52) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'digital_decentralization_pulse',
      decentralHot.slice(0, 5),
      `Digital connectivity decentralization pulse (index ${decentralOut.nationalIndex.toFixed(1)}).`,
      decentralOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const relocationOverwhelm = op10mA11RegionsWithOverwhelmingRelocationBurden(relocationOut.rows);
  if (
    relocationOverwhelm.length >= 2 ||
    relocationOut.nationalIndex >= 48 ||
    op10mA11RelocationBurdenEscalating(
      relocationOut.nationalIndex,
      base.revision > 0 ? base.lastRelocationBurdenIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_relocation_burden',
      relocationOverwhelm.slice(0, 5),
      `Settlement relocation burden (index ${relocationOut.nationalIndex.toFixed(1)}).`,
      relocationOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const anchorFragile = op10mA11RegionsWithFragileEmploymentAnchors(employmentAnchorOut.rows);
  if (
    anchorFragile.length >= 2 ||
    employmentAnchorOut.nationalIndex >= 48 ||
    op10mA11EmploymentAnchorStressEscalating(
      employmentAnchorOut.nationalIndex,
      base.revision > 0 ? base.lastEmploymentAnchorIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'employment_anchor_fragility',
      anchorFragile.slice(0, 5),
      `Regional employment anchor fragility (index ${employmentAnchorOut.nationalIndex.toFixed(1)}).`,
      employmentAnchorOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const commuteSevere = op10mA11RegionsWithSevereCommuteWedge(commuteWedgeOut.rows);
  if (
    commuteSevere.length >= 2 ||
    commuteWedgeOut.nationalIndex >= 50 ||
    op10mA11CommuteWedgeWidening(commuteWedgeOut.nationalIndex, base.revision > 0 ? base.lastCommuteWedgeIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'commute_affordability_wedge',
      commuteSevere.slice(0, 5),
      `Interregional commute affordability wedge (index ${commuteWedgeOut.nationalIndex.toFixed(1)}).`,
      commuteWedgeOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const receptionStrained = op10mA11RegionsWithReceptionCapacityStrain(receptionStrainOut.rows);
  if (
    receptionStrained.length >= 2 ||
    receptionStrainOut.nationalIndex >= 47 ||
    op10mA11ReceptionStrainEscalating(
      receptionStrainOut.nationalIndex,
      base.revision > 0 ? base.lastReceptionStrainIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_reception_strain',
      receptionStrained.slice(0, 5),
      `Settlement reception capacity strain (index ${receptionStrainOut.nationalIndex.toFixed(1)}).`,
      receptionStrainOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const landUseBlocked = op10mA11RegionsWithLandUseGridlock(landUseGridlockOut.rows);
  if (
    landUseBlocked.length >= 2 ||
    landUseGridlockOut.nationalIndex >= 46 ||
    op10mA11LandUseGridlockEscalating(
      landUseGridlockOut.nationalIndex,
      base.revision > 0 ? base.lastLandUseGridlockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'land_use_regulatory_gridlock',
      landUseBlocked.slice(0, 5),
      `Regional land-use regulatory gridlock (index ${landUseGridlockOut.nationalIndex.toFixed(1)}).`,
      landUseGridlockOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const mobilityTrapped = op10mA11RegionsWithMobilityTrap(mobilityTrapOut.rows);
  if (
    mobilityTrapped.length >= 2 ||
    mobilityTrapOut.nationalIndex >= 48 ||
    op10mA11MobilityTrapEscalating(mobilityTrapOut.nationalIndex, base.revision > 0 ? base.lastMobilityTrapIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'mobility_affordability_trap',
      mobilityTrapped.slice(0, 5),
      `Interregional mobility affordability trap (index ${mobilityTrapOut.nationalIndex.toFixed(1)}).`,
      mobilityTrapOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const absorptionGapCritical = op10mA11RegionsWithCriticalAbsorptionGap(absorptionGapOut.rows);
  if (
    absorptionGapCritical.length >= 2 ||
    absorptionGapOut.nationalIndex >= 47 ||
    op10mA11AbsorptionGapEscalating(absorptionGapOut.nationalIndex, base.revision > 0 ? base.lastAbsorptionGapIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'infrastructure_absorption_gap',
      absorptionGapCritical.slice(0, 5),
      `Settlement infrastructure absorption gap (index ${absorptionGapOut.nationalIndex.toFixed(1)}).`,
      absorptionGapOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const reliefOverloaded = op10mA11RegionsWithReliefOverheadCritical(reliefOverheadOut.rows);
  if (
    reliefOverloaded.length >= 2 ||
    reliefOverheadOut.nationalIndex >= 45 ||
    op10mA11ReliefOverheadEscalating(
      reliefOverheadOut.nationalIndex,
      base.revision > 0 ? base.lastReliefOverheadIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'relief_coordination_overhead',
      reliefOverloaded.slice(0, 5),
      `Regional relief coordination overhead (index ${reliefOverheadOut.nationalIndex.toFixed(1)}).`,
      reliefOverheadOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const corridorFractured = op10mA11RegionsWithCorridorEquityFracture(corridorEquityDriftOut.rows);
  if (
    corridorFractured.length >= 2 ||
    corridorEquityDriftOut.nationalIndex >= 46 ||
    op10mA11CorridorEquityDriftEscalating(
      corridorEquityDriftOut.nationalIndex,
      base.revision > 0 ? base.lastCorridorEquityDriftIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'corridor_equity_drift',
      corridorFractured.slice(0, 5),
      `Interregional corridor equity drift (index ${corridorEquityDriftOut.nationalIndex.toFixed(1)}).`,
      corridorEquityDriftOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const adaptationLagCritical = op10mA11RegionsWithCriticalAdaptationLag(climateAdaptationLagOut.rows);
  if (
    adaptationLagCritical.length >= 2 ||
    climateAdaptationLagOut.nationalIndex >= 48 ||
    op10mA11AdaptationLagEscalating(
      climateAdaptationLagOut.nationalIndex,
      base.revision > 0 ? base.lastClimateAdaptationLagIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'climate_adaptation_lag',
      adaptationLagCritical.slice(0, 5),
      `Settlement climate adaptation lag (index ${climateAdaptationLagOut.nationalIndex.toFixed(1)}).`,
      climateAdaptationLagOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const fiscalFragile = op10mA11RegionsWithFiscalCapacityFragility(fiscalCapacityStrainOut.rows);
  if (
    fiscalFragile.length >= 2 ||
    fiscalCapacityStrainOut.nationalIndex >= 46 ||
    op10mA11FiscalCapacityStrainEscalating(
      fiscalCapacityStrainOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalCapacityStrainIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_capacity_strain',
      fiscalFragile.slice(0, 5),
      `Regional fiscal capacity strain (index ${fiscalCapacityStrainOut.nationalIndex.toFixed(1)}).`,
      fiscalCapacityStrainOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const networkFracture = op10mA11RegionsWithNetworkFracture(networkErosionOut.rows);
  if (
    networkFracture.length >= 2 ||
    networkErosionOut.nationalIndex >= 45 ||
    op10mA11NetworkErosionEscalating(
      networkErosionOut.nationalIndex,
      base.revision > 0 ? base.lastNetworkResilienceErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'network_resilience_erosion',
      networkFracture.slice(0, 5),
      `Interregional network resilience erosion (index ${networkErosionOut.nationalIndex.toFixed(1)}).`,
      networkErosionOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const horizonCritical = op10mA11RegionsWithCriticalHorizonRisk(longHorizonRiskOut.rows);
  if (
    horizonCritical.length >= 2 ||
    longHorizonRiskOut.nationalIndex >= 48 ||
    op10mA11HorizonRiskEscalating(
      longHorizonRiskOut.nationalIndex,
      base.revision > 0 ? base.lastLongHorizonCapacityRiskIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'long_horizon_capacity_risk',
      horizonCritical.slice(0, 5),
      `Settlement long-horizon capacity risk (index ${longHorizonRiskOut.nationalIndex.toFixed(1)}).`,
      longHorizonRiskOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const cohesionFractured = op10mA11RegionsWithCohesionIntegrityFracture(cohesionIntegrityOut.rows);
  if (
    cohesionFractured.length >= 2 ||
    cohesionIntegrityOut.nationalIndex >= 44 ||
    op10mA11CohesionIntegrityEscalating(
      cohesionIntegrityOut.nationalIndex,
      base.revision > 0 ? base.lastCohesionIntegrityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'cohesion_integrity_stress',
      cohesionFractured.slice(0, 5),
      `Regional cohesion integrity stress (index ${cohesionIntegrityOut.nationalIndex.toFixed(1)}).`,
      cohesionIntegrityOut.nationalIndex >= 53 ? 'major' : 'meaningful',
    );
  }

  const reliefPolarized = op10mA11RegionsWithPolarizedReliefEquity(reliefEquityGapOut.rows);
  if (
    reliefPolarized.length >= 2 ||
    reliefEquityGapOut.nationalIndex >= 43 ||
    op10mA11ReliefEquityGapEscalating(
      reliefEquityGapOut.nationalIndex,
      base.revision > 0 ? base.lastReliefEquityGapIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'relief_delivery_equity_gap',
      reliefPolarized.slice(0, 5),
      `Interregional relief delivery equity gap (index ${reliefEquityGapOut.nationalIndex.toFixed(1)}).`,
      reliefEquityGapOut.nationalIndex >= 52 ? 'major' : 'meaningful',
    );
  }

  const systemicCascade = op10mA11RegionsWithSystemicCascadeRisk(systemicFragilityOut.rows);
  if (
    systemicCascade.length >= 2 ||
    systemicFragilityOut.nationalIndex >= 49 ||
    op10mA11SystemicFragilityEscalating(
      systemicFragilityOut.nationalIndex,
      base.revision > 0 ? base.lastSystemicFragilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'systemic_settlement_fragility',
      systemicCascade.slice(0, 5),
      `Settlement systemic fragility (index ${systemicFragilityOut.nationalIndex.toFixed(1)}).`,
      systemicFragilityOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const governanceCollapsed = op10mA11RegionsWithGovernanceResilienceCollapse(governanceResilienceDecayOut.rows);
  if (
    governanceCollapsed.length >= 2 ||
    governanceResilienceDecayOut.nationalIndex >= 45 ||
    op10mA11GovernanceResilienceDecayEscalating(
      governanceResilienceDecayOut.nationalIndex,
      base.revision > 0 ? base.lastGovernanceResilienceDecayIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_resilience_decay',
      governanceCollapsed.slice(0, 5),
      `Regional governance resilience decay (index ${governanceResilienceDecayOut.nationalIndex.toFixed(1)}).`,
      governanceResilienceDecayOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const migrationChaos = op10mA11RegionsWithMigrationChaos(migrationStabilityErosionOut.rows);
  if (
    migrationChaos.length >= 2 ||
    migrationStabilityErosionOut.nationalIndex >= 46 ||
    op10mA11MigrationStabilityErosionEscalating(
      migrationStabilityErosionOut.nationalIndex,
      base.revision > 0 ? base.lastMigrationStabilityErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'migration_stability_erosion',
      migrationChaos.slice(0, 5),
      `Interregional migration stability erosion (index ${migrationStabilityErosionOut.nationalIndex.toFixed(1)}).`,
      migrationStabilityErosionOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const ceilingBreached = op10mA11RegionsWithBreachedAdaptiveCeiling(adaptiveCapacityCeilingOut.rows);
  if (
    ceilingBreached.length >= 2 ||
    adaptiveCapacityCeilingOut.nationalIndex >= 48 ||
    op10mA11AdaptiveCeilingEscalating(
      adaptiveCapacityCeilingOut.nationalIndex,
      base.revision > 0 ? base.lastAdaptiveCapacityCeilingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'adaptive_capacity_ceiling',
      ceilingBreached.slice(0, 5),
      `Settlement adaptive capacity ceiling (index ${adaptiveCapacityCeilingOut.nationalIndex.toFixed(1)}).`,
      adaptiveCapacityCeilingOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const fiscalGovernanceRupture = op10mA11RegionsWithFiscalGovernanceRupture(fiscalGovernanceCouplingOut.rows);
  if (
    fiscalGovernanceRupture.length >= 2 ||
    fiscalGovernanceCouplingOut.nationalIndex >= 44 ||
    op10mA11FiscalGovernanceCouplingEscalating(
      fiscalGovernanceCouplingOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalGovernanceCouplingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_governance_coupling_strain',
      fiscalGovernanceRupture.slice(0, 5),
      `Regional fiscal–governance coupling strain (index ${fiscalGovernanceCouplingOut.nationalIndex.toFixed(1)}).`,
      fiscalGovernanceCouplingOut.nationalIndex >= 53 ? 'major' : 'meaningful',
    );
  }

  const networkEquityFracture = op10mA11RegionsWithNetworkEquityFracture(networkEquityTensionOut.rows);
  if (
    networkEquityFracture.length >= 2 ||
    networkEquityTensionOut.nationalIndex >= 43 ||
    op10mA11NetworkEquityTensionEscalating(
      networkEquityTensionOut.nationalIndex,
      base.revision > 0 ? base.lastNetworkEquityTensionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'network_equity_tension',
      networkEquityFracture.slice(0, 5),
      `Interregional network equity tension (index ${networkEquityTensionOut.nationalIndex.toFixed(1)}).`,
      networkEquityTensionOut.nationalIndex >= 52 ? 'major' : 'meaningful',
    );
  }

  const frontierBreached = op10mA11RegionsWithBreachedResilienceFrontier(resilienceFrontierOut.rows);
  if (
    frontierBreached.length >= 2 ||
    resilienceFrontierOut.nationalIndex >= 49 ||
    op10mA11ResilienceFrontierEscalating(
      resilienceFrontierOut.nationalIndex,
      base.revision > 0 ? base.lastResilienceFrontierIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'resilience_frontier_pressure',
      frontierBreached.slice(0, 5),
      `Settlement resilience frontier pressure (index ${resilienceFrontierOut.nationalIndex.toFixed(1)}).`,
      resilienceFrontierOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const metaGovernanceExhausted = op10mA11RegionsWithMetaGovernanceExhaustion(metaGovernanceFatigueOut.rows);
  if (
    metaGovernanceExhausted.length >= 2 ||
    metaGovernanceFatigueOut.nationalIndex >= 46 ||
    op10mA11MetaGovernanceFatigueEscalating(
      metaGovernanceFatigueOut.nationalIndex,
      base.revision > 0 ? base.lastMetaGovernanceFatigueIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'meta_governance_coordination_fatigue',
      metaGovernanceExhausted.slice(0, 5),
      `Regional meta-governance coordination fatigue (index ${metaGovernanceFatigueOut.nationalIndex.toFixed(1)}).`,
      metaGovernanceFatigueOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const capitalMobilityLocked = op10mA11RegionsWithLockedCapitalMobility(capitalMobilityAsymmetryOut.rows);
  if (
    capitalMobilityLocked.length >= 2 ||
    capitalMobilityAsymmetryOut.nationalIndex >= 44 ||
    op10mA11CapitalMobilityAsymmetryEscalating(
      capitalMobilityAsymmetryOut.nationalIndex,
      base.revision > 0 ? base.lastCapitalMobilityAsymmetryIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'capital_mobility_asymmetry',
      capitalMobilityLocked.slice(0, 5),
      `Interregional capital mobility asymmetry (index ${capitalMobilityAsymmetryOut.nationalIndex.toFixed(1)}).`,
      capitalMobilityAsymmetryOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const compoundShocksOverwhelming = op10mA11RegionsWithOverwhelmingCompoundShocks(compoundShockSaturationOut.rows);
  if (
    compoundShocksOverwhelming.length >= 2 ||
    compoundShockSaturationOut.nationalIndex >= 50 ||
    op10mA11CompoundShockSaturationEscalating(
      compoundShockSaturationOut.nationalIndex,
      base.revision > 0 ? base.lastCompoundShockSaturationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'compound_shock_saturation',
      compoundShocksOverwhelming.slice(0, 5),
      `Settlement compound shock saturation (index ${compoundShockSaturationOut.nationalIndex.toFixed(1)}).`,
      compoundShockSaturationOut.nationalIndex >= 60 ? 'major' : 'meaningful',
    );
  }

  const institutionalTrustBreakdown = op10mA11RegionsWithInstitutionalTrustBreakdown(institutionalTrustErosionOut.rows);
  if (
    institutionalTrustBreakdown.length >= 2 ||
    institutionalTrustErosionOut.nationalIndex >= 47 ||
    op10mA11InstitutionalTrustErosionEscalating(
      institutionalTrustErosionOut.nationalIndex,
      base.revision > 0 ? base.lastInstitutionalTrustErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'institutional_trust_erosion',
      institutionalTrustBreakdown.slice(0, 5),
      `Regional institutional trust erosion (index ${institutionalTrustErosionOut.nationalIndex.toFixed(1)}).`,
      institutionalTrustErosionOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const liquidityFrozen = op10mA11RegionsWithFrozenLiquidity(liquidityFragmentationOut.rows);
  if (
    liquidityFrozen.length >= 2 ||
    liquidityFragmentationOut.nationalIndex >= 45 ||
    op10mA11LiquidityFragmentationEscalating(
      liquidityFragmentationOut.nationalIndex,
      base.revision > 0 ? base.lastLiquidityFragmentationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'liquidity_fragmentation_stress',
      liquidityFrozen.slice(0, 5),
      `Interregional liquidity fragmentation stress (index ${liquidityFragmentationOut.nationalIndex.toFixed(1)}).`,
      liquidityFragmentationOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const cascadeSystemic = op10mA11RegionsWithSystemicCascadeRisk(cascadingFailureRiskOut.rows);
  if (
    cascadeSystemic.length >= 2 ||
    cascadingFailureRiskOut.nationalIndex >= 51 ||
    op10mA11CascadingFailureRiskEscalating(
      cascadingFailureRiskOut.nationalIndex,
      base.revision > 0 ? base.lastCascadingFailureRiskIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'cascading_failure_risk',
      cascadeSystemic.slice(0, 5),
      `Settlement cascading failure risk (index ${cascadingFailureRiskOut.nationalIndex.toFixed(1)}).`,
      cascadingFailureRiskOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const socialContractRupture = op10mA11RegionsWithRupturedSocialContract(socialContractFragilityOut.rows);
  if (
    socialContractRupture.length >= 2 ||
    socialContractFragilityOut.nationalIndex >= 48 ||
    op10mA11SocialContractFragilityEscalating(
      socialContractFragilityOut.nationalIndex,
      base.revision > 0 ? base.lastSocialContractFragilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'social_contract_fragility',
      socialContractRupture.slice(0, 5),
      `Regional social contract fragility (index ${socialContractFragilityOut.nationalIndex.toFixed(1)}).`,
      socialContractFragilityOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const capitalFlightStampede = op10mA11RegionsWithCapitalFlightStampede(capitalFlightPanicOut.rows);
  if (
    capitalFlightStampede.length >= 2 ||
    capitalFlightPanicOut.nationalIndex >= 47 ||
    op10mA11CapitalFlightPanicEscalating(
      capitalFlightPanicOut.nationalIndex,
      base.revision > 0 ? base.lastCapitalFlightPanicIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'capital_flight_panic',
      capitalFlightStampede.slice(0, 5),
      `Interregional capital flight panic (index ${capitalFlightPanicOut.nationalIndex.toFixed(1)}).`,
      capitalFlightPanicOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const irrecoverableCollapse = op10mA11RegionsWithIrrecoverableCollapse(irrecoverableCollapseOut.rows);
  if (
    irrecoverableCollapse.length >= 2 ||
    irrecoverableCollapseOut.nationalIndex >= 52 ||
    op10mA11IrrecoverableCollapseThresholdEscalating(
      irrecoverableCollapseOut.nationalIndex,
      base.revision > 0 ? base.lastIrrecoverableCollapseThresholdIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'irrecoverable_collapse_threshold',
      irrecoverableCollapse.slice(0, 5),
      `Settlement irrecoverable collapse threshold (index ${irrecoverableCollapseOut.nationalIndex.toFixed(1)}).`,
      irrecoverableCollapseOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const legitimacyCollapsed = op10mA11RegionsWithCollapsedSettlementLegitimacy(settlementLegitimacyCollapseOut.rows);
  if (
    legitimacyCollapsed.length >= 2 ||
    settlementLegitimacyCollapseOut.nationalIndex >= 49 ||
    op10mA11SettlementLegitimacyCollapseEscalating(
      settlementLegitimacyCollapseOut.nationalIndex,
      base.revision > 0 ? base.lastSettlementLegitimacyCollapseIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_legitimacy_collapse',
      legitimacyCollapsed.slice(0, 5),
      `Regional settlement legitimacy collapse (index ${settlementLegitimacyCollapseOut.nationalIndex.toFixed(1)}).`,
      settlementLegitimacyCollapseOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const fiscalContagionSystemic = op10mA11RegionsWithSystemicFiscalPanicContagion(fiscalPanicContagionOut.rows);
  if (
    fiscalContagionSystemic.length >= 2 ||
    fiscalPanicContagionOut.nationalIndex >= 48 ||
    op10mA11FiscalPanicContagionEscalating(
      fiscalPanicContagionOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalPanicContagionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_panic_contagion',
      fiscalContagionSystemic.slice(0, 5),
      `Interregional fiscal panic contagion (index ${fiscalPanicContagionOut.nationalIndex.toFixed(1)}).`,
      fiscalPanicContagionOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const terminalLocked = op10mA11RegionsWithTerminalStateLockIn(terminalStateLockInOut.rows);
  if (
    terminalLocked.length >= 2 ||
    terminalStateLockInOut.nationalIndex >= 54 ||
    op10mA11TerminalStateLockInEscalating(
      terminalStateLockInOut.nationalIndex,
      base.revision > 0 ? base.lastTerminalStateLockInIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'terminal_state_lock_in',
      terminalLocked.slice(0, 5),
      `Settlement terminal state lock-in (index ${terminalStateLockInOut.nationalIndex.toFixed(1)}).`,
      terminalStateLockInOut.nationalIndex >= 64 ? 'major' : 'meaningful',
    );
  }

  const governanceVacuum = op10mA11RegionsWithGovernanceVacuum(governanceVacuumEscalationOut.rows);
  if (
    governanceVacuum.length >= 2 ||
    governanceVacuumEscalationOut.nationalIndex >= 50 ||
    op10mA11GovernanceVacuumEscalating(
      governanceVacuumEscalationOut.nationalIndex,
      base.revision > 0 ? base.lastGovernanceVacuumEscalationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_vacuum_escalation',
      governanceVacuum.slice(0, 5),
      `Regional governance vacuum escalation (index ${governanceVacuumEscalationOut.nationalIndex.toFixed(1)}).`,
      governanceVacuumEscalationOut.nationalIndex >= 60 ? 'major' : 'meaningful',
    );
  }

  const abandonmentSpiral = op10mA11RegionsWithSettlementAbandonment(settlementAbandonmentSpiralOut.rows);
  if (
    abandonmentSpiral.length >= 2 ||
    settlementAbandonmentSpiralOut.nationalIndex >= 51 ||
    op10mA11SettlementAbandonmentSpiralEscalating(
      settlementAbandonmentSpiralOut.nationalIndex,
      base.revision > 0 ? base.lastSettlementAbandonmentSpiralIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_abandonment_spiral',
      abandonmentSpiral.slice(0, 5),
      `Interregional settlement abandonment spiral (index ${settlementAbandonmentSpiralOut.nationalIndex.toFixed(1)}).`,
      settlementAbandonmentSpiralOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const recoveryImpossible = op10mA11RegionsWithImpossibleRecovery(postCollapseRecoveryImpossibilityOut.rows);
  if (
    recoveryImpossible.length >= 2 ||
    postCollapseRecoveryImpossibilityOut.nationalIndex >= 55 ||
    op10mA11PostCollapseRecoveryImpossibilityEscalating(
      postCollapseRecoveryImpossibilityOut.nationalIndex,
      base.revision > 0 ? base.lastPostCollapseRecoveryImpossibilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'post_collapse_recovery_impossibility',
      recoveryImpossible.slice(0, 5),
      `Settlement post-collapse recovery impossibility (index ${postCollapseRecoveryImpossibilityOut.nationalIndex.toFixed(1)}).`,
      postCollapseRecoveryImpossibilityOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const runawayCascade = op10mA11RegionsWithRunawayCollapseCascade(stateCollapseCascadeAmplificationOut.rows);
  if (
    runawayCascade.length >= 2 ||
    stateCollapseCascadeAmplificationOut.nationalIndex >= 51 ||
    op10mA11StateCollapseCascadeAmplificationEscalating(
      stateCollapseCascadeAmplificationOut.nationalIndex,
      base.revision > 0 ? base.lastStateCollapseCascadeAmplificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'state_collapse_cascade_amplification',
      runawayCascade.slice(0, 5),
      `Regional state collapse cascade amplification (index ${stateCollapseCascadeAmplificationOut.nationalIndex.toFixed(1)}).`,
      stateCollapseCascadeAmplificationOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const hollowVoided = op10mA11RegionsWithVoidedHollowContagion(hollowRegionContagionOut.rows);
  if (
    hollowVoided.length >= 2 ||
    hollowRegionContagionOut.nationalIndex >= 52 ||
    op10mA11HollowRegionContagionEscalating(
      hollowRegionContagionOut.nationalIndex,
      base.revision > 0 ? base.lastHollowRegionContagionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'hollow_region_contagion',
      hollowVoided.slice(0, 5),
      `Interregional hollow region contagion (index ${hollowRegionContagionOut.nationalIndex.toFixed(1)}).`,
      hollowRegionContagionOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const depopulationLocked = op10mA11RegionsWithPermanentDepopulationLock(permanentDepopulationLockOut.rows);
  if (
    depopulationLocked.length >= 2 ||
    permanentDepopulationLockOut.nationalIndex >= 56 ||
    op10mA11PermanentDepopulationLockEscalating(
      permanentDepopulationLockOut.nationalIndex,
      base.revision > 0 ? base.lastPermanentDepopulationLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'permanent_depopulation_lock',
      depopulationLocked.slice(0, 5),
      `Settlement permanent depopulation lock (index ${permanentDepopulationLockOut.nationalIndex.toFixed(1)}).`,
      permanentDepopulationLockOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const singularityTotal = op10mA11RegionsWithTotalCollapseSingularity(totalCollapseSingularityOut.rows);
  if (
    singularityTotal.length >= 2 ||
    totalCollapseSingularityOut.nationalIndex >= 55 ||
    op10mA11TotalCollapseSingularityEscalating(
      totalCollapseSingularityOut.nationalIndex,
      base.revision > 0 ? base.lastTotalCollapseSingularityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'total_collapse_singularity_pressure',
      singularityTotal.slice(0, 5),
      `Regional total collapse singularity pressure (index ${totalCollapseSingularityOut.nationalIndex.toFixed(1)}).`,
      totalCollapseSingularityOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const voidUnbounded = op10mA11RegionsWithUnboundedVoidExpansion(voidExpansionVelocityOut.rows);
  if (
    voidUnbounded.length >= 2 ||
    voidExpansionVelocityOut.nationalIndex >= 54 ||
    op10mA11VoidExpansionVelocityEscalating(
      voidExpansionVelocityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidExpansionVelocityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_expansion_velocity',
      voidUnbounded.slice(0, 5),
      `Interregional void expansion velocity (index ${voidExpansionVelocityOut.nationalIndex.toFixed(1)}).`,
      voidExpansionVelocityOut.nationalIndex >= 64 ? 'major' : 'meaningful',
    );
  }

  const continuityExtinguished = op10mA11RegionsWithExtinguishedContinuity(existentialContinuityFractureOut.rows);
  if (
    continuityExtinguished.length >= 2 ||
    existentialContinuityFractureOut.nationalIndex >= 57 ||
    op10mA11ExistentialContinuityFractureEscalating(
      existentialContinuityFractureOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialContinuityFractureIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_continuity_fracture',
      continuityExtinguished.slice(0, 5),
      `Settlement existential continuity fracture (index ${existentialContinuityFractureOut.nationalIndex.toFixed(1)}).`,
      existentialContinuityFractureOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const horizonLocked = op10mA11RegionsWithLockedCollapseHorizon(collapseHorizonConvergenceOut.rows);
  if (
    horizonLocked.length >= 2 ||
    collapseHorizonConvergenceOut.nationalIndex >= 56 ||
    op10mA11CollapseHorizonConvergenceEscalating(
      collapseHorizonConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseHorizonConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_horizon_convergence',
      horizonLocked.slice(0, 5),
      `Regional collapse horizon convergence (index ${collapseHorizonConvergenceOut.nationalIndex.toFixed(1)}).`,
      collapseHorizonConvergenceOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const voidAbsolute = op10mA11RegionsWithAbsoluteVoidTotalization(voidTotalizationSurgeOut.rows);
  if (
    voidAbsolute.length >= 2 ||
    voidTotalizationSurgeOut.nationalIndex >= 55 ||
    op10mA11VoidTotalizationSurgeEscalating(
      voidTotalizationSurgeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalizationSurgeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_totalization_surge',
      voidAbsolute.slice(0, 5),
      `Interregional void totalization surge (index ${voidTotalizationSurgeOut.nationalIndex.toFixed(1)}).`,
      voidTotalizationSurgeOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const terminusTerminal = op10mA11RegionsWithTerminalExistentialLock(existentialTerminusLockOut.rows);
  if (
    terminusTerminal.length >= 2 ||
    existentialTerminusLockOut.nationalIndex >= 58 ||
    op10mA11ExistentialTerminusLockEscalating(
      existentialTerminusLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialTerminusLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_terminus_lock',
      terminusTerminal.slice(0, 5),
      `Settlement existential terminus lock (index ${existentialTerminusLockOut.nationalIndex.toFixed(1)}).`,
      existentialTerminusLockOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const horizonAbsolute = op10mA11RegionsWithAbsoluteCollapseHorizonLock(absoluteCollapseHorizonLockOut.rows);
  if (
    horizonAbsolute.length >= 2 ||
    absoluteCollapseHorizonLockOut.nationalIndex >= 57 ||
    op10mA11AbsoluteCollapseHorizonLockEscalating(
      absoluteCollapseHorizonLockOut.nationalIndex,
      base.revision > 0 ? base.lastAbsoluteCollapseHorizonLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'absolute_collapse_horizon_lock',
      horizonAbsolute.slice(0, 5),
      `Regional absolute collapse horizon lock (index ${absoluteCollapseHorizonLockOut.nationalIndex.toFixed(1)}).`,
      absoluteCollapseHorizonLockOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const voidComplete = op10mA11RegionsWithCompleteVoidFinalization(voidFinalizationCascadeOut.rows);
  if (
    voidComplete.length >= 2 ||
    voidFinalizationCascadeOut.nationalIndex >= 56 ||
    op10mA11VoidFinalizationCascadeEscalating(
      voidFinalizationCascadeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidFinalizationCascadeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_finalization_cascade',
      voidComplete.slice(0, 5),
      `Interregional void finalization cascade (index ${voidFinalizationCascadeOut.nationalIndex.toFixed(1)}).`,
      voidFinalizationCascadeOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const obliterated = op10mA11RegionsWithObliteratedExistentialThreshold(existentialObliterationThresholdOut.rows);
  if (
    obliterated.length >= 2 ||
    existentialObliterationThresholdOut.nationalIndex >= 59 ||
    op10mA11ExistentialObliterationThresholdEscalating(
      existentialObliterationThresholdOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialObliterationThresholdIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_obliteration_threshold',
      obliterated.slice(0, 5),
      `Settlement existential obliteration threshold (index ${existentialObliterationThresholdOut.nationalIndex.toFixed(1)}).`,
      existentialObliterationThresholdOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const sealUltimate = op10mA11RegionsWithUltimateCollapseSeal(ultimateCollapseSingularitySealOut.rows);
  if (
    sealUltimate.length >= 2 ||
    ultimateCollapseSingularitySealOut.nationalIndex >= 58 ||
    op10mA11UltimateCollapseSingularitySealEscalating(
      ultimateCollapseSingularitySealOut.nationalIndex,
      base.revision > 0 ? base.lastUltimateCollapseSingularitySealIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'ultimate_collapse_singularity_seal',
      sealUltimate.slice(0, 5),
      `Regional ultimate collapse singularity seal (index ${ultimateCollapseSingularitySealOut.nationalIndex.toFixed(1)}).`,
      ultimateCollapseSingularitySealOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const annihilationTotal = op10mA11RegionsWithTotalVoidAnnihilation(voidAnnihilationConvergenceOut.rows);
  if (
    annihilationTotal.length >= 2 ||
    voidAnnihilationConvergenceOut.nationalIndex >= 57 ||
    op10mA11VoidAnnihilationConvergenceEscalating(
      voidAnnihilationConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAnnihilationConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_annihilation_convergence',
      annihilationTotal.slice(0, 5),
      `Interregional void annihilation convergence (index ${voidAnnihilationConvergenceOut.nationalIndex.toFixed(1)}).`,
      voidAnnihilationConvergenceOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const nullAbsolute = op10mA11RegionsWithAbsoluteExistentialNull(existentialNullStateLockOut.rows);
  if (
    nullAbsolute.length >= 2 ||
    existentialNullStateLockOut.nationalIndex >= 60 ||
    op10mA11ExistentialNullStateLockEscalating(
      existentialNullStateLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialNullStateLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_null_state_lock',
      nullAbsolute.slice(0, 5),
      `Settlement existential null-state lock (index ${existentialNullStateLockOut.nationalIndex.toFixed(1)}).`,
      existentialNullStateLockOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const singularityPoint = op10mA11RegionsWithExistentialSingularityPoint(collapseExistenceSingularityPointOut.rows);
  if (
    singularityPoint.length >= 2 ||
    collapseExistenceSingularityPointOut.nationalIndex >= 59 ||
    op10mA11CollapseExistenceSingularityPointEscalating(
      collapseExistenceSingularityPointOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseExistenceSingularityPointIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_existence_singularity_point',
      singularityPoint.slice(0, 5),
      `Regional collapse existence singularity point (index ${collapseExistenceSingularityPointOut.nationalIndex.toFixed(1)}).`,
      collapseExistenceSingularityPointOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const voidFrontTotal = op10mA11RegionsWithTotalVoidExistenceFront(voidExistenceAnnihilationFrontOut.rows);
  if (
    voidFrontTotal.length >= 2 ||
    voidExistenceAnnihilationFrontOut.nationalIndex >= 58 ||
    op10mA11VoidExistenceAnnihilationFrontEscalating(
      voidExistenceAnnihilationFrontOut.nationalIndex,
      base.revision > 0 ? base.lastVoidExistenceAnnihilationFrontIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_existence_annihilation_front',
      voidFrontTotal.slice(0, 5),
      `Interregional void existence annihilation front (index ${voidExistenceAnnihilationFrontOut.nationalIndex.toFixed(1)}).`,
      voidExistenceAnnihilationFrontOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const zeroLocked = op10mA11RegionsWithAbsoluteZeroLock(existentialAbsoluteZeroLockOut.rows);
  if (
    zeroLocked.length >= 2 ||
    existentialAbsoluteZeroLockOut.nationalIndex >= 61 ||
    op10mA11ExistentialAbsoluteZeroLockEscalating(
      existentialAbsoluteZeroLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteZeroLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_zero_lock',
      zeroLocked.slice(0, 5),
      `Settlement existential absolute zero lock (index ${existentialAbsoluteZeroLockOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteZeroLockOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const omniNode = op10mA11RegionsWithTotalOmniSingularityNode(collapseOmniSingularityNodeOut.rows);
  if (
    omniNode.length >= 2 ||
    collapseOmniSingularityNodeOut.nationalIndex >= 60 ||
    op10mA11CollapseOmniSingularityNodeEscalating(
      collapseOmniSingularityNodeOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityNodeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_node',
      omniNode.slice(0, 5),
      `Regional collapse omni singularity node (index ${collapseOmniSingularityNodeOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityNodeOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const erosionOmni = op10mA11RegionsWithOmniVoidErosion(voidAbsoluteErosionSurgeOut.rows);
  if (
    erosionOmni.length >= 2 ||
    voidAbsoluteErosionSurgeOut.nationalIndex >= 59 ||
    op10mA11VoidAbsoluteErosionSurgeEscalating(
      voidAbsoluteErosionSurgeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAbsoluteErosionSurgeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_absolute_erosion_surge',
      erosionOmni.slice(0, 5),
      `Interregional void absolute erosion surge (index ${voidAbsoluteErosionSurgeOut.nationalIndex.toFixed(1)}).`,
      voidAbsoluteErosionSurgeOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const finalNullity = op10mA11RegionsWithFinalNullityLock(existentialFinalNullityLockOut.rows);
  if (
    finalNullity.length >= 2 ||
    existentialFinalNullityLockOut.nationalIndex >= 62 ||
    op10mA11ExistentialFinalNullityLockEscalating(
      existentialFinalNullityLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullityLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_lock',
      finalNullity.slice(0, 5),
      `Settlement existential final nullity lock (index ${existentialFinalNullityLockOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullityLockOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const singularityVertex = op10mA11RegionsWithCollapseSingularityVertex(collapseTotalSingularityVertexOut.rows);
  if (
    singularityVertex.length >= 2 ||
    collapseTotalSingularityVertexOut.nationalIndex >= 61 ||
    op10mA11CollapseTotalSingularityVertexEscalating(
      collapseTotalSingularityVertexOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseTotalSingularityVertexIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_total_singularity_vertex',
      singularityVertex.slice(0, 5),
      `Regional collapse total singularity vertex (index ${collapseTotalSingularityVertexOut.nationalIndex.toFixed(1)}).`,
      collapseTotalSingularityVertexOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const terminalErosion = op10mA11RegionsWithTotalTerminalErosion(voidTerminalErosionCascadeOut.rows);
  if (
    terminalErosion.length >= 2 ||
    voidTerminalErosionCascadeOut.nationalIndex >= 60 ||
    op10mA11VoidTerminalErosionCascadeEscalating(
      voidTerminalErosionCascadeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTerminalErosionCascadeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_terminal_erosion_cascade',
      terminalErosion.slice(0, 5),
      `Interregional void terminal erosion cascade (index ${voidTerminalErosionCascadeOut.nationalIndex.toFixed(1)}).`,
      voidTerminalErosionCascadeOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const ultimateSeal = op10mA11RegionsWithTotalUltimateNullitySeal(existentialUltimateNullitySealOut.rows);
  if (
    ultimateSeal.length >= 2 ||
    existentialUltimateNullitySealOut.nationalIndex >= 63 ||
    op10mA11ExistentialUltimateNullitySealEscalating(
      existentialUltimateNullitySealOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialUltimateNullitySealIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_ultimate_nullity_seal',
      ultimateSeal.slice(0, 5),
      `Settlement existential ultimate nullity seal (index ${existentialUltimateNullitySealOut.nationalIndex.toFixed(1)}).`,
      existentialUltimateNullitySealOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const singularityApex = op10mA11RegionsWithCollapseSingularityApex(collapseAbsoluteSingularityApexOut.rows);
  if (
    singularityApex.length >= 2 ||
    collapseAbsoluteSingularityApexOut.nationalIndex >= 62 ||
    op10mA11CollapseAbsoluteSingularityApexEscalating(
      collapseAbsoluteSingularityApexOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseAbsoluteSingularityApexIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_absolute_singularity_apex',
      singularityApex.slice(0, 5),
      `Regional collapse absolute singularity apex (index ${collapseAbsoluteSingularityApexOut.nationalIndex.toFixed(1)}).`,
      collapseAbsoluteSingularityApexOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const completeTerminality = op10mA11RegionsWithCompleteErosionTerminality(voidCompleteErosionTerminalityOut.rows);
  if (
    completeTerminality.length >= 2 ||
    voidCompleteErosionTerminalityOut.nationalIndex >= 61 ||
    op10mA11VoidCompleteErosionTerminalityEscalating(
      voidCompleteErosionTerminalityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidCompleteErosionTerminalityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_complete_erosion_terminality',
      completeTerminality.slice(0, 5),
      `Interregional void complete erosion terminality (index ${voidCompleteErosionTerminalityOut.nationalIndex.toFixed(1)}).`,
      voidCompleteErosionTerminalityOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const nullityClosure = op10mA11RegionsWithTotalFinalNullityClosure(existentialFinalNullityClosureOut.rows);
  if (
    nullityClosure.length >= 2 ||
    existentialFinalNullityClosureOut.nationalIndex >= 64 ||
    op10mA11ExistentialFinalNullityClosureEscalating(
      existentialFinalNullityClosureOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullityClosureIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_closure',
      nullityClosure.slice(0, 5),
      `Settlement existential final nullity closure (index ${existentialFinalNullityClosureOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullityClosureOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const singularityZenith = op10mA11RegionsWithCollapseSingularityZenith(collapseUltimateSingularityZenithOut.rows);
  if (
    singularityZenith.length >= 2 ||
    collapseUltimateSingularityZenithOut.nationalIndex >= 63 ||
    op10mA11CollapseUltimateSingularityZenithEscalating(
      collapseUltimateSingularityZenithOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseUltimateSingularityZenithIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_ultimate_singularity_zenith',
      singularityZenith.slice(0, 5),
      `Regional collapse ultimate singularity zenith (index ${collapseUltimateSingularityZenithOut.nationalIndex.toFixed(1)}).`,
      collapseUltimateSingularityZenithOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const totalFinality = op10mA11RegionsWithTotalErosionFinality(voidTotalErosionFinalityOut.rows);
  if (
    totalFinality.length >= 2 ||
    voidTotalErosionFinalityOut.nationalIndex >= 62 ||
    op10mA11VoidTotalErosionFinalityEscalating(
      voidTotalErosionFinalityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionFinalityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_finality',
      totalFinality.slice(0, 5),
      `Interregional void total erosion finality (index ${voidTotalErosionFinalityOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionFinalityOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const nullityVerdict = op10mA11RegionsWithTotalAbsoluteNullityVerdict(existentialAbsoluteNullityVerdictOut.rows);
  if (
    nullityVerdict.length >= 2 ||
    existentialAbsoluteNullityVerdictOut.nationalIndex >= 65 ||
    op10mA11ExistentialAbsoluteNullityVerdictEscalating(
      existentialAbsoluteNullityVerdictOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityVerdictIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_verdict',
      nullityVerdict.slice(0, 5),
      `Settlement existential absolute nullity verdict (index ${existentialAbsoluteNullityVerdictOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityVerdictOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const singularityNexus = op10mA11RegionsWithCollapseSingularityNexus(collapseTotalSingularityNexusOut.rows);
  if (
    singularityNexus.length >= 2 ||
    collapseTotalSingularityNexusOut.nationalIndex >= 64 ||
    op10mA11CollapseTotalSingularityNexusEscalating(
      collapseTotalSingularityNexusOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseTotalSingularityNexusIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_total_singularity_nexus',
      singularityNexus.slice(0, 5),
      `Regional collapse total singularity nexus (index ${collapseTotalSingularityNexusOut.nationalIndex.toFixed(1)}).`,
      collapseTotalSingularityNexusOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const erosionTermination = op10mA11RegionsWithAbsoluteErosionTermination(voidAbsoluteErosionTerminationOut.rows);
  if (
    erosionTermination.length >= 2 ||
    voidAbsoluteErosionTerminationOut.nationalIndex >= 63 ||
    op10mA11VoidAbsoluteErosionTerminationEscalating(
      voidAbsoluteErosionTerminationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAbsoluteErosionTerminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_absolute_erosion_termination',
      erosionTermination.slice(0, 5),
      `Interregional void absolute erosion termination (index ${voidAbsoluteErosionTerminationOut.nationalIndex.toFixed(1)}).`,
      voidAbsoluteErosionTerminationOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const nullitySentence = op10mA11RegionsWithTotalFinalNullitySentence(existentialFinalNullitySentenceOut.rows);
  if (
    nullitySentence.length >= 2 ||
    existentialFinalNullitySentenceOut.nationalIndex >= 66 ||
    op10mA11ExistentialFinalNullitySentenceEscalating(
      existentialFinalNullitySentenceOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullitySentenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_sentence',
      nullitySentence.slice(0, 5),
      `Settlement existential final nullity sentence (index ${existentialFinalNullitySentenceOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullitySentenceOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const singularityCulmination = op10mA11RegionsWithCollapseSingularityCulmination(
    collapseAbsoluteSingularityCulminationOut.rows,
  );
  if (
    singularityCulmination.length >= 2 ||
    collapseAbsoluteSingularityCulminationOut.nationalIndex >= 65 ||
    op10mA11CollapseAbsoluteSingularityCulminationEscalating(
      collapseAbsoluteSingularityCulminationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseAbsoluteSingularityCulminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_absolute_singularity_culmination',
      singularityCulmination.slice(0, 5),
      `Regional collapse absolute singularity culmination (index ${collapseAbsoluteSingularityCulminationOut.nationalIndex.toFixed(1)}).`,
      collapseAbsoluteSingularityCulminationOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const erosionExtinction = op10mA11RegionsWithCompleteErosionExtinction(voidCompleteErosionExtinctionOut.rows);
  if (
    erosionExtinction.length >= 2 ||
    voidCompleteErosionExtinctionOut.nationalIndex >= 64 ||
    op10mA11VoidCompleteErosionExtinctionEscalating(
      voidCompleteErosionExtinctionOut.nationalIndex,
      base.revision > 0 ? base.lastVoidCompleteErosionExtinctionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_complete_erosion_extinction',
      erosionExtinction.slice(0, 5),
      `Interregional void complete erosion extinction (index ${voidCompleteErosionExtinctionOut.nationalIndex.toFixed(1)}).`,
      voidCompleteErosionExtinctionOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const nullityDecree = op10mA11RegionsWithTotalNullityDecree(existentialTotalNullityDecreeOut.rows);
  if (
    nullityDecree.length >= 2 ||
    existentialTotalNullityDecreeOut.nationalIndex >= 67 ||
    op10mA11ExistentialTotalNullityDecreeEscalating(
      existentialTotalNullityDecreeOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialTotalNullityDecreeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_total_nullity_decree',
      nullityDecree.slice(0, 5),
      `Settlement existential total nullity decree (index ${existentialTotalNullityDecreeOut.nationalIndex.toFixed(1)}).`,
      existentialTotalNullityDecreeOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const singularitySynthesis = op10mA11RegionsWithCollapseSingularitySynthesis(
    collapseOmniSingularitySynthesisOut.rows,
  );
  if (
    singularitySynthesis.length >= 2 ||
    collapseOmniSingularitySynthesisOut.nationalIndex >= 66 ||
    op10mA11CollapseOmniSingularitySynthesisEscalating(
      collapseOmniSingularitySynthesisOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularitySynthesisIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_synthesis',
      singularitySynthesis.slice(0, 5),
      `Regional collapse omni singularity synthesis (index ${collapseOmniSingularitySynthesisOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularitySynthesisOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const erosionAnnihilation = op10mA11RegionsWithTotalErosionAnnihilation(voidTotalErosionAnnihilationOut.rows);
  if (
    erosionAnnihilation.length >= 2 ||
    voidTotalErosionAnnihilationOut.nationalIndex >= 65 ||
    op10mA11VoidTotalErosionAnnihilationEscalating(
      voidTotalErosionAnnihilationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionAnnihilationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_annihilation',
      erosionAnnihilation.slice(0, 5),
      `Interregional void total erosion annihilation (index ${voidTotalErosionAnnihilationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionAnnihilationOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const nullityMandate = op10mA11RegionsWithTotalAbsoluteNullityMandate(existentialAbsoluteNullityMandateOut.rows);
  if (
    nullityMandate.length >= 2 ||
    existentialAbsoluteNullityMandateOut.nationalIndex >= 68 ||
    op10mA11ExistentialAbsoluteNullityMandateEscalating(
      existentialAbsoluteNullityMandateOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityMandateIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_mandate',
      nullityMandate.slice(0, 5),
      `Settlement existential absolute nullity mandate (index ${existentialAbsoluteNullityMandateOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityMandateOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const singularityConvergence = op10mA11RegionsWithCollapseSingularityConvergence(
    collapseOmniSingularityConvergenceOut.rows,
  );
  if (
    singularityConvergence.length >= 2 ||
    collapseOmniSingularityConvergenceOut.nationalIndex >= 67 ||
    op10mA11CollapseOmniSingularityConvergenceEscalating(
      collapseOmniSingularityConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_convergence',
      singularityConvergence.slice(0, 5),
      `Regional collapse omni singularity convergence (index ${collapseOmniSingularityConvergenceOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityConvergenceOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const erosionObliteration = op10mA11RegionsWithTotalErosionObliteration(voidTotalErosionObliterationOut.rows);
  if (
    erosionObliteration.length >= 2 ||
    voidTotalErosionObliterationOut.nationalIndex >= 66 ||
    op10mA11VoidTotalErosionObliterationEscalating(
      voidTotalErosionObliterationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionObliterationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_obliteration',
      erosionObliteration.slice(0, 5),
      `Interregional void total erosion obliteration (index ${voidTotalErosionObliterationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionObliterationOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const nullityBinding = op10mA11RegionsWithTotalAbsoluteNullityBinding(existentialAbsoluteNullityBindingOut.rows);
  if (
    nullityBinding.length >= 2 ||
    existentialAbsoluteNullityBindingOut.nationalIndex >= 69 ||
    op10mA11ExistentialAbsoluteNullityBindingEscalating(
      existentialAbsoluteNullityBindingOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityBindingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_binding',
      nullityBinding.slice(0, 5),
      `Settlement existential absolute nullity binding (index ${existentialAbsoluteNullityBindingOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityBindingOut.nationalIndex >= 79 ? 'major' : 'meaningful',
    );
  }

  const singularityIntegration = op10mA11RegionsWithCollapseSingularityIntegration(
    collapseOmniSingularityIntegrationOut.rows,
  );
  if (
    singularityIntegration.length >= 2 ||
    collapseOmniSingularityIntegrationOut.nationalIndex >= 68 ||
    op10mA11CollapseOmniSingularityIntegrationEscalating(
      collapseOmniSingularityIntegrationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityIntegrationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_integration',
      singularityIntegration.slice(0, 5),
      `Regional collapse omni singularity integration (index ${collapseOmniSingularityIntegrationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityIntegrationOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const erosionEradication = op10mA11RegionsWithTotalErosionEradication(voidTotalErosionEradicationOut.rows);
  if (
    erosionEradication.length >= 2 ||
    voidTotalErosionEradicationOut.nationalIndex >= 67 ||
    op10mA11VoidTotalErosionEradicationEscalating(
      voidTotalErosionEradicationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionEradicationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_eradication',
      erosionEradication.slice(0, 5),
      `Interregional void total erosion eradication (index ${voidTotalErosionEradicationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionEradicationOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const nullityContinuity = op10mA11RegionsWithTotalAbsoluteNullityContinuity(existentialAbsoluteNullityContinuityOut.rows);
  if (
    nullityContinuity.length >= 2 ||
    existentialAbsoluteNullityContinuityOut.nationalIndex >= 70 ||
    op10mA11ExistentialAbsoluteNullityContinuityEscalating(
      existentialAbsoluteNullityContinuityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityContinuityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_continuity',
      nullityContinuity.slice(0, 5),
      `Settlement existential absolute nullity continuity (index ${existentialAbsoluteNullityContinuityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityContinuityOut.nationalIndex >= 80 ? 'major' : 'meaningful',
    );
  }

  const singularityUnification = op10mA11RegionsWithCollapseSingularityUnification(
    collapseOmniSingularityUnificationOut.rows,
  );
  if (
    singularityUnification.length >= 2 ||
    collapseOmniSingularityUnificationOut.nationalIndex >= 69 ||
    op10mA11CollapseOmniSingularityUnificationEscalating(
      collapseOmniSingularityUnificationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityUnificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_unification',
      singularityUnification.slice(0, 5),
      `Regional collapse omni singularity unification (index ${collapseOmniSingularityUnificationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityUnificationOut.nationalIndex >= 79 ? 'major' : 'meaningful',
    );
  }

  const erosionElimination = op10mA11RegionsWithTotalErosionElimination(voidTotalErosionEliminationOut.rows);
  if (
    erosionElimination.length >= 2 ||
    voidTotalErosionEliminationOut.nationalIndex >= 68 ||
    op10mA11VoidTotalErosionEliminationEscalating(
      voidTotalErosionEliminationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionEliminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_elimination',
      erosionElimination.slice(0, 5),
      `Interregional void total erosion elimination (index ${voidTotalErosionEliminationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionEliminationOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const nullityPerpetuity = op10mA11RegionsWithTotalAbsoluteNullityPerpetuity(existentialAbsoluteNullityPerpetuityOut.rows);
  if (
    nullityPerpetuity.length >= 2 ||
    existentialAbsoluteNullityPerpetuityOut.nationalIndex >= 71 ||
    op10mA11ExistentialAbsoluteNullityPerpetuityEscalating(
      existentialAbsoluteNullityPerpetuityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityPerpetuityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_perpetuity',
      nullityPerpetuity.slice(0, 5),
      `Settlement existential absolute nullity perpetuity (index ${existentialAbsoluteNullityPerpetuityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityPerpetuityOut.nationalIndex >= 81 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;
  base.urban = urbanOut.persisted;
  base.infra = infraOut.persisted;
  base.lastFragilityIndex = fragilityIndex;
  base.lastMaxCorridorFlow = maxCorridorFlow;
  base.lastCohesionIndex = regionalCohesionIndex;
  base.lastStandingSpread = standingSpread;
  base.lastServiceEquityIndex = serviceEquityOut.nationalIndex;
  base.lastInfrastructureBacklogIndex = backlogOut.nationalIndex;
  base.lastGovernanceFrictionIndex = governanceOut.nationalIndex;
  base.lastHousingSpilloverIndex = housingSpilloverOut.nationalIndex;
  base.lastClimateDisplacementIndex = climateOut.nationalIndex;
  base.lastAmenityCostIndex = amenityOut.nationalIndex;
  base.lastRelocationBurdenIndex = relocationOut.nationalIndex;
  base.lastEmploymentAnchorIndex = employmentAnchorOut.nationalIndex;
  base.lastCommuteWedgeIndex = commuteWedgeOut.nationalIndex;
  base.lastReceptionStrainIndex = receptionStrainOut.nationalIndex;
  base.lastLandUseGridlockIndex = landUseGridlockOut.nationalIndex;
  base.lastMobilityTrapIndex = mobilityTrapOut.nationalIndex;
  base.lastAbsorptionGapIndex = absorptionGapOut.nationalIndex;
  base.lastReliefOverheadIndex = reliefOverheadOut.nationalIndex;
  base.lastCorridorEquityDriftIndex = corridorEquityDriftOut.nationalIndex;
  base.lastClimateAdaptationLagIndex = climateAdaptationLagOut.nationalIndex;
  base.lastFiscalCapacityStrainIndex = fiscalCapacityStrainOut.nationalIndex;
  base.lastNetworkResilienceErosionIndex = networkErosionOut.nationalIndex;
  base.lastLongHorizonCapacityRiskIndex = longHorizonRiskOut.nationalIndex;
  base.lastCohesionIntegrityIndex = cohesionIntegrityOut.nationalIndex;
  base.lastReliefEquityGapIndex = reliefEquityGapOut.nationalIndex;
  base.lastSystemicFragilityIndex = systemicFragilityOut.nationalIndex;
  base.lastGovernanceResilienceDecayIndex = governanceResilienceDecayOut.nationalIndex;
  base.lastMigrationStabilityErosionIndex = migrationStabilityErosionOut.nationalIndex;
  base.lastAdaptiveCapacityCeilingIndex = adaptiveCapacityCeilingOut.nationalIndex;
  base.lastFiscalGovernanceCouplingIndex = fiscalGovernanceCouplingOut.nationalIndex;
  base.lastNetworkEquityTensionIndex = networkEquityTensionOut.nationalIndex;
  base.lastResilienceFrontierIndex = resilienceFrontierOut.nationalIndex;
  base.lastMetaGovernanceFatigueIndex = metaGovernanceFatigueOut.nationalIndex;
  base.lastCapitalMobilityAsymmetryIndex = capitalMobilityAsymmetryOut.nationalIndex;
  base.lastCompoundShockSaturationIndex = compoundShockSaturationOut.nationalIndex;
  base.lastInstitutionalTrustErosionIndex = institutionalTrustErosionOut.nationalIndex;
  base.lastLiquidityFragmentationIndex = liquidityFragmentationOut.nationalIndex;
  base.lastCascadingFailureRiskIndex = cascadingFailureRiskOut.nationalIndex;
  base.lastSocialContractFragilityIndex = socialContractFragilityOut.nationalIndex;
  base.lastCapitalFlightPanicIndex = capitalFlightPanicOut.nationalIndex;
  base.lastIrrecoverableCollapseThresholdIndex = irrecoverableCollapseOut.nationalIndex;
  base.lastSettlementLegitimacyCollapseIndex = settlementLegitimacyCollapseOut.nationalIndex;
  base.lastFiscalPanicContagionIndex = fiscalPanicContagionOut.nationalIndex;
  base.lastTerminalStateLockInIndex = terminalStateLockInOut.nationalIndex;
  base.lastGovernanceVacuumEscalationIndex = governanceVacuumEscalationOut.nationalIndex;
  base.lastSettlementAbandonmentSpiralIndex = settlementAbandonmentSpiralOut.nationalIndex;
  base.lastPostCollapseRecoveryImpossibilityIndex = postCollapseRecoveryImpossibilityOut.nationalIndex;
  base.lastStateCollapseCascadeAmplificationIndex = stateCollapseCascadeAmplificationOut.nationalIndex;
  base.lastHollowRegionContagionIndex = hollowRegionContagionOut.nationalIndex;
  base.lastPermanentDepopulationLockIndex = permanentDepopulationLockOut.nationalIndex;
  base.lastTotalCollapseSingularityIndex = totalCollapseSingularityOut.nationalIndex;
  base.lastVoidExpansionVelocityIndex = voidExpansionVelocityOut.nationalIndex;
  base.lastExistentialContinuityFractureIndex = existentialContinuityFractureOut.nationalIndex;
  base.lastCollapseHorizonConvergenceIndex = collapseHorizonConvergenceOut.nationalIndex;
  base.lastVoidTotalizationSurgeIndex = voidTotalizationSurgeOut.nationalIndex;
  base.lastExistentialTerminusLockIndex = existentialTerminusLockOut.nationalIndex;
  base.lastAbsoluteCollapseHorizonLockIndex = absoluteCollapseHorizonLockOut.nationalIndex;
  base.lastVoidFinalizationCascadeIndex = voidFinalizationCascadeOut.nationalIndex;
  base.lastExistentialObliterationThresholdIndex = existentialObliterationThresholdOut.nationalIndex;
  base.lastUltimateCollapseSingularitySealIndex = ultimateCollapseSingularitySealOut.nationalIndex;
  base.lastVoidAnnihilationConvergenceIndex = voidAnnihilationConvergenceOut.nationalIndex;
  base.lastExistentialNullStateLockIndex = existentialNullStateLockOut.nationalIndex;
  base.lastCollapseExistenceSingularityPointIndex = collapseExistenceSingularityPointOut.nationalIndex;
  base.lastVoidExistenceAnnihilationFrontIndex = voidExistenceAnnihilationFrontOut.nationalIndex;
  base.lastExistentialAbsoluteZeroLockIndex = existentialAbsoluteZeroLockOut.nationalIndex;
  base.lastCollapseOmniSingularityNodeIndex = collapseOmniSingularityNodeOut.nationalIndex;
  base.lastVoidAbsoluteErosionSurgeIndex = voidAbsoluteErosionSurgeOut.nationalIndex;
  base.lastExistentialFinalNullityLockIndex = existentialFinalNullityLockOut.nationalIndex;
  base.lastCollapseTotalSingularityVertexIndex = collapseTotalSingularityVertexOut.nationalIndex;
  base.lastVoidTerminalErosionCascadeIndex = voidTerminalErosionCascadeOut.nationalIndex;
  base.lastExistentialUltimateNullitySealIndex = existentialUltimateNullitySealOut.nationalIndex;
  base.lastCollapseAbsoluteSingularityApexIndex = collapseAbsoluteSingularityApexOut.nationalIndex;
  base.lastVoidCompleteErosionTerminalityIndex = voidCompleteErosionTerminalityOut.nationalIndex;
  base.lastExistentialFinalNullityClosureIndex = existentialFinalNullityClosureOut.nationalIndex;
  base.lastCollapseUltimateSingularityZenithIndex = collapseUltimateSingularityZenithOut.nationalIndex;
  base.lastVoidTotalErosionFinalityIndex = voidTotalErosionFinalityOut.nationalIndex;
  base.lastExistentialAbsoluteNullityVerdictIndex = existentialAbsoluteNullityVerdictOut.nationalIndex;
  base.lastCollapseTotalSingularityNexusIndex = collapseTotalSingularityNexusOut.nationalIndex;
  base.lastVoidAbsoluteErosionTerminationIndex = voidAbsoluteErosionTerminationOut.nationalIndex;
  base.lastExistentialFinalNullitySentenceIndex = existentialFinalNullitySentenceOut.nationalIndex;
  base.lastCollapseAbsoluteSingularityCulminationIndex = collapseAbsoluteSingularityCulminationOut.nationalIndex;
  base.lastVoidCompleteErosionExtinctionIndex = voidCompleteErosionExtinctionOut.nationalIndex;
  base.lastExistentialTotalNullityDecreeIndex = existentialTotalNullityDecreeOut.nationalIndex;
  base.lastCollapseOmniSingularitySynthesisIndex = collapseOmniSingularitySynthesisOut.nationalIndex;
  base.lastVoidTotalErosionAnnihilationIndex = voidTotalErosionAnnihilationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityMandateIndex = existentialAbsoluteNullityMandateOut.nationalIndex;
  base.lastCollapseOmniSingularityConvergenceIndex = collapseOmniSingularityConvergenceOut.nationalIndex;
  base.lastVoidTotalErosionObliterationIndex = voidTotalErosionObliterationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityBindingIndex = existentialAbsoluteNullityBindingOut.nationalIndex;
  base.lastCollapseOmniSingularityIntegrationIndex = collapseOmniSingularityIntegrationOut.nationalIndex;
  base.lastVoidTotalErosionEradicationIndex = voidTotalErosionEradicationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityContinuityIndex = existentialAbsoluteNullityContinuityOut.nationalIndex;
  base.lastCollapseOmniSingularityUnificationIndex = collapseOmniSingularityUnificationOut.nationalIndex;
  base.lastVoidTotalErosionEliminationIndex = voidTotalErosionEliminationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityPerpetuityIndex = existentialAbsoluteNullityPerpetuityOut.nationalIndex;
  base.inputHash = op10mA11HashInputs({
    turn: inputs.urban.turn,
    cityCount: inputs.urban.cities.length,
    regionKeys: 'composite',
    nationalGrowth: `${fragilityIndex}:${nationalPrimateIndex}:${maxCorridorFlow}:${regionalCohesionIndex}:${metropolitanSaturationIndex}:${backlogOut.nationalIndex}:${housingSpilloverOut.nationalIndex}:${climateOut.nationalIndex}:${amenityOut.nationalIndex}:${relocationOut.nationalIndex}:${employmentAnchorOut.nationalIndex}:${commuteWedgeOut.nationalIndex}:${receptionStrainOut.nationalIndex}:${landUseGridlockOut.nationalIndex}:${mobilityTrapOut.nationalIndex}:${absorptionGapOut.nationalIndex}:${reliefOverheadOut.nationalIndex}:${corridorEquityDriftOut.nationalIndex}:${climateAdaptationLagOut.nationalIndex}:${fiscalCapacityStrainOut.nationalIndex}:${networkErosionOut.nationalIndex}:${longHorizonRiskOut.nationalIndex}:${cohesionIntegrityOut.nationalIndex}:${reliefEquityGapOut.nationalIndex}:${systemicFragilityOut.nationalIndex}:${governanceResilienceDecayOut.nationalIndex}:${migrationStabilityErosionOut.nationalIndex}:${adaptiveCapacityCeilingOut.nationalIndex}:${fiscalGovernanceCouplingOut.nationalIndex}:${networkEquityTensionOut.nationalIndex}:${resilienceFrontierOut.nationalIndex}:${metaGovernanceFatigueOut.nationalIndex}:${capitalMobilityAsymmetryOut.nationalIndex}:${compoundShockSaturationOut.nationalIndex}:${institutionalTrustErosionOut.nationalIndex}:${liquidityFragmentationOut.nationalIndex}:${cascadingFailureRiskOut.nationalIndex}:${socialContractFragilityOut.nationalIndex}:${capitalFlightPanicOut.nationalIndex}:${irrecoverableCollapseOut.nationalIndex}:${settlementLegitimacyCollapseOut.nationalIndex}:${fiscalPanicContagionOut.nationalIndex}:${terminalStateLockInOut.nationalIndex}:${governanceVacuumEscalationOut.nationalIndex}:${settlementAbandonmentSpiralOut.nationalIndex}:${postCollapseRecoveryImpossibilityOut.nationalIndex}:${stateCollapseCascadeAmplificationOut.nationalIndex}:${hollowRegionContagionOut.nationalIndex}:${permanentDepopulationLockOut.nationalIndex}:${totalCollapseSingularityOut.nationalIndex}:${voidExpansionVelocityOut.nationalIndex}:${existentialContinuityFractureOut.nationalIndex}:${collapseHorizonConvergenceOut.nationalIndex}:${voidTotalizationSurgeOut.nationalIndex}:${existentialTerminusLockOut.nationalIndex}:${absoluteCollapseHorizonLockOut.nationalIndex}:${voidFinalizationCascadeOut.nationalIndex}:${existentialObliterationThresholdOut.nationalIndex}:${ultimateCollapseSingularitySealOut.nationalIndex}:${voidAnnihilationConvergenceOut.nationalIndex}:${existentialNullStateLockOut.nationalIndex}:${collapseExistenceSingularityPointOut.nationalIndex}:${voidExistenceAnnihilationFrontOut.nationalIndex}:${existentialAbsoluteZeroLockOut.nationalIndex}:${collapseOmniSingularityNodeOut.nationalIndex}:${voidAbsoluteErosionSurgeOut.nationalIndex}:${existentialFinalNullityLockOut.nationalIndex}:${collapseTotalSingularityVertexOut.nationalIndex}:${voidTerminalErosionCascadeOut.nationalIndex}:${existentialUltimateNullitySealOut.nationalIndex}:${collapseAbsoluteSingularityApexOut.nationalIndex}:${voidCompleteErosionTerminalityOut.nationalIndex}:${existentialFinalNullityClosureOut.nationalIndex}:${collapseUltimateSingularityZenithOut.nationalIndex}:${voidTotalErosionFinalityOut.nationalIndex}:${existentialAbsoluteNullityVerdictOut.nationalIndex}:${collapseTotalSingularityNexusOut.nationalIndex}:${voidAbsoluteErosionTerminationOut.nationalIndex}:${existentialFinalNullitySentenceOut.nationalIndex}:${collapseAbsoluteSingularityCulminationOut.nationalIndex}:${voidCompleteErosionExtinctionOut.nationalIndex}:${existentialTotalNullityDecreeOut.nationalIndex}:${collapseOmniSingularitySynthesisOut.nationalIndex}:${voidTotalErosionAnnihilationOut.nationalIndex}:${existentialAbsoluteNullityMandateOut.nationalIndex}:${collapseOmniSingularityConvergenceOut.nationalIndex}:${voidTotalErosionObliterationOut.nationalIndex}:${existentialAbsoluteNullityBindingOut.nationalIndex}:${collapseOmniSingularityIntegrationOut.nationalIndex}:${voidTotalErosionEradicationOut.nationalIndex}:${existentialAbsoluteNullityContinuityOut.nationalIndex}`,
  });

  const state: OP10M_A11_CompositeState = {
    schemaVersion: OP10M_A11_COMPOSITE_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.urban.turn,
    urban: urbanOut.state,
    infra: infraOut.state,
    hierarchy,
    linkages,
    corridorFlows,
    linkageHubs,
    reliefPlaybook,
    fragilityIndex,
    nationalPrimateIndex,
    maxCorridorFlow,
    migrationPressure,
    settlementVulnerability,
    fiscalUrbanCoupling: fiscalOut.rows,
    fiscalUrbanCouplingIndex: fiscalOut.nationalIndex,
    regionalCohesionIndex,
    absorptionStress,
    metropolitanSaturationIndex,
    serviceEquity: serviceEquityOut.rows,
    nationalServiceEquityIndex: serviceEquityOut.nationalIndex,
    convergence,
    periUrbanPressure,
    nationalPeriUrbanPressureIndex,
    infrastructureBacklog: backlogOut.rows,
    nationalInfrastructureBacklogIndex: backlogOut.nationalIndex,
    governanceFriction: governanceOut.rows,
    nationalGovernanceFrictionIndex: governanceOut.nationalIndex,
    housingSpillover: housingSpilloverOut.rows,
    nationalHousingSpilloverIndex: housingSpilloverOut.nationalIndex,
    talentRetention: talentOut.rows,
    nationalTalentDrainIndex: talentOut.nationalIndex,
    climateDisplacement: climateOut.rows,
    nationalClimateDisplacementIndex: climateOut.nationalIndex,
    amenityCost: amenityOut.rows,
    nationalAmenityCostIndex: amenityOut.nationalIndex,
    decentralizationShift: decentralOut.rows,
    nationalDecentralizationIndex: decentralOut.nationalIndex,
    relocationBurden: relocationOut.rows,
    nationalRelocationBurdenIndex: relocationOut.nationalIndex,
    employmentAnchor: employmentAnchorOut.rows,
    nationalEmploymentAnchorIndex: employmentAnchorOut.nationalIndex,
    commuteWedge: commuteWedgeOut.rows,
    nationalCommuteWedgeIndex: commuteWedgeOut.nationalIndex,
    receptionStrain: receptionStrainOut.rows,
    nationalReceptionStrainIndex: receptionStrainOut.nationalIndex,
    landUseGridlock: landUseGridlockOut.rows,
    nationalLandUseGridlockIndex: landUseGridlockOut.nationalIndex,
    mobilityTrap: mobilityTrapOut.rows,
    nationalMobilityTrapIndex: mobilityTrapOut.nationalIndex,
    absorptionGap: absorptionGapOut.rows,
    nationalAbsorptionGapIndex: absorptionGapOut.nationalIndex,
    reliefOverhead: reliefOverheadOut.rows,
    nationalReliefOverheadIndex: reliefOverheadOut.nationalIndex,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    nationalCorridorEquityDriftIndex: corridorEquityDriftOut.nationalIndex,
    climateAdaptationLag: climateAdaptationLagOut.rows,
    nationalClimateAdaptationLagIndex: climateAdaptationLagOut.nationalIndex,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
    nationalFiscalCapacityStrainIndex: fiscalCapacityStrainOut.nationalIndex,
    networkResilienceErosion: networkErosionOut.rows,
    nationalNetworkResilienceErosionIndex: networkErosionOut.nationalIndex,
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
    nationalLongHorizonCapacityRiskIndex: longHorizonRiskOut.nationalIndex,
    cohesionIntegrity: cohesionIntegrityOut.rows,
    nationalCohesionIntegrityIndex: cohesionIntegrityOut.nationalIndex,
    reliefEquityGap: reliefEquityGapOut.rows,
    nationalReliefEquityGapIndex: reliefEquityGapOut.nationalIndex,
    systemicFragility: systemicFragilityOut.rows,
    nationalSystemicFragilityIndex: systemicFragilityOut.nationalIndex,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    nationalGovernanceResilienceDecayIndex: governanceResilienceDecayOut.nationalIndex,
    migrationStabilityErosion: migrationStabilityErosionOut.rows,
    nationalMigrationStabilityErosionIndex: migrationStabilityErosionOut.nationalIndex,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
    nationalAdaptiveCapacityCeilingIndex: adaptiveCapacityCeilingOut.nationalIndex,
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    nationalFiscalGovernanceCouplingIndex: fiscalGovernanceCouplingOut.nationalIndex,
    networkEquityTension: networkEquityTensionOut.rows,
    nationalNetworkEquityTensionIndex: networkEquityTensionOut.nationalIndex,
    resilienceFrontier: resilienceFrontierOut.rows,
    nationalResilienceFrontierIndex: resilienceFrontierOut.nationalIndex,
    metaGovernanceFatigue: metaGovernanceFatigueOut.rows,
    nationalMetaGovernanceFatigueIndex: metaGovernanceFatigueOut.nationalIndex,
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
    nationalCapitalMobilityAsymmetryIndex: capitalMobilityAsymmetryOut.nationalIndex,
    compoundShockSaturation: compoundShockSaturationOut.rows,
    nationalCompoundShockSaturationIndex: compoundShockSaturationOut.nationalIndex,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    nationalInstitutionalTrustErosionIndex: institutionalTrustErosionOut.nationalIndex,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    nationalLiquidityFragmentationIndex: liquidityFragmentationOut.nationalIndex,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    nationalCascadingFailureRiskIndex: cascadingFailureRiskOut.nationalIndex,
    socialContractFragility: socialContractFragilityOut.rows,
    nationalSocialContractFragilityIndex: socialContractFragilityOut.nationalIndex,
    capitalFlightPanic: capitalFlightPanicOut.rows,
    nationalCapitalFlightPanicIndex: capitalFlightPanicOut.nationalIndex,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    nationalIrrecoverableCollapseThresholdIndex: irrecoverableCollapseOut.nationalIndex,
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
    nationalSettlementLegitimacyCollapseIndex: settlementLegitimacyCollapseOut.nationalIndex,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    nationalFiscalPanicContagionIndex: fiscalPanicContagionOut.nationalIndex,
    terminalStateLockIn: terminalStateLockInOut.rows,
    nationalTerminalStateLockInIndex: terminalStateLockInOut.nationalIndex,
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
    nationalGovernanceVacuumEscalationIndex: governanceVacuumEscalationOut.nationalIndex,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    nationalSettlementAbandonmentSpiralIndex: settlementAbandonmentSpiralOut.nationalIndex,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    nationalPostCollapseRecoveryImpossibilityIndex: postCollapseRecoveryImpossibilityOut.nationalIndex,
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
    nationalStateCollapseCascadeAmplificationIndex: stateCollapseCascadeAmplificationOut.nationalIndex,
    hollowRegionContagion: hollowRegionContagionOut.rows,
    nationalHollowRegionContagionIndex: hollowRegionContagionOut.nationalIndex,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
    nationalPermanentDepopulationLockIndex: permanentDepopulationLockOut.nationalIndex,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    nationalTotalCollapseSingularityIndex: totalCollapseSingularityOut.nationalIndex,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    nationalVoidExpansionVelocityIndex: voidExpansionVelocityOut.nationalIndex,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
    nationalExistentialContinuityFractureIndex: existentialContinuityFractureOut.nationalIndex,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    nationalCollapseHorizonConvergenceIndex: collapseHorizonConvergenceOut.nationalIndex,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    nationalVoidTotalizationSurgeIndex: voidTotalizationSurgeOut.nationalIndex,
    existentialTerminusLock: existentialTerminusLockOut.rows,
    nationalExistentialTerminusLockIndex: existentialTerminusLockOut.nationalIndex,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    nationalAbsoluteCollapseHorizonLockIndex: absoluteCollapseHorizonLockOut.nationalIndex,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    nationalVoidFinalizationCascadeIndex: voidFinalizationCascadeOut.nationalIndex,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
    nationalExistentialObliterationThresholdIndex: existentialObliterationThresholdOut.nationalIndex,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    nationalUltimateCollapseSingularitySealIndex: ultimateCollapseSingularitySealOut.nationalIndex,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    nationalVoidAnnihilationConvergenceIndex: voidAnnihilationConvergenceOut.nationalIndex,
    existentialNullStateLock: existentialNullStateLockOut.rows,
    nationalExistentialNullStateLockIndex: existentialNullStateLockOut.nationalIndex,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    nationalCollapseExistenceSingularityPointIndex: collapseExistenceSingularityPointOut.nationalIndex,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    nationalVoidExistenceAnnihilationFrontIndex: voidExistenceAnnihilationFrontOut.nationalIndex,
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
    nationalExistentialAbsoluteZeroLockIndex: existentialAbsoluteZeroLockOut.nationalIndex,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    nationalCollapseOmniSingularityNodeIndex: collapseOmniSingularityNodeOut.nationalIndex,
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    nationalVoidAbsoluteErosionSurgeIndex: voidAbsoluteErosionSurgeOut.nationalIndex,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
    nationalExistentialFinalNullityLockIndex: existentialFinalNullityLockOut.nationalIndex,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    nationalCollapseTotalSingularityVertexIndex: collapseTotalSingularityVertexOut.nationalIndex,
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    nationalVoidTerminalErosionCascadeIndex: voidTerminalErosionCascadeOut.nationalIndex,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
    nationalExistentialUltimateNullitySealIndex: existentialUltimateNullitySealOut.nationalIndex,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    nationalCollapseAbsoluteSingularityApexIndex: collapseAbsoluteSingularityApexOut.nationalIndex,
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    nationalVoidCompleteErosionTerminalityIndex: voidCompleteErosionTerminalityOut.nationalIndex,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
    nationalExistentialFinalNullityClosureIndex: existentialFinalNullityClosureOut.nationalIndex,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    nationalCollapseUltimateSingularityZenithIndex: collapseUltimateSingularityZenithOut.nationalIndex,
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    nationalVoidTotalErosionFinalityIndex: voidTotalErosionFinalityOut.nationalIndex,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
    nationalExistentialAbsoluteNullityVerdictIndex: existentialAbsoluteNullityVerdictOut.nationalIndex,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    nationalCollapseTotalSingularityNexusIndex: collapseTotalSingularityNexusOut.nationalIndex,
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    nationalVoidAbsoluteErosionTerminationIndex: voidAbsoluteErosionTerminationOut.nationalIndex,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
    nationalExistentialFinalNullitySentenceIndex: existentialFinalNullitySentenceOut.nationalIndex,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    nationalCollapseAbsoluteSingularityCulminationIndex: collapseAbsoluteSingularityCulminationOut.nationalIndex,
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    nationalVoidCompleteErosionExtinctionIndex: voidCompleteErosionExtinctionOut.nationalIndex,
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
    nationalExistentialTotalNullityDecreeIndex: existentialTotalNullityDecreeOut.nationalIndex,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    nationalCollapseOmniSingularitySynthesisIndex: collapseOmniSingularitySynthesisOut.nationalIndex,
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    nationalVoidTotalErosionAnnihilationIndex: voidTotalErosionAnnihilationOut.nationalIndex,
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
    nationalExistentialAbsoluteNullityMandateIndex: existentialAbsoluteNullityMandateOut.nationalIndex,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    nationalCollapseOmniSingularityConvergenceIndex: collapseOmniSingularityConvergenceOut.nationalIndex,
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    nationalVoidTotalErosionObliterationIndex: voidTotalErosionObliterationOut.nationalIndex,
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
    nationalExistentialAbsoluteNullityBindingIndex: existentialAbsoluteNullityBindingOut.nationalIndex,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    nationalCollapseOmniSingularityIntegrationIndex: collapseOmniSingularityIntegrationOut.nationalIndex,
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    nationalVoidTotalErosionEradicationIndex: voidTotalErosionEradicationOut.nationalIndex,
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
    nationalExistentialAbsoluteNullityContinuityIndex: existentialAbsoluteNullityContinuityOut.nationalIndex,
    collapseOmniSingularityUnification: collapseOmniSingularityUnificationOut.rows,
    nationalCollapseOmniSingularityUnificationIndex: collapseOmniSingularityUnificationOut.nationalIndex,
    voidTotalErosionElimination: voidTotalErosionEliminationOut.rows,
    nationalVoidTotalErosionEliminationIndex: voidTotalErosionEliminationOut.nationalIndex,
    existentialAbsoluteNullityPerpetuity: existentialAbsoluteNullityPerpetuityOut.rows,
    nationalExistentialAbsoluteNullityPerpetuityIndex: existentialAbsoluteNullityPerpetuityOut.nationalIndex,
    summary: `${urbanOut.state.summary} ${infraOut.state.summary} Fragility ${fragilityIndex}; primate ${nationalPrimateIndex}; peak flow ${maxCorridorFlow}; cohesion ${regionalCohesionIndex}; saturation ${metropolitanSaturationIndex}; service equity ${serviceEquityOut.nationalIndex}; backlog ${backlogOut.nationalIndex}; governance ${governanceOut.nationalIndex}; housing spillover ${housingSpilloverOut.nationalIndex}; talent drain ${talentOut.nationalIndex}; climate displacement ${climateOut.nationalIndex}; amenity cost ${amenityOut.nationalIndex}; decentralization ${decentralOut.nationalIndex}; relocation burden ${relocationOut.nationalIndex}; employment anchor ${employmentAnchorOut.nationalIndex}; commute wedge ${commuteWedgeOut.nationalIndex}; reception strain ${receptionStrainOut.nationalIndex}; land-use gridlock ${landUseGridlockOut.nationalIndex}; mobility trap ${mobilityTrapOut.nationalIndex}; absorption gap ${absorptionGapOut.nationalIndex}; relief overhead ${reliefOverheadOut.nationalIndex}; corridor equity drift ${corridorEquityDriftOut.nationalIndex}; climate adaptation lag ${climateAdaptationLagOut.nationalIndex}; fiscal capacity ${fiscalCapacityStrainOut.nationalIndex}; network erosion ${networkErosionOut.nationalIndex}; horizon risk ${longHorizonRiskOut.nationalIndex}; cohesion integrity ${cohesionIntegrityOut.nationalIndex}; relief equity gap ${reliefEquityGapOut.nationalIndex}; systemic fragility ${systemicFragilityOut.nationalIndex}; governance decay ${governanceResilienceDecayOut.nationalIndex}; migration stability ${migrationStabilityErosionOut.nationalIndex}; adaptive ceiling ${adaptiveCapacityCeilingOut.nationalIndex}; fiscal–governance ${fiscalGovernanceCouplingOut.nationalIndex}; network equity ${networkEquityTensionOut.nationalIndex}; resilience frontier ${resilienceFrontierOut.nationalIndex}; meta-governance fatigue ${metaGovernanceFatigueOut.nationalIndex}; capital mobility ${capitalMobilityAsymmetryOut.nationalIndex}; compound shocks ${compoundShockSaturationOut.nationalIndex}; institutional trust ${institutionalTrustErosionOut.nationalIndex}; liquidity fragmentation ${liquidityFragmentationOut.nationalIndex}; cascade risk ${cascadingFailureRiskOut.nationalIndex}; social contract ${socialContractFragilityOut.nationalIndex}; capital flight ${capitalFlightPanicOut.nationalIndex}; collapse threshold ${irrecoverableCollapseOut.nationalIndex}; legitimacy collapse ${settlementLegitimacyCollapseOut.nationalIndex}; fiscal contagion ${fiscalPanicContagionOut.nationalIndex}; terminal lock-in ${terminalStateLockInOut.nationalIndex}; governance vacuum ${governanceVacuumEscalationOut.nationalIndex}; abandonment spiral ${settlementAbandonmentSpiralOut.nationalIndex}; recovery impossibility ${postCollapseRecoveryImpossibilityOut.nationalIndex}; cascade amplification ${stateCollapseCascadeAmplificationOut.nationalIndex}; hollow contagion ${hollowRegionContagionOut.nationalIndex}; depopulation lock ${permanentDepopulationLockOut.nationalIndex}; collapse singularity ${totalCollapseSingularityOut.nationalIndex}; void expansion ${voidExpansionVelocityOut.nationalIndex}; continuity fracture ${existentialContinuityFractureOut.nationalIndex}; horizon convergence ${collapseHorizonConvergenceOut.nationalIndex}; void totalization ${voidTotalizationSurgeOut.nationalIndex}; terminus lock ${existentialTerminusLockOut.nationalIndex}; absolute horizon lock ${absoluteCollapseHorizonLockOut.nationalIndex}; void finalization ${voidFinalizationCascadeOut.nationalIndex}; obliteration threshold ${existentialObliterationThresholdOut.nationalIndex}; singularity seal ${ultimateCollapseSingularitySealOut.nationalIndex}; void annihilation ${voidAnnihilationConvergenceOut.nationalIndex}; null-state lock ${existentialNullStateLockOut.nationalIndex}; existence point ${collapseExistenceSingularityPointOut.nationalIndex}; void front ${voidExistenceAnnihilationFrontOut.nationalIndex}; absolute zero ${existentialAbsoluteZeroLockOut.nationalIndex}; omni node ${collapseOmniSingularityNodeOut.nationalIndex}; erosion surge ${voidAbsoluteErosionSurgeOut.nationalIndex}; final nullity ${existentialFinalNullityLockOut.nationalIndex}; singularity vertex ${collapseTotalSingularityVertexOut.nationalIndex}; terminal erosion ${voidTerminalErosionCascadeOut.nationalIndex}; ultimate seal ${existentialUltimateNullitySealOut.nationalIndex}; singularity apex ${collapseAbsoluteSingularityApexOut.nationalIndex}; complete terminality ${voidCompleteErosionTerminalityOut.nationalIndex}; nullity closure ${existentialFinalNullityClosureOut.nationalIndex}; singularity zenith ${collapseUltimateSingularityZenithOut.nationalIndex}; total finality ${voidTotalErosionFinalityOut.nationalIndex}; nullity verdict ${existentialAbsoluteNullityVerdictOut.nationalIndex}; singularity nexus ${collapseTotalSingularityNexusOut.nationalIndex}; erosion termination ${voidAbsoluteErosionTerminationOut.nationalIndex}; nullity sentence ${existentialFinalNullitySentenceOut.nationalIndex}; singularity culmination ${collapseAbsoluteSingularityCulminationOut.nationalIndex}; erosion extinction ${voidCompleteErosionExtinctionOut.nationalIndex}; nullity decree ${existentialTotalNullityDecreeOut.nationalIndex}; omni synthesis ${collapseOmniSingularitySynthesisOut.nationalIndex}; erosion annihilation ${voidTotalErosionAnnihilationOut.nationalIndex}; nullity mandate ${existentialAbsoluteNullityMandateOut.nationalIndex}; omni convergence ${collapseOmniSingularityConvergenceOut.nationalIndex}; erosion obliteration ${voidTotalErosionObliterationOut.nationalIndex}; nullity binding ${existentialAbsoluteNullityBindingOut.nationalIndex}; omni integration ${collapseOmniSingularityIntegrationOut.nationalIndex}; erosion eradication ${voidTotalErosionEradicationOut.nationalIndex}; nullity continuity ${existentialAbsoluteNullityContinuityOut.nationalIndex}; omni unification ${collapseOmniSingularityUnificationOut.nationalIndex}; erosion elimination ${voidTotalErosionEliminationOut.nationalIndex}; nullity perpetuity ${existentialAbsoluteNullityPerpetuityOut.nationalIndex}.`,
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_CompositeDerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11c_${inputs.urban.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function buildOP10M_A11_CompositeInputsFromFixtures(
  partial: Partial<OP10M_A11_CompositeInputs> & { turn: number },
): OP10M_A11_CompositeInputs {
  return {
    urban: buildOP10M_A11_InputsFromFixtures({ turn: partial.turn, ...partial.urban }),
    infra: buildOP10M_A11_InfraInputsFromFixtures({ turn: partial.turn, ...partial.infra }),
  };
}
